// story.json + plan.json → books/<slug>/SCENARIO.md (시나리오 · 연출 콘티 문서)
// 사용: npm run scenario -- 02-maum-cafe
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '02-maum-cafe';
const dir = path.join(root, 'books', slug);
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'plan.json'), 'utf8'));

const chars = (s) => [...s.narration, ...s.dialogue.map((d) => d.line)].join('').replace(/\s/g, '').length;
const secs = (s) => Math.max(plan.scenes[s.no]?.min ?? 0, Math.round(chars(s) * 0.22 + 1.2));
let t = 0;
const rows = story.scenes.map((s) => {
  const sec = secs(s);
  const at = t;
  t += sec;
  return { s, sec, at };
});
const mmss = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;

const blocks = rows
  .map(({ s, sec, at }) => {
    const p = plan.scenes[s.no];
    const lines = [...s.narration.map((l) => `- 🎙️ (서술) ${l}`), ...s.dialogue.map((d) => `- **${d.who}** “${d.line}”`)].join('\n');
    return `### 장면 ${s.no}. ${p.title}  \`${mmss(at)}\` · ${sec}초 · 원고 ${s.ref}

${lines}

| | |
|---|---|
| 그림 | ${s.art} |
| 구도 | ${p.comp} |
| 카메라 | ${p.camera} |
| 소리 | ${p.sound} |
| 분위기 | ${p.mood} |
`;
  })
  .join('\n');

const md = `# ${story.title} — 시나리오 · 연출 콘티

글 ${story.author} · ${story.scenes.length}장면 · 예상 ${mmss(t)} · 가로 16:9 롱폼

- **화풍** ${plan.style}
- **목소리** ${plan.voice}
- **화면** ${plan.format}

## 등장인물
${plan.characters.map((c) => `- **${c.name}** ${c.look}`).join('\n')}

## 시나리오 · 연출 콘티
${blocks}
`;
fs.writeFileSync(path.join(dir, 'SCENARIO.md'), md);
console.log(`SCENARIO.md — ${story.scenes.length}장면, 약 ${mmss(t)}`);
