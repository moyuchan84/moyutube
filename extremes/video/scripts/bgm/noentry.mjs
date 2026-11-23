// No Entry TOP 5 배경 소리 — 전부 코드 합성 (외부 음원 없음).
//   깔림: 낮은 드론 + 불협 고음(긴장) · 심장 박동이 5위 60bpm → 2위 110bpm 으로 빨라짐 · 1위 직전 0.5초 완전 정적
//   순위가 바뀔 때 쾅 · 컷마다 휙 · 효과(hits): flash=쾅, red=비명 같은 스팅어, glitch=디지털 잡음, shake=둔탁한 쿵
//   장소별: 라스코=숨소리, 뱀섬=쉭, Area 51=무전 잡음, 북센티널=파도만
// 사용: node scripts/bgm/noentry.mjs → content/noentry/music/noentry.wav
import { RATE, glide, kick, lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("noentry");
const S = TL.shots;
const black = S.find((s) => s.type === "black");
const silence0 = black.from, silence1 = black.from + black.dur;
const ranks = S.filter((s) => s.rank);
const first = ranks[0].from;
const one = ranks.find((s) => s.rank === 1).from;
const end = S.find((s) => s.type === "end").from;

// 고역 통과 (쉭 · 숨소리를 가볍게)
const highpass = (b, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0, px = 0;
  for (let i = 0; i < b.length; i++) { const x = b[i]; y = a * (y + x - px); px = x; b[i] = y; }
  return b;
};
const shape = (b, f) => { for (let i = 0; i < b.length; i++) b[i] *= f(i / b.length, i / RATE); return b; };

// 1) 드론: 아주 낮은 톱니 두 개(살짝 어긋남) + 불협 고음(작게)
for (let t = 0; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(28, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: 0.004 }), tone(35, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: -0.006 })), 200), 0.28);
  add(t, sum(tone(86, 4.6, { attack: 1.5, release: 1.5 }), tone(87, 4.6, { attack: 1.5, release: 1.5, detune: 0.002 })), 0.018);
}

// 2) 심장 박동: 첫 순위부터 정적 전까지, 60 → 110 bpm
for (let t = first; t < silence0 - 0.2; ) {
  const k = (t - first) / (silence0 - first);
  const bpm = 60 + 50 * k * k;
  add(t, lowpass(kick(0.35), 300), 0.55 + 0.25 * k);
  add(t + 0.17, lowpass(kick(0.25), 260), 0.35 + 0.2 * k);
  t += 60 / bpm;
}

// 3) 훅: 처음 쾅 + 라이저 → 1.25초 스팅어
add(0, sum(lowpass(kick(1.2), 400), tone(26, 2.0, { decay: 1.6 })), 0.9);
add(0.05, lowpass(riser(1.2, true), 2500), 0.18);

// 비명 같은 스팅어: 높은 톱니 여러 개가 어긋나며 위로 미끄러진다 (사람 목소리 아님)
const stinger = () => {
  const parts = [79, 80.3, 83.1, 85.9].map((m, i) => glide(m, m + 5 + i, 0.9, { kind: "saw", decay: 2.5 }));
  return shape(lowpass(sum(...parts), 3800), (p) => Math.min(1, p * 25) * (1 - p) ** 1.5);
};
// 디지털 잡음 (글리치)
const glitchy = () => {
  const b = new Float32Array(Math.round(0.28 * RATE));
  let v = 0;
  for (let i = 0; i < b.length; i++) { if (i % 220 === 0) v = Math.random() < 0.5 ? (Math.random() * 2 - 1) : 0; b[i] = v * (1 - i / b.length); }
  return b;
};
// 큰 쾅 (순위)
const slam = () => sum(lowpass(kick(1.4), 500), tone(24, 2.2, { decay: 1.4 }), lowpass(noise(0.6, 7, 0.5), 900));

// 4) 컷 휙 · 순위 쾅 · hits
S.forEach((s, i) => {
  if (s.type === "black") return;
  if (i > 0 && s.type !== "end") add(s.from - 0.12, highpass(riser(0.25, false), 900), 0.22);
  if (s.rank && s.rank !== 1) add(s.from, slam(), 0.85);
  for (const h of s.hits ?? []) {
    const t = s.from + h.at;
    if (t >= silence0 && t < silence1) continue;
    if (h.kind === "red") add(t, stinger(), 0.32);
    if (h.kind === "glitch") add(t, glitchy(), 0.3);
    if (h.kind === "shake") add(t, lowpass(kick(0.6), 220), 0.5);
    if (h.kind === "flash" && !s.rank) add(t, slam(), 0.6);
  }
});

// 5) 장소별 질감
const at = (rank) => S.indexOf(ranks.find((s) => s.rank === rank));
// 라스코: 숨소리 (들숨 · 날숨)
{
  const s = S[at(5)];
  for (let t = s.from + 0.1; t < S[at(5) + 1].from + 1.4; t += 1.3) add(t, shape(lowpass(highpass(noise(1.1, 0, 0.7), 400), 1800), (p) => Math.sin(Math.PI * p) ** 2), 0.12);
}
// 뱀섬: 쉭 (방울뱀 영상 · 실제 뱀 사진)
{
  const s = S[at(3) + 1];
  add(s.from, shape(highpass(noise(1.3, 0, 0.95), 3500), (p) => Math.min(1, p * 8) * (1 - p)), 0.4);
  add(S[at(3) + 2].from + 0.1, shape(highpass(noise(1.0, 0, 0.95), 4000), (p) => Math.min(1, p * 10) * (1 - p)), 0.32);
}
// Area 51: 무전 잡음 (뚝뚝 끊기는 노이즈)
{
  const s0 = S[at(2)].from + 1.2, s1 = silence0 - 0.1;
  const len = s1 - s0;
  const b = lowpass(highpass(noise(len, 0, 0.9), 600), 3200);
  shape(b, (p, t) => (Math.sin(t * 23) > 0.2 ? 1 : 0.15) * Math.min(1, p * 6) * Math.min(1, (1 - p) * 10));
  add(s0, b, 0.12);
}

// 6) 정적: 0.5초 완전 무음 (드론까지 지운다)
for (let i = Math.round(silence0 * RATE); i < Math.round(silence1 * RATE); i++) mix[i] = 0;
// 정적 직전 0.15초 동안 빠르게 줄인다
for (let i = Math.round((silence0 - 0.15) * RATE), n = Math.round(0.15 * RATE), j = 0; j < n; i++, j++) mix[i] *= 1 - j / n;

// 7) 1위: 가장 큰 쾅 → 파도만 (심장 없음)
add(one, slam(), 1.1);
add(one + 0.02, tone(19, 3.0, { decay: 0.9 }), 0.6);
{
  const len = end - (one + 0.8);
  const b = lowpass(noise(len, 0, 0.3), 700);
  shape(b, (p, t) => (0.45 + 0.55 * Math.sin(t * 1.2) ** 2) * Math.min(1, p * 4));
  add(one + 0.8, b, 0.3);
}
// 끝 카드: 첫 장면과 같은 쾅 (반복 재생 때 이어지게)
add(end, sum(lowpass(kick(1.2), 400), tone(26, 2.0, { decay: 1.6 })), 0.6);

writeWav("noentry", mix, { drive: 1.8, level: 0.5, fadeSec: 1.2 });
