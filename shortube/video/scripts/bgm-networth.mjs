// 정보 전달용 차분한 배경음악을 코드로 합성한다 (저작권 걱정 없음).
// 96BPM · 일렉 피아노 같은 플럭 코드 + 따뜻한 패드 + 부드러운 킥/림 + 셰이커,
// timeline.json 의 minorFrom 이후(리스크 장면)는 단조 진행으로 바꿔 톤을 낮춘다. 숫자가 나올 때마다 작은 벨.
// 사용: node scripts/bgm-networth.mjs → public/bgm/networth.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/networth/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const f2s = (f) => f / TL.fps;
const MINOR_AT = f2s(TL.minorFrom);
const OUTRO_AT = f2s(TL.scenes[TL.scenes.length - 1].from);

const mix = new Float32Array(LENGTH);
const add = (startSec, buf, gain) => {
  const s = Math.round(startSec * RATE);
  for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
};
const hz = (m) => 440 * 2 ** ((m + 2 - 69) / 12); // 원본보다 한 음 높게
const lowpass = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y);
  return buf;
};
const noise = (sec, decay) => {
  const n = Math.round(sec * RATE);
  const b = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) { const x = Math.random() * 2 - 1; b[i] = (x - prev) * Math.exp((-i / RATE) * decay); prev = x; }
  return b;
};

// 일렉 피아노: 사인 + 2배음, 짧은 트레몰로
const ep = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 6)) * Math.exp(-t * 2.2) * (1 + 0.08 * Math.sin(2 * Math.PI * 5 * t)) * Math.min(1, i / 80);
  }
  return b;
};
const pad = (notes, sec) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  for (const m of notes) for (const d of [-0.07, 0.07]) {
    const f = hz(m + d);
    for (let i = 0; i < n; i++) b[i] += ((((i / RATE) * f) % 1) * 2 - 1);
  }
  lowpass(b, 700);
  const att = 0.6 * RATE, rel = 0.8 * RATE;
  for (let i = 0; i < n; i++) b[i] *= Math.min(1, i / att, (n - i) / rel) / (notes.length * 2);
  return b;
};
const kick = () => {
  const n = Math.round(0.3 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * (48 + 80 * Math.exp(-t * 30))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 10); }
  return b;
};
const rim = () => lowpass(noise(0.08, 70), 3500);
const bell = (m) => {
  const f = hz(m), n = Math.round(1.2 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 4)) * Math.exp(-t * 3.5); }
  return b;
};

// 장조: Fmaj7 - Am7 - Dm7 - Bbmaj7 / 단조(리스크): Dm - Bb - Gm - A
const MAJOR = [
  { root: 41, notes: [57, 60, 64, 65] },
  { root: 45, notes: [55, 60, 64, 69] },
  { root: 38, notes: [53, 57, 60, 62] },
  { root: 46, notes: [53, 57, 62, 65] },
];
const MINOR = [
  { root: 38, notes: [50, 53, 57, 62] },
  { root: 46, notes: [50, 53, 58, 62] },
  { root: 43, notes: [50, 55, 58, 62] },
  { root: 45, notes: [49, 52, 57, 61] },
];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen;
  const minor = t0 >= MINOR_AT - 0.01 && t0 < OUTRO_AT;
  const outro = t0 >= OUTRO_AT;
  const ch = (minor ? MINOR : MAJOR)[bar % 4];
  add(t0, pad(ch.notes, barLen + 0.6), 0.5);
  // 플럭 리듬: 1, 2&, 3&, 4
  for (const [b, v] of [[0, 1], [1.5, 0.7], [2.5, 0.8], [3, 0.6]]) for (const [k, m] of ch.notes.entries()) add(t0 + b * BEAT + k * 0.012, ep(m + 12, 1.0), 0.06 * v);
  add(t0, ep(ch.root, 2.0), 0.28);
  add(t0 + 2 * BEAT, ep(ch.root + 7, 1.5), 0.18);
  if (bar === 0 || outro) continue; // 첫 마디·마무리는 비트 없이
  for (let b = 0; b < 4; b++) {
    if (b % 2 === 0) add(t0 + b * BEAT, kick(), minor ? 0.5 : 0.6);
    else add(t0 + b * BEAT, rim(), 0.25);
    add(t0 + b * BEAT + BEAT / 2, noise(0.05, 110), 0.07);
    add(t0 + b * BEAT, noise(0.04, 140), 0.04);
  }
}

// 장면 전환 전 부드러운 스웰, 숫자 등장마다 작은 벨
for (const f of TL.risers) {
  const end = f2s(f), dur = 1.2, n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) { const q = i / n; const a = 1 - Math.exp((-2 * Math.PI * (300 + q * q * 4000)) / RATE); y += a * ((Math.random() * 2 - 1) - y); b[i] = y * q * q; }
  add(end - dur, b, 0.18);
}
for (const f of TL.hits) {
  const minor = f2s(f) >= MINOR_AT && f2s(f) < OUTRO_AT;
  add(f2s(f), bell(minor ? 74 : 81), 0.16);
}

const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
for (let i = 0; i < LENGTH; i++) data.writeInt16LE(Math.round(Math.tanh((mix[i] / peak) * 1.2) * 0.85 * 32767), i * 2);
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
writeFileSync(new URL("networth.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/networth.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, 단조 전환 ${MINOR_AT.toFixed(1)}초)`);
