// API 키 · 설정값 읽기. 찾는 순서: 환경변수 → 저장소 루트 .env (D:\youtube\.env, 모든 프로젝트 공용) → video/.env
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { VIDEO } from "./art-lib.mjs";

export const ENV_FILES = [resolve(VIDEO, "../../.env"), join(VIDEO, ".env")];

export const envValue = (name) => {
  if (process.env[name]) return process.env[name];
  for (const file of ENV_FILES) {
    if (!existsSync(file)) continue;
    const value = readFileSync(file, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\s]+)`, "m"))?.[1];
    if (value) return value;
  }
  return null;
};

export const NO_KEY = "GEMINI_API_KEY 가 없다. 저장소 루트 .env (D:\\youtube\\.env) 에 GEMINI_API_KEY=... 로 적는다 (https://aistudio.google.com/apikey)";
