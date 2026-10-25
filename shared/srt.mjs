// 자막(SRT) · 유튜브 챕터 쓰기 — qna · fairy · lab 이 같이 쓴다.
import { writeFileSync } from "node:fs";

const pad = (n, w = 2) => String(n).padStart(w, "0");

// 초 → "00:01:02,345"
export const tc = (sec) => {
  const ms = Math.max(0, Math.round(sec * 1000));
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

// cues: [{ start, end, text }] (초)
export const srt = (cues) =>
  `${cues
    .filter((c) => c.text?.trim())
    .map((c, i) => `${i + 1}\n${tc(c.start)} --> ${tc(c.end)}\n${c.text.trim()}\n`)
    .join("\n")}`;

export const writeSrt = (path, cues) => writeFileSync(path, srt(cues));

// 초 → 유튜브 챕터 시각 "0:00" / "1:02:03"
export const chapterTime = (sec) => {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  return h ? `${h}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}` : `${Math.floor(s / 60)}:${pad(s % 60)}`;
};

// chapters: [{ start, title }] — 유튜브 규칙: 첫 챕터는 0:00, 3개 이상, 각 10초 이상
export const chapters = (list) => {
  const sorted = [...list].sort((a, b) => a.start - b.start);
  if (!sorted.length || sorted[0].start > 0) throw new Error("첫 챕터는 0:00 에서 시작해야 한다");
  if (sorted.length < 3) throw new Error("챕터는 3개 이상이어야 한다");
  sorted.forEach((c, i) => {
    if (i && c.start - sorted[i - 1].start < 10) throw new Error(`챕터 '${sorted[i - 1].title}' 가 10초보다 짧다`);
  });
  return `${sorted.map((c) => `${chapterTime(c.start)} ${c.title}`).join("\n")}\n`;
};
