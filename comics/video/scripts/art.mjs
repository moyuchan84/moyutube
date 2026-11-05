// 그림을 영상용으로 옮긴다: comics/art/<ep>/cNN.png → public/comics/<ep>/cNN.jpg (1080×1920)
// 색 판: cNN.color.png 가 있으면 채도 높은 픽셀만 남긴 투명 PNG → public/comics/<ep>/cNN.color.png
// 사용: node scripts/art.mjs ep01
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "node:fs";

const ep = process.argv[2] ?? "ep01";
const src = new URL(`../../art/${ep}/`, import.meta.url);
const dst = new URL(`../public/comics/${ep}/`, import.meta.url);
mkdirSync(dst, { recursive: true });

// Gemini 표시(우하단 반짝이)를 피하려고 아래 1.5% 와 가장자리를 살짝 잘라 1080×1920 으로 채운다.
const fit = (p) =>
  sharp(p)
    .metadata()
    .then(({ width, height }) => {
      const cw = Math.round(width * 0.97);
      const ch = Math.round(height * 0.97);
      return sharp(p).extract({ left: Math.round((width - cw) / 2), top: Math.round((height - ch) * 0.3), width: cw, height: ch }).resize(1080, 1920, { fit: "cover" });
    });

for (const f of readdirSync(src).filter((f) => /^c\d+[a-z]?\.png$/.test(f))) {
  const id = f.replace(".png", "");
  const out = new URL(`${id}.jpg`, dst);
  if (!existsSync(out) || process.argv.includes("--force")) {
    await (await fit(new URL(f, src).pathname.slice(1))).jpeg({ quality: 90 }).toFile(out.pathname.slice(1));
    console.log("img", id);
  }
  const colorSrc = new URL(`${id}.color.png`, src);
  if (existsSync(colorSrc)) {
    const { data, info } = await (await fit(colorSrc.pathname.slice(1))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      // 채도가 높은 곳만 남기고 가장자리는 부드럽게
      const a = Math.max(0, Math.min(1, (sat - 0.28) / 0.2));
      data[i + 3] = Math.round(a * 255);
    }
    await sharp(data, { raw: info }).png().toFile(new URL(`${id}.color.png`, dst).pathname.slice(1));
    console.log("color", id);
  }
}

// 필름 그레인 타일
const grain = new URL("../public/comics/grain.png", import.meta.url);
if (!existsSync(grain)) {
  const n = 512;
  const buf = Buffer.alloc(n * n * 4);
  for (let i = 0; i < n * n; i++) {
    const v = 200 + Math.floor(Math.random() * 55);
    buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 255;
  }
  await sharp(buf, { raw: { width: n, height: n, channels: 4 } }).blur(0.6).png().toFile(grain.pathname.slice(1));
  console.log("grain");
}

// 영상이 쓸 수 있는 그림 목록 (없는 컷은 자리표시로 그린다)
import { writeFileSync } from "node:fs";
const have = readdirSync(dst).filter((f) => /\.(jpg|png)$/.test(f)).map((f) => `comics/${ep}/${f}`);
writeFileSync(new URL(`../src/episodes/${ep}.assets.json`, import.meta.url), JSON.stringify(have, null, 1));
console.log("assets", have.length);
