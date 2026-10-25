import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutExpo,
  easeOutExpo,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
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
import {addBokeh, addGlitchTitle, addIris, arrive, streak, zoomInto} from '../fx';

// 과학 시즌 S7 — 흑백 그림이 컬러로 보인다? (색 잔상 응용, S2 후속)
// 1) 화면 테스트: 색만 반대로 뒤집은 그림(밝기는 그대로)을 20초 → 같은 그림의 흑백판이 컬러처럼 보인다
// 2) 주황 하늘에 지친 세포 → 흑백 하늘에 파랑이 칠해진다. 흑백(밝기) + 잔상(색) = 컬러
// 색 뒤집기는 Lab 색공간에서 밝기 L 은 두고 a · b 만 부호를 바꾼다 (밝기까지 뒤집으면 흑백 위에 명암 잔상이 겹쳐 흐려진다)

const NAME = 'grayColor';

/* ───────── sRGB ↔ Lab ───────── */

type RGB = [number, number, number];
const hex2rgb = (h: string): RGB => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const rgb2hex = (c: RGB) =>
  '#' + c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const gam = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
const WHITE = [0.95047, 1, 1.08883];
const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t: number) => (t * t * t > 216 / 24389 ? t * t * t : (116 * t - 16) / (24389 / 27));
function toLab(h: string): RGB {
  const [r, g, b] = hex2rgb(h).map(lin);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / WHITE[0];
  const Y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / WHITE[1];
  const Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / WHITE[2];
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
function fromLab([L, a, b]: RGB): string {
  const fy = (L + 16) / 116;
  const X = fi(fy + a / 500) * WHITE[0];
  const Y = fi(fy) * WHITE[1];
  const Z = fi(fy - b / 200) * WHITE[2];
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const bl = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  return rgb2hex([gam(r), gam(g), gam(bl)]);
}
type Mode = 'color' | 'inv' | 'gray';
const paint = (h: string, m: Mode) => {
  if (m === 'color') return h;
  const [L, a, b] = toLab(h);
  return m === 'inv' ? fromLab([L, -a, -b]) : fromLab([L, 0, 0]);
};

/* ───────── 그림: 하늘 · 해 · 언덕 · 빨간 지붕 집 · 나무 ───────── */

const PAL = {
  sky: '#4FA3E8',
  sun: '#FFD23F',
  hill: '#3DBE5A',
  hill2: '#2E9E4F',
  roof: '#E8443A',
  wall: '#F4E3C3',
  door: '#8A5A3B',
  crown: '#36B04F',
  trunk: '#7A4E2D',
};
const PS = 760; // 그림 한 변
function Picture(o: {mode: Mode; refFn?: (n: Rect) => void; opacity?: number}) {
  const c = (k: keyof typeof PAL) => paint(PAL[k], o.mode);
  return (
    <Rect ref={o.refFn} width={PS} height={PS} radius={36} clip fill={c('sky')} opacity={o.opacity ?? 1}>
      <Circle x={220} y={-230} size={170} fill={c('sun')} />
      <Circle x={-260} y={420} size={760} fill={c('hill2')} />
      <Circle x={260} y={460} size={820} fill={c('hill')} />
      {/* 나무 */}
      <Rect x={-250} y={70} width={44} height={150} fill={c('trunk')} />
      <Circle x={-250} y={-10} size={190} fill={c('crown')} />
      {/* 집 */}
      <Rect x={60} y={120} width={300} height={220} fill={c('wall')} />
      <Line points={[[-110, 18], [60, -120], [230, 18]]} closed fill={c('roof')} />
      <Rect x={60} y={170} width={70} height={120} radius={[30, 30, 0, 0]} fill={c('door')} />
      <Rect x={150} y={95} width={56} height={56} radius={6} fill={c('sky')} stroke={c('wall')} lineWidth={6} />
    </Rect>
  );
}
function Fix() {
  return <Circle size={22} fill={'#000000'} stroke={'#ffffff'} lineWidth={5} />;
}

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.amber);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  const dim = createRef<Rect>();
  view.add(<Rect ref={dim} width={1080} height={1920} fill={'#07080E'} opacity={0} />);

  /* 0. 훅: 흑백 그림 위로 색이 쓸고 지나간다 */
  const hookN = createRef<Node>();
  const sweep = createSignal(0);
  view.add(
    <Node ref={hookN} y={210} scale={0.62} opacity={0}>
      <Picture mode="gray" />
      <Rect x={-PS / 2} offsetX={-1} width={() => PS * sweep()} height={PS} clip>
        <Node x={PS / 2}>
          <Picture mode="color" />
        </Node>
      </Rect>
      <Rect
        x={() => -PS / 2 + PS * sweep()}
        width={10}
        height={PS}
        fill={'#ffffff'}
        shadowColor={'#ffffff'}
        shadowBlur={30}
        opacity={() => (sweep() > 0.01 && sweep() < 0.99 ? 1 : 0)}
      />
    </Node>,
  );

  /* 1. 준비 */
  const setupN = createRef<Node>();
  const badge = createRef<Rect>();
  const stepA = createRef<Node>();
  const stepB = createRef<Node>();
  const arrow = createRef<Line>();
  view.add(
    <Node ref={setupN} opacity={0}>
      <Rect
        ref={badge}
        y={-500}
        layout
        padding={[12, 30]}
        radius={999}
        fill={C.amber + '22'}
        stroke={C.amber}
        lineWidth={3}
        shadowColor={C.amber}
        shadowBlur={24}
      >
        <Txt text={'20초 테스트'} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={4} fill={C.ink} />
      </Rect>
      <Node ref={stepA} x={-230} y={-260} opacity={0}>
        <Node scale={0.27}>
          <Picture mode="inv" />
          <Node scale={2.4}>
            <Fix />
          </Node>
        </Node>
        <Txt y={160} text={'가운데 점 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
      <Line
        ref={arrow}
        points={[[-80, -260], [80, -260]]}
        stroke={C.amber}
        lineWidth={8}
        endArrow
        arrowSize={22}
        end={0}
        shadowColor={C.amber}
        shadowBlur={16}
      />
      <Node ref={stepB} x={230} y={-260} opacity={0}>
        <Node scale={0.27}>
          <Picture mode="gray" />
          <Node scale={2.4}>
            <Fix />
          </Node>
        </Node>
        <Txt y={160} text={'흑백 그림 보기'} fontFamily={FONT} fontSize={40} fontWeight={800} fill={C.ink} />
      </Node>
    </Node>,
  );

  /* 2. 테스트: 색 뒤집은 그림 → 흑백판 (같은 자리, 전환 없이) */
  const TY = -200;
  const test = createRef<Node>();
  const grayN = createRef<Node>();
  let realColor: Rect;
  const timerN = createRef<Rect>();
  const count = createSignal(20);
  view.add(
    <>
      <Node ref={test} y={TY} opacity={0}>
        <Picture mode="inv" />
        <Fix />
      </Node>
      <Node ref={grayN} y={TY} opacity={0}>
        <Picture mode="gray" />
        <Picture mode="color" opacity={0} refFn={el => (realColor = el)} />
        <Fix />
      </Node>
    </>,
  );
  view.add(
    <Rect
      ref={timerN}
      y={-690}
      layout
      direction="row"
      alignItems="center"
      gap={18}
      padding={[10, 28]}
      radius={999}
      fill={'#ffffff10'}
      stroke={'#ffffff26'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'TEST'} fontFamily={FONT} fontSize={30} fontWeight={900} letterSpacing={6} fill={C.amber} />
      <Txt
        text={() => String(Math.max(0, Math.ceil(count())))}
        fontFamily={FONT}
        fontSize={52}
        fontWeight={900}
        fill={C.ink}
      />
    </Rect>,
  );

  /* 3. 설명: 본 색 → 지친 세포 → 흑백 위에 보이는 색 */
  const explain = createRef<Node>();
  const ROWS = [
    {k: 'sky' as const, name: '하늘'},
    {k: 'hill' as const, name: '풀밭'},
    {k: 'roof' as const, name: '지붕'},
  ];
  const rowN: Node[] = [];
  const headN = createRef<Node>();
  view.add(
    <Node ref={explain} y={-470} opacity={0}>
      <Node ref={headN} opacity={0}>
        <Txt x={-250} text={'20초 본 색'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
        <Txt x={250} text={'흑백 위에 보인 색'} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
      </Node>
      {ROWS.map((r, i) => (
        <Node ref={el => rowN.push(el)} y={110 + i * 150} opacity={0}>
          <Circle x={-250} size={110} fill={paint(PAL[r.k], 'inv')} stroke={'#ffffff44'} lineWidth={3} />
          <Txt x={-250} y={0} text={r.name} fontFamily={FONT} fontSize={30} fontWeight={900} fill={'#111'} />
          <Line points={[[-150, 0], [150, 0]]} stroke={C.dim} lineWidth={6} endArrow arrowSize={18} lineDash={[14, 10]} />
          <Txt y={-34} text={'지친 세포'} fontFamily={FONT} fontSize={26} fontWeight={800} fill={C.dim} />
          <Circle
            x={250}
            size={110}
            fill={PAL[r.k]}
            shadowColor={PAL[r.k]}
            shadowBlur={26}
            stroke={'#ffffff44'}
            lineWidth={3}
          />
          <Txt x={250} text={r.name} fontFamily={FONT} fontSize={30} fontWeight={900} fill={'#111'} />
        </Node>
      ))}
    </Node>,
  );
  // 흑백 + 잔상 색 = 컬러
  const eqN = createRef<Node>();
  const eqParts: Node[] = [];
  view.add(
    <Node ref={eqN} y={170} opacity={0}>
      <Node ref={el => eqParts.push(el)} x={-330} opacity={0}>
        <Node scale={0.24}>
          <Picture mode="gray" />
        </Node>
      </Node>
      <Txt ref={el => eqParts.push(el)} x={-165} text={'+'} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.ink} opacity={0} />
      <Node ref={el => eqParts.push(el)} x={0} opacity={0}>
        <Rect
          size={182}
          radius={14}
          fill={
            new Gradient({
              from: [0, -91],
              to: [0, 91],
              stops: [
                {offset: 0, color: PAL.sky + 'aa'},
                {offset: 0.6, color: PAL.roof + '88'},
                {offset: 1, color: PAL.hill + 'aa'},
              ],
            })
          }
        />
        <Txt y={0} text={'잔상 색'} fontFamily={FONT} fontSize={34} fontWeight={900} fill={'#ffffff'} shadowColor={'#000'} shadowBlur={10} />
      </Node>
      <Txt ref={el => eqParts.push(el)} x={165} text={'='} fontFamily={FONT} fontSize={70} fontWeight={900} fill={C.ink} opacity={0} />
      <Node ref={el => eqParts.push(el)} x={330} opacity={0}>
        <Node scale={0.24}>
          <Picture mode="color" />
        </Node>
      </Node>
    </Node>,
  );

  /* 4. 정리 */
  const card = bigCard('흑백 + 잔상의 색 = 컬러', C.amber, 60);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['흑백 그림이', '컬러로 보인다?'], {y: -430, accent: C.amber});
  const cap = addCaption(view);
  const end = addEnd(view);
  const hud = addHud(view, {ep: 4, total: 5, series: '눈의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, C.amber);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(hud.show(), title.hero(), popIn(hookN(), 0.7, 0.5));
  cue('riser');
  yield* sweep(1, 1.1, easeInOutExpo);
  cue('chime');
  yield* all(sparks(view, [0, 210], C.amber, 14, 260), title.dock());
  yield* zoomInto(hookN(), [0, 210], 10, 0.6);
  hookN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setupN(), 0.8), streak(view, '#ffffff', -260));
  yield* popIn(badge(), 0.5, 0.6);
  cue('pop');
  yield* all(cap.say('준비', '색이 뒤집힌 그림의 가운데 점을\n20초 동안 보세요', C.amber), popIn(stepA(), 0.5, 0.6));
  yield* waitFor(1.2);
  cue('swish');
  yield* arrow().end(1, 0.5, easeOutExpo);
  cue('pop');
  yield* all(cap.say('준비', '그다음 흑백 그림이 나와요', C.teal), popIn(stepB(), 0.5, 0.6));
  yield* waitFor(0.7);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([-230, -260]);
  setupN().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(0.9);
  timerN().opacity(1);
  yield* iris.reveal([0, TY]);
  yield* cap.say('TEST', '가운데 점에서 눈을 떼지 마세요', C.amber);
  for (let k = 20; k >= 1; k--) {
    count(k);
    cue('tick');
    if (k === 12) yield* all(cap.say('TEST', '조금만 더!', C.amber), waitFor(1));
    else if (k === 5) yield* all(cap.say('TEST', '끝나도 계속 가운데 점!', C.teal), waitFor(1));
    else yield* waitFor(1);
  }
  count(0);

  /* ═════════ 3. 흑백판 — 전환 없이 한 번에 ═════════ */
  cue('chime');
  test().opacity(0);
  timerN().opacity(0);
  grayN().opacity(1);
  yield* cap.say('!', '흑백 그림인데 색이 보이죠?', C.amber);
  yield* waitFor(2.6);
  cue('swish');
  yield* all(cap.say('!', '이 색이 보였나요?', C.teal), realColor!.opacity(1, 0.8));
  yield* waitFor(1.4);
  yield* realColor!.opacity(0, 0.6);

  /* ═════════ 4. 왜? ═════════ */
  yield* iris.cover([0, TY]);
  grayN().opacity(0);
  dim().opacity(0);
  explain().opacity(1);
  title.group().opacity(0);
  yield* iris.reveal([0, -300]);
  cue('pop');
  yield* all(cap.say('01', '주황빛 하늘을 오래 보면\n주황에 지친 세포 때문에', C.amber), popIn(headN(), 0.4, 0.8), popIn(rowN[0], 0.5, 0.6));
  yield* waitFor(1.6);
  cue('pop');
  yield* all(
    cap.say('02', '흑백 하늘에 파랑이 칠해져요\n풀밭 · 지붕도 반대로!', C.teal),
    sequence(0.25, popIn(rowN[1], 0.5, 0.6), popIn(rowN[2], 0.5, 0.6)),
  );
  yield* waitFor(1.4);

  cue('whoosh');
  eqN().opacity(1);
  yield* all(
    cap.say('03', '흑백 그림은 밝고 어두움을\n잔상은 색을 맡아요', C.ink),
    sequence(0.18, ...eqParts.slice(0, 3).map(p => popIn(p, 0.45, 0.6))),
  );
  yield* waitFor(1.4);
  cue('chime');
  yield* all(
    cap.say('04', '둘이 합쳐져서\n컬러 그림처럼 보여요!', C.amber),
    sequence(0.18, ...eqParts.slice(3).map(p => popIn(p, 0.45, 0.6))),
    delay(0.5, sparks(eqN(), [330, 0], C.amber, 14, 150)),
  );
  yield* punch(eqParts[4], 0.12, 0.4);
  yield* waitFor(1.2);

  /* ═════════ 5. 정리 ═════════ */
  yield* wipe.cover();
  explain().opacity(0);
  eqN().opacity(0);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '잔상 편의 원리를 그림 전체에!', C.amber));
  yield* shine(card);
  yield* waitFor(0.6);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 5', '가운데만 보면\n점이 사라진다?'));
  yield* waitFor(1.8);
  yield* finish(NAME, 0.6);
});
