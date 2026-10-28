import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import { fontFamily, springs } from "../../theme";
import D from "../../../../content/foliage/script/data.json";
import { dayOf, Drift, Leaf, leafColor, P, serif, statusColor } from "./fx";
import TL from "../../../../content/foliage/script/timeline.json";

// 숫자는 모두 브리프 사실 카드(L01~L14)에서 온다 — output/briefs/2026-10-24_foliage.md
const NORMAL = dayOf(D.normal.peak); // 10월 17일 (L03)
const THIS = D.seorak[D.seorak.length - 1]; // 2026년 10월 16일 (L07)
const late = (md: string) => dayOf(md) - NORMAL;
const signed = (n: number) => (n > 0 ? `+${n}일` : `${n < 0 ? "−" : ""}${Math.abs(n)}일`);
const md = (s: string) => s.split("-").map(Number).join(".");

const useIn = (at: number, cfg: { damping: number; stiffness?: number } = springs.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(0);
  return (
    <div style={{ position: "absolute", top: 200, left: 70, right: 130, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)`, wordBreak: "keep-all" }}>
      <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: P.ink }}>{children}</div>
      {sub && <div style={{ fontFamily, fontSize: 28, fontWeight: 700, color: P.dim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

// 1. 훅: 큰 단풍잎이 초록에서 진홍으로 물들고 절정 날짜가 찍힌다 (L07 · L03)
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = useIn(0, springs.smooth);
  const tint = interpolate(frame, [8, 66], [0, 1], clamp);
  const date = useIn(62);
  return (
    <>
      <Drift seed="h" />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: serif, fontSize: 52, fontWeight: 700, color: P.ink, opacity: grow }}>
        2026 설악산 단풍 절정
      </div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${0.6 + grow * 0.4}) rotate(${Math.sin(frame / 18) * 4}deg)` }}>
        <Leaf size={520} color={leafColor(tint)} />
      </div>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 170, color: P.red, opacity: date, transform: `scale(${1.4 - date * 0.4})`, textShadow: "0 6px 0 rgba(59,42,30,0.12)" }}>
        10월 16일
      </div>
      <Stamp at={95} color={P.green} rotate={-6} style={{ top: 1130, left: 250, fontSize: 52, background: "rgba(255,251,242,0.92)" }}>
        평년보다 1일 빠름
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "올해 설악산 단풍 절정은 10월 16일", from: 5, to: 85, em: ["10월", "16일"] },
          { text: "평년(10월 17일)보다 하루 빨랐습니다", from: 85, to: 150, em: ["하루"] },
        ]}
      />
    </>
  );
};

// 2. 기준: 산이 정상부터 물들어 20% 첫 단풍 · 80% 절정, 최저기온 5℃ (L01 · L02)
export const RuleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 330, h = 560, left = 90, w = 860;
  const level = interpolate(frame, [15, 70, 95, 160], [0, 0.2, 0.2, 0.8], clamp);
  const tilt = interpolate(frame, [0, 200], [-60, 0], clamp);
  const ridge = `M 0 ${h} L 120 ${h * 0.55} L 220 ${h * 0.62} L 360 ${h * 0.12} L 430 0 L 520 ${h * 0.18} L 640 ${h * 0.4} L 720 ${h * 0.33} L ${w} ${h * 0.7} L ${w} ${h} Z`;
  const mark = (p: number, label: string, at: number) => {
    const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
    return (
      <g opacity={o}>
        <line x1={0} x2={w} y1={h * p} y2={h * p} stroke={P.ink} strokeWidth={4} strokeDasharray="16 12" />
        <rect x={w - 300} y={h * p - 64} width={290} height={56} rx={14} fill={P.ink} />
        <text x={w - 155} y={h * p - 24} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={34} fill={P.paper}>
          {label}
        </text>
      </g>
    );
  };
  const therm = useIn(160);
  const temp = interpolate(frame, [165, 215], [15, 4], clamp);
  const tx = (t: number) => 140 + ((t - 0) / 20) * 760;
  return (
    <>
      <Title sub="기상청 계절관측 기준">단풍은 위에서부터 내려온다</Title>
      <svg width={w} height={h} style={{ position: "absolute", top: top + tilt, left, overflow: "visible" }}>
        <defs>
          <linearGradient id="tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.red} />
            <stop offset="0.5" stopColor={P.orange} />
            <stop offset="1" stopColor={P.yellow} />
          </linearGradient>
          <clipPath id="ridge">
            <path d={ridge} />
          </clipPath>
        </defs>
        <path d={ridge} fill={P.green} />
        <g clipPath="url(#ridge)">
          <rect x={0} y={0} width={w} height={h * level} fill="url(#tint)" />
        </g>
        <path d={ridge} fill="none" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        {mark(0.2, "20% 첫 단풍", 60)}
        {mark(0.8, "80% 절정", 150)}
      </svg>
      <div style={{ position: "absolute", top: 1010, left: 70, right: 130, height: 260, fontFamily, opacity: therm, transform: `translateY(${(1 - therm) * 40}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: P.ink }}>하루 최저기온</div>
        <div style={{ position: "absolute", top: 70, left: 70, width: 760, height: 40, borderRadius: 20, background: `linear-gradient(90deg, #4A7FB8, #9CC3E0 25%, ${P.yellow} 60%, ${P.warm})` }} />
        <div style={{ position: "absolute", top: 58, left: tx(temp) - 70 - 10, width: 20, height: 64, borderRadius: 10, background: P.ink }} />
        <div style={{ position: "absolute", top: 58, left: tx(5) - 70 - 3, width: 6, height: 64, background: P.red }} />
        <div style={{ position: "absolute", top: 136, left: tx(temp) - 70 - 80, width: 160, textAlign: "center", fontSize: 44, fontWeight: 900, color: P.ink }}>
          {temp.toFixed(0)}℃
        </div>
        <div style={{ position: "absolute", top: 20, left: tx(5) - 70 - 60, width: 120, textAlign: "center", fontSize: 28, fontWeight: 900, color: P.red }}>5℃</div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "기상청은 산이 20% 물들면 첫 단풍", from: 10, to: 95, em: ["20%"] },
          { text: "80% 물들면 절정이라고 부릅니다", from: 95, to: 165, em: ["80%"] },
          { text: "보통 하루 최저기온이 5℃ 아래로 내려가면 물들기 시작", from: 165, to: 240, em: ["5℃"] },
        ]}
      />
    </>
  );
};

// 3. 달력: 최근 5년 설악산 절정일을 10월 달력 위에 (L03 · L04 · L06 · L07)
export const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d0 = 14, d1 = 31, x0 = 210, x1 = 920;
  const X = (d: number) => x0 + ((d - d0) / (d1 - d0)) * (x1 - x0);
  const rowY = (i: number) => 470 + i * 160;
  const axis = useIn(5);
  const zoom = interpolate(frame, [0, 480], [1.04, 1], clamp);
  const hi24 = interpolate(frame, [228, 240], [0, 1], clamp);
  return (
    <>
      <Title sub="기상청 관측 · 산의 80%가 물든 날">설악산 단풍 절정일</Title>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        {/* 날짜 눈금 */}
        <div style={{ opacity: axis }}>
          {[14, 17, 21, 24, 28, 31].map((d) => (
            <div key={d} style={{ position: "absolute", top: 380, left: X(d) - 50, width: 100, textAlign: "center", fontFamily, fontSize: 30, fontWeight: 700, color: d === NORMAL ? P.green : P.dim }}>
              {d === NORMAL ? `평년 10.${d}` : `10.${d}`}
            </div>
          ))}
          {D.seorak.map((_, i) => (
            <div key={i} style={{ position: "absolute", top: rowY(i), left: x0 - 20, width: x1 - x0 + 40, height: 3, background: "rgba(59,42,30,0.15)" }} />
          ))}
          <div style={{ position: "absolute", top: 425, left: X(NORMAL) - 2, width: 0, height: 700, borderLeft: `5px dashed ${P.green}` }} />
        </div>
        {D.seorak.map((y, i) => {
          const at = TL.leafDrop[i];
          const drop = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 90 } });
          const tag = spring({ frame: frame - at - 14, fps, config: springs.snappy });
          const d = dayOf(y.peak);
          const L = late(y.peak);
          const label = interpolate(frame, [at - 10, at], [0, 1], clamp);
          const is24 = y.y === 2024, isNow = y.y === 2026;
          const leafY = rowY(i) - 46 - (1 - drop) * 520;
          return (
            <div key={y.y}>
              <div style={{ position: "absolute", top: rowY(i) - 30, left: 60, fontFamily: serif, fontSize: 46, fontWeight: 700, color: isNow ? P.red : P.ink, opacity: Math.max(0.35, label) }}>{y.y}</div>
              {frame >= at - 2 && (
                <Leaf size={92} color={leafColor(0.55 + (L / 12) * 0.45)} rotate={(1 - drop) * 220 - 10} style={{ position: "absolute", left: X(d) - 46, top: leafY, opacity: Math.min(1, drop * 3) }} />
              )}
              <div
                style={{
                  position: "absolute",
                  top: rowY(i) + 44,
                  left: X(d) - 110,
                  width: 220,
                  textAlign: "center",
                  fontFamily,
                  opacity: tag,
                  transform: `scale(${0.7 + tag * 0.3})`,
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, color: P.dim }}>{md(y.peak)} </span>
                <span style={{ fontSize: 36, fontWeight: 900, color: L > 0 ? P.red : P.green }}>{signed(L)}</span>
              </div>
              {is24 && (
                <div style={{ position: "absolute", top: rowY(i) - 66, left: X(d) - 500, width: 440, textAlign: "right", fontFamily, fontSize: 30, fontWeight: 900, color: P.red, opacity: hi24 }}>
                  1985년 관측 이후 가장 늦음 →
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Stamp at={380} color={P.green} rotate={-8} style={{ top: 1180, left: 560, fontSize: 48, background: "rgba(255,251,242,0.92)", padding: "8px 30px" }}>
        올해는 제때
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "최근 5년, 설악산 단풍 절정", from: 10, to: 110, em: ["절정"] },
          { text: "2022년부터 4년 내리 평년보다 늦었고", from: 110, to: 220, em: ["늦었고"] },
          { text: "2024년엔 10월 29일, 1985년 관측 이후 가장 늦었습니다", from: 220, to: 340, em: ["10월", "29일,"] },
          { text: `그런데 올해는 10월 ${Number(THIS.peak.split("-")[1])}일, 제때 왔습니다`, from: 340, to: 480, em: ["제때"] },
        ]}
      />
    </>
  );
};

// 4. 9월 전국 평균기온과 절정 지각 일수 (L09 · L10 · L11)
export const WhyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = D.sept.years.map((s) => ({ ...s, late: late(D.seorak.find((y) => y.y === s.y)!.peak) }));
  const bx = 250, tw = 520;
  const tW = (t: number) => ((t - 20) / 5) * tw; // 20℃ ~ 25℃
  const lW = (d: number) => (Math.max(0, d) / 12) * 460; // 0 ~ 12일
  const focus = (y: number) => (y === 2024 ? interpolate(frame, [95, 110, 185, 195], [0, 1, 1, 0], clamp) : y === 2026 ? interpolate(frame, [195, 210], [0, 1], clamp) : 0);
  return (
    <>
      <Title sub="9월 전국 평균기온(기상청) · 설악산 절정 평년 대비">9월이 더웠던 해, 늦게 왔다</Title>
      <div style={{ position: "absolute", top: 365, left: bx + tW(D.sept.normal) - 80, width: 160, textAlign: "center", fontFamily, fontSize: 24, fontWeight: 700, color: P.dim }}>
        평년 {D.sept.normal}℃
      </div>
      <div style={{ position: "absolute", top: 400, left: bx + tW(D.sept.normal), height: 880, borderLeft: `3px dashed ${P.dim}`, opacity: 0.6 }} />
      {rows.map((r, i) => {
        const top = 420 + i * 215;
        const at = 15 + i * 22;
        const g = spring({ frame: frame - at, fps, config: springs.smooth });
        const f = focus(r.y);
        return (
          <div key={r.y} style={{ position: "absolute", top, left: 50, right: 110, height: 190, fontFamily }}>
            <div style={{ position: "absolute", inset: -8, borderRadius: 24, border: `6px solid ${r.y === 2026 ? P.green : P.red}`, opacity: f, background: "rgba(255,251,242,0.6)" }} />
            <div style={{ position: "absolute", top: 50, left: 18, fontFamily: serif, fontSize: 48, fontWeight: 700, color: P.ink }}>{r.y}</div>
            <div style={{ position: "absolute", top: 22, left: bx - 50, height: 62, width: tW(r.t) * g, borderRadius: 14, background: `linear-gradient(90deg, ${P.yellow}, ${P.warm})` }} />
            <div style={{ position: "absolute", top: 26, left: bx - 50 + tW(r.t) * g + 14, fontSize: 44, fontWeight: 900, color: P.warm, opacity: g, whiteSpace: "nowrap" }}>{r.t.toFixed(1)}℃</div>
            <div style={{ position: "absolute", top: 104, left: bx - 50, height: 62, width: Math.max(18, lW(r.late) * g), borderRadius: 14, background: r.late > 0 ? leafColor(0.6 + (r.late / 12) * 0.4) : P.green }} />
            <div style={{ position: "absolute", top: 108, left: bx - 50 + Math.max(18, lW(r.late) * g) + 14, fontSize: 40, fontWeight: 900, color: r.late > 0 ? P.red : P.green, opacity: g, whiteSpace: "nowrap" }}>
              {r.late > 0 ? `${signed(r.late)} 늦게` : `${signed(r.late)} · 제때`}
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "차이는 9월 기온과 같이 움직였습니다", from: 10, to: 95, em: ["9월", "기온"] },
          { text: "9월이 가장 더웠던 2024년(24.7℃)에 가장 늦었고", from: 95, to: 195, em: ["24.7℃)에"] },
          { text: "올해 9월은 21.7℃, 최근 3년보다 0.9~3.0℃ 낮았습니다", from: 195, to: 290, em: ["21.7℃,"] },
          { text: "9월 5~17일엔 찬 공기가 들어와 평년 수준이었죠", from: 290, to: 360, em: ["찬", "공기"] },
        ]}
      />
    </>
  );
};

// 5. 지금: 21개 유명산 상태 (L12 · L13)
export const NowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = (s: number) => D.mountains.filter((m) => m.s === s).length;
  const legend = useIn(110);
  return (
    <>
      <Title sub="기상청 날씨누리 · 10월 23일 기준 · 대략 북→남 순">21개 유명산, 지금은?</Title>
      <div style={{ position: "absolute", top: 1235, left: 60, right: 120, display: "flex", justifyContent: "center", gap: 28, fontFamily, fontSize: 32, fontWeight: 900, opacity: legend }}>
        {[[3, "절정"], [2, "물드는 중"], [1, "아직"]].map(([s, t]) => (
          <span key={s} style={{ color: statusColor(s as number) }}>{`● ${t} ${count(s as number)}`}</span>
        ))}
      </div>
      {D.mountains.map((m, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const at = 8 + i * 4;
        const s = spring({ frame: frame - at, fps, config: springs.snappy });
        const tint = interpolate(frame, [at + 6, at + 26], [0, m.s === 3 ? 1 : m.s === 2 ? 0.62 : 0], clamp);
        const dim = m.s === 1 ? interpolate(frame, [150, 165], [0, 1], clamp) : 0;
        return (
          <div key={m.n} style={{ position: "absolute", top: 360 + row * 124, left: 60 + col * 290, width: 280, height: 116, display: "flex", alignItems: "center", gap: 10, fontFamily, opacity: s, transform: `scale(${0.6 + s * 0.4})` }}>
            <Leaf size={84} color={leafColor(tint)} rotate={-12 + (i % 3) * 10} />
            <div>
              <div style={{ fontSize: 36, fontWeight: 900, color: P.ink, textDecoration: dim ? "underline" : "none", textDecorationColor: P.green, textDecorationThickness: 5 }}>{m.n}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: statusColor(m.s) }}>{m.s === 3 ? `절정 ${m.peak}` : m.s === 2 ? "물드는 중" : "단풍 전"}</div>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: `10월 23일 기준, 21개 산 중 절정은 ${count(3)}곳`, from: 10, to: 140, em: [`${count(3)}곳`] },
          { text: `${count(2)}곳은 물드는 중, 내장산·두륜산은 아직입니다`, from: 140, to: 270, em: ["내장산·두륜산은"] },
        ]}
      />
    </>
  );
};

// 6. 남쪽 예측 (L14) — 산림청 · 50% 기준
export const OutlookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Drift seed="o" n={6} opacity={0.25} />
      <Title sub="산림청 예측 · 나뭇잎 절반이 물든 날 기준">남쪽은 이제부터</Title>
      {D.forecast.map((f, i) => {
        const at = 20 + i * 30;
        const s = spring({ frame: frame - at, fps, config: springs.snappy });
        return (
          <div key={f.n} style={{ position: "absolute", top: 400 + i * 260, left: 110 + i * 70, width: 640, height: 210, borderRadius: 30, background: P.card, boxShadow: "0 12px 30px rgba(59,42,30,0.15)", display: "flex", alignItems: "center", gap: 30, padding: "0 40px", fontFamily, opacity: s, transform: `translateY(${(1 - s) * -80}px)` }}>
            <Leaf size={130} color={leafColor(0.5 + i * 0.2)} rotate={-15 + i * 12} />
            <div>
              <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, color: P.ink }}>{f.n}</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: P.red }}>{f.d}</div>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "산림청 예측 절정: 속리산 10/28 · 내장산 11/4 · 한라산 11/6", from: 10, to: 70, em: ["11/4", "11/6"] },
          { text: "기상청(80%)과 기준이 달라 날짜가 다를 수 있어요", from: 70, to: 120, em: ["기준이"] },
        ]}
      />
    </>
  );
};

// 7. 마무리: 요약 · 출처
export const OutroScene: React.FC = () => {
  const lines = [
    `설악산 절정 10.16 · 평년 10.17`,
    `2024년엔 10.29 · 관측 이후 가장 늦음`,
    `올해 9월 21.7℃ · 최근 3년보다 낮음`,
  ];
  return (
    <>
      <Drift seed="e" n={6} opacity={0.2} />
      {lines.map((t, i) => (
        <OutroLine key={i} at={6 + i * 10} top={380 + i * 150} text={t} />
      ))}
      <div style={{ position: "absolute", top: 900, left: 80, right: 130, fontFamily, fontSize: 26, fontWeight: 700, color: P.dim, lineHeight: 1.6, wordBreak: "keep-all" }}>
        자료: 기상청 날씨누리 유명산 단풍현황(2026.10.23) · 기상청 설악산 단풍 보도자료(2023~2026) · 기상청 2026년 9월 기후특성 · 산림청 2026 단풍절정 예측지도(보도 인용)
        <br />※ 평년 대비 일수는 직접 계산 · 9월 기온은 전국 평균
      </div>
      <Caption
        bottom={400}
        lines={[{ text: "단풍 구경 가기 전엔 날씨누리에서 확인하세요", from: 5, to: 90, em: ["날씨누리"] }]}
      />
    </>
  );
};

const OutroLine: React.FC<{ at: number; top: number; text: string }> = ({ at, top, text }) => {
  const s = useIn(at);
  return (
    <div style={{ position: "absolute", top, left: 80, right: 130, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * 60}px)` }}>
      <Leaf size={70} color={P.red} />
      <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, color: P.ink, wordBreak: "keep-all" }}>{text}</div>
    </div>
  );
};
