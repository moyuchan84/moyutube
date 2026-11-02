# Gemini 프롬프트 — 내모남불 ⑦ 군대편 · 작업 · 청소 · 휴가 · 행군

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/nm07-army/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 31장. 진행: 0 / 31
> 다 넣었으면 `video/` 에서 `npm run make -- nm07` → `video/out/nm07/nm07.mp4`

## 사용법

1. 위에서부터 **차례대로** 한 블록씩 Gemini에 붙여넣는다. 화풍 문장은 블록마다 이미 들어 있다.
2. 블록의 **첨부** 이미지를 **빠짐없이, 적힌 순서대로** 같이 올린다 (프롬프트가 "attached image 2" 처럼 번호로 부른다). 첨부 목록은 `art-lib.mjs` 의 `attachPlan` 이 정한다 — 손으로 빼거나 바꾸지 않는다. 첨부가 하나라도 실패하면 글자만 보내지 말고 멈춘다. 규칙 전체는 `qna/ART_GUIDE.md`.
   ⚠️ 줄이 있는 블록은 기준 그림이 빠졌거나 아직 없는 것이다 — 그것부터 고친다.
3. 결과는 **저장** 경로와 이름 그대로 넣는다. 배경 제거·자르기·크기 조절은 하지 않는다 (`npm run art` 가 한다).
4. 한 사람은 **한 대화창**에서 끝내고, 다음 사람·배경은 새 대화창에서 시작한다. 대화가 길어지면 화풍이 흐려진다.
5. 글자는 그리지 않는다. 자막·간판·연도는 영상 코드가 얹는다.
6. 제목 옆 ✅ 는 이미 파일이 있다는 뜻이다 (`npm run prompts` 를 다시 돌리면 갱신된다).
7. **말하는 그림**(이름이 `-b` 로 끝나는 것)은 첫 번째 프레임을 ②로 첨부해 "입만 바꿔 다시 그리기"로 만든다. 두 장의 크기와 자리가 같아야 입만 움직여 보인다.

### 다시 뽑을 때 이어서 보내는 문장

| 문제 | 문장 |
|---|---|
| 배경이 단색 초록이 아님 | `Redo it with a perfectly flat pure green #00FF00 background, no shadow, no floor.` |
| 몸이 잘림 | `Zoom out so the whole body fits with empty margin on every side.` |
| 다른 사람처럼 나옴 | `Keep the exact same face, hair and clothes as attached image 2. Only change the pose.` |
| 글자가 들어감 | `Remove all text and letters; leave signs blank.` |
| 화풍이 순해짐 | `More grotesque gag-manga exaggeration, like the first attached image: bigger mouth, bulging eyes, more sweat.` |
| 배경에 사람이 있음 | `Remove every person. Background only.` |
| 말하는 그림의 몸이 달라짐 | `Too different. Copy attached image 2 exactly and change only the mouth.` |
| 무대 장면에 주인공이 있음 | `Remove the main character and leave that spot empty; it is added later as a separate cutout.` |

---

## 0. 먼저 — 공통 그림 (가족 · 집)

아래는 이 편이 쓰는 공통 그림이다. 프롬프트는 [_common/prompts/GEMINI_PROMPTS.md](../../_common/prompts/GEMINI_PROMPTS.md)에 있고, 다른 편에서 이미 만들었으면 건너뛴다.

| | 그림 | 파일 |
|---|---|---|
| ✅ | 아빠 — 기본 | `content/_common/art/dad/normal.png` |
| ✅ | 아빠 — 당황 | `content/_common/art/dad/panic.png` |
| ✅ | 아빠 — 뿌듯 | `content/_common/art/dad/proud.png` |
| ✅ | 아빠 — 충격 | `content/_common/art/dad/shock.png` |
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 아이 — 질문 | `content/_common/art/kid/ask.png` |
| ✅ | 아이 — 의심 | `content/_common/art/kid/doubt.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `content/_common/art/mom/smirk.png` |
| ✅ | 엄마 — 한숨 (이마 짚기) | `content/_common/art/mom/sigh.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 컷인 — 아빠 당황 | `content/_common/art/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `content/_common/art/cutin/kid-doubt.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |
| ✅ | 컷인 — 엄마 어이없음 | `content/_common/art/cutin/mom-sigh.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `content/_common/art/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `content/_common/art/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `content/_common/art/cutin/dad-sig-3.png` |

---

## 1. 아직 없는 그림 — 31장 (이것만 Gemini 에서 만든다)

#### 1. 사촌 형 — 기본 (휴가 나온 일병)
- 저장: `content/nm07-army/art/cousin/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c00b, c02c, c03c, c04b, c05c, c07, c09
- 영상에서의 움직임: 숨 쉬듯 살짝, 말할 때 까딱.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the cousin: a 21-year-old Korean young man, very short neat buzz-cut black hair, clean-shaven smooth face, calm narrow eyes, slim build; wearing a neat modern pixel-pattern camouflage army uniform with the sleeves rolled down, two simple short horizontal stripes on the chest as a rank mark, black combat boots; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; polite, calm and completely deadpan.

3/4 view turned slightly to the LEFT. Standing upright and relaxed with his hands loosely at his sides, a calm polite expression, the faintest small smile, eyes looking at the viewer.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 2. 이등병 아빠 — 기본 (20년 전, 겁먹은 신병)
- 저장: `content/nm07-army/art/dadyoung/normal.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (지금 아빠 — 같은 사람을 20년 젊게)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00a, c02, c03, c04
- 영상에서의 움직임: 움찔움찔 떤다.
- 메모: 지금 아빠와 같은 얼굴인지 dad/normal 과 나란히 비교한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

3/4 view turned slightly to the RIGHT. Standing stiffly at nervous attention, shoulders hunched, big worried puppy eyes, a tiny wobbly frown, one bead of sweat on his temple. One simple short stripe on the chest (lowest rank).

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 병장 아빠 — 기본 (2년 뒤, 느긋한 고참)
- 저장: `content/nm07-army/art/dadyoung/sergeant.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00a, c02b, c03a, c03b, c04a, c05a, c05b
- 영상에서의 움직임: 부채를 천천히 부친다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

3/4 view turned slightly to the LEFT. As a SERGEANT now: soft cap tilted back at a cocky angle, sleeves rolled up, four simple short stripes on the chest, a relaxed slouch and a smug half-lidded grin, leaning back with one hand on his hip and the other lazily waving a round paper hand fan, eyebrows raised as if giving a lecture. The SAME face as the attached young private, just more confident.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 병장 아빠 — 창틀 손가락 검사
- 저장: `content/nm07-army/art/dadyoung/finger.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/sergeant.png` (앞 컷 · 기준 그림), ③ `content/nm07-army/art/dadyoung/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03a
- 영상에서의 움직임: 손가락을 쓱 들어 올린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Facing slightly to the RIGHT. As a SERGEANT now: soft cap tilted back at a cocky angle, sleeves rolled up, four simple short stripes on the chest, a relaxed slouch and a smug half-lidded grin. Holding up one index finger right in front of his face with a tiny gray smudge of dust on the fingertip, squinting at it with exaggerated disappointment, the other hand behind his back.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 5. 이등병 아빠 — 군장 두 개 메고 헉헉
- 저장: `content/nm07-army/art/dadyoung/march.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c05
- 영상에서의 움직임: 비틀비틀 걷는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Side 3/4 view walking to the RIGHT. Bent forward under TWO huge stacked olive army backpacks, a helmet slightly crooked on his head, red puffing cheeks, sweat flying, eyes spiraling with exhaustion, mouth muttering. One simple short stripe on the chest. No weapons.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 왕고참 — 기본 (그늘에서 부채질)
- 저장: `content/nm07-army/art/oldsgt/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c02a, c03a
- 영상에서의 움직임: 부채질하며 하품.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the old sergeant: a big, heavy-set Korean young man about 22 years old, buzz-cut hair under a soft cap pushed back, sleepy half-closed eyes, a smug lazy grin; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with the sleeves rolled up and four simple short stripes on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; lazy and smug, never scary, never violent.

3/4 view turned slightly to the LEFT. Sitting back lazily on an upturned wooden crate, legs spread, waving a round paper hand fan at his own face, a smug sleepy grin, one eye half-open.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 신병 — 기본 (조심조심)
- 저장: `content/nm07-army/art/rookie/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03b, c04a, c05a
- 영상에서의 움직임: 작게 움찔.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the rookie: a skinny Korean young man about 20 years old, buzz-cut hair, huge nervous round eyes, big ears, a thin neck; wearing an oversized old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with one simple short stripe on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; earnest, timid and polite.

3/4 view turned slightly to the RIGHT. Standing very straight with his hands pressed to his sides, huge nervous round eyes, lips pressed together, one sweat drop, leaning slightly forward as if about to ask something very carefully.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 사촌 형 — 집게로 고기 굽기
- 저장: `content/nm07-army/art/cousin/grill.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/cousin/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/cousin/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c01, c03d, c07a
- 영상에서의 움직임: 고기를 뒤집는다.
- 메모: 배경 bg/bbq 위에 얹는다. 아빠가 떠드는 동안 내내 이 사람이 굽는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the cousin: a 21-year-old Korean young man, very short neat buzz-cut black hair, clean-shaven smooth face, calm narrow eyes, slim build; wearing a neat modern pixel-pattern camouflage army uniform with the sleeves rolled down, two simple short horizontal stripes on the chest as a rank mark, black combat boots; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; polite, calm and completely deadpan.

Waist-up, 3/4 view turned slightly to the LEFT. Seated, holding metal tongs in one hand and flipping a strip of pork belly on a small round grill in front of him, calm focused face, sleeves neat. Steam rising from the grill.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 배경 — 토요일 저녁 고깃집 테이블
- 저장: `content/nm07-army/art/bg/bbq.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00, c00b, c01, c02c, c03c, c03d, c04b, c05c, c06, c07, c07a, c08, c09
- 영상에서의 움직임: 불판 연기가 피어오른다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cozy Korean barbecue restaurant at night seen straight-on like a sitcom set: a low wooden table in the center with a round charcoal grill, small side-dish plates, lettuce baskets, steel cups, a silver exhaust hood hanging above the grill, warm orange lights, a few blurred other tables in the background. No people, no text, no signs.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 배경 — 옛 침상형 생활관 (20년 전)
- 저장: `content/nm07-army/art/bg/barracks-old.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00a, c03, c03a, c03b, c07
- 영상에서의 움직임: 살짝 바랜 색, 천천히 옆으로.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

An old-fashioned Korean army barracks room from about twenty years ago: a long raised wooden sleeping platform along the LEFT wall with neatly folded olive blankets in a row, gray metal lockers along the back wall, a wide window frame on the RIGHT, a fluorescent tube light on the ceiling, slightly faded warm colors. No people, no text, no flags, no weapons.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 배경 — 땡볕 작업장 (그늘 나무 하나)
- 저장: `content/nm07-army/art/bg/field-sun.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c02, c02a, c02b
- 영상에서의 움직임: 아지랑이가 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A dusty army work site under a blazing summer sun: dry dirt ground with a half-dug shallow trench in the center, a few shovels stuck in a dirt pile, one big leafy tree on the RIGHT casting a cool shady spot, heat haze shimmering, bright blue sky. No people, no text, no weapons.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 배경 — 흙길 행군
- 저장: `content/nm07-army/art/bg/march-road.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c05, c05a, c05b
- 영상에서의 움직임: 길이 앞으로 흘러간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A long dirt country road winding through green hills at late afternoon, rice fields on one side, a line of tall grass, dust in the air, orange evening sky. No people, no text, no vehicles, no weapons.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 배경 — 요즘 침대형 동기 생활관
- 저장: `content/nm07-army/art/bg/barracks-now.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c07, c07a
- 영상에서의 움직임: 밝게 반짝.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A bright modern Korean army barracks room: four neat single beds with gray blankets, a personal locker next to each bed, a small desk with a lamp, clean white walls, soft daylight from a window, tidy and calm. No people, no text, no flags, no weapons.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 아빠 컷인 — 라떼는 말이야 (먼 산 보며 회상)
- 저장: `content/nm07-army/art/cutin/dad-latte.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00, c07
- 영상에서의 움직임: 눈이 반짝이며 줌 인.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the RIGHT. Gazing dreamily up into the distance with sparkling nostalgic eyes, chin raised proudly, one hand raised as if telling an epic story, a big self-satisfied smile, a few nostalgic sparkles around his head.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 사촌 형 정색 컷인 (집게 든 채)
- 저장: `content/nm07-army/art/cutin/cousin-flat.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/cousin/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/cousin/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00b, c02c, c02d, c03c, c04b, c04c, c05c, c07, c07a, c09
- 영상에서의 움직임: 옆에서 쓱 들어와 멈춘다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the cousin: a 21-year-old Korean young man, very short neat buzz-cut black hair, clean-shaven smooth face, calm narrow eyes, slim build; wearing a neat modern pixel-pattern camouflage army uniform with the sleeves rolled down, two simple short horizontal stripes on the chest as a rank mark, black combat boots; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; polite, calm and completely deadpan.

Facing slightly to the LEFT. Perfectly deadpan: half-closed calm eyes, eyebrows level, mouth a small flat line, holding metal barbecue tongs upright beside his face like a pointer, one tiny anime glint in his eye.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 16. 이등병 아빠 컷인 — 이불 속 속삭임
- 저장: `content/nm07-army/art/cutin/dadyoung-whisper.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00a, c02a, c04
- 영상에서의 움직임: 이불 속에서 떤다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Facing slightly to the RIGHT. Hiding under an olive army blanket pulled up to his nose at night, only his worried eyes and buzz-cut head showing, eyes darting sideways, a tiny cold sweat drop, dim blue night light.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 병장 아빠 컷인 — 느긋한 웃음
- 저장: `content/nm07-army/art/cutin/dadyoung-smug.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/sergeant.png` (앞 컷 · 기준 그림), ③ `content/nm07-army/art/dadyoung/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00a, c02b, c04a, c05b
- 영상에서의 움직임: 고개를 까딱.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Facing slightly to the LEFT. As a SERGEANT now: soft cap tilted back at a cocky angle, sleeves rolled up, four simple short stripes on the chest, a relaxed slouch and a smug half-lidded grin. Chin up, eyes half-closed in total smug satisfaction, one corner of the mouth lifted, a round paper hand fan resting on his shoulder.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 18. R1 — 땡볕 삽질 이등병 아빠 + 그늘 왕고참
- 저장: `content/nm07-army/art/full/shovel-shade.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/normal.png` (같은 사람 유지용 기준 그림), ③ `content/nm07-army/art/oldsgt/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/oldsgt/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02, c02a
- 영상에서의 움직임: 왼쪽 땡볕 → 오른쪽 그늘로 카메라가 흐른다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the old sergeant: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Also in the picture: the old sergeant: a big, heavy-set Korean young man about 22 years old, buzz-cut hair under a soft cap pushed back, sleepy half-closed eyes, a smug lazy grin; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with the sleeves rolled up and four simple short stripes on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; lazy and smug, never scary, never violent.

Wide scene at a sun-baked dirt work site: on the LEFT the young private digging a trench with a shovel under the blazing sun, drenched in sweat, steam rising off his head; on the RIGHT in the cool shade of a big tree the old sergeant lounging on a wooden crate fanning himself with a round paper fan and pointing lazily at the private. Heat haze, comic sweat drops. No weapons, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 19. R1 — 같은 구도, 이번엔 그늘에 병장 아빠
- 저장: `content/nm07-army/art/full/sgt-dad-shade.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/dadyoung/sergeant.png` (앞 컷 · 기준 그림), ③ `content/nm07-army/art/dadyoung/normal.png` (그 사람 기준 그림 (normal)), ④ `content/nm07-army/art/rookie/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/rookie/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02b
- 영상에서의 움직임: 같은 카메라 움직임.
- 메모: full/shovel-shade 와 같은 구도로 — 반반 화면으로 나란히 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the rookie: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Also in the picture: the rookie: a skinny Korean young man about 20 years old, buzz-cut hair, huge nervous round eyes, big ears, a thin neck; wearing an oversized old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with one simple short stripe on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; earnest, timid and polite.

The SAME composition as a sun-baked work site: on the LEFT the rookie digging a trench under the blazing sun, drenched in sweat; on the RIGHT in the cool shade of a big tree the sergeant (the young man from the attached image, now a cocky sergeant) lounging on a wooden crate fanning himself with a round paper fan, pointing lazily. Heat haze, comic sweat drops. No weapons, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 20. R2 — 창틀 손가락 검사 (왕고참 + 이등병 아빠)
- 저장: `content/nm07-army/art/full/finger-dust.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/oldsgt/normal.png` (같은 사람 유지용 기준 그림), ③ `content/nm07-army/art/dadyoung/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/oldsgt/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03, c03a
- 영상에서의 움직임: 손가락에 줌.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the old sergeant: a big, heavy-set Korean young man about 22 years old, buzz-cut hair under a soft cap pushed back, sleepy half-closed eyes, a smug lazy grin; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with the sleeves rolled up and four simple short stripes on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; lazy and smug, never scary, never violent.

Also in the picture: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Inside an old army barracks by a window: the old sergeant running one finger along the window frame and holding it up with a tiny gray smudge of dust, eyebrows raised; beside him the young private standing stiffly at attention with a cleaning rag in hand, face frozen in horror. Comic shock lines. No weapons, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 21. R2 — 병장 아빠 관물대 라면 국물 (신병 당황)
- 저장: `content/nm07-army/art/full/locker-ramen.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/rookie/normal.png` (같은 사람 유지용 기준 그림), ③ `content/nm07-army/art/dadyoung/sergeant.png` (병장 아빠 (이 모습 그대로)), ④ `content/nm07-army/art/dadyoung/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/rookie/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03b
- 영상에서의 움직임: 관물대 문이 끼익 열린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 4 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the rookie: a skinny Korean young man about 20 years old, buzz-cut hair, huge nervous round eyes, big ears, a thin neck; wearing an oversized old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with one simple short stripe on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; earnest, timid and polite.

Also in the picture: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Inside an old army barracks: an open gray metal locker overflowing with a messy pile of instant-noodle cups, a dried orange ramen-soup stain dripping down the shelf; the rookie pointing at it with wide nervous eyes; next to him the sergeant (the young man from the attached sergeant image) calmly waving it off with a hand fan and a dreamy nostalgic smile. No weapons, no text, no brand names.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 22. R3 — 휴가 달력 앞 (신병 눈치 · 병장 아빠 벌써?!)
- 저장: `content/nm07-army/art/full/leave-calendar.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/rookie/normal.png` (같은 사람 유지용 기준 그림), ③ `content/nm07-army/art/dadyoung/sergeant.png` (병장 아빠 (이 모습 그대로)), ④ `content/nm07-army/art/dadyoung/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/rookie/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04a
- 영상에서의 움직임: 달력에 줌.
- 메모: 달력 숫자 · 표시는 코드로 그린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 4 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the rookie: a skinny Korean young man about 20 years old, buzz-cut hair, huge nervous round eyes, big ears, a thin neck; wearing an oversized old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with one simple short stripe on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; earnest, timid and polite.

Also in the picture: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

Inside an old army barracks in front of a big blank wall calendar with empty squares: the rookie holding up a small blank request form timidly with both hands; the sergeant (the young man from the attached sergeant image) recoiling dramatically with his mouth wide open in shock, hand fan dropping. Comic shock lines. The calendar has absolutely no numbers or writing. No weapons, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 23. R4 — 군장 두 개 멘 신병 + 빈손 병장 아빠
- 저장: `content/nm07-army/art/full/march-packs.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm07-army/art/rookie/normal.png` (같은 사람 유지용 기준 그림), ③ `content/nm07-army/art/dadyoung/sergeant.png` (병장 아빠 (이 모습 그대로)), ④ `content/nm07-army/art/dadyoung/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/rookie/normal.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/sergeant.png (그 그림부터 뽑는다)
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/dadyoung/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05a, c05b
- 영상에서의 움직임: 둘이 걸어가고, 신병만 비틀.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 4 shows the young private: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the rookie: a skinny Korean young man about 20 years old, buzz-cut hair, huge nervous round eyes, big ears, a thin neck; wearing an oversized old-style olive-green woodland camouflage army uniform and a matching soft patrol cap with one simple short stripe on the chest; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; earnest, timid and polite.

Also in the picture: the young private: the SAME man as the dad in the attached reference photo, but about twenty years younger, around 21 years old — same round face shape, same nose, same eyes and same eyebrows, chubby cheeks, a full head of very short buzz-cut black hair (not balding at all), no wrinkles, no beard; wearing a slightly baggy old-style olive-green woodland camouflage army uniform and a matching soft patrol cap; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons.

On a dusty country road at sunset: the rookie staggering under TWO huge stacked olive army backpacks, sweating, muttering; walking beside him the sergeant (the young man from the attached sergeant image) carrying nothing at all, hands clasped behind his head, whistling happily with a smug grin. Helmets only, absolutely no weapons, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 24. 반전 — 집게 든 아빠, 쌈 든 모라구, 정색 사촌 형, 엄마
- 저장: `content/nm07-army/art/full/bbq-tongs.png`
- 첨부 5장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/kid/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/nm07-army/art/cousin/normal.png` (같이 나오는 사람 기준 그림 (normal)), ⑤ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/nm07-army/art/cousin/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c09, c09a
- 영상에서의 움직임: 아빠 쪽으로 펀치 줌.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the cousin: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 5 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Also in the picture: the cousin: a 21-year-old Korean young man, very short neat buzz-cut black hair, clean-shaven smooth face, calm narrow eyes, slim build; wearing a neat modern pixel-pattern camouflage army uniform with the sleeves rolled down, two simple short horizontal stripes on the chest as a rank mark, black combat boots; absolutely NO text, NO letters, NO name tapes, NO patches, NO flags and NO logos anywhere; NO weapons; polite, calm and completely deadpan.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

At a cozy Korean barbecue restaurant table at night: the dad standing proudly holding metal tongs up like a commander's baton and pointing at the kid; the kid holding a lettuce wrap with both hands, looking puzzled; the cousin in uniform sitting with a perfectly deadpan face; the mom covering her mouth, eyes half-closed in disbelief. Grill smoke, warm light. No text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 25. 소품 — 라떼 컵 (라떼는… 반복 개그)
- 저장: `content/nm07-army/art/prop/latte.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00, c07
- 영상에서의 움직임: 구석에 뿅.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single cute take-out latte cup with a white lid and a small heart drawn in foam peeking through, a wisp of steam. No logos, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 26. 소품 — 삽
- 저장: `content/nm07-army/art/prop/shovel.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c02
- 영상에서의 움직임: 툭 꽂힌다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single old army-style shovel with a wooden handle and a dusty steel blade, a clump of dirt on it.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 27. 소품 — 둥근 부채
- 저장: `content/nm07-army/art/prop/fan.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c02a, c02b
- 영상에서의 움직임: 살랑살랑.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single round paper hand fan with a bamboo handle, plain pale yellow paper. No text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 28. 소품 — 구겨진 군용 양말
- 저장: `content/nm07-army/art/prop/socks.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00a
- 영상에서의 움직임: 툭 던져진다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A crumpled pair of plain dark olive army socks, slightly stinky with tiny comic stink lines.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 29. 소품 — 고기 집게
- 저장: `content/nm07-army/art/prop/tongs.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c08, c09
- 영상에서의 움직임: 번쩍 들어 올린다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single pair of shiny stainless-steel barbecue tongs.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 30. 소품 — 휴대폰
- 저장: `content/nm07-army/art/prop/phone.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c07a
- 영상에서의 움직임: 띵 진동.
- 메모: 화면은 비워 둔다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single plain black smartphone with a blank glowing screen. No logos, no text, no apps.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 31. 소품 — 군장 배낭
- 저장: `content/nm07-army/art/prop/backpack.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05
- 영상에서의 움직임: 쿵 떨어진다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single big olive-green army rucksack with straps and a rolled sleeping mat on top. No patches, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 0장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm07` 를 다시 실행하면 위 목록으로 돌아온다.

아직 없다.
