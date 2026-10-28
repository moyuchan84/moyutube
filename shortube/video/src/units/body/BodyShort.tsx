import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { AdultScene, BmiScene, HookScene, OutroScene, PrevScene, StudentScene, WorldScene } from "./scenes";
import { RulerWipe, TopBand } from "./fx";
import TL from "../../../../content/body/script/timeline.json";

// 2026-10-21 신체(키·BMI) 숫자 쇼츠 (브리프: output/briefs/2026-10-21_body.md)
// 연출: 연한 민트 벽 + 키재기 자 · 저울 바늘 · 자 눈금 전환 · 위로 패닝.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-body.mjs)도 같은 파일을 읽는다.
export const BODY_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, adult: AdultScene, world: WorldScene, bmi: BmiScene, prev: PrevScene, student: StudentScene, outro: OutroScene };

export const BodyShort: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, TL.total], [28, -28], clamp);
  return (
    <AbsoluteFill style={{ background: "#E6F4EE" }}>
      <AbsoluteFill style={{ transform: `translateY(${pan}px) scale(1.03)` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.wipe : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <RulerWipe first={i === 0}>
                <Scene />
              </RulerWipe>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/body.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
