import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "./theme";

// 채널 "숫자로 보는 요즘" 프로필 그림 · 배너. 영상과 같은 색(남색 바탕 + 노랑 선 + 분홍 점)을 쓴다.

const Blobs: React.FC<{ scale: number }> = ({ scale }) => {
  const blob = (x: number, y: number, r: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: x * scale,
        top: y * scale,
        width: r * scale,
        height: r * scale,
        borderRadius: "50%",
        background: color,
        filter: `blur(${160 * scale}px)`,
        opacity: 0.6,
      }}
    />
  );
  return (
    <>
      {blob(-200, -100, 900, "#2A1E6B")}
      {blob(500, 400, 900, "#5A1430")}
      {blob(150, 250, 600, "#0E3A5C")}
    </>
  );
};

// 점들을 지나는 선 (끝점은 분홍 점)
const TrendLine: React.FC<{ pts: [number, number][]; width: number; dot: number }> = ({ pts, width, dot }) => {
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  return (
    <g>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={width * 0.8} />
      </filter>
      <path d={d} stroke={C.accent} strokeWidth={width * 1.6} opacity={0.45} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      <path d={d} stroke={C.accent} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r={dot * 2} fill={C.hot} opacity={0.25} />
      <circle cx={ex} cy={ey} r={dot} fill={C.hot} />
    </g>
  );
};

// 800x800, 원으로 잘려 보이므로 내용은 가운데 원 안에
export const ChannelIcon: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    <Blobs scale={0.9} />
    <svg width={800} height={800} style={{ position: "absolute" }}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={190 + i * 112} y={470 - i * 70} width={76} height={110 + i * 70} rx={14} fill="rgba(255,255,255,0.10)" />
      ))}
      <TrendLine
        pts={[
          [210, 430],
          [330, 360],
          [430, 400],
          [600, 215],
        ]}
        width={30}
        dot={30}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        top: 545,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 120,
        letterSpacing: -4,
        color: C.text,
      }}
    >
      요즘
    </div>
  </AbsoluteFill>
);

// 2560x1440. 모든 기기에서 보이는 안전 영역은 가운데 1546x423 (x 507~2053, y 508~931)
export const ChannelBanner: React.FC = () => {
  const pts: [number, number][] = [
    // 글자(가운데) 밑으로 지나가고, 양옆에서 위로 올라온다
    [-40, 900],
    [250, 850],
    [480, 930],
    [750, 1030],
    [1050, 1000],
    [1350, 1060],
    [1650, 1010],
    [1950, 960],
    [2150, 780],
    [2320, 820],
    [2480, 600],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <Blobs scale={2.4} />
      <svg width={2560} height={1440} style={{ position: "absolute" }}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 213} y1={0} x2={i * 213} y2={1440} stroke={C.grid} strokeWidth={2} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 200 + 120} x2={2560} y2={i * 200 + 120} stroke={C.grid} strokeWidth={2} />
        ))}
        <g opacity={0.55}>
          <TrendLine pts={pts} width={14} dot={22} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 507,
          width: 1546,
          top: 508,
          height: 423,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          color: C.text,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 140, letterSpacing: -5, lineHeight: 1, textShadow: "0 10px 60px rgba(0,0,0,0.6)" }}>
          <span style={{ color: C.accent }}>숫자</span>로 보는 요즘
        </div>
        <div style={{ marginTop: 26, fontWeight: 700, fontSize: 50, color: C.text, opacity: 0.85 }}>요즘 뜨는 것들, 그래프로 짚어 드립니다</div>
        <div style={{ marginTop: 26, display: "flex", gap: 22 }}>
          {["트렌드", "순위", "데이터"].map((t) => (
            <span
              key={t}
              style={{ fontWeight: 700, fontSize: 36, padding: "10px 34px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: C.text }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
