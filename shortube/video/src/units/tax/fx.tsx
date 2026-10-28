import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import TL from "../../../../content/tax/script/timeline.json";

// 취득세 숫자 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진 · 로고 · 지도 없음).
// 영수증 컨셉: 크라프트 종이 + 먹색 잉크 + 도장. 1주택 = 청록, 조정대상지역 2주택 = 주황, 3주택 이상 = 자주.

export const T = {
  paper: "#EFE6D2",
  paper2: "#E4D7BB",
  ink: "#2A2420",
  dim: "#7A6F63",
  one: "#1F7A6D",
  two: "#D9822B",
  three: "#B3304A",
  stamp: "#C8372D",
  line: "rgba(42,36,32,0.13)",
  card: "rgba(255,251,240,0.9)",
};

// 금액(만 원) → "1억 4,400만" 식 표기
export const fmt = (v: number) => {
  const eok = Math.floor(v / 10000);
  const rest = v % 10000;
  if (eok === 0) return `${v.toLocaleString("ko-KR")}만`;
  return rest ? `${eok}억 ${rest.toLocaleString("ko-KR")}만` : `${eok}억`;
};

// 영수증 종이: 가는 줄 + 좌우 천공
export const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: T.paper }}>
    <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(180deg, transparent 0 47px, ${T.line} 47px 48px)` }} />
    {[0, 1040].map((x) => (
      <div key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 40, backgroundImage: `radial-gradient(circle at 50% 50%, ${T.paper2} 8px, transparent 9px)`, backgroundSize: "40px 44px" }} />
    ))}
  </AbsoluteFill>
);

// 장면 전환: 새 영수증 종이가 아래에서 올라오며 톱니 모양 절취선이 위로 쓸고 간다
export const TearWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.wipe], [0, 1], clamp);
  const y = (1 - p) * 2000;
  const pts = ["0px 2100px"];
  for (let i = 0; i <= 18; i++) pts.push(`${i * 60}px ${y + (i % 2 ? 18 : 0)}px`);
  pts.push("1080px 2100px");
  return (
    <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `polygon(${pts.join(",")})` }}>
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
      <span style={{ fontSize: 28, fontWeight: 700, color: T.paper, background: "rgba(42,36,32,0.88)", borderRadius: 999, padding: "8px 26px" }}>
        주택 취득세 · 2026.10.20 법령 기준 · 자체 계산
      </span>
    </div>
  );
};

export const Txt: React.FC<{ top: number; size?: number; weight?: number; color?: string; at?: number; align?: "center" | "left"; children: React.ReactNode }> = ({
  top, size = 46, weight = 700, color = T.ink, at = 0, align = "center", children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 80, right: 80, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.3, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};

// 종이에 찍히는 잉크 도장
export const InkStamp: React.FC<{ at: number; color?: string; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, color = T.stamp, rotate = -6, style, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 5, 9], [2.2, 0.94, 1], clamp);
  const o = interpolate(t, [0, 3], [0, 0.92], clamp);
  return (
    <div style={{ position: "absolute", fontFamily, fontWeight: 900, color, border: `8px solid ${color}`, borderRadius: 20, padding: "8px 30px", transform: `rotate(${rotate}deg) scale(${s})`, opacity: o, textAlign: "center", background: "rgba(239,230,210,0.35)", ...style }}>
      {children}
    </div>
  );
};
