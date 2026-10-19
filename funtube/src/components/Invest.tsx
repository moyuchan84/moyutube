import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { FPS, buildTimeline, activeBeat, type Beat, type Chart } from "../timeline";
import { type Dance } from "../toon3d/Char3D";
import { ACTS, ACT_PROP } from "../toon3d/acts";
import { CarBack, CarFront, FaceChar, Rig } from "../toon3d/car";
import { Part } from "../toon3d/parts";
import { CAMS, DIR, LOOK, Subtitle, X, clamp, ease, resolve, type Who } from "./Carpool";
import { Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";

const EP = "invest" as const;
const UP = "#ff3b3b"; // 한국식: 오르면 빨강
const DOWN = "#3b8bff"; // 내리면 파랑

// 차트 창 상태 누적: 같은 label 이 이어지면 앞 차트의 점 개수부터 새로 그린다
const resolveChart = (beats: Beat[], cur: number) => {
  let chart: Chart | null = null, since = 0, fromLen = 1;
  for (let i = 0; i <= cur; i++) {
    const b = beats[i];
    if (b.chart === undefined) continue;
    const next = b.chart;
    fromLen = next && chart && chart.label === next.label ? chart.pts.length : 1;
    chart = next;
    since = b.from;
  }
  return { chart, since, fromLen };
};

// 뒤차: 정체 구간에서 조금씩 다가왔다 멈췄다 한다 (전조등이 뒷유리로 보인다)
const CarBehind: React.FC<{ z: number }> = ({ z }) => (
  <group position={[0.3, -0.1, z]}>
    <Part shape="box" args={[3.6, 1.0, 2]} color="#d9a531" position={[0, 0.2, 0]} />
    <Part shape="box" args={[2.6, 0.9, 1.6]} color="#c08f22" position={[0, 1.1, -0.2]} />
    <Part shape="box" args={[2.3, 0.6, 0.05]} color="#9fd2ff" position={[0, 1.15, 0.62]} outline={0} />
    {([-1, 1] as const).map((s) => (
      <mesh key={s} position={[s * 1.25, 0.35, 1.02]}>
        <circleGeometry args={[0.22, 20]} />
        <meshBasicMaterial color="#fff6c8" toneMapped={false} />
      </mesh>
    ))}
  </group>
);

// 대시보드 위에 뜨는 주식 앱 차트
const ChartPanel: React.FC<{ chart: Chart; since: number; fromLen: number; frame: number }> = ({ chart, since, fromLen, frame }) => {
  const W = 600, H = 105, PAD = 12;
  const pts = chart.pts;
  const reveal = fromLen + (pts.length - fromLen) * ease(clamp((frame - since) / 22));
  const lo = Math.min(...pts), hi = Math.max(...pts);
  const px = (i: number) => PAD + (i / (pts.length - 1)) * (W - PAD * 2);
  const py = (v: number) => PAD + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - PAD * 2);
  // reveal 까지의 꺾은선 (마지막 구간은 중간까지)
  const k = Math.floor(reveal - 1), f = reveal - 1 - k;
  const shown = pts.slice(0, k + 1).map((v, i) => [px(i), py(v)]);
  if (k + 1 < pts.length) shown.push([px(k) + (px(k + 1) - px(k)) * f, py(pts[k] + (pts[k + 1] - pts[k]) * f)]);
  const lastV = k + 1 < pts.length ? pts[k] + (pts[k + 1] - pts[k]) * f : pts[pts.length - 1];
  const pct = ((lastV - pts[0]) / pts[0]) * 100;
  const color = pct >= 0 ? UP : DOWN;
  const pop = 1 + 0.06 * Math.exp(-(frame - since) / 6);
  const [ex, ey] = shown[shown.length - 1];
  return (
    <div style={{ position: "absolute", left: 220, top: 1060, width: 640, transform: `scale(${pop})`, background: "#0f1118", border: "8px solid #2b2f3d", borderRadius: 30, padding: "12px 12px 10px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 14px", fontFamily: blackHan }}>
        <div style={{ color: "#e8e8f0", fontSize: 36 }}>{chart.label}</div>
        <div style={{ color, fontSize: 46 }}>{pct >= 0 ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%</div>
      </div>
      <svg width={W} height={H} style={{ display: "block", marginTop: 6 }}>
        <line x1={0} x2={W} y1={py(pts[0])} y2={py(pts[0])} stroke="#3a3f52" strokeWidth={3} strokeDasharray="10 10" />
        <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={ex} cy={ey} r={13} fill={color} />
      </svg>
      {chart.note && (
        <div style={{ textAlign: "center", fontFamily: blackHan, fontSize: 50, color: UP, marginTop: 4, opacity: clamp((frame - since - 25) / 10) }}>{chart.note}</div>
      )}
    </div>
  );
};

export const Invest: React.FC = () => {
  const frame = useCurrentFrame();
  const { title, beats, durationInFrames } = React.useMemo(() => buildTimeline(EP), []);
  const t = frame / FPS;
  const cur = Math.max(0, activeBeat(beats, frame));
  const b = beats[cur];
  const st = resolve(beats, cur);
  const ch = resolveChart(beats, cur);
  const stinger = beats.find((x) => x.fx === "stinger")!;

  // 정체 구간: 찔끔 갔다 서기를 반복 (긴장 장면에서는 완전히 선다)
  const speedAt = (f: number) => (f >= stinger.from && f < stinger.from + stinger.length ? 0 : 90 * Math.max(0, Math.sin(f / 40)) ** 2);
  let dist = 0;
  for (let f = 0; f < frame; f++) dist += speedAt(f) / FPS;

  // ---- 카메라 ----
  const from = CAMS[st.prevCam], to = CAMS[st.cam];
  const p = ease(clamp((frame - st.camSince) / 9));
  const push = st.cam === "creep" ? 0.22 * clamp((frame - st.camSince) / (stinger.length + 10)) : 0.04 * clamp((frame - st.camSince) / 100);
  const d = (from.d + (to.d - from.d) * p) * (1 - push);
  const tx = from.tx + (to.tx - from.tx) * p;
  const ty = from.ty + (to.ty - from.ty) * p;
  // 쿵(boom) 할 때마다 화면이 흔들린다
  const hit = [...beats].reverse().find((x) => x.from <= frame && x.sfx === "boom");
  const sh = hit ? shakeOffset(frame, hit.from, 10, 0.12) : { x: 0, y: 0 };

  const sky = new THREE.Color().setHSL(0.08, 0.75, 0.8); // 아침 출근길
  const heart = b.fx === "stinger" ? [0, 0.3, 0.9, 1.2].reduce((m, bt) => (t - b.from / FPS >= bt ? Math.max(m, Math.exp(-(t - b.from / FPS - bt) / 0.09)) : m), 0) : 0;

  const renderChar = (who: Who) => {
    const speaking = b.who === who && frame - b.from < b.speak;
    const talk = speaking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0;
    const act = ACTS[st.act[who]] ?? ACTS.idle;
    const local = (frame - st.actSince[who]) / FPS;
    const dance: Dance = { left: { z: 0.14, x: 0, elbow: 0.1 }, right: { z: 0.14, x: 0, elbow: 0.1 }, headZ: 0, headX: 0, leanZ: 0, bounce: 0, squash: 1, ...act(t, DIR[who], local) };
    const explicit = b.face?.[who];
    const faceIdx = explicit ?? (speaking ? 2 : st.face[who]);
    return <FaceChar key={who} who={who} faceIdx={faceIdx} look={LOOK[who]} mood="normal" dance={dance} talk={talk} x={X[who]} frame={frame} prop={ACT_PROP[st.act[who]]} />;
  };

  const behindZ = -7.5 + 0.6 * Math.sin(dist / 30);

  return (
    <AbsoluteFill style={{ background: "#14141c", fontFamily: jua, overflow: "hidden" }}>
      <Voices beats={beats} />
      {beats.filter((x) => x.sfx).map((x) => <Sfx key={x.index} at={x.from} name={x.sfx!} volume={x.sfx === "heart" ? 1 : 0.7} />)}
      <Sequence from={0} durationInFrames={durationInFrames} layout="none">
        <Audio src={staticFile("sfx/engine.wav")} loop volume={0.08} />
      </Sequence>

      <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, position: [0, 1.5, 13.5], near: 0.1, far: 120 }} style={{ position: "absolute", inset: 0 }}>
        <Rig dist={d - heart * 0.3} tx={tx} ty={ty} shake={sh} />
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, 16, 46]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 6, 6]} intensity={2.0} />
        <CarBack dist={dist} hue={0.08} seatX={[X["후배"], X["선배"]]} />
        <CarBehind z={behindZ} />
        {renderChar("후배")}
        {renderChar("선배")}
        <CarFront wheelRot={Math.sin(t * 1.5) * 0.04} />
      </ThreeCanvas>

      {ch.chart && b.fx !== "stinger" && <ChartPanel chart={ch.chart} since={ch.since} fromLen={ch.fromLen} frame={frame} />}

      {b.fx === "stinger" && <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)" }} />}
      {b.fx === "stinger" && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,0,0,${heart * 0.45}) 0%, rgba(255,0,0,0) 65%)` }} />}

      <Sequence from={0} durationInFrames={95} layout="none">
        <TitleBar title={title} bg="rgba(20,20,40,0.82)" />
      </Sequence>

      <Subtitle b={b} top={1330} />
    </AbsoluteFill>
  );
};
