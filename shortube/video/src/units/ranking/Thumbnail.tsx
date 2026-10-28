import { AbsoluteFill } from "remotion";
import { Background } from "../../components/Background";
import { C, fontFamily } from "../../theme";

// 썸네일 시안. 쇼츠 썸네일은 피드 밖(검색, 채널 그리드, 쇼츠 선반, 구독 피드)에서만 보인다.
// 작게 보일 때도 읽히도록: 큰 글자 2~4단어 + 그래프 모양 하나 + 작은 맥락 태그.
export type ThumbVariant = "comeback" | "swap" | "longrun";

const Tag: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 260,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: 52,
      color: C.text,
      letterSpacing: 1,
    }}
  >
    <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "12px 34px" }}>넷플릭스 한국 TOP 10</span>
  </div>
);

const Big: React.FC<{ lines: { t: string; color?: string }[]; top: number; size?: number }> = ({ lines, top, size = 190 }) => (
  <div style={{ position: "absolute", top, left: 40, right: 40, textAlign: "center", fontFamily, fontWeight: 900, lineHeight: 1.05, letterSpacing: -6 }}>
    {lines.map((l, i) => (
      <div key={i} style={{ fontSize: size, color: l.color ?? C.text, textShadow: "0 10px 50px rgba(0,0,0,0.6)" }}>
        {l.t}
      </div>
    ))}
  </div>
);

const Glow: React.FC<{ d: string; color: string; width?: number }> = ({ d, color, width = 34 }) => (
  <g>
    <path d={d} stroke={color} strokeWidth={width + 40} opacity={0.25} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const Thumbnail: React.FC<{ variant: ThumbVariant }> = ({ variant }) => (
  <AbsoluteFill>
    <Background />
    <Tag />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {variant === "comeback" && (
        <>
          <Glow d="M140 1560 L520 1300 L900 900" color="#5FD4FF" />
          <polygon points="900,800 990,960 820,960" fill="#5FD4FF" transform="rotate(35 900 900)" />
          <text x={140} y={1680} fill={C.dim} fontFamily={fontFamily} fontWeight={900} fontSize={64}>TOP10 밖</text>
          <text x={560} y={1010} fill="#5FD4FF" fontFamily={fontFamily} fontWeight={900} fontSize={110}>7위</text>
        </>
      )}
      {variant === "swap" && (
        <>
          <Glow d="M120 960 L540 1180 L960 1400" color={C.hot} />
          <Glow d="M540 960 L960 960" color={C.accent} />
          <circle cx={540} cy={960} r={46} fill={C.accent} />
          <text x={560} y={890} fill={C.accent} fontFamily={fontFamily} fontWeight={900} fontSize={90}>NEW 1위</text>
        </>
      )}
      {variant === "longrun" && (
        <>
          <rect x={90} y={1100} width={900} height={170} rx={30} fill="#4ADE80" />
          <rect x={90} y={1330} width={675} height={110} rx={24} fill="#3A4060" />
          <text x={130} y={1220} fill="#0A0C16" fontFamily={fontFamily} fontWeight={900} fontSize={110}>12주째</text>
        </>
      )}
    </svg>
    {variant === "comeback" && <Big top={420} lines={[{ t: "시즌1" }, { t: "역주행", color: "#5FD4FF" }]} />}
    {variant === "swap" && <Big top={420} lines={[{ t: "1위가" }, { t: "바뀌었다", color: C.accent }]} size={170} />}
    {variant === "longrun" && <Big top={420} lines={[{ t: "아직도" }, { t: "TOP 10?", color: "#4ADE80" }]} size={180} />}
  </AbsoluteFill>
);
