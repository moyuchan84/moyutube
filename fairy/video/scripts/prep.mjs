// 렌더 전 준비: 그림 PNG(8~10MB) → public/art/<slug>/*.jpg, 편집표(timeline.json), 음악 · 효과음 섞기(public/audio/<slug>.wav)
// 사용: npm run prep            (01-real-hero)
//       npm run prep -- 02-maum-cafe
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const slug = process.argv[2] || '01-real-hero';
const art = path.join(root, '..', 'books', slug, 'art');
const out = path.join(root, 'public', 'art', slug);
fs.mkdirSync(out, { recursive: true });
const bin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');

for (const f of fs.readdirSync(art).filter((x) => x.endsWith('.png'))) {
  const dst = path.join(out, f.replace('.png', '.jpg'));
  if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs > fs.statSync(path.join(art, f)).mtimeMs) continue;
  execFileSync(bin, ['ffmpeg', '-y', '-loglevel', 'error', '-i', path.join(art, f), '-q:v', '3', dst], { shell: true, stdio: 'inherit', cwd: root });
  console.log('그림', f);
}
execFileSync('node', [path.join(here, 'timeline.mjs'), slug], { stdio: 'inherit' });
execFileSync('node', [path.join(here, 'bgm.mjs'), slug], { stdio: 'inherit' });
