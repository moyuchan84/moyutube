import {Line, Node, Txt} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {FONT} from './style';
import {C} from './motion';

// 고등편(그래프가 나오는 편) 공용: 좌표 → 화면 변환, 축, 함수 곡선 점 찍기.

export type Frame = {ox: number; oy: number; sx: number; sy: number};

export function px(f: Frame, x: number, y: number): [number, number] {
  return [f.ox + x * f.sx, f.oy - y * f.sy];
}

export function curve(f: Frame, fn: (x: number) => number, a: number, b: number, n = 120): [number, number][] {
  return Array.from({length: n + 1}, (_, i) => {
    const x = a + ((b - a) * i) / n;
    return px(f, x, fn(x));
  });
}

// x 축 · y 축 (화살표 끝) + 축 이름
export function Axes(p: {
  f: Frame;
  x: [number, number];
  y: [number, number];
  r?: Reference<Node>;
  xl?: string;
  yl?: string;
  ticks?: {x?: number[]; y?: number[]};
  opacity?: number;
}) {
  const {f} = p;
  const col = '#ffffff66';
  return (
    <Node ref={p.r} opacity={p.opacity ?? 0}>
      <Line points={[px(f, p.x[0], 0), px(f, p.x[1], 0)]} stroke={col} lineWidth={4} endArrow arrowSize={16} />
      <Line points={[px(f, 0, p.y[0]), px(f, 0, p.y[1])]} stroke={col} lineWidth={4} endArrow arrowSize={16} />
      {p.xl ? (
        <Txt x={px(f, p.x[1], 0)[0] - 10} y={f.oy + 44} text={p.xl} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.dim} />
      ) : null}
      {p.yl ? (
        <Txt x={f.ox + 44} y={px(f, 0, p.y[1])[1] + 8} text={p.yl} fontFamily={FONT} fontSize={38} fontWeight={800} fill={C.dim} />
      ) : null}
      {(p.ticks?.x ?? []).map(v => (
        <Node>
          <Line points={[px(f, v, 0), [px(f, v, 0)[0], f.oy + 14]]} stroke={col} lineWidth={4} />
          <Txt x={px(f, v, 0)[0]} y={f.oy + 44} text={String(v)} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
        </Node>
      ))}
      {(p.ticks?.y ?? []).map(v => (
        <Node>
          <Line points={[px(f, 0, v), [f.ox - 14, px(f, 0, v)[1]]]} stroke={col} lineWidth={4} />
          <Txt x={f.ox - 44} y={px(f, 0, v)[1]} text={String(v)} fontFamily={FONT} fontSize={34} fontWeight={800} fill={C.dim} />
        </Node>
      ))}
    </Node>
  );
}
