import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { fontFamily as gothic } from "../../theme";
import { AbsoluteFill, Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import D from "../../../../content/guryong/script/data.json";
import TL from "../../../../content/guryong/script/timeline.json";

// 2026-10-27 강남 구룡마을 화재 (브리프: content/guryong/plan.md)
// 연출: 숯빛 바탕 · 불씨 입자 · 24시간 시계판 · 지붕 격자 · 연기 전환. 화재 사진 · 영상 없음.
// 숫자는 사실 카드(G01~G11)에서만. 개인 정보 · 원인 추측 없음.
export const GURYONG_TOTAL = TL.total;
const { fontFamily: bebas } = loadBebas();

const P = { coal: "#15110F", coal2: "#241B17", ash: "#9A8F88", ember: "#FF7A1A", red: "#E8361E", glow: "#FFC15E", white: "#F6EFE9", smoke: "#3A3330" };
const FIELDS = D.area.m2 / D.area.field; // 약 3.9개 (자체 계산)

const useIn = (at: number, cfg = { damping: 15, stiffness: 140 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 바탕: 숯빛 + 아래쪽 불빛 + 날아오르는 불씨
const Coal: React.FC<{ heat?: number }> = ({ heat = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.coal }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 115%, rgba(232,54,30,${0.55 * heat}) 0%, rgba(255,122,26,${0.18 * heat}) 35%, transparent 65%)` }} />
      {Array.from({ length: 38 }).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 2 + random(`s${i}`) * 4;
        const y = 1960 - ((frame * speed + random(`y${i}`) * 1960) % 1960);
        const r = 3 + random(`r${i}`) * 5;
        const o = interpolate(y, [200, 1900], [0, 0.9], clamp) * heat;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin((frame + i * 20) / 18) * 24, top: y, width: r, height: r, borderRadius: r, background: i % 3 ? P.ember : P.glow, opacity: o, boxShadow: `0 0 ${r * 3}px ${P.ember}` }} />;
      })}
    </AbsoluteFill>
  );
};

// 장면 전환: 아래에서 연기가 피어올라 덮었다가 걷힘
const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 22) return null;
  const o = interpolate(frame, [0, 4, 22], [0.95, 0.95, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const s = 500 + random(`sm${i}`) * 500;
        return <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080 - s / 2, top: 1500 - frame * 50 - random(`sy${i}`) * 1200, width: s, height: s, borderRadius: s, background: P.smoke, filter: "blur(60px)" }} />;
      })}
    </AbsoluteFill>
  );
};

// 본문은 아주 느린 줌 인만 (글자가 일렁이지 않게)
const Zoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1 + frame * 0.00025})` }}>{children}</AbsoluteFill>;
};

// 바탕 불빛: 느린 줌 인 + 일렁임 (SVG 필터는 그라디언트에 얼룩이 생겨 쓰지 않는다)
const Haze: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1.04 + frame * 0.0003}) translateY(${Math.sin(frame / 11) * 6}px)`, opacity: 0.9 + 0.1 * Math.sin(frame / 3.3) }}>{children}</AbsoluteFill>;
};

const Head: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(2);
  return (
    <div style={{ position: "absolute", top: 220, left: 80, right: 80, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 66, color: P.white }}>{children}</div>
      {sub && <div style={{ fontFamily: gothic, fontSize: 32, color: P.ash, marginTop: 10 }}>{sub}</div>}
    </div>
  );
};

// 1. 훅: 12:50 이 타오름
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useIn(10);
  const top = useIn(0);
  const flick = 0.85 + 0.15 * Math.sin(frame * 1.7) * Math.sin(frame * 0.6);
  return (
    <>
      <div style={{ position: "absolute", top: 330, left: 60, right: 60, textAlign: "center", fontFamily: gothic, fontWeight: 900, fontSize: 52, color: P.ash, opacity: top }}>
        10월 27일 · 강남 구룡마을
      </div>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", transform: `scale(${0.7 + 0.3 * s})`, opacity: s }}>
        <div style={{ fontFamily: bebas, fontSize: 400, lineHeight: 0.9, color: P.glow, textShadow: `0 0 ${60 * flick}px ${P.red}, 0 0 ${20 * flick}px ${P.ember}` }}>
          12<span style={{ color: P.ember }}>:</span>50
        </div>
        <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 64, color: P.white, marginTop: 10 }}>
          약 {D.duration.h}시간 {D.duration.m}분
        </div>
      </div>
      <div style={{ position: "absolute", top: 1070, left: 80, right: 80, textAlign: "center", fontFamily: gothic, fontSize: 46, color: P.white, opacity: interpolate(frame, [60, 72], [0, 1], clamp) }}>
        불이 <span style={{ color: P.ember, fontWeight: 900 }}>완전히 꺼지기까지</span>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "10월 27일 강남 구룡마을에서 난 불", from: 5, to: 70, em: ["구룡마을에서"] },
          { text: "다 꺼지기까지 12시간 50분 걸렸습니다", from: 70, to: 150, em: ["12시간", "50분"] },
        ]}
      />
    </>
  );
};

// 2. 24시간 시계판: 15:49 → 04:39 (각도 = 분 ÷ 4)
const ClockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 540, cy = 740, R = 320;
  const a0 = D.steps[0].min / 4;
  const aEnd = D.steps[D.steps.length - 1].min / 4;
  const a = interpolate(frame, [30, 220], [a0, aEnd], clamp);
  const pt = (deg: number, r: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
  const arc = (from: number, to: number, r: number) => {
    const [x0, y0] = pt(from, r);
    const [x1, y1] = pt(to, r);
    return `M ${x0} ${y0} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const el = Math.floor(((a - a0) * 4));
  return (
    <>
      <Head sub="대응 단계 시각은 보도 기준">24시간 시계로 보면</Head>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.coal2} strokeWidth={56} />
        {Array.from({ length: 24 }).map((_, h) => {
          const [x0, y0] = pt(h * 15, R + 40);
          const [x1, y1] = pt(h * 15, R + 54);
          const [tx, ty] = pt(h * 15, R - 66);
          return (
            <g key={h}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={P.ash} strokeWidth={h % 6 ? 2 : 5} />
              {h % 6 === 0 && (
                <text x={tx} y={ty + 14} textAnchor="middle" fontFamily={gothic} fontWeight={900} fontSize={34} fill={P.ash}>
                  {h}시
                </text>
              )}
            </g>
          );
        })}
        {a > a0 + 0.5 && <path d={arc(a0, a, R)} fill="none" stroke={P.ember} strokeWidth={56} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 18px ${P.red})` }} />}
        {D.steps.map((st, i) => {
          const at = st.min / 4;
          if (a < at - 0.01) return null;
          const [x, y] = pt(at, R);
          return <circle key={i} cx={x} cy={y} r={13} fill={P.white} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 740 - 95, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: bebas, fontSize: 150, color: P.glow, lineHeight: 1 }}>
          {Math.floor(el / 60)}:{String(el % 60).padStart(2, "0")}
        </div>
        <div style={{ fontFamily: gothic, fontSize: 32, color: P.ash }}>불이 난 뒤 지난 시간</div>
      </div>
      <div style={{ position: "absolute", top: 1130, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {D.steps.map((st) => {
          const on = a >= st.min / 4 - 0.01;
          return (
            <div key={st.t} style={{ fontFamily: gothic, fontSize: 30, color: on ? P.white : P.smoke, background: on ? (st.label === "완진" ? P.red : P.coal2) : "transparent", border: `2px solid ${on ? P.ember : P.smoke}`, borderRadius: 30, padding: "6px 18px" }}>
              <b style={{ fontFamily: bebas, fontSize: 34, color: on ? P.glow : P.smoke }}>{st.t}</b> {st.label}
            </div>
          );
        })}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "오후 3시 49분 불, 40분 만에 대응 2단계", from: 8, to: 140, em: ["2단계"] },
          { text: "새벽 4시 39분에야 완전히 꺼졌습니다", from: 140, to: 270, em: ["4시", "39분에야"] },
        ]}
      />
    </>
  );
};

// 3. 규모: 투입 인력 · 차량 · 헬기 → 탄 넓이 = 축구장 약 4개
const ScaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const n = (to: number, at: number) => Math.round(interpolate(frame, [at, at + 50], [0, to], clamp));
  const fieldOn = frame >= 130;
  return (
    <>
      <Head sub="투입 규모는 보도 기준">밤새 매달린 숫자</Head>
      <div style={{ position: "absolute", top: 400, left: 60, right: 60, display: "flex", justifyContent: "space-around", opacity: interpolate(frame, [120, 135], [1, 0], clamp) }}>
        {[
          { v: n(D.crew.people, 15), u: "여 명", t: "인력" },
          { v: n(D.crew.cars, 30), u: "여 대", t: "차량" },
          { v: n(D.crew.heli, 45), u: "대", t: "헬기" },
        ].map((x) => (
          <div key={x.t} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: bebas, fontSize: 150, color: P.glow, lineHeight: 1 }}>
              {x.v}
              <span style={{ fontFamily: gothic, fontSize: 38, color: P.white }}>{x.u}</span>
            </div>
            <div style={{ fontFamily: gothic, fontSize: 34, color: P.ash }}>{x.t}</div>
          </div>
        ))}
      </div>
      {fieldOn && (
        <>
          <div style={{ position: "absolute", top: 390, left: 0, right: 0, textAlign: "center", fontFamily: gothic, fontWeight: 900, fontSize: 56, color: P.white }}>
            탄 넓이 약 <span style={{ fontFamily: bebas, fontSize: 130, color: P.ember }}>28,000</span>㎡
          </div>
          <div style={{ position: "absolute", top: 600, left: 100, width: 880, display: "flex", flexWrap: "wrap", gap: 20 }}>
            {[0, 1, 2, 3].map((i) => {
              const fill = interpolate(frame, [150 + i * 22, 175 + i * 22], [0, i === 3 ? FIELDS - 3 : 1], clamp);
              return (
                <div key={i} style={{ position: "relative", width: 420, height: 270, border: `4px solid ${P.ash}`, borderRadius: 8, overflow: "hidden", background: P.coal2 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${P.red}, ${P.ember})`, opacity: 0.85 }} />
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, background: P.ash, opacity: 0.6 }} />
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: 80, height: 80, marginLeft: -40, marginTop: -40, borderRadius: 80, border: `4px solid ${P.ash}`, opacity: 0.6 }} />
                </div>
              );
            })}
          </div>
          <Stamp at={250} color={P.glow} rotate={-6} style={{ top: 1180, left: 270, fontSize: 52, fontFamily: gothic, fontWeight: 900, background: "rgba(21,17,15,0.85)" }}>
            축구장 약 4개
          </Stamp>
          <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", fontFamily: gothic, fontSize: 28, color: P.ash, opacity: interpolate(frame, [200, 212], [0, 1], clamp) }}>
            국제경기 규격 105m × 68m = 7,140㎡로 직접 계산
          </div>
        </>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "사람 940여 명, 헬기 6대가 밤새 매달렸고", from: 8, to: 130, em: ["940여", "6대가"] },
          { text: "불탄 넓이는 축구장 약 4개 크기", from: 130, to: 270, em: ["축구장", "4개"] },
        ]}
      />
    </>
  );
};

// 지붕 아이콘 (도형)
const Roof: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 34, height: 30, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "17px solid transparent", borderRight: "17px solid transparent", borderBottom: `13px solid ${on ? P.ember : P.smoke}` }} />
    <div style={{ position: "absolute", left: 4, top: 13, width: 26, height: 17, background: on ? P.ember : P.smoke }} />
  </div>
);

// 4. 이재민: 두 기관 집계를 같은 크기로
const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Head sub="어느 쪽이 맞다고 판정하지 않습니다">이재민 집계, 기관마다 달라요</Head>
      <div style={{ position: "absolute", top: 410, left: 50, right: 50, display: "flex", gap: 30 }}>
        {D.victims.map((v, k) => {
          const o = interpolate(frame, [20 + k * 30, 35 + k * 30], [0, 1], clamp);
          const lit = Math.floor(interpolate(frame, [40 + k * 30, 160 + k * 30], [0, v.homes], clamp));
          return (
            <div key={v.by} style={{ flex: 1, background: P.coal2, borderRadius: 24, padding: "26px 16px", border: `3px solid ${P.smoke}`, opacity: o }}>
              <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 38, color: P.ash, textAlign: "center" }}>{v.by}</div>
              <div style={{ textAlign: "center", fontFamily: bebas, fontSize: 150, color: P.glow, lineHeight: 1, marginTop: 10 }}>
                {v.people}
                <span style={{ fontFamily: gothic, fontSize: 46, color: P.white }}>명</span>
              </div>
              <div style={{ textAlign: "center", fontFamily: gothic, fontSize: 40, color: P.white }}>{v.homes}가구</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginTop: 20 }}>
                {Array.from({ length: v.homes }).map((_, i) => (
                  <Roof key={i} on={i < lit} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center", fontFamily: gothic, fontSize: 40, color: P.white, opacity: interpolate(frame, [180, 192], [0, 1], clamp) }}>
        부상 <b style={{ color: P.ember }}>{D.injured}명</b>(경상) · 가건물 약 {D.area.houses}가구가 탐
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "집을 잃은 사람 수는 기관마다 다릅니다", from: 8, to: 140, em: ["기관마다"] },
          { text: "강남구 107명, 소방당국 127명", from: 140, to: 270, em: ["107명,", "127명"] },
        ]}
      />
    </>
  );
};

// 5. 왜 번졌나: 자재 · 소화전 · 올해 두 번째
const WhyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = [
    { k: "불에 잘 타는 자재", v: "떡솜 · 비닐 · 합판 · 스티로폼 집이 다닥다닥, 방화구획 없음" },
    { k: `마을 안 소화전 ${D.hydrants}개`, v: "대로변에 9개 더 · 여러 장비가 물을 나눠 써 수압이 약했다는 보도" },
    { k: "올해만 두 번째 큰불", v: `${D.january.date}에도 불 — 이재민 ${D.january.people}여 명` },
  ];
  return (
    <>
      <Head>왜 이렇게 번졌나</Head>
      {cards.map((c, i) => {
        const o = interpolate(frame, [15 + i * 32, 28 + i * 32], [0, 1], clamp);
        return (
          <div key={c.k} style={{ position: "absolute", top: 370 + i * 300, left: 80, right: 80, height: 260, background: P.coal2, borderRadius: 22, borderTop: `10px solid ${i === 2 ? P.red : P.ember}`, padding: "26px 36px", opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
            <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 52, color: i === 2 ? P.glow : P.white }}>{c.k}</div>
            <div style={{ fontFamily: gothic, fontSize: 36, color: P.ash, lineHeight: 1.35, marginTop: 12, wordBreak: "keep-all" }}>{c.v}</div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "불에 잘 타는 자재가 다닥다닥 붙어 있고", from: 8, to: 90, em: ["다닥다닥"] },
          { text: "1월에도 큰불, 올해만 두 번째입니다", from: 90, to: 180, em: ["두", "번째입니다"] },
        ]}
      />
    </>
  );
};

// 6. 마무리: 원인 감식 중 + 출처
const OutroScene: React.FC = () => {
  const s = useIn(5);
  return (
    <>
      <div style={{ position: "absolute", top: 480, left: 80, right: 80, textAlign: "center", opacity: s }}>
        <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 80, color: P.white }}>원인은 아직</div>
        <div style={{ fontFamily: gothic, fontWeight: 900, fontSize: 80, color: P.ember }}>감식 중</div>
        <div style={{ fontFamily: gothic, fontSize: 36, color: P.ash, marginTop: 30 }}>재산 피해 규모도 확인 중</div>
      </div>
      <div style={{ position: "absolute", top: 1030, left: 80, right: 80, textAlign: "center", fontFamily: gothic, fontSize: 28, color: P.ash, lineHeight: 1.55 }}>
        2026.10.28 보도 기준 · 이투데이 · 경향신문 · 한국일보 · 뉴스1
        <br />
        축구장 환산은 직접 계산 · 자세한 출처는 설명란
      </div>
      <Caption bottom={400} lines={[{ text: "원인은 아직 조사 중입니다", from: 5, to: 120, em: ["조사"] }]} />
    </>
  );
};

const TopBand: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: gothic, fontWeight: 900, fontSize: 28, color: P.coal, background: P.ember, borderRadius: 8, padding: "6px 22px" }}>{D.asOf} · 숫자로 보는 요즘</span>
  </div>
);

const SCENES: Record<string, React.FC> = { hook: HookScene, clock: ClockScene, scale: ScaleScene, count: CountScene, why: WhyScene, outro: OutroScene };
const HEAT: Record<string, number> = { hook: 1, clock: 0.8, scale: 0.9, count: 0.5, why: 0.6, outro: 0.25 };

export const GuryongShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.coal }}>
    <Audio src={staticFile("bgm/guryong.wav")} volume={0.7} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Haze>
            <Coal heat={HEAT[id]} />
          </Haze>
          <Zoom>
            <Scene />
          </Zoom>
          {i > 0 && <Smoke />}
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
