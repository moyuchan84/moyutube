// 첨부 없이(텍스트만) 쓰는 그림 프롬프트 한 장을 stdout 으로: node scripts/textprompt.mjs 02-maum-cafe p05
// Gemini 가 참고 그림 첨부를 거절해서, 첨부 문장을 빼고 화풍을 글로만 준다.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, id] = process.argv.slice(2);
const dir = path.join(root, 'books', slug);
const art = JSON.parse(fs.readFileSync(path.join(dir, 'art.json'), 'utf8'));
const a = art.scenes.find((s) => s.id === id);
if (!a) { console.error('없는 id: ' + id); process.exit(1); }
const style = art.style.replace('(copy the look from the attached style reference image)', '');
const neg = art.neg.replace("no copy of the reference's boy or white cat, ", '');
const out = [
  `Create a new children's picture book illustration. SCENE: ${a.desc}`,
  `COMPOSITION: ${a.comp}`,
  `BACKGROUND COLOR MOOD: ${a.bg}.`,
  '',
  'CHARACTERS IN THIS SCENE:',
  a.chars.map((c) => art.characters[c]).join('\n'),
  '',
  "Keep each character's face, colors and outfit exactly as described, identical on every page.",
  style,
  art.tail,
  neg,
].join('\n');
console.log(out);
