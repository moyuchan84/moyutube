import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import type {Reference} from '@motion-canvas/core';
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

const NAME = 'fracAdd';
const LX = -270; // 막대 왼쪽 끝
const W = 700;
const H = 104;
const X = (f: number) => LX + f * W;
const Y1 = -470;
const Y2 = -290;
const Y3 = -110;
const LABEL_X = LX - 100;

// 세로로 쌓은 분수 (분자 / 선 / 분모)
function Frac(p: {r: Reference<Node>; n: number | string; d: number | string; color: string; y: number; opacity?: number}) {
  const s = 62;
  return (
    <Node ref={p.r} x={LABEL_X} y={p.y} opacity={p.opacity ?? 0}>
      <Txt y={-s * 0.64} text={String(p.n)} fontFamily={FONT} fontSize={s} fontWeight={900} fill={p.color} />
      <Rect width={s * 1.0} height={6} radius={3} fill={p.color} />
      <Txt y={s * 0.68} text={String(p.d)} fontFamily={FONT} fontSize={s} fontWeight={900} fill={p.color} />
    </Node>
  );
}

// 막대 한 개: 바탕 + 나눔선 + 테두리
function Bar(p: {r: Reference<Node>; y: number; n: number; divs: Line[]}) {
  return (
    <Node ref={p.r} opacity={0}>
      <Rect x={X(0.5)} y={p.y} width={W} height={H} fill={'#ffffff10'} />
      {Array.from({length: p.n - 1}, (_, k) => (
        <Line
          ref={el => (p.divs[k] = el)}
          points={[[X((k + 1) / p.n), p.y - H / 2], [X((k + 1) / p.n), p.y + H / 2]]}
          stroke={C.ink}
          lineWidth={4}
          end={0}
        />
      ))}
      <Rect x={X(0.5)} y={p.y} width={W} height={H} stroke={C.ink} lineWidth={5} />
    </Node>
  );
}

// 칠한 조각
function Fill(p: {r: Reference<Rect>; y: number; a: number; b: number; color: string}) {
  return (
    <Rect
      ref={p.r}
      x={X((p.a + p.b) / 2)}
      y={p.y}
      width={(p.b - p.a) * W}
      height={H}
      fill={p.color + 'bb'}
      shadowColor={p.color}
      shadowBlur={26}
      opacity={0}
    />
  );
}

// 6조각으로 다시 자르는 선 (이미 있는 선은 빼고)
function Cuts(p: {y: number; at: number[]; lines: Line[]}) {
  return (
    <>
      {p.at.map((k, i) => (
        <Line
          ref={el => (p.lines[i] = el)}
          points={[[X(k / 6), p.y - H / 2 - 14], [X(k / 6), p.y + H / 2 + 14]]}
          stroke={C.pink}
          lineWidth={5}
          lineDash={[12, 8]}
          shadowColor={C.pink}
          shadowBlur={14}
          end={0}
        />
      ))}
    </>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 2, series: '분수는 조각이다'});
  const title = addTitle(view, ['1/2 + 1/3 은', '왜 2/5 가 아닐까?'], C.amber);

  const stage = createRef<Node>();
  const barA = createRef<Node>();
  const barB = createRef<Node>();
  const barW = createRef<Node>();
  const barR = createRef<Node>();
  const divA: Line[] = [];
  const divB: Line[] = [];
  const divW: Line[] = [];
  const divR: Line[] = [];
  const cutA: Line[] = [];
  const cutB: Line[] = [];
  const fA = createRef<Rect>();
  const fB = createRef<Rect>();
  const fW = createRef<Rect>();
  const mA = createRef<Rect>(); // 결과 막대로 옮겨 갈 복사본
  const mB = createRef<Rect>();
  const lA = createRef<Node>();
  const lB = createRef<Node>();
  const lA6 = createRef<Node>();
  const lB6 = createRef<Node>();
  const lW = createRef<Node>();
  const lR = createRef<Node>();
  const plus = createRef<Txt>();
  const equal = createRef<Txt>();
  const qmark = createRef<Txt>();
  const half = createRef<Line>();
  const strike = createRef<Line>();
  const halfTag = createRef<Txt>();

  view.add(
    <Node ref={stage}>
      <Fill r={fA} y={Y1} a={0} b={1 / 2} color={C.amber} />
      <Fill r={fB} y={Y2} a={0} b={1 / 3} color={C.teal} />
      <Fill r={fW} y={Y3} a={0} b={2 / 5} color={C.coral} />
      <Bar r={barA} y={Y1} n={2} divs={divA} />
      <Bar r={barB} y={Y2} n={3} divs={divB} />
      <Bar r={barW} y={Y3} n={5} divs={divW} />
      <Bar r={barR} y={Y3} n={6} divs={divR} />
      <Fill r={mA} y={Y1} a={0} b={1 / 2} color={C.amber} />
      <Fill r={mB} y={Y2} a={0} b={1 / 3} color={C.teal} />
      <Cuts y={Y1} at={[1, 2, 4, 5]} lines={cutA} />
      <Cuts y={Y2} at={[1, 3, 5]} lines={cutB} />
      <Frac r={lA} n={1} d={2} color={C.amber} y={Y1} />
      <Frac r={lB} n={1} d={3} color={C.teal} y={Y2} />
      <Frac r={lA6} n={3} d={6} color={C.amber} y={Y1} />
      <Frac r={lB6} n={2} d={6} color={C.teal} y={Y2} />
      <Frac r={lW} n={2} d={5} color={C.coral} y={Y3} />
      <Frac r={lR} n={5} d={6} color={C.ink} y={Y3} />
      <Txt ref={plus} x={LABEL_X - 82} y={(Y1 + Y2) / 2} text="+" fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.ink} opacity={0} />
      <Txt ref={equal} x={LABEL_X - 82} y={(Y2 + Y3) / 2} text="=" fontFamily={FONT} fontSize={64} fontWeight={900} fill={C.ink} opacity={0} />
      <Txt ref={qmark} x={LABEL_X + 52} y={Y3 - 50} text="?" fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.coral} opacity={0} />
      <Line
        ref={half}
        points={[[X(0.5), Y1 - H / 2 - 34], [X(0.5), Y3 + H / 2 + 34]]}
        stroke={C.pink}
        lineWidth={6}
        lineDash={[18, 12]}
        shadowColor={C.pink}
        shadowBlur={18}
        end={0}
      />
      <Txt ref={halfTag} x={X(0.5)} y={Y3 + H / 2 + 74} text="1/2 자리" fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.pink} opacity={0} />
      <Line
        ref={strike}
        points={[[LABEL_X - 50, Y3 + 50], [LABEL_X + 50, Y3 - 50]]}
        stroke={C.coral}
        lineWidth={9}
        lineCap="round"
        shadowColor={C.coral}
        shadowBlur={16}
        end={0}
      />
    </Node>,
  );

  const eq = addEq(view, 110, 88);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  const drawBar = (bar: Node, divs: Line[]) =>
    all(bar.opacity(1, 0.5), sequence(0.07, ...divs.map(l => l.end(1, 0.45, easeOutExpo))));
  function* pop(n: Node) {
    cue('pop');
    n.scale(0.5);
    yield* all(n.opacity(1, 0.3), n.scale(1, 0.45, easeOutBack));
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 1/2 와 1/3
  cue('whoosh');
  yield* drawBar(barA(), divA);
  yield* all(fA().opacity(1, 0.5), pop(lA()));
  yield* cap.say('01', '1/2 + 1/3 을 막대로 그려 봐요');
  cue('whoosh');
  yield* drawBar(barB(), divB);
  yield* all(fB().opacity(1, 0.5), pop(lB()), plus().opacity(1, 0.4));
  yield* waitFor(1.2);

  // 2. 위끼리 · 아래끼리 더하면 2/5 ?
  yield* cap.say('02', '위끼리, 아래끼리 더하면\n2/5 일까?', C.coral);
  cue('whoosh');
  yield* all(equal().opacity(1, 0.4), drawBar(barW(), divW));
  yield* all(fW().opacity(1, 0.5), pop(lW()), qmark().opacity(1, 0.4));
  yield* waitFor(1.2);

  // 3. 1/2 자리에 선을 그어 보면
  yield* cap.say('03', '1/2 자리에 선을 그어 보면…', C.pink);
  cue('swish');
  yield* half().end(1, 0.8, easeOutExpo);
  yield* halfTag().opacity(1, 0.3);
  yield* waitFor(0.6);
  cue('boom');
  yield* all(
    cap.say('04', '어? 1/2 보다 작아요!', C.coral),
    punch(stage(), 0.04),
    ring(stage(), [X(2 / 5), Y3], C.coral, 150),
  );
  yield* waitFor(1.4);
  yield* cap.say('05', '더했는데 줄어들 순 없죠\n2/5 는 틀린 답', C.coral);
  cue('swish');
  yield* strike().end(1, 0.4, easeOutExpo);
  yield* waitFor(1.4);

  // 4. 조각 크기가 다르다
  yield* all(
    half().opacity(0, 0.4),
    halfTag().opacity(0, 0.4),
    barW().opacity(0, 0.4),
    fW().opacity(0, 0.4),
    lW().opacity(0, 0.4),
    qmark().opacity(0, 0.4),
    strike().opacity(0, 0.4),
    equal().opacity(0, 0.4),
    cap.say('06', '1/2 조각과 1/3 조각은\n크기가 달라요', C.teal),
  );
  cue('pop');
  yield* all(fA().scale([1, 1.18], 0.3).to(1, 0.3), fA().shadowBlur(50, 0.3).to(26, 0.3));
  cue('pop');
  yield* all(fB().scale([1, 1.18], 0.3).to(1, 0.3), fB().shadowBlur(50, 0.3).to(26, 0.3));
  yield* waitFor(0.6);
  yield* cap.say('07', '크기가 다른 조각은\n그대로 세면 안 돼요', C.teal);
  yield* waitFor(1.4);

  // 5. 둘 다 6조각으로
  yield* cap.say('08', '둘 다 6조각으로 다시 잘라요', C.pink);
  cue('swish');
  yield* sequence(0.1, ...cutA.map(l => l.end(1, 0.4, easeOutExpo)));
  yield* all(lA().opacity(0, 0.25), pop(lA6()));
  cue('swish');
  yield* sequence(0.1, ...cutB.map(l => l.end(1, 0.4, easeOutExpo)));
  yield* all(lB().opacity(0, 0.25), pop(lB6()));
  yield* waitFor(1);
  yield* cap.say('09', '1/2 = 3/6, 1/3 = 2/6\n이제 조각 크기가 같아요', C.amber);
  yield* waitFor(1.6);

  // 6. 같은 조각끼리 모으기
  yield* cap.say('10', '같은 크기 조각끼리 모으면', C.amber);
  yield* all(equal().opacity(1, 0.4), drawBar(barR(), divR));
  mA().opacity(1);
  mB().opacity(1);
  cue('whoosh');
  yield* mA().y(Y3, 0.8, easeInOutExpo);
  cue('whoosh');
  yield* all(mB().y(Y3, 0.9, easeInOutExpo), mB().x(X((3 / 6 + 5 / 6) / 2), 0.9, easeInOutExpo));
  cue('boom');
  yield* all(pop(lR()), flash(0.14), sparks(stage(), [X(5 / 6), Y3], C.amber, 14, 150));
  yield* eq.set('3/6 + 2/6 = 5/6', C.ink, C.amber);
  cue('chime');
  yield* ring(view, [0, 110], C.amber, 400);
  yield* waitFor(1.4);

  // 7. 정리
  yield* cap.say('11', '조각 크기를 먼저 맞추기\n이걸 "통분"이라고 해요', C.teal);
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  stage().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', '분수로 나누면\n왜 뒤집어 곱할까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
