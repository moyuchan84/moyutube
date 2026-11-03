# Gemini 프롬프트 — 모덕후 ⑧ 참았다 푸는 쾌감 — 휴게소 30km 앞

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk08-relief/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 11장. 진행: 4 / 11
> 다 넣었으면 `video/` 에서 `npm run make -- mk08` → `video/out/mk08/mk08.mp4`

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
| ✅ | 아빠 — 충격 | `content/_common/art/dad/shock.png` |
| ✅ | 아빠 — 생각 | `content/_common/art/dad/think.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |

---

## 1. 아직 없는 그림 — 7장 (이것만 Gemini 에서 만든다)

#### 5. 식은땀 삼촌 — 조수석에서 허벅지 쥐고 버티기 (썸네일 겸용)
- 저장: `content/mk08-relief/art/modeokhu/sweat.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk08-relief/art/modeokhu/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c06, 썸네일

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Facing the viewer, seated in a car passenger seat seen from the front, both hands gripping his own knees, knees pressed tightly together, shoulders hunched up. Eyes squeezed shut, thick glasses sliding down his nose, big cold-sweat drops flying off his forehead, face turning pale blue-green, mouth a wobbly zigzag line, tiny shaking lines around him. Seat belt on, plaid shirt as always. Comic desperation only, fully clothed, nothing crude.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 차 안 — 운전하는 아빠 + 식은땀 조수석 삼촌, 앞 유리 밖 고속도로, 표지판 '휴게소 30km'
- 저장: `content/mk08-relief/art/full/car-front.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/mk08-relief/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 3 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Interior of a family car on a highway seen from the back seat looking forward through the windshield. Left: the dad driving, calm and a little puzzled, gripping the steering wheel. Right: the uncle in the passenger seat gripping his knees, cold sweat flying, eyes squeezed shut, face pale blue-green. Through the windshield a long straight highway at dusk and a big green blank road sign (no words, no numbers) with only a small fork-and-cup rest-stop icon. Both people stay in the exact gag-manga cartoon style of the attached images. Nothing crude. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 7. 뇌 도해 — 방광 풍선 아이콘에서 올라오는 신호선, 뇌 속 작은 스위치 '바링턴핵', 앞쪽 뇌 캐릭터가 '아직 안 돼' 팻말
- 저장: `content/mk08-relief/art/full/brain-switch.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute cartoon cross-section diagram, NOT realistic anatomy: on the left a plain round water-balloon icon (stands for a bladder) with a tiny gauge on it, from which a glowing wavy signal line travels upward along a thin spine-line into a big friendly cartoon brain drawn as a side-view silhouette. Inside the brain deep in the middle sits a small red toggle switch with a little tag, and at the front of the brain a tiny chibi mascot with arms holds up a hand-made sign showing a big red stop hand symbol (no words) to hold the switch down, sweating with effort. Pastel blue and yellow diagram background with soft grid. Use the attached image ONLY as a reference for the art style; there are no people and no faces except the cute brain mascot. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 동물 4컷 — 크기 다른 동물 실루엣 옆에 똑같은 21초 타이머
- 저장: `content/mk08-relief/art/full/mammal-21s.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A 2x2 grid of four panels on a pale yellow background, each panel with a different animal silhouette in flat cartoon style, sizes clearly different: an elephant, a cow, a goat, a dog. Under each animal an identical round stopwatch icon with its hand pointing at the same position, all four stopwatches exactly the same. A thin dotted arch connects the four stopwatches to show they are equal. Cheerful educational infographic mood. Use the attached image ONLY as a reference for the art style; there are no people. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 풍선 + 구름 아이콘 — 하루 방귀 총량 비유
- 저장: `content/mk08-relief/art/full/balloon-cloud.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One huge round red party balloon floating in the middle of a plain pale-blue sky background, with a small round smiling yellow-green cloud puff mascot (a cute gas cloud with tiny eyes) floating beside it, another three small cloud puffs trailing behind like a dotted line to suggest a day's worth. Comic, friendly, completely clean and non-gross. Use the attached image ONLY as a reference for the art style; there are no people. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 닫힌 화장실 문 + 느려지는 심박 그래프 + 별 도는 아이콘
- 저장: `content/mk08-relief/art/full/faint-door.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A plain closed bathroom door with a simple round generic toilet-sign icon on it (a neutral circular pictogram, no gendered figure), seen straight-on in a clean hallway. Floating beside the door a big cartoon heart icon with a heartbeat line graph whose peaks get wider and flatter from left to right, a downward arrow next to it, and above the door a ring of cartoon stars spinning like someone is about to faint. A tiny round badge in a corner showing a cute cartoon lab mouse face. Flat pastel colors. Use the attached image ONLY as a reference for the art style; there are no people. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 휴게소 화장실 줄 — 얼굴 없는 실루엣이 끝없이 이어짐, 맨 끝에 작은 삼촌
- 저장: `content/mk08-relief/art/full/rest-line.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A bright daytime highway rest-stop building seen from the front with a simple restroom door at the far left, and a very long snaking line of featureless dark-grey cartoon silhouettes (no faces, no details) shifting their weight impatiently, the line curling around the building. At the very end of the line, tiny but recognizable, the nerdy uncle with thick round glasses and a plaid shirt standing with knees pressed together, a small cold-sweat drop. Cheerful gag-manga mood, nothing crude. Use the attached image ONLY as a reference for the art style of the small uncle; keep every other figure a faceless silhouette. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

---

## 2. 이미 있는 그림 — 4장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk08` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) (mk05 그림 복사, 새로 안 뽑음) | `content/mk08-relief/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리키며 "자, 진지하다" (mk05 그림 복사, 새로 안 뽑음) | `content/mk08-relief/art/modeokhu/point.png` |
| 3 | 삼촌 — "…논문으로." 시선 피하며 안경 고쳐 쓰기 (mk05 그림 복사, 새로 안 뽑음) | `content/mk08-relief/art/modeokhu/fluster.png` |
| 4 | 삼촌 컷인 — 꿀꺽 (김 서린 안경 · 빨개진 볼) (mk05 그림 복사, 새로 안 뽑음) | `content/mk08-relief/art/cutin/uncle-gulp.png` |
