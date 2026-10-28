// 서울 주택 공급 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). 84BPM 시네마틱 패드.
// 앞 장면은 단조(Am - F - C - G 느낌의 어두운 진행), 마지막 장(timeline.dawn 이후)은 장조로 밝아진다.
// 창문이 켜질 때(ticks)는 유리 같은 틱, 숫자가 박힐 때(hits)는 부드러운 종, 장면 전환(risers)은 낮게 솟는 소리.
// 사용: node scripts/bgm/seoulsupply.mjs → content/seoulsupply/music/seoulsupply.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../../../content/seoulsupply/script/timeline.json", import.meta.url), "utf8"));
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

// 패드: 살짝 어긋난 사인 3개, 느린 어택
const pad = (m, sec) => {
  const n = Math.round(sec * RATE), b = new Float32Array(n);
  const f = hz(m);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.6, (n - i) / (0.5 * RATE));
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.004 * t) + 0.4 * Math.sin(2 * Math.PI * f * 2 * t)) * env * 0.33;
  }
  return b;
};
const pluck = (m, dur = 0.5) => {
  const f = hz(m), n = Math.round(dur * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 18)) * Math.exp(-t * 6.5) * Math.min(1, i / 30);
  }
  return b;
};
const bell = (m) => {
  const f = hz(m), n = Math.round(1.6 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.45 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 5)) * Math.exp(-t * 3);
  }
  return b;
};
const glass = (m) => {
  const f = hz(m), n = Math.round(0.14 * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / RATE; b[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 38); }
  return b;
};
const rise = (dur) => {
  const n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0, ph = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n, env = Math.sin(Math.PI * q) ** 1.5;
    ph += (2 * Math.PI * (70 + 230 * q)) / RATE;
    const a = 1 - Math.exp((-2 * Math.PI * (300 + 1500 * q)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = (Math.sin(ph) * 0.6 + y * 0.8) * env;
  }
  return b;
};

// 진행: 코드당 2마디(8박). 앞은 Am F C G, 새벽 이후는 C G Am F.
const MINOR = [
  { root: 33, tones: [57, 60, 64] },
  { root: 29, tones: [57, 60, 65] },
  { root: 36, tones: [55, 60, 64] },
  { root: 31, tones: [55, 59, 62] },
];
const BRIGHT = [
  { root: 36, tones: [60, 64, 67] },
  { root: 31, tones: [59, 62, 67] },
  { root: 33, tones: [60, 64, 69] },
  { root: 29, tones: [60, 65, 69] },
];
const chordLen = 8 * BEAT;
const dawnSec = f2s(TL.dawn);
const n = Math.ceil(SEC / chordLen);
for (let c = 0; c < n; c++) {
  const t0 = c * chordLen;
  const set = t0 >= dawnSec - 0.01 ? BRIGHT : MINOR;
  const ch = set[c % 4];
  add(t0, pad(ch.root, chordLen + 0.4), 0.3);
  for (const m of ch.tones) add(t0, pad(m, chordLen + 0.4), 0.17);
  add(t0, pad(ch.root - 12, chordLen), 0.2);
  // 느린 아르페지오
  for (let k = 0; k < 8; k++) add(t0 + k * BEAT, pluck(ch.tones[[0, 1, 2, 1, 2, 1, 0, 2][k]] + 12), k % 2 === 0 ? 0.14 : 0.09);
}
for (const f of TL.risers) add(f2s(f) - 0.25, rise(0.7), 0.13);
for (const f of TL.hits) add(f2s(f), bell(f2s(f) >= dawnSec ? 88 : 81), 0.1);
for (const [i, f] of TL.ticks.entries()) add(f2s(f), glass(88 + (i % 4) * 3), 0.06);

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
const outDir = new URL("../../../content/seoulsupply/music/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("seoulsupply.wav", outDir), Buffer.concat([header, data]));
console.log(`content/seoulsupply/music/seoulsupply.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
