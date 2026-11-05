import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, easeOutBack, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, shake} from '../fx';
import {addDim, addTimer} from '../sci';

// 수학 「계산이 빨라지는 비밀」 3편 — 두 자리 수 × 11 은 벌리고 더하기
// 1) 퀴즈: 23 × 11 (6초) → 비법: 2 와 3 을 벌리고 가운데에 2 + 3 = 5 → 253
// 2) 따라 하기: 62 × 11 → 682
// 3) 왜: 23 × 11 = 23 × 10 + 23 × 1 = 230 + 23 → 세로로 더하면 가운데 자리만 2 + 3
// 4) 주의: 57 × 11 → 5 + 7 = 12, 1 을 앞으로 올려 627

const NAME = 'elevenMul';
const VIOLET = C.violet;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, VIOLET);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 벌리고 더하기 무대 (훅 · 비법 · 따라 하기 · 올림이 같이 쓴다) */
  const SY = -230;
  const stage = createRef<Node>();
  const eq = createRef<Txt>();
  const L = createRef<Txt>();
  const R = createRef<Txt>();
  const M = createRef<Txt>();
  const expr = createRef<Txt>();
  const carry = createRef<Txt>();
  const gapBox = createRef<Rect>();
  view.add(
    <Node ref={stage} y={SY} opacity={0}>
      <Txt ref={eq} y={-230} fontFamily={FONT} fontSize={120} fontWeight={900} fill={C.ink} />
      <Rect ref={gapBox} y={90} width={150} height={190} radius={24} stroke={'#ffffff55'} lineWidth={5} lineDash={[18, 12]} opacity={0} />
      <Txt ref={L} x={-62} y={90} fontFamily={FONT} fontSize={200} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={30} />
      <Txt ref={R} x={62} y={90} fontFamily={FONT} fontSize={200} fontWeight={900} fill={C.teal} shadowColor={C.teal} shadowBlur={30} />
      <Txt ref={expr} y={-80} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.pink} opacity={0} />
      <Txt ref={M} y={90} fontFamily={FONT} fontSize={200} fontWeight={900} fill={C.pink} shadowColor={C.pink} shadowBlur={30} opacity={0} />
      <Txt ref={carry} y={-80} text={'1'} fontFamily={FONT} fontSize={80} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );
  function set(a: number, b: number) {
    eq().text(`${a}${b} × 11`);
    L().text(String(a));
    R().text(String(b));
    L().x(-62);
    R().x(62);
    L().fill(C.amber);
    M().opacity(0);
    expr().opacity(0);
    carry().opacity(0);
    gapBox().opacity(0);
  }
  // 벌리기 → 가운데에 합 → 떨어뜨리기 (합이 10 미만일 때)
  function* spread(t = 0.5) {
    cue('swish');
    yield* all(L().x(-170, t, easeInOutCubic), R().x(170, t, easeInOutCubic), delay(t * 0.6, popIn(gapBox(), 0.3, 0.8)));
  }
  function* drop(a: number, b: number, t = 0.4) {
    expr().text(`${a} + ${b}`);
    cue('pop');
    yield* popIn(expr(), t, 0.5);
    M().text(String(a + b));
    M().y(-80);
    cue('boom');
    yield* all(expr().opacity(0, t * 0.5), M().opacity(1, t * 0.3), M().y(90, t, easeOutBack), gapBox().opacity(0, t));
  }

  /* 퀴즈 · 정답 글자 */
  const ans = createRef<Txt>();
  view.add(<Txt ref={ans} y={SY + 330} fontFamily={FONT} fontSize={90} fontWeight={900} fill={C.ink} opacity={0} />);
  const timer = addTimer(view, 'QUIZ');

  /* 왜? 세로 덧셈 */
  const WY = -250;
  const whyN = createRef<Node>();
  const r1 = createRef<Node>();
  const r2 = createRef<Node>();
  const line = createRef<Rect>();
  const r3 = createRef<Node>();
  const col = createRef<Rect>();
  const top = createRef<Txt>();
  const XS = [-150, 0, 150];
  const Dg = (o: {x: number; t: string; c?: string}) => (
    <Txt x={o.x} text={o.t} fontFamily={FONT} fontSize={130} fontWeight={900} fill={o.c ?? C.ink} />
  );
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Txt ref={top} y={-330} text={'23 × 11 = 23 × 10 + 23 × 1'} fontFamily={FONT} fontSize={62} fontWeight={900} fill={C.ink} opacity={0} />
      <Rect ref={col} x={0} y={-10} width={130} height={460} radius={24} fill={'#FF5FA222'} stroke={C.pink} lineWidth={5} opacity={0} />
      <Node ref={r1} y={-170} opacity={0}>
        <Dg x={XS[0]} t={'2'} c={C.amber} />
        <Dg x={XS[1]} t={'3'} c={C.teal} />
        <Dg x={XS[2]} t={'0'} c={C.dim} />
        <Txt x={360} text={'23 × 10'} fontFamily={FONT} fontSize={44} fontWeight={800} fill={C.dim} />
      </Node>
      <Node ref={r2} y={-20} opacity={0}>
        <Txt x={-300} text={'+'} fontFamily={FONT} fontSize={110} fontWeight={900} fill={C.ink} />
        <Dg x={XS[1]} t={'2'} c={C.amber} />
        <Dg x={XS[2]} t={'3'} c={C.teal} />
        <Txt x={360} text={'23 × 1'} fontFamily={FONT} fontSize={44} fontWeight={800} fill={C.dim} />
      </Node>
      <Rect ref={line} y={70} width={0} height={8} radius={4} fill={C.ink} />
      <Node ref={r3} y={170} opacity={0}>
        <Dg x={XS[0]} t={'2'} c={C.amber} />
        <Dg x={XS[1]} t={'5'} c={C.pink} />
        <Dg x={XS[2]} t={'3'} c={C.teal} />
      </Node>
    </Node>,
  );

  const card = bigCard('× 11 은 벌리고 더하기', VIOLET, 64);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['11 곱하기는', '벌리고 더하기!'], {y: -430, accent: VIOLET});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 3, series: '계산이 빨라지는 비밀'});
  const iris = addIris(view, C.bg0, VIOLET);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅: 45 × 11 = 495 ═════════ */
  set(4, 5);
  stage().y(300);
  stage().scale(0.8);
  yield* all(hud.show(), title.hero(), popIn(stage(), 0.6, 0.5));
  yield* spread(0.35);
  yield* drop(4, 5, 0.3);
  yield* title.dock();
  yield* all(stage().opacity(0, 0.4), stage().scale(1.1, 0.4));
  stage().y(SY);
  stage().scale(1);

  /* ═════════ 1. 퀴즈 ═════════ */
  set(2, 3);
  title.group().opacity(0);
  cue('pop');
  yield* all(popIn(stage(), 0.5, 0.6), cap.say('QUIZ', '23 × 11 은?\n6초 안에 암산!', C.amber));
  dim().opacity(0.5);
  timer.count(6);
  timer.node().opacity(1);
  yield* timer.run(6, {4: () => cap.say('QUIZ', '세로셈 없이 할 수 있을까?', C.coral)});
  timer.node().opacity(0);
  dim().opacity(0);

  /* ═════════ 2. 비법 ═════════ */
  yield* cap.say('비법', '두 숫자를 양쪽으로 벌려요', VIOLET);
  yield* spread();
  yield* waitFor(0.6);
  yield* cap.say('비법', '가운데엔 두 숫자의 합\n2 + 3 = 5', C.pink);
  yield* drop(2, 3);
  yield* waitFor(0.4);
  cue('chime');
  ans().text('= 253');
  yield* all(cap.say('정답', '23 × 11 = 253!', C.teal), popIn(ans(), 0.4, 0.6), sparks(view, [0, SY + 90], C.pink, 14, 260));
  yield* waitFor(1.2);

  /* 따라 하기: 62 × 11 */
  yield* all(stage().opacity(0, 0.25), ans().opacity(0, 0.25));
  set(6, 2);
  stage().opacity(1);
  cue('swish');
  yield* all(punch(eq(), 0.12), cap.say('TRY', '이번엔 직접! 62 × 11 은?', C.coral));
  dim().opacity(0.5);
  timer.count(5);
  timer.node().opacity(1);
  yield* timer.run(5, {
    4: () => spread(0.5),
    2: () => drop(6, 2, 0.35),
  });
  timer.node().opacity(0);
  dim().opacity(0);
  cue('chime');
  ans().text('= 682');
  yield* all(cap.say('정답', '6 | 6+2 | 2 → 682!', C.teal), popIn(ans(), 0.4, 0.6));
  yield* waitFor(1.2);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, SY + 90]);
  stage().opacity(0);
  ans().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  cue('pop');
  yield* all(cap.say('01', '11은 10 + 1 이니까', C.ink), popIn(top(), 0.5, 0.6));
  yield* waitFor(1.4);
  cue('pop');
  yield* all(cap.say('02', '23 × 10 = 230', C.amber), popIn(r1(), 0.45, 0.6));
  yield* waitFor(1.0);
  cue('pop');
  yield* all(cap.say('03', '23 × 1 = 23 을 한 칸 밀려서', C.teal), popIn(r2(), 0.45, 0.6));
  yield* waitFor(1.2);
  cue('swish');
  yield* all(cap.say('04', '세로로 더하면…', VIOLET), line().width(560, 0.5, easeInOutCubic));
  yield* popIn(r3(), 0.45, 0.6);
  yield* waitFor(0.6);
  cue('chime');
  yield* all(cap.say('05', '가운데 자리만 2 + 3!\n그래서 벌리고 더하기예요', C.pink), popIn(col(), 0.45, 0.9));
  yield* waitFor(2.0);

  /* ═════════ 4. 주의: 올림 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  set(5, 7);
  stage().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('주의', '57 × 11 처럼 합이 10을 넘으면?', C.coral);
  yield* spread(0.45);
  yield* drop(5, 7, 0.4);
  yield* waitFor(0.4);
  // 12 의 1 을 앞자리로 올린다
  cue('whoosh');
  M().text('2');
  carry().position([-30, 90]);
  carry().opacity(1);
  yield* all(
    cap.say('주의', '1을 앞으로 올려요 → 627', C.coral),
    carry().position([-170, -40], 0.5, easeInOutCubic),
  );
  cue('pop');
  L().text('6');
  yield* all(carry().opacity(0, 0.2), L().fill(C.coral, 0.2), shake(L(), 8, 0.3));
  ans().text('= 627');
  yield* popIn(ans(), 0.4, 0.6);
  yield* waitFor(1.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, SY + 90]);
  stage().opacity(0);
  ans().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '엄마 아빠한테 문제를 내 봐요!', VIOLET));
  yield* all(shine(card), sparks(view, [0, -420], VIOLET, 14, 300));
  yield* waitFor(1.2);
  yield* all(cap.hide(), end.show('계산이 빨라지는 비밀  끝!', '비법 3가지,\n누구한테 써먹을까요?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
