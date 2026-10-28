import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DailyScene, DayScene, HookScene, NeedScene, OutroScene, PathScene } from "./scenes";
import { ScanWipe, TopBand } from "./fx";
import { clamp } from "../market/effects";
import TL from "../../../../content/soxl/script/timeline.json";

// 2026-10-19 반도체 3배 레버리지 쇼츠 (브리프: output/briefs/2026-10-19_soxl.md)
// 연출: 반도체 다이 도면 격자 · 구리색 스캔 전환 · 서서히 줌아웃 — 브리프의 연출 카드 참고.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-soxl.mjs)도 같은 파일을 읽는다.
export const SOXL_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, day: DayScene, daily: DailyScene, path: PathScene, need: NeedScene, outro: OutroScene };

export const SoxlShort: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, TL.total], [1.05, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#101216" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {TL.scenes.map(({ id, from, dur }, i) => {
          const Scene = SCENES[id];
          const len = i < TL.scenes.length - 1 ? dur + TL.wipe : dur;
          return (
            <Sequence key={id} from={from} durationInFrames={len} premountFor={15}>
              <ScanWipe first={i === 0}>
                <Scene />
              </ScanWipe>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Audio src={staticFile("bgm/soxl.wav")} volume={0.75} />
      <TopBand />
    </AbsoluteFill>
  );
};
