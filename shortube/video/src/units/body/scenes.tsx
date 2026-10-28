import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { B, Stamp, Tag, Txt } from "./fx";
import D from "../../../../content/body/script/data.json";

// 숫자는 output/briefs/2026-10-21_body.md 사실 카드와 src/body/data.json 에서만 가져온다.
// 인물 · 사진 · 로고 없음. partial 카드는 화면에 '보도 기준' 표기.

const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const num = (v: number, d = 1) => v.toFixed(d);

// 0. 훅 — 키재기 자(키) + 저울 바늘(몸무게)
const HOOK_L: Line[] = [{ text: "한국 30대 초반 남자, 42년 새 키 +8.5cm 몸무게 +17.2kg", from: 10, to: 150, em: ["+8.5cm", "+17.2kg"] }];
const rY = (h: number) => 1250 - (h - 160) * 38.5;
const gAng = (w: number) => -90 + ((w - 50) / 40) * 180;
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = ease(frame, 24, 90);
  const h = lerp(D.man30.h[0], D.man30.h[1], t);
  const w = lerp(D.man30.w[0], D.man30.w[1], ease(frame, 44, 110));
  const cx = 745, cy = 880, r = 170;
  const a = (gAng(w) * Math.PI) / 180;
  const pt = (rad: number, ang: number) => [cx + rad * Math.sin(ang), cy - rad * Math.cos(ang)];
  const [nx, ny] = pt(r - 20, a);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={B.dim}>한국 30대 초반 남자 · 1979 → 2021</Txt>
      <Tag top={352}>보도 기준 · 키재기 눈금은 160cm부터</Tag>
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        {Array.from({ length: 21 }, (_, i) => 160 + i).map((v) => (
          <g key={v}>
            <line x1={190} x2={v % 5 === 0 ? 250 : 225} y1={rY(v)} y2={rY(v)} stroke={B.ink} strokeWidth={v % 5 === 0 ? 4 : 2} opacity={0.6} />
            {v % 5 === 0 && <text x={170} y={rY(v) + 11} textAnchor="end" fontSize={30} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{v}</text>}
          </g>
        ))}
        <rect x={188} y={rY(180)} width={6} height={rY(160) - rY(180)} fill={B.ink} opacity={0.5} />
        <line x1={194} x2={500} y1={rY(D.man30.h[0])} y2={rY(D.man30.h[0])} stroke={B.dim} strokeWidth={3} strokeDasharray="10 8" />
        <text x={500} y={rY(D.man30.h[0]) + 40} textAnchor="end" fontSize={30} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>1979 · 166.1cm</text>
        <line x1={194} x2={500} y1={rY(h)} y2={rY(h)} stroke={B.height} strokeWidth={8} />
        <circle cx={194} cy={rY(h)} r={13} fill={B.height} />
        <text x={500} y={rY(h) - 16} textAnchor="end" fontSize={42} fontWeight={900} fill={B.height} fontFamily={fontFamily}>{num(h)}cm</text>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={B.line} strokeWidth={34} strokeLinecap="round" />
        {[50, 60, 70, 80, 90].map((v) => {
          const an = (gAng(v) * Math.PI) / 180;
          const [x1, y1] = pt(r + 28, an);
          const [x2, y2] = pt(r + 50, an);
          const [tx, ty] = pt(r + 78, an);
          return (
            <g key={v}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={B.ink} strokeWidth={4} opacity={0.6} />
              <text x={tx} y={ty + 10} textAnchor="middle" fontSize={28} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{v}</text>
            </g>
          );
        })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={B.weight} strokeWidth={10} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={20} fill={B.weight} />
      </svg>
      <Txt top={cy + 50} left={525} right={40} size={46} weight={900} color={B.weight} align="center">{num(w)}kg</Txt>
      <Txt top={760} left={200} right={620} size={78} weight={900} color={B.height} at={70} align="center">+8.5cm</Txt>
      <Txt top={cy + 120} left={525} right={40} size={86} weight={900} color={B.weight} at={100} align="center">+17.2kg</Txt>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 성인 평균 키 추이 (사이즈코리아)
const ADULT_L: Line[] = [
  { text: "성인 평균 키 남 166.1→172.5cm, 여 154.3→159.6cm", from: 10, to: 140, em: ["172.5cm,", "159.6cm"] },
  { text: "42년간 남 +6.4cm, 여 +5.3cm", from: 142, to: 205, em: ["+6.4cm,", "+5.3cm"] },
  { text: "최근 6년은 남 +0.5cm, 여 +1.3cm (보도 기준)", from: 207, to: 270, em: ["+0.5cm,", "+1.3cm"] },
];
const ax = (y: number) => 180 + ((y - 1979) / 42) * 720;
const ay = (c: number) => 1190 - (c - 150) * 30.77;
export const AdultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const series = [
    { key: "man", color: B.height, pts: D.adult.man, off: -56 },
    { key: "woman", color: B.woman, pts: D.adult.woman, off: -56 },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={B.dim}>성인 평균 키 (20~69세 실측 · 사이즈코리아)</Txt>
      <div style={{ position: "absolute", top: 372, left: 80, right: 80, display: "flex", justifyContent: "center", gap: 36, fontSize: 32, fontWeight: 900 }}>
        <span style={{ color: B.height }}>● 남자 +6.4cm</span>
        <span style={{ color: B.woman }}>● 여자 +5.3cm</span>
      </div>
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        {[150, 155, 160, 165, 170, 175].map((c) => (
          <g key={c}>
            <line x1={150} x2={980} y1={ay(c)} y2={ay(c)} stroke={B.line} strokeWidth={2} />
            <text x={132} y={ay(c) + 11} textAnchor="end" fontSize={28} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{c}</text>
          </g>
        ))}
        {[1979, 2015, 2021].map((y) => (
          <text key={y} x={ax(y)} y={1240} textAnchor="middle" fontSize={32} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{y}</text>
        ))}
        {series.map((s) => {
          const [p0, p1, p2] = s.pts.map(([y, c]) => [ax(y), ay(c)]);
          const d = `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`;
          const seg = ease(frame, 14, 150);
          return (
            <g key={s.key}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seg} />
              {s.pts.map(([y, c], i) => {
                const at = [14, 80, 146][i];
                const o = ease(frame, at, at + 10);
                const dx = i === 2 ? 22 : i === 0 ? 0 : -8;
                return (
                  <g key={y} opacity={o}>
                    <circle cx={ax(y)} cy={ay(c)} r={15} fill={s.color} />
                    <text x={ax(y) + dx} y={ay(c) + s.off} textAnchor="middle" fontSize={34} fontWeight={900} fill={s.color} fontFamily={fontFamily}>{num(c)}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <Tag top={1262}>세로 눈금은 150cm부터 · 조사 방법이 달라 6년 변화는 보도 기준</Tag>
      <Caption bottom={400} lines={ADULT_L} />
    </AbsoluteFill>
  );
};

// 2. 세계 키 비교 (NCD-RisC, 1996년생) — 키만 비교
const WORLD_L: Line[] = [
  { text: "1996년생 남성 키 최고는 네덜란드 182.5cm", from: 10, to: 112, em: ["182.5cm"] },
  { text: "세계 평균은 남 약 171cm, 여 약 159cm", from: 114, to: 202, em: ["171cm,", "159cm"] },
  { text: "한국 여성은 100년 새 +20.2cm, 가장 크게 컸어요", from: 204, to: 300, em: ["+20.2cm,"] },
];
const wy = (c: number) => 1230 - (c - 145) * 20;
export const WorldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const RX = 440;
  const marks = [
    { label: "네덜란드 남 최고", v: D.world.nlMen, side: "L", color: B.height, at: 14, pre: "" },
    { label: "세계 평균 남", v: D.world.worldMen, side: "L", color: B.height, at: 60, pre: "약 " },
    { label: "세계 평균 여", v: D.world.worldWomen, side: "R", color: B.woman, at: 100, pre: "약 " },
    { label: "과테말라 여 최저", v: D.world.gtWomen, side: "R", color: B.woman, at: 140, pre: "" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={B.dim}>1996년생 성인 평균 키 · NCD-RisC</Txt>
      <Tag top={352}>세계 비교는 키만 · 눈금은 145cm부터</Tag>
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x={RX - 4} y={wy(185)} width={8} height={wy(145) - wy(185)} fill={B.ink} opacity={0.5} />
        {Array.from({ length: 41 }, (_, i) => 145 + i).map((v) => (
          <line key={v} x1={RX - (v % 5 === 0 ? 34 : 18)} x2={RX + (v % 5 === 0 ? 34 : 18)} y1={wy(v)} y2={wy(v)} stroke={B.ink} strokeWidth={v % 5 === 0 ? 3 : 1.5} opacity={0.5} />
        ))}
        {[150, 160, 170, 180].map((v) => (
          <text key={v} x={v >= 170 ? RX + 46 : RX - 46} y={wy(v) + 8} textAnchor={v >= 170 ? "start" : "end"} fontSize={24} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{v}</text>
        ))}
        {marks.map((m) => {
          const o = ease(frame, m.at, m.at + 10);
          const x2 = m.side === "L" ? RX - 60 : RX + 60;
          return (
            <g key={m.label} opacity={o}>
              <line x1={RX} x2={x2} y1={wy(m.v)} y2={wy(m.v)} stroke={m.color} strokeWidth={8} strokeLinecap="round" />
              <circle cx={RX} cy={wy(m.v)} r={12} fill={m.color} />
            </g>
          );
        })}
      </svg>
      {marks.map((m) => {
        const o = ease(frame, m.at, m.at + 10);
        const isL = m.side === "L";
        return (
          <div key={m.label} style={{ position: "absolute", top: wy(m.v) - 34, left: isL ? 60 : RX + 76, width: isL ? RX - 60 - 76 + 0 : 560, textAlign: isL ? "right" : "left", opacity: o, color: m.color, fontWeight: 900, fontSize: 36, lineHeight: 1.15, whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.dim }}>{m.label}</div>
            {m.pre}{m.pre ? m.v : num(m.v)}cm
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 440, left: 600, width: 400, padding: "22px 24px", borderRadius: 24, background: B.card, opacity: ease(frame, 204, 218), border: `4px solid ${B.woman}`, fontWeight: 700, fontSize: 30, color: B.ink, textAlign: "center", lineHeight: 1.3 }}>
        한국 여성<br />1896 → 1996년생
        <div style={{ fontSize: 76, fontWeight: 900, color: B.woman }}>+{D.world.krWomenGain}cm</div>
        연구 대상 중 가장 큰 증가폭
      </div>
      <Caption bottom={400} lines={WORLD_L} />
    </AbsoluteFill>
  );
};

// 3. BMI — 키 +5.1% vs 몸무게 +28.3%, BMI 눈금자
const BMI_L: Line[] = [
  { text: "키는 5.1% 늘 때 몸무게는 28.3% 늘었어요", from: 10, to: 130, em: ["5.1%", "28.3%"] },
  { text: "몸무게가 키보다 약 5.5배 빨랐어요", from: 132, to: 200, em: ["5.5배"] },
  { text: "BMI는 22에서 25.59로, 25를 넘었어요", from: 202, to: 330, em: ["25.59로,", "25를"] },
];
const bx = (v: number) => 100 + (v - 18) * 73.33;
export const BmiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const unit = 700 / 28.3;
  const hp = ease(frame, 14, 50);
  const wp = ease(frame, 56, 112);
  const v = lerp(D.man30.bmi[0], D.man30.bmi[1], ease(frame, 160, 250));
  const over = v >= 25;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={B.dim}>30대 초반 남자 · 1979 → 2021 증가율</Txt>
      <div style={{ position: "absolute", top: 380, left: 90, fontSize: 34, fontWeight: 700, color: B.height, opacity: Math.min(1, hp * 3) }}>키 166.1 → 174.6cm</div>
      <div style={{ position: "absolute", top: 428, left: 90, width: D.growth.h * unit * hp, height: 64, background: B.height, borderRadius: "0 16px 16px 0" }} />
      <div style={{ position: "absolute", top: 428, left: 90 + D.growth.h * unit * hp + 18, fontSize: 56, fontWeight: 900, color: B.height, lineHeight: "64px", whiteSpace: "nowrap", opacity: Math.min(1, hp * 3) }}>+{D.growth.h}%</div>
      <div style={{ position: "absolute", top: 530, left: 90, fontSize: 34, fontWeight: 700, color: B.weight, opacity: Math.min(1, wp * 3) }}>몸무게 60.8 → 78kg</div>
      <div style={{ position: "absolute", top: 578, left: 90, width: D.growth.w * unit * wp, height: 64, background: B.weight, borderRadius: "0 16px 16px 0" }} />
      <div style={{ position: "absolute", top: 578, left: 90 + D.growth.w * unit * wp + 18, fontSize: 56, fontWeight: 900, color: B.weight, lineHeight: "64px", whiteSpace: "nowrap", opacity: Math.min(1, wp * 3) }}>+{D.growth.w}%</div>
      <Stamp at={124} color={B.weight} rotate={-7} style={{ top: 410, right: 70, fontSize: 52 }}>약 5.5배</Stamp>

      <Txt top={760} size={36} color={B.dim} at={140}>BMI = 몸무게(kg) ÷ 키(m)² · 평균 키·몸무게로 계산</Txt>
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0, opacity: ease(frame, 140, 156) }}>
        <rect x={bx(18)} y={960} width={bx(25) - bx(18)} height={46} rx={10} fill={B.height} opacity={0.45} />
        <rect x={bx(25)} y={960} width={bx(30) - bx(25)} height={46} rx={10} fill={B.weight} opacity={0.55} />
        {[18, 20, 22, 24, 26, 28, 30].map((t) => (
          <g key={t}>
            <line x1={bx(t)} x2={bx(t)} y1={1006} y2={1030} stroke={B.ink} strokeWidth={3} opacity={0.6} />
            <text x={bx(t)} y={1068} textAnchor="middle" fontSize={30} fontWeight={700} fill={B.dim} fontFamily={fontFamily}>{t}</text>
          </g>
        ))}
        <line x1={bx(25)} x2={bx(25)} y1={930} y2={1010} stroke={B.stamp} strokeWidth={5} strokeDasharray="8 6" />
        <text x={bx(25) + 12} y={925} fontSize={30} fontWeight={900} fill={B.stamp} fontFamily={fontFamily}>25 · 한국 기준 비만</text>
        <circle cx={bx(22)} cy={983} r={11} fill="none" stroke={B.dim} strokeWidth={4} strokeDasharray="5 4" />
        <path d={`M ${bx(v)} 1000 l -22 -40 h 44 z`} fill={over ? B.stamp : B.ink} />
        <line x1={bx(v)} x2={bx(v)} y1={1000} y2={1016} stroke={over ? B.stamp : B.ink} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", top: 1100, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 92, color: over ? B.stamp : B.ink, fontVariantNumeric: "tabular-nums", opacity: ease(frame, 150, 166) }}>
        BMI {num(v, 2)}
      </div>
      <Tag top={1220} at={156}>1979년 BMI 22.0 (점선 원) → 2021년 25.59 · 보도 기준</Tag>
      <Stamp at={235} color={B.stamp} rotate={6} style={{ top: 785, right: 70, fontSize: 40 }}>25 넘음</Stamp>
      <Caption bottom={400} lines={BMI_L} />
    </AbsoluteFill>
  );
};

// 4. 비만 유병률 (BMI 25 이상) 남 / 여
const PREV_L: Line[] = [
  { text: "한국 기준 BMI 25 이상을 비만이라 불러요", from: 10, to: 100, em: ["25"] },
  { text: "남자는 1998년 25.1%에서 2024년 48.8%로 약 2배", from: 102, to: 230, em: ["25.1%에서", "48.8%로", "2배"] },
  { text: "여자는 25~28% 범위, 2024년 26.2% (보도 기준)", from: 232, to: 330, em: ["26.2%"] },
];
const Donut: React.FC<{ cx: number; cy: number; pct: number; ghost?: number; color: string; label: string }> = ({ cx, cy, pct, ghost, color, label }) => {
  const r = 130, c = 2 * Math.PI * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={B.line} strokeWidth={46} />
      {ghost !== undefined && <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={46} opacity={0.22} strokeDasharray={`${(ghost / 100) * c} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={46} strokeLinecap="butt" strokeDasharray={`${(pct / 100) * c} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />
      {pct > 0.05 && <text x={cx} y={cy + 22} textAnchor="middle" fontSize={64} fontWeight={900} fill={color} fontFamily={fontFamily}>{pct.toFixed(1)}%</text>}
      <text x={cx} y={cy - r - 36} textAnchor="middle" fontSize={44} fontWeight={900} fill={color} fontFamily={fontFamily}>{label}</text>
    </g>
  );
};
export const PrevScene: React.FC = () => {
  const frame = useCurrentFrame();
  const m = lerp(D.obesity.man1998, D.obesity.man2024, ease(frame, 100, 190));
  const f = lerp(0, D.obesity.woman2024, ease(frame, 220, 270));
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={B.dim}>비만 유병률 (BMI 25 이상 · 19세 이상)</Txt>
      <Tag top={352}>질병관리청 국민건강통계 · 연령표준화 · 2024는 보도 기준</Tag>
      <svg width={1080} height={1000} style={{ position: "absolute", top: 0, left: 0 }}>
        <Donut cx={290} cy={720} pct={frame < 100 ? ease(frame, 20, 60) * D.obesity.man1998 : m} ghost={frame >= 100 ? D.obesity.man1998 : undefined} color={B.height} label="남자" />
        <Donut cx={790} cy={720} pct={f} color={B.woman} label="여자" />
      </svg>
      <Txt top={900} left={40} right={560} size={32} color={B.dim} at={110}>연한 띠 = 1998년 25.1%</Txt>
      <Txt top={900} left={560} right={40} size={32} color={B.dim} at={240}>1998년은 25~28% 범위</Txt>
      <div style={{ position: "absolute", top: 1020, left: 70, right: 70, padding: "20px 28px", borderRadius: 24, background: B.card, border: `4px solid ${B.stamp}`, textAlign: "center", fontWeight: 700, fontSize: 32, lineHeight: 1.4, color: B.ink, opacity: ease(frame, 30, 46) }}>
        한국 기준 비만 = <b style={{ color: B.stamp }}>BMI 25 이상</b><br />
        WHO 기준은 BMI 30 이상 → <b style={{ color: B.stamp }}>직접 비교 불가</b>
      </div>
      <Caption bottom={400} lines={PREV_L} />
    </AbsoluteFill>
  );
};

// 5. 고1 평균
const STU_L: Line[] = [
  { text: "고1 평균 남 172.9cm·70.0kg, 여 161.3cm·56.9kg", from: 10, to: 100, em: ["172.9cm·70.0kg,", "161.3cm·56.9kg"] },
  { text: "평균값으로 계산한 BMI는 남 23.4, 여 21.9", from: 102, to: 180, em: ["23.4,", "21.9"] },
];
const StuCard: React.FC<{ x: number; head: string; color: string; h: number; w: number; bmi: number; at: number }> = ({ x, head, color, h, w, bmi, at }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, at + 14);
  return (
    <div style={{ position: "absolute", top: 470, left: x, width: 460, padding: "26px 20px", borderRadius: 28, background: B.card, border: `5px solid ${color}`, textAlign: "center", fontWeight: 900, color, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, lineHeight: 1.25 }}>
      <div style={{ fontSize: 42 }}>{head}</div>
      <div style={{ fontSize: 92 }}>{num(h)}<span style={{ fontSize: 36 }}>cm</span></div>
      <div style={{ fontSize: 92 }}>{num(w)}<span style={{ fontSize: 36 }}>kg</span></div>
      <div style={{ fontSize: 44, color: B.ink, marginTop: 8 }}>BMI {num(bmi)}*</div>
    </div>
  );
};
export const StudentScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={300} size={38} color={B.dim}>2024년 고1 평균 · 학생 건강검사</Txt>
    <StuCard x={50} head="고1 남학생" color={B.height} h={D.student.man.h} w={D.student.man.w} bmi={D.student.man.bmi} at={10} />
    <StuCard x={570} head="고1 여학생" color={B.woman} h={D.student.woman.h} w={D.student.woman.w} bmi={D.student.woman.bmi} at={30} />
    <Tag top={1110} at={60}>*평균 키·몸무게로 계산한 값 (개인 BMI 평균 아님) · 보도 기준</Tag>
    <Caption bottom={400} lines={STU_L} />
  </AbsoluteFill>
);

// 6. 마무리 — 출처 · 고지
const OUT_L: Line[] = [
  { text: "BMI는 진단이 아니고 근육량은 구분 못 해요", from: 8, to: 72, em: ["진단이"] },
  { text: "조사마다 대상이 달라 직접 비교는 어려워요", from: 74, to: 150, em: ["직접", "비교는"] },
];
export const OutroScene: React.FC = () => {
  const src = [
    "국가기술표준원 사이즈코리아 제8차 (2021)",
    "질병관리청 국민건강통계 · 국민건강영양조사",
    "교육부 학생 건강검사 표본통계 (2024)",
    "NCD-RisC · eLife 2016 / Our World in Data",
    "뉴시스 2024.5.12 · 증가율·BMI 환산은 자체 계산",
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={44} weight={900} color={B.ink}>자료 출처</Txt>
      {src.map((s, i) => (
        <Txt key={s} top={390 + i * 92} size={34} weight={500} at={6 + i * 8}>{s}</Txt>
      ))}
      <Stamp at={50} color={B.stamp} rotate={-5} style={{ top: 900, left: 130, right: 130, fontSize: 40 }}>의학적 조언 아님 · 정보 제공용</Stamp>
      <Caption bottom={400} lines={OUT_L} />
    </AbsoluteFill>
  );
};
