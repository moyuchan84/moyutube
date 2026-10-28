// 10월 K팝 뮤비 레이스 쇼츠 배경음악 — 128BPM 신스웨이브 (채널 첫 사용).
// 네 박 킥 + 사이드체인으로 출렁이는 톱니 패드 + 16분 아르페지오(Am - F - C - G) + 2 · 4박 클랩 + 오프비트 하이햇.
// 깃발 전환(wipes)에 엔진 '부웅' 상승음, 숫자가 박힐 때(hits) 레이저 '퓽'. 훅의 신호등 3번은 삐 · 삐 · 삐이.
// 사용: node scripts/bgm/mvrace.mjs → content/mvrace/music/mvrace.wav
import { clap, duck, glide, kick, lowpass, noise, riser, session, sum, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add, BEAT, f2s } = session("mvrace");
const bar = 4 * BEAT;
const start = f2s(105); // GO! 부터 비트 시작
const CH = [
  { root: 45, notes: [57, 60, 64, 67] }, // Am7
  { root: 41, notes: [57, 60, 65, 69] }, // Fmaj7
  { root: 48, notes: [55, 60, 64, 67] }, // C
  { root: 43, notes: [55, 59, 62, 67] }, // G
];
const pad = (notes, sec) => lowpass(sum(...notes.flatMap((m) => [tone(m, sec, { kind: "saw", attack: 0.2, release: 0.3 }), tone(m, sec, { kind: "saw", detune: 0.004, attack: 0.2, release: 0.3 })])), 1400);

// 신호등 전 대기: 낮은 드론 + 신호음
add(0, lowpass(tone(33, f2s(105), { kind: "saw", attack: 0.5 }), 300), 0.25);
for (const f of [45, 75]) add(f2s(f), tone(81, 0.18, { kind: "square", release: 0.02 }), 0.12);
add(f2s(105), tone(93, 0.5, { kind: "square", release: 0.1 }), 0.14);

const music = new Float32Array(mix.length);
const put = (t, b, g) => {
  const s = Math.round(t * 44100);
  for (let i = 0; i < b.length && s + i < music.length; i++) if (s + i >= 0) music[s + i] += b[i] * g;
};
const bars = Math.ceil((SEC - start) / bar);
for (let k = 0; k < bars; k++) {
  const t0 = start + k * bar, ch = CH[k % 4];
  put(t0, pad(ch.notes, bar + 0.3), 0.05);
  for (let s = 0; s < 8; s++) put(t0 + s * (BEAT / 2), lowpass(tone(ch.root, BEAT / 2 - 0.02, { kind: "saw", decay: 4 }), 500), 0.35);
  for (let s = 0; s < 16; s++) {
    const m = ch.notes[[0, 1, 2, 3, 2, 1, 3, 2][s % 8]] + 12;
    put(t0 + s * (BEAT / 4), lowpass(tone(m, BEAT / 4, { kind: "square", decay: 14, duty: 0.3 }), 3000), 0.05);
  }
}
duck(music, start, BEAT, 0.7);
for (let i = 0; i < music.length; i++) mix[i] += music[i];
for (let k = 0; k < bars; k++) {
  const t0 = start + k * bar;
  for (let b = 0; b < 4; b++) add(t0 + b * BEAT, kick(1.2), 0.55);
  for (const b of [1, 3]) add(t0 + b * BEAT, clap(), 0.2);
  for (let b = 0; b < 4; b++) add(t0 + b * BEAT + BEAT / 2, noise(0.12, 30, 0.97), 0.08);
}
for (const f of TL.wipes) add(f2s(f) - 0.5, sum(riser(0.6), lowpass(glide(31, 43, 0.6, { kind: "saw" }), 700)), 0.18);
for (const f of TL.hits) if (f > 105) add(f2s(f), glide(96, 72, 0.18, { kind: "square", decay: 10 }), 0.07);
writeWav("mvrace", mix, { drive: 1.6, level: 0.45 });
