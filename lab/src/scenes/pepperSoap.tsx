import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutCubic, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, rand, reseed, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「부엌 실험실」 3편 — 물 위의 후추, 왜 도망갈까? (표면장력)
// 1) 따라 하기: 접시에 물 → 후추를 솔솔 → 맨 손가락으로 콕(그대로) → 세제 묻힌 손가락으로 콕 → 후추가 가장자리로 쫙
// 2) 물 표면은 서로 당기는 팽팽한 막(표면장력). 세제가 닿은 곳만 당기는 힘이 약해져서, 둘레의 센 막이 바깥으로 끌어당기며 후추를 싣고 간다
// 세제는 한 방울만 · 눈에 닿지 않게 · 끝나면 손 씻기

const NAME = 'pepperSoap';
const WATER = '#5AA8FF';
const SOAP = C.violet;
const PEP = '#2A2522';
const SKIN = '#E9B48F';
const EDGE = '#C98B66';

// 위에서 본 손가락 끝
function Finger(o: {refFn?: (n: Node) => void; soap?: boolean}) {
  return (
    <Node ref={o.refFn}>
      <Rect y={-200} width={96} height={330} radius={48} fill={SKIN} stroke={EDGE} lineWidth={3} />
      <Rect y={-80} width={60} height={70} radius={24} fill={'#F6D2BA'} stroke={EDGE} lineWidth={2} />
      {o.soap ? <Circle y={-40} size={64} fill={SOAP + '99'} shadowColor={SOAP} shadowBlur={24} /> : null}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, SOAP);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  // 후추 알갱이: 원판 안 무작위 자리 → 터질 때 가장자리 쪽으로
  reseed(2611);
  const R = 360;
  const peps = Array.from({length: 150}, () => {
    const r = R * 0.9 * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    const s = 6 + rand() * 8;
    const out = R * (0.8 + rand() * 0.13);
    return {r, a, s, out};
  });
  const burst = createSignal(0);
  const plate = (scale = 1) => (
    <Node scale={scale}>
      <Circle size={2 * R + 70} fill={'#E8E4DA'} />
      <Circle size={2 * R} fill={'#8CC4F0'} />
      <Circle size={2 * R} stroke={'#ffffff55'} lineWidth={4} />
      {peps.map(p => {
        const rr = () => p.r + (Math.max(p.out, p.r) - p.r) * burst();
        return <Circle x={() => rr() * Math.cos(p.a)} y={() => rr() * Math.sin(p.a)} size={p.s} fill={PEP} />;
      })}
    </Node>
  );

  /* 0. 훅: 후추가 퍼진 접시 → 쫙 도망 */
  const hookN = createRef<Node>();
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      {plate(0.62)}
    </Node>,
  );

  /* 1. 준비 */
  const setup = addSteps(view, {
    badge: '접시 · 후추 · 세제',
    color: SOAP,
    steps: [
      {
        draw: () => (
          <Node y={-10} scale={0.18}>
            <Circle size={2 * R + 70} fill={'#E8E4DA'} />
            <Circle size={2 * R} fill={'#8CC4F0'} />
          </Node>
        ),
        label: '접시에 물',
      },
      {
        draw: () => (
          <Node y={-10} scale={0.18}>
            <Circle size={2 * R + 70} fill={'#E8E4DA'} />
            <Circle size={2 * R} fill={'#8CC4F0'} />
            {peps.slice(0, 60).map(p => (
              <Circle x={p.r * Math.cos(p.a)} y={p.r * Math.sin(p.a)} size={p.s * 2.4} fill={PEP} />
            ))}
          </Node>
        ),
        label: '후추 솔솔',
      },
      {
        draw: () => (
          <Node y={40} scale={0.4}>
            <Finger soap />
          </Node>
        ),
        label: '세제 묻혀 콕',
      },
    ],
  });

  /* 2. 따라 하기 */
  const TY = -150;
  const tryN = createRef<Node>();
  const f1 = createRef<Node>();
  const f2 = createRef<Node>();
  const ripple = createRef<Circle>();
  const wow = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      {plate(1)}
      <Circle ref={ripple} size={0} stroke={'#ffffffcc'} lineWidth={6} opacity={0} />
      <Node ref={f1} y={-700} opacity={0}>
        <Finger />
      </Node>
      <Node ref={f2} y={-420} opacity={0}>
        <Finger soap />
      </Node>
      <Txt ref={wow} y={-470} text={'쫙!'} fontFamily={FONT} fontSize={90} fontWeight={900} fill={C.amber} opacity={0} />
    </Node>,
  );
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 물 표면을 옆에서 크게 본 그림: 물 알갱이가 서로 당긴다 */
  const WY = -260;
  const whyN = createRef<Node>();
  const spread = createSignal(0);
  const weak = createSignal(0);
  const soapN = createRef<Circle>();
  const pulls = createRef<Node>();
  const outs = createRef<Node>();
  const XS = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
  const px = (i: number) => () => XS[i] + Math.sign(XS[i]) * spread() * (1 - Math.abs(XS[i]) / 600);
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Rect y={210} width={900} height={340} fill={WATER + '33'} />
      {XS.slice(0, -1).map((_, i) => (
        <Line
          points={() => [[px(i)(), 40], [px(i + 1)(), 40]]}
          stroke={C.teal}
          lineWidth={10}
          opacity={() => (i === 3 || i === 4 ? 1 - 0.85 * weak() : 1)}
        />
      ))}
      {XS.map((_, i) => (
        <Circle x={px(i)} y={40} size={64} fill={i === 4 ? () => (weak() > 0.5 ? SOAP : WATER) : WATER} stroke={'#ffffffaa'} lineWidth={3} />
      ))}
      {XS.map((_, i) => (
        <Circle x={px(i)} size={64} fill={WATER} stroke={"#ffffff55"} lineWidth={2} y={140} opacity={0.6} />
      ))}
      {[1, 3, 5, 7].map(i => (
        <Circle x={px(i)} y={-14} size={34} fill={PEP} stroke={'#F4F1EA'} lineWidth={4} />
      ))}
      <Circle ref={soapN} y={-260} size={70} fill={SOAP} shadowColor={SOAP} shadowBlur={30} opacity={0} />
      <Node ref={pulls} opacity={0}>
        <Line points={[[-200, -60], [-100, -60]]} stroke={C.amber} lineWidth={8} endArrow startArrow arrowSize={18} />
        <Line points={[[100, -60], [200, -60]]} stroke={C.amber} lineWidth={8} endArrow startArrow arrowSize={18} />
        <Txt y={-140} text={'서로 당겨요'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.amber} />
      </Node>
      <Node ref={outs} opacity={0}>
        <Line points={[[-150, -80], [-380, -80]]} stroke={C.coral} lineWidth={12} endArrow arrowSize={24} />
        <Line points={[[150, -80], [380, -80]]} stroke={C.coral} lineWidth={12} endArrow arrowSize={24} />
        <Txt y={-160} text={'바깥으로 끌려가요'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.coral} />
      </Node>
      <Txt x={-420} y={330} offsetX={-1} text={'물 표면 (크게 본 모습)'} fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.dim} />
    </Node>,
  );

  /* 생활 예: 소금쟁이 */
  const lifeN = createRef<Node>();
  const bob = createSignal(0);
  view.add(
    <Node ref={lifeN} y={-250} opacity={0}>
      <Rect y={170} width={860} height={300} fill={WATER + '44'} />
      <Line
        points={Array.from({length: 44}, (_, i) => {
          const x = i * 20 - 430;
          const dip = [-260, -110, 110, 260].reduce((s, c) => s + 26 * Math.exp(-((x - c) ** 2) / 900), 0);
          return [x, 20 + dip] as [number, number];
        })}
        stroke={'#9FD3FF'}
        lineWidth={8}
        lineCap="round"
      />
      <Node y={() => -70 + 4 * Math.sin(bob() * Math.PI * 4)}>
        {[-260, -110, 110, 260].map(x => (
          <Line points={[[x * 0.25, 0], [x * 0.7, -50], [x, 86]]} stroke={'#3B2E28'} lineWidth={9} lineCap="round" lineJoin="round" />
        ))}
        <Rect width={200} height={44} radius={22} fill={'#5B4636'} />
        <Circle x={120} size={50} fill={'#5B4636'} />
      </Node>
    </Node>,
  );

  const card = bigCard('물 표면은 팽팽한 막이에요', SOAP, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['물 위의 후추,', '왜 도망가?'], {y: -430, accent: SOAP});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 3, series: '부엌 실험실', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, SOAP);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('boom');
  yield* burst(1, 0.9, easeOutCubic);
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();
  burst(0);

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '넓은 접시에\n물을 얕게 부어요', C.teal), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '후추를 솔솔\n골고루 뿌려요', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '손가락 끝에\n주방 세제를 콕', C.violet), setup.step(2));
  yield* waitFor(1.2);
  yield* cap.say('안전', '세제는 눈에 닿지 않게,\n끝나면 손 씻기!', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  yield* all(cap.say('TRY', '먼저 맨 손가락으로 콕', C.teal), f1().opacity(1, 0.2), f1().y(0, 0.7, easeInOutCubic));
  ripple().opacity(1);
  cue('tick');
  yield* all(ripple().size(160, 0.6, easeOutCubic), ripple().opacity(0, 0.6));
  yield* waitFor(0.6);
  yield* cap.say('TRY', '…그대로예요', C.ink);
  yield* waitFor(0.8);
  yield* all(f1().y(-700, 0.6, easeInOutCubic), f1().opacity(0, 0.6));
  yield* cap.say('TRY', '이번엔 세제 묻힌 손가락!\n셋 세고 콕', C.violet);
  timer.node().opacity(1);
  yield* timer.run(3);
  timer.node().opacity(0);
  f2().y(-320);
  yield* all(f2().opacity(1, 0.2), f2().y(0, 0.7, easeInOutCubic));
  ripple().size(0);
  ripple().opacity(1);
  cue('boom');
  yield* all(
    burst(1, 1.1, easeOutCubic),
    ripple().size(2 * R * 0.85, 1.0, easeOutCubic),
    ripple().opacity(0, 1.0),
    popIn(wow(), 0.4, 0.5),
    cap.say('!', '후추가 가장자리로\n쫙 도망가요!', C.amber),
  );
  yield* waitFor(1.6);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  cue('pop');
  yield* all(cap.say('01', '물 표면의 알갱이는\n서로 꼭 붙잡고 당겨요', C.teal), popIn(pulls(), 0.45, 0.5));
  yield* waitFor(1.3);
  yield* cap.say('02', '그래서 표면이 팽팽한 막처럼 돼요\n(표면장력)', C.ink);
  yield* waitFor(1.4);
  cue('swish');
  yield* all(cap.say('03', '세제가 닿은 곳만\n당기는 힘이 약해져요', C.violet), pulls().opacity(0, 0.3), soapN().opacity(1, 0.2), soapN().y(40, 0.7, easeInOutCubic), weak(1, 0.9));
  yield* waitFor(1.2);
  cue('whoosh');
  yield* all(cap.say('04', '둘레의 센 막이 바깥으로 끌어당겨서\n후추도 같이 실려 가요', C.coral), spread(130, 1.2, easeOutCubic), popIn(outs(), 0.45, 0.5));
  yield* waitFor(1.8);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  lifeN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '소금쟁이가 물 위에 서는 것도\n이 팽팽한 막 덕분!', C.teal), popIn(lifeN(), 0.5, 0.7), bob(1, 3, linear));

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  lifeN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '세제는 한 방울만, 끝나면 손 씻기!', SOAP));
  yield* all(shine(card), sparks(view, [0, -420], SOAP, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('부엌 실험실  끝!', '화살표 · 종이 · 후추\n몇 개나 해 봤나요?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
