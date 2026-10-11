// script.json + timing.json → 프레임 단위 타임라인.
// Remotion 컴포지션과 SRT 생성 스크립트가 같이 쓴다.

export const FPS = 30;
const LEAD = 12; // 컷 시작 후 첫 대사까지
const GAP = 9; // 대사 사이 쉼
const TAIL = 15; // 마지막 대사 후 다음 컷까지
const SFX_AFTER = 36; // 뚜둥 같은 후행 효과음 자리
const TRIPTYCH_TAIL = 45;
const END_CARD = 120;

export const buildTimeline = (script, timing) => {
  let cursor = 0;
  const cuts = script.cuts.map((cut) => {
    let t = cut.lines.length ? LEAD : 0;
    const lines = cut.lines.map((line, i) => {
      const id = `${cut.id}-${i}`;
      const duration = Math.ceil(timing[id] * FPS);
      const item = { ...line, id, voice: `voice/${id}.wav`, from: t, duration };
      t += duration + GAP;
      if (line.sfxAfter) t += SFX_AFTER;
      return item;
    });
    const duration = cut.style === "end" ? END_CARD : t - GAP + (cut.style === "triptych" ? TRIPTYCH_TAIL : TAIL);
    const result = { ...cut, lines, from: cursor, duration };
    cursor += duration;
    return result;
  });
  // rawVoice: 직접 녹음했거나 자연스러운 TTS라서 렌더할 때 음높이를 건드리지 않는다
  return { cuts, durationInFrames: cursor, rawVoice: Boolean(script.rawVoice) };
};
