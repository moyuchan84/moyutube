// anime 엔진 테마의 배경음악 · 효과음을 코드로 합성한다 (API 없음 · 음원 저작권 걱정 없음).
// 컷마다 적힌 음악 큐(m)를 따라 간다: hit 오케스트라 히트 · tense 긴장 리듬 · epic 최고조 · stop 정적(개그 멈춤)
//   build 상승 · calm 잔잔 · comic 반짝이는 장조 · end 마지막 한 방. 없으면 tense.
// 사용법: node scripts/anime-bgm.mjs <테마id>   → public/bgm/<id>.wav, 없는 효과음은 public/sfx/ 에
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const id = process.argv[2];
if (!id) throw new Error("사용법: node scripts/anime-bgm.mjs <테마id>");
const theme = JSON.parse(fs.readFileSync(path.join(ROOT, `content/rush/${id}.json`), "utf8"));
const SR = 44100, FPS = 30;
const BEAT = 60 / theme.bpm;

const wav = (f32, gain = 1) => {
  const pcm = Buffer.alloc(f32.length * 2);
  for (let i = 0; i < f32.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, f32[i] * gain)) * 32767), i * 2);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
};

let seed = 11;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));

// 버퍼에 소리 하나를 더한다. fn(t, p) 는 -1..1, p 는 0→1 진행
const mk = (seconds) => new Float32Array(Math.ceil(seconds * SR));
const add = (buf, t0, dur, fn, g = 1) => {
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) if (i0 + i >= 0) buf[i0 + i] += fn(i / SR, i / n) * g;
};
// 한 극 저역통과 (톱니파를 현악기처럼 둥글게)
const lp = (fn, cut) => { let y = 0; const a = 1 - Math.exp((-2 * Math.PI * cut) / SR); return (t, p) => (y += a * (fn(t, p) - y)); };

// ── 악기 ──
const taiko = (b, t, g = 1) => add(b, t, 0.7, lp((x, p) => Math.sin(2 * Math.PI * (52 + 90 * (1 - p) ** 6) * x) * (1 - p) ** 2.2 + noise() * 0.5 * (1 - p) ** 30, 900), g);
const crash = (b, t, g = 0.35) => add(b, t, 1.8, (x, p) => noise() * (1 - p) ** 3 * (0.6 + 0.4 * Math.sin(x * 9000)), g);
const strings = (b, t, dur, notes, g = 0.12, attack = 0.25) =>
  notes.forEach((m) => [-0.08, 0.08].forEach((det) => add(b, t, dur, lp((x, p) => saw(hz(m + det) * x) * Math.min(1, x / attack) * Math.min(1, (1 - p) * dur / 0.25), 1800), g)));
const stab = (b, t, notes, g = 0.2) => notes.forEach((m) => add(b, t, 0.16, lp((x, p) => saw(hz(m) * x) * (1 - p) ** 1.5, 2600), g));
const bass = (b, t, dur, m, g = 0.32) => add(b, t, dur, (x, p) => (Math.sin(2 * Math.PI * hz(m) * x) + 0.3 * saw(hz(m) * x)) * Math.min(1, x * 60) * (1 - p) ** 0.5, g);
const bell = (b, t, m, g = 0.18) => add(b, t, 1.2, (x) => (Math.sin(2 * Math.PI * hz(m) * x) + 0.35 * Math.sin(2 * Math.PI * hz(m) * 2.76 * x)) * Math.exp(-x / 0.35), g);
const riser = (b, t, dur, g = 0.3) => add(b, t, dur, (x, p) => (noise() * 0.5 + Math.sin(2 * Math.PI * (180 + 1400 * p * p) * x) * 0.5) * p ** 1.6, g);
const snare = (b, t, g = 0.25) => add(b, t, 0.18, (x, p) => (noise() * 0.8 + Math.sin(2 * Math.PI * 200 * x) * 0.4) * (1 - p) ** 3, g);
// 오케스트라 히트: 넓게 쌓은 단조 화음 + 북 + 심벌
const orchHit = (b, t, root, g = 1) => {
  [root - 12, root - 5, root, root + 3, root + 7, root + 12, root + 15].forEach((m) => [-0.1, 0.1].forEach((d) => add(b, t, 1.1, lp((x, p) => saw(hz(m + d) * x) * (1 - p) ** 2.4, 3200), 0.07 * g)));
  taiko(b, t, 1.1 * g); taiko(b, t + 0.01, 0.6 * g); crash(b, t, 0.3 * g);
};

// ── 컷 타이밍 (src/rush/timeline.ts 의 buildRush 와 같은 계산, 대사 없음) ──
let beat = 0;
const cues = theme.shots.map((s) => { const c = { t: beat * BEAT, d: s.b * BEAT, m: s.m ?? "tense", b: s.b }; beat += s.b; return c; });
const total = beat * BEAT + 2.5;
const music = mk(total);

// 단조 진행 (Dm Bb C A) — 마디는 곡 전체 기준으로 센다
const PROG = [[50, [62, 65, 69]], [46, [58, 62, 65]], [48, [60, 64, 67]], [45, [57, 61, 64]]];
const chordAt = (t) => PROG[Math.floor(t / (BEAT * 4)) % 4];
const PULSE = [0, 0, 12, 0, 3, 0, 12, 7]; // 16분 스타카토 무늬 (근음 기준 반음)

cues.forEach((c, i) => {
  const next = cues[i + 1];
  const end = c.t + c.d;
  if (c.m === "stop") return; // 정적: 음악을 뚝 끊는다 (효과음만 남는다)
  if (c.m === "hit" || c.m === "epic" || c.m === "end") orchHit(music, c.t, chordAt(c.t)[0] + 12, c.m === "end" ? 1.3 : 1);
  if (c.m === "end") { strings(music, c.t, 2.4, [50, 57, 62, 65], 0.08, 0.02); return; }
  if (c.m === "calm") {
    strings(music, c.t, c.d, [58, 62, 65, 69], 0.07, 0.4); // Bbmaj7 잔잔하게
    for (let k = 0; k < c.b * 2; k++) bell(music, c.t + k * BEAT / 2, [77, 81, 74, 79][k % 4], 0.07);
    return;
  }
  if (c.m === "comic") {
    strings(music, c.t, c.d + 0.3, [62, 66, 69, 74], 0.08, 0.05); // D장조로 전환 — 으스대는 반짝임
    for (let k = 0; k < c.b * 4; k++) bell(music, c.t + k * BEAT / 4, [74, 78, 81, 86][k % 4], 0.11);
    taiko(music, c.t, 0.6);
    return;
  }
  // tense · epic · hit · build: 16분 스타카토 + 베이스 + 북
  for (let tt = c.t; tt < end - 1e-6; tt += BEAT / 4) {
    const [root, notes] = chordAt(tt);
    const k = Math.round((tt - c.t) / (BEAT / 4));
    stab(music, tt, [root + 12 + PULSE[k % 8]], c.m === "epic" ? 0.2 : 0.14);
    if (k % 4 === 0) { bass(music, tt, BEAT * 0.9, root - 12); if (k % 8 === 0 || c.m === "epic") taiko(music, tt, c.m === "epic" ? 0.8 : 0.5); }
    if (k % 16 === 0) strings(music, tt, Math.min(BEAT * 4, end - tt), c.m === "epic" ? [...notes, notes[0] + 12, notes[2] + 12] : notes, c.m === "epic" ? 0.07 : 0.05);
  }
  if (c.m === "build") {
    riser(music, c.t, c.d, 0.32);
    for (let k = 0; k < 12; k++) snare(music, c.t + c.d * (1 - 0.85 ** k), 0.12 + k * 0.02); // 점점 빨라지는 스네어
  }
  // 다음 컷이 정적이면 마지막 박을 비워 긴장을 끊는다
  if (next?.m === "stop") add(music, end - 0.05, 0.05, () => 0);
});

// 간단한 잔향 (지연 세 갈래)
const out = new Float32Array(music.length);
for (let i = 0; i < music.length; i++) {
  let v = music[i];
  for (const [dl, g] of [[0.083, 0.22], [0.127, 0.17], [0.211, 0.12]]) { const j = i - Math.floor(dl * SR); if (j >= 0) v += out[j] * g; }
  out[i] = v;
}
const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 1e-6);
fs.mkdirSync(path.join(ROOT, "public/bgm"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public/bgm", `${id}.wav`), wav(out, 0.92 / peak));
console.log(`🎵 public/bgm/${id}.wav  ${total.toFixed(1)}초 · 큐 ${cues.map((c) => c.m).join(" ")}`);

// ── 효과음 (없는 것만) ──
const sfx = (name, seconds, fill) => {
  const file = path.join(ROOT, "public/sfx", `${name}.wav`);
  if (fs.existsSync(file)) return;
  const b = mk(seconds);
  fill(b);
  const pk = b.reduce((m, v) => Math.max(m, Math.abs(v)), 1e-6);
  fs.writeFileSync(file, wav(b, 0.85 / pk));
  console.log(`🔊 sfx/${name}.wav`);
};
// 칼날 "슈잉": 금속성 고음 + 바람
sfx("slash", 0.6, (b) => { add(b, 0, 0.6, (x, p) => (Math.sin(2 * Math.PI * 4200 * x) * 0.5 + Math.sin(2 * Math.PI * 6100 * x) * 0.3) * Math.exp(-x / 0.12), 1); add(b, 0, 0.25, lp((x, p) => noise() * Math.sin(Math.PI * p), 5000), 0.8); });
// 타격: 깊은 쿵 + 터지는 잡음
sfx("impact", 1.2, (b) => { taiko(b, 0, 1.4); add(b, 0, 1.2, lp((x, p) => noise() * (1 - p) ** 5, 2200), 0.7); add(b, 0, 0.9, (x, p) => Math.tanh(4 * Math.sin(2 * Math.PI * (40 + 60 * (1 - p) ** 3) * x)) * (1 - p) ** 2, 0.8); });
// 도장: 둔탁한 쿵 + 종이
sfx("stamp", 0.7, (b) => { add(b, 0, 0.5, (x, p) => Math.sin(2 * Math.PI * (90 + 60 * (1 - p) ** 4) * x) * (1 - p) ** 3, 1); add(b, 0, 0.12, (x, p) => noise() * (1 - p) ** 2, 0.5); });
// 글리치: 잘게 끊기는 디지털 잡음
sfx("glitchfx", 0.4, (b) => add(b, 0, 0.4, (x, p) => (Math.floor(x * 60) % 2 ? saw(x * (300 + 900 * ((Math.floor(x * 60) * 7) % 5) / 5)) : noise() * 0.6) * (1 - p), 1));
