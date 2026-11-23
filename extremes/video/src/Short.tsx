import { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, H, W, fontFamily } from "./theme";

// Extremes 쇼츠 한 편 = content/<편>/script/shots.json. 데이터가 정하고 이 파일이 그린다.
// 샷 종류: photo(사진 또는 영상 클립 "video" + 켄 번즈 + 숫자 카운터) · compare(에베레스트를 해구에 빠뜨리는 그래픽) · stat(1,000칸 압력 그래픽) · end(끝 카드)
// DIVE 모드 (data.dive + 샷마다 depth): 위에 고정된 깊이 숫자 · 왼쪽 눈금이 편 내내 이어지고, 컷은 아래에서 밀려 올라온다 (내려가는 느낌).

export type Text = { at: number; to: number; ko: string; en: string; big?: boolean };
export type Shot = {
  type: "photo" | "card" | "compare" | "stat" | "end" | "black" | "paper";
  paper?: { mode: "cells" | "hand" | "recopy" | "seal"; a?: string; b?: string }; // paper: 코드로 그린 답안지 도식 (사진 없음). a · b = 도식 안 짧은 라벨
  from: number; // 초
  dur: number; // 초
  image?: string;
  zoom?: [number, number];
  focus?: [number, number]; // 0~1, 확대 중심
  pan?: [number, number]; // 시작 → 끝 가로 이동 (%, 사진 폭 기준)
  panY?: [number, number]; // 시작 → 끝 세로 이동 (%, 음수 = 위로 올림. 가로 사진에서 아래쪽 대상을 글자 위로 올릴 때)
  credit?: string;
  texts?: Text[];
  counter?: { to: number; unit: string; start: number; dur: number; from?: number; prefix?: string; dp?: number }; // prefix: "$" 처럼 숫자 앞, dp: 소수 자리
  tint?: number; // 사진 어둡게 0~1
  gauge?: { from: number; to: number; max?: number }; // 왼쪽 깊이 눈금: 마커가 from → to (m), max 기본 11,000
  focusTo?: [number, number]; // 사진 크롭 중심을 focus → focusTo 로 천천히 옮김 (세로 사진 훑기)
  bars?: { label: string; text: string; value: number; max: number; at: number; color?: string }[]; // 가로 막대 비교
  stamp?: { text: string; at: number }; // 붉은 도장
  bg?: string; // card 배경 (CSS)
  ring?: boolean; // card: 소나 링
  bag?: boolean; // card: 떠다니는 비닐봉지
  wave?: boolean; // card: 같은 패턴이 반복되는 파형 (이어 붙인 소리)
  video?: string; // photo: 사진 대신 영상 클립 (art/ 의 mp4, 소리 없음). 켄 번즈 · focus 는 그대로 적용
  videoStart?: number; // 클립 안에서 시작할 초
  rate?: number; // 재생 속도 (0.5 = 느리게, 공포 연출에 좋다)
  illustrative?: boolean; // 실제 장소가 아닌 분위기 화면 → 오른쪽 위에 "연출 화면 · Illustrative"
  fit?: "cover" | "contain"; // contain: 사진 전체를 보여 준다 (정사각 위성 사진 등, 남는 곳은 검정)
  rank?: number; // TOP N 순위: 샷 시작에 큰 "#N" 이 쾅 찍힌다 (진행 막대도 이 값으로 움직인다)
  hits?: { at: number; kind: "flash" | "glitch" | "shake" | "red" }[]; // 놀람 효과 (초, 샷 안에서)
  blur?: number; // 사진 흐림 px (첫 장면 열린 고리용)
  mold?: { at: number }; // 초록 얼룩이 번진다 (라스코 "초록 병")
  zone?: { x: number; y: number; r: number; at: number; ko: string; en: string }; // 빨간 점선 접근 금지 원 (화면 px)
  ufo?: { at: number; from: [number, number]; to: [number, number]; dur?: number }; // 하늘을 가로지르는 빛 (화면 px)
  depth?: number; // DIVE 모드: 이 샷의 깊이 (m). 샷이 시작하면 위 숫자가 앞 샷 깊이 → 이 깊이로 굴러간다
};
export type Thumb = { image: string; focus?: [number, number]; zoom?: number; big: string; unit: string; ko: string; en: string; tag?: string };
export type ShotsData = {
  fps: number; bpm: number; no?: string; bgm?: string; thumb?: Thumb; shots: Shot[]; end?: { ko: string; en: string; askKo: string; askEn: string; next?: { image: string; ko: string; en: string; focus?: [number, number] } }; // next: 끝 카드 아래 "다음 편" 미리보기 (흐린 사진)
  series?: { n: number; total: number }; // 시리즈 몇 번째인지: 브랜드 옆에 점으로 (①②③…를 모으고 싶게)
  accent?: string; // 영어 글자 · 숫자 단위 색 (기본 노랑)
  transition?: "blinds" | "glitch" | "dive" | "fade"; // 컷 전환 (기본 blinds). dive: 다음 샷이 아래에서 밀려 올라온다 · fade: 번쩍임 없이 부드럽게 어두워졌다 밝아짐 (눈이 편하다)
  dive?: DiveCfg; // DIVE 모드: 깊이 숫자 · 눈금(0 ~ max m, 제곱근 눈금) · 깊을수록 좁아지는 시야. atm: 수압(≈ 깊이/10 + 1 기압)도 작게
  progress?: number; // TOP N 진행 막대 칸 수 (rank 샷이 있을 때)
  endBg?: string; // 끝 카드 배경 (CSS)
  title?: { en: string; ko: string }; // 주제 머리글: 브랜드 아래에 편 내내 고정 (순위형 — 무엇의 TOP N 인지 첫 프레임부터)
  lang?: "ko" | "en"; // 크게 보일 언어 (기본 ko). en: 영어 크게 · 한국어 작게 (해외 시청자용)
};

export const totalFrames = (d: ShotsData) => Math.round(Math.max(...d.shots.map((s) => s.from + s.dur)) * d.fps);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const NoCtx = createContext("No.1");
const AccentCtx = createContext(C.accent);
const SeriesCtx = createContext<{ n: number; total: number } | undefined>(undefined);
const LangCtx = createContext<"ko" | "en">("ko");
// DIVE 설정. scale "log": 눈금 · 시야를 로그로 (m 에서 수천 km 까지 한 편에 담을 때). km: 이 깊이(m)부터 km 로 표시.
// center: 목표까지의 거리(m) → "<label> x%" 줄 (atm 대신, label 기본 WAY TO THE CENTER).
// up: 올라가는 편 — 눈금이 아래에서 위로 차고, 새 샷이 위에서 내려온다.
type DiveCfg = { max: number; atm?: boolean; scale?: "sqrt" | "log"; km?: number; center?: number; label?: string; up?: boolean };
const diveFrac = (m: number, cfg: DiveCfg) =>
  cfg.scale === "log" ? Math.min(1, Math.log10(1 + Math.max(0, m)) / Math.log10(1 + cfg.max)) : Math.sqrt(Math.min(1, Math.max(0, m) / cfg.max));
const pctFmt = (p: number) => (Math.abs(p - 100) < 0.005 ? "100" : p < 1 ? p.toFixed(2) : p < 10 ? p.toFixed(1) : Math.round(p).toString());
const DiveCtx = createContext<DiveCfg | undefined>(undefined);
const TitleCtx = createContext(false); // 주제 머리글이 있으면 순위 · 숫자를 아래로 내린다
// [크게, 작게] — lang 에 따라 한국어 · 영어 순서를 바꾼다
const useMain = () => { const lang = useContext(LangCtx); return (ko: string, en: string): [string, string] => (lang === "en" ? [en, ko] : [ko, en]); };
const Brand: React.FC<{ n?: string; ctx?: boolean }> = ({ n, ctx }) => {
  const no = useContext(NoCtx);
  const accent = useContext(AccentCtx);
  const series = useContext(SeriesCtx);
  const label = ctx ? no : n;
  return (
  <div style={{ position: "absolute", top: 230, left: 60, fontFamily, display: "flex", gap: 14, alignItems: "center" }}>
    <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: 6, color: accent, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>EXTREMES</span>
    {label ? <span style={{ fontSize: 30, fontWeight: 700, color: C.text, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{label}</span> : null}
    {series ? (
      <span style={{ display: "flex", gap: 7, marginLeft: 4 }}>
        {Array.from({ length: series.total }).map((_, i) => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i + 1 === series.n ? accent : i + 1 < series.n ? "rgba(255,255,255,0.75)" : "transparent", border: `2px solid ${i + 1 === series.n ? accent : "rgba(255,255,255,0.6)"}` }} />
        ))}
      </span>
    ) : null}
  </div>
  );
};

// 하단 글자 (한국어 작게 · 영어 크게). 안전 영역 안: 아래 y≈1500 에서 끝, 오른쪽 여백 150
const Captions: React.FC<{ texts: Text[]; fps: number; bottom?: number }> = ({ texts, fps, bottom = 450 }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const accent = useContext(AccentCtx);
  const main = useMain();
  return (
    <>
      {texts.map((x, i) => {
        const [a, b] = main(x.ko, x.en);
        const o = interpolate(t, [x.at, x.at + 0.25, x.to - 0.2, x.to], [0, 1, 1, 0], clamp);
        const y = interpolate(t, [x.at, x.at + 0.35], [24, 0], { ...clamp, easing: ease });
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 150, bottom, opacity: o, transform: `translateY(${y}px)`, fontFamily }}>
            <div style={{ fontSize: x.big ? 92 : 76, fontWeight: 900, lineHeight: 1.12, color: C.text, textShadow: "0 4px 24px rgba(0,0,0,0.85)", whiteSpace: "pre-line" }}>{a}</div>
            <div style={{ marginTop: 16, fontSize: 44, fontWeight: 700, lineHeight: 1.2, color: accent, textShadow: "0 3px 18px rgba(0,0,0,0.9)", whiteSpace: "pre-line" }}>{b}</div>
          </div>
        );
      })}
    </>
  );
};

const Credit: React.FC<{ text?: string }> = ({ text }) =>
  text ? <div style={{ position: "absolute", left: 60, top: 1512, fontFamily, fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>{text}</div> : null;

// 해양설: 천천히 떠오르는 입자
const Snow: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    {Array.from({ length: 46 }).map((_, i) => {
      const x = ((i * 197) % 1000) + 40;
      const sp = 0.6 + ((i * 53) % 10) / 10;
      const y = (((i * 331) % 1900) - frame * sp * 1.4 + 3800) % 1900;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: 9, background: "rgba(200,225,255,0.35)" }} />;
    })}
  </AbsoluteFill>
);

// 소나 링
const Rings: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    {[0, 1, 2].map((i) => {
      const k = (t * 0.5 + i / 3) % 1;
      return <div key={i} style={{ position: "absolute", left: 540 - 520 * k, top: 760 - 520 * k, width: 1040 * k, height: 1040 * k, borderRadius: "50%", border: `3px solid rgba(255,201,60,${0.9 * (1 - k)})` }} />;
    })}
  </AbsoluteFill>
);

// 바닥에서 발견된 비닐봉지
const Bag: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [0.2, 1.4], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 300, top: 470 + Math.sin(t * 1.4) * 22, width: 480, opacity: o, transform: `rotate(${Math.sin(t * 0.9) * 6 - 4}deg)`, filter: "drop-shadow(0 0 40px rgba(180,220,255,0.35))" }}>
      <svg viewBox="0 0 120 160" width="480">
        <path d="M32 34 C26 4 50 4 46 34 M74 34 C70 4 94 4 88 34" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
        <path d="M20 32 L100 32 L112 142 Q60 158 8 142 Z" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <path d="M30 50 L36 130 M52 46 L56 138 M78 46 L72 138" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

// 가로 막대 비교: 막대가 차례로 자란다 (아주 작은 값도 최소 6px 로 보인다)
const Bars: React.FC<{ bars: NonNullable<Shot["bars"]>; t: number }> = ({ bars, t }) => (
  <AbsoluteFill style={{ fontFamily }}>
    {bars.map((b, i) => {
      const k = interpolate(t, [b.at, b.at + 1.2], [0, 1], { ...clamp, easing: ease });
      const w = Math.max(6, 840 * (b.value / b.max) * k);
      const o = interpolate(t, [b.at, b.at + 0.3], [0, 1], clamp);
      return (
        <div key={i} style={{ position: "absolute", left: 80, top: 520 + i * 270, width: 860, opacity: o }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.text, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{b.label}</div>
          <div style={{ marginTop: 14, height: 70, width: 840, background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
            <div style={{ height: 70, width: w, background: b.color ?? C.accent, borderRadius: 8, boxShadow: `0 0 30px ${b.color ?? C.accent}` }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 64, fontWeight: 900, color: b.color ?? C.accent, opacity: interpolate(t, [b.at + 0.9, b.at + 1.3], [0, 1], clamp) }}>{b.text}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// 같은 패턴(1초)이 반복되는 파형: "이어 붙인 소리"
const Wave: React.FC<{ t: number }> = ({ t }) => {
  const N = 40;
  const o = interpolate(t, [0.1, 0.6], [0, 1], clamp);
  const cyc = (t * 40) % N; // 1초에 한 패턴(40칸)씩 흘러간다
  return (
    <AbsoluteFill style={{ fontFamily, opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: 560, display: "flex", alignItems: "center", gap: 6, height: 420 }}>
        {Array.from({ length: N }).map((_, i) => {
          const j = (i + Math.floor(cyc)) % N;
          const h = 30 + Math.abs(Math.sin(j * 0.55) * Math.cos(j * 0.17)) * 340 + ((j * 37) % 5) * 6;
          return <div key={i} style={{ width: 17, height: h, borderRadius: 8, background: j < 20 ? C.hot : C.accent, opacity: 0.9 }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1010, fontSize: 40, fontWeight: 900, color: C.dim, letterSpacing: 2 }}>↻ LOOP · LOOP · LOOP</div>
    </AbsoluteFill>
  );
};


// 붉은 도장
const Stamp: React.FC<{ st: { text: string; at: number }; t: number }> = ({ st, t }) => {
  const k = interpolate(t, [st.at, st.at + 0.22], [2.6, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const o = interpolate(t, [st.at, st.at + 0.12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 90, top: 760, opacity: o, transform: `rotate(-9deg) scale(${k})`, transformOrigin: "center", fontFamily, fontSize: 230, fontWeight: 900, color: C.hot, border: `14px solid ${C.hot}`, borderRadius: 24, padding: "0 40px", letterSpacing: 6, textShadow: "0 0 40px rgba(255,107,107,0.6)", background: "rgba(2,6,15,0.35)" }}>
      {st.text}
    </div>
  );
};

// 왼쪽 깊이 눈금: 0 m ~ 11,000 m, 마커가 내려간다
const Gauge: React.FC<{ g: { from: number; to: number; max?: number }; t: number }> = ({ g, t }) => {
  const TOP = 300, BOT = 1500, MAX = g.max ?? 11000;
  const d = interpolate(t, [0, 1.1], [g.from, g.to], { ...clamp, easing: ease });
  const y = TOP + (d / MAX) * (BOT - TOP);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 26, top: TOP, width: 4, height: BOT - TOP, background: "rgba(255,255,255,0.18)" }} />
      <div style={{ position: "absolute", left: 26, top: TOP, width: 4, height: y - TOP, background: C.accent }} />
      <div style={{ position: "absolute", left: 14, top: y - 12, width: 28, height: 28, borderRadius: 20, background: C.accent, boxShadow: "0 0 24px rgba(255,201,60,0.9)" }} />
    </AbsoluteFill>
  );
};

// 하늘을 가로지르는 빛 (UFO 목격담 연출): 밝은 점 + 번짐 + 꼬리
const Ufo: React.FC<{ u: NonNullable<Shot["ufo"]>; t: number }> = ({ u, t }) => {
  const d = u.dur ?? 2;
  const k = interpolate(t, [u.at, u.at + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  if (t < u.at) return null;
  const x = u.from[0] + (u.to[0] - u.from[0]) * k, y = u.from[1] + (u.to[1] - u.from[1]) * k;
  const fl = 0.75 + 0.25 * Math.sin(t * 40);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: x - 140, top: y - 140, width: 280, height: 280, borderRadius: 140, background: "radial-gradient(circle, rgba(255,250,220,0.95) 0%, rgba(255,220,150,0.45) 18%, rgba(255,180,90,0.12) 45%, rgba(0,0,0,0) 70%)", opacity: fl }} />
      <div style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: "#fff", boxShadow: "0 0 40px 18px rgba(255,255,230,0.9)" }} />
    </AbsoluteFill>
  );
};

// 순위 숫자 "#N": 크게 쾅 → 왼쪽 위에 남는다
const RankSlam: React.FC<{ n: number; t: number }> = ({ n, t }) => {
  const accent = useContext(AccentCtx);
  const titled = useContext(TitleCtx);
  const k = interpolate(t, [0, 0.18], [2.4, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const o = interpolate(t, [0, 0.08], [0, 1], clamp);
  const jit = t < 0.3 ? Math.sin(t * 120) * 10 * (1 - t / 0.3) : 0;
  return (
    <div style={{ position: "absolute", left: 50, top: titled ? 480 : 370, opacity: o, transform: `translateX(${jit}px) scale(${k})`, transformOrigin: "left top", fontFamily, lineHeight: 0.9 }}>
      <span style={{ fontSize: 120, fontWeight: 900, color: accent, verticalAlign: "top", textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>#</span>
      <span style={{ fontSize: 260, fontWeight: 900, color: C.text, letterSpacing: -8, textShadow: "0 8px 40px rgba(0,0,0,0.9)", WebkitTextStroke: `4px ${accent}` }}>{n}</span>
    </div>
  );
};

// 놀람 효과: 화면 흔들림 값 (샷 전체를 흔든다)
const shakeAt = (hits: Shot["hits"], t: number) => {
  let x = 0, y = 0;
  for (const h of hits ?? []) {
    if (h.kind !== "shake" && h.kind !== "glitch") continue;
    const d = t - h.at;
    if (d < 0 || d > 0.35) continue;
    const a = (h.kind === "shake" ? 26 : 14) * (1 - d / 0.35);
    x += Math.sin(d * 97) * a;
    y += Math.cos(d * 71) * a * 0.6;
  }
  return { x, y };
};

// 놀람 효과: 위에 덮는 층 (흰 섬광 · 빨간 경고 · 글리치 띠)
const HitLayer: React.FC<{ hits: NonNullable<Shot["hits"]>; t: number }> = ({ hits, t }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {hits.map((h, i) => {
      const d = t - h.at;
      if (d < 0 || d > 0.6) return null;
      if (h.kind === "flash") return <AbsoluteFill key={i} style={{ background: "#fff", opacity: interpolate(d, [0, 0.18], [0.95, 0], clamp) }} />;
      if (h.kind === "red") return <AbsoluteFill key={i} style={{ background: "#C0001A", mixBlendMode: "multiply", opacity: interpolate(d, [0, 0.05, 0.6], [0, 0.85, 0], clamp) }} />;
      if (h.kind === "glitch" && d < 0.3) {
        return (
          <AbsoluteFill key={i}>
            {Array.from({ length: 9 }).map((_, j) => {
              const seed = (j * 7919 + Math.floor(d * 30) * 104729) % 997;
              const top = (seed * 13) % H;
              const hgt = 18 + (seed % 90);
              const dx = ((seed % 2 ? 1 : -1) * (40 + (seed % 160)));
              return <div key={j} style={{ position: "absolute", left: 0, right: 0, top, height: hgt, transform: `translateX(${dx}px)`, background: j % 3 === 0 ? "rgba(255,0,60,0.45)" : j % 3 === 1 ? "rgba(0,255,230,0.35)" : "rgba(255,255,255,0.25)", mixBlendMode: "screen" }} />;
            })}
          </AbsoluteFill>
        );
      }
      return null;
    })}
  </AbsoluteFill>
);

// 초록 얼룩이 번진다 (조류 · "초록 병")
const Mold: React.FC<{ at: number; t: number }> = ({ at, t }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply", filter: "blur(22px)", opacity: 0.85 }}>
    {[
      [220, 640, 0], [700, 520, 0.25], [480, 980, 0.45], [860, 1100, 0.6], [150, 1250, 0.75], [600, 760, 0.9],
    ].map(([x, y, dl], i) => {
      const k = interpolate(t, [at + dl, at + dl + 1.6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
      const r = 120 + ((i * 53) % 90);
      return <div key={i} style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, width: r * 3.2, height: r * 3.2, borderRadius: "48% 52% 45% 55%", transform: `scale(${k}) rotate(${i * 40}deg)`, background: "radial-gradient(circle, rgba(40,120,30,0.95) 0%, rgba(70,150,40,0.7) 45%, rgba(90,160,60,0) 72%)" }} />;
    })}
  </AbsoluteFill>
);

// 접근 금지 원: 빨간 점선이 돌며 그려진다
const Zone: React.FC<{ z: NonNullable<Shot["zone"]>; t: number }> = ({ z, t }) => {
  const C2 = 2 * Math.PI * z.r;
  const draw = interpolate(t, [z.at, z.at + 1.0], [C2, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const o = interpolate(t, [z.at, z.at + 0.15], [0, 1], clamp);
  const pulse = 1 + Math.sin(t * 6) * 0.01;
  const en = useContext(LangCtx) === "en";
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={z.x} cy={z.y} r={z.r * pulse} fill="rgba(200,0,20,0.12)" stroke="#FF2A3D" strokeWidth={10} strokeDasharray={`${C2}`} strokeDashoffset={draw} transform={`rotate(-90 ${z.x} ${z.y})`} />
        <circle cx={z.x} cy={z.y} r={z.r * pulse + 22} fill="none" stroke="rgba(255,42,61,0.6)" strokeWidth={3} strokeDasharray="18 16" strokeDashoffset={-t * 60} />
      </svg>
      <div style={{ position: "absolute", left: z.r < 200 ? z.x + z.r + 24 : 430, right: 130, top: z.r < 200 ? z.y - 40 : z.y - z.r - 96, fontFamily, opacity: interpolate(t, [z.at + 0.8, z.at + 1.1], [0, 1], clamp) }}>
        <span style={{ fontSize: 54, fontWeight: 900, color: "#fff", background: "#D10F24", padding: "4px 18px", letterSpacing: 2 }}>{z.en}</span>
        {en ? null : <span style={{ marginLeft: 14, fontSize: 40, fontWeight: 900, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{z.ko}</span>}
      </div>
    </AbsoluteFill>
  );
};

// TOP N 진행 막대: 지나간 순위는 빨강, 지금 순위는 깜빡임 (브랜드 아래 둘째 줄)
const Progress: React.FC<{ data: ShotsData; fps: number }> = ({ data, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const accent = data.accent ?? C.accent;
  const N = data.progress!;
  const ranked = data.shots.filter((s) => s.rank);
  if (!ranked.length || t < ranked[0].from) return null;
  const end = data.shots.find((s) => s.type === "end");
  if (end && t >= end.from) return null;
  const cur = [...ranked].reverse().find((s) => s.from <= t)!.rank!;
  return (
    <div style={{ position: "absolute", top: data.title ? 418 : 292, left: 60, display: "flex", gap: 10, fontFamily }}>
      {Array.from({ length: N }).map((_, i) => {
        const r = N - i;
        const done = r > cur;
        const now = r === cur;
        const blink = now ? 0.65 + 0.35 * Math.abs(Math.sin(t * 5)) : 1;
        return (
          <div key={i} style={{ width: 82, height: 46, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, opacity: blink, color: now ? "#000" : done ? "#fff" : "rgba(255,255,255,0.6)", background: now ? accent : done ? "rgba(160,10,25,0.85)" : "rgba(0,0,0,0.45)", border: `3px solid ${now || done ? accent : "rgba(255,255,255,0.4)"}` }}>
            {r}
          </div>
        );
      })}
    </div>
  );
};

// 주제 머리글: 첫 프레임에 크게 튀어나와 자리를 잡고, 끝 카드 전까지 그대로 (무엇의 순위인지 늘 보이게)
const TitleBar: React.FC<{ data: ShotsData; fps: number }> = ({ data, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const accent = data.accent ?? C.accent;
  const end = data.shots.find((s) => s.type === "end");
  if (end && t >= end.from) return null;
  const k = interpolate(t, [0, 0.35], [1.35, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const [a, b] = data.lang === "en" ? [data.title!.en, data.title!.ko] : [data.title!.ko, data.title!.en];
  return (
    <div style={{ position: "absolute", top: 286, left: 60, right: 150, fontFamily, transform: `scale(${k})`, transformOrigin: "left top" }}>
      <div style={{ display: "inline-block", fontSize: 50, fontWeight: 900, letterSpacing: 1, color: "#fff", background: "rgba(0,0,0,0.55)", borderLeft: `10px solid ${accent}`, padding: "2px 16px 4px 14px", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{a}</div>
      <div style={{ marginTop: 4, marginLeft: 24, fontSize: 28, fontWeight: 700, color: accent, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{b}</div>
    </div>
  );
};

// DIVE: 깊을수록 시야가 좁아진다 (가운데는 밝게 두고 가장자리만 어둡게 — 사진이 묻히지 않게)
const DiveVignette: React.FC<{ depth: number; cfg: DiveCfg }> = ({ depth, cfg }) => {
  const k = diveFrac(depth, cfg);
  const r = 78 - 30 * k;
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 48%, rgba(0,3,10,0) ${r - 30}%, rgba(0,3,10,${0.35 + 0.5 * k}) ${r + 22}%)` }} />;
};

const DIVE_ROLL = 0.8; // 깊이 숫자가 굴러가는 시간 (초)
const DIVE_OV = 10; // 컷이 겹치는 프레임 (아래에서 밀려 올라오는 동안)

// DIVE: 편 내내 고정된 깊이 숫자 + 왼쪽 눈금 + 브랜드 (컷이 바뀌어도 움직이지 않는다)
const DiveHud: React.FC<{ data: ShotsData; fps: number }> = ({ data, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const accent = data.accent ?? C.accent;
  const end = data.shots.find((s) => s.type === "end");
  if (end && t >= end.from) return null;
  const ds = data.shots.filter((s) => s.depth !== undefined);
  if (!ds.length) return null;
  let i = 0;
  for (let j = 0; j < ds.length; j++) if (ds[j].from <= t) i = j;
  const cur = ds[i];
  const prev = i > 0 ? ds[i - 1].depth! : cur.depth!;
  const d = interpolate(t, [cur.from, cur.from + DIVE_ROLL], [prev, cur.depth!], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop = prev === cur.depth ? 1 : interpolate(t, [cur.from + DIVE_ROLL, cur.from + DIVE_ROLL + 0.25], [1.1, 1], { ...clamp, easing: ease });
  const cfg = data.dive!;
  const TOP = 330, BOT = 1490;
  const yOf = (m: number) => (cfg.up ? BOT - diveFrac(m, cfg) * (BOT - TOP) : TOP + diveFrac(m, cfg) * (BOT - TOP));
  const inKm = cfg.km !== undefined && d >= cfg.km;
  const y = yOf(d);
  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      <Brand ctx />
      {/* 눈금: 지나온 깊이마다 짧은 선, 마커가 내려간다 */}
      <div style={{ position: "absolute", left: 26, top: TOP, width: 4, height: BOT - TOP, background: "rgba(255,255,255,0.18)" }} />
      <div style={{ position: "absolute", left: 26, top: TOP, width: 4, height: y - TOP, background: accent }} />
      {ds.filter((s) => s.from <= t && s.depth! > 0).map((s, j) => (
        <div key={j} style={{ position: "absolute", left: 18, top: yOf(s.depth!) - 2, width: 20, height: 4, background: "rgba(255,255,255,0.7)" }} />
      ))}
      <div style={{ position: "absolute", left: 14, top: y - 14, width: 28, height: 28, borderRadius: 20, background: accent, boxShadow: `0 0 26px ${accent}` }} />
      {/* 깊이 숫자 */}
      <div style={{ position: "absolute", top: 300, left: 64, right: 150, transform: `scale(${pop})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: fmt(inKm ? d / 1000 : d).length >= 7 ? 160 : 196, fontWeight: 900, color: C.text, letterSpacing: -4, textShadow: "0 6px 36px rgba(0,0,0,0.9)" }}>{fmt(inKm ? d / 1000 : d)}</span>
        <span style={{ fontSize: 96, fontWeight: 900, color: accent, marginLeft: 14, textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>{inKm ? "km" : "m"}</span>
      </div>
      {data.dive!.atm ? (
        <div style={{ position: "absolute", top: 548, left: 70, fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: 1, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
          PRESSURE ≈ {fmt(d / 10 + 1)} atm
        </div>
      ) : null}
      {cfg.center ? (
        <div style={{ position: "absolute", top: 548, left: 70, fontSize: 40, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: 1, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
          {cfg.label ?? "WAY TO THE CENTER"} <span style={{ color: accent }}>{pctFmt((d / cfg.center) * 100)}%</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// DIVE 컷: 새 샷이 아래에서 밀려 올라오고, 앞 샷은 위로 빠지며 어두워진다
const DiveEntry: React.FC<{ children: React.ReactNode; first: boolean; durF: number }> = ({ children, first, durF }) => {
  const frame = useCurrentFrame();
  const dir = useContext(DiveCtx)?.up ? -1 : 1; // up: 새 샷이 위에서 내려온다 (올라가는 느낌)
  const inY = first ? 0 : interpolate(frame, [0, DIVE_OV], [H * dir, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(frame, [durF, durF + DIVE_OV], [0, -H * 0.35 * dir], { ...clamp, easing: Easing.in(Easing.quad) });
  const dim = interpolate(frame, [durF, durF + DIVE_OV], [0, 0.7], clamp);
  return (
    <AbsoluteFill style={{ transform: `translateY(${inY + outY}px)` }}>
      {children}
      {dim > 0 ? <AbsoluteFill style={{ background: "#000", opacity: dim }} /> : null}
    </AbsoluteFill>
  );
};

// 사진 + 켄 번즈 (+ 숫자 카운터)
const PhotoShot: React.FC<{ s: Shot; code: string; fps: number }> = ({ s, code, fps }) => {
  const frame = useCurrentFrame();
  const enOnly = useContext(LangCtx) === "en";
  const n = s.dur * fps;
  const p = interpolate(frame, [0, n], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const z = interpolate(p, [0, 1], s.zoom ?? [1.08, 1.28]);
  const pan = interpolate(p, [0, 1], s.pan ?? [0, 0]);
  const panY = interpolate(p, [0, 1], s.panY ?? [0, 0]);
  const [fx0, fy0] = s.focus ?? [0.5, 0.5];
  const [fx1, fy1] = s.focusTo ?? [fx0, fy0];
  const fx = fx0 + (fx1 - fx0) * p;
  const fy = fy0 + (fy1 - fy0) * p;
  const t = frame / fps;
  const c = s.counter;
  const cv = c ? interpolate(t, [c.start, c.start + c.dur], [c.from ?? 0, c.to], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const pop = c ? interpolate(t, [c.start + c.dur, c.start + c.dur + 0.25], [1.12, 1], { ...clamp, easing: ease }) : 1;
  const accent = useContext(AccentCtx);
  const sh = shakeAt(s.hits, t);
  const titled = useContext(TitleCtx);
  const dive = useContext(DiveCtx);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ overflow: "hidden", transform: `translate(${sh.x}px, ${sh.y}px) scale(${sh.x || sh.y ? 1.04 : 1})`, filter: s.blur ? `blur(${s.blur}px)` : undefined }}>
        {s.video ? (
          <OffthreadVideo
            src={staticFile(`art/${code}/${s.video}`)}
            muted
            startFrom={Math.round((s.videoStart ?? 0) * fps)}
            playbackRate={s.rate ?? 1}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `translate(${pan}%, ${panY}%) scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}
          />
        ) : s.image ? (
          <Img
            src={staticFile(`art/${code}/${s.image}`)}
            style={{ width: "100%", height: "100%", objectFit: s.fit ?? "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `translate(${pan}%, ${panY}%) scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}
          />
        ) : (
          <AbsoluteFill style={{ background: s.bg ?? "radial-gradient(ellipse at 50% 45%, #0A2340 0%, #02060F 70%)" }} />
        )}
      </AbsoluteFill>
      {!s.image && !s.video ? <Snow frame={frame} /> : dive && (s.depth ?? 0) > 0 ? <Snow frame={frame} /> : null}
      {s.ring ? <Rings t={t} /> : null}
      {s.bag ? <Bag t={t} /> : null}
      {s.gauge ? <Gauge g={s.gauge} t={t} /> : null}
      {s.bars ? <Bars bars={s.bars} t={t} /> : null}
      {s.stamp ? <Stamp st={s.stamp} t={t} /> : null}
      {s.wave ? <Wave t={t} /> : null}
      {s.mold ? <Mold at={s.mold.at} t={t} /> : null}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(5,11,24,${0.55 + (s.tint ?? 0)}) 0%, rgba(5,11,24,0.1) 30%, rgba(5,11,24,0.25) 55%, rgba(5,11,24,0.92) 88%)` }} />
      {dive && s.depth !== undefined ? <DiveVignette depth={s.depth} cfg={dive} /> : null}
      {s.ufo ? <Ufo u={s.ufo} t={t} /> : null}
      {s.zone ? <Zone z={s.zone} t={t} /> : null}
      {s.rank ? <RankSlam n={s.rank} t={t} /> : null}
      {c ? (
        <div style={{ position: "absolute", top: s.rank ? (titled ? 750 : 650) : titled ? 470 : 400, left: 60, right: 150, fontFamily, transform: `scale(${pop})`, transformOrigin: "left center", opacity: interpolate(t, [c.start - 0.05, c.start + 0.1], [0, 1], clamp) }}>
          {c.prefix ? <span style={{ fontSize: 130, fontWeight: 900, color: accent, marginRight: 8, textShadow: "0 6px 36px rgba(0,0,0,0.85)" }}>{c.prefix}</span> : null}
          <span style={{ fontSize: 210, fontWeight: 900, color: C.text, textShadow: "0 6px 36px rgba(0,0,0,0.85)", letterSpacing: -4 }}>{c.dp ? cv.toFixed(c.dp) : fmt(cv)}</span>
          <span style={{ fontSize: 100, fontWeight: 900, color: accent, marginLeft: 14 }}>{c.unit}</span>
        </div>
      ) : null}
      <Captions texts={s.texts ?? []} fps={fps} />
      <Credit text={s.credit} />
      {s.illustrative ? (
        <div style={{ position: "absolute", left: 60, top: 1470, fontFamily, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>{enOnly ? "Illustrative footage" : "연출 화면 · Illustrative footage"}</div>
      ) : null}
      {s.hits ? <HitLayer hits={s.hits} t={t} /> : null}
    </AbsoluteFill>
  );
};

// 에베레스트를 챌린저 해연에 빠뜨리기: 해수면 0 m → 10,935 m, 정상 위에 남는 물 2,086 m
const CompareShot: React.FC<{ s: Shot; fps: number }> = ({ s, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const Y0 = 360; // 해수면 y
  const PX = 820 / 10935; // 1 m 당 px
  const DEEP = 10935;
  const EVE = 8849;
  const colX = 420;
  const colW = 380;
  const bottomY = Y0 + DEEP * PX;
  const eveH = EVE * PX;
  const drop = interpolate(t, [0.3, 2.3], [-(eveH + 220), 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const land = t > 2.3 ? Math.sin((t - 2.3) * 40) * Math.max(0, 1 - (t - 2.3) * 3) * 10 : 0;
  const gap = Math.round(DEEP - EVE);
  const gapO = interpolate(t, [3.1, 3.5], [0, 1], clamp);
  const gapH = (gap * PX) * interpolate(t, [3.1, 3.8], [0, 1], { ...clamp, easing: ease });
  const topY = bottomY - eveH + drop + land;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0B1B33 0%, #0B1B33 ${(Y0 / H) * 100}%, #0F4C81 ${(Y0 / H) * 100 + 1}%, #02060F 78%)` }}>
      <Brand ctx />
      {/* 해수면 선 */}
      <div style={{ position: "absolute", left: 60, right: 150, top: Y0, height: 4, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", left: 60, top: Y0 - 54, fontFamily, fontSize: 36, fontWeight: 700, color: C.text }}>해수면 0 m · Sea level</div>
      {/* 에베레스트 */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4F7FB" />
            <stop offset="0.22" stopColor="#F4F7FB" />
            <stop offset="0.24" stopColor="#7D7468" />
            <stop offset="1" stopColor="#3C372F" />
          </linearGradient>
        </defs>
        <polygon points={`${colX + colW / 2},${topY} ${colX + colW},${topY + eveH} ${colX},${topY + eveH}`} fill="url(#rock)" />
        {/* 해저 */}
        <rect x={colX - 60} y={bottomY} width={colW + 120} height={30} fill="#1A1410" />
      </svg>
      <div style={{ position: "absolute", left: colX, width: colW, top: topY + eveH * 0.55, textAlign: "center", fontFamily, fontSize: 40, fontWeight: 900, color: C.text, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
        에베레스트<br />8,849 m
      </div>
      {/* 해저 깊이 */}
      <div style={{ position: "absolute", left: colX - 60, width: colW + 120, top: bottomY + 40, textAlign: "center", fontFamily, fontSize: 44, fontWeight: 900, color: C.accent }}>챌린저 해연 10,935 m</div>
      {/* 남는 물 */}
      <div style={{ position: "absolute", left: 360, top: Y0, width: 6, height: gapH, background: C.hot, opacity: gapO }} />
      <div style={{ position: "absolute", left: 40, width: 300, top: Y0 + (gap * PX) / 2 - 56, textAlign: "right", fontFamily, opacity: gapO }}>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.hot, letterSpacing: -2 }}>{fmt(gap)} m</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>of water left</div>
      </div>
      <Captions texts={s.texts ?? []} fps={fps} bottom={330} />
      <Credit text={s.credit} />
    </AbsoluteFill>
  );
};

// 압력: 해수면 1칸 → 약 1,000칸
const StatShot: React.FC<{ s: Shot; fps: number }> = ({ s, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const COLS = 40;
  const ROWS = 25;
  const k = Math.round(interpolate(t, [0.4, 3.2], [1, 1000], { ...clamp, easing: Easing.in(Easing.quad) }));
  const shake = t > 3.2 ? Math.sin(t * 60) * 3 * Math.max(0, 1 - (t - 3.2) * 2) : 0;
  const cells = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const on = i < k;
    cells.push(<div key={i} style={{ width: 16, height: 16, borderRadius: 3, background: i === 0 ? C.accent : on ? `hsl(${210 - (i / 1000) * 20}, 80%, ${60 - (i / 1000) * 22}%)` : "rgba(255,255,255,0.05)" }} />);
  }
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B2A4A 0%, #02060F 100%)" }}>
      <Brand ctx />
      <div style={{ position: "absolute", top: 330, left: 60, right: 150, fontFamily, display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 56, fontWeight: 700, color: C.dim }}>≈</span>
        <span style={{ fontSize: 190, fontWeight: 900, color: C.text, letterSpacing: -4 }}>{fmt(k)}</span>
        <span style={{ fontSize: 100, fontWeight: 900, color: C.accent }}>×</span>
      </div>
      <div style={{ position: "absolute", top: 560, left: 60, display: "grid", gridTemplateColumns: `repeat(${COLS}, 16px)`, gap: 3, transform: `translateX(${shake}px)` }}>{cells}</div>
      <div style={{ position: "absolute", top: 560 + ROWS * 19 + 16, left: 60, fontFamily, fontSize: 30, fontWeight: 700, color: C.accent }}>
        ↑ 노란 칸 1개 = 해수면 기압
        <br />
        <span style={{ fontSize: 26, color: C.dim }}>1 yellow cell = sea-level pressure</span>
      </div>
      <Captions texts={s.texts ?? []} fps={fps} />
      <Credit text={s.credit} />
    </AbsoluteFill>
  );
};

// 답안지 도식 (코드 그래픽, 사진 없음): cells(시험장 칸) · hand(필체) · recopy(붉은 글씨로 다시 베끼기) · seal(이름 접어 봉하기)
const INK = "#2B2118";
const PAPER = "#E9DFC8";
const RED = "#C8402B";
const wavy = (x0: number, x1: number, y: number, amp: number, seed: number) => {
  let d = `M${x0} ${y}`;
  for (let i = 1; i <= 20; i++) {
    const x = x0 + ((x1 - x0) * i) / 20;
    const yy = y + Math.sin(i * 1.7 + seed) * amp * (0.5 + 0.5 * Math.sin(i * 0.9 + seed * 2));
    d += ` L${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
};
const Sheet: React.FC<{ x: number; y: number; w: number; h: number; dim?: number }> = ({ x, y, w, h, dim = 1 }) => (
  <g opacity={dim}>
    <rect x={x + 8} y={y + 12} width={w} height={h} rx={6} fill="rgba(0,0,0,0.45)" />
    <rect x={x} y={y} width={w} height={h} rx={6} fill={PAPER} />
  </g>
);
const PaperShot: React.FC<{ s: Shot; fps: number }> = ({ s, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const accent = useContext(AccentCtx);
  const mode = s.paper?.mode ?? "hand";
  const draw = (at: number, d = 0.5) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const label = (txt: string | undefined, x: number, y: number, at: number, color = C.text, size = 40) =>
    txt ? <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontSize={size} fontWeight={900} fill={color} opacity={draw(at, 0.35)}>{txt}</text> : null;
  const rows = 8;
  let body: React.ReactNode = null;
  if (mode === "cells") {
    const drift = interpolate(t, [0, s.dur], [0, -220], clamp);
    const hot = Math.floor(interpolate(t, [0.6, 0.6 + 0.01], [0, 1], clamp)); // 1 이면 강조 칸 켜짐
    body = (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${drift}, 0)`}>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 22 }).map((__, c) => {
              const on = r === 2 && c === 9 && hot === 1;
              const x = 40 + c * 62;
              const y = 330 + r * 110;
              return (
                <g key={`${r}-${c}`}>
                  <polygon points={`${x - 4},${y + 18} ${x + 25},${y - 2} ${x + 54},${y + 18}`} fill={on ? RED : "#3A2F26"} />
                  <rect x={x} y={y + 18} width={50} height={70} fill={on ? "#F2C9A6" : "#1F1812"} stroke={on ? RED : "#4A3C30"} strokeWidth={3} />
                </g>
              );
            })
          )}
        </g>
        {label(s.paper?.a, 540, 960, 1.0, accent, 44)}
      </svg>
    );
  } else if (mode === "hand") {
    body = (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Sheet x={240} y={340} w={600} h={560} />
        {Array.from({ length: rows }).map((_, i) => (
          <path key={i} d={wavy(290, 790, 410 + i * 60, i === 3 ? 22 : 10, i * 3.1)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(0.3 + i * 0.18, 0.5)} />
        ))}
        <ellipse cx={540} cy={410 + 3 * 60} rx={250} ry={44} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="14 10" opacity={draw(2.0, 0.3)} />
        {label(s.paper?.a, 540, 960, 2.2, accent, 44)}
      </svg>
    );
  } else if (mode === "recopy") {
    const dim = interpolate(t, [2.6, 3.2], [1, 0.35], clamp);
    body = (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Sheet x={70} y={340} w={400} h={500} dim={dim} />
        <Sheet x={610} y={340} w={400} h={500} />
        {Array.from({ length: rows }).map((_, i) => (
          <g key={i}>
            <path d={wavy(100, 440, 400 + i * 55, i % 3 === 0 ? 20 : 9, i * 2.3)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={dim} />
            <path d={`M640 ${400 + i * 55} L${640 + 340 * draw(0.8 + i * 0.22, 0.4)} ${400 + i * 55}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          </g>
        ))}
        <path d="M500 600 L575 600 M555 580 L580 600 L555 620" fill="none" stroke={accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={draw(0.5, 0.3)} />
        {label(s.paper?.a, 270, 900, 0.6, C.text, 38)}
        {label(s.paper?.b, 810, 900, 1.2, RED, 38)}
      </svg>
    );
  } else {
    const fold = interpolate(t, [0.8, 1.5], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const stamp = interpolate(t, [1.9, 2.15], [1.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    body = (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Sheet x={240} y={340} w={600} h={560} />
        <g transform={`translate(0 ${340}) scale(1 ${fold}) translate(0 ${-340})`}>
          <rect x={240} y={340} width={600} height={120} rx={6} fill="#D8CBA8" stroke={INK} strokeWidth={3} />
          <path d={wavy(290, 600, 400, 14, 1.3)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        </g>
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={wavy(290, 790, 520 + i * 60, 10, i * 2.7)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        ))}
        <g opacity={interpolate(t, [1.9, 2.1], [0, 1], clamp)} transform={`translate(540 400) rotate(-8) scale(${stamp}) translate(-540 -400)`}>
          <rect x={430} y={350} width={220} height={100} rx={8} fill="none" stroke={RED} strokeWidth={8} />
          <text x={540} y={418} textAnchor="middle" fontFamily={fontFamily} fontSize={46} fontWeight={900} fill={RED}>SEALED</text>
        </g>
        {label(s.paper?.a, 540, 960, 2.3, accent, 44)}
      </svg>
    );
  }
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #17120E 0%, #0A0807 100%)" }}>
      <Brand ctx />
      {body}
      <Captions texts={s.texts ?? []} fps={fps} />
    </AbsoluteFill>
  );
};

const EndShot: React.FC<{ s: Shot; d: ShotsData; fps: number; code: string }> = ({ s, d, fps, code }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const e = d.end!;
  const main = useMain();
  const [e1, e2] = main(e.ko, e.en);
  const [q1, q2] = main(e.askKo, e.askEn);
  const [n1, n2] = e.next ? main(e.next.ko, e.next.en) : ["", ""];
  const o1 = interpolate(t, [0.1, 0.5], [0, 1], clamp);
  const o2 = interpolate(t, [1.1, 1.5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: d.endBg ?? "linear-gradient(180deg, #06142A 0%, #02060F 100%)", fontFamily }}>
      <Brand />
      <div style={{ position: "absolute", left: 60, right: 150, top: 560, opacity: o1 }}>
        <div style={{ fontSize: 70, fontWeight: 900, lineHeight: 1.2, color: C.text, whiteSpace: "pre-line" }}>{e1}</div>
        <div style={{ marginTop: 18, fontSize: 40, fontWeight: 700, lineHeight: 1.25, color: d.accent ?? C.accent, whiteSpace: "pre-line" }}>{e2}</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 150, top: 1000, opacity: o2 }}>
        <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.2, color: C.text, whiteSpace: "pre-line" }}>{q1}</div>
        <div style={{ marginTop: 16, fontSize: 38, fontWeight: 700, lineHeight: 1.25, color: C.dim, whiteSpace: "pre-line" }}>{q2}</div>
      </div>
      {e.next ? (
        <div style={{ position: "absolute", left: 60, right: 150, top: 1270, height: 230, display: "flex", gap: 26, alignItems: "center", opacity: interpolate(t, [0.6, 1.0], [0, 1], clamp) }}>
          <div style={{ width: 230, height: 230, borderRadius: 18, overflow: "hidden", border: `4px solid ${d.accent ?? C.accent}`, flexShrink: 0, position: "relative" }}>
            <Img src={staticFile(`art/${code}/${e.next.image}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${(e.next.focus?.[0] ?? 0.5) * 100}% ${(e.next.focus?.[1] ?? 0.5) * 100}%`, filter: "blur(7px) brightness(0.75)", transform: "scale(1.15)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, fontWeight: 900, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>?</div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.dim, letterSpacing: 2 }}>{d.lang === "en" ? "NEXT" : "NEXT · 다음 편"}</div>
            <div style={{ marginTop: 8, fontSize: 52, fontWeight: 900, color: C.text, lineHeight: 1.15, whiteSpace: "pre-line" }}>{n1}</div>
            <div style={{ marginTop: 6, fontSize: 34, fontWeight: 700, color: d.accent ?? C.accent }}>{n2}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 컷 전환: 블라인드 와이프 + 번쩍임 + 줌 펀치 + 잠깐 좌우 흔들림
// 글리치 컷: 0.2초 동안 좌우로 찢기는 띠 + 섬광 (공포 · 경고 분위기)
const GlitchEntry: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const on = !first && frame < 7;
  const jx = on ? ((frame * 37) % 2 ? 1 : -1) * (30 - frame * 4) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${jx}px) scale(${on ? 1.06 - frame * 0.008 : 1})` }}>{children}</AbsoluteFill>
      {on ? (
        <AbsoluteFill style={{ mixBlendMode: "screen" }}>
          {Array.from({ length: 8 }).map((_, j) => {
            const seed = (j * 7919 + frame * 104729) % 997;
            return <div key={j} style={{ position: "absolute", left: 0, right: 0, top: (seed * 17) % H, height: 20 + (seed % 120), transform: `translateX(${(seed % 2 ? 1 : -1) * (60 + (seed % 200))}px)`, background: j % 2 ? "rgba(255,0,50,0.5)" : "rgba(0,255,220,0.4)" }} />;
          })}
        </AbsoluteFill>
      ) : null}
      {first ? null : <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 3], [0.7, 0], clamp) }} />}
    </AbsoluteFill>
  );
};

const Entry: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const punch = first ? 1 : interpolate(frame, [0, 12], [1.1, 1], { ...clamp, easing: ease });
  const jit = !first && frame < 5 ? (frame % 2 ? 14 : -14) * (1 - frame / 5) : 0;
  const N = 7;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${jit}px) scale(${punch})` }}>{children}</AbsoluteFill>
      {first
        ? null
        : Array.from({ length: N }).map((_, i) => {
            const k = interpolate(frame, [i * 0.8, i * 0.8 + 7], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (H / N) * i, height: H / N + 1, background: "#02060F", transform: `scaleX(${k})`, transformOrigin: i % 2 ? "left center" : "right center", borderRight: i % 2 ? `8px solid ${C.accent}` : undefined, borderLeft: i % 2 ? undefined : `8px solid ${C.accent}` }} />
            );
          })}
      {first ? null : <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 4], [0.45, 0], clamp) }} />}
    </AbsoluteFill>
  );
};

// 부드러운 전환 (transition: "fade"): 번쩍임 · 흔들림 · 줄무늬 없이, 어두워졌다가 천천히 밝아진다. 눈이 덜 피곤하다.
// 샷 끝에서 아주 살짝 어두워지고 다음 샷이 천천히 켜진다 (끝 카드는 끝까지 유지).
const FadeEntry: React.FC<{ children: React.ReactNode; first: boolean; durF: number; last?: boolean }> = ({ children, first, durF, last }) => {
  const frame = useCurrentFrame();
  const fin = first ? 1 : interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fout = last ? 1 : interpolate(frame, [durF - 8, durF], [1, 0.0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: Math.min(fin, fout) }}>{children}</AbsoluteFill>;
};

// 세로 썸네일 (1080×1920): 가장 강한 사진 + 큰 숫자 + 한 줄
export const ThumbStill: React.FC<{ data: ShotsData; code: string }> = ({ data, code }) => {
  const t = data.thumb!;
  const accent = data.accent ?? C.accent;
  const [fx, fy] = t.focus ?? [0.6, 0.5];
  const [m1, m2] = data.lang === "en" ? [t.en, t.ko] : [t.ko, t.en];
  return (
    <AccentCtx.Provider value={accent}>
    <AbsoluteFill style={{ background: "#000", fontFamily }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(`art/${code}/${t.image}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `scale(${t.zoom ?? 1.5})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,6,15,0.85) 0%, rgba(2,6,15,0.15) 34%, rgba(2,6,15,0.2) 56%, rgba(2,6,15,0.92) 86%)" }} />
      <Brand />
      <div style={{ position: "absolute", top: 330, left: 60, right: 150, lineHeight: 0.95 }}>
        <span style={{ fontSize: 250, fontWeight: 900, color: accent, letterSpacing: -8, textShadow: "0 8px 40px rgba(0,0,0,0.9)" }}>{t.big}</span>
        <span style={{ fontSize: 100, fontWeight: 900, color: C.text, marginLeft: 10 }}>{t.unit}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 150, bottom: 480 }}>
        <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 1.1, color: C.text, textShadow: "0 4px 28px rgba(0,0,0,0.9)", whiteSpace: "pre-line" }}>{m1}</div>
        <div style={{ marginTop: 18, fontSize: 56, fontWeight: 700, color: accent, textShadow: "0 3px 18px rgba(0,0,0,0.9)", whiteSpace: "pre-line" }}>{m2}</div>
      </div>
      {t.tag ? <div style={{ position: "absolute", left: 60, top: 1512, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{t.tag}</div> : null}
    </AbsoluteFill>
    </AccentCtx.Provider>
  );
};

export const Short: React.FC<{ data: ShotsData; code: string }> = ({ data, code }) => {
  const { fps } = useVideoConfig();
  const isDive = data.transition === "dive";
  const lastIdx = data.shots.length - 1;
  const Wrap: React.FC<{ children: React.ReactNode; first: boolean; durF: number; last?: boolean }> =
    data.transition === "fade" ? FadeEntry : data.transition === "glitch" ? GlitchEntry : isDive ? DiveEntry : Entry;
  return (
    <NoCtx.Provider value={data.no ?? "No.1"}>
    <AccentCtx.Provider value={data.accent ?? C.accent}>
    <SeriesCtx.Provider value={data.series}>
    <LangCtx.Provider value={data.lang ?? "ko"}>
    <TitleCtx.Provider value={!!data.title}>
    <DiveCtx.Provider value={data.dive}>
    <AbsoluteFill style={{ background: "#000" }}>
      {data.bgm ? <Audio src={staticFile(data.bgm)} volume={0.8} /> : null}
      {data.shots.map((s, i) => (
        <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={Math.round(s.dur * fps) + (isDive && i < data.shots.length - 1 ? DIVE_OV : 0)} premountFor={15}>
          {s.type === "black" ? (
            <AbsoluteFill style={{ background: "#000" }} />
          ) : (
            <Wrap first={i === 0} durF={Math.round(s.dur * fps)} last={i === lastIdx}>
              {s.type === "photo" || s.type === "card" ? <PhotoShot s={s} code={code} fps={fps} /> : null}
              {s.type === "compare" ? <CompareShot s={s} fps={fps} /> : null}
              {s.type === "stat" ? <StatShot s={s} fps={fps} /> : null}
              {s.type === "paper" ? <PaperShot s={s} fps={fps} /> : null}
              {s.type === "end" ? <EndShot s={s} d={data} fps={fps} code={code} /> : null}
              {(s.type === "photo" || s.type === "card") && !isDive ? <Brand ctx /> : null}
            </Wrap>
          )}
        </Sequence>
      ))}
      {data.title ? <TitleBar data={data} fps={fps} /> : null}
      {data.dive ? <DiveHud data={data} fps={fps} /> : null}
      {data.progress ? <Progress data={data} fps={fps} /> : null}
    </AbsoluteFill>
    </DiveCtx.Provider>
    </TitleCtx.Provider>
    </LangCtx.Provider>
    </SeriesCtx.Provider>
    </AccentCtx.Provider>
    </NoCtx.Provider>
  );
};
