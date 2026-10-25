import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { clamp, Stamp } from "../market/effects";
import { fontFamily, springs } from "../theme";
import { CoinStack, House, N } from "./fx";

// 만 원 단위 숫자를 "13억 3,651만 원" 처럼 쓴다
const won = (man: number) => {
  const m = Math.round(man);
  const eok = Math.floor(m / 10000);
  const rest = m % 10000;
  if (eok === 0) return `${rest.toLocaleString("ko-KR")}만 원`;
  return rest === 0 ? `${eok}억 원` : `${eok}억 ${rest.toLocaleString("ko-KR")}만 원`;
};

const useIn = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: springs.snappy });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", top: 210, left: 60, right: 60, textAlign: "center", fontFamily, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontSize: 58, fontWeight: 900, color: N.cream }}>{children}</div>
      {sub && <div style={{ fontSize: 34, fontWeight: 700, color: N.dim, marginTop: 8 }}>{sub}</div>}
    </div>
  );
};

// 1. 평균 순자산 카운터
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [10, 65], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - v, 3);
  const q = useIn(75);
  return (
    <>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 50, fontWeight: 700, color: N.dim }}>한국 가구 평균 순자산</div>
        <div style={{ fontSize: 112, fontWeight: 900, color: N.gold, marginTop: 20, fontVariantNumeric: "tabular-nums", textShadow: "0 0 40px rgba(242,193,78,0.35)" }}>
          {won(47144 * eased)}
        </div>
        <div style={{ fontSize: 34, fontWeight: 500, color: N.dim, marginTop: 14 }}>자산 5억 6,678만 − 부채 9,534만</div>
      </div>
      <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, opacity: q }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ transform: `translateY(${(1 - q) * (40 + i * 10)}px)` }}>
            <House size={96} color={i === 3 ? N.gold : N.mid} glow={i === 3} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 64, fontWeight: 900, color: N.cream, opacity: q }}>
        우리 집은 평균 이상일까?
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "한국 가구 평균 순자산은 4억 7,144만 원", from: 5, to: 75, em: ["4억", "7,144만"] },
          { text: "그런데 평균보다 적은 집이 훨씬 많습니다", from: 75, to: 150, em: ["훨씬", "많습니다"] },
        ]}
      />
    </>
  );
};

// 2. 100가구 마을: 57(3억 미만) · 31(3억~10억) · 12(10억 이상)
export const VillageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const size = 72, gap = 12, left = 126, top = 340;
  const groupOf = (i: number) => (i >= 43 ? "low" : i < 12 ? "high" : "mid");
  const legend = [
    { label: "3억 미만", val: "57.0%", color: N.low, at: 40 },
    { label: "3억~10억", val: "31.2%", color: N.mid, at: 170 },
    { label: "10억 이상", val: "11.8%", color: N.gold, at: 110 },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 50, fontWeight: 900, color: N.cream }}>
        100가구 마을로 줄이면
      </div>
      {Array.from({ length: 100 }).map((_, i) => {
        const r = Math.floor(i / 10), c = i % 10;
        const g = groupOf(i);
        const appear = interpolate(frame, [i * 0.25, i * 0.25 + 8], [0, 1], clamp);
        // 3억 미만은 아래 줄부터 차례로, 10억 이상은 맨 위부터
        const lowAt = 40 + (99 - i) * 0.8;
        const fillAt = g === "low" ? lowAt : g === "high" ? 110 + i * 2 : 170 + (i - 12) * 0.5;
        const on = frame >= fillAt;
        const color = on ? (g === "low" ? N.low : g === "high" ? N.gold : N.mid) : "rgba(246,239,220,0.16)";
        const pop = on ? interpolate(frame, [fillAt, fillAt + 4, fillAt + 9], [1, 1.25, 1], clamp) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: left + c * (size + gap), top: top + r * (size + gap), opacity: appear, transform: `scale(${pop})` }}>
            <House size={size} color={color} glow={on && g === "high"} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1195, left: 90, right: 130, display: "flex", justifyContent: "space-between", fontFamily }}>
        {legend.map((l) => (
          <div key={l.label} style={{ textAlign: "center", opacity: interpolate(frame, [l.at, l.at + 10], [0, 1], clamp) }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: N.dim }}>{l.label}</div>
            <div style={{ fontSize: 58, fontWeight: 900, color: l.color, fontVariantNumeric: "tabular-nums" }}>{l.val}</div>
          </div>
        ))}
      </div>
      <Stamp at={235} color={N.gold} rotate={-7} style={{ top: 640, left: 150, fontSize: 64, lineHeight: 1.2, background: "rgba(8,30,24,0.9)" }}>
        평균보다 적은 집
        <br />
        최소 57%
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "100가구 중 57가구는 순자산 3억 원 미만", from: 30, to: 105, em: ["57가구는"] },
          { text: "10억 원 이상은 약 12가구, 나머지 31가구가 그 사이", from: 105, to: 225, em: ["12가구"] },
          { text: "3억 미만은 모두 평균 아래, 평균보다 적은 집이 최소 57%", from: 225, to: 330, em: ["최소", "57%"] },
        ]}
      />
    </>
  );
};

// 3. 가구 수 vs 순자산 점유율 두 기둥
export const ShareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 420, H = 720, colW = 250, lx = 150, rx = 680;
  const leftSeg = [
    { k: "상위 10%", p: 10, color: N.gold },
    { k: "중간 40%", p: 40, color: N.mid },
    { k: "하위 50%", p: 50, color: N.low },
  ];
  const rightSeg = [
    { k: "46.1%", p: 46.1, color: N.gold, at: 110 },
    { k: "44.8%", p: 44.8, color: N.mid, at: 150 },
    { k: "9.1%", p: 9.1, color: N.low, at: 200 },
  ];
  const lg = interpolate(frame, [10, 40], [0, 1], clamp);
  let ly = 0, ry = 0;
  const bands = leftSeg.map((l, i) => {
    const r = rightSeg[i];
    const a = { y0: top + (ly / 100) * H, y1: top + ((ly + l.p) / 100) * H };
    const b = { y0: top + (ry / 100) * H, y1: top + ((ry + r.p) / 100) * H };
    ly += l.p;
    ry += r.p;
    return { a, b, l, r };
  });
  return (
    <>
      <Title sub="가구 비율 vs 순자산 비율">순자산 순으로 줄 세우면</Title>
      <div style={{ position: "absolute", top: top - 60, left: lx, width: colW, textAlign: "center", fontFamily, fontSize: 36, fontWeight: 700, color: N.dim }}>가구 수</div>
      <div style={{ position: "absolute", top: top - 60, left: rx, width: colW, textAlign: "center", fontFamily, fontSize: 36, fontWeight: 700, color: N.dim }}>순자산</div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {bands.map(({ a, b, l, r }) => {
          const o = interpolate(frame, [r.at, r.at + 20], [0, 0.28], clamp);
          return <polygon key={l.k} points={`${lx + colW},${a.y0} ${rx},${b.y0} ${rx},${b.y1} ${lx + colW},${a.y1}`} fill={l.color} opacity={o} />;
        })}
        {bands.map(({ a, l }) => (
          <rect key={l.k} x={lx} y={a.y0} width={colW} height={(a.y1 - a.y0) * lg} fill={l.color} stroke={N.bg} strokeWidth={4} />
        ))}
        {bands.map(({ b, r }) => {
          const g = interpolate(frame, [r.at, r.at + 18], [0, 1], clamp);
          return <rect key={r.k} x={rx} y={b.y0} width={colW} height={(b.y1 - b.y0) * g} fill={r.color} stroke={N.bg} strokeWidth={4} />;
        })}
      </svg>
      {bands.map(({ a, l }) => (
        <div key={l.k} style={{ position: "absolute", left: lx, width: colW, top: (a.y0 + a.y1) / 2 - 22, textAlign: "center", fontFamily, fontSize: 36, fontWeight: 900, color: "#0B1F19", opacity: lg }}>
          {l.k}
        </div>
      ))}
      {bands.map(({ b, r }) => {
        const o = interpolate(frame, [r.at + 10, r.at + 20], [0, 1], clamp);
        const small = b.y1 - b.y0 < 90;
        return (
          <div key={r.k} style={{ position: "absolute", left: rx, width: colW, top: (b.y0 + b.y1) / 2 - (small ? 30 : 40), textAlign: "center", fontFamily, fontSize: small ? 48 : 64, fontWeight: 900, color: "#0B1F19", opacity: o }}>
            {r.k}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1190, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 32, fontWeight: 700, color: N.cream, opacity: interpolate(frame, [215, 230], [0, 1], clamp) }}>
        상위 10% 평균 순자산 <span style={{ color: N.gold }}>21억 7,122만 원</span>
        <div style={{ fontSize: 26, color: N.dim, marginTop: 6 }}>하위 50% 9.1% · 상위 10% 평균은 보도 기준 / 중간 44.8%는 자체 계산</div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "가구를 순자산 순으로 줄 세우면", from: 5, to: 105 },
          { text: "상위 10%가 전체 순자산의 46.1%", from: 105, to: 200, em: ["46.1%"] },
          { text: "하위 절반은 다 합쳐도 9.1%", from: 200, to: 300, em: ["9.1%"] },
        ]}
      />
    </>
  );
};

// 4·5. 동전 탑 비교 (두 장면 모두 같은 축척: 1억 = 40px)
const PX_PER_EOK = 40;
const Towers: React.FC<{ hi: number; lo: number; hiLabel: string; loLabel: string; ratio: string; prev: string; stampTop?: number }> = ({ hi, lo, hiLabel, loLabel, ratio, prev, stampTop = 620 }) => {
  const frame = useCurrentFrame();
  const base = 1170;
  const g = interpolate(frame, [20, 85], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - g, 2);
  const cols = [
    { man: hi, label: hiLabel, x: 180 },
    { man: lo, label: loLabel, x: 620 },
  ];
  return (
    <>
      {cols.map((c) => {
        const h = Math.max(22, (c.man / 10000) * PX_PER_EOK * eased);
        const full = Math.max(22, (c.man / 10000) * PX_PER_EOK);
        return (
          <div key={c.label}>
            <div style={{ position: "absolute", left: c.x, bottom: 1920 - base }}>
              <CoinStack height={h} width={200} />
            </div>
            <div style={{ position: "absolute", left: c.x - 120, width: 440, top: base - full - 100, textAlign: "center", whiteSpace: "nowrap", fontFamily, fontSize: 46, fontWeight: 900, color: N.gold, opacity: interpolate(frame, [80, 95], [0, 1], clamp), fontVariantNumeric: "tabular-nums" }}>
              {won(c.man)}
            </div>
            <div style={{ position: "absolute", left: c.x - 60, width: 320, top: base + 40, textAlign: "center", fontFamily, fontSize: 36, fontWeight: 700, color: N.cream }}>{c.label}</div>
          </div>
        );
      })}
      <Stamp at={120} color={N.gold} rotate={-6} style={{ top: stampTop, left: 560, fontSize: 92, lineHeight: 1.05, background: "rgba(8,30,24,0.9)" }}>
        {ratio}
        <div style={{ fontSize: 32, fontWeight: 700, color: N.dim, marginTop: 6 }}>{prev}</div>
      </Stamp>
    </>
  );
};

export const IncomeScene: React.FC = () => (
  <>
    <Title sub="평균 자산 (부채 빼기 전)">① 소득으로 줄 세우면</Title>
    <Towers hi={133651} lo={15913} hiLabel="소득 상위 20%" loLabel="소득 하위 20%" ratio="8.4배" prev="1년 전 7.3배" />
    <Caption
      bottom={400}
      lines={[
        { text: "소득 상위 20%와 하위 20%의 평균 자산은", from: 5, to: 100 },
        { text: "13억 3,651만 원 vs 1억 5,913만 원", from: 100, to: 200, em: ["13억", "1억"] },
        { text: "8.4배, 1년 전 7.3배보다 벌어졌습니다", from: 200, to: 300, em: ["8.4배,"] },
      ]}
    />
  </>
);

export const NetWorthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [205, 220], [0, 1], clamp);
  return (
    <>
      <Title sub="평균 순자산 (부채 뺀 뒤)">② 순자산으로 줄 세우면</Title>
      <Towers hi={174590} lo={3890} hiLabel="순자산 상위 20%" loLabel="순자산 하위 20%" ratio="44.9배" prev="1년 전 42.1배" stampTop={470} />
      <div style={{ position: "absolute", top: 760, left: 560, width: 340, textAlign: "center", fontFamily, opacity: o, background: N.card, border: `3px solid ${N.line}`, borderRadius: 22, padding: "14px 10px" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: N.dim }}>순자산 지니계수</div>
        <div style={{ fontSize: 60, fontWeight: 900, color: N.cream }}>0.625</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: N.gold }}>조사 이래 최고</div>
      </div>
      <div style={{ position: "absolute", top: 1290, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 26, fontWeight: 500, color: N.dim }}>
        ※ ①과 ②는 나누는 기준이 달라 직접 비교가 아닙니다
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "이번엔 순자산으로 줄 세우면", from: 5, to: 100 },
          { text: "17억 4,590만 원 vs 3,890만 원", from: 100, to: 200, em: ["17억", "3,890만"] },
          { text: "44.9배, 자산 불평등 지수는 조사 이래 최고", from: 200, to: 300, em: ["44.9배,", "최고"] },
        ]}
      />
    </>
  );
};

// 6. 정리 + 출처
export const OutroScene: React.FC = () => {
  const rows = [
    { k: "평균 순자산", v: "4억 7,144만 원" },
    { k: "순자산 3억 미만 가구", v: "57.0%" },
    { k: "상위 20% / 하위 20%", v: "소득 기준 8.4배 · 순자산 기준 44.9배" },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 56, fontWeight: 900, color: N.cream }}>평균 뒤에 숨은 숫자</div>
      {rows.map((r, i) => (
        <Row key={r.k} i={i} k={r.k} v={r.v} />
      ))}
      <div style={{ position: "absolute", top: 1000, left: 80, right: 130, textAlign: "center", fontFamily, fontSize: 27, fontWeight: 500, color: N.dim, lineHeight: 1.5, wordBreak: "keep-all" }}>
        자료: 국가데이터처 · 한국은행 · 금융감독원
        <br />「2025년 가계금융복지조사」(2025.12.4 발표, 2025.3월 말 기준)
        <br />언론 보도 인용 · 계산은 채널 자체 · 재무 조언 아님
      </div>
      <Caption bottom={400} lines={[{ text: "평균 하나로는 보이지 않는 숫자들이었습니다", from: 10, to: 210, em: ["평균"] }]} />
    </>
  );
};

const Row: React.FC<{ i: number; k: string; v: string }> = ({ i, k, v }) => {
  const s = useIn(10 + i * 14);
  return (
    <div
      style={{
        position: "absolute",
        top: 380 + i * 190,
        left: 90,
        right: 130,
        fontFamily,
        background: N.card,
        border: `3px solid ${N.line}`,
        borderRadius: 26,
        padding: "20px 30px",
        opacity: s,
        transform: `translateX(${(1 - s) * 80}px)`,
        wordBreak: "keep-all",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700, color: N.dim }}>{k}</div>
      <div style={{ fontSize: i === 2 ? 44 : 60, fontWeight: 900, color: N.gold }}>{v}</div>
    </div>
  );
};
