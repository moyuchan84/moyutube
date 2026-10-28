import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SAFE, Sfx, Voices, blackHan, jua, shakeOffset } from "../components/common";
import { Character, type Face, type Pose } from "./Character";
import { mouthAt, syllables } from "./mouth";
import { PROPS } from "./props";
import { buildArmy, parseCap, type ArmyBeat } from "./timeline";

const W = 1080;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const SWAP = 6; // 전환 중간(이 프레임에 장면이 바뀐다)

const TAG_SPOTS = [
  { x: 70, y: 1010, r: -8 },
  { x: 700, y: 960, r: 7 },
  { x: 90, y: 1160, r: 5 },
  { x: 690, y: 1130, r: -6 },
];

const Background: React.FC<{ beat: ArmyBeat; frame: number }> = ({ beat, frame }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${beat.bg[0]}, ${beat.bg[1]})` }}>
    <AbsoluteFill
      style={{
        background: `repeating-conic-gradient(from ${frame * 1.2}deg at 50% 40%, rgba(255,255,255,${beat.dark ? 0.06 : 0.16}) 0deg 7deg, transparent 7deg 14deg)`,
      }}
    />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 3px, transparent 3.5px)", backgroundSize: "36px 36px", backgroundPosition: `${frame}px ${frame * 0.6}px` }} />
    <div style={{ position: "absolute", right: -40, top: 420, fontFamily: blackHan, fontSize: 760, lineHeight: 1, color: "rgba(255,255,255,0.12)" }}>
      {beat.index > 0 && beat.index < 13 ? String(beat.index).padStart(2, "0") : ""}
    </div>
  </AbsoluteFill>
);

const Caption: React.FC<{ beat: ArmyBeat; local: number }> = ({ beat, local }) => {
  const { fps } = useVideoConfig();
  const t = local / Math.max(1, beat.speak);
  let ci = 0;
  beat.caps.forEach(([, at], i) => { if (t >= (at as number)) ci = i; });
  const since = local - Math.round((beat.caps[ci][1] as number) * beat.speak);
  const segs = parseCap(beat.caps[ci][0] as string);
  const n = segs.reduce((a, s) => a + [...s.text].length, 0);
  const size = Math.min(118, Math.floor(920 / (n * 0.92)));
  const pop = spring({ frame: since, fps, config: { damping: 9, stiffness: 260 } });
  const stroke = Math.max(10, size * 0.14);
  return (
    <div
      style={{
        position: "absolute", left: SAFE.side - 30, right: SAFE.side - 30, top: 1330, height: 210,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.55, 1])}) rotate(${interpolate(pop, [0, 1], [-3, 0])}deg)`, opacity: clamp(pop * 3), whiteSpace: "nowrap" }}>
        {segs.map((s, i) => (
          <span
            key={i}
            style={{
              fontFamily: blackHan, fontSize: size, color: s.hot ? "#FFE600" : "#fff", display: "inline-block",
              WebkitTextStroke: `${stroke}px #24180F`, paintOrder: "stroke fill",
              transform: s.hot ? `scale(${1.1 + Math.sin(since / 2.5) * 0.03})` : undefined, margin: s.hot ? "0 8px" : 0, whiteSpace: "pre",
              textShadow: "0 8px 0 rgba(0,0,0,0.35)",
            }}
          >
            {s.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const Tags: React.FC<{ beat: ArmyBeat; local: number }> = ({ beat, local }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {beat.tags.slice(0, 4).map((tag, i) => {
        const at = Math.round(beat.speak * (0.12 + (i * 0.8) / Math.max(1, beat.tags.length)));
        const s = spring({ frame: local - at, fps, config: { damping: 8, stiffness: 300 } });
        const spot = TAG_SPOTS[(i + beat.index) % 4];
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: spot.x, top: spot.y, transform: `rotate(${spot.r}deg) scale(${s})`, opacity: s > 0.02 ? 1 : 0,
              fontFamily: jua, fontSize: 64, background: "#FFE600", color: "#24180F", border: "6px solid #24180F", borderRadius: 18,
              padding: "6px 22px", boxShadow: "8px 8px 0 #24180F",
            }}
          >
            {tag}
          </div>
        );
      })}
    </>
  );
};

const Scene: React.FC<{ beat: ArmyBeat; frame: number }> = ({ beat, frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - beat.from;
  const t = clamp(local / Math.max(1, beat.speak));
  const speaking = local >= 0 && local < beat.speak;
  const syls = React.useMemo(() => syllables(beat.say), [beat.say]);
  const mouth = mouthAt(syls, speaking ? local / beat.speak : -1, beat.env ? beat.env[Math.min(local, beat.env.length - 1)] ?? 0 : null);

  const army = beat.index >= 3;
  const cut = beat.hair === "long" ? 0 : beat.hair === "cut" ? clamp((t - 0.28) / 0.3) : 1;
  const seq = (beat as { rankSeq?: number[] }).rankSeq;
  const rank = seq ? seq[t < 0.34 ? 0 : t < 0.68 ? 1 : 2] : beat.rank;

  const Prop = PROPS[beat.prop];
  const propLeft = beat.index % 2 === 0;
  const charX = propLeft ? 600 : 480;
  const enter = spring({ frame: local, fps, config: { damping: 11, stiffness: 220 } });
  const sh = (beat as { shake?: boolean }).shake ? shakeOffset(local, 0, 14, 22) : { x: 0, y: 0 };
  const zoom = 1 + t * 0.05;

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${zoom})`, transformOrigin: "50% 55%" }}>
      <Background beat={beat} frame={frame} />
      {/* 소품 */}
      <div style={{ position: "absolute", left: propLeft ? 30 : 700, top: 420, width: 350, height: 350, transform: `scale(${enter}) rotate(${(propLeft ? -1 : 1) * (1 - enter) * 40}deg)` }}>
        <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: "visible" }}>
          <Prop frame={frame} t={t} />
        </svg>
      </div>
      {/* 캐릭터 */}
      <div style={{ position: "absolute", left: charX - 380, top: 470, width: 760, height: 963, transform: `translateY(${(1 - enter) * 160}px)` }}>
        <Character
          frame={frame}
          mouth={mouth}
          speaking={speaking}
          face={beat.face as Face}
          pose={beat.pose as Pose}
          rank={rank}
          hair={beat.hair === "long" ? "long" : "buzz"}
          cut={cut}
          hat={beat.hat as "none" | "cap" | "helmet"}
          army={army}
        />
      </div>
      <Tags beat={beat} local={local} />
    </AbsoluteFill>
  );
};

// 장면 사이를 가르는 색 띠 (전환 방향은 장면마다 다르다)
const Transition: React.FC<{ beat: ArmyBeat; local: number }> = ({ beat, local }) => {
  if (local < 0 || local > SWAP * 2) return null;
  const p = local / (SWAP * 2);
  if (beat.trans === "flash") return <AbsoluteFill style={{ background: "#fff", opacity: 1 - p }} />;
  if (beat.trans === "zoom") {
    const r = interpolate(p, [0, 1], [0, 1600]);
    return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, transparent ${Math.max(0, r - 700)}px, ${beat.bg[1]} ${r}px)`, opacity: p < 0.5 ? 1 : 0 }} />;
  }
  const dir = beat.trans === "slideL" ? -1 : 1;
  const x = interpolate(p, [0, 1], [-1500 * dir, 1500 * dir]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: -100, left: -200, width: W + 400, height: 2120, background: "#24180F", transform: `translateX(${x}px) skewX(${-12 * dir}deg)` }} />
      <div style={{ position: "absolute", top: -100, left: -200, width: W + 400, height: 2120, background: beat.bg[0], transform: `translateX(${x + 160 * dir}px) skewX(${-12 * dir}deg)`, opacity: 0.95 }} />
    </AbsoluteFill>
  );
};

const Hud: React.FC<{ beat: ArmyBeat; total: number; frame: number }> = ({ beat, total, frame }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - beat.from, fps, config: { damping: 10 } });
  const label = beat.index === 0 ? "군대 1분 요약" : beat.index === total - 1 ? "FIN" : `${String(beat.index).padStart(2, "0")}  ${beat.stage}`;
  return (
    <>
      <div style={{ position: "absolute", top: 232, left: SAFE.side, right: SAFE.side, display: "flex", gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: i <= beat.index ? "#24180F" : "rgba(36,24,15,0.25)", border: "2px solid #24180F" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 268, left: SAFE.side, transform: `scale(${pop}) rotate(${-2 * pop}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontFamily: blackHan, fontSize: 70, color: "#FFE600", background: "#24180F", padding: "8px 34px 12px", borderRadius: 22, boxShadow: "7px 7px 0 rgba(0,0,0,0.3)" }}>{label}</div>
      </div>
    </>
  );
};

export const Army: React.FC = () => {
  const frame = useCurrentFrame();
  const { beats } = React.useMemo(() => buildArmy(), []);
  let cur = 0;
  for (const b of beats) if (frame >= b.from) cur = b.index;
  const beat = beats[cur];
  const local = frame - beat.from;
  // 전환 앞 절반은 이전 장면을 보여 준다
  const shown = local < SWAP && cur > 0 ? beats[cur - 1] : beat;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile("bgm/army.wav")} volume={0.2} />
      <Voices beats={beats as never} />
      {beats.map((b) => (
        <React.Fragment key={b.index}>
          <Sfx at={b.from} name={b.sfx} volume={0.5} />
          {b.sfx !== "whoosh" && b.index > 0 && <Sfx at={b.from} name="whoosh" volume={0.28} />}
        </React.Fragment>
      ))}
      <Scene beat={shown} frame={frame} />
      <Transition beat={beat} local={local} />
      <Hud beat={shown} total={beats.length} frame={frame} />
      <Caption beat={beat} local={local} />
    </AbsoluteFill>
  );
};
