// 크롬(Gemini · AI Studio)에서 받은 파일을 ~/Downloads 에서 가져오기 — fairy · funtube · qna 공용.
import { copyFileSync, mkdirSync, readdirSync, renameSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const DOWNLOADS = process.env.MOYU_DOWNLOADS ?? join(homedir(), "Downloads");

// pattern 에 맞는 파일 중 가장 최근 것 (since: 이 시각(ms) 뒤에 받은 것만)
export const newest = (pattern, { since = 0 } = {}) =>
  readdirSync(DOWNLOADS)
    .filter((name) => pattern.test(name))
    .map((name) => ({ name, path: join(DOWNLOADS, name), time: statSync(join(DOWNLOADS, name)).mtimeMs }))
    .filter((f) => f.time >= since)
    .sort((a, b) => b.time - a.time)[0] ?? null;

// 가장 최근 파일을 dest 로 옮긴다 (move: false 면 복사). 없으면 null
export const importNewest = (pattern, dest, { move = true, since } = {}) => {
  const hit = newest(pattern, { since });
  if (!hit) return null;
  mkdirSync(dirname(dest), { recursive: true });
  (move ? renameSync : copyFileSync)(hit.path, dest);
  return dest;
};
