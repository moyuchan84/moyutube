import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont as loadMyeongjo } from "@remotion/google-fonts/NanumMyeongjo";
import { loadFont as loadDodum } from "@remotion/google-fonts/GowunDodum";
import { loadFont as loadDokdo } from "@remotion/google-fonts/EastSeaDokdo";
import { Beat, Bubble, Comic, FPS, OUT_FRAMES, PH, PW, Page, Panel, Rect, pageFrames } from "./comic";

const { fontFamily: MYEONGJO } = loadMyeongjo("normal", { weights: ["400", "700", "800"] });
const { fontFamily: DODUM } = loadDodum();
const { fontFamily: DOKDO } = loadDokdo();

const PAPER = "#F4F1EA";
const INK = "#111111";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── 비트 시간표 ─────────────────────────────────
const beatStarts = (p: Page) => {
  const out: number[] = [];
  let t = 0;
  for (const b of p.beats) {
    out.push(t);
    t += Math.round(b.dur * FPS);
  }
  return out;
};
const firstBeatOf = (p: Page, panel: number) => Math.max(0, p.beats.findIndex((b) => b.p === panel));
const shown = (p: Page, bi: number, local: number, b: number, at = 0) => (bi > b ? 1 : bi === b ? interpolate(local, [at * FPS, at * FPS + 3], [0, 1], clamp) : 0);

// ── 카메라 ─────────────────────────────────────
type Cam = { cx: number; cy: number; s: number };
const camFor = (p: Page, beat: Beat): Cam => {
  if (beat.p === "page" || beat.breakOut) return { cx: PW / 2, cy: PH / 2, s: 1 };
  const r = p.panels[beat.p].r;
  const s = Math.min(PW / r[2], PH / r[3]) * 0.94 * (beat.zoom ?? 1);
  return { cx: r[0] + r[2] / 2, cy: r[1] + r[3] / 2, s: Math.max(1, s) };
};
const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({ cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k, s: a.s * Math.pow(b.s / a.s, k) });

// ── 말풍선 · 캡션 · 효과음 (페이지 좌표) ───────────
const BubbleEl: React.FC<{ b: Bubble; r: Rect; o: number }> = ({ b, r, o }) => {
  const x = r[0] + b.x * r[2];
  const y = r[1] + b.y * r[3];
  const kind = b.kind ?? "say";
  const size = b.size ?? (kind === "shout" ? 52 : kind === "whisper" ? 36 : 42);
  const tail = b.tail ?? "bl";
  const border = kind === "whisper" ? `3px dashed ${INK}` : `${kind === "shout" ? 5 : 3.5}px solid ${INK}`;
  const tailPath: Record<string, string> = {
    bl: "M34 0 L6 40 L18 0 Z",
    br: "M8 0 L36 40 L24 0 Z",
    tl: "M34 40 L6 0 L18 40 Z",
    tr: "M8 40 L36 0 L24 40 Z",
  };
  const tailPos: Record<string, React.CSSProperties> = {
    bl: { bottom: -36, left: "22%" },
    br: { bottom: -36, right: "22%" },
    tl: { top: -36, left: "22%" },
    tr: { top: -36, right: "22%" },
  };
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o }}>
      <div
        style={{
          position: "relative",
          background: "white",
          border,
          borderRadius: kind === "off" ? 6 : kind === "shout" ? 14 : "50%",
          padding: kind === "off" ? "14px 22px" : `${size * 0.7}px ${size * 1.05}px`,
          fontFamily: DODUM,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.28,
          color: INK,
          whiteSpace: "pre",
          textAlign: "center",
        }}
      >
        {b.text}
        {tail !== "none" && kind !== "off" && (
          <svg width={42} height={40} style={{ position: "absolute", overflow: "visible", ...tailPos[tail] }}>
            <path d={tailPath[tail]} fill="white" stroke={INK} strokeWidth={kind === "shout" ? 5 : 3.5} strokeDasharray={kind === "whisper" ? "6 5" : undefined} />
            <rect x={4} y={tail.startsWith("b") ? -6 : 36} width={34} height={10} fill="white" />
          </svg>
        )}
      </div>
    </div>
  );
};

const SpeedLines: React.FC<{ f: number; cx: number; cy: number }> = ({ f, cx, cy }) => {
  const seed = Math.floor(f / 2);
  const d = Array.from({ length: 64 }, (_, i) => {
    const a = random(`a${seed}-${i}`) * Math.PI * 2;
    const inner = 420 + random(`i${seed}-${i}`) * 260;
    const w = 3 + random(`w${seed}-${i}`) * 9;
    const R = 1600;
    const p = (ang: number, rad: number) => `${(cx + Math.cos(ang) * rad).toFixed(0)} ${(cy + Math.sin(ang) * rad).toFixed(0)}`;
    return `M${p(a, inner)} L${p(a - w / 900, R)} L${p(a + w / 900, R)} Z`;
  }).join(" ");
  return (
    <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
      <path d={d} fill={INK} />
    </svg>
  );
};

// ── 컷 하나 ────────────────────────────────────
const PanelEl: React.FC<{ p: Page; pi: number; bi: number; local: number; pageK: number; has: (s?: string) => boolean; f: number }> = ({ p, pi, bi, local, pageK, has, f }) => {
  const pn = p.panels[pi];
  const beat = p.beats[bi];
  const breaking = beat?.breakOut && beat.p === pi;
  // 테두리를 깨고 나오는 컷: 컷 사각형이 화면 전체(+여유)로 커진다
  const bk = breaking ? interpolate(local, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const r = pn.r;
  const R: Rect = breaking ? [r[0] + (-40 - r[0]) * bk, r[1] + (-40 - r[1]) * bk, r[2] + (PW + 80 - r[2]) * bk, r[3] + (PH + 80 - r[3]) * bk] : r;
  const clip = breaking ? undefined : pn.clip;
  const drift = pn.drift ?? [0, 0];
  const z = (pn.z ?? 1.04) * (breaking ? 1 + 0.1 * (1 - bk) : 1);
  const colorB = pn.color?.b ?? firstBeatOf(p, pi);
  const colorP = pn.color
    ? bi > colorB
      ? 1
      : bi === colorB
        ? interpolate(local, [(pn.color.at ?? 0.5) * FPS, ((pn.color.at ?? 0.5) + (pn.color.dur ?? 1.6)) * FPS], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
        : 0
    : 0;
  const rad = colorP * 160;
  const active = beat && typeof beat.p === "number" && !beat.breakOut ? beat.p : null;
  const glideF = Math.round((beat?.glide ?? 0.3) * FPS) || 1;
  const dimK = active === null ? 0 : interpolate(local, [0, glideF], [0, 1], clamp);
  const prevActive = bi > 0 && typeof p.beats[bi - 1].p === "number" ? p.beats[bi - 1].p : null;
  const wasDim = prevActive !== null && prevActive !== pi ? 1 : 0;
  const isDim = active !== null && active !== pi ? 1 : 0;
  const dim = wasDim + (isDim - wasDim) * (active === null ? interpolate(local, [0, glideF], [0, 1], clamp) : dimK);
  const imgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${pn.fx ?? 50}% ${pn.fy ?? 50}%`,
    transform: `translate(${drift[0] * pageK}px, ${drift[1] * pageK}px) scale(${z})`,
  };
  return (
    <div style={{ position: "absolute", left: R[0], top: R[1], width: R[2], height: R[3], zIndex: breaking ? 10 : 1, filter: dim > 0.01 ? `brightness(${1 - 0.45 * dim})` : undefined }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", clipPath: clip, background: pn.dark ? INK : PAPER }}>
        {pn.img && has(pn.img) && <Img src={staticFile(pn.img)} style={imgStyle} />}
        {pn.img && !has(pn.img) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "#ddd" }}>
            <div style={{ fontFamily: DODUM, fontSize: 40, color: "#888" }}>그림 준비 중 · {pn.img.split("/").pop()?.replace(".jpg", "")}</div>
          </AbsoluteFill>
        )}
        {pn.color && has(pn.color.img) && colorP > 0 && (
          <Img
            src={staticFile(pn.color.img)}
            style={{
              ...imgStyle,
              WebkitMaskImage: `radial-gradient(circle at ${pn.color.ox ?? 50}% ${pn.color.oy ?? 50}%, black ${rad}%, transparent ${rad + 12}%)`,
              maskImage: `radial-gradient(circle at ${pn.color.ox ?? 50}% ${pn.color.oy ?? 50}%, black ${rad}%, transparent ${rad + 12}%)`,
            }}
          />
        )}
        {pn.grain && (
          <>
            <AbsoluteFill
              style={{
                backgroundImage: `url(${staticFile("comics/grain.png")})`,
                backgroundPosition: `${Math.floor(random(`g${f}`) * 400)}px ${Math.floor(random(`h${f}`) * 400)}px`,
                mixBlendMode: "multiply",
                opacity: 0.5,
              }}
            />
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
          </>
        )}
      </div>
      {/* 컷 테두리 */}
      {!breaking && (
        <svg width={R[2]} height={R[3]} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {clip ? (
            <polygon
              points={clip
                .replace(/polygon\(|\)/g, "")
                .split(",")
                .map((pt) => {
                  const [a, b] = pt.trim().split(/\s+/);
                  const v = (s: string, L: number) => (s.endsWith("%") ? (parseFloat(s) / 100) * L : parseFloat(s));
                  return `${v(a, R[2])},${v(b, R[3])}`;
                })
                .join(" ")}
              fill="none"
              stroke={pn.dark ? PAPER : INK}
              strokeWidth={6}
            />
          ) : (
            <rect x={0} y={0} width={R[2]} height={R[3]} fill="none" stroke={pn.dark ? PAPER : INK} strokeWidth={6} />
          )}
        </svg>
      )}
    </div>
  );
};

// ── 페이지 하나 ─────────────────────────────────
const PageEl: React.FC<{ p: Page; has: (s?: string) => boolean; frames: number; next?: Page }> = ({ p, has, frames }) => {
  const f = useCurrentFrame();
  const st = beatStarts(p);
  const ff = Math.min(f, frames - 1);
  let bi = st.findIndex((s, i) => ff >= s && (i === st.length - 1 || ff < st[i + 1]));
  if (bi < 0) bi = 0;
  const beat = p.beats[bi];
  const local = ff - st[bi];
  const bFrames = Math.round(beat.dur * FPS);
  const pageK = ff / frames;

  // 카메라: 앞 비트에서 미끄러져 온다
  const prevCam = bi === 0 ? { cx: PW / 2, cy: PH / 2, s: 1 } : camFor(p, p.beats[bi - 1]);
  const target = camFor(p, beat);
  const glideF = Math.round((beat.glide ?? (bi === 0 ? 0.35 : 0.3)) * FPS);
  const gk = glideF > 0 ? interpolate(local, [0, glideF], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 1;
  let cam = lerpCam(prevCam, target, gk);
  const push = 1 + (beat.push ?? 0.035) * interpolate(local, [0, bFrames], [0, 1], clamp);
  let tx = PW / 2 - cam.cx * cam.s * push;
  let ty = PH / 2 - cam.cy * cam.s * push;
  for (const at of beat.shake ?? []) {
    const a = Math.round(at * FPS);
    const len = beat.big ? 10 : 6;
    if (local >= a && local < a + len) {
      const amp = (beat.big ? 30 : 14) * (1 - (local - a) / len);
      tx += (random(`x${f}`) - 0.5) * 2 * amp;
      ty += (random(`y${f}`) - 0.5) * 2 * amp;
    }
  }
  {
    const S = cam.s * push;
    if (S >= 1) {
      tx = Math.min(0, Math.max(PW - PW * S, tx));
      ty = Math.min(0, Math.max(PH - PH * S, ty));
    }
  }
  const neg = (beat.neg ?? []).some((at) => local >= Math.round(at * FPS) && local < Math.round(at * FPS) + 3);
  const punch = (beat.neg ?? []).length ? interpolate(local, [0, 9], [0.1, 0], clamp) : 0;

  // 페이지가 넘어가는 동안
  const out = p.out ?? "flip";
  const of = f - frames;
  const outK = of >= 0 ? interpolate(of, [0, OUT_FRAMES[out]], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
  let pageStyle: React.CSSProperties = {};
  let wash: React.ReactNode = null;
  if (of >= 0) {
    if (out === "flip") pageStyle = { transform: `perspective(2600px) rotateY(${-110 * outK}deg)`, transformOrigin: "0% 50%", filter: `brightness(${1 - 0.5 * outK})` };
    if (out === "burn") wash = <AbsoluteFill style={{ background: "white", opacity: Math.sin(outK * Math.PI) }} />;
    if (out === "black") pageStyle = { opacity: 1 - outK };
    if (out === "shutter")
      wash = (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: (PH / 2) * Math.sin(outK * Math.PI), background: INK }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (PH / 2) * Math.sin(outK * Math.PI), background: INK }} />
        </>
      );
    if (out === "burn" && outK > 0.5) pageStyle = { opacity: 0 };
  }

  const scale = cam.s * push + punch;
  return (
    <AbsoluteFill style={{ background: p.bg === "black" ? INK : "#0d0d0d", ...pageStyle }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PW,
          height: PH,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          background: p.bg === "black" ? INK : PAPER,
          filter: neg ? "invert(1)" : undefined,
        }}
      >
        {p.title && <TitleEl t={p.title} f={f} />}
        {p.panels.map((_, pi) => (
          <PanelEl key={pi} p={p} pi={pi} bi={bi} local={local} pageK={pageK} has={has} f={f} />
        ))}
        {/* 페이지에 인쇄된 글자들 */}
        {p.panels.map((pn, pi) =>
          (pn.caps ?? []).map((c, i) => {
            const o = shown(p, bi, local, c.b ?? firstBeatOf(p, pi), c.at ?? 0);
            if (!o) return null;
            return (
              <div
                key={`c${pi}-${i}`}
                style={{
                  position: "absolute",
                  left: pn.r[0] + (c.x ?? 0.04) * pn.r[2],
                  top: pn.r[1] + (c.y ?? 0.04) * pn.r[3],
                  maxWidth: (c.w ?? 0.7) * pn.r[2],
                  background: INK,
                  color: PAPER,
                  fontFamily: MYEONGJO,
                  fontWeight: 700,
                  fontSize: c.size ?? 36,
                  lineHeight: 1.45,
                  padding: "12px 20px",
                  whiteSpace: "pre-line",
                  opacity: o,
                  zIndex: 20,
                }}
              >
                {c.text}
              </div>
            );
          }),
        )}
        {p.panels.map((pn, pi) =>
          (pn.bubbles ?? []).map((b, i) => {
            const o = shown(p, bi, local, b.b ?? firstBeatOf(p, pi), b.at ?? 0);
            return o ? (
              <div key={`b${pi}-${i}`} style={{ position: "absolute", inset: 0, zIndex: 20 }}>
                <BubbleEl b={b} r={pn.r} o={o} />
              </div>
            ) : null;
          }),
        )}
        {p.panels.map((pn, pi) =>
          (pn.sfx ?? []).map((s, i) => {
            const b = s.b ?? firstBeatOf(p, pi);
            const lf = bi === b ? local - (s.at ?? 0) * FPS : bi > b ? 999 : -1;
            if (lf < 0) return null;
            const sc = interpolate(lf, [0, 4, 8], [1.7, 0.95, 1], clamp);
            return (
              <div
                key={`s${pi}-${i}`}
                style={{
                  position: "absolute",
                  left: pn.r[0] + s.x * pn.r[2],
                  top: pn.r[1] + s.y * pn.r[3],
                  transform: `translate(-50%,-50%) rotate(${s.rot ?? -8}deg) scale(${sc})`,
                  fontFamily: DOKDO,
                  fontSize: s.size ?? 160,
                  color: s.white ? PAPER : INK,
                  WebkitTextStroke: `8px ${s.white ? INK : PAPER}`,
                  paintOrder: "stroke",
                  whiteSpace: "pre",
                  zIndex: 30,
                }}
              >
                {s.text}
              </div>
            );
          }),
        )}
      </div>
      {beat.speed && <SpeedLines f={f} cx={PW / 2} cy={PH / 2} />}
      {p.card && bi >= p.card.b && (
        <CardEl q={p.card.q} sub={p.card.sub} o={bi > p.card.b ? 1 : interpolate(local, [(p.card.at ?? 0) * FPS, (p.card.at ?? 0) * FPS + 10], [0, 1], clamp)} />
      )}
      {wash}
    </AbsoluteFill>
  );
};

const TitleEl: React.FC<{ t: { main: string; sub: string }; f: number }> = ({ t, f }) => {
  const p = interpolate(f, [8, 32], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const drop = interpolate(f, [36, 66], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: MYEONGJO, fontWeight: 800, fontSize: 132, color: INK, letterSpacing: 6, clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>{t.main}</div>
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
            transform: `translateY(${(1 - drop) * -60}px)`,
          }}
        />
        <div style={{ fontFamily: MYEONGJO, fontWeight: 700, fontSize: 48, color: INK, marginTop: 40, opacity: drop, letterSpacing: 4 }}>{t.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const CardEl: React.FC<{ q: string; sub: string; o: number }> = ({ q, sub, o }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 1130, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, zIndex: 50 }}>
    <div style={{ background: PAPER, border: `5px solid ${INK}`, padding: "34px 40px", boxShadow: "10px 10px 0 rgba(0,0,0,0.35)" }}>
      <div style={{ fontFamily: DODUM, fontWeight: 700, fontSize: 46, color: INK, lineHeight: 1.35, whiteSpace: "pre-line" }}>💬 {q}</div>
      <div style={{ height: 4, background: INK, margin: "24px 0" }} />
      <div style={{ fontFamily: MYEONGJO, fontWeight: 700, fontSize: 38, color: INK, lineHeight: 1.45, whiteSpace: "pre-line" }}>{sub}</div>
    </div>
  </div>
);

// ── 전체 ───────────────────────────────────────
export const ComicView: React.FC<{ comic: Comic }> = ({ comic }) => {
  const has = (s?: string) => !!s && (!comic.assets || comic.assets.includes(s));
  let t = 0;
  const seqs = comic.pages.map((p, i) => {
    const frames = pageFrames(p);
    const from = t;
    t += frames;
    const outF = i < comic.pages.length - 1 ? OUT_FRAMES[p.out ?? "flip"] : 0;
    return { p, i, frames, from, outF };
  });
  return (
    <AbsoluteFill style={{ background: "#0d0d0d" }}>
      {/* 뒤 페이지가 아래에 깔리도록 거꾸로 쌓는다 */}
      {[...seqs].reverse().map(({ p, i, frames, from, outF }) => (
        <Sequence key={i} from={from} durationInFrames={frames + outF}>
          <PageEl p={p} has={has} frames={frames} />
        </Sequence>
      ))}
      {seqs.map(({ p, i, from }) => {
        const st = beatStarts(p);
        return p.beats.map((b, j) =>
          (b.sfx ?? []).map((s, k) => (
            <Sequence key={`${i}-${j}-${k}`} from={from + st[j] + Math.round((s.at ?? 0) * FPS)} durationInFrames={s.dur ? Math.round(s.dur * FPS) : undefined}>
              <Audio src={staticFile(`audio/${s.name}.wav`)} volume={s.vol ?? 0.8} />
            </Sequence>
          )),
        );
      })}
      {seqs.filter(({ i, p }) => i < comic.pages.length - 1 && (p.out ?? "flip") === "flip").map(({ i, from, frames }) => (
        <Sequence key={`pf${i}`} from={from + frames - 2} durationInFrames={20}>
          <Audio src={staticFile("audio/page_flip.wav")} volume={0.7} />
        </Sequence>
      ))}
      {comic.tracks.map((tr, i) => (
        <Sequence key={`t${i}`} from={Math.round(tr.from * FPS)} durationInFrames={Math.round((tr.to - tr.from) * FPS)}>
          <Audio
            src={staticFile(`audio/${tr.name}.wav`)}
            volume={(f) => {
              const len = (tr.to - tr.from) * FPS;
              const g = Math.min(1, (f + 1) / ((tr.fadeIn ?? 1) * FPS), (len - f) / ((tr.fadeOut ?? 1.5) * FPS));
              return Math.max(0, g) * tr.vol;
            }}
            trimBefore={tr.offset ? Math.round(tr.offset * FPS) : undefined}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
