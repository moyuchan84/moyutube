// 제목 키워드 조사: YouTube Data API 로 검색어마다 한국 상위 25개 영상의 조회수 · 최근 영상 수 · 잘 나간 제목을 본다.
// 사용: node scripts/keywords.mjs "검찰청 폐지" "경찰 검사 판사 차이" ...
// 키: YOUTUBE_API_KEY (저장소 루트 .env). 검색어 하나에 할당량 약 101 (하루 10,000).
import { envValue } from "./env.mjs";

const key = envValue("YOUTUBE_API_KEY");
if (!key) throw new Error("YOUTUBE_API_KEY 가 없다 (저장소 루트 .env)");
const queries = process.argv.slice(2);
if (!queries.length) throw new Error('사용: node scripts/keywords.mjs "검색어" ...');
const RECENT = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10); // 최근 = 지난 60일

const api = async (path, params) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries({ ...params, key })) url.searchParams.set(k, v);
  const json = await (await fetch(url)).json();
  if (json.error) throw new Error(json.error.message);
  return json;
};
const median = (xs) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0);

for (const q of queries) {
  const found = await api("search", { part: "snippet", q, type: "video", maxResults: 25, regionCode: "KR", relevanceLanguage: "ko" });
  const stats = await api("videos", { part: "statistics,snippet", id: found.items.map((i) => i.id.videoId).join(",") });
  const rows = stats.items.map((i) => ({ title: i.snippet.title, views: Number(i.statistics.viewCount ?? 0), date: i.snippet.publishedAt.slice(0, 10) }));
  const recent = rows.filter((r) => r.date >= RECENT);
  console.log(`\n## ${q} — 조회수 중앙값 ${median(rows.map((r) => r.views)).toLocaleString()} · 최근 60일 ${recent.length}개(중앙값 ${median(recent.map((r) => r.views)).toLocaleString()})`);
  for (const r of rows.sort((a, b) => b.views - a.views).slice(0, 5)) console.log(`  ${r.views.toLocaleString().padStart(12)} | ${r.date} | ${r.title}`);
}
