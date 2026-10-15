// 그림 작업 목록(episodes/NN-…/jobs/images.json)을 Gemini API 로 한 번에 만든다. 아직 없는 그림만 만든다.
// 사용: node scripts/artgen.mjs ep03              (없는 그림 전부)
//       node scripts/artgen.mjs ep03 granny/yell  (그 그림만 다시)
//       node scripts/artgen.mjs ep03 --list       (만들 목록만 보기)
// 키: 저장소 루트 .env (D:\youtube\.env) 의 GEMINI_API_KEY (음성과 같은 키). 모델: 환경변수 GEMINI_IMAGE_MODEL 이 없으면 계정에서 고른다.
// 결과는 손으로 만들 때와 같은 자리에 저장되고, 그다음은 평소처럼 npm run art → npm run make.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { execSync } from "node:child_process";
import { ROOT, VIDEO, episodeDir } from "./art-lib.mjs";
import { NO_KEY, envValue } from "./env.mjs";

const args = process.argv.slice(2);
const episode = args.find((a) => /^ep\d+$/.test(a)) ?? "ep01";
const only = args.filter((a) => !a.startsWith("--") && a !== episode);
const listOnly = args.includes("--list");

// 목록은 항상 art.json 에서 새로 뽑는다
execSync(`node scripts/prompts.mjs ${episode}`, { cwd: VIDEO, stdio: "ignore" });
const { jobs } = JSON.parse(readFileSync(join(ROOT, episodeDir(episode), "jobs/images.json"), "utf8"));
const exists = (rel) => [".png", ".jpg", ".jpeg", ".webp"].some((ext) => existsSync(join(ROOT, rel.replace(/\.png$/, ext))));
const todo = jobs.filter((job) => (only.length ? only.some((id) => job.id.endsWith(id)) : !exists(job.save)));

if (listOnly || !todo.length) {
  console.log(todo.length ? todo.map((job) => `⬜ ${job.title}  →  ${job.save}`).join("\n") : `${episode}: 만들 그림이 없다`);
  process.exit(0);
}

const key = envValue("GEMINI_API_KEY") ?? envValue("GOOGLE_API_KEY");
if (!key) throw new Error(NO_KEY);

const API = "https://generativelanguage.googleapis.com/v1beta";
const call = async (path, body) => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/${path}`, {
      method: body ? "POST" : "GET",
      headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      console.log(`  ${res.status} — 45초 뒤 다시 시도 (${attempt}/4)`);
      await new Promise((r) => setTimeout(r, 45000));
      continue;
    }
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 400)}`);
  }
};

// 모델: 환경변수 또는 .env → 계정에서 쓸 수 있는 이미지 모델 중 Flash-Lite/Flash(토큰·비용 절약), 그다음 버전 순
let model = envValue("GEMINI_IMAGE_MODEL");
if (!model) {
  const { models = [] } = await call("models?pageSize=1000");
  const version = (name) => Number(name.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const image = models
    .filter((m) => /image/.test(m.name) && /gemini/.test(m.name) && m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .sort((a, b) => (/lite/.test(b) - /lite/.test(a)) || (/flash/.test(b) - /flash/.test(a)) || version(b) - version(a));
  if (!image.length) throw new Error("이 키로 쓸 수 있는 이미지 모델이 없다. 환경변수 GEMINI_IMAGE_MODEL 에 모델 이름을 적는다");
  model = image[0];
}
console.log(`모델 ${model} · 만들 그림 ${todo.length}장`);

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const inline = (rel) => {
  const base = join(ROOT, rel.replace(/\.png$/, ""));
  const ext = Object.keys(MIME).find((e) => existsSync(base + e));
  if (!ext) return null;
  return { inlineData: { mimeType: MIME[ext], data: readFileSync(base + ext).toString("base64") } };
};

let made = 0;
for (const job of todo) {
  // 기준 그림(②)이 아직 없으면 건너뛴다: 같은 사람으로 안 나온다
  const refs = job.attach.map(inline);
  if (refs.includes(null)) {
    console.log(`⏭ ${job.title} — 첨부할 그림이 아직 없다 (${job.attach[refs.indexOf(null)]}). 그 그림부터 만든다`);
    continue;
  }
  console.log(`▶ ${job.title}`);
  const body = {
    contents: [{ parts: [...refs, { text: job.prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"], ...(job.aspect ? { imageConfig: { aspectRatio: job.aspect } } : {}) },
  };
  const json = await call(`models/${model}:generateContent`, body);
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.log(`  ✖ 그림이 안 왔다: ${JSON.stringify(json).slice(0, 200)}`);
    continue;
  }
  const ext = Object.entries(MIME).find(([, mime]) => mime === part.inlineData.mimeType)?.[0] ?? ".png";
  const out = join(ROOT, job.save.replace(/\.png$/, ext));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(part.inlineData.data, "base64"));
  console.log(`  ✔ ${job.save.replace(/\.png$/, ext)}`);
  made++;
  await new Promise((r) => setTimeout(r, 4000));
}
console.log(`\n${made} / ${todo.length}장 만들었다. 눈으로 확인한 뒤 npm run art -- ${episode}`);
if (made < todo.length) console.log("건너뛴 그림이 있으면 같은 명령을 한 번 더 실행한다 (기준 그림이 생긴 뒤에 만들어진다).");
