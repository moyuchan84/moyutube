// API 키 · 설정값 읽기 — 모든 프로젝트 공용.
// 찾는 순서: 환경변수 → 저장소 루트 .env → 프로젝트 .env (있으면). 키 값은 코드 · 로그 · 문서에 절대 쓰지 않는다.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = resolve(fileURLToPath(new URL("..", import.meta.url)));

const fromFile = (file, name) =>
  existsSync(file) ? readFileSync(file, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1] ?? null : null;

// projectDir: 프로젝트 폴더(예: REPO/qna). 주면 그 폴더의 .env 도 마지막으로 본다
export const envValue = (name, projectDir) => {
  if (process.env[name]) return process.env[name];
  for (const file of [join(REPO, ".env"), ...(projectDir ? [join(projectDir, ".env")] : [])]) {
    const value = fromFile(file, name);
    if (value) return value;
  }
  return null;
};

// Gemini 키 목록: 기본 키 → 예비 키 (일일 한도에 걸리면 다음 키로)
export const geminiKeys = (projectDir) =>
  [...new Set([envValue("GEMINI_API_KEY", projectDir) ?? envValue("GOOGLE_API_KEY", projectDir), envValue("GEMINI_API_KEY2", projectDir)].filter(Boolean))];

export const NO_KEY =
  "GEMINI_API_KEY 가 없다. 저장소 루트 .env 에 GEMINI_API_KEY=... 로 적는다 (예비 키는 GEMINI_API_KEY2). https://aistudio.google.com/apikey";
