// Gemini 원본 그림 → 영상용 그림.
//   캐릭터·컷인·소품: 초록(또는 마젠타) 배경 제거 → 여백 자르기 → 크기 맞춤 → 투명 webp
//   배경·장면: 16:9 로 맞춰 자르기 → webp
// 결과는 public/art/ 와 src/assets.json(영상이 읽는 목록)에 쓴다. 바뀐 파일만 다시 처리한다.
// 사용: node scripts/art.mjs            (전부)
//       node scripts/art.mjs ep01       (공통 + 1편, 빠진 그림 목록 출력)
//       node scripts/art.mjs --force    (전부 다시)
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { VIDEO, assetKey, common, findRaw, listEpisodes, loadEpisode, rawRel } from "./art-lib.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));

// 긴 변 기준 최대 크기 (1920x1080 화면에서 확대해도 버티는 정도)
const MAX = { char: 1500, cutin: 1300, prop: 1200, talk: 1500, layer: 2200 };
const FRAME = { w: 2560, h: 1440 };

const KEYS = { green: [0, 255, 0], magenta: [255, 0, 255] };

// 테두리 픽셀로 배경색을 판별한다. 단색이 아니면 null
const detectKey = (px, w, h) => {
  const votes = { green: 0, magenta: 0, other: 0 };
  const vote = (x, y) => {
    const i = (y * w + x) * 4;
    const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
    if (g > 150 && g - Math.max(r, b) > 70) votes.green++;
    else if (r > 150 && b > 150 && Math.min(r, b) - g > 70) votes.magenta++;
    else votes.other++;
  };
  for (let x = 0; x < w; x += 4) (vote(x, 0), vote(x, h - 1));
  for (let y = 0; y < h; y += 4) (vote(0, y), vote(w - 1, y));
  const total = votes.green + votes.magenta + votes.other;
  if (votes.green / total > 0.6) return "green";
  if (votes.magenta / total > 0.6) return "magenta";
  return null;
};

// 0(배경색 아님) ~ 255(완전히 배경색)
const keyness = (key, r, g, b) =>
  key === "green" ? g - Math.max(r, b) : Math.min(r, b) - g;

const cutout = async (file, kind) => {
  const { data: px, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const warnings = [];
  const key = detectKey(px, w, h);
  if (!key) {
    warnings.push("테두리가 초록/마젠타 단색이 아니라 배경을 못 지웠다 → 다시 뽑기");
    return { image: sharp(px, { raw: { width: w, height: h, channels: 4 } }), warnings };
  }

  // 1) 테두리와 이어진 배경은 넉넉하게, 막힌 곳(팔 사이)은 거의 순수한 배경색만 지운다
  const LOOSE = 45;
  const STRICT = 150;
  const gone = new Uint8Array(w * h);
  const k = (p) => keyness(key, px[p * 4], px[p * 4 + 1], px[p * 4 + 2]);
  const stack = [];
  const push = (p) => {
    if (!gone[p] && k(p) > LOOSE) {
      gone[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x++) (push(x), push((h - 1) * w + x));
  for (let y = 0; y < h; y++) (push(y * w), push(y * w + w - 1));
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }
  for (let p = 0; p < w * h; p++) if (!gone[p] && k(p) > STRICT) gone[p] = 1;

  // 2) 오른쪽 아래 구석에 따로 떠 있는 작은 덩어리(Gemini ✦)를 지운다
  const seen = new Uint8Array(w * h);
  for (let y = Math.floor(h * 0.82); y < h; y++) {
    for (let x = Math.floor(w * 0.82); x < w; x++) {
      const start = y * w + x;
      if (gone[start] || seen[start]) continue;
      const blob = [start];
      seen[start] = 1;
      let inCorner = true;
      for (let n = 0; n < blob.length && blob.length < 20000; n++) {
        const p = blob[n];
        const bx = p % w;
        const by = (p - bx) / w;
        if (bx < w * 0.8 || by < h * 0.8) inCorner = false;
        for (const q of [p - 1, p + 1, p - w, p + w]) {
          if (q < 0 || q >= w * h || gone[q] || seen[q]) continue;
          if (Math.abs((q % w) - bx) > 1) continue;
          seen[q] = 1;
          blob.push(q);
        }
      }
      if (inCorner && blob.length < 20000) for (const p of blob) gone[p] = 1;
    }
  }

  // 3) 투명 처리 + 가장자리의 배경색 번짐 제거
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      const i = p * 4;
      if (gone[p]) {
        px[i + 3] = 0;
        continue;
      }
      let edge = false;
      for (let dy = -2; dy <= 2 && !edge; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || gone[ny * w + nx]) {
            edge = true;
            break;
          }
        }
      }
      if (edge) {
        const spill = k(p);
        if (spill > 0) {
          if (key === "green") px[i + 1] = Math.max(px[i], px[i + 2]);
          else px[i] = px[i + 2] = px[i + 1];
          px[i + 3] = Math.round(255 * (1 - Math.min(1, spill / 120)));
        }
      }
      if (px[i + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) {
    warnings.push("배경을 지우니 아무것도 안 남았다");
    return { image: sharp(px, { raw: { width: w, height: h, channels: 4 } }), warnings };
  }
  if (minX <= 1 || minY <= 1 || maxX >= w - 2 || maxY >= h - 2) warnings.push("그림이 가장자리에 닿음 (잘렸을 수 있다)");
  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  if (Math.max(box.width, box.height) < MAX[kind] * 0.5) warnings.push("원본이 작아서 화면에서 흐릴 수 있다 (Upscayl 권장)");
  const image = sharp(px, { raw: { width: w, height: h, channels: 4 } })
    .extract(box)
    .resize({ width: MAX[kind], height: MAX[kind], fit: "inside", withoutEnlargement: true });
  return { image, warnings };
};

// 배경·장면에 초록이 남아 있으면(하늘을 초록으로 칠해 버린 경우) 그 자리를 하늘색으로 채운다
const frame = async (file, item) => {
  const meta = await sharp(file).metadata();
  const warnings = [];
  if (meta.width < 1600) warnings.push("원본이 작아서 화면에서 흐릴 수 있다 (Upscayl 권장)");
  const ratio = meta.width / meta.height;
  if (Math.abs(ratio - 16 / 9) > 0.12) warnings.push(`16:9 가 아니라(${ratio.toFixed(2)}) 위아래나 좌우가 잘린다`);
  // inset: 그림 둘레에 흰 테두리가 있을 때 잘라낼 비율
  const inset = item.inset ?? 0;
  const box = {
    left: Math.round(meta.width * inset),
    top: Math.round(meta.height * inset),
    width: Math.round(meta.width * (1 - inset * 2)),
    height: Math.round(meta.height * (1 - inset * 2)),
  };
  const { data: px, info } = await sharp(file).extract(box).resize(FRAME.w, FRAME.h, { fit: "cover" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // 풀밭 같은 자연스러운 초록은 건드리지 않게, 순수한 초록이 넓게 있을 때만 지운다
  let pure = 0;
  for (let i = 0; i < px.length; i += 4) if (px[i + 1] - Math.max(px[i], px[i + 2]) > 170) pure++;
  const keyed = pure / (px.length / 4) < 0.03 ? 0 : pure;
  for (let i = 0; keyed && i < px.length; i += 4) {
    const spill = px[i + 1] - Math.max(px[i], px[i + 2]);
    if (spill <= 12) continue;
    px[i + 1] = Math.max(px[i], px[i + 2]);
    px[i + 3] = Math.round(255 * (1 - Math.min(1, (spill - 12) / 80)));
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  if (!keyed) return { image: sharp(file).extract(box).resize(FRAME.w, FRAME.h, { fit: "cover" }), warnings };
  const sky = item.sky ?? "#BFE3F5";
  warnings.push(`초록 배경이 남아 있어 ${sky} 로 채웠다 (art.json 의 sky 로 색 지정, 다시 뽑는 것을 권장)`);
  const top = await sharp(px, raw).png().toBuffer();
  const image = sharp({ create: { width: info.width, height: info.height, channels: 4, background: sky } }).composite([{ input: top }]);
  return { image, warnings };
};

const manifest = {};
let processed = 0;
const missing = [];

const run = async (ep, item) => {
  const key = assetKey(ep, item.id);
  if (manifest[key]) return;
  const raw = findRaw(ep, item.id);
  if (!raw) {
    missing.push(`${item.title}  →  ${rawRel(ep, item.id)}`);
    return;
  }
  const out = join(VIDEO, "public/art", `${key}.webp`);
  if (force || !existsSync(out) || statSync(out).mtimeMs < statSync(raw).mtimeMs) {
    const flat = item.kind === "bg" || item.kind === "full" || item.kind === "stage";
    const { image, warnings } = flat ? await frame(raw, item) : await cutout(raw, item.kind);
    mkdirSync(dirname(out), { recursive: true });
    await image.webp({ quality: 90 }).toFile(out);
    processed++;
    console.log(`✔ ${key}`);
    for (const w of warnings) console.log(`   ⚠ ${w}`);
  }
  const meta = await sharp(out).metadata();
  manifest[key] = { w: meta.width, h: meta.height };
};

// manifest 는 항상 전체를 다시 쓴다 (한 편만 돌려도 다른 편 그림이 빠지지 않게)
const episodes = listEpisodes();
for (const item of common.items) await run(null, item);
const missingCommon = missing.splice(0);
const missingBy = {};
for (const ep of episodes) {
  const art = loadEpisode(ep);
  for (const item of art.items) await run(ep, item);
  const needed = new Set(art.common ?? []);
  missingBy[ep] = [
    ...missingCommon.filter((line) => [...needed].some((id) => line.endsWith(rawRel(null, id)))),
    ...missing.splice(0),
  ];
}

writeFileSync(join(VIDEO, "src/assets.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\n처리 ${processed}장 · 준비된 그림 ${Object.keys(manifest).length}장`);
for (const ep of only ? [only] : episodes) {
  const list = missingBy[ep] ?? [];
  console.log(list.length ? `\n${ep}: 아직 없는 그림 ${list.length}장 (없는 자리는 임시 그림으로 나온다)` : `\n${ep}: 그림이 전부 준비됐다`);
  for (const line of list) console.log(`  ⬜ ${line}`);
}
