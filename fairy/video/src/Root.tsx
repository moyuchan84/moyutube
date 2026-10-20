import React from "react";
import { Composition } from "remotion";
import { Book } from "./Book";
import { Thumb } from "./Thumb";
import timeline from "./timeline.json";

export const Root: React.FC = () => (
  <>
  <Composition
    id="Book"
    component={Book}
    durationInFrames={Math.round(timeline.total * timeline.fps)}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
  />
  <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
