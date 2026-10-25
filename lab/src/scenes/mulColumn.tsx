import {Grid, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
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

const NAME = 'mulColumn';
const U = 36; // 한 칸
const W = 13 * U;
const H = 12 * U;
const X0 = -W / 2;
const Y0 = -H / 2;
const STAGE_Y = -170;

// 네 조각: 가로 [0,10)|[10,13), 세로 [0,10)|[10,12)
const PIECES = [
  {c0: 0, c1: 10, r0: 0, r1: 10, color: C.amber, label: '10×10\n= 100', dx: -1, dy: -1},
  {c0: 10, c1: 13, r0: 0, r1: 10, color: C.teal, label: '3×10\n= 30', dx: 1, dy: -1},
  {c0: 0, c1: 10, r0: 10, r1: 12, color: C.violet, label: '10×2 = 20', dx: -1, dy: 1},
  {c0: 10, c1: 13, r0: 10, r1: 12, color: C.coral, label: '6', dx: 1, dy: 1},
];
const GAP = 26;

// 세로셈 숫자 칸 (오른쪽 맞춤)
const COL = 64;
const ROW = 92;

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['13 × 12 세로셈,', '왜 이렇게 할까?'], C.teal);

  const cam = createRef<Node>();
  const rectBox = createRef<Rect>();
  const outline = createRef<Line>();
  const cutV = createRef<Line>();
  const cutH = createRef<Line>();
  const pieces: Rect[] = [];
  const labels: Txt[] = [];
  const dimW = createRef<Node>();
  const dimH = createRef<Node>();

  view.add(
    <Node ref={cam} y={STAGE_Y}>
      <Rect ref={rectBox} opacity={0}>
        {PIECES.map((p, i) => (
          <Rect
            ref={el => (pieces[i] = el)}
            x={X0 + ((p.c0 + p.c1) / 2) * U}
            y={Y0 + ((p.r0 + p.r1) / 2) * U}
            width={(p.c1 - p.c0) * U}
            height={(p.r1 - p.r0) * U}
            fill={p.color + '00'}
            stroke={p.color + '00'}
            lineWidth={4}
            shadowColor={p.color}
            shadowBlur={0}
            clip
          >
            <Grid width={(p.c1 - p.c0) * U} height={(p.r1 - p.r0) * U} spacing={U} stroke={'#ffffff30'} lineWidth={1.5} />
            <Txt
              ref={el => (labels[i] = el)}
              text={p.label}
              fontFamily={FONT}
              fontSize={i === 3 ? 40 : 38}
              fontWeight={900}
              lineHeight={48}
              textAlign="center"
              fill={'#ffffff'}
              shadowColor={'#000000cc'}
              shadowBlur={12}
              opacity={0}
            />
          </Rect>
        ))}
        <Line
          ref={outline}
          points={[[X0, Y0], [X0 + W, Y0], [X0 + W, Y0 + H], [X0, Y0 + H]]}
          closed
          stroke={C.ink}
          lineWidth={5}
          end={0}
        />
        <Line ref={cutV} points={[[X0 + 10 * U, Y0 - 30], [X0 + 10 * U, Y0 + H + 30]]} stroke={C.pink} lineWidth={5} lineDash={[16, 10]} end={0} shadowColor={C.pink} shadowBlur={16} />
        <Line ref={cutH} points={[[X0 - 30, Y0 + 10 * U], [X0 + W + 30, Y0 + 10 * U]]} stroke={C.pink} lineWidth={5} lineDash={[16, 10]} end={0} shadowColor={C.pink} shadowBlur={16} />
      </Rect>
      <Dim from={[X0, Y0 - 50]} to={[X0 + W, Y0 - 50]} label="13" color={C.teal} refs={{node: n => dimW(n)}} />
      <Dim from={[X0 - 50, Y0]} to={[X0 - 50, Y0 + H]} label="12" color={C.pink} side={[-50, 0]} refs={{node: n => dimH(n)}} />
    </Node>,
  );

  // 세로셈 (오른쪽)
  const calc = createRef<Node>();
  const rows: Node[] = [];
  const bars: Rect[] = [];
  const notes: Txt[] = [];
  const digitRow = (s: string, color: string) =>
    s.split('').map((ch, k) => (
      <Txt
        x={-(s.length - 1 - k) * COL}
        text={ch}
        fontFamily={FONT}
        fontSize={86}
        fontWeight={900}
        fill={color}
        offsetX={0}
      />
    ));
  const CALC_ROWS: {s: string; color: string; y: number}[] = [
    {s: '13', color: C.ink, y: 0},
    {s: '×12', color: C.ink, y: ROW},
    {s: '26', color: C.violet, y: ROW * 2 + 30},
    {s: '130', color: C.amber, y: ROW * 3 + 30},
    {s: '156', color: C.ink, y: ROW * 4 + 60},
  ];
  view.add(
    <Node ref={calc} x={330} y={-470} opacity={0}>
      {CALC_ROWS.map((r, i) => (
        <Node ref={el => (rows[i] = el)} y={r.y} opacity={0}>
          {digitRow(r.s, r.color)}
        </Node>
      ))}
      {[ROW * 1.5 + 14, ROW * 3.5 + 44].map((y, i) => (
        <Rect ref={el => (bars[i] = el)} x={-COL} y={y} width={0} height={6} radius={3} fill={C.ink} />
      ))}
      <Txt ref={el => (notes[0] = el)} x={-COL * 3 - 20} y={ROW * 2 + 30} offsetX={1} text={'13×2'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.violet} opacity={0} />
      <Txt ref={el => (notes[1] = el)} x={-COL * 3 - 20} y={ROW * 3 + 30} offsetX={1} text={'13×10'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.amber} opacity={0} />
    </Node>,
  );

  const eq = addEq(view, 225, 80);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 13 × 12 = 직사각형
  rectBox().opacity(1);
  cue('whoosh');
  yield* all(
    outline().end(1, 1, easeInOutExpo),
    ...pieces.map(p => all(p.fill('#FFFFFF10', 0.8), p.stroke('#ffffff00', 0.8))),
  );
  yield* all(dimW().opacity(1, 0.4), dimH().opacity(1, 0.4));
  yield* cap.say('01', '13 × 12 는 가로 13, 세로 12\n직사각형의 넓이');
  yield* waitFor(1.4);

  // 2. 10 에서 자르기
  yield* cap.say('02', '10 이 있는 곳에서 잘라요', C.pink);
  cue('swish');
  yield* cutV().end(1, 0.6, easeOutExpo);
  cue('swish');
  yield* cutH().end(1, 0.6, easeOutExpo);
  yield* all(
    ...pieces.map(p =>
      all(p.fill(PIECES[pieces.indexOf(p)].color + '55', 0.5), p.stroke(PIECES[pieces.indexOf(p)].color, 0.5), p.shadowBlur(22, 0.5)),
    ),
  );
  yield* waitFor(0.6);

  // 3. 떼어 내기
  yield* cap.say('03', '조각을 떼어 보면', C.amber);
  cue('boom');
  yield* all(
    outline().opacity(0, 0.3),
    cutV().opacity(0, 0.3),
    cutH().opacity(0, 0.3),
    dimW().opacity(0, 0.3),
    dimH().opacity(0, 0.3),
    ...pieces.map((p, i) =>
      p.position(p.position().add([PIECES[i].dx * GAP, PIECES[i].dy * GAP]), 0.8, easeOutExpo),
    ),
    punch(cam(), 0.04),
  );
  for (let i = 0; i < 4; i++) {
    cue('pop');
    labels[i].scale(0.5);
    yield* all(labels[i].opacity(1, 0.25), labels[i].scale(1, 0.4, easeOutBack));
    yield* waitFor(0.25);
  }
  yield* eq.set('100 + 30 + 20 + 6 = 156', C.ink, C.amber);
  cue('chime');
  yield* ring(view, [0, 225], C.amber, 420);
  yield* waitFor(1.4);

  // 4. 세로셈과 나란히
  yield* all(eq.hide(), cap.say('04', '이제 세로셈과 나란히 놓아 볼게요', C.teal));
  cue('whoosh');
  yield* all(camTo(cam(), 0.72, [-250, -190], 1), calc().opacity(1, 0.6));
  yield* sequence(0.2, rows[0].opacity(1, 0.4), rows[1].opacity(1, 0.4), bars[0].width(COL * 3 + 20, 0.5, easeOutExpo));
  yield* waitFor(0.6);

  // 아래 띠: 13 × 2 = 26
  yield* cap.say('05', '13 × 2 = 아래쪽 띠\n20 + 6 = 26', C.violet);
  cue('pop');
  yield* all(
    rows[2].opacity(1, 0.4),
    notes[0].opacity(1, 0.4),
    pieces[0].opacity(0.25, 0.4),
    pieces[1].opacity(0.25, 0.4),
    pieces[2].scale(1.06, 0.3).to(1, 0.3),
    pieces[3].scale(1.06, 0.3).to(1, 0.3),
  );
  yield* waitFor(1.8);

  // 위 덩어리: 13 × 10 = 130
  yield* cap.say('06', '13 × 10 = 위쪽 큰 덩어리\n100 + 30 = 130', C.amber);
  cue('pop');
  yield* all(
    rows[3].opacity(1, 0.4),
    notes[1].opacity(1, 0.4),
    pieces[0].opacity(1, 0.4),
    pieces[1].opacity(1, 0.4),
    pieces[2].opacity(0.25, 0.4),
    pieces[3].opacity(0.25, 0.4),
    pieces[0].scale(1.04, 0.3).to(1, 0.3),
    pieces[1].scale(1.04, 0.3).to(1, 0.3),
  );
  yield* waitFor(1.8);

  // 합
  yield* cap.say('07', '두 줄을 더하면 = 전체 넓이', C.teal);
  yield* all(pieces[2].opacity(1, 0.3), pieces[3].opacity(1, 0.3), bars[1].width(COL * 3 + 20, 0.5, easeOutExpo));
  cue('boom');
  yield* all(rows[4].opacity(1, 0.3), flash(0.16), sparks(calc(), [-COL, ROW * 4 + 60], C.amber, 14, 160));
  cue('chime');
  yield* cap.say('08', '세로셈 한 줄 = 직사각형 한 띠!', C.amber);
  yield* punch(calc(), 0.06);
  yield* waitFor(2);

  // 다음 편
  yield* wipe.cover();
  cam().opacity(0);
  calc().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  03', '5² 은\n10 일까, 25 일까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
