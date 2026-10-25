import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInCubic, easeOutBack, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addEq, addFlash, addHud, addTitle, addWipe, begin, cue, finish, ring, sparks} from '../motion';
import {shake} from '../fx';

const NAME = 'dominoProof';
const N = 10;
const BASE = -230;
const DX = 82;
const X0 = -400;
const COLS = [C.amber, C.teal, C.violet, C.pink, C.coral];

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.pink);
  yield atmo.drift();
  const hud = addHud(view, {ep: 4, total: 4, series: '한 장면 고등수학'});
  const title = addTitle(view, ['도미노로 하는', '무한 증명'], C.pink);

  const dom: Rect[] = [];
  const nums: Txt[] = [];
  const row = createRef<Node>();
  const dots = createRef<Txt>();
  const c1 = createRef<Txt>();
  const c2 = createRef<Txt>();
  const hand = createRef<Line>();

  view.add(
    <Node ref={row} opacity={0}>
      <Line points={[[-500, BASE], [500, BASE]]} stroke={'#ffffff44'} lineWidth={4} />
      {Array.from({length: N}, (_, i) => (
        <Node>
          <Rect
            ref={el => (dom[i] = el)}
            x={X0 + i * DX + 14}
            y={BASE}
            offset={[1, 1]}
            width={28}
            height={170}
            radius={4}
            fill={COLS[i % 5]}
            shadowColor={COLS[i % 5]}
            shadowBlur={12}
          />
          <Txt ref={el => (nums[i] = el)} x={X0 + i * DX} y={BASE + 40} text={String(i + 1)} fontFamily={FONT} fontSize={30} fontWeight={900} fill={C.dim} />
        </Node>
      ))}
      <Txt ref={dots} x={X0 + N * DX + 10} y={BASE - 50} text="…" fontFamily={FONT} fontSize={60} fontWeight={900} fill={C.dim} />
      <Line ref={hand} points={[[X0 - 130, BASE - 130], [X0 - 40, BASE - 130]]} stroke={C.ink} lineWidth={10} lineCap="round" endArrow arrowSize={20} opacity={0} />
    </Node>,
  );
  view.add(
    <Node>
      <Txt ref={c1} y={-90} text="(1) 첫 번째가 쓰러진다" fontFamily={FONT} fontSize={48} fontWeight={900} fill={C.amber} opacity={0} />
      <Txt ref={c2} y={-15} text="(2) 하나가 쓰러지면 다음 것도 쓰러진다" fontFamily={FONT} fontSize={44} fontWeight={900} fill={C.teal} opacity={0} />
    </Node>,
  );

  const eq = addEq(view, 200, 54);
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // 쓰러지는 도미노 (from 부터 to 직전까지). 마지막은 바닥까지
  function* fall(from: number, to: number, last = 90) {
    cue('riser');
    yield* sequence(
      0.16,
      ...dom.slice(from, to).map((d, k) => {
        return d.rotation(from + k === to - 1 ? last : 62, 0.32, easeInCubic);
      }),
    );
  }
  function* reset() {
    yield* all(...dom.map(d => d.rotation(0, 0.4)));
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.1);
  yield* title.dock();

  // 1. 도미노
  cue('whoosh');
  yield* all(row().opacity(1, 0.5), cap.say('01', '끝없이 늘어선 도미노\n전부 쓰러진다고 어떻게 확신할까?'));
  yield* waitFor(1.4);
  c1().scale(0.6);
  cue('pop');
  yield* all(c1().opacity(1, 0.3), c1().scale(1, 0.45, easeOutBack));
  c2().scale(0.6);
  cue('pop');
  yield* all(c2().opacity(1, 0.3), c2().scale(1, 0.45, easeOutBack), cap.say('02', '딱 두 가지만 확인하면 돼요', C.amber));
  yield* waitFor(1.4);

  // 2. (2) 가 깨지면
  yield* cap.say('03', '(2) 가 깨지면? (사이가 너무 멀면)', C.coral);
  cue('swish');
  yield* all(...dom.slice(6).map(d => d.x(d.x() + 150, 0.5)), ...nums.slice(6).map(t => t.x(t.x() + 150, 0.5)), dots().x(dots().x() + 150, 0.5));
  yield* all(hand().opacity(1, 0.2), hand().x(30, 0.3).to(0, 0.3));
  yield* fall(0, 6, 90);
  yield* all(shake(row(), 8, 0.3), cap.say('04', '중간에서 멈춰요', C.coral));
  yield* waitFor(1);
  yield* all(reset(), ...dom.slice(6).map(d => d.x(d.x() - 150, 0.5)), ...nums.slice(6).map(t => t.x(t.x() - 150, 0.5)), dots().x(dots().x() - 150, 0.5), hand().opacity(0, 0.3));

  // 3. (1) 이 없으면
  yield* cap.say('05', '(1) 이 없으면? 아무것도 안 쓰러져요', C.coral);
  yield* waitFor(1.6);

  // 4. 둘 다
  yield* cap.say('06', '(1), (2) 가 둘 다 맞으면…', C.teal);
  yield* all(hand().opacity(1, 0.2), hand().x(30, 0.3).to(0, 0.3));
  yield* fall(0, N, 62);
  cue('boom');
  yield* all(flash(0.12), ring(view, [X0 + N * DX + 10, BASE - 50], C.teal, 120), cap.say('07', '끝까지, 무한히 전부 쓰러져요!', C.teal));
  yield* waitFor(1.6);

  // 5. 증명에 쓰기
  yield* all(row().opacity(0.25, 0.5), hand().opacity(0, 0.3));
  yield* eq.set('1 + 2 + … + n = n(n+1)/2', C.ink, C.amber);
  yield* cap.say('08', '이 식이 모든 n 에서 맞는지\n도미노처럼 확인해요', C.amber);
  yield* waitFor(2);
  yield* eq.set('(1) n = 1 :  1 = 1×2/2  ✓', C.ink, C.amber);
  yield* cap.say('09', '첫 도미노: n = 1 일 때 맞아요', C.amber);
  yield* waitFor(1.8);
  yield* eq.set('n(n+1)/2 + (n+1) = (n+1)(n+2)/2', C.ink, C.teal);
  yield* cap.say('10', 'n 까지 맞다면, n+1 을 더해도\n다음 칸 공식과 똑같아요', C.teal);
  yield* waitFor(2.8);
  cue('chime');
  yield* all(sparks(view, [0, 200], C.pink, 16, 280), cap.say('11', '두 칸만 확인하면 무한까지!\n= 수학적 귀납법', C.pink));
  yield* waitFor(2.4);

  // 끝
  yield* wipe.cover();
  row().opacity(0);
  c1().parent()!.opacity(0);
  title.group().opacity(0);
  eq.node().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('보면 풀리는 수학', '다음 편도\n기대해 주세요!');
  yield* waitFor(2.4);
  yield* finish(NAME);
});

