import { loadFont } from "@remotion/google-fonts/BlackHanSans";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 빅아치 쇼츠 전용 화면 효과 — 다이너 민트 체크 바탕 · 도형으로 그린 버거 층 · 번이 쿵 내려앉는 전환 (사진 · 로고 없음).
// 빨강 + 노랑 조합은 상표를 떠올리게 해서 쓰지 않는다.
export const { fontFamily: display } = loadFont("normal", { weights: ["400"] });

export const P = {
  mint: "#CFEDE6",
  mint2: "#B7E2D8",
  teal: "#0E3B39",
  teal2: "#1C5B57",
  dim: "#4F7C77",
  cheddar: "#F29E38",
  cream: "#FFF6E6",
  bun: "#D9923F",
  bunDark: "#B8722A",
  patty: "#5A3420",
  cheese: "#F1E0B0",
  lettuce: "#7BC24A",
  onion: "#E9D6A0",
  pickle: "#6E9B3A",
  over: "#E0564A",
};

export const won = (n: number) => n.toLocaleString("ko-KR");

// 다이너 체크 바닥 + 가장자리 어둡게
export const CheckBg: React.FC = () => (
  <AbsoluteFill style={{ background: P.mint }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(45deg, ${P.mint2} 25%, transparent 25%, transparent 75%, ${P.mint2} 75%), linear-gradient(45deg, ${P.mint2} 25%, transparent 25%, transparent 75%, ${P.mint2} 75%)`,
        backgroundSize: "120px 120px",
        backgroundPosition: "0 0, 60px 60px",
        opacity: 0.55,
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(14,59,57,0.28) 100%)" }} />
  </AbsoluteFill>
);

// 버거 층 하나 (가로 w 기준). kind 마다 모양 · 높이가 다르다
export type LayerKind = "bunTop" | "bunBottom" | "patty" | "cheese" | "lettuce" | "onion" | "pickle" | "crispy" | "sauce";
export const LAYER_H: Record<LayerKind, number> = { bunTop: 150, bunBottom: 70, patty: 62, cheese: 16, lettuce: 26, onion: 14, pickle: 14, crispy: 22, sauce: 10 };

export const Layer: React.FC<{ kind: LayerKind; w: number; style?: React.CSSProperties }> = ({ kind, w, style }) => {
  const h = LAYER_H[kind];
  const base: React.CSSProperties = { width: w, height: h, ...style };
  if (kind === "bunTop")
    return (
      <div style={{ ...base, position: "relative", background: `linear-gradient(180deg, ${P.bun} 0%, ${P.bunDark} 100%)`, borderRadius: `${w / 2}px ${w / 2}px 22px 22px / ${h * 1.1}px ${h * 1.1}px 22px 22px`, boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.12)" }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: w * (0.16 + ((i * 37) % 68) / 100), top: h * (0.18 + ((i * 53) % 50) / 100), width: 14, height: 7, borderRadius: 7, background: i % 3 === 0 ? "#3B2A1E" : P.cream, transform: `rotate(${(i * 47) % 180}deg)` }} />
        ))}
      </div>
    );
  if (kind === "bunBottom") return <div style={{ ...base, background: `linear-gradient(180deg, ${P.bunDark} 0%, ${P.bun} 40%)`, borderRadius: "14px 14px 40px 40px" }} />;
  if (kind === "patty") return <div style={{ ...base, background: `repeating-linear-gradient(90deg, ${P.patty} 0 22px, #4A2A18 22px 30px)`, borderRadius: 30, boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.25)" }} />;
  if (kind === "cheese")
    return (
      <div style={{ ...base, position: "relative", width: w + 30, marginLeft: -15, background: P.cheese, borderRadius: 4 }}>
        <div style={{ position: "absolute", left: w * 0.2, top: h - 2, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `34px solid ${P.cheese}` }} />
        <div style={{ position: "absolute", left: w * 0.72, top: h - 2, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: `26px solid ${P.cheese}` }} />
      </div>
    );
  if (kind === "lettuce") return <div style={{ ...base, width: w + 24, marginLeft: -12, background: P.lettuce, borderRadius: "40% 40% 50% 50% / 60% 60% 100% 100%", boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)" }} />;
  if (kind === "onion") return <div style={{ ...base, background: `repeating-linear-gradient(90deg, ${P.onion} 0 50px, transparent 50px 70px)`, borderRadius: 8 }} />;
  if (kind === "pickle") return <div style={{ ...base, background: `repeating-linear-gradient(90deg, ${P.pickle} 0 80px, transparent 80px 120px)`, borderRadius: 10 }} />;
  if (kind === "crispy") return <div style={{ ...base, background: `repeating-linear-gradient(60deg, #C98A3A 0 10px, #E3B062 10px 18px, transparent 18px 24px)`, borderRadius: 12 }} />;
  return <div style={{ ...base, background: "#F2C27A", borderRadius: 8 }} />;
};

// 장면 전환: 큰 번(빵 윗면)이 위에서 쿵 내려와 화면을 덮고, 눌렸다가 위로 튀어 나가며 새 장면을 드러낸다
export const BunSlam: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const show = first ? 1 : interpolate(frame, [9, 10], [0, 1], clamp);
  const y = interpolate(frame, [0, 8, 12, 24], [-2200, 0, 0, -2300], clamp);
  const sq = interpolate(frame, [8, 10, 12], [1, 0.9, 1], clamp);
  return (
    <AbsoluteFill>
      <CheckBg />
      <AbsoluteFill style={{ opacity: show }}>{children}</AbsoluteFill>
      {!first && frame < 25 && (
        <div style={{ position: "absolute", left: -140, top: y - 200, width: 1360, height: 2300, transform: `scaleY(${sq})`, transformOrigin: "50% 100%" }}>
          <Layer kind="bunTop" w={1360} style={{ height: 2300, borderRadius: "680px 680px 60px 60px / 600px 600px 60px 60px" }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  const [y, m, d] = TL.asOf.split("-");
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: P.cream, background: P.teal, borderRadius: 999, padding: "8px 26px" }}>
        {`${y}.${m}.${d} 맥도날드 공식 영양정보 기준`}
      </span>
    </div>
  );
};
