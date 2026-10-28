// 「마술의 비밀」 배경음악 + 효과음을 코드로 합성해 audio/<이름>.wav 를 만든다 (음원 파일 · 외부 서비스 없음).
//   node scripts/bgm-magic.mjs magicBoard            ← audio/magicBoard.cues.json 의 길이 · 큐를 읽어 만든다
//   node scripts/bgm-magic.mjs magicBoard --silent   ← 큐가 아직 없을 때 자리만 잡는 무음 파일 (60초)
//
// 과학 편 bgm.mjs(밝은 120BPM 한 곡 반복)와 달리, 장면이 부르는 큐로 곡의 구간이 바뀐다:
//   m:intro  신비한 시작 — 낮은 지속음 · 첼레스타 선율 · 하프 글리산도
//   m:build  따라 하기 — 피치카토 8분 반복 · 탐탐, 필터가 점점 열린다
//   m:hush   기억하기 — 음악을 거의 빼고 심장 소리 · 높은 반짝임
//   roll→hit 드럼롤이 커지다가 "쾅" (D장조 화음 · 심벌 · 하프)
//   m:groove 비밀 풀이 — 장난스러운 단조 스윙 (걷는 베이스 · 핑거스냅 · 셰이커 · 첼레스타)
//   m:outro  D장조로 끝맺음
// 박자는 100 BPM (src/magic.tsx 의 BPM 과 같다). 화음은 Dm · B♭ · Gm · A7 반복 (D 화성단음계).
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const name = process.argv[2];
if (!name) {
  console.error('사용법: node scripts/bgm-magic.mjs <장면이름> [--silent]');
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
const LEN = Math.ceil((duration + 0.3) * SR);

// 버스: 음악 · 효과음 · 잔향 보내기
const mL = new Float32Array(LEN), mR = new Float32Array(LEN);
const sL = new Float32Array(LEN), sR = new Float32Array(LEN);
const rvIn = new Float32Array(LEN); // 잔향으로 보내는 양 (모노로 모아서 스테레오로 퍼뜨린다)

// 결정적 잡음 (다시 돌려도 똑같은 wav)
let seed = 0x6a91c ^ (name.length * 7919);
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;

function add(L, R, start, data, gain = 1, pan = 0, send = 0) {
  const s0 = Math.round(start * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < data.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= LEN) continue;
    L[j] += data[i] * gl;
    R[j] += data[i] * gr;
    if (send) rvIn[j] += data[i] * gain * send;
  }
}
const music = (t, data, gain, pan = 0, send = 0.25) => add(mL, mR, t, data, gain, pan, send);
const sfx = (t, data, gain, pan = 0, send = 0.15) => add(sL, sR, t, data, gain, pan, send);

/* ── 박자 · 화음 · 구간 ── */
const BPM = 100;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const CHORDS = [
  {root: 38, pad: [50, 53, 57, 62], tones: [62, 65, 69]}, // Dm
  {root: 34, pad: [46, 50, 53, 58], tones: [58, 62, 65]}, // B♭
  {root: 31, pad: [43, 50, 55, 58], tones: [55, 58, 62]}, // Gm
  {root: 33, pad: [45, 49, 52, 55], tones: [57, 61, 64]}, // A7
];
const chordAt = t => CHORDS[Math.floor(t / BAR + 1e-6) % 4];

const sections = cues.filter(c => c.kind.startsWith('m:')).map(c => ({t: c.t, s: c.kind.slice(2)}));
if (!sections.length || sections[0].t > 0.05) sections.unshift({t: 0, s: 'intro'});
const sectionAt = t => {
  let s = sections[0];
  for (const x of sections) if (x.t <= t + 1e-4) s = x;
  return s;
};
const sectionEnd = sec => {
  const k = sections.indexOf(sec);
  return k + 1 < sections.length ? sections[k + 1].t : duration;
};
const rolls = [];
{
  let on = null;
  for (const c of cues) {
    if (c.kind === 'roll') on = c.t;
    if (c.kind === 'hit') {
      rolls.push({from: on ?? c.t - BAR, to: c.t});
      on = null;
    }
  }
}
const inRoll = t => rolls.some(r => t >= r.from - 0.05 && t < r.to);

/* ── 악기 ── */

// 카플러스-스트롱 현: 피치카토(짧게) · 하프(길게)
function pluckString(freq, dur, decay = 0.996, bright = 0.5) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const P = Math.max(2, Math.round(SR / freq));
  const buf = new Float32Array(P);
  let lp = 0;
  for (let i = 0; i < P; i++) {
    lp += bright * (noise() - lp);
    buf[i] = lp;
  }
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const a = buf[idx];
    const b = buf[(idx + 1) % P];
    buf[idx] = decay * (0.5 * (a + b));
    out[i] = a * Math.min(1, (n - i) / (SR * 0.02));
    idx = (idx + 1) % P;
  }
  return out;
}
const pizz = (m, dur = 0.28) => pluckString(mtof(m), dur, 0.982, 0.65);
const harp = (m, dur = 2.2) => pluckString(mtof(m), dur, 0.9975, 0.45);

// 첼레스타 · 오르골: 사인 + 높은 배음, 맑게 사라짐
function bell(freq, dur = 1.6) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const parts = [
    [1, 1, 0.9],
    [2, 0.35, 0.45],
    [3.01, 0.12, 0.25],
    [4.16, 0.08, 0.12],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let x = 0;
    for (const [r, a, d] of parts) x += a * Math.sin(TAU * freq * r * t) * Math.exp(-t / d);
    out[i] = x * Math.min(1, t / 0.002) * Math.min(1, (dur - t) / 0.05);
  }
  return out;
}

// 패드: 살짝 어긋난 톱니파 셋 + 2단 저역통과 (cutoff 로 밝기)
function pad(freq, dur, cutoff = 1100, attack = 0.4) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const det = [0.994, 1, 1.006];
  const ph = det.map(() => rnd());
  let l1 = 0, l2 = 0;
  const a = 1 - Math.exp((-TAU * cutoff) / SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let x = 0;
    for (let k = 0; k < 3; k++) {
      ph[k] = (ph[k] + (freq * det[k]) / SR) % 1;
      x += ph[k] * 2 - 1;
    }
    l1 += a * (x - l1);
    l2 += a * (l1 - l2);
    out[i] = l2 * Math.min(1, t / attack) * Math.min(1, (dur - t) / 0.7) * (1 + 0.06 * Math.sin(TAU * 4.5 * t));
  }
  return out;
}

// 떨림 현 (드럼롤 동안 A7 긴장)
function tremolo(freq, dur) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let p = rnd(), l = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p = (p + freq / SR) % 1;
    l += 0.08 * ((p * 2 - 1) - l);
    const k = t / dur;
    out[i] = l * (0.55 + 0.45 * Math.sin(TAU * 14 * t)) * k * k;
  }
  return out;
}

function sine(freq, dur, decay = 0.3, attack = 0.005) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = Math.sin(TAU * freq * t) * Math.exp(-t / decay) * Math.min(1, t / attack);
  }
  return out;
}

function kick() {
  const n = Math.round(0.3 * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * (48 + 80 * Math.exp(-t / 0.025))) / SR;
    out[i] = Math.tanh(1.4 * Math.sin(ph) * Math.exp(-t / 0.11));
  }
  return out;
}
function tom(f0 = 130) {
  const n = Math.round(0.45 * SR);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * (f0 * (0.62 + 0.38 * Math.exp(-t / 0.06)))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.16) + 0.08 * noise() * Math.exp(-t / 0.01);
  }
  return out;
}
function bandNoise(dur, center, q, decay) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  // 상태변수 필터
  let low = 0, band = 0;
  const f = 2 * Math.sin((Math.PI * center) / SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = noise();
    low += f * band;
    const high = x - low - q * band;
    band += f * high;
    out[i] = band * Math.exp(-t / decay);
  }
  return out;
}
const snap = () => {
  const b = bandNoise(0.12, 2300, 0.5, 0.025);
  for (let i = 0; i < 200; i++) b[i] += (1 - i / 200) * (i % 2 ? 0.8 : -0.8);
  return b;
};
const shaker = () => bandNoise(0.07, 7000, 0.9, 0.018);
const snareHit = () => {
  const b = bandNoise(0.09, 1800, 0.8, 0.03);
  const tone = sine(190, 0.09, 0.03);
  for (let i = 0; i < b.length; i++) b[i] += 0.5 * tone[i];
  return b;
};
function crash() {
  const n = Math.round(2.6 * SR);
  const out = new Float32Array(n);
  let prev = 0, hp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = noise();
    hp = 0.92 * (hp + x - prev);
    prev = x;
    out[i] = hp * Math.exp(-t / 0.75) * Math.min(1, t / 0.003);
  }
  return out;
}
function heartbeat() {
  const one = sine(55, 0.22, 0.07, 0.004);
  const two = sine(48, 0.25, 0.08, 0.004);
  const off = Math.round(0.26 * SR);
  const out = new Float32Array(off + two.length);
  for (let i = 0; i < one.length; i++) out[i] += one[i];
  for (let i = 0; i < two.length; i++) out[off + i] += 0.75 * two[i];
  return out;
}
function stab(midis, dur = 1.6) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (const m of midis) {
    const p = pad(mtof(m), dur, 2600, 0.004);
    for (let i = 0; i < n; i++) out[i] += p[i] * Math.exp(-i / SR / 0.5);
  }
  return out;
}

/* ── 효과음 ── */
function whoosh(dur = 0.55, f0 = 300, f1 = 3200) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) {
    const k = i / n;
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
    ph += (TAU * (420 + 1000 * Math.exp(-t / 0.016))) / SR;
    out[i] = Math.sin(ph) * Math.exp(-t / 0.03);
  }
  return out;
}
function woodTick(f = 1700) {
  const n = Math.round(0.06 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * f * 1.48 * t)) * Math.exp(-t / 0.012);
  }
  return out;
}
function boom() {
  const n = Math.round(1.4 * SR);
  const out = new Float32Array(n);
  let ph = 0, lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * (32 + 70 * Math.exp(-t / 0.09))) / SR;
    lp += 0.04 * (noise() - lp);
    out[i] = Math.tanh(1.8 * Math.sin(ph) * Math.exp(-t / 0.45)) + lp * 2.5 * Math.exp(-t / 0.15);
  }
  return out;
}
function scratch() {
  // 레코드 긁는 소리: 띠 잡음의 음높이를 앞뒤로 빠르게 흔든다
  const dur = 0.5;
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let low = 0, band = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const k = t / dur;
    const center = 300 + 2600 * Math.abs(Math.sin(k * Math.PI * 2.5)) * (1 - 0.5 * k);
    const f = 2 * Math.sin((Math.PI * center) / SR);
    low += f * band;
    const high = noise() - low - 0.25 * band;
    band += f * high;
    out[i] = Math.tanh(band * 2.5) * Math.min(1, t / 0.01) * (1 - k);
  }
  return out;
}
function poof() {
  const n = Math.round(0.6 * SR);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const a = 1 - Math.exp((-TAU * (3000 * Math.exp(-t / 0.15) + 200)) / SR);
    lp += a * (noise() - lp);
    out[i] = lp * Math.exp(-t / 0.18) * Math.min(1, t / 0.005);
  }
  return out;
}
function riser(dur = 1.2) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const k = i / n;
    const a = 1 - Math.exp((-TAU * (300 + 7000 * k * k)) / SR);
    lp += a * (noise() - lp);
    out[i] = lp * k * k;
  }
  return out;
}
const sparkleNotes = [86, 89, 93, 98, 101];
function sparkle(t0, gain = 0.1) {
  sparkleNotes.forEach((m, k) => sfx(t0 + k * 0.045, bell(mtof(m), 0.7), gain * (1 - k * 0.12), (k % 2 ? 0.5 : -0.5), 0.5));
}
function gliss(t0, from = 62, steps = 14, span = 0.7, gain = 0.12, up = true) {
  const scale = [0, 2, 3, 5, 7, 8, 11]; // D 화성단음계
  for (let k = 0; k < steps; k++) {
    const kk = up ? k : steps - 1 - k;
    const m = from + 12 * Math.floor(kk / 7) + scale[kk % 7];
    music(t0 + (k * span) / steps, harp(m, 1.8), gain * (0.7 + 0.3 * (k / steps)), (k / steps - 0.5) * 0.8, 0.5);
  }
}
function gliss_major(t0, from = 62, steps = 14, span = 0.7, gain = 0.12) {
  const scale = [0, 2, 4, 7, 9]; // D 장조 5음
  for (let k = 0; k < steps; k++) {
    const m = from + 12 * Math.floor(k / 5) + scale[k % 5];
    music(t0 + (k * span) / steps, harp(m, 2.2), gain, (k / steps - 0.5) * 0.8, 0.55);
  }
}

/* ── 선율 (4마디 = 16박), [박, 음, 길이(박)] ── */
const MOTIF = [
  [0, 81, 1], [1, 86, 1], [2, 85, 0.5], [2.5, 81, 0.5], [3, 77, 1],
  [4, 77, 1], [5, 82, 1], [6, 81, 0.5], [6.5, 77, 0.5], [7, 74, 1],
  [8, 79, 1], [9, 82, 1], [10, 86, 1], [11, 82, 0.5], [11.5, 79, 0.5],
  [12, 76, 1], [13, 79, 1], [14, 85, 0.5], [14.5, 81, 0.5], [15, 73, 1],
];
const PING = [74, 76, 77, 79, 81, 82, 85, 86, 88];

/* ═════════ 곡 쓰기: 마디마다 그 시각의 구간을 보고 악기를 고른다 ═════════ */
const bars = Math.ceil(duration / BAR) + 1;
const kickTimes = [];
const hits = cues.filter(c => c.kind === 'hit').map(c => c.t);
const afterHit = t => hits.some(h => t >= h && t < h + 2.6);

for (let b = 0; b < bars; b++) {
  const t0 = b * BAR;
  if (t0 > duration) break;
  const ch = CHORDS[b % 4];
  const sec = sectionAt(t0 + 0.01);
  const secName = sec.s;
  const k01 = Math.min(1, (t0 - sec.t) / Math.max(BAR, sectionEnd(sec) - sec.t)); // 구간 안에서 진행도

  // 패드
  if (secName === 'intro') ch.pad.forEach((m, k) => music(t0, pad(mtof(m), BAR + 0.8, 900), 0.045, (k - 1.5) * 0.35, 0.4));
  if (secName === 'build') ch.pad.forEach((m, k) => music(t0, pad(mtof(m), BAR + 0.6, 700 + 1800 * k01), 0.05, (k - 1.5) * 0.35, 0.35));
  if (secName === 'hush' && !inRoll(t0) && !afterHit(t0)) music(t0, pad(mtof(38), BAR + 0.8, 380, 0.8), 0.07, 0, 0.3);
  if (secName === 'groove') ch.pad.forEach((m, k) => music(t0, pad(mtof(m + 12), BAR + 0.6, 1400), 0.022, (k - 1.5) * 0.4, 0.4));

  for (let q = 0; q < 8; q++) {
    // 8분음표 자리 (스윙은 groove 에서만)
    const swing = secName === 'groove' && q % 2 ? BEAT * 0.12 : 0;
    const t = t0 + q * (BEAT / 2) + swing;
    if (t > duration - 0.3) break;
    const s = sectionAt(t).s;
    const beat = q / 2;
    const roll = inRoll(t) || afterHit(t);

    if (s === 'intro') {
      if (q === 0) music(t, sine(mtof(38), BAR + 0.5, 3, 0.3), 0.14, 0, 0.1); // 낮은 지속음
    }
    if (s === 'build') {
      const m = q % 2 ? 45 : 50;
      music(t, pizz(m + (q === 6 ? 2 : 0)), 0.28 * (0.6 + 0.4 * (q % 2 ? 0.6 : 1)), q % 2 ? 0.3 : -0.3, 0.2);
      if (q === 0 || q === 4) music(t, tom(q === 0 ? 110 : 90), 0.26, 0, 0.2);
      if (q % 2) music(t, shaker(), 0.05, 0.5, 0.05);
    }
    if (s === 'hush' && !roll) {
      if (q === 0) music(t, heartbeat(), 0.42, 0, 0.1);
      if (q === 3 || q === 7) music(t, bell(mtof(q === 3 ? 93 : 98), 1.2), 0.03, q === 3 ? -0.6 : 0.6, 0.7);
    }
    if (s === 'groove') {
      const next = CHORDS[(b + 1) % 4];
      const line = {0: ch.root, 2: ch.root + 7, 3: ch.root + 7, 4: ch.root + 12, 6: ch.root + 7, 7: next.root - 1};
      if (q in line) music(t, pizz(line[q] + 12, 0.35), q === 3 ? 0.16 : 0.32, 0, 0.15);
      if (q === 0 || q === 4) {
        kickTimes.push(t);
        music(t, kick(), 0.34, 0, 0);
      }
      if (q === 2 || q === 6) music(t, snap(), 0.22, 0.15, 0.3);
      music(t, shaker(), q % 2 ? 0.05 : 0.08, 0.45, 0.05);
    }
  }

  // 첼레스타 선율: intro 는 한 번, groove 는 4마디 걸러
  const phraseBar = b % 4;
  const melodyOn = secName === 'intro' || (secName === 'groove' && Math.floor(b / 4) % 2 === 0) || secName === 'outro';
  if (melodyOn && !inRoll(t0)) {
    for (const [bt, m, len] of MOTIF) {
      if (Math.floor(bt / 4) !== phraseBar) continue;
      const swing = secName === 'groove' && bt % 1 ? BEAT * 0.12 : 0;
      const t = t0 + (bt - phraseBar * 4) * BEAT + swing;
      if (t > duration - 0.6 || sectionAt(t).s !== secName) continue;
      music(t, bell(mtof(m), 0.6 + len * BEAT), secName === 'groove' ? 0.07 : 0.085, 0.15, 0.55);
    }
  }
}

// 처음: 하프 글리산도로 막을 연다
gliss(0.05, 50, 16, 0.9, 0.11);

// 드럼롤 → 쾅
for (const r of rolls) {
  const dur = r.to - r.from;
  for (let t = r.from; t < r.to; t += BEAT / 8) {
    const k = (t - r.from) / dur;
    music(t, snareHit(), 0.05 + 0.22 * k * k, (rnd() - 0.5) * 0.2, 0.2);
  }
  [57, 61, 64, 67].forEach((m, k) => music(r.from, tremolo(mtof(m), dur), 0.07, (k - 1.5) * 0.4, 0.3));
  music(r.from, tremolo(mtof(33), dur), 0.12, 0, 0.1);
  sfx(r.to - 1.2, riser(1.2), 0.18, 0, 0.2);
}
for (const h of hits) {
  music(h, stab([50, 54, 57, 62, 66, 69]), 0.06, 0, 0.5); // D장조
  music(h, sine(mtof(38), 2.6, 1.2, 0.002), 0.25, 0, 0.1);
  sfx(h, boom(), 0.42, 0, 0.2);
  sfx(h, crash(), 0.2, 0.2, 0.4);
  gliss_major(h + 0.05, 74, 12, 0.6, 0.09);
  sparkle(h + 0.35, 0.08);
  // 잔잔한 여운 화음 (흥분이 가라앉는 2.4초)
  [62, 66, 69, 74].forEach((m, k) => music(h + 0.2, pad(mtof(m), 2.4, 1600, 0.3), 0.03, (k - 1.5) * 0.4, 0.5));
}

// 끝: A7 한 마디 → D장조로 길게, 하프 올라감
for (const sec of sections.filter(x => x.s === 'outro')) {
  const t0 = sec.t;
  [45, 49, 52, 55, 61].forEach((m, k) => music(t0, pad(mtof(m), BAR + 0.4, 1300), 0.04, (k - 2) * 0.3, 0.5));
  music(t0, pizz(45, 0.5), 0.3);
  const tD = t0 + BAR;
  if (tD < duration) {
    const tail = duration - tD + 0.2;
    [50, 54, 57, 62, 66].forEach((m, k) => music(tD, pad(mtof(m), tail, 1500, 0.2), 0.045, (k - 2) * 0.35, 0.6));
    music(tD, pizz(38, 0.6), 0.35);
    gliss_major(tD, 62, 12, 0.8, 0.08);
    music(tD + 0.9, bell(mtof(86), 2.5), 0.09, 0, 0.7);
  }
}

// groove 에서만 킥에 맞춰 음악을 살짝 눌렀다 놓는다
const duck = new Float32Array(LEN).fill(1);
for (const tk of kickTimes) {
  const s0 = Math.round(tk * SR);
  for (let i = 0; i < SR * 0.3; i++) {
    const j = s0 + i;
    if (j >= LEN) break;
    duck[j] = Math.min(duck[j], 1 - 0.3 * Math.exp(-i / (SR * 0.08)));
  }
}

/* ── 효과음 큐 ── */
let pi = 0;
for (const {t, kind} of cues) {
  const pan = [-0.25, 0.1, 0.3, -0.1][pi++ % 4];
  if (kind.startsWith('ping')) {
    const k = Number(kind.slice(4)) || 0;
    const m = PING[Math.min(PING.length - 1, k)];
    sfx(t, bell(mtof(m), 1.2), 0.17, (k / 8 - 0.5) * 0.8, 0.5);
    sfx(t, harp(m - 12, 1.2), 0.1, (k / 8 - 0.5) * 0.8, 0.4);
    continue;
  }
  switch (kind) {
    case 'whoosh':
      sfx(t - 0.15, whoosh(0.6), 0.3, pan);
      break;
    case 'swish':
      sfx(t - 0.05, whoosh(0.35, 800, 5000), 0.2, pan);
      break;
    case 'curtain':
      sfx(t, whoosh(1.1, 150, 2400), 0.38, -0.4, 0.3);
      sfx(t + 0.1, whoosh(1.0, 180, 2000), 0.34, 0.4, 0.3);
      break;
    case 'pop':
      sfx(t, pop(), 0.24, pan, 0.1);
      break;
    case 'tick':
      sfx(t, woodTick(sectionAt(t).s === 'hush' ? 2100 : 1600), 0.12, pan, 0.1);
      break;
    case 'tap':
      sfx(t, woodTick(2400), 0.14, 0.3, 0.1);
      sparkle(t + 0.05, 0.05);
      break;
    case 'sparkle':
      sparkle(t, 0.1);
      break;
    case 'chime':
      [86, 90, 93].forEach((m, k) => sfx(t + k * 0.06, bell(mtof(m), 1.5), 0.11, (k - 1) * 0.4, 0.5));
      break;
    case 'boom':
      sfx(t, boom(), 0.4);
      break;
    case 'poof':
      sfx(t, poof(), 0.3, pan, 0.3);
      break;
    case 'scratch':
      sfx(t, scratch(), 0.3, 0, 0.05);
      break;
  }
}

/* ── 잔향: 빗살 필터 4개 + 올패스 2개 (프리버브 방식), 왼쪽 · 오른쪽 길이를 조금 다르게 ── */
function reverb(input, spread) {
  const out = new Float32Array(LEN);
  const combs = [1116, 1188, 1277, 1356].map(d => ({buf: new Float32Array(d + spread), i: 0, store: 0}));
  const aps = [556, 441].map(d => ({buf: new Float32Array(d + spread), i: 0}));
  const fb = 0.84, damp = 0.25;
  for (let n = 0; n < LEN; n++) {
    const x = input[n] * 0.3;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * (1 - damp) + c.store * damp;
      c.buf[c.i] = x + c.store * fb;
      c.i = (c.i + 1) % c.buf.length;
      y += o;
    }
    for (const a of aps) {
      const o = a.buf[a.i];
      a.buf[a.i] = y + o * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      y = o - y;
    }
    out[n] = y;
  }
  return out;
}
const rvL = reverb(rvIn, 0);
const rvR = reverb(rvIn, 23);

/* ── 합치기: 시작 · 끝 페이드, 부드러운 제한, 최고 -1 dBFS ── */
const L = new Float32Array(LEN);
const R = new Float32Array(LEN);
let peak = 0;
for (let i = 0; i < LEN; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.05) * Math.min(1, Math.max(0, (duration + 0.2 - t) / 1.2));
  L[i] = Math.tanh(0.95 * ((mL[i] * duck[i] + sL[i]) + rvL[i] * 0.9)) * fade;
  R[i] = Math.tanh(0.95 * ((mR[i] * duck[i] + sR[i]) + rvR[i] * 0.9)) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / (peak || 1);
let sum = 0;
for (let i = 0; i < LEN; i++) {
  L[i] *= norm;
  R[i] *= norm;
  sum += L[i] * L[i] + R[i] * R[i];
}
writeWav(outFile, L, R);
const rms = 10 * Math.log10(sum / (2 * LEN));
console.log(
  `${path.relative(process.cwd(), outFile)} — ${duration.toFixed(2)}초, 큐 ${cues.length}개, 구간 ${sections.map(s => s.s + '@' + s.t.toFixed(1)).join(' ')}, RMS ${rms.toFixed(1)} dBFS`,
);
