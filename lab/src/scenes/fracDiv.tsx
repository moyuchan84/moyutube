import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutExpo, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import type {Reference} from '@motion-canvas/core';
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

const NAME = 'fracDiv';
const LX = -360; // 끈 왼쪽 끝
const W = 720;
const TY = -330; // 끈 높이(가운데)
const H = 96;
const STEP = 120; // 1/3m (뒤 장면) = 1칸 (앞 장면)
const COLORS = [C.amber, C.teal];

// 끈을 잘라 생긴 도막: 칠한 칸 + 가운데 번호
function Pieces(p: {n: number; w: number; list: Rect[]; colors?: string[]}) {
  return (
    <>
      {Array.from({length: p.n}, (_, i) => {
        const color = (p.colors ?? COLORS)[i % 2];
        return (
          <Rect
            ref={el => (p.list[i] = el)}
            x={LX + p.w * (i + 0.5)}
            y={TY}
            width={p.w - 8}
            height={H - 8}
            radius={10}
            fill={color + 'aa'}
            stroke={color}
            lineWidth={3}
            shadowColor={color}
            shadowBlur={22}
            opacity={0}
          >
            <Txt text={String(i + 1)} fontFamily={FONT} fontSize={54} fontWeight={900} fill={'#ffffff'} shadowColor={'#000000aa'} shadowBlur={10} />
          </Rect>
        );
      })}
    </>
  );
}

// 끈 아래 눈금 + 숫자
function Ticks(p: {r: Reference<Node>; marks: {f: number; label: string; big?: boolean}[]}) {
  return (
    <Node ref={p.r} opacity={0}>
      {p.marks.map(m => (
        <>
          <Line
            points={[[LX + m.f * W, TY + H / 2], [LX + m.f * W, TY + H / 2 + (m.big ? 30 : 16)]]}
            stroke={m.big ? C.ink : C.dim}
            lineWidth={m.big ? 4 : 3}
          />
          {m.label ? (
            <Txt x={LX + m.f * W} y={TY + H / 2 + 62} text={m.label} fontFamily={FONT} fontSize={m.big ? 40 : 30} fontWeight={800} fill={m.big ? C.ink : C.dim} />
          ) : null}
        </>
      ))}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 2, series: '분수는 조각이다'});
  const title = addTitle(view, ['분수로 나누면', '왜 뒤집어 곱할까?'], C.teal);

  const stage = createRef<Node>();
  const rope = createRef<Rect>();
  const stick = createRef<Rect>();
  const stickTag = createRef<Txt>();
  const ticks6 = createRef<Node>();
  const ticks2 = createRef<Node>();
  const p2: Rect[] = []; // 6 ÷ 2
  const p3: Rect[] = []; // 2 ÷ 1/3
  const p23: Rect[] = []; // 2 ÷ 2/3
  const meter = createRef<Node>();

  view.add(
    <Node ref={stage}>
      <Rect ref={rope} x={LX + W / 2} y={TY} width={W} height={H} radius={12} fill={'#ffffff12'} stroke={C.ink} lineWidth={5} opacity={0} />
      <Pieces n={3} w={240} list={p2} />
      <Pieces n={6} w={120} list={p3} />
      <Pieces n={3} w={240} list={p23} colors={[C.violet, C.pink]} />
      <Ticks
        r={ticks6}
        marks={Array.from({length: 7}, (_, i) => ({f: i / 6, label: String(i), big: true}))}
      />
      <Ticks
        r={ticks2}
        marks={Array.from({length: 7}, (_, i) => ({
          f: i / 6,
          label: i === 0 ? '0' : i === 3 ? '1m' : i === 6 ? '2m' : '',
          big: i % 3 === 0,
        }))}
      />
      {/* 위에서 내려와 재는 막대 */}
      <Rect ref={stick} x={LX + 120} y={TY - 150} width={240} height={34} radius={17} fill={C.ink} shadowColor={C.ink} shadowBlur={20} opacity={0} />
      <Txt ref={stickTag} x={LX + 120} y={TY - 205} text="2" fontFamily={FONT} fontSize={46} fontWeight={900} fill={C.ink} opacity={0} />
      <Dim from={[LX, TY - 90]} to={[LX + W / 2, TY - 90]} label="1m 에 3번" color={C.amber} refs={{node: n => meter(n)}} />
    </Node>,
  );

  // 뒤집기 식: "2 ÷ 2/3"  →  "2 × 3/2"
  const flip = createRef<Node>();
  const op = createRef<Txt>();
  const op2 = createRef<Txt>();
  const top = createRef<Txt>();
  const bot = createRef<Txt>();
  const FY = 110;
  view.add(
    <Node ref={flip} y={FY} opacity={0}>
      <Txt x={-170} text="2" fontFamily={FONT} fontSize={110} fontWeight={900} fill={C.ink} />
      <Txt ref={op} x={-60} text="÷" fontFamily={FONT} fontSize={110} fontWeight={900} fill={C.coral} />
      <Txt ref={op2} x={-60} text="×" fontFamily={FONT} fontSize={110} fontWeight={900} fill={C.amber} opacity={0} />
      <Txt ref={top} x={70} y={-62} text="2" fontFamily={FONT} fontSize={88} fontWeight={900} fill={C.violet} />
      <Rect x={70} width={84} height={8} radius={4} fill={C.ink} />
      <Txt ref={bot} x={70} y={66} text="3" fontFamily={FONT} fontSize={88} fontWeight={900} fill={C.pink} />
    </Node>,
  );

  const eq = addEq(view, 110, 84);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  function* hop(list: Rect[], w: number, tag: string) {
    stickTag().text(tag);
    stick().width(w);
    stick().x(LX + w / 2);
    stickTag().x(LX + w / 2);
    yield* all(stick().opacity(1, 0.3), stickTag().opacity(1, 0.3));
    for (let i = 0; i < list.length; i++) {
      const cx = LX + w * (i + 0.5);
      yield* all(stick().x(cx, 0.32, easeInOutExpo), stickTag().x(cx, 0.32, easeInOutExpo));
      cue('tick');
      list[i].scale(0.6);
      yield* all(list[i].opacity(1, 0.18), list[i].scale(1, 0.3, easeOutBack), stick().y(TY - 120, 0.1).to(TY - 150, 0.18));
    }
    yield* all(stick().opacity(0, 0.3), stickTag().opacity(0, 0.3));
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 나눗셈 = 몇 번 들어가나 (6 ÷ 2)
  cue('whoosh');
  yield* all(rope().opacity(1, 0.5), ticks6().opacity(1, 0.5));
  yield* cap.say('01', '6 ÷ 2 는\n"6 안에 2 가 몇 번 들어갈까?"');
  yield* waitFor(0.4);
  yield* hop(p2, 240, '2');
  yield* eq.set('6 ÷ 2 = 3', C.ink, C.amber);
  yield* waitFor(1.2);

  // 2. 2m 를 1/3m 씩
  yield* all(
    eq.hide(),
    ...p2.map(p => p.opacity(0, 0.4)),
    ticks6().opacity(0, 0.4),
    cap.say('02', '이번엔 끈 2m 를\n1/3m 씩 자르면 몇 도막?', C.teal),
  );
  yield* ticks2().opacity(1, 0.5);
  yield* waitFor(0.6);
  yield* hop(p3, 120, '1/3');
  cue('boom');
  yield* all(eq.set('2 ÷ 1/3 = 6', C.ink, C.teal), punch(stage(), 0.03));
  yield* waitFor(1.2);

  // 3. 1m 에 3번 → 2m 면 2 × 3
  yield* cap.say('03', '1m 안에 1/3 이 3번', C.amber);
  yield* all(meter().opacity(1, 0.4), ...p3.slice(3).map(p => p.opacity(0.25, 0.4)));
  yield* waitFor(1.2);
  yield* cap.say('04', '2m 니까 3번씩 두 번\n2 × 3 = 6', C.amber);
  yield* all(meter().position([W / 2, 0], 0.7, easeInOutExpo), ...p3.slice(3).map(p => p.opacity(1, 0.4)), ...p3.slice(0, 3).map(p => p.opacity(0.25, 0.4)));
  yield* all(...p3.slice(0, 3).map(p => p.opacity(1, 0.4)), meter().opacity(0, 0.4));
  yield* eq.set('2 ÷ 1/3 = 2 × 3', C.ink, C.amber);
  cue('chime');
  yield* ring(view, [0, 110], C.amber, 380);
  yield* cap.say('05', '1/3 로 나누기 = 3 곱하기!', C.amber);
  yield* waitFor(1.6);

  // 4. 2/3m 씩이면?
  yield* all(eq.hide(), cap.say('06', '그럼 2/3m 씩 자르면?', C.violet));
  yield* all(...p3.map(p => p.opacity(0, 0.4)));
  yield* hop(p23, 240, '2/3');
  cue('boom');
  yield* all(eq.set('2 ÷ 2/3 = 3', C.ink, C.violet), punch(stage(), 0.03));
  yield* waitFor(1.1);
  yield* cap.say('07', '도막이 2배 길어져서\n횟수는 절반: 6 ÷ 2 = 3', C.violet);
  yield* waitFor(2);
  yield* cap.say('08', '× 3 을 하고 ÷ 2 를 한 것\n= × 3/2', C.pink);
  yield* eq.set('2 ÷ 2/3 = 2 × 3/2', C.ink, C.pink);
  yield* waitFor(1.8);

  // 5. 뒤집기
  yield* all(eq.hide(), cap.say('09', '그래서 분수로 나눌 땐', C.teal));
  cue('pop');
  flip().scale(0.7);
  yield* all(flip().opacity(1, 0.4), flip().scale(1, 0.5, easeOutBack));
  yield* waitFor(0.6);
  cue('whoosh');
  yield* all(
    top().position([70, 66], 0.9, easeInOutExpo),
    bot().position([70, -62], 0.9, easeInOutExpo),
    top().rotation(360, 0.9, easeInOutExpo),
    bot().rotation(360, 0.9, easeInOutExpo),
    op().opacity(0, 0.4),
    op().rotation(90, 0.6),
    op2().opacity(1, 0.6),
  );
  cue('boom');
  yield* all(
    cap.say('10', '뒤집어서 곱해요!', C.amber),
    flash(0.14),
    sparks(view, [70, FY], C.amber, 14, 170),
    punch(flip(), 0.08),
  );
  yield* waitFor(1.2);
  yield* cap.say('11', '"몇 번 들어갈까?"를\n한 번에 세는 방법이에요', C.teal);
  yield* waitFor(2.2);

  // 다음 편
  yield* wipe.cover();
  stage().opacity(0);
  flip().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT', '1m² 는\n왜 100cm² 가 아닐까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
