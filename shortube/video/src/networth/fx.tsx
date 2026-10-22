import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";

// 가구 순자산 쇼츠 전용 화면 효과 — 집 아이콘 · 동전 모두 코드로 그린다 (사진 · 로고 · 지폐 이미지 없음).
export const N = {
  bg: "#0D2A22",
  bg2: "#14392E",
  gold: "#F2C14E",
  goldDark: "#B8862B",
  cream: "#F6EFDC",
  dim: "#9DB8AC",
  low: "#7FA6C9",
  mid: "#5E8C78",
  line: "rgba(242,193,78,0.35)",
  card: "rgba(8,30,24,0.82)",
};

export const MoneyBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 30%, ${N.bg2} 0%, ${N.bg} 70%)`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: "repeating-linear-gradient(135deg, rgba(242,193,78,0.035) 0 2px, transparent 2px 28px)",
      }}
    />
  </AbsoluteFill>
);

// 장면 전환: 동전을 뒤집듯 세로축으로 돌며 들어온다 + 장면 내내 천천히 줌아웃
export const CoinFlip: React.FC<{ children: React.ReactNode; first?: boolean; dur: number }> = ({ children, first, dur }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 14], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - p, 3);
  const zoom = interpolate(frame, [0, dur], [1.06, 1], clamp);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ transform: `rotateY(${(1 - eased) * 88}deg)`, opacity: interpolate(p, [0, 0.25], [0, 1], clamp) }}>
        <MoneyBg />
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 집 아이콘 (지붕 삼각형 + 몸통 + 문)
export const House: React.FC<{ size: number; color: string; glow?: boolean }> = ({ size, color, glow }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ filter: glow ? `drop-shadow(0 0 8px ${color})` : undefined }}>
    <path d="M20 4 L37 18 L33 18 L33 36 L7 36 L7 18 L3 18 Z" fill={color} />
    <rect x="17" y="25" width="6" height="11" fill="rgba(0,0,0,0.35)" />
  </svg>
);

// 동전 더미: n 개를 위로 쌓는다 (height 를 동전 두께로 나눈 만큼)
export const CoinStack: React.FC<{ height: number; width?: number; color?: string }> = ({ height, width = 180, color = N.gold }) => {
  const t = 22;
  const n = Math.max(1, Math.floor(height / t));
  return (
    <div style={{ position: "relative", width, height: n * t + 20 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i % 2 === 0 ? 0 : 4) - 2,
            bottom: i * t,
            width,
            height: t + 8,
            borderRadius: "50%",
            background: `linear-gradient(180deg, ${color} 0%, ${N.goldDark} 100%)`,
            border: `2px solid ${N.goldDark}`,
            boxShadow: "0 3px 0 rgba(0,0,0,0.35)",
          }}
        />
      ))}
    </div>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: N.gold, background: "rgba(0,0,0,0.45)", border: `2px solid ${N.line}`, borderRadius: 999, padding: "8px 26px" }}>
        2025년 가계금융복지조사 · 2025.3월 말 기준
      </span>
    </div>
  );
};
