// 그림 목록(art.json)과 파일 경로 규칙. prompts.mjs · art.mjs 가 같이 쓴다.
//
//   id                      원본(Gemini 결과를 넣는 곳)                    결과(영상이 읽는 곳)
//   common/dad/normal   →   art/common/dad/normal.png                 →   video/public/art/common/dad/normal.webp
//   bg/motel-counter    →   episodes/01-…/art/bg/motel-counter.png    →   video/public/art/ep01/bg/motel-counter.webp
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const VIDEO = resolve(fileURLToPath(new URL("../", import.meta.url)));
export const ROOT = resolve(VIDEO, "..");
export const ANCHOR = "art/anchor/style-cutin.png";
const EXTS = [".png", ".jpg", ".jpeg", ".webp"];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

export const common = readJson(join(VIDEO, "src/art-common.json"));

// art.json 이 있는 편만 (ep01, ep02 … · 내모남불 nm01 …)
export const listEpisodes = () =>
  readdirSync(join(VIDEO, "src"))
    .filter((name) => /^(ep|nm)\d+$/.test(name) && existsSync(join(VIDEO, "src", name, "art.json")))
    .sort();

export const loadEpisode = (ep) => readJson(join(VIDEO, "src", ep, "art.json"));

// ep01 → episodes/01-hotel-motel-hostel, nm01 → naemonambul/01-car (내모남불 시리즈)
export const episodeDir = (ep) => {
  const parent = ep.startsWith("nm") ? "naemonambul" : "episodes";
  const prefix = `${ep.slice(2)}-`;
  const dir = readdirSync(join(ROOT, parent)).find((name) => name.startsWith(prefix));
  if (!dir) throw new Error(`${parent}/${prefix}* 폴더가 없습니다`);
  return `${parent}/${dir}`;
};

export const isCommon = (id) => id.startsWith("common/");

// 저장할 때 쓰는 경로(확장자 .png 기준, 저장소 루트 기준)
export const rawRel = (ep, id) =>
  isCommon(id) ? `art/${id}.png` : `${episodeDir(ep)}/art/${id}.png`;

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
export const ANCHOR_PROP = "art/anchor/style-prop.png";
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
  for (const a of plan) if (!EXTS.some((e) => existsSync(join(ROOT, a.path.replace(/.png$/, e))))) problems.push(`첨부 그림이 아직 없다: ${a.path} (그 그림부터 뽑는다)`);
  return problems;
};
