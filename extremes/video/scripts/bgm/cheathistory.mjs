// HISTORY ① 컨닝의 역사 (롱폼) — 코드로 지은 배경음악 (외부 음원 없음, 효과음 없음).
//   Am7 – Fmaj7 – Cmaj7 – G6, 76bpm. 장면 길이는 timings.json (음성 길이)에서 계산한다 → 음성을 만든 뒤 다시 돌린다.
//   흐름: 훅 = 패드 · 전자 피아노 → 과거제 · 조선 = 부드러운 박자 + 멜로디 → 문자 · 필터 장면 = 긴장(박자가 촘촘) → AI = 박자가 빠지고 넓게 → 연표 · 끝 = 가라앉는다.
// 사용: node scripts/bgm/cheathistory.mjs → content/cheathistory/music/cheathistory.wav
import { readFileSync } from "node:fs";
import { RATE, writeWav } from "./_synth.mjs";
import { bass, epiano, pad, pluck, softKick, space } from "./_music.mjs";

const here = (p) => new URL(`../../../content/cheathistory/${p}`, import.meta.url);
const D = JSON.parse(readFileSync(here("script/shots.json"), "utf8"));
const T = JSON.parse(readFileSync(here("script/timings.json"), "utf8"));
const LEAD = 0.5, GAP = 0.45, TAIL = 0.9;
let at = 0;
const S = {};
for (const s of D.scenes) {
  let o = LEAD;
  for (const id of s.lines) o += (T[id] ?? D.lines[id].en.split(/\s+/).length / 2.4) + GAP;
  const dur = o - GAP + TAIL;
  S[s.id] = { from: at, dur };
  at += dur;
}
const SEC = at + 2;
const mix = new Float32Array(Math.round(SEC * RATE));
const add = (t, buf, g) => { const s = Math.round(t * RATE); for (let i = 0; i < buf.length && s + i < mix.length; i++) if (s + i >= 0) mix[s + i] += buf[i] * g; };
const BEAT = 60 / 76, BAR = BEAT * 4;
const CHORDS = [[33, [57, 60, 64, 67]], [41, [57, 60, 64, 65]], [36, [55, 60, 64, 67]], [31, [55, 59, 62, 64]]];
const MELODY = [[[0, 76, 1], [1.5, 72, 0.5], [2, 69, 1.5]], [[0, 72, 1], [2, 76, 1], [3, 79, 1]], [[0.5, 74, 1], [2, 71, 1], [3, 74, 1]], [[0, 71, 1.5], [2, 67, 1], [3, 69, 1]]];
// v2 장면: hook bridge | keju … harvard (groove) | ai suneung (open) | back funnel (tense) | trail end (close)
const mode = (t) => {
  if (t < S.keju.from) return "intro";
  if (t >= S.trail.from) return "close";
  if (t >= S.back.from - 0.1) return "tense";
  if (t >= S.ai.from - 0.1) return "open";
  return "groove";
};
for (let bar = 0; bar * BAR < SEC - 1; bar++) {
  const t0 = bar * BAR;
  const [b, notes] = CHORDS[bar % 4];
  const m = mode(t0);
  const g = m === "close" ? 0.6 : 1;
  for (const p of [0, 2.5]) notes.forEach((n, j) => add(t0 + p * BEAT + j * 0.014, epiano(n, BEAT * 2.2, 0.8), 0.045 * g));
  add(t0, pad(notes, BAR + 0.5, 0.6), (m === "open" ? 0.06 : 0.04) * g);
  add(t0, bass(b, BEAT * 2), 0.18 * g);
  add(t0 + BEAT * 2, bass(b + 7, BEAT * 2), 0.13 * g);
  if (m === "groove" || m === "tense") {
    add(t0, softKick(), m === "tense" ? 0.2 : 0.16);
    add(t0 + BEAT * 2.5, softKick(), 0.11);
    // 하이햇(흰 잡음) 은 쓰지 않는다 — 8분음표마다 "칙 칙" 기계음으로 들린다 (2026-11-23 사용자 피드백)
    if (m === "groove") for (const [p, n, d] of MELODY[bar % 4]) add(t0 + p * BEAT, pluck(n, d * BEAT + 0.5, 0.5), 0.06);
  }
}
space(mix, 0.3);
writeWav("cheathistory", mix, { drive: 1.0, level: 0.5, fadeSec: 2 });
