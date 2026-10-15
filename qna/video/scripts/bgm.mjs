// 배경음악을 코드로 합성한다 (저작권 걱정 없는 소리 — 우쿨렐레 스트럼 · 베이스 · 셰이커의 밝은 8마디 루프).
// 사용: node scripts/bgm.mjs          → public/bgm/cheerful.wav (끝과 처음이 이어지는 루프)
// 다른 곡을 쓰려면 public/bgm/<이름>.wav 를 넣고 script.json 의 "bgm" 에 그 이름을 적는다.
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 44100;
const BPM = 104;
const BEAT = 60 / BPM;
const BARS = 8;
const LENGTH = Math.round(BARS * 4 * BEAT * RATE);
const SWING = 0.12; // 엇박을 살짝 늦춘다

const outDir = new URL("../public/bgm/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const mix = new Float32Array(LENGTH);
// 루프라서 끝을 넘어간 여운은 처음으로 돌려 더한다
const add = (start, samples, gain) => {
  for (let i = 0; i < samples.length; i++) mix[(start + i) % LENGTH] += samples[i] * gain;
};

// 줄 뜯는 소리 (Karplus-Strong)
const pluck = (freq, seconds, bright = 0.5) => {
  const n = Math.round(RATE / freq);
  const line = new Float32Array(n);
  for (let i = 0; i < n; i++) line[i] = Math.random() * 2 - 1;
  for (let pass = 0; pass < 2; pass++) for (let i = 1; i < n; i++) line[i] = line[i] * bright + line[i - 1] * (1 - bright);
  const out = new Float32Array(Math.round(seconds * RATE));
  for (let i = 0; i < out.length; i++) {
    const a = i % n;
    const b = (i + 1) % n;
    out[i] = line[a];
    line[a] = (line[a] + line[b]) * 0.4975;
  }
  const fade = Math.round(0.03 * RATE);
  for (let i = 0; i < fade; i++) out[out.length - 1 - i] *= i / fade;
  return out;
};

const shaker = (seconds) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let prev = 0;
  for (let i = 0; i < out.length; i++) {
    const noise = Math.random() * 2 - 1;
    out[i] = (noise - prev) * Math.exp((-i / RATE) * 60); // 고음만 남긴 짧은 소음
    prev = noise;
  }
  return out;
};

const NOTE = { C3: 130.81, G2: 98.0, A2: 110.0, E3: 164.81, F2: 87.31, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 };
// 우쿨렐레 코드(4줄)와 베이스의 근음 · 5음
const CHORD = {
  C: { strings: ["G4", "C4", "E4", "C5"], bass: ["C3", "G2"] },
  Am: { strings: ["A4", "C4", "E4", "A4"], bass: ["A2", "E3"] },
  F: { strings: ["A4", "C4", "F4", "A4"], bass: ["F2", "C3"] },
  G: { strings: ["G4", "D4", "G4", "B4"], bass: ["G2", "D4"] },
};
const BARS_OF = ["C", "C", "Am", "Am", "F", "F", "G", "G"];
// 한 마디의 스트럼: [박, 내려치기?, 세기]
const STRUM = [[0, true, 1], [1, true, 0.7], [1.5, false, 0.5], [2.5, false, 0.6], [3, true, 0.8], [3.5, false, 0.5]];
// 두 마디마다 한 번 얹는 짧은 가락: [마디, 박, 음]
const TUNE = [[1, 2, "E5"], [1, 3, "G5"], [3, 2, "E5"], [3, 3, "C5"], [5, 2, "C5"], [5, 3, "A4"], [7, 2, "D5"], [7, 3, "G5"]];

const at = (bar, beat) => {
  const swung = beat % 1 ? beat + SWING : beat;
  return Math.round((bar * 4 + swung) * BEAT * RATE);
};

BARS_OF.forEach((name, bar) => {
  const chord = CHORD[name];
  for (const [beat, down, vel] of STRUM) {
    const strings = down ? chord.strings : [...chord.strings].reverse();
    strings.forEach((s, i) => add(at(bar, beat) + Math.round(i * 0.014 * RATE), pluck(NOTE[s], 0.9, 0.55), 0.22 * vel));
  }
  add(at(bar, 0), pluck(NOTE[chord.bass[0]], 1.0, 0.25), 0.5);
  add(at(bar, 2), pluck(NOTE[chord.bass[1]] > 200 ? NOTE[chord.bass[1]] / 2 : NOTE[chord.bass[1]], 1.0, 0.25), 0.4);
  for (let eighth = 0; eighth < 8; eighth++) add(at(bar, eighth / 2), shaker(0.08), eighth % 2 ? 0.1 : 0.05);
});
for (const [bar, beat, note] of TUNE) add(at(bar, beat), pluck(NOTE[note], 0.7, 0.7), 0.2);

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
writeFileSync(new URL("cheerful.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/cheerful.wav (${(LENGTH / RATE).toFixed(1)}초 루프)`);
