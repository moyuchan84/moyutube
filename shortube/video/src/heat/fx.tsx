import { AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import TL from "./timeline.json";

// 폭염 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·외부 이미지 없음).

export const HEAT = {
  hot: "#FF4D2E",
  amber: "#FFB020",
  cream: "#FFF4E0",
  cool: "#5AB0FF",
  ice: "#DDF0FF",
  sepia: "#E9D8B4",
  ink: "#3B2A17",
};

// 장면 경계마다 일렁임이 잠깐 세졌다 가라앉는 전환용 세기 (0~1)
const boundarySpike = (frame: number) => {
  let v = 0;
  for (const s of TL.scenes.slice(1)) v = Math.max(v, interpolate(Math.abs(frame - s.from), [0, 9], [1, 0], clamp));
  return v;
};

// 색 온도: 1 = 한여름 빨강, 0 = 가을 파랑. cool 장면에서 식는다
export const useHeat = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 20, TL.coolFrom - 5, TL.coolFrom + 40], [0.75, 1, 1, 0], clamp);
};

// 아지랑이: 프랙탈 노이즈로 화면을 일렁이게 한다. scale 이 0 이면 필터를 끈다
export const Haze: React.FC<{ id: string; scale: number; children: React.ReactNode }> = ({ id, scale, children }) => {
  const frame = useCurrentFrame();
  const fx = 0.004 + 0.0012 * Math.cos(frame * 0.11);
  const fy = 0.02 + 0.006 * Math.sin(frame * 0.17);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency={`${fx} ${fy}`} numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: scale > 0.5 ? `url(#${id})` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 본문 전체를 감싸는 전환 아지랑이 (훅 첫 1초는 세게, 그 뒤엔 장면 경계에서만)
export const SceneHaze: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 40], [70, 0], clamp);
  const heat = frame < TL.coolFrom ? 1 : 0.4;
  return (
    <Haze id="scene-haze" scale={Math.max(intro, boundarySpike(frame) * 90 * heat)}>
      {children}
    </Haze>
  );
};

// 배경: 색 온도에 따라 빨강↔파랑, 태양 빛 번짐, 위로 올라가는 열기 줄기
export const HeatBg: React.FC = () => {
  const frame = useCurrentFrame();
  const h = useHeat();
  const base = interpolateColors(h, [0, 1], ["#06142A", "#2A0B05"]);
  const glow = interpolateColors(h, [0, 1], ["rgba(90,176,255,0.35)", "rgba(255,90,30,0.55)"]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.04;
  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      {/* 일렁임이 화면 가장자리를 끌어오지 않게 사방 80px 크게 그린다 */}
      <div style={{ position: "absolute", inset: -80, background: base }}>
      <Haze id="bg-haze" scale={28 * h}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 78% 14%, ${glow}, transparent ${48 * pulse}%), radial-gradient(circle at 20% 95%, ${glow}, transparent 45%)`,
          }}
        />
        {/* 태양 원반 */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 120,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,214,120,${0.9 * h}) 0%, rgba(255,120,40,${0.5 * h}) 45%, transparent 70%)`,
            transform: `scale(${pulse})`,
          }}
        />
        {/* 열기 줄기 */}
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.22 * h }}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 60 + i * 120;
            const off = (frame * (3 + (i % 3)) + i * 140) % 1920;
            let d = `M ${x} ${1920 - off + 400}`;
            for (let k = 1; k <= 8; k++) d += ` q ${k % 2 ? 26 : -26} -40 0 -80`;
            return <path key={i} d={d} stroke={HEAT.amber} strokeWidth={5} fill="none" strokeLinecap="round" />;
          })}
        </svg>
      </Haze>
      </div>
      {/* 비네트 */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// 빛바랜 종이 질감 (1913 쪽)
export const Paper: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", overflow: "hidden", background: HEAT.sepia, ...style }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.35 0" />
      </filter>
      <filter id="paper-stain">
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={2} seed={11} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0.5 -0.1" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-stain)" />
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(80,50,20,0.55)" }} />
  </div>
);

// 떨어지는 낙엽 (가을로 돌아오는 장면)
export const Leaves: React.FC<{ from: number; count?: number }> = ({ from, count = 18 }) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = random(`lx${i}`) * 1080;
        const speed = 5 + random(`ls${i}`) * 6;
        const delay = random(`ld${i}`) * 40;
        const y = (t - delay) * speed - 120;
        if (y < -120) return null;
        const sway = Math.sin((t + i * 13) * 0.07) * 60;
        const rot = (t + i * 30) * (2 + random(`lr${i}`) * 3);
        const col = [HEAT.amber, "#E8742A", "#C9452A", "#F2C14E"][i % 4];
        return (
          <svg key={i} width={60} height={40} style={{ position: "absolute", left: x0 + sway, top: y, transform: `rotate(${rot}deg)` }}>
            <path d="M2 20 Q 30 -6 58 20 Q 30 46 2 20 Z" fill={col} />
            <path d="M4 20 L 56 20" stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// 온도계 (훅·식는 장면)
export const Thermometer: React.FC<{ level: number; color: string; style?: React.CSSProperties }> = ({ level, color, style }) => {
  const tubeH = 520;
  const fill = Math.max(0, Math.min(1, level)) * (tubeH - 40);
  return (
    <svg width={160} height={tubeH + 140} style={{ position: "absolute", ...style }}>
      <rect x={50} y={10} width={60} height={tubeH} rx={30} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" strokeWidth={5} />
      <rect x={64} y={10 + tubeH - fill} width={32} height={fill + 20} rx={16} fill={color} />
      <circle cx={80} cy={tubeH + 60} r={62} fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth={5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={112} x2={i % 2 ? 128 : 140} y1={40 + i * 55} y2={40 + i * 55} stroke="rgba(255,255,255,0.55)" strokeWidth={4} />
      ))}
    </svg>
  );
};
