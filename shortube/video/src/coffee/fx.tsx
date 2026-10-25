import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily, springs } from "../theme";

// 커피 숫자 쇼츠 전용 화면 효과 — 잔 · 김 · 각설탕 · 게이지 모두 코드로 그린다 (사진 · 로고 · 브랜드 없음).
// 모션그래픽 톤: 글자 블러 인 · 빛 스윕 · 물결치는 액체 · 필름 그레인 · 원형 마스크 전환 · 느린 달리 인
export const K = {
  cream: "#F4EBDD",
  cream2: "#E9D9C2",
  espresso: "#2B1A12",
  brown: "#5A3622",
  caramel: "#C8843C",
  milk: "#FFF9F0",
  foam: "#EAD6B8",
  dim: "#8A6A55",
  mint: "#1F9E86",
  red: "#D9473B",
};

// 배경: 크림 그라디언트 + 움직이는 따뜻한 빛번짐 + 필름 그레인 + 비네트
export const CafeBg: React.FC = () => {
  const frame = useCurrentFrame();
  const lx = 50 + Math.sin(frame / 70) * 25;
  const ly = 30 + Math.cos(frame / 90) * 12;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${K.cream} 0%, ${K.cream2} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,190,110,0.35) 0%, transparent 45%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.12, mixBlendMode: "multiply" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 6} />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 1 0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(60,30,10,0.28) 100%)" }} />
    </AbsoluteFill>
  );
};

// 장면 전환: 잔 위에서 본 듯한 원형 마스크가 열리며 들어온다 + 장면 내내 느린 달리 인
export const IrisIn: React.FC<{ children: React.ReactNode; first?: boolean; dur: number }> = ({ children, first, dur }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 16], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  const r = e * 120;
  const zoom = interpolate(frame, [0, dur], [1, 1.045], clamp);
  const ring = first ? 0 : interpolate(frame, [0, 8, 18], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `circle(${r}% at 50% 42%)` }}>
      <CafeBg />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, filter: p < 1 ? `blur(${(1 - e) * 10}px)` : undefined }}>{children}</AbsoluteFill>
      {ring > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "42%", width: r * 22, height: r * 22, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `14px solid ${K.caramel}`, opacity: ring }} />
      )}
    </AbsoluteFill>
  );
};

// 키네틱 타이포: 글자마다 블러 인 + 아래에서 튀어 오름, 끝나면 빛이 한 번 쓸고 지나감
export const Kinetic: React.FC<{ text: string; at?: number; size: number; color?: string; weight?: number; stagger?: number; shine?: boolean }> = ({
  text,
  at = 0,
  size,
  color = K.espresso,
  weight = 900,
  stagger = 1.6,
  shine = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = [...text];
  const sweepAt = at + chars.length * stagger + 6;
  const sx = interpolate(frame, [sweepAt, sweepAt + 22], [-30, 130], clamp);
  return (
    <span style={{ position: "relative", display: "inline-block", fontFamily, fontWeight: weight, fontSize: size, color, whiteSpace: "pre" }}>
      {chars.map((c, i) => {
        const s = spring({ frame: frame - at - i * stagger, fps, config: springs.snappy });
        return (
          <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * size * 0.5}px) scale(${0.7 + s * 0.3})`, filter: `blur(${(1 - s) * 8}px)` }}>
            {c}
          </span>
        );
      })}
      {shine && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            whiteSpace: "pre",
            color: "transparent",
            backgroundImage: `linear-gradient(105deg, transparent ${sx - 12}%, rgba(255,255,255,0.95) ${sx}%, transparent ${sx + 12}%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

// 투명 유리잔: level(0~1) 만큼 액체가 물결치며 차오른다. layers 는 아래부터 [색, 비율]
export const Cup: React.FC<{ w: number; h: number; level: number; layers: [string, number][]; label?: string }> = ({ w, h, level, layers }) => {
  const frame = useCurrentFrame();
  const top = 0.08, bottom = 0.96, inset = 0.1;
  const fillTop = bottom - (bottom - top) * level;
  const wave = (y: number, amp: number, ph: number) => {
    let d = `M 0 ${y}`;
    for (let x = 0; x <= 100; x += 5) d += ` L ${x} ${y + Math.sin(x / 9 + frame / 7 + ph) * amp}`;
    return d + ` L 100 100 L 0 100 Z`;
  };
  // 층마다 윗면 높이를 먼저 구하고, 위층부터 그려 아래층이 그 위를 덮게 한다
  let acc = 0;
  const tops = layers.map(([c, frac], i) => {
    acc += frac;
    return { c, i, y0: bottom * 100 - (bottom - fillTop) * 100 * acc };
  });
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`glass-${w}-${h}`}>
          <path d={`M ${inset * 100} ${top * 100} L ${(1 - inset) * 100} ${top * 100} L ${(1 - inset * 1.6) * 100} ${bottom * 100} L ${inset * 1.6 * 100} ${bottom * 100} Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#glass-${w}-${h})`}>
        <rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.15)" />
        {level > 0 && [...tops].reverse().map(({ c, i, y0 }) => <path key={i} d={wave(y0, i === layers.length - 1 ? 1.4 : 0.6, i)} fill={c} />)}
        <rect x="18" y="8" width="5" height="86" fill="rgba(255,255,255,0.35)" />
      </g>
      <path d={`M ${inset * 100} ${top * 100} L ${inset * 1.6 * 100} ${bottom * 100} L ${(1 - inset * 1.6) * 100} ${bottom * 100} L ${(1 - inset) * 100} ${top * 100}`} fill="none" stroke={K.brown} strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 4 }} />
    </svg>
  );
};

// 김: 잔 위로 피어오르는 흐릿한 곡선 3줄
export const Steam: React.FC<{ w: number; h: number; o?: number }> = ({ w, h, o = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" style={{ opacity: 0.55 * o, filter: "blur(3px)" }}>
      {[0, 1, 2].map((i) => {
        const x = 30 + i * 20;
        const t = (frame / 40 + i * 0.33) % 1;
        let d = `M ${x} 100`;
        for (let y = 100; y >= 0; y -= 8) d += ` L ${x + Math.sin(y / 12 + frame / 12 + i) * 6} ${y}`;
        return <path key={i} d={d} stroke={K.milk} strokeWidth="5" fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI)} transform={`translate(0 ${-t * 20})`} />;
      })}
    </svg>
  );
};

// 각설탕: 살짝 입체인 정육면체
export const Cube: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 2 L38 11 L20 20 L2 11 Z" fill="#FFFFFF" />
    <path d="M2 11 L20 20 L20 38 L2 29 Z" fill="#EFE6DA" />
    <path d="M38 11 L20 20 L20 38 L38 29 Z" fill="#DCCFBF" />
    {[6, 12, 26, 31].map((x, i) => (
      <circle key={i} cx={x} cy={14 + random(`c${i}`) * 14} r="0.9" fill="#CDBFAE" />
    ))}
  </svg>
);

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: K.milk, background: "rgba(43,26,18,0.82)", borderRadius: 999, padding: "8px 24px" }}>
        355ml(톨) 환산 · 가게 · 레시피마다 다름 · 건강 조언 아님
      </span>
    </div>
  );
};
