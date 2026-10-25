import React from "react";
import type { Mouth } from "./mouth";
import type { Face, Look, Pose } from "./types";

// 말하는 SVG 캐릭터 (가슴 위까지). 600×760 좌표계. 표정 · 포즈 · 머리 · 모자 · 옷 색을 바꿔 여러 역할을 한다.
const INK = "#24180F";
const SW = 7;
const OLIVE = "#6B7D4B";
const OLIVE_DARK = "#4C5B35";

export type CharacterProps = {
  frame: number;
  mouth: Mouth;
  speaking: boolean;
  face: Face;
  pose: Pose;
  look: Look;
  cut?: number; // 0~1: 긴 머리가 떨어지고 짧은 머리가 드러나는 정도
  uid?: string; // 같은 화면에 여러 명을 그릴 때 clipPath id 충돌 방지
};

const Eye: React.FC<{ x: number; face: Face; blink: boolean; frame: number; skin: string }> = ({ x, face, blink, frame, skin }) => {
  const look = Math.sin(frame / 23) * 3;
  const dir = x < 300 ? 1 : -1;
  if (face === "cry")
    return (
      <g>
        <path d={`M${x - 26 * dir} 290 L${x + 14 * dir} 302 L${x - 26 * dir} 316`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${x} 322 q ${-6 * dir} ${30 + (frame % 14) * 4} 0 60`} fill="none" stroke="#5BB6FF" strokeWidth={10} strokeLinecap="round" opacity={0.85} />
      </g>
    );
  if (face === "sleepy")
    return (
      <g>
        <path d={`M${x - 28} 304 Q${x} ${318 + Math.sin(frame / 14) * 3} ${x + 28} 304`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
        <path d={`M${x - 22} 330 q22 14 44 0`} fill="none" stroke="#C9A47E" strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  if (face === "dead")
    return <path d={`M${x - 24} 280 L${x + 24} 328 M${x + 24} 280 L${x - 24} 328`} stroke={INK} strokeWidth={SW + 2} strokeLinecap="round" />;
  if (face === "love") {
    const s = 1 + Math.sin(frame / 3) * 0.08;
    return <path transform={`translate(${x} 302) scale(${s})`} d="M0 26 C-46 -4 -30 -40 0 -16 C30 -40 46 -4 0 26Z" fill="#FF3B6B" stroke={INK} strokeWidth={5} strokeLinejoin="round" />;
  }
  if (blink) return <path d={`M${x - 26} 304 q26 14 52 0`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
  const big = face === "shock" ? 1.25 : face === "hype" ? 1.1 : face === "angry" ? 0.9 : 1;
  const pupil = face === "shock" ? 6 : face === "hype" ? 15 : 12;
  return (
    <g>
      <ellipse cx={x} cy={300} rx={26 * big} ry={32 * big} fill="#fff" stroke={INK} strokeWidth={SW} />
      <circle cx={x + (face === "shock" ? 0 : look)} cy={303} r={pupil} fill={INK} />
      {face === "hype" && <path d={`M${x - 11} 288 l4 -9 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4z`} fill="#fff" />}
      {(face === "deadpan" || face === "smug") && <rect x={x - 28 * big} y={266} width={56 * big} height={face === "smug" ? 32 : 30} fill={skin} />}
      {(face === "deadpan" || face === "smug") && <path d={`M${x - 28 * big} 297 H${x + 28 * big}`} stroke={INK} strokeWidth={SW + 3} strokeLinecap="round" />}
      {face === "angry" && <path d={`M${x - 30 * dir} 270 L${x + 30 * dir} 296 H${x - 30} V270Z`} fill={skin} opacity={0} />}
    </g>
  );
};

const Brows: React.FC<{ face: Face; frame: number }> = ({ face, frame }) => {
  const bounce = face === "hype" ? Math.sin(frame / 3) * 3 : 0;
  const spec: Record<Face, { y: number; tilt: number }> = {
    normal: { y: 0, tilt: 0 }, hype: { y: -14 + bounce, tilt: -6 }, shock: { y: -26, tilt: -4 }, deadpan: { y: 4, tilt: 0 },
    cry: { y: -4, tilt: 12 }, sweat: { y: -6, tilt: 14 }, sleepy: { y: 6, tilt: 6 }, smug: { y: -8, tilt: -10 },
    angry: { y: 14, tilt: -26 }, love: { y: -10, tilt: 8 }, dead: { y: 0, tilt: 0 },
  };
  const { y, tilt } = spec[face];
  return (
    <g stroke={INK} strokeWidth={SW + 3} strokeLinecap="round" fill="none">
      <path d={`M208 ${y + 250 + tilt} L268 ${y + 250 - tilt}`} />
      <path d={`M332 ${y + 250 - tilt} L392 ${y + 250 + tilt}`} />
    </g>
  );
};

const MouthShape: React.FC<{ mouth: Mouth; face: Face; speaking: boolean; frame: number; uid: string }> = ({ mouth, face, speaking, frame, uid }) => {
  const cx = 300, cy = 392;
  if (mouth.open < 0.07) {
    if (face === "angry") return <path d={`M${cx - 34} ${cy + 10} Q${cx} ${cy - 14} ${cx + 34} ${cy + 10}`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
    if (face === "dead") return <path d={`M${cx - 30} ${cy} q10 -10 20 0 t20 0 t20 0`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
    const curve = face === "cry" || face === "sweat" ? -10 : face === "deadpan" || face === "sleepy" ? 0 : face === "smug" ? 12 : 16;
    const lean = face === "smug" ? 14 : 0;
    return <path d={`M${cx - 32} ${cy + lean / 2} Q${cx} ${cy + curve} ${cx + 32 + lean} ${cy - lean / 2}`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
  }
  const rx = 16 + mouth.wide * 30;
  const ry = 5 + mouth.open * 36;
  const wobble = speaking ? Math.sin(frame * 1.7) * 1.2 : 0;
  const id = `mc-${uid}`;
  return (
    <g>
      <clipPath id={id}><ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} /></clipPath>
      <ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} fill="#6B1F2A" stroke={INK} strokeWidth={SW} />
      <g clipPath={`url(#${id})`}>
        {mouth.open > 0.3 && <rect x={cx - rx} y={cy + ry * 0.35 - ry} width={rx * 2} height={Math.min(16, ry * 0.6)} fill="#fff" />}
        <ellipse cx={cx + wobble} cy={cy + ry * 0.35 + ry * 0.75} rx={rx * 0.6} ry={ry * 0.55} fill="#FF7B8A" />
      </g>
    </g>
  );
};

const Arm: React.FC<{ pts: [number, number][]; sleeve: string; hand: [number, number]; skin: string; point?: boolean }> = ({ pts, sleeve, hand, skin, point }) => {
  const d = `M${pts.map((p) => p.join(" ")).join(" L")}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={sleeve} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hand[0]} cy={hand[1]} r={36} fill={skin} stroke={INK} strokeWidth={SW} />
      {point && <path d={`M${hand[0] + 10} ${hand[1] - 6} l62 -22`} stroke={INK} strokeWidth={30} strokeLinecap="round" />}
      {point && <path d={`M${hand[0] + 10} ${hand[1] - 6} l62 -22`} stroke={skin} strokeWidth={18} strokeLinecap="round" />}
    </g>
  );
};

const RankPatch: React.FC<{ rank: number }> = ({ rank }) =>
  rank > 0 ? (
    <g transform="translate(300 640)">
      <rect x={-52} y={-40} width={104} height={84} rx={10} fill="#2f3a22" stroke={INK} strokeWidth={5} />
      {Array.from({ length: rank }, (_, i) => (
        <path key={i} d={`M-34 ${-14 + i * 16} L0 ${-30 + i * 16} L34 ${-14 + i * 16}`} fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </g>
  ) : null;

export const Character: React.FC<CharacterProps> = (p) => {
  const { frame, face, pose, mouth, look } = p;
  const uid = p.uid ?? "a";
  const hair = look.hair ?? "buzz";
  const hat = look.hat ?? "none";
  const skin = look.skin ?? "#FFD9B5";
  const sleeve = look.shirt ?? (look.camo ? OLIVE : "#3B3B4F");
  const cut = p.cut ?? (hair === "long" || hair === "bob" ? 0 : 1);
  const blink = frame % 96 < 4;
  const bob = Math.sin(frame / 7) * 4;
  const wave = Math.sin(frame / 2.4);
  const down = (x: number): React.ReactNode => <Arm pts={[[x < 300 ? 130 : 470, 560], [x < 300 ? 100 : 500, 700]]} sleeve={sleeve} hand={[x < 300 ? 96 : 504, 745]} skin={skin} />;

  const arms: Record<Pose, React.ReactNode> = {
    idle: <>{down(0)}{down(600)}</>,
    wave: <>{down(0)}<Arm pts={[[470, 560], [540, 470], [520 + wave * 22, 330]]} sleeve={sleeve} hand={[520 + wave * 22, 318]} skin={skin} /></>,
    salute: <>{down(0)}<Arm pts={[[470, 560], [545, 400], [415, 168]]} sleeve={sleeve} hand={[405, 168]} skin={skin} /></>,
    shrug: <><Arm pts={[[130, 560], [60, 640], [90, 500 + wave * 6]]} sleeve={sleeve} hand={[92, 478 + wave * 6]} skin={skin} /><Arm pts={[[470, 560], [540, 640], [510, 500 + wave * 6]]} sleeve={sleeve} hand={[508, 478 + wave * 6]} skin={skin} /></>,
    point: <>{down(0)}<Arm pts={[[470, 560], [520, 480]]} sleeve={sleeve} hand={[524, 456]} skin={skin} point /></>,
    hold: <><Arm pts={[[130, 560], [150, 700], [220, 735]]} sleeve={sleeve} hand={[232, 735]} skin={skin} /><Arm pts={[[470, 560], [450, 700], [380, 735]]} sleeve={sleeve} hand={[368, 735]} skin={skin} /></>,
    cheer: <><Arm pts={[[130, 560], [50, 420], [70 + wave * 10, 230]]} sleeve={sleeve} hand={[70 + wave * 10, 210]} skin={skin} /><Arm pts={[[470, 560], [550, 420], [530 - wave * 10, 230]]} sleeve={sleeve} hand={[530 - wave * 10, 210]} skin={skin} /></>,
    facepalm: <>{down(0)}<Arm pts={[[470, 560], [520, 440], [350, 340]]} sleeve={sleeve} hand={[345, 330]} skin={skin} /></>,
  };

  return (
    <svg viewBox="0 0 600 760" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* 몸 */}
        <path d="M70 760 Q80 520 220 490 L380 490 Q520 520 530 760 Z" fill={sleeve} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {look.camo && <path d="M110 640 q40 -30 70 5 q-10 40 -60 30z M420 560 q40 -20 60 20 q-30 30 -60 -5z M250 700 q50 -20 80 10 q-30 30 -80 -10z" fill={OLIVE_DARK} opacity={0.9} />}
        {!look.camo && <path d="M255 490 l-12 120 M345 490 l12 120" stroke="#fff" strokeWidth={6} strokeLinecap="round" />}
        <path d="M225 488 Q300 560 375 488" fill="rgba(0,0,0,0.35)" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <rect x={262} y={440} width={76} height={60} rx={20} fill={skin} stroke={INK} strokeWidth={SW} />
        <RankPatch rank={look.rank ?? 0} />
        {arms[pose]}

        {/* 머리 */}
        <ellipse cx={150} cy={320} rx={24} ry={34} fill={skin} stroke={INK} strokeWidth={SW} />
        <ellipse cx={450} cy={320} rx={24} ry={34} fill={skin} stroke={INK} strokeWidth={SW} />
        <ellipse cx={300} cy={300} rx={152} ry={158} fill={skin} stroke={INK} strokeWidth={SW} />
        {/* 짧은 머리 */}
        {hair !== "none" && cut > 0.25 && (
          <g opacity={Math.min(1, (cut - 0.25) * 2)}>
            <clipPath id={`ht-${uid}`}><ellipse cx={300} cy={300} rx={146} ry={152} /></clipPath>
            <path d="M140 300 Q150 110 300 100 Q450 110 460 300 Q440 232 300 224 Q160 232 140 300Z" fill="#3a2a20" clipPath={`url(#ht-${uid})`} opacity={0.92} />
          </g>
        )}
        {/* 긴 머리 · 단발: 잘리면 아래로 떨어진다 */}
        {(hair === "long" || hair === "bob") && cut < 1 && (
          <g transform={`translate(${cut * 90} ${cut * 1300}) rotate(${cut * 40} 300 220)`} opacity={1 - cut * 0.9}>
            <path d="M138 300 Q120 120 300 100 Q480 120 462 300 Q440 220 380 196 Q330 232 250 214 Q180 230 138 300Z" fill="#3a2a20" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            {hair === "long" && <path d="M300 100 Q340 60 380 90" fill="none" stroke="#3a2a20" strokeWidth={26} strokeLinecap="round" />}
            {hair === "bob" && <path d="M138 300 Q110 420 150 470 L190 300Z M462 300 Q490 420 450 470 L410 300Z" fill="#3a2a20" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />}
          </g>
        )}
        {cut > 0.02 && cut < 0.98 && (hair === "buzz" || hair === "long") &&
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
        {hat === "beanie" && (
          <g>
            <path d="M146 250 Q150 70 300 66 Q450 70 454 250 Q300 218 146 250Z" fill="#FF5FA2" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
            <rect x={140} y={226} width={320} height={44} rx={20} fill="#FF8FC0" stroke={INK} strokeWidth={SW} />
            <circle cx={300} cy={58} r={26} fill="#fff" stroke={INK} strokeWidth={SW} />
          </g>
        )}

        <Brows face={face} frame={frame} />
        <Eye x={240} face={face} blink={blink} frame={frame} skin={skin} />
        <Eye x={360} face={face} blink={blink} frame={frame} skin={skin} />
        {(face === "hype" || face === "smug" || face === "cry" || face === "love") && (
          <g fill="#FF8FA3" opacity={0.55}><ellipse cx={200} cy={355} rx={30} ry={16} /><ellipse cx={400} cy={355} rx={30} ry={16} /></g>
        )}
        <MouthShape mouth={mouth} face={face} speaking={p.speaking} frame={frame} uid={uid} />

        {face === "sweat" && <path d={`M445 ${180 + (frame % 24) * 3} q-18 30 0 44 q18 -14 0 -44z`} fill="#8FD3FF" stroke={INK} strokeWidth={4} />}
        {face === "angry" && <path d="M130 170 l30 -30 M150 200 l40 -20 M470 170 l-30 -30 M450 200 l-40 -20" stroke="#FF3B3B" strokeWidth={10} strokeLinecap="round" />}
        {face === "sleepy" && (
          <g fill="#FFE066" stroke={INK} strokeWidth={3} fontFamily="sans-serif" fontWeight={900}>
            <text x={470} y={150 - (frame % 60) * 0.8} fontSize={56}>Z</text>
            <text x={520} y={100 - (frame % 60) * 0.8} fontSize={40}>z</text>
          </g>
        )}
      </g>
    </svg>
  );
};
