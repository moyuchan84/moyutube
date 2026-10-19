import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { FPS, buildTimeline, activeBeat, type Beat } from "../timeline";
import { Char3D, type Dance, type Look } from "../toon3d/Char3D";
import { ACTS } from "../toon3d/acts";
import { CarBack, CarFront, FaceChar, Rig } from "../toon3d/car";
import { SAFE, Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";

const EP = "carpool" as const;
export const WHO = ["후배", "선배"] as const;
export type Who = (typeof WHO)[number];
export const X: Record<Who, number> = { 후배: -1.2, 선배: 1.2 };
export const DIR: Record<Who, number> = { 후배: 1, 선배: -1 }; // 상대 쪽 방향
export const LOOK: Record<Who, Look> = {
  선배: { hair: "#2b211c", shirt: "#e8f0ff", pants: "#2c2c2c", tie: true },
  후배: { hair: "#5a3a22", shirt: "#ffffff", pants: "#2c3a63" },
};
export const TAG: Record<string, string> = { 선배: "#e5483b", 후배: "#3b7dff", 내비: "#2f9d77", 신입: "#2bb673" };

// 카메라 샷: d=거리, tx/ty=바라보는 곳
export const CAMS: Record<string, { d: number; tx: number; ty: number }> = {
  wide: { d: 13.5, tx: 0, ty: 0.7 },
  two: { d: 10.5, tx: 0, ty: 1.0 },
  c선배: { d: 8, tx: 1.1, ty: 1.2 },
  c후배: { d: 8, tx: -1.1, ty: 1.2 },
  creep: { d: 6.4, tx: -0.9, ty: 1.3 },
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (v: number) => 1 - (1 - v) ** 3;

// 현재 대사까지의 연출 상태를 누적 (연기 · 표정 · 카메라는 다음 지정 전까지 유지)
export const resolve = (beats: Beat[], cur: number) => {
  let cam = "wide", prevCam = "wide", camSince = 0;
  const act: Record<string, string> = { 선배: "idle", 후배: "deadpan" };
  const actSince: Record<string, number> = { 선배: 0, 후배: 0 };
  const face: Record<string, number> = { 선배: 1, 후배: 1 };
  for (let i = 0; i <= cur; i++) {
    const b = beats[i];
    if (b.cam && b.cam !== cam) { prevCam = cam; cam = b.cam; camSince = b.from; }
    for (const [w, a] of Object.entries(b.act ?? {})) if (act[w] !== a) { act[w] = a; actSince[w] = b.from; }
    for (const [w, f] of Object.entries(b.face ?? {})) face[w] = f;
  }
  return { cam, prevCam, camSince, act, actSince, face };
};

export const Carpool: React.FC = () => {
  const frame = useCurrentFrame();
  const { title, beats, durationInFrames } = React.useMemo(() => buildTimeline(EP), []);
  const t = frame / FPS;
  const cur = Math.max(0, activeBeat(beats, frame));
  const b = beats[cur];
  const st = resolve(beats, cur);

  const driveFrom = beats.find((x) => x.fx === "drive")!.from;
  const stinger = beats.find((x) => x.fx === "stinger")!;
  const out = beats.find((x) => x.fx === "out")!;

  // 풍경 이동: 출발하면 달리고, 정적에서 멈추고, 내려 주면 다시 달린다
  const speedAt = (f: number) => {
    if (f < driveFrom) return 0;
    if (f < stinger.from) return 650 * ease(clamp((f - driveFrom) / 20));
    if (f < out.from) return 650 * (1 - clamp((f - stinger.from) / 24));
    return 760 * ease(clamp((f - out.from) / 15));
  };
  let dist = 0;
  for (let f = 0; f < frame; f++) dist += speedAt(f) / FPS;

  // ---- 카메라 ----
  const from = CAMS[st.prevCam], to = CAMS[st.cam];
  const p = ease(clamp((frame - st.camSince) / 9));
  const push = st.cam === "creep" ? 0.22 * clamp((frame - st.camSince) / (stinger.length + 10)) : 0.04 * clamp((frame - st.camSince) / 100);
  const d = (from.d + (to.d - from.d) * p) * (1 - push);
  const tx = from.tx + (to.tx - from.tx) * p;
  const ty = from.ty + (to.ty - from.ty) * p;
  const hitBeat = [...beats].reverse().find((x) => x.from <= frame && Object.values(x.act ?? {}).some((a) => a === "flinch" || a === "surrender"));
  const sh = hitBeat ? shakeOffset(frame, hitBeat.from, 10, 0.1) : { x: 0, y: 0 };

  const sky = new THREE.Color().setHSL(0.58, 0.7, 0.78);
  const isOut = frame >= out.from;
  const heart = b.fx === "stinger" ? [0, 0.3, 0.9, 1.2].reduce((m, bt) => (t - b.from / FPS >= bt ? Math.max(m, Math.exp(-(t - b.from / FPS - bt) / 0.09)) : m), 0) : 0;

  const renderChar = (who: Who) => {
    if (who === "선배" && isOut) return null;
    const speaking = b.who === who && frame - b.from < b.speak;
    const talk = speaking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0;
    const act = ACTS[st.act[who]] ?? ACTS.idle;
    const local = (frame - st.actSince[who]) / FPS;
    const dance: Dance = { left: { z: 0.14, x: 0, elbow: 0.1 }, right: { z: 0.14, x: 0, elbow: 0.1 }, headZ: 0, headX: 0, leanZ: 0, bounce: 0, squash: 1, ...act(t, DIR[who], local) };
    // 말하는 줄이면 말하는 표정을 기본으로, 아니면 마지막에 지정된 표정을 유지
    const explicit = b.face?.[who];
    const faceIdx = explicit ?? (speaking ? 2 : st.face[who]);
    return <FaceChar key={who} who={who} faceIdx={faceIdx} look={LOOK[who]} mood="normal" dance={dance} talk={talk} x={X[who]} frame={frame} />;
  };

  // 내비 화면 / 자막
  const nav = b.fx === "nav" ? b : null;
  const engine = [
    { from: driveFrom, to: stinger.from },
    { from: out.from, to: durationInFrames },
  ];
  const outT = (frame - out.from) / FPS;

  return (
    <AbsoluteFill style={{ background: "#14141c", fontFamily: jua, overflow: "hidden" }}>
      <Voices beats={beats} />
      {beats.filter((x) => x.sfx).map((x) => <Sfx key={x.index} at={x.from} name={x.sfx!} volume={x.sfx === "heart" ? 1 : 0.7} />)}
      {engine.map((e, i) => (
        <Sequence key={i} from={e.from} durationInFrames={e.to - e.from} layout="none">
          <Audio src={staticFile("sfx/engine.wav")} loop volume={0.14} />
        </Sequence>
      ))}

      <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, position: [0, 1.5, 13.5], near: 0.1, far: 120 }} style={{ position: "absolute", inset: 0 }}>
        <Rig dist={d - heart * 0.3} tx={tx} ty={ty} shake={sh} />
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, 16, 46]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 6, 6]} intensity={2.0} />
        <CarBack dist={dist} hue={0.58} seatX={[X["후배"], X["선배"]]} />
        {renderChar("후배")}
        {renderChar("선배")}
        {isOut && (
          <FaceChar
            who="선배" faceIdx={4} look={LOOK["선배"]} mood="sad" scale={0.7} x={0.15 * (13.5 - (-3 - outT * 4.5))} z={-3 - outT * 4.5} frame={frame} talk={0}
            dance={{ left: { z: 2.6, x: 0, elbow: 0.3 * Math.sin(t * 9) }, right: { z: 2.6, x: 0, elbow: 0.3 * Math.sin(t * 9 + 1) }, headZ: 0, headX: 0, leanZ: 0, bounce: 0.9, squash: 1 }}
          />
        )}
        <CarFront wheelRot={Math.sin(t * 1.5) * 0.04} />
      </ThreeCanvas>

      {/* 내비게이션 화면 */}
      {nav && (
        <div style={{ position: "absolute", left: 270, top: 1090, width: 540, height: 130, borderRadius: 24, background: "#0d2a22", border: "8px solid #2f9d77", color: "#8ff5c8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: blackHan, fontSize: 48, opacity: 0.95 }}>
          {nav.sound}
        </div>
      )}

      {b.fx === "stinger" && <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)" }} />}
      {b.fx === "stinger" && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,0,0,${heart * 0.45}) 0%, rgba(255,0,0,0) 65%)` }} />}
      {isOut && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)" }} />}

      <Sequence from={0} durationInFrames={95} layout="none">
        <TitleBar title={title} bg="rgba(20,20,40,0.82)" />
      </Sequence>

      <Subtitle b={b} />
    </AbsoluteFill>
  );
};

// 말풍선 자막 (효과 줄은 표시하지 않음)
export const Subtitle: React.FC<{ b: Beat; top?: number }> = ({ b, top = 1290 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (b.who === "효과") return null;
  const subIn = spring({ frame: frame - b.from, fps, config: { damping: 13 } });
  const tag = TAG[b.who] ?? "#444";
  return (
    <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top, display: "flex", justifyContent: "center", transform: `scale(${interpolate(subIn, [0, 1], [0.85, 1])})`, opacity: subIn }}>
      <div style={{ position: "relative", background: "rgba(10,10,20,0.82)", borderRadius: 34, padding: "34px 44px", textAlign: "center", border: `8px solid ${tag}`, maxWidth: 940 }}>
        <div style={{ position: "absolute", top: -44, left: 30, background: tag, color: "#fff", fontSize: 40, padding: "4px 26px", borderRadius: 24, fontFamily: blackHan }}>{b.who}</div>
        <div style={{ fontSize: 76, lineHeight: 1.25, wordBreak: "keep-all", fontFamily: blackHan, color: "#ffe14a" }}>{b.text}</div>
      </div>
    </div>
  );
};
