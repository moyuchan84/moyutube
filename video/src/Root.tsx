import { Composition, Still } from "remotion";
import { Episode, EpisodeCutStill } from "./Episode";
import { Thumbnail } from "./Thumbnail";
import { FPS, buildTimeline } from "./timeline.js";
import ep01Script from "./ep01/script.json";
import ep01Timing from "./ep01/timing.json";

const ep01 = buildTimeline(ep01Script, ep01Timing);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Ep01"
        component={Episode}
        durationInFrames={ep01.durationInFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ episode: "ep01", timeline: ep01 }}
      />
      <Still
        id="Ep01-Cut"
        component={EpisodeCutStill}
        width={1920}
        height={1080}
        defaultProps={{ episode: "ep01", timeline: ep01, cutId: "c01" }}
      />
      <Still id="Ep01-ThumbA" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "a" as const }} />
      <Still id="Ep01-ThumbB" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "b" as const }} />
      <Still id="Ep01-ThumbC" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "c" as const }} />
    </>
  );
};
