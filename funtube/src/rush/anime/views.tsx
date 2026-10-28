// anime 엔진의 컷 화면: 그림 패널 · 장 제목 · 의성어 · 카운터 · 게이지 · 도장
import React from "react";
import { AbsoluteFill, Img, getStaticFiles, staticFile } from "remotion";
import { FONT, H, INK, W, clamp, easeInOut, easeOut, hit, pop, rnd } from "../fx";
import type { BuiltShot } from "../timeline";
import { FocusLines, GOLD, LightLeak, Letterbox, RED, RgbDefs, Sparkles, SpeedLines, impactFilter, shake } from "./afx";

export type ViewProps = { s: BuiltShot; f: number; bf: number };

// `*강조*` 와 `/` 줄바꿈을 글자 단위로 쪼갠다
type Ch = { c: string; hot: boolean; line: number };
const chars = (text: string): Ch[] => {
  const out: Ch[] = [];
  text.split("/").forEach((ln, line) => ln.split("*").forEach((part, i) => [...part].forEach((c) => out.push({ c, hot: i % 2 === 1, line }))));
  return out;
};
const sizeFor = (text: string, width: number, max: number) => {
  const n = Math.max(...text.split("/").map((l) => [...l.replace(/\*/g, "")].length), 1);
  return Math.min(max, Math.floor(width / (n * 1.02)));
};

// 글자가 하나씩 쾅쾅 박힌다 (크게 → 제자리, 흐림 → 선명)
export const Slam: React.FC<{ text: string; f: number; size: number; delay?: number; gap?: number; color?: string; hot?: string; stroke?: number; font?: string; skew?: number }> = ({ text, f, size, delay = 0, gap = 1.4, color = "#fff", hot = GOLD, stroke, font = FONT.impact, skew = -6 }) => {
  const list = chars(text);
  const lines = Math.max(...list.map((c) => c.line)) + 1;
  const sw = stroke ?? Math.max(6, size * 0.11);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `skewX(${skew}deg)` }}>
      {Array.from({ length: lines }, (_, ln) => (
        <div key={ln} style={{ display: "flex", whiteSpace: "pre" }}>
          {list.map((ch, i) => {
            if (ch.line !== ln) return null;
            const t = f - delay - i * gap;
            const e = easeOut(t / 5);
            return (
              <span key={i} style={{ fontFamily: font, fontSize: size, lineHeight: 1.1, color: ch.hot ? hot : color, opacity: clamp(t / 2), display: "inline-block", transform: `scale(${2.6 - 1.6 * e})`, filter: t < 4 ? `blur(${(1 - t / 4) * 10}px)` : undefined, WebkitTextStroke: `${sw}px ${INK}`, paintOrder: "stroke fill", textShadow: ch.hot ? `0 0 ${size * 0.25}px rgba(255,190,40,0.7), ${size * 0.05}px ${size * 0.06}px 0 ${RED}` : `${size * 0.05}px ${size * 0.06}px 0 rgba(0,0,0,0.55)` }}>
                {ch.c}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// 아래 큰 자막: 왼쪽부터 칼로 그은 듯 드러난다 + 뒤에 빨간 사선 띠
export const Dialogue: React.FC<{ text: string; f: number; y?: number; quote?: boolean }> = ({ text, f, y = 1290, quote }) => {
  const p = easeOut((f - 2) / 6);
  const size = sizeFor(text, 960, 118);
  const lines = text.split("/").length;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - (lines - 1) * size * 0.55, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: size * 0.25, height: size * 0.62 * lines + size * 0.2, background: `linear-gradient(90deg, transparent, ${RED}dd 18%, ${RED}dd 82%, transparent)`, transform: `skewY(-3deg) scaleX(${p})`, transformOrigin: "0% 50%", opacity: 0.85 }} />
      <div style={{ clipPath: `inset(-40% ${(1 - p) * 100}% -40% -10%)` }}>
        <Slam text={quote ? `“${text}”` : text} f={f} size={size} delay={1} gap={0.8} />
      </div>
    </div>
  );
};

// 위쪽 꼬리표: 검은 사선 상자 + 빨간 칼날
export const Tag: React.FC<{ text: string; f: number; y?: number }> = ({ text, f, y = 250 }) => {
  const p = easeOut(f / 6);
  return (
    <div style={{ position: "absolute", left: 60, top: y, transform: `translateX(${(1 - p) * -700}px) skewX(-12deg)`, display: "flex", alignItems: "stretch" }}>
      <div style={{ width: 18, background: RED }} />
      <div style={{ background: "rgba(10,8,8,0.88)", padding: "10px 34px 16px", fontFamily: FONT.sans, fontSize: 60, color: "#fff", letterSpacing: 2 }}>
        {text.split("*").map((t, i) => <span key={i} style={{ color: i % 2 ? GOLD : "#fff" }}>{t}</span>)}
      </div>
    </div>
  );
};

// 영문 작은 글자 (자간 넓게, 좌우로 선이 자란다)
const Sub: React.FC<{ text: string; f: number; y: number; delay?: number; color?: string }> = ({ text, f, y, delay = 6, color = "#fff" }) => {
  const p = easeOut((f - delay) / 10);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, opacity: clamp((f - delay) / 4) }}>
      <div style={{ width: 110 * p, height: 3, background: color }} />
      <div style={{ fontFamily: FONT.sans, fontSize: 34, letterSpacing: 7 * (0.6 + 0.4 * p), color, whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ width: 110 * p, height: 3, background: color }} />
    </div>
  );
};

const artFile = (s: BuiltShot) => `rush/${s.themeId}/${s.art}.png`;
const hasArt = (s: BuiltShot) => !!s.art && getStaticFiles().some((x) => x.name === artFile(s));

// 흐리게 깔리는 배경 (같은 그림을 크게 · 어둡게)
const BlurBack: React.FC<{ s: BuiltShot; f: number; dim?: number }> = ({ s, f, dim = 0.55 }) =>
  hasArt(s) ? (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(artFile(s))} style={{ width: W, height: H, objectFit: "cover", transform: `scale(${1.5 + f * 0.002})`, filter: `blur(38px) brightness(${1 - dim}) saturate(1.4)` }} />
    </AbsoluteFill>
  ) : null;

// ── 그림 패널 ──
// crop 이 있으면 그 부분만 화면 폭에 맞춘 "극장 패널"로, 없으면 화면 가득
export const PicView: React.FC<ViewProps> = ({ s, f, bf }) => {
  const fx = s.fx ?? [];
  const impact = fx.includes("impact");
  const [top, bot] = s.crop ?? [0, 100];
  const full = bot - top > 85;
  const ph = (H * (bot - top)) / 100; // 패널 높이 (원본 1080×1920 기준)
  const py = full ? 0 : 330; // 패널 위치
  const t = clamp(f / s.len);
  const dir = s.idx % 2 ? 1 : -1;
  const sh = impact ? shake(f, 46, 8) : { x: 0, y: 0 };
  const z = (full ? 1.14 : 1.04) + 0.07 * easeInOut(t) + (impact ? 0.18 * hit(f, 3) : 0.03 * hit(f % bf, 5));
  const rgb = fx.includes("rgb") ? Math.round(26 * hit(f, 5)) + (f % 9 === 0 ? 8 : 0) : 0;
  const id = `rgb-${s.idx}`;
  const img = hasArt(s) ? (
    <div style={{ position: "absolute", left: 0, top: py, width: W, height: full ? H : ph, overflow: "hidden", filter: [impactFilter(impact ? f : 99), rgb ? `url(#${id})` : ""].filter(Boolean).join(" ") || undefined }}>
      <Img src={staticFile(artFile(s))} style={{ position: "absolute", left: 0, top: (-H * top) / 100, width: W, height: H, transformOrigin: `50% ${top + (bot - top) * 0.45}%`, transform: `translate(${dir * (t - 0.5) * 36 + sh.x}px, ${sh.y}px) scale(${z})` }} />
    </div>
  ) : (
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: FONT.sans, fontSize: 56, color: RED }}>그림 준비 중: {s.art}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#07060A" }}>
      {!full && <BlurBack s={s} f={f} />}
      {rgb > 0 && <RgbDefs id={id} d={rgb} />}
      {img}
      {!full && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: py - 6, height: 6, background: RED, transform: `scaleX(${easeOut(f / 8)})`, transformOrigin: dir > 0 ? "0 0" : "100% 0" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: py + ph, height: 6, background: "#fff", transform: `scaleX(${easeOut(f / 8)})`, transformOrigin: dir > 0 ? "100% 0" : "0 0" }} />
        </>
      )}
      {fx.includes("lines") && <FocusLines f={f} opacity={0.75 * (0.55 + 0.45 * hit(f, 10))} />}
      {fx.includes("speed") && <SpeedLines f={f} />}
      {fx.includes("sparkle") && (
        <>
          <LightLeak f={f} hue="pink" opacity={0.45} />
          <Sparkles f={f} color="#FFE9A8" />
        </>
      )}
      {/* 글자 뒤 어두운 띠: 아래 자막이 그림 위에서도 읽히게 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, height: 520, background: "linear-gradient(transparent, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.6) 70%, transparent)" }} />
      {s.line ? (
        <>
          {s.text && <Tag text={s.text} f={f} y={full ? 260 : 200} />}
          <Dialogue text={s.line} f={f} quote />
        </>
      ) : (
        s.text && <Dialogue text={s.text} f={f} />
      )}
    </AbsoluteFill>
  );
};

// ── 제목 · 장 카드 ──
// kicker 가 있으면 장 카드(빨강/검정 사선 분할), 없으면 검은 화면 + 흐린 그림
export const TitleView: React.FC<ViewProps> = ({ s, f }) => {
  const chapter = !!s.kicker;
  const size = sizeFor(s.text ?? "", 940, chapter ? 190 : 210);
  const cut = easeOut(f / 7);
  return (
    <AbsoluteFill style={{ background: "#050407", overflow: "hidden" }}>
      {s.art && <BlurBack s={s} f={f} dim={0.5} />}
      {s.art && !chapter && <FocusLines f={f} color="#fff" opacity={0.18 + 0.3 * hit(f, 8)} inner={520} />}
      {chapter && (
        <>
          <AbsoluteFill style={{ background: RED, clipPath: `polygon(${100 - cut * 100}% 0, 100% 0, 100% 100%, ${100 - cut * 160}% 100%)`, opacity: 0.92 }} />
          <AbsoluteFill style={{ background: "#000", clipPath: "polygon(0 0, 46% 0, 22% 100%, 0 100%)", opacity: 0.55 }} />
          <FocusLines f={f} color="#000" opacity={0.35} inner={620} />
        </>
      )}
      {!chapter && <LightLeak f={f + s.idx * 50} opacity={0.3} />}
      <Letterbox f={f} size={chapter ? 260 : 300} />
      {chapter && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", opacity: clamp(f / 3) }}>
          <div style={{ background: "#fff", color: RED, fontFamily: FONT.impact, fontSize: 64, padding: "4px 30px 10px", transform: `skewX(-12deg) translateY(${(1 - easeOut(f / 6)) * -60}px)` }}>{s.kicker}</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: chapter ? 820 : 800, display: "flex", justifyContent: "center" }}>
        <Slam text={s.text ?? ""} f={f} size={size} delay={chapter ? 3 : 1} gap={chapter ? 2 : 1.6} />
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: chapter ? 1060 : 1030, height: 5, background: chapter ? "#fff" : RED, transform: `scaleX(${easeOut((f - 4) / 8)})` }} />
      {s.sub && <Sub text={s.sub} f={f} y={chapter ? 1100 : 1075} delay={7} />}
    </AbsoluteFill>
  );
};

// ── 의성어 한 방 (빠앙!) ──
export const OnomaView: React.FC<ViewProps> = ({ s, f }) => {
  const sh = shake(f, 60, 9);
  const size = sizeFor(s.text ?? "", 860, 330);
  const p = pop(f, 0, 6);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FF4D3D, ${s.bg ?? RED} 45%, #5A0010)`, overflow: "hidden", filter: impactFilter(f) }}>
      <FocusLines f={f} color="#1A0004" opacity={0.9} inner={300} n={140} />
      {[1.6, 1.3].map((k, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: 0.25 * (1 - clamp(f / 12)), transform: `scale(${k + f * 0.04})` }}>
          <span style={{ fontFamily: FONT.impact, fontSize: size, color: "transparent", WebkitTextStroke: "6px #fff" }}>{(s.text ?? "").replace(/\*/g, "")}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", transform: `translate(${sh.x}px, ${sh.y}px) rotate(-8deg) scale(${0.4 + 0.6 * p})` }}>
        <Slam text={s.text ?? ""} f={f + 6} size={size} gap={0.6} skew={-14} color="#fff" hot="#fff" />
      </div>
    </AbsoluteFill>
  );
};

// ── 카운터 (숫자가 0.0 → 1.0) ──
export const CounterView: React.FC<ViewProps> = ({ s, f }) => {
  const p = easeInOut(f / (s.len * 0.75));
  const v = (s.v0 ?? 0) + ((s.v1 ?? 1) - (s.v0 ?? 0)) * p;
  const R = 330, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #1B1420, #050407 70%)" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const on = i / 60 <= p;
          return <line key={i} x1={540 + Math.cos(a) * 380} y1={860 + Math.sin(a) * 380} x2={540 + Math.cos(a) * (i % 5 ? 405 : 425)} y2={860 + Math.sin(a) * (i % 5 ? 405 : 425)} stroke={on ? RED : "#3A3040"} strokeWidth={i % 5 ? 5 : 9} />;
        })}
        <circle cx={540} cy={860} r={R} fill="none" stroke={RED} strokeWidth={14} strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 540 860)" style={{ filter: `drop-shadow(0 0 18px ${RED})` }} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: FONT.sans, fontSize: 64, color: "#fff", letterSpacing: 6, opacity: clamp(f / 4) }}>{s.label}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: FONT.impact, fontSize: 280, color: "#fff", lineHeight: 1, textShadow: `0 0 40px ${RED}`, transform: `scale(${1 + 0.06 * hit(f % 6, 2)})` }}>
        {v.toFixed(1)}<span style={{ fontSize: 110, color: GOLD }}>초</span>
      </div>
      {s.text && f > s.len * 0.7 && <Dialogue text={s.text} f={f - Math.floor(s.len * 0.7)} y={1300} />}
    </AbsoluteFill>
  );
};

// ── 게이지 (격투 게임 체력바처럼) ──
export const MeterView: React.FC<ViewProps> = ({ s, f }) => {
  const p = easeOut((f - 4) / (s.len * 0.6));
  const v = (s.v0 ?? 0) + ((s.v1 ?? 100) - (s.v0 ?? 0)) * p;
  const max = v >= (s.v1 ?? 100) - 0.5;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${s.bg ?? "#2A0D4A"}, ${s.bg2 ?? "#07020F"})`, overflow: "hidden" }}>
      <SpeedLines f={f} opacity={0.35} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FONT.sans, fontSize: 70, color: "#fff", letterSpacing: 4 }}>{s.label}</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 780, height: 120, transform: "skewX(-18deg)", border: "8px solid #fff", background: "#1A1020", boxShadow: `0 0 40px ${max ? GOLD : "#8A3FFC"}` }}>
        <div style={{ width: `${v}%`, height: "100%", background: max && f % 4 < 2 ? "#fff" : `linear-gradient(90deg, #FF8A00, ${GOLD})` }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i + 1) * 10}%`, top: 0, bottom: 0, width: 4, background: "rgba(0,0,0,0.35)" }} />)}
      </div>
      <div style={{ position: "absolute", right: 110, top: 930, fontFamily: FONT.impact, fontSize: 120, color: max ? GOLD : "#fff", transform: `skewX(-12deg) scale(${max ? 1 + 0.15 * hit(f - Math.floor(s.len * 0.65), 3) : 1})`, textShadow: `0 0 30px ${GOLD}`, WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>
        {max ? "MAX" : `${Math.round(v)}%`}
      </div>
      {s.text && <Dialogue text={s.text} f={f - 6} y={1300} />}
    </AbsoluteFill>
  );
};

// ── 도장 쾅 ──
export const StampView: React.FC<ViewProps> = ({ s, f }) => {
  const t = easeOut(f / 5);
  const sh = shake(f - 4, 50, 6);
  return (
    <AbsoluteFill style={{ background: "#0B090C", overflow: "hidden" }}>
      {s.art && <BlurBack s={s} f={f} dim={0.7} />}
      {f >= 4 && Array.from({ length: 22 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2, d = (f - 4) * (14 + rnd(i * 3) * 20);
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * (260 + d), top: 860 + Math.sin(a) * (260 + d), width: 14, height: 14, borderRadius: 7, background: "#E8DCC8", opacity: clamp(1 - (f - 4) / 14) }} />;
      })}
      <div style={{ position: "absolute", left: 190, top: 510, width: 700, height: 700, transform: `translate(${sh.x}px, ${sh.y}px) rotate(-12deg) scale(${2.4 - 1.4 * t})`, opacity: clamp(f / 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `22px solid ${RED}`, boxShadow: `inset 0 0 0 14px #0B090C, inset 0 0 0 26px ${RED}` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT.impact, fontSize: 150, color: RED, lineHeight: 1.05, textAlign: "center" }}>{(s.text ?? "").replace(/\*/g, "").split(" ").join("\n").split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>
      </div>
      {s.sub && <Dialogue text={`*${s.sub}*`} f={f - 12} y={1300} />}
    </AbsoluteFill>
  );
};

export const VIEWS: Record<string, React.FC<ViewProps>> = { pic: PicView, title: TitleView, text: OnomaView, counter: CounterView, meter: MeterView, stamp: StampView };
