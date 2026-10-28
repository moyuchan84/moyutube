import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import { fontFamily, springs } from "../../theme";
import F from "../../../../content/relay/script/facts.json";
import MK from "../../../../content/relay/script/market.json";
import { Clock, pct, R, signColor } from "./fx";

const K = F.kospi;
const num = (v: number, d = 2) => v.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });

const useIn = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: springs.snappy });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", top: 205, left: 60, right: 60, textAlign: "center", fontFamily, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontSize: 56, fontWeight: 900, color: R.paper }}>{children}</div>
      {sub && <div style={{ fontSize: 32, fontWeight: 700, color: R.dim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

// 1. 훅: 미국 반도체 -6.72% → 다음 날 코스피는?
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [8, 40], [0, 1], clamp);
  const e = 1 - Math.pow(1 - v, 3);
  const q = useIn(80);
  return (
    <>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: R.dim }}>간밤 미국 반도체지수</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: R.down, fontVariantNumeric: "tabular-nums", textShadow: `0 0 50px ${R.down}88` }}>
          {pct(-6.72 * e)}
        </div>
        <div style={{ fontSize: 34, fontWeight: 500, color: R.dim }}>필라델피아 반도체지수 · 30종목 모두 하락</div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 90, right: 90, textAlign: "center", fontFamily, opacity: q, transform: `scale(${0.85 + q * 0.15})` }}>
        <div style={{ fontSize: 50, fontWeight: 900, color: R.paper }}>그다음 날 코스피는</div>
        <div style={{ fontSize: 130, fontWeight: 900, color: signColor(K.closePct), fontVariantNumeric: "tabular-nums" }}>{pct(K.closePct)}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: R.dim }}>{F.asOf} 종가 {num(K.close)}</div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "간밤 미국 반도체지수가 6.72% 빠졌습니다", from: 5, to: 80, em: ["6.72%"] },
          { text: `그런데 오늘 코스피는 ${pct(K.closePct)}로 마감`, from: 80, to: 150, em: [pct(K.closePct)] },
        ]}
      />
    </>
  );
};

// 2. 시차 릴레이: 한국 시각으로 줄 세운 이틀
const NODES = [
  { at: 15, h: 5, m: 0, night: true, when: "10.22(목) 새벽", what: "메타 3분기 실적 발표", note: "미국 21일 장 마감 뒤", color: R.orange },
  { at: 95, h: 3, m: 30, night: false, when: "10.22(목) 15:30", what: "코스피 -3.52% 마감", note: "한국이 먼저 빠졌다", color: R.down },
  { at: 185, h: 5, m: 0, night: true, when: "10.23(금) 새벽", what: "나스닥 -2.60% · 반도체 -6.72%", note: "미국 22일 장 마감", color: R.down },
  { at: 275, h: 3, m: 30, night: false, when: `${F.asOf}(금) 15:30`, what: `코스피 ${pct(K.closePct)} 마감`, note: `시가 ${pct(K.openPct)}에서 출발`, color: signColor(K.closePct) },
];

export const RelayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 360, step = 225, x = 150;
  const baton = interpolate(frame, NODES.map((n) => n.at), NODES.map((_, i) => i), clamp);
  return (
    <>
      <Title sub="한국 시각으로 줄 세우면">이틀간의 시차 릴레이</Title>
      <div style={{ position: "absolute", left: x + 60 - 3, top: top + 60, width: 6, height: step * 3, background: "rgba(243,237,226,0.15)" }} />
      <div style={{ position: "absolute", left: x + 60 - 3, top: top + 60, width: 6, height: step * baton, background: R.orange, boxShadow: `0 0 18px ${R.orange}` }} />
      {NODES.map((n, i) => {
        const s = spring({ frame: frame - n.at, fps: 30, config: springs.snappy });
        const spin = interpolate(frame, [n.at, n.at + 22], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", top: top + i * step, left: x, display: "flex", alignItems: "center", gap: 30, opacity: s, transform: `translateX(${(1 - s) * 60}px)`, fontFamily }}>
            <Clock h={n.h} m={n.m} size={120} spin={spin} night={n.night} />
            <div style={{ width: 640 }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: R.orange }}>{n.when}</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: n.color, lineHeight: 1.15, whiteSpace: "nowrap" }}>{n.what}</div>
              <div style={{ fontSize: 28, fontWeight: 500, color: R.dim }}>{n.note}</div>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "시작은 22일 새벽 메타 실적 발표", from: 5, to: 95, em: ["메타"] },
          { text: "그날 오후 코스피가 먼저 3.52% 빠졌고", from: 95, to: 185, em: ["먼저", "3.52%"] },
          { text: "그 밤 미국이 따라 빠졌습니다", from: 185, to: 275, em: ["따라"] },
          { text: `오늘 코스피는 ${pct(K.openPct)}로 열어 ${pct(K.closePct)}로 마감`, from: 275, to: 390, em: [pct(K.closePct)] },
        ]}
      />
    </>
  );
};

// 3. 방아쇠: 메타의 약정 · 현금흐름
const Bar: React.FC<{ label: string; val: string; w: number; at: number; color: string; top: number }> = ({ label, val, w, at, color, top }) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [at, at + 22], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 90, right: 130, fontFamily }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: R.dim, opacity: g }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
        <div style={{ height: 58, width: w * g, background: color, borderRadius: 10 }} />
        <div style={{ fontSize: 44, fontWeight: 900, color, opacity: g, whiteSpace: "nowrap" }}>{val}</div>
      </div>
    </div>
  );
};

export const MetaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fcfO = interpolate(frame, [150, 165], [0, 1], clamp);
  return (
    <>
      <Title sub="매출은 예상보다 좋았는데, 주가는 -6.98%">방아쇠는 메타 실적</Title>
      <div style={{ position: "absolute", top: 380, left: 90, fontFamily, fontSize: 36, fontWeight: 900, color: R.orange }}>① 앞으로 내야 할 약정 (임차 · 계약)</div>
      <Bar top={440} label="7월 공시" val="7,000억 달러" w={440} at={20} color={R.dim} />
      <Bar top={570} label="9월 말" val="8,250억 달러" w={519} at={60} color={R.orange} />
      <Stamp at={100} color={R.orange} rotate={-6} style={{ top: 705, left: 520, fontSize: 40, padding: "8px 22px", background: "rgba(20,16,10,0.9)" }}>
        석 달 새 +17.9%
      </Stamp>
      <div style={{ position: "absolute", top: 800, left: 90, fontFamily, fontSize: 36, fontWeight: 900, color: R.orange, opacity: fcfO }}>② 분기 잉여현금흐름</div>
      <div style={{ position: "absolute", top: 860, left: 90, right: 130, display: "flex", justifyContent: "space-between", fontFamily, opacity: fcfO }}>
        <div style={{ textAlign: "center", width: 400 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: R.dim }}>1년 전</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: R.up }}>+106.3억</div>
          <div style={{ fontSize: 28, color: R.dim }}>달러</div>
        </div>
        <div style={{ fontSize: 70, color: R.dim, alignSelf: "center" }}>→</div>
        <div style={{ textAlign: "center", width: 400 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: R.dim }}>이번 3분기</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: R.down }}>−21.2억</div>
          <div style={{ fontSize: 28, color: R.dim }}>달러</div>
        </div>
      </div>
      <Stamp at={220} color={R.down} rotate={-5} style={{ top: 1090, left: 210, fontSize: 46, padding: "10px 30px", background: "rgba(10,14,24,0.9)" }}>
        상장 후 첫 마이너스 (보도)
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "앞으로 내기로 한 약정이 석 달 새 1,250억 달러 늘었고", from: 10, to: 150, em: ["1,250억"] },
          { text: "번 돈에서 투자를 빼면 분기 첫 마이너스", from: 150, to: 240, em: ["첫", "마이너스"] },
          { text: "AI 투자, 정말 회수할 수 있나 — 의심이 다시 커졌습니다", from: 240, to: 330, em: ["회수"] },
        ]}
      />
    </>
  );
};

// 4. 번진 범위: 가운데 0 기준 좌우 막대
export const SpreadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 380, rowH = 112, mid = 700, scale = 50;
  return (
    <>
      <Title sub="10.22(현지) 종가 등락률">기술주 · 반도체로 번졌다</Title>
      <div style={{ position: "absolute", left: mid - 1, top: top - 10, width: 2, height: rowH * F.us.length, background: "rgba(243,237,226,0.3)" }} />
      {F.us.map((r, i) => {
        const at = 15 + i * 16;
        const g = interpolate(frame, [at, at + 18], [0, 1], clamp);
        const w = Math.max(Math.abs(r.v) * scale, 6) * g;
        const c = signColor(r.v);
        const y = top + i * rowH;
        return (
          <div key={r.k} style={{ position: "absolute", top: y, left: 0, right: 0, fontFamily, opacity: interpolate(frame, [at, at + 6], [0, 1], clamp) }}>
            <div style={{ position: "absolute", left: 60, width: 220, fontSize: 38, fontWeight: 900, color: R.paper, top: 14, whiteSpace: "nowrap" }}>{r.k}</div>
            <div style={{ position: "absolute", top: 8, height: 64, borderRadius: 10, background: c, left: r.v < 0 ? mid - w : mid, width: w }} />
            <div style={{ position: "absolute", top: 14, fontSize: 40, fontWeight: 900, color: c, fontVariantNumeric: "tabular-nums", left: mid + (r.v > 0 ? w : 0) + 14 }}>
              {pct(r.v)}
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "다우는 보합인데 나스닥 -2.60%", from: 10, to: 120, em: ["보합", "-2.60%"] },
          { text: "AI를 사는 쪽(메타)도 파는 쪽(엔비디아 · 반도체)도 같이 빠졌습니다", from: 120, to: 300, em: ["같이"] },
        ]}
      />
    </>
  );
};

// 5. 한국: 오늘 코스피 5분봉 장중 흐름 + 어제 종가 기준선
export const KoreaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = MK.intraday.bars;
  const x0 = 90, x1 = 950, y0 = 400, y1 = 900;
  const lo = Math.min(...bars.map((b) => b.l), K.prev) - 15;
  const hi = Math.max(...bars.map((b) => b.h), K.prev) + 15;
  const X = (i: number) => x0 + ((x1 - x0) * i) / (bars.length - 1);
  const Y = (v: number) => y1 - ((y1 - y0) * (v - lo)) / (hi - lo);
  const drawn = interpolate(frame, [15, 165], [0, 1], clamp);
  const n = Math.max(2, Math.round(bars.length * drawn));
  const d = bars.slice(0, n).map((b, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(b.c).toFixed(1)}`).join(" ");
  const lowI = bars.reduce((best, b, i) => (b.l < bars[best].l ? i : best), 0);
  const tag = (i: number, v: number, label: string, at: number, color: string, above: boolean) => (
    <div style={{ position: "absolute", left: Math.min(Math.max(X(i) - 110, 40), 700), top: Y(v) + (above ? -92 : 46), width: 220, textAlign: "center", fontFamily, opacity: interpolate(frame, [at, at + 10], [0, 1], clamp) }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: R.dim }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 900, color }}>{num(v)}</div>
    </div>
  );
  const chips = [
    { k: "삼성전자", v: F.samsung.pct },
    { k: "SK하이닉스", v: F.hynix.pct },
    { k: "코스닥", v: F.kosdaq.pct },
  ];
  const cg = interpolate(frame, [180, 200], [0, 1], clamp);
  return (
    <>
      <Title sub={`코스피 5분 간격 · ${F.asOf}`}>오늘 한국장은 이렇게 움직였다</Title>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={x0} x2={x1} y1={Y(K.prev)} y2={Y(K.prev)} stroke={R.paper} strokeOpacity={0.45} strokeWidth={3} strokeDasharray="12 10" />
        <path d={d} fill="none" stroke={R.orange} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${R.orange})` }} />
        {drawn >= 1 && <circle cx={X(bars.length - 1)} cy={Y(bars[bars.length - 1].c)} r={12} fill={R.orange} />}
      </svg>
      <div style={{ position: "absolute", left: x0, top: Y(K.prev) - 44, fontFamily, fontSize: 26, fontWeight: 700, color: R.paper, opacity: 0.8 }}>어제 종가 {num(K.prev)}</div>
      {tag(lowI, K.low, `장중 저점 ${pct(K.lowPct)}`, 95, R.down, false)}
      {tag(bars.length - 1, K.close, `종가 ${pct(K.closePct)}`, 168, signColor(K.closePct), false)}
      <div style={{ position: "absolute", top: 1010, left: 90, right: 130, display: "flex", justifyContent: "space-between", fontFamily, opacity: cg }}>
        {chips.map((c) => (
          <div key={c.k} style={{ textAlign: "center", width: 270, background: R.card, border: `3px solid ${R.line}`, borderRadius: 22, padding: "14px 0" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: R.dim }}>{c.k}</div>
            <div style={{ fontSize: 50, fontWeight: 900, color: signColor(c.v), fontVariantNumeric: "tabular-nums" }}>{pct(c.v)}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1200, left: 90, right: 130, textAlign: "center", fontFamily, fontSize: 32, fontWeight: 700, color: R.paper, opacity: interpolate(frame, [230, 245], [0, 1], clamp) }}>
        {F.foreign}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: `아침엔 한때 ${pct(K.lowPct)}까지 밀렸다가`, from: 10, to: 168, em: [pct(K.lowPct)] },
          { text: `오후에 상승으로 돌아서 ${pct(K.closePct)} 마감, 저점에서 +4.6%`, from: 168, to: 240, em: [pct(K.closePct), "+4.6%"] },
          { text: `미국 반도체 -6.72% 다음 날 SK하이닉스는 ${pct(F.hynix.pct)}`, from: 240, to: 360, em: [pct(F.hynix.pct)] },
        ]}
      />
    </>
  );
};

// 6. 증권가 시각 — 서로 다른 의견을 같은 크기로
export const ViewsScene: React.FC = () => (
  <>
    <Title sub="같은 크기로 나란히 · 방향 전망 아님">증권가는 이렇게 봤다</Title>
    {F.views.map((v, i) => (
      <ViewCard key={i} i={i} firm={v.firm} text={v.text} />
    ))}
    <Caption
      bottom={400}
      lines={[
        { text: "악재는 이미 반영됐다는 시각과", from: 10, to: 100, em: ["반영됐다는"] },
        { text: "변동성이 이어진다는 시각이 함께 나옵니다", from: 100, to: 210, em: ["변동성이"] },
      ]}
    />
  </>
);

const ViewCard: React.FC<{ i: number; firm: string; text: string }> = ({ i, firm, text }) => {
  const s = useIn(15 + i * 40);
  return (
    <div
      style={{
        position: "absolute",
        top: 400 + i * 330,
        left: 90,
        right: 130,
        height: 280,
        fontFamily,
        background: R.card,
        border: `3px solid ${R.line}`,
        borderRadius: 26,
        padding: "26px 34px",
        opacity: s,
        transform: `translateY(${(1 - s) * 50}px)`,
        wordBreak: "keep-all",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 900, color: R.orange }}>{firm}</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: R.paper, lineHeight: 1.35, marginTop: 10 }}>“{text}”</div>
    </div>
  );
};

// 7. 정리 + 출처
export const OutroScene: React.FC = () => {
  const rows = [
    { k: "방아쇠", v: "메타 약정 8,250억 달러 · 현금흐름 첫 마이너스" },
    { k: "미국 10.22", v: "나스닥 -2.60% · 반도체지수 -6.72%" },
    { k: `한국 ${F.asOf}`, v: `코스피 ${pct(K.closePct)} (전날 -3.52%)` },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 54, fontWeight: 900, color: R.paper }}>숫자로 다시 보면</div>
      {rows.map((r, i) => (
        <Row key={r.k} i={i} k={r.k} v={r.v} />
      ))}
      <div style={{ position: "absolute", top: 960, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 26, fontWeight: 500, color: R.dim, lineHeight: 1.5, wordBreak: "keep-all" }}>
        자료: 한국거래소 시세(Yahoo Finance 대조) · 메타 3분기 실적 보도
        <br />네이버 금융(수급) · 뉴스1 · 파이낸셜뉴스 · 뉴스핌 · Investing.com 등 (설명란)
        <br />등락률은 종가 기준 · 계산은 채널 자체 · 투자 권유 아님
      </div>
      <Caption bottom={400} lines={[{ text: "한국이 먼저 빠지고, 미국이 뒤따르고, 오늘 한국은 버텼습니다", from: 10, to: 180, em: ["먼저", "버텼습니다"] }]} />
    </>
  );
};

const Row: React.FC<{ i: number; k: string; v: string }> = ({ i, k, v }) => {
  const s = useIn(10 + i * 14);
  return (
    <div
      style={{
        position: "absolute",
        top: 360 + i * 180,
        left: 90,
        right: 130,
        fontFamily,
        background: R.card,
        border: `3px solid ${R.line}`,
        borderRadius: 26,
        padding: "18px 30px",
        opacity: s,
        transform: `translateX(${(1 - s) * 80}px)`,
        wordBreak: "keep-all",
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 700, color: R.orange }}>{k}</div>
      <div style={{ fontSize: 40, fontWeight: 900, color: R.paper }}>{v}</div>
    </div>
  );
};
