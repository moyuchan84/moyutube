// 쇼츠 편집 계획(src/shorts/<epNN>.json) + 롱폼 타임라인 → 쇼츠 조각 목록(프레임 단위).
// Remotion 컴포지션(Short.tsx)과 scripts/short.mjs 가 같이 쓴다.

export const PRE = 3; // 대사 시작 전 여유(프레임)
export const POST = 6; // 대사 끝난 뒤 여유
export const STAMP_HOLD = 26; // 도장이 찍힌 뒤 머무는 시간
export const END_CARD = 105;

export const buildShort = (timeline, spec) => {
  let cursor = 0;
  let chapterNow = -1;
  let prevCut = "";
  const segments = spec.segments.map((s, index) => {
    const dash = s.line.lastIndexOf("-");
    const cutId = s.line.slice(0, dash);
    const cut = timeline.cuts.find((c) => c.id === cutId);
    const li = cut?.lines[Number(s.line.slice(dash + 1))];
    if (!cut || !li) throw new Error(`대사를 찾지 못했습니다: ${s.line}`);
    if (s.chapter != null) chapterNow = s.chapter;
    const duration = PRE + li.duration + POST + (s.stamp ? STAMP_HOLD : 0) + (s.hold ?? 0);
    const built = { ...s, cut, li, from: cursor, duration, inCut: li.from - PRE, chapterNow, sameCut: prevCut === cutId, index };
    prevCut = cutId;
    cursor += duration;
    return built;
  });
  return { segments, body: cursor, durationInFrames: cursor + END_CARD };
};
