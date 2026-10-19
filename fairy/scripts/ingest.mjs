// 원고 PDF → books/<slug>/story.json  (장면별 서술 · 대사 · 그림 지시)
// 사용: npm run ingest -- 01-real-hero
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const pdf = path.join(root, 'source', `${slug}.pdf`);

const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdf)) }).promise;
let text = '';
for (let i = 1; i <= doc.numPages; i++) {
  const t = await (await doc.getPage(i)).getTextContent();
  text += t.items.map((x) => x.str + (x.hasEOL ? '\n' : '')).join('') + '\n';
}

const SPEAKERS = ['준이', '친구', '선호', '민지'];
// 화자 표시가 없는 따옴표 대사: 기본은 준이, 예외만 적는다
const SPEAKER_BY_START = { '선호야': '민지', '고마워': '선호' };
const unq = (s) => s.replace(/^[“"”]+|[“"”]+$/g, '').trim();

const body = text.split(/\n(?=#\d+\.?\s*\n)/);
const title = text.match(/《(.+?)》/)?.[1] ?? slug;
const author = text.match(/》\s*\n(.+)\n/)?.[1]?.trim() ?? '';

const scenes = [];
for (const block of body) {
  const m = block.match(/^#(\d+)\.?\s*\n([\s\S]*)$/);
  if (!m) continue;
  let rest = m[2];
  const art = (rest.match(/<그림:([\s\S]*?)>/)?.[1] ?? '').replace(/\s*\n\s*/g, '').trim();
  rest = rest.replace(/<그림:[\s\S]*?>/, '');
  const narration = [];
  const dialogue = [];
  let open = null; // 따옴표가 아직 안 닫힌 대사: 다음 줄을 이어 붙인다
  for (const raw of rest.split('\n').map((l) => l.trim()).filter(Boolean)) {
    if (open) {
      open.line += ' ' + unq(raw);
      if (/[“"”]$/.test(raw)) open = null;
      continue;
    }
    const lab = raw.match(new RegExp(`^(${SPEAKERS.join('|')}):\\s*(.*)$`));
    if (lab) {
      dialogue.push({ who: lab[1], line: unq(lab[2]) });
      if (!/[“"”]$/.test(raw)) open = dialogue.at(-1);
    } else if (/^[“"]/.test(raw)) {
      const line = unq(raw);
      const who = Object.entries(SPEAKER_BY_START).find(([k]) => line.startsWith(k))?.[1] ?? '준이';
      dialogue.push({ who, line });
      if (!/[“"”]$/.test(raw)) open = dialogue.at(-1);
    } else {
      narration.push(raw);
    }
  }
  scenes.push({ no: Number(m[1]), narration, dialogue, art });
}

const out = path.join(root, 'books', slug, 'story.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ title, author, scenes }, null, 2) + '\n');
console.log(`${slug}: ${scenes.length}장면 → ${path.relative(root, out)}`);
