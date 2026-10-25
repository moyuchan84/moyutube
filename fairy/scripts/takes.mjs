// story.json → voice/takes.json (한 테이크 = 한 목소리: 장면 안에서 같은 화자가 이어지는 줄을 묶는다)
// 사용: node scripts/takes.mjs 02-maum-cafe
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '02-maum-cafe';
const dir = path.join(root, 'books', slug);
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const voice = JSON.parse(fs.readFileSync(path.join(dir, 'voice.json'), 'utf8'));

// 다람쥐1·2·3 은 한 목소리(Autonoe)로 읽는다
// voice.json 의 alias 로 화자 이름을 다른 배역에 합칠 수 있다 (예: 이름표 → narr)
const role = (who) => (voice.roles[who] ? who : voice.alias?.[who] ?? who.replace(/\d+$/, ''));

const takes = [];
for (const s of story.scenes) {
  const lines = [
    ...s.narration.map((t) => ({ who: 'narr', t })),
    ...s.dialogue.map((d) => ({ who: role(d.who), t: d.line })),
  ];
  let cur = null;
  let k = 0;
  for (const l of lines) {
    // 테이크 하나 = 한 목소리 (화자 바뀌면 새 테이크; 조립 때 장면 안에서 이어 붙인다)
    if (!cur || cur.voices[0] !== l.who) {
      cur = { id: `s${String(s.no).padStart(2, '0')}-${k++}`, scene: s.no, voices: [], lines: [] };
      takes.push(cur);
    }
    cur.lines.push(l);
    if (!cur.voices.includes(l.who)) cur.voices.push(l.who);
  }
}
fs.mkdirSync(path.join(dir, 'voice', 'raw'), { recursive: true });
fs.writeFileSync(path.join(dir, 'voice', 'takes.json'), JSON.stringify(takes, null, 1));
console.log(`${takes.length}개 테이크`);
for (const t of takes) console.log(t.id, t.voices.join('+'), t.lines.length + '줄');
