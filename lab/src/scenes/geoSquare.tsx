import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeOutBack, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, punch, ring, sparks} from '../motion';

const NAME = 'geoSquare';
const S = 560;
const CY = -250;
const HALF_COL = [C.amber, C.teal, C.violet, C.pink, C.coral];
const FR = ['1/2', '1/4', '1/8', '1/16', '1/32', '1/64', '1/128', '1/256', '1/512', '1/1024'];

type Box = {x: number; y: number; w: number; h: number};

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const hud = addHud(view, {ep: 1, total: 4, series: '한 장면 고등수학'});
  const title = addTitle(view, ['끝없이 더하는데', '답이 1 이라고?'], C.amber);

  const frame = createRef<Rect>();
  const one = createRef<Txt>();
  const partA = createRef<Node>();
  const partB = createRef<Node>();
  const sum = createSignal(0);
  const read = createRef<Txt>();

  view.add(
    <Node>
      <Node ref={partA} />
      <Node ref={partB} />
      <Rect ref={frame} y={CY} width={S} height={S} stroke={C.ink} lineWidth={6} opacity={0} />
      <Txt ref={one} y={CY} text="넓이 1" fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.dim} opacity={0} />
    </Node>,
  );
  view.add(<Txt ref={read} y={110} text={() => `합 = ${sum().toFixed(4)}`} fontFamily={FONT} fontSize={56} fontWeight={900} fill={C.amber} opacity={0} />);

  const eq = addEq(view, 200, 70);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  function* fillBox(parent: Node, b: Box, color: string, label: string | null, time = 0.45) {
    const r = (
      <Rect x={b.x} y={b.y} width={b.w} height={b.h} fill={color + 'aa'} stroke={'#0B1028'} lineWidth={4} scale={0} shadowColor={color} shadowBlur={16}>
        {label && Math.min(b.w, b.h) > 60 ? (
          <Txt text={label} fontFamily={FONT} fontSize={Math.min(64, Math.min(b.w, b.h) * 0.36)} fontWeight={900} fill={'#0B1028'} />
        ) : null}
      </Rect>
    ) as Rect;
    parent.add(r);
    cue('pop');
    yield* r.scale(1, time, easeOutBack);
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 반씩
  cue('whoosh');
  yield* all(frame().opacity(1, 0.5), one().opacity(1, 0.5), cap.say('01', '넓이가 1 인 정사각형'));
  yield* waitFor(0.8);
  yield* one().opacity(0, 0.3);
  let rem: Box = {x: 0, y: CY, w: S, h: S};
  const take = (k: number): Box => {
    // 짝수 번째는 왼쪽 절반, 홀수 번째는 위쪽 절반을 칠하고 나머지로 간다
    if (k % 2 === 0) {
      const f = {x: rem.x - rem.w / 4, y: rem.y, w: rem.w / 2, h: rem.h};
      rem = {x: rem.x + rem.w / 4, y: rem.y, w: rem.w / 2, h: rem.h};
      return f;
    }
    const f = {x: rem.x, y: rem.y - rem.h / 4, w: rem.w, h: rem.h / 2};
    rem = {x: rem.x, y: rem.y + rem.h / 4, w: rem.w, h: rem.h / 2};
    return f;
  };
  yield* all(read().opacity(1, 0.3), cap.say('02', '절반을 칠해요: 1/2', C.amber));
  yield* all(fillBox(partA(), take(0), HALF_COL[0], '1/2'), sum(0.5, 0.4));
  yield* waitFor(0.6);
  yield* cap.say('03', '남은 곳의 절반: 1/4', C.teal);
  yield* all(fillBox(partA(), take(1), HALF_COL[1], '1/4'), sum(0.75, 0.4));
  yield* waitFor(0.6);
  yield* cap.say('04', '또 남은 곳의 절반… 계속!', C.violet);
  let total = 0.75;
  for (let k = 2; k < 10; k++) {
    total += Math.pow(0.5, k + 1);
    yield* all(fillBox(partA(), take(k), HALF_COL[k % 5], FR[k], 0.3), sum(total, 0.3));
  }
  yield* waitFor(0.4);
  cue('boom');
  yield* all(punch(view, 0.02), cap.say('05', '끝없이 더해도 네모 밖으론 못 나가요\n남은 틈이 0 으로 → 합은 1', C.amber));
  yield* sum(1, 0.8);
  yield* all(read().opacity(0, 0.3), eq.set('1/2 + 1/4 + 1/8 + … = 1', C.ink, C.amber), flash(0.12));
  yield* waitFor(1.8);

  // 2. 1/4 씩
  yield* all(partA().opacity(0, 0.4), eq.hide(), cap.say('06', '이번엔 1/4 씩 줄어들면?', C.pink));
  let q: Box = {x: 0, y: CY, w: S, h: S};
  const cols = [C.amber, C.teal, C.violet];
  for (let k = 0; k < 5; k++) {
    const w = q.w / 2;
    const h = q.h / 2;
    const tl = {x: q.x - w / 2, y: q.y - h / 2, w, h};
    const tr = {x: q.x + w / 2, y: q.y - h / 2, w, h};
    const bl = {x: q.x - w / 2, y: q.y + h / 2, w, h};
    const lab = k === 0 ? '1/4' : k === 1 ? '1/16' : null;
    yield* all(
      fillBox(partB(), tl, cols[0], lab, 0.35),
      fillBox(partB(), tr, cols[1], null, 0.35),
      fillBox(partB(), bl, cols[2], null, 0.35),
    );
    q = {x: q.x + w / 2, y: q.y + h / 2, w, h};
    if (k === 0) {
      yield* cap.say('07', '세 조각 중 하나만 노랑\n나머지 한 칸에서 또 반복', C.amber);
      yield* waitFor(0.6);
    }
  }
  yield* waitFor(0.4);
  cue('boom');
  yield* all(ring(view, [0, CY], C.amber, 320), cap.say('08', '세 색이 똑같이 나눠 가지니\n노랑은 전체의 1/3!', C.amber));
  yield* eq.set('1/4 + 1/16 + 1/64 + … = 1/3', C.ink, C.amber);
  yield* waitFor(1.8);

  // 3. 공식
  yield* eq.set('첫 항 ÷ (1 − 비율)', C.ink, C.teal);
  yield* cap.say('09', '(1/2) ÷ (1 − 1/2) = 1\n(1/4) ÷ (1 − 1/4) = 1/3', C.teal);
  yield* waitFor(2.4);
  yield* all(sparks(view, [0, 200], C.teal, 14, 240), cap.say('10', '비율이 1 보다 작으면\n무한히 더해도 끝이 있어요 = 무한등비급수', C.teal));
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  frame().parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  02', '검사가 양성인데\n진짜일 확률은 9%?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
