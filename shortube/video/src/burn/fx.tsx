import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";

// 음식 칼로리 → 걷기 · 달리기 쇼츠 전용 화면 효과 — 육상 트랙 · 러너 · 스톱워치 모두 코드로 그린다 (사진 · 로고 · 이모지 이미지 없음).
export const B = {
  track: "#B4462F",
  trackDark: "#8E3423",
  lane: "rgba(255,255,255,0.55)",
  white: "#FFF8F0",
  dim: "#F3C9B8",
  walk: "#7FE0C2",
  run: "#FFE45C",
  card: "rgba(60,16,8,0.78)",
  ink: "#2A0D06",
};

export const hm = (m: number) => (m < 60 ? `${m}분` : m % 60 === 0 ? `${m / 60}시간` : `${Math.floor(m / 60)}시간 ${m % 60}분`);

// 트랙 바닥: 고무 질감 노이즈 + 가로로 흐르는 레인 선
export const TrackBg: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 6) % 240;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${B.trackDark} 0%, ${B.track} 40%, ${B.track} 70%, ${B.trackDark} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.18 }}>
        <filter id="rubber">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#rubber)" />
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0 236px, ${B.lane} 236px 240px)`,
          backgroundPosition: `0 ${shift}px`,
          opacity: 0.25,
        }}
      />
    </AbsoluteFill>
  );
};

// 장면 전환: 출발 총성 섬광 + 오른쪽에서 왼쪽으로 달려 들어오는 가로 와이프
export const StartWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 12], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  const flash = first ? 0 : interpolate(frame, [0, 3, 10], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - e) * 100}%)` }}>
      <TrackBg />
      <AbsoluteFill style={{ transform: `translateX(${(1 - e) * 120}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// 달리는/걷는 사람: 막대 인형, 팔다리가 프레임마다 흔들린다
export const Runner: React.FC<{ size: number; color: string; run?: boolean; phase?: number }> = ({ size, color, run, phase = 0 }) => {
  const frame = useCurrentFrame();
  const sp = run ? 0.55 : 0.3;
  const a = Math.sin(frame * sp + phase) * (run ? 38 : 22);
  const lean = run ? 12 : 3;
  const limb = (x: number, y: number, deg: number, len: number) => (
    <line x1={x} y1={y} x2={x + Math.sin((deg * Math.PI) / 180) * len} y2={y + Math.cos((deg * Math.PI) / 180) * len} stroke={color} strokeWidth="6" strokeLinecap="round" />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <g transform={`rotate(${lean} 50 55)`}>
        <circle cx="50" cy="18" r="9" fill={color} />
        <line x1="50" y1="28" x2="50" y2="58" stroke={color} strokeWidth="7" strokeLinecap="round" />
        {limb(50, 34, a, 22)}
        {limb(50, 34, -a, 22)}
        {limb(50, 58, -a, 30)}
        {limb(50, 58, a, 30)}
      </g>
    </svg>
  );
};

// 스톱워치: 바늘이 progress(0~1) 만큼 여러 바퀴 돈다
export const Stopwatch: React.FC<{ size: number; turns: number; color?: string }> = ({ size, turns, color = B.run }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <rect x="43" y="0" width="14" height="10" rx="3" fill={B.white} />
    <circle cx="50" cy="62" r="45" fill={B.ink} stroke={B.white} strokeWidth="5" />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1="50" y1="22" x2="50" y2={i % 3 === 0 ? 30 : 26} stroke={B.white} strokeWidth="2.5" transform={`rotate(${i * 30} 50 62)`} />
    ))}
    <line x1="50" y1="62" x2="50" y2="26" stroke={color} strokeWidth="4" strokeLinecap="round" transform={`rotate(${turns * 360} 50 62)`} />
    <circle cx="50" cy="62" r="5" fill={color} />
  </svg>
);

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: B.white, background: "rgba(40,8,2,0.6)", border: `2px solid rgba(255,255,255,0.35)`, borderRadius: 999, padding: "8px 24px" }}>
        체중 70kg 어림 계산 · 개인차 큼 · 의학적 조언 아님
      </span>
    </div>
  );
};
