import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../components/Caption";
import { KineticTitle } from "../components/Kinetic";
import { C, fontFamily, springs } from "../theme";
import { clamp, Counter, M, Stamp } from "./effects";
import BARS from "./kospi.json";

// 숫자는 전부 output/briefs/2026-10-15_slot2.md 의 사실 카드에서 가져온다.

const Label: React.FC<{ children: React.ReactNode; top: number; color?: string; size?: number }> = ({ children, top, color = C.dim, size = 40 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 700, fontSize: size, color }}>{children}</div>
);

// 1. 훅: 6,625 → 5,554 숫자가 무너지고 -16.2% 가 찍힌다
const HOOK: Line[] = [
  { text: "코스피, 나흘 만에 -16%", from: 10, to: 80, em: ["-16%"] },
  { text: "한국 차트에선 폭락이 '파란색'입니다", from: 80, to: 150, em: ["'파란색'입니다"] },
];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const big = spring({ frame: frame - 40, fps: 30, config: { damping: 8, stiffness: 180 } });
  // 떨어지는 선
  const fall = interpolate(frame, [0, 45], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <Label top={300}>KOSPI · 10/8 → 10/15</Label>
      <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 150, color: C.text, letterSpacing: -4 }}>
        <Counter from={6625.93} to={5554.22} start={0} dur={40} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path
          d="M80 659 L310 786 L540 969 L770 983 L1000 1222"
          stroke={M.down}
          strokeWidth={16}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={1400}
          strokeDashoffset={1400 * (1 - fall)}
          opacity={interpolate(frame, [40, 55], [1, 0.3], clamp)}
          style={{ filter: `drop-shadow(0 0 24px ${M.down})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontSize: 300,
          letterSpacing: -12,
          color: M.down,
          opacity: frame >= 40 ? 1 : 0,
          transform: `scale(${0.4 + big * 0.6})`,
          textShadow: `0 0 80px ${M.down}, 0 12px 0 #0B2A66`,
        }}
      >
        -16.2%
      </div>
      <Caption lines={HOOK} />
    </AbsoluteFill>
  );
};

// 2. 피해 규모: 4일 하락률 막대 → 6월 고점 대비 막대, 서킷브레이커 도장
const DAMAGE: Line[] = [
  { text: "삼성전자 -20%, SK하이닉스 -25%", from: 0, to: 140, em: ["-20%,", "-25%"] },
  { text: "오늘은 장중 서킷브레이커까지 발동", from: 140, to: 200, em: ["서킷브레이커"] },
  { text: "6월 고점에서 하이닉스는 반토막 넘게", from: 200, to: 255, em: ["반토막"] },
];
const ROWS = [
  { n: "코스피", week: -16.2, peak: -39.1 },
  { n: "삼성전자", week: -19.8, peak: -42.1 },
  { n: "SK하이닉스", week: -24.9, peak: -56.8 },
];
export const DamageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toPeak = interpolate(frame, [190, 225], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const unit = 13;
  return (
    <AbsoluteFill>
      <Label top={290} size={46} color={C.text}>
        {toPeak < 0.5 ? "이번 주 4거래일" : "6월 고점 대비"}
      </Label>
      {ROWS.map((r, i) => {
        const g = spring({ frame: frame - 10 - i * 12, fps, config: springs.snappy });
        const v = (r.week + (r.peak - r.week) * toPeak) * g;
        return (
          <div key={r.n} style={{ position: "absolute", top: 400 + i * 190, left: 80, right: 80 }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 42, color: C.dim, marginBottom: 12 }}>{r.n}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: Math.abs(v) * unit,
                  height: 86,
                  borderRadius: 14,
                  background: `linear-gradient(90deg, #1B4FB8, ${M.down})`,
                  boxShadow: `0 0 50px ${M.downGlow}`,
                }}
              />
              <div style={{ fontFamily, fontWeight: 900, fontSize: 76, color: M.down, fontVariantNumeric: "tabular-nums" }}>{v.toFixed(1)}%</div>
            </div>
          </div>
        );
      })}
      <Stamp at={150} style={{ top: 1000, left: 150, right: 150, fontSize: 84 }}>
        서킷브레이커
        <div style={{ fontSize: 40, marginTop: 6 }}>10.15 장중 · 매매 일시 정지</div>
      </Stamp>
      <Caption lines={DAMAGE} />
    </AbsoluteFill>
  );
};

// 3. 원인 세 가지: 날짜 카드가 하나씩 꽂힌다
const CARDS = [
  { at: 30, date: "10.12", tag: "중국 CXMT", body: "차세대 D램 설계 공개", sub: "아직 제품 사양·수율은 미공개" },
  { at: 150, date: "10.14", tag: "머스크 X 게시물", body: "\"메모리 업체들이\n터무니없는 가격을 요구\"", sub: "특정 회사 이름은 언급 안 함" },
  { at: 270, date: "10.14 (미국)", tag: "美 9월 물가", body: "3.7% — 예상 3.6% 상회", sub: "10월 금리 인상 확률 절반 수준으로" },
];
const CAUSES: Line[] = [
  { text: "이유는 세 가지가 겹쳤습니다", from: 0, to: 30 },
  { text: "① 중국 메모리 업체의 추격", from: 30, to: 150, em: ["추격"] },
  { text: "② 머스크의 메모리 '가격' 비판", from: 150, to: 270, em: ["'가격'"] },
  { text: "③ 예상보다 뜨거운 미국 물가 → 금리 걱정", from: 270, to: 390, em: ["금리"] },
];
export const CausesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 260, left: 80 }}>
        <KineticTitle text="왜 무너졌나" size={96} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 420, bottom: 420, width: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
      {CARDS.map((c, i) => {
        const p = spring({ frame: frame - c.at, fps, config: { damping: 14, stiffness: 160 } });
        const active = frame >= c.at && (i === CARDS.length - 1 || frame < CARDS[i + 1].at);
        return (
          <div
            key={c.date + i}
            style={{
              position: "absolute",
              top: 420 + i * 300,
              left: 70,
              right: 60,
              opacity: p,
              transform: `translateX(${(1 - p) * 700}px)`,
              display: "flex",
              gap: 30,
            }}
          >
            <div style={{ width: 58, height: 58, borderRadius: 29, marginTop: 10, background: active ? M.down : "#2A3150", boxShadow: active ? `0 0 30px ${M.down}` : "none" }} />
            <div
              style={{
                flex: 1,
                padding: "26px 32px",
                borderRadius: 26,
                background: active ? "rgba(61,139,255,0.16)" : "rgba(255,255,255,0.06)",
                border: `2px solid ${active ? M.down : "rgba(255,255,255,0.1)"}`,
                fontFamily,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 34, color: C.dim }}>
                {c.date} · <span style={{ color: C.accent }}>{c.tag}</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 48, color: C.text, marginTop: 8, lineHeight: 1.25, whiteSpace: "pre-line" }}>{c.body}</div>
              <div style={{ fontWeight: 500, fontSize: 32, color: C.dim, marginTop: 8 }}>{c.sub}</div>
            </div>
          </div>
        );
      })}
      <Caption lines={CAUSES} />
    </AbsoluteFill>
  );
};

// 4. 실적 vs 주가: 실적 막대는 오르고, 주가 선은 꺾인다
const EARN: Line[] = [
  { text: "그런데 실적은 사상 최대였어요", from: 0, to: 75, em: ["사상", "최대였어요"] },
  { text: "삼성전자 3분기 영업이익 107.4조", from: 75, to: 150, em: ["107.4조"] },
  { text: "실적보다 '기대'가 더 높았다는 뜻", from: 150, to: 225, em: ["'기대'가"] },
];
export const EarningsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const line = interpolate(frame, [40, 110], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const vs = spring({ frame: frame - 150, fps, config: springs.bouncy });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, bottom: 760, width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 72, color: M.up, marginBottom: 14 }}>
          <Counter from={0} to={107.4} start={15} dur={45} digits={1} />조
        </div>
        <div style={{ width: 200, height: 620 * bar, borderRadius: "18px 18px 0 0", background: `linear-gradient(0deg, #7A1020, ${M.up})`, boxShadow: `0 0 60px ${M.up}66` }} />
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: C.dim, marginTop: 16 }}>3분기 영업이익</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path
          d="M560 587 L660 691 L760 857 L860 857 L960 1055"
          stroke={M.down}
          strokeWidth={14}
          fill="none"
          strokeLinejoin="round"
          strokeDasharray={900}
          strokeDashoffset={900 * (1 - line)}
          style={{ filter: `drop-shadow(0 0 20px ${M.down})` }}
        />
        <text x={760} y={1230} textAnchor="middle" fill={C.dim} fontFamily={fontFamily} fontWeight={700} fontSize={36}>
          삼성전자 주가 (10/8 → 10/15)
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontSize: 88,
          color: C.text,
          opacity: vs,
          transform: `scale(${0.6 + vs * 0.4})`,
        }}
      >
        기대 <span style={{ color: C.accent }}>&gt;</span> 실적
      </div>
      <Caption lines={EARN} />
    </AbsoluteFill>
  );
};

// 5. 기술적 분석: 코스피 캔들 + 200일선 이탈 + RSI 과매도 + 판정표
const TECH: Line[] = [
  { text: "차트 규칙으로 보면?", from: 0, to: 90 },
  { text: "세 차트 모두 200일선 아래로", from: 90, to: 195, em: ["200일선"] },
  { text: "RSI 23, 볼린저 하단도 뚫었습니다", from: 195, to: 315, em: ["RSI", "23,"] },
  { text: "과매도는 맞지만, 추세는 아직 '위험 회피'", from: 315, to: 420, em: ["'위험", "회피'"] },
];
const CH = { x0: 70, x1: 1010, y0: 330, y1: 1080 };
export const TechnicalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = BARS.length;
  const lo = Math.min(...BARS.map((b) => b.l)) * 0.97;
  const hi = Math.max(...BARS.map((b) => b.h)) * 1.01;
  const X = (i: number) => CH.x0 + ((i + 0.5) / n) * (CH.x1 - CH.x0);
  const Y = (v: number) => CH.y1 - ((v - lo) / (hi - lo)) * (CH.y1 - CH.y0);
  const cw = ((CH.x1 - CH.x0) / n) * 0.62;
  const shown = Math.floor(interpolate(frame, [0, 80], [0, n], clamp));
  const path = (key: "s20" | "s60" | "s200", upto: number) =>
    BARS.slice(0, upto)
      .map((b, i) => (b[key] == null ? null : `${X(i)},${Y(b[key] as number)}`))
      .filter(Boolean)
      .map((p, i) => `${i ? "L" : "M"}${p}`)
      .join(" ");
  const ma200 = interpolate(frame, [90, 120], [0, 1], clamp);
  const last = BARS[n - 1];
  const rsiIn = spring({ frame: frame - 195, fps, config: springs.smooth });
  const needle = interpolate(rsiIn, [0, 1], [50, last.rsi as number]);
  const verdict = spring({ frame: frame - 315, fps, config: springs.bouncy });
  // 화면을 아래로 밀며 판정표가 올라온다
  const chartFade = interpolate(frame, [305, 325], [1, 0.12], clamp);
  return (
    <AbsoluteFill>
      <Label top={240} size={38}>
        KOSPI 일봉 · 2026.5 ~ 10.15
      </Label>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: chartFade }}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={CH.x0} x2={CH.x1} y1={CH.y0 + (CH.y1 - CH.y0) * f} y2={CH.y0 + (CH.y1 - CH.y0) * f} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
        ))}
        {BARS.slice(0, shown).map((b, i) => {
          const col = b.c >= b.o ? M.up : M.down;
          return (
            <g key={b.d}>
              <line x1={X(i)} x2={X(i)} y1={Y(b.h)} y2={Y(b.l)} stroke={col} strokeWidth={2} />
              <rect x={X(i) - cw / 2} y={Y(Math.max(b.o, b.c))} width={cw} height={Math.max(2, Math.abs(Y(b.o) - Y(b.c)))} fill={col} />
            </g>
          );
        })}
        <path d={path("s20", shown)} stroke="#FFC93C" strokeWidth={4} fill="none" opacity={0.9} />
        <path d={path("s60", shown)} stroke="#B48CFF" strokeWidth={4} fill="none" opacity={0.9} />
        <path
          d={path("s200", n)}
          stroke="#FFFFFF"
          strokeWidth={6}
          strokeDasharray="18 12"
          fill="none"
          opacity={ma200}
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))" }}
        />
        {frame >= 90 && (
          <g opacity={ma200}>
            <circle cx={X(n - 1)} cy={Y(last.c)} r={22 + Math.sin(frame / 4) * 6} fill="none" stroke={M.down} strokeWidth={5} />
            <text x={X(n - 1) - 30} y={Y(last.s200 as number) - 24} textAnchor="end" fill="#fff" fontFamily={fontFamily} fontWeight={900} fontSize={36}>
              200일선 {Math.round(last.s200 as number).toLocaleString()}
            </text>
            <text x={X(n - 1) - 30} y={Y(last.c) + 60} textAnchor="end" fill={M.down} fontFamily={fontFamily} fontWeight={900} fontSize={40}>
              종가 5,554 (-13.3%)
            </text>
          </g>
        )}
        <g fontFamily={fontFamily} fontWeight={700} fontSize={30}>
          <rect x={CH.x0} y={CH.y0 - 10} width={24} height={6} fill="#FFC93C" />
          <text x={CH.x0 + 34} y={CH.y0} fill={C.dim}>20일</text>
          <rect x={CH.x0 + 130} y={CH.y0 - 10} width={24} height={6} fill="#B48CFF" />
          <text x={CH.x0 + 164} y={CH.y0} fill={C.dim}>60일</text>
          <rect x={CH.x0 + 260} y={CH.y0 - 10} width={24} height={6} fill="#fff" opacity={ma200} />
          <text x={CH.x0 + 294} y={CH.y0} fill={C.dim} opacity={ma200}>200일</text>
        </g>
      </svg>
      <div style={{ opacity: chartFade }}>
        <Stamp at={90} rotate={-6} style={{ top: 1120, left: 90, fontSize: 56, padding: "10px 30px" }}>
          200일선 이탈
        </Stamp>
      </div>
      {/* RSI 게이지 */}
      {frame >= 195 && (
        <div style={{ position: "absolute", top: 1110, right: 70, width: 400, opacity: rsiIn * chartFade, fontFamily }}>
          <div style={{ fontWeight: 700, fontSize: 34, color: C.dim }}>RSI(14)</div>
          <div style={{ position: "relative", height: 40, marginTop: 14, borderRadius: 20, background: "linear-gradient(90deg, #3D8BFF 0%, #3D8BFF 30%, #2A3150 30%, #2A3150 70%, #FF4D5E 70%)" }}>
            <div style={{ position: "absolute", left: `${needle}%`, top: -14, width: 8, height: 68, marginLeft: -4, background: "#fff", borderRadius: 4, boxShadow: "0 0 20px #fff" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 28, color: C.dim, marginTop: 8 }}>
            <span>과매도 30↓</span>
            <span style={{ fontWeight: 900, fontSize: 52, color: M.down }}>{needle.toFixed(1)}</span>
          </div>
        </div>
      )}
      {/* 판정표 */}
      {frame >= 315 && (
        <div
          style={{
            position: "absolute",
            top: 560,
            left: 90,
            right: 90,
            opacity: verdict,
            transform: `translateY(${(1 - verdict) * 200}px)`,
            fontFamily,
            borderRadius: 30,
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.15)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          {[
            { k: "과매도 (RSI·볼린저)", v: "✓", c: M.supportLine },
            { k: "추세 (200일선 위?)", v: "✗", c: M.resistLine },
            { k: "20일선 vs 60일선", v: "붙음", c: C.accent },
          ].map((r, i) => (
            <div key={r.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "34px 40px", background: i % 2 ? "rgba(20,26,51,0.95)" : "rgba(14,18,36,0.95)" }}>
              <span style={{ fontWeight: 700, fontSize: 44, color: C.text }}>{r.k}</span>
              <span style={{ fontWeight: 900, fontSize: 64, color: r.c }}>{r.v}</span>
            </div>
          ))}
          <div style={{ padding: "26px 40px", background: "rgba(61,139,255,0.25)", fontWeight: 900, fontSize: 46, color: "#fff", textAlign: "center" }}>
            판정: 위험 회피 구간
          </div>
        </div>
      )}
      <Caption lines={TECH} />
    </AbsoluteFill>
  );
};

// 6. 앞으로: 지지·저항 띠 + 세 갈래 의견
const OUT: Line[] = [
  { text: "앞으로는 의견이 갈립니다", from: 0, to: 60 },
  { text: "차트상 가까운 지지 5,050 · 저항 6,400", from: 60, to: 150, em: ["5,050", "6,400"] },
  { text: "금리·AI 투자 성과를 확인해야 한다는 신중론도", from: 150, to: 255, em: ["신중론도"] },
];
const VIEWS = [
  { t: "반등", who: "키움증권", say: "역대급 과매도, 반등 확률이 더 높다", c: M.up },
  { t: "지지", who: "한국투자·삼성증권", say: "5,000선(PBR 1배)이 지지선", c: C.accent },
  { t: "신중", who: "증권가 다수", say: "금리·AI 성과 확인 전엔 바닥 판단 유보", c: M.down },
];
export const OutlookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lo = 4700, hi = 6800;
  const Y = (v: number) => 880 - ((v - lo) / (hi - lo)) * 480;
  const band = interpolate(frame, [50, 80], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={60} y={Y(6404) - 28} width={960 * band} height={56} fill={M.resist} />
        <line x1={60} x2={60 + 960 * band} y1={Y(6404)} y2={Y(6404)} stroke={M.resistLine} strokeWidth={4} />
        <text x={80} y={Y(6404) - 40} fill={M.resistLine} fontFamily={fontFamily} fontWeight={900} fontSize={40} opacity={band}>
          저항 6,404 (+15%)
        </text>
        <rect x={60} y={Y(5051) - 28} width={960 * band} height={56} fill={M.support} />
        <line x1={60} x2={60 + 960 * band} y1={Y(5051)} y2={Y(5051)} stroke={M.supportLine} strokeWidth={4} />
        <text x={80} y={Y(5051) + 74} fill={M.supportLine} fontFamily={fontFamily} fontWeight={900} fontSize={40} opacity={band}>
          지지 5,051 (-9%)
        </text>
        <line x1={60} x2={1020} y1={Y(5554)} y2={Y(5554)} stroke="#fff" strokeWidth={3} strokeDasharray="10 10" />
        <circle cx={900} cy={Y(5554)} r={18 + Math.sin(frame / 4) * 5} fill={M.down} />
        <text x={860} y={Y(5554) - 30} textAnchor="end" fill="#fff" fontFamily={fontFamily} fontWeight={900} fontSize={42}>
          지금 5,554
        </text>
      </svg>
      <Label top={250} size={40}>
        KOSPI 지지·저항 (최근 160봉 고점·저점 군집)
      </Label>
      {VIEWS.map((v, i) => {
        const p = spring({ frame: frame - 90 - i * 25, fps, config: springs.snappy });
        return (
          <div
            key={v.t}
            style={{
              position: "absolute",
              top: 960 + i * 150,
              left: 70,
              right: 70,
              opacity: p,
              transform: `translateY(${(1 - p) * 80}px)`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "20px 28px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.06)",
              borderLeft: `10px solid ${v.c}`,
              fontFamily,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 48, color: v.c, width: 110 }}>{v.t}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 30, color: C.dim }}>{v.who}</div>
              <div style={{ fontWeight: 700, fontSize: 38, color: C.text }}>"{v.say}"</div>
            </div>
          </div>
        );
      })}
      <Caption lines={OUT} />
    </AbsoluteFill>
  );
};

// 7. 마무리
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 15], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 84, color: C.text, lineHeight: 1.2 }}>
        투자 판단은 각자,
        <br />
        <span style={{ color: C.accent }}>숫자는 같이</span> 봅시다
      </div>
      <div style={{ marginTop: 60, fontWeight: 700, fontSize: 34, color: C.dim, lineHeight: 1.6 }}>
        2026.10.15 종가 기준 · 투자 권유 아님
        <br />
        시세: Yahoo Finance · 뉴스: 코리아중앙데일리, iMBC, Korea Times,
        <br />
        파이낸셜뉴스, 한국일보, YTN · 증권사 의견: 비즈워치, 머니투데이 외
      </div>
    </AbsoluteFill>
  );
};
