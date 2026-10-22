# Gemini 프롬프트 — 8편 · 경찰 · 검사 · 판사, 누가 뭘 정해요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep08/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 31장. 진행: 31 / 31
> 다 넣었으면 `video/` 에서 `npm run make -- ep08` → `video/out/ep08/ep08.mp4`

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
| ✅ | 아빠 — 생각 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 아빠 — 몰래 검색 | `art/common/dad/search.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 의심 | `art/common/kid/doubt.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `art/common/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `art/common/mom/explain.png` |
| ✅ | 엄마 — 한숨 (이마 짚기) | `art/common/mom/sigh.png` |
| ✅ | 엄마 — 충격 | `art/common/mom/shock.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 컷인 — 엄마 어이없음 | `art/common/cutin/mom-sigh.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `art/common/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `art/common/kid/ask-b.png` |
| ✅ | 엄마 — 설명 (말하는 그림) | `art/common/mom/explain-b.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep08` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 31장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep08` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 병원 건물 앞 빈 자전거 거치대 | `episodes/08-police-prosecutor-court/art/bg/empty-rack.png` |
| 2 | 배경 — 동네 지구대 안 (민원 책상 · TV · 정수기) | `episodes/08-police-prosecutor-court/art/bg/police-box.png` |
| 3 | 배경 — 지구대 화이트보드 앞 | `episodes/08-police-prosecutor-court/art/bg/whiteboard.png` |
| 4 | 경찰관 — 기본 (신고서 받기) | `episodes/08-police-prosecutor-court/art/police/normal.png` |
| 5 | 경찰관 — 웃으며 바로잡기 | `episodes/08-police-prosecutor-court/art/police/correct.png` |
| 6 | 경찰관 — 화이트보드에 그리기 | `episodes/08-police-prosecutor-court/art/police/draw.png` |
| 7 | 경찰관 — 모니터 돌려 보여 주기 | `episodes/08-police-prosecutor-court/art/police/monitor.png` |
| 8 | 이웃 아저씨 — 억울해서 소리치기 | `episodes/08-police-prosecutor-court/art/neighbor/normal.png` |
| 9 | 아이 — 손목 붕대 · 무릎 반창고 | `episodes/08-police-prosecutor-court/art/kid/bandage.png` |
| 10 | 경찰관 바로잡기 (컷인) | `episodes/08-police-prosecutor-court/art/cutin/police-correct.png` |
| 11 | 이웃 아저씨 억울함 (컷인) | `episodes/08-police-prosecutor-court/art/cutin/neighbor.png` |
| 12 | 소품 — 신고서와 연필 | `episodes/08-police-prosecutor-court/art/prop/report-form.png` |
| 13 | 소품 — 빈 뉴스 화면 (TV) | `episodes/08-police-prosecutor-court/art/prop/tv-news.png` |
| 14 | 소품 — 모자 쓴 동물 입간판 (가상 캐릭터) | `episodes/08-police-prosecutor-court/art/prop/standee.png` |
| 15 | 소품 — 바를 정 자 점수판 | `episodes/08-police-prosecutor-court/art/prop/tally.png` |
| 16 | 소품 — 갈림길 (형사 / 민사) | `episodes/08-police-prosecutor-court/art/prop/fork-road.png` |
| 17 | 소품 — 말판 (칸 8개) | `episodes/08-police-prosecutor-court/art/prop/board-path.png` |
| 18 | 소품 — 자전거 모양 말 | `episodes/08-police-prosecutor-court/art/prop/bike-piece.png` |
| 19 | 소품 — 돋보기 (찾는 사람) | `episodes/08-police-prosecutor-court/art/prop/magnifier.png` |
| 20 | 소품 — 영장 종이 (도장 칸 빈칸) | `episodes/08-police-prosecutor-court/art/prop/warrant.png` |
| 21 | 소품 — 문 두 개 (닫힌 문 · 열린 문) | `episodes/08-police-prosecutor-court/art/prop/two-doors.png` |
| 22 | 소품 — 서류 봉투 (송치) | `episodes/08-police-prosecutor-court/art/prop/case-file.png` |
| 23 | 소품 — 저울과 망치 | `episodes/08-police-prosecutor-court/art/prop/scale-gavel.png` |
| 24 | 소품 — 세 계단 법원 | `episodes/08-police-prosecutor-court/art/prop/court-stairs.png` |
| 25 | 소품 — 차용증 (빌려준 돈 종이) | `episodes/08-police-prosecutor-court/art/prop/iou.png` |
| 26 | 소품 — 민사 길 (소장 → 법원 → 판결 → 집행) | `episodes/08-police-prosecutor-court/art/prop/civil-path.png` |
| 27 | 소품 — 역할 카드 네 장 (경찰 · 중수청 · 검사 · 판사) | `episodes/08-police-prosecutor-court/art/prop/role-cards.png` |
| 28 | 소품 — CCTV 모니터 속 공원 벤치와 자전거 | `episodes/08-police-prosecutor-court/art/prop/cctv-bike.png` |
| 29 | 무대 — 법정 (판사석 · 검사석 · 변호인석 · 피고인석) | `episodes/08-police-prosecutor-court/art/full/courtroom.png` |
| 30 | 무대 — 간판 바뀌는 날 (빈 간판 하나 내려가고 둘 올라감) | `episodes/08-police-prosecutor-court/art/full/sign-change.png` |
| 31 | 한 장 장면 — 다음 편 예고 | `episodes/08-police-prosecutor-court/art/full/next-teaser.png` |
