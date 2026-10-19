// 수능 D-34 숫자 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음).
// 시험장 느낌: 90BPM, 박마다 벽시계 똑딱, Dm–B♭–F–C 잔잔한 전자피아노 화음 · 부드러운 베이스 · 가벼운 킥.
// 결시 장면(quiet)은 똑딱이와 화음만 남기고 비우며, 끝에 학교 종소리(4음)가 울린다.
// 장면 시점과 타격 시점은 src/suneung/timeline.json 에서 읽는다 → 화면 전환과 소리가 같은 프레임에 맞는다.
// 사용: node scripts/bgm-suneung.mjs → public/bgm/suneung.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/suneung/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const BAR = BEAT * 4;
const f2s = (f) => f / TL.fps;

// 같은 결과가 나오도록 고정 난수
let seed = 20261117;
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

const QUIET = [f2s(TL.quiet[0]), f2s(TL.quiet[1])];
const OUTRO = f2s(TL.scenes.at(-1).from);
const FIRST = f2s(TL.scenes[1].from); // 훅 다음부터 비트
const inQuiet = (t) => t >= QUIET[0] && t < QUIET[1];

// 코드 진행 (마디 단위): Dm B♭ F C
const CHORDS = [
  { root: 38, notes: [62, 65, 69, 74] },
  { root: 34, notes: [62, 65, 70, 74] },
  { root: 41, notes: [60, 65, 69, 72] },
  { root: 36, notes: [60, 64, 67, 72] },
];

// 전자피아노: 사인 + 2배음, 짧게 울리고 사라짐
const keys = (m, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n), f = hz(m);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 6)) * Math.exp(-t * 2.2) * Math.min(1, i / 80);
  }
  return b;
};
// 패드: 부드러운 사인 화음
const pad = (notes, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    let v = 0;
    for (const m of notes) v += Math.sin(2 * Math.PI * hz(m) * t) + 0.3 * Math.sin(2 * Math.PI * hz(m) * 1.003 * t);
    b[i] = (v / notes.length) * Math.min(1, t / 0.4) * Math.min(1, (dur - t) / 0.4);
  }
  return b;
};
const bass = (m, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n), f = hz(m);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 3) * Math.min(1, i / 100); }
  return b;
};
// 벽시계 똑딱: 짧은 나무 소리 (높낮이 번갈아)
const tick = (hi) => {
  const n = Math.round(0.04 * RATE), b = new Float32Array(n), f = hi ? 2600 : 2000;
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (Math.sin(2 * Math.PI * f * t) * 0.7 + rnd() * 0.3) * Math.exp(-t * 160); }
  return b;
};
const kick = () => {
  const n = Math.round(0.3 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * (48 + 90 * Math.exp(-t * 35))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 9); }
  return b;
};
const hat = () => {
  const n = Math.round(0.05 * RATE), b = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) { const x = rnd(); b[i] = (x - prev) * Math.exp((-i / RATE) * 80); prev = x; }
  return b;
};
// 시험지 넘기는 소리: 걸러진 잡음이 짧게 쓸려 감
const page = () => {
  const n = Math.round(0.35 * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) { const q = i / n; const a = 1 - Math.exp((-2 * Math.PI * (900 + q * 3000)) / RATE); y += a * (rnd() - y); b[i] = y * Math.sin(Math.PI * q) ** 2; }
  return b;
};
// 종소리: 기음 + 비조화 배음, 길게 울림
const bell = (m, dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n), f = hz(m);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 3) + 0.25 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 6)) * Math.exp(-t * 1.4) * Math.min(1, i / 40);
  }
  return b;
};

const bars = Math.ceil(SEC / BAR);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * BAR;
  const ch = CHORDS[bar % 4];
  const outro = t0 >= OUTRO;
  add(t0, pad(ch.notes, BAR), 0.07);
  for (let b = 0; b < 4; b++) {
    const t = t0 + b * BEAT;
    add(t, tick(b % 2 === 0), outro ? 0.1 : 0.22);
    if (outro) continue;
    // 피아노: 박마다 화음 음 하나씩 (아르페지오), 결시 구간에선 첫 박만
    if (!inQuiet(t) || b === 0) add(t, keys(ch.notes[[0, 2, 1, 3][b]] + (inQuiet(t) ? 0 : 12), BEAT * 2), 0.14);
    if (t < FIRST || inQuiet(t)) continue;
    add(t, bass(ch.root + (b === 2 ? 7 : 0), BEAT), 0.32);
    if (b % 2 === 0) add(t, kick(), 0.45);
    add(t + BEAT / 2, hat(), 0.05);
  }
}

// 장면 전환마다 시험지 넘기는 소리, 숫자 타격마다 쿵 + 맑은 음
for (const s of TL.scenes.slice(1)) add(f2s(s.from) - 0.12, page(), 0.35);
for (const f of TL.hits) {
  add(f2s(f), kick(), 0.5);
  add(f2s(f), keys(86, 0.8), 0.12);
  add(f2s(f), keys(81, 0.8), 0.1);
}
// 끝 종소리: 4음 (E5 C5 D5 G4)
[76, 72, 74, 67].forEach((m, i) => add(f2s(TL.bell) + i * 0.55, bell(m, 2.2), 0.3));

const fade = Math.round(1.2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) {
  const v = Math.tanh((mix[i] / peak) * 1.3) * 0.85;
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
writeFileSync(new URL("suneung.wav", outDir), Buffer.concat([header, data]));
const rms = 20 * Math.log10(Math.sqrt(sq / LENGTH));
console.log(`public/bgm/suneung.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${rms.toFixed(1)} dBFS, 조용한 구간 ${QUIET[0].toFixed(1)}~${QUIET[1].toFixed(1)}초, 종 ${f2s(TL.bell).toFixed(1)}초)`);
