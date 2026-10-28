import { loadFont } from "@remotion/google-fonts/GowunBatang";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import TL from "../../../../content/foliage/script/timeline.json";

// 단풍 쇼츠 전용 화면 효과 — 크림 한지 바탕 · 단풍잎 · 산 실루엣 · 낙엽 전환을 모두 코드로 그린다 (사진 · 지도 이미지 없음).
export const { fontFamily: serif } = loadFont("normal", { weights: ["400", "700"] });

export const P = {
  paper: "#F6EFE1",
  paper2: "#EFE3CC",
  ink: "#3B2A1E",
  dim: "#8A7560",
  green: "#5B8C3A",
  yellow: "#E3B53A",
  orange: "#DD7A2A",
  red: "#B8282E",
  card: "#FFFBF2",
  warm: "#E2572B",
};

// 물든 정도(0 = 초록, 1 = 진홍)를 색으로
const STOPS = [P.green, P.yellow, P.orange, P.red];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const leafColor = (p: number) => {
  const q = Math.min(1, Math.max(0, p)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(q));
  const u = q - i;
  const a = hex(STOPS[i]), b = hex(STOPS[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * u)).join(",")})`;
};
// 기상청 상태값: 1 단풍 전 · 2 첫 단풍(물드는 중) · 3 절정
export const statusColor = (s: number) => (s === 3 ? P.red : s === 2 ? P.orange : P.green);

// "10-21" → 10월 1일부터 센 날 수
export const dayOf = (md: string) => {
  const [m, d] = md.split("-").map(Number);
  return m === 9 ? d - 30 : m === 10 ? d : 31 + d;
};

// 단풍잎 (가운데가 0,0 · 지름 약 100 기준)
const R: [number, number][] = [[0, -48], [9, -27], [22, -35], [17, -13], [38, -22], [31, -6], [47, -2], [29, 9], [33, 20], [12, 15], [3, 30]];
const LEAF = [...R, [3, 48], [-3, 48], ...R.slice(1).reverse().map(([x, y]) => [-x, y] as [number, number])]
  .map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`)
  .join(" ") + " Z";
export const Leaf: React.FC<{ size: number; color: string; style?: React.CSSProperties; rotate?: number }> = ({ size, color, style, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="-52 -52 104 104" style={{ overflow: "visible", transform: `rotate(${rotate}deg)`, ...style }}>
    <path d={LEAF} fill={color} stroke="rgba(59,42,30,0.35)" strokeWidth={2} strokeLinejoin="round" />
    <path d="M 0 44 L 0 -36 M 0 4 L 26 -14 M 0 4 L -26 -14 M 0 18 L 22 12 M 0 18 L -22 12" stroke="rgba(255,240,220,0.55)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </svg>
);

// 한지 바탕: 크림 그라데이션 + 섬유 노이즈
export const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.paper} 0%, ${P.paper2} 100%)` }}>
    <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.22 }}>
      <filter id="fiber">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves={3} seed={7} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 0.55 0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#fiber)" />
    </svg>
  </AbsoluteFill>
);

// 천천히 떨어지는 배경 낙엽 몇 장
export const Drift: React.FC<{ n?: number; seed?: string; opacity?: number }> = ({ n = 7, seed = "d", opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const sp = 1.2 + random(`${seed}s${i}`) * 1.4;
        const y = ((random(`${seed}y${i}`) * 2200 + frame * sp) % 2200) - 150;
        const x = random(`${seed}x${i}`) * 1000 + Math.sin(frame / 22 + i) * 40;
        return <Leaf key={i} size={44 + random(`${seed}z${i}`) * 30} color={leafColor(0.35 + random(`${seed}c${i}`) * 0.65)} rotate={frame * (2 + i) + i * 50} style={{ position: "absolute", left: x, top: y, opacity }} />;
      })}
    </AbsoluteFill>
  );
};

// 장면 전환: 낙엽 무리가 위에서 쏟아지며 지나가는 동안 새 장면이 드러난다
export const LeafFall: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const show = first ? 1 : interpolate(frame, [6, 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ opacity: show }}>{children}</AbsoluteFill>
      {!first && frame < 26 &&
        Array.from({ length: 46 }).map((_, i) => {
          const d = random(`fd${i}`) * 6;
          const t = (frame - d) / 20;
          if (t < 0 || t > 1) return null;
          const x = random(`fx${i}`) * 1140 - 30 + Math.sin(t * 6 + i) * 50;
          const y = -200 + t * 2300 + random(`fy${i}`) * 300;
          return <Leaf key={i} size={90 + random(`fs${i}`) * 90} color={leafColor(0.3 + random(`fc${i}`) * 0.7)} rotate={t * 360 * (i % 2 ? 1 : -1) + i * 40} style={{ position: "absolute", left: x, top: y }} />;
        })}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  const [y, m, d] = TL.asOf.split("-");
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: P.paper, background: P.ink, borderRadius: 999, padding: "8px 26px" }}>
        {`${y}.${m}.${d} 기준 · 기상청 단풍 관측`}
      </span>
    </div>
  );
};
