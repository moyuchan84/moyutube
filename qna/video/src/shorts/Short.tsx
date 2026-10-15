import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/BlackHanSans";
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SFX_VOLUME, TONE, type Timeline } from "../Episode";
import { type SceneCut, SceneVisual, findArt } from "../Scene";
import { INK, RED } from "../theme";
import { END_CARD, PRE, buildShort as buildShortJs } from "./short-timeline.js";

// 롱폼 대사를 골라 다시 엮은 9:16 쇼츠 (src/shorts/<epNN>.json 이 편집 계획).
// 롱폼 장면(Scene)을 세로로 따라가는 카메라 + 점프 컷 · 휙 전환 · 챕터 도장 · 단어 자막 · 끝 카드.
// 아래 약 330px 과 오른쪽 140px 은 쇼츠 UI(제목 · 버튼)가 덮는 자리라 중요한 글자를 두지 않는다.

const { fontFamily: DISPLAY } = loadFont("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });

const W = 1080;
const H = 1920;
const SRC_W = 1920;
const SRC_H = 1080;
const CENTER_Y = 820; // 장면 중심 높이
const YELLOW = "#FFD23F";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Cut = Timeline["cuts"][number];
type Line = Cut["lines"][number] & { cutin?: string; pop?: string; fx?: string };

export type ShortSegment = {
  line: string; // "c05-1" — 롱폼 대사 id
  chapter?: number; // topics 의 몇 번째 이야기가 시작되는지 (도장 + 위 목록 불)
  transition?: "whip" | "glitch"; // 이 조각이 들어올 때
  zoom?: number; // 화면 배율 (기본: 말하는 사람 1.6, 나레이션 1.35)
  cam?: number; // 카메라 가로 위치 0~1 (기본: 말하는 배우 · 없으면 천천히 훑기)
  hl?: string[]; // 자막에서 노랗게 칠할 단어 (띄어쓰기 단위, 부분 일치)
  pop?: string; // 큰 글자 (예: "?!")
  stamp?: { text: string; sub?: string }; // 대사 끝에 쾅 찍는 도장
  shake?: boolean;
  cutin?: boolean; // 롱폼의 얼굴 컷인을 쓸지 (기본 true)
  hold?: number; // 대사 뒤 추가로 머무는 프레임
};

export type ShortSpec = {
  id: string;
  episode: string;
  series: string;
  topics: string[];
  hook: [string, string];
  segments: ShortSegment[];
  end: { title: [string, string]; sub: string };
};

type Built = ShortSegment & { cut: Cut; li: Line; from: number; duration: number; inCut: number; chapterNow: number; sameCut: boolean; index: number };

export const buildShort = (timeline: Timeline, spec: ShortSpec) =>
  buildShortJs(timeline, spec) as { segments: Built[]; body: number; durationInFrames: number };

export const Short: React.FC<{ timeline: Timeline; spec: ShortSpec }> = ({ timeline, spec }) => {
  const frame = useCurrentFrame();
  const { segments, body, durationInFrames } = React.useMemo(() => buildShort(timeline, spec), [timeline, spec]);
  const current = segments.find((s) => frame >= s.from && frame < s.from + s.duration) ?? segments[segments.length - 1];
  const last = segments[segments.length - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: DISPLAY, overflow: "hidden" }}>
      {segments.map((s) => (
        <Sequence key={s.index} from={s.from} durationInFrames={s.duration} premountFor={20}>
          <Segment episode={spec.episode} seg={s} rawVoice={timeline.rawVoice} topics={spec.topics} />
        </Sequence>
      ))}
      <Sequence from={body} durationInFrames={END_CARD}>
        <EndCard episode={spec.episode} seg={last} spec={spec} />
      </Sequence>

      {frame < body ? <Header spec={spec} chapter={current.chapterNow} frame={frame} body={body} /> : null}
      <Sequence durationInFrames={Math.min(78, segments[0].duration)} layout="none">
        <Hook hook={spec.hook} />
      </Sequence>

      <Grain />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(5,15,20,0.55) 100%)", pointerEvents: "none" }} />

      {timeline.bgm ? (
        <Audio
          src={staticFile(`bgm/${timeline.bgm}.wav`)}
          loop
          loopVolumeCurveBehavior="extend"
          volume={(f) => interpolate(f, [0, 10, body - 5, body + 10, durationInFrames - 20, durationInFrames], [0, 0.12, 0.12, 0.3, 0.3, 0], clamp)}
        />
      ) : null}
      <Sfx at={0} name="stamp" />
      <Sfx at={body} name="stinger" />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? SFX_VOLUME[name] ?? 0.5} />
  </Sequence>
);

// 롱폼 컷에서 화면 글자(박자 · 캡션 · 큰 글자 · 컷인)를 빼고 장면만 남긴다 — 쇼츠는 그것들을 세로 화면에 맞춰 따로 그린다
const sceneOnly = (cut: Cut): SceneCut =>
  ({ ...cut, beat: "", caption: undefined, lines: cut.lines.map((l) => ({ ...l, cutin: undefined, pop: undefined })) }) as unknown as SceneCut;

const Segment: React.FC<{ episode: string; seg: Built; rawVoice?: boolean; topics: string[] }> = ({ episode, seg, rawVoice }) => {
  const frame = useCurrentFrame();
  const scene = React.useMemo(() => sceneOnly(seg.cut), [seg.cut]);
  const actors = seg.cut.scene?.actors ?? [];
  const speaker = actors.find((a) => a.id === seg.li.who);
  const t = interpolate(frame, [0, seg.duration], [0, 1], clamp);
  // 배우의 자리: 이 대사까지 나온 move(걸어가기)를 따른다
  const upto = seg.cut.lines.slice(0, seg.cut.lines.indexOf(seg.li) + 1) as Line[];
  const xOf = (a: { id: string; x: number }) =>
    upto.reduce((x, l) => ((l as { move?: Record<string, number> }).move?.[a.id] ?? x), a.x);

  // 카메라: 말하는 배우를 따라가고, 배우가 없으면 그림을 천천히 훑는다. 같은 컷이 이어지면 점프 컷처럼 배율을 바꾼다
  const baseZoom = seg.zoom ?? (speaker ? 1.6 : actors.length ? 1.35 : 1.15);
  const jump = seg.sameCut && seg.zoom == null ? (seg.index % 2 ? 1.4 : 1.15) : 1;
  const zoom = baseZoom * jump;
  // 배우 없는 그림: 조각마다 왼쪽 · 오른쪽을 번갈아 훑는다 (점프 컷이면 더 당겨서)
  const sweep = seg.index % 2 ? 0.66 - t * 0.14 : 0.34 + t * 0.14;
  const camX = seg.cam ?? (speaker ? xOf(speaker) : actors.length ? actors.reduce((a, b) => a + xOf(b), 0) / actors.length : jump > 1 ? sweep : 0.5);
  const half = W / 2 / zoom / SRC_W;
  const cx = Math.min(1 - half, Math.max(half, camX));

  // 강조 단어가 나올 때 화면을 살짝 당긴다
  const words = React.useMemo(() => timeWords(seg.li.text, seg.li.duration, seg.hl ?? []), [seg]);
  const punchAt = words.filter((w) => w.hl).map((w) => PRE + w.at);
  const punch = punchAt.reduce((acc, at) => acc + interpolate(frame - at, [0, 3, 14], [0, 0.045, 0], clamp), 0);
  const push = 1 + t * 0.05 + punch;

  // 들어오는 전환: 휙(가로 모션 블러) · 글리치(색 갈라짐)
  const tin = seg.transition ? interpolate(frame, [0, 8], [1, 0], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 }) : 0;
  const whipX = seg.transition === "whip" ? tin * 760 : 0;
  const blur = seg.transition === "whip" ? tin * 60 : 0;
  const glitch = seg.transition === "glitch" && frame < 14;

  // 흔들기: 도장 · shake
  const stampAt = PRE + seg.li.duration + 2;
  const sinceStamp = frame - stampAt;
  const shakeAmt =
    (seg.shake ? interpolate(frame, [PRE, PRE + 16], [16, 0], clamp) : 0) + (seg.stamp && sinceStamp >= 0 ? interpolate(sinceStamp, [0, 14], [22, 0], clamp) : 0);
  const shakeX = Math.sin(frame * 2.7) * shakeAmt;
  const shakeY = Math.cos(frame * 3.1) * shakeAmt * 0.6;

  const S = zoom * push;
  const left = W / 2 - cx * SRC_W * S + whipX + shakeX + (glitch ? (random(`g${frame}`) - 0.5) * 50 : 0);
  const top = CENTER_Y - (SRC_H / 2) * S + shakeY;
  const filterId = `mb${seg.index}`;
  const bg = findArt(episode, seg.cut.scene?.bg);

  const cutin = seg.cutin !== false && seg.li.cutin ? findArt(episode, seg.li.cutin) : null;
  const tone = rawVoice ? 1 : (TONE[seg.li.who as keyof typeof TONE] ?? 1);

  return (
    <AbsoluteFill>
      {/* 뒤: 같은 배경을 흐리게 */}
      {bg ? <Img src={bg.src} style={{ position: "absolute", inset: -80, width: W + 160, height: H + 160, objectFit: "cover", filter: "blur(40px) brightness(0.45) saturate(1.2)" }} /> : null}

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={filterId} x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: SRC_W,
          height: SRC_H,
          transform: `scale(${S})`,
          transformOrigin: "0 0",
          filter: `${blur > 0.5 ? `url(#${filterId}) ` : ""}contrast(1.06) saturate(1.12)${glitch ? ` hue-rotate(${(random(`h${frame}`) - 0.5) * 90}deg)` : ""}`,
          maskImage: "linear-gradient(transparent 0%, #000 7%, #000 93%, transparent 100%)",
        }}
      >
        <SceneVisual episode={episode} cut={scene} frame={seg.inCut + frame} still={false} bare />
      </div>

      {glitch ? <GlitchBars frame={frame} /> : null}
      {seg.transition ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(frame, [0, 1, 5], [0.9, 0.9, 0], clamp) }} /> : null}

      {cutin ? <CutIn src={cutin.src} fromLeft={seg.li.who === "kid"} since={frame - PRE} /> : null}
      {seg.pop ? <BigPop text={seg.pop} since={frame - PRE - Math.round(seg.li.duration * 0.55)} /> : null}

      <Captions words={words} who={seg.li.who} since={frame - PRE} duration={seg.li.duration} />
      {seg.stamp ? <Stamp stamp={seg.stamp} since={sinceStamp} /> : null}

      {/* 소리 */}
      <Sequence from={PRE} layout="none">
        <Audio src={staticFile(`${episode}/${seg.li.voice}`)} toneFrequency={tone} />
      </Sequence>
      {seg.li.sfx && seg.li.sfx !== "page" ? <Sfx at={PRE - 3} name={seg.li.sfx} /> : null}
      {seg.transition === "whip" ? <Sfx at={0} name="whoosh" /> : null}
      {seg.transition === "glitch" ? <Sfx at={0} name="rewind" volume={0.35} /> : null}
      {seg.stamp ? <Sfx at={stampAt} name="stamp" /> : null}
      {seg.pop ? <Sfx at={PRE + Math.round(seg.li.duration * 0.55)} name="pop" /> : null}
      {cutin ? <Sfx at={PRE} name="pop" volume={0.35} /> : null}
      {seg.chapter != null ? <ChapterSlam n={seg.chapter} /> : null}
    </AbsoluteFill>
  );
};

// ── 자막: 대사를 몇 단어씩 끊어 띄우고, 지금 읽는 단어에 불을 켠다 ──

type Word = { text: string; at: number; hl: boolean; chunk: number };

const timeWords = (text: string, duration: number, hl: string[]): Word[] => {
  const raw = text.split(/\s+/).filter(Boolean);
  const weight = (w: string) => Math.max(1, w.replace(/[^\p{L}\p{N}]/gu, "").length);
  const total = raw.reduce((a, w) => a + weight(w), 0);
  const speak = duration * 0.92;
  let acc = 0;
  let chunk = 0;
  let chunkLen = 0;
  let chunkWords = 0;
  return raw.map((w) => {
    const len = weight(w);
    if (chunkWords > 0 && (chunkLen + len > 9 || chunkWords >= 3)) {
      chunk += 1;
      chunkLen = 0;
      chunkWords = 0;
    }
    chunkLen += len;
    chunkWords += 1;
    const word = { text: w, at: Math.round((acc / total) * speak), hl: hl.some((h) => w.includes(h) || h.includes(w)), chunk };
    acc += len;
    // 쉼표 · 마침표 뒤에서는 자막을 끊는다
    if (/[,.?!…]$/.test(w)) chunkLen = 99;
    return word;
  });
};

const SPEAKER: Record<string, { name: string; color: string }> = {
  dad: { name: "아빠", color: INK },
  kid: { name: "아이", color: RED },
  granny: { name: "할머니", color: "#8A5A2B" },
};

const Captions: React.FC<{ words: Word[]; who: string; since: number; duration: number }> = ({ words, who, since, duration }) => {
  const { fps } = useVideoConfig();
  if (since < 0 || since > duration + 6) return null;
  const spoken = words.filter((w) => w.at <= since);
  const now = spoken[spoken.length - 1] ?? words[0];
  const chunk = words.filter((w) => w.chunk === now.chunk);
  const chunkStart = chunk[0].at;
  const p = spring({ frame: since - chunkStart, fps, config: { damping: 11, stiffness: 220 } });
  const speaker = SPEAKER[who];
  const out = interpolate(since, [duration + 1, duration + 6], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1200, textAlign: "center", opacity: out }}>
      {speaker ? (
        <div style={{ display: "inline-block", fontSize: 40, color: "#fff", backgroundColor: speaker.color, padding: "6px 22px 2px", borderRadius: 12, marginBottom: 14, border: "4px solid #fff" }}>
          {speaker.name}
        </div>
      ) : null}
      <div style={{ transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) translateY(${(1 - p) * 30}px)`, lineHeight: 1.18 }}>
        {chunk.map((w) => {
          const live = w === now;
          const said = w.at <= since;
          const color = w.hl ? YELLOW : live ? "#fff" : said ? "#fff" : "rgba(255,255,255,0.55)";
          const wp = live ? spring({ frame: since - w.at, fps, config: { damping: 9, stiffness: 260 } }) : 1;
          return (
            <span
              key={w.text + w.at}
              style={{
                display: "inline-block",
                margin: "0 16px",
                fontSize: w.hl ? 104 : 92,
                color,
                WebkitTextStroke: `16px ${INK}`,
                paintOrder: "stroke fill",
                textShadow: "0 10px 0 rgba(0,0,0,0.35)",
                transform: `scale(${live ? interpolate(wp, [0, 1], [1.25, 1.06]) : 1}) rotate(${w.hl && live ? -2 : 0}deg)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── 위: 시리즈 · 오늘의 세 단어 (지금 이야기에 불) · 진행 막대 ──

const Header: React.FC<{ spec: ShortSpec; chapter: number; frame: number; body: number }> = ({ spec, chapter, frame, body }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * -40}px)` }}>
      <div style={{ display: "inline-flex", gap: 14, alignItems: "center", backgroundColor: "rgba(21,48,58,0.82)", padding: "14px 26px", borderRadius: 22 }}>
        {spec.topics.map((topic, i) => {
          const on = i === chapter;
          const done = i < chapter;
          const hidden = i > chapter && i === spec.topics.length - 1 && chapter >= 0;
          return (
            <React.Fragment key={topic}>
              {i ? <span style={{ fontSize: 36, color: "rgba(255,255,255,0.5)" }}>vs</span> : null}
              <span
                style={{
                  fontSize: 48,
                  padding: "4px 16px 0",
                  borderRadius: 12,
                  color: on ? INK : done ? "#fff" : "rgba(255,255,255,0.7)",
                  backgroundColor: on ? YELLOW : "transparent",
                  transform: `scale(${on ? 1.08 : 1})`,
                  display: "inline-block",
                }}
              >
                {hidden ? "???" : topic}
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ margin: "16px auto 0", width: 520, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(1, frame / body) * 100}%`, height: "100%", backgroundColor: YELLOW }} />
      </div>
    </div>
  );
};

// ── 첫 2초: 훅 문구가 쾅 ──

const Hook: React.FC<{ hook: [string, string] }> = ({ hook }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const b = spring({ frame: frame - 6, fps, config: { damping: 8, stiffness: 180 } });
  const out = interpolate(frame, [62, 78], [1, 0], clamp);
  const jitter = frame < 10 ? (random(`j${frame}`) - 0.5) * 14 : 0;
  const big = (text: string, size: number, color: string, scale: number) => (
    <div style={{ position: "relative", fontSize: size, lineHeight: 1.1, transform: `scale(${scale})` }}>
      {frame < 14 ? (
        <>
          <span style={{ position: "absolute", left: 0, right: 0, color: "#FF2E63", transform: `translate(${-8 + jitter}px, 0)`, mixBlendMode: "screen", opacity: 0.8 }}>{text}</span>
          <span style={{ position: "absolute", left: 0, right: 0, color: "#08D9D6", transform: `translate(${8 - jitter}px, 0)`, mixBlendMode: "screen", opacity: 0.8 }}>{text}</span>
        </>
      ) : null}
      <span style={{ position: "relative", color, WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", textShadow: "0 12px 0 rgba(0,0,0,0.4)" }}>{text}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(frame, [0, 4, 30], [0.75, 0.5, 0.25], clamp) }} />
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", transform: `rotate(-3deg) translateX(${jitter}px)` }}>
        {big(hook[0], 96, "#fff", interpolate(a, [0, 1], [2.2, 1]))}
        {big(hook[1], 170, YELLOW, interpolate(b, [0, 1], [2.6, 1]))}
      </div>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(frame, [0, 3], [0.9, 0], clamp) }} />
    </AbsoluteFill>
  );
};

// ── 챕터 도장: ① 호텔 ──

const ChapterSlam: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: { damping: 9, stiffness: 200 } });
  const out = interpolate(frame, [30, 40], [0, 1], clamp);
  if (frame > 40) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${-out * 220}px) scale(${interpolate(p, [0, 1], [3, 1]) * (1 - out * 0.5)}) rotate(${-4 + out * 4}deg)`,
          opacity: (1 - out) * Math.min(1, p * 2),
        }}
      >
        <span style={{ display: "inline-block", fontSize: 150, color: INK, backgroundColor: YELLOW, padding: "18px 56px 4px", borderRadius: 28, border: `10px solid ${INK}`, boxShadow: "0 16px 0 rgba(0,0,0,0.35)" }}>
          {["첫째", "둘째", "셋째", "넷째"][n] ?? `${n + 1}`}
        </span>
      </div>
      <Sfx at={2} name="stamp" volume={0.55} />
    </>
  );
};

const BigPop: React.FC<{ text: string; since: number }> = ({ text, since }) => {
  const { fps } = useVideoConfig();
  if (since < 0 || since > 40) return null;
  const p = spring({ frame: since, fps, config: { damping: 8, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 300,
        color: YELLOW,
        WebkitTextStroke: `20px ${INK}`,
        paintOrder: "stroke fill",
        transform: `scale(${p}) rotate(${-8 + Math.sin(since * 0.5) * 3}deg)`,
        opacity: interpolate(since, [30, 40], [1, 0], clamp),
      }}
    >
      {text}
    </div>
  );
};

const Stamp: React.FC<{ stamp: { text: string; sub?: string }; since: number }> = ({ stamp, since }) => {
  const { fps } = useVideoConfig();
  if (since < 0) return null;
  const p = spring({ frame: since, fps, config: { damping: 12, stiffness: 300 } });
  const sub = spring({ frame: since - 8, fps, config: { damping: 12 } });
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: RED, opacity: interpolate(since, [0, 2, 10], [0.5, 0.5, 0.12], clamp) }} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 230,
            color: "#fff",
            backgroundColor: RED,
            border: "14px solid #fff",
            borderRadius: 40,
            padding: "10px 70px 0",
            transform: `scale(${interpolate(p, [0, 1], [2.8, 1])}) rotate(-10deg)`,
            boxShadow: "0 20px 0 rgba(0,0,0,0.4)",
            opacity: Math.min(1, p * 3),
          }}
        >
          {stamp.text}
        </div>
        {stamp.sub ? (
          <div style={{ display: "inline-block", marginTop: 60, fontSize: 74, color: YELLOW, backgroundColor: INK, padding: "18px 40px 8px", borderRadius: 20, transform: `translateY(${(1 - sub) * 60}px)`, opacity: sub }}>
            {stamp.sub}
          </div>
        ) : null}
      </div>
    </>
  );
};

const CutIn: React.FC<{ src: string; fromLeft: boolean; since: number }> = ({ src, fromLeft, since }) => {
  const { fps } = useVideoConfig();
  if (since < 0 || since > 44) return null;
  const p = spring({ frame: since, fps, config: { damping: 11, stiffness: 170 } });
  const out = interpolate(since, [36, 44], [0, 1], clamp);
  const size = 640;
  const off = (1 - p + out) * (size + 120);
  return (
    <div style={{ position: "absolute", top: 330, width: size, height: size, ...(fromLeft ? { left: 10 - off } : { right: 10 - off }) }}>
      <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `repeating-conic-gradient(${YELLOW} 0deg 9deg, #FFB000 9deg 18deg)`, transform: `rotate(${since * 2}deg) scale(${p})`, border: `8px solid ${INK}` }} />
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", transform: `rotate(${Math.sin(since * 1.1) * 3}deg)`, maskImage: "linear-gradient(#000 82%, transparent 97%)" }} />
    </div>
  );
};

const GlitchBars: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ mixBlendMode: "screen" }}>
    {Array.from({ length: 7 }, (_, i) => {
      const y = random(`y${frame}-${i}`) * H;
      const h = 10 + random(`h${frame}-${i}`) * 70;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: y,
            left: (random(`x${frame}-${i}`) - 0.5) * 120,
            width: W,
            height: h,
            backgroundColor: i % 2 ? "rgba(255,46,99,0.45)" : "rgba(8,217,214,0.45)",
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// 필름 입자: 프레임마다 바뀌는 잔 노이즈
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(frame / 2) % 50} />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// ── 끝 카드: 질문을 남기고 본편으로 ──

const EndCard: React.FC<{ episode: string; seg: Built; spec: ShortSpec }> = ({ episode, seg, spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = React.useMemo(() => sceneOnly(seg.cut), [seg.cut]);
  const a = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 180 } });
  const b = spring({ frame: frame - 14, fps, config: { damping: 9, stiffness: 180 } });
  const c = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const zoom = 1.35 + frame * 0.002;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: W / 2 - 0.5 * SRC_W * zoom,
          top: CENTER_Y - (SRC_H / 2) * zoom,
          width: SRC_W,
          height: SRC_H,
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          filter: `blur(${interpolate(frame, [0, 12], [0, 14], clamp)}px) brightness(0.5)`,
        }}
      >
        <SceneVisual episode={episode} cut={scene} frame={seg.inCut + seg.duration} still={false} bare />
      </div>
      <div style={{ position: "absolute", top: 330, left: 40, right: 40, textAlign: "center" }}>
        <div style={{ fontSize: 44, color: "rgba(255,255,255,0.85)", opacity: a }}>{spec.series}</div>
        <div style={{ marginTop: 40, fontSize: 104, lineHeight: 1.15, color: "#fff", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", transform: `scale(${interpolate(a, [0, 1], [1.8, 1])})`, opacity: Math.min(1, a * 2) }}>
          {spec.end.title[0]}
        </div>
        <div style={{ fontSize: 122, lineHeight: 1.15, color: YELLOW, WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", transform: `scale(${interpolate(b, [0, 1], [2, 1])}) rotate(-2deg)`, opacity: Math.min(1, b * 2) }}>
          {spec.end.title[1]}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 90,
            fontSize: 64,
            color: INK,
            backgroundColor: "#fff",
            padding: "20px 46px 10px",
            borderRadius: 999,
            border: `8px solid ${YELLOW}`,
            transform: `scale(${c * (1 + Math.sin(frame * 0.25) * 0.04)})`,
          }}
        >
          ▶ {spec.end.sub}
        </div>
      </div>
      {/* 쇼츠 아래 '관련 동영상' 링크 쪽을 가리킨다 */}
      <div style={{ position: "absolute", left: 110, top: 1380 + Math.abs(Math.sin(frame * 0.18)) * 40, fontSize: 170, color: YELLOW, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", opacity: c }}>
        ↓
      </div>
      <Sfx at={14} name="pop" />
    </AbsoluteFill>
  );
};
