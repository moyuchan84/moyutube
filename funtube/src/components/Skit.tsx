import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { activeBeat, buildTimeline } from "../timeline";
import { SAFE, Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";

type Mood = "normal" | "angry" | "smug" | "tired";

const Face: React.FC<{ size: number; skin: string; hair: string; talking: boolean; mood: Mood; kid?: boolean }> = ({ size, skin, hair, talking, mood, kid }) => {
  const frame = useCurrentFrame();
  const mouthOpen = talking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0.15;
  const blink = frame % 90 > 85 ? 0.1 : 1;
  const eye = (side: number) => (
    <div style={{ position: "absolute", top: size * 0.42, left: size * (0.5 + side * 0.17) - size * 0.05, width: size * 0.1, height: size * 0.12 * blink, background: "#222", borderRadius: "50%" }} />
  );
  const brow = (side: number) => {
    const tilt = mood === "angry" ? side * -22 : mood === "smug" ? side * 10 : mood === "tired" ? side * 12 : 0;
    return <div style={{ position: "absolute", top: size * 0.33, left: size * (0.5 + side * 0.17) - size * 0.08, width: size * 0.16, height: size * 0.03, background: "#3a2a20", borderRadius: 8, transform: `rotate(${tilt}deg)` }} />;
  };
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* 머리카락 */}
      <div style={{ position: "absolute", inset: -size * 0.06, borderRadius: "50%", background: hair, clipPath: "inset(0 0 45% 0)" }} />
      {kid ? (
        <>
          <div style={{ position: "absolute", top: size * 0.25, left: -size * 0.18, width: size * 0.26, height: size * 0.26, borderRadius: "50%", background: hair }} />
          <div style={{ position: "absolute", top: size * 0.25, right: -size * 0.18, width: size * 0.26, height: size * 0.26, borderRadius: "50%", background: hair }} />
        </>
      ) : (
        <div style={{ position: "absolute", top: -size * 0.22, left: size * 0.36, width: size * 0.28, height: size * 0.28, borderRadius: "50%", background: hair }} />
      )}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: mood === "angry" ? "#ff9b8a" : skin, border: "6px solid #00000022" }} />
      {brow(-1)}
      {brow(1)}
      {eye(-1)}
      {eye(1)}
      <div style={{ position: "absolute", top: size * 0.52, left: size * 0.2, width: size * 0.13, height: size * 0.07, background: "#ff7a9a55", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: size * 0.52, right: size * 0.2, width: size * 0.13, height: size * 0.07, background: "#ff7a9a55", borderRadius: "50%" }} />
      <div
        style={{
          position: "absolute",
          top: size * 0.66,
          left: size * 0.5 - size * 0.1,
          width: size * 0.2,
          height: size * 0.16 * mouthOpen + 6,
          background: "#7a2230",
          borderRadius: mood === "smug" && !talking ? "0 0 40px 40px" : "40%",
        }}
      />
    </div>
  );
};

export const Skit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, beats } = buildTimeline("skit");
  const cur = activeBeat(beats, frame);
  const b = cur >= 0 ? beats[cur] : null;
  const talking = (who: string) => !!b && b.who === who && frame - b.from < b.speak;

  const angryBeat = beats.find((x) => x.fx === "shake")!;
  const zoomBeat = beats.find((x) => x.fx === "zoom")!;
  const crinkle = beats.find((x) => x.fx === "crinkle")!;
  const shake = shakeOffset(frame, angryBeat.from, 20, 26);
  const zoom = spring({ frame: frame - zoomBeat.from, fps, config: { damping: 15 } });

  const momMood: Mood = frame >= angryBeat.from ? "angry" : cur === 5 ? "tired" : "normal";
  const kidMood: Mood = frame >= zoomBeat.from || cur === 4 ? "smug" : "normal";
  const bounce = (who: string) => (talking(who) ? Math.abs(Math.sin(frame * 0.35)) * -18 : 0);

  const sub = b && b.who !== "효과" ? b : null;
  const subIn = sub ? spring({ frame: frame - sub.from, fps, config: { damping: 14 } }) : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#ffe9c7 0%, #ffe9c7 62%, #c98e5a 62%)", fontFamily: jua, overflow: "hidden" }}>
      <Voices beats={beats} />
      <Sfx at={crinkle.from} name="crinkle" volume={0.5} />
      <Sfx at={angryBeat.from} name="boom" volume={0.7} />
      <Sfx at={zoomBeat.from} name="whoosh" volume={0.6} />

      {/* 창문 */}
      <div style={{ position: "absolute", top: 420, left: 340, width: 400, height: 300, background: "#a8dcff", border: "18px solid #fff", borderRadius: 12 }} />

      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${interpolate(zoom, [0, 1], [1, 1.4])})`,
          transformOrigin: "800px 1150px",
        }}
      >
        {/* 엄마 */}
        <div style={{ position: "absolute", left: 90, top: 760 + bounce("엄마"), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Face size={330} skin="#ffd9b8" hair="#4a2f22" talking={talking("엄마")} mood={momMood} />
          <div style={{ width: 300, height: 360, marginTop: -20, background: "#ff7b9c", borderRadius: "140px 140px 30px 30px" }} />
        </div>
        {/* 아이 */}
        <div style={{ position: "absolute", left: 640, top: 960 + bounce("아이"), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Face size={260} skin="#ffe1c4" hair="#2b1d16" talking={talking("아이")} mood={kidMood} kid />
          <div style={{ width: 220, height: 240, marginTop: -16, background: "#5ab0ff", borderRadius: "110px 110px 24px 24px" }} />
        </div>
        {/* 사탕 (바스락 이후 아이 손에) */}
        {frame >= crinkle.from && (
          <div style={{ position: "absolute", left: 820, top: 1200, fontSize: 110, transform: `rotate(${Math.sin(frame * 0.5) * 15}deg)` }}>🍬</div>
        )}
      </AbsoluteFill>

      {/* 효과 텍스트 */}
      {b?.who === "효과" && (
        <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", fontFamily: blackHan, fontSize: 130, color: "#fff", WebkitTextStroke: "6px #333", transform: `rotate(${Math.sin(frame) * 6}deg)` }}>
          {b.text}
        </div>
      )}

      {/* 자막 */}
      {sub && (
        <div style={{ position: "absolute", bottom: SAFE.bottom + 20, left: SAFE.side, right: SAFE.side, display: "flex", justifyContent: "center", transform: `scale(${interpolate(subIn, [0, 1], [0.8, 1])})` }}>
          <div style={{ background: "#fff", border: `8px solid ${sub.who === "엄마" ? "#ff7b9c" : "#5ab0ff"}`, borderRadius: 36, padding: "20px 40px", fontSize: 62, color: "#222", textAlign: "center" }}>
            <span style={{ color: sub.who === "엄마" ? "#e0466e" : "#1f7fd6" }}>{sub.who}</span> {sub.text}
          </div>
        </div>
      )}

      <TitleBar title={title} />
    </AbsoluteFill>
  );
};
