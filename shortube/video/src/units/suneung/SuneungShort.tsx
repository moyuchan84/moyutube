import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { Chalkboard, DDAY, Flip, S } from "./fx";
import { AbsentScene, HistoryScene, HookScene, LastScene, NsuScene, OutroScene, RulesScene, TamguScene, TotalScene } from "./scenes";
import TL from "../../../../content/suneung/script/timeline.json";

// 2026-10-16 수능 D-34 숫자 쇼츠 (브리프: output/briefs/2026-10-16_slot3.md)
// 연출: 칠판 · 분필 글씨 · OMR 칸 · 시험지 넘기기 — 브리프의 연출 카드 참고.
// 장면 · 타격 시점은 timeline.json — 배경음악(scripts/bgm-suneung.mjs)도 같은 파일을 읽는다.
// D-day 는 timeline.json 의 asOf(업로드 날짜) 로 계산한다.
export const SUNEUNG_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  total: TotalScene,
  nsu: NsuScene,
  history: HistoryScene,
  absent: AbsentScene,
  tamgu: TamguScene,
  rules: RulesScene,
  last: LastScene,
  outro: OutroScene,
};

// 상단 고정 띠: 기준일
const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  const [y, m, d] = TL.asOf.split("-");
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: S.chalk, background: "rgba(0,0,0,0.35)", borderRadius: 999, padding: "8px 26px" }}>
        {`${y}.${m}.${d} 기준 · 2027학년도 수능 D-${DDAY}`}
      </span>
    </div>
  );
};

export const SuneungShort: React.FC = () => (
  <AbsoluteFill>
    <Chalkboard />
    <Audio src={staticFile("bgm/suneung.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Flip dur={dur}>
            <Scene />
          </Flip>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
