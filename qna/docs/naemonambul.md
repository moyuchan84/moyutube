# 내모남불 — 모라구 시리즈

> **내**가 하면 **모** 어때, **남**이 하면 **불**(법).
> 모 씨네 가족(`qna/content/_common/art`)이 나오는 이중 잣대 코미디. 편집은 모답맨 모션 엔진(`qna/video/src/motion/Motion.tsx`)을 같이 쓴다.
> 시작: 2026-10-25. 첫 편은 「자동차편」(funtube 「내로남불 · 운전석의 법칙」을 옮겨 온 것).

## 폴더

| 무엇 | 어디 |
|---|---|
| 편 폴더 (모든 것) | `qna/content/nmNN-<slug>/` — 모답맨 편과 같은 구조 (`unit.json` 에 `"series": "naemonambul"`, `plan.md` · `script/` · `prompts/` · `art/` · `voice/` · `upload/`). 새 편은 저장소 루트에서 `npm run new -- qna nm02 --slug <영문> --series naemonambul` |
| 대본 · 그림 목록 · 타이밍 | `content/<편>/script/` (`script.json` · `art.json` · `timing.json`) |
| 샷 편집 계획 | `content/<편>/script/motion.json` (Root 에 자동 등록) |
| 음성 | `content/<편>/voice/<컷>-<줄>.wav` (받은 원본은 `content/<편>/voice/raw/`, 모두 git 에 있다) |
| 렌더 결과 mp4 | `qna/video/out/motion/` (git 에 안 올림 — 다시 렌더할 수 있다) |

`video/scripts/art-lib.mjs` 가 `nmNN` 을 이 폴더(`content/nmNN-*`)로 연결한다. 그래서 `npm run prompts -- nm01`, `npm run art -- nm01`, `trim-voice` · `voice.mjs` · `speed.mjs` · `motion-srt` 가 모답맨 편과 똑같이 돈다.

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
- 쇼츠는 본편 구간을 이어 붙인다 (`content/<편>/script/motion-short.json`, 관련 동영상 = 본편)
- 업로드 자료 · 기록: `content/<편>/upload/upload.md` (git 에 있다. 영상 ID 는 `unit.json` 의 `youtube` 에도)

## 편 목록

| 편 | 주제 | 상태 |
|---|---|---|
| 01 자동차편 | 끼어들기 · 깜빡이 · 주차 | 2026-10-25 공개 — 본편 https://youtu.be/8eM3G4L7zEQ · 쇼츠 QBzdCbXA5uk(깜빡이) · gGeUyI6Hl1U(주차) · 8nxwK3uSFL4(끼어들기) |
| 02 엘리베이터편 | 닫힘 버튼 · 층 버튼 · 통화 (IDEAS A-1) | 2026-10-26 시나리오 초안 — `content/nm02-elevator/plan.md` |
| 03 주식편 | 오르면 · 내리면 · 단톡방 (IDEAS B-1 + 남 잘되면 배 아픈 아빠) | 2026-10-27 공개 — 본편 https://youtu.be/GgaDTLkde-o · 쇼츠 kmF04p6HQGY(오르면) · ze_i2WtPjQ4(내리면) · Sbtkwn6cDN8(단톡방) |
| 04 부동산편 | 호가 · 호재/소각장 · 영끌/이자 + 속사포(세대수 · 전세 · 현수막) + 팔면 폭락 (IDEAS B-2 확장) | 2026-10-28 공개 — 본편 https://youtu.be/4BGGeubzpDA · 쇼츠 VH8U3GjtL9I(호가) · hGJB5oqtd48(호재 · 소각장) · CeweE4TBEIM(영끌 · 속사포) |
| 05 회사편 | 출근 · 연차 · 퇴근 카톡 · 내 덕 남 탓 + 속사포 + 푸딩 반전 (IDEAS D-1, 아빠 회사 가는 날) | 2026-10-30 기획 · 대본(53줄) · 그림 목록(25장) — `content/nm05-office/plan.md`. 정답 인물 인사팀 과장님 `hr` Pulcherrima · 김 대리 `junior` Sadachbia |
| 06 아파트편 | 층간소음(발망치 · 편지) · 주차 두 칸(정의의 주민) · 택배 박스 + 속사포 + 편지 부메랑 반전 (IDEAS A-4 v2, 찐따웃음) | 2026-10-31 기획 · 대본(63줄) · 그림 목록(26장) · 키워드 조사 · 제목 — `content/nm06-apartment/plan.md`. 관리소장 `aptmgr`(2편 그림 복사) · 윗집 할머니 `granny` · 아랫집 아저씨 `neighbor` |

**다음 편 아이디어:** [naemonambul-ideas.md](naemonambul-ideas.md) — 공공장소편(엘리베이터 · 버스 · 식당 · 아파트), 돈편(주식 · 집값 · 더치페이), 우리 집편, 회사편(회식 · 점심, 라떼 vs 신입은 킵), 운전편 ②
