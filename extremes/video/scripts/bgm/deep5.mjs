// EARTH'S MOST ① 가장 깊은 구멍 TOP 5 — 코드로 지은 "곡" (외부 음원 없음).
//   2026-11-14 다시 지음: 드론 · 쿵 · 소나 핑 · 땅울림 효과음을 빼고, 듣기 편한 곡으로.
//   A 단조, 84bpm, Am9 – Fmaj7 – Cmaj7 – G6. 신비롭지만 따뜻하게 (심해 · 동굴 분위기).
//   흐름: 처음 = 피아노 아르페지오 + 패드 → 첫 순위부터 베이스 · 부드러운 박자 → 1위에서 가장 풍성
//         → 반전(0.19%)에서 박자가 빠지고 숨 고르기 → 끝 카드에서 Am 으로 닫힌다.
// 사용: node scripts/bgm/deep5.mjs → content/deep5/music/deep5.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("deep5");
const S = TL.shots;
const BEAT = 60 / 84, BAR = BEAT * 4;
const rank1 = S.find((s) => s.rank === 1).from;
const firstRank = S.find((s) => s.rank).from;
const twist = S.find((s, i) => i > 0 && !s.rank && s.type !== "end").from;
const end = S.find((s) => s.type === "end").from;

// 코드: [베이스, 패드/아르페지오 음들]
const CHORDS = [
  [45, [57, 60, 64, 67, 71]], // Am9
  [41, [57, 60, 64, 65, 69]], // Fmaj7
  [48, [55, 59, 60, 64, 67]], // Cmaj7
  [43, [55, 59, 62, 64, 67]], // G6
];
// 멜로디 (박 위치, 음) — 마디마다 짧은 물음표 같은 동기
const MELODY = [
  [[0, 76], [1.5, 74], [2, 72], [3, 71]],
  [[0, 72], [1.5, 69], [2, 72], [3, 74]],
  [[0, 71], [1.5, 72], [2, 74], [3, 76]],
  [[0, 74], [2, 71], [3, 67]],
];

for (let bar = 0; bar * BAR < end; bar++) {
  const t0 = bar * BAR;
  const [b, notes] = CHORDS[bar % 4];
  const busy = t0 >= firstRank && t0 < twist;
  const full = t0 >= rank1 - 0.1 && t0 < twist;
  add(t0, pad(notes.slice(0, 4), BAR + 0.6), 0.07);
  // 아르페지오: 8분음표로 위아래
  const arp = [0, 1, 2, 3, 4, 3, 2, 1];
  arp.forEach((k, j) => add(t0 + j * BEAT / 2, epiano(notes[k], 1.4, 0.6), 0.045));
  {
    add(t0, bass(b, BEAT * 2.2), 0.22);
    add(t0 + BEAT * 2.5, bass(b, BEAT * 1.4), 0.16);
  }
  if (busy) {
    for (let k = 0; k < 4; k++) { if (k % 2 === 0) add(t0 + k * BEAT, softKick(), 0.28); }
    for (let k = 0; k < 8; k++) add(t0 + k * BEAT / 2, hat(), k % 2 ? 0.035 : 0.02);
  }
  if (t0 >= 7.0 && t0 < end - 0.1) {
    for (const [p, m] of MELODY[bar % 4]) {
      add(t0 + p * BEAT, epiano(m, 1.6, 1), 0.08);
      if (full) add(t0 + p * BEAT, pluck(m + 12, 0.8, 0.45), 0.03);
    }
  }
}
// 끝 카드: Am(add9) 한 번 크게 울리고 길게 남긴다
add(end, pad([57, 60, 64, 71], SEC - end, 0.6), 0.09);
add(end, bass(45, SEC - end), 0.18);
[57, 60, 64, 71, 76].forEach((m, j) => add(end + j * 0.09, epiano(m, SEC - end, 0.8), 0.06));

space(mix, 0.35);
writeWav("deep5", mix, { drive: 1.0, level: 0.5, fadeSec: 1.5 });
