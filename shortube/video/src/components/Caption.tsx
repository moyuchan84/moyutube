import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily, springs } from "../theme";

export type Line = { text: string; from: number; to: number; em?: string[] };

// 하단 자막: 줄 단위로 튀어 올라오고, em 단어는 노란 형광펜
export const Caption: React.FC<{ lines: Line[]; bottom?: number }> = ({ lines, bottom = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = lines.find((l) => frame >= l.from && frame < l.to);
  if (!line) return null;
  const local = frame - line.from;
  const enter = spring({ frame: local, fps, config: springs.snappy });
  const exit = interpolate(frame, [line.to - 6, line.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const words = line.text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom,
        textAlign: "center",
        fontFamily,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.35,
        color: C.text,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 40}px)`,
        textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        background: "rgba(10,12,22,0.72)",
        backdropFilter: "blur(12px)",
        borderRadius: 28,
        padding: "22px 28px",
      }}
    >
      {words.map((w, i) => {
        const hot = line.em?.some((e) => w.includes(e));
        const pop = spring({ frame: local - i * 2, fps, config: springs.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: 14,
              opacity: pop,
              color: hot ? "#111" : C.text,
              background: hot ? C.accent : "transparent",
              padding: hot ? "0 10px" : 0,
              borderRadius: 8,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
