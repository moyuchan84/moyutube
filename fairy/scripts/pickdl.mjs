// 크롬이 받은 Gemini 그림(다운로드 폴더의 가장 새 Gemini_Generated_Image_*.png)을 books/<slug>/art/<id>.png 로 옮긴다.
// 사용: node scripts/pickdl.mjs 02-maum-cafe cast
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, id] = process.argv.slice(2);
const dl = path.join(os.homedir(), 'Downloads');
const files = fs
  .readdirSync(dl)
  .filter((f) => /^Gemini_Generated_Image.*\.png$/i.test(f))
  .map((f) => ({ f, t: fs.statSync(path.join(dl, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t);
if (!files.length) { console.error('다운로드된 Gemini 그림이 없음'); process.exit(1); }
if (Date.now() - files[0].t > 120000) { console.error('가장 새 파일이 2분 넘게 오래됨: ' + files[0].f); process.exit(1); }
const out = path.join(root, 'books', slug, 'art', `${id}.png`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(path.join(dl, files[0].f), out);
fs.unlinkSync(path.join(dl, files[0].f));
console.log(`${id}.png ← ${files[0].f} (${(fs.statSync(out).size / 1e6).toFixed(1)}MB)`);
