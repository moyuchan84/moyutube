import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily, springs } from "../theme";

// 단어 단위로 아래에서 튀어 오르는 큰 제목
export const KineticTitle: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  stagger?: number;
}> = ({ text, delay = 0, size = 120, color = C.text, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily, fontWeight: 900, fontSize: size, lineHeight: 1.1, color, letterSpacing: -2 }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: springs.bouncy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: size * 0.25,
              opacity: Math.min(p * 1.5, 1),
              transform: `translateY(${(1 - p) * size}px) rotate(${(1 - p) * 8}deg)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; color: string; scale?: number }> = ({ children, color, scale = 1 }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily,
      fontWeight: 900,
      fontSize: 44,
      color: "#111",
      background: color,
      borderRadius: 999,
      padding: "10px 28px",
      transform: `scale(${scale})`,
      boxShadow: `0 0 40px ${color}88`,
    }}
  >
    {children}
  </div>
);
