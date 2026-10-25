import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeInOutExpo, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';
import {Axes, px} from '../graph';
import type {Frame} from '../graph';

const NAME = 'diffTangent';
const F: Frame = {ox: -330, oy: 170, sx: 300, sy: 140};
const sq = (x: number) => x * x;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 4, series: '미적분이 보인다'});
  const title = addTitle(view, ['곡선의 기울기,', '어떻게 잴까?'], C.teal);

  const h = createSignal(1.2); // P 와 Q 사이 거리
  const p = createSignal(1); // P 의 x
  const z = createSignal(1); // 확대 배율 (P 를 중심으로)
  const A = px(F, 1, 1);
  const T = (pt: [number, number]): [number, number] => [A[0] + z() * (pt[0] - A[0]), A[1] + z() * (pt[1] - A[1])];
  const P = () => T(px(F, p(), sq(p())));
  const Q = () => T(px(F, p() + h(), sq(p() + h())));
  const slopeSec = () => 2 * p() + h();
  const lineThrough = (m: number, x0: number, half: number) => [
    T(px(F, x0 - half, sq(p()) + m * (x0 - half - p()))),
    T(px(F, x0 + half, sq(p()) + m * (x0 + half - p()))),
  ];
  const curvePts = () => {
    const half = 1.9 / z();
    const a = Math.max(-0.35, 1 - half);
    const b = Math.min(2.3, 1 + half);
    return Array.from({length: 161}, (_, i) => {
      const x = a + ((b - a) * i) / 160;
      return T(px(F, x, sq(x)));
    });
  };

  const axes = createRef<Node>();
  const crv = createRef<Line>();
  const sec = createRef<Line>();
  const tan = createRef<Line>();
  const dotP = createRef<Circle>();
  const dotQ = createRef<Circle>();
  const labP = createRef<Txt>();
  const labQ = createRef<Txt>();
  const read = createRef<Node>();
  const readH = createRef<Txt>();
  const readM = createRef<Txt>();
  const zoomTag = createRef<Txt>();

  view.add(
    <Rect y={-170} width={960} height={840} clip>
      <Node y={170}>
        <Axes r={axes} f={F} x={[-0.35, 2.4]} y={[-0.3, 5]} xl="x" yl="y" />
        <Line ref={crv} points={curvePts} stroke={C.teal} lineWidth={8} lineCap="round" shadowColor={C.teal} shadowBlur={20} end={0} />
        <Line
          ref={sec}
          points={() => lineThrough(slopeSec(), p() + h() / 2, h() / 2 + 1.4)}
          stroke={C.coral}
          lineWidth={6}
          shadowColor={C.coral}
          shadowBlur={14}
          opacity={0}
        />
        <Line
          ref={tan}
          points={() => lineThrough(2 * p(), p(), 1.5 / z())}
          stroke={C.amber}
          lineWidth={7}
          shadowColor={C.amber}
          shadowBlur={18}
          opacity={0}
        />
        <Circle ref={dotQ} position={Q} size={30} fill={C.coral} shadowColor={C.coral} shadowBlur={16} opacity={0} />
        <Txt ref={labQ} position={() => [Q()[0] + 40, Q()[1] + 6]} text="Q" fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.coral} opacity={0} />
        <Circle ref={dotP} position={P} size={34} fill={C.ink} shadowColor={C.ink} shadowBlur={16} opacity={0} />
        <Txt ref={labP} position={() => [P()[0] - 42, P()[1] - 34]} text="P" fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.ink} opacity={0} />
      </Node>
    </Rect>,
  );
  view.add(
    <Node ref={read} x={-40} y={-470} opacity={0}>
      <Txt ref={readH} y={0} text={() => `P 와 Q 의 거리  ${h().toFixed(2)}`} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.dim} />
      <Txt ref={readM} y={66} text={() => `기울기  ${slopeSec().toFixed(2)}`} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.coral} />
    </Node>,
  );
  view.add(<Txt ref={zoomTag} x={300} y={-500} text="× 1" fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.amber} opacity={0} />);
  zoomTag().text(() => `확대 × ${Math.round(z())}`);

  const eq = addEq(view, 290, 76);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 곡선 y = x²
  cue('whoosh');
  yield* axes().opacity(1, 0.5);
  yield* crv().end(1, 1.0, easeInOutCubic);
  cue('pop');
  yield* all(dotP().opacity(1, 0.3), labP().opacity(1, 0.3), cap.say('01', '곡선 y = x² 위의 한 점 P'));
  yield* waitFor(1.2);
  yield* cap.say('02', '곡선은 계속 휘어서\n기울기를 바로 못 재요', C.coral);
  yield* waitFor(1.2);

  // 2. 할선
  cue('pop');
  yield* all(dotQ().opacity(1, 0.3), labQ().opacity(1, 0.3));
  cue('swish');
  yield* all(sec().opacity(1, 0.5), read().opacity(1, 0.5), cap.say('03', '그럼 옆에 점 Q 를 하나 더 찍고\n두 점을 직선으로 이어요'));
  yield* waitFor(1.4);

  // 3. Q 를 P 쪽으로
  yield* cap.say('04', 'Q 를 P 쪽으로 점점 붙이면…', C.pink);
  cue('riser');
  yield* h(0.5, 1.6, easeInOutCubic);
  yield* waitFor(0.4);
  yield* h(0.1, 1.4, easeInOutCubic);
  yield* waitFor(0.4);
  yield* h(0.01, 1.2, easeInOutCubic);
  yield* waitFor(0.3);
  cue('boom');
  yield* all(cap.say('05', '기울기가 2 에 딱 붙어요!', C.amber), ring(view, [-40, -404], C.amber, 200));
  yield* waitFor(1.2);

  // 4. 접선
  cue('chime');
  yield* all(
    sec().opacity(0, 0.4),
    dotQ().opacity(0, 0.4),
    labQ().opacity(0, 0.4),
    tan().opacity(1, 0.5),
    read().opacity(0, 0.4),
    cap.say('06', '두 점이 하나가 된 직선 = 접선\n접선의 기울기 = 2', C.amber),
  );
  yield* waitFor(1.6);

  // 5. 확대
  yield* cap.say('07', 'P 를 크게 확대해 볼까요?', C.teal);
  cue('riser');
  yield* all(axes().opacity(0, 0.5), labP().opacity(0, 0.5), zoomTag().opacity(1, 0.5));
  yield* z(30, 3.2, easeInOutExpo);
  cue('boom');
  yield* all(flash(0.12), cap.say('08', '곡선이 접선과 거의 겹쳐요\n가까이 보면 곡선도 직선!', C.amber));
  yield* waitFor(2);
  yield* all(z(1, 1.6, easeInOutExpo), zoomTag().opacity(0, 0.5));
  yield* all(axes().opacity(1, 0.5), labP().opacity(1, 0.5));

  // 6. 미분
  yield* eq.set('f′(1) = 2', C.ink, C.amber);
  yield* cap.say('09', '이 기울기를 구하는 게 "미분"\n아주 가까이서 본 기울기', C.teal);
  yield* waitFor(2);

  // 7. 점을 옮기면
  yield* cap.say('10', 'P 를 옮기면 기울기도 바뀌어요', C.pink);
  eq.node().text(() => `x = ${p().toFixed(1)}  →  기울기 ${(2 * p()).toFixed(1)}`);
  cue('swish');
  yield* p(0.4, 1.4, easeInOutCubic);
  yield* waitFor(0.5);
  cue('swish');
  yield* p(2, 2.2, easeInOutCubic);
  yield* waitFor(0.6);
  cue('swish');
  yield* p(1.5, 1, easeInOutCubic);
  yield* waitFor(0.5);
  cue('boom');
  eq.node().text('x² 를 미분하면 2x');
  yield* all(sparks(view, [0, 290], C.amber, 14, 220), flash(0.12), cap.say('11', '기울기는 언제나 x 의 2배\n(x²)′ = 2x', C.amber));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  title.group().opacity(0);
  eq.node().opacity(0);
  read().opacity(0);
  tan().parent()!.parent()!.opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', '평균 100km/h 면\n어딘가에선 꼭 100?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});

