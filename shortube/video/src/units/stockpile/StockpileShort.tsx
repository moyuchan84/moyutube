import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import D from "../../../../content/stockpile/script/data.json";
import TL from "../../../../content/stockpile/script/timeline.json";

// 2026-10-28 일본 · 영국 "3일치 비상물자" 요청 (브리프: content/stockpile/plan.md)
// 연출: 골판지 상자 · 주황 포장 테이프 전환 · 선반에 생수병이 한 병씩 쌓이는 계산 · 체크리스트 도장.
// 숫자는 사실 카드(K01~K07)에서만. 인물 · 깃발 · 사진 없음.
export const STOCKPILE_TOTAL = TL.total;
const { fontFamily: anton } = loadAnton();
const { fontFamily: gaegu } = loadGaegu("normal", { weights: ["700"] }); // 손글씨 상자 라벨 느낌 (다른 편이 이미 불러오는 글꼴이라 요청이 늘지 않는다)

const P = { kraft: "#EAD3A8", kraft2: "#D9BC8A", ink: "#1F2A44", dim: "#6B5A44", orange: "#FF6A13", water: "#2FA4E7", white: "#FFFBF2" };
const W3 = D.water.perDay * D.water.people * D.japan.min; // 36L (3L × 4명 × 3일, 자체 계산)
const W7 = D.water.perDay * D.water.people * D.japan.best; // 84L
const B3 = W3 / D.water.bottle; // 2L 생수 18병
const B7 = W7 / D.water.bottle; // 42병

const useIn = (at: number, cfg = { damping: 14, stiffness: 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 바탕: 골판지 결 + 가장자리 그늘
const Box: React.FC = () => (
  <AbsoluteFill style={{ background: P.kraft }}>
    <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(90deg, rgba(120,80,30,0.06) 0 3px, transparent 3px 22px)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(80,50,10,0.25) 100%)" }} />
  </AbsoluteFill>
);

// 장면 전환: 주황 포장 테이프가 가로로 쭉 붙었다 떼어짐
const Tape: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 18) return null;
  const w = interpolate(frame, [0, 8], [0, 1300], clamp);
  const o = interpolate(frame, [10, 18], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: -60, top: 820, width: w, height: 260, background: P.orange, opacity: o, transform: "rotate(-4deg)", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 40px)" }} />
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(3);
  return (
    <div style={{ position: "absolute", top: 220, left: 80, right: 80, textAlign: "center", opacity: s, transform: `rotate(${(1 - s) * -6}deg)` }}>
      <div style={{ display: "inline-block", fontFamily: gaegu, fontSize: 70, color: P.white, background: P.ink, padding: "10px 36px", borderRadius: 12 }}>{children}</div>
      {sub && <div style={{ fontFamily: gaegu, fontSize: 34, color: P.dim, marginTop: 14 }}>{sub}</div>}
    </div>
  );
};

// 생수병 (도형): 몸통 + 뚜껑 + 물 높이
const Bottle: React.FC<{ s?: number; style?: React.CSSProperties }> = ({ s = 1, style }) => (
  <div style={{ position: "relative", width: 54 * s, height: 120 * s, ...style }}>
    <div style={{ position: "absolute", left: 18 * s, top: 0, width: 18 * s, height: 12 * s, background: P.ink, borderRadius: 3 }} />
    <div style={{ position: "absolute", left: 12 * s, top: 10 * s, width: 30 * s, height: 16 * s, background: "rgba(255,255,255,0.7)", borderRadius: "6px 6px 0 0" }} />
    <div style={{ position: "absolute", left: 0, top: 24 * s, width: 54 * s, height: 96 * s, background: "rgba(255,255,255,0.55)", borderRadius: 12 * s, overflow: "hidden", border: `${3 * s}px solid rgba(31,42,68,0.35)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "78%", background: P.water }} />
    </div>
  </div>
);

// 1. 훅: 뉴스 제목 → "전쟁?" → 도장
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const q = interpolate(frame, [40, 50], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", top: 280, left: 80, right: 80, textAlign: "center", transform: `scale(${0.9 + 0.1 * s})`, opacity: s }}>
        <div style={{ fontFamily: gaegu, fontSize: 46, color: P.dim }}>일본 · 영국 정부가 국민에게</div>
        <div style={{ fontFamily: gaegu, fontSize: 118, color: P.ink, lineHeight: 1.12, marginTop: 10 }}>
          &ldquo;<span style={{ color: P.orange }}>3일치</span> 먹을 것
          <br />
          챙겨 두세요&rdquo;
        </div>
        <div style={{ fontFamily: gaegu, fontSize: 84, color: P.ink, marginTop: 40, opacity: q, transform: `rotate(${Math.sin(frame / 2) * 2 * q}deg)` }}>전쟁 나나요?</div>
      </div>
      <Stamp at={70} color={P.orange} rotate={-9} style={{ top: 1020, left: 150, fontSize: 64, fontFamily: gaegu, background: "rgba(255,251,242,0.92)" }}>
        일본은 대지진 대비
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "일본과 영국이 3일치 비상물자를 챙기라고 합니다", from: 5, to: 70, em: ["3일치"] },
          { text: "전쟁 대비일까? 숫자로 따져 봤습니다", from: 70, to: 150, em: ["숫자로"] },
        ]}
      />
    </>
  );
};

// 2. 일본: 11월 2일 방재청 출범 · 최소 3일 · 가능하면 1주일 · 염두에 둔 재난 3가지
const JapanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const d = useIn(30);
  return (
    <>
      <Label sub={`${D.japan.announce} ${D.japan.agency}에 맞춰 발표 예정 (10/27 보도)`}>일본 · 긴급 요청</Label>
      <div style={{ position: "absolute", top: 450, left: 100, right: 100, display: "flex", gap: 30, justifyContent: "center", transform: `scale(${d})` }}>
        {[
          { n: D.japan.min, t: "최소", c: P.orange },
          { n: D.japan.best, t: "가능하면", c: P.water },
        ].map((x) => (
          <div key={x.t} style={{ width: 380, height: 300, background: P.white, borderRadius: 26, border: `8px solid ${x.c}`, textAlign: "center" }}>
            <div style={{ fontFamily: gaegu, fontSize: 44, color: P.dim, marginTop: 20 }}>{x.t}</div>
            <div style={{ fontFamily: anton, fontSize: 150, color: x.c, lineHeight: 1 }}>
              {x.n}
              <span style={{ fontFamily: gaegu, fontSize: 60 }}>일</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 800, left: 100, right: 100, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {D.japan.disasters.map((t, i) => {
          const o = interpolate(frame, [140 + i * 14, 150 + i * 14], [0, 1], clamp);
          return (
            <div key={t} style={{ fontFamily: gaegu, fontSize: 44, color: P.white, background: P.ink, borderRadius: 40, padding: "10px 28px", opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
              {t}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 100, right: 100, textAlign: "center", fontFamily: gaegu, fontSize: 40, color: P.ink, opacity: interpolate(frame, [200, 210], [0, 1], clamp) }}>
        챙길 것: {D.japan.items.join(" · ")}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "일본은 11월 2일 방재청 출범에 맞춰 요청할 예정", from: 8, to: 130, em: ["11월", "2일"] },
          { text: "최소 3일, 가능하면 1주일. 대지진 · 화산 분화 대비", from: 130, to: 270, em: ["3일,", "1주일."] },
        ]}
      />
    </>
  );
};

// 3. 영국: Be Ready · 72시간 · 1인 하루 3L
const UkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const h = Math.floor(interpolate(frame, [20, 80], [0, D.uk.hours], clamp));
  return (
    <>
      <Label sub={`${D.uk.start} 시작한 '${D.uk.name}' 캠페인`}>영국 · 72시간 버티기</Label>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: anton, fontSize: 260, color: P.orange, lineHeight: 1 }}>
        {h}
        <span style={{ fontFamily: gaegu, fontSize: 90, color: P.ink }}>시간</span>
      </div>
      <div style={{ position: "absolute", top: 820, left: 120, right: 120, display: "flex", justifyContent: "center", gap: 40, alignItems: "flex-end" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ textAlign: "center", opacity: interpolate(frame, [90 + i * 10, 100 + i * 10], [0, 1], clamp) }}>
            <Bottle s={1.4} />
            <div style={{ fontFamily: gaegu, fontSize: 34, color: P.ink }}>{i + 1}일째 3L</div>
          </div>
        ))}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "영국은 10월 22일부터 72시간 버티기 캠페인", from: 8, to: 90, em: ["72시간"] },
          { text: "물은 1명이 하루 3L, 사흘이면 9L", from: 90, to: 180, em: ["3L,", "9L"] },
        ]}
      />
    </>
  );
};

// 4. 우리 집 4인 가족이면: 3L × 4명 × 3일 = 36L = 2L 생수 18병 → 1주일 84L = 42병
const CalcScene: React.FC = () => {
  const frame = useCurrentFrame();
  const week = frame >= 200;
  const target = week ? B7 : B3;
  const n = Math.floor(week ? interpolate(frame, [200, 280], [B3, B7], clamp) : interpolate(frame, [60, 170], [0, B3], clamp));
  const liters = n * D.water.bottle;
  return (
    <>
      <Label>우리 집 4인 가족이면?</Label>
      <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", fontFamily: gaegu, fontSize: 56, color: P.ink }}>
        <span style={{ fontFamily: anton, fontSize: 80 }}>3L</span> × 4명 × <span style={{ fontFamily: anton, fontSize: 80, color: week ? P.water : P.orange }}>{week ? D.japan.best : D.japan.min}</span>일
      </div>
      {/* 선반 */}
      <div style={{ position: "absolute", top: 520, left: 100, width: 880, height: 560, display: "flex", flexWrap: "wrap", alignContent: "flex-end", gap: "6px 4px", padding: 10 }}>
        {Array.from({ length: n }).map((_, i) => (
          <Bottle key={i} s={0.98} style={{ transform: `translateY(${i === n - 1 ? -8 : 0}px)` }} />
        ))}
      </div>
      {[650, 780, 910, 1080].map((y) => (
        <div key={y} style={{ position: "absolute", top: y + 4, left: 90, width: 900, height: 14, background: P.kraft2, borderRadius: 4, boxShadow: "0 6px 0 rgba(80,50,10,0.25)", opacity: y === 1080 ? 1 : 0 }} />
      ))}
      <div style={{ position: "absolute", top: 1120, left: 0, right: 0, textAlign: "center", fontFamily: gaegu, fontSize: 54, color: P.ink }}>
        = <span style={{ fontFamily: anton, fontSize: 110, color: week ? P.water : P.orange }}>{liters}L</span> · 2L 생수 <span style={{ fontFamily: anton, fontSize: 80 }}>{n}</span>병
      </div>
      {n === target && !week && frame > 172 && (
        <Stamp at={172} color={P.orange} rotate={8} style={{ top: 440, left: 640, fontSize: 46, fontFamily: gaegu, background: "rgba(255,251,242,0.92)" }}>
          최소 {B3}병
        </Stamp>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "4인 가족 사흘이면 물만 36L, 2L 생수 18병", from: 20, to: 200, em: ["36L,", "18병"] },
          { text: "1주일이면 84L, 무려 42병입니다", from: 200, to: 330, em: ["84L,", "42병"] },
        ]}
      />
    </>
  );
};

// 5. 오해 바로잡기: 새 지침이 아니다
const NotnewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { k: "새 규칙?", v: "아니요. 일본은 원래 최소 3일 · 권장 1주일 비축 기준" },
    { k: "이번엔?", v: "방재청 출범에 맞춰 다시 강조" },
    { k: "영국은?", v: "기후 재해 · 사이버 공격 등 큰 비상사태 대비" },
  ];
  return (
    <>
      <Label>오해 바로잡기</Label>
      {rows.map((r, i) => {
        const o = interpolate(frame, [20 + i * 40, 32 + i * 40], [0, 1], clamp);
        return (
          <div key={r.k} style={{ position: "absolute", top: 420 + i * 230, left: 90, right: 90, height: 200, background: P.white, borderRadius: 24, borderLeft: `18px solid ${i === 0 ? P.orange : P.ink}`, padding: "24px 34px", opacity: o, transform: `translateX(${(1 - o) * 80}px)` }}>
            <div style={{ fontFamily: gaegu, fontSize: 40, color: P.orange }}>{r.k}</div>
            <div style={{ fontFamily: gaegu, fontSize: 44, color: P.ink, lineHeight: 1.25, wordBreak: "keep-all" }}>{r.v}</div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "사실 일본은 원래 3일, 1주일 비축을 권해 왔습니다", from: 8, to: 100, em: ["원래"] },
          { text: "이번엔 방재청 출범에 맞춰 다시 강조하는 것", from: 100, to: 180, em: ["다시"] },
        ]}
      />
    </>
  );
};

// 6. 마무리: 체크리스트 + 출처
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const list = ["물 1명 하루 3L", "바로 먹는 음식", "휴대용 화장실", "손전등 · 라디오"];
  return (
    <>
      <Label>우리 집 체크리스트</Label>
      <div style={{ position: "absolute", top: 400, left: 160, right: 160 }}>
        {list.map((t, i) => {
          const on = frame > 15 + i * 14;
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26, fontFamily: gaegu, fontSize: 52, color: P.ink }}>
              <div style={{ width: 60, height: 60, border: `6px solid ${P.ink}`, borderRadius: 10, background: P.white, textAlign: "center", lineHeight: "50px", color: P.orange, fontSize: 56 }}>{on ? "✔" : ""}</div>
              {t}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1000, left: 90, right: 90, textAlign: "center", fontFamily: gaegu, fontSize: 30, color: P.dim, lineHeight: 1.5 }}>
        일본 요청은 11월 2일 발표 전 보도 기준 (FNN · 한국경제 · 뉴시스)
        <br />
        물 3L 기준: 삿포로시 수도국 · 영국 Be Ready 보도 · 계산은 직접
      </div>
      <Caption bottom={400} lines={[{ text: "우리 집은 며칠 버틸 수 있을까요?", from: 5, to: 120, em: ["며칠"] }]} />
    </>
  );
};

const TopBand: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: gaegu, fontSize: 30, color: P.white, background: P.orange, borderRadius: 8, padding: "6px 22px" }}>2026.10.28 보도 기준 · 숫자로 보는 요즘</span>
  </div>
);

const SCENES: Record<string, React.FC> = { hook: HookScene, japan: JapanScene, uk: UkScene, calc: CalcScene, notnew: NotnewScene, outro: OutroScene };

export const StockpileShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.kraft }}>
    <Audio src={staticFile("bgm/stockpile.wav")} volume={0.7} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Box />
          <Scene />
          {i > 0 && <Tape />}
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
