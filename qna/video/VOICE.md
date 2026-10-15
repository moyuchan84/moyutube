# 목소리 — 모든 편이 같은 음색을 쓴다

1편(2026-10-12)에서 정한 목소리다. **편이 바뀌어도 이 설정을 그대로 쓴다.**
설정값은 `src/voice.json` 한 곳에 있고, 음성 도구(`scripts/voice.mjs`)가 항상 그 파일을 읽는다. 이 문서는 그 설명이다.

## 설정

| | Speaker 1 | Speaker 2 |
|---|---|---|
| 맡는 역할 | 나레이션 · 아빠 대사 · 다큐 톤 (`narr` · `dad` · `docu`) | 아이 대사 (`kid`) |
| 목소리 | **Algenib** (거친 저음) | **Leda** (어린 느낌, 높은 톤) |
| 말투 지시(Style) | 아래 문장 | 1편에서는 넣지 않았다 (목소리 기본값) |

- 도구: Google AI Studio 음성 생성 <https://aistudio.google.com/generate-speech>, **여러 화자** 모드
- 모델: 1편 때 화면에 표시된 이름은 "Gemini 3.8 Flash TTS"
- 받은 파일: 24kHz · 16비트 · 모노 WAV

Speaker 1 말투 지시 (1편에서 아빠 · 나레이션 블록 전부에 넣은 문장 그대로):

```text
A balding Korean dad in his mid-forties: thick, deep, slightly husky ajusshi voice, relaxed and good-humored, telling a story about his kid
```

## 손님 목소리 (편에만 나오는 사람)

가족이 아닌 사람이 말하는 편에서는 목소리를 하나 더 쓴다. `src/voice.json` 의 `"label": "Guest"` 항목이다.

| 누구 | 목소리 | 말투 지시 | 처음 나온 편 |
|---|---|---|---|
| 시장 할머니 (`granny`) | **Gacrux** (나이 든 여성) | `A loud, cheerful Korean market grandmother in her seventies: hearty, quick and teasing in a thick country accent, with a laugh in her voice, warm and never angry` | 3편 (2026-10-13 에 정함, 아직 들어 보고 확정한 것은 아니다) |
| 이발사 할아버지 (`barber`) | **Charon** (낮은 남성, 차분함) | `A Korean barber grandpa in his early seventies who has run a neighborhood barbershop for fifty years: dry, slow, deadpan and gently teasing, a warm low old-man voice with a chuckle in it, proud of his craft and happy to laugh at his own bald head, never stern` | 4편 (2026-10-15 에 정함, 아직 들어 보지 않았다. 아빠 Algenib 와 너무 비슷하면 Sadaltager · Rasalgethi 를 들어 본다) |

- AI Studio 는 한 번에 두 목소리까지다. 그래서 **한 컷에는 목소리가 둘까지만** 나오게 대본을 나눈다 (셋이면 도구가 오류를 낸다).
- 손님이 나오는 컷에서는 손님이 **그 컷에서 비는 자리**(Speaker 1 또는 2)를 쓴다. 예: 아빠 + 할머니 컷은 Speaker 2 = Gacrux, 아이 + 할머니 컷은 Speaker 1 = Gacrux.
- 컷마다 무엇을 골라야 하는지는 `out/epNN/voice-studio.html` 의 카드(갈색 표시)와 `episodes/NN-…/jobs/voice.json` 의 `speakers` 에 적혀 있다.

## 고른 과정 (다시 고를 때 참고)

| 화자 | 써 본 순서 | 결과 |
|---|---|---|
| 아빠 | Fola(기본값, 중간 톤) → Varo(낮은 톤, 느긋함) → **Algenib** + 말투 지시 | "아빠는 좀 더 굵게" 요청으로 두 번 바꿨고 Algenib 에서 확정 |
| 아이 | Rami(기본값, 낮은 톤) → **Leda** | "아이는 좀 더 어린 목소리" 요청으로 바꿔 확정 |

안 써 본 후보: 아빠를 더 굵게 Ludo · Bodi, 아이를 다르게 Zephyr · Laomedeia · Achernar.

## 쓰는 법

### 1. 한 번에 (Gemini API)

```bash
# 처음 한 번: https://aistudio.google.com/apikey 에서 키를 만들어 저장소 루트 .env (D:\youtube\.env) 에 적는다
#   GEMINI_API_KEY=...
npm run voice -- ep02 gen        # 대사가 바뀐 컷만 생성 → 줄마다 자르기 → 타이밍 갱신
npm run voice -- ep02 gen --all  # 전부 다시
```

- 컷 하나를 한 번에 받아 `voice-studio/epNN/<컷id>.wav` 에 두고, 줄 사이 쉼을 찾아 자른다. 쉼을 못 찾은 컷은 줄마다 따로 받는다.
- 모델은 그 키로 쓸 수 있는 Flash TTS 중 가장 새것을 고른다. 고정하려면 `src/voice.json` 의 `"model"` 에 모델 id 를 적는다.
- 전부 AI 음성이 되면 `script.json` 에 `"rawVoice": true` 를 넣어 준다 (렌더할 때 음높이 변조를 끈다).
- API 에는 블록별 말투 칸이 없어서, 말투 지시는 대본 앞머리에 문장으로 들어간다. Speaker 2 에는 "여덟 살 아이, 밝고 높은 목소리" 문장이 붙는다 (`src/voice.json` 의 `style`).

### 2. 다른 도구에 맡길 때 (Antigravity 등)

```bash
npm run handoff -- ep03          # episodes/03-…/ANTIGRAVITY.md + jobs/images.json + jobs/voice.json
```

지시서(`ANTIGRAVITY.md`)를 읽히면 된다. 컷별 목소리 · 대사 · 저장 경로가 `jobs/voice.json` 에 들어 있다.

### 3. 손으로 (AI Studio 화면)

```bash
npm run voice -- ep02 studio     # out/ep02/voice-studio.html — 컷마다 복사 버튼
# AI Studio 에서 Speaker 1 = Algenib, Speaker 2 = Leda 로 두고 생성 → voice-studio/ep02/<컷id>.wav 로 저장
npm run voice -- ep02 split      # 줄마다 자르고 타이밍 갱신
```

화면이 블록 방식이면 아빠 · 나레이션 블록의 Style 칸에 위 말투 지시를 넣는다.

## 받은 파일에 대해

AI Studio 에서 받은 WAV 는 안에 WAV 헤더가 한 번 더 들어 있고, 끝에 "AI 생성" 표시 데이터(C2PA)가 붙어 있을 수 있다 (2편 파일부터 그랬다).
그걸 그대로 소리로 읽으면 컷의 첫머리와 마지막 대사 끝에서 "칙" 하는 잡음이 난다. `scripts/voice.mjs` 가 읽을 때 걸러 내니 파일을 손댈 필요는 없다.
다른 편집기에 원본을 직접 넣을 때는 이 점을 조심한다.

## 바꾸지 말 것

- 목소리 이름(Algenib · Leda)과 Speaker 1 말투 지시. 바꾸면 이전 편과 음색이 달라진다.
- 꼭 바꿔야 하면 `src/voice.json` 을 고치고, 이 문서의 표와 날짜도 같이 고친다.
