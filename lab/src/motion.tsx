import {Circle, Gradient, Line, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  delay,
  easeInExpo,
  easeInOutExpo,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  linear,
  sequence,
  useTime,
  waitFor,
} from '@motion-canvas/core';
import {FONT, THEME} from './style';

// "곱셈은 넓이다" 시리즈용 모션 키트 — 키네틱 타이포 · 카메라 · 와이프 전환 · 효과음 큐.
// 쇼츠 화면 아래 20%(y > 580)는 유튜브 UI 가 덮으니 비워 둔다.

export const C = {
  ...THEME,
  bg0: '#070914',
  bg1: '#0D1230',
  pink: '#FF5FA2',
};

/* ───────── 효과음 큐: 장면이 돌 때 시각을 모아 dev 서버로 보낸다 (scripts/bgm.mjs 가 읽음) ───────── */

type Cue = {t: number; kind: string};
let cues: Cue[] = [];
// 영어 자막용: 제목 · 자막 카드가 바뀐 시각 (scripts/srt.mjs 가 읽음)
let caps: {t: number; kind: string; text: string}[] = [];

export function capLog(kind: string, text: string) {
  caps.push({t: Math.round(useTime() * 1000) / 1000, kind, text});
}

export type CueKind =
  | 'whoosh' | 'swish' | 'pop' | 'tick' | 'boom' | 'chime' | 'riser' | 'wipe' | 'type' | 'shepOn' | 'shepOff' | 'scaleOn'
  // 마술 편 (scripts/bgm-magic.mjs): 음악 구간 전환 · 드럼롤 · 효과음
  | `m:${'intro' | 'build' | 'hush' | 'groove' | 'outro'}` | 'roll' | 'hit' | 'scratch' | 'tap' | 'poof' | 'sparkle' | 'curtain' | `ping${number}`;

export function cue(kind: CueKind) {
  cues.push({t: Math.round(useTime() * 1000) / 1000, kind});
}

function resetCues() {
  cues = [];
  caps = [];
}

function flushCues(name: string) {
  const body = JSON.stringify({duration: Math.round(useTime() * 1000) / 1000, cues, caps});
  try {
    fetch(`/__cues/${name}`, {method: 'POST', body}).catch(() => {});
  } catch {
    /* 렌더 환경에서 fetch 가 없어도 무시 */
  }
}

/* ───────── 배경: 깊은 남색 + 천천히 떠다니는 빛 덩어리 + 비네트 ───────── */

function orb(color: string, r: number) {
  return new Gradient({
    type: 'radial',
    from: [0, 0],
    to: [0, 0],
    fromRadius: 0,
    toRadius: r,
    stops: [
      {offset: 0, color: color + '55'},
      {offset: 0.5, color: color + '18'},
      {offset: 1, color: color + '00'},
    ],
  });
}

export function addAtmosphere(view: View2D, accent: string = C.violet) {
  const t = createSignal(0);
  view.add(
    <>
      <Rect
        width={1080}
        height={1920}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -960],
            to: [0, 960],
            stops: [
              {offset: 0, color: C.bg1},
              {offset: 1, color: C.bg0},
            ],
          })
        }
      />
      <Circle
        size={1500}
        fill={orb(accent, 750)}
        x={() => -320 + 140 * Math.sin(t() * 0.35)}
        y={() => -560 + 110 * Math.cos(t() * 0.28)}
      />
      <Circle
        size={1300}
        fill={orb(C.teal, 650)}
        x={() => 380 + 120 * Math.cos(t() * 0.31)}
        y={() => 120 + 140 * Math.sin(t() * 0.24)}
      />
      <Circle
        size={1100}
        fill={orb(C.amber, 550)}
        x={() => -200 + 100 * Math.sin(t() * 0.22 + 2)}
        y={() => 760 + 80 * Math.cos(t() * 0.3)}
        opacity={0.6}
      />
      {/* 점 모눈 */}
      {Array.from({length: 15 * 27}, (_, i) => {
        const cx = (i % 15) - 7;
        const cy = Math.floor(i / 15) - 13;
        const d = Math.hypot(cx * 0.9, cy * 0.5);
        return (
          <Circle
            x={cx * 72}
            y={cy * 72}
            size={4}
            fill={'#ffffff'}
            opacity={Math.max(0, 0.11 - d * 0.009)}
          />
        );
      })}
      <Rect
        width={1080}
        height={1920}
        fill={
          new Gradient({
            type: 'radial',
            from: [0, -100],
            to: [0, -100],
            fromRadius: 500,
            toRadius: 1250,
            stops: [
              {offset: 0, color: '#00000000'},
              {offset: 1, color: '#000000aa'},
            ],
          })
        }
      />
    </>,
  );
  return {drift: () => t(200, 200, linear)};
}

/* ───────── 위쪽 HUD (말머리 + 시리즈 진행 막대) ───────── */

export function addHud(view: View2D, o: {ep: number; total: number; series: string; brand?: string}) {
  const hud = createRef<Node>();
  const segs: Rect[] = [];
  const W = 52;
  const G = 10;
  const left = -((o.total * W + (o.total - 1) * G) / 2) + W / 2;
  view.add(
    <Node ref={hud} y={-860} opacity={0}>
      <Txt
        x={-440}
        offsetX={-1}
        text={o.brand ?? '보면 풀리는 수학'}
        fontFamily={FONT}
        fontSize={30}
        fontWeight={800}
        letterSpacing={2}
        fill={C.ink}
      />
      <Txt
        x={440}
        offsetX={1}
        text={`${o.series}  ${String(o.ep).padStart(2, '0')}/${String(o.total).padStart(2, '0')}`}
        fontFamily={FONT}
        fontSize={28}
        fontWeight={700}
        letterSpacing={2}
        fill={C.dim}
      />
      {Array.from({length: o.total}, (_, i) => (
        <Rect
          ref={el => (segs[i] = el)}
          x={left + i * (W + G)}
          y={52}
          width={W}
          height={6}
          radius={3}
          fill={i + 1 === o.ep ? C.amber : i + 1 < o.ep ? '#FFC24B66' : '#ffffff22'}
          shadowColor={i + 1 === o.ep ? C.amber : '#0000'}
          shadowBlur={i + 1 === o.ep ? 16 : 0}
        />
      ))}
    </Node>,
  );
  function* show() {
    hud().y(-890);
    yield* all(hud().opacity(1, 0.6), hud().y(-860, 0.8, easeOutExpo));
  }
  return {show, node: hud};
}

/* ───────── 키네틱 제목: 큰 글자로 가운데에서 등장 → 위로 올라가 자리 잡기 ───────── */

export function addTitle(view: View2D, lines: [string, string], accent = C.amber) {
  const group = createRef<Node>();
  const masks: Rect[] = [];
  const texts: Txt[] = [];
  const bar = createRef<Rect>();
  view.add(
    <Node ref={group} y={-120}>
      {lines.map((s, i) => (
        <Rect ref={el => (masks[i] = el)} y={i === 0 ? -78 : 62} width={1060} height={150} clip>
          <Txt
            ref={el => (texts[i] = el)}
            y={170}
            text={s}
            fontFamily={FONT}
            fontSize={i === 0 ? 104 : 116}
            fontWeight={900}
            letterSpacing={-3}
            fill={i === 0 ? C.ink : accent}
            shadowColor={i === 0 ? '#0000' : accent + '88'}
            shadowBlur={i === 0 ? 0 : 36}
          />
        </Rect>
      ))}
      <Rect ref={bar} y={160} width={0} height={8} radius={4} fill={accent} shadowColor={accent} shadowBlur={20} />
    </Node>,
  );

  function* hero() {
    cue('whoosh');
    capLog('title', lines.join('|'));
    yield* all(
      sequence(
        0.16,
        ...texts.map(t => all(t.y(0, 0.9, easeOutExpo), delay(0, t.filters.blur(0, 0.6)))),
      ),
      delay(0.35, bar().width(300, 0.7, easeOutExpo)),
    );
  }
  // 제목을 위쪽 자리로 줄여 올린다
  function* dock() {
    cue('swish');
    yield* all(
      group().y(-690, 0.9, easeInOutExpo),
      group().scale(0.62, 0.9, easeInOutExpo),
      bar().opacity(0, 0.4),
    );
  }
  function* out() {
    yield* sequence(0.08, ...texts.map(t => t.y(-170, 0.5, easeInExpo)));
  }
  texts.forEach(t => t.filters.blur(18));
  return {hero, dock, out, group};
}

/* ───────── 아래 자막: 번호 칩 + 문장. 바뀔 때 위로 흐려지며 빠지고 아래에서 올라온다 ───────── */

export function addCaption(view: View2D, y = 455) {
  const root = createRef<Node>();
  const chip = createRef<Rect>();
  const chipTxt = createRef<Txt>();
  const line = createRef<Txt>();
  view.add(
    <Node ref={root} y={y}>
      <Rect
        ref={chip}
        y={-78}
        layout
        padding={[8, 20]}
        radius={10}
        fill={C.teal}
        opacity={0}
        shadowColor={C.teal}
        shadowBlur={20}
      >
        <Txt ref={chipTxt} fontFamily={FONT} fontSize={26} fontWeight={900} letterSpacing={3} fill={'#06121A'} />
      </Rect>
      <Txt
        ref={line}
        y={20}
        fontFamily={FONT}
        fontSize={54}
        fontWeight={800}
        lineHeight={76}
        letterSpacing={-1}
        fill={C.ink}
        textAlign="center"
        opacity={0}
        shadowColor={'#000000cc'}
        shadowBlur={24}
      />
    </Node>,
  );

  function* say(label: string, text: string, color: string = C.teal) {
    if (line().opacity() > 0) {
      yield* all(
        line().opacity(0, 0.22),
        line().y(-10, 0.22, easeInExpo),
        line().filters.blur(12, 0.22),
        chip().opacity(0, 0.18),
      );
    }
    capLog('say', text);
    chipTxt().text(label);
    chip().fill(color);
    chip().shadowColor(color);
    line().text(text);
    line().y(50);
    line().filters.blur(14);
    chip().scale(0.6);
    yield* all(
      chip().opacity(1, 0.3),
      chip().scale(1, 0.45, easeOutBack),
      line().opacity(1, 0.4),
      line().y(20, 0.55, easeOutExpo),
      line().filters.blur(0, 0.4),
    );
  }
  function* hide() {
    capLog('hide', '');
    yield* all(line().opacity(0, 0.3), chip().opacity(0, 0.3));
  }
  return {say, hide, root};
}

/* ───────── 카메라: 무대 전체를 감싸는 노드를 밀고 당긴다 ───────── */

export function* punch(node: Node, amount = 0.05, time = 0.35) {
  const s = node.scale().x;
  yield* node.scale(s * (1 + amount), time * 0.35, easeOutCubic);
  yield* node.scale(s, time * 0.65, easeOutCubic);
}

export function* camTo(node: Node, scale: number, pos: [number, number], time = 1) {
  yield* all(node.scale(scale, time, easeInOutExpo), node.position(pos, time, easeInOutExpo));
}

/* ───────── 화면 전환: 사선 띠 세 겹이 쓸고 지나간다. cover 와 reveal 사이에서 내용을 바꾼다 ───────── */

export function addWipe(view: View2D) {
  const g = createRef<Node>();
  const band = (x: number, w: number, color: string) => (
    <Rect x={x} width={w} height={4200} fill={color} />
  );
  view.add(
    <Node ref={g} rotation={-14} x={2600}>
      {band(-1250, 120, C.amber)}
      {band(-1110, 70, C.teal)}
      {band(0, 2200, '#0B0F24')}
    </Node>,
  );
  function* cover() {
    cue('wipe');
    g().x(2600);
    yield* g().x(150, 0.55, easeInExpo);
  }
  function* reveal() {
    yield* g().x(-2700, 0.65, easeOutExpo);
    g().x(2600);
  }
  function* pass(swap: () => void) {
    yield* cover();
    swap();
    yield* reveal();
  }
  return {cover, reveal, pass};
}

/* ───────── 효과 ───────── */

// 한 점에서 링이 퍼지며 사라진다
export function* ring(parent: Node, at: [number, number], color: string = C.amber, r = 120) {
  const c = createRef<Circle>();
  parent.add(<Circle ref={c} position={at} size={20} stroke={color} lineWidth={8} shadowColor={color} shadowBlur={20} />);
  yield* all(c().size(r * 2, 0.6, easeOutExpo), c().lineWidth(0, 0.6, easeOutCubic), c().opacity(0, 0.6));
  c().remove();
}

// 불꽃 가루: 작은 점이 사방으로 튄다
export function* sparks(parent: Node, at: [number, number], color: string = C.amber, n = 12, dist = 150) {
  const dots: Circle[] = [];
  for (let i = 0; i < n; i++) {
    const d = <Circle position={at} size={10} fill={color} shadowColor={color} shadowBlur={12} /> as Circle;
    parent.add(d);
    dots.push(d);
  }
  yield* all(
    ...dots.map((d, i) => {
      const a = (i / n) * Math.PI * 2 + 0.3;
      const k = dist * (0.7 + 0.3 * ((i * 37) % 10) / 10);
      return all(
        d.position(new Vector2(at).add([Math.cos(a) * k, Math.sin(a) * k]), 0.7, easeOutExpo),
        d.size(0, 0.7, easeOutCubic),
      );
    }),
  );
  dots.forEach(d => d.remove());
}

// 화면 전체가 잠깐 하얗게 번쩍
export function addFlash(view: View2D) {
  const f = createRef<Rect>();
  view.add(<Rect ref={f} width={1080} height={1920} fill={'#ffffff'} opacity={0} />);
  return function* flash(peak = 0.22) {
    f().opacity(peak);
    yield* f().opacity(0, 0.5, easeOutCubic);
  };
}

// 카드 위로 빛줄기 한 번 지나가기 (카드는 clip 이어야 한다)
export function* shine(card: Rect) {
  const s = createRef<Rect>();
  const w = card.width();
  card.add(
    <Rect
      ref={s}
      layout={false}
      x={-w}
      width={90}
      height={card.height() * 2}
      rotation={20}
      fill={
        new Gradient({
          from: [-45, 0],
          to: [45, 0],
          stops: [
            {offset: 0, color: '#ffffff00'},
            {offset: 0.5, color: '#ffffff55'},
            {offset: 1, color: '#ffffff00'},
          ],
        })
      }
    />,
  );
  yield* s().x(w, 0.9, easeInOutExpo);
  s().remove();
}

// 큰 결과 카드 (가운데 글자 + 빛나는 테두리)
export function bigCard(text: string, color: string = C.amber, fontSize = 84) {
  return (
    <Rect
      layout
      clip
      alignItems="center"
      padding={[26, 54]}
      radius={28}
      fill={'#0B1028e6'}
      stroke={color}
      lineWidth={3}
      shadowColor={color}
      shadowBlur={34}
      opacity={0}
    >
      <Txt text={text} fontFamily={FONT} fontSize={fontSize} fontWeight={900} letterSpacing={-1} fill={C.ink} />
    </Rect>
  ) as Rect;
}

export function* popIn(node: Node, time = 0.55, from = 0.4) {
  node.scale(from);
  yield* all(node.opacity(1, time * 0.6), node.scale(1, time, easeOutBack));
}

export function* popOut(node: Node, time = 0.3) {
  yield* all(node.opacity(0, time), node.scale(0.8, time, easeInExpo));
}

// 숫자 세기 (정수)
export function* countTo(sig: (v?: number, t?: number, e?: any) => any, to: number, time = 1) {
  yield* sig(to, time, easeOutCubic);
}

/* ───────── 끝 카드: NEXT 예고 ───────── */

export function addEnd(view: View2D) {
  const root = createRef<Node>();
  const label = createRef<Txt>();
  const title = createRef<Txt>();
  const line = createRef<Rect>();
  view.add(
    <Node ref={root} y={-40} opacity={0}>
      <Txt ref={label} y={-110} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={14} fill={C.amber} />
      <Rect ref={line} y={-50} width={0} height={4} radius={2} fill={C.amber} />
      <Txt
        ref={title}
        y={60}
        fontFamily={FONT}
        fontSize={78}
        fontWeight={900}
        lineHeight={104}
        letterSpacing={-2}
        textAlign="center"
        fill={C.ink}
      />
    </Node>,
  );
  function* show(lab: string, text: string) {
    capLog('end', text);
    label().text(lab);
    title().text(text);
    title().filters.blur(16);
    title().y(110);
    root().opacity(1);
    cue('whoosh');
    yield* all(
      line().width(420, 0.8, easeOutExpo),
      title().y(60, 0.8, easeOutExpo),
      title().filters.blur(0, 0.6),
    );
  }
  return {show, root};
}

/* ───────── 장면 공통 뼈대 ───────── */

export function begin() {
  resetCues();
}

export function* finish(name: string, tail = 0.6) {
  yield* waitFor(tail);
  flushCues(name);
}

/* ───────── 치수선: 양끝 막대 + 가운데 글자 ───────── */

export function Dim(o: {
  from: [number, number];
  to: [number, number];
  label: string;
  color?: string;
  side?: [number, number]; // 글자를 선에서 얼마나 띄울지
  refs?: {line?: (l: Line) => void; node?: (n: Node) => void};
}) {
  const color = o.color ?? C.ink;
  const [x1, y1] = o.from;
  const [x2, y2] = o.to;
  const vx = x2 - x1;
  const vy = y2 - y1;
  const len = Math.hypot(vx, vy) || 1;
  const nx = (-vy / len) * 14;
  const ny = (vx / len) * 14;
  const side = o.side ?? [0, -44];
  return (
    <Node ref={o.refs?.node} opacity={0}>
      <Line points={[o.from, o.to]} stroke={color} lineWidth={4} ref={o.refs?.line} />
      <Line points={[[x1 - nx, y1 - ny], [x1 + nx, y1 + ny]]} stroke={color} lineWidth={4} />
      <Line points={[[x2 - nx, y2 - ny], [x2 + nx, y2 + ny]]} stroke={color} lineWidth={4} />
      <Txt
        x={(x1 + x2) / 2 + side[0]}
        y={(y1 + y2) / 2 + side[1]}
        text={o.label}
        fontFamily={FONT}
        fontSize={44}
        fontWeight={900}
        fill={color}
        shadowColor={'#000000cc'}
        shadowBlur={16}
      />
    </Node>
  );
}

/* ───────── 가운데 식 한 줄: 바뀔 때 흐려지며 빠지고 튀어나온다 ───────── */

export function addEq(view: View2D, y = 250, fontSize = 104) {
  const t = createRef<Txt>();
  view.add(
    <Txt
      ref={t}
      y={y}
      fontFamily={FONT}
      fontSize={fontSize}
      fontWeight={900}
      letterSpacing={-2}
      fill={C.ink}
      opacity={0}
      shadowColor={C.amber + '66'}
      shadowBlur={30}
    />,
  );
  function* set(text: string, color: string = C.ink, glow: string = C.amber) {
    if (t().opacity() > 0) {
      yield* all(t().opacity(0, 0.2), t().scale(0.9, 0.2, easeInExpo), t().filters.blur(10, 0.2));
    }
    t().text(text);
    t().fill(color);
    t().shadowColor(glow + '77');
    t().scale(1.25);
    t().filters.blur(14);
    cue('pop');
    yield* all(t().opacity(1, 0.3), t().scale(1, 0.5, easeOutExpo), t().filters.blur(0, 0.35));
  }
  function* hide() {
    yield* all(t().opacity(0, 0.3), t().filters.blur(10, 0.3));
  }
  return {set, hide, node: t};
}
