import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutBack, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「피부의 비밀」 3편 — 같은 물인데 차갑고 따뜻하다? (온도 순응)
// 1) 따라 하기: 그릇 셋(찬물 · 미지근한 물 · 따뜻한 물). 왼손은 찬물, 오른손은 따뜻한 물에 30초 → 두 손을 가운데 미지근한 물에
//    왼손은 따뜻하게, 오른손은 차갑게 느낀다
// 2) 피부는 온도 자체보다 "익숙한 온도에서 얼마나 바뀌었나"를 느낀다. 30초 동안 기준이 물 온도로 옮겨 간다
// 물 온도 숫자는 말하지 않는다. 뜨거운 물 금지 · 따뜻한 수돗물만 · 어른과 함께

const NAME = 'warmWater';
const SKIN = '#E9B48F';
const EDGE = '#C98B66';
const COLD = '#5AA8FF';
const MILD = '#B9B4D8';
const WARM = '#FF8A5C';

function Bowl(o: {color: string; label?: string; x?: number; w?: number}) {
  const w = o.w ?? 260;
  return (
    <Node x={o.x ?? 0}>
      <Line points={[[-w / 2, -70], [w / 2, -70], [w / 2 - 34, 90], [-w / 2 + 34, 90]]} closed fill={o.color + '55'} stroke={'#ffffff66'} lineWidth={4} />
      <Line points={[[-w / 2 + 6, -40], [w / 2 - 6, -40], [w / 2 - 36, 86], [-w / 2 + 36, 86]]} closed fill={o.color + 'aa'} />
      <Rect y={-70} width={w + 24} height={14} radius={7} fill={'#ffffffaa'} />
      {o.label ? <Txt y={150} text={o.label} fontFamily={FONT} fontSize={38} fontWeight={900} fill={o.color} /> : null}
    </Node>
  );
}

// 손가락이 아래로 향한 손
function Hand(o: {refFn?: (n: Node) => void; x?: number; y?: number; flip?: boolean}) {
  return (
    <Node ref={o.refFn} x={o.x ?? 0} y={o.y ?? 0} scale={[o.flip ? -1 : 1, 1]}>
      <Rect y={-240} width={110} height={170} radius={30} fill={SKIN} stroke={EDGE} lineWidth={3} />
      <Rect y={-120} width={150} height={150} radius={[30, 30, 46, 46]} fill={SKIN} stroke={EDGE} lineWidth={3} />
      {[-52, -18, 18, 52].map((x, k) => (
        <Rect x={x} y={-20 + (k === 1 || k === 2 ? 14 : 0)} width={30} height={k === 1 || k === 2 ? 100 : 80} radius={15} fill={SKIN} stroke={EDGE} lineWidth={3} />
      ))}
      <Rect x={-86} y={-110} rotation={30} width={34} height={90} radius={17} fill={SKIN} stroke={EDGE} lineWidth={3} />
    </Node>
  );
}

// 온도 막대: 기준(익숙한 온도) 점선 + 물 온도 화살표
function Gauge(o: {x: number; base: () => number; color: string; refFn?: (n: Node) => void}) {
  const H = 420;
  const yOf = (v: number) => H / 2 - v * H; // v: 0(차가움) ~ 1(따뜻함)
  return (
    <Node ref={o.refFn} x={o.x}>
      <Rect width={60} height={H} radius={30} fill={'#ffffff10'} stroke={'#ffffff40'} lineWidth={3} />
      <Txt y={-H / 2 - 40} text={'따뜻'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={WARM} />
      <Txt y={H / 2 + 40} text={'차가움'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={COLD} />
      {/* 기준 */}
      <Line points={[[-80, 0], [80, 0]]} y={() => yOf(o.base())} stroke={o.color} lineWidth={8} lineDash={[18, 10]} shadowColor={o.color} shadowBlur={14} />
      {/* 미지근한 물 */}
      <Rect y={yOf(0.5)} width={100} height={14} radius={7} fill={MILD} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, WARM);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 같은 물에 담근 두 손, 한쪽은 "따뜻!" 한쪽은 "차가워!" */
  const hookN = createRef<Node>();
  const hookA = createRef<Txt>();
  const hookB = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={330} opacity={0}>
      <Bowl color={MILD} w={520} />
      <Hand x={-110} y={-30} />
      <Hand x={110} y={-30} flip />
      <Txt ref={hookA} x={-250} y={-420} text={'따뜻!'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={WARM} opacity={0} />
      <Txt ref={hookB} x={250} y={-420} text={'차가워!'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={COLD} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const setup = addSteps(view, {
    badge: '어른과 같이 해요',
    color: WARM,
    steps: [
      {
        draw: () => (
          <Node y={-10} scale={0.36}>
            <Bowl x={-280} color={COLD} />
            <Bowl color={MILD} />
            <Bowl x={280} color={WARM} />
          </Node>
        ),
        label: '찬물 · 미지근 · 따뜻',
      },
      {
        draw: () => (
          <Node y={20} scale={0.32}>
            <Bowl x={-170} color={COLD} />
            <Bowl x={170} color={WARM} />
            <Hand x={-170} y={-20} />
            <Hand x={170} y={-20} flip />
          </Node>
        ),
        label: '양손 30초',
      },
      {
        draw: () => (
          <Node y={20} scale={0.32}>
            <Bowl color={MILD} w={420} />
            <Hand x={-80} y={-20} />
            <Hand x={80} y={-20} flip />
          </Node>
        ),
        label: '둘 다 가운데로',
      },
    ],
  });

  /* 2. 따라 하기 */
  const TY = -150;
  const tryN = createRef<Node>();
  const hl = createRef<Node>();
  const hr = createRef<Node>();
  const tl = createRef<Txt>();
  const tr = createRef<Txt>();
  const ff = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Node y={180}>
        <Bowl x={-330} color={COLD} label={'찬물'} w={280} />
        <Bowl color={MILD} label={'미지근'} w={280} />
        <Bowl x={330} color={WARM} label={'따뜻한 물'} w={280} />
      </Node>
      <Hand refFn={n => hl(n)} x={-330} y={-120} />
      <Hand refFn={n => hr(n)} x={330} y={-120} flip />
      <Txt ref={tl} x={-200} y={-500} fontFamily={FONT} fontSize={66} fontWeight={900} fill={WARM} opacity={0} text={'따뜻해!'} />
      <Txt ref={tr} x={200} y={-500} fontFamily={FONT} fontSize={66} fontWeight={900} fill={COLD} opacity={0} text={'차가워!'} />
      <Txt ref={ff} y={-430} text={'▶▶ 빨리 감기'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={'#ffffffaa'} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 온도 막대 둘 */
  const WY = -250;
  const whyN = createRef<Node>();
  const baseL = createSignal(0.5);
  const baseR = createSignal(0.5);
  const arrL = createRef<Node>();
  const arrR = createRef<Node>();
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Txt x={-220} y={-310} text={'왼손'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.ink} />
      <Txt x={220} y={-310} text={'오른손'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.ink} />
      <Gauge x={-220} base={baseL} color={COLD} />
      <Gauge x={220} base={baseR} color={WARM} />
      <Node ref={arrL} x={-100} opacity={0}>
        <Line points={[[0, 140], [0, 20]]} stroke={WARM} lineWidth={10} endArrow arrowSize={22} />
        <Txt x={20} y={80} offsetX={-1} text={'따뜻해!'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={WARM} />
      </Node>
      <Node ref={arrR} x={330} opacity={0}>
        <Line points={[[0, -140], [0, -20]]} stroke={COLD} lineWidth={10} endArrow arrowSize={22} />
        <Txt x={20} y={-80} offsetX={-1} text={'차가워!'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={COLD} />
      </Node>
    </Node>,
  );

  /* 생활 예: 수영장 */
  const poolN = createRef<Node>();
  const wave = createSignal(0);
  view.add(
    <Node ref={poolN} y={-250} opacity={0}>
      <Rect width={720} height={360} radius={36} fill={'#1E5FA855'} stroke={'#ffffff55'} lineWidth={4} clip>
        {[0, 1, 2].map(k => (
          <Line
            points={() => Array.from({length: 25}, (_, i) => [i * 32 - 384, -100 + k * 90 + 14 * Math.sin(i * 0.7 + wave() * 6 + k)] as [number, number])}
            stroke={'#9FD3FF'}
            lineWidth={8}
            lineCap="round"
          />
        ))}
      </Rect>
      <Txt x={-180} y={-240} text={'앗 차가워!'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={COLD} />
      <Txt x={200} y={-240} text={'…괜찮네?'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.teal} />
    </Node>,
  );

  const card = bigCard('피부는 온도의 "변화"를 느껴요', WARM, 54);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['같은 물인데', '차갑고 따뜻?'], {y: -430, accent: WARM});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 3, series: '피부의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, WARM);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* all(popIn(hookA(), 0.4, 0.5), delay(0.3, popIn(hookB(), 0.4, 0.5)));
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '찬물 · 미지근한 물 · 따뜻한 물\n세 그릇을 놓아요', C.amber), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '왼손은 찬물, 오른손은\n따뜻한 물에 30초!', C.teal), setup.step(1));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '그다음 두 손을 함께\n가운데 미지근한 물에', C.violet), setup.step(2));
  yield* waitFor(1.0);
  yield* cap.say('안전', '뜨거운 물은 절대 안 돼요!\n따뜻한 수돗물만', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  yield* all(cap.say('TRY', '양손을 물에 쏙!', C.teal), hl().y(140, 0.5, easeOutBack), hr().y(140, 0.5, easeOutBack));
  timer.count(30);
  timer.node().opacity(1);
  ff().opacity(1);
  // 30초를 6초로 빨리 감는다 (5초마다 째깍)
  for (let k = 0; k < 6; k++) {
    cue('tick');
    if (k === 1) yield* all(cap.say('TRY', '손이 물 온도에 익숙해지는 중…', C.amber), timer.count(30 - 5 * (k + 1), 1, linear));
    else yield* timer.count(30 - 5 * (k + 1), 1, linear);
  }
  timer.node().opacity(0);
  ff().opacity(0);
  cue('whoosh');
  yield* all(
    cap.say('TRY', '이제 두 손을 가운데로!', C.violet),
    hl().y(-160, 0.4, easeInOutCubic).to(140, 0.5, easeInOutCubic),
    hr().y(-160, 0.4, easeInOutCubic).to(140, 0.5, easeInOutCubic),
    hl().x(-75, 0.9, easeInOutCubic),
    hr().x(75, 0.9, easeInOutCubic),
  );
  yield* waitFor(1.1);
  cue('pop');
  yield* all(cap.say('!', '왼손은 따뜻, 오른손은 차가워!', C.amber), popIn(tl(), 0.4, 0.5), delay(0.3, popIn(tr(), 0.4, 0.5)));
  yield* waitFor(1.2);
  cue('boom');
  yield* all(cap.say('!', '똑같은 물인데요!', C.coral), shake(tryN(), 8, 0.4));
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  yield* cap.say('01', '점선 = 손이 익숙해진 온도\n(피부의 기준)', C.ink);
  yield* waitFor(1.4);
  cue('swish');
  yield* all(
    cap.say('02', '30초 동안 기준이 옮겨 가요\n왼손은 아래로, 오른손은 위로', C.teal),
    baseL(0.1, 1.2, easeInOutCubic),
    baseR(0.9, 1.2, easeInOutCubic),
  );
  yield* waitFor(1.2);
  cue('pop');
  yield* all(cap.say('03', '미지근한 물이 기준보다 높으면\n"따뜻해!"', C.amber), popIn(arrL(), 0.45, 0.5));
  yield* waitFor(1.4);
  cue('pop');
  yield* all(cap.say('04', '기준보다 낮으면\n"차가워!"', C.teal), popIn(arrR(), 0.45, 0.5));
  yield* waitFor(1.4);
  yield* cap.say('05', '피부는 온도 그 자체보다\n얼마나 바뀌었나를 느껴요', C.violet);
  yield* waitFor(1.8);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  poolN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '수영장 물이 처음엔 차갑다가\n금방 괜찮아지는 것도 같은 이유!', C.teal), popIn(poolN(), 0.5, 0.7), wave(1, 3, linear));
  yield* waitFor(0.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  poolN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '어른과 함께, 따뜻한 수돗물로 해 봐요', WARM));
  yield* all(shine(card), sparks(view, [0, -420], WARM, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('피부의 비밀  끝!', '코 · 연필 · 물\n몇 번이나 속았나요?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
