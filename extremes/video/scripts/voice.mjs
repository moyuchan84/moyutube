// 롱폼 내레이션 생성: node scripts/voice.mjs <편> [--dry] [--only L3,L4]
//   content/<편>/script/shots.json 의 lines 를 Gemini TTS(영어)로 읽어 content/<편>/voice/<Lx>.wav 와 script/timings.json(초)을 만든다.
//   --dry 는 API 를 부르지 않고 글자 수로 길이만 추정한다. (유료 호출 — 사용자가 "음성 넣어서"라고 요청했을 때만 돌린다)
//   키: 환경변수 → 저장소 루트 .env (GEMINI_API_KEY, 한도에 걸리면 GEMINI_API_KEY2)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const args = process.argv.slice(2);
const code = args.find((a, i) => !a.startsWith("--") && !a.startsWith("L") && args[i - 1] !== "--model" && args[i - 1] !== "--only");
const dry = args.includes("--dry");
const onlyAt = args.indexOf("--only");
const only = onlyAt >= 0 ? args[onlyAt + 1].split(",") : null;
const dir = path.join(ROOT, "content", code);
const data = JSON.parse(fs.readFileSync(path.join(dir, "script", "shots.json"), "utf8"));
const outDir = path.join(dir, "voice");
fs.mkdirSync(outDir, { recursive: true });
const tFile = path.join(dir, "script", "timings.json");
const timings = fs.existsSync(tFile) ? JSON.parse(fs.readFileSync(tFile, "utf8")) : {};

const envFile = path.resolve(ROOT, "../.env");
const fromEnv = (n) => process.env[n] || (fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").match(new RegExp(`^\\s*${n}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] : undefined);
const KEYS = [fromEnv("GEMINI_API_KEY"), fromEnv("GEMINI_API_KEY2")].filter(Boolean);
const modelAt = args.indexOf("--model"); // --model gemini-3.8-flash-tts : 한 편은 한 모델로만 (음색 일정)
const MODELS = modelAt >= 0 ? [args[modelAt + 1]] : ["gemini-2.5-flash-preview-tts", "gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"];
const RATE = 24000;
const STYLE = "Read as a calm, curious science documentary narrator. Clear, unhurried, warm. Pause naturally at sentence ends. Say only this text:";

const wav = (pcm) => {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
};
const trim = (pcm, th = 400, pad = RATE * 0.06) => {
  const n = pcm.length / 2;
  let s = 0, e = n - 1;
  while (s < n && Math.abs(pcm.readInt16LE(s * 2)) < th) s++;
  while (e > s && Math.abs(pcm.readInt16LE(e * 2)) < th) e--;
  return pcm.subarray(Math.max(0, Math.floor(s - pad)) * 2, Math.min(n, Math.floor(e + pad) + 1) * 2);
};

async function tts(text) {
  const body0 = (model) => ({ contents: [{ parts: [{ text: model.startsWith("gemini-3.8") ? text : `${STYLE}\n${text}` }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: data.voice.name } } } } });
  let lastErr = "";
  for (const model of MODELS) {
    for (const key of KEYS) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body0(model)) });
        if (res.status === 429) { lastErr = `429 ${model}`; break; } // 다음 키 · 모델로
        if (res.status >= 500) { await new Promise((r) => setTimeout(r, 8000 * (attempt + 1))); lastErr = `${res.status}`; continue; }
        const j = await res.json();
        const b64 = j?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
        if (b64) { let buf = Buffer.from(b64, "base64"); if (buf.toString("ascii", 0, 4) === "RIFF") buf = buf.subarray(44); return buf; } // 3.8 계열은 wav(24kHz) 로 준다 → 헤더 제거
        // (3.8 계열은 앞에 지시문을 붙이면 읽는 속도가 두 배로 늘어진다 → 지시문 없이 보낸다)
        lastErr = JSON.stringify(j).slice(0, 200);
      }
    }
  }
  throw new Error("TTS 실패: " + lastErr);
}

const ids = Object.keys(data.lines).filter((id) => !only || only.includes(id));
if (!dry && !KEYS.length) throw new Error("GEMINI_API_KEY 가 없다 (루트 .env)");
for (const id of ids) {
  const text = data.lines[id].en;
  if (dry) { timings[id] = +(text.split(/\s+/).length / 2.5).toFixed(2); console.log(id, "추정", timings[id], "초"); continue; }
  const f = path.join(outDir, `${id}.wav`);
  if (fs.existsSync(f) && !only) { const n = (fs.statSync(f).size - 44) / 2 / RATE; timings[id] = +n.toFixed(2); console.log(id, "있음", timings[id]); continue; }
  let raw;
  for (let tries = 0; ; tries++) { try { raw = await tts(text); break; } catch (e) { if (tries >= 40) throw e; console.log(id, "한도 — 30초 대기"); await new Promise((r) => setTimeout(r, 30000)); } }
  const pcm = trim(raw);
  fs.writeFileSync(f, wav(pcm));
  timings[id] = +(pcm.length / 2 / RATE).toFixed(2);
  console.log(id, timings[id], "초");
}
fs.writeFileSync(tFile, JSON.stringify(timings, null, 2));
const total = Object.values(timings).reduce((a, b) => a + b, 0);
console.log(`합계 ${total.toFixed(1)}초 (${(total / 60).toFixed(1)}분) — 장면 사이 여백 별도`);
