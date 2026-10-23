import { loadFont } from "@remotion/google-fonts/BlackHanSans";
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { findArt } from "../Scene";
import { INK, RED } from "../theme";

// 모답맨 썸네일 (1280×720): 놀란 아빠 얼굴 + 빨간 X + 두 줄 문구 + 정답 인물 + 오답 카운터
// 문구는 src/motion/<id>.json 의 thumb 에 적는다
const { fontFamily: DISPLAY } = loadFont("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });
const YELLOW = "#FFD23F";

export type MotionThumbSpec = { top: string; bottom: string; sub?: string; dad?: string; guest?: string; count?: number };

const BURST = Array.from({ length: 20 }, (_, i) => {
  const a0 = (i / 20) * Math.PI * 2;
  const a1 = ((i + 0.5) / 20) * Math.PI * 2;
  return `M50,50 L${50 + Math.cos(a0) * 150},${50 + Math.sin(a0) * 150} L${50 + Math.cos(a1) * 150},${50 + Math.sin(a1) * 150} Z`;
}).join(" ");

const STROKES = [
  [12, 14, 88, 14],
  [50, 14, 50, 88],
  [50, 50, 80, 50],
  [24, 44, 24, 88],
  [6, 88, 94, 88],
];

const big = (size: number, color: string): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  lineHeight: 1.02,
  color,
  WebkitTextStroke: `${Math.round(size / 9)}px ${INK}`,
  paintOrder: "stroke",
  filter: `drop-shadow(${size / 14}px ${size / 14}px 0 ${INK})`,
  whiteSpace: "nowrap",
});

export const MotionThumb: React.FC<{ episode: string; spec: MotionThumbSpec }> = ({ episode, spec }) => {
  const dad = findArt(episode, spec.dad ?? "common/cutin/dad-shock");
  const guest = spec.guest ? findArt(episode, spec.guest) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: RED, overflow: "hidden" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", transform: "scale(1.5)", transformOrigin: "28% 60%" }}>
        <path d={BURST} fill="#A02D23" />
      </svg>
      {/* 오답 X 위에 아빠 얼굴 */}
      <svg viewBox="0 0 100 100" width={560} height={560} style={{ position: "absolute", left: -20, top: 120, filter: `drop-shadow(10px 10px 0 ${INK})` }}>
        <g stroke={YELLOW} strokeWidth="16" strokeLinecap="round">
          <line x1="14" y1="14" x2="86" y2="86" />
          <line x1="86" y1="14" x2="14" y2="86" />
        </g>
      </svg>
      {dad ? <Img src={dad.src} style={{ position: "absolute", left: -40, bottom: -70, height: 640, transform: "rotate(-5deg)" }} /> : null}
      {guest ? <Img src={guest.src} style={{ position: "absolute", right: -50, bottom: -60, height: 330, transform: "rotate(6deg)" }} /> : null}
      <div style={{ position: "absolute", left: 440, top: 128, transform: "rotate(-3deg)" }}>
        <div style={big(92, "#fff")}>{spec.top}</div>
        <div style={{ ...big(100, YELLOW), marginTop: 14 }}>{spec.bottom}</div>
        {spec.sub ? <div style={{ ...big(54, "#fff"), marginTop: 30, marginLeft: 6 }}>{spec.sub}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 28, top: 24, fontFamily: DISPLAY, fontSize: 58, color: INK, backgroundColor: YELLOW, padding: "4px 22px", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, transform: "rotate(-4deg)" }}>
        모답맨
      </div>
      {spec.count ? (
        <div style={{ position: "absolute", left: 300, top: 22, display: "flex", alignItems: "center", gap: 10, transform: "rotate(3deg)" }}>
          <div style={{ width: 92, height: 92, backgroundColor: "#fff", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
            <svg viewBox="-6 -6 112 112" width="100%" height="100%">
              {STROKES.slice(0, spec.count).map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED} strokeWidth={12} strokeLinecap="round" />
              ))}
            </svg>
          </div>
          <div style={big(46, "#fff")}>오답 {spec.count}번</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
