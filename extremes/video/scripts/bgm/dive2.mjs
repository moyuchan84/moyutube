// DIVE ② 땅속으로 끝까지 — 코드로 지은 "곡" (외부 음원 없음, 효과음 없음).
//   92bpm, E 단조. ① 바다(D 장조→단조, 76bpm, 전자 피아노 아르페지오)와 다르게 줄 뜯기(pluck) 리프가 주인공.
//   지표 ~ 금광: Em9 – Cmaj7 – Am9 – B7sus4, 동굴부터 부드러운 박자.
//   콜라 "사람은 여기서 멈췄다"에서 박자가 한 번 빠지고(숨),
//   맨틀부터는 사람이 못 가는 구간 — 진행이 C – D – Em – B7 로 바뀌고 멜로디가 반음계씩 올라가며 뜨거워진다 (8분 하이햇 + 스냅).
//   지구 중심에서 박자가 빠지고 Em 를 길게, 끝 카드에서 E 장조로 밝게 닫힌다 → 첫 장면(지표)으로 이어진다.
// 사용: node scripts/bgm/dive2.mjs → content/dive2/music/dive2.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, snap, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("dive2");
const S = TL.shots;
const BEAT = 60 / TL.bpm;
const BAR = BEAT * 4;
const HALF = BEAT * 2;
const at = (d) => S.find((s) => s.depth === d).from;
const groove = at(2224); // 동굴: 박자 시작
const kola = at(12262);
const stop = kola + 1.75; // "Humans stopped here." — 박자 빠짐
const mantle = at(40000); // 사람이 못 가는 구간
const center = at(6371000);
const end = S.find((s) => s.type === "end").from;

// [베이스, 코드 음들]
const HUMAN = [
  [40, [64, 67, 71, 74, 78]], // Em9
  [36, [64, 67, 71, 72, 76]], // Cmaj7
  [45, [60, 64, 67, 69, 71]], // Am9
  [47, [64, 66, 69, 71, 75]], // B7sus4→
];
const DEEP = [
  [36, [64, 67, 72, 76, 79]], // C
  [38, [66, 69, 74, 78, 81]], // D
  [40, [67, 71, 76, 79, 83]], // Em
  [47, [63, 66, 69, 71, 75]], // B7
];
// 리프 (박 위치, 코드 음 인덱스)
const RIFF = [[0, 0], [0.5, 2], [1, 4], [1.5, 2]];

let k = 0;
for (let t0 = 0; t0 < center - 0.05; t0 += HALF, k++) {
  const deep = t0 >= mantle - 0.05;
  const [b, notes] = (deep ? DEEP : HUMAN)[k % 4];
  const len = Math.min(HALF, center - t0);
  const resting = t0 >= stop - 0.05 && t0 < mantle - 0.05;
  add(t0, pad(notes.slice(0, 4), len + 0.5, 0.5), deep ? 0.08 : 0.06);
  add(t0, bass(b, len), deep ? 0.26 : 0.2);
  // 리프: 깊어질수록 한 옥타브 위 덧줄 (뜨거워진다)
  if (!resting) {
    for (const [p, n] of RIFF) {
      add(t0 + p * BEAT, pluck(notes[n], 0.5, deep ? 0.8 : 0.55), 0.07);
      if (deep) add(t0 + p * BEAT, pluck(notes[n] + 12, 0.4, 0.6), 0.03);
    }
  }
  // 멜로디 (반 마디마다 긴 음 하나): 맨틀 뒤로는 마디마다 한 음씩 높아진다
  const lift = deep ? Math.min(7, Math.floor((t0 - mantle) / BAR) * 2) : 0;
  if (!resting) add(t0, epiano(notes[3] + lift, HALF * 0.95, deep ? 1 : 0.7), 0.06);
  // 박자
  if (t0 >= groove - 0.05 && !resting) {
    add(t0, softKick(), 0.3);
    add(t0 + BEAT, deep ? snap() : softKick(), deep ? 0.12 : 0.16);
    const n = deep ? 4 : 2;
    for (let h = 0; h < n; h++) add(t0 + (h * HALF) / n, hat(), h % 2 ? 0.03 : 0.018);
  }
}
// 콜라 정지: 낮은 Em 한 번 (숨)
add(stop, pad([40, 47, 52, 55], mantle - stop + 0.3, 0.4), 0.08);
// 지구 중심: 박자 빠지고 Em 를 길게
add(center, pad([40, 47, 52, 55, 59], end - center + 0.3, 0.6), 0.09);
add(center, bass(28, end - center), 0.2);
// 끝 카드: E 장조로 밝게 닫힌다
add(end, pad([64, 68, 71, 76], SEC - end, 0.5), 0.09);
add(end, bass(40, SEC - end), 0.16);
[64, 68, 71, 75, 76, 80].forEach((m, j) => add(end + j * 0.11, epiano(m, SEC - end, 0.9), 0.055));

space(mix, 0.35);
writeWav("dive2", mix, { drive: 1.0, level: 0.5, fadeSec: 1.2 });
