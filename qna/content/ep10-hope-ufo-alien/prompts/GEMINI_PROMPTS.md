# Gemini 프롬프트 — 10편 · 외계인 진짜 있어요? UFO · 외계 생명체 · 외계인

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/ep10-hope-ufo-alien/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 24장. 진행: 24 / 24
> 다 넣었으면 `video/` 에서 `npm run make -- ep10` → `video/out/ep10/ep10.mp4`

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
| ✅ | 아빠 — 설명 | `content/_common/art/dad/explain.png` |
| ✅ | 아빠 — 뿌듯 | `content/_common/art/dad/proud.png` |
| ✅ | 아빠 — 충격 | `content/_common/art/dad/shock.png` |
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 아이 — 질문 | `content/_common/art/kid/ask.png` |
| ✅ | 아이 — 우와 | `content/_common/art/kid/wow.png` |
| ✅ | 아이 — 의심 | `content/_common/art/kid/doubt.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `content/_common/art/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `content/_common/art/mom/explain.png` |
| ✅ | 엄마 — 충격 | `content/_common/art/mom/shock.png` |
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |
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

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep10` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 24장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep10` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 밤 거실, 영화 보는 TV 불빛 (콜드 오픈) | `content/ep10-hope-ufo-alien/art/bg/living-room-movie.png` |
| 2 | 배경 — 시민 천문대 전시실 (주 무대) | `content/ep10-hope-ufo-alien/art/bg/observatory-hall.png` |
| 3 | 배경 — 별 가득한 우주 (라운드 카드 뒤) | `content/ep10-hope-ufo-alien/art/bg/deep-space.png` |
| 4 | 배경 — 밤 천문대 옥상 · 주차장 (아이 눈높이 · 반전) | `content/ep10-hope-ufo-alien/art/bg/observatory-roof-night.png` |
| 5 | 천문대 연구원 — 기본 | `content/ep10-hope-ufo-alien/art/astro/normal.png` |
| 6 | 연구원 — 정색하고 바로잡기 | `content/ep10-hope-ufo-alien/art/astro/correct.png` |
| 7 | 연구원 — 하늘을 가리키며 설명 | `content/ep10-hope-ufo-alien/art/astro/point.png` |
| 8 | 연구원 — 귀에 손 대고 우주 소리 듣기 | `content/ep10-hope-ufo-alien/art/astro/listen.png` |
| 9 | 연구원 정색 (컷인) | `content/ep10-hope-ufo-alien/art/cutin/astro-correct.png` |
| 10 | 장면 — 밤 소파에서 영화 보는 엄마 아빠, 끼어든 아이 | `content/ep10-hope-ufo-alien/art/full/sofa-movie.png` |
| 11 | 아빠의 상상 — 외계인 우주선이 태양계에 놀러 옴 | `content/ep10-hope-ufo-alien/art/full/ufo-visit-imagine.png` |
| 12 | 아빠의 상상 — 문어 머리 초록 아저씨 | `content/ep10-hope-ufo-alien/art/full/octopus-alien-imagine.png` |
| 13 | 아빠 — 하늘 가리키며 "외계인이다!" | `content/ep10-hope-ufo-alien/art/dad/point-sky.png` |
| 14 | 아이 — 하늘에 귀 대고 듣기 | `content/ep10-hope-ufo-alien/art/kid/ear-sky.png` |
| 15 | 소품 — 홉 열매 (맥주 재료) | `content/ep10-hope-ufo-alien/art/prop/hop-cone.png` |
| 16 | 소품 — 옛 독일 궁정 맥주집 | `content/ep10-hope-ufo-alien/art/prop/court-beer-hall.png` |
| 17 | 소품 — UFO의 정체들 (풍선 · 드론 · 비행기 · 금성) | `content/ep10-hope-ufo-alien/art/prop/ufo-unknowns.png` |
| 18 | 소품 — 다른 별에서 온 얼음 혜성 | `content/ep10-hope-ufo-alien/art/prop/interstellar-comet.png` |
| 19 | 소품 — 화성 표범 무늬 돌 | `content/ep10-hope-ufo-alien/art/prop/mars-leopard-rock.png` |
| 20 | 소품 — 아주 작은 세균들 | `content/ep10-hope-ufo-alien/art/prop/microbes.png` |
| 21 | 소품 — 거대 전파 망원경 | `content/ep10-hope-ufo-alien/art/prop/radio-telescope.png` |
| 22 | 소품 — 별까지 가는 느린 탐사선 | `content/ep10-hope-ufo-alien/art/prop/space-probe.png` |
| 23 | 소품 — 밤하늘 비행기 (깜빡이는 빨간 불) | `content/ep10-hope-ufo-alien/art/prop/blinking-plane.png` |
| 24 | 썸네일 — 영화 포스터 느낌 그림 (실제 포스터 아님) | `content/ep10-hope-ufo-alien/art/full/hope-poster.png` |
