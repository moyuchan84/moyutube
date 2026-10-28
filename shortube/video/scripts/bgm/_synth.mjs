// 배경음악 합성 공용 부품 (mvrace · sidecar · stockpile 이 쓴다). 편마다 악기 · 진행만 다르게 고른다.
// 버퍼는 Float32Array, 시간은 초. 마지막에 writeWav 가 정규화 · 소프트 클립 · 페이드아웃을 한다.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const RATE = 44100;
export const hz = (m) => 440 * 2 ** ((m - 69) / 12);

// 편의 timeline.json 을 읽어 믹스 버퍼와 add() 를 준비한다
export const session = (code) => {
  const TL = JSON.parse(readFileSync(new URL(`../../../content/${code}/script/timeline.json`, import.meta.url), "utf8"));
  const SEC = TL.total / TL.fps;
  const LENGTH = Math.round(SEC * RATE);
  const mix = new Float32Array(LENGTH);
  const add = (startSec, buf, gain) => {
    const s = Math.round(startSec * RATE);
    for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
  };
  return { TL, SEC, LENGTH, mix, add, BEAT: 60 / TL.bpm, f2s: (f) => f / TL.fps };
};

const buf = (sec) => new Float32Array(Math.round(sec * RATE));
const env = (i, n, a, r) => Math.min(1, i / (a * RATE + 1)) * Math.min(1, (n - i) / (r * RATE + 1));

// 파형 하나: kind = sine | saw | square | tri, 감쇠 decay(1/초), 비브라토 없음
export const tone = (m, sec, { kind = "sine", decay = 0, attack = 0.005, release = 0.05, detune = 0, duty = 0.5 } = {}) => {
  const b = buf(sec), n = b.length, f = hz(m) * (1 + detune);
  for (let i = 0; i < n; i++) {
    const t = i / RATE, ph = (f * t) % 1;
    let v;
    if (kind === "saw") v = 2 * ph - 1;
    else if (kind === "square") v = ph < duty ? 1 : -1;
    else if (kind === "tri") v = 1 - 4 * Math.abs(ph - 0.5);
    else v = Math.sin(2 * Math.PI * ph);
    b[i] = v * Math.exp(-t * decay) * env(i, n, attack, release);
  }
  return b;
};

// 한 극 저역 통과 (톱니 · 사각파를 둥글게)
export const lowpass = (b, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < b.length; i++) b[i] = y += a * (b[i] - y);
  return b;
};

export const sum = (...bs) => {
  const n = Math.max(...bs.map((b) => b.length)), o = new Float32Array(n);
  for (const b of bs) for (let i = 0; i < b.length; i++) o[i] += b[i];
  return o;
};

export const noise = (sec, decay, hp = 0.9) => {
  const b = buf(sec);
  let prev = 0, y = 0;
  for (let i = 0; i < b.length; i++) {
    const x = Math.random() * 2 - 1;
    y = hp * (y + x - prev);
    prev = x;
    b[i] = y * Math.exp((-i / RATE) * decay);
  }
  return b;
};

export const kick = (punch = 1) => {
  const b = buf(0.4);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / RATE, f = 45 + 110 * punch * Math.exp(-t * 30);
    ph += (2 * Math.PI * f) / RATE;
    b[i] = Math.sin(ph) * Math.exp(-t * 8);
  }
  return b;
};

export const clap = () => {
  const b = noise(0.25, 22, 0.8);
  for (let i = 0; i < b.length; i++) { const t = i / RATE; if (t < 0.03) b[i] *= 0.6 + 0.4 * Math.sin(t * 600); }
  return b;
};

// 노이즈가 점점 커지는 상승음(라이저) 또는 휙
export const riser = (sec, up = true) => {
  const b = noise(sec, 0, 0.6), n = b.length;
  for (let i = 0; i < n; i++) { const t = i / n; b[i] *= up ? t * t : Math.sin(Math.PI * t) ** 2; }
  return b;
};

// 음높이가 미끄러지는 사인 (엔진 · 레이저 · 휘파람)
export const glide = (m0, m1, sec, { kind = "sine", decay = 0 } = {}) => {
  const b = buf(sec), n = b.length;
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, f = hz(m0 + (m1 - m0) * (i / n));
    ph += f / RATE;
    const p = ph % 1;
    const v = kind === "saw" ? 2 * p - 1 : kind === "square" ? (p < 0.5 ? 1 : -1) : Math.sin(2 * Math.PI * p);
    b[i] = v * Math.exp(-t * decay) * env(i, n, 0.01, 0.05);
  }
  return b;
};

// 킥에 맞춰 다른 소리를 눌러 주는 사이드체인 곡선 (박마다 0.25 → 1)
export const duck = (mix, startSec, everySec, depth = 0.6) => {
  for (let i = 0; i < mix.length; i++) {
    const t = i / RATE - startSec;
    if (t < 0) continue;
    const ph = (t % everySec) / everySec;
    mix[i] *= 1 - depth * Math.exp(-ph * 9);
  }
};

export const writeWav = (code, mix, { drive = 2.0, level = 0.6, fadeSec = 2 } = {}) => {
  const LENGTH = mix.length;
  const fade = Math.round(fadeSec * RATE);
  for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
  for (let i = 0; i < Math.min(800, LENGTH); i++) mix[i] *= i / 800;
  const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  const data = Buffer.alloc(LENGTH * 2);
  let sq = 0;
  for (let i = 0; i < LENGTH; i++) { const v = Math.tanh((mix[i] / peak) * drive) * level; sq += v * v; data.writeInt16LE(Math.round(v * 32767), i * 2); }
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
  const outDir = new URL(`../../../content/${code}/music/`, import.meta.url);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(new URL(`${code}.wav`, outDir), Buffer.concat([header, data]));
  console.log(`content/${code}/music/${code}.wav (${(LENGTH / RATE).toFixed(1)}초, RMS ${(20 * Math.log10(Math.sqrt(sq / LENGTH))).toFixed(1)} dBFS)`);
};
