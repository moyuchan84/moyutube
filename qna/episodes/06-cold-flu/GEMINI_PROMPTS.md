# Gemini 프롬프트 — 6편 · 감기 · 독감, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep06/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 23장. 진행: 23 / 23
> 다 넣었으면 `video/` 에서 `npm run make -- ep06` → `video/out/ep06/ep06.mp4`

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
| ✅ | 아빠 — 설명 | `art/common/dad/explain.png` |
| ✅ | 아빠 — 생각 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 몰래 검색 | `art/common/dad/search.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `art/common/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `art/common/mom/explain.png` |
| ✅ | 엄마 — 한숨 (이마 짚기) | `art/common/mom/sigh.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `art/common/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `art/common/kid/ask-b.png` |
| ✅ | 엄마 — 설명 (말하는 그림) | `art/common/mom/explain-b.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep06` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 23장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep06` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 소아과 대기실 | `episodes/06-cold-flu/art/bg/clinic-waiting.png` |
| 2 | 배경 — 주사실 | `episodes/06-cold-flu/art/bg/injection-room.png` |
| 3 | 간호사 — 기본 | `episodes/06-cold-flu/art/nurse/normal.png` |
| 4 | 간호사 — 쟁반 들고 | `episodes/06-cold-flu/art/nurse/tray.png` |
| 5 | 간호사 — 웃으며 바로잡기 | `episodes/06-cold-flu/art/nurse/correct.png` |
| 6 | 간호사 — 바로잡기 (말하는 그림) | `episodes/06-cold-flu/art/nurse/correct-b.png` |
| 7 | 간호사 — 미소 | `episodes/06-cold-flu/art/nurse/smile.png` |
| 8 | 컷인 — 간호사 바로잡기 | `episodes/06-cold-flu/art/cutin/nurse-correct.png` |
| 9 | 소품 — 예방접종 포스터 | `episodes/06-cold-flu/art/prop/vaccine-poster.png` |
| 10 | 소품 — 커다란 곰인형 | `episodes/06-cold-flu/art/prop/bear-doll.png` |
| 11 | 소품 — 엄마 가방 속 약 봉투 | `episodes/06-cold-flu/art/prop/med-bag.png` |
| 12 | 소품 — 감기 바이러스 손님들 | `episodes/06-cold-flu/art/prop/cold-crowd.png` |
| 13 | 소품 — 독감 바이러스 한 녀석 | `episodes/06-cold-flu/art/prop/flu-one.png` |
| 14 | 소품 — 독감 바이러스, 새 옷 | `episodes/06-cold-flu/art/prop/flu-one-newcoat.png` |
| 15 | 소품 — 도시락, 네 칸 | `episodes/06-cold-flu/art/prop/lunchbox-4.png` |
| 16 | 소품 — 도시락, 세 칸 | `episodes/06-cold-flu/art/prop/lunchbox-3.png` |
| 17 | 소품 — 흰족제비 | `episodes/06-cold-flu/art/prop/ferret.png` |
| 18 | 소품 — 습도계 | `episodes/06-cold-flu/art/prop/hygrometer.png` |
| 19 | 소품 — 온도계 | `episodes/06-cold-flu/art/prop/thermometer.png` |
| 20 | 무대 — 1743년, 별 아래 이탈리아 골목 | `episodes/06-cold-flu/art/full/italy-1743.png` |
| 21 | 무대 — 1933년, 영국의 연구실 | `episodes/06-cold-flu/art/full/lab-1933.png` |
| 22 | 무대 — 겨울 저녁 거리와 창문 닫은 방 | `episodes/06-cold-flu/art/full/winter-street.png` |
| 23 | 장면 — 다음 편 예고 (내과 · 외과 간판) | `episodes/06-cold-flu/art/full/next-teaser.png` |
