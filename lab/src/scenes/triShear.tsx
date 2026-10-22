import {Grid, Latex, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {Backdrop, FONT, THEME, addChrome, rise} from '../style';
import {rightMark} from '../geometry';

const STAGE_Y = -200;
const U = 50; // 모눈 한 칸
const BASE_Y = 125;
const A = new Vector2(-200, BASE_Y);
const B = new Vector2(200, BASE_Y); // 밑변 8칸

const fmt = (n: number) => (Math.round(n * 10) / 10).toString();

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 삼각형 시리즈 4/4',
    lead: '꼭짓점을 옆으로 밀어도',
    tex: '',
    tail: '넓이가 같을까?',
  });

  const px = createSignal(-100);
  const py = createSignal(BASE_Y - 5 * U); // 높이 5칸
  const P = () => new Vector2(px(), py());
  const h = () => (BASE_Y - py()) / U;

  const stage = createRef<Node>();
  const rail = createRef<Line>();
  const ghosts: Line[] = [];
  const readout = createRef<Rect>();
  const formulaCard = createRef<Rect>();

  const ghostAt = [300, -340];

  view.add(
    <Node ref={stage} y={STAGE_Y} opacity={0}>
      <Grid width={800} height={400} y={-75} spacing={U} stroke={'#ffffff1a'} lineWidth={1} />
      <Line
        ref={rail}
        points={() => [[-420, py()], [420, py()]]}
        stroke={THEME.violet}
        lineWidth={3}
        lineDash={[14, 10]}
        opacity={0}
      />
      {ghostAt.map((gx, i) => (
        <Line
          ref={el => (ghosts[i] = el)}
          points={[A, B, [gx, BASE_Y - 5 * U]]}
          closed
          stroke={THEME.dim}
          lineWidth={3}
          lineDash={[8, 8]}
          opacity={0}
        />
      ))}
      {/* 밑변 연장선 (꼭짓점이 밑변 밖으로 나갈 때만) */}
      <Line
        points={() => {
          const x = px();
          return x > B.x ? [B, [x, BASE_Y]] : x < A.x ? [A, [x, BASE_Y]] : [B, B];
        }}
        stroke={THEME.dim}
        lineWidth={3}
        lineDash={[10, 8]}
      />
      <Line
        points={() => [A, B, P()]}
        closed
        fill={'#FFC24B40'}
        stroke={THEME.amber}
        lineWidth={5}
        lineJoin="round"
        shadowColor={THEME.amber}
        shadowBlur={18}
      />
      <Line points={[A, B]} stroke={THEME.teal} lineWidth={8} lineCap="round" />
      <Line
        points={() => [P(), [px(), BASE_Y]]}
        stroke={THEME.coral}
        lineWidth={4}
        lineDash={[12, 10]}
      />
      <Line
        points={() => rightMark(new Vector2(px(), BASE_Y), px() > 0 ? -1 : 1, 18)}
        stroke={THEME.coral}
        lineWidth={3}
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
          fontSize={50}
          fontWeight={800}
          fill={THEME.ink}
          text={() => `밑변 8 × 높이 ${fmt(h())} ÷ 2 = ${fmt((8 * h()) / 2)}칸`}
        />
      </Rect>
      <Rect
        ref={formulaCard}
        y={170}
        layout
        direction="row"
        alignItems="center"
        gap={22}
        padding={[30, 52]}
        radius={36}
        fill="#FFC24B14"
        stroke="#FFC24B66"
        lineWidth={2}
        shadowColor={THEME.amber}
        shadowBlur={30}
        opacity={0}
      >
        <Txt text="넓이 =" fontFamily={FONT} fontSize={66} fontWeight={800} fill={THEME.ink} />
        <Latex tex="\frac{a \times h}{2}" height={110} fill={THEME.amber} />
      </Rect>
    </>,
  );

  // 1. 질문
  yield* ui.intro();
  yield* stage().opacity(1, 0.6);
  yield* ui.say('STEP 1', '밑변 8칸, 높이 5칸\n삼각형이에요');
  yield* rise(readout(), 0.5, 14);
  yield* waitFor(2.2);

  // 2. 옆으로 밀기
  yield* ui.say('STEP 2', '꼭짓점을 밑변과 나란히\n옆으로 밀어 볼게요');
  yield* rail().opacity(1, 0.4);
  yield* px(ghostAt[0], 2, easeInOutCubic);
  yield* ghosts[0].opacity(0.6, 0.3);
  yield* px(ghostAt[1], 2.4, easeInOutCubic);
  yield* ghosts[1].opacity(0.6, 0.3);
  yield* px(-100, 1.4, easeInOutCubic);
  yield* ui.say('STEP 2', '모양은 달라져도\n넓이는 그대로 20칸!');
  yield* waitFor(2.6);

  // 3. 높이를 바꾸면
  yield* ui.say('STEP 3', '이번엔 높이를 바꾸면?');
  yield* all(...ghosts.map(g => g.opacity(0, 0.3)));
  yield* py(BASE_Y - 7 * U, 1.6, easeInOutCubic);
  yield* waitFor(1.2);
  yield* ui.say('STEP 3', '높이가 달라지면\n넓이도 달라져요');
  yield* py(BASE_Y - 3 * U, 1.8, easeInOutCubic);
  yield* waitFor(0.8);
  yield* py(BASE_Y - 5 * U, 1.2, easeInOutCubic);
  yield* waitFor(0.6);

  // 4. 정리
  yield* readout().opacity(0, 0.3);
  yield* rise(formulaCard(), 0.6);
  yield* ui.say('정리', '밑변과 높이가 같으면\n넓이도 같아요');
  yield* waitFor(3.4);
  yield* ui.say('시리즈 끝', '세 각의 합 180° · 넓이 a × h ÷ 2\n삼각형 끝!');
  yield* waitFor(3);
});
