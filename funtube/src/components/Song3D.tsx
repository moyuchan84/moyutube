import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { FPS, buildSong, distanceAt, type SongSection } from "../songTimeline";
import { Char3D, type ArmAngle, type Dance, type Look, type Mood } from "../toon3d/Char3D";
import { CarBack, CarFront, FaceChar, Rig } from "../toon3d/car";
import { Lyric } from "./Lyric";
import { TitleBar, jua } from "./common";

const LOOK: Record<string, Look> = {
  선배: { hair: "#2b211c", shirt: "#e8f0ff", pants: "#2c2c2c", glasses: true, tie: true },
  후배: { hair: "#5a3a22", shirt: "#ffffff", pants: "#2c3a63" },
};
const MOOD: Record<string, Record<string, Mood>> = {
  선배: { intro: "angry", chorus1: "smirk", verse: "angry", chorus2: "smirk", bridge: "smirk", chorus3: "dizzy", drop: "normal", end: "normal" },
  후배: { intro: "normal", chorus1: "sad", verse: "sad", chorus2: "angry", bridge: "angry", chorus3: "shock", drop: "angry", end: "normal" },
};
const WHO_X: Record<string, number> = { 후배: -1.2, 선배: 1.2 };

// ---- 춤: 박자(beatPos)로 관절 각도를 계산 ----
const arm = (z: number, elbow = 0, x = 0, wrist = 0): ArmAngle => ({ z, x, elbow, wrist });
const sm = (v: number) => 0.5 + 0.5 * Math.sin(v);
type Pose3 = Partial<Dance>;

// 후렴 동작 사전. bp = 이 동작 안에서 지난 박자, w = 박자 위상(π = 1박), tt = 초, s = 상대 쪽을 향하는 방향(후배 +1, 선배 -1)
const MOVES: Record<string, (bp: number, w: number, tt: number, s: number) => Pose3> = {
  // 번갈아 팔 흔들기
  pump: (bp, w, tt, s) => ({
    left: arm(0.25 + 2.3 * sm(w), 0.5 * Math.sin(tt * 9), 0, 0.6 * Math.sin(tt * 9 + 2)),
    right: arm(0.25 + 2.3 * sm(w + Math.PI), 0.5 * Math.sin(tt * 9 + 1), 0, 0.6 * Math.sin(tt * 9 + 3)),
    twistY: s * 0.25 * Math.sin(w), headZ: Math.sin(w - 0.7) * 0.12, leanZ: Math.sin(w) * 0.07,
  }),
  // 한 손은 하늘로, 한 손은 허리에 — 2박마다 교대 (디스코)
  disco: (bp, w, tt, s) => {
    const u = sm(Math.PI * (bp / 2) - Math.PI / 2);
    return {
      left: arm(0.55 + 1.85 * (1 - u), 1.6 * u + 0.1), right: arm(0.55 + 1.85 * u, 1.6 * (1 - u) + 0.1),
      twistY: s * 0.5 * (u - 0.5), leanZ: 0.18 * (u - 0.5), swayX: 0.28 * (u - 0.5), headZ: 0.2 * (u - 0.5),
    };
  },
  // 두 팔을 들고 국수처럼 흐느적
  noodle: (bp, w, tt) => ({
    left: arm(1.9 + 0.5 * Math.sin(tt * 13), 0.8 * Math.sin(tt * 13 + 1), 0.4 * Math.sin(tt * 7), 0.9 * Math.sin(tt * 13 + 2)),
    right: arm(1.9 + 0.5 * Math.sin(tt * 13 + Math.PI), 0.8 * Math.sin(tt * 13 + 4), 0.4 * Math.sin(tt * 7 + 2), 0.9 * Math.sin(tt * 13 + 5)),
    twistY: 0.3 * Math.sin(tt * 6), shrug: 0.08 + 0.06 * Math.sin(tt * 12), headZ: 0.15 * Math.sin(tt * 6 + 1),
  }),
  // 달리는 팔 + 헤드뱅잉
  bang: (bp, w, tt, s) => ({
    left: arm(0.25, 1.3, -0.9 * Math.sin(w * 2), 0.5), right: arm(0.25, 1.3, 0.9 * Math.sin(w * 2), 0.5),
    bendX: 0.12 + 0.2 * Math.sin(w * 2) ** 2, headX: 0.45 * Math.sin(w * 2), twistY: s * 0.15 * Math.sin(w),
  }),
  // 팔을 벌리고 허리를 크게 비튼다 (스프링클러)
  twist: (bp, w) => ({
    left: arm(1.5, 0.3, 0, 0.4 * Math.sin(w * 2)), right: arm(1.5, 0.3, 0, 0.4 * Math.sin(w * 2 + 1)),
    twistY: 0.7 * Math.sin(w), headY: -0.4 * Math.sin(w), leanZ: 0.08 * Math.sin(w * 2),
  }),
};
// 에너지(후렴 세기)별 동작 순서. 후렴3 은 2박마다 바뀐다
const CYCLE: Record<number, string[]> = { 2: ["pump", "disco"], 3: ["pump", "disco", "noodle", "bang"], 4: ["noodle", "twist", "bang", "disco"] };

const choreo = (who: "선배" | "후배", sec: SongSection, beatPos: number, t: number, pulse: number, lineIdx: number, localT: number): Dance => {
  const w = beatPos * Math.PI;
  const music = sec.bpm > 0;
  const e = sec.energy;
  const s = who === "후배" ? 1 : -1; // 상대 쪽을 향하는 방향 (후배는 왼쪽에 있어 오른쪽으로)
  const speaking = sec.lines[lineIdx]?.who === who;
  const breathe = 0.02 * Math.sin(t * 2.4);
  const base: Dance = {
    left: arm(0.14, 0.1), right: arm(0.14, 0.1), headZ: 0, headX: 0, leanZ: 0, shrug: breathe,
    bounce: music && e > 0 ? pulse * (e >= 4 ? 0.28 : 0.14) : 0,
    squash: music && e > 0 ? 1 - pulse * 0.05 : 1,
    headSquash: music && e > 0 ? pulse : 0,
  };
  const put = (p: Pose3): Dance => ({ ...base, ...p });

  switch (sec.style) {
    case "chorus": {
      const L = e >= 4 ? 2 : 4;
      const cycle = CYCLE[Math.min(4, Math.max(2, e))];
      const bpos = Math.max(0, who === "후배" ? beatPos - 0.5 : beatPos); // 후배는 반 박자 늦게 따라 춘다
      const idx = Math.floor(bpos / L) % cycle.length;
      return put(MOVES[cycle[idx]](bpos % L, bpos * Math.PI, t, s));
    }
    case "intro":
      if (who === "선배") // 호통: 상대를 향해 몸을 돌리고 숙이며 삿대질
        return put({ left: arm(1.45 + 0.2 * pulse + 0.08 * Math.sin(t * 9), 0.1), right: arm(0.55, 1.7), twistY: -0.45, bendX: 0.12 + 0.12 * pulse, headY: -0.3, headZ: Math.sin(t * 9) * 0.05, shrug: 0.05 });
      return speaking // 후배: 축 처진 무표정 → 자기 줄에서는 손목시계를 보여주듯 팔을 든다
        ? put({ right: arm(1.0, 1.9, -0.9), twistY: 0.3, bendX: 0.1, shrug: 0.1 + breathe, headY: 0.25 })
        : put({ bendX: 0.12, headZ: Math.sin(t * 2) * 0.05 });
    case "verse":
      if (who === "선배") {
        const last = lineIdx === 3; // "시간 개념!" 에서는 두 팔을 번쩍
        return put({
          left: last ? arm(2.2, 0.4) : arm(1.45 + 0.25 * pulse, 0.1), right: last ? arm(2.2, 0.4) : arm(0.55, 1.7),
          twistY: last ? 0 : -0.45, bendX: 0.2 + 0.15 * pulse, headY: last ? 0 : -0.3, headZ: Math.sin(w * 2) * 0.08, shrug: last ? 0.15 : 0.05,
        });
      }
      return put({ bendX: 0.2 + 0.1 * Math.sin(w / 4), headZ: 0.16, headX: 0.15, shrug: -0.05, left: arm(0.14 + 0.1 * Math.sin(t * 2), 0.1), twistY: 0.2 });
    case "bridge":
      if (who === "선배") {
        if (!speaking) // 후배가 반박하면 뒤로 젖히며 손들고 도리도리
          return put({ left: arm(2.0, 0.6, 0, 0.5 * Math.sin(t * 14)), right: arm(2.0, 0.6, 0, 0.5 * Math.sin(t * 14 + 1)), bendX: -0.22, headY: Math.sin(t * 13) * 0.35, headZ: 0.1, shrug: 0.12 });
        if (lineIdx === 2) // "우회전 했어야지~": 오른팔로 휙
          return put({ left: arm(0.55, 1.7), right: arm(1.5 + 0.35 * Math.sin(w), 0.2), twistY: 0.35 * Math.sin(w * 0.5) + 0.2, bendX: 0.1, headZ: 0.15 });
        return put({ left: arm(0.35, 0.4, -1.3 - 0.25 * pulse), right: arm(0.55, 1.9), twistY: -0.2, bendX: 0.08 + 0.1 * pulse, headZ: Math.sin(w * 0.5) * 0.1 }); // "직진하라고": 앞으로 쭉
      }
      return put({ // 후배: 핸들을 잡고, 말할 때 고개를 젓는다
        left: arm(0.25, 0.5, -0.9 + 0.05 * Math.sin(t * 25)), right: arm(0.25, 0.5, -0.9 + 0.05 * Math.sin(t * 25 + 1)),
        twistY: speaking ? 0.35 : 0.1, bendX: speaking ? 0.18 : 0.05, headY: speaking ? Math.sin(t * 12) * 0.35 : 0, shrug: speaking ? 0.08 : 0,
      });
    case "drop": // 정적: 후배가 핸들을 꼭 쥐고 천천히 선배 쪽으로 고개를 돌린다
      return who === "후배"
        ? put({ left: arm(0.25, 0.5, -0.9 + 0.03 * Math.sin(t * 40)), right: arm(0.25, 0.5, -0.9 + 0.03 * Math.sin(t * 40 + 1)), twistY: Math.min(0.5, localT * 0.35), headY: Math.min(0.55, localT * 0.4), bendX: 0.05 })
        : put({ bendX: -0.12, shrug: 0.1 });
    default: // end
      return who === "후배" ? put({ left: arm(0.25, 0.5, -0.9), right: arm(0.25, 0.5, -0.9), shrug: 0.04 + breathe, bendX: 0.02 }) : put({});
  }
};

// ---- 표정 번호(1~6): 1 무표정 · 2 말하는 중 · 3 화남 · 4 놀람 · 5 귀여움(능글) · 6 기괴 ----
// 표정은 대사 한 줄 동안 하나로 유지한다 (그림이 눈까지 통째로 바뀌어서, 말할 때 번갈아 쓰면 깜빡거린다).
// speaker = 지금 이 줄을 말하는 사람인가, 아니면 듣는 쪽(리액션)인가
const planFace = (who: "선배" | "후배", sec: SongSection, lineIdx: number, speaker: boolean): number => {
  if (who === "선배") {
    switch (sec.style) {
      case "intro": return speaker ? 3 : 4; // 호통 → 후배의 반박에 놀람
      case "verse": return lineIdx === 3 ? 2 : 3; // 삿대질하며 화냄
      case "bridge": return speaker ? 2 : 4; // 우기다가 반박에 놀람
      case "chorus": return lineIdx === 2 ? 5 : 2; // "난 일찍 나왔어!" 는 능글맞게
      default: return 1;
    }
  }
  switch (sec.style) {
    case "intro": return speaker ? 2 : 1;
    case "chorus": return sec.name === "chorus1" ? 1 : sec.name === "chorus2" ? 3 : 4; // 무표정 → 화남 → 질림
    case "verse": return 1;
    case "bridge": return 3;
    case "end": return 1; // 정적 뒤에 정색하고 담담하게 (노려보던 얼굴 → 무표정으로 한마디)
    default: return 1;
  }
};
const pickFace = (who: "선배" | "후배", sec: SongSection, lineIdx: number, speaker: boolean, beatPos: number, localT: number) => {
  const beatIdx = Math.floor(beatPos);
  const phase = beatPos % 1;
  // 두 줄(8박)에 한 번, 후렴2·3 끝에서 기괴한 얼굴이 아주 잠깐 번쩍
  if (sec.style === "chorus" && sec.energy >= 3 && beatIdx % 8 === 7 && phase < 0.25) return 6;
  if (sec.style === "drop" && who === "후배") return localT > 0.4 ? 6 : 1; // 정적: 소름 돋게 노려봄
  return planFace(who, sec, lineIdx, speaker);
};

export const Song3D: React.FC<{ faces?: boolean }> = ({ faces = false }) => {
  const frame = useCurrentFrame();
  const { title, sections } = React.useMemo(() => buildSong(), []);
  const t = frame / FPS;
  const sec = sections.find((s) => t >= s.start && t < s.end) ?? (t < sections[0].start ? sections[0] : sections[sections.length - 1]);
  const line = sec.lines.find((l) => t >= l.start && t < l.end) ?? (t < sec.start ? sec.lines[0] : sec.lines[sec.lines.length - 1]);

  const music = sec.bpm > 0;
  const beatPos = music ? Math.max(0, ((t - sec.start) * sec.bpm) / 60) : 0;
  const phase = beatPos % 1;
  const pulse = music ? (1 - phase) ** 3 : 0;
  const e = sec.energy;
  const dist = distanceAt(sections, t);
  const isEnd = sec.style === "end";

  const heart = sec.style === "drop" ? [0, 0.3, 0.9, 1.2].reduce((m, b) => (t - sec.start >= b ? Math.max(m, Math.exp(-(t - sec.start - b) / 0.09)) : m), 0) : 0;
  const orbit = e >= 4 ? Math.sin(t * 2.2) * 0.55 : sec.style === "bridge" ? (Math.floor(beatPos / 2) % 2 ? 0.09 : -0.09) : 0;
  const roll = e >= 4 ? Math.sin(t * 5) * 0.17 : sec.style === "bridge" ? (Math.floor(beatPos / 2) % 2 ? 0.03 : -0.03) : 0;
  const camDist = 13.5 - pulse * 0.12 * e - heart * 0.4;
  const hue = e >= 4 ? (t * 0.6) % 1 : e >= 3 ? 0.58 + Math.sin(t * 2) * 0.05 : 0.58;
  const sky = new THREE.Color().setHSL(hue, 0.7, 0.78);

  const renderChar = (who: "선배" | "후배") => {
    if (who === "선배" && isEnd) return null;
    const talking = line.who === who && t >= line.start && t < line.end && sec.style !== "drop";
    const talk = talking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0;
    const mood = MOOD[who][sec.name] ?? "normal";
    const props = { look: LOOK[who], mood, dance: choreo(who, sec, beatPos, t, pulse, sec.lines.indexOf(line), t - sec.start), talk, x: WHO_X[who], frame };
    if (!faces) return <Char3D key={who} {...props} />;
    const faceIdx = pickFace(who, sec, sec.lines.indexOf(line), line.who === who, beatPos, t - sec.start);
    return <FaceChar key={who} who={who} faceIdx={faceIdx} {...props} look={{ ...LOOK[who], glasses: false }} />;
  };

  const local = t - sec.start;
  return (
    <AbsoluteFill style={{ background: "#14141c", fontFamily: jua, overflow: "hidden" }}>
      <Audio src={staticFile("bgm/ride.wav")} volume={0.9} />

      <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, position: [0, 1.5, 13.5], near: 0.1, far: 120 }} style={{ position: "absolute", inset: 0 }}>
        <Rig orbit={orbit} roll={roll} dist={camDist} />
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, 16, 46]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 6, 6]} intensity={2.0} />

        <CarBack dist={dist} hue={hue} seatX={[WHO_X["후배"], WHO_X["선배"]]} />

        {renderChar("후배")}
        {renderChar("선배")}
        {isEnd && (
          <Char3D
            look={LOOK["선배"]} mood="sad" scale={0.55} x={1.8 - local * 1.1} z={-4} frame={frame} talk={0}
            dance={{ left: arm(2.6, 0.3 * Math.sin(t * 9)), right: arm(2.6, 0.3 * Math.sin(t * 9 + 1)), headZ: 0, headX: 0, leanZ: 0, bounce: 0, squash: 1 }}
          />
        )}

        <CarFront wheelRot={music && e > 0 ? Math.sin(beatPos * Math.PI) * 0.12 : 0} />
      </ThreeCanvas>

      {music && e >= 2 && <AbsoluteFill style={{ background: "#fff", opacity: pulse * 0.07 * e }} />}
      {sec.style === "drop" && <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />}
      {sec.style === "drop" && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(255,0,0,${heart * 0.45}) 0%, rgba(255,0,0,0) 65%)` }} />}
      {isEnd && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)" }} />}

      <Sequence from={0} durationInFrames={95} layout="none">
        <TitleBar title={title} bg="rgba(20,20,40,0.82)" />
      </Sequence>
      {sec.style !== "drop" && <Lyric line={line} sec={sec} t={t} pop={music ? 1 + pulse * 0.07 : 1} />}
    </AbsoluteFill>
  );
};
