import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import TL from "../../../../content/body/script/timeline.json";

// 신체(키·BMI) 숫자 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진 · 로고 없음).
// 키 = 청록, 몸무게 = 코랄, 여성 시리즈 = 보라. 벽에 붙은 키재기 자 + 저울 바늘 컨셉.

export const B = {
  bg: "#E6F4EE",
  bg2: "#D3EBE1",
  ink: "#22332E",
  dim: "#5E766C",
  height: "#13867C",
  weight: "#E8604B",
  woman: "#7F5BC9",
  line: "rgba(34,51,46,0.13)",
  card: "rgba(255,255,255,0.82)",
  stamp: "#C8372D",
};

// 왼쪽 가장자리에 붙은 벽 눈금 + 은은한 연필 줄
export const WallBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${B.bg} 0%, ${B.bg2} 100%)` }}>
    <div
      style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 54,
        backgroundImage: `repeating-linear-gradient(180deg, ${B.dim} 0 3px, transparent 3px 24px)`,
        WebkitMaskImage: "linear-gradient(90deg, #000 0 26px, transparent 26px)", maskImage: "linear-gradient(90deg, #000 0 26px, transparent 26px)",
        opacity: 0.55,
      }}
    />
    <div
      style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 54,
        backgroundImage: `repeating-linear-gradient(180deg, ${B.ink} 0 4px, transparent 4px 120px)`,
        WebkitMaskImage: "linear-gradient(90deg, #000 0 54px, transparent 54px)", maskImage: "linear-gradient(90deg, #000 0 54px, transparent 54px)",
        opacity: 0.7,
      }}
    />
  </AbsoluteFill>
);

// 장면 전환: 자 눈금 띠가 아래에서 위로 쓸고 가며 새 벽이 드러난다
export const RulerWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, TL.wipe], [0, 1], clamp);
  const y = (1 - p) * 2000;
  return (
    <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `inset(${y}px 0 0 0)` }}>
      <WallBg />
      {children}
      {p < 1 && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: y, height: 44, background: B.ink,
            backgroundImage: `repeating-linear-gradient(90deg, ${B.bg} 0 4px, transparent 4px 30px)`,
            opacity: 0.9,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// 고정 고지 띠 (앱 안전 영역 위 y≈200)
export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 205, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 28, fontWeight: 700, color: B.bg, background: "rgba(34,51,46,0.88)", borderRadius: 999, padding: "8px 26px" }}>
        의학적 조언 아님 · BMI는 진단 아님
      </span>
    </div>
  );
};

export const Txt: React.FC<{ top: number; size?: number; weight?: number; color?: string; at?: number; left?: number; right?: number; align?: "center" | "left" | "right"; children: React.ReactNode }> = ({
  top, size = 46, weight = 700, color = B.ink, at = 0, left = 80, right = 80, align = "center", children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left, right, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.3, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};

// 숫자가 찍히는 도장
export const Stamp: React.FC<{ at: number; color?: string; rotate?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, color = B.stamp, rotate = -6, style, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const s = interpolate(t, [0, 5, 9], [2.2, 0.94, 1], clamp);
  const o = interpolate(t, [0, 3], [0, 0.92], clamp);
  return (
    <div style={{ position: "absolute", fontFamily, fontWeight: 900, color, border: `7px solid ${color}`, borderRadius: 18, padding: "6px 24px", transform: `rotate(${rotate}deg) scale(${s})`, opacity: o, textAlign: "center", background: "rgba(230,244,238,0.45)", ...style }}>
      {children}
    </div>
  );
};

// 작은 출처/기준 라벨
export const Tag: React.FC<{ top: number; children: React.ReactNode; at?: number }> = ({ top, children, at = 0 }) => (
  <Txt top={top} size={28} weight={500} color={B.dim} at={at}>{children}</Txt>
);
