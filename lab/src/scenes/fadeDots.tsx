import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutExpo, linear, sequence, waitFor} from '@motion-canvas/core';
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
import {Plus, addBokeh, addGlitchTitle, addIris, arrive, streak, zoomInto} from '../fx';
import {addDim, addSteps, addTimer} from '../sci';

// 과학 시즌 S8 — 가운데만 보면 점이 사라진다? (트록슬러 효과)
// 1) 화면 테스트: 회색 바탕 + 흐릿한 분홍 점 8개, 가운데 십자만 16초 → 점이 하나둘 사라진다
// 2) 눈 세포는 "바뀌는 것"에 크게 반응하고, 계속 똑같으면 신호를 줄인다 → 빈 곳은 뇌가 주변 색으로 메운다
// 3) 흐릿한 점은 경계가 흐려서 눈이 조금씩 떨려도 변화가 작다

const NAME = 'fadeDots';
const GRAY = '#8E8F99';
const DOT = '#E27BD6';
const R = 300; // 점이 놓인 원의 반지름

function Blob(o: {x: number; y: number; size?: number; refFn?: (c: Circle) => void}) {
  const s = o.size ?? 230;
  return (
    <Circle
      ref={o.refFn}
      x={o.x}
      y={o.y}
      size={s}
      fill={
        new Gradient({
          type: 'radial',
          from: [0, 0],
          to: [0, 0],
          fromRadius: 0,
          toRadius: s / 2,
          stops: [
            {offset: 0, color: DOT + 'e0'},
            {offset: 0.35, color: DOT + '90'},
            {offset: 0.7, color: DOT + '40'},
            {offset: 1, color: DOT + '00'},
          ],
        })
      }
    />
  );
}

// 회색 판 + 흐린 점 8개 + 가운데 십자 (scale 로 줄여 쓴다)
function Target(o: {dots: Circle[]; size?: number}) {
  const W = o.size ?? 900;
  return (
    <Node>
      <Rect width={W} height={W} radius={40} fill={GRAY} />
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <Blob x={R * Math.cos(a)} y={R * Math.sin(a)} refFn={c => o.dots.push(c)} />;
      })}
      <Plus size={46} thick={9} color={'#111111'} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.pink);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();
  const dim = addDim(view, GRAY);

  /* 0. 훅 */
  const hookN = createRef<Node>();
  const hookDots: Circle[] = [];
  view.add(
    <Node ref={hookN} y={240} scale={0.62} opacity={0}>
      <Target dots={hookDots} />
    </Node>,
  );

  /* 1. 준비 */
  const miniA: Circle[] = [];
  const miniB: Circle[] = [];
  const setup = addSteps(view, {
    badge: '16초 테스트',
    steps: [
      {draw: () => <Node scale={0.3}><Target dots={miniA} /></Node>, label: '가운데 + 만 보기'},
      {draw: () => <Node scale={0.3}><Target dots={miniB} /></Node>, label: '점이 사라지면 성공'},
    ],
  });
  miniB.forEach((d, i) => d.opacity(i % 3 === 0 ? 1 : 0.05));

  /* 2. 테스트 */
  const TY = -180;
  const test = createRef<Node>();
  const dots: Circle[] = [];
  view.add(
    <Node ref={test} y={TY} opacity={0}>
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <Blob x={R * Math.cos(a)} y={R * Math.sin(a)} refFn={c => dots.push(c)} />;
      })}
      <Plus size={46} thick={9} color={'#111111'} />
    </Node>,
  );
  const timer = addTimer(view);

  /* 3. 설명: 신호 그래프 */
  const explain = createRef<Node>();
  const GW = 760;
  const GH = 360;
  const gx = (u: number) => -GW / 2 + u * GW;
  const gy = (v: number) => GH / 2 - v * GH;
  const sig = (u: number) => (u < 0.18 ? 0.06 : 0.12 + 0.88 * Math.exp(-(u - 0.18) / 0.16));
  const curve = createRef<Line>();
  const stimBar = createRef<Rect>();
  const tagNew = createRef<Txt>();
  const tagSame = createRef<Txt>();
  view.add(
    <Node ref={explain} y={-300} opacity={0}>
      <Txt x={gx(0) - 20} y={gy(1) - 40} offsetX={-1} text={'세포 신호'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
      <Line points={[[gx(0), gy(1.05)], [gx(0), gy(0)], [gx(1), gy(0)]]} stroke={C.dim} lineWidth={4} endArrow arrowSize={16} />
      <Txt x={gx(1)} y={gy(0) + 40} offsetX={1} text={'시간 →'} fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.dim} />
      {/* 점이 보이기 시작한 때부터 쭉 같은 자극 */}
      <Rect ref={stimBar} x={gx(0.18)} offsetX={-1} y={gy(0) + 90} width={0} height={26} radius={13} fill={DOT} opacity={0.85} />
      <Txt ref={tagNew} x={gx(0.18) + 30} offsetX={-1} y={gy(1) + 10} text={'새로 보임!'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.amber} opacity={0} />
      <Txt ref={tagSame} x={gx(0.72)} y={gy(0.42)} text={'계속 똑같네…'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.teal} opacity={0} />
      <Line
        ref={curve}
        points={Array.from({length: 121}, (_, i) => [gx(i / 120), gy(sig(i / 120))] as [number, number])}
        stroke={C.amber}
        lineWidth={8}
        lineCap="round"
        lineJoin="round"
        end={0}
        shadowColor={C.amber}
        shadowBlur={18}
      />
    </Node>,
  );

  /* 3-2. 메우기: 회색 판 위 점 하나가 바탕색으로 덮인다 */
  const fillN = createRef<Node>();
  const fillCover = createSignal(0);
  view.add(
    <Node ref={fillN} y={-260} opacity={0}>
      <Rect width={640} height={420} radius={30} fill={GRAY} />
      <Blob x={-120} y={0} size={260} />
      <Plus x={150} size={40} thick={8} color={'#111111'} />
      <Circle x={-120} size={() => 280 * fillCover()} fill={GRAY} />
      <Txt x={-120} y={-170} text={'뇌가 메움'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={'#1a1a22'} opacity={fillCover} />
    </Node>,
  );

  /* 3-3. 흐린 점 vs 또렷한 점 */
  const edgeN = createRef<Node>();
  const jig = createSignal(0);
  view.add(
    <Node ref={edgeN} y={-260} opacity={0}>
      <Rect x={-200} width={360} height={360} radius={26} fill={GRAY} />
      <Rect x={200} width={360} height={360} radius={26} fill={GRAY} />
      <Node x={() => -200 + 8 * Math.sin(jig() * 17)}>
        <Blob x={0} y={0} size={240} />
      </Node>
      <Circle x={() => 200 + 8 * Math.sin(jig() * 17)} size={150} fill={DOT} />
      <Txt x={-200} y={230} text={'흐린 점: 잘 사라짐'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.ink} />
      <Txt x={200} y={230} text={'또렷한 점: 잘 안 사라짐'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.ink} />
    </Node>,
  );

  const card = bigCard('안 바뀌면 → 신호 OFF → 뇌가 메움', C.pink, 52);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['가운데만 보면', '점이 사라진다?'], {y: -430, accent: C.pink});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 5, total: 5, series: '눈의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.pink);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('riser');
  yield* sequence(0.12, ...hookDots.map(d => d.opacity(0, 0.5)));
  cue('chime');
  yield* all(title.dock(), sequence(0.05, ...hookDots.map(d => d.opacity(1, 0.4))));
  yield* zoomInto(hookN(), [0, 240], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setup.root(), 0.8), streak(view, '#ffffff', -260));
  yield* setup.showBadge();
  yield* all(cap.say('준비', '가운데 십자(+)만 16초 동안\n가만히 보세요', C.pink), setup.step(0));
  yield* waitFor(1.0);
  yield* all(cap.say('준비', '눈을 움직이지 않는 게 비법!', C.teal), setup.step(1));
  yield* waitFor(0.9);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([-230, -260]);
  setup.root().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(1);
  timer.count(16);
  timer.node().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TEST', '가운데 + 에서 눈을 떼지 마세요', C.pink);
  yield* timer.run(16, {
    11: () => cap.say('TEST', '점이 흐려지나요?', C.pink),
    6: () => cap.say('TEST', '계속 가운데만!', C.teal),
  });

  /* ═════════ 3. 확인 ═════════ */
  cue('chime');
  timer.node().opacity(0);
  yield* cap.say('!', '분홍 점이 사라졌나요?', C.amber);
  yield* waitFor(1.8);
  yield* cap.say('!', '눈을 깜빡하면\n다시 나타나요', C.teal);
  yield* waitFor(0.8);
  cue('pop');
  yield* sequence(0.05, ...dots.map(d => all(d.scale(1.15, 0.25).to(1, 0.3))));
  yield* waitFor(0.3);

  /* ═════════ 4. 왜? 신호 그래프 ═════════ */
  yield* iris.cover([0, TY]);
  test().opacity(0);
  dim().opacity(0);
  explain().opacity(1);
  yield* iris.reveal([0, -300]);
  yield* cap.say('01', '눈 세포는 "바뀌는 것"에\n크게 반응해요', C.amber);
  cue('swish');
  yield* all(curve().end(0.3, 0.8, easeOutExpo), stimBar().width(GW * 0.82, 3.2, linear), delay(0.4, tagNew().opacity(1, 0.3)));
  yield* all(cap.say('02', '계속 똑같으면\n신호를 점점 줄여요', C.teal), curve().end(1, 2.2, easeInOutCubic), delay(1.2, tagSame().opacity(1, 0.4)));
  yield* waitFor(0.9);

  yield* wipe.cover();
  explain().opacity(0);
  fillN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('03', '신호가 꺼진 빈자리는\n뇌가 주변 색으로 메워요', C.pink);
  cue('riser');
  yield* fillCover(1, 1.4, easeInOutCubic);
  yield* waitFor(1.0);

  yield* wipe.cover();
  fillN().opacity(0);
  edgeN().opacity(1);
  yield* wipe.reveal();
  yield* all(cap.say('04', '눈은 사실 조금씩 떨려요\n또렷한 점은 그때마다 "바뀜!"', C.teal), jig(4, 4, linear));
  yield* all(cap.say('04', '흐린 점은 떨려도 별 차이가 없어\n금방 사라져요', C.pink), jig(7, 3.4, linear));

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  edgeN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '눈의 비밀 다섯 편, 끝!', C.pink));
  yield* all(shine(card), sparks(view, [0, -420], C.pink, 14, 300));
  yield* waitFor(0.4);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 2부', '곁눈으로는\n글자를 못 읽는다?'));
  yield* waitFor(1.2);
  yield* finish(NAME, 0.3);
});
