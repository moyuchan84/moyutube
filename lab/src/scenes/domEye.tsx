import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInOutExpo, easeOutBack, easeOutExpo, waitFor} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak, zoomInto} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S11 — 내 눈에도 주인이 있다? (우세안)
// 1) 따라 하기: 두 손으로 세모 구멍 → 멀리 있는 물건을 구멍 가운데에 → 한쪽씩 눈 감기
//    한쪽을 감으면 물건이 그대로, 다른 쪽을 감으면 물건이 구멍 밖으로 휙 → 그대로일 때 뜬 눈이 주인 눈
// 2) 두 눈으로 볼 때 뇌는 주인 눈의 그림을 기준으로 겨눈다. 손잡이처럼 눈도 주로 쓰는 쪽이 있다 (오른눈이 더 많다)
// 그림은 오른눈이 주인인 사람 기준

const NAME = 'domEye';
const SKIN = '#E9B48F';
const WALL = '#2B3358';

// 벽 위 시계 (멀리 있는 물건)
function Clock(o: {x?: number; y?: number; size?: number}) {
  const s = o.size ?? 150;
  return (
    <Node x={o.x ?? 0} y={o.y ?? 0}>
      <Circle size={s} fill={'#F4F1EA'} stroke={C.amber} lineWidth={s * 0.08} />
      <Line points={[[0, 0], [0, -s * 0.32]]} stroke={'#111'} lineWidth={s * 0.06} lineCap="round" />
      <Line points={[[0, 0], [s * 0.24, 0]]} stroke={'#111'} lineWidth={s * 0.06} lineCap="round" />
      <Circle size={s * 0.1} fill={C.coral} />
    </Node>
  );
}

// 두 손으로 만든 세모 구멍 (손 판에서 세모를 도려낸다)
const HOLE: [number, number][] = [[-120, 90], [120, 90], [0, -110]];
function Hands(o: {w?: number; h?: number}) {
  const w = o.w ?? 900;
  const h = o.h ?? 640;
  return (
    <Node cache>
      <Rect width={w} height={h} radius={160} fill={SKIN} />
      {[-1, 1].map(s => (
        <>
          <Line points={[[s * 60, -h / 2 + 40], [s * 200, -h / 2 + 160]]} stroke={'#C98E6A'} lineWidth={8} lineCap="round" />
          <Line points={[[s * 140, 120], [s * 330, 230]]} stroke={'#C98E6A'} lineWidth={8} lineCap="round" />
        </>
      ))}
      <Line points={HOLE} closed radius={20} fill={'#000'} compositeOperation={'destination-out'} />
    </Node>
  );
}

// 눈 아이콘: open 이 0 이면 감은 눈(선)
function EyeIcon(o: {x: number; open: () => number; color: string; label: string}) {
  return (
    <Node x={o.x}>
      <Rect width={110} height={() => 8 + 62 * o.open()} radius={40} fill={'#ffffff'} stroke={o.color} lineWidth={6} />
      <Circle size={() => 34 * o.open()} fill={'#111'} />
      <Txt y={70} text={o.label} fontFamily={FONT} fontSize={32} fontWeight={900} fill={o.color} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 두 눈 → 한쪽에 왕관 */
  const hookN = createRef<Node>();
  const crown = createRef<Line>();
  view.add(
    <Node ref={hookN} y={250} opacity={0}>
      {[-1, 1].map(s => (
        <Node x={s * 170}>
          <Rect width={240} height={150} radius={75} fill={'#ffffff'} stroke={C.violet} lineWidth={8} />
          <Circle size={90} fill={'#3B2F7A'} />
          <Circle size={40} fill={'#111'} />
          <Circle x={14} y={-14} size={16} fill={'#ffffff'} />
        </Node>
      ))}
      <Line
        ref={crown}
        x={170}
        y={-150}
        points={[[-80, 40], [-80, -30], [-40, 10], [0, -50], [40, 10], [80, -30], [80, 40]]}
        closed
        fill={C.amber}
        stroke={'#B37A00'}
        lineWidth={5}
        shadowColor={C.amber}
        shadowBlur={30}
        opacity={0}
      />
    </Node>,
  );

  /* 1. 준비 */
  const Mini = (k: number) => (
    <Node scale={0.3}>
      <Rect width={900} height={640} radius={40} fill={WALL} clip stroke={'#ffffff33'} lineWidth={6}>
        <Clock x={k === 0 ? 260 : 0} y={k === 0 ? -170 : 0} size={150} />
        <Hands />
      </Rect>
      {k === 2 ? (
        <Node y={-420}>
          <EyeIcon x={-90} open={() => 0} color={C.teal} label={''} />
          <EyeIcon x={90} open={() => 1} color={C.coral} label={''} />
        </Node>
      ) : null}
    </Node>
  );
  const setup = addSteps(view, {
    badge: '따라 해 봐요',
    color: C.violet,
    steps: [
      {draw: () => Mini(0), label: '두 손 세모 구멍'},
      {draw: () => Mini(1), label: '먼 물건을 가운데'},
      {draw: () => Mini(2), label: '한쪽씩 눈 감기'},
    ],
  });

  /* 2. 따라 하기: 구멍 속 보기 */
  const TY = -170;
  const tryN = createRef<Node>();
  const shift = createSignal(0); // 보이는 벽(시계)이 옆으로 밀린 정도
  const openL = createSignal(1);
  const openR = createSignal(1);
  const result = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Rect width={900} height={640} radius={40} fill={WALL} clip stroke={'#ffffff33'} lineWidth={4}>
        <Node x={shift}>
          <Rect y={190} width={1400} height={14} fill={'#ffffff18'} />
          <Clock size={150} />
        </Node>
        <Hands />
      </Rect>
      <Node y={-420}>
        <EyeIcon x={-90} open={openL} color={C.teal} label={'왼눈'} />
        <EyeIcon x={90} open={openR} color={C.coral} label={'오른눈'} />
      </Node>
      <Txt ref={result} y={390} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.amber} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 위에서 본 그림 */
  const topN = createRef<Node>();
  const EY = 300;
  const EX = 90;
  const HY = 20; // 손 구멍
  const OY = -330; // 물건
  const lineR = createRef<Line>();
  const lineL = createRef<Line>();
  const crownTop = createRef<Line>();
  const missTag = createRef<Txt>();
  // 왼눈 → 구멍 → 연장하면 물건 왼쪽을 지난다
  const leftHit = -EX + ((0 - -EX) * (EY - OY)) / (EY - HY);
  view.add(
    <Node ref={topN} y={-320} opacity={0}>
      <Clock x={0} y={OY} size={80} />
      <Txt x={0} y={OY - 70} text={'먼 물건'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.dim} />
      <Rect x={-230} y={HY} width={380} height={30} radius={15} fill={SKIN} />
      <Rect x={230} y={HY} width={380} height={30} radius={15} fill={SKIN} />
      <Txt x={-330} y={HY + 50} text={'손 구멍'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={SKIN} />
      <Circle x={-EX} y={EY} size={64} fill={'#ffffff'} stroke={C.teal} lineWidth={6} />
      <Circle x={EX} y={EY} size={64} fill={'#ffffff'} stroke={C.coral} lineWidth={6} />
      <Txt x={-EX - 70} y={EY + 60} text={'왼눈'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.teal} />
      <Txt x={EX + 80} y={EY + 60} text={'오른눈'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.coral} />
      <Line
        ref={crownTop}
        x={EX}
        y={EY - 80}
        scale={0.45}
        points={[[-80, 40], [-80, -30], [-40, 10], [0, -50], [40, 10], [80, -30], [80, 40]]}
        closed
        fill={C.amber}
        shadowColor={C.amber}
        shadowBlur={20}
        opacity={0}
      />
      <Line ref={lineR} points={[[EX, EY], [0, OY]]} stroke={C.coral} lineWidth={6} end={0} />
      <Line ref={lineL} points={[[-EX, EY], [leftHit, OY]]} stroke={C.teal} lineWidth={6} lineDash={[14, 10]} end={0} />
      <Txt ref={missTag} x={leftHit} y={OY + 60} text={'빗나감'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.teal} opacity={0} />
    </Node>,
  );

  /* 4. 생활 예: 망원경 */
  const scopeN = createRef<Node>();
  view.add(
    <Node ref={scopeN} y={-300} opacity={0}>
      <Rect x={60} rotation={-12} width={460} height={110} radius={20} fill={C.violet} stroke={C.ink} lineWidth={5} />
      <Rect x={-200} y={56} rotation={-12} width={90} height={80} radius={12} fill={'#5B4FD1'} stroke={C.ink} lineWidth={5} />
      <Circle x={-330} y={90} size={120} fill={'#ffffff'} stroke={C.coral} lineWidth={7} />
      <Circle x={-330} y={90} size={44} fill={'#111'} />
      <Txt x={-330} y={200} text={'주인 눈'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.coral} />
    </Node>,
  );

  const card = bigCard('그대로 보이는 쪽 = 주인 눈', C.violet, 58);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['내 눈에도', '주인이 있다?'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 4, series: '눈의 비밀 2부', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.violet);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('boom');
  crown().scale(0.3);
  yield* all(crown().opacity(1, 0.3), crown().scale(1, 0.6, easeOutBack), sparks(hookN(), [170, -150], C.amber, 12, 160));
  yield* all(title.dock(), waitFor(0.4));
  yield* zoomInto(hookN(), [170, 250], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '두 손을 겹쳐\n세모 구멍을 만들어요', C.violet), setup.step(0));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '팔을 뻗고, 두 눈으로\n먼 물건을 구멍 가운데에', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '그리고 한쪽씩 눈을 감아요', C.teal), setup.step(2));
  yield* waitFor(0.9);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.9);
  timer.count(12);
  timer.node().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TRY', '두 눈을 뜨고\n물건을 구멍 가운데에', C.violet);
  yield* timer.run(12, {
    9: () => all(cap.say('TRY', '왼눈을 감아 보세요', C.teal), openL(0, 0.4)),
    7: () => all(result().text('그대로!', 0), result().opacity(1, 0.3)),
    5: () => all(cap.say('TRY', '이번엔 오른눈을 감아요', C.coral), openL(1, 0.4), openR(0, 0.4), result().opacity(0, 0.2)),
    4: () => all(shift(560, 0.35, easeOutExpo), delay(0.2, all(result().text('휙! 사라졌다', 0), result().opacity(1, 0.3)))),
  });
  timer.node().opacity(0);
  cue('chime');
  yield* all(cap.say('!', '물건이 그대로일 때\n뜨고 있던 눈 = 주인 눈!', C.amber), openR(1, 0.4), shift(0, 0.6, easeInOutCubic), result().opacity(0, 0.3));
  yield* waitFor(1.6);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  topN().opacity(1);
  yield* iris.reveal([0, -300]);
  yield* cap.say('01', '물건을 구멍에 맞출 때\n뇌는 한쪽 눈을 기준으로 해요', C.violet);
  cue('swish');
  yield* lineR().end(1, 0.7, easeOutExpo);
  cue('pop');
  yield* all(crownTop().opacity(1, 0.3), punch(crownTop(), 0.3));
  yield* waitFor(0.6);
  yield* cap.say('02', '다른 눈으로 보면\n구멍 밖으로 빗나가요', C.teal);
  cue('swish');
  yield* lineL().end(1, 0.7, easeOutExpo);
  yield* all(popIn(missTag(), 0.4, 0.6), shake(topN(), 6, 0.3));
  yield* waitFor(1.2);
  yield* cap.say('03', '오른손잡이 · 왼손잡이처럼 눈도\n주로 쓰는 쪽이 있어요', C.amber);
  yield* waitFor(1.4);
  yield* cap.say('04', '오른눈이 주인인 사람이\n더 많아요', C.coral);
  yield* waitFor(1.4);

  yield* wipe.cover();
  topN().opacity(0);
  scopeN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('05', '망원경이나 카메라를 볼 때\n저절로 주인 눈을 대요', C.violet), popIn(scopeN(), 0.5, 0.6));
  yield* waitFor(1.8);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  scopeN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '내 주인 눈은 어느 쪽이었나요?', C.violet));
  yield* all(shine(card), sparks(view, [0, -420], C.violet, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 2부', '같은 색인데\n달라 보인다?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
