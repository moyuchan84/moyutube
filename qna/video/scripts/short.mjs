// 편집형 쇼츠 렌더: 편 폴더 script/shorts.json → out/shorts/<epNN>-short.mp4 + 업로드 정보(편 폴더 upload/short.upload.md).
// 사용: node scripts/short.mjs ep01           (영상 + 업로드 정보)
//       node scripts/short.mjs ep01 --check   (영상 없이 조각마다 스틸 한 장 + 한 장짜리 콘택트 시트 — 편집 확인용)
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildShort } from "../src/shorts/short-timeline.js";
import { buildTimeline } from "../src/timeline.js";
import { argCode, episodeDir, readScript, scriptPath, uploadDir } from "./art-lib.mjs";

const episode = argCode(process.argv[2], "사용: node scripts/short.mjs");
const check = process.argv.includes("--check");
const root = new URL("../", import.meta.url);
if (!existsSync(scriptPath(episode, "shorts.json"))) throw new Error(`편집 계획이 없습니다: qna/${episodeDir(episode)}/script/shorts.json (SKILL.md 2단계)`);
const spec = readScript(episode, "shorts.json");
const timeline = buildTimeline(readScript(episode, "script.json"), readScript(episode, "timing.json"));
const { segments, body, durationInFrames } = buildShort(timeline, spec);
const outDir = new URL(`out/shorts/`, root);
mkdirSync(outDir, { recursive: true });
const out = (name) => fileURLToPath(new URL(name, outDir));

for (const s of segments) console.log(`${String(s.from).padStart(5)}f  ${s.line.padEnd(7)} ${s.li.who.padEnd(5)} ${s.li.text}`);
console.log(`길이 ${(durationInFrames / 30).toFixed(1)}초 (본문 ${(body / 30).toFixed(1)}초 + 끝 카드)`);
if (durationInFrames > 60 * 30) console.log("⚠ 60초가 넘는다. 3분까지 쇼츠로 올라가지만 유입용은 60초 안이 좋다");

console.log("\n▶ 번들링");
const serveUrl = await bundle({ entryPoint: fileURLToPath(new URL("src/index.ts", root)) });
const composition = await selectComposition({ serveUrl, id: spec.id });

if (check) {
  // 훅(첫 화면) · 조각마다 대사 중간 · 도장 · 끝 카드
  const frames = [6, ...segments.map((s) => s.from + Math.round(s.duration * (s.stamp ? 0.8 : 0.5))), body + 60];
  const dir = `${episode}-check/`;
  mkdirSync(new URL(dir, outDir), { recursive: true });
  const files = [];
  for (const frame of frames) {
    const output = out(`${dir}${String(frame).padStart(5, "0")}.png`);
    await renderStill({ composition, serveUrl, output, frame, scale: 0.4 });
    files.push(output);
  }
  // 콘택트 시트: 한 줄에 6장
  const [w, h] = [432, 768];
  const cols = 6;
  const sheet = sharp({ create: { width: w * cols, height: h * Math.ceil(files.length / cols), channels: 3, background: "#15303A" } });
  await sheet.composite(files.map((file, i) => ({ input: file, left: (i % cols) * w, top: Math.floor(i / cols) * h }))).png().toFile(out(`${episode}-check.png`));
  console.log(`\n확인용 시트: video/out/shorts/${episode}-check.png`);
} else {
  const output = out(`${episode}-short.mp4`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: output,
    onProgress: ({ progress }) => process.stdout.write(`\r렌더 ${Math.round(progress * 100)}%`),
  });
  // Chrome 확장의 파일 올리기는 10MB 까지라 올리기용 사본을 따로 만든다 (2패스 1.5Mbps, 50초 ≈ 9.5MB)
  const upload = out(`${episode}-short.upload.mp4`);
  const ff = (args) => execSync(`npx remotion ffmpeg -v error -y -i "${output}" ${args.map((a) => (/[\\/:]/.test(a) ?`"${a}"` : a)).join(" ")}`, { cwd: fileURLToPath(outDir), stdio: "inherit" });
  const kbps = Math.min(1500, Math.floor((9.3 * 8 * 1024) / (durationInFrames / 30) - 96));
  console.log(`\n▶ 올리기용 사본 (${kbps}kbps)`);
  ff(["-c:v", "libx264", "-preset", "slow", "-b:v", `${kbps}k`, "-pass", "1", "-an", "-f", "mp4", process.platform === "win32" ? "NUL" : "/dev/null"]);
  ff(["-c:v", "libx264", "-preset", "slow", "-b:v", `${kbps}k`, "-pass", "2", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", upload]);
  for (const f of readdirSync(outDir)) if (f.startsWith("ffmpeg2pass")) rmSync(new URL(f, outDir));
  const u = spec.upload ?? {};
  mkdirSync(uploadDir(episode), { recursive: true });
  writeFileSync(
    `${uploadDir(episode)}/short.upload.md`,
    [
      `# ${spec.id} 업로드 정보`,
      "",
      `- 영상: \`video/out/shorts/${episode}-short.mp4\` (${(durationInFrames / 30).toFixed(1)}초, 1080x1920)`,
      `- 올리기용 (10MB 이하, Chrome 업로드에 쓴다): \`video/out/shorts/${episode}-short.upload.mp4\``,
      `- 공개 상태: **비공개**로 올린다. 공개는 사람이 확인하고 바꾼다`,
      `- 관련 동영상(본편): ${u.longTitle ?? "(본편 제목)"}`,
      `- 재생목록: ${u.playlist ?? ""}`,
      "",
      "## 제목",
      u.title ?? "",
      "",
      "## 설명",
      u.description ?? "",
      "",
      "## 태그",
      (u.tags ?? []).join(", "),
      "",
    ].join("\n"),
  );
  console.log(`\n\n완성: video/out/shorts/${episode}-short.mp4\n올리기용: video/out/shorts/${episode}-short.upload.mp4\n업로드 정보: qna/${episodeDir(episode)}/upload/short.upload.md`);
}
