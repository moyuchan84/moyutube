import {Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';
import {Axes, curve, px} from '../graph';
import type {Frame} from '../graph';

const NAME = 'eCompound';
const F: Frame = {ox: -330, oy: 170, sx: 680, sy: 140};
const ROWS: [number, string, string][] = [
  [1, '1년에 1번', '2'],
  [2, '반년마다', '2.25'],
  [4, '석 달마다', '2.441'],
  [12, '매달', '2.613'],
  [365, '매일', '2.715'],
];
const COLORS = [C.coral, C.amber, C.teal, C.violet, C.pink];

// 1년 동안 n 번 나눠 이자를 붙일 때의 계단 그래프
function stairs(n: number): [number, number][] {
  const r = 1 + 1 / n;
  const out: [number, number][] = [];
  let v = 1;
  for (let k = 0; k < n; k++) {
    out.push(px(F, k / n, v), px(F, (k + 1) / n, v));
    v *= r;
    out.push(px(F, (k + 1) / n, v));
  }
  return out;
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 2, series: '지수와 로그'});
  const title = addTitle(view, ['이자를 잘게 쪼개면', '무한히 불어날까?'], C.amber);

  const axes = createRef<Node>();
  const lines: Line[] = [];
  const rows: Node[] = [];
  const smooth = createRef<Line>();
  const ceil = createRef<Line>();
  const ceilTag = createRef<Txt>();

  view.add(
    <Node>
      <Axes r={axes} f={F} x={[0, 1.12]} y={[0, 3.1]} xl="1년" yl="돈" ticks={{y: [1, 2]}} />
      <Line ref={ceil} points={[px(F, 0, Math.E), px(F, 1.05, Math.E)]} stroke={C.amber} lineWidth={4} lineDash={[16, 10]} opacity={0} />
      <Txt ref={ceilTag} x={px(F, 1, 0)[0] - 10} y={px(F, 0, Math.E)[1] - 36} text="2.718…" fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.amber} opacity={0} />
      {ROWS.map(([n], i) => (
        <Line ref={el => (lines[i] = el)} points={stairs(n)} stroke={COLORS[i]} lineWidth={n > 100 ? 5 : 7} lineJoin="round" shadowColor={COLORS[i]} shadowBlur={12} end={0} />
      ))}
      <Line ref={smooth} points={curve(F, Math.exp, 0, 1, 100)} stroke={C.ink} lineWidth={5} lineDash={[12, 10]} end={0} />
    </Node>,
  );
  view.add(
    <Node x={20} y={-500}>
      {ROWS.map(([, label, val], i) => (
        <Node ref={el => (rows[i] = el)} y={i * 58} opacity={0}>
          <Txt x={-40} offsetX={1} text={label} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.dim} />
          <Txt x={0} offsetX={-1} text={val} fontFamily={FONT} fontSize={44} fontWeight={900} fill={COLORS[i]} />
        </Node>
      ))}
    </Node>,
  );

  const eq = addEq(view, 290, 76);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  function* step(i: number, time = 1.2) {
    cue('whoosh');
    yield* all(
      ...lines.slice(0, i).map(l => l.opacity(0.22, 0.4)),
      lines[i].end(1, time, easeInOutCubic),
      rows[i].opacity(1, 0.5),
    );
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 1년에 한 번
  yield* axes().opacity(1, 0.5);
  yield* cap.say('01', '1년 이자가 100% 인\n상상의 은행에 1 을 맡겨요');
  yield* waitFor(0.8);
  yield* step(0);
  yield* cap.say('02', '1년 뒤 한 번에 이자 1 → 2', C.coral);
  yield* waitFor(1.2);

  // 2. 반년마다
  yield* cap.say('03', '반년마다 50% 씩 두 번 주면?', C.amber);
  yield* step(1);
  yield* cap.say('04', '1.5 에 또 50% → 2.25\n이자에도 이자가 붙어요!', C.amber);
  yield* waitFor(1.8);

  // 3. 더 잘게
  yield* cap.say('05', '더 잘게 쪼개 볼까요?', C.teal);
  yield* step(2, 1);
  yield* waitFor(0.4);
  yield* step(3, 1);
  yield* waitFor(0.4);
  yield* step(4, 1.2);
  yield* waitFor(0.6);
  yield* cap.say('06', '쪼갤수록 늘긴 하는데…\n늘어나는 양이 점점 줄어요', C.pink);
  yield* waitFor(1.8);

  // 4. 한계
  cue('swish');
  yield* all(ceil().opacity(1, 0.5), ceilTag().opacity(1, 0.5), smooth().end(1, 1.2));
  cue('boom');
  yield* all(flash(0.12), ring(view, [px(F, 1, Math.E)[0], px(F, 1, Math.E)[1]], C.amber, 140), cap.say('07', '매초, 매 순간으로 쪼개도\n2.718… 을 절대 못 넘어요', C.amber));
  yield* waitFor(2);
  yield* eq.set('e = 2.71828…', C.ink, C.amber);
  yield* cap.say('08', '이 끝 수가 바로 e\n(1 + 1/n) 을 n 번 곱한 값의 끝', C.amber);
  yield* waitFor(2.6);
  yield* all(sparks(view, [0, 290], C.amber, 14, 240), cap.say('09', '쉬지 않고 자라거나 줄어드는 것\n그 계산에 늘 e 가 나와요', C.teal));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  axes().parent()!.opacity(0);
  rows[0].parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT', '각도를 길이로 잰다?\n라디안');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
