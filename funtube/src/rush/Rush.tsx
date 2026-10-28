import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "../components/common";
import { FONT, Finish, INK, clamp, easeInOut, easeOut, hit, rnd } from "./fx";
import { SHOTS } from "./shots";
import { buildRush, clockAt, type BuiltShot } from "./timeline";
import type { Theme } from "./types";

const TRANS = 7; // 전환에 쓰는 프레임

// 컷마다 카메라: 들어올 때 한 번 쾅 튀고, 박자마다 살짝 숨 쉰다
const ShotView: React.FC<{ s: BuiltShot; f: number; bf: number }> = ({ s, f, bf }) => {
  const View = SHOTS[s.k];
  const p = clamp(f / s.len);
  const cam = s.cam ?? (s.k === "title" ? "none" : "push");
  const punch = s.k === "title" ? 0 : 0.1 * hit(f, 3.5) + 0.012 * hit(f % bf, 4);
  let scale = 1 + punch, rot = 0, tx = 0, ty = 0;
  if (cam === "push") scale += 0.1 * p;
  if (cam === "pull") scale += 0.12 * (1 - p);
  if (cam === "tilt") { rot = 3; scale += 0.06; }
  if (cam === "spin") { rot = -9 * (1 - easeOut(f / 10)); scale += 0.05; }
  if (cam === "shake") { const d = hit(f, 10); tx = (rnd(f) - 0.5) * 34 * d; ty = (rnd(f + 40) - 0.5) * 34 * d; scale += 0.04; }
  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`, transformOrigin: "50% 50%" }}>
      <View s={s} f={f} bf={bf} />
    </AbsoluteFill>
  );
};

const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const Hud: React.FC<{ frame: number; total: number; clock?: string }> = ({ frame, total, clock }) => (
  <>
    <div style={{ position: "absolute", top: 228, left: 70, right: 70, height: 12, borderRadius: 6, background: "rgba(0,0,0,0.3)", border: `3px solid ${INK}`, overflow: "hidden" }}>
      <div style={{ width: `${(frame / total) * 100}%`, height: "100%", background: "#FFE600" }} />
    </div>
    <div style={{ position: "absolute", top: 262, left: 70, right: 70, display: "flex", justifyContent: "space-between" }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 50, color: "#fff", background: INK, borderRadius: 20, padding: "2px 24px 6px" }}>⏱ {mmss(frame / 30)}</div>
      {clock && <div style={{ fontFamily: FONT.sans, fontSize: 50, color: "#FFE600", background: INK, borderRadius: 20, padding: "2px 24px 6px" }}>{clock}</div>}
    </div>
  </>
);

// 전환: 지난 컷과 새 컷을 같이 그려서 섞는다
const Blend: React.FC<{ shots: BuiltShot[]; cur: number; frame: number; bf: number }> = ({ shots, cur, frame, bf }) => {
  const s = shots[cur];
  const f = frame - s.from;
  const prev = cur > 0 ? shots[cur - 1] : null;
  const tr = s.tr ?? "cut";
  const now = <ShotView s={s} f={f} bf={bf} />;
  if (!prev || f >= TRANS || tr === "cut" || tr === "flash") return <>{now}{tr === "flash" && f < 5 ? <AbsoluteFill style={{ background: "#fff", opacity: 1 - f / 5 }} /> : null}</>;
  const before = <ShotView s={prev} f={frame - prev.from} bf={bf} />;
  const p = f / TRANS;
  if (tr === "invert") return <AbsoluteFill style={{ filter: f < 3 ? "invert(1) contrast(1.4)" : undefined }}>{now}</AbsoluteFill>;
  if (tr === "whip") {
    const e = easeInOut(p);
    return (
      <>
        <AbsoluteFill style={{ transform: `translateX(${-e * 1300}px)`, filter: `blur(${e * 26}px)` }}>{before}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${(1 - e) * 1300}px)`, filter: `blur(${(1 - e) * 26}px)` }}>{now}</AbsoluteFill>
      </>
    );
  }
  if (tr === "zoom") {
    const e = easeOut(p);
    return (
      <>
        <AbsoluteFill style={{ transform: `scale(${1 + e * 2.6})`, opacity: 1 - e }}>{before}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${0.55 + 0.45 * e})`, opacity: clamp(e * 2) }}>{now}</AbsoluteFill>
      </>
    );
  }
  if (tr === "flip") {
    return (
      <AbsoluteFill style={{ perspective: 2200 }}>
        <AbsoluteFill style={{ transform: p < 0.5 ? `rotateY(${p * 180}deg)` : `rotateY(${-(1 - p) * 180}deg)`, background: INK }}>{p < 0.5 ? before : now}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // glitch: 가로 띠가 어긋나며 지난 컷과 섞인다
  const bands = 7;
  return (
    <>
      {Array.from({ length: bands }, (_, i) => {
        const fromPrev = rnd(f * 7 + i) < 1 - p;
        const dx = (rnd(f * 3 + i * 5) - 0.5) * 140 * (1 - p);
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${(i / bands) * 100}% 0 ${100 - ((i + 1) / bands) * 100}% 0)`, transform: `translateX(${dx}px)`, filter: i % 3 === 0 ? "hue-rotate(90deg) saturate(2)" : undefined }}>
            {fromPrev ? before : now}
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const defaultSfx = (s: BuiltShot): { n: string; v: number }[] => {
  const given = s.sfx ? (Array.isArray(s.sfx) ? s.sfx : [s.sfx]) : [];
  const out = given.map((n) => ({ n, v: 0.6 }));
  if (s.tr === "whip" || s.tr === "zoom" || s.tr === "flip") out.push({ n: "whoosh", v: 0.32 });
  if (!given.length && s.k !== "title") out.push({ n: "pop", v: 0.35 });
  return out;
};

export const Rush: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { shots, bf, durationInFrames } = React.useMemo(() => buildRush(theme), [theme]);
  let cur = 0;
  for (const s of shots) if (frame >= s.from) cur = s.idx;
  const s = shots[cur];
  const clock = theme.clock ? `${theme.clock.label} ${clockAt(shots, frame, theme.clock.from)}${theme.clock.unit ?? ""}` : undefined;
  const voiceFrames = shots.filter((x) => x.audio).map((x) => [x.from, x.from + 2 + x.speak] as const);

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(`bgm/${theme.id}.wav`)} volume={(f) => (voiceFrames.some(([a, b]) => f >= a - 2 && f <= b + 4) ? 0.07 : 0.2)} />
      {shots.map((x) => (
        <React.Fragment key={x.idx}>
          {x.audio && <Sequence from={x.from + 2} durationInFrames={x.speak + 6} layout="none"><Audio src={staticFile(x.audio)} volume={1} /></Sequence>}
          {defaultSfx(x).map((e, i) => <Sfx key={i} at={x.from} name={e.n} volume={e.v} />)}
        </React.Fragment>
      ))}
      <Blend shots={shots} cur={cur} frame={frame} bf={bf} />
      {s.k !== "title" && <Hud frame={frame} total={durationInFrames} clock={clock} />}
      <Finish frame={frame} />
    </AbsoluteFill>
  );
};
