import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 프랑스 시위 숫자 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진 · 로고 · 깃발 · 시위 장면 없음).
// 정부(내무부) 집계 = 시안, 노조 · 주최 측 추산 = 앰버. 두 집계를 같은 비중으로 나란히 둔다.

export const F = {
  bg: "#17191D",
  chalk: "#EDEDE6",
  dim: "#8E918F",
  gov: "#38D6E0",
  union: "#FFB02E",
  line: "rgba(237,237,230,0.14)",
  card: "rgba(30,33,38,0.9)",
};

// 아스팔트 바탕: 흰 분필 차선 + 희미한 입자
export const AsphaltBg: React.FC = () => (
  <AbsoluteFill style={{ background: F.bg }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)`,
        backgroundSize: "26px 26px",
      }}
    />
    {[190, 540, 890].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 6, backgroundImage: `repeating-linear-gradient(180deg, ${F.line} 0 70px, transparent 70px 140px)` }} />
    ))}
  </AbsoluteFill>
);

// 장면 전환: 가운데에서 원이 커지며 새 장면을 드러낸다 (아이리스)
export const IrisWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.wipe], [0, 1], clamp);
  const r = p * 1500;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 52%)` }}>
      <AsphaltBg />
      {children}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: F.chalk, background: "rgba(0,0,0,0.6)", border: `2px solid ${F.dim}`, borderRadius: 999, padding: "8px 26px" }}>
        프랑스 시위 · 2026.10.19 보도 기준 · 자체 정리
      </span>
    </div>
  );
};

export const Txt: React.FC<{ top: number; size?: number; weight?: number; color?: string; at?: number; align?: "center" | "left"; children: React.ReactNode }> = ({
  top, size = 46, weight = 700, color = F.chalk, at = 0, align = "center", children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.3, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};
