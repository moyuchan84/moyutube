import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 서울 주택 공급 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고·캡처 없음).
// 한국 색: 상승 빨강, 하락 파랑. 배경은 황혼(남보라) → 마지막 장에서 새벽(핑크 주황)으로 바뀐다.

export const S = {
  night: "#0E0B24",
  dusk1: "#1B1440",
  dusk2: "#3A2465",
  dusk3: "#B8536B",
  dawn1: "#4B3B7A",
  dawn2: "#E27D8A",
  dawn3: "#FFD9A0",
  win: "#FFB547",
  warm: "#FFF3E0",
  dim: "#A79BC4",
  orange: "#FF9F43",
  up: "#FF5A4F",
  down: "#4C8DFF",
};

export const GROUND = 1250;

// 결정적 난수 (렌더마다 같은 모양)
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const mixc = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

// 하늘: dawn 0=황혼 1=새벽
export const Sky: React.FC<{ dawn?: number }> = ({ dawn = 0 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${mixc(S.dusk1, S.dawn1, dawn)} 0%, ${mixc(S.dusk2, S.dawn2, dawn)} 55%, ${mixc(S.dusk3, S.dawn3, dawn)} 82%, ${mixc(S.night, S.dawn2, dawn * 0.6)} 100%)`,
    }}
  >
    {Array.from({ length: 36 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: rnd(i) * 1080,
          top: 220 + rnd(i + 50) * 620,
          width: 4,
          height: 4,
          borderRadius: 4,
          background: "#fff",
          opacity: (0.25 + rnd(i + 9) * 0.5) * (1 - dawn),
        }}
      />
    ))}
  </AbsoluteFill>
);

// 건물 몇 동: 막대 + 창문. lit(i, col, row) → 창이 켜졌는지(0~1)
export type Bld = { x: number; w: number; h: number };
export const makeCity = (seed: number, x0: number, x1: number, minH: number, maxH: number, minW = 70, maxW = 130): Bld[] => {
  const out: Bld[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = minW + rnd(seed + i * 3) * (maxW - minW);
    out.push({ x, w, h: minH + rnd(seed + i * 3 + 1) * (maxH - minH) });
    x += w + 6;
    i++;
  }
  return out;
};

export const City: React.FC<{
  b: Bld[];
  color: string;
  ground?: number;
  win?: (bi: number, c: number, r: number) => number;
  heightScale?: number;
  outline?: boolean;
}> = ({ b, color, ground = GROUND, win, heightScale = 1, outline }) => (
  <>
    {b.map((bd, bi) => {
      const h = bd.h * heightScale;
      const cols = Math.max(1, Math.floor((bd.w - 14) / 22));
      const rows = Math.max(0, Math.floor((h - 20) / 30));
      return (
        <div
          key={bi}
          style={{
            position: "absolute",
            left: bd.x,
            top: ground - h,
            width: bd.w,
            height: h,
            background: outline ? "transparent" : color,
            border: outline ? "3px dashed rgba(255,243,224,0.55)" : "none",
            boxSizing: "border-box",
          }}
        >
          {win &&
            !outline &&
            Array.from({ length: cols * rows }).map((_, k) => {
              const c = k % cols;
              const r = Math.floor(k / cols);
              const v = win(bi, c, r);
              if (v <= 0) return null;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: 9 + c * ((bd.w - 14) / cols),
                    top: 12 + r * 30,
                    width: 13,
                    height: 17,
                    background: S.win,
                    opacity: v * 0.9,
                    boxShadow: v > 0.6 ? `0 0 10px ${S.win}` : "none",
                  }}
                />
              );
            })}
        </div>
      );
    })}
  </>
);

// 타워크레인
export const Crane: React.FC<{ x: number; h?: number; ground?: number; swing?: number; color?: string }> = ({ x, h = 360, ground = GROUND, swing = 0, color = "#FF9F43" }) => (
  <svg style={{ position: "absolute", left: x - 120, top: ground - h, overflow: "visible" }} width={300} height={h} viewBox={`0 0 300 ${h}`}>
    <rect x={112} y={30} width={10} height={h - 30} fill={color} />
    <g transform={`rotate(${swing} 117 30)`}>
      <rect x={0} y={20} width={270} height={10} fill={color} />
      <rect x={96} y={4} width={42} height={18} fill={color} />
      <line x1={117} y1={4} x2={20} y2={20} stroke={color} strokeWidth={3} />
      <line x1={117} y1={4} x2={250} y2={20} stroke={color} strokeWidth={3} />
      <line x1={230} y1={30} x2={230} y2={100} stroke={color} strokeWidth={3} />
      <rect x={216} y={100} width={28} height={20} fill={color} />
    </g>
    {Array.from({ length: Math.floor((h - 30) / 30) }).map((_, i) => (
      <line key={i} x1={112} y1={40 + i * 30} x2={122} y2={70 + i * 30} stroke={color} strokeWidth={2} />
    ))}
  </svg>
);

// 장면 전환: 건물 기둥이 아래에서 솟으며 새 장면을 드러낸다 (clip-path)
const COLS = 10;
export const RiseReveal: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  if (first) return <AbsoluteFill>{children}</AbsoluteFill>;
  const pts: string[] = ["0px 1920px"];
  const cw = 1080 / COLS;
  for (let i = 0; i < COLS; i++) {
    const delay = rnd(i + 70) * (TL.slide * 0.45);
    const p = interpolate(frame, [delay, delay + TL.slide * 0.55], [0, 1], clamp);
    const e = 1 - Math.pow(1 - p, 3);
    const y = 1920 - 1920 * e;
    pts.push(`${i * cw}px ${y}px`, `${(i + 1) * cw}px ${y}px`);
  }
  pts.push("1080px 1920px");
  return <AbsoluteFill style={{ clipPath: `polygon(${pts.join(",")})` }}>{children}</AbsoluteFill>;
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: S.warm, background: "rgba(14,11,36,0.75)", border: `2px solid ${S.orange}`, borderRadius: 999, padding: "8px 26px" }}>
        서울 주택 공급 · 국토부·한국부동산원 보도 기준
      </span>
    </div>
  );
};

// 본문 글자 (얇은 고딕 + 큰 주황 숫자 조합에 쓰는 기본 텍스트)
export const T: React.FC<{
  top: number;
  size?: number;
  weight?: number;
  color?: string;
  at?: number;
  left?: number;
  right?: number;
  align?: "center" | "left" | "right";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ top, size = 44, weight = 500, color = S.warm, at = 0, left = 70, right = 70, align = "center", children, style }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        textAlign: align,
        fontFamily,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.25,
        opacity: o,
        transform: `translateY(${(1 - o) * 18}px)`,
        textShadow: "0 3px 16px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
