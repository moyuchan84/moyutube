import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SlideWipe, Stage, TopBand } from "./fx";
import { BarsScene, GapScene, HookScene, MixScene, OutroScene, StreakScene } from "./scenes";
import TL from "../../../../content/billboard/script/timeline.json";

// 2026-10-22 빌보드 200 K팝 그룹 1위 숫자 쇼츠 (브리프: output/briefs/2026-10-22_billboard.md)
// 연출: 보라 무대 + 도는 LP판 · 가로 막대 · 오른쪽→왼쪽 네온 슬라이드 전환.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-billboard.mjs)도 같은 파일을 읽는다.
export const BILLBOARD_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, bars: BarsScene, gap: GapScene, mix: MixScene, streak: StreakScene, outro: OutroScene };

export const BillboardShort: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <Audio src={staticFile("bgm/billboard.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <SlideWipe first={i === 0}>
            <Scene />
          </SlideWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
