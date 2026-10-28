// shortube 편(콘텐츠 단위) 경로 — 모든 영상 스크립트가 이 파일로 경로를 얻는다.
//   편 = shortube/content/<code>/  (unit.json · plan.md(브리프) · script/(timeline · 데이터) · music/(배경음악 wav))
//   영상 코드 = shortube/video/src/units/<code>/ (index.ts 가 component · durationInFrames 를 내보낸다)
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findUnit, listUnits } from "../../../shared/unit.mjs";

export const VIDEO = resolve(fileURLToPath(new URL("../", import.meta.url)));
export const ROOT = resolve(VIDEO, ".."); // shortube/
export const units = () => listUnits("shortube");
export const unit = (code) => findUnit("shortube", code);
export const engineDir = (code) => join(VIDEO, "src", "units", code);
// 영상 코드까지 있는 편 (아이디어 · 브리프만 있는 편은 뺀다)
export const videoUnits = () => units().filter((u) => u.unit.video?.composition && existsSync(join(engineDir(u.code), "index.ts")));
export const argCode = (code, usage) => {
  const codes = videoUnits().map((u) => u.code);
  if (!code || !codes.includes(code)) throw new Error(`${usage}: <${codes.join("|")}>${code ? ` — '${code}' 는 없다` : ""}`);
  return unit(code);
};
