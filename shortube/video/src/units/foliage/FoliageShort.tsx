import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { LeafFall, P, TopBand } from "./fx";
import { CalendarScene, HookScene, NowScene, OutlookScene, OutroScene, RuleScene, WhyScene } from "./scenes";
import TL from "../../../../content/foliage/script/timeline.json";

// 2026-10-24 단풍 절정 쇼츠 (브리프: output/briefs/2026-10-24_foliage.md)
// 연출: 크림 한지 바탕 · 단풍잎 색(초록→진홍)이 데이터 · 낙엽이 쏟아지는 장면 전환.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-foliage.mjs)도 같은 파일을 읽는다.
export const FOLIAGE_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, rule: RuleScene, calendar: CalendarScene, why: WhyScene, now: NowScene, outlook: OutlookScene, outro: OutroScene };

export const FoliageShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper }}>
    <Audio src={staticFile("bgm/foliage.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <LeafFall first={i === 0}>
            <Scene />
          </LeafFall>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
