import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutBack, easeOutExpo, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
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
  shine,
  sparks,
} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S14 — 약지만 못 든다? (손가락 힘줄)
// 1) 따라 하기: 손바닥을 책상에 대고 가운데손가락만 접어 책상에 댄다 → 엄지 · 검지 · 새끼는 들리는데 약지만 안 들린다
// 2) 손가락을 드는 줄(힘줄)은 손등에 있고, 약지 줄은 가운데손가락 줄과 띠로 묶여 있다
//    가운데손가락을 접으면 그 줄이 약지 줄까지 붙잡아서 약지 혼자 못 올라간다
// 억지로 힘주지 않기 · 아프면 멈추기 안내

const NAME = 'ringFinger';
const SKIN = '#E9B48F';
const SKIN2 = '#D79C77';
// 오른손을 손바닥이 아래로 가게 놓고 위에서 본 모습 (엄지가 왼쪽)
const F = [
  {name: '검지', x: -120, len: 230},
  {name: '가운데', x: -40, len: 262},
  {name: '약지', x: 40, len: 240},
  {name: '새끼', x: 120, len: 180},
];
const FW = 72;

type HandSig = {lift: SimpleSignal<number>[]; fold: SimpleSignal<number>; thumb: SimpleSignal<number>};
function makeHand(): HandSig {
  return {lift: F.map(() => createSignal(0)), fold: createSignal(0), thumb: createSignal(0)};
}

function Hand(o: {s: HandSig; tendons?: boolean; tRef?: (n: Node) => void; band?: (n: Node) => void; ringLine?: (l: Line) => void; midLine?: (l: Line) => void}) {
  const s = o.s;
  return (
    <Node>
      {/* 손가락: lift 만큼 위로 들리고 그림자가 생긴다 */}
      {F.map((f, k) => {
        const len = () => (k === 1 ? f.len * (1 - 0.72 * s.fold()) : f.len);
        return (
          <Node x={f.x}>
            <Rect y={() => -len() / 2 + 10} width={FW} height={len} radius={FW / 2} fill={'#00000055'} opacity={() => s.lift[k]()} />
            <Node y={() => -s.lift[k]() * 46} scale={() => 1 + 0.06 * s.lift[k]()}>
              <Rect y={() => -len() / 2} width={FW} height={len} radius={FW / 2} fill={k === 1 ? () => (s.fold() > 0.5 ? SKIN2 : SKIN) : SKIN} />
              <Rect y={() => -len() + 34} width={40} height={42} radius={14} fill={'#F8DCCB'} opacity={() => (k === 1 ? 1 - s.fold() : 1)} />
            </Node>
          </Node>
        );
      })}
      {/* 엄지 */}
      <Node x={-175} y={150} rotation={-52}>
        <Rect y={() => -85 - s.thumb() * 30} width={78} height={170} radius={39} fill={SKIN} />
      </Node>
      {/* 손등 */}
      <Rect y={150} width={340} height={300} radius={[40, 40, 90, 90]} fill={SKIN} />
      {o.tendons ? (
        <Node ref={o.tRef} opacity={0}>
          {F.map((f, k) => (
            <Line
              ref={k === 2 ? o.ringLine : k === 1 ? o.midLine : undefined}
              points={[[f.x, k === 1 ? -40 : -120], [f.x * 0.45, 300]]}
              stroke={'#F4F1EA'}
              lineWidth={10}
              lineCap="round"
            />
          ))}
          <Node ref={o.band} opacity={0}>
            <Line points={[[-30, 60], [32, 90]]} stroke={C.amber} lineWidth={18} lineCap="round" shadowColor={C.amber} shadowBlur={20} />
          </Node>
        </Node>
      ) : null}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅 */
  const hookN = createRef<Node>();
  const hs = makeHand();
  hs.fold(1);
  const hookQ = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={330} scale={0.9} opacity={0}>
      <Hand s={hs} />
      <Txt ref={hookQ} x={40} y={-330} text={'?!'} fontFamily={FONT} fontSize={90} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const m0 = makeHand();
  const m1 = makeHand();
  m1.fold(1);
  const m2 = makeHand();
  m2.fold(1);
  m2.lift[0](1);
  const setup = addSteps(view, {
    badge: '따라 해 봐요',
    color: C.amber,
    steps: [
      {draw: () => <Node y={-10} scale={0.36}><Hand s={m0} /></Node>, label: '손바닥을 책상에'},
      {draw: () => <Node y={-10} scale={0.36}><Hand s={m1} /></Node>, label: '가운데만 접기'},
      {draw: () => <Node y={-10} scale={0.36}><Hand s={m2} /></Node>, label: '하나씩 들기'},
    ],
  });

  /* 2. 따라 하기 */
  const TY = -170;
  const tryN = createRef<Node>();
  const ts = makeHand();
  const tags = F.map(() => createRef<Txt>());
  const thumbTag = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Node y={60}>
        <Hand s={ts} />
      </Node>
      {F.map((f, k) => (
        <Txt ref={tags[k]} x={f.x} y={-320} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.teal} opacity={0} />
      ))}
      <Txt ref={thumbTag} x={-300} y={20} text={'번쩍!'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.teal} opacity={0} />
      <Rect y={400} width={760} height={18} radius={9} fill={'#8A5A3B'} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 손등 속 힘줄 */
  const tenN = createRef<Node>();
  const es = makeHand();
  let tenRoot: Node;
  let band: Node;
  let ringL: Line;
  let midL: Line;
  view.add(
    <Node ref={tenN} y={-250} opacity={0}>
      <Hand s={es} tendons tRef={n => (tenRoot = n)} band={n => (band = n)} ringLine={l => (ringL = l)} midLine={l => (midL = l)} />
      <Txt x={300} y={250} offsetX={-1} text={'힘줄'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={'#F4F1EA'} />
      <Line points={[[290, 250], [120, 250]]} stroke={'#F4F1EA'} lineWidth={4} endArrow arrowSize={14} />
    </Node>,
  );

  const card = bigCard('약지 힘줄은 이웃과 묶여 있어요', C.amber, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['약지만', '못 든다?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 2, series: '내 몸 실험실', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* hs.lift[0](1, 0.3, easeOutBack);
  yield* hs.lift[3](1, 0.3, easeOutBack);
  yield* all(hs.lift[2](0.25, 0.2).to(0, 0.2), popIn(hookQ(), 0.4, 0.5));
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.4, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '손바닥을 책상에 쫙 붙여요', C.amber), setup.step(0));
  yield* waitFor(0.9);
  yield* all(cap.say('준비', '가운데손가락만 접어서\n마디를 책상에 대요', C.teal), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '다른 손가락을 하나씩 들어요\n(억지로 힘주지 마세요)', C.coral), setup.step(2));
  yield* waitFor(1.2);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.88);
  yield* iris.reveal([0, TY]);
  cue('swish');
  yield* all(cap.say('TRY', '가운데손가락 접기', C.teal), ts.fold(1, 0.6, easeInOutCubic));
  timer.count(12);
  timer.node().opacity(1);
  const lift = (k: number, label: string) =>
    all(ts.lift[k](1, 0.35, easeOutBack), tags[k]().text(label, 0), popIn(tags[k](), 0.35, 0.6));
  const drop = (k: number) => all(ts.lift[k](0, 0.3), tags[k]().opacity(0, 0.3));
  yield* timer.run(12, {
    12: () => all(cap.say('TRY', '엄지 들기', C.teal), ts.thumb(1, 0.35, easeOutBack), popIn(thumbTag(), 0.35, 0.6)),
    11: () => all(ts.thumb(0, 0.3), thumbTag().opacity(0, 0.3)),
    10: () => all(cap.say('TRY', '검지 들기', C.teal), lift(0, '번쩍!')),
    9: () => drop(0),
    8: () => all(cap.say('TRY', '새끼손가락 들기', C.teal), lift(3, '번쩍!')),
    7: () => drop(3),
    6: () => all(cap.say('TRY', '이제 약지 들기!', C.coral), ts.lift[2](0.18, 0.25).to(0, 0.25)),
    5: () => all(ts.lift[2](0.18, 0.25).to(0, 0.25), tags[2]().text('안 올라가!', 0), tags[2]().fill(C.coral, 0), popIn(tags[2](), 0.35, 0.6)),
    4: () => all(cap.say('TRY', '약지만 꼼짝 안 해요!', C.coral), shake(tryN(), 8, 0.4)),
  });
  timer.node().opacity(0);
  cue('chime');
  yield* all(cap.say('!', '가운데손가락을 펴면?', C.amber), ts.fold(0, 0.6, easeInOutCubic), tags[2]().opacity(0, 0.3));
  yield* all(ts.lift[2](1, 0.35, easeOutBack), tags[2]().text('번쩍!', 0), tags[2]().fill(C.teal, 0), popIn(tags[2](), 0.35, 0.6));
  yield* cap.say('!', '약지도 잘 올라가요!', C.teal);
  yield* waitFor(1.2);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  tenN().opacity(1);
  yield* iris.reveal([0, -250]);
  yield* all(cap.say('01', '손가락을 드는 줄(힘줄)은\n손등에 있어요', C.ink), tenRoot!.opacity(1, 0.6));
  yield* waitFor(1.2);
  cue('pop');
  yield* all(cap.say('02', '약지 줄은 가운데손가락 줄과\n띠로 묶여 있어요', C.amber), popIn(band!, 0.5, 0.6));
  yield* waitFor(1.6);
  cue('swish');
  yield* all(
    cap.say('03', '가운데손가락을 접으면\n그 줄이 약지 줄까지 붙잡아요', C.coral),
    es.fold(1, 0.7, easeInOutCubic),
    midL!.stroke(C.coral, 0.5),
    delay(0.4, ringL!.stroke(C.coral, 0.5)),
  );
  yield* waitFor(1.4);
  yield* all(cap.say('04', '그래서 약지 혼자서는\n못 올라가요', C.coral), es.lift[2](0.15, 0.25).to(0, 0.25), delay(0.5, shake(tenN(), 6, 0.3)));
  yield* waitFor(1.4);
  yield* all(
    cap.say('05', '엄지 · 검지 · 새끼는\n줄이 따로따로라서 자유로워요', C.teal),
    es.lift[0](1, 0.35, easeOutBack),
    delay(0.3, es.lift[3](1, 0.35, easeOutBack)),
  );
  yield* waitFor(1.6);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  tenN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '아프면 바로 멈추세요!', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  내 몸 실험실', '자 하나로\n반응 속도 재기!'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
