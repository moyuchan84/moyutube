// 화 하나 = 샷 목록. 샷마다 그림 · 길이 · 카메라 · 글자 · 소리 · 효과.
export type Cam = { s?: number; x?: number; y?: number; r?: number }; // 배율 · 이동(px) · 기울기(도)

export type TextItem = {
  kind: "nar" | "say" | "whisper" | "shout" | "sfx" | "title" | "card";
  text: string;
  at?: number; // 샷 시작 기준 초
  dur?: number; // 없으면 샷 끝까지
  x?: number; // 가운데 x (px, 1080 기준)
  y?: number; // 가운데 y (px, 1920 기준)
  tail?: "l" | "r" | "none"; // 말풍선 꼬리 방향 (아래-왼쪽 · 아래-오른쪽)
  size?: number;
  rot?: number;
};

export type Sfx = { name: string; at?: number; vol?: number; dur?: number };

export type Shot = {
  img?: string; // public 기준 경로 (comics/ep01/c01.png)
  color?: { img: string; at?: number; dur?: number; ox?: number; oy?: number }; // 색 판(투명 PNG) — 원점에서 번진다
  dur: number; // 초
  from?: Cam;
  to?: Cam;
  ease?: "inout" | "out" | "linear";
  enter?: "cut" | "ink" | "burn" | "shutter" | "black" | "fade";
  fx?: ("neg" | "shake" | "bigshake" | "grain" | "dutch" | "whitebg" | "vignette" | "speed")[];
  speedAt?: [number, number]; // 집중선 중심 (px)
  punchAt?: number[]; // 임팩트 확대 시각(초)
  negAt?: number[]; // 네거 플래시 시각(초)
  shakeAt?: number[]; // 흔들림 시작(초)
  texts?: TextItem[];
  sfx?: Sfx[];
  bg?: "paper" | "black";
};

export type Track = { name: string; from: number; to: number; vol: number; fadeIn?: number; fadeOut?: number; offset?: number; loop?: boolean };

export type Ep = { fps: number; shots: Shot[]; tracks: Track[]; assets?: string[] };

export const FPS = 30;
export const ENTER_FRAMES = { cut: 0, ink: 14, burn: 18, shutter: 8, black: 12, fade: 15 } as const;

export const starts = (ep: Ep) => {
  const out: number[] = [];
  let t = 0;
  for (const s of ep.shots) {
    out.push(t);
    t += Math.round(s.dur * FPS);
  }
  return out;
};
export const totalFrames = (ep: Ep) => ep.shots.reduce((a, s) => a + Math.round(s.dur * FPS), 0);
