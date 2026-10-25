import {Circle, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';

const NAME = 'dotShadow';
const U = 140;
const OX = -300;
const OY = -150;
const A = 4; // |a|
const B = 3; // |b|
const rad = (d: number) => (d * Math.PI) / 180;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 3, total: 4, series: '한 장면 고등수학'});
  const title = addTitle(view, ['벡터의 내적은', '그림자 길이?'], C.teal);

  const th = createSignal(60); // 도
  const tip = (): [number, number] => [OX + B * U * Math.cos(rad(th())), OY - B * U * Math.sin(rad(th()))];
  const sh = () => B * Math.cos(rad(th()));

  const vecA = createRef<Line>();
  const vecB = createRef<Line>();
  const labA = createRef<Txt>();
  const labB = createRef<Txt>();
  const base = createRef<Line>();
  const rays = createRef<Node>();
  const drop = createRef<Line>();
  const shadow = createRef<Line>();
  const arc = createRef<Node>();
  const read = createRef<Txt>();

  view.add(
    <Node>
      <Line ref={base} points={[[OX - 260, OY], [OX + A * U + 80, OY]]} stroke={'#ffffff30'} lineWidth={3} lineDash={[12, 10]} opacity={0} />
      <Node ref={rays} opacity={0}>
        {[-3, -2, -1, 0, 1, 2, 3].map(k => (
          <Line points={() => [[tip()[0] + k * 34, -580], [tip()[0] + k * 34, Math.max(-550, tip()[1] - 30)]]} stroke={'#FFF3B055'} lineWidth={3} lineDash={[14, 10]} endArrow arrowSize={10} />
        ))}
      </Node>
      <Line ref={shadow} points={() => [[OX, OY], [OX + sh() * U, OY]]} stroke={C.amber} lineWidth={20} lineCap="round" shadowColor={C.amber} shadowBlur={24} opacity={0} />
      <Line ref={drop} points={() => [tip(), [tip()[0], OY]]} stroke={'#FFF3B0aa'} lineWidth={4} lineDash={[10, 8]} opacity={0} />
      <Line ref={vecA} points={[[OX, OY], [OX + A * U, OY]]} stroke={C.teal} lineWidth={9} endArrow arrowSize={22} shadowColor={C.teal} shadowBlur={14} end={0} />
      <Txt ref={labA} x={OX + A * U + 10} y={OY + 50} text="a  (길이 4)" fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.teal} opacity={0} />
      <Line ref={vecB} points={() => [[OX, OY], tip()]} stroke={C.violet} lineWidth={9} endArrow arrowSize={22} shadowColor={C.violet} shadowBlur={14} end={0} />
      <Txt ref={labB} position={() => [tip()[0] + 70, tip()[1] - 10]} text="b (3)" fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.violet} opacity={0} />
      <Node ref={arc} opacity={0}>
        <Circle x={OX} y={OY} size={120} startAngle={() => -th()} endAngle={0} stroke={C.ink} lineWidth={4} />
        <Txt position={() => [OX + 100 * Math.cos(rad(th() / 2)), OY - 100 * Math.sin(rad(th() / 2))]} text={() => `${Math.round(th())}°`} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.ink} />
      </Node>
    </Node>,
  );
  view.add(<Txt ref={read} y={110} text={() => `그림자 ${sh().toFixed(2)}   →   4 × ${sh().toFixed(2)} = ${(A * Number(sh().toFixed(2))).toFixed(2)}`} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.amber} opacity={0} />);

  const eq = addEq(view, 240, 78);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 두 벡터
  cue('whoosh');
  yield* all(vecA().end(1, 0.7), labA().opacity(1, 0.5), base().opacity(1, 0.5));
  cue('whoosh');
  yield* all(vecB().end(1, 0.7), labB().opacity(1, 0.5), arc().opacity(1, 0.5), cap.say('01', '두 화살표(벡터) a 와 b'));
  yield* waitFor(1);

  // 2. 그림자
  cue('swish');
  yield* all(rays().opacity(1, 0.6), cap.say('02', 'a 에 수직으로 빛을 비추면\nb 의 그림자가 a 위에 생겨요', C.amber));
  yield* all(drop().opacity(1, 0.4), shadow().opacity(1, 0.6));
  yield* waitFor(1.2);
  cue('boom');
  yield* all(eq.set('a · b = 4 × 1.5 = 6', C.ink, C.amber), cap.say('03', '내적 = a 의 길이 × 그림자 길이', C.amber));
  yield* waitFor(2);

  // 3. 각도 바꾸기
  yield* all(eq.hide(), read().opacity(1, 0.4), cap.say('04', '각을 바꿔 볼게요', C.pink));
  cue('swish');
  yield* th(0, 1.6, easeInOutCubic);
  yield* cap.say('05', '같은 방향: 그림자가 제일 길어요', C.teal);
  yield* waitFor(1);
  cue('swish');
  yield* th(90, 2, easeInOutCubic);
  cue('pop');
  yield* all(ring(view, [OX, OY], C.amber, 90), cap.say('06', '직각이면 그림자 0 → 내적 0', C.amber));
  yield* waitFor(1.4);
  cue('swish');
  yield* th(120, 1.4, easeInOutCubic);
  yield* cap.say('07', '반대쪽으로 넘어가면 음수!', C.coral);
  yield* waitFor(1.4);

  // 4. 공식
  yield* all(read().opacity(0, 0.3), th(60, 1.2, easeInOutCubic));
  cue('boom');
  yield* all(flash(0.12), eq.set('a · b = |a| |b| cos θ', C.ink, C.teal));
  yield* cap.say('08', '그림자 길이 = |b| cos θ\n(sin·cos 편의 가로 그림자!)', C.teal);
  yield* waitFor(2.4);
  yield* all(sparks(view, [0, 240], C.teal, 14, 240), cap.say('09', '썰매를 비스듬히 끌 때\n앞으로 가는 데 쓰인 힘 = 그림자', C.violet));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  vecA().parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  04', '도미노로 하는\n무한 증명');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
