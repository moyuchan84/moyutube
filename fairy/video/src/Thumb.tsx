import { loadFont } from "@remotion/google-fonts/GowunBatang";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["700"] });

// 유튜브 썸네일 1280x720: 표지 그림 + 큰 제목 + "엄마가 만든 동화" 띠
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f5ead2", fontFamily: `${fontFamily}, 'Malgun Gothic', serif`, overflow: "hidden" }}>
    <Img src={staticFile("art/cover.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1280 * 1.07, height: 720 * 1.07, maxWidth: "none" }} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 40, textAlign: "center" }}>
      <div style={{ fontSize: 118, fontWeight: 700, lineHeight: 1.08, color: "#c0392b", WebkitTextStroke: "14px #fffaf0", paintOrder: "stroke fill", textShadow: "0 6px 0 #0002" }}>진짜 히어로가</div>
      <div style={{ fontSize: 118, fontWeight: 700, lineHeight: 1.08, color: "#2c3e63", WebkitTextStroke: "14px #fffaf0", paintOrder: "stroke fill", textShadow: "0 6px 0 #0002" }}>되는 법</div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 28, bottom: 26, background: "#2c3e63", color: "#fff", fontSize: 40, fontWeight: 700, padding: "8px 28px 12px", borderRadius: 40, border: "4px solid #fffaf0", boxShadow: "0 6px 14px #0004" }}>
      엄마가 만든 동화
    </div>
  </AbsoluteFill>
);
