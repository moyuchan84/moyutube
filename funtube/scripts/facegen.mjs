// 캐릭터 얼굴 표정 시트(6칸)를 Gemini 로 그리고, 초록 배경을 투명하게 따서 표정별 PNG 로 자른다.
// 사용법: node scripts/facegen.mjs [선배|후배 ...] [--list] [--process-only] [--force]
//   --list          : 프롬프트만 출력 (API 호출 없음, 무료)
//   --process-only  : 이미 받은 원본(art/faces/raw_<이름>.png)만 다시 자른다 (무료)
//   --force         : 원본이 있어도 다시 생성한다 (유료)
//   --placeholder   : art/faces/placeholder_<이름>.png (임시 시트)로 자르기만 한다 (무료, 파이프라인 점검용)
// 결과: art/faces/raw_<이름>.png (원본 시트) → public/faces/<이름>_1..6.png (투명 PNG)
// 키: 환경변수 → 저장소 루트 .env (D:\youtube\.env)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const faces = JSON.parse(fs.readFileSync(path.join(ROOT, "content/faces.json"), "utf8"));
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const names = args.filter((a) => !a.startsWith("--"));
const who = names.length ? names : Object.keys(faces.characters);

const ROOT_ENV = path.resolve(ROOT, "../.env");
const fromEnv = (name) =>
  process.env[name] ?? (fs.existsSync(ROOT_ENV) ? fs.readFileSync(ROOT_ENV, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] : undefined);

const promptFor = (name) =>
  [faces.style, "", faces.task, "", faces.characters[name], "", "The 6 expressions, in reading order:", ...faces.expressions, "", faces.layout].join("\n");

if (flag("--list")) {
  for (const n of who) console.log(`===== ${n} =====\n${promptFor(n)}\n`);
  process.exit(0);
}

const rawPath = (n) => path.join(ROOT, "art/faces", `${flag("--placeholder") ? "placeholder" : "raw"}_${n}.png`);

// ---------- Gemini 이미지 생성 ----------
const API = "https://generativelanguage.googleapis.com/v1beta";
const keys = [fromEnv("GEMINI_API_KEY"), fromEnv("GEMINI_API_KEY2")].filter(Boolean);
let keyIdx = 0;
const call = async (p, body) => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/${p}`, {
      method: body ? "POST" : "GET",
      headers: { "x-goog-api-key": keys[keyIdx], "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return res.json();
    const text = await res.text();
    if (res.status === 429 && keyIdx + 1 < keys.length) { keyIdx++; console.log("  429 → 예비 키로 바꿈"); continue; }
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { console.log(`  ${res.status} — 45초 뒤 재시도`); await new Promise((r) => setTimeout(r, 45000)); continue; }
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }
};

const generate = async (name) => {
  if (!keys.length) throw new Error("GEMINI_API_KEY 가 없다 (D:\\youtube\\.env)");
  let model = fromEnv("GEMINI_IMAGE_MODEL");
  if (!model) {
    const { models = [] } = await call("models?pageSize=1000");
    const version = (n) => Number(n.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
    model = models
      .filter((m) => /image/.test(m.name) && /gemini/.test(m.name) && m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""))
      .sort((a, b) => (/lite/.test(b) - /lite/.test(a)) || (/flash/.test(b) - /flash/.test(a)) || version(b) - version(a))[0];
    if (!model) throw new Error("쓸 수 있는 이미지 모델이 없다. GEMINI_IMAGE_MODEL 을 지정한다");
  }
  console.log(`▶ ${name} — 모델 ${model} (1장 생성)`);
  const json = await call(`models/${model}:generateContent`, {
    contents: [{ parts: [{ text: promptFor(name) }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "3:2" } },
  });
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`그림이 안 왔다: ${JSON.stringify(json).slice(0, 300)}`);
  fs.mkdirSync(path.dirname(rawPath(name)), { recursive: true });
  fs.writeFileSync(rawPath(name), Buffer.from(part.inlineData.data, "base64"));
  console.log(`  ✔ ${path.relative(ROOT, rawPath(name))}`);
};

// ---------- 초록 배경 제거 + 6칸 자르기 ----------
// 초록 배경에서 가장 넓게 비어 있는 틈 n 개를 칸 경계로 쓴다 (칸 배치가 조금 달라도 견딘다)
const separators = (occupied, n, size) => {
  const runs = [];
  let start = -1;
  for (let i = 0; i <= occupied.length; i++) {
    const empty = i < occupied.length && !occupied[i];
    if (empty && start < 0) start = i;
    if (!empty && start >= 0) {
      if (start > 0 && i < occupied.length) runs.push({ mid: (start + i) / 2, len: i - start });
      start = -1;
    }
  }
  const picked = runs.sort((a, b) => b.len - a.len).slice(0, n).map((r) => r.mid).sort((a, b) => a - b);
  if (picked.length === n) return picked;
  console.log(`  ⚠ 칸 경계를 ${picked.length}/${n}개만 찾아 균등 분할로 대신한다`);
  return Array.from({ length: n }, (_, i) => ((i + 1) * size) / (n + 1));
};

const processSheet = async (name) => {
  if (!fs.existsSync(rawPath(name))) throw new Error(`${rawPath(name)} 가 없다. 먼저 생성한다`);
  const { data, info } = await sharp(rawPath(name)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  // 초록 키잉: 초록이 R/B 보다 많이 높을수록 배경
  const rgba = Buffer.from(data);
  for (let i = 0; i < W * H; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
    const d = g - Math.max(r, b);
    const a = d > 90 ? 0 : d < 30 ? 255 : Math.round(((90 - d) / 60) * 255);
    if (a < 255) rgba[i * 4 + 1] = Math.min(g, Math.max(r, b)); // 테두리에 남은 초록 빛 제거
    rgba[i * 4 + 3] = a;
  }
  // Gemini 가 오른쪽 아래 모서리에 넣는 작은 별 로고 지우기
  for (let y = Math.floor(H * 0.9); y < H; y++) for (let x = Math.floor(W * 0.93); x < W; x++) rgba[(y * W + x) * 4 + 3] = 0;
  const colOcc = new Array(W).fill(false);
  const rowOcc = new Array(H).fill(false);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rgba[(y * W + x) * 4 + 3] > 40) { colOcc[x] = true; rowOcc[y] = true; }
  const xs = [0, ...separators(colOcc, 2, W), W].map(Math.round);
  const ys = [0, ...separators(rowOcc, 1, H), H].map(Math.round);
  const outDir = path.join(ROOT, "public/faces");
  fs.mkdirSync(outDir, { recursive: true });
  let n = 1;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
        .extract({ left: xs[c], top: ys[r], width: xs[c + 1] - xs[c], height: ys[r + 1] - ys[r] })
        .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      fs.writeFileSync(path.join(outDir, `${name}_${n}.png`), cell);
      n++;
    }
  }
  console.log(`  ✔ public/faces/${name}_1..6.png  (원본 ${W}×${H}, 칸 경계 x=${xs.slice(1, 3)} y=${ys[1]})`);
};

for (const name of who) {
  if (!faces.characters[name]) { console.log(`모르는 캐릭터: ${name}`); continue; }
  if (!flag("--process-only") && !flag("--placeholder") && (flag("--force") || !fs.existsSync(rawPath(name)))) await generate(name);
  else console.log(`▶ ${name} — 원본 시트를 다시 자르기만 한다 (API 호출 없음)`);
  await processSheet(name);
}
