import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "./theme";

// Extremes 롱폼(가로 1920×1080) — content/<편>/script/shots.json (kind: "long") + timings.json(음성 길이)이 정하고 이 파일이 그린다.
// 장면 종류: photo(켄 번즈 + 카운터 + 로그 속도 눈금 + 읽을거리) · bars · wall(속도-에너지 곡선) · ladder(로그 사다리) · solar(보이저 vs 빛) · end
// 한 장면 = 내레이션 줄 여러 개. 자막은 문장 단위로 나눠 글자 수 비율로 시간을 나눈다.

export const LW = 1920;
export const LH = 1080;
const LEAD = 0.5, GAP = 0.45, TAIL = 0.9;

type LineDef = { en: string; ko: string };
export type LongData = {
  kind: "long";
  fps: number;
  bgm?: string;
  voice: { name: string; dir: string };
  no: string;
  title: { en: string; ko: string };
  accent: string;
  lines: Record<string, LineDef>;
  scenes: any[];
};
export type Timings = Record<string, number>;

const lineDur = (t: Timings, d: LongData, id: string) => t[id] ?? d.lines[id].en.split(/\s+/).length / 2.4;
export const layout = (d: LongData, t: Timings) => {
  let at = 0;
  return d.scenes.map((s) => {
    let o = LEAD;
    const lines = s.lines.map((id: string) => {
      const start = o;
      const dur = lineDur(t, d, id);
      o += dur + GAP;
      return { id, start, dur };
    });
    const dur = o - GAP + TAIL;
    const r = { ...s, from: at, dur, linesT: lines };
    at += dur;
    return r;
  });
};
export const totalLongFrames = (d: LongData, t: Timings) => {
  const L = layout(d, t);
  const last = L[L.length - 1];
  return Math.ceil((last.from + last.dur) * d.fps);
};

const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number, dp = 0) => n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

// ── 공통: 상단 브랜드 · 자막 · 크레딧 ──
const Brand: React.FC<{ d: LongData }> = ({ d }) => (
  <div style={{ position: "absolute", left: 64, top: 44, fontFamily, color: C.text }}>
    <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 6, color: d.accent }}>EXTREMES <span style={{ color: C.text, letterSpacing: 2, marginLeft: 12 }}>{d.no}</span></div>
    <div style={{ marginTop: 6, fontSize: 34, fontWeight: 900, textShadow: "0 2px 12px #000" }}>{d.title.en}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: d.accent, textShadow: "0 2px 10px #000" }}>{d.title.ko}</div>
  </div>
);

const sentences = (s: string) => s.split(/(?<=[.?!])\s+/).filter(Boolean);
const Subtitle: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const cur = sc.linesT.find((l: any) => t >= l.start - 0.05 && t < l.start + l.dur + GAP * 0.6);
  if (!cur) return null;
  const def = d.lines[cur.id];
  const en = sentences(def.en), ko = sentences(def.ko);
  const total = en.reduce((a, s) => a + s.length, 0);
  let acc = 0, idx = en.length - 1;
  const local = t - cur.start;
  for (let i = 0; i < en.length; i++) {
    acc += en[i].length;
    if (local < (acc / total) * cur.dur) { idx = i; break; }
  }
  const ktotal = ko.reduce((a, s) => a + s.length, 0);
  let kacc = 0, kidx = ko.length - 1;
  for (let i = 0; i < ko.length; i++) {
    kacc += ko[i].length;
    if (local < (kacc / ktotal) * cur.dur) { kidx = i; break; }
  }
  const koText = ko[kidx];
  const op = interpolate(local, [-0.05, 0.15], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 86, textAlign: "center", fontFamily, opacity: op }}>
      <div style={{ display: "inline-block", maxWidth: 1500, padding: "12px 28px", background: "rgba(2,8,20,0.62)", borderRadius: 14 }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.text, lineHeight: 1.25, textShadow: "0 2px 10px #000" }}>{en[idx]}</div>
        {koText ? <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700, color: d.accent, lineHeight: 1.3 }}>{koText}</div> : null}
      </div>
    </div>
  );
};
const Credit: React.FC<{ text?: string }> = ({ text }) =>
  text ? <div style={{ position: "absolute", left: 64, bottom: 26, fontFamily, fontSize: 19, fontWeight: 500, color: "rgba(244,247,251,0.6)" }}>{text}</div> : null;

// ── 로그 속도 눈금 (오른쪽) ──
const GMIN = 0.5, GMAX = 400000;
const gy = (v: number, y0: number, y1: number) => y1 - ((Math.log10(Math.max(v, GMIN)) - Math.log10(GMIN)) / (Math.log10(GMAX) - Math.log10(GMIN))) * (y1 - y0);
const SpeedGauge: React.FC<{ value: number; accent: string }> = ({ value, accent }) => {
  const y0 = 150, y1 = 760, x = 1800;
  const ticks = [1, 10, 100, 1000, 10000, 100000];
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <div style={{ position: "absolute", left: x, top: y0, width: 4, height: y1 - y0, background: "rgba(244,247,251,0.25)", borderRadius: 2 }} />
      {ticks.map((v) => (
        <div key={v} style={{ position: "absolute", left: x - 90, top: gy(v, y0, y1) - 11, width: 84, textAlign: "right", fontSize: 20, fontWeight: 700, color: "rgba(244,247,251,0.55)" }}>{fmt(v)}</div>
      ))}
      <div style={{ position: "absolute", left: x - 150, top: gy(299792, y0, y1) - 34, width: 200, textAlign: "right", fontSize: 24, fontWeight: 900, color: accent }}>LIGHT ▸</div>
      <div style={{ position: "absolute", left: x - 8, top: gy(299792, y0, y1) - 3, width: 20, height: 6, background: accent, borderRadius: 3 }} />
      <div style={{ position: "absolute", left: x - 12, top: gy(value, y0, y1) - 12, width: 28, height: 24, background: "#FF9F43", borderRadius: 12, boxShadow: "0 0 18px #FF9F43" }} />
      <div style={{ position: "absolute", left: x - 240, top: y1 + 14, width: 250, textAlign: "right", fontSize: 20, fontWeight: 700, color: "rgba(244,247,251,0.6)" }}>km/s · log scale</div>
    </div>
  );
};


// ── 클립 시퀀스: 장면 안에서 사진 · 영상 클립이 번갈아 바뀐다 (약 4초마다). 컷 효과 없이 부드러운 디졸브 + 아주 느린 확대. ──
type Clip = { f: string; vs?: number; ill?: boolean; fx?: number; fy?: number; z0?: number; z1?: number; w?: number };
// 약식 "파일#fx,fy,z0,z1,w" (예: "gemini-a.png#0.3,0.4,1.0,1.25") — 같은 그림을 와이드 → 디테일 크롭으로 나눠 쓴다
const asClip = (c: any): Clip => {
  if (typeof c !== "string") return c;
  const [f, rest] = c.split("#");
  if (!rest) return { f };
  const [fx, fy, z0, z1, w] = rest.split(",").map((x) => (x === "" ? undefined : +x));
  return { f, fx, fy, z0, z1, w };
};
const isAi = (c: Clip) => c.f.startsWith("gemini-") || c.f.startsWith("flow-"); // AI 생성 그림 · 영상은 화면에 표시한다
const SegMedia: React.FC<{ c: Clip; lt: number; seg: number; code: string; k: number }> = ({ c, lt, seg, code, k }) => {
  const { fps } = useVideoConfig();
  const p = Math.min(1, lt / seg);
  const isVid = c.f.endsWith(".mp4");
  const z = c.z0 !== undefined ? c.z0 + p * ((c.z1 ?? c.z0 + 0.1) - c.z0) : 1.05 + p * (isVid ? 0.05 : 0.12);
  const fx = c.fx ?? (k % 2 ? 0.58 : 0.42);
  const fy = c.fy ?? 0.5;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` };
  return isVid ? <OffthreadVideo src={staticFile(`art/${code}/${c.f}`)} muted startFrom={Math.round((c.vs ?? 0) * fps)} style={st} /> : <Img src={staticFile(`art/${code}/${c.f}`)} style={st} />;
};
const ClipSeq: React.FC<{ sc: any; t: number; code: string; fps?: number }> = ({ sc, t, code }) => {
  const pool: Clip[] = (sc.clips ?? [sc.image]).map(asClip);
  const SEG = sc.seg ?? 4;
  // exact: 클립을 한 번씩만, 가중치(w) 비율로 장면 길이를 나눈다 (같은 그림이 되풀이되지 않는다)
  const wts = sc.exact ? pool.map((c) => c.w ?? 1) : null;
  const wsum = wts ? wts.reduce((a, b) => a + b, 0) : 0;
  const starts = wts ? wts.map((_, i) => (sc.dur * wts.slice(0, i).reduce((a, b) => a + b, 0)) / wsum) : [];
  const n = wts ? pool.length : Math.max(pool.length, Math.round(sc.dur / SEG));
  let k = wts ? starts.findIndex((st, i) => t >= st && (i === n - 1 || t < starts[i + 1])) : Math.min(n - 1, Math.floor(t / (sc.dur / n)));
  if (k < 0) k = 0;
  const seg = wts ? (sc.dur * wts[k]) / wsum : sc.dur / n;
  const lt = t - (wts ? starts[k] : k * seg);
  const clipAt = (i: number): Clip => { const c = pool[i % pool.length]; const lap = Math.floor(i / pool.length); return lap ? { ...c, vs: (c.vs ?? 0) + lap * seg, fx: lap % 2 ? 1 - (c.fx ?? 0.42) : c.fx, fy: lap % 2 ? 0.35 : c.fy } : c; };
  const cur = clipAt(k);
  const fade = k > 0 ? interpolate(lt, [0, 0.25], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill>
      {k > 0 && fade < 1 ? <AbsoluteFill><SegMedia c={clipAt(k - 1)} lt={seg} seg={seg} code={code} k={k - 1} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ opacity: fade }}><SegMedia key={k} c={cur} lt={lt} seg={seg} code={code} k={k} /></AbsoluteFill>
      {isAi(cur) ? <div style={{ position: "absolute", right: 0, bottom: 0, width: 420, height: 240, background: "radial-gradient(ellipse at 100% 100%, rgba(2,8,20,1) 0%, rgba(2,8,20,0.96) 30%, rgba(2,8,20,0) 75%)" }} /> : null}
      {cur.ill || isAi(cur) ? <div style={{ position: "absolute", right: 48, top: 40, fontFamily, fontSize: 22, fontWeight: 700, color: "rgba(244,247,251,0.75)", background: "rgba(2,8,20,0.55)", padding: "6px 14px", borderRadius: 8 }}>{isAi(cur) ? "AI-generated illustration · AI 생성 연출" : "Illustrative footage · 연출 화면"}</div> : null}
    </AbsoluteFill>
  );
};

// ── 장면: photo ──
const PhotoScene: React.FC<{ d: LongData; sc: any; t: number; code: string; f: number }> = ({ d, sc, t, code, f }) => {
  const p = Math.min(1, t / sc.dur);
  const z = sc.zoom ? interpolate(p, [0, 1], sc.zoom) : 1.1;
  const fx = +interpolate(p, [0, 1], [sc.focus?.[0] ?? 0.5, (sc.focusTo ?? sc.focus ?? [0.5, 0.5])[0]]);
  const fy = +interpolate(p, [0, 1], [sc.focus?.[1] ?? 0.5, (sc.focusTo ?? sc.focus ?? [0.5, 0.5])[1]]);
  const c = sc.counter;
  const cp = c ? ease(interpolate(t, [c.start ?? 0.5, (c.start ?? 0.5) + (c.dur ?? Math.min(sc.dur * 0.6, 5))], [0, 1], clamp)) : 0;
  const cv = c ? (c.from ?? 0) + ((c.to) - (c.from ?? 0)) * cp : 0;
  const g = sc.gauge;
  const gv = g ? g.from + (g.to - g.from) * ease(interpolate(t, [0.3, sc.dur - 1], [0, 1], clamp)) : 0;
  return (
    <AbsoluteFill>
      <ClipSeq sc={sc} t={t} code={code} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(2,8,20,${0.35 + (sc.tint ?? 0)}) 0%, rgba(2,8,20,${0.1 + (sc.tint ?? 0) * 0.5}) 45%, rgba(2,8,20,0.82) 100%)` }} />
      {sc.big ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily, opacity: interpolate(t, [0.2, 0.9], [0, 1], clamp) }}>
          <div style={{ fontSize: sc.big.size ?? 190, fontWeight: 900, color: C.text, letterSpacing: 6, textShadow: "0 4px 30px #000", whiteSpace: "pre-line", lineHeight: 1.05 }}>{sc.big.text}</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: d.accent }}>{sc.big.sub}</div>
        </div>
      ) : null}
      {c ? (
        <div style={{ position: "absolute", left: 90, top: 300, fontFamily, opacity: interpolate(t, [0.1, 0.6], [0, 1], clamp) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 190, fontWeight: 900, color: C.text, textShadow: "0 4px 30px #000", lineHeight: 1 }}>{fmt(cv, c.dp ?? 0)}</span>
            <span style={{ fontSize: 64, fontWeight: 900, color: d.accent }}>{c.unit}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 38, fontWeight: 700, color: d.accent, textShadow: "0 2px 12px #000" }}>{c.sub}</div>
        </div>
      ) : null}
      {sc.readout
        ? sc.readout.map((r: any, i: number) => {
            const ln = sc.linesT.find((l: any) => l.id === r.line);
            const on = ln && t >= ln.start;
            return on ? (
              <div key={i} style={{ position: "absolute", left: 90, top: 230 + i * 320, fontFamily, opacity: interpolate(t, [ln.start, ln.start + 0.5], [0, 1], clamp) }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: d.accent, letterSpacing: 3 }}>{r.label}</div>
                <div style={{ fontSize: 130, fontWeight: 900, color: C.text, textShadow: "0 4px 26px #000" }}>{r.value}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(244,247,251,0.75)" }}>of the speed of light</div>
              </div>
            ) : null;
          })
        : null}
      {sc.id === "lhc" ? (() => {
        const ln = sc.linesT.find((l: any) => l.id === "L13");
        return ln && t >= ln.start ? (
          <div style={{ position: "absolute", right: 90, top: 300, fontFamily, textAlign: "right", opacity: interpolate(t, [ln.start, ln.start + 0.5], [0, 1], clamp) }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: "#FF9F43" }}>15× energy</div>
            <div style={{ fontSize: 120, fontWeight: 900, color: C.text }}>+0.0002%</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: d.accent }}>speed gained</div>
          </div>
        ) : null;
      })() : null}
      {sc.facts
        ? sc.facts.map((fa: any, i: number) => {
            const st = fa.at * sc.dur;
            return (
              <div key={i} style={{ position: "absolute", left: 90 + i * 0, top: 190 + i * 210, fontFamily, opacity: interpolate(t, [st, st + 0.5], [0, 1], clamp), transform: `translateX(${interpolate(t, [st, st + 0.5], [-40, 0], clamp)}px)` }}>
                <span style={{ fontSize: 120, fontWeight: 900, color: C.text, textShadow: "0 4px 26px #000" }}>{fa.big}</span>
                <span style={{ marginLeft: 22, fontSize: 38, fontWeight: 800, color: d.accent, textShadow: "0 2px 12px #000, 0 0 8px #000, 0 0 4px #000" }}>{fa.sub}</span>
              </div>
            );
          })
        : null}
      {g ? <SpeedGauge value={gv} accent={d.accent} /> : null}
    </AbsoluteFill>
  );
};

// ── 장면: bars (파커 vs 빛) ──
const BarsScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const W0 = 1500, max = sc.bars[sc.bars.length - 1].value;
  const reveal = ease(interpolate(t, [1.5, 5.5], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #0B2038 0%, #020812 80%)", fontFamily }}>
      {sc.bars.map((b: any, i: number) => {
        const w = Math.max(b.value / max, 0.0021) * W0 * (i === 0 ? 1 : reveal);
        const on = i === 0 ? interpolate(t, [0.8, 1.4], [0, 1], clamp) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 210, top: 290 + i * 230, opacity: on }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{b.label} <span style={{ color: b.color, marginLeft: 16 }}>{b.text}</span></div>
            <div style={{ marginTop: 14, width: W0, height: 56, background: "rgba(244,247,251,0.07)", borderRadius: 8 }}>
              <div style={{ width: i === 0 ? Math.max(w, 5) : w, height: 56, background: b.color, borderRadius: 8, boxShadow: `0 0 24px ${b.color}` }} />
            </div>
          </div>
        );
      })}
      {sc.big ? (
        <div style={{ position: "absolute", left: 210, top: 150, opacity: interpolate(t, [5.5, 6.5], [0, 1], clamp) }}>
          <span style={{ fontSize: 120, fontWeight: 900, color: "#FF9F43" }}>{sc.big.text}</span>
          <span style={{ marginLeft: 20, fontSize: 40, fontWeight: 800, color: d.accent }}>{sc.big.sub}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 장면: wall (속도-에너지 곡선, 에너지는 계속 늘어도 속도는 천장) ──
const WallScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const X0 = 260, X1 = 1600, Y0 = 220, Y1 = 760, E0 = 0.938, EM = 7000;
  const vOf = (E: number) => { const g = Math.max(E / E0, 1); return Math.sqrt(1 - 1 / (g * g)); };
  const xOf = (E: number) => X0 + (Math.log(E / E0) / Math.log(EM / E0)) * (X1 - X0);
  const yOf = (v: number) => Y1 - v * (Y1 - Y0);
  const prog = ease(interpolate(t, [0.8, 6], [0, 1], clamp));
  const pts: string[] = [];
  const N = 260;
  for (let i = 0; i <= N * prog; i++) {
    const E = E0 * Math.pow(EM / E0, i / N);
    pts.push(`${xOf(E).toFixed(1)},${yOf(vOf(E)).toFixed(1)}`);
  }
  const markers = [{ E: 450, label: "450 GeV · 99.9997828%", dy: 90 }, { E: 7000, label: "7,000 GeV · 99.9999991%", dy: 160 }];
  const wallOn = interpolate(t, [sc.linesT[0].start + 2, sc.linesT[0].start + 3], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #0B2038 0%, #020812 80%)", fontFamily }}>
      <svg width={LW} height={LH} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="rgba(244,247,251,0.35)" strokeWidth={3} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="rgba(244,247,251,0.35)" strokeWidth={3} />
        <line x1={X0} y1={yOf(1)} x2={X1} y2={yOf(1)} stroke={d.accent} strokeWidth={4} strokeDasharray="14 10" opacity={0.9} />
        <polyline points={pts.join(" ")} fill="none" stroke="#FF9F43" strokeWidth={8} strokeLinecap="round" />
        {markers.map((m, i) => (prog > 0.97 ? <circle key={i} cx={xOf(m.E)} cy={yOf(vOf(m.E))} r={11} fill="#fff" /> : null))}
      </svg>
      <div style={{ position: "absolute", left: X0 - 10, top: yOf(1) + 16, fontSize: 30, fontWeight: 900, color: d.accent }}>SPEED OF LIGHT · 100%</div>
      <div style={{ position: "absolute", left: X0, top: Y1 + 18, fontSize: 28, fontWeight: 700, color: "rgba(244,247,251,0.7)" }}>energy put into the proton (log scale)  →  7,000 GeV</div>
      <div style={{ position: "absolute", left: 60, top: Y0 + 120, fontSize: 28, fontWeight: 700, color: "rgba(244,247,251,0.7)", transform: "rotate(-90deg)", transformOrigin: "left top", whiteSpace: "nowrap", marginTop: 380 }}>speed (% of light)</div>
      {markers.map((m, i) =>
        prog > 0.97 ? (
          <div key={i} style={{ position: "absolute", left: xOf(m.E) - 440, top: yOf(vOf(m.E)) + m.dy, width: 460, textAlign: "right", fontSize: 30, fontWeight: 800, color: C.text, opacity: interpolate(t, [6.2 + i, 7 + i], [0, 1], clamp) }}>{m.label}</div>
        ) : null,
      )}
      <div style={{ position: "absolute", left: 700, top: 420, fontSize: 150, fontWeight: 900, color: "#FF5C5C", opacity: wallOn, letterSpacing: 8, textShadow: "0 0 40px #FF5C5C88" }}>THE WALL</div>
    </AbsoluteFill>
  );
};

// ── 장면: ladder (로그 사다리) ──
const LadderScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const y0 = 140, y1 = 800, xa = 640;
  const items = [
    { v: 11.1, name: "Apollo 10", txt: "11 km/s", col: "#8FE388", at: 4, dy: 26 },
    { v: 17, name: "Voyager 1", txt: "17 km/s", col: "#FFD166", at: 7, dy: -26 },
    { v: 192, name: "Parker Solar Probe", txt: "192 km/s", col: "#FF9F43", at: 11 },
    { v: 299792, name: "LIGHT", txt: "299,792 km/s", col: d.accent, at: 15 },
  ];
  const ticks = [1, 10, 100, 1000, 10000, 100000];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #0B2038 0%, #020812 80%)", fontFamily }}>
      <div style={{ position: "absolute", left: xa, top: y0, width: 6, height: y1 - y0, background: "rgba(244,247,251,0.3)" }} />
      {ticks.map((v) => (
        <React.Fragment key={v}>
          <div style={{ position: "absolute", left: xa - 14, top: gy(v, y0, y1) - 2, width: 34, height: 4, background: "rgba(244,247,251,0.5)" }} />
          <div style={{ position: "absolute", left: xa - 230, top: gy(v, y0, y1) - 16, width: 200, textAlign: "right", fontSize: 26, fontWeight: 700, color: "rgba(244,247,251,0.55)" }}>{fmt(v)}</div>
        </React.Fragment>
      ))}
      {items.map((it, i) => {
        const o = interpolate(t, [it.at, it.at + 0.6], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: xa - 14, top: gy(it.v, y0, y1) - 17, opacity: o, transform: `translateX(${interpolate(o, [0, 1], [-30, 0])}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 36, height: 34, borderRadius: 18, background: it.col, boxShadow: `0 0 22px ${it.col}` }} />
            <div style={{ position: "absolute", left: 60, top: -8 + ((it as any).dy ?? 0), whiteSpace: "nowrap", fontSize: 42, fontWeight: 900, color: it.col }}>{it.name} <span style={{ color: C.text, marginLeft: 12 }}>{it.txt}</span></div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1180, top: 150, width: 560, fontSize: 38, fontWeight: 800, color: C.text, lineHeight: 1.3, opacity: interpolate(t, [17, 18], [0, 1], clamp) }}>Each rung is 10× higher.<br /><span style={{ color: d.accent }}>Our fastest machine is still near the bottom.</span></div>
    </AbsoluteFill>
  );
};

// ── 장면: solar (보이저 49년 vs 빛 하루) ──
const SolarScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const XA = 220, XB = 1700, AU = (XB - XA) / 175, y = 470;
  const x = (au: number) => XA + au * AU;
  const l18 = sc.linesT[0], l19 = sc.linesT[1];
  const vp = ease(interpolate(t, [l18.start + 0.4, l18.start + l18.dur - 0.5], [0, 1], clamp));
  const vAU = 173.2 * vp;
  const years = Math.round(49 * vp);
  const bp = interpolate(t, [l19.start + 0.3, l19.start + 2.3], [0, 1], clamp);
  const beamAU = 173.2 * Easing.in(Easing.quad)(bp);
  const planets = [{ n: "Earth", au: 1 }, { n: "Jupiter", au: 5.2 }, { n: "Saturn", au: 9.5 }, { n: "Neptune", au: 30.1 }];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 20% 50%, #1B2A44 0%, #020812 75%)", fontFamily }}>
      <div style={{ position: "absolute", left: XA, top: y, width: XB - XA, height: 3, background: "rgba(244,247,251,0.2)" }} />
      <div style={{ position: "absolute", left: x(0) - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: "#FFC93C", boxShadow: "0 0 50px #FF9F43" }} />
      {planets.filter((p) => p.n !== "Earth" && p.n !== "Jupiter" && p.n !== "Saturn").map((p) => (
        <React.Fragment key={p.n}>
          <div style={{ position: "absolute", left: x(p.au) - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: "#8FB8FF" }} />
          <div style={{ position: "absolute", left: x(p.au) - 60, top: y + 22 + (p.n === "Earth" ? 0 : 0), width: 120, textAlign: "center", fontSize: 22, fontWeight: 700, color: "rgba(244,247,251,0.6)" }}>{p.n}</div>
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: x(173.2) - 2, top: y - 120, width: 4, height: 240, background: d.accent, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: x(173.2) - 330, top: y - 190, width: 340, textAlign: "right", fontSize: 30, fontWeight: 900, color: d.accent }}>1 LIGHT-DAY<br /><span style={{ fontSize: 24, color: C.text }}>≈ 173 × Earth–Sun</span></div>
      <div style={{ position: "absolute", left: x(vAU) - 14, top: y - 14, width: 28, height: 28, borderRadius: 14, background: "#FF9F43", boxShadow: "0 0 26px #FF9F43" }} />
      <div style={{ position: "absolute", left: x(vAU) - 120, top: y + 70, width: 240, textAlign: "center", fontSize: 30, fontWeight: 900, color: "#FF9F43" }}>Voyager 1</div>
      {bp > 0 ? <div style={{ position: "absolute", left: XA, top: y - 5, width: Math.max(8, x(beamAU) - XA), height: 10, background: `linear-gradient(90deg, transparent, ${d.accent})`, borderRadius: 5, boxShadow: `0 0 36px ${d.accent}` }} /> : null}
      <div style={{ position: "absolute", left: 220, top: 120, fontSize: 130, fontWeight: 900, color: "#FF9F43" }}>{years} <span style={{ fontSize: 56 }}>years</span></div>
      <div style={{ position: "absolute", left: 220, top: 780, fontSize: 130, fontWeight: 900, color: d.accent, opacity: interpolate(t, [l19.start, l19.start + 0.6], [0, 1], clamp) }}>{bp >= 1 ? "1 day" : `${Math.round(24 * Math.min(1, bp))} h`}</div>
    </AbsoluteFill>
  );
};

// ── 장면: recopy (답안 베껴 쓰기 도식: 이름 → 번호, 원본 → 붉은 사본) ──
const INK = "#2B2118", PAPER = "#E9DFC8", RED = "#C8402B";
const wavyL = (x0: number, x1: number, y: number, amp: number, seed: number) => {
  let p = `M${x0} ${y}`;
  for (let i = 1; i <= 24; i++) p += ` L${(x0 + ((x1 - x0) * i) / 24).toFixed(1)} ${(y + Math.sin(i * 1.7 + seed) * amp * (0.5 + 0.5 * Math.sin(i * 0.9 + seed * 2))).toFixed(1)}`;
  return p;
};
const RecopyScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const a = sc.linesT[0].start, b = sc.linesT[1].start;
  const draw = (at: number, du = 0.5) => interpolate(t, [at, at + du], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dim = interpolate(t, [b + 3.2, b + 4], [1, 0.35], clamp);
  const num = draw(a + 2.2, 0.6);
  const rows = 8;
  const lab = (txt: string, x: number, col: string, at: number) => <text x={x} y={800} textAnchor="middle" fontFamily={fontFamily} fontSize={34} fontWeight={900} fill={col} opacity={draw(at, 0.4)}>{txt}</text>;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #17120E 0%, #0A0807 100%)", fontFamily }}>
      <svg width={LW} height={LH} style={{ position: "absolute", inset: 0 }}>
        {[{ x: 260, o: dim }, { x: 1160, o: 1 }].map((s, k) => (
          <g key={k} opacity={s.o}>
            <rect x={s.x + 10} y={182} width={500} height={580} rx={6} fill="rgba(0,0,0,0.45)" />
            <rect x={s.x} y={170} width={500} height={580} rx={6} fill={PAPER} />
          </g>
        ))}
        {/* 원본: 이름 칸 + 필체 */}
        <g opacity={dim}>
          <rect x={260} y={170} width={500} height={86} rx={6} fill="#D8CBA8" stroke={INK} strokeWidth={3} />
          <path d={wavyL(300, 620, 214, 14, 1.3)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={1 - num} />
          <text x={510} y={228} textAnchor="middle" fontFamily={fontFamily} fontSize={46} fontWeight={900} fill={RED} opacity={num}>No. 0417</text>
          {Array.from({ length: rows }).map((_, i) => (
            <path key={i} d={wavyL(295, 725, 300 + i * 54, i % 3 === 0 ? 20 : 9, i * 2.3)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          ))}
        </g>
        {/* 사본: 붉은 줄 */}
        {Array.from({ length: rows }).map((_, i) => (
          <path key={i} d={`M1195 ${300 + i * 54} L${1195 + 430 * draw(b + 1.2 + i * 0.28, 0.4)} ${300 + i * 54}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
        ))}
        <path d="M820 460 L1090 460 M1050 430 L1095 460 L1050 490" fill="none" stroke={d.accent} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={draw(b + 0.8, 0.3)} />
        <g opacity={1 - num}>{lab("Original · 원본", 510, C.text, 0.6)}</g>
        {lab("Red copy · 붉은 사본 (examiners read this)", 1410, RED, b + 1.4)}
        <g opacity={num}>{lab("Name replaced by a number · 이름 → 번호", 510, d.accent, a + 2.4)}</g>
      </svg>
    </AbsoluteFill>
  );
};

// ── 장면: funnel (큰 수 → 작은 수로 걸러지는 흐름) ──
const FunnelScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const ln = sc.linesT;
  const at = [ln[0].start + 0.3, ln[1].start + 0.3, ln[1].start + (ln[1].dur * 0.6)];
  const wd = [1500, 760, 220];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A1A0E 0%, #0A0807 80%)", fontFamily }}>
      {sc.steps.map((s: any, i: number) => {
        const o = interpolate(t, [at[i], at[i] + 0.7], [0, 1], clamp);
        const w = wd[i] * ease(interpolate(t, [at[i], at[i] + 1.1], [0, 1], clamp));
        return (
          <div key={i} style={{ position: "absolute", left: 210, top: 190 + i * 215, opacity: o }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
              <span style={{ fontSize: 112, fontWeight: 900, color: s.c, textShadow: "0 4px 24px #000", lineHeight: 1 }}>{s.n}</span>
              <span style={{ fontSize: 34, fontWeight: 800, color: C.text }}>{s.l}</span>
            </div>
            <div style={{ marginTop: 14, width: w, height: 26, background: s.c, borderRadius: 13, boxShadow: `0 0 22px ${s.c}` }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 120, top: 150, fontSize: 26, fontWeight: 700, color: "rgba(244,247,251,0.55)" }}>bar widths not to scale · 막대 길이는 비율이 아님</div>
    </AbsoluteFill>
  );
};

// ── 장면: compare2 (두 사건을 좌우로 비교: 배경 그림 + 숫자 3줄) ──
const Compare2Scene: React.FC<{ d: LongData; sc: any; t: number; code: string }> = ({ d, sc, t, code }) => (
  <AbsoluteFill style={{ background: "#0A0807", fontFamily }}>
    {[sc.left, sc.right].map((p: any, k: number) => {
      const ln = sc.linesT.find((l: any) => l.id === p.line);
      const o = ln ? interpolate(t, [ln.start, ln.start + 0.6], [0, 1], clamp) : 1;
      return (
        <div key={k} style={{ position: "absolute", left: k * 960, top: 0, width: 960, height: LH, overflow: "hidden", opacity: k === 0 ? Math.max(o, 0.0) : o }}>
          <Img src={staticFile(`art/${code}/${p.img}`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + interpolate(t, [0, sc.dur], [0, 0.08], clamp)})` }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,7,0.82) 0%, rgba(10,8,7,0.7) 55%, rgba(10,8,7,0.9) 100%)" }} />
          <div style={{ position: "absolute", left: 70, top: 190 }}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 4, color: d.accent }}>{p.title}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(244,247,251,0.75)" }}>{p.ko}</div>
          </div>
          {p.rows.map((r: string[], i: number) => (
            <div key={i} style={{ position: "absolute", left: 70, top: 300 + i * 170, opacity: interpolate(t, [(ln?.start ?? 0) + 0.8 + i * 1.6, (ln?.start ?? 0) + 1.4 + i * 1.6], [0, 1], clamp) }}>
              <div style={{ fontSize: 104, fontWeight: 900, color: C.text, textShadow: "0 4px 24px #000", lineHeight: 1 }}>{r[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: d.accent }}>{r[1]}</div>
            </div>
          ))}
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: LH, background: "rgba(244,247,251,0.35)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontSize: 34, fontWeight: 900, color: d.accent, opacity: 0 }}>vs</div>
  </AbsoluteFill>
);

// ── 장면: timeline (연표 마무리) ──
const TimelineScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const n = sc.points.length;
  const X0 = 230, X1 = 1690;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A1A0E 0%, #0A0807 80%)", fontFamily }}>
      <div style={{ position: "absolute", left: X0, top: 470, width: (X1 - X0) * interpolate(t, [0.4, sc.dur - 1], [0, 1], clamp), height: 6, background: d.accent, borderRadius: 3 }} />
      {sc.points.map((p: any, i: number) => {
        const x = X0 + ((X1 - X0) * i) / (n - 1);
        const at = 0.8 + (i * (sc.dur - 2.6)) / (n - 1);
        const o = interpolate(t, [at, at + 0.6], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: x - 170, top: 330, width: 340, textAlign: "center", opacity: o, transform: `translateY(${interpolate(o, [0, 1], [24, 0])}px)` }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: C.text, textShadow: "0 3px 16px #000" }}>{p.y}</div>
            <div style={{ height: 120 }} />
            <div style={{ position: "absolute", left: 152, top: 128, width: 36, height: 36, borderRadius: 18, background: d.accent, boxShadow: `0 0 24px ${d.accent}` }} />
            <div style={{ marginTop: 2, fontSize: 28, fontWeight: 700, color: d.accent }}>{p.s}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── 장면: end ──
const EndScene: React.FC<{ d: LongData; sc: any; t: number }> = ({ d, sc, t }) => {
  const l21 = sc.linesT[1] ?? { start: (sc.linesT[0]?.start ?? 0) + 2 };
  const on = interpolate(t, [l21.start, l21.start + 0.8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: sc.endBg, fontFamily }}>
      <div style={{ position: "absolute", left: 160, top: 250, opacity: interpolate(t, [0.3, 1.2], [0, 1], clamp) }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: C.text, lineHeight: 1.15, whiteSpace: "pre-line" }}>{sc.askEn}</div>
        <div style={{ marginTop: 18, fontSize: 48, fontWeight: 800, color: d.accent }}>{sc.askKo}</div>
      </div>
      <div style={{ position: "absolute", left: 160, top: 590, opacity: on, padding: "26px 40px", border: `3px solid ${d.accent}`, borderRadius: 18, background: "rgba(2,8,20,0.6)" }}>
        {sc.next ? (
          <>
            <div style={{ fontSize: 28, fontWeight: 800, color: d.accent, letterSpacing: 4 }}>NEXT</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: C.text }}>{sc.next.en}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: d.accent }}>{sc.next.ko} · 구독하면 이어서 보여요</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 56, fontWeight: 900, color: C.text }}>{sc.sub?.en}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: d.accent }}>{sc.sub?.ko}</div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Long: React.FC<{ data: LongData; timings: Timings; code: string }> = ({ data, timings, code }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const L = layout(data, timings);
  const now = frame / fps;
  const sc = L.find((s) => now >= s.from && now < s.from + s.dur) ?? L[L.length - 1];
  const t = now - sc.from;
  const fade = Math.min(interpolate(t, [0, 0.2], [0, 1], clamp), interpolate(t, [sc.dur - 0.2, sc.dur], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ background: "#020812" }}>
      <AbsoluteFill style={{ opacity: Math.max(fade, sc.type === "end" ? interpolate(t, [0, 0.4], [0, 1], clamp) : 0) }}>
        {sc.type === "photo" ? <PhotoScene d={data} sc={sc} t={t} code={code} f={frame} /> : null}
        {sc.type === "bars" ? <BarsScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "wall" ? <WallScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "ladder" ? <LadderScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "solar" ? <SolarScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "recopy" ? <RecopyScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "funnel" ? <FunnelScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "compare2" ? <Compare2Scene d={data} sc={sc} t={t} code={code} /> : null}
        {sc.type === "timeline" ? <TimelineScene d={data} sc={sc} t={t} /> : null}
        {sc.type === "end" ? <EndScene d={data} sc={sc} t={t} /> : null}
        <Brand d={data} />
        <Subtitle d={data} sc={sc} t={t} />
        <Credit text={sc.credit} />
      </AbsoluteFill>
      {L.flatMap((s) =>
        s.linesT.map((l: any) => (
          <Sequence key={l.id} from={Math.round((s.from + l.start) * fps)} durationInFrames={Math.ceil(l.dur * fps) + 6}>
            <Audio src={staticFile(`voice/${data.voice.dir}/${l.id}.wav`)} volume={1} />
          </Sequence>
        )),
      )}
      {data.bgm ? <Audio src={staticFile(data.bgm)} volume={(f) => 0.16 * Math.min(1, (durationInFrames - f) / (fps * 2.5), f / (fps * 0.5))} /> : null}
    </AbsoluteFill>
  );
};

// 롱폼 썸네일 1280×720: data.thumb { image, focus, zoom, en, ko, tag }
export const LongThumb: React.FC<{ data: any; code: string }> = ({ data, code }) => {
  const t = data.thumb;
  const [fx, fy] = t.focus ?? [0.5, 0.5];
  return (
    <AbsoluteFill style={{ background: "#020812", fontFamily }}>
      <Img src={staticFile(`art/${code}/${t.image}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `scale(${t.zoom ?? 1.2})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(2,8,20,0.88) 0%, rgba(2,8,20,0.35) 60%, rgba(2,8,20,0.1) 100%)" }} />
      <div style={{ position: "absolute", left: 60, top: 90, width: 760 }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 6, color: data.accent }}>EXTREMES · {data.no}</div>
        <div style={{ marginTop: 14, fontSize: 112, fontWeight: 900, color: "#F4F7FB", lineHeight: 1.02, whiteSpace: "pre-line", textShadow: "0 4px 24px #000" }}>{t.en}</div>
        <div style={{ marginTop: 22, fontSize: 52, fontWeight: 900, color: data.accent }}>{t.ko}</div>
      </div>
    </AbsoluteFill>
  );
};
