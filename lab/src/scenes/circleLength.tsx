import {Circle, Latex, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeOutBack,
  linear,
  range,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {Backdrop, FONT, THEME, addChrome, rise, swapTex} from '../style';

const R = 120;
const D = R * 2;
const CIRC = 2 * Math.PI * R; // 원둘레
const FLOOR = -150;
const X0 = -CIRC / 2; // 굴리기 시작할 때 원의 중심 x
const BAR_Y = FLOOR + 56;

export default makeScene2D(function* (view) {
  view.add(<Backdrop />);
  const ui = addChrome(view, {
    tag: '보면 풀리는 수학 · 원 시리즈 1/2',
    lead: '원의 둘레는 왜',
    tex: '2\\pi r',
    tail: '일까?',
  });

  const stage = createRef<Node>();
  const wheel = createRef<Circle>();
  const trail = createRef<Rect>();
  const dLabel = createRef<Latex>();
  const trailLabel = createRef<Txt>();
  const callout = createRef<Node>();
  const ratio = createRef<Rect>();
  const piRow = createRef<Rect>();
  const formulaCard = createRef<Rect>();
  const formula = createRef<Latex>();
  const bars: Rect[] = [];
  const barLabels: Latex[] = [];

  const barW = [D, D, D, CIRC - 3 * D];
  const barX: number[] = [];
  let acc = X0;
  for (const w of barW) {
    barX.push(acc + w / 2);
    acc += w;
  }

  view.add(
    <Node ref={stage} opacity={0}>
      {/* 자 모양 바닥 */}
      <Rect y={FLOOR} width={980} height={3} fill={'#ffffff40'} />
      {range(-20, 21).map(k => (
        <Rect
          x={k * 24}
          y={FLOOR + (k % 5 === 0 ? 11 : 7)}
          width={2}
          height={k % 5 === 0 ? 22 : 14}
          fill={'#ffffff26'}
        />
      ))}
      <Rect
        ref={trail}
        x={X0}
        y={FLOOR}
        offset={[-1, 0]}
        width={0}
        height={10}
        radius={5}
        fill={THEME.amber}
        shadowColor={THEME.amber}
        shadowBlur={28}
      />
      <Circle
        ref={wheel}
        x={X0}
        y={FLOOR - R}
        size={D}
        fill={'#3DDBC414'}
        stroke={THEME.teal}
        lineWidth={6}
        shadowColor={THEME.teal}
        shadowBlur={26}
      >
        <Line
          points={[[-R, 0], [R, 0]]}
          stroke={THEME.violet}
          lineWidth={8}
          lineCap="round"
          shadowColor={THEME.violet}
          shadowBlur={16}
        />
        <Circle size={14} fill={THEME.ink} />
        <Circle size={26} y={R} fill={THEME.amber} shadowColor={THEME.amber} shadowBlur={20} />
      </Circle>
      <Latex
        ref={dLabel}
        x={X0}
        y={FLOOR - 2 * R - 56}
        tex="d = 2r"
        height={50}
        fill={THEME.violet}
        opacity={0}
      />
      <Txt
        ref={trailLabel}
        x={-160}
        y={FLOOR - 48}
        text="원의 둘레"
        fontFamily={FONT}
        fontSize={44}
        fontWeight={800}
        fill={THEME.amber}
        opacity={0}
      />
      {barW.map((w, i) => (
        <Rect
          ref={el => (bars[i] = el)}
          x={barX[i]}
          y={BAR_Y - 70}
          width={w - 6}
          height={22}
          radius={11}
          fill={i < 3 ? THEME.violet : THEME.teal}
          shadowColor={i < 3 ? THEME.violet : THEME.teal}
          shadowBlur={18}
          opacity={0}
        />
      ))}
      {[0, 1, 2].map(i => (
        <Latex
          ref={el => (barLabels[i] = el)}
          x={barX[i]}
          y={BAR_Y + 48}
          tex="d"
          height={40}
          fill={THEME.violet}
          opacity={0}
        />
      ))}
      <Node ref={callout} opacity={0}>
        <Line
          points={[[barX[3], BAR_Y + 18], [barX[3], BAR_Y + 70]]}
          stroke={THEME.teal}
          lineWidth={3}
          lineDash={[6, 6]}
        />
        <Latex x={barX[3] - 30} y={BAR_Y + 104} tex="0.14\ldots d" height={38} fill={THEME.teal} />
      </Node>
    </Node>,
  );

  view.add(
    <>
      <Rect ref={ratio} y={120} layout direction="row" alignItems="center" gap={18} opacity={0}>
        <Txt text="둘레 ÷ 지름 =" fontFamily={FONT} fontSize={58} fontWeight={700} fill={THEME.ink} />
        <Latex tex="3.14159\ldots" height={52} fill={THEME.ink} />
      </Rect>
      <Rect ref={piRow} y={255} layout direction="row" alignItems="center" gap={24} opacity={0}>
        <Latex tex="\pi" height={110} fill={THEME.amber} shadowColor={THEME.amber} shadowBlur={36} />
        <Txt text="파이" fontFamily={FONT} fontSize={48} fontWeight={700} fill={THEME.dim} />
      </Rect>
      <Rect
        ref={formulaCard}
        y={170}
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
        <Txt text="둘레 =" fontFamily={FONT} fontSize={70} fontWeight={800} fill={THEME.ink} />
        <Latex ref={formula} tex={'\\pi \\times d'} height={78} fill={THEME.amber} />
      </Rect>
    </>,
  );

  // 1. 질문
  yield* ui.intro();
  yield* stage().opacity(1, 0.6);
  yield* waitFor(1);

  // 2. 지름
  yield* ui.say('STEP 1', '지름은 원을 가로지르는\n가장 긴 선이에요');
  yield* rise(dLabel(), 0.5, 16);
  yield* waitFor(2.2);

  // 3. 한 바퀴 굴리기
  yield* ui.say('STEP 2', '원을 땅에서\n딱 한 바퀴 굴려 볼게요');
  yield* dLabel().opacity(0, 0.3);
  yield* all(
    wheel().x(X0 + CIRC, 4.5, linear),
    wheel().rotation(360, 4.5, linear),
    trail().width(CIRC, 4.5, linear),
  );
  yield* rise(trailLabel(), 0.5, 14);
  yield* ui.say('STEP 2', '굴러간 길이가\n바로 원의 둘레예요');
  yield* waitFor(2);

  // 4. 지름으로 재 보기
  yield* ui.say('STEP 3', '이 길이를\n지름으로 재 보면?');
  yield* sequence(
    0.55,
    ...[0, 1, 2].map(i =>
      all(
        bars[i].opacity(1, 0.25),
        bars[i].y(BAR_Y, 0.6, easeOutBack),
        barLabels[i].opacity(1, 0.4),
      ),
    ),
  );
  yield* waitFor(0.3);
  yield* all(bars[3].opacity(1, 0.25), bars[3].y(BAR_Y, 0.6, easeOutBack));
  yield* rise(callout(), 0.4, 10);
  yield* ui.say('STEP 3', '지름 3개 하고…\n조금 더!');
  yield* waitFor(2.6);

  // 5. π
  yield* rise(ratio(), 0.6);
  yield* waitFor(0.8);
  yield* rise(piRow(), 0.7);
  yield* ui.say('STEP 4', '어떤 크기의 원이든\n늘 같은 수, 이게 π 예요');
  yield* waitFor(3.2);

  // 6. 정리 — 식이 바뀌는 모습
  yield* all(ratio().opacity(0, 0.4), piRow().opacity(0, 0.4));
  yield* rise(formulaCard(), 0.6);
  yield* ui.say('STEP 5', '지름은 반지름의 2배니까');
  yield* waitFor(0.8);
  yield* swapTex(formula(), '\\pi \\times 2r');
  yield* waitFor(0.8);
  yield* swapTex(formula(), '2\\pi r');
  yield* all(formulaCard().scale(1.08, 0.3), formulaCard().shadowBlur(60, 0.3));
  yield* all(formulaCard().scale(1, 0.3), formulaCard().shadowBlur(30, 0.3));
  yield* waitFor(2.4);

  yield* ui.say('NEXT', '다음 편 · 원의 넓이는 왜 πr² 일까?');
  yield* waitFor(3);
});
