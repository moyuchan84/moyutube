import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BunSlam, P, TopBand } from "./fx";
import { BuildScene, DailyScene, GramScene, HookScene, OutroScene, ScaleScene, WorldScene } from "./scenes";
import TL from "./timeline.json";

// 2026-10-24 맥도날드 빅아치 숫자 쇼츠 (브리프: output/briefs/2026-10-24_bigarch.md)
// 연출: 다이너 민트 체크 · 도형으로 쌓는 버거 층 · 번이 쿵 내려앉는 장면 전환.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-bigarch.mjs)도 같은 파일을 읽는다.
export const BIGARCH_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, build: BuildScene, scale: ScaleScene, gram: GramScene, daily: DailyScene, world: WorldScene, outro: OutroScene };

export const BigArchShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.mint }}>
    <Audio src={staticFile("bgm/bigarch.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <BunSlam first={i === 0}>
            <Scene />
          </BunSlam>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
