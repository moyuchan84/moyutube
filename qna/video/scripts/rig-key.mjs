// rig 그림(content/_common/art/rig/*.png, 초록 배경)을 자르지 않고 투명 배경으로 바꿔 높이 1500 으로 줄인다.
// 얼굴만 바꾼 그림들이 같은 자리에 있어야 머리를 바꿔 끼울 수 있으므로 art.mjs 처럼 가장자리를 잘라 내지 않는다.
//   node scripts/rig-key.mjs   →   public/rig-src/<id>.png
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "../content/_common/art/rig";
const OUT = "public/rig-src";
const H = 1500;
fs.mkdirSync(OUT, { recursive: true });

const key = (r, g, b) => g - Math.max(r, b); // 클수록 초록

for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const out = path.join(OUT, f);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(path.join(SRC, f)).mtimeMs) continue;
  const { data: px, info } = await sharp(path.join(SRC, f)).resize({ height: H }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const k = (p) => key(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]);
  // 테두리와 이어진 초록은 넉넉하게, 막힌 곳(팔 사이)은 거의 순수한 초록만
  const gone = new Uint8Array(w * h);
  const stack = [];
  const push = (p) => { if (!gone[p] && k(p) > 45) { gone[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) (push(x), push((h - 1) * w + x));
  for (let y = 0; y < h; y++) (push(y * w), push(y * w + w - 1));
  while (stack.length) {
    const p = stack.pop(), x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }
  for (let p = 0; p < w * h; p++) if (!gone[p] && k(p) > 150) gone[p] = 1;
  // 오른쪽 아래 Gemini ✦ 표시
  for (let y = Math.floor(h * 0.9); y < h; y++) for (let x = Math.floor(w * 0.88); x < w; x++) gone[y * w + x] = 1;
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (gone[p]) { px[i + 3] = 0; continue; }
    const s = k(p);
    if (s > 0) { px[i + 1] = Math.max(px[i], px[i + 2]); px[i + 3] = Math.round(255 * (1 - Math.min(1, s / 120))); }
  }
  await sharp(px, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out);
  console.log("✔", f, w, h);
}
