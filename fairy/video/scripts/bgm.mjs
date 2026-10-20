// 음악 + 효과음을 코드로 합성하고(저작권 걱정 없음) 엄마 목소리와 섞어 public/audio/mix.wav 를 만든다.
// 장면마다 연출표(plan.json)의 "소리" 칸대로: 오르골 자장가 주제가 1 · 7 · 12 · 14 · 15 장면에서 돌아온다.
// 사용: node scripts/bgm.mjs (src/timeline.json 이 먼저 있어야 한다 → node scripts/timeline.mjs)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TL = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'timeline.json'), 'utf8'));
const book = path.join(here, '..', '..', 'books', '01-real-hero');
const R = 44100;
const N = Math.round((TL.total + 1) * R);
const music = new Float32Array(N); // 깔리는 음악 (목소리 밑에서 줄인다)
const sfx = new Float32Array(N); // 효과음 (그대로)

// 같은 소리가 나오도록 고정 난수
let seed = 20261020;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const put = (dst, at, buf, g = 1) => {
  const s = Math.round(at * R);
  for (let i = 0; i < buf.length; i++) {
    const k = s + i;
    if (k >= 0 && k < N) dst[k] += buf[i] * g;
  }
};
const gen = (sec, fn) => {
  const n = Math.round(sec * R), b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = fn(i / R, i, n);
  return b;
};
const lp = (b, f) => {
  const a = 1 - Math.exp((-2 * Math.PI * f) / R);
  let y = 0;
  for (let i = 0; i < b.length; i++) { y += a * (b[i] - y); b[i] = y; }
  return b;
};
const hp = (b, f) => {
  const l = lp(Float32Array.from(b), f);
  for (let i = 0; i < b.length; i++) b[i] -= l[i];
  return b;
};
const bp = (b, lo, hi) => hp(lp(b, hi), lo);

// 악기
const box = (m, d = 1.6) => gen(d, (t, i) => (Math.sin(2 * Math.PI * hz(m) * t) + 0.45 * Math.sin(2 * Math.PI * hz(m) * 2 * t) * Math.exp(-t * 5) + 0.2 * Math.sin(2 * Math.PI * hz(m) * 4.02 * t) * Math.exp(-t * 14)) * Math.exp(-t * 3.4) * Math.min(1, i / 60));
const pizz = (m) => gen(0.35, (t, i) => (Math.sin(2 * Math.PI * hz(m) * t) + 0.4 * Math.sin(2 * Math.PI * hz(m) * 2 * t)) * Math.exp(-t * 13) * Math.min(1, i / 40));
const piano = (m, d = 2.4) => gen(d, (t, i) => (Math.sin(2 * Math.PI * hz(m) * t) + 0.5 * Math.sin(2 * Math.PI * hz(m) * 2 * t) * Math.exp(-t * 2) + 0.25 * Math.sin(2 * Math.PI * hz(m) * 3 * t) * Math.exp(-t * 3)) * Math.exp(-t * 1.7) * Math.min(1, i / 120));
const pad = (m, d) => gen(d, (t, i, n) => (Math.sin(2 * Math.PI * hz(m) * t) + Math.sin(2 * Math.PI * hz(m) * 1.004 * t + 1) * 0.8 + 0.3 * Math.sin(2 * Math.PI * hz(m) * 2 * t)) * Math.min(1, t / 1.2, (n - i) / (1.4 * R)) * 0.5);
const brass = (m, d) => lp(gen(d, (t, i, n) => { const ph = (hz(m) * t) % 1; return (ph * 2 - 1) * Math.min(1, i / 400, (n - i) / (0.08 * R)) * Math.exp(-t * 1.2); }), 1800);
const bell = (m, d = 1.6) => gen(d, (t) => (Math.sin(2 * Math.PI * hz(m) * t) + 0.6 * Math.sin(2 * Math.PI * hz(m) * 2.76 * t) * Math.exp(-t * 4) + 0.3 * Math.sin(2 * Math.PI * hz(m) * 5.4 * t) * Math.exp(-t * 8)) * Math.exp(-t * 2.6));

// 주제: 오르골 자장가 (8마디, 6/8). [음높이, 길이(8분음표)]
const MEL = [[72, 2], [76, 2], [79, 2], [81, 3], [79, 3], [77, 2], [76, 2], [74, 2], [72, 6], [74, 2], [77, 2], [81, 2], [79, 3], [76, 3], [74, 2], [72, 2], [67, 2], [72, 6]];
const CHORD = [[48, [0, 4, 7]], [53, [0, 4, 7]], [55, [0, 4, 7]], [48, [0, 4, 7]], [50, [0, 3, 7]], [48, [0, 4, 7]], [55, [0, 4, 7]], [48, [0, 4, 7]]];
const THEME_LEN = 48; // 8분음표 개수
// 시작~끝 사이를 주제로 채운다. eighth = 8분음표 길이(초), inst = 음색
const theme = (a, b, { eighth = 0.36, inst = box, g = 0.5, melody = true, arp = true, bass = true, shift = 0, fade = 1.2 } = {}) => {
  const buf = new Float32Array(N);
  const loop = THEME_LEN * eighth;
  for (let base = a; base < b; base += loop) {
    if (melody) {
      let e = 0;
      for (const [m, len] of MEL) { put(buf, base + e * eighth, inst(m + shift, Math.min(2.2, len * eighth + 1)), 0.9); e += len; }
    }
    CHORD.forEach(([root, ch], bar) => {
      const t0 = base + bar * 6 * eighth;
      if (bass) put(buf, t0, pad(root + shift - 12, 6 * eighth + 0.4), 0.18);
      if (arp) [0, 2, 1, 2, 1, 2].forEach((ix, k) => put(buf, t0 + k * eighth, inst(root + 12 + ch[ix] + shift, 1.2), 0.32));
    });
  }
  for (let i = 0; i < N; i++) {
    const t = i / R;
    if (t < a || t > b) { buf[i] = 0; continue; }
    buf[i] *= Math.min(1, (t - a) / fade, (b - t) / fade);
  }
  for (let i = 0; i < N; i++) music[i] += buf[i] * g;
};

// 효과음
const noise = (d) => gen(d, () => rnd());
const swoosh = (d = 0.9) => {
  const n = noise(d), o = new Float32Array(n.length);
  let y = 0;
  for (let i = 0; i < n.length; i++) {
    const q = i / n.length, a = 1 - Math.exp((-2 * Math.PI * (500 + 4000 * Math.sin(Math.PI * q))) / R);
    y += a * (n[i] - y);
    o[i] = y * Math.sin(Math.PI * q) ** 2;
  }
  return hp(o, 400);
};
const crash = () => {
  const b = new Float32Array(Math.round(1.6 * R));
  for (let k = 0; k < 14; k++) {
    const s = Math.round((k * 0.05 + Math.abs(rnd()) * 0.04) * R);
    const f = lp(hp(gen(0.25, (t) => rnd() * Math.exp(-t * 22)), 300 + Math.abs(rnd()) * 3000), 7000);
    for (let i = 0; i < f.length && s + i < b.length; i++) b[s + i] += f[i] * (0.8 - k * 0.04);
  }
  return b;
};
const applause = (d) => {
  const n = bp(noise(d), 1500, 6000), o = new Float32Array(n.length);
  for (let i = 0; i < n.length; i++) {
    const t = i / R, env = Math.min(1, t / 0.3, (d - t) / 0.9) * (0.6 + 0.4 * Math.abs(Math.sin(t * 23) * Math.sin(t * 37)));
    o[i] = n[i] * env * (Math.abs(rnd()) > 0.6 ? 1.6 : 0.8);
  }
  return o;
};
const sparkle = () => {
  const b = new Float32Array(Math.round(2.2 * R));
  [84, 88, 91, 96, 100, 103].forEach((m, k) => { const s = Math.round(0.07 * k * R), x = bell(m, 1.4); for (let i = 0; i < x.length; i++) b[s + i] += x[i] * (0.5 - k * 0.04); });
  return b;
};
const creak = () => gen(0.9, (t, i, n) => { const f = 180 + 60 * Math.sin(t * 9) + 40 * t; return (((f * t) % 1) * 2 - 1) * Math.sin(Math.PI * i / n) * 0.35; });
const charge = (d) => gen(d, (t, i, n) => { const f = 120 + 900 * (t / d) ** 2; return (Math.sin(2 * Math.PI * f * t) * 0.6 + rnd() * 0.15) * Math.min(1, t / 0.2) * Math.min(1, (n - i) / (0.1 * R)); });
const bounce = () => gen(0.35, (t) => Math.sin(2 * Math.PI * (210 - 80 * t / 0.35) * t) * Math.exp(-t * 16));
const cricket = () => {
  const b = new Float32Array(Math.round(0.9 * R));
  for (let k = 0; k < 3; k++) { const s = Math.round(k * 0.27 * R), x = gen(0.18, (t) => Math.sin(2 * Math.PI * 4300 * t) * Math.sin(2 * Math.PI * 45 * t) ** 2 * Math.exp(-t * 6)); for (let i = 0; i < x.length; i++) b[s + i] += x[i] * 0.7; }
  return b;
};
const pencil = (d) => {
  const n = bp(noise(d), 2500, 7000);
  for (let i = 0; i < n.length; i++) { const t = i / R; n[i] *= (0.5 + 0.5 * Math.sin(t * 38)) ** 2 * Math.min(1, t / 0.05, (d - t) / 0.1); }
  return n;
};
const pop = () => gen(0.12, (t) => Math.sin(2 * Math.PI * (700 - 3000 * t) * t) * Math.exp(-t * 35));
const murmur = (d) => {
  const n = bp(noise(d), 200, 1200);
  for (let i = 0; i < n.length; i++) { const t = i / R; n[i] *= (0.5 + 0.5 * Math.sin(t * 5.1) * Math.sin(t * 2.3 + 1)) * Math.min(1, t / 1, (d - t) / 1); }
  return n;
};
const laugh = () => gen(0.7, (t, i, n) => Math.sin(2 * Math.PI * (620 + 80 * Math.sin(t * 11)) * t) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 6 * t)) * Math.sin(Math.PI * i / n) * 0.5);
const breath = () => {
  const n = bp(noise(1.1), 400, 2500);
  for (let i = 0; i < n.length; i++) n[i] *= Math.sin(Math.PI * i / n.length) ** 2;
  return n;
};
const step = () => gen(0.12, (t) => Math.sin(2 * Math.PI * 95 * t) * Math.exp(-t * 40));
const schoolBell = () => {
  const b = new Float32Array(Math.round(2.4 * R));
  for (let k = 0; k < 4; k++) { const s = Math.round(k * 0.4 * R), x = bell(88, 1.2); for (let i = 0; i < x.length; i++) b[s + i] += x[i] * 0.5; }
  return b;
};

// 장면 시각 도우미
const sc = (n) => TL.scenes[n];
const subAt = (n, key, fallback = 0) => sc(n).subs.find((s) => s.text.includes(key))?.from ?? sc(n).start + fallback;
const S = (n) => sc(n).start, E = (n) => sc(n).end;

// ── 음악 · 효과음 배치 ──────────────────────────────
theme(0.2, TL.intro + 0.8, { eighth: 0.4, g: 0.55, fade: 0.6 }); // 표지: 오르골 주제
// 0 TV 속 히어로: 합성 팡파르 + 환호, 점점 작아짐
[[67, 0], [72, 0.35], [76, 0.7], [79, 1.05]].forEach(([m, t]) => put(music, S(0) + 0.3 + t, brass(m, t === 1.05 ? 1.6 : 0.4), 0.3));
put(sfx, S(0) + 1.3, applause(3.2), 0.13);
// 1 망토 입고 자는 준이: 오르골
theme(S(1) + 0.2, E(1) + 0.5, { eighth: 0.42, g: 0.5 });
// 2 등굣길: 경쾌한 피치카토 + 슈우웅
put(sfx, subAt(2, '슈우우', 0) - 0.1, swoosh(1.1), 0.25);
theme(S(2) + 0.2, E(2) + 0.2, { eighth: 0.21, inst: pizz, g: 0.45 });
// 3 새치기: 종소리 · 슈웅 · 웅성, 어색해지면 음악 멈춤
put(sfx, S(3) + 0.3, schoolBell(), 0.35);
theme(S(3) + 2.5, subAt(3, '야, 우리') - 0.3, { eighth: 0.2, inst: pizz, g: 0.4, fade: 0.4 });
put(sfx, subAt(3, '지구를') + 3.2, swoosh(0.8), 0.22);
put(sfx, subAt(3, '야, 우리') - 1.2, murmur(4), 0.12);
// 4 보드게임: 와르르 후 정적
put(sfx, S(4) + 0.6, crash(), 0.4);
put(music, S(4) + 3, pad(45, 8), 0.06);
// 5 혼자 그네: 음악 거의 없음, 멀리 웃음 · 삐걱이는 그네
for (let t = S(5) + 1; t < E(5) - 2; t += 3.4) put(sfx, t, creak(), 0.12);
[3, 9, 15].forEach((t) => put(sfx, S(5) + t, laugh(), 0.05));
[[69, 2], [72, 6], [69, 11], [67, 14]].forEach(([m, t]) => put(music, S(5) + t, box(m, 3), 0.16));
// 6 레이저 발사?!: 충전음 뒤 정적
put(sfx, subAt(6, '내가 구해') + 0.2, charge(2.2), 0.18);
put(music, S(6) + 1, pad(52, 14), 0.07);
// 7 민지가 도착: 발소리 · 따뜻한 음악 시작
[0.3, 0.75, 1.2].forEach((t) => put(sfx, S(7) + t, step(), 0.25));
theme(S(7) + 1.5, E(7) + 0.5, { eighth: 0.4, g: 0.48 });
// 8 마치 히어로 같았어요: 박수 · 반짝
put(sfx, subAt(8, '박수') + 0.5, applause(3), 0.2);
put(sfx, subAt(8, '마치') + 0.3, sparkle(), 0.35);
theme(subAt(8, '이상했어요') - 0.5, E(8) + 0.5, { eighth: 0.44, g: 0.32, arp: false });
// 9 축 처진 망토: 잔잔한 피아노
theme(S(9) + 0.3, E(9) + 0.5, { eighth: 0.55, inst: piano, g: 0.45, shift: -12 });
// 10 몰래 관찰 공책: 사각사각 · 톡 + 가벼운 음악
theme(S(10) + 0.5, E(10) - 0.5, { eighth: 0.24, inst: pizz, g: 0.34 });
sc(10).imgs.forEach((im, k) => {
  put(sfx, im.from + 0.15, pop(), 0.4);
  if (k < 3) put(sfx, im.from + 0.9, pencil(1.2), 0.1);
});
// 11 피구: 공 튀는 소리 → 정적 → 숨 한 번
[0.5, 1.0, 1.4, 1.75, 2.0].forEach((t) => put(sfx, S(11) + t, bounce(), 0.3));
put(sfx, subAt(11, '준이는 잠깐') + 0.3, breath(), 0.12);
// 12 축하해!: 정적 뒤 반짝, 망토가 은은히 빛남
put(sfx, subAt(12, '너네') - 0.4, sparkle(), 0.3);
theme(subAt(12, '너네') + 0.8, E(12) + 0.5, { eighth: 0.42, g: 0.45 });
// 13 자리 비켜주기: 급식실 소음 + 따뜻한 음악이 올라옴
put(sfx, S(13) + 0.3, murmur(8), 0.1);
theme(S(13) + 6, E(13) + 0.5, { eighth: 0.4, g: 0.5, fade: 4 });
// 14 오늘 조금은 히어로: 오르골 + 귀뚜라미
theme(S(14) + 0.2, E(14) + 0.5, { eighth: 0.5, g: 0.42 });
for (let t = S(14) + 1; t < E(14) - 1; t += 1.7) put(sfx, t + Math.abs(rnd()) * 0.5, cricket(), 0.05);
// 15 진짜 힘은 마음 + 끝 카드: 첫 장면 오르골 선율이 돌아옴
theme(S(15) + 0.2, TL.total - 0.5, { eighth: 0.4, g: 0.52, fade: 2.5 });
put(sfx, E(15) + 0.4, sparkle(), 0.3);

// ── 목소리 올리기 + 자동 낮춤(ducking) ───────────────
const rd = fs.readFileSync(path.join(book, 'voice', 'all.wav'));
const at = rd.indexOf('data');
const vlen = rd.readUInt32LE(at + 4) / 2;
const voice = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / R - TL.intro, p = t * 24000;
  if (p < 0 || p >= vlen - 1) continue;
  const k = Math.floor(p), f = p - k;
  voice[i] = (rd.readInt16LE(at + 8 + k * 2) * (1 - f) + rd.readInt16LE(at + 8 + (k + 1) * 2) * f) / 32768;
}
// 목소리 크기를 일정하게 (말하는 구간 RMS → 0.13)
let sq = 0, cnt = 0;
for (let i = 0; i < N; i++) if (Math.abs(voice[i]) > 0.02) { sq += voice[i] ** 2; cnt++; }
const vgain = 0.13 / Math.sqrt(sq / cnt);
for (let i = 0; i < N; i++) voice[i] *= vgain;
// 말하는 동안 음악을 낮춘다
const win = Math.round(R * 0.05);
const duck = new Float32Array(N);
let env = 0;
for (let i = 0; i < N; i += win) {
  let m = 0;
  for (let j = i; j < Math.min(N, i + win); j++) m = Math.max(m, Math.abs(voice[j]));
  const target = m > 0.03 ? 1 : 0;
  env += (target - env) * (target > env ? 0.35 : 0.04); // 빨리 낮추고 천천히 올린다
  for (let j = i; j < Math.min(N, i + win); j++) duck[j] = env;
}
const mix = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) { mix[i] = voice[i] + music[i] * (1 - 0.55 * duck[i]) + sfx[i]; peak = Math.max(peak, Math.abs(mix[i])); }
const norm = peak > 0.92 ? 0.92 / peak : 1;
const out = new Int16Array(N);
for (let i = 0; i < N; i++) out[i] = Math.max(-32768, Math.min(32767, Math.round(Math.tanh(mix[i] * norm * 1.05) * 32767)));
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + out.length * 2, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(R, 24); h.writeUInt32LE(R * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(out.length * 2, 40);
fs.mkdirSync(path.join(here, '..', 'public', 'audio'), { recursive: true });
fs.writeFileSync(path.join(here, '..', 'public', 'audio', 'mix.wav'), Buffer.concat([h, Buffer.from(out.buffer)]));
console.log(`mix.wav — ${(N / R).toFixed(1)}초 · 목소리 x${vgain.toFixed(2)} · peak ${peak.toFixed(2)}`);
