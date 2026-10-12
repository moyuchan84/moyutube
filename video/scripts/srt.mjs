// 영상과 같은 타임라인으로 유튜브 업로드용 SRT 자막을 만든다.
// 사용: node scripts/srt.mjs ep01        한국어 → out/ep01/subtitles.srt
//       node scripts/srt.mjs ep01 en     대사의 "en" 으로 영어 자막 → out/ep01/subtitles.en.srt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { FPS, buildTimeline } from "../src/timeline.js";

const episode = process.argv[2] ?? "ep01";
const lang = process.argv[3];
const read = (p) => JSON.parse(readFileSync(new URL(`../src/${episode}/${p}`, import.meta.url), "utf8"));
const { cuts } = buildTimeline(read("script.json"), read("timing.json"));

const stamp = (frame) => {
  const ms = Math.round((frame / FPS) * 1000);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

const entries = cuts.flatMap((cut) =>
  cut.lines.map((line) => {
    const start = cut.from + line.from;
    const said = lang ? line[lang] : line.text;
    if (!said) throw new Error(`${line.id}: "${lang}" 번역이 없다`);
    const text = line.who === "dad" || line.who === "kid" ? `"${said}"` : said;
    return `${stamp(start)} --> ${stamp(start + line.duration + 6)}\n${text}`;
  }),
);

const outDir = new URL(`../out/${episode}/`, import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL(lang ? `subtitles.${lang}.srt` : "subtitles.srt", outDir), entries.map((e, i) => `${i + 1}\n${e}\n`).join("\n"));
console.log(`${entries.length} subtitles${lang ? ` (${lang})` : ""}`);
