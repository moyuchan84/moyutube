import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, INK, PAPER, RED } from "./theme";

const cut = (name: string) => staticFile(`ep01/cuts/${name}`);

const Framed: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
  <div style={{ position: "absolute", border: `6px solid ${INK}`, boxSizing: "border-box", overflow: "hidden", ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

// 원고의 썸네일 문구 3안을 그대로 하나씩
export const Thumbnail: React.FC<{ variant: "a" | "b" | "c" }> = ({ variant }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT, fontWeight: 700 }}>
      {variant === "a" ? (
        <>
          <Framed src={cut("panel04.png")} style={{ right: 32, top: 140, width: 610, height: 440 }} />
          <div style={{ position: "absolute", left: 48, top: 92, fontSize: 96, lineHeight: 1.12, color: INK, letterSpacing: -3 }}>
            호텔
            <br />
            모텔
            <br />
            유스호스텔
            <div style={{ color: RED, fontSize: 92, marginTop: 14 }}>뭐가 달라요?</div>
          </div>
        </>
      ) : null}
      {variant === "b" ? (
        <>
          <Framed src={cut("panel02.png")} style={{ right: 32, top: 150, width: 500, height: 420 }} />
          <div style={{ position: "absolute", left: 48, top: 110, color: INK }}>
            <div style={{ fontSize: 92, letterSpacing: -4, position: "relative", display: "inline-block" }}>
              “가격 차이야”
              <div style={{ position: "absolute", left: -8, right: -8, top: "54%", height: 14, backgroundColor: RED, transform: "rotate(-4deg)" }} />
            </div>
            <div style={{ fontSize: 70, marginTop: 50, lineHeight: 1.25, letterSpacing: -2 }}>
              이거 사실
              <br />
              <span style={{ color: PAPER, backgroundColor: RED, padding: "0 16px" }}>틀린 답</span>이었습니다
            </div>
          </div>
        </>
      ) : null}
      {variant === "c" ? (
        <>
          {[
            ["panel06.png", "귀족을 위해"],
            ["panel07.png", "자동차를 위해"],
            ["panel08.png", "아이들을 위해"],
          ].map(([src, label], i) => (
            <div key={src} style={{ position: "absolute", left: 30 + i * 414, top: 180, width: 392 }}>
              <Framed src={cut(src)} style={{ position: "relative", width: 392, height: 320 }} />
              <div style={{ fontSize: 58, color: RED, textAlign: "center", marginTop: 34, letterSpacing: -2 }}>{label}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 56, textAlign: "center", fontSize: 76, color: INK, letterSpacing: -2 }}>
            호텔 · 모텔 · 유스호스텔
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
