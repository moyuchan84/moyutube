# 내모남불 — 모라구 시리즈

> **내**가 하면 **모** 어때, **남**이 하면 **불**(법).
> 모 씨네 가족(`qna/art/common`)이 나오는 이중 잣대 코미디. 편집은 모답맨 모션 엔진(`qna/video/src/motion/Motion.tsx`)을 같이 쓴다.
> 시작: 2026-10-25. 첫 편은 「자동차편」(funtube 「내로남불 · 운전석의 법칙」을 옮겨 온 것).

## 폴더

| 무엇 | 어디 |
|---|---|
| 편 폴더 (기획서 · 그림 원본 · 프롬프트) | `naemonambul/NN-slug/` — `NN-slug.md` 대신 `<slug>.md`, `art/`, `GEMINI_PROMPTS.md`, `jobs/` |
| 대본 · 그림 목록 · 타이밍 | `qna/video/src/nmNN/` (`script.json` · `art.json` · `timing.json`) |
| 샷 편집 계획 | `qna/video/src/motion/nmNN.json` → `Root.tsx` 의 `MOTIONS` |
| 음성 | `qna/video/public/nmNN/voice/<컷>-<줄>.wav` (원본은 `video/voice-raw/nmNN/`, git 에 안 올림) |
| 결과물 | `qna/video/out/motion/` (git 에 안 올림) |

`video/scripts/art-lib.mjs` 가 `nmNN` 을 이 폴더(`naemonambul/NN-*`)로 연결한다. 그래서 `npm run prompts -- nm01`, `npm run art -- nm01`, `trim-voice` · `voice.mjs` · `speed.mjs` · `motion-srt` 가 모답맨 편과 똑같이 돈다.

## 포맷 (모답맨과 같은 것 · 다른 것)

- **같은 것:**
  - 부모-자녀 관계, 집 밖에서 제삼의 인물과
  - 2~3초마다 바뀌는 모션 편집, 합성 효과음
  - 아이 눈높이 박자에는 농담 · 효과음 없음
  - 사실은 확인된 것만, 법 · 제도는 끝 화면 주석
  - 마지막 반전은 아빠
- **다른 것:**
  - 아빠가 *모르고* 틀리는 게 아니라 *알면서* 자기만 봐준다.
  - 구석 카운터는 "내모남불"이다. 나레이션 "내모남불, N."
  - 라운드마다 "남이 하면 → 내가 하면 → 정답 인물의 법 카드" 순서로 간다.
  - 아빠는 콜드 오픈에서 "저는… 모답맨입니다."라고 시리즈를 잇고, 끝은 "그냥 오답" → "…역시, 모답맨."
- **"불륜"이라는 말은 쓰지 않는다.**
  - 타이틀 카드는 "남이 하면 불—" 다음에 빨간 도장 "법!"을 찍는다.
  - 제목 · 썸네일 · 화면에는 그 단어를 쓰지 않는다.
- **목소리:** 아빠 · 나레이션 Algenib, 모라구 Leda, 엄마 Kore, 교통경찰관(역할 `traffic`) Erinome.

## 유튜브

- 채널: 모라구 (UCCIm8f5JE4b4PmSrPIJd7zQ)
- 재생목록(카테고리): 「내로남불 · 내모남불 (내가 하면 모 어때, 남이 하면 불법)」 PLEJvhEloY2QQ
- 채널 홈 탭: 모(오)답맨 섹션 바로 아래에 이 재생목록 섹션
- 제목은 노출을 위해 **"내로남불"을 앞에** 둔다 (사용자 요청). 예: `운전 내로남불 … | 내모남불`
- 쇼츠는 본편 구간을 이어 붙인다 (`video/src/shorts/motion-nmNN.json`, 관련 동영상 = 본편)
- 업로드 자료 · 기록: `video/out/motion/NmNN-Naemonambul.upload.md` (git 밖이라 링크는 아래 표에도 남긴다)

## 편 목록

| 편 | 주제 | 상태 |
|---|---|---|
| 01 자동차편 | 끼어들기 · 깜빡이 · 주차 | 2026-10-25 공개 — 본편 https://youtu.be/8eM3G4L7zEQ · 쇼츠 QBzdCbXA5uk(깜빡이) · gGeUyI6Hl1U(주차) · 8nxwK3uSFL4(끼어들기) |

**다음 후보:**
- 경적 · 우회전 (자동차편 ②)
- 스쿨존
- 하이빔
