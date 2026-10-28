import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Confetti, DanceBackground, Equalizer, Flash, useZoomPunch } from "./effects";
import { IntroScene, OutroScene, Scene1, Scene24, Scene25, Scene3, Scene30 } from "./scenes";
import TL from "../../../../content/kpop/script/timeline.json";

// 2026-10-15 이수만 복귀 숫자 쇼츠 (브리프: output/briefs/2026-10-15_slot3.md)
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-dance.mjs)도 같은 파일을 읽는다.
export const KPOP_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  intro: IntroScene,
  n30: Scene30,
  n3: Scene3,
  n24: Scene24,
  n1: Scene1,
  n25: Scene25,
  outro: OutroScene,
};

export const KpopNumbers: React.FC = () => {
  const zoom = useZoomPunch();
  return (
    <AbsoluteFill>
      <DanceBackground />
      <Audio src={staticFile("bgm/dance.wav")} volume={0.8} />
      <Equalizer />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }) => {
          const Scene = SCENES[id];
          return (
            <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
              <Scene />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Confetti />
      <Flash />
    </AbsoluteFill>
  );
};
