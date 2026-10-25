// rush 테마의 장면 그림 (content/rush/<id>.json 의 art + scenes) → public/rush/<id>/<장면>.png (1080×1920)
// 사용법: node scripts/rush-art.mjs <id> --list      프롬프트만 출력 (무료)
//         node scripts/rush-art.mjs <id> --import    ~/Downloads/<id>__<장면>.png 를 가져와 9:16 으로 맞춘다 (무료, 크롬 Gemini 로 받은 그림)
//         node scripts/rush-art.mjs <id> gen [장면…] Gemini API 로 그림 생성 (유료, 요청할 때만). 이미 있는 장면은 건너뛴다 (--force 로 다시)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const [id, mode, ...rest] = process.argv.slice(2);
if (!id) throw new Error("사용법: node scripts/rush-art.mjs <id> --list | --import | gen");
const theme = JSON.parse(fs.readFileSync(path.join(ROOT, `content/rush/${id}.json`), "utf8"));
const OUT = path.join(ROOT, "public/rush", id);
const used = [...new Set(theme.shots.map((s) => s.art).filter(Boolean))];
const prompt = (art) => [theme.art.style, "", theme.art.cast, "", `SCENE: ${theme.scenes[art]}`, "", theme.art.layout].join("\n");
const fitTo = (src, dst) => sharp(src).resize(1080, 1920, { fit: "cover", position: "centre" }).png().toFile(dst);
fs.mkdirSync(OUT, { recursive: true });

if (mode === "--list") {
  for (const a of used) console.log(`===== ${a} ${fs.existsSync(path.join(OUT, `${a}.png`)) ? "(있음)" : ""} =====\n${prompt(a)}\n`);
  process.exit(0);
}

if (mode === "--import") {
  const dl = path.join(os.homedir(), "Downloads");
  for (const a of used) {
    // 같은 이름으로 여러 번 받으면 "이름 (1).png" 이 생긴다 → 가장 최근 파일을 쓴다
    const f = fs.readdirSync(dl)
      .filter((n) => (n.startsWith(`${id}__${a}.`) || n.startsWith(`${id}__${a} (`)) && /\.(png|jpe?g|webp)$/i.test(n))
      .sort((x, y) => fs.statSync(path.join(dl, y)).mtimeMs - fs.statSync(path.join(dl, x)).mtimeMs)[0];
    if (!f) continue;
    await fitTo(path.join(dl, f), path.join(OUT, `${a}.png`));
    console.log(`✔ ${a} ← ${f}`);
  }
  const missing = used.filter((a) => !fs.existsSync(path.join(OUT, `${a}.png`)));
  console.log(missing.length ? `아직 없음 ${missing.length}: ${missing.join(" ")}` : "✅ 모든 장면 그림 있음");
  process.exit(0);
}

if (mode !== "gen") throw new Error("모드: --list | --import | gen");
const ROOT_ENV = path.resolve(ROOT, "../.env");
const envValue = (name) => process.env[name] ?? (fs.existsSync(ROOT_ENV) ? fs.readFileSync(ROOT_ENV, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] : undefined);
const KEY = envValue("GEMINI_API_KEY");
if (!KEY) throw new Error("GEMINI_API_KEY 가 없다 (D:\\youtube\\.env 확인)");
const call = async (p, body) => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${p}`, {
    method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY }, body: body && JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
  return json;
};
let model = envValue("GEMINI_IMAGE_MODEL");
if (!model) {
  const { models = [] } = await call("models?pageSize=1000");
  model = models.filter((m) => /image/.test(m.name) && /gemini/.test(m.name) && m.supportedGenerationMethods?.includes("generateContent")).map((m) => m.name.replace(/^models\//, ""))[0];
  if (!model) throw new Error("이미지 모델이 없다. GEMINI_IMAGE_MODEL 을 지정한다");
}
const only = rest.filter((a) => !a.startsWith("--"));
const todo = used.filter((a) => (!only.length || only.includes(a)) && (rest.includes("--force") || !fs.existsSync(path.join(OUT, `${a}.png`))));
console.log(`모델 ${model} · 만들 그림 ${todo.length}장`);
for (const a of todo) {
  // art.ref: 캐릭터 시트 그림을 같이 보내 장면마다 같은 얼굴 · 옷이 나오게 한다
  const ref = theme.art.ref && fs.readFileSync(path.join(ROOT, theme.art.ref)).toString("base64");
  const text = ref ? `Use the attached character reference sheet: draw the EXACT same characters (faces, hair, glasses, outfits).\n\n${prompt(a)}` : prompt(a);
  const json = await call(`models/${model}:generateContent`, {
    contents: [{ parts: [...(ref ? [{ inlineData: { mimeType: "image/jpeg", data: ref } }] : []), { text }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "9:16" } },
  });
  const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!data) { console.log(`✖ ${a}: 그림 없음 ${JSON.stringify(json).slice(0, 200)}`); continue; }
  await fitTo(Buffer.from(data, "base64"), path.join(OUT, `${a}.png`));
  console.log(`✔ ${a}`);
}
