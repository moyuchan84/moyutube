import {Circle, Gradient, Line, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInBack,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  linear,
  useTime,
  waitFor,
} from '@motion-canvas/core';
import type {ThreadGenerator} from '@motion-canvas/core';
import {FONT} from './style';
import {C, capLog, cue} from './motion';
import {rand, reseed} from './fx';

// 「마술의 비밀」 무대 키트 — 커튼 · 스포트라이트 · 모자 마술사 · 수정구슬 · 색종이 · 기호 도형 · 박자 맞추기.
// 과학 편보다 화려하게: 보라 · 금색 무대, 박자에 맞춰 움직이는 캐릭터, 큰 공개 순간.
// 쇼츠 화면 아래 20%(y > 580)는 유튜브 UI 가 덮으니 비워 둔다.

export const M = {
  bg0: '#0A0614',
  bg1: '#241046',
  gold: '#FFC94B',
  gold2: '#FFE7A3',
  velvet: '#B3123A',
  velvetDark: '#5E0820',
  lilac: '#C9B6FF',
  ink: C.ink,
};

/* ───────── 박자: scripts/bgm-magic.mjs 와 같은 100 BPM ───────── */

export const BPM = 100;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;

// 다음 박(또는 1/div 박) 자리까지 기다린다 — 공개 · 펀치를 음악 박에 맞출 때
export function* toBeat(div = 1) {
  const step = BEAT / div;
  const t = useTime();
  const next = Math.ceil(t / step - 1e-4) * step;
  if (next - t > 1e-3) yield* waitFor(next - t);
}

// 시간 신호 (초) — 둥실거림 · 소용돌이처럼 계속 움직이는 것
export function addClock() {
  const t = createSignal(0);
  return {t, run: () => t(400, 400, linear)};
}

/* ───────── 무대: 보라 그라디언트 · 스포트라이트 · 바닥 빛 · 먼지 · 커튼 ───────── */

function radial(color: string, r: number, a0 = '66', a1 = '1c') {
  return new Gradient({
    type: 'radial',
    from: [0, 0],
    to: [0, 0],
    fromRadius: 0,
    toRadius: r,
    stops: [
      {offset: 0, color: color + a0},
      {offset: 0.5, color: color + a1},
      {offset: 1, color: color + '00'},
    ],
  });
}

export function addStage(view: View2D, clock: () => number) {
  const spot = createRef<Line>();
  const floor = createRef<Circle>();
  reseed(4242);
  const dust = Array.from({length: 26}, () => ({
    x: rand() * 1000 - 500,
    y: rand() * 1600 - 900,
    r: 3 + rand() * 6,
    sp: 10 + rand() * 26,
    ph: rand() * 6.28,
  }));
  view.add(
    <Node>
      <Rect
        width={1080}
        height={1920}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -960],
            to: [0, 960],
            stops: [
              {offset: 0, color: M.bg1},
              {offset: 0.55, color: '#160A2C'},
              {offset: 1, color: M.bg0},
            ],
          })
        }
      />
      <Circle size={1600} y={-300} fill={radial('#8A4DFF', 800, '40', '14')} />
      <Circle size={1200} x={() => 300 * Math.sin(clock() * 0.21)} y={500} fill={radial('#FF4FA0', 600, '22', '0c')} />
      {/* 스포트라이트 */}
      <Line
        ref={spot}
        closed
        points={[[-110, -980], [110, -980], [520, 640], [-520, 640]]}
        compositeOperation={'lighter'}
        opacity={() => 0.8 + 0.08 * Math.sin(clock() * 3.1) + 0.05 * Math.sin(clock() * 7.3)}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -980],
            to: [0, 640],
            stops: [
              {offset: 0, color: '#FFF1C230'},
              {offset: 0.7, color: '#FFE3A012'},
              {offset: 1, color: '#FFE3A000'},
            ],
          })
        }
      />
      <Circle ref={floor} y={560} width={980} height={150} fill={radial('#FFE3A0', 490, '30', '10')} compositeOperation={'lighter'} />
      {/* 떠다니는 금가루 */}
      <Node compositeOperation={'lighter'}>
        {dust.map(d => (
          <Circle
            size={d.r * 2}
            fill={M.gold2}
            opacity={() => 0.25 + 0.25 * Math.sin(clock() * 1.7 + d.ph)}
            x={() => d.x + 20 * Math.sin(clock() * 0.5 + d.ph)}
            y={() => ((((d.y - clock() * d.sp + 960) % 1920) + 1920) % 1920) - 960}
          />
        ))}
      </Node>
    </Node>,
  );
  return {spot, floor};
}

// 벨벳 커튼 한 쪽 (주름 = 세로 줄무늬 그라디언트)
function Curtain(o: {side: -1 | 1; refFn: (n: Node) => void}) {
  const W = 600;
  const stops = [];
  const folds = 7;
  for (let k = 0; k <= folds * 2; k++) {
    stops.push({offset: k / (folds * 2), color: k % 2 ? M.velvet : M.velvetDark});
  }
  return (
    <Node ref={o.refFn} x={o.side * (W / 2 - 30)}>
      <Rect
        width={W}
        height={1960}
        fill={new Gradient({type: 'linear', from: [-W / 2, 0], to: [W / 2, 0], stops})}
        shadowColor={'#000000'}
        shadowBlur={60}
      />
      {/* 아랫단 금술 */}
      <Rect y={950} width={W} height={26} fill={M.gold} opacity={0.85} />
      {/* 안쪽 가장자리 빛 */}
      <Rect
        x={-o.side * (W / 2 - 14)}
        width={28}
        height={1960}
        fill={new Gradient({type: 'linear', from: [-14, 0], to: [14, 0], stops: [{offset: 0, color: '#ffffff00'}, {offset: 0.5, color: '#ffb0c444'}, {offset: 1, color: '#ffffff00'}]})}
      />
    </Node>
  );
}

export function addCurtains(view: View2D) {
  let left: Node, right: Node;
  const valance = createRef<Node>();
  view.add(
    <Node>
      <Curtain side={-1} refFn={n => (left = n)} />
      <Curtain side={1} refFn={n => (right = n)} />
      {/* 위 장식 띠 (HUD 보다 위) */}
      <Node ref={valance} y={-948}>
        <Rect width={1080} height={40} fill={M.velvetDark} />
        {Array.from({length: 9}, (_, i) => (
          <Circle x={-480 + i * 120} y={14} width={128} height={56} fill={M.velvet} startAngle={0} endAngle={180} closed />
        ))}
        <Rect y={-14} width={1080} height={8} fill={M.gold} opacity={0.8} />
      </Node>
    </Node>,
  );
  const OPEN = 540 + 300 - 64; // 가장자리에 64px 만 남긴다
  function* open(time = 1.1) {
    cue('curtain');
    yield* all(left!.x(-OPEN, time, easeInOutCubic), right!.x(OPEN, time, easeInOutCubic));
  }
  function* close(time = 0.9) {
    cue('curtain');
    yield* all(left!.x(-270, time, easeInOutCubic), right!.x(270, time, easeInOutCubic));
  }
  return {open, close};
}

/* ───────── 모자 마술사: 눈 깜빡 · 박자에 맞춰 둥실 · 지팡이 톡 · 말풍선 ───────── */

export function addHat(view: Node, clock: () => number, o: {x?: number; y?: number; scale?: number} = {}) {
  const root = createRef<Node>();
  const body = createRef<Node>();
  const eyes = createRef<Node>();
  const look = createSignal(0); // -1 왼쪽 ~ 1 오른쪽
  const lookY = createSignal(0);
  const mouthOpen = createSignal(0);
  const wand = createRef<Node>();
  const tip = createRef<Circle>();
  const bobAmp = createSignal(12);

  const crown: [number, number][] = [[-92, -14], [92, -14], [78, -230], [-78, -230]];
  const band: [number, number][] = [[-91, -16], [91, -16], [86, -66], [-86, -66]];

  view.add(
    <Node ref={root} x={o.x ?? 0} y={o.y ?? 0} scale={o.scale ?? 1}>
      {/* 바닥 그림자 */}
      <Circle y={44} width={() => 230 - bobAmp() * 2.5 * Math.abs(Math.sin((clock() * Math.PI) / (BEAT * 2)))} height={30} fill={'#00000066'} />
      <Node ref={body} y={() => -bobAmp() * Math.abs(Math.sin((clock() * Math.PI) / (BEAT * 2)))}>
        {/* 지팡이 (오른쪽) */}
        <Node ref={wand} x={140} y={-70} rotation={28}>
          <Rect y={-60} width={18} height={190} radius={9} fill={'#14101F'} stroke={'#3A2F5C'} lineWidth={3} />
          <Rect y={-140} width={18} height={36} radius={9} fill={'#F7F4FF'} />
          <Circle ref={tip} y={-160} size={0} fill={M.gold2} shadowColor={M.gold} shadowBlur={30} />
        </Node>
        {/* 모자 몸통 */}
        <Line
          closed
          radius={18}
          points={crown}
          fill={new Gradient({type: 'linear', from: [-90, 0], to: [90, 0], stops: [{offset: 0, color: '#1A1233'}, {offset: 0.45, color: '#3B2A6E'}, {offset: 1, color: '#140D28'}]})}
          stroke={'#5B47A8'}
          lineWidth={3}
        />
        <Rect y={-230} width={158} height={30} radius={15} fill={'#4A3787'} stroke={'#6D58C4'} lineWidth={3} />
        <Line closed radius={4} points={band} fill={'#D7263D'} />
        {/* 띠 위 별 장식 */}
        <Line closed points={starPts(16, 7)} y={-41} fill={M.gold} />
        {/* 챙 */}
        <Rect y={-6} width={270} height={40} radius={20} fill={'#120C24'} stroke={M.gold} lineWidth={3} />
        {/* 눈 */}
        <Node ref={eyes} y={-150}>
          {[-36, 36].map(ex => (
            <Node x={ex}>
              <Circle width={46} height={58} fill={'#FFFFFF'} />
              <Circle x={() => look() * 9} y={() => lookY() * 10 + 4} size={22} fill={'#120C24'} />
              <Circle x={() => look() * 9 - 5} y={() => lookY() * 10 - 2} size={7} fill={'#FFFFFF'} />
            </Node>
          ))}
        </Node>
        {/* 입: 웃는 선 ↔ 벌린 입 */}
        <Line
          y={-104}
          points={[[-22, -4], [0, 8], [22, -4]]}
          radius={12}
          stroke={'#FFFFFF'}
          lineWidth={6}
          lineCap="round"
          opacity={() => 1 - mouthOpen()}
        />
        <Circle y={-100} width={30} height={() => 4 + 22 * mouthOpen()} fill={'#2A0E1E'} stroke={'#FFFFFF'} lineWidth={4} opacity={() => mouthOpen()} />
      </Node>
    </Node>,
  );

  // 0.6초 박자마다 깜빡이지는 않고, 정해 둔 때에 한 번씩
  function* blink() {
    yield* eyes().scale([1, 0.08], 0.07, easeInCubic);
    yield* eyes().scale([1, 1], 0.09, easeOutCubic);
  }
  function* tap(color: string = M.gold2) {
    cue('tap');
    tip().fill(color);
    tip().shadowColor(color);
    yield* wand().rotation(52, 0.12, easeInCubic);
    yield* all(wand().rotation(28, 0.35, easeOutBack), tip().size(60, 0.12).to(0, 0.4, easeOutCubic));
  }
  function* talk(sec: number) {
    const n = Math.max(1, Math.round(sec / 0.24));
    for (let k = 0; k < n; k++) yield* mouthOpen(k % 2 ? 0.25 : 1, 0.12);
    yield* mouthOpen(0, 0.12);
  }
  function* hop() {
    yield* body().scale([1.12, 0.86], 0.1, easeOutCubic);
    yield* body().scale([0.92, 1.12], 0.14, easeOutCubic);
    yield* body().scale([1, 1], 0.3, easeOutBack);
  }
  function* enter(fromY = -1300) {
    const y0 = root().y();
    root().y(fromY);
    yield* root().y(y0, 0.55, easeInCubic);
    cue('pop');
    yield* hop();
  }
  return {root, body, look, lookY, bobAmp, wand, blink, tap, talk, hop, enter};
}

/* ───────── 말풍선: 꼬리가 달린 흰 풍선. say 로 글자를 바꾸며 튀어나온다 ───────── */

export function addBubble(view: Node, o: {x: number; y: number; tail?: [number, number]; width?: number}) {
  const root = createRef<Node>();
  const box = createRef<Rect>();
  const txt = createRef<Txt>();
  const tail = o.tail ?? [-120, 70];
  view.add(
    <Node ref={root} x={o.x} y={o.y} opacity={0}>
      <Line closed points={[[tail[0] * 0.25 - 26, 20], [tail[0] * 0.25 + 26, 20], tail]} fill={'#FFFDF6'} />
      <Rect
        ref={box}
        layout
        padding={[24, 36]}
        radius={36}
        fill={'#FFFDF6'}
        shadowColor={'#00000088'}
        shadowBlur={30}
        shadowOffsetY={8}
      >
        <Txt
          ref={txt}
          fontFamily={FONT}
          fontSize={46}
          fontWeight={900}
          lineHeight={62}
          letterSpacing={-1}
          fill={'#1E1238'}
          textAlign="center"
          textWrap={false}
        />
      </Rect>
    </Node>,
  );
  function* say(text: string, log = true) {
    if (log) capLog('say', text);
    if (root().opacity() > 0) yield* all(root().scale(0.85, 0.12, easeInCubic), root().opacity(0, 0.12));
    txt().text(text);
    root().scale(0.4);
    cue('pop');
    yield* all(root().opacity(1, 0.15), root().scale(1, 0.4, easeOutBack));
  }
  function* hide() {
    yield* all(root().scale(0.6, 0.2, easeInBack), root().opacity(0, 0.2));
  }
  return {root, say, hide};
}

/* ───────── 수정구슬: 안개가 빙글빙글, reveal 때 가운데에서 기호가 떠오른다 ───────── */

export function addOrb(view: Node, clock: () => number, o: {y?: number; size?: number} = {}) {
  const S = o.size ?? 420;
  const root = createRef<Node>();
  const ball = createRef<Circle>();
  const inner = createRef<Node>();
  const glow = createRef<Circle>();
  const fogSpeed = createSignal(1);
  const spin = createSignal(0);
  view.add(
    <Node ref={root} y={o.y ?? -200} opacity={0}>
      <Circle ref={glow} size={S * 1.7} fill={radial('#B58CFF', S * 0.85, '55', '18')} compositeOperation={'lighter'} />
      {/* 받침 */}
      <Line closed radius={10} y={S * 0.52} points={[[-S * 0.32, -20], [S * 0.32, -20], [S * 0.44, 70], [-S * 0.44, 70]]} fill={new Gradient({type: 'linear', from: [-S * 0.44, 0], to: [S * 0.44, 0], stops: [{offset: 0, color: '#7A4E12'}, {offset: 0.5, color: M.gold}, {offset: 1, color: '#7A4E12'}]})} />
      <Rect y={S * 0.52 + 76} width={S * 1.0} height={26} radius={13} fill={'#5A380C'} />
      <Circle
        ref={ball}
        size={S}
        clip
        fill={new Gradient({type: 'radial', from: [-S * 0.12, -S * 0.14], to: [0, 0], fromRadius: 0, toRadius: S / 2, stops: [{offset: 0, color: '#E9DDFF'}, {offset: 0.45, color: '#8E6BEA'}, {offset: 1, color: '#2A1260'}]})}
        stroke={'#E3D4FF'}
        lineWidth={4}
      >
        {/* 안개 */}
        {Array.from({length: 4}, (_, k) => (
          <Circle
            size={S * (0.7 - k * 0.08)}
            x={() => Math.cos(spin() + (k * Math.PI) / 2) * S * 0.2}
            y={() => Math.sin(spin() * 1.3 + (k * Math.PI) / 2) * S * 0.16}
            fill={radial(k % 2 ? '#FF9AE0' : '#9EF6FF', S * 0.35, '55', '22')}
            compositeOperation={'lighter'}
          />
        ))}
        <Node ref={inner} />
        {/* 반짝이는 하이라이트 */}
        <Circle x={-S * 0.2} y={-S * 0.22} width={S * 0.26} height={S * 0.14} rotation={-30} fill={'#FFFFFF66'} />
      </Circle>
    </Node>,
  );
  function* run(): ThreadGenerator {
    // 안개: fogSpeed 에 따라 돈다 (드럼롤 때 빨라짐)
    while (true) {
      spin(spin() + fogSpeed() * 0.05);
      yield;
    }
  }
  return {root, ball, inner, glow, fogSpeed, spin, run};
}

/* ───────── 기호 도형 9종 (글꼴에 없는 기호도 똑같이 보이게 직접 그린다) ───────── */

export type SymKind = 'star' | 'heart' | 'circle' | 'tri' | 'square' | 'diamond' | 'moon' | 'plus' | 'ring';
export const SYM_COLOR: Record<SymKind, string> = {
  star: '#FFC94B',
  heart: '#FF5F8F',
  circle: '#4FC3FF',
  tri: '#7CF29A',
  square: '#B18CFF',
  diamond: '#FF9F43',
  moon: '#F4F1EA',
  plus: '#5EEAD4',
  ring: '#FF8AD8',
};

export function starPts(R: number, r: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  return pts;
}

function heartPts(s: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push([(x / 17) * s, (-y / 17) * s + s * 0.08]);
  }
  return pts;
}

// size = 지름 쯤. bg 는 초승달 안쪽을 파낼 바탕색
export function Sym(o: {kind: SymKind; size: number; bg?: string; color?: string; refFn?: (n: Node) => void; x?: number; y?: number}) {
  const s = o.size / 2;
  const col = o.color ?? SYM_COLOR[o.kind];
  const bg = o.bg ?? '#1B1033';
  let shape;
  switch (o.kind) {
    case 'star':
      shape = <Line closed points={starPts(s * 1.08, s * 0.46)} fill={col} />;
      break;
    case 'heart':
      shape = <Line closed points={heartPts(s)} fill={col} />;
      break;
    case 'circle':
      shape = <Circle size={s * 1.7} fill={col} />;
      break;
    case 'tri':
      shape = <Line closed radius={s * 0.12} points={[[0, -s * 0.95], [s * 0.95, s * 0.72], [-s * 0.95, s * 0.72]]} fill={col} />;
      break;
    case 'square':
      shape = <Rect size={s * 1.5} radius={s * 0.14} fill={col} />;
      break;
    case 'diamond':
      shape = <Rect size={s * 1.3} radius={s * 0.1} rotation={45} fill={col} />;
      break;
    case 'moon':
      shape = (
        <Node>
          <Circle size={s * 1.8} fill={col} />
          <Circle x={s * 0.5} y={-s * 0.25} size={s * 1.5} fill={bg} />
        </Node>
      );
      break;
    case 'plus':
      shape = (
        <Node>
          <Rect width={s * 1.7} height={s * 0.55} radius={s * 0.12} fill={col} />
          <Rect width={s * 0.55} height={s * 1.7} radius={s * 0.12} fill={col} />
        </Node>
      );
      break;
    case 'ring':
      shape = <Circle size={s * 1.4} stroke={col} lineWidth={s * 0.38} />;
      break;
  }
  return (
    <Node ref={o.refFn} x={o.x ?? 0} y={o.y ?? 0}>
      {shape}
    </Node>
  );
}

/* ───────── 색종이: 위에서 터져 흩날리며 떨어진다 ───────── */

export function* confetti(parent: Node, o: {at?: [number, number]; n?: number; seed?: number} = {}) {
  const at = o.at ?? [0, -300];
  const n = o.n ?? 46;
  reseed(o.seed ?? 99);
  const colors = [M.gold, '#FF5F8F', '#4FC3FF', '#7CF29A', '#B18CFF', '#FFFFFF'];
  const bits: Rect[] = [];
  const plan = Array.from({length: n}, (_, i) => {
    const a = -Math.PI / 2 + (rand() - 0.5) * Math.PI * 1.3;
    const v = 380 + rand() * 520;
    return {
      dx: Math.cos(a) * v,
      dy: Math.sin(a) * v,
      fall: 600 + rand() * 500,
      rot: (rand() - 0.5) * 1440,
      w: 14 + rand() * 14,
      h: 8 + rand() * 10,
      c: colors[i % colors.length],
      d: rand() * 0.12,
    };
  });
  for (const p of plan) {
    const r = <Rect position={at} width={p.w} height={p.h} radius={2} fill={p.c} /> as Rect;
    parent.add(r);
    bits.push(r);
  }
  yield* all(
    ...bits.map((b, i) => {
      const p = plan[i];
      return delay(
        p.d,
        all(
          b.x(at[0] + p.dx, 1.8, easeOutCubic),
          b.y(at[1] + p.dy, 0.5, easeOutCubic).to(at[1] + p.dy + p.fall, 1.3, easeInCubic),
          b.rotation(p.rot, 1.8, linear),
          b.scale([1, 0.3], 0.3).to([1, 1], 0.3).to([1, 0.3], 0.3).to([1, 1], 0.3).to([1, 0.3], 0.3).to([1, 1], 0.3),
          delay(1.2, b.opacity(0, 0.6)),
        ),
      );
    }),
  );
  bits.forEach(b => b.remove());
}

/* ───────── 물음표 상자 (생각한 숫자 자리) ───────── */

export function QBox(o: {color: string; w?: number; h?: number; text?: () => string; refFn?: (n: Rect) => void; fontSize?: number}) {
  const w = o.w ?? 170;
  const h = o.h ?? 210;
  return (
    <Rect
      ref={o.refFn}
      width={w}
      height={h}
      radius={w * 0.16}
      fill={o.color + '26'}
      stroke={o.color}
      lineWidth={6}
      shadowColor={o.color}
      shadowBlur={30}
    >
      <Txt text={o.text ?? '?'} fontFamily={FONT} fontSize={o.fontSize ?? h * 0.62} fontWeight={900} fill={C.ink} />
    </Rect>
  ) as Rect;
}

/* ───────── 큰 글자 한 번 쾅 (설명 없이 리듬으로 박는 단어) ───────── */

export function addSlam(view: View2D, y = -560) {
  const t = createRef<Txt>();
  view.add(
    <Txt
      ref={t}
      y={y}
      fontFamily={FONT}
      fontSize={120}
      fontWeight={900}
      letterSpacing={-3}
      fill={M.gold}
      stroke={'#3A1A00'}
      lineWidth={10}
      strokeFirst
      shadowColor={M.gold + 'aa'}
      shadowBlur={40}
      opacity={0}
    />,
  );
  function* slam(text: string, color = M.gold, hold = 0) {
    t().text(text);
    t().fill(color);
    t().shadowColor(color + 'aa');
    t().scale(2.2);
    t().rotation(-6);
    yield* all(t().opacity(1, 0.1), t().scale(1, 0.32, easeOutBack), t().rotation(0, 0.32, easeOutExpo));
    if (hold) yield* waitFor(hold);
  }
  function* out() {
    yield* all(t().opacity(0, 0.2), t().scale(0.7, 0.2, easeInCubic));
  }
  return {slam, out, node: t};
}
