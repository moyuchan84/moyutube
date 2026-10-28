import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Series, SERIES, WEEKS } from "../units/ranking/data";
import { C, fontFamily, springs } from "../theme";

const X = [200, 460, 720];
const Y_TOP = 480;
const STEP = 70;
const Y_OUT = Y_TOP + 9 * STEP + 130;

export const yOf = (r: number | "out") => (r === "out" ? Y_OUT : Y_TOP + (r - 1) * STEP);

type Pt = { x: number; y: number };

const points = (s: Series): Pt[] =>
  s.ranks.flatMap((r, i) => (r === null ? [] : [{ x: X[i], y: yOf(r) }]));

const segLen = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

// 진행률(0~1)만큼 폴리라인을 자른다
const partial = (pts: Pt[], p: number): Pt[] => {
  if (pts.length < 2) return pts;
  const total = pts.slice(1).reduce((acc, b, i) => acc + segLen(pts[i], b), 0);
  let left = total * p;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const l = segLen(pts[i - 1], pts[i]);
    if (left >= l) {
      out.push(pts[i]);
      left -= l;
    } else {
      const k = l === 0 ? 0 : left / l;
      out.push({ x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k });
      break;
    }
  }
  return out;
};

const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");

export type LineState = { progress: number; opacity: number; glow: number };

export const RankChart: React.FC<{
  state: Record<string, LineState>;
  gridIn: number;
}> = ({ state, gridIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        {SERIES.map((s) => (
          <filter key={s.id} id={`glow-${s.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* 축과 눈금: 위에서부터 순서대로 펼쳐짐 */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = interpolate(gridIn, [i / 14, i / 14 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = yOf(i + 1);
        return (
          <g key={i} opacity={a}>
            <line x1={150} x2={930} y1={y} y2={y} stroke={C.grid} strokeWidth={2} />
            <text x={110} y={y + 12} fill={C.dim} fontFamily={fontFamily} fontWeight={700} fontSize={32} textAnchor="end">
              {i + 1}
            </text>
          </g>
        );
      })}
      <g opacity={interpolate(gridIn, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <rect x={150} y={Y_OUT - 45} width={780} height={90} rx={18} fill="rgba(255,255,255,0.04)" stroke={C.grid} strokeDasharray="10 10" strokeWidth={2} />
        <text x={X[1]} y={Y_OUT + 12} fill={C.dim} fontFamily={fontFamily} fontWeight={700} fontSize={32} textAnchor="middle">
          TOP 10 밖
        </text>
        {WEEKS.map((w, i) => (
          <text key={w} x={X[i]} y={Y_OUT + 100} fill={C.dim} fontFamily={fontFamily} fontWeight={700} fontSize={34} textAnchor="middle">
            {w}
          </text>
        ))}
      </g>

      {/* 순위 선 */}
      {SERIES.map((s) => {
        const st = state[s.id];
        if (!st || st.opacity <= 0) return null;
        const pts = partial(points(s), Easing.inOut(Easing.cubic)(st.progress));
        const head = pts[pts.length - 1];
        const pulse = 1 + Math.sin(frame / 4) * 0.15 * st.glow;
        const showLabel = st.progress > 0.98;
        const labelIn = spring({ frame: showLabel ? frame : 0, fps, config: springs.snappy, durationInFrames: 10 });
        return (
          <g key={s.id} opacity={st.opacity} filter={st.glow > 0 ? `url(#glow-${s.id})` : undefined}>
            <path d={path(pts)} stroke={s.color} strokeWidth={10 + 4 * st.glow} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) =>
              // 꺾이는 지점마다 점 (진행 중인 머리는 따로 그림)
              i < pts.length - 1 || st.progress >= 1 ? <circle key={i} cx={p.x} cy={p.y} r={12} fill={C.bg} stroke={s.color} strokeWidth={6} /> : null,
            )}
            {head && st.progress > 0 && <circle cx={head.x} cy={head.y} r={16 * pulse} fill={s.color} />}
            {showLabel && head && (
              <text
                x={head.x + 34}
                y={head.y + 12}
                fill={s.color}
                opacity={labelIn}
                fontFamily={fontFamily}
                fontWeight={900}
                fontSize={36}
              >
                {s.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const CHART_X = X;
