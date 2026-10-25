import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutExpo,
  easeOutExpo,
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak, zoomInto} from '../fx';

// 과학 시즌 S6 — 20초 보면 손바닥이 꿈틀? (운동 잔상)
// 1) 화면 테스트: 안으로 빨려 드는 소용돌이 가운데 점을 20초 → 멈춘 손바닥 그림이 부풀어 보인다 → 진짜 손바닥도
// 2) 움직임을 알아채는 세포는 '안으로' · '바깥으로' 팀이 줄다리기. '안으로' 팀이 지치면 멈춘 것도 바깥으로 퍼져 보인다
// 3) 폭포 착시: 폭포를 오래 보다 바위를 보면 바위가 올라가 보인다
// 안전: 회전은 프레임마다 조금씩(깜빡임 없음), 어지러우면 멈추라는 안내

const NAME = 'motionAfter';
const SKIN = '#F5C9A3';
const IN = C.violet; // '안으로' 팀
const OUT = C.amber; // '바깥으로' 팀

/* ───────── 소용돌이: 두 갈래 아르키메데스 나선. 돌리면 띠가 안으로 빨려 든다 ───────── */

const PITCH = 160; // 한 갈래가 한 바퀴 돌 때 벌어지는 거리 → 띠 간격 80
function spiralPts(offset: number, rmax: number): [number, number][] {
  const pts: [number, number][] = [];
  const thMax = (rmax / PITCH) * Math.PI * 2 + 0.6;
  for (let th = 0; th <= thMax; th += Math.PI / 40) {
    const r = (PITCH * th) / (Math.PI * 2);
    pts.push([r * Math.cos(th + offset), r * Math.sin(th + offset)]);
  }
  return pts;
}
function Spiral(o: {r: number; spin: (n: Node) => void}) {
  return (
    <Circle size={2 * o.r} clip fill={'#0B1028'} stroke={'#ffffff33'} lineWidth={4}>
      <Node ref={o.spin}>
        <Line points={spiralPts(0, o.r)} stroke={C.ink} lineWidth={PITCH / 4} lineCap={'round'} />
        <Line points={spiralPts(Math.PI, o.r)} stroke={C.ink} lineWidth={PITCH / 4} lineCap={'round'} />
      </Node>
      <Circle size={96} fill={'#0B1028'} />
      <Circle size={28} fill={C.coral} stroke={'#ffffff'} lineWidth={5} />
    </Circle>
  );
}

/* ───────── 손바닥 그림 ───────── */

const FINGERS: [number, number][] = [
  [-84, 150],
  [-28, 190],
  [28, 180],
  [84, 140],
];
function Hand(o: {refFn?: (n: Node) => void; x?: number; y?: number; scale?: number}) {
  return (
    <Node ref={o.refFn} x={o.x ?? 0} y={o.y ?? 0} scale={o.scale ?? 1}>
      {FINGERS.map(([x, h]) => (
        <Rect x={x} y={-105 - h / 2 + 40} width={50} height={h} radius={25} fill={SKIN} />
      ))}
      <Rect x={-128} y={10} width={52} height={150} radius={26} rotation={-38} fill={SKIN} />
      <Rect y={10} width={230} height={230} radius={80} fill={SKIN} />
      <Line points={[[-70, -20], [20, -40], [80, -10]]} stroke={'#C98E6A'} lineWidth={5} radius={40} />
      <Line points={[[-80, 40], [10, 30], [70, 60]]} stroke={'#C98E6A'} lineWidth={5} radius={40} />
    </Node>
  );
}

/* ───────── 화살표 묶음: 안으로 / 바깥으로 ───────── */

function Arrows4(o: {inward: boolean; color: string; refFn?: (n: Node) => void}) {
  const a = 30;
  const b = 66;
  return (
    <Node ref={o.refFn}>
      {[0, 90, 180, 270].map(deg => (
        <Node rotation={deg}>
          <Line
            points={o.inward ? [[b, 0], [a, 0]] : [[a, 0], [b, 0]]}
            stroke={o.color}
            lineWidth={8}
            endArrow
            arrowSize={14}
            lineCap={'round'}
          />
        </Node>
      ))}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  const dim = createRef<Rect>();
  view.add(<Rect ref={dim} width={1080} height={1920} fill={'#07080E'} opacity={0} />);

  /* 0. 훅: 소용돌이 */
  const hookN = createRef<Node>();
  let hookSpin: Node;
  view.add(
    <Node ref={hookN} y={230} scale={0.62} opacity={0}>
      <Spiral r={430} spin={n => (hookSpin = n)} />
    </Node>,
  );

  /* 1. 준비 */
  const setupN = createRef<Node>();
  const badge = createRef<Rect>();
  const stepA = createRef<Node>();
  const stepB = createRef<Node>();
  const arrow = createRef<Line>();
  let miniSpin: Node;
  view.add(
    <Node ref={setupN} opacity={0}>
      <Rect
        ref={badge}
        y={-500}
        layout
        padding={[12, 30]}
        radius={999}
        fill={C.teal + '22'}
        stroke={C.teal}
        lineWidth={3}
        shadowColor={C.teal}
        shadowBlur={24}
      >
        <Txt text={'20초 테스트'} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={4} fill={C.ink} />
      </Rect>
      <Node ref={stepA} x={-230} y={-260} opacity={0}>
        <Node scale={0.26}>
          <Spiral r={430} spin={n => (miniSpin = n)} />
        </Node>
        <Txt y={160} text={'가운데 점 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
      <Line
        ref={arrow}
        points={[[-80, -260], [80, -260]]}
        stroke={C.amber}
        lineWidth={8}
        endArrow
        arrowSize={22}
        end={0}
        shadowColor={C.amber}
        shadowBlur={16}
      />
      <Node ref={stepB} x={230} y={-260} opacity={0}>
        <Hand y={10} scale={0.42} />
        <Txt y={160} text={'손바닥 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 2. 테스트 */
  const TY = -200;
  const test = createRef<Node>();
  let testSpin: Node;
  const timerN = createRef<Rect>();
  const count = createSignal(20);
  view.add(
    <Node ref={test} y={TY} opacity={0}>
      <Spiral r={430} spin={n => (testSpin = n)} />
    </Node>,
  );
  view.add(
    <Rect
      ref={timerN}
      y={-720}
      layout
      direction="row"
      alignItems="center"
      gap={18}
      padding={[10, 28]}
      radius={999}
      fill={'#ffffff10'}
      stroke={'#ffffff26'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'TEST'} fontFamily={FONT} fontSize={30} fontWeight={900} letterSpacing={6} fill={C.teal} />
      <Txt
        text={() => String(Math.max(0, Math.ceil(count())))}
        fontFamily={FONT}
        fontSize={52}
        fontWeight={900}
        fill={C.ink}
      />
    </Rect>,
  );
  // 테스트 끝: 같은 자리에 멈춘 손바닥 (전환 없이 한 번에)
  const handN = createRef<Node>();
  view.add(
    <Node ref={handN} y={TY} opacity={0}>
      <Hand y={20} scale={1.45} />
    </Node>,
  );

  /* 3. 설명: 움직임 세포의 줄다리기 */
  const explain = createRef<Node>();
  const CY = -330;
  const TEAMS = [
    {name: "'안으로' 팀", col: IN, x: -210, inward: true},
    {name: "'바깥으로' 팀", col: OUT, x: 210, inward: false},
  ];
  const teamN: Node[] = [];
  const arrowsN: Node[] = [];
  const power = TEAMS.map(() => createSignal(1));
  const BAR_H = 180;
  const knot = createSignal(0);
  const ropeN = createRef<Node>();
  const tired = createRef<Txt>();
  const swell = createRef<Txt>();
  view.add(
    <Node ref={explain} opacity={0}>
      {TEAMS.map((t, i) => (
        <Node ref={el => teamN.push(el)} x={t.x} y={CY} opacity={0}>
          <Rect
            size={190}
            radius={52}
            fill={t.col + '22'}
            stroke={t.col}
            lineWidth={5}
            shadowColor={t.col}
            shadowBlur={() => 34 * power[i]()}
          />
          <Node opacity={() => 0.3 + 0.7 * power[i]()}>
            <Arrows4 inward={t.inward} color={t.col} refFn={el => arrowsN.push(el)} />
          </Node>
          <Txt y={136} text={t.name} fontFamily={FONT} fontSize={40} fontWeight={900} fill={t.col} />
          <Rect y={200 + BAR_H / 2} width={56} height={BAR_H} radius={14} fill={'#ffffff14'} />
          <Rect
            y={200 + BAR_H}
            offsetY={1}
            width={56}
            height={() => BAR_H * power[i]()}
            radius={14}
            fill={t.col}
            shadowColor={t.col}
            shadowBlur={16}
          />
        </Node>
      ))}
      <Txt
        ref={tired}
        x={-210}
        y={CY - 140}
        text={'지쳤어…'}
        fontFamily={FONT}
        fontSize={40}
        fontWeight={900}
        fill={C.ink}
        opacity={0}
      />
      <Node ref={ropeN} y={190} opacity={0}>
        <Line points={[[-380, 0], [380, 0]]} stroke={'#C9A36B'} lineWidth={12} lineCap={'round'} />
        <Line points={[[0, -40], [0, 40]]} stroke={'#ffffff55'} lineWidth={4} lineDash={[8, 8]} />
        <Node x={() => knot() * 300}>
          <Circle size={44} fill={C.coral} shadowColor={C.coral} shadowBlur={20} />
        </Node>
        <Txt x={-380} y={-50} text={'안으로'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={IN} />
        <Txt x={380} y={-50} text={'바깥으로'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={OUT} />
        <Txt
          ref={swell}
          y={80}
          text={'→ 부풀어 보여요!'}
          fontFamily={FONT}
          fontSize={44}
          fontWeight={900}
          fill={OUT}
          shadowColor={OUT}
          shadowBlur={20}
          opacity={0}
        />
      </Node>
    </Node>,
  );

  /* 4. 폭포 착시 */
  const fallN = createRef<Node>();
  const fall = createSignal(0);
  const rock = createRef<Node>();
  const rockUp = createRef<Line>();
  view.add(
    <Node ref={fallN} y={-330} opacity={0}>
      <Rect x={-170} width={300} height={560} radius={30} clip fill={'#123A5A'} stroke={'#ffffff33'} lineWidth={3}>
        {Array.from({length: 14}, (_, i) => (
          <Rect
            x={-110 + (i % 5) * 55}
            y={() => ((((i * 97) % 560) + fall() * 240) % 640) - 320}
            width={18}
            height={90 + (i % 3) * 30}
            radius={9}
            fill={'#BFE8FF'}
            opacity={0.85}
          />
        ))}
      </Rect>
      <Txt x={-170} y={320} text={'폭포'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={'#BFE8FF'} />
      <Node ref={rock} x={190} y={60}>
        <Line
          points={[[-110, 60], [-90, -30], [-30, -80], [50, -70], [110, -10], [100, 60]]}
          closed
          radius={30}
          fill={'#6E7591'}
          stroke={'#ffffff44'}
          lineWidth={3}
        />
      </Node>
      <Txt x={190} y={320} text={'바위'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.dim} />
      <Line
        ref={rockUp}
        points={[[330, 120], [330, -40]]}
        stroke={C.teal}
        lineWidth={8}
        endArrow
        arrowSize={20}
        end={0}
        shadowColor={C.teal}
        shadowBlur={14}
      />
    </Node>,
  );

  /* 5. 정리 */
  const card = bigCard('운동 잔상 = 지친 움직임 세포', C.teal, 58);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['20초만 보면', '손바닥이 꿈틀?'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 5, series: '눈의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  // 회전 각속도: 1초에 150° → 띠가 프레임마다 약 2px 씩 안으로 (깜빡임 없이 부드럽게)
  const DEG = 150;

  /* ═════════ 0. 훅 ═════════ */
  yield hookSpin!.rotation(DEG * 8, 8, linear);
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.4));
  yield* waitFor(0.2);
  yield* all(title.dock(), hookN().scale(0.8, 0.9, easeInOutExpo), hookN().y(150, 0.9, easeInOutExpo));
  yield* zoomInto(hookN(), [0, 150], 12, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield miniSpin!.rotation(DEG * 8, 8, linear);
  yield* all(arrive(setupN(), 0.8), streak(view, '#ffffff', -260));
  yield* popIn(badge(), 0.5, 0.6);
  cue('pop');
  yield* all(cap.say('준비', '소용돌이 가운데 점을\n20초 동안 보세요', C.teal), popIn(stepA(), 0.5, 0.6));
  yield* waitFor(0.5);
  cue('swish');
  yield* arrow().end(1, 0.5, easeOutExpo);
  cue('pop');
  yield* all(cap.say('준비', '끝나면 손바닥 그림 → 진짜 손바닥', C.amber), popIn(stepB(), 0.5, 0.6));
  yield* waitFor(0.6);
  yield* cap.say('준비', '어지러우면 바로 멈추세요', C.dim);
  yield* waitFor(0.4);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([-230, -260]);
  setupN().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(0.9);
  timerN().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TEST', '가운데 점에서 눈을 떼지 마세요', C.teal);
  yield testSpin!.rotation(DEG * 20, 20, linear);
  for (let k = 20; k >= 1; k--) {
    count(k);
    cue('tick');
    if (k === 12) yield* all(cap.say('TEST', '조금만 더!', C.teal), waitFor(1));
    else if (k === 5) yield* all(cap.say('TEST', '끝나도 계속 가운데를 보세요', C.amber), waitFor(1));
    else yield* waitFor(1);
  }
  count(0);

  /* ═════════ 3. 멈춘 손바닥 — 전환 없이 한 번에 ═════════ */
  cue('chime');
  test().opacity(0);
  timerN().opacity(0);
  handN().opacity(1);
  yield* cap.say('!', '손바닥이 부풀어 꿈틀대죠?', C.amber);
  yield* waitFor(2.4);
  yield* cap.say('!', '이제 진짜 내 손바닥을 봐요!', C.pink);
  yield* waitFor(1.8);

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  handN().opacity(0);
  dim().opacity(0);
  explain().opacity(1);
  title.group().opacity(1);
  yield* iris.reveal([0, CY]);
  cue('pop');
  yield* all(
    cap.say('01', '움직임을 알아채는 세포는\n두 팀이 줄다리기를 해요', C.teal),
    sequence(0.15, ...teamN.map(n => popIn(n, 0.5, 0.5))),
  );
  yield* all(popIn(ropeN(), 0.5, 0.8), knot(0.06, 0.4).to(-0.06, 0.4).to(0, 0.4));
  yield* cap.say('02', '힘이 같으면\n멈춘 건 멈춰 보여요', C.ink);
  yield* waitFor(1.0);

  cue('whoosh');
  yield* all(
    cap.say('03', "안으로 도는 걸 20초 보면\n'안으로' 팀이 지쳐요", IN),
    arrowsN[0].scale(1.25, 0.3).to(1, 0.3).to(1.25, 0.3).to(1, 0.3),
    power[0](0.25, 1.6, easeInOutExpo),
    delay(1.0, popIn(tired(), 0.4)),
  );
  yield* shake(teamN[0], 8, 0.35);
  yield* waitFor(0.3);

  cue('riser');
  yield* all(
    cap.say('04', "멈춘 걸 보면 '바깥으로' 팀이 이겨서", OUT),
    knot(0.8, 1.0, easeInOutExpo),
  );
  cue('chime');
  yield* all(popIn(swell(), 0.45), sparks(ropeN(), [240, 0], OUT, 14, 160), punch(teamN[1], 0.12, 0.4));
  yield* waitFor(1.4);

  /* ═════════ 5. 폭포 착시 ═════════ */
  yield* wipe.cover();
  explain().opacity(0);
  fallN().opacity(1);
  yield* wipe.reveal();
  yield fall(8, 4, linear);
  yield* cap.say('05', '폭포를 오래 보다가 바위를 보면?', C.teal);
  yield* waitFor(1.2);
  cue('swish');
  yield* all(
    cap.say('05', '바위가 위로 올라가 보여요\n그래서 이름이 폭포 착시!', C.teal),
    rockUp().end(1, 0.6, easeOutExpo),
    rock().y(30, 1.4, easeInOutExpo),
  );
  yield* waitFor(1.0);

  /* ═════════ 6. 정리 ═════════ */
  yield* iris.cover([190, -270]);
  fallN().opacity(0);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '잠깐 지나면 금방 돌아와요', C.teal));
  yield* shine(card);
  yield* waitFor(0.6);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 4', '흑백 그림이\n컬러로 보인다?'));
  yield* waitFor(1.8);
  yield* finish(NAME, 0.6);
});
