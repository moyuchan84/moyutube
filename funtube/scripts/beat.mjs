// content/song.json 의 구조대로 비트를 코드로 합성해 public/bgm/ride.wav 로 저장한다. (API 없음, 무료)
// 사용법: node scripts/beat.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const song = JSON.parse(fs.readFileSync(path.join(ROOT, "content/song.json"), "utf8"));
const SR = 44100;

// 매번 같은 소리가 나오도록 고정 시드 잡음
let seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const noise = () => rnd() * 2 - 1;

// 타임라인 (src/songTimeline.ts 와 같은 계산)
let t = song.lead;
const secs = song.sections.map((s) => {
  const start = t;
  const beats = s.bpm ? s.lines.reduce((a, l) => a + l.beats, 0) : 0;
  t += s.bpm ? (beats * 60) / s.bpm : s.lines.reduce((a, l) => a + l.seconds, 0);
  return { ...s, start, beats, end: t };
});
const buf = new Float32Array(Math.ceil((t + 0.5) * SR));

const tone = (t0, dur, fn, gain) => {
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) buf[i0 + i] += fn(i / SR, i / n) * gain;
};
const kick = (t0, g = 1) => tone(t0, 0.24, (x, p) => Math.sin(2 * Math.PI * (45 * x + 105 * 0.04 * (1 - Math.exp(-x / 0.04)))) * (1 - p) ** 2, 0.9 * g);
const snare = (t0) => tone(t0, 0.18, (x, p) => (noise() * 0.7 + Math.sin(2 * Math.PI * 190 * x) * 0.4) * (1 - p) ** 3, 0.55);
const hat = (t0, g = 1) => tone(t0, 0.05, (x, p) => noise() * (1 - p) ** 5, 0.22 * g);
const bass = (t0, f, dur) => tone(t0, dur, (x) => (Math.sin(2 * Math.PI * f * x) + 0.5 * Math.sin(4 * Math.PI * f * x)) * Math.exp(-x / 0.22), 0.5);
const lead = (t0, f, dur, g) =>
  tone(t0, dur, (x, p) => (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * f * x + 0.25 * Math.sin(2 * Math.PI * 6 * x))) * Math.min(1, x * 80) * (1 - p) ** 0.6, g);

const ROOTS = [55, 55, 65.41, 49];
const MELODY = [
  [440, 523.25, 587.33, 523.25],
  [440, 392, 440, 523.25],
  [587.33, 659.25, 587.33, 523.25],
  [440, 392, 329.63, 392],
];

for (const s of secs) {
  if (!s.bpm) {
    if (s.style === "drop") for (const b of [0, 0.3, 0.9, 1.2]) tone(s.start + b, 0.22, (x, p) => Math.sin(2 * Math.PI * 52 * x) * (1 - p) ** 2, 1);
    continue;
  }
  const beat = 60 / s.bpm;
  for (let b = 0; b < s.beats; b++) {
    const tb = s.start + b * beat;
    const bar = Math.floor(b / 4);
    const e = s.energy;
    kick(tb, e === 0 ? 0.55 : 1);
    if (e >= 1 && b % 4 === 2) snare(tb);
    if (e >= 3 && b % 4 === 3) snare(tb + beat * 0.5);
    if (e >= 1) hat(tb + beat * 0.5, 0.8);
    if (e >= 3) { hat(tb + beat * 0.25, 0.5); hat(tb + beat * 0.75, 0.5); }
    if (e >= 4) hat(tb, 0.7);
    if (e >= 1) bass(tb, ROOTS[bar % 4], beat * 0.9);
    if (e >= 2) bass(tb + beat * 0.5, ROOTS[bar % 4] * 2, beat * 0.4);
    if (e >= 2 && s.style !== "bridge") lead(tb, MELODY[bar % 4][b % 4] * (e >= 4 ? 2 : 1), beat * 0.9, 0.2);
    if (s.style === "bridge") {
      if (b % 4 === 0) lead(tb, 220 * (1 + 0.12 * bar), beat * 1.8, 0.16);
      if (bar === 3) tone(tb, beat, (x, p) => noise() * p * 0.8 + Math.sin(2 * Math.PI * (300 + 1500 * ((b % 4) + p) / 4) * x) * p * 0.4, 0.4);
    }
  }
}

const peak = buf.reduce((m, v) => Math.max(m, Math.abs(v)), 0.001);
const pcm = Buffer.alloc(buf.length * 2);
for (let i = 0; i < buf.length; i++) pcm.writeInt16LE(Math.round((buf[i] / peak) * 0.9 * 32767), i * 2);
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
const out = path.join(ROOT, "public/bgm/ride.wav");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.concat([h, pcm]));
console.log(`✅ ${out} (${t.toFixed(1)}초)`);
