import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
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

const NAME = 'mulSquare';
const U = 66;
const STAGE_Y = -190;

// n×m 칸을 가운데 정렬로 놓은 자리
const cell = (r: number, c: number, rows: number, cols: number): [number, number] => [
  (c - (cols - 1) / 2) * U,
  (r - (rows - 1) / 2) * U,
];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 3, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['5² 은', '10 일까, 25 일까?'], C.amber);

  const stage = createRef<Node>();
  const left = createRef<Node>();
  const right = createRef<Node>();
  const cross = createRef<Line>();
  const leftCells: Rect[] = [];
  const rightCells: Rect[] = [];
  const leftLab = createRef<Txt>();
  const rightLab = createRef<Txt>();

  // 왼쪽: 5 × 2 (틀린 답), 오른쪽: 5 × 5
  view.add(
    <Node ref={stage} y={STAGE_Y}>
      <Node ref={left} x={-250} scale={0.8}>
        {Array.from({length: 10}, (_, i) => (
          <Rect
            ref={el => (leftCells[i] = el)}
            position={cell(Math.floor(i / 5), i % 5, 2, 5)}
            size={U - 6}
            radius={10}
            fill={C.coral + 'aa'}
            shadowColor={C.coral}
            shadowBlur={14}
            scale={0}
          />
        ))}
        <Txt ref={leftLab} y={130} text={'5 × 2 = 10'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.coral} opacity={0} />
        <Line ref={cross} points={[[-200, -90], [200, 170]]} stroke={C.coral} lineWidth={10} lineCap="round" end={0} shadowColor={C.coral} shadowBlur={20} />
      </Node>
      <Node ref={right} x={250} scale={0.8}>
        {Array.from({length: 25}, (_, i) => (
          <Rect
            ref={el => (rightCells[i] = el)}
            position={cell(Math.floor(i / 5), i % 5, 5, 5)}
            size={U - 6}
            radius={10}
            fill={C.amber + 'cc'}
            shadowColor={C.amber}
            shadowBlur={14}
            scale={0}
          />
        ))}
        <Txt ref={rightLab} y={230} text={'5 × 5 = 25'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.amber} opacity={0} />
      </Node>
    </Node>,
  );

  // 2부: 자라는 정사각형 1² ~ 5²
  const grow = createRef<Node>();
  const growCells: Rect[] = [];
  const chips: Rect[] = [];
  const nLabel = createRef<Txt>();
  const COLORS = [C.amber, C.teal, C.violet, C.coral, C.pink];
  view.add(
    <Node ref={grow} y={STAGE_Y + 10} opacity={0}>
      {Array.from({length: 25}, (_, i) => (
        <Rect ref={el => (growCells[i] = el)} size={U - 6} radius={10} fill={C.amber} scale={0} />
      ))}
      <Txt ref={nLabel} y={-260} fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.ink} opacity={0} />
    </Node>,
  );
  view.add(
    <Node y={90}>
      {[1, 4, 9, 16, 25].map((v, i) => (
        <Rect
          ref={el => (chips[i] = el)}
          x={(i - 2) * 170}
          layout
          padding={[10, 0]}
          width={140}
          justifyContent="center"
          radius={18}
          fill={COLORS[i] + '22'}
          stroke={COLORS[i]}
          lineWidth={3}
          opacity={0}
        >
          <Txt text={String(v)} fontFamily={FONT} fontSize={56} fontWeight={900} fill={COLORS[i]} />
        </Rect>
      ))}
    </Node>,
  );

  const eq = addEq(view, 235, 96);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.2);
  yield* title.dock();

  // 1. 5² 의 뜻
  yield* eq.set('5² = 5 × 5', C.ink, C.amber);
  yield* cap.say('01', '작은 2 는 "같은 수를 두 번 곱해요"');
  yield* waitFor(1.6);
  yield* eq.hide();

  // 2. 10 이 아닌 이유
  yield* cap.say('02', '5 × 2 로 착각하면 10칸', C.coral);
  cue('pop');
  yield* sequence(0.04, ...leftCells.map(c => c.scale(1, 0.4, easeOutBack)));
  yield* leftLab().opacity(1, 0.3);
  yield* waitFor(0.6);
  yield* cap.say('03', '진짜 5² 는 5 × 5 = 25칸!', C.amber);
  cue('pop');
  yield* sequence(0.03, ...rightCells.map(c => c.scale(1, 0.4, easeOutBack)));
  yield* rightLab().opacity(1, 0.3);
  cue('swish');
  yield* all(cross().end(1, 0.4, easeOutExpo), left().opacity(0.45, 0.4));
  cue('boom');
  yield* all(flash(0.14), punch(right(), 0.06), sparks(stage(), [250, 0], C.amber, 14, 260));
  yield* waitFor(1.6);

  // 3. 자라는 정사각형
  yield* wipe.cover();
  stage().opacity(0);
  grow().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('04', '한 변을 1 씩 늘려 볼까요?', C.teal);

  for (let n = 1; n <= 5; n++) {
    const color = COLORS[n - 1];
    const moves = [];
    for (let k = 0; k < n * n; k++) {
      const r = Math.floor(k / n);
      const c = k % n;
      // 앞 정사각형의 칸을 그대로 두려고, n×n 의 (r,c) 를 칸 번호로 정한다
      const idx = r * 5 + c;
      const node = growCells[idx];
      const pos = cell(r, c, n, n);
      if (r < n - 1 && c < n - 1) {
        moves.push(node.position(pos, 0.6, easeInOutExpo));
      } else {
        node.position(pos);
        node.fill(color);
        node.shadowColor(color);
        node.shadowBlur(16);
        moves.push(node.scale(1, 0.5, easeOutBack));
      }
    }
    nLabel().text(`${n} × ${n}`);
    nLabel().y(-(n * U) / 2 - 60);
    cue('pop');
    yield* all(...moves, nLabel().opacity(1, 0.3), chips[n - 1].opacity(1, 0.3), chips[n - 1].scale(1.15, 0.2).to(1, 0.3));
    yield* waitFor(n === 5 ? 0.6 : 0.55);
  }
  yield* cap.say('05', '1, 4, 9, 16, 25 …\n늘 정사각형이 돼요', C.violet);
  yield* waitFor(1.8);

  // 4. square
  yield* cap.say('06', '그래서 영어로도 square\n"정사각형"이라고 불러요', C.amber);
  cue('chime');
  yield* eq.set('5² = 5 × 5 = 25', C.amber, C.amber);
  yield* ring(view, [0, 235], C.amber, 420);
  yield* waitFor(2.2);

  // 다음 편
  yield* wipe.cover();
  grow().opacity(0);
  chips.forEach(c => c.opacity(0));
  eq.node().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  04', '홀수만 더하면\n왜 제곱수가 될까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
