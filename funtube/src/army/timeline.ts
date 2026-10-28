import army from "../../content/army.json";
import generated from "../generated/army.json";
import { FPS } from "../timeline";

const LEAD_IN = 0.15; // 첫 대사 전 여백 (초)

export type ArmyBeat = (typeof army.beats)[number] & {
  index: number;
  from: number; // 시작 프레임
  speak: number; // 음성 길이 (프레임)
  length: number; // 다음 대사까지 (프레임)
  audio: string | null;
  env: number[] | null; // 프레임별 음량(입 벌림)
};

export const buildArmy = () => {
  let cursor = Math.round(LEAD_IN * FPS);
  const beats: ArmyBeat[] = army.beats.map((b, index) => {
    const g = (generated.lines as { file: string | null; dur: number; env: number[] | null }[])[index];
    const speak = Math.ceil((g?.dur ?? 2) * FPS);
    const pause = (b as { pauseAfter?: number }).pauseAfter ?? 0;
    const length = speak + Math.round((army.gap + pause) * FPS);
    const beat = { ...b, index, from: cursor, speak, length, audio: g?.file ?? null, env: g?.env ?? null };
    cursor += length;
    return beat;
  });
  return { title: army.title, beats, durationInFrames: cursor + FPS / 3 };
};

export const parseCap = (text: string) =>
  text.split("*").map((part, i) => ({ text: part, hot: i % 2 === 1 })).filter((s) => s.text);
