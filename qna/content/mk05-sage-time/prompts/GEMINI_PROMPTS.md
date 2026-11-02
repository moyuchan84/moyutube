# Gemini 프롬프트 — 모덕후 ⑤ 현자타임 — 명상 화보 · 수사극 패러디

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk05-sage-time/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 17장. 진행: 6 / 17
> 다 넣었으면 `video/` 에서 `npm run make -- mk05` → `video/out/mk05/mk05.mp4`

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

## 1. 아직 없는 그림 — 11장 (이것만 Gemini 에서 만든다)

#### 7. 현자 삼촌 — 흰 도포 · 가부좌 · 후광 · 연꽃 (썸네일 겸용)
- 저장: `content/mk05-sage-time/art/modeokhu/sage.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c06, 썸네일

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Facing the viewer. Sitting cross-legged in a calm meditation pose on a big pink lotus flower, wearing a loose plain white monk-like robe over his plaid shirt collar, hands resting on knees in a meditation mudra. A big round golden halo glows behind his head with soft rays. Eyes half-closed in total serene enlightenment, a tiny peaceful smile, his thick glasses still on and calmly glinting, one small sweat drop of exhaustion on his temple. Fully clothed, nothing suggestive.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 문틈 — 놀란 아빠 + 방 안 현자 삼촌, 시계 2:03
- 저장: `content/mk05-sage-time/art/full/doorway.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
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

Night scene inside a small Korean studio apartment lit only by the cool blue glow of a switched-off computer monitor. In the foreground on the right, the dad peeks in through a door opened a crack, eyes bulging in shock, mouth hanging open. In the middle of the room the uncle sits cross-legged on the floor in a meditation pose, wearing a plain white robe over his clothes, a soft golden halo glowing behind his head, eyes half-closed and serene. A small digital desk clock glows on a shelf. Both people stay in the exact gag-manga cartoon style of the attached images. Nothing suggestive. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 두 칸 만화 — 불꽃놀이로 달려가는 삼촌 / 다 탄 막대 하나 든 삼촌
- 저장: `content/mk05-sage-time/art/full/fireworks.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

A two-part comic illustration split left and right by a simple diagonal. LEFT: under a dark night sky exploding with huge colorful fireworks, the uncle sprints toward the fireworks with arms stretched out, cheeks bright red, eyes sparkling with excitement, glasses glinting. RIGHT: the same uncle stands alone in a dark empty field holding one burnt-out sparkler stick with a tiny wisp of grey smoke, shoulders slumped, eyes blank and empty, a single tumbleweed rolling past. The uncle stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 택배 뜯기 전(반짝 · 하트) vs 뜯은 뒤(빈 뽁뽁이)
- 저장: `content/mk05-sage-time/art/full/package.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute two-part before-and-after illustration split left and right. LEFT: a closed brown cardboard delivery box glowing with golden light, sparkles, little pink hearts and stars bursting out around it like a treasure chest. RIGHT: the same box torn open and empty, only a crumpled sheet of bubble wrap and a few packing peanuts inside, a grey sad little cloud above it. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any people or faces. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 뇌 캐릭터가 브레이크 페달 밟기 + 실험대의 흰 쥐 두 마리
- 저장: `content/mk05-sage-time/art/full/brake-lab.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute cartoon science illustration: a round pink brain character with tiny arms and legs sits in the driver seat of a small toy car, stomping hard on a big red brake pedal with a determined face, skid lines behind the wheels. The brake pedal has a small blank tag hanging from it. To the right, on a white lab bench, two small cute white lab mice stand on their hind legs holding up a blank sign, shaking their heads with a smug no-no expression. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any people. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 수사극 패러디 — 미제 사건 게시판, 탐정 모자 삼촌
- 저장: `content/mk05-sage-time/art/full/case-board.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

A detective-drama parody: a big cork evidence board covered with pinned photos and red strings connecting them; in the center a pinned photo of a cute little round orange hormone-blob character with a big question mark drawn over it, a red rubber-stamp mark slapped across the board. In front of the board stands the uncle wearing a brown deerstalker detective hat and holding a big magnifying glass to one eye, frowning seriously, glasses glinting. Dim desk lamp light. The uncle stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 빨간 삼촌(뜨거운 나) vs 파란 삼촌(식은 나)
- 저장: `content/mk05-sage-time/art/full/hot-cold.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

A split-screen illustration of the SAME uncle shown twice, left and right. LEFT half: a hot red-orange background with flames; the uncle is flushed bright red, sweating, grinning wildly, eyes spinning, gripping a smartphone and typing furiously with both thumbs. RIGHT half: an icy pale-blue background with falling snow; the same uncle is pale blue, sitting slumped, one hand on his forehead in regret, staring at his phone and holding a long shopping receipt in his other hand, a big sweat drop. Both figures keep the exact face, glasses, hair and plaid shirt of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 파란 삼촌의 수습 목록 두루마리 — 새벽 문자 · 장바구니 · 택배 탑
- 저장: `content/mk05-sage-time/art/full/mess-list.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

The uncle, looking pale and regretful with a sweat drop, unrolls a very long paper scroll that tumbles all the way down to the floor. Instead of writing, the scroll shows a column of simple cute icons: a smartphone with a chat bubble and a crescent moon, a shopping cart overflowing with boxes, a teetering tower of delivery boxes, a credit card with little wings flying away. A small night window behind him. The uncle stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. 남녀 실루엣 열 명 중 넷 위에 작은 비구름
- 저장: `content/mk05-sage-time/art/full/blue-cloud.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A gentle infographic illustration: ten simple flat colored silhouettes of adults standing in a neat row on a soft pastel background, a mix of men and women of different heights. Above the heads of four of them float small cute grey rain clouds with tiny drizzle and sleepy sad little faces; the other six have small sun icons. Calm and kind mood, not dramatic. Use the attached image ONLY as a reference for line weight and coloring. The silhouettes are plain flat shapes with no faces; do NOT draw the person from the attached image. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 엔딩 — 소파, TV 홈쇼핑 안마의자, 엄마 휴대폰 · 아빠 평온한 손바닥
- 저장: `content/mk05-sage-time/art/full/sofa-tv.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

A warm Korean apartment living room in the evening. The mom and the dad sit side by side on a sofa facing a TV that shows a big shiny massage chair with sparkles (no words on screen). The mom holds up her smartphone toward the dad with an eager hopeful face. The dad, eyes half-closed with a calm serene sage-like smile and a faint golden halo glow behind his head, raises one open palm in a gentle wait gesture. Both people stay in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 17. 한정판 피규어 결제 버튼 위에서 멈춘 손가락 + 모래시계
- 저장: `content/mk05-sage-time/art/full/checkout.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk05-sage-time/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Night, the uncle at his desk in his studio apartment, face lit by a computer monitor. On the monitor a shiny limited-edition robot figure is displayed with sparkles and a big glowing blank button under it. His index finger hovers just above the mouse, trembling, glasses fogged up, cheeks red, a sweat drop, lips pressed tight in restraint. Beside the keyboard stands a small hourglass with sand running. The uncle stays in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

---

## 2. 이미 있는 그림 — 6장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk05` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리키며 "자, 진지하다" (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/modeokhu/point.png` |
| 3 | 모덕후 삼촌 — 결론, 팔짱 끼고 의기양양 (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/modeokhu/proud.png` |
| 4 | 삼촌 — "…논문으로." 시선 피하며 안경 고쳐 쓰기 (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/modeokhu/fluster.png` |
| 5 | 삼촌 컷인 — 꿀꺽 (김 서린 안경 · 빨개진 볼) (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/cutin/uncle-gulp.png` |
| 6 | 배경 — 삼촌의 밤 원룸 (책 더미 · 피규어 · 컵라면 · TV 불빛) (4편 그림 복사, 새로 안 뽑음) | `content/mk05-sage-time/art/bg/oneroom.png` |
