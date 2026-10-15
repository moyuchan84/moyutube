import { Audio } from "@remotion/media";
import { loadFont as loadJua } from "@remotion/google-fonts/Jua";
import { loadFont as loadBlackHan } from "@remotion/google-fonts/BlackHanSans";
import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Beat } from "../timeline";

export const jua = loadJua().fontFamily;
export const blackHan = loadBlackHan().fontFamily;

// 쇼츠 UI(하단 설명, 오른쪽 버튼)에 가리지 않는 영역
export const SAFE = { top: 220, bottom: 380, side: 70 };

export const Voices: React.FC<{ beats: Beat[] }> = ({ beats }) => (
  <>
    {beats.map((b) =>
      b.audio ? (
        <Sequence key={b.index} from={b.from} durationInFrames={b.speak + 5} layout="none">
          <Audio src={staticFile(b.audio)} />
        </Sequence>
      ) : null,
    )}
  </>
);

export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.6 }) => (
  <Sequence from={at} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const TitleBar: React.FC<{ title: string; color?: string; bg?: string }> = ({ title, color = "#fff", bg = "rgba(0,0,0,0.75)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: SAFE.side,
        right: SAFE.side,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        opacity: s,
      }}
    >
      <div style={{ fontFamily: blackHan, fontSize: 68, color, background: bg, padding: "18px 36px", borderRadius: 24, textAlign: "center" }}>
        {title}
      </div>
    </div>
  );
};

// 프레임 기반 흔들림
export const shakeOffset = (frame: number, start: number, length = 12, power = 18) => {
  const p = frame - start;
  if (p < 0 || p > length) return { x: 0, y: 0 };
  const decay = 1 - p / length;
  return { x: Math.sin(p * 2.7) * power * decay, y: Math.cos(p * 3.3) * power * decay };
};

export const Fill = AbsoluteFill;
