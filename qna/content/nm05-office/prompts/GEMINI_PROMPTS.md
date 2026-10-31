# Gemini 프롬프트 — 내모남불 ⑤ 회사편 · 연차 · 퇴근 카톡 · 내 덕 남 탓

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `content/nm05-office/script/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 25장. 진행: 25 / 25
> 다 넣었으면 `video/` 에서 `npm run make -- nm05` → `video/out/nm05/nm05.mp4`

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
| ✅ | 컷인 — 아빠 충격 | `content/_common/art/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `content/_common/art/cutin/dad-proud.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `content/_common/art/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `content/_common/art/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `content/_common/art/cutin/dad-sig-3.png` |
| ✅ | 컷인 — 아이 질문 | `content/_common/art/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `content/_common/art/cutin/kid-doubt.png` |
| ✅ | 시그니처 — 아이 거꾸로 손 가면 아악! | `content/_common/art/cutin/kid-sig.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `content/_common/art/cutin/mom-smirk.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- nm05` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 25장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm05` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 인사팀 과장님 — 기본 | `content/nm05-office/art/hr/normal.png` |
| 2 | 과장님 — 태블릿을 내밀며 안내 · 정색 | `content/nm05-office/art/hr/tablet.png` |
| 3 | 과장님 정색 (컷인) — 태블릿 화면 번쩍 | `content/nm05-office/art/cutin/hr-flat.png` |
| 4 | 과장님 폭발 (컷인) — "그건 제 푸딩이라고요!!" | `content/nm05-office/art/cutin/hr-rage.png` |
| 5 | 김 대리 — 기본 | `content/nm05-office/art/junior/normal.png` |
| 6 | 김 대리 — 다크서클로 휴대폰을 쥐고 꾸벅 | `content/nm05-office/art/junior/tired.png` |
| 7 | 모라구 — 방문증을 두 손으로 들고 신남 | `content/nm05-office/art/kid/badge.png` |
| 8 | 배경 — 아빠 사무실 | `content/nm05-office/art/bg/office.png` |
| 9 | 배경 — 회의실 | `content/nm05-office/art/bg/meeting-room.png` |
| 10 | 배경 — 탕비실 | `content/nm05-office/art/bg/pantry.png` |
| 11 | 콜드 오픈 — 커피 들고 넥타이 휘날리며 뛰어 들어오는 아빠와 모라구 | `content/nm05-office/art/full/late-dash.png` |
| 12 | 아빠의 상상 — 해먹 · 선글라스 · 주스 "월요일 연차" | `content/nm05-office/art/cutin/dad-monday.png` |
| 13 | 아빠 — 밤 11시, 침대에서 휴대폰 빛에 얼굴 퍼렇게 분노 | `content/nm05-office/art/cutin/dad-bed-phone.png` |
| 14 | 아빠 — 휴대폰을 코앞에 대고 숫자 1을 뚫어지게 | `content/nm05-office/art/cutin/dad-stare.png` |
| 15 | 회의실 — 오르는 그래프 앞에서 가슴 펴는 아빠 | `content/nm05-office/art/full/meeting-up.png` |
| 16 | 아빠의 상상 — 트로피 · 꽃가루 · 헹가래 | `content/nm05-office/art/full/trophy-imagine.png` |
| 17 | 아빠 — 손가락으로 옆을 가리키며 시선 피함 "팀이…" | `content/nm05-office/art/cutin/dad-blame.png` |
| 18 | 아이 눈높이 — 해질녘 회사 앞 횡단보도의 모라구와 아빠 | `content/nm05-office/art/full/office-dusk.png` |
| 19 | 반전 — 탕비실 냉장고 앞에서 푸딩을 들고 신난 아빠 | `content/nm05-office/art/full/pudding.png` |
| 20 | 소품 — 목걸이 방문증 | `content/nm05-office/art/prop/visitor-badge.png` |
| 21 | 소품 — 탁상 달력 (한 칸에 빨간 동그라미) | `content/nm05-office/art/prop/calendar.png` |
| 22 | 소품 — 태블릿 (빈 화면) | `content/nm05-office/art/prop/tablet.png` |
| 23 | 소품 — 컵 푸딩 + 숟가락 | `content/nm05-office/art/prop/pudding.png` |
| 24 | 소품 — 테이크아웃 커피 두 잔 | `content/nm05-office/art/prop/coffee.png` |
| 25 | 소품 — 금 트로피 | `content/nm05-office/art/prop/trophy.png` |
