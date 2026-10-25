import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutExpo,
  easeOutBack,
  easeOutExpo,
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addFlash,
  addHud,
  addWipe,
  begin,
  bigCard,
  capLog,
  cue,
  finish,
  popIn,
  punch,
  ring,
  shine,
  sparks,
} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak, zoomInto} from '../fx';

// 과학 시즌 S2 — 빨강을 보다가 흰 벽을 보면? (잔상)
// 1) 화면 테스트: 빨간 동그라미 가운데 점을 15초 보고 → 흰 화면에 청록 동그라미가 보인다
// 2) 눈에는 빨강 · 초록 · 파랑을 느끼는 세포가 있다. 빨강 세포만 지치면 흰빛에서 초록+파랑 = 청록이 남는다
// 3) 초록 → 자주, 파랑 → 노랑. 잠깐 쉬면 사라진다

const NAME = 'afterImage';
const RED = '#FF3B3B';
const GRN = '#22E06A';
const BLU = '#3B6BFF';
const CYAN = '#3FF2F2';
const MAG = '#FF4FE0';
const YEL = '#FFE43B';
const PAPER = '#F4F4F2';

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.pink);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  const dim = createRef<Rect>();
  view.add(<Rect ref={dim} width={1080} height={1920} fill={'#07080E'} opacity={0} />);

  /* 0. 훅: 빨강 · 초록 · 파랑 빛이 돌다가 합쳐지면 흰빛 */
  const hookN = createRef<Node>();
  const orbit = createSignal(0);
  const spread = createSignal(170);
  const hookCols = [RED, GRN, BLU];
  view.add(
    <Node ref={hookN} y={200}>
      {hookCols.map((col, i) => (
        <Circle
          size={330}
          x={() => spread() * Math.cos(orbit() + (i * Math.PI * 2) / 3)}
          y={() => spread() * Math.sin(orbit() + (i * Math.PI * 2) / 3)}
          fill={col}
          opacity={0}
          compositeOperation={'lighter'}
        />
      ))}
    </Node>,
  );

  /* 1. 준비: 빨강 15초 → 흰 화면 */
  const setupN = createRef<Node>();
  const badge = createRef<Rect>();
  const stepA = createRef<Node>();
  const stepB = createRef<Node>();
  const arrow = createRef<Line>();
  view.add(
    <Node ref={setupN} opacity={0}>
      <Rect
        ref={badge}
        y={-500}
        layout
        padding={[12, 30]}
        radius={999}
        fill={RED + '22'}
        stroke={RED}
        lineWidth={3}
        shadowColor={RED}
        shadowBlur={24}
      >
        <Txt text={'15초 테스트'} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={4} fill={C.ink} />
      </Rect>
      <Node ref={stepA} x={-230} y={-260} opacity={0}>
        <Circle size={210} fill={RED} />
        <Circle size={18} fill={'#000'} stroke={'#fff'} lineWidth={4} />
        <Txt y={160} text={'가운데 점 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
      <Line
        ref={arrow}
        points={[[-80, -260], [80, -260]]}
        stroke={C.amber}
        lineWidth={8}
        endArrow
        arrowSize={22}
        end={0}
        shadowColor={C.amber}
        shadowBlur={16}
      />
      <Node ref={stepB} x={230} y={-260} opacity={0}>
        <Rect size={210} radius={22} fill={PAPER} />
        <Circle size={18} fill={'#000'} />
        <Txt y={160} text={'흰 화면 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 2. 테스트: 빨간 동그라미 (응시하는 동안 둘레는 멈춰 있다) */
  const test = createRef<Node>();
  const timerN = createRef<Rect>();
  const count = createSignal(15);
  const TY = -200;
  view.add(
    <Node ref={test} y={TY} opacity={0}>
      <Circle size={540} fill={RED} />
      <Circle size={24} fill={'#000'} stroke={'#fff'} lineWidth={5} />
    </Node>,
  );
  view.add(
    <Rect
      ref={timerN}
      y={-640}
      layout
      direction="row"
      alignItems="center"
      gap={18}
      padding={[10, 28]}
      radius={999}
      fill={'#ffffff10'}
      stroke={'#ffffff26'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'TEST'} fontFamily={FONT} fontSize={30} fontWeight={900} letterSpacing={6} fill={RED} />
      <Txt
        text={() => String(Math.max(0, Math.ceil(count())))}
        fontFamily={FONT}
        fontSize={52}
        fontWeight={900}
        fill={C.ink}
      />
    </Rect>,
  );

  /* 3. 흰 화면 (모든 것을 덮는다 — 자막도 이 안에 따로 둔다) */
  const paper = createRef<Rect>();
  const ghost = createRef<Circle>();
  const paperTxt = createRef<Txt>();
  const paperTxt2 = createRef<Txt>();

  /* 4. 설명: 세포 세 종류 */
  const explain = createRef<Node>();
  const CELLS = [
    {col: RED, name: '빨강 세포', x: -280},
    {col: GRN, name: '초록 세포', x: 0},
    {col: BLU, name: '파랑 세포', x: 280},
  ];
  const cellN: Node[] = [];
  const power = CELLS.map(() => createSignal(1));
  const beams: Line[] = [];
  const whiteBeams: Line[] = [];
  const flow = createSignal(0);
  const tired = createRef<Txt>();
  const whiteTag = createRef<Txt>();
  const BAR_H = 200;
  const CY = -300;
  view.add(
    <Node ref={explain} opacity={0}>
      {CELLS.map((c, i) => (
        <Line
          ref={el => beams.push(el)}
          points={[[c.x, CY - 250], [c.x, CY - 100]]}
          stroke={c.col}
          lineWidth={10}
          lineDash={[22, 14]}
          lineDashOffset={() => -flow()}
          shadowColor={c.col}
          shadowBlur={18}
          end={0}
        />
      ))}
      {CELLS.map((c, i) => (
        <Line
          ref={el => whiteBeams.push(el)}
          points={[[0, CY - 250], [c.x, CY - 100]]}
          stroke={'#ffffff'}
          lineWidth={8}
          lineDash={[22, 14]}
          lineDashOffset={() => -flow()}
          shadowColor={'#ffffff'}
          shadowBlur={14}
          end={0}
        />
      ))}
      <Txt
        ref={whiteTag}
        x={-150}
        y={CY - 225}
        text={'흰빛'}
        fontFamily={FONT}
        fontSize={44}
        fontWeight={900}
        fill={'#ffffff'}
        shadowColor={'#ffffff'}
        shadowBlur={20}
        opacity={0}
      />
      {CELLS.map((c, i) => (
        <Node ref={el => cellN.push(el)} x={c.x} y={CY} opacity={0}>
          <Rect
            size={170}
            radius={48}
            fill={c.col + '22'}
            stroke={c.col}
            lineWidth={5}
            shadowColor={c.col}
            shadowBlur={() => 34 * power[i]()}
          />
          <Circle size={64} fill={c.col} opacity={() => 0.25 + 0.75 * power[i]()} />
          <Txt y={128} text={c.name} fontFamily={FONT} fontSize={38} fontWeight={900} fill={c.col} />
          {/* 힘 막대 */}
          <Rect y={190 + BAR_H / 2} width={56} height={BAR_H} radius={14} fill={'#ffffff14'} />
          <Rect
            y={190 + BAR_H}
            offsetY={1}
            width={56}
            height={() => BAR_H * power[i]()}
            radius={14}
            fill={c.col}
            shadowColor={c.col}
            shadowBlur={16}
          />
        </Node>
      ))}
      <Txt
        ref={tired}
        x={-280}
        y={CY - 130}
        text={'지쳤어…'}
        fontFamily={FONT}
        fontSize={40}
        fontWeight={900}
        fill={C.ink}
        opacity={0}
      />
    </Node>,
  );
  // 초록 + 파랑 = 청록 (빛 더하기)
  const mixN = createRef<Node>();
  const mixG = createRef<Circle>();
  const mixB = createRef<Circle>();
  const mixTag = createRef<Txt>();
  view.add(
    <Node ref={mixN} y={230} opacity={0}>
      <Circle ref={mixG} x={-150} size={220} fill={'#00FF55'} compositeOperation={'lighter'} />
      <Circle ref={mixB} x={150} size={220} fill={'#0055FF'} compositeOperation={'lighter'} />
      <Txt
        ref={mixTag}
        x={250}
        text={'= 청록'}
        fontFamily={FONT}
        fontSize={56}
        fontWeight={900}
        fill={CYAN}
        shadowColor={CYAN}
        shadowBlur={24}
        opacity={0}
      />
    </Node>,
  );

  /* 5. 다른 색도 */
  const pairsN = createRef<Node>();
  const pairRows: Node[] = [];
  const PAIRS = [
    {a: RED, b: CYAN, an: '빨강', bn: '청록'},
    {a: GRN, b: MAG, an: '초록', bn: '자주'},
    {a: BLU, b: YEL, an: '파랑', bn: '노랑'},
  ];
  view.add(
    <Node ref={pairsN} y={-440} opacity={0}>
      {PAIRS.map((p, i) => (
        <Node ref={el => pairRows.push(el)} y={i * 190} opacity={0}>
          <Circle x={-250} size={130} fill={p.a} shadowColor={p.a} shadowBlur={24} />
          <Txt x={-120} offsetX={-1} text={p.an} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.ink} />
          <Line points={[[-10, 0], [90, 0]]} stroke={C.dim} lineWidth={6} endArrow arrowSize={18} />
          <Circle x={190} size={130} fill={p.b} shadowColor={p.b} shadowBlur={24} />
          <Txt x={270} offsetX={-1} text={p.bn} fontFamily={FONT} fontSize={44} fontWeight={900} fill={p.b} />
        </Node>
      ))}
    </Node>,
  );

  /* 6. 정리 */
  const card = bigCard('잔상 = 지친 세포가 만든 반대색', C.teal, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['빨강을 보다가', '흰 벽을 보면?'], {y: -430, accent: RED});
  const cap = addCaption(view);
  const end = addEnd(view);
  const flash = addFlash(view);
  const hud = addHud(view, {ep: 2, total: 2, series: '눈의 비밀', brand: '보면 풀리는 과학'});

  view.add(
    <Rect ref={paper} width={1080} height={1920} fill={PAPER} opacity={0}>
      <Circle ref={ghost} y={TY} size={540} fill={CYAN} opacity={0} />
      <Circle y={TY} size={24} fill={'#000'} />
      <Txt
        ref={paperTxt}
        y={340}
        text={'무엇이 보이나요?'}
        fontFamily={FONT}
        fontSize={60}
        fontWeight={900}
        fill={'#1B1E2E'}
        opacity={0}
      />
      <Txt
        ref={paperTxt2}
        y={440}
        text={'청록색 동그라미가 떠올라요!'}
        fontFamily={FONT}
        fontSize={50}
        fontWeight={800}
        fill={'#0E8A8A'}
        opacity={0}
      />
    </Rect>,
  );
  const iris = addIris(view, C.bg0, RED);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield orbit(30, 60, linear);
  const hookCircles = hookN().children() as Circle[];
  yield* all(
    hud.show(),
    title.hero(),
    sequence(0.12, ...hookCircles.map(c => all(c.opacity(0.95, 0.4), c.scale(0.4, 0).to(1, 0.6, easeOutBack)))),
  );
  cue('riser');
  yield* spread(0, 1.0, easeInOutExpo);
  cue('boom');
  yield* all(flash(0.2), punch(hookN(), 0.12, 0.4), sparks(view, [0, 200], '#ffffff', 16, 260), title.glitch(7, 20));
  yield* all(title.dock(), cap.say('?', '세 빛을 합치면 흰빛', C.dim));
  yield* zoomInto(hookN(), [0, 200], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setupN(), 0.8), streak(view, '#ffffff', -260));
  yield* popIn(badge(), 0.5, 0.6);
  cue('pop');
  yield* all(cap.say('준비', '빨간 동그라미 가운데 점을\n15초 동안 보세요', RED), popIn(stepA(), 0.5, 0.6));
  yield* waitFor(0.9);
  cue('swish');
  yield* arrow().end(1, 0.5, easeOutExpo);
  cue('pop');
  yield* all(cap.say('준비', '그다음 흰 화면을 보면…', C.amber), popIn(stepB(), 0.5, 0.6));
  yield* waitFor(0.7);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([-230, -260]);
  setupN().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(0.9);
  timerN().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TEST', '가운데 점에서 눈을 떼지 마세요', RED);
  for (let k = 15; k >= 1; k--) {
    count(k);
    cue('tick');
    if (k === 7) yield* all(cap.say('TEST', '조금만 더!', RED), waitFor(1));
    else yield* waitFor(1);
  }
  count(0);

  /* ═════════ 3. 흰 화면 — 전환 없이 한 번에 바꾼다 ═════════ */
  cue('chime');
  paper().opacity(1);
  yield* waitFor(1.2);
  capLog('say', '무엇이 보이나요?');
  yield* all(paperTxt().opacity(1, 0.4), paperTxt().y(320, 0.5, easeOutExpo));
  yield* waitFor(1.6);
  cue('pop');
  capLog('say', '청록색 동그라미가 떠올라요!');
  yield* all(paperTxt2().opacity(1, 0.4), ghost().opacity(0.35, 0.8));
  yield* waitFor(1.4);
  yield* all(ghost().opacity(0, 1.0), paperTxt().opacity(0, 0.6), paperTxt2().opacity(0, 0.6));

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  paper().opacity(0);
  test().opacity(0);
  timerN().opacity(0);
  dim().opacity(0);
  explain().opacity(1);
  title.group().opacity(1);
  yield flow(6000, 60, linear);
  yield* iris.reveal([0, CY]);
  cue('pop');
  yield* all(
    cap.say('01', '눈 속엔 색을 느끼는\n세포가 세 종류 있어요', C.teal),
    sequence(0.15, ...cellN.map(n => popIn(n, 0.5, 0.5))),
  );
  yield* waitFor(1.3);

  cue('whoosh');
  yield* all(cap.say('02', '빨강만 오래 보면\n빨강 세포만 계속 일해요', RED), beams[0].end(1, 0.6, easeOutExpo));
  yield* all(power[0](0.2, 1.6, easeInOutExpo), delay(0.9, popIn(tired(), 0.4)));
  yield* shake(cellN[0], 8, 0.35);
  yield* waitFor(0.4);

  cue('swish');
  yield* all(beams[0].end(0, 0.3), tired().opacity(0, 0.3));
  yield* all(
    cap.say('03', '흰빛 = 빨강 + 초록 + 파랑\n그런데 빨강 세포는 지쳐서…', C.ink),
    popIn(whiteTag(), 0.4),
    ...whiteBeams.map(b => b.end(1, 0.7, easeOutExpo)),
  );
  yield* waitFor(0.6);
  cue('pop');
  yield* all(...[1, 2].map(i => all(punch(cellN[i], 0.1, 0.4), ring(explain(), [CELLS[i].x, CY], CELLS[i].col, 120))));
  yield* waitFor(0.5);

  mixN().opacity(1);
  yield* all(
    cap.say('04', '초록 + 파랑만 남아서\n청록이 보여요!', CYAN),
    popIn(mixG(), 0.4, 0.5),
    popIn(mixB(), 0.4, 0.5),
  );
  cue('riser');
  yield* all(mixG().x(-40, 0.9, easeInOutExpo), mixB().x(40, 0.9, easeInOutExpo));
  cue('chime');
  yield* all(popIn(mixTag(), 0.4), sparks(mixN(), [0, 0], CYAN, 14, 200));
  yield* waitFor(1.2);

  /* ═════════ 5. 다른 색도 ═════════ */
  yield* wipe.cover();
  explain().opacity(0);
  mixN().opacity(0);
  pairsN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('05', '다른 색도 반대색이 떠올라요', C.amber);
  for (const r of pairRows) {
    cue('pop');
    yield* popIn(r, 0.45, 0.7);
    yield* waitFor(0.15);
  }
  yield* waitFor(1.4);

  /* ═════════ 6. 정리 ═════════ */
  yield* iris.cover([190, -440 + 190]);
  pairsN().opacity(0);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '잠깐 쉬면 세포가 회복해서\n금방 사라져요', C.teal));
  yield* shine(card);
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  지구와 달', '여름은\n왜 더울까?'));
  yield* waitFor(2.2);
  yield* finish(NAME, 0.6);
});
