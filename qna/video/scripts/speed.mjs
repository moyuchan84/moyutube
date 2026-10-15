// 배속 음성: script.json 의 "speed" 가 1이 아니면 public/<편>/voice/*.wav 를 음높이 그대로 빠르게 만든
// public/<편>/voice-x<speed>/ 를 만든다. 렌더할 때 배속(playbackRate)으로 돌리면 소리가 거칠어지므로 미리 만들어 둔다.
// 사용: node scripts/speed.mjs ep03
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { VIDEO } from "./art-lib.mjs";

const episode = process.argv[2] ?? "ep01";
const speed = JSON.parse(readFileSync(join(VIDEO, "src", episode, "script.json"), "utf8")).speed ?? 1;
if (speed !== 1) {
  const ffmpeg = join(VIDEO, "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
  const from = join(VIDEO, "public", episode, "voice");
  const to = join(VIDEO, "public", episode, `voice-x${speed}`);
  mkdirSync(to, { recursive: true });
  let made = 0;
  for (const name of readdirSync(from).filter((f) => f.endsWith(".wav"))) {
    const src = join(from, name);
    const dst = join(to, name);
    if (existsSync(dst) && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue;
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", src, "-af", `atempo=${speed}`, "-c:a", "pcm_s16le", dst]);
    made++;
  }
  console.log(`${speed}배속 음성: ${made}개 새로 만듦 → public/${episode}/voice-x${speed}/`);
}
