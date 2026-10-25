// art.json → Gemini 프롬프트 문서.
//   공통(가족·집)  → content/_common/prompts/GEMINI_PROMPTS.md
//   편별           → content/<편>/prompts/GEMINI_PROMPTS.md · prompts/jobs/images.json
// 사용: node scripts/prompts.mjs          (전부)
//       node scripts/prompts.mjs ep01     (공통 + 1편)
// 문구를 고치려면 이 파일이나 content/_common/script/art.json · content/<편>/script/art.json 을 고친 뒤 다시 실행한다.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ANCHOR, ROOT, attachPlan, attachProblems, common, episodeDir, findRaw, listEpisodes, loadEpisode, rawRel } from "./art-lib.mjs";

const STYLE =
  "Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.";
// 사람 없는 소품: 얼굴 화풍 문단 대신 쓴다 (얼굴 앵커를 붙이면 Gemini 가 앵커 속 사람 위에 물건을 덧그린다 — 10화)
const PROP_STYLE =
  "Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.";
const PROP_MATCH =
  "Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.";
const MATCH =
  "Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.";
const SAME =
  "The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.";
const GREEN =
  "Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.";
const MARKS = "Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.";
// 영상에서 움직이는 그림: 그림마다 "어떻게 움직일지"를 알려 줘야 잘리지 않고, 움직여도 어색하지 않게 나온다
const MOTION = {
  char: "The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.",
  prop: "The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.",
  flat: "The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.",
};
const SAME_FRAME =
  "This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.";

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
  talk: {
    label: "말하는 그림 (두 번째 프레임, 초록 배경)",
    ratio: "기준 그림과 같게",
    lead: "This is a character cutout for a 2D animated video.",
    frame: "Same aspect ratio, framing and margins as attached image 2.",
    green: true,
    second: true,
  },
  layer: {
    label: "앞쪽 레이어 (배우를 가리는 물건, 초록 배경)",
    ratio: "16:9",
    lead: "This is a foreground layer for a 2D animated video: one wide object seen straight-on from the front, which will be placed IN FRONT of the characters so that they appear to stand behind it. No people.",
    frame: "The object spans most of the picture width and sits in the lower half; everything above and around it is empty. The whole object visible, not cropped. 16:9 landscape.",
    green: true,
  },
  stage: {
    label: "무대 장면 (16:9, 주인공 없이 — 주인공은 따로 오려 넣는다)",
    ratio: "16:9",
    lead: "This is the stage for an animated scene, composed like a single manga panel. The main character is NOT in this picture: it is drawn separately and placed on top later, so leave the described spot empty.",
    frame:
      "Leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.",
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

const castOf = (who, cast) => cast[who] ?? common.cast[who];
const nameOf = (who, cast) => /^(the [^:]+):/i.exec(castOf(who, cast) ?? "")?.[1] ?? `the ${who}`;
const planOf = (ep, item, cast = {}) => attachPlan(ep, item, cast, { second: Boolean(KIND[item.kind]?.second) });

const promptOf = (ep, item, cast = {}) => {
  const k = KIND[item.kind];
  const plan = planOf(ep, item, cast);
  const propOnly = plan[0].role === "prop-anchor";
  const parts = [propOnly ? PROP_STYLE : STYLE, k.lead, propOnly ? PROP_MATCH : MATCH];
  if (plan.some((a) => a.role === "frame")) parts.push(SAME_FRAME);
  else if (plan.some((a) => a.role === "ref")) parts.push(SAME);
  // 자동으로 붙는 기준 그림은 번호로 누가 누군지 알려 준다
  plan.forEach((a, i) => {
    if (a.role === "person") parts.push(`Attached image ${i + 1} shows ${nameOf(a.who, cast)}: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.`);
    if (a.role === "person-cutin") parts.push(`Attached image ${i + 1} is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.`);
    if (a.role === "prev") parts.push(`Attached image ${i + 1} is the frame just before this one: continue smoothly from it, with the same face, colors and line work.`);
  });
  const who = item.who ? castOf(item.who, cast) : null;
  if (item.who && !who) throw new Error(`${item.id}: who '${item.who}' 의 생김새(cast)가 없습니다`);
  if (who) parts.push(`Character: ${who}.`);
  for (const other of item.people ?? []) {
    if (other === item.who) continue;
    const d = castOf(other, cast);
    if (!d) throw new Error(`${item.id}: people '${other}' 의 생김새(cast)가 없습니다`);
    parts.push(`Also in the picture: ${d}.`);
  }
  parts.push(item.desc);
  if (item.kind === "char" || item.kind === "cutin") parts.push(MARKS);
  const motion = item.kind === "char" ? MOTION.char : item.kind === "prop" ? MOTION.prop : !k.green ? MOTION.flat : null;
  if (motion) parts.push(motion);
  if (item.moves) parts.push(`In the video this picture moves like this: ${item.moves}`);
  parts.push(item.ratio ? `${k.frame} Aspect ratio ${item.ratio}.` : k.frame);
  if (k.green) parts.push(GREEN);
  return parts.join("\n\n");
};

const block = (ep, item, n, cast) => {
  const k = KIND[item.kind];
  if (!k) throw new Error(`${item.id}: kind '${item.kind}' 는 없습니다`);
  const attach = planOf(ep, item, cast).map((a, i) => `${"①②③④⑤⑥⑦⑧"[i]} \`${a.path}\` (${a.label})`);
  const problems = attachProblems(ep, item, cast ?? {});
  const done = findRaw(ep, item.id) ? " ✅" : "";
  const lines = [
    `#### ${n}. ${item.title}${done}`,
    `- 저장: \`${rawRel(ep, item.id)}\``,
    `- 첨부 ${attach.length}장 (빠짐없이, 이 순서로): ${attach.join(", ")}`,
    ...problems.map((p) => `- ⚠️ ${p}`),
    `- 종류 · 비율: ${k.label} · ${item.ratio ?? k.ratio}`,
  ];
  if (item.cuts) lines.push(`- 쓰이는 컷: ${item.cuts}`);
  if (item.motion) lines.push(`- 영상에서의 움직임: ${item.motion}`);
  if (item.optional) lines.push("- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.");
  if (item.note) lines.push(`- 메모: ${item.note}`);
  return `${lines.join("\n")}\n\n\`\`\`text\n${promptOf(ep, item, cast ?? {})}\n\`\`\`\n`;
};

const USAGE = `## 사용법

1. 위에서부터 **차례대로** 한 블록씩 Gemini에 붙여넣는다. 화풍 문장은 블록마다 이미 들어 있다.
2. 블록의 **첨부** 이미지를 **빠짐없이, 적힌 순서대로** 같이 올린다 (프롬프트가 "attached image 2" 처럼 번호로 부른다). 첨부 목록은 \`art-lib.mjs\` 의 \`attachPlan\` 이 정한다 — 손으로 빼거나 바꾸지 않는다. 첨부가 하나라도 실패하면 글자만 보내지 말고 멈춘다. 규칙 전체는 \`qna/ART_GUIDE.md\`.
   ⚠️ 줄이 있는 블록은 기준 그림이 빠졌거나 아직 없는 것이다 — 그것부터 고친다.
3. 결과는 **저장** 경로와 이름 그대로 넣는다. 배경 제거·자르기·크기 조절은 하지 않는다 (\`npm run art\` 가 한다).
4. 한 사람은 **한 대화창**에서 끝내고, 다음 사람·배경은 새 대화창에서 시작한다. 대화가 길어지면 화풍이 흐려진다.
5. 글자는 그리지 않는다. 자막·간판·연도는 영상 코드가 얹는다.
6. 제목 옆 ✅ 는 이미 파일이 있다는 뜻이다 (\`npm run prompts\` 를 다시 돌리면 갱신된다).
7. **말하는 그림**(이름이 \`-b\` 로 끝나는 것)은 첫 번째 프레임을 ②로 첨부해 "입만 바꿔 다시 그리기"로 만든다. 두 장의 크기와 자리가 같아야 입만 움직여 보인다.

### 다시 뽑을 때 이어서 보내는 문장

| 문제 | 문장 |
|---|---|
| 배경이 단색 초록이 아님 | \`Redo it with a perfectly flat pure green #00FF00 background, no shadow, no floor.\` |
| 몸이 잘림 | \`Zoom out so the whole body fits with empty margin on every side.\` |
| 다른 사람처럼 나옴 | \`Keep the exact same face, hair and clothes as attached image 2. Only change the pose.\` |
| 글자가 들어감 | \`Remove all text and letters; leave signs blank.\` |
| 화풍이 순해짐 | \`More grotesque gag-manga exaggeration, like the first attached image: bigger mouth, bulging eyes, more sweat.\` |
| 배경에 사람이 있음 | \`Remove every person. Background only.\` |
| 말하는 그림의 몸이 달라짐 | \`Too different. Copy attached image 2 exactly and change only the mouth.\` |
| 무대 장면에 주인공이 있음 | \`Remove the main character and leave that spot empty; it is added later as a separate cutout.\` |
`;

const write = (rel, text) => {
  const path = join(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log(rel);
};

const countDone = (ep, items) => items.filter((item) => findRaw(ep, item.id)).length;

// 다른 도구(Antigravity · scripts/artgen.mjs)에 넘기는 그림 작업 한 건
const jobOf = (ep, item, cast) => {
  const k = KIND[item.kind];
  const plan = planOf(ep, item, cast ?? {});
  return {
    id: item.id,
    title: item.title,
    kind: item.kind,
    save: rawRel(ep, item.id),
    attach: plan.map((a) => a.path),
    attachLabels: plan.map((a) => a.label),
    problems: attachProblems(ep, item, cast ?? {}),
    aspect: (item.ratio ?? k.ratio).match(/\d+:\d+/)?.[0] ?? null,
    green: k.green,
    optional: Boolean(item.optional),
    done: Boolean(findRaw(ep, item.id)),
    prompt: promptOf(ep, item, cast ?? {}),
  };
};

const writeCommon = () => {
  const items = common.items;
  const body = items.map((item, i) => block(null, item, i + 1)).join("\n");
  write(
    "content/_common/prompts/GEMINI_PROMPTS.md",
    `# Gemini 프롬프트 — ${common.title}

> \`video/scripts/prompts.mjs\` 가 만든 파일이다. 직접 고치지 말고 \`content/_common/script/art.json\` 을 고친 뒤 \`npm run prompts\` 를 다시 실행한다.
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
    if (!item) throw new Error(`${ep}: 공통 그림 '${id}' 는 content/_common/script/art.json 에 없습니다`);
    return `| ${findRaw(null, id) ? "✅" : "⬜"} | ${item.title} | \`${rawRel(null, id)}\` |`;
  });
  // 이미 있는 그림은 표로만 남기고, 아직 없는 그림만 프롬프트 전문을 싣는다 (번호는 art.json 순서 그대로)
  const numbered = art.items.map((item, i) => ({ item, n: i + 1, done: Boolean(findRaw(ep, item.id)) }));
  const todo = numbered.filter((x) => !x.done);
  const done = numbered.filter((x) => x.done);
  const body = todo.length
    ? todo.map(({ item, n }) => block(ep, item, n, art.cast)).join("\n")
    : `남은 그림이 없다. \`npm run art -- ${ep}\` 로 처리하고 다음 단계로 넘어간다.\n`;
  const doneTable = done.length
    ? `| # | 그림 | 파일 |\n|---|---|---|\n${done.map(({ item, n }) => `| ${n} | ${item.title} | \`${rawRel(ep, item.id)}\` |`).join("\n")}\n`
    : "아직 없다.\n";
  const jobs = [
    ...(art.common ?? []).map((id) => jobOf(null, common.items.find((c) => c.id === id))),
    ...art.items.map((item) => jobOf(ep, item, art.cast)),
  ];
  write(`${dir}/prompts/jobs/images.json`, `${JSON.stringify({ episode: ep, title: art.title, anchor: ANCHOR, jobs }, null, 2)}\n`);
  write(
    `${dir}/prompts/GEMINI_PROMPTS.md`,
    `# Gemini 프롬프트 — ${art.title}

> \`video/scripts/prompts.mjs\` 가 만든 파일이다. 직접 고치지 말고 \`${dir}/script/art.json\` 을 고친 뒤 \`npm run prompts\` 를 다시 실행한다.
> 이 편에만 쓰는 그림 ${art.items.length}장. 진행: ${countDone(ep, art.items)} / ${art.items.length}
> 다 넣었으면 \`video/\` 에서 \`npm run make -- ${ep}\` → \`video/out/${ep}/${ep}.mp4\`

${USAGE}
---

## 0. 먼저 — 공통 그림 (가족 · 집)

아래는 이 편이 쓰는 공통 그림이다. 프롬프트는 [_common/prompts/GEMINI_PROMPTS.md](../../_common/prompts/GEMINI_PROMPTS.md)에 있고, 다른 편에서 이미 만들었으면 건너뛴다.

| | 그림 | 파일 |
|---|---|---|
${used.join("\n")}

---

## 1. 아직 없는 그림 — ${todo.length}장 (이것만 Gemini 에서 만든다)

${body}
---

## 2. 이미 있는 그림 — ${done.length}장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 \`_old/\` 로 옮긴 뒤 \`npm run prompts -- ${ep}\` 를 다시 실행하면 위 목록으로 돌아온다.

${doneTable}`,
  );
};

const only = process.argv[2];
writeCommon();
for (const ep of only ? [only] : listEpisodes()) writeEpisode(ep);
