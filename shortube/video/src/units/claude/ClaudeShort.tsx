import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { P, Redact, TopBand } from "./fx";
import { ComputeScene, ContextScene, HookScene, LossScene, OutroScene, PeopleScene, RevenueScene, TokensScene } from "./scenes";
import TL from "../../../../content/claude/script/timeline.json";

// 2026-10-27 앤트로픽 S-1 숫자 쇼츠 (브리프: content/claude/plan.md)
// 연출: 리걸 패드 서류 · 형광펜 막대 · 검은 가림막 전환 · 타자기 글자.
// 장면 · 타격 시점은 timeline.json — 배경음악(scripts/bgm/claude.mjs)도 같은 파일을 읽는다.
export const CLAUDE_TOTAL = TL.total;

const SCENES: Record<string, React.FC> = { hook: HookScene, revenue: RevenueScene, tokens: TokensScene, context: ContextScene, compute: ComputeScene, loss: LossScene, people: PeopleScene, outro: OutroScene };

export const ClaudeShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper }}>
    <Audio src={staticFile("bgm/claude.wav")} volume={0.75} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Redact first={i === 0} dur={dur}>
            <Scene />
          </Redact>
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
