// 롱폼 편집표(src/timeline.json) 에서 쇼츠(세로 1080x1920, 50초 안팎)용 장면 조각을 골라 src/short.json 을 만든다.
// 사용: npm run prep -- <slug>  →  node scripts/shorts.mjs <slug>  →  remotion render Short out/<slug>-short.mp4
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tl = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'timeline.json'), 'utf8'));
const slug = process.argv[2] || tl.slug;
if (tl.slug !== slug) throw new Error(`timeline.json 은 ${tl.slug} 입니다. 먼저 npm run prep -- ${slug}`);

// 자막 번호(장면을 가로질러 0 부터) 범위로 고른다. 줄 단위로 잘라야 문장이 끊기지 않는다.
const PICKS = {
  '01-real-hero': {
    hook: '망토만 두르면\n히어로가 될까요?',
    cta: '준이는 어떻게 진짜 히어로가 되었을까?',
    ranges: [[0, 3], [13, 14], [17, 18], [37, 38], [61, 61], [78, 80]],
  },
  '03-lost-found': {
    hook: '버려질까 봐\n빛을 잃은 필통',
    cta: '통통이는 다시 빛날 수 있을까? 끝까지 들어 보세요',
    ranges: [[0, 3], [13, 15], [64, 65], [137, 139], [147, 148], [154, 157]],
  },
  '02-maum-cafe': {
    hook: '내 마음은\n오늘 어떤 맛일까요?',
    cta: '마음카페 이야기, 끝까지 들어 보세요',
    ranges: [[0, 3], [6, 9], [19, 20], [38, 39], [45, 45], [83, 84]],
  },
}[slug];
if (!PICKS) throw new Error('PICKS 가 없는 책: ' + slug);

const flat = tl.scenes.flatMap((s) => s.subs.map((c) => ({ ...c, scene: s })));
const segs = PICKS.ranges.map(([a, b]) => {
  const first = flat[a], last = flat[b];
  const scene = first.scene;
  const from = +(Math.max(scene.start, first.from - 0.25)).toFixed(2);
  const to = +(Math.min(scene.end, last.to + 0.35)).toFixed(2);
  const img = scene.imgs.find((i) => i.from - 0.01 <= from && from < i.to)?.id ?? scene.imgs[0].id;
  const subs = flat.slice(a, b + 1).map((c) => ({ who: c.who, text: c.text, from: +(c.from - from).toFixed(2), to: +(Math.min(c.to, to) - from).toFixed(2) }));
  return { no: scene.no, from, to, dur: +(to - from).toFixed(2), img, scene: { start: scene.start, end: scene.end, cam: scene.cam }, subs };
});
const body = segs.reduce((n, s) => n + s.dur, 0);
const CTA = 3.5;
const out = { slug, look: tl.look, audio: tl.audio, fps: tl.fps, width: 1080, height: 1920, hook: PICKS.hook, cta: PICKS.cta, ctaSec: CTA, total: +(body + CTA).toFixed(2), segs };
fs.writeFileSync(path.join(here, '..', 'src', 'short.json'), JSON.stringify(out, null, 1));
console.log(`short.json — ${slug} · 조각 ${segs.length}개 · 본편 ${body.toFixed(1)}초 + 끝 ${CTA}초 = ${out.total}초`);
segs.forEach((s) => console.log(`  장면 ${s.no} ${s.from}~${s.to} (${s.dur}s) ${s.img}`));
