import {Line, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeOutExpo, waitFor} from '@motion-canvas/core';
import type {ThreadGenerator} from '@motion-canvas/core';
import {FONT} from './style';
import {C, cue, popIn} from './motion';

// 과학 시즌 공통 조각 — 준비 단계(작은 그림 + 화살표), 테스트 카운트다운 칩, 어둡게 덮기.
// motion.tsx · fx.tsx 와 같이 쓴다.

/* ───────── 어둡게 덮기 (테스트 때 배경을 가린다) ───────── */

export function addDim(view: View2D, color = '#07080E') {
  const r = createRef<Rect>();
  view.add(<Rect ref={r} width={1080} height={1920} fill={color} opacity={0} />);
  return r;
}

/* ───────── 위쪽 카운트다운 칩: TEST 12 ───────── */

export function addTimer(view: View2D, label = 'TEST', y = -690) {
  const node = createRef<Rect>();
  const count = createSignal(0);
  view.add(
    <Rect
      ref={node}
      y={y}
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
      <Txt text={label} fontFamily={FONT} fontSize={30} fontWeight={900} letterSpacing={6} fill={C.amber} />
      <Txt text={() => String(Math.max(0, Math.ceil(count())))} fontFamily={FONT} fontSize={52} fontWeight={900} fill={C.ink} />
    </Rect>,
  );
  // n 초를 1초씩 센다. at[k] 가 있으면 남은 시간이 k 일 때 그 동작을 같이 돌린다 (1초 안에 끝나는 것)
  function* run(n: number, at: Record<number, () => ThreadGenerator> = {}) {
    for (let k = n; k >= 1; k--) {
      count(k);
      cue('tick');
      if (at[k]) yield* all(at[k](), waitFor(1));
      else yield* waitFor(1);
    }
    count(0);
  }
  return {node, count, run};
}

/* ───────── 준비 단계: 작은 그림 2~3개를 화살표로 잇는다 ───────── */

export function addSteps(
  view: View2D,
  o: {badge: string; steps: {draw: () => any; label: string}[]; y?: number; color?: string},
) {
  const color = o.color ?? C.amber;
  const y = o.y ?? -260;
  const n = o.steps.length;
  const gapX = n === 2 ? 460 : 330;
  const xs = o.steps.map((_, i) => (i - (n - 1) / 2) * gapX);
  const root = createRef<Node>();
  const badge = createRef<Rect>();
  const steps: Node[] = [];
  const arrows: Line[] = [];
  view.add(
    <Node ref={root} opacity={0}>
      <Rect
        ref={badge}
        y={-500}
        layout
        padding={[12, 30]}
        radius={999}
        fill={color + '22'}
        stroke={color}
        lineWidth={3}
        shadowColor={color}
        shadowBlur={24}
        opacity={0}
      >
        <Txt text={o.badge} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={4} fill={C.ink} />
      </Rect>
      {o.steps.map((s, i) => (
        <Node ref={el => (steps[i] = el)} x={xs[i]} y={y} opacity={0}>
          {s.draw()}
          <Txt y={165} text={s.label} fontFamily={FONT} fontSize={n === 2 ? 40 : 34} fontWeight={800} fill={C.ink} textAlign="center" />
        </Node>
      ))}
      {xs.slice(1).map((x, i) => {
        const mid = (xs[i] + x) / 2;
        const half = n === 2 ? 80 : 40;
        return (
          <Line
            ref={el => (arrows[i] = el)}
            points={[[mid - half, y], [mid + half, y]]}
            stroke={color}
            lineWidth={8}
            endArrow
            arrowSize={22}
            end={0}
            shadowColor={color}
            shadowBlur={16}
          />
        );
      })}
    </Node>,
  );
  function* showBadge() {
    root().opacity(1);
    cue('pop');
    yield* popIn(badge(), 0.5, 0.6);
  }
  function* step(i: number) {
    if (i > 0) {
      cue('swish');
      yield* arrows[i - 1].end(1, 0.45, easeOutExpo);
    }
    cue('pop');
    yield* popIn(steps[i], 0.5, 0.6);
  }
  return {root, showBadge, step, steps};
}
