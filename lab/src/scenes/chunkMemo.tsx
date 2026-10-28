import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInExpo, easeInOutCubic, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addTimer} from '../sci';

// 과학 「뇌의 용량」 1편 — 숫자 묶어 외우기 (청킹)
// 1) 숫자 10개를 3초 보고 말해 보기 → 뒤쪽이 가물가물
// 2) 다른 숫자 10개를 3 · 3 · 4 로 묶어서 다시 → 더 쉽다
// 3) 잠깐 기억하는 칸은 몇 개 없다 → 숫자 하나에 한 칸이면 밀려나고, 묶음 하나에 한 칸이면 더 담긴다
// "몇 칸" 같은 숫자는 연구마다 달라서 말하지 않는다 (그림의 칸 4개는 모식도)

const NAME = 'chunkMemo';
const A = '5829471630';
const B = '4713852096';
const GROUPS = ['471', '385', '2096'];
const W = 80;
const STEP = 88;
const ROW_Y = -250;
const SLOT_Y = -230;
const SLOT_W = 220;
const slotX = (i: number) => (i - 1.5) * (SLOT_W + 20);

type Cell = {node: Node; dig: Txt; q: Txt};

// 숫자 칸 한 줄. gaps 가 있으면 그 자리 뒤에 묶음 간격을 둔다
function row(digits: string, color: string, cells: Cell[], gaps: number[] = []) {
  const xs: number[] = [];
  let x = 0;
  digits.split('').forEach((_, i) => {
    xs.push(x);
    x += STEP + (gaps.includes(i) ? 44 : 0);
  });
  const shift = xs[xs.length - 1] / 2;
  return digits.split('').map((d, i) => {
    const c = {} as Cell;
    cells.push(c);
    return (
      <Node ref={n => (c.node = n)} x={xs[i] - shift} opacity={0}>
        <Rect width={W} height={124} radius={14} fill={'#ffffff0d'} stroke={color + '99'} lineWidth={3} />
        <Txt ref={n => (c.dig = n)} text={d} fontFamily={FONT} fontSize={84} fontWeight={900} fill={C.ink} />
        <Txt ref={n => (c.q = n)} text={'?'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={color} opacity={0} />
      </Node>
    );
  });
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 숫자 두 줄 */
  const cellsA: Cell[] = [];
  const cellsB: Cell[] = [];
  const rowA = createRef<Node>();
  const rowB = createRef<Node>();
  const brackets = createRef<Node>();
  view.add(
    <Node>
      <Node ref={rowA} y={ROW_Y}>
        {row(A, C.teal, cellsA)}
      </Node>
      <Node ref={rowB} y={ROW_Y}>
        {row(B, C.amber, cellsB, [2, 5])}
      </Node>
      {/* 묶음 밑줄 */}
      <Node ref={brackets} y={ROW_Y + 92} opacity={0}>
        <Rect x={-352} width={248} height={8} radius={4} fill={C.amber} />
        <Rect x={-44} width={248} height={8} radius={4} fill={C.amber} />
        <Rect x={308} width={336} height={8} radius={4} fill={C.amber} />
      </Node>
    </Node>,
  );

  /* 잠깐 기억 칸 (원리) */
  const slotsN = createRef<Node>();
  const slots: Rect[] = [];
  const memo = createRef<Node>();
  view.add(
    <Node ref={slotsN} opacity={0}>
      <Txt y={SLOT_Y - 170} text={'잠깐 기억하는 칸'} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.violet} />
      {[0, 1, 2, 3].map(i => (
        <Rect ref={el => (slots[i] = el)} x={slotX(i)} y={SLOT_Y} width={SLOT_W} height={160} radius={22} fill={'#9B8CFF14'} stroke={C.violet} lineWidth={4} lineDash={[16, 10]} />
      ))}
      <Node ref={memo} />
    </Node>,
  );

  /* 전화번호 (생활 예) */
  const phoneN = createRef<Node>();
  const phoneTxt = createRef<Txt>();
  view.add(
    <Node ref={phoneN} y={-250} opacity={0}>
      <Rect width={900} height={260} radius={36} fill={'#0B1028e6'} stroke={C.teal} lineWidth={4} shadowColor={C.teal} shadowBlur={30} />
      <Txt y={-80} text={'전화번호'} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.dim} />
      <Txt ref={phoneTxt} y={20} text={'01012345678'} fontFamily={FONT} fontSize={92} fontWeight={900} letterSpacing={2} fill={C.ink} />
    </Node>,
  );

  const card = bigCard('묶으면 더 많이 기억한다', C.teal, 62);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['숫자 10개,', '3초 보고 외울까?'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 3, series: '뇌의 용량', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);
  const look = addTimer(view, 'LOOK');
  const say = addTimer(view, 'SAY');

  function* show(cells: Cell[]) {
    cue('pop');
    yield* sequence(0.04, ...cells.map(c => popIn(c.node, 0.4, 0.6)));
  }
  function* cover(cells: Cell[]) {
    cue('swish');
    yield* sequence(0.03, ...cells.map(c => all(c.dig.opacity(0, 0.2), c.q.opacity(1, 0.25))));
  }
  function* reveal(cells: Cell[]) {
    cue('chime');
    yield* sequence(0.04, ...cells.map(c => all(c.q.opacity(0, 0.2), c.dig.opacity(1, 0.25))));
  }
  function* test(cells: Cell[], prompt: string, color: string) {
    look.count(3);
    look.node().opacity(1);
    yield* look.run(3);
    look.node().opacity(0);
    yield* cover(cells);
    say.count(4);
    say.node().opacity(1);
    yield* cap.say('SAY', prompt, color);
    yield* say.run(4);
    say.node().opacity(0);
    yield* reveal(cells);
  }

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero());
  yield* title.dock();
  yield* cap.say('준비', '숫자 10개가 딱 3초만 나와요\n사라지면 소리 내 말해 보세요', C.amber);
  yield* waitFor(2.0);

  /* ═════════ 1. 1회: 그냥 10개 ═════════ */
  title.group().opacity(0);
  yield* all(cap.say('1회', '외워 보세요!', C.teal), show(cellsA));
  yield* test(cellsA, '기억나는 만큼\n말해 보세요!', C.coral);
  yield* cap.say('1회', '몇 개 맞았나요?\n뒤쪽은 가물가물하죠?', C.amber);
  yield* waitFor(1.8);

  /* ═════════ 2. 2회: 셋 · 셋 · 넷 묶음 ═════════ */
  cue('whoosh');
  yield* all(rowA().opacity(0, 0.4), cap.say('2회', '이번엔 다른 숫자\n세 묶음으로 나눠서 보여 줄게요', C.teal));
  yield* waitFor(1.4);
  yield* all(show(cellsB), delay(0.3, brackets().opacity(1, 0.4)));
  yield* test(cellsB, '이번에도\n말해 보세요!', C.coral);
  yield* all(cap.say('2회', '어때요?\n아까보다 쉬웠죠?', C.amber), punch(rowB(), 0.04));
  yield* waitFor(1.8);

  /* ═════════ 3. 왜? ═════════ */
  cue('whoosh');
  yield* all(rowB().opacity(0, 0.4), brackets().opacity(0, 0.4));
  slotsN().opacity(1);
  yield* all(
    cap.say('01', '머릿속엔 잠깐 기억해 두는\n칸이 몇 개 없어요', C.violet),
    sequence(0.1, ...slots.map(s => popIn(s, 0.45, 0.6))),
  );
  yield* waitFor(1.2);

  // 숫자 하나에 한 칸 → 다섯 번째부터 앞의 숫자가 밀려난다
  yield* cap.say('02', '숫자 하나에 한 칸씩 쓰면\n금방 꽉 차서 밀려나요', C.coral);
  const inSlots: Txt[] = [];
  const singles = A.slice(0, 7).split('');
  for (const d of singles) {
    const t = (<Txt text={d} x={620} y={SLOT_Y} fontFamily={FONT} fontSize={96} fontWeight={900} fill={C.teal} />) as Txt;
    memo().add(t);
    cue('pop');
    if (inSlots.length === 4) {
      const out = inSlots.shift()!;
      yield* all(
        out.y(SLOT_Y + 260, 0.4, easeInExpo),
        out.opacity(0, 0.4),
        ...inSlots.map((n, k) => n.x(slotX(k), 0.4, easeInOutCubic)),
        t.x(slotX(3), 0.45, easeOutExpo),
      );
    } else {
      yield* t.x(slotX(inSlots.length), 0.4, easeOutExpo);
    }
    inSlots.push(t);
  }
  yield* waitFor(0.6);

  // 묶음 하나에 한 칸
  cue('swish');
  yield* all(...inSlots.map(n => n.opacity(0, 0.3)), cap.say('03', '세 개씩 묶으면\n한 칸에 한 묶음!', C.teal));
  for (let i = 0; i < 3; i++) {
    const t = (<Txt text={GROUPS[i]} x={620} y={SLOT_Y} fontFamily={FONT} fontSize={72} fontWeight={900} fill={C.amber} />) as Txt;
    memo().add(t);
    cue('pop');
    yield* t.x(slotX(i), 0.45, easeOutExpo);
  }
  cue('chime');
  yield* all(sparks(view, [slotX(3), SLOT_Y], C.violet, 12, 160), punch(slots[3], 0.12), slots[3].fill('#9B8CFF33', 0.4));
  yield* cap.say('04', '숫자 10개가 칸 3개에 쏙\n한 칸이 아직 남았어요', C.amber);
  yield* waitFor(1.8);

  /* ═════════ 4. 생활 예: 전화번호 ═════════ */
  yield* wipe.cover();
  slotsN().opacity(0);
  phoneN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('LIFE', '이렇게 길게 붙어 있으면\n외우기 힘들죠?', C.coral);
  yield* waitFor(1.3);
  cue('pop');
  phoneTxt().text('010 - 1234 - 5678');
  yield* all(cap.say('LIFE', '그래서 전화번호도\n끊어서 적고 외워요', C.teal), punch(phoneN(), 0.06));
  yield* waitFor(1.8);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  phoneN().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '잘게 쪼개지 말고 묶어서!\n한 칸에 더 많이 담겨요', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('NEXT  뇌의 용량 02', '그림이 바뀌는데\n왜 모를까?'));
  yield* waitFor(1.4);
  yield* finish(NAME, 0.3);
});
