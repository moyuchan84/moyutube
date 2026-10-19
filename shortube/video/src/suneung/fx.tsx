import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Gaegu";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 수능 D-34 쇼츠 공통 연출: 칠판 + 분필 글씨 + OMR 답안지 + 시험지 넘기기 (모두 코드로 그린 도형)
// 실제 OMR 양식 · 평가원 상징은 복제하지 않는다 (브리프 2026-10-16_slot3 연출 카드).
export const { fontFamily: chalkFont } = loadFont("normal", { weights: ["400", "700"] });

export const S = {
  board: "#1E3A2D",
  boardDark: "#132519",
  chalk: "#F2F1E8",
  chalkDim: "rgba(242,241,232,0.62)",
  paper: "#FFF8EA",
  omr: "#E2553E",
  omrSoft: "rgba(226,85,62,0.35)",
  ink: "#16181F",
  up: "#E2553E",
  down: "#3D7BE2",
  yellow: "#FFD452",
  pink: "#FF8FA3",
};

// 시험일까지 남은 날 (asOf 를 업로드 날짜로 맞춰 렌더한다)
export const DDAY = Math.round((Date.parse(TL.exam) - Date.parse(TL.asOf)) / 86400000);

// 분필 글씨: 손글씨 글꼴 + 번진 가루 그림자
export const chalk = (size: number, color = S.chalk): React.CSSProperties => ({
  fontFamily: chalkFont,
  fontWeight: 700,
  fontSize: size,
  color,
  textShadow: `0 0 2px ${color}, 0 0 10px rgba(255,255,255,0.18)`,
  letterSpacing: "0.01em",
});

// 칠판 배경: 초록 그라디언트 + 분필 가루 얼룩(노이즈) + 아래 분필 받침
export const Chalkboard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${S.board} 0%, ${S.boardDark} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
        <filter id="dust">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={3} seed={7} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.12" />
        </filter>
        <rect width={1080} height={1920} filter="url(#dust)" />
      </svg>
      {/* 지우개 자국: 아주 천천히 흐르는 옅은 띠 */}
      {[260, 900, 1380].map((y, i) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: -200 + ((frame * (0.2 + i * 0.1)) % 60),
            top: y,
            width: 1500,
            height: 120,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)",
            transform: `rotate(${-3 + i * 2}deg)`,
          }}
        />
      ))}
      {/* 나무 테두리 */}
      <div style={{ position: "absolute", inset: 0, border: "18px solid #6B4A2E", boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)" }} />
    </AbsoluteFill>
  );
};

// 분필로 써 내려가는 효과: 왼쪽부터 드러남
export const Write: React.FC<{ at: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dur = 14, style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 100], clamp);
  return <div style={{ position: "absolute", clipPath: `inset(-20% ${100 - p}% -20% -5%)`, ...style }}>{children}</div>;
};

// 시험지 한 장 (크림색 종이 + 왼쪽 빨간 여백선)
export const Sheet: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; grid?: boolean }> = ({ style, children, grid }) => (
  <div
    style={{
      position: "absolute",
      background: S.paper,
      borderRadius: 10,
      boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
      overflow: "hidden",
      backgroundImage: grid
        ? "linear-gradient(rgba(61,123,226,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(61,123,226,0.13) 1px, transparent 1px)"
        : undefined,
      backgroundSize: grid ? "36px 36px" : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// 장면 전환: 시험지 넘기듯 위쪽을 축으로 넘어오고, 나갈 때 위로 넘겨진다
export const Flip: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [1, 0], clamp);
  const exit = interpolate(frame, [dur - 10, dur], [0, 1], clamp);
  const rot = enter * -75 + exit * 80;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ transformOrigin: "50% 8%", transform: `rotateX(${rot}deg)`, opacity: 1 - Math.max(enter, exit) * 0.9 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 벽시계: 초침이 1초에 한 칸
export const Clock: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const frame = useCurrentFrame();
  const sec = Math.floor(frame / 30);
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", ...style }}>
      <circle cx={r} cy={r} r={r - 6} fill={S.paper} stroke="#2B2B2B" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={r + Math.sin(a) * (r - 22)} y1={r - Math.cos(a) * (r - 22)} x2={r + Math.sin(a) * (r - 40)} y2={r - Math.cos(a) * (r - 40)} stroke={S.ink} strokeWidth={i % 3 === 0 ? 8 : 4} />;
      })}
      <line x1={r} y1={r} x2={r} y2={r - r * 0.45} stroke={S.ink} strokeWidth={10} strokeLinecap="round" transform={`rotate(-40 ${r} ${r})`} />
      <line x1={r} y1={r} x2={r} y2={r - r * 0.68} stroke={S.ink} strokeWidth={7} strokeLinecap="round" transform={`rotate(${sec * 0.1} ${r} ${r})`} />
      <line x1={r} y1={r + 20} x2={r} y2={r - r * 0.78} stroke={S.omr} strokeWidth={4} transform={`rotate(${sec * 6} ${r} ${r})`} />
      <circle cx={r} cy={r} r={10} fill={S.omr} />
    </svg>
  );
};

// 작은 꼬리표 (출처 · 보도 기준)
export const Tag: React.FC<{ children: React.ReactNode; top: number; at?: number }> = ({ children, top, at = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: S.chalkDim, opacity: o }}>{children}</div>;
};
