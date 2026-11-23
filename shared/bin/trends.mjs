#!/usr/bin/env node
// 주간 이슈 · 소재 후보 뽑기 — Extremes 처럼 "저작권 없는 사진 · 영상 + 코드 그래픽" 으로 만드는 채널용.
//
//   npm run trends                      최근 7일, 미국, 기본 씨앗 주제
//   npm run trends -- --days 14 --region KR --lang ko
//   npm run trends -- --seeds "volcano,meteor shower,deep sea"     (씨앗 주제를 직접 지정)
//   npm run trends -- --top 6 --no-write                            (파일로 남기지 않고 화면만)
//
// 하는 일
//  1) 씨앗 주제마다 YouTube 검색(쇼츠 · 조회수순 · 최근 N일)으로 지금 뜨는 영상을 가져온다.
//  2) 영상마다 "구독자 대비 조회수" 를 계산한다 — 큰 채널이라서가 아니라 소재가 먹혀서 뜬 영상을 찾으려는 것.
//  3) 사람 · 정치 · 전쟁 · 사고 · 연예 소재는 ⚠ 로 표시하고 후보에서 뺀다 (채널 규칙: 얼굴 · 피해자 · 연예인 금지).
//  4) 씨앗 주제마다 Wikimedia Commons · NASA 에 쓸 만한 사진이 얼마나 있는지 센다 → 화면을 구할 수 있는 소재만 남긴다.
//  5) 결과를 화면에 찍고 extremes/docs/trends/YYYY-MM-DD.md 로 남긴다.
//
// 쿼터: 검색 1회 = 100 단위. 기본 씨앗 12개 ≈ 1,300 단위 (하루 한도 10,000). 키는 저장소 루트 .env 의 YOUTUBE_API_KEY.
// 사진은 받지 않는다. 받기 전 확인은 출력에 나오는 `npm run collect -- <편코드> "…" --dry` 를 쓴다.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO, envValue } from "../env.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return fallback;
  return args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
};
const days = Number(flag("days", 7));
const region = String(flag("region", "US"));
const lang = String(flag("lang", "en"));
const top = Number(flag("top", 5));
const write = !args.includes("--no-write");

const DEFAULT_SEEDS = [
  "NASA mission", "meteor shower", "solar eclipse", "asteroid", "volcano eruption", "earthquake map",
  "deep sea discovery", "new species discovered", "glacier melting", "record temperature",
  "size comparison", "largest in the world",
];
const seeds = flag("seeds", null) ? String(flag("seeds")).split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_SEEDS;

// 이 말이 제목에 들어 있으면 우리 채널이 못 하는 소재다 (사람 · 정치 · 전쟁 · 사고 · 연예 · 선정).
const RISK = /\b(dies|died|death|dead|killed|murder|arrest|trial|court|lawsuit|president|election|trump|biden|war|attack|shooting|crash|victim|celebrity|actor|actress|singer|rapper|kardashian|taylor swift|trailer|nsfw|nude|leak|gta|rockstar|rdr2|minecraft|roblox|fortnite|marvel|pokemon|lego|disney|nintendo)\b/i;

const key = envValue("YOUTUBE_API_KEY");
if (!key) throw new Error("YOUTUBE_API_KEY 가 없다. 저장소 루트 .env 에 YOUTUBE_API_KEY=... 로 적는다.");
let units = 0;
const yt = async (path, params, cost) => {
  units += cost;
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries({ ...params, key })) url.searchParams.set(k, v);
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(`YouTube API: ${data.error.message}`);
  return data;
};
const UA = { "User-Agent": "ExtremesTrends/0.1 (topic research)" };
const getJson = async (url) => {
  try {
    const res = await fetch(url, { headers: UA });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

// 씨앗 주제에 쓸 사진이 있는지: Commons 파일 · NASA 이미지 검색 결과 수 (라이선스는 collect 가 따로 거른다)
const assetCount = async (q) => {
  const e = encodeURIComponent(q);
  const [commons, nasa] = await Promise.all([
    getJson(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${e}&srnamespace=6&srlimit=1&format=json&origin=*`),
    getJson(`https://images-api.nasa.gov/search?q=${e}&media_type=image&page_size=1`),
  ]);
  return {
    commons: commons?.query?.searchinfo?.totalhits ?? 0,
    nasa: nasa?.collection?.metadata?.total_hits ?? 0,
  };
};

const seconds = (iso) => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return Infinity; // 예정 · 라이브 영상은 길이가 "P0D" 로 온다 → 쇼츠가 아니니 걸러진다
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
};
const fmt = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K` : String(n));

const after = new Date(Date.now() - days * 864e5).toISOString();
const results = [];

for (const seed of seeds) {
  let search;
  try {
    search = await yt("search", {
      part: "snippet", type: "video", videoDuration: "short", order: "viewCount", maxResults: 25,
      relevanceLanguage: lang, regionCode: region, publishedAfter: after, q: seed,
    }, 100);
  } catch (e) {
    console.error(`[${seed}] ${e.message}`);
    if (/quota/i.test(e.message)) break;
    continue;
  }
  const ids = (search.items ?? []).map((i) => i.id.videoId).filter(Boolean);
  if (!ids.length) { results.push({ seed, videos: [], assets: await assetCount(seed) }); continue; }
  const vids = (await yt("videos", { part: "snippet,statistics,contentDetails", id: ids.join(",") }, 1)).items ?? [];
  const chIds = [...new Set(vids.map((v) => v.snippet.channelId))];
  const subs = {};
  for (let i = 0; i < chIds.length; i += 50) {
    for (const c of (await yt("channels", { part: "statistics", id: chIds.slice(i, i + 50).join(",") }, 1)).items ?? []) {
      subs[c.id] = c.statistics.hiddenSubscriberCount ? null : Number(c.statistics.subscriberCount);
    }
  }
  const videos = vids
    .filter((v) => seconds(v.contentDetails.duration) <= 60)
    .map((v) => {
      const views = Number(v.statistics.viewCount ?? 0);
      const ageDays = Math.max((Date.now() - new Date(v.snippet.publishedAt)) / 864e5, 0.5);
      const s = subs[v.snippet.channelId];
      return {
        id: v.id, title: v.snippet.title, channel: v.snippet.channelTitle, views, subs: s, sec: seconds(v.contentDetails.duration),
        ageDays: Math.round(ageDays), perDay: Math.round(views / ageDays),
        ratio: s ? views / Math.max(s, 500) : null, // 구독자 대비 조회수 (500 미만 채널은 500 으로 본다)
        risk: RISK.test(v.snippet.title) || RISK.test(v.snippet.channelTitle),
      };
    })
    .sort((a, b) => b.perDay - a.perDay);
  results.push({ seed, videos, assets: await assetCount(seed) });
  console.error(`✓ ${seed} (${videos.length}편)`);
}

// ── 출력 ──
const lines = [];
const out = (s = "") => { lines.push(s); console.log(s); };
const today = new Date().toISOString().slice(0, 10);
out(`# 주간 소재 후보 — ${today}`);
out(`> 최근 ${days}일 · ${region} · 언어 ${lang} · 쇼츠(60초 이하) · 조회수/일 순. 쿼터 약 ${units} 단위 사용.`);
out(`> ⚠ = 사람 · 정치 · 전쟁 · 사고 · 연예 소재(이 채널은 못 함). 사진 칸은 Commons · NASA 에 검색 결과가 얼마나 있는지(라이선스는 collect --dry 로 따로 확인).`);
out();

out(`## 1. 씨앗 주제별 — 화면을 구하기 쉬운 순`);
out();
out(`| 씨앗 주제 | Commons | NASA | 후보 영상 | 상위 조회수/일 | 작은 채널 돌파 |`);
out(`|---|---:|---:|---:|---:|---:|`);
const summary = results.map((r) => {
  const ok = r.videos.filter((v) => !v.risk);
  const breakout = ok.filter((v) => v.subs !== null && v.subs <= 50000 && v.views >= 50000);
  return { ...r, ok, breakout };
}).sort((a, b) => (b.assets.commons + b.assets.nasa) - (a.assets.commons + a.assets.nasa));
for (const r of summary) {
  out(`| ${r.seed} | ${fmt(r.assets.commons)} | ${fmt(r.assets.nasa)} | ${r.ok.length}/${r.videos.length} | ${r.ok[0] ? fmt(r.ok[0].perDay) : "-"} | ${r.breakout.length} |`);
}
out();

out(`## 2. 작은 채널(구독 5만 이하)인데 조회 5만 이상 — 소재가 먹혔다는 신호`);
out();
const breakouts = summary.flatMap((r) => r.breakout.map((v) => ({ ...v, seed: r.seed }))).sort((a, b) => b.ratio - a.ratio);
const seenIds = new Set();
for (const v of breakouts) {
  if (seenIds.has(v.id)) continue;
  seenIds.add(v.id);
  out(`- **${fmt(v.views)}** 회 · 구독 ${fmt(v.subs)} · ${v.sec}초 · ${v.ageDays}일 전 · ${v.channel} — ${v.title}  \`${v.seed}\` https://youtu.be/${v.id}`);
}
if (!seenIds.size) out("- (없음)");
out();

out(`## 3. 씨앗 주제별 상위 ${top}편`);
for (const r of summary) {
  out();
  out(`### ${r.seed}  (Commons ${fmt(r.assets.commons)} · NASA ${fmt(r.assets.nasa)})`);
  for (const v of r.videos.slice(0, top)) {
    out(`- ${v.risk ? "⚠ " : ""}${fmt(v.views)} · ${fmt(v.perDay)}/일 · 구독 ${v.subs === null ? "비공개" : fmt(v.subs)} · ${v.sec}초 · ${v.ageDays}일 전 — ${v.title.slice(0, 80)} (${v.channel})`);
  }
  if (!r.videos.length) out("- (결과 없음)");
}
out();
out(`## 다음 단계`);
out(`1. 위에서 마음에 드는 소재 → \`npm run seo -- extremes <편코드> "영어 검색어"\` 로 수요 확인.`);
out(`2. 사진 확인 → \`npm run collect -- <편코드> "검색어" --dry\` (라이선스 · 얼굴 · 로고 눈으로 확인).`);
out(`3. 사실 카드 · 출처 2곳 → plan.md. 영상의 숫자는 사실 카드에 있는 것만.`);

if (write) {
  const dir = join(REPO, "extremes", "docs", "trends");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${today}.md`);
  writeFileSync(file, lines.join("\n") + "\n");
  console.error(`\n저장: ${file}`);
}
