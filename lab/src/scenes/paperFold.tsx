import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addTimer} from '../sci';

// 수학 「종이 한 장 수학」 3편 — 종이를 몇 번 접으면 달까지 닿을까? (두 배씩 커지기)
// 두께 0.1mm 종이를 n 번 접으면 0.1mm × 2ⁿ (직접 계산):
//   5번 3.2mm · 10번 102.4mm(약 10cm) · 14번 1638mm(약 1.6m) · 20번 약 105m · 27번 약 13.4km(에베레스트 8,849m 보다 높음)
//   41번 약 22만km · 42번 약 44만km → 달까지 평균 약 38만 4천km 를 넘는다
// 2⁴² = 4,398,046,511,104 (약 4조 4천억). 진짜 종이는 7~8번쯤에서 더 안 접힌다 → 직접 해 보고 댓글로

const NAME = 'paperFold';
const PAPER = '#F4F1EA';

function fmt(n: number) {
  const mm = 0.1 * 2 ** n;
  if (mm < 10) return `${mm.toFixed(1)}mm`;
  if (mm < 1000) return `${(mm / 10).toFixed(mm < 100 ? 1 : 0)}cm`;
  if (mm < 1e6) return `${(mm / 1000).toFixed(mm < 1e4 ? 1 : 0)}m`;
  const km = mm / 1e6;
  if (km < 10000) return `${km.toFixed(km < 100 ? 1 : 0)}km`;
  return `${Math.round(km / 10000)}만km`;
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 훅: 지구 · 달 · 종이 */
  const hookN = createRef<Node>();
  const hookLine = createRef<Line>();
  view.add(
    <Node ref={hookN} y={70}>
      <Circle x={-260} y={250} size={260} fill={'#2F7BD8'} stroke={C.teal} lineWidth={6} shadowColor={C.teal} shadowBlur={30} />
      <Txt x={-260} y={250} text={'지구'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.ink} />
      <Circle x={300} y={-300} size={150} fill={'#D9D6CC'} shadowColor={'#ffffff'} shadowBlur={30} />
      <Txt x={300} y={-300} text={'달'} fontFamily={FONT} fontSize={46} fontWeight={900} fill={'#232838'} />
      <Line ref={hookLine} points={[[-170, 140], [235, -235]]} stroke={C.amber} lineWidth={8} lineDash={[18, 14]} end={0} shadowColor={C.amber} shadowBlur={16} />
      <Rect x={-150} y={120} width={90} height={60} fill={PAPER} rotation={-20} shadowColor={'#000'} shadowBlur={10} />
    </Node>,
  );

  /* 퀴즈 보기 */
  const quizN = createRef<Node>();
  const opts: Rect[] = [];
  const OPT = [
    ['A', '42번', C.teal],
    ['B', '1,000번', C.violet],
    ['C', '100만 번', C.coral],
  ];
  view.add(
    <Node ref={quizN} y={-200} opacity={0}>
      <Txt y={-300} text={'두께 0.1mm 종이'} fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.ink} />
      <Rect y={-200} width={600} height={10} fill={PAPER} shadowColor={'#fff'} shadowBlur={14} />
      {OPT.map(([h, b, col], i) => (
        <Rect ref={el => (opts[i] = el)} y={-40 + i * 150} width={620} height={124} radius={26} fill={'#0B1028e6'} stroke={col} lineWidth={4} shadowColor={col} shadowBlur={18} layout direction="row" alignItems="center" justifyContent="center" gap={40}>
          <Txt text={h} fontFamily={FONT} fontSize={60} fontWeight={900} fill={col} />
          <Txt text={b} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.ink} />
        </Rect>
      ))}
    </Node>,
  );
  const timer = addTimer(view, 'QUIZ', -575);

  /* 접기: 겹이 두 배씩 */
  const foldN = createRef<Node>();
  const folds = createSignal(0);
  const layers: Rect[] = [];
  const foldTxt = createRef<Txt>();
  view.add(
    <Node ref={foldN} y={-150} opacity={0}>
      {Array.from({length: 32}, (_, i) => (
        <Rect
          ref={el => (layers[i] = el)}
          y={() => 180 - i * 9}
          width={() => 640 * 0.8 ** folds()}
          height={7}
          radius={2}
          fill={i % 2 ? PAPER : '#DCD6C8'}
          opacity={() => (i < 2 ** folds() ? 1 : 0)}
        />
      ))}
      <Txt
        ref={foldTxt}
        y={-300}
        text={() => `${Math.round(folds())}번 접기 → ${2 ** Math.round(folds())}겹 · ${fmt(Math.round(folds()))}`}
        fontFamily={FONT}
        fontSize={56}
        fontWeight={900}
        fill={C.amber}
      />
    </Node>,
  );

  /* 사다리: 0 ~ 42 번 */
  const ladderN = createRef<Node>();
  const n = createSignal(5);
  const Y = (k: number) => 330 - k * (850 / 42);
  const marks: Node[] = [];
  const MARKS: [number, string, string][] = [
    [10, '약 10cm', '손바닥만큼'],
    [14, '약 1.6m', '어른 키'],
    [20, '약 105m', '아파트 30층보다 높이'],
    [27, '약 13km', '에베레스트보다 높이'],
    [42, '약 44만km', '달 도착!'],
  ];
  const climber = createRef<Node>();
  view.add(
    <Node ref={ladderN} y={-120} opacity={0}>
      <Rect x={-330} y={(Y(0) + Y(42)) / 2} width={14} height={Y(0) - Y(42)} radius={7} fill={'#ffffff22'} />
      <Rect x={-330} y={() => (Y(0) + Y(n())) / 2} width={14} height={() => Y(0) - Y(n())} radius={7} fill={C.amber} shadowColor={C.amber} shadowBlur={20} />
      {MARKS.map(([k, a, b], i) => (
        <Node ref={el => (marks[i] = el)} y={Y(k)} opacity={0}>
          <Line points={[[-310, 0], [-250, 0]]} stroke={i === 4 ? C.teal : C.ink} lineWidth={5} />
          <Txt x={-230} offsetX={-1} text={`${k}번`} fontFamily={FONT} fontSize={44} fontWeight={900} fill={i === 4 ? C.teal : C.amber} />
          <Txt x={-110} offsetX={-1} text={`${a}  ${b}`} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
        </Node>
      ))}
      <Circle x={-330} y={Y(42) - 70} size={90} fill={'#D9D6CC'} shadowColor={'#fff'} shadowBlur={24} />
      <Node ref={climber} x={-330} y={() => Y(n())}>
        <Rect width={70} height={44} radius={6} fill={PAPER} stroke={C.amber} lineWidth={4} />
      </Node>
      <Txt x={-330} y={Y(0) + 70} text={() => `${Math.round(n())}번`} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  /* 왜: 2 × 2 × … */
  const whyN = createRef<Node>();
  const whyBig = createRef<Txt>();
  const whyKo = createRef<Txt>();
  view.add(
    <Node ref={whyN} y={-200} opacity={0}>
      <Txt y={-200} text={'2 × 2 × 2 × … × 2'} fontFamily={FONT} fontSize={84} fontWeight={900} fill={C.ink} />
      <Txt y={-100} text={'(42번)'} fontFamily={FONT} fontSize={52} fontWeight={800} fill={C.dim} />
      <Txt ref={whyBig} y={40} text={'= 4,398,046,511,104'} fontFamily={FONT} fontSize={72} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={24} opacity={0} />
      <Txt ref={whyKo} y={170} text={'약 4조 4천억 배!'} fontFamily={FONT} fontSize={90} fontWeight={900} fill={C.teal} shadowColor={C.teal} shadowBlur={30} opacity={0} />
    </Node>,
  );

  const card = bigCard('두 배씩 = 순식간에 커진다', C.violet, 66);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['종이를 몇 번 접으면', '달까지 닿을까?'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 3, series: '종이 한 장 수학'});
  const iris = addIris(view, C.bg0, C.violet);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), hookLine().end(1, 1.4, easeInOutCubic));
  yield* all(title.dock(), hookN().opacity(0, 0.9));

  /* ═════════ 1. 퀴즈 ═════════ */
  quizN().opacity(1);
  cue('pop');
  yield* all(cap.say('QUIZ', '몇 번 접으면 달까지 닿을까요?', C.amber), sequence(0.12, ...opts.map(o => popIn(o, 0.4, 0.6))));
  timer.count(5);
  timer.node().opacity(1);
  yield* timer.run(5);
  timer.node().opacity(0);
  yield* cap.say('?', '한 번 접어 볼게요', C.violet);

  /* ═════════ 2. 접기 ═════════ */
  yield* wipe.cover();
  quizN().opacity(0);
  foldN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('접기', '접을 때마다 두께가 두 배!', C.amber);
  for (let k = 1; k <= 5; k++) {
    cue('pop');
    folds(k);
    yield* all(punch(foldN(), 0.06, 0.3), waitFor(0.55));
  }
  yield* cap.say('접기', '5번 접어도 3.2mm…\n아직 얇아요', C.dim);
  yield* waitFor(0.8);

  /* ═════════ 3. 사다리 ═════════ */
  yield* iris.cover([0, -150]);
  foldN().opacity(0);
  title.group().opacity(0);
  ladderN().opacity(1);
  yield* iris.reveal([-330, 200]);
  yield* cap.say('계속', '이대로 계속 접는다면?', C.violet);
  let from = 5;
  for (let i = 0; i < MARKS.length; i++) {
    const [k] = MARKS[i];
    cue('swish');
    yield* n(k, i === 4 ? 1.6 : 0.8, i === 4 ? easeInOutCubic : easeOutCubic);
    cue(i === 4 ? 'boom' : 'pop');
    yield* all(popIn(marks[i], 0.35, 0.6), i === 4 ? sparks(ladderN(), [-330, Y(42) - 70], C.teal, 16, 260) : waitFor(0));
    if (i === 1) yield* cap.say('계속', '14번이면 어른 키만큼', C.amber);
    if (i === 3) yield* cap.say('계속', '27번이면 에베레스트보다 높아요', C.coral);
    from = k;
  }
  yield* all(cap.say('정답', '정답은 A! 42번이면\n달까지(약 38만km) 도착', C.teal), punch(marks[4], 0.15));
  yield* waitFor(1.6);

  /* ═════════ 4. 왜? ═════════ */
  yield* wipe.cover();
  ladderN().opacity(0);
  whyN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('왜?', '1번 접을 때마다 2배씩 곱해져요', C.amber);
  cue('boom');
  yield* all(popIn(whyBig(), 0.5, 0.6), punch(whyN(), 0.04));
  yield* waitFor(0.6);
  cue('chime');
  yield* all(popIn(whyKo(), 0.5, 0.5), cap.say('왜?', '42번 두 배 = 약 4조 4천억 배', C.teal), sparks(whyN(), [0, 170], C.teal, 14, 300));
  yield* waitFor(1.6);

  /* ═════════ 5. 정리 · 댓글 질문 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '하지만 진짜 종이는\n7~8번쯤에서 더 안 접혀요', C.violet));
  yield* all(shine(card), sparks(view, [0, -420], C.violet, 14, 300));
  yield* waitFor(0.8);
  yield* cap.say('?', '직접 접어 보세요!\n몇 번까지 됐는지 댓글로!', C.amber);
  yield* waitFor(2.0);
  yield* all(cap.hide(), card.opacity(0, 0.3), end.show('종이 한 장 수학  끝!', '세 가지 중에\n몇 개나 해 봤나요?', '다음 시리즈도 보려면 구독'));
  yield* waitFor(1.8);

  /* 첫 장면으로 이어지게 */
  hookLine().end(1);
  yield* all(end.root().opacity(0, 0.4), title.group().opacity(0, 0.4), hookN().opacity(1, 0.4));
  yield* finish(NAME, 0.3);
});
