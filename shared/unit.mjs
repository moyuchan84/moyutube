// 콘텐츠 단위(편 하나 = 폴더 하나) 찾기 · 읽기 · 검사. 규칙은 docs/CONVENTIONS.md.
//
//   <project>/content/<dir>/unit.json   dir = "<code>-<slug>" 또는 "<code>"
//   밑줄로 시작하는 폴더(_common, _old …)는 단위가 아니다.
// 도구는 폴더 이름을 짐작하지 않고 unit.json 의 code 로 찾는다.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./env.mjs";

export const PROJECTS = {
  qna: { title: "모라구 · 여덟 살의 질문 (모답맨 · 내모남불)", engine: "remotion", video: "qna/video" },
  shortube: { title: "숫자로 보는 요즘 (쇼츠)", engine: "remotion", video: "shortube/video" },
  funtube: { title: "일상 오류 신고센터", engine: "remotion", video: "funtube/video" },
  lab: { title: "모라구 · 보면 풀리는 수학 · 과학", engine: "motion-canvas", video: "lab" },
  fairy: { title: "그림책 동화", engine: "remotion", video: "fairy/video" },
};

export const STATUS = ["idea", "script", "art", "voice", "edit", "uploaded", "archived"];
// 단위 폴더 안에 둘 수 있는 하위 폴더 — 이 밖의 이름을 즉석에서 만들지 않는다
export const FOLDERS = ["script", "prompts", "art", "voice", "music", "upload", "source", "_old"];

export const projectDir = (project) => {
  if (!PROJECTS[project]) throw new Error(`프로젝트는 ${Object.keys(PROJECTS).join(" · ")} 중 하나: '${project}'`);
  return join(REPO, project);
};
export const contentDir = (project) => join(projectDir(project), "content");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

// [{ code, dir(절대 경로), name(폴더 이름), unit }] — code 순
export const listUnits = (project) => {
  const root = contentDir(project);
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && existsSync(join(root, d.name, "unit.json")))
    .map((d) => {
      const unit = readJson(join(root, d.name, "unit.json"));
      return { code: unit.code, name: d.name, dir: join(root, d.name), unit };
    })
    .sort((a, b) => a.code.localeCompare(b.code, "en", { numeric: true }));
};

export const findUnit = (project, code) => {
  const units = listUnits(project);
  const hit = units.find((u) => u.code === code);
  if (!hit) throw new Error(`${project}: 단위 '${code}' 가 없다. 있는 것: ${units.map((u) => u.code).join(", ") || "(없음)"}`);
  return hit;
};
export const unitDir = (project, code) => findUnit(project, code).dir;
export const readUnit = (project, code) => findUnit(project, code).unit;
export const writeUnit = (dir, unit) => writeFileSync(join(dir, "unit.json"), `${JSON.stringify(unit, null, 2)}\n`);

// unit.json 검사 — 문제 목록을 돌려준다 (빈 배열 = 통과)
export const checkUnit = (project, entry) => {
  const { unit, name, dir } = entry;
  const problems = [];
  for (const key of ["code", "title", "format", "status", "created"]) if (!unit[key]) problems.push(`${key} 없음`);
  if (unit.code && !/^[a-z][a-zA-Z0-9]*$/.test(unit.code)) problems.push(`code '${unit.code}' 는 영문 · 숫자만 (첫 글자 소문자)`);
  if (unit.code && name !== unit.code && !name.startsWith(`${unit.code}-`)) problems.push(`폴더 이름 '${name}' 이 code '${unit.code}' 로 시작하지 않는다`);
  if (unit.status && !STATUS.includes(unit.status)) problems.push(`status '${unit.status}' 는 ${STATUS.join(" · ")} 중 하나`);
  if (unit.created && !/^\d{4}-\d{2}-\d{2}$/.test(unit.created)) problems.push(`created 는 YYYY-MM-DD`);
  if (unit.status === "uploaded" && !(unit.youtube ?? []).length) problems.push("uploaded 인데 youtube 기록이 없다");
  for (const y of unit.youtube ?? []) if (!y.id || !["long", "short"].includes(y.kind)) problems.push(`youtube 항목은 {id, kind: long|short}: ${JSON.stringify(y)}`);
  if (unit.variantOf && !listUnits(project).some((u) => u.code === unit.variantOf)) problems.push(`variantOf '${unit.variantOf}' 단위가 없다`);
  for (const sub of readdirSync(dir, { withFileTypes: true })) {
    if (sub.isDirectory() && !FOLDERS.includes(sub.name)) problems.push(`허용되지 않은 하위 폴더 '${sub.name}/' (${FOLDERS.join(" · ")})`);
  }
  return problems;
};
