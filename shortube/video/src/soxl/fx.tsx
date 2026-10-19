import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 3배 레버리지 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고 없음).
// 한국 차트 색: 상승 빨강 · 하락 파랑. 바탕은 반도체 다이(칩 도면) 격자.

export const Q = {
  bg: "#101216",
  die: "rgba(217,130,43,0.10)",
  dieBold: "rgba(217,130,43,0.22)",
  cu: "#E08A2E",
  cuLight: "#FFC27A",
  text: "#F2EEE6",
  dim: "#8C8678",
  up: "#FF5A52",
  down: "#4D8DFF",
  card: "rgba(24,26,32,0.88)",
};

export const DieBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: Q.bg,
      backgroundImage: `linear-gradient(${Q.die} 2px, transparent 2px), linear-gradient(90deg, ${Q.die} 2px, transparent 2px), linear-gradient(${Q.dieBold} 4px, transparent 4px), linear-gradient(90deg, ${Q.dieBold} 4px, transparent 4px)`,
      backgroundSize: "30px 30px, 30px 30px, 240px 240px, 240px 240px",
    }}
  />
);

// 장면 전환: 구리색 선이 위에서 아래로 훑으며 새 장면을 드러낸다 (이전 장면이 아래에 남아 있다)
export const ScanWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.wipe], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>
      <DieBg />
      {children}
      {p < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: `${p * 100}%`, height: 10, background: Q.cuLight, boxShadow: `0 0 40px 10px ${Q.cu}` }} />}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: Q.cuLight, background: "rgba(0,0,0,0.6)", border: `2px solid ${Q.cu}`, borderRadius: 999, padding: "8px 26px" }}>
        미국장 종가 · SOX · SOXL · 자체 계산
      </span>
    </div>
  );
};

export const Txt: React.FC<{ top: number; size?: number; weight?: number; color?: string; at?: number; align?: "center" | "left"; children: React.ReactNode }> = ({
  top, size = 46, weight = 700, color = Q.text, at = 0, align = "center", children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.25, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};
