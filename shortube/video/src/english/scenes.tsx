import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily, springs } from "../theme";
import D from "./data.json";
import { Cart, curveAt, DDAY, P, PenCircle, pct, penFont, Pt, Rail } from "./fx";
import TL from "./timeline.json";

// 숫자는 모두 브리프 사실 카드(E01~E11)에서 온다 — output/briefs/2026-10-23_english.md
const LAST = D.years[D.years.length - 1]; // 2026학년도 3.11% (E01)
const MAX = D.years.reduce((a, b) => (b.v > a.v ? b : a)); // 2021학년도 12.66% (E02)

const useIn = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: springs.snappy });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", top: 200, left: 70, right: 130, textAlign: "center", fontFamily, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, wordBreak: "keep-all" }}>
      <div style={{ fontSize: 52, fontWeight: 900, color: P.ink }}>{children}</div>
      {sub && <div style={{ fontSize: 30, fontWeight: 700, color: P.dim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

const Pen: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 60, color = P.red, style }) => (
  <div style={{ fontFamily: penFont, fontSize: size, color, lineHeight: 1.05, ...style }}>{children}</div>
);

// 1. 훅: 채점된 영어 답안 위에 빨간 펜으로 3.11% 동그라미 (E01 · E04)
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const paper = useIn(0);
  const circ = interpolate(frame, [40, 66], [0, 1], clamp);
  const sub = useIn(90);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 110,
          width: 760,
          height: 860,
          background: P.card,
          borderRadius: 18,
          boxShadow: "0 18px 50px rgba(27,47,94,0.22)",
          transform: `rotate(-2.5deg) translateY(${(1 - paper) * 120}px)`,
          opacity: paper,
          fontFamily,
        }}
      >
        <div style={{ padding: "40px 50px 0", fontSize: 34, fontWeight: 700, color: P.dim }}>2026학년도 수능 (작년 11월)</div>
        <div style={{ padding: "6px 50px 0", fontSize: 64, fontWeight: 900, color: P.ink }}>영어 영역</div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ margin: "26px 50px 0", height: 14, borderRadius: 7, background: "rgba(27,47,94,0.10)", width: `${82 - (i % 3) * 14}%` }} />
        ))}
        <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontSize: 46, fontWeight: 900, color: P.ink }}>1등급</div>
          <div style={{ fontSize: 190, fontWeight: 900, color: P.red, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
            <Counter from={0} to={LAST.v} start={12} dur={34} />%
          </div>
        </div>
        <PenCircle w={560} h={230} progress={circ} style={{ left: 80, top: 560 }} />
      </div>
      <Pen size={66} style={{ position: "absolute", top: 1190, left: 0, right: 0, textAlign: "center", opacity: sub, transform: `rotate(-2deg) scale(${0.9 + sub * 0.1})` }}>
        절대평가인데 상위 4%보다 적었다
      </Pen>
      <Caption
        bottom={400}
        lines={[
          { text: `작년 수능 영어 1등급, ${pct(LAST.v)}`, from: 5, to: 90, em: [pct(LAST.v)] },
          { text: "100명 중 3명꼴이었습니다", from: 90, to: 150, em: ["3명꼴"] },
        ]}
      />
    </>
  );
};

// 2. 절대평가 vs 상대평가 (E03)
const Dots: React.FC<{ n: number; on: (i: number) => boolean; at: number; color: string }> = ({ n, on, at, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: 640 }}>
      {Array.from({ length: n }).map((_, i) => {
        const lit = on(i) && frame >= at + i * 2;
        return <div key={i} style={{ width: 44, height: 60, borderRadius: 22, border: `4px solid ${P.ink}`, background: lit ? color : "transparent" }} />;
      })}
    </div>
  );
};

export const RuleScene: React.FC = () => {
  const a = useIn(10);
  const b = useIn(120);
  const card = (s: number, top: number, color: string, head: string, sub: string, body: React.ReactNode) => (
    <div style={{ position: "absolute", top, left: 80, right: 130, fontFamily, background: P.card, borderRadius: 28, padding: "26px 34px", opacity: s, transform: `translateX(${(1 - s) * 80}px)`, borderLeft: `14px solid ${color}`, boxShadow: "0 10px 30px rgba(27,47,94,0.14)" }}>
      <div style={{ fontSize: 46, fontWeight: 900, color }}>{head}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: P.dim, marginBottom: 16, wordBreak: "keep-all" }}>{sub}</div>
      {body}
    </div>
  );
  return (
    <>
      <Title>1등급을 주는 방법이 다르다</Title>
      {card(a, 330, P.blue, "영어 · 절대평가", "2018학년도부터 · 원점수 90점 이상이면 모두", <Dots n={20} on={(i) => i % 3 !== 2} at={30} color={P.blue} />)}
      {card(b, 790, P.red, "국어 · 수학 · 상대평가", "성적순 상위 4%까지만 (25명 중 1명)", <Dots n={25} on={(i) => i === 0} at={140} color={P.red} />)}
      <Caption
        bottom={400}
        lines={[
          { text: "영어는 90점만 넘으면 몇 명이든 1등급", from: 10, to: 120, em: ["90점만"] },
          { text: "국어·수학은 상위 4%까지만 1등급", from: 120, to: 240, em: ["4%까지만"] },
        ]}
      />
    </>
  );
};

// 3. 9년 롤러코스터 (E02 · E04 · E05)
const GROUND = 1250;
const Y = (v: number) => GROUND - 30 - v * 52;
const XS = (i: number) => 220 + i * 300;
const PTS: Pt[] = D.years.map((r, i) => ({ x: XS(i), y: Y(r.v) }));
const WORLD = XS(D.years.length - 1) + 260;

export const CoasterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = TL.coaster;
  const t = interpolate(frame, [start, end], [0, PTS.length - 1], clamp);
  const cart = curveAt(PTS, t);
  const camX = Math.min(WORLD - 1080, Math.max(0, cart.x - 430));
  const arrive = frame - end;
  const shake = arrive >= 0 && arrive < 14 ? Math.sin(arrive * 2.3) * (14 - arrive) * 1.4 : 0;
  const line4 = interpolate(frame, [end + 10, end + 30], [0, 1], clamp);
  const stamp = end + 34;
  return (
    <>
      <Title sub="절대평가로 바뀐 2018학년도부터 9년">수능 영어 1등급 비율</Title>
      <div style={{ position: "absolute", left: 0, top: shake, width: WORLD, height: 1920, transform: `translateX(${-camX}px)` }}>
        {/* 상대평가 1등급 기준 4% 점선 */}
        <div style={{ position: "absolute", left: 0, width: WORLD, top: Y(4) - 3, height: 0, borderTop: `6px dashed ${P.red}`, opacity: 0.25 + line4 * 0.75 }} />
        <div style={{ position: "absolute", left: 0, width: WORLD, top: GROUND, height: 8, background: P.ink, opacity: 0.5 }} />
        <Rail pts={PTS} ground={GROUND} reveal={Math.min(1, t / (PTS.length - 1) + 0.18)} />
        {D.years.map((r, i) => {
          const s = Math.min(1, Math.max(0, (t - i + 0.3) / 0.3));
          const special = r === MAX || r === LAST;
          return (
            <div key={r.y}>
              <div style={{ position: "absolute", left: XS(i) - 16, top: Y(r.v) - 16, width: 32, height: 32, borderRadius: 16, background: special ? P.red : P.ink, opacity: s }} />
              <Pen
                size={special ? 84 : 62}
                color={special ? P.red : P.ink}
                style={{ position: "absolute", left: XS(i) - 150, width: 300, textAlign: "center", top: Y(r.v) - (special ? 190 : 150), opacity: s, transform: `scale(${0.7 + s * 0.3})` }}
              >
                {pct(r.v)}
              </Pen>
              <div style={{ position: "absolute", left: XS(i) - 120, width: 240, textAlign: "center", top: GROUND + 18, fontFamily, fontSize: 32, fontWeight: 900, color: P.ink, opacity: 0.35 + s * 0.65 }}>
                {r.y}
              </div>
            </div>
          );
        })}
        <Cart x={cart.x} y={cart.y} angle={cart.angle} />
      </div>
      {/* 4% 선 이름 — 화면에 고정 */}
      <div style={{ position: "absolute", left: 70, top: Y(4) + 14, fontFamily, fontSize: 28, fontWeight: 900, color: P.red, background: "rgba(227,239,250,0.92)", padding: "4px 12px", borderRadius: 10, opacity: line4 }}>
        상대평가 1등급 = 상위 4%
      </div>
      <Stamp at={stamp} color={P.red} rotate={-7} style={{ top: 1110, left: 540, fontSize: 36, padding: "8px 22px", background: "rgba(255,255,255,0.92)", boxShadow: "none", border: `7px solid ${P.red}` }}>
        절대평가 이후 최저
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "9년 동안 1등급 비율은 오르락내리락", from: 5, to: 140, em: ["오르락내리락"] },
          { text: `가장 높았던 해는 ${MAX.y}학년도 ${pct(MAX.v)}`, from: 140, to: 290, em: [pct(MAX.v)] },
          { text: `가장 낮은 해가 바로 작년, ${pct(LAST.v)}`, from: 290, to: 400, em: [pct(LAST.v)] },
          { text: "절대평가인데 4%보다 적었습니다", from: 400, to: 480, em: ["4%보다"] },
        ]}
      />
    </>
  );
};

// 4. 100칸: 3칸만 빨강 (E01 · E05)
export const DotsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const n = useIn(10);
  const RED = new Set([31, 56, 87]);
  return (
    <>
      <Title sub={`영어 응시자 ${D.took.toLocaleString("ko-KR")}명 중`}>
        1등급 <Counter from={0} to={D.grade1} start={14} dur={40} digits={0} />명
      </Title>
      <div style={{ position: "absolute", top: 390, left: 110, width: 730, display: "flex", flexWrap: "wrap", gap: 14, opacity: n }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const on = RED.has(i) && frame >= 50 + [...RED].indexOf(i) * 10;
          const pop = on ? interpolate(frame - 50 - [...RED].indexOf(i) * 10, [0, 6], [1.6, 1], clamp) : 1;
          return (
            <div key={i} style={{ width: 59, height: 46, borderRadius: 23, border: `4px solid ${on ? P.red : "rgba(27,47,94,0.35)"}`, background: on ? P.red : "rgba(255,255,255,0.55)", transform: `scale(${pop})` }} />
          );
        })}
      </div>
      <Pen size={72} style={{ position: "absolute", top: 1010, left: 0, right: 130, textAlign: "center", opacity: interpolate(frame, [80, 95], [0, 1], clamp) }}>
        100명 중 3명꼴
      </Pen>
      <Stamp at={120} color={P.red} rotate={-5} style={{ top: 1120, left: 95, right: 155, fontSize: 32, padding: "10px 20px", background: "rgba(255,255,255,0.95)", boxShadow: "none", border: `7px solid ${P.red}` }}>
        1994년 수능 이후 전 과목 최저 1등급 비율 · 보도 기준
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: `48만 7,941명 중 1등급은 1만 5,154명`, from: 5, to: 115, em: ["1만", "5,154명"] },
          { text: "1994년 첫 수능 이후 가장 낮은 1등급 비율(보도 기준)", from: 115, to: 210, em: ["가장", "낮은"] },
        ]}
      />
    </>
  );
};

// 5. 같은 해 안의 롤러코스터: 작년 vs 올해 모의평가 (E07 · E08)
const MiniCoaster: React.FC<{ top: number; head: string; rows: { k: string; v: number | null }[]; start: number; end: number; color: string; note?: React.ReactNode }> = ({ top, head, rows, start, end, color, note }) => {
  const frame = useCurrentFrame();
  const s = useIn(start - 18);
  const cardTop = top + 52;
  const base = cardTop + 390;
  const my = (v: number) => base - 40 - v * 11;
  const known = rows.filter((r) => r.v !== null) as { k: string; v: number }[];
  const pts: Pt[] = rows.map((r, i) => ({ x: 210 + i * 290, y: r.v === null ? my(9) : my(r.v) }));
  const knownLast = known.length - 1;
  const tEnd = rows[rows.length - 1].v === null ? knownLast : rows.length - 1;
  const t = interpolate(frame, [start, end], [0, tEnd], clamp);
  const c = curveAt(pts, t);
  const q = rows[rows.length - 1].v === null ? interpolate(frame, [end + 4, end + 18], [0, 1], clamp) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: s }}>
      <div style={{ position: "absolute", top, left: 90, fontFamily, fontSize: 38, fontWeight: 900, color }}>{head}</div>
      <div style={{ position: "absolute", top: cardTop, left: 80, right: 130, height: 450, background: "rgba(255,255,255,0.75)", borderRadius: 28, border: `4px solid ${color}` }} />
      <div style={{ position: "absolute", top: my(4) - 2, left: 100, width: 830, borderTop: `4px dashed ${P.red}`, opacity: 0.55 }} />
      <Rail pts={pts} ground={base} dashedFrom={rows[rows.length - 1].v === null ? knownLast : undefined} />
      {rows.map((r, i) => {
        const shown = t >= i - 0.05 || (r.v === null && q > 0);
        const o = r.v === null ? q : shown ? 1 : 0;
        return (
          <div key={r.k}>
            <Pen size={r.v === null ? 110 : 64} color={r.v === null ? P.red : P.ink} style={{ position: "absolute", left: pts[i].x - 140, width: 280, textAlign: "center", top: pts[i].y - (r.v === null ? 140 : 118), opacity: o }}>
              {r.v === null ? "?" : pct(r.v)}
            </Pen>
            <div style={{ position: "absolute", left: pts[i].x - 140, width: 280, textAlign: "center", top: base + 6, fontFamily, fontSize: 27, fontWeight: 700, color: P.dim }}>{r.k}</div>
          </div>
        );
      })}
      <Cart x={c.x} y={c.y} angle={c.angle} scale={0.75} />
      {note}
    </div>
  );
};

export const MockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ratio = interpolate(frame, [125, 140], [0, 1], clamp);
  return (
    <>
      <MiniCoaster
        top={205}
        head="작년 수험생 · 2026학년도"
        rows={D.last}
        start={20}
        end={115}
        color={P.ink}
        note={
          <Pen size={66} style={{ position: "absolute", top: 400, left: 640, opacity: ratio, transform: `rotate(-6deg) scale(${0.8 + ratio * 0.2})` }}>
            6배 차이
          </Pen>
        }
      />
      <MiniCoaster top={725} head="올해 수험생 · 2027학년도" rows={D.now} start={170} end={262} color={P.red} />
      <div style={{ position: "absolute", top: 1240, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 25, fontWeight: 700, color: P.dim, wordBreak: "keep-all" }}>
        모의평가와 수능은 응시자가 달라 비율만 비교 · 빨간 점선 = 4%
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "작년엔 6월 모의평가 19.10%에서 수능 3.11%", from: 10, to: 120, em: ["19.10%", "3.11%"] },
          { text: "같은 해 안에서 6배 넘게 차이 났습니다", from: 120, to: 175, em: ["6배"] },
          { text: "올해는 거꾸로, 6월 4.13% → 9월 15.54%", from: 175, to: 270, em: ["4.13%", "15.54%"] },
          { text: "그럼 11월 19일 수능은?", from: 270, to: 330, em: ["11월", "19일"] },
        ]}
      />
    </>
  );
};

// 6. 전망 (E09 · E10 · E11) — 의견은 귀속, 단정하지 않음
export const OutlookScene: React.FC = () => {
  const a = useIn(8);
  const b = useIn(70);
  return (
    <>
      <Title sub="정답은 시험이 끝나야 나옵니다">올해 수능 영어는?</Title>
      <div style={{ position: "absolute", top: 380, left: 80, right: 130, fontFamily, background: P.card, borderRadius: 28, padding: "28px 34px", opacity: a, transform: `scale(${0.92 + a * 0.08})`, borderLeft: `14px solid ${P.blue}` }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: P.dim }}>적정선으로 거론되는 1등급 비율</div>
        <div style={{ fontSize: 110, fontWeight: 900, color: P.blue, lineHeight: 1.1 }}>7~8%</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: P.dim }}>보도 기준 (입시업계 · 교육부 방침으로 각각 보도)</div>
      </div>
      <div style={{ position: "absolute", top: 740, left: 80, right: 130, fontFamily, background: P.card, borderRadius: 28, padding: "28px 34px", opacity: b, transform: `translateY(${(1 - b) * 40}px)`, borderLeft: `14px solid ${P.red}`, wordBreak: "keep-all" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: P.dim }}>입시업계 전망</div>
        <div style={{ fontSize: 46, fontWeight: 900, color: P.ink, lineHeight: 1.3, marginTop: 6 }}>9월 모의평가(15.54%)보다는 어렵게</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: P.dim, marginTop: 6 }}>전망일 뿐 · 실제 결과는 12월 채점 발표</div>
      </div>
      <Pen size={170} style={{ position: "absolute", top: 1000, left: 0, right: 130, textAlign: "center", opacity: b, transform: `rotate(-4deg) scale(${0.8 + b * 0.2})` }}>
        수능 D-{DDAY}
      </Pen>
      <Caption
        bottom={400}
        lines={[
          { text: "적정선으로 거론되는 건 7~8%", from: 8, to: 75, em: ["7~8%"] },
          { text: "입시업계는 9월보다 어려울 것으로 봅니다", from: 75, to: 150, em: ["어려울"] },
        ]}
      />
    </>
  );
};

// 7. 정리 + 출처
export const OutroScene: React.FC = () => {
  const rows = [
    { k: "작년 수능 영어 1등급", v: `${pct(LAST.v)} · 100명 중 3명꼴` },
    { k: "9년 중 최고", v: `${MAX.y}학년도 ${pct(MAX.v)}` },
    { k: "올해 9월 모의평가", v: pct(D.now[1].v as number) },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 215, left: 0, right: 130, textAlign: "center", fontFamily, fontSize: 52, fontWeight: 900, color: P.ink }}>숫자로 다시 보면</div>
      {rows.map((r, i) => (
        <Row key={r.k} i={i} k={r.k} v={r.v} />
      ))}
      <div style={{ position: "absolute", top: 900, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 25, fontWeight: 500, color: P.ink, lineHeight: 1.5, wordBreak: "keep-all", opacity: 0.85 }}>
        수능 채점 결과: 평가원 2025.12.4 발표 (뉴시스 · 한국경제 보도)
        <br />모의평가: SBS Biz 2026.9.28 · 산에듀 2026.9.29 · 머니투데이 2026.6.30
        <br />6배 · 100명 중 3명은 직접 계산 · 전망은 보도 기준
      </div>
      <Caption bottom={400} lines={[{ text: "11월 19일, 모든 수험생을 응원합니다", from: 10, to: 120, em: ["응원합니다"] }]} />
    </>
  );
};

const Row: React.FC<{ i: number; k: string; v: string }> = ({ i, k, v }) => {
  const s = useIn(8 + i * 12);
  return (
    <div style={{ position: "absolute", top: 330 + i * 180, left: 80, right: 130, fontFamily, background: P.card, borderRadius: 26, padding: "18px 30px", opacity: s, transform: `translateX(${(1 - s) * 80}px)`, borderLeft: `12px solid ${i === 0 ? P.red : P.blue}` }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: P.dim }}>{k}</div>
      <div style={{ fontSize: 46, fontWeight: 900, color: i === 0 ? P.red : P.ink }}>{v}</div>
    </div>
  );
};
