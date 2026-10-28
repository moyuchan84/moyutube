// API 키 · 설정값 읽기 — 저장소 공용 shared/env.mjs 를 쓴다 (환경변수 → 저장소 루트 .env → qna/.env)
import { NO_KEY, envValue as sharedEnv } from "../../../shared/env.mjs";
import { ROOT } from "./art-lib.mjs";

export const envValue = (name) => sharedEnv(name, ROOT);
export { NO_KEY };
