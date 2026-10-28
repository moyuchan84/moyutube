import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { chalk, Clock, DDAY, S, Sheet, Tag, Write } from "./fx";
import HIST from "../../../../content/suneung/script/history.json";

// 숫자는 output/briefs/2026-10-16_slot3.md 사실 카드에서만 가져온다 (카드 id 를 주석에 적음).
const soft = { damping: 14, stiffness: 140 };

const Pop: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: soft });
  return <div style={{ position: "absolute", opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>;
};

const Head: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 220 }) => (
  <Write at={0} dur={12} style={{ top, left: 70, right: 70, ...chalk(80) }}>
    {children}
  </Write>
);

const num = (n: number) => n.toLocaleString("ko-KR");

// 0. 훅 — D-day (S01)
const HOOK_L: Line[] = [
  { text: `수능 D-${DDAY}`, from: 8, to: 60, em: [`D-${DDAY}`] },
  { text: "숫자로 보면 올해가 좀 다릅니다", from: 60, to: 120, em: ["올해가"] },
];
export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <Clock size={260} style={{ left: 410, top: 300 }} />
    <Write at={10} dur={16} style={{ top: 620, left: 0, right: 0, textAlign: "center", ...chalk(300, S.yellow), lineHeight: 1 }}>
      D-{DDAY}
    </Write>
    <Write at={26} dur={14} style={{ top: 960, left: 0, right: 0, textAlign: "center", ...chalk(84) }}>
      2026. 11. 19 (목)
    </Write>
    <Stamp at={44} color={S.omr} rotate={-7} style={{ top: 1150, left: 200, right: 200, fontSize: 62, background: "rgba(19,37,25,0.7)" }}>
      2027학년도 수능
    </Stamp>
    <Caption lines={HOOK_L} />
  </AbsoluteFill>
);

// 1. 지원자 수 — OMR 칸 칠하기로 551,864 (S02)
const TOTAL = 551864;
const TOTAL_L: Line[] = [
  { text: "올해 수능 지원자 55만 1,864명", from: 6, to: 120, em: ["55만", "1,864명"] },
  { text: "작년보다 2,310명 줄었는데…", from: 120, to: 210, em: ["2,310명"] },
];
export const TotalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const digits = String(TOTAL).split("").map(Number);
  const colW = 128;
  const left = (900 - digits.length * colW) / 2;
  return (
    <AbsoluteFill>
      <Head>올해 지원자</Head>
      <Sheet style={{ top: 360, left: 90, width: 900, height: 720 }}>
        <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 30, color: S.omr, letterSpacing: "0.3em" }}>지 원 자 수</div>
        {digits.map((d, c) => {
          const at = 14 + c * 12;
          return (
            <div key={c} style={{ position: "absolute", left: left + c * colW, top: 70, width: colW - 14 }}>
              {/* 손으로 적은 숫자 칸 */}
              <div style={{ height: 76, border: `3px solid ${S.omr}`, borderRadius: 6, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 56, color: S.ink, lineHeight: "70px" }}>
                {frame >= at + 8 ? d : ""}
              </div>
              {Array.from({ length: 10 }, (_, r) => {
                const fill = r === d ? interpolate(frame, [at, at + 8], [0, 1], clamp) : 0;
                return (
                  <div key={r} style={{ position: "relative", margin: "12px auto 0", width: 76, height: 40, borderRadius: 40, border: `3px solid ${S.omrSoft}`, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 24, color: S.omr, lineHeight: "34px" }}>
                    {r}
                    <div style={{ position: "absolute", inset: -3, borderRadius: 40, background: S.ink, transform: `scaleX(${fill})`, transformOrigin: "left" }} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </Sheet>
      <Pop at={90} style={{ top: 1110, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 120, color: S.chalk, lineHeight: 1 }}>
          {num(TOTAL)}
          <span style={{ fontSize: 60 }}>명</span>
        </div>
      </Pop>
      <Pop at={124} style={{ top: 1260, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ ...chalk(64, S.down), color: "#8FB6FF" }}>작년보다 ▼ 2,310명</span>
      </Pop>
      <Tag top={1360} at={124}>한국교육과정평가원 2026.9.8 발표 (원서 접수 기준)</Tag>
      <Caption lines={TOTAL_L} />
    </AbsoluteFill>
  );
};

// 2. 재학생 ↓ 졸업생 ↑ (S03 · S04)
const NSU = [
  { label: "재학생", n: 355391, pct: 64.4, diff: -16506, color: "#CFE3D6" },
  { label: "졸업생", n: 173706, pct: 31.5, diff: 13784, color: "#FFB067" },
  { label: "검정고시 등", n: 22767, pct: 4.1, diff: 412, color: S.pink },
];
const NSU_L: Line[] = [
  { text: "재학생은 1만 6,506명 줄고", from: 6, to: 90, em: ["줄고"] },
  { text: "졸업생은 1만 3,784명 늘었습니다", from: 90, to: 160, em: ["늘었습니다"] },
  { text: "졸업생+검정고시 23년 만에 최다", from: 160, to: 240, em: ["23년"] },
];
export const NsuScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [8, 40], [0, 1], clamp);
  let acc = 0;
  return (
    <AbsoluteFill>
      <Head>누가 보나</Head>
      {/* 100% 막대 */}
      <div style={{ position: "absolute", top: 380, left: 70, width: 940, height: 110, borderRadius: 14, overflow: "hidden", border: `4px solid ${S.chalk}` }}>
        {NSU.map((g) => {
          const x = acc;
          acc += g.pct;
          return <div key={g.label} style={{ position: "absolute", left: `${x}%`, width: `${g.pct * grow}%`, top: 0, bottom: 0, background: g.color }} />;
        })}
      </div>
      <Pop at={30} style={{ top: 505, left: 70, right: 70, display: "flex", justifyContent: "space-between", fontFamily, fontWeight: 700, fontSize: 32, color: S.chalkDim }}>
        <span>재학생 64.4%</span>
        <span>졸업생 31.5% · 검정고시 등 4.1%</span>
      </Pop>
      {NSU.map((g, i) => {
        const up = g.diff > 0;
        return (
          <Pop key={g.label} at={44 + i * 28} style={{ top: 610 + i * 150, left: 70, right: 70, height: 126, borderRadius: 20, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", padding: "0 34px" }}>
            <div style={{ width: 22, height: 22, borderRadius: 22, background: g.color, marginRight: 22 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...chalk(46) }}>{g.label}</div>
              <div style={{ fontFamily, fontWeight: 900, fontSize: 52, color: S.chalk }}>{num(g.n)}명</div>
            </div>
            <div style={{ fontFamily, fontWeight: 900, fontSize: 52, color: up ? "#FF8A73" : "#8FB6FF" }}>
              {up ? "▲" : "▼"} {num(Math.abs(g.diff))}
            </div>
          </Pop>
        );
      })}
      <Stamp at={140} color={S.yellow} rotate={-5} style={{ top: 1090, left: 110, right: 110, fontSize: 50, lineHeight: 1.3, background: "rgba(19,37,25,0.85)" }}>
        졸업생+검정고시 19만 6,473명
        <div style={{ fontSize: 40 }}>2004학년도 이후 23년 만에 최다</div>
      </Stamp>
      <Tag top={1350} at={150}>'23년 만에 최다'는 보도 기준 · 전년 대비 증감</Tag>
      <Caption lines={NSU_L} />
    </AbsoluteFill>
  );
};

// 3. 32년치 지원자 꺾은선 (S06 · S07, 2027학년도 점은 S02)
const HIST_L: Line[] = [
  { text: "첫 수능은 한 해에 두 번 봤습니다", from: 8, to: 100, em: ["두", "번"] },
  { text: "정점은 2000학년도 89만 6,122명", from: 100, to: 200, em: ["89만"] },
  { text: "가장 적었던 해는 코로나로 12월에 본 2021학년도", from: 200, to: 280, em: ["2021학년도"] },
  { text: "올해는 55만 명대", from: 280, to: 330, em: ["55만"] },
];
export const HistoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = [...HIST.rows.map((r, i) => ({ x: r.year + (r.year === 1994 && i === 0 ? -0.5 : 0), y: r.applied })), { x: 2027, y: TOTAL }];
  const W = 860, Hh = 560, x0 = 1993.3, x1 = 2027.5, y0 = 400000, y1 = 960000;
  const px = (x: number) => ((x - x0) / (x1 - x0)) * W;
  const py = (y: number) => Hh - ((y - y0) / (y1 - y0)) * Hh;
  const draw = interpolate(frame, [10, 270], [0, 1], clamp);
  const shown = Math.max(2, Math.ceil(draw * pts.length));
  const d = pts.slice(0, shown).map((p, i) => `${i ? "L" : "M"}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(" ");
  const pan = interpolate(frame, [0, 330], [0, -20], clamp);
  const mark = (x: number, y: number, at: number, label: React.ReactNode, dx: number, dy: number, color = S.omr) => {
    const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
    return (
      <div style={{ position: "absolute", left: 40 + px(x), top: 60 + py(y), opacity: o }}>
        <div style={{ position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: 26, background: color, border: "4px solid #fff" }} />
        <div style={{ position: "absolute", left: dx, top: dy, whiteSpace: "nowrap", fontFamily, fontWeight: 900, fontSize: 34, color: S.ink, background: "rgba(255,248,234,0.92)", padding: "4px 10px", borderRadius: 8, lineHeight: 1.25 }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Head>32년치 지원자</Head>
      <Sheet grid style={{ top: 360, left: 50, width: 980, height: 800, transform: `translateX(${pan}px) rotate(-0.6deg)` }}>
        <svg width={980} height={800} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(40,60)">
            {[500000, 700000, 900000].map((v) => (
              <g key={v}>
                <line x1={0} x2={W} y1={py(v)} y2={py(v)} stroke="rgba(22,24,31,0.18)" strokeDasharray="6 8" />
                <text x={W - 4} y={py(v) - 8} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={24} fill="rgba(22,24,31,0.55)">{v / 10000}만</text>
              </g>
            ))}
            <path d={d} fill="none" stroke={S.ink} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
            {[1994, 2000, 2010, 2020].map((y) => (
              <text key={y} x={px(y)} y={Hh + 44} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="rgba(22,24,31,0.6)">{y}</text>
            ))}
          </g>
        </svg>
        {mark(1993.5, 742668, 20, <>1994학년도<br />8월 · 11월 두 번</>, 10, 110)}
        {mark(2000, 896122, 90, <>2000학년도 89만 6,122명<br />역대 최다</>, 90, -10)}
        {mark(2021, 493434, 190, <>2021학년도 49만 3,434명<br />코로나로 12월 3일</>, -400, 24, S.down)}
        {mark(2027, TOTAL, 280, <>2027학년도<br />55만 1,864명</>, -190, -100, S.yellow)}
      </Sheet>
      <Tag top={1200} at={30}>학년도별 지원자 수 · 한국교육과정평가원 (2027학년도는 원서 접수 기준)</Tag>
      <Caption lines={HIST_L} />
    </AbsoluteFill>
  );
};

// 4. 원서 내고 안 온 사람 (S08, 자체 계산)
const ABS_L: Line[] = [
  { text: "작년엔 원서를 내고도", from: 6, to: 70 },
  { text: "6만 278명이 시험장에 안 왔습니다", from: 70, to: 180, em: ["6만", "278명이"] },
];
export const AbsentScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Head>빈자리</Head>
      {/* 책상 9개 중 하나가 빈자리 */}
      {Array.from({ length: 9 }, (_, i) => {
        const empty = i === 4;
        const c = i % 3, r = Math.floor(i / 3);
        const o = interpolate(frame, [6 + i * 3, 14 + i * 3], [0, 1], clamp);
        const blink = empty ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 9)) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 130 + c * 290, top: 370 + r * 190, width: 240, height: 140, opacity: o * blink }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: empty ? "transparent" : "#B08458", border: empty ? `5px dashed ${S.chalk}` : "none", boxShadow: empty ? "none" : "0 10px 22px rgba(0,0,0,0.4)" }} />
            {!empty && <div style={{ position: "absolute", left: 60, top: 24, width: 120, height: 86, background: S.paper, borderRadius: 4, transform: "rotate(-4deg)" }} />}
            {!empty && <div style={{ position: "absolute", left: 150, top: 30, width: 12, height: 90, background: S.ink, borderRadius: 6, transform: "rotate(28deg)" }} />}
          </div>
        );
      })}
      <Pop at={60} style={{ top: 960, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 140, color: S.yellow, lineHeight: 1 }}>
          <Counter from={0} to={60278} start={62} dur={30} digits={0} />
          <span style={{ fontSize: 66 }}>명</span>
        </div>
      </Pop>
      <Pop at={100} style={{ top: 1130, left: 0, right: 0, textAlign: "center", ...chalk(50) }}>
        원서 낸 9명 중 1명꼴 (응시율 89.1%)
      </Pop>
      <Tag top={1220} at={100}>2026학년도 지원 554,174 − 응시 493,896 · 평가원 자료로 직접 계산</Tag>
      <Caption lines={ABS_L} />
    </AbsoluteFill>
  );
};

// 5. 사탐런 (S05)
const TAMGU = [
  { label: "사회탐구만", before: 61.0, after: 69.6, color: "#FFB067" },
  { label: "과학탐구만", before: 22.7, after: 14.2, color: "#8FB6FF" },
];
const TAMGU_L: Line[] = [
  { text: "탐구 과목은 사회탐구로 쏠렸습니다", from: 6, to: 110, em: ["사회탐구로"] },
  { text: "사탐만 69.6%, 과탐만 14.2%", from: 110, to: 210, em: ["69.6%,", "14.2%"] },
];
export const TamguScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [60, 110], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Head>사탐런</Head>
      <Pop at={10} style={{ top: 340, left: 70, right: 70, ...chalk(40, S.chalkDim) }}>탐구 영역 지원자 중 고른 비율</Pop>
      {TAMGU.map((g, i) => {
        const v = g.before + (g.after - g.before) * t;
        const o = interpolate(frame, [14 + i * 12, 26 + i * 12], [0, 1], clamp);
        return (
          <div key={g.label} style={{ position: "absolute", top: 450 + i * 330, left: 70, right: 70, opacity: o }}>
            <div style={{ ...chalk(56) }}>{g.label}</div>
            <div style={{ position: "relative", marginTop: 14, height: 110, borderRadius: 14, background: "rgba(0,0,0,0.28)" }}>
              {/* 작년 자리 표시 */}
              <div style={{ position: "absolute", left: `${g.before}%`, top: -12, bottom: -12, borderLeft: `4px dashed ${S.chalkDim}` }} />
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v}%`, borderRadius: 14, background: g.color }} />
              <div style={{ position: "absolute", left: `calc(${v}% + 18px)`, top: 18, fontFamily, fontWeight: 900, fontSize: 64, color: S.chalk }}>{v.toFixed(1)}%</div>
            </div>
            <div style={{ marginTop: 16, fontFamily, fontWeight: 700, fontSize: 32, color: S.chalkDim }}>작년 {g.before.toFixed(1)}% (점선)</div>
          </div>
        );
      })}
      <Stamp at={130} color={S.omr} rotate={6} style={{ top: 1120, left: 330, right: 330, fontSize: 64, background: "rgba(19,37,25,0.85)" }}>
        사탐런
      </Stamp>
      <Tag top={1300} at={130}>보도 기준 (2027학년도 vs 2026학년도 원서 접수)</Tag>
      <Caption lines={TAMGU_L} />
    </AbsoluteFill>
  );
};

// 6. 올해 바뀐 것 — 가채점표 · 스마트안경 (S09 · S10)
const RULES_L: Line[] = [
  { text: "올해 처음, 수험표 뒷면에 가채점표", from: 6, to: 100, em: ["가채점표"] },
  { text: "스마트안경 탓에 매 교시 안경도 확인", from: 100, to: 210, em: ["스마트안경"] },
];
export const RulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [20, 40], [0, 180], clamp);
  const back = flip > 90;
  return (
    <AbsoluteFill>
      <Head>올해 처음</Head>
      {/* 수험표: 앞면 → 뒤집으면 가채점표 */}
      <div style={{ position: "absolute", top: 360, left: 190, width: 700, height: 420, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${flip}deg)`, transformStyle: "preserve-3d" }}>
          <Sheet style={{ inset: 0, transform: back ? "rotateY(180deg)" : undefined }}>
            {!back ? (
              <div style={{ padding: 34, fontFamily, color: S.ink }}>
                <div style={{ fontWeight: 900, fontSize: 48 }}>수험표</div>
                <div style={{ marginTop: 26, display: "flex", gap: 28 }}>
                  <div style={{ width: 170, height: 220, border: `3px dashed ${S.omrSoft}`, borderRadius: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: 32, lineHeight: 2, color: "rgba(22,24,31,0.55)" }}>
                    수험번호 ________
                    <br />
                    시험장 ________
                    <br />
                    선택과목 ________
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 30, fontFamily, color: S.ink }}>
                <div style={{ fontWeight: 900, fontSize: 46, color: S.omr }}>가채점표 (뒷면)</div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} style={{ height: 70, border: `2px solid ${S.omrSoft}`, borderRadius: 4, fontSize: 20, fontWeight: 700, color: "rgba(22,24,31,0.5)", padding: "2px 6px" }}>{i + 1}</div>
                  ))}
                </div>
              </div>
            )}
          </Sheet>
        </div>
      </div>
      <Pop at={46} style={{ top: 810, left: 70, right: 70, textAlign: "center", ...chalk(40, S.chalkDim) }}>시험 중에 적을 수 있고, 종료령 뒤에 적으면 부정행위</Pop>
      {/* 반입 금지 목록 */}
      <Pop at={100} style={{ top: 920, left: 90, right: 90, borderRadius: 22, border: `4px solid ${S.chalk}`, padding: "26px 34px" }}>
        <div style={{ ...chalk(52, S.yellow) }}>반입 금지</div>
        <div style={{ marginTop: 10, ...chalk(44), lineHeight: 1.45 }}>
          휴대전화 · 스마트워치 · 태블릿
          <br />
          이어폰 · <span style={{ background: S.omr, color: "#fff", padding: "0 12px", borderRadius: 10, whiteSpace: "nowrap" }}>스마트안경</span>
        </div>
      </Pop>
      <Stamp at={150} color={S.omr} rotate={-4} style={{ top: 1200, left: 150, right: 150, fontSize: 48, background: "rgba(19,37,25,0.85)" }}>
        매 교시 안경 확인
      </Stamp>
      <Tag top={1350} at={150}>평가원 시행세부계획 · 안경 확인은 보도 기준 (2026.10.13)</Tag>
      <Caption lines={RULES_L} />
    </AbsoluteFill>
  );
};

// 7. 마지막 선택형 수능 (S11 · S12)
const LAST_L: Line[] = [
  { text: "2028학년도부터는 공통과목 체제", from: 6, to: 90, em: ["공통과목"] },
  { text: "올해가 마지막 선택형 수능이 될 전망입니다", from: 90, to: 180, em: ["마지막"] },
];
export const LastScene: React.FC = () => (
  <AbsoluteFill>
    <Head>마지막</Head>
    <Pop at={8} style={{ top: 370, left: 70, right: 70 }}>
      <Sheet style={{ position: "relative", padding: "34px 40px" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 44, color: S.ink }}>2027학년도 (올해)</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: "rgba(22,24,31,0.7)", marginTop: 10, lineHeight: 1.5 }}>
          국어 · 수학 = 공통 + 선택과목
          <br />
          사회·과학탐구 17과목 중 최대 2개
        </div>
      </Sheet>
    </Pop>
    <Pop at={40} style={{ top: 760, left: 0, right: 0, textAlign: "center", ...chalk(80, S.yellow) }}>↓</Pop>
    <Pop at={50} style={{ top: 860, left: 70, right: 70 }}>
      <Sheet style={{ position: "relative", padding: "34px 40px" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 44, color: S.ink }}>2028학년도부터</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: "rgba(22,24,31,0.7)", marginTop: 10, lineHeight: 1.5 }}>
          제2외국어·한문을 뺀 전 영역 공통과목
        </div>
      </Sheet>
    </Pop>
    <Stamp at={84} color={S.omr} rotate={-8} style={{ top: 1110, left: 150, right: 150, fontSize: 56, background: "rgba(19,37,25,0.85)" }}>
      마지막 선택형 수능
    </Stamp>
    <Tag top={1290} at={100}>'마지막'은 전망 (이투데이 보도) · EBS 연계는 문항 수 기준 50% 수준</Tag>
    <Caption lines={LAST_L} />
  </AbsoluteFill>
);

// 8. 아웃트로 — 출처 · 응원 · 브랜드 띠
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Write at={4} dur={16} style={{ top: 280, left: 0, right: 0, textAlign: "center", ...chalk(76) }}>
        55만 1,864명,
      </Write>
      <Write at={22} dur={16} style={{ top: 390, left: 0, right: 0, textAlign: "center", ...chalk(96, S.yellow) }}>
        모두 응원합니다
      </Write>
      <div style={{ position: "absolute", top: 600, left: 70, right: 70, padding: "34px 40px", borderRadius: 26, background: "rgba(0,0,0,0.32)", fontFamily, color: S.chalk }}>
        <div style={{ fontWeight: 900, fontSize: 44, marginBottom: 14 }}>자료 출처는 설명란</div>
        {["한국교육과정평가원 연도별 응시현황", "평가원 2027학년도 원서 접수 결과 (보도 인용)", "시행세부계획 · 2028 개편 · 스마트안경 대책 보도"].map((s) => (
          <div key={s} style={{ fontWeight: 700, fontSize: 30, color: S.chalkDim, lineHeight: 1.6 }}>· {s}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0, height: 150, background: "#141A33", borderTop: "6px solid #FFC93C", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ width: 26, height: 26, borderRadius: 26, background: "#FF5C7A" }} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: 58, color: "#F4F5FA" }}>숫자로 보는 요즘</div>
      </div>
    </AbsoluteFill>
  );
};
