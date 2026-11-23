#!/usr/bin/env node
// Extremes 사진 수집 — 라이선스가 확인되는 것만 받고, 받은 사진마다 출처 · 라이선스를 source/credits.json 에 남긴다.
//
//   node extremes/scripts/collect.mjs <편코드> "검색어" [--source wikimedia,nasa,pexels,pixabay] [--max 6] [--dry]
//   (저장소 루트에서 npm run collect -- <편코드> "검색어")
//
// 소스: wikimedia (키 없음) · nasa (키 없음) · pexels (PEXELS_API_KEY) · pixabay (PIXABAY_API_KEY). 키가 없는 소스는 건너뛴다.
// 허용 라이선스: 공공 도메인 · CC0 · CC BY (출처 표시) · Pexels/Pixabay 라이선스. CC BY-SA · NC · ND 와 불분명한 것은 버린다.
// --dry: 받지 않고 후보와 라이선스만 화면에 찍는다.
// --file: 검색어 자리에 Commons 파일 이름("File:…", 여러 개는 |)을 주면 그 파일만 받는다 (검색에 안 걸리는 사진). 라이선스 검사는 같다.
// --video: 사진 대신 영상 클립(mp4)을 찾는다. 소스는 pixabay · pexels(키가 있을 때)만. 받은 클립도 art/ 와 credits.json 에 남는다.
//   영상은 분위기용(연출 화면)으로 쓸 때가 많다 → shots.json 에서 "illustrative": true 로 화면에 표시한다.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { envValue } from "../../shared/env.mjs";
import { findUnit } from "../../shared/unit.mjs";

const args = process.argv.slice(2);
const flags = {};
const pos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const k = args[i].slice(2);
    flags[k] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  } else pos.push(args[i]);
}
const [code, query] = pos;
if (!code || !query) throw new Error('사용: npm run collect -- <편코드> "검색어" [--source wikimedia,nasa] [--max 6] [--dry]');
const max = Number(flags.max ?? 6);
const sources = String(flags.source ?? (flags.video ? "pixabay,pexels" : "wikimedia,nasa,pexels,pixabay")).split(",");
const dry = Boolean(flags.dry);
const video = Boolean(flags.video);
const unit = findUnit("extremes", code);
const artDir = join(unit.dir, "art");
const srcDir = join(unit.dir, "source");
const creditsFile = join(srcDir, "credits.json");
const UA = "ExtremesCollector/0.1 (educational shorts; https://github.com/)";
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// 허용 라이선스 판별 — 허용이면 정규화된 이름, 아니면 null
const okLicense = (name) => {
  const l = strip(name).toLowerCase();
  if (!l) return null;
  if (/by-sa|by-nc|by-nd|share ?alike|noncommercial|no ?deriv/.test(l)) return null;
  if (/public domain|pd[- ]|cc0|cc-zero/.test(l)) return strip(name);
  if (/^cc[- ]by([- ]\d|\b)/.test(l)) return strip(name);
  return null;
};

const getJson = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`);
  return r.json();
};

const wikimedia = async () => {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  // --file: 검색 대신 Commons 파일 이름을 그대로 받는다 ("File:Titanic wreck bow.jpg", 여러 개는 | 로)
  const p = flags.file
    ? { action: "query", format: "json", titles: query.split("|").map((x) => (x.startsWith("File:") ? x : `File:${x}`)).join("|"), prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "2160" }
    : { action: "query", format: "json", generator: "search", gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: String(max * 4), prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "2160" };
  for (const [k, v] of Object.entries(p)) u.searchParams.set(k, v);
  const json = await getJson(u);
  const out = [];
  for (const page of Object.values(json.query?.pages ?? {})) {
    const ii = page.imageinfo?.[0];
    if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime) || (!flags.file && (ii.width < 1600 || ii.height < 1000))) continue; // --file 은 사람이 고른 것이라 크기 검사를 건너뛴다
    const m = ii.extmetadata ?? {};
    const license = okLicense(m.LicenseShortName?.value);
    if (!license) continue;
    out.push({
      source: "wikimedia", id: page.title, title: page.title.replace(/^File:/, ""), url: ii.thumburl ?? ii.url, page: ii.descriptionurl,
      author: strip(m.Artist?.value) || "unknown", license, attribution: /^cc[- ]by/i.test(license) || m.AttributionRequired?.value === "true",
    });
  }
  return out;
};

const nasa = async () => {
  const json = await getJson(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${max * 3}`);
  const out = [];
  for (const it of json.collection?.items ?? []) {
    const d = it.data?.[0];
    if (!d?.nasa_id) continue;
    let url = it.links?.[0]?.href;
    try {
      const assets = await getJson(`https://images-api.nasa.gov/asset/${encodeURIComponent(d.nasa_id)}`);
      const hrefs = (assets.collection?.items ?? []).map((x) => x.href);
      url = hrefs.find((h) => /~large\.jpg$/i.test(h)) ?? hrefs.find((h) => /~medium\.jpg$/i.test(h)) ?? url;
    } catch {}
    if (!url) continue;
    out.push({
      source: "nasa", id: d.nasa_id, title: d.title, url: url.replace(/ /g, "%20"), page: `https://images.nasa.gov/details/${d.nasa_id}`,
      author: d.photographer || d.secondary_creator || d.center || "NASA", license: "NASA media (generally public domain; check page for third-party credit)", attribution: false, check: true,
    });
  }
  return out;
};

const pexels = async () => {
  const key = envValue("PEXELS_API_KEY");
  if (!key) return (console.log("  pexels: PEXELS_API_KEY 없음 — 건너뜀"), []);
  const json = await getJson(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=${max * 2}`, { Authorization: key });
  return (json.photos ?? []).map((p) => ({
    source: "pexels", id: String(p.id), title: p.alt || `pexels ${p.id}`, url: p.src.large2x ?? p.src.original, page: p.url,
    author: p.photographer, license: "Pexels License", attribution: false,
  }));
};

const pixabay = async () => {
  const key = envValue("PIXABAY_API_KEY");
  if (!key) return (console.log("  pixabay: PIXABAY_API_KEY 없음 — 건너뜀"), []);
  const json = await getJson(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=vertical&min_height=1600&per_page=${Math.max(max * 2, 3)}`);
  return (json.hits ?? []).map((h) => ({
    source: "pixabay", id: String(h.id), title: h.tags, url: h.largeImageURL, page: h.pageURL, author: h.user, license: "Pixabay Content License", attribution: false,
  }));
};

// 영상: 짧은 변이 1080 이상인 파일을 고른다 (가로 영상은 세로로 잘라 쓴다)
const pixabayVideo = async () => {
  const key = envValue("PIXABAY_API_KEY");
  if (!key) return (console.log("  pixabay: PIXABAY_API_KEY 없음 — 건너뜀"), []);
  const json = await getJson(`https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&per_page=${Math.max(max * 2, 3)}`);
  return (json.hits ?? []).flatMap((h) => {
    const v = [h.videos?.medium, h.videos?.large].find((x) => x?.url && Math.min(x.width, x.height) >= 1080);
    if (!v) return [];
    return [{ source: "pixabay", id: `video-${h.id}`, title: h.tags, url: v.url, page: h.pageURL, author: h.user, license: "Pixabay Content License", attribution: false, kind: "video", size: `${v.width}x${v.height}`, seconds: h.duration }];
  });
};
const pexelsVideo = async () => {
  const key = envValue("PEXELS_API_KEY");
  if (!key) return (console.log("  pexels: PEXELS_API_KEY 없음 — 건너뜀"), []);
  const json = await getJson(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${max * 2}`, { Authorization: key });
  return (json.videos ?? []).flatMap((v) => {
    const f = (v.video_files ?? []).filter((x) => x.file_type === "video/mp4" && Math.min(x.width, x.height) >= 1080).sort((a, b) => a.width * a.height - b.width * b.height)[0];
    if (!f) return [];
    return [{ source: "pexels", id: `video-${v.id}`, title: v.url.split("/").filter(Boolean).pop(), url: f.link, page: v.url, author: v.user?.name ?? "unknown", license: "Pexels License", attribution: false, kind: "video", size: `${f.width}x${f.height}`, seconds: v.duration }];
  });
};

const SOURCES = video ? { pixabay: pixabayVideo, pexels: pexelsVideo } : { wikimedia, nasa, pexels, pixabay };
const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, "utf8")) : [];
const have = new Set(credits.map((c) => `${c.source}:${c.id}`));
console.log(`편 ${code} · 검색어 "${query}" · 소스 ${sources.join(",")}${dry ? " · DRY(받지 않음)" : ""}`);
let saved = 0;
for (const name of sources) {
  if (!SOURCES[name]) continue;
  let found = [];
  try {
    found = await SOURCES[name]();
  } catch (e) {
    console.log(`  ${name}: 실패 — ${e.message}`);
    continue;
  }
  found = found.filter((f) => !have.has(`${f.source}:${f.id}`)).slice(0, max);
  console.log(`  ${name}: 허용 라이선스 후보 ${found.length}개`);
  for (const f of found) {
    console.log(`    - ${f.title.slice(0, 60)} | ${f.license} | ${f.author.slice(0, 30)}${f.kind === "video" ? ` | ${f.size} · ${f.seconds}s` : ""}${f.check ? " | 페이지에서 제3자 크레딧 확인" : ""}`);
    if (dry) continue;
    const res = await fetch(f.url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`      받기 실패 ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = f.kind === "video" ? "mp4" : /png/i.test(res.headers.get("content-type") ?? "") ? "png" : "jpg";
    const file = `${f.source}-${createHash("sha1").update(f.id).digest("hex").slice(0, 8)}.${ext}`;
    mkdirSync(artDir, { recursive: true });
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(join(artDir, file), buf);
    credits.push({ file, ...f, query, fetched: new Date().toISOString().slice(0, 10) });
    saved++;
  }
}
if (!dry && saved) writeFileSync(creditsFile, `${JSON.stringify(credits, null, 2)}\n`);
console.log(dry ? "\n(dry) 아무것도 받지 않았다." : `\n${saved}개 저장 → ${artDir}\n출처 기록 → ${creditsFile}`);
