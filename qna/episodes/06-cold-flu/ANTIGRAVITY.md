# 6편 · 감기 · 독감, 뭐가 달라요? — 그림 · 음성 작업 지시서

> `video/scripts/handoff.mjs` 가 만든 파일이다. 대본이나 그림 목록을 고친 뒤 `npm run handoff -- ep06` 로 다시 만든다.
> Antigravity 같은 에이전트에게 **이 파일을 읽고 그대로 진행해 달라**고 하면 된다. 작업 폴더는 저장소 루트(`D:\youtube`)다.

## 할 일

1. **그림 29장**을 만들어 정해진 경로에 저장한다 (전체 41장 중 남은 것).
2. **음성 24컷**을 만들어 정해진 경로에 저장한다 (전체 24컷 중 남은 것).
3. 아래 **조립** 명령으로 영상을 만든다.

대본 · 목소리 · 화풍은 이미 정해져 있다. **바꾸지 말고 그대로 만든다.**

## 1. 그림

작업 목록: [`jobs/images.json`](jobs/images.json). 사람이 읽는 판은 [`GEMINI_PROMPTS.md`](GEMINI_PROMPTS.md).

`jobs` 배열을 **위에서부터 차례대로** 처리한다. 한 건의 뜻:

| 필드 | 뜻 |
|---|---|
| `prompt` | 이미지 모델에 **그대로** 넣는 글. 고치거나 줄이지 않는다 |
| `attach` | 프롬프트와 함께 첨부하는 그림 (순서대로). 첫째는 화풍 앵커, 둘째는 같은 사람 유지용 기준 그림 |
| `aspect` | 가로세로 비율 |
| `save` | 결과를 저장할 경로 (저장소 루트 기준, PNG) |
| `done` | `true` 면 이미 있으니 건너뛴다 |
| `optional` | `true` 면 없어도 영상이 나온다 (입 움직임 같은 추가 동작) |

규칙:

- **순서를 지킨다.** `attach` 의 둘째 그림이 아직 없으면 그 그림부터 만든다 (예: `granny/normal` → 나머지 할머니 그림 → `granny/yell-b`).
- **초록 배경(`green: true`)은 그대로 둔다.** 배경 제거 · 자르기 · 크기 조절을 하지 않는다. `npm run art` 가 한다.
- **글자 · 숫자 · 로고를 그리지 않는다.** 간판과 가격표는 빈 모양이다. 글자는 영상 코드가 얹는다.
- 한 사람(할머니)의 그림은 한 대화에서 이어서 만든다. 대화가 길어지면 화풍이 흐려지니 배경 · 장면은 새 대화에서 시작한다.
- 결과를 눈으로 확인한다: 몸이 잘리지 않았는지, 기준 그림과 같은 사람인지, 글자가 들어가지 않았는지. 틀리면 `GEMINI_PROMPTS.md` 의 "다시 뽑을 때 이어서 보내는 문장"을 쓴다.
- Gemini API 키가 저장소 루트 `.env` 에 있으면 명령 한 줄로도 된다: `cd video && node scripts/artgen.mjs ep06` (없는 그림만 만든다. `--list` 를 붙이면 목록만 본다).

| | 그림 | 종류 | 비율 | 저장 |
|---|---|---|---|---|
| ✅ | 아빠 — 기본 | 인물 | 2:3 | `art/common/dad/normal.png` |
| ✅ | 아빠 — 당황 | 인물 | 2:3 | `art/common/dad/panic.png` |
| ✅ | 아빠 — 설명 | 인물 | 2:3 | `art/common/dad/explain.png` |
| ✅ | 아빠 — 생각 | 인물 | 2:3 | `art/common/dad/think.png` |
| ✅ | 아빠 — 뿌듯 | 인물 | 2:3 | `art/common/dad/proud.png` |
| ✅ | 아빠 — 몰래 검색 | 인물 | 2:3 | `art/common/dad/search.png` |
| ✅ | 아이 — 기본 | 인물 | 2:3 | `art/common/kid/normal.png` |
| ✅ | 아이 — 질문 | 인물 | 2:3 | `art/common/kid/ask.png` |
| ⬜ | 엄마 — 기본 | 인물 | 2:3 | `art/common/mom/normal.png` |
| ⬜ | 엄마 — 다 안다는 미소 | 인물 | 2:3 | `art/common/mom/smirk.png` |
| ⬜ | 엄마 — 설명 | 인물 | 2:3 | `art/common/mom/explain.png` |
| ⬜ | 엄마 — 한숨 (이마 짚기) | 인물 | 2:3 | `art/common/mom/sigh.png` |
| ✅ | 컷인 — 아이 질문 | 컷인 | 1:1 | `art/common/cutin/kid-ask.png` |
| ✅ | 컷인 — 아빠 뿌듯 | 컷인 | 1:1 | `art/common/cutin/dad-proud.png` |
| ⬜ | 컷인 — 엄마 다 안다는 미소 | 컷인 | 1:1 | `art/common/cutin/mom-smirk.png` |
| ✅ | 아빠 — 설명 (말하는 그림) | 말하는 그림 | 기준 그림과 같게 | `art/common/dad/explain-b.png` |
| ✅ | 아이 — 질문 (말하는 그림) | 말하는 그림 | 기준 그림과 같게 | `art/common/kid/ask-b.png` |
| ➕ | 엄마 — 설명 (말하는 그림) | 말하는 그림 | 기준 그림과 같게 | `art/common/mom/explain-b.png` |
| ⬜ | 배경 — 소아과 대기실 | 배경 | 16:9 | `episodes/06-cold-flu/art/bg/clinic-waiting.png` |
| ⬜ | 배경 — 주사실 | 배경 | 16:9 | `episodes/06-cold-flu/art/bg/injection-room.png` |
| ⬜ | 간호사 — 기본 | 인물 | 2:3 | `episodes/06-cold-flu/art/nurse/normal.png` |
| ⬜ | 간호사 — 쟁반 들고 | 인물 | 2:3 | `episodes/06-cold-flu/art/nurse/tray.png` |
| ⬜ | 간호사 — 웃으며 바로잡기 | 인물 | 2:3 | `episodes/06-cold-flu/art/nurse/correct.png` |
| ➕ | 간호사 — 바로잡기 (말하는 그림) | 말하는 그림 | 기준 그림과 같게 | `episodes/06-cold-flu/art/nurse/correct-b.png` |
| ⬜ | 간호사 — 미소 | 인물 | 2:3 | `episodes/06-cold-flu/art/nurse/smile.png` |
| ⬜ | 컷인 — 간호사 바로잡기 | 컷인 | 1:1 | `episodes/06-cold-flu/art/cutin/nurse-correct.png` |
| ⬜ | 소품 — 예방접종 포스터 | 소품 | 3:4 | `episodes/06-cold-flu/art/prop/vaccine-poster.png` |
| ⬜ | 소품 — 커다란 곰인형 | 소품 | 3:4 | `episodes/06-cold-flu/art/prop/bear-doll.png` |
| ⬜ | 소품 — 엄마 가방 속 약 봉투 | 소품 | 1:1 | `episodes/06-cold-flu/art/prop/med-bag.png` |
| ⬜ | 소품 — 감기 바이러스 손님들 | 소품 | 16:9 | `episodes/06-cold-flu/art/prop/cold-crowd.png` |
| ⬜ | 소품 — 독감 바이러스 한 녀석 | 소품 | 1:1 | `episodes/06-cold-flu/art/prop/flu-one.png` |
| ⬜ | 소품 — 독감 바이러스, 새 옷 | 소품 | 1:1 | `episodes/06-cold-flu/art/prop/flu-one-newcoat.png` |
| ⬜ | 소품 — 도시락, 네 칸 | 소품 | 4:3 | `episodes/06-cold-flu/art/prop/lunchbox-4.png` |
| ⬜ | 소품 — 도시락, 세 칸 | 소품 | 4:3 | `episodes/06-cold-flu/art/prop/lunchbox-3.png` |
| ⬜ | 소품 — 흰족제비 | 소품 | 16:9 | `episodes/06-cold-flu/art/prop/ferret.png` |
| ⬜ | 소품 — 습도계 | 소품 | 1:1 | `episodes/06-cold-flu/art/prop/hygrometer.png` |
| ⬜ | 소품 — 온도계 | 소품 | 1:3 | `episodes/06-cold-flu/art/prop/thermometer.png` |
| ⬜ | 무대 — 1743년, 별 아래 이탈리아 골목 | 무대 | 16:9 | `episodes/06-cold-flu/art/full/italy-1743.png` |
| ⬜ | 무대 — 1933년, 영국의 연구실 | 무대 | 16:9 | `episodes/06-cold-flu/art/full/lab-1933.png` |
| ⬜ | 무대 — 겨울 저녁 거리와 창문 닫은 방 | 무대 | 16:9 | `episodes/06-cold-flu/art/full/winter-street.png` |
| ⬜ | 장면 — 다음 편 예고 (내과 · 외과 간판) | 장면 | 16:9 | `episodes/06-cold-flu/art/full/next-teaser.png` |

✅ 있음 · ⬜ 만들어야 함 · ➕ 없어도 됨(있으면 더 움직인다)

## 2. 음성

작업 목록: [`jobs/voice.json`](jobs/voice.json). 사람이 붙여넣기 좋은 판은 `video/out/ep06/voice-studio.html`.

- 도구: Google AI Studio · Gemini Flash TTS (여러 화자). 목소리는 고정이다 (`video/VOICE.md`): narr/dad/docu = **Algenib**, 간호사 선생님 = **Zephyr**, kid = **Leda**, 엄마 = **Kore**.
- **컷 하나에 파일 하나.** 그 컷의 대사를 `lines` 순서대로 한 번에 읽힌다.
- 컷마다 `speakers` 에 적힌 대로 목소리를 고른다. 한 번에 두 목소리까지라, **할머니가 나오는 컷은 Speaker 1 이나 2 자리에 할머니 목소리가 들어간다** (컷마다 다르니 꼭 `speakers` 를 본다).
- `lines[].text` 를 **그대로** 읽힌다 (숫자는 이미 한글로 풀어 놓았다). `lines[].style` 은 그 줄의 말투 지시다.
- **줄과 줄 사이에 1초쯤 쉰다.** 줄 안에서는 길게 쉬지 않는다. 자르는 도구가 쉬는 곳을 찾아 줄마다 나눈다.
- 화자 이름("Speaker 1")을 소리 내어 읽지 않게 한다.
- 형식: WAV, 24 kHz, 16-bit, mono. One file per cut, all lines of the cut in order.
- 저장: `save` 경로 (예: `video/voice-studio/ep06/c00.wav`).
- Gemini API 키가 저장소 루트 `.env` 에 있으면 명령 한 줄로도 된다: `cd video && npm run voice -- ep06 gen` (대사가 바뀐 컷만 만든다).

| | 컷 | 줄 | 목소리 | 저장 |
|---|---|---|---|---|
| ⬜ | c00 | 5 | Speaker 1 = Algenib · Speaker 2 = Zephyr | `video/voice-studio/ep06/c00.wav` |
| ⬜ | c01 | 5 | Speaker 1 = Algenib · Speaker 2 = Leda | `video/voice-studio/ep06/c01.wav` |
| ⬜ | c02 | 5 | Speaker 1 = Algenib · Speaker 2 = Zephyr | `video/voice-studio/ep06/c02.wav` |
| ⬜ | c02b | 2 | Speaker 2 = Leda · Speaker 1 = Zephyr | `video/voice-studio/ep06/c02b.wav` |
| ⬜ | c02c | 2 | Speaker 1 = Algenib · Speaker 2 = Leda | `video/voice-studio/ep06/c02c.wav` |
| ⬜ | c02d | 2 | Speaker 1 = Algenib · Speaker 2 = Kore | `video/voice-studio/ep06/c02d.wav` |
| ⬜ | c02e | 2 | Speaker 1 = Algenib · Speaker 2 = Zephyr | `video/voice-studio/ep06/c02e.wav` |
| ⬜ | c02f | 2 | Speaker 2 = Leda · Speaker 1 = Zephyr | `video/voice-studio/ep06/c02f.wav` |
| ⬜ | c03 | 6 | Speaker 1 = Algenib | `video/voice-studio/ep06/c03.wav` |
| ⬜ | c03b | 2 | Speaker 1 = Algenib · Speaker 2 = Zephyr | `video/voice-studio/ep06/c03b.wav` |
| ⬜ | c04 | 7 | Speaker 1 = Algenib | `video/voice-studio/ep06/c04.wav` |
| ⬜ | c05 | 5 | Speaker 1 = Algenib | `video/voice-studio/ep06/c05.wav` |
| ⬜ | c06 | 3 | Speaker 1 = Algenib | `video/voice-studio/ep06/c06.wav` |
| ⬜ | c07 | 3 | Speaker 1 = Algenib | `video/voice-studio/ep06/c07.wav` |
| ⬜ | c08 | 5 | Speaker 1 = Algenib | `video/voice-studio/ep06/c08.wav` |
| ⬜ | c09 | 6 | Speaker 1 = Algenib · Speaker 2 = Kore | `video/voice-studio/ep06/c09.wav` |
| ⬜ | c10 | 5 | Speaker 1 = Algenib | `video/voice-studio/ep06/c10.wav` |
| ⬜ | c11 | 5 | Speaker 1 = Algenib | `video/voice-studio/ep06/c11.wav` |
| ⬜ | c12 | 9 | Speaker 1 = Algenib | `video/voice-studio/ep06/c12.wav` |
| ⬜ | c12b | 2 | Speaker 1 = Algenib · Speaker 2 = Zephyr | `video/voice-studio/ep06/c12b.wav` |
| ⬜ | c12c | 2 | Speaker 2 = Leda · Speaker 1 = Kore | `video/voice-studio/ep06/c12c.wav` |
| ⬜ | c12d | 1 | Speaker 1 = Algenib | `video/voice-studio/ep06/c12d.wav` |
| ⬜ | c13 | 1 | Speaker 1 = Algenib | `video/voice-studio/ep06/c13.wav` |
| ⬜ | c14 | 4 | Speaker 1 = Algenib · Speaker 2 = Leda | `video/voice-studio/ep06/c14.wav` |

## 3. 조립

```bash
cd video
npm run art -- ep06             # 그림: 배경 제거 · 자르기 · 빠진 그림 목록
npm run voice -- ep06 split     # 음성: 컷 파일을 대사 줄마다 자르고 타이밍을 맞춘다
npm run make -- ep06            # 영상 + 한글 · 영어 자막 → video/out/ep06/
```

- `npm run art` 가 "⚠" 를 내면 그 그림을 다시 만든다 (배경을 못 지움, 가장자리에 닿음 등).
- `npm run voice … split` 이 "⚠ 줄 경계가 애매하다"를 내면 그 컷의 줄 길이가 대사와 맞는지 본다. 안 맞으면 그 컷 음성을 다시 만든다.
- 일부만 넣고 돌려도 된다. 없는 그림은 점선 상자로, 없는 음성은 임시 음성으로 나온다.

## 하지 말 것

- `video/src/ep06/script.json` 의 대사, `video/src/voice.json` 의 목소리, 프롬프트의 화풍 문장을 바꾸지 않는다.
- 이미 있는 그림(✅)과 다른 편의 파일을 덮어쓰지 않는다.
- 커밋 · 푸시 · 유튜브 업로드를 하지 않는다.
- 끝나면 만든 파일 목록과, 못 만들었거나 마음에 걸리는 그림 · 컷을 알려 준다.
