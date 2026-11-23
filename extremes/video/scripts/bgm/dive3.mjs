// DIVE ③ 하늘 위로 끝까지 — 코드로 지은 "곡" (외부 음원 없음, 효과음 없음).
//   100bpm, G 장조. ① 바다(D, 76bpm, 아르페지오) · ② 땅속(Em, 92bpm, pluck 리프)과 다르게
//   올라가는 곡: 매 반 마디 멜로디가 위로 걷는 음계(상행)이고, 높아질수록 한 옥타브씩 밝아진다.
//   지표 ~ 비행기: Gmaj7 – D/F# – Em7 – Cadd9, 산부터 박자.
//   우주(카르만 선)부터 박자가 빠지고 넓은 패드 + 높은 종소리(epiano 고음)만 — 소리 없는 우주.
//   달에서 다시 박자, 아르테미스 2호에서 가장 풍성하게, "And down? Only 12 km." 에서 숨을 멈추고
//   끝 카드에서 G 로 닫힌다 → 첫 장면(지표)으로 이어진다.
// 사용: node scripts/bgm/dive3.mjs → content/dive3/music/dive3.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, snap, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("dive3");
const S = TL.shots;
const BEAT = 60 / TL.bpm;
const HALF = BEAT * 2;
const at = (d) => S.find((s) => s.depth === d).from;
const groove = at(8849); // 산: 박자 시작
const spaceAt = at(100000); // 우주: 박자 빠짐
const moon = at(384400000); // 달: 박자 다시
const last = at(406771000);
const hush = last + 2.25; // "And down? Only 12 km."
const end = S.find((s) => s.type === "end").from;

const PROG = [
  [43, [62, 66, 67, 71, 74]], // Gmaj7
  [42, [62, 66, 69, 74, 78]], // D/F#
  [40, [62, 64, 67, 71, 74]], // Em7
  [36, [60, 62, 64, 67, 72]], // Cadd9
];
const SCALE = [67, 69, 71, 72, 74, 76, 78, 79]; // G 장조 상행

let k = 0;
for (let t0 = 0; t0 < hush - 0.05; t0 += HALF, k++) {
  const [b, notes] = PROG[k % 4];
  const len = Math.min(HALF, hush - t0);
  const inSpace = t0 >= spaceAt - 0.05 && t0 < moon - 0.05;
  const peak = t0 >= last - 0.05;
  // 고도에 따라 옥타브: 지표 0, 산~비행기 +0, 우주 +12
  const oct = t0 >= spaceAt - 0.05 ? 12 : 0;
  add(t0, pad(notes.slice(0, 4).map((m) => m + (inSpace ? 12 : 0)), len + 0.6, inSpace ? 0.9 : 0.5), inSpace ? 0.1 : 0.065);
  add(t0, bass(b, len), inSpace ? 0.1 : peak ? 0.24 : 0.18);
  // 상행 멜로디: 8분음표 네 개가 계단처럼 오른다 (반 마디마다 시작음이 한 칸씩 올라간다)
  const base = k % 4;
  for (let j = 0; j < 4; j++) {
    const m = SCALE[(base + j) % SCALE.length] + oct;
    if (inSpace) { if (j % 2 === 0) add(t0 + j * BEAT / 2, epiano(m + 12, 1.6, 1), 0.035); }
    else add(t0 + j * BEAT / 2, pluck(m, 0.45, 0.6), peak ? 0.075 : 0.06);
  }
  if (!inSpace) add(t0, epiano(notes[4] + oct, HALF * 0.95, 0.8), 0.045);
  // 박자: 산 ~ 우주 전, 달부터 다시
  if (t0 >= groove - 0.05 && !inSpace) {
    add(t0, softKick(), 0.3);
    add(t0 + BEAT, peak || t0 >= moon - 0.05 ? snap() : softKick(), peak ? 0.13 : 0.15);
    const n = peak ? 4 : 2;
    for (let h = 0; h < n; h++) add(t0 + (h * HALF) / n, hat(), h % 2 ? 0.03 : 0.018);
  }
}
// "고작 12 km": 낮은 Em 한 번, 숨 멈춤
add(hush, pad([52, 59, 64, 67], end - hush + 0.3, 0.4), 0.08);
add(hush, bass(40, end - hush), 0.16);
// 끝 카드: G 로 닫힌다
add(end, pad([67, 71, 74, 79], SEC - end, 0.5), 0.09);
add(end, bass(43, SEC - end), 0.16);
[67, 71, 74, 78, 79, 83].forEach((m, j) => add(end + j * 0.11, epiano(m, SEC - end, 0.9), 0.055));

space(mix, 0.45);
writeWav("dive3", mix, { drive: 1.0, level: 0.5, fadeSec: 1.2 });
