// 만화책 페이지 모델 — 페이지 안에 컷(패널)을 배치하고, 카메라가 컷에서 컷으로 이동한다(가이드 뷰).
// 말풍선 · 캡션 · 효과음은 페이지에 '인쇄된' 것처럼 붙어 있다 (카메라와 함께 움직이고, 한 번 나오면 페이지 끝까지 남는다).

export const PW = 1080; // 페이지 = 화면 크기 (9:16)
export const PH = 1920;
export const M = 34; // 바깥 여백
export const G = 22; // 컷 사이 홈(거터)

export type Rect = [number, number, number, number];

export type Bubble = {
  text: string;
  x: number; // 컷 안 위치 (0~1, 말풍선 가운데)
  y: number;
  kind?: "say" | "whisper" | "shout" | "off"; // off = 화면 밖 목소리(네모 풍선)
  tail?: "bl" | "br" | "tl" | "tr" | "none";
  size?: number; // 글자 크기 (페이지 px)
  b?: number; // 몇 번째 비트에서 나오나 (페이지 비트 번호, 기본: 이 컷의 첫 비트)
  at?: number; // 그 비트 시작 뒤 몇 초
};
export type Caption = { text: string; x?: number; y?: number; size?: number; b?: number; at?: number; w?: number };
export type SfxText = { text: string; x: number; y: number; size?: number; rot?: number; b?: number; at?: number; white?: boolean };

export type Panel = {
  img?: string;
  r: Rect;
  clip?: string; // CSS polygon (컷 모양, 페이지 좌표 % 가 아니라 컷 자기 기준 %)
  fx?: number; // 그림 초점 (0~100 %)
  fy?: number;
  z?: number; // 그림 확대
  drift?: [number, number]; // 컷 안에서 그림이 천천히 흐르는 양(px)
  color?: { img: string; ox?: number; oy?: number; b?: number; at?: number; dur?: number };
  bubbles?: Bubble[];
  caps?: Caption[];
  sfx?: SfxText[];
  grain?: boolean;
  dark?: boolean; // 테두리 흰색 (검은 페이지용)
};

export type Beat = {
  p: number | "page"; // 보여 줄 컷 번호, 또는 페이지 전체
  dur: number;
  glide?: number; // 앞 비트에서 이 비트로 카메라가 옮겨 가는 시간(초)
  zoom?: number; // 컷에 맞춘 뒤 더 들어가는 배율
  push?: number; // 비트 동안 천천히 다가가는 양 (기본 0.04)
  shake?: number[]; // 흔들림 시각(초)
  big?: boolean; // 큰 흔들림
  neg?: number[]; // 네거 플래시 시각
  speed?: boolean; // 집중선
  breakOut?: boolean; // 컷이 테두리를 깨고 화면을 채운다
  sfx?: { name: string; at?: number; vol?: number; dur?: number }[];
};

export type Page = {
  panels: Panel[];
  beats: Beat[];
  bg?: "paper" | "black";
  out?: "flip" | "cut" | "burn" | "black" | "shutter"; // 다음 페이지로 넘어가는 방식
  title?: { main: string; sub: string };
  card?: { q: string; sub: string; b: number; at?: number };
};

export type Track = { name: string; from: number; to: number; vol: number; fadeIn?: number; fadeOut?: number; offset?: number };
export type Comic = { pages: Page[]; tracks: Track[]; assets?: string[] };

export const FPS = 30;
export const OUT_FRAMES = { flip: 10, cut: 0, burn: 9, black: 9, shutter: 7 } as const;

export const pageFrames = (p: Page) => p.beats.reduce((a, b) => a + Math.round(b.dur * FPS), 0);
export const comicFrames = (c: Comic) => c.pages.reduce((a, p) => a + pageFrames(p), 0);

// ── 레이아웃 도우미 ─────────────────────────────
const inner = { x: M, y: M, w: PW - 2 * M, h: PH - 2 * M };
/** 세로로 쌓기: ratios 합만큼 나눈다 */
export const rows = (...ratios: number[]): Rect[] => {
  const sum = ratios.reduce((a, b) => a + b, 0);
  const avail = inner.h - G * (ratios.length - 1);
  let y = inner.y;
  return ratios.map((r) => {
    const h = (avail * r) / sum;
    const rect: Rect = [inner.x, y, inner.w, h];
    y += h + G;
    return rect;
  });
};
/** 한 줄(rect)을 가로로 나누기 */
export const cols = (rect: Rect, ...ratios: number[]): Rect[] => {
  const sum = ratios.reduce((a, b) => a + b, 0);
  const avail = rect[2] - G * (ratios.length - 1);
  let x = rect[0];
  return ratios.map((r) => {
    const w = (avail * r) / sum;
    const out: Rect = [x, rect[1], w, rect[3]];
    x += w + G;
    return out;
  });
};
export const full = (): Rect => [inner.x, inner.y, inner.w, inner.h];
/** 사선으로 나눈 두 컷: 위 컷의 아래 경계가 왼쪽 a% → 오른쪽 b% */
export const diag = (a = 58, b = 40): { r: Rect; clip: string }[] => {
  const g = (G / inner.h) * 100;
  return [
    { r: full(), clip: `polygon(0 0, 100% 0, 100% ${b - g / 2}%, 0 ${a - g / 2}%)` },
    { r: full(), clip: `polygon(0 ${a + g / 2}%, 100% ${b + g / 2}%, 100% 100%, 0 100%)` },
  ];
};
