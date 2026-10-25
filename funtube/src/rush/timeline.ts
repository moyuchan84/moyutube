import generated from "../generated/rush.json";
import { FPS } from "../timeline";
import type { Look, Shot, Theme } from "./types";

type Line = { file: string | null; dur: number; env: number[] | null } | null;

export type BuiltShot = Shot & {
  idx: number;
  from: number; // 시작 프레임
  len: number; // 길이 (프레임)
  beats: number;
  speak: number; // 음성 길이 (프레임), 없으면 0
  audio: string | null;
  env: number[] | null;
  lookNow: Look; // 이 컷의 캐릭터 모습 (앞 컷에서 이어진 것)
  themeId: string;
};

export const buildRush = (theme: Theme) => {
  const lines = ((generated as Record<string, { lines: Line[] }>)[theme.id]?.lines ?? []) as Line[];
  const bf = (FPS * 60) / theme.bpm; // 한 박자 (프레임)
  let startBeat = 0;
  let look: Look = { hair: "buzz", hat: "none", ...theme.look };
  const shots: BuiltShot[] = theme.shots.map((s, idx) => {
    const g = lines[idx];
    const speak = s.say && g ? Math.ceil(g.dur * FPS) : 0;
    const beats = Math.max(s.b, speak ? Math.ceil((speak + 4) / bf) : 0); // 대사가 길면 다음 박자까지 늘린다
    const from = Math.round(startBeat * bf);
    const len = Math.round((startBeat + beats) * bf) - from;
    startBeat += beats;
    look = { ...look, ...s.look };
    return { ...s, idx, from, len, beats, speak, audio: g?.file ?? null, env: g?.env ?? null, lookNow: look, themeId: theme.id };
  });
  const last = shots[shots.length - 1];
  return { shots, bf, durationInFrames: last.from + last.len + 6 };
};

// 화면 위 시계: clk 가 적힌 컷마다 값이 정해지고, 그 사이는 부드럽게 이어진다
export const clockAt = (shots: BuiltShot[], frame: number, base: number) => {
  let prev = { f: 0, v: base };
  for (const s of shots) {
    if (s.clk == null) continue;
    if (frame < s.from + s.len * 0.8) {
      const span = Math.max(1, s.from + s.len * 0.8 - prev.f);
      const t = Math.min(1, Math.max(0, (frame - prev.f) / span));
      return Math.round(prev.v + (s.clk - prev.v) * t);
    }
    prev = { f: s.from + s.len * 0.8, v: s.clk };
  }
  return prev.v;
};
