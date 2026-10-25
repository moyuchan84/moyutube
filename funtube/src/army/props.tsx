import React from "react";
import { blackHan } from "../components/common";

// 장면마다 캐릭터 옆에 뜨는 소품. 400×400 좌표계, t 는 장면 안 진행(0~1)
const INK = "#24180F";
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round", strokeLinecap: "round" } as const;
type P = { frame: number; t: number };

const Txt: React.FC<{ x: number; y: number; size: number; fill?: string; children: React.ReactNode; anchor?: "middle" | "start" }> = ({ x, y, size, fill = INK, children, anchor = "middle" }) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontFamily={blackHan}>{children}</text>
);

const Stopwatch: React.FC<P> = ({ frame }) => (
  <g>
    <rect x={175} y={20} width={50} height={36} rx={8} fill="#B8B8C8" {...S} />
    <circle cx={200} cy={215} r={150} fill="#fff" {...S} />
    <circle cx={200} cy={215} r={118} fill="none" stroke="#FF7A1A" strokeWidth={14} strokeDasharray="30 12" />
    <g transform={`rotate(${frame * 12} 200 215)`}><path d="M200 215 V120" stroke="#E5483B" strokeWidth={12} strokeLinecap="round" /></g>
    <Txt x={200} y={290} size={60}>1:00</Txt>
  </g>
);

const Calendar: React.FC<P> = ({ t }) => {
  const days = Math.max(1, Math.round(100 - t * 99));
  return (
    <g>
      <rect x={40} y={60} width={320} height={310} rx={26} fill="#fff" {...S} />
      <path d="M40 86 Q40 60 66 60 H334 Q360 60 360 86 V150 H40Z" fill="#E5483B" {...S} />
      <circle cx={110} cy={52} r={14} fill="#B8B8C8" {...S} /><circle cx={290} cy={52} r={14} fill="#B8B8C8" {...S} />
      <Txt x={200} y={125} size={46} fill="#fff">입영일자</Txt>
      <Txt x={200} y={290} size={110} fill="#E5483B">D-{days}</Txt>
    </g>
  );
};

const Clippers: React.FC<P> = ({ frame }) => (
  <g transform={`translate(${Math.sin(frame * 1.3) * 5} ${Math.cos(frame * 1.7) * 3})`}>
    <rect x={120} y={60} width={170} height={250} rx={44} fill="#4D7CFF" {...S} />
    <rect x={140} y={290} width={130} height={70} rx={10} fill="#D8DCE6" {...S} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${152 + i * 20} 300 v50`} stroke={INK} strokeWidth={6} />)}
    <circle cx={205} cy={130} r={26} fill="#FFD23F" {...S} />
    <path d="M60 110 l-30 -20 M60 160 l-40 0 M60 210 l-30 20" {...S} />
  </g>
);

const Duffel: React.FC<P> = ({ t }) => (
  <g>
    <path d="M30 330 Q20 130 120 110 H280 Q380 130 370 330Z" fill="#6B7D4B" {...S} />
    <path d="M100 110 Q200 10 300 110" fill="none" {...S} />
    <rect x={90} y={210} width={220} height={96} rx={10} fill="#fff" {...S} />
    <Txt x={200} y={274} size={62}>홍길동</Txt>
    {t > 0.35 && <g transform="translate(300 60) rotate(14)"><path d="M0 0 h50 v90 q0 40 -40 40 q-40 0 -40 -40z" fill="#fff" {...S} /><Txt x={5} y={78} size={26}>홍길동</Txt></g>}
  </g>
);

const Chocopie: React.FC<P> = ({ frame }) => (
  <g transform={`rotate(${Math.sin(frame / 8) * 4} 200 200)`}>
    <ellipse cx={200} cy={250} rx={150} ry={46} fill="#5a3320" {...S} />
    <ellipse cx={200} cy={200} rx={150} ry={46} fill="#fff" {...S} />
    <ellipse cx={200} cy={150} rx={150} ry={46} fill="#7a4428" {...S} />
    <ellipse cx={170} cy={140} rx={50} ry={10} fill="#a8683f" />
    <path d="M60 330 q-10 40 10 60 M340 320 q10 40 -10 60" fill="none" stroke="#5BB6FF" strokeWidth={12} strokeLinecap="round" />
  </g>
);

const Stripes1: React.FC<P> = ({ t }) => (
  <g transform={`scale(${0.8 + Math.min(1, t * 6) * 0.2}) translate(25 25)`}>
    <rect x={40} y={50} width={320} height={300} rx={26} fill="#2f3a22" {...S} />
    <path d="M90 180 L200 120 L310 180" fill="none" stroke="#FFD23F" strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
    <Txt x={200} y={300} size={64} fill="#FFD23F">이병</Txt>
  </g>
);

const Bubbles: React.FC<P> = ({ frame }) => (
  <g>
    <g transform={`rotate(${-6 + Math.sin(frame / 3) * 3} 130 120)`}>
      <path d="M20 40 H260 Q290 40 290 70 V150 Q290 180 260 180 H110 L60 230 L70 180 H50 Q20 180 20 150 V70 Q20 40 20 40Z" fill="#fff" {...S} />
      <Txt x={155} y={135} size={54} fill="#E5483B">왜 그랬냐?</Txt>
    </g>
    <g transform={`translate(70 230) rotate(${5 + Math.sin(frame / 3 + 2) * 3} 130 60)`}>
      <path d="M0 20 Q0 0 20 0 H240 Q260 0 260 20 V90 Q260 110 240 110 H200 L220 150 L160 110 H20 Q0 110 0 90Z" fill="#FFE066" {...S} />
      <Txt x={130} y={72} size={52}>죄송합니다!</Txt>
    </g>
  </g>
);

const Shovel: React.FC<P> = ({ frame, t }) => {
  const season = t < 0.55;
  return (
    <g>
      <g transform={`rotate(${Math.sin(frame / 4) * 6} 200 340)`}>
        <rect x={188} y={30} width={24} height={250} rx={10} fill="#A0764A" {...S} />
        <rect x={170} y={20} width={60} height={20} rx={8} fill="#A0764A" {...S} />
        <path d="M120 270 H280 L260 380 H140Z" fill="#B8B8C8" {...S} />
      </g>
      {season
        ? <g fill="#4CAF50" {...S}><path d="M300 380 q-10 -60 10 -90 q10 40 0 90z" /><path d="M330 380 q0 -80 30 -100 q0 60 -10 100z" /></g>
        : [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={60 + i * 70} cy={((frame * 4 + i * 80) % 420)} r={14} fill="#fff" {...S} />)}
    </g>
  );
};

const Moon: React.FC<P> = ({ frame, t }) => {
  const min = Math.floor(t * 3);
  return (
    <g>
      <path d="M250 40 A150 150 0 1 0 330 300 A120 120 0 1 1 250 40Z" fill="#FFE066" {...S} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${60 + i * 120} ${70 + (i % 2) * 40} l8 -18 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8z`} fill="#fff" opacity={0.5 + 0.5 * Math.sin(frame / 5 + i)} />)}
      <rect x={130} y={290} width={150} height={80} rx={20} fill="#0A0F2B" stroke="#FFE066" strokeWidth={8} />
      <Txt x={205} y={348} size={50} fill="#FFE066">02:0{min}</Txt>
    </g>
  );
};

const Phone: React.FC<P> = ({ frame }) => (
  <g transform={`rotate(${Math.sin(frame / 5) * 5} 200 200)`}>
    <rect x={95} y={20} width={210} height={370} rx={34} fill="#24180F" {...S} />
    <rect x={112} y={60} width={176} height={290} rx={14} fill="#fff" />
    <rect x={126} y={80} width={110} height={44} rx={14} fill="#FEE500" />
    <rect x={164} y={140} width={110} height={44} rx={14} fill="#E8E8F0" />
    <Txt x={200} y={290} size={52} fill="#E5483B">복귀 D-0</Txt>
  </g>
);

const Ranks: React.FC<P> = ({ t }) => {
  const idx = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 8} ${i * 112})`} opacity={i <= idx ? 1 : 0.28}>
          <rect x={30} y={20} width={340} height={96} rx={20} fill="#2f3a22" {...S} />
          {Array.from({ length: i + 2 }, (_, k) => <path key={k} d={`M${52 + k * 30} 94 l16 -20 l16 20`} fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />)}
          <Txt x={290} y={86} size={48} fill="#FFD23F">{["일병", "상병", "병장"][i]}</Txt>
        </g>
      ))}
    </g>
  );
};

const Snacks: React.FC<P> = ({ frame }) => (
  <g>
    <path d="M40 160 H360 L330 380 H70Z" fill="#fff" {...S} />
    <path d="M60 160 Q200 40 340 160" fill="none" {...S} />
    <Txt x={200} y={290} size={90} fill="#E64980">PX</Txt>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${90 + i * 100} ${70 - Math.abs(Math.sin(frame / 6 + i)) * 24}) rotate(${(i - 1) * 14})`}>
        <rect x={-26} y={0} width={52} height={80} rx={10} fill={["#FFD23F", "#4D7CFF", "#E5483B"][i]} {...S} />
      </g>
    ))}
  </g>
);

const Discharge: React.FC<P> = ({ frame }) => (
  <g transform={`rotate(${Math.sin(frame / 6) * 6} 200 200)`}>
    <path d="M40 260 Q200 20 360 260 Q200 230 40 260Z" fill="#6B7D4B" {...S} />
    <path d="M40 260 Q200 230 360 260 L380 300 Q200 266 20 300Z" fill="#4C5B35" {...S} />
    <rect x={90} y={300} width={220} height={74} rx={14} fill="#FFD23F" {...S} />
    <Txt x={200} y={355} size={56}>전역!</Txt>
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={40 + i * 80} cy={(frame * 5 + i * 90) % 300} r={9} fill={["#E5483B", "#4D7CFF", "#FFD23F"][i % 3]} />)}
  </g>
);

const Stamp: React.FC<P> = ({ t }) => (
  <g transform={`rotate(-12 200 200) scale(${1 + Math.max(0, 0.5 - t * 3)})`} transform-origin="200 200">
    <circle cx={200} cy={200} r={150} fill="none" stroke="#E5483B" strokeWidth={16} />
    <circle cx={200} cy={200} r={126} fill="none" stroke="#E5483B" strokeWidth={5} />
    <Txt x={200} y={235} size={96} fill="#E5483B">NOPE</Txt>
  </g>
);

export const PROPS: Record<string, React.FC<P>> = {
  stopwatch: Stopwatch, calendar: Calendar, clippers: Clippers, duffel: Duffel, chocopie: Chocopie, stripes1: Stripes1,
  bubbles: Bubbles, shovel: Shovel, moon: Moon, phone: Phone, ranks: Ranks, snacks: Snacks, discharge: Discharge, stamp: Stamp,
};
