# 저장소 규칙 — 다섯 채널이 같은 모양으로

이 저장소의 모든 프로젝트(`qna` · `shortube` · `funtube` · `lab` · `fairy`)는 **같은 뼈대**를 쓴다.
새 편을 만들 때 폴더 · 파일 이름을 즉석에서 정하지 않고, `npm run new` 로 템플릿에서 시작한다.

## 1. 프로젝트 뼈대

```
<project>/
  CLAUDE.md  README.md     ← 그 채널의 규칙 · 절차 (Claude 는 작업 전에 읽는다)
  content/<unit>/          ← 편 하나 = 폴더 하나 (데이터 · 원본만, 엔진 코드 없음)
  content/_common/         ← 여러 편이 같이 쓰는 그림 · 캐릭터 · 브랜드 (밑줄 폴더는 편이 아니다)
  video/                   ← 영상 엔진 (Remotion). lab 은 Motion Canvas 라 프로젝트 루트가 엔진
  scripts/                 ← 프로젝트 명령 (편 코드를 인자로 받는다 — 기본값으로 특정 편을 박지 않는다)
  prompts/                 ← 다시 쓰는 프롬프트 · 화풍 · 음성 규칙
  .claude/skills/          ← 그 채널 전용 스킬
```

공용: 루트 `shared/` (공용 코드 `@moyu/shared`), `templates/<project>/<format>/` (새 편 뼈대), `docs/` (이 문서 · 가이드 페이지).

## 2. 콘텐츠 단위 `content/<dir>/`

```
unit.json   메타 (아래 스키마)
plan.md     기획 · 브리프 · 사실 카드 · 대본 초안
script/     엔진이 읽는 데이터 (script.json · art.json · motion.json · timeline.json · story.json · en.json …)
prompts/    생성된 프롬프트 문서 · 작업 목록 (GEMINI_PROMPTS.md, jobs/*.json, review.json)
art/        그림 원본 (Gemini PNG 등)
voice/      음성 원본 · 최종 wav · timing (raw/ · studio/ 하위 폴더 가능)
music/      배경음악 · 효과음 · 합성 파라미터 · 큐
upload/     upload.md(제목 · 설명 · 태그 · 업로드 기록) · *.srt · chapters · thumbnail
source/     원작 자료 (fairy 원작 PDF 등)
_old/       버린 것 · 이전 판 (지우지 말고 여기로)
```

위 이름 밖의 하위 폴더를 만들지 않는다 (`npm run verify` 가 잡는다). 임시 파일 · 일회용 스크립트는 scratchpad 에.

### unit.json

```json
{
  "code": "ep11",                 // 엔진 키. 영문 · 숫자, 첫 글자 소문자. 저장소 안에서 이 프로젝트 기준 유일
  "slug": "kimchi-fridge",        // (선택) 폴더 이름 뒤에 붙는 영문 소문자-하이픈
  "title": "김치냉장고는 왜 따로 있어요?",
  "series": "naemonambul",        // (선택) 같은 채널 안 시리즈
  "variantOf": "ep08",            // (선택) 리메이크 · 다른 판이면 원편 code
  "format": "modapman",           // 템플릿 이름 (엔진이 어떤 틀로 그릴지)
  "status": "idea",               // idea → script → art → voice → edit → uploaded (· archived)
  "created": "2026-10-25",
  "published": "2026-10-27",      // (선택)
  "youtube": [{ "id": "9ErFMjnUQqE", "kind": "long", "lang": "ko" }, { "id": "XEgVdUw5J5E", "kind": "short" }],
  "tags": [],
  "notes": ""
}
```

### 편 코드 · 폴더 이름

| 프로젝트 | code | 폴더 | 예 |
|---|---|---|---|
| qna | `epNN` (모답맨) · `nmNN` (내모남불) · `epNNf` (리메이크) | `<code>-<slug>` | `ep10-hope-ufo-alien`, `nm01-car` |
| shortube | 주제 영단어 | `<code>` | `bigarch` |
| funtube | 기존 id | `<code>` | `drive1` |
| lab | camelCase (Motion Canvas 프로젝트 이름과 같아야 함) | `<code>` | `blindSpot` |
| fairy | `bNN` | `<code>-<slug>` | `b01-real-hero` |

## 3. 원본은 git, 다시 만들 수 있는 것은 제외

| git 에 올린다 | 올리지 않는다 (`.gitignore`) |
|---|---|
| 기획 · 브리프 · 대본 · 업로드 기록 · 자막 | 렌더한 mp4 (`out/`, `output/videos/`, `lab/output/`) |
| 그림 원본 PNG · 음성 원본 · 최종 음성 wav · 합성한 배경음악 wav | 엔진 `public/` 의 복사본 · webp 변환 · 배속 변환본 · 이어 붙인 전체본 |
| 업로드 장부 (`shortube/content/uploads.csv`) | `node_modules/` · `.venv/` · 원천 데이터 캐시(`shortube/data/`) · `.env` |

## 4. 공용 명령 (저장소 루트에서)

| 명령 | 하는 일 |
|---|---|
| `npm run new -- <project> <code> [--slug s] [--format f] [--title "제목"] [--series s]` | 템플릿으로 새 편 폴더를 만들고 다음 할 일을 알려 준다 |
| `npm run units -- [project]` | 편 목록 · 상태 · 유튜브 ID |
| `npm run verify -- [project]` | 모든 `unit.json` 과 폴더 규칙 검사 |

## 5. 공용 코드 `shared/` — 프로젝트마다 다시 만들지 않는다

| 모듈 | 쓰는 곳 |
|---|---|
| `env.mjs` `envValue()` · `geminiKeys()` (+ 파이썬 `py/moyu_env.py`) | API 키 읽기: 환경변수 → 루트 `.env` → 프로젝트 `.env` |
| `unit.mjs` `listUnits()` · `findUnit()` · `checkUnit()` | 편 찾기 — 폴더 이름을 짐작하지 않는다 |
| `gemini.mjs` `tts()` · `image()` | **유료.** 기본은 연습 모드, `--yes` 를 붙여야 실제로 부른다. TTS 에는 대사 글자만, 그림은 첨부 목록 전부 있어야 보낸다 |
| `wav.mjs` | WAV 읽기 · 쓰기 · 무음 자르기 · 잇기 |
| `srt.mjs` | SRT · 유튜브 챕터 |
| `downloads.mjs` | 크롬에서 받은 파일을 `~/Downloads` 에서 가져오기 |
| `ffmpeg.mjs` | ffmpeg 찾기 (환경변수 → PATH → Remotion 내장) |

## 6. 그림 · 음성 일관성

- 채널마다 **화풍 앵커 + 인물 기준 그림**을 정해 두고, 모든 그림 요청에 첨부한다. 글자 프롬프트만으로 그리지 않는다.
- 모라구(qna)는 [qna/ART_GUIDE.md](../qna/ART_GUIDE.md) — 첨부 목록을 코드가 자동으로 정하고, 뽑은 뒤 기준 그림과 나란히 비교한다. 다른 채널도 같은 방식을 따른다.
- 목소리 배역은 채널마다 한 파일에 고정 (qna `voice.json` 등) — 편마다 바꾸지 않는다.
