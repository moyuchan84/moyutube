import {Vector2} from '@motion-canvas/core';

// 화면 좌표(y 아래로)에서의 각도. Motion Canvas 의 startAngle/endAngle 과 같은 기준이다.
export const angleOf = (from: Vector2, to: Vector2) =>
  (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

// 꼭짓점 V 에서 P · Q 쪽으로 벌어진 안쪽 각의 부채꼴 (시작 각, 크기)
export function sector(V: Vector2, P: Vector2, Q: Vector2) {
  const a1 = angleOf(V, P);
  const a2 = angleOf(V, Q);
  const d = (((a2 - a1) % 360) + 360) % 360;
  return d > 180 ? {start: a2, sweep: 360 - d} : {start: a1, sweep: d};
}

// -180 ~ 180 으로 맞춘다 (회전을 짧은 쪽으로 돌게)
export const norm180 = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

// 직각 표시 꺾쇠: 발 F 에서 위로 선 높이, 밑변 쪽 방향 dir(+1 오른쪽, -1 왼쪽)
export const rightMark = (F: Vector2, dir: number, s = 20): [number, number][] => [
  [F.x + dir * s, F.y],
  [F.x + dir * s, F.y - s],
  [F.x, F.y - s],
];
