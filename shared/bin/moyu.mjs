#!/usr/bin/env node
// 저장소 공용 명령 (루트에서 npm run … 으로 부른다)
//
//   npm run units  -- [project]                     편 목록 (코드 · 상태 · 제목 · 유튜브)
//   npm run verify -- [project]                     unit.json 검사 (문제가 있으면 실패)
//   npm run new    -- <project> <code> [--slug s] [--format f] [--title "제목"] [--series s]
//                                                   templates/<project>/<format>/ 를 복사해 새 편 시작
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO } from "../env.mjs";
import { PROJECTS, checkUnit, contentDir, listUnits, projectDir } from "../unit.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const flags = {};
const args = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) flags[rest[i].slice(2)] = rest[i + 1]?.startsWith("--") || rest[i + 1] === undefined ? true : rest[++i];
  else args.push(rest[i]);
}
const projects = (p) => (p ? [p] : Object.keys(PROJECTS));
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

const units = () => {
  for (const p of projects(args[0])) {
    const list = listUnits(p);
    console.log(`\n■ ${p} — ${PROJECTS[p].title} (${list.length}편)`);
    for (const { code, unit } of list) {
      const yt = (unit.youtube ?? []).map((y) => `${y.kind}:${y.id}`).join(" ");
      console.log(`  ${code.padEnd(10)} ${unit.status.padEnd(8)} ${unit.title}${yt ? `  [${yt}]` : ""}`);
    }
  }
};

const verify = () => {
  let bad = 0;
  for (const p of projects(args[0])) {
    for (const entry of listUnits(p)) {
      const problems = checkUnit(p, entry);
      if (problems.length) {
        bad++;
        console.log(`✖ ${p}/${entry.name}\n   ${problems.join("\n   ")}`);
      }
    }
    const codes = listUnits(p).map((u) => u.code);
    for (const c of new Set(codes.filter((c, i) => codes.indexOf(c) !== i))) {
      bad++;
      console.log(`✖ ${p}: code '${c}' 가 두 폴더에 있다`);
    }
  }
  console.log(bad ? `\n문제 ${bad}건` : "모든 unit.json 통과");
  process.exit(bad ? 1 : 0);
};

// 템플릿 글자 바꾸기: {{code}} {{slug}} {{title}} {{date}} {{format}} {{series}}
const fill = (text, vars) => text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
const TEXT = /\.(json|md|txt|tsx?|mjs|html|ya?ml)$/;
const copyFilled = (from, to, vars) => {
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dest = join(to, fill(name, vars));
    if (statSync(src).isDirectory()) {
      mkdirSync(dest, { recursive: true });
      copyFilled(src, dest, vars);
    } else if (TEXT.test(name)) writeFileSync(dest, fill(readFileSync(src, "utf8"), vars));
    else cpSync(src, dest);
  }
};

const create = () => {
  const [project, code] = args;
  if (!project || !code) throw new Error("사용: npm run new -- <project> <code> [--slug s] [--format f] [--title 제목]");
  projectDir(project);
  if (!/^[a-z][a-zA-Z0-9]*$/.test(code)) throw new Error(`code '${code}' 는 영문 · 숫자만 (첫 글자 소문자)`);
  if (listUnits(project).some((u) => u.code === code)) throw new Error(`${project}: '${code}' 는 이미 있다`);
  const formats = existsSync(join(REPO, "templates", project)) ? readdirSync(join(REPO, "templates", project)) : [];
  const format = flags.format ?? formats[0];
  const tpl = join(REPO, "templates", project, format ?? "");
  if (!format || !existsSync(tpl)) throw new Error(`templates/${project}/ 에 형식이 없다. 있는 것: ${formats.join(", ") || "(없음)"}`);
  const slug = typeof flags.slug === "string" ? flags.slug : "";
  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`slug '${slug}' 는 영문 소문자 · 숫자 · 하이픈`);
  const vars = { code, slug, format, title: typeof flags.title === "string" ? flags.title : `${code} (제목 미정)`, date: today(), series: typeof flags.series === "string" ? flags.series : "" };
  const meta = existsSync(join(tpl, "template.json")) ? JSON.parse(readFileSync(join(tpl, "template.json"), "utf8")) : {};
  const dir = join(contentDir(project), slug ? `${code}-${slug}` : code);
  mkdirSync(dir, { recursive: true });
  copyFilled(join(tpl, "unit"), dir, vars);
  // 엔진 쪽 파일(컴포넌트 스텁 등): template.json 의 engine: [{ from, to }] — to 는 저장소 루트 기준, {{code}} 사용 가능
  for (const e of meta.engine ?? []) {
    const to = join(REPO, fill(e.to, vars));
    if (existsSync(to)) throw new Error(`${relative(REPO, to)} 가 이미 있다`);
    mkdirSync(to, { recursive: true });
    copyFilled(join(tpl, e.from), to, vars);
  }
  // series 가 없으면 unit.json 에서 빈 값을 지운다
  const unit = JSON.parse(readFileSync(join(dir, "unit.json"), "utf8"));
  for (const k of Object.keys(unit)) if (unit[k] === "") delete unit[k];
  writeFileSync(join(dir, "unit.json"), `${JSON.stringify(unit, null, 2)}\n`);
  console.log(`✔ ${relative(REPO, dir)} (${format})`);
  if (meta.next) console.log(`\n다음:\n${meta.next.map((s) => `  - ${fill(s, vars)}`).join("\n")}`);
};

const COMMANDS = { units, verify, new: create };
if (!COMMANDS[cmd]) {
  console.error(`명령: ${Object.keys(COMMANDS).join(" · ")}`);
  process.exit(1);
}
try {
  COMMANDS[cmd]();
} catch (e) {
  console.error(`✖ ${e.message}`);
  process.exit(1);
}
