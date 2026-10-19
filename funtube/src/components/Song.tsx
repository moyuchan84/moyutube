import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, buildSong, distanceAt, type SongSection } from "../songTimeline";
import { Lyric } from "./Lyric";
import { Kid, kidBox, type Pose } from "../toon/Kid";
import { rand } from "../toon/fx";
import { TitleBar, jua } from "./common";

const K = 1.25;
const TORSO_Y = 1100; // 몸통 아래선이 대시보드에 가려지는 높이
const WHO_X: Record<string, number> = { 후배: 300, 선배: 780 };
const LOOK: Record<string, { hair: string; shirt: string; pants: string; glasses?: boolean; tie?: boolean }> = {
  선배: { hair: "#2b211c", shirt: "#e8f0ff", pants: "#2c2c2c", glasses: true, tie: true },
  후배: { hair: "#5a3a22", shirt: "#ffffff", pants: "#2c3a63" },
};

// ---- 고무호스 팔: 어깨 → (굽힘점) → 손 ----
type ArmPts = number[];
const SH = { L: [62, 182], R: [178, 182] } as const;
const hose = (side: "L" | "R", a: number, wob: number): ArmPts => {
  const sg = side === "L" ? -1 : 1;
  const [sx, sy] = SH[side];
  const hx = sx + sg * (14 + 56 * a);
  const hy = 310 - 250 * a;
  return [sx, sy, sx + sg * (46 + 40 * Math.sin(wob)), (sy + hy) / 2 + 30 * Math.cos(wob), hx, hy];
};
const pointAt = (side: "L" | "R", wob: number): ArmPts => {
  const sg = side === "L" ? -1 : 1;
  const [sx, sy] = SH[side];
  return [sx, sy, sx + sg * 70, sy - 6, sx + sg * (150 + 16 * Math.sin(wob)), sy - 10];
};
const wide = (side: "L" | "R", bob: number): ArmPts => {
  const sg = side === "L" ? -1 : 1;
  const [sx, sy] = SH[side];
  return [sx, sy, sx + sg * 60, sy + 6, sx + sg * 125, sy + bob];
};

// 구간별 안무. beatPos = 구간 시작부터 지난 박자 수
const choreo = (who: "선배" | "후배", sec: SongSection, beatPos: number, t: number) => {
  const w = beatPos * Math.PI;
  const inv = who === "후배" ? Math.PI : 0;
  const wob = t * 9;
  const limp: [ArmPts, ArmPts] = [hose("L", 0.04, wob * 0.3), hose("R", 0.04, wob * 0.3 + 1)];
  switch (sec.style) {
    case "intro":
      return who === "선배"
        ? { arms: [pointAt("L", wob), hose("R", 0.08, 0)] as [ArmPts, ArmPts], head: Math.sin(wob) * 3, lean: 0 }
        : { arms: limp, head: Math.sin(t * 2) * 3, lean: 0 };
    case "chorus": {
      const crazy = sec.energy >= 4;
      const m = crazy ? 2 : 1;
      return {
        arms: [hose("L", 0.5 + 0.5 * Math.sin(w * m + inv), wob), hose("R", 0.5 + 0.5 * Math.sin(w * m + inv + Math.PI), wob + 1)] as [ArmPts, ArmPts],
        head: Math.sin(w * m + inv) * (crazy ? 14 : 6),
        lean: Math.sin(w * m + inv) * (crazy ? 9 : 4),
      };
    }
    case "verse":
      return who === "선배"
        ? { arms: [pointAt("L", beatPos * Math.PI * 2), hose("R", 0, 0)] as [ArmPts, ArmPts], head: Math.sin(w * 2) * 4, lean: 0 }
        : { arms: limp, head: 9, lean: 2 };
    case "bridge":
      return who === "선배"
        ? { arms: [wide("L", Math.sin(w) * 20), wide("R", Math.sin(w + 1) * 20)] as [ArmPts, ArmPts], head: Math.sin(w * 0.5) * 6, lean: Math.sin(w * 0.5) * 5 }
        : { arms: [hose("L", 0.25 + 0.25 * Math.sin(w), wob), hose("R", 0.04, 0)] as [ArmPts, ArmPts], head: Math.sin(w) * 4, lean: 0 };
    default:
      return { arms: limp, head: 0, lean: 0 };
  }
};

const POSE: Record<string, Record<string, Pose>> = {
  선배: { intro: "angry", chorus1: "smirk", verse: "angry", chorus2: "smirk", bridge: "smirk", chorus3: "brawl", drop: "normal", end: "normal" },
  후배: { intro: "normal", chorus1: "sad", verse: "sad", chorus2: "angry", bridge: "angry", chorus3: "shock", drop: "angry", end: "normal" },
};

// ---- 창밖 풍경: 박자가 빨라질수록 더 빨리 지나간다 ----
const Layer: React.FC<{ dist: number; factor: number; seed: number; color: string; n: number; hMin: number; hMax: number; baseY: number }> = ({ dist, factor, seed, color, n, hMin, hMax, baseY }) => {
  const W = 1400;
  const off = (((dist * factor) % W) + W) % W;
  const items = Array.from({ length: n }, (_, k) => {
    const x0 = (k / n) * W;
    const w = (W / n) * (0.75 + 0.2 * rand(seed + k));
    const h = hMin + rand(seed * 3 + k) * (hMax - hMin);
    return { x0, w, h };
  });
  return (
    <>
      {[0, W].map((shift) =>
        items.map((b, k) => (
          <div key={`${shift}${k}`} style={{ position: "absolute", left: b.x0 - off + shift - 200, top: baseY - b.h, width: b.w, height: b.h, background: color }} />
        )),
      )}
    </>
  );
};

export const Song: React.FC = () => {
  const frame = useCurrentFrame();
  const { title, sections, durationInFrames } = React.useMemo(() => buildSong(), []);
  const t = frame / FPS;
  const sec = sections.find((s) => t >= s.start && t < s.end) ?? (t < sections[0].start ? sections[0] : sections[sections.length - 1]);
  const line = sec.lines.find((l) => t >= l.start && t < l.end) ?? (t < sec.start ? sec.lines[0] : sec.lines[sec.lines.length - 1]);

  const music = sec.bpm > 0;
  const beatPos = music ? Math.max(0, ((t - sec.start) * sec.bpm) / 60) : 0;
  const phase = beatPos % 1;
  const beatIdx = Math.floor(beatPos);
  const pulse = music ? (1 - phase) ** 3 : 0;
  const e = sec.energy;

  const dist = distanceAt(sections, t);

  // 카메라: 박자마다 줌 펀치, 후렴3 은 빙글빙글(현기증)
  const zoom = 1 + pulse * 0.014 * e;
  const rot = e >= 4 ? Math.sin(t * 5) * 10 : sec.style === "bridge" ? (Math.floor(beatPos / 2) % 2 ? 2.5 : -2.5) : music && e > 0 ? (beatIdx % 2 ? 0.8 : -0.8) : 0;
  const bgFilter = e >= 4 ? `hue-rotate(${(t * 220) % 360}deg) saturate(1.5)` : e >= 3 ? `hue-rotate(${Math.sin(t * 2) * 25}deg)` : "none";

  const heart = sec.style === "drop" ? [0, 0.3, 0.9, 1.2].reduce((m, b) => (t - sec.start >= b ? Math.max(m, Math.exp(-(t - sec.start - b) / 0.09)) : m), 0) : 0;
  const box = kidBox(K);

  const renderKid = (who: "선배" | "후배") => {
    if (who === "선배" && sec.style === "end") return null;
    const c = choreo(who, sec, beatPos, t);
    const bounce = music && e > 0 ? -pulse * (e >= 4 ? 40 : 26) : 0;
    const squash = music && e > 0 ? 1 - 0.05 * (phase < 0.2 ? 1 - phase * 5 : 0) : 1;
    const talking = line.who === who && t >= line.start && t < line.end && sec.style !== "drop";
    const glow = POSE[who][sec.name] === "glow";
    return (
      <div
        key={who}
        style={{
          position: "absolute", left: WHO_X[who] - box.w / 2, top: TORSO_Y - (300 - -50) * K + bounce,
          transform: `rotate(${c.lean}deg) scale(1, ${squash})`, transformOrigin: "50% 80%",
        }}
      >
        {glow && <div style={{ position: "absolute", left: -80, top: 0, width: box.w + 160, height: box.h * 0.8, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,80,0.95) 0%, rgba(255,200,40,0.45) 50%, rgba(255,200,40,0) 72%)" }} />}
        <div style={{ position: "relative" }}>
          <Kid pose={POSE[who][sec.name] ?? "normal"} talking={talking} frame={frame} k={K} armPts={c.arms as [number[], number[]]} headRot={c.head} {...LOOK[who]} />
        </div>
      </div>
    );
  };

  const pop = music ? 1 + pulse * 0.07 : 1;
  const isEnd = sec.style === "end";

  return (
    <AbsoluteFill style={{ background: "#14141c", fontFamily: jua, overflow: "hidden" }}>
      <Audio src={staticFile("bgm/ride.wav")} volume={0.9} />

      <AbsoluteFill style={{ transformOrigin: "540px 900px", transform: `rotate(${rot}deg) scale(${zoom + heart * 0.04})` }}>
        {/* 차 천장 + 룸미러 */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 340, background: "#2a2c36" }} />
        <div style={{ position: "absolute", left: 440, top: 250, width: 200, height: 56, borderRadius: 14, background: "#161820", border: "6px solid #3a3d4a" }} />

        {/* 창문 */}
        <div style={{ position: "absolute", left: 40, top: 340, width: 1000, height: 740, overflow: "hidden", borderRadius: 18, background: "linear-gradient(#8fd5ff, #e5f6ff)", filter: bgFilter }}>
          <Layer dist={dist} factor={0.25} seed={3} color="#8ab7d6" n={9} hMin={220} hMax={420} baseY={620} />
          <Layer dist={dist} factor={0.6} seed={7} color="#6791b3" n={7} hMin={160} hMax={330} baseY={640} />
          <Layer dist={dist} factor={1.2} seed={11} color="#46688a" n={5} hMin={90} hMax={220} baseY={660} />
          <div style={{ position: "absolute", left: 0, top: 640, width: 1000, height: 100, background: "#555a66" }} />
          {Array.from({ length: 6 }, (_, k) => {
            const off = ((dist * 2 + k * 260) % 1560) - 260;
            return <div key={k} style={{ position: "absolute", left: 1000 - off - 200, top: 690, width: 120, height: 10, background: "#fff", opacity: 0.85 }} />;
          })}
          {e >= 3 && Array.from({ length: 10 }, (_, k) => (
            <div key={k} style={{ position: "absolute", left: ((rand(k * 5) * 1400 - dist * 3) % 1400 + 1400) % 1400 - 200, top: 80 + rand(k * 9) * 520, width: 160 + rand(k) * 160, height: 4, background: "rgba(255,255,255,0.7)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 528, top: 340, width: 24, height: 740, background: "#2a2c36" }} />

        {/* 머리받침 */}
        {(["후배", "선배"] as const).map((w) => (
          <div key={w} style={{ position: "absolute", left: WHO_X[w] - 150, top: 700, width: 300, height: 420, borderRadius: 60, background: "#3c4152", opacity: sec.style === "end" && w === "선배" ? 0 : 1 }} />
        ))}

        {renderKid("후배")}
        {renderKid("선배")}

        {/* 끝: 인도에 남은 선배 (조그맣게, 뒤로 멀어짐) */}
        {isEnd && (() => {
          const local = t - sec.start;
          const x = 880 - local * 260;
          const sc = Math.max(0.2, 0.5 - local * 0.08);
          const small = kidBox(sc);
          const wob = t * 9;
          return (
            <div style={{ position: "absolute", left: x - small.w / 2, top: 1000 - small.feet, opacity: x > -100 ? 1 : 0 }}>
              <Kid pose="sad" talking={false} frame={frame} k={sc} armPts={[hose("L", 0.9, wob), hose("R", 0.9, wob + 1)]} {...LOOK["선배"]} />
            </div>
          );
        })()}

        {/* 대시보드 + 핸들 */}
        <div style={{ position: "absolute", left: 0, top: TORSO_Y - 10, width: 1080, height: 900, background: "linear-gradient(#3b3f4d, #23252e)", borderTop: "14px solid #4a4e5e", borderRadius: "40px 40px 0 0" }} />
        <div style={{ position: "absolute", left: 120, top: 1160, width: 360, height: 130, borderRadius: "50%", border: "22px solid #15161c", transform: `rotate(${music && e > 0 ? Math.sin(beatPos * Math.PI) * 6 : 0}deg)` }} />
      </AbsoluteFill>

      {/* 박자 번쩍임 / 심장 소리 */}
      {music && e >= 2 && <AbsoluteFill style={{ background: "#fff", opacity: pulse * 0.07 * e }} />}
      {sec.style === "drop" && <AbsoluteFill style={{ background: `rgba(0,0,0,0.55)` }} />}
      {sec.style === "drop" && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,0,0,${heart * 0.45}) 0%, rgba(255,0,0,0) 65%)` }} />}
      {isEnd && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)" }} />}

      <Sequence from={0} durationInFrames={95} layout="none">
        <TitleBar title={title} bg="rgba(20,20,40,0.82)" />
      </Sequence>

      {sec.style !== "drop" && <Lyric line={line} sec={sec} t={t} pop={pop} />}
    </AbsoluteFill>
  );
};

export const SONG_DURATION = () => buildSong().durationInFrames;
