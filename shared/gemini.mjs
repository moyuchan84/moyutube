// Gemini API (음성 TTS · 그림) — 모든 프로젝트 공용. **돈이 든다.**
//
// 안전장치: 기본은 연습(dry) 모드다. 요청 내용만 출력하고 아무것도 부르지 않는다.
// 실제로 부르려면 명령에 --yes 를 붙이거나 MOYU_PAID=1 을 준다. 사용자가 "API 로 만들어 줘" 라고 할 때만 그렇게 한다.
//
//   import { tts, image, paidAllowed } from "@moyu/shared/gemini";
//   const wav = await tts("안녕하세요", { voice: "Leda" });           // → WAV Buffer (dry 면 null)
//   const png = await image(prompt, { attach: ["art/anchor/x.png"], root, aspect: "16:9" });
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { NO_KEY, geminiKeys } from "./env.mjs";
import { pcmToWav } from "./wav.mjs";

const API = "https://generativelanguage.googleapis.com/v1beta";
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

export const paidAllowed = () => process.argv.includes("--yes") || process.env.MOYU_PAID === "1";

let keys = null;
let keyIndex = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 재시도 · 키 전환: 429(일일 한도) → 예비 키, 429/5xx → 잠깐 쉬고 다시
export const call = async (path, body, { tries = 6, wait = 45 } = {}) => {
  keys ??= geminiKeys();
  if (!keys.length) throw new Error(NO_KEY);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/${path}`, {
      method: body ? "POST" : "GET",
      headers: { "x-goog-api-key": keys[keyIndex % keys.length], "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if (res.status === 429 && /PerDay/i.test(text) && keyIndex + 1 < keys.length) {
      console.log("  일일 한도 — 예비 키(GEMINI_API_KEY2)로 넘어간다");
      keyIndex++;
      continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < tries) {
      console.log(`  ${res.status} — ${wait}초 뒤 다시 (${attempt}/${tries - 1})`);
      await sleep(wait * 1000);
      continue;
    }
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 400)}`);
  }
};

// 쓸 수 있는 모델 중 고르기: 환경변수 → 계정 목록에서 (lite → flash → 새 버전 순)
const pickModel = async (envName, test) => {
  if (process.env[envName]) return process.env[envName];
  const { models = [] } = await call("models?pageSize=1000");
  const version = (name) => Number(name.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const found = models
    .filter((m) => test(m.name) && m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .sort((a, b) => /lite/.test(b) - /lite/.test(a) || /flash/.test(b) - /flash/.test(a) || version(b) - version(a));
  if (!found.length) throw new Error(`이 키로 쓸 수 있는 모델이 없다. 환경변수 ${envName} 에 모델 이름을 적는다`);
  return found[0];
};

const dry = (what, detail) => {
  console.log(`[연습] ${what} — 부르지 않았다. 실제로 하려면 --yes (유료)\n${detail}`);
  return null;
};

// 음성. text 에는 **대사 글자만** 넣는다 — 말투 설명("Say in a … voice:")을 넣으면 그 설명까지 소리 내 읽는다.
// 말투는 목소리 이름으로 고른다. 돌려주는 것: WAV Buffer (24kHz mono)
export const tts = async (text, { voice, model } = {}) => {
  if (!voice) throw new Error("tts: voice(목소리 이름)가 필요하다");
  if (!paidAllowed()) return dry(`TTS ${voice}`, `  "${text}"`);
  const m = model ?? (await pickModel("GEMINI_TTS_MODEL", (n) => /tts/.test(n)));
  const json = await call(`models/${m}:generateContent`, {
    contents: [{ parts: [{ text }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
  });
  const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error(`오디오가 없는 응답: ${JSON.stringify(json).slice(0, 300)}`);
  return pcmToWav(Buffer.from(data, "base64"), 24000, 1);
};

// 그림. attach 는 root 기준 경로 목록(순서 그대로 첨부) — 하나라도 없으면 만들지 않는다.
// 돌려주는 것: { data: Buffer, ext: ".png" } (dry 면 null)
export const image = async (prompt, { attach = [], root = ".", aspect, model } = {}) => {
  const files = attach.map((rel) => {
    const base = join(root, rel).replace(/\.png$/, "");
    const ext = Object.keys(MIME).find((e) => existsSync(base + e));
    if (!ext) throw new Error(`첨부 그림이 없다: ${rel} — 그 그림부터 만든다 (글자만으로 보내지 않는다)`);
    return base + ext;
  });
  if (!paidAllowed()) return dry(`그림 (첨부 ${files.length}장${aspect ? ` · ${aspect}` : ""})`, `${attach.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}\n  ${prompt.slice(0, 200)}…`);
  const m = model ?? (await pickModel("GEMINI_IMAGE_MODEL", (n) => /image/.test(n) && /gemini/.test(n)));
  const parts = files.map((f) => ({ inlineData: { mimeType: MIME[extname(f)], data: readFileSync(f).toString("base64") } }));
  const json = await call(`models/${m}:generateContent`, {
    contents: [{ parts: [...parts, { text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"], ...(aspect ? { imageConfig: { aspectRatio: aspect } } : {}) },
  });
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`그림이 없는 응답: ${JSON.stringify(json).slice(0, 300)}`);
  const ext = Object.entries(MIME).find(([, mime]) => mime === part.inlineData.mimeType)?.[0] ?? ".png";
  return { data: Buffer.from(part.inlineData.data, "base64"), ext };
};
