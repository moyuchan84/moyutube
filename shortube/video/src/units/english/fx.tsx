import { loadFont } from "@remotion/google-fonts/NanumPenScript";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import TL from "../../../../content/english/script/timeline.json";

// 수능 영어 1등급 비율 쇼츠 전용 화면 효과 — 하늘색 모눈 노트 · 채점 빨간 펜 · 롤러코스터 레일 모두 코드로 그린다 (사진 · 실제 시험지 없음).
export const { fontFamily: penFont } = loadFont("normal", { weights: ["400"] });

export const P = {
  paper: "#E3EFFA",
  paper2: "#D3E4F5",
  grid: "rgba(31,78,156,0.13)",
  ink: "#1B2F5E",
  dim: "#5A6E95",
  red: "#D7263D",
  blue: "#2C6BD6",
  card: "#FFFFFF",
  rail: "#1B2F5E",
  hi: "#FFE066",
};

export const DDAY = Math.round((Date.parse(TL.exam) - Date.parse(TL.asOf)) / 864e5);
export const pct = (v: number) => `${v.toFixed(2)}%`;

// 모눈 노트 바탕 + 왼쪽 빨간 여백선
export const NoteBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.paper} 0%, ${P.paper2} 100%)` }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${P.grid} 2px, transparent 2px), linear-gradient(90deg, ${P.grid} 2px, transparent 2px)`,
        backgroundSize: "60px 60px",
      }}
    />
    <div style={{ position: "absolute", left: 54, top: 0, bottom: 0, width: 3, background: "rgba(215,38,61,0.35)" }} />
  </AbsoluteFill>
);

// 장면 전환: 빨간 펜 사선 획이 화면을 긋고 지나가며 새 장면을 드러낸다
export const PenWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 14], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  const slant = 600;
  const x = -slant + e * (1080 + slant * 2);
  const clip = first ? "none" : `polygon(0 0, ${x + slant}px 0, ${x}px 1920px, 0 1920px)`;
  const strokeO = first ? 0 : interpolate(frame, [0, 2, 12, 16], [0, 1, 1, 0], clamp);
  const ang = (Math.atan2(1920, slant) * 180) / Math.PI;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <NoteBg />
        {children}
      </AbsoluteFill>
      {!first && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: 1920,
            width: 2100,
            height: 26,
            borderRadius: 13,
            background: P.red,
            opacity: strokeO * 0.9,
            transformOrigin: "0 50%",
            transform: `rotate(-${ang}deg)`,
            boxShadow: "0 0 18px rgba(215,38,61,0.5)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// 빨간 펜 동그라미: progress 0~1 만큼 그려진다
export const PenCircle: React.FC<{ w: number; h: number; progress: number; color?: string; style?: React.CSSProperties }> = ({ w, h, progress, color = P.red, style }) => {
  const len = Math.PI * (w + h) * 0.55 + 60;
  return (
    <svg width={w + 40} height={h + 40} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={`M ${w * 0.62 + 20} ${12} C ${w + 40} ${0}, ${w + 46} ${h + 34}, ${w / 2 + 20} ${h + 32} C ${-10} ${h + 30}, ${-4} ${6}, ${w * 0.5 + 20} ${8} L ${w * 0.78 + 20} ${16}`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};

// 롤러코스터 수레 (옆모습). 바닥 가운데가 (0,0) 기준
export const Cart: React.FC<{ x: number; y: number; angle: number; scale?: number }> = ({ x, y, angle, scale = 1 }) => (
  <svg
    width={140}
    height={90}
    viewBox="-70 -80 140 90"
    style={{ position: "absolute", left: x - 70, top: y - 80, overflow: "visible", transform: `rotate(${angle}deg) scale(${scale})`, transformOrigin: "70px 80px" }}
  >
    <rect x={-60} y={-62} width={120} height={46} rx={14} fill={P.red} stroke={P.ink} strokeWidth={5} />
    <rect x={-46} y={-78} width={22} height={20} rx={6} fill={P.ink} />
    <rect x={8} y={-78} width={22} height={20} rx={6} fill={P.ink} />
    <path d="M -60 -40 L 60 -40" stroke="#fff" strokeWidth={5} opacity={0.6} />
    <circle cx={-34} cy={-10} r={11} fill={P.card} stroke={P.ink} strokeWidth={5} />
    <circle cx={34} cy={-10} r={11} fill={P.card} stroke={P.ink} strokeWidth={5} />
  </svg>
);

// Catmull-Rom 곡선 (베지어로 바꿔 그림 · 같은 식으로 수레 위치를 계산)
export type Pt = { x: number; y: number };
const seg = (pts: Pt[], i: number) => {
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
  return [p1, { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }, p2];
};
export const curvePath = (pts: Pt[], dy = 0) => {
  let d = `M ${pts[0].x} ${pts[0].y + dy}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [, c1, c2, e] = seg(pts, i);
    d += ` C ${c1.x} ${c1.y + dy}, ${c2.x} ${c2.y + dy}, ${e.x} ${e.y + dy}`;
  }
  return d;
};
// t: 0 ~ pts.length-1
export const curveAt = (pts: Pt[], t: number) => {
  const i = Math.min(pts.length - 2, Math.max(0, Math.floor(t)));
  const u = Math.min(1, Math.max(0, t - i));
  const [a, b, c, d] = seg(pts, i);
  const m = 1 - u;
  const x = m * m * m * a.x + 3 * m * m * u * b.x + 3 * m * u * u * c.x + u * u * u * d.x;
  const y = m * m * m * a.y + 3 * m * m * u * b.y + 3 * m * u * u * c.y + u * u * u * d.y;
  const dx = 3 * m * m * (b.x - a.x) + 6 * m * u * (c.x - b.x) + 3 * u * u * (d.x - c.x);
  const dyv = 3 * m * m * (b.y - a.y) + 6 * m * u * (c.y - b.y) + 3 * u * u * (d.y - c.y);
  return { x, y, angle: (Math.atan2(dyv, dx) * 180) / Math.PI };
};

// 레일: 두 줄 + 침목 + 바닥까지 내려가는 기둥
export const Rail: React.FC<{ pts: Pt[]; ground: number; reveal?: number; dashedFrom?: number }> = ({ pts, ground, reveal = 1, dashedFrom }) => {
  const n = 160;
  const tMax = (pts.length - 1) * reveal;
  const samples = Array.from({ length: n + 1 }, (_, k) => curveAt(pts, (k / n) * (pts.length - 1)));
  const solid = dashedFrom === undefined ? pts : pts.slice(0, dashedFrom + 1);
  const dashed = dashedFrom === undefined ? null : pts.slice(dashedFrom);
  return (
    <svg width={4000} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {samples
        .filter((_, k) => k % 6 === 0)
        .filter((s) => s.x <= curveAt(pts, tMax).x)
        .map((s, k) => (
          <line key={`s${k}`} x1={s.x} y1={s.y + 16} x2={s.x} y2={ground} stroke={P.dim} strokeWidth={4} opacity={0.45} />
        ))}
      {samples
        .filter((_, k) => k % 2 === 0)
        .filter((s) => s.x <= curveAt(pts, tMax).x)
        .map((s, k) => (
          <line key={`t${k}`} x1={s.x} y1={s.y} x2={s.x} y2={s.y + 16} stroke={P.ink} strokeWidth={4} />
        ))}
      <clipPath id={`rv${pts.length}${Math.round(pts[0].x)}${Math.round(pts[0].y)}`}>
        <rect x={0} y={0} width={curveAt(pts, tMax).x + 4} height={1920} />
      </clipPath>
      <g clipPath={`url(#rv${pts.length}${Math.round(pts[0].x)}${Math.round(pts[0].y)})`}>
        <path d={curvePath(solid)} fill="none" stroke={P.rail} strokeWidth={8} strokeLinecap="round" />
        <path d={curvePath(solid, 16)} fill="none" stroke={P.rail} strokeWidth={6} strokeLinecap="round" />
        {dashed && <path d={curvePath(dashed)} fill="none" stroke={P.red} strokeWidth={7} strokeDasharray="18 16" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  const [y, m, d] = TL.asOf.split("-");
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: "#fff", background: P.ink, borderRadius: 999, padding: "8px 26px" }}>
        {`${y}.${m}.${d} 기준 · 2027학년도 수능 D-${DDAY}`}
      </span>
    </div>
  );
};
