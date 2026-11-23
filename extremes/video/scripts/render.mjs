// 쇼츠 한 편 렌더: npm run render -- <code> [--bgm] [--still <frame>]   (extremes/video 에서)
//   --bgm    배경음악 다시 합성 (wav 가 없으면 자동으로 만든다)
//   --still  그 프레임 한 장만 out/<code>-<frame>.png 로 (겹침 · 잘림 확인용)
// 결과: extremes/output/videos/<created>_<code>.mp4 (git 제외)
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VIDEO, argCode } from "./lib.mjs";

const args = process.argv.slice(2);
const { code, dir, unit } = argCode(args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a)), "사용: npm run render -- <편>");
const run = (cmd, ...a) => {
  console.log(`\n▶ ${[cmd, ...a].join(" ")}`);
  execSync([cmd, ...a].map((x) => (/\s/.test(x) ? `"${x}"` : x)).join(" "), { cwd: VIDEO, stdio: "inherit" });
};
const wav = join(dir, "music", `${code}.wav`);
if (existsSync(join(VIDEO, "scripts", "bgm", `${code}.mjs`)) && (args.includes("--bgm") || !existsSync(wav))) run("node", `scripts/bgm/${code}.mjs`);
run("node", "scripts/registry.mjs");
run("node", "scripts/sync.mjs");
const at = args.indexOf("--still");
if (at >= 0) {
  const frame = args[at + 1] ?? "0";
  run("npx", "remotion", "still", unit.video.composition, `out/${code}-${frame}.png`, `--frame=${frame}`, "--scale=0.5");
} else {
  const output = join(ROOT, "output", "videos", `${unit.created}_${code}.mp4`);
  run("npx", "remotion", "render", unit.video.composition, output);
  console.log(`\n완성: extremes/output/videos/${unit.created}_${code}.mp4`);
}
