// Mariana 쇼츠 배경음악 — 깊은 바다 드론 · 컷마다 쉭 + 소나 핑(깊어질수록 낮아짐) · 압력 샷 라이저 · 비닐봉지 샷에서 소리를 비운다. 외부 음원 없음.
// 사용: node scripts/bgm/mariana.mjs → content/mariana/music/mariana.wav
import { lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("mariana");
const bag = TL.shots.find((s) => s.bag);
for (let t = 0; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(38, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: 0.004 }), tone(45, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: -0.004 })), 260), bag && t >= bag.from ? 0.14 : 0.28);
}
TL.shots.forEach((s, i) => {
  if (i > 0) add(s.from - 0.05, lowpass(noise(0.4, 5, 0.5), 2200), 0.2); // 전환 쉭
  add(s.from, sum(tone(110 - i * 5, 2.4, { decay: 2.2 }), tone(124 - i * 5, 1.8, { decay: 3 })), 0.12);
  for (let t = s.from + 2.4; t < s.from + s.dur - 0.5; t += 2.4) add(t, tone(96 - i * 5, 2.0, { decay: 2.6 }), 0.05);
});
const stat = TL.shots.find((s) => s.type === "stat");
if (stat) add(stat.from + 0.2, lowpass(riser(3.0, true), 1400), 0.16);
const card = TL.shots.find((s) => s.type === "card");
if (card) add(card.from + 0.1, tone(29, 1.8, { decay: 2.2 }), 0.45); // 8,336 m: 마지막 물고기 — 낮은 울림
if (bag) add(bag.from + 2.85, tone(33, 2.4, { decay: 2.6 }), 0.4); // "비닐봉지" 글자 순간
writeWav("mariana", mix, { drive: 1.6, level: 0.45, fadeSec: 2.5 });
