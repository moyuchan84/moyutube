// 대본(script.json) + 그림 목록(art.json) → 콘티 시트 한 장 (episodes/NN-…/storyboard.html)
// 사용: node scripts/storyboard.mjs ep04
// 그림이 이미 있으면(video/public/art 의 처리된 그림 → 없으면 원본) 그 그림으로, 없으면 얼굴 없는 실루엣 · 이름표로 그린다.
// 컷마다 배경 · 인물 위치 · 소품 · 움직임(등장, 걸어가기, 배경 밀기) · 화면 글자 · 대사를 한눈에 본다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, VIDEO, assetKey, common, episodeDir, findRaw, isCommon, listEpisodes, loadEpisode } from "./art-lib.mjs";

const ep = process.argv[2];
if (!listEpisodes().includes(ep)) throw new Error(`사용: node scripts/storyboard.mjs <${listEpisodes().join("|")}>`);
const script = JSON.parse(readFileSync(join(VIDEO, "src", ep, "script.json"), "utf8"));
const art = loadEpisode(ep);
const dir = join(ROOT, episodeDir(ep));
const items = new Map([...common.items, ...art.items].map((i) => [i.id, i]));

const W = 1920, H = 1080, FLOOR = 0.8;
const HEIGHT = { dad: 0.64, kid: 0.43, granny: 0.5 };
const WHO = { narr: "나레이션", docu: "다큐 톤", dad: "아빠", kid: "아이", granny: "할머니", barber: "할아버지" };
// 그 밖의 손님은 voice.json 의 이름을 쓴다 (약사 선생님 등)
for (const sp of JSON.parse(readFileSync(join(VIDEO, "src", "voice.json"), "utf8")).speakers) if (sp.name) for (const r of sp.roles) WHO[r] ??= sp.name;
const COLOR = { dad: "#C9A227", kid: "#B8352A", granny: "#7B4FA0", barber: "#4F7CA8" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 그림 파일: 투명 처리된 결과가 있으면 그것, 배경류는 원본도 쓴다
const imageOf = (id) => {
  if (!id) return null;
  const done = join(VIDEO, "public/art", `${assetKey(ep, id)}.webp`);
  if (existsSync(done)) return relative(dir, done).replace(/\\/g, "/");
  const kind = items.get(id)?.kind;
  if (["bg", "full", "stage"].includes(kind)) {
    const raw = findRaw(ep, id);
    if (raw) return relative(dir, raw).replace(/\\/g, "/");
  }
  return null;
};
const titleOf = (id) => (items.get(id)?.title ?? id).replace(/^[^—]*—\s*/, "");
let have = 0, need = 0;
const used = new Set();

// 얼굴 없는 실루엣 (발 끝 = (x, floor))
const silhouette = (cx, foot, h, color, seated) => {
  const head = h * 0.17;
  const body = seated
    ? `<rect x="${cx - h * 0.26}" y="${foot - h * 0.48}" width="${h * 0.52}" height="${h * 0.48}" rx="${h * 0.06}" fill="#8A3A33" opacity=".85"/>
       <path d="M${cx - h * 0.22} ${foot - h * 0.2} Q${cx} ${foot - h * 0.85} ${cx + h * 0.22} ${foot - h * 0.2}Z" fill="#F4F1EA" stroke="${color}" stroke-width="10"/>`
    : `<path d="M${cx - h * 0.2} ${foot} L${cx - h * 0.16} ${foot - h * 0.66} Q${cx} ${foot - h * 0.8} ${cx + h * 0.16} ${foot - h * 0.66} L${cx + h * 0.2} ${foot}Z" fill="${color}"/>`;
  const headY = seated ? foot - h * 0.53 - head * 0.85 : foot - h + head;
  return `${body}<circle cx="${cx}" cy="${headY}" r="${head}" fill="${color}"/>`;
};

const panel = (cut) => {
  const sc = cut.scene ?? {};
  const parts = [];
  const bgId = cut.style === "end" ? cut.art : sc.bg;
  const bgImg = imageOf(bgId);
  if (bgId) used.add(bgId);
  if (bgImg) parts.push(`<image href="${esc(bgImg)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"${cut.style === "end" ? ' opacity=".35"' : ""}/>`);
  else if (bgId) {
    const kind = items.get(bgId)?.kind;
    parts.push(`<rect width="${W}" height="${H}" fill="${kind === "bg" ? "#E8E1D3" : "#DCE3E8"}"/>`);
    if (kind === "bg") parts.push(`<rect y="${H * FLOOR}" width="${W}" height="${H * (1 - FLOOR)}" fill="#D3CAB8"/>`);
    parts.push(`<text x="${W / 2}" y="${kind === "bg" ? H * 0.2 : H * 0.48}" text-anchor="middle" class="ph">${esc(titleOf(bgId))}</text>`);
    if (kind !== "bg") parts.push(`<text x="${W / 2}" y="${H * 0.58}" text-anchor="middle" class="ph-sub">한 장짜리 장면 · 아직 없음</text>`);
  } else parts.push(`<rect width="${W}" height="${H}" fill="#F4F1EA"/>`);

  if (cut.style === "triptych") {
    (cut.triptych ?? []).forEach((t, i) => {
      const x = 120 + i * 580;
      const img = imageOf(t.art);
      used.add(t.art);
      parts.push(`<rect x="${x}" y="200" width="520" height="640" rx="28" fill="#fff" stroke="#1B2A26" stroke-width="6"/>`);
      if (img) parts.push(`<image href="${esc(img)}" x="${x + 60}" y="240" width="400" height="360"/>`);
      else parts.push(`<rect x="${x + 110}" y="270" width="300" height="300" rx="150" fill="#E8E1D3"/><text x="${x + 260}" y="430" text-anchor="middle" class="lbl">${esc(titleOf(t.art))}</text>`);
      parts.push(`<text x="${x + 260}" y="700" text-anchor="middle" class="tri-name">${esc(t.name)}</text><text x="${x + 260}" y="780" text-anchor="middle" class="lbl">${esc(t.label)}</text>`);
    });
  }
  if (cut.style === "end" && cut.end) {
    parts.push(`<text x="${W / 2}" y="420" text-anchor="middle" class="lbl">${esc(cut.end.series)}</text><text x="${W / 2}" y="560" text-anchor="middle" class="tri-name">${esc(cut.end.title)}</text><text x="${W / 2}" y="700" text-anchor="middle" class="lbl">${esc(cut.end.next)}</text>`);
  }

  const floor = (sc.floor ?? FLOOR) * H;
  const prop = (p, i) => {
    used.add(p.art);
    const img = imageOf(p.art);
    const w = p.w * W, x = p.x * W, y = p.y * H;
    const s = [];
    if (img) s.push(`<image href="${esc(img)}" x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}"/>`);
    else s.push(`<rect x="${x - w / 2}" y="${y - w * 0.3}" width="${w}" height="${w * 0.6}" rx="18" fill="#fff" stroke="#66756E" stroke-width="5" stroke-dasharray="14 10"/><text x="${x}" y="${y + 12}" text-anchor="middle" class="lbl">${esc(titleOf(p.art))}</text>`);
    const notes = [p.enter && `등장: ${p.enter}`, p.motion && `움직임: ${p.motion}`, p.at != null && `${p.at + 1}번째 대사에`].filter(Boolean);
    if (p.to) s.push(`<path d="M${x} ${y - w * 0.45} L${p.to.x * W} ${y - w * 0.45}" class="arrow"/>`);
    if (notes.length) s.push(`<text x="${x}" y="${y - w * 0.36}" text-anchor="middle" class="note">${esc(notes.join(" · "))}</text>`);
    return s.join("");
  };
  (sc.props ?? []).filter((p) => !p.front).forEach((p, i) => parts.push(prop(p, i)));

  for (const a of sc.actors ?? []) {
    const h = (a.h ?? HEIGHT[a.id] ?? 0.6) * H;
    const x = a.x * W;
    const poses = [a.art, ...cut.lines.map((l) => l.pose?.[a.id]).filter(Boolean)];
    poses.forEach((p) => used.add(p));
    const img = imageOf(a.art);
    if (img) parts.push(`<image href="${esc(img)}" x="${x - h * 0.5}" y="${floor - h}" width="${h}" height="${h}" preserveAspectRatio="xMidYMax meet"/>`);
    else parts.push(silhouette(x, floor, h, COLOR[a.id] ?? "#555", /의자|보자기/.test(titleOf(a.art))));
    const change = [...new Set(poses.slice(1))].map(titleOf);
    const label = [titleOf(a.art), ...change.map((c) => `→ ${c}`)].join(" ");
    parts.push(`<text x="${x}" y="${floor + 56}" text-anchor="middle" class="actor" fill="${COLOR[a.id] ?? "#333"}">${esc(WHO[a.id] ?? a.id)}</text><text x="${x}" y="${floor + 104}" text-anchor="middle" class="note">${esc(label)}</text>`);
    const moves = cut.lines.map((l) => l.move?.[a.id]).filter((v) => v != null);
    if (moves.length) parts.push(`<path d="M${x} ${floor - h - 30} L${Math.min(Math.max(moves.at(-1), -0.05), 1.05) * W} ${floor - h - 30}" class="arrow"/><text x="${x}" y="${floor - h - 50}" text-anchor="middle" class="note">걸어감</text>`);
    const tags = [a.enter && `등장: ${a.enter}`, a.idle && `버릇: ${a.idle}`, ...cut.lines.filter((l) => l.act?.[a.id]).map((l) => `동작: ${l.act[a.id]}`)].filter(Boolean);
    if (tags.length) parts.push(`<text x="${x}" y="${floor + 148}" text-anchor="middle" class="note">${esc(tags.join(" · "))}</text>`);
  }
  (sc.props ?? []).filter((p) => p.front).forEach((p, i) => parts.push(prop(p, i)));

  if (sc.pan) {
    const arrow = { left: "M1300 120 L620 120", right: "M620 120 L1300 120", up: "M1800 700 L1800 260", down: "M1800 260 L1800 700" }[sc.pan];
    parts.push(`<path d="${arrow}" class="arrow pan"/><text x="${sc.pan === "up" || sc.pan === "down" ? 1760 : 960}" y="${sc.pan === "up" || sc.pan === "down" ? 220 : 90}" text-anchor="middle" class="note">배경 밀기: ${sc.pan}</text>`);
  }
  if (cut.caption) parts.push(`<rect x="40" y="36" width="${60 + cut.caption.length * 46}" height="84" rx="12" fill="#1B2A26"/><text x="70" y="94" class="cap">${esc(cut.caption)}</text>`);
  const pops = cut.lines.filter((l) => l.pop).map((l) => l.pop);
  pops.slice(0, 3).forEach((p, i) => parts.push(`<g transform="rotate(-4 ${1500} ${300 + i * 130})"><rect x="${1180}" y="${240 + i * 130}" width="640" height="100" rx="16" fill="#B8352A"/><text x="1500" y="${308 + i * 130}" text-anchor="middle" class="pop">${esc(p)}</text></g>`));
  const cutins = [...new Set(cut.lines.map((l) => l.cutin).filter(Boolean))];
  cutins.forEach((c) => used.add(c));
  if (cutins.length) parts.push(`<text x="40" y="${H - 40}" class="note">컷인: ${esc(cutins.map(titleOf).join(", "))}</text>`);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`;
};

const lineHtml = (l) => {
  const marks = [l.fx && `fx:${l.fx}`, l.sfx && `♪${l.sfx}`, l.focus && `당김:${WHO[l.focus] ?? l.focus}`].filter(Boolean);
  const who = WHO[l.who] ?? l.who;
  return `<li class="w-${l.who}"><b>${esc(who)}</b> ${esc(l.text)}${marks.length ? ` <span class="mk">${esc(marks.join(" · "))}</span>` : ""}</li>`;
};

const cards = script.cuts.map((cut, i) => `
<article class="card">
  <header><span class="no">${String(i + 1).padStart(2, "0")}</span><span class="id">${esc(cut.id)}</span><span class="beat">${esc(cut.beat || "끝 화면")}</span></header>
  ${panel(cut)}
  <ul class="lines">${cut.lines.map(lineHtml).join("")}</ul>
</article>`).join("");

for (const id of used) (imageOf(id) ? have++ : need++);
const title = `${script.title} — 콘티`;
const html = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<style>
:root{--paper:#F6EEDF;--ink:#1B2A26;--muted:#66756E;--red:#B8352A;--card:#fff}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--paper:#1E2422;--ink:#ECE6DA;--muted:#A3ADA8;--card:#2A312E}}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Pretendard Variable",sans-serif}
.top{max-width:1500px;margin:0 auto;padding:32px 16px 8px}
h1{font-size:28px;margin:0 0 6px}.sub{color:var(--muted);margin:0}
.grid{max-width:1500px;margin:0 auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px}
.card{background:var(--card);border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.card header{display:flex;gap:10px;align-items:center;padding:10px 14px;font-size:14px}
.no{font-weight:800;color:var(--red)}.id{color:var(--muted);font-family:monospace}.beat{font-weight:700}
.card svg{display:block;width:100%;height:auto;background:#eee}
.lines{list-style:none;margin:0;padding:10px 14px 14px;font-size:13.5px;line-height:1.55}
.lines b{display:inline-block;min-width:4.2em;color:var(--muted);font-weight:700}
.w-kid b{color:#B8352A}.w-dad b{color:#A5841A}.w-barber b,.w-granny b{color:#4F7CA8}.w-docu{font-style:italic}
.mk{color:var(--muted);font-size:12px}
svg text{font-family:"Pretendard Variable",sans-serif}
.ph{font-size:76px;font-weight:800;fill:#66756E}.ph-sub{font-size:44px;fill:#8C9893}
.lbl{font-size:40px;font-weight:700;fill:#1B2A26}.tri-name{font-size:72px;font-weight:800;fill:#B8352A}
.actor{font-size:46px;font-weight:800}.note{font-size:34px;fill:#1B2A26;paint-order:stroke;stroke:#fff;stroke-width:8px}
.cap{font-size:46px;font-weight:800;fill:#fff}.pop{font-size:52px;font-weight:800;fill:#fff}
.arrow{stroke:#B8352A;stroke-width:10;stroke-dasharray:24 14;fill:none;marker-end:url(#a)}
</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs><marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#B8352A"/></marker></defs></svg>
<div class="top"><h1>${esc(title)}</h1>
<p class="sub">${script.cuts.length}컷 · 그림 ${have + need}장 중 ${have}장 있음 (없는 그림은 실루엣 · 이름표) · <code>npm run storyboard -- ${ep}</code> 로 다시 만든다</p></div>
<main class="grid">${cards}</main>
</body></html>
`;
const out = join(dir, "storyboard.html");
writeFileSync(out, html);
console.log(`${relative(ROOT, out)} — ${script.cuts.length}컷, 그림 ${have}/${have + need}장 있음`);
