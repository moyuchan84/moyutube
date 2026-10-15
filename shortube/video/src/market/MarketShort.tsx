import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../components/Background";
import { HitFlash, Scanlines, Ticker, useShake } from "./effects";
import { CausesScene, DamageScene, EarningsScene, HookScene, OutlookScene, OutroScene, TechnicalScene } from "./scenes";
import TL from "./timeline.json";

// 2026-10-15 코스피 급락 쇼츠 (브리프: output/briefs/2026-10-15_slot2.md)
// 장면 길이 · 타격(hit) 시점은 timeline.json 하나에서 관리 — 배경음악(scripts/bgm-tension.mjs)도 같은 파일을 읽는다.
export const MARKET_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  damage: DamageScene,
  causes: CausesScene,
  earnings: EarningsScene,
  technical: TechnicalScene,
  outlook: OutlookScene,
  outro: OutroScene,
};

export const MarketShort: React.FC = () => {
  const s = useShake();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070F" }}>
      <AbsoluteFill style={{ filter: "hue-rotate(15deg) saturate(0.8)" }}>
        <Background />
      </AbsoluteFill>
      <Audio src={staticFile("bgm/tension.wav")} volume={0.8} />
      <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)` }}>
        {TL.scenes.map(({ id, from, dur }) => {
          const Scene = SCENES[id];
          return (
            <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
              <Scene />
            </Sequence>
          );
        })}
        <Ticker />
      </AbsoluteFill>
      <HitFlash />
      <Scanlines />
    </AbsoluteFill>
  );
};
