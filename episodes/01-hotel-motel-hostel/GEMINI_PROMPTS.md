# Gemini 프롬프트 — 1편 · 호텔 · 모텔 · 유스호스텔, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep01/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 9장. 진행: 9 / 9
> 다 넣었으면 `video/` 에서 `npm run make -- ep01` → `video/out/ep01/ep01.mp4`

## 사용법

1. 위에서부터 **차례대로** 한 블록씩 Gemini에 붙여넣는다. 화풍 문장은 블록마다 이미 들어 있다.
2. 블록의 **첨부** 이미지를 같이 올린다. ①은 화풍 고정용 앵커, ②는 같은 사람 유지용 기준 그림이다 (순서 중요).
3. 결과는 **저장** 경로와 이름 그대로 넣는다. 배경 제거·자르기·크기 조절은 하지 않는다 (`npm run art` 가 한다).
4. 한 사람은 **한 대화창**에서 끝내고, 다음 사람·배경은 새 대화창에서 시작한다. 대화가 길어지면 화풍이 흐려진다.
5. 글자는 그리지 않는다. 자막·간판·연도는 영상 코드가 얹는다.
6. 제목 옆 ✅ 는 이미 파일이 있다는 뜻이다 (`npm run prompts` 를 다시 돌리면 갱신된다).

### 다시 뽑을 때 이어서 보내는 문장

| 문제 | 문장 |
|---|---|
| 배경이 단색 초록이 아님 | `Redo it with a perfectly flat pure green #00FF00 background, no shadow, no floor.` |
| 몸이 잘림 | `Zoom out so the whole body fits with empty margin on every side.` |
| 다른 사람처럼 나옴 | `Keep the exact same face, hair and clothes as attached image 2. Only change the pose.` |
| 글자가 들어감 | `Remove all text and letters; leave signs blank.` |
| 화풍이 순해짐 | `More grotesque gag-manga exaggeration, like the first attached image: bigger mouth, bulging eyes, more sweat.` |
| 배경에 사람이 있음 | `Remove every person. Background only.` |

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

---

## 1. 이 편의 그림

#### 1. 배경 — 모텔 카운터 (회상) ✅
- 저장: `episodes/01-hotel-motel-hostel/art/bg/motel-counter.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c03f 회상

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The cramped front lobby of an old Korean motel around 2010, late at night: a small reception window with a sliding frosted-glass hatch set in the back wall on the right, a key rack with numbered wooden key tags (no numbers drawn) behind it, a tacky fake potted palm, a red carpet, pink-purple neon light spilling in from the left.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 2. 젊은 시절 아빠 — 카운터 앞에서 굳음 (회상) ✅
- 저장: `episodes/01-hotel-motel-hostel/art/char/dad-young.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03f 회상
- 메모: 같은 사람의 10년 전. 머리숱만 많고 옷이 다르다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The same man about ten years younger: a full head of thick black hair, slimmer, wearing a navy padded jacket and jeans instead of the cardigan. 3/4 view turned slightly to the RIGHT. Frozen stiff with embarrassment at a counter: shoulders up to his ears, face bright red, eyes wide and staring at nothing, a rigid clenched-teeth smile, one hand holding out a credit card that is slipping from his trembling fingers, cold sweat flying.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 장면 — 귀족의 저택에서 시작된 호텔 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/full/hotel-mansion.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

18th-century France. A grand aristocratic townhouse (hôtel particulier) with a red mansard roof, tall arched windows and a stone gate. A pompous French nobleman in a powdered wig and embroidered coat steps down from a horse-drawn carriage with his nose in the air, while a bowing butler holds the front door open and a servant staggers under a ridiculous tower of luggage. European people, daytime, warm light.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 4. 장면 — 자동차 여행객을 위한 모텔 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/full/motel-1920s.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

1920s America, a desert highway at dusk. A long single-storey roadside motor inn with a row of identical doors, and a black Ford Model T parked directly in front of one door. A dusty, exhausted American driver in a flat cap and driving goggles stands yawning hugely next to the car, one hand still on the car door and the other already reaching for the room door, to show that the bed is one step from the car. A blank roadside sign on a pole. American people.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 5. 장면 — 1912년, 한 교사가 만든 유스호스텔 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/full/hostel-1912.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Germany, 1912, green hills. A cheerful German schoolteacher with a big moustache, round glasses, a felt hat, knee breeches and a walking stick marches at the front, pointing proudly ahead at an old stone castle-like school building on a hill. Behind him a line of five tired but excited schoolchildren with huge backpacks and walking sticks follow in single file, one of them lagging and gasping. European people, bright daytime.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 6. 소품 — 호텔 건물 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/prop/hotel.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04, c08, 썸네일

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A grand classic luxury hotel building seen straight from the front: several storeys, a red mansard roof, a golden revolving door with a red carpet and a small canopy, flags on the roof. Slightly chubby, toy-like proportions. No people.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 소품 — 모텔 건물 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/prop/motel.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04, c08, 썸네일

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A low single-storey American roadside motel seen straight from the front: a row of three doors, a flat roof with a tall blank neon arrow sign, and a small vintage car parked right in front of a door. Slightly chubby, toy-like proportions. No people.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 소품 — 유스호스텔 건물 ✅
- 저장: `episodes/01-hotel-motel-hostel/art/prop/hostel.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04, c08, 썸네일

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A friendly two-storey youth hostel seen straight from the front: timber-framed walls, a steep green roof, a wide open wooden door, and a pile of colorful hiking backpacks and walking sticks leaning by the entrance. Slightly chubby, toy-like proportions. No people.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 장면 — 다음 편 예고 (아파트 · 빌라 · 오피스텔) ✅
- 저장: `episodes/01-hotel-motel-hostel/art/full/next-teaser.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c10b, 끝 화면

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A Korean city street at dusk with three very different buildings standing side by side and filling the frame: on the left a tall slab-shaped apartment block with many identical balconies, in the middle a small four-storey red-brick villa with an open pilotis car park on the ground floor, on the right a slim glass officetel tower. A huge cartoon question mark shape floats in the sky above them. No people.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```
