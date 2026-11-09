import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {FONT} from '../style';
import {C, addAtmosphere, addCaption, addEnd, addHud, addWipe, begin, bigCard, cue, finish, popIn, punch, shine, sparks} from '../motion';
import {addBokeh, addGlitchTitle} from '../fx';
import {addTimer} from '../sci';

// 수학 — 소수는 어떻게 찾을까? (에라토스테네스의 체)
// 1) 퀴즈: 100칸 표에서 소수는 몇 개? (정답은 끝에서)
// 2) 1 은 소수가 아님 → 2 를 남기고 2 의 배수 지우기 → 3 → 5 → 7
// 3) 왜 7 까지만? 다음 11 의 첫 새 배수는 11 × 11 = 121 > 100
// 4) 남은 25 개가 소수. 에라토스테네스는 약 2200 년 전 그리스 수학자
// 소수 25 개: 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97

const NAME = 'sieve';
const CELL = 80;
const GY = -40;
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.violet);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  /* 100칸 표 */
  const gridN = createRef<Node>();
  const cells: Rect[] = [];
  const txts: Txt[] = [];
  view.add(
    <Node ref={gridN} y={GY}>
      {Array.from({length: 100}, (_, i) => {
        const n = i + 1;
        const x = ((i % 10) - 4.5) * CELL;
        const y = (Math.floor(i / 10) - 4.5) * CELL;
        return (
          <Rect ref={el => (cells[n] = el)} x={x} y={y} width={CELL - 6} height={CELL - 6} radius={12} fill={'#ffffff12'}>
            <Txt ref={el => (txts[n] = el)} text={String(n)} fontFamily={FONT} fontSize={36} fontWeight={900} fill={C.ink} />
          </Rect>
        );
      })}
    </Node>,
  );
  const timer = addTimer(view, 'QUIZ', -560);
  const picker = createRef<Circle>();
  gridN().add(<Circle ref={picker} size={0} stroke={C.amber} lineWidth={8} opacity={0} shadowColor={C.amber} shadowBlur={24} />);

  const mark = (n: number, color: string) => {
    cells[n].fill(color + '55');
    txts[n].opacity(0.28);
  };
  const keep = (n: number, color: string) => {
    cells[n].fill(color);
    txts[n].fill('#06121A');
  };

  const card = bigCard('남은 25개 = 소수', C.teal, 64);
  card.y(-555);
  view.add(card);
  const title = addGlitchTitle(view, ['100칸 표에서', '소수를 찾는 법'], {y: -430, accent: C.violet});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 1, total: 1, series: '보면 풀리는 수학'});
  const wipe = addWipe(view);

  /* 한 숫자를 고르고 그 배수를 지운다 */
  function* sieveBy(p: number, color: string, perStep = 0.06) {
    cue('pop');
    keep(p, color);
    picker().position([((p - 1) % 10 - 4.5) * CELL, (Math.floor((p - 1) / 10) - 4.5) * CELL]);
    picker().size(CELL + 6);
    yield* all(picker().opacity(1, 0.2), punch(cells[p], 0.15, 0.3));
    const ms: number[] = [];
    for (let m = p * 2; m <= 100; m += p) ms.push(m);
    cue('swish');
    yield* sequence(perStep, ...ms.map(m => (function* () { mark(m, color); yield* punch(cells[m], 0.1, 0.18); })()));
    yield* picker().opacity(0, 0.25);
  }

  /* ═════════ 0. 훅: 첫 프레임부터 표가 보인다 ═════════ */
  gridN().scale(0.85);
  yield* all(hud.show(), title.hero(), gridN().scale(1, 1.2, easeInOutCubic));
  yield* title.dock();

  /* ═════════ 1. 퀴즈 ═════════ */
  cue('pop');
  yield* cap.say('QUIZ', '1과 자기 자신으로만 나눠지는 수\n= 소수! 여기엔 몇 개 있을까요?', C.amber);
  timer.node().opacity(1);
  timer.count(4);
  yield* timer.run(4);
  timer.node().opacity(0);

  /* ═════════ 2. 지우기 ═════════ */
  yield* cap.say('1', '1은 소수가 아니라서 먼저 지워요', C.coral);
  mark(1, C.coral);
  cue('boom');
  yield* punch(cells[1], 0.2, 0.4);
  yield* waitFor(0.4);

  yield* cap.say('2', '2는 남기고\n2의 배수를 모두 지워요', C.teal);
  yield* sieveBy(2, C.teal, 0.05);
  yield* waitFor(0.3);
  yield* cap.say('3', '다음으로 남은 3!\n3의 배수도 지워요', C.amber);
  yield* sieveBy(3, C.amber, 0.07);
  yield* waitFor(0.3);
  yield* cap.say('5', '4는 이미 지웠으니\n5의 배수 차례', C.pink);
  yield* sieveBy(5, C.pink, 0.09);
  yield* waitFor(0.3);
  yield* cap.say('7', '마지막으로 7의 배수', C.violet);
  yield* sieveBy(7, C.violet, 0.12);
  yield* waitFor(0.5);

  /* ═════════ 3. 왜 7까지? ═════════ */
  cue('chime');
  yield* cap.say('왜?', '다음은 11, 11 × 11 = 121\n100을 넘으니 여기서 끝!', C.teal);
  yield* waitFor(2.2);

  /* ═════════ 4. 남은 것 = 소수 ═════════ */
  const primes = Array.from({length: 100}, (_, i) => i + 1).filter(isPrime);
  yield* cap.say('결과', '지워지지 않고 남은 수가 소수예요!', C.teal);
  cue('chime');
  yield* sequence(0.07, ...primes.map(n => (function* () { keep(n, C.teal); txts[n].opacity(1); yield* punch(cells[n], 0.14, 0.25); })()));
  yield* all(popIn(card, 0.55), sparks(view, [0, -555], C.teal, 14, 300), shine(card));
  yield* cap.say('25', '정답은 25개!\n맞혔나요?', C.amber);
  yield* waitFor(1.6);

  /* ═════════ 5. 정리 · 질문 · 구독 ═════════ */
  yield* cap.say('약 2200년 전', '그리스 수학자 에라토스테네스가\n이 방법을 썼어요', C.violet);
  yield* waitFor(2.0);
  yield* cap.say('?', '21~30 사이 소수는 몇 개일까요?\n댓글로 알려 주세요!', C.amber);
  yield* waitFor(2.0);
  yield* all(cap.hide(), card.opacity(0, 0.3), gridN().opacity(0, 0.4), title.group().opacity(0, 0.3));
  yield* end.show('NEXT  보면 풀리는 수학', '다음 수학 비밀도\n그림으로 풀어요', '더 많은 수학 주제를 만나고 싶다면 구독!');
  yield* waitFor(2.2);

  /* 첫 장면으로 이어지게 */
  primes.forEach(() => {});
  for (let n = 1; n <= 100; n++) {
    cells[n].fill('#ffffff12');
    txts[n].opacity(1);
    txts[n].fill(C.ink);
  }
  yield* all(end.root().opacity(0, 0.4), delay(0.1, gridN().opacity(1, 0.4)), title.group().opacity(1, 0.4));
  yield* finish(NAME, 0.3);
});
