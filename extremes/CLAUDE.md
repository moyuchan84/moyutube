# Extremes — 규칙 (Claude 는 작업 전에 항상 이 문서를 따른다)

채널: **Extremes** — 세상에서 가장 ~한 곳을 사진·지도·숫자로 보여 주는 무음 쇼츠. 얼굴 없는 정보형, 한·영 병기. (채널 ID `UCH2VugkdHcb3Ht8NJv9Kiaw` · 핸들 `@ExtremesFiles` — 2026-11-18 starbud2025 계정에 브랜드 채널로 개설, 프로필·배너·설명·키워드·워터마크 적용 완료, 재생목록 「DIVE: How far can you go? 끝까지 가 보기」 공개)
기획: [docs/new-channel-plan.md](../docs/new-channel-plan.md) · 배경: [docs/new-channel-idea.md](../docs/new-channel-idea.md) · 다음 시리즈(미스터리 · 실제 있었던 일, 수요 조사): [docs/series-plan.md](docs/series-plan.md).

**이 채널의 규칙은 shortube(숫자로 보는 요즘)와 다르다.** shortube 는 사진 금지지만 Extremes 는 라이선스가 확인된 사진을 쓴다. 두 채널 규칙을 섞지 않는다. 업로드 개수, 사실 확인, 템플릿 반복 주의는 shortube/CLAUDE.md 의 1·5-1·6장을 같은 정신으로 따른다.

## 매번 지키는 순서

0. `npm run new -- extremes <code> --title "…"` (저장소 루트) → `extremes/content/<code>/`. 폴더 규칙은 [docs/CONVENTIONS.md](../docs/CONVENTIONS.md).
1. **수요 확인**: `npm run seo -- "검색어"` (yt-seo 스킬). 한국어와 영어 검색어를 모두 본다.
2. **plan.md**: 출처 2곳 이상 → 사실 카드 → 샷 계획 → 연출 카드. 영상의 숫자는 사실 카드에 있는 것만.
3. **사진**: `npm run collect -- <code> "영어 검색어" --dry` 로 후보와 라이선스를 먼저 본 뒤, `--dry` 빼고 받는다. 받으면 `art/` 에 사진, `source/credits.json` 에 출처·라이선스·받은 날짜가 남는다.
   - **검색에 안 걸리는 사진**: Commons 파일 이름을 알면 `npm run collect -- <code> "File:이름.jpg|File:다른.jpg" --file --source wikimedia` (라이선스 검사는 같고, 사람이 고른 것이라 크기 검사만 건너뛴다).
   - **영상 클립**: `--video` 를 붙이면 Pixabay(· Pexels) 영상 mp4 를 찾는다. shots.json photo 샷에 `"video": "pixabay-xxxx.mp4"`(+ `videoStart` · `rate`). 실제 장소가 아닌 분위기 화면이면 `"illustrative": true` → 화면에 "연출 화면 · Illustrative footage" 표시 (실제 장소처럼 보이게 하지 않는다).
4. **샷 계획 → 영상**: `content/<code>/script/shots.json` 에 샷을 적는다(샷 종류 photo · compare · stat · end, 예시 `content/mariana/script/shots.json`). 편마다 영상 코드를 만들지 않는다 — `extremes/video/src/Short.tsx` 가 그린다. DIVE 형식(끝까지 내려가기)은 `"transition": "dive"` + `"dive": { "max": 11000, "atm": true }` + 샷마다 `"depth"` (예시 `content/dive/script/shots.json`). m 에서 수천 km 까지 가는 편은 `"scale": "log"` · `"km": 20000`(이 깊이부터 km 표시) · `"center": 6371000`(수압 대신 WAY TO THE CENTER %) — 예시 `content/dive2`. 올라가는 편은 `"up": true` + `"label": "WAY TO THE MOON"` (예시 `content/dive3`). 새 샷 종류가 필요하면 Short.tsx 에 추가하고, unit.json 에 `"video": { "composition": "<Id>", "bgm": "bgm/<code>.wav" }`.
5. **배경음악**: 코드 합성 `extremes/video/scripts/bgm/<code>.mjs` (mariana.mjs 참고) → `content/<code>/music/<code>.wav`. 외부 음원 금지.
6. **점검 · 렌더** (`extremes/video` 에서): 스틸 `npx remotion still <Id> out/x.png --frame=N --scale=0.5` 로 겹침 · 잘림 · 안전 영역 확인 → `npm run render -- <code>` → `extremes/output/videos/`.
7. **업로드**: yt-seo 로 제목(한·영) · 태그 → Studio. 하루 1~2편.

## 사진 규칙 (가장 중요)

- **받는 곳**: Wikimedia Commons · NASA · Pexels · Pixabay. 이미지 검색 크롤링 금지. 스크립트가 허용하지 않는 라이선스(CC BY-SA · NC · ND · 불분명)는 자동으로 버린다.
- 허용: 공공 도메인 · CC0 · CC BY(출처 표시) · Pexels · Pixabay 라이선스.
- **KOGL(공공누리) 제1유형** (2026-11-22 사용자 승인): 출처 표시 + 상업 이용 · 변형 가능. 한국 국립박물관 등의 유물 사진 · 그림에 쓴다. 조건: ① Commons 표기만 믿지 말고 **원 기관 페이지(e뮤지엄 등)에서 그 자료가 1유형인지 확인**한다(같은 기관에 변경 금지 유형이 섞여 있다) ② `collect` 가 자동으로 버리므로 `--file` 로 받는다 ③ `credits.json` 에 기관 · 저작물명 · 유형 · 받은 날짜, 설명란 `[사진 출처]` 에 기관명 · 저작물명 ④ 새로 찍은 사진 속 제3자 권리(사람 · 상표)는 따로 본다. 2유형(비영리) · 3유형(변경 금지) · 4유형은 쓰지 않는다.
- **NASA 사진**은 대체로 공공 도메인이지만 제3자 크레딧이 붙은 것이 있다. collect 가 "페이지에서 제3자 크레딧 확인"으로 표시한 사진은 `page` URL 을 열어 확인한 뒤 쓴다.
- 업로드 전 **설명란 `[사진 출처]`** 에 `credits.json` 의 작가 · 라이선스 · 링크를 넣는다 (CC BY 는 필수).
- **금지**: 알아볼 수 있는 사람 얼굴 · 사고·재난 피해자 · 로고·상표·브랜드 · 연예인 · 남의 영상 클립 · 상용 음원 · 미성년 정보.
- 자동으로 받은 사진은 **사람이 눈으로 고른다.** 맞지 않거나 사람 얼굴이 크게 나온 사진은 쓰지 않는다. 사진이 모자라면 코드 지도(Natural Earth, 퍼블릭 도메인)와 도형 그래픽으로 채운다.
- Pexels 는 2026-11-11 기준 새 API 키 발급을 멈췄다 → 지금은 Pixabay 키만 있다.
- Pexels · Pixabay 키는 `PEXELS_API_KEY` · `PIXABAY_API_KEY` 로 저장소 루트 `.env` 에만 둔다 (코드·문서·로그에 쓰지 않는다).

## 사실 확인

- 순위 · 깊이 · 온도 같은 숫자는 출처 2곳을 교차 확인한다. 기록마다 의견이 갈리면 "기록 기준 / 측정 방식에 따라 다름"을 화면에 쓴다.
- "가장 ~한" 단정은 근거가 되는 기관 · 기준을 밝힌다 (예: "2026 기준, ○○ 조사").
- 숫자에는 기준일과 단위. 한 곳 보도뿐인 숫자는 쓰지 않는다.
- 정치·전쟁·민감한 사고 중심의 소재(위험한 나라 순위 등)는 하지 않는다. 장소 · 자연 · 지형 위주.

## 화면

- 1080×1920, 15~35초, **무음 + 합성 BGM**. 화면 글자는 한국어와 영어를 함께 (영어를 크게).
  - **2026-11-11 결정: 영어 중심 채널.** shots.json 에 `"lang": "en"` → 영어 크게(흰색) · 한국어 작게(강조색). 영어 문장은 직역 말고 원어민 말투, `\n` 으로 줄을 직접 나눈다 (92px 한 줄 ≈ 17자, 76px ≈ 20자). 막대 라벨 등 한 줄짜리는 영어만.
  - 채널 설정 · 배너 · 프로필: `content/_common/channel/` (channel.md · banner.png · avatar.png, `ChannelArt.tsx`).
- 첫 1초에 가장 강한 사진 + 한 문장. 로고 · 인사로 시작하지 않는다.
- 정지 장면 2초 이하: 켄 번즈(천천히 확대 · 이동) + 컷 전환 + 글자 등장 중 하나가 계속 움직인다.
- 쇼츠 앱 안전 영역: 아래 y≈1560, 오른쪽 x>950, 위 y<200 에는 글자 · 핵심 숫자를 두지 않는다.
- 연출 카드(팔레트 · 레이아웃 · 전환 · 카메라 · 오브젝트 · 타이포 · 템포)를 편마다 채우고 직전 2편과 4항목 이상 다르게.
- 끝 카드: 이유가 붙은 구독 한 줄 + 댓글 질문 하나 (한·영), 끝은 첫 장면으로 이어 붙인다. 부탁은 하나만.
- **구독 · 좋아요는 노골적으로 부탁하지 않는다 — 구조로 만든다** (2026-11-11 사용자 요청):
  - 시리즈로 만든다: `series: { n, total }` → 브랜드 옆 점(●●○○○)으로 "모으고 싶게". 한 편 = 한 곳, 「질문 → 흔한 오해 → 진짜 이유 → 증거 → 반전」.
  - 끝 카드 `end.next` 로 다음 편을 흐린 사진 + "?" 로 미리 보여 준다 → 구독할 이유. 구독 한 줄은 "구독하면 이어서 보여요" 정도로 담백하게.
  - 좋아요는 부탁하지 않는다. 댓글 질문은 찬반이 갈리거나 자기 경험을 말하게 (예: "이 섬, 그대로 두는 게 맞을까?").
  - 썸네일 · 제목에 답(반전)을 쓰지 않는다. 질문만 던진다.
  - 업로드 때: 재생목록 「갈 수 없는 곳」, 쇼츠 "관련 동영상"에 이전 편, 고정 댓글에 질문. 다음 편 예고를 했으면 그 편을 실제로 만든다.

## 업로드

- 하루 1~2편, 몰아 올리지 않는다. 같은 날 2편은 소재 · 연출이 달라야 한다.
- 제목은 22자 안팎 한·영, 상황·결과를 그대로 (낚시 금지). 설명란에 사실 기준일 · 사진 출처 · `[음악] 직접 합성한 배경음악`.
- AI 사용 표시: 사진은 실제 사진이고 AI 생성이 없으면 "아니요". AI 이미지를 쓰면 "예".
- 아동용 아님. 업로드 후 Studio 에서 실제 공개 상태 확인. 영상 영구 삭제는 Claude 가 하지 않는다.
- 업로드 기록: `unit.json` 의 `status: uploaded` + `youtube`.
- 이 채널의 공개 범위 기본값은 사용자가 아직 정하지 않았다 → 첫 업로드 때 묻는다.

## 파일 위치

| 무엇 | 어디 |
|---|---|
| 편 하나 | `extremes/content/<code>/` — `unit.json` · `plan.md` · `art/`(사진) · `source/credits.json` · `script/` · `music/` · `upload/` |
| 공통 자료 | `extremes/content/_common/` (지도 · 브랜드) |
| 사진 수집 | `extremes/scripts/collect.mjs` (`npm run collect`) |
| 영상 엔진 | `extremes/video/` (Remotion, `src/Short.tsx` · `scripts/` · `scripts/bgm/`) — `public/` · `src/generated/` · `out/` 는 git 제외 |
| 완성 영상 | `extremes/output/videos/<created>_<code>.mp4` (git 제외) |
