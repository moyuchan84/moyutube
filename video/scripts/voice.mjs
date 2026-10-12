// 내 목소리(또는 다른 TTS)로 바꿔 끼울 때 쓰는 도구.
//   node scripts/voice.mjs ep01 sheet    녹음 대본 → out/ep01/voice-script.md (파일 이름 · 화자 · 대사)
//   node scripts/voice.mjs ep01 studio   AI Studio 붙여넣기 페이지 → out/ep01/voice-studio.html (컷마다 복사 버튼)
//   node scripts/voice.mjs ep01 split    voice-studio/ep01/<컷id>.wav 를 대사 줄마다 잘라 public/ep01/voice 에 넣고 타이밍 갱신
//   node scripts/voice.mjs ep01          public/ep01/voice/*.wav 길이를 재서 src/ep01/timing.json 을 다시 쓴다
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VIDEO } from "./art-lib.mjs";

const [episode = "ep01", mode] = process.argv.slice(2);
const script = JSON.parse(readFileSync(join(VIDEO, "src", episode, "script.json"), "utf8"));
const WHO = { narr: "나레이션", dad: "아빠", kid: "아이", docu: "다큐 톤(낮고 진지하게)" };
const lines = script.cuts.flatMap((cut) => cut.lines.map((line, i) => ({ id: `${cut.id}-${i}`, beat: cut.beat, ...line })));

const voiceDir = join(VIDEO, "public", episode, "voice");
const studioDir = join(VIDEO, "voice-studio", episode); // AI Studio에서 받은 컷별 원본
const lockFile = join(VIDEO, "src", episode, "voice-lock.json"); // 자를 때의 대사 지문과 원본 시각. 대사가 바뀐 컷을 찾는 데 쓴다
const spoken = (line) => line.tts ?? line.text;
const cutHash = (cut) => createHash("sha1").update(JSON.stringify(cut.lines.map((l) => [l.who, spoken(l)]))).digest("hex").slice(0, 12);
const readLock = () => (existsSync(lockFile) ? JSON.parse(readFileSync(lockFile, "utf8")) : {});

// WAV(16비트 PCM)를 읽는다
const readWav = (file) => {
  const buf = readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF") throw new Error(`${file}: WAV 파일이 아니다`);
  let fmt = null;
  for (let p = 12; p + 8 <= buf.length; ) {
    const id = buf.toString("ascii", p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    if (id === "fmt ") {
      fmt = { channels: buf.readUInt16LE(p + 10), rate: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22) };
      // 헤더의 byteRate 는 믿지 않는다 (AI Studio 파일은 두 배로 적혀 있다)
      fmt.byteRate = (fmt.rate * fmt.channels * fmt.bits) / 8;
    }
    if (id === "data") return { ...fmt, data: buf.subarray(p + 8, p + 8 + Math.min(size, buf.length - p - 8)) };
    p += 8 + size + (size % 2);
  }
  throw new Error(`${file}: WAV 파일이 아니다`);
};

const seconds = (file) => {
  const wav = readWav(file);
  return wav.data.length / wav.byteRate;
};

const writeWav = (file, wav, data) => {
  const head = Buffer.alloc(44);
  head.write("RIFF", 0, "ascii");
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVEfmt ", 8, "ascii");
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(wav.channels, 22);
  head.writeUInt32LE(wav.rate, 24);
  head.writeUInt32LE(wav.byteRate, 28);
  head.writeUInt16LE(wav.channels * 2, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36, "ascii");
  head.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([head, data]));
};

const writeTiming = () => {
  const timing = {};
  const missing = [];
  for (const l of lines) {
    const file = join(voiceDir, `${l.id}.wav`);
    if (existsSync(file)) timing[l.id] = Math.round(seconds(file) * 1000) / 1000;
    else missing.push(l.id);
  }
  if (missing.length) throw new Error(`음성 파일이 없다: ${missing.join(", ")}`);
  writeFileSync(join(VIDEO, "src", episode, "timing.json"), `${JSON.stringify(timing, null, 2)}\n`);
  const total = Object.values(timing).reduce((a, b) => a + b, 0);
  console.log(`timing.json 갱신: ${lines.length}줄, 말하는 시간 ${(total / 60).toFixed(1)}분`);
};

// 컷 하나의 음성을 대사 n줄로 자른다: 말소리 사이의 무음 중 가장 긴 n-1곳이 줄 경계다
const FRAME = 0.01; // 초
const PAD = 0.05; // 잘린 조각 앞뒤에 남기는 여유(초)
const splitWav = (wav, n) => {
  if (wav.bits !== 16) throw new Error("16비트 PCM WAV만 자를 수 있다");
  const step = wav.channels * 2;
  const perFrame = Math.round(wav.rate * FRAME);
  const frames = Math.floor(wav.data.length / step / perFrame);
  const rms = new Float64Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let s = 0; s < perFrame * wav.channels; s++) {
      const v = wav.data.readInt16LE((f * perFrame * wav.channels + s) * 2);
      sum += v * v;
    }
    rms[f] = Math.sqrt(sum / (perFrame * wav.channels));
  }
  const floor = Math.max(...rms) * 0.02;
  const loud = (f) => rms[f] > floor;
  let first = 0;
  let last = frames - 1;
  while (first < frames && !loud(first)) first++;
  while (last > first && !loud(last)) last--;
  const gaps = [];
  for (let f = first; f <= last; f++) {
    if (loud(f)) continue;
    let end = f;
    while (!loud(end + 1)) end++;
    gaps.push({ from: f, to: end + 1, len: end + 1 - f });
    f = end;
  }
  gaps.sort((a, b) => b.len - a.len);
  if (gaps.length < n - 1) throw new Error(`대사는 ${n}줄인데 쉬는 곳을 ${gaps.length}곳밖에 못 찾았다`);
  const chosen = gaps.slice(0, n - 1).sort((a, b) => a.from - b.from);
  // 고른 경계와 버린 무음의 길이가 비슷하면 잘못 잘랐을 수 있다
  const unsure = n > 1 && gaps[n - 1] && gaps[n - 2].len < gaps[n - 1].len * 1.5;
  const edges = [first, ...chosen.flatMap((g) => [g.from, g.to]), last + 1];
  const pad = Math.round(PAD / FRAME);
  const pieces = [];
  for (let i = 0; i < n; i++) {
    const from = Math.max(0, edges[i * 2] - pad);
    const to = Math.min(frames, edges[i * 2 + 1] + pad);
    pieces.push(wav.data.subarray(from * perFrame * step, to * perFrame * step));
  }
  return { pieces, unsure };
};

// AI Studio 화자: 나레이션·아빠·다큐 톤은 한 사람(Speaker 1), 아이는 Speaker 2
const SPEAKER = { narr: "Speaker 1", dad: "Speaker 1", docu: "Speaker 1", kid: "Speaker 2" };
const STYLE =
  "Korean family YouTube video. Speaker 1 is a Korean dad in his late thirties telling the story: warm, relaxed, a little self-deprecating. Speaker 2 is his eight-year-old child: bright, curious, high-pitched. Speak natural conversational Korean at an unhurried pace. Leave a clear pause of about one second between every line, and no long pause inside a line. Never read the speaker labels aloud.";
const ACTING = {
  dad: "is the dad speaking inside the scene, acted out, not narration",
  docu: "is read in a very deep, slow, mock-serious documentary narrator voice",
};
const studioText = (cut) => {
  const notes = cut.lines.filter((l) => ACTING[l.who]).map((l) => `The line "${spoken(l)}" ${ACTING[l.who]}.`);
  const body = cut.lines.map((l) => `${SPEAKER[l.who] ?? "Speaker 1"}: ${spoken(l)}`);
  return [STYLE, ...notes, "", ...body].join("\n");
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
} else if (mode === "studio") {
  const outDir = join(VIDEO, "out", episode);
  mkdirSync(outDir, { recursive: true });
  const lock = readLock();
  const cuts = script.cuts.filter((cut) => cut.lines.length);
  const state = (cut) => {
    if (lock[cut.id]?.text === cutHash(cut)) return ["ok", "✅ 완료"];
    if (lock[cut.id]) return ["stale", "⚠ 대사가 바뀜 — 다시 생성"];
    return ["todo", "⬜ 아직"];
  };
  const todo = cuts.filter((cut) => state(cut)[0] !== "ok");
  const cards = cuts.map((cut) => {
    const [cls, label] = state(cut);
    return `<section class="${cls}"><header><b>${cut.id}.wav</b><span>${esc(cut.beat ?? "")} · ${cut.lines.length}줄</span><em>${label}</em><button>복사</button></header><pre>${esc(studioText(cut))}</pre></section>`;
  });
  writeFileSync(
    join(outDir, "voice-studio.html"),
    `<!doctype html><html lang="ko"><meta charset="utf-8"><title>${esc(script.title)} — AI Studio 음성</title>
<style>
body{font:16px/1.6 'Pretendard Variable',system-ui,sans-serif;max-width:860px;margin:32px auto;padding:0 16px;background:#E9EDE8;color:#1B2A26}
h1{font-size:22px}ol{padding-left:20px}code{background:#DFE6DE;padding:1px 5px;border-radius:4px}
section{background:#F6F8F4;border:2px solid #C4D0C6;border-radius:8px;margin:14px 0;padding:12px 14px}
section.ok{opacity:.55}section.stale{border-color:#B8352A}section.copied{border-color:#1B2A26}
header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}header span{color:#66756E}header em{font-style:normal;margin-left:auto}
button{font:inherit;font-weight:700;padding:6px 18px;border:0;border-radius:6px;background:#B8352A;color:#fff;cursor:pointer}
pre{white-space:pre-wrap;word-break:break-word;font:14px/1.6 ui-monospace,monospace;margin:10px 0 0}
</style>
<h1>${esc(script.title)} — AI Studio 음성 (남은 컷 ${todo.length} / ${cuts.length})</h1>
<ol>
<li><a href="https://aistudio.google.com/generate-speech" target="_blank">AI Studio 음성 생성</a>을 열고 <b>여러 화자(Multi-speaker)</b> 모드로 둔다. Speaker 1(아빠)과 Speaker 2(아이)의 목소리를 한 번 고르고, 끝까지 바꾸지 않는다.</li>
<li>아래 컷의 <b>복사</b>를 누르고, 대본 칸(Raw structure)을 비운 뒤 붙여넣어 생성한다.</li>
<li>받은 파일을 카드에 적힌 이름(예: <code>c01.wav</code>)으로 바꿔 <code>video/voice-studio/${episode}/</code> 에 넣는다.</li>
<li>다 넣었으면(일부만 넣어도 된다) <code>npm run voice -- ${episode} split</code> — 줄마다 자르고 타이밍을 맞춘다.</li>
</ol>
${cards.join("\n")}
<script>
for (const b of document.querySelectorAll("button")) b.onclick = async () => {
  const card = b.closest("section"), text = card.querySelector("pre").textContent;
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement("textarea"); t.value = text; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
  card.classList.add("copied"); b.textContent = "복사됨";
};
</script></html>
`,
  );
  console.log(`out/${episode}/voice-studio.html — 남은 컷 ${todo.length} / ${cuts.length}${todo.length ? `: ${todo.map((c) => c.id).join(", ")}` : ""}`);
} else if (mode === "split") {
  mkdirSync(voiceDir, { recursive: true });
  const lock = readLock();
  const done = [];
  const waiting = [];
  for (const cut of script.cuts) {
    if (!cut.lines.length) continue;
    const file = join(studioDir, `${cut.id}.wav`);
    const fresh = lock[cut.id]?.text === cutHash(cut);
    const stamp = existsSync(file) ? statSync(file).mtimeMs : null;
    // 원본이 없거나, 대사는 바뀌었는데 원본은 예전 것 그대로다
    if (!stamp || lock[cut.id]?.wav === stamp) {
      if (!fresh) waiting.push(cut.id);
      continue;
    }
    const wav = readWav(file);
    let result;
    try {
      result = splitWav(wav, cut.lines.length);
    } catch (e) {
      throw new Error(`${cut.id}.wav: ${e.message}. 다시 생성하거나, 줄마다 직접 잘라 public/${episode}/voice 에 넣는다`);
    }
    // 줄 수가 줄었을 때 남는 옛 파일을 지운다
    for (const name of readdirSync(voiceDir)) if (name.startsWith(`${cut.id}-`)) rmSync(join(voiceDir, name));
    console.log(`${cut.id}${result.unsure ? "  ⚠ 줄 경계가 애매하다. 아래 길이가 대사와 맞는지 확인" : ""}`);
    result.pieces.forEach((data, i) => {
      writeWav(join(voiceDir, `${cut.id}-${i}.wav`), wav, data);
      console.log(`  ${(data.length / wav.byteRate).toFixed(1).padStart(5)}초  ${spoken(cut.lines[i]).slice(0, 40)}`);
    });
    lock[cut.id] = { text: cutHash(cut), wav: stamp };
    done.push(cut.id);
  }
  if (!done.length) console.log(`video/voice-studio/${episode}/ 에 새로 받은 <컷id>.wav 가 없다.`);
  if (done.length) {
    writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
    writeTiming();
  }
  if (waiting.length) console.log(`아직 AI Studio 음성이 없거나 대사가 바뀐 컷: ${waiting.join(", ")}`);
  if (!script.rawVoice) console.log(`⚠ src/${episode}/script.json 맨 위에 "rawVoice": true 를 넣어야 목소리 변조가 꺼진다.`);
} else {
  writeTiming();
}
