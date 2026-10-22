import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 시황 쇼츠(dial) 전용 화면 효과 — 모두 코드로 그린다 (사진 · 로고 없음).
// 밤하늘 남청 ↔ 낮 연살구, 한국 색(상승 빨강 · 하락 파랑).

export const N = {
  night: "#0B1226",
  night2: "#16204A",
  day: "#F7E3C0",
  dayInk: "#2B2218",
  up: "#FF5A5F",
  down: "#4C8DFF",
  amber: "#FFC857",
  indigo: "#7C8CFF",
  dim: "#8D97B8",
  text: "#F4F5FA",
  line: "rgba(255,255,255,0.09)",
};

export const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${N.night} 0%, ${N.night2} 100%)` }}>
    <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(180deg, transparent 0 95px, ${N.line} 95px 96px)` }} />
    <div style={{ position: "absolute", right: -260, bottom: -260, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,227,192,0.18) 0%, transparent 68%)" }} />
  </AbsoluteFill>
);

// 장면 전환: 시계 바늘이 12시에서 돌며 새 장면을 부채꼴로 드러낸다
export const HandWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.wipe], [0, 1], clamp);
  const a = p * 360;
  const rad = (a * Math.PI) / 180;
  const mask = p >= 1 ? undefined : `conic-gradient(from 0deg at 50% 50%, #000 0deg, #000 ${a}deg, transparent ${a}deg)`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <Bg />
      {children}
      {p < 1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <line x1={540} y1={960} x2={540 + 1400 * Math.sin(rad)} y2={960 - 1400 * Math.cos(rad)} stroke={N.amber} strokeWidth={8} strokeLinecap="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: N.dayInk, background: N.day, borderRadius: 999, padding: "8px 26px" }}>
        2026.10.20 종가 · 21일은 개장 시점 · 투자 권유 아님
      </span>
    </div>
  );
};

export const Txt: React.FC<{ top: number; size?: number; weight?: number; color?: string; at?: number; align?: "center" | "left"; children: React.ReactNode }> = ({
  top, size = 46, weight = 700, color = N.text, at = 0, align = "center", children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.3, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};

// 쾅 찍히는 도장
export const Stamp: React.FC<{ at: number; color?: string; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, color = N.amber, rotate = -6, style, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 5, 9], [2.2, 0.94, 1], clamp);
  const o = interpolate(t, [0, 3], [0, 0.95], clamp);
  return (
    <div style={{ position: "absolute", fontFamily, fontWeight: 900, color, border: `7px solid ${color}`, borderRadius: 18, padding: "6px 26px", transform: `rotate(${rotate}deg) scale(${s})`, opacity: o, textAlign: "center", background: "rgba(11,18,38,0.55)", ...style }}>
      {children}
    </div>
  );
};

export const fmtPct = (v: number, d = 2) => `${v > 0 ? "+" : v < 0 ? "-" : ""}${Math.abs(v).toFixed(d)}%`;
export const colorOf = (v: number) => (v >= 0 ? N.up : N.down);
