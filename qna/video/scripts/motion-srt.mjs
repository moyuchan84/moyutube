// 모션 편집판의 자막(한국어 · 영어)과 챕터 시각을 만든다. 시각 계산은 src/motion/Motion.tsx 의 buildMotion 과 같다.
// 사용: node scripts/motion-srt.mjs ep08f   (그 편의 script/motion.json)
// 결과: 편 폴더 upload/ko.srt · en.srt · chapters.txt (박자가 바뀌는 곳)
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { splitKo, fastCues } from "../../../shared/srt-ko.mjs";
import { argCode, episodeDir, readScript, scriptPath, uploadDir } from "./art-lib.mjs";

const FPS = 30;
const episode = argCode(process.argv[2], "사용: node scripts/motion-srt.mjs");
if (!existsSync(scriptPath(episode, "motion.json"))) throw new Error(`${episodeDir(episode)}/script/motion.json 이 없다 (모답맨 샷 계획)`);
const planFile = readScript(episode, "motion.json");
const script = readScript(episode, "script.json");
const timing = readScript(episode, "timing.json");
const speed = script.speed ?? 1;
const gap = planFile.gap ?? 2;
const frameOf = (at, length) => (at == null ? 0 : at < 1 ? Math.round(at * length) : at);

const lines = [];
const chapters = [];
let cursor = 0;
for (const beat of planFile.beats) {
  let length = beat.hold ?? 0;
  if (beat.line) {
    const cutId = beat.line.slice(0, beat.line.lastIndexOf("-"));
    const cut = script.cuts.find((c) => c.id === cutId);
    const line = cut.lines[Number(beat.line.slice(beat.line.lastIndexOf("-") + 1))];
    const dur = Math.ceil((timing[beat.line] / speed) * FPS);
    lines.push({ from: cursor, dur, ko: line.sub ?? line.text, en: line.en ?? "" });
    if (chapters.at(-1)?.title !== cut.beat) chapters.push({ from: cursor, title: cut.beat });
    length = dur + gap;
  }
  length += beat.pad ?? 0;
  cursor += length;
}

const stamp = (frames) => {
  const ms = Math.round((frames / FPS) * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
// 끝은 6프레임 여유를 두되 다음 자막과 겹치지 않게
const srtOf = (cues) => cues.map((l, i) => `${i + 1}\n${stamp(l.from)} --> ${stamp(Math.min(l.from + l.dur + 6, cues[i + 1]?.from ?? Infinity))}\n${l.text}\n`).join("\n");
// 한국어는 넷플릭스 한국어 자막 지침(16자 · 두 줄 · 줄 끝 마침표 없음)으로 나눈다 — shared/srt-ko.mjs, docs/video-editing-guide.md
const koCues = lines.flatMap((l) => splitKo(l.ko, l.from, l.dur));
const enCues = lines.map((l) => ({ from: l.from, dur: l.dur, text: l.en }));
const clock = (frames) => `${Math.floor(frames / FPS / 60)}:${String(Math.floor(frames / FPS) % 60).padStart(2, "0")}`;

const outDir = uploadDir(episode);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "ko.srt"), srtOf(koCues));
if (lines.every((l) => l.en)) writeFileSync(join(outDir, "en.srt"), srtOf(enCues));
writeFileSync(join(outDir, "chapters.txt"), chapters.map((c) => `${clock(c.from)} ${c.title}`).join("\n") + "\n");
console.log(`${planFile.id}: 자막 ${lines.length}줄(한국어 ${koCues.length}개) · ${(cursor / FPS).toFixed(1)}초 · 챕터 ${chapters.length}개 → qna/${episodeDir(episode)}/upload/`);
const fast = fastCues(koCues, FPS);
if (fast.length) console.log(`  읽기 속도 초당 12자 넘는 한국어 자막 ${fast.length}개 (음성 속도라 경고만): ${fast.slice(0, 3).map((c) => c.text.replace("\n", " ")).join(" / ")}`);
