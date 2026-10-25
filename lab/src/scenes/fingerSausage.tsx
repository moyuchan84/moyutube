import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInOutExpo, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, streak, zoomInto} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S10 — 두 손가락 사이에 소시지가 뜬다? (두 눈 그림 겹치기, 입체시)
// 1) 따라 하기: 두 검지 끝을 눈앞에서 맞대고 먼 곳을 보면 손가락 사이에 작은 "소시지"가 떠 보인다
// 2) 먼 곳을 보면 가까운 손가락은 두 눈에 서로 다른 자리에 맺힌다 (왼눈은 오른쪽으로, 오른눈은 왼쪽으로)
// 3) 뇌가 두 그림을 겹치면 한쪽 손가락 끝 + 다른 쪽 손가락 끝이 겹친 부분이 소시지. 한쪽 눈을 감으면 사라진다

const NAME = 'fingerSausage';
const SKIN = '#E9B48F';
const NAIL = '#F8DCCB';
const FL = 520; // 손가락 길이
const FH = 74;

// dir=1: 왼손 검지(오른쪽을 가리킴), dir=-1: 오른손 검지. tip 이 손가락 끝 x
function Finger(o: {tip: number; dir: 1 | -1; y?: number; fill?: string; opacity?: number}) {
  const cx = o.tip - (o.dir * FL) / 2;
  return (
    <Node y={o.y ?? 0} opacity={o.opacity ?? 1}>
      <Rect x={cx} width={FL} height={FH} radius={FH / 2} fill={o.fill ?? SKIN} />
      <Rect x={o.tip - o.dir * 40} y={-12} width={46} height={36} radius={14} fill={NAIL} opacity={o.fill ? 0.5 : 1} />
    </Node>
  );
}

// 먼 곳을 볼 때 보이는 손가락: 두 겹 + 가운데 소시지
// 실제 손가락 끝은 -g · +g. 왼눈 그림은 +SH, 오른눈 그림은 -SH 만큼 밀려 보인다
const SH = 90;
function DoubleView(o: {gap: () => number}) {
  return (
    <Node>
      {[SH, -SH].map(s => (
        <>
          <Node x={() => s - o.gap()} opacity={0.5}>
            <Finger tip={0} dir={1} />
          </Node>
          <Node x={() => s + o.gap()} opacity={0.5}>
            <Finger tip={0} dir={-1} />
          </Node>
        </>
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

  /* 0. 훅: 손가락 두 개 → 가운데 소시지가 둥 */
  const hookN = createRef<Node>();
  const hookSaus = createRef<Rect>();
  view.add(
    <Node ref={hookN} y={250} opacity={0}>
      <Finger tip={-70} dir={1} />
      <Finger tip={70} dir={-1} />
      <Rect ref={hookSaus} width={150} height={FH} radius={FH / 2} fill={SKIN} opacity={0} shadowColor={C.amber} shadowBlur={30} />
    </Node>,
  );

  /* 1. 준비 */
  const Mini = (k: number) => (
    <Node scale={0.32}>
      <Rect width={900} height={640} radius={40} fill={'#07080E'} stroke={'#ffffff33'} lineWidth={6} clip>
      {k === 0 ? (
        <>
          <Finger tip={0} dir={1} y={80} />
          <Finger tip={0} dir={-1} y={80} />
        </>
      ) : k === 1 ? (
        <>
          <Circle y={-180} size={90} stroke={C.amber} lineWidth={14} />
          <Circle y={-180} size={20} fill={C.amber} />
          <Node y={120}>
            <DoubleView gap={() => 0} />
          </Node>
        </>
      ) : (
        <>
          <Finger tip={-60} dir={1} y={80} opacity={0.6} />
          <Finger tip={60} dir={-1} y={80} opacity={0.6} />
          <Rect y={80} width={200} height={FH} radius={FH / 2} fill={SKIN} shadowColor={C.amber} shadowBlur={40} />
        </>
      )}
      </Rect>
    </Node>
  );
  const setup = addSteps(view, {
    badge: '따라 해 봐요',
    color: C.coral,
    steps: [
      {draw: () => Mini(0), label: '검지 끝 맞대기'},
      {draw: () => Mini(1), label: '먼 곳 보기'},
      {draw: () => Mini(2), label: '살짝 떼기'},
    ],
  });

  /* 2. 따라 하기 화면 */
  const TY = -200;
  const tryN = createRef<Node>();
  const gap = createSignal(0);
  const saus = createRef<Rect>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Circle y={-300} size={110} stroke={C.amber} lineWidth={14} shadowColor={C.amber} shadowBlur={20} />
      <Circle y={-300} size={24} fill={C.amber} />
      <Txt y={-200} text={'먼 벽'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.amber} />
      <Node y={130}>
        <DoubleView gap={gap} />
        <Rect ref={saus} width={() => Math.max(0, 2 * (SH - gap()))} height={FH} radius={FH / 2} fill={SKIN} opacity={0} shadowColor={C.amber} shadowBlur={30} />
      </Node>
      <Txt y={260} text={'손가락은 눈앞 한 뼘'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 위에서 본 그림 */
  const topN = createRef<Node>();
  const EY = 330; // 눈 높이
  const EX = 90;
  const FY = 80; // 손가락 높이
  const WY = -330; // 먼 벽
  const proj = (ex: number) => ex + ((0 - ex) * (EY - WY)) / (EY - FY);
  const sightL = createRef<Line>();
  const sightR = createRef<Line>();
  const rayL = createRef<Line>();
  const rayR = createRef<Line>();
  const tagL = createRef<Txt>();
  const tagR = createRef<Txt>();
  view.add(
    <Node ref={topN} y={-330} opacity={0}>
      <Line points={[[-430, WY], [430, WY]]} stroke={C.dim} lineWidth={6} />
      <Txt x={-430} y={WY - 40} offsetX={-1} text={'먼 벽'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.dim} />
      <Circle y={WY} size={30} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
      {/* 손가락 (위에서) */}
      <Rect x={-150} y={FY} width={300} height={34} radius={17} fill={SKIN} />
      <Rect x={150} y={FY} width={300} height={34} radius={17} fill={SKIN} />
      {/* 두 눈 */}
      <Circle x={-EX} y={EY} size={64} fill={'#ffffff'} stroke={C.teal} lineWidth={6} />
      <Circle x={EX} y={EY} size={64} fill={'#ffffff'} stroke={C.coral} lineWidth={6} />
      <Circle x={-EX} y={EY - 14} size={24} fill={'#111'} />
      <Circle x={EX} y={EY - 14} size={24} fill={'#111'} />
      <Txt x={-EX - 60} y={EY + 70} text={'왼눈'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.teal} />
      <Txt x={EX + 60} y={EY + 70} text={'오른눈'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.coral} />
      {/* 시선: 두 눈 → 먼 벽 */}
      <Line ref={sightL} points={[[-EX, EY], [0, WY]]} stroke={C.amber} lineWidth={4} lineDash={[12, 10]} end={0} />
      <Line ref={sightR} points={[[EX, EY], [0, WY]]} stroke={C.amber} lineWidth={4} lineDash={[12, 10]} end={0} />
      {/* 손가락 끝이 벽에 비치는 자리 */}
      <Line ref={rayL} points={[[-EX, EY], [proj(-EX), WY]]} stroke={C.teal} lineWidth={5} end={0} />
      <Line ref={rayR} points={[[EX, EY], [proj(EX), WY]]} stroke={C.coral} lineWidth={5} end={0} />
      <Txt ref={tagL} x={proj(-EX)} y={WY - 46} text={'왼눈엔 여기'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.teal} opacity={0} />
      <Txt ref={tagR} x={proj(EX)} y={WY - 46} text={'오른눈엔 여기'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 4. 왼눈 그림 + 오른눈 그림 → 겹치기 */
  const mergeN = createRef<Node>();
  const panL = createRef<Node>();
  const panR = createRef<Node>();
  const sausHi = createRef<Rect>();

  const D = 30;
  const Panel = (o: {sh: number; color: string; label: string; refFn: (n: Node) => void; x: number}) => (
    <Node ref={o.refFn} x={o.x}>
      <Rect width={480} height={240} radius={24} clip stroke={o.color} lineWidth={5}>
        <Finger tip={-D + o.sh} dir={1} fill={SKIN} />
        <Finger tip={D + o.sh} dir={-1} fill={SKIN} />
      </Rect>
    </Node>
  );
  view.add(
    <Node ref={mergeN} y={-300} opacity={0}>
      <Panel sh={SH} color={C.teal} label={'왼눈 그림'} x={-260} refFn={n => panL(n)} />
      <Panel sh={-SH} color={C.coral} label={'오른눈 그림'} x={260} refFn={n => panR(n)} />
      <Txt x={-200} y={-160} text={'왼눈 그림'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.teal} />
      <Txt x={200} y={-160} text={'오른눈 그림'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.coral} />
      <Rect
        ref={sausHi}
        width={2 * (SH - D)}
        height={FH + 16}
        radius={(FH + 16) / 2}
        stroke={C.amber}
        lineWidth={7}
        shadowColor={C.amber}
        shadowBlur={30}
        opacity={0}
      />
    </Node>,
  );

  const card = bigCard('두 눈 그림을 겹쳐 = 입체로 보기', C.coral, 54);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['두 손가락 사이에', '소시지가 뜬다?'], {y: -430, accent: C.coral});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 4, series: '눈의 비밀 2부', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.coral);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  hookSaus().scale(0.4);
  yield* all(hookSaus().opacity(1, 0.4), hookSaus().scale(1, 0.6, easeOutExpo), hookSaus().y(-30, 1.2, easeInOutCubic));
  yield* all(title.dock(), hookSaus().y(10, 0.9, easeInOutCubic));
  yield* zoomInto(hookN(), [0, 250], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '두 검지 끝을 눈앞 한 뼘에서\n맞대요', C.coral), setup.step(0));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '손가락 말고\n먼 벽을 보세요', C.amber), setup.step(1));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '손가락을 살짝 떼면?', C.teal), setup.step(2));
  yield* waitFor(1.0);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.9);
  timer.count(10);
  timer.node().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TRY', '지금 해 보세요!\n눈은 먼 곳에', C.coral);
  yield* timer.run(10, {
    7: () => all(cap.say('TRY', '손가락 사이에\n뭐가 떠 있나요?', C.amber), gap(10, 0.9, easeInOutCubic), delay(0.3, saus().opacity(1, 0.5))),
    4: () => cap.say('TRY', '손가락을 더 떼면\n소시지가 줄어요', C.teal),
    3: () => gap(45, 0.9, easeInOutCubic),
  });
  timer.node().opacity(0);
  cue('chime');
  yield* cap.say('!', '공중에 뜬 손가락 소시지!', C.amber);
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? 위에서 보기 ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  topN().opacity(1);
  yield* iris.reveal([0, -300]);
  yield* cap.say('01', '위에서 내려다보면\n두 눈은 조금 떨어져 있어요', C.teal);
  cue('swish');
  yield* all(sightL().end(1, 0.7), sightR().end(1, 0.7));
  yield* waitFor(0.6);
  yield* cap.say('02', '먼 곳을 볼 때 가까운 손가락은\n눈마다 다른 자리에 보여요', C.coral);
  cue('swish');
  yield* all(rayL().end(1, 0.7), rayR().end(1, 0.7));
  yield* all(popIn(tagL(), 0.4, 0.6), delay(0.2, popIn(tagR(), 0.4, 0.6)));
  yield* waitFor(1.4);

  /* ═════════ 4. 두 그림 겹치기 ═════════ */
  yield* wipe.cover();
  topN().opacity(0);
  mergeN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('03', '왼눈 그림과 오른눈 그림을', C.teal);
  yield* waitFor(0.8);
  cue('whoosh');
  yield* all(
    cap.say('03', '뇌가 하나로 겹치면', C.amber),
    panL().x(0, 1.0, easeInOutExpo),
    panR().x(0, 1.0, easeInOutExpo),
    panL().opacity(0.6, 1.0),
    panR().opacity(0.6, 1.0),
  );
  cue('boom');
  yield* all(popIn(sausHi(), 0.5, 0.6), punch(mergeN(), 0.04));
  yield* cap.say('04', '두 손가락 끝이 겹친 곳 = 소시지!', C.amber);
  yield* waitFor(1.4);
  yield* all(cap.say('05', '한쪽 눈을 감으면?\n겹칠 그림이 없어 사라져요', C.coral), panR().opacity(0, 0.6), sausHi().opacity(0, 0.6));
  yield* waitFor(1.6);
  yield* all(panR().opacity(0.6, 0.4), sausHi().opacity(1, 0.4));
  yield* cap.say('06', '이렇게 두 그림을 겹쳐서\n멀고 가까움을 알아요', C.teal);
  yield* waitFor(1.6);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  mergeN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '이걸 "입체시"라고 해요', C.coral));
  yield* all(shine(card), sparks(view, [0, -420], C.coral, 14, 300));
  yield* waitFor(0.6);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 2부', '내 눈에도\n주인이 있다?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
