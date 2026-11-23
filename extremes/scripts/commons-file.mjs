#!/usr/bin/env node
// Wikimedia Commons 파일 하나를 이름으로 받는다 (collect 의 크기 필터에 걸린 작은 공공 도메인 사진 등).
//   node extremes/scripts/commons-file.mjs <편코드> "File:이름.jpg" [저장이름.jpg]
// 허용 라이선스(공공 도메인 · CC0 · CC BY)만 받고 source/credits.json 에 남긴다.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findUnit } from "../../shared/unit.mjs";

const [code, title, name] = process.argv.slice(2);
if (!code || !title?.startsWith("File:")) throw new Error('사용: node extremes/scripts/commons-file.mjs <편코드> "File:이름.jpg" [저장이름]');
const UA = "ExtremesCollector/0.1 (educational shorts)";
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=2160`;
const j = await (await fetch(u, { headers: { "User-Agent": UA } })).json();
const ii = Object.values(j.query.pages)[0].imageinfo?.[0];
if (!ii) throw new Error(`없음: ${title}`);
const m = ii.extmetadata ?? {};
const license = strip(m.LicenseShortName?.value);
const l = license.toLowerCase();
if (/by-sa|by-nc|by-nd/.test(l) || !/public domain|cc0|^cc[- ]by/.test(l)) throw new Error(`허용하지 않는 라이선스: ${license}`);
const unit = findUnit("extremes", code);
const file = name ?? `wikimedia-${title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40)}.jpg`;
// 큰 원본 대신 가로 2160px 축소판 (원본이 더 작으면 원본). 이미지가 아닌 응답(속도 제한 등)은 저장하지 않는다.
const res = await fetch(ii.thumburl ?? ii.url, { headers: { "User-Agent": UA } });
if (!res.ok || !/^image\//.test(res.headers.get("content-type") ?? "")) throw new Error(`받기 실패 ${res.status} ${res.headers.get("content-type")} — 잠시 뒤 다시`);
const buf = Buffer.from(await res.arrayBuffer());
mkdirSync(join(unit.dir, "art"), { recursive: true });
mkdirSync(join(unit.dir, "source"), { recursive: true });
writeFileSync(join(unit.dir, "art", file), buf);
const cf = join(unit.dir, "source", "credits.json");
const credits = existsSync(cf) ? JSON.parse(readFileSync(cf, "utf8")) : [];
credits.push({ file, source: "wikimedia", id: title, title: title.replace(/^File:/, ""), url: ii.url, page: ii.descriptionurl, author: strip(m.Artist?.value) || "unknown", license, attribution: /^cc[- ]by/i.test(license), query: "manual", fetched: new Date().toISOString().slice(0, 10) });
writeFileSync(cf, `${JSON.stringify(credits, null, 2)}\n`);
console.log(`${file} · ${license} · ${(buf.length / 1024).toFixed(0)} KB`);
