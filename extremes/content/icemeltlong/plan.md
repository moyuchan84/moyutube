# If ALL the Ice Melted (롱폼) — 얼음이 다 녹으면 바다는 얼마나 오를까

- 소재 한 줄: 육지의 모든 얼음이 녹으면 해수면은 약 70 m 오른다. 그 얼음이 어디에 얼마나 있고, 70 m 가 어느 정도이며, 얼마나 걸리고, 이번 세기에는 실제로 무엇이 일어나는지를 4~5분에 보여 준다.
- 왜 롱폼: `npm run seo` 2026-11-21 — "what if all the ice melted" 중앙값 105만, 1위 2,648만(2015 롱폼) · 2위 1,197만(2017) · 3위 758만(2016). 상위가 대부분 롱폼이고 **검색으로 오래 들어오는 상시 소재**다. 쇼츠 피드(Extremes 유입 94%)와 달리 검색 유입을 만든다.
- 짝 쇼츠: 이미 렌더한 26초 `icemelt`(WHAT IF ①)를 이 롱폼의 예고 쇼츠로 쓴다 (쇼츠 → 롱폼 링크는 업로드 때 "관련 동영상" 지정).
- 형식: 가로 1920×1080, 내레이션(영어) + 한국어 자막, 코드 그래픽 + 공공 도메인 사진. 기존 롱폼 `speed` 의 엔진(`Long.tsx`)을 쓴다. **단, `Long.tsx` 의 장면 종류(wall · ladder · solar 등)는 speed 전용이라 이 편에 필요한 장면은 새로 추가해야 한다** (아래 "만들 일").
- 길이 목표: 4~5분 (약 600~700 단어 영어 내레이션).
- 차별점: 상위 영상들은 침수 지도가 중심이다. 이 편은 **"왜 70 m 인가 → 얼마나 걸리나 → 이번 세기엔 얼마인가"** 의 순서로 오해(공포 낚시)를 바로잡는다. 침수 지도는 고도 데이터 제작과 정확성 위험 때문에 만들지 않는다.

## 구성 (6 챕터, 영상 안에 챕터 표시)

| # | 챕터 | 초(목표) | 핵심 한 줄 | 화면 | 필요한 사실 |
|---|---|---:|---|---|---|
| 1 | 훅 | 0:00~0:25 | "Every piece of ice on land, gone. How high would the sea rise?" | 남극 사진 → 70 m 막대 | f1 |
| 2 | 얼음은 어디에 있나 | 0:25~1:25 | 남극 약 60 m · 그린란드 약 6.5~7.4 m · 산악 빙하는 아주 조금 | 막대 3개 쌓기 · 그린란드 위성 사진 | f2 · f6(미확인) |
| 3 | 바다 위 얼음은 왜 안 세나 | 1:25~2:00 | 이미 떠 있는 얼음은 녹아도 거의 안 올린다 (컵 속 얼음) | 컵 그래픽(코드) | f7(미확인) |
| 4 | 70 m 는 어느 정도? | 2:00~2:50 | 자유의 여신상 93 m 의 약 4분의 3 | 건물 실루엣에 물 높이 선 | f3 |
| 5 | 얼마나 걸리나 | 2:50~3:50 | 그린란드 전체는 천 년 단위, 남극은 더 오래 · 2100년까지 약 1 m(최대 2 m) · 2300년 최대 5 m | 연도 눈금 그래픽 | f4 · f8 |
| 6 | 그래서 | 3:50~4:30 | "70 m 는 먼 미래, 이번 세기의 1 m 도 해안에는 큰 문제" · 질문 | 끝 카드 + 다음 편 예고 | f8 · f9(미확인) |

- 훅(첫 5초): 남극 사진 + "ALL the ice" 질문. 제목 · 썸네일에 답(70 m)을 쓰지 않는다.
- 끝 카드: 이유가 붙은 구독 한 줄 + 댓글 질문 하나 ("당신 도시는 몇 m 에서 잠길까?"). 한 편에 부탁은 하나만.

## 출처 (2026-11-21, 원문을 읽은 것)
| # | 기관 | 문서 | URL |
|---|---|---|---|
| 1 | USGS | How would sea level change if all glaciers melted? | https://www.usgs.gov/faqs/how-would-sea-level-change-if-all-glaciers-melted |
| 2 | USGS Water Science School | Sea level and climate | https://www.usgs.gov/water-science-school/science/sea-level-and-climate |
| 3 | NSIDC | Why ice sheets matter | https://nsidc.org/learn/parts-cryosphere/ice-sheets/why-ice-sheets-matter |
| 4 | NASA Science | Greenland 빙상 전부 녹는 시간 | https://science.nasa.gov/earth/oceans/study-predicts-more-long-term-sea-level-rise-from-greenland-ice |
| 5 | NASA Sea Level Change | 그린란드 · 남극 전망 FAQ | https://sealevel.nasa.gov/faq/11/how-much-rise-should-we-expect-from-greenland-and-antarctica |
| 6 | National Park Service | Statue of Liberty statistics | https://home.nps.gov/stli/learn/historyculture/statue-statistics.htm |

## 사실 카드
짝 쇼츠 `icemelt/plan.md` 의 f1~f4 와 같다 (확인 완료). 이 편에서 더 필요한 것:

```yaml
- id: f1   # 확인됨
  claim: 모든 빙하·얼음이 녹으면 해수면 약 70 m (약 230 ft), 부피 불확실성 있음 — USGS
  sources: [1]
  verified: true
- id: f2   # 확인됨 (부분)
  claim: 그린란드 USGS 약 6.5 m · NSIDC 약 7.4 m, 남극 전체 NSIDC 약 60 m, 둘 합쳐 65 m 이상
  sources: [2, 3]
  verified: true
- id: f3   # 확인됨
  claim: 자유의 여신상 지면에서 횃불 끝 305'1" (약 92.99 m)
  sources: [6]
  verified: true
- id: f4   # 확인됨
  claim: NASA — 감축 없이 그린란드 빙상 전체가 "likely … in a millennium"; NSIDC — "could melt by the year 3000"
  sources: [4, 3]
  verified: true
- id: f5   # 확인됨
  claim: NASA — 2100년까지 약 1 m (최대 2 m), 2300년 최대 5 m (그린란드 · 남극 기여)
  sources: [5]
  verified: true   # 단, 이 숫자는 "그린란드 · 남극 기여분" 이라고 NASA 가 쓴 것. 전체 해수면 상승으로 단정하지 않는다
- id: f6   # 확인 필요
  claim: 산악 빙하 · 빙모가 녹을 때 상승분 (대략 0.3~0.6 m 로 알려짐 — 쓰기 전에 NSIDC · USGS · IPCC 에서 원문 확인)
  verified: false
- id: f7   # 확인 필요
  claim: 바다에 떠 있는 얼음(해빙 · 빙붕)은 녹아도 해수면을 거의 올리지 않는다 (NSIDC 또는 NOAA 설명 원문 확인)
  verified: false
- id: f8   # 확인 필요
  claim: 2100년 해수면 전망 — NOAA 2022 기술 보고서 또는 IPCC AR6 의 수치와 시나리오를 원문으로 확인한 뒤 쓴다
  verified: false
- id: f9   # 확인 필요
  claim: 현재 해수면 상승 속도 (NASA 위성 관측, 연 몇 mm) — 원문 확인
  verified: false
```

- **쓰지 않는 것**: "216 ft"(내셔널지오그래픽 숫자), USGS 표의 동남극 65 m(원문 못 읽음), 특정 도시가 몇 m 에서 잠긴다는 숫자(고도 데이터 없이 쓰지 않는다), 사람 사진.

## 사진 · 그래픽
- 사진(공공 도메인, 이미 받음): `icemelt/art/wikimedia-50e25275.jpg`(남극 상공) · `wikimedia-2bfe8c2f.jpg`(그린란드 위성). 롱폼에는 더 필요하다 → `npm run collect -- icemeltlong "Antarctica ice shelf" --dry` 등으로 후보 확인 후 받기 (이 편 폴더에 받는다).
- 코드 그래픽: 쌓는 막대 · 컵 속 얼음 · 건물 실루엣 + 물 높이 선 · 연도 눈금 (**새 장면 종류 필요**).
- 모형(단순화)은 화면에 "Model" 로 표시한다.

## 음성 · 비용 (사용자 결정 필요)
- 롱폼은 내레이션 음성(Gemini TTS) 이 필요하다. `speed` 편이 쓴 방식과 같다 (`extremes/video/scripts/voice.mjs`, 음색은 그 편 설정을 따른다).
- **음성 생성은 유료 호출이다.** 사용자가 "API 로 만들어 줘" 할 때만 실행한다. 지금은 대본까지만 쓰고 `jobs` 로 점검만 한다.

## 만들 일 (이 순서)
1. 사실 카드 f6~f9 를 원문으로 확인.
2. 영어 대본 작성 (600~700 단어) + 한국어 자막 → `script/shots.json` 의 lines · scenes.
3. 사진 후보 확인(`--dry`) → 받기 → 눈으로 고르기.
4. `Long.tsx` 에 새 장면 종류 추가: 쌓는 막대 · 컵 · 물 높이 선 · 연도 눈금.
5. BGM: 이 편은 4~5분이라 곡을 새로 짓는다 (`bgm/icemeltlong.mjs`).
6. (사용자 승인 후) 음성 생성 → 타이밍 → 렌더 → 스틸 점검.
7. yt-seo 제목 · 설명 · 챕터 → 업로드 (사용자 확인 후).

## 검수
- [ ] f6~f9 원문 확인, 숫자는 사실 카드에 있는 것만
- [ ] "전부 녹는다" 는 가정이고 수백~수천 년이라는 말이 반드시 들어감 (공포 낚시 금지)
- [ ] 제목 · 썸네일에 답(70 m) 없음
- [ ] 사진 라이선스 · credits.json · 설명란 [사진 출처]
- [ ] 쇼츠 `icemelt` 와 같은 사실 · 같은 표현
