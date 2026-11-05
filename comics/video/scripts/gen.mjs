// Gemini API 로 컷 그림 · 색 판을 만든다 (돈이 든다 — 사용자가 요청할 때만).
// 키: 저장소 루트 .env 의 GEMINI_API_KEY → GEMINI_API_KEY2 (shared/env.mjs). 키 값은 출력하지 않는다.
// 사용: node scripts/gen.mjs ep01            → art/ep01/jobs.json 에서 아직 없는 것만
//       node scripts/gen.mjs ep01 c09 c17    → 그 id 만 (있어도 다시)
//       --list (호출 없이 목록만) · --model=<이름> (기본 gemini-3-pro-image)
// 장면 job: {id, refs[], scene, action?} → art/<ep>/<id>.png (흑백, 9:16)
// 색 판 job: {id, edit, color} → 원본 <id>.png 를 보내 그 부분만 칠한 판 → art/<ep>/<id>.color.png
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { geminiKeys, NO_KEY } from "../../../shared/env.mjs";

const args = process.argv.slice(2);
const ep = args.find((a) => /^ep\d+$/.test(a)) ?? "ep01";
const only = args.filter((a) => /^c\d+/.test(a));
const listOnly = args.includes("--list");
const model = args.find((a) => a.startsWith("--model="))?.slice(8) ?? "gemini-3-pro-image";
const art = new URL(`../../art/`, import.meta.url);
const dir = new URL(`${ep}/`, art);
const P = JSON.parse(readFileSync(new URL("prompts.json", art), "utf8"));
const jobs = JSON.parse(readFileSync(new URL("jobs.json", dir), "utf8"));

const outOf = (j) => new URL(`${j.id}${j.edit ? ".color" : ""}.png`, dir);
const todo = jobs.filter((j) => (only.length ? only.includes(j.id) : !existsSync(outOf(j))));
const promptOf = (j) =>
  j.edit
    ? `Edit this image: keep absolutely everything identical — the same drawing, same lines, same composition, still black-and-white ink — but paint ONLY ${j.edit} in one flat solid ${j.color === "#2F6FD6" ? "blue" : "red"} (${j.color}), like a single spot color printed on a monochrome page. Nothing else in the image gets any color. Keep the 9:16 size.`
    : [P.STYLE, j.refs.length ? P.MATCH : "", j.action ? P.ACTION : P.COMP, `SHOT/SCENE: ${j.scene} Vertical 9:16 composition.`, ...j.refs.map((r) => P.CHAR[r]), P.NO].filter(Boolean).join(" ");

if (listOnly) {
  for (const j of todo) console.log(j.id + (j.edit ? " (색 판)" : ""), "-", (j.scene ?? j.edit).slice(0, 80));
  process.exit(0);
}
const keys = geminiKeys();
if (!keys.length) throw new Error(NO_KEY);
let k = 0;

const img = (path) => ({ inlineData: { mimeType: path.endsWith(".png") ? "image/png" : "image/jpeg", data: readFileSync(path).toString("base64") } });

async function call(body) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": keys[k] },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if (res.status === 429 && k < keys.length - 1 && /quota|exhaust|limit/i.test(text)) {
      k++;
      console.log(`  429 — 예비 키로 넘어간다`);
      continue;
    }
    if ((res.status === 429 && !/limit: 0|free_tier/i.test(text) || res.status >= 500) && attempt < 4) {
      console.log(`  ${res.status} — 30초 뒤 다시 (${attempt}/3)`);
      await new Promise((r) => setTimeout(r, 30000));
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }
}

console.log(`모델 ${model} · ${todo.length}장`);
for (const j of todo) {
  const parts = [];
  if (j.edit) {
    const src = new URL(`${j.id}.png`, dir);
    if (!existsSync(src)) { console.log(`- ${j.id} 색 판: 원본 없음, 건너뜀`); continue; }
    parts.push(img(src.pathname.slice(1)));
  } else {
    for (const r of j.refs) parts.push(img(new URL(`ref/${r}-sheet.jpg`, art).pathname.slice(1)));
  }
  parts.push({ text: promptOf(j) });
  const t0 = Date.now();
  try {
    const json = await call({
      contents: [{ role: "user", parts }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "9:16" } },
    });
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) { console.log(`- ${j.id}: 그림 없음 (${json.candidates?.[0]?.finishReason ?? "?"})`); continue; }
    writeFileSync(outOf(j), Buffer.from(part.inlineData.data, "base64"));
    console.log(`+ ${j.id}${j.edit ? ".color" : ""} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  } catch (e) {
    console.log(`- ${j.id}: ${e.message}`);
    if (/40[13]/.test(e.message)) break;
  }
}
