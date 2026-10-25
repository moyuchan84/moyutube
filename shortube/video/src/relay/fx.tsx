import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, M } from "../market/effects";
import { fontFamily } from "../theme";
import F from "./facts.json";

// 시차 릴레이 쇼츠 전용 화면 효과 — 시계 · 타임라인 모두 코드로 그린다 (사진 · 로고 없음).
// 색: 새벽 숯색 + 주황 시곗바늘 + 한국 차트 관례(상승 빨강 · 하락 파랑)
export const R = {
  bg: "#15130F",
  bg2: "#241F18",
  paper: "#F3EDE2",
  orange: "#FF8A3D",
  dim: "#A89F91",
  line: "rgba(255,138,61,0.38)",
  card: "rgba(24,21,16,0.88)",
  up: M.up,
  down: M.down,
};

export const signColor = (v: number) => (v > 0 ? R.up : v < 0 ? R.down : R.paper);
export const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

export const DawnBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 110%, #3A2617 0%, ${R.bg2} 35%, ${R.bg} 75%)` }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(rgba(243,237,226,0.07) 1.5px, transparent 1.5px)",
        backgroundSize: "36px 36px",
      }}
    />
  </AbsoluteFill>
);

// 장면 전환: 시곗바늘이 한 바퀴 돌며 화면을 연다(원뿔 마스크) + 장면 내내 천천히 위로 팬
export const ClockWipe: React.FC<{ children: React.ReactNode; first?: boolean; dur: number }> = ({ children, first, dur }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 16], [0, 1], clamp);
  const deg = (1 - Math.pow(1 - p, 2)) * 360;
  const mask = p >= 1 ? undefined : `conic-gradient(from 0deg at 50% 45%, #000 ${deg}deg, transparent ${deg + 0.5}deg)`;
  const pan = interpolate(frame, [0, dur], [26, 0], clamp);
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <DawnBg />
      <AbsoluteFill style={{ transform: `translateY(${pan}px)` }}>{children}</AbsoluteFill>
      {p < 1 && (
        <div
          style={{
            position: "absolute",
            left: 540 - 3,
            top: 0,
            width: 6,
            height: 1920 * 0.45,
            background: R.orange,
            transformOrigin: "50% 100%",
            transform: `rotate(${deg}deg)`,
            boxShadow: `0 0 24px ${R.orange}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// 아날로그 시계: h:m 을 가리킨다. spin 은 바늘이 그 시각까지 감기는 정도(0~1)
export const Clock: React.FC<{ h: number; m: number; size: number; spin?: number; night?: boolean }> = ({ h, m, size, spin = 1, night }) => {
  const mm = (h * 60 + m) * spin;
  const hourDeg = (mm / 720) * 360;
  const minDeg = (mm % 60) * 6 + Math.floor(mm / 60) * 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill={night ? "#1D2433" : "#2B241B"} stroke={R.orange} strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="50" y1="9" x2="50" y2={i % 3 === 0 ? 17 : 13} stroke={R.paper} strokeWidth={i % 3 === 0 ? 3 : 1.5} transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <line x1="50" y1="50" x2="50" y2="28" stroke={R.paper} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="16" stroke={R.orange} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minDeg} 50 50)`} />
      <circle cx="50" cy="50" r="4" fill={R.orange} />
    </svg>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 27, fontWeight: 700, color: R.orange, background: "rgba(0,0,0,0.5)", border: `2px solid ${R.line}`, borderRadius: 999, padding: "8px 24px" }}>
        한국 {F.asOf} 마감 · 미국 10.22(현지) 종가 기준 · 투자 권유 아님
      </span>
    </div>
  );
};
