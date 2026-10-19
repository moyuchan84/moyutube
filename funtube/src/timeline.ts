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
  dur?: number;
  // 영상툰 연출
  scene?: string;
  cam?: string;
  pose?: Record<string, string>;
  dmg?: Record<string, number>;
  hit?: string;
  sfx?: string;
  sound?: string;
  face?: Record<string, number>; // 인물별 표정 번호(1~6)
  act?: Record<string, string>; // 인물별 몸 연기 이름 (src/toon3d/acts.ts)
  think?: boolean; // 속마음 (입은 안 움직이고 생각 풍선으로)
  chart?: Chart | null; // 차트 창 (null 이면 닫는다). 다음 지정 전까지 유지
};

// 차트 창: 같은 label 이 이어지면 앞 차트 끝점부터 새 구간만 그린다. pts 는 첫 값 대비 상대값
export type Chart = { label: string; pts: number[]; note?: string };

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
  const gap = (ep as { gap?: number }).gap ?? GAP; // 편마다 템포를 바꿀 수 있다
  let cursor = Math.round(LEAD_IN * FPS);
  const beats: Beat[] = (ep.lines as Line[]).map((line, index) => {
    const dur = t[index]?.dur ?? 1.5;
    const speak = Math.ceil(dur * FPS);
    const length = speak + Math.round(((line.pauseAfter ?? 0) + gap) * FPS);
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
