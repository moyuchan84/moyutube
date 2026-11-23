// UNEXPLAINED ① 지옥의 문 — 전부 코드 합성 (외부 음원 없음).
//   「갈 수 없는 곳」보다 어둡게: 아주 낮은 드론(반음 + 트라이톤) · 불규칙한 쿵 · 사막 바람
//   불 장면 = 불꽃 웅웅(낮은 노이즈 일렁임) + 탁탁 튀는 소리, 낮 장면 = 바람만
//   암전(black) = 완전한 정적 → 밤 사진에서 쾅, 마지막 "닫히고 있다" 직전 0.3초 정적
//   심장 박동 없음 (시리즈 구분). 대신 느린 저음 펄스가 점점 촘촘해진다.
// 사용: node scripts/bgm/hellgate.mjs → content/hellgate/music/hellgate.wav
import { RATE, glide, kick, lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("hellgate");
const S = TL.shots;
const end = S.find((s) => s.type === "end").from;
const black = S.find((s) => s.type === "black");
const night = S[2];
const highpass = (b, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0, px = 0;
  for (let i = 0; i < b.length; i++) { const x = b[i]; y = a * (y + x - px); px = x; b[i] = y; }
  return b;
};
const shape = (b, f) => { for (let i = 0; i < b.length; i++) b[i] *= f(i / b.length, i / RATE); return b; };
const slam = () => sum(lowpass(kick(1.5), 450), tone(22, 2.6, { decay: 1.2 }), lowpass(noise(0.8, 5, 0.5), 800));
const stinger = () => shape(lowpass(sum(...[57, 63, 64, 70].map((m, i) => glide(m, m - 4 - i, 1.2, { kind: "saw", decay: 1.8 }))), 2600), (p) => Math.min(1, p * 25) * (1 - p) ** 1.5);
const glitchy = () => {
  const b = new Float32Array(Math.round(0.3 * RATE));
  let v = 0;
  for (let i = 0; i < b.length; i++) { if (i % 260 === 0) v = Math.random() < 0.5 ? Math.random() * 2 - 1 : 0; b[i] = v * (1 - i / b.length); }
  return b;
};
const roar = (sec) => shape(lowpass(noise(sec, 0, 0.2), 380), (p, t) => (0.5 + 0.5 * Math.sin(t * 2.1) * Math.sin(t * 0.7 + 1)) * Math.min(1, p * 6) * Math.min(1, (1 - p) * 6));
const crackles = (from, sec, n) => { for (let k = 0; k < n; k++) add(from + Math.random() * sec, shape(highpass(noise(0.03, 0, 0.9), 1800), (p) => 1 - p), 0.12 + Math.random() * 0.15); };
const wind = (sec) => shape(lowpass(highpass(noise(sec, 0, 0.6), 300), 1400), (p, t) => (0.3 + 0.7 * Math.sin(t * 0.9) ** 2) * Math.min(1, p * 4) * Math.min(1, (1 - p) * 4));

// 드론: D1 · Eb1 반음 + G#2(트라이톤), 밤부터
for (let t = night.from; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(26, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: 0.003 }), tone(27, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: -0.004 })), 180), 0.25);
  add(t, tone(44, 4.6, { attack: 1.5, release: 1.5 }), 0.03);
}
// 저음 펄스: 별명 카드부터 끝 전까지, 1.6초 → 0.7초 간격
{
  const p0 = S[4].from, p1 = S[S.length - 2].from - 0.4;
  for (let t = p0; t < p1; ) { const k = (t - p0) / (p1 - p0); add(t, lowpass(kick(0.5), 200), 0.45 + 0.25 * k); t += 1.6 - 0.9 * k; }
}
// 낮: 바람 + 높은 쉭 (불길함)
add(0, wind(S[0].dur), 0.35);
add(0.3, lowpass(riser(1.8, true), 2000), 0.12);

S.forEach((s, i) => {
  if (i > 0 && s.type !== "end" && s.type !== "black" && S[i - 1].type !== "black") add(s.from - 0.12, highpass(riser(0.25, false), 900), 0.18);
  if (s.stamp) add(s.from + s.stamp.at, slam(), 0.85);
  for (const h of s.hits ?? []) {
    const t = s.from + h.at;
    if (h.kind === "red") add(t, stinger(), 0.3);
    if (h.kind === "glitch") add(t, glitchy(), 0.3);
    if (h.kind === "shake") add(t, lowpass(kick(0.6), 220), 0.5);
    if (h.kind === "flash") add(t, slam(), 0.85);
  }
  // 불 장면: 웅웅 + 탁탁
  const fire = s.image && s.image !== "wikimedia-9b2b2566.jpg" && s.image !== "wikimedia-d842375b.jpg" || s.video;
  if (fire) { add(s.from, roar(s.dur), 0.5); crackles(s.from, s.dur, Math.round(s.dur * 6)); }
  if (s.image === "wikimedia-d842375b.jpg") { add(s.from, wind(s.dur), 0.3); add(s.from, roar(s.dur), 0.2); }
});

// 암전: 완전한 정적
for (let i = Math.round(black.from * RATE); i < Math.round((black.from + black.dur) * RATE); i++) mix[i] = 0;
// 마지막 사진 직전 0.3초 정적
{
  const last = S[S.length - 2];
  for (let i = Math.round((last.from - 0.3) * RATE); i < Math.round(last.from * RATE); i++) mix[i] *= 0.03;
}
// 끝 카드: 바람 + 꺼져 가는 불
add(end, wind(SEC - end), 0.3);
add(end, roar(SEC - end), 0.25);

writeWav("hellgate", mix, { drive: 1.8, level: 0.5, fadeSec: 1.2 });
