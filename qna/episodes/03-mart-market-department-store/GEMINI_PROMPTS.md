# Gemini 프롬프트 — 3편 · 마트 · 시장 · 백화점, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep03/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 21장. 진행: 21 / 21
> 다 넣었으면 `video/` 에서 `npm run make -- ep03` → `video/out/ep03/ep03.mp4`

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
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 아빠 — 설명 | `art/common/dad/explain.png` |
| ✅ | 아빠 — 생각 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 몰래 검색 | `art/common/dad/search.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 의심 | `art/common/kid/doubt.png` |
| ✅ | 아이 — 웃음 | `art/common/kid/laugh.png` |
| ✅ | 컷인 — 아빠 당황 | `art/common/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `art/common/cutin/kid-doubt.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `art/common/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `art/common/kid/ask-b.png` |

---

## 1. 이 편의 그림

#### 1. 배경 — 전통시장 골목 ✅
- 저장: `episodes/03-mart-market-department-store/art/bg/market-alley.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00–c04, c06, c11–c14
- 영상에서의 움직임: 컷 내내 천천히 당겨지고, 집에 가는 장면에서는 옆으로 밀린다. 인물은 아래 1/3에 따로 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A covered traditional Korean market alley in the daytime, seen straight-on like a stage set. A clean, cheerful, well-kept market that looks like a lovely place to visit. Along the back wall, a row of small shops and stalls: striped awnings, hanging dried fish and garlic braids, stacked plastic baskets of vegetables and fruit, a rice-cake shop with steam, bare light bulbs strung overhead under a translucent arcade roof. The ground is plain gray concrete paving, open and empty across the whole bottom third. Warm, lively, colorful and inviting, with bunting and neatly arranged goods.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 2. 앞쪽 레이어 — 채소 좌판 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/stall-front.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 앞쪽 레이어 (배우를 가리는 물건, 초록 배경) · 16:9
- 쓰이는 컷: c00–c03b, c06, c11–c13
- 영상에서의 움직임: 할머니 앞에 놓인다. 할머니가 이 뒤에서 솟아오른다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a foreground layer for a 2D animated video: one wide object seen straight-on from the front, which will be placed IN FRONT of the characters so that they appear to stand behind it. No people.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A low wooden vegetable stall table seen from the front, about waist height: a weathered wooden front panel and legs, and on top a crowded row of red and green plastic baskets heaped with bean sprouts, napa cabbage, green onions, radishes and garlic, with one old hanging scale at the left end. The top edge of the vegetables forms a bumpy line; nothing rises higher than the baskets.

The object spans most of the picture width and sits in the lower half; everything above and around it is empty. The whole object visible, not cropped. 16:9 landscape.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 할머니 — 기본 ✅
- 저장: `episodes/03-mart-market-department-store/art/granny/normal.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c06, c11, c12
- 영상에서의 움직임: 숨 쉬듯 살짝 움직이고, 말할 때 까딱거린다.
- 메모: 할머니의 기준 그림. 이후 할머니 그림에 전부 ②로 첨부한다. 허리 아래는 좌판에 가려지니 윗몸이 잘 보이게. 인상 쓰는 얼굴이 아니라 반갑게 웃는 얼굴이어야 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

3/4 view, body and face turned slightly to the RIGHT. Standing with both fists on her hips, chin up, greeting a customer with a big warm welcoming grin that shows the gold tooth, eyes crinkled into friendly crescents, rosy cheeks. She looks like everyone's favourite grandmother. NOT frowning, NOT scowling, no anger marks.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 할머니 — 입담 ✅
- 저장: `episodes/03-mart-market-department-store/art/granny/banter.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/03-mart-market-department-store/art/granny/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c02, c03, c06, c13
- 영상에서의 움직임: 좌판 뒤에서 솟아오르고, 말하는 동안 좌우로 흔들린다.
- 메모: 화난 얼굴이 아니다. 호탕하게 웃으며 한 수 가르치는 얼굴이다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

3/4 view turned slightly to the RIGHT. Lecturing a customer loudly and cheerfully, like a comedian mid-punchline: leaning forward, mouth stretched enormously wide open in a big talking grin showing teeth, the gold tooth and tongue, eyebrows raised high, eyes bright and twinkling, one arm raised high wagging a bundle of green onions like a teacher's pointer, the other hand planted on her hip. Playful and confident, clearly enjoying herself. NOT angry: no veins, no anger marks, no frown.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 5. 할머니 — 입담 (말하는 그림) ✅
- 저장: `episodes/03-mart-market-department-store/art/granny/banter-b.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/03-mart-market-department-store/art/granny/banter.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 쓰이는 컷: c00, c02, c03, c06, c13
- 영상에서의 움직임: 입담 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

Change only the face: the mouth is now half closed in a wide closed-lip grin (as if between two words), and one eye is winking. The raised arm with the green onions is tilted a few degrees further back.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 할머니 — 껄껄 ✅
- 저장: `episodes/03-mart-market-department-store/art/granny/laugh.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/03-mart-market-department-store/art/granny/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03b, c12, c13
- 영상에서의 움직임: 표정이 바뀌는 순간 젤리처럼 튄다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

3/4 view turned slightly to the RIGHT. Cackling with delight: head thrown back, mouth wide open in a huge laugh showing the gold tooth, eyes squeezed into happy crescents with deep laugh wrinkles, one hand slapping her own knee and the other pointing forward at someone.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 할머니 — 덤 얹어 주기 ✅
- 저장: `episodes/03-mart-market-department-store/art/granny/give.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/03-mart-market-department-store/art/granny/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c06, c12b
- 영상에서의 움직임: 콩나물 봉지가 손 옆에서 톡 튀어나온다 (봉지는 따로 그린다).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

3/4 view turned slightly to the RIGHT. Giving a generous extra: leaning forward with one arm stretched far out to the right, the hand holding out a big heaped handful of bean sprouts, the other hand waving as if saying 'go on, take it'. A wide, generous, slightly bashful smile with warm crinkled eyes and rosy cheeks. NOT frowning.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 컷인 — 할머니 입담 ✅
- 저장: `episodes/03-mart-market-department-store/art/cutin/granny-banter.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/03-mart-market-department-store/art/granny/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00, c02, c03
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the market grandmother: a small, sturdy Korean grandmother in her seventies who has run a vegetable stall all her life; tightly permed short gray-purple hair, soft round face with laugh wrinkles and rosy cheeks, warm natural skin tone (not red, not sweaty), bright crinkly eyes and a huge loud laughing mouth with one gold tooth; wearing a flower-patterned quilted vest over a bright purple long-sleeved top, a red money apron (fanny pack) tied around her waist, baggy flower-print work trousers and black rubber shoes; loud, quick-witted and always teasing her customers, but obviously kind and big-hearted; her face is cheerful, never mean.

Facing slightly to the RIGHT. A gloriously loud, triumphant talking face: mouth stretched to an impossible size in a huge grin showing every tooth, the gold tooth glinting with a sparkle, one eyebrow cocked sky-high, eyes twinkling with mischief, permed hair bouncing, one finger raised beside her face as if making a winning point. Funny and lovable, not angry and not scary.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 소품 — 뻥튀기 기계 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/ppeongtwigi.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04
- 영상에서의 움직임: 아빠 앞에 놓여 아빠를 가린다. '뻥!' 할 때 화면이 번쩍인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

An old-fashioned Korean puffed-rice machine (ppeongtwigi): a black cast-iron rotating drum cannon with a pressure gauge and a crank handle, mounted on a small rusty wheeled frame with a gas burner underneath, and a long wire-mesh catching cage attached to its mouth, a few puffed rice grains scattered around. Seen from the side, chunky and solid, about as tall as an adult's waist.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 10. 소품 — 콩나물 봉지 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/bean-sprouts.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06, c12b
- 영상에서의 움직임: 톡 튀어나와 둥둥 떠 있는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A translucent black plastic market bag stuffed to overflowing with fresh bean sprouts, yellow heads and white stems bursting out of the top, a few sprouts falling off, tiny sparkle marks around it.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 11. 소품 — 빈 가격표 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/price-tag.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c07
- 영상에서의 움직임: 위에서 뚝 떨어진 뒤 두근두근 커졌다 작아진다. 숫자는 영상에서 얹지 않는다(빈 표).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One huge old-fashioned paper price tag: cream-colored card with a reinforced punched hole and a loop of red string, slightly curled corners, completely blank (no numbers, no writing), with small shine marks.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 12. 소품 — 부시코 (1852년 파리의 상인) ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/boucicaut.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 2:3
- 쓰이는 컷: c07
- 영상에서의 움직임: 오른쪽에서 미끄러져 들어와 좌우로 까딱거린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One person: a French shop owner of the 1850s, a middle-aged white European man with big mutton-chop sideburns and a balding head, in a black frock coat, waistcoat and cravat. Full body, 3/4 view turned slightly to the LEFT, standing proudly on tiptoe with a salesman's enormous toothy grin, one hand presenting forward with an open palm and the other holding up a string of small blank paper tags like a trophy.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 2:3.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 13. 소품 — 장터를 옮겨 다니는 상인 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/peddler.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 2:3
- 쓰이는 컷: c05
- 영상에서의 움직임: 화면 왼쪽 밖에서 오른쪽으로 걸어서 지나간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One person: a Joseon-era Korean travelling peddler, a wiry sunburnt man in a white hanbok jacket and trousers with straw sandals and a straw hat (paeraengi) with a cotton ball on top. Full body, pure side view walking to the RIGHT in mid-stride, bent forward under a towering A-frame carrier (jige) on his back piled absurdly high with pots, bundles and dried fish, a walking stick in one hand, sweat flying, a determined grin.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 2:3.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 소품 — 상자 가득한 카트 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/cart.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c09, c10
- 영상에서의 움직임: 화면 왼쪽 밖에서 굴러 들어와 지나간다. 한 문장 정리 컷에서는 '마트' 칸에 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A big metal supermarket shopping cart seen from the side, facing RIGHT, piled far too high with identical plain cardboard boxes and bulk packs (blank, no labels), one box about to fall off the top, small speed lines behind the wheels.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 소품 — 백화점 쇼핑백 ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/shopping-bag.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c08, c10
- 영상에서의 움직임: 톡 튀어나와 둥둥 떠 있는다. 한 문장 정리 컷에서는 '백화점' 칸에 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One luxurious glossy department-store paper shopping bag with rope handles and a ribbon, deep navy with gold trim, tissue paper peeking out of the top, completely blank (no logo, no text), with elegant sparkle marks.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 16. 소품 — 시장 좌판 (한 문장 정리용) ✅
- 저장: `episodes/03-mart-market-department-store/art/prop/icon-market.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c10
- 영상에서의 움직임: 한 문장 정리 컷의 '시장' 칸에 켜지면서 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One small traditional market stall as a single compact object: a wooden table under a red-and-white striped parasol, baskets of vegetables on it, an old hanging scale and a bare light bulb. No people.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 무대 — 조선 후기 오일장 ✅
- 저장: `episodes/03-mart-market-department-store/art/full/five-day-market.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 무대 장면 (16:9, 주인공 없이 — 주인공은 따로 오려 넣는다) · 16:9
- 쓰이는 컷: c05
- 영상에서의 움직임: 배경이 오른쪽으로 천천히 밀리고, 그 앞을 상인(따로 그린 그림)이 걸어서 지나간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is the stage for an animated scene, composed like a single manga panel. The main character is NOT in this picture: it is drawn separately and placed on top later, so leave the described spot empty.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A bustling Joseon-era Korean five-day market in an open dirt field beside thatched-roof houses, mountains behind. In the upper two-thirds: crowds of people in white hanbok haggling with comically exaggerated faces, straw mats covered with pottery, grain sacks, chickens in baskets, an ox, a rice-cake seller, banners that are blank cloth. The lower third is an empty dirt road running across the whole picture from left to right, with nobody on it: a walking figure will be added there later.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 18. 무대 — 1852년 파리, 봉 마르셰 ✅
- 저장: `episodes/03-mart-market-department-store/art/full/bon-marche.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 무대 장면 (16:9, 주인공 없이 — 주인공은 따로 오려 넣는다) · 16:9
- 쓰이는 컷: c07
- 영상에서의 움직임: 배경이 왼쪽으로 천천히 밀리고, 오른쪽 빈자리에 상인(따로 그린 그림)이 들어온다. 왼쪽 위쪽에는 가격표가 떨어진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is the stage for an animated scene, composed like a single manga panel. The main character is NOT in this picture: it is drawn separately and placed on top later, so leave the described spot empty.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The interior of a grand Paris department store in the 1850s: a soaring hall with iron-and-glass skylight, sweeping staircases, long polished counters piled with rolls of fabric, hats and gloves, every item carrying a small blank paper tag on a string. On the left, a crowd of elegant Parisian ladies in crinoline dresses and gentlemen in top hats gasp with comically shocked faces at the tags, one lady fainting. The right third of the picture is an empty stretch of floor in front of a counter: the shop owner will be added there later.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 19. 장면 — 백화점은 고급스러운 건물주 ✅
- 저장: `episodes/03-mart-market-department-store/art/full/dept-floors.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c08
- 영상에서의 움직임: 배경이 위로 천천히 밀린다 (1층에서 꼭대기 층으로 올라가는 느낌).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A tall, elegant department store building shown as a cutaway doll's-house cross-section, five floors high. Every floor is divided into separate little boutique booths, each a different color with its own tiny shop clerk in a different uniform standing behind a counter with blank signs. On the roof, a giant smug figure in a tuxedo and monocle (the building itself personified as a landlord) lounges in an armchair, catching gold coins that float up from every booth through little chutes. Bright, glossy, luxurious.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 20. 무대 — 1993년, 첫 대형 할인점 ✅
- 저장: `episodes/03-mart-market-department-store/art/full/mart-1993.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 무대 장면 (16:9, 주인공 없이 — 주인공은 따로 오려 넣는다) · 16:9
- 쓰이는 컷: c09
- 영상에서의 움직임: 배경이 오른쪽으로 천천히 밀리고, 그 앞으로 카트(따로 그린 그림)가 굴러 지나간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is the stage for an animated scene, composed like a single manga panel. The main character is NOT in this picture: it is drawn separately and placed on top later, so leave the described spot empty.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Inside a huge Korean warehouse-style discount store in 1993: towering steel shelves stacked to the ceiling with identical cardboard boxes and bulk packs (all blank), fluorescent strip lights, big blank hanging sale banners. In the upper two-thirds, Korean families in early-1990s clothes (permed hair, shoulder pads, a dad in a windbreaker) stare upward with stunned, sparkling-eyed faces, a child sitting in a cart seat pointing up. The lower third is an empty shiny aisle floor running across the whole picture: a rolling cart will be added there later.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 21. 장면 — 다음 편 예고 (털) ✅
- 저장: `episodes/03-mart-market-department-store/art/full/next-teaser.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c15, 끝 화면
- 영상에서의 움직임: 배경이 왼쪽으로 천천히 밀린다. 끝 화면에서는 흐리게 깔린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A quiet, slightly out-of-focus neighborhood street at sunset with a public bathhouse building in the distance (a tall chimney with steam, a blank sign). In the foreground at the bottom, seen from behind and only from the knees down: the dad's two hairy calves in shorts and slippers next to the kid's two small smooth calves in white socks, walking side by side, one black market bag of bean sprouts hanging between them. A big glossy question mark floats in the sky. No faces.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```
