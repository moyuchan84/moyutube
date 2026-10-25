import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaveatScene, HookScene, OutroScene, RampScene, RatioScene, SurchargeScene, TableScene } from "./scenes";
import { TearWipe, TopBand } from "./fx";
import { clamp } from "../market/effects";
import TL from "./timeline.json";

// 2026-10-20 주택 취득세 숫자 쇼츠 (브리프: output/briefs/2026-10-20_tax.md)
// 연출: 영수증 종이 + 먹색 잉크 · 세율 계단 / 금액표 · 절취선 전환 · 천천히 줌인.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-tax.mjs)도 같은 파일을 읽는다.
export const TAX_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, ramp: RampScene, surcharge: SurchargeScene, table: TableScene, ratio: RatioScene, caveat: CaveatScene, outro: OutroScene };

export const TaxShort: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TL.total], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: "#EFE6D2" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.wipe : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <TearWipe first={i === 0}>
                <Scene />
              </TearWipe>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/tax.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
