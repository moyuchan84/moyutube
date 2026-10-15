import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Caption, Line } from "../components/Caption";
import { KineticTitle, Pill } from "../components/Kinetic";
import { CHART_X, LineState, RankChart, yOf } from "../components/RankChart";
import { C, springs } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

// 카메라: focus 지점을 중심으로 확대
const Camera: React.FC<{ zoom: number; fx: number; fy: number; children: React.ReactNode }> = ({ zoom, fx, fy, children }) => (
  <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${fx}px ${fy}px` }}>{children}</AbsoluteFill>
);

// 카메라가 들어가는 동안 제목은 흐려져 그래프에 시선을 모은다
const Header: React.FC<{ text: string; sub: string; fade?: number }> = ({ text, sub, fade = 0 }) => (
  <div style={{ position: "absolute", top: 150, left: 80, right: 80, opacity: 1 - fade * 0.85, filter: `blur(${fade * 6}px)` }}>
    <KineticTitle text={text} size={96} />
    <div style={{ marginTop: 18 }}>
      <KineticTitle text={sub} size={40} color={C.dim} delay={10} stagger={2} />
    </div>
  </div>
);

export const SWAP_LINES: Line[] = [
  { text: "최근 3주, 1위가 바뀌었어요.", from: 0, to: 75, em: ["1위가"] },
  { text: "첫 주는 '스캔들', 그다음 두 주는 '기안장 시즌2'.", from: 75, to: 175, em: ["'스캔들',", "시즌2'."] },
  { text: "스캔들은 1위, 2위, 3위로 한 칸씩 내려왔습니다.", from: 175, to: 285, em: ["1위,", "2위,", "3위로"] },
];

export const SwapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state: Record<string, LineState> = {
    scandal: { progress: ramp(frame, 20, 90), opacity: 1, glow: ramp(frame, 175, 190) },
    kian2: { progress: ramp(frame, 95, 125), opacity: ramp(frame, 90, 96), glow: 0 },
    fourhands: { progress: ramp(frame, 40, 100), opacity: 0.35, glow: 0 },
    kian1: { progress: 0, opacity: 0, glow: 0 },
  };
  // 1위 교체 지점(2주차 1위)으로 줌인했다가, 스캔들 하락 구간에서 다시 빠짐
  const zoom = interpolate(frame, [125, 160, 200, 240], [1, 1.4, 1.4, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const badge = spring({ frame: frame - 135, fps, config: springs.bouncy });
  return (
    <AbsoluteFill>
      <Header text="1위가 바뀐 순간" sub="넷플릭스 한국 TV TOP 10 · 최근 3주" fade={(zoom - 1) / 0.4} />
      <Camera zoom={zoom} fx={CHART_X[1]} fy={yOf(1)}>
        <RankChart state={state} gridIn={ramp(frame, 0, 30)} />
        {frame > 130 && (
          <div style={{ position: "absolute", left: CHART_X[1] - 120, top: yOf(1) - 130 }}>
            <Pill color={C.accent} scale={badge}>1위 교체!</Pill>
          </div>
        )}
      </Camera>
      <Caption lines={SWAP_LINES} />
    </AbsoluteFill>
  );
};

export const COMEBACK_LINES: Line[] = [
  { text: "재밌는 건 시즌1이에요.", from: 0, to: 60, em: ["시즌1이에요."] },
  { text: "3주 전엔 TOP 10에 없었는데,", from: 60, to: 140, em: ["없었는데,"] },
  { text: "시즌2가 나오자 10위, 7위로 다시 올라왔습니다.", from: 140, to: 225, em: ["10위,", "7위로"] },
  { text: "새 시즌이 옛 시즌을 끌어올린 셈이죠.", from: 225, to: 300, em: ["끌어올린"] },
];

export const ComebackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dim = 0.18;
  const state: Record<string, LineState> = {
    scandal: { progress: 1, opacity: dim, glow: 0 },
    kian2: { progress: 1, opacity: interpolate(frame, [100, 140], [dim, 0.8], clamp), glow: 0 },
    fourhands: { progress: 1, opacity: dim, glow: 0 },
    kian1: { progress: ramp(frame, 60, 200), opacity: ramp(frame, 40, 60), glow: 1 },
  };
  // 시즌1 선의 머리를 따라 카메라가 아래에서 위로 이동
  const fy = interpolate(frame, [40, 200], [yOf("out"), yOf(7)], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = interpolate(frame, [30, 70, 210, 260], [1, 1.2, 1.2, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const badge = spring({ frame: frame - 205, fps, config: springs.bouncy });
  return (
    <AbsoluteFill>
      <Header text="시즌1의 역주행" sub="TOP 10 밖 → 10위 → 7위" />
      <Camera zoom={zoom} fx={480} fy={fy}>
        <RankChart state={state} gridIn={1} />
        {frame > 200 && (
          <div style={{ position: "absolute", left: CHART_X[2] - 380, top: yOf(7) + 40 }}>
            <Pill color="#5FD4FF" scale={badge}>새 시즌 효과 ↑</Pill>
          </div>
        )}
      </Camera>
      <Caption lines={COMEBACK_LINES} />
    </AbsoluteFill>
  );
};
