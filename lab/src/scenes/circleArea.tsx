import {Circle, Latex, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  range,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {Backdrop, FONT, THEME, addChrome, rise, swapTex} from '../style';

const R = 250;
const CENTER_Y = -180;
const COLORS = [THEME.amber, THEME.violet];

// 조각 크기
function dims(n: number) {
  const theta = (Math.PI * 2) / n;
  return {chord: 2 * R * Math.sin(theta / 2), h: R * Math.cos(theta / 2)};
}

// i번째 조각이 직사각형 배열에서 놓일 꼭짓점 자리와 회전.
// 마지막 조각은 반으로 갈라 오른쪽 반을 맨 왼쪽에 붙인다 → 양끝이 수직인 직사각형이 된다.
function target(n: number, i: number, extraHalf = false): {pos: Vector2; rot: number} {
  const {chord, h} = dims(n);
  const x0 = (-n * chord) / 4 + chord / 2;
  const up = i % 2 === 0;
  const x = extraHalf ? x0 - chord / 2 : x0 + (i * chord) / 2;
  const y = up ? h / 2 : -h / 2;
  const base = up ? -90 : 90;
  const start = (360 / n) * i;
  const rot = base + 360 * Math.round((start - base) / 360);
  return {pos: new Vector2(x, y), rot};
}

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 원 시리즈 2/2',
    lead: '원의 넓이는 왜',
    tex: '\\pi r^2',
    tail: '일까?',
  });

  const coarse: Circle[] = [];
  const fine: Circle[] = [];
  const coarseGroup = createRef<Node>();
  const fineGroup = createRef<Node>();
  const glow = createRef<Circle>();
  const recap = createRef<Rect>();
  const widthMark = createRef<Node>();
  const heightMark = createRef<Node>();
  const formulaCard = createRef<Rect>();
  const formula = createRef<Latex>();

  // n 개 조각 + 마지막 조각의 오른쪽 반
  const pie = (list: Circle[], n: number) =>
    range(n + 1).map(i => {
      const k = i === n ? n - 1 : i;
      return (
        <Circle
          ref={makeRef(list, i)}
          size={R * 2}
          startAngle={i === n - 1 ? 0 : -180 / n}
          endAngle={i === n ? 0 : 180 / n}
          closed
          fill={COLORS[k % 2]}
          stroke={THEME.bg}
          lineWidth={n > 20 ? 1.5 : 4}
          rotation={(360 / n) * k}
        />
      );
    });

  const {chord: fChord} = dims(48);
  const W = (48 * fChord) / 2; // 직사각형 가로 (≈ πr)
  const H = R;

  view.add(
    <>
      <Rect
        ref={recap}
        y={-520}
        layout
        direction="row"
        alignItems="center"
        gap={16}
        padding={[14, 30]}
        radius={999}
        fill="#9B8CFF1f"
        stroke="#9B8CFF66"
        lineWidth={2}
        opacity={0}
      >
        <Txt text="지난 편" fontFamily={FONT} fontSize={32} fontWeight={700} fill={THEME.violet} />
        <Txt text="둘레 =" fontFamily={FONT} fontSize={34} fontWeight={700} fill={THEME.ink} />
        <Latex tex="2\pi r" height={34} fill={THEME.ink} />
      </Rect>
      <Node y={CENTER_Y}>
        <Circle ref={glow} size={R * 2 + 60} fill={'#FFC24B10'} shadowColor={THEME.amber} shadowBlur={80} opacity={0} />
        <Node ref={coarseGroup} opacity={0} scale={0.9}>
          {pie(coarse, 12)}
        </Node>
        <Node ref={fineGroup} opacity={0}>
          {pie(fine, 48)}
        </Node>
        <Node ref={widthMark} y={H / 2 + 56} opacity={0}>
          <Line
            points={[[-W / 2, 0], [W / 2, 0]]}
            stroke={THEME.teal}
            lineWidth={5}
            startArrow
            endArrow
            arrowSize={16}
            shadowColor={THEME.teal}
            shadowBlur={14}
          />
          <Latex y={84} tex="\frac{2\pi r}{2} = \pi r" height={100} fill={THEME.teal} />
        </Node>
        <Node ref={heightMark} x={W / 2 + 36} opacity={0}>
          <Line
            points={[[0, -H / 2], [0, H / 2]]}
            stroke={THEME.coral}
            lineWidth={5}
            startArrow
            endArrow
            arrowSize={16}
            shadowColor={THEME.coral}
            shadowBlur={14}
          />
          <Latex x={34} tex="r" height={36} fill={THEME.coral} />
        </Node>
      </Node>
      <Rect
        ref={formulaCard}
        y={235}
        layout
        direction="row"
        alignItems="center"
        gap={24}
        padding={[34, 56]}
        radius={36}
        fill="#FFC24B14"
        stroke="#FFC24B66"
        lineWidth={2}
        shadowColor={THEME.amber}
        shadowBlur={30}
        opacity={0}
      >
        <Txt text="넓이 =" fontFamily={FONT} fontSize={70} fontWeight={800} fill={THEME.ink} />
        <Latex ref={formula} tex={'\\pi r \\times r'} height={70} fill={THEME.amber} />
      </Rect>
    </>,
  );

  // 1. 질문 + 지난 편
  yield* ui.intro();
  yield* rise(recap(), 0.5, 16);
  yield* all(coarseGroup().opacity(1, 0.7), coarseGroup().scale(1, 0.9, easeOutCubic), glow().opacity(1, 0.9));
  yield* waitFor(1.6);

  // 2. 피자처럼 자르기
  yield* ui.say('STEP 1', '원을 피자처럼\n똑같이 잘라요');
  const out = (n: number, i: number) => {
    const a = (Math.PI * 2 * (i === n ? n - 1 : i)) / n;
    return new Vector2(Math.cos(a), Math.sin(a)).scale(30);
  };
  yield* all(...coarse.map((w, i) => w.position(out(12, i), 0.7, easeOutCubic)));
  yield* waitFor(0.5);
  yield* all(...coarse.map(w => w.position(0, 0.5)));

  // 3. 엇갈려 붙이기
  yield* ui.say('STEP 2', '위, 아래 번갈아\n끼워 맞추면…');
  yield* glow().opacity(0, 0.4);
  yield* recap().opacity(0, 0.4);
  yield* sequence(
    0.07,
    ...coarse.map((w, i) => {
      const t = i === 12 ? target(12, 11, true) : target(12, i);
      return all(w.position(t.pos, 1.3, easeInOutCubic), w.rotation(t.rot, 1.3, easeInOutCubic));
    }),
  );
  yield* waitFor(1.2);

  // 4. 더 잘게
  yield* ui.say('STEP 3', '더 잘게 자를수록\n거의 직사각형!');
  fine.forEach((w, i) => {
    const t = i === 48 ? target(48, 47, true) : target(48, i);
    w.position(t.pos);
    w.rotation(t.rot);
  });
  yield* all(coarseGroup().opacity(0, 1), fineGroup().opacity(1, 1));
  yield* waitFor(1.4);

  // 5. 가로 · 세로
  yield* ui.say('STEP 4', '가로는 둘레의 절반\n세로는 반지름');
  yield* rise(widthMark(), 0.6, 14);
  yield* rise(heightMark(), 0.6, 14);
  yield* waitFor(3);

  // 6. 정리
  yield* ui.say('STEP 5', '직사각형 넓이는\n가로 × 세로');
  yield* rise(formulaCard(), 0.6);
  yield* waitFor(1);
  yield* swapTex(formula(), '\\pi r^2');
  yield* all(formulaCard().scale(1.08, 0.3), formulaCard().shadowBlur(60, 0.3));
  yield* all(formulaCard().scale(1, 0.3), formulaCard().shadowBlur(30, 0.3));
  yield* ui.say('정리', 'π × 반지름 × 반지름\n이게 원의 넓이예요');
  yield* waitFor(3.5);
});
