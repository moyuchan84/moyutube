// 구룡마을 화재 쇼츠 배경음악 — 72BPM 낮은 드론 · 심장 박동 킥 · 타닥 소리 (채널 첫 사용).
// 단조 진행 Am - F - C - G 를 둥근 패드로 길게, 박마다 둔한 킥 두 번(쿵-쿵), 바탕에 불씨 타닥 잡음.
// 연기 전환(wipes)에 낮은 바람 소리, 숫자가 박힐 때(hits) 종 같은 사인 '딩'.
// 사용: node scripts/bgm/guryong.mjs → content/guryong/music/guryong.wav
import { glide, kick, lowpass, noise, session, sum, tone, writeWav } from "./_synth.mjs";

const { SEC, TL, mix, add, BEAT, f2s } = session("guryong");
const bar = 4 * BEAT;
const CH = [
  [45, 57, 60, 64], // Am
  [41, 57, 60, 65], // F
  [48, 55, 60, 64], // C
  [43, 55, 59, 62], // G
];
const pad = (m, sec) => lowpass(sum(tone(m, sec, { kind: "saw", attack: 0.8, release: 0.8, detune: 0.003 }), tone(m, sec, { kind: "saw", attack: 0.8, release: 0.8, detune: -0.003 })), 700);
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 4];
  add(t0, lowpass(tone(ch[0] - 12, bar, { kind: "tri", attack: 0.3, release: 0.6 }), 300), 0.35);
  ch.slice(1).forEach((m) => add(t0, pad(m, bar + 0.4), 0.035));
  if (k >= 1) for (let b = 0; b < 4; b++) {
    add(t0 + b * BEAT, lowpass(kick(0.6), 900), 0.45);
    add(t0 + b * BEAT + BEAT * 0.28, lowpass(kick(0.4), 900), 0.25);
  }
  if (k >= 2) [ch[3] + 12, ch[2] + 12, ch[1] + 12].forEach((m, i) => add(t0 + i * BEAT * 1.333, tone(m, 1.4, { decay: 2.5 }), 0.035));
}
// 불씨 타닥: 짧은 고역 잡음을 불규칙하게
for (let t = 0; t < SEC; t += 0.05 + Math.random() * 0.25) add(t, noise(0.012 + Math.random() * 0.02, 150, 0.99), 0.05 + Math.random() * 0.06);
for (const f of TL.wipes) add(f2s(f) - 0.2, lowpass(noise(1.0, 2.5, 0.4), 500), 0.5);
for (const f of TL.hits) add(f2s(f), sum(tone(88, 1.6, { decay: 3 }), tone(95, 1.2, { decay: 4 })), 0.06);
add(f2s(TL.scenes[0].from + 55), glide(40, 33, 1.5, { kind: "tri", decay: 1.5 }), 0.3);
writeWav("guryong", mix, { drive: 1.5, level: 0.4 });
