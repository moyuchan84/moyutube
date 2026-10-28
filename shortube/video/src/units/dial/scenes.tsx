import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { colorOf, fmtPct, N, Stamp, Txt } from "./fx";
import D from "../../../../content/dial/script/data.json";

// 숫자는 output/briefs/2026-10-21_slot1.md 사실 카드와 src/dial/data.json 에서만 가져온다.
// 보도 1건 기준(partial) 값은 화면에 '보도 기준' 표기. 인물 · 사진 · 로고 없음.

const useIn = (at: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping } });
};

// 0. 훅 — 같은 날 미국 안에서도 방향이 갈렸다
const HOOK_L: Line[] = [{ text: "간밤 미국장, 다우 +1.02% 나스닥 -0.02% 같은 날인데 방향이 갈렸어요", from: 14, to: 135, em: ["+1.02%", "-0.02%"] }];
const BigRow: React.FC<{ top: number; name: string; close: string; pct: number; k: number }> = ({ top, name, close, pct, k }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", opacity: k, transform: `scale(${0.8 + 0.2 * k})` }}>
    <div style={{ fontSize: 42, fontWeight: 700, color: N.dim }}>{name} {close}</div>
    <div style={{ fontSize: 170, fontWeight: 900, color: colorOf(pct), fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{fmtPct(pct)}</div>
  </div>
);
export const HookScene: React.FC = () => {
  const a = useIn(8);
  const b = useIn(40, 9);
  const c = useIn(70);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={300} size={38} color={N.dim}>2026.10.20 미국 현지 종가</Txt>
      <BigRow top={380} name="다우" close={D.us20.dow.close} pct={D.us20.dow.pct} k={a} />
      <div style={{ position: "absolute", top: 735, left: 140, right: 140, height: 3, background: N.line }} />
      <BigRow top={770} name="나스닥" close={D.us20.nas.close} pct={D.us20.nas.pct} k={b} />
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", fontSize: 38, fontWeight: 700, color: N.dim, opacity: c }}>
        S&P500 {D.us20.sp.close} <span style={{ color: N.up }}>{fmtPct(D.us20.sp.pct)}</span>
      </div>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 오른 종목 · 내린 종목
const STK_L: Line[] = [
  { text: "3M 같은 실적주와 헬스케어가 올랐고 대형 기술주는 내렸어요", from: 10, to: 120, em: ["올랐고", "내렸어요"] },
  { text: "보도된 배경은 실적 호조 대 AI 수익성·부채 걱정", from: 122, to: 225, em: ["AI", "걱정"] },
];
const Col: React.FC<{ title: string; color: string; rows: string[][]; left: number; at: number }> = ({ title, color, rows, left, at }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", top: 330, left, width: 440, textAlign: "center", fontSize: 50, fontWeight: 900, color, opacity: o }}>{title}</div>
      {rows.map(([name, pct], i) => {
        const p = interpolate(frame, [at + 8 + i * 12, at + 22 + i * 12], [0, 1], clamp);
        return (
          <div key={name} style={{ position: "absolute", top: 430 + i * 170, left, width: 440, height: 140, borderRadius: 24, background: N.day, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxSizing: "border-box", padding: "18px 24px" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: N.dayInk }}>{name}</div>
            <div style={{ fontSize: 64, fontWeight: 900, color, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{pct}</div>
          </div>
        );
      })}
    </>
  );
};
export const StocksScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={270} size={32} weight={500} color={N.dim}>10.20 미국 현지 종가 등락률 · 보도 기준</Txt>
    <Col title="올랐다" color={N.up} rows={D.up} left={70} at={14} />
    <Col title="내렸다" color={N.down} rows={D.down} left={570} at={60} />
    <Caption bottom={400} lines={STK_L} />
  </AbsoluteFill>
);

// 2. 24시간 다이얼 — 미국 19일 장 → 한국 20일 장 → 미국 20일 장
const DIAL_L: Line[] = [
  { text: "그런데 한국은 이미 하루 전에 빠졌어요. 20일 코스피 -3.73%", from: 10, to: 128, em: ["-3.73%"] },
  { text: "직전 미국장은 나스닥 +1.11%로 올랐는데도요", from: 130, to: 245, em: ["+1.11%"] },
  { text: "20일 낙폭은 미국 20일 장이 열리기 전에 일어난 일이에요", from: 247, to: 360, em: ["열리기", "전에"] },
];
const CX = 540;
const CY = 700;
const pol = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
};
const arc = (a1: number, a2: number, r: number) => {
  const [x1, y1] = pol(a1, r);
  const [x2, y2] = pol(a2, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
const h2d = (h: number) => (h / 24) * 360;
const US_A = [h2d(22.5), h2d(22.5) + 97.5]; // 22:30 → 05:00 (KST, 미국 서머타임 기간)
const KR_A = [h2d(9), h2d(15.5)];
const Arc: React.FC<{ a1: number; a2: number; color: string; at: number; dur: number }> = ({ a1, a2, color, at, dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  return <path d={arc(a1, a2, 255)} fill="none" stroke={color} strokeWidth={56} strokeLinecap="butt" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />;
};
export const DialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const face = interpolate(frame, [0, 12], [0, 1], clamp);
  const hand = interpolate(frame, [0, 10, 110, 135, 200, 235, 330], [US_A[0], US_A[0], US_A[1], KR_A[0] + 360, KR_A[1] + 360, US_A[0] + 360, US_A[1] + 360], clamp);
  const [hx, hy] = pol(hand, 280);
  const phase = frame < 128 ? 0 : frame < 245 ? 1 : 2;
  const L = [
    { t: "미국 19일 장 · 나스닥 +1.11%", c: N.up, s: "한국시간 22:30~05:00 (서머타임 기간 기준)" },
    { t: "한국 20일 장 · 코스피 -3.73%", c: N.down, s: "한국시간 09:00~15:30 · 종가 5,552.74" },
    { t: "그 다음에 미국 20일 장 · 다우 +1.02%", c: N.up, s: "한국시간 22:30~05:00 · 20일 낙폭은 이 장 이전" },
  ][phase];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <svg width={1080} height={1400} style={{ position: "absolute", top: 0, left: 0, opacity: face }}>
        <circle cx={CX} cy={CY} r={300} fill="rgba(0,0,0,0.28)" />
        <path d={`M ${pol(90, 300)[0]} ${pol(90, 300)[1]} A 300 300 0 0 1 ${pol(270, 300)[0]} ${pol(270, 300)[1]} Z`} fill="rgba(247,227,192,0.13)" />
        <circle cx={CX} cy={CY} r={300} fill="none" stroke={N.line} strokeWidth={4} />
        {Array.from({ length: 24 }, (_, h) => {
          const [x1, y1] = pol(h2d(h), 300);
          const [x2, y2] = pol(h2d(h), h % 3 === 0 ? 278 : 290);
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke={N.dim} strokeWidth={h % 3 === 0 ? 4 : 2} />;
        })}
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
          const [x, y] = pol(h2d(h), 340);
          return <text key={h} x={x} y={y + 11} textAnchor="middle" fontSize={32} fontWeight={700} fill={N.dim} fontFamily={fontFamily}>{h}</text>;
        })}
        <g transform="rotate(0)">
          <Arc a1={US_A[0]} a2={US_A[1]} color={N.indigo} at={10} dur={100} />
          <Arc a1={KR_A[0]} a2={KR_A[1]} color={N.amber} at={135} dur={65} />
        </g>
        <line x1={CX} y1={CY} x2={hx} y2={hy} stroke={N.text} strokeWidth={8} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={16} fill={N.text} />
        <text x={CX} y={CY + 72} textAnchor="middle" fontSize={28} fontWeight={700} fill={N.dim} fontFamily={fontFamily}>KST</text>
      </svg>
      <div style={{ position: "absolute", top: 1080, left: 50, right: 50, textAlign: "center", opacity: interpolate(frame, [14, 28], [0, 1], clamp) }}>
        <div style={{ fontSize: 46, fontWeight: 900, color: L.c }}>{L.t}</div>
        <div style={{ fontSize: 30, fontWeight: 500, color: N.dim, marginTop: 8 }}>{L.s}</div>
      </div>
      <Stamp at={262} rotate={-5} style={{ top: 300, right: 60, fontSize: 38 }}>시차 순서</Stamp>
      <Caption bottom={400} lines={DIAL_L} />
    </AbsoluteFill>
  );
};

// 3. 수급과 종목
const FLOW_L: Line[] = [
  { text: "외국인 약 5,300억, 기관 약 1조를 팔았고 개인이 약 9,000억을 받아냈어요", from: 10, to: 150, em: ["5,300억,", "1조를", "9,000억을"] },
  { text: "현대로템 -13.7%, 삼성전자 -2.98%. 하락 종목이 상승의 6.6배", from: 152, to: 300, em: ["-13.7%,", "-2.98%.", "6.6배"] },
];
const Bar: React.FC<{ top: number; label: string; w: number; color: string; value: string; at: number; h?: number }> = ({ top, label, w, color, value, at, h = 64 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 26], [0, 1], clamp);
  return (
    <div style={{ opacity: Math.min(1, p * 3) }}>
      <div style={{ position: "absolute", top, left: 70, fontSize: 36, fontWeight: 700, color: N.text }}>{label}</div>
      <div style={{ position: "absolute", top: top + 52, left: 70, width: w * p, height: h, background: color, borderRadius: "0 16px 16px 0" }} />
      <div style={{ position: "absolute", top: top + 52, left: 70 + w * p + 18, fontSize: 52, fontWeight: 900, color, lineHeight: `${h}px`, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
};
export const FlowsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chip = interpolate(frame, [190, 206], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={270} size={32} weight={500} color={N.dim}>20일 코스피 투자자별 순매수·순매도 (약, 반올림)</Txt>
      <Bar top={320} label="개인 순매수" w={500} color={N.up} value="약 9,000억" at={14} />
      <Bar top={450} label="외국인 순매도" w={295} color={N.down} value="약 5,300억" at={44} />
      <Bar top={580} label="기관 순매도" w={560} color={N.down} value="약 1조" at={74} />
      <Txt top={725} size={36} color={N.amber} at={110}>개인이 판 물량의 약 {D.flows.absorb}%를 받아냈어요</Txt>
      <Bar top={800} label="현대로템" w={Math.abs(D.stocks[0][1] as number) * 38} color={N.down} value="-13.7%" at={140} h={50} />
      <Bar top={920} label="SK하이닉스" w={Math.abs(D.stocks[2][1] as number) * 38} color={N.down} value="-4.23%" at={165} h={50} />
      <Bar top={1040} label="삼성전자" w={Math.abs(D.stocks[1][1] as number) * 38} color={N.down} value="-2.98%" at={190} h={50} />
      <div style={{ position: "absolute", top: 1190, left: 0, right: 0, textAlign: "center", opacity: chip }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: N.dayInk, background: N.day, borderRadius: 999, padding: "10px 30px" }}>
          하락 {D.breadth.down} · 상승 {D.breadth.up} 종목 (약 {D.breadth.ratio}배)
        </span>
      </div>
      <Caption bottom={400} lines={FLOW_L} />
    </AbsoluteFill>
  );
};

// 4. 21일 개장 시점
const OPEN_L: Line[] = [
  { text: "21일 코스피는 5,666.34로 시작해 +2.05%", from: 10, to: 140, em: ["5,666.34로", "+2.05%"] },
  { text: "전날 낙폭의 약 절반을 개장하자마자 되돌렸어요. 종가가 아니라 개장 시점", from: 142, to: 300, em: ["절반을", "개장", "시점"] },
];
export const OpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useIn(8, 10);
  const g = interpolate(frame, [150, 210], [0, 1], clamp);
  const gw = 900;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={280} size={38} color={N.dim}>2026.10.21 코스피 개장 시점</Txt>
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center", opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
        <div style={{ fontSize: 150, fontWeight: 900, color: N.text, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{D.open21.kospi}</div>
        <div style={{ fontSize: 130, fontWeight: 900, color: N.up, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{fmtPct(D.open21.pct)}</div>
      </div>
      <Stamp at={90} rotate={-6} style={{ top: 770, left: 270, fontSize: 44 }}>개장 시점 · 종가 아님</Stamp>
      <div style={{ position: "absolute", top: 900, left: 90, width: gw, opacity: interpolate(frame, [140, 156], [0, 1], clamp) }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: N.dim, marginBottom: 14 }}>20일 하락폭 {D.kospi20.drop}포인트 중</div>
        <div style={{ width: gw, height: 70, background: "rgba(76,141,255,0.35)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ width: gw * (D.open21.recoverPct / 100) * g, height: 70, background: N.up }} />
        </div>
        <div style={{ fontSize: 46, fontWeight: 900, color: N.up, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{D.open21.recover}포인트 회복 ≈ {Math.round(D.open21.recoverPct * g)}%</div>
      </div>
      <Txt top={1180} size={30} weight={500} color={N.dim} at={170}>코스닥 {D.open21.kosdaq} ({fmtPct(D.open21.kosdaqPct)}) · 개장 시점 속보 기준</Txt>
      <Caption bottom={400} lines={OPEN_L} />
    </AbsoluteFill>
  );
};

// 5. 증권사 시각 (보도 요지)
const QUOTE_L: Line[] = [{ text: "키움증권은 만회 시도를 예상하면서도 수급이 약하다고 봤어요", from: 10, to: 210, em: ["만회", "약하다고"] }];
export const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [4, 20], [0, 1], clamp);
  const chip = interpolate(frame, [90, 106], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, borderRadius: 30, background: N.day, boxSizing: "border-box", padding: "34px 38px", opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: N.indigo, marginBottom: 16 }}>키움증권 · 보도 요지</div>
        <div style={{ fontSize: 42, fontWeight: 700, color: N.dayInk, lineHeight: 1.4 }}>기술적 매수와 미국 반도체 시간외 강세로 전일 급락분 만회 시도 예상</div>
        <div style={{ height: 18 }} />
        <div style={{ fontSize: 42, fontWeight: 700, color: N.dayInk, lineHeight: 1.4 }}>다만 호가가 얇고 매수 기반이 약해 추세 개선은 아직 확인되지 않음</div>
      </div>
      <div style={{ position: "absolute", top: 940, left: 0, right: 0, textAlign: "center", opacity: chip }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: N.amber, border: `4px solid ${N.amber}`, borderRadius: 999, padding: "10px 30px" }}>확인 포인트 · 외국인 삼성전자 순매수 지속?</span>
      </div>
      <Txt top={1070} size={30} weight={500} color={N.dim} at={110}>원문 직접 인용 아님 · 보도 요지</Txt>
      <Caption bottom={400} lines={QUOTE_L} />
    </AbsoluteFill>
  );
};

// 6. 출처 · 고지
export const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={420} size={52} weight={900} color={N.amber}>숫자로 보는 요즘</Txt>
    <Txt top={520} size={38} weight={700}>미국·한국 2026.10.20 종가 기준</Txt>
    <Txt top={580} size={38} weight={700}>코스피 21일은 개장 시점 기준</Txt>
    <Txt top={700} size={32} weight={500} color={N.dim} at={12}>개인 흡수율·회복률·종목 비는 보도된 수치로 직접 계산</Txt>
    <Txt top={760} size={32} weight={500} color={N.dim} at={12}>일부 수치는 보도 1건 기준</Txt>
    <Txt top={850} size={32} weight={500} color={N.dim} at={20}>출처 · 인포스탁데일리 · 서울신문 · 이투데이 (설명란 참고)</Txt>
    <Txt top={960} size={36} weight={700} color={N.text} at={28}>투자 권유 아님 · 판단과 책임은 본인에게 있습니다</Txt>
  </AbsoluteFill>
);
