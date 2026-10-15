import episodes from "../content/episodes.json";
import timings from "./generated/timings.json";

export const FPS = 30;
const LEAD_IN = 0.4; // 첫 대사 전 여백 (초)
const GAP = 0.35; // 대사 사이 기본 간격 (초)

export type Line = {
  who: string;
  text: string;
  say?: string;
  style?: string;
  fx?: string;
  pauseAfter?: number;
  emoji?: string;
  a?: string;
  b?: string;
  end?: boolean;
};

export type Beat = Line & {
  index: number;
  from: number; // 시작 프레임
  speak: number; // 음성 길이 (프레임)
  length: number; // 다음 대사까지 (프레임)
  audio: string | null;
};

export type EpisodeId = keyof typeof episodes;

export const buildTimeline = (id: EpisodeId) => {
  const ep = episodes[id];
  const t = (timings as Record<string, { file: string | null; dur: number }[]>)[id] ?? [];
  let cursor = Math.round(LEAD_IN * FPS);
  const beats: Beat[] = (ep.lines as Line[]).map((line, index) => {
    const dur = t[index]?.dur ?? 1.5;
    const speak = Math.ceil(dur * FPS);
    const length = speak + Math.round(((line.pauseAfter ?? 0) + GAP) * FPS);
    const beat = { ...line, index, from: cursor, speak, length, audio: t[index]?.file ?? null };
    cursor += length;
    return beat;
  });
  return { title: ep.title, beats, durationInFrames: cursor + FPS / 2 };
};

export const activeBeat = (beats: Beat[], frame: number) => {
  let current = -1;
  for (const b of beats) if (frame >= b.from) current = b.index;
  return current;
};
