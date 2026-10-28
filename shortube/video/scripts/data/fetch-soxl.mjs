// Yahoo SOXL · ^SOX 일봉 (최근 2개월) → data/prices/soxl.csv · sox.csv (3배 레버리지 영상용)
// 사용: node scripts/data/fetch-soxl.mjs  (video 폴더에서)
import { writeFileSync } from "node:fs";

for (const [sym, file] of [["SOXL", "soxl"], ["%5ESOX", "sox"]]) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=3mo&interval=1d`;
  const j = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).json();
  const r = j.chart.result[0];
  const q = r.indicators.quote[0];
  const rows = [];
  r.timestamp.forEach((t, i) => {
    const d = new Date((t - 5 * 3600) * 1000).toISOString().slice(0, 10); // 미국 동부 날짜
    if (q.close[i] == null) return;
    rows.push([d, q.open[i].toFixed(2), q.high[i].toFixed(2), q.low[i].toFixed(2), q.close[i].toFixed(2), q.volume[i]].join(","));
  });
  writeFileSync(new URL(`../../../data/prices/${file}.csv`, import.meta.url), "date,open,high,low,close,volume\n" + rows.join("\n") + "\n");
  console.log(file, rows.length, rows[0].split(",")[0], "~", rows.at(-1).split(",")[0]);
}
