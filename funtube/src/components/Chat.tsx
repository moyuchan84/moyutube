import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import episodes from "../../content/episodes.json";
import { buildTimeline } from "../timeline";
import { SAFE, Sfx, TitleBar, Voices, jua, shakeOffset } from "./common";

const AVATAR: Record<string, { emoji: string; bg: string }> = {
  아빠: { emoji: "👨", bg: "#9ec5ff" },
  엄마: { emoji: "👩", bg: "#ffb3c7" },
};

export const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, beats } = buildTimeline("chat");
  const last = beats[beats.length - 1];
  const shake = shakeOffset(frame, last.from, 18, 22);

  return (
    <AbsoluteFill style={{ background: "#bccfe0", fontFamily: jua }}>
      <Voices beats={beats} />
      {beats.map((b) => (
        <Sfx key={b.index} at={b.from} name={b.who === "시스템" ? "boom" : "pop"} volume={b.who === "시스템" ? 0.9 : 0.5} />
      ))}

      {/* 채팅방 헤더 */}
      <div style={{ position: "absolute", top: SAFE.top + 20, left: 0, right: 0, height: 110, display: "flex", alignItems: "center", padding: "0 50px", background: "rgba(255,255,255,0.35)", fontSize: 50, color: "#222" }}>
        ‹ &nbsp;{episodes.chat.room} <span style={{ color: "#666", marginLeft: 16 }}>3</span>
      </div>

      {/* 메시지: 아래에서부터 쌓이고, 넘치면 위로 밀려남 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 140,
          bottom: SAFE.bottom,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 26,
          overflow: "hidden",
          transform: `translate(${shake.x}px, ${shake.y}px)`,
        }}
      >
        {beats
          .filter((b) => frame >= b.from)
          .map((b, i, shown) => {
            const s = spring({ frame: frame - b.from, fps, config: { damping: 14, stiffness: 180 } });
            const sameAsPrev = i > 0 && shown[i - 1].who === b.who;
            if (b.who === "시스템") {
              return (
                <div key={b.index} style={{ alignSelf: "center", transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: s, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 44, padding: "16px 34px", borderRadius: 40, marginTop: 20 }}>
                  {b.text}
                </div>
              );
            }
            const mine = b.who === "나";
            const bubble = (
              <div
                style={{
                  background: mine ? "#ffe066" : "#fff",
                  color: "#111",
                  fontSize: 54,
                  padding: "22px 32px",
                  borderRadius: 30,
                  borderTopLeftRadius: !mine && !sameAsPrev ? 6 : 30,
                  borderTopRightRadius: mine ? 6 : 30,
                  maxWidth: 720,
                  lineHeight: 1.3,
                }}
              >
                {b.text}
              </div>
            );
            return (
              <div
                key={b.index}
                style={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  gap: 20,
                  transform: `scale(${s})`,
                  transformOrigin: mine ? "right bottom" : "left bottom",
                }}
              >
                {!mine && (
                  <div style={{ width: 100, flexShrink: 0 }}>
                    {!sameAsPrev && (
                      <div style={{ width: 100, height: 100, borderRadius: 36, background: AVATAR[b.who].bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 62 }}>
                        {AVATAR[b.who].emoji}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {!mine && !sameAsPrev && <div style={{ fontSize: 38, color: "#333" }}>{b.who}</div>}
                  {bubble}
                </div>
              </div>
            );
          })}
      </div>

      <TitleBar title={title} />
    </AbsoluteFill>
  );
};
