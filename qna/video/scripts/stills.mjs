// 컷별 1920x1080 PNG(자막 없음)를 한 번에 뽑는다. 다른 편집기로 옮겨 쓸 때용.
// 사용: node scripts/stills.mjs ep01
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "node:url";
import { argCode, readScript } from "./art-lib.mjs";

const episode = argCode(process.argv[2], "사용: node scripts/stills.mjs");
const compositionId = `${episode[0].toUpperCase()}${episode.slice(1)}-Cut`;
const root = new URL("../", import.meta.url);
const script = readScript(episode, "script.json");

const serveUrl = await bundle({ entryPoint: fileURLToPath(new URL("src/index.ts", root)) });

let n = 0;
for (const cut of script.cuts) {
  n++;
  const inputProps = { cutId: cut.id };
  const composition = await selectComposition({ serveUrl, id: compositionId, inputProps });
  const output = fileURLToPath(new URL(`out/${episode}/cuts/${String(n).padStart(2, "0")}-${cut.id}.png`, root));
  await renderStill({ composition, serveUrl, output, inputProps });
  console.log(output);
}
