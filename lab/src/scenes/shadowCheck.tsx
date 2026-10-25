import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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
import {addDim, addTimer} from '../sci';

// 과학 시즌 S12 — 같은 색인데 달라 보인다? (그림자 체커판 착시)
// 1) 화면 퀴즈: 체커판에서 그림자 밖의 진한 칸 A 와 그림자 속 밝은 칸 B 중 어느 쪽이 진할까?
// 2) 같은 색 막대로 이어 보고, 둘레를 지워 보면 두 칸은 똑같은 회색이다
// 3) 뇌는 "그림자 속은 원래 더 밝은 것"이라고 계산해 밝기를 고쳐 본다 → 그늘 속 흰 종이도 흰색으로 보인다
// 색 맞추기: 밝은 칸 200 · 진한 칸 120, 그림자는 검정 40% → 그림자 속 밝은 칸 = 200 × 0.6 = 120 (진한 칸과 같은 값)

const NAME = 'shadowCheck';
const LIGHT = '#C8C8C8'; // 200
const DARK = '#787878'; // 120
const SAME = '#787878';
const N = 6;
const T = 120; // 칸 한 변 (판 좌표)
const A = {i: 1, j: 2}; // 그림자 밖 진한 칸
const B = {i: 3, j: 3}; // 그림자 속 밝은 칸 ((i+j) 짝수 = 밝은 칸)
const pos = (c: {i: number; j: number}): [number, number] => [(c.i - (N - 1) / 2) * T, (c.j - (N - 1) / 2) * T];
// 판 좌표 → 화면 좌표 (45° 돌리고 세로로 납작하게)
const SQ = 0.58;
const toScreen = ([x, y]: [number, number]): [number, number] => {
  const c = Math.SQRT1_2;
  return [c * x - c * y, (c * x + c * y) * SQ];
};

function Board(o: {cells: Rect[]; shadow: (n: Node) => void}) {
  return (
    <Node scale={[1, SQ]}>
      <Node rotation={45}>
        {Array.from({length: N * N}, (_, k) => {
          const i = k % N;
          const j = Math.floor(k / N);
          const [x, y] = pos({i, j});
          return <Rect ref={el => (o.cells[k] = el)} x={x} y={y} width={T} height={T} fill={(i + j) % 2 === 0 ? LIGHT : DARK} />;
        })}
        {/* 그림자: 가운데(B 둘레)는 검정 40% 그대로, 바깥으로 갈수록 옅어진다 */}
        <Node ref={o.shadow}>
          <Circle
            x={pos(B)[0]}
            y={pos(B)[1] - 20}
            size={440}
            fill={
              new Gradient({
                type: 'radial',
                from: [0, 0],
                to: [0, 0],
                fromRadius: 0,
                toRadius: 220,
                stops: [
                  {offset: 0, color: '#00000066'},
                  {offset: 0.55, color: '#00000066'},
                  {offset: 1, color: '#00000000'},
                ],
              })
            }
          />
        </Node>
      </Node>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 판 + 원기둥 + 라벨 */
  const BY = -230;
  const boardN = createRef<Node>();
  const cells: Rect[] = [];
  let shadowN: Node;
  const cyl = createRef<Node>();
  const tagA = createRef<Txt>();
  const tagB = createRef<Txt>();
  const bridge = createRef<Node>();
  const bridgeLen = createSignal(0);
  const sA = toScreen(pos(A));
  const sB = toScreen(pos(B));
  // 원기둥은 B 칸 위쪽(빛이 오는 쪽)에 서서 B 쪽으로 그림자를 드리운다
  const cylBase = toScreen([pos(B)[0] + 90, pos(B)[1] - 200]);
  view.add(
    <Node ref={boardN} y={BY} opacity={0}>
      <Board cells={cells} shadow={n => (shadowN = n)} />
      <Node ref={cyl} x={cylBase[0]} y={cylBase[1]}>
        <Rect y={-120} width={150} height={240} fill={'#2FAE62'} />
        <Circle y={0} width={150} height={60} fill={'#2FAE62'} />
        <Circle y={-240} width={150} height={60} fill={'#5FD68C'} />
      </Node>
      <Txt ref={tagA} x={sA[0]} y={sA[1]} text={'A'} fontFamily={FONT} fontSize={64} fontWeight={900} fill={'#ffffff'} shadowColor={'#000'} shadowBlur={14} />
      <Txt ref={tagB} x={sB[0]} y={sB[1]} text={'B'} fontFamily={FONT} fontSize={64} fontWeight={900} fill={'#ffffff'} shadowColor={'#000'} shadowBlur={14} />
      {/* A 와 B 를 잇는 같은 색 막대 */}
      <Node ref={bridge}>
        <Line
          points={() => [sA, [sA[0] + (sB[0] - sA[0]) * bridgeLen(), sA[1] + (sB[1] - sA[1]) * bridgeLen()]]}
          stroke={SAME}
          lineWidth={50}
        />
      </Node>
    </Node>,
  );

  /* 정답 화면: 두 칸만 떼어 놓기 */
  const twoN = createRef<Node>();
  const swA = createRef<Rect>();
  const swB = createRef<Rect>();
  view.add(
    <Node ref={twoN} y={BY} opacity={0}>
      <Rect ref={swA} x={-170} width={240} height={240} radius={20} fill={SAME} />
      <Rect ref={swB} x={170} width={240} height={240} radius={20} fill={SAME} />
      <Txt x={-170} y={-170} text={'A'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.ink} />
      <Txt x={170} y={-170} text={'B'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.ink} />
      <Txt y={190} text={'둘 다 같은 회색!'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  /* 뇌의 계산 */
  const brainN = createRef<Node>();
  const rowsB: Node[] = [];
  view.add(
    <Node ref={brainN} y={-330} opacity={0}>
      {[
        {sw: SAME, l: 'B 는 그림자 속이네', c: C.dim},
        {sw: LIGHT, l: '그림자를 빼고 보면 원래는 밝겠지!', c: C.teal},
      ].map((r, k) => (
        <Node ref={el => (rowsB[k] = el)} y={k * 200} opacity={0}>
          <Rect x={-330} width={140} height={140} radius={16} fill={r.sw} stroke={'#ffffff55'} lineWidth={3} />
          <Txt x={-220} offsetX={-1} text={r.l} fontFamily={FONT} fontSize={40} fontWeight={800} fill={r.c} />
        </Node>
      ))}
    </Node>,
  );

  /* 생활 예: 그늘 속 흰 종이 */
  const paperN = createRef<Node>();
  view.add(
    <Node ref={paperN} y={-280} opacity={0}>
      <Rect x={-200} width={260} height={340} radius={10} fill={'#F2F2F2'} />
      <Rect x={200} width={260} height={340} radius={10} fill={'#8E8E8E'} />
      <Rect x={200} width={420} height={460} radius={30} fill={'#00000033'} />
      <Txt x={-200} y={230} text={'햇빛 아래'} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.ink} />
      <Txt x={200} y={230} text={'그늘 속'} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.ink} />
      <Txt y={320} text={'둘 다 "흰 종이"로 보여요'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const card = bigCard('뇌는 그림자까지 계산해서 본다', C.teal, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['같은 색인데', '달라 보인다?'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 4, total: 4, series: '눈의 비밀 2부', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);
  const timer = addTimer(view, 'QUIZ');

  /* ═════════ 0. 훅: 판이 내려앉는다 ═════════ */
  boardN().y(BY + 200);
  boardN().scale(0.55);
  yield* all(hud.show(), title.hero(), popIn(boardN(), 0.7, 0.3));
  yield* all(title.dock(), boardN().y(BY + 40, 0.9, easeInOutExpo), boardN().scale(0.9, 0.9, easeInOutExpo));
  yield* all(boardN().y(BY, 0.6, easeInOutCubic), boardN().scale(1, 0.6, easeInOutCubic));

  /* ═════════ 1. 퀴즈 ═════════ */
  cue('pop');
  yield* all(popIn(tagA(), 0.4, 0.5), delay(0.15, popIn(tagB(), 0.4, 0.5)));
  timer.count(3);
  timer.node().opacity(1);
  title.group().opacity(0);
  yield* cap.say('QUIZ', 'A 칸과 B 칸,\n어느 쪽이 더 진할까요?', C.teal);
  yield* timer.run(3);
  timer.node().opacity(0);
  yield* cap.say('QUIZ', '당연히 A 가 진해 보이죠?', C.amber);
  yield* waitFor(1.4);

  /* ═════════ 2. 같은 색 막대로 잇기 ═════════ */
  yield* cap.say('!', '같은 색 막대로 이어 볼게요', C.teal);
  cue('riser');
  yield* bridgeLen(1, 1.4, easeInOutCubic);
  cue('boom');
  yield* all(cap.say('!', '어? 막대랑 두 칸이\n이어져 보여요!', C.amber), punch(boardN(), 0.03));
  yield* waitFor(1.6);

  cue('whoosh');
  yield* all(
    cap.say('!', '둘레를 지워 보면', C.teal),
    bridge().opacity(0, 0.4),
    cyl().opacity(0, 0.8),
    shadowN!.opacity(0, 0.8),
    ...cells.map((c, k) => (k === A.i + A.j * N ? waitFor(0) : c.fill(k === B.i + B.j * N ? SAME : '#0B0F24', 0.8))),
  );
  yield* waitFor(0.4);
  yield* iris.cover([0, BY]);
  boardN().opacity(0);
  twoN().opacity(1);
  yield* iris.reveal([0, BY]);
  cue('chime');
  yield* all(cap.say('!', 'A 와 B 는 똑같은 색!', C.amber), sparks(view, [0, BY], C.amber, 14, 260));
  yield* waitFor(1.6);

  /* ═════════ 3. 왜? ═════════ */
  yield* wipe.cover();
  twoN().opacity(0);
  brainN().opacity(1);
  yield* wipe.reveal();
  yield* all(cap.say('01', '뇌는 그림자가 있으면\n"원래는 더 밝다"고 계산해요', C.teal), popIn(rowsB[0], 0.5, 0.6));
  yield* waitFor(0.8);
  cue('pop');
  yield* popIn(rowsB[1], 0.5, 0.6);
  yield* waitFor(1.2);
  yield* cap.say('02', '그래서 그림자 속 B 를\n밝은 칸이라고 고쳐 봐요', C.amber);
  yield* waitFor(1.6);
  yield* cap.say('03', '눈에 들어온 빛 그대로가 아니라\n뇌가 계산한 색을 보는 거예요', C.violet);
  yield* waitFor(2.0);

  yield* wipe.cover();
  brainN().opacity(0);
  paperN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('04', '그늘 속 흰 종이를\n회색이라고 안 하는 것도 이 덕분!', C.teal), popIn(paperN(), 0.5, 0.7));
  yield* waitFor(2.0);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  paperN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '눈의 비밀 2부, 끝!', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  뇌가 속는 순간', '글자 색을\n말해 보세요!'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
