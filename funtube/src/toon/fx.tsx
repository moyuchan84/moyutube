import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { blackHan } from "../components/common";

// 프레임 번호만으로 정해지는 의사 난수 (렌더마다 같은 결과)
export const rand = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// 집중선 — 중심에서 퍼지는 흰 선. 2프레임마다 모양이 바뀐다.
export const SpeedLines: React.FC<{ frame: number; cx?: number; cy?: number; color?: string; count?: number }> = ({
  frame, cx = 540, cy = 820, color = "rgba(255,255,255,0.92)", count = 44,
}) => {
  const seed = Math.floor(frame / 2);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }, (_, i) => {
        const a = ((i + rand(seed + i)) / count) * Math.PI * 2;
        const inner = 330 + rand(seed * 3 + i) * 140;
        const outer = 1500;
        const w = 0.012 + rand(seed * 7 + i) * 0.02;
        const p = (r: number, da: number) => `${cx + Math.cos(a + da) * r},${cy + Math.sin(a + da) * r}`;
        return <polygon key={i} points={`${p(inner, 0)} ${p(outer, -w)} ${p(outer, w)}`} fill={color} />;
      })}
    </svg>
  );
};

// 의성어 — 통 튀어나오는 큰 글씨
export const Pop: React.FC<{ text: string; frame: number; x?: number; y?: number; size?: number; rot?: number; color?: string; stroke?: string }> = ({
  text, frame, x = 540, y = 760, size = 190, rot = -8, color = "#ffe14a", stroke = "#d6361f",
}) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.2, 1])})`,
        fontFamily: blackHan, fontSize: size, color, WebkitTextStroke: `${Math.round(size / 14)}px ${stroke}`, paintOrder: "stroke fill",
        whiteSpace: "nowrap", textShadow: "0 10px 0 rgba(0,0,0,0.25)", opacity: Math.min(1, s * 2),
      }}
    >
      {text}
    </div>
  );
};

// 치고박는 먼지 구름
export const DustCloud: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => (
  <>
    {Array.from({ length: 9 }, (_, i) => {
      const ang = (i / 9) * Math.PI * 2 + frame * 0.09;
      const r = 70 + rand(i * 5) * 60 + Math.sin(frame * 0.5 + i) * 18;
      const size = 150 + rand(i * 11) * 90;
      return (
        <div
          key={i}
          style={{
            position: "absolute", left: x + Math.cos(ang) * r - size / 2, top: y + Math.sin(ang) * r * 0.75 - size / 2,
            width: size, height: size, borderRadius: "50%", background: i % 2 ? "#f3ecdd" : "#d9cdb4",
            border: "6px solid #b8a88a",
          }}
        />
      );
    })}
  </>
);

// 별 / 충격 부호
export const Stars: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => (
  <>
    {Array.from({ length: 6 }, (_, i) => {
      const ang = (i / 6) * Math.PI * 2 + frame * 0.2;
      const r = 120 + Math.sin(frame * 0.4 + i) * 20;
      return (
        <div key={i} style={{ position: "absolute", left: x + Math.cos(ang) * r, top: y + Math.sin(ang) * r * 0.5, fontSize: 56 }}>
          {i % 2 ? "💫" : "⭐"}
        </div>
      );
    })}
  </>
);
