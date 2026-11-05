import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, linear, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, shake} from '../fx';
import {addSteps, addTimer} from '../sci';

// 수학 「종이 한 장 수학」 2편 — 종이띠를 반 바퀴 꼬면 면이 하나? (뫼비우스의 띠)
// 1) 만들기: 종이띠 → 반 바퀴 꼬기 → 테이프
// 2) 가운데에 연필 선: 한 바퀴 돌면 뒷면, 두 바퀴 돌아야 제자리 → 면이 하나
// 3) 퀴즈: 그 선을 따라 자르면? → 고리 두 개가 아니라 길이 2배인 큰 고리 하나 (두 바퀴 꼬임)
// 4) 댓글 질문: 1/3 지점을 자르면? (답은 말하지 않는다 — 직접 해 보기)
// 띠 그림은 3D 곡면을 사각형 조각으로 나눠 그리고, zIndex 로 앞뒤를 정렬한다.

const NAME = 'mobius';
type V3 = [number, number, number];

function makeStrip(o: {R: number; w: number; k: number; S: number; tilt: number; N: number; rgb: [number, number, number]; pen?: string; cut?: string}) {
  const phi = createSignal(0);
  const pen = createSignal(0);
  const cut = createSignal(0);
  const surf = (u: number, v: number): V3 => {
    const a = (o.k * u) / 2;
    const r = o.R + v * Math.cos(a);
    return [r * Math.cos(u), r * Math.sin(u), v * Math.sin(a)];
  };
  const h = 1e-3;
  const normal = (u: number): V3 => {
    const p1 = surf(u + h, 0), p0 = surf(u - h, 0), q1 = surf(u, h), q0 = surf(u, -h);
    const a: V3 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    const b: V3 = [q1[0] - q0[0], q1[1] - q0[1], q1[2] - q0[2]];
    const n: V3 = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const l = Math.hypot(...n) || 1;
    return [n[0] / l, n[1] / l, n[2] / l];
  };
  const ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
  // 화면 좌표 [x, y] 와 깊이 z (클수록 앞)
  const proj = (p: V3, f: number): V3 => {
    const x1 = p[0] * Math.cos(f) - p[1] * Math.sin(f);
    const y1 = p[0] * Math.sin(f) + p[1] * Math.cos(f);
    return [x1 * o.S, (y1 * ct - p[2] * st) * o.S, y1 * st + p[2] * ct];
  };
  const rotN = (n: V3, f: number) => {
    const y1 = n[0] * Math.sin(f) + n[1] * Math.cos(f);
    return y1 * st + n[2] * ct;
  };
  const kids: any[] = [];
  for (let i = 0; i < o.N; i++) {
    const u0 = (Math.PI * 2 * i) / o.N;
    const u1 = (Math.PI * 2 * (i + 1)) / o.N;
    const um = (u0 + u1) / 2;
    const corners = [surf(u0, -o.w), surf(u1, -o.w), surf(u1, o.w), surf(u0, o.w)];
    const nm = normal(um);
    const mid = surf(um, 0);
    kids.push(
      <Line
        points={() => corners.map(c => proj(c, phi()).slice(0, 2) as [number, number])}
        closed
        fill={() => {
          const b = 0.38 + 0.62 * Math.abs(rotN(nm, phi()));
          return `rgb(${Math.round(o.rgb[0] * b)},${Math.round(o.rgb[1] * b)},${Math.round(o.rgb[2] * b)})`;
        }}
        stroke={() => {
          const b = 0.38 + 0.62 * Math.abs(rotN(nm, phi()));
          return `rgb(${Math.round(o.rgb[0] * b)},${Math.round(o.rgb[1] * b)},${Math.round(o.rgb[2] * b)})`;
        }}
        lineWidth={1.5}
        zIndex={() => proj(mid, phi())[2] * 1000}
      />,
    );
  }
  // 연필 선: 띠 가운데에서 면 쪽으로 살짝 띄운 선, 두 바퀴 (4π)
  const EPS = 0.035;
  const penPt = (u: number): V3 => {
    const m = surf(u, 0), n = normal(u);
    return [m[0] + n[0] * EPS, m[1] + n[1] * EPS, m[2] + n[2] * EPS];
  };
  const M = o.N * 2;
  if (o.pen) {
    for (let j = 0; j < M; j++) {
      const a = penPt((Math.PI * 4 * j) / M), b = penPt((Math.PI * 4 * (j + 1)) / M);
      kids.push(
        <Line
          points={() => [proj(a, phi()).slice(0, 2) as [number, number], proj(b, phi()).slice(0, 2) as [number, number]]}
          stroke={o.pen}
          lineWidth={9}
          lineCap="round"
          end={() => Math.max(0, Math.min(1, pen() * M - j))}
          opacity={() => (pen() * M > j ? 1 : 0)}
          zIndex={() => ((proj(a, phi())[2] + proj(b, phi())[2]) / 2) * 1000 + 1}
        />,
      );
    }
  }
  // 가위 선: 띠 한가운데(두께 없음), 한 바퀴
  if (o.cut) {
    const C2 = o.N;
    for (let j = 0; j < C2; j++) {
      const a = surf((Math.PI * 2 * j) / C2, 0), b = surf((Math.PI * 2 * (j + 1)) / C2, 0);
      kids.push(
        <Line
          points={() => [proj(a, phi()).slice(0, 2) as [number, number], proj(b, phi()).slice(0, 2) as [number, number]]}
          stroke={o.cut}
          lineWidth={7}
          lineDash={[14, 10]}
          end={() => Math.max(0, Math.min(1, cut() * C2 - j))}
          opacity={() => (cut() * C2 > j ? 1 : 0)}
          zIndex={() => ((proj(a, phi())[2] + proj(b, phi())[2]) / 2) * 1000 + 2}
        />,
      );
    }
  }
  const dot = createRef<Circle>();
  if (o.pen) {
    kids.push(
      <Circle
        ref={dot}
        position={() => proj(penPt(Math.PI * 4 * pen()), phi()).slice(0, 2) as [number, number]}
        size={34}
        fill={C.ink}
        stroke={o.pen}
        lineWidth={6}
        shadowColor={o.pen}
        shadowBlur={24}
        opacity={0}
        zIndex={100000}
      />,
    );
  }
  return {kids, phi, pen, cut, dot};
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 뫼비우스의 띠 */
  const mob = makeStrip({R: 1, w: 0.36, k: 1, S: 300, tilt: 1.05, N: 90, rgb: [255, 194, 75], pen: C.violet, cut: C.coral});
  const mobN = createRef<Node>();
  view.add(<Node ref={mobN} y={-110}>{mob.kids}</Node>);
  yield mob.phi(Math.PI * 2 * 4, 70, linear);

  /* 자른 뒤: 두 바퀴 꼬인 큰 고리 (길이 2배) */
  const big = makeStrip({R: 1.35, w: 0.17, k: 4, S: 300, tilt: 1.05, N: 140, rgb: [61, 219, 196]});
  const bigN = createRef<Node>();
  view.add(<Node ref={bigN} y={-110} opacity={0}>{big.kids}</Node>);
  yield big.phi(-Math.PI * 2 * 2, 60, linear);

  /* 만들기 단계 */
  const PAPER = C.amber;
  const steps = addSteps(view, {
    badge: 'TRY  종이띠 하나면 OK',
    y: -230,
    steps: [
      {draw: () => <Rect width={200} height={50} radius={6} fill={PAPER} />, label: '길게 자른\n종이띠'},
      {
        draw: () => (
          <Node>
            <Rect width={200} height={50} radius={6} fill={PAPER} />
            <Line points={[[70, -70], [120, -35], [120, 35], [70, 70]]} radius={40} stroke={C.ink} lineWidth={7} endArrow arrowSize={18} />
          </Node>
        ),
        label: '한쪽 끝을\n반 바퀴 꼬기',
      },
      {
        draw: () => (
          <Node>
            <Circle size={170} stroke={PAPER} lineWidth={36} />
            <Rect y={-85} width={50} height={60} radius={4} fill={'#ffffffcc'} rotation={8} />
          </Node>
        ),
        label: '테이프로\n붙이기',
      },
    ],
  });

  /* 퀴즈 보기 */
  const quizN = createRef<Node>();
  const optA = createRef<Rect>();
  const optB = createRef<Rect>();
  const opt = (ref: any, x: number, head: string, body: string, color: string) => (
    <Rect ref={ref} x={x} width={420} height={168} radius={28} fill={'#0B1028e6'} stroke={color} lineWidth={4} shadowColor={color} shadowBlur={20}>
      <Txt y={-38} text={head} fontFamily={FONT} fontSize={56} fontWeight={900} fill={color} />
      <Txt y={34} text={body} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.ink} />
    </Rect>
  );
  view.add(
    <Node ref={quizN} y={262} opacity={0}>
      {opt(optA, -230, 'A', '고리 2개', C.violet)}
      {opt(optB, 230, 'B', '큰 고리 1개', C.teal)}
    </Node>,
  );
  const timer = addTimer(view, 'QUIZ', -575);

  const card = bigCard('뫼비우스의 띠 = 면이 하나!', C.amber, 64);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['종이띠를 반 바퀴 꼬면', '면이 하나뿐?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 3, series: '종이 한 장 수학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅: 첫 프레임부터 꼬인 띠가 돈다 ═════════ */
  mobN().scale(0.85);
  yield* all(hud.show(), title.hero(), mobN().scale(1, 1.3, easeInOutCubic));
  yield* title.dock();

  /* ═════════ 1. 만들기 ═════════ */
  yield* wipe.cover();
  mobN().opacity(0);
  yield* wipe.reveal();
  yield* steps.showBadge();
  yield* all(steps.step(0), cap.say('TRY', '종이를 길게 잘라 띠를 만들고', PAPER));
  yield* waitFor(0.8);
  yield* all(steps.step(1), cap.say('TRY', '한쪽 끝을 반 바퀴 꼬아서', PAPER));
  yield* waitFor(0.8);
  yield* all(steps.step(2), cap.say('TRY', '테이프로 붙이면 완성!', PAPER));
  yield* waitFor(0.8);
  yield* wipe.cover();
  steps.root().opacity(0);
  mobN().opacity(1);
  yield* wipe.reveal();

  /* ═════════ 2. 연필 선 두 바퀴 ═════════ */
  yield* cap.say('1', '띠 가운데에 연필로\n쭉 선을 그어 봐요', C.violet);
  mob.dot().opacity(1);
  cue('swish');
  yield* mob.pen(0.5, 3.2, linear);
  cue('pop');
  yield* all(cap.say('1', '한 바퀴 돌았는데…\n선이 뒷면에 와 있어요!', C.coral), punch(mobN(), 0.04));
  yield* waitFor(0.6);
  cue('swish');
  yield* mob.pen(1, 3.2, linear);
  cue('chime');
  yield* all(cap.say('1', '두 바퀴 만에 제자리!\n앞면 · 뒷면이 이어진 면 하나예요', C.teal), sparks(mobN(), [0, 0], C.violet, 14, 300));
  mob.dot().opacity(0);
  yield* waitFor(1.6);

  /* ═════════ 3. 퀴즈: 자르면? ═════════ */
  yield* cap.say('QUIZ', '이 선을 따라 가위로 자르면?', C.amber);
  cue('swish');
  yield* all(mob.cut(1, 2.0, linear), popIn(quizN(), 0.5, 0.6));
  timer.count(5);
  timer.node().opacity(1);
  yield* timer.run(5);
  timer.node().opacity(0);
  cue('boom');
  yield* all(optA().opacity(0.3, 0.3), punch(optB(), 0.12), cap.say('정답', '정답은 B! 두 개로 안 갈라져요', C.teal));
  yield* waitFor(0.6);
  yield* iris.cover([0, -110]);
  mobN().opacity(0);
  quizN().opacity(0);
  bigN().opacity(1);
  yield* iris.reveal([0, -110]);
  cue('chime');
  yield* all(cap.say('정답', '길이는 2배, 두 바퀴 꼬인\n큰 고리 하나!', C.teal), sparks(bigN(), [0, 0], C.teal, 16, 380));
  yield* waitFor(2.0);

  /* ═════════ 4. 정리 · 댓글 질문 ═════════ */
  yield* wipe.cover();
  bigN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '이름은 뫼비우스의 띠\n가위는 조심, 어른과 함께!', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.0);
  cue('pop');
  yield* all(cap.say('?', '1/3 지점을 따라 자르면?\n직접 해 보고 댓글로!', C.violet), shake(card, 10, 0.4));
  yield* waitFor(2.0);
  yield* all(cap.hide(), card.opacity(0, 0.3), end.show('NEXT  종이 한 장 수학', '종이를 몇 번 접으면\n달까지 닿을까?', '다음 편도 보려면 구독'));
  yield* waitFor(1.8);

  /* 첫 장면으로 이어지게 */
  mob.pen(0);
  mob.cut(0);
  yield* all(end.root().opacity(0, 0.4), title.group().opacity(0, 0.4), mobN().opacity(1, 0.4));
  yield* finish(NAME, 0.3);
});
