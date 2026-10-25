import {Grid, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeInOutExpo, easeOutExpo, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  Dim,
  addAtmosphere,
  addCaption,
  addEnd,
  addEq,
  addFlash,
  addHud,
  addTitle,
  addWipe,
  begin,
  camTo,
  cue,
  finish,
  punch,
  ring,
  sparks,
} from '../motion';

const NAME = 'unitArea';
const S = 720; // 1m
const CELL = S / 100; // 1cm
const LEFT = -S / 2;
const TOP = -490;
const CY = TOP + S / 2;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 1, series: '넓이의 단위'});
  const title = addTitle(view, ['1m² 는', '왜 100cm² 가 아닐까?'], C.violet);

  const cam = createRef<Node>();
  const ruler = createRef<Node>();
  const rulerLine = createRef<Line>();
  const rulerTag = createRef<Txt>();
  const outline = createRef<Line>();
  const faint = createRef<Grid>();
  const dimTop = createRef<Node>();
  const dimLeft = createRef<Node>();
  const tiny = createRef<Rect>();
  const tinyTag = createRef<Txt>();
  const tinySide = createRef<Txt>();
  const rowBox = createRef<Rect>();
  const rowFill = createRef<Rect>();
  const allBox = createRef<Rect>();
  const rw = createSignal(0); // 첫 줄이 채워진 길이
  const h = createSignal(0); // 아래로 채워진 높이

  view.add(
    <Rect clip y={-130} width={1080} height={940}>
    <Node ref={cam} y={130}>
      {/* 1m 자: 1cm 눈금 100개 */}
      <Node ref={ruler} opacity={0}>
        {Array.from({length: 101}, (_, i) => (
          <Line
            points={[[LEFT + i * CELL, TOP], [LEFT + i * CELL, TOP + (i % 10 === 0 ? 34 : 14)]]}
            stroke={i % 10 === 0 ? C.ink : C.dim}
            lineWidth={i % 10 === 0 ? 3 : 1.5}
          />
        ))}
      </Node>
      <Line ref={rulerLine} points={[[LEFT, TOP], [LEFT + S, TOP]]} stroke={C.ink} lineWidth={6} end={0} />
      <Txt ref={rulerTag} y={TOP - 56} text="1m = 100cm" fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.ink} opacity={0} />

      {/* 1m × 1m 정사각형 */}
      <Grid ref={faint} y={CY} width={S} height={S} spacing={CELL} stroke={'#ffffff'} lineWidth={1} opacity={0} />
      {/* 아래로 채우기 (100줄) */}
      <Rect ref={allBox} clip y={() => TOP + h() / 2} width={S} height={h}>
        <Node y={() => S / 2 - h() / 2}>
          <Rect width={S} height={S} fill={C.amber + '66'} />
          <Grid width={S} height={S} spacing={CELL} stroke={'#FFE3A0'} lineWidth={1} />
        </Node>
      </Rect>
      {/* 첫 줄 채우기 */}
      <Rect ref={rowBox} clip x={() => LEFT + rw() / 2} y={TOP + CELL / 2} width={rw} height={CELL}>
        <Node x={() => S / 2 - rw() / 2} y={S / 2 - CELL / 2}>
          <Rect ref={rowFill} width={S} height={S} fill={C.amber + 'cc'} />
          <Grid width={S} height={S} spacing={CELL} stroke={'#3a2a00'} lineWidth={0.6} />
        </Node>
      </Rect>
      <Line
        ref={outline}
        points={[[LEFT, TOP], [LEFT + S, TOP], [LEFT + S, TOP + S], [LEFT, TOP + S], [LEFT, TOP]]}
        stroke={C.ink}
        lineWidth={6}
        end={0}
        shadowColor={C.violet}
        shadowBlur={24}
      />
      <Dim from={[LEFT, TOP - 44]} to={[LEFT + S, TOP - 44]} label="1m" color={C.teal} refs={{node: n => dimTop(n)}} />
      <Dim from={[LEFT - 44, TOP]} to={[LEFT - 44, TOP + S]} label="1m" color={C.pink} side={[-54, 0]} refs={{node: n => dimLeft(n)}} />

      {/* 1cm² 한 칸 (확대해서 본다) */}
      <Rect ref={tiny} x={LEFT + CELL / 2} y={TOP + CELL / 2} width={CELL} height={CELL} fill={C.amber} stroke={'#ffffff'} lineWidth={0.5} opacity={0} />
      <Txt ref={tinyTag} x={LEFT + CELL * 2.2} y={TOP + CELL * 1.6} offsetX={-1} text={'← 1cm²'} fontFamily={FONT} fontSize={6.5} fontWeight={900} fill={C.amber} opacity={0} />
      <Txt ref={tinySide} x={LEFT + CELL / 2} y={TOP + CELL * 1.75} text={'1cm'} fontFamily={FONT} fontSize={4.2} fontWeight={900} fill={C.ink} opacity={0} />
    </Node>
    </Rect>,
  );

  // 세는 글자
  const counter = createRef<Txt>();
  const rows = () => Math.max(1, Math.min(100, Math.round(h() / CELL)));
  view.add(
    <Txt
      ref={counter}
      y={300}
      text={() => `${rows()}줄 × 100 = ${rows() * 100}`}
      fontFamily={FONT}
      fontSize={76}
      fontWeight={900}
      fill={C.ink}
      shadowColor={C.amber + '77'}
      shadowBlur={26}
      opacity={0}
    />,
  );
  const rowCount = createRef<Txt>();
  view.add(
    <Txt
      ref={rowCount}
      y={300}
      text={() => `${Math.round(rw() / CELL)}개`}
      fontFamily={FONT}
      fontSize={84}
      fontWeight={900}
      fill={C.amber}
      shadowColor={C.amber + '77'}
      shadowBlur={26}
      opacity={0}
    />,
  );

  const eq = addEq(view, 300, 84);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 길이: 1m = 100cm
  cue('whoosh');
  yield* rulerLine().end(1, 0.8, easeOutExpo);
  yield* all(ruler().opacity(1, 0.5), rulerTag().opacity(1, 0.5));
  yield* cap.say('01', '길이는 1m = 100cm');
  yield* waitFor(1.4);

  // 2. 1m² = 한 변이 1m 인 정사각형
  yield* all(rulerTag().opacity(0, 0.3), cap.say('02', '1m² 는 한 변이 1m 인\n정사각형의 넓이', C.violet));
  cue('swish');
  yield* all(outline().end(1, 1.1, easeInOutCubic), ruler().opacity(0, 0.6));
  yield* all(dimTop().opacity(1, 0.4), dimLeft().opacity(1, 0.4));
  yield* waitFor(1.2);

  // 3. 1cm² 는? → 확대
  yield* cap.say('03', '1cm² 는 한 변이 1cm 인\n아주 작은 정사각형', C.amber);
  yield* all(faint().opacity(0.16, 0.6), tiny().opacity(1, 0.4), dimTop().opacity(0, 0.4), dimLeft().opacity(0, 0.4));
  cue('whoosh');
  const Z = 7;
  yield* camTo(cam(), Z, [-(LEFT + CELL * 3) * Z, -150 - (TOP + CELL * 2) * Z + 130], 1.3);
  yield* all(tinyTag().opacity(1, 0.4), tinySide().opacity(1, 0.4));
  cue('pop');
  yield* waitFor(1.4);
  yield* all(tinyTag().opacity(0, 0.3), tinySide().opacity(0, 0.3));
  cue('whoosh');
  yield* camTo(cam(), 1, [0, 130], 1.1);
  tiny().opacity(0);
  yield* all(dimTop().opacity(1, 0.3), dimLeft().opacity(1, 0.3));

  // 4. 한 줄에 100개
  yield* cap.say('04', '1cm² 가 한 줄에 몇 개?', C.amber);
  rw(CELL);
  yield* rowCount().opacity(1, 0.3);
  cue('riser');
  yield* rw(S, 1.8, easeInOutCubic);
  cue('pop');
  yield* punch(rowCount(), 0.12);
  yield* waitFor(0.8);

  // 5. 100cm² 는 겨우 이 한 줄
  cue('boom');
  yield* all(
    cap.say('05', '100cm² 는 겨우 이 한 줄!', C.coral),
    rowFill().fill(C.coral + 'ee', 0.4),
    rowCount().opacity(0, 0.3),
    punch(cam(), 0.03),
  );
  yield* eq.set('100cm² = 한 줄뿐', C.coral, C.coral);
  yield* waitFor(1.6);

  // 6. 그런 줄이 100 줄
  yield* all(eq.hide(), cap.say('06', '그런 줄이 아래로 100줄!', C.amber));
  yield* rowFill().fill(C.amber + 'cc', 0.3);
  h(CELL);
  yield* counter().opacity(1, 0.3);
  cue('riser');
  yield* h(S, 3.4, linear);
  cue('boom');
  yield* all(flash(0.16), sparks(view, [0, CY], C.amber, 16, 260), punch(cam(), 0.04));
  yield* waitFor(0.6);
  yield* all(counter().opacity(0, 0.3), eq.set('100 × 100 = 10000', C.ink, C.amber));
  cue('chime');
  yield* all(cap.say('07', '1m² = 10000cm²!', C.amber), ring(view, [0, 300], C.amber, 420));
  yield* waitFor(1.8);

  // 7. 정리
  yield* cap.say('08', '넓이는 가로도 100배, 세로도 100배\n그래서 100 × 100 배', C.teal);
  yield* all(dimTop().opacity(0.35, 0.3).to(1, 0.4), dimLeft().opacity(0.35, 0.3).to(1, 0.4));
  yield* waitFor(2.4);

  // 끝 카드
  yield* wipe.cover();
  cam().opacity(0);
  eq.node().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('기억해요', '1m² = 10000cm²\n(100cm² 가 아니에요)');
  yield* waitFor(2.6);
  yield* finish(NAME);
});
