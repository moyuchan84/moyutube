// GTA 6 숫자 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음).
// 노을 드라이브 느낌: 108BPM, Am–F–C–G 진행, 펌핑 패드 · 8분음표 베이스 · 16분음표 아르페지오 · 큰 스네어.
// 기록 장면 뒤쪽(저울)에서 비트를 비워 한 번 멈추고, 런치 트레일러 장면(boost)부터 하이햇이 촘촘해지며 가속.
// 장면 시점과 타격 시점은 src/gta/timeline.json 에서 읽는다 → 화면 전환과 소리가 같은 프레임에 맞는다.
// 사용: node scripts/bgm-gta.mjs → public/bgm/gta.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/gta/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const BAR = BEAT * 4;
const f2s = (f) => f / TL.fps;

// 같은 결과가 나오도록 고정 난수
let seed = 20261016;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const mix = new Float32Array(LENGTH);
const add = (startSec, buf, gain) => {
  const s = Math.round(startSec * RATE);
  for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const lowpass = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y);
  return buf;
};

const sceneAt = (t) => [...TL.scenes].reverse().find((s) => t >= f2s(s.from)) ?? TL.scenes[0];
const BREAK = [f2s(1050), f2s(1200)]; // 기록 장면 저울 구간: 비트 비움
const BOOST = f2s(TL.boost[0]);
const OUTRO = f2s(TL.scenes.at(-1).from);
const inBreak = (t) => t >= BREAK[0] && t < BREAK[1];

// 코드 진행 (마디 단위): Am F C G
const CHORDS = [
  { root: 45, notes: [57, 60, 64, 69] },
  { root: 41, notes: [53, 57, 60, 65] },
  { root: 48, notes: [55, 60, 64, 67] },
  { root: 43, notes: [55, 59, 62, 67] },
];

const saw = (f, t) => ((t * f) % 1) * 2 - 1;

// 펌핑 패드: 마디 길이의 디튠 톱니 화음, 박마다 사이드체인처럼 볼륨이 눌렸다 올라옴
const pad = (notes, dur, bright) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    let v = 0;
    for (const m of notes) { const f = hz(m); v += saw(f * 0.997, t) + saw(f * 1.004, t); }
    const pump = Math.min(1, ((t % BEAT) / BEAT) * 3.2);
    b[i] = (v / notes.length) * (0.35 + 0.65 * pump) * Math.min(1, t / 0.05) * Math.min(1, (dur - t) / 0.05);
  }
  return lowpass(lowpass(b, 900 + bright * 1800), 2400);
};
const bass = (m, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n), f = hz(m);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (saw(f, t) * 0.5 + Math.sin(2 * Math.PI * f * t)) * Math.exp(-t * 5) * Math.min(1, i / 60); }
  return lowpass(b, 600);
};
const pluck = (m, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n), f = hz(m);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (Math.sign(Math.sin(2 * Math.PI * f * t)) * 0.4 + Math.sin(2 * Math.PI * f * 2 * t) * 0.3) * Math.exp(-t * 14); }
  return lowpass(b, 3200);
};
const kick = () => {
  const n = Math.round(0.35 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * (45 + 120 * Math.exp(-t * 30))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 7); }
  return b;
};
// 큰 스네어: 톤 + 노이즈 + 짧게 잘린 잔향 (80년대 게이트 느낌)
const snare = () => {
  const n = Math.round(0.42 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const gate = t < 0.28 ? 1 : Math.max(0, 1 - (t - 0.28) / 0.04);
    b[i] = (Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 25) * 0.6 + rnd() * (0.55 * Math.exp(-t * 18) + 0.22)) * gate;
  }
  return lowpass(b, 5000);
};
const hat = (open) => {
  const n = Math.round((open ? 0.18 : 0.05) * RATE), b = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) { const x = rnd(); b[i] = (x - prev) * Math.exp((-i / RATE) * (open ? 18 : 70)); prev = x; }
  return b;
};

const bars = Math.ceil(SEC / BAR);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * BAR;
  const ch = CHORDS[bar % 4];
  const boost = t0 >= BOOST && t0 < OUTRO;
  const outro = t0 >= OUTRO;
  const id = sceneAt(t0 + 0.01).id;
  add(t0, pad(ch.notes, BAR, boost ? 1 : 0.5), outro ? 0.16 : 0.12);
  if (outro) { add(t0, bass(ch.root - 12, BAR), 0.25); continue; }
  for (let k = 0; k < 8; k++) {
    const t = t0 + k * (BEAT / 2);
    if (inBreak(t)) continue;
    add(t, bass(ch.root - 12 + (k % 4 === 3 ? 12 : 0), BEAT / 2), 0.3);
  }
  // 아르페지오: 훅 다음부터, 저울 구간에선 느리게
  if (id !== "hook") {
    for (let k = 0; k < 16; k++) {
      const t = t0 + k * (BEAT / 4);
      if (inBreak(t) && k % 4 !== 0) continue;
      add(t, pluck(ch.notes[[0, 1, 2, 3, 2, 1][k % 6]] + 12, BEAT / 4), boost ? 0.09 : 0.06);
    }
  }
  if (bar === 0) continue; // 첫 마디는 비트 없이 열기
  for (let b = 0; b < 4; b++) {
    const t = t0 + b * BEAT;
    if (inBreak(t)) continue;
    add(t, kick(), 0.75);
    if (b % 2 === 1) add(t, snare(), 0.32);
    add(t + BEAT / 2, hat(b === 3), 0.07);
    if (boost) { add(t + BEAT / 4, hat(false), 0.05); add(t + (3 * BEAT) / 4, hat(false), 0.05); }
  }
}

// 장면 전환 전 휘익 라이저, 숫자 타격마다 쿵 + 반짝
for (const f of TL.risers) {
  const end = f2s(f), dur = 1.0, n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) { const q = i / n; const a = 1 - Math.exp((-2 * Math.PI * (300 + q * q * 5000)) / RATE); y += a * (rnd() - y); b[i] = y * q * q; }
  add(end - dur, b, 0.2);
}
for (const f of TL.hits) {
  add(f2s(f), kick(), 0.6);
  add(f2s(f), pluck(88, 0.6), 0.12);
  add(f2s(f), pluck(81, 0.6), 0.1);
}

const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) {
  const v = Math.tanh((mix[i] / peak) * 1.2) * 0.85;
  sq += v * v;
  data.writeInt16LE(Math.round(v * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
const outDir = new URL("../public/bgm/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("gta.wav", outDir), Buffer.concat([header, data]));
const rms = 20 * Math.log10(Math.sqrt(sq / LENGTH));
console.log(`public/bgm/gta.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${rms.toFixed(1)} dBFS, 멈춤 ${BREAK[0].toFixed(1)}~${BREAK[1].toFixed(1)}초, 가속 ${BOOST.toFixed(1)}초)`);
