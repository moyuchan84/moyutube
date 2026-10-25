import React from "react";
import { Composition, Still } from "remotion";
import { Episode, EpisodeCutStill } from "./Episode";
import { type FaceText, Thumbnail } from "./Thumbnail";
import { type ShortSpec, Short, buildShort } from "./shorts/Short";
import { END_CARD, Teaser, teaserRange } from "./shorts/Teaser";
import ep01Short from "./shorts/ep01.json";
import ep02Short from "./shorts/ep02.json";
import ep03Short from "./shorts/ep03.json";
import ep04Short from "./shorts/ep04.json";
import ep05Short from "./shorts/ep05.json";
import ep06Short from "./shorts/ep06.json";
import ep07Short from "./shorts/ep07.json";
import ep08Short from "./shorts/ep08.json";
import { FPS, buildTimeline } from "./timeline.js";
import { type MotionPlan, Motion, buildMotion } from "./motion/Motion";
import { type MotionThumbSpec, MotionThumb } from "./motion/Thumb";
import { ChannelBanner } from "./ChannelBanner";
import { type MotionShortSpec, MotionShort, motionShortLength } from "./shorts/MotionShort";
import ep09MotionShort from "./shorts/motion-ep09.json";
import ep10MotionShort from "./shorts/motion-ep10.json";
import nm01MotionShorts from "./shorts/motion-nm01.json";
import ep08Motion from "./motion/ep08.json";
import ep08fMotion from "./motion/ep08f.json";
import ep08fScript from "./ep08f/script.json";
import ep08fTiming from "./ep08f/timing.json";
import ep01fMotion from "./motion/ep01f.json";
import ep01fScript from "./ep01f/script.json";
import ep01fTiming from "./ep01f/timing.json";
import ep09Motion from "./motion/ep09.json";
import ep09Script from "./ep09/script.json";
import ep09Timing from "./ep09/timing.json";
import ep10Motion from "./motion/ep10.json";
import ep10Script from "./ep10/script.json";
import ep10Timing from "./ep10/timing.json";
import nm01Motion from "./motion/nm01.json";
import nm01Script from "./nm01/script.json";
import nm01Timing from "./nm01/timing.json";
import ep01Script from "./ep01/script.json";
import ep01Timing from "./ep01/timing.json";
import ep02Script from "./ep02/script.json";
import ep02Timing from "./ep02/timing.json";
import ep03Script from "./ep03/script.json";
import ep03Timing from "./ep03/timing.json";
import ep04Script from "./ep04/script.json";
import ep04Timing from "./ep04/timing.json";
import ep05Script from "./ep05/script.json";
import ep05Timing from "./ep05/timing.json";
import ep06Script from "./ep06/script.json";
import ep06Timing from "./ep06/timing.json";
import ep07Script from "./ep07/script.json";
import ep07Timing from "./ep07/timing.json";
import ep08Script from "./ep08/script.json";
import ep08Timing from "./ep08/timing.json";

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
  {
    id: "Ep04",
    episode: "ep04",
    timeline: buildTimeline(ep04Script, ep04Timing),
    // 민감한 단어는 썸네일에 쓰지 않는다 — '거기'라고만 (기획서 6장)
    face: { tag: "여덟 살 아들의 질문", top: ["털? ", "털?"], bottom: ["아빠,", " 왜 거기에 나요?"], topic: ["ep04/prop/icon-guard", "ep04/prop/icon-wick", "ep04/prop/icon-trace"] },
  },
  {
    id: "Ep05",
    episode: "ep05",
    timeline: buildTimeline(ep05Script, ep05Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["의사? ", "약사?"], bottom: ["아빠,", " 뭐가 달라요?"], topic: ["ep05/prop/stethoscope", "ep05/prop/medicine-box", "ep05/prop/nurse-modern"] },
  },
  {
    id: "Ep06",
    episode: "ep06",
    timeline: buildTimeline(ep06Script, ep06Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["독감은 ", "독한 감기?"], bottom: ["아빠,", " 뭐가 달라요?"], layout: "trio", dad: "dad-shock", kid: "kid-ask", mom: "mom-smirk", vs: ["ep06/prop/cold-crowd", "ep06/prop/flu-one"] },
  },
  {
    id: "Ep07",
    episode: "ep07",
    timeline: buildTimeline(ep07Script, ep07Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["내과? ", "외과?"], bottom: ["아빠,", " 어디로 가요?"], layout: "trio", dad: "dad-shock", kid: "kid-ask", mom: "mom-sigh", vs: ["ep07/prop/belly-map", "ep07/prop/skeleton"] },
  },
  {
    id: "Ep08",
    episode: "ep08",
    timeline: buildTimeline(ep08Script, ep08Timing),
    face: { tag: "여덟 살 아들의 질문", top: ["도둑 잡히면 ", "바로 감옥?"], bottom: ["아빠,", " 누가 정해요?"], layout: "trio", dad: "dad-shock", kid: "kid-ask", mom: "mom-sigh", vs: ["ep08/prop/warrant", "ep08/prop/scale-gavel"] },
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

// 모답맨 (모션 편집판): src/motion/<id>.json 하나 = 영상 하나. thumb 가 있으면 <id>-Thumb 스틸도 만든다
const MOTIONS: { id: string; episode: string; timeline: ReturnType<typeof buildMotion>; thumb?: MotionThumbSpec }[] = [
  // 8편 앞부분을 롱폼 음성 그대로 다시 편집한 첫 시험판
  { id: ep08Motion.id, episode: "ep08", timeline: buildMotion(ep08Motion as MotionPlan, ep08Script, ep08Timing) },
  // 모답맨 8화: 새 대본(src/ep08f) · 새 음성, 그림은 8편 것
  { id: ep08fMotion.id, episode: "ep08", timeline: buildMotion(ep08fMotion as MotionPlan, ep08fScript, ep08fTiming), thumb: ep08fMotion.thumb },
  // 모답맨 1화 리메이크: 새 대본(src/ep01f) · 새 음성, 그림은 1편 것
  { id: ep01fMotion.id, episode: "ep01", timeline: buildMotion(ep01fMotion as MotionPlan, ep01fScript, ep01fTiming), thumb: ep01fMotion.thumb },
  // 모답맨 9화: 누리호 · 로켓 · 위성 · 우주선 (9편부터는 epNN 하나)
  { id: ep09Motion.id, episode: "ep09", timeline: buildMotion(ep09Motion as MotionPlan, ep09Script, ep09Timing), thumb: ep09Motion.thumb },
  { id: ep10Motion.id, episode: "ep10", timeline: buildMotion(ep10Motion as MotionPlan, ep10Script, ep10Timing), thumb: ep10Motion.thumb },
  // 내모남불 ① 자동차편 (모라구 새 시리즈 · 폴더 naemonambul/01-car, 대본 src/nm01)
  { id: nm01Motion.id, episode: "nm01", timeline: buildMotion(nm01Motion as MotionPlan, nm01Script, nm01Timing), thumb: nm01Motion.thumb },
];

// 모답맨 쇼츠: 본편(MOTIONS) 몇 구간 + 훅 + 질문 카드 (src/shorts/motion-<epNN>.json)
const MOTION_SHORTS: { spec: MotionShortSpec; motion: string }[] = [
  { spec: ep09MotionShort as MotionShortSpec, motion: ep09Motion.id },
  { spec: ep10MotionShort as MotionShortSpec, motion: ep10Motion.id },
  // 내모남불 ① 쇼츠 세 개 (깜빡이 · 주차 · 끼어들기)
  ...(nm01MotionShorts as MotionShortSpec[]).map((spec) => ({ spec, motion: nm01Motion.id })),
];

// 편집형 쇼츠: src/shorts/<epNN>.json (편집 계획) 하나 = 쇼츠 하나. 렌더는 npm run short -- epNN
const EDITED_SHORTS = [ep01Short, ep02Short, ep03Short, ep04Short, ep05Short, ep06Short, ep07Short, ep08Short] as unknown as ShortSpec[];

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
