import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { activeBeat, buildTimeline } from "../timeline";
import { SAFE, Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";

export const Facts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, beats } = buildTimeline("facts");
  const cur = Math.max(0, activeBeat(beats, frame));
  const b = beats[cur];
  const local = frame - b.from;
  const twist = beats.find((x) => x.fx === "twist")!;
  const isTwist = frame >= twist.from;
  const shake = shakeOffset(frame, twist.from, 20, 30);
  const pop = spring({ frame: local, fps, config: { damping: 9 } });
  const factCount = beats.filter((x) => !x.fx && x.index < twist.index).length;

  // 글자를 어절 단위로 음성 속도에 맞춰 등장
  const words = b.text.split(" ");
  const shownWords = Math.ceil(interpolate(local, [0, Math.max(1, b.speak * 0.85)], [0, words.length], { extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill
      style={{
        background: isTwist ? (frame - twist.from < 6 ? "#fff" : "linear-gradient(#3a0010, #8b0020)") : "linear-gradient(#1b1f4b, #3b2b8f)",
        fontFamily: jua,
        color: "#fff",
      }}
    >
      <Voices beats={beats} />
      {beats.map((x) => (
        <Sfx key={x.index} at={x.from} name={x.fx === "twist" ? "boom" : "ding"} volume={x.fx === "twist" ? 1 : 0.4} />
      ))}

      <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)`, alignItems: "center", justifyContent: "center", padding: `${SAFE.top + 60}px ${SAFE.side}px ${SAFE.bottom}px` }}>
        {cur < factCount && (
          <div style={{ fontSize: 46, background: "#ffffff22", borderRadius: 30, padding: "8px 28px", marginBottom: 30 }}>
            {cur + 1} / {factCount}
          </div>
        )}
        <div
          style={{
            fontSize: b.fx === "twist" ? 360 : 300,
            transform: `scale(${interpolate(pop, [0, 1], [0.2, 1])}) rotate(${Math.sin(frame * 0.12) * 6}deg)`,
          }}
        >
          {b.emoji}
        </div>
        <div style={{ marginTop: 50, fontSize: b.fx === "twist" ? 84 : 76, lineHeight: 1.35, textAlign: "center", fontFamily: b.fx === "twist" ? blackHan : jua, wordBreak: "keep-all" }}>
          {words.map((w, i) => (
            <span key={i} style={{ opacity: i < shownWords ? 1 : 0.15 }}>
              {w}{" "}
            </span>
          ))}
        </div>
      </AbsoluteFill>

      <TitleBar title={title} bg={isTwist ? "#ff2d55" : "rgba(0,0,0,0.6)"} />
    </AbsoluteFill>
  );
};
