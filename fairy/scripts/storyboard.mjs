// story.json + 연출 표 → books/<slug>/storyboard.html  (콘티 시트 · 녹음 대본)
// 사용: npm run storyboard -- 01-real-hero
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sketch } from './sketch.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const dir = path.join(root, 'books', slug);
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'plan.json'), 'utf8'));
// 음성이 만들어져 있으면(npm run voice) 실제 길이와 재생기를 넣는다
const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const timing = readJson(path.join(dir, 'voice', 'timing.json'));
const vcfg = readJson(path.join(dir, 'voice.json'));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// 엄마 낭독 속도: 글자당 약 0.22초 + 장면 앞뒤 숨 1.2초
const chars = (s) => [...s.narration, ...s.dialogue.map((d) => d.line)].join('').replace(/\s/g, '').length;
const secs = (s) => (timing ? Math.round(timing.scenes[s.no].sec) : Math.max(plan.scenes[s.no]?.min ?? 0, Math.round(chars(s) * 0.22 + 1.2)));

let total = 0;
const cards = story.scenes
  .map((s) => {
    const p = plan.scenes[s.no] ?? {};
    const sec = secs(s);
    total += sec;
    const narr = s.narration.map((l) => `<p class="n">${esc(l)}</p>`).join('');
    const dia = s.dialogue.map((d) => `<p class="d d-${esc(d.who)}"><b>${esc(d.who)}</b> “${esc(d.line)}”</p>`).join('');
    return `
<article class="cut" id="s${s.no}" data-start="${timing?.scenes[s.no].start ?? ''}">
  <div class="left"><div class="pic" style="--h:${p.hue ?? 40}">
    <span class="no">#${s.no}</span>
    <span class="len">${sec}초</span>
    ${sketch(s.no, p.cam)}
  </div>
  <p class="dir">그림 지시: ${esc(s.art)}</p></div>
  <div class="txt">
    <h3>장면 ${s.no} <small>${esc(p.title ?? '')}</small></h3>
    ${narr || '<p class="mute">(낭독 없음 — 그림과 소리만)</p>'}${dia}
    ${timing?.scenes[s.no].file ? `<audio controls preload="none" src="voice/${timing.scenes[s.no].file}"></audio>` : ''}
    <dl>
      <dt>구도</dt><dd>${esc(p.comp ?? '')}</dd>
      <dt>카메라</dt><dd>${esc(p.camera ?? '')}</dd>
      <dt>소리</dt><dd>${esc(p.sound ?? '')}</dd>
      <dt>분위기</dt><dd>${esc(p.mood ?? '')}</dd>
    </dl>
  </div>
</article>`;
  })
  .join('\n');

const rec = story.scenes
  .filter((s) => s.narration.length || s.dialogue.length)
  .map((s) => {
    const lines = [...s.narration, ...s.dialogue.map((d) => `(${d.who}) “${d.line}”`)];
    return `<tr><td>${String(s.no).padStart(2, '0')}</td><td>${lines.map(esc).join('<br>')}</td><td class="f">s${String(s.no).padStart(2, '0')}.wav</td></tr>`;
  })
  .join('\n');

const cast = vcfg
  ? Object.values(vcfg.roles).map((r) => `<li><b>${esc(r.name)}</b> ${esc(r.voice)} — ${esc(r.style)}</li>`).join('')
  : '';
const chars_ = plan.characters
  .map((c) => `<li><b>${esc(c.name)}</b> ${esc(c.look)}</li>`)
  .join('');

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(story.title)} — 콘티</title>
<style>
:root{--bg:#fbf6ea;--ink:#3b3228;--mute:#8a7b68;--card:#fffdf7;--line:#e6d9bf;--acc:#c0392b}
@media (prefers-color-scheme:dark){:root{--bg:#1d1a16;--ink:#f0e8d8;--mute:#a79a86;--card:#27231e;--line:#3d362d;--acc:#ff7b6b}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 "Pretendard","Malgun Gothic",sans-serif}
main{max-width:1000px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:28px;margin:8px 0 0}h2{margin:40px 0 12px;font-size:20px;border-bottom:2px solid var(--line);padding-bottom:6px}
.sub{color:var(--mute);margin:4px 0 0}
.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 18px}
.box ul{margin:0;padding-left:18px}
.cut{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;margin:0 0 16px}
.pic{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;
  background:radial-gradient(circle at 25% 30%,hsl(var(--h) 70% 85%),transparent 60%),radial-gradient(circle at 80% 70%,hsl(calc(var(--h) + 40) 55% 82%),transparent 55%),#f7efe0;
  border:2px dashed hsl(var(--h) 35% 65%);display:flex;align-items:center;justify-content:center;padding:14px}
.pic svg{display:block;width:100%;height:100%}.pic{padding:0;border-style:solid}.dir{margin:8px 0 0;font-size:12.5px;color:var(--mute)}.left{min-width:0}body.nocam .cam{display:none}.tools{margin:14px 0;font-size:14px}
.no{position:absolute;z-index:2;left:8px;top:22px;font-weight:700;color:#5a4a36;background:#fffa;border-radius:8px;padding:0 6px}.len{position:absolute;z-index:2;right:8px;bottom:6px;font-size:12px;background:#0002;border-radius:9px;padding:0 8px;color:#4a3d2e}
.player{position:sticky;top:6px;z-index:5;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center}.player audio{flex:1 1 320px;min-width:0}.player .sub{flex:1 1 100%;margin:0}.cut.on{outline:3px solid var(--acc)}.txt audio{width:100%;margin-top:10px;height:34px}
.txt h3{margin:0 0 6px;font-size:16px}.txt h3 small{color:var(--mute);font-weight:400;margin-left:6px}
.n{margin:0}.d{margin:2px 0;color:var(--acc)}.d b{color:var(--ink);margin-right:4px;font-size:13px}.mute{color:var(--mute);margin:0}
dl{margin:10px 0 0;font-size:13px;display:grid;grid-template-columns:48px 1fr;gap:2px 8px;color:var(--mute)}dt{font-weight:700}dd{margin:0}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line)}td{padding:8px 10px;border-top:1px solid var(--line);vertical-align:top}td:first-child{width:36px;color:var(--mute)}td.f{width:90px;font-family:monospace;font-size:12px;color:var(--mute)}
@media (max-width:700px){.cut{grid-template-columns:1fr}}
</style></head><body><main>
<h1>${esc(story.title)}</h1>
<p class="sub">글 ${esc(story.author)} · 엄마의 동화책 · 콘티 · ${story.scenes.length}장면 · 예상 ${Math.floor(total / 60)}분 ${total % 60}초</p>

<h2>한눈에</h2>
<div class="box"><ul>
<li><b>화풍</b> ${esc(plan.style)}</li>
<li><b>목소리</b> ${esc(plan.voice)}</li>
<li><b>화면</b> ${esc(plan.format)}</li>
</ul></div>

${timing ? `<h2>듣기 (엄마가 읽어 주는 동화)</h2>
<div class="box player"><audio id="all" controls preload="none" src="voice/all.wav"></audio>
<label><input type="checkbox" id="follow" checked> 재생 따라 카드 이동</label>
<p class="sub">전체 ${Math.floor(timing.total / 60)}분 ${Math.round(timing.total % 60)}초 · 서술은 엄마 목소리, 대사는 인물마다 다른 목소리 (장면 카드마다 따로 들을 수도 있어요)</p></div>
<h2>목소리</h2><div class="box"><ul>${cast}</ul></div>` : ''}
<h2>등장인물 (모든 그림에 같은 설명을 붙여 얼굴을 고정)</h2>
<div class="box"><ul>${chars_}</ul></div>

<h2>콘티</h2>
<p class="tools"><label><input type="checkbox" id="cam" checked> 카메라 프레임 표시 (파란 점선 = 시작, 빨간 실선 = 끝)</label> · 인물은 막대 인형 스케치입니다. 실제 그림은 나중에 수채화풍 크레용으로 만듭니다.</p>
${cards}

<h2>엄마 녹음 대본 (장면별 한 파일)</h2>
<p class="sub">서술은 차분한 엄마 목소리로, 괄호 안 대사는 같은 목소리에 감정만 살려 읽으면 됩니다.</p>
<table>${rec}</table>
</main><script>document.getElementById("cam").onchange=e=>document.body.classList.toggle("nocam",!e.target.checked)
const all=document.getElementById("all");if(all){const cuts=[...document.querySelectorAll(".cut")];let cur=null;
all.ontimeupdate=()=>{const t=all.currentTime;let hit=null;for(const c of cuts){if(+c.dataset.start<=t)hit=c}if(hit&&hit!==cur){cur&&cur.classList.remove("on");hit.classList.add("on");cur=hit;if(document.getElementById("follow").checked)hit.scrollIntoView({behavior:"smooth",block:"center"})}};
cuts.forEach(c=>c.querySelector(".pic").onclick=()=>{all.currentTime=+c.dataset.start;all.play()});
document.querySelectorAll(".txt audio").forEach(a=>a.onplay=()=>all.pause())}</script></body></html>
`;
fs.writeFileSync(path.join(dir, 'storyboard.html'), html);
console.log(`storyboard.html — ${story.scenes.length}장면, 약 ${total}초`);
