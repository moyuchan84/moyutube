import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, popIn, ring, sparks} from '../motion';
import {Axes, px} from '../graph';
import type {Frame} from '../graph';

const NAME = 'mvtSpeed';
// 12분 동안 20km. 속도 v(t) = 100 − 40·cos(πt/12) km/h (60 → 140), 평균은 정확히 100.
const sAt = (t: number) => (5 / 3) * t - (8 / Math.PI) * Math.sin((Math.PI * t) / 12); // km
const vAt = (t: number) => 100 - 40 * Math.cos((Math.PI * t) / 12); // km/h
const F: Frame = {ox: -360, oy: 170, sx: 62, sy: 26};
const ROAD_Y = -430;
const RX = (s: number) => -380 + (s / 20) * 760;

function Gauge(p: {v: () => number; r: any; x: number; y: number; scale?: number; opacity?: number}) {
  const R = 150;
  const ang = (v: number) => ((180 + (Math.min(160, Math.max(0, v)) / 160) * 180) * Math.PI) / 180;
  const pt = (v: number, k: number): [number, number] => [Math.cos(ang(v)) * R * k, Math.sin(ang(v)) * R * k];
  return (
    <Node ref={p.r} x={p.x} y={p.y} scale={p.scale ?? 1} opacity={p.opacity ?? 0}>
      <Circle size={R * 2} startAngle={180} endAngle={360} stroke={'#ffffff33'} lineWidth={14} />
      <Circle size={R * 2} startAngle={180} endAngle={() => 180 + (Math.min(160, p.v()) / 160) * 180} stroke={C.teal} lineWidth={14} shadowColor={C.teal} shadowBlur={14} />
      {[0, 40, 80, 120, 160].map(v => (
        <Node>
          <Line points={[pt(v, 0.8), pt(v, 0.92)]} stroke={'#ffffff88'} lineWidth={4} />
          <Txt position={pt(v, 0.62)} text={String(v)} fontFamily={FONT} fontSize={26} fontWeight={800} fill={C.dim} />
        </Node>
      ))}
      <Line points={[pt(100, 0.74), pt(100, 1.12)]} stroke={C.amber} lineWidth={7} shadowColor={C.amber} shadowBlur={12} />
      <Line points={() => [[0, 0], pt(p.v(), 0.86)]} stroke={C.ink} lineWidth={8} lineCap="round" shadowColor={'#000'} shadowBlur={10} />
      <Circle size={26} fill={C.ink} />
      <Txt y={62} text={() => `${Math.round(p.v())}`} fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.ink} />
      <Txt y={112} text="km/h" fontFamily={FONT} fontSize={28} fontWeight={800} fill={C.dim} />
    </Node>
  );
}

function Camera(p: {x: number; label: string}) {
  return (
    <Node x={p.x} y={ROAD_Y - 92}>
      <Line points={[[0, 30], [0, 92]]} stroke={'#ffffff66'} lineWidth={6} />
      <Rect width={70} height={44} radius={10} fill={'#2A3360'} stroke={C.ink} lineWidth={3} />
      <Circle x={22} size={22} fill={C.coral} shadowColor={C.coral} shadowBlur={14} />
      <Txt y={-56} text={p.label} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.ink} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.coral);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 4, series: '미적분이 보인다'});
  const title = addTitle(view, ['평균 100km/h 면', '어딘가에선 꼭 100?'], C.coral);

  const tt = createSignal(0); // 분
  const v = () => vAt(tt());

  const road = createRef<Node>();
  const car = createRef<Node>();
  const gauge = createRef<Node>();
  const clock = createRef<Txt>();
  const graph = createRef<Node>();
  const axes = createRef<Node>();
  const crv = createRef<Line>();
  const sec = createRef<Line>();
  const tan = createRef<Line>();
  const dot = createRef<Circle>();
  const hit = createRef<Circle>();
  const secTag = createRef<Txt>();

  view.add(
    <Node ref={road} opacity={0}>
      <Rect y={ROAD_Y} width={900} height={70} radius={10} fill={'#ffffff12'} />
      <Line points={[[-440, ROAD_Y], [440, ROAD_Y]]} stroke={'#ffffff55'} lineWidth={4} lineDash={[30, 24]} />
      <Camera x={RX(0)} label="A" />
      <Camera x={RX(20)} label="B" />
      <Txt y={ROAD_Y + 80} text="← 20 km →" fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.dim} />
      <Node ref={car} x={() => RX(sAt(tt()))} y={ROAD_Y - 6}>
        <Rect width={96} height={40} radius={14} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
        <Rect x={8} y={-22} width={50} height={22} radius={8} fill={C.amber} />
        <Circle x={-28} y={20} size={22} fill={'#111'} stroke={C.ink} lineWidth={3} />
        <Circle x={28} y={20} size={22} fill={'#111'} stroke={C.ink} lineWidth={3} />
      </Node>
    </Node>,
  );
  view.add(<Gauge r={gauge} v={v} x={0} y={-80} />);
  view.add(<Txt ref={clock} x={0} y={110} text={() => `${tt().toFixed(1)} 분`} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.amber} opacity={0} />);

  const P0 = px(F, 0, 0);
  const P1 = px(F, 12, 20);
  const tanPts = (t: number): [number, number][] => {
    const m = vAt(t) / 60; // km/분
    const d = 2.6;
    return [px(F, t - d, sAt(t) - m * d), px(F, t + d, sAt(t) + m * d)];
  };
  view.add(
    <Node ref={graph} opacity={0}>
      <Axes r={axes} f={F} x={[0, 13]} y={[0, 21.5]} xl="분" yl="km" ticks={{x: [6, 12], y: [10, 20]}} opacity={1} />
      <Line
        ref={crv}
        points={Array.from({length: 121}, (_, i) => px(F, (12 * i) / 120, sAt((12 * i) / 120)))}
        stroke={C.teal}
        lineWidth={8}
        lineCap="round"
        shadowColor={C.teal}
        shadowBlur={18}
        end={() => tt() / 12}
      />
      <Line ref={sec} points={[P0, P1]} stroke={C.coral} lineWidth={6} lineDash={[20, 12]} end={0} shadowColor={C.coral} shadowBlur={12} />
      <Txt ref={secTag} x={40} y={-170} text="평균 = 기울기" fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.coral} rotation={-35} opacity={0} />
      <Line ref={tan} points={() => tanPts(tt())} stroke={() => (Math.abs(v() - 100) < 1.5 ? C.amber : C.ink)} lineWidth={7} shadowColor={C.amber} shadowBlur={14} opacity={0} />
      <Circle ref={dot} position={() => px(F, tt(), sAt(tt()))} size={28} fill={C.ink} shadowColor={C.ink} shadowBlur={14} opacity={0} />
      <Circle ref={hit} position={px(F, 6, sAt(6))} size={40} stroke={C.amber} lineWidth={6} opacity={0} />
    </Node>,
  );

  const eq = addEq(view, 290, 70);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 구간단속
  cue('whoosh');
  yield* road().opacity(1, 0.6);
  yield* cap.say('01', '구간단속: 카메라 A 에서 B 까지 20km', C.coral);
  yield* waitFor(0.8);
  cue('riser');
  yield* all(popIn(gauge()), clock().opacity(1, 0.4));
  yield* tt(12, 4.5, linear);
  cue('boom');
  yield* all(cap.say('02', '12분 만에 통과했다면?', C.coral), ring(view, [0, 110], C.amber, 160));
  yield* waitFor(0.6);
  yield* eq.set('20km ÷ 12분 = 시속 100km', C.ink, C.coral);
  yield* waitFor(1.4);
  yield* cap.say('03', '속도계는 60 에서 140 까지 오르내렸어요\n그런데 정확히 100 인 순간이 있었을까?', C.pink);
  yield* waitFor(2);

  // 2. 그래프로
  yield* wipe.cover();
  road().opacity(0);
  eq.node().opacity(0);
  clock().opacity(0);
  gauge().position([-170, -360]);
  gauge().scale(0.62);
  graph().opacity(1);
  tt(0);
  yield* wipe.reveal();
  yield* cap.say('04', '움직인 거리를 그래프로 그려 봐요');
  cue('whoosh');
  yield* all(dot().opacity(1, 0.3), tt(12, 4.5, linear));
  yield* waitFor(0.6);
  cue('swish');
  yield* all(sec().end(1, 0.8), secTag().opacity(1, 0.5), cap.say('05', '처음과 끝을 이은 직선의 기울기\n= 평균 속도 100', C.coral));
  yield* waitFor(1.6);

  // 3. 접선 = 순간 속도
  tt(0.5);
  yield* all(tan().opacity(1, 0.4), cap.say('06', '접선의 기울기 = 그 순간의 속도\n(1편의 미분!)', C.teal));
  yield* waitFor(0.8);
  cue('riser');
  yield* tt(6, 3, easeInOutCubic);
  cue('boom');
  yield* all(
    flash(0.14),
    hit().opacity(1, 0.2),
    ring(graph(), px(F, 6, sAt(6)), C.amber, 140),
    cap.say('07', '평균 직선과 나란한 순간!\n속도계도 딱 100', C.amber),
  );
  yield* waitFor(1.8);

  // 4. 평균값 정리
  yield* eq.set('평균 속도 = 어느 순간의 속도', C.ink, C.amber);
  yield* cap.say('08', '끊기지 않고 매끈하게 달렸다면\n이런 순간이 꼭 있어요 = 평균값 정리', C.teal);
  yield* waitFor(2.4);
  yield* all(sparks(view, [0, 290], C.amber, 14, 240), cap.say('09', '그래서 구간 평균이 100 을 넘으면\n어딘가에선 100 넘게 달린 거예요', C.coral));
  yield* waitFor(2.6);

  // 다음 편
  yield* wipe.cover();
  graph().opacity(0);
  gauge().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  03', '곡선 아래 넓이는\n어떻게 구할까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
