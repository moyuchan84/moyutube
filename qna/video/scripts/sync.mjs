// 편 폴더(content/<편>/)의 음성 · 컷 그림을 영상이 읽는 video/public/<code>/ 로 옮겨 둔다.
// 원본은 content 쪽(git)이고 public/<code>/ 는 다시 만들 수 있는 사본이다(git 제외). 하드링크라 디스크를 더 쓰지 않는다.
//   node scripts/sync.mjs           모든 편
//   node scripts/sync.mjs ep10      그 편만
// studio · render 앞에 자동으로 돈다 (package.json 의 prestudio · prerender). 음성 도구도 끝날 때 부른다.
import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { codes, publicDir, unitPath } from "./art-lib.mjs";

// 편 폴더 안 → public/<code>/ 안 (그 폴더의 파일만, 하위 폴더 studio · raw 는 옮기지 않는다)
const MAP = [
  { from: "voice", to: "voice", ext: /\.wav$/ },
  { from: "art/cuts", to: "cuts", ext: /\.(png|jpe?g|webp)$/ }, // 1편 롱폼의 컷 그림
];

const place = (src, dest) => {
  if (existsSync(dest)) {
    if (statSync(dest).ino === statSync(src).ino) return false;
    unlinkSync(dest);
  }
  try {
    linkSync(src, dest);
  } catch {
    copyFileSync(src, dest); // 다른 드라이브면 복사
  }
  return true;
};

export const syncUnit = (code) => {
  let made = 0;
  let removed = 0;
  for (const m of MAP) {
    const from = unitPath(code, m.from);
    const to = publicDir(code, m.to);
    const names = existsSync(from) ? readdirSync(from).filter((n) => m.ext.test(n) && statSync(join(from, n)).isFile()) : [];
    if (names.length) mkdirSync(to, { recursive: true });
    for (const n of names) if (place(join(from, n), join(to, n))) made++;
    // 원본에서 지운 파일은 사본에서도 지운다
    if (existsSync(to)) for (const n of readdirSync(to)) if (m.ext.test(n) && !names.includes(n)) (unlinkSync(join(to, n)), removed++);
  }
  return { made, removed };
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const only = process.argv.slice(2);
  let made = 0;
  let removed = 0;
  for (const code of only.length ? only : codes()) {
    const r = syncUnit(code);
    made += r.made;
    removed += r.removed;
  }
  console.log(`sync: 새로 놓음 ${made} · 지움 ${removed}`);
}
