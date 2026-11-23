// NO ENTRY ③ 뱀섬 — 전부 코드 합성 (외부 음원 없음).
//   깔림: 낮은 단조 드론(라 · 시♭ 반음 부딪힘) + 정글 밤 벌레 소리(떨리는 고음) · 느린 심장 박동(점점 빨라짐)
//   뱀 장면 = 쉭 하는 숨소리 · 방울 떨림, 바다 영상 = 파도, 새 영상 = 날갯짓, 컷마다 휙, 도장에서 쾅
//   반전("위험한 건…") 직전 0.3초 정적 → 쾅, 원칙 샷은 심장 없이 파도만
// 사용: node scripts/bgm/snake.mjs → content/snake/music/snake.wav
import { RATE, glide, kick, lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("snake");
const S = TL.shots;
const end = S.find((s) => s.type === "end").from;
const last = S[S.length - 2];
const highpass = (b, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0, px = 0;
  for (let i = 0; i < b.length; i++) { const x = b[i]; y = a * (y + x - px); px = x; b[i] = y; }
  return b;
};
const shape = (b, f) => { for (let i = 0; i < b.length; i++) b[i] *= f(i / b.length, i / RATE); return b; };
const slam = () => sum(lowpass(kick(1.4), 500), tone(24, 2.2, { decay: 1.4 }), lowpass(noise(0.6, 7, 0.5), 900));
const stinger = () => shape(lowpass(sum(...[69, 70, 75, 76].map((m, i) => glide(m, m - 3 - i, 1.0, { kind: "saw", decay: 2.2 }))), 3000), (p) => Math.min(1, p * 25) * (1 - p) ** 1.5);
const hiss = (sec) => shape(lowpass(highpass(noise(sec, 0, 0.9), 3000), 9000), (p) => Math.sin(Math.PI * Math.min(1, p * 1.2)) ** 1.5);
const rattle = (sec) => shape(highpass(noise(sec, 0, 0.9), 2500), (p, t) => (Math.sin(t * 2 * Math.PI * 48) > 0.3 ? 1 : 0.08) * Math.min(1, p * 10) * (1 - p));
const waves = (sec) => shape(lowpass(noise(sec, 0, 0.3), 700), (p, t) => (0.4 + 0.6 * Math.sin(t * 1.3) ** 2) * Math.min(1, p * 5) * Math.min(1, (1 - p) * 5));

// 드론: A1 · Bb1 반음 부딪힘 + 높은 떨림
for (let t = 0; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(33, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: 0.003 }), tone(34, 4.6, { kind: "saw", attack: 1.0, release: 1.2, detune: -0.004 })), 220), 0.22);
  add(t, sum(tone(93, 4.6, { attack: 1.5, release: 1.5 }), tone(94, 4.6, { attack: 1.5, release: 1.5 })), 0.008);
}
// 밤 벌레 소리: 짧은 고음 찌르르 (불규칙)
for (let t = 0.5; t < end; t += 0.9 + Math.random() * 1.4) add(t, shape(tone(100 + Math.random() * 3, 0.25), (p, x) => (Math.sin(x * 2 * Math.PI * 30) > 0 ? 1 : 0) * Math.sin(Math.PI * p)), 0.025);
// 심장: 두 번째 샷부터 원칙 샷 전까지 60 → 100 bpm
const h0 = S[1].from, h1 = last.from - 0.2;
for (let t = h0; t < h1; ) {
  const k = (t - h0) / (h1 - h0);
  add(t, lowpass(kick(0.35), 300), 0.5 + 0.25 * k);
  add(t + 0.17, lowpass(kick(0.25), 260), 0.32 + 0.2 * k);
  t += 60 / (60 + 40 * k * k);
}
// 첫 쾅 + 쉭
add(0, slam(), 0.9);
add(0.2, hiss(1.2), 0.25);

S.forEach((s, i) => {
  if (i > 0 && s.type !== "end") add(s.from - 0.12, highpass(riser(0.25, false), 900), 0.2);
  if (s.stamp) add(s.from + s.stamp.at, slam(), 0.85);
  for (const h of s.hits ?? []) {
    const t = s.from + h.at;
    if (h.kind === "red") add(t, stinger(), 0.3);
    if (h.kind === "glitch") add(t, rattle(0.6), 0.25);
    if (h.kind === "shake") add(t, lowpass(kick(0.6), 220), 0.5);
    if (h.kind === "flash" && t > 0.5) add(t, slam(), 0.7);
  }
  // 뱀 장면: 쉭 + 방울
  if (s.video === "pixabay-b7e7bebd.mp4") { add(s.from + 0.3, rattle(1.6), 0.18); add(s.from + 1.2, hiss(1.0), 0.22); }
  if (s.image === "wikimedia-4ec0aadc.jpg") add(s.from + 0.4, hiss(1.4), 0.2);
  // 바다
  if (s.video === "pixabay-84c6d64e.mp4") add(s.from, waves(s.dur), 0.4);
  // 새: 날갯짓 (짧은 저음 노이즈 펄럭임)
  if (s.video === "pixabay-985e1178.mp4") for (let t = 0.2; t < 1.8; t += 0.16) add(s.from + t, shape(lowpass(noise(0.09, 0, 0.5), 1500), (p) => Math.sin(Math.PI * p)), 0.18);
});

// 반전 사진 직전 0.3초 정적 → 쾅 (flash hit 이 처리)
{
  const punch = S.find((x) => x.image === "wikimedia-4ec0aadc.jpg" && (x.hits ?? []).some((h) => h.kind === "flash"));
  for (let i = Math.round((punch.from - 0.3) * RATE); i < Math.round(punch.from * RATE); i++) mix[i] *= 0.05;
}
// 원칙 샷: 파도 + 낮은 울림
add(last.from, waves(end - last.from + 0.5), 0.3);
add(last.from, tone(21, 3.0, { decay: 0.9 }), 0.5);
// 끝 카드: 첫 장면과 같은 쾅
add(end, slam(), 0.6);

writeWav("snake", mix, { drive: 1.8, level: 0.5, fadeSec: 1.2 });
