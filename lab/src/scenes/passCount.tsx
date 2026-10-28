import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, linear, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle, addIris} from '../fx';
import {addTimer} from '../sci';

// 과학 「뇌의 용량」 3편 — 패스 세기 (무주의 맹시)
// 1) 민트 팀(동그라미 셋)의 패스 횟수를 16초 동안 센다. 코랄 팀도 같이 공을 돌린다
// 2) 세는 동안 코랄색 큰 별이 한가운데로 걸어 들어와 3초 머물다 나간다 → "별 봤어요?"
// 3) 다시 빨리 보여 주며 별을 링으로 짚는다 → 뇌는 집중할 것에만 조명을 비춘다
// 유명한 고릴라 실험(사람 영상)은 쓰지 않고 코드 도형만 쓴다. 얼마나 많은 사람이 놓치는지 같은 수치는 말하지 않는다

const NAME = 'passCount';
const CY = -230; // 코트 가운데
const DUR = 16; // 테스트 길이
const PASS = 0.75; // 공 한 번 날아가는 시간
const TEAL_T = [0.6, 1.9, 3.0, 4.6, 5.8, 7.3, 8.4, 9.9, 11.3, 12.6, 14.2]; // 11번
const TEAL_S = [0, 1, 2, 0, 2, 1, 0, 1, 2, 0, 1, 2];
const CORAL_T = [0.2, 1.4, 2.5, 3.6, 5.0, 6.4, 7.0, 8.9, 10.2, 11.0, 12.0, 13.4, 14.6];
const CORAL_S = [0, 1, 2, 1, 0, 2, 0, 1, 0, 2, 1, 2, 0, 1];
const TEAL_BASE: [number, number][] = [[-310, -170], [300, -60], [-70, 230]];
const CORAL_BASE: [number, number][] = [[-280, 160], [310, 220], [40, -250]];

type P = [number, number];

function player(base: P[], i: number, T: number, ph: number): P {
  const [x, y] = base[i];
  const k = i + ph;
  return [x + 48 * Math.sin(0.9 * T + k * 2.1), y + 34 * Math.cos(0.7 * T + k * 1.7)];
}
const held = (p: P): P => [p[0] + 36, p[1] - 42];

function ball(T: number, times: number[], seq: number[], at: (i: number, T: number) => P): P {
  let k = 0;
  for (let j = 0; j < times.length; j++) {
    if (T < times[j]) break;
    if (T < times[j] + PASS) {
      const u = (T - times[j]) / PASS;
      const e = u * u * (3 - 2 * u);
      const a = held(at(seq[j], T));
      const b = held(at(seq[j + 1], T));
      return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - Math.sin(Math.PI * u) * 70];
    }
    k = j + 1;
  }
  return held(at(seq[k], T));
}

const smooth = (u: number) => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};
// 별: 4초에 왼쪽에서 들어와 7~10초 가운데서 흔들흔들, 13초에 오른쪽으로 나간다
function starAt(T: number): P {
  if (T < 7) return [-640 + 640 * smooth((T - 4) / 3), 20];
  if (T < 10) return [0, 20 + 10 * Math.sin((T - 7) * 4)];
  return [640 * smooth((T - 10) / 3), 20];
}

function starPoints(r1: number, r2: number): P[] {
  return Array.from({length: 10}, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const r = k % 2 ? r2 : r1;
    return [r * Math.cos(a), r * Math.sin(a)] as P;
  });
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  const T = createSignal(0);
  const tealAt = (i: number, t: number) => player(TEAL_BASE, i, t, 0);
  const coralAt = (i: number, t: number) => player(CORAL_BASE, i, t, 0.5);

  /* 코트 */
  const court = createRef<Node>();
  const coralTeam = createRef<Node>();
  const tealTeam = createRef<Node>();
  const star = createRef<Node>();
  const starRing = createRef<Circle>();
  view.add(
    <Node ref={court} y={CY} opacity={0}>
      <Rect width={960} height={780} radius={34} clip fill={'#141A38'} stroke={'#ffffff33'} lineWidth={4}>
        <Line points={[[-480, 0], [480, 0]]} stroke={'#ffffff14'} lineWidth={4} />
        <Circle size={220} stroke={'#ffffff14'} lineWidth={4} />
        {/* 별 (코랄 팀과 같은 색) */}
        <Node ref={star} position={() => starAt(T())} rotation={() => (T() > 7 && T() < 10 ? 10 * Math.sin((T() - 7) * 3) : 0)}>
          <Line points={starPoints(130, 56)} closed fill={C.coral} />
          <Circle x={-26} y={-6} size={18} fill={'#2A1020'} />
          <Circle x={26} y={-6} size={18} fill={'#2A1020'} />
        </Node>
        <Node ref={coralTeam}>
          {[0, 1, 2].map(i => (
            <Circle position={() => coralAt(i, T())} size={96} fill={'#FF7A7A33'} stroke={C.coral} lineWidth={7} />
          ))}
          <Circle position={() => ball(T(), CORAL_T, CORAL_S, coralAt)} size={40} fill={C.coral} />
        </Node>
        <Node ref={tealTeam}>
          {[0, 1, 2].map(i => (
            <Circle position={() => tealAt(i, T())} size={96} fill={'#3DDBC433'} stroke={C.teal} lineWidth={7} />
          ))}
          <Circle position={() => ball(T(), TEAL_T, TEAL_S, tealAt)} size={40} fill={C.teal} shadowColor={C.teal} shadowBlur={16} />
        </Node>
        <Circle ref={starRing} position={() => starAt(T())} size={330} stroke={C.amber} lineWidth={8} lineDash={[22, 14]} shadowColor={C.amber} shadowBlur={24} opacity={0} />
      </Rect>
    </Node>,
  );

  /* 생활 예: 걸으며 휴대폰 */
  const phone = createRef<Node>();
  view.add(
    <Node ref={phone} y={-250} opacity={0}>
      <Rect x={-150} width={250} height={440} radius={36} fill={'#1B2140'} stroke={C.ink} lineWidth={6} />
      <Rect x={-150} width={210} height={360} radius={18} fill={'#3DDBC455'} />
      <Node x={210} y={-20}>
        <Line points={[[0, -130], [130, 100], [-130, 100]]} closed fill={'#FFC24B26'} stroke={C.amber} lineWidth={10} lineJoin="round" />
        <Txt y={20} text={'!'} fontFamily={FONT} fontSize={130} fontWeight={900} fill={C.amber} />
      </Node>
    </Node>,
  );

  const card = bigCard('집중하면 다른 건 안 보일 수 있다', C.teal, 50);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['패스는 몇 번?', '끝까지 세어 봐요'], {y: -430, accent: C.teal});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 3, total: 3, series: '뇌의 용량', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.teal);
  const wipe = addWipe(view);
  const timer = addTimer(view, 'COUNT');

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero());
  yield* title.dock();
  cue('pop');
  yield* popIn(court(), 0.6, 0.7);
  yield* cap.say('준비', '민트색 공의 패스만 세어 보세요\n코랄색 공은 빼고!', C.teal);
  yield* waitFor(2.4);

  /* ═════════ 1. 테스트 ═════════ */
  title.group().opacity(0);
  timer.count(DUR);
  timer.node().opacity(1);
  yield* cap.say('COUNT', '민트색 패스, 하나 · 둘 · …', C.teal);
  yield* all(T(DUR, DUR, linear), timer.run(DUR));
  timer.node().opacity(0);

  /* ═════════ 2. 확인 ═════════ */
  yield* cap.say('?', '민트색 패스, 몇 번 셌나요?', C.amber);
  yield* waitFor(1.6);
  cue('chime');
  yield* all(cap.say('정답', '정답은 11번!', C.teal), sparks(view, [0, CY], C.teal, 12, 220));
  yield* waitFor(1.2);
  cue('boom');
  yield* all(cap.say('?', '그런데… 혹시\n커다란 별 봤어요?', C.coral), punch(court(), 0.04));
  yield* waitFor(2.0);

  cue('whoosh');
  T(0);
  yield* all(cap.say('!', '빨리 다시 볼게요', C.amber), starRing().opacity(1, 0.3));
  yield* T(13.5, 6, linear);
  yield* cap.say('!', '별이 한가운데를\n지나갔어요!', C.coral);
  yield* waitFor(1.4);

  /* ═════════ 3. 왜? ═════════ */
  starRing().opacity(0);
  T(8.5);
  cue('swish');
  yield* all(cap.say('01', '뇌는 집중할 것에만\n조명을 비춰요', C.violet), coralTeam().opacity(0.15, 0.8), star().opacity(0.15, 0.8));
  yield* waitFor(1.4);
  yield* cap.say('02', '조명 밖은 눈에 들어와도\n기억에 잘 안 남아요', C.teal);
  yield* waitFor(1.8);
  yield* all(cap.say('03', '이걸 "무주의 맹시"라고 해요', C.amber), coralTeam().opacity(1, 0.8), star().opacity(1, 0.8));
  yield* waitFor(1.8);

  /* ═════════ 4. 생활 예 ═════════ */
  yield* wipe.cover();
  court().opacity(0);
  phone().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('LIFE', '걸으며 휴대폰을 보면\n차나 자전거를 못 볼 수 있어요', C.coral), popIn(phone(), 0.5, 0.7));
  yield* waitFor(2.2);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([0, -250]);
  phone().opacity(0);
  title.group().opacity(1);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '집중은 힘이 세지만\n그만큼 놓치는 것도 있어요', C.teal));
  yield* all(shine(card), sparks(view, [0, -420], C.teal, 14, 300));
  yield* waitFor(1.0);
  yield* all(cap.hide(), end.show('뇌의 용량  끝!', '숫자 · 그림 · 패스\n몇 개나 속았나요?'));
  yield* waitFor(1.6);
  yield* finish(NAME, 0.3);
});
