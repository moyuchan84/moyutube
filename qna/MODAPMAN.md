# 모라구 · 모(오)답맨 — 이어서 작업하기 위한 전체 정리

> 컴퓨터가 바뀌거나 대화 기록이 없어져도 이 문서 하나로 이어서 만들 수 있게 정리한 것. (마지막 갱신 2026-10-23)
> 작업 규칙은 [CLAUDE.md](CLAUDE.md), 기획 규칙은 스킬 [`.claude/skills/modapman/SKILL.md`](.claude/skills/modapman/SKILL.md). 이 문서는 "왜 이렇게 정했나 · 지금 어디까지 왔나"를 담는다.

## 1. 채널 정체성 — 모라구 = 모 씨네 가족 채널

- 채널: **모라구** (`UCCIm8f5JE4b4PmSrPIJd7zQ`, 핸들 `@HYEJINKIM-h6u`). Studio 는 Google 계정 starbud2025 로 연다(크롬의 AI Studio 용 계정 mojjijji 와 다르다).
- 이 집은 **모 씨**다. 채널의 모든 말장난은 성(姓) "모"에서 나온다.

| 식구 | 이름 | 말장난 | 역할 |
|---|---|---|---|
| 아들 (8살) | **모라구** | 모 + "뭐라구?" — 채널 이름이 아이의 말버릇 | 핵심을 찌르는 질문 담당 |
| 아빠 | **모(오)답맨** | 모 + 오답맨 | 자신만만하게 틀리는 담당 (시리즈 주인공) |
| 엄마 | **모(母)범답안** | 어미 모(母) + 모범답안 | 정답 담당 (가끔 틀리면 "모범답안… 이었으나 오답") |

- **배너** (2026-10-23 적용): 빨간 도장 "모" + 라구, 나무 문패 "모 씨네", 세 식구 얼굴 + 노란 이름표. 코드로 만든다 → `video/src/ChannelBanner.tsx`, `npx remotion still src/index.ts Channel-Banner out/channel/banner-modapman.png`. 글자 · 인물은 가운데 1546×423 띠 안에만.
- **채널 설명** (적용됨): "모 씨네 가족 채널, 모라구입니다." 로 시작해 세 식구를 소개하고 카테고리를 ▶ 로 나열. 원문은 `video/out/channel/description.md`, 바꾸기 전 설명은 아래 7절.
- 모라구 안의 카테고리 (각자 규칙 문서가 따로 있다, 기획 · 방향 · 의도 한눈에 보기: [docs/morago-categories.md](docs/morago-categories.md)):
  - **모(오)답맨** — 이 문서. qna 폴더
  - **내모남불** — [docs/naemonambul.md](docs/naemonambul.md)
  - **포모라구** (기획 중) — [docs/pomoragu.md](docs/pomoragu.md)
  - **이게 모예요?** (쇼츠, 1편 공개) — [docs/igemoyeyo.md](docs/igemoyeyo.md)
  - **모 아니면 도** (1편 공개, 두 갈래 결말 인터랙티브) — [docs/moanimyeondo.md](docs/moanimyeondo.md)
  - **모덕후 · 조삼모사 · 모롱이** (기획 중, 어른 대상 쇼츠: 덕후식 고찰 · 같은 상황 다른 관점 · 꺼드럭 놀리기) — [docs/modeokhu-josammosa-morongi.md](docs/modeokhu-josammosa-morongi.md)
  - **보면 풀리는 수학 · 과학** — `lab/` ([lab/CLAUDE.md](../lab/CLAUDE.md))
  - **엄마가 만든 동화 / 상담심리사 엄마의 인성동화책** — `fairy/`
  - **아빠가 만든 앱** — 앱 소개 영상
  - 자매 채널 **숫자로 보는 요즘** — `shortube/` (규칙이 다르다: 바로 공개 업로드)

## 2. 모답맨 포맷 — 왜 바꿨나, 무엇이 고정인가

**배경:** 1~8편 롱폼(아빠가 지난 일을 회상 · 나레이션 70% · 한 장면 12~19초 · 6~8분)은 루즈해서 시청이 끊겼다. 사용자 요청: "스타일리쉬하고 병맛, 호흡 짧고 빠르게, 애프터 이펙트 같은 장면 전환, 내용 본질은 잃지 않게, 3분 안". 시험판 v1 → v2 → 대본까지 바꾼 모답맨판을 거쳐 2026-10-23 **"너무 재밌어졌네"** 로 확정.

**지금 기준 (지난 포맷과 비교)**

| | 이전 (1~8편) | 모답맨 |
|---|---|---|
| 길이 | 6~8분 | **2:40~3:00** |
| 틀 | 아빠의 회상 ("20분 전으로…") | **오답 카운터 쇼** — 틀릴 때마다 "오답, N." + 구석 正 |
| 나레이션 | 상황 설명 | 정색한 진행자 한 줄 ("메모했습니다. 손바닥에.") |
| 설명 | 정답 인물의 긴 강의 | **ROUND 1~3**, 라운드마다 개념 하나 + 글자 카드 |
| 화면 | 한 장면 12~19초 | 2~3초마다 전환, 같은 그림 4초 이하 |
| 웃음 | 가끔 | 아빠의 상상 장면 · 한 줄 태클 · 멈춤+이름표 · O/X · 크래시 줌 |
| 대사 | 한 줄 30~35자 | 15~20자 |

**절대 안 바뀌는 것:** 부모-자녀 관계(교사-학생 어휘 금지) · 집 밖에서 제삼의 인물과 · 아이 눈높이 박자는 농담 · 효과음 없이 진심으로 · 사실은 확인된 것만(한 곳 보도 숫자 금지) · 민감 소재는 몸을 그리지 않고 이유를 대사로 풀지 않음 · 법 · 의료는 "일반 설명" 주석.

**구조 (약 3분):** 콜드 오픈(질문 → 아빠 오답 → 정정 → "…네?" → "오답, 하나. 저는 모답맨입니다." → 타이틀) · 사건 개요 · 오답 퍼레이드 · 정답 라운드 1~3 · 아이 눈높이 · 반전 + "오답, N. 역시, 모답맨."

## 3. 만드는 기준 (생성 기준)

### 대본
- `content/<편>/script/script.json` — `"speed": 1.2`, `"rawVoice": true`, 컷마다 목소리 둘까지, 숫자는 `tts`(한글 읽기), 줄마다 `en`(영어 자막).
- 대사 45~55줄, 공백 뺀 900~1,100자. 기획서 `content/<편>/plan.md` 에도 같은 대본.

### 목소리 (`video/src/voice.json` 에 고정, 바꾸지 않는다)
아빠 · 나레이션 = **Algenib**, 아이 = **Leda**, 엄마 = **Kore**, 경찰관 = Erinome, 이웃 아저씨 = Alnilam, 할머니 = Gacrux, 이발사 = Charon, 약사 = Sulafat, 간호사 = Zephyr, 정형외과 = Iapetus, 내과 접수 = Achernar.
말투 덧붙임: 나레이션 "short, dry, deadpan aside with snappy comedic timing" · 아빠 장면 대사 "snappy comedic timing, a bit over-confident" · 아이 눈높이 박자 "warm, gentle and sincere, a little slower, no joking".

### 그림 (화풍 앵커 `content/_common/art/anchor/style-cutin.png`)
- 공통 그림 먼저 재사용: `content/_common/art/{dad,kid,mom,cutin,bg}` (아빠 panic/shock/proud/think/explain…, 얼굴 컷인 dad-panic/dad-shock/dad-proud/kid-ask/kid-doubt/mom-smirk/mom-sigh).
- 편마다: 배경 2~3 · 정답 인물 포즈 + 얼굴 컷인 · 소품 10장 안팎 · 상상 장면 배경 1.

### 샷 편집 (엔진 `video/src/motion/Motion.tsx`, 계획 `content/<편>/script/motion.json`)
- 박자 = 대사 한 줄(`line`) 또는 무대사 장면(`hold`), 대사 하나에 샷 1~3개.
- 전환: whip · zoom · spin · wipe · iris · glitch · slam · smash · flash. 카메라: roll · punch(크래시 줌) · snap.
- 장치: freeze+tag(멈춤 이름표) · mark(O/X) · tally(正) · loading · jail · note(※) · 글자 slam/stamp/pop/type/shake/news · fx imagine/docu/vhs/slowmo/lines.
- `count: n` 으로 오답 카운터, 맨 위 `"counter": "모답맨 오답"`, `"thumb"` 로 썸네일 문구.
- 효과음은 전부 코드 합성 (`video/scripts/sfx.mjs`) — 저작권 걱정 없음. 배경음악 `public/bgm/cheerful.wav`.

### 썸네일
`MotionThumb` (`src/motion/Thumb.tsx`): 빨간 방사 배경 + 노란 X + 놀란 아빠 얼굴 + 위 두 줄(흰 · 노랑) + 작은 셋째 줄 + 정답 인물 얼굴 + "모답맨" 딱지 + 오답 카운터. 1280×720.

## 4. 제목 · 키워드 · 업로드 방향

- **제목은 YouTube Data API 로 키워드를 재고 정한다** (`npm run keywords -- "검색어" …`, 키 `YOUTUBE_API_KEY` @ 루트 `.env`).
  - 지금 뜨거운 말(최근 60일 영상이 많고 조회수 중앙값 높은 것)을 **앞머리**, 꾸준한 말("A·B·C 차이/정리")을 가운데, 끝에 **`| 모답맨`**.
  - 아이 질문형 훅을 살린다. 조회수 낮은 말은 태그로.
  - 8화 예: `검찰청 폐지되면 나쁜 사람은 누가 재판에 보내요? 경찰·검사·판사 3분 정리 | 모답맨` (조사 근거: "검찰청 폐지 뭐가 달라지나" 중앙값 5만 · 최근 25개, "경찰 검사 판사 차이" 7.1만, "형사 민사 차이" 2천 → 태그로)
- 설명: 훅 2줄 → ✔ 오해 → 정답 → 챕터(10초 이상씩) → 모답맨 소개 → ※ 주석 → 해시태그 5~6개.
- 업로드 설정: 모라구 · 재생목록 **"모(오)답맨 (여덟 살 아들의 호기심)"** (`PLFgSUY8ixTPE`) · 아동용 아니요 · AI 사용 아니요(만화, 실존 인물 아님 — Studio 질문은 사실적인 합성 여부) · 태그 · 교육 · 한국어 · 한국어 자막 · 언어 탭에서 영어 제목/설명/자막.
- **공개 상태는 비공개로 올리고, 공개는 사용자 확인 후.** 저장 뒤 실제 상태를 다시 읽는다.
- **영상을 영구 삭제하지 않는다** — 바꿀 영상은 비공개로 내리고, 삭제는 사람이 Studio 에서.

## 5. 지금 상태 (2026-10-23)

| 무엇 | 상태 |
|---|---|
| 모답맨 8화 `RFgammwWgrI` | 업로드 완료 · **비공개** · 썸네일 · 한/영 자막 · 영어 제목/설명 · 재생목록 |
| 이전 8편 롱폼 `RKavAUMZpv0` | 공개 → **비공개로 내림** (영구 삭제는 사용자 몫) |
| 이전 8편 쇼츠 `RVdv2t3vNE8` | 그대로 (공개) — 모답맨 쇼츠로 바꿀지 미정 |
| 채널 배너 · 설명 · 재생목록 설명 | 모 씨네 버전으로 **적용됨** |
| 1~7편 | 이전 포맷 그대로 공개. 모답맨으로 다시 만들지 미정 |
| 스킬 | 프로젝트 스킬 `modapman` (이 저장소). claude.ai 용 `skill/modapman.skill` 은 사용자가 올려야 함 |

**다음 할 일 후보:** 8화 공개 전환(사용자 확인) · 9화 주제 고르기(`.claude/skills/modapman/references/topic-bank.md`) · 8화 모답맨 쇼츠 · 1~7편 모답맨 리메이크 여부 · 사이트 홈 카드 갱신.

## 6. 이어서 작업하는 법

```bash
cd qna/video && npm install          # 처음 한 번
npm run studio                        # Ep08F-Modapman · Ep08F-Modapman-Thumb · Channel-Banner 미리보기
# 새 편: CLAUDE.md "작업 절차 — 모답맨 한 편" 12단계 그대로
npm run trim-voice -- epNN && node scripts/voice.mjs epNN && node scripts/speed.mjs epNN
npx remotion render src/index.ts <id> out/motion/<epNN>-modapman.mp4 > render.log 2>&1   # 파이프에 물리면 write EOF
npm run motion-srt -- epNN
npm run keywords -- "검색어1" "검색어2"
```

- 8화 결과물은 `out/`(git 에 안 올림)이라 새 컴퓨터에서는 위 명령으로 다시 만든다. 음성(`content/<편>/voice`) · 그림 원본(`content/ep08-…/art`)은 git 에 있다. 처리된 그림 `public/art/` 은 `npm run art -- ep08` 로 다시 만든다.
- **크롬 AI Studio 음성 함정:** Run 직후 0.08초짜리 자리표시 음성이 먼저 온다(길이 0.25초 넘고 2초간 안 바뀔 때 저장) · Style 은 버튼을 열고 넣어야 적용 · 계정당 무료 약 40줄 → 한도에 걸리면 계정 전환 · 파일 넘기기는 127.0.0.1:8765 로컬 서버 + 페이지 JS.
- **Studio 함정:** 10MB 넘는 파일은 로컬 서버 → fetch → DataTransfer 로 input 에 넣는다. 자막 · 배너처럼 파일 창이 뜨는 버튼은 `HTMLInputElement.prototype.click` 을 가로채 파일을 바로 넣는다(파일 창이 열리면 멈춤). "다음" 을 연달아 누르지 않는다(공개로 게시된 사고).

## 7. 기록

- 바꾸기 전 채널 설명: `video/out/channel/description-old-2026-10-23.md` (git 밖이라 여기에도 요지를 남김 — "'뭐라구?' 하고 되묻게 되는 순간을 모으는 가족 채널, 모라구입니다." + 여덟 살의 질문 / 아빠가 만든 앱 / 우리 집 실험실(준비 중) / 한 장 정리(준비 중) / 숫자로 보는 요즘).
- 바꾸기 전 재생목록 설명: "여덟 살 아들이 무심코 던진 질문에 아빠가 말문이 막혔다가, 다시 찾아보고 아이 눈높이로 풀어 주는 시리즈입니다."
- 시험판: `content/ep08-police-prosecutor-court/script/motion.json` (`Ep08-Motion`) — 롱폼 음성을 그대로 두고 편집만 바꾼 v2. 비교용으로 남겨 둠.
