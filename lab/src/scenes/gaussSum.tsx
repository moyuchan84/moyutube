import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, easeOutBack, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addDim, addTimer} from '../sci';

// 수학 「계산이 빨라지는 비밀」 1편 — 1부터 100까지 3초에 더하기 (짝지어 더하기)
// 1) 퀴즈: 1 + 2 + … + 10 을 8초 안에 → 55
// 2) 비법: 처음과 끝을 짝지으면 1+10 = 2+9 = … = 11, 다섯 쌍 → 55. 100 까지면 101 이 50쌍 → 5050
// 3) 왜: 점 계단(1~10) 두 개를 거꾸로 붙이면 10 × 11 직사각형 = 110, 계단 하나는 반 = 55
// 가우스 이야기는 "~했다는 이야기" 로만 말한다

const NAME = 'gaussSum';
const N = 10;
const CELL = 48;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 1 ~ 100 숫자가 쏟아진다 */
  const hookN = createRef<Node>();
  const hookNums: Txt[] = [];
  const hookAns = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={250}>
      {Array.from({length: 30}, (_, i) => (
        <Txt
          ref={el => (hookNums[i] = el)}
          x={((i * 137) % 900) - 450}
          y={((i * 89) % 500) - 250}
          text={String([1, 2, 3, 4, 5, 17, 23, 38, 42, 50, 51, 64, 77, 88, 99, 100, 9, 12, 31, 45, 56, 60, 70, 81, 93, 6, 7, 8, 14, 29][i])}
          fontFamily={FONT}
          fontSize={44 + (i % 4) * 14}
          fontWeight={900}
          fill={[C.amber, C.teal, C.violet, C.pink][i % 4] + 'aa'}
          opacity={0}
        />
      ))}
      <Txt ref={hookAns} text={'5050'} fontFamily={FONT} fontSize={180} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={40} opacity={0} />
    </Node>,
  );

  /* 1. 퀴즈 */
  const quizN = createRef<Node>();
  const quizAns = createRef<Txt>();
  view.add(
    <Node ref={quizN} y={-250} opacity={0}>
      <Txt y={-120} text={'1 + 2 + 3 + 4 + 5'} fontFamily={FONT} fontSize={86} fontWeight={900} fill={C.ink} />
      <Txt y={0} text={'+ 6 + 7 + 8 + 9 + 10'} fontFamily={FONT} fontSize={86} fontWeight={900} fill={C.ink} />
      <Txt y={130} text={'= ?'} fontFamily={FONT} fontSize={100} fontWeight={900} fill={C.amber} />
      <Txt ref={quizAns} y={280} text={'55'} fontFamily={FONT} fontSize={150} fontWeight={900} fill={C.teal} shadowColor={C.teal} shadowBlur={30} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'QUIZ');

  /* 2. 비법: 짝짓기 */
  const pairN = createRef<Node>();
  const PX = (i: number) => (i - (N - 1) / 2) * 92;
  const PY = -120;
  const arcs: Line[] = [];
  const sums: Txt[] = [];
  const sumBg: Rect[] = [];
  const nums: Txt[] = [];
  const pairEq = createRef<Txt>();
  const PAIR_COL = [C.amber, C.teal, C.violet, C.pink, C.coral];
  view.add(
    <Node ref={pairN} y={-250} opacity={0}>
      {Array.from({length: N}, (_, i) => (
        <Txt ref={el => (nums[i] = el)} x={PX(i)} y={PY} text={String(i + 1)} fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.ink} />
      ))}
      {Array.from({length: 5}, (_, k) => {
        const a = PX(k);
        const b = PX(N - 1 - k);
        const depth = 60 + (4 - k) * 58;
        return (
          <Node>
            <Line
              ref={el => (arcs[k] = el)}
              points={[[a, PY + 50], [a, PY + 50 + depth], [b, PY + 50 + depth], [b, PY + 50]]}
              radius={30}
              stroke={PAIR_COL[k]}
              lineWidth={7}
              end={0}
              shadowColor={PAIR_COL[k]}
              shadowBlur={14}
            />
            <Rect ref={el => (sumBg[k] = el)} y={PY + 50 + depth} width={84} height={50} radius={12} fill={'#0E1326'} opacity={0} />
            <Txt ref={el => (sums[k] = el)} y={PY + 50 + depth + 2} text={'11'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={PAIR_COL[k]} opacity={0} />
          </Node>
        );
      })}
      <Txt ref={pairEq} y={420} text={'11 × 5쌍 = 55'} fontFamily={FONT} fontSize={88} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={24} opacity={0} />
    </Node>,
  );

  /* 2-1. 100 까지 */
  const bigN = createRef<Node>();
  const bigRows: Node[] = [];
  const bigEq = createRef<Txt>();
  const ROWS: [string, string][] = [['1', '100'], ['2', '99'], ['3', '98'], ['⋮', '⋮'], ['50', '51']];
  view.add(
    <Node ref={bigN} y={-260} opacity={0}>
      {ROWS.map(([a, b], i) => (
        <Node ref={el => (bigRows[i] = el)} y={-230 + i * 100} opacity={0}>
          <Txt x={-200} text={a} fontFamily={FONT} fontSize={66} fontWeight={900} fill={C.ink} />
          <Txt x={-70} text={'+'} fontFamily={FONT} fontSize={56} fontWeight={800} fill={C.dim} />
          <Txt x={60} text={b} fontFamily={FONT} fontSize={66} fontWeight={900} fill={C.ink} />
          <Txt x={240} text={a === '⋮' ? '' : '= 101'} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.teal} />
        </Node>
      ))}
      <Txt ref={bigEq} y={330} text={'101 × 50쌍 = 5050'} fontFamily={FONT} fontSize={84} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={24} opacity={0} />
    </Node>,
  );

  /* 3. 왜? 점 계단 두 개 = 직사각형 */
  const whyN = createRef<Node>();
  const stairA = createRef<Node>();
  const stairB = createRef<Node>();
  const W = N * CELL;
  const H = (N + 1) * CELL;
  const cx = (c: number) => -W / 2 + CELL / 2 + c * CELL;
  const cy = (r: number) => H / 2 - CELL / 2 - r * CELL; // r = 0 이 맨 아래
  const dimW = createRef<Txt>();
  const dimH = createRef<Txt>();
  const half = createRef<Txt>();
  view.add(
    <Node ref={whyN} y={-240} opacity={0}>
      {/* 계단 A: c 번째 줄에 점 c+1 개 (아래에서부터) */}
      <Node ref={stairA}>
        {Array.from({length: N}, (_, c) =>
          Array.from({length: c + 1}, (_, r) => <Circle x={cx(c)} y={cy(r)} size={CELL - 12} fill={C.amber} />),
        ).flat()}
      </Node>
      {/* 계단 B: 거꾸로 — c 번째 줄의 위쪽 N - c 개 */}
      <Node ref={stairB} y={-760} opacity={0}>
        {Array.from({length: N}, (_, c) =>
          Array.from({length: N - c}, (_, k) => <Circle x={cx(c)} y={cy(N - k)} size={CELL - 12} fill={C.teal} />),
        ).flat()}
      </Node>
      <Txt ref={dimW} y={H / 2 + 50} text={'10'} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.ink} opacity={0} />
      <Txt ref={dimH} x={W / 2 + 60} text={'11'} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.ink} opacity={0} />
      <Txt ref={half} y={H / 2 + 140} text={'10 × 11 = 110  →  반은 55'} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.amber} opacity={0} />
    </Node>,
  );

  const card = bigCard('(처음 + 끝) × 개수 ÷ 2', C.amber, 64);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['1부터 100까지', '3초에 더하기?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '계산이 빨라지는 비밀'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), sequence(0.03, ...hookNums.map(t => all(t.opacity(1, 0.3), t.y(t.y() - 40, 0.6)))));
  cue('boom');
  yield* all(...hookNums.map(t => all(t.position([0, 0], 0.5, easeInOutCubic), t.opacity(0, 0.5))), delay(0.35, popIn(hookAns(), 0.5, 0.4)));
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 퀴즈 ═════════ */
  cue('pop');
  yield* all(popIn(quizN(), 0.6, 0.6), cap.say('QUIZ', '먼저 도전! 1부터 10까지\n8초 안에 더해 봐요', C.amber));
  title.group().opacity(0);
  dim().opacity(0.6);
  timer.count(8);
  timer.node().opacity(1);
  yield* timer.run(8, {
    5: () => cap.say('QUIZ', '하나씩 더하면… 바빠요!', C.coral),
  });
  timer.node().opacity(0);
  dim().opacity(0);
  cue('chime');
  yield* all(popIn(quizAns(), 0.5, 0.5), cap.say('정답', '정답은 55!', C.teal), sparks(view, [0, 30], C.teal, 12, 220));
  yield* waitFor(1.0);
  yield* cap.say('?', '그럼 100까지는? 비법이 있어요', C.amber);
  yield* waitFor(1.2);

  /* ═════════ 2. 비법 ═════════ */
  yield* wipe.cover();
  quizN().opacity(0);
  pairN().opacity(1);
  title.group().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('비법', '맨 앞과 맨 뒤를 짝지어 봐요', C.amber);
  yield* waitFor(0.7);
  for (let k = 0; k < 5; k++) {
    cue('pop');
    yield* all(
      arcs[k].end(1, 0.4, easeInOutCubic),
      nums[k].fill(PAIR_COL[k], 0.3),
      nums[N - 1 - k].fill(PAIR_COL[k], 0.3),
      delay(0.25, all(sumBg[k].opacity(1, 0.2), popIn(sums[k], 0.35, 0.5))),
      k === 1 ? cap.say('비법', '1 + 10 = 11, 2 + 9 = 11…\n전부 11!', C.teal) : waitFor(0),
    );
  }
  yield* waitFor(0.4);
  cue('chime');
  yield* all(popIn(pairEq(), 0.5, 0.5), cap.say('비법', '11이 다섯 쌍 → 55', C.amber));
  yield* waitFor(1.4);

  yield* wipe.cover();
  pairN().opacity(0);
  bigN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('100', '100까지도 똑같아요', C.violet);
  for (let i = 0; i < ROWS.length; i++) {
    cue('pop');
    yield* popIn(bigRows[i], 0.3, 0.6);
  }
  yield* cap.say('100', '전부 101, 짝은 50쌍!', C.teal);
  yield* waitFor(1.3);
  cue('boom');
  yield* all(popIn(bigEq(), 0.5, 0.5), punch(bigN(), 0.05), cap.say('100', '101 × 50 = 5050, 3초 컷!', C.amber), sparks(view, [0, 70], C.amber, 16, 320));
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, 70]);
  bigN().opacity(0);
  title.group().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, -240]);
  yield* cap.say('01', '1부터 10까지를 점 계단으로', C.amber);
  yield* waitFor(1.6);
  cue('whoosh');
  yield* all(cap.say('02', '똑같은 계단을 거꾸로 뒤집어\n위에 붙이면?', C.teal), stairB().opacity(1, 0.3), stairB().y(0, 1.0, easeOutBack));
  yield* waitFor(0.8);
  cue('pop');
  yield* all(cap.say('03', '가로 10, 세로 11\n딱 맞는 직사각형!', C.violet), popIn(dimW(), 0.4, 0.6), popIn(dimH(), 0.4, 0.6));
  yield* waitFor(1.6);
  cue('chime');
  yield* all(cap.say('04', '계단 하나는 그 반이에요', C.amber), popIn(half(), 0.5, 0.6), stairB().opacity(0.25, 0.6));
  yield* waitFor(1.8);
  yield* cap.say('!', '옛날 수학자 가우스도 어릴 때\n이렇게 풀었다는 이야기가 있어요', C.teal);
  yield* waitFor(2.0);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '1부터 20까지는 얼마일까요?', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.2);
  yield* all(cap.hide(), end.show('NEXT  계산이 빨라지는 비밀', '손가락 10개로\n9단 끝내기!'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
