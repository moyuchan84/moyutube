import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp, Counter } from "../market/effects";
import { fontFamily } from "../../theme";
import { Q, Txt } from "./fx";
import R from "../../../../content/soxl/script/result.json";

// 숫자는 output/briefs/2026-10-19_soxl.md 사실 카드와 src/soxl/result.json(scripts/soxl-data.mjs, Yahoo 일봉 종가)에서만 가져온다.
// 기간: 2026.10.05 종가 ~ 10.16 종가 (9거래일). 10.19 은 장중이라 뺐다. 한국 색: 하락 파랑.

// 0. 훅
const HOOK_L: Line[] = [{ text: "반도체지수 -4.30%인 날, 3배 ETF는 -13.35%였습니다", from: 14, to: 120, em: ["-4.30%인", "-13.35%였습니다"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - 34, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={40} color={Q.dim}>2026.10.14 미국장 종가</Txt>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: Q.dim }}>반도체지수 SOX</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: Q.down }}>-4.30%</div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", opacity: b, transform: `scale(${0.6 + 0.4 * b})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: Q.dim }}>3배 레버리지 ETF SOXL</div>
        <div style={{ fontSize: 210, fontWeight: 900, color: Q.down, textShadow: `0 0 50px ${Q.cu}` }}>-13.35%</div>
      </div>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 그날 — 막대가 영선에서 아래로 떨어진다
const DAY_L: Line[] = [
  { text: "3배 ETF는 지수의 하루 등락을 약 3배로 따라가도록 만든 상품이에요", from: 10, to: 130, em: ["하루", "약", "3배로"] },
  { text: "13.35 ÷ 4.30 = 3.1배", from: 132, to: 240, em: ["3.1배"] },
];
export const DayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const k = 40; // 1% = 40px
  const zero = 480;
  const g1 = interpolate(frame, [20, 50], [0, 1], clamp);
  const g2 = interpolate(frame, [60, 110], [0, 1], clamp);
  const barW = 220;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: zero, left: 120, right: 120, height: 4, background: Q.cuLight }} />
      <div style={{ position: "absolute", top: zero - 50, left: 120, fontSize: 30, color: Q.dim, fontWeight: 700 }}>전일 종가 0%</div>
      <div style={{ position: "absolute", top: zero, left: 200, width: barW, height: 4.3 * k * g1, background: Q.down, borderRadius: "0 0 14px 14px" }} />
      <div style={{ position: "absolute", top: zero, left: 660, width: barW, height: 13.35 * k * g2, background: Q.down, borderRadius: "0 0 14px 14px", boxShadow: `0 0 40px ${Q.cu}` }} />
      <div style={{ position: "absolute", top: zero + 4.3 * k * g1 + 14, left: 200, width: barW, textAlign: "center", fontSize: 52, fontWeight: 900, color: Q.down, opacity: g1 }}>-4.30%</div>
      <div style={{ position: "absolute", top: zero + 13.35 * k * g2 + 14, left: 660, width: barW, textAlign: "center", fontSize: 52, fontWeight: 900, color: Q.down, opacity: g2 }}>-13.35%</div>
      <div style={{ position: "absolute", top: zero - 140, left: 200, width: barW, textAlign: "center", fontSize: 40, fontWeight: 700, color: Q.text }}>SOX</div>
      <div style={{ position: "absolute", top: zero - 140, left: 660, width: barW, textAlign: "center", fontSize: 40, fontWeight: 700, color: Q.cuLight }}>SOXL</div>
      <Txt top={1130} size={44} color={Q.cuLight} at={140}>하루로는 약 3.1배</Txt>
      <Caption bottom={400} lines={DAY_L} />
    </AbsoluteFill>
  );
};

// 2. 하루씩 — 10/6~10/16, 지수와 3배 ETF의 일간 등락
const DAILY_L: Line[] = [
  { text: "10월 6일부터 16일까지 9거래일을 하루씩 보면", from: 10, to: 110, em: ["9거래일을"] },
  { text: "하락한 날 대부분 지수 낙폭의 약 3배였어요", from: 112, to: 270, em: ["약", "3배였어요"] },
];
export const DailyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = R.rows.slice(1);
  const k = 30; // 1% = 30px
  const zero = 360;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: zero, left: 60, right: 60, height: 3, background: Q.cuLight }} />
      <div style={{ position: "absolute", top: 230, left: 70, fontSize: 30, color: Q.dim, fontWeight: 700 }}>
        <span style={{ color: Q.down }}>■</span> SOX &nbsp; <span style={{ color: Q.cu }}>■</span> SOXL
      </div>
      {rows.map((r, i) => {
        const p = interpolate(frame, [20 + i * 10, 40 + i * 10], [0, 1], clamp);
        const x = 70 + i * 107;
        const hs = Math.abs(r.soxPct) * 100 * k;
        const hl = Math.abs(r.soxlPct) * 100 * k;
        const up = (v: number) => v >= 0;
        return (
          <div key={r.date}>
            <div style={{ position: "absolute", left: x, width: 42, top: up(r.soxPct) ? zero - hs * p : zero, height: hs * p, background: up(r.soxPct) ? Q.up : Q.down }} />
            <div style={{ position: "absolute", left: x + 46, width: 42, top: up(r.soxlPct) ? zero - hl * p : zero, height: hl * p, background: Q.cu, boxShadow: p === 1 ? `0 0 14px ${Q.cu}` : "none" }} />
            <div style={{ position: "absolute", left: x - 6, width: 106, top: zero + hl * p + 12, textAlign: "center", fontSize: 25, fontWeight: 700, color: Q.text, opacity: p }}>
              {Math.abs(r.soxlPct) < 0.0005 ? "0.0" : (r.soxlPct * 100).toFixed(1)}
            </div>
            <div style={{ position: "absolute", left: x - 6, width: 106, top: 830, textAlign: "center", fontSize: 26, fontWeight: 500, color: Q.dim, opacity: p }}>
              {r.date.slice(8)}일
            </div>
          </div>
        );
      })}
      <Txt top={890} size={32} weight={500} color={Q.dim} at={40}>구리색 = SOXL 일간 등락(%) · 파랑/빨강 = SOX</Txt>
      <Txt top={960} size={30} weight={500} color={Q.dim} at={140}>10/6 은 지수 +0.34%, SOXL -0.01% (어긋난 날도 있음)</Txt>
      <Caption bottom={400} lines={DAILY_L} />
    </AbsoluteFill>
  );
};

// 3. 누적 — 10/5 = 100 으로 맞춘 두 선
const PATH_L: Line[] = [
  { text: "10월 5일 종가를 100으로 맞추면", from: 10, to: 100, em: ["100으로"] },
  { text: "SOXL 164.27달러 → 93.67달러, 9거래일에 -43.0%", from: 102, to: 200, em: ["-43.0%"] },
  { text: "같은 기간 지수는 -15.5%, 누적으로는 2.8배였어요", from: 202, to: 270, em: ["-15.5%,", "2.8배였어요"] },
];
export const PathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = R.rows;
  const X0 = 110, X1 = 970, Y0 = 330, Y1 = 1050; // y: 지수 105 → Y0, 50 → Y1
  const yOf = (v: number) => Y0 + ((105 - v) / 55) * (Y1 - Y0);
  const xOf = (i: number) => X0 + (i / (rows.length - 1)) * (X1 - X0);
  const draw = interpolate(frame, [10, 130], [0, rows.length - 1], clamp);
  // 선분을 draw 지점까지 그린다 (마지막 구간은 보간)
  const line = (key: "soxIdx" | "soxlIdx") => {
    const pts: string[] = [];
    const whole = Math.floor(draw);
    for (let i = 0; i <= whole; i++) pts.push(`${xOf(i)},${yOf(rows[i][key])}`);
    if (whole < rows.length - 1) {
      const f = draw - whole;
      const v = rows[whole][key] + f * (rows[whole + 1][key] - rows[whole][key]);
      pts.push(`${xOf(whole + f)},${yOf(v)}`);
    }
    return pts.join(" ");
  };
  const end = (key: "soxIdx" | "soxlIdx") => rows[rows.length - 1][key];
  const done = interpolate(frame, [130, 150], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[100, 85, 70, 57, 50].map((v) => (
          <g key={v}>
            <line x1={X0} x2={X1} y1={yOf(v)} y2={yOf(v)} stroke={v === 100 ? Q.cuLight : "rgba(255,255,255,0.12)"} strokeWidth={v === 100 ? 3 : 1.5} strokeDasharray={v === 100 ? "0" : "8 8"} />
            <text x={X0 - 14} y={yOf(v) + 10} textAnchor="end" fill={Q.dim} fontSize={26} fontFamily={fontFamily} fontWeight={700}>{v}</text>
          </g>
        ))}
        <polyline points={line("soxIdx")} fill="none" stroke={Q.down} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={line("soxlIdx")} fill="none" stroke={Q.cu} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: X1 - 300, top: yOf(end("soxIdx")) + 30, width: 300, textAlign: "right", opacity: done, fontSize: 44, fontWeight: 900, color: Q.down }}>
        SOX {end("soxIdx").toFixed(1)}
      </div>
      <div style={{ position: "absolute", left: X1 - 330, top: yOf(end("soxlIdx")) + 20, width: 330, textAlign: "right", opacity: done, fontSize: 52, fontWeight: 900, color: Q.cu }}>
        SOXL {end("soxlIdx").toFixed(1)}
      </div>
      <Txt top={1090} size={38} weight={700} color={Q.dim} at={150}>SOX 13,172.74 → 11,137.29 (-15.5%)</Txt>
      <Caption bottom={400} lines={PATH_L} />
    </AbsoluteFill>
  );
};

// 4. 되돌리려면 — 단순 산술
const NEED_L: Line[] = [
  { text: "-43%를 되돌리려면 +75.4%가 필요해요", from: 10, to: 120, em: ["+75.4%가"] },
  { text: "지수는 +18.3%면 10월 5일 수준이에요", from: 122, to: 240, em: ["+18.3%면"] },
];
export const NeedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const g1 = interpolate(frame, [20, 60], [0, 1], clamp);
  const g2 = interpolate(frame, [60, 120], [0, 1], clamp);
  const max = 900;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={250} size={44} color={Q.dim}>원래 값으로 돌아가는 데 필요한 상승률 (단순 산술)</Txt>
      <div style={{ position: "absolute", top: 400, left: 90, fontSize: 40, fontWeight: 700, color: Q.down }}>SOX</div>
      <div style={{ position: "absolute", top: 470, left: 90, width: (R.soxNeed / R.soxlNeed) * max * g1, height: 110, background: Q.down, borderRadius: 14 }} />
      <div style={{ position: "absolute", top: 480, left: 110 + (R.soxNeed / R.soxlNeed) * max * g1, fontSize: 60, fontWeight: 900, color: Q.down }}>
        +<Counter from={0} to={R.soxNeed * 100} start={20} dur={40} digits={1} />%
      </div>
      <div style={{ position: "absolute", top: 680, left: 90, fontSize: 40, fontWeight: 700, color: Q.cuLight }}>SOXL</div>
      <div style={{ position: "absolute", top: 750, left: 90, width: max * g2, height: 110, background: Q.cu, borderRadius: 14, boxShadow: `0 0 40px ${Q.cu}` }} />
      <div style={{ position: "absolute", top: 880, left: 90, fontSize: 80, fontWeight: 900, color: Q.cuLight }}>
        +<Counter from={0} to={R.soxlNeed * 100} start={60} dur={60} digits={1} />%
      </div>
      <Txt top={1040} size={32} weight={500} color={Q.dim} at={130}>
        단순 산술입니다. 지수가 +18.3% 오른다고 SOXL 이 정확히 +75.4% 가 되는 건 아니에요 (매일 3배로 다시 계산되는 구조)
      </Txt>
      <Caption bottom={400} lines={NEED_L} />
    </AbsoluteFill>
  );
};

// 5. 마무리 — 기준·한계·고지
const OUT_L: Line[] = [{ text: "과거 9거래일의 숫자일 뿐, 투자 권유가 아닙니다", from: 14, to: 210, em: ["9거래일의", "투자"] }];
export const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={250} size={64} weight={900} color={Q.cuLight}>하루는 약 3배,<br />9거래일은 2.8배</Txt>
    <div style={{ position: "absolute", top: 560, left: 80, right: 80, background: Q.card, border: `2px solid ${Q.cu}`, borderRadius: 24, padding: "30px 36px", fontSize: 32, lineHeight: 1.55, color: Q.text, fontWeight: 500 }}>
      · 기간: 2026.10.05 ~ 10.16 미국장 종가 (10.19 장중 제외)<br />
      · 자료: Yahoo Finance 일봉 · 계산은 채널 자체<br />
      · 10.14 SOX 종가 11,684.4 는 보도와 대조<br />
      · SOXL: 반도체지수 일간 3배 추종 ETF (소개·권유 아님)<br />
      · 기간이 길어질수록 지수 등락의 배수와 어긋난다
    </div>
    <Caption bottom={400} lines={OUT_L} />
  </AbsoluteFill>
);
