# shortube 키워드·쇼츠 패턴 분석 자동화 명세서

> 이 문서는 Claude Code가 읽고 구현을 이어가기 위한 작업 명세서입니다.
> 구현 전에 "0. 먼저 확인할 것"을 사용자(Gada)에게 확인받고, 모호한 부분은 임의로 정하지 말고 질문하세요.
> **법적·정책 리스크 기준은 `COMPLIANCE_GUIDE.md`를 따릅니다. 두 문서가 충돌하면 COMPLIANCE_GUIDE.md가 우선합니다.**

---

## 0. 먼저 확인할 것 (구현 시작 전 체크리스트)

| 항목 | 상태 | 비고 |
|---|---|---|
| Python 3.11+ 설치 | 확인 필요 | `python --version` |
| YouTube Data API v3 키 | 사용자 발급 필요 | Google Cloud Console → API 사용 설정 → API 키 |
| 네이버 개발자센터 앱 (DataLab 검색어트렌드) | 사용자 발급 필요 | Client ID / Secret |
| 구글 트렌드 | 키 불필요 | `pytrends`(비공식, 2025-04 저장소 아카이브) 사용, 차단·고장 가능. 대체 신호로 위키백과 조회수 API 병행 |
| 위키백과 조회수 API | 키 불필요 | Wikimedia REST API, User-Agent에 연락처 명시 |
| 키 저장 위치 | `.env` (git 제외) | `.env.example`만 커밋 |

키가 아직 없으면 키 없이 가능한 모듈(자동완성, pytrends)부터 먼저 구현하고, 나머지는 `.env` 값이 비어 있을 때 명확한 에러 메시지로 안내하게 만든다.

---

## 1. 목표

한국어 유튜브 쇼츠 채널의 **첫 주제를 감이 아니라 데이터로 고르기 위한** 키워드 발굴·검증 파이프라인을 만든다.

최종 산출물: 후보 키워드별 점수표(CSV)와 "잘 나오는 제목 패턴" 리포트(Markdown).

### 배경 (결정 사항)
- 쇼츠는 검색 유입보다 **추천 피드 유입**이 크다. 키워드는 제목·설명 보강용이고, 성패는 첫 3초 훅과 시청 지속률이 좌우한다. 따라서 이 도구의 목적은 "검색량 1위 찾기"가 아니라 **"수요가 있고 경쟁 쇼츠가 어떤 제목으로 터지는지 파악"**이다.
- 고유명사(인물·작품) 키워드는 시점이 생명이다. 급상승 감지는 후속 단계(범위 밖, 8장 참고).
- 연예인 대상 콘텐츠는 이미지 저작권·초상권·명예훼손 리스크가 있다. 한국은 사실을 말해도 명예훼손이 성립할 수 있으므로 **인물(개인) 대상 키워드는 후보에서 제외**한다. 이 도구는 **데이터 수집·분석만** 하고 이미지나 영상은 다루지 않는다.
- 수요가 높아도 **믿을 만한 출처를 확보할 수 없는 주제는 만들지 않는다**(`source_availability` 점수, 7-1).

### 범위
- 포함: (1) 트렌드 관심도 수집 (2) 유튜브 자동완성 수집 (3) 경쟁 쇼츠 분석, 그리고 이를 합친 리포트
- 제외: 영상 제작, 업로드, 대본 생성, 이미지 수집 (후속 프로젝트)

---

## 2. 기술 스택 / 폴더 구조

- 언어: Python 3.11+
- 라이브러리: `requests`, `pandas`, `python-dotenv`, `pytrends`, `typer`(CLI), `pyyaml`, `pytest`
- 저장: SQLite(`data/shortube.db`) + 결과 CSV/MD (`output/`)
- 한글 처리: 모든 파일 UTF-8, CSV는 `utf-8-sig`(엑셀 호환)로 저장

```
shortube/
├─ SPEC.md                  # 이 문서
├─ COMPLIANCE_GUIDE.md      # 법적·정책 리스크 기준 (우선 적용)
├─ CLAUDE.md                # (선택) Claude Code용 프로젝트 지침, 이 문서 요약
├─ .env.example
├─ .gitignore               # .env, data/, output/, __pycache__
├─ requirements.txt
├─ config/
│  ├─ seeds.yaml            # 시드 키워드 (카테고리별, enabled 플래그)
│  ├─ settings.yaml         # 기간, 지역, 임계값, 리스크 사전 등
│  └─ sources.yaml          # 출처 라이선스 등급, blocked_domains
├─ src/shortube/
│  ├─ cli.py                # typer 진입점
│  ├─ db.py                 # SQLite 스키마/저장
│  ├─ collectors/
│  │  ├─ trends.py          # 모듈 1: 네이버 DataLab + 구글 트렌드 + 위키 조회수
│  │  ├─ wiki.py            # MediaWiki API 어댑터
│  │  ├─ ott_works.py       # 모듈 1a: 최근 OTT 작품
│  │  ├─ autocomplete.py    # 모듈 2: 유튜브 자동완성
│  │  └─ shorts.py          # 모듈 3: YouTube Data API 경쟁 쇼츠
│  ├─ analysis/
│  │  ├─ title_patterns.py  # 제목 패턴 추출/통계
│  │  └─ scoring.py         # 키워드 종합 점수
│  └─ report.py             # Markdown 리포트 생성
├─ tests/
├─ data/                    # SQLite (git 제외)
└─ output/                  # CSV, 리포트 (git 제외)
```

### CLI 설계
```
python -m shortube entities      # 최근 OTT 작품 → config/entities_auto.yaml
python -m shortube trends        --seeds config/seeds.yaml
python -m shortube autocomplete  --seeds config/seeds.yaml
python -m shortube shorts        --keywords-from autocomplete --top 30
python -m shortube report        # 위 결과를 합쳐 점수표 + 리포트 생성
python -m shortube prune         # 30일 지난 YouTube API 데이터 정리
python -m shortube run-all       # prune 후 순서대로 전부 실행
```

각 단계는 **독립 실행 가능**해야 하고, 결과를 SQLite에 저장해서 중간부터 재개할 수 있어야 한다. 이미 수집한 (키워드, 날짜) 조합은 재호출하지 않는다(API 쿼터 절약).

---

## 3. 시드 키워드 (config/seeds.yaml 초기값)

Gada가 이후 직접 수정한다. 형식은 `카테고리: [키워드...]`.

```yaml
chart:        # 차트/순위형
  - 멜론 차트
  - 빌보드 핫100
  - 넷플릭스 순위
  - 역대 흥행 영화
explain:      # 작품 정보형 (작품명 템플릿만 사용, 인물 X)
  - 몇 부작
  - 원작
  - 공개일
  - 촬영지
career:       # 커리어 연표형 — 1차 범위에서 보류 (enabled: false)
  - 필모그래피
  - 대표작
  - 데뷔
trivia:       # 상식/잡학형 (1차 메인 카테고리 권장)
  - 소름 돋는 사실
  - 몰랐던 사실
  - 오늘의 역사
  - 하는 이유
```

고유명사 템플릿 지원: `config/settings.yaml`에 `entities: [{name, entity_type}]`를 넣으면 `explain` 시드와 조합(`{entity} {seed}`)해서 후보 키워드를 생성한다.
- `entity_type`은 `work`(작품)만 조합에 사용한다. `person`이 들어오면 경고 로그를 남기고 조합에서 제외한다.
- 카테고리별 `enabled` 플래그를 둔다. `career`는 기본 `enabled: false`(활성화 시 COMPLIANCE_GUIDE.md 1-2 조건 적용).

---

## 3-1. 모듈 1a: 최근 OTT 오리지널 작품 자동 수집 (`collectors/ott_works.py`)

`explain` 시드와 조합할 작품명(`entities`)을 자동으로 만든다. 기준: **최근 14일 안에 OTT(넷플릭스·티빙·디즈니+·쿠팡플레이·웨이브·왓챠)에 공개된 한국 작품**.

- 출처: 영문 위키백과 `{연도} in South Korean television` 문서의 "New series and returning shows" 표(MediaWiki API, 키 불필요). 조회 기간이 연도를 넘으면 두 해 문서를 모두 읽는다.
- 추출: 제목, 플랫폼, 첫 공개일(사실 정보만). 플랫폼 목록·기간은 `settings.yaml`의 `ott_works`.
- 한국어 제목: 위키 언어 링크(ko) → 영문 문서 본문 `{{Korean|..}}` → 인포박스 `hangul=` 순서로 찾는다. 못 찾으면 `use: false`.
- 결과: `config/entities_auto.yaml`(사람이 `use`를 확인·수정) + DB `ott_works`. 재실행해도 사람이 고친 `name`/`use`는 유지된다. 같은 날은 재호출하지 않는다(`--force`로 강제).
- `load_config()`는 `settings.yaml`의 수동 `entities`와 `entities_auto.yaml`의 `use: true` 작품을 합친다.
- 한계: 이 표는 주로 드라마만 다룬다. 예능·영화는 빠질 수 있으므로 필요하면 수동 `entities`로 추가한다.
- CLI: `python -m shortube entities`

---

## 4. 모듈 1: 트렌드 관심도 수집 (`collectors/trends.py`)

### 4-1. 네이버 DataLab 검색어트렌드
- 엔드포인트: `POST https://openapi.naver.com/v1/datalab/search`
- 헤더: `X-Naver-Client-Id`, `X-Naver-Client-Secret`, `Content-Type: application/json`
- 바디: `startDate`, `endDate`(YYYY-MM-DD), `timeUnit`(`date`|`week`|`month`), `keywordGroups`(`[{groupName, keywords:[...]}]`, **요청당 최대 5그룹**)
- 응답의 `ratio`는 **요청 안에서의 상대값(최대 100)**이다. 요청이 달라지면 값끼리 직접 비교할 수 없다.
  - 해결: 모든 요청에 **고정 기준 키워드 1개**(예: "날씨")를 항상 한 그룹으로 포함시켜 정규화한다. 기준 키워드 비율로 나눠서 `relative_to_anchor`를 저장.
- 기본 조회기간: 최근 90일, `timeUnit=date`. 설정으로 변경 가능.
- 호출 한도(일 1,000회)를 넘지 않도록 배치로 묶고, 호출 수를 로그에 남긴다.

### 4-2. 구글 트렌드 (지역: KR)
- `pytrends`의 `TrendReq(hl='ko-KR', tz=-540)`, `geo='KR'`, `timeframe='today 3-m'`
- `interest_over_time()`과 `related_queries()`(top / rising) 수집
- 비공식이라 **429 차단이 잦다**: 요청 간 5~10초 랜덤 대기, 지수 백오프 재시도, 실패해도 전체 파이프라인은 멈추지 않고 해당 키워드를 `trends_google=NULL`로 표시.
- 여기서도 5개 키워드/요청 제한과 상대값 문제가 있으므로 같은 기준 키워드 정규화를 적용.
- pytrends는 2025-04 저장소가 아카이브되어 유지보수되지 않는다. 실패를 정상 경로로 취급하고, 공식 Google Trends API(알파, 신청제) 승인 시 어댑터만 교체한다.

### 4-2b. 위키백과 조회수 (Wikimedia REST API)
- 문서별 일간 조회수: `GET https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/ko.wikipedia/all-access/user/{문서명}/daily/{시작}/{끝}`
- 많이 본 문서: `GET https://wikimedia.org/api/rest_v1/metrics/pageviews/top/ko.wikipedia/all-access/{YYYY}/{MM}/{DD}` → 주제 발굴용. 인물 문서는 제외 필터 적용
- 키 불필요, User-Agent에 연락처 명시. 절대 수치라 앵커 정규화 불필요(점수 계산 시 min-max만)
- `source=wiki`로 `trend_points`에 저장

### 4-3. 저장 스키마
```
trend_points(keyword, source[naver|google|wiki], date, ratio_raw, ratio_norm, fetched_at)
related_queries(keyword, source, kind[top|rising], query, value, fetched_at)
```

### 4-4. 요약 지표 (키워드당)
- `avg_interest`: 기간 평균 (정규화 값)
- `recent_vs_prev`: 최근 7일 평균 / 직전 7일 평균 (급상승 여부)
- `spike_flag`: `recent_vs_prev >= 2.0`

---

## 5. 모듈 2: 유튜브 자동완성 수집 (`collectors/autocomplete.py`)

- 비공식 엔드포인트: `GET https://suggestqueries.google.com/complete/search`
  - 파라미터: `client=firefox`, `ds=yt`, `hl=ko`, `gl=kr`, `q=<키워드>`
  - 응답은 JSON: `[질의, [제안어, ...]]`
- 비공식이므로 형식이 바뀔 수 있다. 파싱 실패 시 원문을 로그에 남기고 해당 키워드는 건너뛴다.
- **확장 수집**: 시드 뒤에 공백 + 한글 초성/자음(ㄱ~ㅎ) 또는 `a~z`를 붙여 롱테일 제안어를 확장(옵션 `--expand`). 요청 간 0.5~1초 대기.
- 결과 저장: `autocomplete(seed, suggestion, rank, fetched_at)`
- 정제:
  - 중복 제거, 시드와 동일한 항목 제거
  - 의도 분류 태그(간단 규칙): `결말/근황/나이/프로필/논란/순위/이유/방법` 등 접미어 매칭
  - **리스크 필터**: `근황, 논란, 열애, 결혼, 이혼, 사망, 폭로, 의혹` 등이 포함되면 `risk=true`로 표시하고 **후보에서 제외**(`excluded_reason=risk`)한다. 제외된 키워드는 리포트 부록 "제외 목록"에만 남긴다. 사전은 `config/settings.yaml`에서 관리.
  - 미성년자·사고/재난 피해자·범죄 사건 관련, 의료·투자·법률 조언형(`~하면 낫는다`, `~사면 오른다`) 키워드도 같은 방식으로 제외.

---

## 6. 모듈 3: 경쟁 쇼츠 분석 (`collectors/shorts.py` + `analysis/title_patterns.py`)

### 6-1. 수집 (YouTube Data API v3)
- `search.list`: `part=snippet`, `type=video`, `regionCode=KR`, `relevanceLanguage=ko`, `order=viewCount`, `publishedAfter=<최근 N일>`, `videoDuration=short`(4분 미만), `maxResults=50`
  - **쿼터 주의**: `search.list` 1회 = 100 units, 기본 일일 쿼터 10,000 → **하루 약 100회 검색이 한계**. 키워드 수를 제한(`--top 30` 등)하고, 쿼터 사용량을 실행 로그에 출력한다. 이미 수집한 (키워드, 날짜)는 캐시.
- `videos.list`(`part=contentDetails,statistics,snippet`, 50개씩 배치, 1 unit): 길이, 조회수, 좋아요, 댓글 수, 게시 시각, 태그
- `channels.list`(`part=statistics`): 구독자 수 (채널당 1회 캐시)
- **쇼츠 판별**: 공식 플래그가 없다. `duration <= 180초`(현재 쇼츠 최대 길이)를 1차 기준으로 쓰고, 설정(`shorts_max_seconds`)으로 조정 가능하게 한다. 제목/설명에 `#shorts`가 있으면 보조 신호로 기록.
- 저장: `videos(video_id, keyword, title, channel_id, published_at, duration_s, views, likes, comments, tags, fetched_at)`, `channels(channel_id, title, subscribers, fetched_at)`
- **보관 기한 30일**(YouTube API 개발자 정책의 저장 제한): `fetched_at` 기준 30일이 지난 행은 재조회하거나 삭제한다. `python -m shortube prune` 명령으로 실행하고, `run-all` 시작 시 자동 실행.
- 경쟁 쇼츠 데이터는 **내부 분석 전용**이다. 외부 공유·재게시하지 않는다.

### 6-2. 성과 지표 (영상당)
- `views_per_day = views / max(경과일, 1)`
- `views_per_sub = views / max(구독자, 1)` → **작은 채널이 터뜨린 영상**을 찾는 핵심 지표 (신규 채널이 따라 할 수 있다는 신호)
- `outlier_flag`: `views_per_sub >= 5` 이고 구독자 `< 50,000`

### 6-3. 제목 패턴 분석 (`title_patterns.py`)
영상 제목에서 아래 특징을 추출해 컬럼으로 저장하고, 특징별 평균 `views_per_day`, 중앙값, 표본 수를 비교한다.

| 특징 | 추출 방법 |
|---|---|
| 제목 길이 | 글자 수 (구간: ~15 / 16~25 / 26+) |
| 숫자 포함 | `\d+`, "N가지", "TOP N" |
| 의문형 | `?`, "왜", "~일까", "~인 이유" |
| 대괄호/기호 | `[]`, `【】`, `|`, `...`, `!` |
| 훅 단어 | 사전 기반: `충격, 소름, 레전드, 실화, 반전, 결국, 이유, 근황, 진짜` 등 (사전은 `config/settings.yaml`) |
| 고유명사 포함 | 시드 `entities` 매칭 |
| 시점 표현 | `오늘, 어제, 방금, 최신, 2026` |
| 해시태그 | `#shorts`, 제목 내 `#` 개수 |
| 영상 길이 구간 | ~15s / 16~30s / 31~60s / 61~180s |

- 한국어 형태소 분석은 1차에서는 **쓰지 않는다**(정규식·사전 기반으로 시작). 필요해지면 `kiwipiepy` 도입을 제안할 것.
- 표본이 작으면(그룹당 < 10) 통계 비교에 "표본 부족" 표시.
- 훅 단어 통계 아래에 고정 경고: "훅 단어는 실제 내용과 일치할 때만 사용한다(내용과 무관한 자극 제목은 YouTube 스팸 정책 위반)."

---

## 7. 종합 점수 및 리포트 (`analysis/scoring.py`, `report.py`)

### 7-1. 키워드 점수 (0~100, 가중치는 settings.yaml에서 조정)
```
score = 0.30 * interest_norm        # 트렌드 평균 관심도 (네이버/구글/위키 평균, 0~100 스케일)
      + 0.15 * momentum_norm        # recent_vs_prev
      + 0.20 * demand_norm          # 자동완성 제안어 수/순위 (수요 신호)
      + 0.15 * opportunity_norm     # 상위 쇼츠 중 outlier(작은 채널 성공) 비율
      + 0.20 * source_availability  # 출처 확보 가능성 (아래)
```
- 각 항목은 후보 전체 내 min-max 정규화(0~100). 결측 소스는 가중치를 재분배.
- 리스크 키워드는 점수 계산 전에 이미 제외된다(5장).

### 7-1b. 출처 확보 가능성 (`source_availability`, 0~100)
- 한국어 위키백과에 해당 주제 문서가 있다: +30
- 공공·공식 출처(정부, 공공기관, 학회, 기업 공식 발표, 공식 차트 사이트)에서 1건 이상 확인된다: +40
- 서로 독립적인 출처가 2개 이상이다: +30
- **60 미만이면 점수와 상관없이 "출처 부족 — 제작 보류"**로 표시.
- 이 단계에서는 검색 결과의 URL·제목만 저장하고 본문은 저장하지 않는다.
- 나무위키, 유료 기사, 커뮤니티 글은 출처로 세지 않는다(`config/sources.yaml`의 `blocked_domains`).

### 7-2. 산출물
- `output/keywords_scored.csv`: keyword, category, score, 각 하위 지표, source_availability, spike_flag
- `output/topics_shortlist.csv`: keyword, category, score, source_availability, 추천 출처 URL 3개, 제외 사유(있으면)
- `output/competitor_shorts.csv`: 키워드별 상위 쇼츠 목록 (제목, 채널, 조회수, views_per_sub, URL) — 파일 첫 줄에 "내부 분석 전용, 외부 공유 금지" 주석
- `output/report_YYYYMMDD.md`:
  1. 요약: 상위 10 키워드 + 한 줄 근거
  2. 카테고리별 비교 (차트/해설/연표/잡학 중 어디가 유리한가)
  3. 제목 패턴 표 (특징별 평균 조회수/일, 표본 수)
  4. 작은 채널 성공 사례(outlier) 목록 — 벤치마킹용
  5. 출처 부족으로 보류된 주제
  6. 데이터 한계 (정규화 방식, 쇼츠 판별 기준, 쿼터)
  7. 부록: 리스크로 제외된 키워드 목록과 제외 사유
- 리포트 고정 문구(COMPLIANCE_GUIDE.md 9장): 점수는 조회수를 보장하지 않음 / 리스크 키워드 제외됨 / 경쟁 쇼츠 데이터는 내부용 / 훅 단어는 내용과 일치할 때만

---

## 7-3. 일일 주제 로테이션 (`analysis/planner.py`, 스킬 `shortube-daily`)

하루 1~2편 기준. 완전 랜덤이 아니라 **고정 카테고리 + 가중치 랜덤 + 규칙**으로 고른다.
- 이유: 쇼츠 피드는 영상마다 따로 시청자 테스트를 해서 주제를 섞어도 손해가 작지만, 구독 전환·채널 정체성을 위해 2~3개 축은 유지한다. 같은 틀만 반복하면 YouTube "inauthentic content" 판정 위험이 있어 섞는다.
- 가중치(`settings.yaml` `rotation.weights`): 상식 0.5 / 신작 OTT 정보 0.3 / 차트 0.2. 약 30편 성과가 쌓이면 카테고리별 조회수 중앙값으로 조정(최소 0.1은 남겨 탐색 유지).
- 규칙: 같은 카테고리 최대 2연속, 같은 날 두 슬롯은 다른 카테고리, 차트 주 2회 상한, 키워드 60일·작품 3일 쿨다운, 후보 없는 카테고리 제외, 작품형은 최신 공개작 우선, 같은 날 재실행 시 같은 결과(날짜 시드).
- 카테고리 안에서는 시드 자체(포괄적)는 제외하고 자동완성의 구체 주제만, 작품형은 한 작품의 사실형 의도를 한 영상에 묶는다.
- CLI: `pick --count N [--json]`(선정만) → 검수·제작 후 `log-topic`(이력 기록).
- 실존 인물명·채널명·포괄 주제 등 코드로 못 거르는 것은 스킬 단계에서 Claude가 shortlist를 위에서부터 걸러 첫 통과 항목을 쓴다. 사용자에게 주제를 묻지 않는다.

---

## 8. 범위 밖 (후속 단계, 지금 만들지 말 것)

- 급상승 트렌드 상시 수집(스케줄러)
- 대본 생성·렌더링 → COMPLIANCE_GUIDE.md 4장 방법론(사실 카드 → 대본 → 유사도 검사 → 텍스트·차트 렌더링)으로 **별도 Phase 7~11**에서 진행
- 자동 공개 업로드는 하지 않는다. API 업로드는 `private`만, 공개는 사람이 수동으로
- 이미지/영상 소재 수집·생성 (계속 범위 밖)
- 유튜브 스튜디오 지표(시청 지속률, 첫 3초 이탈) 연동 — 업로드 후 단계

---

## 9. 구현 순서 (Phase)

1. **Phase 0 — 뼈대**: 폴더 구조, `requirements.txt`, `.env.example`, `.gitignore`, CLI 스켈레톤, SQLite 스키마, 설정 로더
2. **Phase 1a — 최근 OTT 작품 수집** (키 불필요): 모듈 1a (3-1)
3. **Phase 1 — 자동완성** (키 불필요): 모듈 2 구현 + 테스트. 여기서 `risk` 태그, 의도 분류 완성. `--expand`는 초성(ㄱ~ㅎ 14개)만, 제안어는 시드의 카테고리를 상속
3. **Phase 2 — 구글 트렌드 + 위키 조회수** (키 불필요): 모듈 1-2, 4-2b. 429 대응, 정규화 확인
4. **Phase 3 — 네이버 DataLab**: 키 필요. 모듈 1-1 + 앵커 정규화
5. **Phase 4 — 경쟁 쇼츠**: 키 필요. 쿼터 카운터, 캐시, 성과 지표
6. **Phase 5 — 제목 패턴 + 점수(`source_availability` 포함) + 리포트**
7. **Phase 6 — `run-all` 통합, `prune`, README, 실제 시드로 1회 시험 실행**

Phase 7~11(출처 수집·사실 카드·대본·렌더링·검수 대기열)은 COMPLIANCE_GUIDE.md 6장을 따른다.

각 Phase 끝에 사용자에게 결과를 요약하고 확인받은 뒤 다음으로 넘어간다.

---

## 10. 완료 기준 (Acceptance Criteria)

- [ ] `python -m shortube run-all` 한 번으로 CSV 2개 + 리포트 1개가 `output/`에 생성된다
- [ ] 키가 없는 소스는 건너뛰고, 어떤 소스가 빠졌는지 리포트 "데이터 한계"에 명시된다
- [ ] 같은 날 재실행 시 이미 수집한 데이터는 API를 다시 호출하지 않는다
- [ ] YouTube API 쿼터 사용량과 네이버 호출 수가 실행 로그에 출력된다
- [ ] 외부 호출 실패(429, 형식 변경)가 전체 실행을 중단시키지 않는다
- [ ] 핵심 로직(제목 특징 추출, 정규화, 점수 계산, 자동완성 파싱)에 단위 테스트가 있다 (네트워크는 mock)
- [ ] `.env`, `data/`, `output/`이 git에 올라가지 않는다
- [ ] README에 키 발급 방법과 실행 예시가 있다
- [ ] 인물(`entity_type=person`)·리스크 키워드가 후보·점수표에 나오지 않고 부록 제외 목록에만 있다
- [ ] 30일 지난 YouTube API 데이터가 `prune`으로 정리된다
- [ ] 리스크 필터와 `source_availability` 계산에 단위 테스트가 있다
- [ ] COMPLIANCE_GUIDE.md 1-1 금지 항목을 구현한 기능이 없다

---

## 11. 구현 시 주의 / 리스크

- **비공식 소스**(pytrends, 자동완성 엔드포인트)는 언제든 막히거나 바뀔 수 있다. 어댑터 함수로 격리해서 교체하기 쉽게 만든다.
- **상대값 비교**: DataLab/구글 트렌드의 수치는 요청 간 직접 비교가 불가능하다. 앵커 키워드 정규화를 빼먹지 말 것.
- **쿼터**: YouTube `search.list`가 가장 비싸다. 키워드를 무작정 늘리지 말고 자동완성·트렌드 점수 상위부터 검색한다.
- **서비스 약관**: 수집은 공식 API 또는 공개 제안어 엔드포인트의 합리적 호출 수준으로 제한하고, 요청 간 대기를 지킨다.
- **연예인·논란 키워드**: 후보에서 제외한다. 사실 보도가 있어도 개인 대상 콘텐츠는 만들지 않는다.
- **데이터 보관**: YouTube API 데이터 30일 제한. 웹 원문은 수집하지 않는다(본문 수집은 Phase 8에서 COMPLIANCE_GUIDE.md 4-2 규칙으로).
- 점수는 **참고용 순위**다. 최종 주제 선택은 사람이 한다. 리포트에 "이 점수는 검색·경쟁 데이터 기반 추정이며 조회수를 보장하지 않는다"를 명시한다.

---

## 12. Claude Code 시작 프롬프트 (복사해서 사용)

```
D:\youtube\shortube의 SPEC.md와 COMPLIANCE_GUIDE.md를 읽고 Phase 0부터 진행해줘.
- 0장 체크리스트에서 내가 해줘야 할 것(키 발급 등)을 먼저 정리해서 알려줘.
- 각 Phase가 끝나면 결과를 요약하고 내 확인을 받은 뒤 다음으로 넘어가.
- 모호한 부분은 임의로 정하지 말고 물어봐.
```
