import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { type Scene, type SceneLine, SceneVisual, findArt } from "./Scene";
import { FONT, GRAY, INK, PAPER, RED } from "./theme";

type Who = "narr" | "dad" | "kid" | "docu";

type Line = SceneLine & { text: string; voice: string; sfx?: string };

type Cut = {
  id: string;
  beat: string;
  image?: string;
  caption?: string;
  style?: string;
  scene?: Scene;
  art?: string;
  lines: Line[];
  from: number;
  duration: number;
};

type Timeline = { cuts: Cut[]; durationInFrames: number; rawVoice?: boolean };

// Heami는 SSML pitch를 거의 무시해서 렌더 단계에서 음높이를 바꾼다
const TONE: Record<Who, number> = { narr: 1, dad: 0.88, kid: 1.35, docu: 0.8 };
const SFX_VOLUME: Record<string, number> = { boing: 0.5, dudung: 0.8, page: 0.35, stinger: 0.45 };

const PANEL_H = 800;
const PANEL_W = Math.round((PANEL_H * 620) / 434);
const PANEL_LEFT = (1920 - PANEL_W) / 2;
const PANEL_TOP = 56;

const media = (episode: string, path: string) => staticFile(`${episode}/${path}`);

export const Episode: React.FC<{ episode: string; timeline: Timeline }> = ({ episode, timeline }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT }}>
      {timeline.cuts.map((cut) => (
        <Sequence key={cut.id + cut.from} from={cut.from} durationInFrames={cut.duration} premountFor={30}>
          <CutScene episode={episode} cut={cut} rawVoice={timeline.rawVoice} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const EpisodeCutStill: React.FC<{ episode: string; timeline: Timeline; cutId: string }> = ({
  episode,
  timeline,
  cutId,
}) => {
  const cut = timeline.cuts.find((c) => c.id === cutId) ?? timeline.cuts[0];
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT }}>
      <CutVisual episode={episode} cut={cut} frame={0} still />
    </AbsoluteFill>
  );
};

const CutScene: React.FC<{ episode: string; cut: Cut; rawVoice?: boolean }> = ({ episode, cut, rawVoice }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <CutVisual episode={episode} cut={cut} frame={frame} still={false} />
      {cut.lines.map((line) => (
        <React.Fragment key={line.id}>
          <Sequence from={line.from} durationInFrames={line.duration} layout="none">
            <Audio src={media(episode, line.voice)} toneFrequency={rawVoice ? 1 : (TONE[line.who as Who] ?? 1)} />
          </Sequence>
          {line.sfx ? (
            <Sequence from={Math.max(0, line.from - 4)} durationInFrames={60} layout="none">
              <Audio src={staticFile(`sfx/${line.sfx}.wav`)} volume={SFX_VOLUME[line.sfx]} />
            </Sequence>
          ) : null}
          {line.sfxAfter ? (
            <Sequence from={line.from + line.duration + 2} durationInFrames={45} layout="none">
              <Audio src={staticFile(`sfx/${line.sfxAfter}.wav`)} volume={SFX_VOLUME[line.sfxAfter]} />
            </Sequence>
          ) : null}
          <Sequence from={line.from} durationInFrames={line.duration + 8} layout="none">
            <Subtitle line={line} />
          </Sequence>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const CutVisual: React.FC<{ episode: string; cut: Cut; frame: number; still: boolean }> = ({
  episode,
  cut,
  frame,
  still,
}) => {
  const { fps } = useVideoConfig();
  if (cut.style === "triptych") return <Triptych episode={episode} cut={cut} frame={frame} still={still} />;
  if (cut.style === "end") return <EndCard episode={episode} cut={cut} frame={frame} still={still} />;

  if (cut.scene) return <SceneVisual episode={episode} cut={cut} frame={frame} still={still} />;

  const flashback = cut.style === "flashback";
  const enter = still ? 1 : interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const zoom = still ? 1.02 : interpolate(frame, [0, cut.duration], [1, 1.06]);
  const origins = ["50% 40%", "35% 50%", "65% 45%", "50% 60%"];
  const origin = origins[cut.id.charCodeAt(cut.id.length - 1) % origins.length];

  // "어... 그게..." 같은 삐끗 효과음에 맞춰 살짝 흔들기
  const boing = cut.lines.find((l) => l.sfx === "boing");
  const wiggle =
    boing && !still
      ? Math.sin((frame - boing.from) * 1.4) * interpolate(frame - boing.from, [0, 14], [2.2, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // 뚜둥: 화면 흔들림 + 큰 글자
  const dudungLine = cut.lines.find((l) => l.sfxAfter === "dudung");
  const dudungAt = dudungLine ? dudungLine.from + dudungLine.duration + 2 : -1;
  const sinceDudung = frame - dudungAt;
  const dudungActive = !still && dudungLine && sinceDudung >= 0 && sinceDudung < 34;
  const shake = dudungActive
    ? Math.sin(sinceDudung * 2.3) * interpolate(sinceDudung, [0, 8, 9, 20], [14, 0, 10, 0], { extrapolateRight: "clamp" })
    : 0;
  const dudungPop = dudungActive ? spring({ frame: sinceDudung, fps, config: { damping: 9, stiffness: 180 } }) : 0;

  const captionPop = still ? 1 : spring({ frame: frame - 8, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: enter }}>
      {cut.beat ? (
        <div style={{ position: "absolute", left: 44, top: 40, fontSize: 26, fontWeight: 700, color: flashback ? RED : GRAY, lineHeight: 1.3, width: PANEL_LEFT - 70 }}>
          {cut.beat}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT + shake,
          top: PANEL_TOP + (1 - enter) * 14,
          width: PANEL_W,
          height: PANEL_H,
          overflow: "hidden",
          border: flashback ? `5px dashed ${RED}` : `3px solid ${INK}`,
          boxSizing: "border-box",
          backgroundColor: PAPER,
          transform: `rotate(${wiggle}deg)`,
        }}
      >
        <Img
          src={media(episode, `cuts/${cut.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: origin,
            filter: flashback ? "sepia(0.7) saturate(0.6) contrast(0.85) brightness(1.05)" : undefined,
          }}
        />
        {flashback ? (
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,223,0) 45%, rgba(120,95,60,0.45) 100%)" }} />
        ) : null}
      </div>
      {cut.caption ? (
        <div
          style={{
            position: "absolute",
            left: PANEL_LEFT - 24,
            top: PANEL_TOP + 28,
            backgroundColor: RED,
            color: "#fff",
            fontSize: 42,
            fontWeight: 700,
            padding: "12px 26px",
            transform: `scale(${captionPop})`,
            transformOrigin: "left center",
            boxShadow: "6px 6px 0 rgba(21,48,58,0.25)",
          }}
        >
          {cut.caption}
        </div>
      ) : null}
      {dudungActive ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            textAlign: "center",
            fontSize: 190,
            fontWeight: 700,
            color: RED,
            WebkitTextStroke: `6px ${PAPER}`,
            paintOrder: "stroke",
            transform: `scale(${dudungPop}) rotate(-6deg)`,
            opacity: interpolate(sinceDudung, [24, 34], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          뚜둥!
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const TRIPTYCH = [
  { art: "prop/hotel", image: "panel06.png", name: "호텔", forWhom: "귀족을 위해" },
  { art: "prop/motel", image: "panel07.png", name: "모텔", forWhom: "자동차를 위해" },
  { art: "prop/hostel", image: "panel08.png", name: "유스호스텔", forWhom: "아이들을 위해" },
];

const Triptych: React.FC<{ episode: string; cut: Cut; frame: number; still: boolean }> = ({ episode, cut, frame, still }) => {
  const { fps } = useVideoConfig();
  const enter = still ? 1 : interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <div style={{ position: "absolute", left: 44, top: 40, fontSize: 26, fontWeight: 700, color: GRAY }}>{cut.beat}</div>
      {TRIPTYCH.map((item, i) => {
        const revealAt = cut.lines[i + 1]?.from ?? 0;
        const p = still ? 1 : spring({ frame: frame - revealAt, fps, config: { damping: 12 } });
        const on = still || frame >= revealAt;
        const art = findArt(episode, item.art);
        return (
          <div key={item.name} style={{ position: "absolute", left: 60 + i * 610, top: 130, width: 580 }}>
            <div
              style={{
                width: 580,
                height: 406,
                border: `3px solid ${on ? INK : "#C9C2B4"}`,
                boxSizing: "border-box",
                overflow: "hidden",
                opacity: on ? 1 : 0.35,
                filter: on ? undefined : "grayscale(1)",
              }}
            >
              <Img src={art?.src ?? media(episode, `cuts/${item.image}`)} style={{ width: "100%", height: "100%", objectFit: art ? "contain" : "cover" }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 26, opacity: on ? 1 : 0.3 }}>
              <div style={{ fontSize: 60, fontWeight: 700, color: INK }}>{item.name}</div>
              <div style={{ fontSize: 58, fontWeight: 700, color: RED, marginTop: 4, transform: `scale(${on ? p : 0})` }}>
                {item.forWhom}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ episode: string; cut: Cut; frame: number; still: boolean }> = ({ episode, cut, frame, still }) => {
  const fade = still
    ? 1
    : interpolate(frame, [0, 15, cut.duration - 30, cut.duration], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Img src={findArt(episode, cut.art)?.src ?? media(episode, `cuts/${cut.image}`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, filter: "grayscale(1) blur(8px)", transform: "scale(1.05)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: GRAY }}>여덟 살의 질문 · 1편</div>
        <div style={{ fontSize: 80, fontWeight: 700, color: INK, marginTop: 18 }}>호텔 · 모텔 · 유스호스텔</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: RED, marginTop: 40, backgroundColor: PAPER, padding: "10px 28px" }}>
          다음 편 — 아파트 · 빌라 · 오피스텔은 왜 이름이 다를까?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Subtitle: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4, line.duration + 2, line.duration + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoted = line.who === "dad" || line.who === "kid";
  const speaker = line.who === "kid" ? "아이" : line.who === "dad" ? "아빠" : null;
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: PANEL_TOP + PANEL_H + 18,
        height: 1080 - (PANEL_TOP + PANEL_H + 18) - 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity,
      }}
    >
      {speaker ? (
        <span style={{ fontSize: 30, fontWeight: 700, color: "#fff", backgroundColor: line.who === "kid" ? RED : INK, padding: "4px 14px", borderRadius: 6, flexShrink: 0 }}>
          {speaker}
        </span>
      ) : null}
      <span
        style={{
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.35,
          textAlign: "center",
          textWrap: "balance",
          color: line.who === "kid" ? RED : line.who === "docu" ? GRAY : INK,
          letterSpacing: line.who === "docu" ? 4 : 0,
        }}
      >
        {quoted ? `“${line.text}”` : line.text}
      </span>
    </div>
  );
};
