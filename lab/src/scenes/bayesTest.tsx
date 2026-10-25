import {Circle, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';
import {rand, reseed} from '../fx';

const NAME = 'bayesTest';
const COLS = 40;
const ROWS = 25;
const GAP = 24;
const CY = -280;
const gridPos = (i: number): [number, number] => [((i % COLS) - (COLS - 1) / 2) * GAP, CY + (Math.floor(i / COLS) - (ROWS - 1) / 2) * GAP];
const blockPos = (k: number, cols: number, n: number, gap: number): [number, number] => {
  const rows = Math.ceil(n / cols);
  return [((k % cols) - (cols - 1) / 2) * gap, CY + (Math.floor(k / cols) - (rows - 1) / 2) * gap];
};

// 1000명 중 10명이 병. 가상의 검사: 병이 있으면 늘 양성, 없으면 10%(99명)가 잘못 양성.
reseed(20261025);
const order = Array.from({length: 1000}, (_, i) => i).sort(() => rand() - 0.5);
const SICK = new Set(order.slice(0, 10));
const FALSE = order.slice(10, 109);
const FALSE2 = new Set(FALSE.slice(0, 10)); // 재검사에서도 잘못 양성 (99명의 약 10%)

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.coral);
  yield atmo.drift();
  const hud = addHud(view, {ep: 2, total: 4, series: '한 장면 고등수학'});
  const title = addTitle(view, ['검사가 양성인데', '진짜일 확률은 9%?'], C.coral);

  const dots: Circle[] = [];
  const grid = createRef<Node>();
  const count = createRef<Txt>();

  view.add(
    <Node ref={grid}>
      {Array.from({length: 1000}, (_, i) => (
        <Circle ref={el => (dots[i] = el)} position={gridPos(i)} size={14} fill={'#ffffff55'} scale={0} />
      ))}
    </Node>,
  );
  view.add(<Txt ref={count} y={80} fontFamily={FONT} fontSize={50} fontWeight={900} fill={C.ink} opacity={0} />);

  const eq = addEq(view, 200, 80);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  const sick = [...SICK].map(i => dots[i]);
  const fp = FALSE.map(i => dots[i]);
  const healthy = dots.filter((_, i) => !SICK.has(i));

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 1000명
  cue('whoosh');
  yield* all(...dots.map((d, i) => d.scale(1, 0.3 + (i % 40) * 0.012)), cap.say('01', '1000명이 있어요'));
  yield* waitFor(0.4);
  cue('pop');
  yield* all(...sick.map(d => all(d.fill(C.pink, 0.4), d.size(20, 0.4))), cap.say('02', '그중 병에 걸린 사람은 10명 (1%)', C.coral));
  yield* waitFor(1.4);

  // 2. 검사
  yield* cap.say('03', '가상의 검사: 병이 있으면 꼭 양성\n없어도 10% 는 잘못 양성', C.amber);
  yield* waitFor(1.4);
  cue('riser');
  yield* all(...fp.map((d, k) => all(d.fill(C.amber, 0.3 + k * 0.006), d.size(20, 0.4))));
  yield* waitFor(0.6);
  yield* cap.say('04', '양성이 나온 사람만 모아 보면', C.pink);
  const pos = [...sick, ...fp];
  cue('whoosh');
  yield* all(
    ...healthy.filter(d => !fp.includes(d)).map(d => d.opacity(0, 0.5)),
    ...pos.map((d, k) => all(d.position(blockPos(k, 11, 109, 40), 1.2, easeInOutCubic), d.size(28, 1.2))),
  );
  count().text('양성 109명 중 진짜 환자 10명');
  yield* count().opacity(1, 0.4);
  yield* waitFor(0.8);
  cue('boom');
  yield* all(flash(0.12), eq.set('10 ÷ 109 ≈ 9%', C.ink, C.coral), ring(view, [0, 200], C.coral, 300));
  yield* cap.say('05', '양성이어도 진짜일 확률은 9% 쯤!', C.coral);
  yield* waitFor(1.6);
  yield* cap.say('06', '병 없는 사람이 워낙 많아서\n10% 실수만으로도 99명이에요', C.amber);
  yield* waitFor(2.2);

  // 3. 재검사
  yield* all(eq.hide(), count().opacity(0, 0.3), cap.say('07', '양성인 109명만 한 번 더 검사하면?', C.teal));
  const stay = [...sick, ...FALSE.filter(i => FALSE2.has(i)).map(i => dots[i])];
  const gone = fp.filter(d => !stay.includes(d));
  cue('whoosh');
  yield* all(...gone.map(d => d.opacity(0, 0.5)));
  yield* all(...stay.map((d, k) => all(d.position(blockPos(k, 5, 20, 52), 1, easeInOutCubic), d.size(36, 1))));
  count().text('두 번 양성 20명 중 진짜 환자 10명');
  yield* count().opacity(1, 0.4);
  cue('boom');
  yield* all(eq.set('10 ÷ 20 = 50%', C.ink, C.teal), cap.say('08', '두 번 양성이면 50% 로 껑충!', C.teal));
  yield* waitFor(1.8);

  // 4. 조건부확률
  yield* eq.set('P(병 | 양성)', C.ink, C.amber);
  yield* all(sparks(view, [0, 200], C.amber, 14, 240), cap.say('09', '"양성인 사람들 중에서" 다시 세기\n이게 조건부확률이에요', C.amber));
  yield* waitFor(2.6);

  // 다음 편
  yield* wipe.cover();
  grid().opacity(0);
  count().opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  03', '벡터의 내적은\n그림자 길이?');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
