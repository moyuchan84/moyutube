// 빅아치 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-foliage.mjs 를 고쳐 만듦.
// 100BPM 펑크 셔플 · Am7-D7 도리안 그루브(베이스 + 박수 + 하이햇 + 일렉 피아노 스탭).
// 번이 내려앉는 전환(wipes)과 버거 층이 떨어질 때(layerDrop) '쿵', 숫자가 박힐 때(hits) 계산대 벨.
// 사용: node scripts/bgm-bigarch.mjs → public/bgm/bigarch.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/bigarch/timeline.json", import.meta.url), "utf8"));
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

// 손가락 베이스: 사인 + 약한 3배음, 짧게 튕김
const bass = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, i / 120) * Math.exp(-t * 5) * Math.min(1, (n - i) / 400);
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 18)) * env;
  }
  return b;
};
// 일렉 피아노: 사인 두 겹 + 트레몰로
const keys = (ms, sec) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  for (const m of ms) {
    const f = hz(m);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      b[i] += (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 8)) * Math.exp(-t * 3.5) * (1 + 0.15 * Math.sin(2 * Math.PI * 5 * t)) * Math.min(1, i / 80, (n - i) / 300);
    }
  }
  return b;
};
// 노이즈: 박수(중역) · 하이햇(고역)
const noise = (sec, decay, hp) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  let prev = 0, y = 0;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 2 - 1;
    y = hp * (y + x - prev);
    prev = x;
    b[i] = y * Math.exp((-i / RATE) * decay);
  }
  return b;
};
const clap = () => {
  const b = noise(0.25, 18, 0.85);
  for (let i = 0; i < b.length; i++) if (i < 0.012 * RATE) b[i] *= (i % 300) < 150 ? 1 : 0.3; // 손뼉 겹침
  return b;
};
// 쿵: 낮은 사인이 떨어지며 눌림 + 짧은 노이즈
const thud = () => {
  const n = Math.round(0.45 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, f = 55 + 90 * Math.exp(-t * 30);
    ph += (2 * Math.PI * f) / RATE;
    b[i] = Math.sin(ph) * Math.exp(-t * 9) + (Math.random() * 2 - 1) * 0.25 * Math.exp(-t * 60);
  }
  return b;
};
// 계산대 벨
const bell = (m) => {
  const f = hz(m), n = Math.round(1.0 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 7)) * Math.exp(-t * 4.5);
  }
  return b;
};

// Am7 - D7, 한 마디씩 반복 (도리안 그루브)
const CH = [
  { root: 33, chord: [64, 67, 72, 76], line: [33, 45, 43, 45, 40, 43] },
  { root: 38, chord: [66, 69, 72, 74], line: [38, 50, 48, 50, 45, 47] },
];
const swing = BEAT / 4 * 1.18; // 16분 셔플
const bar = 4 * BEAT;
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 2];
  // 베이스: 1 · 1& · 2& · 3 · 3a · 4&
  const pos = [0, 0.5, 1.5, 2, 2.75, 3.5];
  pos.forEach((p, i) => add(t0 + p * BEAT, bass(ch.line[i], BEAT * 0.45), i === 0 ? 0.34 : 0.24));
  // 피아노 스탭: 2& · 4
  add(t0 + 1.5 * BEAT, keys(ch.chord, BEAT * 0.8), 0.05);
  add(t0 + 3 * BEAT, keys(ch.chord, BEAT * 0.6), 0.04);
  // 박수 2 · 4
  for (const p of [1, 3]) add(t0 + p * BEAT, clap(), 0.16);
  // 하이햇 16분 셔플
  for (let s = 0; s < 16; s++) add(t0 + Math.floor(s / 2) * (BEAT / 2) + (s % 2 ? swing : 0), noise(0.05, 70, 0.97), s % 4 === 0 ? 0.07 : 0.04);
}
const sceneFrom = (id) => TL.scenes.find((s) => s.id === id).from;
for (const f of TL.wipes) add(f2s(f + 8), thud(), 0.5);
for (const f of TL.layerDrop) add(f2s(sceneFrom("build") + f + 6), thud(), 0.28);
for (const f of TL.hits) add(f2s(f), bell(88), 0.09);
const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) { const v = Math.tanh((mix[i] / peak) * 2.2) * 0.62; sq += v * v; data.writeInt16LE(Math.round(v * 32767), i * 2); }
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
writeFileSync(new URL("bigarch.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/bigarch.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
