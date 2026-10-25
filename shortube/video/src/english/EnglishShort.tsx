import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { P, PenWipe, TopBand } from "./fx";
import { CoasterScene, DotsScene, HookScene, MockScene, OutlookScene, OutroScene, RuleScene } from "./scenes";
import TL from "./timeline.json";

// 2026-10-23 수능 영어 1등급 비율 쇼츠 (브리프: output/briefs/2026-10-23_english.md)
// 연출: 하늘색 모눈 노트 · 채점 빨간 펜 사선 와이프 · 롤러코스터 레일 꺾은선.
// 장면·타격 시점은 timeline.json — 배경음악(scripts/bgm-english.mjs)도 같은 파일을 읽는다.
// D-day 는 timeline.json 의 asOf(업로드 날짜) 로 계산한다.
export const ENGLISH_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, rule: RuleScene, coaster: CoasterScene, dots: DotsScene, mock: MockScene, outlook: OutlookScene, outro: OutroScene };

export const EnglishShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper }}>
    <Audio src={staticFile("bgm/english.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <PenWipe first={i === 0}>
            <Scene />
          </PenWipe>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
