// art.json + 앵커 화풍 → books/<slug>/GEMINI_PROMPTS.html (복사 버튼) · GEMINI_PROMPTS.md
// 사용: npm run prompts -- 01-real-hero      (호출 없음 — 프롬프트 문서만 만든다)
// 프롬프트는 장면을 맨 앞에 둔다: 앵커가 맨 앞에 길게 있으면 모델이 앵커 구도를 그대로 베낀다 (표지 시험에서 확인).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const dir = path.join(root, 'books', slug);
const art = JSON.parse(fs.readFileSync(path.join(dir, 'art.json'), 'utf8'));
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));

const STYLE =
  'Drawing style (copy from the attached anchor image): thin black ink outlines, pastel-crayon and colored-pencil hatching, loose vertical crayon strokes in the background on warm cream paper, comical slightly lumpy faces with puffy pink noses and lips, round pink cheeks, light freckles, stubby hands, tiny doodle details. Playful, warm picture-book feeling. No 3D, no gloss, no photo-realism.';

const REF =
  'The attached anchor image is ONLY a reference for the character designs and the drawing style. Do NOT copy its layout or pose; draw a completely different new scene as described. Keep the same faces, hair and clothes for each character.';

const TAIL =
  'Landscape 16:9. Keep the bottom 15% calm and uncluttered (subtitles go there) and keep faces away from the very edges.';

const NEG =
  'No text, no letters, no captions, no logos, no watermark, no real people, no existing cartoon characters, no extra main characters beyond those listed, no scary or truly tragic expressions, no extra fingers, no 3D, no anime.';

const sceneOf = (no) => story.scenes.find((s) => s.no === no);

const items = art.scenes.map((a) => {
  const cast = a.chars.map((c) => art.characters[c]).join('\n');
  const prompt = [
    `Create a new children's picture book illustration. SCENE: ${a.desc}`,
    `COMPOSITION: ${a.comp}`,
    `BACKGROUND COLOR MOOD: ${a.bg}.`,
    '',
    'CHARACTERS IN THIS SCENE (must match the anchor):',
    cast,
    '',
    REF,
    STYLE,
    TAIL,
    NEG,
  ].join('\n');
  const s = typeof a.scene === 'number' ? sceneOf(a.scene) : null;
  const text = s
    ? [...s.narration, ...s.dialogue.map((d) => `(${d.who}) “${d.line}”`)].join(' / ') || '(글 없음 — 그림과 소리만)'
    : '(표지 — 글 없음)';
  return { ...a, prompt, text };
});

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

const md =
  `# ${story.title} — Gemini 그림 프롬프트\n\n` +
  `장면마다 **새 대화**에서, \`art/anchor/style-anchor.png\` 를 첨부하고 프롬프트를 붙여 넣는다. 결과는 \`books/${slug}/art/<id>.png\` 로 저장.\n\n` +
  items.map((i) => `## ${i.id}  (장면 ${i.scene})\n> ${i.text}\n\n\`\`\`\n${i.prompt}\n\`\`\`\n`).join('\n');
fs.writeFileSync(path.join(dir, 'GEMINI_PROMPTS.md'), md);
fs.writeFileSync(path.join(dir, 'prompts.json'), JSON.stringify(items.map(({ id, prompt }) => ({ id, prompt })), null, 2));

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(story.title)} — 그림 프롬프트</title>
<style>
:root{--bg:#fbf6ea;--ink:#3b3228;--mute:#8a7b68;--card:#fffdf7;--line:#e6d9bf;--acc:#c0392b}
@media (prefers-color-scheme:dark){:root{--bg:#1d1a16;--ink:#f0e8d8;--mute:#a79a86;--card:#27231e;--line:#3d362d;--acc:#ff7b6b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.65 "Pretendard","Malgun Gothic",sans-serif}
main{max-width:860px;margin:0 auto;padding:22px 16px 80px}h1{font-size:24px;margin:6px 0}
.how{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 18px}.how li{margin:2px 0}
.cut{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:14px 0}
.cut h2{font-size:17px;margin:0 0 4px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.id{font-family:monospace;background:#0001;border-radius:8px;padding:0 8px}.txt{color:var(--mute);margin:0 0 8px;font-size:14px}
button{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--acc);color:#fff;border-radius:9px;padding:3px 14px}button.ok{background:#3a9a5b}
details{margin-top:6px}pre{white-space:pre-wrap;font:12.5px/1.55 ui-monospace,Consolas,monospace;background:#0001;border-radius:8px;padding:10px;margin:6px 0 0}
</style></head><body><main>
<h1>${esc(story.title)} — Gemini 그림 프롬프트</h1>
<ol class="how">
<li>Chrome 에서 Gemini 를 열고 <b>장면마다 새 대화</b>를 시작한다 (같은 대화에서 이어 보내면 앞 그림 구도를 따라간다).</li>
<li><b>이미지 만들기</b> 모드, 비율 <b>16:9</b>, 모델은 3.1 Pro 를 권한다. <b>style-anchor.png</b> 를 첨부한다 (<code>fairy/art/anchor/style-anchor.png</code>).</li>
<li>아래 [복사] 를 눌러 프롬프트를 붙여 넣고 요청한다. 여러 장 뽑아 가장 닮은 것을 고른다.</li>
<li><code>books/${slug}/art/&lt;id&gt;.png</code> 로 저장한다 (표지는 <code>cover.png</code>, 장면은 <code>p00.png</code> …).</li>
</ol>
${items
  .map(
    (i, n) => `<section class="cut"><h2><span class="id">${i.id}</span>${i.scene === 'cover' ? '표지' : `장면 ${i.scene}`}<button data-n="${n}">복사</button></h2>
<p class="txt">${esc(i.text)}</p><details><summary>프롬프트 보기</summary><pre id="p${n}">${esc(i.prompt)}</pre></details></section>`,
  )
  .join('\n')}
<script>
document.querySelectorAll('button[data-n]').forEach(b=>b.onclick=async()=>{
  const t=document.getElementById('p'+b.dataset.n).textContent;
  try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}
  b.textContent='복사됨';b.classList.add('ok');setTimeout(()=>{b.textContent='복사';b.classList.remove('ok')},1500)});
</script></main></body></html>
`;
fs.writeFileSync(path.join(dir, 'GEMINI_PROMPTS.html'), html);
console.log(`${items.length}개 프롬프트 → books/${slug}/GEMINI_PROMPTS.{html,md} · prompts.json`);
