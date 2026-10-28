import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, easeInOutExpo, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addTimer} from '../sci';

// 과학 「크기를 속이는 뇌」 1편 — 화살표 끝 착시 (뮐러-라이어)
// 1) 화면 퀴즈: 끝이 안으로 꺾인 선(<—>)과 밖으로 벌어진 선(>—<), 어느 쪽이 길까?
// 2) 끝점에 세로줄을 내리고 자를 대 보면 두 선은 똑같이 10칸
// 3) 알고 봐도 또 속는다 → 뇌는 선만 따로 재지 않고 끝 모양까지 한 덩어리로 본다 (전체 크기 상자)
// 착시가 "왜" 생기는지는 아직 정설이 없다 → "과학자들도 아직 연구 중" 이라고만 말한다

const NAME = 'arrowFins';
const L = 260; // 선 반쪽 길이 (두 선 모두 520)
const FIN = 110; // 꺾쇠 길이
const ANG = (36 * Math.PI) / 180;
const FX = FIN * Math.cos(ANG);
const FY = FIN * Math.sin(ANG);
const Y1 = -360; // 위 선 (끝이 안으로)
const Y2 = -60; // 아래 선 (끝이 밖으로)
const INK = '#F4F1EA';

// 선 하나 + 꺾쇠 네 개. out=false 면 화살촉(<—>), out=true 면 벌어진 꼬리(>—<)
function Fig(o: {y: number; out: boolean; shaft: (n: Line) => void; fins: (n: Node) => void}) {
  const s = o.out ? 1 : -1;
  const fin = (x: number, dir: number, dy: number) => (
    <Line points={[[x, 0], [x + dir * s * FX, dy]]} stroke={INK} lineWidth={14} lineCap="round" />
  );
  return (
    <Node y={o.y}>
      <Line ref={o.shaft} points={[[-L, 0], [L, 0]]} stroke={INK} lineWidth={14} lineCap="round" />
      <Node ref={o.fins}>
        {fin(L, 1, -FY)}
        {fin(L, 1, FY)}
        {fin(-L, -1, -FY)}
        {fin(-L, -1, FY)}
      </Node>
    </Node>
  );
}

// 자: 10칸 (한 칸 52)
function Ruler(o: {y: number; refFn: (n: Node) => void}) {
  const step = (2 * L) / 10;
  return (
    <Node ref={o.refFn} y={o.y} opacity={0}>
      <Rect width={2 * L + 50} height={64} radius={8} fill={'#FFC24B33'} stroke={C.amber} lineWidth={3} />
      <Node>
        {Array.from({length: 11}, (_, k) => (
          <Line points={[[-L + k * step, -32], [-L + k * step, k % 5 === 0 ? 4 : -10]]} stroke={C.amber} lineWidth={4} />
        ))}
      </Node>
      <Node>
        {[0, 5, 10].map(k => (
          <Txt x={-L + k * step} y={18} text={String(k)} fontFamily={FONT} fontSize={26} fontWeight={900} fill={C.ink} />
        ))}
      </Node>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 두 선 + 확인 도구 */
  const stage = createRef<Node>();
  let shaft1: Line, shaft2: Line, fins1: Node, fins2: Node;
  const guides = createRef<Node>();
  const g1 = createRef<Line>();
  const g2 = createRef<Line>();
  let ruler1: Node, ruler2: Node;
  const tag1 = createRef<Txt>();
  const tag2 = createRef<Txt>();
  const box1 = createRef<Rect>();
  const box2 = createRef<Rect>();
  view.add(
    <Node ref={stage} opacity={0}>
      {/* 전체 크기 상자 (원리 단계) */}
      <Rect ref={box1} y={Y1} width={2 * L + 40} height={2 * FY + 60} radius={18} stroke={C.teal} lineWidth={5} lineDash={[18, 12]} fill={'#3DDBC414'} opacity={0} />
      <Rect ref={box2} y={Y2} width={2 * (L + FX) + 40} height={2 * FY + 60} radius={18} stroke={C.coral} lineWidth={5} lineDash={[18, 12]} fill={'#FF7A7A14'} opacity={0} />
      <Fig y={Y1} out={false} shaft={n => (shaft1 = n)} fins={n => (fins1 = n)} />
      <Fig y={Y2} out={true} shaft={n => (shaft2 = n)} fins={n => (fins2 = n)} />
      <Txt ref={tag1} x={-L - 150} y={Y1} text={'위'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.teal} opacity={0} />
      <Txt ref={tag2} x={-L - 190} y={Y2} text={'아래'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.coral} opacity={0} />
      {/* 끝점에서 내려 긋는 세로줄 */}
      <Node ref={guides}>
        <Line ref={g1} points={[[-L, Y1 - 90], [-L, Y2 + 90]]} stroke={C.teal} lineWidth={6} lineDash={[16, 12]} end={0} shadowColor={C.teal} shadowBlur={16} />
        <Line ref={g2} points={[[L, Y1 - 90], [L, Y2 + 90]]} stroke={C.teal} lineWidth={6} lineDash={[16, 12]} end={0} shadowColor={C.teal} shadowBlur={16} />
      </Node>
      <Ruler y={Y1 + 120} refFn={n => (ruler1 = n)} />
      <Ruler y={Y2 + 120} refFn={n => (ruler2 = n)} />
    </Node>,
  );

  /* 집에서 해 보기: 종이 + 연필 */
  const homeN = createRef<Node>();
  view.add(
    <Node ref={homeN} y={-250} opacity={0}>
      <Rect width={560} height={420} radius={16} fill={'#F2EFE6'} rotation={-4} shadowColor={'#000'} shadowBlur={30} />
      <Node rotation={-4} scale={0.55}>
        <Line points={[[-L, -150], [L, -150]]} stroke={'#333'} lineWidth={12} lineCap="round" />
        <Line points={[[-L, 150], [L, 150]]} stroke={'#333'} lineWidth={12} lineCap="round" />
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => <Line points={[[sx * L, -150], [sx * (L - FX), -150 + sy * FY]]} stroke={'#333'} lineWidth={12} lineCap="round" />)}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => <Line points={[[sx * L, 150], [sx * (L + FX), 150 + sy * FY]]} stroke={'#333'} lineWidth={12} lineCap="round" />)}
      </Node>
      <Rect x={250} y={60} width={34} height={300} radius={6} fill={C.amber} rotation={28} />
      <Txt y={290} text={'종이에 그려서 자로 재 봐요'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const card = bigCard('뇌는 끝 모양까지 같이 잰다', C.amber, 58);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['위 선과 아래 선,', '어느 게 길까?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '크기를 속이는 뇌', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);
  const timer = addTimer(view, 'QUIZ');

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero());
  stage().opacity(1);
  stage().y(160);
  fins1!.opacity(0);
  fins2!.opacity(0);
  shaft1!.end(0);
  shaft2!.end(0);
  yield* all(title.dock(), stage().y(0, 0.9, easeInOutExpo), shaft1!.end(1, 0.7, easeOutExpo), delay(0.15, shaft2!.end(1, 0.7, easeOutExpo)));
  cue('pop');
  yield* all(fins1!.opacity(1, 0.4), delay(0.12, fins2!.opacity(1, 0.4)), punch(stage(), 0.03));

  /* ═════════ 1. 퀴즈 ═════════ */
  yield* all(popIn(tag1(), 0.4, 0.5), delay(0.15, popIn(tag2(), 0.4, 0.5)));
  title.group().opacity(0);
  timer.count(5);
  timer.node().opacity(1);
  yield* cap.say('QUIZ', '가운데 선만 보세요\n위와 아래, 어느 쪽이 길까요?', C.amber);
  yield* timer.run(5);
  timer.node().opacity(0);
  yield* cap.say('QUIZ', '아래 선이 더 길어 보이죠?', C.coral);
  yield* waitFor(1.6);

  /* ═════════ 2. 확인 ═════════ */
  yield* cap.say('!', '위 선의 끝에서\n세로줄을 쭉 내려 볼게요', C.teal);
  yield* waitFor(0.4);
  cue('riser');
  yield* all(g1().end(1, 1.2, easeInOutCubic), g2().end(1, 1.2, easeInOutCubic));
  cue('boom');
  yield* all(cap.say('!', '어? 아래 선 끝에\n딱 맞아요!', C.amber), punch(stage(), 0.03));
  yield* waitFor(1.4);

  cue('whoosh');
  yield* all(cap.say('!', '자를 대 볼까요?', C.teal), guides().opacity(0, 0.4), tag1().opacity(0, 0.4), tag2().opacity(0, 0.4));
  yield* waitFor(0.6);
  cue('pop');
  yield* sequence(0.2, popIn(ruler1!, 0.5, 0.7), popIn(ruler2!, 0.5, 0.7));
  cue('chime');
  yield* all(cap.say('!', '둘 다 똑같이 10칸!', C.amber), sparks(view, [L, Y2], C.amber, 12, 200), sparks(view, [L, Y1], C.amber, 12, 200));
  yield* waitFor(1.6);

  cue('whoosh');
  yield* all(cap.say('!', '꺾쇠를 떼어 내면', C.teal), ruler1!.opacity(0, 0.4), ruler2!.opacity(0, 0.4), fins1!.opacity(0, 0.8), fins2!.opacity(0, 0.8));
  yield* waitFor(1.3);
  yield* cap.say('!', '그냥 같은 길이의 두 선', C.amber);
  yield* waitFor(1.6);

  cue('pop');
  yield* all(fins1!.opacity(1, 0.6), fins2!.opacity(1, 0.6));
  yield* cap.say('?', '다시 붙이면…\n알고 봐도 또 아래가 길어 보여요!', C.coral);
  yield* waitFor(2.2);

  /* ═════════ 3. 왜? ═════════ */
  cue('swish');
  yield* all(cap.say('01', '뇌는 가운데 선만\n따로 재지 않아요', C.teal), box1().opacity(1, 0.6), box2().opacity(1, 0.6));
  yield* waitFor(1.4);
  yield* all(cap.say('02', '끝에 붙은 모양까지\n한 덩어리로 보고 길이를 짐작해요', C.amber), punch(box2(), 0.05));
  yield* waitFor(2.0);
  yield* cap.say('03', '벌어진 끝은 덩어리가 크니까\n선도 길다고 느껴요', C.coral);
  yield* waitFor(2.0);
  yield* cap.say('04', '정확히 왜 그런지는\n과학자들도 아직 연구 중이에요', C.violet);
  yield* waitFor(2.0);

  /* ═════════ 4. 집에서 해 보기 ═════════ */
  yield* wipe.cover();
  stage().opacity(0);
  homeN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('TRY', '종이에 똑같이 그려서\n친구에게 물어보세요', C.teal), popIn(homeN(), 0.5, 0.7));
  yield* waitFor(2.0);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  homeN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '같은 길이도 끝 모양에 따라\n다르게 보여요', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  크기를 속이는 뇌 02', '가운데 두 원,\n어느 게 더 클까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
