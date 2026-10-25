// 시황(dial) 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-tax.mjs 의 뼈대를 썼다.
// 120BPM · 시계 초침처럼 8분음표 틱 + 낮은 패드. 앞부분(개장 전)은 단조(Am-F-Dm-E), 개장 장면(open)부터 장조(C-G-Am-F)로 밝아진다.
// 숫자가 박힐 때(hits) 쿵 + 벨, 장면 전환(risers)에는 스윕. 장면 시점은 src/dial/timeline.json 에서 읽는다.
// 사용: node scripts/bgm-dial.mjs → public/bgm/dial.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/dial/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const OPEN = TL.open / TL.fps;
const f2s = (f) => f / TL.fps;

const mix = new Float32Array(LENGTH);
const add = (startSec, buf, gain) => {
  const s = Math.round(startSec * RATE);
  for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const pad = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2 * t)) * Math.min(1, i / 2000, (n - i) / (0.15 * RATE)) * 0.6;
  }
  return b;
};
const pluck = (m, dur = 0.4) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 30)) * Math.exp(-t * 9) * Math.min(1, i / 40);
  }
  return b;
};
const tick = (m, loud) => {
  const f = hz(m), n = Math.round(0.07 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (Math.sin(2 * Math.PI * f * t) + (loud ? (Math.random() * 2 - 1) * 0.25 : 0)) * Math.exp(-t * 70); }
  return b;
};
const thud = () => {
  const n = Math.round(0.3 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = Math.sin(2 * Math.PI * (60 + 70 * Math.exp(-t * 35)) * t) * Math.exp(-t * 16) + (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.3;
  }
  return b;
};
const bell = (m) => {
  const f = hz(m), n = Math.round(1.1 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.4 * t) * Math.exp(-t * 6)) * Math.exp(-t * 4.2);
  }
  return b;
};
// 장면 전환 스윕: 주파수가 올라가는 사인
const sweep = (dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n;
    ph += (2 * Math.PI * (300 + 1800 * q * q)) / RATE;
    b[i] = Math.sin(ph) * Math.sin(Math.PI * q) * 0.8;
  }
  return b;
};

const MINOR = [{ root: 33, arp: [57, 60, 64, 69] }, { root: 29, arp: [57, 60, 65, 69] }, { root: 38, arp: [57, 62, 65, 69] }, { root: 40, arp: [56, 59, 64, 68] }];
const MAJOR = [{ root: 36, arp: [60, 64, 67, 72] }, { root: 31, arp: [59, 62, 67, 71] }, { root: 33, arp: [57, 60, 64, 69] }, { root: 29, arp: [57, 60, 65, 69] }];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 1];
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen;
  const ch = (t0 < OPEN ? MINOR : MAJOR)[bar % 4];
  add(t0, pad(ch.root, barLen * 0.98), 0.3);
  if (t0 >= 2) for (let k = 0; k < 8; k++) add(t0 + k * (BEAT / 2), pluck(ch.arp[PATTERN[k]]), k % 2 === 0 ? 0.11 : 0.07);
}
// 초침 틱: 8분음표마다, 박 머리는 조금 더 크게
for (let t = 0, k = 0; t < SEC; t += BEAT / 2, k++) add(t, tick(k % 2 === 0 ? 96 : 91, k % 4 === 0), k % 2 === 0 ? 0.09 : 0.05);

for (const f of TL.risers) add(f2s(f) - 0.1, sweep(0.5), 0.1);
for (const f of TL.hits) { add(f2s(f), thud(), 0.26); add(f2s(f), bell(f2s(f) < OPEN ? 81 : 84), 0.08); }

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
writeFileSync(new URL("dial.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/dial.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
