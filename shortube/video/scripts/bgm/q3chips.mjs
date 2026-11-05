// 3분기 실적(삼성 · 하이닉스 · 알파벳) 쇼츠 배경음악 — 120BPM 신스 아르페지오 · 전자 '삑' (채널 첫 사용).
// 16분음 사각파 아르페지오(낮은 필터) + 4박 킥 + 오프비트 하이햇, 진행 Dm - Bb - F - C.
// 회로 전류 전환(wipes)에 위로 올라가는 글라이드, 숫자가 박힐 때(hits) 높은 '삑'.
// 사용: node scripts/bgm/q3chips.mjs → content/q3chips/music/q3chips.wav
import { glide, kick, lowpass, noise, session, tone, writeWav } from "./_synth.mjs";

const { SEC, TL, mix, add, BEAT, f2s } = session("q3chips");
const bar = 4 * BEAT, s16 = BEAT / 4;
const CH = [
  { root: 38, arp: [62, 65, 69, 74] }, // Dm
  { root: 46, arp: [62, 65, 70, 74] }, // Bb
  { root: 41, arp: [60, 65, 69, 72] }, // F
  { root: 48, arp: [60, 64, 67, 72] }, // C
];
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 4];
  for (let b = 0; b < 4; b++) {
    add(t0 + b * BEAT, lowpass(tone(ch.root, BEAT * 0.45, { kind: "saw", decay: 5 }), 400), 0.3);
    if (k >= 1) add(t0 + b * BEAT, kick(0.9), 0.5);
    add(t0 + b * BEAT + BEAT / 2, noise(0.04, 80, 0.98), 0.08);
  }
  for (let i = 0; i < 16; i++) {
    const m = ch.arp[[0, 1, 2, 3, 2, 1][i % 6]] + (i % 8 === 7 ? 12 : 0);
    add(t0 + i * s16, lowpass(tone(m, s16 * 0.9, { kind: "square", decay: 10, duty: 0.3 }), 1400 + 600 * Math.sin(k / 2)), 0.045);
  }
}
for (const f of TL.wipes) add(f2s(f) - 0.15, lowpass(glide(60, 84, 0.4, { kind: "saw", decay: 4 }), 2500), 0.08);
for (const f of TL.hits) add(f2s(f), tone(96, 0.15, { kind: "square", decay: 18, duty: 0.25 }), 0.06);
writeWav("q3chips", mix, { drive: 1.6, level: 0.4 });
