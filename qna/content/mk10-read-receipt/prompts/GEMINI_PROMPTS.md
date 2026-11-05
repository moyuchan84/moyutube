# Gemini 프롬프트 — 모덕후 ⑩ 읽씹 — 메신저 화면 · 도해 패러디 (로고 · 노란색 없음)

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk10-read-receipt/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 16장. 진행: 6 / 16
> 다 넣었으면 `video/` 에서 `npm run make -- mk10` → `video/out/mk10/mk10.mp4`

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
| ✅ | 아빠 — 당황 | `content/_common/art/dad/panic.png` |

---

## 1. 아직 없는 그림 — 10장 (이것만 Gemini 에서 만든다)

#### 7. 어두운 방 — 폰 불빛에 비친 삼촌 얼굴, 화면 속 거대한 "1", 벽시계
- 저장: `content/mk10-read-receipt/art/full/one-glare.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk10-read-receipt/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Dark Korean studio apartment at night. The uncle sits on the floor hugging his knees, staring with wide unblinking eyes at a smartphone held in both hands, the cold phone light glowing on his glasses and face. Floating huge in front of the phone is a giant glossy white speech bubble with a big bold single digit 1 next to it, like a looming monster with tiny anxious eyes. A round wall clock in the background shows a little past one o'clock. Plain generic grey and white chat bubbles only; NO yellow, NO real app logo, NO brand. The only readable character anywhere is the single digit 1. No caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 문틈으로 보는 아빠(어이없음) + 폰을 두 손으로 쥔 삼촌 등
- 저장: `content/mk10-read-receipt/art/full/doorway-dad.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal)), ③ `content/mk10-read-receipt/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
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

Night scene in a small Korean studio apartment lit by blue phone light. In the foreground right, the dad peeks through a door opened a crack, deadpan unimpressed with a half-lidded stare. In the middle of the room the uncle sits hunched with his back to us, gripping a smartphone with both hands, a faint glow on the wall around him. Several crumpled snack wrappers on the floor to show hours have passed. Both people stay in the exact gag-manga cartoon style of the attached images. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no speech bubbles, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 8분 모래시계 + 허공으로 사라지는 말풍선 8개 + 침묵하는 폰
- 저장: `content/mk10-read-receipt/art/full/eight-min.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A clean cute illustration: in the center a big hourglass with sand running down; a line of eight small blank grey speech bubbles floats up out of a smartphone on the left and fades into nothing as they drift right, getting fainter one by one. A small sad grey cloud hangs over the phone. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any people or faces. Plain generic grey and white; no yellow, no brand logo. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 공 던지기 게임 — 두 실루엣이 공을 주고받고 한 명은 혼자 서 있음
- 저장: `content/mk10-read-receipt/art/full/ball-game.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A simple diagram-style cartoon on a plain pale background: two faceless rounded cartoon figures in blue and green toss a small red ball between them, while a third smaller faceless figure in grey stands alone on the left with arms hanging down and a little rain cloud over its head. Flat colors with the same bold outline as the attached reference. Use the attached image ONLY as a reference for line weight and coloring. Do NOT copy any real person or face. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 큰 뇌 캐릭터 + 물음표, 양쪽 학자가 서로 다른 부위를 가리킴
- 저장: `content/mk10-read-receipt/art/full/brain-argue.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A large cute cartoon brain in the center with a big question mark above it and a puzzled little face. On the left a bearded professor in a lab coat with a pointer stick jabs at the front of the brain; on the right a bespectacled female researcher in a lab coat jabs her pointer at the back of the brain; both look cross and are mid-argument with small anger marks. Use the attached image ONLY as a reference for line weight and coloring. Do NOT copy the person from the attached image. Absolutely no readable words, letters or numbers anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 두 칸: 안 읽음 삼촌 느긋 / 읽음 삼촌 식은땀
- 저장: `content/mk10-read-receipt/art/full/read-vs-unread.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk10-read-receipt/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

Two-panel comic strip split left and right with the same smartphone shown in each. LEFT panel: the uncle relaxed, lounging, smiling loosely at the phone, a small calm blue aura. RIGHT panel: the same uncle rigid with wide shaking eyes, big sweat drops flying off his face, a nervous red aura, the phone screen showing a tiny check mark. Generic grey and white chat bubbles only; NO yellow, NO real app logo. Absolutely no readable words or letters anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 삼촌이 폰을 열었다 닫았다 — 4컷 연속, 머리 위 카운터
- 저장: `content/mk10-read-receipt/art/full/check-counter.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk10-read-receipt/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

A 2x2 grid comic of four identical small panels: in each panel the uncle sits on the floor opening his smartphone with a hopeful face then slumping, and above his head floats a growing stack of tally marks that gets bigger panel by panel (one, two, three, four groups of tally strokes drawn as plain lines, not numerals). Generic grey phone; no yellow, no app logo. Absolutely no readable words, letters or numerals anywhere; no caption boxes, no speech bubbles.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 뇌 캐릭터가 침묵 말풍선 "…"을 번역기에 넣으면 "내 탓" 도장이 찍혀 나옴
- 저장: `content/mk10-read-receipt/art/full/blame-translate.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A funny machine diagram: on the left a cute cartoon brain character feeds a grey speech bubble containing only three dots into a boxy retro translator machine in the center; on the right a paper slip comes out stamped with a big red round stamp mark shaped like a crossed-out smiley (no letters). A small brass sign on the machine is left blank. Use the attached image ONLY as a reference for line weight and coloring. Do NOT copy any person. Absolutely no readable words or letters anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. 삼촌 폰 화면 — 보낸 말풍선 + 읽음 표시, 곁에 피규어 박스 아이콘
- 저장: `content/mk10-read-receipt/art/full/seller-dm.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A close-up of a smartphone screen in a clean flat illustration: a single outgoing plain white speech bubble on the right side containing a tiny question-mark icon, a small check mark beside it showing it was seen, an empty chat area below, and next to the phone a cute boxed anime-style figurine in a window box. Plain generic grey and white interface; NO yellow, NO real app logo. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw any people. Absolutely no readable words or letters anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 폰에 답장 도착, 삼촌은 책상에 엎어짐
- 저장: `content/mk10-read-receipt/art/full/soldout.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/mk10-read-receipt/art/modeokhu/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c07

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the nerdy uncle: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the nerdy uncle: a Korean man in his late thirties with a round friendly face, a full head of messy black hair with a cowlick, thick round black-rimmed glasses that glint, a neatly tucked-in red-and-navy plaid flannel shirt buttoned to the top, khaki chinos, brown loafers and a small silver laser pointer clipped to the shirt pocket; an earnest, overly serious scholar look who has never dated; NO text, NO logos.

The uncle slumped face-down over a desk with his arms limp, the glasses askew, a thin gloomy cloud above him, his smartphone lying in front of him lit up with a new incoming plain white message bubble that holds only a bold red X mark icon. Beside the desk the empty figurine display box. Generic grey and white interface, no yellow, no app logo. Absolutely no readable words or letters anywhere; no caption boxes, no frame border.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

---

## 2. 이미 있는 그림 — 6장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk10` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) (mk05 그림 복사, 새로 안 뽑음) | `content/mk10-read-receipt/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리킴 (mk05 그림 복사) | `content/mk10-read-receipt/art/modeokhu/point.png` |
| 3 | 모덕후 삼촌 — 으쓱 (mk05 그림 복사) | `content/mk10-read-receipt/art/modeokhu/proud.png` |
| 4 | 모덕후 삼촌 — 당황 (mk05 그림 복사) | `content/mk10-read-receipt/art/modeokhu/fluster.png` |
| 5 | 삼촌 컷인 — 꿀꺽 (mk05 그림 복사) | `content/mk10-read-receipt/art/cutin/uncle-gulp.png` |
| 6 | 배경 — 삼촌의 밤 원룸 (mk05 그림 복사) | `content/mk10-read-receipt/art/bg/oneroom.png` |
