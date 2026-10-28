// 쇼츠 한 편 렌더: npm run render -- <code> [--data] [--bgm] [--still <frame>]
//   --data   데이터 다시 받기 · 계산 (unit.json 의 video.data — 시세 등 네트워크를 쓰므로 새 편 만들 때만)
//   --bgm    배경음악 다시 합성 (wav 가 없으면 자동으로 만든다. 합성에 잡음 난수가 들어 있어 다시 만들면 파일이 조금 달라진다)
//   --still  그 프레임 한 장만 out/<code>-<frame>.png 로 (겹침 · 잘림 확인용)
// 결과: shortube/output/videos/<created>_<code>.mp4 (git 제외)
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VIDEO, argCode } from "./lib.mjs";

const args = process.argv.slice(2);
const { code, dir, unit } = argCode(args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a)), "사용: npm run render -- <편>");
const v = unit.video;
const run = (cmd, ...a) => {
  console.log(`\n▶ ${[cmd, ...a].join(" ")}`);
  execSync([cmd, ...a].map((x) => (/\s/.test(x) ?`"${x}"` : x)).join(" "), { cwd: VIDEO, stdio: "inherit" });
};

if (args.includes("--data")) for (const s of v.data ?? []) run("node", `scripts/${s}`);
const music = join(dir, "music");
const hasWav = existsSync(music) && readdirSync(music).some((f) => f.endsWith(".wav"));
if (v.bgm && (args.includes("--bgm") || !hasWav)) run("node", `scripts/${v.bgm}`);
run("node", "scripts/registry.mjs");
run("node", "scripts/sync.mjs");
const stillAt = args.indexOf("--still");
if (stillAt >= 0) {
  const frame = args[stillAt + 1] ?? "0";
  run("npx", "remotion", "still", v.composition, `out/${code}-${frame}.png`, `--frame=${frame}`, "--scale=0.4");
} else {
  const output = join(ROOT, "output", "videos", `${unit.created}_${code}.mp4`);
  run("npx", "remotion", "render", v.composition, output);
  console.log(`\n완성: shortube/output/videos/${unit.created}_${code}.mp4`);
}
