// 쇼츠용 세로 썸네일 (1080×1920) 을 만들고, 쇼츠 목록에서 보이는 크기(가로 180px)로 줄인 미리보기를 같이 만든다.
// 규칙은 qna/docs/shorts-thumbnail.md. motion.json 의 thumb.vertical 이 있어야 한다.
// 사용: npm run thumb-short -- mk05   (prerender 대신 registry · sync 를 먼저 돌린다)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { argCode, readScript, uploadDir, VIDEO } from "./art-lib.mjs";

const code = argCode(process.argv[2], "사용: npm run thumb-short -- <편 코드>");
const motion = readScript(code, "motion.json");
if (!motion.thumb?.vertical) {
  console.error(`${code}: script/motion.json 의 thumb.vertical 이 없다 — docs/shorts-thumbnail.md 의 틀을 복사해 채운다`);
  process.exit(1);
}
const id = `${motion.id}-ThumbV`;
const out = join(uploadDir(code), "thumbnail-short.png");
const preview = join(VIDEO, "out", code, "thumbnail-short-180.png");
mkdirSync(join(VIDEO, "out", code), { recursive: true });

const run = (cmd, args) => execFileSync(cmd, args, { cwd: VIDEO, stdio: "inherit", shell: process.platform === "win32" });
run("node", ["scripts/registry.mjs"]);
run("node", ["scripts/sync.mjs"]);
run("npx", ["remotion", "still", "src/index.ts", id, out]);

const ffmpeg = join(VIDEO, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
if (existsSync(ffmpeg)) {
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", out, "-vf", "scale=180:-1", preview]);
  console.log(`\n썸네일: ${out}\n미리보기(쇼츠 목록 크기): ${preview}\n→ 미리보기에서 큰 글자 두 줄이 읽히고 인물 얼굴이 보이는지 눈으로 확인한다.`);
} else {
  console.log(`\n썸네일: ${out}\n(ffmpeg 를 못 찾아 미리보기는 건너뜀 — 그림을 180px 로 줄여서 확인)`);
}
