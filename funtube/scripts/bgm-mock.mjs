// 조롱하는 듯한 장난스러운 배경음악을 코드로 합성해 public/bgm/<name>.wav 로 저장한다. (API 없음, 무료, 저작권 걱정 없음)
// 사용법: node scripts/bgm-mock.mjs <초> [이름=mock]
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SECONDS = Number(process.argv[2] ?? 60);
const NAME = process.argv[3] ?? "mock";
const SR = 44100;
const BPM = 112;
const BEAT = 60 / BPM;

const buf = new Float32Array(Math.ceil(SECONDS * SR));
const tone = (t0, dur, fn, gain) => {
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) buf[i0 + i] += fn(i / SR, i / n) * gain;
};
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// 마림바: 사인 + 4배음, 빠르게 줄어든다
const marimba = (t0, midi, dur = 0.25, g = 0.5) =>
  tone(t0, dur, (x) => (Math.sin(2 * Math.PI * hz(midi) * x) + 0.35 * Math.sin(8 * Math.PI * hz(midi) * x)) * Math.exp(-x / 0.09), g);
// 튜바: 낮은 사각파에 가까운 소리
const tuba = (t0, midi, dur = 0.3, g = 0.5) =>
  tone(t0, dur, (x, p) => Math.tanh(2.2 * Math.sin(2 * Math.PI * hz(midi) * x)) * Math.min(1, x * 60) * (1 - p) ** 0.7, g);
// 스타카토 화음 한 방
const stab = (t0, midis, g = 0.16) =>
  midis.forEach((m) => tone(t0, 0.11, (x, p) => ((Math.sin(2 * Math.PI * hz(m) * x) > 0 ? 1 : -1) * 0.6 + Math.sin(2 * Math.PI * hz(m) * x) * 0.4) * (1 - p) ** 2, g));
// 슬라이드 트롬본(와~와~): 음이 미끄러져 내려간다
const wah = (t0, midiFrom, midiTo, dur, g = 0.4) =>
  tone(t0, dur, (x, p) => {
    const f = hz(midiFrom + (midiTo - midiFrom) * p);
    const wob = 1 + 0.35 * Math.sin(2 * Math.PI * 5 * x);
    return Math.tanh(1.6 * Math.sin(2 * Math.PI * f * x * wob)) * Math.min(1, x * 40) * (1 - p) ** 0.5;
  }, g);

// 4마디 한 바퀴: Am - Dm - E7 - Am
const CHORDS = [
  { root: 33, fifth: 40, stab: [57, 60, 64] }, // Am
  { root: 38, fifth: 45, stab: [57, 62, 65] }, // Dm
  { root: 40, fifth: 47, stab: [56, 59, 62] }, // E7
  { root: 33, fifth: 40, stab: [57, 60, 64] }, // Am
];
// "약 오르지~" 놀리는 가락 (E C E C F E C, 8분음표). 마디마다 쉬는 박을 두고 반복
const TAUNT = [76, 72, 76, 72, 77, 76, 72];
const FILL = [69, 71, 72, 74, 76]; // 마지막 마디에서 올라가는 마무리

const BAR = BEAT * 4;
const bars = Math.ceil(SECONDS / BAR);
for (let b = 0; b < bars; b++) {
  const c = CHORDS[b % 4];
  const t = b * BAR;
  // 움-파: 1,3박 튜바, 2,4박 화음
  tuba(t, c.root + 12, BEAT * 0.8);
  stab(t + BEAT, c.stab);
  tuba(t + BEAT * 2, c.fifth, BEAT * 0.8);
  stab(t + BEAT * 3, c.stab);
  // 첫 4마디(인트로)는 리듬만, 그 뒤로 가락이 얹힌다
  if (b >= 4) {
    if (b % 4 === 1 || b % 4 === 3) TAUNT.forEach((m, i) => marimba(t + i * BEAT * 0.5, m + (b % 4 === 3 ? -2 : 0), 0.22, 0.42));
    else if (b % 4 === 2) FILL.forEach((m, i) => marimba(t + i * BEAT * 0.5, m + 12, 0.22, 0.34));
  }
}
// 맨 끝: 놀리는 트롬본 "와~ 와~ 와~"
const endAt = SECONDS - BEAT * 3.2;
if (endAt > 0) {
  wah(endAt, 62, 60, BEAT * 0.9);
  wah(endAt + BEAT, 60, 58, BEAT * 0.9);
  wah(endAt + BEAT * 2, 58, 52, BEAT * 1.2);
}

// 정규화 + 스테레오 16bit wav
let peak = 0;
for (const v of buf) peak = Math.max(peak, Math.abs(v));
const gain = peak > 0 ? 0.7 / peak : 1;
const fade = Math.floor(0.4 * SR);
const out = Buffer.alloc(44 + buf.length * 4);
out.write("RIFF", 0); out.writeUInt32LE(36 + buf.length * 4, 4); out.write("WAVEfmt ", 8);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write("data", 36); out.writeUInt32LE(buf.length * 4, 40);
for (let i = 0; i < buf.length; i++) {
  const edge = Math.min(1, i / fade, (buf.length - i) / fade);
  const s = Math.max(-1, Math.min(1, buf[i] * gain * edge)) * 32767;
  out.writeInt16LE(s, 44 + i * 4);
  out.writeInt16LE(s, 46 + i * 4);
}
const file = path.join(ROOT, "public/bgm", `${NAME}.wav`);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, out);
console.log(`저장: ${path.relative(ROOT, file)} (${SECONDS}초, ${BPM} BPM)`);
