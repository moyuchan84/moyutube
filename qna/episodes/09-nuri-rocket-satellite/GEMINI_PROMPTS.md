# Gemini 프롬프트 — 9편 · 누리호는 지금 뭐 해요? 로켓 · 위성 · 우주선

> `video/scripts/prompts.mjs` 가 만든 파일이다. 직접 고치지 말고 `video/src/ep09/art.json` 을 고친 뒤 `npm run prompts` 를 다시 실행한다.
> 이 편에만 쓰는 그림 21장. 진행: 21 / 21
> 다 넣었으면 `video/` 에서 `npm run make -- ep09` → `video/out/ep09/ep09.mp4`

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
| ✅ | 아빠 — 뿌듯 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 충격 | `art/common/dad/shock.png` |
| ✅ | 아이 — 기본 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | `art/common/kid/ask.png` |
| ✅ | 아이 — 우와 | `art/common/kid/wow.png` |
| ✅ | 아이 — 웃음 | `art/common/kid/laugh.png` |
| ✅ | 엄마 — 기본 | `art/common/mom/normal.png` |
| ✅ | 엄마 — 다 안다는 미소 | `art/common/mom/smirk.png` |
| ✅ | 엄마 — 설명 | `art/common/mom/explain.png` |
| ✅ | 엄마 — 충격 | `art/common/mom/shock.png` |
| ✅ | 컷인 — 아빠 충격 | `art/common/cutin/dad-shock.png` |
| ✅ | 컷인 — 아빠 뿌듯 | `art/common/cutin/dad-proud.png` |
| ✅ | 컷인 — 아이 질문 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 엄마 다 안다는 미소 | `art/common/cutin/mom-smirk.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ① 손 올리기 | `art/common/cutin/dad-sig-1.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ② 입에 딱 | `art/common/cutin/dad-sig-2.png` |
| ✅ | 시그니처 — 아빠 네모 입막음 ③ 부들부들 | `art/common/cutin/dad-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ① 왼쪽 세로줄 | `art/common/cutin/mom-sig-1.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ② 오른쪽 세로줄 | `art/common/cutin/mom-sig-2.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ③ 위 가로줄 | `art/common/cutin/mom-sig-3.png` |
| ✅ | 시그니처 — 엄마 검지 네모 ④ 아래 가로줄 | `art/common/cutin/mom-sig-4.png` |
| ✅ | 시그니처 — 엄마 양 볼 누르고 악! | `art/common/cutin/mom-sig-scream.png` |
| ✅ | 시그니처 — 아이 거꾸로 손 가면 아악! | `art/common/cutin/kid-sig.png` |

---

## 1. 아직 없는 그림 — 0장 (이것만 Gemini 에서 만든다)

남은 그림이 없다. `npm run art -- ep09` 로 처리하고 다음 단계로 넘어간다.

---

## 2. 이미 있는 그림 — 21장 (건너뛴다)

다시 뽑고 싶으면 그 파일을 `_old/` 로 옮긴 뒤 `npm run prompts -- ep09` 를 다시 실행하면 위 목록으로 돌아온다.

| # | 그림 | 파일 |
|---|---|---|
| 1 | 배경 — 우주과학관 전시홀 (주 무대) | `episodes/09-nuri-rocket-satellite/art/bg/museum-hall.png` |
| 2 | 배경 — 우주에서 본 지구 (라운드 카드 뒤) | `episodes/09-nuri-rocket-satellite/art/bg/space-earth.png` |
| 3 | 배경 — 해 질 녘 과학관 앞 주차장 (아이 눈높이 · 반전) | `episodes/09-nuri-rocket-satellite/art/bg/museum-plaza-dusk.png` |
| 4 | 해설사 — 기본 | `episodes/09-nuri-rocket-satellite/art/guide/normal.png` |
| 5 | 해설사 — 정색하고 바로잡기 | `episodes/09-nuri-rocket-satellite/art/guide/correct.png` |
| 6 | 해설사 — 지시봉으로 가리키며 신난 설명 | `episodes/09-nuri-rocket-satellite/art/guide/point.png` |
| 7 | 해설사 — 작은 위성 모형 들고 보여 주기 | `episodes/09-nuri-rocket-satellite/art/guide/model.png` |
| 8 | 해설사 정색 (컷인) | `episodes/09-nuri-rocket-satellite/art/cutin/guide-correct.png` |
| 9 | 아빠 — 하늘에 대고 양손 브이 | `episodes/09-nuri-rocket-satellite/art/dad/v-sign.png` |
| 10 | 아이 — 하늘에 대고 작게 손 흔들기 | `episodes/09-nuri-rocket-satellite/art/kid/wave-sky.png` |
| 11 | 아빠의 상상 — 누리호가 우주에서 셀카 찍으며 브이 | `episodes/09-nuri-rocket-satellite/art/full/nuri-selfie-imagine.png` |
| 12 | 아빠의 상상 — 온 가족이 누리호 타고 우주 휴가 | `episodes/09-nuri-rocket-satellite/art/full/family-rocket-imagine.png` |
| 13 | 장면 — 1단 · 2단이 떨어져 바다로 | `episodes/09-nuri-rocket-satellite/art/full/stage-drop.png` |
| 14 | 소품 — 누리호(3단 로켓) | `episodes/09-nuri-rocket-satellite/art/prop/nuri-rocket.png` |
| 15 | 소품 — 택배 트럭이 된 로켓 | `episodes/09-nuri-rocket-satellite/art/prop/rocket-truck.png` |
| 16 | 소품 — 작은 위성 다섯 대 | `episodes/09-nuri-rocket-satellite/art/prop/small-sats.png` |
| 17 | 소품 — 위성이 보낸 첫 사진(빈 도시 항공 사진) | `episodes/09-nuri-rocket-satellite/art/prop/aerial-photo.png` |
| 18 | 소품 — 지구를 돌며 떨어지는 위성 | `episodes/09-nuri-rocket-satellite/art/prop/earth-orbit.png` |
| 19 | 소품 — 달 (자연 위성) | `episodes/09-nuri-rocket-satellite/art/prop/moon.png` |
| 20 | 소품 — 사람이 탄 우주선 | `episodes/09-nuri-rocket-satellite/art/prop/crew-capsule.png` |
| 21 | 소품 — 누리호 속은 짐뿐 (좌석 없음) | `episodes/09-nuri-rocket-satellite/art/prop/rocket-inside.png` |
