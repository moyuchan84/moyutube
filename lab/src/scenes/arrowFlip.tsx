import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutCubic, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「부엌 실험실」 1편 — 물컵 뒤 화살표가 뒤집힌다? (빛의 굴절)
// 1) 따라 하기: 화면에 → 화살표. 물을 가득 채운 투명한 컵을 화면 앞 한 뼘에 두고 컵 너머로 보면 ← 로 보인다
// 2) 둥근 물컵은 볼록 렌즈처럼 빛을 꺾는다. 꺾인 빛이 컵 안에서 엇갈려 왼쪽 · 오른쪽이 바뀐다 (위아래는 그대로)
// 컵이 화면에 너무 가까우면 뒤집히지 않는다 → 거리를 바꿔 보라고 안내. 깨지지 않는 투명 플라스틱 컵 권장

const NAME = 'arrowFlip';
const WATER = '#5AA8FF';
const TAIL = C.amber;
const TIP = C.teal;

// 왼쪽 꼬리(앰버) → 오른쪽 머리(민트) 화살표
function Arrow(o: {w?: number; h?: number; x?: number; y?: number; flip?: boolean; opacity?: number}) {
  const w = o.w ?? 560;
  const h = o.h ?? 96;
  return (
    <Node x={o.x ?? 0} y={o.y ?? 0} scale={[o.flip ? -1 : 1, 1]} opacity={o.opacity ?? 1}>
      <Rect x={-w / 2 + (w - h * 1.3) / 2} width={w - h * 1.3} height={h} radius={[h / 2, 0, 0, h / 2]} fill={TAIL} />
      <Line points={[[w / 2 - h * 1.3 - 2, -h * 1.05], [w / 2, 0], [w / 2 - h * 1.3 - 2, h * 1.05]]} closed fill={TIP} />
    </Node>
  );
}

// 앞에서 본 투명한 컵 (물 가득)
function Glass(o: {w?: number; h?: number; x?: number; y?: number; children?: any}) {
  const w = o.w ?? 300;
  const h = o.h ?? 440;
  return (
    <Node x={o.x ?? 0} y={o.y ?? 0}>
      <Rect width={w} height={h} radius={[10, 10, 40, 40]} fill={'#0B2246'} stroke={'#ffffffaa'} lineWidth={5} clip>
        {o.children}
        <Rect y={-h / 2 + 40} width={w} height={6} fill={'#ffffff66'} />
        <Rect x={-w / 2 + 34} width={18} height={h - 80} radius={9} fill={'#ffffff22'} />
      </Rect>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, WATER);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 컵 밖은 →, 컵 속은 ← */
  const hookN = createRef<Node>();
  const hookQ = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      <Arrow w={760} />
      <Glass w={300} h={420}>
        <Arrow w={230} h={56} flip />
      </Glass>
      <Txt ref={hookQ} y={-300} text={'왜 반대로?!'} fontFamily={FONT} fontSize={66} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const setup = addSteps(view, {
    badge: '물컵 하나면 OK',
    color: WATER,
    steps: [
      {
        draw: () => (
          <Node y={-10} scale={0.42}>
            <Glass w={240} h={340} />
          </Node>
        ),
        label: '투명한 컵에 물 가득',
      },
      {
        draw: () => (
          <Node y={-10} scale={0.36}>
            <Rect x={150} width={150} height={300} radius={20} fill={'#141A38'} stroke={'#ffffff88'} lineWidth={5}>
              <Arrow w={110} h={22} />
            </Rect>
            <Glass x={-120} w={180} h={260} />
            <Line points={[[-30, 190], [150, 190]]} stroke={C.amber} lineWidth={6} startArrow endArrow arrowSize={16} />
          </Node>
        ),
        label: '화면 앞 한 뼘',
      },
      {
        draw: () => (
          <Node y={-10} scale={0.4}>
            <Circle x={-150} size={110} fill={'#ffffff'} />
            <Circle x={-130} size={50} fill={'#1B2350'} />
            <Line points={[[-80, 0], [180, 0]]} stroke={'#ffffff88'} lineWidth={6} lineDash={[16, 12]} endArrow arrowSize={18} />
          </Node>
        ),
        label: '컵 너머로 보기',
      },
    ],
  });

  /* 2. 따라 하기: 화살표 하나만 (둘레는 움직이지 않는다) */
  const TY = -170;
  const tryN = createRef<Node>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Arrow w={640} h={110} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 확인: 컵을 댄 모습 */
  const seeN = createRef<Node>();
  const seeTag = createRef<Txt>();
  view.add(
    <Node ref={seeN} y={TY} opacity={0}>
      <Arrow w={760} h={110} />
      <Glass w={320} h={460}>
        <Arrow w={250} h={64} flip />
      </Glass>
      <Txt ref={seeTag} y={-320} text={'← 반대로!'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 4. 왜? 위에서 본 그림: 화살표 · 물컵 · 눈 */
  const WY = -230;
  const whyN = createRef<Node>();
  const rayA = createRef<Line>();
  const rayB = createRef<Line>();
  const backA = createRef<Line>();
  const backB = createRef<Line>();
  const ghost = createRef<Node>();
  const lensTag = createRef<Txt>();
  const cross = createRef<Circle>();
  const AL: [number, number] = [-170, -330];
  const AR: [number, number] = [170, -330];
  const EYE: [number, number] = [0, 330];
  const IN = 90;
  const INY = -Math.sqrt(120 * 120 - IN * IN);
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Txt x={-400} y={-330} offsetX={-1} text={'화면'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.dim} />
      <Rect x={-170} y={-330} offsetX={-1} width={340} height={16} radius={8} fill={TAIL} />
      <Circle x={170} y={-330} size={40} fill={TIP} />
      <Circle size={240} fill={WATER + '44'} stroke={'#ffffffaa'} lineWidth={5} />
      <Txt ref={lensTag} x={150} y={0} offsetX={-1} text={'물컵\n(위에서 본 모습)'} fontFamily={FONT} fontSize={32} fontWeight={900} lineHeight={44} fill={WATER} />
      <Line ref={rayA} points={[AL, [-IN, INY], [IN, -INY], EYE]} stroke={TAIL} lineWidth={8} end={0} shadowColor={TAIL} shadowBlur={14} />
      <Line ref={rayB} points={[AR, [IN, INY], [-IN, -INY], EYE]} stroke={TIP} lineWidth={8} end={0} shadowColor={TIP} shadowBlur={14} />
      <Circle ref={cross} size={0} stroke={C.coral} lineWidth={6} />
      <Line ref={backA} points={[EYE, [IN, -INY], [IN + (IN * (-INY - AL[1])) / (EYE[1] + INY), AL[1]]]} stroke={TAIL} lineWidth={5} lineDash={[14, 12]} end={0} opacity={0.8} />
      <Line ref={backB} points={[EYE, [-IN, -INY], [-IN - (IN * (-INY - AL[1])) / (EYE[1] + INY), AL[1]]]} stroke={TIP} lineWidth={5} lineDash={[14, 12]} end={0} opacity={0.8} />
      <Node ref={ghost} y={-420} opacity={0}>
        <Arrow w={420} h={50} flip opacity={0.9} />
        <Txt y={-70} text={'눈에 보이는 화살표'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.coral} />
      </Node>
      <Node x={EYE[0]} y={EYE[1] + 40}>
        <Circle size={90} fill={'#ffffff'} />
        <Circle y={-14} size={42} fill={'#1B2350'} />
        <Txt y={80} text={'눈'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 생활 예: 돋보기로 먼 곳을 보면 거꾸로 */
  const lifeN = createRef<Node>();
  view.add(
    <Node ref={lifeN} y={-250} opacity={0}>
      <Rect x={190} y={230} rotation={-40} width={60} height={240} radius={24} fill={'#8A5A3C'} />
      <Circle size={420} fill={'#9FD3FF33'} stroke={'#E8E2D0'} lineWidth={22} clip>
        <Node rotation={180} y={-20}>
          <Rect y={60} width={600} height={120} fill={'#3E8E5A'} />
          <Rect y={-20} width={160} height={120} fill={C.amber} />
          <Line points={[[-110, -80], [0, -170], [110, -80]]} closed fill={C.coral} />
          <Circle x={150} y={-150} size={70} fill={'#FFE28A'} />
        </Node>
      </Circle>
      <Txt y={-280} text={'돋보기 속 집이 거꾸로!'} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const card = bigCard('둥근 물컵은 빛을 꺾는 렌즈', WATER, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['물컵 뒤 화살표,', '왜 뒤집혀?'], {y: -430, accent: WATER});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '부엌 실험실', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, WATER);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* popIn(hookQ(), 0.4, 0.5);
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '투명한 컵에\n물을 가득 채워요', C.teal), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '컵을 화면 앞\n한 뼘쯤에 들어요', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '컵 너머로\n화면 속 화살표를 봐요', C.violet), setup.step(2));
  yield* waitFor(1.2);
  yield* cap.say('안전', '깨지지 않는\n플라스틱 컵이면 더 좋아요', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  yield* cap.say('TRY', '화살표는 오른쪽 →\n이제 컵을 앞에 대 봐요', C.teal);
  timer.node().opacity(1);
  yield* timer.run(12, {
    9: () => cap.say('TRY', '컵을 천천히\n앞뒤로 움직여 봐요', C.amber),
    5: () => cap.say('TRY', '컵 속 화살표는\n어느 쪽을 가리키나요?', C.violet),
  });
  timer.node().opacity(0);

  /* ═════════ 3. 확인 (전환 없이 한 번에) ═════════ */
  tryN().opacity(0);
  seeN().opacity(1);
  cue('boom');
  yield* all(cap.say('!', '컵 속에선 왼쪽 ←\n반대로 뒤집혔어요!', C.coral), popIn(seeTag(), 0.4, 0.5), shake(seeN(), 6, 0.4));
  yield* waitFor(1.4);
  yield* cap.say('!', '위아래는 그대로,\n왼쪽 · 오른쪽만 바뀌어요', C.amber);
  yield* waitFor(1.3);
  yield* cap.say('TIP', '컵이 너무 가까우면 그대로예요\n거리를 바꿔 봐요', C.teal);
  yield* waitFor(1.4);

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  seeN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  yield* cap.say('01', '위에서 내려다본 모습이에요\n화면 · 물컵 · 눈', C.ink);
  yield* waitFor(1.2);
  cue('swish');
  yield* all(cap.say('02', '빛은 물에 들어갈 때 · 나올 때\n꺾여요', C.teal), rayA().end(1, 1.4, easeInOutCubic), delay(0.3, rayB().end(1, 1.4, easeInOutCubic)));
  yield* waitFor(0.8);
  cue('pop');
  yield* all(cap.say('03', '꺾인 빛이 컵 속에서\n엇갈려요!', C.coral), cross().size(70, 0.5, easeOutCubic));
  yield* waitFor(1.4);
  cue('swish');
  yield* all(
    cap.say('04', '그래서 왼쪽 빛은 오른쪽에서,\n오른쪽 빛은 왼쪽에서 와요', C.amber),
    backA().end(1, 1.0, easeInOutCubic),
    backB().end(1, 1.0, easeInOutCubic),
  );
  yield* all(popIn(ghost(), 0.5, 0.5));
  yield* waitFor(1.2);
  yield* cap.say('05', '둥근 물컵이 볼록 렌즈처럼\n화살표를 뒤집은 거예요', C.violet);
  yield* waitFor(1.6);

  /* ═════════ 5. 생활 예 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  lifeN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '돋보기로 먼 곳을 보면\n거꾸로 보이는 것도 같은 이유!', C.amber), popIn(lifeN(), 0.5, 0.7));
  yield* waitFor(1.6);

  /* ═════════ 6. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  lifeN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '물컵 하나로 해 봐요!', WATER));
  yield* all(shine(card), sparks(view, [0, -420], WATER, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  부엌 실험실', '컵을 뒤집어도\n물이 안 쏟아진다?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
