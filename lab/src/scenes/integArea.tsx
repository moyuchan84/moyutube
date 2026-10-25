import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, punch, ring, sparks} from '../motion';
import {Axes, curve, px} from '../graph';
import type {Frame} from '../graph';

const NAME = 'integArea';
const F: Frame = {ox: -330, oy: 170, sx: 640, sy: 560};
const sq = (x: number) => x * x;
// 오른쪽 끝 높이로 n 개 막대: 넓이 = (n+1)(2n+1) / 6n²
const upper = (n: number) => ((n + 1) * (2 * n + 1)) / (6 * n * n);

function bars(n: number) {
  const w = F.sx / n;
  return Array.from({length: n}, (_, k) => {
    const hgt = sq((k + 1) / n) * F.sy;
    return (
      <Rect
        x={F.ox + w * (k + 0.5)}
        y={F.oy}
        offsetY={1}
        width={w}
        height={hgt}
        fill={C.amber + '55'}
        stroke={n <= 16 ? C.amber : '#0000'}
        lineWidth={n <= 16 ? 3 : 0}
        scale={[1, 0]}
      />
    ) as Rect;
  });
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 3, total: 4, series: '미적분이 보인다'});
  const title = addTitle(view, ['곡선 아래 넓이는', '어떻게 구할까?'], C.amber);

  const axes = createRef<Node>();
  const crv = createRef<Line>();
  const shade = createRef<Line>();
  const barNode = createRef<Node>();
  const read = createRef<Node>();
  const nSig = createSignal(4);
  const aSig = createSignal(upper(4));
  const edge = createRef<Line>();

  const pts = curve(F, sq, 0, 1, 120);
  view.add(
    <Node>
      <Axes r={axes} f={F} x={[0, 1.15]} y={[0, 1.15]} xl="x" yl="y" ticks={{x: [1], y: [1]}} />
      <Line ref={shade} points={[...pts, px(F, 1, 0), px(F, 0, 0)]} closed fill={C.teal + '44'} opacity={0} />
      <Node ref={barNode} />
      <Line ref={edge} points={[px(F, 1, 0), px(F, 1, 1)]} stroke={'#ffffff55'} lineWidth={3} lineDash={[10, 8]} opacity={0} />
      <Line ref={crv} points={curve(F, sq, -0.05, 1.1, 120)} stroke={C.teal} lineWidth={8} lineCap="round" shadowColor={C.teal} shadowBlur={18} end={0} />
    </Node>,
  );
  view.add(
    <Node ref={read} x={-40} y={-450} opacity={0}>
      <Txt text={() => `막대 ${Math.round(nSig())}개`} fontFamily={FONT} fontSize={42} fontWeight={800} fill={C.dim} />
      <Txt y={68} text={() => `넓이 ≈ ${aSig().toFixed(3)}`} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const eq = addEq(view, 290, 80);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  let current: Rect[] = [];
  function* showBars(n: number, time: number) {
    const old = current;
    const next = bars(n);
    next.forEach(b => barNode().add(b));
    current = next;
    cue('swish');
    yield* all(
      ...old.map(b => b.opacity(0, 0.3)),
      sequence(time / n, ...next.map(b => b.scale([1, 1], 0.4, easeOutExpo))),
      nSig(n, 0),
      aSig(upper(n), 0.8, easeInOutCubic),
    );
    old.forEach(b => b.remove());
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 곡선 아래
  cue('whoosh');
  yield* axes().opacity(1, 0.5);
  yield* crv().end(1, 1, easeInOutCubic);
  yield* all(shade().opacity(1, 0.6), edge().opacity(1, 0.6), cap.say('01', 'y = x² 아래, 0 부터 1 까지의 넓이는?'));
  yield* waitFor(1.2);
  yield* cap.say('02', '위가 휘어 있어서\n가로 × 세로로는 못 구해요', C.coral);
  yield* waitFor(1.4);

  // 2. 막대 4개
  yield* cap.say('03', '그럼 직사각형 막대로 덮어 봐요');
  yield* all(read().opacity(1, 0.4), showBars(4, 0.8));
  yield* waitFor(0.8);
  yield* cap.say('04', '곡선 위로 삐져나온 만큼\n실제보다 커요', C.coral);
  yield* waitFor(1.4);

  // 3. 점점 잘게
  yield* cap.say('05', '막대를 더 잘게 자르면?', C.pink);
  yield* showBars(8, 0.8);
  yield* waitFor(0.6);
  yield* showBars(16, 0.8);
  yield* waitFor(0.6);
  yield* showBars(50, 0.6);
  yield* waitFor(0.4);
  yield* showBars(200, 0.5);
  yield* waitFor(0.4);
  cue('boom');
  yield* all(punch(view, 0.02), cap.say('06', '삐져나온 부분이 사라지고\n0.333… 으로 다가가요', C.amber));
  yield* waitFor(1.6);

  // 4. 적분
  cue('chime');
  yield* all(eq.set('∫₀¹ x² dx = 1/3', C.ink, C.amber), flash(0.12), ring(view, [0, 290], C.amber, 380));
  yield* cap.say('07', '이게 적분!\n아주 얇은 막대들을 다 더한 것', C.teal);
  yield* waitFor(2);
  yield* cap.say('08', '∫ 는 합(Sum)의 S 를 길게 늘인 모양\nx² dx = 높이 × 아주 얇은 폭', C.teal);
  yield* waitFor(2.6);
  yield* all(sparks(view, [-40, -380], C.amber, 12, 160), cap.say('09', '그런데 매번 이렇게\n잘라서 더해야 할까요?', C.pink));
  yield* waitFor(2);

  // 다음 편
  yield* wipe.cover();
  barNode().parent()!.opacity(0);
  read().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  04', '넓이를 미분하면\n높이가 된다?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
