// Gemini TTS로 대사별 음성을 만들고, 효과음을 합성하고, 타이밍 파일을 생성한다.
// 사용법: node scripts/tts.mjs [에피소드ID...]
// 키가 없으면 음성 없이 글자 수로 길이를 추정해 타이밍만 만든다.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const episodes = JSON.parse(fs.readFileSync(path.join(ROOT, "content/episodes.json"), "utf8"));
const TIMINGS = path.join(ROOT, "src/generated/timings.json");
// 키: 환경변수 → 저장소 루트 .env (D:\youtube\.env, 모든 프로젝트 공용)
const ROOT_ENV = path.resolve(ROOT, "../.env");
const fromRootEnv = (name) =>
  fs.existsSync(ROOT_ENV) ? fs.readFileSync(ROOT_ENV, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] : undefined;
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || fromRootEnv("GEMINI_API_KEY");
const MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
const RATE = 24000; // Gemini TTS 출력: 24kHz 16bit mono PCM

const only = process.argv.slice(2);
const timings = fs.existsSync(TIMINGS) ? JSON.parse(fs.readFileSync(TIMINGS, "utf8")) : {};

function wav(pcm, rate = RATE) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// 앞뒤 무음 제거 (Gemini 출력은 앞뒤에 여백이 붙는 경우가 많다)
function trimSilence(pcm, threshold = 500, padSamples = RATE * 0.05) {
  const n = pcm.length / 2;
  let s = 0, e = n - 1;
  while (s < n && Math.abs(pcm.readInt16LE(s * 2)) < threshold) s++;
  while (e > s && Math.abs(pcm.readInt16LE(e * 2)) < threshold) e--;
  s = Math.max(0, s - padSamples); e = Math.min(n - 1, e + padSamples);
  return pcm.subarray(Math.floor(s) * 2, (Math.floor(e) + 1) * 2);
}

async function gemini(text, voice, style) {
  const prompt = style ? `Speak in Korean. Tone: ${style}. Say only this line:\n${text}` : text;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
  };
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY }, body: JSON.stringify(body) },
    );
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
}

// ---- 저작권 걱정 없는 직접 합성 효과음 ----
function synth(name, seconds, fn) {
  const n = Math.floor(RATE * seconds);
  const pcm = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const v = Math.max(-1, Math.min(1, fn(t, t / seconds)));
    pcm.writeInt16LE(Math.round(v * 32767 * 0.8), i * 2);
  }
  const dir = path.join(ROOT, "public/sfx");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.wav`), wav(pcm));
}
const sin = (f, t) => Math.sin(2 * Math.PI * f * t);
synth("pop", 0.12, (t, p) => sin(500 + 900 * p, t) * (1 - p) ** 2);
synth("tick", 0.06, (t, p) => sin(1500, t) * (1 - p) ** 3);
synth("ding", 0.6, (t, p) => (sin(1046, t) + 0.5 * sin(1568, t)) * 0.6 * (1 - p) ** 2);
synth("boom", 0.9, (t, p) => (sin(70 - 30 * p, t) + 0.3 * (Math.random() * 2 - 1) * (1 - p) ** 6) * (1 - p) ** 1.5);
synth("crinkle", 1.2, (t, p) => (Math.random() * 2 - 1) * (Math.random() < 0.25 ? 0.9 : 0.15) * (0.6 + 0.4 * sin(7, t)));
synth("whoosh", 0.4, (t, p) => (Math.random() * 2 - 1) * Math.sin(Math.PI * p) * 0.5);

// ---- 대사 음성 ----
const estimate = (text) => 0.45 + [...text].length * 0.13;

for (const [id, ep] of Object.entries(episodes)) {
  if (only.length && !only.includes(id)) continue;
  console.log(`▶ ${id}: ${ep.title}`);
  const prev = timings[id] ?? [];
  const out = [];
  for (const [i, line] of ep.lines.entries()) {
    const say = line.say ?? line.text.replace(/\p{Extended_Pictographic}/gu, "").trim();
    const voice = ep.voices[line.who];
    const hash = crypto.createHash("md5").update([MODEL, voice, line.style, say].join("|")).digest("hex").slice(0, 10);
    const rel = `audio/${id}/${i}.wav`;
    const abs = path.join(ROOT, "public", rel);

    if (!voice) { // 효과음 줄 등
      out.push({ file: null, dur: line.dur ?? 1 });
      continue;
    }
    if (prev[i]?.hash === hash && prev[i].file && fs.existsSync(abs)) {
      out.push(prev[i]);
      continue;
    }
    if (!API_KEY) {
      out.push({ file: null, dur: +estimate(say).toFixed(2) });
      continue;
    }
    console.log(`  [${i}] ${line.who}(${voice}): ${say}`);
    const pcm = trimSilence(await gemini(say, voice, line.style));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, wav(pcm));
    out.push({ file: rel, dur: +(pcm.length / 2 / RATE).toFixed(3), hash });
  }
  timings[id] = out;
}

fs.mkdirSync(path.dirname(TIMINGS), { recursive: true });
fs.writeFileSync(TIMINGS, JSON.stringify(timings, null, 2));
console.log(API_KEY ? "✅ 음성 생성 완료" : "⚠️ GEMINI_API_KEY 없음 → 음성 없이 예상 길이로 타이밍만 생성");
