// WHAT IF ① 얼음이 다 녹으면 — 코드로 지은 "곡" (외부 음원 없음, 효과음 없음).
//   72bpm, D 단조 느낌의 차가운 진행: Dm7 – Bbmaj7 – Fmaj7 – Csus. 맑은 전자 피아노 + 패드 + 둥근 베이스.
//   흐름: 첫 샷 = 피아노 코드만 → 막대 샷부터 베이스 · 가벼운 킥 · 하이햇 · 높은 멜로디
//         → "수백~수천 년" 샷에서 박자가 빠지고 → 끝 카드에서 Fmaj9 로 닫힌다.
// 사용: node scripts/bgm/icemelt.mjs → content/icemelt/music/icemelt.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("icemelt");
const S = TL.shots;
const BEAT = 60 / 72, BAR = BEAT * 4;
const groove0 = S[1].from;
const drop = S[S.length - 2].from; // 마지막 본편 샷(수백~수천 년)에서 박자가 빠진다
const end = S.find((s) => s.type === "end").from;

const CHORDS = [
  [38, [57, 60, 62, 65]], // Dm7
  [34, [58, 62, 65, 69]], // Bbmaj7
  [41, [57, 60, 64, 65]], // Fmaj7
  [36, [55, 60, 62, 67]], // Csus
];
const MELODY = [
  [[0, 74, 1.5], [2, 72, 1], [3, 69, 1]],
  [[0.5, 70, 1], [2, 74, 1.5]],
  [[0, 72, 1], [1.5, 69, 0.5], [2, 65, 2]],
  [[0, 67, 1.5], [2.5, 69, 0.5], [3, 72, 1]],
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
    add(t0, softKick(), 0.22);
    add(t0 + BEAT * 2.5, softKick(), 0.14);
    for (let k = 0; k < 8; k++) add(t0 + k * BEAT / 2, hat(), k % 2 ? 0.03 : 0.016);
    for (const [p, m, d] of MELODY[bar % 4]) add(t0 + p * BEAT, pluck(m, d * BEAT + 0.5, 0.5), 0.08);
  }
}
// 끝 카드: Fmaj9 를 천천히 펼쳐 치고 남긴다
add(end, pad([53, 57, 60, 64, 67], SEC - end, 0.6), 0.07);
add(end, bass(41, SEC - end), 0.2);
[65, 69, 72, 76, 79].forEach((m, j) => add(end + j * 0.09, epiano(m, SEC - end, 0.9), 0.05));

space(mix, 0.3);
writeWav("icemelt", mix, { drive: 1.0, level: 0.5, fadeSec: 1.5 });
