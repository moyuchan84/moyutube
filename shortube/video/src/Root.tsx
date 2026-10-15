import { Composition, Still } from "remotion";
import { RankingShort, TOTAL } from "./RankingShort";
import { Thumbnail } from "./Thumbnail";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="RankingShort" component={RankingShort} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    {(["comeback", "swap", "longrun"] as const).map((v) => (
      <Still key={v} id={`Thumb-${v}`} component={Thumbnail} defaultProps={{ variant: v }} width={W} height={H} />
    ))}
  </>
);
