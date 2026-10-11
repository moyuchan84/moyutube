// art.json → Gemini 프롬프트 문서.
//   공통(가족·집)  → art/common/GEMINI_PROMPTS.md
//   편별           → episodes/NN-…/GEMINI_PROMPTS.md
// 사용: node scripts/prompts.mjs          (전부)
//       node scripts/prompts.mjs ep01     (공통 + 1편)
// 문구를 고치려면 이 파일이나 src/art-common.json · src/epNN/art.json 을 고친 뒤 다시 실행한다.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ANCHOR, ROOT, common, episodeDir, findRaw, listEpisodes, loadEpisode, rawRel, refOf } from "./art-lib.mjs";

const STYLE =
  "Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.";
const MATCH =
  "Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.";
const SAME =
  "The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.";
const GREEN =
  "Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.";
const MARKS = "Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.";

const KIND = {
  char: {
    label: "캐릭터 (전신, 초록 배경)",
    ratio: "2:3 세로",
    lead: "This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.",
    frame: "Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.",
    green: true,
  },
  cutin: {
    label: "리액션 컷인 (가슴 위, 초록 배경)",
    ratio: "1:1",
    lead: "This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.",
    frame: "Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.",
    green: true,
  },
  prop: {
    label: "소품 (초록 배경)",
    ratio: "1:1",
    lead: "This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.",
    frame: "The whole subject visible with a small empty margin on every side, not cropped, centered.",
    green: true,
  },
  bg: {
    label: "배경 (사람 없음)",
    ratio: "16:9",
    lead: "Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.",
    frame:
      "Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.",
    green: false,
  },
  full: {
    label: "한 장짜리 장면 (16:9 완성 그림)",
    ratio: "16:9",
    lead: "This is one complete illustrated scene for an explainer video, composed like a single manga panel.",
    frame:
      "Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.",
    green: false,
  },
};

const promptOf = (item) => {
  const k = KIND[item.kind];
  const ref = refOf(item);
  const parts = [STYLE, k.lead, MATCH];
  if (ref) parts.push(SAME);
  if (item.who) parts.push(`Character: ${common.cast[item.who]}.`);
  parts.push(item.desc);
  if (item.kind === "char" || item.kind === "cutin") parts.push(MARKS);
  parts.push(item.ratio ? `${k.frame} Aspect ratio ${item.ratio}.` : k.frame);
  if (k.green) parts.push(GREEN);
  return parts.join("\n\n");
};

const block = (ep, item, n) => {
  const k = KIND[item.kind];
  if (!k) throw new Error(`${item.id}: kind '${item.kind}' 는 없습니다`);
  const ref = refOf(item);
  const attach = [`① \`${ANCHOR}\` (화풍 앵커)`];
  if (ref) attach.push(`② \`${rawRel(ep, ref)}\` (같은 사람 유지용 기준 그림)`);
  const done = findRaw(ep, item.id) ? " ✅" : "";
  const lines = [
    `#### ${n}. ${item.title}${done}`,
    `- 저장: \`${rawRel(ep, item.id)}\``,
    `- 첨부: ${attach.join(", ")}`,
    `- 종류 · 비율: ${k.label} · ${item.ratio ?? k.ratio}`,
  ];
  if (item.cuts) lines.push(`- 쓰이는 컷: ${item.cuts}`);
  if (item.note) lines.push(`- 메모: ${item.note}`);
  return `${lines.join("\n")}\n\n\`\`\`text\n${promptOf(item)}\n\`\`\`\n`;
};

const USAGE = `## 사용법

1. 위에서부터 **차례대로** 한 블록씩 Gemini에 붙여넣는다. 화풍 문장은 블록마다 이미 들어 있다.
2. 블록의 **첨부** 이미지를 같이 올린다. ①은 화풍 고정용 앵커, ②는 같은 사람 유지용 기준 그림이다 (순서 중요).
3. 결과는 **저장** 경로와 이름 그대로 넣는다. 배경 제거·자르기·크기 조절은 하지 않는다 (\`npm run art\` 가 한다).
4. 한 사람은 **한 대화창**에서 끝내고, 다음 사람·배경은 새 대화창에서 시작한다. 대화가 길어지면 화풍이 흐려진다.
5. 글자는 그리지 않는다. 자막·간판·연도는 영상 코드가 얹는다.
6. 제목 옆 ✅ 는 이미 파일이 있다는 뜻이다 (\`npm run prompts\` 를 다시 돌리면 갱신된다).

### 다시 뽑을 때 이어서 보내는 문장

| 문제 | 문장 |
|---|---|
| 배경이 단색 초록이 아님 | \`Redo it with a perfectly flat pure green #00FF00 background, no shadow, no floor.\` |
| 몸이 잘림 | \`Zoom out so the whole body fits with empty margin on every side.\` |
| 다른 사람처럼 나옴 | \`Keep the exact same face, hair and clothes as attached image 2. Only change the pose.\` |
| 글자가 들어감 | \`Remove all text and letters; leave signs blank.\` |
| 화풍이 순해짐 | \`More grotesque gag-manga exaggeration, like the first attached image: bigger mouth, bulging eyes, more sweat.\` |
| 배경에 사람이 있음 | \`Remove every person. Background only.\` |
`;

const write = (rel, text) => {
  const path = join(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log(rel);
};

const countDone = (ep, items) => items.filter((item) => findRaw(ep, item.id)).length;

const writeCommon = () => {
  const items = common.items;
  const body = items.map((item, i) => block(null, item, i + 1)).join("\n");
  write(
    "art/common/GEMINI_PROMPTS.md",
    `# Gemini 프롬프트 — ${common.title}

> \`video/scripts/prompts.mjs\` 가 만든 파일이다. 직접 고치지 말고 \`video/src/art-common.json\` 을 고친 뒤 \`npm run prompts\` 를 다시 실행한다.
> 모든 편이 같이 쓰는 그림이다. **한 번만 만들면 된다.** 진행: ${countDone(null, items)} / ${items.length}

${USAGE}
---

${body}`,
  );
};

const writeEpisode = (ep) => {
  const art = loadEpisode(ep);
  const dir = episodeDir(ep);
  const used = (art.common ?? []).map((id) => {
    const item = common.items.find((c) => c.id === id);
    if (!item) throw new Error(`${ep}: 공통 그림 '${id}' 는 art-common.json 에 없습니다`);
    return `| ${findRaw(null, id) ? "✅" : "⬜"} | ${item.title} | \`${rawRel(null, id)}\` |`;
  });
  const body = art.items.map((item, i) => block(ep, item, i + 1)).join("\n");
  write(
    `${dir}/GEMINI_PROMPTS.md`,
    `# Gemini 프롬프트 — ${art.title}

> \`video/scripts/prompts.mjs\` 가 만든 파일이다. 직접 고치지 말고 \`video/src/${ep}/art.json\` 을 고친 뒤 \`npm run prompts\` 를 다시 실행한다.
> 이 편에만 쓰는 그림 ${art.items.length}장. 진행: ${countDone(ep, art.items)} / ${art.items.length}
> 다 넣었으면 \`video/\` 에서 \`npm run make -- ${ep}\` → \`video/out/${ep}/${ep}.mp4\`

${USAGE}
---

## 0. 먼저 — 공통 그림 (가족 · 집)

아래는 이 편이 쓰는 공통 그림이다. 프롬프트는 [art/common/GEMINI_PROMPTS.md](../../art/common/GEMINI_PROMPTS.md)에 있고, 다른 편에서 이미 만들었으면 건너뛴다.

| | 그림 | 파일 |
|---|---|---|
${used.join("\n")}

---

## 1. 이 편의 그림

${body}`,
  );
};

const only = process.argv[2];
writeCommon();
for (const ep of only ? [only] : listEpisodes()) writeEpisode(ep);
