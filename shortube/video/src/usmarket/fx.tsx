import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import TL from "./timeline.json";

// 간밤 미국장 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고 없음).
// 한국 차트 색: 상승 빨강, 하락 파랑.

export const US = {
  down: "#4DA3FF",
  downDeep: "#1F6FD1",
  up: "#FF4D5E",
  amber: "#FFB84D",
  ice: "#D6ECFF",
  dim: "#7FA0B8",
  card: "rgba(8,28,40,0.78)",
  line: "rgba(160,210,240,0.22)",
};

// 심해 배경: 위는 청록, 아래로 갈수록 검정. 영상이 진행될수록 천천히 가라앉는다
export const Deep: React.FC = () => {
  const frame = useCurrentFrame();
  const depth = interpolate(frame, [0, TL.total], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, hsl(${196 - depth * 14} 62% ${16 - depth * 8}%) 0%, #031018 55%, #010509 100%)` }}>
      {Array.from({ length: 22 }).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const speed = 0.5 + random(`bs${i}`) * 1.2;
        const size = 6 + random(`bz${i}`) * 14;
        const y = ((2100 - frame * speed * 2.2 + random(`by${i}`) * 2100) % 2100) - 90;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", border: "2px solid rgba(190,230,255,0.22)" }} />;
      })}
    </AbsoluteFill>
  );
};

// 왼쪽 수심자: 눈금이 위로 흘러가 계속 내려가는 느낌
export const DepthRuler: React.FC = () => {
  const frame = useCurrentFrame();
  const off = (frame * 2.4) % 120;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 46, overflow: "hidden", opacity: 0.7 }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const long = i % 2 === 0;
        return <div key={i} style={{ position: "absolute", left: 0, top: i * 120 - off, width: long ? 34 : 18, height: 3, background: US.dim }} />;
      })}
    </div>
  );
};

// 장면 전환: 위에서 아래로 쓸어내린다
export const DropWipe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - eased) * 100}% 0)` }}>
      {children}
      {p < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: `${eased * 100}%`, height: 6, background: US.ice, boxShadow: `0 0 30px ${US.down}` }} />}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: US.ice, background: "rgba(0,0,0,0.45)", borderRadius: 999, padding: "8px 26px" }}>
        2026.10.16 미국 현지 종가 기준 · 보도 인용
      </span>
    </div>
  );
};
