// 듣기 편한 배경"음악" 부품 (2026-11-14 사용자: "bgm 이랑 효과음을 사람들이 안 듣고 싶어할 것 같다").
//   드론 · 쿵 · 핑 · 노이즈 상승음 같은 효과음 대신 → 코드 진행 + 멜로디 + 부드러운 박자가 있는 곡.
//   악기: 전자 피아노(FM) · 따뜻한 패드 · 둥근 베이스 · 줄 뜯기 · 부드러운 킥 · 작은 하이햇 · 손가락 스냅.
//   곡마다 song({ bpm, bars: [[코드 음들], …], melody, … }) 으로 만든다. 외부 음원 없음.
import { RATE } from "./_synth.mjs";

const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const buf = (sec) => new Float32Array(Math.round(sec * RATE));

// 전자 피아노: 따뜻한 몸통 + 처음에만 살짝 반짝이는 종소리
export const epiano = (m, sec, bright = 1) => {
  const b = buf(sec), f = hz(m);
  for (let i = 0; i < b.length; i++) {
    const t = i / RATE;
    const body = Math.sin(2 * Math.PI * f * t + 1.4 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * t));
    const bell = Math.sin(2 * Math.PI * f * t + 0.7 * Math.exp(-t * 18) * Math.sin(2 * Math.PI * f * 14 * t));
    const env = Math.min(1, t / 0.006) * Math.exp(-t * 1.2) * Math.min(1, (sec - t) / 0.1);
    b[i] = (body * 0.8 + bell * 0.18 * bright * Math.exp(-t * 6)) * env;
  }
  return b;
};

// 패드: 살짝 어긋난 사인 두 겹, 천천히 차오르고 빠진다
export const pad = (ms, sec, fade = 0.8) => {
  const b = buf(sec);
  for (let i = 0; i < b.length; i++) {
    const t = i / RATE;
    let s = 0;
    for (const m of ms) { const f = hz(m); s += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.004 * t + 1.1); }
    b[i] = (s / ms.length) * Math.min(1, t / fade) * Math.min(1, (sec - t) / fade);
  }
  return b;
};

// 베이스: 둥근 사인 + 약간의 2배음
export const bass = (m, sec) => {
  const b = buf(sec), f = hz(m);
  for (let i = 0; i < b.length; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 1.0) * Math.min(1, (sec - t) / 0.06);
    b[i] = (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t)) * env;
  }
  return b;
};

// 줄 뜯는 소리 (Karplus-Strong) — 밝은 멜로디용
export const pluck = (m, sec, bright = 0.5) => {
  const n = Math.max(2, Math.round(RATE / hz(m)));
  const line = new Float32Array(n);
  for (let i = 0; i < n; i++) line[i] = Math.random() * 2 - 1;
  for (let p = 0; p < 2; p++) for (let i = 1; i < n; i++) line[i] = line[i] * bright + line[i - 1] * (1 - bright);
  const out = buf(sec);
  for (let i = 0; i < out.length; i++) { const a = i % n; out[i] = line[a]; line[a] = (line[a] + line[(i + 1) % n]) * 0.4975; }
  const fade = Math.round(0.04 * RATE);
  for (let i = 0; i < fade && i < out.length; i++) out[out.length - 1 - i] *= i / fade;
  return out;
};

// 부드러운 킥 (낮고 짧게, 귀를 때리지 않게)
export const softKick = () => {
  const b = buf(0.3);
  let ph = 0;
  for (let i = 0; i < b.length; i++) { const t = i / RATE; ph += (2 * Math.PI * (48 + 50 * Math.exp(-t * 35))) / RATE; b[i] = Math.sin(ph) * Math.exp(-t * 11); }
  return b;
};
// 작은 하이햇 (고음 소음, 아주 짧게)
export const hat = (sec = 0.05) => {
  const b = buf(sec);
  let prev = 0;
  for (let i = 0; i < b.length; i++) { const x = Math.random() * 2 - 1; b[i] = (x - prev) * 0.5 * Math.exp((-i / RATE) * 70); prev = x; }
  return b;
};
// 손가락 스냅 (스네어 대신, 가볍게)
export const snap = () => {
  const b = hat(0.12);
  for (let i = 0; i < b.length; i++) b[i] *= 1.4 * Math.exp((-i / RATE) * 30);
  for (let i = 0; i < 220 && i < b.length; i++) b[i] += Math.sin((2 * Math.PI * 1700 * i) / RATE) * Math.exp(-i / 45) * 0.4;
  return b;
};

// 간단한 리버브 느낌: 지연음 몇 겹을 작게 더한다 (공간감, 날카로움 줄이기)
export const space = (mix, amount = 0.25) => {
  const taps = [[0.113, 0.5], [0.197, 0.35], [0.293, 0.22], [0.411, 0.14]];
  const out = new Float32Array(mix);
  for (const [d, g] of taps) { const k = Math.round(d * RATE); for (let i = k; i < mix.length; i++) out[i] += mix[i - k] * g * amount; }
  mix.set(out);
};
