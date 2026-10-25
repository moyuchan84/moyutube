import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ClockWipe, TopBand } from "./fx";
import { HookScene, KoreaScene, MetaScene, OutroScene, RelayScene, SpreadScene, ViewsScene } from "./scenes";
import TL from "./timeline.json";

// 2026-10-23 메타발 기술주 급락 → 코스피 시차 릴레이 쇼츠 (브리프: output/briefs/2026-10-23_relay.md)
// 연출: 새벽 숯색 + 주황 시곗바늘 · 한국 시각 타임라인 · 시곗바늘 원뿔 전환.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-relay.mjs)도 같은 파일을 읽는다.
export const RELAY_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, relay: RelayScene, meta: MetaScene, spread: SpreadScene, korea: KoreaScene, views: ViewsScene, outro: OutroScene };

export const RelayShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#15130F" }}>
    <Audio src={staticFile("bgm/relay.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <ClockWipe first={i === 0} dur={dur}>
            <Scene />
          </ClockWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
