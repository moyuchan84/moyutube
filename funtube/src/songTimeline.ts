import song from "../content/song.json";

export const FPS = 30;

export type SongLine = { who: string; text: string; start: number; end: number };
export type SongSection = {
  name: string;
  style: string;
  bpm: number; // 0 이면 음악 없음(정적 구간)
  energy: number;
  start: number; // 초
  end: number;
  lines: SongLine[];
};

// content/song.json → 초 단위 타임라인. scripts/beat.mjs 도 같은 계산을 한다.
export const buildSong = () => {
  let t = song.lead;
  const sections: SongSection[] = (song.sections as any[]).map((s) => {
    const start = t;
    const lines: SongLine[] = s.lines.map((l: any) => {
      const len = s.bpm ? (l.beats * 60) / s.bpm : l.seconds;
      const line = { who: l.who, text: l.text, start: t, end: t + len };
      t += len;
      return line;
    });
    return { name: s.name, style: s.style, bpm: s.bpm ?? 0, energy: s.energy, start, end: t, lines };
  });
  return { title: song.title, sections, seconds: t, durationInFrames: Math.ceil(t * FPS) + 20 };
};

// 풍경이 지나가는 속도(px/초). 박자가 빠를수록 빠르고, 정적 구간에선 멈춘다.
export const speedOf = (s: SongSection) => (s.bpm ? s.bpm * 7 : s.style === "end" ? 700 : 0);

// t초까지 풍경이 이동한 총 거리(px)
export const distanceAt = (sections: SongSection[], t: number) => {
  let dist = 0;
  for (const s of sections) {
    if (t >= s.end) dist += speedOf(s) * (s.end - s.start);
    else if (t >= s.start) dist += speedOf(s) * (t - s.start);
  }
  return dist;
};
