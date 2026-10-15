// 한 편의 그림 · 음성 만들기를 다른 도구(Antigravity 같은 에이전트)에 넘길 때 쓰는 작업 지시서를 만든다.
//   episodes/NN-…/ANTIGRAVITY.md      지시서 (사람도 읽는다)
//   episodes/NN-…/jobs/images.json    그림 작업 목록 (프롬프트 · 첨부 · 저장 경로)
//   episodes/NN-…/jobs/voice.json     음성 작업 목록 (컷별 목소리 · 대사 · 저장 경로)
// 사용: node scripts/handoff.mjs ep03
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VIDEO, episodeDir } from "./art-lib.mjs";

const episode = process.argv[2] ?? "ep01";
const run = (cmd) => execSync(cmd, { cwd: VIDEO, stdio: "ignore" });
run(`node scripts/prompts.mjs ${episode}`);
run(`node scripts/voice.mjs ${episode} jobs`);
run(`node scripts/voice.mjs ${episode} studio`);

const dir = episodeDir(episode);
const images = JSON.parse(readFileSync(join(ROOT, dir, "jobs/images.json"), "utf8"));
const voice = JSON.parse(readFileSync(join(ROOT, dir, "jobs/voice.json"), "utf8"));
const KIND = { char: "인물", cutin: "컷인", prop: "소품", bg: "배경", full: "장면", stage: "무대", layer: "앞쪽 레이어", talk: "말하는 그림" };
const todoImages = images.jobs.filter((j) => !j.done);
const todoVoice = voice.jobs.filter((j) => !j.done);
const voices = [...new Map(voice.jobs.flatMap((j) => j.speakers).map((sp) => [sp.voice, sp])).values()];

const md = `# ${images.title} — 그림 · 음성 작업 지시서

> \`video/scripts/handoff.mjs\` 가 만든 파일이다. 대본이나 그림 목록을 고친 뒤 \`npm run handoff -- ${episode}\` 로 다시 만든다.
> Antigravity 같은 에이전트에게 **이 파일을 읽고 그대로 진행해 달라**고 하면 된다. 작업 폴더는 저장소 루트(\`D:\\youtube\`)다.

## 할 일

1. **그림 ${todoImages.length}장**을 만들어 정해진 경로에 저장한다 (전체 ${images.jobs.length}장 중 남은 것).
2. **음성 ${todoVoice.length}컷**을 만들어 정해진 경로에 저장한다 (전체 ${voice.jobs.length}컷 중 남은 것).
3. 아래 **조립** 명령으로 영상을 만든다.

대본 · 목소리 · 화풍은 이미 정해져 있다. **바꾸지 말고 그대로 만든다.**

## 1. 그림

작업 목록: [\`jobs/images.json\`](jobs/images.json). 사람이 읽는 판은 [\`GEMINI_PROMPTS.md\`](GEMINI_PROMPTS.md).

\`jobs\` 배열을 **위에서부터 차례대로** 처리한다. 한 건의 뜻:

| 필드 | 뜻 |
|---|---|
| \`prompt\` | 이미지 모델에 **그대로** 넣는 글. 고치거나 줄이지 않는다 |
| \`attach\` | 프롬프트와 함께 첨부하는 그림 (순서대로). 첫째는 화풍 앵커, 둘째는 같은 사람 유지용 기준 그림 |
| \`aspect\` | 가로세로 비율 |
| \`save\` | 결과를 저장할 경로 (저장소 루트 기준, PNG) |
| \`done\` | \`true\` 면 이미 있으니 건너뛴다 |
| \`optional\` | \`true\` 면 없어도 영상이 나온다 (입 움직임 같은 추가 동작) |

규칙:

- **순서를 지킨다.** \`attach\` 의 둘째 그림이 아직 없으면 그 그림부터 만든다 (예: \`granny/normal\` → 나머지 할머니 그림 → \`granny/yell-b\`).
- **초록 배경(\`green: true\`)은 그대로 둔다.** 배경 제거 · 자르기 · 크기 조절을 하지 않는다. \`npm run art\` 가 한다.
- **글자 · 숫자 · 로고를 그리지 않는다.** 간판과 가격표는 빈 모양이다. 글자는 영상 코드가 얹는다.
- 한 사람(할머니)의 그림은 한 대화에서 이어서 만든다. 대화가 길어지면 화풍이 흐려지니 배경 · 장면은 새 대화에서 시작한다.
- 결과를 눈으로 확인한다: 몸이 잘리지 않았는지, 기준 그림과 같은 사람인지, 글자가 들어가지 않았는지. 틀리면 \`GEMINI_PROMPTS.md\` 의 "다시 뽑을 때 이어서 보내는 문장"을 쓴다.
- Gemini API 키가 저장소 루트 \`.env\` 에 있으면 명령 한 줄로도 된다: \`cd video && node scripts/artgen.mjs ${episode}\` (없는 그림만 만든다. \`--list\` 를 붙이면 목록만 본다).

| | 그림 | 종류 | 비율 | 저장 |
|---|---|---|---|---|
${images.jobs.map((j) => `| ${j.done ? "✅" : j.optional ? "➕" : "⬜"} | ${j.title} | ${KIND[j.kind] ?? j.kind} | ${j.aspect ?? "기준 그림과 같게"} | \`${j.save}\` |`).join("\n")}

✅ 있음 · ⬜ 만들어야 함 · ➕ 없어도 됨(있으면 더 움직인다)

## 2. 음성

작업 목록: [\`jobs/voice.json\`](jobs/voice.json). 사람이 붙여넣기 좋은 판은 \`video/out/${episode}/voice-studio.html\`.

- 도구: ${voice.engine}. 목소리는 고정이다 (\`video/VOICE.md\`): ${voices.map((sp) => `${sp.who} = **${sp.voice}**`).join(", ")}.
- **컷 하나에 파일 하나.** 그 컷의 대사를 \`lines\` 순서대로 한 번에 읽힌다.
- 컷마다 \`speakers\` 에 적힌 대로 목소리를 고른다. 한 번에 두 목소리까지라, **할머니가 나오는 컷은 Speaker 1 이나 2 자리에 할머니 목소리가 들어간다** (컷마다 다르니 꼭 \`speakers\` 를 본다).
- \`lines[].text\` 를 **그대로** 읽힌다 (숫자는 이미 한글로 풀어 놓았다). \`lines[].style\` 은 그 줄의 말투 지시다.
- **줄과 줄 사이에 1초쯤 쉰다.** 줄 안에서는 길게 쉬지 않는다. 자르는 도구가 쉬는 곳을 찾아 줄마다 나눈다.
- 화자 이름("Speaker 1")을 소리 내어 읽지 않게 한다.
- 형식: ${voice.format}
- 저장: \`save\` 경로 (예: \`video/voice-studio/${episode}/c00.wav\`).
- Gemini API 키가 저장소 루트 \`.env\` 에 있으면 명령 한 줄로도 된다: \`cd video && npm run voice -- ${episode} gen\` (대사가 바뀐 컷만 만든다).

| | 컷 | 줄 | 목소리 | 저장 |
|---|---|---|---|---|
${voice.jobs.map((j) => `| ${j.done ? "✅" : "⬜"} | ${j.cut} | ${j.lines.length} | ${j.speakers.map((sp) => `${sp.speaker} = ${sp.voice}`).join(" · ")} | \`${j.save}\` |`).join("\n")}

## 3. 조립

\`\`\`bash
cd video
npm run art -- ${episode}             # 그림: 배경 제거 · 자르기 · 빠진 그림 목록
npm run voice -- ${episode} split     # 음성: 컷 파일을 대사 줄마다 자르고 타이밍을 맞춘다
npm run make -- ${episode}            # 영상 + 한글 · 영어 자막 → video/out/${episode}/
\`\`\`

- \`npm run art\` 가 "⚠" 를 내면 그 그림을 다시 만든다 (배경을 못 지움, 가장자리에 닿음 등).
- \`npm run voice … split\` 이 "⚠ 줄 경계가 애매하다"를 내면 그 컷의 줄 길이가 대사와 맞는지 본다. 안 맞으면 그 컷 음성을 다시 만든다.
- 일부만 넣고 돌려도 된다. 없는 그림은 점선 상자로, 없는 음성은 임시 음성으로 나온다.

## 하지 말 것

- \`video/src/${episode}/script.json\` 의 대사, \`video/src/voice.json\` 의 목소리, 프롬프트의 화풍 문장을 바꾸지 않는다.
- 이미 있는 그림(✅)과 다른 편의 파일을 덮어쓰지 않는다.
- 커밋 · 푸시 · 유튜브 업로드를 하지 않는다.
- 끝나면 만든 파일 목록과, 못 만들었거나 마음에 걸리는 그림 · 컷을 알려 준다.
`;
writeFileSync(join(ROOT, dir, "ANTIGRAVITY.md"), md);
console.log(`${dir}/ANTIGRAVITY.md — 그림 ${todoImages.length}장, 음성 ${todoVoice.length}컷`);
