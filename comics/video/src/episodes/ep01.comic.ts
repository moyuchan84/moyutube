import { Comic, FPS, Page, Panel, cols, diag, full, pageFrames, rows } from "../comic";
import assets from "./ep01.assets.json";

const I = (id: string) => `comics/ep01/${id}.jpg`;
const C = (id: string) => `comics/ep01/${id}.color.png`;
const P = (id: string, r: Panel["r"], more: Partial<Panel> = {}): Panel => ({ img: I(id), r, ...more });

// 1화 「필름 한 롤」 — 만화책 페이지 판 (storyboard/ep01.md)
const pages: Page[] = [];

// P1 현재 · 갤러리 (한 컷 페이지)
pages.push({
  panels: [P("c01", full(), { fy: 40, drift: [-30, 0], caps: [{ text: "그 사진에만,\n색이 남아 있었다.", x: 0.06, y: 0.05, at: 0.6 }] })],
  beats: [{ p: 0, dur: 4.4, glide: 0, push: 0.06, sfx: [{ name: "room", vol: 0.5, dur: 4.4 }] }],
  out: "cut",
});

// P2 사진 속 끈 → 기자의 질문
{
  const [a, b] = rows(1.1, 1);
  pages.push({
    panels: [
      P("c02", a, { fy: 72, color: { img: C("c02"), ox: 42, oy: 88, at: 0.8, dur: 1.8 } }),
      P("c03", b, {
        fy: 30,
        bubbles: [
          { text: "이 소년은…\n지금 어디 있나요?", x: 0.26, y: 0.8, kind: "off", at: 0.3 },
          { text: "…몰라요.", x: 0.8, y: 0.22, tail: "bl", at: 3.0 },
          { text: "6년 전, 그날 이후로.", x: 0.7, y: 0.9, tail: "tl", at: 4.6 },
        ],
      }),
    ],
    beats: [
      { p: "page", dur: 0.5, glide: 0 },
      { p: 0, dur: 4.0, sfx: [{ name: "high_note", at: 0.7, vol: 0.7 }] },
      { p: 1, dur: 6.8, sfx: [{ name: "room", vol: 0.45, dur: 6.8 }] },
    ],
    out: "black",
  });
}

// P3 타이틀
pages.push({ panels: [], title: { main: "색이 번지는 날", sub: "1화  필름 한 롤" }, beats: [{ p: "page", dur: 4.2, push: 0.02, sfx: [{ name: "waves", at: 1.2, vol: 0.5, dur: 3 }] }], out: "burn" });

// P4 해진 · 골목
{
  const [top, bot] = rows(1, 1.4);
  const [l, r] = cols(bot, 1.3, 1);
  pages.push({
    panels: [
      P("c04", top, { fy: 55, drift: [-40, 0], caps: [{ text: "열아홉. 해진.", x: 0.05, y: 0.08, at: 0.6 }] }),
      P("c05", l, { fy: 50, drift: [0, -40], bubbles: [{ text: "니가\n차무결이가?", x: 0.5, y: 0.14, tail: "bl", at: 1.4 }] }),
      P("c06", r, { fy: 35 }),
    ],
    beats: [
      { p: "page", dur: 0.5, glide: 0 },
      { p: 0, dur: 4.2, sfx: [{ name: "wind", vol: 0.5, dur: 4.2 }, { name: "gull", at: 1.3, vol: 0.6 }] },
      { p: 1, dur: 4.0, sfx: [{ name: "crowd", vol: 0.35, dur: 4 }] },
      { p: 2, dur: 2.0 },
    ],
  });
}

// P5 맞는다 (사선 컷)
{
  const [a, b] = diag(56, 42);
  pages.push({
    panels: [
      P("c07", a.r, { clip: a.clip, fy: 30, sfx: [{ text: "퍽", x: 0.8, y: 0.12, size: 220, rot: 12, at: 0.13 }] }),
      P("c06b", b.r, { clip: b.clip, fy: 55, bubbles: [{ text: "와… 진짜\n안 때리네?", x: 0.3, y: 0.86, tail: "tr", at: 0.4 }] }),
    ],
    beats: [
      { p: 0, dur: 1.6, glide: 0.15, shake: [0.13], neg: [0.13], speed: true, sfx: [{ name: "hit", at: 0, vol: 0.9 }] },
      { p: 1, dur: 3.2, glide: 0.35 },
    ],
  });
}

// P6 규칙 · 벽돌 · 눈 (아래 띠 컷)
{
  const [a, b, c] = rows(1.15, 1.15, 0.45);
  pages.push({
    panels: [
      P("c08", a, { fy: 55, caps: [{ text: "먼저 안 때린다.\n그 애의 규칙이었다.", x: 0.05, y: 0.07, at: 0.5 }] }),
      P("c09", b, { fy: 35, z: 1.16, bubbles: [{ text: "그럼\n계속 맞든가.", x: 0.22, y: 0.8, tail: "tr", at: 0.3 }] }),
      P("c10", c, { fy: 40, z: 1.1 }),
    ],
    beats: [
      { p: 0, dur: 4.0, sfx: [{ name: "rustle", at: 0.3, vol: 0.6 }] },
      { p: 1, dur: 2.8, shake: [0.2], sfx: [{ name: "scrape", at: 0.1, vol: 0.7 }] },
      { p: 2, dur: 1.3, zoom: 1.7, glide: 0.25 }, // 무음 타메
    ],
    out: "cut",
  });
}

// P7 반격 — 세 컷, 가운데 컷이 테두리를 깨고 튀어나온다
{
  const [a, b, c] = rows(0.8, 1.4, 0.9);
  pages.push({
    panels: [
      P("c11a", a, { clip: "polygon(0 0, 100% 0, 100% 84%, 0 100%)", fy: 45 }),
      P("c11b", b, { clip: "polygon(0 7%, 100% 0, 100% 93%, 0 100%)", fy: 45, sfx: [{ text: "쾅", x: 0.78, y: 0.78, size: 330, rot: -12 }] }),
      P("c11c", c, { clip: "polygon(0 0, 100% 14%, 100% 100%, 0 100%)", fy: 40 }),
    ],
    beats: [
      { p: 0, dur: 0.7, glide: 0.1, speed: true, sfx: [{ name: "whoosh", vol: 0.8 }, { name: "hit_heavy", at: 0.5, vol: 0.8 }] },
      { p: 1, dur: 1.4, breakOut: true, big: true, shake: [0], neg: [0, 0.13], speed: true },
      { p: 2, dur: 1.5, glide: 0.25, sfx: [{ name: "wind", vol: 0.4, dur: 1.5 }] },
      { p: "page", dur: 0.7, glide: 0.25 },
    ],
  });
}

// P8 여파
pages.push({ panels: [P("c12", full(), { fy: 50, drift: [0, 30] })], beats: [{ p: 0, dur: 3.8, glide: 0, push: -0.05, sfx: [{ name: "wind", vol: 0.55, dur: 3.8 }] }], out: "shutter" });

// P9 셔터 — 하린의 뷰파인더
pages.push({
  panels: [P("c13", full(), { fy: 45, grain: true, sfx: [{ text: "찰칵", x: 0.74, y: 0.16, size: 150, rot: 8 }] })],
  beats: [{ p: 0, dur: 4.0, glide: 0, sfx: [{ name: "shutter", vol: 0.9 }, { name: "film_wind", at: 1.6, vol: 0.7 }] }],
});

// P10 첫 대화 (네 컷)
{
  const [r1, r2] = rows(1, 1);
  const [a, b] = cols(r1, 1, 1);
  const [c, d] = cols(r2, 1, 1);
  pages.push({
    panels: [
      P("c14", a, { fy: 35, bubbles: [{ text: "와.\n진짜 먼저\n안 때리네.", x: 0.5, y: 0.15, tail: "bl", size: 36 }] }),
      P("c15", b, { fy: 30, bubbles: [{ text: "필름 내놔.", x: 0.5, y: 0.1, tail: "br", size: 36 }] }),
      P("c16", c, { fy: 35, bubbles: [{ text: "싫은데?", x: 0.36, y: 0.12, tail: "br", size: 36 }] }),
      P("c15b", d, { fy: 30, bubbles: [{ text: "…니 누고.", x: 0.5, y: 0.88, tail: "tr", size: 36 }] }),
    ],
    beats: [
      { p: "page", dur: 0.5, glide: 0 },
      { p: 0, dur: 4.2, sfx: [{ name: "waves", vol: 0.35, dur: 4.2 }] },
      { p: 1, dur: 3.4 },
      { p: 2, dur: 2.8 },
      { p: 3, dur: 2.6 },
    ],
  });
}

// P11 자기소개 → 빨간 목도리
{
  const [a, b] = rows(0.75, 1.6);
  pages.push({
    panels: [
      P("c15c", a, { fy: 12, bubbles: [{ text: "해진여고 사진부.\n서하린.", x: 0.7, y: 0.28, tail: "bl" }] }),
      P("c17", b, { fy: 45, z: 1.14, drift: [0, -30], color: { img: C("c17"), ox: 50, oy: 40, at: 0.6, dur: 2 } }),
    ],
    beats: [
      { p: 0, dur: 3.2, glide: 0.4 },
      { p: 1, dur: 5.0, sfx: [{ name: "cello_note", at: 0.5, vol: 0.8 }, { name: "wind", vol: 0.4, dur: 5 }] },
    ],
    out: "cut",
  });
}

// P12 처음 생긴 색 (여백 페이지)
pages.push({
  panels: [P("c18", full(), { fy: 40, caps: [{ text: "흑백이던 그 애의 세상에,\n처음 생긴 색.", x: 0.08, y: 0.82, at: 0.8, w: 0.84 }] })],
  beats: [{ p: 0, dur: 5.0, glide: 0, push: 0.08 }],
  out: "cut",
});

// P13 골목 끝에서
pages.push({
  panels: [P("c17b", full(), { fy: 45, z: 1.14, color: { img: C("c17b"), ox: 50, oy: 55, at: 0, dur: 0.6 }, bubbles: [{ text: "사진 잘 나오면\n보여 줄게!", x: 0.62, y: 0.2, tail: "bl", at: 0.3 }] })],
  beats: [{ p: 0, dur: 3.8, glide: 0, sfx: [{ name: "gull", at: 0.6, vol: 0.5 }] }],
  out: "black",
});

// P14 그날 밤 · 암실
{
  const [a, b] = rows(1, 1);
  pages.push({
    panels: [
      P("c19", a, { fy: 45, dark: true }),
      P("c20", b, { fy: 45, dark: true, bubbles: [{ text: "근데 왜…\n손을 폈어?", x: 0.68, y: 0.16, kind: "whisper", tail: "none", at: 1.0 }] }),
    ],
    bg: "black",
    beats: [
      { p: 0, dur: 5.4, glide: 0.5, sfx: [{ name: "water", vol: 0.6, dur: 5.4 }, { name: "tick", vol: 0.5, dur: 5.4 }] },
      { p: 1, dur: 5.6, sfx: [{ name: "tick", vol: 0.4, dur: 5.6 }] },
    ],
  });
}

// P15 다음 날 · 교문
{
  const [top, bot] = rows(1, 1.15);
  const [l, r] = cols(bot, 1.2, 1);
  pages.push({
    panels: [
      P("c21", top, { fy: 45, drift: [30, 0], bubbles: [{ text: "니 어제 또 맞았제?\n아니 내 말은, 싸웠… 맞았…", x: 0.5, y: 0.13, tail: "br", size: 36 }] }),
      P("c22", l, { fy: 35, color: { img: C("c22"), ox: 50, oy: 40, at: 0.1, dur: 1.2 }, bubbles: [{ text: "차무결!", x: 0.5, y: 0.1, kind: "shout", tail: "bl" }] }),
      P("c23", r, { fy: 35, bubbles: [{ text: "…니가?\n니한테?", x: 0.5, y: 0.88, tail: "tl", size: 36 }] }),
    ],
    beats: [
      { p: "page", dur: 0.5, glide: 0 },
      { p: 0, dur: 4.8, sfx: [{ name: "crowd", vol: 0.45, dur: 4.8 }] },
      { p: 1, dur: 3.2, sfx: [{ name: "crowd", vol: 0.6, dur: 3.2 }] },
      { p: 2, dur: 2.6, shake: [0.1], sfx: [{ name: "gag", at: 0.1, vol: 0.6 }] },
    ],
  });
}

// P16 클리프행어
pages.push({
  panels: [
    P("c24", full(), {
      fy: 40,
      color: { img: C("c24"), ox: 50, oy: 75, at: 0.1, dur: 1.2 },
      bubbles: [
        { text: "모델 할래?", x: 0.5, y: 0.12, tail: "bl", size: 42, at: 0.4 },
        { text: "아니면 이거,\n학주한테 간다.", x: 0.5, y: 0.88, tail: "tl", size: 40, at: 2.8 },
      ],
    }),
  ],
  beats: [{ p: 0, dur: 6.4, glide: 0, push: 0.07, sfx: [{ name: "paper", at: 0.2, vol: 0.7 }, { name: "shutter", at: 6.1, vol: 0.8 }] }],
  out: "cut",
});

// P17 마지막 정지 + 끝 카드
pages.push({
  panels: [P("c25", full(), { fy: 30, color: { img: C("c25"), ox: 50, oy: 50, at: 0, dur: 0.6 } })],
  beats: [{ p: 0, dur: 6.0, glide: 0, push: 0.03, sfx: [{ name: "stinger", vol: 0.6 }] }],
  card: { q: "하린이는 왜 필름을 안 줬을까?", sub: "2화 — 무결이 처음으로 카메라 앞에 섭니다.\n이어 보려면 구독", b: 0, at: 0.3 },
});

// 페이지 시작 시각(초) — 음악 타이밍용
const pageAt = (i: number) => pages.slice(0, i).reduce((a, p) => a + pageFrames(p), 0) / FPS;
const END = pageAt(pages.length);

export const ep01: Comic = {
  assets,
  pages,
  tracks: [
    // 피아노 테마: 갤러리 → 타이틀 / 긴장: 골목 → 타메 직전에 뚝 / 테마: 하린 등장부터 끝까지
    { name: "theme", from: 0, to: pageAt(3) + 0.2, vol: 0.38, fadeIn: 1.5, fadeOut: 2.5 },
    { name: "tension", from: pageAt(3) + 1, to: pageAt(6) + 6.8, vol: 0.55, fadeIn: 2, fadeOut: 0.2 },
    { name: "theme", from: pageAt(9), to: END, vol: 0.4, fadeIn: 3, fadeOut: 4, offset: 20 },
  ],
};
