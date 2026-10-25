import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';

const NAME = 'logRule';
const X0 = -430;
const L = 860;
const pos = (k: number) => X0 + L * Math.log10(k);
const TOP_Y = -250;
const BOT_Y = -130;
const H = 120;
const MINOR = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];

// 로그 눈금 자. up=true 면 눈금이 아래 모서리(맞닿는 쪽)에, 글자는 위쪽
function LogRuler(p: {up: boolean; color: string; r: any; x?: () => number; opacity?: number}) {
  const edge = p.up ? H / 2 : -H / 2;
  const dir = p.up ? -1 : 1;
  return (
    <Node ref={p.r} x={p.x} opacity={p.opacity ?? 0}>
      <Rect x={X0 + L / 2} width={L + 60} height={H} radius={10} fill={'#141B3D'} stroke={p.color} lineWidth={3} />
      {Array.from({length: 10}, (_, i) => i + 1).map(k => (
        <Node>
          <Line points={[[pos(k), edge], [pos(k), edge + dir * 40]]} stroke={C.ink} lineWidth={4} />
          <Txt x={pos(k)} y={edge + dir * 70} text={String(k)} fontFamily={FONT} fontSize={k === 10 ? 34 : 42} fontWeight={900} fill={p.color} />
        </Node>
      ))}
      {MINOR.map(k => (
        <Line points={[[pos(k), edge], [pos(k), edge + dir * 20]]} stroke={'#ffffff88'} lineWidth={3} />
      ))}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 2, series: '지수와 로그'});
  const title = addTitle(view, ['곱셈을 덧셈으로', '바꾸는 마법의 자'], C.amber);

  const shift = createSignal(0);
  const lin = createRef<Node>();
  const top = createRef<Node>();
  const bot = createRef<Node>();
  const cursor = createRef<Line>();
  const cursorTag = createRef<Txt>();
  const bA = createRef<Line>();
  const bB = createRef<Line>();
  const bC = createRef<Line>();
  const tA = createRef<Txt>();
  const tB = createRef<Txt>();
  const tC = createRef<Txt>();
  const cx = createSignal(pos(6));

  view.add(
    <Node ref={lin} y={-190} opacity={0}>
      <Rect width={920} height={H} radius={10} fill={"#141B3D"} stroke={C.dim} lineWidth={3} />
      {Array.from({length: 11}, (_, i) => (
        <Node>
          <Line points={[[X0 + i * 86, -H / 2], [X0 + i * 86, -H / 2 + 40]]} stroke={C.ink} lineWidth={4} />
          <Txt x={X0 + i * 86} y={14} text={String(i)} fontFamily={FONT} fontSize={34} fontWeight={900} fill={C.dim} />
        </Node>
      ))}
    </Node>,
  );
  view.add(
    <Node>
      <Node y={TOP_Y}>
        <LogRuler up r={top} color={C.teal} x={() => shift()} />
      </Node>
      <Node y={BOT_Y}>
        <LogRuler up={false} r={bot} color={C.amber} />
      </Node>
      <Line ref={cursor} points={() => [[cx(), TOP_Y - 110], [cx(), BOT_Y + 110]]} stroke={C.pink} lineWidth={6} shadowColor={C.pink} shadowBlur={18} end={0} />
      <Txt ref={cursorTag} x={() => cx()} y={BOT_Y + 160} text="" fontFamily={FONT} fontSize={58} fontWeight={900} fill={C.pink} opacity={0} />
      {/* 길이 괄호 */}
      <Line ref={bB} points={() => [[pos(1) + shift(), TOP_Y - 150], [pos(3) + shift(), TOP_Y - 150]]} stroke={C.teal} lineWidth={10} lineCap="round" end={0} shadowColor={C.teal} shadowBlur={14} />
      <Txt ref={tB} x={() => (pos(1) + pos(3)) / 2 + shift()} y={TOP_Y - 190} text="3 의 길이" fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.teal} opacity={0} />
      <Line ref={bA} points={[[pos(1), TOP_Y - 150], [pos(2), TOP_Y - 150]]} stroke={C.amber} lineWidth={10} lineCap="round" end={0} shadowColor={C.amber} shadowBlur={14} />
      <Txt ref={tA} x={(pos(1) + pos(2)) / 2} y={TOP_Y - 190} text="2 의 길이" fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.amber} opacity={0} />
      <Line ref={bC} points={[[pos(1), BOT_Y + 230], [pos(6), BOT_Y + 230]]} stroke={C.pink} lineWidth={10} lineCap="round" end={0} shadowColor={C.pink} shadowBlur={14} />
      <Txt ref={tC} x={(pos(1) + pos(6)) / 2} y={BOT_Y + 272} text="6 의 길이" fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.pink} opacity={0} />
    </Node>,
  );

  const eq = addEq(view, 250, 84);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 보통 자 → 로그 자
  cue('whoosh');
  yield* all(lin().opacity(1, 0.5), cap.say('01', '보통 자는 눈금 간격이 똑같아요'));
  yield* waitFor(1.2);
  yield* lin().opacity(0, 0.4);
  cue('whoosh');
  yield* all(bot().opacity(1, 0.5), cap.say('02', '이 자는 1, 2, 3 … 갈수록\n간격이 좁아져요', C.amber));
  yield* waitFor(1.4);
  cue('whoosh');
  yield* all(top().opacity(1, 0.5), cap.say('03', '똑같은 자를 하나 더 위에 놓고', C.teal));
  yield* waitFor(0.8);

  // 2. 2 × 3
  yield* cap.say('04', '2 × 3 을 해 볼게요\n위 자의 1 을 아래 자의 2 에 맞춰요', C.pink);
  cue('swish');
  yield* shift(pos(2) - pos(1), 1.2, easeInOutCubic);
  yield* waitFor(0.4);
  cx(pos(6));
  cursorTag().text('6');
  cue('swish');
  yield* cursor().end(1, 0.6, easeOutExpo);
  cue('boom');
  yield* all(cursorTag().opacity(1, 0.3), ring(view, [pos(6), TOP_Y], C.pink, 120), cap.say('05', '위 자의 3 아래를 보면… 6!', C.pink));
  yield* eq.set('2 × 3 = 6', C.ink, C.pink);
  yield* waitFor(1.4);

  // 3. 길이를 더했을 뿐
  yield* all(eq.hide(), cap.say('06', '사실 한 일은 길이 더하기', C.amber));
  yield* sequence(0.4, all(bA().end(1, 0.6), tA().opacity(1, 0.4)), all(bB().end(1, 0.6), tB().opacity(1, 0.4)));
  yield* waitFor(0.5);
  cue('chime');
  yield* all(bC().end(1, 0.8), tC().opacity(1, 0.4));
  yield* cap.say('07', '2 의 길이 + 3 의 길이 = 6 의 길이\n곱셈이 덧셈이 됐어요!', C.amber);
  yield* waitFor(2.2);

  // 4. 2 × 4
  yield* all(bA().opacity(0, 0.3), bB().opacity(0, 0.3), bC().opacity(0, 0.3), tA().opacity(0, 0.3), tB().opacity(0, 0.3), tC().opacity(0, 0.3), cursorTag().opacity(0, 0.3));
  yield* cap.say('08', '그대로 두고 위 자의 4 를 보면?', C.teal);
  cue('swish');
  yield* cx(pos(8), 0.8, easeInOutCubic);
  cursorTag().text('8');
  cue('pop');
  yield* all(cursorTag().opacity(1, 0.3), eq.set('2 × 4 = 8', C.ink, C.teal));
  yield* waitFor(1.4);

  // 5. 로그의 뜻
  yield* all(cursor().opacity(0, 0.3), cursorTag().opacity(0, 0.3));
  yield* eq.set('log 100 = 2', C.ink, C.amber);
  yield* cap.say('09', '눈금 길이의 정체 = log\n100 은 10 을 2번 곱한 수 → log 100 = 2', C.amber);
  yield* waitFor(2.6);
  yield* eq.set('log(a × b) = log a + log b', C.ink, C.amber);
  cue('boom');
  yield* all(flash(0.12), cap.say('10', '곱하면 "곱한 횟수"끼리 더해져요\n100 × 1000 → 2번 + 3번 = 5번', C.teal));
  yield* waitFor(2.6);
  yield* all(sparks(view, [0, 250], C.amber, 14, 260), cap.say('11', '계산기가 없던 시절엔\n이 자(계산자)로 곱셈을 했어요', C.pink));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  top().parent()!.parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', '이자를 잘게 쪼개면\n무한히 불어날까?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
