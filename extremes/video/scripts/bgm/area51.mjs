// NO ENTRY ② Area 51 — 전부 코드 합성 (외부 음원 없음).
//   깔림: 낮은 드론 + 불협 고음 · 느린 심장 박동(점점 빨라짐, 마지막 원칙 샷에서 멈춤)
//   컷마다 휙 · 도장(NO · 1880)에서 쾅 · hits: red=스팅어, glitch=디지털 잡음, shake=둔탁한 쿵, flash=쾅
//   쓰나미 샷 = 큰 파도, 헬기 샷 = 로터 소리(끊기는 저음 노이즈), "살아 있었다" 직전 0.3초 정적
// 사용: node scripts/bgm/area51.mjs → content/area51/music/area51.wav
import { RATE, glide, kick, lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("area51");
const S = TL.shots;
const end = S.find((s) => s.type === "end").from;
const last = S[S.length - 2]; // 원칙 샷
const heli = S.find((s) => s.video === "pixabay-2acd8465.mp4");
const wave = S.find((s) => s.video === "pixabay-9d206891.mp4");

const highpass = (b, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0, px = 0;
  for (let i = 0; i < b.length; i++) { const x = b[i]; y = a * (y + x - px); px = x; b[i] = y; }
  return b;
};
const shape = (b, f) => { for (let i = 0; i < b.length; i++) b[i] *= f(i / b.length, i / RATE); return b; };
const slam = () => sum(lowpass(kick(1.4), 500), tone(24, 2.2, { decay: 1.4 }), lowpass(noise(0.6, 7, 0.5), 900));
const stinger = () => shape(lowpass(sum(...[79, 80.3, 83.1, 85.9].map((m, i) => glide(m, m + 5 + i, 0.9, { kind: "saw", decay: 2.5 }))), 3800), (p) => Math.min(1, p * 25) * (1 - p) ** 1.5);
const glitchy = () => {
  const b = new Float32Array(Math.round(0.28 * RATE));
  let v = 0;
  for (let i = 0; i < b.length; i++) { if (i % 220 === 0) v = Math.random() < 0.5 ? Math.random() * 2 - 1 : 0; b[i] = v * (1 - i / b.length); }
  return b;
};

// 드론
for (let t = 0; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(28, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: 0.004 }), tone(35, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: -0.006 })), 200), 0.26);
  add(t, sum(tone(86, 4.6, { attack: 1.5, release: 1.5 }), tone(87, 4.6, { attack: 1.5, release: 1.5, detune: 0.002 })), 0.016);
}
// 심장: 훅 뒤부터 원칙 샷 전까지 64 → 104 bpm
const h0 = S[1].from, h1 = last.from - 0.2;
for (let t = h0; t < h1; ) {
  const k = (t - h0) / (h1 - h0);
  add(t, lowpass(kick(0.35), 300), 0.5 + 0.25 * k);
  add(t + 0.17, lowpass(kick(0.25), 260), 0.32 + 0.2 * k);
  t += 60 / (64 + 40 * k * k);
}
// 첫 쾅 + 라이저
add(0, slam(), 0.9);
add(0.3, lowpass(riser(1.0, true), 2500), 0.15);

S.forEach((s, i) => {
  if (i > 0 && s.type !== "end") add(s.from - 0.12, highpass(riser(0.25, false), 900), 0.22);
  if (s.stamp) add(s.from + s.stamp.at, slam(), 0.85);
  for (const h of s.hits ?? []) {
    const t = s.from + h.at;
    if (h.kind === "red") add(t, stinger(), 0.3);
    if (h.kind === "glitch") add(t, glitchy(), 0.3);
    if (h.kind === "shake") add(t, lowpass(kick(0.6), 220), 0.5);
    if (h.kind === "flash" && t > 0.5) add(t, slam(), 0.7);
  }
});

// 쓰나미: 큰 파도 두 번
if (wave) for (const d of [0, 1.4]) add(wave.from + d, shape(lowpass(noise(1.8, 0, 0.4), 900), (p) => Math.sin(Math.PI * Math.min(1, p * 1.3)) ** 2), 0.45);
// 헬기: 로터 (초당 약 11번 끊기는 저음 노이즈)
if (heli) {
  const b = lowpass(noise(heli.dur, 0, 0.3), 500);
  shape(b, (p, t) => (0.35 + 0.65 * Math.max(0, Math.sin(t * 2 * Math.PI * 11))) * Math.min(1, p * 8) * Math.min(1, (1 - p) * 8));
  add(heli.from, b, 0.35);
  // "살아 있었다" 직전 0.3초 정적 → flash 쾅이 크게 들린다
  const t0 = heli.from + heli.hits.find((h) => h.kind === "flash").at;
  for (let i = Math.round((t0 - 0.3) * RATE); i < Math.round(t0 * RATE); i++) mix[i] *= 0.05;
}
// Area 51 전용 ---------------------------------------------
// 훅: 감시 카메라 무전 잡음
{
  const b = lowpass(highpass(noise(S[0].dur, 0, 0.9), 600), 3200);
  shape(b, (p, t) => (Math.sin(t * 23) > 0.2 ? 1 : 0.15) * Math.min(1, p * 6) * Math.min(1, (1 - p) * 10));
  add(0, b, 0.12);
}
// UFO 빛: 떨리는 고음 웅웅
for (const s of S.filter((x) => x.ufo)) {
  const d = s.ufo.dur ?? 2;
  const b = sum(glide(76, 79, d, {}), glide(76.3, 79.4, d, {}));
  shape(b, (p, t) => (0.6 + 0.4 * Math.sin(t * 2 * Math.PI * 6)) * Math.sin(Math.PI * p));
  add(s.from + s.ufo.at, b, 0.12);
}
// U-2 사진: 높은 하늘의 제트 소리 (지나가는 노이즈)
for (const s of S.filter((x) => x.image === "wikimedia-u2-goldengate.jpg")) add(s.from, shape(lowpass(noise(Math.min(2.2, s.dur), 0, 0.5), 1400), (p) => Math.sin(Math.PI * p) ** 2), 0.3);
// "UFO의 정체는" 직전 0.3초 정적 → 쾅
{
  const punch = S.filter((x) => x.image === "wikimedia-u2-goldengate.jpg").pop();
  for (let i = Math.round((punch.from - 0.3) * RATE); i < Math.round(punch.from * RATE); i++) mix[i] *= 0.05;
  add(punch.from, slam(), 0.9);
}
// 원칙 샷: 심장 없이 잔잔한 파도 + 낮은 울림
{
  const b = lowpass(noise(end - last.from, 0, 0.3), 700);
  shape(b, (p, t) => (0.45 + 0.55 * Math.sin(t * 1.2) ** 2) * Math.min(1, p * 4));
  add(last.from, b, 0.28);
  add(last.from, tone(19, 3.0, { decay: 0.9 }), 0.5);
}
// 끝 카드: 첫 장면과 같은 쾅 (반복 재생 때 이어지게)
add(end, slam(), 0.6);

writeWav("area51", mix, { drive: 1.8, level: 0.5, fadeSec: 1.2 });
