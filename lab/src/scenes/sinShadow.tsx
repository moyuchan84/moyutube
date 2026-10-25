import {Circle, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';

const NAME = 'sinShadow';
const CX = -310;
const CY = -180;
const R = 150;
const GX0 = -110; // 그래프 θ = 0 자리
const K = 560 / (2 * Math.PI); // 1 라디안 = K 픽셀
const gx = (t: number) => GX0 + t * K;
const P = (t: number): [number, number] => [CX + R * Math.cos(t), CY - R * Math.sin(t)];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 2, series: '삼각함수'});
  const title = addTitle(view, ['sin 그래프는', '원의 그림자?'], C.violet);

  const th = createSignal(0);
  const drawn = createSignal(0); // 그래프를 어디까지 그렸나 (라디안)
  const stage = createRef<Node>();
  const circ = createRef<Circle>();
  const axes = createRef<Node>();
  const dot = createRef<Circle>();
  const hLine = createRef<Line>();
  const bridge = createRef<Line>();
  const wave = createRef<Line>();
  const tri = createRef<Node>();
  const cosBar = createRef<Node>();

  const wavePts = () =>
    Array.from({length: 161}, (_, i) => {
      const t = (drawn() * i) / 160;
      return [gx(t), CY - R * Math.sin(t)] as [number, number];
    });

  view.add(
    <Node ref={stage}>
      <Node ref={axes} opacity={0}>
        <Line points={[[CX - R - 40, CY], [gx(2 * Math.PI) + 50, CY]]} stroke={'#ffffff44'} lineWidth={3} endArrow arrowSize={14} />
        <Line points={[[GX0, CY + R + 40], [GX0, CY - R - 50]]} stroke={'#ffffff44'} lineWidth={3} endArrow arrowSize={14} />
        {[
          [Math.PI / 2, 'π/2'],
          [Math.PI, 'π'],
          [(3 * Math.PI) / 2, '3π/2'],
          [2 * Math.PI, '2π'],
        ].map(([t, s]) => (
          <Node>
            <Line points={[[gx(t as number), CY - 10], [gx(t as number), CY + 10]]} stroke={'#ffffff66'} lineWidth={3} />
            <Txt x={gx(t as number)} y={CY + 42} text={s as string} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.dim} />
          </Node>
        ))}
        <Txt x={GX0 - 30} y={CY - R} text="1" fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.dim} />
        <Txt x={GX0 - 40} y={CY + R} text="−1" fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.dim} />
        <Line points={[[GX0 - 8, CY - R], [gx(2 * Math.PI), CY - R]]} stroke={'#ffffff18'} lineWidth={2} lineDash={[8, 8]} />
        <Line points={[[GX0 - 8, CY + R], [gx(2 * Math.PI), CY + R]]} stroke={'#ffffff18'} lineWidth={2} lineDash={[8, 8]} />
      </Node>
      <Circle ref={circ} x={CX} y={CY} size={R * 2} stroke={'#ffffff66'} lineWidth={5} end={0} />
      <Line ref={wave} points={wavePts} stroke={C.violet} lineWidth={8} lineCap="round" shadowColor={C.violet} shadowBlur={18} />
      <Line ref={bridge} points={() => [P(th()), [gx(drawn()), P(th())[1]]]} stroke={'#ffffff55'} lineWidth={3} lineDash={[10, 8]} opacity={0} />
      <Line ref={hLine} points={() => [[P(th())[0], CY], P(th())]} stroke={C.amber} lineWidth={8} shadowColor={C.amber} shadowBlur={14} opacity={0} />
      <Node ref={cosBar} opacity={0}>
        <Line points={() => [[CX, CY], [P(th())[0], CY]]} stroke={C.teal} lineWidth={8} shadowColor={C.teal} shadowBlur={14} />
        <Txt x={() => (CX + P(th())[0]) / 2} y={CY + 40} text="cos" fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.teal} />
      </Node>
      <Node ref={tri} opacity={0}>
        <Line points={() => [[CX, CY], P(th())]} stroke={C.ink} lineWidth={5} />
        <Txt x={() => (CX + P(th())[0]) / 2 - 20} y={() => (CY + P(th())[1]) / 2 - 30} text="1" fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.ink} />
        <Txt x={() => P(th())[0] + 46} y={() => (CY + P(th())[1]) / 2} text="sin" fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.amber} />
      </Node>
      <Circle ref={dot} position={() => P(th())} size={30} fill={C.amber} shadowColor={C.amber} shadowBlur={18} opacity={0} />
    </Node>,
  );

  const eq = addEq(view, 250, 84);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 관람차
  cue('whoosh');
  yield* all(circ().end(1, 1, easeInOutCubic), cap.say('01', '반지름 1 인 관람차의 한 칸\n높이는 어떻게 변할까?'));
  yield* all(dot().opacity(1, 0.3), hLine().opacity(1, 0.3));
  cue('swish');
  yield* th(Math.PI / 2, 1.2, easeInOutCubic);
  yield* th(0, 1.2, easeInOutCubic);
  yield* waitFor(0.3);

  // 2. 그래프로 펼치기
  yield* all(axes().opacity(1, 0.5), bridge().opacity(1, 0.4), cap.say('02', '돌아간 각만큼 오른쪽으로 가며\n높이를 점으로 찍어요', C.amber));
  cue('riser');
  yield* all(th(2 * Math.PI, 6, linear), drawn(2 * Math.PI, 6, linear));
  cue('boom');
  yield* all(flash(0.12), eq.set('y = sin θ', C.ink, C.violet), cap.say('03', '이 물결이 바로 sin 그래프!\n원 위 높이를 펼친 그림자', C.violet));
  yield* waitFor(2);

  // 3. sin 30°
  yield* all(bridge().opacity(0, 0.3), th(Math.PI / 6, 1.2, easeInOutCubic), tri().opacity(1, 0.5));
  yield* eq.set('sin 30° = 1/2', C.ink, C.amber);
  yield* cap.say('04', '30° 돌면 높이는 딱 절반\n그래서 sin 30° = 1/2', C.amber);
  yield* waitFor(2);
  yield* all(cosBar().opacity(1, 0.4), cap.say('05', '가로 그림자는 cos\nsin 은 세로, cos 는 가로', C.teal));
  yield* waitFor(2);

  // 4. 되풀이
  yield* all(tri().opacity(0, 0.3), cosBar().opacity(0, 0.3), eq.hide());
  cue('swish');
  yield* all(th(2 * Math.PI, 2.2, easeInOutCubic), cap.say('06', '한 바퀴(2π) 돌면 제자리\n그래서 2π 마다 똑같이 반복', C.pink));
  yield* ring(view, [gx(2 * Math.PI), CY], C.pink, 110);
  yield* waitFor(1.2);
  yield* all(sparks(view, [gx(Math.PI / 2), CY - R], C.violet, 12, 140), cap.say('07', '소리, 파도, 그네처럼\n되풀이되는 움직임엔 sin 이 숨어 있어요', C.violet));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  stage().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT', '끝없이 더하는데\n답이 1 이라고?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
