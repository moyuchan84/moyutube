#!/usr/bin/env node
// 업로드 전 제목 조사 확인 — Claude Code 훅(.claude/settings.json)이 부르고, 손으로도 돌린다.
//
//   npm run seo-check            아직 안 올린 편마다 upload.md 에 키워드 조사(seo 칸) · 제목이 있는지
//   (훅, --hook) stdin 으로 훅 JSON 을 받아, 유튜브 Studio 를 열거나 "업로드/올려" 요청일 때만 알림을 붙인다.
//
// 막지는 않는다 (Studio 는 분석 · 확인에도 쓰므로). 알림만 Claude 에게 붙인다.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PROJECTS, listUnits } from "../unit.mjs";

const pending = () => {
  const rows = [];
  for (const p of Object.keys(PROJECTS)) {
    for (const { code, dir, unit } of listUnits(p)) {
      if (["uploaded", "archived", "idea"].includes(unit.status)) continue;
      const file = join(dir, "upload", "upload.md");
      const text = existsSync(file) ? readFileSync(file, "utf8") : "";
      const seo = /<!-- seo:start/.test(text) || /## 키워드 조사/.test(text);
      const title = /^- 제목:\s*\S/m.test(text);
      rows.push({ id: `${p}/${code}`, seo, title, status: unit.status });
    }
  }
  return rows;
};

const report = (rows) => {
  const bad = rows.filter((r) => !r.seo || !r.title);
  const lines = bad.map((r) => `- ${r.id} (${r.status}): ${!r.seo ? "키워드 조사 없음" : ""}${!r.seo && !r.title ? " · " : ""}${!r.title ? "제목 없음" : ""}`);
  return { bad, lines };
};

const REMIND =
  "[yt-seo] 유튜브에 올리기 전에 스킬 `yt-seo` 를 실행한다: `npm run seo -- <project> <code> \"검색어\" …` 로 YouTube API 키워드 · 해시태그 · 자동완성을 조사해 upload/upload.md 에 남기고, 그 표로 제목(한·영) · 설명 · 해시태그 · 태그를 정한 뒤 올린다. 쇼츠도 같다.";

const raw = process.argv.includes("--hook") ? readFileSync(0, "utf8") : "";
if (!raw.trim()) {
  // 손으로 돌릴 때
  const { bad, lines } = report(pending());
  console.log(bad.length ? `제목 조사가 빠진 편 ${bad.length}개\n${lines.join("\n")}` : "안 올린 편 모두 키워드 조사 · 제목이 있다");
  process.exit(0);
}

let input = {};
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}
const event = input.hook_event_name;
let hit = false;
if (event === "PreToolUse") {
  const url = String(input.tool_input?.url ?? "");
  hit = /studio\.youtube\.com/.test(url) && !/analytics/.test(url);
} else if (event === "UserPromptSubmit") {
  const prompt = String(input.prompt ?? "");
  hit = /(유튜브|youtube|스튜디오|studio|쇼츠|shorts|본편|영상)/i.test(prompt) && /(업로드|올려|올리|게시|upload)/i.test(prompt);
}
if (!hit) process.exit(0);

const { lines } = report(pending());
const context = [REMIND, ...(lines.length ? ["아직 조사 · 제목이 빠진 편:", ...lines.slice(0, 10)] : [])].join("\n");
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: context } }));
