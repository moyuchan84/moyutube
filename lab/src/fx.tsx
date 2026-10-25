import {Circle, Gradient, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  easeInExpo,
  easeInOutExpo,
  easeOutExpo,
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {FONT} from './style';
import {C, cue} from './motion';

// 과학 시즌용 추가 효과 — 글리치 제목 · 원형 아이리스 전환 · 줌 스루 · 흔들림 · 빛줄기 · 보케.
// motion.tsx 키트와 같이 쓴다.

/* ───────── 결정적 난수 (렌더할 때마다 같은 모양) ───────── */

let seed = 0x1234567;
export function rand() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function reseed(s: number) {
  seed = s | 0;
}

/* ───────── 보케: 흐린 빛 방울이 천천히 떠오른다 ───────── */

export function addBokeh(view: View2D, colors: string[] = [C.teal, C.violet, C.pink, C.amber], n = 16) {
  const t = createSignal(0);
  reseed(77);
  const dots = Array.from({length: n}, (_, i) => ({
    x: rand() * 1080 - 540,
    y: rand() * 1920 - 960,
    r: 26 + rand() * 70,
    sp: 8 + rand() * 18,
    ph: rand() * 6.28,
    color: colors[i % colors.length],
  }));
  view.add(
    <Node>
      {dots.map(d => (
        <Circle
          size={d.r * 2}
          x={() => d.x + 26 * Math.sin(t() * 0.4 + d.ph)}
          y={() => ((((d.y - t() * d.sp + 960) % 1920) + 1920) % 1920) - 960}
          fill={
            new Gradient({
              type: 'radial',
              from: [0, 0],
              to: [0, 0],
              fromRadius: 0,
              toRadius: d.r,
              stops: [
                {offset: 0, color: d.color + '30'},
                {offset: 0.7, color: d.color + '14'},
                {offset: 1, color: d.color + '00'},
              ],
            })
          }
        />
      ))}
    </Node>,
  );
  return {drift: () => t(200, 200, linear)};
}

/* ───────── 글리치 제목: 글자가 하나씩 쾅 → RGB 가 갈라졌다 붙는다 → 위로 도킹 ───────── */

export function addGlitchTitle(view: View2D, lines: [string, string], o: {y?: number; accent?: string} = {}) {
  const accent = o.accent ?? C.amber;
  const group = createRef<Node>();
  const ghostA = createRef<Node>();
  const ghostB = createRef<Node>();
  const bar = createRef<Rect>();
  const chars: Txt[] = [];

  const build = (color0: string, color1: string, collect: boolean, glow: boolean) =>
    lines.map((s, i) => (
      <Rect y={i === 0 ? -78 : 62} layout direction="row" alignItems="center">
        {[...s].map(ch => (
          <Txt
            ref={collect ? (el: Txt) => chars.push(el) : undefined}
            text={ch === ' ' ? ' ' : ch}
            fontFamily={FONT}
            fontSize={i === 0 ? 104 : 124}
            fontWeight={900}
            fill={i === 0 ? color0 : color1}
            shadowColor={glow && i === 1 ? accent + '99' : '#0000'}
            shadowBlur={glow && i === 1 ? 36 : 0}
          />
        ))}
      </Rect>
    ));

  view.add(
    <Node ref={group} y={o.y ?? -120}>
      <Node ref={ghostA} opacity={0} compositeOperation={'screen'}>
        {build('#00E5FF', '#00E5FF', false, false)}
      </Node>
      <Node ref={ghostB} opacity={0} compositeOperation={'screen'}>
        {build('#FF2E88', '#FF2E88', false, false)}
      </Node>
      <Node>{build(C.ink, accent, true, true)}</Node>
      <Rect ref={bar} y={170} width={0} height={8} radius={4} fill={accent} shadowColor={accent} shadowBlur={20} />
    </Node>,
  );
  chars.forEach(c => {
    c.opacity(0);
    c.scale(2.4);
    c.filters.blur(16);
  });

  function* glitch(frames = 9, amp = 26) {
    cue('swish');
    reseed(frames * 131 + amp);
    const g = group();
    const x0 = g.x();
    for (let k = 0; k < frames; k++) {
      const d = amp * (1 - k / frames);
      ghostA().opacity(0.9);
      ghostB().opacity(0.9);
      ghostA().position([-d * (0.4 + rand()), (rand() - 0.5) * d * 0.4]);
      ghostB().position([d * (0.4 + rand()), (rand() - 0.5) * d * 0.4]);
      g.x(x0 + (rand() - 0.5) * d * 0.6);
      g.skew([(rand() - 0.5) * d * 0.5, 0]);
      yield* waitFor(1 / 30);
    }
    ghostA().opacity(0);
    ghostB().opacity(0);
    g.x(x0);
    g.skew([0, 0]);
  }

  function* hero() {
    cue('whoosh');
    yield* all(
      sequence(
        0.035,
        ...chars.map(c => all(c.opacity(1, 0.2), c.scale(1, 0.55, easeOutExpo), c.filters.blur(0, 0.35))),
      ),
      bar().width(320, 0.9, easeOutExpo),
    );
    cue('boom');
    yield* glitch();
  }
  function* dock() {
    cue('swish');
    yield* all(
      group().y(-690, 0.9, easeInOutExpo),
      group().scale(0.62, 0.9, easeInOutExpo),
      bar().opacity(0, 0.4),
    );
  }
  return {hero, dock, glitch, group};
}

/* ───────── 원형 아이리스 전환: 한 점에서 원이 커지며 덮고, 다른 점에서 구멍이 열린다 ───────── */

export function addIris(view: View2D, color: string = C.bg0, edge: string = C.amber) {
  const BIG = 4600;
  const L = 4800;
  const disc = createRef<Circle>();
  const rim = createRef<Circle>();
  const hole = createRef<Circle>();
  const h = createSignal(0);
  view.add(
    <Node>
      <Circle ref={disc} size={0} fill={color} />
      <Circle ref={hole} size={() => 2 * h() + L} stroke={color} lineWidth={L} opacity={0} />
      <Circle ref={rim} size={0} stroke={edge} lineWidth={12} shadowColor={edge} shadowBlur={36} opacity={0} />
    </Node>,
  );
  function* cover(at: [number, number] = [0, 0], time = 0.6) {
    cue('whoosh');
    disc().position(at);
    rim().position(at);
    disc().size(0);
    rim().size(0);
    rim().opacity(1);
    yield* all(disc().size(BIG, time, easeInExpo), rim().size(BIG, time, easeInExpo));
    rim().opacity(0);
  }
  function* reveal(at: [number, number] = [0, 0], time = 0.8) {
    cue('swish');
    disc().size(0);
    hole().position(at);
    rim().position(at);
    h(0);
    hole().opacity(1);
    rim().size(0);
    rim().opacity(1);
    yield* all(h(BIG / 2, time, easeOutExpo), rim().size(BIG, time, easeOutExpo), rim().opacity(0, time));
    hole().opacity(0);
  }
  return {cover, reveal};
}

/* ───────── 줌 스루: 한 점으로 빨려 들어갔다가, 다음 장면이 흐림 속에서 내려앉는다 ───────── */

export function* zoomInto(node: Node, at: [number, number], scale = 14, time = 0.7) {
  cue('whoosh');
  const s = node.scale().x;
  const q = new Vector2(at).sub(node.position()).scale(1 / s);
  yield* all(
    node.scale(scale, time, easeInExpo),
    node.position(q.scale(-scale), time, easeInExpo),
    node.filters.blur(24, time, easeInExpo),
    node.opacity(0, time, easeInExpo),
  );
}

export function* arrive(node: Node, time = 0.8, from = 1.8) {
  node.scale(from);
  node.opacity(0);
  node.filters.blur(28);
  yield* all(
    node.scale(1, time, easeOutExpo),
    node.opacity(1, time * 0.5),
    node.filters.blur(0, time * 0.8, easeOutExpo),
  );
}

/* ───────── 흔들림 ───────── */

export function* shake(node: Node, amp = 16, time = 0.4) {
  const p = node.position();
  const n = Math.round(time * 30);
  reseed(n * 977 + amp);
  for (let k = 0; k < n; k++) {
    const d = amp * (1 - k / n);
    node.position(p.add([(rand() * 2 - 1) * d, (rand() * 2 - 1) * d]));
    yield* waitFor(1 / 30);
  }
  node.position(p);
}

/* ───────── 빛줄기: 화면을 비스듬히 가로지르는 렌즈 빛 ───────── */

export function* streak(parent: Node, color = '#ffffff', y = 0, time = 0.8) {
  const s = createRef<Rect>();
  parent.add(
    <Rect
      ref={s}
      x={-1100}
      y={y}
      width={240}
      height={2800}
      rotation={18}
      compositeOperation={'lighter'}
      fill={
        new Gradient({
          from: [-120, 0],
          to: [120, 0],
          stops: [
            {offset: 0, color: color + '00'},
            {offset: 0.5, color: color + '40'},
            {offset: 1, color: color + '00'},
          ],
        })
      }
    />,
  );
  yield* s().x(1100, time, easeInOutExpo);
  s().remove();
}

/* ───────── 도형 조각 ───────── */

export function Plus(o: {x?: number; y?: number; size?: number; thick?: number; color?: string; refFn?: (n: Node) => void}) {
  const size = o.size ?? 80;
  const thick = o.thick ?? 14;
  const color = o.color ?? C.ink;
  return (
    <Node ref={o.refFn} x={o.x ?? 0} y={o.y ?? 0}>
      <Rect width={size} height={thick} radius={thick / 2} fill={color} />
      <Rect width={thick} height={size} radius={thick / 2} fill={color} />
    </Node>
  );
}
