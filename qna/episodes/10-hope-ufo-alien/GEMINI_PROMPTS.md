# Gemini 프롬프트 — 10편 · 외계인 진짜 있어요? UFO · 외계 생명체 · 외계인

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep10/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 24장. 진행: 0 / 24
> 다 넣었으면 `video/` 에서 `npm run make -- ep10` → `video/out/ep10/ep10.mp4`

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
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 의심 | `art/common/kid/doubt.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `art/common/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `art/common/mom/explain.png` |
| ✅ | 엄마 — 충격 | `art/common/mom/shock.png` |
| ✅ | 컷인 — 아빠 충격 | `art/common/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `art/common/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `art/common/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `art/common/cutin/dad-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 | `art/common/cutin/mom-sig-1.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 | `art/common/cutin/mom-sig-2.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ③ 위 가로줄 | `art/common/cutin/mom-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 | `art/common/cutin/mom-sig-4.png` |
| ✅ | 시그니처 — 엄마 양 볼 누르고 악! | `art/common/cutin/mom-sig-scream.png` |
| ✅ | 시그니처 — 아이 거꾸로 손 가면 아악! | `art/common/cutin/kid-sig.png` |

---

## 1. 아직 없는 그림 — 24장 (이것만 Gemini 에서 만든다)

#### 1. 배경 — 밤 거실, 영화 보는 TV 불빛 (콜드 오픈)
- 저장: `episodes/10-hope-ufo-alien/art/bg/living-room-movie.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/bg/living-room.png` (같은 거실 (낮) — 가구 배치 유지용)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00, c00a, c00b
- 영상에서의 움직임: TV 불빛이 깜빡이듯 밝기가 조금씩 바뀐다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The same cozy Korean apartment living room as in attached image 2 but late at night with the lights off: the beige fabric sofa against the back wall lit by a cold blue-white glow coming from a big TV on the left edge of the picture (we only see the TV from the side, its screen not visible), a bowl of popcorn and two cans of soda on the low wooden table, a soft blanket on the sofa, dark window behind with city lights. No people, no readable text, no movie images. The bottom third is open floor for characters.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 2. 배경 — 시민 천문대 전시실 (주 무대)
- 저장: `episodes/10-hope-ufo-alien/art/bg/observatory-hall.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c01, c01a, c01b, c02, c02b, c03, c04b, c05, c06b
- 영상에서의 움직임: 천천히 당겨진다. 오답 순간 살짝 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The bright exhibition room of a small Korean city public observatory, seen straight-on like a sitcom set: a big white telescope on a heavy mount in the left third, a curved dark-blue wall behind painted with the planets of the solar system in a row, a large round backlit photo panel of a spiral galaxy, a small hanging model of the Moon, blank exhibit plaques, a spiral staircase on the right leading up to the dome, polished light-gray floor. No people, no readable text, no logos. The bottom third is an open empty floor for characters.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 3. 배경 — 별 가득한 우주 (라운드 카드 뒤)
- 저장: `episodes/10-hope-ufo-alien/art/bg/deep-space.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c04, c05b, c06, c06c
- 영상에서의 움직임: 아주 천천히 돈다. 라운드 글자 카드 · 소품이 위에 얹힌다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Deep outer space: a rich navy-black sky full of countless tiny stars of different colors, a soft purple and teal nebula cloud drifting across the middle, a faint band of the Milky Way running diagonally, a small red planet in the bottom-left corner. Wide and calm so text cards and objects can sit on top. No spacecraft, no people, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 4. 배경 — 밤 천문대 옥상 · 주차장 (아이 눈높이 · 반전)
- 저장: `episodes/10-hope-ufo-alien/art/bg/observatory-roof-night.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c07, c07b, c08, c08b
- 영상에서의 움직임: 아이 눈높이 박자에서는 거의 멈춰 있다. 반전에서 하늘 쪽으로 기울어진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The rooftop terrace of a small Korean city observatory at night: a white dome with its slit open on the right, a low metal railing, the lights of the city and a small parking lot far below, and a huge clear night sky full of stars filling the top two thirds, the Milky Way faintly visible, one tiny red light of an airplane high in the sky. Calm, quiet and wondrous. No people, no readable text. The bottom third is open floor for characters.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 5. 천문대 연구원 — 기본
- 저장: `episodes/10-hope-ufo-alien/art/astro/normal.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c01a, c02, c03
- 영상에서의 움직임: 숨 쉬듯 살짝 움직이고, 말할 때 까딱거린다.
- 메모: 연구원의 기준 그림. 이후 연구원 그림에 전부 ②로 첨부한다. 명찰은 빈칸, 로고 · 글자 없음.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: the observatory astronomer: a slim Korean woman in her early forties, long straight black hair tied in a loose low bun with a pencil stuck through it, NO glasses, sharp calm eyes under straight eyebrows, a small mole under her left eye; wearing a dark-navy zip-up fleece jacket over a light-gray turtleneck with a small blank white name badge and NO logo, a tiny red-light flashlight clipped to the chest pocket, dark-gray trousers, black sneakers; deadpan and dry when correcting grown-ups, quietly full of wonder when talking about the sky.

3/4 view turned slightly to the RIGHT. Standing upright with her arms loosely crossed, holding a thin tablet against her chest, a perfectly calm deadpan face with the tiniest polite smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 연구원 — 정색하고 바로잡기
- 저장: `episodes/10-hope-ufo-alien/art/astro/correct.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/10-hope-ufo-alien/art/astro/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c01a, c02, c04b, c08
- 영상에서의 움직임: 말하는 동안 좌우로 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the observatory astronomer: a slim Korean woman in her early forties, long straight black hair tied in a loose low bun with a pencil stuck through it, NO glasses, sharp calm eyes under straight eyebrows, a small mole under her left eye; wearing a dark-navy zip-up fleece jacket over a light-gray turtleneck with a small blank white name badge and NO logo, a tiny red-light flashlight clipped to the chest pocket, dark-gray trousers, black sneakers; deadpan and dry when correcting grown-ups, quietly full of wonder when talking about the sky.

3/4 view turned slightly to the RIGHT. One hand raised with the index finger up in a calm 'actually…' gesture, the other hand holding the tablet at her side, half-closed unimpressed eyes, one eyebrow slightly raised, mouth a small flat line.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 연구원 — 하늘을 가리키며 설명
- 저장: `episodes/10-hope-ufo-alien/art/astro/point.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/10-hope-ufo-alien/art/astro/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c04, c05, c05b, c06
- 영상에서의 움직임: 가리키는 팔이 위아래로 까딱인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the observatory astronomer: a slim Korean woman in her early forties, long straight black hair tied in a loose low bun with a pencil stuck through it, NO glasses, sharp calm eyes under straight eyebrows, a small mole under her left eye; wearing a dark-navy zip-up fleece jacket over a light-gray turtleneck with a small blank white name badge and NO logo, a tiny red-light flashlight clipped to the chest pocket, dark-gray trousers, black sneakers; deadpan and dry when correcting grown-ups, quietly full of wonder when talking about the sky.

3/4 view turned slightly to the RIGHT. Pointing up and to the right with her arm fully extended toward the sky, leaning forward a little, eyes shining with quiet wonder, a soft open-mouth smile, the tablet tucked under the other arm.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 8. 연구원 — 귀에 손 대고 우주 소리 듣기
- 저장: `episodes/10-hope-ufo-alien/art/astro/listen.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/10-hope-ufo-alien/art/astro/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c06, c06b
- 영상에서의 움직임: 귀에 댄 손이 천천히 까딱인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the observatory astronomer: a slim Korean woman in her early forties, long straight black hair tied in a loose low bun with a pencil stuck through it, NO glasses, sharp calm eyes under straight eyebrows, a small mole under her left eye; wearing a dark-navy zip-up fleece jacket over a light-gray turtleneck with a small blank white name badge and NO logo, a tiny red-light flashlight clipped to the chest pocket, dark-gray trousers, black sneakers; deadpan and dry when correcting grown-ups, quietly full of wonder when talking about the sky.

3/4 view turned slightly to the RIGHT. One hand cupped behind her ear as if listening very carefully, eyes closed, head tilted up toward the sky, a calm serious face, the other hand holding the tablet.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 연구원 정색 (컷인)
- 저장: `episodes/10-hope-ufo-alien/art/cutin/astro-correct.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `episodes/10-hope-ufo-alien/art/astro/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c01a, c02, c04b, c08
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the observatory astronomer: a slim Korean woman in her early forties, long straight black hair tied in a loose low bun with a pencil stuck through it, NO glasses, sharp calm eyes under straight eyebrows, a small mole under her left eye; wearing a dark-navy zip-up fleece jacket over a light-gray turtleneck with a small blank white name badge and NO logo, a tiny red-light flashlight clipped to the chest pocket, dark-gray trousers, black sneakers; deadpan and dry when correcting grown-ups, quietly full of wonder when talking about the sky.

Facing slightly to the RIGHT. Perfectly deadpan: half-closed unimpressed eyes, one eyebrow raised a millimeter, mouth a small flat line, a cold sharp glint in one eye, a single strand of hair slipping out of the bun. Simple speed-line accents close to her head.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 10. 장면 — 밤 소파에서 영화 보는 엄마 아빠, 끼어든 아이
- 저장: `episodes/10-hope-ufo-alien/art/full/sofa-movie.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/mom/normal.png` (엄마 기준 그림), ③ `art/common/dad/normal.png` (아빠 기준 그림), ④ `art/common/kid/normal.png` (아이 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00, c00a
- 영상에서의 움직임: 천천히 당겨지고, 아이 대사에서 멈칫 흔들린다.
- 메모: 콜드 오픈 첫 그림. TV 화면은 보이지 않게(영화 장면 · 포스터를 그리지 않는다). 엄마가 아이 눈을 가린다 — 15세 영화라서.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Night in the dark living room, lit only by a cold blue-white TV glow from the left (the TV screen itself is out of the picture). The mom and dad sit side by side on the beige sofa under a blanket, the dad holding a huge bowl of popcorn with a few kernels frozen in mid-air; the 8-year-old kid in pajamas has popped up from behind the sofa between them, and the mom is calmly covering the kid's eyes with one hand without looking away from the TV. The dad looks startled, the kid grins innocently under mom's hand. The mom, dad and kid look exactly as in attached images 2, 3 and 4. No readable text, no movie images.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 아빠의 상상 — 외계인 우주선이 태양계에 놀러 옴
- 저장: `episodes/10-hope-ufo-alien/art/full/ufo-visit-imagine.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (아빠 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02
- 메모: 틀린 설명을 그대로 그린 장면. 영상에서 분홍 '아빠의 상상' 효과가 얹힌다. 아빠 얼굴은 기준 그림 그대로.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A silly imagined scene in outer space with Saturn and the Sun in the background: a big shiny classic flying saucer with colorful blinking lights arriving like a tour bus, three cute round green aliens with antennae leaning out of its windows waving and holding cameras like tourists; floating in space in front of it is the chubby balding dad in his mustard-yellow cardigan, wearing a fishbowl space helmet, waving both arms back at them with a huge welcoming grin. The dad looks exactly as in attached image 2. Bright, absurd and cheerful. No text, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 아빠의 상상 — 문어 머리 초록 아저씨
- 저장: `episodes/10-hope-ufo-alien/art/full/octopus-alien-imagine.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05
- 메모: 아빠가 떠올리는 '외계인' — 다음 컷의 작은 세균과 대비된다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A silly imagined scene: a classic B-movie alien posing proudly in front of a starry sky, a tall green man with a huge bulbous octopus head, big black glossy eyes, wiggly tentacles instead of a beard, wearing a shiny silver jumpsuit with a big collar and holding a toy ray gun, striking a heroic pose with sparkles around him. Cheesy and funny, not scary. No text, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 아빠 — 하늘 가리키며 "외계인이다!"
- 저장: `episodes/10-hope-ufo-alien/art/dad/point-sky.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c08
- 영상에서의 움직임: 가리키는 팔이 위아래로 흔들린다.
- 메모: 반전 컷. 확신에 찬 얼굴.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

3/4 view turned slightly to the LEFT. Leaning back and pointing straight up at the sky with one arm fully extended, the other hand grabbing his own head in excitement, eyes huge and sparkling, mouth wide open shouting, sweat drops flying.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 아이 — 하늘에 귀 대고 듣기
- 저장: `episodes/10-hope-ufo-alien/art/kid/ear-sky.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/kid/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c07, c07b
- 영상에서의 움직임: 거의 움직이지 않고 숨 쉬듯만.
- 메모: 아이 눈높이 박자용. 농담 없이 따뜻하게.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

3/4 view turned slightly to the RIGHT. Standing on tiptoe, head tilted up toward the sky with eyes softly closed, one small hand cupped behind the ear to listen, the other hand held up a little toward the stars, a soft quiet smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 15. 소품 — 홉 열매 (맥주 재료)
- 저장: `episodes/10-hope-ufo-alien/art/prop/hop-cone.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00a

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small bunch of fresh green hop cones (the papery cone-shaped flowers used in beer) hanging on a short vine with two jagged leaves, drawn bright and cute.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 16. 소품 — 옛 독일 궁정 맥주집
- 저장: `episodes/10-hope-ufo-alien/art/prop/court-beer-hall.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00b
- 메모: 실제 건물을 그대로 그리지 않는다 — 바이에른풍 옛 맥주집 느낌만. 간판 글자 없음.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A cute storybook illustration of an old Bavarian-style beer hall building: cream walls, a steep dark roof, arched windows, a little crown emblem over the arched doorway, blue-and-white striped pennants, two giant foamy beer mugs on a barrel in front. No letters, no signs with text, no flags.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 소품 — UFO의 정체들 (풍선 · 드론 · 비행기 · 금성)
- 저장: `episodes/10-hope-ufo-alien/art/prop/ufo-unknowns.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c04

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Four everyday things floating together in a neat cluster, each with a little sparkle: a white weather balloon with a small box hanging below, a small four-rotor drone with blinking lights, a tiny airplane with a red light, and one very bright star-like planet glowing white-gold. Cute and clear.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 18. 소품 — 다른 별에서 온 얼음 혜성
- 저장: `episodes/10-hope-ufo-alien/art/prop/interstellar-comet.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c02

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A lumpy gray-white chunk of dirty ice and rock flying diagonally, with a faint glowing blue-green fuzzy coma around it and a short soft tail streaming behind it. A comet, clearly natural rock and ice, no windows, no lights, no machinery.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 19. 소품 — 화성 표범 무늬 돌
- 저장: `episodes/10-hope-ufo-alien/art/prop/mars-leopard-rock.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A reddish-brown arrowhead-shaped rock from Mars with small pale spots ringed in dark edges like a leopard's spots on its surface, a few white veins running through it, sitting on a little patch of red dusty ground.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 20. 소품 — 아주 작은 세균들
- 저장: `episodes/10-hope-ufo-alien/art/prop/microbes.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05, c05b

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A tight cluster of cute tiny microbes seen as if under a magnifying glass: round and rod-shaped blobs in soft green, blue and pink with tiny wiggly tails and simple happy dot faces, inside a round magnifying-lens shape.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 21. 소품 — 거대 전파 망원경
- 저장: `episodes/10-hope-ufo-alien/art/prop/radio-telescope.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A giant white radio telescope dish on a sturdy frame, tilted up toward the sky, with faint curved wave lines drawn coming down into the dish. No letters, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 22. 소품 — 별까지 가는 느린 탐사선
- 저장: `episodes/10-hope-ufo-alien/art/prop/space-probe.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c06b
- 메모: 실제 탐사선 · 기관 로고를 그리지 않는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small old-fashioned space probe with a big white dish antenna, a gold box body and two thin long booms, drifting slowly with a tiny snail riding on top of the dish for comedy, sleepy 'zzz' clouds (no letters, just three small cloud puffs). No logos, no flags.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 23. 소품 — 밤하늘 비행기 (깜빡이는 빨간 불)
- 저장: `episodes/10-hope-ufo-alien/art/prop/blinking-plane.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c08

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A small passenger airplane seen from below at night, dark silhouette with a bright red blinking light on the wing tip and a white strobe on the tail, little radiating light lines around the red light. No letters, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 24. 썸네일 — 영화 포스터 느낌 그림 (실제 포스터 아님)
- 저장: `episodes/10-hope-ufo-alien/art/full/hope-poster.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 3:4
- 쓰이는 컷: thumb

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

An ORIGINAL dramatic movie-poster style illustration (not a copy of any real poster): a tiny remote Korean seaside village at night seen from a low angle, rooftops and a lone streetlight, and above it a huge mysterious pale light glowing through dark clouds in the sky, beams falling on the village. Two small silhouetted villagers in the foreground look up at it. Deep teal night sky with warm orange glows, cinematic, mysterious and a little scary. Empty dark space at the bottom of the picture for a title (but draw no text). Same ink linework and airbrushed shading as the style anchor, but serious and atmospheric instead of comic. No people close-up, no faces in detail.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution. Aspect ratio 3:4.
```

---

## 2. 이미 있는 그림 — 0장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep10` 를 다시 실행하면 위 목록으로 돌아온다.

아직 없다.
