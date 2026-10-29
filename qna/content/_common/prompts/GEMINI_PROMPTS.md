# Gemini 프롬프트 — 공통 — 가족 캐릭터 · 집 배경

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/_common/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 모든 편이 같이 쓰는 그림이다. **한 번만 만들면 된다.** 진행: 66 / 112

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

#### 1. 아빠 — 기본 ✅
- 저장: `content/_common/art/dad/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 아빠의 기준 그림. 이후 아빠 그림에 전부 ②로 첨부한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view, body and face turned slightly to the LEFT. Standing relaxed, arms at his sides, a mild friendly smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 2. 아빠 — 당황 ✅
- 저장: `content/_common/art/dad/panic.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. He has just been asked a question he cannot answer: eyes darting sideways, forced crooked smile showing teeth, one hand rubbing the back of his neck, cold sweat drops flying off his forehead, knees slightly bent.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 아빠 — 설명 ✅
- 저장: `content/_common/art/dad/explain.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Explaining confidently: index finger raised high, chest puffed out, eyebrows up, mouth open mid-sentence, the other hand on his hip.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 아빠 — 생각 ✅
- 저장: `content/_common/art/dad/think.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Deep in thought: one hand on his chin, eyes looking up, lips pursed, one eyebrow raised.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 5. 아빠 — 뿌듯 ✅
- 저장: `content/_common/art/dad/proud.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Warm proud smile with closed crescent eyes, both hands on his hips, a small sparkle near his head.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 아빠 — 충격 ✅
- 저장: `content/_common/art/dad/shock.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Frozen in shock: eyes bulging out, jaw dropped showing teeth and tongue, hair standing on end, both hands up, shock lines close around his head.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 아빠 — 몰래 검색 ✅
- 저장: `content/_common/art/dad/search.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 편마다 나오는 '그날 밤 몰래 검색' 장면용.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Sneaking a search at night: hunched over and tiptoeing, holding a smartphone close to his face with both hands, the screen glow lighting his face from below, eyes wide and bloodshot, lips pressed tight, glancing nervously over his shoulder, cold sweat drops.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 아빠 — 설명 (말하는 그림) ✅
- 저장: `content/_common/art/dad/explain-b.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/explain.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: 설명 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change only the face and the raised hand: the mouth is now closed in a confident smile (as if between two words) and the raised index finger is tilted a few degrees forward.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 아이 — 기본 ✅
- 저장: `content/_common/art/kid/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 아이의 기준 그림. 이후 아이 그림에 전부 ②로 첨부한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view, body and face turned slightly to the RIGHT. Standing with hands behind the back, head tilted, a bright curious smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 10. 아이 — 질문 ✅
- 저장: `content/_common/art/kid/ask.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view turned slightly to the RIGHT. Asking a question: looking far up at a tall adult, one arm stretched up pointing with the index finger, mouth wide open mid-question, eyebrows raised.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 11. 아이 — 우와 ✅
- 저장: `content/_common/art/kid/wow.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view turned slightly to the RIGHT. Amazed: sparkling star-filled eyes, huge open-mouth grin, both fists clenched in front of the chest.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 12. 아이 — 의심 ✅
- 저장: `content/_common/art/kid/doubt.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view turned slightly to the RIGHT. Not buying it: arms crossed, eyes narrowed to suspicious slits, mouth a flat line pulled to one side, looking up sideways.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 13. 아이 — 웃음 ✅
- 저장: `content/_common/art/kid/laugh.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view turned slightly to the RIGHT. Laughing hard: eyes squeezed shut, mouth wide open showing the missing tooth, holding the belly with both hands.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 아이 — 질문 (말하는 그림) ✅
- 저장: `content/_common/art/kid/ask-b.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/ask.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: 질문 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change only the face: the mouth is now closed in a small pouty line (as if between two words) and the eyebrows are a little lower. The pointing arm stays exactly where it is.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 엄마 — 기본 ✅
- 저장: `content/_common/art/mom/normal.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/channel/profile.png` (채널 프로필 — 오른쪽 위 안경 쓴 여자가 엄마), ③ `content/_common/art/channel/banner.png` (채널 배너 — 맨 오른쪽 팔짱 낀 여자가 엄마)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 엄마의 기준 그림. 채널 프로필 · 배너의 엄마를 보고 전신으로 처음 그린다. 이후 엄마 그림에 전부 ②로 첨부한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

The mom must be exactly the same woman as the woman with round glasses in attached images 2 and 3 (the channel profile picture and banner): same face, glasses, hairstyle, hair color and sage-green sweater. Draw only her, alone, as a full-body character; ignore the other people in those images. 3/4 view, body and face turned slightly to the LEFT. Standing relaxed, hands loosely clasped in front, a calm gentle smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 16. 엄마 — 다 안다는 미소 ✅
- 저장: `content/_common/art/mom/smirk.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 프로필 · 배너의 그 표정. 아빠가 쩔쩔맬 때 옆에서 보는 엄마.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view turned slightly to the LEFT. Arms crossed, weight on one leg, one eyebrow raised high, a knowing sideways half-smile, eyes glancing sideways as if watching someone struggle, a small sparkle glinting on her glasses.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 엄마 — 설명 ✅
- 저장: `content/_common/art/mom/explain.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view turned slightly to the LEFT. Explaining clearly and kindly: one hand raised with the palm open as if laying out a point, the other hand pushing up her glasses with one finger, eyebrows up, mouth open mid-sentence.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 18. 엄마 — 한숨 (이마 짚기) ✅
- 저장: `content/_common/art/mom/sigh.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 아빠의 엉뚱한 대답을 들었을 때.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view turned slightly to the LEFT. Exasperated: one hand pressed to her forehead, eyes closed, a long sigh puffing out of her mouth as a small comic cloud, shoulders dropped, the other hand on her hip, glasses slightly crooked.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 19. 엄마 — 웃음
- 저장: `content/_common/art/mom/laugh.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view turned slightly to the LEFT. Bursting out laughing: eyes squeezed into happy crescents behind her glasses, mouth wide open showing teeth, one hand half covering the mouth, the other hand slapping the air, leaning forward.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 20. 엄마 — 충격 ✅
- 저장: `content/_common/art/mom/shock.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view turned slightly to the LEFT. Genuinely shocked: glasses sliding down her nose, eyes bulging, jaw dropped showing teeth, both hands up beside her cheeks, hair flicked up by shock lines.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 21. 엄마 — 설명 (말하는 그림) ✅
- 저장: `content/_common/art/mom/explain-b.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/explain.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: 설명 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change only the face: the mouth is now closed in a small calm smile (as if between two words). Both hands stay exactly where they are.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 22. 컷인 — 아빠 당황 ✅
- 저장: `content/_common/art/cutin/dad-panic.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the LEFT. Total panic: eyes bulging and looking away, clenched-teeth fake smile, cold sweat pouring down the whole face, a vein on the temple, trembling.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 23. 컷인 — 아빠 충격 ✅
- 저장: `content/_common/art/cutin/dad-shock.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the LEFT. Jaw dropped to the chest showing every tooth, gums and tongue, eyes popping out of their sockets, hair standing straight up.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 24. 컷인 — 아빠 뿌듯 ✅
- 저장: `content/_common/art/cutin/dad-proud.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the LEFT. Smug proud face: chin raised, nostrils flared, closed crescent eyes, huge satisfied grin, sparkles.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 25. 컷인 — 아이 질문 ✅
- 저장: `content/_common/art/cutin/kid-ask.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Facing slightly to the RIGHT. Innocent and relentless: enormous shining eyes staring straight up, mouth open in a big round 'why?', one finger raised next to the face.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 26. 컷인 — 아이 의심 ✅
- 저장: `content/_common/art/cutin/kid-doubt.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/kid-ask.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Facing slightly to the RIGHT. Deeply suspicious: eyes narrowed to slits, one eyebrow raised very high, lips pressed and pulled to one side.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 27. 컷인 — 엄마 다 안다는 미소 ✅
- 저장: `content/_common/art/cutin/mom-smirk.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Facing slightly to the LEFT. Smug and all-knowing: one eyebrow arched very high, eyes half-closed, a slow sly smile pulled to one side, a sharp sparkle flashing across her glasses.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 28. 컷인 — 엄마 어이없음 ✅
- 저장: `content/_common/art/cutin/mom-sigh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/mom-smirk.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Facing slightly to the LEFT. Utterly done: dead flat stare through her glasses, mouth a straight line, a vein on the temple, a dark gloomy shadow over the upper half of the face, a big sigh cloud.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 29. 시그니처 — 아빠 네모 입막음 ① 손 올리기 ✅
- 저장: `content/_common/art/cutin/dad-sig-1.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 영상에서의 움직임: 크래시 줌으로 들어온다. ①→②→③ 을 4~6프레임씩 넘겨 움직이게 한다.
- 메모: 모답맨 아빠 시그니처 세 장의 첫 장(기준 프레임). ②·③은 이 그림에서 손 · 얼굴만 바꾼다. 아빠 얼굴은 반드시 기준 그림(common/dad/normal)과 같게 — 첨부 ②를 빼고 그리면 다른 사람이 된다 (9화에서 실제로 얼굴이 달라졌다).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer, turned very slightly to the LEFT. Frame 1 of his signature panic pose: he has just realized he was wrong. Both hands are rising up in front of his chest, the thumbs and index fingers of the two hands starting to reach toward each other to form a rectangle frame, the other fingers curled. Eyes already wide and round, eyebrows jumping up, mouth a small stunned "o", the first cold sweat drop on his forehead. His face, thinning hair, stubble, mustard-yellow cardigan and white t-shirt are exactly as in attached image 2.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 30. 시그니처 — 아빠 네모 입막음 ② 입에 딱 ✅
- 저장: `content/_common/art/cutin/dad-sig-2.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/dad-sig-1.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: ①과 같은 자리 · 같은 크기 — 손과 얼굴만 바뀐다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the hands and the face: the thumbs and index fingers of both hands now touch tip to tip, forming one small RECTANGLE frame that is pressed right against his mouth as if trying to hide it. Above the hands his eyes are bulging huge and perfectly round, eyebrows shot up to the hairline, cheeks puffed. Everything else stays exactly the same.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 31. 시그니처 — 아빠 네모 입막음 ③ 부들부들 ✅
- 저장: `content/_common/art/cutin/dad-sig-3.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/dad-sig-1.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal)), ④ `content/_common/art/cutin/dad-sig-2.png` (바로 앞 컷)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: ①과 같은 자리 · 같은 크기 — 얼굴 · 땀 · 머리카락만 더 커진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 is the frame just before this one: continue smoothly from it, with the same face, colors and line work.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Same as the previous frame with the rectangle of fingers still pressed against his mouth, but the panic peaks: the eyes bulge even bigger and tremble with tiny tears at the corners, the few hairs on top stand straight up, a burst of cold sweat drops sprays off his head, short shaking lines around the hands. Everything else stays exactly the same.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 32. 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 ✅
- 저장: `content/_common/art/cutin/mom-sig-1.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/mom-smirk.png` (엄마 얼굴 컷인 — 피부 · 얼굴 톤 기준)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 영상에서의 움직임: 어? 할 때마다 한 장씩 넘어간다.
- 메모: 엄마 시그니처 다섯 장의 첫 장(기준 프레임). 곧게 편 오른손 검지로 입 둘레에 네모를 그린다: ① 왼쪽 → ② 오른쪽 → ③ 위 → ④ 아래 → 양 볼 누르고 "아악!". ②~④는 이 그림에서 손가락 자리만 바꾼다. 엄마 얼굴 · 안경 · 머리 · 세이지색 스웨터는 반드시 기준 그림(common/mom/normal)과 같게 (9화 첫 그림은 기준 없이 그려 다른 사람처럼 나왔다).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Facing the viewer, turned very slightly to the LEFT. Her signature fluster pose, frame 1 of 4. Her RIGHT index finger is held perfectly STRAIGHT and stiff like a little ruler (the other fingers curled into a fist, thumb tucked), and she uses it to trace an invisible SQUARE frame around her mouth, one side at a time. Frame 1: the straight finger stands VERTICALLY right beside the corner of her lips on the VIEWER'S LEFT side of the picture, fingertip pointing straight up, drawing the left side of the square. Lips pressed into a small tense line, eyes wide and darting behind her round glasses, eyebrows raised, a single sweat drop, the left arm down out of the way. Comically stunned, still trying to stay composed. Her face, glasses, bob hair and sage-green sweater are exactly as in attached image 2. Keep her face exactly as soft and pleasant as in her close-up (attached image 3): fair smooth skin with only a light pink blush, no red blotches, no veins, no heavy wrinkles.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 33. 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 ✅
- 저장: `content/_common/art/cutin/mom-sig-2.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/mom-sig-1.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: ①과 같은 자리 · 같은 크기 — 손가락만 옮겨 간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

IMPORTANT: the hand MUST visibly move. The right hand now crosses in front of her chin so that the same straight stiff index finger stands VERTICALLY right beside the corner of her lips on the VIEWER'S RIGHT side of the picture (the opposite side from the image you just made), fingertip pointing straight up, drawing the right side of the square. The eyes now glance toward the finger. Everything else stays exactly the same.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 34. 시그니처 — 엄마 검지 네모 ③ 위 가로줄 ✅
- 저장: `content/_common/art/cutin/mom-sig-3.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/mom-sig-1.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal)), ④ `content/_common/art/cutin/mom-sig-2.png` (바로 앞 컷)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: ①과 같은 자리 · 같은 크기 — 손가락만 옮겨 간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 is the frame just before this one: continue smoothly from it, with the same face, colors and line work.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

IMPORTANT: the hand MUST visibly move. The same straight stiff index finger now lies HORIZONTALLY, pointing sideways, pressed just ABOVE her upper lip and under the nose like a little mustache, drawing the top side of the square. The eyes now glance up and a second sweat drop appears. Everything else stays exactly the same.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 35. 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 ✅
- 저장: `content/_common/art/cutin/mom-sig-4.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/mom-sig-1.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal)), ④ `content/_common/art/cutin/mom-sig-3.png` (바로 앞 컷)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: ①과 같은 자리 · 같은 크기 — 손가락만 옮겨 간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 is the frame just before this one: continue smoothly from it, with the same face, colors and line work.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

IMPORTANT: the hand MUST visibly move. The same straight stiff index finger now lies HORIZONTALLY, pointing sideways, pressed just BELOW her lower lip across the top of the chin, drawing the bottom side of the square. The eyes are now trembling and starting to water, glasses slightly crooked. Everything else stays exactly the same.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 36. 시그니처 — 엄마 양 볼 누르고 악! ✅
- 저장: `content/_common/art/cutin/mom-sig-scream.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/cutin/mom-sig-1.png` (앞 컷 · 기준 그림), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal)), ④ `content/_common/art/cutin/mom-smirk.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 영상에서의 움직임: 번쩍과 함께 크래시 줌, 화면이 흔들린다.
- 메모: 엄마 시그니처의 마지막 장. ①과 같은 크기 · 자리로 그린다. 케빈(나 홀로 집에)처럼 양 손바닥으로 볼을 누른다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Same framing and size as attached image 2, but a new pose: the classic open-palm scream — BOTH palms pressed flat against her own cheeks, squishing them, elbows out, mouth stretched into a huge long vertical oval scream showing teeth and tongue, eyes bulging wide behind round glasses that have jumped up off her nose, hair flicked out by shock lines. Maximum comic horror, not scary. Same face, glasses, hair and sage-green sweater as attached image 2.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 37. 시그니처 — 아이 거꾸로 손 가면 아악! ✅
- 저장: `content/_common/art/cutin/kid-sig.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/kid-ask.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 영상에서의 움직임: 튀어나오며 젤리처럼 늘어났다 돌아온다.
- 메모: 모답맨 아이의 시그니처 놀람 포즈. 엄청난 사실을 알았을 때("달이 위성이었어요?!") 쓴다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Facing the viewer, turned very slightly to the RIGHT. His signature shock pose, the upside-down hand mask: both hands flipped upside down in front of his face, the thumb and index finger of each hand curled into a ring around each eye like goggles, the other three fingers of each hand lying down along his cheeks like the points of a mask. Through the rings his eyes are huge and sparkling; below, his mouth is stretched wide open in a huge 'AAAH!' showing the missing front tooth. Elbows out to the sides, thrilled rather than scared.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 38. 배경 — 거실 ✅
- 저장: `content/_common/art/bg/living-room.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cozy Korean apartment living room in the daytime: beige fabric sofa against the back wall, a low wooden table, a tall leafy plant, a window with light curtains, a few picture frames with blank contents, light wooden floor.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 39. 배경 — 저녁 밥상 ✅
- 저장: `content/_common/art/bg/dining-room.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The dining area of a cozy Korean apartment in the evening: a wooden dining table against the back wall set for dinner with rice bowls, soup, side dishes, spoons and chopsticks, three chairs, a warm pendant lamp hanging above the table, a rice cooker on a side shelf, a kitchen doorway on the right, light wooden floor.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 40. 배경 — 밤의 아이 방 ✅
- 저장: `content/_common/art/bg/kid-room-night.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small Korean child's bedroom at night: a single bed with a star-pattern blanket against the back wall on the left, a bedside table with a warm glowing desk lamp, a window showing a crescent moon, dim blue room light with one warm pool of lamp light.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 41. 아빠 — 관절 인형 3/4 (A 자세) ✅
- 저장: `content/_common/art/rig/dad-apose.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 1순위. 하이브리드 관절 인형 기본. 나머지 rig 그림의 기준.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view, body and face turned slightly to the LEFT. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the cardigan, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 42. 아빠 — 3/4 얼굴: 입 아 ✅
- 저장: `content/_common/art/rig/dad-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 43. 아빠 — 3/4 얼굴: 입 오 ✅
- 저장: `content/_common/art/rig/dad-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 44. 아빠 — 3/4 얼굴: 입 반쯤 ✅
- 저장: `content/_common/art/rig/dad-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 45. 아빠 — 3/4 얼굴: 눈 감기 ✅
- 저장: `content/_common/art/rig/dad-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 46. 아빠 — 3/4 얼굴: 놀람 ✅
- 저장: `content/_common/art/rig/dad-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 47. 아빠 — 3/4 얼굴: 웃음 ✅
- 저장: `content/_common/art/rig/dad-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 48. 아빠 — 3/4 얼굴: 으쓱 ✅
- 저장: `content/_common/art/rig/dad-smug.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: proud smug grin, eyebrows raised high, eyes half-closed with confidence, closed-mouth wide grin. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 49. 아빠 — 3/4 얼굴: 당황 ✅
- 저장: `content/_common/art/rig/dad-panic.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: forced crooked smile showing clenched teeth, eyes darting sideways, cold sweat drops on the forehead. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 50. 아빠 — 관절 인형 정면
- 저장: `content/_common/art/rig/dad-front.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/dad-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Straight-on FRONT view: body and face facing the viewer directly, symmetric, looking straight at the camera. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the cardigan, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view in the same pose: keep every detail of face, hair and clothes identical, only rotate to face the front. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 51. 아빠 — 정면 얼굴: 입 아
- 저장: `content/_common/art/rig/dad-front-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 52. 아빠 — 정면 얼굴: 입 오
- 저장: `content/_common/art/rig/dad-front-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 53. 아빠 — 정면 얼굴: 입 반쯤
- 저장: `content/_common/art/rig/dad-front-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 54. 아빠 — 정면 얼굴: 눈 감기
- 저장: `content/_common/art/rig/dad-front-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 55. 아빠 — 정면 얼굴: 놀람
- 저장: `content/_common/art/rig/dad-front-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 56. 아빠 — 정면 얼굴: 웃음
- 저장: `content/_common/art/rig/dad-front-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 57. 아빠 — 관절 인형 옆
- 저장: `content/_common/art/rig/dad-side.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/dad-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Full SIDE profile view, the whole body and face turned 90 degrees to the LEFT (we see only one eye, the nose in profile). Standing straight, feet slightly apart front-to-back, the near arm hanging straight and held slightly forward away from the body so there is green space between the arm and the torso, hand open, calm closed-mouth smile. Attached image 3 is the same character in 3/4 view: keep every detail of face, hair and clothes identical, only rotate to the side. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 58. 아빠 — 옆 얼굴: 입 아
- 저장: `content/_common/art/rig/dad-side-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 59. 아빠 — 옆 얼굴: 눈 감기
- 저장: `content/_common/art/rig/dad-side-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/dad-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 60. 아빠 — 관절 인형 뒤
- 저장: `content/_common/art/rig/dad-back.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/dad-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

BACK view: seen from directly behind, the face is NOT visible, we see the back of the head, hair and clothes. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the cardigan, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view: keep hair, clothes and colors identical, only rotate to show the back. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 61. 아빠 — 손: 검지
- 저장: `content/_common/art/rig/dad-hand-point.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the hand on the viewer's right side: pointing the index finger straight out, other fingers curled. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 62. 아빠 — 손: 주먹
- 저장: `content/_common/art/rig/dad-hand-fist.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the hand on the viewer's right side: a tight clenched fist. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 63. 아빠 — 손: 손바닥
- 저장: `content/_common/art/rig/dad-hand-palm.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the hand on the viewer's right side: an open hand with fingers spread wide, palm facing the viewer as if waving. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 64. 아빠 — 손: 엄지척
- 저장: `content/_common/art/rig/dad-hand-thumb.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/dad-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/dad/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change ONLY the hand on the viewer's right side: a thumbs-up. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 65. 엄마 — 관절 인형 3/4 (A 자세) ✅
- 저장: `content/_common/art/rig/mom-apose.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 1순위. 하이브리드 관절 인형 기본. 나머지 rig 그림의 기준.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

3/4 view, body and face turned slightly to the LEFT. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the sweater, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 66. 엄마 — 3/4 얼굴: 입 아 ✅
- 저장: `content/_common/art/rig/mom-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 67. 엄마 — 3/4 얼굴: 입 오 ✅
- 저장: `content/_common/art/rig/mom-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 68. 엄마 — 3/4 얼굴: 입 반쯤 ✅
- 저장: `content/_common/art/rig/mom-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 69. 엄마 — 3/4 얼굴: 눈 감기 ✅
- 저장: `content/_common/art/rig/mom-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 70. 엄마 — 3/4 얼굴: 놀람 ✅
- 저장: `content/_common/art/rig/mom-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 71. 엄마 — 3/4 얼굴: 웃음 ✅
- 저장: `content/_common/art/rig/mom-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 72. 엄마 — 3/4 얼굴: 피식 ✅
- 저장: `content/_common/art/rig/mom-smirk.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: a knowing sideways smirk, one eyebrow raised, eyes half-lidded behind the glasses, lips pressed into a lopsided smile. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 73. 엄마 — 3/4 얼굴: 한숨 ✅
- 저장: `content/_common/art/rig/mom-sigh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: eyes closed in exasperation, eyebrows drawn together, cheeks puffed out letting out a long sigh. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 74. 엄마 — 관절 인형 정면
- 저장: `content/_common/art/rig/mom-front.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/mom-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Straight-on FRONT view: body and face facing the viewer directly, symmetric, looking straight at the camera. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the sweater, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view in the same pose: keep every detail of face, hair and clothes identical, only rotate to face the front. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 75. 엄마 — 정면 얼굴: 입 아
- 저장: `content/_common/art/rig/mom-front-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 76. 엄마 — 정면 얼굴: 입 오
- 저장: `content/_common/art/rig/mom-front-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 77. 엄마 — 정면 얼굴: 입 반쯤
- 저장: `content/_common/art/rig/mom-front-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 78. 엄마 — 정면 얼굴: 눈 감기
- 저장: `content/_common/art/rig/mom-front-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 79. 엄마 — 정면 얼굴: 놀람
- 저장: `content/_common/art/rig/mom-front-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 80. 엄마 — 정면 얼굴: 웃음
- 저장: `content/_common/art/rig/mom-front-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 81. 엄마 — 관절 인형 옆
- 저장: `content/_common/art/rig/mom-side.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/mom-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Full SIDE profile view, the whole body and face turned 90 degrees to the LEFT (we see only one eye, the nose in profile). Standing straight, feet slightly apart front-to-back, the near arm hanging straight and held slightly forward away from the body so there is green space between the arm and the torso, hand open, calm closed-mouth smile. Attached image 3 is the same character in 3/4 view: keep every detail of face, hair and clothes identical, only rotate to the side. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 82. 엄마 — 옆 얼굴: 입 아
- 저장: `content/_common/art/rig/mom-side-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 83. 엄마 — 옆 얼굴: 눈 감기
- 저장: `content/_common/art/rig/mom-side-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/mom-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 84. 엄마 — 관절 인형 뒤
- 저장: `content/_common/art/rig/mom-back.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/mom-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

BACK view: seen from directly behind, the face is NOT visible, we see the back of the head, hair and clothes. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the sweater, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view: keep hair, clothes and colors identical, only rotate to show the back. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 85. 엄마 — 손: 검지
- 저장: `content/_common/art/rig/mom-hand-point.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the hand on the viewer's right side: pointing the index finger straight out, other fingers curled. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 86. 엄마 — 손: 주먹
- 저장: `content/_common/art/rig/mom-hand-fist.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the hand on the viewer's right side: a tight clenched fist. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 87. 엄마 — 손: 손바닥
- 저장: `content/_common/art/rig/mom-hand-palm.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the hand on the viewer's right side: an open hand with fingers spread wide, palm facing the viewer as if waving. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 88. 엄마 — 손: 엄지척
- 저장: `content/_common/art/rig/mom-hand-thumb.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/mom-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/mom/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Change ONLY the hand on the viewer's right side: a thumbs-up. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 89. 아이 — 관절 인형 3/4 (A 자세) ✅
- 저장: `content/_common/art/rig/kid-apose.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 1순위. 하이브리드 관절 인형 기본. 나머지 rig 그림의 기준.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view, body and face turned slightly to the RIGHT. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the hoodie, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 90. 아이 — 3/4 얼굴: 입 아 ✅
- 저장: `content/_common/art/rig/kid-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 91. 아이 — 3/4 얼굴: 입 오 ✅
- 저장: `content/_common/art/rig/kid-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 92. 아이 — 3/4 얼굴: 입 반쯤 ✅
- 저장: `content/_common/art/rig/kid-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 93. 아이 — 3/4 얼굴: 눈 감기 ✅
- 저장: `content/_common/art/rig/kid-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 94. 아이 — 3/4 얼굴: 놀람 ✅
- 저장: `content/_common/art/rig/kid-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 95. 아이 — 3/4 얼굴: 웃음 ✅
- 저장: `content/_common/art/rig/kid-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 96. 아이 — 3/4 얼굴: 반짝 ✅
- 저장: `content/_common/art/rig/kid-wow.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: sparkling star-shaped eyes, wide amazed open smile showing the missing front tooth. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 97. 아이 — 3/4 얼굴: 갸웃 ✅
- 저장: `content/_common/art/rig/kid-doubt.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 1순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: one eye squinting in doubt, one eyebrow raised, mouth pushed to one side. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 98. 아이 — 관절 인형 정면
- 저장: `content/_common/art/rig/kid-front.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/kid-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Straight-on FRONT view: body and face facing the viewer directly, symmetric, looking straight at the camera. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the hoodie, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. Calm closed-mouth smile, eyes open. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view in the same pose: keep every detail of face, hair and clothes identical, only rotate to face the front. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 99. 아이 — 정면 얼굴: 입 아
- 저장: `content/_common/art/rig/kid-front-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 100. 아이 — 정면 얼굴: 입 오
- 저장: `content/_common/art/rig/kid-front-mouth-o.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: a small rounded "O" shape as if saying "Oh". Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 101. 아이 — 정면 얼굴: 입 반쯤
- 저장: `content/_common/art/rig/kid-front-mouth-e.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: half open mid-word, teeth slightly visible. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 102. 아이 — 정면 얼굴: 눈 감기
- 저장: `content/_common/art/rig/kid-front-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 103. 아이 — 정면 얼굴: 놀람
- 저장: `content/_common/art/rig/kid-front-shock.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: grotesque shock, bulging eyes, eyebrows shot up, huge screaming open mouth with teeth and gums, cold sweat drops on the face. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 104. 아이 — 정면 얼굴: 웃음
- 저장: `content/_common/art/rig/kid-front-laugh.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-front.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-front.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the face: eyes squeezed shut into crescents, huge laughing open mouth with teeth and gums. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 105. 아이 — 관절 인형 옆
- 저장: `content/_common/art/rig/kid-side.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/kid-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Full SIDE profile view, the whole body and face turned 90 degrees to the RIGHT (we see only one eye, the nose in profile). Standing straight, feet slightly apart front-to-back, the near arm hanging straight and held slightly forward away from the body so there is green space between the arm and the torso, hand open, calm closed-mouth smile. Attached image 3 is the same character in 3/4 view: keep every detail of face, hair and clothes identical, only rotate to the side. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 106. 아이 — 옆 얼굴: 입 아
- 저장: `content/_common/art/rig/kid-side-mouth-a.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the mouth: wide open as if shouting "Ah!", showing the upper teeth and the tongue. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 107. 아이 — 옆 얼굴: 눈 감기
- 저장: `content/_common/art/rig/kid-side-blink.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-side.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- ⚠️ 첨부 그림이 아직 없다: content/_common/art/rig/kid-side.png (그 그림부터 뽑는다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 2순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the eyes: both eyes closed in a relaxed blink (soft curved lines). The mouth stays exactly the same. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 108. 아이 — 관절 인형 뒤
- 저장: `content/_common/art/rig/kid-back.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/rig/kid-apose.png` (같은 인물 3/4 A 자세)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 메모: 2순위. 다른 각도. 3/4 기본을 ③으로 붙인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

BACK view: seen from directly behind, the face is NOT visible, we see the back of the head, hair and clothes. Neutral rigging pose for puppet animation: standing straight, feet slightly apart with a clear gap between the legs, both arms held straight and angled about 25 degrees away from the body so there is clear empty green space between each arm and the hoodie, hands open and relaxed (NOT behind the back, NOT clasped), palms facing the thighs. Nothing overlaps the torso. IMPORTANT for this base picture: the face is calm and neutral like attached image 2, the mouth fully closed in a gentle smile with no teeth showing, no sweat drops, no effect marks; ignore the exaggerated-expression words above for this picture only. Attached image 3 is the same character in 3/4 view: keep hair, clothes and colors identical, only rotate to show the back. No sweat drops or effect marks floating around.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 109. 아이 — 손: 검지
- 저장: `content/_common/art/rig/kid-hand-point.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the hand on the viewer's right side: pointing the index finger straight out, other fingers curled. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 110. 아이 — 손: 주먹
- 저장: `content/_common/art/rig/kid-hand-fist.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the hand on the viewer's right side: a tight clenched fist. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 111. 아이 — 손: 손바닥
- 저장: `content/_common/art/rig/kid-hand-palm.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the hand on the viewer's right side: an open hand with fingers spread wide, palm facing the viewer as if waving. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 112. 아이 — 손: 엄지척
- 저장: `content/_common/art/rig/kid-hand-thumb.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/rig/kid-apose.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다), ③ `content/_common/art/kid/normal.png` (그 사람 기준 그림 (normal))
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 메모: 3순위

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change ONLY the hand on the viewer's right side: a thumbs-up. The arm stays in exactly the same position. Body, arms, legs, clothes, pose, size and position stay exactly the same as attached image 2.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```
