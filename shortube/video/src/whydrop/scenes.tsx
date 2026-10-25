import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily } from "../theme";
import { W2 } from "./fx";

// 숫자는 output/briefs/2026-10-22_whydrop.md 사실 카드(W1~W12)에서만 가져온다. 사진·로고·캡처 없음.
// 한국 차트 색: 상승 빨강 · 하락 파랑.

const Small: React.FC<{ top: number; at?: number; children: React.ReactNode }> = ({ top, at = 0, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: W2.dim, opacity: o }}>{children}</div>;
};

const useSpring = (at: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness: 120 } });
};

// 0. 훅 — 전제 정정: 미국은 올랐고, 하락은 오늘 한국
const HOOK_L: Line[] = [{ text: "간밤 미국은 올랐는데, 오늘 코스피는 -3.52%", from: 14, to: 135, em: ["올랐는데,", "-3.52%"] }];
export const HookScene: React.FC = () => {
  const a = useSpring(4, 11);
  const b = useSpring(40, 11);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, a * 2), transform: `translateY(${(1 - a) * -300}px)` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: W2.cyan }}>나스닥 종합 · 10.21 뉴욕 마감</div>
        <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1.05, color: W2.up, textShadow: `0 0 60px ${W2.up}88` }}>
          +<Counter from={0} to={1.05} start={4} dur={14} />%
        </div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, b * 2), transform: `translateY(${(1 - b) * 300}px)` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: W2.cyan }}>코스피 · 10.22 마감</div>
        <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1.05, color: W2.down, textShadow: `0 0 60px ${W2.down}88` }}>
          <Counter from={0} to={-3.52} start={40} dur={14} />%
        </div>
      </div>
      <Small top={1230} at={70}>하락은 간밤 미국이 아니라 오늘 한국장 · 종가 기준</Small>
      <Caption lines={HOOK_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 1. 사흘 널뛰기 + 10.8 대비
const SWING_L: Line[] = [
  { text: "코스피는 사흘간 -3.73%, +3.29%, -3.52%", from: 10, to: 150, em: ["-3.73%,", "+3.29%,", "-3.52%"] },
  { text: "10월 8일 종가보다 -16.5% 낮아졌습니다", from: 152, to: 262, em: ["-16.5%"] },
];
const DAYS = [
  { d: "10.20", v: -3.73, c: "5,552.74" },
  { d: "10.21", v: 3.29, c: "5,735.66" },
  { d: "10.22", v: -3.52, c: "5,533.77" },
];
export const SwingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const base = 700;
  const per = 60;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 70, fontSize: 36, fontWeight: 700, color: W2.cyan }}>코스피 일간 등락률 · 종가</div>
      <div style={{ position: "absolute", top: base - 2, left: 70, right: 70, height: 4, background: W2.dim }} />
      {DAYS.map((x, i) => {
        const p = interpolate(frame, [14 + i * 30, 34 + i * 30], [0, 1], clamp);
        const h = Math.abs(x.v) * per * p;
        const up = x.v > 0;
        const left = 130 + i * 310;
        return (
          <div key={x.d} style={{ position: "absolute", left, width: 230, top: 0, bottom: 0 }}>
            <div style={{ position: "absolute", left: 0, width: 230, top: up ? base - h : base, height: h, background: up ? W2.up : W2.down, borderRadius: 12, boxShadow: `0 0 30px ${up ? W2.up : W2.down}66` }} />
            <div style={{ position: "absolute", left: 0, width: 230, textAlign: "center", top: up ? base - h - 70 : base + h + 8, fontSize: 54, fontWeight: 900, color: up ? W2.up : W2.down, opacity: p }}>
              {x.v > 0 ? "+" : ""}
              {x.v.toFixed(2)}%
            </div>
            <div style={{ position: "absolute", left: 0, width: 230, textAlign: "center", top: 320, fontSize: 30, fontWeight: 700, color: W2.dim, opacity: p }}>
              {x.d}
              <br />
              {x.c}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1040, left: 70, right: 70, opacity: interpolate(frame, [150, 165], [0, 1], clamp), background: W2.card, border: `2px solid ${W2.line}`, borderRadius: 24, padding: "20px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: W2.dim }}>10.8 종가 6,625.93 → 10.22 종가 5,533.77</div>
        <div style={{ fontSize: 100, fontWeight: 900, color: W2.down }}>-16.5%</div>
      </div>
      <Caption lines={SWING_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 2. 외국인 순매도
const FLOWS_L: Line[] = [
  { text: "외국인은 10월 코스피에서 17.4조 원 순매도", from: 10, to: 150, em: ["17.4조"] },
  { text: "그중 삼성전자·SK하이닉스가 13.4조 원, 76.9%", from: 152, to: 292, em: ["13.4조", "76.9%"] },
];
export const FlowsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 40], [0, 1], clamp);
  const q = interpolate(frame, [70, 100], [0, 1], clamp);
  const W = 940;
  const share = 0.769;
  const today = [
    { n: "개인", v: 1.0364, c: W2.up },
    { n: "외국인", v: -0.3991, c: W2.down },
    { n: "기관", v: -0.6834, c: W2.down },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 70, fontSize: 36, fontWeight: 700, color: W2.cyan }}>외국인 코스피 순매도 · 10.1~10.22</div>
      <div style={{ position: "absolute", top: 320, left: 70, width: W * p, height: 90, background: "rgba(77,155,255,0.25)", border: `2px solid ${W2.down}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ width: `${share * q * 100}%`, height: "100%", background: `linear-gradient(90deg, ${W2.down}, #82bcff)` }} />
      </div>
      <div style={{ position: "absolute", top: 430, left: 70, right: 70, display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 900, opacity: p }}>
        <span style={{ color: W2.down }}>삼성전자·SK하이닉스 13조 3,879억</span>
        <span style={{ color: W2.text }}>전체 17조 4,030억</span>
      </div>
      <div style={{ position: "absolute", top: 600, left: 70, fontSize: 36, fontWeight: 700, color: W2.cyan, opacity: interpolate(frame, [150, 165], [0, 1], clamp) }}>오늘(10.22) 코스피 투자자별 순매수 (조 원)</div>
      {today.map((t, i) => {
        const r = interpolate(frame, [165 + i * 20, 185 + i * 20], [0, 1], clamp);
        const mid = 540;
        const len = Math.abs(t.v) * 430 * r;
        return (
          <div key={t.n} style={{ position: "absolute", top: 670 + i * 120, left: 0, right: 0, height: 90 }}>
            <div style={{ position: "absolute", left: 70, top: 20, fontSize: 40, fontWeight: 900, color: W2.text }}>{t.n}</div>
            <div style={{ position: "absolute", top: 8, height: 70, borderRadius: 12, background: t.c, left: t.v > 0 ? mid : mid - len, width: len, boxShadow: `0 0 24px ${t.c}66` }} />
            <div style={{ position: "absolute", top: 18, fontSize: 40, fontWeight: 900, color: t.c, left: t.v > 0 ? mid + len + 14 : undefined, right: t.v < 0 ? 1080 - (mid - len) + 14 : undefined, opacity: r }}>
              {t.v > 0 ? "+" : "-"}
              {Math.abs(t.v).toFixed(4)}
            </div>
          </div>
        );
      })}
      <Caption lines={FLOWS_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 3. AI 순환 고리
const LOOP_L: Line[] = [
  { text: "AI 투자는 돈이 고리처럼 도는 구조라는 지적이 있습니다", from: 10, to: 125, em: ["고리처럼"] },
  { text: "엔비디아는 오픈AI 사모 투자에 300억 달러", from: 127, to: 232, em: ["300억"] },
];
const NODES = [
  { n: "칩 기업", s: "(엔비디아)", x: 540, y: 330 },
  { n: "AI 개발사", s: "(오픈AI)", x: 840, y: 700 },
  { n: "데이터센터", s: "", x: 240, y: 700 },
];
export const LoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpring(4);
  const rot = frame * 2.2;
  const pts = NODES.map((n) => ({ x: n.x, y: n.y }));
  const arrow = (i: number, label: string, at: number) => {
    const A = pts[i], B = pts[(i + 1) % 3];
    const p = interpolate(frame, [at, at + 24], [0, 1], clamp);
    const x = A.x + (B.x - A.x) * p, y = A.y + (B.y - A.y) * p;
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    return (
      <g key={i}>
        <line x1={A.x} y1={A.y} x2={x} y2={y} stroke={W2.amber} strokeWidth={8} strokeLinecap="round" />
        <circle cx={x} cy={y} r={14} fill={W2.amber} />
        <text x={mx + (i === 0 ? 70 : i === 1 ? 0 : -70)} y={my + (i === 1 ? 50 : 0)} fontSize={34} fontWeight={700} fill={W2.text} textAnchor="middle" opacity={p} style={{ fontFamily }}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={540} cy={610} r={330} fill="none" stroke={W2.line} strokeWidth={4} strokeDasharray="18 14" transform={`rotate(${rot} 540 610)`} />
        {arrow(0, "투자", 20)}
        {arrow(1, "자금", 60)}
        {arrow(2, "칩 주문", 100)}
        {NODES.map((n) => (
          <g key={n.n} opacity={Math.min(1, a * 2)}>
            <rect x={n.x - 150} y={n.y - 62} width={300} height={124} rx={26} fill={W2.card} stroke={W2.cyan} strokeWidth={3} />
            <text x={n.x} y={n.y - 4} fontSize={42} fontWeight={900} fill={W2.text} textAnchor="middle" style={{ fontFamily }}>
              {n.n}
            </text>
            <text x={n.x} y={n.y + 38} fontSize={30} fontWeight={500} fill={W2.dim} textAnchor="middle" style={{ fontFamily }}>
              {n.s}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", top: 1000, left: 70, right: 70, opacity: interpolate(frame, [125, 140], [0, 1], clamp), background: W2.card, border: `2px solid ${W2.line}`, borderRadius: 24, padding: "18px 26px", textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: W2.dim }}>보도 · 분석 인용 (BIS 보고서)</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: W2.amber }}>AI 기업 투자금의 55.2%</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: W2.text }}>다른 AI 기업에서 나왔다는 추산</div>
      </div>
      <Caption lines={LOOP_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 4. 매출 의구심 — 10.8 오픈AI 매출 보도
const REV_L: Line[] = [
  { text: "10월 8일 오픈AI 연매출이 기존 보도보다 약 200억 달러 적다는 보도", from: 10, to: 120, em: ["200억"] },
  { text: "엔비디아 -2.9%, 오라클 -5.5%", from: 122, to: 203, em: ["-2.9%,", "-5.5%"] },
];
export const RevScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpring(4);
  const b = useSpring(30);
  const c = useSpring(100, 12);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 280, left: 70, right: 70, textAlign: "center", fontSize: 38, fontWeight: 700, color: W2.cyan }}>오픈AI 연환산 매출 (10.8 보도 기준)</div>
      <div style={{ position: "absolute", top: 360, left: 120, width: 360, textAlign: "center", opacity: a }}>
        <div style={{ margin: "0 auto", width: 200, height: 420 * a, background: "rgba(127,163,179,0.4)", border: `2px dashed ${W2.dim}`, borderRadius: "14px 14px 0 0", position: "relative", top: 420 * (1 - a) }} />
        <div style={{ fontSize: 56, fontWeight: 900, color: W2.dim, marginTop: 6 }}>약 700억 달러</div>
        <div style={{ fontSize: 30, fontWeight: 500, color: W2.dim }}>기존 보도</div>
      </div>
      <div style={{ position: "absolute", top: 360 + 420 * (1 - 0.714), left: 600, width: 360, textAlign: "center", opacity: b }}>
        <div style={{ margin: "0 auto", width: 200, height: 420 * 0.714 * b, background: `linear-gradient(0deg, #e08a1e, ${W2.amber})`, borderRadius: "14px 14px 0 0" }} />
        <div style={{ fontSize: 56, fontWeight: 900, color: W2.amber, marginTop: 6 }}>약 500억 달러</div>
        <div style={{ fontSize: 30, fontWeight: 500, color: W2.text }}>새 보도</div>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 70, right: 70, display: "flex", justifyContent: "center", gap: 50, opacity: c }}>
        {[
          { n: "엔비디아", v: "-2.9%" },
          { n: "오라클", v: "-5.5%" },
        ].map((x) => (
          <div key={x.n} style={{ textAlign: "center", background: W2.card, border: `2px solid ${W2.line}`, borderRadius: 22, padding: "14px 36px" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: W2.dim }}>{x.n} 10.8 주가</div>
            <div style={{ fontSize: 80, fontWeight: 900, color: W2.down }}>{x.v}</div>
          </div>
        ))}
      </div>
      <Small top={1270} at={110}>보도 기준 · 매출 수치는 언론 보도마다 다를 수 있음</Small>
      <Caption lines={REV_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 5. CXMT
const CXMT_L: Line[] = [
  { text: "중국 CXMT, 2분기 D램 매출 점유율 9.5%로 4위", from: 10, to: 130, em: ["9.5%로"] },
  { text: "10월 13일 삼성전자 -7.39%, SK하이닉스 -10.09%", from: 132, to: 215, em: ["-7.39%,", "-10.09%"] },
  { text: "차세대 기술 양산은 2028년 이후일 수 있다는 전망도", from: 217, to: 292, em: ["2028년"] },
];
const SHARE = [
  { n: "삼성전자", v: 39.4, c: "#6FA8FF" },
  { n: "SK하이닉스", v: 24.9, c: "#6FA8FF" },
  { n: "마이크론", v: 23.3, c: "#6FA8FF" },
  { n: "CXMT(중국)", v: 9.5, c: W2.amber },
];
export const CxmtScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 70, fontSize: 34, fontWeight: 700, color: W2.cyan }}>D램 매출 점유율 · 2026년 2분기 (TrendForce 인용)</div>
      {SHARE.map((s, i) => {
        const p = spring({ frame: frame - (12 + i * 14), fps, config: { damping: 18, stiffness: 110 } });
        const top = 330 + i * 130;
        return (
          <div key={s.n} style={{ position: "absolute", top, left: 70, right: 70, opacity: Math.min(1, p * 2) }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: W2.text }}>{s.n}</div>
            <div style={{ position: "relative", height: 56, marginTop: 4, background: "rgba(255,255,255,0.06)", borderRadius: 12 }}>
              <div style={{ width: (s.v / 40) * 760 * p, height: "100%", background: s.c, borderRadius: 12, boxShadow: `0 0 24px ${s.c}55` }} />
              <div style={{ position: "absolute", left: (s.v / 40) * 760 * p + 16, top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: 44, fontWeight: 900, color: s.c }}>{s.v}%</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 880, left: 70, right: 70, opacity: interpolate(frame, [130, 145], [0, 1], clamp), display: "flex", gap: 30 }}>
        {[
          { n: "삼성전자", v: "-7.39%" },
          { n: "SK하이닉스", v: "-10.09%" },
        ].map((x) => (
          <div key={x.n} style={{ flex: 1, textAlign: "center", background: W2.card, border: `2px solid ${W2.line}`, borderRadius: 22, padding: "12px 10px" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: W2.dim }}>{x.n} · 10.13</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: W2.down }}>{x.v}</div>
          </div>
        ))}
      </div>
      <Stamp at={220} color={W2.amber} rotate={-4} style={{ top: 1130, left: 150, fontSize: 40 }}>
        차세대 양산은 아직
      </Stamp>
      <Caption lines={CXMT_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 6. 한계 · 기준
const OUT_L: Line[] = [{ text: "단일 원인은 단정하기 어렵습니다 · 출처는 설명란", from: 10, to: 200, em: ["단정하기", "설명란"] }];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 20], [0, 1], clamp);
  const row = (t: string, s: string) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: W2.amber }}>{t}</div>
      <div style={{ fontSize: 33, fontWeight: 500, color: W2.text, lineHeight: 1.4, wordBreak: "keep-all" }}>{s}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 250, left: 70, right: 70, opacity: o, background: W2.card, border: `2px solid ${W2.line}`, borderRadius: 28, padding: "30px 38px" }}>
        {row("오늘 마감 시황", "외국인·기관 동반 매도, 반도체·2차전지 약세를 언급 (AI·CXMT를 직접 원인으로 든 기사는 없음)")}
        {row("배경으로 거론", "AI 투자 수익성 의구심 · 외국인의 반도체 비중 축소 · 중국 D램 업체의 성장")}
        {row("기준", "종가 · 10.20~22 코스피 · 10.1~22 외국인 순매도 · 보도 인용")}
        {row("투자 안내", "방향 전망이 아닌 사실 정리이며 매수·매도 권유가 아닙니다")}
      </div>
      <Caption lines={OUT_L} bottom={400} />
    </AbsoluteFill>
  );
};
