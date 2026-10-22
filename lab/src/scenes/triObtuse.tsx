import {Latex, Line, Node, Rect, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createRef, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {Backdrop, THEME, addChrome, rise} from '../style';
import {rightMark} from '../geometry';

const STAGE_Y = -200;
// 둔각삼각형 ABC: 밑변 AB = 300, 꼭짓점 C 는 B 바깥 위, 높이의 발 F 는 밑변 연장선 위
const A = new Vector2(-260, 130);
const B = new Vector2(40, 130);
const C = new Vector2(240, -130);
const F = new Vector2(240, 130);

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 삼각형 시리즈 3/4',
    lead: '높이가 밖에 있는 삼각형도',
    tex: 'a \\times h \\div 2',
    tail: '일까?',
  });

  const main = createRef<Line>();
  const outside = createRef<Node>();
  const labels = createRef<Node>();
  const big = createRef<Line>();
  const small = createRef<Line>();
  const formulaCard = createRef<Rect>();

  view.add(
    <Node y={STAGE_Y} x={10}>
      <Line
        ref={big}
        points={[A, F, C]}
        closed
        fill={'#9B8CFF33'}
        stroke={THEME.violet}
        lineWidth={4}
        lineJoin="round"
        opacity={0}
      />
      <Line
        ref={main}
        points={[A, B, C]}
        closed
        fill={'#FFC24B40'}
        stroke={THEME.amber}
        lineWidth={5}
        lineJoin="round"
        shadowColor={THEME.amber}
        shadowBlur={0}
        opacity={0}
      />
      <Line
        ref={small}
        points={[B, F, C]}
        closed
        fill={'#FF7A7A55'}
        stroke={THEME.coral}
        lineWidth={4}
        lineJoin="round"
        opacity={0}
      />
      <Node ref={outside} opacity={0}>
        <Line points={[B, F]} stroke={THEME.dim} lineWidth={4} lineDash={[12, 10]} />
        <Line points={[C, F]} stroke={THEME.ink} lineWidth={4} lineDash={[12, 10]} />
        <Line points={rightMark(F, -1)} stroke={THEME.ink} lineWidth={3} />
      </Node>
      <Node ref={labels} opacity={0}>
        <Latex x={(A.x + B.x) / 2} y={178} tex="a" height={40} fill={THEME.amber} />
        <Latex x={(B.x + F.x) / 2} y={178} tex="x" height={30} fill={THEME.coral} />
        <Latex x={F.x + 38} y={0} tex="h" height={40} fill={THEME.ink} />
      </Node>
    </Node>,
  );

  view.add(
    <Rect
      ref={formulaCard}
      y={150}
      layout
      direction="column"
      alignItems="center"
      gap={14}
      padding={[26, 48]}
      radius={36}
      fill="#FFC24B14"
      stroke="#FFC24B66"
      lineWidth={2}
      shadowColor={THEME.amber}
      shadowBlur={30}
      opacity={0}
    >
      <Latex tex="\frac{(a+x)\,h}{2} - \frac{x\,h}{2}" height={96} fill={THEME.ink} />
      <Latex tex="= \frac{a \times h}{2}" height={96} fill={THEME.amber} />
    </Rect>,
  );

  // 1. 질문
  yield* ui.intro();
  yield* rise(main(), 0.6, 16);
  yield* ui.say('STEP 1', '한 각이 90°보다 큰\n둔각삼각형이에요');
  yield* waitFor(2.4);

  // 2. 높이가 밖에
  yield* ui.say('STEP 2', '높이는 꼭짓점에서\n밑변을 늘인 선까지');
  yield* outside().opacity(1, 0.6);
  yield* rise(labels(), 0.5, 10);
  yield* waitFor(2.6);

  // 3. 큰 직각삼각형
  yield* ui.say('STEP 3', '높이를 품은\n큰 직각삼각형에서');
  yield* big().opacity(1, 0.6);
  yield* waitFor(2.2);

  // 4. 작은 직각삼각형 빼기
  yield* ui.say('STEP 4', '작은 직각삼각형을\n빼면');
  yield* small().opacity(1, 0.5);
  yield* waitFor(1.2);
  yield* all(
    small().x(160, 1.2, easeInOutCubic),
    small().opacity(0, 1.2),
    big().opacity(0, 1.2),
  );
  yield* all(main().shadowBlur(40, 0.4), main().scale(1.04, 0.4));
  yield* all(main().shadowBlur(0, 0.4), main().scale(1, 0.4));
  yield* ui.say('STEP 4', '처음 삼각형만 남아요');
  yield* waitFor(2.4);

  // 5. 정리
  yield* rise(formulaCard(), 0.6);
  yield* ui.say('정리', '높이가 밖에 있어도\n넓이는 a × h ÷ 2');
  yield* waitFor(3.6);
  yield* ui.say('NEXT', '다음 편 · 꼭짓점을 밀어도\n넓이가 같을까?');
  yield* waitFor(2.8);
});
