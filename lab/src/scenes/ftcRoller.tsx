import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';
import {Axes, px} from '../graph';
import type {Frame} from '../graph';

const NAME = 'ftcRoller';
const F: Frame = {ox: -330, oy: 170, sx: 300, sy: 120};

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const hud = addHud(view, {ep: 4, total: 4, series: '미적분이 보인다'});
  const title = addTitle(view, ['넓이를 미분하면', '높이가 된다?'], C.violet);

  const X = createSignal(0); // 롤러 위치
  const mode = createSignal(0); // 0: 높이 3 고정, 1: 높이 2x
  const hAt = (x: number) => (mode() === 0 ? 3 : 2 * x);
  const area = () => (mode() === 0 ? 3 * X() : X() * X());

  const axes = createRef<Node>();
  const paint = createRef<Line>();
  const roller = createRef<Node>();
  const fLine = createRef<Line>();
  const read = createRef<Node>();
  const sliver = createRef<Line>();
  const sTag = createRef<Txt>();

  const paintPts = (): [number, number][] =>
    mode() === 0
      ? [px(F, 0, 0), px(F, 0, 3), px(F, X(), 3), px(F, X(), 0)]
      : [px(F, 0, 0), px(F, X(), 2 * X()), px(F, X(), 0)];

  view.add(
    <Node>
      <Axes r={axes} f={F} x={[0, 2.4]} y={[0, 4.7]} xl="x" yl="높이" ticks={{x: [1, 2], y: [2, 4]}} />
      <Line ref={paint} points={paintPts} closed fill={C.violet + '66'} stroke={C.violet} lineWidth={3} opacity={0} />
      <Line ref={fLine} points={[px(F, 0, 0), px(F, 2.2, 4.4)]} stroke={C.teal} lineWidth={7} shadowColor={C.teal} shadowBlur={16} end={0} />
      <Line ref={sliver} points={[px(F, 1.4, 0), px(F, 1.4, 2.8), px(F, 1.6, 3.2), px(F, 1.6, 0)]} closed fill={C.amber + 'cc'} shadowColor={C.amber} shadowBlur={24} opacity={0} />
      <Txt ref={sTag} x={px(F, 1.5, 0)[0] + 150} y={px(F, 0, 1.4)[1]} text="← 높이 × 폭" fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.amber} opacity={0} />
      <Node ref={roller} opacity={0}>
        <Line points={() => [px(F, X(), 0), px(F, X(), hAt(X()))]} stroke={C.ink} lineWidth={18} lineCap="round" shadowColor={C.ink} shadowBlur={14} />
        <Line
          points={() => {
            const top = px(F, X(), hAt(X()) / 2);
            return [top, [top[0] + 50, top[1]], [top[0] + 50, top[1] + 120]];
          }}
          stroke={C.dim}
          lineWidth={8}
          lineCap="round"
          lineJoin="round"
        />
      </Node>
    </Node>,
  );
  view.add(
    <Node ref={read} x={-90} y={-500} opacity={0}>
      <Txt text={() => `높이 ${hAt(X()).toFixed(1)}   ·   간 거리 ${X().toFixed(1)}`} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.dim} />
      <Txt y={68} text={() => `칠한 넓이 ${area().toFixed(2)}`} fontFamily={FONT} fontSize={58} fontWeight={900} fill={C.violet} />
    </Node>,
  );

  const eq = addEq(view, 290, 74);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 높이 3 롤러
  cue('whoosh');
  yield* axes().opacity(1, 0.5);
  yield* all(roller().opacity(1, 0.4), paint().opacity(1, 0.4), read().opacity(1, 0.4), cap.say('01', '높이 3 짜리 페인트 롤러로 칠해요'));
  cue('riser');
  yield* X(1, 2, linear);
  yield* waitFor(0.3);
  yield* X(2, 2, linear);
  yield* waitFor(0.4);
  yield* cap.say('02', '1 갈 때마다 넓이가 3 씩\n넓이가 느는 빠르기 = 롤러 높이', C.amber);
  yield* waitFor(2);

  // 2. 높이가 바뀌는 롤러 (높이 = 2x)
  yield* all(paint().opacity(0, 0.3), roller().opacity(0, 0.3));
  mode(1);
  X(0);
  cue('swish');
  yield* fLine().end(1, 0.8);
  yield* all(paint().opacity(1, 0.3), roller().opacity(1, 0.3), cap.say('03', '이번엔 높이가 2x 인 선을 따라\n롤러 키가 점점 커져요', C.teal));
  cue('riser');
  yield* X(1, 2.2, linear);
  yield* waitFor(0.3);
  yield* X(2, 2.2, linear);
  yield* waitFor(0.4);
  yield* cap.say('04', '넓이는 1, 4 … 삼각형이라 x² 이에요', C.violet);
  yield* waitFor(1.6);

  // 3. 얇은 조각
  yield* X(1.4, 1, easeInOutCubic);
  yield* all(sliver().opacity(1, 0.4), sTag().opacity(1, 0.4), cap.say('05', '조금 더 밀면 늘어나는 조각\n= 지금 높이 × 아주 얇은 폭', C.amber));
  yield* waitFor(2.2);
  yield* all(sliver().opacity(0, 0.3), sTag().opacity(0, 0.3));
  yield* eq.set('(넓이)′ = 높이', C.ink, C.violet);
  cue('boom');
  yield* all(flash(0.12), cap.say('06', '그래서 넓이를 미분하면 높이!\n(x²)′ = 2x  — 1편에서 본 그대로', C.violet));
  yield* waitFor(2.6);

  // 4. 미적분의 기본정리
  yield* eq.set('∫ f dx = F(b) − F(a)', C.ink, C.amber);
  yield* cap.say('07', '미분해서 f 가 되는 F 를 찾으면\n넓이는 뺄셈 한 번!', C.amber);
  yield* waitFor(2.4);
  yield* cap.say('08', '3편의 넓이도 바로 나와요\n(x³/3)′ = x²  →  1/3 − 0 = 1/3', C.teal);
  yield* waitFor(2.6);
  cue('chime');
  yield* all(ring(view, [0, 290], C.amber, 400), sparks(view, [0, 290], C.amber, 14, 260), cap.say('09', '미분과 적분은 서로 거꾸로!\n= 미적분의 기본정리', C.amber));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  axes().parent()!.opacity(0);
  read().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT', '곱셈을 덧셈으로 바꾸는\n마법의 자, 로그');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
