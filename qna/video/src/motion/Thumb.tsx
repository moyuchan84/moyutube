import { loadFont } from "@remotion/google-fonts/BlackHanSans";
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { findArt } from "../Scene";
import { INK, RED } from "../theme";

// 모답맨 썸네일 (1280×720): 놀란 아빠 얼굴 + 빨간 X + 두 줄 문구 + 정답 인물 + 오답 카운터
// 문구는 src/motion/<id>.json 의 thumb 에 적는다
const { fontFamily: DISPLAY } = loadFont("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });
const YELLOW = "#FFD23F";

// poster: 오른쪽 위에 기울여 붙이는 영화 포스터 느낌 카드 (그림 키) · posterTitle: 카드 아래 큰 제목 · textLeft: 문구 시작 x (기본 440)
export type MotionThumbSpec = { top: string; bottom: string; sub?: string; dad?: string; guest?: string; count?: number; poster?: string; posterTitle?: string; textLeft?: number; badge?: string; countLabel?: string; layers?: Layer[] }; // badge · countLabel: 내모남불처럼 다른 시리즈 이름

const BURST = Array.from({ length: 20 }, (_, i) => {
  const a0 = (i / 20) * Math.PI * 2;
  const a1 = ((i + 0.5) / 20) * Math.PI * 2;
  return `M50,50 L${50 + Math.cos(a0) * 150},${50 + Math.sin(a0) * 150} L${50 + Math.cos(a1) * 150},${50 + Math.sin(a1) * 150} Z`;
}).join(" ");

const STROKES = [
  [12, 14, 88, 14],
  [50, 14, 50, 88],
  [50, 50, 80, 50],
  [24, 44, 24, 88],
  [6, 88, 94, 88],
];

const big = (size: number, color: string): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  lineHeight: 1.02,
  color,
  WebkitTextStroke: `${Math.round(size / 9)}px ${INK}`,
  paintOrder: "stroke",
  filter: `drop-shadow(${size / 14}px ${size / 14}px 0 ${INK})`,
  whiteSpace: "nowrap",
});

export const MotionThumb: React.FC<{ episode: string; spec: MotionThumbSpec }> = ({ episode, spec }) => {
  if (spec.layers) return <LayeredThumb episode={episode} spec={spec} />;
  const dad = findArt(episode, spec.dad ?? "common/cutin/dad-shock");
  const guest = spec.guest ? findArt(episode, spec.guest) : null;
  const poster = spec.poster ? findArt(episode, spec.poster) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: RED, overflow: "hidden" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", transform: "scale(1.5)", transformOrigin: "28% 60%" }}>
        <path d={BURST} fill="#A02D23" />
      </svg>
      {/* 오답 X 위에 아빠 얼굴 */}
      <svg viewBox="0 0 100 100" width={560} height={560} style={{ position: "absolute", left: -20, top: 120, filter: `drop-shadow(10px 10px 0 ${INK})` }}>
        <g stroke={YELLOW} strokeWidth="16" strokeLinecap="round">
          <line x1="14" y1="14" x2="86" y2="86" />
          <line x1="86" y1="14" x2="14" y2="86" />
        </g>
      </svg>
      {dad ? <Img src={dad.src} style={{ position: "absolute", left: -40, bottom: -70, height: 640, transform: "rotate(-5deg)" }} /> : null}
      {poster ? (
        <div style={{ position: "absolute", right: 34, top: 40, width: 270, height: 380, transform: "rotate(5deg)", border: `7px solid #fff`, outline: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, overflow: "hidden", backgroundColor: INK }}>
          <Img src={poster.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {spec.posterTitle ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, letterSpacing: 14, color: "#fff", textShadow: "0 0 18px rgba(255,190,90,.9), 0 4px 0 #000" }}>{spec.posterTitle}</div>
          ) : null}
        </div>
      ) : null}
      {guest ? <Img src={guest.src} style={{ position: "absolute", right: -50, bottom: -60, height: 330, transform: "rotate(6deg)" }} /> : null}
      <div style={{ position: "absolute", left: spec.textLeft ?? 440, top: 128, transform: "rotate(-3deg)" }}>
        <div style={big(92, "#fff")}>{spec.top}</div>
        <div style={{ ...big(100, YELLOW), marginTop: 14 }}>{spec.bottom}</div>
        {spec.sub ? <div style={{ ...big(54, "#fff"), marginTop: 30, marginLeft: 6 }}>{spec.sub}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 28, top: 24, fontFamily: DISPLAY, fontSize: 58, color: INK, backgroundColor: YELLOW, padding: "4px 22px", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, transform: "rotate(-4deg)" }}>
        {spec.badge ?? "모답맨"}
      </div>
      {spec.count ? (
        <div style={{ position: "absolute", left: 300, top: 22, display: "flex", alignItems: "center", gap: 10, transform: "rotate(3deg)" }}>
          <div style={{ width: 92, height: 92, backgroundColor: "#fff", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
            <svg viewBox="-6 -6 112 112" width="100%" height="100%">
              {STROKES.slice(0, spec.count).map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED} strokeWidth={12} strokeLinecap="round" />
              ))}
            </svg>
          </div>
          <div style={big(46, "#fff")}>{spec.countLabel ?? "오답"} {spec.count}번</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 레이어 썸네일: 편마다 다른 구성을 thumb.layers 로 쌓는다 (위에 적은 것이 아래에 깔린다) ──
// bg: "#색" · "burst:#색:#색" · "split:#왼쪽:#오른쪽"(사선으로 반반)
// img: 그림 id. panel 이 있으면 [cx, cy, 배율] 로 잘라 테두리 액자에, sticker 면 흰 테두리 스티커
// text: style big(기본) · stamp(빨간 도장) · bubble(말풍선, tail: "l"|"r"|"b")
// arrow: "up"(빨강) · "down"(파랑) 굵은 화살표 / fx: "lines"(집중선) · "kira"(반짝이)
export type Layer = {
  bg?: string;
  img?: string;
  panel?: [number, number, number];
  w?: number;
  h?: number;
  sticker?: boolean;
  flip?: boolean;
  text?: string;
  style?: "big" | "stamp" | "bubble";
  tail?: "l" | "r" | "b";
  size?: number;
  color?: string;
  fill?: string;
  arrow?: "up" | "down";
  fx?: "lines" | "kira";
  x?: number;
  y?: number;
  rot?: number;
};

const LayerView: React.FC<{ episode: string; l: Layer; i: number }> = ({ episode, l, i }) => {
  const x = l.x ?? 640;
  const y = l.y ?? 360;
  const rot = l.rot ?? 0;
  if (l.bg) {
    if (l.bg.startsWith("#")) return <AbsoluteFill style={{ backgroundColor: l.bg }} />;
    const [kind, c1, c2] = l.bg.split(":");
    if (kind === "split")
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ backgroundColor: c1 }} />
          <AbsoluteFill style={{ backgroundColor: c2, clipPath: `polygon(${(x / 1280) * 100 + 8}% 0, 100% 0, 100% 100%, ${(x / 1280) * 100 - 8}% 100%)` }} />
        </AbsoluteFill>
      );
    return (
      <AbsoluteFill style={{ backgroundColor: c1 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ transform: "scale(1.6)", transformOrigin: `${(x / 1280) * 100}% ${(y / 720) * 100}%` }}>
          <path d={BURST} fill={c2} />
        </svg>
      </AbsoluteFill>
    );
  }
  if (l.fx === "lines")
    return (
      <AbsoluteFill>
        <svg viewBox="0 0 1280 720" width="100%" height="100%">
          {Array.from({ length: 70 }, (_, k) => {
            const a = (k / 70) * Math.PI * 2;
            const inner = 230 + ((k * 53) % 120);
            return <line key={k} x1={x + Math.cos(a) * inner} y1={y + Math.sin(a) * inner * 0.7} x2={x + Math.cos(a) * 1100} y2={y + Math.sin(a) * 1100} stroke="#fff" strokeWidth={k % 3 ? 3 : 8} opacity={0.75} />;
          })}
        </svg>
      </AbsoluteFill>
    );
  if (l.fx === "kira")
    return (
      <>
        {Array.from({ length: 7 }, (_, k) => {
          const sz = 34 + ((k * 37) % 50);
          return (
            <svg key={k} viewBox="-10 -10 20 20" width={sz} height={sz} style={{ position: "absolute", left: x + Math.cos(k * 2.4) * (90 + k * 22) - sz / 2, top: y + Math.sin(k * 2.4) * (60 + k * 14) - sz / 2, filter: "drop-shadow(0 0 6px #fff)" }}>
              <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill={k % 2 ? "#fff" : "#FFE680"} />
            </svg>
          );
        })}
      </>
    );
  if (l.arrow) {
    const sz = l.size ?? 160;
    const color = l.color ?? (l.arrow === "up" ? "#FF3B4D" : "#3D8BFF");
    return (
      <svg viewBox="0 0 100 100" width={sz} height={sz} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, transform: `rotate(${rot}deg) ${l.arrow === "down" ? "scaleY(-1)" : ""}`, filter: `drop-shadow(6px 6px 0 ${INK})`, overflow: "visible" }}>
        <path d="M50,4 L94,52 L66,52 L66,96 L34,96 L34,52 L6,52 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </svg>
    );
  }
  if (l.img) {
    const art = findArt(episode, l.img);
    if (!art) return null;
    if (l.panel) {
      const w = l.w ?? 600;
      const h = l.h ?? 420;
      const [cx, cy, sc] = l.panel;
      const iw = w * sc;
      const ih = (iw * art.h) / art.w;
      return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, overflow: "hidden", border: `8px solid #fff`, outline: `7px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, transform: `rotate(${rot}deg)`, backgroundColor: INK }}>
          <Img src={art.src} style={{ position: "absolute", width: iw, height: ih, left: w / 2 - cx * iw, top: h / 2 - cy * ih, transform: l.flip ? "scaleX(-1)" : undefined }} />
        </div>
      );
    }
    const h = l.h ?? 500;
    const w = (h * art.w) / art.h;
    const outline = l.sticker ? "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(9px 9px 0 " + INK + ")" : `drop-shadow(8px 8px 0 ${INK})`;
    return <Img src={art.src} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, height: h, width: w, transform: `rotate(${rot}deg) scaleX(${l.flip ? -1 : 1})`, filter: outline }} />;
  }
  if (l.text) {
    const size = l.size ?? 90;
    const style = l.style ?? "big";
    if (style === "stamp")
      return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${l.rot ?? -10}deg)`, fontFamily: DISPLAY, fontSize: size, color: l.color ?? RED, border: `${size / 12}px solid ${l.color ?? RED}`, borderRadius: 14, padding: `0 ${size / 4}px`, backgroundColor: "rgba(255,255,255,0.92)", boxShadow: `8px 8px 0 ${INK}`, whiteSpace: "nowrap" }}>
          {l.text}
        </div>
      );
    if (style === "bubble") {
      const tail = l.tail ?? "b";
      return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}>
          <div style={{ position: "relative", backgroundColor: l.fill ?? "#fff", border: `7px solid ${INK}`, borderRadius: 60, padding: `${size * 0.18}px ${size * 0.45}px`, boxShadow: `10px 10px 0 ${INK}`, fontFamily: DISPLAY, fontSize: size, color: l.color ?? INK, whiteSpace: "nowrap", lineHeight: 1.05 }}>
            {l.text}
            <svg viewBox="0 0 60 60" width={70} height={70} style={{ position: "absolute", overflow: "visible", ...(tail === "l" ? { left: -52, top: "40%" } : tail === "r" ? { right: -52, top: "40%", transform: "scaleX(-1)" } : { left: "45%", bottom: -60, transform: "rotate(-90deg)" }) }}>
              <path d="M60,8 L0,30 L60,46" fill={l.fill ?? "#fff"} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, ...big(size, l.color ?? "#fff") }}>
        {l.text}
      </div>
    );
  }
  return null;
};

const LayeredThumb: React.FC<{ episode: string; spec: MotionThumbSpec }> = ({ episode, spec }) => (
  <AbsoluteFill style={{ backgroundColor: RED, overflow: "hidden" }}>
    {spec.layers!.map((l, i) => (
      <LayerView key={i} episode={episode} l={l} i={i} />
    ))}
    <div style={{ position: "absolute", left: 24, top: 20, fontFamily: DISPLAY, fontSize: 50, color: INK, backgroundColor: YELLOW, padding: "2px 20px", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, transform: "rotate(-4deg)" }}>{spec.badge ?? "모답맨"}</div>
    {spec.count ? (
      <div style={{ position: "absolute", right: 24, top: 20, display: "flex", alignItems: "center", gap: 10, transform: "rotate(3deg)" }}>
        <div style={big(40, "#fff")}>{spec.countLabel ?? "오답"} {spec.count}번</div>
        <div style={{ width: 80, height: 80, backgroundColor: "#fff", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
          <svg viewBox="-6 -6 112 112" width="100%" height="100%">
            {STROKES.slice(0, spec.count).map(([x1, y1, x2, y2], k) => (
              <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED} strokeWidth={12} strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </div>
    ) : null}
  </AbsoluteFill>
);
