import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSerifKR";
import { Caption, Line } from "../../components/Caption";
import { KineticTitle } from "../../components/Kinetic";
import { clamp, Counter, Stamp } from "../market/effects";
import { C, fontFamily } from "../../theme";
import { HEAT, Leaves, Paper, Thermometer } from "./fx";
import KOREA from "../../../../content/heat/script/korea.json";
import TL from "../../../../content/heat/script/timeline.json";

// 숫자는 output/briefs/2026-10-16_slot1.md 사실 카드(H01~H09)에서만 가져온다.
// 지도: Natural Earth 1:50m (퍼블릭 도메인) → korea.json. 사진·로고 없음.

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"] });
const soft = { damping: 14, stiffness: 140 };

const Title: React.FC<{ children: React.ReactNode; top?: number; color?: string; size?: number }> = ({ children, top = 230, color = C.text, size = 66 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: soft });
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, fontFamily, fontWeight: 900, fontSize: size, color, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      {children}
    </div>
  );
};

const Fade: React.FC<{ at: number; top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, top, children, style }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, fontFamily, fontWeight: 700, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, ...style }}>
      {children}
    </div>
  );
};

// 0. 훅 — 온도계가 차오르고 30.1℃ 가 박힌다
const HOOK_L: Line[] = [{ text: "10월 12일, 서울 30.1도", from: 12, to: 100, em: ["30.1도"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const level = interpolate(frame, [5, 35], [0.15, 0.93], clamp);
  return (
    <AbsoluteFill>
      <Thermometer level={level} color={HEAT.hot} style={{ left: 50, top: 560 }} />
      {/* 달력 카드 */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 300,
          width: 420,
          borderRadius: 26,
          overflow: "hidden",
          background: "#fff",
          fontFamily,
          textAlign: "center",
          transform: `perspective(900px) rotateX(${(1 - card) * -90}deg)`,
          transformOrigin: "top center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ background: HEAT.hot, color: "#fff", fontWeight: 900, fontSize: 44, padding: "10px 0" }}>2026 · 10월</div>
        <div style={{ color: "#1a1a1a", fontWeight: 900, fontSize: 150, lineHeight: 1.1 }}>12</div>
        <div style={{ color: "#555", fontWeight: 700, fontSize: 36, paddingBottom: 14 }}>서울 낮 최고기온</div>
      </div>
      <div style={{ position: "absolute", top: 820, left: 230, right: 30, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 230, color: HEAT.cream, textShadow: `0 0 60px ${HEAT.hot}` }}>
        <Counter from={0} to={30.1} start={5} dur={30} digits={1} />
        <span style={{ fontSize: 120 }}>℃</span>
      </div>
      <Stamp at={35} color={HEAT.amber} rotate={-7} style={{ top: 1130, left: 330, fontSize: 70 }}>
        10월 맞아?
      </Stamp>
      <Caption lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 오해 — "신기록"에 줄이 그어진다
const MYTH_L: Line[] = [
  { text: "뉴스에선 신기록이라고 했죠", from: 0, to: 65, em: ["신기록이라고"] },
  { text: "그런데 사실은 아닙니다", from: 65, to: 140, em: ["아닙니다"] },
];
export const MythScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [62, 74], [0, 1], clamp);
  const shake = frame >= 70 && frame < 84 ? Math.sin(frame * 3) * (84 - frame) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: 70, right: 70, textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 56, color: C.dim }}>서울 10월 최고기온</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
          <KineticTitle text="역대 신기록!" size={150} color={HEAT.cream} />
          <div
            style={{
              position: "absolute",
              left: -20,
              top: "52%",
              height: 22,
              width: `${strike * 105}%`,
              background: HEAT.hot,
              borderRadius: 11,
              transform: "rotate(-4deg)",
              boxShadow: `0 0 30px ${HEAT.hot}`,
            }}
          />
        </div>
      </div>
      <Fade at={78} top={900} style={{ textAlign: "center", fontSize: 90, fontWeight: 900, color: HEAT.amber }}>
        사실은 아닙니다
      </Fade>
      <Caption lines={MYTH_L} />
    </AbsoluteFill>
  );
};

// 2. 1913 vs 2026 — 위는 빛바랜 종이, 아래는 지금
const TWIN_L: Line[] = [
  { text: "1913년 10월 3일에도 서울은 30.1도", from: 0, to: 130, em: ["1913년", "30.1도"] },
  { text: "값이 똑같습니다", from: 130, to: 240, em: ["똑같습니다"] },
];
export const TwinScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = spring({ frame: frame - 4, fps, config: soft });
  const bottom = spring({ frame: frame - 66, fps, config: soft });
  const temp2 = interpolate(frame, [118, 128], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, height: 560, opacity: top, transform: `translateY(${(1 - top) * -80}px) rotate(-1.5deg)` }}>
        <Paper style={{ inset: 0, borderRadius: 18 }} />
        <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: serif, color: HEAT.ink }}>
          <div style={{ marginTop: 50, fontSize: 64, fontWeight: 700, letterSpacing: 6 }}>1913. 10. 03</div>
          <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1.15 }}>30.1℃</div>
          <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.75 }}>서울 · 그때까지의 10월 최고</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 60,
          right: 60,
          height: 520,
          borderRadius: 18,
          background: `linear-gradient(160deg, ${HEAT.hot}, #B3200E)`,
          boxShadow: `0 0 80px ${HEAT.hot}88`,
          opacity: bottom,
          transform: `translateY(${(1 - bottom) * 120}px) rotate(1deg)`,
          textAlign: "center",
          fontFamily,
          color: "#fff",
        }}
      >
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 900, letterSpacing: 4 }}>
          {Math.round(interpolate(frame, [70, 115], [1913, 2026], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }))}
          {frame >= 115 ? ". 10. 12" : ""}
        </div>
        <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1.15, opacity: temp2, transform: `scale(${1 + (1 - temp2) * 0.4})` }}>30.1℃</div>
        <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.85 }}>서울 · 이번 10월</div>
      </div>
      <Stamp at={150} color={HEAT.amber} rotate={0} style={{ top: 770, left: 380, right: 380, fontSize: 110, padding: "0 20px", lineHeight: 1.1 }}>
        =
      </Stamp>
      <Fade at={172} top={1410} style={{ textAlign: "center", fontSize: 44, color: HEAT.cream }}>
        113년 사이, 같은 값
      </Fade>
      <Caption lines={TWIN_L} />
    </AbsoluteFill>
  );
};

// 3. 순위 원칙 — 같은 값이면 최근 기록이 위로
const RULE_L: Line[] = [
  { text: "기상청은 같은 값이면 최근 기록을 위에 둡니다", from: 0, to: 110, em: ["최근"] },
  { text: "그래서 1위가 바뀐 거예요", from: 110, to: 180, em: ["1위가"] },
];
const RankCard: React.FC<{ date: string; y: number; hot?: boolean }> = ({ date, y, hot }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 230,
      right: 70,
      height: 190,
      borderRadius: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 44px",
      background: hot ? `linear-gradient(120deg, ${HEAT.hot}, #C2330F)` : "rgba(233,216,180,0.92)",
      color: hot ? "#fff" : HEAT.ink,
      fontFamily: hot ? fontFamily : serif,
      boxShadow: hot ? `0 0 50px ${HEAT.hot}77` : "0 10px 30px rgba(0,0,0,0.35)",
    }}
  >
    <div style={{ fontSize: 52, fontWeight: 900 }}>{date}</div>
    <div style={{ fontSize: 78, fontWeight: 900 }}>30.1℃</div>
  </div>
);
export const RuleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swap = spring({ frame: frame - 60, fps, config: { damping: 13, stiffness: 120 } });
  const lift = Math.sin(Math.min(1, swap) * Math.PI) * 40;
  const Y1 = 470;
  const Y2 = 700;
  return (
    <AbsoluteFill>
      <Title>서울 10월 최고기온 순위</Title>
      {[
        { y: Y1, label: "1위" },
        { y: Y2, label: "" },
      ].map((s) => (
        <div key={s.y} style={{ position: "absolute", top: s.y + 50, left: 70, width: 140, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 64, color: HEAT.amber }}>
          {s.label}
        </div>
      ))}
      <div style={{ transform: `translateX(${lift}px)` }}>
        <RankCard date="1913.10.03" y={Y1 + (Y2 - Y1) * swap} />
      </div>
      <div style={{ transform: `translateX(${-lift}px)` }}>
        <RankCard date="2026.10.12" y={Y2 + (Y1 - Y2) * swap} hot />
      </div>
      <Fade at={90} top={1000} style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block", border: `4px solid ${HEAT.amber}`, borderRadius: 24, padding: "22px 36px", background: "rgba(0,0,0,0.35)" }}>
          <div style={{ fontSize: 44, color: HEAT.cream }}>같은 값이면 → 최근 기록이 위로</div>
          <div style={{ fontSize: 32, color: C.dim, marginTop: 8 }}>기상청 기록 순위 원칙</div>
        </div>
      </Fade>
      <Caption lines={RULE_L} />
    </AbsoluteFill>
  );
};

// 4. 지도 — 대전으로 날아가 확대, 다시 빠지며 신기록 지점이 켜진다
const LON0 = 124.6;
const LAT0 = 38.7;
const SX = 140;
const SY = 173;
const OX = 90;
const OY = 330;
const proj = ([lon, lat]: number[]) => [(lon - LON0) * SX + OX, (LAT0 - lat) * SY + OY] as const;
const ringPath = (ring: number[][]) => ring.map((p, i) => `${i ? "L" : "M"}${proj(p).map((v) => v.toFixed(1)).join(" ")}`).join(" ") + "Z";
const KOR_D = KOREA.KOR.map(ringPath).join(" ");
const PRK_D = KOREA.PRK.map(ringPath).join(" ");

// 지점 좌표는 시청 근처 대략값 (지도 표시용). 라벨은 좌우 여백으로 끌어내 겹치지 않게 한다
type St = { n: string; v: string; lon: number; lat: number; side: "L" | "R"; ly: number };
const DAEJEON = { lon: 127.38, lat: 36.35 };
const SEOUL = { lon: 126.98, lat: 37.57 };
const STATIONS: St[] = [
  { n: "정읍", v: "31.1", lon: 126.86, lat: 35.57, side: "L", ly: 880 },
  { n: "청주", v: "30.6", lon: 127.49, lat: 36.64, side: "L", ly: 650 },
  { n: "구미", v: "30.0", lon: 128.34, lat: 36.12, side: "R", ly: 810 },
  { n: "춘천", v: "28.8", lon: 127.73, lat: 37.88, side: "R", ly: 420 },
  { n: "영월", v: "29.8", lon: 128.46, lat: 37.18, side: "R", ly: 600 },
  { n: "상주", v: "29.5", lon: 128.16, lat: 36.41, side: "R", ly: 740 },
  { n: "원주", v: "29.3", lon: 127.92, lat: 37.34, side: "R", ly: 480 },
  { n: "이천", v: "29.1", lon: 127.44, lat: 37.27, side: "L", ly: 570 },
  { n: "안동", v: "29.0", lon: 128.73, lat: 36.57, side: "R", ly: 670 },
  { n: "정선", v: "28.8", lon: 128.66, lat: 37.38, side: "R", ly: 540 },
];
const MAP_L: Line[] = [
  { text: "진짜 신기록은 따로 있습니다", from: 0, to: 110, em: ["진짜"] },
  { text: "대전 31.5도, 2021년 31.2도를 넘었죠", from: 110, to: 250, em: ["31.5도,"] },
  { text: "정읍, 청주, 구미, 춘천도 10월 기록을 새로 썼습니다", from: 250, to: 420, em: ["새로"] },
];
export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [0, 45], [0, 1], clamp);
  const zoomIn = spring({ frame: frame - 45, fps, config: { damping: 18, stiffness: 70 } });
  const zoomOut = spring({ frame: frame - 205, fps, config: { damping: 18, stiffness: 70 } });
  const z = 1 + 1.3 * (zoomIn - zoomOut);
  const [dx, dy] = proj([DAEJEON.lon, DAEJEON.lat]);
  const [sx, sy] = proj([SEOUL.lon, SEOUL.lat]);
  const card = spring({ frame: frame - 100, fps, config: soft });
  const cardOut = interpolate(frame, [200, 215], [1, 0], clamp);
  const pops = TL.pops.map((p) => p - TL.scenes.find((s) => s.id === "map")!.from);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${dx}px ${dy}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs>
            <clipPath id="map-clip">
              <rect x={0} y={OY - 20} width={1080} height={1100} />
            </clipPath>
          </defs>
          <g clipPath="url(#map-clip)">
            <path d={PRK_D} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
            <path d={KOR_D} fill={`rgba(255,120,60,${0.18 * draw})`} stroke={HEAT.amber} strokeWidth={4} strokeDasharray={6000} strokeDashoffset={6000 * (1 - draw)} strokeLinejoin="round" />
          </g>
          {/* 대전 */}
          <circle cx={dx} cy={dy} r={14 + Math.sin(frame * 0.3) * 3} fill={HEAT.hot} stroke="#fff" strokeWidth={4} opacity={draw} />
          <circle cx={dx} cy={dy} r={14 + ((frame % 40) / 40) * 50} fill="none" stroke={HEAT.hot} strokeWidth={3} opacity={(1 - (frame % 40) / 40) * draw} />
          {/* 서울 (동률) */}
          <circle cx={sx} cy={sy} r={11} fill="#fff" opacity={draw} />
        </svg>
      </div>
      {/* 서울 라벨 (확대 중엔 숨김) */}
      <div style={{ position: "absolute", top: sy - 78, left: 70, width: sx - 50, textAlign: "right", whiteSpace: "nowrap", fontFamily, fontWeight: 700, fontSize: 30, color: "#fff", opacity: draw * (1 - zoomIn + zoomOut) }}>
        서울 30.1 <span style={{ color: "#C9B9A8" }}>= 1913년</span>
      </div>
      {/* 제목은 확대된 지도 위에 보이도록 지도 뒤에 그린다 */}
      <Title top={200} size={60}>
        <span style={{ background: "rgba(20,6,2,0.7)", borderRadius: 16, padding: "4px 18px", marginLeft: -18 }}>10월 기록을 새로 쓴 곳</span>
      </Title>
      {/* 대전 라벨 (확대가 끝난 뒤) */}
      <div
        style={{
          position: "absolute",
          top: 734,
          right: 1080 - 296,
          fontFamily,
          fontWeight: 900,
          fontSize: 40,
          color: HEAT.hot,
          whiteSpace: "nowrap",
          opacity: interpolate(frame, [225, 240], [0, 1], clamp),
        }}
      >
        대전 31.5
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: interpolate(frame, [225, 240], [0, 1], clamp) }}>
        <line x1={dx} y1={dy} x2={300} y2={760} stroke="rgba(255,77,46,0.7)" strokeWidth={3} />
      </svg>
      {/* 대전 카드 */}
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 120,
          right: 120,
          borderRadius: 28,
          padding: "26px 30px",
          background: "rgba(20,6,2,0.85)",
          border: `4px solid ${HEAT.hot}`,
          textAlign: "center",
          fontFamily,
          opacity: card * cardOut,
          transform: `scale(${0.8 + 0.2 * card})`,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 900, color: HEAT.cream }}>대전</div>
        <div style={{ fontSize: 130, fontWeight: 900, color: HEAT.hot, lineHeight: 1.1 }}>
          <Counter from={31.2} to={31.5} start={120} dur={30} digits={1} />℃
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.dim }}>종전 31.2℃ (2021.10.03)</div>
      </div>
      {/* 다른 지점: 점 + 끌어낸 라벨 */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {STATIONS.map((s, i) => {
          const p = spring({ frame: frame - pops[i], fps, config: { damping: 11 } });
          if (frame < pops[i]) return null;
          const [x, y] = proj([s.lon, s.lat]);
          const lx = s.side === "L" ? 300 : 790;
          return (
            <g key={s.n} opacity={Math.min(1, p * 1.4)}>
              <line x1={x} y1={y} x2={x + (lx - x) * p} y2={y + (s.ly - y) * p} stroke="rgba(255,244,224,0.55)" strokeWidth={2} />
              <circle cx={x} cy={y} r={11 * p} fill={HEAT.amber} stroke="#fff" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {STATIONS.map((s, i) => {
        const p = spring({ frame: frame - pops[i] - 4, fps, config: { damping: 12 } });
        if (frame < pops[i]) return null;
        const left = s.side === "L";
        return (
          <div
            key={s.n}
            style={{
              position: "absolute",
              top: s.ly - 26,
              ...(left ? { right: 1080 - 296 } : { left: 794 }),
              fontFamily,
              fontWeight: 900,
              fontSize: 36,
              color: HEAT.cream,
              whiteSpace: "nowrap",
              opacity: p,
              transform: `translateX(${(1 - p) * (left ? -30 : 30)}px)`,
            }}
          >
            {s.n} <span style={{ color: HEAT.amber }}>{s.v}</span>
          </div>
        );
      })}
      <Caption lines={MAP_L} />
    </AbsoluteFill>
  );
};

// 5. 원인 — 산을 넘으며 데워지는 바람 (방향 화살표는 그리지 않음: 보도마다 바람 방향 서술이 다름)
const WHY_L: Line[] = [
  { text: "따뜻하고 습한 남풍에", from: 0, to: 60, em: ["남풍에"] },
  { text: "산을 넘으며 데워진 바람까지", from: 60, to: 150, em: ["데워진"] },
];
const MOUNTAIN = "M0 1380 L180 1300 L300 1180 L420 1060 L520 980 L600 1040 L700 1120 L820 1230 L960 1300 L1080 1340 L1080 1500 L0 1500 Z";
export const WhyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = ["따뜻하고 습한 남풍", "강한 햇볕", "산을 넘으며 데워진 바람 (푄)"];
  return (
    <AbsoluteFill>
      <Title>왜 이렇게 더웠나</Title>
      {chips.map((c, i) => {
        const p = spring({ frame: frame - 6 - i * 22, fps, config: soft });
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              top: 370 + i * 115,
              left: 70,
              fontFamily,
              fontWeight: 900,
              fontSize: 48,
              color: "#1a0a04",
              background: i === 2 ? HEAT.hot : HEAT.amber,
              borderRadius: 999,
              padding: "14px 34px",
              opacity: p,
              transform: `translateX(${(1 - p) * -200}px)`,
            }}
          >
            {c}
          </div>
        );
      })}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="wind" x1="0" x2="1">
            <stop offset="0" stopColor={HEAT.amber} />
            <stop offset="0.55" stopColor={HEAT.amber} />
            <stop offset="1" stopColor={HEAT.hot} />
          </linearGradient>
          <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5A2A18" />
            <stop offset="1" stopColor="#1A0805" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((k) => {
          const y = 1290 - k * 40;
          const d = `M -50 ${y} C 250 ${y - 40}, 380 ${880 - k * 30}, 520 ${900 - k * 40} S 800 ${y - 120}, 1130 ${y - 60}`;
          const off = -((frame * 14 + k * 90) % 400);
          return <path key={k} d={d} fill="none" stroke="url(#wind)" strokeWidth={10 - k} strokeLinecap="round" strokeDasharray="160 240" strokeDashoffset={off} opacity={0.85} />;
        })}
        <path d={MOUNTAIN} fill="url(#mtn)" />
      </svg>
      <Caption lines={WHY_L} />
    </AbsoluteFill>
  );
};

// 6. 식는다 — 색이 파랗게, 온도계가 내려가고 낙엽이 떨어진다
const COOL_L: Line[] = [{ text: "그리고 하루 만에 5~9도 뚝", from: 6, to: 120, em: ["5~9도", "뚝"] }];
export const CoolScene: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [0, 40], [0.93, 0.55], clamp);
  const drop = interpolate(frame, [0, 14], [-80, 0], clamp);
  return (
    <AbsoluteFill>
      <Leaves from={10} />
      <Thermometer level={level} color={HEAT.cool} style={{ left: 50, top: 520 }} />
      <div style={{ position: "absolute", top: 560, left: 250, right: 40, textAlign: "center", fontFamily, transform: `translateY(${drop}px)` }}>
        <div style={{ fontSize: 50, fontWeight: 700, color: HEAT.ice }}>다음 날 낮 최고기온</div>
        <div style={{ fontSize: 210, fontWeight: 900, color: "#fff", textShadow: `0 0 50px ${HEAT.cool}`, lineHeight: 1.15 }}>
          ▼5~9<span style={{ fontSize: 110 }}>℃</span>
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, color: HEAT.ice }}>13일 20~26℃ · 예보</div>
      </div>
      <Caption lines={COOL_L} />
    </AbsoluteFill>
  );
};

// 7. 정리 + 출처
const OUTRO_L: Line[] = [{ text: "가을은 이렇게 바뀝니다", from: 0, to: 120 }];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { k: "서울 30.1℃", v: "1913년과 같은 값 · 순위 원칙으로 1위", c: "#fff" },
    { k: "대전 31.5℃", v: "10월 신기록 (종전 31.2℃)", c: HEAT.amber },
  ];
  return (
    <AbsoluteFill>
      <Leaves from={-60} count={10} />
      <Title top={300}>한 줄 정리</Title>
      {rows.map((r, i) => {
        const p = spring({ frame: frame - 8 - i * 14, fps, config: soft });
        return (
          <div key={r.k} style={{ position: "absolute", top: 450 + i * 200, left: 70, right: 70, fontFamily, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ fontSize: 76, fontWeight: 900, color: r.c }}>{r.k}</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: HEAT.ice }}>{r.v}</div>
          </div>
        );
      })}
      <Fade at={30} top={1010} style={{ fontSize: 30, color: "#B9C6DA", lineHeight: 1.5 }}>
        출처: 기상청 발표 인용 보도 (한국일보 · 재경일보 · 뉴스웍스)
        <br />
        2026.10.12 관측 · 13일 예보 기준 · 지도 Natural Earth
      </Fade>
      <Caption lines={OUTRO_L} />
    </AbsoluteFill>
  );
};
