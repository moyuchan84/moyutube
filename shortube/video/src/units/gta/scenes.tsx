import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { G, neon, slant, Tag } from "./fx";

// 숫자는 output/briefs/2026-10-16_slot2.md 사실 카드에서만 가져온다 (카드 id 를 주석에 적음).
const soft = { damping: 14, stiffness: 140 };

const Pop: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: soft });
  return <div style={{ position: "absolute", left: 60, right: 60, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`, ...style }}>{children}</div>;
};

const Head: React.FC<{ children: React.ReactNode; color?: string; top?: number }> = ({ children, color = G.pink, top = 220 }) => (
  <Pop at={0} style={{ top }}>
    <div style={{ ...slant, fontSize: 64, ...neon(color, 0.7) }}>{children}</div>
  </Pop>
);

// 0. 훅 — 4,811일 (G04)
const HOOK_L: Line[] = [
  { text: "GTA 5 → GTA 6, 4,811일", from: 8, to: 62, em: ["4,811일"] },
  { text: "숫자로 보면 이렇습니다", from: 62, to: 120 },
];
export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <Pop at={2} style={{ top: 300 }}>
      <div style={{ ...slant, fontSize: 92, ...neon(G.cyan) }}>GTA 5 → GTA 6</div>
    </Pop>
    <Pop at={6} style={{ top: 470 }}>
      <div style={{ ...slant, fontSize: 250, lineHeight: 1, ...neon(G.pink, 1.2) }}>
        <Counter from={0} to={4811} start={6} dur={32} digits={0} />
        <span style={{ fontSize: 110 }}>일</span>
      </div>
    </Pop>
    <Stamp at={40} color={G.yellow} rotate={-6} style={{ top: 830, left: 270, fontSize: 76 }}>
      13년 2개월
    </Stamp>
    <Tag top={1010} at={44}>2013.9.17 → 2026.11.19 (출시 예정일)</Tag>
    <Caption lines={HOOK_L} />
  </AbsoluteFill>
);

// 1. 연대기 — 고속도로 이정표를 따라 달리고, 이어서 공백 막대 (G01 G04 G05)
const GAMES = [
  { y: 1997, name: "GTA" },
  { y: 1999, name: "GTA 2" },
  { y: 2001, name: "GTA III" },
  { y: 2002, name: "바이스 시티" },
  { y: 2004, name: "산 안드레아스" },
  { y: 2008, name: "GTA IV" },
  { y: 2013, name: "GTA V" },
  { y: 2026, name: "GTA VI", next: true },
];
const GAPS = [1.9, 2.0, 1.0, 2.0, 3.5, 5.4, 13.2];
const PX_PER_YEAR = 150;
const ROAD_L: Line[] = [
  { text: "1997년부터 29년, 본편 8편", from: 6, to: 110, em: ["29년"] },
  { text: "보통 1~5년마다 나왔는데", from: 110, to: 205 },
  { text: "이번 공백은 13.2년", from: 205, to: 330, em: ["13.2년"] },
];
export const RoadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 카메라: 1997 → 2026 으로 팬 (0~190f), 이후 막대 차트로 전환
  const year = interpolate(frame, [10, 185], [1997, 2026], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const pan = 540 - (year - 1997) * PX_PER_YEAR;
  const roadOut = interpolate(frame, [190, 205], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Head>본편이 나온 해</Head>
      {/* 도로 + 이정표 */}
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, height: 420, opacity: roadOut }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, height: 110, background: "#1A0A2A", borderTop: `4px solid ${G.cyan}`, borderBottom: `4px solid ${G.cyan}` }} />
        <div style={{ position: "absolute", left: pan % 120 - 120, right: -240, top: 282, height: 8, backgroundImage: `repeating-linear-gradient(90deg, ${G.yellow} 0 60px, transparent 60px 120px)` }} />
        {GAMES.map((g) => {
          const x = pan + (g.y - 1997) * PX_PER_YEAR;
          const near = 1 - Math.min(1, Math.abs(x - 540) / 500);
          return (
            <div key={g.y} style={{ position: "absolute", left: x - 140, width: 280, top: 0, textAlign: "center", opacity: 0.35 + 0.65 * near }}>
              <div style={{ ...slant, fontSize: 68, ...neon(g.next ? G.pink : G.cyan, 0.4 + near * 0.6) }}>{g.y}</div>
              <div style={{ fontFamily, fontWeight: 900, fontSize: 38, color: g.next ? G.pink : G.cream, marginTop: 6 }}>{g.name}</div>
              <div style={{ width: 8, height: 120, background: G.cream, margin: "10px auto 0", opacity: 0.8 }} />
            </div>
          );
        })}
      </div>
      {/* 공백 막대 (년) */}
      {frame >= 195 && (
        <div style={{ position: "absolute", top: 420, left: 70, right: 70, height: 900 }}>
          {GAPS.map((gap, i) => {
            const p = spring({ frame: frame - 198 - i * 5, fps, config: soft });
            const last = i === GAPS.length - 1;
            const h = gap * 58 * p;
            const w = 940 / GAPS.length;
            return (
              <div key={i} style={{ position: "absolute", bottom: 80, left: i * w + 12, width: w - 24, textAlign: "center" }}>
                <div style={{ ...slant, fontSize: last ? 64 : 40, ...neon(last ? G.pink : G.cyan, last ? 1 : 0.4), opacity: p, marginBottom: 8 }}>{gap.toFixed(1)}</div>
                <div style={{ height: h, background: last ? `linear-gradient(180deg, ${G.pink}, ${G.sunTop})` : G.cyan, opacity: last ? 1 : 0.6, borderRadius: 10, boxShadow: last ? `0 0 40px ${G.pink}` : undefined }} />
                <div style={{ position: "absolute", bottom: -56, left: -20, right: -20, fontFamily, fontWeight: 700, fontSize: 24, color: G.dim, whiteSpace: "nowrap" }}>
                  {["1→2", "2→III", "III→VC", "VC→SA", "SA→IV", "IV→V", "V→VI"][i]}
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: 0, left: 0, fontFamily, fontWeight: 700, fontSize: 30, color: G.dim, opacity: interpolate(frame, [205, 215], [0, 1], clamp) }}>
            다음 편까지 걸린 해 (년)
          </div>
        </div>
      )}
      <Caption lines={ROAD_L} />
    </AbsoluteFill>
  );
};

// 2. 연기 — 날짜 표지판이 줄 그어지며 바뀐다 (D01~D04)
const SIGNS = [
  { at: 10, date: "2025년", note: "첫 트레일러 (2023.12)" },
  { at: 45, date: "2025년 가을", note: "시기를 좁힘 (2024.5)" },
  { at: 85, date: "2026. 5. 26", note: "첫 연기 (2025.5)" },
  { at: 125, date: "2026. 11. 19", note: "두 번째 연기 (2025.11)" },
];
const DELAY_L: Line[] = [
  { text: "출시 예정일은 이렇게 바뀌었습니다", from: 6, to: 120 },
  { text: "공식 연기는 두 번", from: 120, to: 210, em: ["두 번"] },
];
export const DelayScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Head color={G.yellow}>출시 예정일</Head>
      {SIGNS.map((s, i) => {
        const last = i === SIGNS.length - 1;
        const next = SIGNS[i + 1];
        const strike = next ? interpolate(frame, [next.at - 6, next.at + 4], [0, 1], clamp) : 0;
        return (
          <Pop key={s.date} at={s.at} style={{ top: 360 + i * 230 }}>
            <div
              style={{
                display: "inline-block",
                position: "relative",
                minWidth: 640,
                padding: "18px 40px",
                borderRadius: 22,
                background: last ? G.pink : "#0E5A4A",
                border: `6px solid ${G.cream}`,
                boxShadow: last ? `0 0 50px ${G.pink}` : "0 10px 30px rgba(0,0,0,0.4)",
                opacity: 1 - strike * 0.45,
              }}
            >
              <div style={{ ...slant, fontSize: 76, color: G.cream }}>{s.date}</div>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 32, color: G.cream, opacity: 0.85 }}>{s.note}</div>
              <div style={{ position: "absolute", left: 20, top: "50%", height: 10, width: `${strike * 94}%`, background: G.yellow, transform: "rotate(-4deg)", borderRadius: 6 }} />
            </div>
          </Pop>
        );
      })}
      <Caption lines={DELAY_L} />
    </AbsoluteFill>
  );
};

// 3. 판매 — 시리즈 전체 막대의 48% 를 GTA V 혼자 채운다 (S01~S03)
const SALES_L: Line[] = [
  { text: "GTA 5 혼자 2억 3천만 장", from: 6, to: 120, em: ["2억"] },
  { text: "시리즈 전체 4억 7,500만 장의 48%", from: 120, to: 240, em: ["48%"] },
];
export const SalesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [110, 160], [0, 0.484], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const allIn = interpolate(frame, [90, 108], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Head color={G.cyan}>누적 판매 (출하량)</Head>
      <Pop at={6} style={{ top: 380 }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 48, color: G.cream }}>GTA V</div>
        <div style={{ ...slant, fontSize: 190, lineHeight: 1.05, ...neon(G.pink) }}>
          <Counter from={0} to={2.3} start={8} dur={36} digits={1} />
          <span style={{ fontSize: 100 }}>억 장+</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", top: 800, left: 70, right: 70, opacity: allIn }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: G.cream, marginBottom: 14 }}>GTA 시리즈 전체 약 4억 7,500만 장</div>
        <div style={{ position: "relative", height: 110, borderRadius: 18, border: `5px solid ${G.cyan}`, overflow: "hidden", background: "rgba(46,242,255,0.08)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${G.pink}, ${G.sunTop})`, boxShadow: `0 0 40px ${G.pink}` }} />
          <div style={{ position: "absolute", left: 30, top: 18, ...slant, fontSize: 60, color: "#14072E", opacity: interpolate(frame, [150, 162], [0, 1], clamp) }}>GTA V 48%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily, fontWeight: 700, fontSize: 28, color: G.dim, marginTop: 10 }}>
          <span>0</span>
          <span>4.75억</span>
        </div>
      </div>
      <Tag top={1120} at={20}>2026년 6월 말 기준 · 테이크투 실적 발표 · 출하량(sell-in)</Tag>
      <Caption lines={SALES_L} />
    </AbsoluteFill>
  );
};

// 4. 기록 — 매출 기록 카드 → 조회수 저울 (R01~R05)
const REC_L: Line[] = [
  { text: "GTA 5, 첫날 8억 달러 이상", from: 6, to: 70, em: ["8억"] },
  { text: "3일 만에 10억 달러, 가장 빨랐던 기록", from: 70, to: 140, em: ["3일"] },
  { text: "GTA 6 트레일러 1, 유튜브 24시간 9,042만 회", from: 140, to: 205, em: ["9,042만"] },
  { text: "트레일러 2는 4억 7,500만? 세는 기준이 다릅니다", from: 205, to: 300, em: ["기준이"] },
];
const Card: React.FC<{ at: number; top: number; big: string; sub: string; color: string }> = ({ at, top, big, sub, color }) => (
  <Pop at={at} style={{ top }}>
    <div style={{ display: "inline-block", padding: "24px 44px", borderRadius: 28, background: G.card, border: `4px solid ${color}`, boxShadow: `0 0 40px ${color}66` }}>
      <div style={{ ...slant, fontSize: 104, ...neon(color, 0.8) }}>{big}</div>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 34, color: G.cream, marginTop: 6 }}>{sub}</div>
    </div>
  </Pop>
);
export const RecordsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase2 = frame >= 140;
  const out1 = interpolate(frame, [130, 140], [1, 0], clamp);
  const b1 = spring({ frame: frame - 150, fps, config: soft });
  const b2 = spring({ frame: frame - 210, fps, config: soft });
  const tilt = interpolate(frame, [210, 235], [0, -7], clamp);
  return (
    <AbsoluteFill>
      <Head color={G.yellow}>기록</Head>
      {!phase2 && (
        <AbsoluteFill style={{ opacity: out1 }}>
          <Card at={6} top={380} big="$8억+" sub="GTA V 출시 첫날 (2013, 테이크투 추정)" color={G.yellow} />
          <Card at={70} top={720} big="3일 → $10억" sub="가장 빨리 10억 달러 · 기네스 세계 기록" color={G.pink} />
        </AbsoluteFill>
      )}
      {phase2 && (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 760, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}>
            {/* 막대 두 개: 높이 비율은 실제 값 비율 (90.4M : 475M) */}
            {[
              { v: "9,042만", sub: "트레일러 1 (2023.12)\n유튜브 · 24시간\n기네스", h: 0.19 * b1, c: G.cyan, x: 90 },
              { v: "4억 7,500만", sub: "트레일러 2 (2025.5)\n전 플랫폼 · 24시간\n록스타 발표", h: 1 * b2, c: G.pink, x: 520 },
            ].map((b) => (
              <div key={b.v} style={{ position: "absolute", left: b.x, width: 340, bottom: 140, textAlign: "center" }}>
                <div style={{ ...slant, fontSize: 56, ...neon(b.c, 0.6), opacity: b.h > 0.01 ? 1 : 0 }}>{b.v}</div>
                <div style={{ height: 520 * b.h, background: b.c, borderRadius: 12, opacity: 0.85, marginTop: 10 }} />
                <div style={{ position: "absolute", bottom: -150, left: -30, right: -30, fontFamily, fontWeight: 700, fontSize: 28, lineHeight: 1.35, color: G.cream, whiteSpace: "pre-line" }}>{b.sub}</div>
              </div>
            ))}
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 130, height: 8, background: G.cream, borderRadius: 4 }} />
          </div>
          <Stamp at={240} color={G.yellow} rotate={-8} style={{ top: 560, left: 190, fontSize: 70 }}>
            같은 저울 아님
          </Stamp>
        </AbsoluteFill>
      )}
      <Caption lines={REC_L} />
    </AbsoluteFill>
  );
};

// 5. 용량 · 플레이타임 · 동시 접속 (B01 B02 P01 U01)
const DATA_L: Line[] = [
  { text: "GTA 5 용량은 8GB에서 125GB까지", from: 6, to: 95, em: ["125GB"] },
  { text: "이야기만 32시간, 100%는 89시간", from: 95, to: 175, em: ["89시간"] },
  { text: "스팀 동시 접속 최고 약 36만 명", from: 175, to: 240, em: ["36만"] },
];
const SIZES = [
  { gb: 8, label: "360·PS3\n의무 설치" },
  { gb: 65, label: "PC\n2015" },
  { gb: 105, label: "PC 지금\nEnhanced" },
  { gb: 125, label: "PC 지금\nLegacy" },
];
const HOURS = [
  { h: 32, label: "이야기만" },
  { h: 51, label: "곁가지 포함" },
  { h: 89, label: "100%" },
];
export const DataScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seg = frame < 95 ? 0 : frame < 175 ? 1 : 2;
  return (
    <AbsoluteFill>
      <Head color={G.cyan}>{["저장 공간", "플레이타임", "이용자"][seg]}</Head>
      {seg === 0 && (
        <>
          <div style={{ position: "absolute", top: 380, left: 90, right: 90, height: 760 }}>
            {SIZES.map((s, i) => {
              const p = spring({ frame: frame - 6 - i * 10, fps, config: soft });
              return (
                <div key={s.label} style={{ position: "absolute", left: i * 230, width: 190, bottom: 120, textAlign: "center" }}>
                  <div style={{ ...slant, fontSize: 54, ...neon(i === 3 ? G.pink : G.cyan, 0.5), opacity: p }}>{s.gb}GB</div>
                  <div style={{ height: (s.gb / 125) * 520 * p, marginTop: 8, borderRadius: 12, border: `4px solid ${G.cyan}`, backgroundImage: `repeating-linear-gradient(0deg, ${G.cyan}AA 0 18px, transparent 18px 26px)` }} />
                  <div style={{ position: "absolute", bottom: -100, left: -20, right: -20, fontFamily, fontWeight: 700, fontSize: 28, color: G.cream, whiteSpace: "pre-line" }}>{s.label}</div>
                </div>
              );
            })}
          </div>
          <Tag top={1180} at={20}>Rockstar 고객지원 · 요구 사항 기준</Tag>
        </>
      )}
      {seg === 1 && (
        <>
          {HOURS.map((h, i) => {
            const p = interpolate(frame - 95 - i * 8, [0, 30], [0, h.h / 89], clamp);
            const r = 120;
            const cx = 180 + i * 360;
            return (
              <div key={h.label} style={{ position: "absolute", top: 470, left: cx - 170, width: 340, textAlign: "center" }}>
                <svg width={300} height={300} style={{ display: "block", margin: "0 auto" }}>
                  <circle cx={150} cy={150} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={26} fill="none" />
                  <circle cx={150} cy={150} r={r} stroke={i === 2 ? G.pink : G.yellow} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * r * p} 9999`} transform="rotate(-90 150 150)" />
                  <text x={150} y={170} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={70} fill={G.cream}>{Math.round(p * 89)}</text>
                </svg>
                <div style={{ fontFamily, fontWeight: 900, fontSize: 40, color: G.cream }}>{h.label}</div>
                <div style={{ fontFamily, fontWeight: 700, fontSize: 30, color: G.dim }}>시간</div>
              </div>
            );
          })}
          <Tag top={1000} at={100}>GTA V · HowLongToBeat 이용자 집계 (2026.10.16 확인)</Tag>
        </>
      )}
      {seg === 2 && (
        <>
          <Pop at={178} style={{ top: 420 }}>
            <div style={{ ...slant, fontSize: 230, lineHeight: 1, ...neon(G.pink) }}>
              <Counter from={0} to={36} start={180} dur={26} digits={0} />
              <span style={{ fontSize: 110 }}>만 명</span>
            </div>
          </Pop>
          <Pop at={186} style={{ top: 720 }}>
            <div style={{ fontFamily, fontWeight: 900, fontSize: 46, color: G.cream }}>GTA V 스팀 동시 접속 최고 (약)</div>
          </Pop>
          <Tag top={830} at={190}>SteamCharts · 2015년 4월 기록 · 콘솔 · GTA 온라인 공식 수치 없음</Tag>
        </>
      )}
      <Caption lines={DATA_L} />
    </AbsoluteFill>
  );
};

// 6. 지금 — 런치 트레일러 조회 속도 (L01~L03, 직접 측정)
const LIVE_L: Line[] = [
  { text: "어젯밤 10시 공개된 런치 트레일러", from: 6, to: 80 },
  { text: "12시간 만에 1,874만 회", from: 80, to: 130, em: ["1,874만"] },
  { text: "시간당 약 155만 회꼴", from: 130, to: 180, em: ["155만"] },
];
export const LiveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const needle = interpolate(frame, [10, 70], [-120, 75], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }) + Math.sin(frame * 1.7) * 1.5;
  return (
    <AbsoluteFill>
      <Head color={G.pink}>런치 트레일러 · 유튜브</Head>
      {/* 속도계 */}
      <svg width={760} height={430} style={{ position: "absolute", top: 330, left: 160 }}>
        {Array.from({ length: 13 }, (_, i) => {
          const a = ((-120 + i * 20) * Math.PI) / 180;
          return <line key={i} x1={380 + Math.sin(a) * 300} y1={400 - Math.cos(a) * 300} x2={380 + Math.sin(a) * 340} y2={400 - Math.cos(a) * 340} stroke={i > 9 ? G.pink : G.cyan} strokeWidth={10} strokeLinecap="round" />;
        })}
        <line x1={380} y1={400} x2={380 + Math.sin((needle * Math.PI) / 180) * 290} y2={400 - Math.cos((needle * Math.PI) / 180) * 290} stroke={G.yellow} strokeWidth={14} strokeLinecap="round" />
        <circle cx={380} cy={400} r={26} fill={G.yellow} />
      </svg>
      <div style={{ position: "absolute", top: 790, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ ...slant, fontSize: 150, lineHeight: 1, ...neon(G.cyan, 0.9) }}>
          <Counter from={0} to={18737997} start={10} dur={70} digits={0} />
        </div>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 44, color: G.cream, marginTop: 10 }}>회 · 공개 12시간</div>
      </div>
      <Pop at={90} style={{ top: 1040 }}>
        <div style={{ display: "inline-block", padding: "10px 34px", borderRadius: 999, background: G.pink, ...slant, fontSize: 56, color: G.cream }}>시간당 약 155만 회</div>
      </Pop>
      <Tag top={1150} at={100}>
        <span style={{ whiteSpace: "pre-line" }}>{"YouTube Data API 직접 측정 · 2026.10.16 오전 10:04\n같은 시각 트레일러 1 누적 약 2억 9,799만 회"}</span>
      </Tag>
      <Caption lines={LIVE_L} />
    </AbsoluteFill>
  );
};

// 7. 기대 포인트 — D-34, 공식 발표만 (E01~E04)
const EXP_L: Line[] = [
  { text: "출시까지 34일", from: 6, to: 80, em: ["34일"] },
  { text: "무대는 레오니다와 바이스 시티, 주인공은 두 명", from: 80, to: 165, em: ["두"] },
  { text: "PS5 · Xbox로 출시, PC판은 아직 발표 없음", from: 165, to: 240 },
];
const CHECKS = [
  { at: 80, k: "무대", v: "레오니다 주 · 바이스 시티" },
  { at: 110, k: "주인공", v: "2명 (제이슨 · 루시아)" },
  { at: 165, k: "기종", v: "PS5 · Xbox Series X|S" },
  { at: 190, k: "PC", v: "미발표" },
];
export const ExpectScene: React.FC = () => (
  <AbsoluteFill>
    <Pop at={2} style={{ top: 230 }}>
      <div style={{ ...slant, fontSize: 250, lineHeight: 1, ...neon(G.yellow, 1.2) }}>D-34</div>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 44, color: G.cream, marginTop: 6 }}>2026. 11. 19 출시 예정</div>
    </Pop>
    {CHECKS.map((c, i) => (
      <Pop key={c.k} at={c.at} style={{ top: 640 + i * 140 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 24, minWidth: 820, padding: "18px 30px", borderRadius: 22, background: G.card, border: `3px solid ${G.cyan}`, fontFamily }}>
          <span style={{ fontWeight: 900, fontSize: 36, color: "#14072E", background: G.cyan, borderRadius: 12, padding: "4px 16px" }}>{c.k}</span>
          <span style={{ fontWeight: 900, fontSize: 46, color: G.cream }}>{c.v}</span>
        </div>
      </Pop>
    ))}
    <Caption lines={EXP_L} />
  </AbsoluteFill>
);

// 8. 마무리 — 출처 · 기준일 · 브랜드 띠
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, padding: "40px 44px", borderRadius: 30, background: "rgba(10,12,22,0.82)", fontFamily, color: G.cream }}>
        <div style={{ fontWeight: 900, fontSize: 52, marginBottom: 22 }}>자료 출처는 설명란</div>
        {[
          "테이크투 실적 발표 (2026.8) · 록스타 공식 발표",
          "기네스 세계 기록 · Rockstar 고객지원",
          "SteamCharts · HowLongToBeat (이용자 집계)",
          "YouTube Data API 직접 측정 (2026.10.16)",
        ].map((s) => (
          <div key={s} style={{ fontWeight: 700, fontSize: 32, color: G.dim, lineHeight: 1.6 }}>· {s}</div>
        ))}
        <div style={{ fontWeight: 700, fontSize: 28, color: G.dim, marginTop: 20 }}>게임 화면 · 로고 없이 숫자로만 만들었습니다. Rockstar · Take-Two 와 관계없는 채널입니다.</div>
      </div>
      {/* 브랜드 띠: 남색 + 노랑 선 + 분홍 점 */}
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0, height: 150, background: "#141A33", borderTop: "6px solid #FFC93C", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ width: 26, height: 26, borderRadius: 26, background: "#FF5C7A" }} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: 58, color: "#F4F5FA" }}>숫자로 보는 요즘</div>
      </div>
    </AbsoluteFill>
  );
};
