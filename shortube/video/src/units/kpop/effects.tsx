import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import TL from "../../../../content/kpop/script/timeline.json";

// 밝은 댄스 톤 색
export const K = {
  pink: "#FF4FA3",
  cyan: "#3DE0FF",
  yellow: "#FFD23F",
  violet: "#9B6BFF",
  bg: "#0D0820",
};

const BEAT_FRAMES = (60 / TL.bpm) * TL.fps;

// 박자마다 0→1 로 튀었다가 줄어드는 값 (전역 프레임 기준)
export const beatPulse = (frame: number) => {
  const phase = (frame % BEAT_FRAMES) / BEAT_FRAMES;
  return Math.exp(-phase * 6);
};

const sinceHit = (frame: number) => {
  let best = Infinity;
  for (const h of TL.hits) if (frame >= h) best = Math.min(best, frame - h);
  return best;
};

// 타격 순간 살짝 확대되는 줌 펀치
export const useZoomPunch = () => {
  const frame = useCurrentFrame();
  const t = sinceHit(frame);
  const punch = interpolate(t, [0, 3, 12], [0.06, 0.04, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return 1 + punch + beatPulse(frame) * 0.008;
};

// 네온 배경: 박자에 맞춰 숨 쉬는 그라디언트 + 회전하는 빛줄기
export const DanceBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const p = beatPulse(frame);
  const rot = frame * 0.25;
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 25%, ${K.violet}66, transparent 55%), radial-gradient(circle at 75% 80%, ${K.pink}55, transparent 55%), radial-gradient(circle at 80% 20%, ${K.cyan}33, transparent 50%)`,
          opacity: 0.75 + p * 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -600,
          top: -200,
          width: 2280,
          height: 2280,
          transform: `rotate(${rot}deg)`,
          background: `repeating-conic-gradient(from 0deg, rgba(255,255,255,0.045) 0deg 8deg, transparent 8deg 30deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

// 하단 이퀄라이저 막대 (박자 반응)
export const Equalizer: React.FC = () => {
  const frame = useCurrentFrame();
  const p = beatPulse(frame);
  const n = 24;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, height: 110, display: "flex", alignItems: "flex-end", gap: 8 }}>
      {Array.from({ length: n }, (_, i) => {
        const wobble = (Math.sin(frame * 0.35 + i * 1.7) + 1) / 2;
        const h = 14 + (wobble * 0.55 + p * 0.45) * 96 * (0.6 + random(`eq${i}`) * 0.4);
        const c = i % 3 === 0 ? K.pink : i % 3 === 1 ? K.cyan : K.yellow;
        return <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: c, opacity: 0.55 }} />;
      })}
    </div>
  );
};

// 타격 순간 터지는 색종이
export const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const last = [...TL.hits].reverse().find((h) => frame >= h);
  if (last == null) return null;
  const t = frame - last;
  if (t > 40) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 36 }, (_, i) => {
        const a = random(`a${last}-${i}`) * Math.PI * 2;
        const v = 14 + random(`v${last}-${i}`) * 22;
        const x = 540 + Math.cos(a) * v * t;
        const y = 860 + Math.sin(a) * v * t + 0.9 * t * t;
        const c = [K.pink, K.cyan, K.yellow, K.violet][i % 4];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 18,
              height: 10,
              background: c,
              borderRadius: 3,
              transform: `rotate(${t * 18 + i * 40}deg)`,
              opacity: interpolate(t, [25, 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// 타격 순간 하얀 섬광
export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(sinceHit(frame), [0, 8], [0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none", mixBlendMode: "overlay" }} />;
};
