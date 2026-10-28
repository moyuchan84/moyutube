// 음식 1인분 열량(식약처 음식 DB) → 걷기 · 달리기 시간(2024 Adult Compendium MET) 계산 → src/burn/data.json
// 원자료: ../data/food/food.json (공공데이터포털 15100070 전국통합식품영양성분정보(음식)표준데이터, 업체 제품 제외)
// 계산: 소모 kcal = MET × 체중(kg) × 시간(h) — 가만히 있어도 쓰는 1 MET 포함한 어림값.
// 사용: node scripts/data/burn-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const KG = 70;
const WALK = { met: 3.8, code: "17190", kmh: 5 }; // 2.8~3.4 mph(약 4.5~5.5km/h) 보통 속도
const RUN = { met: 8.5, code: "12030", kmh: 8 }; // 5.0~5.2 mph(약 8km/h)

const all = JSON.parse(readFileSync(new URL("../../../data/food/food.json", import.meta.url), "utf8")).filter((x) => x.REST_NM === "해당없음");
const kcal = (x) => (+x.ENERC * parseFloat(x.FOOD_SIZE)) / 100;
const med = (a) => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const FOODS = [
  { k: "아메리카노 한 잔", f: (x) => x.FOOD_NM === "커피_아메리카노" && x.FOOD_SIZE === "355ml", note: "355ml" },
  { k: "카페라떼 한 잔", f: (x) => x.FOOD_NM === "커피_카페라떼" && x.FOOD_SIZE === "355ml", note: "355ml" },
  { k: "링도넛 1개", f: (x) => x.FOOD_NM === "도넛_링도넛" && x.FOOD_ORIGIN_NM.startsWith("외식") },
  { k: "떡볶이 1인분", f: (x) => x.FOOD_NM === "떡볶이" && x.FOOD_ORIGIN_NM.startsWith("가정식"), note: "180g" },
  { k: "치즈버거 1개", f: (x) => x.FOOD_NM === "햄버거_치즈" && x.FOOD_SIZE !== "100g" },
  { k: "짜장면 1그릇", f: (x) => x.FOOD_NM === "짜장면" && x.FOOD_ORIGIN_NM.startsWith("외식"), note: "600ml" },
  { k: "삼겹살 200g", f: (x) => x.FOOD_NM === "삼겹살구이" },
  { k: "후라이드치킨 1마리", f: (x) => x.FOOD_NM === "닭튀김_간편조리세트_후라이드치킨" },
];

const perMin = (met) => (met * KG) / 60;
const rows = FOODS.map(({ k, f, note }) => {
  const r = all.filter(f);
  const v = r.map(kcal);
  const kc = Math.round(med(v));
  return {
    k, note: note ?? null, n: r.length, kcal: kc, min: Math.round(Math.min(...v)), max: Math.round(Math.max(...v)),
    codes: r.map((x) => x.FOOD_CD), crtr: r[0].CRTR_YMD,
    walkMin: Math.round(kc / perMin(WALK.met)), runMin: Math.round(kc / perMin(RUN.met)),
  };
});
const marathonMin = Math.round((42.195 / RUN.kmh) * 60);
const marathonKcal = Math.round(RUN.met * KG * (marathonMin / 60));
const out = { kg: KG, walk: { ...WALK, perHour: Math.round(WALK.met * KG) }, run: { ...RUN, perHour: Math.round(RUN.met * KG) }, rows, marathon: { min: marathonMin, kcal: marathonKcal } };
writeFileSync(new URL("../../../content/burn/script/data.json", import.meta.url), JSON.stringify(out, null, 1));
const hm = (m) => `${Math.floor(m / 60)}시간 ${m % 60}분`;
for (const r of rows) console.log(r.k.padEnd(12), r.kcal, "kcal", `(n=${r.n}, ${r.min}~${r.max})`, "걷기", hm(r.walkMin), "달리기", hm(r.runMin), "| 걷기거리", (r.walkMin / 60 * WALK.kmh).toFixed(1), "km 달리기거리", (r.runMin / 60 * RUN.kmh).toFixed(1), "km");
console.log("마라톤 8km/h:", hm(marathonMin), marathonKcal, "kcal = 치킨", (marathonKcal / rows.at(-1).kcal).toFixed(2), "마리");
