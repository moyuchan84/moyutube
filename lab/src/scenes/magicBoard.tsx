import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import type {CueKind} from '../motion';
import {FONT} from '../style';
import {C, addCaption, addEnd, addFlash, addHud, begin, capLog, cue, finish, popIn, popOut, punch} from '../motion';
import {rand, reseed, shake} from '../fx';
import {addTimer} from '../sci';
import {
  BAR,
  M,
  QBox,
  SYM_COLOR,
  Sym,
  addBubble,
  addClock,
  addCurtains,
  addHat,
  addOrb,
  addSlam,
  addStage,
  confetti,
  toBeat,
  type SymKind,
} from '../magic';

// 마술의 비밀 「화면이 맞힌다」 1편 — 네 마음을 읽는 기호판
// 1) 두 자리 수 → 두 숫자를 더해 → 처음 수에서 빼기 → 기호판에서 그 칸의 기호를 기억
// 2) 수정구슬이 "금색 별" 을 맞힌다
// 3) 비밀: 답은 늘 9 · 18 · … · 81 (9의 배수) — 그 아홉 칸에만 별이 있다
// 4) 왜: 37 = 10묶음 3 + 낱개 7, 3 + 7 을 빼면 낱개는 다 빠지고 묶음마다 1개씩 빠져 9 × 3
// 수학 확인: lab/MAGIC.md 12절 (10~99 모든 수)

const NAME = 'magicBoard';
const VIOLET = '#A98BFF';
const TEAL = '#4FE3D0';
const PINK = '#FF6FB5';

/* 기호판 0~99: 9의 배수(9~81) 아홉 칸은 모두 별. 별이 대각선 줄로만 보이면 들키니,
   계산으로는 절대 나올 수 없는 칸에 가짜 별을 흩어 둔다. 나머지는 별이 아닌 8종 */
const OTHERS: SymKind[] = ['heart', 'circle', 'tri', 'square', 'diamond', 'moon', 'plus', 'ring'];
const isStar = (n: number) => n >= 9 && n <= 81 && n % 9 === 0;
const DECOY = [4, 15, 30, 47, 58, 66, 79, 92]; // 9의 배수가 아닌 칸 (답으로 안 나옴)
reseed(2026);
const BOARD: SymKind[] = [];
for (let n = 0; n < 100; n++) {
  if (isStar(n) || DECOY.includes(n)) {
    BOARD.push('star');
    continue;
  }
  let k = Math.floor(rand() * OTHERS.length);
  // 바로 왼쪽 · 위 칸과 같은 기호가 이어지지 않게
  while (OTHERS[k] === BOARD[n - 1] || OTHERS[k] === BOARD[n - 10]) k = (k + 1) % OTHERS.length;
  BOARD.push(OTHERS[k]);
}
const CELL = 92;
const BX = (n: number) => -414 + (n % 10) * CELL;
const BY = (n: number) => -514 + Math.floor(n / 10) * CELL;
const CELL_BG = '#1C1236';

export default makeScene2D(function* (view) {
  begin();
  const clock = addClock();
  yield clock.run();
  const stageFx = addStage(view, clock.t);

  const cam = createRef<Node>();
  view.add(<Node ref={cam} />);

  /* ── 단계 화면: 생각한 수 상자 ── */
  const spinning = createSignal(1);
  const digit = (k: number, lo: number) => () =>
    spinning() ? String(lo + ((Math.floor(clock.t() * 13) + k * 4) % (10 - lo))) : '?';
  const row1 = createRef<Node>();
  const row2 = createRef<Node>();
  const row3 = createRef<Node>();
  const ex2 = createRef<Txt>();
  const op = (s: string, size = 96) => <Txt text={s} fontFamily={FONT} fontSize={size} fontWeight={900} fill={C.ink} />;
  cam().add(
    <Node y={-60}>
      <Node ref={row1} opacity={0}>
        <Rect layout direction="row" gap={34} alignItems="center">
          {QBox({color: VIOLET, w: 210, h: 260, text: digit(0, 1)})}
          {QBox({color: TEAL, w: 210, h: 260, text: digit(1, 0)})}
        </Rect>
        <Txt y={200} text={'10 ~ 99 중 아무거나'} fontFamily={FONT} fontSize={44} fontWeight={800} fill={M.lilac} />
      </Node>
      <Node ref={row2} opacity={0}>
        <Rect layout direction="row" gap={30} alignItems="center">
          {QBox({color: VIOLET, w: 170, h: 210})}
          {op('+', 110)}
          {QBox({color: TEAL, w: 170, h: 210})}
        </Rect>
        <Txt ref={ex2} y={190} text={'예) 47 이면  4 + 7'} fontFamily={FONT} fontSize={42} fontWeight={800} fill={'#B9A9E6'} />
      </Node>
      <Node ref={row3} opacity={0}>
        <Rect layout direction="row" gap={10} alignItems="center">
          {QBox({color: VIOLET, w: 110, h: 140})}
          {QBox({color: TEAL, w: 110, h: 140})}
          {op('−', 84)}
          {op('(', 84)}
          {QBox({color: VIOLET, w: 96, h: 124})}
          {op('+', 72)}
          {QBox({color: TEAL, w: 96, h: 124})}
          {op(')', 84)}
        </Rect>
        <Rect y={200} layout direction="row" gap={20} alignItems="center">
          {op('=', 96)}
          {QBox({color: M.gold, w: 230, h: 150, text: () => '답'})}
        </Rect>
      </Node>
    </Node>,
  );

  /* ── 기호판 ── */
  const board = createRef<Node>();
  const cells: Node[] = [];
  const cellBox: Rect[] = [];
  cam().add(
    <Node ref={board} opacity={0}>
      {BOARD.map((k, n) => (
        <Node ref={el => (cells[n] = el)} x={BX(n)} y={BY(n)}>
          <Rect ref={el => (cellBox[n] = el)} width={84} height={84} radius={14} fill={CELL_BG} stroke={'#ffffff22'} lineWidth={2} />
          <Txt x={-27} y={-25} text={String(n)} fontFamily={FONT} fontSize={26} fontWeight={800} fill={'#CFC4F2'} />
          <Sym kind={k} size={40} bg={CELL_BG} y={10} x={6} />
        </Node>
      ))}
    </Node>,
  );

  /* ── 수정구슬 ── */
  const orb = addOrb(cam(), clock.t, {y: -190, size: 440});
  yield orb.run();
  const bigStar = createRef<Node>();
  orb.inner().add(
    <Node ref={bigStar} scale={0}>
      <Sym kind={'star'} size={230} />
    </Node>,
  );

  /* ── 10묶음 블록 ── */
  const blocks = createRef<Node>();
  cam().add(<Node ref={blocks} y={-130} />);
  const CUBE = 40;
  const GAP = 5;
  type Bar = {node: Node; cubes: Rect[]; label: Txt};
  function buildBars(nBars: number, perBar: number, ones: number, color = VIOLET) {
    blocks().removeChildren();
    const bars: Bar[] = [];
    const span = 74;
    const x0 = ones ? -150 - ((nBars - 1) * span) / 2 : -((nBars - 1) * span) / 2;
    for (let b = 0; b < nBars; b++) {
      const cubes: Rect[] = [];
      const node = <Node x={x0 + b * span} /> as Node;
      for (let i = 0; i < perBar; i++) {
        const r = <Rect y={225 - CUBE / 2 - i * (CUBE + GAP)} size={CUBE} radius={7} fill={color} stroke={'#ffffff55'} lineWidth={2} /> as Rect;
        node.add(r);
        cubes.push(r);
      }
      const label = <Txt y={290} text={String(perBar)} fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.ink} /> as Txt;
      node.add(label);
      blocks().add(node);
      bars.push({node, cubes, label});
    }
    const oneCubes: Rect[] = [];
    let onesLabel: Txt | null = null;
    if (ones) {
      const node = <Node x={190} /> as Node;
      for (let i = 0; i < ones; i++) {
        const r = <Rect y={225 - CUBE / 2 - i * (CUBE + GAP)} size={CUBE} radius={7} fill={TEAL} stroke={'#ffffff55'} lineWidth={2} /> as Rect;
        node.add(r);
        oneCubes.push(r);
      }
      onesLabel = <Txt y={290} text={String(ones)} fontFamily={FONT} fontSize={48} fontWeight={900} fill={TEAL} /> as Txt;
      node.add(onesLabel);
      blocks().add(node);
    }
    return {bars, oneCubes, onesLabel};
  }
  const sumTxt = createRef<Txt>();
  cam().add(<Txt ref={sumTxt} y={-540} fontFamily={FONT} fontSize={88} fontWeight={900} fill={M.gold} opacity={0} shadowColor={M.gold + '88'} shadowBlur={30} />);

  /* ── 이제 네 차례: 3단계 카드 ── */
  const tryN = createRef<Node>();
  const tryCards: Node[] = [];
  const TRY = ['엄마 · 아빠한테 두 자리 수를\n하나 생각하라고 해요', '두 숫자를 더해서\n처음 수에서 빼라고 해요', '"답의 두 숫자를 더하면…\n9 지?" 라고 말해요!'];
  cam().add(
    <Node ref={tryN} opacity={0}>
      {TRY.map((s, i) => (
        <Node ref={el => (tryCards[i] = el)} y={-470 + i * 200} opacity={0}>
          <Rect width={920} height={170} radius={30} fill={'#2A1752ee'} stroke={[VIOLET, TEAL, M.gold][i]} lineWidth={4} />
          <Rect x={-390} width={84} height={84} radius={42} fill={[VIOLET, TEAL, M.gold][i]}>
            <Txt text={String(i + 1)} fontFamily={FONT} fontSize={52} fontWeight={900} fill={'#1A0F33'} />
          </Rect>
          <Txt x={40} text={s} fontFamily={FONT} fontSize={44} fontWeight={800} lineHeight={60} fill={C.ink} textAlign="center" />
        </Node>
      ))}
    </Node>,
  );

  /* ── 커튼 · 첫 화면 글자 · 모자 · 말풍선 · HUD ── */
  const curtains = addCurtains(view);
  const hook = createRef<Node>();
  view.add(
    <Node ref={hook} y={-330}>
      <Txt y={-70} text={'네 마음,'} fontFamily={FONT} fontSize={130} fontWeight={900} fill={C.ink} stroke={'#3A0010'} lineWidth={12} strokeFirst />
      <Txt y={90} text={'내가 맞혀 볼게'} fontFamily={FONT} fontSize={130} fontWeight={900} fill={M.gold} stroke={'#3A1A00'} lineWidth={12} strokeFirst shadowColor={M.gold + 'aa'} shadowBlur={40} />
      <Txt y={240} text={'종이랑 연필 준비!'} fontFamily={FONT} fontSize={52} fontWeight={800} fill={'#FFD9E4'} />
    </Node>,
  );
  const hat = addHat(view, clock.t, {x: 0, y: 300, scale: 1});
  const bub = addBubble(view, {x: 170, y: -540, tail: [-170, 90]});
  const slam = addSlam(view, -600);
  const cap = addCaption(view);
  const hud = addHud(view, {ep: 1, total: 4, series: '화면이 맞힌다', brand: '마술의 비밀'});
  const timer = addTimer(view, 'THINK');
  const end = addEnd(view);
  const flash = addFlash(view);

  // 눈 깜빡임 (배경 스레드)
  yield (function* () {
    while (true) {
      yield* waitFor(2.7);
      yield* hat.blink();
      yield* waitFor(1.3);
      yield* hat.blink();
    }
  })();

  function* hatTo(x: number, y: number, s: number, t = 0.6) {
    yield* all(hat.root().position([x, y], t, easeInOutCubic), hat.root().scale(s, t, easeInOutCubic));
  }

  /* ═════════ 0. 훅: 닫힌 커튼 위 큰 글자 → 모자가 떨어지고 커튼이 열린다 ═════════ */
  cue('m:intro');
  capLog('title', '네 마음,|내가 맞혀 볼게');
  hook().scale(0.9);
  yield* all(hook().scale(1, 0.5, easeOutBack), hat.enter());
  yield* hat.tap();
  yield* all(
    curtains.open(1.0),
    hook().opacity(0, 0.5),
    hook().scale(1.3, 0.6, easeInCubic),
    hud.show(),
    delay(0.3, hatTo(-330, -470, 0.72, 0.7)),
  );
  hat.look(1);
  yield* all(bub.say('지금부터 나를 따라\n계산만 해 줘!'), hat.talk(1.0));
  yield* waitFor(0.2);

  /* ═════════ 1. 단계: 생각한 수 → 두 숫자 더하기 → 빼기 ═════════ */
  yield* toBeat();
  cue('m:build');
  row1().opacity(1);
  row1().scale(0.6);
  yield* all(row1().scale(1, 0.5, easeOutBack), bub.hide(), cap.say('STEP 1', '두 자리 수를\n하나 생각해요', VIOLET));
  timer.count(3);
  timer.node().opacity(1);
  yield* timer.run(3);
  spinning(0);
  cue('pop');
  yield* punch(row1(), 0.06);

  cue('swish');
  yield* all(row1().opacity(0, 0.25), row1().y(-40, 0.25));
  row2().opacity(1);
  row2().scale(0.6);
  yield* all(row2().scale(1, 0.5, easeOutBack), cap.say('STEP 2', '그 수의 두 숫자를\n더해요', TEAL), hat.tap());
  yield* timer.run(3);
  cue('pop');
  yield* punch(row2(), 0.06);

  cue('swish');
  yield* all(row2().opacity(0, 0.25), row2().y(-40, 0.25));
  row3().opacity(1);
  row3().scale(0.6);
  yield* all(row3().scale(1, 0.5, easeOutBack), cap.say('STEP 3', '처음 수에서\n그 합을 빼요', M.gold), hat.tap());
  yield* timer.run(4);
  cue('pop');
  yield* punch(row3(), 0.06);
  timer.node().opacity(0);

  /* ═════════ 2. 기호판: 답 칸의 기호를 기억 ═════════ */
  yield* toBeat();
  cue('m:hush');
  cue('whoosh');
  yield* all(row3().opacity(0, 0.3), row3().scale(0.8, 0.3), hatTo(370, -690, 0.46, 0.6));
  board().opacity(1);
  cells.forEach(c => c.scale(0));
  yield* all(
    sequence(0.012, ...cells.map((c, n) => delay(((n % 10) + Math.floor(n / 10)) * 0.006, c.scale(1, 0.35, easeOutBack)))),
    cap.say('STEP 4', '답이 적힌 칸의 기호를\n꼭 기억해요!', PINK),
  );
  timer.count(6);
  timer.node().opacity(1);
  yield* timer.run(6, {
    4: () => cap.say('TIP', '천천히 하고 싶으면\n화면을 꾹 눌러 멈춰요', '#8E7BD6'),
  });
  timer.node().opacity(0);

  /* ═════════ 3. 공개: 수정구슬 드럼롤 → 금색 별 ═════════ */
  cue('whoosh');
  yield* all(board().opacity(0, 0.5), board().scale(0.85, 0.5), cap.hide(), hatTo(-300, 330, 0.8, 0.7));
  board().scale(1);
  orb.root().scale(0.5);
  yield* all(orb.root().opacity(1, 0.4), orb.root().scale(1, 0.6, easeOutBack));
  hat.look(0.6);
  hat.lookY(-0.8);
  yield* all(bub.say('기억했지?\n이제 네 마음을 읽을게…'), hat.talk(1.1));
  yield* toBeat();
  cue('roll');
  yield* all(
    orb.fogSpeed(9, BAR, easeInCubic),
    orb.glow().scale(1.5, BAR, easeInCubic),
    hat.tap(),
    delay(0.9, hat.tap()),
    delay(1.6, shake(orb.root(), 8, 0.7)),
    bub.hide(),
  );
  cue('hit');
  yield* flash(0.5);
  yield* all(
    bigStar().scale(1, 0.55, easeOutBack),
    bigStar().rotation(360, 0.8, easeOutExpo),
    orb.fogSpeed(1, 1.2),
    orb.glow().scale(1.1, 1.2),
    punch(cam(), 0.05),
    confetti(view, {at: [0, -200], n: 56}),
    slam.slam('이거지?!', M.gold),
    hat.hop(),
    delay(0.3, cap.say('!', '네 기호는…\n금색 별!', M.gold)),
  );
  yield* waitFor(0.4);
  hat.lookY(0);
  yield* all(bub.say('맞았으면 댓글에\n"별" 하나!'), hat.talk(0.9), slam.out());
  yield* waitFor(0.6);

  /* ═════════ 4. 비밀: 별은 9의 배수 칸에만 ═════════ */
  cue('scratch');
  yield* all(bub.say('어떻게 알았냐고?'), hat.talk(0.6), orb.root().opacity(0, 0.4), orb.root().scale(0.7, 0.4), hatTo(370, -690, 0.46, 0.5));
  yield* toBeat();
  cue('m:groove');
  yield* all(slam.slam('비밀 공개!', PINK), bub.hide());
  board().opacity(1);
  cells.forEach(c => c.opacity(0.22));
  cue('whoosh');
  yield* all(board().scale(1, 0.4), slam.out(), cap.say('비밀', '답은 언제나\n이 아홉 칸 중 하나', M.gold));
  const stars = [9, 18, 27, 36, 45, 54, 63, 72, 81];
  yield* toBeat(2);
  for (let i = 0; i < stars.length; i++) {
    const n = stars[i];
    cue(`ping${i}` as CueKind);
    cells[n].opacity(1);
    cellBox[n].stroke(M.gold);
    cellBox[n].lineWidth(5);
    cellBox[n].fill('#4A3410');
    yield* all(cells[n].scale(1.35, 0.12, easeOutCubic), waitFor(0.3));
    yield cells[n].scale(1.12, 0.3, easeOutCubic);
  }
  yield* cap.say('비밀', '9 · 18 · 27 … 81 전부 별!\n다른 별은 눈속임이야', M.gold);
  yield* waitFor(0.8);

  /* ═════════ 5. 왜 늘 9의 배수일까: 10묶음 블록 ═════════ */
  cue('whoosh');
  yield* all(board().opacity(0, 0.4), hatTo(-370, -600, 0.5, 0.5));
  let b = buildBars(3, 10, 7);
  const all37 = [...b.bars.flatMap(x => x.cubes), ...b.oneCubes];
  all37.forEach(c => c.scale(0));
  b.bars.forEach(x => x.label.opacity(0));
  b.onesLabel!.opacity(0);
  sumTxt().text('37 이라면?');
  yield* all(
    popIn(sumTxt(), 0.45, 0.6),
    sequence(0.018, ...all37.map(c => c.scale(1, 0.25, easeOutBack))),
    cap.say('왜?', '10 묶음 3개 + 낱개 7개', VIOLET),
  );
  cue('pop');
  yield* all(...b.bars.map(x => x.label.opacity(1, 0.3)), b.onesLabel!.opacity(1, 0.3));
  yield* waitFor(0.4);

  yield* all(cap.say('빼기', '3 + 7 = 10 개를 빼 볼게요', TEAL), sumTxt().text('37 − (3 + 7)', 0.3));
  cue('poof');
  yield* all(
    ...b.oneCubes.map((c, i) => delay(i * 0.04, all(c.y(c.y() - 260, 0.5, easeOutCubic), c.opacity(0, 0.5), c.rotation(90, 0.5)))),
    b.onesLabel!.opacity(0, 0.3),
  );
  yield* toBeat(2);
  for (const x of b.bars) {
    cue('tap');
    const top = x.cubes[9];
    top.fill(TEAL);
    yield* all(top.y(top.y() - 120, 0.28, easeOutCubic), top.opacity(0, 0.28), waitFor(0.3));
    x.label.text('9');
    x.label.fill(M.gold);
  }
  cue('chime');
  yield* all(
    cap.say('!', '묶음마다 9 개씩 남아요', M.gold),
    sumTxt().text('9 × 3 = 27', 0.3),
    ...b.bars.map(x => punch(x.node, 0.08)),
  );
  yield* waitFor(0.7);

  // 다른 수도 똑같다: 52 → 9 × 5, 81 → 9 × 8
  cue('swish');
  b = buildBars(5, 9, 0, VIOLET);
  b.bars.forEach(x => x.label.fill(M.gold));
  yield* all(sumTxt().text('52 → 9 × 5 = 45', 0.3), ...b.bars.map((x, i) => delay(i * 0.04, popIn(x.node, 0.3, 0.5))), cap.say('다른 수도?', '몇 묶음이든 묶음마다 9!', VIOLET));
  yield* waitFor(0.5);
  cue('swish');
  b = buildBars(8, 9, 0, VIOLET);
  b.bars.forEach(x => x.label.fill(M.gold));
  yield* all(sumTxt().text('81 → 9 × 8 = 72', 0.3), ...b.bars.map((x, i) => delay(i * 0.03, popIn(x.node, 0.3, 0.5))));
  yield* waitFor(0.5);
  cue('chime');
  yield* cap.say('정리', '답은 언제나 9 의 배수\n그래서 늘 별!', M.gold);
  yield* waitFor(0.9);

  /* ═════════ 6. 이제 네가 마술사: 커튼을 닫았다 연다 ═════════ */
  yield* curtains.close(0.7);
  blocks().opacity(0);
  sumTxt().opacity(0);
  tryN().opacity(1);
  hat.root().position([0, 250]);
  hat.root().scale(0.8);
  yield* all(curtains.open(0.8), cap.say('TRY', '이제 네가 마술사!', PINK), hat.hop());
  for (const card of tryCards) {
    cue('pop');
    yield* popIn(card, 0.4, 0.7);
    yield* waitFor(0.25);
  }
  yield* waitFor(1.4);

  /* ═════════ 7. 끝 · 다음 ═════════ */
  yield* toBeat();
  cue('m:outro');
  yield* all(...tryCards.map(c => popOut(c, 0.3)), cap.hide(), hatTo(0, 400, 0.7, 0.6));
  yield* all(end.show('NEXT  화면이 맞힌다 02', '어떤 수를 넣어도\n1089 가 된다?'), hat.hop());
  yield* waitFor(1.2);
  yield* finish(NAME, 0.4);
});
