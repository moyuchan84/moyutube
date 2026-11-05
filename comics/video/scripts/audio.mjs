// 「색이 번지는 날」 소리 — 배경음악 · 효과음을 코드로 합성한다 (실제 노래 · 음원 없음). 스테레오 44.1kHz.
// v2 (2026-11-02 피드백 "노래 · 효과음이 아쉽다"): 피아노 음색(배음 · 망치 · 페달), Freeverb 잔향, 현악 패드, 멜로디, 효과음 재설계, 페이지 넘김.
// 사용: node scripts/audio.mjs   → public/audio/*.wav
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const out = new URL("../public/audio/", import.meta.url);
mkdirSync(out, { recursive: true });

// 결정적 난수 (매번 같은 소리)
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const buf = (sec) => new Float32Array(Math.max(1, Math.round(sec * SR)));
const NOTE = (n) => {
  const m = /^([A-G])([#b]?)(\d)$/.exec(n);
  const s = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return 440 * 2 ** ((s + (Number(m[3]) + 1) * 12 - 69) / 12);
};
const mix = (dst, src, at, g = 1) => {
  const o = Math.round(at * SR);
  for (let i = 0; i < src.length; i++) { const j = o + i; if (j >= 0 && j < dst.length) dst[j] += src[i] * g; }
};
const peak = (b) => b.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const norm = (b, p = 0.9) => { const m = peak(b); if (m) for (let i = 0; i < b.length; i++) b[i] *= p / m; return b; };
const fadeOut = (b, sec) => { const n = Math.min(b.length, Math.round(sec * SR)); for (let i = 0; i < n; i++) b[b.length - 1 - i] *= i / n; return b; };

// 1차 필터
const lp = (b, hz) => { const a = 1 - Math.exp((-2 * Math.PI * hz) / SR); let y = 0; for (let i = 0; i < b.length; i++) b[i] = y += a * (b[i] - y); return b; };
const hp = (b, hz) => { const a = Math.exp((-2 * Math.PI * hz) / SR); let x0 = 0, y = 0; for (let i = 0; i < b.length; i++) { const x = b[i]; y = a * (y + x - x0); x0 = x; b[i] = y; } return b; };
// 상태변수 대역 통과 (주파수가 시간에 따라 바뀔 수 있다)
const bp = (b, hzAt, q = 2) => {
  let low = 0, band = 0;
  for (let i = 0; i < b.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(hzAt(i / SR), SR / 6)) / SR);
    const high = b[i] - low - band / q;
    band += f * high;
    low += f * band;
    b[i] = band;
  }
  return b;
};

// Freeverb (8 콤 + 4 올패스), 왼쪽 · 오른쪽 따로 → [L, R]
const freeverb = (mono, { room = 0.84, damp = 0.25, wet = 0.3, dry = 0.8, tail = 3 } = {}) => {
  const len = mono.length + Math.round(tail * SR);
  const make = (spread) => {
    const outB = new Float32Array(len);
    const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({ b: new Float32Array(d + spread), i: 0, s: 0 }));
    const alls = [556, 441, 341, 225].map((d) => ({ b: new Float32Array(d + spread), i: 0 }));
    for (let n = 0; n < len; n++) {
      const x = (n < mono.length ? mono[n] : 0) * 0.015;
      let acc = 0;
      for (const c of combs) {
        const y = c.b[c.i];
        c.s = y * (1 - damp) + c.s * damp;
        c.b[c.i] = x + c.s * room;
        c.i = (c.i + 1) % c.b.length;
        acc += y;
      }
      for (const a of alls) {
        const y = a.b[a.i];
        a.b[a.i] = acc + y * 0.5;
        a.i = (a.i + 1) % a.b.length;
        acc = y - acc;
      }
      outB[n] = (n < mono.length ? mono[n] : 0) * dry + acc * wet;
    }
    return outB;
  };
  return [make(0), make(23)];
};
const stereo = (mono, pan = 0) => [mono.map((v) => v * Math.min(1, 1 - pan)), mono.map((v) => v * Math.min(1, 1 + pan))];
const mixS = (dst, src, at, g = 1) => { mix(dst[0], src[0], at, g); mix(dst[1], src[1], at, g); };
const bufS = (sec) => [buf(sec), buf(sec)];
const normS = (s, p = 0.9) => { const m = Math.max(peak(s[0]), peak(s[1])); if (m) for (const c of s) for (let i = 0; i < c.length; i++) c[i] *= p / m; return s; };
const write = (name, s) => {
  const [L, R] = Array.isArray(s) ? s : [s, s];
  const n = Math.min(L.length, R.length);
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(name + ".wav", out), Buffer.concat([h, data]));
  console.log(name.padEnd(12), (n / SR).toFixed(1) + "s");
};
const noise = (sec) => { const b = buf(sec); for (let i = 0; i < b.length; i++) b[i] = rnd(); return b; };
const brown = (sec) => { const b = buf(sec); let y = 0; for (let i = 0; i < b.length; i++) { y = (y + 0.02 * rnd()) * 0.998; b[i] = y; } return norm(b, 1); };

// ── 악기 ─────────────────────────────────────
// 피아노: 약간 어긋난 배음(현의 비조화성) · 두 줄 맥놀이 · 망치 소리 · 밝기는 세기에 따라
const piano = (f, sec, vel = 0.7) => {
  const b = buf(sec);
  const B = 0.0004;
  const parts = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ k, fk: f * k * Math.sqrt(1 + B * k * k), a: (1 / k ** (1.6 - vel * 0.6)) * (k === 1 ? 1 : 0.8), d: 0.6 + k * 0.45 + f / 900 }));
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const p of parts) {
      if (p.fk > SR / 2.2) continue;
      const det = 1 + 0.0007 * (p.k % 2 ? 1 : -1);
      v += p.a * (Math.sin(2 * Math.PI * p.fk * t) + 0.6 * Math.sin(2 * Math.PI * p.fk * det * t)) * (0.7 * Math.exp(-t * p.d) + 0.3 * Math.exp(-t * p.d * 0.25));
    }
    b[i] = v * Math.min(1, t / 0.002);
  }
  // 망치 소리
  const h = lp(noise(0.03), 2500);
  for (let i = 0; i < h.length; i++) h[i] *= Math.exp((-i / SR) * 120) * 0.25;
  mix(b, h, 0);
  fadeOut(b, Math.min(0.4, sec / 3));
  return lp(b, 1800 + vel * 3500).map((v) => v * vel * 0.18);
};
// 현악 패드: 여러 겹의 톱니파를 살짝 어긋나게, 느린 어택 · 저역 통과 · 비브라토
const strings = (freqs, sec, vel = 0.5) => {
  const b = buf(sec);
  const voices = freqs.flatMap((f) => [-0.12, -0.04, 0.05, 0.13].map((c) => ({ f: f * 2 ** (c / 12), ph: Math.random() })));
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const o of voices) {
      o.ph += (o.f * (1 + 0.003 * Math.sin(2 * Math.PI * 5.2 * t + o.f))) / SR;
      v += 2 * (o.ph % 1) - 1;
    }
    const env = Math.min(1, t / 1.2) * Math.min(1, (sec - t) / 1.5);
    b[i] = (v / voices.length) * env * vel;
  }
  return lp(lp(b, 1400), 2200);
};
const cello = (f, sec, vel = 0.6) => strings([f], sec, vel);

// ── 배경음악 ───────────────────────────────────
// theme: 아련한 피아노 (A단조, 68bpm) — 4마디 전주(아르페지오) → 멜로디 → 현악이 들어오며 고조 → 잦아듦
const theme = (sec) => {
  const S = bufS(sec);
  const beat = 60 / 68;
  const bar = beat * 4;
  const prog = [
    ["A2", ["A3", "C4", "E4", "B4"], ["A3", "C4", "E4"]],
    ["F2", ["F3", "A3", "C4", "G4"], ["F3", "A3", "C4"]],
    ["C3", ["G3", "C4", "E4", "D5"], ["G3", "C4", "E4"]],
    ["G2", ["G3", "B3", "D4", "A4"], ["G3", "B3", "D4"]],
    ["A2", ["A3", "C4", "E4", "B4"], ["A3", "C4", "E4"]],
    ["F2", ["F3", "A3", "C4", "E4"], ["F3", "A3", "C4"]],
    ["G2", ["G3", "B3", "D4", "G4"], ["G3", "B3", "D4"]],
    ["E2", ["E3", "G#3", "B3", "E4"], ["E3", "G#3", "B3"]],
  ];
  // 멜로디 (박, 음, 길이)
  const mel = [
    [[0, "E5", 1.5], [1.5, "D5", 0.5], [2, "C5", 2]],
    [[0, "A4", 1], [1, "C5", 1], [2, "C5", 1.5], [3.5, "B4", 0.5]],
    [[0, "G4", 1], [1, "E5", 2], [3, "D5", 1]],
    [[0, "D5", 2.5], [2.5, "B4", 0.5], [3, "C5", 1]],
    [[0, "E5", 1.5], [1.5, "F5", 0.5], [2, "E5", 1], [3, "C5", 1]],
    [[0, "A4", 1.5], [1.5, "C5", 0.5], [2, "E5", 2]],
    [[0, "D5", 1], [1, "B4", 1], [2, "G4", 1], [3, "B4", 1]],
    [[0, "B4", 3], [3, "G#4", 1]],
  ];
  const pianoL = buf(sec), stringL = buf(sec), bassL = buf(sec);
  let t = 0, n = 0;
  while (t < sec) {
    const [bass, arp, pad] = prog[n % 8];
    const section = Math.floor(n / 8) % 3; // 0 전주(아르페지오만) · 1 멜로디 · 2 멜로디+현악
    mix(bassL, piano(NOTE(bass), bar + 2, 0.55), t);
    [0, 1, 2, 3, 2, 1, 2, 1].forEach((k, j) => mix(pianoL, piano(NOTE(arp[k]), 2.6, 0.32 + (j === 0 ? 0.08 : 0) + 0.04 * Math.sin(j)), t + j * beat * 0.5 + (j % 2 ? 0.012 : 0)));
    if (section >= 1) for (const [b0, note, len] of mel[n % 8]) mix(pianoL, piano(NOTE(note), len * beat + 1.6, 0.62), t + b0 * beat);
    if (section === 2 || n % 8 >= 4) mix(stringL, strings(pad.map(NOTE), bar + 1.4, section === 2 ? 0.16 : 0.08), t - 0.2);
    t += bar;
    n++;
  }
  const [pl, pr] = freeverb(pianoL, { room: 0.86, damp: 0.3, wet: 0.36, dry: 0.75, tail: 0 });
  const [sl, sr] = freeverb(stringL, { room: 0.9, damp: 0.4, wet: 0.45, dry: 0.6, tail: 0 });
  const [bl, br] = freeverb(bassL, { room: 0.8, damp: 0.4, wet: 0.25, dry: 0.9, tail: 0 });
  for (let i = 0; i < S[0].length; i++) {
    S[0][i] = pl[i] * 0.95 + pr[i] * 0.05 + sl[i] * 0.7 + bl[i] * 0.8;
    S[1][i] = pr[i] * 0.9 + pl[i] * 0.1 + sr[i] * 0.75 + br[i] * 0.8;
  }
  fadeOut(S[0], 4); fadeOut(S[1], 4);
  return normS(S, 0.8);
};

// tension: 낮은 현 지속음 + 심장 박동 + 점점 올라오는 높은 현의 떨림
const tension = (sec) => {
  const m = buf(sec);
  mix(m, cello(NOTE("D2"), sec, 0.5), 0);
  mix(m, cello(NOTE("A2"), sec, 0.25), 0);
  const hi = strings([NOTE("D#5")], sec, 0.08);
  for (let i = 0; i < hi.length; i++) hi[i] *= (i / hi.length) ** 2 * (0.6 + 0.4 * Math.sin((2 * Math.PI * 7 * i) / SR));
  mix(m, hi, 0);
  for (let t = 0.3; t < sec; t += 0.92) { mix(m, kick(0.3, 52, 0.9), t); mix(m, kick(0.25, 48, 0.55), t + 0.24); }
  const [l, r] = freeverb(m, { room: 0.82, wet: 0.3, dry: 0.85, tail: 0 });
  return normS([l, r], 0.7);
};

// ── 효과음 ───────────────────────────────────
function kick(sec, f = 55, vel = 1) {
  const b = buf(sec);
  let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / SR; ph += (f * (1 + 2.5 * Math.exp(-t * 35))) / SR; b[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 12) * vel; }
  return b;
}
const whoosh = (sec = 0.45, up = true) => {
  const n = noise(sec);
  bp(n, (t) => (up ? 400 + 3000 * (t / sec) ** 1.5 : 3200 - 2800 * (t / sec)), 1.2);
  for (let i = 0; i < n.length; i++) { const x = i / n.length; n[i] *= Math.sin(Math.PI * x) ** 2; }
  return norm(n, 0.7);
};
const punch = (heavy) => {
  const sec = heavy ? 1.6 : 0.6;
  const m = buf(sec);
  mix(m, whoosh(heavy ? 0.22 : 0.15, true), 0, 0.5);
  const at = heavy ? 0.2 : 0.13;
  mix(m, kick(0.6, heavy ? 48 : 62, 1), at);
  const crack = hp(noise(0.08), 1200);
  for (let i = 0; i < crack.length; i++) crack[i] *= Math.exp((-i / SR) * 60);
  mix(m, crack, at, heavy ? 0.9 : 0.6);
  const body = lp(noise(0.25), 700);
  for (let i = 0; i < body.length; i++) body[i] *= Math.exp((-i / SR) * 18);
  mix(m, body, at, 1.4);
  if (heavy) { const boom = lp(brown(1.2), 180); for (let i = 0; i < boom.length; i++) boom[i] *= Math.exp((-i / SR) * 3); mix(m, boom, at, 1.2); }
  const s = freeverb(m, { room: heavy ? 0.85 : 0.6, wet: heavy ? 0.35 : 0.18, dry: 1, tail: heavy ? 1 : 0.3 });
  return normS(s, 0.95);
};
const shutter = () => {
  const m = buf(0.6);
  const click = (at, g, hz) => { const c = bp(noise(0.03), () => hz, 3); for (let i = 0; i < c.length; i++) c[i] *= Math.exp((-i / SR) * 200); mix(m, c, at, g); };
  click(0, 1, 3500); click(0.004, 0.6, 1200); click(0.085, 0.8, 2800); click(0.09, 0.5, 900);
  mix(m, kick(0.05, 300, 0.25), 0.002);
  return normS(freeverb(m, { room: 0.4, wet: 0.12, dry: 1, tail: 0.2 }), 0.8);
};
const filmWind = () => {
  const m = buf(1.0);
  for (let k = 0; k < 9; k++) { const c = bp(noise(0.02), () => 2200 + 300 * (k % 3), 4); for (let i = 0; i < c.length; i++) c[i] *= Math.exp((-i / SR) * 260); mix(m, c, 0.05 + k * 0.075 + 0.01 * rnd(), 0.7); }
  mix(m, kick(0.06, 180, 0.2), 0.75);
  return normS(stereo(m, 0.1), 0.55);
};
const pageFlip = () => {
  const n = noise(0.42);
  bp(n, (t) => 1800 + 2500 * Math.sin(Math.PI * Math.min(1, t / 0.42)), 0.8);
  for (let i = 0; i < n.length; i++) { const x = i / n.length; n[i] *= Math.sin(Math.PI * x) ** 0.8 * (0.6 + 0.4 * Math.abs(rnd())); }
  const s = [n, Float32Array.from(n)];
  for (let i = 0; i < n.length; i++) { const x = i / n.length; s[0][i] *= 1 - 0.6 * x; s[1][i] *= 0.4 + 0.6 * x; }
  return normS(s, 0.45);
};
const wind = (sec) => {
  const b = brown(sec);
  const g = bp(Float32Array.from(noise(sec)), (t) => 500 + 300 * Math.sin(t * 0.7), 3);
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = b[i] * (0.6 + 0.4 * Math.sin(t * 0.5)) + g[i] * 0.15 * (0.5 + 0.5 * Math.sin(t * 1.3)); }
  const L = lp(Float32Array.from(b), 900), R = lp(Float32Array.from(b.map((v, i) => b[(i + 900) % b.length])), 900);
  fadeOut(L, 1); fadeOut(R, 1);
  return normS([L, R], 0.35);
};
const waves = (sec) => {
  const L = buf(sec), R = buf(sec);
  for (let w = 0, t = 0; t < sec; w++, t += 4.5 + 2 * Math.abs(rnd())) {
    const len = 4.2;
    const n = lp(noise(len), 1600);
    for (let i = 0; i < n.length; i++) { const x = i / n.length; n[i] *= x < 0.35 ? (x / 0.35) ** 2 : Math.exp(-(x - 0.35) * 5); }
    mix(L, n, t, 0.6 + 0.3 * (w % 2)); mix(R, n, t + 0.05, 0.9 - 0.3 * (w % 2));
  }
  const rumble = lp(brown(sec), 120);
  mix(L, rumble, 0, 0.4); mix(R, rumble, 0, 0.4);
  return normS([L, R], 0.4);
};
const gull = () => {
  const m = buf(1.8);
  [[0, 0.32], [0.42, 0.28], [0.8, 0.45]].forEach(([at, d]) => {
    const s = buf(d);
    let ph = 0;
    for (let i = 0; i < s.length; i++) { const t = i / SR; const x = t / d; const f = 1250 + 1100 * Math.sin(Math.PI * x) * (1 - 0.3 * x); ph += f / SR; s[i] = (Math.sin(2 * Math.PI * ph) + 0.4 * Math.sin(4 * Math.PI * ph) + 0.2 * Math.sin(6 * Math.PI * ph)) * Math.sin(Math.PI * x) ** 0.7; }
    mix(m, bp(s, () => 1800, 0.7), at);
  });
  return normS(freeverb(m, { room: 0.88, wet: 0.45, dry: 0.7, tail: 0.6 }), 0.3);
};
const room = (sec) => { const b = lp(brown(sec), 300); const hum = buf(sec); for (let i = 0; i < hum.length; i++) hum[i] = Math.sin((2 * Math.PI * 60 * i) / SR) * 0.05; mix(b, hum, 0); return normS(stereo(norm(b, 1)), 0.1); };
const crowd = (sec) => {
  const L = buf(sec), R = buf(sec);
  for (let k = 0; k < 24; k++) {
    const f0 = 110 + Math.abs(rnd()) * 140;
    const v = buf(sec);
    let ph = 0;
    for (let i = 0; i < v.length; i++) {
      const t = i / SR;
      const syl = Math.max(0, Math.sin(2 * Math.PI * (2.5 + k * 0.13) * t + k)) * Math.max(0, Math.sin(2 * Math.PI * 0.3 * t + k * 2));
      ph += (f0 * (1 + 0.15 * Math.sin(2 * Math.PI * 3 * t + k))) / SR;
      v[i] = (2 * (ph % 1) - 1) * syl;
    }
    bp(v, () => 700 + (k % 5) * 200, 1.5);
    const pan = (k % 7) / 3 - 1;
    mix(L, v, 0, 1 - pan * 0.5); mix(R, v, 0, 1 + pan * 0.5);
  }
  return normS(freeverb(lp(L, 2500), { room: 0.7, wet: 0.3, tail: 0 }).slice(0, 1).concat(freeverb(lp(R, 2500), { room: 0.7, wet: 0.3, tail: 0 }).slice(1)), 0.22);
};
const highNote = () => normS(freeverb(piano(NOTE("E6"), 4, 0.6), { room: 0.92, wet: 0.5, dry: 0.7, tail: 1 }), 0.5);
const celloNote = () => { const m = cello(NOTE("A2"), 4.5, 0.8); mix(m, strings([NOTE("E3")], 4.5, 0.3), 0); return normS(freeverb(m, { room: 0.9, wet: 0.45, dry: 0.8, tail: 1 }), 0.55); };
const scrape = () => { const n = bp(noise(0.7), (t) => 900 + 400 * Math.sin(t * 30), 2); for (let i = 0; i < n.length; i++) n[i] *= Math.sin((Math.PI * i) / n.length) * (0.5 + 0.5 * Math.abs(Math.sin(i / 300))); return normS(stereo(n, -0.2), 0.4); };
const rustle = () => { const n = bp(noise(1.1), () => 3000, 0.8); for (let i = 0; i < n.length; i++) n[i] *= (0.2 + 0.8 * Math.abs(Math.sin((i / SR) * 7))) * Math.sin((Math.PI * i) / n.length); return normS(stereo(n), 0.25); };
const water = (sec) => { const m = buf(sec); for (let k = 0; k < sec * 4; k++) { const at = Math.abs(rnd()) * sec; const f = 600 + Math.abs(rnd()) * 900; const s = buf(0.06); for (let i = 0; i < s.length; i++) { const t = i / SR; s[i] = Math.sin(2 * Math.PI * f * (1 + 6 * t) * t) * Math.exp(-t * 60); } mix(m, s, at, 0.3); } mix(m, lp(noise(sec), 400), 0, 0.05); return normS(freeverb(m, { room: 0.5, wet: 0.2, tail: 0 }), 0.22); };
const tick = (sec) => { const m = buf(sec); for (let t = 0; t < sec; t += 1) { const c = bp(noise(0.015), () => 4000, 5); for (let i = 0; i < c.length; i++) c[i] *= Math.exp((-i / SR) * 300); mix(m, c, t, 0.5); mix(m, c, t + 0.5, 0.3); } return normS(stereo(m, 0.3), 0.2); };
const gag = () => { const m = buf(0.6); let ph = 0; for (let i = 0; i < m.length; i++) { const t = i / SR; ph += (1100 - 1500 * t) / SR; m[i] = (Math.sin(2 * Math.PI * ph) + 0.3 * Math.sin(6 * Math.PI * ph)) * Math.exp(-t * 3) * 0.4; } mix(m, kick(0.1, 200, 0.3), 0); return normS(stereo(m), 0.4); };
const paper = () => { const n = bp(noise(0.4), (t) => 2500 + 1500 * Math.sin(t * 25), 1); for (let i = 0; i < n.length; i++) n[i] *= Math.exp((-i / SR) * 7) * (0.4 + 0.6 * Math.abs(rnd())); return normS(stereo(n), 0.3); };
const stinger = () => { const m = buf(3); mix(m, piano(NOTE("A1"), 3, 0.9), 0); mix(m, piano(NOTE("A2"), 3, 0.7), 0); mix(m, piano(NOTE("E3"), 3, 0.5), 0); mix(m, strings([NOTE("A3"), NOTE("C4")], 3, 0.15), 0); return normS(freeverb(m, { room: 0.9, wet: 0.4, dry: 0.8, tail: 1 }), 0.7); };

write("theme", theme(150));
write("tension", tension(30));
write("hit", punch(false));
write("hit_heavy", punch(true));
write("whoosh", (() => { const s = whoosh(0.5, true); return normS(stereo(s), 0.6); })());
write("shutter", shutter());
write("film_wind", filmWind());
write("page_flip", pageFlip());
write("wind", wind(40));
write("waves", waves(40));
write("gull", gull());
write("room", room(30));
write("crowd", crowd(15));
write("high_note", highNote());
write("cello_note", celloNote());
write("scrape", scrape());
write("rustle", rustle());
write("water", water(12));
write("tick", tick(12));
write("gag", gag());
write("paper", paper());
write("stinger", stinger());
