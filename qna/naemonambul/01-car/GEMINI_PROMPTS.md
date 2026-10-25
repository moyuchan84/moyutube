# Gemini 프롬프트 — 내모남불 ① 자동차편 · 끼어들기 · 깜빡이 · 주차

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/nm01/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 16장. 진행: 16 / 16
> 다 넣었으면 `video/` 에서 `npm run make -- nm01` → `video/out/nm01/nm01.mp4`

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
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 컷인 — 아빠 충격 | `art/common/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `art/common/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `art/common/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `art/common/cutin/dad-sig-3.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아이 의심 | `art/common/cutin/kid-doubt.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |
| ✅ | 컷인 — 엄마 어이없음 | `art/common/cutin/mom-sigh.png` |
| ✅ | 시그니처 — 엄마 양 볼 누르고 악! | `art/common/cutin/mom-sig-scream.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 | `art/common/cutin/mom-sig-1.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 | `art/common/cutin/mom-sig-2.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ③ 위 가로줄 | `art/common/cutin/mom-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 | `art/common/cutin/mom-sig-4.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- nm01` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 16장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- nm01` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 장면 — 빨간 경차가 깜빡이 없이 코앞으로 끼어듦 | `naemonambul/01-car/art/full/highway-cutin.png` |
| 2 | 장면 — 차 안 정면 (아빠 운전 · 엄마 조수석 · 아이 뒷좌석) | `naemonambul/01-car/art/full/car-interior.png` |
| 3 | 아빠 컷인 — 핸들 쥐고 분노 | `naemonambul/01-car/art/cutin/dad-rage-wheel.png` |
| 4 | 아빠 컷인 — 한 손 운전, 휘파람 "모 어때~" | `naemonambul/01-car/art/cutin/dad-chill.png` |
| 5 | 장면 — 출구 앞 긴 줄, 맨 앞에서 끼어드는 검은 차 | `naemonambul/01-car/art/full/exit-queue.png` |
| 6 | 아빠의 상상 — 법복 입은 아빠가 망치를 탕 | `naemonambul/01-car/art/full/judge-imagine.png` |
| 7 | 장면 — 아빠 차가 빈 차로로 달려 맨 앞에서 쓱 | `naemonambul/01-car/art/full/dad-merge.png` |
| 8 | 교통경찰관 — 기본 | `naemonambul/01-car/art/traffic/normal.png` |
| 9 | 교통경찰관 — 경광봉으로 갓길 가리키기 | `naemonambul/01-car/art/traffic/point.png` |
| 10 | 교통경찰관 정색 (컷인) | `naemonambul/01-car/art/cutin/traffic-flat.png` |
| 11 | 교통경찰관 — 비번, 장 보러 온 차림 | `naemonambul/01-car/art/traffic/shopping.png` |
| 12 | 아빠 컷인 — 가슴에 손, 분홍 하트 "마음속으로 켰어" | `naemonambul/01-car/art/cutin/dad-heart.png` |
| 13 | 장면 — 마트 앞 소화전, 그 앞에 선 남의 차 | `naemonambul/01-car/art/full/mart-hydrant.png` |
| 14 | 장면 — 아빠가 소화전 앞에 대고 "딱 1분만" | `naemonambul/01-car/art/full/dad-hydrant.png` |
| 15 | 장면 — 노을빛 벤치의 아이와 아빠 (아이 눈높이) | `naemonambul/01-car/art/full/bench-sunset.png` |
| 16 | 장면 — 돌아오는 길, 2km째 깜빡이 켠 흰 차 | `naemonambul/01-car/art/full/blinker-home.png` |
