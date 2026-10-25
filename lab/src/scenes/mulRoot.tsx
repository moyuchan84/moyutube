import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addFlash,
  addHud,
  addTitle,
  addWipe,
  begin,
  cue,
  finish,
  camTo,
  popIn,
  popOut,
  punch,
  ring,
  sparks,
} from '../motion';

const NAME = 'mulRoot';
const U = 60;
const M = 6; // 칸 묶음 최대 6×6
const STAGE_Y = -230;

const cell = (r: number, c: number, n: number): [number, number] => [(c - (n - 1) / 2) * U, (r - (n - 1) / 2) * U];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 5, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['루트(√)는', '제곱을 거꾸로!'], C.teal);

  const stage = createRef<Node>();
  const cells: Rect[] = [];
  const area = createRef<Txt>();
  const edge = createRef<Line>();
  const ticks: Txt[] = [];
  const qmark = createRef<Txt>();

  view.add(
    <Node ref={stage} y={STAGE_Y}>
      {Array.from({length: M * M}, (_, i) => (
        <Rect ref={el => (cells[i] = el)} size={U - 5} radius={9} fill={C.teal + 'bb'} shadowColor={C.teal} shadowBlur={12} scale={0} />
      ))}
      <Txt
        ref={area}
        fontFamily={FONT}
        fontSize={62}
        fontWeight={900}
        fill={'#ffffff'}
        shadowColor={'#000000'}
        shadowBlur={24}
        opacity={0}
      />
      <Line ref={edge} stroke={C.amber} lineWidth={9} lineCap="round" end={0} shadowColor={C.amber} shadowBlur={22} />
      {Array.from({length: M}, (_, i) => (
        <Txt ref={el => (ticks[i] = el)} text={String(i + 1)} fontFamily={FONT} fontSize={38} fontWeight={900} fill={C.amber} opacity={0} />
      ))}
      <Txt ref={qmark} text={'?'} fontFamily={FONT} fontSize={90} fontWeight={900} fill={C.amber} shadowColor={C.amber} shadowBlur={30} opacity={0} />
    </Node>,
  );

  // 제곱 ⇄ 루트 도식
  const diagram = createRef<Node>();
  const rowA = createRef<Node>();
  const rowB = createRef<Node>();
  const arrowA = createRef<Line>();
  const arrowB = createRef<Line>();
  const numStyle = {fontFamily: FONT, fontSize: 80, fontWeight: 900};
  view.add(
    <Node ref={diagram} y={40}>
      <Node ref={rowA} opacity={0}>
        <Txt x={-290} text={'5'} {...numStyle} fill={C.amber} />
        <Line ref={arrowA} points={[[-220, 0], [190, 0]]} stroke={C.amber} lineWidth={6} endArrow arrowSize={22} end={0} />
        <Txt x={-15} y={-48} text={'제곱'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.amber} />
        <Txt x={290} text={'25'} {...numStyle} fill={C.teal} />
      </Node>
      <Node ref={rowB} y={150} opacity={0}>
        <Txt x={290} text={'25'} {...numStyle} fill={C.teal} />
        <Line ref={arrowB} points={[[200, 0], [-210, 0]]} stroke={C.teal} lineWidth={6} endArrow arrowSize={22} end={0} />
        <Txt x={-10} y={-52} text={'√'} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.teal} />
        <Txt x={-290} text={'5'} {...numStyle} fill={C.amber} />
      </Node>
    </Node>,
  );

  const eq = createRef<Txt>();
  view.add(<Txt ref={eq} y={240} fontFamily={FONT} fontSize={110} fontWeight={900} letterSpacing={-2} fill={C.ink} shadowColor={C.teal + '77'} shadowBlur={30} opacity={0} />);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // n×n 으로 칸 맞추기
  function* layout(n: number, color: string, time = 0.7) {
    const moves = [];
    for (let i = 0; i < M * M; i++) {
      const r = Math.floor(i / M);
      const c = i % M;
      const on = r < n && c < n;
      const node = cells[i];
      if (on) {
        const wasOn = node.scale().x > 0.5;
        if (!wasOn) node.position(cell(r, c, n));
        moves.push(
          all(
            node.position(cell(r, c, n), time, easeInOutExpo),
            node.scale(1, time, easeOutBack),
            node.fill(color + 'bb', time),
            node.shadowColor(color, time),
          ),
        );
      } else {
        moves.push(node.scale(0, time * 0.6));
      }
    }
    yield* all(...moves);
  }

  function* setEq(tex: string) {
    if (eq().opacity() > 0) yield* popOut(eq(), 0.2);
    eq().text(tex);
    cue('pop');
    yield* popIn(eq(), 0.5, 1.3);
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.2);
  yield* title.dock();

  // 1. 넓이 25 → 한 변?
  cue('pop');
  yield* layout(5, C.teal, 0.8);
  area().text('넓이 25');
  yield* all(cap.say('01', '넓이가 25 인 정사각형'), popIn(area(), 0.5));
  yield* waitFor(0.6);
  edge().points([[-2.5 * U, -2.5 * U - 14], [2.5 * U, -2.5 * U - 14]]);
  qmark().position([0, cell(0, 0, 5)[1] - U / 2 - 80]);
  yield* all(cap.say('02', '한 변의 길이는?', C.amber), popIn(qmark(), 0.5));
  yield* waitFor(0.8);
  cue('swish');
  yield* all(qmark().opacity(0, 0.3), edge().end(1, 0.7, easeInOutExpo));
  for (let k = 0; k < 5; k++) {
    ticks[k].position([cell(0, k, 5)[0], cell(0, 0, 5)[1] - U / 2 - 56]);
    cue('tick');
    yield* popIn(ticks[k], 0.28, 0.4);
  }
  cue('boom');
  yield* all(setEq('√25 = 5'), flash(0.12), punch(stage(), 0.05));
  yield* cap.say('03', '5 × 5 = 25 니까, 한 변은 5', C.teal);
  yield* waitFor(1.4);

  // 2. 제곱 ⇄ 루트
  yield* all(popOut(eq(), 0.3), ...ticks.map(t => t.opacity(0, 0.3)), edge().opacity(0, 0.3));
  yield* cap.say('04', '제곱: 한 변 → 넓이', C.amber);
  cue('whoosh');
  yield* all(rowA().opacity(1, 0.3), arrowA().end(1, 0.7, easeOutExpo));
  yield* waitFor(1);
  yield* cap.say('05', '루트: 넓이 → 한 변\n거꾸로 가는 길이에요', C.teal);
  cue('whoosh');
  yield* all(rowB().opacity(1, 0.3), arrowB().end(1, 0.7, easeOutExpo));
  cue('chime');
  yield* ring(view, [-290, 190], C.amber, 160);
  yield* waitFor(1.8);

  // 3. 빠르게 세 번
  yield* wipe.cover();
  diagram().opacity(0);
  area().opacity(0);
  yield* wipe.reveal();
  yield* cap.say('06', '√ = 넓이를 보고 한 변 찾기', C.violet);
  const EX = [
    {n: 3, tex: '√9 = 3', color: C.violet},
    {n: 4, tex: '√16 = 4', color: C.coral},
    {n: 6, tex: '√36 = 6', color: C.amber},
  ];
  for (const ex of EX) {
    cue('whoosh');
    yield* all(layout(ex.n, ex.color, 0.7), area().opacity(0, 0.2));
    area().text(`넓이 ${ex.n * ex.n}`);
    yield* all(popIn(area(), 0.4), setEq(ex.tex));
    yield* sparks(stage(), [(ex.n * U) / 2, -(ex.n * U) / 2], ex.color, 10, 110);
    yield* waitFor(0.9);
  }

  // 4. 넓이 2 는?
  yield* cap.say('07', '그럼 넓이가 2 인 정사각형은?', C.pink);
  yield* all(popOut(eq(), 0.3), area().opacity(0, 0.2), layout(0, C.pink, 0.5));
  const ghost = createRef<Rect>();
  const gq = createRef<Txt>();
  stage().add(
    <Node x={U * 1.2}>
      <Rect ref={ghost} size={U * Math.SQRT2} stroke={C.pink} lineWidth={4} lineDash={[10, 8]} fill={C.pink + '22'} opacity={0} />
      <Txt ref={gq} y={-U * 1.15} text={'?'} fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.pink} opacity={0} />
    </Node>,
  );
  cells[0].position([-U * 2.1, 0]);
  cells[1].position([-U * 1.1, 0]);
  area().fontSize(34);
  area().text('칸 2 개만큼 = 넓이 2');
  area().position([-U * 1.6, U * 1.1]);
  cue('swish');
  yield* camTo(stage(), 1.8, [0, STAGE_Y + 40], 0.8);
  cue('pop');
  yield* all(...[0, 1].map(i => all(cells[i].scale(1, 0.5, easeOutBack), cells[i].fill(C.pink + 'bb', 0.3), cells[i].shadowColor(C.pink, 0.3))), popIn(area(), 0.4));
  yield* waitFor(0.6);
  cue('riser');
  cue('boom');
  yield* all(popIn(ghost(), 0.6), popIn(gq(), 0.6), flash(0.1));
  yield* gq().scale(1.3, 0.4).to(1, 0.4).to(1.3, 0.4).to(1, 0.4);
  yield* waitFor(0.8);

  // 다음 편
  yield* wipe.cover();
  stage().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  06', '넓이가 2 인 정사각형,\n한 변은 몇?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
