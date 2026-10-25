// 동화책 편집표: 장면 시작 · 카메라 · 그림 · 자막(줄마다 시각)을 src/timeline.json 으로 만든다.
// 소리 길이는 voice/timing.json(장면별 테이크 위치)과 raw 파일의 무음 구간으로 맞춘다.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2] || '01-real-hero';
const book = path.join(here, '..', '..', 'books', slug);
const story = JSON.parse(fs.readFileSync(path.join(book, 'story.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(book, 'plan.json'), 'utf8'));
const timing = JSON.parse(fs.readFileSync(path.join(book, 'voice', 'timing.json'), 'utf8'));
const takes = JSON.parse(fs.readFileSync(path.join(book, 'voice', 'takes.json'), 'utf8'));

export const FPS = 30;
export const INTRO = 6; // 표지 + 제목
export const OUTRO = 9; // 끝 카드
const RATE = 24000;

const pcm = (file) => {
  const b = fs.readFileSync(file);
  const at = b.indexOf('data');
  return b.subarray(at + 8, at + 8 + b.readUInt32LE(at + 4));
};
// voice.mjs 의 trim 과 같아야 위치가 맞는다
const trim = (b) => {
  const s = (i) => Math.abs(b.readInt16LE(i));
  let a = 0, z = b.length - 2;
  while (a < z && s(a) < 200) a += 2;
  while (z > a && s(z) < 200) z -= 2;
  const pad = Math.round(0.04 * RATE) * 2;
  return b.subarray(Math.max(0, a - pad), Math.min(b.length, z + pad));
};
// 10ms 창 단위 무음 구간 [시작초, 끝초]
const pauses = (b, minSec = 0.14) => {
  const win = Math.round(RATE * 0.01), out = [];
  let run = null;
  for (let i = 0; i + win * 2 <= b.length; i += win * 2) {
    let m = 0;
    for (let j = 0; j < win; j++) m = Math.max(m, Math.abs(b.readInt16LE(i + j * 2)));
    const t = i / 2 / RATE;
    if (m < 400) { if (!run) run = t; }
    else if (run !== null) { if (t - run >= minSec) out.push([run, t]); run = null; }
  }
  return out;
};
const weight = (t) => Math.max(3, t.replace(/[^가-힣a-zA-Z0-9]/g, '').length + 3 * (t.match(/[,.?!…]/g) ?? []).length);

// 한 테이크의 줄마다 [시작, 끝] (테이크 안 초)
const splitTake = (take) => {
  const d = trim(pcm(path.join(book, 'voice', 'raw', `${take.id}.wav`)));
  const dur = d.length / 2 / RATE;
  const w = take.lines.map((l) => weight(l.t));
  const sum = w.reduce((a, b) => a + b, 0);
  const ps = pauses(d);
  const cuts = [0];
  let acc = 0;
  for (let i = 0; i < w.length - 1; i++) {
    acc += w[i];
    const target = (acc / sum) * dur;
    let best = null;
    for (const [a, b] of ps) {
      const c = (a + b) / 2;
      if (Math.abs(c - target) < Math.max(1.2, dur * 0.12) && (!best || Math.abs(c - target) < Math.abs(best - target))) best = c;
    }
    cuts.push(Math.max(cuts[cuts.length - 1] + Math.min(0.9, dur / (w.length * 2)), best ?? target));
  }
  cuts.push(dur);
  return take.lines.map((l, i) => ({ ...l, from: cuts[i], to: cuts[i + 1] }));
};

// 긴 줄은 쉼표 · 공백에서 둘로 나눠 화면에 두 번에 보여 준다
const chunks = (line) => {
  const t = line.t;
  if (t.length <= 26) return [{ ...line, text: t }];
  const mid = t.length / 2;
  let best = -1;
  // 문장 부호에서 먼저, 없으면 공백에서 자른다
  for (const re of [/[,.?!…]/, / /]) {
    for (let i = 0; i < t.length - 1; i++) if (re.test(t[i]) && Math.abs(i - mid) < t.length * 0.35 && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    if (best >= 0) break;
  }
  if (best < 0) return [{ ...line, text: t }];
  while (best + 1 < t.length - 1 && /[,.?!…]/.test(t[best + 1])) best++; // 줄임표 · 느낌표가 이어지면 앞 조각에 붙인다
  const a = t.slice(0, best + 1).trim(), b = t.slice(best + 1).trim();
  if (!a || !b) return [{ ...line, text: t }];
  const r = a.length / (a.length + b.length), m = line.from + (line.to - line.from) * r;
  // 반쪽이 아직 길면 다시 나눈다 (긴 대사는 세 · 네 번에 나눠 보여 준다)
  return [...chunks({ ...line, t: a, to: m }), ...chunks({ ...line, t: b, from: m })];
};

const HERO = slug === '01-real-hero'; // 01 만의 사정: p14 · p15 대체 그림, 10 장면 네 컷
const ART = HERO ? { 14: 'p01', 15: 'p02' } : {}; // p14 · p15 그림이 아직 없을 때 쓸 대체 그림 (같은 침대 · 같은 등굣길)
const artFiles = fs.readdirSync(path.join(book, 'art'));
const has = (id) => artFiles.includes(`${id}.png`);
const pic = (n) => {
  const id = `p${String(n).padStart(2, '0')}`;
  return has(id) ? id : ART[n] ?? id;
};

const scenes = story.scenes.map((s) => {
  const tm = timing.scenes[s.no];
  const start = INTRO + tm.start;
  const subs = [];
  for (const t of takes.filter((k) => k.scene === s.no)) {
    const off = tm.takes.find((o) => o.take === t.id).at;
    for (const l of splitTake(t)) for (const c of chunks(l)) subs.push({ who: c.who, text: c.text, from: +(start + off + c.from).toFixed(2), to: +(start + off + c.to).toFixed(2) });
  }
  const p = plan.scenes[s.no] ?? {};
  let imgs;
  if (HERO && s.no === 10) {
    // 네 컷: 서술이 그 장면을 말하는 순간에 맞춰 그림을 바꾼다
    const find = (k) => subs.find((x) => x.text.includes(k))?.from ?? null;
    const dEnd = subs.find((x) => x.who === '민지')?.from ?? start + tm.sec - 5;
    imgs = [
      { id: 'p10a', from: start, to: (find('발표할') ?? start + 9) - 0.2 },
      { id: 'p10b', from: (find('발표할') ?? start + 9) - 0.2, to: (find('지는 팀') ?? start + 14) - 0.2 },
      { id: 'p10c', from: (find('지는 팀') ?? start + 14) - 0.2, to: dEnd - 0.6 },
      { id: 'p10d', from: dEnd - 0.6, to: start + tm.sec },
    ].map((x) => ({ ...x, from: +x.from.toFixed(2), to: +x.to.toFixed(2) }));
  } else imgs = [{ id: pic(s.no), from: start, to: +(start + tm.sec).toFixed(2) }];
  return { no: s.no, title: p.title ?? '', start: +start.toFixed(2), end: +(start + tm.sec).toFixed(2), cam: p.cam ?? [0, 0, 320, 180, 0, 0, 320, 180], imgs, subs, sound: p.sound ?? '' };
});

const end = scenes.at(-1).end;
// 책마다 다른 화면 꾸밈: 말하는 사람 색 · 표지 글자 색 · 끝 카드 문구
const LOOK = {
  '01-real-hero': { colors: { 준이: '#c0392b', 선호: '#2f6fa8', 민지: '#3c8a55', 친구: '#c9822b' }, thumb: [['진짜 히어로가', '#c0392b'], ['되는 법', '#2c3e63']], ink: '#2c3e63', endLine: '진짜 힘은 망토가 아니라, 그 안의 마음', tag: '엄마의 동화책', title: story.title },
  '02-maum-cafe': { colors: { 바라: '#8a5a2b', 나무늘보: '#a0622d', 사자: '#c98a12', 다람쥐: '#c0612b', 고슴도치: '#7a5a3c', 카멜레온: '#2f9a7a', 토끼: '#6a7fb0' }, thumb: [['내 마음 알아주는', '#8a5a2b'], ['마음카페', '#c0392b']], ink: '#5a3a1c', endLine: '어떤 마음이든, 언제든 환영합니다', tag: '엄마의 동화책', title: '내 마음 알아주는 마법레시피\n마음카페' },
  '03-lost-found': { colors: { 할아버지: '#6b4a2b', 공책: '#c0392b', 줄넘기: '#c9a227', 우산: '#2f6fa8', 잠바: '#7a5a8a', 필통: '#3c8a55', 도윤: '#2c3e63', 여자아이: '#d0607a', 아이: '#c9822b', 물건들: '#5a6a7a', 방송: '#444444' }, thumb: [['반짝! 분실물', '#e0a420'], ['보관함의 비밀', '#3a5a8a']], ink: '#2c3e63', endLine: '잃어버린 물건에도 마음이 있어요', tag: '엄마의 동화책', title: story.title },
}[slug];
const out = { slug, look: LOOK, audio: `audio/${slug}.wav`, fps: FPS, width: 1920, height: 1080, title: story.title, author: story.author, intro: INTRO, outro: OUTRO, total: +(end + OUTRO).toFixed(2), scenes };
fs.writeFileSync(path.join(here, '..', 'src', 'timeline.json'), JSON.stringify(out, null, 1));
console.log(`timeline.json — 장면 ${scenes.length} · 자막 ${scenes.reduce((a, s) => a + s.subs.length, 0)}줄 · ${out.total}초`);
if (HERO) for (const n of [14, 15]) if (!has(`p${n}`)) console.log(`※ art/p${n}.png 없음 → ${ART[n]} 로 대체`);
