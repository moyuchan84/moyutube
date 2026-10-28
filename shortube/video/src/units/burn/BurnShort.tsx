import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { StartWipe, TopBand } from "./fx";
import { HookScene, MarathonScene, MythScene, OutroScene, RuleScene, RunScene, WalkScene } from "./scenes";
import TL from "../../../../content/burn/script/timeline.json";

// 2026-10-23 음식 1인분 열량 → 걷기 · 달리기 시간 쇼츠 (브리프: output/briefs/2026-10-23_burn.md)
// 연출: 육상 트랙(붉은 고무 + 흰 레인) · 출발 섬광 가로 와이프 · 레인별 러너.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-burn.mjs)도 같은 파일을 읽는다.
export const BURN_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, rule: RuleScene, walk: WalkScene, run: RunScene, marathon: MarathonScene, myth: MythScene, outro: OutroScene };

export const BurnShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#B4462F" }}>
    <Audio src={staticFile("bgm/burn.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <StartWipe first={i === 0}>
            <Scene />
          </StartWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
