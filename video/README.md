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
```

## 바꿔 끼우기

- **대사·컷 구성**: `src/ep01/script.json` — 수정 후 `tts`를 다시 돌리면 타이밍이 자동으로 맞춰집니다.
- **그림**: `public/ep01/cuts/panelNN.png`를 직접 그린 그림으로 덮어쓰면 됩니다 (가로 620:434 비율 권장).
- **내 목소리**: `public/ep01/voice/<컷id>-<번호>.wav`를 녹음 파일로 교체하고, `src/ep01/timing.json`의 길이(초)를 맞춰 주세요.
- **배경음악**: 저작권 때문에 넣지 않았습니다. 유튜브 오디오 보관함 곡을 편집 단계에서 −20dB 정도로 깔아 주세요.

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
| `src/epNN/script.json` 의 `scene` | 컷의 배경 `bg`, 인물 `actors`(위치 `x`, 등장 `enter`), 소품 `props` |
| 대사의 `pose` · `focus` · `cutin` · `fx` · `pop` | 그 대사에 맞춘 연출: 표정 바꾸기, 카메라 당기기, 큰 얼굴 컷인, 흔들림(`shake`)·집중선(`lines`)·번쩍(`flash`), 큰 글자 |

말하는 인물은 자동으로 까딱거리고, 표정이 바뀌면 젤리처럼 튄다 (`src/Scene.tsx`).
그림 종류(`kind`): `char` 전신 · `cutin` 가슴 위 · `prop` 소품 (셋 다 초록 배경으로 뽑아 투명 처리), `bg` 사람 없는 배경 · `full` 한 장짜리 완성 장면 (16:9).
