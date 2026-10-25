// anime 엔진: 대사 음성 없이 연출 · 자막 · 배경음악으로 끌고 가는 일본 애니메이션풍 숏폼.
// 데이터는 rush 와 같은 content/rush/<id>.json (engine: "anime"), 타이밍도 rush 의 buildRush 를 쓴다.
// 배경음악 · 효과음은 scripts/anime-bgm.mjs 가 만든다.
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "../../components/common";
import { Finish, clamp, easeInOut, easeOut, rnd } from "../fx";
import { buildRush, type BuiltShot } from "../timeline";
import type { Theme } from "../types";
import { RED, RgbDefs, SpeedLines } from "./afx";
import { VIEWS } from "./views";

const LEN: Record<string, number> = { slash: 9, shutter: 10, whip: 8, zoom: 8, glitch: 7 };

const View: React.FC<{ s: BuiltShot; f: number; bf: number }> = ({ s, f, bf }) => {
  const V = VIEWS[s.k] ?? VIEWS.title;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <V s={s} f={f} bf={bf} />
    </AbsoluteFill>
  );
};

// 전환: 새 컷이 들어오는 동안 지난 컷을 같이 그린다
const Blend: React.FC<{ shots: BuiltShot[]; cur: number; frame: number; bf: number }> = ({ shots, cur, frame, bf }) => {
  const s = shots[cur];
  const f = frame - s.from;
  const prev = cur > 0 ? shots[cur - 1] : null;
  const tr = s.tr ?? "cut";
  const now = <View s={s} f={f} bf={bf} />;
  const n = LEN[tr] ?? 0;
  if (tr === "flash") return <>{now}{f < 6 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - f / 6 }} />}</>;
  if (tr === "invert") return <AbsoluteFill style={{ filter: f < 3 ? "invert(1) contrast(1.5)" : undefined }}>{now}</AbsoluteFill>;
  if (!prev || f >= n) return now;
  const before = <View s={prev} f={frame - prev.from} bf={bf} />;
  const p = f / n;

  // 칼로 긋기: 사선 칼날이 지나가며 새 컷을 드러낸다
  if (tr === "slash") {
    const e = easeInOut(p);
    const x = -700 + e * 2500; // 칼날 위쪽 끝의 x (아래쪽은 700px 왼쪽)
    return (
      <>
        <AbsoluteFill style={{ transform: `translateX(${-e * 90}px)` }}>{before}</AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `polygon(0 0, ${x}px 0, ${x - 700}px 100%, 0 100%)` }}>{now}</AbsoluteFill>
        <div style={{ position: "absolute", left: x - 350 - 1100, top: 960 - 6, width: 2200, height: 12, background: "#fff", boxShadow: `0 0 30px #fff, 0 0 60px ${RED}`, transform: "rotate(110deg)" }} />
      </>
    );
  }
  // 셔터: 위아래 검은 판이 닫혔다 열린다 (가운데 빨간 줄)
  if (tr === "shutter") {
    const closing = p < 0.5;
    const k = closing ? easeOut(p * 2) : 1 - easeOut((p - 0.5) * 2);
    return (
      <>
        {closing ? before : now}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960 * k, background: "#000" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 960 * k, background: "#000" }} />
        {k > 0.9 && <div style={{ position: "absolute", left: 0, right: 0, top: 955, height: 10, background: RED, boxShadow: `0 0 30px ${RED}` }} />}
      </>
    );
  }
  // 휙: 가로 모션 블러 + 속도선
  if (tr === "whip") {
    const e = easeInOut(p);
    return (
      <>
        <AbsoluteFill style={{ transform: `translateX(${-e * 1300}px)`, filter: `blur(${Math.sin(e * Math.PI) * 30}px)` }}>{before}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${(1 - e) * 1300}px)`, filter: `blur(${Math.sin(e * Math.PI) * 30}px)` }}>{now}</AbsoluteFill>
        <SpeedLines f={frame} opacity={Math.sin(e * Math.PI) * 0.8} />
      </>
    );
  }
  // 줌 펀치: 지난 컷이 덮치듯 커지며 사라지고 새 컷이 당겨진다 (중간에 번쩍)
  if (tr === "zoom") {
    const e = easeOut(p);
    return (
      <>
        <AbsoluteFill style={{ transform: `scale(${1 + e * 1.8})`, opacity: 1 - e, filter: `blur(${e * 20}px)` }}>{before}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${1.5 - 0.5 * e})`, opacity: clamp(e * 2.5), filter: `blur(${(1 - e) * 16}px)` }}>{now}</AbsoluteFill>
        <AbsoluteFill style={{ background: "#fff", opacity: Math.max(0, 0.8 - Math.abs(p - 0.3) * 3) }} />
      </>
    );
  }
  // 글리치: 가로 띠가 어긋나며 RGB 가 갈라진다
  const bands = 9;
  return (
    <AbsoluteFill style={{ filter: `url(#tr-rgb)` }}>
      <RgbDefs id="tr-rgb" d={Math.round(30 * (1 - p))} />
      {Array.from({ length: bands }, (_, i) => {
        const fromPrev = rnd(f * 7 + i) < 1 - p;
        const dx = (rnd(f * 3 + i * 5) - 0.5) * 220 * (1 - p);
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${(i / bands) * 100}% 0 ${100 - ((i + 1) / bands) * 100}% 0)`, transform: `translateX(${dx}px)` }}>
            {fromPrev ? before : now}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// 전환 · 연출에 맞춘 기본 효과음 (JSON 의 sfx 에 더해진다)
const autoSfx = (s: BuiltShot): { n: string; v: number }[] => {
  const given = s.sfx ? (Array.isArray(s.sfx) ? s.sfx : [s.sfx]) : [];
  const out = given.map((n) => ({ n, v: 0.55 }));
  if (s.tr === "slash") out.push({ n: "slash", v: 0.5 });
  if (s.tr === "whip" || s.tr === "zoom") out.push({ n: "whoosh", v: 0.4 });
  if (s.tr === "shutter") out.push({ n: "shutter", v: 0.5 });
  if (s.tr === "glitch") out.push({ n: "glitchfx", v: 0.4 });
  if (s.fx?.includes("impact")) out.push({ n: "impact", v: 0.75 });
  return out;
};

export const AnimeRush: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { shots, bf } = React.useMemo(() => buildRush(theme), [theme]);
  let cur = 0;
  for (const s of shots) if (frame >= s.from) cur = s.idx;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Audio src={staticFile(`bgm/${theme.id}.wav`)} volume={0.55} />
      {shots.map((x) => autoSfx(x).map((e, i) => <Sfx key={`${x.idx}-${i}`} at={x.from} name={e.n} volume={e.v} />))}
      <AbsoluteFill style={{ filter: "contrast(1.07) saturate(1.15)" }}>
        <Blend shots={shots} cur={cur} frame={frame} bf={bf} />
      </AbsoluteFill>
      <Finish frame={frame} />
    </AbsoluteFill>
  );
};
