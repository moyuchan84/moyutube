// ffmpeg 찾기: 환경변수 FFMPEG → PATH 의 ffmpeg → Remotion 이 같이 설치한 ffmpeg
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./env.mjs";

const works = (bin) => {
  try {
    execFileSync(bin, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

let cached = null;
export const ffmpegPath = () => {
  if (cached) return cached;
  if (process.env.FFMPEG && existsSync(process.env.FFMPEG)) return (cached = process.env.FFMPEG);
  if (works("ffmpeg")) return (cached = "ffmpeg");
  // node_modules/@remotion/compositor-<플랫폼>/ffmpeg(.exe) — 루트 workspace 또는 프로젝트 안
  for (const base of [join(REPO, "node_modules/@remotion"), ...["qna/video", "shortube/video", "funtube/video", "fairy/video"].map((p) => join(REPO, p, "node_modules/@remotion"))]) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base).filter((d) => d.startsWith("compositor-"))) {
      for (const name of ["ffmpeg.exe", "ffmpeg"]) if (existsSync(join(base, dir, name))) return (cached = join(base, dir, name));
    }
  }
  throw new Error("ffmpeg 를 못 찾았다. 환경변수 FFMPEG 에 경로를 적거나 npm install 을 먼저 한다");
};

export const ffmpeg = (args, opts = {}) => execFileSync(ffmpegPath(), ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit", ...opts });
