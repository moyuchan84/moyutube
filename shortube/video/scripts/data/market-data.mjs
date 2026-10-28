// 일봉 CSV(../data/prices/*.csv) → 영상용 src/market/kospi.json
// 마지막 N봉의 OHLC + 20·60·200일선 + 볼린저 하단 + RSI14 (stockstealer 규칙과 같은 계산).
// 사용: node scripts/data/market-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const N = 110;
const load = (name) =>
  readFileSync(new URL(`../../../data/prices/${name}.csv`, import.meta.url), "utf8")
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split(","))
    .map(([d, o, h, lo, c]) => ({ d, o: +o, h: +h, l: +lo, c: +c }));

const sma = (c, n, end) => (end < n ? null : c.slice(end - n, end).reduce((s, x) => s + x, 0) / n);
const rsi14 = (c) => {
  const n = 14;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = c[i] - c[i - 1]; d > 0 ? (g += d) : (l -= d); }
  g /= n; l /= n;
  const out = new Array(c.length).fill(null);
  out[n] = 100 - 100 / (1 + g / l);
  for (let i = n + 1; i < c.length; i++) {
    const d = c[i] - c[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n;
    l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = 100 - 100 / (1 + g / l);
  }
  return out;
};

const b = load("kospi");
const c = b.map((x) => x.c);
const r = rsi14(c);
const bars = b.slice(-N).map((x, k) => {
  const i = b.length - N + k;
  const m20 = sma(c, 20, i + 1);
  const sd = Math.sqrt(c.slice(i - 19, i + 1).reduce((s, v) => s + (v - m20) ** 2, 0) / 20);
  const r2 = (v) => (v == null ? null : Math.round(v * 100) / 100);
  return { ...x, s20: r2(m20), s60: r2(sma(c, 60, i + 1)), s200: r2(sma(c, 200, i + 1)), bbLo: r2(m20 - 2 * sd), rsi: r2(r[i]) };
});
writeFileSync(new URL("../../../content/market/script/kospi.json", import.meta.url), JSON.stringify(bars));
const last = bars[bars.length - 1];
console.log(`src/market/kospi.json: ${bars.length}봉 ${bars[0].d}~${last.d}, 종가 ${last.c}, 200일선 ${last.s200}, RSI ${last.rsi}`);
