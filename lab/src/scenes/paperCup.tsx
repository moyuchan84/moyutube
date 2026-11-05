import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutBack, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 「부엌 실험실」 2편 — 컵을 뒤집어도 물이 안 쏟아진다? (공기의 압력)
// 1) 따라 하기: 컵에 물을 가득 → 두꺼운 종이로 덮고 손으로 꾹 → 뒤집고 손을 살짝 떼면 종이가 붙어 있다
// 2) 공기는 사방에서 누른다. 아래에서 종이를 밀어 올리는 공기의 힘이 물 무게보다 훨씬 크고, 젖은 종이가 틈을 막아 공기가 못 들어간다
// 꼭 싱크대 위에서 · 플라스틱 컵으로. 수치(기압 등)는 말하지 않는다

const NAME = 'paperCup';
const WATER = '#5AA8FF';
const PAPER = '#F2E6C9';
const SKIN = '#E9B48F';
const EDGE = '#C98B66';

// 컵(앞에서 본 모습). fill: 물 높이 0~1, 위가 열린 쪽
function Cup(o: {fill?: () => number; w?: number; h?: number}) {
  const w = o.w ?? 240;
  const h = o.h ?? 340;
  const f = o.fill ?? (() => 1);
  return (
    <Node>
    <Rect width={w} height={h} radius={[6, 6, 30, 30]} fill={'#ffffff10'} stroke={'#ffffffbb'} lineWidth={6} clip>
      <Rect y={h / 2} offsetY={1} width={w} height={() => h * f()} fill={WATER + 'cc'} />
      <Rect x={-w / 2 + 30} width={16} height={h - 60} radius={8} fill={'#ffffff22'} />
    </Rect>
    <Rect y={h / 2 + 4} width={w * 0.92} height={34} radius={14} fill={'#DDE6F2'} />
    </Node>
  );
}

// 손바닥(위에서 누르는 손)
function Palm(o: {refFn?: (n: Node) => void; y?: number}) {
  return (
    <Node ref={o.refFn} y={o.y ?? 0}>
      <Rect width={260} height={90} radius={40} fill={SKIN} stroke={EDGE} lineWidth={3} />
      {[-90, -30, 30, 90].map(x => (
        <Rect x={x} y={-70} width={46} height={80} radius={22} fill={SKIN} stroke={EDGE} lineWidth={3} />
      ))}
    </Node>
  );
}

function Push(o: {x: number; y: number; rot: number; len?: number; color?: string; refFn?: (n: Node) => void; width?: number}) {
  const len = o.len ?? 90;
  return (
    <Node ref={o.refFn} x={o.x} y={o.y} rotation={o.rot}>
      <Line points={[[0, -len], [0, 0]]} stroke={o.color ?? C.teal} lineWidth={o.width ?? 10} endArrow arrowSize={o.width ? o.width * 2.2 : 22} lineCap="round" />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, WATER);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);

  /* 0. 훅: 거꾸로 든 컵, 물이 그대로 */
  const hookN = createRef<Node>();
  const hookQ = createRef<Txt>();
  view.add(
    <Node ref={hookN} y={330} opacity={0}>
      <Node rotation={180}>
        <Cup />
        <Rect y={-176} width={290} height={14} radius={4} fill={PAPER} />
      </Node>
      <Txt ref={hookQ} y={-280} text={'안 쏟아져?!'} fontFamily={FONT} fontSize={66} fontWeight={900} fill={C.coral} opacity={0} />
    </Node>,
  );

  /* 1. 준비 */
  const setup = addSteps(view, {
    badge: '싱크대 위에서 해요',
    color: WATER,
    steps: [
      {
        draw: () => (
          <Node y={-10} scale={0.42}>
            <Cup />
          </Node>
        ),
        label: '물을 가득',
      },
      {
        draw: () => (
          <Node y={20} scale={0.36}>
            <Cup />
            <Rect y={-176} width={290} height={14} radius={4} fill={PAPER} />
            <Palm y={-240} />
          </Node>
        ),
        label: '종이 덮고 꾹',
      },
      {
        draw: () => (
          <Node y={-10} scale={0.4} rotation={180}>
            <Cup />
            <Rect y={-176} width={290} height={14} radius={4} fill={PAPER} />
          </Node>
        ),
        label: '뒤집고 손 떼기',
      },
    ],
  });

  /* 2. 따라 하기: 컵 · 종이 · 손을 한 덩어리로 돌린다 */
  const TY = -170;
  const tryN = createRef<Node>();
  const rig = createRef<Node>();
  const water = createSignal(0);
  const paper = createRef<Rect>();
  const palm = createRef<Node>();
  const wow = createRef<Txt>();
  view.add(
    <Node ref={tryN} y={TY} opacity={0}>
      <Node ref={rig}>
        <Cup fill={water} />
        <Rect ref={paper} y={-176} x={-420} width={290} height={14} radius={4} fill={PAPER} opacity={0} />
        <Palm refFn={n => palm(n)} y={-420} />
      </Node>
      <Txt ref={wow} y={-360} text={'딱 붙었다!'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.amber} opacity={0} />
    </Node>,
  );
  palm().opacity(0);
  const timer = addTimer(view, 'TRY');

  /* 3. 왜? 거꾸로 든 컵 둘레의 힘 */
  const WY = -230;
  const whyN = createRef<Node>();
  const ringN = createRef<Node>();
  const weight = createRef<Node>();
  const lift = createRef<Node>();
  const seal = createRef<Rect>();
  const wTag = createRef<Txt>();
  const aTag = createRef<Txt>();
  const RING = Array.from({length: 12}, (_, k) => (k * 360) / 12);
  view.add(
    <Node ref={whyN} y={WY} opacity={0}>
      <Node rotation={180}>
        <Cup />
      </Node>
      <Rect ref={seal} y={176} width={290} height={14} radius={4} fill={PAPER} shadowColor={C.amber} shadowBlur={0} />
      <Node ref={ringN} opacity={0}>
        {RING.map(a => {
          const r = 330;
          const x = r * Math.sin((a * Math.PI) / 180);
          const y = -r * Math.cos((a * Math.PI) / 180);
          return <Push x={x * 0.86} y={y * 0.86} rot={a} len={70} width={7} color={'#ffffff88'} />;
        })}
      </Node>
      <Node ref={weight} opacity={0}>
        <Push x={0} y={150} rot={0} len={60} color={C.coral} width={9} />
        <Txt ref={wTag} x={-250} y={110} text={'물 무게'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.coral} />
      </Node>
      <Node ref={lift} opacity={0}>
        {[-110, -55, 0, 55, 110].map(x => (
          <Push x={x} y={196} rot={180} len={150} color={C.teal} width={14} />
        ))}
        <Txt ref={aTag} y={400} text={'공기가 미는 힘'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.teal} />
      </Node>
    </Node>,
  );

  /* 생활 예: 빨대 끝을 손가락으로 막으면 */
  const lifeN = createRef<Node>();
  view.add(
    <Node ref={lifeN} y={-250} opacity={0}>
      <Rect width={70} height={520} radius={10} fill={'#ffffff12'} stroke={'#ffffffbb'} lineWidth={5} clip>
        <Rect y={260} offsetY={1} width={70} height={300} fill={WATER + 'cc'} />
      </Rect>
      <Rect y={-290} width={120} height={80} radius={40} fill={SKIN} stroke={EDGE} lineWidth={3} />
      <Txt x={200} y={-290} text={'꾹!'} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.amber} />
      <Txt x={230} y={200} text={'물이\n안 떨어져요'} fontFamily={FONT} fontSize={44} lineHeight={58} fontWeight={900} fill={C.teal} />
    </Node>,
  );

  const card = bigCard('공기가 아래에서 받쳐 줘요', WATER, 56);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['컵을 뒤집어도', '물이 안 쏟아져?'], {y: -430, accent: WATER});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 3, series: '부엌 실험실', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, WATER);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('pop');
  yield* popIn(hookQ(), 0.4, 0.5);
  yield* title.dock();
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '컵에 물을\n넘칠 만큼 가득', C.teal), setup.step(0));
  yield* waitFor(1.3);
  yield* all(cap.say('준비', '두꺼운 종이로 덮고\n손바닥으로 꾹', C.amber), setup.step(1));
  yield* waitFor(1.2);
  yield* all(cap.say('준비', '뒤집은 다음\n손을 살짝 떼요', C.violet), setup.step(2));
  yield* waitFor(1.2);
  yield* cap.say('안전', '꼭 싱크대 위에서,\n깨지지 않는 컵으로!', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 2. 따라 하기 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  tryN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  cue('swish');
  yield* all(cap.say('TRY', '물을 가득!', C.teal), water(1, 1.4, easeInOutCubic));
  yield* waitFor(0.6);
  cue('swish');
  yield* all(cap.say('TRY', '종이를 덮고 손으로 꾹', C.amber), paper().opacity(1, 0.2), paper().x(0, 0.6, easeOutCubic), delay(0.5, all(palm().opacity(1, 0.3), palm().y(-240, 0.5, easeOutBack))));
  yield* waitFor(1.0);
  cue('whoosh');
  yield* all(cap.say('TRY', '그대로 뒤집어요!', C.violet), rig().rotation(180, 1.2, easeInOutCubic));
  yield* waitFor(0.8);
  yield* cap.say('TRY', '셋 세고, 손을 살짝 떼요', C.teal);
  timer.node().opacity(1);
  yield* timer.run(3);
  timer.node().opacity(0);
  cue('swish');
  yield* all(palm().y(-480, 0.7, easeInOutCubic), palm().opacity(0, 0.7));
  yield* waitFor(0.3);
  cue('boom');
  yield* all(cap.say('!', '종이가 딱 붙어서\n물이 안 쏟아져요!', C.amber), popIn(wow(), 0.4, 0.5), shake(tryN(), 6, 0.4));
  yield* waitFor(1.6);

  /* ═════════ 3. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  tryN().opacity(0);
  dim().opacity(0);
  whyN().opacity(1);
  yield* iris.reveal([0, WY]);
  cue('swish');
  yield* all(cap.say('01', '우리 둘레의 공기는\n사방에서 누르고 있어요', C.ink), ringN().opacity(1, 0.6), ringN().scale(1.08, 0.6).to(1, 0.4));
  yield* waitFor(1.2);
  cue('pop');
  yield* all(cap.say('02', '물 무게는 종이를\n아래로 당겨요', C.coral), ringN().opacity(0.25, 0.4), popIn(weight(), 0.45, 0.5));
  yield* waitFor(1.4);
  cue('pop');
  yield* all(cap.say('03', '공기는 종이를\n아래에서 밀어 올려요', C.teal), popIn(lift(), 0.5, 0.5));
  yield* waitFor(1.2);
  yield* all(cap.say('04', '공기가 미는 힘이\n물 무게보다 훨씬 커요!', C.amber), sequence(0.08, ...lift().children().slice(0, 5).map(n => n.scale(1.15, 0.3).to(1, 0.3))));
  yield* waitFor(1.4);
  cue('swish');
  yield* all(cap.say('05', '젖은 종이가 틈을 막아\n공기가 안으로 못 들어가요', C.violet), seal().shadowBlur(30, 0.5), seal().fill(C.amber, 0.5));
  yield* waitFor(1.6);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  whyN().opacity(0);
  lifeN().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '빨대 끝을 손가락으로 막으면\n물이 안 떨어지는 것도 같은 이유!', C.teal), popIn(lifeN(), 0.5, 0.7));
  yield* waitFor(1.6);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  lifeN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '싱크대 위에서 해 봐요!', WATER));
  yield* all(shine(card), sparks(view, [0, -420], WATER, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  부엌 실험실', '물 위의 후추,\n왜 도망갈까?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
