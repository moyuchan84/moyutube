// area51 shots.json 생성 — 길이만 적으면 시작 시각(from)을 자동으로 계산한다.
//   node extremes/content/area51/script/build-shots.mjs  (저장소 루트에서)
// 구조: 훅(58년) → 오해(외계인) → 진짜 이유(U-2) → 증거(고도 · CIA 문서) → 반전(공군은 알았다) → 정체 → 2013 → 끝(다음 ③ 미리보기)
import { writeFileSync } from "node:fs";
const T = (at, to, ko, en, big) => ({ at, to, ko, en, ...(big ? { big: true } : {}) });
const CAM = "wikimedia-25b75ed7.jpg";
const MAP = "wikimedia-area51-portrait.jpg";
const U2 = "wikimedia-u2-goldengate.jpg";
const MAP_CREDIT = "CIA map, approved for release 2013 (public domain)";
const U2_CREDIT = "Photo: U-2 today, U.S. Air Force (CC0)";
const list = [
  // 훅
  { type: "photo", dur: 2.6, image: CAM, zoom: [2.0, 2.4], focus: [0.47, 0.16], credit: "Photo: camera on Groom Lake Road, Geckow (public domain)",
    hits: [{ at: 0.05, kind: "glitch" }, { at: 1.4, kind: "shake" }],
    texts: [T(0.2, 1.35, "정부가 58년 동안\n인정하지 않은 기지", "The base the U.S.\nwouldn't admit\nfor 58 years", true), T(1.4, 2.55, "거기서 뭘 했길래?", "What were\nthey hiding?", true)] },
  // 오해
  { type: "photo", dur: 2.4, video: "pixabay-f5bdf2ee.mp4", rate: 0.8, illustrative: true, zoom: [1.1, 1.2], tint: 0.05,
    ufo: { at: 0.15, from: [120, 420], to: [930, 640], dur: 2.1 },
    texts: [T(0.1, 2.35, "외계인과 UFO를\n숨겨서?", "Aliens?\nUFOs?", true)] },
  { type: "card", dur: 1.8, bg: "radial-gradient(ellipse at 50% 45%, #0B1A2E 0%, #02060F 75%)", stamp: { text: "기밀", at: 0.1 },
    hits: [{ at: 0.1, kind: "glitch" }],
    texts: [T(0.6, 1.75, "진짜 비밀은\n따로 있었다", "The real secret\nwas something else", true)] },
  // 진짜 이유
  { type: "photo", dur: 2.0, image: MAP, zoom: [1.5, 1.9], focus: [0.72, 0.24], credit: MAP_CREDIT,
    texts: [T(0.1, 1.95, "1955년 CIA가 고른\n네바다 사막", "1955: the CIA\npicked this desert")] },
  { type: "photo", dur: 2.4, image: U2, zoom: [1.15, 1.3], focus: [0.55, 0.58], credit: U2_CREDIT,
    texts: [T(0.1, 2.35, "소련을 몰래 찍을 정찰기\nU-2의 시험장", "A test site for\nthe U-2 spy plane", true)] },
  // 증거 1: 고도
  { type: "card", dur: 4.4, bg: "linear-gradient(180deg, #0B2A4A 0%, #02060F 100%)",
    bars: [
      { label: "1950s airliners", text: "3~6 km", value: 6.1, max: 20, at: 0.3, color: "#8FA3BF" },
      { label: "U-2", text: "18 km+", value: 18.3, max: 20, at: 0.9, color: "#FF3B4E" },
    ],
    texts: [T(2.2, 4.35, "아무도 없던 높이에\n햇빛에 번쩍이는 은색 기체", "A silver jet\nglinting in the sun,\nhigher than anything")] },
  // 증거 2: CIA 문서
  { type: "photo", dur: 3.6, image: "wikimedia-er2-flight.jpg", zoom: [1.0, 1.12], focus: [0.42, 0.55], credit: "Photo: NASA ER-2, a U-2 variant (public domain)",
    counter: { to: 50, unit: "%+", start: 1.65, dur: 1.2 },
    texts: [T(0.1, 1.6, "CIA 문서에 적힌 내용", "What a CIA\nhistory says", true), T(1.65, 3.55, "그 시절 UFO 신고의\n절반 이상이 이 비행기", "Over half of UFO\nreports back then:\nthese flights")] },
  // 반전
  { type: "photo", dur: 3.6, video: "pixabay-dd93cd0a.mp4", rate: 0.6, illustrative: true, zoom: [1.2, 1.35], focus: [0.6, 0.5], tint: 0.15,
    hits: [{ at: 1.75, kind: "red" }],
    texts: [T(0.1, 1.7, "공군은 정체를\n알고 있었다", "The Air Force\nknew", true), T(1.75, 3.55, "하지만 국가 기밀이라\n밝히지 않았다", "But it was secret,\nso they said nothing")] },
  { type: "photo", dur: 2.6, image: U2, zoom: [1.6, 1.85], focus: [0.6, 0.6], credit: U2_CREDIT,
    hits: [{ at: 0.0, kind: "flash" }, { at: 0.0, kind: "shake" }],
    texts: [T(0.15, 2.55, "UFO의 정체는\n우리 비행기였다", "The UFOs\nwere ours", true)] },
  // 2013
  { type: "photo", dur: 3.0, image: MAP, zoom: [1.7, 1.85], focus: [0.42, 0.03], panY: [14, 14], credit: MAP_CREDIT,
    texts: [T(0.1, 1.5, "2013년 기밀 해제 문서로\n처음 공식 인정", "First officially\nadmitted in 2013"), T(1.55, 2.95, "그리고 지금도\n출입 금지", "And it's still\noff-limits", true)] },
  { type: "end", dur: 3.2 },
];
let t = 0;
const shots = list.map(({ type, dur, ...rest }) => { const o = { type, from: +t.toFixed(2), dur, ...rest }; t += dur; return o; });
const data = {
  fps: 30, bpm: 60, no: "NO ENTRY ②", series: { n: 2, total: 5 }, bgm: "bgm/area51.wav", lang: "en", accent: "#FF3B4E", transition: "glitch",
  endBg: "radial-gradient(ellipse at 50% 40%, #0B1A2E 0%, #02060F 75%)",
  thumb: { image: U2, focus: [0.6, 0.6], zoom: 1.4, big: "UFO?", unit: "", ko: "목격담의\n진짜 정체", en: "What people\nreally saw", tag: "Photo: U.S. Air Force (CC0)" },
  end: {
    ko: "5곳의 진짜 이유, 하나씩\n구독하면 이어서 보여요", en: "5 places you can't go.\nOne real reason each.\nSubscribe for the next.",
    askKo: "당신이 본 UFO,\n혹시 비행기였을까?", askEn: "That UFO you saw…\nwas it a plane?",
    next: { image: "wikimedia-46882c63.jpg", ko: "③ 뱀섬", en: "③ Snake Island" },
  },
  shots,
};
writeFileSync(new URL("./shots.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log("total", t.toFixed(2), "s,", shots.length, "shots");
