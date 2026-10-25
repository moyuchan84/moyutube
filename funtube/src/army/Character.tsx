import React from "react";
import type { Mouth } from "./mouth";

// 말하는 고등학생(→ 군인) SVG 캐릭터. 가슴 위까지만 그린다. 600×760 좌표계.
const INK = "#24180F";
const SKIN = "#FFD9B5";
const SW = 7;

export type Face = "normal" | "hype" | "shock" | "deadpan" | "cry" | "sweat" | "sleepy" | "smug";
export type Pose = "idle" | "wave" | "salute" | "shrug" | "point" | "hold";
export type CharacterProps = {
  frame: number;
  mouth: Mouth;
  speaking: boolean;
  face: Face;
  pose: Pose;
  rank: number; // 0 민간인, 1~4 이병~병장
  hair: "long" | "buzz";
  cut?: number; // 0~1: 긴 머리가 떨어지고 짧은 머리가 드러나는 정도
  hat: "none" | "cap" | "helmet";
  army: boolean;
};

const OLIVE = "#6B7D4B";
const OLIVE_DARK = "#4C5B35";

const Eye: React.FC<{ x: number; face: Face; blink: boolean; frame: number }> = ({ x, face, blink, frame }) => {
  const look = Math.sin(frame / 23) * 3;
  if (face === "cry") {
    const dir = x < 300 ? 1 : -1;
    return (
      <g>
        <path d={`M${x - 26 * dir} ${290} L${x + 14 * dir} ${302} L${x - 26 * dir} ${316}`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${x} 322 q ${-6 * dir} ${30 + (frame % 14) * 4} 0 ${60}`} fill="none" stroke="#5BB6FF" strokeWidth={10} strokeLinecap="round" opacity={0.85} />
      </g>
    );
  }
  if (face === "sleepy") {
    return (
      <g>
        <path d={`M${x - 28} 304 Q${x} ${318 + Math.sin(frame / 14) * 3} ${x + 28} 304`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
        <path d={`M${x - 22} 330 q22 14 44 0`} fill="none" stroke="#C9A47E" strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  }
  if (blink) return <path d={`M${x - 26} 304 q26 14 52 0`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
  const big = face === "shock" ? 1.25 : face === "hype" ? 1.1 : 1;
  const pupil = face === "shock" ? 6 : face === "hype" ? 15 : 12;
  return (
    <g>
      <ellipse cx={x} cy={300} rx={26 * big} ry={32 * big} fill="#fff" stroke={INK} strokeWidth={SW} />
      <circle cx={x + (face === "shock" ? 0 : look)} cy={303} r={pupil} fill={INK} />
      {face === "hype" && <path d={`M${x - 3} 290 l4 -9 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4z`} fill="#fff" transform={`translate(${-8} ${-2})`} />}
      {face === "deadpan" && <path d={`M${x - 28 * big} 296 H${x + 28 * big}`} stroke={INK} strokeWidth={SW + 3} strokeLinecap="round" />}
      {face === "deadpan" && <rect x={x - 27} y={270} width={54} height={26} fill={SKIN} />}
      {face === "smug" && <rect x={x - 28} y={265} width={56} height={32} fill={SKIN} />}
      {face === "smug" && <path d={`M${x - 28} 297 H${x + 28}`} stroke={INK} strokeWidth={SW + 2} strokeLinecap="round" />}
    </g>
  );
};

const Brows: React.FC<{ face: Face; frame: number }> = ({ face, frame }) => {
  const bounce = face === "hype" ? Math.sin(frame / 3) * 3 : 0;
  const spec: Record<Face, { y: number; tilt: number }> = {
    normal: { y: 0, tilt: 0 }, hype: { y: -14 + bounce, tilt: -6 }, shock: { y: -26, tilt: -4 }, deadpan: { y: 4, tilt: 0 },
    cry: { y: -4, tilt: 12 }, sweat: { y: -6, tilt: 14 }, sleepy: { y: 6, tilt: 6 }, smug: { y: -8, tilt: -10 },
  };
  const { y, tilt } = spec[face];
  return (
    <g stroke={INK} strokeWidth={SW + 2} strokeLinecap="round" fill="none">
      <path d={`M${208} ${y + 250 + tilt} L${268} ${y + 250 - tilt}`} />
      <path d={`M${332} ${y + 250 - tilt} L${392} ${y + 250 + tilt}`} />
    </g>
  );
};

const MouthShape: React.FC<{ mouth: Mouth; face: Face; speaking: boolean; frame: number }> = ({ mouth, face, speaking, frame }) => {
  const cx = 300, cy = 392;
  if (mouth.open < 0.07) {
    const curve = face === "cry" || face === "sweat" ? -10 : face === "deadpan" || face === "sleepy" ? 0 : face === "smug" ? 12 : 16;
    const lean = face === "smug" ? 14 : 0;
    return (
      <path d={`M${cx - 32} ${cy + lean / 2} Q${cx} ${cy + curve} ${cx + 32 + lean} ${cy - lean / 2}`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
    );
  }
  const rx = 16 + mouth.wide * 30;
  const ry = 5 + mouth.open * 36;
  const wobble = speaking ? Math.sin(frame * 1.7) * 1.2 : 0;
  return (
    <g>
      <clipPath id="mouthClip"><ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} /></clipPath>
      <ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} fill="#6B1F2A" stroke={INK} strokeWidth={SW} />
      <g clipPath="url(#mouthClip)">
        {mouth.open > 0.3 && <rect x={cx - rx} y={cy + ry * 0.35 - ry} width={rx * 2} height={Math.min(16, ry * 0.6)} fill="#fff" />}
        <ellipse cx={cx + wobble} cy={cy + ry * 0.35 + ry * 0.75} rx={rx * 0.6} ry={ry * 0.55} fill="#FF7B8A" />
      </g>
    </g>
  );
};

const Arm: React.FC<{ pts: [number, number][]; sleeve: string; hand: [number, number]; point?: boolean }> = ({ pts, sleeve, hand, point }) => (
  <g>
    <path d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke={INK} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke={sleeve} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={hand[0]} cy={hand[1]} r={36} fill={SKIN} stroke={INK} strokeWidth={SW} />
    {point && <path d={`M${hand[0] + 10} ${hand[1] - 6} l62 -22`} stroke={INK} strokeWidth={30} strokeLinecap="round" />}
    {point && <path d={`M${hand[0] + 10} ${hand[1] - 6} l62 -22`} stroke={SKIN} strokeWidth={18} strokeLinecap="round" />}
  </g>
);

const Rank: React.FC<{ rank: number }> = ({ rank }) =>
  rank > 0 ? (
    <g transform="translate(300 640)">
      <rect x={-52} y={-40} width={104} height={84} rx={10} fill="#2f3a22" stroke={INK} strokeWidth={5} />
      {Array.from({ length: rank }, (_, i) => (
        <path key={i} d={`M-34 ${-14 + i * 16} L0 ${-30 + i * 16} L34 ${-14 + i * 16}`} fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </g>
  ) : null;

export const Character: React.FC<CharacterProps> = (p) => {
  const { frame, face, pose, mouth, rank, hair, hat, army } = p;
  const cut = p.cut ?? (hair === "buzz" ? 1 : 0);
  const blink = frame % 96 < 4;
  const bob = Math.sin(frame / 7) * 4;
  const sleeve = army ? OLIVE : "#3B3B4F";
  const wave = Math.sin(frame / 2.4);

  const arms: Record<Pose, React.ReactNode> = {
    idle: <><Arm pts={[[130, 560], [100, 700]]} sleeve={sleeve} hand={[96, 745]} /><Arm pts={[[470, 560], [500, 700]]} sleeve={sleeve} hand={[504, 745]} /></>,
    wave: <><Arm pts={[[130, 560], [100, 700]]} sleeve={sleeve} hand={[96, 745]} /><Arm pts={[[470, 560], [540, 470], [520 + wave * 22, 330]]} sleeve={sleeve} hand={[520 + wave * 22, 318]} /></>,
    salute: <><Arm pts={[[130, 560], [100, 700]]} sleeve={sleeve} hand={[96, 745]} /><Arm pts={[[470, 560], [545, 400], [415, 168]]} sleeve={sleeve} hand={[405, 168]} /></>,
    shrug: <><Arm pts={[[130, 560], [60, 640], [90, 500 + wave * 6]]} sleeve={sleeve} hand={[92, 478 + wave * 6]} /><Arm pts={[[470, 560], [540, 640], [510, 500 + wave * 6]]} sleeve={sleeve} hand={[508, 478 + wave * 6]} /></>,
    point: <><Arm pts={[[130, 560], [100, 700]]} sleeve={sleeve} hand={[96, 745]} /><Arm pts={[[470, 560], [520, 480]]} sleeve={sleeve} hand={[524, 456]} point /></>,
    hold: <><Arm pts={[[130, 560], [150, 700], [220, 735]]} sleeve={sleeve} hand={[232, 735]} /><Arm pts={[[470, 560], [450, 700], [380, 735]]} sleeve={sleeve} hand={[368, 735]} /></>,
  };

  return (
    <svg viewBox="0 0 600 760" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* 몸 */}
        <path d="M70 760 Q80 520 220 490 L380 490 Q520 520 530 760 Z" fill={sleeve} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {army && (
          <g opacity={0.9}>
            <path d="M110 640 q40 -30 70 5 q-10 40 -60 30z M420 560 q40 -20 60 20 q-30 30 -60 -5z M250 700 q50 -20 80 10 q-30 30 -80 -10z" fill={OLIVE_DARK} />
          </g>
        )}
        {!army && <path d="M255 490 l-12 120 M345 490 l12 120" stroke="#fff" strokeWidth={6} strokeLinecap="round" />}
        <path d="M225 488 Q300 560 375 488" fill={army ? "#3d4a2a" : "#2a2a3a"} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <rect x={262} y={440} width={76} height={60} rx={20} fill={SKIN} stroke={INK} strokeWidth={SW} />
        <Rank rank={army ? rank : 0} />
        {arms[pose]}

        {/* 머리 */}
        <ellipse cx={150} cy={320} rx={24} ry={34} fill={SKIN} stroke={INK} strokeWidth={SW} />
        <ellipse cx={450} cy={320} rx={24} ry={34} fill={SKIN} stroke={INK} strokeWidth={SW} />
        <ellipse cx={300} cy={300} rx={152} ry={158} fill={SKIN} stroke={INK} strokeWidth={SW} />
        {/* 짧은 머리(스포츠머리) */}
        {cut > 0.25 && (
          <g opacity={Math.min(1, (cut - 0.25) * 2)}>
            <clipPath id="headTop"><ellipse cx={300} cy={300} rx={146} ry={152} /></clipPath>
            <path d="M140 300 Q150 110 300 100 Q450 110 460 300 Q440 232 300 224 Q160 232 140 300Z" fill="#3a2a20" clipPath="url(#headTop)" opacity={0.92} />
          </g>
        )}
        {/* 긴 머리: 잘리면 아래로 떨어진다 */}
        {cut < 1 && (
          <g transform={`translate(0 ${cut * cut * 620}) rotate(${cut * 28} 300 220)`} opacity={1 - cut * 0.4}>
            <path d="M138 300 Q120 120 300 100 Q480 120 462 300 Q440 220 380 196 Q330 232 250 214 Q180 230 138 300Z" fill="#3a2a20" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M300 100 Q340 60 380 90" fill="none" stroke="#3a2a20" strokeWidth={26} strokeLinecap="round" />
          </g>
        )}
        {cut > 0.02 && cut < 0.98 &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d="M0 0 q10 -6 18 2 q-8 10 -18 -2z" fill="#3a2a20" transform={`translate(${170 + i * 50} ${220 + ((cut * 1000 + i * 90) % 520)}) rotate(${i * 50 + cut * 300})`} />
          ))}

        {/* 모자 */}
        {hat === "cap" && (
          <g>
            <path d="M146 250 Q300 40 454 250 Q300 205 146 250Z" fill={OLIVE} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M146 250 Q300 205 454 250 Q420 270 300 262 Q180 270 146 250Z" fill={OLIVE_DARK} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M300 150 l8 20 l22 2 l-17 14 l6 22 l-19 -12 l-19 12 l6 -22 l-17 -14 l22 -2z" fill="#FFD23F" stroke={INK} strokeWidth={4} />
          </g>
        )}
        {hat === "helmet" && (
          <g>
            <path d="M128 262 Q130 50 300 44 Q470 50 472 262 Q300 226 128 262Z" fill={OLIVE_DARK} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M128 262 Q300 226 472 262 L480 280 Q300 244 120 280Z" fill="#3d4a2a" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M180 150 L420 150 M200 108 L400 108 M230 70 L370 70" stroke="#2f3a22" strokeWidth={5} opacity={0.8} />
          </g>
        )}

        <Brows face={face} frame={frame} />
        <Eye x={240} face={face} blink={blink} frame={frame} />
        <Eye x={360} face={face} blink={blink} frame={frame} />
        {(face === "hype" || face === "smug" || face === "cry") && (
          <g fill="#FF8FA3" opacity={0.55}>
            <ellipse cx={200} cy={355} rx={30} ry={16} />
            <ellipse cx={400} cy={355} rx={30} ry={16} />
          </g>
        )}
        <MouthShape mouth={mouth} face={face} speaking={p.speaking} frame={frame} />

        {face === "sweat" && (
          <path d={`M445 ${180 + (frame % 24) * 3} q-18 30 0 44 q18 -14 0 -44z`} fill="#8FD3FF" stroke={INK} strokeWidth={4} />
        )}
        {face === "sleepy" && (
          <g fill="#FFE066" stroke={INK} strokeWidth={3} fontFamily="sans-serif" fontWeight={900}>
            <text x={470} y={150 - (frame % 60) * 0.8} fontSize={56} opacity={0.9}>Z</text>
            <text x={520} y={100 - (frame % 60) * 0.8} fontSize={40} opacity={0.7}>z</text>
          </g>
        )}
      </g>
    </svg>
  );
};
