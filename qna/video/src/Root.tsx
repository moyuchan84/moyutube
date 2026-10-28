import React from "react";
import { Composition, Still } from "remotion";
import { Episode, EpisodeCutStill } from "./Episode";
import { type FaceText, Thumbnail } from "./Thumbnail";
import { type ShortSpec, Short, buildShort } from "./shorts/Short";
import { END_CARD, Teaser, teaserRange } from "./shorts/Teaser";
import { FPS, buildTimeline } from "./timeline.js";
import { type MotionPlan, Motion, buildMotion } from "./motion/Motion";
import { type MotionThumbSpec, MotionThumb } from "./motion/Thumb";
import { ChannelBanner } from "./ChannelBanner";
import { type MotionShortSpec, MotionShort, motionShortLength } from "./shorts/MotionShort";
// 편 목록은 content/*/unit.json 에서 자동으로 만든다 (scripts/registry.mjs). 새 편을 여기 손으로 더하지 않는다.
import { UNITS } from "./generated/units";

// ep01 → Ep01 (롱폼 컴포지션 id)
const compId = (code: string) => code[0].toUpperCase() + code.slice(1);

// 롱폼(이전 포맷 · 1~8편): format "longform". 얼굴 썸네일 글자는 편 폴더 script/thumb.json
const EPISODES: { id: string; episode: string; timeline: ReturnType<typeof buildTimeline>; face?: FaceText }[] = UNITS.filter((u) => u.format === "longform").map((u) => ({
  id: compId(u.code),
  episode: u.code,
  timeline: buildTimeline(u.script, u.timing),
  face: u.thumb?.face,
}));

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

// 모답맨 (모션 편집판): 편 폴더 script/motion.json 하나 = 영상 하나. thumb 가 있으면 <id>-Thumb 스틸도 만든다.
// episode 는 그림을 가진 편 (리메이크 ep01f · ep08f 는 원편 그림을 쓴다), 음성은 plan.voice 편
const MOTIONS: { id: string; episode: string; timeline: ReturnType<typeof buildMotion>; thumb?: MotionThumbSpec }[] = UNITS.filter((u) => u.motion).map((u) => ({
  id: u.motion.id,
  episode: u.motion.episode ?? u.code,
  timeline: buildMotion(u.motion as MotionPlan, u.script, u.timing),
  thumb: u.motion.thumb,
}));

// 모답맨 쇼츠: 본편 몇 구간 + 훅 + 질문 카드 (편 폴더 script/motion-short.json — 하나 또는 배열)
const MOTION_SHORTS: { spec: MotionShortSpec; motion: string }[] = UNITS.filter((u) => u.motion && u.motionShort).flatMap((u) =>
  ([] as MotionShortSpec[]).concat(u.motionShort).map((spec) => ({ spec, motion: u.motion.id })),
);

// 편집형 쇼츠: 편 폴더 script/shorts.json 하나 = 쇼츠 하나. 렌더는 npm run short -- epNN
const EDITED_SHORTS = UNITS.filter((u) => u.shorts).map((u) => u.shorts) as ShortSpec[];

export const RemotionRoot = () => {
  return (
    <>
      {MOTIONS.map(({ id, episode, timeline, thumb }) => (
        <React.Fragment key={id}>
          <Composition id={id} component={Motion} durationInFrames={timeline.durationInFrames} fps={FPS} width={1920} height={1080} defaultProps={{ timeline }} />
          {thumb ? <Still id={`${id}-Thumb`} component={MotionThumb} width={1280} height={720} defaultProps={{ episode, spec: thumb }} /> : null}
        </React.Fragment>
      ))}
      {MOTION_SHORTS.map(({ spec, motion }) => (
        <Composition key={spec.id} id={spec.id} component={MotionShort} durationInFrames={motionShortLength(spec)} fps={FPS} width={1080} height={1920}
          defaultProps={{ timeline: MOTIONS.find((m) => m.id === motion)!.timeline, spec }} />
      ))}
      {EDITED_SHORTS.map((spec) => {
        const timeline = EPISODES.find((e) => e.episode === spec.episode)!.timeline;
        return (
          <Composition
            key={spec.id}
            id={spec.id}
            component={Short}
            durationInFrames={buildShort(timeline, spec).durationInFrames}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={{ timeline, spec }}
          />
        );
      })}
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
      {/* 채널 배너 (모라구) — out/channel/ 로 렌더해 Studio 맞춤설정에 올린다 */}
      <Still id="Channel-Banner" component={ChannelBanner} width={2560} height={1440} />
      <Still id="Ep01-ThumbA" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "a" as const }} />
      <Still id="Ep01-ThumbB" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "b" as const }} />
      <Still id="Ep01-ThumbC" component={Thumbnail} width={1280} height={720} defaultProps={{ variant: "c" as const }} />
    </>
  );
};
