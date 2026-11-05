import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, linear, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, shake} from '../fx';
import {addDim, addTimer} from '../sci';

// 수학 「종이 한 장 수학」 1편 — 펜 떼지 않고 이 집 그릴 수 있을까? (한붓그리기)
// 1) 퀴즈: 지붕 + 네모 + X 인 집을 한 번에 → 꼭대기에서 시작하면 막힘, 왼쪽 아래 모서리에서 시작하면 성공
// 2) 비법: 점마다 모이는 선을 센다 (3 · 3 · 4 · 4 · 2) → 홀수 점 2개 = 출발 · 도착
// 3) 왜: 지나가는 점은 들어오는 선 + 나가는 선이 짝 → 짝수. 홀수 점은 출발 아니면 도착만
// 4) 한 번 더: 봉투(네모 + X)는 홀수 점 4개 → 불가능
// 오일러 이야기(1736 쾨니히스베르크 다리)는 "약 290년 전" 으로만 말한다

const NAME = 'oneStroke';
type P = [number, number];
const V: Record<string, P> = {
  A: [-190, 230],
  B: [190, 230],
  C: [190, -130],
  D: [-190, -130],
  E: [0, -360],
};
const EDGES = ['AB', 'BC', 'CD', 'DA', 'AC', 'BD', 'DE', 'CE'];
const FAIL = 'EDABCE';
const WIN = 'ACDECBDAB';
const DEG: Record<string, number> = {A: 3, B: 3, C: 4, D: 4, E: 2};

const pts = (path: string) => [...path].map(k => V[k]);

// 꺾은선 위에서 비율 t(0~1) 의 위치
function along(points: P[], t: number): P {
  const seg = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k];
    }
    d -= seg[i];
  }
  return points[points.length - 1];
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 집 */
  const houseN = createRef<Node>();
  const base = createRef<Node>();
  const failLine = createRef<Line>();
  const winLine = createRef<Line>();
  const pen = createRef<Circle>();
  const failP = createSignal(0);
  const winP = createSignal(0);
  const penOn = createSignal<'fail' | 'win'>('fail');
  const degN: Node[] = [];
  const startRing = createRef<Circle>();
  view.add(
    <Node ref={houseN} y={-80}>
      <Node ref={base}>
        {EDGES.map(e => (
          <Line points={[V[e[0]], V[e[1]]]} stroke={'#ffffff38'} lineWidth={14} lineCap="round" />
        ))}
      </Node>
      <Line ref={failLine} points={pts(FAIL)} stroke={C.coral} lineWidth={14} lineCap="round" lineJoin="round" end={() => failP()} shadowColor={C.coral} shadowBlur={18} />
      <Line ref={winLine} points={pts(WIN)} stroke={C.teal} lineWidth={14} lineCap="round" lineJoin="round" end={() => winP()} shadowColor={C.teal} shadowBlur={18} />
      {Object.keys(V).map(k => (
        <Circle position={V[k]} size={30} fill={C.ink} />
      ))}
      <Circle ref={startRing} position={V.A} size={90} stroke={C.amber} lineWidth={6} opacity={0} />
      <Circle
        ref={pen}
        position={() => (penOn() === 'fail' ? along(pts(FAIL), failP()) : along(pts(WIN), winP()))}
        size={44}
        fill={C.amber}
        shadowColor={C.amber}
        shadowBlur={30}
        opacity={0}
      />
      {Object.keys(V).map((k, i) => {
        const odd = DEG[k] % 2 === 1;
        const [x, y] = V[k];
        const off: P = k === 'E' ? [0, -80] : [x < 0 ? -78 : 78, y > 0 ? 50 : -50];
        return (
          <Node ref={el => (degN[i] = el)} x={x + off[0]} y={y + off[1]} opacity={0}>
            <Circle size={78} fill={odd ? C.coral : '#0B1028'} stroke={odd ? C.coral : C.teal} lineWidth={5} shadowColor={odd ? C.coral : C.teal} shadowBlur={odd ? 26 : 0} />
            <Txt text={String(DEG[k])} fontFamily={FONT} fontSize={50} fontWeight={900} fill={odd ? '#1A0B0B' : C.teal} />
          </Node>
        );
      })}
    </Node>,
  );
  const timer = addTimer(view, 'QUIZ', -575);

  /* 왜: 지나가는 점 */
  const whyN = createRef<Node>();
  const passIn = createRef<Line>();
  const passOut = createRef<Line>();
  const passIn2 = createRef<Line>();
  const passOut2 = createRef<Line>();
  const oddN = createRef<Node>();
  const arrow = (ref: any, from: P, to: P, color: string) => (
    <Line ref={ref} points={[from, to]} stroke={color} lineWidth={12} endArrow arrowSize={26} end={0} shadowColor={color} shadowBlur={14} />
  );
  view.add(
    <Node ref={whyN} y={-120} opacity={0}>
      <Node x={-230}>
        <Txt y={-300} text={'지나가는 점'} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.teal} />
        {arrow(passIn, [-200, -150], [-30, -20], C.teal)}
        {arrow(passOut, [30, -20], [200, -150], C.teal)}
        {arrow(passIn2, [-200, 160], [-30, 30], C.violet)}
        {arrow(passOut2, [30, 30], [200, 160], C.violet)}
        <Circle size={40} fill={C.ink} />
        <Txt y={260} text={'들어오고 나가고\n= 짝수'} fontFamily={FONT} fontSize={42} fontWeight={900} lineHeight={60} textAlign="center" fill={C.ink} />
      </Node>
      <Node ref={oddN} x={250} opacity={0}>
        <Txt y={-300} text={'홀수 점'} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.coral} />
        <Line points={[[0, 0], [170, -140]]} stroke={C.coral} lineWidth={12} endArrow arrowSize={26} shadowColor={C.coral} shadowBlur={14} />
        <Line points={[[0, 0], [170, 140]]} stroke={'#ffffff55'} lineWidth={12} />
        <Line points={[[0, 0], [-170, 0]]} stroke={'#ffffff55'} lineWidth={12} />
        <Circle size={40} fill={C.coral} />
        <Txt y={260} text={'하나가 남아요\n→ 출발 · 도착'} fontFamily={FONT} fontSize={42} fontWeight={900} lineHeight={60} textAlign="center" fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 봉투: 네모 + X, 홀수 점 4개 */
  const envN = createRef<Node>();
  const envDeg: Node[] = [];
  const envX = createRef<Txt>();
  const EV: P[] = [[-230, -170], [230, -170], [230, 170], [-230, 170]];
  view.add(
    <Node ref={envN} y={-120} opacity={0}>
      {[[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]].map(([a, b]) => (
        <Line points={[EV[a], EV[b]]} stroke={C.ink} lineWidth={14} lineCap="round" />
      ))}
      {EV.map(p => (
        <Circle position={p} size={30} fill={C.ink} />
      ))}
      {EV.map((p, i) => (
        <Node ref={el => (envDeg[i] = el)} x={p[0] + (p[0] < 0 ? -70 : 70)} y={p[1] + (p[1] < 0 ? -50 : 50)} opacity={0}>
          <Circle size={78} fill={C.coral} shadowColor={C.coral} shadowBlur={26} />
          <Txt text={'3'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={'#1A0B0B'} />
        </Node>
      ))}
      <Txt ref={envX} text={'×'} fontFamily={FONT} fontSize={520} fontWeight={900} fill={C.coral} shadowColor={C.coral} shadowBlur={40} opacity={0} />
    </Node>,
  );

  const card = bigCard('홀수 점 0개 · 2개 → 한 번에 OK', C.teal, 58);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['펜 떼지 않고', '이 집 그릴 수 있을까?'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '종이 한 장 수학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅: 첫 프레임부터 집이 보인다 ═════════ */
  houseN().y(60);
  houseN().scale(0.8);
  yield* all(hud.show(), title.hero(), houseN().scale(1, 1.2, easeInOutCubic));
  yield* all(title.dock(), houseN().y(-80, 0.9, easeInOutCubic));

  /* ═════════ 1. 퀴즈 ═════════ */
  cue('pop');
  yield* cap.say('QUIZ', '손가락으로 따라 그려 봐요\n같은 선 두 번은 안 돼요!', C.amber);
  timer.count(5);
  timer.node().opacity(1);
  yield* timer.run(5);
  timer.node().opacity(0);

  /* 실패: 꼭대기에서 */
  yield* cap.say('1', '꼭대기에서 시작하면…', C.coral);
  pen().opacity(1);
  penOn('fail');
  cue('swish');
  yield* failP(1, 2.0, linear);
  cue('boom');
  yield* all(cap.say('1', '앗, 선이 3개 남았다!', C.coral), shake(houseN(), 18, 0.5), punch(houseN(), 0.04));
  yield* waitFor(0.8);

  /* 성공: 왼쪽 아래에서 */
  pen().opacity(0);
  yield* all(failLine().opacity(0, 0.4), cap.say('2', '왼쪽 아래 모서리에서 시작하면?', C.amber), popIn(startRing(), 0.45, 0.5));
  penOn('win');
  pen().opacity(1);
  cue('swish');
  yield* all(startRing().opacity(0, 0.6), winP(1, 3.0, linear));
  cue('chime');
  yield* all(cap.say('2', '성공! 출발점이 비밀이에요', C.teal), sparks(houseN(), V.B, C.teal, 14, 220));
  yield* waitFor(0.6);
  pen().opacity(0);

  /* ═════════ 2. 비법: 선 세기 ═════════ */
  yield* all(winLine().opacity(0.35, 0.4), cap.say('비법', '점마다 모이는 선을 세어 봐요', C.amber));
  for (let i = 0; i < degN.length; i++) {
    cue('pop');
    yield* popIn(degN[i], 0.3, 0.5);
  }
  cue('chime');
  yield* all(cap.say('비법', '선이 홀수 개인 점은 딱 2개\n여기서 출발 → 저기서 도착!', C.coral), punch(degN[0], 0.2), punch(degN[1], 0.2));
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  yield* wipe.cover();
  houseN().opacity(0);
  title.group().opacity(0);
  whyN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('왜?', '지나가는 점은 선이 2개씩 짝지어 쓰여요', C.teal);
  cue('swish');
  yield* sequence(0.25, passIn().end(1, 0.4), passOut().end(1, 0.4), passIn2().end(1, 0.4), passOut2().end(1, 0.4));
  yield* waitFor(0.6);
  cue('pop');
  yield* all(popIn(oddN(), 0.5, 0.6), cap.say('왜?', '홀수 점은 짝이 하나 남아서\n출발점이나 도착점만 될 수 있어요', C.coral));
  yield* waitFor(2.0);

  /* ═════════ 4. 한 번 더: 봉투 ═════════ */
  yield* iris.cover([0, -120]);
  whyN().opacity(0);
  envN().opacity(1);
  yield* iris.reveal([0, -120]);
  yield* cap.say('QUIZ', '그럼 이 봉투는 될까요?', C.amber);
  dim().opacity(0);
  timer.count(3);
  timer.node().opacity(1);
  yield* timer.run(3);
  timer.node().opacity(0);
  yield* sequence(0.15, ...envDeg.map(n => popIn(n, 0.3, 0.5)));
  cue('boom');
  yield* all(cap.say('정답', '홀수 점이 4개 → 절대 안 돼요!', C.coral), popIn(envX(), 0.4, 1.4));
  yield* waitFor(1.2);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  envN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '약 290년 전 수학자 오일러가\n찾은 규칙이에요', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(0.6);
  yield* cap.say('?', '별 모양은 한 번에 될까요?\n댓글로 알려 주세요!', C.amber);
  yield* waitFor(1.6);
  yield* all(cap.hide(), card.opacity(0, 0.3), end.show('NEXT  종이 한 장 수학', '종이띠 가운데를\n자르면 생기는 일', '다음 편도 보려면 구독'));
  yield* waitFor(1.8);

  /* 첫 장면으로 이어지게: 빈 집으로 돌아간다 */
  winLine().opacity(0);
  degN.forEach(n => n.opacity(0));
  yield* all(end.root().opacity(0, 0.4), title.group().opacity(0, 0.4), delay(0.1, houseN().opacity(1, 0.4)));
  yield* finish(NAME, 0.3);
});
