// shots.json 의 scenes 를 v2 설계로 다시 만든다. node script/build-scenes.mjs  (편 폴더에서)
// 클립 약식: "파일#fx,fy,z0,z1,w"  — 같은 그림도 와이드 → 디테일 크롭으로 컷이 달라 보인다.
// "A|B" 는 A 파일이 있으면 A, 없으면 B (새 그림 · Flow 영상이 오기 전 초안용).
import fs from "node:fs";
import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const dir = path.resolve(here, "..");
const art = fs.readdirSync(path.join(dir, "art"));
const d = JSON.parse(fs.readFileSync(path.join(dir, "script", "shots.json"), "utf8"));

const has = (c) => art.includes((typeof c === "string" ? c : c.f).split("#")[0]);
const pick = (spec) => {
  if (typeof spec !== "string") return has(spec) ? spec : null;
  for (const alt of spec.split("|")) if (has(alt)) return alt;
  return null;
};
const S = (id, type, lines, extra = {}) => ({ id, type, lines, ...extra });
const P = (id, lines, clips, extra = {}) => S(id, "photo", lines, { exact: true, clips, tint: 0.15, ...extra });

const spec = [
  // 1 콜드 오픈 — 2004 문자 3억 건
  P("hook", ["L1", "L2", "L3"], [
    "flow-school-texts.mp4|gemini-text-chain.png#0.3,0.5,1.0,1.2",
    "gemini-phone-glow-night.png#0.5,0.38,1.12,1.3",
    "gemini-text-chain.png#0.3,0.5,1.0,1.2",
    "gemini-phone-glow-night.png#0.3,0.75,1.3,1.45",
    "gemini-text-chain.png#0.78,0.4,1.25,1.42",
  ], {
    tint: -0.15,
    facts: [
      { big: "2004", sub: "South Korea · 수능 날", at: 0.02 },
      { big: "300,000,000", sub: "text messages, one day · 하루치 문자 약 3억 건", at: 0.5 },
    ],
  }),
  // 2 다리
  P("bridge", ["L4"], ["flow-hook-split.mp4|gemini-hook-split.png", "flow-fog-compound.mp4|gemini-compound-gate.png|pixabay-82166b0a.jpg"], { tint: 0.1 }),
  // 3 과거제
  P("keju", ["L5"], [
    "flow-cells-aerial.mp4",
    "gemini-search-gate.png#0.5,0.5,1.0,1.12",
    "flow-cell-candle.mp4|gemini-search-gate.png#0.75,0.4,1.3,1.45",
    "gemini-cells-aerial.png#0.5,0.5,1.3,1.5",
  ], { tint: 0.1 }),
  P("erase", ["L6"], ["gemini-sealed-names.png#0.5,0.5,1.0,1.12", "gemini-sealed-names.png#0.35,0.3,1.4,1.6"], {
    big: { text: "NAME → NUMBER", sub: "이름을 지우고 번호로", size: 120 },
  }),
  P("recopy", ["L7"], [
    "gemini-handwriting-pair.png|gemini-red-copy.png#0.3,0.5,1.0,1.15",
    "flow-red-copy.mp4",
    "gemini-red-copy.png#0.5,0.5,1.0,1.18",
  ], { big: { text: "RED COPY", sub: "붉은 사본 — 채점관은 이것만", size: 120 } }),
  P("y1858", ["L8"], [
    "gemini-compound-gate.png#0.5,0.55,1.0,1.15",
    { f: "pixabay-82166b0a.jpg", ill: true },
    "gemini-compound-gate.png#0.72,0.5,1.4,1.6",
  ], { tint: 0.2, big: { text: "1858", sub: "수석 시험관 처형", size: 190 } }),
  // 4 조선
  P("joseon", ["L9", "L10"], [
    "kogl-hamhung-gwageo.jpg#0.5,0.5,1.0,1.12,1",
    "gemini-candidate-team.png|gemini-joseon-clerks.png#0.3,0.5,1.0,1.15",
    "gemini-joseon-clerks.png#0.5,0.5,1.0,1.12",
    "kogl-hamhung-gwageo.jpg#0.28,0.35,1.5,1.7,0.8",
  ], { credit: "Painting & answer sheet: National Museum of Korea · KOGL Type 1", tint: 0.15 }),
  P("joseon2", ["L11"], [
    "kogl-shimsanggi-answer.jpg#0.5,0.5,1.0,1.1",
    "gemini-sealed-names.png#0.75,0.6,1.3,1.5",
    "kogl-shimsanggi-answer.jpg#0.5,0.3,1.4,1.6",
  ], { credit: "Answer sheet: National Museum of Korea · KOGL Type 1" }),
  // 5 2011 SAT
  P("sat", ["L12", "L13", "L14"], [
    "gemini-suburb-dawn.png|gemini-modern-desk.png#0.2,0.5,1.0,1.15",
    "gemini-modern-desk.png#0.5,0.5,1.0,1.12",
    "gemini-gradebook.png|gemini-modern-desk.png#0.8,0.5,1.3,1.5",
    "gemini-gradebook.png#0.35,0.45,1.3,1.5",
    "gemini-admission-ticket.png#0.5,0.5,1.0,1.12",
    "gemini-admission-ticket.png#0.45,0.4,1.4,1.6",
  ], {
    tint: 0.25,
    facts: [
      { big: "7", sub: "arrests · 체포 · 2011", at: 0.1 },
      { big: "20", sub: "charged within months · 몇 달 만에 기소", at: 0.62 },
      { big: "PHOTO", sub: "now required at registration (reported) · 사진 등록", at: 0.82 },
    ],
  }),
  // 6 어른들 — 애틀랜타 · 하버드
  P("atlanta", ["L15"], [
    "gemini-trophy-hall.png|gemini-answer-sheet-erase.png#0.3,0.5,1.0,1.1",
    "gemini-answer-sheet-erase.png#0.5,0.5,1.0,1.12",
    "gemini-trophy-hall.png#0.7,0.5,1.35,1.5",
    "gemini-answer-sheet-erase.png#0.3,0.35,1.4,1.6",
  ], {
    tint: 0.28,
    facts: [
      { big: "44 / 56", sub: "schools with cheating found · 부정 확인 학교 · 2011", at: 0.22 },
      { big: "178", sub: "educators named by investigators · 지목된 교육자", at: 0.5 },
      { big: "11", sub: "convicted · 유죄 · 2015", at: 0.8 },
    ],
  }),
  P("harvard", ["L16"], [
    "gemini-takehome-laptop.png#0.5,0.5,1.0,1.1",
    "gemini-twin-sheets.png|gemini-takehome-laptop.png#0.3,0.4,1.4,1.55",
    "gemini-twin-sheets.png#0.5,0.5,1.0,1.12",
    "gemini-takehome-laptop.png#0.7,0.45,1.4,1.55",
  ], {
    tint: 0.28,
    facts: [
      { big: "279", sub: "students in the class · 수강생 · 2012", at: 0.1 },
      { big: "~125", sub: "cases investigated · 조사된 사건", at: 0.45 },
      { big: "~70", sub: "forced to withdraw · 휴학 처분", at: 0.78 },
    ],
  }),
  // 7 AI 시대
  P("ai", ["L17", "L18"], [
    "gemini-phone-paused.png#0.5,0.5,1.0,1.12,0.8",
    "flow-gate-fog.mp4#0.5,0.5,1.22,1.32|gemini-gate-scanner.png#0.3,0.5,1.0,1.12",
    "gemini-gate-scanner.png#0.6,0.5,1.0,1.15",
    "gemini-phone-paused.png#0.55,0.45,1.4,1.6",
  ], {
    tint: 0.22,
    facts: [
      { big: "13.4M", sub: "candidates · gaokao 2025 · 응시자", at: 0.25 },
      { big: "PAUSED", sub: "photo recognition during exam hours · 사진 인식 중단", at: 0.72 },
    ],
  }),
  P("suneung", ["L19"], [
    "gemini-glasses-tray.png#0.5,0.5,1.0,1.1",
    "gemini-glasses-tray.png#0.3,0.4,1.45,1.6",
    "gemini-glasses-tray.png#0.75,0.6,1.45,1.6",
  ], { big: { text: "NO DEVICES", sub: "수능 기기 반입 금지", size: 150 } }),
  // 8 답
  P("back", ["L20"], [
    "gemini-carrier-records.png|gemini-text-chain.png#0.2,0.5,1.2,1.3",
    "gemini-carrier-records.png#0.7,0.5,1.4,1.55",
  ], { tint: 0.2, big: { text: "300,000,000 ?", sub: "문자 3억 건 속에서", size: 130 } }),
  S("funnel", "funnel", ["L21", "L22"], {
    steps: [
      { n: "~300,000,000", l: "text messages that day · 시험 당일 문자", c: "#8EA3B8" },
      { n: "~280,000", l: "digits 1–5 only · 1~5 숫자로만 된 문자", c: "#F2B84B" },
      { n: "182", l: "test-takers indicted · 기소된 응시자", c: "#E8613C" },
    ],
  }),
  P("trail", ["L23"], ["flow-hourglass.mp4|gemini-outro-hourglass.png"], { tint: 0.3, big: { text: "EVERY TRICK\nLEAVES A TRAIL", sub: "모든 속임수는 흔적을 남긴다", size: 110 } }),
  S("end", "end", ["L24"], {
    endBg: "radial-gradient(ellipse at 50% 40%, #2A1A0E 0%, #0A0807 75%)",
    askEn: "How would you design\nan exam that can't be beaten?",
    askKo: "속일 수 없는 시험, 어떻게 설계할까요?",
    sub: { en: "Subscribe for more real stories", ko: "실제 이야기가 더 궁금하다면 구독" },
  }),
];

let dropped = 0;
d.scenes = spec.map((sc) => {
  if (!sc.clips) return sc;
  const clips = sc.clips.map(pick).filter(Boolean);
  dropped += sc.clips.length - clips.length;
  if (!clips.length) throw new Error(`${sc.id}: 쓸 수 있는 클립이 없다`);
  return { ...sc, clips };
});
// big.text 의 줄바꿈 허용
fs.writeFileSync(path.join(dir, "script", "shots.json"), JSON.stringify(d, null, 2));
console.log(`scenes ${d.scenes.length}, clips ${d.scenes.reduce((a, s) => a + (s.clips?.length ?? 0), 0)} (자산 없어 뺀 것 ${dropped})`);
