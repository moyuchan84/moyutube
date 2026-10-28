import { loadFont as loadRusso } from "@remotion/google-fonts/RussoOne";
import { loadFont as loadSun } from "@remotion/google-fonts/Sunflower";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import D from "../../../../content/sidecar/script/data.json";
import TL from "../../../../content/sidecar/script/timeline.json";

// 2026-10-28 코스피 6,012 · 올해 사이드카 54번째 (브리프: content/sidecar/plan.md)
// 연출: 고속도로 — 회색 아스팔트 · 노랑 차선 · 속도계 바늘 · 사이드카 오토바이 · 단속 경광등 · 정(正) 자 집계판.
// 한국 차트 색: 상승 빨강 · 하락 파랑. 숫자는 사실 카드(S01~S08)에서만. 투자 권유 아님.
export const SIDECAR_TOTAL = TL.total;
const { fontFamily: russo } = loadRusso();
const { fontFamily: sun } = loadSun("normal", { weights: ["500", "700"] });

const P = { road: "#2A2C31", road2: "#1E2024", line: "#FFD400", ink: "#F7F7F2", dim: "#A3A6AE", up: "#F03A3F", down: "#3A73FF" };
const X2008 = Math.round((D.ytd.total / D.years[1].n) * 10) / 10; // 2.1배 (54 ÷ 26, 자체 계산)
const fmt = (n: number, d = 2) => n.toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d });

const useIn = (at: number, cfg = { damping: 15, stiffness: 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 바탕: 아스팔트 + 위에서 아래로 흐르는 노랑 중앙선 (달리는 차 시점)
const Road: React.FC<{ speed?: number }> = ({ speed = 16 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.road2}, ${P.road} 40%, ${P.road2})` }}>
      {[110, 970].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 4, top: 0, bottom: 0, width: 8, background: "rgba(255,255,255,0.18)" }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 534,
          top: 0,
          bottom: 0,
          width: 12,
          opacity: 0.22,
          backgroundImage: `repeating-linear-gradient(180deg, ${P.line} 0 90px, transparent 90px 170px)`,
          backgroundPositionY: frame * speed,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// 장면 전환: 경광등 빨강 · 파랑이 번갈아 번쩍
const Siren: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 14) return null;
  const o = interpolate(frame, [0, 3, 14], [0, 0.75, 0], clamp);
  return <AbsoluteFill style={{ background: `linear-gradient(90deg, ${P.up} 0 50%, ${P.down} 50% 100%)`, opacity: o, transform: `scaleX(${frame % 4 < 2 ? 1 : -1})` }} />;
};

// 도로 표지판 같은 머리글
const Sign: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = P.line }) => {
  const s = useIn(3);
  return (
    <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}>
      <div style={{ fontFamily: sun, fontWeight: 700, fontSize: 66, color: "#111", background: color, borderRadius: 18, padding: "12px 40px", border: "6px solid #111", boxShadow: `0 0 0 6px ${color}` }}>{children}</div>
    </div>
  );
};

// 사이드카 오토바이 (도형만): 차체 + 바퀴 두 개 + 옆 칸
const Bike: React.FC<{ x: number; y: number; label: string; wheel: number; color?: string }> = ({ x, y, label, wheel, color = P.up }) => {
  const Wheel = ({ l }: { l: number }) => (
    <div style={{ position: "absolute", left: l, top: 110, width: 96, height: 96, borderRadius: 48, border: "14px solid #111", background: "#555", transform: `rotate(${wheel}deg)` }}>
      <div style={{ position: "absolute", left: 30, top: -2, width: 8, height: 72, background: "#ddd" }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, height: 220 }}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 260, height: 90, background: color, borderRadius: "60px 30px 20px 20px" }} />
      <div style={{ position: "absolute", left: 250, top: 10, width: 14, height: 60, background: "#111", transform: "rotate(25deg)" }} />
      <div style={{ position: "absolute", left: 300, top: 50, width: 240, height: 100, background: "#E6E6E6", borderRadius: "80px 80px 20px 20px", border: "6px solid #111", fontFamily: sun, fontWeight: 700, fontSize: 34, color: "#111", textAlign: "center", lineHeight: "88px" }}>
        {label}
      </div>
      <Wheel l={0} />
      <Wheel l={200} />
      <Wheel l={400} />
    </div>
  );
};

// 1. 훅: 코스피 6,012 카운터 + 매수 사이드카 도장
const HookScene: React.FC = () => {
  const s = useIn(0);
  return (
    <>
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, textAlign: "center", opacity: s }}>
        <div style={{ fontFamily: sun, fontWeight: 700, fontSize: 52, color: P.dim }}>10월 28일 코스피 종가</div>
        <div style={{ fontFamily: russo, fontSize: 196, color: P.ink, lineHeight: 1.05, marginTop: 10 }}>
          <Counter from={D.close.d1.close} to={D.close.d2.close} start={6} dur={50} digits={2} />
        </div>
        <div style={{ fontFamily: russo, fontSize: 92, color: P.up }}>
          ▲ {fmt(D.close.d2.pts)} (+{D.close.d2.pct}%)
        </div>
      </div>
      <Stamp at={60} color={P.up} rotate={-8} style={{ top: 820, left: 150, fontSize: 70, fontFamily: sun, background: "rgba(20,20,24,0.85)" }}>
        매수 사이드카 발동
        <div style={{ fontFamily: russo, fontSize: 52 }}>09:54</div>
      </Stamp>
      <Stamp at={95} color={P.line} rotate={6} style={{ top: 1110, left: 500, fontSize: 48, fontFamily: sun, background: "rgba(20,20,24,0.85)" }}>
        올해 {D.ytd.total}번째
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "오늘 코스피 6.63% 올라 6,012에 마감", from: 5, to: 85, em: ["6,012에"] },
          { text: "아침엔 사이드카, 올해만 벌써 54번째", from: 85, to: 150, em: ["54번째"] },
        ]}
      />
    </>
  );
};

// 2. 사이드카가 뭐길래: 속도계 5% → 1분 → 프로그램 매매 5분 정지
const WhatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [20, 90], [0, D.futures.pct], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const ang = -120 + (v / 8) * 240; // 0~8% 눈금
  const minute = interpolate(frame, [95, 125], [0, 60], clamp);
  const stop = frame >= 130;
  const left = Math.max(0, 300 - Math.floor(((frame - 130) / 140) * 300)); // 5분 → 화면에선 빠르게
  const bikeX = stop ? 260 : interpolate(frame, [0, 130], [-560, 260], clamp);
  return (
    <>
      <Sign>사이드카가 뭐길래?</Sign>
      <div style={{ position: "absolute", top: 380, left: 290, width: 500, height: 500, borderRadius: 250, background: "#111", border: "10px solid #444" }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = -120 + i * 30;
          const red = i >= 5;
          return (
            <div key={i} style={{ position: "absolute", left: 245, top: 20, width: 10, height: 230, transformOrigin: "50% 230px", transform: `rotate(${a}deg)` }}>
              <div style={{ width: 10, height: 34, background: red ? P.up : P.ink }} />
              <div style={{ fontFamily: russo, fontSize: 30, color: red ? P.up : P.ink, transform: `rotate(${-a}deg)`, marginTop: 6, marginLeft: -10 }}>{i}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 244, top: 50, width: 12, height: 200, background: P.line, transformOrigin: "50% 200px", transform: `rotate(${ang}deg)`, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 220, top: 220, width: 60, height: 60, borderRadius: 30, background: P.line }} />
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: russo, fontSize: 64, color: v >= 5 ? P.up : P.ink }}>+{v.toFixed(2)}%</div>
        <div style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center", fontFamily: sun, fontWeight: 700, fontSize: 28, color: P.dim }}>코스피200 선물</div>
      </div>
      <div style={{ position: "absolute", top: 905, left: 0, right: 0, textAlign: "center", fontFamily: sun, fontWeight: 700, fontSize: 46, color: P.ink, opacity: interpolate(frame, [92, 100], [0, 1], clamp) }}>
        5% 넘은 채로 <span style={{ fontFamily: russo, color: P.line }}>{Math.round(minute)}초</span> / 60초
      </div>
      <Bike x={bikeX} y={990} label="프로그램 매매" wheel={stop ? 0 : frame * 24} />
      {stop && (
        <Stamp at={130} color={P.up} rotate={-4} style={{ top: 1010, left: 610, fontSize: 44, fontFamily: sun, background: "rgba(20,20,24,0.9)" }}>
          정지 <span style={{ fontFamily: russo }}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span>
        </Stamp>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "코스피200 선물이 5% 넘게 움직인 채 1분이 가면", from: 8, to: 130, em: ["5%", "1분이"] },
          { text: "컴퓨터 자동 주문, 프로그램 매매를 5분 멈춥니다", from: 130, to: 270, em: ["5분"] },
        ]}
      />
    </>
  );
};

// 3. 이틀 연속: 10/27 · 10/28 카드
const TwodaysScene: React.FC = () => {
  const days = [D.close.d1, D.close.d2];
  return (
    <>
      <Sign>이틀 연속 발동</Sign>
      {days.map((d, i) => {
        const s = useIn(30 + i * 50);
        return (
          <div key={d.date} style={{ position: "absolute", top: 420 + i * 420, left: 110, right: 110, height: 360, background: "rgba(10,10,12,0.75)", border: `6px solid ${P.up}`, borderRadius: 30, transform: `translateX(${(1 - s) * (i ? 900 : -900)}px)`, padding: "30px 44px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: russo, fontSize: 64, color: P.line }}>
              <span>{d.date}</span>
              <span style={{ fontSize: 48, color: P.ink }}>{d.time}</span>
            </div>
            <div style={{ fontFamily: sun, fontWeight: 700, fontSize: 44, color: P.up, marginTop: 10 }}>{d.side} 사이드카</div>
            <div style={{ fontFamily: russo, fontSize: 96, color: P.ink, marginTop: 6 }}>
              {fmt(d.close)} <span style={{ fontSize: 56, color: P.up }}>+{d.pct}%</span>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "어제 10시 13분에 이어 오늘 9시 54분", from: 10, to: 110, em: ["이어"] },
          { text: "이틀 동안 코스피는 3.09%, 6.63% 올랐습니다", from: 110, to: 210, em: ["3.09%,", "6.63%"] },
        ]}
      />
    </>
  );
};

// 4. 올해 54번: 정(正) 자 집계판 (매수 빨강 · 매도 파랑) + 누적 경로
const TallyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shown = Math.floor(interpolate(frame, [20, 170], [0, D.ytd.total], clamp));
  const marks = Array.from({ length: D.ytd.total }, (_, i) => (i % 2 === 0 ? "buy" : "sell")); // 실제 순서가 아니라 27 · 27 비율만 보여 준다
  return (
    <>
      <Sign>올해 사이드카 집계판</Sign>
      <div style={{ position: "absolute", top: 380, left: 110, right: 110, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {marks.slice(0, shown).map((m, i) => (
          <div key={i} style={{ width: 66, height: 66, borderRadius: 12, background: m === "buy" ? P.up : P.down, fontFamily: russo, fontSize: 30, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {m === "buy" ? "▲" : "▼"}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", fontFamily: sun, fontWeight: 700, fontSize: 54, color: P.ink }}>
        <span style={{ fontFamily: russo, fontSize: 110, color: P.line }}>{shown}</span>번 = <span style={{ color: P.up }}>매수 {D.ytd.buy}</span> + <span style={{ color: P.down }}>매도 {D.ytd.sell}</span>
      </div>
      <div style={{ position: "absolute", top: 1180, left: 110, right: 110, display: "flex", justifyContent: "space-between", fontFamily: sun, fontWeight: 700, fontSize: 34, color: P.dim, opacity: interpolate(frame, [180, 195], [0, 1], clamp) }}>
        {D.path.map((p) => (
          <span key={p.label}>
            {p.label} <span style={{ fontFamily: russo, color: P.ink }}>{p.n}</span>번
          </span>
        ))}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "올해 코스피 사이드카는 54번", from: 10, to: 120, em: ["54번"] },
          { text: "오를 때 27번, 내릴 때 27번, 딱 반반", from: 120, to: 200, em: ["반반"] },
          { text: "6월 중순 26번, 7월 중순 37번에서 계속 늘었습니다", from: 200, to: 270, em: ["26번,", "37번"] },
        ]}
      />
    </>
  );
};

// 5. 다른 해와 비교: 2020 · 2008 · 2026 막대
const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = D.ytd.total;
  return (
    <>
      <Sign>다른 해와 비교하면</Sign>
      {D.years.map((y, i) => {
        const p = spring({ frame: frame - 20 - i * 25, fps, config: { damping: 18, stiffness: 100 } });
        const h = (y.n / max) * 620 * p;
        const left = 140 + i * 280;
        const last = i === D.years.length - 1;
        return (
          <div key={y.label}>
            <div style={{ position: "absolute", left, width: 220, top: 1150 - h, height: h, background: last ? P.up : "#8C8F98", borderRadius: "16px 16px 0 0" }} />
            <div style={{ position: "absolute", left: left - 30, width: 280, top: 1150 - h - 96, textAlign: "center", fontFamily: russo, fontSize: 80, color: last ? P.up : P.ink, opacity: p }}>{y.n}</div>
            <div style={{ position: "absolute", left: left - 30, width: 280, top: 1164, textAlign: "center", fontFamily: sun, fontWeight: 700, fontSize: 38, color: P.ink }}>{y.label}</div>
            <div style={{ position: "absolute", left: left - 40, width: 300, top: 1212, textAlign: "center", fontFamily: sun, fontWeight: 500, fontSize: 26, color: P.dim }}>{y.sub}</div>
          </div>
        );
      })}
      <Stamp at={140} color={P.line} rotate={-8} style={{ top: 420, left: 110, fontSize: 46, fontFamily: sun, background: "rgba(20,20,24,0.9)" }}>
        2008년의 <span style={{ fontFamily: russo, fontSize: 70 }}>×{X2008}</span>
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "코로나가 덮친 2020년엔 7번", from: 10, to: 80, em: ["7번"] },
          { text: "종전 최다였던 2008년 금융위기 때도 26번", from: 80, to: 160, em: ["26번"] },
          { text: "올해는 10월에 벌써 그 두 배가 넘습니다", from: 160, to: 240, em: ["두"] },
        ]}
      />
    </>
  );
};

// 6. 마무리: 정리 + 출처 · 고지
const OutroScene: React.FC = () => {
  const s = useIn(4);
  return (
    <>
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, textAlign: "center", opacity: s }}>
        <div style={{ fontFamily: sun, fontWeight: 700, fontSize: 64, color: P.ink, lineHeight: 1.3 }}>
          위로도 아래로도
          <br />
          <span style={{ color: P.line }}>브레이크가 가장 자주 걸린 해</span>
        </div>
        <div style={{ fontFamily: sun, fontWeight: 500, fontSize: 34, color: P.dim, marginTop: 60, lineHeight: 1.5 }}>
          유가증권시장 사이드카 · 언론 보도(한국거래소 집계 인용) 기준
          <br />
          2008 · 2020년은 KBS · YTN · 헤럴드경제 보도 수치
          <br />
          종가: 2026.10.28 한국거래소 · 투자 권유 아님
        </div>
      </div>
      <Caption bottom={400} lines={[{ text: "투자 권유가 아닙니다. 자료 출처는 설명란에", from: 5, to: 120, em: ["설명란에"] }]} />
    </>
  );
};

const TopBand: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: sun, fontWeight: 700, fontSize: 30, color: "#111", background: P.line, borderRadius: 8, padding: "6px 22px" }}>2026.10.28 종가 기준 · 투자 권유 아님</span>
  </div>
);

const SCENES: Record<string, React.FC> = { hook: HookScene, what: WhatScene, twodays: TwodaysScene, tally: TallyScene, compare: CompareScene, outro: OutroScene };

export const SidecarShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.road }}>
    <Audio src={staticFile("bgm/sidecar.wav")} volume={0.7} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Road speed={id === "what" ? 30 : 14} />
          <Scene />
          {i > 0 && <Siren />}
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
