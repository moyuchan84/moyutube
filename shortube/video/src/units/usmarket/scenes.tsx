import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { C, fontFamily } from "../../theme";
import { US } from "./fx";

// 숫자는 output/briefs/2026-10-17_slot1.md 사실 카드(M1~M7, B1~B2, R1, V1~V2)에서만 가져온다.
// 한국 차트 색: 하락 파랑 · 상승 빨강. 사진·로고·캡처 없음.

const soft = { damping: 14, stiffness: 140 };
const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "-" : "") + Math.abs(v).toFixed(2) + "%";
const colorOf = (v: number) => (v >= 0 ? US.up : US.down);

const Pop: React.FC<{ at: number; top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, top, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: soft });
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, fontFamily, fontWeight: 700, opacity: p, transform: `translateY(${(1 - p) * -40}px)`, ...style }}>
      {children}
    </div>
  );
};

const Small: React.FC<{ top: number; children: React.ReactNode; at?: number }> = ({ top, children, at = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: US.dim, opacity: o }}>{children}</div>
  );
};

// 0. 훅 — 큰 음수 두 개가 위에서 떨어진다
const HOOK_L: Line[] = [{ text: "간밤 나스닥 -2.15%, 그런데 다우는 -0.34%", from: 14, to: 120, em: ["-2.15%,", "-0.34%"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const b = spring({ frame: frame - 36, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", transform: `translateY(${(1 - a) * -500}px)`, opacity: Math.min(1, a * 2) }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: US.ice }}>나스닥 종합</div>
        <div style={{ fontSize: 230, fontWeight: 900, color: US.down, textShadow: `0 0 60px ${US.down}88` }}>
          <Counter from={0} to={-2.15} start={4} dur={14} style={{ fontVariantNumeric: "tabular-nums" }} />%
        </div>
      </div>
      <div style={{ position: "absolute", top: 800, left: 0, right: 0, textAlign: "center", transform: `translateY(${(1 - b) * -500}px)`, opacity: Math.min(1, b * 2) }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: US.ice }}>다우존스 산업평균</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: "#9CC8F2" }}>
          <Counter from={0} to={-0.34} start={36} dur={14} />%
        </div>
      </div>
      <Small top={1260} at={60}>2026.10.16 (금) 뉴욕 마감 · 하락 파랑, 상승 빨강 (한국 차트 색)</Small>
      <Caption lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 낙폭 비교 — 0% 선에서 아래로 늘어나는 막대 4개
const GAP_L: Line[] = [
  { text: "같은 날인데 낙폭이 달랐어요", from: 10, to: 110, em: ["낙폭이"] },
  { text: "반도체지수 -3.83%, 다우의 약 11배", from: 112, to: 235, em: ["-3.83%,", "11배"] },
];
const GAP_BARS = [
  { name: "반도체", v: -3.83 },
  { name: "나스닥", v: -2.15 },
  { name: "S&P500", v: -1.09 },
  { name: "다우", v: -0.34 },
];
export const GapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const base = 360;
  const per = 230; // px per %
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: base - 2, left: 70, right: 70, height: 4, background: US.ice, opacity: 0.8 }} />
      <div style={{ position: "absolute", top: base - 52, left: 70, fontSize: 30, fontWeight: 700, color: US.ice }}>0% (전날 종가)</div>
      {GAP_BARS.map((b, i) => {
        const x = 90 + i * 235;
        const p = interpolate(frame, [18 + i * 16, 18 + i * 16 + 34], [0, 1], clamp);
        const eased = 1 - Math.pow(1 - p, 3);
        const h = Math.abs(b.v) * per * eased;
        const last = i === GAP_BARS.length - 1;
        return (
          <div key={b.name}>
            <div style={{ position: "absolute", left: x, width: 170, top: base - 136, textAlign: "center", fontSize: 38, fontWeight: 700, color: C.text, opacity: Math.min(1, p * 3) }}>{b.name}</div>
            <div
              style={{
                position: "absolute",
                left: x,
                width: 170,
                top: base,
                height: h,
                borderRadius: "0 0 22px 22px",
                background: `linear-gradient(180deg, ${US.downDeep}, ${last ? "#7DB6F0" : US.down})`,
                boxShadow: `0 0 40px ${US.down}55`,
              }}
            />
            <div style={{ position: "absolute", left: x - 20, width: 210, top: base + h + 14, textAlign: "center", fontSize: 56, fontWeight: 900, color: US.down, opacity: p > 0.85 ? 1 : 0, fontVariantNumeric: "tabular-nums" }}>
              {sign(b.v)}
            </div>
          </div>
        );
      })}
      <Stamp at={150} color={US.amber} rotate={-4} style={{ top: 1330, left: 190, fontSize: 64 }}>
        반도체 ÷ 다우 ≈ 11배
      </Stamp>
      <Caption lines={GAP_L} />
    </AbsoluteFill>
  );
};

// 2. 연속 하락 8일 + 한 주 성과
const STREAK_L: Line[] = [
  { text: "반도체지수 8거래일 연속 하락, 2008년 이후 최장", from: 10, to: 125, em: ["8거래일", "2008년"] },
  { text: "한 주로 보면 나스닥 -4.48%, 다우 -0.67%", from: 127, to: 235, em: ["-4.48%,", "-0.67%"] },
];
export const StreakScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const weekly = [
    { name: "나스닥", v: -4.48 },
    { name: "S&P500", v: -1.95 },
    { name: "다우", v: -0.67 },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 230, left: 70, fontSize: 36, fontWeight: 700, color: US.ice }}>필라델피아 반도체지수 연속 하락</div>
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const p = spring({ frame: frame - (6 + i * 10), fps, config: { damping: 11 } });
        const val = i === 6 ? "-0.88%" : i === 7 ? "-3.83%" : null;
        const big = i === 7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 70 + col * 240,
              top: 300 + row * 190,
              width: 220,
              height: 160,
              borderRadius: 22,
              background: big ? US.downDeep : US.card,
              border: `3px solid ${big ? US.ice : US.line}`,
              boxShadow: big ? `0 0 50px ${US.down}88` : "none",
              transform: `translateY(${(1 - p) * -420}px)`,
              opacity: Math.min(1, p * 2),
              textAlign: "center",
              color: C.text,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 500, color: big ? US.ice : US.dim, marginTop: 14 }}>{i + 1}일째 ▼</div>
            <div style={{ fontSize: val ? 50 : 40, fontWeight: 900, marginTop: 10, color: val ? "#fff" : US.dim }}>{val ?? "하락"}</div>
          </div>
        );
      })}
      <Pop at={100} top={690} style={{ fontSize: 56, fontWeight: 900, color: US.amber, textAlign: "center" }}>
        2008년 이후 가장 긴 연속 하락
      </Pop>
      <div style={{ position: "absolute", top: 850, left: 70, fontSize: 36, fontWeight: 700, color: US.ice, opacity: interpolate(frame, [125, 140], [0, 1], clamp) }}>이번 한 주 (10/12~16)</div>
      {weekly.map((w, i) => {
        const top = 930 + i * 120;
        const p = interpolate(frame, [130 + i * 14, 130 + i * 14 + 30], [0, 1], clamp);
        const width = Math.abs(w.v) * 120 * (1 - Math.pow(1 - p, 3));
        return (
          <div key={w.name}>
            <div style={{ position: "absolute", top: top + 18, left: 70, width: 170, fontSize: 38, fontWeight: 700, color: C.text, opacity: p }}>{w.name}</div>
            <div style={{ position: "absolute", top, left: 250, width, height: 78, borderRadius: "0 18px 18px 0", background: `linear-gradient(90deg, ${US.downDeep}, ${US.down})` }} />
            <div style={{ position: "absolute", top: top + 12, left: 250 + width + 18, fontSize: 48, fontWeight: 900, color: US.down, opacity: p > 0.85 ? 1 : 0 }}>{sign(w.v)}</div>
          </div>
        );
      })}
      <Small top={1300} at={170}>한 주 성과는 헤럴드경제 보도 기준</Small>
      <Caption lines={STREAK_L} />
    </AbsoluteFill>
  );
};

// 3. 이유 세 가지 — 카드가 위에서 떨어진다
const WHY_L: Line[] = [
  { text: "걱정의 중심은 AI 수요보다 빌린 돈", from: 10, to: 100, em: ["빌린", "돈"] },
  { text: "코어위브 부도 보험료 사상 최고, 주가 -11.9%", from: 102, to: 190, em: ["사상", "-11.9%"] },
  { text: "유가까지 올랐습니다", from: 192, to: 265, em: ["유가까지"] },
];
const WHY_CARDS = [
  { n: "1", title: "AI 인프라 기업의 빚 걱정", big: "코어위브 -11.91%", sub: "5년 CDS(부도 보험료) 스프레드 사상 최고", color: US.down, at: 10 },
  { n: "2", title: "물가 · 돈 빌리는 비용", big: "9월 CPI · PPI 예상 상회", sub: "이자 부담이 큰 AI 투자 기업에 불리하다는 걱정", color: US.amber, at: 100 },
  { n: "3", title: "국제유가 급등", big: "브렌트 $109.86 (+3.72%)", sub: "중동 · 우크라이나 충돌 보도", color: US.up, at: 190 },
];
export const WhyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {WHY_CARDS.map((c, i) => {
        const p = spring({ frame: frame - c.at, fps, config: { damping: 12 } });
        return (
          <div
            key={c.n}
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 250 + i * 340,
              height: 300,
              borderRadius: 30,
              background: US.card,
              border: `3px solid ${c.color}`,
              boxShadow: `0 0 40px ${c.color}44`,
              transform: `translateY(${(1 - p) * -520}px)`,
              opacity: Math.min(1, p * 2),
              padding: "26px 34px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: c.color, color: "#04131C", fontSize: 40, fontWeight: 900, textAlign: "center", lineHeight: "66px" }}>{c.n}</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: C.text }}>{c.title}</div>
            </div>
            <div style={{ fontSize: 60, fontWeight: 900, color: c.color, marginTop: 26 }}>{c.big}</div>
            <div style={{ fontSize: 32, fontWeight: 500, color: US.dim, marginTop: 14 }}>{c.sub}</div>
          </div>
        );
      })}
      <Small top={1300} at={200}>코어위브·유가는 머니투데이 보도 1건 기준</Small>
      <Caption lines={WHY_L} />
    </AbsoluteFill>
  );
};

// 4. 채권 발작? — 10/1 장중 5.34% → 10/15 약 5.1%
const BOND_L: Line[] = [
  { text: "채권 발작은 금요일이 아니었어요", from: 12, to: 100, em: ["금요일이"] },
  { text: "10월 1일 금리 5.3%, 목요일엔 오히려 하락", from: 102, to: 178, em: ["5.3%,", "하락"] },
  { text: "주식을 팔고 국채로 피한 겁니다", from: 180, to: 235, em: ["국채로"] },
];
export const BondScene: React.FC = () => {
  const frame = useCurrentFrame();
  const y = (r: number) => 1000 - ((r - 5.0) / 0.4) * 480; // 5.0% → 1000, 5.4% → 520
  const x1 = 200, x2 = 880;
  const p1 = interpolate(frame, [40, 60], [0, 1], clamp);
  const line = interpolate(frame, [70, 120], [0, 1], clamp);
  const p2 = interpolate(frame, [118, 134], [0, 1], clamp);
  const y1 = y(5.34), y2 = y(5.09);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Stamp at={8} color={US.amber} rotate={-5} style={{ top: 230, left: 250, fontSize: 70 }}>
        채권 발작?
      </Stamp>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {[5.0, 5.2, 5.4].map((r) => (
          <g key={r}>
            <line x1={120} x2={990} y1={y(r)} y2={y(r)} stroke={US.line} strokeWidth={2} strokeDasharray="8 10" />
            <text x={990} y={y(r) - 12} textAnchor="end" fill={US.dim} fontSize={30} fontFamily={fontFamily}>{r.toFixed(1)}%</text>
          </g>
        ))}
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * line} y2={y1 + (y2 - y1) * line} stroke={US.down} strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
        <circle cx={x1} cy={y1} r={22 * p1} fill={US.up} />
        <circle cx={x2} cy={y2} r={22 * p2} fill={US.down} />
      </svg>
      <div style={{ position: "absolute", left: x1 + 40, top: y1 - 130, width: 330, textAlign: "left", opacity: p1 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: US.ice }}>10/1 장중 최고</div>
        <div style={{ fontSize: 66, fontWeight: 900, color: US.up }}>5.34%</div>
      </div>
      <div style={{ position: "absolute", left: x2 - 250, top: y2 + 40, width: 330, textAlign: "center", opacity: p2 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: US.ice }}>10/15 종가</div>
        <div style={{ fontSize: 66, fontWeight: 900, color: US.down }}>약 5.1%</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1120, borderRadius: 24, background: US.card, border: `3px solid ${US.amber}`, padding: "20px 30px", opacity: interpolate(frame, [130, 150], [0, 1], clamp) }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: US.amber }}>10/15 하루 10bp 넘게 하락</div>
        <div style={{ fontSize: 32, fontWeight: 500, color: C.text, marginTop: 8 }}>물가 지표가 예상보다 높았는데도 내렸다 → 안전자산 선호</div>
      </div>
      <Small top={1330} at={150}>금요일 마감 금리는 확인하지 못해 싣지 않았습니다 · 점선은 사이 구간 생략</Small>
      <Caption lines={BOND_L} />
    </AbsoluteFill>
  );
};

// 5. 목 → 금 뒤집힘
const SWING_L: Line[] = [
  { text: "경기주 방어는 목요일 이야기", from: 10, to: 100, em: ["목요일"] },
  { text: "금요일엔 다우도 -0.34%", from: 102, to: 205, em: ["-0.34%"] },
];
const SWING_ROWS = [
  { name: "다우", thu: 1.08, fri: -0.34 },
  { name: "나스닥", thu: 0.08, fri: -2.15 },
  { name: "반도체", thu: -0.88, fri: -3.83 },
];
export const SwingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 260, left: 70, right: 70, display: "flex", fontSize: 38, fontWeight: 700, color: US.ice, opacity: head }}>
        <div style={{ width: 230 }} />
        <div style={{ flex: 1, textAlign: "center" }}>목 10/15</div>
        <div style={{ flex: 1, textAlign: "center" }}>금 10/16</div>
      </div>
      {SWING_ROWS.map((r, i) => {
        const p = spring({ frame: frame - (14 + i * 14), fps, config: soft });
        const q = spring({ frame: frame - (60 + i * 16), fps, config: { damping: 10 } });
        return (
          <div key={r.name} style={{ position: "absolute", left: 70, right: 70, top: 340 + i * 220, height: 190, borderRadius: 26, background: US.card, border: `3px solid ${US.line}`, display: "flex", alignItems: "center", opacity: p, transform: `translateX(${(1 - p) * -120}px)` }}>
            <div style={{ width: 230, paddingLeft: 30, fontSize: 48, fontWeight: 900, color: C.text }}>{r.name}</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 66, fontWeight: 900, color: colorOf(r.thu), fontVariantNumeric: "tabular-nums" }}>{sign(r.thu)}</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 66, fontWeight: 900, color: colorOf(r.fri), fontVariantNumeric: "tabular-nums", opacity: Math.min(1, q * 2), transform: `translateY(${(1 - q) * -160}px)` }}>{sign(r.fri)}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1030, fontSize: 38, fontWeight: 700, color: US.amber, textAlign: "center", opacity: interpolate(frame, [130, 150], [0, 1], clamp) }}>
        소비 · 헬스케어로 돈이 옮겨간 건 목요일
        <div style={{ fontSize: 30, fontWeight: 500, color: US.dim, marginTop: 12 }}>금요일 중소형주 러셀2000은 -1.7% (보도 1건 기준)</div>
      </div>
      <Caption lines={SWING_L} />
    </AbsoluteFill>
  );
};

// 6. 엇갈린 시각 + 다음 일정
const VIEWS_L: Line[] = [
  { text: "시각은 둘로 갈립니다", from: 10, to: 90, em: ["둘로"] },
  { text: "다음 확인할 날짜, 10월 27~28일 FOMC", from: 100, to: 180, em: ["27~28일", "FOMC"] },
];
export const ViewsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = [
    { who: "크로스브리지캐피털", text: "AI 수요는 실재하지만, 인프라 투자가 전부 투자자에게 수익을 주는 것은 아니다", color: US.down, at: 8 },
    { who: "테미스트레이딩", text: "대형주 순환매는 몇 달에 한 번씩 반복되는 현상이다", color: US.amber, at: 50 },
  ];
  const chip = spring({ frame: frame - 100, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {cards.map((c, i) => {
        const p = spring({ frame: frame - c.at, fps, config: soft });
        return (
          <div key={c.who} style={{ position: "absolute", left: 70, right: 70, top: 250 + i * 330, height: 290, borderRadius: 28, background: US.card, border: `3px solid ${c.color}`, padding: "26px 34px", opacity: p, transform: `translateY(${(1 - p) * -300}px)` }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.color }}>{c.who} <span style={{ fontSize: 26, fontWeight: 500, color: US.dim }}>(10/15 보도 요지)</span></div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.text, marginTop: 18, lineHeight: 1.4, wordBreak: "keep-all" }}>{c.text}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 940, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, chip * 2), transform: `scale(${0.6 + chip * 0.4})` }}>
        <span style={{ fontSize: 58, fontWeight: 900, color: "#04131C", background: US.ice, borderRadius: 24, padding: "16px 40px" }}>10.27~28 FOMC</span>
        <div style={{ fontSize: 30, fontWeight: 500, color: US.dim, marginTop: 16 }}>다음 확인 일정</div>
      </div>
      <Caption lines={VIEWS_L} />
    </AbsoluteFill>
  );
};

// 7. 출처 · 고지
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 24], [0, 1], clamp);
  const row: React.CSSProperties = { fontSize: 38, fontWeight: 500, color: US.ice, marginTop: 22, lineHeight: 1.4 };
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 400, left: 80, right: 80, opacity: o }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.text }}>2026.10.16 미국 현지 종가 기준</div>
        <div style={row}>자료: 머니투데이 · 헤럴드경제 · 뉴스1 · 뉴스핌 보도 인용 (일부 수치는 보도 1건 기준)</div>
        <div style={row}>낙폭 비교 &quot;약 11배&quot;는 보도된 등락률로 직접 계산</div>
        <div style={{ ...row, color: US.amber, fontWeight: 700, marginTop: 44 }}>정보 제공용이며 투자 권유가 아닙니다. 판단과 책임은 본인에게 있습니다.</div>
        <div style={{ ...row, color: US.dim, fontSize: 30 }}>[음악] 채널에서 직접 만든 배경음악 · 대본 초안에 AI 도구를 사용했으며 사람이 검수했습니다</div>
      </div>
    </AbsoluteFill>
  );
};
