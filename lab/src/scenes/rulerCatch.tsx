import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInQuad, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps} from '../sci';

// 과학 시즌 S15 — 자 하나로 반응 속도 재기 (떨어지는 자)
// 1) 집 실험: 친구가 30cm 자를 세로로 잡고(0 이 아래), 내 엄지 · 검지를 0 에 벌려 둔다 → 말없이 놓으면 잡는다 → 잡은 눈금
// 2) 표: 5cm 0.10초 · 10cm 0.14초 · 15cm 0.17초 · 20cm 0.20초 · 25cm 0.23초 · 30cm 0.25초 (거리 = ½ × 9.8 × 시간²)
// 3) 자는 떨어질수록 빨라진다: 0.05초마다 1 · 5 · 11 · 20 · 31cm. 보고 → 뇌 → 손 으로 신호가 가는 시간이 반응 시간

const NAME = 'rulerCatch';
const PX = 20; // 1cm
const RW = 80;
const RL = 30 * PX;
const TABLE: [number, string][] = [
  [5, '0.10'],
  [10, '0.14'],
  [15, '0.17'],
  [20, '0.20'],
  [25, '0.23'],
  [30, '0.25'],
];

// 30cm 자: 0 이 아래쪽. 자의 0 눈금이 y=0
function Ruler() {
  return (
    <Node>
      <Rect y={-RL / 2} width={RW} height={RL + 30} radius={8} fill={'#F2D27A'} stroke={'#B58E2A'} lineWidth={3} />
      {Array.from({length: 31}, (_, i) => (
        <Node>
          <Line
            points={[[-RW / 2, -i * PX], [-RW / 2 + (i % 5 === 0 ? 30 : 16), -i * PX]]}
            stroke={'#3a2a00'}
            lineWidth={i % 5 === 0 ? 3 : 1.5}
          />
          {i % 5 === 0 ? (
            <Txt x={14} y={-i * PX} text={String(i)} fontFamily={FONT} fontSize={22} fontWeight={900} fill={'#3a2a00'} />
          ) : null}
        </Node>
      ))}
    </Node>
  );
}

// 엄지 · 검지 (gap: 벌린 정도)
function Pinch(o: {gap: () => number; y?: number}) {
  return (
    <Node y={o.y ?? 0}>
      <Rect x={() => -RW / 2 - 30 - o.gap()} width={60} height={40} radius={20} fill={'#E9B48F'} />
      <Rect x={() => RW / 2 + 30 + o.gap()} width={60} height={40} radius={20} fill={'#E9B48F'} />
      <Rect x={() => -RW / 2 - 110 - o.gap()} width={120} height={70} radius={30} fill={'#E9B48F'} />
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

  /* 0. 훅: 떨어지는 자를 탁 */
  const hookN = createRef<Node>();
  const hookFall = createSignal(0);
  const hookGap = createSignal(30);
  view.add(
    <Node ref={hookN} y={360} scale={0.8} opacity={0}>
      <Node y={() => -100 + hookFall() * PX}>
        <Ruler />
      </Node>
      <Pinch gap={hookGap} y={-100 + 0} />
    </Node>,
  );

  /* 1. 준비 */
  const MiniStep = (k: number) => (
    <Node scale={0.42} y={60}>
      <Node y={k === 2 ? 120 : 0}>
        <Ruler />
      </Node>
      {k === 0 ? <Rect y={-RL - 40} width={140} height={80} radius={30} fill={'#C98E6A'} /> : null}
      {k > 0 ? <Pinch gap={() => (k === 2 ? 0 : 30)} /> : null}
      {k === 2 ? (
        <Line points={[[150, -400], [150, -100]]} stroke={C.teal} lineWidth={12} endArrow arrowSize={30} />
      ) : null}
    </Node>
  );
  const setup = addSteps(view, {
    badge: '집 실험',
    color: C.teal,
    y: -230,
    steps: [
      {draw: () => MiniStep(0), label: '친구가 30cm 자를\n세로로 (0 이 아래)'},
      {draw: () => MiniStep(1), label: '엄지 · 검지를\n0 에 벌려 두기'},
      {draw: () => MiniStep(2), label: '말없이 놓으면\n탁! 잡기'},
    ],
  });

  /* 2. 슬로 모션 시연 */
  const TY = -110;
  const demoN = createRef<Node>();
  const fall = createSignal(0);
  const gap = createSignal(30);
  const slow = createRef<Rect>();
  const read = createRef<Txt>();
  const handTop = createRef<Rect>();
  view.add(
    <Node ref={demoN} y={TY} opacity={0}>
      {/* 친구 손 (위) */}
      <Rect ref={handTop} y={-RL - 45} width={150} height={70} radius={34} fill={'#C98E6A'} />
      <Node y={() => fall() * PX}>
        <Ruler />
      </Node>
      <Pinch gap={gap} />
      <Txt ref={read} x={260} y={0} offsetX={-1} fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.amber} opacity={0} />
      <Rect ref={slow} x={300} y={-RL + 60} layout padding={[8, 22]} radius={999} fill={C.coral + '33'} stroke={C.coral} lineWidth={3} opacity={0}>
        <Txt text={'슬로 모션 ×6'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.ink} />
      </Rect>
    </Node>,
  );

  /* 3. 표 */
  const tableN = createRef<Node>();
  const rows: Node[] = [];
  view.add(
    <Node ref={tableN} y={-560} opacity={0}>
      <Txt x={-170} text={'잡은 눈금'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.dim} />
      <Txt x={170} text={'반응 시간'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.dim} />
      {TABLE.map(([cm, s], k) => (
        <Node ref={el => (rows[k] = el)} y={90 + k * 92} opacity={0}>
          <Rect width={620} height={78} radius={16} fill={k === 2 ? C.amber + '33' : '#ffffff0d'} stroke={k === 2 ? C.amber : '#0000'} lineWidth={3} />
          <Txt x={-170} text={`${cm}cm`} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.ink} />
          <Txt x={170} text={`${s}초`} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.teal} />
        </Node>
      ))}
    </Node>,
  );

  /* 4. 점점 빨라지는 낙하: 0.05초마다 찍은 점 */
  const dropN = createRef<Node>();
  const marks: Node[] = [];
  const TS = [0.05, 0.1, 0.15, 0.2, 0.25];
  const dcm = (t: number) => 0.5 * 980 * t * t;
  const DX = -40;
  view.add(
    <Node ref={dropN} y={-640} opacity={0}>
      <Line points={[[DX, 0], [DX, 32 * PX]]} stroke={C.dim} lineWidth={4} lineDash={[8, 10]} />
      <Circle x={DX} size={30} fill={C.ink} />
      <Txt x={DX - 40} offsetX={1} text={'0초'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.dim} />
      {TS.map((t, k) => (
        <Node ref={el => (marks[k] = el)} y={dcm(t) * PX} opacity={0}>
          <Circle x={DX} size={30} fill={C.teal} shadowColor={C.teal} shadowBlur={14} />
          <Txt x={DX - 40} offsetX={1} text={`${t.toFixed(2)}초`} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.ink} />
          <Txt x={DX + 40} offsetX={-1} text={`${Math.round(dcm(t))}cm`} fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.amber} />
        </Node>
      ))}
    </Node>,
  );

  /* 5. 신호 길: 눈 → 뇌 → 손 */
  const pathN = createRef<Node>();
  const sig = createSignal(0);
  const P: [number, number][] = [[-300, 0], [0, -160], [300, 60]];
  const along = (u: number): [number, number] => {
    const seg = u < 0.5 ? 0 : 1;
    const v = u < 0.5 ? u * 2 : (u - 0.5) * 2;
    return [P[seg][0] + (P[seg + 1][0] - P[seg][0]) * v, P[seg][1] + (P[seg + 1][1] - P[seg][1]) * v];
  };
  view.add(
    <Node ref={pathN} y={-300} opacity={0}>
      <Line points={P} stroke={'#ffffff22'} lineWidth={10} lineCap="round" />
      <Line points={P} stroke={C.teal} lineWidth={10} lineCap="round" end={sig} shadowColor={C.teal} shadowBlur={16} />
      {[
        {p: P[0], l: '눈: 봤다!'},
        {p: P[1], l: '뇌: 잡아!'},
        {p: P[2], l: '손: 탁!'},
      ].map(o => (
        <Node x={o.p[0]} y={o.p[1]}>
          <Circle size={110} fill={'#0B1028'} stroke={C.teal} lineWidth={5} />
          <Txt y={100} text={o.l} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.ink} />
        </Node>
      ))}
      <Circle x={() => along(sig())[0]} y={() => along(sig())[1]} size={34} fill={C.amber} shadowColor={C.amber} shadowBlur={20} />
    </Node>,
  );

  const card = bigCard('잡은 눈금 = 내 반응 시간', C.teal, 60);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['자 하나로', '반응 속도 재기!'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 2, series: '내 몸 실험실', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('whoosh');
  yield* hookFall(12, 0.5, easeInQuad);
  cue('boom');
  yield* all(hookGap(0, 0.08), shake(hookN(), 10, 0.3));
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().y(500, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '친구가 30cm 자 끝을 잡고\n0 이 아래로 가게 세워요', C.teal), setup.step(0));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '내 엄지와 검지를\n0 눈금에 살짝 벌려 둬요', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '친구가 말없이 놓으면\n최대한 빨리 잡아요!', C.coral), setup.step(2));
  yield* waitFor(1.2);

  /* ═════════ 2. 시연 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  demoN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  yield* all(cap.say('시연', '언제 놓을지 몰라요…', C.teal), popIn(slow(), 0.4, 0.6));
  yield* waitFor(1.2);
  cue('whoosh');
  yield* all(handTop().y(-RL - 90, 0.2), handTop().opacity(0.4, 0.2));
  // 15cm 떨어지는 데 0.17초 → 슬로 모션 6배
  yield* fall(15, 0.175 * 6, easeInQuad);
  cue('boom');
  yield* all(gap(0, 0.1), shake(demoN(), 8, 0.3));
  yield* all(read().text('15cm!', 0), popIn(read(), 0.4, 0.6), cap.say('시연', '잡은 곳의 눈금을 읽어요', C.amber));
  yield* waitFor(1.4);

  /* ═════════ 3. 표 ═════════ */
  yield* wipe.cover();
  demoN().opacity(0);
  dim().opacity(0);
  tableN().opacity(1);
  yield* wipe.reveal();
  yield* all(cap.say('01', '눈금을 표에서 찾으면\n내 반응 시간!', C.teal), sequence(0.12, ...rows.map(r => popIn(r, 0.4, 0.7))));
  yield* waitFor(1.2);
  cue('chime');
  yield* all(cap.say('02', '15cm 에서 잡았다면\n0.17초 만에 잡은 거예요', C.amber), punch(rows[2], 0.06));
  yield* waitFor(1.8);

  /* ═════════ 4. 왜 눈금으로 시간을 알까? ═════════ */
  yield* wipe.cover();
  tableN().opacity(0);
  dropN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('03', '물건은 떨어질수록\n점점 빨라져요', C.teal);
  cue('tick');
  for (const m of marks) {
    cue('tick');
    yield* popIn(m, 0.3, 0.6);
    yield* waitFor(0.25);
  }
  yield* cap.say('04', '그래서 떨어진 거리만 보면\n걸린 시간을 알 수 있어요', C.amber);
  yield* waitFor(2.0);

  /* ═════════ 5. 반응 시간이란 ═════════ */
  yield* wipe.cover();
  dropN().opacity(0);
  pathN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('05', '반응 시간 = 눈으로 보고\n뇌를 거쳐 손이 움직이는 시간', C.teal);
  cue('riser');
  yield* sig(1, 1.6, easeInOutCubic);
  cue('pop');
  yield* waitFor(0.8);
  yield* cap.say('06', '세 번 재서\n가족과 비교해 보세요!', C.amber);
  yield* waitFor(1.6);

  /* ═════════ 6. 정리 ═════════ */
  yield* wipe.cover();
  pathN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '자가 얼굴에 닿지 않게 조심!', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  지구와 달', '여름은\n왜 더울까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
