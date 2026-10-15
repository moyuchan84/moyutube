# 영상 초안 만들기 (Remotion)

원고(`episodes/*/*.md`)와 스토리보드 이미지로 **가이드용 1차 영상**을 뽑는 폴더입니다.
직접 그린 그림·녹음으로 바꾸기 전에 흐름과 길이를 확인하는 용도입니다.

## 순서

```bash
npm install
npm run tts -- ep01      # 대사별 음성 (Windows 내장 TTS 'Heami') → public/ep01/voice, src/ep01/timing.json
npm run sfx              # 임시 효과음 합성 → public/sfx
npm run studio           # 브라우저에서 미리보기·수정
npm run render -- Ep01 out/ep01/ep01.mp4
npm run srt -- ep01      # 유튜브용 자막 → out/ep01/subtitles.srt
npm run stills -- ep01   # 컷별 1920x1080 PNG → out/ep01/cuts
npx remotion still src/index.ts Ep01-ThumbA out/ep01/thumbnail-A.png   # 썸네일 (A/B/C)
npx remotion still src/index.ts Ep03-ThumbD out/ep03/thumbnail.png     # 얼굴 썸네일. 글자와 가운데 주제 그림(topic)은 src/Root.tsx 의 face
npm run handoff -- ep03    # 그림 · 음성 만들기를 다른 도구(Antigravity 등)에 넘길 지시서 → episodes/03-…/ANTIGRAVITY.md
npm run storyboard -- ep04 # 콘티 시트 (컷별 배경 · 인물 위치 · 움직임 · 대사) → episodes/04-…/storyboard.html. 그림이 생기면 다시 돌린다
npm run artgen -- ep03     # 없는 그림을 Gemini API 로 한 번에 (저장소 루트 .env 의 GEMINI_API_KEY, 돈이 든다. --list 는 목록만)
```

## 바꿔 끼우기

- **대사·컷 구성**: `src/ep01/script.json` — 수정 후 `tts`를 다시 돌리면 타이밍이 자동으로 맞춰집니다.
- **그림**: `public/ep01/cuts/panelNN.png`를 직접 그린 그림으로 덮어쓰면 됩니다 (가로 620:434 비율 권장).
- **내 목소리**: `public/ep01/voice/<컷id>-<번호>.wav`를 녹음 파일로 교체하고, `src/ep01/timing.json`의 길이(초)를 맞춰 주세요.
- **목소리는 항상 같은 음색**: 아빠 · 나레이션 = Algenib, 아이 = Leda. 설정은 `src/voice.json`, 설명은 [VOICE.md](VOICE.md). 저장소 루트 `.env` (D:\youtube\.env) 에 `GEMINI_API_KEY` 가 있으면 `npm run voice -- ep02 gen` (또는 `npm run make -- ep02 --voice`) 한 번으로 생성 · 자르기 · 타이밍까지 끝난다.
- **AI Studio 음성 (손으로)**: `npm run voice -- ep01 studio` → `out/ep01/voice-studio.html` 을 열어 컷마다 복사 → AI Studio에서 생성 → `voice-studio/ep01/<컷id>.wav` 로 저장 → `npm run voice -- ep01 split` (줄마다 자르고 타이밍 갱신). 대사를 고친 뒤 `studio` 를 다시 돌리면 다시 만들 컷만 ⚠ 로 표시된다. `script.json` 맨 위에 `"rawVoice": true` 필요.
- **배경음악**: `script.json` 맨 위의 `"bgm": "cheerful"` 이 `public/bgm/cheerful.wav` 를 대사 밑에 깝니다 (말하는 동안은 목소리보다 약 22dB 작게). 이 곡은 `node scripts/bgm.mjs` 가 코드로 합성한 것이라 저작권 문제가 없습니다. 다른 곡은 `public/bgm/<이름>.wav` 로 넣고 이름을 바꿔 적으세요. 줄을 지우면 배경음악이 빠집니다.
- **배속**: `script.json` 맨 위에 `"speed": 1.2` 를 적으면 그 편 전체가 1.2배로 빨라집니다 (목소리 · 대사 사이 쉼 · 컷 전환 · 자막 타이밍 모두, 음높이는 그대로). 음성을 다시 만들 필요 없이 숫자만 바꿔 `npm run make` 하면 됩니다 (빠른 목소리는 `scripts/speed.mjs` 가 `public/<편>/voice-x<배속>/` 에 미리 만든다. 렌더 중 배속은 소리가 거칠어져서 쓰지 않는다). 줄을 지우면 1배속.
- **영어 자막**: 대사 줄마다 `"en"` 번역을 적어 두면 `npm run srt -- ep01 en` (또는 `make`)이 같은 타이밍으로 `out/ep01/subtitles.en.srt` 를 만듭니다.

## 일러스트 영상 (Gemini 그림 → 움직이는 컷)

스토리보드 대신 Gemini로 뽑은 그림을 레이어(배경 · 인물 · 소품)로 쌓아 움직인다.
그림이 없는 자리는 임시 그림으로 나오므로, 한 장씩 넣어 가며 확인할 수 있다.

```bash
npm run prompts          # 프롬프트 문서 생성 → art/common/GEMINI_PROMPTS.md, episodes/NN-…/GEMINI_PROMPTS.md
# (Gemini에서 그림을 뽑아 문서의 "저장" 경로에 넣는다)
npm run art -- ep01      # 초록 배경 제거·자르기·크기 맞춤 → public/art, src/assets.json. 빠진 그림 목록도 출력
npm run studio           # 미리보기
npm run make -- ep01     # 위 과정 + 음성 + 렌더 + 자막을 한 번에 → out/ep01/ep01.mp4
```

| 파일 | 내용 |
|---|---|
| `src/art-common.json` | 모든 편이 같이 쓰는 그림 (아빠 · 아이 표정, 집 배경). 원본은 `art/common/` |
| `src/epNN/art.json` | 그 편에만 쓰는 그림 목록과 묘사. 원본은 `episodes/NN-…/art/` |
| `src/Root.tsx` 의 `EPISODES` | 새 편을 등록하는 곳 (한 줄 추가) |
| `src/epNN/script.json` 의 `scene` | 컷의 배경 `bg`, 인물 `actors`(위치 `x`, 등장 `enter`), 소품 `props` |
| 대사의 `pose` · `focus` · `cutin` · `fx` · `pop` | 그 대사에 맞춘 연출: 표정 바꾸기, 카메라 당기기, 큰 얼굴 컷인, 흔들림(`shake`)·집중선(`lines`)·번쩍(`flash`), 큰 글자 |
| 움직임 (3편부터) | 배우: `enter:"rise"`(좌판 뒤에서 솟기), `idle`(sway · bounce · shiver), 대사의 `move`(그 자리로 걸어가기) · `act`(jump · shiver · nod). 소품: `front`(배우 앞에 그리기), `motion`(sway · pulse · spin · walk), `to`(화면을 가로질러 가기). 장면: `pan`(배경 밀기). 대사의 `fx:"zoom"` |
| 말하는 그림 `<그림>-b` | 같은 자세에 입만 다른 두 번째 그림. 있으면 그 배우가 말하는 동안 두 장이 번갈아 나와 입이 움직인다 (없어도 된다) |
| 그림 종류 `stage` · `layer` · `talk` | `stage`: 주인공 자리를 비운 무대 장면(주인공은 소품으로 따로 얹어 움직인다). `layer`: 배우를 가리는 앞쪽 물건. `talk`: 말하는 그림 |
| 가족이 아닌 사람 | `art.json` 의 `cast` 에 생김새를 적고, 그림에는 `who` 와 `ref`(기준 그림, 기준 그림 자신은 `null`)를 적는다. 목소리는 `src/voice.json` 의 Guest 항목 (VOICE.md) |

세 칸 정리 화면은 컷에 `"style": "triptych"` 와 `"triptych": [{art, name, label}]` 를, 끝 화면은 `"style": "end"` 와 `"end": {series, title, next}` 를 적는다.
말하는 인물은 자동으로 까딱거리고, 표정이 바뀌면 젤리처럼 튄다 (`src/Scene.tsx`).
그림 종류(`kind`): `char` 전신 · `cutin` 가슴 위 · `prop` 소품 (셋 다 초록 배경으로 뽑아 투명 처리), `bg` 사람 없는 배경 · `full` 한 장짜리 완성 장면 (16:9).
