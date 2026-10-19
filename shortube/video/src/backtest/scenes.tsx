import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../components/Caption";
import { clamp, Counter } from "../market/effects";
import { fontFamily } from "../theme";
import { Hl, P, PStamp } from "./fx";
import R from "./result.json";

// 숫자는 output/briefs/2026-10-18_slot1.md 사실 카드(B0~B6)와 src/backtest/result.json(scripts/backtest-indicators.mjs 결과)에서만 가져온다.
// 한국 차트 색: 수익 빨강 · 손실 파랑. 사진·로고·캡처 없음.

const T = R.tenYear;
const F = R.full;
const pct1 = (v: number) => (v * 100).toFixed(1);
const signed = (v: number) => (v >= 0 ? "+" : "-") + Math.abs(v * 100).toFixed(1) + "%";

const Text: React.FC<{ top: number; size?: number; weight?: number; color?: string; children: React.ReactNode; at?: number; align?: "center" | "left" }> = ({
  top, size = 46, weight = 700, color = P.ink, children, at = 0, align = "center",
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: align, fontFamily, fontWeight: weight, fontSize: size, color, opacity: o, lineHeight: 1.25, transform: `translateY(${(1 - o) * 16}px)` }}>
      {children}
    </div>
  );
};

// 100칸 격자: 앞에서부터 win칸은 빨강(수익), 나머지는 파랑(손실). 한 칸씩 채워진다.
const Grid100: React.FC<{ win: number; start: number; step: number; cell: number; gap: number; top: number }> = ({ win, start, step, cell, gap, top }) => {
  const frame = useCurrentFrame();
  const w = 10 * cell + 9 * gap;
  return (
    <div style={{ position: "absolute", top, left: (1080 - w) / 2, width: w, height: w }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const p = interpolate(frame, [start + i * step, start + i * step + 6], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i % 10) * (cell + gap),
              top: Math.floor(i / 10) * (cell + gap),
              width: cell,
              height: cell,
              borderRadius: 10,
              background: i < win ? P.up : P.down,
              opacity: p,
              transform: `scale(${0.4 + 0.6 * p})`,
              border: `3px solid ${P.ink}`,
            }}
          />
        );
      })}
    </div>
  );
};

// 0. 훅
const HOOK_L: Line[] = [{ text: "차트 지표 필승법, 코스피 10년치로 돌려봤습니다", from: 14, to: 120, em: ["필승법,", "10년치로"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontSize: 120, fontWeight: 900, color: P.ink, lineHeight: 1.1, transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}>
        <Hl>필승법</Hl>
        <br />
        있을까?
      </div>
      <PStamp at={30} color={P.ink} rotate={-5} style={{ top: 760, left: 90, fontSize: 80 }}>RSI</PStamp>
      <PStamp at={45} color={P.up} rotate={4} style={{ top: 930, left: 300, fontSize: 80 }}>골든크로스</PStamp>
      <PStamp at={60} color={P.down} rotate={-3} style={{ top: 1100, left: 150, fontSize: 80 }}>볼린저밴드</PStamp>
      <Text top={1290} size={32} weight={500} color={P.dim} at={70}>
        차트 패턴(헤드앤숄더 등)은 정의가 사람마다 달라 제외
      </Text>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 기준선 — 아무 날이나 사서 20거래일 뒤 팔면
const BASE_L: Line[] = [
  { text: "기준선부터. 아무 날이나 사서", from: 10, to: 100, em: ["기준선부터."] },
  { text: "20거래일 들고 있으면 100번 중 약 58번 올랐어요", from: 102, to: 270, em: ["약", "58번"] },
];
export const BaseScene: React.FC = () => {
  const win = Math.round(T.event["20"].base.win * 100);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={230} size={44}>아무 날이나 사서 20거래일 뒤 팔았다면</Text>
      <div style={{ position: "absolute", top: 285, left: 0, right: 0, textAlign: "center", fontSize: 160, fontWeight: 900, color: P.ink }}>
        <Counter from={0} to={T.event["20"].base.win * 100} start={20} dur={40} digits={1} />
        <span style={{ fontSize: 84 }}>%</span>
      </div>
      <Grid100 win={win} start={22} step={1.2} cell={70} gap={7} top={500} />
      <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontSize: 28, fontWeight: 700, color: P.ink }}>
        <span style={{ color: P.up }}>■</span> 수익 {win}칸 &nbsp; <span style={{ color: P.down }}>■</span> 손실 {100 - win}칸 &nbsp;(2,425번 중 비율)
      </div>
      <Caption bottom={400} lines={BASE_L} />
    </AbsoluteFill>
  );
};

// 2. 신호 3개의 20거래일 승률 — 기준선 57.6% 세로 점선
const SIG_L: Line[] = [
  { text: "지표가 뜬 날 사면? RSI 61%, 볼린저 59%", from: 10, to: 150, em: ["RSI", "61%,", "59%"] },
  { text: "골든크로스는 67%로 가장 높았어요", from: 152, to: 270, em: ["67%로", "가장"] },
];
const SIG_ROWS = [
  { name: "RSI 30 아래", d: T.event["20"].rsi, color: "#3A372E" },
  { name: "볼린저 하단 이탈", d: T.event["20"].boll, color: "#3A372E" },
  { name: "골든크로스 5/20", d: T.event["20"].gold, color: P.up },
];
export const SignalsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const x0 = 90;
  const w = 780; // 0~100% 가 780px (숫자 라벨 자리를 남긴다)
  const base = T.event["20"].base.win;
  const bx = x0 + base * w;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={230} size={44}>신호가 뜬 날 사서 20거래일 뒤 승률</Text>
      <div style={{ position: "absolute", left: bx - 2, top: 350, height: 830, width: 0, borderLeft: `5px dashed ${P.ink}` }} />
      <div style={{ position: "absolute", left: bx - 200, top: 300, width: 400, textAlign: "center", fontSize: 30, fontWeight: 900, color: P.ink }}>
        <Hl>기준선 {pct1(base)}%</Hl>
      </div>
      {SIG_ROWS.map((r, i) => {
        const t0 = 30 + i * 36;
        const p = interpolate(frame, [t0, t0 + 30], [0, 1], clamp);
        const e = 1 - Math.pow(1 - p, 3);
        const top = 400 + i * 270;
        const diff = Math.round(r.d.win * 1000) / 10 - Math.round(base * 1000) / 10; // 화면에 보이는 반올림 값끼리의 차
        return (
          <div key={r.name}>
            <div style={{ position: "absolute", left: x0, top, fontSize: 44, fontWeight: 900, color: P.ink, opacity: Math.min(1, p * 3) }}>{r.name}</div>
            <div style={{ position: "absolute", left: x0, top: top + 70, width: r.d.win * w * e, height: 90, background: r.color, border: `4px solid ${P.ink}`, borderRadius: 14 }} />
            <div style={{ position: "absolute", left: x0, top: top + 170, fontSize: 34, fontWeight: 700, color: P.dim, opacity: p > 0.9 ? 1 : 0 }}>
              {r.d.n}번 · 기준선보다 <b style={{ color: P.ink }}>+{diff.toFixed(1)}%p</b>
            </div>
            <div style={{ position: "absolute", left: x0 + r.d.win * w * e + 14, top: top + 78, fontSize: 64, fontWeight: 900, color: P.ink, opacity: p > 0.15 ? 1 : 0, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {(r.d.win * 100 * e).toFixed(1)}%
            </div>
          </div>
        );
      })}
      <Caption bottom={400} lines={SIG_L} />
    </AbsoluteFill>
  );
};

// 3. 골든크로스 67% 도 세 번에 한 번은 손실
const WORST_L: Line[] = [
  { text: "가장 높은 골든크로스도 세 번에 한 번은 잃었어요", from: 10, to: 110, em: ["세", "번에", "한", "번은"] },
  { text: "20거래일 뒤 최악은 -19.8%", from: 112, to: 210, em: ["-19.8%"] },
];
export const WorstScene: React.FC = () => {
  const g = T.event["20"].gold;
  const win = Math.round(g.win * 100);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={230} size={44}>골든크로스 {g.n}번, 20거래일 뒤</Text>
      <div style={{ position: "absolute", top: 285, left: 0, right: 0, textAlign: "center", fontSize: 130, fontWeight: 900, color: P.up }}>
        <Counter from={0} to={g.win * 100} start={10} dur={30} digits={1} />
        <span style={{ fontSize: 70 }}>%</span>
      </div>
      <Grid100 win={win} start={12} step={0.9} cell={58} gap={6} top={470} />
      <Text top={1150} size={30} weight={500} color={P.dim} at={60}>
        같은 방식의 RSI 최악 {signed(T.event["20"].rsi.worst)} · 볼린저 {signed(T.event["20"].boll.worst)}
      </Text>
      <PStamp at={110} color={P.down} rotate={-5} style={{ top: 1205, left: 270, fontSize: 60 }}>
        최악 {signed(g.worst)}
      </PStamp>
      <Caption bottom={400} lines={WORST_L} />
    </AbsoluteFill>
  );
};

// 4. 해마다 흔들림 — 골든크로스 20거래일 승률
const YEAR_L: Line[] = [
  { text: "해마다도 흔들렸어요", from: 10, to: 80, em: ["흔들렸어요"] },
  { text: "2021년 40%, 2024년 37.5%, 2025년 88.9%", from: 82, to: 210, em: ["40%,", "37.5%,", "88.9%"] },
];
export const YearsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const years = Object.entries(T.goldByYear as Record<string, { n: number; win: number }>);
  const base = 1130; // 0% 선
  const per = 6; // px per %
  const hot = new Set(["2021", "2024", "2025"]);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={230} size={44}>골든크로스 후 20거래일 승률, 해마다</Text>
      <div style={{ position: "absolute", left: 60, right: 60, top: base - 2, height: 4, background: P.ink }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: base - 57.6 * per, height: 0, borderTop: `4px dashed ${P.dim}` }} />
      <Text top={310} size={28} weight={700} color={P.dim}>점선 = 기준선 57.6% (아무 날이나 샀을 때) · 막대 위 숫자는 %</Text>
      {years.map(([y, v], i) => {
        const x = 60 + i * 85;
        const p = interpolate(frame, [14 + i * 5, 14 + i * 5 + 24], [0, 1], clamp);
        const e = 1 - Math.pow(1 - p, 3);
        const h = v.win * 100 * per * e;
        const isHot = hot.has(y);
        return (
          <div key={y}>
            <div style={{ position: "absolute", left: x, width: 66, top: base - h, height: h, background: isHot ? (v.win >= 0.5 ? P.up : P.down) : "#B8B29A", border: `3px solid ${P.ink}`, borderBottom: "none", borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: x - 10, width: 90, top: base - h - 44, textAlign: "center", fontSize: isHot ? 32 : 24, fontWeight: 900, color: P.ink, opacity: p > 0.9 ? 1 : 0 }}>
              {Math.round(v.win * 1000) / 10}
            </div>
            <div style={{ position: "absolute", left: x - 10, width: 90, top: base + 12, textAlign: "center", fontSize: 26, fontWeight: isHot ? 900 : 500, color: P.ink }}>{y.slice(2)}년</div>
            <div style={{ position: "absolute", left: x - 10, width: 90, top: base + 48, textAlign: "center", fontSize: 22, fontWeight: 500, color: P.dim }}>{v.n}번</div>
          </div>
        );
      })}
      <Text top={1260} size={28} weight={500} color={P.dim} at={100}>
        해마다 1~10번뿐이라 표본이 작습니다
      </Text>
      <Caption bottom={400} lines={YEAR_L} />
    </AbsoluteFill>
  );
};

// 5·6. 규칙대로 사고팔기 vs 단순 보유 — 비용 전 막대가 비용 후로 줄어든다
type Row = { name: string; gross: number; net: number | null; note?: string; color: string };
const RuleBars: React.FC<{ rows: Row[]; max: number; costAt: number; top: number }> = ({ rows, max, costAt, top }) => {
  const frame = useCurrentFrame();
  const x0 = 70;
  const w = 700;
  const cost = interpolate(frame, [costAt, costAt + 30], [0, 1], clamp);
  return (
    <>
      {rows.map((r, i) => {
        const t0 = 14 + i * 22;
        const p = interpolate(frame, [t0, t0 + 28], [0, 1], clamp);
        const e = 1 - Math.pow(1 - p, 3);
        const t = top + i * 225;
        const shown = r.net == null ? r.gross : r.gross + (r.net - r.gross) * cost;
        return (
          <div key={r.name}>
            <div style={{ position: "absolute", left: x0, top: t, fontSize: 40, fontWeight: 900, color: P.ink, opacity: Math.min(1, p * 3), whiteSpace: "nowrap" }}>
              {r.name} <span style={{ fontSize: 28, fontWeight: 500, color: P.dim }}>{r.note}</span>
            </div>
            {r.net != null && <div style={{ position: "absolute", left: x0, top: t + 60, width: (r.gross / max) * w * e, height: 80, border: `4px dashed ${P.dim}`, borderRadius: 12, opacity: cost > 0 ? 1 : 0 }} />}
            <div style={{ position: "absolute", left: x0, top: t + 60, width: (shown / max) * w * e, height: 80, background: r.color, border: `4px solid ${P.ink}`, borderRadius: 12 }} />
            <div style={{ position: "absolute", left: x0 + (Math.max(r.gross, shown) / max) * w * e + 16, top: t + 66, fontSize: 54, fontWeight: 900, color: P.ink, opacity: p > 0.2 ? 1 : 0, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              +{Math.round(shown * 100 * e)}%
            </div>
          </div>
        );
      })}
    </>
  );
};

const RULE_L: Line[] = [
  { text: "규칙대로 사고팔면? 10년 단순 보유는 +174%", from: 10, to: 130, em: ["단순", "보유는", "+174%"] },
  { text: "골든크로스 +194%, 비용 0.2%를 빼면 +154%", from: 132, to: 270, em: ["+194%,", "0.2%를", "+154%"] },
];
export const RuleScene: React.FC = () => {
  const S = T.strategies;
  const rows: Row[] = [
    { name: "단순 보유", gross: T.buyHold, net: null, color: "#3A372E" },
    { name: "골든크로스", gross: S.gold.ret, net: S.gold.retNet, note: `${S.gold.trades}번 · 승률 ${Math.round(S.gold.win * 100)}%`, color: P.up },
    { name: "RSI", gross: S.rsi.ret, net: S.rsi.retNet, note: `${S.rsi.trades}번 · 시장에 ${Math.round(S.rsi.exposure * 100)}%만`, color: "#3A372E" },
    { name: "볼린저", gross: S.boll.ret, net: S.boll.retNet, note: `${S.boll.trades}번 · 승률 ${Math.round(S.boll.win * 100)}%`, color: "#3A372E" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={225} size={42}>10년 누적 수익 (2016.10~2026.10)</Text>
      <RuleBars rows={rows} max={2.2} costAt={140} top={310} />
      <Text top={1235} size={26} weight={500} color={P.dim} at={140}>
        점선 = 비용 전 · 채운 막대 = 왕복 0.2% 가정 후 (실제 세금·수수료와 다름)
      </Text>
      <Caption bottom={400} lines={RULE_L} />
    </AbsoluteFill>
  );
};

const LONG_L: Line[] = [{ text: "26년으로 늘리면 단순 보유 +424%, 지표 셋 다 못 미쳤어요", from: 10, to: 150, em: ["+424%,", "못", "미쳤어요"] }];
export const LongScene: React.FC = () => {
  const S = F.strategies;
  const rows: Row[] = [
    { name: "단순 보유", gross: F.buyHold, net: null, color: "#3A372E" },
    { name: "골든크로스", gross: S.gold.ret, net: S.gold.retNet, color: P.up },
    { name: "RSI", gross: S.rsi.ret, net: S.rsi.retNet, color: "#3A372E" },
    { name: "볼린저", gross: S.boll.ret, net: S.boll.retNet, color: "#3A372E" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Text top={225} size={42}>26년으로 늘리면 (2000.01~2026.10)</Text>
      <RuleBars rows={rows} max={5.2} costAt={50} top={310} />
      <Text top={1235} size={26} weight={500} color={P.dim} at={60}>
        점선 = 비용 전 · 채운 막대 = 왕복 0.2% 가정 후
      </Text>
      <Caption bottom={400} lines={LONG_L} />
    </AbsoluteFill>
  );
};

// 7. 마무리
const OUTRO_L: Line[] = [{ text: "승률이 높다고 필승은 아니었습니다", from: 10, to: 180, em: ["필승은"] }];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const lines = [
    "이 테스트는 코스피 지수 일봉, 신호일 종가 기준",
    "신호가 겹치는 구간이 있어 독립 표본이 아님",
    "RSI는 10년 31번뿐 · 최근 10년은 상승장",
    "세금·수수료·ETF 괴리는 반영하지 않음",
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontSize: 104, fontWeight: 900, color: P.ink, lineHeight: 1.15, transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
        <Hl>필승</Hl>까지는
        <br />
        아니었다
      </div>
      <div style={{ position: "absolute", top: 700, left: 80, right: 80, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 24, padding: "30px 36px" }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: P.ink, marginBottom: 14 }}>이 결과의 한계</div>
        {lines.map((t, i) => (
          <div key={t} style={{ fontSize: 31, fontWeight: 500, color: P.ink, lineHeight: 1.55, opacity: interpolate(frame, [30 + i * 12, 42 + i * 12], [0, 1], clamp) }}>
            · {t}
          </div>
        ))}
      </div>
      <Text top={1190} size={30} weight={700} color={P.dim} at={90}>
        과거 결과이며 투자 권유가 아닙니다 · 방법·가정은 설명란
      </Text>
      <Text top={1245} size={26} weight={500} color={P.dim} at={100}>
        자료: Yahoo Finance ^KS11 일봉 · 계산: 채널 자체 (10/15 종가는 보도와 대조)
      </Text>
      <Caption bottom={400} lines={OUTRO_L} />
    </AbsoluteFill>
  );
};
