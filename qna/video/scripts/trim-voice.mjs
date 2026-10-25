// 대사 음성의 앞뒤 무음을 잘라 낸다 (모답맨: AI Studio 음성은 앞뒤에 평균 0.5초 무음이 붙어 템포가 늘어진다).
// 사용: node scripts/trim-voice.mjs epNN   → 편 폴더 voice/*.wav 를 그 자리에서 자른다 (말 앞뒤 0.06초는 남김)
// 그다음: node scripts/voice.mjs epNN (timing.json) → node scripts/speed.mjs epNN (배속 파일)
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { argCode, publicDir, voiceDir } from "./art-lib.mjs";
import { syncUnit } from "./sync.mjs";

const episode = argCode(process.argv[2], "사용: node scripts/trim-voice.mjs");
const dir = voiceDir(episode);
const THRESHOLD = 0.03; // 최대 음량의 이 비율보다 작으면 무음
const KEEP = 0.06; // 말 앞뒤에 남기는 여유 (초)

let cut = 0;
for (const name of readdirSync(dir).filter((f) => f.endsWith(".wav"))) {
  const file = join(dir, name);
  const buf = readFileSync(file);
  // voice-studio 수신기 · voice.mjs 가 쓰는 44바이트 헤더의 16비트 모노 WAV 만 다룬다
  if (buf.toString("ascii", 36, 40) !== "data" || buf.readUInt16LE(22) !== 1 || buf.readUInt16LE(34) !== 16) throw new Error(`${name}: 44바이트 헤더 16비트 모노 WAV 가 아니다`);
  const rate = buf.readUInt32LE(24);
  const pcm = buf.subarray(44);
  const s = new Int16Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.length));
  const peak = s.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  let a = 0;
  while (a < s.length && Math.abs(s[a]) < peak * THRESHOLD) a++;
  let z = s.length - 1;
  while (z > a && Math.abs(s[z]) < peak * THRESHOLD) z--;
  a = Math.max(0, a - Math.round(rate * KEEP));
  z = Math.min(s.length, z + Math.round(rate * KEEP));
  if (a === 0 && z === s.length) continue;
  const out = Buffer.from(s.slice(a, z).buffer);
  const head = Buffer.from(buf.subarray(0, 44));
  head.writeUInt32LE(36 + out.length, 4);
  head.writeUInt32LE(out.length, 40);
  writeFileSync(file, Buffer.concat([head, out]));
  cut += (s.length - (z - a)) / rate;
}
// 배속 파일은 원본보다 새것이면 다시 안 만들므로 지워 둔다
for (const name of readdirSync(publicDir(episode))) if (name.startsWith("voice-x")) rmSync(publicDir(episode, name), { recursive: true });
syncUnit(episode);
console.log(`${episode}: 무음 ${cut.toFixed(1)}초 잘라 냄 → 이제 node scripts/voice.mjs ${episode} && node scripts/speed.mjs ${episode}`);
