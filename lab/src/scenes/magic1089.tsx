import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import type {CueKind} from '../motion';
import {FONT} from '../style';
import {C, addCaption, addEnd, addFlash, addHud, begin, capLog, cue, finish, popIn, popOut, punch} from '../motion';
import {shake} from '../fx';
import {addTimer} from '../sci';
import {BAR, M, QBox, addBubble, addClock, addCurtains, addHat, addSlam, addStage, confetti, toBeat} from '../magic';

// 마술의 비밀 「화면이 맞힌다」 2편 — 어떤 수를 넣어도 1089
// 1) 세 자리 수 (첫 숫자와 끝 숫자가 2 이상 차이) → 뒤집어서 큰 수 − 작은 수 → 그 답을 뒤집어 더하기
// 2) 처음부터 봉투에 넣어 둔 카드: 1089
// 3) 비밀: 뺀 답은 198 · 297 · … · 891 여덟 가지뿐 (가운데 9, 양 끝 합 9)
// 4) 왜: 자리별로 더하면 일 9 · 십 18 · 백 9 → 900 + 180 + 9 = 1089
// 수학 확인: lab/MAGIC.md 12절 (100~999 중 첫 · 끝 숫자 차 2 이상 모두)

const NAME = 'magic1089';
const VIOLET = '#A98BFF';
const TEAL = '#4FE3D0';
const PINK = '#FF6FB5';
const PAPER = '#FFF4DC';

export default makeScene2D(function* (view) {
  begin();
  const clock = addClock();
  yield clock.run();
  addStage(view, clock.t);

  const cam = createRef<Node>();
  view.add(<Node ref={cam} />);

  /* ── 단계 화면 ── */
  const spinning = createSignal(1);
  const digit = (k: number, lo: number) => () =>
    spinning() ? String(lo + ((Math.floor(clock.t() * 13) + k * 4) % (10 - lo))) : '?';
  const row1 = createRef<Node>();
  const row2 = createRef<Node>();
  const row3 = createRef<Node>();
  const op = (s: string, size = 96, fill = C.ink) => <Txt text={s} fontFamily={FONT} fontSize={size} fontWeight={900} fill={fill} />;
  const COLS = [VIOLET, TEAL, PINK];
  cam().add(
    <Node y={-60}>
      <Node ref={row1} opacity={0}>
        {[0, 1, 2].map(k => (
          <Node x={(k - 1) * 216}>{QBox({color: COLS[k], w: 190, h: 240, text: digit(k, k ? 0 : 1)})}</Node>
        ))}
        <Txt y={190} text={'첫 숫자와 끝 숫자는\n2 이상 차이 나게'} fontFamily={FONT} fontSize={46} fontWeight={800} lineHeight={62} fill={M.lilac} textAlign="center" />
        <Txt y={320} text={'예) 742 좋아요 · 343 은 안 돼요'} fontFamily={FONT} fontSize={38} fontWeight={800} fill={'#B9A9E6'} />
      </Node>
      <Node ref={row2} opacity={0}>
        {[...COLS, '', ...[...COLS].reverse()].map((c, i) => (
          <Node x={(i - 3) * 128} y={-90}>
            {c ? QBox({color: c, w: 108, h: 140}) : op('→', 80, M.gold)}
          </Node>
        ))}
        <Txt y={70} text={'큰 수 − 작은 수'} fontFamily={FONT} fontSize={72} fontWeight={900} fill={C.ink} />
        <Txt y={170} text={'예) 742 − 247'} fontFamily={FONT} fontSize={42} fontWeight={800} fill={'#B9A9E6'} />
      </Node>
      <Node ref={row3} opacity={0}>
        <Node x={-200} y={-60}>{QBox({color: M.gold, w: 260, h: 150, text: () => '답', fontSize: 72})}</Node>
        <Node y={-60}>{op('+', 96)}</Node>
        <Node x={200} y={-60}>{QBox({color: M.gold, w: 260, h: 150, text: () => '거꾸로', fontSize: 58})}</Node>
        <Node x={-110} y={110}>{op('=', 96)}</Node>
        <Node x={60} y={110}>{QBox({color: PINK, w: 230, h: 150})}</Node>
        <Txt y={250} text={'예) 495 + 594'} fontFamily={FONT} fontSize={42} fontWeight={800} fill={'#B9A9E6'} />
      </Node>
    </Node>,
  );

  /* ── 예언 봉투 (안에 1089 카드) ── */
  const env = createRef<Node>();
  const flap = createRef<Node>();
  const card = createRef<Node>();
  const glow = createRef<Circle>();
  const EW = 520;
  const EH = 340;
  cam().add(
    <Node ref={env} opacity={0}>
      <Circle ref={glow} size={620} fill={M.gold + '30'} shadowColor={M.gold} shadowBlur={80} scale={0.8} zIndex={-3} />
      <Rect width={EW} height={EH} radius={18} fill={'#E9DCC0'} zIndex={-2} />
      <Node ref={card} zIndex={-1}>
        <Rect width={440} height={300} radius={20} fill={PAPER} stroke={M.gold} lineWidth={6} />
        <Txt y={-95} text={'내 예언'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={'#7A5A20'} />
        <Txt y={25} text={'1089'} fontFamily={FONT} fontSize={150} fontWeight={900} fill={'#C0392B'} />
      </Node>
      <Rect width={EW} height={EH} radius={18} fill={PAPER} stroke={'#C9B48A'} lineWidth={4} />
      <Line points={[[-EW / 2 + 10, EH / 2 - 10], [0, 20], [EW / 2 - 10, EH / 2 - 10]]} stroke={'#C9B48A'} lineWidth={4} />
      <Node ref={flap} y={-EH / 2}>
        <Line points={[[-EW / 2, 0], [EW / 2, 0], [0, 210]]} closed fill={'#F3E6C8'} stroke={'#C9B48A'} lineWidth={4} />
        <Circle y={200} size={92} fill={'#C0392B'} stroke={'#8E1E14'} lineWidth={5}>
          <Txt text={'?'} fontFamily={FONT} fontSize={60} fontWeight={900} fill={PAPER} />
        </Circle>
      </Node>
    </Node>,
  );

  /* ── 비밀 1: 예시 셋 ── */
  const exN = createRef<Node>();
  const exRows: Node[] = [];
  const exGold: Txt[] = [];
  const EX = [
    ['742 − 247 = 495', '495 + 594 ='],
    ['831 − 138 = 693', '693 + 396 ='],
    ['961 − 169 = 792', '792 + 297 ='],
  ];
  cam().add(
    <Node ref={exN}>
      {EX.map(([a, b], i) => (
        <Node ref={el => (exRows[i] = el)} y={-430 + i * 230} opacity={0}>
          <Rect width={940} height={200} radius={28} fill={'#2A1752dd'} stroke={'#ffffff22'} lineWidth={2} />
          <Txt x={-130} y={-38} text={a} fontFamily={FONT} fontSize={50} fontWeight={800} fill={C.ink} />
          <Txt x={-180} y={40} text={b} fontFamily={FONT} fontSize={50} fontWeight={800} fill={'#CFC4F2'} />
          <Txt ref={el => (exGold[i] = el)} x={300} y={8} text={'1089'} fontFamily={FONT} fontSize={110} fontWeight={900} fill={M.gold} shadowColor={M.gold + '99'} shadowBlur={30} scale={0} />
        </Node>
      ))}
    </Node>,
  );

  /* ── 비밀 2: 뺀 답은 여덟 가지뿐 ── */
  const eightN = createRef<Node>();
  const eight: Node[] = [];
  const mids: Txt[] = [];
  const ends: Txt[][] = [];
  const DIFFS = [198, 297, 396, 495, 594, 693, 792, 891];
  cam().add(
    <Node ref={eightN} y={-260} opacity={0}>
      {DIFFS.map((d, i) => {
        const s = String(d);
        return (
          <Node ref={el => (eight[i] = el)} x={-345 + (i % 4) * 230} y={Math.floor(i / 4) * 190} opacity={0.15}>
            <Rect width={210} height={160} radius={24} fill={'#2A1752dd'} stroke={'#ffffff33'} lineWidth={2} />
            {[0, 1, 2].map(k => (
              <Txt
                ref={el => {
                  if (k === 1) mids[i] = el;
                  else (ends[i] ??= []).push(el);
                }}
                x={(k - 1) * 54}
                text={s[k]}
                fontFamily={FONT}
                fontSize={88}
                fontWeight={900}
                fill={C.ink}
              />
            ))}
          </Node>
        );
      })}
    </Node>,
  );

  /* ── 비밀 3: 자리별 덧셈 495 + 594 ── */
  const colN = createRef<Node>();
  const colRes: Txt[] = [];
  const colHi: Rect[] = [];
  const total = createRef<Txt>();
  const CX = [-230, 0, 230];
  const TOP = ['4', '9', '5'];
  const BOT = ['5', '9', '4'];
  const RES = ['9', '18', '9'];
  cam().add(
    <Node ref={colN} y={-200} opacity={0}>
      {CX.map((x, k) => (
        <Node x={x}>
          <Rect ref={el => (colHi[k] = el)} y={30} width={190} height={560} radius={26} fill={'#ffffff10'} stroke={'#ffffff22'} lineWidth={2} />
          <Txt y={-200} text={['백', '십', '일'][k]} fontFamily={FONT} fontSize={44} fontWeight={800} fill={M.lilac} />
          <Txt y={-90} text={TOP[k]} fontFamily={FONT} fontSize={120} fontWeight={900} fill={k === 1 ? M.gold : C.ink} />
          <Txt y={50} text={BOT[k]} fontFamily={FONT} fontSize={120} fontWeight={900} fill={k === 1 ? M.gold : C.ink} />
          <Txt ref={el => (colRes[k] = el)} y={225} text={RES[k]} fontFamily={FONT} fontSize={110} fontWeight={900} fill={PINK} scale={0} />
        </Node>
      ))}
      <Txt x={-400} y={50} text={'+'} fontFamily={FONT} fontSize={120} fontWeight={900} fill={C.ink} />
      <Rect y={130} width={760} height={8} radius={4} fill={C.ink} />
      <Txt ref={total} y={420} fontFamily={FONT} fontSize={72} fontWeight={900} fill={M.gold} shadowColor={M.gold + '88'} shadowBlur={30} opacity={0} />
    </Node>,
  );

  /* ── 이제 네 차례 ── */
  const tryN = createRef<Node>();
  const tryCards: Node[] = [];
  const TRY = ['종이에 1089 를 몰래 써서\n접어 둬요', '세 자리 수로 뒤집어 빼고\n뒤집어 더하게 해요', '종이를 펼치면…\n"1089!"'];
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
      <Txt y={-70} text={'네 답,'} fontFamily={FONT} fontSize={130} fontWeight={900} fill={C.ink} stroke={'#3A0010'} lineWidth={12} strokeFirst />
      <Txt y={90} text={'미리 써 놨어'} fontFamily={FONT} fontSize={130} fontWeight={900} fill={M.gold} stroke={'#3A1A00'} lineWidth={12} strokeFirst shadowColor={M.gold + 'aa'} shadowBlur={40} />
      <Txt y={240} text={'종이랑 연필 준비!'} fontFamily={FONT} fontSize={52} fontWeight={800} fill={'#FFD9E4'} />
    </Node>,
  );
  const hat = addHat(view, clock.t, {x: 0, y: 300, scale: 1});
  const bub = addBubble(view, {x: 170, y: -540, tail: [-170, 90]});
  const slam = addSlam(view, -700);
  const cap = addCaption(view);
  const hud = addHud(view, {ep: 2, total: 4, series: '화면이 맞힌다', brand: '마술의 비밀'});
  const timer = addTimer(view, 'THINK');
  const end = addEnd(view);
  const flash = addFlash(view);

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
  function* envTo(x: number, y: number, s: number, t = 0.6) {
    yield* all(env().position([x, y], t, easeInOutCubic), env().scale(s, t, easeInOutCubic));
  }

  /* ═════════ 0. 훅 → 커튼이 열리면 무대 위에 봉인된 봉투 ═════════ */
  cue('m:intro');
  capLog('title', '네 답,|미리 써 놨어');
  hook().scale(0.9);
  yield* all(hook().scale(1, 0.5, easeOutBack), hat.enter());
  yield* hat.tap();
  env().position([140, 60]);
  env().scale(0.7);
  yield* all(
    curtains.open(1.0),
    hook().opacity(0, 0.5),
    hook().scale(1.3, 0.6, easeInCubic),
    hud.show(),
    env().opacity(1, 0.6),
    delay(0.3, hatTo(-330, -470, 0.72, 0.7)),
  );
  hat.look(1);
  yield* all(bub.say('정답은 벌써\n이 봉투 안에!'), hat.talk(0.9), punch(env(), 0.06));
  yield* waitFor(0.2);

  /* ═════════ 1. 단계: 세 자리 수 → 뒤집어 빼기 → 뒤집어 더하기 ═════════ */
  yield* toBeat();
  cue('m:build');
  cue('swish');
  row1().opacity(1);
  row1().scale(0.6);
  yield* all(row1().scale(1, 0.5, easeOutBack), bub.hide(), envTo(360, -560, 0.36, 0.5), cap.say('STEP 1', '세 자리 수를\n하나 생각해요', VIOLET));
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
  yield* all(row2().scale(1, 0.5, easeOutBack), cap.say('STEP 2', '거꾸로 뒤집은 수와\n큰 수에서 작은 수를 빼요', TEAL), hat.tap());
  timer.count(6);
  yield* timer.run(6);
  cue('pop');
  yield* punch(row2(), 0.06);

  cue('swish');
  yield* all(row2().opacity(0, 0.25), row2().y(-40, 0.25));
  row3().opacity(1);
  row3().scale(0.6);
  yield* all(row3().scale(1, 0.5, easeOutBack), cap.say('STEP 3', '그 답을 뒤집어서\n더해요', M.gold), hat.tap());
  timer.count(5);
  yield* timer.run(5, {
    3: () => cap.say('TIP', '천천히 하고 싶으면\n화면을 꾹 눌러 멈춰요', '#8E7BD6'),
  });
  cue('pop');
  yield* punch(row3(), 0.06);
  timer.node().opacity(0);

  /* ═════════ 2. 공개: 봉투 드럼롤 → 1089 ═════════ */
  yield* toBeat();
  cue('m:hush');
  cue('whoosh');
  yield* all(row3().opacity(0, 0.3), row3().scale(0.8, 0.3), cap.hide(), envTo(0, 0, 1.15, 0.7), hatTo(-310, 430, 0.8, 0.7));
  hat.look(0.6);
  hat.lookY(-0.8);
  yield* all(bub.say('다 했지?\n네 답은…'), hat.talk(0.9));
  yield* toBeat();
  cue('roll');
  yield* all(
    glow().scale(1.4, BAR, easeInCubic),
    hat.tap(),
    delay(0.9, hat.tap()),
    delay(1.2, shake(env(), 10, 1.0)),
    bub.hide(),
  );
  cue('hit');
  yield* flash(0.5);
  flap().zIndex(-1);
  card().zIndex(0);
  yield* all(
    flap().scale.y(-1, 0.25, easeOutCubic),
    delay(0.12, card().y(-300, 0.5, easeOutBack)),
    glow().scale(1.1, 1.2),
    punch(cam(), 0.05),
    confetti(view, {at: [0, -320], n: 56}),
    slam.slam('1089 맞지?!', M.gold),
    hat.hop(),
    delay(0.3, cap.say('!', '네 답은…\n1089!', M.gold)),
  );
  yield* all(card().scale(1.15, 0.4, easeOutCubic), card().rotation(-4, 0.4));
  hat.lookY(0);
  yield* all(bub.say('맞았으면 댓글에\n"1089"!'), hat.talk(0.9), slam.out());
  yield* waitFor(0.5);

  /* ═════════ 3. 비밀: 어떤 수든 1089 ═════════ */
  cue('scratch');
  yield* all(bub.say('어떻게 알았냐고?'), hat.talk(0.6), env().opacity(0, 0.4), env().scale(0.7, 0.4), hatTo(370, -690, 0.46, 0.5));
  yield* toBeat();
  cue('m:groove');
  yield* all(slam.slam('비밀 공개!', PINK), bub.hide());
  cue('whoosh');
  yield* all(slam.out(), cap.say('비밀', '어떤 수로 해도…', VIOLET));
  for (let i = 0; i < 3; i++) {
    cue('swish');
    exRows[i].scale(0.8);
    yield* all(exRows[i].opacity(1, 0.25), exRows[i].scale(1, 0.35, easeOutBack));
    cue(`ping${i * 3 + 2}` as CueKind);
    yield* all(exGold[i].scale(1.2, 0.2, easeOutCubic), waitFor(0.35));
    yield exGold[i].scale(1, 0.25);
  }
  cue('chime');
  yield* cap.say('비밀', '늘 1089!', M.gold);
  yield* waitFor(0.5);

  // 뺀 답은 여덟 가지뿐
  cue('whoosh');
  yield* all(...exRows.map(r => r.opacity(0, 0.35)), hatTo(-370, -690, 0.46, 0.5));
  eightN().opacity(1);
  yield* cap.say('왜?', '빼고 나온 답은\n딱 8 가지뿐', TEAL);
  yield* toBeat(2);
  for (let i = 0; i < 8; i++) {
    cue(`ping${i}` as CueKind);
    eight[i].opacity(1);
    yield* all(eight[i].scale(1.2, 0.1, easeOutCubic), waitFor(0.3));
    yield eight[i].scale(1, 0.25);
  }
  cue('pop');
  yield* all(
    ...mids.map(t => t.fill(M.gold, 0.3)),
    ...mids.map(t => punch(t, 0.25)),
    cap.say('!', '가운데는 늘 9\n양 끝을 더해도 9', M.gold),
  );
  yield* all(...ends.flat().map(t => t.fill(PINK, 0.3)));
  yield* waitFor(0.9);

  // 자리별로 더하면 9 · 18 · 9
  cue('whoosh');
  yield* all(eightN().opacity(0, 0.35), eightN().scale(0.9, 0.35));
  colN().scale(0.8);
  yield* all(colN().opacity(1, 0.3), colN().scale(1, 0.4, easeOutBack), cap.say('더하기', '뒤집어 더하면\n자리마다…', VIOLET));
  yield* toBeat(2);
  for (const k of [2, 1, 0]) {
    cue('tap');
    colHi[k].fill(M.gold + '30');
    colHi[k].stroke(M.gold);
    yield* all(colRes[k].scale(1, 0.3, easeOutBack), waitFor(0.45));
  }
  cue('chime');
  total().text('900 + 180 + 9 = 1089');
  yield* all(popIn(total(), 0.45, 0.6), cap.say('정리', '양 끝 9 · 가운데 18\n그래서 언제나 1089!', M.gold));
  yield* waitFor(1.1);

  /* ═════════ 4. 이제 네가 마술사 ═════════ */
  yield* curtains.close(0.7);
  colN().opacity(0);
  tryN().opacity(1);
  hat.root().position([0, 250]);
  hat.root().scale(0.8);
  yield* all(curtains.open(0.8), cap.say('TRY', '이제 네가 마술사!', PINK), hat.hop());
  for (const c of tryCards) {
    cue('pop');
    yield* popIn(c, 0.4, 0.7);
    yield* waitFor(0.2);
  }
  yield* waitFor(1.2);

  /* ═════════ 5. 끝 · 다음 ═════════ */
  yield* toBeat();
  cue('m:outro');
  yield* all(...tryCards.map(c => popOut(c, 0.3)), cap.hide(), hatTo(0, 400, 0.7, 0.6));
  yield* all(end.show('NEXT  화면이 맞힌다 03', '생각한 수는 사라지고\n4 만 남는다?'), hat.hop());
  yield* waitFor(1.2);
  yield* finish(NAME, 0.4);
});
