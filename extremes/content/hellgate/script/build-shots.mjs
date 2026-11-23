// hellgate shots.json 생성 — 길이만 적으면 시작 시각(from)을 자동으로 계산한다.
//   node extremes/content/hellgate/script/build-shots.mjs  (저장소 루트에서)
// UNEXPLAINED ① 지옥의 문 (다르바자 가스 분화구)
// 구조: 훅(낮엔 구멍 → 밤엔 불) → 크기 → 별명 → 흔한 이야기(1971) → 반전(기록 없음) → 미스터리 → 왜 타나 → 2022 · 2025 → 닫히는 문 → 끝(② 해골 호수)
import { writeFileSync } from "node:fs";
const T = (at, to, ko, en, big) => ({ at, to, ko, en, ...(big ? { big: true } : {}) });
const DAY = "wikimedia-9b2b2566.jpg";
const EDGE = "wikimedia-02b5b67a.jpg";
const FLAME = "wikimedia-6b97531b.jpg";
const RIM = "wikimedia-4f949497.jpg";
const PAIR = "wikimedia-55455c5d.jpg";
const DAWN = "wikimedia-d842375b.jpg";
const CR = "Photo: Darvaza gas crater, John Pavelka (CC BY 2.0)";
const list = [
  // 훅: 낮
  { type: "photo", dur: 2.2, image: DAY, zoom: [1.7, 2.0], focus: [0.48, 0.52], tint: 0.1, credit: CR,
    texts: [T(0.15, 2.15, "사막 한가운데\n뚫린 구멍", "A hole in the\nmiddle of a desert", true)] },
  { type: "black", dur: 0.4 },
  // 밤
  { type: "photo", dur: 2.6, image: RIM, zoom: [1.05, 1.2], focus: [0.57, 0.4], tint: 0.35, credit: CR,
    hits: [{ at: 0.0, kind: "flash" }, { at: 1.05, kind: "shake" }],
    texts: [T(0.1, 1.0, "밤이 되면…", "At night…", true), T(1.05, 2.55, "수십 년째\n꺼지지 않는 불", "It has been\nburning for\ndecades", true)] },
  // 크기
  { type: "photo", dur: 3.0, image: PAIR, zoom: [1.3, 1.45], focus: [0.57, 0.66], credit: CR,
    counter: { to: 70, unit: " m wide", start: 0.1, dur: 1.0 },
    texts: [T(1.2, 2.95, "깊이 약 30 m", "About 30 m deep")] },
  // 별명
  { type: "card", dur: 2.4, bg: "radial-gradient(ellipse at 50% 60%, #3A1404 0%, #0A0201 75%)",
    hits: [{ at: 0.1, kind: "red" }],
    texts: [T(0.3, 2.35, "사람들은 이곳을\n'지옥의 문'이라 부른다", "People call it\n\"The Door to Hell\"", true)] },
  // 흔한 이야기
  { type: "photo", dur: 3.6, video: "pixabay-721daa9c.mp4", rate: 0.6, illustrative: true, zoom: [1.15, 1.3], tint: 0.3,
    texts: [T(0.1, 1.8, "흔한 이야기: 1971년\n소련 시추 중 땅이 꺼졌다", "The story:\n1971, a Soviet drill\nhits a gas cave"), T(1.85, 3.55, "가스를 태워 없애려 불을 붙였다\n곧 꺼질 줄 알고", "They lit it,\nexpecting it to\nburn out fast")] },
  // 반전
  { type: "card", dur: 3.2, bg: "radial-gradient(ellipse at 50% 45%, #2A0A02 0%, #050101 75%)", stamp: { text: "1971?", at: 0.1 },
    hits: [{ at: 0.1, kind: "glitch" }],
    texts: [T(0.55, 1.9, "그런데 이 이야기엔\n공식 기록이 없다", "But there's\nno official record", true), T(1.95, 3.15, "1960년대에 꺼지고 1980년대에\n불 붙었다는 주장도 있다", "Some say: collapsed\nin the '60s,\nlit in the '80s")] },
  { type: "photo", dur: 2.8, image: EDGE, zoom: [1.3, 1.45], focus: [0.33, 0.6], tint: 0.15, credit: CR,
    hits: [{ at: 0.0, kind: "shake" }],
    texts: [T(0.1, 2.75, "누가, 언제 붙였는지\n아직 확실히 모른다", "Who lit it? When?\nNo one knows\nfor sure.", true)] },
  // 왜 계속 타나
  { type: "photo", dur: 3.0, image: DAWN, zoom: [1.6, 1.75], focus: [0.6, 0.86], credit: CR,
    texts: [T(0.1, 2.95, "땅속 가스가\n계속 새어 올라와 탄다", "Gas keeps seeping\nup from below,\nfeeding the fire")] },
  // 2022 · 2025
  { type: "card", dur: 3.6, bg: "linear-gradient(180deg, #2A1206 0%, #070201 100%)",
    bars: [
      { label: "Before", text: "100%", value: 3, max: 3.3, at: 1.9, color: "#FF6A1A" },
      { label: "2025", text: "≈ 1/3", value: 1, max: 3.3, at: 2.3, color: "#8FA3BF" },
    ],
    texts: [T(0.1, 1.8, "2022년\n'불을 끄라'는 명령", "2022: an order\nto put it out", true), T(1.85, 3.55, "2025년 공식 발표\n불길이 약 3분의 1로", "2025: officials say\nthe fire shrank\nnearly threefold")] },
  // 닫히는 문
  { type: "photo", dur: 3.0, image: FLAME, zoom: [1.6, 1.2], focus: [0.5, 0.55], tint: 0.35, credit: CR,
    hits: [{ at: 0.0, kind: "flash" }],
    texts: [T(0.15, 1.45, "지옥의 문이\n닫히고 있다", "The Door to Hell\nis closing", true), T(1.5, 2.95, "누가 열었는지도\n모른 채로", "And we still don't\nknow who opened it", true)] },
  { type: "end", dur: 3.0 },
];
let t = 0;
const shots = list.map(({ type, dur, ...rest }) => { const o = { type, from: +t.toFixed(2), dur, ...rest }; t += dur; return o; });
const data = {
  fps: 30, bpm: 60, no: "UNEXPLAINED ①", series: { n: 1, total: 5 }, bgm: "bgm/hellgate.wav", lang: "en", accent: "#FF6A1A", transition: "glitch",
  endBg: "radial-gradient(ellipse at 50% 40%, #2A0A02 0%, #050101 75%)",
  thumb: { image: RIM, focus: [0.57, 0.4], zoom: 1.1, big: "WHO?", unit: "", ko: "수십 년째 타는 구멍\n누가 불을 붙였나", en: "Burning for decades.\nWho lit it?", tag: "Photo: John Pavelka (CC BY 2.0)" },
  end: {
    ko: "설명이 안 되는 곳 5곳\n구독하면 이어서 보여요", en: "5 places no one\ncan fully explain.\nSubscribe for the next.",
    askKo: "불을 꺼야 할까,\n그대로 둬야 할까?", askEn: "Put it out,\nor let it burn?",
    next: { image: "wikimedia-940d5cfb.jpg", ko: "② 해골 호수", en: "② Skeleton Lake" },
  },
  shots,
};
writeFileSync(new URL("./shots.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log("total", t.toFixed(2), "s,", shots.length, "shots");
