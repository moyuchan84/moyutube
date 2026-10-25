import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createRef, createSignal, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addFlash,
  addHud,
  addTitle,
  addWipe,
  begin,
  cue,
  finish,
  popIn,
  punch,
  ring,
  sparks,
} from '../motion';

const NAME = 'mulRoot2';
const U = 170; // 모눈 한 칸 = 1
const STAGE_Y = -250;

const CORNERS: [number, number][] = [
  [-U, -U],
  [U, -U],
  [U, U],
  [-U, U],
];
const MIDS: [number, number][] = [
  [0, -U],
  [U, 0],
  [0, U],
  [-U, 0],
];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.pink);
  yield atmo.drift();
  const hud = addHud(view, {ep: 6, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['넓이가 2 인 정사각형,', '한 변은 몇?'], C.pink);

  const stage = createRef<Node>();
  const cellsN = createRef<Node>();
  const diamond = createRef<Line>();
  const diamondFill = createRef<Line>();
  const tris: Line[] = [];
  const fold = [0, 1, 2, 3].map(() => createSignal(0));
  const areaTxt = createRef<Txt>();
  const sideLab = createRef<Node>();

  view.add(
    <Node ref={stage} y={STAGE_Y}>
      <Node ref={cellsN} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            x={(i % 2 === 0 ? -1 : 1) * (U / 2)}
            y={(i < 2 ? -1 : 1) * (U / 2)}
            size={U - 6}
            radius={12}
            fill={'#ffffff10'}
            stroke={'#ffffff55'}
            lineWidth={3}
          />
        ))}
        <Rect size={2 * U} stroke={C.ink} lineWidth={5} />
      </Node>
      <Line ref={diamondFill} points={MIDS} closed fill={C.pink + '00'} />
      {/* 모서리 삼각형 4개: 꼭짓점이 가운데로 접힌다 */}
      {CORNERS.map((corner, i) => {
        const a = MIDS[i === 0 ? 3 : i - 1];
        const b = MIDS[i];
        return (
          <Line
            ref={el => (tris[i] = el)}
            points={() => [a, b, new Vector2(corner).lerp(Vector2.zero, fold[i]())]}
            closed
            fill={[C.amber, C.teal, C.violet, C.coral][i] + 'cc'}
            stroke={'#0B1028'}
            lineWidth={3}
            opacity={0}
          />
        );
      })}
      <Line ref={diamond} points={MIDS} closed stroke={C.pink} lineWidth={7} end={0} shadowColor={C.pink} shadowBlur={24} />
      <Txt ref={areaTxt} fontFamily={FONT} fontSize={52} fontWeight={900} fill={'#ffffff'} shadowColor={'#000'} shadowBlur={20} opacity={0} />
      <Node ref={sideLab} position={[U / 2 + 46, -U / 2 - 46]} opacity={0}>
        <Txt text={'√2'} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.pink} shadowColor={'#000000cc'} shadowBlur={14} />
      </Node>
    </Node>,
  );

  // 2부: 어림해 보기
  const trial = createRef<Node>();
  const trialRows: Node[] = [];
  const TRIALS = [
    {a: '1.4', sq: '1.96', v: 1.96},
    {a: '1.41', sq: '1.9881', v: 1.9881},
    {a: '1.414', sq: '1.999396', v: 1.999396},
  ];
  const barFill = createSignal(0);
  const barNode = createRef<Node>();
  const BAR_W = 800;
  view.add(
    <Node ref={trial} y={-470} opacity={0}>
      {TRIALS.map((t, i) => (
        <Node ref={el => (trialRows[i] = el)} x={-80} y={i * 120} opacity={0}>
          <Txt
            x={110}
            offsetX={1}
            text={`${t.a} × ${t.a} =`}
            fontFamily={FONT}
            fontSize={58}
            fontWeight={800}
            fill={C.dim}
          />
          <Txt x={140} offsetX={-1} text={t.sq} fontFamily={FONT} fontSize={66} fontWeight={900} fill={C.ink} />
        </Node>
      ))}
      <Node ref={barNode} y={420} opacity={0}>
        <Rect x={0} width={BAR_W} height={26} radius={13} fill={'#ffffff14'} />
        <Rect
          x={-BAR_W / 2}
          offsetX={-1}
          width={() => (BAR_W * barFill()) / 2}
          height={26}
          radius={13}
          fill={C.pink}
          shadowColor={C.pink}
          shadowBlur={20}
        />
        <Line points={[[BAR_W / 2, -36], [BAR_W / 2, 36]]} stroke={C.amber} lineWidth={5} />
        <Txt x={BAR_W / 2} y={-70} text={'2'} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.amber} />
        <Txt x={-BAR_W / 2} y={-70} text={'0'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.dim} />
      </Node>
    </Node>,
  );
  const digits = createRef<Txt>();
  const shown = createSignal(0);
  const FULL = '√2 = 1.41421356…';
  view.add(
    <Txt
      ref={digits}
      y={210}
      text={() => FULL.slice(0, Math.round(shown()))}
      fontFamily={FONT}
      fontSize={92}
      fontWeight={900}
      fill={C.pink}
      shadowColor={C.pink}
      shadowBlur={30}
    />,
  );

  // 시리즈 정리 칩
  const recap = createRef<Node>();
  const chips: Rect[] = [];
  const RECAP = ['3×4 = 4×3', '세로셈 = 띠', '5² = 25', '홀수의 합 = n²', '√25 = 5', '√2 = 1.414…'];
  const RC = [C.amber, C.teal, C.amber, C.pink, C.teal, C.pink];
  view.add(
    <Node ref={recap} y={-300}>
      {RECAP.map((s, i) => (
        <Rect
          ref={el => (chips[i] = el)}
          x={(i % 2 === 0 ? -1 : 1) * 230}
          y={Math.floor(i / 2) * 130}
          width={420}
          height={100}
          radius={24}
          fill={RC[i] + '1c'}
          stroke={RC[i]}
          lineWidth={3}
          opacity={0}
        >
          <Txt text={s} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.ink} />
        </Rect>
      ))}
    </Node>,
  );

  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.2);
  yield* title.dock();

  // 1. 2 × 2 모눈
  cue('pop');
  yield* popIn(cellsN(), 0.6, 0.6);
  areaTxt().text('넓이 4');
  yield* all(cap.say('01', '모눈 4 칸짜리 정사각형'), popIn(areaTxt(), 0.4));
  yield* waitFor(0.9);
  yield* areaTxt().opacity(0, 0.25);

  // 2. 변의 가운데를 잇기
  yield* cap.say('02', '네 변의 가운데를 이어요', C.pink);
  cue('whoosh');
  yield* diamond().end(1, 1.1, easeInOutExpo);
  tris.forEach(t => t.opacity(1));
  yield* all(...tris.map(t => t.opacity(1, 0.3)));
  yield* waitFor(0.4);

  // 3. 모서리를 접으면 안쪽을 딱 채운다
  yield* cap.say('03', '모서리 4 개를 안으로 접으면?', C.amber);
  for (let i = 0; i < 4; i++) {
    cue('swish');
    yield* fold[i](1, 0.55, easeInOutExpo);
  }
  cue('boom');
  yield* all(flash(0.12), punch(stage(), 0.05), sparks(stage(), [0, 0], C.pink, 14, 240));
  yield* cap.say('04', '안쪽을 딱 채워요!\n안쪽 = 전체의 절반', C.pink);
  yield* waitFor(1.4);
  yield* all(...fold.map(f => f(0, 0.6, easeInOutExpo)));
  yield* all(...tris.map(t => t.opacity(0.25, 0.4)), diamondFill().fill(C.pink + '55', 0.4));
  areaTxt().text('넓이 2');
  cue('pop');
  yield* all(cap.say('05', '4 의 절반 → 넓이 2', C.pink), popIn(areaTxt(), 0.5));
  yield* waitFor(1);
  cue('chime');
  yield* all(cap.say('06', '그래서 이 정사각형의 한 변이 √2', C.teal), popIn(sideLab(), 0.5));
  yield* ring(stage(), [U / 2 + 46, -U / 2 - 46], C.pink, 110);
  yield* waitFor(1.6);

  // 4. √2 는 얼마?
  yield* wipe.cover();
  stage().opacity(0);
  trial().opacity(1);
  digits().opacity(0);
  yield* wipe.reveal();
  yield* cap.say('07', '√2 를 두 번 곱하면 2\n그런 수를 찾아볼까요?', C.amber);
  yield* barNode().opacity(1, 0.3);
  for (let i = 0; i < 3; i++) {
    cue('pop');
    yield* all(popIn(trialRows[i], 0.45, 0.7), barFill(TRIALS[i].v, 0.8, easeOutExpo));
    yield* waitFor(0.7);
  }
  yield* cap.say('08', '가까워지지만\n딱 2 는 절대 안 돼요', C.coral);
  yield* waitFor(1.4);
  digits().opacity(1);
  for (let k = 1; k <= FULL.length; k++) {
    cue('type');
    yield* shown(k, 0.08);
  }
  cue('chime');
  yield* cap.say('09', '소수점 아래가 끝없이 이어지는 수', C.pink);
  yield* all(punch(digits(), 0.06), ring(view, [0, 210], C.pink, 460));
  yield* waitFor(2);

  // 5. 시리즈 정리
  yield* wipe.cover();
  trial().opacity(0);
  digits().opacity(0);
  title.group().opacity(0);
  yield* wipe.reveal();
  yield* cap.say('끝', '곱셈은 넓이다, 끝!', C.amber);
  yield* sequence(
    0.12,
    ...chips.map(c =>
      all(
        (function* () {
          cue('pop');
        })(),
        popIn(c, 0.5, 0.5),
      ),
    ),
  );
  yield* all(...chips.map(c => c.scale(1.05, 0.25, easeOutBack).to(1, 0.3, easeOutExpo)));
  yield* waitFor(2.6);
  yield* finish(NAME, 0.8);
  void end;
});
