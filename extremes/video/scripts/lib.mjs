// Extremes 편(콘텐츠 단위) 경로 — 모든 영상 스크립트가 이 파일로 경로를 얻는다.
//   편 = extremes/content/<code>/ (unit.json · plan.md · script/shots.json(샷 계획) · art/(사진) · source/credits.json · music/)
//   영상은 편마다 코드를 만들지 않는다: script/shots.json 이 데이터이고 src/Short.tsx 가 그린다.
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findUnit, listUnits } from "../../../shared/unit.mjs";

export const VIDEO = resolve(fileURLToPath(new URL("../", import.meta.url)));
export const ROOT = resolve(VIDEO, ".."); // extremes/
export const units = () => listUnits("extremes");
export const unit = (code) => findUnit("extremes", code);
// shots.json 과 video.composition 이 있는 편
export const videoUnits = () => units().filter((u) => u.unit.video?.composition && existsSync(join(u.dir, "script", "shots.json")));
export const argCode = (code, usage) => {
  const codes = videoUnits().map((u) => u.code);
  if (!code || !codes.includes(code)) throw new Error(`${usage}: <${codes.join("|")}>${code ? ` — '${code}' 는 없다` : ""}`);
  return unit(code);
};
