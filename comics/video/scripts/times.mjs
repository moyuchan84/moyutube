// 샷 시작 시각 표 (트랙 타이밍 맞출 때)
import { readFileSync } from "node:fs";
const ep = process.argv[2] ?? "ep01";
const src = readFileSync(new URL(`../src/episodes/${ep}.ts`, import.meta.url), "utf8");
let t = 0;
for (const m of src.matchAll(/^\s*(?:\{\s*)?(?:img: I\("(\w+)"\), )?dur: ([\d.]+)/gm)) {
  console.log(t.toFixed(1).padStart(6), m[1] ?? "(title)", m[2]);
  t += Number(m[2]);
}
console.log("total", t.toFixed(1));
