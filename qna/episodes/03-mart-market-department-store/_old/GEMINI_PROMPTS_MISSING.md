# 3편 — 아직 없는 그림만 (2장)

> 2026-10-14 에 폴더를 확인해 **저장 경로에 파일이 없는 그림만** 모은 것이다. 프롬프트는 `GEMINI_PROMPTS.md` · `art/common/GEMINI_PROMPTS.md` 의 것과 글자 하나 다르지 않다.
> 꼭 필요한 그림 0장, 없어도 되는 그림(말하는 그림) 2장. 이미 있는 그림 36장은 뺐다.

## 사용법

1. 위에서부터 차례대로 한 블록씩 Gemini 에 붙여넣는다.
2. 블록의 **첨부** 이미지를 같이 올린다. ①은 화풍 앵커 `art/anchor/style-cutin.png`, ②가 있으면 같은 사람 유지용 기준 그림이다 (순서 중요).
3. 결과는 **저장** 경로와 이름 그대로 넣는다. 배경 제거 · 자르기 · 크기 조절은 하지 않는다.
4. 할머니 그림은 한 대화창에서 끝내고, 소품 · 무대는 새 대화창에서 시작한다.
5. 글자는 그리지 않는다.
6. 다 넣었으면 `video/` 에서 `npm run make -- ep03`.

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

## 목록

| | 그림 | 저장 | |
|---|---|---|---|
| 1 | 아빠 — 설명 (말하는 그림) | `art/common/dad/explain-b.png` | 없어도 됨 |
| 2 | 아이 — 질문 (말하는 그림) | `art/common/kid/ask-b.png` | 없어도 됨 |

---

## 3. 공통 — 말하는 그림 (없어도 됨, 각자 새 대화창)

### 1. 아빠 — 설명 (말하는 그림)
- 저장: `art/common/dad/explain-b.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/dad/explain.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: 설명 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Change only the face and the raised hand: the mouth is now closed in a confident smile (as if between two words) and the raised index finger is tilted a few degrees forward.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

### 2. 아이 — 질문 (말하는 그림)
- 저장: `art/common/kid/ask-b.png`
- 첨부: ① `art/anchor/style-cutin.png` (화풍 앵커), ② `art/common/kid/ask.png` (첫 번째 프레임 — 이 그림을 그대로 다시 그린다)
- 종류 · 비율: 말하는 그림 (두 번째 프레임, 초록 배경) · 기준 그림과 같게
- 영상에서의 움직임: 질문 그림과 1/8초마다 번갈아 나와서 입이 움직인다.
- **없어도 된다.** 없으면 그 움직임만 빠지고 영상은 그대로 나온다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

This is the SECOND FRAME of a two-frame animation. Redraw attached image 2 EXACTLY: same character, same pose, same size, same position in the frame, same clothes, same colors, same line work, same framing and margins. Change ONLY what is described below. Everything else must be pixel-for-pixel as close to attached image 2 as possible so the two frames can be flipped back and forth.

Character: the kid: an 8-year-old Korean child with a black bowl-cut, huge round curious eyes, one missing front tooth, wearing a red hoodie, navy shorts and white socks; small, fearless and very direct.

Change only the face: the mouth is now closed in a small pouty line (as if between two words) and the eyebrows are a little lower. The pointing arm stays exactly where it is.

Same aspect ratio, framing and margins as attached image 2.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```
