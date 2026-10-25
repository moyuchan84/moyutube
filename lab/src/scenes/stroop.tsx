import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutExpo, linear, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addHud,
  addWipe,
  begin,
  bigCard,
  cue,
  finish,
  popIn,
  punch,
  shine,
  sparks,
} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addTimer} from '../sci';

// 과학 시즌 S13 — 글자 색을 말해 보세요! (스트룹 효과)
// 1) 1판: 글자와 색이 같은 낱말 → 술술. 2판: 글자와 색이 다른 낱말 → 혀가 꼬인다
// 2) 글 읽기는 연습을 많이 해서 저절로(자동으로) 먼저 된다 → "읽은 말"이 "본 색"보다 먼저 튀어나와 부딪친다
// 3) 뇌가 읽기를 눌러 참고 색을 고르느라 시간이 더 걸린다

const NAME = 'stroop';
const COL = {빨강: '#FF4B4B', 파랑: '#4F8BFF', 초록: '#3DDB6A', 노랑: '#FFD23F'};
type K = keyof typeof COL;
const KEYS = Object.keys(COL) as K[];
// 1판: 같은 색, 2판: 다른 색 (낱말, 색)
const R1: [K, K][] = [['빨강', '빨강'], ['초록', '초록'], ['노랑', '노랑'], ['파랑', '파랑'], ['초록', '초록'], ['빨강', '빨강'], ['파랑', '파랑'], ['노랑', '노랑'], ['빨강', '빨강']];
const R2: [K, K][] = [['파랑', '빨강'], ['노랑', '초록'], ['빨강', '파랑'], ['초록', '노랑'], ['빨강', '초록'], ['파랑', '노랑'], ['노랑', '빨강'], ['초록', '파랑'], ['빨강', '노랑']];

function Grid3(o: {words: [K, K][]; refs: Txt[]; size?: number}) {
  return (
    <Node>
      {o.words.map(([w, c], k) => (
        <Txt
          ref={el => (o.refs[k] = el)}
          x={((k % 3) - 1) * 290}
          y={(Math.floor(k / 3) - 1) * 170}
          text={w}
          fontFamily={FONT}
          fontSize={o.size ?? 104}
          fontWeight={900}
          fill={COL[c]}
          opacity={0}
        />
      ))}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.coral);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 낱말이 색을 바꾸며 흔들린다 */
  const hookN = createRef<Node>();
  const hookW = createRef<Txt>();
  const hk = createSignal(0);
  view.add(
    <Node ref={hookN} y={250} opacity={0}>
      <Txt
        ref={hookW}
        text={() => KEYS[Math.floor(hk()) % 4]}
        fill={() => COL[KEYS[(Math.floor(hk()) + 2) % 4]]}
        fontFamily={FONT}
        fontSize={190}
        fontWeight={900}
      />
    </Node>,
  );

  /* 규칙 카드 */
  const ruleN = createRef<Node>();
  view.add(
    <Node ref={ruleN} y={-300} opacity={0}>
      <Txt y={-60} text={'파랑'} fontFamily={FONT} fontSize={170} fontWeight={900} fill={COL.빨강} />
      <Line points={[[-200, 90], [200, 90]]} stroke={'#ffffff22'} lineWidth={3} />
      <Txt x={-150} y={150} text={'"파랑" ✕'} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.dim} />
      <Txt x={150} y={150} text={'"빨강" ○'} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.amber} />
      <Txt y={240} text={'글자 말고, 글자의 색을 말해요'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
    </Node>,
  );

  /* 1판 · 2판 */
  const TY = -230;
  const g1 = createRef<Node>();
  const g2 = createRef<Node>();
  const t1: Txt[] = [];
  const t2: Txt[] = [];
  const round = createRef<Txt>();
  view.add(
    <>
      <Txt ref={round} y={-560} fontFamily={FONT} fontSize={44} fontWeight={900} letterSpacing={6} fill={C.dim} opacity={0} />
      <Node ref={g1} y={TY} opacity={0}>
        <Grid3 words={R1} refs={t1} />
      </Node>
      <Node ref={g2} y={TY} opacity={0}>
        <Grid3 words={R2} refs={t2} />
      </Node>
    </>,
  );
  const timer = addTimer(view, 'GO');

  /* 왜? 두 길의 달리기 */
  const raceN = createRef<Node>();
  const readP = createSignal(0);
  const colorP = createSignal(0);
  const crash = createRef<Node>();
  const LX = -380;
  const LW = 640;
  view.add(
    <Node ref={raceN} y={-320} opacity={0}>
      <Txt y={-230} text={'파랑'} fontFamily={FONT} fontSize={110} fontWeight={900} fill={COL.빨강} />
      {/* 두 길 */}
      <Txt x={LX - 20} y={-60} offsetX={1} text={'읽기'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.teal} />
      <Rect x={LX} offsetX={-1} y={-60} width={LW} height={22} radius={11} fill={'#ffffff14'} />
      <Rect x={LX} offsetX={-1} y={-60} width={() => LW * readP()} height={22} radius={11} fill={C.teal} shadowColor={C.teal} shadowBlur={16} />
      <Txt x={() => LX + LW * readP() + 20} y={-60} offsetX={-1} text={'"파랑"'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.teal} opacity={() => (readP() > 0.05 ? 1 : 0)} />
      <Txt x={LX - 20} y={60} offsetX={1} text={'색 보기'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.coral} />
      <Rect x={LX} offsetX={-1} y={60} width={LW} height={22} radius={11} fill={'#ffffff14'} />
      <Rect x={LX} offsetX={-1} y={60} width={() => LW * colorP()} height={22} radius={11} fill={C.coral} shadowColor={C.coral} shadowBlur={16} />
      <Txt x={() => LX + LW * colorP() + 20} y={60} offsetX={-1} text={'"빨강"'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.coral} opacity={() => (colorP() > 0.05 ? 1 : 0)} />
      <Node ref={crash} y={220} opacity={0}>
        <Circle size={150} fill={C.amber + '33'} stroke={C.amber} lineWidth={6} />
        <Txt text={'?!'} fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.amber} />
        <Txt x={180} offsetX={-1} text={'어느 말을 하지?!'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 생활 예: 자전거 */
  const autoN = createRef<Node>();
  const wheel = createSignal(0);
  view.add(
    <Node ref={autoN} y={-300} opacity={0}>
      {[-150, 150].map(x => (
        <Node x={x} rotation={() => wheel()}>
          <Circle size={200} stroke={C.ink} lineWidth={10} />
          <Line points={[[-100, 0], [100, 0]]} stroke={C.dim} lineWidth={4} />
          <Line points={[[0, -100], [0, 100]]} stroke={C.dim} lineWidth={4} />
        </Node>
      ))}
      <Line points={[[-150, 0], [-40, -130], [110, -130], [150, 0], [-10, 0], [-40, -130]]} stroke={C.coral} lineWidth={12} lineJoin="round" />
      <Line points={[[110, -130], [130, -190]]} stroke={C.coral} lineWidth={12} />
      <Txt y={190} text={'처음엔 어렵다가 → 저절로!'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const card = bigCard('읽기는 저절로 → 색보다 먼저 튀어나와요', C.coral, 46);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['글자 색을', '말해 보세요!'], {y: -430, accent: C.coral});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 2, series: '뇌가 속는 순간', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.coral);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('swish');
  yield* hk(7.99, 1.6, linear);
  yield* all(title.dock(), shake(hookN(), 12, 0.4));
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.6, 0.4));
  hookN().remove();

  /* ═════════ 1. 규칙 ═════════ */
  yield* all(arrive(ruleN(), 0.8), streak(view, '#ffffff', -260));
  yield* cap.say('규칙', '글자를 읽지 말고\n글자의 "색"을 소리 내 말해요', C.coral);
  yield* waitFor(1.6);
  yield* cap.say('규칙', '이건 "빨강"이 정답!', C.amber);
  yield* waitFor(1.2);

  /* ═════════ 2. 1판: 쉬운 판 ═════════ */
  yield* iris.cover([0, -300]);
  ruleN().opacity(0);
  title.group().opacity(0);
  dim().opacity(0.85);
  g1().opacity(1);
  round().text('1판 · 몸풀기');
  round().opacity(1);
  timer.count(6);
  timer.node().opacity(1);
  yield* iris.reveal([0, TY]);
  cue('pop');
  yield* all(cap.say('1판', '색을 말해 보세요!', C.teal), sequence(0.05, ...t1.map(t => popIn(t, 0.35, 0.6))));
  yield* timer.run(6, {3: () => cap.say('1판', '술술 되죠?', C.teal)});

  /* ═════════ 3. 2판: 다른 색 ═════════ */
  cue('whoosh');
  yield* all(g1().opacity(0, 0.3), cap.say('2판', '이번엔 글자와 색이 달라요\n색을 말해요!', C.coral));
  g2().opacity(1);
  round().text('2판 · 진짜 도전');
  timer.count(10);
  cue('pop');
  yield* sequence(0.05, ...t2.map(t => popIn(t, 0.35, 0.6)));
  yield* timer.run(10, {
    7: () => cap.say('2판', '읽지 말고 색!', C.amber),
    4: () => cap.say('2판', '혀가 꼬이죠?', C.coral),
  });
  timer.node().opacity(0);
  cue('chime');
  yield* cap.say('정답', '빨강 초록 파랑 / 노랑 초록 노랑\n빨강 파랑 노랑', C.amber);
  yield* waitFor(2.4);

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  g2().opacity(0);
  round().opacity(0);
  dim().opacity(0);
  raceN().opacity(1);
  yield* iris.reveal([0, -300]);
  yield* cap.say('01', '글자를 보면 뇌에서\n두 가지가 동시에 출발해요', C.teal);
  yield* waitFor(1.2);
  cue('riser');
  yield* all(cap.say('02', '읽기는 연습을 아주 많이 해서\n저절로, 엄청 빨라요', C.teal), readP(1, 0.9, easeOutExpo), colorP(0.45, 2.4, linear));
  yield* waitFor(0.4);
  cue('boom');
  yield* all(cap.say('03', '"파랑"이 먼저 도착해서\n"빨강"이랑 부딪쳐요', C.coral), colorP(1, 1.2, easeInOutCubic), popIn(crash(), 0.5, 0.6), shake(raceN(), 10, 0.4));
  yield* waitFor(1.4);
  yield* cap.say('04', '뇌가 읽기를 꾹 누르고\n색을 고르느라 느려지는 거예요', C.amber);
  yield* waitFor(2.0);

  yield* wipe.cover();
  raceN().opacity(0);
  autoN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('05', '자전거처럼 익숙해진 일은\n생각하기도 전에 저절로 돼요', C.coral), wheel(720, 3, linear));
  yield* waitFor(0.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  autoN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '이걸 "스트룹 효과"라고 해요', C.coral));
  yield* all(shine(card), sparks(view, [0, -420], C.coral, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  뇌가 속는 순간', '끝없이 올라가는\n소리가 있다?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
