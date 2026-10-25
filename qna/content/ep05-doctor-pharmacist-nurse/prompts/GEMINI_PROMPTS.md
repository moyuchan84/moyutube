# Gemini 프롬프트 — 5편 · 의사 · 약사 · 간호사, 뭐가 달라요?

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/ep05-doctor-pharmacist-nurse/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 28장. 진행: 28 / 28
> 다 넣었으면 `video/` 에서 `npm run make -- ep05` → `video/out/ep05/ep05.mp4`

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
| ✅ | 아빠 — 몰래 검색 | `content/_common/art/dad/search.png` |
| ✅ | 아이 — 기본 | `content/_common/art/kid/normal.png` |
| ✅ | 아이 — 질문 | `content/_common/art/kid/ask.png` |
| ✅ | 아이 — 우와 | `content/_common/art/kid/wow.png` |
| ✅ | 아이 — 의심 | `content/_common/art/kid/doubt.png` |
| ✅ | 아이 — 웃음 | `content/_common/art/kid/laugh.png` |
| ✅ | 컷인 — 아빠 당황 | `content/_common/art/cutin/dad-panic.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 배경 — 밤의 아이 방 | `content/_common/art/bg/kid-room-night.png` |
| ✅ | 배경 — 저녁 밥상 | `content/_common/art/bg/dining-room.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | `content/_common/art/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | `content/_common/art/kid/ask-b.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep05` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 28장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep05` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 동네 약국 안 | `content/ep05-doctor-pharmacist-nurse/art/bg/pharmacy.png` |
| 2 | 앞쪽 레이어 — 약국 카운터 | `content/ep05-doctor-pharmacist-nurse/art/prop/counter-front.png` |
| 3 | 약사 선생님 — 기본 | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/normal.png` |
| 4 | 약사 선생님 — 딱 멈춤 | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/freeze.png` |
| 5 | 약사 선생님 — 몸무게 묻기 | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/ask.png` |
| 6 | 약사 선생님 — 약 상자 보여 주기 | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/explain.png` |
| 7 | 약사 선생님 — 약 상자 보여 주기 (말하는 그림) | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/explain-b.png` |
| 8 | 약사 선생님 — 빙긋 | `content/ep05-doctor-pharmacist-nurse/art/pharmacist/smile.png` |
| 9 | 컷인 — 약사 선생님 멈춤 | `content/ep05-doctor-pharmacist-nurse/art/cutin/pharmacist-freeze.png` |
| 10 | 소품 — 옷걸이에 걸린 흰 가운 세 벌 | `content/ep05-doctor-pharmacist-nurse/art/prop/gowns.png` |
| 11 | 소품 — 명찰 두 개 | `content/ep05-doctor-pharmacist-nurse/art/prop/nametags.png` |
| 12 | 무대 — 소아과 진료실 | `content/ep05-doctor-pharmacist-nurse/art/full/exam-room.png` |
| 13 | 소품 — 의사 선생님 (청진기) | `content/ep05-doctor-pharmacist-nurse/art/prop/doctor.png` |
| 14 | 소품 — 처방전 한 장 | `content/ep05-doctor-pharmacist-nurse/art/prop/prescription.png` |
| 15 | 무대 — 1240년 무렵, 중세 도시의 광장 | `content/ep05-doctor-pharmacist-nurse/art/full/medieval-1240.png` |
| 16 | 소품 — 황제의 칙령 두루마리 | `content/ep05-doctor-pharmacist-nurse/art/prop/edict-scroll.png` |
| 17 | 소품 — 약 상자 | `content/ep05-doctor-pharmacist-nurse/art/prop/medicine-box.png` |
| 18 | 장면 — 밤의 24시 편의점, 상비약 칸 | `content/ep05-doctor-pharmacist-nurse/art/full/convenience-night.png` |
| 19 | 무대 — 1854년, 크림전쟁의 야전병원 | `content/ep05-doctor-pharmacist-nurse/art/full/crimea-1854.png` |
| 20 | 소품 — 등불을 든 간호사 (나이팅게일) | `content/ep05-doctor-pharmacist-nurse/art/prop/nightingale.png` |
| 21 | 소품 — 장미 도표 | `content/ep05-doctor-pharmacist-nurse/art/prop/rose-chart.png` |
| 22 | 무대 — 오늘의 병원 복도 | `content/ep05-doctor-pharmacist-nurse/art/full/hospital-hall.png` |
| 23 | 소품 — 오늘의 간호사 (차트 들고) | `content/ep05-doctor-pharmacist-nurse/art/prop/nurse-modern.png` |
| 24 | 소품 — 청진기 (한 문장 정리용) | `content/ep05-doctor-pharmacist-nurse/art/prop/stethoscope.png` |
| 25 | 소품 — 약봉투 | `content/ep05-doctor-pharmacist-nurse/art/prop/medicine-bag.png` |
| 26 | 소품 — 체온계 | `content/ep05-doctor-pharmacist-nurse/art/prop/thermometer.png` |
| 27 | 소품 — 체온 메모 | `content/ep05-doctor-pharmacist-nurse/art/prop/temp-memo.png` |
| 28 | 장면 — 다음 편 예고 (감기? 독감?) | `content/ep05-doctor-pharmacist-nurse/art/full/next-teaser.png` |
