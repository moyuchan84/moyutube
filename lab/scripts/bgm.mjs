// 배경음악 + 효과음을 코드로 합성해 audio/<이름>.wav 를 만든다 (음원 파일 · 외부 서비스 없음).
//   node scripts/bgm.mjs mulSwap            ← audio/mulSwap.cues.json 의 길이 · 큐를 읽어 만든다
//   node scripts/bgm.mjs mulSwap --silent   ← 큐가 아직 없을 때 자리만 잡는 무음 파일 (60초)
// 큐 파일은 편집기(npx vite)에서 장면을 한 번 열면 저절로 생긴다 (vite.config.ts 의 cueSink).
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const name = process.argv[2];
if (!name) {
  console.error('사용법: node scripts/bgm.mjs <장면이름> [--silent]');
  process.exit(1);
}
const outFile = path.resolve('audio', `${name}.wav`);
fs.mkdirSync('audio', {recursive: true});

function writeWav(file, L, R) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}

if (process.argv.includes('--silent')) {
  const n = SR * 60;
  writeWav(outFile, new Float32Array(n), new Float32Array(n));
  console.log('무음 자리 파일:', path.relative(process.cwd(), outFile));
  process.exit(0);
}

const cueFile = path.resolve('audio', `${name}.cues.json`);
if (!fs.existsSync(cueFile)) {
  console.error(`${path.relative(process.cwd(), cueFile)} 가 없다 — 편집기에서 장면을 먼저 열어 둘 것`);
  process.exit(1);
}
const {duration, cues} = JSON.parse(fs.readFileSync(cueFile, 'utf8'));
const LEN = Math.ceil((duration + 0.2) * SR);
const mL = new Float32Array(LEN);
const mR = new Float32Array(LEN);
const sL = new Float32Array(LEN);
const sR = new Float32Array(LEN);

// 결정적 잡음
let seed = 0x5eed ^ name.length * 7919;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;

function add(L, R, start, data, gain = 1, pan = 0) {
  const s0 = Math.round(start * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < data.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= LEN) continue;
    L[j] += data[i] * gl;
    R[j] += data[i] * gr;
  }
}

/* ── 음악 ── 120 BPM, 한 마디 2초, Fmaj9 · G6/9 · Am7 · Cmaj7/E 순환 */
const BEAT = 0.5;
const BAR = 2;
const CHORDS = [
  {root: 41, notes: [53, 57, 60, 64, 67]},
  {root: 43, notes: [55, 59, 62, 64, 69]},
  {root: 45, notes: [57, 60, 64, 67, 71]},
  {root: 40, notes: [52, 55, 59, 60, 64]},
];
const drumsOn = t => t >= BAR - 0.01 && t < duration - 2.2;

// 사이드체인: 킥이 칠 때 음악을 살짝 눌렀다 놓는다
const kickTimes = [];
for (let t = 0; t < duration; t += BEAT) {
  const beatInBar = Math.round((t % BAR) / BEAT);
  if (drumsOn(t) && (beatInBar === 0 || beatInBar === 2)) kickTimes.push(t);
  if (drumsOn(t) && beatInBar === 2) kickTimes.push(t + 0.75);
}
kickTimes.sort((a, b) => a - b);
const duck = new Float32Array(LEN).fill(1);
for (const tk of kickTimes) {
  const s0 = Math.round(tk * SR);
  for (let i = 0; i < SR * 0.4; i++) {
    const j = s0 + i;
    if (j >= LEN) break;
    duck[j] = Math.min(duck[j], 1 - 0.45 * Math.exp(-i / (SR * 0.09)));
  }
}

// 패드: 살짝 어긋난 톱니파 둘 + 2단 저역통과
function padNote(freq, dur) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let p1 = rnd(), p2 = rnd(), lp1 = 0, lp2 = 0;
  const a = 1 - Math.exp((-TAU * 900) / SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p1 = (p1 + (freq * 1.004) / SR) % 1;
    p2 = (p2 + (freq * 0.996) / SR) % 1;
    const x = (p1 * 2 - 1) + (p2 * 2 - 1);
    lp1 += a * (x - lp1);
    lp2 += a * (lp1 - lp2);
    const env = Math.min(1, t / 0.35) * Math.min(1, (dur - t) / 0.6);
    out[i] = lp2 * env;
  }
  return out;
}

// 플럭: 사인 + 2배음, 빠른 감쇠
function pluck(freq, dur = 0.4) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t / 0.11) * Math.min(1, t / 0.003);
    out[i] = (Math.sin(TAU * freq * t) + 0.35 * Math.sin(TAU * freq * 2 * t) * Math.exp(-t / 0.04)) * env;
  }
  return out;
}

function kick() {
  const n = Math.round(0.35 * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 45 + 95 * Math.exp(-t / 0.03);
    ph += (TAU * f) / SR;
    out[i] = Math.tanh(1.6 * Math.sin(ph) * Math.exp(-t / 0.12)) + 0.15 * noise() * Math.exp(-t / 0.004);
  }
  return out;
}

function clap() {
  const n = Math.round(0.25 * SR);
  const out = new Float32Array(n);
  let hp = 0, prev = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = noise();
    hp = 0.85 * (hp + x - prev);
    prev = x;
    bp += 0.35 * (hp - bp);
    const burst = t < 0.02 ? 0.6 + 0.4 * Math.sin(t * 900) : 1;
    out[i] = bp * Math.exp(-t / 0.07) * burst;
  }
  return out;
}

function hat(open = false) {
  const n = Math.round((open ? 0.18 : 0.05) * SR);
  const out = new Float32Array(n);
  let hp = 0, prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = noise();
    hp = 0.6 * (hp + x - prev);
    prev = x;
    out[i] = hp * Math.exp(-t / (open ? 0.06 : 0.015));
  }
  return out;
}

// 서브 베이스: 8분음표마다 부풀었다 줄어드는 펌핑
function bassBar(rootMidi, dur) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const f = mtof(rootMidi);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const k = (t % (BEAT / 2)) / (BEAT / 2);
    const env = Math.min(1, k / 0.35) * (1 - 0.3 * k);
    out[i] = Math.tanh(1.3 * Math.sin(TAU * f * t)) * env;
  }
  return out;
}

const bars = Math.ceil(duration / BAR) + 1;
for (let b = 0; b < bars; b++) {
  const t0 = b * BAR;
  if (t0 > duration) break;
  const ch = CHORDS[b % 4];
  ch.notes.forEach((m, k) => add(mL, mR, t0, padNote(mtof(m), BAR + 0.6), 0.032, (k - 2) * 0.3));
  if (drumsOn(t0)) add(mL, mR, t0, bassBar(ch.root, BAR), 0.16);
  // 16분 아르페지오 (첫 마디는 반만)
  const pat = [0, 2, 4, 3, 1, 3, 4, 2];
  for (let s = 0; s < 16; s++) {
    const t = t0 + s * (BEAT / 4);
    if (t > duration - 1.2) break;
    if (b === 0 && s % 2 === 1) continue;
    const m = ch.notes[pat[s % 8]] + 12;
    const g = 0.055 * (s % 4 === 0 ? 1 : 0.7);
    const pan = s % 2 ? 0.35 : -0.35;
    const p = pluck(mtof(m));
    add(mL, mR, t, p, g, pan);
    add(mL, mR, t + 0.375, p, g * 0.32, -pan); // 핑퐁 메아리
    add(mL, mR, t + 0.75, p, g * 0.12, pan);
  }
}
for (const tk of kickTimes) add(mL, mR, tk, kick(), 0.42);
for (let t = 0; t < duration; t += BEAT) {
  if (!drumsOn(t)) continue;
  const beatInBar = Math.round((t % BAR) / BEAT);
  if (beatInBar === 1 || beatInBar === 3) add(mL, mR, t, clap(), 0.2, 0.05);
  add(mL, mR, t + BEAT / 2, hat(beatInBar === 3), 0.09, 0.25);
  add(mL, mR, t, hat(), 0.04, -0.25);
}
// 끝: 드럼이 빠진 뒤 마지막 화음 한 번 길게
{
  const tEnd = Math.max(0, duration - 2.2);
  const ch = CHORDS[0];
  ch.notes.forEach((m, k) => add(mL, mR, tEnd, padNote(mtof(m + 12), 2.4), 0.02, (k - 2) * 0.35));
}
// 들려줄 소리(셰퍼드 톤 · 음계)가 나오는 동안은 음악을 거의 끈다
const SCALE_N = 12;
const SCALE_STEP = 0.4;
const quiet = [];
{
  let on = null;
  for (const {t, kind} of cues) {
    if (kind === 'shepOn') on = t;
    if (kind === 'shepOff' && on !== null) {
      quiet.push([on, t]);
      on = null;
    }
    if (kind === 'scaleOn') quiet.push([t, t + (SCALE_N + 1) * SCALE_STEP + 0.3]);
  }
}
const quietGain = t => {
  let g = 1;
  for (const [a, b] of quiet) {
    const k = Math.min(Math.max(0, (t - (a - 0.3)) / 0.3), Math.max(0, ((b + 0.4) - t) / 0.4), 1);
    g = Math.min(g, 1 - 0.9 * k);
  }
  return g;
};
for (let i = 0; i < LEN; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.4) * Math.min(1, Math.max(0, (duration - t) / 1.4));
  const q = quiet.length ? quietGain(t) : 1;
  mL[i] *= duck[i] * fade * q;
  mR[i] *= duck[i] * fade * q;
}

/* ── 셰퍼드 톤: 한 옥타브씩 떨어진 사인파 여럿, 세기는 가운데 음높이에서 가장 크고 위·아래로 갈수록 작다 ──
   0.5초마다 반음씩 올라간다. 12번 오르면 처음과 똑같은 소리 */
const SHEP_STEP = 0.5;
function shepTone(step, dur = 0.46) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const s = ((step % 12) + 12) % 12;
  const comps = [];
  for (let k = 0; k < 9; k++) {
    const oct = k + s / 12; // C1 에서 몇 옥타브 위
    const f = 32.703 * Math.pow(2, oct);
    const a = Math.exp(-Math.pow((oct - 4.5) / 1.3, 2) / 2);
    comps.push([f, a]);
  }
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * Math.min(1, (dur - t) / 0.06);
    let x = 0;
    for (const [f, a] of comps) x += a * Math.sin(TAU * f * t);
    out[i] = (x / 2.2) * env;
  }
  return out;
}
// 보통 음계: C4 부터 반음씩 12번 (끝이 있는 계단)
function scaleNote(m, dur = SCALE_STEP - 0.04) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const f = mtof(m);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * Math.min(1, (dur - t) / 0.06);
    out[i] = (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * 0.6 * env;
  }
  return out;
}
{
  let on = null;
  for (const {t, kind} of cues) {
    if (kind === 'shepOn') on = t;
    if (kind === 'shepOff' && on !== null) {
      let k = 0;
      for (let tt = on; tt < t - 0.05; tt += SHEP_STEP, k++) add(mL, mR, tt, shepTone(k), 0.34);
      on = null;
    }
    if (kind === 'scaleOn') for (let k = 0; k <= SCALE_N; k++) add(mL, mR, t + k * SCALE_STEP, scaleNote(60 + k), 0.3);
  }
}

/* ── 효과음 ── */
function whoosh(dur = 0.55, f0 = 300, f1 = 3200) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const k = t / dur;
    const f = f0 * Math.pow(f1 / f0, Math.sin(k * Math.PI * 0.5));
    const a = 1 - Math.exp((-TAU * f) / SR);
    lp += a * (noise() - lp);
    bp += a * (lp - bp);
    out[i] = (lp - bp) * 2.2 * Math.pow(Math.sin(k * Math.PI), 1.6);
  }
  return out;
}
function pop() {
  const n = Math.round(0.12 * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * (380 + 900 * Math.exp(-t / 0.018))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.035);
  }
  return out;
}
function tick() {
  const n = Math.round(0.04 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(TAU * 2400 * t) * 0.7 + noise() * 0.3) * Math.exp(-t / 0.008);
  }
  return out;
}
function boom() {
  const n = Math.round(1.2 * SR);
  const out = new Float32Array(n);
  let ph = 0, lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * (34 + 70 * Math.exp(-t / 0.08))) / SR;
    lp += 0.04 * (noise() - lp);
    out[i] = Math.tanh(1.8 * Math.sin(ph) * Math.exp(-t / 0.4)) + lp * 2.5 * Math.exp(-t / 0.15);
  }
  return out;
}
function chime() {
  const n = Math.round(1.8 * SR);
  const out = new Float32Array(n);
  const fs_ = [mtof(84), mtof(88), mtof(91), mtof(96)];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let x = 0;
    fs_.forEach((f, k) => {
      x += Math.sin(TAU * f * t + k) * Math.exp(-t / (0.9 - k * 0.15)) * Math.min(1, t / (0.004 + k * 0.05));
      x += 0.25 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.12);
    });
    out[i] = x / 3;
  }
  return out;
}
function riser(dur = 1.1) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let ph = 0, lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const k = t / dur;
    ph += (TAU * (200 + 1400 * k * k)) / SR;
    const a = 1 - Math.exp((-TAU * (400 + 6000 * k * k)) / SR);
    lp += a * (noise() - lp);
    out[i] = (0.35 * Math.sin(ph) + lp) * k * k;
  }
  return out;
}
function typeKey() {
  const n = Math.round(0.03 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (noise() * 0.6 + Math.sin(TAU * 1800 * t) * 0.4) * Math.exp(-t / 0.006);
  }
  return out;
}

let pi = 0;
for (const {t, kind} of cues) {
  const pan = [-0.25, 0.1, 0.3, -0.1][pi++ % 4];
  switch (kind) {
    case 'whoosh':
      add(sL, sR, t - 0.15, whoosh(0.6), 0.32, pan);
      break;
    case 'swish':
      add(sL, sR, t - 0.05, whoosh(0.35, 800, 5000), 0.2, pan);
      break;
    case 'wipe':
      add(sL, sR, t, whoosh(0.9, 200, 4500), 0.42, -0.4);
      add(sL, sR, t + 0.3, whoosh(0.7, 3000, 400), 0.25, 0.4);
      break;
    case 'pop':
      add(sL, sR, t, pop(), 0.3, pan);
      break;
    case 'tick':
      add(sL, sR, t, tick(), 0.16, pan);
      break;
    case 'type':
      add(sL, sR, t, typeKey(), 0.18, pan);
      break;
    case 'boom':
      add(sL, sR, t, boom(), 0.5);
      break;
    case 'chime':
      add(sL, sR, t, chime(), 0.28);
      break;
    case 'riser':
      add(sL, sR, t - 1.1, riser(1.1), 0.26);
      break;
  }
}

// 합치기 · 부드러운 제한 · -1 dBFS 로 맞추기
const L = new Float32Array(LEN);
const R = new Float32Array(LEN);
let peak = 0;
for (let i = 0; i < LEN; i++) {
  L[i] = Math.tanh(0.9 * (mL[i] + sL[i]));
  R[i] = Math.tanh(0.9 * (mR[i] + sR[i]));
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / (peak || 1);
for (let i = 0; i < LEN; i++) {
  L[i] *= norm;
  R[i] *= norm;
}
writeWav(outFile, L, R);
console.log(`${path.relative(process.cwd(), outFile)} — ${duration.toFixed(2)}초, 효과음 ${cues.length}개`);
