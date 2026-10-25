# Gemini 프롬프트 — 내모남불 ① 자동차편 · 끼어들기 · 깜빡이 · 주차

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/nm01/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 16장. 진행: 0 / 16
> 다 넣었으면 `video/` 에서 `npm run make -- nm01` → `video/out/nm01/nm01.mp4`

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
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 컷인 — 아빠 충격 | `art/common/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `art/common/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `art/common/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `art/common/cutin/dad-sig-3.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `art/common/cutin/kid-doubt.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |
| ✅ | 컷인 — 엄마 어이없음 | `art/common/cutin/mom-sigh.png` |
| ✅ | 시그니처 — 엄마 양 볼 누르고 악! | `art/common/cutin/mom-sig-scream.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 | `art/common/cutin/mom-sig-1.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 | `art/common/cutin/mom-sig-2.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ③ 위 가로줄 | `art/common/cutin/mom-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 | `art/common/cutin/mom-sig-4.png` |

---

## 1. 아직 없는 그림 — 16장 (이것만 Gemini 에서 만든다)

#### 1. 장면 — 빨간 경차가 깜빡이 없이 코앞으로 끼어듦
- 저장: `naemonambul/01-car/art/full/highway-cutin.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00
- 영상에서의 움직임: 옆으로 휙 들어오고 속도선이 얹힌다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A sunny Korean city expressway seen from a low angle just behind and above a plain white compact sedan (no logo, blank license plate). A small boxy red compact car with no logo swerves diagonally across the lane marking right in front of the white sedan's bumper, its turn signal lamps clearly dark and unlit. Motion blur on the red car, dust and small sparks, tire marks, dramatic speed. Blue sky, sound barrier walls and green hills at the sides. No people visible.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 2. 장면 — 차 안 정면 (아빠 운전 · 엄마 조수석 · 아이 뒷좌석)
- 저장: `naemonambul/01-car/art/full/car-interior.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `art/common/mom/normal.png` (엄마 기준 그림), ④ `art/common/kid/normal.png` (아이 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c01, c02, c03, c06
- 영상에서의 움직임: 천천히 당겨지고, 대사마다 인물 쪽으로 카메라가 옮겨 간다.
- 메모: 주 무대. 핸들은 왼쪽(한국 차). 아이는 뒷좌석 가운데 부스터 시트 + 안전벨트.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Inside a plain white family sedan, seen straight-on from outside through the front windshield like a sitcom set. The dad (attached image 2) sits in the LEFT front seat (driver seat, steering wheel on the left) holding the wheel with a smug confident grin; the mom (attached image 3, same face, glasses, bob hair and sage-green sweater) sits in the RIGHT front passenger seat, arms folded, giving him a sideways skeptical look; the 8-year-old kid (attached image 4, same bowl cut, red hoodie) sits in the middle of the back seat in a booster seat with the seatbelt across the chest, leaning forward curiously between the two front seats. All three wear seatbelts. Bright daylight, a little dashboard, blurred road and trees reflected at the edges of the glass.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 3. 아빠 컷인 — 핸들 쥐고 분노
- 저장: `naemonambul/01-car/art/cutin/dad-rage-wheel.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `art/common/cutin/dad-shock.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00, c02
- 영상에서의 움직임: 크래시 줌으로 확 당겨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer. Both hands crushing the top of a steering wheel that is visible at the bottom of the frame, leaning forward, face red with rage, bulging veins on the forehead (anime anger mark), eyes bulging, huge open shouting mouth showing teeth, spit flying, steam puffing from the ears.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 아빠 컷인 — 한 손 운전, 휘파람 "모 어때~"
- 저장: `naemonambul/01-car/art/cutin/dad-chill.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `art/common/cutin/dad-proud.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c00a, c02a, c04a
- 영상에서의 움직임: 멈춤 + 이름표가 붙는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the RIGHT. Lazily steering with one finger on a steering wheel visible at the bottom of the frame, the other hand waving casually, eyes closed in total self-satisfaction, lips puckered whistling, a little glowing halo floating above his head, a few sparkles and a tiny music note shape (no letters).

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 5. 장면 — 출구 앞 긴 줄, 맨 앞에서 끼어드는 검은 차
- 저장: `naemonambul/01-car/art/full/exit-queue.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02
- 영상에서의 움직임: 줄을 따라 위에서 아래로 훑다가 끼어드는 차에서 멈춘다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

High three-quarter aerial view of a Korean expressway exit ramp at late morning: a very long, perfectly orderly queue of cars waiting in the right lane stretches far into the distance, while the lane beside it is almost empty. At the very front, right where the exit splits off, a shiny black sedan with no logo cuts diagonally into the queue, its nose squeezing into a tiny gap; the car behind it brakes with red brake lights glowing. Small shock lines around the black car. No people visible, no text on road signs (blank green sign boards).

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 6. 아빠의 상상 — 법복 입은 아빠가 망치를 탕
- 저장: `naemonambul/01-car/art/full/judge-imagine.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02
- 메모: 영상에서 분홍 '아빠의 상상' 효과가 얹힌다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A silly imagined courtroom in pastel pink and gold light: the dad sits behind a huge wooden judge's bench wearing a black judge's robe over his cardigan, slamming a big wooden gavel down so hard it cracks the bench, wood chips flying, his face furious and righteous, glaring down at a tiny black car (toy-sized, no people) standing on the floor in front of the bench like a defendant. Sparkles, dramatic spotlight beams. No text, no flags, no emblems.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 7. 장면 — 아빠 차가 빈 차로로 달려 맨 앞에서 쓱
- 저장: `naemonambul/01-car/art/full/dad-merge.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c02a
- 영상에서의 움직임: 옆으로 미끄러지며 들어온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The same expressway exit queue seen from the side at road level: the plain white sedan (no logo, blank plate) slides diagonally from the empty lane into a tiny gap at the very front of the long waiting queue. Through the open driver's window the dad (attached image 2, same face and mustard cardigan) raises one hand in a cheeky little wave, eyes closed, whistling innocently, a small halo above his head. The car behind brakes hard with smoke from its tires. Speed lines, dust.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 교통경찰관 — 기본
- 저장: `naemonambul/01-car/art/traffic/normal.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c02b, c03b
- 영상에서의 움직임: 숨 쉬듯 살짝 움직이고, 말할 때 까딱거린다.
- 메모: 교통경찰관의 기준 그림. 이후 경찰관 그림에 전부 ②로 첨부한다. 제복에 글자 · 휘장 · 로고 없음.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Character: a Korean traffic police officer woman in her mid-thirties, slim and upright, a neat low black ponytail, straight bangs, sharp calm eyes under straight eyebrows, NO glasses, a tiny beauty mark on her right cheek; wearing a navy-blue police uniform shirt and navy trousers under a bright fluorescent yellow-green reflective safety vest with silver reflective stripes, a navy peaked cap, white gloves, black shoes; absolutely NO text, NO letters, NO badges with writing and NO logos anywhere on the uniform; perfectly deadpan and polite.

3/4 view turned slightly to the LEFT. Standing upright and calm, holding a red glowing traffic baton (a light stick) down at her side in one hand, the other hand lightly raised palm-forward in a polite 'please stop' gesture, a perfectly deadpan face with the tiniest polite smile.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 9. 교통경찰관 — 경광봉으로 갓길 가리키기
- 저장: `naemonambul/01-car/art/traffic/point.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `naemonambul/01-car/art/traffic/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c02b, c03b
- 영상에서의 움직임: 가리키는 팔이 위아래로 까딱인다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: a Korean traffic police officer woman in her mid-thirties, slim and upright, a neat low black ponytail, straight bangs, sharp calm eyes under straight eyebrows, NO glasses, a tiny beauty mark on her right cheek; wearing a navy-blue police uniform shirt and navy trousers under a bright fluorescent yellow-green reflective safety vest with silver reflective stripes, a navy peaked cap, white gloves, black shoes; absolutely NO text, NO letters, NO badges with writing and NO logos anywhere on the uniform; perfectly deadpan and polite.

3/4 view turned slightly to the LEFT. Pointing firmly to the side with the glowing red traffic baton fully extended, the other hand on her hip, half-closed unimpressed eyes, one eyebrow slightly raised, mouth a small flat line.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 10. 교통경찰관 정색 (컷인)
- 저장: `naemonambul/01-car/art/cutin/traffic-flat.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `naemonambul/01-car/art/traffic/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c02b, c03b, c04b
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: a Korean traffic police officer woman in her mid-thirties, slim and upright, a neat low black ponytail, straight bangs, sharp calm eyes under straight eyebrows, NO glasses, a tiny beauty mark on her right cheek; wearing a navy-blue police uniform shirt and navy trousers under a bright fluorescent yellow-green reflective safety vest with silver reflective stripes, a navy peaked cap, white gloves, black shoes; absolutely NO text, NO letters, NO badges with writing and NO logos anywhere on the uniform; perfectly deadpan and polite.

Facing slightly to the LEFT. Perfectly deadpan: half-closed unimpressed eyes, one eyebrow raised a millimeter, mouth a small flat line, a cold sharp glint in one eye, the peaked cap casting a little shadow, the glowing red baton held up next to her face.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 11. 교통경찰관 — 비번, 장 보러 온 차림
- 저장: `naemonambul/01-car/art/traffic/shopping.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `naemonambul/01-car/art/traffic/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c04b
- 영상에서의 움직임: 옆에서 쓱 들어온다.
- 메모: 같은 사람이지만 제복 대신 사복. 얼굴 · 머리는 기준 그림 그대로.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: a Korean traffic police officer woman in her mid-thirties, slim and upright, a neat low black ponytail, straight bangs, sharp calm eyes under straight eyebrows, NO glasses, a tiny beauty mark on her right cheek; wearing a navy-blue police uniform shirt and navy trousers under a bright fluorescent yellow-green reflective safety vest with silver reflective stripes, a navy peaked cap, white gloves, black shoes; absolutely NO text, NO letters, NO badges with writing and NO logos anywhere on the uniform; perfectly deadpan and polite.

The SAME woman as attached image 2 (same face, ponytail, bangs and beauty mark) but off duty: no cap, no vest, wearing a plain gray hoodie, jeans and white sneakers, holding a red plastic supermarket basket full of groceries with a long green leek sticking out. 3/4 view turned slightly to the LEFT, standing still and staring flatly at the viewer with the exact same deadpan face, one eyebrow raised.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 12. 아빠 컷인 — 가슴에 손, 분홍 하트 "마음속으로 켰어"
- 저장: `naemonambul/01-car/art/cutin/dad-heart.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `art/common/cutin/dad-proud.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c03
- 영상에서의 움직임: 하트가 깜빡이처럼 켜졌다 꺼진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer. One hand placed gently on his chest, eyes closed peacefully, a serene absurdly sincere smile, a soft glowing pink heart of light shining from his chest, dreamy pink and pastel bokeh sparkles around him.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 13. 장면 — 마트 앞 소화전, 그 앞에 선 남의 차
- 저장: `naemonambul/01-car/art/full/mart-hydrant.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04
- 영상에서의 움직임: 소화전 쪽으로 당겨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The front of a big Korean neighborhood supermarket building on a sunny Saturday (blank sign board, no letters), a wide sidewalk with shopping carts. At the curb, a bright red fire hydrant stands in front of a section of curb painted red; a dark gray SUV with no logo and a blank plate is parked right in front of the hydrant, blocking it. Small shock lines around the SUV. No people.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 14. 장면 — 아빠가 소화전 앞에 대고 "딱 1분만"
- 저장: `naemonambul/01-car/art/full/dad-hydrant.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c04a
- 영상에서의 움직임: 멈춤 + 이름표가 붙는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

The same supermarket front with the bright red fire hydrant and red-painted curb: now the plain white sedan (no logo, blank plate) is parked right in front of the hydrant. The dad (attached image 2, same face and mustard cardigan) stands next to the car holding up one index finger with a cheeky wink and a big grin, as if saying 'just one minute', car keys dangling from the other hand. Sweat drop, sparkle.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. 장면 — 노을빛 벤치의 아이와 아빠 (아이 눈높이)
- 저장: `naemonambul/01-car/art/full/bench-sunset.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `art/common/dad/normal.png` (아빠 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05
- 영상에서의 움직임: 거의 움직이지 않고 아주 천천히 당겨진다.
- 메모: 농담 없는 박자. 따뜻하고 조용하게.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

A quiet warm moment in late afternoon golden light: on a wooden bench outside the supermarket, the 8-year-old kid (attached image 2, same bowl cut and red hoodie) sits next to the dad (attached image 3, same face and mustard cardigan) with two full shopping bags at their feet. The kid looks up at the dad and speaks seriously with a small gentle smile; the dad listens with a soft, thoughtful, slightly embarrassed face. In the background, the red fire hydrant stands clear and unblocked at the curb. Calm, sincere, no comic effects.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 장면 — 돌아오는 길, 2km째 깜빡이 켠 흰 차
- 저장: `naemonambul/01-car/art/full/blinker-home.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06, c06a
- 영상에서의 움직임: 깜빡이 불빛이 반짝이고 뒤에서 빵빵.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

An evening Korean city road under an orange sunset, seen from behind and slightly above: the plain white sedan (no logo, blank plate) drives perfectly straight in its lane with its LEFT turn signal lamp blinking brightly (big glowing orange light flare), while a long line of cars behind it is confused, one car flashing its headlights. Little question mark shapes floating above the cars behind (no letters). No people visible.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

---

## 2. 이미 있는 그림 — 0장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm01` 를 다시 실행하면 위 목록으로 돌아온다.

아직 없다.
