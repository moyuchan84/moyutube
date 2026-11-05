import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutBack, sequence, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 수학 「계산이 빨라지는 비밀」 2편 — 손가락 10개로 9단
// 1) 비법: 두 손을 펴고 왼쪽부터 1~10. 9 × n 이면 n 번째 손가락을 접는다 → 왼쪽 손가락 수 = 십의 자리, 오른쪽 = 일의 자리
//    9 × 3 → 2 | 7 → 27, 9 × 7 → 6 | 3 → 63
// 2) 왜: 9 = 10 − 1 이라 9 × 3 = 30 − 3. 10개짜리 줄 3개에서 마지막 줄의 3개를 빼면 꽉 찬 줄 2개(20) + 7
//    접은 손가락 왼쪽 = n − 1, 오른쪽 = 10 − n
// 9 × 1 ~ 9 × 10 에서만 된다

const NAME = 'nineFinger';
const SKIN = '#E9B48F';
const EDGE = '#C98B66';
const FOLD = '#B98366';

// 손바닥이 보이게 든 두 손. 1 = 왼손 새끼 … 5 = 왼손 엄지, 6 = 오른손 엄지 … 10 = 오른손 새끼
const FINGERS = (() => {
  const left = [
    {x: -400, len: 150, rot: -6},
    {x: -335, len: 190, rot: -2},
    {x: -270, len: 205, rot: 0},
    {x: -205, len: 185, rot: 3},
    {x: -128, len: 130, rot: 38, y: 90},
  ];
  const right = [...left].reverse().map(f => ({...f, x: -f.x, rot: -f.rot}));
  return [...left, ...right] as {x: number; len: number; rot: number; y?: number}[];
})();
const PALM_Y = 60;

type HandsSig = {fold: SimpleSignal<number>[]; tint: SimpleSignal<number>[]};
function makeHands(): HandsSig {
  return {fold: FINGERS.map(() => createSignal(0)), tint: FINGERS.map(() => createSignal(0))};
}
// tint: 0 = 피부, 1 = 앰버(십의 자리), 2 = 민트(일의 자리)
const tintCol = (t: number) => (t === 1 ? C.amber : t === 2 ? C.teal : SKIN);

function Hands(o: {s: HandsSig; labels?: boolean; labelRefs?: Txt[]}) {
  const {s} = o;
  return (
    <Node>
      {[-265, 265].map(x => (
        <Rect x={x} y={PALM_Y + 110} width={290} height={240} radius={[40, 40, 80, 80]} fill={SKIN} stroke={EDGE} lineWidth={3} />
      ))}
      {FINGERS.map((f, i) => (
        <Node x={f.x} y={PALM_Y + (f.y ?? 0)} rotation={f.rot}>
          <Rect
            width={56}
            height={() => f.len * (1 - 0.72 * s.fold[i]())}
            offsetY={1}
            radius={28}
            fill={() => (s.fold[i]() > 0.5 ? FOLD : tintCol(s.tint[i]()))}
            stroke={EDGE}
            lineWidth={3}
          />
          {o.labels ? (
            <Txt
              ref={el => o.labelRefs && (o.labelRefs[i] = el)}
              y={-f.len - 42}
              rotation={-f.rot}
              text={String(i + 1)}
              fontFamily={FONT}
              fontSize={40}
              fontWeight={900}
              fill={C.ink}
            />
          ) : null}
        </Node>
      ))}
    </Node>
  );
}

// n 번째(1부터) 손가락을 접고 왼쪽 · 오른쪽을 칠한다
function* foldAt(s: HandsSig, n: number, t = 0.4) {
  yield* all(
    s.fold[n - 1](1, t, easeInOutCubic),
    ...FINGERS.map((_, i) => (i === n - 1 ? s.tint[i](0, 0) : s.tint[i](i < n - 1 ? 1 : 2, 0))),
  );
}
function* openAll(s: HandsSig, t = 0.3) {
  yield* all(...FINGERS.map((_, i) => all(s.fold[i](0, t), s.tint[i](0, 0))));
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅 */
  const hookN = createRef<Node>();
  const hs = makeHands();
  const hookAns = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={330} scale={0.9} opacity={0}>
      <Hands s={hs} />
      <Txt ref={hookAns} y={-260} text={'9 × 3 = 27'} fontFamily={FONT} fontSize={96} fontWeight={900} fill={C.teal} shadowColor={C.teal} shadowBlur={30} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const m0 = makeHands();
  const m1 = makeHands();
  const m2 = makeHands();
  m2.fold[2](1);
  const setup = addSteps(view, {
    badge: '두 손을 펴요',
    color: C.teal,
    steps: [
      {draw: () => <Node y={-20} scale={0.3}><Hands s={m0} /></Node>, label: '손바닥이 보이게'},
      {draw: () => <Node y={-20} scale={0.3}><Hands s={m1} labels /></Node>, label: '왼쪽부터 1 ~ 10'},
      {draw: () => <Node y={-20} scale={0.3}><Hands s={m2} labels /></Node>, label: '9 × 3 → 3번 접기'},
    ],
  });

  /* 2. 비법 · 따라 하기 무대 */
  const SY = -200;
  const stage = createRef<Node>();
  const ss = makeHands();
  const labels: Txt[] = [];
  const q = createRef<Txt>();
  const tens = createRef<Txt>();
  const ones = createRef<Txt>();
  view.add(
    <Node ref={stage} y={SY} opacity={0}>
      <Txt ref={q} y={-380} text={'9 × 3'} fontFamily={FONT} fontSize={110} fontWeight={900} fill={C.ink} />
      <Node y={20}>
        <Hands s={ss} labels labelRefs={labels} />
      </Node>
      <Txt ref={tens} x={-265} y={430} fontFamily={FONT} fontSize={130} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={30} opacity={0} />
      <Txt ref={ones} x={265} y={430} fontFamily={FONT} fontSize={130} fontWeight={900} fill={C.teal} shadowColor={C.teal} shadowBlur={30} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 10개짜리 줄 3개 */
  const WY = -260;
  const whyN = createRef<Node>();
  const dots: Circle[] = [];
  const minus = createRef<Txt>();
  const lastTag = createRef<Txt>();
  const brace = createRef<Rect>();
  const D = 72;
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Txt ref={minus} y={-280} text={'9 × 3 = 10 × 3 − 3'} fontFamily={FONT} fontSize={74} fontWeight={900} fill={C.ink} opacity={0} />
      {Array.from({length: 30}, (_, i) => (
        <Circle ref={el => (dots[i] = el)} x={(i % 10) * D - 4.5 * D} y={Math.floor(i / 10) * D - D} size={D - 16} fill={C.violet} opacity={0} />
      ))}
      <Rect ref={brace} y={-D / 2} width={10 * D + 16} height={2 * D + 8} radius={20} stroke={C.amber} lineWidth={6} opacity={0} />
      <Txt ref={lastTag} y={D * 2.1} text={'남은 7개'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.teal} opacity={0} />
    </Node>,
  );
  const whyEq = createRef<Txt>();
  view.add(<Txt ref={whyEq} y={WY + 290} text={'20 + 7 = 27'} fontFamily={FONT} fontSize={84} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={24} opacity={0} />);

  const card = bigCard('9 = 10 − 1', C.teal, 80);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['손가락 10개로', '9단 끝!'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 3, series: '계산이 빨라지는 비밀'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* foldAt(hs, 3);
  yield* popIn(hookAns(), 0.4, 0.5);
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '두 손을 손바닥이 보이게 쫙!', C.teal), setup.step(0));
  yield* waitFor(1.1);
  yield* all(cap.say('준비', '왼쪽 새끼손가락부터\n1, 2, 3 … 10', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '9 × 3 이면\n3번 손가락을 접어요', C.violet), setup.step(2));
  yield* waitFor(1.2);

  /* ═════════ 2. 비법 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  stage().opacity(1);
  yield* iris.reveal([0, SY]);
  cue('pop');
  yield* all(cap.say('비법', '3번 손가락을 접으면', C.violet), foldAt(ss, 3), labels[2].fill(C.coral, 0.3));
  yield* waitFor(1.2);
  cue('pop');
  tens().text('2');
  yield* all(cap.say('비법', '접은 손가락 왼쪽은 2개\n→ 십의 자리 2', C.amber), popIn(tens(), 0.4, 0.5));
  yield* waitFor(1.0);
  cue('pop');
  ones().text('7');
  yield* all(cap.say('비법', '오른쪽은 7개\n→ 일의 자리 7', C.teal), popIn(ones(), 0.4, 0.5));
  yield* waitFor(1.0);
  cue('chime');
  yield* all(
    cap.say('비법', '9 × 3 = 27 정답!', C.amber),
    tens().x(-60, 0.5, easeInOutCubic),
    ones().x(60, 0.5, easeInOutCubic),
    sparks(view, [0, SY + 430], C.amber, 12, 220),
  );
  yield* waitFor(1.0);

  /* 따라 하기: 9 × 7 */
  yield* all(openAll(ss), tens().opacity(0, 0.3), ones().opacity(0, 0.3), labels[2].fill(C.ink, 0.3));
  tens().x(-265);
  ones().x(265);
  q().text('9 × 7');
  cue('swish');
  yield* all(punch(q(), 0.12), cap.say('TRY', '이번엔 직접! 9 × 7 은?', C.coral));
  yield* waitFor(1.2);
  dim().opacity(0.5);
  timer.count(6);
  timer.node().opacity(1);
  yield* timer.run(6, {
    6: () => cap.say('TRY', '몇 번 손가락을 접을까요?', C.coral),
    3: () => all(foldAt(ss, 7), labels[6].fill(C.coral, 0.3)),
  });
  timer.node().opacity(0);
  dim().opacity(0);
  tens().text('6');
  ones().text('3');
  cue('chime');
  yield* all(cap.say('정답', '왼쪽 6개, 오른쪽 3개 → 63!', C.teal), popIn(tens(), 0.4, 0.5), delay(0.2, popIn(ones(), 0.4, 0.5)));
  yield* waitFor(1.2);

  /* 빠르게 몇 개 더 */
  yield* cap.say('더!', '9 × 4 는? 9 × 9 는?', C.violet);
  for (const [n, a, b] of [[4, '3', '6'], [9, '8', '1']] as [number, string, string][]) {
    yield* all(openAll(ss, 0.2), labels[6].fill(C.ink, 0.2), labels[3].fill(C.ink, 0.2), tens().opacity(0, 0.2), ones().opacity(0, 0.2));
    q().text(`9 × ${n}`);
    cue('pop');
    yield* all(foldAt(ss, n, 0.3), labels[n - 1].fill(C.coral, 0.2));
    tens().text(a);
    ones().text(b);
    yield* all(popIn(tens(), 0.3, 0.5), popIn(ones(), 0.3, 0.5));
    yield* waitFor(0.7);
  }

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, SY]);
  stage().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  cue('pop');
  yield* all(cap.say('01', '9는 10보다 1 작아요', C.ink), popIn(minus(), 0.5, 0.6));
  yield* waitFor(1.4);
  cue('swish');
  yield* all(cap.say('02', '10개짜리 줄 3개 = 30', C.violet), sequence(0.02, ...dots.map(d => popIn(d, 0.25, 0.3))));
  yield* waitFor(0.8);
  cue('pop');
  yield* all(cap.say('03', '여기서 3개를 빼면 9 × 3', C.coral), ...[27, 28, 29].map(i => dots[i].fill(C.coral, 0.3)));
  yield* waitFor(0.5);
  yield* all(...[27, 28, 29].map(i => all(dots[i].opacity(0, 0.5), dots[i].y(dots[i].y() + 60, 0.5))));
  yield* waitFor(0.6);
  cue('pop');
  yield* all(
    cap.say('04', '꽉 찬 줄 2개 → 십의 자리 2\n(접은 손가락 왼쪽)', C.amber),
    popIn(brace(), 0.4, 0.8),
    ...dots.slice(0, 20).map(d => d.fill(C.amber, 0.4)),
  );
  yield* waitFor(1.6);
  cue('pop');
  yield* all(
    cap.say('05', '마지막 줄엔 10 − 3 = 7\n(접은 손가락 오른쪽)', C.teal),
    ...dots.slice(20, 27).map(d => d.fill(C.teal, 0.4)),
    popIn(lastTag(), 0.4, 0.6),
  );
  yield* waitFor(1.6);
  cue('chime');
  yield* all(cap.say('06', '그래서 손가락이 답을 알아요', C.amber), popIn(whyEq(), 0.5, 0.5));
  yield* waitFor(1.6);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  whyEq().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '9 × 1 부터 9 × 10 까지 다 돼요!', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(1.2);
  yield* all(cap.hide(), end.show('NEXT  계산이 빨라지는 비밀', '11 곱하기는\n벌리고 더하기!'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
