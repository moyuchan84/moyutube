# Gemini 프롬프트 — 채널 '모라구' 프로필 · 배너

채널 얼굴로 쓰는 그림 두 장이다. 영상 그림과 같은 화풍을 쓰고, 가족 세 사람(아빠 · 아이 · 엄마)이 같이 나온다.
글자는 그리지 않는다. 채널 이름은 필요하면 나중에 얹는다.

## 사용법

1. **한 대화창**에서 1번(프로필) → 2번(배너) 순서로 만든다. 엄마 얼굴이 두 장에서 같아야 하기 때문이다.
2. 블록의 **첨부** 이미지를 순서대로 같이 올린다. ①은 화풍, ②③은 아빠 · 아이를 같은 사람으로 유지하는 기준 그림이다.
3. 2번을 만들 때는 방금 나온 1번 결과도 같이 첨부한다 (엄마 기준 그림).
4. 결과는 **저장** 경로와 이름 그대로 넣는다.

엄마는 아직 기준 그림이 없어서 아래 묘사로 처음 만든다. 머리 모양 · 옷 · 안경은 실제와 맞게 고쳐도 된다.
마음에 드는 엄마가 나오면 그 그림을 `art/common/mom/normal.png` 로도 저장해 두면 이후 영상에서 같은 사람으로 쓸 수 있다.

### 다시 뽑을 때 이어서 보내는 문장

| 문제 | 문장 |
|---|---|
| 얼굴이 가장자리에 걸림 | `Move all three faces closer to the center. Nothing important near the edges.` |
| 아빠 · 아이가 다른 사람처럼 나옴 | `Keep the dad exactly as in attached image 2 and the kid exactly as in attached image 3: same face, hair and clothes.` |
| 글자가 들어감 | `Remove all text and letters.` |
| 화풍이 순해짐 | `More grotesque gag-manga exaggeration, like the first attached image: bigger mouths, bulging eyes, more sweat.` |
| 배너에서 인물이 너무 큼 | `Zoom out. The three characters must fit entirely inside a narrow horizontal band in the middle of the picture, about one quarter of the image height.` |

---

#### 1. 프로필 사진 — 세 가족 얼굴

- 저장: `art/channel/profile.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (아빠), ③ `art/common/kid/normal.png` (아이)
- 비율: 1:1 (유튜브가 **원형**으로 잘라서 보여 준다)
- 메모: 댓글 옆에 아주 작게 나오므로 얼굴이 크고 단순해야 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. Korean people. No text, no letters, no numbers, no logos, no watermark, no signature.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A YouTube channel profile picture showing a family of three, faces only, squeezed close together like a family selfie.

The dad must be exactly the same person as in attached image 2, and the kid exactly the same person as in attached image 3: same face, hairstyle, hair color and clothes.

Center, in front and largest: the kid, an 8-year-old Korean child with a black bowl-cut, huge round curious eyes and one missing front tooth, wearing a red hoodie. One hand cupped behind the ear, head tilted, mouth wide open in a loud cheeky "What did you say?!" expression.

Upper left, behind the kid: the dad, a Korean father in his late 30s, slightly chubby round face, short black hair clearly thinning on top, thick eyebrows, faint stubble, mustard-yellow knit cardigan. Flustered and caught off guard: eyes bulging sideways toward the kid, a stiff awkward grin, one big sweat drop.

Upper right, behind the kid: the mom, a Korean mother in her late 30s with a shoulder-length dark brown bob tucked behind one ear, round glasses, a soft oval face, wearing a sage-green sweater. Calm and amused: a knowing half-smile, one eyebrow raised, looking at the dad as if she already knows the answer.

Chest-up, the three heads overlap slightly and form a tight triangle. All three faces must fit completely inside a circle in the middle of the square, with empty margin around them, because the image will be cropped to a circle.

Background: a single flat warm cream-yellow color with a few simple comic burst lines behind the heads. No scenery, no objects.

Square 1:1 aspect ratio, highest resolution.
```

#### 2. 배너 이미지 — 채널 상단

- 저장: `art/channel/banner.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/normal.png` (아빠), ③ `art/common/kid/normal.png` (아이), ④ 방금 만든 `art/channel/profile.png` (엄마 기준)
- 비율: 16:9 (2048×1152 이상, 6MB 이하)
- 메모: 폰과 PC에서는 **가운데 가로 띠**(전체 높이의 4분의 1 남짓)만 보인다. 중요한 것은 전부 그 띠 안에 있어야 하고, 위아래는 잘려도 되는 배경이어야 한다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean people. No text, no letters, no numbers, no logos, no watermark, no signature.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A wide YouTube channel banner. The dad must be exactly the same person as in attached image 2, the kid exactly the same person as in attached image 3, and the mom exactly the same person as the woman in attached image 4.

Very important layout rule: only a narrow horizontal band across the middle of the picture will be visible on most screens. Everything that matters must sit entirely inside that band, which is about one quarter of the image height and the middle 60 percent of the image width. The areas above and below the band are plain background that can be cropped away.

Inside the band, on the right half: the family of three in a row, shown from the waist up.
The kid (8-year-old Korean child, black bowl-cut, huge round eyes, one missing front tooth, red hoodie) stands in front, pointing straight up with one finger and asking a question with a wide open mouth.
The dad (late 30s, slightly chubby, thinning short black hair, thick eyebrows, faint stubble, mustard-yellow knit cardigan) leans back in panic, eyes bulging, scratching the back of his neck, sweat drops flying.
The mom (late 30s, shoulder-length dark brown bob, round glasses, sage-green sweater) stands beside them with her arms crossed and a calm, amused half-smile.

Inside the band, on the left half: empty calm space with nothing in it except a few large comic question marks drawn as simple shapes fading into the background. A title will be added there later.

Background for the whole picture: a flat warm cream-yellow color with a subtle halftone dot pattern, slightly darker toward the top and bottom edges. No room, no furniture, no scenery.

16:9 landscape aspect ratio, highest resolution.
```
