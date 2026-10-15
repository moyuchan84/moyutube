import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

// 천천히 움직이는 그라디언트 블롭 + 필름 그레인
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (x: number, y: number, r: number, color: string, phase: number) => (
    <div
      style={{
        position: "absolute",
        left: x + Math.sin(t * 0.4 + phase) * 120,
        top: y + Math.cos(t * 0.3 + phase) * 160,
        width: r,
        height: r,
        borderRadius: "50%",
        background: color,
        filter: "blur(160px)",
        opacity: 0.55,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {blob(-200, 100, 900, "#2A1E6B", 0)}
      {blob(500, 1100, 1000, "#5A1430", 2)}
      {blob(300, 600, 600, "#0E3A5C", 4)}
      <AbsoluteFill style={{ opacity: interpolate(Math.sin(t * 7), [-1, 1], [0.05, 0.09]) }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 8} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
