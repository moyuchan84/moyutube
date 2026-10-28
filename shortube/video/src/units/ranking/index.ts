// 이 편의 영상: Root 는 이 파일만 읽는다 (scripts/registry.mjs 가 자동 등록 — 컴포지션 id 는 content/ranking/unit.json 의 video.composition)
export { RankingShort as component, TOTAL as durationInFrames } from "./RankingShort";
// 첫 쇼츠 썸네일 시안 세 장
export { Thumbnail as still } from "./Thumbnail";
export const stills = [
  { id: "Thumb-comeback", props: { variant: "comeback" as const } },
  { id: "Thumb-swap", props: { variant: "swap" as const } },
  { id: "Thumb-longrun", props: { variant: "longrun" as const } },
];
