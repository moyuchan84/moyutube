// 2026-10-23 "시차 릴레이" 쇼츠용 시세: Yahoo chart API 에서
// 코스피 5분봉(오늘 장중 흐름) + 코스피·코스닥·삼성전자·SK하이닉스 일봉 + 미국 지수 일봉을 받아 src/relay/market.json 으로.
// 장 마감(15:30) 뒤에 돌린다. 0 거래량·빈 봉은 버린다 (CLAUDE.md 1장 "깨진 봉" 검사).
// 사용: node scripts/fetch-relay.mjs
import { writeFileSync } from "node:fs";

const UA = { "User-Agent": "Mozilla/5.0 (shortube research; contact via channel)" };
const get = async (sym, interval, range) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=${interval}&range=${range}`;
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${sym} ${r.status}`);
  const res = (await r.json()).chart.result[0];
  const q = res.indicators.quote[0];
  const rows = res.timestamp
    .map((t, i) => ({ t, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume[i] }))
    .filter((b) => b.c != null && b.o != null);
  return { meta: res.meta, rows };
};
const kst = (t) => new Date((t + 9 * 3600) * 1000).toISOString().slice(0, 16).replace("T", " ");
const r2 = (x) => Math.round(x * 100) / 100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const out = { fetched_at: kst(Math.floor(Date.now() / 1000)), daily: {}, intraday: null };

const intra = await get("^KS11", "5m", "1d");
const bars = intra.rows.filter((b) => b.h >= b.l);
out.intraday = {
  prevClose: intra.meta.chartPreviousClose,
  bars: bars.map((b) => ({ k: kst(b.t).slice(11), c: r2(b.c), h: r2(b.h), l: r2(b.l) })),
};

for (const sym of ["^KS11", "^KQ11", "005930.KS", "000660.KS", "^IXIC", "^GSPC", "^DJI", "^SOX", "META", "NVDA", "TSLA"]) {
  await sleep(2000);
  const d = await get(sym, "1d", "10d");
  // 지수는 거래량이 0 으로 오는 날이 있어 종목만 거래량 검사
  const ok = d.rows.filter((b) => (sym.startsWith("^") ? true : b.v > 0));
  out.daily[sym] = ok.slice(-4).map((b) => ({ d: kst(b.t).slice(0, 10), o: r2(b.o), h: r2(b.h), l: r2(b.l), c: r2(b.c) }));
}

writeFileSync(new URL("../src/relay/market.json", import.meta.url), JSON.stringify(out, null, 1));
const last = out.intraday.bars.at(-1);
console.log(`fetched ${out.fetched_at} KST · 5분봉 ${out.intraday.bars.length}개 · 마지막 ${last.k} ${last.c}`);
for (const [s, rows] of Object.entries(out.daily)) {
  const [a, b] = rows.slice(-2);
  console.log(s.padEnd(10), rows.map((r) => `${r.d} ${r.c}`).join(" | "), `→ ${(((b.c / a.c) - 1) * 100).toFixed(2)}%`);
}
