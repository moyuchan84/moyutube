import React from "react";
import type { SongLine, SongSection } from "../songTimeline";
import { SAFE, blackHan } from "./common";

const TAG: Record<string, string> = { 선배: "#e5483b", 후배: "#3b7dff" };

// 가사 자막: 줄 안에서 단어가 차례로 노랗게 물든다
export const Lyric: React.FC<{ line: SongLine; sec: SongSection; t: number; pop: number }> = ({ line, sec, t, pop }) => {
  const prog = (t - line.start) / (line.end - line.start);
  const words = line.text.split(" ");
  const isEnd = sec.style === "end";
  const color = TAG[line.who] ?? "#888";
  return (
    <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 1290, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", background: "rgba(10,10,20,0.78)", borderRadius: 34, padding: "34px 44px", textAlign: "center", transform: `scale(${pop})`, border: `8px solid ${color}`, maxWidth: 940 }}>
        <div style={{ position: "absolute", top: -44, left: 30, background: color, color: "#fff", fontSize: 40, padding: "4px 26px", borderRadius: 24, fontFamily: blackHan }}>{line.who}</div>
        <div style={{ fontSize: isEnd ? 76 : 88, lineHeight: 1.25, wordBreak: "keep-all", fontFamily: blackHan }}>
          {words.map((wd, i) => (
            <span key={i} style={{ color: isEnd || i < Math.ceil(prog * words.length * 1.15) ? "#ffe14a" : "#ffffff", marginRight: 16, display: "inline-block" }}>{wd}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
