import {Latex, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createRef, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {Backdrop, FONT, THEME, addChrome, rise} from '../style';
import {rightMark} from '../geometry';

const STAGE_Y = -200;
const AMBER_FILL = '#FFC24B40';
const VIOLET_FILL = '#9B8CFF40';
const TEAL_FILL = '#3DDBC455';

// 직각삼각형
const RA = new Vector2(-200, 130);
const RB = new Vector2(200, 130);
const RC = new Vector2(-200, -130);

// 예각삼각형: 밑변 AB = 400, 높이 260, 높이의 발 F
const A = new Vector2(-200, 130);
const B = new Vector2(200, 130);
const C = new Vector2(-60, -130);
const F = new Vector2(-60, 130);
const M = B.add(C).scale(0.5); // 복사본을 돌릴 중심 (변 BC 의 가운데)

const tri = (pts: Vector2[], fill: string, stroke: string) => (
  <Line points={pts} closed fill={fill} stroke={stroke} lineWidth={4} lineJoin="round" />
);

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 삼각형 시리즈 2/4',
    lead: '삼각형 넓이는 왜',
    tex: '\\div 2',
    tail: '를 할까?',
  });

  const g1 = createRef<Node>();
  const copy1 = createRef<Node>();
  const rect1 = createRef<Rect>();
  const g2 = createRef<Node>();
  const copy2 = createRef<Node>();
  const piece = createRef<Node>();
  const pieceShape = createRef<Line>();
  const heightLine = createRef<Node>();
  const marks = createRef<Node>();
  const formulaCard = createRef<Rect>();

  view.add(
    <Node y={STAGE_Y}>
      {/* 직각삼각형 */}
      <Node ref={g1} opacity={0}>
        {tri([RA, RB, RC], AMBER_FILL, THEME.amber)}
        <Node ref={copy1} opacity={0}>
          {tri([RA, RB, RC], VIOLET_FILL, THEME.violet)}
        </Node>
        <Rect
          ref={rect1}
          width={400}
          height={260}
          stroke={THEME.ink}
          lineWidth={6}
          shadowColor={THEME.ink}
          shadowBlur={24}
          opacity={0}
        />
      </Node>

      {/* 예각삼각형 (가운데에 오도록 왼쪽으로 70 옮김) */}
      <Node ref={g2} x={-70} opacity={0}>
        {tri([F, B, C], AMBER_FILL, THEME.amber)}
        <Node ref={piece}>
          <Line
            ref={pieceShape}
            points={[A, F, C]}
            closed
            fill={AMBER_FILL}
            stroke={THEME.amber}
            lineWidth={4}
            lineJoin="round"
          />
        </Node>
        <Node ref={copy2} position={M} opacity={0}>
          {tri([A.sub(M), B.sub(M), C.sub(M)], VIOLET_FILL, THEME.violet)}
        </Node>
        <Node ref={heightLine} opacity={0}>
          <Line points={[C, F]} stroke={THEME.ink} lineWidth={4} lineDash={[12, 10]} />
          <Line points={rightMark(F, 1)} stroke={THEME.ink} lineWidth={3} />
        </Node>
        <Node ref={marks} opacity={0}>
          <Line
            points={[[F.x, 185], [F.x + 400, 185]]}
            stroke={THEME.teal}
            lineWidth={5}
            startArrow
            endArrow
            arrowSize={14}
          />
          <Latex x={F.x + 200} y={225} tex="a" height={40} fill={THEME.teal} />
          <Line
            points={[[F.x + 440, -130], [F.x + 440, 130]]}
            stroke={THEME.coral}
            lineWidth={5}
            startArrow
            endArrow
            arrowSize={14}
          />
          <Latex x={F.x + 475} tex="h" height={40} fill={THEME.coral} />
        </Node>
      </Node>
    </Node>,
  );

  view.add(
    <Rect
      ref={formulaCard}
      y={175}
      layout
      direction="row"
      alignItems="center"
      gap={24}
      padding={[30, 52]}
      radius={36}
      fill="#FFC24B14"
      stroke="#FFC24B66"
      lineWidth={2}
      shadowColor={THEME.amber}
      shadowBlur={30}
      opacity={0}
    >
      <Txt text="삼각형 =" fontFamily={FONT} fontSize={66} fontWeight={800} fill={THEME.ink} />
      <Latex tex="\frac{a \times h}{2}" height={110} fill={THEME.amber} />
    </Rect>,
  );

  // 1. 질문
  yield* ui.intro();
  yield* waitFor(0.6);

  // 2. 직각삼각형
  yield* ui.say('STEP 1', '먼저 직각삼각형부터');
  yield* rise(g1(), 0.6, 16);
  yield* waitFor(1.6);
  yield* ui.say('STEP 1', '똑같은 삼각형을 하나 더\n돌려 붙이면');
  yield* copy1().opacity(1, 0.3);
  yield* copy1().rotation(180, 1.4, easeInOutCubic);
  yield* rect1().opacity(1, 0.5);
  yield* ui.say('STEP 1', '직사각형!\n삼각형은 그 절반이에요');
  yield* waitFor(2.6);

  // 3. 예각삼각형
  yield* g1().opacity(0, 0.4);
  yield* ui.say('STEP 2', '뾰족한 삼각형도\n해 볼까요?');
  yield* rise(g2(), 0.6, 16);
  yield* waitFor(1.4);
  yield* copy2().opacity(1, 0.3);
  yield* copy2().rotation(180, 1.4, easeInOutCubic);
  yield* ui.say('STEP 2', '똑같이 돌려 붙이면\n평행사변형');
  yield* waitFor(2.2);

  // 4. 잘라 옮기기
  yield* ui.say('STEP 3', '높이를 따라 잘라서\n옆으로 옮기면');
  yield* heightLine().opacity(1, 0.5);
  yield* pieceShape().fill(TEAL_FILL, 0.4);
  yield* pieceShape().stroke(THEME.teal, 0.3);
  yield* waitFor(0.5);
  yield* piece().x(400, 1.4, easeInOutCubic);
  yield* heightLine().opacity(0, 0.3);
  yield* rise(marks(), 0.5, 12);
  yield* ui.say('STEP 3', '밑변 a, 높이 h 인\n직사각형이 됐어요');
  yield* waitFor(2.6);

  // 5. 정리
  yield* rise(formulaCard(), 0.6);
  yield* ui.say('정리', '삼각형 두 개 = 직사각형\n그래서 넓이는 ÷ 2');
  yield* waitFor(3.2);
  yield* ui.say('NEXT', '다음 편 · 높이가\n삼각형 밖에 있다면?');
  yield* waitFor(2.8);
});
