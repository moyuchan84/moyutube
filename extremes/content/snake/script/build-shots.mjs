// snake shots.json 생성 — 길이만 적으면 시작 시각(from)을 자동으로 계산한다.
//   node extremes/content/snake/script/build-shots.mjs  (저장소 루트에서)
// 구조: 훅(상륙 금지) → 오해(1 m²에 한 마리 · 등대 전설) → 진짜 이유(뱀을 지키려고) → 증거(1만 1천 년 · 새 사냥 독) → 반전(밀수꾼) → 원칙 → 끝(④ 라스코)
import { writeFileSync } from "node:fs";
const T = (at, to, ko, en, big) => ({ at, to, ko, en, ...(big ? { big: true } : {}) });
const AIR = "wikimedia-46882c63.jpg";
const DUSK = "wikimedia-7d847e2a.jpg";
const SNAKE = "wikimedia-4ec0aadc.jpg";
const AIR_CREDIT = "Photo: Queimada Grande, MTur Destinos (public domain)";
const SNAKE_CREDIT = "Photo: golden lancehead, Otavio A. Marques (CC BY 4.0)";
const list = [
  // 훅
  { type: "photo", dur: 2.4, image: AIR, zoom: [1.0, 1.15], focus: [0.5, 0.5], credit: AIR_CREDIT,
    zone: { x: 560, y: 900, r: 430, at: 0.25, ko: "상륙 금지", en: "NO LANDING" },
    hits: [{ at: 0.0, kind: "flash" }, { at: 1.35, kind: "shake" }],
    texts: [T(0.3, 1.3, "누구도 내릴 수 없는 섬", "No one is allowed\nto land here", true), T(1.35, 2.35, "왜일까?", "Why?", true)] },
  // 오해 1: 1 m² 에 한 마리
  { type: "photo", dur: 2.4, video: "pixabay-b7e7bebd.mp4", rate: 0.6, illustrative: true, zoom: [1.15, 1.3], tint: 0.15,
    texts: [T(0.1, 2.35, "땅 1 m²마다\n독사가 한 마리?", "A deadly snake\nin every\nsquare meter?", true)] },
  { type: "card", dur: 2.6, bg: "radial-gradient(ellipse at 50% 45%, #1F2A08 0%, #050701 75%)", stamp: { text: "MYTH", at: 0.1 },
    hits: [{ at: 0.1, kind: "glitch" }],
    texts: [T(0.55, 1.55, "실제 추정은\n2,000~4,000마리", "Real estimate:\n2,000–4,000", true), T(1.6, 2.55, "한 마리당\n100 m²가 넘는다", "That's over\n100 m² each")] },
  // 오해 2: 등대 전설
  { type: "photo", dur: 3.2, image: DUSK, zoom: [1.35, 1.5], focus: [0.6, 0.8], tint: 0.25, credit: "Photo: Queimada Grande at dusk, MTur Destinos (public domain)",
    texts: [T(0.1, 1.6, "등대지기 가족이\n뱀에게 당했다는 전설", "Legend says snakes\nkilled the\nlighthouse family"), T(1.65, 3.15, "기록엔 등대가 자동화되며\n떠났다고 남아 있다", "Records say they\njust left when the\nlight went automatic")] },
  // 진짜 이유
  { type: "photo", dur: 3.4, image: SNAKE, zoom: [1.5, 1.8], focus: [0.56, 0.5], credit: SNAKE_CREDIT,
    hits: [{ at: 0.0, kind: "red" }],
    texts: [T(0.1, 1.7, "진짜 이유는\n뱀을 지키려고", "The real reason:\nto protect\nthe SNAKES", true), T(1.75, 3.35, "지구에서\n이 섬에만 산다", "They live\nnowhere else\non Earth")] },
  // 증거 1: 갇힌 시간
  { type: "photo", dur: 3.6, video: "pixabay-84c6d64e.mp4", rate: 0.7, illustrative: true, zoom: [1.1, 1.25], tint: 0.45,
    counter: { to: 11000, unit: " years ago", start: 0.1, dur: 1.4 },
    texts: [T(1.0, 3.55, "바다가 차올라\n섬에 갇혔다", "Rising seas\ntrapped them\non this rock")] },
  // 증거 2: 새를 노리는 독
  { type: "photo", dur: 3.8, video: "pixabay-985e1178.mp4", rate: 0.7, illustrative: true, zoom: [1.1, 1.2], tint: 0.35,
    hits: [{ at: 1.9, kind: "shake" }],
    texts: [T(0.1, 1.85, "땅엔 먹이가 거의 없어\n철새를 노린다", "Almost no prey\non the ground.\nSo: migrating birds"), T(1.9, 3.75, "새가 날아가기 전에\n끝내야 하는 독", "Venom that must\nwork before the\nbird flies away", true)] },
  // 반전: 밀수꾼
  { type: "card", dur: 3.4, bg: "radial-gradient(ellipse at 50% 45%, #2A1F02 0%, #070501 75%)", stamp: { text: "SMUGGLED", at: 0.1 },
    hits: [{ at: 0.1, kind: "glitch" }, { at: 1.95, kind: "red" }],
    texts: [T(0.55, 1.9, "그런데 몰래\n들어오는 사람들", "But people\nsneak in anyway", true), T(1.95, 3.35, "이 독이 암시장에서\n비싸게 팔리니까", "Its venom sells\non the black market")] },
  { type: "photo", dur: 3.0, image: SNAKE, zoom: [2.0, 2.2], focus: [0.62, 0.48], tint: 0.15, credit: SNAKE_CREDIT,
    hits: [{ at: 0.0, kind: "flash" }, { at: 0.0, kind: "shake" }],
    texts: [T(0.15, 1.45, "멸종 위기 '위급'", "Critically\nendangered", true), T(1.5, 2.95, "위험한 건 뱀일까\n사람일까", "So who's the\nreal danger here?", true)] },
  // 원칙
  { type: "photo", dur: 2.6, image: AIR, zoom: [1.2, 1.3], focus: [0.5, 0.45], tint: 0.35, credit: AIR_CREDIT,
    texts: [T(0.1, 2.55, "해군과 허가받은\n연구자만 내릴 수 있다", "Only the Navy and\npermitted scientists\nmay land", true)] },
  { type: "end", dur: 3.0 },
];
let t = 0;
const shots = list.map(({ type, dur, ...rest }) => { const o = { type, from: +t.toFixed(2), dur, ...rest }; t += dur; return o; });
const data = {
  fps: 30, bpm: 60, no: "NO ENTRY ③", series: { n: 3, total: 5 }, bgm: "bgm/snake.wav", lang: "en", accent: "#E8C547", transition: "blinds",
  endBg: "radial-gradient(ellipse at 50% 40%, #1F2A08 0%, #050701 75%)",
  thumb: { image: SNAKE, focus: [0.58, 0.5], zoom: 1.6, big: "4,000", unit: "", ko: "독사가 최대 4천 마리\n왜 막았을까?", en: "vipers on one island.\nWhy the ban?", tag: "Photo: Otavio A. Marques (CC BY 4.0)" },
  end: {
    ko: "5곳의 진짜 이유, 하나씩\n구독하면 이어서 보여요", en: "5 places you can't go.\nOne real reason each.\nSubscribe for the next.",
    askKo: "이렇게 위험한 뱀도\n지켜야 할까?", askEn: "Should we protect\na snake this deadly?",
    next: { image: "wikimedia-bfdc74ff.jpg", ko: "④ 라스코 동굴", en: "④ Lascaux Cave" },
  },
  shots,
};
writeFileSync(new URL("./shots.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log("total", t.toFixed(2), "s,", shots.length, "shots");
