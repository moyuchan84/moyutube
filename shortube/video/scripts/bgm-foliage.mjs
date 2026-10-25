// 단풍 절정 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-english.mjs 를 고쳐 만듦.
// 84BPM 3/4박 왈츠 · D장조 가을 진행 · 하프처럼 뜯는 소리(Karplus-Strong). 낙엽 전환(wipes)과 잎이 떨어질 때(leafDrop)
// 바람 소리, 숫자가 박힐 때(hits) 맑은 종소리.
// 사용: node scripts/bgm-foliage.mjs → public/bgm/foliage.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/foliage/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const f2s = (f) => f / TL.fps;

const mix = new Float32Array(LENGTH);
const add = (startSec, buf, gain) => {
  const s = Math.round(startSec * RATE);
  for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const bass = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = Math.sin(2 * Math.PI * f * t) * Math.min(1, i / 300, (n - i) / (0.1 * RATE)) * 0.9;
  }
  return b;
};
// 동전 같은 벨: 높은 배음이 길게
const coin = (m) => {
  const f = hz(m), n = Math.round(1.1 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.4 * t) * Math.exp(-t * 6)) * Math.exp(-t * 4.2);
  }
  return b;
};
// 하프: Karplus-Strong 뜯는 줄
const harp = (m, dur = 1.6) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  const p = Math.max(2, Math.round(RATE / f)), buf = new Float32Array(p);
  for (let i = 0; i < p; i++) buf[i] = Math.random() * 2 - 1;
  for (let i = 0; i < n; i++) {
    const k = i % p, nx = (k + 1) % p;
    const v = buf[k];
    buf[k] = 0.996 * 0.5 * (buf[k] + buf[nx]);
    b[i] = v * Math.min(1, i / 30);
  }
  return b;
};
// D - Bm - G - A (가을 느낌의 장조 진행), 한 마디 = 3박
const CH = [
  { root: 38, arp: [62, 66, 69, 74] },
  { root: 35, arp: [59, 62, 66, 71] },
  { root: 31, arp: [59, 62, 67, 71] },
  { root: 33, arp: [61, 64, 69, 73] },
];
const barLen = 3 * BEAT;
const bars = Math.ceil(SEC / barLen);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen, ch = CH[bar % 4];
  add(t0, bass(ch.root, BEAT * 2.8), 0.3);
  // 왈츠: 1박 베이스, 2·3박 화음
  for (const k of [1, 2]) for (const m of ch.arp.slice(0, 3)) add(t0 + k * BEAT, harp(m, 0.9), 0.06);
  // 위 선율: 8분 아르페지오 6개, 끝 음은 한 옥타브 위
  const seq = [0, 1, 2, 3, 2, 1];
  for (let k = 0; k < 6; k++) add(t0 + k * (BEAT / 2) + 0.01, harp(ch.arp[seq[k]] + 12, 1.4), k === 0 ? 0.13 : 0.08);
}
// 바람: 낮은 대역 노이즈가 부풀었다 가라앉는다
const wind = (dur, lo = 500, hi = 1800) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n, env = Math.sin(Math.PI * q) ** 2;
    const a = 1 - Math.exp((-2 * Math.PI * (lo + (hi - lo) * Math.sin(Math.PI * q))) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = y * env;
  }
  return b;
};
const sceneFrom = (id) => TL.scenes.find((s) => s.id === id).from;
for (const f of TL.wipes) add(f2s(f) - 0.05, wind(0.9), 0.2);
for (const f of TL.leafDrop) add(f2s(sceneFrom("calendar") + f) - 0.4, wind(0.7, 900, 2600), 0.12);
for (const f of TL.hits) add(f2s(f), coin(86), 0.1);
const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) { const v = Math.tanh((mix[i] / peak) * 1.2) * 0.5; sq += v * v; data.writeInt16LE(Math.round(v * 32767), i * 2); }
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
writeFileSync(new URL("foliage.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/foliage.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
