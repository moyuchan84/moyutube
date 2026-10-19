// 간밤 미국장 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-heat.mjs 를 바탕으로 분위기만 바꿨다.
// 76BPM · 심해 느낌: 낮은 단조 드론 패드 + 물방울 플럭(drops) + 숫자 타격마다 묵직한 서브 킥,
// timeline.json 의 calmFrom 이후(의견·마무리)는 킥을 빼고 맑은 벨로 가라앉는다.
// 사용: node scripts/bgm-usmarket.mjs → public/bgm/usmarket.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/usmarket/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const f2s = (f) => f / TL.fps;
const CALM_AT = f2s(TL.calmFrom);

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
const pad = (notes, sec) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  for (const m of notes) for (const d of [-0.09, 0.09]) {
    const f = hz(m + d);
    for (let i = 0; i < n; i++) b[i] += ((((i / RATE) * f) % 1) * 2 - 1);
  }
  lowpass(b, 520);
  const att = 0.8 * RATE, rel = 1.0 * RATE;
  for (let i = 0; i < n; i++) b[i] *= Math.min(1, i / att, (n - i) / rel) / (notes.length * 2);
  return b;
};
const sub = () => {
  const n = Math.round(0.7 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * (38 + 60 * Math.exp(-t * 22))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 5.5); }
  return b;
};
// 물방울: 사인이 위로 휘어 올라가며 사라진다
const drop = (m) => {
  const f0 = hz(m), n = Math.round(0.5 * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * f0 * (1 + 1.6 * (1 - Math.exp(-t * 28)))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 11) * Math.min(1, i / 60); }
  return b;
};
const bell = (m) => {
  const f = hz(m), n = Math.round(1.6 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 4)) * Math.exp(-t * 2.8); }
  return b;
};

// 깊은 구간: Dm - Bb - Gm - A (낮게) / 가라앉은 뒤: Fmaj7 - Dm7 - Bbmaj7 - C (한 옥타브 위, 밝게)
const DEEP = [
  { root: 38, notes: [50, 53, 57, 62] },
  { root: 34, notes: [50, 53, 58, 62] },
  { root: 43, notes: [50, 55, 58, 62] },
  { root: 45, notes: [49, 52, 57, 61] },
];
const CALM = [
  { root: 41, notes: [60, 64, 67, 72] },
  { root: 38, notes: [60, 62, 65, 69] },
  { root: 46, notes: [62, 65, 69, 70] },
  { root: 36, notes: [60, 64, 67, 71] },
];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen;
  const calm = t0 >= CALM_AT - 0.01;
  const ch = (calm ? CALM : DEEP)[bar % 4];
  add(t0, pad(ch.notes, barLen + 0.8), calm ? 0.45 : 0.62);
  add(t0, pad([ch.root], barLen + 0.8), 0.5);
  if (calm) for (let k = 0; k < 4; k++) add(t0 + k * BEAT, bell(ch.notes[(k * 2) % 4] + 12), 0.07);
}

// 장면 전환 전 스웰
for (const f of TL.risers) {
  const end = f2s(f), dur = 1.0, n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) { const q = i / n; const a = 1 - Math.exp((-2 * Math.PI * (200 + q * q * 2600)) / RATE); y += a * ((Math.random() * 2 - 1) - y); b[i] = y * q * q; }
  add(end - dur, b, 0.2);
}
// 숫자가 박히는 순간: 서브 킥 (calm 이후엔 벨)
for (const f of TL.hits) {
  if (f2s(f) >= CALM_AT) add(f2s(f), bell(74), 0.14);
  else add(f2s(f), sub(), 0.55);
}
// 물방울: 막대가 늘어나거나 칸이 떨어질 때
for (const [i, f] of TL.drops.entries()) add(f2s(f), drop(76 + (i % 5) * 2), 0.16);

const fade = Math.round(2 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
let sq = 0;
for (let i = 0; i < LENGTH; i++) { const v = Math.tanh((mix[i] / peak) * 1.2) * 0.85; sq += v * v; data.writeInt16LE(Math.round(v * 32767), i * 2); }
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
writeFileSync(new URL("usmarket.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/usmarket.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS, 가라앉는 전환 ${CALM_AT.toFixed(1)}초)`);
