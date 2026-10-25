# Gemini 프롬프트 — 3편 · 마트 · 시장 · 백화점, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep03/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 21장. 진행: 21 / 21
> 다 넣었으면 `video/` 에서 `npm run make -- ep03` → `video/out/ep03/ep03.mp4`

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

아래는 이 편이 쓰는 공통 그림이다. 프롬프트는 [art/common/GEMINI_PROMPTS.md](../../art/common/GEMINI_PROMPTS.md)에 있고, 다른 편에서 이미 만들었으면 건너뛴다.

| | 그림 | 파일 |
|---|---|---|
| ✅ | 아빠 — 기본 | `art/common/dad/normal.png` |
| ✅ | 아빠 — 당황 | `art/common/dad/panic.png` |
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 아빠 — 설명 | `art/common/dad/explain.png` |
| ✅ | 아빠 — 생각 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 몰래 검색 | `art/common/dad/search.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 의심 | `art/common/kid/doubt.png` |
| ✅ | 아이 — 웃음 | `art/common/kid/laugh.png` |
| ✅ | 컷인 — 아빠 당황 | `art/common/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `art/common/cutin/kid-doubt.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `art/common/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `art/common/kid/ask-b.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep03` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 21장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep03` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 전통시장 골목 | `episodes/03-mart-market-department-store/art/bg/market-alley.png` |
| 2 | 앞쪽 레이어 — 채소 좌판 | `episodes/03-mart-market-department-store/art/prop/stall-front.png` |
| 3 | 할머니 — 기본 | `episodes/03-mart-market-department-store/art/granny/normal.png` |
| 4 | 할머니 — 입담 | `episodes/03-mart-market-department-store/art/granny/banter.png` |
| 5 | 할머니 — 입담 (말하는 그림) | `episodes/03-mart-market-department-store/art/granny/banter-b.png` |
| 6 | 할머니 — 껄껄 | `episodes/03-mart-market-department-store/art/granny/laugh.png` |
| 7 | 할머니 — 덤 얹어 주기 | `episodes/03-mart-market-department-store/art/granny/give.png` |
| 8 | 컷인 — 할머니 입담 | `episodes/03-mart-market-department-store/art/cutin/granny-banter.png` |
| 9 | 소품 — 뻥튀기 기계 | `episodes/03-mart-market-department-store/art/prop/ppeongtwigi.png` |
| 10 | 소품 — 콩나물 봉지 | `episodes/03-mart-market-department-store/art/prop/bean-sprouts.png` |
| 11 | 소품 — 빈 가격표 | `episodes/03-mart-market-department-store/art/prop/price-tag.png` |
| 12 | 소품 — 부시코 (1852년 파리의 상인) | `episodes/03-mart-market-department-store/art/prop/boucicaut.png` |
| 13 | 소품 — 장터를 옮겨 다니는 상인 | `episodes/03-mart-market-department-store/art/prop/peddler.png` |
| 14 | 소품 — 상자 가득한 카트 | `episodes/03-mart-market-department-store/art/prop/cart.png` |
| 15 | 소품 — 백화점 쇼핑백 | `episodes/03-mart-market-department-store/art/prop/shopping-bag.png` |
| 16 | 소품 — 시장 좌판 (한 문장 정리용) | `episodes/03-mart-market-department-store/art/prop/icon-market.png` |
| 17 | 무대 — 조선 후기 오일장 | `episodes/03-mart-market-department-store/art/full/five-day-market.png` |
| 18 | 무대 — 1852년 파리, 봉 마르셰 | `episodes/03-mart-market-department-store/art/full/bon-marche.png` |
| 19 | 장면 — 백화점은 고급스러운 건물주 | `episodes/03-mart-market-department-store/art/full/dept-floors.png` |
| 20 | 무대 — 1993년, 첫 대형 할인점 | `episodes/03-mart-market-department-store/art/full/mart-1993.png` |
| 21 | 장면 — 다음 편 예고 (털) | `episodes/03-mart-market-department-store/art/full/next-teaser.png` |
