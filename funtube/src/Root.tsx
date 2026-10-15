import React from "react";
import { Composition } from "remotion";
import { Balance } from "./components/Balance";
import { Chat } from "./components/Chat";
import { Facts } from "./components/Facts";
import { Skit } from "./components/Skit";
import { FPS, buildTimeline, type EpisodeId } from "./timeline";

const EPISODES: { id: EpisodeId; component: React.FC }[] = [
  { id: "chat", component: Chat },
  { id: "skit", component: Skit },
  { id: "facts", component: Facts },
  { id: "balance", component: Balance },
];

export const Root: React.FC = () => (
  <>
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
