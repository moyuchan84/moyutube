// 편 폴더 music/*.wav (원본, git) → video/public/bgm/<이름>.wav (영상이 읽는 사본, git 제외). 하드링크라 디스크를 더 쓰지 않는다.
// studio · render 앞에 자동으로 돈다. wav 이름은 저장소 안에서 겹치지 않게 편 코드로 짓는다 (예: content/heat/music/heat.wav).
import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { VIDEO, units } from "./lib.mjs";

const out = join(VIDEO, "public", "bgm");
mkdirSync(out, { recursive: true });
const names = new Map();
let made = 0;
for (const u of units()) {
  const dir = join(u.dir, "music");
  if (!existsSync(dir)) continue;
  for (const n of readdirSync(dir).filter((f) => f.endsWith(".wav"))) {
    if (names.has(n)) throw new Error(`배경음악 이름이 겹친다: ${n} (${names.get(n)} · ${u.code})`);
    names.set(n, u.code);
    const src = join(dir, n);
    const dest = join(out, n);
    if (existsSync(dest)) {
      if (statSync(dest).ino === statSync(src).ino) continue;
      unlinkSync(dest);
    }
    try {
      linkSync(src, dest);
    } catch {
      copyFileSync(src, dest);
    }
    made++;
  }
}
let removed = 0;
for (const n of readdirSync(out)) if (n.endsWith(".wav") && !names.has(n)) (unlinkSync(join(out, n)), removed++);
console.log(`sync: 배경음악 ${names.size}개 (새로 놓음 ${made} · 지움 ${removed})`);
