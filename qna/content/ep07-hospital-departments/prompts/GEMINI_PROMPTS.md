# Gemini 프롬프트 — 7편 · 내과 · 외과, 어디로 가요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/ep07-hospital-departments/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 27장. 진행: 27 / 27
> 다 넣었으면 `video/` 에서 `npm run make -- ep07` → `video/out/ep07/ep07.mp4`

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
| ✅ | 아빠 — 생각 | `content/_common/art/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | `content/_common/art/dad/proud.png` |
| ✅ | 아빠 — 충격 | `content/_common/art/dad/shock.png` |
| ✅ | 아빠 — 몰래 검색 | `content/_common/art/dad/search.png` |
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 아이 — 질문 | `content/_common/art/kid/ask.png` |
| ✅ | 아이 — 우와 | `content/_common/art/kid/wow.png` |
| ✅ | 아이 — 의심 | `content/_common/art/kid/doubt.png` |
| ✅ | 엄마 — 기본 | `content/_common/art/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `content/_common/art/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `content/_common/art/mom/explain.png` |
| ✅ | 엄마 — 한숨 (이마 짚기) | `content/_common/art/mom/sigh.png` |
| ✅ | 엄마 — 충격 | `content/_common/art/mom/shock.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 컷인 — 엄마 어이없음 | `content/_common/art/cutin/mom-sigh.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `content/_common/art/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `content/_common/art/kid/ask-b.png` |
| ✅ | 엄마 — 설명 (말하는 그림) | `content/_common/art/mom/explain-b.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep07` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 27장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep07` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 병원 건물 앞 (층마다 빈 간판) | `content/ep07-hospital-departments/art/bg/building-front.png` |
| 2 | 배경 — 엘리베이터 안 | `content/ep07-hospital-departments/art/bg/elevator.png` |
| 3 | 배경 — 5층 내과 접수대 | `content/ep07-hospital-departments/art/bg/im-reception.png` |
| 4 | 배경 — 3층 정형외과 대기실 | `content/ep07-hospital-departments/art/bg/ortho-waiting.png` |
| 5 | 배경 — 정형외과 진료실 (엑스레이 보는 벽 화면) | `content/ep07-hospital-departments/art/bg/ortho-room.png` |
| 6 | 배경 — 1층 로비 (층별 안내판 앞) | `content/ep07-hospital-departments/art/bg/lobby.png` |
| 7 | 아이 — 손목 붕대 · 무릎 반창고 | `content/ep07-hospital-departments/art/kid/bandage.png` |
| 8 | 내과 접수 선생님 — 아래층 가리키기 | `content/ep07-hospital-departments/art/reception/point-down.png` |
| 9 | 정형외과 원장님 — 기본 | `content/ep07-hospital-departments/art/doctor/normal.png` |
| 10 | 정형외과 원장님 — 엑스레이 가리키기 | `content/ep07-hospital-departments/art/doctor/xray.png` |
| 11 | 정형외과 원장님 — 웃으며 바로잡기 | `content/ep07-hospital-departments/art/doctor/correct.png` |
| 12 | 정형외과 원장님 — 두 손 펴 보이기 ("손으로") | `content/ep07-hospital-departments/art/doctor/hands.png` |
| 13 | 원장님 바로잡기 (컷인) | `content/ep07-hospital-departments/art/cutin/doctor-correct.png` |
| 14 | 소품 — 층별 안내판 | `content/ep07-hospital-departments/art/prop/floor-directory.png` |
| 15 | 소품 — 헛걸음 카운터 (엘리베이터 층수판) | `content/ep07-hospital-departments/art/prop/counter.png` |
| 16 | 소품 — 손목 엑스레이 사진 | `content/ep07-hospital-departments/art/prop/xray-wrist.png` |
| 17 | 소품 — 뼈 모형 | `content/ep07-hospital-departments/art/prop/skeleton.png` |
| 18 | 소품 — 약 · 손 두 아이콘 (내과 · 외과) | `content/ep07-hospital-departments/art/prop/pill-hand.png` |
| 19 | 소품 — 배 속 지도 (맹장 자리 표시) | `content/ep07-hospital-departments/art/prop/belly-map.png` |
| 20 | 무대 — 1745년 런던, 이발사-외과의사 조합 회관 | `content/ep07-hospital-departments/art/full/london-1745.png` |
| 21 | 소품 — 이발소 회전 간판 | `content/ep07-hospital-departments/art/prop/barber-pole.png` |
| 22 | 소품 — 과 갈래 나무 | `content/ep07-hospital-departments/art/prop/dept-tree.png` |
| 23 | 소품 — 간판 두 개 비교 | `content/ep07-hospital-departments/art/prop/sign-compare.png` |
| 24 | 소품 — 병원 크기 계단 네 칸 | `content/ep07-hospital-departments/art/prop/hospital-stairs.png` |
| 25 | 소품 — 진료의뢰서 편지 봉투 | `content/ep07-hospital-departments/art/prop/referral-letter.png` |
| 26 | 한 장 장면 — 밤의 응급실 입구 · 달빛 병원 | `content/ep07-hospital-departments/art/full/night-er.png` |
| 27 | 다음 편 예고 — 빈 자전거 거치대 | `content/ep07-hospital-departments/art/full/next-teaser.png` |
