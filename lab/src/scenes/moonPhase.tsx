import {Circle, Line, Node, Path, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeOutExpo, linear, sequence, waitFor} from '@motion-canvas/core';
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
  punch,
  shine,
  sparks,
} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';

// 과학 시즌 S4 — 달 모양은 왜 바뀔까?
// 1) 흔한 오해: 지구 그림자가 가려서 → 아니다 (그건 가끔 일어나는 월식)
// 2) 위에서 보면 달은 늘 해 쪽 반이 밝다. 달이 지구 둘레를 도는 동안 지구에서 보이는 밝은 쪽의 양이 바뀐다
// 3) 초승달 → 상현달 → 보름달 → 하현달 → 그믐달, 한 바퀴 약 한 달. 집 실험: 스탠드 앞에서 공 들고 돌기
// 위상 p: 0 삭 · 0.25 상현 · 0.5 보름 · 0.75 하현 (북반구에서 보는 모양, 차오를 때 오른쪽이 밝다)

const NAME = 'moonPhase';
const MOON = '#F4EBC8';
const DARKM = '#2A2F48';

// 지구에서 본 달 모양 (반지름 R)
function phasePath(p: number, R: number) {
  const q = ((p % 1) + 1) % 1;
  const waxing = q < 0.5;
  const rx = Math.abs(Math.cos(2 * Math.PI * q)) * R;
  const crescent = q < 0.25 || q > 0.75;
  if (waxing) {
    const sw = crescent ? 0 : 1;
    return `M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${rx} ${R} 0 0 ${sw} 0 ${-R} Z`;
  }
  const sw = crescent ? 1 : 0;
  return `M 0 ${-R} A ${R} ${R} 0 0 0 0 ${R} A ${rx} ${R} 0 0 ${sw} 0 ${-R} Z`;
}
function phaseName(p: number) {
  const q = ((p % 1) + 1) % 1;
  if (q < 0.04 || q > 0.96) return '삭 (안 보여요)';
  if (q < 0.21) return '초승달';
  if (q < 0.29) return '상현달 (반달)';
  if (q < 0.46) return '점점 차올라요';
  if (q < 0.54) return '보름달';
  if (q < 0.71) return '점점 줄어요';
  if (q < 0.79) return '하현달 (반달)';
  return '그믐달';
}

function MoonFace(o: {p: () => number; R?: number}) {
  const R = o.R ?? 90;
  return (
    <Node>
      <Circle size={R * 2} fill={DARKM} />
      <Path data={() => phasePath(o.p(), R)} fill={MOON} shadowColor={MOON} shadowBlur={24} />
    </Node>
  );
}

// 위에서 본 공: 왼쪽(해 쪽) 반이 밝다
function HalfLit(o: {size: number; lit: string; dark: string}) {
  return (
    <Node>
      <Circle size={o.size} fill={o.dark} />
      <Circle size={o.size} startAngle={90} endAngle={270} closed fill={o.lit} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 0. 훅: 달 모양이 바뀐다 */
  const hookN = createRef<Node>();
  const hp = createSignal(0.08);
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      <MoonFace p={hp} R={150} />
    </Node>,
  );

  /* 1. 오해 */
  const quizN = createRef<Node>();
  view.add(
    <Node ref={quizN} y={-300} opacity={0}>
      <HalfLit size={150} lit={'#3B7BE8'} dark={'#1A3260'} />
      <Line points={[[0, -75], [420, -40], [420, 40], [0, 75]]} closed fill={'#00000088'} />
      <Node x={380}>
        <Circle size={110} fill={'#B0553A'} />
      </Node>
      <Txt y={170} text={'지구 그림자가 달을 가리면 = 월식 (가끔만!)'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.coral} />
    </Node>,
  );

  /* 2. 위에서 본 해 · 지구 · 달 + 지구에서 본 달 */
  const topN = createRef<Node>();
  const p = createSignal(0.12);
  const OR = 250;
  const moonXY = (): [number, number] => {
    const phi = Math.PI - 2 * Math.PI * p();
    return [OR * Math.cos(phi), OR * Math.sin(phi)];
  };
  const ghosts = createRef<Node>();
  const viewLine = createRef<Line>();
  view.add(
    <Node ref={topN} y={-430} opacity={0}>
      {/* 햇빛 */}
      {[-200, -100, 0, 100, 200].map(y => (
        <Line points={[[-520, y], [-400, y]]} stroke={'#FFC24B'} lineWidth={6} endArrow arrowSize={16} opacity={0.8} />
      ))}
      <Txt x={-460} y={-270} text={'햇빛'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={'#FFC24B'} />
      <Circle size={OR * 2} stroke={'#ffffff2a'} lineWidth={3} lineDash={[10, 10]} />
      {/* 늘 왼쪽 반이 밝은 달들 (여러 자리) */}
      <Node ref={ghosts} opacity={0}>
        {Array.from({length: 8}, (_, k) => {
          const phi = (k / 8) * Math.PI * 2;
          return (
            <Node x={OR * Math.cos(phi)} y={OR * Math.sin(phi)}>
              <HalfLit size={56} lit={MOON} dark={DARKM} />
            </Node>
          );
        })}
      </Node>
      <HalfLit size={110} lit={'#3B7BE8'} dark={'#1A3260'} />
      <Txt y={90} text={'지구'} fontFamily={FONT} fontSize={30} fontWeight={900} fill={C.ink} />
      <Line ref={viewLine} points={() => [[0, 0], moonXY()]} stroke={C.teal} lineWidth={3} lineDash={[8, 8]} opacity={0} />
      <Node x={() => moonXY()[0]} y={() => moonXY()[1]}>
        <HalfLit size={70} lit={MOON} dark={DARKM} />
      </Node>
    </Node>,
  );
  const insetN = createRef<Node>();
  view.add(
    <Node ref={insetN} y={150} opacity={0}>
      <Txt x={-170} text={'지구에서 보면'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
      <Node x={60}>
        <MoonFace p={p} R={80} />
      </Node>
      <Txt x={170} offsetX={-1} text={() => phaseName(p())} fontFamily={FONT} fontSize={40} fontWeight={900} fill={MOON} />
    </Node>,
  );

  /* 3. 집 실험: 스탠드 + 공 */
  const homeN = createRef<Node>();
  const turn = createSignal(0);
  view.add(
    <Node ref={homeN} y={-320} opacity={0}>
      <Rect x={-340} y={60} width={20} height={240} fill={C.dim} />
      <Line points={[[-340, -60], [-260, -120], [-200, -80]]} stroke={C.dim} lineWidth={14} lineCap="round" />
      <Circle x={-200} y={-70} size={60} fill={'#FFE08A'} shadowColor={'#FFC24B'} shadowBlur={40} />
      <Circle x={120} y={20} size={150} fill={'#3a3150'} stroke={C.ink} lineWidth={4} />
      <Node x={120} y={20} rotation={() => turn()}>
        <Line points={[[0, 0], [0, -190]]} stroke={'#C98E6A'} lineWidth={14} lineCap="round" />
        <Node y={-210} rotation={() => -turn()}>
          <HalfLit size={70} lit={MOON} dark={DARKM} />
        </Node>
      </Node>
      <Txt y={250} text={'어두운 방, 스탠드 하나, 공 하나'} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.ink} />
    </Node>,
  );

  const card = bigCard('달은 늘 반쪽이 밝아요', C.violet, 62);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['달 모양은', '왜 바뀔까?'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 2, total: 2, series: '지구와 달', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.violet);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5), hp(0.5, 2.0, easeInOutCubic));
  yield* all(title.dock(), hp(0.9, 1.0, easeInOutCubic));
  yield* all(hookN().opacity(0, 0.5), hookN().scale(1.4, 0.5));
  hookN().remove();

  /* ═════════ 1. 오해 ═════════ */
  yield* arrive(quizN(), 0.8);
  yield* cap.say('퀴즈', '달 모양은\n지구 그림자 때문에 바뀔까요?', C.violet);
  yield* waitFor(1.2);
  cue('boom');
  yield* all(cap.say('땡!', '아니에요! 그림자가 가리는 건\n가끔 일어나는 "월식"', C.coral), shake(quizN(), 10, 0.4));
  yield* waitFor(1.8);

  /* ═════════ 2. 위에서 보기 ═════════ */
  yield* wipe.cover();
  quizN().opacity(0);
  title.group().opacity(0);
  topN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('01', '위에서 내려다보면\n달은 늘 해 쪽 반이 밝아요', C.amber);
  cue('pop');
  yield* popIn(ghosts(), 0.6, 0.8);
  yield* waitFor(1.4);
  yield* all(ghosts().opacity(0.25, 0.4), cap.say('02', '달이 지구 둘레를 돌면\n지구에서 보이는 밝은 쪽이 달라져요', C.teal), popIn(insetN(), 0.5, 0.7), viewLine().opacity(1, 0.4));
  yield* waitFor(1.6);

  /* ═════════ 3. 한 바퀴 ═════════ */
  cue('swish');
  yield* all(p(0.25, 1.6, easeInOutCubic), cap.say('03', '초승달 → 반달', C.amber));
  yield* waitFor(0.8);
  yield* all(p(0.5, 1.8, easeInOutCubic), delay(1.0, cap.say('04', '해 반대쪽에 오면 보름달!', MOON)));
  cue('chime');
  yield* all(punch(insetN(), 0.06), waitFor(1.0));
  yield* all(p(0.75, 1.6, easeInOutCubic), cap.say('05', '다시 반달', C.teal));
  yield* waitFor(0.6);
  yield* all(p(0.95, 1.4, easeInOutCubic), cap.say('06', '그믐달 → 안 보이다가 다시 초승달', C.violet));
  yield* waitFor(0.8);
  yield* cap.say('07', '한 바퀴 도는 데 약 한 달!', C.amber);
  yield* p(1.12, 1.0, easeInOutCubic);
  yield* waitFor(0.8);

  /* ═════════ 4. 집 실험 ═════════ */
  yield* wipe.cover();
  topN().opacity(0);
  insetN().opacity(0);
  homeN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('집 실험', '스탠드를 보고 공을 든 채\n제자리에서 천천히 돌아요', C.teal);
  yield* turn(-360, 4.2, linear);
  yield* cap.say('집 실험', '공에 비친 밝은 쪽이\n달처럼 바뀌어요', C.amber);
  yield* waitFor(1.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  homeN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '바뀌는 건 우리가 보는 각도예요', C.violet));
  yield* all(shine(card), sparks(view, [0, -420], C.violet, 14, 300));
  yield* waitFor(0.8);
  yield* all(cap.hide(), end.show('NEXT', '자석을 반으로\n자르면?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
