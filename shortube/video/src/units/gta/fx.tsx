import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import TL from "../../../../content/gta/script/timeline.json";

// GTA 6 쇼츠 공통 연출: 바닷가 도시의 노을 + 원근 격자 도로 + 야자수 실루엣 (모두 코드로 그린 도형)
// 게임 화면 · 로고 · 전용 글꼴은 쓰지 않는다 (브리프 2026-10-16_slot2 연출 카드).
export const G = {
  skyTop: "#14072E",
  skyMid: "#5A1660",
  horizon: "#FF7A3D",
  sunTop: "#FFD25A",
  sunBottom: "#FF3D81",
  pink: "#FF3D9A",
  cyan: "#2EF2FF",
  yellow: "#FFD25A",
  cream: "#FFF4E6",
  dim: "rgba(255,244,230,0.62)",
  card: "rgba(20,7,46,0.72)",
};

export const HORIZON = 1330;

export const neon = (color: string, size = 1) => ({
  color: G.cream,
  textShadow: `0 0 ${12 * size}px ${color}, 0 0 ${34 * size}px ${color}, 0 0 ${70 * size}px ${color}88`,
});

// 기울어진 굵은 고딕 (전용 글꼴 대신 Noto Sans KR 900 을 기울여 씀)
export const slant: React.CSSProperties = { fontFamily, fontWeight: 900, fontStyle: "italic", transform: "skewX(-8deg)" };

// 해는 영상 전체에 걸쳐 천천히 지고, 'expect' 장면에서 지평선에 닿는다
const sunY = (frame: number) => interpolate(frame, [0, 1700, TL.total], [760, HORIZON - 60, HORIZON - 40], clamp);

// 도로가 흐르는 속도: 평소 1, 런치 트레일러 장면부터 가속
const speedAt = (frame: number) => interpolate(frame, [TL.boost[0] - 20, TL.boost[0] + 30], [1, 2.6], clamp);

export const SunsetSky: React.FC = () => {
  const frame = useCurrentFrame();
  const y = sunY(frame);
  // 누적 이동 거리 (속도 적분 근사)
  let dist = 0;
  for (let f = 0; f < frame; f += 5) dist += speedAt(f) * 5;
  const lines = 14;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${G.skyTop} 0%, ${G.skyMid} 48%, ${G.horizon} ${(HORIZON / 1920) * 100}%, #1A0A2A ${(HORIZON / 1920) * 100}%, #0B0418 100%)` }}>
      {/* 별 */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = (i * 263) % 1080;
        const sy = (i * 151) % 640;
        const tw = 0.35 + 0.35 * Math.sin(frame / 12 + i);
        return <div key={i} style={{ position: "absolute", left: x, top: sy, width: 4, height: 4, borderRadius: 4, background: G.cream, opacity: tw }} />;
      })}
      {/* 줄무늬 해 */}
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: y - 300,
          width: 600,
          height: 600,
          borderRadius: 600,
          background: `linear-gradient(180deg, ${G.sunTop} 0%, ${G.sunBottom} 100%)`,
          boxShadow: `0 0 160px ${G.sunBottom}AA`,
          WebkitMaskImage: "linear-gradient(180deg, #000 52%, transparent 52%, transparent 56%, #000 56%, #000 64%, transparent 64%, transparent 69%, #000 69%, #000 76%, transparent 76%, transparent 82%, #000 82%)",
          maskImage: "linear-gradient(180deg, #000 52%, transparent 52%, transparent 56%, #000 56%, #000 64%, transparent 64%, transparent 69%, #000 69%, #000 76%, transparent 76%, transparent 82%, #000 82%)",
        }}
      />
      {/* 지평선 아래를 가려 해가 바다 뒤로 지게 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: HORIZON, bottom: 0, background: "linear-gradient(180deg, #2A0B3C 0%, #0B0418 100%)" }} />
      {/* 원근 격자 도로 */}
      <svg width={1080} height={1920 - HORIZON} style={{ position: "absolute", top: HORIZON, left: 0 }}>
        {Array.from({ length: 17 }, (_, i) => {
          const x = (i - 8) * 260;
          return <line key={`v${i}`} x1={540} y1={0} x2={540 + x * 2.4} y2={1920 - HORIZON} stroke={G.pink} strokeOpacity={0.55} strokeWidth={2} />;
        })}
        {Array.from({ length: lines }, (_, i) => {
          const p = ((i + (dist / 40) % 1) / lines);
          const yy = Math.pow(p, 2.2) * (1920 - HORIZON);
          return <line key={`h${i}`} x1={0} x2={1080} y1={yy} y2={yy} stroke={G.cyan} strokeOpacity={0.15 + p * 0.5} strokeWidth={1 + p * 3} />;
        })}
      </svg>
      <Palm x={-40} scale={1.15} flip={false} />
      <Palm x={900} scale={0.95} flip />
      <div style={{ position: "absolute", left: 0, right: 0, top: HORIZON - 2, height: 4, background: G.cream, boxShadow: `0 0 30px ${G.pink}` }} />
    </AbsoluteFill>
  );
};

// 야자수 실루엣 (도형)
const Palm: React.FC<{ x: number; scale: number; flip: boolean }> = ({ x, scale, flip }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 28) * 3;
  return (
    <svg
      width={300}
      height={760}
      viewBox="0 0 300 760"
      style={{ position: "absolute", left: x, top: HORIZON - 760 * scale + 40, transform: `scale(${flip ? -scale : scale}, ${scale})`, transformOrigin: "bottom center" }}
    >
      <path d="M150 760 C 160 560, 130 360, 165 180 L 178 182 C 148 360, 178 560, 172 760 Z" fill="#0B0418" />
      <g transform={`rotate(${sway} 170 180)`} fill="#0B0418">
        <path d="M170 180 C 110 120, 40 130, 0 190 C 60 150, 120 160, 170 190 Z" />
        <path d="M170 180 C 230 110, 290 130, 300 200 C 250 150, 210 160, 172 192 Z" />
        <path d="M170 180 C 150 100, 90 60, 40 70 C 100 90, 140 130, 166 186 Z" />
        <path d="M170 180 C 200 100, 250 70, 290 90 C 240 100, 200 140, 176 188 Z" />
        <path d="M170 180 C 120 200, 70 260, 60 320 C 100 260, 140 220, 172 194 Z" />
        <path d="M170 180 C 220 210, 260 270, 262 330 C 230 270, 200 230, 170 196 Z" />
      </g>
    </svg>
  );
};

// 장면 전환: 카메라가 앞으로 달려 나가듯 — 들어올 때 멀리서 다가오고, 나갈 때 화면 밖으로 지나간다
export const Drive: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], clamp);
  const exit = interpolate(frame, [dur - 10, dur], [0, 1], clamp);
  const s = 0.82 + 0.18 * enter + exit * 0.7;
  const o = Math.min(enter, 1 - exit);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, opacity: o, filter: exit > 0 ? `blur(${exit * 8}px)` : undefined }}>
      {children}
      {/* 네온 줄무늬 지우기 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 260,
          left: interpolate(frame, [0, 12], [-300, 1200], clamp),
          background: `linear-gradient(90deg, transparent, ${G.pink}66, ${G.cyan}66, transparent)`,
          transform: "skewX(-18deg)",
          opacity: enter < 1 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

// 작은 출처 꼬리표
export const Tag: React.FC<{ children: React.ReactNode; top: number; at?: number }> = ({ children, top, at = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 30, color: G.dim, opacity: o }}>
      {children}
    </div>
  );
};
