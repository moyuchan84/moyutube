import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CrowdScene, GapScene, HookScene, OutroScene, PastScene, RiseScene, WhyScene } from "./scenes";
import { IrisWipe, TopBand } from "./fx";
import { clamp } from "../market/effects";
import TL from "../../../../content/france/script/timeline.json";

// 2026-10-19 프랑스 시위 숫자 쇼츠 (브리프: output/briefs/2026-10-19_france.md)
// 연출: 아스팔트 + 분필 차선 · 사람 점 격자(1점 = 1만 명) · 원형 아이리스 전환 · 위로 천천히 패닝.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-france.mjs)도 같은 파일을 읽는다.
export const FRANCE_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, crowd: CrowdScene, rise: RiseScene, why: WhyScene, past: PastScene, gap: GapScene, outro: OutroScene };

export const FranceShort: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, TL.total], [0, -40], clamp);
  return (
    <AbsoluteFill style={{ background: "#17191D" }}>
      <AbsoluteFill style={{ transform: `translateY(${pan}px) scale(1.04)` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.wipe : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <IrisWipe first={i === 0}>
                <Scene />
              </IrisWipe>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/france.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
