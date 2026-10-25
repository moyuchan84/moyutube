import {Circle, Latex, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {Backdrop, FONT, THEME, addChrome, rise} from '../style';
import {norm180, sector} from '../geometry';

const STAGE_Y = -230;
const A = new Vector2(-300, 140);
const B = new Vector2(300, 140);
const C0 = new Vector2(-80, -180);
const O = new Vector2(0, 370); // 세 각을 모을 점 (무대 좌표)
const R = 95;

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 삼각형 시리즈 1/4',
    lead: '삼각형 세 각의 합은 왜',
    tex: '180^\\circ',
    tail: '일까?',
  });

  const cx = createSignal(C0.x);
  const cy = createSignal(C0.y);
  const C = () => new Vector2(cx(), cy());

  // 꼭짓점마다 [위치, 이웃1, 이웃2, 색, 글자]
  const corners = [
    {V: () => A, P: () => B, Q: C, color: THEME.amber, tex: '\\alpha'},
    {V: () => B, P: () => A, Q: C, color: THEME.teal, tex: '\\beta'},
    {V: C, P: () => A, Q: () => B, color: THEME.violet, tex: '\\gamma'},
  ];
  const sec = corners.map(k => () => sector(k.V(), k.P(), k.Q()));

  const tri = createRef<Line>();
  const live: Circle[] = [];
  const labels: Latex[] = [];
  const torn: Circle[] = [];
  const readout = createRef<Rect>();
  const floor = createRef<Node>();
  const straight = createRef<Latex>();
  const formulaCard = createRef<Rect>();

  view.add(
    <Node y={STAGE_Y}>
      <Line
        ref={tri}
        points={() => [A, B, C()]}
        closed
        fill={'#ffffff0a'}
        stroke={THEME.ink}
        lineWidth={5}
        lineJoin="round"
        opacity={0}
      />
      {corners.map((k, i) => (
        <Circle
          ref={el => (live[i] = el)}
          position={k.V}
          size={R * 2}
          startAngle={() => sec[i]().start}
          endAngle={() => sec[i]().start + sec[i]().sweep}
          closed
          fill={k.color}
          opacity={0}
          shadowColor={k.color}
          shadowBlur={20}
        />
      ))}
      {corners.map((k, i) => (
        <Latex
          ref={el => (labels[i] = el)}
          tex={k.tex}
          height={40}
          fill={k.color}
          position={() => {
            const s = sec[i]();
            const mid = ((s.start + s.sweep / 2) * Math.PI) / 180;
            return k.V().add(new Vector2(Math.cos(mid), Math.sin(mid)).scale(R + 42));
          }}
          opacity={0}
        />
      ))}
      <Node ref={floor} opacity={0}>
        <Line points={[[O.x - 360, O.y], [O.x + 360, O.y]]} stroke={'#ffffff66'} lineWidth={4} />
        <Circle position={O} size={14} fill={THEME.ink} />
      </Node>
      {corners.map((k, i) => (
        <Circle
          ref={el => (torn[i] = el)}
          size={R * 2}
          closed
          fill={k.color}
          shadowColor={k.color}
          shadowBlur={20}
          opacity={0}
        />
      ))}
      <Latex
        ref={straight}
        position={O.add([0, -R - 50])}
        tex="180^\circ"
        height={56}
        fill={THEME.ink}
        shadowColor={THEME.ink}
        shadowBlur={16}
        opacity={0}
      />
    </Node>,
  );

  view.add(
    <>
      <Rect
        ref={readout}
        y={150}
        layout
        padding={[22, 40]}
        radius={28}
        fill="#ffffff0d"
        stroke="#ffffff22"
        lineWidth={2}
        opacity={0}
      >
        <Txt
          fontFamily={FONT}
          fontSize={52}
          fontWeight={800}
          fill={THEME.ink}
          text={() => {
            // 반올림 오차로 179°·181° 가 보이지 않게 γ 는 나머지로 쓴다 (실제 값과 1° 안쪽)
            const a = Math.round(sec[0]().sweep);
            const b = Math.round(sec[1]().sweep);
            return `${a}° + ${b}° + ${180 - a - b}° = 180°`;
          }}
        />
      </Rect>
      <Rect
        ref={formulaCard}
        y={250}
        layout
        padding={[30, 52]}
        radius={36}
        fill="#FFC24B14"
        stroke="#FFC24B66"
        lineWidth={2}
        shadowColor={THEME.amber}
        shadowBlur={30}
        opacity={0}
      >
        <Latex tex="\alpha + \beta + \gamma = 180^\circ" height={64} fill={THEME.amber} />
      </Rect>
    </>,
  );

  // 1. 질문
  yield* ui.intro();
  yield* tri().opacity(1, 0.6);
  yield* waitFor(0.8);

  // 2. 세 각 칠하기
  yield* ui.say('STEP 1', '세 각에 색을\n칠해 볼게요');
  yield* sequence(
    0.3,
    ...live.map((s, i) => all(s.opacity(0.9, 0.5), labels[i].opacity(1, 0.5))),
  );
  yield* waitFor(1.4);

  // 3. 모양을 바꿔도
  yield* ui.say('STEP 2', '모양을 바꿔도\n합은 늘 180°');
  yield* rise(readout(), 0.5, 16);
  yield* all(cx(170, 1.8, easeInOutCubic), cy(-230, 1.8, easeInOutCubic));
  yield* all(cx(-250, 2, easeInOutCubic), cy(-90, 2, easeInOutCubic));
  yield* all(cx(C0.x, 1.4, easeInOutCubic), cy(C0.y, 1.4, easeInOutCubic));
  yield* waitFor(0.6);
  yield* readout().opacity(0, 0.3);

  // 4. 세 각을 잘라 한 점에 모으기
  yield* ui.say('STEP 3', '세 각을 잘라서\n한 점에 모으면?');
  const sweeps = sec.map(s => s().sweep);
  const targets = [180, 180 + sweeps[0] + sweeps[2], 180 + sweeps[0]]; // α · β · γ 가 놓일 시작 각
  torn.forEach((t, i) => {
    const s = sec[i]();
    t.position(corners[i].V());
    t.startAngle(s.start);
    t.endAngle(s.start + s.sweep);
    t.rotation(0);
    t.opacity(0.9);
  });
  live.forEach(s => s.opacity(0.18));
  yield* floor().opacity(1, 0.4);
  yield* sequence(
    0.25,
    ...torn.map((t, i) =>
      all(
        t.position(O, 1.3, easeInOutCubic),
        t.rotation(norm180(targets[i] - sec[i]().start), 1.3, easeInOutCubic),
      ),
    ),
  );
  yield* rise(straight(), 0.5, 12);
  yield* ui.say('STEP 3', '딱 일직선!\n반 바퀴 = 180°');
  yield* waitFor(2.6);

  // 5. 정리
  yield* rise(formulaCard(), 0.6);
  yield* ui.say('정리', '어떤 삼각형이든\n세 각을 더하면 180°');
  yield* waitFor(3);
  yield* ui.say('NEXT', '다음 편 · 삼각형 넓이는\n왜 ÷2 를 할까?');
  yield* waitFor(2.8);
});
