// 업로드 자료: 한국어 · 영어 자막(SRT)과 설명 문서를 books/<slug>/upload/ 에 만든다. (썸네일은 npx remotion still Thumb …)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const up = path.join(here, '..', '..', 'books', '01-real-hero', 'upload');
const tl = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'timeline.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(up, 'en.json'), 'utf8'));
const subs = tl.scenes.flatMap((s) => s.subs);
if (subs.length !== en.length) throw new Error(`자막 ${subs.length}줄 ≠ 영어 ${en.length}줄`);

const tc = (t) => {
  const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const srt = (texts) =>
  subs.map((c, i) => `${i + 1}\n${tc(c.from)} --> ${tc(Math.max(c.from + 0.4, c.to - 0.05))}\n${texts[i]}\n`).join('\n');
fs.writeFileSync(path.join(up, 'ko.srt'), srt(subs.map((c) => (c.who === 'narr' ? c.text : `“${c.text}”`))));
fs.writeFileSync(path.join(up, 'en.srt'), srt(en));

// 챕터 (유튜브는 첫 줄이 0:00 이어야 한다)
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const ENT = ['Cartoon hero on TV', 'Sleeping in a cape', 'Running to school', 'Cutting in line', 'Board game tantrum', 'Alone on the swing', 'Laser beam?!', 'Min-ji arrives', 'Just like a hero', 'The droopy cape', 'The secret notebook', 'Losing at dodgeball', 'Congratulations!', 'Making room in line', 'A little bit of a hero', 'True power'];
const chapters = [[0, '표지 · TV 속 히어로', 'Cover · Cartoon hero on TV'], ...tl.scenes.filter((s) => s.no > 0 && s.no <= 15).map((s) => [s.start - 0.5, s.title, ENT[s.no]])];
fs.writeFileSync(path.join(up, 'chapters.json'), JSON.stringify(chapters.map(([t, k, e]) => ({ at: mmss(Math.max(0, t)), ko: k, en: e })), null, 1));
console.log(`ko.srt · en.srt ${subs.length}줄, 챕터 ${chapters.length}개`);
