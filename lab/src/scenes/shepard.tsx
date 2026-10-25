import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutExpo, linear, waitFor} from '@motion-canvas/core';
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
import {addBokeh, addGlitchTitle, addIris, arrive, streak, zoomInto} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S16 — 끝없이 올라가는 소리가 있다? (셰퍼드 톤)
// 1) 듣기: 보통 음계(12계단, 끝이 있다) → 셰퍼드 톤 14초 (0.5초마다 반음씩 계속 올라가는데 끝이 없다)
// 2) 한 옥타브씩 떨어진 소리 여럿을 같이 낸다. 모두 같이 올라가고, 너무 높아진 소리는 작아져 사라지고
//    아래에서 새 소리가 작게 들어온다 → 12번 오르면 처음과 똑같은 소리 (소리는 scripts/bgm.mjs 가 합성)
// 3) 이발소 표시등의 줄무늬도 같은 착각. 소리는 작게, 아주 높은 음 없음

const NAME = 'shepard';
const STEP = 0.5; // bgm.mjs 의 SHEP_STEP 과 같아야 한다

// 이발소 표시등: 비스듬한 줄무늬가 계속 위로 올라간다
function Pole(o: {t: () => number; w?: number; h?: number}) {
  const w = o.w ?? 220;
  const h = o.h ?? 620;
  const P = 120; // 줄 간격
  return (
    <Node>
      <Rect width={w} height={h} radius={w / 2} clip fill={'#F4F1EA'}>
        <Node y={() => -((o.t() * 140) % P)}>
          {Array.from({length: 14}, (_, k) => (
            <Rect
              y={-h / 2 - P + k * P}
              width={w * 2}
              height={44}
              rotation={-24}
              fill={k % 2 ? C.coral : '#4F8BFF'}
            />
          ))}
        </Node>
        <Rect
          width={w}
          height={h}
          fill={
            new Gradient({
              from: [-w / 2, 0],
              to: [w / 2, 0],
              stops: [
                {offset: 0, color: '#00000066'},
                {offset: 0.35, color: '#ffffff22'},
                {offset: 1, color: '#00000077'},
              ],
            })
          }
        />
      </Rect>
      <Rect y={-h / 2 - 20} width={w + 40} height={40} radius={20} fill={C.dim} />
      <Rect y={h / 2 + 20} width={w + 40} height={40} radius={20} fill={C.dim} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view);
  const clock = createSignal(0);
  yield clock(300, 300, linear);

  /* 0. 훅 */
  const hookN = createRef<Node>();
  view.add(
    <Node ref={hookN} y={260} scale={0.75} opacity={0}>
      <Pole t={clock} />
    </Node>,
  );

  /* 1. 준비 */
  const Speaker = (lo: boolean) => (
    <Node>
      <Rect x={-40} width={60} height={80} radius={8} fill={C.ink} />
      <Line points={[[-10, -40], [50, -90], [50, 90], [-10, 40]]} closed fill={C.ink} />
      {(lo ? [1] : [1, 2, 3]).map(k => (
        <Circle x={60} size={60 + k * 50} stroke={C.violet} lineWidth={8} startAngle={-45} endAngle={45} />
      ))}
    </Node>
  );
  const setup = addSteps(view, {
    badge: '귀로 하는 테스트',
    color: C.violet,
    steps: [
      {draw: () => Speaker(true), label: '소리는 작게'},
      {draw: () => <Pole t={clock} w={90} h={220} />, label: '끝까지 들어 보기'},
    ],
  });

  /* 2-1. 보통 계단 (음계) */
  const TY = -200;
  const stairN = createRef<Node>();
  const stairK = createSignal(-1);
  const SW = 56;
  const SH = 40;
  view.add(
    <Node ref={stairN} y={TY} opacity={0}>
      {Array.from({length: 13}, (_, k) => (
        <Rect
          x={-6 * SW + k * SW}
          y={260}
          offsetY={1}
          width={SW - 4}
          height={k * SH + 20}
          radius={6}
          fill={() => (k <= stairK() ? C.amber : '#ffffff1a')}
        />
      ))}
      <Circle
        x={() => -6 * SW + Math.max(0, stairK()) * SW}
        y={() => 260 - Math.max(0, stairK()) * SH - 46}
        size={44}
        fill={C.ink}
        opacity={() => (stairK() >= 0 ? 1 : 0)}
        shadowColor={C.amber}
        shadowBlur={20}
      />
      <Txt x={-6 * SW + 12 * SW} y={260 - 12 * SH - 110} text={'끝!'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.coral} opacity={() => (stairK() >= 12 ? 1 : 0)} />
    </Node>,
  );

  /* 2-2. 셰퍼드 톤: 표시등 + 올라가는 화살표 */
  const shepN = createRef<Node>();
  view.add(
    <Node ref={shepN} y={TY} opacity={0}>
      <Pole t={clock} w={240} h={680} />
      {[-1, 1].map(s => (
        <Node x={s * 280}>
          {[0, 1, 2].map(k => (
            <Line
              y={() => 200 - (((clock() * 120 + k * 160) % 480))}
              points={[[-40, 30], [0, -10], [40, 30]]}
              stroke={C.violet}
              lineWidth={10}
              lineCap="round"
              opacity={() => {
                const u = ((clock() * 120 + k * 160) % 480) / 480;
                return Math.sin(u * Math.PI);
              }}
            />
          ))}
        </Node>
      ))}
    </Node>,
  );
  const timer = addTimer(view, 'LISTEN');

  /* 3. 원리: 옥타브 막대 + 종 모양 세기 */
  const specN = createRef<Node>();
  const st = createSignal(0); // 반음 단계 (12 = 한 옥타브)
  const OW = 110; // 한 옥타브의 가로 길이
  const X0 = -4.5 * OW;
  const BASE = 200;
  const gauss = (oct: number) => Math.exp(-Math.pow((oct - 4.5) / 1.3, 2) / 2);
  view.add(
    <Node ref={specN} y={-330} opacity={0}>
      <Line points={[[X0 - 30, BASE], [X0 + 9 * OW + 30, BASE]]} stroke={C.dim} lineWidth={4} endArrow arrowSize={16} />
      <Txt x={X0 + 9 * OW} y={BASE + 44} offsetX={1} text={'높은 소리 →'} fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.dim} />
      <Txt x={X0} y={BASE + 44} offsetX={-1} text={'← 낮은 소리'} fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.dim} />
      <Line
        points={Array.from({length: 61}, (_, i) => {
          const oct = (i / 60) * 9;
          return [X0 + oct * OW, BASE - 360 * gauss(oct)] as [number, number];
        })}
        stroke={C.amber}
        lineWidth={4}
        lineDash={[10, 10]}
        opacity={0.7}
      />
      {Array.from({length: 9}, (_, k) => (
        <Rect
          x={() => X0 + ((k + (st() % 12) / 12) % 9) * OW}
          y={BASE}
          offsetY={1}
          width={30}
          height={() => 360 * gauss((k + (st() % 12) / 12) % 9)}
          radius={8}
          fill={C.violet}
          shadowColor={C.violet}
          shadowBlur={14}
        />
      ))}
    </Node>,
  );

  const card = bigCard('올라가는 소리 + 몰래 바뀌는 소리', C.violet, 54);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['끝없이 올라가는', '소리가 있다?'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 2, series: '뇌가 속는 순간', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.violet);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  yield* waitFor(0.5);
  yield* title.dock();
  yield* zoomInto(hookN(), [0, 260], 8, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '소리를 작게 켜 주세요', C.violet), setup.step(0));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '음이 어디까지 올라가는지\n끝까지 들어 봐요', C.amber), setup.step(1));
  yield* waitFor(1.2);

  /* ═════════ 2-1. 보통 계단 ═════════ */
  yield* iris.cover([0, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  stairN().opacity(1);
  dim().opacity(0.85);
  yield* iris.reveal([0, TY]);
  yield* cap.say('1', '먼저 보통 계단 소리', C.amber);
  cue('scaleOn');
  for (let k = 0; k <= 12; k++) {
    stairK(k);
    yield* waitFor(0.4);
  }
  yield* cap.say('1', '올라가다 보면 끝이 있죠', C.coral);
  yield* waitFor(0.8);

  /* ═════════ 2-2. 셰퍼드 톤 14초 ═════════ */
  cue('whoosh');
  yield* all(stairN().opacity(0, 0.4), cap.say('2', '이번엔 이 소리!', C.violet));
  shepN().opacity(1);
  timer.count(14);
  timer.node().opacity(1);
  cue('shepOn');
  const N = Math.round(14 / STEP);
  for (let i = 0; i < N; i++) {
    timer.count(14 - i * STEP);
    if (i === 6) yield cap.say('2', '계속 올라가요…', C.violet);
    if (i === 14) yield cap.say('2', '아직도 올라가요!', C.amber);
    if (i === 22) yield cap.say('2', '그런데 끝이 없어요?!', C.coral);
    yield* waitFor(STEP);
  }
  cue('shepOff');
  timer.node().opacity(0);
  yield* cap.say('!', '사실은 12계단마다\n처음 소리로 돌아와요!', C.amber);
  yield* waitFor(1.8);

  /* ═════════ 3. 원리 ═════════ */
  yield* iris.cover([0, TY]);
  shepN().opacity(0);
  dim().opacity(0);
  specN().opacity(1);
  yield* iris.reveal([0, -330]);
  yield* cap.say('01', '한 옥타브씩 떨어진 소리\n여러 개를 같이 내요', C.violet);
  yield* waitFor(1.4);
  yield* cap.say('02', '모두 같이 한 칸씩 올라가요', C.teal);
  cue('shepOn');
  for (let i = 0; i < 24; i++) {
    yield* st(i, 0.12, easeOutExpo);
    yield* waitFor(STEP - 0.12);
    if (i === 6) yield cap.say('03', '너무 높아진 소리는\n작아지며 사라지고', C.coral);
    if (i === 14) yield cap.say('04', '아래에서 새 소리가\n작게 들어와요', C.amber);
  }
  cue('shepOff');
  yield* cap.say('05', '그래서 귀는 "올라간다"만 느끼고\n끝은 못 알아채요', C.violet);
  yield* waitFor(2.0);

  /* ═════════ 4. 정리 ═════════ */
  yield* wipe.cover();
  specN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '이걸 "셰퍼드 톤"이라고 해요', C.violet));
  yield* all(shine(card), sparks(view, [0, -420], C.violet, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT  내 몸 실험실', '약지만\n못 든다?'));
  yield* waitFor(1.1);
  yield* finish(NAME, 0.2);
});
