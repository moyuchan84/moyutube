import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { FPS, buildTimeline, activeBeat, type Beat } from "../timeline";
import { type Dance, type Look } from "../toon3d/Char3D";
import { ACTS, ACT_PROP } from "../toon3d/acts";
import { City, FaceChar } from "../toon3d/car";
import { Part } from "../toon3d/parts";
import { rand } from "../toon/fx";
import { SAFE, Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";
import { Subtitle, clamp, ease } from "./Carpool";

const EP = "office" as const;
const L = -1.3, R = 1.3; // 신입 자리(왼쪽) · 선배 자리(오른쪽, 큰 의자)

// ---- 배역 ----
const LOOKS: Record<string, Look> = {
  선배: { hair: "#2b211c", shirt: "#e8f0ff", pants: "#2c2c2c", tie: true },
  후배신입: { hair: "#5a3a22", shirt: "#ffffff", pants: "#2c3a63" },
  후배대리: { hair: "#5a3a22", shirt: "#dbe8ff", pants: "#2c3a63", tie: true },
  신입: { hair: "#b8662e", shirt: "#ffe08a", pants: "#3a3a3a" },
  신입대리: { hair: "#b8662e", shirt: "#dbe8ff", pants: "#3a3a3a", tie: true },
};
// faces: 얼굴 그림 묶음 (신입은 후배 얼굴을 그대로 쓴다 — "5년 전 나랑 똑같네")
type Actor = { role: string; faces: string; look: Look; x: number; z?: number; y?: number; dir: number };
const CAST: Record<string, Actor[]> = {
  past: [
    { role: "후배", faces: "후배", look: LOOKS.후배신입, x: L, dir: 1 },
    { role: "선배", faces: "선배", look: LOOKS.선배, x: R, dir: -1 },
  ],
  now: [
    { role: "신입", faces: "후배", look: LOOKS.신입, x: L, dir: 1 },
    { role: "후배", faces: "후배", look: LOOKS.후배대리, x: R, dir: -1 },
  ],
  boss: [
    { role: "신입", faces: "후배", look: LOOKS.신입, x: L, dir: 1 },
    { role: "후배", faces: "후배", look: LOOKS.후배대리, x: R, dir: -1 },
    // 큰 의자 등받이 위로 고개만 솟아오른다
    { role: "선배", faces: "선배", look: LOOKS.선배, x: R, z: -1.8, y: 2.05, dir: -1 },
  ],
  later: [{ role: "신입", faces: "후배", look: LOOKS.신입대리, x: R, dir: -1 }],
};

// ---- 카메라: 컷은 바로 끊고, 클로즈업은 줌 펀치로 들어간다 ----
type V3 = [number, number, number];
type Cam = { pos: V3; at: V3; roll?: number; punch?: boolean };
const C = (tx: number, ty: number, d: number, cy = 1.5, roll = 0, punch = false): Cam => ({ pos: [tx, cy, d], at: [tx, ty, 0], roll, punch });
const CAMS: Record<string, Cam> = {
  wide: C(0, 0.9, 13.5, 1.7),
  two: C(0, 1.1, 10.5),
  cL: C(L, 1.2, 8),
  cR: C(R, 1.2, 8),
  pL: C(L, 1.45, 5.4, 1.7, 0.12, true),
  pR: C(R, 1.45, 5.4, 1.7, -0.12, true),
  creepR: C(R, 1.35, 6.8),
  boss: C(R, 2.15, 9, 2.2, 0.08, true),
  clock: { pos: [-2.8, 3.2, -1.4], at: [-2.8, 3.2, -5], punch: true },
};

const Rig: React.FC<{ pos: V3; at: V3; roll: number; shake: { x: number; y: number } }> = ({ pos, at, roll, shake }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(pos[0] + shake.x, pos[1] + shake.y, pos[2]);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(at[0], at[1], at[2]);
  return null;
};

// 현재 대사까지의 연출 상태 누적. 휙(whip) 전환은 절반이 지나야 새 장면으로 바뀐다
const resolve = (beats: Beat[], cur: number, frame: number) => {
  let scene = "past", prevScene = "past", cam = "wide", camSince = 0;
  const act: Record<string, string> = { 선배: "idle", 후배: "idle", 신입: "idle" };
  const actSince: Record<string, number> = { 선배: 0, 후배: 0, 신입: 0 };
  const face: Record<string, number> = { 선배: 1, 후배: 1, 신입: 1 };
  for (let i = 0; i <= cur; i++) {
    const b = beats[i];
    if (b.scene) { prevScene = scene; scene = b.scene; }
    if (b.cam && b.cam !== cam) { cam = b.cam; camSince = b.from; }
    for (const [w, a] of Object.entries(b.act ?? {})) if (act[w] !== a) { act[w] = a; actSince[w] = b.from; }
    for (const [w, f] of Object.entries(b.face ?? {})) face[w] = f;
  }
  const b = beats[cur];
  if (b.fx === "whip" && frame < b.from + b.length / 2) scene = prevScene;
  return { scene, cam, camSince, act, actSince, face };
};

// ---- 사무실 세트 ----
const Clock: React.FC<{ t: number }> = ({ t }) => (
  <group position={[-2.8, 3.2, -4.85]}>
    <mesh>
      <circleGeometry args={[0.62, 40]} />
      <meshBasicMaterial color="#fffdf6" />
    </mesh>
    <Part shape="torus" args={[0.62, 0.07]} color="#2a2c36" outline={0} />
    {Array.from({ length: 12 }, (_, k) => (
      <mesh key={k} position={[0.5 * Math.sin((k / 12) * Math.PI * 2), 0.5 * Math.cos((k / 12) * Math.PI * 2), 0.01]} rotation={[0, 0, -(k / 12) * Math.PI * 2]}>
        <planeGeometry args={[k % 3 ? 0.03 : 0.06, k % 3 ? 0.08 : 0.14]} />
        <meshBasicMaterial color="#2a2c36" />
      </mesh>
    ))}
    {/* 6시 정각: 시침은 아래, 분침은 위 */}
    <mesh position={[0, -0.16, 0.02]}><planeGeometry args={[0.07, 0.34]} /><meshBasicMaterial color="#1a1420" /></mesh>
    <mesh position={[0, 0.22, 0.03]}><planeGeometry args={[0.045, 0.46]} /><meshBasicMaterial color="#1a1420" /></mesh>
    <group rotation={[0, 0, -Math.floor(t) * ((Math.PI * 2) / 60)]}>
      <mesh position={[0, 0.2, 0.04]}><planeGeometry args={[0.015, 0.5]} /><meshBasicMaterial color="#e5483b" /></mesh>
    </group>
  </group>
);

const OfficeSet: React.FC<{ t: number }> = ({ t }) => (
  <>
    <City dist={0} factor={0} z={-16} n={10} hue={0.07} light={0.55} seed={5} />
    <City dist={0} factor={0} z={-11} n={7} hue={0.07} light={0.42} seed={9} />
    {/* 뒷벽: 아래 · 위 벽과 창틀, 시계가 걸린 기둥 */}
    <Part shape="box" args={[18, 1.9, 0.2]} color="#e9e1d3" position={[0, 0.35, -5]} outline={0} />
    <Part shape="box" args={[18, 1.8, 0.2]} color="#e9e1d3" position={[0, 5.1, -5]} outline={0} />
    <Part shape="box" args={[1.7, 3.0, 0.2]} color="#e9e1d3" position={[-2.8, 2.75, -5]} outline={0} />
    {[-6, 0.4, 3.4, 6.4].map((x) => (
      <Part key={x} shape="box" args={[0.18, 3.0, 0.25]} color="#9aa0ad" position={[x, 2.75, -5]} outline={0} />
    ))}
    <Clock t={t} />
    <mesh position={[0, -0.62, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 12]} />
      <meshToonMaterial color="#8d93a3" />
    </mesh>
    {/* 의자: 오른쪽은 등받이가 높은 검은 가죽 의자, 왼쪽은 작은 회색 의자 */}
    <Part shape="box" args={[1.9, 3.0, 0.45]} color="#1f1f26" position={[R, 1.95, -0.8]} />
    <Part shape="capsule" args={[0.24, 1.5]} color="#2b2b34" position={[R, 3.45, -0.75]} rotation={[0, 0, Math.PI / 2]} />
    <Part shape="box" args={[1.3, 1.6, 0.3]} color="#8c93a6" position={[L, 1.3, -0.75]} />
    {/* 칸막이 */}
    <Part shape="box" args={[0.12, 1.1, 1.4]} color="#7d8aa6" position={[0, 1.0, 0.9]} />
  </>
);

// 책상 앞판과 책상 위 물건 (인물 아랫몸을 가린다)
const Desk: React.FC = () => (
  <>
    <Part shape="box" args={[16, 9, 2]} color="#c39a6b" position={[0, -3.95, 1.6]} />
    {[L, R].map((x) => (
      <Part key={x} shape="box" args={[1.1, 0.06, 0.36]} color="#2a2c36" position={[x, 0.6, 1.0]} outline={0} />
    ))}
    {([[-2.75, 0.55], [2.75, -0.55]] as const).map(([x, ry]) => (
      <group key={x} position={[x, 1.25, 1.0]} rotation={[0, ry, 0]}>
        <Part shape="box" args={[1.3, 0.85, 0.08]} color="#22242c" />
        <mesh position={[0, 0, 0.05]}><planeGeometry args={[1.15, 0.7]} /><meshBasicMaterial color="#9fd8ff" /></mesh>
        <Part shape="box" args={[0.12, 0.5, 0.12]} color="#22242c" position={[0, -0.6, 0]} outline={0} />
      </group>
    ))}
    <Part shape="capsule" args={[0.16, 0.18]} color="#ffffff" position={[2.0, 0.78, 1.15]} />
    <Part shape="box" args={[0.7, 0.3, 0.5]} color="#f4f4f0" position={[-2.0, 0.72, 1.1]} />
  </>
);

// 던진 서류: 던지는 사람 손에서 왼쪽 책상으로 포물선
const Paper: React.FC<{ local: number }> = ({ local }) => {
  const k = clamp((local - 8) / 12);
  const x = R - 0.3 + (L + 0.3 - (R - 0.3)) * k;
  const y = 1.7 + (0.66 - 1.7) * k + Math.sin(Math.PI * k) * 0.9;
  return (
    <group position={[x, y, 0.9]} rotation={[-Math.PI / 2 + (1 - k) * 0.6, 0, k * Math.PI * 3]}>
      <Part shape="box" args={[0.7, 0.9, 0.02]} color="#ffffff" outline={1.04} />
    </group>
  );
};

// ---- 2D 연출 ----
const SpeedLines: React.FC<{ local: number }> = ({ local }) => {
  if (local > 12) return null;
  const seed = Math.floor(local / 2);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - local / 12 }}>
      {Array.from({ length: 44 }, (_, i) => {
        const a = (i / 44) * Math.PI * 2 + rand(seed * 50 + i) * 0.1;
        const r0 = 420 + rand(seed * 70 + i) * 260;
        return <line key={i} x1={540 + Math.cos(a) * r0} y1={820 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1500} y2={820 + Math.sin(a) * 1500} stroke="#ffffff" strokeWidth={4 + rand(i + seed) * 14} />;
      })}
    </svg>
  );
};

const Stamp: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const s = interpolate(local, [0, 6], [2.6, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: clamp(local / 2) }}>
      <div style={{ transform: `scale(${s}) rotate(-7deg)`, fontFamily: blackHan, fontSize: 130, color: "#e5483b", border: "12px solid #e5483b", borderRadius: 26, padding: "4px 44px", background: "rgba(255,250,240,0.9)" }}>{text}</div>
    </div>
  );
};

const ThinkBubble: React.FC<{ b: Beat }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - b.from, fps, config: { damping: 11 } });
  return (
    <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 1290, display: "flex", justifyContent: "center", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s }}>
      <div style={{ position: "relative", background: "rgba(245,245,255,0.95)", borderRadius: 60, padding: "34px 50px", textAlign: "center", border: "7px dashed #6b6f86", maxWidth: 940 }}>
        <div style={{ position: "absolute", top: -46, left: 36, background: "#6b6f86", color: "#fff", fontSize: 38, padding: "4px 24px", borderRadius: 24, fontFamily: blackHan }}>💭 {b.who} 속마음</div>
        {[[700, -70, 34], [760, -120, 22]].map(([x, y, r], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "rgba(245,245,255,0.95)", border: "5px dashed #6b6f86" }} />
        ))}
        <div style={{ fontSize: 72, lineHeight: 1.25, wordBreak: "keep-all", fontFamily: blackHan, color: "#2a2c44" }}>{b.text}</div>
      </div>
    </div>
  );
};

export const Office: React.FC = () => {
  const frame = useCurrentFrame();
  const { title, beats } = React.useMemo(() => buildTimeline(EP), []);
  const t = frame / FPS;
  const cur = Math.max(0, activeBeat(beats, frame));
  const b = beats[cur];
  const local = frame - b.from;
  const st = resolve(beats, cur, frame);

  // 긴장 장면: 몇 프레임씩 5년 전 장면(선배가 그 의자에)이 끼어든다
  const flash = b.fx === "stinger" && local < 48 && [1, 2].includes(Math.floor(local / 3) % 5);
  const scene = flash ? "past" : st.scene;
  const sepia = scene === "past";

  // ---- 카메라 ----
  const cam = CAMS[st.cam];
  const since = frame - st.camSince;
  const zoom = st.cam === "creepR" ? 1 - 0.25 * clamp(since / (b.length + 10)) : cam.punch ? 1 + 0.35 * (1 - ease(clamp(since / 5))) : 1 - 0.05 * clamp(since / 100);
  const pos = cam.pos.map((p, i) => cam.at[i] + (p - cam.at[i]) * zoom) as V3;
  const hit = [...beats].reverse().find((x) => x.from <= frame && (x.fx === "impact" || x.fx === "stamp" || x.fx === "end"));
  const sh = hit ? shakeOffset(frame, hit.from + (hit.fx === "stamp" ? 5 : 0), 10, 0.14) : { x: 0, y: 0 };
  const heart = b.fx === "stinger" ? [0, 0.3, 0.9, 1.2].reduce((m, bt) => (local / FPS >= bt ? Math.max(m, Math.exp(-(local / FPS - bt) / 0.09)) : m), 0) : 0;

  // 휙 전환: 화면이 왼쪽으로 쓸려 나가고 오른쪽에서 새 장면이 들어온다
  let whipX = 0, blur = 0;
  if (b.fx === "whip") {
    const p = local / b.length;
    whipX = p < 0.5 ? -1300 * (p / 0.5) ** 2 : 1300 * (1 - (p - 0.5) / 0.5) ** 2;
    blur = 26 * Math.sin(Math.PI * Math.min(1, p * 1.6));
  }

  const actors = CAST[scene];
  const renderActor = (a: Actor) => {
    const speaking = b.who === a.role && !b.think && frame - b.from < b.speak && scene === st.scene;
    const talk = speaking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0;
    // 끼어드는 5년 전 장면에서는 선배가 지금 후배와 같은 자세로 앉아 있다
    const actName = flash && a.role === "선배" ? "smug" : st.act[a.role];
    const act = ACTS[actName] ?? ACTS.idle;
    const actLocal = (frame - st.actSince[a.role]) / FPS;
    const dance: Dance = { left: { z: 0.14, x: 0, elbow: 0.1 }, right: { z: 0.14, x: 0, elbow: 0.1 }, headZ: 0, headX: 0, leanZ: 0, bounce: 0, squash: 1, ...act(t, a.dir, actLocal) };
    dance.bounce += a.y ?? 0;
    const faceIdx = flash && a.role === "선배" ? 5 : (b.face?.[a.role] ?? (speaking ? 2 : st.face[a.role]));
    return <FaceChar key={a.role} who={a.faces} faceIdx={faceIdx} look={a.look} mood="normal" dance={dance} talk={talk} x={a.x} z={a.z} frame={frame} prop={ACT_PROP[actName]} />;
  };

  // 같은 장면 안에서 마지막으로 던진 서류
  const paperBeat = [...beats].reverse().find((x) => x.from <= frame && x.fx === "paper");
  const paperOn = paperBeat && !flash && beats.slice(paperBeat.index + 1, cur + 1).every((x) => !x.scene);

  return (
    <AbsoluteFill style={{ background: "#14141c", fontFamily: jua, overflow: "hidden" }}>
      <Voices beats={beats} />
      {/* 배경음악: 말소리 아래로 깔린다. 대사 중에는 더 낮추고 대사 사이에만 살짝 올라온다 */}
      <Audio
        src={staticFile("bgm/office.wav")}
        volume={(f) => (beats.some((b) => b.audio && f >= b.from - 3 && f <= b.from + b.speak + 3) ? 0.035 : 0.09)}
      />
      {beats.filter((x) => x.sfx).map((x) => <Sfx key={x.index} at={x.from} name={x.sfx!} volume={x.sfx === "heart" ? 1 : 0.7} />)}
      <Sfx at={0} name="typing" volume={0.4} />

      <AbsoluteFill style={{ transform: `translateX(${whipX}px)`, filter: `${sepia ? "sepia(0.85) saturate(0.75) contrast(1.05)" : ""} ${blur > 0.5 ? `blur(${blur}px)` : ""}`.trim() || undefined }}>
        <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, position: [0, 1.5, 13.5], near: 0.1, far: 120 }} style={{ position: "absolute", inset: 0 }}>
          <Rig pos={pos} at={cam.at} roll={cam.roll ?? 0} shake={sh} />
          <color attach="background" args={[new THREE.Color("#ffbf86")]} />
          <fog attach="fog" args={[new THREE.Color("#ffbf86"), 18, 48]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 6, 6]} intensity={2.0} />
          <OfficeSet t={t} />
          {actors.map(renderActor)}
          {paperOn && <Paper local={frame - paperBeat.from} />}
          <Desk />
        </ThreeCanvas>
        {sepia && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 50%, rgba(40,20,0,0.5) 100%)" }} />}
      </AbsoluteFill>

      {b.fx === "impact" && <AbsoluteFill style={{ background: "#fff", opacity: local < 3 ? 0.55 : 0 }} />}
      {b.fx === "impact" && <SpeedLines local={local} />}
      {b.fx === "stamp" && b.sound && <Stamp text={b.sound} local={local} />}
      {b.fx === "whip" && b.sound && local >= b.length / 2 && <Stamp text={b.sound} local={local - b.length / 2} />}

      {b.fx === "stinger" && <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />}
      {b.fx === "stinger" && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,0,0,${heart * 0.45}) 0%, rgba(255,0,0,0) 65%)` }} />}
      {b.fx === "stinger" && flash && (
        <AbsoluteFill>
          {[[120, 360, -8], [560, 520, 6], [200, 980, 4], [600, 1150, -5]].map(([x, y, r], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)`, fontFamily: blackHan, fontSize: 84, color: "rgba(255,230,180,0.85)", textShadow: "0 0 18px rgba(0,0,0,0.6)" }}>라떼는 말이야</div>
          ))}
        </AbsoluteFill>
      )}
      {st.scene === "boss" && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)" }} />}

      {b.fx === "end" && (
        <AbsoluteFill style={{ background: `rgba(10,10,16,${clamp(local / 8) * 0.92})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: blackHan, fontSize: 112, lineHeight: 1.3, color: "#fff", textAlign: "center", whiteSpace: "pre-line", transform: `scale(${interpolate(local, [4, 10], [1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, opacity: clamp((local - 4) / 3) }}>
            {b.sound}
          </div>
        </AbsoluteFill>
      )}

      <Sequence from={0} durationInFrames={80} layout="none">
        <TitleBar title={title} bg="rgba(20,20,40,0.82)" />
      </Sequence>

      {b.think ? <ThinkBubble b={b} /> : <Subtitle b={b} />}
    </AbsoluteFill>
  );
};
