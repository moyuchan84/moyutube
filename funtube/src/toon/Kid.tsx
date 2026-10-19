import React from "react";

export type Pose = "normal" | "angry" | "shock" | "down" | "glow" | "hit" | "punch" | "smirk" | "sad" | "brawl";

// viewBox 기준 크기. 발 끝은 y=425.
export const KID_VB = { x: -40, y: -50, w: 320, h: 510, feet: 425 };
export const kidBox = (k: number) => ({ w: KID_VB.w * k, h: KID_VB.h * k, feet: (KID_VB.feet - KID_VB.y) * k });

type Arm = [number, number, number, number];
const ARMS: Record<Pose, [Arm, Arm]> = {
  normal: [[62, 180, 45, 300], [178, 180, 195, 300]],
  angry: [[62, 182, 48, 250], [178, 182, 192, 250]],
  punch: [[62, 182, 60, 250], [178, 185, 290, 172]],
  down: [[62, 180, 50, 312], [178, 180, 190, 312]],
  glow: [[62, 185, 26, 290], [178, 185, 214, 290]],
  hit: [[62, 180, 14, 245], [178, 180, 205, 225]],
  shock: [[62, 180, 28, 228], [178, 180, 212, 228]],
  smirk: [[62, 182, 100, 262], [178, 182, 140, 262]],
  sad: [[62, 180, 82, 304], [178, 180, 158, 304]],
  brawl: [[62, 182, 40, 230], [178, 182, 200, 230]],
};

type Props = {
  pose: Pose;
  talking: boolean;
  frame: number;
  k?: number;
  dmg?: number;
  hair?: string;
  shirt?: string;
  pants?: string;
  skin?: string;
  glasses?: boolean;
  tie?: boolean;
  // 춤용: 팔 [어깨x,어깨y,굽힘x,굽힘y,손x,손y] 두 개(왼, 오), 머리 기울기(도)
  armPts?: [number[], number[]];
  headRot?: number;
};

export const Kid: React.FC<Props> = ({ pose, talking, frame, k = 1, dmg = 0, hair = "#2b211c", shirt = "#ffffff", pants = "#2c3a63", skin = "#ffd9b8", glasses, tie, armPts, headRot }) => {
  const open = talking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.9)) : 0;
  const blink = frame % 96 > 91;
  const glow = pose === "glow";
  const hairColor = glow ? "#ffd23a" : hair;
  const wiggle = pose === "brawl" ? Math.sin(frame * 1.7) * 14 : 0;
  const arms = ARMS[pose];

  // 머리 기울기
  const headBase =
    pose === "down" ? "translate(0 24) rotate(26 120 170)"
    : pose === "hit" ? "translate(-12 4) rotate(-24 120 170)"
    : pose === "sad" ? "translate(0 8) rotate(9 120 170)"
    : pose === "brawl" ? `rotate(${wiggle * 0.7} 120 170)`
    : `translate(0 ${talking ? -Math.abs(Math.sin(frame * 0.45)) * 4 : 0})`;

  const headTf = headRot ? `${headBase} rotate(${headRot} 120 170)` : headBase;
  const ink = "#2a1d18";
  const brow = (l: [number, number, number, number], r: [number, number, number, number]) => (
    <>
      <line x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={ink} strokeWidth={7} strokeLinecap="round" />
      <line x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} stroke={ink} strokeWidth={7} strokeLinecap="round" />
    </>
  );
  const dotEyes = (ry: number) => (
    <>
      <ellipse cx={95} cy={104} rx={8} ry={blink ? 1.5 : ry} fill={ink} />
      <ellipse cx={145} cy={104} rx={8} ry={blink ? 1.5 : ry} fill={ink} />
    </>
  );
  const angryBrows = brow([76, 82, 108, 94], [164, 82, 132, 94]);
  const sadBrows = brow([78, 94, 108, 82], [162, 94, 132, 82]);

  let eyes: React.ReactNode;
  let brows: React.ReactNode = null;
  switch (pose) {
    case "angry": eyes = dotEyes(8); brows = angryBrows; break;
    case "punch": eyes = dotEyes(7); brows = angryBrows; break;
    case "glow":
      eyes = (
        <>
          <ellipse cx={95} cy={104} rx={13} ry={9} fill="#fff" stroke={ink} strokeWidth={3} />
          <ellipse cx={145} cy={104} rx={13} ry={9} fill="#fff" stroke={ink} strokeWidth={3} />
          <circle cx={95} cy={104} r={3.5} fill="#1b8f6a" />
          <circle cx={145} cy={104} r={3.5} fill="#1b8f6a" />
        </>
      );
      brows = angryBrows;
      break;
    case "shock":
      eyes = (
        <>
          <circle cx={95} cy={102} r={17} fill="#fff" stroke={ink} strokeWidth={3.5} />
          <circle cx={145} cy={102} r={17} fill="#fff" stroke={ink} strokeWidth={3.5} />
          <circle cx={95} cy={102} r={4} fill={ink} />
          <circle cx={145} cy={102} r={4} fill={ink} />
        </>
      );
      brows = brow([78, 70, 108, 68], [162, 70, 132, 68]);
      break;
    case "hit":
    case "brawl":
      eyes = (
        <>
          <path d="M82 92 L106 104 L82 116" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M158 92 L134 104 L158 116" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
      if (pose === "brawl") brows = angryBrows;
      break;
    case "smirk":
      eyes = (
        <>
          {dotEyes(7)}
          <path d="M82 96 H108 M132 96 H158" stroke={ink} strokeWidth={6} strokeLinecap="round" />
        </>
      );
      brows = brow([78, 84, 108, 80], [162, 76, 132, 86]);
      break;
    case "sad":
      eyes = (
        <>
          {dotEyes(9)}
          <path d="M146 116 q-7 18 0 26 q7 -8 0 -26z" fill="#6ec6ff" />
        </>
      );
      brows = sadBrows;
      break;
    case "down": eyes = null; break;
    default: eyes = dotEyes(10);
  }

  const m = 6 + open * 20;
  const mouth = (() => {
    if (talking) return <ellipse cx={120} cy={146} rx={14} ry={m / 2 + 2} fill="#7a2230" />;
    switch (pose) {
      case "shock": return <ellipse cx={120} cy={150} rx={10} ry={15} fill="#7a2230" />;
      case "glow": return <path d="M98 138 H142 V154 H98Z M98 146 H142 M110 138 V154 M120 138 V154 M130 138 V154" fill="#fff" stroke={ink} strokeWidth={3} />;
      case "smirk": return <path d="M102 144 Q128 160 142 134" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />;
      case "angry": case "punch": case "brawl": return <path d="M102 152 Q120 136 138 152" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />;
      case "hit": return <path d="M100 150 q10 -12 20 0 q10 12 20 0" fill="#7a2230" stroke={ink} strokeWidth={4} />;
      case "sad": return <path d="M104 152 Q120 140 136 152" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />;
      case "down": return <path d="M106 150 H134" stroke={ink} strokeWidth={5} strokeLinecap="round" />;
      default: return <path d="M106 144 Q120 154 134 144" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />;
    }
  })();

  // 머리카락: 평소 / 푹 숙임(눈을 가림) / 초사이어인(뾰족)
  const hairShape = glow ? (
    <path d="M42 104 C34 20 58 30 50 -4 L82 30 L96 -36 L122 20 L152 -32 L164 28 L202 -6 L190 40 C206 60 200 90 198 104 C182 72 152 62 120 62 C88 62 58 72 42 104Z" fill={hairColor} stroke="#c79a00" strokeWidth={3} strokeLinejoin="round" />
  ) : pose === "down" ? (
    <path d="M44 122 C34 -12 206 -12 196 122 L196 130 C160 108 80 108 44 130Z" fill={hairColor} />
  ) : (
    <path d="M42 104 C34 -6 206 -6 198 104 C182 72 152 64 120 64 C88 64 58 72 44 100Z" fill={hairColor} />
  );
  const messy = dmg >= 2 && !glow && (
    <>
      <path d="M70 40 L56 8 L92 34Z M150 36 L176 6 L170 44Z M112 34 L120 -6 L132 34Z" fill={hairColor} />
    </>
  );

  return (
    <svg width={KID_VB.w * k} height={KID_VB.h * k} viewBox={`${KID_VB.x} ${KID_VB.y} ${KID_VB.w} ${KID_VB.h}`} style={{ overflow: "visible", display: "block" }}>
      <ellipse cx={120} cy={426} rx={78} ry={12} fill="rgba(0,0,0,0.22)" />
      {/* 다리 */}
      <rect x={85} y={298} width={34} height={118} rx={10} fill={pants} />
      <rect x={123} y={298} width={34} height={118} rx={10} fill={pants} />
      <ellipse cx={100} cy={418} rx={26} ry={11} fill="#f4f4f4" stroke="#444" strokeWidth={3} />
      <ellipse cx={140} cy={418} rx={26} ry={11} fill="#f4f4f4" stroke="#444" strokeWidth={3} />
      {/* 팔(뒤) */}
      {armPts?.map(([x1, y1, cx, cy, x2, y2], i) => (
        <g key={i}>
          <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke="#00000022" strokeWidth={34} strokeLinecap="round" />
          <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={shirt} strokeWidth={28} strokeLinecap="round" />
          <circle cx={x2} cy={y2} r={18} fill={skin} stroke="#00000022" strokeWidth={3} />
        </g>
      ))}
      {!armPts && arms.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2 + (i ? wiggle : -wiggle)} y2={y2} stroke={shirt} strokeWidth={30} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2 + (i ? wiggle : -wiggle)} y2={y2} stroke="#00000022" strokeWidth={30} strokeLinecap="round" strokeDasharray="0 400" />
          <circle cx={x2 + (i ? wiggle : -wiggle)} cy={y2} r={17} fill={skin} stroke="#00000022" strokeWidth={3} />
        </g>
      ))}
      {/* 몸 */}
      <rect x={58} y={158} width={124} height={150} rx={32} fill={shirt} stroke="#00000022" strokeWidth={3} />
      <path d="M96 160 L120 196 L144 160Z" fill="#eaeaea" stroke="#00000022" strokeWidth={2} />
      {tie && <path d="M114 190 L126 190 L132 262 L120 276 L108 262Z" fill="#9b2a2a" />}
      {dmg >= 2 && <path d="M70 250 l22 8 l-6 18z" fill="#00000018" />}
      {/* 머리 */}
      <g transform={headTf}>
        <circle cx={120} cy={95} r={72} fill={pose === "angry" || pose === "punch" ? "#ffb9a0" : skin} stroke="#00000022" strokeWidth={4} />
        <circle cx={50} cy={105} r={13} fill={skin} stroke="#00000022" strokeWidth={3} />
        <circle cx={190} cy={105} r={13} fill={skin} stroke="#00000022" strokeWidth={3} />
        <ellipse cx={78} cy={128} rx={14} ry={7} fill="#ff7a9a55" />
        <ellipse cx={162} cy={128} rx={14} ry={7} fill="#ff7a9a55" />
        {eyes}
        {brows}
        {glasses && (
          <g fill="none" stroke="#222" strokeWidth={4}>
            <circle cx={95} cy={104} r={19} />
            <circle cx={145} cy={104} r={19} />
            <line x1={114} y1={104} x2={126} y2={104} />
          </g>
        )}
        {mouth}
        {dmg >= 1 && <ellipse cx={164} cy={122} rx={17} ry={14} fill="#e8504a" opacity={0.65} />}
        {dmg >= 2 && <path d="M117 126 q-2 26 2 36 q5 -2 4 -36z" fill="#d0021b" />}
        {dmg >= 2 && <path d="M62 80 l18 12 M66 96 l16 6" stroke="#b33" strokeWidth={4} strokeLinecap="round" />}
        {hairShape}
        {messy}
      </g>
    </svg>
  );
};
