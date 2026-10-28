import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { D, CostScene, EffectScene, GrowthScene, IntroScene, OutroScene, RiskScene, TypesScene } from "./scenes";
import TL from "../../../../content/diet/script/timeline.json";
import { fontFamily } from "../../theme";

// 2026-10-15 다이어트 주사 숫자 쇼츠 (브리프: output/briefs/2026-10-15_slot4.md)
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-info.mjs)도 같은 파일을 읽는다.
export const DIET_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  intro: IntroScene,
  types: TypesScene,
  effect: EffectScene,
  growth: GrowthScene,
  cost: CostScene,
  risk: RiskScene,
  outro: OutroScene,
};

// 차분한 배경: 천천히 흐르는 민트/하늘색 빛 + 리스크 장면부터 붉은 톤
const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const warm = interpolate(frame, [TL.minorFrom - 15, TL.minorFrom + 15, TL.scenes[6].from, TL.scenes[6].from + 20], [0, 1, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: D.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + Math.sin(t * 0.3) * 10}% ${25 + Math.cos(t * 0.25) * 8}%, rgba(52,211,153,0.28), transparent 55%), radial-gradient(circle at ${75 + Math.cos(t * 0.2) * 10}% 80%, rgba(56,189,248,0.25), transparent 55%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(251,113,133,0.30), transparent 60%)", opacity: warm }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.035) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
        }}
      />
    </AbsoluteFill>
  );
};

// 고정 고지 띠 (상단)
const Disclaimer: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 130,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily,
    }}
  >
    <span style={{ fontSize: 30, fontWeight: 700, color: "#cbd5e1", background: "rgba(0,0,0,0.35)", borderRadius: 999, padding: "8px 26px" }}>
      정보 제공용 · 의학적 조언 아님 · 2026.10.15 기준
    </span>
  </div>
);

export const DietNumbers: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <Audio src={staticFile("bgm/info.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Scene />
        </Sequence>
      );
    })}
    <Disclaimer />
  </AbsoluteFill>
);
