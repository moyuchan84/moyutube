// 음성 끝의 흰 잡음("칙") 제거: node scripts/voice-tail.mjs <편> [--backup <폴더>] [--dry]
//   Gemini 2.5 Flash TTS 는 대사 끝에 풀스케일에 가까운 흰 잡음을 붙이는 때가 있다 (고주파 2차 차분 RMS 가 보통 ~200 인데 끝에서 1만~4만).
//   voice.mjs 의 trim() 은 "소리가 있는 곳"을 남기기 때문에 이걸 못 지운다 → 끝에서부터 잡음이 이어지는 구간을 찾아 자르고 15ms 페이드아웃.
//   잡음이 없는 파일(3.8 계열 등)은 건드리지 않는다. 잘린 길이만큼 timings.json 도 새로 쓴다 (장면 · 자막 · BGM 이 그 길이를 쓴다).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const args = process.argv.slice(2);
const code = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--backup");
const dry = args.includes("--dry");
const bAt = args.indexOf("--backup");
const backup = bAt >= 0 ? args[bAt + 1] : null;
const dir = path.join(ROOT, "content", code);
const vdir = path.join(dir, "voice");
const tFile = path.join(dir, "script", "timings.json");
const timings = fs.existsSync(tFile) ? JSON.parse(fs.readFileSync(tFile, "utf8")) : {};
const RATE = 24000, HOP = 120, HF_NOISE = 8000, FADE = Math.round(RATE * 0.015);
if (backup && !dry) fs.mkdirSync(backup, { recursive: true });

for (const name of fs.readdirSync(vdir).filter((f) => /^L\d+\.wav$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))) {
  const f = path.join(vdir, name);
  const buf = fs.readFileSync(f);
  const n = (buf.length - 44) / 2;
  const x = (i) => buf.readInt16LE(44 + i * 2);
  const hf = (s) => { let a = 0; for (let i = s + 2; i < s + HOP; i++) { const d = x(i) - 2 * x(i - 1) + x(i - 2); a += d * d; } return Math.sqrt(a / (HOP - 2)); };
  // 끝에서부터 "잡음 또는 정확히 0인 디지털 무음"이 이어지는 구간의 시작.
  // 실제 패턴(파일마다 같다): 대사 끝 → 무음 → 잡음 ~40ms → 디지털 0 ~30ms → 잡음 ~90ms → 끝. 0 구간에서 멈추면 앞 잡음이 남는다.
  const zero = (s) => { for (let i = s; i < s + HOP; i++) if (x(i) !== 0) return false; return true; };
  let cut = n;
  for (let s = n - HOP; s >= 0 && (hf(s) > HF_NOISE || zero(s)); s -= HOP) cut = s;
  const id = name.slice(0, -4);
  if (cut === n) { console.log(id, "잡음 없음"); continue; }
  const keep = Math.max(FADE, cut);
  console.log(id, `끝 잡음 ${((n - cut) / RATE * 1000).toFixed(0)}ms 제거 · ${(n / RATE).toFixed(2)} → ${(keep / RATE).toFixed(2)}s`);
  if (dry) continue;
  if (backup) fs.copyFileSync(f, path.join(backup, name));
  const pcm = Buffer.from(buf.subarray(44, 44 + keep * 2));
  for (let i = 0; i < FADE; i++) { const k = keep - FADE + i; pcm.writeInt16LE(Math.round(pcm.readInt16LE(k * 2) * (1 - (i + 1) / FADE)), k * 2); }
  const h = Buffer.from(buf.subarray(0, 44));
  h.writeUInt32LE(36 + pcm.length, 4); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(f, Buffer.concat([h, pcm]));
  timings[id] = +(keep / RATE).toFixed(2);
}
if (!dry) fs.writeFileSync(tFile, JSON.stringify(timings, null, 2));
