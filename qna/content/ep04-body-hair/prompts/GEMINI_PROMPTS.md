# Gemini 프롬프트 — 4편 · 아빠는 왜 거기에 털이 나요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/ep04-body-hair/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 34장. 진행: 33 / 34
> 다 넣었으면 `video/` 에서 `npm run make -- ep04` → `video/out/ep04/ep04.mp4`

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
| ✅ | 아빠 — 충격 | `content/_common/art/dad/shock.png` |
| ✅ | 아빠 — 설명 | `content/_common/art/dad/explain.png` |
| ✅ | 아빠 — 생각 | `content/_common/art/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `content/_common/art/dad/proud.png` |
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 아이 — 질문 | `content/_common/art/kid/ask.png` |
| ✅ | 아이 — 우와 | `content/_common/art/kid/wow.png` |
| ✅ | 아이 — 의심 | `content/_common/art/kid/doubt.png` |
| ✅ | 아이 — 웃음 | `content/_common/art/kid/laugh.png` |
| ✅ | 컷인 — 아빠 당황 | `content/_common/art/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `content/_common/art/cutin/kid-doubt.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `content/_common/art/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `content/_common/art/kid/ask-b.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 엄마 — 설명 | `content/_common/art/mom/explain.png` |
| ✅ | 엄마 — 충격 | `content/_common/art/mom/shock.png` |
| ✅ | 엄마 — 다 안다는 미소 | `content/_common/art/mom/smirk.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `content/_common/art/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `content/_common/art/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `content/_common/art/cutin/dad-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 | `content/_common/art/cutin/mom-sig-1.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 | `content/_common/art/cutin/mom-sig-2.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ③ 위 가로줄 | `content/_common/art/cutin/mom-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 | `content/_common/art/cutin/mom-sig-4.png` |
| ✅ | 시그니처 — 엄마 양 볼 누르고 악! | `content/_common/art/cutin/mom-sig-scream.png` |
| ✅ | 시그니처 — 아이 거꾸로 손 가면 아악! | `content/_common/art/cutin/kid-sig.png` |

---

## 1. 아직 없는 그림 — 1장 (이것만 Gemini 에서 만든다)

#### 34. 소품 — 외할아버지 · 친할아버지 사진 (모답맨판)
- 저장: `content/ep04-body-hair/art/prop/grandpa-photos.png`
- 첨부 2장 (빠짐없이, 이 순서로): ① `content/_common/art/anchor/style-cutin.png` (화풍 앵커), ② `content/_common/art/dad/normal.png` (같이 나오는 사람 기준 그림 (normal))
- 종류 · 비율: 소품 (초록 배경) · 1:1
- 쓰이는 컷: ep04f c09, c09b
- 영상에서의 움직임: 왼쪽 사진 → 오른쪽 사진 순서로 확대된다.

```text
Japanese gag-manga sticker illustration style. Grotesquely exaggerated comedic expressions, huge open mouths with detailed teeth and gums, bulging eyes, sweat drops, wrinkles. Semi-realistic airbrushed skin shading with glossy highlights. Big head, short stocky body (about 2.5 heads tall). Thin brown-black ink linework, saturated colors, clean edges. Korean setting, Korean people unless stated otherwise. No text, no letters, no numbers, no logos, no watermark, no signature.

This is a single object cutout for a 2D animated video: bold readable shape, clear colors with soft shading, no people unless stated.

Match the art style of the first attached image exactly: same line weight, same skin shading, same color saturation, same level of exaggeration.

Attached image 2 shows the dad: draw this person with exactly the same face, hairstyle, hair color, clothes, colors and body shape.

Also in the picture: the dad: a Korean father in his late 30s, slightly chubby with a round face, short black hair that is clearly thinning on top, thick eyebrows, faint stubble, wearing a mustard-yellow knit cardigan over a white t-shirt, gray sweatpants and house slippers; a kind but easily flustered look.

ONLY two big old wooden picture frames standing side by side, filling the whole image edge to edge; nothing else, nobody standing outside the frames (the dad himself does NOT appear in this image). LEFT frame: a chest-up portrait photo of a smiling Korean grandpa in his seventies with a big thick fluffy head of gray hair, round glasses, a cardigan (the mom's father). RIGHT frame: a chest-up portrait photo of a Korean grandpa in his seventies whose face looks like a 75-year-old version of the man in attached image 2 (same face shape, same eyebrows, same smile), but completely bald with a super shiny head that has a big sparkle glint (the dad's father). Warm family photos, no text.

The cutout will be animated (popping in, swaying, sliding across the screen), so keep it as one compact connected shape with a clean outline and no loose parts floating apart from it.

The whole subject visible with a small empty margin on every side, not cropped, centered.

Solid flat pure green (#00FF00) background filling everything around the subject: no floor, no cast shadow, no gradient, no scenery, no effects or objects outside the subject.
```

---

## 2. 이미 있는 그림 — 33장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep04` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 동네 이발소 안 | `content/ep04-body-hair/art/bg/barbershop.png` |
| 2 | 배경 — 이발소 앞 (해 질 녘) | `content/ep04-body-hair/art/bg/barbershop-front.png` |
| 3 | 장면 — 샤워 중인 욕실 문 (사람은 안 보인다) | `content/ep04-body-hair/art/full/bathroom-door.png` |
| 4 | 아빠 — 이발 의자 (보자기) | `content/ep04-body-hair/art/dad/cape.png` |
| 5 | 아빠 — 이발 의자에서 당황 | `content/ep04-body-hair/art/dad/cape-panic.png` |
| 6 | 아빠 — 보자기 속 몰래 검색 | `content/ep04-body-hair/art/dad/cape-search.png` |
| 7 | 이발사 할아버지 — 기본 | `content/ep04-body-hair/art/barber/normal.png` |
| 8 | 이발사 할아버지 — 한 수 가르치기 | `content/ep04-body-hair/art/barber/talk.png` |
| 9 | 이발사 할아버지 — 한 수 가르치기 (말하는 그림) | `content/ep04-body-hair/art/barber/talk-b.png` |
| 10 | 이발사 할아버지 — 껄껄 (자기 머리 쓰다듬기) | `content/ep04-body-hair/art/barber/laugh.png` |
| 11 | 이발사 할아버지 — 가슴털 자랑 | `content/ep04-body-hair/art/barber/chest.png` |
| 12 | 이발사 할아버지 — 정수리 보여 주기 | `content/ep04-body-hair/art/barber/bald.png` |
| 13 | 컷인 — 할아버지의 일침 | `content/ep04-body-hair/art/cutin/barber.png` |
| 14 | 소품 — 면도 솔 | `content/ep04-body-hair/art/prop/shaving-brush.png` |
| 15 | 장면 — 햇빛에 비친 아이 팔의 솜털 | `content/ep04-body-hair/art/full/fuzz-arm.png` |
| 16 | 장면 — 털을 가늘게 바꾼 사람 | `content/ep04-body-hair/art/full/hairy-ancestor.png` |
| 17 | 장면 — 지키는 털 (눈썹 · 속눈썹 · 코털) | `content/ep04-body-hair/art/full/guard-hair.png` |
| 18 | 장면 — 털마다 자라는 기간이 다르다 | `content/ep04-body-hair/art/full/hair-timer.png` |
| 19 | 장면 — 털을 세우던 근육 (소름 vs 고양이) | `content/ep04-body-hair/art/full/goosebump-cat.png` |
| 20 | 장면 — 거울에 면도 거품으로 그린 그림 (모자이크) | `content/ep04-body-hair/art/full/mirror-foam.png` |
| 21 | 장면 — 땀샘 두 종류 (털집 안으로 나오는 샘) | `content/ep04-body-hair/art/full/two-glands.png` |
| 22 | 장면 — 정수리 지도 (사막과 숲, 모발이식 트럭) | `content/ep04-body-hair/art/full/bald-map.png` |
| 23 | 소품 — 지키는 털 (한 문장 정리용) | `content/ep04-body-hair/art/prop/icon-guard.png` |
| 24 | 소품 — 알리는 털 (한 문장 정리용) | `content/ep04-body-hair/art/prop/icon-wick.png` |
| 25 | 소품 — 흔적만 남은 털 (한 문장 정리용) | `content/ep04-body-hair/art/prop/icon-trace.png` |
| 26 | 장면 — 다음 편 예고 (병원 · 약국) | `content/ep04-body-hair/art/full/next-teaser.png` |
| 27 | 컷인 — 할아버지 정색 (모답맨판) | `content/ep04-body-hair/art/cutin/barber-flat.png` |
| 28 | 소품 — 아빠의 상상: 털 이불 (모답맨판) | `content/ep04-body-hair/art/prop/fur-blanket.png` |
| 29 | 소품 — 면도기 (모답맨판) | `content/ep04-body-hair/art/prop/razor.png` |
| 30 | 소품 — 털 끝 확대: 뾰족한 끝 vs 잘린 끝 (모답맨판) | `content/ep04-body-hair/art/prop/hair-tips.png` |
| 31 | 소품 — 아빠의 상상: 머리를 너무 써서 닳음 (모답맨판) | `content/ep04-body-hair/art/prop/bulb-brain.png` |
| 32 | 소품 — 어른 준비 스위치 (모답맨판) | `content/ep04-body-hair/art/prop/puberty-switch.png` |
| 33 | 소품 — 아빠의 상상: 머리털 이사 (모답맨판) | `content/ep04-body-hair/art/prop/hair-movers.png` |
