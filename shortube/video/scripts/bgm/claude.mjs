// 앤트로픽 S-1 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm/bigarch.mjs 를 고쳐 만듦.
// 92BPM 미니멀: 낮은 패드(Dm9 - Bbmaj7 - Fmaj7 - C6) + 부드러운 킥 + 타자기 딸깍(8분) + 숫자마다 도장 '탁'.
// 가림막 전환(wipes)에 '휙' 노이즈 스윕, 숫자가 박힐 때(hits) 도장.
// 사용: node scripts/bgm/claude.mjs → content/claude/music/claude.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../../../content/claude/script/timeline.json", import.meta.url), "utf8"));
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

// 패드: 살짝 어긋난 사인 두 겹, 느린 어택 · 릴리스
const pad = (ms, sec) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  for (const m of ms) {
    const f = hz(m);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      const env = Math.min(1, t / 0.6) * Math.min(1, (n - i) / (0.8 * RATE));
      b[i] += (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t + 1)) * env;
    }
  }
  return b;
};
// 베이스: 사인, 길게
const bass = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = Math.sin(2 * Math.PI * f * t) * Math.min(1, i / 200) * Math.exp(-t * 1.2) * Math.min(1, (n - i) / 800);
  }
  return b;
};
// 부드러운 킥
const kick = () => {
  const n = Math.round(0.35 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, f = 48 + 70 * Math.exp(-t * 35);
    ph += (2 * Math.PI * f) / RATE;
    b[i] = Math.sin(ph) * Math.exp(-t * 10);
  }
  return b;
};
// 노이즈 (고역 통과)
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
// 타자기 딸깍: 아주 짧은 노이즈 + 높은 사인 핑
const tick = () => {
  const b = noise(0.04, 140, 0.95);
  for (let i = 0; i < b.length; i++) b[i] += Math.sin(2 * Math.PI * 2600 * (i / RATE)) * Math.exp((-i / RATE) * 120) * 0.4;
  return b;
};
// 도장 '탁': 중저역 쿵 + 나무 소리
const stamp = () => {
  const n = Math.round(0.3 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, f = 120 + 160 * Math.exp(-t * 50);
    ph += (2 * Math.PI * f) / RATE;
    b[i] = Math.sin(ph) * Math.exp(-t * 18) + Math.sin(2 * Math.PI * 820 * t) * Math.exp(-t * 60) * 0.5 + (Math.random() * 2 - 1) * 0.3 * Math.exp(-t * 90);
  }
  return b;
};
// 휙: 노이즈가 커졌다 작아짐
const whoosh = () => {
  const n = Math.round(0.6 * RATE), b = noise(0.6, 0, 0.7);
  for (let i = 0; i < n; i++) { const t = i / n; b[i] *= Math.sin(Math.PI * t) ** 2; }
  return b;
};

// Dm9 - Bbmaj7 - Fmaj7 - C6, 한 마디씩
const CH = [
  { root: 38, chord: [62, 65, 69, 72, 76] },
  { root: 34, chord: [62, 65, 69, 70] },
  { root: 41, chord: [60, 64, 65, 69] },
  { root: 36, chord: [60, 64, 67, 69] },
];
const bar = 4 * BEAT;
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 4];
  add(t0, pad(ch.chord, bar + 0.4), 0.035);
  add(t0, bass(ch.root, bar * 0.9), 0.3);
  add(t0 + 2.5 * BEAT, bass(ch.root + 12, BEAT), 0.12);
  for (const p of [0, 2]) add(t0 + p * BEAT, kick(), 0.4);
  for (let s = 0; s < 8; s++) add(t0 + s * (BEAT / 2), tick(), s % 2 ? 0.05 : 0.08);
}
for (const f of TL.wipes) add(f2s(f) - 0.05, whoosh(), 0.12);
for (const f of TL.hits) add(f2s(f), stamp(), 0.45);
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
const outDir = new URL("../../../content/claude/music/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("claude.wav", outDir), Buffer.concat([header, data]));
console.log(`content/claude/music/claude.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
