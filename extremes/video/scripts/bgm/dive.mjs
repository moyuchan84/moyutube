// DIVE ① 바다 끝까지 — 코드로 지은 "곡" (외부 음원 없음, 효과음 없음).
//   76bpm. 내려갈수록 어두워지는 곡: 수면 · 햇빛 구간은 D 장조(Dmaj9 – Bm9 – Gmaj7 – A6)로 밝게,
//   햇빛이 사라지는 1,000 m 부터 D 단조(Dm9 – B♭maj7 – Gm9 – A7sus4)로 바뀌고, 깊어질수록 멜로디 음역이 내려간다.
//   고래부터 부드러운 박자(심장 박동처럼 1 · 3박), 바닥(10,935 m)에서 박자가 빠지고 숨 고르기,
//   끝 카드에서 다시 D 장조로 밝게 닫힌다 → 첫 장면(수면)으로 이어진다.
// 사용: node scripts/bgm/dive.mjs → content/dive/music/dive.wav
import { session, writeWav } from "./_synth.mjs";
import { bass, epiano, hat, pad, pluck, softKick, space } from "./_music.mjs";

const { TL, SEC, mix, add } = session("dive");
const S = TL.shots;
const BEAT = 60 / TL.bpm;
const HALF = BEAT * 2; // 코드는 반 마디(2박)마다 바뀐다 — 컷이 2.4초 안팎이라 빠르게
const at = (d) => S.find((s) => s.depth === d).from;
const dark = at(1000); // 햇빛이 사라지는 곳
const pulse = at(2992); // 박자 시작
const bottom = at(10935); // 바닥: 박자 빠짐
const end = S.find((s) => s.type === "end").from;

// [베이스, 코드 음들]
const LIGHT = [
  [50, [62, 66, 69, 73, 76]], // Dmaj9
  [47, [59, 62, 66, 69, 73]], // Bm9
  [43, [59, 62, 66, 67, 71]], // Gmaj7
  [45, [57, 61, 64, 66, 69]], // A6
];
const DARK = [
  [50, [57, 60, 62, 65, 64]], // Dm9
  [46, [58, 62, 65, 69, 70]], // B♭maj7
  [43, [58, 62, 65, 67, 69]], // Gm9
  [45, [57, 62, 64, 67, 69]], // A7sus4
];
// 짧은 동기 (박, 반음 위치) — 코드 음 인덱스로 고른다
const MOTIF = [[0, 4], [0.5, 3], [1, 2], [1.5, 3]];

let k = 0;
for (let t0 = 0; t0 < end - 0.05; t0 += HALF, k++) {
  const isDark = t0 >= dark - 0.05;
  const [b, notes] = (isDark ? DARK : LIGHT)[k % 4];
  const len = Math.min(HALF, end - t0);
  // 깊이에 따라 멜로디를 내린다: 햇빛 +12, 어둠 0, 바닥 -12
  const lift = !isDark ? 12 : t0 < at(8336) ? 0 : -12;
  add(t0, pad(notes.slice(0, 4), len + 0.5, 0.5), 0.07);
  add(t0, bass(b - (isDark ? 12 : 0), len), isDark ? 0.24 : 0.16);
  // 아르페지오 (8분음표)
  [0, 1, 2, 3].forEach((n, j) => add(t0 + j * BEAT / 2, epiano(notes[n] + (isDark ? 0 : 12), 1.2, isDark ? 0.4 : 0.9), 0.04));
  // 동기: 바닥 전까지
  if (t0 < bottom - 0.05) {
    for (const [p, n] of MOTIF) {
      const m = notes[n] + lift;
      add(t0 + p * BEAT, epiano(m, 1.0, isDark ? 0.5 : 1), 0.07);
      if (!isDark) add(t0 + p * BEAT, pluck(m + 12, 0.6, 0.5), 0.025);
    }
  }
  // 박자: 고래 ~ 바닥 전
  if (t0 >= pulse - 0.05 && t0 < bottom - 0.05) {
    add(t0, softKick(), 0.3);
    add(t0 + BEAT, softKick(), 0.18);
    for (let h = 0; h < 4; h++) add(t0 + h * BEAT / 2, hat(), h % 2 ? 0.03 : 0.015);
  }
}
// 바닥: 낮은 Dm 를 길게 (숨 고르기)
add(bottom, pad([38, 45, 50, 53], end - bottom + 0.3, 0.6), 0.08);
// 끝 카드: 다시 Dmaj9 로 밝게 닫힌다 (수면으로 돌아가는 느낌)
add(end, pad([62, 66, 69, 76], SEC - end, 0.5), 0.09);
add(end, bass(50, SEC - end), 0.16);
[62, 66, 69, 73, 76, 81].forEach((m, j) => add(end + j * 0.11, epiano(m, SEC - end, 0.9), 0.055));

space(mix, 0.4);
writeWav("dive", mix, { drive: 1.0, level: 0.5, fadeSec: 1.2 });
