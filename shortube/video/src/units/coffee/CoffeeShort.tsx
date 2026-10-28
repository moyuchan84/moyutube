import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { IrisIn, TopBand } from "./fx";
import { BrewScene, CaffeineScene, HookScene, KcalScene, OutroScene, SugarScene } from "./scenes";
import TL from "../../../../content/coffee/script/timeline.json";

// 2026-10-23 커피 숫자(열량 · 당류 · 카페인 · 콜드브루 추출 시간) 쇼츠 (브리프: output/briefs/2026-10-23_coffee.md)
// 연출: 밝은 크림 + 에스프레소 · 모션그래픽 톤(글자 블러 인 · 빛 스윕 · 물결 액체 · 그레인 · 원형 마스크 전환 · 달리 인).
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-coffee.mjs)도 같은 파일을 읽는다.
export const COFFEE_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, kcal: KcalScene, sugar: SugarScene, caffeine: CaffeineScene, brew: BrewScene, outro: OutroScene };

export const CoffeeShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#F4EBDD" }}>
    <Audio src={staticFile("bgm/coffee.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <IrisIn first={i === 0} dur={dur}>
            <Scene />
          </IrisIn>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
