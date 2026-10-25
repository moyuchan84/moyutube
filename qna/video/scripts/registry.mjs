// 편 목록 자동 등록: content/*/unit.json 을 훑어 src/generated/units.ts 를 만든다.
// Root.tsx 는 이 목록만 읽는다 — 새 편을 만들 때 Root.tsx 에 줄을 더하지 않는다.
// studio · render 앞에 자동으로 돈다 (package.json 의 prestudio · prerender). git 에 올린다 (깨끗한 checkout 에서도 렌더되게).
//   편 폴더 script/ 에서 읽는 것: script.json · timing.json (필수) · motion.json(모답맨 샷 계획) · shorts.json(편집형 쇼츠)
//                                 · motion-short.json(모답맨 쇼츠, 하나 또는 배열) · thumb.json(롱폼 얼굴 썸네일 글자)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { VIDEO, units } from "./art-lib.mjs";

const OUT = join(VIDEO, "src", "generated", "units.ts");
const FILES = { script: "script.json", timing: "timing.json", motion: "motion.json", shorts: "shorts.json", motionShort: "motion-short.json", thumb: "thumb.json" };

const imports = [];
const rows = [];
units().forEach(({ code, dir, unit }, i) => {
  const has = {};
  for (const [key, file] of Object.entries(FILES)) {
    const path = join(dir, "script", file);
    if (!existsSync(path)) continue;
    const name = `u${String(i).padStart(2, "0")}_${key}`;
    imports.push(`import ${name} from "${relative(join(VIDEO, "src", "generated"), path).split("\\").join("/")}";`);
    has[key] = name;
  }
  if (!has.script || !has.timing) {
    console.log(`  ⏭ ${code}: script/script.json · timing.json 이 아직 없어 영상 목록에서 뺀다`);
    return;
  }
  const meta = { code, format: unit.format, ...(unit.series ? { series: unit.series } : {}), ...(unit.variantOf ? { variantOf: unit.variantOf } : {}) };
  const fields = Object.entries(has).map(([k, v]) => `${k}: ${v}`);
  rows.push(`  { ${JSON.stringify(meta).slice(1, -1).replaceAll(",\"", ", \"").replaceAll("\":", "\": ")}, ${fields.join(", ")} },`);
});

const ts = `// 자동 생성 — node scripts/registry.mjs (content/*/unit.json 에서). 손으로 고치지 않는다.
/* eslint-disable */
${imports.join("\n")}

export type UnitData = {
  code: string;
  format: string;
  series?: string;
  variantOf?: string;
  script: any;
  timing: any;
  motion?: any;
  shorts?: any;
  motionShort?: any;
  thumb?: any;
};

export const UNITS: UnitData[] = [
${rows.join("\n")}
];
`;
mkdirSync(join(VIDEO, "src", "generated"), { recursive: true });
const before = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
if (before !== ts) writeFileSync(OUT, ts);
console.log(`registry: 편 ${rows.length}개${before === ts ? " (그대로)" : " → src/generated/units.ts"}`);
