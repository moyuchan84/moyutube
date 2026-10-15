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
  // speed: 편 전체 배속 (script.json 의 "speed", 기본 1). 대사 사이 쉼 · 컷 전환을 줄이고, 목소리는 scripts/speed.mjs 가 미리 빠르게 만든 voice-x<speed>/ 를 쓴다
  const speed = script.speed ?? 1;
  const fast = (frames) => Math.round(frames / speed);
  let cursor = 0;
  const cuts = script.cuts.map((cut) => {
    let t = cut.lines.length ? fast(LEAD) : 0;
    const lines = cut.lines.map((line, i) => {
      const id = `${cut.id}-${i}`;
      const duration = Math.ceil((timing[id] / speed) * FPS);
      const item = { ...line, id, voice: speed === 1 ? `voice/${id}.wav` : `voice-x${speed}/${id}.wav`, from: t, duration };
      t += duration + fast(GAP);
      if (line.sfxAfter) t += SFX_AFTER;
      return item;
    });
    const duration = cut.style === "end" ? END_CARD : t - fast(GAP) + fast(cut.style === "triptych" ? TRIPTYCH_TAIL : TAIL);
    const result = { ...cut, lines, from: cursor, duration };
    cursor += duration;
    return result;
  });
  // rawVoice: 직접 녹음했거나 자연스러운 TTS라서 렌더할 때 음높이를 건드리지 않는다
  // bgm: public/bgm/<이름>.wav 를 대사 밑에 깐다 (없으면 배경음악 없음)
  return { cuts, durationInFrames: cursor, rawVoice: Boolean(script.rawVoice), speed, bgm: script.bgm ?? null };
};
