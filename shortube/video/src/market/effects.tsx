import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 시황 영상 공통 색: 한국 차트 관례 — 상승 빨강, 하락 파랑
export const M = {
  up: "#FF4D5E",
  down: "#3D8BFF",
  downGlow: "rgba(61,139,255,0.55)",
  support: "rgba(52,211,153,0.22)",
  supportLine: "#34D399",
  resist: "rgba(255,77,94,0.18)",
  resistLine: "#FF4D5E",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 가장 최근 hit 이후 몇 프레임 지났나 (전역 프레임 기준)
const sinceHit = (frame: number) => {
  let best = Infinity;
  for (const h of TL.hits) if (frame >= h) best = Math.min(best, frame - h);
  return best;
};

// 타격 순간마다 화면 흔들림 (감쇠 진동)
export const useShake = () => {
  const frame = useCurrentFrame();
  const t = sinceHit(frame);
  if (t > 14) return { x: 0, y: 0, rot: 0 };
  const a = (14 - t) * 1.6;
  return { x: Math.sin(t * 2.7) * a, y: Math.cos(t * 3.1) * a * 0.7, rot: Math.sin(t * 1.9) * a * 0.03 };
};

// 타격 순간 파란 섬광 + 비네트
export const HitFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sinceHit(frame);
  const o = interpolate(t, [0, 10], [0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: M.downGlow, opacity: o, mixBlendMode: "screen" }} />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)", opacity: 0.8 + o * 0.4 }}
      />
    </AbsoluteFill>
  );
};

// 모니터 주사선 + 가끔 지직거리는 글리치 띠
export const Scanlines: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sinceHit(frame);
  const glitch = t < 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 2px, transparent 4px)",
        }}
      />
      {glitch &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: ((frame * 137 + i * 541) % 1700) + 100,
              height: 18 + i * 14,
              background: i % 2 ? "rgba(61,139,255,0.35)" : "rgba(255,255,255,0.12)",
              transform: `translateX(${(i - 1) * 40}px)`,
            }}
          />
        ))}
    </AbsoluteFill>
  );
};

// 상단 시세 전광판 (계속 흐름)
const TICKS = [
  { n: "KOSPI", v: "5,554.22", p: "-7.57%" },
  { n: "삼성전자", v: "210,000", p: "-9.48%" },
  { n: "SK하이닉스", v: "1,262,000", p: "-11.06%" },
  { n: "KOSPI 4일", v: "6,625 → 5,554", p: "-16.2%" },
  { n: "서킷브레이커", v: "발동", p: "10.15" },
];
export const Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const item = (k: number) =>
    TICKS.map((t, i) => (
      <span key={`${k}-${i}`} style={{ marginRight: 70, whiteSpace: "nowrap" }}>
        <span style={{ color: "#C9CEE0" }}>{t.n}</span> <span style={{ color: "#fff" }}>{t.v}</span>{" "}
        <span style={{ color: M.down }}>▼ {t.p}</span>
      </span>
    ));
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        height: 76,
        background: "rgba(5,8,18,0.85)",
        borderTop: `2px solid ${M.down}`,
        borderBottom: `2px solid ${M.down}`,
        overflow: "hidden",
        fontFamily,
        fontWeight: 700,
        fontSize: 36,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", transform: `translateX(${-((frame * 5) % 1900)}px)` }}>
        {item(0)}
        {item(1)}
        {item(2)}
      </div>
    </div>
  );
};

// 숫자가 굴러가며 바뀌는 카운터
export const Counter: React.FC<{ from: number; to: number; start: number; dur: number; digits?: number; style?: React.CSSProperties }> = ({
  from,
  to,
  start,
  dur,
  digits = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - p, 3);
  const v = from + (to - from) * eased;
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{v.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}</span>;
};

// 쾅 찍히는 도장
export const Stamp: React.FC<{ at: number; children: React.ReactNode; color?: string; rotate?: number; style?: React.CSSProperties }> = ({
  at,
  children,
  color = M.down,
  rotate = -8,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 5, 9], [2.6, 0.92, 1], clamp);
  const o = interpolate(t, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily,
        fontWeight: 900,
        color,
        border: `10px solid ${color}`,
        borderRadius: 24,
        padding: "14px 40px",
        transform: `rotate(${rotate}deg) scale(${s})`,
        opacity: o,
        boxShadow: `0 0 60px ${color}66, inset 0 0 30px ${color}44`,
        background: "rgba(5,8,18,0.6)",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
