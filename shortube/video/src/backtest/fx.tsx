import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// RSI · 골든크로스 · 볼린저 백테스트 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고 없음).
// 한국 차트 색: 수익(상승) 빨강, 손실(하락) 파랑.

export const P = {
  paper: "#F6F0DC",
  ink: "#1B1A17",
  dim: "#6E6A5C",
  grid: "rgba(50,80,120,0.16)",
  up: "#E0342F",
  down: "#1F5FD1",
  hl: "#FFE45C",
  card: "rgba(255,252,238,0.9)",
};

// 방안지 바탕: 5mm 칸 + 굵은 선
export const PaperBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: P.paper,
      backgroundImage: `linear-gradient(${P.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${P.grid} 1.5px, transparent 1.5px), linear-gradient(rgba(50,80,120,0.28) 3px, transparent 3px), linear-gradient(90deg, rgba(50,80,120,0.28) 3px, transparent 3px)`,
      backgroundSize: "36px 36px, 36px 36px, 180px 180px, 180px 180px",
    }}
  />
);

// 장면 전환: 새 장이 오른쪽에서 밀려 들어와 이전 장을 덮는다 (이전 장은 아래에 겹쳐 남아 있다)
export const PageSlide: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.slide], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - e) * 1080}px)`, boxShadow: p < 1 ? "-30px 0 60px rgba(0,0,0,0.25)" : "none" }}>
      <PaperBg />
      {children}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: P.paper, background: P.ink, borderRadius: 999, padding: "8px 26px" }}>
        코스피 2016.10~2026.10.15 종가 · 자체 계산
      </span>
    </div>
  );
};

// 형광펜 글자
export const Hl: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: `linear-gradient(transparent 55%, ${P.hl} 55%)`, padding: "0 6px" }}>{children}</span>
);

// 도장
export const PStamp: React.FC<{ at: number; children: React.ReactNode; color?: string; rotate?: number; style?: React.CSSProperties }> = ({ at, children, color = P.up, rotate = -6, style }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 5, 9], [2.4, 0.93, 1], clamp);
  const o = interpolate(t, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily,
        fontWeight: 900,
        color,
        border: `9px solid ${color}`,
        borderRadius: 20,
        padding: "10px 34px",
        transform: `rotate(${rotate}deg) scale(${s})`,
        opacity: o,
        background: "rgba(246,240,220,0.85)",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
