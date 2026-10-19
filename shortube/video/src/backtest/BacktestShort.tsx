import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BaseScene, HookScene, LongScene, OutroScene, RuleScene, SignalsScene, WorstScene, YearsScene } from "./scenes";
import { PageSlide, TopBand } from "./fx";
import { clamp } from "../market/effects";
import TL from "./timeline.json";

// 2026-10-18 지표 백테스트 쇼츠 (브리프: output/briefs/2026-10-18_slot1.md)
// 연출: 크림색 방안지 · 100칸 격자 · 노트를 밀어 넘기는 전환 · 아주 느린 줌인 — 브리프의 연출 카드 참고.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-backtest.mjs)도 같은 파일을 읽는다.
export const BACKTEST_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  base: BaseScene,
  signals: SignalsScene,
  worst: WorstScene,
  years: YearsScene,
  rule: RuleScene,
  long: LongScene,
  outro: OutroScene,
};

export const BacktestShort: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TL.total], [1, 1.035], clamp);
  return (
    <AbsoluteFill style={{ background: "#1B1A17" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          // 다음 장이 위로 덮을 때까지 이전 장이 아래에 남아 있도록 slide 만큼 길게
          const len = i < TL.scenes.length - 1 ? dur + TL.slide : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <PageSlide first={i === 0}>
                <Scene />
              </PageSlide>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/backtest.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
