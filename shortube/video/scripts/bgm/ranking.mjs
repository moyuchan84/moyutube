// 배경음악을 코드로 합성한다 (저작권 걱정 없는 소리 — 패드 · 베이스 · 킥 · 하이햇 · 아르페지오의 차분한 일렉트로닉 40초).
// 사용: node scripts/bgm/ranking.mjs   → content/ranking/music/data-pulse.wav (120BPM, 20마디 = 40초, 끝 2초 페이드아웃)
// 다른 길이의 영상이면 BARS 를 바꾼다 (한 마디 = 2초).
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BARS = 20;
const LENGTH = Math.round(BARS * 4 * BEAT * RATE);

const outDir = new URL("../../../content/ranking/music/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const mix = new Float32Array(LENGTH);
const add = (start, samples, gain) => {
  for (let i = 0; i < samples.length && start + i < LENGTH; i++) mix[start + i] += samples[i] * gain;
};
const at = (bar, beat) => Math.round((bar * 4 + beat) * BEAT * RATE);
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// 한 극 저역 통과 필터
const lowpass = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y);
  return buf;
};

// 살짝 어긋난 톱니파 두 개를 겹친 패드 (천천히 커졌다 작아진다)
const pad = (notes, seconds) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  for (const n of notes) {
    for (const detune of [-0.12, 0.12]) {
      const f = hz(n + detune);
      for (let i = 0; i < out.length; i++) out[i] += ((i * f) / RATE) % 1 * 2 - 1;
    }
  }
  lowpass(out, 900);
  lowpass(out, 900);
  const att = 0.35 * RATE;
  const rel = 0.5 * RATE;
  for (let i = 0; i < out.length; i++) out[i] *= Math.min(1, i / att, (out.length - i) / rel) / notes.length;
  return out;
};

const bass = (n, seconds) => {
  const f = hz(n);
  const out = new Float32Array(Math.round(seconds * RATE));
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    out[i] = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t * 2.2) * Math.min(1, i / 200);
  }
  return out;
};

const kick = () => {
  const out = new Float32Array(Math.round(0.35 * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    phase += (2 * Math.PI * (48 + 110 * Math.exp(-t * 30))) / RATE;
    out[i] = Math.sin(phase) * Math.exp(-t * 9);
  }
  return out;
};

const hat = (seconds, decay) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let prev = 0;
  for (let i = 0; i < out.length; i++) {
    const noise = Math.random() * 2 - 1;
    out[i] = (noise - prev) * Math.exp((-i / RATE) * decay);
    prev = noise;
  }
  return out;
};

// 사각파 느낌의 짧은 플럭 (아르페지오)
const blip = (n, seconds) => {
  const f = hz(n);
  const out = new Float32Array(Math.round(seconds * RATE));
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const s = Math.sin(2 * Math.PI * f * t) + Math.sin(6 * Math.PI * f * t) / 3 + Math.sin(10 * Math.PI * f * t) / 5;
    out[i] = s * Math.exp(-t * 7) * Math.min(1, i / 60);
  }
  return lowpass(out, 3200);
};

// Am - F - C - G (MIDI: 패드 코드, 베이스 근음, 아르페지오 음)
const CHORDS = [
  { pad: [57, 60, 64, 69], root: 45, arp: [69, 72, 76, 72] },
  { pad: [53, 57, 60, 65], root: 41, arp: [65, 69, 72, 69] },
  { pad: [55, 60, 64, 67], root: 48, arp: [67, 72, 76, 72] },
  { pad: [55, 59, 62, 67], root: 43, arp: [67, 71, 74, 79] },
];

for (let bar = 0; bar < BARS; bar++) {
  const ch = CHORDS[bar % 4];
  const outro = bar >= BARS - 2;
  add(at(bar, 0), pad(ch.pad, 4 * BEAT + 0.4), 0.55);
  // 아르페지오: 8분음표, 처음부터 끝까지
  for (let e = 0; e < 8; e++) add(at(bar, e / 2), blip(ch.arp[e % 4] + (e >= 4 ? 12 : 0), 0.4), e % 2 ? 0.1 : 0.14);
  if (bar < 1 || outro) continue; // 첫 마디와 마지막 두 마디는 리듬 없이
  add(at(bar, 0), bass(ch.root, 0.9), 0.5);
  add(at(bar, 1.5), bass(ch.root, 0.4), 0.3);
  add(at(bar, 2), bass(ch.root + 7, 0.9), 0.4);
  for (const b of [0, 2]) add(at(bar, b), kick(), 0.55);
  for (let e = 0; e < 8; e++) add(at(bar, e / 2), hat(0.06, e % 2 ? 70 : 120), e % 2 ? 0.12 : 0.05);
  if (bar % 2) add(at(bar, 3.5), hat(0.25, 14), 0.07); // 두 마디마다 열린 하이햇
}

// 끝 2초 페이드아웃
const fade = 2 * RATE;
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;

const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
for (let i = 0; i < LENGTH; i++) data.writeInt16LE(Math.round((mix[i] / peak) * 0.8 * 32767), i * 2);
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
writeFileSync(new URL("data-pulse.wav", outDir), Buffer.concat([header, data]));
console.log(`content/ranking/music/data-pulse.wav (${(LENGTH / RATE).toFixed(1)}초)`);
