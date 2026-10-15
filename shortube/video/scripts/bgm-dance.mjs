// 밝은 댄스(하우스) 배경음악을 코드로 합성한다 (저작권 걱정 없음).
// 4박 킥 · 2·4박 클랩 · 엇박 오픈햇 · 16분 클로즈햇 · 사이드체인으로 펌핑하는 코드 스탭 · 엇박 베이스 · 아르페지오,
// 장면 전환마다 라이저와 크래시. 시점은 src/kpop/timeline.json 에서 읽는다.
// 사용: node scripts/bgm-dance.mjs → public/bgm/dance.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/kpop/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BEAT = 60 / TL.bpm;
const f2s = (f) => f / TL.fps;
const INTRO_END = f2s(TL.scenes[1].from);

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
const highpass = (buf) => {
  let prev = 0;
  for (let i = 0; i < buf.length; i++) { const x = buf[i]; buf[i] = x - prev; prev = x; }
  return buf;
};
const noise = (sec, decay) => {
  const n = Math.round(sec * RATE);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = (Math.random() * 2 - 1) * Math.exp((-i / RATE) * decay);
  return b;
};

// 사이드체인 엔벨로프: 킥이 칠 때마다 패드·베이스를 눌렀다 놓는다
const duck = (t) => {
  if (t < INTRO_END) return 1;
  const ph = (t % BEAT) / BEAT;
  return 0.25 + 0.75 * Math.min(1, ph / 0.45);
};

// C - G - Am - F (밝은 팝 진행)
const PROG = [
  { root: 48, chord: [60, 64, 67, 72], arp: [72, 76, 79, 84] },
  { root: 43, chord: [59, 62, 67, 71], arp: [71, 74, 79, 83] },
  { root: 45, chord: [60, 64, 69, 72], arp: [72, 76, 81, 84] },
  { root: 41, chord: [60, 65, 69, 72], arp: [72, 77, 81, 84] },
];
const bars = Math.ceil(SEC / (4 * BEAT));

// 1) 킥 (인트로 이후 4박)
const kick = () => {
  const n = Math.round(0.32 * RATE);
  const b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    ph += (2 * Math.PI * (50 + 140 * Math.exp(-t * 40))) / RATE;
    b[i] = Math.tanh(Math.sin(ph) * 1.8) * Math.exp(-t * 9) + (i < 120 ? (Math.random() * 2 - 1) * 0.3 : 0);
  }
  return b;
};
// 2) 클랩: 살짝 어긋난 소음 세 겹
const clap = () => {
  const b = new Float32Array(Math.round(0.25 * RATE));
  for (const off of [0, 0.011, 0.022]) {
    const s = noise(0.22, off === 0.022 ? 18 : 60);
    const o = Math.round(off * RATE);
    for (let i = 0; i < s.length && i + o < b.length; i++) b[i + o] += s[i];
  }
  highpass(b);
  return lowpass(b, 6000);
};
const hat = (open) => highpass(highpass(noise(open ? 0.22 : 0.05, open ? 16 : 90)));

// 3) 코드 스탭 (톱니 7겹 디튠 = 슈퍼소)
const stab = (notes, sec) => {
  const n = Math.round(sec * RATE);
  const b = new Float32Array(n);
  for (const m of notes) for (const d of [-0.18, -0.08, 0, 0.08, 0.18]) {
    const f = hz(m + d);
    const ph0 = Math.random();
    for (let i = 0; i < n; i++) b[i] += (((i / RATE) * f + ph0) % 1) * 2 - 1;
  }
  for (let i = 0; i < n; i++) b[i] *= Math.exp((-i / RATE) * 5) * Math.min(1, i / 80) / (notes.length * 5);
  return lowpass(b, 3800);
};
const bassNote = (m, sec) => {
  const f = hz(m);
  const n = Math.round(sec * RATE);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.5 * ((((t * f) % 1) * 2 - 1))) * Math.exp(-t * 5) * Math.min(1, i / 60);
  }
  return lowpass(b, 900);
};
const pluck = (m, sec) => {
  const f = hz(m);
  const n = Math.round(sec * RATE);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const sq = Math.sin(2 * Math.PI * f * t) > 0 ? 1 : -1;
    b[i] = (sq * 0.5 + Math.sin(2 * Math.PI * f * t)) * Math.exp(-t * 14);
  }
  return lowpass(b, 5000);
};

for (let bar = 0; bar < bars; bar++) {
  const p = PROG[bar % 4];
  const t0 = bar * 4 * BEAT;
  const intro = t0 < INTRO_END;
  for (let beat = 0; beat < 4; beat++) {
    const t = t0 + beat * BEAT;
    if (!intro) add(t, kick(), 0.9);
    if (beat % 2 === 1) add(t, clap(), intro ? 0.35 : 0.5);
    if (!intro) add(t + BEAT / 2, hat(true), 0.16);
    for (let s = 0; s < 4; s++) if (!intro || s % 2 === 0) add(t + (s * BEAT) / 4, hat(false), s % 2 ? 0.08 : 0.12);
    // 엇박 코드 스탭 + 베이스
    add(t + BEAT / 2, stab(p.chord, BEAT * 0.45), intro ? 0.28 : 0.42);
    if (!intro) add(t + BEAT / 2, bassNote(p.root - 12 + (beat === 3 ? 12 : 0), BEAT * 0.45), 0.55);
  }
  // 16분 아르페지오
  for (let s = 0; s < 16; s++) add(t0 + (s * BEAT) / 4, pluck(p.arp[s % 4] + (s >= 8 && bar % 2 ? 12 : 0), 0.18), intro ? 0.06 : 0.09);
}

// 사이드체인 적용은 '킥/클랩/햇을 제외한 부분'에만 해야 하지만, 단순하게 전체에 약하게 건다
for (let i = 0; i < LENGTH; i++) mix[i] *= 0.55 + 0.45 * duck(i / RATE);

// 라이저 (장면 전환 1.4초 전) + 크래시 (타격)
for (const f of TL.risers) {
  const end = f2s(f), dur = 1.4, n = Math.round(dur * RATE);
  const b = new Float32Array(n);
  let y = 0;
  for (let i = 0; i < n; i++) {
    const q = i / n;
    const a = 1 - Math.exp((-2 * Math.PI * (500 + q * q * 9000)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    b[i] = y * q * q;
  }
  add(end - dur, b, 0.35);
}
for (const f of TL.hits) {
  const c = highpass(noise(1.2, 3.5));
  add(f2s(f), lowpass(c, 9000), 0.28);
  add(f2s(f), kick(), 0.6);
}

// 끝 1.5초 페이드아웃 + 정규화
const fade = Math.round(1.5 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
for (let i = 0; i < LENGTH; i++) data.writeInt16LE(Math.round(Math.tanh((mix[i] / peak) * 1.5) * 0.85 * 32767), i * 2);
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
writeFileSync(new URL("dance.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/dance.wav (${SEC.toFixed(1)}초, ${TL.bpm}BPM, ${bars}마디)`);
