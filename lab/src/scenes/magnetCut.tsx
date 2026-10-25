import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, delay, easeInOutCubic, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import type {SimpleSignal} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addFlash,
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
import {addBokeh, addGlitchTitle, addIris, arrive, rand, reseed, shake} from '../fx';

// 과학 시즌 S5 — 자석을 반으로 자르면? (단편)
// 1) 흔한 오해: N 조각 하나, S 조각 하나 → 아니다. 자를 때마다 조각마다 N 과 S 가 다시 생긴다
// 2) 자석 속에는 아주 작은 자석들이 한 방향으로 줄 서 있다 → 어디를 잘라도 줄은 그대로라 양 끝이 N · S
// 3) 진짜 자석은 자르지 않는다 (깨지면 날카롭다). 그림으로만

const NAME = 'magnetCut';
const NRED = '#FF4B4B';
const SBLU = '#4F8BFF';
const W = 720;
const H = 130;

// 막대자석 조각 하나 (왼쪽 N · 오른쪽 S)
function Piece(o: {w: number; refFn: (n: Node) => void; x: number; opacity?: number; label?: boolean}) {
  const fs = Math.min(64, o.w * 0.32);
  return (
    <Node ref={o.refFn} x={o.x} opacity={o.opacity ?? 0}>
      <Rect x={-o.w / 4} width={o.w / 2} height={H} radius={[14, 0, 0, 14]} fill={NRED} />
      <Rect x={o.w / 4} width={o.w / 2} height={H} radius={[0, 14, 14, 0]} fill={SBLU} />
      <Rect width={o.w} height={H} radius={14} stroke={'#ffffff55'} lineWidth={3} />
      {o.label === false ? null : (
        <Node>
          <Txt x={-o.w / 4} text={'N'} fontFamily={FONT} fontSize={fs} fontWeight={900} fill={'#ffffff'} />
          <Txt x={o.w / 4} text={'S'} fontFamily={FONT} fontSize={fs} fontWeight={900} fill={'#ffffff'} />
        </Node>
      )}
    </Node>
  );
}

// 작은 자석 하나 (화살표 모양: 빨간 머리 N, 파란 꼬리 S)
function Mini(o: {x: number; y: number; ang: SimpleSignal<number>}) {
  return (
    <Node x={o.x} y={o.y} rotation={o.ang}>
      <Rect x={-14} width={28} height={16} radius={[8, 0, 0, 8]} fill={NRED} />
      <Rect x={14} width={28} height={16} radius={[0, 8, 8, 0]} fill={SBLU} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.coral);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 0. 훅: 막대자석 + 톱날 선 */
  const hookN = createRef<Node>();
  let hookP: Node;
  view.add(
    <Node ref={hookN} y={300} opacity={0}>
      <Piece w={W * 0.8} x={0} refFn={n => (hookP = n)} opacity={1} />
      <Line points={[[0, -120], [0, 120]]} stroke={C.amber} lineWidth={6} lineDash={[14, 10]} />
    </Node>,
  );

  /* 1~2. 자르기 */
  const BY = -260;
  const barN = createRef<Node>();
  const L0: Node[] = [];
  const L1: Node[] = [];
  const L2: Node[] = [];
  const g1 = createSignal(0);
  const g2 = createSignal(0);
  const cut = createRef<Line>();
  const guess = createRef<Node>();
  const w1 = W / 2;
  const w2 = W / 4;
  view.add(
    <Node ref={barN} y={BY} opacity={0}>
      <Piece w={W} x={0} refFn={n => (L0[0] = n)} opacity={1} />
      {[0, 1].map(j => (
        <Node x={() => g1() * (j - 0.5)}>
          <Piece w={w1} x={-W / 2 + (j + 0.5) * w1} refFn={n => (L1[j] = n)} />
        </Node>
      ))}
      {[0, 1, 2, 3].map(k => (
        <Node x={() => g1() * (Math.floor(k / 2) - 0.5) + g2() * ((k % 2) - 0.5)}>
          <Piece w={w2} x={-W / 2 + (k + 0.5) * w2} refFn={n => (L2[k] = n)} />
        </Node>
      ))}
      <Line ref={cut} points={[[0, -130], [0, 130]]} stroke={C.amber} lineWidth={8} shadowColor={C.amber} shadowBlur={20} end={0} />
      {/* 흔한 생각: N 따로 S 따로 */}
      <Node ref={guess} y={260} opacity={0}>
        <Rect x={-150} width={200} height={90} radius={14} fill={NRED} />
        <Txt x={-150} text={'N'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={'#fff'} />
        <Rect x={150} width={200} height={90} radius={14} fill={SBLU} />
        <Txt x={150} text={'S'} fontFamily={FONT} fontSize={56} fontWeight={900} fill={'#fff'} />
        <Txt y={100} text={'이렇게 될까?'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.dim} />
      </Node>
    </Node>,
  );

  /* 3. 속을 들여다보기: 작은 자석들 */
  const inN = createRef<Node>();
  const COLS = 10;
  const ROWS = 3;
  const DXm = 66;
  const DYm = 56;
  reseed(4242);
  const minis = Array.from({length: COLS * ROWS}, (_, i) => ({
    c: i % COLS,
    r: Math.floor(i / COLS),
    a: createSignal((rand() - 0.5) * 360),
  }));
  const split = createSignal(0);
  const inCut = createRef<Line>();
  const endTags = createRef<Node>();
  const midTags = createRef<Node>();
  const IW = COLS * DXm + 30;
  const IH = ROWS * DYm + 40;
  view.add(
    <Node ref={inN} y={-280} opacity={0}>
      {[0, 1].map(side => (
        <Node x={() => (side ? 1 : -1) * split()}>
          <Rect
            x={side ? IW / 4 : -IW / 4}
            width={IW / 2}
            height={IH}
            radius={side ? [0, 20, 20, 0] : [20, 0, 0, 20]}
            fill={'#20263F'}
            stroke={'#ffffff44'}
            lineWidth={4}
          />
          {minis
            .filter(m => (m.c < COLS / 2 ? 0 : 1) === side)
            .map(m => (
              <Mini x={(m.c - (COLS - 1) / 2) * DXm} y={(m.r - (ROWS - 1) / 2) * DYm} ang={m.a} />
            ))}
        </Node>
      ))}
      <Line ref={inCut} points={[[0, -IH / 2 - 30], [0, IH / 2 + 30]]} stroke={C.amber} lineWidth={8} shadowColor={C.amber} shadowBlur={20} end={0} />
      {[
        {ref: endTags, tags: [{x: -IW / 2 + 30, t: 'N', c: NRED, s: -1}, {x: IW / 2 - 30, t: 'S', c: SBLU, s: 1}]},
        {ref: midTags, tags: [{x: -40, t: 'S', c: SBLU, s: -1}, {x: 40, t: 'N', c: NRED, s: 1}]},
      ].map(g => (
      <Node ref={g.ref} opacity={0}>
        {g.tags.map(e => (
          <Txt
            x={() => e.x + e.s * split()}
            y={-IH / 2 - 50}
            text={e.t}
            fontFamily={FONT}
            fontSize={60}
            fontWeight={900}
            fill={e.c}
            shadowColor={e.c}
            shadowBlur={20}
          />
        ))}
      </Node>
      ))}
    </Node>,
  );

  /* 4. 다시 붙이기 */
  const snapN = createRef<Node>();
  const snapG = createSignal(160);
  view.add(
    <Node ref={snapN} y={-280} opacity={0}>
      <Node x={() => -snapG()}>
        <Piece w={w1} x={-w1 / 2} refFn={() => {}} opacity={1} />
      </Node>
      <Node x={() => snapG()}>
        <Piece w={w1} x={w1 / 2} refFn={() => {}} opacity={1} />
      </Node>
      <Txt y={150} text={'S 와 N 은 서로 끌어당겨요'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.amber} />
    </Node>,
  );

  const card = bigCard('잘라도 조각마다 N 과 S!', C.coral, 62);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['자석을 반으로', '자르면?'], {y: -430, accent: C.coral});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 1, series: '단편', brand: '보면 풀리는 과학'});
  const flash = addFlash(view);
  const wipe = addWipe(view);

  const doCut = function* (line: Line) {
    cue('whoosh');
    line.end(0);
    line.opacity(1);
    yield* line.end(1, 0.35, easeOutExpo);
    cue('boom');
    yield* all(flash(0.12), line.opacity(0, 0.4));
  };

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  yield* all(title.dock(), waitFor(0.4));
  yield* all(hookN().opacity(0, 0.4), hookN().scale(1.3, 0.4));
  hookN().remove();

  /* ═════════ 1. 퀴즈 ═════════ */
  yield* arrive(barN(), 0.8);
  yield* cap.say('퀴즈', '막대자석을 반으로 자르면\nN 조각 하나, S 조각 하나?', C.coral);
  yield* popIn(guess(), 0.5, 0.7);
  yield* waitFor(1.4);
  yield* all(guess().opacity(0, 0.3), cap.say('!', '잘라 볼게요!', C.amber));
  title.group().opacity(0);

  /* ═════════ 2. 자르기 ═════════ */
  yield* doCut(cut());
  L0[0].opacity(0);
  L1.forEach(p => p.opacity(1));
  yield* all(g1(90, 0.7, easeOutBack), shake(barN(), 8, 0.3));
  cue('pop');
  yield* cap.say('01', '조각마다 N 과 S 가\n다시 생겨요!', C.coral);
  yield* waitFor(1.4);
  yield* cap.say('02', '한 번 더 잘라도?', C.amber);
  // 두 조각의 가운데를 동시에 자른다
  const cutA = createRef<Line>();
  const cutB = createRef<Line>();
  barN().add(
      <Line ref={cutA} x={() => -w1 / 2 - g1() / 2} points={[[0, -130], [0, 130]]} stroke={C.amber} lineWidth={8} shadowColor={C.amber} shadowBlur={20} end={0} />,
  );
  barN().add(
      <Line ref={cutB} x={() => w1 / 2 + g1() / 2} points={[[0, -130], [0, 130]]} stroke={C.amber} lineWidth={8} shadowColor={C.amber} shadowBlur={20} end={0} />,
  );
  yield* all(doCut(cutA()), doCut(cutB()));
  L1.forEach(p => p.opacity(0));
  L2.forEach(p => p.opacity(1));
  yield* all(g2(50, 0.7, easeOutBack), g1(140, 0.7, easeOutBack));
  cue('chime');
  yield* cap.say('03', '네 조각 모두 N 과 S!\nN 만 있는 자석은 없어요', C.teal);
  yield* waitFor(1.8);

  /* ═════════ 3. 왜? ═════════ */
  yield* wipe.cover();
  barN().opacity(0);
  inN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('04', '쇠붙이 속에는\n아주 작은 자석들이 있어요', C.dim);
  yield* waitFor(1.4);
  cue('riser');
  yield* all(
    cap.say('05', '이 작은 자석들이\n한 방향으로 줄 서면 = 자석!', C.coral),
    sequence(0.03, ...minis.map(m => m.a(0, 0.7, easeInOutCubic))),
  );
  yield* all(popIn(endTags(), 0.5, 0.7));
  yield* waitFor(1.2);
  yield* cap.say('06', '가운데를 잘라도\n줄은 그대로예요', C.amber);
  yield* doCut(inCut());
  yield* split(70, 0.8, easeOutBack);
  cue('pop');
  yield popIn(midTags(), 0.5, 0.7);
  yield* cap.say('07', '그래서 자른 자리에\n새 N 과 S 가 생겨요', C.teal);
  yield* waitFor(1.8);

  /* ═════════ 4. 다시 붙이기 ═════════ */
  yield* wipe.cover();
  inN().opacity(0);
  snapN().opacity(1);
  yield* wipe.reveal();
  yield* cap.say('08', '두 조각을 다시 가까이 대면?', C.amber);
  yield* snapG(40, 1.0, easeInOutCubic);
  cue('boom');
  yield* all(snapG(0, 0.12), delay(0.12, shake(snapN(), 10, 0.3)));
  yield* cap.say('08', '찰칵! 다시 하나가 돼요', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  snapN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('주의', '진짜 자석은 자르지 마세요\n(깨지면 날카로워요)', C.coral));
  yield* all(shine(card), sparks(view, [0, -420], C.coral, 14, 300));
  yield* waitFor(1.2);
  yield* all(cap.hide(), end.show('보면 풀리는 과학', '다음 실험도\n기대해 주세요!'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
