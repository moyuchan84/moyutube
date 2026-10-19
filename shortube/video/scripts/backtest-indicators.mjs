// KOSPI 일봉으로 지표 3개(RSI·골든크로스·볼린저 하단) 백테스트 → src/backtest/result.json
// 사용: node scripts/backtest-indicators.mjs   (먼저 fetch-kospi-long.mjs)
// 가정: 신호가 뜬 날 종가에 사서 N거래일 뒤 종가에 판다. 수수료·세금·슬리피지 없음(지수 자체 수익률).
//       전략 비교(규칙 매매)는 왕복 0.2% 비용을 뺀 값과 안 뺀 값을 같이 낸다.
import { readFileSync, writeFileSync } from "node:fs";

// 뉴스 종가로 대조가 끝난 마지막 날까지만 쓴다(10/16 종가는 미확인)
const END = "2026-10-15";
const rows = readFileSync(new URL("../../data/prices/kospi_long.csv", import.meta.url), "utf8")
  .trim().split(/\r?\n/).slice(1).map((l) => l.split(",")).map(([d, o, h, l, c]) => ({ d, c: +c })).filter((r) => r.d <= END);

const sma = (a, n) => a.map((_, i) => (i < n - 1 ? null : a.slice(i - n + 1, i + 1).reduce((s, x) => s + x, 0) / n));
const rsi14 = (c) => {
  const n = 14, out = new Array(c.length).fill(null);
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = c[i] - c[i - 1]; d > 0 ? (g += d) : (l -= d); }
  g /= n; l /= n; out[n] = 100 - 100 / (1 + g / l);
  for (let i = n + 1; i < c.length; i++) {
    const d = c[i] - c[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n; l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = 100 - 100 / (1 + g / l);
  }
  return out;
};

function run(from) {
  const data = rows.filter((r) => r.d >= from);
  // 지표는 전체 이력으로 계산(워밍업), 평가는 from 이후만
  const all = rows, c = all.map((r) => r.c);
  const startIdx = all.findIndex((r) => r.d >= from);
  const s5 = sma(c, 5), s20 = sma(c, 20), rsi = rsi14(c);
  const bbLo = c.map((_, i) => {
    if (i < 19) return null;
    const w = c.slice(i - 19, i + 1), m = w.reduce((s, x) => s + x, 0) / 20;
    return m - 2 * Math.sqrt(w.reduce((s, x) => s + (x - m) ** 2, 0) / 20);
  });
  const bbMid = s20;

  const signals = {
    rsi: [], gold: [], boll: [],
  };
  for (let i = Math.max(startIdx, 21); i < all.length; i++) {
    if (rsi[i - 1] >= 30 && rsi[i] < 30) signals.rsi.push(i);                       // RSI 30 아래로 처음 내려온 날
    if (s5[i - 1] <= s20[i - 1] && s5[i] > s20[i]) signals.gold.push(i);            // 5일선이 20일선을 위로 뚫은 날
    if (c[i - 1] >= bbLo[i - 1] && c[i] < bbLo[i]) signals.boll.push(i);            // 볼린저 하단 아래로 처음 내려온 날
  }

  const stat = (idxs, N) => {
    const rs = idxs.filter((i) => i + N < all.length).map((i) => c[i + N] / c[i] - 1);
    if (!rs.length) return null;
    const sorted = [...rs].sort((a, b) => a - b);
    return {
      n: rs.length,
      win: rs.filter((x) => x > 0).length / rs.length,
      avg: rs.reduce((s, x) => s + x, 0) / rs.length,
      med: sorted[Math.floor(rs.length / 2)],
      worst: sorted[0],
    };
  };
  const everyday = [];
  for (let i = startIdx; i < all.length; i++) everyday.push(i);

  const event = {};
  for (const N of [5, 20]) {
    event[N] = { base: stat(everyday, N), rsi: stat(signals.rsi, N), gold: stat(signals.gold, N), boll: stat(signals.boll, N) };
  }

  // 규칙 매매: 진입/청산 규칙대로 들고 있다가 나오기. 한 번에 하나만 보유.
  const strat = (entry, exit) => {
    let pos = null, eq = 1, eqNet = 1, trades = 0, wins = 0;
    for (let i = Math.max(startIdx, 21); i < all.length; i++) {
      if (pos == null && entry(i)) pos = i;
      else if (pos != null && exit(i)) {
        const r = c[i] / c[pos]; eq *= r; eqNet *= r * (1 - 0.002); trades++; if (r > 1) wins++; pos = null;
      }
    }
    if (pos != null) { const r = c.at(-1) / c[pos]; eq *= r; eqNet *= r * (1 - 0.002); trades++; if (r > 1) wins++; }
    return { trades, win: wins / trades, ret: eq - 1, retNet: eqNet - 1 };
  };
  const bh = c.at(-1) / c[startIdx] - 1;
  const strategies = {
    rsi: strat((i) => rsi[i - 1] >= 30 && rsi[i] < 30, (i) => rsi[i] >= 50),
    gold: strat((i) => s5[i - 1] <= s20[i - 1] && s5[i] > s20[i], (i) => s5[i] < s20[i]),
    boll: strat((i) => c[i - 1] >= bbLo[i - 1] && c[i] < bbLo[i], (i) => c[i] >= bbMid[i]),
  };
  // 시장에 들어가 있던 기간 비율(노출)
  const expo = (entry, exit) => { let pos = false, days = 0, tot = 0;
    for (let i = Math.max(startIdx, 21); i < all.length; i++) { tot++; if (!pos && entry(i)) pos = true; else if (pos && exit(i)) pos = false; if (pos) days++; }
    return days / tot; };
  strategies.rsi.exposure = expo((i) => rsi[i - 1] >= 30 && rsi[i] < 30, (i) => rsi[i] >= 50);
  strategies.gold.exposure = expo((i) => s5[i - 1] <= s20[i - 1] && s5[i] > s20[i], (i) => s5[i] < s20[i]);
  strategies.boll.exposure = expo((i) => c[i - 1] >= bbLo[i - 1] && c[i] < bbLo[i], (i) => c[i] >= bbMid[i]);

  // 연도별 골든크로스 20일 승률 (구간을 바꾸면 흔들리는지)
  const byYear = {};
  for (const i of signals.gold) { if (i + 20 >= all.length) continue; const y = all[i].d.slice(0, 4); (byYear[y] ||= []).push(c[i + 20] / c[i] - 1); }
  const goldByYear = Object.fromEntries(Object.entries(byYear).map(([y, a]) => [y, { n: a.length, win: a.filter((x) => x > 0).length / a.length }]));

  return { from: all[startIdx].d, to: all.at(-1).d, days: all.length - startIdx, events: Object.fromEntries(Object.entries(signals).map(([k, v]) => [k, v.length])), event, strategies, buyHold: bh, goldByYear };
}

const out = { tenYear: run("2016-10-17"), full: run("2000-01-01") };
writeFileSync(new URL("../src/backtest/result.json", import.meta.url), JSON.stringify(out, null, 1));
const p = (x) => (x == null ? "-" : (x * 100).toFixed(1) + "%");
for (const [k, r] of Object.entries(out)) {
  console.log(`\n== ${k}: ${r.from} ~ ${r.to}, ${r.days}거래일, 신호 수`, r.events, "buy&hold", p(r.buyHold));
  for (const N of [5, 20]) for (const s of ["base", "rsi", "gold", "boll"]) { const e = r.event[N][s]; console.log(`  ${N}일 ${s.padEnd(4)} n=${String(e.n).padStart(4)} 승률 ${p(e.win)} 평균 ${p(e.avg)} 중앙 ${p(e.med)} 최악 ${p(e.worst)}`); }
  for (const [s, v] of Object.entries(r.strategies)) console.log(`  규칙매매 ${s}: ${v.trades}회 승률 ${p(v.win)} 누적 ${p(v.ret)} (비용후 ${p(v.retNet)}) 보유비율 ${p(v.exposure)}`);
}
console.log("\n골든크로스 연도별 20일 승률(10년):", Object.entries(out.tenYear.goldByYear).map(([y, v]) => `${y}:${p(v.win)}(${v.n})`).join(" "));
