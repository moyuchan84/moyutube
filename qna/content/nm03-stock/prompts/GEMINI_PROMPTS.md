# Gemini 프롬프트 — 내모남불 ③ 주식편 · 오르면 · 내리면 · 단톡방

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/nm03-stock/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 20장. 진행: 2 / 20
> 다 넣었으면 `video/` 에서 `npm run make -- nm03` → `video/out/nm03/nm03.mp4`

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
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `content/_common/art/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `content/_common/art/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `content/_common/art/cutin/dad-sig-3.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `content/_common/art/cutin/kid-doubt.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |
| ✅ | 컷인 — 엄마 어이없음 | `content/_common/art/cutin/mom-sigh.png` |

---

## 1. 아직 없는 그림 — 18장 (이것만 Gemini 에서 만든다)

#### 2. 은행 직원 — 한 손 들어 번호를 부름
- 저장: `content/nm03-stock/art/teller/call.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm03-stock/art/teller/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c02d, c06c
- 영상에서의 움직임: 손을 든 채 까딱.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the bank teller: a Korean woman in her late twenties, black hair pulled back in a neat low bun, straight bangs, small pearl earrings, a calm oval face with a tiny polite smile; wearing a navy bank uniform vest over a white blouse with a small navy-and-teal neck scarf, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan and polite.

3/4 view turned slightly to the RIGHT. One hand raised politely at shoulder height, palm open, as if calling the next customer, the other hand holding a thin blank folder against her chest, the same deadpan polite face.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 은행 직원 — 두 손바닥을 펴 보이며 "추천 안 합니다"
- 저장: `content/nm03-stock/art/teller/no-recommend.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm03-stock/art/teller/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03e
- 영상에서의 움직임: 두 손바닥이 앞으로 쑥, 정지.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the bank teller: a Korean woman in her late twenties, black hair pulled back in a neat low bun, straight bangs, small pearl earrings, a calm oval face with a tiny polite smile; wearing a navy bank uniform vest over a white blouse with a small navy-and-teal neck scarf, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan and polite.

Facing the viewer. Both palms held up and out in front of her chest in a calm, firm 'I won't say anything' gesture, eyes closed serenely, a perfectly flat polite mouth, a tiny cool sweat-free sparkle beside her face.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 은행 직원 정색 (컷인)
- 저장: `content/nm03-stock/art/cutin/teller-flat.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm03-stock/art/teller/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c02e, c03d, c04c
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the bank teller: a Korean woman in her late twenties, black hair pulled back in a neat low bun, straight bangs, small pearl earrings, a calm oval face with a tiny polite smile; wearing a navy bank uniform vest over a white blouse with a small navy-and-teal neck scarf, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan and polite.

Facing slightly to the RIGHT. Perfectly deadpan: half-closed unimpressed eyes, one eyebrow raised a millimeter, a small flat polite mouth, one index finger raised calmly beside her face, a cold white anime glint in her eyes.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 아빠 친구 — 영상 통화 셀카 구도로 엉엉
- 저장: `content/nm03-stock/art/buddy/cry.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm03-stock/art/buddy/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c03b, c03c
- 영상에서의 움직임: 흐느끼며 들썩, 눈물 줄기.
- 메모: 영상에서 휴대폰 화면 틀(코드) 안에 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad's old friend: a Korean man in his mid-forties, round face, short spiky black hair, thick black-framed glasses, a light stubble, slightly chubby; wearing a wrinkled mint-green hoodie; absolutely NO text, NO letters and NO logos anywhere; comically dramatic.

Close selfie-angle bust shot, looking straight at the viewer as if into a phone camera on a video call. Bawling dramatically: eyes squeezed shut behind the thick glasses, two huge anime waterfall tears streaming down, mouth wide open in a wail, snot bubble, face tinted pale blue, a tiny rain cloud above his head. Plain soft background.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 배경 — 동네 은행 대기석
- 저장: `content/nm03-stock/art/bg/bank-lobby.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00, c01, c02, c02d, c03, c04, c06
- 영상에서의 움직임: 대사마다 인물 쪽으로 카메라가 옮겨 간다.
- 메모: 주 무대. 인물은 초록 배경 그림을 위에 얹는다. 번호 화면은 비워 두고 숫자는 코드로.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The waiting area of a small, bright neighborhood bank branch in the afternoon, seen straight-on like a sitcom set: a long row of teller counters with low glass partitions in the back, a blank black number display box hanging above the counters (no numbers), a ticket machine on a stand, two rows of light-gray waiting chairs in front, a potted plant, warm ceiling lights, light wood floor. No people, absolutely no text, no logos, no signs.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 배경 — 해질녘 은행 앞 벤치
- 저장: `content/nm03-stock/art/bg/bank-dusk.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c05
- 영상에서의 움직임: 아주 천천히 당겨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The quiet sidewalk outside a small neighborhood bank at golden dusk: a wooden bench under a young street tree, the glass doors of the bank behind it glowing warmly, soft orange sky, a few lit shop windows in soft focus. No people, no text, no signs, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 콜드 오픈 — 대기석에서 휴대폰 보며 벌떡 일어난 아빠
- 저장: `content/nm03-stock/art/full/waiting-phone.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/kid/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00, c01
- 영상에서의 움직임: 아빠 쪽으로 휙 당겨졌다가 대사마다 인물 쪽으로.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the kid: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

In a bright bank waiting area with gray chairs: the dad has jumped up from his chair holding his phone high with one hand and a small blank queue ticket in the other, a huge triumphant open-mouthed grin, eyes sparkling. The kid sits on the next chair swinging their legs and looking up at him curiously; the mom sits beside the kid with arms folded, giving the dad a flat sideways look. The phone screen shows only a big red upward arrow, no numbers. No text anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 아빠의 상상 — 빨간 화살표 로켓을 탄 투자의 신 아빠
- 저장: `content/nm03-stock/art/full/stock-god-imagine.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02a
- 영상에서의 움직임: 아래에서 위로 휙, 반짝이 쏟아짐.
- 메모: 영상에서 분홍 '아빠의 상상' 효과가 얹힌다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A silly imagined scene in pastel pink and gold light: the dad in a shiny gold suit and sunglasses rides a giant glossy red upward arrow like a rocket soaring into the sky, one fist raised in triumph, cheeks flapping in the wind, a smug wide grin. Below, a crowd of tiny generic cheering people applauds and throws confetti. Stars, sparkles, comic speed lines. No text, no numbers, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 아빠 컷인 — 파랗게 질림 "왜 파래?!"
- 저장: `content/nm03-stock/art/cutin/dad-blue.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c03, c06
- 영상에서의 움직임: 크래시 줌, 얼굴이 파랗게 번진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer. Horrified: his whole face literally turned pale blue from the forehead down, vertical gloom lines over his eyes, tiny shrunken pupils, jaw dropped, a single sweat drop, gripping his phone with both hands so hard it trembles.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 12. ROUND 2 — 우는 친구 앞에서 "싸졌네? 사볼까?" 하는 아빠
- 저장: `content/nm03-stock/art/full/dad-cheap.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/nm03-stock/art/buddy/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03c
- 영상에서의 움직임: 아빠 반짝이는 눈 → 휴대폰 속 친구 → 엄마로 옮겨 간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the dad's old friend: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Also in the picture: the dad's old friend: a Korean man in his mid-forties, round face, short spiky black hair, thick black-framed glasses, a light stubble, slightly chubby; wearing a wrinkled mint-green hoodie; absolutely NO text, NO letters and NO logos anywhere; comically dramatic.

In a bright bank waiting area: the dad holds his phone up in a video call, the friend visible on the phone screen bawling with waterfall tears. The dad is not looking at the crying friend at all: he grins with big sparkling star-shaped eyes and drool, one finger raised in a bright 'aha, it's on sale!' idea pose. Behind him, the mom stares at the dad in disbelief, one hand pressed to her forehead. No numbers, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 아빠 컷인 — 배를 움켜쥠 "아이고, 배야…"
- 저장: `content/nm03-stock/art/cutin/dad-bellyache.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c04
- 영상에서의 움직임: 꾸르륵 흔들림, 식은땀.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the RIGHT. Doubled over clutching his stomach with both hands, face tinted sickly green, eyes squeezed into wobbly lines, teeth gritted, big beads of cold sweat, a little jagged spiral mark over his belly showing a cramp.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. ROUND 3 — 캡처에서 파란 부분을 잘라내는 아빠
- 저장: `content/nm03-stock/art/full/dad-crop.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04b
- 영상에서의 움직임: 가위가 싹둑 지나간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Close shot in the bank waiting area: the dad hunches over his phone in total concentration, tongue sticking out of the corner of his mouth, one eye squinting, using a giant cartoon pair of scissors to snip a strip of blue off the phone screen, leaving only a red upward arrow; blue paper scraps flutter down. Sneaky, proud and silly. No numbers, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. 반전 — 빨간 화살표 휴대폰을 쓱 보여 주는 엄마
- 저장: `content/nm03-stock/art/full/mom-reveal.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/mom/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06a
- 영상에서의 움직임: 엄마 휴대폰 쪽으로 쓱, 반짝.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

In a bright bank waiting area: the mom calmly holds out her phone toward the dad with a cool, knowing little smile, the screen showing only a big glossy red upward arrow and sparkles. The dad, holding his own phone covered in blue downward arrows, leans back in total shock, jaw dropped, eyes popping. No numbers, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 아이 눈높이 — 해질녘 벤치, 새 통장을 든 아이와 아빠
- 저장: `content/nm03-stock/art/full/bench-dusk.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05
- 영상에서의 움직임: 거의 움직이지 않고 아주 천천히 당겨진다.
- 메모: 농담 없는 박자. 따뜻하고 조용하게.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A quiet warm moment in golden dusk light: on a wooden bench outside a small bank, the kid sits next to the dad holding a small new bankbook in both hands, looking up at him with a serious, gentle face; the dad, phone resting face-down on his knee, looks down at the kid with a soft, thoughtful, slightly embarrassed smile. Calm, sincere, no comic effects, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 17. 소품 — 빨간 위 화살표 그래프 휴대폰
- 저장: `content/nm03-stock/art/prop/phone-up.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00, c02, c06a
- 영상에서의 움직임: 화살표가 쭉 올라간다 (코드 효과).

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A smartphone seen straight-on, its screen showing a simple bright red zigzag line graph climbing up to a big glossy red upward arrow, little sparkles around it. No numbers, no letters, no logos, no app icons.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 18. 소품 — 파란 아래 화살표 그래프 휴대폰
- 저장: `content/nm03-stock/art/prop/phone-down.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c03, c06
- 영상에서의 움직임: 화살표가 뚝 떨어진다 (코드 효과).

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A smartphone seen straight-on, its screen showing a simple blue zigzag line graph plunging down to a big glossy blue downward arrow, a tiny gloomy rain cloud above it. No numbers, no letters, no logos, no app icons.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 19. 소품 — 은행 번호표
- 저장: `content/nm03-stock/art/prop/number-ticket.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c01, c02d, c06c
- 영상에서의 움직임: 툭 튀어나와 살짝 흔들린다.
- 메모: 숫자 47 은 코드로 얹는다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A small white paper bank queue ticket with a slightly curled edge, a large empty rectangle in the middle where the number would go, a thin teal stripe at the top. Completely blank, no numbers, no letters, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 20. 소품 — 새 어린이 통장
- 저장: `content/nm03-stock/art/prop/bankbook.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05
- 영상에서의 움직임: 천천히 반짝.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A small brand-new children's bankbook, closed, with a soft sky-blue cover decorated with a simple cute piggy-bank pattern and tiny stars. No letters, no numbers, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 2장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm03` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 은행 직원 — 기본 | `content/nm03-stock/art/teller/normal.png` |
| 5 | 아빠 친구 — 기본 | `content/nm03-stock/art/buddy/normal.png` |
