import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CoinFlip, TopBand } from "./fx";
import { HookScene, IncomeScene, NetWorthScene, OutroScene, ShareScene, VillageScene } from "./scenes";
import TL from "../../../../content/networth/script/timeline.json";

// 2026-10-22 가구 평균 순자산 4.7억 vs 3억 미만 57% 쇼츠 (브리프: output/briefs/2026-10-22_networth.md)
// 연출: 숲색 + 금색 동전 · 100가구 마을 격자 · 동전 뒤집기 전환.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-networth.mjs)도 같은 파일을 읽는다.
export const NETWORTH_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, village: VillageScene, share: ShareScene, income: IncomeScene, networth: NetWorthScene, outro: OutroScene };

export const NetWorthShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#0D2A22" }}>
    <Audio src={staticFile("bgm/networth.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <CoinFlip first={i === 0} dur={dur}>
            <Scene />
          </CoinFlip>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
