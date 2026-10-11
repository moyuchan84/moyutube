// 내 목소리(또는 다른 TTS)로 바꿔 끼울 때 쓰는 도구.
//   node scripts/voice.mjs ep01 sheet    녹음 대본 → out/ep01/voice-script.md (파일 이름 · 화자 · 대사)
//   node scripts/voice.mjs ep01          public/ep01/voice/*.wav 길이를 재서 src/ep01/timing.json 을 다시 쓴다
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VIDEO } from "./art-lib.mjs";

const [episode = "ep01", mode] = process.argv.slice(2);
const script = JSON.parse(readFileSync(join(VIDEO, "src", episode, "script.json"), "utf8"));
const WHO = { narr: "나레이션", dad: "아빠", kid: "아이", docu: "다큐 톤(낮고 진지하게)" };
const lines = script.cuts.flatMap((cut) => cut.lines.map((line, i) => ({ id: `${cut.id}-${i}`, beat: cut.beat, ...line })));

// WAV 헤더에서 길이(초)를 읽는다
const seconds = (file) => {
  const buf = readFileSync(file);
  let byteRate = 0;
  for (let p = 12; p + 8 <= buf.length; ) {
    const id = buf.toString("ascii", p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    if (id === "fmt ") byteRate = buf.readUInt32LE(p + 16);
    if (id === "data") return Math.min(size, buf.length - p - 8) / byteRate;
    p += 8 + size + (size % 2);
  }
  throw new Error(`${file}: WAV 파일이 아니다`);
};

if (mode === "sheet") {
  const outDir = join(VIDEO, "out", episode);
  mkdirSync(outDir, { recursive: true });
  let beat = null;
  const rows = lines.map((l) => {
    const head = l.beat !== beat ? `\n## ${(beat = l.beat) || "기타"}\n\n` : "";
    return `${head}- \`${l.id}.wav\` · **${WHO[l.who] ?? l.who}** — ${l.text}`;
  });
  writeFileSync(
    join(outDir, "voice-script.md"),
    `# ${script.title} — 녹음 대본 (${lines.length}줄)\n\n한 줄을 한 파일로 녹음해 \`video/public/${episode}/voice/\` 에 같은 이름의 WAV로 넣는다.\n앞뒤 무음은 0.1초 안쪽으로 자른다. 다 넣은 뒤 \`npm run voice -- ${episode}\`.\n${rows.join("\n")}\n`,
  );
  console.log(`out/${episode}/voice-script.md (${lines.length}줄)`);
} else {
  const timing = {};
  const missing = [];
  for (const l of lines) {
    const file = join(VIDEO, "public", episode, "voice", `${l.id}.wav`);
    if (existsSync(file)) timing[l.id] = Math.round(seconds(file) * 1000) / 1000;
    else missing.push(l.id);
  }
  if (missing.length) throw new Error(`음성 파일이 없다: ${missing.join(", ")}`);
  writeFileSync(join(VIDEO, "src", episode, "timing.json"), `${JSON.stringify(timing, null, 2)}\n`);
  const total = Object.values(timing).reduce((a, b) => a + b, 0);
  console.log(`timing.json 갱신: ${lines.length}줄, 말하는 시간 ${(total / 60).toFixed(1)}분`);
}
