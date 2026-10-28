// anime 엔진의 화면 효과: 집중선 · 속도선 · 임팩트 프레임 · RGB 어긋남 · 빛 번짐 · 반짝이
import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W, clamp, hit, rnd } from "../fx";

export const RED = "#E8122D";
export const GOLD = "#FFD23F";

// 집중선: 화면 가장자리에서 가운데로 모이는 가시 (2프레임마다 새로 뿌려 지글거리게)
export const FocusLines: React.FC<{ f: number; color?: string; opacity?: number; inner?: number; n?: number }> = ({ f, color = "#000", opacity = 0.85, inner = 430, n = 110 }) => {
  const seed = Math.floor(f / 2) * 1000;
  const cx = W / 2, cy = H * 0.45, R = 1500;
  const spikes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (rnd(seed + i) - 0.5) * 0.05;
    const r0 = inner + rnd(seed + i * 7) * 320;
    const w = 0.004 + rnd(seed + i * 13) * 0.012;
    const p = (ang: number, r: number) => `${cx + Math.cos(ang) * r},${cy + Math.sin(ang) * r}`;
    return `M${p(a - w, R)} L${p(a, r0)} L${p(a + w, R)} Z`;
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <path d={spikes.join(" ")} fill={color} />
    </svg>
  );
};

// 속도선: 한 방향으로 흐르는 가는 줄
export const SpeedLines: React.FC<{ f: number; color?: string; opacity?: number; vertical?: boolean }> = ({ f, color = "#fff", opacity = 0.55, vertical }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none", transform: vertical ? "rotate(90deg) scale(1.8)" : undefined }}>
    {Array.from({ length: 34 }, (_, i) => {
      const y = rnd(i * 3.1) * H;
      const len = 300 + rnd(i * 5.7) * 900;
      const x = ((rnd(i * 9.3) * (W + len) + f * (70 + rnd(i) * 60)) % (W + len * 2)) - len;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: len, height: 2 + rnd(i * 2.2) * 6, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />;
    })}
  </AbsoluteFill>
);

// 임팩트 프레임: 첫 몇 프레임을 흑백 반전 → 흑백 고대비로 (애니메이션 타격 장면의 그 번쩍임)
export const impactFilter = (f: number) => (f < 2 ? "grayscale(1) contrast(9) invert(1)" : f < 4 ? "grayscale(1) contrast(7)" : undefined);

// RGB 어긋남: 빨강 · 파랑 채널을 좌우로 벌린다. d 가 0 이면 그리지 않는다
export const RgbDefs: React.FC<{ id: string; d: number }> = ({ id, d }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
      <feOffset in="r" dx={d} dy={0} result="r2" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
      <feOffset in="b" dx={-d} dy={0} result="b2" />
      <feBlend in="r2" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b2" mode="screen" />
    </filter>
  </svg>
);

// 빛 번짐: 따뜻한 빛 덩어리가 천천히 흐른다
export const LightLeak: React.FC<{ f: number; opacity?: number; hue?: "warm" | "pink" | "cool" }> = ({ f, opacity = 0.35, hue = "warm" }) => {
  const c = hue === "pink" ? ["255,90,170", "255,190,90"] : hue === "cool" ? ["90,170,255", "180,120,255"] : ["255,150,40", "255,70,60"];
  const x = 20 + Math.sin(f / 40) * 30, y = 25 + Math.cos(f / 33) * 20;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity, pointerEvents: "none", background: `radial-gradient(circle at ${x}% ${y}%, rgba(${c[0]},0.9), transparent 45%), radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(${c[1]},0.7), transparent 40%)` }} />
  );
};

// 반짝이: 네 갈래 별이 깜빡이며 떠오른다
const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20">
    <path d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10 Z" fill={color} />
  </svg>
);
export const Sparkles: React.FC<{ f: number; n?: number; color?: string }> = ({ f, n = 16, color = "#fff" }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const life = (f + rnd(i) * 40) % 40;
      const s = Math.sin((life / 40) * Math.PI);
      return (
        <div key={i} style={{ position: "absolute", left: rnd(i * 4.4) * W - 40, top: 250 + rnd(i * 8.8) * 1200 - life * 3, transform: `scale(${s}) rotate(${life * 4}deg)`, filter: `drop-shadow(0 0 14px ${color})` }}>
          <Star size={40 + rnd(i * 2.7) * 70} color={color} />
        </div>
      );
    })}
  </AbsoluteFill>
);

// 컷 전체에 거는 흔들림 (타격 직후 크게, 점점 가라앉음)
export const shake = (f: number, amp = 40, k = 7) => {
  const d = hit(f, k);
  return { x: (rnd(f * 1.7) - 0.5) * amp * d, y: (rnd(f * 2.3 + 9) - 0.5) * amp * d };
};

// 레터박스: 위아래 검은 띠가 들어온다
export const Letterbox: React.FC<{ f: number; size?: number }> = ({ f, size = 210 }) => {
  const h = size * clamp(f / 6);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
    </>
  );
};
