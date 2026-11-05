import { Ep } from "../timeline";
import assets from "./ep01.assets.json";

const I = (id: string) => `comics/ep01/${id}.jpg`;
const C = (id: string) => `comics/ep01/${id}.color.png`;

// 1화 「필름 한 롤」 — storyboard/ep01.md 의 타임라인을 그대로 옮긴 것
export const ep01: Ep = {
  fps: 30,
  assets,
  shots: [
    // ── 현재 · 갤러리 ──
    {
      img: I("c01"), dur: 4.2, from: { s: 1.06 }, to: { s: 1.16, x: -60 }, enter: "fade",
      texts: [{ kind: "nar", text: "그 사진에만,\n색이 남아 있었다.", at: 0.6, dur: 3.4, y: 330 }],
      sfx: [{ name: "room", vol: 0.5, dur: 4.2 }],
    },
    {
      img: I("c02"), dur: 4.2, from: { s: 1.08 }, to: { s: 1.35, x: 120, y: -330 }, enter: "burn",
      color: { img: C("c02"), at: 1.2, dur: 1.8, ox: 45, oy: 85 },
      sfx: [{ name: "high_note", at: 1.1, vol: 0.7 }],
    },
    {
      img: I("c03"), dur: 6.6, from: { s: 1.08 }, to: { s: 1.14, y: 20 }, enter: "cut",
      texts: [
        { kind: "say", text: "이 소년은…\n지금 어디 있나요?", at: 0.3, dur: 2.6, x: 420, y: 1500, tail: "l" },
        { kind: "say", text: "…몰라요.", at: 3.0, dur: 1.6, x: 640, y: 1380, tail: "r" },
        { kind: "say", text: "6년 전, 그날 이후로.", at: 4.6, dur: 2.0, x: 600, y: 1380, tail: "r" },
      ],
      sfx: [{ name: "room", vol: 0.45, dur: 6.6 }],
    },
    {
      dur: 4.2, enter: "black", bg: "paper",
      texts: [{ kind: "title", text: "색이 번지는 날\n1화  필름 한 롤", at: 0.2 }],
      sfx: [{ name: "waves", at: 1.2, vol: 0.5, dur: 3 }],
    },
    // ── 과거 · 해진 골목 ──
    {
      img: I("c04"), dur: 4.6, from: { s: 1.2, y: 140 }, to: { s: 1.08, y: -40 }, enter: "burn",
      texts: [{ kind: "nar", text: "열아홉. 해진.", at: 0.8, dur: 3.4, y: 300 }],
      sfx: [{ name: "wind", vol: 0.5, dur: 4.6 }, { name: "gull", at: 1.4, vol: 0.6 }],
    },
    {
      img: I("c05"), dur: 4.0, from: { s: 1.25, y: 260 }, to: { s: 1.1, y: -120 }, enter: "ink",
      texts: [{ kind: "say", text: "니가 차무결이가?", at: 1.6, dur: 2.4, x: 540, y: 1250, tail: "l" }],
      sfx: [{ name: "crowd", vol: 0.35, dur: 4 }],
    },
    {
      img: I("c06"), dur: 2.0, from: { s: 1.1 }, to: { s: 1.16 }, enter: "cut",
      sfx: [{ name: "wind", vol: 0.3, dur: 2 }],
    },
    {
      img: I("c07"), dur: 1.6, from: { s: 1.24 }, to: { s: 1.1, x: -30 }, ease: "out", enter: "cut", fx: ["shake", "speed"], speedAt: [600, 700], negAt: [0.05], shakeAt: [0.05], punchAt: [0.05],
      texts: [{ kind: "sfx", text: "퍽", at: 0.05, dur: 1.5, x: 840, y: 330, size: 240, rot: 12 }],
      sfx: [{ name: "hit", at: 0.05, vol: 0.9 }],
    },
    {
      img: I("c06b"), dur: 3.0, from: { s: 1.06 }, to: { s: 1.14, x: 30 }, enter: "cut",
      texts: [{ kind: "say", text: "와… 진짜 안 때리네?", at: 0.4, dur: 2.5, x: 560, y: 1480, tail: "l" }],
    },
    {
      img: I("c08"), dur: 4.0, from: { s: 1.06 }, to: { s: 1.2, y: -60 }, enter: "cut",
      texts: [{ kind: "nar", text: "먼저 안 때린다.\n그 애의 규칙이었다.", at: 0.5, dur: 3.4, y: 330 }],
      sfx: [{ name: "rustle", at: 0.3, vol: 0.6 }],
    },
    {
      img: I("c09"), dur: 2.8, from: { s: 1.06, y: 60 }, to: { s: 1.2, y: 0 }, enter: "cut", shakeAt: [0.2],
      texts: [{ kind: "say", text: "그럼 계속 맞든가.", at: 0.4, dur: 2.5, x: 560, y: 1500, tail: "l" }],
      sfx: [{ name: "scrape", at: 0.1, vol: 0.7 }],
    },
    { img: I("c10"), dur: 1.2, from: { s: 1.1 }, to: { s: 1.14 }, enter: "cut" }, // 무음 타메
    // 액션 3연속: 피함(준비) → 임팩트 → 여파
    {
      img: I("c11a"), dur: 0.7, from: { s: 1.18, x: -30, r: -3 }, to: { s: 1.1, x: 20, r: 2 }, ease: "out", enter: "cut", fx: ["speed"], speedAt: [620, 560],
      sfx: [{ name: "scrape", vol: 0.8 }],
    },
    {
      img: I("c11b"), dur: 1.5, from: { s: 1.34 }, to: { s: 1.12 }, ease: "out", enter: "cut", fx: ["bigshake", "speed"], speedAt: [540, 900], negAt: [0, 0.13], shakeAt: [0], punchAt: [0],
      texts: [{ kind: "sfx", text: "쾅", at: 0, dur: 1.5, x: 780, y: 1300, size: 380, rot: -12 }],
      sfx: [{ name: "hit_heavy", vol: 1 }],
    },
    {
      img: I("c11c"), dur: 1.6, from: { s: 1.06, y: -40 }, to: { s: 1.14, y: 20 }, ease: "linear", enter: "cut",
      sfx: [{ name: "wind", vol: 0.4, dur: 1.6 }],
    },
    {
      img: I("c12"), dur: 3.8, from: { s: 1.2 }, to: { s: 1.06 }, enter: "cut",
      sfx: [{ name: "wind", vol: 0.55, dur: 3.8 }],
    },
    // ── 셔터 · 하린 ──
    {
      img: I("c13"), dur: 4.0, from: { s: 1.06 }, to: { s: 1.12 }, enter: "shutter", fx: ["grain"],
      texts: [{ kind: "sfx", text: "찰칵", at: 0, dur: 1.4, x: 780, y: 420, size: 170, rot: 8 }],
      sfx: [{ name: "shutter", vol: 0.9 }, { name: "film_wind", at: 1.6, vol: 0.7 }],
    },
    {
      img: I("c14"), dur: 4.4, from: { s: 1.14, x: -40 }, to: { s: 1.06, x: 20 }, enter: "cut",
      texts: [{ kind: "say", text: "와.\n진짜 먼저 안 때리네.", at: 0.6, dur: 3.6, x: 600, y: 360, tail: "l" }],
      sfx: [{ name: "waves", vol: 0.35, dur: 4.4 }],
    },
    {
      img: I("c15"), dur: 3.6, from: { s: 1.08 }, to: { s: 1.13, y: 30 }, enter: "cut",
      texts: [{ kind: "say", text: "필름 내놔.", at: 0.4, dur: 3, x: 330, y: 360, tail: "r" }],
    },
    {
      img: I("c16"), dur: 2.8, from: { s: 1.06 }, to: { s: 1.14 }, enter: "cut",
      texts: [{ kind: "say", text: "싫은데?", at: 0.3, dur: 2.4, x: 360, y: 360, tail: "r", size: 58 }],
    },
    {
      img: I("c15b"), dur: 2.4, from: { s: 1.06 }, to: { s: 1.12 }, enter: "cut",
      texts: [{ kind: "say", text: "…니 누고.", at: 0.3, dur: 2.0, x: 560, y: 1500, tail: "l" }],
    },
    {
      img: I("c15c"), dur: 3.2, from: { s: 1.12, x: 30 }, to: { s: 1.06, x: -10 }, enter: "cut",
      texts: [{ kind: "say", text: "해진여고 사진부.\n서하린.", at: 0.3, dur: 2.8, x: 560, y: 380, tail: "l" }],
    },
    {
      img: I("c17"), dur: 5.0, from: { s: 1.06 }, to: { s: 1.14, y: -40 }, enter: "cut",
      color: { img: C("c17"), at: 0.6, dur: 2.0, ox: 50, oy: 40 },
      sfx: [{ name: "cello_note", at: 0.5, vol: 0.8 }, { name: "wind", vol: 0.4, dur: 5 }],
    },
    {
      img: I("c18"), dur: 5.0, from: { s: 1.04 }, to: { s: 1.16 }, enter: "fade",
      texts: [{ kind: "nar", text: "흑백이던 그 애의 세상에,\n처음 생긴 색.", at: 0.8, dur: 4, y: 1560 }],
    },
    {
      img: I("c17b"), dur: 3.6, from: { s: 1.06 }, to: { s: 1.14, y: -30 }, enter: "cut",
      color: { img: C("c17b"), at: 0, dur: 0.01, ox: 50, oy: 40 },
      texts: [{ kind: "say", text: "사진 잘 나오면\n보여 줄게!", at: 0.3, dur: 3.2, x: 560, y: 380, tail: "l" }],
      sfx: [{ name: "gull", at: 0.6, vol: 0.5 }],
    },
    // ── 그날 밤 · 암실 ──
    {
      img: I("c19"), dur: 5.4, from: { s: 1.12, y: 40 }, to: { s: 1.06, y: -30 }, enter: "ink", fx: ["vignette"],
      sfx: [{ name: "water", vol: 0.6, dur: 5.4 }, { name: "tick", vol: 0.5, dur: 5.4 }],
    },
    {
      img: I("c20"), dur: 5.6, from: { s: 1.06 }, to: { s: 1.16, x: 30 }, enter: "cut",
      texts: [{ kind: "whisper", text: "근데 왜…\n손을 폈어?", at: 1.2, dur: 4.2, x: 560, y: 360, tail: "none" }],
      sfx: [{ name: "tick", vol: 0.4, dur: 5.6 }],
    },
    // ── 다음 날 · 교문 ──
    {
      img: I("c21"), dur: 5.0, from: { s: 1.12, x: -40 }, to: { s: 1.06, x: 30 }, enter: "ink",
      texts: [{ kind: "say", text: "니 어제 또 맞았제?\n아니 내 말은, 싸웠… 맞았…", at: 0.5, dur: 4.4, x: 560, y: 360, tail: "r", size: 44 }],
      sfx: [{ name: "crowd", vol: 0.45, dur: 5 }],
    },
    {
      img: I("c22"), dur: 3.4, from: { s: 1.06 }, to: { s: 1.18 }, enter: "cut",
      color: { img: C("c22"), at: 0.1, dur: 1.2, ox: 50, oy: 40 },
      texts: [{ kind: "shout", text: "차무결!", at: 0.4, dur: 2.8, x: 560, y: 360, tail: "l" }],
      sfx: [{ name: "crowd", vol: 0.6, dur: 3.4 }],
    },
    {
      img: I("c23"), dur: 2.8, from: { s: 1.06 }, to: { s: 1.1 }, enter: "cut", shakeAt: [0.1],
      texts: [{ kind: "say", text: "…니가? 니한테?", at: 0.3, dur: 2.4, x: 540, y: 1520, tail: "l" }],
      sfx: [{ name: "gag", at: 0.1, vol: 0.6 }],
    },
    {
      img: I("c24"), dur: 6.4, from: { s: 1.06 }, to: { s: 1.14 }, enter: "cut",
      color: { img: C("c24"), at: 0.1, dur: 1.2, ox: 50, oy: 75 },
      texts: [
        { kind: "say", text: "모델 할래?", at: 0.4, dur: 2.2, x: 560, y: 360, tail: "l", size: 56 },
        { kind: "say", text: "아니면 이거,\n학주한테 간다.", at: 2.8, dur: 3.6, x: 560, y: 360, tail: "l", size: 54 },
      ],
      sfx: [{ name: "paper", at: 0.2, vol: 0.7 }, { name: "shutter", at: 6.2, vol: 0.8 }],
    },
    // ── 끝 카드 ──
    {
      img: I("c25"), dur: 6.0, from: { s: 1.1, y: -30 }, to: { s: 1.16, y: -60 }, enter: "cut",
      color: { img: C("c25"), at: 0, dur: 0.01, ox: 50, oy: 75 },
      texts: [{ kind: "card", text: "하린이는 왜 필름을 안 줬을까?\n|\n2화 — 무결이 처음으로 카메라 앞에 섭니다.\n이어 보려면 구독", at: 0.2, y: 1120 }],
    },
  ],
  tracks: [
    // 피아노 테마: 갤러리 → 타이틀까지 / 긴장: 골목 → 타메 직전에 뚝 / 테마: 하린 등장부터 끝까지
    { name: "theme", from: 0, to: 19.4, vol: 0.45, fadeIn: 1.5, fadeOut: 2.5 },
    { name: "tension", from: 23.8, to: 41.2, vol: 0.55, fadeIn: 2, fadeOut: 0.2 },
    { name: "theme", from: 54.0, to: 118.2, vol: 0.4, fadeIn: 3, fadeOut: 4, offset: 20 },
  ],
};
