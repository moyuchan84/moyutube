import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
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
  cue,
  finish,
  punch,
  ring,
  sparks,
} from '../motion';

const NAME = 'mulSwap';
const S = 124; // 점 사이 간격
const STAGE_Y = -175;

// 줄 r, 칸 c (rows × cols 배치) 의 자리
const at = (r: number, c: number, rows: number, cols: number): [number, number] => [
  (c - (cols - 1) / 2) * S,
  (r - (rows - 1) / 2) * S,
];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['3 × 4 랑 4 × 3', '왜 똑같을까?']);

  const stage = createRef<Node>();
  const grid = createRef<Node>();
  const dots: Rect[] = [];
  const pills: Rect[] = [];
  const counts: Txt[] = [];
  const total = createSignal(0);

  view.add(
    <Node ref={stage} y={STAGE_Y}>
      {/* 줄 강조 띠 (3줄 × 4칸일 때) */}
      {[0, 1, 2].map(r => (
        <Rect
          ref={el => (pills[r] = el)}
          y={at(r, 0, 3, 4)[1]}
          width={4 * S + 20}
          height={S - 14}
          radius={(S - 14) / 2}
          fill={C.amber + '22'}
          stroke={C.amber}
          lineWidth={3}
          shadowColor={C.amber}
          shadowBlur={24}
          opacity={0}
        />
      ))}
      <Node ref={grid}>
        {Array.from({length: 12}, (_, i) => {
          const [x, y] = at(Math.floor(i / 4), i % 4, 3, 4);
          return (
            <Rect
              ref={el => (dots[i] = el)}
              x={x}
              y={y}
              size={84}
              radius={42}
              fill={C.amber}
              shadowColor={C.amber}
              shadowBlur={26}
              scale={0}
            />
          );
        })}
      </Node>
      {[0, 1, 2, 3].map(i => (
        <Txt
          ref={el => (counts[i] = el)}
          fontFamily={FONT}
          fontSize={52}
          fontWeight={900}
          fill={C.teal}
          shadowColor={C.teal}
          shadowBlur={18}
          opacity={0}
        />
      ))}
    </Node>,
  );
  const eq = addEq(view, 225);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 3줄 × 4칸
  yield* sequence(
    0.06,
    ...dots.map((d, i) =>
      all(
        d.scale(1, 0.5, easeOutBack),
        (function* () {
          if (i % 4 === 0) cue('pop');
        })(),
      ),
    ),
  );
  yield* cap.say('01', '한 줄에 4개씩, 3줄');
  for (let r = 0; r < 3; r++) {
    const c = counts[r];
    c.position([4 * S / 2 + 90, at(r, 0, 3, 4)[1]]);
    c.text(String((r + 1) * 4));
    c.scale(0.5);
    cue('tick');
    yield* all(pills[r].opacity(1, 0.25), c.opacity(1, 0.3), c.scale(1, 0.4, easeOutBack));
    yield* waitFor(0.25);
    if (r < 2) yield* pills[r].opacity(0.25, 0.2);
  }
  yield* eq.set('4 + 4 + 4 = 12');
  yield* waitFor(0.8);
  yield* eq.set('3 × 4 = 12', C.ink, C.amber);
  yield* waitFor(1.2);

  // 2. 통째로 돌리기
  yield* cap.say('02', '이제 통째로 돌려 볼게요', C.violet);
  yield* all(...pills.map(p => p.opacity(0, 0.3)), ...counts.map(c => c.opacity(0, 0.3)), eq.hide());
  yield* waitFor(0.15);
  yield* all(grid().rotation(90, 1.3, easeInOutExpo), stage().scale(1.12, 0.65).to(1, 0.65));
  cue('riser');
  cue('boom');
  yield* all(flash(0.18), punch(stage(), 0.06), sparks(stage(), [0, 0], C.violet, 14, 330));
  // 돌린 모양 그대로 4줄 × 3칸 배치로 바꿔 둔다 (점은 둥글어서 겉보기는 같다)
  grid().rotation(0);
  dots.forEach((d, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    d.position(at(c, 2 - r, 4, 3));
  });

  // 3. 4줄 × 3칸
  yield* cap.say('03', '이번엔 한 줄에 3개씩, 4줄');
  for (let r = 0; r < 4; r++) {
    const c = counts[r];
    c.position([3 * S / 2 + 90, at(r, 0, 4, 3)[1]]);
    c.text(String((r + 1) * 3));
    c.scale(0.5);
    cue('tick');
    const row = dots.filter((_, i) => i % 4 === r);
    yield* all(
      c.opacity(1, 0.3),
      c.scale(1, 0.4, easeOutBack),
      ...row.map(d => d.fill(C.teal, 0.25)),
      ...row.map(d => d.shadowColor(C.teal, 0.25)),
    );
    yield* waitFor(0.2);
  }
  yield* eq.set('4 × 3 = 12', C.ink, C.teal);
  yield* waitFor(1);
  yield* cap.say('04', '돌리기만 했으니\n개수는 그대로!', C.amber);
  yield* eq.set('3 × 4 = 4 × 3', C.amber, C.amber);
  cue('chime');
  yield* all(ring(view, [0, 225], C.amber, 380), punch(eq.node(), 0.08));
  yield* waitFor(1.6);

  // 4. 점 → 네모 칸 = 직사각형
  yield* wipe.cover();
  counts.forEach(c => c.opacity(0));
  eq.node().opacity(0);
  dots.forEach((d, i) => {
    d.position(at(Math.floor(i / 4), i % 4, 3, 4));
    d.fill(C.amber);
    d.shadowColor(C.amber);
  });
  yield* wipe.reveal();
  yield* cap.say('05', '점을 네모 칸으로 바꾸면?');
  cue('swish');
  yield* all(
    ...dots.map(d => all(d.size(S - 8, 0.8, easeInOutExpo), d.radius(14, 0.8, easeInOutExpo))),
    ...dots.map(d => d.fill(C.amber + 'cc', 0.8)),
  );
  cue('pop');

  const dimA = createRef<Node>();
  const dimB = createRef<Node>();
  const dimC = createRef<Node>();
  const dimD = createRef<Node>();
  const W4 = 4 * S;
  const H3 = 3 * S;
  stage().add(
    <>
      <Dim from={[-W4 / 2, -H3 / 2 - 50]} to={[W4 / 2, -H3 / 2 - 50]} label="가로 4" color={C.teal} refs={{node: n => dimA(n)}} />
      <Dim from={[-W4 / 2 - 50, -H3 / 2]} to={[-W4 / 2 - 50, H3 / 2]} label="세로 3" color={C.pink} side={[-80, 0]} refs={{node: n => dimB(n)}} />
      <Dim from={[-H3 / 2, -W4 / 2 - 50]} to={[H3 / 2, -W4 / 2 - 50]} label="가로 3" color={C.teal} refs={{node: n => dimC(n)}} />
      <Dim from={[-H3 / 2 - 50, -W4 / 2]} to={[-H3 / 2 - 50, W4 / 2]} label="세로 4" color={C.pink} side={[-80, 0]} refs={{node: n => dimD(n)}} />
    </>,
  );
  yield* all(dimA().opacity(1, 0.4), dimB().opacity(1, 0.4));
  yield* eq.set('4 × 3 = 12칸');
  yield* cap.say('06', '곱셈 = 직사각형의 넓이', C.amber);
  yield* all(sparks(stage(), [W4 / 2, -H3 / 2], C.amber, 10, 120), punch(stage(), 0.04));
  yield* waitFor(1.4);

  // 5. 돌려도 넓이는 같다
  yield* cap.say('07', '세워도 넓이는 똑같이 12칸');
  yield* all(dimA().opacity(0, 0.25), dimB().opacity(0, 0.25), eq.hide());
  cue('whoosh');
  yield* grid().rotation(90, 1, easeInOutExpo);
  yield* all(dimC().opacity(1, 0.4), dimD().opacity(1, 0.4));
  yield* eq.set('3 × 4 = 12칸', C.ink, C.teal);
  yield* waitFor(1.6);

  // 6. 다음 편
  yield* wipe.cover();
  stage().opacity(0);
  eq.node().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', '13 × 12 세로셈은\n왜 이렇게 할까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
