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

// art.json 이 있는 편만 (ep01, ep02 …)
export const listEpisodes = () =>
  readdirSync(join(VIDEO, "src"))
    .filter((name) => /^ep\d+$/.test(name) && existsSync(join(VIDEO, "src", name, "art.json")))
    .sort();

export const loadEpisode = (ep) => readJson(join(VIDEO, "src", ep, "art.json"));

// ep01 → episodes/01-hotel-motel-hostel
export const episodeDir = (ep) => {
  const prefix = `${ep.slice(2)}-`;
  const dir = readdirSync(join(ROOT, "episodes")).find((name) => name.startsWith(prefix));
  if (!dir) throw new Error(`episodes/${prefix}* 폴더가 없습니다`);
  return `episodes/${dir}`;
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

// 같은 사람을 유지하려고 ②로 첨부하는 기준 그림의 id
export const refOf = (item) => {
  if ("ref" in item) return item.ref; // ref: null 은 "이 그림이 기준"
  if (!item.who || !common.cast[item.who]) return null;
  const base = `common/${item.who}/normal`;
  return item.id === base ? null : base;
};
