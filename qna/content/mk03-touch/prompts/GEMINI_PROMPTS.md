# Gemini 프롬프트 — 모덕후 ③ 손잡기 — 게임 · 잡지 화보 패러디

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk03-touch/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 18장. 진행: 7 / 18
> 다 넣었으면 `video/` 에서 `npm run make -- mk03` → `video/out/mk03/mk03.mp4`

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

## 1. 아직 없는 그림 — 11장 (이것만 Gemini 에서 만든다)

#### 8. 삼촌 — 자기 두 손 깍지 끼고 진지하게 바라봄 (무표정 · 땀 한 방울)
- 저장: `content/mk03-touch/art/modeokhu/selfhold.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk03-touch/art/modeokhu/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

3/4 view turned slightly to the RIGHT. Standing, holding his own two hands together in front of his chest with fingers interlaced, staring down at his clasped hands with a blank, dead-serious, slightly disappointed scientist face, glasses glinting, one small sweat drop on his temple, as if waiting for a feeling that never comes.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 미연시 화면 패러디 — 노을 공원, 내민 손 실루엣, 선택지 상자 (모니터 앞 삼촌 뒤통수)
- 저장: `content/mk03-touch/art/full/dating-sim.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk03-touch/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Over-the-shoulder view from behind the uncle sitting stiffly upright at a desk in a dark studio apartment, the back of his messy head and glasses rim visible, a game controller clutched in both hands. His big monitor shows a pastel anime-style dating-simulation game screen: a park at a glowing pink-orange sunset with cherry blossom petals, a girl character shown only from behind as a soft simple silhouette holding one hand out toward the viewer, and at the bottom a translucent rounded choice box with two empty option bars, the top bar highlighted with a small heart cursor. Warm monitor glow on the dark room. The uncle stays in the exact gag-manga cartoon style of the attached images. No text, no letters, no logos. Option bars are blank, no writing.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 극장 패러디 — 객석의 뇌 캐릭터가 대본을 펼쳐 들고 하품
- 저장: `content/mk03-touch/art/full/spoiler-brain.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute cartoon movie theater: in a red velvet seat sits a round pink brain character with tiny arms, little legs and sleepy half-closed eyes, holding an open script booklet in one hand and yawning widely, a popcorn bucket untouched beside it. On the big screen is a giant cartoon hand slowly reaching toward the audience. Dim theater lighting, one beam from the projector. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 과학 잡지 도해 — 척수를 타고 오르는 두 신호 (남의 손 = 반짝 · 내 손 = 회색)
- 저장: `content/mk03-touch/art/full/spine-relay.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A glossy popular-science magazine infographic on a deep navy background: a smooth translucent blue mannequin-like human silhouette from the waist up (no face details, no skin detail) with its glowing spine and brain visible inside. Two little signal sparks race up the spine side by side: one is a bright golden sparkling star that has reached the brain and switched on a warm glowing room deep inside it, the other is a dull gray dot fading out halfway with a tiny zzz. A cartoon hand icon sits at the bottom of each path. Clean diagram style. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 피부 단면 도감 — 깃털 붓에 환호하는 느린 신경 캐릭터들
- 저장: `content/mk03-touch/art/full/slow-nerve.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A charming vintage field-guide style cross-section of skin like a cozy underground world: a soft pink surface with fine little hairs on top, and a feather brush gently sweeping across it from the left. Beneath the surface, little cute snail-like nerve characters with long thin tails and happy faces raise their tiny arms and cheer with sparkles and small hearts as the feather passes slowly over them. Soft watercolor shading, fine scientific linework. No humans. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 삼촌의 깃털 손길에 털 세우고 도망가는 고양이
- 저장: `content/mk03-touch/art/full/cat-escape.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk03-touch/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Inside the uncle's cluttered studio apartment: the uncle kneels on the floor reaching out one hand with exaggerated slow tenderness, fingers spread like a feather, a hopeful earnest face with glasses glinting. A cute round orange tabby cat bolts away from him toward the right with its fur puffed up, tail bristled like a bottle brush, motion lines and a dust cloud behind it, a little sweat drop on the cat. The uncle stays in the exact gag-manga cartoon style of the attached images. No text, no letters, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 실험실 패러디 — 번개 버튼 앞 맞잡은 두 손 클로즈업, 뇌 모니터 빨강→파랑
- 저장: `content/mk03-touch/art/full/shock-lab.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A dramatic cartoon science-lab close-up: two hands firmly holding each other in the center (a woman's hand and a man's hand with a wedding ring, only hands and wrists, no faces or bodies), resting on a steel lab table. Behind them a big red button with a yellow lightning-bolt symbol and cables, and a monitor showing a simple cartoon brain icon whose color is changing from alarming red to calm blue with a little sparkle. Cool lab lighting. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. 두 사람 머리 위 뇌파 선이 같은 모양으로 겹침 (실루엣 · 맞잡은 손에서 빛)
- 저장: `content/mk03-touch/art/full/brainwave.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A soft glowing science-magazine illustration on a twilight purple background: two simple dark silhouettes of a couple sitting side by side seen from the side, holding hands, a warm golden glow where the hands meet. Above each head floats a bright wavy brainwave line, one pink and one blue, and the two waves line up into the exact same shape and overlap in the middle with sparkles. Silhouettes only, no faces. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people or faces. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 삼촌 머리 위 뇌파와 공유기 와이파이 신호가 맞춰짐
- 저장: `content/mk03-touch/art/full/wifi-sync.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk03-touch/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Night in the uncle's studio apartment: the uncle sits alone cross-legged on the floor, eyes closed with a blissful serene smile, gently holding a small white Wi-Fi router in both hands like a loved one's hand. A wavy glowing brainwave line rises from his head and lines up perfectly with the glowing Wi-Fi signal arcs coming from the router, with a little blinking heart on the router. A bit lonely but sweet and funny. The uncle stays in the exact gag-manga cartoon style of the attached images. No text, no letters, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 17. 현관 — 엄마 · 아빠 손잡고 산책 나가는 뒷모습, 문틈의 삼촌 꿀꺽
- 저장: `content/mk03-touch/art/full/walk-out.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/mk03-touch/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
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

The entrance hall of a Korean apartment in warm late-afternoon light, the front door wide open to a golden outdoor path: the mom and the dad walk out side by side seen from behind and slightly to the side, holding hands, the dad turning his head back with a smug proud grin, a few small hearts floating above their joined hands. In the foreground on the right a room door is open a crack and the uncle peeks through it, glasses fogged white, cheeks red, swallowing hard with a comic gulp. All people stays in the exact gag-manga cartoon style of the attached images. No text, no letters, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 18. 소품 — 맞잡은 두 손 아이콘에 하트, 화보처럼 반짝
- 저장: `content/mk03-touch/art/prop/hands.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c01, 썸네일

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single cute sticker of two cartoon hands clasped together in a gentle hold, with a small glossy pink heart floating just above them, soft studio rim light and star highlights.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 7장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk03` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리키며 "자, 진지하다" (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/modeokhu/point.png` |
| 3 | 모덕후 삼촌 — 결론, 팔짱 끼고 의기양양 (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/modeokhu/proud.png` |
| 4 | 삼촌 — "…논문으로." 시선 피하며 안경 고쳐 쓰기 (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/modeokhu/fluster.png` |
| 5 | 모덕후 삼촌 컷인 — 안경 번쩍 (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/cutin/uncle-glint.png` |
| 6 | 삼촌 컷인 — 꿀꺽 (김 서린 안경 · 빨개진 볼) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/cutin/uncle-gulp.png` |
| 7 | 배경 — 삼촌의 밤 원룸 (책 더미 · 피규어 · 컵라면 · TV 불빛) (앞 편 그림 복사, 새로 안 뽑음) | `content/mk03-touch/art/bg/oneroom.png` |
