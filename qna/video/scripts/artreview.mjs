// 뽑은 그림을 첨부했던 기준 그림과 나란히 놓고 보는 확인 시트 (qna/ART_GUIDE.md §5).
// 사용: npm run artreview -- ep10          → episodes/10-…/jobs/review.html
//       npm run artreview -- ep10 --todo   → 아직 확인 안 한 것만 (review.json 에 ok 로 적은 것 빼고)
// 얼굴 · 머리 · 옷 · 피부 톤 · 선 굵기가 기준 그림과 같은지 본다. 다르면 쓰지 않고 다시 뽑는다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { ROOT, attachPlan, common, episodeDir, findRaw, isCommon, listEpisodes, loadEpisode } from "./art-lib.mjs";

const ep = process.argv[2];
if (!ep || !listEpisodes().includes(ep)) {
  console.error(`편 코드를 적는다: npm run artreview -- <${listEpisodes().join("|")}>`);
  process.exit(1);
}
const todoOnly = process.argv.includes("--todo");
const art = loadEpisode(ep);
const dir = join(ROOT, episodeDir(ep), "jobs");
const reviewPath = join(dir, "review.json"); // { "<id>": "ok" | "redo: 이유" } — 사람이 적는다
const marks = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, "utf8")) : {};

const SECOND = new Set(["talk"]);
const items = [
  ...(art.common ?? []).map((id) => ({ item: common.items.find((c) => c.id === id), owner: null })),
  ...art.items.map((item) => ({ item, owner: ep })),
].filter(({ item }) => item);

const url = (abs) => encodeURI(relative(dir, abs).split("\\").join("/"));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const rows = [];
for (const { item, owner } of items) {
  const raw = findRaw(isCommon(item.id) ? null : owner, item.id);
  if (!raw) continue;
  if (todoOnly && marks[item.id] === "ok") continue;
  const plan = attachPlan(owner, item, art.cast ?? {}, { second: SECOND.has(item.kind) });
  const refs = plan
    .map((a, i) => {
      const abs = join(ROOT, a.path);
      const found = ["", ".jpg", ".jpeg", ".webp"].map((e) => (e ? abs.replace(/\.png$/, e) : abs)).find(existsSync);
      return `<figure><span>${"①②③④⑤⑥⑦⑧"[i]}</span>${found ? `<img loading="lazy" src="${url(found)}">` : "<div class=missing>없음</div>"}<figcaption>${esc(a.label)}</figcaption></figure>`;
    })
    .join("");
  const mark = marks[item.id] ?? "";
  rows.push(`<section class="${mark === "ok" ? "ok" : mark ? "redo" : ""}">
  <h2>${esc(item.title)} <code>${esc(item.id)}</code> <em>${esc(mark || "확인 전")}</em></h2>
  <div class=row><figure class=main><img loading="lazy" src="${url(raw)}"><figcaption>결과</figcaption></figure>${refs}</div>
</section>`);
}

const html = `<!doctype html><meta charset=utf-8><title>${esc(ep)} 그림 확인</title>
<style>
body{font:14px/1.5 system-ui,sans-serif;margin:16px;background:#f4f4f4;color:#222}
section{background:#fff;border-radius:8px;padding:12px;margin:0 0 16px;border-left:6px solid #bbb}
section.ok{border-color:#2a9d4b}section.redo{border-color:#d33}
h2{font-size:15px;margin:0 0 8px}h2 em{font-style:normal;font-size:12px;color:#666;margin-left:8px}
.row{display:flex;gap:10px;align-items:flex-start;overflow-x:auto}
figure{margin:0;position:relative;flex:0 0 auto}figure span{position:absolute;left:4px;top:2px;font-weight:700;color:#fff;text-shadow:0 0 3px #000}
img{height:220px;border:1px solid #ddd;border-radius:4px;background:#fff}figure.main img{height:320px}
figcaption{font-size:11px;color:#555;max-width:240px}.missing{height:220px;width:160px;display:grid;place-items:center;background:#fee;color:#a00}
</style>
<h1>${esc(art.title)} — 그림 확인 (${rows.length}장)</h1>
<p>결과(왼쪽)를 첨부한 기준 그림과 비교한다: 얼굴 · 머리 · 옷 · 피부 톤 · 선 굵기 · 과장 정도. 판정은 <code>${esc(relative(ROOT, reviewPath).split("\\").join("/"))}</code> 에 <code>"id": "ok"</code> 또는 <code>"redo: 이유"</code> 로 적는다.</p>
${rows.join("\n")}
`;
writeFileSync(join(dir, "review.html"), html);
console.log(`${relative(ROOT, join(dir, "review.html"))} — ${rows.length}장`);
