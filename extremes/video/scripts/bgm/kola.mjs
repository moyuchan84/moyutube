// Kola 쇼츠 배경음악 — 더 낮고 어두운 드론 · 컷마다 쉭 · 가짜 도장에서 쿵 + 정적 · 마지막 막대에서 가벼운 상승. 외부 음원 없음.
// 사용: node scripts/bgm/kola.mjs → content/kola/music/kola.wav
import { lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add } = session("kola");
const hoax = TL.shots.find((s) => s.stamp);
for (let t = 0; t < SEC; t += 4) {
  add(t, lowpass(sum(tone(31, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: 0.005 }), tone(46, 4.6, { kind: "saw", attack: 1.2, release: 1.2, detune: -0.005 })), 240), 0.3);
}
TL.shots.forEach((s, i) => {
  if (i > 0) add(s.from - 0.05, lowpass(noise(0.4, 5, 0.5), 2000), 0.2);
  add(s.from, sum(tone(98 - i * 4, 2.4, { decay: 2.2 }), tone(110 - i * 4, 1.8, { decay: 3 })), 0.1);
  for (let t = s.from + 2.4; t < s.from + s.dur - 0.5; t += 2.4) add(t, tone(84 - i * 4, 2.0, { decay: 2.6 }), 0.05);
});
// 첫 컷: 카운터가 올라가는 동안 라이저
add(0.1, lowpass(riser(1.7, true), 1200), 0.15);
// 온도 샷: 두 번째 막대(빨강)에서 낮은 울림
const temp = TL.shots.find((s) => s.bars && s.bars.length === 2 && s.bars[1].value === 180);
if (temp) add(temp.from + temp.bars[1].at, tone(36, 1.8, { decay: 2.0 }), 0.4);
// 가짜 도장: 쿵 + 노이즈
if (hoax) {
  const t0 = hoax.from + hoax.stamp.at;
  add(t0, lowpass(noise(0.8, 5, 0.5), 500), 0.55);
  add(t0, tone(27, 1.8, { decay: 2.2 }), 0.55);
}
const earth = TL.shots.filter((s) => s.bars).pop();
if (earth) add(earth.from + earth.bars[1].at, lowpass(riser(1.2, true), 1800), 0.12);
writeWav("kola", mix, { drive: 1.6, level: 0.45, fadeSec: 2.5 });
