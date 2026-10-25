# Gemini 프롬프트 — 1편 · 호텔 · 모텔 · 유스호스텔, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep01/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 23장. 진행: 9 / 23
> 다 넣었으면 `video/` 에서 `npm run make -- ep01` → `video/out/ep01/ep01.mp4`

## 사용법

1. 위에서부터 **차례대로** 한 블록씩 Gemini에 붙여넣는다. 화풍 문장은 블록마다 이미 들어 있다.
2. 블록의 **첨부** 이미지를 같이 올린다. ①은 화풍 고정용 앵커, ②는 같은 사람 유지용 기준 그림이다 (순서 중요).
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

아래는 이 편이 쓰는 공통 그림이다. 프롬프트는 [art/common/GEMINI_PROMPTS.md](../../art/common/GEMINI_PROMPTS.md)에 있고, 다른 편에서 이미 만들었으면 건너뛴다.

| | 그림 | 파일 |
|---|---|---|
| ✅ | 아빠 — 기본 | `art/common/dad/normal.png` |
| ✅ | 아빠 — 당황 | `art/common/dad/panic.png` |
| ✅ | 아빠 — 설명 | `art/common/dad/explain.png` |
| ✅ | 아빠 — 생각 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 의심 | `art/common/kid/doubt.png` |
| ✅ | 아이 — 웃음 | `art/common/kid/laugh.png` |
| ✅ | 컷인 — 아빠 당황 | `art/common/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 배경 — 거실 | `art/common/bg/living-room.png` |
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `art/common/mom/smirk.png` |
| ✅ | 엄마 — 충격 | `art/common/mom/shock.png` |
| ✅ | 컷인 — 아빠 충격 | `art/common/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 컷인 — 아이 의심 | `art/common/cutin/kid-doubt.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |

---

## 1. 아직 없는 그림 — 14장 (이것만 Gemini 에서 만든다)

#### 10. 배경 — 유스호스텔 프런트 (모답맨 1화 주 무대)
- 저장: `episodes/01-hotel-motel-hostel/art/bg/hostel-lobby.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00~c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The cozy front lobby of a Korean youth hostel in the hills, seen straight-on like a sitcom set: a long wooden reception counter on the left with a small bell and a guest book, a wall rack of wooden room-key tags behind it, a cork board with blank flyers and a blank paper trail map, bunk-bed photos as blank frames, a row of colorful hiking backpacks and walking sticks leaning on the right wall, big windows showing green hills, warm afternoon daylight, pine wood walls. No readable text, no logos. The bottom third is an open empty wooden floor for characters.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 배경 — 언덕 아래 주차장에서 올려다본 유스호스텔 (반전)
- 저장: `episodes/01-hotel-motel-hostel/art/bg/hill-parking.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c08, c08b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small gravel parking lot at the bottom of a ridiculously steep green hill, seen straight-on: a long zigzag stone stairway and footpath climbs all the way up to a tiny wooden youth hostel building perched on the very top of the hill against a bright blue sky with puffy clouds. A plain blank wooden signpost with an arrow pointing up. Late afternoon light. No people, no cars, no readable text. The bottom third is the open empty gravel lot for characters.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 유스호스텔 사장님 — 기본 (프런트에서 맞이)
- 저장: `episodes/01-hotel-motel-hostel/art/manager/normal.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00b, c01a, c03
- 메모: 사장님의 기준 그림. 이후 사장님 그림에 전부 ②로 첨부한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the youth hostel owner: a cheerful, sturdy Korean man in his early sixties who has hiked mountains all his life; short silver-gray hair, a tanned weathered face with smile lines and thick dark eyebrows, a dark-green fleece vest over a checked flannel shirt with rolled sleeves, beige cargo trousers and hiking boots, a lanyard with a blank plain name card (no text); calm, dry and kindly amused when he corrects grown-ups, never stern.

3/4 view turned slightly to the RIGHT. Standing upright with both hands resting on an unseen counter edge, a warm welcoming smile, head tilted a little.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 13. 유스호스텔 사장님 — 웃으며 바로잡기
- 저장: `episodes/01-hotel-motel-hostel/art/manager/correct.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/01-hotel-motel-hostel/art/manager/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00b, c02b, c04~c06b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the youth hostel owner: a cheerful, sturdy Korean man in his early sixties who has hiked mountains all his life; short silver-gray hair, a tanned weathered face with smile lines and thick dark eyebrows, a dark-green fleece vest over a checked flannel shirt with rolled sleeves, beige cargo trousers and hiking boots, a lanyard with a blank plain name card (no text); calm, dry and kindly amused when he corrects grown-ups, never stern.

3/4 view turned slightly to the RIGHT. One hand raised with the index finger up in a gentle "let me correct that" gesture, the other hand on his hip, one eyebrow raised, a patient amused smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 유스호스텔 사장님 — 방 열쇠 건네기
- 저장: `episodes/01-hotel-motel-hostel/art/manager/key.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/01-hotel-motel-hostel/art/manager/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c07b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the youth hostel owner: a cheerful, sturdy Korean man in his early sixties who has hiked mountains all his life; short silver-gray hair, a tanned weathered face with smile lines and thick dark eyebrows, a dark-green fleece vest over a checked flannel shirt with rolled sleeves, beige cargo trousers and hiking boots, a lanyard with a blank plain name card (no text); calm, dry and kindly amused when he corrects grown-ups, never stern.

3/4 view turned slightly to the RIGHT. Bending forward a little and holding out a big wooden room-key tag with an old brass key toward someone small, a kind grandfatherly smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 유스호스텔 사장님 — 언덕 아래를 가리키기 (반전)
- 저장: `episodes/01-hotel-motel-hostel/art/manager/point.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/01-hotel-motel-hostel/art/manager/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the youth hostel owner: a cheerful, sturdy Korean man in his early sixties who has hiked mountains all his life; short silver-gray hair, a tanned weathered face with smile lines and thick dark eyebrows, a dark-green fleece vest over a checked flannel shirt with rolled sleeves, beige cargo trousers and hiking boots, a lanyard with a blank plain name card (no text); calm, dry and kindly amused when he corrects grown-ups, never stern.

3/4 view turned slightly to the RIGHT. Pointing far down and away with one outstretched arm and thumb, the other hand cupped beside his mouth as if calling out, a cheerful deadpan grin.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 16. 사장님 바로잡기 (컷인)
- 저장: `episodes/01-hotel-motel-hostel/art/cutin/manager-correct.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/01-hotel-motel-hostel/art/manager/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00b, c02b, c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the youth hostel owner: a cheerful, sturdy Korean man in his early sixties who has hiked mountains all his life; short silver-gray hair, a tanned weathered face with smile lines and thick dark eyebrows, a dark-green fleece vest over a checked flannel shirt with rolled sleeves, beige cargo trousers and hiking boots, a lanyard with a blank plain name card (no text); calm, dry and kindly amused when he corrects grown-ups, never stern.

Chest-up close shot, facing slightly to the RIGHT. Index finger raised beside the face, one thick eyebrow lifted, a calm knowing smile with smile lines. Simple speed-line background.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 장면 — 아빠의 상상: 모 씨네 호텔 (모텔)
- 저장: `episodes/01-hotel-motel-hostel/art/full/mo-motel-imagine.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A ridiculously gaudy, over-the-top roadside hotel building at night in a cartoon daydream style: gold columns, a giant crown on the roof, rainbow spotlights sweeping the sky, a red carpet with velvet ropes, fireworks bursting overhead, and an enormous BLANK golden marquee sign board on the roof with no letters at all. Pastel pink sparkles everywhere like a daydream. No people, no readable text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 18. 소품 — 옛날 길손 숙소 (병원의 시작)
- 저장: `episodes/01-hotel-motel-hostel/art/prop/hospice.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small medieval European stone guest house seen straight from the front: an arched wooden door wide open with warm light inside, a lantern hanging by the door, a row of simple beds with white blankets visible through the doorway, a walking staff and a traveler's bundle leaning by the entrance. Slightly chubby, toy-like proportions. No people.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 19. 소품 — 나무 방 열쇠
- 저장: `episodes/01-hotel-motel-hostel/art/prop/room-key.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c07b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A big old brass room key attached by a ring to a chunky rounded wooden key tag (the tag is blank, no number or text). Slightly chubby, toy-like proportions.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 20. 소품 — 짐 가방 세 개
- 저장: `episodes/01-hotel-motel-hostel/art/prop/suitcases.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c08b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Three travel suitcases stacked in a wobbly tower: a big red hard-shell suitcase at the bottom, a blue duffel bag in the middle, a small yellow kid's backpack on top, with a stuffed toy peeking out. Slightly chubby, toy-like proportions.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 21. 소품 — 비구름과 번개 (1909년 폭풍)
- 저장: `episodes/01-hotel-motel-hostel/art/prop/storm.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A big dark-gray cartoon storm cloud pouring heavy rain, with two bright yellow zigzag lightning bolts shooting out of it. Slightly chubby, toy-like proportions. No people.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 22. 컷인 — 아빠 부끄러움 (모텔 질문)
- 저장: `episodes/01-hotel-motel-hostel/art/cutin/dad-shy.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c05b-1

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the LEFT. Painfully embarrassed: face flushed bright red up to the ears, eyes squeezed into wobbly lines looking away, an awkward wavy-lipped smile, both index fingers poking together shyly in front of his chest, steam puffing from his head, cold sweat drops. Comic, innocent, never suggestive.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 23. 소품 — 부끄러워 간판을 가리는 모텔 건물
- 저장: `episodes/01-hotel-motel-hostel/art/prop/motel-shy.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06b-2

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The same low single-storey American roadside motel building as a cute cartoon character: two windows as big shy eyes squeezed shut, rosy pink blushing cheeks painted on the wall, two little cartoon arms covering its tall blank neon arrow sign on the roof, a few sweat drops and tiny heart-free sparkle marks. Slightly chubby, toy-like proportions. Innocent and funny, never suggestive. No people, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 9장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep01` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 모텔 카운터 (회상) | `episodes/01-hotel-motel-hostel/art/bg/motel-counter.png` |
| 2 | 젊은 시절 아빠 — 카운터 앞에서 굳음 (회상) | `episodes/01-hotel-motel-hostel/art/char/dad-young.png` |
| 3 | 장면 — 귀족의 저택에서 시작된 호텔 | `episodes/01-hotel-motel-hostel/art/full/hotel-mansion.png` |
| 4 | 장면 — 자동차 여행객을 위한 모텔 | `episodes/01-hotel-motel-hostel/art/full/motel-1920s.png` |
| 5 | 장면 — 1912년, 한 교사가 만든 유스호스텔 | `episodes/01-hotel-motel-hostel/art/full/hostel-1912.png` |
| 6 | 소품 — 호텔 건물 | `episodes/01-hotel-motel-hostel/art/prop/hotel.png` |
| 7 | 소품 — 모텔 건물 | `episodes/01-hotel-motel-hostel/art/prop/motel.png` |
| 8 | 소품 — 유스호스텔 건물 | `episodes/01-hotel-motel-hostel/art/prop/hostel.png` |
| 9 | 장면 — 다음 편 예고 (아파트 · 빌라 · 오피스텔) | `episodes/01-hotel-motel-hostel/art/full/next-teaser.png` |
