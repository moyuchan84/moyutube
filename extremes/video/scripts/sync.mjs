// 편 폴더의 사진(art/) · 배경음악(music/*.wav) → video/public/ 사본 (git 제외). studio · render 앞에 자동으로 돈다.
//   content/<편>/art/*   → public/art/<code>/*
//   content/<편>/music/<code>.wav → public/bgm/<code>.wav
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { VIDEO, units } from "./lib.mjs";

let n = 0;
for (const u of units()) {
  const art = join(u.dir, "art");
  if (existsSync(art)) {
    const to = join(VIDEO, "public", "art", u.code);
    mkdirSync(to, { recursive: true });
    for (const f of readdirSync(art)) (copyFileSync(join(art, f), join(to, f)), n++);
  }
  const voice = join(u.dir, "voice");
  if (existsSync(voice)) {
    const to = join(VIDEO, "public", "voice", u.code);
    mkdirSync(to, { recursive: true });
    for (const f of readdirSync(voice)) (copyFileSync(join(voice, f), join(to, f)), n++);
  }
  const music = join(u.dir, "music");
  if (existsSync(music)) {
    mkdirSync(join(VIDEO, "public", "bgm"), { recursive: true });
    for (const f of readdirSync(music).filter((f) => f.endsWith(".wav"))) (copyFileSync(join(music, f), join(VIDEO, "public", "bgm", f)), n++);
  }
}
console.log(`sync: 파일 ${n}개 → public/`);
