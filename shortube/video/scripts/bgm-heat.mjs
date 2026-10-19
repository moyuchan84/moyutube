// 폭염 쇼츠 배경음악을 코드로 합성한다 (저작권 걱정 없음). bgm-info.mjs 를 바탕으로 분위기만 바꿨다.
// 84BPM · 더운 구간: 낮게 깔린 단조 패드 + 무거운 킥 + 일렁이는 고음(아지랑이),
// timeline.json 의 coolFrom 이후(식는 장면~끝)는 맑은 장조 + 벨, 비트 없이 가볍게.
// 사용: node scripts/bgm-heat.mjs → public/bgm/heat.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/heat/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const f2s = (f) => f / TL.fps;
const COOL_AT = f2s(TL.coolFrom);

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

// 아지랑이 고음: 살짝 어긋난 두 사인이 천천히 맥놀이
const shimmer = (m, sec) => {
  const f = hz(m), n = Math.round(sec * RATE), b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * (f * 1.006) * t)) * 0.5 * Math.min(1, t / 0.8, (sec - t) / 0.8) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.7 * t));
  }
  return b;
};

// 더위: Am - F - Dm - E (낮게) / 식음: Cmaj7 - G - Am7 - Fmaj7 (한 옥타브 위)
const HEATED = [
  { root: 33, notes: [45, 48, 52, 57] },
  { root: 29, notes: [45, 48, 53, 57] },
  { root: 38, notes: [45, 50, 53, 57] },
  { root: 40, notes: [44, 47, 52, 56] },
];
const COOLED = [
  { root: 48, notes: [64, 67, 71, 72] },
  { root: 43, notes: [62, 67, 71, 74] },
  { root: 45, notes: [64, 67, 69, 72] },
  { root: 41, notes: [64, 65, 69, 72] },
];
const barLen = 4 * BEAT;
const bars = Math.ceil(SEC / barLen);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * barLen;
  const cool = t0 >= COOL_AT - 0.01;
  const ch = (cool ? COOLED : HEATED)[bar % 4];
  const p = pad(ch.notes, barLen + 0.6);
  if (!cool) lowpass(p, 450);
  add(t0, p, cool ? 0.4 : 0.6);
  if (cool) {
    // 맑은 아르페지오
    for (let k = 0; k < 8; k++) add(t0 + k * (BEAT / 2), ep(ch.notes[k % 4] + 12, 1.0), 0.07);
    add(t0, ep(ch.root, 2.0), 0.2);
    continue;
  }
  add(t0, shimmer(ch.notes[3] + 24, barLen + 0.3), 0.05);
  add(t0, ep(ch.root, 2.4), 0.32);
  if (bar === 0) continue; // 첫 마디는 비트 없이
  for (let b = 0; b < 4; b++) {
    if (b % 2 === 0) add(t0 + b * BEAT, kick(), 0.7);
    else add(t0 + b * BEAT, rim(), 0.18);
    add(t0 + b * BEAT + BEAT / 2, noise(0.06, 90), 0.05);
  }
}

// 식기 직전: 아래로 떨어지는 휘익 소리 (coolFrom 에 맞춰)
{
  const dur = 1.0, n = Math.round(dur * RATE), b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE; ph += (2 * Math.PI * (1400 * Math.exp(-t * 3) + 120)) / RATE; b[i] = Math.sin(ph) * (1 - t / dur) * 0.6; }
  add(COOL_AT - 0.2, b, 0.25);
}

// 장면 전환 전 부드러운 스웰, 숫자 타격마다 벨, 지도 지점이 켜질 때 작은 플럭
for (const f of TL.risers) {
  const end = f2s(f), dur = 1.2, n = Math.round(dur * RATE), b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) { const q = i / n; const a = 1 - Math.exp((-2 * Math.PI * (300 + q * q * 4000)) / RATE); y += a * ((Math.random() * 2 - 1) - y); b[i] = y * q * q; }
  add(end - dur, b, 0.18);
}
for (const f of TL.hits) {
  const cool = f2s(f) >= COOL_AT;
  add(f2s(f), bell(cool ? 84 : 69), 0.18);
  if (!cool) add(f2s(f), kick(), 0.5);
}
for (const [i, f] of TL.pops.entries()) add(f2s(f), ep(76 + (i % 4) * 2, 0.5), 0.12);

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
writeFileSync(new URL("heat.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/heat.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, 식는 전환 ${COOL_AT.toFixed(1)}초)`);
