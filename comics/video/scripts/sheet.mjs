// 렌더 확인용 모아 보기: N초마다 한 장씩 뽑아 out/sheet.jpg (번들 한 번)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const id = process.argv[2] ?? "ep01";
const step = Number(process.argv[3] ?? 5);
const serveUrl = await bundle({ entryPoint: new URL("../src/index.ts", import.meta.url).pathname.slice(1) });
const comp = await selectComposition({ serveUrl, id });
mkdirSync("out/st", { recursive: true });
const frames = [];
for (let t = 1; t * 30 < comp.durationInFrames; t += step) frames.push(Math.round(t * 30));
for (const f of frames) await renderStill({ composition: comp, serveUrl, frame: f, output: `out/st/${f}.png`, scale: 0.25 });
const tiles = await Promise.all(frames.map((f) => sharp(`out/st/${f}.png`).toBuffer()));
const w = 270, h = 480, cols = 9;
await sharp({ create: { width: w * cols, height: h * Math.ceil(tiles.length / cols), channels: 3, background: "#000" } })
  .composite(tiles.map((b, i) => ({ input: b, left: (i % cols) * w, top: Math.floor(i / cols) * h })))
  .jpeg({ quality: 80 }).toFile(process.argv[4] ?? "out/sheet.jpg");
console.log(frames.length, "frames");
