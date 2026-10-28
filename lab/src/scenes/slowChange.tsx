import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, easeOutExpo, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, ring, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addTimer} from '../sci';

// 과학 「뇌의 용량」 2편 — 천천히 바뀌는 그림 (변화맹)
// 1) 15초 동안 그림을 보는 사이 지붕 색이 아주 서서히 빨강 → 파랑으로 바뀐다 (깜빡임 없이 한 방향으로만)
// 2) 처음 그림과 나란히 놓으면 통째로 바뀐 게 보인다 → 빨리 바꾸면 바로 보인다
// 3) 눈은 그림 전체를 찍어 두지 않고 보는 곳만 그때그때 본다. 갑자기 바뀌면 "바뀌었다" 신호가 시선을 끌지만,
//    천천히 바뀌면 그 신호가 없어 놓친다
// 번갈아 깜빡이는 방식(플리커)은 광과민성 때문에 쓰지 않는다

const NAME = 'slowChange';
const PY = -250; // 그림 가운데
const RED = '#E35B45';
const BLUE = '#3F6FE0';
const DOOR = '#8A5A3C';

function Picture(o: {roofColor: string; roof?: (n: Line) => void; door?: (n: Rect) => void}) {
  return (
    <Rect width={900} height={680} radius={30} clip fill={'#9FD4F5'} stroke={'#ffffff55'} lineWidth={4}>
      <Circle x={300} y={-200} size={140} fill={'#FFD45A'} />
      <Node x={-290} y={-210}>
        <Circle x={-40} size={80} fill={'#ffffff'} />
        <Circle x={10} y={-20} size={100} fill={'#ffffff'} />
        <Circle x={60} size={80} fill={'#ffffff'} />
      </Node>
      <Node x={40} y={-250}>
        <Circle x={-30} size={60} fill={'#ffffff'} />
        <Circle x={10} y={-14} size={76} fill={'#ffffff'} />
        <Circle x={50} size={60} fill={'#ffffff'} />
      </Node>
      <Rect y={240} width={900} height={200} fill={'#7BC86C'} />
      <Rect x={-120} y={290} width={70} height={120} fill={'#E8D7A8'} />
      {/* 집 */}
      <Rect x={-120} y={95} width={340} height={250} fill={'#F6E7C8'} />
      <Line ref={o.roof} points={[[-320, -30], [-120, -200], [80, -30]]} closed fill={o.roofColor} />
      <Rect ref={o.door} x={-120} y={160} width={80} height={120} radius={[10, 10, 0, 0]} fill={DOOR} />
      <Rect x={-225} y={60} width={70} height={70} fill={'#CFEFFF'} stroke={'#ffffff'} lineWidth={6} />
      <Rect x={-15} y={60} width={70} height={70} fill={'#CFEFFF'} stroke={'#ffffff'} lineWidth={6} />
      {/* 나무 */}
      <Rect x={260} y={170} width={40} height={150} fill={DOOR} />
      <Circle x={260} y={40} size={230} fill={'#3E9E57'} />
      {/* 꽃 */}
      <Node y={290}>
        {[100, 170, 360, 410].map((x, k) => (
          <Circle x={x} y={k % 2 ? 20 : 0} size={30} fill={k % 2 ? '#FF8FC0' : '#FFE15A'} />
        ))}
      </Node>
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 큰 그림 */
  const main = createRef<Node>();
  let roof: Line, door: Rect;
  const spot = createRef<Circle>();
  view.add(
    <Node ref={main} y={PY} opacity={0}>
      <Picture roofColor={RED} roof={n => (roof = n)} door={n => (door = n)} />
      <Circle ref={spot} size={240} stroke={C.amber} lineWidth={8} lineDash={[22, 14]} shadowColor={C.amber} shadowBlur={24} opacity={0} />
    </Node>,
  );

  /* 나란히 비교 */
  const pair = createRef<Node>();
  view.add(
    <Node ref={pair} y={PY} opacity={0}>
      <Node x={-235} scale={0.5}>
        <Picture roofColor={RED} />
      </Node>
      <Node x={235} scale={0.5}>
        <Picture roofColor={BLUE} />
      </Node>
      <Txt x={-235} y={210} text={'처음'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.ink} />
      <Txt x={235} y={210} text={'15초 뒤'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  /* 생활 예: 영화 두 장면 */
  const movie = createRef<Node>();
  const scene = (x: number, cupX: number, label: string) => (
    <Node x={x}>
      <Rect width={420} height={300} radius={20} fill={'#2A2340'} stroke={'#ffffff44'} lineWidth={3} />
      <Rect y={70} width={360} height={16} radius={8} fill={'#B9895A'} />
      <Rect x={cupX} y={30} width={50} height={64} radius={[4, 4, 12, 12]} fill={'#F4F1EA'} />
      <Circle x={-120} y={-30} size={90} fill={'#FFC9A0'} />
      <Txt y={200} text={label} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.ink} />
    </Node>
  );
  view.add(
    <Node ref={movie} y={PY} opacity={0}>
      {scene(-230, 110, '장면 1')}
      {scene(230, -10, '장면 2')}
    </Node>,
  );

  const card = bigCard('보고 있어도 바뀐 걸 모를 수 있다', C.amber, 50);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['그림이 바뀌는 중,', '알아챌 수 있을까?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 3, series: '뇌의 용량', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);
  const timer = addTimer(view, 'LOOK');

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero());
  yield* title.dock();
  cue('pop');
  yield* popIn(main(), 0.6, 0.7);
  yield* cap.say('준비', '그림을 15초 동안 잘 보세요\n뭔가 달라지면 찾아보세요', C.amber);
  yield* waitFor(1.8);

  /* ═════════ 1. 테스트 (15초 동안 지붕 색이 서서히 바뀜) ═════════ */
  title.group().opacity(0);
  timer.count(15);
  timer.node().opacity(1);
  yield* cap.say('LOOK', '어디가 달라질까요?', C.teal);
  yield* all(timer.run(15), roof!.fill(BLUE, 15, linear));
  timer.node().opacity(0);

  /* ═════════ 2. 확인 ═════════ */
  yield* cap.say('?', '뭐가 바뀌었는지 찾았나요?', C.coral);
  yield* waitFor(1.6);
  cue('boom');
  main().opacity(0);
  pair().opacity(1);
  yield* all(cap.say('!', '지붕 색이 통째로 바뀌었어요!', C.amber), punch(pair(), 0.04));
  yield* waitFor(1.8);

  cue('whoosh');
  roof!.fill(RED);
  yield* all(pair().opacity(0, 0.3), main().opacity(1, 0.3), cap.say('!', '이번엔 빨리 바꿔 볼게요', C.teal));
  yield* waitFor(0.8);
  cue('pop');
  yield* roof!.fill(BLUE, 0.6, easeInOutCubic);
  yield* all(cap.say('!', '이건 바로 보이죠?', C.amber), ring(main(), [-120, -110], C.amber, 200));
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  cue('swish');
  yield* cap.say('01', '눈은 그림 전체를\n사진처럼 찍어 두지 않아요', C.violet);
  yield* waitFor(1.2);
  spot().position([-225, 60]);
  yield* all(spot().opacity(1, 0.4), cap.say('02', '보고 있는 곳만 그때그때\n자세히 볼 뿐이에요', C.teal));
  for (const p of [[260, 40], [300, -200], [-15, 60]] as [number, number][]) {
    cue('swish');
    yield* spot().position(p, 0.55, easeInOutCubic);
    yield* waitFor(0.25);
  }
  yield* cap.say('03', '갑자기 바뀌면 "바뀌었다!" 신호가\n시선을 확 끌어요', C.amber);
  cue('pop');
  door!.fill(C.teal);
  yield* all(spot().position([-120, 160], 0.3, easeOutExpo), sparks(main(), [-120, 160], C.teal, 10, 140));
  yield* waitFor(1.0);
  yield* all(spot().opacity(0, 0.4), cap.say('04', '천천히 바뀌면 그 신호가 없어서\n바뀌는 걸 쉽게 놓쳐요', C.coral), roof!.fill(RED, 2.5, linear));
  yield* waitFor(1.6);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  main().opacity(0);
  movie().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('LIFE', '영화에서 컵 자리가 바뀌어도\n모르고 지나갈 때가 많아요', C.teal);
  yield* delay(0.6, ring(movie(), [-10 + 230, 30 + 0], C.amber, 70));
  yield* waitFor(1.2);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  movie().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '다 보는 것 같아도\n뇌는 보는 곳만 챙겨요', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  뇌의 용량 03', '패스를 세는 동안\n무엇이 지나갔을까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
