# Gemini 프롬프트 — 내모남불 ④ 부동산편 · 호가 · 호재 · 영끌

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/nm04-realestate/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 25장. 진행: 3 / 25
> 다 넣었으면 `video/` 에서 `npm run make -- nm04` → `video/out/nm04/nm04.mp4`

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
| ✅ | 아빠 — 뿌듯 | `content/_common/art/dad/proud.png` |
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

## 1. 아직 없는 그림 — 22장 (이것만 Gemini 에서 만든다)

#### 2. 사장님 — 계약서와 도장 인주를 내밀며 "여기 찍으시면 됩니다"
- 저장: `content/nm04-realestate/art/realtor/stamp.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm04-realestate/art/realtor/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c00a
- 영상에서의 움직임: 인주를 앞으로 쓱.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the realtor: a Korean woman in her late fifties who has run the neighborhood real-estate office for thirty years, short permed dark-brown hair with a few gray streaks, small reading glasses perched low on her nose on a thin beaded glasses chain, a round calm face; wearing a soft beige cardigan over a lavender blouse, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan, unhurried and polite.

3/4 view turned slightly to the RIGHT. Leaning forward a little, sliding a blank sheet of paper forward with one hand and holding out a small round red ink pad with the other, pointing politely at the bottom of the paper, a calm professional face. The paper is completely blank.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 3. 사장님 — 계산기를 탁탁 두드리며 정색
- 저장: `content/nm04-realestate/art/realtor/calculator.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm04-realestate/art/realtor/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c01a, c07, c07b
- 영상에서의 움직임: 손가락이 계산기를 탁탁, 눈은 아빠를 본다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the realtor: a Korean woman in her late fifties who has run the neighborhood real-estate office for thirty years, short permed dark-brown hair with a few gray streaks, small reading glasses perched low on her nose on a thin beaded glasses chain, a round calm face; wearing a soft beige cardigan over a lavender blouse, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan, unhurried and polite.

3/4 view turned slightly to the RIGHT. Holding a big old-fashioned desk calculator in one hand and tapping it with one finger of the other hand, eyes raised over her reading glasses toward the viewer, perfectly deadpan. The calculator display is blank.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 4. 사장님 정색 (컷인)
- 저장: `content/nm04-realestate/art/cutin/realtor-flat.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm04-realestate/art/realtor/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c02d, c03b, c03e, c04d, c07b
- 영상에서의 움직임: 화면 옆에서 튀어나와 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the realtor: a Korean woman in her late fifties who has run the neighborhood real-estate office for thirty years, short permed dark-brown hair with a few gray streaks, small reading glasses perched low on her nose on a thin beaded glasses chain, a round calm face; wearing a soft beige cardigan over a lavender blouse, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan, unhurried and polite.

Facing slightly to the RIGHT. Perfectly deadpan: pushing her reading glasses up her nose with one finger, half-closed unimpressed eyes, a small flat mouth, a cold white anime glint flashing on the lenses.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 6. 아빠 친구 — 영상 통화 셀카, 새 집 열쇠를 들고 비장하게 "영끌로"
- 저장: `content/nm04-realestate/art/buddy/call-key.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/nm04-realestate/art/buddy/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 캐릭터 (전신, 초록 배경) · 2:3 세로
- 쓰이는 컷: c04, c04a
- 영상에서의 움직임: 열쇠를 흔들며 들썩, 식은땀.
- 메모: 영상에서 휴대폰 화면 틀(코드) 안에 들어간다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a character cutout for a 2D animated video: bold readable silhouette, oversized head and face, clear colors with soft shading.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad's old friend: a Korean man in his mid-forties, round face, short spiky black hair, thick black-framed glasses, a light stubble, slightly chubby; wearing a wrinkled mint-green hoodie; absolutely NO text, NO letters and NO logos anywhere; comically dramatic.

Close selfie-angle bust shot, looking straight at the viewer as if into a phone camera on a video call. Holding up a single shiny new house key next to his face with a proud but shaky grin, one eye twitching, big beads of nervous sweat on his forehead, his other hand clutching a thick blank stack of paper against his chest. Plain soft background.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

The cutout will be animated (hopping, tilting, sliding across the screen), so draw one clear, strongly readable pose with the arms and anything held kept away from the torso, both feet on the same ground line, and nothing cropped.

Full body, the entire character visible from head to toe with a small empty margin on every side, not cropped, centered. Portrait 2:3 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 7. 배경 — 부동산 사무소 바깥 유리창 (매물 시세표)
- 저장: `content/nm04-realestate/art/bg/realtor-window.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00
- 영상에서의 움직임: 유리창 쪽으로 휙 당겨진다.
- 메모: 시세표 종이는 비워 두고 ▲ · ○억 은 코드로 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The front of a small neighborhood real-estate office on the ground floor of an apartment shopping arcade, seen straight-on on a bright morning: a big glass window covered edge to edge with rows of small blank white paper listing sheets taped in a grid, a glass door, a potted plant by the door, a light sidewalk in front. No people, absolutely no text, no numbers, no logos, no signs.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 8. 배경 — 동네 부동산 사무소 안
- 저장: `content/nm04-realestate/art/bg/realtor-office.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c00a, c01, c02, c04, c07
- 영상에서의 움직임: 대사마다 인물 쪽으로 카메라가 옮겨 간다.
- 메모: 주 무대. 인물은 초록 배경 그림을 위에 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Inside a small, cozy neighborhood real-estate office, seen straight-on like a sitcom set: a wooden desk with a desktop monitor and a desk calculator in the back, a big blank framed map board on the wall (no writing), a low leather sofa and a small glass coffee table with paper cups in front, a water dispenser, the glass window with blank listing sheets taped on it seen from inside, warm morning light. No people, absolutely no text, no numbers, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 9. 배경 — 아파트 단지 정문 (빈 현수막)
- 저장: `content/nm04-realestate/art/bg/complex-gate.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c03, c03a, c03b, c03c, c03d
- 영상에서의 움직임: 현수막 쪽으로 쭉 올라간다.
- 메모: 현수막은 비워 두고 글자("모라구역 유치 확정!", "결사반대")는 코드로 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The main gate of a big Korean apartment complex on a sunny afternoon, seen straight-on: tall pale apartment towers in the back, a gate arch with a little guard booth, neat trees, and two long blank white fabric banners hanging tied between the trees and the fence. No people, absolutely no text, no numbers, no logos on the banners or buildings.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 10. 배경 — 해질녘 단지 놀이터
- 저장: `content/nm04-realestate/art/bg/playground-dusk.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커)
- 종류 · 비율: 배경 (사람 없음) · 16:9
- 쓰이는 컷: c06
- 영상에서의 움직임: 아주 천천히 당겨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

Background art only, absolutely no people and no characters. A flat, straight-on stage-like view (like a sitcom set), camera at chest height, no extreme perspective.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

A quiet apartment-complex playground at golden dusk: a small slide and a swing set, a wooden bench under a tree, soft orange sky, warm lit windows of the apartment towers glowing in soft focus behind. No people, no text, no signs, no logos.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the bottom third of the picture an open, uncluttered floor: characters will be placed there later. All signs, posters, screens and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 11. 콜드 오픈 — 시세표 유리창 앞에서 "완전 거품이네" 하는 아빠
- 저장: `content/nm04-realestate/art/full/window-bubble.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/kid/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00
- 영상에서의 움직임: 유리창 → 아빠 얼굴로 휙.

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

In front of the glass window of a small real-estate office covered with blank paper listing sheets: the dad points at the window with one hand on his hip, nose in the air, a sour, judgmental frown, a big cartoon soap bubble floating up from the window beside his finger. The kid stands next to him looking at the window curiously; the mom stands a step behind with arms folded, unimpressed. No text, no numbers.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 12. 콜드 오픈 — 계약서에 도장을 쾅 찍는 아빠
- 저장: `content/nm04-realestate/art/full/stamp-slam.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/mom/normal.png` (같이 나오는 사람 기준 그림 (normal)), ④ `content/nm04-realestate/art/realtor/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c00a
- 영상에서의 움직임: 도장이 쾅 내려오며 화면이 흔들린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 3 shows the mom: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Attached image 4 shows the realtor: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Also in the picture: the mom: a Korean mother in her late 30s, slim with a soft oval face and a fair complexion, a shoulder-length dark brown bob with a side part, one side tucked behind her ear and the ends curling slightly inward, thin silver round wire-frame glasses, calm almond-shaped eyes, wearing a sage-green crew-neck knit sweater, beige wide-leg pants and house slippers; calm, sharp and quietly amused, the one who usually already knows the answer.

Also in the picture: the realtor: a Korean woman in her late fifties who has run the neighborhood real-estate office for thirty years, short permed dark-brown hair with a few gray streaks, small reading glasses perched low on her nose on a thin beaded glasses chain, a round calm face; wearing a soft beige cardigan over a lavender blouse, a blank name badge with absolutely no writing; absolutely NO text, NO letters and NO logos anywhere; perfectly deadpan, unhurried and polite.

Inside a small real-estate office at a wooden desk: the dad slams a small red name stamp down onto a blank sheet of paper with a huge triumphant open-mouthed grin, impact lines bursting around the stamp, sparkles in his eyes. Beside him the mom slaps a hand to her forehead in disbelief; across the desk the realtor sits calmly holding the red ink pad, completely deadpan. The paper is completely blank. No text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 13. 아빠 컷인 — 휴대폰을 보며 눈이 반짝 "우리 집도 이 가격이야"
- 저장: `content/nm04-realestate/art/cutin/dad-sparkle.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-proud.png` (아빠 컷인 표정 참고), ④ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c02b
- 영상에서의 움직임: 크래시 줌, 눈에서 별이 튄다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 4 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer. Holding his phone close to his face with both hands, eyes turned into huge sparkling stars, a wide drooling grin, cheeks flushed pink, tiny hearts and sparkles popping around his head. The phone back faces the viewer, no screen visible.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 14. 아빠의 상상 — 집 앞에 역 · 백화점이 솟고 금빛이 된 우리 집
- 저장: `content/nm04-realestate/art/full/station-imagine.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03a
- 영상에서의 움직임: 건물들이 아래에서 뿅뿅 솟아오른다.
- 메모: 영상에서 분홍 '아빠의 상상' 효과가 얹힌다. 사장님 대사에 금이 가며 깨진다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

A silly imagined scene in pastel pink and gold light: the dad in a shiny gold suit and sunglasses stands on the balcony of a glowing golden apartment tower, arms spread wide in triumph. Around the tower, a subway station entrance, a giant shopping mall and a park with fountains are popping up out of the ground like toys, with sparkles and confetti everywhere. No text, no numbers, no logos, no signs.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 15. ROUND 2 — 머리띠를 두르고 주먹을 든 아빠 "결사반대!"
- 저장: `content/nm04-realestate/art/full/banner-oppose.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림)
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c03d
- 영상에서의 움직임: 주먹이 쿵 올라가며 집중선.
- 메모: 머리띠 · 현수막은 비워 둔다. "결사반대" 글자는 코드로 얹는다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is one complete illustrated scene for an explainer video, composed like a single manga panel.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

At the gate of an apartment complex with a blank white banner behind: the dad wears a plain blank white headband tied tightly around his forehead, one fist thrust high in the air, mouth wide open in a furious shout, veins popping on his temple, flames of passion behind him, comic speed lines. Only moments ago he was calm, so the mood is ridiculous. The headband and banner are completely blank. No text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 16. 아빠 컷인 — 이자 알림을 보고 창백, 지갑에서 돈이 날개 달고 날아감
- 저장: `content/nm04-realestate/art/cutin/dad-interest.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-shock.png` (아빠 컷인 표정 참고)
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c04c
- 영상에서의 움직임: 알림이 띵, 얼굴이 하얗게 질린다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing the viewer. His face drained pale white with gloom lines, eyes bulging, jaw dropped, a single sweat drop, holding an open wallet in one hand as a few banknotes with little cartoon wings fly away out of it, a small phone in his other hand with a blank glowing notification bubble. No text, no numbers on the money.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 17. 아빠 컷인 — 입을 삐죽, 억지 콧방귀 "거품이야, 거품"
- 저장: `content/nm04-realestate/art/cutin/dad-sour.png`
- 첨부 4장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/cutin/dad-proud.png` (아빠 컷인 표정 참고), ④ `content/_common/art/cutin/dad-shock.png` (그 사람 대표 컷인 (얼굴 · 피부 톤))
- 종류 · 비율: 리액션 컷인 (가슴 위, 초록 배경) · 1:1
- 쓰이는 컷: c07a
- 영상에서의 움직임: 고개를 휙 돌리며 콧바람.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a large close-up reaction shot for a comedy video: maximum facial detail, extreme exaggeration, dramatic lighting on the face.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

The character must be exactly the same person as in attached image 2: same face, hairstyle, hair color, clothes, colors and body shape. Only the pose and expression change.

Attached image 4 is a close-up of the same person: match that face, skin tone and level of exaggeration exactly.

Character: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

Facing slightly to the RIGHT. Turning his head away with his nose in the air and eyes squeezed shut, lips pursed into a sour pout, cheeks puffed, a little puff of air snorting out of his nose, a tiny bead of sweat betraying that he is hurt. Sore loser energy.

Comic effect marks (sweat drops, shock lines, sparkles) may surround the character but must stay close to the body.

Chest-up close-up, the face fills most of the frame, centered, not cropped. Square 1:1 aspect ratio.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 18. 아이 눈높이 — 해질녘 놀이터 벤치의 아이와 아빠
- 저장: `content/nm04-realestate/art/full/playground-dusk.png`
- 첨부 3장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/kid/normal.png` (같은 사람 유지용 기준 그림), ③ `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 한 장짜리 장면 (16:9 완성 그림) · 16:9
- 쓰이는 컷: c06
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

A quiet warm moment in golden dusk light: on a wooden bench at an apartment playground, the kid sits next to the dad swinging their legs, looking up at him with a serious, gentle face; the dad, his phone resting face-down on his knee, looks down at the kid with a soft, thoughtful, slightly embarrassed smile. Calm, sincere, no comic effects, no text.

The camera will slowly pan and zoom across this picture, so paint about 8% extra scenery at every edge and keep nothing important within that margin.

Keep the main subject in the middle and leave the top-left corner calm (a caption is added there later). All signs and labels are blank shapes with no text. 16:9 landscape, highest resolution.
```

#### 20. 소품 — 매물 시세표 한 장
- 저장: `content/nm04-realestate/art/prop/listing-sheet.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c00, c02a
- 영상에서의 움직임: 툭 붙었다가 살짝 펄럭.
- 메모: "○억" · ▲ 는 코드로 얹는다. 실제 가격은 절대 넣지 않는다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single small white paper real-estate listing sheet taped to glass with two strips of clear tape at the top corners, a simple line drawing of an apartment building icon in the top left, and empty ruled rows below. Completely blank, no numbers, no letters, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 21. 소품 — 지하철역 입구 (호재)
- 저장: `content/nm04-realestate/art/prop/station.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c03, c03a
- 영상에서의 움직임: 땅에서 뿅 솟아오른다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A cute chunky subway station entrance with a glass canopy and stairs leading down, a shiny new look with a few sparkles around it. No letters, no numbers, no logos, no line colors with names.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 22. 소품 — 소각장 (굴뚝 건물)
- 저장: `content/nm04-realestate/art/prop/incinerator.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c03c, c03d, c03e
- 영상에서의 움직임: 툭 튀어나와 굴뚝에서 하얀 김이 폴폴.
- 메모: 웃음은 아빠의 이중 잣대에만. 시설 자체를 더럽거나 무섭게 그리지 않는다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A clean, modern, friendly-looking waste incineration plant building: a boxy pale gray building with a single tall slim chimney releasing a soft puff of white steam, a few small trees in front. Neutral and tidy, not dirty or scary. No letters, no numbers, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 23. 소품 — 대단지 아파트 (속사포 · 세대수)
- 저장: `content/nm04-realestate/art/prop/big-complex.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05
- 영상에서의 움직임: 동이 하나씩 뿅뿅 늘어난다 (코드 효과).

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A huge cluster of many identical pale apartment towers packed tightly together, seen from a slight bird's-eye angle, like a cute toy model. No letters, no numbers, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 24. 소품 — 새 집 열쇠 (전세 · 집주인)
- 저장: `content/nm04-realestate/art/prop/house-key.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c05
- 영상에서의 움직임: 빙글 돌며 반짝.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A single shiny brass house key on a small ring with a tiny house-shaped keychain, glinting with sparkles. No letters, no numbers, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

#### 25. 소품 — 높은 가지의 포도 송이 (신 포도 카드)
- 저장: `content/nm04-realestate/art/prop/sour-grapes.png`
- 첨부 1장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-prop.png` (소품 화풍 앵커 (사람 없는 소품))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: c07a
- 영상에서의 움직임: 포도가 위로 쓱 멀어진다.

```text
Japanese gag-manga sticker illustration style. A single object sticker: no human, no face unless the description below asks for one. Semi-realistic airbrushed shading with glossy highlights. Thin brown-black ink linework, saturated colors, clean edges. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the drawing style of the first attached image (line weight, shading, color saturation) but draw a completely NEW object as described below. Do not copy, edit or reuse the attached object.

A plump bunch of glossy purple grapes hanging high from a curling vine branch, with a little sour green squiggle aura around it. No letters, no numbers, no logos.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 3장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm04` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 공인중개사 사장님 — 기본 | `content/nm04-realestate/art/realtor/normal.png` |
| 5 | 아빠 친구 — 기본 (3편 그림 그대로) | `content/nm04-realestate/art/buddy/normal.png` |
| 19 | 소품 — 빨간 위 화살표 그래프 휴대폰 (3편 그림 그대로) | `content/nm04-realestate/art/prop/phone-up.png` |
