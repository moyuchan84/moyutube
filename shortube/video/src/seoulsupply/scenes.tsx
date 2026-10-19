import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../components/Caption";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import { City, Crane, GROUND, Sky, S, T, makeCity, rnd } from "./fx";

// 숫자는 output/briefs/2026-10-19_slot1.md 사실 카드(H1~H9)에서만 가져온다. 사진·로고·캡처 없음.
// 한국 색: 상승 빨강 · 하락 파랑.
const F = {
  weeks: 88, week: 0.16, jeonse: 0.18, gangnam: -0.35, seocho: -0.27, // H8
  permit: 39940, permitAvg: 38000, start: 20679, done: 25630, doneYoy: -19.1, // H1~H3
  start6: 17000, start6Avg: 31000, // H5
  sites: 27, existing: 29893, wait: 13, // H6
  y27a: 17197, y27b: 13019, ref: 45000, // H7
};

const count = (frame: number, start: number, dur: number, to: number) => Math.round(interpolate(frame, [start, start + dur], [0, to], clamp));
const fmt = (n: number) => n.toLocaleString("ko-KR");

const Num: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 150, color = S.orange, style }) => (
  <span style={{ fontFamily, fontWeight: 900, fontSize: size, color, letterSpacing: -2, textShadow: "0 6px 30px rgba(0,0,0,0.45)", ...style }}>{children}</span>
);

const Chip: React.FC<{ at: number; color: string; top: number; left: number; w: number; children: React.ReactNode }> = ({ at, color, top, left, w, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: w,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 54,
        color,
        background: "rgba(14,11,36,0.78)",
        border: `4px solid ${color}`,
        borderRadius: 24,
        padding: "14px 10px",
        opacity: s,
        transform: `scale(${0.7 + 0.3 * s})`,
      }}
    >
      {children}
    </div>
  );
};

// ───── 0. 훅 ─────
const HOOK_L: Line[] = [{ text: "서울 집값이 88주째 올랐어요, 집은 안 짓는 걸까요?", from: 14, to: 120, em: ["88주째", "안"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const far = makeCity(11, -40, 1120, 180, 520, 60, 110);
  const near = makeCity(5, -60, 1140, 260, 700, 90, 150);
  const lit = (bi: number, c: number, r: number) => interpolate(frame, [8 + rnd(bi * 31 + c * 7 + r) * 70, 14 + rnd(bi * 31 + c * 7 + r) * 70], [0, 1], clamp);
  const pan = frame * 0.6;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-pan * 0.5}px)`, opacity: 0.8 }}>
        <City b={far} color="#241A4A" />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-pan}px)` }}>
        <City b={near} color={S.night} win={lit} />
      </div>
      <T top={300} size={46} weight={500} at={4}>서울 아파트값</T>
      <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center" }}>
        <Num size={260}>{count(frame, 8, 52, F.weeks)}</Num>
        <Num size={110} color={S.warm}>주</Num>
      </div>
      <T top={730} size={54} weight={700} at={50}>연속 상승 · 역대 최장</T>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// ───── 1. 가격: 88칸 창문 ─────
const PRICE_L: Line[] = [
  { text: "이번 주도 +0.16%, 전세는 +0.18%", from: 10, to: 105, em: ["+0.16%,", "+0.18%"] },
  { text: "그런데 강남·서초는 10주째 하락 중", from: 108, to: 210, em: ["10주째", "하락"] },
];
export const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cell = 70;
  const gx = (1080 - 11 * cell) / 2;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={250} size={40} weight={500} color={S.dim}>한국부동산원 · 2026.10.12 기준 · 서울 아파트</T>
      <div style={{ position: "absolute", top: 330, left: gx - 16, width: 11 * cell + 32, height: 8 * cell + 32, background: S.night, borderRadius: 14, border: `3px solid ${S.dusk2}` }} />
      {Array.from({ length: 88 }).map((_, i) => {
        const c = i % 11;
        const r = Math.floor(i / 11);
        const p = interpolate(frame, [10 + i, 14 + i], [0, 1], clamp);
        // 마지막 줄 두 칸(강남·서초)은 100프레임 이후 파랗게 꺼진다
        const gone = i >= 86 ? interpolate(frame, [118, 130], [0, 1], clamp) : 0;
        const color = gone > 0 ? S.down : S.win;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx + c * cell + 10,
              top: 346 + r * cell + 8,
              width: cell - 20,
              height: cell - 18,
              background: color,
              opacity: p * (1 - gone * 0.45),
              boxShadow: gone > 0 ? `0 0 18px ${S.down}` : `0 0 ${14 * p}px ${S.win}`,
              borderRadius: 4,
            }}
          />
        );
      })}
      <T top={930} size={44} weight={500} at={96}>창문 1칸 = 1주 (88칸)</T>
      <Chip at={30} color={S.up} top={1010} left={90} w={430}>매매 ▲0.16%</Chip>
      <Chip at={44} color={S.up} top={1010} left={560} w={430}>전세 ▲0.18%</Chip>
      <Chip at={122} color={S.down} top={1140} left={90} w={430}>강남 ▼0.35%</Chip>
      <Chip at={134} color={S.down} top={1140} left={560} w={430}>서초 ▼0.27%</Chip>
      <Caption bottom={400} lines={PRICE_L} />
    </AbsoluteFill>
  );
};

// ───── 2. 파이프라인: 허가 → 착공 → 준공, 3년 ─────
const PIPE_L: Line[] = [
  { text: "아파트는 지어서 입주하기까지 시간이 걸려요", from: 10, to: 100, em: ["시간이"] },
  { text: "착공에서 준공까지 3년 안팎", from: 104, to: 240, em: ["3년"] },
];
const Stage: React.FC<{ x: number; label: string; at: number; children: React.ReactNode }> = ({ x, label, at, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x - 150, top: 480, width: 300, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 30}px)`, fontFamily }}>
      <div style={{ height: 230, position: "relative" }}>{children}</div>
      <div style={{ fontSize: 52, fontWeight: 900, color: S.warm, marginTop: 14 }}>{label}</div>
    </div>
  );
};
export const PipeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dot = interpolate(frame, [20, 170], [190, 890], clamp);
  const ROAD = 840;
  const bracket = interpolate(frame, [100, 140], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={270} size={44} weight={500} color={S.dim}>국토부 설명</T>
      <Stage x={190} label="인허가" at={6}>
        <div style={{ width: 150, height: 190, margin: "20px auto", background: S.warm, borderRadius: 10, padding: 18, boxSizing: "border-box" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 8, background: "#9A8FB8", margin: "14px 0", width: i === 4 ? "55%" : "100%" }} />
          ))}
        </div>
      </Stage>
      <Stage x={540} label="착공" at={40}>
        <Crane x={150} h={230} ground={230} swing={Math.sin(frame / 18) * 3} />
      </Stage>
      <Stage x={890} label="준공" at={74}>
        <div style={{ position: "absolute", left: 80, bottom: 0, width: 140, height: 220, background: S.night, border: `3px solid ${S.win}` }}>
          {Array.from({ length: 12 }).map((_, k) => (
            <div key={k} style={{ position: "absolute", left: 18 + (k % 3) * 38, top: 18 + Math.floor(k / 3) * 48, width: 20, height: 28, background: S.win, boxShadow: `0 0 10px ${S.win}` }} />
          ))}
        </div>
      </Stage>
      {/* 도로 + 움직이는 점 */}
      <div style={{ position: "absolute", left: 90, right: 90, top: ROAD, height: 8, background: "rgba(255,243,224,0.35)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: dot - 20, top: ROAD - 16, width: 40, height: 40, borderRadius: 40, background: S.orange, boxShadow: `0 0 24px ${S.orange}` }} />
      {/* 착공 → 준공 괄호 */}
      <div style={{ position: "absolute", left: 540, top: 890, width: 350 * bracket, height: 36, borderLeft: `6px solid ${S.orange}`, borderRight: `6px solid ${S.orange}`, borderBottom: `6px solid ${S.orange}`, borderRadius: "0 0 16px 16px", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 440, width: 550, top: 960, textAlign: "center", opacity: bracket }}>
        <Num size={170}>3년</Num>
        <div style={{ fontFamily, fontWeight: 500, fontSize: 40, color: S.warm }}>안팎</div>
      </div>
      <Caption bottom={400} lines={PIPE_L} />
    </AbsoluteFill>
  );
};

// ───── 3. 시차: 2023 착공 급감 → 2026 준공 -19.1% ─────
const DIP_L: Line[] = [
  { text: "2023년에 착공이 크게 줄었어요", from: 10, to: 110, em: ["2023년에", "줄었어요"] },
  { text: "3년 뒤인 올해 준공이 -19.1%", from: 114, to: 240, em: ["-19.1%"] },
];
export const DipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const left = makeCity(21, 40, 380, 120, 170, 70, 90).map((b) => ({ ...b, h: 130 + rnd(b.x) * 40 }));
  const ghost = makeCity(21, 40, 380, 330, 380, 70, 90);
  const grow = interpolate(frame, [10, 50], [0, 1], clamp);
  const arc = interpolate(frame, [90, 140], [0, 1], clamp);
  const right = makeCity(33, 590, 930, 300, 330, 70, 90);
  const growR = interpolate(frame, [120, 170], [0.55, 0.809], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={260} size={48} weight={700} left={40} right={560} align="center" color={S.warm}>2023</T>
      <T top={260} size={48} weight={700} left={560} right={40} align="center" color={S.warm}>2026</T>
      <T top={325} size={36} weight={500} left={40} right={560} color={S.dim}>착공 급감</T>
      <T top={325} size={36} weight={500} left={560} right={40} color={S.dim}>1~8월 준공</T>
      {/* 좌: 2023 착공 급감 — 점선은 평소 높이(상징) */}
      <div style={{ position: "absolute", top: -60, left: 0, right: 0, bottom: 0, transform: "translateY(0)" }}>
        <City b={ghost} color="transparent" outline ground={900} heightScale={grow} />
        <City b={left} color={S.night} ground={900} heightScale={grow} win={() => 0.9} />
      </div>
      {/* 우: 준공 — 점선 = 전년 같은 기간, 채움 = 올해 (비율 81%) */}
      <div style={{ position: "absolute", top: -60, left: 0, right: 0, bottom: 0 }}>
        <City b={right} color="transparent" outline ground={900} />
        <City b={right} color={S.night} ground={900} heightScale={growR} win={() => 0.9} />
      </div>
      <T top={940} size={40} weight={500} left={560} right={40} color={S.dim} at={150}>점선 = 전년 같은 기간</T>
      {/* 3년 화살표 */}
      <svg style={{ position: "absolute", left: 0, top: 380, opacity: arc }} width={1080} height={300} viewBox="0 0 1080 300">
        <path d="M 280 180 Q 540 -40 800 180" stroke={S.orange} strokeWidth={8} fill="none" strokeDasharray="22 14" strokeDashoffset={-frame * 3} />
        <polygon points="800,180 770,140 830,150" fill={S.orange} transform="rotate(8 800 180)" />
      </svg>
      <T top={440} size={72} weight={900} color={S.orange} at={96} left={380} right={380} style={{ opacity: arc }}>3년</T>
      <div style={{ position: "absolute", top: 1000, left: 540, right: 40, textAlign: "center", opacity: interpolate(frame, [130, 150], [0, 1], clamp) }}>
        <Num size={104} color={S.down}>−19.1%</Num>
      </div>
      <T top={1000} size={38} weight={500} left={40} right={560} at={60}>
        2022년 말 PF 위기
        <br />
        · 원자재값 급등
      </T>
      <T top={1110} size={30} weight={500} color={S.dim} left={40} right={560} at={70}>점선 = 평소 높이(상징)</T>
      <T top={1130} size={34} weight={500} color={S.dim} at={170}>준공 25,630가구 (2026.1~8월 · 국토부 보도 기준)</T>
      <Caption bottom={400} lines={DIP_L} />
    </AbsoluteFill>
  );
};

// ───── 4. 지금 늘어난 선행지표: 허가는 평균, 착공은 55% ─────
const NOW_L: Line[] = [
  { text: "허가는 3.99만 가구로 평균 수준이에요", from: 10, to: 120, em: ["3.99만", "평균"] },
  { text: "착공은 장기평균의 약 55%", from: 124, to: 240, em: ["55%"] },
];
const BarPair: React.FC<{ x: number; value: number; avg: number; label: string; sub: string; at: number; color: string }> = ({ x, value, avg, label, sub, at, color }) => {
  const frame = useCurrentFrame();
  const unit = 520; // 평균선 높이
  const h = interpolate(frame, [at, at + 50], [0, (value / avg) * unit], clamp);
  const base = 1010;
  const bw = 250;
  return (
    <>
      <div style={{ position: "absolute", left: x - bw / 2 - 30, top: base - unit, width: bw + 60, borderTop: `5px dashed ${S.warm}`, opacity: interpolate(frame, [at - 10, at], [0, 1], clamp) }} />
      <div style={{ position: "absolute", left: x - 200, width: 400, top: base - unit - 150, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 48, color }}>{fmt(Math.round(interpolate(frame, [at, at + 50], [0, value], clamp)))}</div>
      <div style={{ position: "absolute", left: x - bw / 2, top: base - h, width: bw, height: h, background: S.night, border: `4px solid ${color}`, boxSizing: "border-box" }}>
        {Array.from({ length: 5 * Math.floor(h / 42) }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 24 + (k % 5) * 44, top: 16 + Math.floor(k / 5) * 42, width: 22, height: 26, background: color, opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: x - 200, width: 400, top: base + 14, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 56, color: S.warm }}>{label}</div>
      <div style={{ position: "absolute", left: x - 230, width: 460, top: base + 84, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 30, color: S.dim }}>{sub}</div>
    </>
  );
};
export const NowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [150, 160], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={250} size={40} weight={500} color={S.dim}>점선 = 장기평균 · 쌍마다 평균선 높이를 맞춘 비교</T>
      <BarPair x={290} value={F.permit} avg={F.permitAvg} label="허가" sub="1~8월 · 서울 주택" at={20} color={S.win} />
      <BarPair x={790} value={F.start6} avg={F.start6Avg} label="착공" sub="3~8월 · 서울 아파트" at={125} color={S.orange} />
      <div style={{ position: "absolute", left: 600, width: 380, top: 545, textAlign: "center", opacity: stamp, fontFamily, fontWeight: 900, fontSize: 84, color: S.orange, transform: `rotate(-4deg) scale(${0.9 + 0.1 * stamp})` }}>≈55%</div>
      <Caption bottom={400} lines={NOW_L} />
    </AbsoluteFill>
  );
};

// ───── 5. 멸실: 이주 후 착공 대기 ─────
const VAN_L: Line[] = [
  { text: "집이 먼저 사라지기도 해요", from: 10, to: 100, em: ["먼저", "사라지기도"] },
  { text: "이주를 마쳤지만 착공 못 한 곳이 27곳", from: 104, to: 210, em: ["27곳"] },
];
export const VanishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [110, 150], [-420, 0], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={250} size={40} weight={500} color={S.dim}>이주·철거 후 착공 대기 · 보도 기준(9.23)</T>
      {Array.from({ length: 48 }).map((_, i) => {
        const c = i % 8;
        const r = Math.floor(i / 8);
        const off = interpolate(frame, [30 + rnd(i + 3) * 60, 42 + rnd(i + 3) * 60], [1, 0], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: 125 + c * 105, top: 320 + r * 92, width: 78, height: 80 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 78, height: 34, background: off > 0.5 ? S.win : "#3C3366", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <div style={{ position: "absolute", left: 10, top: 34, width: 58, height: 40, background: off > 0.5 ? S.win : "#3C3366", opacity: 0.35 + 0.65 * off }} />
          </div>
        );
      })}
      {/* 공사 가림막 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 870,
          height: 54,
          opacity: interpolate(frame, [110, 128], [0, 1], clamp),
          transform: `translateY(${drop * 0.3}px)`,
          background: "repeating-linear-gradient(45deg, #FFD02E 0 36px, #1B1B1B 36px 72px)",
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", top: 950, left: 0, right: 0, textAlign: "center" }}>
        <Num size={120}>{fmt(count(frame, 90, 50, F.existing))}</Num>
        <span style={{ fontFamily, fontWeight: 700, fontSize: 48, color: S.warm }}> 가구</span>
      </div>
      <T top={1110} size={38} weight={500} at={130}>이주 종료 후 평균 13개월째 대기 · 기존 주택</T>
      <T top={1175} size={28} weight={500} color={S.dim} at={150}>※ 아이콘 수는 상징 · 예정 물량에 대체 공급 포함(전부 순증 아님)</T>
      <Caption bottom={400} lines={VAN_L} />
    </AbsoluteFill>
  );
};

// ───── 6. 2027 입주예정 ─────
const Y27_L: Line[] = [
  { text: "2027년 서울 입주예정은 1.3만~1.7만 호", from: 10, to: 120, em: ["1.3만~1.7만"] },
  { text: "통상 적정 4.5만 호의 3분의 1 수준", from: 124, to: 240, em: ["3분의", "1"] },
];
export const Y27Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const unit = 600; // 4.5만 높이
  const base = 1010;
  const hA = interpolate(frame, [30, 80], [0, (F.y27a / F.ref) * unit], clamp);
  const hB = interpolate(frame, [60, 110], [0, (F.y27b / F.ref) * unit], clamp);
  const hRef = interpolate(frame, [8, 40], [0, unit], clamp);
  const stamp = interpolate(frame, [150, 160], [0, 1], clamp);
  const Tower = (x: number, w: number, h: number, color: string, outline?: boolean) => (
    <div style={{ position: "absolute", left: x, top: base - h, width: w, height: h, background: outline ? "transparent" : S.night, border: `4px ${outline ? "dashed" : "solid"} ${color}`, boxSizing: "border-box" }}>
      {!outline &&
        Array.from({ length: 4 * Math.floor(h / 42) }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 18 + (k % 4) * 42, top: 14 + Math.floor(k / 4) * 42, width: 22, height: 26, background: color, opacity: 0.85 }} />
        ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky />
      <T top={250} size={40} weight={500} color={S.dim}>서울 입주예정 · 2025년 말 기준 추정</T>
      {Tower(110, 230, hRef, S.warm, true)}
      {Tower(430, 230, hA, S.win)}
      {Tower(740, 230, hB, S.orange)}
      <div style={{ position: "absolute", left: 80, width: 290, top: base + 16, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 52, color: S.warm }}>4.5만</div>
      <div style={{ position: "absolute", left: 80, width: 290, top: base + 78, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: S.dim }}>통상 적정 수준</div>
      <div style={{ position: "absolute", left: 400, width: 290, top: base + 16, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 52, color: S.win }}>{fmt(Math.round(interpolate(frame, [30, 80], [0, F.y27a], clamp)))}</div>
      <div style={{ position: "absolute", left: 400, width: 290, top: base + 78, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: S.dim }}>부동산원·R114</div>
      <div style={{ position: "absolute", left: 710, width: 290, top: base + 16, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 52, color: S.orange }}>{fmt(Math.round(interpolate(frame, [60, 110], [0, F.y27b], clamp)))}</div>
      <div style={{ position: "absolute", left: 710, width: 290, top: base + 78, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: S.dim }}>R114(임대 제외)</div>
      <div style={{ position: "absolute", left: 520, width: 440, top: 380, textAlign: "center", opacity: stamp, fontFamily, fontWeight: 900, fontSize: 90, color: S.orange, transform: `rotate(-4deg) scale(${0.9 + 0.1 * stamp})` }}>약 1/3</div>
      <T top={1160} size={30} weight={500} color={S.dim} at={20}>
        기관마다 집계 기준이 달라 범위로 표기
        <br />
        4.5만은 공식 기준이 아닌 통상 평가
      </T>
      <Caption bottom={400} lines={Y27_L} />
    </AbsoluteFill>
  );
};

// ───── 7. 마무리: 2028, 새벽 ─────
const OUT_L: Line[] = [
  { text: "국토부는 2028년부터 수급이 나아질 수 있다고 봐요", from: 10, to: 120, em: ["2028년부터"] },
  { text: "단기는 입주 감소와 금리 인상, 양쪽 힘이 함께 있어요", from: 124, to: 240, em: ["양쪽"] },
];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dawn = interpolate(frame, [0, 90], [0, 1], clamp);
  const city = makeCity(41, -30, 1110, 200, 640, 90, 150);
  const back = makeCity(17, -50, 1120, 140, 380, 60, 110);
  const lit = (bi: number, c: number, r: number) => 0.55 + 0.45 * rnd(bi * 13 + c + r * 3);
  const pan = frame * 0.5;
  const colA = interpolate(frame, [50, 70], [0, 1], clamp);
  const colB = interpolate(frame, [130, 150], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Sky dawn={dawn} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-pan * 0.5}px)`, opacity: 0.7 }}>
        <City b={back} color="#4B3B7A" />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-pan}px)` }}>
        <City b={city} color={S.night} win={lit} />
        <Crane x={150} h={640} swing={Math.sin(frame / 20) * 4} />
        <Crane x={820} h={520} swing={Math.sin(frame / 24 + 2) * 4} />
      </div>
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, textAlign: "center" }}>
        <Num size={200}>2028~</Num>
      </div>
      <T top={520} size={42} weight={700} at={20}>국토부 전망 · 착공 목표 달성 시 준공 평균 웃돔</T>
      <div style={{ position: "absolute", left: 60, width: 460, top: 640, opacity: colA, fontFamily, fontSize: 36, fontWeight: 700, color: S.warm, background: "rgba(14,11,36,0.78)", border: `3px solid ${S.up}`, borderRadius: 20, padding: "16px 18px", textAlign: "center", lineHeight: 1.35 }}>
        <span style={{ color: S.up, fontWeight: 900, fontSize: 42 }}>상승 요인</span>
        <br />입주 감소 · 소득 증가
        <br />구매력 · 상승 기대
      </div>
      <div style={{ position: "absolute", right: 60, width: 460, top: 640, opacity: colB, fontFamily, fontSize: 36, fontWeight: 700, color: S.warm, background: "rgba(14,11,36,0.78)", border: `3px solid ${S.down}`, borderRadius: 20, padding: "16px 18px", textAlign: "center", lineHeight: 1.35 }}>
        <span style={{ color: S.down, fontWeight: 900, fontSize: 42 }}>하방 요인</span>
        <br />기준금리 인상
        <br />대출금리 상승
      </div>
      <T top={850} size={30} weight={700} color={S.warm} at={160} left={90} right={90} style={{ background: "rgba(14,11,36,0.82)", borderRadius: 14, padding: "10px 12px" }}>통계 해설이며 집값 전망·매수 권유가 아닙니다</T>
      <T top={925} size={26} weight={500} color={S.warm} at={170} left={90} right={90} style={{ background: "rgba(14,11,36,0.82)", borderRadius: 14, padding: "10px 12px" }}>출처: 국토부·한국부동산원 발표 보도(2026.10.19 확인) · 비율은 자체 계산</T>
      <Caption bottom={400} lines={OUT_L} />
    </AbsoluteFill>
  );
};
