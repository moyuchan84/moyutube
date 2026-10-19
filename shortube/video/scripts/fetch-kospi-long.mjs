// Yahoo ^KS11 일봉 전체 기간 → data/prices/kospi_long.csv (백테스트용)
// 사용: node scripts/fetch-kospi-long.mjs  (video 폴더에서)
import { writeFileSync } from "node:fs";

const url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?period1=946684800&period2=" +
  Math.floor(Date.now() / 1000) + "&interval=1d&events=history";
const j = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).json();
const r = j.chart.result[0];
const q = r.indicators.quote[0];
const rows = [];
let dropped = 0;
r.timestamp.forEach((t, i) => {
  const d = new Date((t + 9 * 3600) * 1000).toISOString().slice(0, 10);
  const [o, h, l, c, v] = [q.open[i], q.high[i], q.low[i], q.close[i], q.volume[i]];
  if ([o, h, l, c].some((x) => x == null) || !v || (o === h && h === l && l === c)) { dropped++; return; }
  rows.push([d, o.toFixed(2), h.toFixed(2), l.toFixed(2), c.toFixed(2), v].join(","));
});
writeFileSync(new URL("../../data/prices/kospi_long.csv", import.meta.url), "date,open,high,low,close,volume\n" + rows.join("\n") + "\n");
console.log("rows", rows.length, "dropped(깨진 봉)", dropped, "first", rows[0].split(",")[0], "last", rows.at(-1).split(",")[0]);
