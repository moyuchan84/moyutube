// voice.json + voice/takes.json → books/<slug>/TTS_SCRIPT.md  (AI Studio generate-speech 에 붙여 넣을 테이크별 대본)
// 사용: node scripts/takes.mjs 03-lost-found && node scripts/ttsdoc.mjs 03-lost-found   (호출 없음 — 문서만 만든다)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '03-lost-found';
const dir = path.join(root, 'books', slug);
const voice = JSON.parse(fs.readFileSync(path.join(dir, 'voice.json'), 'utf8'));
const takes = JSON.parse(fs.readFileSync(path.join(dir, 'voice', 'takes.json'), 'utf8'));
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));

const cast = Object.entries(voice.roles)
  .map(([k, r]) => `| ${k === 'narr' ? '서술' : k} | ${r.name} | **${r.voice}** | ${r.style} |`)
  .join('\n');

const blocks = takes
  .map((t) => {
    const r = voice.roles[t.voices[0]];
    return `### ${t.id}  · 장면 ${t.scene} · ${r.name} (${r.voice})
- Style: ${r.style}
- 대본 (그대로 붙여 넣기):

\`\`\`
${t.lines.map((l) => l.t).join('\n')}
\`\`\`
`;
  })
  .join('\n');

const md = `# ${story.title} — TTS 대본 (Gemini TTS · AI Studio)

테이크 ${takes.length}개. **한 테이크 = 한 목소리.** AI Studio generate-speech 에서 Speaker 하나를 고르고, Style 칸에 아래 Style 을, 본문에 대본을 붙여 넣은 뒤 Run. 받은 파일은 \`voice/raw/<id>.wav\` 로 저장하고 \`npm run voice -- ${slug}\` 로 조립한다. (한글은 이스케이프 말고 그대로 타이핑. 한 번에 테이크 3개 넘기면 시간 초과.)

## 목소리 배역 (제안 — 아직 듣고 확정하지 않음)
| 화자 | 배역 | 목소리 | Style |
|---|---|---|---|
${cast}

${blocks}`;
fs.writeFileSync(path.join(dir, 'TTS_SCRIPT.md'), md);
console.log(`TTS_SCRIPT.md — ${takes.length}개 테이크`);
