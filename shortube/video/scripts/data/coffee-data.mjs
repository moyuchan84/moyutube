// 커피 종류별 열량 · 당류(식약처 음식 DB) → 355ml(톨) 환산 → src/coffee/data.json
// 원자료: ../data/food/food.json (공공데이터포털 15100070, 업체 제품 제외). 100g 기준 표본은 1g≈1ml 로 본다(어림).
// 사용: node scripts/data/coffee-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const ML = 355;
const CUBE = 3; // 각설탕 1개 3g 로 환산
const all = JSON.parse(readFileSync(new URL("../../../data/food/food.json", import.meta.url), "utf8")).filter((x) => x.REST_NM === "해당없음");
const med = (a) => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const DRINKS = [
  { k: "아메리카노", nm: "커피_아메리카노" },
  { k: "카푸치노", nm: "커피_카푸치노" },
  { k: "카페라떼", nm: "커피_카페라떼" },
  { k: "카라멜마키아토", nm: "커피_카라멜마끼아토" },
  { k: "카페모카", nm: "커피_카페모카" },
];
const rows = DRINKS.map(({ k, nm }) => {
  const r = all.filter((x) => x.FOOD_NM === nm);
  const kc100 = med(r.map((x) => +x.ENERC));
  const su100 = med(r.map((x) => +x.SUGAR));
  const kcal = Math.round((kc100 * ML) / 100);
  const sugar = Math.round(((su100 * ML) / 100) * 10) / 10;
  return { k, n: r.length, kc100, su100, kcal, sugar, cubes: Math.round((sugar / CUBE) * 10) / 10, codes: r.map((x) => x.FOOD_CD) };
});
const out = { ml: ML, cube: CUBE, rows, caffeine: { americano: 125, americanoRange: [75, 202], coldbrew: 212, coldbrewRange: [116, 404], perMl: [0.44, 0.89], limit: 400 }, steep: { from: 8, to: 24, plateauMin: 400 } };
writeFileSync(new URL("../../../content/coffee/script/data.json", import.meta.url), JSON.stringify(out, null, 1));
for (const r of rows) console.log(r.k.padEnd(8), `n=${r.n}`, `100ml ${r.kc100}kcal 당${r.su100}g`, `→ ${ML}ml ${r.kcal}kcal 당${r.sugar}g 각설탕${r.cubes}개`);
