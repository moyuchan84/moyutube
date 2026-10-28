// WAV(16bit PCM) 읽기 · 쓰기 · 자르기 · 잇기 — 프로젝트마다 따로 만들지 않고 이것을 쓴다.
// 샘플은 Float32Array(-1 ~ 1), 채널 1 또는 2.
import { readFileSync, writeFileSync } from "node:fs";

export const readWav = (path) => {
  const buf = readFileSync(path);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") throw new Error(`${path}: WAV 가 아니다`);
  let pos = 12;
  let fmt = null;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (id === "fmt ") fmt = { format: buf.readUInt16LE(pos + 8), channels: buf.readUInt16LE(pos + 10), rate: buf.readUInt32LE(pos + 12), bits: buf.readUInt16LE(pos + 22) };
    if (id === "data") {
      if (!fmt || fmt.format !== 1 || fmt.bits !== 16) throw new Error(`${path}: 16bit PCM 만 읽는다`);
      const n = Math.floor(size / 2);
      const samples = new Float32Array(n);
      for (let i = 0; i < n; i++) samples[i] = buf.readInt16LE(pos + 8 + i * 2) / 32768;
      return { rate: fmt.rate, channels: fmt.channels, samples };
    }
    pos += 8 + size + (size % 2);
  }
  throw new Error(`${path}: data 덩어리가 없다`);
};

// PCM 16bit 버퍼(Gemini TTS 원본 등) → WAV 버퍼
export const pcmToWav = (pcm, rate = 24000, channels = 1) => {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * channels * 2, 28);
  h.writeUInt16LE(channels * 2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
};

export const toPcm = (samples) => {
  const pcm = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), i * 2);
  return pcm;
};

export const writeWav = (path, { rate, channels = 1, samples }) => writeFileSync(path, pcmToWav(toPcm(samples), rate, channels));

export const silence = (seconds, rate, channels = 1) => new Float32Array(Math.round(seconds * rate) * channels);

export const concat = (parts) => {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
};

// 앞뒤 무음 자르기. threshold 는 0~1, pad 는 남길 여백(초)
export const trimSilence = ({ rate, channels = 1, samples }, { threshold = 0.015, pad = 0.05 } = {}) => {
  const frames = samples.length / channels;
  const loud = (f) => {
    for (let c = 0; c < channels; c++) if (Math.abs(samples[f * channels + c]) >= threshold) return true;
    return false;
  };
  let s = 0;
  let e = frames - 1;
  while (s < frames && !loud(s)) s++;
  while (e > s && !loud(e)) e--;
  const p = Math.round(pad * rate);
  s = Math.max(0, s - p);
  e = Math.min(frames - 1, e + p);
  return { rate, channels, samples: samples.slice(s * channels, (e + 1) * channels) };
};

export const duration = ({ rate, channels = 1, samples }) => samples.length / channels / rate;
