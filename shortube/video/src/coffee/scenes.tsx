import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { clamp } from "../market/effects";
import { fontFamily, springs } from "../theme";
import D from "./data.json";
import { Cube, Cup, K, Kinetic, Steam } from "./fx";

const by = (k: string) => D.rows.find((r) => r.k === k)!;
const AME = by("아메리카노");
const MOCHA = by("카페모카");
const C = D.caffeine;

// 잔 속 층 색 (아래부터)
const LAYERS: Record<string, [string, number][]> = {
  아메리카노: [["#3A2012", 1]],
  카푸치노: [["#7A4B2E", 0.5], ["#F7EEDF", 0.5]],
  카페라떼: [["#A8754E", 0.82], ["#F7EEDF", 0.18]],
  카라멜마키아토: [["#C49A6C", 0.75], [K.caramel, 0.25]],
  카페모카: [["#4A2716", 0.75], [K.milk, 0.25]],
};

const useIn = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: springs.snappy });
};

const Head: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => {
  const s = useIn(8);
  return (
    <div style={{ position: "absolute", top: 200, left: 40, right: 40, textAlign: "center" }}>
      <Kinetic text={text} size={60} at={2} />
      {sub && <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: K.dim, marginTop: 4, opacity: s }}>{sub}</div>}
    </div>
  );
};

const Num: React.FC<{ v: number; at: number; dur?: number; digits?: number; suffix?: string; style?: React.CSSProperties }> = ({ v, at, dur = 30, digits = 0, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{(v * e).toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}{suffix}</span>;
};

// 1. 훅: 같은 355ml, 아메리카노 vs 카페모카
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lv = interpolate(frame, [10, 70], [0, 0.82], clamp);
  const x = useIn(95);
  const ratio = Math.round(MOCHA.kcal / AME.kcal);
  const pair = [
    { r: AME, left: 120 },
    { r: MOCHA, left: 600 },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
        <Kinetic text="같은 한 잔인데" size={58} at={4} />
      </div>
      {pair.map(({ r, left }) => (
        <div key={r.k} style={{ position: "absolute", top: 380, left, width: 360, textAlign: "center", fontFamily }}>
          <div style={{ position: "relative", height: 70 }}>
            <div style={{ position: "absolute", left: 90, top: -10 }}>
              <Steam w={180} h={90} o={lv} />
            </div>
          </div>
          <Cup w={300} h={400} level={lv} layers={LAYERS[r.k]} />
          <div style={{ fontSize: 42, fontWeight: 900, color: K.espresso, marginTop: 10 }}>{r.k}</div>
          <div style={{ fontSize: 76, fontWeight: 900, color: r === MOCHA ? K.red : K.mint }}>
            <Num v={r.kcal} at={40} suffix="kcal" />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, textAlign: "center", opacity: x, transform: `scale(${0.6 + x * 0.4}) rotate(${(1 - x) * -6}deg)` }}>
        <span style={{ fontFamily, fontSize: 92, fontWeight: 900, color: K.milk, background: K.espresso, borderRadius: 24, padding: "6px 34px" }}>약 {ratio}배</span>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: `같은 355ml, 아메리카노는 ${AME.kcal}kcal`, from: 5, to: 95, em: [`${AME.kcal}kcal`] },
          { text: `카페모카는 ${MOCHA.kcal}kcal, 약 ${ratio}배입니다`, from: 95, to: 165, em: [`${MOCHA.kcal}kcal,`, `${ratio}배입니다`] },
        ]}
      />
    </>
  );
};

// 2. 열량: 다섯 잔이 열량만큼 차오른다
export const KcalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const max = Math.max(...D.rows.map((r) => r.kcal));
  return (
    <>
      <Head text="커피별 열량" sub="355ml 한 잔 · 식약처 음식 DB 중앙값" />
      {D.rows.map((r, i) => {
        const at = 25 + i * 22;
        const lv = interpolate(frame, [at, at + 40], [0, 0.12 + 0.8 * (r.kcal / max)], clamp);
        const s = spring({ frame: frame - at, fps: 30, config: springs.snappy });
        const left = 60 + i * 172;
        return (
          <div key={r.k} style={{ position: "absolute", top: 470, left, width: 160, textAlign: "center", fontFamily, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: K.espresso, height: 56 }}>
              <Num v={r.kcal} at={at + 10} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: K.dim, marginBottom: 8 }}>kcal</div>
            <Cup w={150} h={330} level={lv} layers={LAYERS[r.k]} />
            <div style={{ fontSize: r.k.length > 5 ? 23 : 28, fontWeight: 900, color: K.espresso, marginTop: 10, whiteSpace: "nowrap" }}>{r.k}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: K.dim }}>표본 {r.n}건</div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "우유가 들어가는 순간 열량이 확 뛰고", from: 20, to: 160, em: ["우유가"] },
          { text: "카푸치노 192 · 라떼 249 · 카라멜마키아토 245 · 모카 256", from: 160, to: 330, em: ["256"] },
        ]}
      />
    </>
  );
};

// 3. 당류: 각설탕이 떨어져 쌓인다
export const SugarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 400, rowH = 150, x0 = 330, cw = 48;
  return (
    <>
      <Head text="각설탕으로 바꾸면" sub={`당류(g) ÷ 각설탕 1개 ${D.cube}g · 355ml 환산`} />
      {D.rows.map((r, i) => {
        const y = top + i * rowH;
        const full = Math.floor(r.cubes);
        const part = r.cubes - full;
        const n = Math.ceil(r.cubes);
        const startAt = 40 + i * 30;
        return (
          <div key={r.k} style={{ position: "absolute", top: y, left: 0, right: 0, fontFamily }}>
            <div style={{ position: "absolute", left: 70, top: 6, width: 250, opacity: interpolate(frame, [startAt - 20, startAt - 10], [0, 1], clamp) }}>
              <div style={{ fontSize: r.k.length > 5 ? 28 : 34, fontWeight: 900, color: K.espresso, whiteSpace: "nowrap" }}>{r.k}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: r.sugar > 0 ? K.caramel : K.mint }}>
                {r.sugar}g <span style={{ fontSize: 24, color: K.dim }}>· {r.cubes}개</span>
              </div>
            </div>
            {n === 0 && <div style={{ position: "absolute", left: x0, top: 22, fontSize: 40, fontWeight: 900, color: K.mint, opacity: interpolate(frame, [startAt, startAt + 10], [0, 1], clamp) }}>0개</div>}
            {Array.from({ length: n }).map((_, j) => {
              const at = startAt + j * 3;
              const t = frame - at;
              const drop = interpolate(t, [0, 9], [-260, 0], { ...clamp, easing: (q) => q * q });
              const bounce = t > 9 && t < 18 ? -Math.sin(((t - 9) / 9) * Math.PI) * 12 : 0;
              const isPart = j === n - 1 && part > 0.01;
              return (
                <div key={j} style={{ position: "absolute", left: x0 + j * cw, top: 30 + drop + bounce, opacity: t < 0 ? 0 : 1, clipPath: isPart ? `inset(0 ${(1 - part) * 100}% 0 0)` : undefined }}>
                  <Cube size={52} />
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1170, left: 70, right: 130, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: K.brown, opacity: interpolate(frame, [220, 235], [0, 1], clamp) }}>
        ※ 당류에는 시럽 · 소스뿐 아니라 우유 속 유당도 포함
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "아메리카노는 0개", from: 30, to: 110, em: ["0개"] },
          { text: "라떼 약 7.6개, 카라멜마키아토 약 9.5개", from: 110, to: 210, em: ["7.6개,", "9.5개"] },
          { text: "카페모카는 각설탕 약 11.5개 분량", from: 210, to: 330, em: ["11.5개"] },
        ]}
      />
    </>
  );
};

// 4. 카페인: 반원 게이지 + 하루 최대 권고량 400mg
export const CaffeineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const MAX = 450;
  const cx = 540, cy = 820, R = 330;
  const ang = (mg: number) => Math.PI * (1 - mg / MAX);
  const pt = (mg: number, r: number) => [cx + Math.cos(ang(mg)) * r, cy - Math.sin(ang(mg)) * r];
  const arc = (a: number, b: number, r: number) => {
    const [x1, y1] = pt(a, r), [x2, y2] = pt(b, r);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const needle = interpolate(frame, [20, 60, 130, 170, 230, 260], [0, C.americano, C.americano, C.coldbrew, C.coldbrew, C.coldbrewRange[1]], clamp);
  const [nx, ny] = pt(needle, R - 60);
  const over = needle > C.limit;
  const label = frame < 130 ? "아메리카노 한 잔 평균" : frame < 230 ? "콜드브루 한 잔 평균" : "콜드브루 가장 높았던 제품";
  return (
    <>
      <Head text="카페인은 콜드브루가 더" sub="한국소비자원 조사(2018) · 커피전문점 · 편의점 36개 제품" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={arc(0, MAX, R)} stroke={K.cream2} strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d={arc(0, Math.max(needle, 1), R)} stroke={over ? K.red : K.brown} strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d={arc(C.limit, MAX, R + 40)} stroke={K.red} strokeWidth={8} fill="none" />
        <line x1={pt(C.limit, R - 30)[0]} y1={pt(C.limit, R - 30)[1]} x2={pt(C.limit, R + 48)[0]} y2={pt(C.limit, R + 48)[1]} stroke={K.red} strokeWidth={6} />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={K.espresso} strokeWidth={12} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={22} fill={K.espresso} />
      </svg>
      <div style={{ position: "absolute", top: 345, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 900, color: K.red }}>
        빨간 선 = 성인 하루 최대 권고량 {C.limit}mg (식약처)
      </div>
      <div style={{ position: "absolute", top: 870, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: K.dim }}>{label}</div>
        <div style={{ fontSize: 110, fontWeight: 900, color: over ? K.red : K.espresso, fontVariantNumeric: "tabular-nums" }}>{Math.round(needle)}mg</div>
      </div>
      <div style={{ position: "absolute", top: 1100, left: 90, right: 130, display: "flex", justifyContent: "space-around", fontFamily, opacity: interpolate(frame, [280, 295], [0, 1], clamp) }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, color: K.dim, fontWeight: 700 }}>1ml당 아메리카노</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: K.espresso }}>{C.perMl[0]}mg</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, color: K.dim, fontWeight: 700 }}>1ml당 콜드브루</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: K.red }}>{C.perMl[1]}mg</div>
        </div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: `아메리카노 한 잔 평균 카페인 ${C.americano}mg`, from: 15, to: 130, em: [`${C.americano}mg`] },
          { text: `콜드브루는 평균 ${C.coldbrew}mg`, from: 130, to: 230, em: [`${C.coldbrew}mg`] },
          { text: `가장 높은 제품은 ${C.coldbrewRange[1]}mg, 한 잔에 하루 권고량을 넘었습니다`, from: 230, to: 330, em: [`${C.coldbrewRange[1]}mg,`] },
        ]}
      />
    </>
  );
};

// 5. 콜드브루 추출 시간: 24시간 타임라인 + 떨어지는 방울
export const BrewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const x0 = 90, x1 = 930, y = 900;
  const X = (h: number) => x0 + ((x1 - x0) * h) / 24;
  const clock = interpolate(frame, [20, 200], [0, 24], clamp);
  const plateau = D.steep.plateauMin / 60;
  const band = interpolate(frame, [60, 90], [0, 1], clamp);
  const mark = interpolate(frame, [150, 165], [0, 1], clamp);
  const drops = Array.from({ length: 6 }).map((_, i) => {
    const t = ((frame + i * 9) % 54) / 54;
    return { y: 440 + t * 180, o: Math.sin(t * Math.PI) };
  });
  return (
    <>
      <Head text="콜드브루는 몇 시간?" sub="찬물(상온 이하)에 천천히 우린다" />
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 200, height: 300 }}>
          <div style={{ position: "absolute", left: 40, top: 0, width: 120, height: 50, background: K.brown, borderRadius: "12px 12px 60px 60px" }} />
          {drops.map((d, i) => (
            <div key={i} style={{ position: "absolute", left: 92, top: d.y - 380, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#3A2012", opacity: d.o }} />
          ))}
          <div style={{ position: "absolute", left: 25, top: 125 }}>
            <Cup w={150} h={170} level={interpolate(frame, [20, 200], [0.05, 0.85], clamp)} layers={[["#3A2012", 1]]} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 660, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 84, fontWeight: 900, color: K.espresso, fontVariantNumeric: "tabular-nums" }}>
        {String(Math.floor(clock)).padStart(2, "0")}:{String(Math.floor((clock % 1) * 60)).padStart(2, "0")}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={x0} y={y} width={x1 - x0} height={18} rx={9} fill={K.cream2} />
        <rect x={x0} y={y} width={(X(clock) - x0)} height={18} rx={9} fill={K.brown} />
        <rect x={X(D.steep.from)} y={y - 30} width={(X(D.steep.to) - X(D.steep.from)) * band} height={78} rx={14} fill="rgba(200,132,60,0.28)" stroke={K.caramel} strokeWidth={3} />
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={X(h)} y={y + 80} textAnchor="middle" fontFamily={fontFamily} fontSize={28} fontWeight={700} fill={K.dim}>
            {h}h
          </text>
        ))}
        <line x1={X(plateau)} y1={y - 70} x2={X(plateau)} y2={y + 48} stroke={K.mint} strokeWidth={6} opacity={mark} />
      </svg>
      <div style={{ position: "absolute", top: y - 90, left: X(D.steep.from), width: X(D.steep.to) - X(D.steep.from), textAlign: "center", fontFamily, fontSize: 30, fontWeight: 900, color: K.caramel, opacity: band }}>
        보통 레시피 {D.steep.from}~{D.steep.to}시간
      </div>
      <div style={{ position: "absolute", top: y + 110, left: 70, right: 130, fontFamily, opacity: mark, background: K.milk, border: `3px solid ${K.mint}`, borderRadius: 22, padding: "16px 24px", wordBreak: "keep-all" }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: K.mint }}>약 {D.steep.plateauMin}분(6.7시간)</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: K.espresso }}>카페인 · 클로로겐산이 거의 다 우러난 시점 (실험, 2017)</div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "콜드브루는 찬물에 보통 8~24시간 우립니다", from: 15, to: 150, em: ["8~24시간"] },
          { text: "실험에선 약 400분이면 카페인이 거의 다 나왔어요", from: 150, to: 300, em: ["400분이면"] },
        ]}
      />
    </>
  );
};

// 6. 정리 + 출처
export const OutroScene: React.FC = () => {
  const rows = [
    { k: "열량 (355ml)", v: `아메리카노 ${AME.kcal} → 카페모카 ${MOCHA.kcal}kcal` },
    { k: "당류", v: `카페모카 ${MOCHA.sugar}g ≈ 각설탕 ${MOCHA.cubes}개` },
    { k: "카페인 (한 잔 평균)", v: `아메리카노 ${C.americano} · 콜드브루 ${C.coldbrew}mg` },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center" }}>
        <Kinetic text="커피를 숫자로 보면" size={56} at={2} />
      </div>
      {rows.map((r, i) => (
        <Row key={r.k} i={i} k={r.k} v={r.v} />
      ))}
      <div style={{ position: "absolute", top: 930, left: 70, right: 130, textAlign: "center", fontFamily, fontSize: 24, fontWeight: 500, color: K.brown, lineHeight: 1.5, wordBreak: "keep-all" }}>
        열량 · 당류: 식약처 식품영양성분DB(2026.9.29 기준), 100ml당 값을 355ml로 환산
        <br />카페인: 한국소비자원(2018.2) · 권고량: 식약처 · 추출: Fuller & Rao, Sci Rep 2017
        <br />가게 · 레시피 · 크기마다 다름 · 건강 조언 아님
      </div>
      <Caption bottom={400} lines={[{ text: "오늘 마신 커피는 몇 칸짜리였나요?", from: 10, to: 180, em: ["몇"] }]} />
    </>
  );
};

const Row: React.FC<{ i: number; k: string; v: string }> = ({ i, k, v }) => {
  const s = useIn(10 + i * 14);
  return (
    <div
      style={{
        position: "absolute",
        top: 360 + i * 170,
        left: 70,
        right: 130,
        fontFamily,
        background: K.milk,
        borderLeft: `12px solid ${K.caramel}`,
        borderRadius: 20,
        padding: "16px 26px",
        boxShadow: "0 10px 30px rgba(60,30,10,0.15)",
        opacity: s,
        transform: `translateX(${(1 - s) * 80}px)`,
        filter: `blur(${(1 - s) * 6}px)`,
        wordBreak: "keep-all",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: K.dim }}>{k}</div>
      <div style={{ fontSize: 38, fontWeight: 900, color: K.espresso }}>{v}</div>
    </div>
  );
};
