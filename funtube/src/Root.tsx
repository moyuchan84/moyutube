import React from "react";
import { Composition } from "remotion";
import { Balance } from "./components/Balance";
import { Chat } from "./components/Chat";
import { Facts } from "./components/Facts";
import { Skit } from "./components/Skit";
import { Toon } from "./components/Toon";
import { Song } from "./components/Song";
import { Song3D } from "./components/Song3D";
import { Carpool } from "./components/Carpool";
import { Invest } from "./components/Invest";
import { Office } from "./components/Office";
import { buildSong } from "./songTimeline";
import { FPS, buildTimeline, type EpisodeId } from "./timeline";

const EPISODES: { id: EpisodeId; component: React.FC }[] = [
  { id: "chat", component: Chat },
  { id: "skit", component: Skit },
  { id: "facts", component: Facts },
  { id: "balance", component: Balance },
  { id: "fight", component: Toon },
  { id: "carpool", component: Carpool },
  { id: "invest", component: Invest },
  { id: "office", component: Office },
];

export const Root: React.FC = () => (
  <>
    <Composition id="ride" component={Song} durationInFrames={buildSong().durationInFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="ride3d" component={Song3D} durationInFrames={buildSong().durationInFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="ride3dface" component={Song3D} defaultProps={{ faces: true }} durationInFrames={buildSong().durationInFrames} fps={FPS} width={1080} height={1920} />
    {EPISODES.map(({ id, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={buildTimeline(id).durationInFrames}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
