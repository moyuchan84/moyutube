import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { RiseReveal, TopBand } from "./fx";
import { DipScene, HookScene, NowScene, OutroScene, PipeScene, PriceScene, VanishScene, Y27Scene } from "./scenes";
import TL from "../../../../content/seoulsupply/script/timeline.json";

// 2026-10-19 서울 주택 공급 쇼츠 (브리프: output/briefs/2026-10-19_slot1.md)
// 연출: 황혼 스카이라인 · 건물 기둥이 솟으며 장면 전환 · 좌→우 느린 팬 · 마지막 장 새벽 — 브리프의 연출 카드 참고.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-seoulsupply.mjs)도 같은 파일을 읽는다.
export const SEOUL_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  price: PriceScene,
  pipe: PipeScene,
  dip: DipScene,
  now: NowScene,
  vanish: VanishScene,
  y2027: Y27Scene,
  outro: OutroScene,
};

export const SeoulSupplyShort: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TL.total], [1, 1.025], clamp);
  return (
    <AbsoluteFill style={{ background: "#0E0B24" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.slide : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <RiseReveal first={i === 0}>
                <Scene />
              </RiseReveal>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/seoulsupply.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
