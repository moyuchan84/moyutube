import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../theme";
import { Drive, G, SunsetSky } from "./fx";
import { DataScene, DelayScene, ExpectScene, HookScene, LiveScene, OutroScene, RecordsScene, RoadScene, SalesScene } from "./scenes";
import TL from "./timeline.json";

// 2026-10-16 GTA 6 숫자 쇼츠 (브리프: output/briefs/2026-10-16_slot2.md)
// 연출: 노을 네온 · 원근 도로 · 카메라 전진 전환 — 브리프의 연출 카드 참고.
// 장면 · 타격 시점은 timeline.json — 배경음악(scripts/bgm-gta.mjs)도 같은 파일을 읽는다.
export const GTA_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  road: RoadScene,
  delay: DelayScene,
  sales: SalesScene,
  records: RecordsScene,
  data: DataScene,
  live: LiveScene,
  expect: ExpectScene,
  outro: OutroScene,
};

// 상단 고정 띠: 기준일
const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: G.cream, background: "rgba(0,0,0,0.4)", borderRadius: 999, padding: "8px 26px" }}>
        2026.10.16 기준 · 게임 화면 없이 숫자로만
      </span>
    </div>
  );
};

export const GtaShort: React.FC = () => (
  <AbsoluteFill>
    <SunsetSky />
    <Audio src={staticFile("bgm/gta.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Drive dur={dur}>
            <Scene />
          </Drive>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
