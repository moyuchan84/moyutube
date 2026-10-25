import { loadFont as loadDoHyeon } from "@remotion/google-fonts/DoHyeon";
import { loadFont as loadGugi } from "@remotion/google-fonts/Gugi";
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { blackHan } from "../components/common";

export const FONT = { impact: blackHan, sans: loadDoHyeon().fontFamily, funky: loadGugi().fontFamily };
export const INK = "#14100C";
export const HOT = "#FFE600";
export const W = 1080;
export const H = 1920;

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const easeOut = (t: number) => 1 - (1 - clamp(t)) ** 3;
export const easeInOut = (t: number) => (clamp(t) < 0.5 ? 4 * clamp(t) ** 3 : 1 - (-2 * clamp(t) + 2) ** 3 / 2);
export const hit = (f: number, k = 4) => Math.exp(-Math.max(0, f) / k); // 컷 직후 0→1 로 튀었다 가라앉는 곡선
export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const pop = (f: number, delay = 0, damping = 9) => spring({ frame: f - delay, fps: 30, config: { damping, stiffness: 300, mass: 0.6 } });

export const isDark = (hex = "#000") => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return true;
  const n = parseInt(m[1], 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 140;
};

// 글자 수에 맞춰 한 줄이 폭에 들어오는 글자 크기
export const fit = (text: string, width: number, max: number) => {
  const n = Math.max(...text.split("/").map((l) => [...l.replace(/\*/g, "")].length), 1);
  return Math.min(max, Math.floor(width / (n * 1.04))); // Black Han Sans 는 글자 폭이 넓다
};

// `*강조*` 구간을 노랑으로, 글자마다 테두리
export const Txt: React.FC<{ text: string; size: number; color?: string; hot?: string; stroke?: number; font?: string; style?: React.CSSProperties }> = ({ text, size, color = "#fff", hot = HOT, stroke, font = FONT.impact, style }) => {
  const sw = stroke ?? Math.max(8, size * 0.13);
  return (
    <span style={{ fontFamily: font, fontSize: size, lineHeight: 1.12, whiteSpace: "pre", ...style }}>
      {text.split("*").map((part, i) =>
        part ? (
          <span key={i} style={{ color: i % 2 ? hot : color, WebkitTextStroke: `${sw}px ${INK}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.07}px 0 rgba(0,0,0,0.35)` }}>
            {part}
          </span>
        ) : null,
      )}
    </span>
  );
};

// 배경: 그라데이션 + 움직이는 무늬
export const Backdrop: React.FC<{ bg?: string; bg2?: string; pattern?: string; dark?: boolean; frame: number }> = ({ bg = "#FFE600", bg2, pattern = "rays", dark, frame }) => {
  const a = dark ? 0.07 : 0.16;
  const layer: Record<string, React.CSSProperties> = {
    rays: { background: `repeating-conic-gradient(from ${frame * 1.4}deg at 50% 42%, rgba(255,255,255,${a}) 0deg 7deg, transparent 7deg 14deg)` },
    dots: { backgroundImage: "radial-gradient(rgba(0,0,0,0.16) 4px, transparent 4.5px)", backgroundSize: "40px 40px", backgroundPosition: `${frame * 1.5}px ${frame}px` },
    stripes: { backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,${a}) 0 40px, transparent 40px 80px)`, backgroundPosition: `${frame * 3}px 0` },
    grid: { backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 3px, transparent 3px), linear-gradient(90deg, rgba(255,255,255,0.12) 3px, transparent 3px)", backgroundSize: "90px 90px", backgroundPosition: `0 ${frame * 2}px` },
    paper: { backgroundImage: "radial-gradient(rgba(255,122,26,0.22) 3px, transparent 3.5px)", backgroundSize: "26px 26px" },
    none: {},
  };
  return (
    <AbsoluteFill style={{ background: bg2 ? `linear-gradient(160deg, ${bg}, ${bg2})` : bg }}>
      <AbsoluteFill style={layer[pattern] ?? layer.none} />
    </AbsoluteFill>
  );
};

// 필름 입자 + 비네팅: 모든 컷 위에 덮어서 한 덩어리 영상처럼 보이게 한다
export const Finish: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.38) 100%)", pointerEvents: "none" }} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none" }}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={Math.floor(frame / 2) % 9} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  </>
);

// 이모지 스티커: 통통 튀며 나타나 둥둥 떠 있다
const SPOTS = [[70, 400, -10], [720, 430, 9], [60, 1060, 8], [730, 1020, -8], [380, 340, 4]];
export const Stickers: React.FC<{ emoji?: string[]; f: number; idx: number; size?: number; spots?: number[][] }> = ({ emoji, f, idx, size = 270, spots = SPOTS }) => (
  <>
    {(emoji ?? []).map((e, i) => {
      const [x, y, r] = spots[(idx + i * 2) % spots.length];
      const s = pop(f, 3 + i * 3, 7);
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(f / 5 + i) * 10, fontSize: size, lineHeight: 1, transform: `rotate(${r + Math.sin(f / 7 + i) * 4}deg) scale(${s})`, filter: "drop-shadow(0 10px 0 rgba(0,0,0,0.3))" }}>
          {e}
        </div>
      );
    })}
  </>
);

// 하단 자막 (SAFE: 아래 380px 은 쇼츠 UI 영역)
export const Caption: React.FC<{ text?: string; f: number; bg?: string; y?: number; max?: number }> = ({ text, f, y = 1330, max = 124 }) => {
  if (!text) return null;
  const s = pop(f, 1, 8);
  const size = fit(text, 940, max);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 210, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transform: `scale(${0.5 + 0.5 * s}) rotate(${(1 - s) * -4}deg)`, opacity: clamp(s * 3) }}>
      <Txt text={text.replace("/", " ")} size={size} />
    </div>
  );
};
