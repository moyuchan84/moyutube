// 일본 · 영국 비상물자 쇼츠 배경음악 — 108BPM 마림바 · 휘파람 셔플 (채널 첫 사용).
// 나무 소리 마림바(사인 + 4배음, 빠른 감쇠) 셔플 리듬 + 둥근 베이스 + 손뼉 · 셰이커, 진행 F - Dm - Bb - C.
// 테이프 전환(wipes)에 '찌익' 테이프 소리, 숫자가 박힐 때(hits) 실로폰 '띵'. 생수병이 쌓일 땐 통통 소리.
// 사용: node scripts/bgm/stockpile.mjs → content/stockpile/music/stockpile.wav
import { clap, glide, lowpass, noise, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add, BEAT, f2s } = session("stockpile");
const bar = 4 * BEAT;
const sw = BEAT * (2 / 3); // 셔플: 8분 뒷박을 늦게
const marimba = (m, sec = 0.5) => sum(tone(m, sec, { decay: 9 }), (() => { const b = tone(m + 24, sec, { decay: 26 }); for (let i = 0; i < b.length; i++) b[i] *= 0.35; return b; })());
const CH = [
  { root: 41, notes: [65, 69, 72] }, // F
  { root: 38, notes: [62, 65, 69] }, // Dm
  { root: 46, notes: [62, 65, 70] }, // Bb
  { root: 48, notes: [64, 67, 72] }, // C
];
const MEL = [ [77, 76, 72, null], [74, 72, 69, null], [70, 72, 74, 77], [76, null, 72, null] ];
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 4];
  add(t0, lowpass(tone(ch.root, BEAT * 1.6, { kind: "tri", decay: 2 }), 600), 0.4);
  add(t0 + 2 * BEAT, lowpass(tone(ch.root + 7, BEAT * 1.6, { kind: "tri", decay: 2 }), 600), 0.32);
  for (let b = 0; b < 4; b++) {
    add(t0 + b * BEAT, marimba(ch.notes[b % 3]), 0.09);
    add(t0 + b * BEAT + sw, marimba(ch.notes[(b + 1) % 3] + 12, 0.3), 0.06);
    add(t0 + b * BEAT + sw, noise(0.05, 60, 0.98), 0.06);
    if (b % 2) add(t0 + b * BEAT, clap(), 0.14);
    else add(t0 + b * BEAT, lowpass(noise(0.1, 40, 0.2), 500), 0.35);
  }
  if (k >= 1) MEL[k % 4].forEach((m, b) => m && add(t0 + b * BEAT, lowpass(tone(m + 12, BEAT * 0.9, { attack: 0.03, release: 0.15 }), 3000), 0.05)); // 휘파람
}
for (const f of TL.wipes) add(f2s(f), sum(noise(0.35, 4, 0.9), glide(70, 82, 0.35, { kind: "saw", decay: 6 })), 0.06);
for (const f of TL.hits) add(f2s(f), marimba(96, 0.6), 0.1);
// 생수병 쌓이는 통통 소리 (CalcScene: 600+60 ~ 600+170 사이 18병, 600+200 ~ 600+280 사이 24병)
for (let i = 0; i < 18; i++) add(f2s(660 + (110 / 18) * i), marimba(72 + (i % 5) * 2, 0.15), 0.05);
for (let i = 0; i < 24; i++) add(f2s(800 + (80 / 24) * i), marimba(79 + (i % 5) * 2, 0.12), 0.04);
writeWav("stockpile", mix, { drive: 1.6, level: 0.4 });
