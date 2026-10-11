// 한 편을 처음부터 끝까지: 프롬프트 문서 갱신 → 그림 처리 → 음성 → 영상 → 자막.
// 사용: node scripts/make.mjs ep01          (음성이 이미 있으면 다시 만들지 않는다)
//       node scripts/make.mjs ep01 --tts    (대사를 고쳤을 때: 음성부터 다시)
import { execSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { VIDEO } from "./art-lib.mjs";

const episode = process.argv[2] ?? "ep01";
const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { cwd: VIDEO, stdio: "inherit" });
};

const script = join(VIDEO, "src", episode, "script.json");
const timing = join(VIDEO, "src", episode, "timing.json");
const stale = !existsSync(timing) || statSync(timing).mtimeMs < statSync(script).mtimeMs;

run(`node scripts/prompts.mjs ${episode}`);
run(`node scripts/art.mjs ${episode}`);
if (process.argv.includes("--tts") || !existsSync(timing)) run(`npm run tts -- ${episode}`);
else if (stale) console.log("\n⚠ script.json 이 음성보다 새것이다. 대사를 고쳤다면 --tts 를 붙여 다시 실행한다 (연출만 고쳤으면 그대로 둬도 된다).");
if (!existsSync(join(VIDEO, "public/sfx/boing.wav"))) run("npm run sfx");
const id = episode[0].toUpperCase() + episode.slice(1);
run(`npx remotion render src/index.ts ${id} out/${episode}/${episode}.mp4`);
run(`node scripts/srt.mjs ${episode}`);
console.log(`\n완성: video/out/${episode}/${episode}.mp4`);
