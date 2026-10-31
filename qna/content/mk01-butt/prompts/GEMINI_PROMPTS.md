# Gemini 프롬프트 — 모덕후 ① 엉덩이 — 잡지 화보 패러디

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/mk01-butt/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 14장. 진행: 12 / 14
> 다 넣었으면 `video/` 에서 `npm run make -- mk01` → `video/out/mk01/mk01.mp4`

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
| ✅ | 엄마 — 다 안다는 미소 | `content/_common/art/mom/smirk.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |

---

## 1. 아직 없는 그림 — 2장 (이것만 Gemini 에서 만든다)

#### 9. 미술관 도록 패러디 — 대리석 조각 등선 위의 45° 각도기
- 저장: `content/mk01-butt/art/full/statue-curve.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c05

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A luxurious art-museum catalog photo: a classical white marble statue of a robed figure seen from the side and slightly behind, fully draped in long flowing carved robes from shoulders to feet, standing on a dark plinth against a deep teal velvet gallery wall with a single warm spotlight. A giant shiny golden protractor floats beside the statue, its glowing arc showing the curve of the lower back under the robes as a clean angle. Elegant, high-end gallery photography. No text, no numbers, no letters. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people, spectators or faces: the scene is completely empty of people. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 잡지 표지 벽 — 시대별 · 나라별로 다른 '이상형' 몸매
- 저장: `content/mk01-butt/art/full/covers-wall.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A gallery wall of about twelve framed vintage and modern fashion magazine covers arranged in a neat grid, each in a different decade's design style (1920s art deco, 1950s pastel, 1970s disco, 1990s grunge, today's minimal), each showing a fully dressed fashion illustration figure in a different body shape and pose: slim, curvy, athletic, round, tall. Warm gallery lighting, slight angle, depth of field. All titles and cover lines completely blank colored bars, no readable text, no letters, no logos. Use the attached image ONLY as a reference for line weight and coloring. Do NOT draw the person from the attached image or any other people, spectators or faces: the scene is completely empty of people. Absolutely no readable words, letters or numbers anywhere.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

---

## 2. 이미 있는 그림 — 12장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- mk01` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 모덕후 삼촌 — 기본 (진지) | `content/mk01-butt/art/modeokhu/normal.png` |
| 2 | 모덕후 삼촌 — 레이저 포인터로 가리키며 "자, 진지하다" | `content/mk01-butt/art/modeokhu/point.png` |
| 3 | 모덕후 삼촌 — 결론, 팔짱 끼고 의기양양 | `content/mk01-butt/art/modeokhu/proud.png` |
| 4 | 모덕후 삼촌 컷인 — 안경 번쩍 | `content/mk01-butt/art/cutin/uncle-glint.png` |
| 5 | 배경 — 작은 세미나실 (화이트보드 · 프로젝터) | `content/mk01-butt/art/bg/lecture.png` |
| 6 | 잡지 표지 촬영 패러디 — 진지하게 포즈 잡은 아빠 | `content/mk01-butt/art/full/cover-shoot.png` |
| 7 | 스포츠 잡지 화보 패러디 — 초원을 달리는 원시인 아빠 | `content/mk01-butt/art/full/run-editorial.png` |
| 8 | 박물관 도록 패러디 — 침팬지와 사람 옆모습 해부도 | `content/mk01-butt/art/full/chimp-human.png` |
| 11 | 청바지 광고 패러디 — 걸어가는 아빠 뒷모습, 몰래 보는 엄마 | `content/mk01-butt/art/full/jeans-ad.png` |
| 12 | 아빠 — 두 손으로 엉덩이 가리며 화들짝 | `content/mk01-butt/art/dad/cover.png` |
| 13 | 아빠 — 결심하고 달려 나감 | `content/mk01-butt/art/dad/run.png` |
| 14 | 소품 — 화보처럼 빛나는 복숭아 | `content/mk01-butt/art/prop/peach.png` |
