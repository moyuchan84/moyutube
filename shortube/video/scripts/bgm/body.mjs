// 신체(키·BMI) 숫자 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-tax.mjs 의 뼈대를 쓰되 분위기를 바꿨다.
// 112BPM · 밝은 장조(C - G - Am - F): 피치카토 아르페지오 + 마림바 베이스 + 숫자가 박힐 때 '똑' 벨,
// 키재기 눈금이 지나갈 때(drops) 올라가는 나무 틱, 장면 전환(risers)에는 자 쓸리는 소리.
// BMI 25 를 넘는 순간(minor)에만 단조 음 하나(E♭)를 낮게 얹는다. 드럼 없음.
// 사용: node scripts/bgm/body.mjs → content/body/music/body.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../../../content/body/script/timeline.json", import.meta.url), "utf8"));
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

// 피치카토: 사인 + 배음이 아주 짧게 튄다
const pluck = (m, dur = 0.32) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.45 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 30) + 0.2 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 45)) * Math.exp(-t * 11) * Math.min(1, i / 30);
  }
  return b;
};
const marimba = (m, dur = 0.5) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 25)) * Math.exp(-t * 6) * Math.min(1, i / 40);
  }
  return b;
};
const bass = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = Math.sin(2 * Math.PI * f * t) * Math.min(1, i / 300, (n - i) / (0.1 * RATE)) * 0.9;
  }
  return b;
};
const bell = (m) => {
  const f = hz(m), n = Math.round(0.9 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.4 * t) * Math.exp(-t * 6)) * Math.exp(-t * 5);
  }
  return b;
};
const tick = (m) => {
  const f = hz(m), n = Math.round(0.08 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 55); }
  return b;
};
// 자가 쓸리는 소리: 밝은 노이즈가 짧게 올라간다
const sweep = (dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n, env = Math.sin(Math.PI * q) * 0.9 * (0.7 + 0.3 * Math.sin(i / 60));
    const a = 1 - Math.exp((-2 * Math.PI * (2500 + 4000 * q)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = ((Math.random() * 2 - 1) - y) * env;
  }
  return b;
};
// 단조 음 하나: 낮은 E♭ 패드가 서서히 켜졌다 사라진다
const darkNote = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE, env = Math.min(1, t / 0.08) * Math.exp(-t * 1.6);
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t)) * env;
  }
  return b;
};

// C - G - Am - F, 한 마디 = 4박, 8분음표 아르페지오
const CH = [
  { root: 36, arp: [60, 64, 67, 72] },
  { root: 43, arp: [59, 62, 67, 71] },
  { root: 33, arp: [57, 60, 64, 69] },
  { root: 41, arp: [57, 60, 65, 69] },
];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 3];
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen, ch = CH[bar % 4];
  add(t0, bass(ch.root, BEAT * 1.9), 0.3);
  add(t0 + 2 * BEAT, marimba(ch.root + 12, BEAT * 1.5), 0.14);
  for (let k = 0; k < 8; k++) add(t0 + k * (BEAT / 2), pluck(ch.arp[PATTERN[k]]), k % 2 === 0 ? 0.21 : 0.14);
}

for (const f of TL.risers) add(f2s(f) - 0.1, sweep(0.5), 0.12);
for (const f of TL.hits) { add(f2s(f), bell(84), 0.11); add(f2s(f), marimba(60, 0.3), 0.12); }
for (const [i, f] of TL.drops.entries()) add(f2s(f), tick(84 + (i % 8) * 2), 0.06);
for (const f of TL.minor) add(f2s(f), darkNote(51, 1.8), 0.32);

const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
// RMS 를 약 -17 dBFS 로 맞춘 뒤 부드럽게 리밋
let s0 = 0;
for (let i = 0; i < LENGTH; i++) s0 += mix[i] * mix[i];
const scale = 0.14 / Math.sqrt(s0 / LENGTH);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) { const v = Math.tanh(mix[i] * scale * 1.1) * 0.9; sq += v * v; data.writeInt16LE(Math.round(v * 32767), i * 2); }
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
const outDir = new URL("../../../content/body/music/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("body.wav", outDir), Buffer.concat([header, data]));
console.log(`content/body/music/body.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
