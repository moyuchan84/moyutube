// 긴박한 배경음악을 코드로 합성한다 (저작권 걱정 없음).
// 드론 · 16분음표 베이스 오스티나토 · 초침 틱 · 심장박동 킥 · 단조 스탭 · 장면 전환 라이저 · 타격음.
// 장면 시점과 타격 시점은 src/market/timeline.json 에서 읽는다 → 화면 흔들림과 소리가 같은 프레임에 맞는다.
// 사용: node scripts/bgm-tension.mjs → public/bgm/tension.wav
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TL = JSON.parse(readFileSync(new URL("../src/market/timeline.json", import.meta.url), "utf8"));
const RATE = 44100;
const SEC = TL.total / TL.fps;
const LENGTH = Math.round(SEC * RATE);
const BPM = 132;
const BEAT = 60 / BPM;
const f2s = (f) => f / TL.fps; // 프레임 → 초

const mix = new Float32Array(LENGTH);
const add = (startSec, buf, gain) => {
  const s = Math.round(startSec * RATE);
  for (let i = 0; i < buf.length && s + i < LENGTH; i++) if (s + i >= 0) mix[s + i] += buf[i] * gain;
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const lowpass = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y);
  return buf;
};
const highpass = (buf) => {
  let prev = 0;
  for (let i = 0; i < buf.length; i++) { const x = buf[i]; buf[i] = x - prev; prev = x; }
  return buf;
};

// 장면별 세기 (0~1): 훅 강하게 → 원인 중간 → 실적에서 잠깐 비우고 → 기술적 분석에서 다시 쌓고 → 마무리 정리
const LEVEL = { hook: 0.9, damage: 1, causes: 0.75, earnings: 0.45, technical: 0.95, outlook: 0.7, outro: 0.2 };
const sceneAt = (t) => [...TL.scenes].reverse().find((s) => t >= f2s(s.from)) ?? TL.scenes[0];
const level = (t) => LEVEL[sceneAt(t).id];

// 1) 드론: D1 + A1, 천천히 숨 쉬듯
{
  const buf = new Float32Array(LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    const t = i / RATE;
    const breathe = 0.75 + 0.25 * Math.sin(2 * Math.PI * t / 6);
    let v = 0;
    for (const [m, g] of [[26, 1], [33, 0.6], [38, 0.35]]) {
      const f = hz(m);
      v += g * (Math.sin(2 * Math.PI * f * t) + 0.4 * (((t * f * 1.003) % 1) * 2 - 1));
    }
    buf[i] = v * breathe * (0.5 + 0.5 * level(t));
  }
  lowpass(buf, 300);
  add(0, buf, 0.22);
}

// 2) 16분음표 베이스 오스티나토 (D 단조, 마디마다 근음 이동), 세기에 따라 밝기 변화
const ROOTS = [38, 38, 34, 36, 38, 38, 33, 33]; // D D Bb C D D A A (마디 단위)
{
  const step = BEAT / 4;
  const ACC = [1, 0.5, 0.7, 0.5, 0.9, 0.5, 0.7, 0.6, 1, 0.5, 0.7, 0.5, 0.9, 0.6, 0.8, 0.7];
  for (let k = 0; k * step < SEC; k++) {
    const t = k * step;
    const lv = level(t);
    if (lv < 0.3) continue;
    const bar = Math.floor(k / 16);
    const f = hz(ROOTS[bar % ROOTS.length] - 12);
    const n = Math.round(step * 0.9 * RATE);
    const buf = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const tt = i / RATE;
      const saw = ((tt * f) % 1) * 2 - 1;
      buf[i] = (saw * 0.6 + Math.sin(2 * Math.PI * f * tt)) * Math.exp(-tt * 18) * Math.min(1, i / 40);
    }
    lowpass(buf, 400 + lv * 1400);
    add(t, buf, 0.32 * ACC[k % 16] * lv);
  }
}

// 3) 초침 틱: 8분음표, 기술적 분석 장면에선 16분음표
{
  const tick = (bright) => {
    const n = Math.round(0.03 * RATE);
    const b = new Float32Array(n);
    for (let i = 0; i < n; i++) b[i] = (Math.random() * 2 - 1) * Math.exp((-i / RATE) * 260);
    highpass(b);
    if (bright) highpass(b);
    return b;
  };
  for (let k = 0; k * (BEAT / 4) < SEC; k++) {
    const t = k * (BEAT / 4);
    const sc = sceneAt(t).id;
    const dense = sc === "technical" || sc === "damage";
    if (!dense && k % 2) continue;
    if (level(t) < 0.3) continue;
    add(t, tick(k % 4 === 0), (k % 4 === 0 ? 0.5 : 0.28) * level(t));
  }
}

// 4) 심장박동 킥 (쿵-쿵, 박자 1·1.25)
{
  const kick = () => {
    const n = Math.round(0.4 * RATE);
    const b = new Float32Array(n);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      ph += (2 * Math.PI * (42 + 90 * Math.exp(-t * 35))) / RATE;
      b[i] = Math.sin(ph) * Math.exp(-t * 8);
    }
    return b;
  };
  for (let beat = 0; beat * BEAT < SEC; beat += 2) {
    const t = beat * BEAT;
    const sc = sceneAt(t).id;
    if (sc === "hook" && t < 1.3) continue;
    if (sc === "outro") continue;
    const lv = level(t);
    add(t, kick(), 0.75 * lv);
    add(t + BEAT * 0.3, kick(), 0.45 * lv);
  }
}

// 5) 단조 스탭: 마디 첫 박에 낮은 화음 (긴장감)
const CHORD = { 38: [50, 53, 57], 34: [46, 50, 53], 36: [48, 52, 55], 33: [45, 49, 52] };
{
  for (let bar = 0; bar * 4 * BEAT < SEC; bar++) {
    const t = bar * 4 * BEAT;
    const lv = level(t);
    if (lv < 0.6) continue;
    const notes = CHORD[ROOTS[bar % ROOTS.length]];
    const n = Math.round(1.2 * RATE);
    const b = new Float32Array(n);
    for (const m of notes) for (const d of [-0.1, 0.1]) {
      const f = hz(m + d);
      for (let i = 0; i < n; i++) b[i] += (((i / RATE) * f) % 1) * 2 - 1;
    }
    for (let i = 0; i < n; i++) b[i] *= Math.exp((-i / RATE) * 3) * Math.min(1, i / 300) / 6;
    lowpass(b, 1600);
    add(t, b, 0.35 * lv);
  }
}

// 6) 라이저: 장면 전환 1.6초 전부터 차오르는 소음 + 상승음
for (const f of TL.risers) {
  const end = f2s(f);
  const dur = 1.6;
  const n = Math.round(dur * RATE);
  const b = new Float32Array(n);
  let y = 0, ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    const a = 1 - Math.exp((-2 * Math.PI * (300 + p * p * 7000)) / RATE);
    y += a * ((Math.random() * 2 - 1) - y);
    ph += (2 * Math.PI * (200 + p * p * 900)) / RATE;
    b[i] = (y * 0.8 + Math.sin(ph) * 0.25) * p * p;
  }
  add(end - dur, b, 0.38);
}

// 7) 타격음: 서브 쿵 + 소음 터짐 + 짧은 잔향
for (const f of TL.hits) {
  const t0 = f2s(f);
  const n = Math.round(1.6 * RATE);
  const b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    ph += (2 * Math.PI * (38 + 70 * Math.exp(-t * 14))) / RATE;
    b[i] = Math.sin(ph) * Math.exp(-t * 3.2) + (Math.random() * 2 - 1) * Math.exp(-t * 22) * 0.6;
  }
  // 잔향: 지연선 세 개
  for (const [d, g] of [[0.071, 0.35], [0.113, 0.28], [0.167, 0.22]]) {
    const off = Math.round(d * RATE);
    for (let i = n - 1; i >= off; i--) b[i] += b[i - off] * g;
  }
  lowpass(b, 5000);
  add(t0, b, f === TL.hits[0] ? 0.9 : 0.6);
}

// 끝 1.5초 페이드아웃
const fade = Math.round(1.5 * RATE);
for (let i = 0; i < fade; i++) mix[LENGTH - 1 - i] *= i / fade;

// 정규화 + 소프트 클립
const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const data = Buffer.alloc(LENGTH * 2);
for (let i = 0; i < LENGTH; i++) data.writeInt16LE(Math.round(Math.tanh((mix[i] / peak) * 1.4) * 0.85 * 32767), i * 2);
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
const outDir = new URL("../public/bgm/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("tension.wav", outDir), Buffer.concat([header, data]));
console.log(`public/bgm/tension.wav (${SEC.toFixed(1)}초, ${BPM}BPM, 타격 ${TL.hits.length}회, 라이저 ${TL.risers.length}회)`);
