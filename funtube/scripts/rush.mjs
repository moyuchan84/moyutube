// "N분 요약"(rush) 테마 준비: 대사 타이밍 · 입모양 음량 곡선 · 박자에 맞춘 배경음악 · 추가 효과음을 만든다.
// 사용법: node scripts/rush.mjs <테마id>        → API 호출 없이 예상 길이로 타이밍 + 배경음악 + 효과음만 (무료)
//         node scripts/rush.mjs <테마id> gen    → say 가 있는 컷만 Gemini TTS 로 음성 생성 (유료, 요청할 때만)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const id = process.argv[2];
if (!id) throw new Error("사용법: node scripts/rush.mjs <테마id> [gen]");
const theme = JSON.parse(fs.readFileSync(path.join(ROOT, `content/rush/${id}.json`), "utf8"));
const OUT = path.join(ROOT, "src/generated/rush.json");
const GEN = process.argv[3] === "gen";
const FPS = 30;
const RATE = 24000; // Gemini TTS 출력: 24kHz 16bit mono PCM

// 키: 환경변수 → 저장소 루트 .env (D:\youtube\.env, 모든 프로젝트 공용)
const ROOT_ENV = path.resolve(ROOT, "../.env");
const fromRootEnv = (name) =>
  fs.existsSync(ROOT_ENV) ? fs.readFileSync(ROOT_ENV, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] : undefined;
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || fromRootEnv("GEMINI_API_KEY");
const MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";

const wav = (pcm, rate = RATE, ch = 1) => {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(ch, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2 * ch, 28); h.writeUInt16LE(2 * ch, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
};
const trimSilence = (pcm, threshold = 500, pad = RATE * 0.03) => {
  const n = pcm.length / 2;
  let s = 0, e = n - 1;
  while (s < n && Math.abs(pcm.readInt16LE(s * 2)) < threshold) s++;
  while (e > s && Math.abs(pcm.readInt16LE(e * 2)) < threshold) e--;
  s = Math.max(0, s - pad); e = Math.min(n - 1, e + pad);
  return pcm.subarray(Math.floor(s) * 2, (Math.floor(e) + 1) * 2);
};
const envelope = (pcm) => {
  const win = Math.floor(RATE / FPS);
  const n = Math.ceil(pcm.length / 2 / win);
  const rms = [];
  for (let f = 0; f < n; f++) {
    let sum = 0, cnt = 0;
    for (let i = f * win; i < (f + 1) * win && i < pcm.length / 2; i++) { const v = pcm.readInt16LE(i * 2) / 32768; sum += v * v; cnt++; }
    rms.push(Math.sqrt(sum / Math.max(1, cnt)));
  }
  const peak = Math.max(...rms, 1e-6);
  return rms.map((v) => +Math.min(1, (v / peak) ** 0.7).toFixed(2));
};
const gemini = async (text) => {
  const body = {
    contents: [{ parts: [{ text: `Speak in Korean. Tone: ${theme.style}. Say only this line:\n${text}` }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: theme.voice } } } },
  };
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY }, body: JSON.stringify(body),
    });
    if (res.status === 429 || res.status >= 500) {
      const wait = 15 * (attempt + 1);
      console.log(`  ${res.status} → ${wait}초 후 재시도`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(`Gemini TTS ${res.status}: ${JSON.stringify(json.error ?? json)}`);
    const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
    if (!data) throw new Error(`오디오가 없는 응답: ${JSON.stringify(json).slice(0, 300)}`);
    return Buffer.from(data, "base64");
  }
  throw new Error("재시도 초과");
};

// ---- 효과음 (없는 것만 합성: API 없음 · 저작권 걱정 없음) ----
const sin = (f, t) => Math.sin(2 * Math.PI * f * t);
const noise = () => Math.random() * 2 - 1;
const sfx = (name, seconds, fn) => {
  const file = path.join(ROOT, "public/sfx", `${name}.wav`);
  if (fs.existsSync(file)) return;
  const n = Math.floor(RATE * seconds);
  const pcm = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, fn(i / RATE, i / n))) * 32767 * 0.8), i * 2);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, wav(pcm));
  console.log(`🔊 sfx/${name}.wav`);
};
sfx("vboom", 1.0, (t, p) => Math.tanh(3 * sin(110 * (1 - 0.75 * p), t)) * (1 - p) ** 1.6 + noise() * 0.25 * (1 - p) ** 12); // 쿵
sfx("scratch", 0.55, (t, p) => (((t * (900 - 700 * Math.sin(Math.PI * p) + 400 * p)) % 1) * 2 - 1) * 0.45 * (1 - p) + noise() * 0.12); // 레코드 긁는 소리
sfx("riser", 1.2, (t, p) => (noise() * 0.35 + sin(200 + 1800 * p * p, t) * 0.5) * p ** 1.3 * (1 - p ** 12)); // 점점 올라가는 소리
sfx("bang", 0.6, (t, p) => (noise() * (1 - p) ** 6 * 0.9 + Math.tanh(4 * sin(70 * (1 - 0.5 * p), t)) * (1 - p) ** 3 * 0.8)); // 탕
sfx("shutter", 0.2, (t) => (t < 0.03 || (t > 0.1 && t < 0.13) ? noise() * (1 - ((t % 0.1) / 0.03)) : 0));

// ---- 대사 (say 가 있는 컷만) ----
const estimate = (text) => 0.3 + [...text.replace(/\s/g, "")].length * 0.17;
const all = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const prev = all[id]?.lines ?? [];
if (GEN && !API_KEY) throw new Error("GEMINI_API_KEY 가 없다 (D:\\youtube\\.env 확인)");
const lines = [];
for (const [i, s] of theme.shots.entries()) {
  if (!s.say) { lines.push(null); continue; }
  const hash = crypto.createHash("md5").update([MODEL, theme.voice, theme.style, s.say].join("|")).digest("hex").slice(0, 10);
  const rel = `audio/${id}/${i}.wav`;
  const abs = path.join(ROOT, "public", rel);
  if (prev[i]?.hash === hash && prev[i].file && fs.existsSync(abs)) { lines.push(prev[i]); continue; }
  if (!GEN) { lines.push({ file: null, dur: +estimate(s.say).toFixed(2), env: null }); continue; }
  console.log(`  [${i}] ${s.say}`);
  const pcm = trimSilence(await gemini(s.say));
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, wav(pcm));
  lines.push({ file: rel, dur: +(pcm.length / 2 / RATE).toFixed(3), env: envelope(pcm), hash });
}
all[id] = { lines };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(all));
console.log(GEN ? "✅ 음성 생성 완료" : "⚠️ 대사는 예상 길이로 타이밍만 생성 (음성 없음). 음성은 `node scripts/rush.mjs " + id + " gen`");

// ---- 배경음악: 테마 BPM 에 맞춘 비트 (컷이 박자에 떨어진다) ----
const SR = 44100, BPM = theme.bpm, BEAT = 60 / BPM;
const totalBeats = theme.shots.reduce((a, s) => a + s.b, 0) + 24; // 대사 때문에 늘어날 여유
const buf = new Float32Array(Math.ceil(totalBeats * BEAT * SR));
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const tone = (t0, dur, fn, g) => {
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) buf[i0 + i] += fn(i / SR, i / n) * g;
};
const kick = (t) => tone(t, 0.24, (x, p) => Math.sin(2 * Math.PI * (46 + 100 * (1 - p) ** 4) * x) * (1 - p) ** 1.4, 0.95);
const snare = (t) => { tone(t, 0.16, (x, p) => rnd() * (1 - p) ** 2.5, 0.4); tone(t, 0.1, (x, p) => Math.sin(2 * Math.PI * 190 * x) * (1 - p) ** 2, 0.3); };
const hat = (t, open) => tone(t, open ? 0.12 : 0.035, (x, p) => rnd() * (1 - p) ** 2, open ? 0.13 : 0.09);
const bass = (t, m, d) => tone(t, d, (x, p) => Math.tanh(2.2 * Math.sin(2 * Math.PI * hz(m) * x)) * Math.min(1, x * 80) * (1 - p) ** 0.6, 0.4);
const pluck = (t, m) => tone(t, 0.18, (x) => (Math.sin(2 * Math.PI * hz(m) * x) + 0.4 * Math.sin(4 * Math.PI * hz(m) * x)) * Math.exp(-x / 0.06), 0.2);
const CHORDS = [[45, [57, 60, 64]], [41, [53, 57, 60]], [48, [60, 64, 67]], [43, [55, 59, 62]]]; // Am F C G
for (let bar = 0; bar < totalBeats / 4; bar++) {
  const [root, notes] = CHORDS[bar % 4];
  const t0 = bar * BEAT * 4;
  for (let b = 0; b < 4; b++) {
    const t = t0 + b * BEAT;
    if (b % 2 === 0 || (bar % 4 === 3 && b === 3)) kick(t);
    if (b % 2 === 1) snare(t);
    hat(t + BEAT / 2, true);
    hat(t + BEAT / 4, false);
    if (bar % 2 === 1) hat(t + (BEAT * 3) / 4, false);
  }
  for (let s = 0; s < 8; s++) bass(t0 + s * (BEAT / 2), root + (s % 4 === 3 ? 12 : 0), BEAT / 2.3);
  for (let s = 0; s < 16; s++) if (s % 3 !== 2 && bar >= 2) pluck(t0 + s * (BEAT / 4), notes[s % 3] + 12);
}
const out = Buffer.alloc(buf.length * 2);
const fade = SR * 0.4;
for (let i = 0; i < buf.length; i++) {
  const edge = Math.min(1, (buf.length - i) / fade);
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i] * 0.7 * edge)) * 32767), i * 2);
}
fs.mkdirSync(path.join(ROOT, "public/bgm"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public/bgm", `${id}.wav`), wav(out, SR));
console.log(`🎵 public/bgm/${id}.wav (${theme.bpm} BPM)`);
