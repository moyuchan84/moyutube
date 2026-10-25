// 수능 영어 1등급 비율 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-burn.mjs 를 고쳐 만듦.
// 112BPM F장조 · 마림바 아르페지오 + 롤러코스터 효과: 오르막(lifts)은 체인 딸깍이 점점 빨라지고 높아지며,
// 내리막(drops)은 아래로 미끄러지는 바람 소리. 숫자가 박힐 때(hits) 벨, 빨간 펜 와이프(wipes)에 펜 긁는 소리.
// 사용: node scripts/bgm-english.mjs → public/bgm/english.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/english/timeline.json", import.meta.url), "utf8"));
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

// 마림바: 사인 + 4배음이 빨리 사라진다
const marimba = (m, dur = 0.45) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 25)) * Math.exp(-t * 7) * Math.min(1, i / 40);
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
// 동전 같은 벨: 높은 배음이 길게
const coin = (m) => {
  const f = hz(m), n = Math.round(1.1 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.4 * t) * Math.exp(-t * 6)) * Math.exp(-t * 4.2);
  }
  return b;
};
// 나무 블록 틱
const tick = (m) => {
  const f = hz(m), n = Math.round(0.09 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 60); }
  return b;
};
// 종이 넘기는 소리: 대역 통과 노이즈가 올라왔다 사라진다
const swish = (dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n, env = Math.sin(Math.PI * q) ** 2;
    const a = 1 - Math.exp((-2 * Math.PI * (1200 + 3000 * q)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = y * env;
  }
  return b;
};

// F - C - Dm - Bb, 한 마디 = 4박, 8분음표 아르페지오
const CH = [
  { root: 29, arp: [65, 69, 72, 77] },
  { root: 36, arp: [64, 67, 72, 76] },
  { root: 38, arp: [62, 65, 69, 74] },
  { root: 34, arp: [62, 65, 70, 74] },
];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 3];
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen, ch = CH[bar % 4];
  add(t0, bass(ch.root, BEAT * 1.9), 0.32);
  add(t0 + 2 * BEAT, bass(ch.root + 7, BEAT * 1.9), 0.22);
  for (let k = 0; k < 8; k++) add(t0 + k * (BEAT / 2), marimba(ch.arp[PATTERN[k]]), k % 2 === 0 ? 0.2 : 0.13);
}

// 내리막: 높은 대역에서 낮은 대역으로 미끄러지는 노이즈
const dropWhoosh = (dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n, env = Math.sin(Math.PI * Math.min(1, q * 1.6)) ** 2 * (1 - q * 0.4);
    const a = 1 - Math.exp((-2 * Math.PI * (4200 - 3600 * q)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = y * env;
  }
  return b;
};
for (const f of TL.wipes) add(f2s(f) - 0.03, swish(0.28), 0.12);
for (const f of TL.drops) add(f2s(f), dropWhoosh(1.1), 0.16);
for (const f of TL.hits) add(f2s(f), coin(84), 0.12);
// 오르막: 체인 딸깍 — 간격이 줄고 음이 높아진다
for (const [a, b] of TL.lifts) {
  const t0 = f2s(a), t1 = f2s(b);
  for (let t = t0, k = 0; t < t1; k++) {
    const q = (t - t0) / (t1 - t0);
    add(t, tick(84 + q * 10), 0.09);
    t += 0.16 - 0.08 * q;
  }
}
// 박마다 가벼운 틱
for (let k = 0; k * BEAT < SEC; k++) add(k * BEAT, tick(k % 4 === 0 ? 91 : 86), 0.04);

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
writeFileSync(new URL("english.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/english.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
