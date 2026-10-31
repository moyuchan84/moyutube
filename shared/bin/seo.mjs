#!/usr/bin/env node
// 유튜브 제목 · 해시태그 · 태그 조사 — 모든 채널 공용 (스킬 yt-seo 가 부른다)
//
//   npm run seo -- <project> <code> "검색어" "검색어" …   (저장소 루트에서)
//   npm run seo -- "검색어" …                             편 없이 화면에만
//
// 검색어마다: 한국 상위 25개 영상의 조회수 중앙값 · 최근 60일 영상 수/중앙값 · 잘 나간 제목 5개 ·
// 그 영상들이 많이 쓴 태그 · 해시태그 · 유튜브 자동완성(연관 검색어).
// 결과는 화면에 찍고, 편을 주면 <편>/upload/upload.md 의 <!-- seo:start --> … <!-- seo:end --> 칸을 새로 쓴다.
// 키: YOUTUBE_API_KEY (저장소 루트 .env). 할당량: 검색어 하나에 약 101 (하루 10,000). 자동완성은 할당량 없음.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { envValue } from "../env.mjs";
import { PROJECTS, findUnit } from "../unit.mjs";

const args = process.argv.slice(2);
let unit = null;
if (args.length >= 2 && PROJECTS[args[0]]) {
  unit = findUnit(args[0], args[1]);
  args.splice(0, 2);
}
const queries = args.filter((a) => !a.startsWith("--"));
if (!queries.length) throw new Error('사용: npm run seo -- [project code] "검색어" …');
const key = envValue("YOUTUBE_API_KEY");
if (!key) throw new Error("YOUTUBE_API_KEY 가 없다 (저장소 루트 .env)");

const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
const RECENT = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10);
const median = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0);
const n = (x) => x.toLocaleString("en-US");

const api = async (path, params) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries({ ...params, key })) url.searchParams.set(k, v);
  const json = await (await fetch(url)).json();
  if (json.error) throw new Error(json.error.message);
  return json;
};
// 유튜브 검색창 자동완성 (공식 API 아님, 할당량 없음). 실패하면 빈 목록
const suggest = async (q) => {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=ko&gl=kr&q=${encodeURIComponent(q)}`;
    const json = JSON.parse(new TextDecoder("utf-8").decode(await (await fetch(url)).arrayBuffer()));
    return (json[1] ?? []).filter((s) => s !== q).slice(0, 8);
  } catch {
    return [];
  }
};
const count = (map, word, w = 1) => map.set(word, (map.get(word) ?? 0) + w);
const top = (map, k) => [...map].sort((a, b) => b[1] - a[1]).slice(0, k);

const results = [];
const allTags = new Map();
const allHash = new Map();
for (const q of queries) {
  const found = await api("search", { part: "snippet", q, type: "video", maxResults: 25, regionCode: "KR", relevanceLanguage: "ko" });
  const ids = found.items.map((i) => i.id.videoId).filter(Boolean);
  const stats = ids.length ? await api("videos", { part: "statistics,snippet", id: ids.join(",") }) : { items: [] };
  const rows = stats.items.map((i) => ({
    title: i.snippet.title,
    views: Number(i.statistics.viewCount ?? 0),
    date: i.snippet.publishedAt.slice(0, 10),
    tags: i.snippet.tags ?? [],
    hash: [...`${i.snippet.title} ${i.snippet.description ?? ""}`.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1]),
  }));
  const recent = rows.filter((r) => r.date >= RECENT);
  const tags = new Map();
  const hash = new Map();
  for (const r of rows) {
    const w = Math.log10(r.views + 10); // 잘 나간 영상의 태그에 무게를 더 준다
    for (const t of new Set(r.tags.map((t) => t.trim()).filter(Boolean))) (count(tags, t, w), count(allTags, t, w));
    for (const h of new Set(r.hash)) (count(hash, h, w), count(allHash, h, w));
  }
  const res = {
    q,
    median: median(rows.map((r) => r.views)),
    recent: recent.length,
    recentMedian: median(recent.map((r) => r.views)),
    best: [...rows].sort((a, b) => b.views - a.views).slice(0, 5),
    tags: top(tags, 8).map(([t]) => t),
    hash: top(hash, 6).map(([h]) => h),
    suggest: await suggest(q),
  };
  // 쓰는 곳: 최근에 많이 올라오고 잘 보는 말 = 지금 뜨거운 말 → 제목 앞, 꾸준히 큰 말 → 제목, 나머지 → 태그
  res.use =
    res.recent >= 3 && res.recentMedian >= 20000 ? "🔥 제목 앞 (지금 뜨거운 말)" : res.median >= 50000 ? "제목" : res.median >= 5000 ? "태그 · 설명" : "태그만";
  res.score = res.recentMedian * Math.min(res.recent, 10) + res.median;
  results.push(res);
  console.log(`\n## ${q} — 중앙값 ${n(res.median)} · 최근 60일 ${res.recent}개(중앙값 ${n(res.recentMedian)}) → ${res.use}`);
  for (const r of res.best) console.log(`  ${n(r.views).padStart(12)} | ${r.date} | ${r.title}`);
  if (res.tags.length) console.log(`  태그: ${res.tags.join(", ")}`);
  if (res.hash.length) console.log(`  해시태그: ${res.hash.map((h) => `#${h}`).join(" ")}`);
  if (res.suggest.length) console.log(`  자동완성: ${res.suggest.join(" · ")}`);
}

const ranked = [...results].sort((a, b) => b.score - a.score);
const hashtags = top(allHash, 12).map(([h]) => `#${h}`);
// 남의 채널 · 방송사 · 분류용 태그(source:… 같은 것)는 태그 후보에서 뺀다
const NOT_TAG = /:|^(shorts|뉴스|실시간뉴스|뉴스 실시간|sbs|kbs|mbc|jtbc|ytn|mbn|tv조선|채널a|연합뉴스|한문철|블랙박스|블박|블박영상)/i;
const tagPool = [...new Set([...ranked.map((r) => r.q), ...top(allTags, 40).map(([t]) => t).filter((t) => !NOT_TAG.test(t))])];
const tags = [];
for (const t of tagPool) if ([...tags, t].join(",").length <= 480) tags.push(t); // 유튜브 태그 한도 500자

const md = [
  `<!-- seo:start — npm run seo 가 만든 칸 (손으로 고치면 다음 실행 때 지워진다) -->`,
  `## 키워드 조사 (YouTube API, ${today})`,
  ``,
  `| 검색어 | 중앙값 | 최근 60일 | 쓰는 곳 |`,
  `|---|---|---|---|`,
  ...ranked.map((r) => `| ${r.q} | ${n(r.median)} | ${r.recent}개 (중앙값 ${n(r.recentMedian)}) | ${r.use} |`),
  ``,
  `**잘 나간 제목 (검색어마다 1위)**`,
  ...ranked.filter((r) => r.best[0]).map((r) => `- ${r.q}: ${n(r.best[0].views)} · ${r.best[0].title}`),
  ``,
  `**자동완성 (연관 검색어)**`,
  ...ranked.filter((r) => r.suggest.length).map((r) => `- ${r.q}: ${r.suggest.join(" · ")}`),
  ``,
  `**상위 영상이 많이 쓴 해시태그:** ${hashtags.join(" ") || "(없음)"}`,
  ``,
  `**태그 후보 (${tags.join(", ").length}자, 500자 안):** ${tags.join(", ")}`,
  `<!-- seo:end -->`,
].join("\n");

console.log(`\n${md}`);
if (unit) {
  const dir = join(unit.dir, "upload");
  const file = join(dir, "upload.md");
  mkdirSync(dir, { recursive: true });
  const old = existsSync(file) ? readFileSync(file, "utf8") : `# ${unit.unit.title} — 업로드 자료\n\n`;
  const block = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
  writeFileSync(file, block.test(old) ? old.replace(block, md) : old.replace(/^(# .*\n+)/, `$1${md}\n\n`));
  console.log(`\n→ ${file} 의 seo 칸을 새로 썼다`);
}
