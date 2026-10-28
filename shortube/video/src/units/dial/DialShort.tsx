import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DialScene, FlowsScene, HookScene, OpenScene, OutroScene, QuoteScene, StocksScene } from "./scenes";
import { HandWipe, TopBand } from "./fx";
import { clamp } from "../market/effects";
import TL from "../../../../content/dial/script/timeline.json";

// 2026-10-21 간밤 미국장 · 코스피 시차 숫자 쇼츠 (브리프: output/briefs/2026-10-21_slot1.md)
// 연출: 밤/낮 24시간 원형 시계 다이얼 · 시계 바늘 회전 전환 · 마지막 장면 중앙 줌인.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-dial.mjs)도 같은 파일을 읽는다.
export const DIAL_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, stocks: StocksScene, dial: DialScene, flows: FlowsScene, open: OpenScene, quote: QuoteScene, outro: OutroScene };

export const DialShort: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [TL.open, TL.total], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{ background: "#0B1226" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.wipe : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <HandWipe first={i === 0}>
                <Scene />
              </HandWipe>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/dial.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
