import { AbsoluteFill } from "remotion";
import { linearTiming, springTiming, TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Background } from "./components/Background";
import { ComebackScene, SwapScene } from "./scenes/ChartScenes";
import { HookScene, LongRunScene, NewScene, OutroScene } from "./scenes/OtherScenes";

export const SCENES = [
  { C: HookScene, d: 105 },
  { C: SwapScene, d: 285 },
  { C: ComebackScene, d: 300 },
  { C: LongRunScene, d: 255 },
  { C: NewScene, d: 195 },
  { C: OutroScene, d: 135 },
];
export const T = 15; // 전환 길이(프레임)
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transitions: TransitionPresentation<any>[] = [
  wipe({ direction: "from-bottom" }),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
  slide({ direction: "from-bottom" }),
];

export const RankingShort: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <TransitionSeries>
      {SCENES.flatMap(({ C, d }, i) => [
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d} premountFor={15}>
          <C />
        </TransitionSeries.Sequence>,
        i < SCENES.length - 1 ? (
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={transitions[i]}
            timing={i % 2 ? linearTiming({ durationInFrames: T }) : springTiming({ config: { damping: 200 }, durationInFrames: T })}
          />
        ) : null,
      ])}
    </TransitionSeries>
  </AbsoluteFill>
);
