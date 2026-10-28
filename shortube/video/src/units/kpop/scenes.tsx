import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { KineticTitle } from "../../components/Kinetic";
import { clamp, Counter, Stamp } from "../market/effects";
import { C, fontFamily } from "../../theme";
import { K } from "./effects";

// 숫자는 output/briefs/2026-10-15_slot3.md 사실 카드(K1~K7)에서만 가져온다.
// 인물 사진·무대 캡처·로고·음원 없음. 멤버 개인(미성년) 정보 없음.

const pop = { damping: 9, stiffness: 170 };

// 화면 위쪽 작은 꼬리표 "숫자 N/5"
const Chip: React.FC<{ n: number; color: string }> = ({ n, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: pop });
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", opacity: p }}>
      <span style={{ fontFamily, fontWeight: 900, fontSize: 38, color: "#111", background: color, borderRadius: 999, padding: "10px 30px" }}>숫자 {n} / 5</span>
    </div>
  );
};

// 네온 큰 숫자
const BigNum: React.FC<{ at: number; color: string; children: React.ReactNode; top?: number; size?: number }> = ({ at, color, children, top = 340, size = 380 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: pop });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -14,
        color: "#fff",
        opacity: frame >= at ? 1 : 0,
        transform: `scale(${0.3 + p * 0.7}) rotate(${(1 - p) * -12}deg)`,
        textShadow: `0 0 30px ${color}, 0 0 90px ${color}, 0 14px 0 ${color}`,
      }}
    >
      {children}
    </div>
  );
};

const Sub: React.FC<{ at: number; top: number; children: React.ReactNode; size?: number; color?: string }> = ({ at, top, children, size = 48, color = C.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily, fontWeight: 800, fontSize: size, color, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      {children}
    </div>
  );
};

// 0. 인트로
const INTRO: Line[] = [
  { text: "이수만이 다시 아이돌을 냈습니다", from: 8, to: 60, em: ["다시"] },
  { text: "숫자 5개로 볼게요", from: 60, to: 105, em: ["5개로"] },
];
export const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
      <KineticTitle text="A2O LITE" size={200} color="#fff" stagger={6} />
    </div>
    <Sub at={18} top={790} size={46} color={K.cyan}>
      에이투오 라이트 · 'A20' 아니고 영문 O
    </Sub>
    <Sub at={32} top={870} size={42}>
      <span style={{ background: K.pink, color: "#111", borderRadius: 14, padding: "6px 22px" }}>SM 아님 · A2O엔터테인먼트</span>
    </Sub>
    <Caption lines={INTRO} />
  </AbsoluteFill>
);

// 1. 30 — H.O.T. 1996 → 2026
const L30: Line[] = [
  { text: "H.O.T.가 1996년이었죠", from: 10, to: 90, em: ["1996년이었죠"] },
  { text: "올해로 딱 30년입니다", from: 90, to: 180, em: ["30년입니다"] },
];
export const Scene30: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [40, 110], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Chip n={1} color={K.yellow} />
      <BigNum at={20} color={K.yellow}>
        <Counter from={0} to={30} start={20} dur={30} digits={0} />
      </BigNum>
      <Sub at={30} top={740} size={56}>
        년
      </Sub>
      <div style={{ position: "absolute", top: 900, left: 100, right: 100, fontFamily }}>
        <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: `linear-gradient(90deg, ${K.yellow}, ${K.pink})`, boxShadow: `0 0 30px ${K.yellow}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontWeight: 900, fontSize: 52, color: "#fff" }}>
          <span>1996</span>
          <span style={{ opacity: bar }}>2026</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 34, color: C.dim }}>
          <span>H.O.T. 데뷔</span>
          <span style={{ opacity: bar }}>A2O LITE 데뷔</span>
        </div>
      </div>
      <Caption lines={L30} />
    </AbsoluteFill>
  );
};

// 2. 3 — 3년 국내 제작 제한, 2026년 2월 해제
const L3: Line[] = [
  { text: "2023년 SM 지분을 팔며 한 약속", from: 10, to: 80 },
  { text: "'3년 동안 국내 제작 안 하기'", from: 80, to: 145, em: ["3년"] },
  { text: "그게 올해 2월에 풀렸죠", from: 145, to: 210, em: ["풀렸죠"] },
];
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [60, 140], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const open = spring({ frame: frame - 145, fps, config: pop });
  return (
    <AbsoluteFill>
      <Chip n={2} color={K.cyan} />
      <BigNum at={20} color={K.cyan}>
        3<span style={{ fontSize: 160, letterSpacing: 0 }}>년</span>
      </BigNum>
      <Sub at={40} top={760} size={40} color={C.dim}>
        2023 · SM 지분 14.8% 하이브에 매각
      </Sub>
      {/* 진행 막대 */}
      <div style={{ position: "absolute", top: 880, left: 100, right: 230, fontFamily }}>
        <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${K.cyan}, ${K.violet})`, boxShadow: `0 0 30px ${K.cyan}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontWeight: 900, fontSize: 44, color: "#fff" }}>
          <span>2023</span>
          <span>2026.02</span>
        </div>
      </div>
      {/* 자물쇠 */}
      <svg width={140} height={170} style={{ position: "absolute", top: 830, right: 70 }} viewBox="0 0 140 170">
        <path
          d="M35 75 V50 a35 35 0 0 1 70 0 V75"
          fill="none"
          stroke={open > 0.5 ? K.yellow : "#fff"}
          strokeWidth={14}
          strokeLinecap="round"
          transform={`translate(0 ${-open * 26}) rotate(${-open * 28} 105 75)`}
        />
        <rect x={15} y={75} width={110} height={85} rx={18} fill={open > 0.5 ? K.yellow : "#fff"} />
      </svg>
      <Caption lines={L3} />
    </AbsoluteFill>
  );
};

// 3. 24 — 9 + 15
const L24: Line[] = [
  { text: "그리고 10월 12일 킨텍스", from: 10, to: 70 },
  { text: "걸그룹 9명 + 보이그룹 15명", from: 70, to: 130, em: ["9명", "15명"] },
  { text: "신인 24명이 한날 데뷔", from: 130, to: 195, em: ["24명이"] },
];
export const Scene24: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merge = interpolate(frame, [70, 82], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dots = [...Array(9).fill(K.pink), ...Array(15).fill(K.cyan)];
  return (
    <AbsoluteFill>
      <Chip n={3} color={K.pink} />
      {merge < 1 &&
        dots.map((c, i) => {
          const lite = i < 9;
          const j = lite ? i : i - 9;
          const cols = lite ? 3 : 5;
          const gx = (lite ? 200 : 600) + (j % cols) * 80;
          const gy = 520 + Math.floor(j / cols) * 80;
          const p = spring({ frame: frame - 6 - i * 1.5, fps, config: pop });
          const x = gx + (540 - gx) * merge;
          const y = gy + (620 - gy) * merge;
          return <div key={i} style={{ position: "absolute", left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: 28, background: c, transform: `scale(${p})`, boxShadow: `0 0 24px ${c}` }} />;
        })}
      {merge < 1 && (
        <>
          <Sub at={20} top={800} size={40} color={K.pink}>
            <span style={{ position: "relative", left: -200 }}>A2O LITE 9</span>
          </Sub>
          <Sub at={30} top={800} size={40} color={K.cyan}>
            <span style={{ position: "relative", left: 180 }}>A2O SOUL 15</span>
          </Sub>
        </>
      )}
      <BigNum at={80} color={K.pink} top={400}>
        24<span style={{ fontSize: 150, letterSpacing: 0 }}>명</span>
      </BigNum>
      <Sub at={95} top={820} size={44} color={C.dim}>
        2026.10.12 · 킨텍스 데뷔쇼
      </Sub>
      <Caption lines={L24} />
    </AbsoluteFill>
  );
};

// 4. 1 — 하루 만에 멜론 1위
const L1: Line[] = [
  { text: "데뷔곡 'NEON'은", from: 10, to: 70 },
  { text: "나온 지 하루 만에 멜론 1위", from: 70, to: 195, em: ["하루", "1위"] },
];
export const Scene1: React.FC = () => (
  <AbsoluteFill>
    <Chip n={4} color={K.yellow} />
    <BigNum at={12} color={K.violet} top={330} size={300}>
      D+1
    </BigNum>
    <Stamp at={30} color={K.yellow} rotate={-7} style={{ top: 720, left: 170, right: 170, fontSize: 80 }}>
      멜론 TOP100 1위
      <div style={{ fontSize: 34, marginTop: 6 }}>10/14 오후 11시 기준</div>
    </Stamp>
    <Sub at={60} top={1010} size={40} color={C.dim}>
      'NEON' · 3분 28초 · 10/13 발표
    </Sub>
    <Caption lines={L1} />
  </AbsoluteFill>
);

// 5. 25 — 보아 SM 25년 → 2026 A2O
const L25: Line[] = [
  { text: "이수만이 발탁한 보아는", from: 10, to: 70 },
  { text: "올해 1월 SM과의 25년을 마무리", from: 70, to: 130, em: ["25년을"] },
  { text: "같은 해, 이수만은 새 회사로 돌아왔습니다", from: 130, to: 195, em: ["새", "회사로"] },
];
export const Scene25: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segs = Math.floor(interpolate(frame, [40, 100], [0, 25], clamp));
  const arrow = spring({ frame: frame - 115, fps, config: pop });
  return (
    <AbsoluteFill>
      <Chip n={5} color={K.violet} />
      <BigNum at={20} color={K.violet}>
        <Counter from={0} to={25} start={40} dur={60} digits={0} />
        <span style={{ fontSize: 150, letterSpacing: 0 }}>년</span>
      </BigNum>
      <div style={{ position: "absolute", top: 800, left: 80, right: 80, fontFamily }}>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 60, borderRadius: 6, background: i < segs ? K.violet : "rgba(255,255,255,0.1)", boxShadow: i < segs ? `0 0 14px ${K.violet}` : "none" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontWeight: 900, fontSize: 44, color: "#fff" }}>
          <span>2000 보아 데뷔</span>
          <span>2025</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1010,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontSize: 60,
          color: K.yellow,
          opacity: arrow,
          transform: `translateX(${(1 - arrow) * -300}px)`,
          textShadow: `0 0 30px ${K.yellow}`,
        }}
      >
        → 2026 이수만, A2O로
      </div>
      <Caption lines={L25} />
    </AbsoluteFill>
  );
};

// 6. 아웃트로 — 숫자 5개 정렬
const NUMS = [
  { n: "30", c: K.yellow, l: "년" },
  { n: "3", c: K.cyan, l: "년" },
  { n: "24", c: K.pink, l: "명" },
  { n: "1", c: K.violet, l: "일" },
  { n: "25", c: K.violet, l: "년" },
];
const LOUT: Line[] = [{ text: "다음 숫자는 뭐가 될까요?", from: 60, to: 150, em: ["다음", "숫자는"] }];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: 40, right: 40, display: "flex", justifyContent: "space-around", fontFamily }}>
        {NUMS.map((x, i) => {
          const p = spring({ frame: frame - 6 - i * 6, fps, config: pop });
          return (
            <div key={i} style={{ textAlign: "center", transform: `translateY(${(1 - p) * 200}px) scale(${p})` }}>
              <div style={{ fontWeight: 900, fontSize: 150, color: "#fff", textShadow: `0 0 30px ${x.c}, 0 8px 0 ${x.c}`, lineHeight: 1 }}>{x.n}</div>
              <div style={{ fontWeight: 800, fontSize: 40, color: x.c, marginTop: 10 }}>{x.l}</div>
            </div>
          );
        })}
      </div>
      <Sub at={30} top={860} size={52}>
        이수만의 귀환, 숫자로 보면
      </Sub>
      <Sub at={45} top={1000} size={30} color={C.dim}>
        2026.10.15 기준
        <br />
        출처: Korea Times, 헤럴드경제, SBS, 노컷뉴스, 경향신문
      </Sub>
      <Caption lines={LOUT} />
    </AbsoluteFill>
  );
};
