import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInOutSine, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「피부의 비밀」 1편 — 손가락을 꼬면 코가 두 개? (아리스토텔레스 착각)
// 1) 따라 하기: 가운데손가락을 검지 위로 꼬고, 꼰 손가락 끝 사이로 코끝(또는 구슬)을 살살 문지른다 → 두 개로 느껴진다
// 2) 꼬면 평소엔 서로 반대쪽을 보던 두 바깥쪽 면이 한 물건에 같이 닿는다
//    뇌는 손가락이 늘 제자리에 있다고 믿어서 "바깥쪽 두 곳 = 물건 두 개" 로 읽는다
// 눈 찌르지 않기 · 살살 문지르기 안내

const NAME = 'crossFinger';
const SKIN = '#E9B48F';
const NAIL = '#F8DCCB';
const FW = 70;
const BASE_Y = 200;
const IDX = {x: -42, len: 340, rot: 14};
const MID = {x: 42, len: 370, rot: -28};

// 손가락 위의 한 점(손가락 좌표)을 손 좌표로
function onFinger(f: {x: number}, rot: number, lx: number, ly: number): [number, number] {
  const r = (rot * Math.PI) / 180;
  return [f.x + lx * Math.cos(r) - ly * Math.sin(r), BASE_Y + lx * Math.sin(r) + ly * Math.cos(r)];
}
// 바깥쪽 면의 점: 검지는 엄지 쪽(왼쪽), 가운데손가락은 약지 쪽(오른쪽)
const idxDot = (k: number) => onFinger(IDX, IDX.rot * k, -FW / 2, -IDX.len + 40);
const midDot = (k: number) => onFinger(MID, MID.rot * k, FW / 2, -MID.len + 40);
const between = (k: number): [number, number] => {
  const a = idxDot(k);
  const b = midDot(k);
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
};

function Finger(o: {f: {x: number; len: number; rot: number}; k: SimpleSignal<number>; dot?: string; dotSide: number; dots?: SimpleSignal<number>}) {
  const {f} = o;
  return (
    <Node x={f.x} y={BASE_Y} rotation={() => f.rot * o.k()}>
      <Rect y={-f.len / 2} width={FW} height={f.len} radius={FW / 2} fill={SKIN} stroke={'#C98B66'} lineWidth={3} />
      <Rect y={-f.len + 42} width={40} height={48} radius={14} fill={NAIL} />
      <Rect y={-f.len * 0.42} width={44} height={6} radius={3} fill={'#C98B6699'} />
      {o.dot ? (
        <Circle
          x={(o.dotSide * FW) / 2}
          y={-f.len + 40}
          size={30}
          fill={o.dot}
          shadowColor={o.dot}
          shadowBlur={18}
          opacity={() => (o.dots ? o.dots() : 0)}
        />
      ) : null}
    </Node>
  );
}

// 손등에서 본 오른손: 검지 · 가운데손가락만 펴고 나머지는 접었다. cross 0 → 1 이면 가운데손가락이 검지 위로 꼬인다
function Hand(o: {cross: SimpleSignal<number>; dots?: SimpleSignal<number>}) {
  return (
    <Node>
      <Rect y={BASE_Y + 120} width={290} height={270} radius={[50, 50, 90, 90]} fill={SKIN} stroke={'#C98B66'} lineWidth={3} />
      <Rect x={116} y={BASE_Y + 20} width={64} height={84} radius={30} fill={SKIN} stroke={'#C98B66'} lineWidth={3} />
      <Rect x={-150} y={BASE_Y + 120} rotation={-30} width={70} height={170} radius={35} fill={SKIN} stroke={'#C98B66'} lineWidth={3} />
      <Finger f={IDX} k={o.cross} dot={C.amber} dotSide={-1} dots={o.dots} />
      <Finger f={MID} k={o.cross} dot={C.teal} dotSide={1} dots={o.dots} />
    </Node>
  );
}

function Ball(o: {refFn?: (c: Circle) => void; x?: number; y?: number; size?: number; color?: string}) {
  const color = o.color ?? C.violet;
  return (
    <Circle
      ref={o.refFn}
      x={o.x ?? 0}
      y={o.y ?? 0}
      size={o.size ?? 80}
      fill={color}
      stroke={'#ffffff88'}
      lineWidth={3}
      shadowColor={color}
      shadowBlur={24}
    />
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 꼰 손가락 사이 구슬 하나 → 둘로 갈라진다 */
  const hookN = createRef<Node>();
  const hc = createSignal(1);
  const hookBall = createRef<Circle>();
  const ghostL = createRef<Circle>();
  const ghostR = createRef<Circle>();
  const B1 = between(1);
  view.add(
    <Node ref={hookN} y={300} scale={0.85} opacity={0}>
      <Hand cross={hc} />
      <Ball refFn={c => ghostL(c)} x={B1[0]} y={B1[1]} color={C.violet} />
      <Ball refFn={c => ghostR(c)} x={B1[0]} y={B1[1]} color={C.violet} />
      <Ball refFn={c => hookBall(c)} x={B1[0]} y={B1[1]} color={C.violet} />
    </Node>,
  );
  ghostL().opacity(0);
  ghostR().opacity(0);

  /* 1. 준비 */
  const p0 = createSignal(0);
  const p1 = createSignal(1);
  const p2 = createSignal(1);
  const setup = addSteps(view, {
    badge: '따라 해 봐요',
    color: C.violet,
    steps: [
      {draw: () => <Node y={-40} scale={0.32}><Hand cross={p0} /></Node>, label: '검지 · 가운데 펴기'},
      {draw: () => <Node y={-40} scale={0.32}><Hand cross={p1} /></Node>, label: '가운데를 검지 위로'},
      {
        draw: () => (
          <Node y={-40} scale={0.32}>
            <Hand cross={p2} />
            <Ball x={B1[0]} y={B1[1]} size={90} color={C.pink} />
          </Node>
        ),
        label: '끝 사이로 코끝',
      },
    ],
  });

  /* 2. 따라 하기: 꼰 손가락이 코끝(분홍 공)을 살살 문지른다 */
  const TY = -150;
  const tryN = createRef<Node>();
  const rub = createSignal(0);
  const tc = createSignal(1);
  const nose = createRef<Circle>();
  const two = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Node x={() => 16 * Math.sin(rub() * Math.PI * 2)} y={() => 8 * Math.cos(rub() * Math.PI * 4)}>
        <Hand cross={tc} />
      </Node>
      <Ball refFn={c => nose(c)} x={B1[0]} y={B1[1] - 20} size={110} color={C.pink} />
      <Txt ref={two} x={250} y={-260} text={'두 개?!'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.amber} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 바깥쪽 두 면 */
  const SY = -260;
  const whyN = createRef<Node>();
  const wc = createSignal(0);
  const wd = createSignal(0);
  const outerL = createRef<Circle>();
  const outerR = createRef<Circle>();
  const oneBall = createRef<Circle>();
  const lab1 = createRef<Txt>();
  const lab2 = createRef<Txt>();
  const U0L = idxDot(0);
  const U0R = midDot(0);
  view.add(
    <Node ref={whyN} y={SY} opacity={0}>
      <Hand cross={wc} dots={wd} />
      <Ball refFn={c => outerL(c)} x={U0L[0] - 42} y={U0L[1]} size={76} color={C.amber} />
      <Ball refFn={c => outerR(c)} x={U0R[0] + 42} y={U0R[1]} size={76} color={C.teal} />
      <Ball refFn={c => oneBall(c)} x={B1[0]} y={B1[1]} size={76} color={C.violet} />
      <Txt ref={lab1} x={-300} y={-200} text={'검지\n바깥쪽'} fontFamily={FONT} fontSize={40} fontWeight={900} lineHeight={52} textAlign="center" fill={C.amber} opacity={0} />
      <Txt ref={lab2} x={300} y={-200} text={'가운데\n바깥쪽'} fontFamily={FONT} fontSize={40} fontWeight={900} lineHeight={52} textAlign="center" fill={C.teal} opacity={0} />
    </Node>,
  );
  outerL().opacity(0);
  outerR().opacity(0);
  oneBall().opacity(0);

  /* 생각 풍선: 뇌가 그리는 손 (꼬이지 않은 손 + 구슬 둘) */
  const bubble = createRef<Node>();
  const bc = createSignal(0);
  view.add(
    <Node ref={bubble} x={250} y={-330} opacity={0}>
      <Circle x={-190} y={250} size={34} fill={'#ffffff22'} stroke={'#ffffff66'} lineWidth={3} />
      <Circle x={-140} y={190} size={50} fill={'#ffffff22'} stroke={'#ffffff66'} lineWidth={3} />
      <Rect width={340} height={340} radius={170} fill={'#141A38'} stroke={'#ffffff66'} lineWidth={4} />
      <Node y={-30} scale={0.42}>
        <Hand cross={bc} />
        <Ball x={U0L[0] - 42} y={U0L[1]} size={80} color={C.violet} />
        <Ball x={U0R[0] + 42} y={U0R[1]} size={80} color={C.violet} />
      </Node>
      <Txt y={120} text={'뇌: "두 개!"'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.ink} />
    </Node>,
  );

  const card = bigCard('뇌는 손가락이 제자리라고 믿어요', C.violet, 52);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['손가락을 꼬면', '코가 두 개?'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '피부의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.violet);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  ghostL().opacity(0.85);
  ghostR().opacity(0.85);
  yield* all(
    ghostL().position([B1[0] - 150, B1[1] - 40], 0.6, easeInOutCubic),
    ghostR().position([B1[0] + 150, B1[1] - 40], 0.6, easeInOutCubic),
    hookBall().opacity(0.35, 0.6),
  );
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '검지와 가운데손가락을 펴요', C.violet), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '가운데손가락을\n검지 위로 꼬아요', C.teal), setup.step(1));
  yield* waitFor(1.1);
  yield* all(cap.say('준비', '눈을 감고, 손가락 끝 사이로\n코끝을 살살 문질러요', C.pink), setup.step(2));
  yield* waitFor(1.4);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  timer.count(10);
  timer.node().opacity(1);
  yield* all(
    rub(5, 10, easeInOutSine),
    timer.run(10, {
      10: () => cap.say('TRY', '눈 감고 살살 문질러요', C.pink),
      7: () => cap.say('TRY', '코끝이 몇 개로 느껴지나요?', C.amber),
      4: () => all(cap.say('TRY', '코가… 두 개?!', C.amber), popIn(two(), 0.4, 0.5), delay(0.4, shake(tryN(), 8, 0.4))),
    }),
  );
  timer.node().opacity(0);
  cue('chime');
  yield* all(cap.say('!', '손가락을 풀고 다시 만지면?', C.teal), tc(0, 0.7, easeInOutCubic), two().opacity(0, 0.3), nose().opacity(0, 0.5));
  yield* waitFor(1.3);
  yield* cap.say('!', '코는 다시 하나예요!', C.teal);
  yield* waitFor(1.2);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, SY]);
  cue('pop');
  yield* all(
    cap.say('01', '검지 바깥쪽과 가운데 바깥쪽은\n평소에 서로 반대쪽을 봐요', C.ink),
    wd(1, 0.5),
    popIn(lab1(), 0.4, 0.6),
    delay(0.2, popIn(lab2(), 0.4, 0.6)),
  );
  yield* waitFor(1.4);
  cue('pop');
  yield* all(cap.say('02', '두 곳에 동시에 닿으면\n= 물건이 두 개라는 뜻', C.amber), popIn(outerL(), 0.4, 0.5), delay(0.2, popIn(outerR(), 0.4, 0.5)));
  yield* waitFor(1.6);
  cue('swish');
  yield* all(
    cap.say('03', '그런데 손가락을 꼬면\n두 바깥쪽이 마주 봐요', C.teal),
    outerL().opacity(0, 0.3),
    outerR().opacity(0, 0.3),
    lab1().opacity(0, 0.3),
    lab2().opacity(0, 0.3),
    wc(1, 0.9, easeInOutCubic),
  );
  yield* waitFor(1.1);
  cue('pop');
  yield* all(cap.say('04', '코 하나가\n두 바깥쪽에 같이 닿아요', C.violet), popIn(oneBall(), 0.45, 0.5));
  yield* waitFor(1.4);
  cue('whoosh');
  yield* all(
    cap.say('05', '뇌는 손가락이 꼬인 줄 몰라서\n"두 개"라고 읽어요', C.amber),
    whyN().x(-170, 0.6, easeInOutCubic),
    whyN().scale(0.8, 0.6, easeInOutCubic),
    popIn(bubble(), 0.6, 0.5),
  );
  yield* waitFor(2.0);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  bubble().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '눈을 찌르지 않게 조심!', C.violet));
  yield* all(shine(card), sparks(view, [0, -420], C.violet, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  피부의 비밀', '연필 두 자루,\n한 점일까 두 점일까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
