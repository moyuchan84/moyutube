# 여덟 살의 질문 (qna) — 폴더와 작업 절차

이 폴더는 가족 유튜브 채널 「여덟 살의 질문」의 전부다: GitHub Pages 사이트(기획 문서) + 영상 자동 제작 코드.
**새 편을 만들 때도, 고칠 때도 아래 폴더 규칙과 순서를 그대로 따른다.** 새 폴더 · 새 파일 이름을 즉석에서 만들지 않는다.

## 폴더 — 무엇이 어디에 있나

```
qna/
├─ CLAUDE.md                  ← 이 문서 (작업 규칙)
├─ index.html                 ← 사이트 홈 (편 목록 카드)
├─ plan/ guide/ production/ auto/   ← 사이트 페이지 (채널 기획 · 튜토리얼 · 제작 노트 · 자동 제작 매뉴얼)
├─ skill/                     ← eight-year-olds-question 스킬 패키지
├─ art/                       ← 모든 편이 같이 쓰는 그림 원본
│  ├─ anchor/style-cutin.png  ← 화풍 앵커 (모든 Gemini 요청에 ①로 첨부)
│  ├─ common/{dad,kid,mom,cutin,bg}/ ← 아빠 · 아이 · 엄마 표정, 공통 배경
│  └─ channel/                ← 채널 프로필 · 배너
├─ episodes/NN-영문슬러그/      ← 편 하나 = 폴더 하나 (아래 "편 폴더")
└─ video/                     ← Remotion 영상 코드 (README.md · VOICE.md)
   ├─ src/epNN/               ← 그 편의 대본 · 그림 목록 (사람이 고치는 곳)
   ├─ src/voice.json · art-common.json · Root.tsx
   ├─ scripts/                ← npm run 으로 부르는 도구들
   ├─ public/                 ← 자동 생성 (처리된 그림 · 음성 · 효과음) — 손으로 고치지 않는다
   ├─ voice-studio/epNN/      ← AI Studio 에서 받은 컷별 음성 원본
   └─ out/epNN/               ← 완성 영상 · 자막 · 컷 이미지 · 썸네일 (git 에 안 올림)
```

### 편 폴더 `episodes/NN-slug/` — 항상 이 이름들만

| 파일 | 누가 만드나 | 내용 |
|---|---|---|
| `<slug>.md` | 스킬 (사람 · Claude) | 기획서 원본: 구성 · 자료조사 · 콘티표 · 그림 목록 · 대본 · BGM · 썸네일/제목 · 한 문장 |
| `index.html` | 스킬 | 같은 기획서를 사이트용으로 (3편 `index.html` 의 head/CSS 를 그대로 쓴다) |
| `storyboard.html` | `npm run storyboard -- epNN` | 콘티 시트 (컷별 배경 · 인물 위치 · 움직임 · 대사). 그림이 생기면 다시 돌린다 |
| `GEMINI_PROMPTS.md` | `npm run prompts -- epNN` | 그림 프롬프트 문서 |
| `ANTIGRAVITY.md` | `npm run handoff -- epNN` | 그림 · 음성 작업을 다른 에이전트에 넘길 때만 |
| `art/<id>.png` | 사람 (Gemini 결과 저장) | 그 편 그림 원본. id 는 `art.json` 의 id 그대로 (`bg/…`, `full/…`, `<인물>/…`, `cutin/…`, `prop/…`) |
| `jobs/` | 도구 | 자동 생성 (images.json · voice.json) |
| `thumb.svg` (또는 `thumb.jpg`) | 스킬 | 사이트 홈 카드 그림 |
| `_old/` | 사람 · Claude | 바뀌기 전 구성 · 버린 그림. 지우지 말고 여기로 옮긴다 (`_old/<slug>-v1-<한 단어>.md` 처럼 이름 뒤에 버전) |

- 편 번호 NN 은 **영상으로 나가는 순서**다. `episodes/NN-…` 와 `video/src/epNN` 의 번호가 항상 같아야 한다.
- 위 표에 없는 파일을 편 폴더에 만들지 않는다 (임시 파일 · 생성 스크립트는 scratchpad 에).

## 작업 절차 — 한 편을 만드는 순서

| 단계 | 할 일 | 결과물 | 비용 |
|---|---|---|---|
| 1. 기획 | 스킬 `eight-year-olds-question` 으로 주제 → 구성 · 자료조사 · 대본 | `episodes/NN-slug/<slug>.md`, `index.html` | 무료 |
| 2. 대본 · 그림 목록 | 기획서 대본을 영상용으로 옮긴다 (3편이 기준 예시) | `video/src/epNN/script.json`, `art.json` | 무료 |
| 3. 콘티 확인 | `npm run storyboard -- epNN` → `storyboard.html` 을 열어 컷 구성 · 길이 확인. 여기서 대본을 고친다 | `storyboard.html` | 무료 |
| 4. 그림 프롬프트 | `npm run prompts -- epNN` | `GEMINI_PROMPTS.md` | 무료 |
| 5. 그림 | Gemini 에서 손으로 뽑아 `art/<id>.png` 에 저장, 또는 `npm run artgen -- epNN` (키는 저장소 루트 `.env`, ../CLAUDE.md) | `episodes/NN-slug/art/` | **artgen 은 유료 — 사용자에게 물어보고** |
| 6. 그림 처리 | `npm run art -- epNN` (초록 배경 제거 · 크기 맞춤) → 다시 `npm run storyboard -- epNN` | `video/public/art/epNN/` | 무료 |
| 7. 음성 | `npm run voice -- epNN studio` (손으로) 또는 `npm run voice -- epNN gen` | `video/voice-studio/epNN/`, `src/epNN/timing.json` | **gen 은 유료 — 물어보고** |
| 8. 등록 · 미리보기 | `src/Root.tsx` 의 `EPISODES` 에 한 줄 추가 (timing.json 이 생긴 뒤) → `npm run studio` | | 무료 |
| 9. 완성 | `npm run make -- epNN` → 썸네일 `Ep NN-ThumbD` | `video/out/epNN/` | 무료 |
| 10. 사이트 · 저장 | 홈 `index.html` 카드 갱신, 브랜치에서 커밋 → PR | | |
| 11. 쇼츠 | 스킬 `qna-shorts` (`.claude/skills/qna-shorts/SKILL.md`): 편집 계획 `video/src/shorts/epNN.json` → `npm run short -- epNN --check` → `npm run short -- epNN` → Chrome 으로 **비공개** 업로드 | `video/out/shorts/epNN-short.mp4` | 무료 (롱폼 음성 · 그림 재사용) |

### 고정 규칙
- 시나리오는 집 밖에서, 제삼의 인물과. 한창 벌어지는 장면부터. 6번 박자(아이 눈높이)에는 농담 없음. 기준 예시는 3편.
- 목소리: 아빠 · 나레이션 = Algenib, 아이 = Leda, 엄마 = Kore, 손님은 `src/voice.json` 의 Guest. 한 컷에 목소리는 둘까지 (`npm run voice -- epNN jobs` 가 검사한다).
- 몸 · 성 관련 소재는 몸을 그리지 않는다 (4편: 닫힌 문 · 거품 모자이크 · 단면도). 민감한 단어는 대사에만, 썸네일 · 제목 · 화면 글자에는 쓰지 않는다.
- 분량은 8분 안팎. `storyboard.html` 과 기획서 콘티표의 시간으로 확인한다.
- 대본을 고치면 `.md` 기획서의 대본도 같이 고친다 (영상 대본이 원본이 된 뒤에는 `script.json` 기준).
