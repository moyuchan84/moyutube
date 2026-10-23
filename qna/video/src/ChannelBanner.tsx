import { loadFont as loadDisplay } from "@remotion/google-fonts/BlackHanSans";
import { loadFont as loadGothic } from "@remotion/google-fonts/GothicA1";
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { findArt } from "./Scene";
import { INK, PAPER, RED } from "./theme";

// 모라구 채널 배너 (2560×1440). 글자 · 인물은 모바일에서도 보이는 가운데 1546×423 띠 안에만 둔다.
// "모 씨네" 문패 + 식구마다 "모" 말장난 이름표: 아들 모라구 · 아빠 모(오)답맨 · 엄마 모(母)범답안
const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });
const { fontFamily: GOTHIC } = loadGothic("normal", { weights: ["800"], ignoreTooManyRequestsWarning: true });

const W = 2560;
const H = 1440;
const SAFE_W = 1546;
const SAFE_H = 423;
const LEFT = (W - SAFE_W) / 2;
const TOP = (H - SAFE_H) / 2;
const YELLOW = "#FFD23F";
const WOOD = "#8A5A2B";

// 빨간 도장 속의 "모" — 채널 전체의 표시
const MoStamp: React.FC<{ size: number }> = ({ size }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size * 1.12,
      height: size * 1.12,
      backgroundColor: RED,
      color: PAPER,
      borderRadius: size * 0.18,
      transform: "rotate(-6deg)",
      boxShadow: `${size * 0.06}px ${size * 0.06}px 0 ${INK}`,
      marginRight: size * 0.06,
    }}
  >
    모
  </span>
);

// 이름표: 큰 이름 + 작은 담당
const NameTag: React.FC<{ x: number; y: number; rot: number; name: React.ReactNode; role: string }> = ({ x, y, rot, name, role }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, 0) rotate(${rot}deg)`,
      backgroundColor: YELLOW,
      border: `5px solid ${INK}`,
      boxShadow: `7px 7px 0 ${INK}`,
      padding: "2px 16px 4px",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ fontFamily: DISPLAY, fontSize: 44, color: INK, lineHeight: 1.1 }}>{name}</div>
    <div style={{ fontFamily: GOTHIC, fontWeight: 800, fontSize: 21, color: RED, lineHeight: 1.2 }}>{role}</div>
  </div>
);

// 괄호 안 글자에 빨간 줄 (모(오)답맨의 "오")
const Struck: React.FC<{ children: string }> = ({ children }) => (
  <span style={{ position: "relative", color: "#9AA0A6" }}>
    {children}
    <span style={{ position: "absolute", left: "-10%", right: "-10%", top: "52%", height: 6, backgroundColor: RED, transform: "rotate(-14deg)" }} />
  </span>
);

export const ChannelBanner: React.FC = () => {
  // 얼굴이 크게 보이는 상반신 그림. 이름표는 가슴께, 얼굴은 가리지 않는다
  const bust = (id: string, x: number, h: number) => {
    const art = findArt("ep08", id);
    return art ? <Img src={art.src} style={{ position: "absolute", left: LEFT + x, top: TOP + SAFE_H - h, height: h }} /> : null;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#F8E7C4", overflow: "hidden" }}>
      {/* 바탕: 종이색 + 망점, 가운데 띠 */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(184,53,42,0.08) 22%, transparent 24%)", backgroundSize: "36px 36px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: TOP, height: SAFE_H, backgroundColor: PAPER, backgroundImage: "repeating-linear-gradient(-35deg, rgba(255,210,63,0.2) 0 40px, transparent 40px 80px)" }} />
      {bust("common/cutin/kid-ask", 600, 360)}
      {bust("common/cutin/mom-smirk", 1170, 400)}
      {bust("common/cutin/dad-panic", 860, 423)}
      <div style={{ position: "absolute", left: 0, right: 0, top: TOP - 5, height: SAFE_H + 10, borderTop: `5px solid ${INK}`, borderBottom: `5px solid ${INK}` }} />

      {/* 왼쪽: 채널 이름 + 모 씨네 문패 */}
      <div style={{ position: "absolute", left: LEFT + 40, top: TOP + 70 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 132, lineHeight: 1, display: "flex", alignItems: "center", letterSpacing: 4 }}>
          <MoStamp size={122} />
          <span style={{ color: RED, WebkitTextStroke: `8px ${PAPER}`, paintOrder: "stroke", filter: `drop-shadow(6px 6px 0 ${INK})` }}>라구</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
          <div style={{ backgroundColor: WOOD, border: `5px solid ${INK}`, borderRadius: 10, padding: "2px 20px", fontFamily: DISPLAY, fontSize: 44, color: PAPER, boxShadow: `6px 6px 0 ${INK}`, transform: "rotate(-3deg)" }}>
            모 씨네
          </div>
          <div style={{ fontFamily: GOTHIC, fontWeight: 800, fontSize: 34, color: INK, lineHeight: 1.25 }}>
            가족 채널
            <br />
            "뭐라구?" 하고 되묻는 집
          </div>
        </div>
      </div>

      {/* 이름표: 가슴께 */}
      <NameTag x={LEFT + 780} y={TOP + 300} rot={-5} name="모라구" role="뭐라구? 담당 · 아들" />
      <NameTag
        x={LEFT + 1060}
        y={TOP + 318}
        rot={3}
        name={
          <>
            모(<Struck>오</Struck>)답맨
          </>
        }
        role="오답 담당 · 아빠"
      />
      <NameTag
        x={LEFT + 1370}
        y={TOP + 300}
        rot={-3}
        name={
          <>
            모(<span style={{ color: RED }}>母</span>)범답안
          </>
        }
        role="어미 모 · 정답 담당 · 엄마"
      />
    </AbsoluteFill>
  );
};
