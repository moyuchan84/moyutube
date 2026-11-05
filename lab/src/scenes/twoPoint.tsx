import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, easeOutBack, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「피부의 비밀」 2편 — 한 점일까 두 점일까? (두 점 구분)
// 1) 따라 하기: 연필 두 자루를 나란히 붙여 쥐고 뭉툭한 쪽으로, 눈 감은 친구의 손끝 · 팔뚝을 살짝 누른다
//    손끝은 "두 개", 팔뚝은 "하나" 로 느껴진다
// 2) 피부에는 닿는 걸 느끼는 세포가 있다. 손끝은 빽빽해서 두 점이 다른 세포에 닿고, 팔뚝은 듬성듬성해서 한 세포에 같이 닿는다
// 몇 mm · 몇 cm 같은 수치는 말하지 않는다. 뾰족한 쪽 · 이쑤시개 금지, 살짝만

const NAME = 'twoPoint';
const SKIN = '#E9B48F';
const EDGE = '#C98B66';

// 연필 두 자루 (뭉툭한 끝이 아래). 끝 사이 간격 gap
function Pencils(o: {gap?: number; refFn?: (n: Node) => void; y?: number}) {
  const gap = o.gap ?? 56;
  return (
    <Node ref={o.refFn} y={o.y ?? 0}>
      {[-gap / 2, gap / 2].map(x => (
        <Node x={x}>
          <Rect y={-170} width={44} height={300} radius={6} fill={C.amber} stroke={'#B07A10'} lineWidth={3} />
          <Rect y={-14} width={44} height={22} radius={[0, 0, 10, 10]} fill={'#F2A0B0'} />
          <Rect y={-40} width={44} height={14} fill={'#BFC6D6'} />
        </Node>
      ))}
      <Rect y={-200} width={gap + 70} height={26} radius={8} fill={C.violet} />
    </Node>
  );
}

// 손끝 (손가락 하나를 옆에서 크게)
function Fingertip() {
  return (
    <Node>
      <Rect width={360} height={170} radius={85} fill={SKIN} stroke={EDGE} lineWidth={4} />
      <Rect x={110} y={-40} width={110} height={60} radius={24} fill={'#F8DCCB'} />
    </Node>
  );
}
// 팔뚝 (긴 띠)
function Forearm() {
  return <Rect width={420} height={150} radius={50} fill={SKIN} stroke={EDGE} lineWidth={4} />;
}

// 감각 세포가 맡은 구역 (동그라미 격자)
function Field(o: {r: number; cols: number; rows: number; color: string; refs: Circle[]}) {
  const step = o.r * 2 + 6;
  const w = o.cols * step;
  const h = o.rows * step;
  return (
    <Node>
      {Array.from({length: o.rows * o.cols}, (_, i) => {
        const cx = (i % o.cols) * step - w / 2 + step / 2;
        const cy = Math.floor(i / o.cols) * step - h / 2 + step / 2;
        return (
          <Circle
            ref={el => (o.refs[i] = el)}
            x={cx}
            y={cy}
            size={o.r * 2}
            fill={o.color + '18'}
            stroke={o.color + '88'}
            lineWidth={3}
          />
        );
      })}
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

  /* 0. 훅: 연필 두 자루가 팔뚝을 눌렀는데 "하나?" */
  const hookN = createRef<Node>();
  const hookP = createRef<Node>();
  const hookQ = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      <Node y={80}>
        <Forearm />
      </Node>
      <Pencils refFn={n => hookP(n)} y={-120} />
      <Txt ref={hookQ} x={260} y={-160} text={'하나?'} fontFamily={FONT} fontSize={80} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const setup = addSteps(view, {
    badge: '친구와 같이 해요',
    color: C.amber,
    steps: [
      {draw: () => <Node y={60} scale={0.42}><Pencils /></Node>, label: '연필 두 자루\n뭉툭한 쪽'},
      {
        draw: () => (
          <Node y={-20}>
            <Circle size={130} fill={SKIN} />
            <Line points={[[-40, -6], [-14, 4]]} stroke={'#5A3A28'} lineWidth={8} lineCap="round" />
            <Line points={[[14, 4], [40, -6]]} stroke={'#5A3A28'} lineWidth={8} lineCap="round" />
          </Node>
        ),
        label: '친구는\n눈 감기',
      },
      {
        draw: () => (
          <Node y={-20} scale={0.4}>
            <Node y={100}>
              <Fingertip />
            </Node>
            <Pencils y={10} />
          </Node>
        ),
        label: '살짝 누르기\n"하나? 둘?"',
      },
    ],
  });

  /* 2. 따라 하기: 손끝 · 팔뚝 두 판 */
  const TY = -170;
  const tryN = createRef<Node>();
  const pTip = createRef<Node>();
  const pArm = createRef<Node>();
  const ansTip = createRef<Txt>();
  const ansArm = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Node x={-250}>
        <Txt y={-330} text={'손끝'} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.ink} />
        <Node y={120} scale={0.68}>
          <Fingertip />
        </Node>
        <Node scale={0.6} y={58}>
          <Pencils refFn={n => pTip(n)} y={-90} />
        </Node>
        <Txt ref={ansTip} y={250} text={'둘!'} fontFamily={FONT} fontSize={80} fontWeight={900} fill={C.teal} opacity={0} />
      </Node>
      <Node x={250}>
        <Txt y={-330} text={'팔뚝'} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.ink} />
        <Node y={120} scale={0.68}>
          <Forearm />
        </Node>
        <Node scale={0.6} y={70}>
          <Pencils refFn={n => pArm(n)} y={-90} />
        </Node>
        <Txt ref={ansArm} y={250} text={'하나?!'} fontFamily={FONT} fontSize={80} fontWeight={900} fill={C.coral} opacity={0} />
      </Node>
    </Node>,
  );
  pTip().opacity(0.25);
  pArm().opacity(0.25);
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 감각 세포 구역 */
  const WY = -250;
  const whyN = createRef<Node>();
  const tipCells: Circle[] = [];
  const armCells: Circle[] = [];
  const tipDots = createRef<Node>();
  const armDots = createRef<Node>();
  const tipN = createRef<Txt>();
  const armN = createRef<Txt>();
  // 두 연필 점 간격 = 64. 손끝 구역 반지름 26 (점이 다른 칸), 팔뚝 구역 반지름 105 (점이 한 칸)
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Node x={-240}>
        <Txt y={-300} text={'손끝'} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.teal} />
        <Rect width={400} height={420} radius={40} fill={SKIN + '33'} stroke={EDGE} lineWidth={3} clip>
          <Field r={26} cols={7} rows={7} color={C.teal} refs={tipCells} />
        </Rect>
        <Node ref={tipDots} opacity={0}>
          <Circle x={-20} y={0} size={26} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
          <Circle x={44} y={0} size={26} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
        </Node>
        <Txt ref={tipN} y={290} text={'= 둘'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.teal} opacity={0} />
      </Node>
      <Node x={240}>
        <Txt y={-300} text={'팔뚝'} fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.coral} />
        <Rect width={400} height={420} radius={40} fill={SKIN + '33'} stroke={EDGE} lineWidth={3} clip>
          <Field r={105} cols={2} rows={2} color={C.coral} refs={armCells} />
        </Rect>
        <Node ref={armDots} opacity={0}>
          <Circle x={-140} y={-108} size={26} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
          <Circle x={-76} y={-108} size={26} fill={C.amber} shadowColor={C.amber} shadowBlur={16} />
        </Node>
        <Txt ref={armN} y={290} text={'= 하나'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.coral} opacity={0} />
      </Node>
    </Node>,
  );

  /* 생활 예: 점자 */
  const brailleN = createRef<Node>();
  // 점자 세 칸 (칸마다 2열 × 3행, 1 = 볼록한 점)
  const BR = [
    [1, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1],
  ];
  view.add(
    <Node ref={brailleN} y={-250} opacity={0}>
      <Rect width={560} height={360} radius={30} fill={'#F4F1EA'} />
      {BR.map((cell, j) => (
        <Node x={(j - 1) * 150}>
          {cell.map((on, i) => (
            <Circle x={(i % 2) * 44 - 22} y={Math.floor(i / 2) * 60 - 60} size={30} fill={on ? '#2A2F45' : '#2A2F4522'} />
          ))}
        </Node>
      ))}
      <Node x={150} y={-30} rotation={-25}>
        <Rect y={-140} width={110} height={300} radius={55} fill={SKIN} stroke={EDGE} lineWidth={4} />
      </Node>
    </Node>,
  );

  const card = bigCard('빽빽한 곳일수록 섬세하게 느껴요', C.amber, 52);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['연필 두 자루가', '한 점으로?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 3, series: '피부의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* hookP().y(-60, 0.35, easeOutBack);
  yield* popIn(hookQ(), 0.4, 0.5);
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '연필 두 자루를 나란히 붙여\n뭉툭한 쪽을 아래로', C.amber), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '친구는 눈을 감아요', C.teal), setup.step(1));
  yield* waitFor(0.9);
  yield* all(cap.say('준비', '살짝 누르고 물어봐요\n"하나? 둘?"', C.coral), setup.step(2));
  yield* waitFor(1.0);
  yield* cap.say('안전', '뾰족한 쪽은 절대 쓰지 마세요!', C.coral);
  yield* waitFor(1.2);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  timer.count(12);
  timer.node().opacity(1);
  yield* timer.run(12, {
    12: () => all(cap.say('TRY', '먼저 손끝을 살짝', C.teal), pTip().opacity(1, 0.3)),
    11: () => pTip().y(0, 0.35, easeOutBack),
    9: () => all(cap.say('TRY', '"둘!" 두 점이 느껴져요', C.teal), popIn(ansTip(), 0.4, 0.5)),
    7: () => all(cap.say('TRY', '이번엔 팔뚝을 똑같이', C.coral), pTip().y(-90, 0.3), pArm().opacity(1, 0.3)),
    6: () => pArm().y(0, 0.35, easeOutBack),
    4: () => all(cap.say('TRY', '어? 하나뿐인 것 같아요!', C.coral), popIn(ansArm(), 0.4, 0.5), delay(0.4, shake(tryN(), 8, 0.4))),
  });
  timer.node().opacity(0);
  cue('chime');
  yield* cap.say('!', '똑같은 연필 두 자루인데!', C.amber);
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  yield* cap.say('01', '피부에는 닿는 걸 느끼는\n세포가 구역을 나눠 맡아요', C.ink);
  yield* waitFor(1.6);
  cue('pop');
  // 손끝: 두 점이 서로 다른 칸에 → 두 칸이 켜진다
  const tipHit = [3 * 7 + 3, 3 * 7 + 4];
  yield* all(
    cap.say('02', '손끝은 빽빽해서\n두 점이 다른 세포에 닿아요', C.teal),
    popIn(tipDots(), 0.4, 0.5),
    ...tipHit.map(i => tipCells[i].fill(C.teal + 'cc', 0.4)),
    delay(0.5, popIn(tipN(), 0.4, 0.5)),
  );
  yield* waitFor(1.6);
  cue('pop');
  yield* all(
    cap.say('03', '팔뚝은 듬성듬성해서\n두 점이 한 세포에 같이 닿아요', C.coral),
    popIn(armDots(), 0.4, 0.5),
    armCells[0].fill(C.coral + 'aa', 0.4),
    delay(0.5, popIn(armN(), 0.4, 0.5)),
  );
  yield* waitFor(1.6);
  yield* cap.say('04', '한 세포가 보낸 신호는 하나\n→ 뇌는 "한 점"이라고 느껴요', C.amber);
  yield* waitFor(1.8);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  brailleN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '그래서 손끝으로\n작은 점자도 읽을 수 있어요', C.teal), popIn(brailleN(), 0.5, 0.7));
  yield* waitFor(2.0);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  brailleN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '손등 · 볼 · 발바닥은 어떨까요?', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  피부의 비밀', '같은 물인데\n차갑고 따뜻하다?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
