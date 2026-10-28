// 코스피 사이드카 54번 쇼츠 배경음악 — 150BPM 8비트 칩튠 레이싱 (채널 첫 사용).
// 삼각파 베이스(8분 옥타브 왕복) + 사각파 리드(Em - C - D - B7 위 짧은 동기) + 노이즈 드럼 + 사각파 아르페지오.
// 경광등 전환(wipes)에 삐뽀 사이렌, 숫자가 박힐 때(hits) 동전 '띠링'.
// 사용: node scripts/bgm/sidecar.mjs → content/sidecar/music/sidecar.wav
import { glide, lowpass, noise, session, tone, writeWav } from "./_synth.mjs";

const { TL, SEC, mix, add, BEAT, f2s } = session("sidecar");
const bar = 4 * BEAT;
const CH = [
  { root: 40, arp: [64, 67, 71] }, // Em
  { root: 36, arp: [64, 67, 72] }, // C
  { root: 38, arp: [62, 66, 69] }, // D
  { root: 35, arp: [63, 66, 71] }, // B7(축약)
];
// 리드 동기: 마디마다 8분 음표 8칸 (null = 쉼)
const LEAD = [
  [76, null, 79, 76, 74, null, 71, null],
  [72, null, 76, 72, 71, null, 67, null],
  [74, null, 78, 74, 76, 78, 81, null],
  [78, null, 75, null, 71, 75, 78, null],
];
const bars = Math.ceil(SEC / bar);
for (let k = 0; k < bars; k++) {
  const t0 = k * bar, ch = CH[k % 4], intro = k < 1;
  for (let s = 0; s < 8; s++) add(t0 + s * (BEAT / 2), tone(ch.root + (s % 2 ? 12 : 0), BEAT / 2 - 0.01, { kind: "tri", release: 0.01 }), 0.45);
  for (let s = 0; s < 16; s++) add(t0 + s * (BEAT / 4), tone(ch.arp[s % 3] + 12, BEAT / 4 - 0.01, { kind: "square", duty: 0.125, decay: 18 }), 0.035);
  if (!intro) {
    const line = LEAD[k % 4];
    line.forEach((m, s) => m && add(t0 + s * (BEAT / 2), lowpass(tone(m, BEAT / 2 - 0.02, { kind: "square", duty: 0.5, release: 0.02 }), 4500), 0.07));
  }
  for (let b = 0; b < 4; b++) {
    add(t0 + b * BEAT, lowpass(noise(0.12, 40, 0.3), 900), b % 2 ? 0.2 : 0.55); // 쿵
    if (b % 2) add(t0 + b * BEAT, noise(0.14, 28, 0.85), 0.28); // 짝
    add(t0 + b * BEAT + BEAT / 2, noise(0.04, 90, 0.98), 0.12); // 칙
  }
}
// 삐뽀 사이렌: 두 음 번갈아 사각파
const siren = () => {
  const b = new Float32Array(Math.round(0.36 * 44100));
  b.set(tone(83, 0.18, { kind: "square", release: 0.02 }), 0);
  b.set(tone(78, 0.18, { kind: "square", release: 0.02 }), Math.round(0.18 * 44100));
  return b;
};
for (const f of TL.wipes) add(f2s(f) - 0.05, siren(), 0.09);
// 동전: 짧은 두 음 상승
const coin = () => { const b = new Float32Array(Math.round(0.3 * 44100)); b.set(tone(83, 0.07, { kind: "square", release: 0.005 }), 0); b.set(tone(88, 0.22, { kind: "square", decay: 9 }), Math.round(0.07 * 44100)); return b; };
for (const f of TL.hits) add(f2s(f), coin(), 0.08);
add(f2s(130 + 150), glide(64, 40, 0.5, { kind: "square", decay: 3 }), 0.08); // 프로그램 매매 정지 '뿌우'
writeWav("sidecar", mix, { drive: 1.6, level: 0.38 });
