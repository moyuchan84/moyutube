import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Deep, DepthRuler, DropWipe, TopBand } from "./fx";
import { BondScene, GapScene, HookScene, OutroScene, StreakScene, SwingScene, ViewsScene, WhyScene } from "./scenes";
import TL from "../../../../content/usmarket/script/timeline.json";

// 2026-10-17 간밤 미국장 쇼츠 (브리프: output/briefs/2026-10-17_slot1.md)
// 연출: 수심 눈금 위에서 아래로 늘어나는 낙하 막대 · 수직 와이프 전환 · 가라앉는 배경 — 브리프의 연출 카드 참고.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-usmarket.mjs)도 같은 파일을 읽는다.
export const US_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  gap: GapScene,
  streak: StreakScene,
  why: WhyScene,
  bond: BondScene,
  swing: SwingScene,
  views: ViewsScene,
  outro: OutroScene,
};

export const UsShort: React.FC = () => (
  <AbsoluteFill>
    <Deep />
    <DepthRuler />
    <Audio src={staticFile("bgm/usmarket.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <DropWipe>
            <Scene />
          </DropWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
