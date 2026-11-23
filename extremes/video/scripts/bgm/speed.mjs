// LIMIT ① 속도 (롱폼) — 코드로 지은 배경음악. 낮은 패드로 시작 → 파커부터 박동이 점점 빨라짐 → 벽(wall)에서 뚝 끊김 → 빛(light)에서 넓게 열림 → 끝은 가라앉는다.
// 사용: node scripts/bgm/speed.mjs → content/speed/music/speed.wav
import { readFileSync } from "node:fs";
import { RATE, writeWav } from "./_synth.mjs";
import { hat, pad, softKick, space, bass } from "./_music.mjs";

const here = (p) => new URL(`../../../content/speed/${p}`, import.meta.url);
const D = JSON.parse(readFileSync(here("script/shots.json"), "utf8"));
const T = JSON.parse(readFileSync(here("script/timings.json"), "utf8"));
const LEAD = 0.5, GAP = 0.45, TAIL = 0.9;
let at = 0;
const S = {};
for (const s of D.scenes) {
  let o = LEAD;
  for (const id of s.lines) o += T[id] + GAP;
  const dur = o - GAP + TAIL;
  S[s.id] = { from: at, dur };
  at += dur;
}
const SEC = at + 2;
const mix = new Float32Array(Math.round(SEC * RATE));
const add = (t, buf, g) => { const s = Math.round(t * RATE); for (let i = 0; i < buf.length && s + i < mix.length; i++) if (s + i >= 0) mix[s + i] += buf[i] * g; };

// 코드: Am – F – C – G, 12초씩
const CH = [[45, [57, 60, 64, 67]], [41, [53, 57, 60, 65]], [48, [55, 60, 64, 67]], [43, [55, 59, 62, 67]]];
const wallAt = S.wall.from, lightAt = S.light.from;
for (let t = 0, i = 0; t < SEC; t += 12, i++) {
  const [b, notes] = CH[i % 4];
  const swell = t >= lightAt ? 1.5 : 1;
  const quiet = t >= wallAt - 12 && t < wallAt + 6 ? 0.55 : 1; // 벽 앞에서 한 번 가라앉는다
  add(t, pad(notes, 13.5, 0.6), 0.06 * swell * quiet);
  add(t, bass(b, 11), 0.1 * quiet);
}
// 박동: parker 시작에서 0.9초 간격 → wall 직전 0.28초 간격으로 빨라진다
const start = S.parker.from, stop = wallAt + 0.5;
for (let t = start; t < stop; ) {
  const k = (t - start) / (stop - start);
  const gap = 0.9 * Math.pow(0.28 / 0.9, k);
  add(t, softKick(), 0.1 + 0.12 * k);
  if (k > 0.35) add(t + gap / 2, hat(), 0.03 + 0.03 * k);
  t += gap;
}
// 벽: 쿵 한 번 뒤 정적 (박동 없음). 빛: 펼쳐지는 코드 + 가벼운 박
add(wallAt + 0.3, softKick(), 0.4);
for (let t = lightAt; t < S.ladder.from; t += 1.6) add(t, softKick(), 0.12);

space(mix, 0.35);
writeWav("speed", mix, { drive: 1.0, level: 0.55, fadeSec: 3 });
