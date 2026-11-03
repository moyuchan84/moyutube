# Gemini 프롬프트 — 내모남불 ⑨ 자식 자랑편 · 단톡방 · 명절

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/nm09-brag/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 15장. 진행: 0 / 15
> 다 넣었으면 `video/` 에서 `npm run make -- nm09` → `video/out/nm09/nm09.mp4`

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
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 컷인 — 아빠 당황 | `content/_common/art/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `content/_common/art/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `content/_common/art/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `content/_common/art/cutin/dad-sig-3.png` |

---

## 1. 아직 없는 그림 — 15장 (이것만 Gemini 에서 만든다)

#### 1. 심리학 강사님 — 기본
- 저장: `content/nm09-brag/art/teacher/normal.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00b, c02c, c03b, c04b, c06b
- 영상에서의 움직임: 고개만 까딱, 말할 때 태블릿을 살짝 들어 올린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the psychology lecturer: a Korean woman in her forties, neat chin-length black bob, round gold-rimmed glasses, a gentle oval face with kind narrow eyes and a calm knowing smile; wearing a beige knit cardigan over a white blouse and dark slacks, holding a small tablet against her chest; absolutely NO text, NO letters, NO name tags and NO logos anywhere; warm, composed and kindly deadpan.

3/4 view turned slightly to the LEFT. Standing upright with the small tablet held against her chest in both arms, chin level, a calm knowing smile, eyes looking straight at the viewer.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 2. 심리학 강사님 — 태블릿으로 설명
- 저장: `content/nm09-brag/art/teacher/tablet.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm09-brag/art/teacher/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm09-brag/art/teacher/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c02c, c03b
- 영상에서의 움직임: 태블릿을 가리킨다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the psychology lecturer: a Korean woman in her forties, neat chin-length black bob, round gold-rimmed glasses, a gentle oval face with kind narrow eyes and a calm knowing smile; wearing a beige knit cardigan over a white blouse and dark slacks, holding a small tablet against her chest; absolutely NO text, NO letters, NO name tags and NO logos anywhere; warm, composed and kindly deadpan.

3/4 view turned slightly to the LEFT. One hand holding the tablet out toward the viewer while the other index finger points at it like explaining a study, gentle smile, eyebrows slightly raised.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 강사님 컷인 — 정색 한마디
- 저장: `content/nm09-brag/art/cutin/teacher-flat.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm09-brag/art/teacher/normal.png` (같은 사람 유지용 기준 그림)
- ⚠️ 첨부 그림이 아직 없다: content/nm09-brag/art/teacher/normal.png (그 그림부터 뽑는다)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00b, c04c
- 영상에서의 움직임: 천천히 줌 인.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the psychology lecturer: a Korean woman in her forties, neat chin-length black bob, round gold-rimmed glasses, a gentle oval face with kind narrow eyes and a calm knowing smile; wearing a beige knit cardigan over a white blouse and dark slacks, holding a small tablet against her chest; absolutely NO text, NO letters, NO name tags and NO logos anywhere; warm, composed and kindly deadpan.

Facing the viewer, dramatic close-up from the chest up. A kind but perfectly deadpan stare over the top of her round glasses, one index finger raised as if making a point, soft warm light behind her.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 배경 — 문화센터 로비 (토요일 오후)
- 저장: `content/nm09-brag/art/bg/lobby.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00, c00a, c00b, c02, c03, c04, c05, c06
- 영상에서의 움직임: 느린 팬.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A bright, cozy Korean community culture-center lobby on a Saturday afternoon seen straight-on like a sitcom set: a long wooden bench in the foreground, a front desk with a plant, a blank corkboard with only colored paper shapes, big windows with warm sunlight, a few classroom doors in the back. No people. No readable words, letters or logos anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 5. 배경 — 밤 거실이 아닌 아빠 서재 방
- 저장: `content/nm09-brag/art/bg/room-night.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c07, c07a, c07b, c07c, c07d
- 영상에서의 움직임: 천천히 줌.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small cozy Korean bedroom-study at night seen straight-on like a sitcom set: a desk with a warm lamp, a plain bed with a blanket, a bookshelf, dark blue window with a few city lights, soft warm lamp glow. No people. No readable words, letters or logos anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 6. 벤치에서 폰 보며 얼굴 찌푸린 아빠 + 옆의 모라구
- 저장: `content/nm09-brag/art/full/kakao-rage.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/_common/art/kid/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00, c00a
- 영상에서의 움직임: 분노 선이 번쩍.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

In a culture-center lobby, the dad sits on a bench glaring at his smartphone with a scrunched indignant face, veins popping comically, small anger lines around his head, while the kid sits next to him holding a jump rope and looking up at him flatly. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 7. 명절 상 앞에서 조카에게 캐묻는 아빠 (회상)
- 저장: `content/nm09-brag/art/full/reunion.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02a, c02b
- 영상에서의 움직임: 아빠가 몸을 쑥 내민다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A holiday family gathering: the dad leans far forward over a low table with a huge fake-friendly smile and wide eyes toward a plain flat grey faceless silhouette teenager who leans back away from him, shrinking in his seat, plates of holiday food on the table, a warm yellowish memory-flashback glow. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 뿌듯하게 폰에 타자 치는 아빠
- 저장: `content/nm09-brag/art/full/proud-typing.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03a, c04a, c07a
- 영상에서의 움직임: 반짝이가 튄다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The dad sits on a bench typing on his smartphone with both thumbs, a fake-modest face with eyes half-closed and a barely hidden proud grin, sparkles popping around his phone and head. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 상상: 상장이 천장까지 쌓인 방 vs 현실: 상장 한 장
- 저장: `content/nm09-brag/art/full/room-vs-real.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03a
- 영상에서의 움직임: 좌우로 갈라진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A split picture. LEFT half: a tiny bedroom crammed floor to ceiling with endless blank certificates, trophies and ribbons, bursting through the walls in a comical exaggeration. RIGHT half: the same bedroom calm and spacious with a single blank certificate pinned on the wall. No people. No readable words, letters or logos anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 학원 광고 전단지를 든 아빠
- 저장: `content/nm09-brag/art/full/academy-boast.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04, c04a
- 영상에서의 움직임: 전단지를 휘두른다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The dad holds up a big bright colorful flyer made only of stars, rockets and smiling shapes (no words), grinning proudly and sweetly like a salesman, sparkles around the flyer. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 돌잔치 풍선 아래 의기양양한 아빠
- 저장: `content/nm09-brag/art/full/birthday-boast.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05a
- 영상에서의 움직임: 풍선이 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The dad stands proudly with his arms spread under a huge arch of balloons beside a giant tiered cake, confetti flying, an over-the-top smug proud face. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 밤, 셋이 폰을 같이 들여다봄
- 저장: `content/nm09-brag/art/full/group-night.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/_common/art/kid/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07b, c07c, c07d
- 영상에서의 움직임: 엄마가 고개를 갸웃.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Also in the picture: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

At night in a cozy room, the dad holds a smartphone at the center, the mom on his left looking at the screen with a flat deadpan unimpressed face, the kid on his right looking at the screen with a flat matter-of-fact face, the dad in the middle sweating with a defensive grin. The dad stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters, numbers, logos or app icons anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 소품 — 휴대폰 (알림이 쏟아짐)
- 저장: `content/nm09-brag/art/prop/phone.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00, c07
- 영상에서의 움직임: 진동한다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single smartphone buzzing with comic vibration lines and tiny speech-bubble shapes popping out of the screen, the screen showing only a blank bright glow. No logos, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 소품 — 줄넘기 상장
- 저장: `content/nm09-brag/art/prop/certificate.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00a, c06
- 영상에서의 움직임: 반짝.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single paper award certificate with a gold ribbon seal and a tiny sparkle, decorated only with a simple jump-rope doodle shape, no letters. No logos, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 소품 — 상장 더미 (상상)
- 저장: `content/nm09-brag/art/prop/cert-stack.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c03a
- 영상에서의 움직임: 쌓여 간다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A tall comically leaning stack of blank certificates, golden trophies and ribbons piled up high, sparkles around it. No logos, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 0장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm09` 를 다시 실행하면 위 목록으로 돌아온다.

아직 없다.
