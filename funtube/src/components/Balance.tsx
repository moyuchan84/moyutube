import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { activeBeat, buildTimeline } from "../timeline";
import { Sfx, TitleBar, Voices, blackHan, jua } from "./common";

const COUNT = 3; // 카운트다운(초)

export const Balance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, beats } = buildTimeline("balance");
  const cur = Math.max(0, activeBeat(beats, frame));
  const b = beats[cur];
  const local = frame - b.from;
  const questions = beats.filter((x) => x.a);

  const slideA = spring({ frame: local, fps, config: { damping: 14 } });
  const slideB = spring({ frame: local - 6, fps, config: { damping: 14 } });
  const countStart = b.speak + 6;
  const counting = !b.end && local >= countStart;
  const remaining = COUNT - Math.floor((local - countStart) / fps);
  const progress = interpolate(local, [countStart, countStart + COUNT * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const option = (text: string, color: string, s: number, fromLeft: boolean) => (
    <div style={{ flex: 1, background: color, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ fontFamily: blackHan, fontSize: 92, color: "#fff", textAlign: "center", lineHeight: 1.3, wordBreak: "keep-all", textShadow: "0 6px 0 #0003", transform: `translateX(${interpolate(s, [0, 1], [fromLeft ? -900 : 900, 0])}px)` }}>
        {text}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ fontFamily: jua, background: "#111" }}>
      <Voices beats={beats} />
      {beats.map((x) => <Sfx key={x.index} at={x.from} name="whoosh" volume={0.5} />)}
      {beats.filter((x) => !x.end).flatMap((x) =>
        Array.from({ length: COUNT }, (_, i) => <Sfx key={`${x.index}-${i}`} at={x.from + x.speak + 6 + i * fps} name="tick" volume={0.7} />),
      )}

      {b.end ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "linear-gradient(#ff3b5c, #3b6bff)" }}>
          <div style={{ fontFamily: blackHan, fontSize: 120, color: "#fff", textAlign: "center", transform: `scale(${spring({ frame: local, fps, config: { damping: 8 } })})` }}>
            너의 선택은?<br />💬 댓글로!
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ flexDirection: "column" }}>
          {option(b.a!, "#ff3b5c", slideA, true)}
          {option(b.b!, "#3b6bff", slideB, false)}
          {/* VS + 카운트다운 */}
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 230, height: 230, borderRadius: "50%", background: "#fff", border: "12px solid #111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: blackHan, fontSize: counting ? 130 : 96, color: "#111", transform: `scale(${counting ? 1 + 0.15 * (1 - ((local - countStart) % fps) / fps) : 1})` }}>
              {counting && remaining > 0 ? remaining : "VS"}
            </div>
          </AbsoluteFill>
          {counting && <div style={{ position: "absolute", top: "50%", left: 0, height: 16, marginTop: -8, width: `${progress * 100}%`, background: "#ffe066" }} />}
        </AbsoluteFill>
      )}

      <TitleBar title={b.end ? title : `${title}  ${questions.indexOf(b) + 1}/${questions.length}`} />
    </AbsoluteFill>
  );
};
