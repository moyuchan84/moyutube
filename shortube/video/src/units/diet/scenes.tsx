import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { KineticTitle } from "../../components/Kinetic";
import { clamp, Counter, Stamp } from "../market/effects";
import { C, fontFamily } from "../../theme";

// 숫자는 output/briefs/2026-10-15_slot4.md 사실 카드에서만 가져온다.
// 의료 주제: 권유·구매 안내 없음, 효과와 같은 비중으로 리스크를 보여 준다. 제품 이미지·로고 없음.

export const D = {
  mint: "#34D399",
  teal: "#38BDF8",
  coral: "#FB7185",
  amber: "#FBBF24",
  bg: "#081221",
};

const soft = { damping: 14, stiffness: 140 };

const Title: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: soft });
  return (
    <div style={{ position: "absolute", top: 250, left: 80, right: 80, fontFamily, fontWeight: 900, fontSize: 76, color, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      {children}
    </div>
  );
};

const Note: React.FC<{ top: number; at?: number; children: React.ReactNode; color?: string; size?: number }> = ({ top, at = 0, children, color = C.dim, size = 34 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return <div style={{ position: "absolute", top, left: 80, right: 80, fontFamily, fontWeight: 700, fontSize: size, color, opacity: o, lineHeight: 1.4 }}>{children}</div>;
};

// 0. 훅
const INTRO: Line[] = [
  { text: "요즘 다이어트 주사,", from: 10, to: 60, em: ["다이어트", "주사,"] },
  { text: "숫자로만 정리해 봤습니다", from: 60, to: 120, em: ["숫자로만"] },
];
export const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 560, left: 80, right: 80 }}>
      <KineticTitle text="다이어트 주사" size={130} color="#fff" />
      <div style={{ marginTop: 10 }}>
        <KineticTitle text="숫자로 보면" size={130} color={D.mint} delay={14} />
      </div>
    </div>
    <Stamp at={20} color={D.amber} rotate={-4} style={{ top: 960, left: 150, right: 150, fontSize: 44, padding: "10px 24px" }}>
      전문의약품 · 의사 처방 필요
    </Stamp>
    <Caption lines={INTRO} />
  </AbsoluteFill>
);

// 1. 종류
const TYPES = [
  { n: "마운자로", s: "티르제파타이드", f: "주 1회", c: D.mint },
  { n: "위고비", s: "세마글루타이드", f: "주 1회", c: D.teal },
  { n: "삭센다", s: "리라글루타이드", f: "매일", c: D.amber },
];
const TYPES_L: Line[] = [
  { text: "많이 쓰는 건 세 가지", from: 0, to: 90 },
  { text: "두 개는 주 1회, 하나는 매일 맞습니다", from: 90, to: 210, em: ["주", "1회,", "매일"] },
];
export const TypesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Title>어떤 주사들?</Title>
      {TYPES.map((t, i) => {
        const p = spring({ frame: frame - 10 - i * 14, fps, config: soft });
        return (
          <div
            key={t.n}
            style={{
              position: "absolute",
              top: 420 + i * 190,
              left: 80,
              right: 80,
              height: 160,
              borderRadius: 28,
              background: "rgba(255,255,255,0.06)",
              borderLeft: `14px solid ${t.c}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              fontFamily,
              opacity: p,
              transform: `translateX(${(1 - p) * 300}px)`,
            }}
          >
            <div>
              <div style={{ fontWeight: 900, fontSize: 60, color: "#fff" }}>{t.n}</div>
              <div style={{ fontWeight: 600, fontSize: 32, color: C.dim }}>{t.s}</div>
            </div>
            <div style={{ fontWeight: 900, fontSize: 54, color: t.c }}>{t.f}</div>
          </div>
        );
      })}
      <Note top={1010} at={40}>
        세 약 모두 GLP-1 계열 (마운자로는 GIP 함께 작용)
      </Note>
      <Caption lines={TYPES_L} />
    </AbsoluteFill>
  );
};

// 2. 효과
const EFFECT = [
  { n: "마운자로 계열", v: 20.2, kg: "22.8kg", c: D.mint, at: 30, w: "72주" },
  { n: "위고비 계열", v: 13.7, kg: "15.0kg", c: D.teal, at: 90, w: "72주" },
  { n: "삭센다 계열", v: 8.0, kg: "", c: D.amber, at: 150, w: "56주 · 다른 시험" },
];
const EFFECT_L: Line[] = [
  { text: "임상시험 평균 체중 감소율", from: 0, to: 90 },
  { text: "직접 비교 시험에서 -20.2% vs -13.7%", from: 90, to: 180, em: ["-20.2%", "-13.7%"] },
  { text: "평균값이라 사람마다 차이가 큽니다", from: 180, to: 270, em: ["사람마다"] },
];
export const EffectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const unit = 38;
  return (
    <AbsoluteFill>
      <Title>평균 얼마나 빠졌나</Title>
      {EFFECT.map((e, i) => {
        const g = interpolate(frame, [e.at, e.at + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={e.n} style={{ position: "absolute", top: 400 + i * 225, left: 80, right: 80, fontFamily }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 36, color: C.dim, marginBottom: 10 }}>
              <span>{e.n}</span>
              <span>{e.w}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: e.v * unit * g, height: 84, borderRadius: 16, background: e.c, boxShadow: `0 0 40px ${e.c}55` }} />
              <div style={{ fontWeight: 900, fontSize: 70, color: "#fff", opacity: g }}>-{(e.v * g).toFixed(1)}%</div>
            </div>
            {e.kg && <div style={{ fontWeight: 700, fontSize: 32, color: e.c, marginTop: 6, opacity: g }}>평균 {e.kg} 감소</div>}
          </div>
        );
      })}
      <Note top={1090} at={170} size={30}>
        위 두 줄: 같은 시험(SURMOUNT-5, NEJM 2025) · 아래: SCALE(NEJM 2015)
      </Note>
      <Caption lines={EFFECT_L} />
    </AbsoluteFill>
  );
};

// 3. 증가
const GROWTH = [
  { y: "2024", v: 5, label: "약 5만" },
  { y: "2025", v: 122, label: "약 122만" },
  { y: "2026 상반기", v: 186, label: "약 186만" },
];
const GROWTH_L: Line[] = [
  { text: "2024년 한 해보다 올해 상반기가 37배", from: 0, to: 100, em: ["37배"] },
  { text: "마운자로 처방의 절반 이상이 20·30대", from: 100, to: 240, em: ["20·30대"] },
];
export const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = 960;
  const young = spring({ frame: frame - 100, fps, config: soft });
  return (
    <AbsoluteFill>
      <Title>얼마나 늘었나</Title>
      <Note top={350} size={32}>
        위고비·마운자로 처방전 수 (DUR 점검 기준)
      </Note>
      {GROWTH.map((g, i) => {
        const p = interpolate(frame, [10 + i * 25, 50 + i * 25], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const h = (g.v / 186) * 420 * p + 6;
        return (
          <div key={g.y} style={{ position: "absolute", left: 120 + i * 300, width: 220, top: base - h, height: h, borderRadius: "18px 18px 0 0", background: i === 2 ? D.mint : "rgba(52,211,153,0.45)" }}>
            <div style={{ position: "absolute", top: -64, left: -40, right: -40, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 46, color: "#fff", opacity: p }}>{g.label}</div>
            <div style={{ position: "absolute", top: h + 14, left: -40, right: -40, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 32, color: C.dim }}>{g.y}</div>
          </div>
        );
      })}
      {frame >= 100 && (
        <div style={{ position: "absolute", top: 1060, left: 80, right: 80, display: "flex", alignItems: "center", gap: 30, fontFamily, opacity: young, transform: `scale(${0.8 + young * 0.2})` }}>
          <div style={{ fontWeight: 900, fontSize: 110, color: D.amber }}>
            <Counter from={0} to={52.9} start={100} dur={30} digits={1} />%
          </div>
          <div style={{ fontWeight: 700, fontSize: 38, color: "#fff", lineHeight: 1.3 }}>
            마운자로 처방 중
            <br />
            20·30대 비중
          </div>
        </div>
      )}
      <Caption lines={GROWTH_L} />
    </AbsoluteFill>
  );
};

// 4. 비용
const COST_L: Line[] = [
  { text: "저용량 한 달(4주)분이 30만~40만원대", from: 0, to: 90, em: ["30만~40만원대"] },
  { text: "건강보험 안 되고, 용량이 오를수록 비쌉니다", from: 90, to: 180, em: ["건강보험", "안"] },
];
export const CostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = spring({ frame: frame - 90, fps, config: soft });
  return (
    <AbsoluteFill>
      <Title>비용은</Title>
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 150, color: "#fff", textShadow: `0 0 40px ${D.teal}` }}>
        <Counter from={0} to={30} start={5} dur={25} digits={0} />~<Counter from={0} to={40} start={5} dur={25} digits={0} />
        <span style={{ fontSize: 80 }}>만원대</span>
      </div>
      <Note top={640} size={36} color={C.text}>
        <div style={{ textAlign: "center" }}>마운자로 저용량 4주분 · 약국가 · 보도 기준</div>
      </Note>
      <Stamp at={40} color={D.coral} rotate={-5} style={{ top: 730, left: 260, right: 260, fontSize: 56, padding: "8px 20px" }}>
        비급여
      </Stamp>
      <div style={{ position: "absolute", top: 930, left: 80, right: 80, fontFamily, opacity: m, transform: `translateY(${(1 - m) * 40}px)`, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 34, color: C.dim }}>국내 비만약 시장 (2025)</div>
        <div style={{ fontWeight: 900, fontSize: 80, color: D.mint }}>약 5,700억 원</div>
        <div style={{ fontWeight: 700, fontSize: 34, color: "#fff" }}>1년 새 2배 · 세계 5위</div>
      </div>
      <Caption lines={COST_L} />
    </AbsoluteFill>
  );
};

// 5. 리스크
const RISKS = [
  { at: 10, big: "25~33%", t: "메스꺼움", s: "마운자로 시험, 위약 9.5%", c: D.coral },
  { at: 75, big: "2/3", t: "끊으면 1년 안에 돌아온 체중", s: "위고비 시험 중단 후 추적", c: D.amber },
  { at: 150, big: "1건", t: "시력 손상 의심 국내 보고", s: "인과관계 미확인 · '드물게'", c: D.teal },
  { at: 225, big: "지정 추진", t: "식약처 '오남용 우려 의약품'", s: "2026.10 기준", c: D.coral },
];
const RISK_L: Line[] = [
  { text: "리스크도 숫자로 보면", from: 0, to: 75 },
  { text: "끊으면 빠진 체중의 3분의 2가 돌아왔고", from: 75, to: 150, em: ["3분의", "2가"] },
  { text: "드물지만 시력 손상 보고도 있습니다", from: 150, to: 225, em: ["시력"] },
  { text: "식약처는 오남용 우려 약 지정을 추진 중", from: 225, to: 300, em: ["오남용"] },
];
export const RiskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Title color={D.coral}>리스크는</Title>
      {RISKS.map((r, i) => {
        const p = spring({ frame: frame - r.at, fps, config: soft });
        return (
          <div
            key={r.t}
            style={{
              position: "absolute",
              top: 390 + i * 172,
              left: 70,
              right: 70,
              height: 150,
              borderRadius: 26,
              background: frame >= r.at ? "rgba(255,255,255,0.07)" : "transparent",
              border: `2px solid ${r.c}55`,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 34px",
              fontFamily,
              opacity: p,
              transform: `translateY(${(1 - p) * 60}px)`,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: r.big.length > 4 ? 50 : 68, color: r.c, width: 250 }}>{r.big}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 38, color: "#fff" }}>{r.t}</div>
              <div style={{ fontWeight: 600, fontSize: 28, color: C.dim }}>{r.s}</div>
            </div>
          </div>
        );
      })}
      <Caption lines={RISK_L} />
    </AbsoluteFill>
  );
};

// 6. 마무리
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 15], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily, textAlign: "center", padding: "0 70px" }}>
      <div style={{ fontWeight: 900, fontSize: 82, color: "#fff", lineHeight: 1.25 }}>
        처방은 <span style={{ color: D.mint }}>의사와</span>,
        <br />
        숫자는 같이 봅시다
      </div>
      <div style={{ marginTop: 50, fontWeight: 800, fontSize: 36, color: D.amber }}>의학적 조언이 아닙니다 · 사용 여부는 반드시 의사와 상담</div>
      <div style={{ marginTop: 30, fontWeight: 600, fontSize: 28, color: C.dim, lineHeight: 1.6 }}>
        2026.10.15 기준
        <br />
        NEJM (SURMOUNT-1·5, SCALE) · Diabetes Obes Metab (STEP 1)
        <br />
        심평원 자료(국회) · 아이큐비아 · 식약처 · 데일리팜 보도
      </div>
    </AbsoluteFill>
  );
};
