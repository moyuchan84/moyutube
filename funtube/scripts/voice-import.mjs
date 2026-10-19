// AI Studio(Speech Playground)에서 내려받은 대사 음성을 영상에 넣는다.
// 사용법: node scripts/voice-import.mjs <에피소드ID> <대사번호> [wav 파일]
// 파일을 생략하면 다운로드 폴더에서 가장 최근 "Generated Audio*.wav" 를 가져온다 (가져온 뒤 원본은 지운다).
// 앞뒤 무음을 자르고 public/audio/<id>/<번호>.wav 로 저장, src/generated/timings.json 의 길이를 실제 길이로 바꾼다.
// hash 는 tts.mjs 와 같은 방식이라, 대사 · 목소리 · style 을 고치지 않는 한 tts.mjs 가 덮어쓰지 않는다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const TIMINGS = path.join(ROOT, "src/generated/timings.json");
const MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts"; // tts.mjs 의 hash 와 맞추기 위한 값
const RATE = 24000;

const [id, idxArg, fileArg] = process.argv.slice(2);
const idx = Number(idxArg);
const episodes = JSON.parse(fs.readFileSync(path.join(ROOT, "content/episodes.json"), "utf8"));
const ep = episodes[id];
if (!ep || !ep.lines[idx]) throw new Error(`대사 없음: ${id} ${idxArg}`);
const line = ep.lines[idx];
const voice = ep.voices[line.who];
if (!voice) throw new Error(`목소리 없는 줄: ${id} ${idx} (${line.who})`);

let src = fileArg;
if (!src) {
  const dl = path.join(os.homedir(), "Downloads");
  const found = fs.readdirSync(dl).filter((f) => f.startsWith("Generated Audio") && f.endsWith(".wav"))
    .map((f) => path.join(dl, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!found.length) throw new Error("다운로드 폴더에 Generated Audio*.wav 가 없음");
  src = found[0];
}

// wav 에서 data 청크를 찾아 PCM 만 꺼낸다 (24kHz 16bit mono 가정)
const buf = fs.readFileSync(src);
if (buf.readUInt32LE(24) !== RATE || buf.readUInt16LE(22) !== 1 || buf.readUInt16LE(34) !== 16) throw new Error("24kHz 16bit mono wav 가 아님");
let off = 12, pcm;
while (off < buf.length) {
  const tag = buf.toString("ascii", off, off + 4), size = buf.readUInt32LE(off + 4);
  if (tag === "data") { pcm = buf.subarray(off + 8, off + 8 + size); break; }
  off += 8 + size;
}

function trimSilence(p, threshold = 500, pad = RATE * 0.05) {
  const n = p.length / 2;
  let s = 0, e = n - 1;
  while (s < n && Math.abs(p.readInt16LE(s * 2)) < threshold) s++;
  while (e > s && Math.abs(p.readInt16LE(e * 2)) < threshold) e--;
  s = Math.max(0, s - pad); e = Math.min(n - 1, e + pad);
  return p.subarray(Math.floor(s) * 2, (Math.floor(e) + 1) * 2);
}
function wav(p) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + p.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(p.length, 40);
  return Buffer.concat([h, p]);
}

const trimmed = trimSilence(pcm);
const rel = `audio/${id}/${idx}.wav`;
fs.mkdirSync(path.dirname(path.join(ROOT, "public", rel)), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public", rel), wav(trimmed));

const say = line.say ?? line.text.replace(/\p{Extended_Pictographic}/gu, "").trim();
const hash = crypto.createHash("md5").update([MODEL, voice, line.style, say].join("|")).digest("hex").slice(0, 10);
const timings = JSON.parse(fs.readFileSync(TIMINGS, "utf8"));
const dur = +(trimmed.length / 2 / RATE).toFixed(3);
timings[id][idx] = { file: rel, dur, hash, src: "aistudio" };
fs.writeFileSync(TIMINGS, JSON.stringify(timings, null, 2));
if (!fileArg) fs.rmSync(src);
console.log(`${id} ${idx} ${line.who}: ${say} → ${dur}s`);
