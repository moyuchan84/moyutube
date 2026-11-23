// 컨닝의 역사 ① 답안 베껴 쓰기 — 코드로 지은 곡 (외부 음원 없음, 효과음 없음).
//   84bpm, A 단조 펜타토닉 느낌: Am7 – Fmaj7 – G6 – Em7. 맑은 전자 피아노 + 패드 + 베이스, 가벼운 박자.
//   흐름: 첫 장면 = 코드만 → 두 번째 장면부터 베이스 · 킥 · 하이햇 · 멜로디 → 마지막 본편 장면에서 박자가 빠짐 → 끝 카드는 Am9 로 닫힘.
// 사용: node scripts/bgm/examcopyk.mjs → content/examcopyk/music/examcopyk.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("examcopyk");
const S = TL.shots;
const BEAT = 60 / 84, BAR = BEAT * 4;
const groove0 = S[1].from;
const drop = S[S.length - 2].from;
const end = S.find((s) => s.type === "end").from;

const CHORDS = [
  [33, [57, 60, 64, 67]], // Am7
  [41, [57, 60, 64, 65]], // Fmaj7
  [31, [55, 59, 62, 64]], // G6
  [40, [55, 59, 62, 64]], // Em7
];
const MELODY = [
  [[0, 76, 1], [1.5, 72, 0.5], [2, 69, 1.5]],
  [[0, 72, 1], [2, 76, 1], [3, 79, 1]],
  [[0.5, 74, 1], [2, 71, 1], [3, 74, 1]],
  [[0, 71, 1.5], [2, 67, 1], [3, 69, 1]],
];

for (let bar = 0; bar * BAR < end; bar++) {
  const t0 = bar * BAR;
  const [b, notes] = CHORDS[bar % 4];
  const groove = t0 >= groove0 - 0.1 && t0 < drop;
  for (const p of [0, 2.5]) notes.forEach((m, j) => add(t0 + p * BEAT + j * 0.014, epiano(m, BEAT * 2.2, 0.8), 0.05));
  add(t0, pad(notes, BAR + 0.5, 0.6), 0.04);
  add(t0, bass(b, BEAT * 2), 0.22);
  add(t0 + BEAT * 2, bass(b + 7, BEAT * 2), 0.16);
  if (groove) {
    add(t0, softKick(), 0.2);
    add(t0 + BEAT * 2.5, softKick(), 0.13);
    for (let k = 0; k < 8; k++) add(t0 + (k * BEAT) / 2, hat(), k % 2 ? 0.03 : 0.016);
    for (const [p, m, d] of MELODY[bar % 4]) add(t0 + p * BEAT, pluck(m, d * BEAT + 0.5, 0.5), 0.08);
  }
}
add(end, pad([45, 57, 60, 64, 71], SEC - end, 0.6), 0.07);
add(end, bass(33, SEC - end), 0.2);
[69, 72, 76, 79, 83].forEach((m, j) => add(end + j * 0.09, epiano(m, SEC - end, 0.9), 0.05));

space(mix, 0.3);
writeWav("examcopyk", mix, { drive: 1.0, level: 0.5, fadeSec: 1.5 });
