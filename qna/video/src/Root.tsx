import React from "react";
import { Composition, Still } from "remotion";
import { Episode, EpisodeCutStill } from "./Episode";
import { type FaceText, Thumbnail } from "./Thumbnail";
import { END_CARD, Teaser, teaserRange } from "./shorts/Teaser";
import { FPS, buildTimeline } from "./timeline.js";
import ep01Script from "./ep01/script.json";
import ep01Timing from "./ep01/timing.json";
import ep02Script from "./ep02/script.json";
import ep02Timing from "./ep02/timing.json";
import ep03Script from "./ep03/script.json";
import ep03Timing from "./ep03/timing.json";

// 새 편은 여기에 한 줄 추가한다 (face 는 얼굴 썸네일의 글자)
const EPISODES: { id: string; episode: string; timeline: ReturnType<typeof buildTimeline>; face?: FaceText }[] = [
  { id: "Ep01", episode: "ep01", timeline: buildTimeline(ep01Script, ep01Timing) },
  {
    id: "Ep02",
    episode: "ep02",
    timeline: buildTimeline(ep02Script, ep02Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["아파트? ", "빌라?"], bottom: ["아빠,", " 우리 집은 뭐예요?"], topic: ["ep02/prop/apartment", "ep02/prop/villa", "ep02/prop/officetel"] },
  },
  {
    id: "Ep03",
    episode: "ep03",
    timeline: buildTimeline(ep03Script, ep03Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["마트? ", "시장?"],
      bottom: ["아빠,", " 뭐가 달라요?"],
      layout: "hang",
      dad: "dad-shock",
      // 앞의 3장(시장 좌판 · 마트 카트 · 백화점 쇼핑백)이 만들어지면 그것으로 바뀐다
      topic: ["ep03/prop/icon-market", "ep03/prop/cart", "ep03/prop/shopping-bag", "ep03/prop/bean-sprouts", "ep03/prop/price-tag", "ep03/prop/ppeongtwigi"],
    },
  },
];

// 쇼츠(9:16) 맛보기: 롱폼 구간을 잘라 본편으로 보낸다 (모라구 유입용)
const ep03Timeline = EPISODES.find((e) => e.id === "Ep03")!.timeline;
const SHORTS = [
  {
    id: "Ep03-Short1",
    episode: "ep03",
    timeline: ep03Timeline,
    // 아이 질문(c01 세 번째 대사)부터 할머니 "애가 똑똑하네"(c03b)까지
    ...teaserRange(ep03Timeline, { cut: "c01", line: 2 }, "c03b"),
    series: "여덟 살 아들의 호기심 3편",
    hook: ["시장은 제일 싼 데?", "그 말 했다가…"] as [string, string],
    endTitle: ["그래서 진짜", "뭐가 다를까?"] as [string, string],
    endSub: "▶ 전체 이야기는 본편에서",
  },
];

export const RemotionRoot = () => {
  return (
    <>
      {SHORTS.map(({ id, ...props }) => (
        <Composition
          key={id}
          id={id}
          component={Teaser}
          durationInFrames={props.end - props.start + END_CARD}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={props}
        />
      ))}
      {EPISODES.map(({ id, episode, timeline, face }) => (
        <React.Fragment key={id}>
          <Composition
            id={id}
            component={Episode}
            durationInFrames={timeline.durationInFrames}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{ episode, timeline }}
          />
          <Still id={`${id}-Cut`} component={EpisodeCutStill} width={1920} height={1080} defaultProps={{ episode, timeline, cutId: "c01" }} />
          <Still id={`${id}-ThumbD`} component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "d" as const, face }} />
        </React.Fragment>
      ))}
      <Still id="Ep01-ThumbA" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "a" as const }} />
      <Still id="Ep01-ThumbB" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "b" as const }} />
      <Still id="Ep01-ThumbC" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "c" as const }} />
    </>
  );
};
