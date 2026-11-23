// sentinel shots.json 생성 — 길이만 적으면 시작 시각(from)을 자동으로 계산한다.
//   node extremes/content/sentinel/script/build-shots.mjs  (저장소 루트에서)
// 구조: 훅(질문) → 흔한 오해 → 진짜 이유 → 증거 1880 · 이웃 섬 → 반전 2004 → 원칙 → 끝 (다음 ② 예고)
import { writeFileSync } from "node:fs";
const T = (at, to, ko, en, big) => ({ at, to, ko, en, ...(big ? { big: true } : {}) });
const NS = "wikimedia-northsentinel.jpg";
const NS_CREDIT = "Photo: NASA Earth Observatory / Jesse Allen (public domain)";
const list = [
  // 훅: 섬 + 접근 금지 원 + 질문
  { type: "photo", dur: 2.4, image: NS, fit: "contain", focus: [0.5, 0.45], zoom: [1.0, 1.12], credit: NS_CREDIT,
    zone: { x: 540, y: 918, r: 470, at: 0.25, ko: "접근 금지", en: "NO ENTRY" },
    hits: [{ at: 0.0, kind: "flash" }, { at: 1.35, kind: "shake" }],
    texts: [T(0.3, 1.3, "다가가기만 해도\n불법인 섬", "Even getting close\nis a crime", true), T(1.35, 2.35, "도대체 왜?", "So… why?", true)] },
  // 흔한 오해
  { type: "photo", dur: 2.2, video: "pixabay-76854806.mp4", rate: 0.7, illustrative: true, zoom: [1.1, 1.25], tint: 0.15,
    texts: [T(0.1, 2.15, "섬사람들이 외부인을\n공격해서?", "Because they\nattack outsiders?", true)] },
  { type: "card", dur: 1.8, bg: "radial-gradient(ellipse at 50% 45%, #3A0008 0%, #070102 75%)", stamp: { text: "NO", at: 0.1 },
    hits: [{ at: 0.1, kind: "glitch" }],
    texts: [T(0.6, 1.75, "그것만이 아니다", "That's not\nthe whole story", true)] },
  // 진짜 이유
  { type: "photo", dur: 3.2, video: "pixabay-cd753901.mp4", rate: 0.6, illustrative: true, zoom: [1.1, 1.3], tint: 0.1,
    texts: [T(0.1, 1.5, "진짜 이유는\n섬사람들을 지키려고", "The real reason:\nto protect THEM", true), T(1.55, 3.15, "바깥 병균에\n면역이 없을 수 있다", "They may have\nno immunity\nto our germs")] },
  // 증거 1: 1880
  { type: "card", dur: 4.4, bg: "linear-gradient(180deg, #3B2A18 0%, #120B05 100%)", stamp: { text: "1880", at: 0.1 },
    hits: [{ at: 2.15, kind: "red" }],
    texts: [T(0.3, 2.1, "영국 탐험대가 섬에서\n6명을 데려갔다", "In 1880, British\nexplorers took\nsix islanders"), T(2.15, 4.35, "노부부는 곧 병들어\n숨졌다", "The old couple\nsoon got sick\nand died", true)] },
  // 증거 2: 이웃 섬
  { type: "photo", dur: 3.6, image: "wikimedia-andaman-modis.jpg", focus: [0.26, 0.6], zoom: [1.0, 1.12], panY: [-13, -13], credit: "Photo: NASA MODIS / LANCE (public domain)",
    zone: { x: 281, y: 900, r: 80, at: 0.2, ko: "북센티널섬", en: "HERE" },
    hits: [{ at: 1.75, kind: "red" }],
    texts: [T(0.1, 1.7, "이웃 섬 원주민들은", "Their neighbors…", true), T(1.75, 3.55, "접촉 뒤 전염병으로\n대부분 사라졌다", "After contact,\ndisease wiped out\nmost of them")] },
  // 반전: 2004
  { type: "photo", dur: 3.0, video: "pixabay-9d206891.mp4", rate: 0.8, illustrative: true, zoom: [1.1, 1.25], tint: 0.15,
    hits: [{ at: 0.1, kind: "shake" }],
    texts: [T(0.1, 1.4, "2004년\n인도양 쓰나미", "2004: a massive\ntsunami hits"), T(1.45, 2.95, "섬사람들은\n모두 사라졌을까?", "Were they\nall gone?", true)] },
  { type: "photo", dur: 4.2, video: "pixabay-2acd8465.mp4", rate: 0.8, illustrative: true, zoom: [1.15, 1.3], focus: [0.48, 0.45], tint: 0.1,
    hits: [{ at: 2.05, kind: "flash" }],
    texts: [T(0.1, 2.0, "확인하러 간 헬기에\n한 남자가 활을 겨눴다", "A man aimed\nhis bow at\nthe helicopter"), T(2.05, 4.15, "살아남았다\n그리고 또 거절했다", "Alive.\nAnd still\nsaying no.", true)] },
  // 원칙
  { type: "photo", dur: 3.0, image: NS, fit: "contain", focus: [0.5, 0.45], zoom: [1.08, 1.18], tint: 0.35, credit: NS_CREDIT,
    texts: [T(0.1, 1.3, "인도 정부의 원칙", "India's rule", true), T(1.35, 2.95, "지켜보되\n건드리지 않는다", "Watch.\nDon't touch.", true)] },
  { type: "end", dur: 3.0 },
];
let t = 0;
const shots = list.map(({ type, dur, ...rest }) => { const o = { type, from: +t.toFixed(2), dur, ...rest }; t += dur; return o; });
const data = {
  fps: 30, bpm: 60, no: "NO ENTRY ①", series: { n: 1, total: 5 }, bgm: "bgm/sentinel.wav", lang: "en", accent: "#FF3B4E", transition: "glitch",
  endBg: "radial-gradient(ellipse at 50% 40%, #2A0508 0%, #070102 75%)",
  thumb: { image: NS, focus: [0.5, 0.5], zoom: 1.0, big: "WHY?", unit: "", ko: "다가가기만 해도\n불법인 섬", en: "Illegal to\neven approach", tag: "Photo: NASA Earth Observatory (public domain)" },
  end: {
    ko: "5곳의 진짜 이유, 하나씩\n구독하면 이어서 보여요", en: "5 places you can't go.\nOne real reason each.\nSubscribe for the next.",
    askKo: "이 섬, 계속 그대로\n두는 게 맞을까?", askEn: "Should the world\nleave them alone?",
    next: { image: "wikimedia-25b75ed7.jpg", focus: [0.47, 0.16], ko: "② 에어리어 51", en: "② Area 51" },
  },
  shots,
};
writeFileSync(new URL("./shots.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log("total", t.toFixed(2), "s,", shots.length, "shots");
