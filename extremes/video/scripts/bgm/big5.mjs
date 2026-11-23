// EARTH'S MOST ② 1 g 에 가장 비싼 것 TOP 5 — 코드로 지은 "곡" (외부 음원 없음).
//   2026-11-14 다시 지음: 동전 · 쿵 · 상승 소음 효과음을 빼고, 듣기 편한 곡으로.
//   C 장조, 88bpm, Cmaj7 – Am7 – Dm7 – G7sus. 고급 라운지 느낌의 가벼운 그루브 (값비싼 것 · 반짝임).
//   흐름: 처음 = 피아노 코드만 → 첫 순위부터 베이스 · 킥 · 스냅 · 줄 뜯기 멜로디 → 1위에서 멜로디 한 옥타브 겹침
//         → 반전(금 2배)에서 박자가 빠지고 → 끝 카드에서 Dmaj9 로 닫힌다.
// 사용: node scripts/bgm/big5.mjs → content/big5/music/big5.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, snap, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("big5");
const S = TL.shots;
const BEAT = 60 / 88, BAR = BEAT * 4;
const rank1 = S.find((s) => s.rank === 1).from;
const firstRank = S.find((s) => s.rank).from;
const twist = S.find((s, i) => i > 0 && !s.rank && s.type !== "end").from;
const end = S.find((s) => s.type === "end").from;

const CHORDS = [
  [36, [60, 64, 67, 71]], // Cmaj7
  [33, [57, 60, 64, 67]], // Am7
  [38, [57, 60, 62, 65]], // Dm7
  [31, [55, 60, 62, 65]], // G7sus
];
// 멜로디 (박, 음, 길이 박)
const MELODY = [
  [[0, 76, 1], [1, 74, 0.5], [1.5, 71, 1], [3, 72, 1]],
  [[0.5, 72, 0.5], [1, 71, 0.5], [1.5, 69, 1.5], [3.5, 67, 0.5]],
  [[0, 69, 1], [1, 72, 0.5], [1.5, 74, 1], [3, 76, 1]],
  [[0, 74, 2], [2.5, 71, 0.5], [3, 72, 1]],
];

for (let bar = 0; bar * BAR < end; bar++) {
  const t0 = bar * BAR;
  const [b, notes] = CHORDS[bar % 4];
  const groove = t0 >= firstRank - 0.1 && t0 < twist;
  const full = t0 >= rank1 - 0.1 && t0 < twist;
  // 피아노 코드: 1박 + 2.5박 (가볍게 밀어 치기)
  for (const p of [0, 2.5]) notes.forEach((m, j) => add(t0 + p * BEAT + j * 0.012, epiano(m, BEAT * 1.8, 0.7), 0.045));
  add(t0, pad(notes, BAR + 0.4, 0.5), 0.035);
  {
    add(t0, bass(b, BEAT * 1.5), 0.24);
    add(t0 + BEAT * 1.5, bass(b + 12, BEAT * 0.5), 0.14);
    add(t0 + BEAT * 2, bass(b + 7, BEAT * 1.5), 0.18);
  }
  if (groove) {
    add(t0, softKick(), 0.3); add(t0 + BEAT * 2.5, softKick(), 0.2);
    add(t0 + BEAT, snap(), 0.12); add(t0 + BEAT * 3, snap(), 0.12);
    for (let k = 0; k < 8; k++) add(t0 + k * BEAT / 2, hat(), k % 2 ? 0.04 : 0.022);
    for (const [p, m, d] of MELODY[bar % 4]) {
      add(t0 + p * BEAT, pluck(m, d * BEAT + 0.4, 0.55), 0.09);
      if (full) add(t0 + p * BEAT, epiano(m + 12, d * BEAT + 0.6, 1), 0.035);
    }
  }
}
// 끝 카드: Dmaj9 를 천천히 펼쳐 치고 남긴다
add(end, pad([60, 64, 67, 71, 74], SEC - end, 0.6), 0.07);
add(end, bass(36, SEC - end), 0.2);
[60, 64, 67, 71, 74, 79].forEach((m, j) => add(end + j * 0.08, epiano(m, SEC - end, 0.9), 0.05));

space(mix, 0.3);
writeWav("big5", mix, { drive: 1.0, level: 0.5, fadeSec: 1.5 });
