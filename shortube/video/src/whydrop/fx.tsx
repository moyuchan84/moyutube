import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";

// 간밤 미국 상승 vs 코스피 하락 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고 없음).
// 한국 차트 색: 상승 빨강 · 하락 파랑. 바탕은 관제 상황실 같은 네이비 격자.
export const W2 = {
  bg: "#06141F",
  grid: "rgba(90,200,230,0.09)",
  gridBold: "rgba(90,200,230,0.2)",
  cyan: "#5AD2F0",
  amber: "#FFB547",
  text: "#EAF6FB",
  dim: "#7FA3B3",
  up: "#FF5A5F",
  down: "#4D9BFF",
  card: "rgba(8,28,42,0.86)",
  line: "rgba(90,210,240,0.3)",
};

export const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: W2.bg,
      backgroundImage: `linear-gradient(${W2.grid} 2px, transparent 2px), linear-gradient(90deg, ${W2.grid} 2px, transparent 2px), linear-gradient(${W2.gridBold} 3px, transparent 3px), linear-gradient(90deg, ${W2.gridBold} 3px, transparent 3px)`,
      backgroundSize: "36px 36px, 36px 36px, 216px 216px, 216px 216px",
    }}
  />
);

// 장면 전환: 가로 블라인드(줄무늬)가 위에서부터 차례로 열린다
export const BlindWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const N = 8;
  const p = first ? 1 : interpolate(frame, [0, 16], [0, 1], clamp);
  if (p >= 1) {
    return (
      <AbsoluteFill>
        <GridBg />
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {Array.from({ length: N }).map((_, i) => {
        const local = Math.min(1, Math.max(0, p * 1.6 - (i / N) * 0.6));
        const top = (i / N) * 100;
        const bottom = 100 - ((i + 1) / N) * 100;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${bottom}% ${(1 - local) * 100}%)` }}>
            <GridBg />
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: W2.cyan, background: "rgba(0,0,0,0.55)", border: `2px solid ${W2.line}`, borderRadius: 999, padding: "8px 26px" }}>
        2026.10.22 코스피 마감 기준 · 보도 인용 · 투자 권유 아님
      </span>
    </div>
  );
};
