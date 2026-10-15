# Gemini 프롬프트 — 4편 · 아빠는 왜 거기에 털이 나요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep04/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 26장. 진행: 0 / 26
> 다 넣었으면 `video/` 에서 `npm run make -- ep04` → `video/out/ep04/ep04.mp4`

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

#### 1. 배경 — 동네 이발소 안
- 저장: `episodes/04-body-hair/art/bg/barbershop.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00, c03, c03b, c03c, c04, c06b, c09, c09b, c10, c10c, c13b
- 영상에서의 움직임: 컷 내내 천천히 당겨진다. 이발 의자에 앉은 아빠 · 이발사 할아버지 · 아이는 아래 1/3에 따로 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The inside of an old, tiny, spotless Korean neighborhood barbershop from the 1980s that is still running today, seen straight-on like a sitcom set. Across the back wall: one huge wide mirror in a chrome frame, under it a long white counter with glass jars of blue disinfectant holding combs, a hair clipper, a shaving brush in a mug, a hot towel steamer, bottles of hair tonic; above the mirror a row of faded framed hairstyle posters (blank, no faces readable), a round wall clock, a small TV on a corner shelf, a potted plant, and a window on the right letting in warm afternoon sunlight. A little cut hair is swept into a pile near a broom in the corner. The floor is a checkerboard of cream and pale green tiles, open and empty across the whole bottom third: the barber chair and people will be added there later. Warm, nostalgic, cozy and clean.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 2. 배경 — 이발소 앞 (해 질 녘)
- 저장: `episodes/04-body-hair/art/bg/barbershop-front.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c12, c13, c14
- 영상에서의 움직임: 6번 박자에서는 거의 움직이지 않고 아주 천천히 당겨진다. 집에 가는 장면에서는 옆으로 밀린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The outside of the same small Korean neighborhood barbershop at golden sunset, seen straight-on: a narrow shop front with a glass door and window (blank sign board above, no text), a classic red-white-blue striped barber pole glowing beside the door, a low wooden bench in front of the window, a few potted plants, an old bicycle leaning on the wall, a quiet alley with low houses and tangled electric wires behind, a soft orange-pink sky. The pavement in front is open and empty across the whole bottom third: people will be added there later. Calm, warm and gentle.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 3. 장면 — 샤워 중인 욕실 문 (사람은 안 보인다)
- 저장: `episodes/04-body-hair/art/full/bathroom-door.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c01, c02
- 영상에서의 움직임: 문틈 김이 보이는 채로 천천히 당겨진다. 말소리만 문 너머에서 들린다. 사람은 절대 그리지 않는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cozy Korean apartment hallway at night, looking straight at a CLOSED white bathroom door. Warm light glows through the frosted glass panel of the door and through the gap underneath, and thick white steam puffs out from the gap and the top edge. In front of the door on the floor: a pair of big gray adult bath slippers and a pair of tiny red kid's bath slippers, side by side, plus a yellow rubber duck that fell out. On the door handle hangs a fluffy towel. Little water-drop and steam squiggle marks float in the air. No people are visible at all: nobody, no silhouettes, no bodies, no reflections. Funny and warm, like the outside of a sitcom bathroom scene.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 4. 아빠 — 이발 의자 (보자기)
- 저장: `episodes/04-body-hair/art/dad/cape.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c03, c06b, c09, c09b, c10, c10c
- 영상에서의 움직임: 제자리에 앉아 있고, 말할 때 까딱거린다. 표정이 바뀌면 젤리처럼 튄다.
- 메모: 의자째 한 장으로 그린다. 몸은 흰 보자기에 덮여 목 아래가 안 보인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view, body and face turned slightly to the LEFT. Sitting in an old red leather barber chair with chrome armrests and a chrome footrest, the whole body below the neck wrapped in a big white barber cape fastened at the neck, so only his head and his slippers show. His hair is half cut, a few cut hairs stuck on the cape. Sitting obediently and stiffly, a polite slightly nervous smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 5. 아빠 — 이발 의자에서 당황
- 저장: `episodes/04-body-hair/art/dad/cape-panic.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/dad/cape.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c03, c03b, c03c, c09b, c10c
- 영상에서의 움직임: 부들부들 떨고, 보자기 속으로 쑥 들어가려는 느낌.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Same barber chair and white cape, 3/4 view turned slightly to the LEFT. He has just heard his kid say something embarrassing out loud in public: sinking down into the cape up to his nose like a turtle, eyes darting sideways, forced crooked smile, face bright red, cold sweat drops flying off his forehead, the cape bunched up around his chin.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 아빠 — 보자기 속 몰래 검색
- 저장: `episodes/04-body-hair/art/dad/cape-search.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/dad/cape.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c04
- 영상에서의 움직임: 제자리에서 들썩거린다.
- 메모: 편마다 나오는 '몰래 검색' 장면을 이번에는 이발 보자기 속에서 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Same barber chair, 3/4 view turned slightly to the LEFT. He has pulled the white barber cape up over his head like a little tent; his face peeks out from inside it, lit eerily from below by the glow of a smartphone he holds under the cape with both hands, eyes wide and bloodshot, lips pressed tight, glancing sideways nervously, cold sweat drops.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 이발사 할아버지 — 기본
- 저장: `episodes/04-body-hair/art/barber/normal.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00, c03, c06b, c09, c13b
- 영상에서의 움직임: 숨 쉬듯 살짝 움직이고, 말할 때 까딱거린다.
- 메모: 할아버지의 기준 그림. 이후 할아버지 그림에 전부 ②로 첨부한다. 정수리는 반짝이는 대머리, 옆 · 뒤만 흰 머리가 말굽 모양으로 남아 있어야 하고, 셔츠 깃 사이로 흰 가슴털이 보여야 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

3/4 view, body and face turned slightly to the LEFT. Standing relaxed and proud, scissors in one raised hand snipping the air, a comb in the other, a calm warm smile under the white mustache, eyes crinkled. The shiny bald top of his head has a bright highlight. The chest hair tuft clearly shows in the open collar.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 이발사 할아버지 — 한 수 가르치기
- 저장: `episodes/04-body-hair/art/barber/talk.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03, c03b, c03c, c06b, c09, c09b, c10c
- 영상에서의 움직임: 말하는 동안 가위를 지휘봉처럼 흔들며 좌우로 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

3/4 view turned slightly to the LEFT. Explaining like a wise old master with a twinkle: leaning forward, mouth open mid-sentence in a big grin under the mustache, bushy eyebrows raised high, one hand raising the scissors like a teacher's pointer, the other hand behind his back. Playful and confident, kind.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 이발사 할아버지 — 한 수 가르치기 (말하는 그림)
- 저장: `episodes/04-body-hair/art/barber/talk-b.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/talk.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 쓰이는 컷: c03, c03b, c03c, c06b, c09, c09b, c10c
- 영상에서의 움직임: 한 수 가르치기 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

Change only the face and the raised hand: the mouth is now closed in a smug closed-lip smile under the mustache (as if between two words), and the scissors are tilted a few degrees further back.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 10. 이발사 할아버지 — 껄껄 (자기 머리 쓰다듬기)
- 저장: `episodes/04-body-hair/art/barber/laugh.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03c, c10c, c13b
- 영상에서의 움직임: 표정이 바뀌는 순간 젤리처럼 튄다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

3/4 view turned slightly to the LEFT. Cackling at himself with delight: head thrown back, mouth wide open in a huge laugh, eyes squeezed into happy crescents, one palm rubbing the top of his own shiny bald head (a sparkle pings off it), the other hand slapping his knee.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 11. 이발사 할아버지 — 가슴털 자랑
- 저장: `episodes/04-body-hair/art/barber/chest.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c09, c09b
- 영상에서의 움직임: 가슴을 쭉 내밀며 통통 튄다.
- 메모: 셔츠는 벗지 않는다. 단추 두 개 푼 깃 사이로 보이는 가슴털까지만.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

3/4 view turned slightly to the LEFT. Comically proud: puffing his chest out like a rooster, chin up, eyes closed smugly, one thumb pointing at the big fluffy curly white chest hair tuft poking out of his open collar (shirt and coat stay on, only the two top buttons are open), the other fist on his hip, little sparkles around the chest hair.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 12. 이발사 할아버지 — 정수리 보여 주기
- 저장: `episodes/04-body-hair/art/barber/bald.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c10
- 영상에서의 움직임: 고개를 숙인 채 좌우로 천천히 돈다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

3/4 view turned slightly to the LEFT. Bowing his head forward deeply to show off the top of it like a museum exhibit: the shiny bald dome faces the viewer with a big glossy highlight, and he points with his comb at the white horseshoe ring of hair left on the sides and back, a proud deadpan smile visible under the mustache.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 13. 컷인 — 할아버지의 일침
- 저장: `episodes/04-body-hair/art/cutin/barber.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/04-body-hair/art/barber/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00, c03, c07b, c10, c10c
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the barber grandpa: a cheerful, wiry Korean man in his early seventies who has run the same small neighborhood barbershop for fifty years; the top of his head is completely bald and shiny like a polished egg, with a neat horseshoe-shaped ring of short white hair left only around the sides and back; thick bushy white eyebrows, a tidy white mustache, deep smile wrinkles, small twinkly eyes; a big fluffy tuft of curly white-and-gray chest hair bursts out of the open collar of his shirt, and his forearms are hairy too; wearing a crisp short white barber's coat with the top two buttons open over a pale blue shirt, black slacks and brown sandals, a black comb tucked behind one ear and a pair of scissors in the breast pocket; dry, deadpan, proud of his craft and always ready to laugh at himself; warm and kind, never scary.

Facing slightly to the LEFT. A dramatic deadpan close-up: the shiny bald head gleaming with a starburst glint like a mirror, one bushy white eyebrow cocked sky-high, eyes narrowed with a knowing twinkle, a sly smile under the mustache, the scissors raised beside his face with a sharp shine. Funny and lovable, not scary.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 소품 — 면도 솔
- 저장: `episodes/04-body-hair/art/prop/shaving-brush.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06b
- 영상에서의 움직임: 톡 튀어나와 간질이듯 좌우로 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One old-fashioned shaving brush with a round wooden handle and a fluffy badger-hair head topped with a big blob of white shaving foam, a few foam bubbles flying off, tilted diagonally.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 장면 — 햇빛에 비친 아이 팔의 솜털
- 저장: `episodes/04-body-hair/art/full/fuzz-arm.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05
- 영상에서의 움직임: 팔을 따라 천천히 옆으로 밀리고, 돋보기 자리가 확대된다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A big close-up of a small child's forearm (the kid's red hoodie sleeve pushed up) held up against a bright sunny barbershop window. Backlit by the sunlight, hundreds of tiny, fine, pale golden peach-fuzz hairs glow all along the edge of the arm like a soft halo. A wrinkled grandpa's hand holds a big old magnifying glass over the arm, and inside the lens the fine hairs are enlarged and clearly visible. Sparkle marks. Wonder and surprise.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 장면 — 털을 가늘게 바꾼 사람
- 저장: `episodes/04-body-hair/art/full/hairy-ancestor.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05b
- 영상에서의 움직임: 배경이 오른쪽으로 천천히 밀린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A sunny, scorching African savanna long ago, under a huge blazing cartoon sun. On the left, a very hairy, ape-like early human ancestor covered in thick brown fur sits panting in the shade of an acacia tree, tongue out, comically overheated, with heat squiggles. On the right, a sleek early human with only short head hair and almost no visible body hair runs happily and tirelessly across the grass, covered in big glossy sweat drops that sparkle, a cool breeze line around him. Funny contrast, gag-manga faces. No modern objects.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 17. 장면 — 지키는 털 (눈썹 · 속눈썹 · 코털)
- 저장: `episodes/04-body-hair/art/full/guard-hair.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06
- 영상에서의 움직임: 얼굴 위에서 아래로 천천히 밀린다 (눈썹 → 속눈썹 → 코).

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A comic infographic close-up of the dad's big face, front view, sweating on a hot day. Tiny cartoon details show what each hair does, with no text: big sweat drops sliding down his forehead are steered by his thick eyebrows sideways like gutters and drip off the sides of his face; a cloud of dust specks bounces off his eyelashes like a fence; at his nostrils a few nose hairs act like a net catching tiny cute dust bunnies with angry little faces. Little arrows and motion lines. Funny and clear.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 18. 장면 — 털마다 자라는 기간이 다르다
- 저장: `episodes/04-body-hair/art/full/hair-timer.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07b
- 영상에서의 움직임: 배경이 위로 천천히 밀린다. 숫자는 영상에서 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A playful garden-shelf illustration: two flower pots side by side on a windowsill, each with a cartoon kitchen timer stuck in the soil. In the left pot, one single black hair grows as an enormously long vine that climbs, loops and spills over the shelf and down to the floor, its timer dial turned almost all the way round. In the right pot, one short, curved little black eyebrow-like hair sprout has already stopped growing and taken a nap, a tiny sleeping cap on top and 'Zzz' bubble shapes without letters, its timer already rung with a little bell burst. Blank labels, no text, no numbers. Cute and funny.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 19. 장면 — 털을 세우던 근육 (소름 vs 고양이)
- 저장: `episodes/04-body-hair/art/full/goosebump-cat.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07
- 영상에서의 움직임: 배경이 왼쪽으로 천천히 밀린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A split comic panel. On the left: a close-up of a child's forearm in a red hoodie sleeve, covered in goosebumps, the tiny fine hairs standing straight up, a cold blue wind swirl and a shiver line; a magnifying circle shows under the skin a tiny cartoon muscle like a little rope pulling each hair upright. On the right: a gray cat startled by a cucumber, its fur puffed out enormously so it looks twice its size, back arched, tail like a bottle brush, eyes huge. Funny contrast.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 20. 장면 — 거울에 면도 거품으로 그린 그림 (모자이크)
- 저장: `episodes/04-body-hair/art/full/mirror-foam.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c08
- 영상에서의 움직임: 거울을 향해 천천히 당겨지고, 거품 덩어리가 '퐁' 하고 커진다.
- 메모: 사람 몸은 거품으로 그린 막대 사람까지만. 수영복 부분은 커다란 거품 덩어리로 덮어 '모자이크'처럼 보이게 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A close-up of the big barbershop mirror. Drawn on the glass with white shaving foam is a very simple, cute stick figure of a person standing with arms raised and wearing a pair of swimming trunks drawn as a simple foam outline. Small foam circles mark both armpits. Over the whole swimming-trunks area sits one huge, fluffy, perfectly round blob of shaving foam, completely covering it like a comic censor mosaic, with sparkles around it. The barber grandpa's wrinkled hand holding a shaving brush enters from the right edge, having just added the blob. Funny, innocent and silly. No real bodies, only the foam stick figure.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 21. 장면 — 땀샘 두 종류 (털집 안으로 나오는 샘)
- 저장: `episodes/04-body-hair/art/full/two-glands.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c08b
- 영상에서의 움직임: 왼쪽 샘에서 오른쪽 샘으로 천천히 밀린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A friendly, cartoon-style cross-section of skin like a science picture book, pale peach layers. On the left, a coiled normal sweat gland like a little blue spring sends a straight tube up and pops a clear water droplet out onto the skin surface, with a cool breeze line. On the right, a bigger lumpy gland painted warm red sends its tube sideways into the side of a hair follicle (a long pocket in the skin holding one dark hair), and the hair sticking out above the skin works like a candle wick: wavy scent lines rise from it. Tiny cute round bacteria with happy faces sit on the skin near the hair, munching like they are at a buffet and puffing out little smell clouds. No text, no labels.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 22. 장면 — 정수리 지도 (사막과 숲, 모발이식 트럭)
- 저장: `episodes/04-body-hair/art/full/bald-map.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c10b
- 영상에서의 움직임: 배경이 위에서 아래로 천천히 밀리고, 트럭 쪽으로 당겨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A funny bird's-eye view of the barber grandpa's head seen straight from above, drawn like a fantasy treasure map: the bald shiny top in the middle is a gleaming desert with a single tumbleweed, a cactus and a lonely tiny flag; around it, the horseshoe-shaped ring of white hair at the sides and back is a thick, healthy white forest. On the back side, two tiny cartoon trucks carry little bundles of trees out of the back forest along a dotted road toward the front desert, little workers in hard hats waving. The ears stick out at the edges like islands. Blank map labels, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 23. 소품 — 지키는 털 (한 문장 정리용)
- 저장: `episodes/04-body-hair/art/prop/icon-guard.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c11
- 영상에서의 움직임: 한 문장 정리 컷의 첫 칸에 켜지면서 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One cute cartoon eye with a thick black eyebrow and long eyelashes, the eyebrow wearing a tiny knight's helmet and holding a tiny shield, a sweat drop bouncing off the eyebrow sideways.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 24. 소품 — 알리는 털 (한 문장 정리용)
- 저장: `episodes/04-body-hair/art/prop/icon-wick.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c11
- 영상에서의 움직임: 한 문장 정리 컷의 둘째 칸에 켜지면서 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One cute cartoon candle whose wick is a single curly dark hair, with soft wavy colorful scent lines (not a flame) rising from it, and a tiny happy round bacterium sitting at the base hugging the candle.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 25. 소품 — 흔적만 남은 털 (한 문장 정리용)
- 저장: `episodes/04-body-hair/art/prop/icon-trace.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c11
- 영상에서의 움직임: 한 문장 정리 컷의 셋째 칸에 켜지면서 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

One cute cartoon forearm with goosebumps and tiny fine hairs standing up, shivering, with a tiny ice cube wearing a scarf sitting on it, blue cold swirl lines around.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered. Aspect ratio 1:1.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 26. 장면 — 다음 편 예고 (병원 · 약국)
- 저장: `episodes/04-body-hair/art/full/next-teaser.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c15, 끝 화면
- 영상에서의 움직임: 배경이 왼쪽으로 천천히 밀린다. 끝 화면에서는 흐리게 깔린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A slightly out-of-focus Korean neighborhood street on a chilly morning: a small clinic building and a pharmacy next door with a green cross sign (blank sign boards, no text). In the foreground at the bottom, seen from behind and only from the knees down: the dad's legs in gray sweatpants and slippers next to the kid's small legs in navy shorts, white socks and a too-big scarf trailing, walking toward the clinic, the kid holding a crumpled tissue. A big glossy question mark floats in the sky. No faces.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```
