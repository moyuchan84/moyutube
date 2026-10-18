# youtube — 저장소 전체 규칙

이 저장소에는 세 프로젝트가 있다: `qna/`(여덟 살의 질문 — 규칙은 [qna/CLAUDE.md](qna/CLAUDE.md)), `shortube/`(쇼츠 자동 제작 — [shortube/SPEC.md](shortube/SPEC.md)), `funtube/`.

## 쇼츠(shortube · 숫자로 보는 요즘) 작업 전에 반드시

- 주제 조사 · 영상 제작 · 음악 · 업로드 · 채널 설정 등 shortube 관련 일을 시작하기 전에 **[shortube/CLAUDE.md](shortube/CLAUDE.md) 와 [shortube/COMPLIANCE_GUIDE.md](shortube/COMPLIANCE_GUIDE.md) 를 먼저 읽고 따른다.**
- 특히 잊지 말 것: 요청 전제부터 사실 확인 · 숫자는 사실 카드에 있는 것만 · 주식/의료/미성년·인물 주제의 금지 사항 · 사진·로고·음원 없음 · 배경음악은 코드 합성 · 업로드 기본 비공개 · 저장 후 실제 공개 상태 재확인 · 같은 틀 반복 업로드 주의.

## API 키 — 저장소 루트 `.env` 하나만 쓴다

- Gemini 키는 **`D:\youtube\.env`** 에 있다: `GEMINI_API_KEY` (기본), `GEMINI_API_KEY2` (첫 키가 한도에 걸리면 번갈아 쓰는 예비).
- 그림 생성 · 음성(TTS) 생성은 프로젝트와 상관없이 이 파일의 키를 쓴다. 프로젝트 폴더마다 `.env` 를 새로 만들거나 키를 복사하지 않는다.
- 코드는 **환경변수 → 저장소 루트 `.env` → 프로젝트 `.env`** 순서로 찾는다:

| 프로젝트 | 어디서 읽나 | 쓰는 명령 |
|---|---|---|
| qna | `qna/video/scripts/env.mjs` 의 `envValue()` | 그림 `npm run artgen -- epNN`, 음성 `npm run voice -- epNN gen` (`qna/video` 에서) |
| shortube | `shortube/src/shortube/config.py` 의 `load_config()` (루트 `.env` → `shortube/.env`) | 음성 · 그림 단계 (TTS_GUIDE.md) |
| funtube | `funtube/scripts/tts.mjs` | `node scripts/tts.mjs` (`funtube` 에서) |

- 새 스크립트에서 키가 필요하면 위와 같은 순서로 읽게 만든다. 키 값은 코드 · 로그 · 문서 · 커밋에 절대 쓰지 않는다 (`.env` 는 `.gitignore` 에 들어 있다).
- **그림 · 음성 생성은 돈이 든다.** 사용자가 "API 로 만들어 줘"라고 할 때만 실행한다. 점검만 할 때는 호출하지 않는 모드를 쓴다 (`artgen.mjs epNN --list`, `voice.mjs epNN jobs` / `studio`).

## 저장소

- GitHub: `moyuchan84/moyutube`. 작업은 브랜치에서 하고 PR 로 main 에 합친다.
- GitHub Pages 는 main 의 루트를 내보낸다. 루트 `index.html` 은 세 채널(`qna/` · `shortube/` · `funtube/`)로 갈라지는 채널 모음 페이지이고, 채널마다 `index.html` 이 있다. 그림 · 음성 스타일은 `docs/ai-style-guide.html`.
- 렌더 결과물(`out/`), `node_modules/`, `.venv/`, 자동 생성 그림(`qna/video/public/art/`)은 올리지 않는다.
