import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import { fontFamily, springs } from "../../theme";
import D from "../../../../content/burn/script/data.json";
import { B, hm, Runner, Stopwatch } from "./fx";

const CHICKEN = D.rows[D.rows.length - 1];
const kc = (v: number) => `${v.toLocaleString("ko-KR")}kcal`;

const useIn = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: springs.snappy });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", top: 205, left: 60, right: 60, textAlign: "center", fontFamily, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontSize: 56, fontWeight: 900, color: B.white, textShadow: "0 4px 18px rgba(0,0,0,0.35)" }}>{children}</div>
      {sub && <div style={{ fontSize: 31, fontWeight: 700, color: B.dim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

// 1. 훅: 치킨 한 마리를 걸어서 태우면? 스톱워치가 돌며 8시간 44분
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [30, 95], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 2);
  const m = Math.round(CHICKEN.walkMin * e);
  const q = useIn(95);
  return (
    <>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: B.white }}>후라이드치킨 한 마리</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: B.dim, marginTop: 6 }}>걸어서 태우려면?</div>
      </div>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Stopwatch size={300} turns={(CHICKEN.walkMin / 60) * e} color={B.walk} />
      </div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 120, fontWeight: 900, color: B.walk, fontVariantNumeric: "tabular-nums", textShadow: "0 6px 30px rgba(0,0,0,0.35)" }}>
        {hm(m)}
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: q }}>
        <Runner size={150} color={B.white} />
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: `치킨 한 마리 약 ${kc(CHICKEN.kcal)}, 걸어서 태우려면`, from: 5, to: 95, em: [kc(CHICKEN.kcal) + ","] },
          { text: `쉬지 않고 ${hm(CHICKEN.walkMin)} 걸어야 합니다`, from: 95, to: 165, em: [String(Math.floor(CHICKEN.walkMin / 60)) + "시간"] },
        ]}
      />
    </>
  );
};

// 2. 계산법: MET × 체중 × 시간
export const RuleScene: React.FC = () => {
  const a = useIn(20);
  const b = useIn(70);
  const card = (s: number, top: number, color: string, run: boolean, name: string, cond: string, met: number, perHour: number) => (
    <div style={{ position: "absolute", top, left: 90, right: 130, fontFamily, background: B.card, borderRadius: 28, padding: "24px 30px", display: "flex", gap: 26, alignItems: "center", opacity: s, transform: `translateX(${(1 - s) * 80}px)`, border: `3px solid ${color}` }}>
      <Runner size={130} color={color} run={run} />
      <div>
        <div style={{ fontSize: 44, fontWeight: 900, color }}>{name}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: B.dim }}>{cond} · {met} MET</div>
        <div style={{ fontSize: 50, fontWeight: 900, color: B.white, marginTop: 4 }}>1시간 ≈ {perHour}kcal</div>
      </div>
    </div>
  );
  return (
    <>
      <Title sub="2024 신체활동 소모량 기준표(Compendium)">계산법: MET × 체중 × 시간</Title>
      {card(a, 400, B.walk, false, "걷기", "시속 약 4.5~5.5km", D.walk.met, D.walk.perHour)}
      {card(b, 660, B.run, true, "달리기", "시속 약 8km", D.run.met, D.run.perHour)}
      <div style={{ position: "absolute", top: 940, left: 90, right: 130, textAlign: "center", fontFamily, fontSize: 30, fontWeight: 700, color: B.dim, lineHeight: 1.45, wordBreak: "keep-all", opacity: b }}>
        체중 {D.kg}kg 기준 · 가만히 있어도 쓰는 열량까지 포함한 어림값
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: `체중 ${D.kg}kg이 보통 속도로 걸으면 1시간에 약 ${D.walk.perHour}kcal`, from: 10, to: 120, em: [`${D.walk.perHour}kcal`] },
          { text: `시속 8km로 달리면 약 ${D.run.perHour}kcal`, from: 120, to: 240, em: [`${D.run.perHour}kcal`] },
        ]}
      />
    </>
  );
};

// 3·4. 레인 차트: 음식별 걷기(또는 달리기) 시간
const Lanes: React.FC<{ mode: "walk" | "run"; start: number; gap: number; morphFrom?: boolean }> = ({ mode, start, gap, morphFrom }) => {
  const frame = useCurrentFrame();
  const top = 360, rowH = 112, x0 = 90, maxW = 560;
  const max = CHICKEN.walkMin;
  const color = mode === "walk" ? B.walk : B.run;
  return (
    <>
      {D.rows.map((r, i) => {
        const at = start + i * gap;
        const g = interpolate(frame, [at, at + 20], [0, 1], clamp);
        const target = mode === "walk" ? r.walkMin : r.runMin;
        // 달리기 장면은 걷기 길이에서 줄어들며 시작한다
        const from = morphFrom ? r.walkMin : 0;
        const val = from + (target - from) * g;
        const w = Math.max(10, (val / max) * maxW);
        const y = top + i * rowH;
        const show = morphFrom ? 1 : interpolate(frame, [at - 4, at + 4], [0, 1], clamp);
        return (
          <div key={r.k} style={{ position: "absolute", top: y, left: 0, right: 0, height: rowH, fontFamily, opacity: show }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: rowH - 3, height: 3, background: B.lane, opacity: 0.5 }} />
            <div style={{ position: "absolute", left: x0, top: 4, fontSize: 30, fontWeight: 900, color: B.white, whiteSpace: "nowrap" }}>
              {r.k} <span style={{ fontSize: 24, fontWeight: 700, color: B.dim }}>{kc(r.kcal)}</span>
            </div>
            <div style={{ position: "absolute", left: x0, top: 50, height: 40, width: w, background: color, borderRadius: 8 }} />
            <div style={{ position: "absolute", left: x0 + w - 30, top: 34 }}>
              <Runner size={56} color={B.ink} run={mode === "run"} phase={i} />
            </div>
            <div style={{ position: "absolute", left: x0 + w + 36, top: 48, fontSize: 36, fontWeight: 900, color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{hm(Math.round(val))}</div>
          </div>
        );
      })}
    </>
  );
};

export const WalkScene: React.FC = () => (
  <>
    <Title sub="식약처 음식 DB 1인분 기준 · 체중 70kg">걸어서 태우려면</Title>
    <Lanes mode="walk" start={20} gap={42} />
    <Caption
      bottom={400}
      lines={[
        { text: "아메리카노는 3분, 같은 크기 라떼는 40분", from: 20, to: 160, em: ["3분,", "40분"] },
        { text: "도넛 하나, 떡볶이 1인분이면 약 1시간", from: 160, to: 250, em: ["1시간"] },
        { text: "치즈버거 2시간 반, 짜장면 · 삼겹살은 3시간 반", from: 250, to: 330, em: ["3시간"] },
        { text: "치킨 한 마리는 8시간 44분, 법정 하루 근로시간 8시간보다 깁니다", from: 330, to: 450, em: ["8시간", "44분,"] },
      ]}
    />
  </>
);

export const RunScene: React.FC = () => (
  <>
    <Title sub="시속 8km · 체중 70kg">달리면 절반 이하로</Title>
    <Lanes mode="run" start={20} gap={10} morphFrom />
    <Caption
      bottom={400}
      lines={[
        { text: "달리면 시간은 절반 이하로 줄지만", from: 15, to: 130, em: ["절반"] },
        { text: `치킨 한 마리는 여전히 ${hm(CHICKEN.runMin)}`, from: 130, to: 300, em: [String(Math.floor(CHICKEN.runMin / 60)) + "시간"] },
      ]}
    />
  </>
);

// 5. 거리로 바꾸면: 마라톤과 비교
export const MarathonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walkKm = (CHICKEN.walkMin / 60) * D.walk.kmh;
  const runKm = (CHICKEN.runMin / 60) * D.run.kmh;
  const full = 42.195;
  const x0 = 110, W = 760;
  const bar = (km: number, at: number, top: number, color: string, label: string, run: boolean) => {
    const g = interpolate(frame, [at, at + 40], [0, 1], clamp);
    const w = (Math.min(km, 46) / 46) * W * g;
    return (
      <div style={{ position: "absolute", top, left: 0, right: 0, fontFamily }}>
        <div style={{ position: "absolute", left: x0, fontSize: 32, fontWeight: 900, color: B.white, opacity: interpolate(frame, [at - 5, at + 5], [0, 1], clamp) }}>{label}</div>
        <div style={{ position: "absolute", left: x0, top: 52, height: 46, width: w, background: color, borderRadius: 10 }} />
        <div style={{ position: "absolute", left: x0 + w - 34, top: 30 }}>
          <Runner size={64} color={B.ink} run={run} />
        </div>
        <div style={{ position: "absolute", left: x0, top: 104, fontSize: 40, fontWeight: 900, color, opacity: g }}>{km.toFixed(1)}km</div>
      </div>
    );
  };
  const finishX = x0 + (full / 46) * W;
  return (
    <>
      <Title sub="걷기 시속 5km · 달리기 시속 8km로 가정">거리로 바꾸면</Title>
      <div style={{ position: "absolute", left: finishX - 3, top: 400, width: 6, height: 560, backgroundImage: `repeating-linear-gradient(180deg, ${B.white} 0 20px, ${B.ink} 20px 40px)` }} />
      <div style={{ position: "absolute", left: finishX - 150, top: 352, width: 300, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 900, color: B.run }}>마라톤 42.195km</div>
      {bar(walkKm, 20, 440, B.walk, "치킨 한 마리, 걸어서", false)}
      {bar(runKm, 80, 700, B.run, "치킨 한 마리, 달려서", true)}
      <Stamp at={135} color={B.run} rotate={-5} style={{ top: 1010, left: 120, fontSize: 40, lineHeight: 1.3, padding: "12px 28px", background: "rgba(40,8,2,0.88)" }}>
        마라톤 완주(시속 8km) ≈ {kc(D.marathon.kcal)}
        <br />= 치킨 약 {(D.marathon.kcal / CHICKEN.kcal).toFixed(1)}마리
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: `걸으면 ${walkKm.toFixed(1)}km, 마라톤보다 깁니다`, from: 15, to: 80, em: [`${walkKm.toFixed(1)}km,`] },
          { text: `달려도 ${runKm.toFixed(1)}km`, from: 80, to: 135, em: [`${runKm.toFixed(1)}km`] },
          { text: `마라톤 한 번 완주해도 치킨 약 ${(D.marathon.kcal / CHICKEN.kcal).toFixed(1)}마리분`, from: 135, to: 240, em: [`${(D.marathon.kcal / CHICKEN.kcal).toFixed(1)}마리`] },
        ]}
      />
    </>
  );
};

// 6. 오해 바로잡기: "7,700kcal = 1kg"
export const MythScene: React.FC = () => {
  const s = useIn(10);
  const t = useIn(90);
  return (
    <>
      <Title sub="흔히 쓰는 어림셈">"7,700kcal 태우면 1kg 빠진다"?</Title>
      <div style={{ position: "absolute", top: 420, left: 90, right: 130, fontFamily, background: B.card, borderRadius: 28, padding: "30px 34px", opacity: s, transform: `scale(${0.9 + s * 0.1})`, wordBreak: "keep-all" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: B.dim }}>1파운드 = 3,500kcal 규칙을 kg으로 바꾼 값</div>
        <div style={{ fontSize: 46, fontWeight: 900, color: B.white, marginTop: 10, lineHeight: 1.3 }}>그대로 계산하면 치킨 한 마리 ≈ 0.3kg</div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 90, right: 130, fontFamily, background: "rgba(255,248,240,0.95)", borderRadius: 28, padding: "30px 34px", opacity: t, transform: `translateY(${(1 - t) * 40}px)`, wordBreak: "keep-all" }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: B.track }}>미국 국립보건원 연구진 (Hall & Chow, 2013)</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: B.ink, marginTop: 10, lineHeight: 1.3 }}>이 규칙은 실제 감량을 과대 추정한다</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#6B3A2E", marginTop: 8 }}>몸이 줄어든 섭취·체중에 맞춰 소모량을 바꾸기 때문</div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "7,700kcal 태우면 1kg 빠진다는 계산, 많이 쓰죠", from: 10, to: 90, em: ["7,700kcal"] },
          { text: "연구에서는 실제 감량보다 크게 잡힌다고 봅니다", from: 90, to: 240, em: ["크게"] },
        ]}
      />
    </>
  );
};

// 7. 정리 + 출처
export const OutroScene: React.FC = () => {
  const rows = [
    { k: "라떼 한 잔", v: `걷기 ${hm(D.rows[1].walkMin)}` },
    { k: "짜장면 1그릇", v: `걷기 ${hm(D.rows[5].walkMin)}` },
    { k: "치킨 한 마리", v: `걷기 ${hm(CHICKEN.walkMin)} · 달리기 ${hm(CHICKEN.runMin)}` },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 225, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 54, fontWeight: 900, color: B.white }}>숫자로 다시 보면</div>
      {rows.map((r, i) => (
        <Row key={r.k} i={i} k={r.k} v={r.v} />
      ))}
      <div style={{ position: "absolute", top: 930, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 25, fontWeight: 500, color: B.white, lineHeight: 1.5, wordBreak: "keep-all", opacity: 0.9 }}>
        열량: 식약처 식품영양성분DB(2026.9.29 기준)
        <br />같은 음식도 가게 · 조리법마다 다름
        <br />운동: 2024 Adult Compendium · Hall & Chow(2013)
        <br />체중 70kg 어림 계산 · 개인차 큼 · 의학적 조언 아님
      </div>
      <Caption bottom={400} lines={[{ text: "먹는 건 한 끼, 태우는 건 몇 시간이었습니다", from: 10, to: 180, em: ["몇", "시간"] }]} />
    </>
  );
};

const Row: React.FC<{ i: number; k: string; v: string }> = ({ i, k, v }) => {
  const s = useIn(10 + i * 14);
  return (
    <div style={{ position: "absolute", top: 350 + i * 180, left: 90, right: 130, fontFamily, background: B.card, borderRadius: 26, padding: "18px 30px", opacity: s, transform: `translateX(${(1 - s) * 80}px)`, wordBreak: "keep-all" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: B.dim }}>{k}</div>
      <div style={{ fontSize: 42, fontWeight: 900, color: B.run }}>{v}</div>
    </div>
  );
};
