# 여덟 살의 질문 (qna) — 모답맨 · 폴더와 작업 절차

이 폴더는 가족 유튜브 채널 「여덟 살의 질문」의 전부다: GitHub Pages 사이트(기획 문서) + 영상 자동 제작 코드.
**새 편을 만들 때도, 고칠 때도 아래 폴더 규칙과 순서를 그대로 따른다.** 새 폴더 · 새 파일 이름을 즉석에서 만들지 않는다.

## 포맷 — 모답맨 (2026-10-23 확정)

**새 편은 전부 「모답맨」 포맷으로 만든다.** 모답맨 = 모 씨네 아빠 + 오답맨. 아이의 질문에 아빠가 자신만만하게 틀리고,
가족 · 주변 인물의 오답이 카운터로 쌓이다가, 정답 담당 제삼의 인물이 라운드제로 바로잡는 **3분짜리 병맛 오답 쇼**.
2~3초마다 화면이 바뀌는 모션 편집(애프터 이펙트 느낌). 내용의 본질(정확한 사실)은 그대로 지킨다.

- **채널 정체성(모 씨네) · 포맷을 정한 이유 · 지금 상태 · 이어서 하는 법은 [MODAPMAN.md](MODAPMAN.md)** — 새 컴퓨터 · 새 대화에서는 이것부터 읽는다.
- 기획 · 대본 · 샷 계획의 규칙은 스킬 **`modapman`**(`.claude/skills/modapman/SKILL.md`)에 있다. 새 편은 이 스킬을 먼저 읽는다.
  (claude.ai 용 패키지는 `skill/modapman.skill` — 스킬을 고치면 이 폴더를 다시 압축한다)
- **기준 예시는 8편 모답맨판**: `video/src/ep08f/script.json`(대본) · `video/src/motion/ep08f.json`(샷 계획) · `video/out/motion/ep08f-modapman.mp4`.
- 1~8편 롱폼(아빠의 회상 · 8분 · 7박자, 스킬 `eight-year-olds-question` · `skill/eight-year-olds-question.skill`)은 **이전 포맷**이다. 새 편에 쓰지 않는다.

## 폴더 — 무엇이 어디에 있나

```
qna/
├─ CLAUDE.md                  ← 이 문서 (작업 규칙)
├─ index.html                 ← 사이트 홈 (편 목록 카드)
├─ plan/ guide/ production/ auto/   ← 사이트 페이지 (채널 기획 · 튜토리얼 · 제작 노트 · 자동 제작 매뉴얼)
├─ skill/                     ← 스킬 패키지 (modapman.skill = 지금 포맷, eight-year-olds-question.skill = 이전 포맷)
├─ .claude/skills/            ← modapman (편 만들기) · qna-shorts (쇼츠)
├─ art/                       ← 모든 편이 같이 쓰는 그림 원본
│  ├─ anchor/style-cutin.png  ← 화풍 앵커 (모든 Gemini 요청에 ①로 첨부)
│  ├─ common/{dad,kid,mom,cutin,bg}/ ← 아빠 · 아이 · 엄마 표정, 공통 배경
│  └─ channel/                ← 채널 프로필 · 배너
├─ episodes/NN-영문슬러그/      ← 편 하나 = 폴더 하나 (아래 "편 폴더")
└─ video/                     ← Remotion 영상 코드 (README.md · VOICE.md)
   ├─ src/epNN/               ← 그 편의 대본(script.json) · 그림 목록(art.json) · timing.json (사람이 고치는 곳)
   ├─ src/motion/             ← 모답맨 엔진 Motion.tsx · 썸네일 Thumb.tsx · 편마다 샷 계획 <epNN>.json
   ├─ src/voice.json · art-common.json · Root.tsx (MOTIONS 에 편 등록)
   ├─ scripts/                ← npm run 으로 부르는 도구들
   ├─ public/                 ← 자동 생성 (처리된 그림 · 음성 · 효과음) — 손으로 고치지 않는다
   ├─ voice-studio/epNN/      ← AI Studio 에서 받은 컷별 음성 원본 (이전 포맷)
   └─ out/                    ← 결과물 (git 에 안 올림). 모답맨은 out/motion/: mp4 · 썸네일 · 자막 · 챕터 · 업로드 자료
```

- 8편은 롱폼(`src/ep08`)이 먼저 있어서 모답맨판 대본 · 음성만 `src/ep08f` · `public/ep08f` 를 쓴다(그림은 `ep08` 공유). **9편부터는 그냥 `epNN` 하나**다.

### 편 폴더 `episodes/NN-slug/` — 항상 이 이름들만

| 파일 | 누가 만드나 | 내용 |
|---|---|---|
| `<slug>.md` | 스킬 `modapman` | 기획서 원본: 자료조사 · 오답 후보 · 대본(한·영) · 그림 목록 · 제목/키워드 조사 · 한 문장 |
| `index.html` | 스킬 | 같은 기획서를 사이트용으로 (3편 `index.html` 의 head/CSS 를 그대로 쓴다) |
| `GEMINI_PROMPTS.md` | `npm run prompts -- epNN` | 그림 프롬프트 문서 |
| `art/<id>.png` | 사람 · 크롬 Gemini | 그 편 그림 원본. id 는 `art.json` 의 id 그대로 (`bg/…`, `full/…`, `<인물>/…`, `cutin/…`, `prop/…`) |
| `jobs/` | 도구 | 자동 생성 (images.json · voice.json) |
| `thumb.svg` (또는 `thumb.jpg`) | 스킬 | 사이트 홈 카드 그림 |
| `storyboard.html` · `ANTIGRAVITY.md` | 이전 포맷 도구 | 1~8편에만 있다. 모답맨은 샷 계획 + 스틸 확인으로 대신한다 |
| `_old/` | 사람 · Claude | 바뀌기 전 구성 · 버린 그림. 지우지 말고 여기로 옮긴다 (`_old/<slug>-v1-<한 단어>.md` 처럼 이름 뒤에 버전) |

- 편 번호 NN 은 **영상으로 나가는 순서**다. `episodes/NN-…` 와 `video/src/epNN` 의 번호가 항상 같아야 한다.
- 위 표에 없는 파일을 편 폴더에 만들지 않는다 (임시 파일 · 생성 스크립트는 scratchpad 에).

## 작업 절차 — 모답맨 한 편 (명령은 `video` 에서)

| 단계 | 할 일 | 결과물 | 비용 |
|---|---|---|---|
| 1. 기획 | 스킬 `modapman`: 자료조사 · 오답 후보 3~4개 · 대본(한 줄 15~20자, `en` 영어 자막, 숫자는 `tts`) | `episodes/NN-slug/<slug>.md`, `index.html` | 무료 |
| 2. 대본 · 그림 목록 | `src/epNN/script.json` (`"speed": 1.2`, `"rawVoice": true`, 컷마다 목소리 둘까지) · `art.json` | | 무료 |
| 3. 그림 | **[ART_GUIDE.md](ART_GUIDE.md) 순서 그대로**: `npm run prompts -- epNN` (⚠️ 0개 확인) → `npm run artrefs -- epNN` (첨부 사본) → 크롬 Gemini 로 첨부 전부 붙여 뽑아 `art/<id>.png`, 또는 `npm run artgen -- epNN` (키는 저장소 루트 `.env`) → `npm run artreview -- epNN` (기준 그림과 비교) → `npm run art -- epNN` | `video/public/art/epNN/` | **artgen 은 유료 — 물어보고** |
| 4. 음성 | 크롬 AI Studio 에서 **줄 단위**로 생성(절차 · 함정은 메모리 qna-chrome-gen) 또는 `npm run voice -- epNN gen` → `public/epNN/voice/<컷>-<줄>.wav` | | **gen 은 유료 — 물어보고** |
| 5. 음성 다듬기 | `npm run trim-voice -- epNN` (앞뒤 무음 자르기) → `node scripts/voice.mjs epNN` (timing.json) → `node scripts/speed.mjs epNN` (1.2배속) | `src/epNN/timing.json` | 무료 |
| 6. 샷 계획 | `src/motion/epNN.json` (스킬의 "샷 계획" · 8편 `ep08f.json` 참고) → `src/Root.tsx` 의 `MOTIONS` 에 한 줄 | | 무료 |
| 7. 확인 · 렌더 | 스틸 몇 장으로 화면 확인 → `npx remotion render src/index.ts <id> out/motion/<epNN>-modapman.mp4` (출력은 파일로 돌려 받는다 — 파이프에 물리면 `write EOF` 로 죽는다) → `npx remotion still src/index.ts <id>-Thumb out/motion/<epNN>-thumb.png` | `out/motion/` | 무료 |
| 8. 자막 · 챕터 | `npm run motion-srt -- epNN` | `out/motion/<id>.ko.srt` · `.en.srt` · `.chapters.txt` | 무료 |
| 9. 제목 · 키워드 | `npm run keywords -- "검색어" …` (YouTube API, 루트 `.env` 의 `YOUTUBE_API_KEY`) → 지금 뜨거운 말을 제목 앞에, 끝에 `\| 모답맨` → `out/motion/<id>.upload.md` | | 무료 (할당량) |
| 10. 업로드 | 크롬 Studio, 모라구(UCCIm8f5JE4b4PmSrPIJd7zQ): 제목 · 설명 · 썸네일 · 재생목록 "모(오)답맨 (여덟 살 아들의 호기심)" · 아동용 아니요 · AI 사용 아니요(만화 · 실존 인물 아님) · 태그 · 교육 · 한국어 자막 → 언어 탭에서 영어 제목/설명/자막 → **비공개** 저장 → 실제 상태 다시 읽기 | `upload.md` 끝에 업로드 기록 | |
| 11. 사이트 · 저장 | 홈 `index.html` 카드 갱신, 브랜치에서 커밋 → PR | | |
| 12. 쇼츠 | 스킬 `qna-shorts` (이전 포맷 기준 — 모답맨 본편에서 자를 때도 비공개 업로드 규칙은 같다) | | 무료 |

### 고정 규칙
- **그림 규칙 전체는 [ART_GUIDE.md](ART_GUIDE.md)** — 화풍, 기준 그림 지도, 첨부 규칙(코드 `attachPlan` 이 자동으로 정함), art.json 쓰는 법, 뽑는 순서, 비교 확인. 아래는 그 규칙이 생긴 사연이다.
- **그림은 항상 기준 그림을 첨부해서 뽑는다** (2026-10-24 사용자 지시). 크롬 Gemini 든 artgen 이든 `GEMINI_PROMPTS.md` 블록의 **첨부 ①(화풍 앵커 `art/anchor/style-cutin.png`) · ②(그 인물의 기준 그림)** 을 빼지 않는다. 가족(아빠 · 아이 · 엄마)은 `art/common/<인물>/normal.png`, 가슴 위 컷인이면 같은 인물의 기존 컷인(예: `common/cutin/dad-shock.png`)도 ③으로 붙인다. 프롬프트 글자만으로 그리면 얼굴 · 화풍이 달라진다 (9화 시그니처 포즈에서 실제로 달라졌다). 크롬에서 첨부하는 법: "업로드 및 도구 → 파일 업로드" 가 부르는 `input.click()` 을 가로채 그 input 을 잡고, `file_upload` 도구로 1024px 로 줄인 사본(10MB 미만)을 넣는다 — 메모리 qna-chrome-gen 참고.
  - **빠지기 쉬운 자리 (2026-10-25 사용자 재지시 — 글자 프롬프트만으로 그려서 그림체가 또 바뀌었다):**
    1. **가족이 한 명이라도 나오는 그림은 전부** 그 사람의 `art/common/<kid|dad|mom>/normal.png` 를 붙인다 — 포즈 · 컷인뿐 아니라 여럿이 나오는 장면(`full/…`), 상상 장면, 소품 속 인물까지. 나오는 사람이 셋이면 셋 다.
    2. **이어 그리는 컷(시그니처 2~N 컷, "the image you just made")도 요청마다 다시 첨부한다** — 앵커 + 그 인물 normal + 바로 앞 컷. 대화 기억에만 기대면 컷이 갈수록 얼굴 · 색이 변한다.
    3. 새 인물(편마다 나오는 제삼의 인물)은 `normal` 을 먼저 뽑아 확인한 뒤, 그 인물의 나머지 그림에 그 `normal` 을 붙인다.
    4. 자동 큐(스크립트로 여러 장 돌릴 때)를 만들면 **보내기 전에 항목마다 첨부 목록을 출력해 빈 칸이 없는지 확인**하고, 결과에 "attached N" 이 기대 수와 같은지 본다. 첨부가 실패(ATTACHFAIL · NOINPUT)한 항목은 글자만으로 보내지 말고 멈춘다.
    5. 뽑은 뒤에는 콘택트 시트에 그 인물의 `normal.png` 를 나란히 놓고 얼굴 · 머리 · 옷 · 피부 톤이 같은지 눈으로 확인한다. 다르면 쓰지 않고 다시 뽑는다.
    6. **사람이 없는 소품(`prop/…`)에는 얼굴 앵커(`style-cutin.png`)를 붙이지 않는다.** 10화에서 앵커만 붙인 소품 4장(홉 · 화성 돌 · 비행기 · UFO 정체)이 앵커 속 주황 점퍼 인물 위에 물건을 덧그린 그림으로 나왔다 (Gemini 가 새 그림 대신 첨부 그림을 고친다). 소품은 **잘 나온 소품 한 장**(예: `episodes/10-hope-ufo-alien/art/prop/space-probe.png` 1024px 사본)을 붙이고, 프롬프트 첫머리의 얼굴 화풍 문단(huge open mouths …) 대신 "single object sticker, no human, no face" 를 쓴다.
- **시그니처 당황 포즈**(공통 컷인): 아빠 `dad-sig-1~3`(네모 입막음 3컷) · 엄마 `mom-sig-1~4`(곧게 편 오른 검지로 입 둘레에 네모 — 왼쪽 세로 → 오른쪽 세로 → 위 가로 → 아래 가로) + `mom-sig-scream`(케빈처럼 양 볼 누르고 악!) · 아이 `kid-sig`. 여러 컷은 같은 대화에서 이어 그려 한 동작처럼 넘긴다. 인물마다 한 편에 한 번이 기본.
- **분량 3분 안쪽** (2:40~3:00). 대사 45~55줄. 같은 그림이 4초 넘게 머물지 않는다.
- 시나리오는 집 밖에서, 제삼의 인물과. 아이 눈높이 박자에는 농담 · 효과음 없음.
- 오답 카운터(정색 나레이션 "오답, N." + 구석 正)와 "저는 모답맨입니다" · "역시, 모답맨" 은 매 편 고정.
- 목소리: 아빠 · 나레이션 = Algenib, 아이 = Leda, 엄마 = Kore, 손님은 `src/voice.json` 의 역할(경찰관 Erinome, 이웃 아저씨 Alnilam …). 한 컷에 목소리는 둘까지.
- 몸 · 성 관련 소재는 몸을 그리지 않는다 (4편: 닫힌 문 · 거품 모자이크 · 단면도). 민감한 단어는 대사에만, 썸네일 · 제목 · 화면 글자에는 쓰지 않는다.
- 법 · 의료 · 제도는 끝 화면 주석("일반 설명, 개별 상담은 전문가에게")과 설명란 ※ 줄을 넣는다. 한 곳 보도뿐인 숫자는 쓰지 않는다.
- 유튜브 영상을 **영구 삭제하지 않는다** (Claude 는 비공개로 내리기까지만, 삭제는 사람이 Studio 에서).
- 대본을 고치면 `.md` 기획서의 대본도 같이 고친다 (영상 대본이 원본이 된 뒤에는 `script.json` 기준).
