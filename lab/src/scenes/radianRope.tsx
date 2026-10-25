import {Circle, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';

const NAME = 'radianRope';
const CX = 0;
const CY = -210;
const R = 250;
// 수학 방향(반시계)으로 각 θ 인 원 위의 점
const pt = (t: number, r = R): [number, number] => [CX + r * Math.cos(t), CY - r * Math.sin(t)];
const tang = (t: number): [number, number] => [-Math.sin(t), -Math.cos(t)];
const ROPE = [C.amber, C.teal, C.violet];

// 각 k 에서 시작해 반지름 길이만큼. w(0~1) 만큼 원에 감기고 나머지는 접선으로 뻗는다.
// u(0~1): 0 이면 반지름 위에 누워 있고 1 이면 감기 시작 자리에 선다 (첫 끈만 씀)
function ropePts(k: number, w: SimpleSignal<number>, u?: SimpleSignal<number>) {
  return () =>
    Array.from({length: 41}, (_, i) => {
      const s = i / 40;
      let p: [number, number];
      if (s <= w()) p = pt(k + s);
      else {
        const e = pt(k + w());
        const d = tang(k + w());
        p = [e[0] + (s - w()) * R * d[0], e[1] + (s - w()) * R * d[1]];
      }
      if (!u) return p;
      const lie: [number, number] = [CX + s * R, CY];
      return [lie[0] + (p[0] - lie[0]) * u(), lie[1] + (p[1] - lie[1]) * u()] as [number, number];
    });
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 2, series: '삼각함수'});
  const title = addTitle(view, ['각도를 길이로', '잰다? 라디안'], C.teal);

  const circ = createRef<Circle>();
  const rad = createRef<Line>();
  const radTag = createRef<Txt>();
  const deg = createRef<Txt>();
  const ws = [createSignal(0), createSignal(0), createSignal(0)];
  const u0 = createSignal(0);
  const ropes: Line[] = [];
  const sector = createRef<Node>();
  const left = createRef<Circle>();
  const leftTag = createRef<Txt>();
  const half = createRef<Line>();
  const nums: Txt[] = [];

  view.add(
    <Node>
      <Circle ref={circ} x={CX} y={CY} size={R * 2} stroke={'#ffffff55'} lineWidth={5} end={0} />
      <Line ref={half} points={[pt(0, R + 40), pt(Math.PI, R + 40)]} stroke={'#ffffff33'} lineWidth={3} lineDash={[12, 10]} opacity={0} />
      <Line ref={rad} points={[[CX, CY], pt(0)]} stroke={C.ink} lineWidth={6} end={0} />
      <Txt ref={radTag} x={CX + R / 2} y={CY + 36} text="반지름 r" fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.ink} opacity={0} />
      <Txt ref={deg} x={CX} y={CY} text="360°" fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.dim} opacity={0} />
      <Node ref={sector} opacity={0}>
        <Line points={[[CX, CY], pt(0)]} stroke={C.amber} lineWidth={5} />
        <Line points={[[CX, CY], pt(1)]} stroke={C.amber} lineWidth={5} />
        <Circle x={CX} y={CY} size={110} startAngle={-57.2958} endAngle={0} stroke={C.amber} lineWidth={5} />
        <Txt position={pt(0.5, 112)} text="1" fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.amber} />
      </Node>
      <Circle ref={left} x={CX} y={CY} size={R * 2} startAngle={-180} endAngle={-180 + (Math.PI - 3) * 57.2958} stroke={C.pink} lineWidth={14} shadowColor={C.pink} shadowBlur={18} opacity={0} />
      <Txt ref={leftTag} position={pt(3.07, R + 70)} text="0.14…" fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.pink} opacity={0} />
      {[0, 1, 2].map(k => (
        <Txt ref={el => (nums[k] = el)} position={pt(k + 0.5, R + 50)} text={String(k + 1)} fontFamily={FONT} fontSize={44} fontWeight={900} fill={ROPE[k]} opacity={0} />
      ))}
      {[0, 1, 2].map(k => (
        <Line
          ref={el => (ropes[k] = el)}
          points={ropePts(k, ws[k], k === 0 ? u0 : undefined)}
          stroke={ROPE[k]}
          lineWidth={12}
          lineCap="round"
          shadowColor={ROPE[k]}
          shadowBlur={16}
          opacity={0}
        />
      ))}
    </Node>,
  );

  const eq = addEq(view, 210, 84);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 도
  cue('whoosh');
  yield* all(circ().end(1, 1, easeInOutCubic), deg().opacity(1, 0.6), cap.say('01', '각도는 보통 도(°)로 재요\n한 바퀴 = 360°'));
  yield* waitFor(1.2);
  yield* all(deg().opacity(0, 0.4), rad().end(1, 0.6), radTag().opacity(1, 0.4), cap.say('02', '이번엔 반지름만큼 끈을 잘라서', C.amber));
  ropes[0].opacity(1);
  yield* waitFor(0.4);
  cue('swish');
  yield* all(u0(1, 1, easeInOutCubic), radTag().opacity(0, 0.4));

  // 2. 감기
  yield* cap.say('03', '원 둘레에 감아 볼게요', C.amber);
  cue('riser');
  yield* ws[0](1, 1.6, easeInOutCubic);
  yield* nums[0].opacity(1, 0.3);
  cue('boom');
  yield* all(sector().opacity(1, 0.5), ring(view, pt(1), C.amber, 100));
  yield* cap.say('04', '끈 하나가 만든 각 = 1 라디안\n(약 57.3°)', C.amber);
  yield* eq.set('1 라디안 ≈ 57.3°', C.ink, C.amber);
  yield* waitFor(1.6);

  // 3. 반 바퀴
  yield* all(sector().opacity(0, 0.4), eq.hide(), rad().opacity(0, 0.3), half().opacity(1, 0.4), cap.say('05', '그럼 반 바퀴에는\n끈이 몇 개 들어갈까?', C.pink));
  ropes[1].opacity(1);
  cue('swish');
  yield* ws[1](1, 1.2, easeInOutCubic);
  yield* nums[1].opacity(1, 0.3);
  ropes[2].opacity(1);
  cue('swish');
  yield* ws[2](1, 1.2, easeInOutCubic);
  yield* nums[2].opacity(1, 0.3);
  cue('pop');
  yield* all(left().opacity(1, 0.4), leftTag().opacity(1, 0.4));
  yield* cap.say('06', '3개 하고 조금 더… 3.14…개 = π 개!', C.pink);
  yield* waitFor(1.2);
  cue('boom');
  yield* all(flash(0.12), eq.set('180° = π 라디안', C.ink, C.pink));
  yield* waitFor(1.4);
  yield* cap.say('07', '반 바퀴 = π, 한 바퀴 = 2π\n각도를 "반지름 몇 개"로 세는 거예요', C.teal);
  yield* waitFor(2.4);

  // 4. 쓸모
  yield* eq.set('호의 길이 = r × 각', C.ink, C.teal);
  yield* all(sparks(view, [0, 210], C.teal, 14, 240), cap.say('08', '그래서 라디안을 쓰면\n호의 길이가 곱셈 한 번!', C.teal));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  circ().parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', 'sin 그래프는\n원의 그림자?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
