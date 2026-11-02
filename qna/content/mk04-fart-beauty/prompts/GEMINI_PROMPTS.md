# Gemini 프롬프트 — 모덕후 ④ 방귀 · 예쁜 사람도 지독할까 — 잡지 화보 패러디

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk04-fart-beauty/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 15장. 진행: 6 / 15
> 다 넣었으면 `video/` 에서 `npm run make -- mk04` → `video/out/mk04/mk04.mp4`

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
| ✅ | 아빠 — 당황 | `content/_common/art/dad/panic.png` |
| ✅ | 아빠 — 생각 | `content/_common/art/dad/think.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |

---

## 1. 아직 없는 그림 — 9장 (이것만 Gemini 에서 만든다)

#### 7. 성분 원그래프 도감 — 졸린 회색 무취 구름들 + 아주 작은 조각의 노란 황 가스 악당
- 저장: `content/mk04-fart-beauty/art/full/gas-pie.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute science-encyclopedia style illustration: a big round pie chart floating on a pale background. Almost the whole pie is made of fluffy soft grey and pale blue cloud characters with closed sleepy eyes and peaceful smiles, dozing together. One tiny thin slice of the pie is bright yellow and in it stands a small cute yellow sulfur-gas villain: a little round yellow puff with a cracked white eggshell cap on its head, tiny arms on its hips, a mischievous toothy grin and faint wavy stink lines rising from it. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 화보 잡지 표지 패러디 — 장미 · 후광 속 얼굴 없는 여신 뒷모습, 표지를 든 삼촌
- 저장: `content/mk04-fart-beauty/art/full/goddess-cover.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk04-fart-beauty/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00, c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Close view of a glossy fashion magazine held up in both hands by the uncle, whose fogged-up white glasses and red cheeks peek over the top edge of the magazine. The cover shows an elegant woman seen ONLY from behind as a soft simple silhouette with long flowing hair and a long gown, surrounded by drifting red rose petals, sparkles and a golden halo glow, dreamy pink studio light. Her face is never shown. The magazine has no readable title or text. The uncle stays in the exact gag-manga cartoon style of the attached images.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 하루 시계 둘레 작은 방귀 구름 10개 + 남녀노소 실루엣 네 명이 같은 팻말
- 저장: `content/mk04-fart-beauty/art/full/ten-a-day.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cheerful infographic illustration: a big round wall clock in the center with ten small fluffy cartoon gas clouds evenly spaced around its rim like hour marks, each with a tiny cute face. Below it stand four simple flat dark silhouettes side by side in a row: a man, a woman, an old man with a cane and an old woman, each holding up an identical blank round sign. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image; the four silhouettes are plain flat shapes with no faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 오디션 심사석 패러디 — 코 집게 심사위원 둘, 저울 위 유리병 둘 수평, 무승부 깃발
- 저장: `content/mk04-fart-beauty/art/full/judges.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk04-fart-beauty/art/full/gas-pie.png` (황 가스 악당 기준 (gas-pie))
- ⚠️ 첨부 그림이 아직 없다: content/mk04-fart-beauty/art/full/gas-pie.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A comic TV-audition style scene: behind a long judges table sit two judges drawn as simple round-headed cartoon figures in suits with big wooden clothespins clamped on their noses, eyes watering, each holding up a blank scorecard. On the stage in front of them is a big brass balance scale perfectly level; on one pan a small glass jar with a dense dark-yellow little cloud inside, on the other pan a large glass jar with a big pale-yellow cloud inside, and a tiny checkered flag planted between them. the same small cute yellow sulfur-gas villain character as in the attached gas-pie picture (a little round yellow puff with a cracked white eggshell cap and a mischievous grin) peeks out of each jar. Same line weight and coloring as the attached images. Do NOT copy any person from the attached images. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 고기 산더미 접시에서 황 가스 악당들이 줄줄이 튀어나옴 + 영수증
- 저장: `content/mk04-fart-beauty/art/full/meat-plate.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk04-fart-beauty/art/full/gas-pie.png` (황 가스 악당 기준 (gas-pie))
- ⚠️ 첨부 그림이 아직 없다: content/mk04-fart-beauty/art/full/gas-pie.png (그 그림부터 뽑는다)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A big white plate piled high with sizzling grilled Korean pork belly slices, steam rising. Out of the meat pile pop a whole line of copies of the same small cute yellow sulfur-gas villain character as in the attached gas-pie picture (a little round yellow puff with a cracked white eggshell cap and a mischievous grin), multiplying, cheering and jumping off the plate one after another. Beside the plate lies a long crumpled restaurant receipt with blank lines. Do NOT draw any people or human faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 뇌 보정실 — 뇌 캐릭터가 화보에 후광 · 장미 · 반짝이를 덧칠
- 저장: `content/mk04-fart-beauty/art/full/halo-brain.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute cartoon photo-retouching studio: a round pink brain character with tiny arms and legs, wearing a beret and an apron, stands on a step stool in front of a big easel holding a plain grey framed picture of a simple faceless dark silhouette of a woman seen from behind. The brain eagerly paints a golden halo, red roses and sparkles over the picture with a big brush in one hand and a glitter spray can in the other, perfume bottles lined up on a shelf behind it. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image; the silhouette in the frame is a plain flat shape with no face. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 엔딩 — 소파의 엄마 · 아빠, 엄마 옆 작은 구름, 아빠 평온한 미소, 문틈의 삼촌 꿀꺽
- 저장: `content/mk04-fart-beauty/art/full/sofa-couple.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/mk04-fart-beauty/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

A warm Korean apartment living room in the evening: the mom and the dad sit side by side on a sofa. Next to the mom floats one small cute pale cartoon gas cloud with a tiny face; the mom covers her mouth with one hand, embarrassed and giggling. The dad smiles calmly and lovingly at her with gentle eyes as if nothing happened, a few small hearts above them. In the background a room door is open a crack and the uncle peeks through it, glasses fogged white, cheeks red, swallowing hard with a comic gulp. All people stay in the exact gag-manga cartoon style of the attached images. No text, no letters, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 삼촌 — 자기 방귀 구름을 장미 꽃잎으로 둘러싸고 흐뭇하게 킁킁
- 저장: `content/mk04-fart-beauty/art/modeokhu/rose.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk04-fart-beauty/art/modeokhu/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

3/4 view turned slightly to the RIGHT. Standing, with a small fluffy pale cartoon gas cloud floating behind him at waist height, ringed with red rose petals and sparkles. He leans back toward it, eyes closed in bliss, nose up sniffing deeply with a dreamy proud smile, one hand fanning the air toward his nose, glasses glinting. Silly and self-satisfied, fully clothed.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 소품 — 장미 꽃잎이 둘린 방귀 구름, 반짝, 뒤에서 황 가스 악당이 빼꼼 (썸네일)
- 저장: `content/mk04-fart-beauty/art/prop/rose-cloud.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품)), ② `content/mk04-fart-beauty/art/full/gas-pie.png` (황 가스 악당 기준 (gas-pie))
- ⚠️ 첨부 그림이 아직 없다: content/mk04-fart-beauty/art/full/gas-pie.png (그 그림부터 뽑는다)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00, 썸네일

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single cute sticker of a fluffy pale pink cartoon gas cloud with a sweet innocent face, ringed with glossy red rose petals and star sparkles like a beauty magazine glamour shot, while from behind the cloud the same small cute yellow sulfur-gas villain character as in the attached gas-pie picture (a little round yellow puff with a cracked white eggshell cap and a mischievous grin) peeks out with a sneaky grin.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 6장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk04` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리키며 "자, 진지하다" (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/modeokhu/point.png` |
| 3 | 모덕후 삼촌 — 결론, 팔짱 끼고 의기양양 (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/modeokhu/proud.png` |
| 4 | 삼촌 — "…논문으로." 시선 피하며 안경 고쳐 쓰기 (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/modeokhu/fluster.png` |
| 5 | 삼촌 컷인 — 꿀꺽 (김 서린 안경 · 빨개진 볼) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/cutin/uncle-gulp.png` |
| 6 | 배경 — 삼촌의 밤 원룸 (책 더미 · 피규어 · 컵라면 · TV 불빛) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk04-fart-beauty/art/bg/oneroom.png` |
