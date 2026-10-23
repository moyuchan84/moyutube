// 모션 편집판의 자막(한국어 · 영어)과 챕터 시각을 만든다. 시각 계산은 src/motion/Motion.tsx 의 buildMotion 과 같다.
// 사용: node scripts/motion-srt.mjs ep08f   (src/motion/<plan>.json 의 voice 가 이 편인 계획을 찾는다)
// 결과: out/motion/<plan id>.ko.srt · .en.srt · .chapters.txt (박자가 바뀌는 곳)
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VIDEO } from "./art-lib.mjs";

const FPS = 30;
const episode = process.argv[2];
if (!episode) throw new Error("사용: node scripts/motion-srt.mjs epNN");
const planFile = readdirSync(join(VIDEO, "src/motion"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(VIDEO, "src/motion", f), "utf8")))
  .find((p) => (p.voice ?? p.episode) === episode);
if (!planFile) throw new Error(`src/motion 에 ${episode} 음성을 쓰는 계획이 없다`);
const script = JSON.parse(readFileSync(join(VIDEO, "src", episode, "script.json"), "utf8"));
const timing = JSON.parse(readFileSync(join(VIDEO, "src", episode, "timing.json"), "utf8"));
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
    lines.push({ from: cursor, dur, ko: line.text, en: line.en ?? "" });
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
const srt = (key) => lines.map((l, i) => `${i + 1}\n${stamp(l.from)} --> ${stamp(Math.min(l.from + l.dur + 6, lines[i + 1]?.from ?? Infinity))}\n${l[key]}\n`).join("\n");
const clock = (frames) => `${Math.floor(frames / FPS / 60)}:${String(Math.floor(frames / FPS) % 60).padStart(2, "0")}`;

const outDir = join(VIDEO, "out/motion");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${planFile.id}.ko.srt`), srt("ko"));
if (lines.every((l) => l.en)) writeFileSync(join(outDir, `${planFile.id}.en.srt`), srt("en"));
writeFileSync(join(outDir, `${planFile.id}.chapters.txt`), chapters.map((c) => `${clock(c.from)} ${c.title}`).join("\n") + "\n");
console.log(`${planFile.id}: 자막 ${lines.length}줄 · ${(cursor / FPS).toFixed(1)}초 · 챕터 ${chapters.length}개 → out/motion/`);
