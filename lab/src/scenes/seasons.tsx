import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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
  punch,
  shine,
  sparks,
} from '../motion';
import {addBokeh, addGlitchTitle, addIris, arrive, shake, streak} from '../fx';

// 과학 시즌 S3 — 여름은 왜 더울까? (계절)
// 1) 흔한 오해: 해와 가까워서 → 아니다. 지구가 해와 가장 가까운 때는 1월 초(우리나라 한겨울)이고, 거리 차이도 아주 작다
// 2) 진짜 이유: 지구가 기울어진 채로 돈다 → 여름엔 우리나라가 해 쪽으로 기울어 햇빛을 높이(똑바로) 받는다
// 3) 손전등: 똑바로 비추면 좁고 밝게, 비스듬히 비추면 넓고 흐리게 → 한 칸이 받는 빛이 다르다. 여름엔 낮도 길다
// 수치는 교과서 수준만: 기울기 약 23.5°

const NAME = 'seasons';
const SUN = '#FFC24B';
const SEA = '#3B7BE8';
const LAND = '#3DBE5A';

function Sun(o: {size?: number}) {
  const s = o.size ?? 180;
  return (
    <Node>
      <Circle
        size={s * 2.4}
        fill={
          new Gradient({
            type: 'radial',
            from: [0, 0],
            to: [0, 0],
            fromRadius: 0,
            toRadius: s * 1.2,
            stops: [
              {offset: 0, color: SUN + 'aa'},
              {offset: 0.45, color: SUN + '33'},
              {offset: 1, color: SUN + '00'},
            ],
          })
        }
      />
      <Circle size={s} fill={'#FFE08A'} shadowColor={SUN} shadowBlur={40} />
    </Node>
  );
}

// 기울어진 지구: 축 · 적도 · 우리나라 점, sunDir 쪽 반이 밝다
function Earth(o: {size?: number; tilt?: number; lit: 'left' | 'right'; korea?: boolean}) {
  const s = o.size ?? 170;
  return (
    <Node>
      <Circle size={s} fill={SEA} clip>
        <Node rotation={o.tilt ?? 23.5}>
          <Circle x={-s * 0.1} y={-s * 0.18} size={s * 0.42} fill={LAND} />
          <Line points={[[-s / 2, 0], [s / 2, 0]]} stroke={'#ffffff66'} lineWidth={3} lineDash={[8, 6]} />
        </Node>
        {/* 밤쪽 그늘 */}
        <Rect x={o.lit === 'left' ? s / 4 : -s / 4} width={s / 2} height={s} fill={'#000000'} opacity={0.5} />
      </Circle>
      <Node rotation={o.tilt ?? 23.5}>
        <Line points={[[0, -s * 0.78], [0, s * 0.78]]} stroke={C.ink} lineWidth={5} />
        {o.korea ? <Circle x={s * 0.12} y={-s * 0.26} size={22} fill={C.coral} stroke={'#fff'} lineWidth={3} /> : null}
      </Node>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 0. 훅: 해를 도는 지구 */
  const hookN = createRef<Node>();
  const ang = createSignal(0);
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      <Sun size={150} />
      <Circle size={[720, 300]} stroke={'#ffffff33'} lineWidth={3} lineDash={[10, 10]} />
      <Circle x={() => 360 * Math.cos(ang())} y={() => 150 * Math.sin(ang())} size={70} fill={SEA} stroke={'#fff'} lineWidth={3} />
    </Node>,
  );

  /* 1. 오해: 해와 가까워서? */
  const orbitN = createRef<Node>();
  const tagNear = createRef<Node>();
  const tagFar = createRef<Node>();
  const oA = createSignal(0);
  const RX = 400;
  const RY = 170;
  const FOC = 90; // 해를 가운데에서 조금 비켜 (과장)
  view.add(
    <Node ref={orbitN} y={-300} opacity={0}>
      <Circle size={[RX * 2, RY * 2]} stroke={'#ffffff33'} lineWidth={3} lineDash={[10, 10]} />
      <Node x={-FOC}>
        <Sun size={130} />
      </Node>
      <Circle x={() => RX * Math.cos(oA())} y={() => RY * Math.sin(oA())} size={70} fill={SEA} stroke={'#fff'} lineWidth={3} />
      <Node ref={tagNear} x={-RX} y={-RY - 60} opacity={0}>
        <Txt text={'1월: 해와 가장 가까움'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.teal} offsetX={-1} x={-40} />
        <Txt y={50} x={-40} offsetX={-1} text={'→ 우리나라는 한겨울!'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.ink} />
      </Node>
      <Node ref={tagFar} x={RX} y={RY + 60} opacity={0}>
        <Txt text={'7월: 가장 멂 → 한여름'} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.coral} offsetX={1} x={40} />
      </Node>
      <Txt y={RY + 150} text={'(그림은 크게 부풀린 것 · 실제 거리 차이는 아주 작아요)'} fontFamily={FONT} fontSize={28} fontWeight={700} fill={C.dim} />
    </Node>,
  );

  /* 2. 기울어진 지구: 6월 · 12월 */
  const tiltN = createRef<Node>();
  const juneN = createRef<Node>();
  const decN = createRef<Node>();
  const rays = createRef<Node>();
  view.add(
    <Node ref={tiltN} y={-300} opacity={0}>
      <Sun size={150} />
      <Node ref={juneN} x={-330} opacity={0}>
        <Earth lit={'right'} korea />
        <Txt y={150} text={'6월'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.coral} />
        <Txt y={200} text={'우리나라가 해 쪽으로'} fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.ink} />
      </Node>
      <Node ref={decN} x={330} opacity={0}>
        <Earth lit={'left'} korea />
        <Txt y={150} text={'12월'} fontFamily={FONT} fontSize={42} fontWeight={900} fill={C.teal} />
        <Txt y={200} text={'우리나라가 해 반대쪽으로'} fontFamily={FONT} fontSize={30} fontWeight={800} fill={C.ink} />
      </Node>
      <Node ref={rays} opacity={0}>
        <Txt y={-200} text={'축은 늘 같은 쪽으로 약 23.5° 기울어 있어요'} fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.amber} />
      </Node>
    </Node>,
  );

  /* 3. 손전등: 똑바로 vs 비스듬히 */
  const torchN = createRef<Node>();
  const tA = createRef<Node>();
  const tB = createRef<Node>();
  const GRID = 6;
  const CELL = 60;
  const Panel = (o: {slant: boolean; refFn: (n: Node) => void; x: number}) => {
    const w = o.slant ? 4 : 2; // 빛이 덮는 칸 수 (가로)
    return (
      <Node ref={o.refFn} x={o.x} opacity={0}>
        {/* 바닥 칸 */}
        {Array.from({length: GRID}, (_, k) => (
          <Rect x={(k - (GRID - 1) / 2) * CELL} y={160} width={CELL - 4} height={40} fill={'#ffffff14'} />
        ))}
        {/* 빛 */}
        <Line
          points={
            o.slant
              ? [[-160, -260], [-110, -300], [CELL * 2, 140], [-CELL * 2, 140]]
              : [[-25, -260], [25, -260], [CELL, 140], [-CELL, 140]]
          }
          closed
          fill={SUN + '44'}
        />
        <Rect y={160} width={w * CELL - 4} height={40} fill={SUN} opacity={o.slant ? 0.5 : 1} shadowColor={SUN} shadowBlur={o.slant ? 10 : 30} />
        {/* 손전등 */}
        <Rect x={o.slant ? -135 : 0} y={o.slant ? -300 : -300} rotation={o.slant ? -38 : 0} width={60} height={110} radius={10} fill={'#5B6380'} stroke={C.ink} lineWidth={4} />
        <Txt y={240} text={o.slant ? `${w}칸에 나눠 받음` : `${w}칸에 모아 받음`} fontFamily={FONT} fontSize={36} fontWeight={900} fill={o.slant ? C.dim : C.amber} />
        <Txt y={-380} text={o.slant ? '비스듬히 (겨울)' : '똑바로 (여름)'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={o.slant ? C.teal : C.coral} />
      </Node>
    );
  };
  view.add(
    <Node ref={torchN} y={-230}>
      <Panel slant={false} x={-250} refFn={n => tA(n)} />
      <Panel slant={true} x={250} refFn={n => tB(n)} />
    </Node>,
  );

  /* 4. 해의 높이와 낮의 길이 */
  const skyN = createRef<Node>();
  const sunT = createSignal(0);
  const season = createSignal(1); // 1 여름, 0 겨울
  const GY = 180;
  const sunPos = (): [number, number] => {
    const h = 260 + 220 * season(); // 한낮 높이
    const half = 300 + 90 * season(); // 낮 길이(가로 폭)
    const u = sunT();
    return [-half + 2 * half * u, GY - h * Math.sin(Math.PI * u)];
  };
  view.add(
    <Node ref={skyN} y={-330} opacity={0}>
      <Line points={[[-460, GY], [460, GY]]} stroke={LAND} lineWidth={8} />
      <Line
        points={() => Array.from({length: 41}, (_, i) => {
          const h = 260 + 220 * season();
          const half = 300 + 90 * season();
          const u = i / 40;
          return [-half + 2 * half * u, GY - h * Math.sin(Math.PI * u)] as [number, number];
        })}
        stroke={SUN + '88'}
        lineWidth={4}
        lineDash={[10, 10]}
      />
      <Circle x={() => sunPos()[0]} y={() => sunPos()[1]} size={80} fill={'#FFE08A'} shadowColor={SUN} shadowBlur={30} />
      <Txt y={GY + 60} text={() => (season() > 0.5 ? '여름: 해가 높고 낮이 길어요' : '겨울: 해가 낮고 낮이 짧아요')} fontFamily={FONT} fontSize={40} fontWeight={900} fill={() => (season() > 0.5 ? C.coral : C.teal)} />
    </Node>,
  );

  const card = bigCard('햇빛을 똑바로 받으면 여름', C.amber, 60);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['여름은', '왜 더울까?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 2, series: '지구와 달', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5), ang(Math.PI * 2, 2.2, linear));
  yield* all(title.dock(), hookN().opacity(0, 0.6), hookN().scale(1.3, 0.6));
  hookN().remove();

  /* ═════════ 1. 오해 ═════════ */
  yield* arrive(orbitN(), 0.8);
  yield* cap.say('퀴즈', '여름엔 지구가\n해와 더 가까워서 더울까요?', C.amber);
  yield* waitFor(1.2);
  cue('boom');
  yield* all(cap.say('땡!', '아니에요!', C.coral), shake(orbitN(), 10, 0.4));
  cue('swish');
  yield* all(oA(Math.PI, 1.4, easeInOutCubic), delay(0.6, popIn(tagNear(), 0.5, 0.6)));
  yield* cap.say('땡!', '해와 가장 가까운 때는 1월 초\n우리나라는 한겨울이에요', C.teal);
  yield* waitFor(1.4);
  cue('swish');
  yield* all(oA(Math.PI * 2, 1.4, easeInOutCubic), delay(0.6, popIn(tagFar(), 0.5, 0.6)));
  yield* waitFor(1.0);

  /* ═════════ 2. 진짜 이유: 기울기 ═════════ */
  yield* wipe.cover();
  orbitN().opacity(0);
  tiltN().opacity(1);
  title.group().opacity(0);
  yield* wipe.reveal();
  yield* cap.say('01', '진짜 이유는\n기울어진 지구!', C.amber);
  cue('pop');
  yield* all(popIn(juneN(), 0.5, 0.6), delay(0.3, popIn(decN(), 0.5, 0.6)), delay(0.5, rays().opacity(1, 0.5)));
  yield* waitFor(1.2);
  yield* cap.say('02', '6월엔 우리나라가\n해 쪽으로 기울어요', C.coral);
  yield* punch(juneN(), 0.1);
  yield* waitFor(1.2);

  /* ═════════ 3. 손전등 ═════════ */
  yield* wipe.cover();
  tiltN().opacity(0);
  yield* wipe.reveal();
  yield* all(cap.say('03', '손전등으로 보면\n똑바로 비추면 좁고 밝게', C.coral), popIn(tA(), 0.5, 0.7));
  yield* waitFor(1.4);
  yield* all(cap.say('04', '비스듬히 비추면\n넓고 흐리게 퍼져요', C.teal), popIn(tB(), 0.5, 0.7));
  yield* waitFor(1.4);
  cue('chime');
  yield* all(cap.say('05', '같은 빛인데 한 칸이 받는 빛이\n여름엔 많고, 겨울엔 적어요', C.amber), punch(tA(), 0.08));
  yield* waitFor(2.0);

  /* ═════════ 4. 해의 높이 · 낮의 길이 ═════════ */
  yield* wipe.cover();
  torchN().opacity(0);
  skyN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('06', '여름엔 한낮의 해가 높이 떠서\n햇빛을 똑바로 받아요', C.coral);
  cue('riser');
  yield* sunT(1, 2.4, easeInOutCubic);
  yield* cap.say('07', '낮도 길어서\n오래오래 데워져요', C.amber);
  yield* waitFor(1.2);
  cue('swish');
  yield* all(season(0, 0.8, easeInOutCubic), sunT(0, 0.8, easeInOutCubic), cap.say('08', '겨울엔 해가 낮게 뜨고\n낮도 짧아요', C.teal));
  yield* sunT(1, 1.8, easeInOutCubic);
  yield* waitFor(0.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  skyN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('집 실험', '어두운 방에서 손전등을\n종이에 똑바로 · 비스듬히!', C.amber));
  yield* all(shine(card), sparks(view, [0, -420], C.amber, 14, 300));
  yield* waitFor(1.2);
  yield* all(cap.hide(), end.show('NEXT  지구와 달', '달 모양은\n왜 바뀔까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
