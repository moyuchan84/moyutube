import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInOutExpo, easeOutExpo, linear, sequence, waitFor} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, rand, reseed, streak, zoomInto} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S9 — 곁눈으로는 글자를 못 읽는다? (중심와)
// 1) 화면 테스트: 가운데 점만 보면서 양옆 낱말 읽기 → 눈을 안 옮기면 잘 안 읽힌다
// 2) 망막 한가운데(중심와)에만 글자 · 색을 맡는 세포가 빽빽 → 또렷한 곳은 팔 뻗은 엄지손톱만큼
// 3) 그래서 눈은 1초에 몇 번씩 휙휙 옮겨 다니며 읽는다. 집 실험: 옆에서 들어오는 색연필 — 움직임 먼저, 색은 나중

const NAME = 'sideRead';
const WORDS = ['고래', '딸기'];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 가운데만 또렷하고 옆으로 갈수록 흐려지는 글자 줄 */
  const hookN = createRef<Node>();
  const hookTx: Txt[] = [];
  const LET = ['가', '나', '다', '라', '마', '바', '사'];
  const focus = createSignal(0);
  view.add(
    <Node ref={hookN} y={240} opacity={0}>
      {LET.map((ch, i) => (
        <Txt
          ref={el => (hookTx[i] = el)}
          x={(i - 3) * 140}
          text={ch}
          fontFamily={FONT}
          fontSize={110}
          fontWeight={900}
          fill={C.ink}
        />
      ))}
      <Circle x={() => (focus() - 3) * 140} y={110} size={22} fill={C.teal} shadowColor={C.teal} shadowBlur={16} />
    </Node>,
  );
  hookTx.forEach((t, i) => t.filters.blur(() => Math.min(18, Math.abs(i - focus()) * 6)));
  focus(3);

  /* 1. 준비 */
  const MiniTest = (show: boolean) => (
    <Node>
      <Rect width={300} height={220} radius={24} fill={'#07080E'} stroke={'#ffffff33'} lineWidth={3} />
      <Circle size={18} fill={C.amber} />
      <Txt x={-105} text={WORDS[0]} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.ink} opacity={show ? 1 : 0.35} />
      <Txt x={105} text={WORDS[1]} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.ink} opacity={show ? 1 : 0.35} />
    </Node>
  );
  const setup = addSteps(view, {
    badge: '8초 테스트',
    color: C.teal,
    steps: [
      {draw: () => MiniTest(false), label: '가운데 점만 보기'},
      {draw: () => MiniTest(true), label: '양옆 글자 읽기'},
    ],
  });

  /* 2. 테스트 */
  const TY = -200;
  const test = createRef<Node>();
  const wordTx: Txt[] = [];
  view.add(
    <Node ref={test} y={TY} opacity={0}>
      <Circle size={26} fill={C.amber} shadowColor={C.amber} shadowBlur={20} />
      {WORDS.map((w, i) => (
        <Txt ref={el => (wordTx[i] = el)} x={i ? 420 : -420} text={w} fontFamily={FONT} fontSize={36} fontWeight={800} fill={C.ink} />
      ))}
    </Node>,
  );
  const timer = addTimer(view);

  /* 3. 망막 지도: 한가운데만 색 세포가 빽빽 */
  const mapN = createRef<Node>();
  const coneDots: Circle[] = [];
  const rodDots: Circle[] = [];
  const RR = 340;
  reseed(901);
  const cones = Array.from({length: 150}, () => {
    const r = Math.pow(rand(), 1.8) * 95;
    const a = rand() * Math.PI * 2;
    return {x: r * Math.cos(a), y: r * Math.sin(a), c: [C.coral, '#3DDB6A', '#4F7BFF'][Math.floor(rand() * 3)]};
  });
  const rods = Array.from({length: 120}, () => {
    const r = 120 + rand() * (RR - 140);
    const a = rand() * Math.PI * 2;
    return {x: r * Math.cos(a), y: r * Math.sin(a)};
  });
  const tagC = createRef<Node>();
  const tagR = createRef<Node>();
  view.add(
    <Node ref={mapN} y={-290} opacity={0}>
      <Circle size={RR * 2} fill={'#2A1530'} stroke={C.coral + '88'} lineWidth={6} />
      {rods.map(d => (
        <Circle ref={el => rodDots.push(el)} x={d.x} y={d.y} size={12} fill={'#B9C2E6'} opacity={0} />
      ))}
      {cones.map(d => (
        <Circle ref={el => coneDots.push(el)} x={d.x} y={d.y} size={13} fill={d.c} opacity={0} />
      ))}
      <Node ref={tagC} opacity={0}>
        <Circle size={230} stroke={C.amber} lineWidth={5} lineDash={[16, 10]} />
        <Txt y={-150} text={'글자 · 색 세포 빽빽'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.amber} shadowColor={'#000'} shadowBlur={12} />
      </Node>
      <Txt ref={tagR} y={RR + 50} text={'가장자리: 어둠 · 움직임 담당'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={'#B9C2E6'} opacity={0} />
    </Node>,
  );

  /* 3-2. 엄지손톱 */
  const thumbN = createRef<Node>();
  view.add(
    <Node ref={thumbN} y={-300} opacity={0}>
      <Line points={[[-380, 60], [260, 60]]} stroke={'#E8B894'} lineWidth={70} lineCap="round" />
      <Rect x={290} y={-60} width={90} height={240} radius={45} fill={'#E8B894'} />
      <Rect x={290} y={-130} width={64} height={80} radius={[30, 30, 14, 14]} fill={'#F6D7C2'} stroke={'#ffffff88'} lineWidth={3} />
      <Circle x={290} y={-130} size={150} stroke={C.amber} lineWidth={6} shadowColor={C.amber} shadowBlur={20} />
      <Txt x={290} y={-250} text={'또렷한 곳 = 이만큼'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.amber} />
      <Txt x={-60} y={160} text={'팔을 쭉 뻗은 엄지손톱'} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.ink} />
    </Node>,
  );

  /* 3-3. 읽을 때 눈이 휙휙 */
  const readN = createRef<Node>();
  const hop = createSignal(0);
  const SENT = '눈은 글자를 따라 휙휙 뛰어요';
  view.add(
    <Node ref={readN} y={-300} opacity={0}>
      <Txt text={SENT} fontFamily={FONT} fontSize={56} fontWeight={800} fill={C.dim} />
      <Circle
        x={() => -330 + Math.floor(hop()) * 165}
        size={150}
        stroke={C.amber}
        lineWidth={5}
        shadowColor={C.amber}
        shadowBlur={20}
      />
      <Line
        points={() => Array.from({length: Math.floor(hop()) + 1}, (_, i) => [-330 + i * 165, -110] as [number, number])}
        stroke={C.amber}
        lineWidth={5}
        lineDash={[10, 10]}
        opacity={0.7}
      />
    </Node>,
  );

  /* 3-4. 집 실험: 옆에서 들어오는 색연필 */
  const penN = createRef<Node>();
  const penA = createSignal(-80); // 정면 기준 각도(도)
  const P0: [number, number] = [0, 180];
  const penPos = () => {
    const a = (penA() * Math.PI) / 180;
    return [P0[0] + 420 * Math.sin(a), P0[1] - 420 * Math.cos(a)] as [number, number];
  };
  const penColor = () => (penA() > -30 ? C.coral : '#8A8FA8');
  const penTag = () => (penA() < -55 ? '뭔가 움직여!' : penA() < -30 ? '색은 몰라…' : '빨강이다!');
  view.add(
    <Node ref={penN} y={-330} opacity={0}>
      {/* 위에서 본 머리 */}
      <Circle x={P0[0]} y={P0[1]} size={150} fill={'#3a3150'} stroke={C.ink} lineWidth={4} />
      <Circle x={P0[0] - 28} y={P0[1] - 60} size={26} fill={C.ink} />
      <Circle x={P0[0] + 28} y={P0[1] - 60} size={26} fill={C.ink} />
      <Line points={[[P0[0], P0[1] - 80], [P0[0], P0[1] - 400]]} stroke={C.amber} lineWidth={4} lineDash={[12, 10]} />
      <Txt x={P0[0] + 60} y={P0[1] - 380} offsetX={-1} text={'앞만 보기'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.amber} />
      <Line
        points={() => [penPos(), [penPos()[0] + 40 * Math.cos((penA() * Math.PI) / 180), penPos()[1] + 40 * Math.sin((penA() * Math.PI) / 180)]]}
        stroke={penColor}
        lineWidth={26}
        lineCap="round"
      />
      <Txt
        x={() => penPos()[0]}
        y={() => penPos()[1] - 60}
        text={penTag}
        fontFamily={FONT}
        fontSize={36}
        fontWeight={900}
        fill={C.ink}
        shadowColor={'#000'}
        shadowBlur={12}
      />
    </Node>,
  );

  const card = bigCard('또렷한 곳은 한가운데 조금뿐!', C.teal, 58);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['곁눈으로는', '글자를 못 읽는다?'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 4, series: '눈의 비밀 2부', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('swish');
  yield* focus(0.5, 0.8, easeInOutCubic);
  cue('swish');
  yield* focus(5.5, 1.0, easeInOutCubic);
  yield* all(title.dock(), focus(3, 0.6, easeInOutCubic));
  yield* zoomInto(hookN(), [0, 350], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '가운데 노란 점만 보세요', C.teal), setup.step(0));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '눈을 옮기지 말고\n양옆 글자를 읽어 보세요', C.amber), setup.step(1));
  yield* waitFor(1.2);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([-230, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(0.9);
  timer.count(8);
  timer.node().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TEST', '점만 보면서 양옆 글자는?', C.teal);
  yield* timer.run(8, {4: () => cap.say('TEST', '눈은 가운데 그대로!', C.amber)});

  /* ═════════ 3. 정답 ═════════ */
  cue('chime');
  timer.node().opacity(0);
  yield* all(
    cap.say('!', '정답: 고래 · 딸기', C.amber),
    wordTx[0].position([-150, 0], 0.7, easeInOutExpo),
    wordTx[1].position([150, 0], 0.7, easeInOutExpo),
    ...wordTx.map(t => t.fontSize(96, 0.7, easeInOutExpo)),
  );
  yield* waitFor(1.2);
  yield* cap.say('!', '눈을 안 옮기면\n잘 안 읽히죠?', C.teal);
  yield* waitFor(1.4);

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  test().opacity(0);
  dim().opacity(0);
  mapN().opacity(1);
  yield* iris.reveal([0, -290]);
  cue('riser');
  yield* all(
    cap.say('01', '눈 속 안쪽 벽(망막)을\n펼쳐 보면', C.coral),
    sequence(0.004, ...rodDots.map(d => d.opacity(0.8, 0.2))),
  );
  cue('pop');
  yield* all(sequence(0.004, ...coneDots.map(d => d.opacity(1, 0.2))), delay(0.4, popIn(tagC(), 0.5, 0.7)));
  yield* waitFor(0.4);
  yield* cap.say('02', '글자 · 색을 맡는 세포는\n한가운데에만 빽빽해요', C.amber);
  yield* waitFor(1.2);
  yield* all(cap.say('03', '가장자리는 어둠과\n움직임을 맡는 세포', C.dim), tagR().opacity(1, 0.4));
  yield* waitFor(1.4);

  yield* wipe.cover();
  mapN().opacity(0);
  thumbN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* cap.say('04', '또렷하게 보이는 곳은\n팔 뻗은 엄지손톱만큼!', C.amber);
  yield* waitFor(1.8);

  yield* wipe.cover();
  thumbN().opacity(0);
  readN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('05', '그래서 눈은 1초에 몇 번씩\n휙휙 옮겨 다니며 읽어요', C.teal);
  for (let k = 1; k <= 4; k++) {
    cue('tick');
    yield* hop(k, 0.12, easeOutExpo);
    yield* waitFor(0.4);
  }
  yield* waitFor(0.4);

  yield* wipe.cover();
  readN().opacity(0);
  penN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('집 실험', '친구가 옆에서 색연필을\n천천히 앞으로 가져와요', C.coral);
  yield* penA(-45, 2.2, linear);
  yield* all(cap.say('집 실험', '움직임은 먼저, 색은 나중에\n알아채요', C.amber), penA(-8, 2.4, linear));
  yield* waitFor(0.8);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  penN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '평소엔 눈이 바쁘게 움직여서\n몰랐을 뿐!', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(0.6);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 2부', '두 손가락 사이에\n소시지가 뜬다?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
