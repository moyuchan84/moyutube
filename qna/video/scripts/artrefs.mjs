// 크롬 Gemini 에 붙일 첨부 그림을 그림마다 순서대로 1024px 사본으로 만든다 (qna/ART_GUIDE.md §4).
// 사용: npm run artrefs -- ep11          → out/refs/ep11/<번호>-<id>/1-….png, 2-….png …  (아직 없는 그림만)
//       npm run artrefs -- ep11 <id>     → 그 그림 하나만
// 파일 이름 앞 숫자가 첨부 순서다. 폴더 안 파일을 그 순서대로 전부 올린다 — 하나라도 빠지면 보내지 않는다.
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { ROOT, VIDEO, attachPlan, attachProblems, findRaw, isCommon, listEpisodes, loadEpisode } from "./art-lib.mjs";

const [ep, only] = process.argv.slice(2);
if (!ep || !listEpisodes().includes(ep)) {
  console.error(`편 코드를 적는다: npm run artrefs -- <${listEpisodes().join("|")}> [그림 id]`);
  process.exit(1);
}
const art = loadEpisode(ep);
const out = join(VIDEO, "out/refs", ep);
rmSync(out, { recursive: true, force: true });

let n = 0;
let blocked = 0;
for (const [i, item] of art.items.entries()) {
  if (only ? item.id !== only : findRaw(isCommon(item.id) ? null : ep, item.id)) continue;
  const plan = attachPlan(ep, item, art.cast ?? {}, { second: item.kind === "talk" });
  const problems = attachProblems(ep, item, art.cast ?? {});
  const folder = join(out, `${String(i + 1).padStart(2, "0")}-${item.id.replaceAll("/", "__")}`);
  mkdirSync(folder, { recursive: true });
  for (const [k, a] of plan.entries()) {
    const src = ["", ".jpg", ".jpeg", ".webp"].map((e) => join(ROOT, e ? a.path.replace(/\.png$/, e) : a.path)).find(existsSync);
    if (!src) continue;
    const name = `${k + 1}-${a.path.split("/").slice(-2).join("_")}`;
    await sharp(src).resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true }).png().toFile(join(folder, name));
  }
  n++;
  if (problems.length) blocked++;
  console.log(`${problems.length ? "⛔" : "✅"} ${item.id} — 첨부 ${plan.length}장${problems.length ? `\n   ${problems.join("\n   ")}` : ""}`);
}
console.log(`\n${n}장 준비 → ${out}${blocked ? `\n⛔ ${blocked}장은 문제를 먼저 고친다 (보내지 않는다)` : ""}`);
