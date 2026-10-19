// data/prices/soxl.csv · sox.csv → src/soxl/result.json (3배 레버리지 쇼츠용 계산). 기준: 2026.10.05 종가 ~ 10.16 종가 (10.19 은 장중이라 제외)
// 사용: node scripts/soxl-data.mjs  (video 폴더에서)
import { readFileSync, writeFileSync } from "node:fs";

const load = (f) => Object.fromEntries(readFileSync(new URL(`../../data/prices/${f}.csv`, import.meta.url), "utf8").trim().split("\n").slice(1).map((l) => { const c = l.split(","); return [c[0], +c[4]]; }));
const sox = load("sox"), soxl = load("soxl");
const START = "2026-10-05", END = "2026-10-16";
const days = Object.keys(soxl).filter((d) => d >= START && d <= END).sort();
const rows = days.map((d, i) => ({
  date: d, sox: sox[d], soxl: soxl[d],
  soxPct: i ? sox[d] / sox[days[i - 1]] - 1 : 0,
  soxlPct: i ? soxl[d] / soxl[days[i - 1]] - 1 : 0,
  soxIdx: (sox[d] / sox[START]) * 100, soxlIdx: (soxl[d] / soxl[START]) * 100,
}));
const last = rows.at(-1);
const out = {
  asOf: END, start: START, n: rows.length - 1, rows,
  soxTotal: last.sox / sox[START] - 1, soxlTotal: last.soxl / soxl[START] - 1,
  soxNeed: sox[START] / last.sox - 1, soxlNeed: soxl[START] / last.soxl - 1,
  d14: rows.find((r) => r.date === "2026-10-14"),
};
out.multiple = out.soxlTotal / out.soxTotal;
out.d14.multiple = out.d14.soxlPct / out.d14.soxPct;
out.sameSign = rows.slice(1).filter((r) => Math.sign(r.soxPct) === Math.sign(r.soxlPct)).length;
writeFileSync(new URL("../src/soxl/result.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(rows.map((r) => `${r.date} sox ${(r.soxPct * 100).toFixed(2)}% soxl ${(r.soxlPct * 100).toFixed(2)}% x${(r.soxlPct / r.soxPct).toFixed(2)}`).join("\n"));
console.log("sox", (out.soxTotal * 100).toFixed(2), "soxl", (out.soxlTotal * 100).toFixed(2), "x", out.multiple.toFixed(2), "need", (out.soxNeed * 100).toFixed(1), (out.soxlNeed * 100).toFixed(1), "n", out.n, "sameSign", out.sameSign);
