import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Motion, type MotionTimeline } from "../motion/Motion";
import { FONT, INK, PAPER, RED } from "../theme";

// 모답맨(모션 편집) 본편의 몇 구간을 이어 붙인 9:16 쇼츠 — 애프터이펙트식 액티브 편집.
// 뒤: 같은 장면을 크게 흐리게 깔아 화면을 꽉 채운다 / 가운데: 본편 화면(크게) / 아래: 단어 단위 큰 자막 / 위: 훅 → 제목 바.
// 구간이 바뀔 때마다 전환을 돌려 쓴다(휙 · 줌 블러 · RGB 글리치 · 플래시) + 효과음. 아래 약 350px 은 쇼츠 UI 자리.

const SRC_W = 1920;
const SRC_H = 1080;
const CROP_W = 1500; // 본편 좌우를 조금 잘라 크게 보인다
const SCALE = 1080 / CROP_W;
const VIEW_H = SRC_H * SCALE; // 778
const VIEW_TOP = 500;
const CAP_TOP = VIEW_TOP + VIEW_H + 40;
const TRANS = 12; // 구간 사이 전환 길이(프레임)
export const MOTION_END_CARD = 84;

export type MotionShortSpec = {
  id: string;
  series: string;
  hook: [string, string];
  title: string; // 훅이 줄어든 뒤 위에 남는 제목 바
  clips: { from: number; to: number }[]; // 본편 프레임 구간
  end: { title: [string, string]; sub: string };
  narr?: string; // 나레이션 이름표 (없으면 "모답맨", 내모남불은 "내모남불")
};

const KINDS = ["whip", "zoom", "glitch", "flash"] as const;
const WHO: Record<string, [string, string]> = {
  kid: ["아이", "#FF6F61"],
  dad: ["아빠", "#F2B705"],
  mom: ["엄마", "#7BC67E"],
  narr: ["모답맨", "#FFFFFF"],
  guide: ["해설사", "#5BC0EB"],
  traffic: ["교통경찰관", "#5BC0EB"],
  aptmgr: ["관리소장님", "#5BC0EB"],
  teller: ["은행 직원", "#2EC4B6"],
  buddy: ["아빠 친구", "#9BE564"],
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const motionShortLength = (spec: MotionShortSpec) =>
  spec.clips.reduce((a, c) => a + (c.to - c.from), 0) + MOTION_END_CARD;

// 쇼츠 프레임 → (몇 번째 구간, 구간 안 프레임, 본편 프레임)
const locate = (spec: MotionShortSpec, f: number) => {
  let at = 0;
  for (let i = 0; i < spec.clips.length; i++) {
    const c = spec.clips[i];
    const len = c.to - c.from;
    if (f < at + len) return { i, local: f - at, len, src: c.from + f - at, start: at };
    at += len;
  }
  return null;
};

// 구간 하나: 들어올 때 전환, 계속 천천히 당기는 카메라, 대사가 시작될 때마다 펀치 줌
const Clip: React.FC<{ timeline: MotionTimeline; from: number; len: number; kind: (typeof KINDS)[number]; first: boolean; blur?: boolean }> = ({ timeline, from, len, kind, first, blur }) => {
  const f = useCurrentFrame();
  const t = first ? 1 : interpolate(f, [0, TRANS], [0, 1], clamp);
  const e = 1 - Math.pow(1 - t, 3);
  const out = interpolate(f, [len - 5, len], [0, 1], clamp);
  const push = interpolate(f, [0, len], [1, 1.07]);
  const src = from + f;
  const lineStart = timeline.lines.filter((l) => l.from <= src && l.from > src - 10).map((l) => src - l.from)[0];
  const punch = lineStart == null ? 0 : (1 - lineStart / 10) * 0.05;
  let tf = "";
  let filter = "";
  if (!first) {
    if (kind === "whip") {
      tf = `translateX(${(1 - e) * 900}px) skewX(${(1 - e) * -12}deg)`;
      filter = `blur(${(1 - e) * 24}px)`;
    } else if (kind === "zoom") {
      tf = `scale(${1 + (1 - e) * 0.9}) rotate(${(1 - e) * 6}deg)`;
      filter = `blur(${(1 - e) * 20}px)`;
    } else if (kind === "glitch") {
      tf = `translateX(${f < TRANS ? Math.sin(f * 7) * (1 - e) * 60 : 0}px)`;
      filter = `saturate(${1 + (1 - e) * 2}) hue-rotate(${(1 - e) * 90}deg)`;
    } else {
      tf = `scale(${1 + (1 - e) * 0.15})`;
    }
  }
  tf += ` scale(${push + punch + out * 0.25})`;
  if (out > 0) filter += ` blur(${out * 10}px)`;
  if (blur) filter += " blur(36px) brightness(0.45) saturate(1.3)";
  return (
    <div style={{ position: "absolute", inset: 0, transform: tf, filter, transformOrigin: "50% 50%" }}>
      <Sequence from={-from} layout="none">
        <Motion timeline={timeline} noSubs noBgm />
      </Sequence>
      {!first && kind === "glitch" && f < TRANS ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,0,80,0.25)", mixBlendMode: "screen", transform: `translateX(${(1 - e) * 40}px)` }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,220,255,0.25)", mixBlendMode: "screen", transform: `translateX(${(1 - e) * -40}px)` }} />
        </>
      ) : null}
    </div>
  );
};

// 단어 단위 큰 자막: 읽는 만큼 단어가 튀어나오고 지금 단어는 노랑
const Caption: React.FC<{ timeline: MotionTimeline; src: number; narr?: string }> = ({ timeline, src, narr }) => {
  const { fps } = useVideoConfig();
  const line = timeline.lines.find((l) => src >= l.from && src < l.from + l.dur + 6);
  if (!line) return null;
  const words = line.text.split(" ");
  const total = line.text.replace(/\s/g, "").length || 1;
  const p = (src - line.from) / Math.max(1, line.dur);
  let acc = 0;
  const [name, color] = line.who === "narr" && narr ? [narr, "#FFFFFF"] : (WHO[line.who] ?? ["", "#fff"]);
  const pop = spring({ frame: src - line.from, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", top: CAP_TOP, left: 50, right: 50, textAlign: "center" }}>
      {name ? (
        <div style={{ display: "inline-block", marginBottom: 14, padding: "6px 22px", borderRadius: 999, background: color, color: INK, fontSize: 34, fontWeight: 900, transform: `scale(${pop})` }}>{name}</div>
      ) : null}
      <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 1.25, color: "#fff", WebkitTextStroke: "3px #000", paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(0,0,0,0.6)" }}>
        {words.map((w, k) => {
          const s = acc / total;
          acc += w.length;
          const end = acc / total;
          const shown = p >= s - 0.02;
          const now = p >= s && p < end;
          const wf = (p - s) * line.dur;
          const k2 = shown ? spring({ frame: Math.max(0, wf), fps, config: { damping: 10, stiffness: 260 } }) : 0;
          return (
            <span key={k} style={{ display: "inline-block", margin: "0 8px", opacity: shown ? 1 : 0, color: now ? "#FFD23F" : "#fff", transform: `translateY(${(1 - k2) * 30}px) scale(${0.6 + k2 * 0.4 + (now ? 0.08 : 0)})` }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const MotionShort: React.FC<{ timeline: MotionTimeline; spec: MotionShortSpec }> = ({ timeline, spec }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const body = durationInFrames - MOTION_END_CARD;
  const loc = locate(spec, frame);

  // 훅: 첫 2초 크게 → 제목 바로 줄어든다
  const hookIn = spring({ frame, fps, config: { damping: 11, stiffness: 180 } });
  const shrink = spring({ frame: frame - 66, fps, config: { damping: 16 } });
  const hookScale = (0.6 + hookIn * 0.4) * (1 - shrink * 0.45);
  const hookY = 150 - shrink * 60;
  const endIn = spring({ frame: frame - body, fps, config: { damping: 11 } });

  // 구간 경계 플래시
  const boundary = loc && loc.i > 0 ? loc.local : 99;
  const flash = interpolate(boundary, [0, 3, 8], [0.85, 0.5, 0], clamp);
  const shake = boundary < TRANS ? Math.sin(boundary * 3.1) * (TRANS - boundary) * 1.6 : 0;

  let at = 0;
  const clips = spec.clips.map((c, i) => {
    const len = c.to - c.from;
    const el = { i, at, len, from: c.from, kind: KINDS[(i - 1 + KINDS.length) % KINDS.length] };
    at += len;
    return el;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT, overflow: "hidden" }}>
      {/* 뒤: 흐린 꽉 찬 배경 */}
      <div style={{ position: "absolute", left: (1080 - SRC_W * (1920 / SRC_H)) / 2, top: 0, width: SRC_W, height: SRC_H, transform: `scale(${1920 / SRC_H})`, transformOrigin: "0 0" }}>
        {clips.map((c) => (
          <Sequence key={`b${c.i}`} from={c.at} durationInFrames={c.len} layout="none">
            <Clip timeline={timeline} from={c.from} len={c.len} kind={c.kind} first={c.i === 0} blur />
          </Sequence>
        ))}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,20,30,0.75) 0%, rgba(10,20,30,0.1) 30%, rgba(10,20,30,0.1) 60%, rgba(10,20,30,0.85) 100%)" }} />

      {/* 가운데: 본편 */}
      <div
        style={{
          position: "absolute",
          top: VIEW_TOP,
          left: 0,
          width: 1080,
          height: VIEW_H,
          overflow: "hidden",
          transform: `translate(${shake}px, ${shake * 0.4}px)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          borderTop: "6px solid #FFD23F",
          borderBottom: "6px solid #FFD23F",
        }}
      >
        <div style={{ width: SRC_W, height: SRC_H, transform: `translateX(${(-(SRC_W - CROP_W) / 2) * SCALE}px) scale(${SCALE})`, transformOrigin: "0 0" }}>
          {clips.map((c) => (
            <Sequence key={c.i} from={c.at} durationInFrames={c.len} layout="none">
              <Clip timeline={timeline} from={c.from} len={c.len} kind={c.kind} first={c.i === 0} />
            </Sequence>
          ))}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />

      {/* 자막 */}
      {loc ? <Caption timeline={timeline} src={loc.src} narr={spec.narr} /> : null}

      {/* 위: 진행 막대 · 훅 → 제목 바 */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(Math.min(frame, body) / body) * 100}%`, background: "#FFD23F" }} />
      <div style={{ position: "absolute", top: hookY, left: 0, right: 0, textAlign: "center", transform: `scale(${hookScale})`, transformOrigin: "50% 0" }}>
        <div style={{ display: "inline-block", fontSize: 40, fontWeight: 900, color: INK, background: "#FFD23F", borderRadius: 999, padding: "10px 32px", transform: `rotate(${-2 + Math.sin(frame / 9) * 1.5}deg)` }}>
          {spec.series}
        </div>
        <div style={{ marginTop: 22, fontWeight: 900, lineHeight: 1.1, WebkitTextStroke: "4px #000", paintOrder: "stroke fill" }}>
          <div style={{ fontSize: 86, color: PAPER }}>{shrink > 0.5 ? spec.title : spec.hook[0]}</div>
          {shrink > 0.5 ? null : <div style={{ fontSize: 98, color: "#FFD23F" }}>{spec.hook[1]}</div>}
        </div>
      </div>

      {/* 전환 효과음 */}
      {clips.slice(1).map((c) => (
        <Sequence key={`s${c.i}`} from={Math.max(0, c.at - 3)} durationInFrames={40} layout="none">
          <Audio src={staticFile(`sfx/${c.kind === "glitch" ? "scratch" : "whoosh"}.wav`)} volume={0.55} />
        </Sequence>
      ))}
      <Sequence from={body} durationInFrames={MOTION_END_CARD} layout="none">
        <Audio src={staticFile("sfx/stinger.wav")} volume={0.5} />
      </Sequence>
      {timeline.bgm ? (
        <Audio src={staticFile(`bgm/${timeline.bgm}.wav`)} loop volume={(f) => 0.12 * interpolate(f, [0, 10, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp)} />
      ) : null}

      {/* 끝 카드 */}
      {frame >= body ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(21,48,58,${interpolate(endIn, [0, 1], [0, 0.94])})` }}>
          <div style={{ position: "absolute", top: 560, left: 50, right: 50, textAlign: "center", transform: `scale(${0.5 + endIn * 0.5}) rotate(${(1 - endIn) * -8}deg)`, opacity: endIn }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: PAPER, lineHeight: 1.15 }}>{spec.end.title[0]}</div>
            <div style={{ fontSize: 112, fontWeight: 900, color: "#FFD23F", lineHeight: 1.15 }}>{spec.end.title[1]}</div>
            <div style={{ marginTop: 60, display: "inline-block", fontSize: 50, fontWeight: 900, color: INK, background: PAPER, borderRadius: 999, padding: "16px 40px", border: `5px solid ${RED}` }}>{spec.end.sub}</div>
            <div style={{ marginTop: 30, fontSize: 110, color: "#FFD23F", transform: `translateY(${Math.abs(Math.sin(frame / 5)) * 26}px)` }}>↓</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
