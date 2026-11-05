import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont as loadMyeongjo } from "@remotion/google-fonts/NanumMyeongjo";
import { loadFont as loadDodum } from "@remotion/google-fonts/GowunDodum";
import { loadFont as loadDokdo } from "@remotion/google-fonts/EastSeaDokdo";
import { ENTER_FRAMES, Ep, FPS, Shot, TextItem, starts } from "./timeline";

const { fontFamily: MYEONGJO } = loadMyeongjo("normal", { weights: ["400", "700", "800"] });
const { fontFamily: DODUM } = loadDodum();
const { fontFamily: DOKDO } = loadDokdo();

const PAPER = "#F4F1EA";
const INK = "#111111";
const W = 1080;
const H = 1920;

const ease = (k?: Shot["ease"]) => (k === "linear" ? Easing.linear : k === "out" ? Easing.out(Easing.cubic) : Easing.inOut(Easing.sin));

// ── 글자 ────────────────────────────────────────
const Narration: React.FC<{ t: TextItem; p: number }> = ({ t, p }) => (
  <div
    style={{
      position: "absolute",
      left: (t.x ?? W / 2) - 420,
      top: (t.y ?? 330) - 60,
      width: 840,
      display: "flex",
      justifyContent: "center",
      opacity: p,
      transform: `translateY(${(1 - p) * 10}px)`,
    }}
  >
    <div
      style={{
        background: INK,
        color: PAPER,
        fontFamily: MYEONGJO,
        fontWeight: 700,
        fontSize: t.size ?? 46,
        lineHeight: 1.45,
        padding: "22px 38px",
        textAlign: "center",
        whiteSpace: "pre-line",
        letterSpacing: -0.5,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.25)",
      }}
    >
      {t.text}
    </div>
  </div>
);

const Bubble: React.FC<{ t: TextItem; p: number }> = ({ t, p }) => {
  const whisper = t.kind === "whisper";
  const shout = t.kind === "shout";
  const size = t.size ?? (whisper ? 40 : shout ? 64 : 50);
  const x = t.x ?? W / 2;
  const y = t.y ?? 1350;
  const sc = interpolate(p, [0, 1], [0.86, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${sc})`,
        opacity: p,
      }}
    >
      <div
        style={{
          position: "relative",
          background: "white",
          border: whisper ? `4px dashed ${INK}` : `${shout ? 7 : 5}px solid ${INK}`,
          borderRadius: shout ? 18 : 999,
          padding: whisper ? "26px 44px" : "30px 54px",
          fontFamily: DODUM,
          fontWeight: 700,
          fontSize: size,
          color: INK,
          whiteSpace: "pre",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 900,
        }}
      >
        {t.text}
        {t.tail !== "none" && (
          <svg
            width={60}
            height={60}
            style={{ position: "absolute", bottom: -50, [t.tail === "r" ? "right" : "left"]: 70, overflow: "visible" } as React.CSSProperties}
          >
            <path
              d={t.tail === "r" ? "M10 0 L52 52 L44 0 Z" : "M50 0 L8 52 L16 0 Z"}
              fill="white"
              stroke={INK}
              strokeWidth={whisper ? 4 : 5}
              strokeDasharray={whisper ? "8 6" : undefined}
            />
            <rect x={t.tail === "r" ? 6 : 12} y={-8} width={44} height={12} fill="white" />
          </svg>
        )}
      </div>
    </div>
  );
};

const SfxText: React.FC<{ t: TextItem; p: number }> = ({ t, p }) => {
  const sc = interpolate(p, [0, 0.4, 1], [1.6, 0.95, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: t.x ?? W / 2,
        top: t.y ?? 700,
        transform: `translate(-50%,-50%) rotate(${t.rot ?? -8}deg) scale(${sc})`,
        fontFamily: DOKDO,
        fontSize: t.size ?? 230,
        color: INK,
        WebkitTextStroke: `10px ${PAPER}`,
        paintOrder: "stroke",
        opacity: Math.min(1, p * 3),
        whiteSpace: "pre",
      }}
    >
      {t.text}
    </div>
  );
};

const Card: React.FC<{ t: TextItem; p: number }> = ({ t, p }) => {
  const [q, sub] = t.text.split("\n|\n");
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: t.y ?? 1180, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ background: PAPER, border: `5px solid ${INK}`, padding: "34px 40px", boxShadow: "10px 10px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontFamily: DODUM, fontWeight: 700, fontSize: 46, color: INK, lineHeight: 1.35, whiteSpace: "pre-line" }}>💬 {q}</div>
        <div style={{ height: 4, background: INK, margin: "24px 0", opacity: 0.85 }} />
        <div style={{ fontFamily: MYEONGJO, fontWeight: 700, fontSize: 38, color: INK, lineHeight: 1.45, whiteSpace: "pre-line" }}>{sub}</div>
      </div>
    </div>
  );
};

const Title: React.FC<{ t: TextItem; f: number }> = ({ t, f }) => {
  const [main, sub] = t.text.split("\n");
  const p = interpolate(f, [0, 24], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const drop = interpolate(f, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div
          style={{
            fontFamily: MYEONGJO,
            fontWeight: 800,
            fontSize: 132,
            color: INK,
            letterSpacing: 6,
            clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
          }}
        >
          {main}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -34,
            width: 26 + drop * 34,
            height: 26 + drop * 34,
            marginLeft: -(13 + drop * 17),
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "#2F6FD6",
            opacity: drop * 0.95,
            filter: `blur(${(1 - drop) * 2 + 0.5}px)`,
            transform: `translateY(${(1 - drop) * -60}px)`,
          }}
        />
        <div style={{ fontFamily: MYEONGJO, fontWeight: 700, fontSize: 48, color: INK, marginTop: 40, opacity: drop, letterSpacing: 4 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const textP = (f: number, t: TextItem, shotFrames: number) => {
  const a = Math.round((t.at ?? 0) * FPS);
  const b = t.dur != null ? a + Math.round(t.dur * FPS) : shotFrames + 30;
  const inF = t.kind === "sfx" ? 6 : 8;
  if (f < a || f > b) return 0;
  return Math.min(interpolate(f, [a, a + inF], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [b - 6, b], [1, 0], { extrapolateLeft: "clamp" }));
};

// 집중선: 화면 가장자리에서 한 점으로 모이는 먹선, 2프레임마다 새로 뿌린다
const SpeedLines: React.FC<{ f: number; idx: number; cx: number; cy: number }> = ({ f, idx, cx, cy }) => {
  const seed = Math.floor(f / 2);
  const lines = Array.from({ length: 70 }, (_, i) => {
    const a = random(`a${idx}-${seed}-${i}`) * Math.PI * 2;
    const inner = 380 + random(`i${idx}-${seed}-${i}`) * 260;
    const w = 3 + random(`w${idx}-${seed}-${i}`) * 9;
    const R = 1500;
    const x1 = cx + Math.cos(a) * inner, y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a - w / 900) * R, y2 = cy + Math.sin(a - w / 900) * R;
    const x3 = cx + Math.cos(a + w / 900) * R, y3 = cy + Math.sin(a + w / 900) * R;
    return `M${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)} L${x3.toFixed(0)} ${y3.toFixed(0)} Z`;
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
      <path d={lines.join(" ")} fill={INK} />
    </svg>
  );
};

// ── 샷 ─────────────────────────────────────────
const ShotView: React.FC<{ s: Shot; frames: number; idx: number; assets?: string[] }> = ({ s, frames, idx, assets }) => {
  const has = (p?: string) => !!p && (!assets || assets.includes(p));
  const f = useCurrentFrame();
  const total = frames + (ENTER_FRAMES[s.enter ?? "cut"] ? 0 : 0);
  const k = interpolate(f, [0, total], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease(s.ease) });
  const from = { s: 1.06, x: 0, y: 0, r: 0, ...s.from };
  const to = { ...from, ...s.to };
  const sc = from.s + (to.s - from.s) * k;
  let x = from.x + (to.x - from.x) * k;
  let y = from.y + (to.y - from.y) * k;
  const r = from.r + (to.r - from.r) * k + (s.fx?.includes("dutch") ? -6 : 0);

  // 흔들림
  for (const at of s.shakeAt ?? []) {
    const a = Math.round(at * FPS);
    const big = s.fx?.includes("bigshake");
    const len = big ? 10 : 6;
    if (f >= a && f < a + len) {
      const amp = (big ? 34 : 16) * (1 - (f - a) / len);
      x += (random(`sx${idx}${f}`) - 0.5) * 2 * amp;
      y += (random(`sy${idx}${f}`) - 0.5) * 2 * amp;
    }
  }
  // 네거 플래시 (3프레임)
  const neg = (s.negAt ?? []).some((at) => f >= Math.round(at * FPS) && f < Math.round(at * FPS) + 3);

  // 들어오기 전환
  const enter = s.enter ?? "cut";
  const ef = ENTER_FRAMES[enter];
  let clip: string | undefined;
  let overlay: React.ReactNode = null;
  if (enter === "ink" && f < ef) {
    // 먹 붓질로 쓸고 지나가는 느낌: 기울어진 경계가 왼쪽→오른쪽
    const p = interpolate(f, [0, ef], [0, 1], { easing: Easing.inOut(Easing.cubic) });
    const e = -300 + p * (W + 600);
    clip = `polygon(0 0, ${e + 200}px 0, ${e - 200}px 100%, 0 100%)`;
    overlay = (
      <div style={{ position: "absolute", top: -200, bottom: -200, left: e - 260, width: 120, background: INK, transform: "skewX(-12deg)", opacity: 0.9, filter: "blur(6px)" }} />
    );
  }
  let wash = 0;
  let washColor = PAPER;
  if (enter === "burn" && f < ef) wash = interpolate(f, [0, ef], [1, 0], { easing: Easing.out(Easing.quad) });
  if (enter === "black" && f < ef) { wash = interpolate(f, [0, ef], [1, 0]); washColor = INK; }
  if (enter === "fade" && f < ef) wash = interpolate(f, [0, ef], [1, 0]);
  let shutter = 0;
  if (enter === "shutter" && f < ef) shutter = interpolate(f, [0, ef / 2, ef], [0, 1, 0]);

  // 색 판 번짐
  let colorEl: React.ReactNode = null;
  if (s.color && has(s.color.img)) {
    const a = Math.round((s.color.at ?? 0.6) * FPS);
    const d = Math.round((s.color.dur ?? 1.6) * FPS);
    const p = interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const rad = p * 160;
    colorEl = (
      <Img
        src={staticFile(s.color.img)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          WebkitMaskImage: `radial-gradient(circle at ${s.color.ox ?? 50}% ${s.color.oy ?? 50}%, black ${rad}%, transparent ${rad + 12}%)`,
          maskImage: `radial-gradient(circle at ${s.color.ox ?? 50}% ${s.color.oy ?? 50}%, black ${rad}%, transparent ${rad + 12}%)`,
        }}
      />
    );
  }

  // 임팩트 순간 확대(펀치 줌)
  const punch = (s.punchAt ?? []).reduce((acc, at) => {
    const a = Math.round(at * FPS);
    return f >= a && f < a + 9 ? acc + 0.12 * (1 - (f - a) / 9) : acc;
  }, 0);

  const grain = s.fx?.includes("grain");
  return (
    <AbsoluteFill style={{ background: s.bg === "black" ? INK : PAPER, clipPath: clip, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${sc + punch}) rotate(${r}deg)`, filter: neg ? "invert(1)" : undefined }}>
        {s.img && has(s.img) && <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        {s.img && !has(s.img) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", border: "16px dashed #999" }}>
            <div style={{ fontFamily: DODUM, fontSize: 60, color: "#888" }}>그림 준비 중 · {s.img.split("/").pop()?.replace(".jpg", "")}</div>
          </AbsoluteFill>
        )}
        {colorEl}
      </AbsoluteFill>
      {s.fx?.includes("speed") && <SpeedLines f={f} idx={idx} cx={s.speedAt?.[0] ?? 540} cy={s.speedAt?.[1] ?? 960} />}
      {grain && (
        <AbsoluteFill
          style={{
            backgroundImage: `url(${staticFile("comics/grain.png")})`,
            backgroundPosition: `${Math.floor(random(`g${f}`) * 400)}px ${Math.floor(random(`h${f}`) * 400)}px`,
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />
      )}
      {(grain || s.fx?.includes("vignette")) && (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      )}
      {(s.texts ?? []).map((t, i) => {
        if (t.kind === "title") return <Title key={i} t={t} f={f - Math.round((t.at ?? 0) * FPS)} />;
        const p = textP(f, t, frames);
        if (p <= 0) return null;
        if (t.kind === "nar") return <Narration key={i} t={t} p={p} />;
        if (t.kind === "sfx") return <SfxText key={i} t={t} p={interpolate(f - Math.round((t.at ?? 0) * FPS), [0, 8], [0, 1], { extrapolateRight: "clamp" })} />;
        if (t.kind === "card") return <Card key={i} t={t} p={p} />;
        return <Bubble key={i} t={t} p={p} />;
      })}
      {overlay}
      {wash > 0 && <AbsoluteFill style={{ background: washColor, opacity: wash }} />}
      {shutter > 0 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: (H / 2) * shutter, background: INK }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (H / 2) * shutter, background: INK }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ── 소리 ───────────────────────────────────────
const trackVol = (t: Ep["tracks"][number]) => (f: number) => {
  const a = t.from * FPS;
  const b = t.to * FPS;
  const fi = (t.fadeIn ?? 1) * FPS;
  const fo = (t.fadeOut ?? 1.5) * FPS;
  const g = Math.min(1, (f + 1) / Math.max(1, fi), (b - a - f) / Math.max(1, fo));
  return Math.max(0, g) * t.vol;
};

export const Episode: React.FC<{ ep: Ep }> = ({ ep }) => {
  const st = starts(ep);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {ep.shots.map((s, i) => {
        const frames = Math.round(s.dur * FPS);
        return (
          <Sequence key={i} from={st[i]} durationInFrames={frames}>
            <ShotView s={s} frames={frames} idx={i} assets={ep.assets} />
            {(s.sfx ?? []).map((x, j) => (
              <Sequence key={j} from={Math.round((x.at ?? 0) * FPS)} durationInFrames={x.dur ? Math.round(x.dur * FPS) : undefined}>
                <Audio src={staticFile(`audio/${x.name}.wav`)} volume={x.vol ?? 0.8} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {ep.tracks.map((t, i) => (
        <Sequence key={`t${i}`} from={Math.round(t.from * FPS)} durationInFrames={Math.round((t.to - t.from) * FPS)}>
          <Audio src={staticFile(`audio/${t.name}.wav`)} volume={trackVol(t)} trimBefore={t.offset ? Math.round(t.offset * FPS) : undefined} loop={t.loop} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
