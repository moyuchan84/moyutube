import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BlindWipe, TopBand } from "./fx";
import { CxmtScene, FlowsScene, HookScene, LoopScene, OutroScene, RevScene, SwingScene } from "./scenes";
import TL from "../../../../content/whydrop/script/timeline.json";

// 2026-10-22 간밤 미국 상승 vs 코스피 -3.52% 쇼츠 (브리프: output/briefs/2026-10-22_whydrop.md)
// 연출: 관제 상황실 네이비 격자 · 가로 블라인드 전환 · 순환 고리 다이어그램.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-whydrop.mjs)도 같은 파일을 읽는다.
export const WHYDROP_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, swing: SwingScene, flows: FlowsScene, loop: LoopScene, rev: RevScene, cxmt: CxmtScene, outro: OutroScene };

export const WhyDropShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#06141F" }}>
    <Audio src={staticFile("bgm/whydrop.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <BlindWipe first={i === 0}>
            <Scene />
          </BlindWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
