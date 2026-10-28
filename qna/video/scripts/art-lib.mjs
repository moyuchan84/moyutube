// 편(콘텐츠 단위) 경로와 그림 목록(art.json) 규칙. qna 의 모든 스크립트가 이 파일로 경로를 얻는다.
//
//   편 하나 = qna/content/<code>-<slug>/  (unit.json · plan.md · script/ · prompts/ · art/ · voice/ · upload/)
//   공통(가족 · 앵커 · 채널) = qna/content/_common/  (art/ · script/art.json · prompts/)
//
//   그림 id                 원본(Gemini 결과를 넣는 곳)                      결과(영상이 읽는 곳)
//   common/dad/normal   →   content/_common/art/dad/normal.png          →   video/public/art/common/dad/normal.webp
//   bg/motel-counter    →   content/ep01-…/art/bg/motel-counter.png     →   video/public/art/ep01/bg/motel-counter.webp
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findUnit, listUnits } from "../../../shared/unit.mjs";

export const VIDEO = resolve(fileURLToPath(new URL("../", import.meta.url)));
export const ROOT = resolve(VIDEO, ".."); // qna/
export const COMMON = join(ROOT, "content", "_common");
export const ANCHOR = "content/_common/art/anchor/style-cutin.png";
export const EXTS = [".png", ".jpg", ".jpeg", ".webp"];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

export const common = readJson(join(COMMON, "script", "art.json"));

// ── 편 경로 ──────────────────────────────────────────────────────────────────────
export const units = () => listUnits("qna");
export const unit = (code) => findUnit("qna", code); // { code, dir, name, unit }
export const unitPath = (code, ...p) => join(unit(code).dir, ...p);
export const scriptPath = (code, file) => unitPath(code, "script", file);
export const readScript = (code, file) => readJson(scriptPath(code, file));
export const voiceDir = (code) => unitPath(code, "voice"); // 최종 음성 원본 (git) — public/<code>/voice 는 sync 가 만드는 사본
export const studioDir = (code) => unitPath(code, "voice", "studio"); // AI Studio 에서 받은 컷별 원본
export const uploadDir = (code) => unitPath(code, "upload");
export const publicDir = (code, ...p) => join(VIDEO, "public", code, ...p);
export const codes = () => units().map((u) => u.code);
// 편 코드를 받는 명령에서: 틀리면 있는 목록을 보여 주고 멈춘다
export const argCode = (code, usage) => {
  if (!code || !codes().includes(code)) throw new Error(`${usage ?? "편 코드"}: <${codes().join("|")}>${code ? ` — '${code}' 는 없다` : ""}`);
  return code;
};

// art.json 이 있는 편만 (ep01 … · 내모남불 nm01 …). 리메이크(ep01f)는 원편 그림을 쓴다
export const listEpisodes = () => units().filter((u) => existsSync(join(u.dir, "script", "art.json"))).map((u) => u.code);

export const loadEpisode = (ep) => readScript(ep, "art.json");

// 편 폴더 (qna/ 기준 경로): ep10 → content/ep10-hope-ufo-alien
export const episodeDir = (ep) => relative(ROOT, unit(ep).dir).split("\\").join("/");

export const isCommon = (id) => id.startsWith("common/");

// 저장할 때 쓰는 경로(확장자 .png 기준, qna/ 기준)
export const rawRel = (ep, id) =>
  isCommon(id) ? `content/_common/art/${id.slice("common/".length)}.png` : `${episodeDir(ep)}/art/${id}.png`;

// 실제로 있는 원본 파일(png/jpg/webp 아무거나). 없으면 null
export const findRaw = (ep, id) => {
  const base = join(ROOT, rawRel(ep, id).replace(/\.png$/, ""));
  const ext = EXTS.find((e) => existsSync(base + e));
  return ext ? base + ext : null;
};

// manifest(src/assets.json)와 public/art 아래에서 쓰는 이름
export const assetKey = (ep, id) => (isCommon(id) ? id : `${ep}/${id}`);

// 사람(who)의 기준 그림 id. 가족은 공통 그림, 편마다 나오는 제삼의 인물은 그 편의 <who>/normal
export const normalOf = (who) => (common.cast[who] ? `common/${who}/normal` : `${who}/normal`);

// 같은 사람을 유지하려고 ②로 첨부하는 기준 그림의 id
export const refOf = (item, cast = {}) => {
  if ("ref" in item) return item.ref; // ref: null 은 "이 그림이 기준"
  if (!item.who || !(common.cast[item.who] || cast[item.who])) return null;
  const base = normalOf(item.who);
  return item.id === base ? null : base;
};

// ── 첨부 규칙 (qna/ART_GUIDE.md §3) ─────────────────────────────────────────────
// 첨부는 사람이 고르지 않는다. 이 함수가 정하고, GEMINI_PROMPTS.md · jobs/images.json · artgen 이 모두 이걸 쓴다.
//   ① 화풍 앵커 — 사람이 나오는 그림은 ANCHOR, 사람 없는 소품은 ANCHOR_PROP
//   ② ref — 같은 사람 기준 그림(또는 이어 그리는 컷의 앞 프레임)
//   ③… item.attach (art.json 에 직접 적은 것 — 설명문이 "attached image 3" 처럼 번호로 부르므로 순서를 바꾸지 않는다)
//   그 뒤 자동 — 이어 그리는 컷이면 그 사람 normal, 가족 컷인이면 그 사람 대표 컷인, 같이 나오는 사람(people)마다 normal
export const ANCHOR_PROP = "content/_common/art/anchor/style-prop.png";
export const NO_PEOPLE_KINDS = new Set(["prop", "layer"]);

// "dad" · "the kid" 처럼 설명문에 나오는 사람 → who. 편 손님은 cast 설명의 "the guide:" 머리말에서 뽑는다
const FAMILY_WORDS = { dad: /\b(dad|daddy|father)\b/i, kid: /\b(kid|child|boy|son)\b/i, mom: /\b(mom|mommy|mother)\b/i };
export const mentionedPeople = (item, cast = {}) => {
  const text = `${item.desc ?? ""}`;
  const found = new Set();
  if (/\bfamily\b(?!\s+(car|sedan|van|restaurant))/i.test(text)) ["dad", "mom", "kid"].forEach((w) => found.add(w));
  for (const [who, re] of Object.entries(FAMILY_WORDS)) if (re.test(text)) found.add(who);
  for (const [who, desc] of Object.entries(cast)) {
    const head = /^(the [^:]+):/i.exec(desc)?.[1];
    // "the space science museum docent" 는 설명문에서 보통 "the docent" 로 부른다 → 마지막 낱말도 본다
    const words = head ? [head, head.split(" ").at(-1)] : [];
    if (words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(text))) found.add(who);
  }
  return [...found];
};

export const peopleOf = (item) => [...new Set([item.who, ...(item.people ?? [])].filter(Boolean))];

export const attachPlan = (ep, item, cast = {}, { second = false } = {}) => {
  const people = peopleOf(item);
  const out = [];
  const add = (path, label, role, who) => {
    if (out.some((a) => a.path === path)) return;
    out.push({ path, label, role, who });
  };
  const rel = (id) => rawRel(isCommon(id) ? null : ep, id);
  const propOnly = NO_PEOPLE_KINDS.has(item.kind) && people.length === 0;
  add(propOnly ? ANCHOR_PROP : ANCHOR, propOnly ? "소품 화풍 앵커 (사람 없는 소품)" : "화풍 앵커", propOnly ? "prop-anchor" : "anchor");
  const ref = refOf(item, cast);
  if (ref) add(rel(ref), second ? "첫 번째 프레임 — 이 그림을 그대로 다시 그린다" : ref === (item.who && normalOf(item.who)) ? "같은 사람 유지용 기준 그림" : "앞 컷 · 기준 그림", second ? "frame" : "ref", item.who);
  for (const a of item.attach ?? []) add(a.path, a.label, "extra");
  if (item.who && ref && ref !== normalOf(item.who) && item.id !== normalOf(item.who)) add(rel(normalOf(item.who)), "그 사람 기준 그림 (normal)", "person", item.who);
  // 이어 그리는 컷(…-sig-3)은 바로 앞 컷(…-sig-2)도 — 대화 기억에만 기대면 컷이 갈수록 얼굴 · 색이 변한다
  const step = /^(.*-)(\d+)$/.exec(item.id);
  const prev = step && Number(step[2]) > 2 ? `${step[1]}${Number(step[2]) - 1}` : null;
  if (ref && prev && findRaw(isCommon(prev) ? null : ep, prev)) add(rel(prev), "바로 앞 컷", "prev", item.who);
  const cutinRef = common.refs?.[item.who]?.cutin;
  if (item.kind === "cutin" && cutinRef && cutinRef !== item.id) add(rel(cutinRef), "그 사람 대표 컷인 (얼굴 · 피부 톤)", "person-cutin", item.who);
  for (const who of people) if (who !== item.who) add(rel(normalOf(who)), "같이 나오는 사람 기준 그림 (normal)", "person", who);
  return out;
};

// 사람이 설명문에 나오는데 첨부에 그 사람 기준 그림이 없으면 경고 (자동 큐 · prompts 가 출력한다)
export const attachProblems = (ep, item, cast = {}) => {
  const plan = attachPlan(ep, item, cast);
  const covered = new Set(peopleOf(item));
  for (const a of plan) for (const who of ["dad", "kid", "mom", ...Object.keys(cast)]) if (a.path === rawRel(isCommon(normalOf(who)) ? null : ep, normalOf(who))) covered.add(who);
  const problems = [];
  // 배경은 사람이 없어야 하고, "people" 을 적어 둔 그림(빈 배열 [] = 확인했고 사람 없음)은 사람이 정한 것을 믿는다
  const guess = item.kind === "bg" || Array.isArray(item.people) ? [] : mentionedPeople(item, cast);
  const missing = guess.filter((w) => !covered.has(w));
  if (missing.length) problems.push(`설명에 ${missing.join(", ")} 이(가) 나오는데 기준 그림이 첨부되지 않는다 → art.json 에 "people": ${JSON.stringify(missing)} 를 넣는다`);
  for (const a of plan) if (!EXTS.some((e) => existsSync(join(ROOT, a.path.replace(/\.png$/, e))))) problems.push(`첨부 그림이 아직 없다: ${a.path} (그 그림부터 뽑는다)`);
  return problems;
};
