// 편 목록 자동 등록: content/*/unit.json (video.composition) + src/units/<code>/index.ts → src/generated/units.ts
// Root.tsx 는 이 목록만 읽는다 — 새 편을 만들 때 Root.tsx 에 줄을 더하지 않는다. studio · render 앞에 자동으로 돈다.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VIDEO, videoUnits } from "./lib.mjs";

const OUT = join(VIDEO, "src", "generated", "units.ts");
const list = videoUnits();
const ts = `// 자동 생성 — node scripts/registry.mjs (content/*/unit.json 에서). 손으로 고치지 않는다.
${list.map((u) => `import * as ${u.code} from "../units/${u.code}";`).join("\n")}

export const UNITS = [
${list.map((u) => `  { code: "${u.code}", id: "${u.unit.video.composition}", ...${u.code} },`).join("\n")}
];
`;
mkdirSync(join(VIDEO, "src", "generated"), { recursive: true });
const before = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
if (before !== ts) writeFileSync(OUT, ts);
console.log(`registry: 편 ${list.length}개${before === ts ? " (그대로)" : " → src/generated/units.ts"}`);
