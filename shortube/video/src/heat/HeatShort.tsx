import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HeatBg, SceneHaze } from "./fx";
import { CoolScene, HookScene, MapScene, MythScene, OutroScene, RuleScene, TwinScene, WhyScene } from "./scenes";
import TL from "./timeline.json";
import { fontFamily } from "../theme";
import { clamp } from "../market/effects";

// 2026-10-16 10월 폭염 쇼츠 (브리프: output/briefs/2026-10-16_slot1.md)
// 연출: 색 온도(빨강 → 파랑) · 아지랑이 전환 · 종이 질감 1913 · 지도 카메라 — 브리프의 연출 카드 참고.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-heat.mjs)도 같은 파일을 읽는다.
export const HEAT_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  myth: MythScene,
  twin: TwinScene,
  rule: RuleScene,
  map: MapScene,
  why: WhyScene,
  cool: CoolScene,
  outro: OutroScene,
};

// 상단 고정 띠: 기준일 + 출처 성격 (사실 카드가 verified: partial 이라 "보도 기준")
const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: "#F4E9DA", background: "rgba(0,0,0,0.4)", borderRadius: 999, padding: "8px 26px" }}>
        2026.10.12 기준 · 기상청 발표 인용 보도
      </span>
    </div>
  );
};

export const HeatShort: React.FC = () => (
  <AbsoluteFill>
    <HeatBg />
    <Audio src={staticFile("bgm/heat.wav")} volume={0.75} />
    <SceneHaze>
      {TL.scenes.map(({ id, from, dur }) => {
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
            <Scene />
          </Sequence>
        );
      })}
    </SceneHaze>
    <TopBand />
  </AbsoluteFill>
);
