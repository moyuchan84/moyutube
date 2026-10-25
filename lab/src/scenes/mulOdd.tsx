import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutExpo, sequence, waitFor} from '@motion-canvas/core';
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
  camTo,
  cue,
  finish,
  punch,
  ring,
  sparks,
} from '../motion';

const NAME = 'mulOdd';
const U = 40;
const N = 10;
const STAGE_Y = -200;
const COLORS = [C.amber, C.teal, C.violet, C.coral, C.pink];

const pos = (r: number, c: number): [number, number] => [(c - (N - 1) / 2) * U, (r - (N - 1) / 2) * U];
// n×n 덩어리를 화면 가운데에 두는 카메라 자리
const camFor = (n: number, s: number): [number, number] => {
  const k = (n / 2 - N / 2) * U * s;
  return [-k, STAGE_Y - k];
};

const sumText = (n: number) => {
  if (n <= 5) {
    const terms = Array.from({length: n}, (_, i) => String(2 * i + 1)).join(' + ');
    return n === 1 ? '1 = 1²' : `${terms} = ${n * n}`;
  }
  return `1 + 3 + … + ${2 * n - 1} = ${n * n}`;
};

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.pink);
  yield atmo.drift();
  const hud = addHud(view, {ep: 4, total: 6, series: '곱셈은 넓이다'});
  const title = addTitle(view, ['홀수만 더하면', '늘 제곱수가 된다?'], C.pink);

  const cam = createRef<Node>();
  const cells: Rect[][] = Array.from({length: N}, (): Rect[] => []);
  const tags: Txt[] = [];

  view.add(
    <Node ref={cam} scale={2.4} position={camFor(1, 2.4)}>
      {Array.from({length: N * N}, (_, i) => {
        const r = Math.floor(i / N);
        const c = i % N;
        const layer = Math.max(r, c);
        const color = COLORS[layer % 5];
        return (
          <Rect
            ref={el => cells[layer].push(el)}
            position={pos(r, c)}
            size={U - 4}
            radius={7}
            fill={color + 'dd'}
            shadowColor={color}
            shadowBlur={0}
            opacity={0}
          />
        );
      })}
      {Array.from({length: N}, (_, n) => (
        <Txt
          ref={el => (tags[n] = el)}
          position={[pos(n, n)[0] + U * 1.05, pos(n, n)[1] + U * 1.05]}
          text={`+${2 * n + 1}`}
          fontFamily={FONT}
          fontSize={22}
          fontWeight={900}
          fill={COLORS[n % 5]}
          shadowColor={'#000000cc'}
          shadowBlur={8}
          opacity={0}
        />
      ))}
    </Node>,
  );

  const eq = addEq(view, 225, 80);
  const big = createRef<Txt>();
  view.add(
    <Txt
      ref={big}
      y={110}
      fontFamily={FONT}
      fontSize={64}
      fontWeight={900}
      fill={C.amber}
      shadowColor={C.amber}
      shadowBlur={24}
      opacity={0}
    />,
  );
  const cap = addCaption(view);
  const flash = addFlash(view);
  const end = addEnd(view);
  const wipe = addWipe(view);

  // L자 한 겹을 붙인다
  function* addLayer(n: number, fast = false) {
    const layer = cells[n];
    const t = fast ? 0.32 : 0.5;
    cue(fast ? 'tick' : 'pop');
    layer.forEach(c => {
      const p = c.position();
      c.position(p.add([U * 1.4, U * 1.4]));
      c.scale(0.4);
    });
    yield* all(
      sequence(
        fast ? 0.012 : 0.04,
        ...layer.map(c =>
          all(c.opacity(1, t * 0.6), c.position(c.position().sub([U * 1.4, U * 1.4]), t, easeOutExpo), c.scale(1, t, easeOutBack)),
        ),
      ),
      fast ? all() : tags[n].opacity(1, 0.3),
      n > 0 ? tags[n - 1].opacity(0, 0.2) : all(),
    );
  }

  // 0. 제목
  yield* hud.show();
  yield* title.hero();
  yield* waitFor(1.2);
  yield* title.dock();

  // 1. 1 하나
  yield* addLayer(0);
  yield* all(eq.set('1'), cap.say('01', '1 칸에서 시작해요'));
  yield* waitFor(0.8);

  // 2. 3, 5, 7, 9 를 L자로
  yield* cap.say('02', '다음 홀수 3 을 L자로 붙이면?', C.teal);
  const scales = [2.4, 2.1, 1.75, 1.5, 1.3];
  for (let n = 1; n < 5; n++) {
    yield* all(camTo(cam(), scales[n], camFor(n + 1, scales[n]), 0.6), addLayer(n));
    yield* eq.set(sumText(n + 1), C.ink, COLORS[n]);
    big().text(`= ${n + 1} × ${n + 1}`);
    big().fill(COLORS[n]);
    big().shadowColor(COLORS[n]);
    yield* all(big().opacity(1, 0.3), big().scale(1.2, 0.15).to(1, 0.3));
    if (n === 1) yield* cap.say('03', '정사각형! 2 × 2 = 4', C.teal);
    if (n === 2) yield* cap.say('04', '5 를 붙이면 3 × 3 = 9', C.violet);
    if (n === 3) yield* cap.say('05', 'L자 하나 = 다음 홀수', C.coral);
    yield* waitFor(n === 4 ? 0.6 : 0.9);
  }
  cue('chime');
  yield* cap.say('06', '한 겹 두를 때마다\n정사각형이 한 칸씩 커져요', C.amber);
  yield* ring(view, [0, 225], C.amber, 400);
  yield* waitFor(1.6);

  // 3. 19 까지 빨리 감기
  yield* cap.say('07', '그럼 19 까지 더하면?', C.pink);
  yield* all(big().opacity(0, 0.3), ...tags.map(t => t.opacity(0, 0.3)));
  for (let n = 5; n < N; n++) {
    yield* all(camTo(cam(), 1.3 - (n - 4) * 0.06, camFor(n + 1, 1.3 - (n - 4) * 0.06), 0.35), addLayer(n, true));
  }
  yield* eq.set(sumText(10), C.ink, C.pink);
  cue('riser');
  cue('boom');
  big().text('= 10 × 10 = 10²');
  big().fill(C.amber);
  big().shadowColor(C.amber);
  yield* all(flash(0.16), punch(cam(), 0.05), big().opacity(1, 0.3), sparks(view, [0, STAGE_Y], C.amber, 18, 380));
  yield* cap.say('08', '홀수 10 개를 더하면 100 = 10²', C.amber);
  yield* waitFor(2.4);

  // 다음 편
  yield* wipe.cover();
  cam().opacity(0);
  eq.node().opacity(0);
  big().opacity(0);
  title.group().opacity(0);
  yield* cap.hide();
  yield* wipe.reveal();
  yield* end.show('NEXT  05', '루트(√)는\n제곱을 거꾸로!');
  yield* waitFor(2.4);
  yield* finish(NAME);
});
