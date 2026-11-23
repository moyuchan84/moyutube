# 지구의 얼음이 전부 녹으면 해수면은 얼마나 오를까 (What If ①)

- 소재 한 줄: 육지의 모든 빙하·얼음이 녹으면 해수면은 약 70 m 오른다(USGS) — 그린란드 약 6.5~7.4 m, 남극 약 60 m. 자유의 여신상(93 m)의 약 4분의 3. 하지만 다 녹는 데는 수백~수천 년이 걸린다(NASA · NSIDC).
- 왜 이 소재: `npm run trends` 2026-11-21 — "What If All the Ice Melted" 형식이 작은 채널에서 하루 만에 12K~32K(구독 247~1.3K). 지도·그래픽으로 만들 수 있어 사진 의존이 낮다. 연중 검색이 있어 **시기와 무관한 상시 소재**.
- 형식: 질문형 + 숫자 하나 + 여신상 높이 비교. 침수 지도는 만들지 않는다 — 고도 데이터 제작이 크고 틀릴 위험이 크다.
- **중요한 사실 발견**: 인터넷에 도는 "216 피트(약 65 m)"는 내셔널지오그래픽 숫자다. USGS FAQ 는 **약 70 m(약 230 ft)** 이고 NSIDC 도 "65 m 이상" 으로 같은 범위다(원문 확인). 영상은 "~70 m (USGS)" 로 쓴다.
- 시리즈: WHAT IF ① (다음 편은 따로 정한다).

## 출처 (확인일 2026-11-21, 원문 페이지를 직접 읽음)
| # | 기관/사이트 | 문서 | URL | 확인 |
|---|---|---|---|---|
| 1 | USGS | How would sea level change if all glaciers melted? — "approximately 70 meters (approximately 230 feet)", 부피 불확실성 명시 · 2026-04-16 갱신 | https://www.usgs.gov/faqs/how-would-sea-level-change-if-all-glaciers-melted | 읽음 |
| 2 | USGS Water Science School | Sea level and climate — 그린란드 약 6.5 m, 서남극 약 8 m · 2026-09-17 | https://www.usgs.gov/water-science-school/science/sea-level-and-climate | 읽음 |
| 3 | NSIDC | Why ice sheets matter — 그린란드 약 7.4 m, 남극 약 60 m, 둘 다 65 m 이상 | https://nsidc.org/learn/parts-cryosphere/ice-sheets/why-ice-sheets-matter | 읽음 |
| 4 | NASA Science | Greenland 빙상 전부 녹는 데 "likely … in a millennium" (2019, 2024-10 갱신) | https://science.nasa.gov/earth/oceans/study-predicts-more-long-term-sea-level-rise-from-greenland-ice | 읽음 |
| 5 | NASA Sea Level Change | 2100년까지 약 1 m(최대 2 m), 2300년 최대 5 m | https://sealevel.nasa.gov/faq/11/how-much-rise-should-we-expect-from-greenland-and-antarctica | 읽음 |
| 6 | National Park Service | Statue of Liberty statistics — 지면에서 횃불 끝 305'1" (92.99 m) · 2024-12-30 | https://home.nps.gov/stli/learn/historyculture/statue-statistics.htm | 읽음 |
| - | USGS Fact Sheet 002-00 | 동남극 64.80 m · 서남극 8.06 m · 그린란드 6.55 m 표 — 페이지 403, 검색 요약에서만 봄 | https://pubs.usgs.gov/fs/fs2-00/ | **읽지 못함 → 쓰지 않음** |

## 사실 카드
```yaml
- id: f1
  claim: 모든 빙하 · 빙모 · 얼음이 녹을 때 전 지구 해수면 상승
  value: 약 70 m (약 230 ft) — USGS FAQ. 부피에 불확실성이 있다고 USGS 가 명시. 다른 곳은 80~90 m 로 쓰기도 한다(옛 보고서).
  note: 화면 "~70 m (USGS)" + 작은 글씨 "estimates vary". 80 m 이상은 쓰지 않는다.
  sources: [1]
  verified: true   # USGS 한 곳 + NSIDC 가 "65 m 이상" 으로 같은 범위. 두 번째 출처는 3
- id: f2
  claim: 얼음 덩어리별 상승분
  value: USGS — 그린란드 약 6.5 m, 서남극 약 8 m. NSIDC — 그린란드 약 7.4 m, 남극 전체 약 60 m, 둘 합쳐 65 m 이상.
  note: 두 기관 값이 다르다(6.5 vs 7.4). 화면은 "Greenland ~6.5–7.4 m · Antarctica ~60 m" 처럼 범위 + 두 출처 표기. 동남극만의 값(65 m)은 읽지 못해 쓰지 않는다.
  sources: [2, 3]
  verified: true
- id: f3
  claim: 자유의 여신상 높이
  value: 지면에서 횃불 끝 305'1" (약 92.99 m), 받침대 윗면에서 횃불 끝 151'1" (약 46.05 m) — NPS
  note: 비교는 "지면에서 횃불 끝 93 m" 로. 70 m ÷ 93 m ≈ 75% (자체 계산) → "여신상 높이의 약 4분의 3". 라벨을 정확히 쓴다.
  sources: [6]
  verified: true
- id: f4
  claim: 전부 녹는 건 우리 생애에 일어날 일이 아니다
  value: NASA — 감축 없이도 그린란드 빙상 전체가 녹는 데 "likely … a millennium". NSIDC — 근시일 내 일어날 가능성 낮고 "could melt by the year 3000" (현재 배출 가정). NASA — 2100년까지 약 1 m(최대 2 m).
  note: 화면 "Full melt: centuries to millennia, not decades". 현실 수치 "by 2100: about 1 m (up to 2 m)" 를 쓸 때는 NASA 페이지 원문 표현 그대로.
  sources: [4, 5, 3]
  verified: true
- id: f5
  claim: "216 ft(약 65 m)" 는 내셔널지오그래픽 숫자이고 USGS 값이 아니다
  verified: true
  note: 영상에 쓰지 않는 이유(내부 메모).
```

## 샷 계획 (24초, script/shots.json)
| 시간 | 장면 | 한국어 | English | 움직임 |
|---|---|---|---|---|
| 0~3 | 빙하 사진(NASA/NOAA, 공공 도메인) 위에 질문 | 지구의 얼음이 전부 녹으면? | What if ALL the ice on Earth melted? | 켄 번즈 |
| 3~8 | 바다 높이 막대가 위로 올라가는 코드 그래픽 | 해수면이 약 70 m 오른다 (USGS) | Sea level would rise ~70 m (USGS) | 막대 상승 + 카운트업 |
| 8~14 | 그린란드 · 남극 막대(쌓기) | 그린란드 약 6.5~7.4 m · 남극 약 60 m | Greenland ~6.5–7.4 m · Antarctica ~60 m | 쌓아 올리는 막대 |
| 14~19 | 자유의 여신상 실루엣(코드) 옆에 70 m 선 | 여신상(93 m) 높이의 약 4분의 3 | About three-quarters of the Statue of Liberty (93 m) | 물 높이 선이 올라옴 |
| 19~22 | 자막 한 줄 | 다 녹는 데는 수백~수천 년이 걸린다 | Full melt: centuries to millennia, not decades | 정지 |
| 22~24 | 끝 카드 | 다음 What If 도 구독하고 이어서 보기 / 가장 먼저 잠길 도시는? | Next What If… / Which city goes first? | 첫 장면 이어 붙임 |
- 부가가치 요소: 얼음 덩어리별 해수면 상승을 쌓아 올리는 막대 + 여신상 높이 비교, 모두 코드 그래픽.
- 침수 지도는 만들지 않는다(고도 데이터 · 정확성 위험).
- 사진: NASA Earth Observatory, NOAA 빙하 사진, 공공 도메인 위주. 사람 얼굴 없는 것. 여신상은 사진 대신 실루엣 그래픽(저작권 · 브랜드 이슈 회피).

## 연출 카드
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 흰 얼음 + 짙은 파랑 | 아래 막대 그래프, 위 사진 | 물이 차오르는 전환 | 막대 따라 위로 팬 | 바다 높이 막대 | 영어 크게 | 4초 샷 |

## 제목(한·영) — yt-seo 필요
- 후보: `If ALL the Ice Melted: How High Would the Sea Rise? | 얼음이 다 녹으면` (답 쓰지 않음)
- **TODO**: `npm run seo -- extremes icemelt "what if all the ice melted"`.

## 검수
- [x] f1~f4 를 USGS · NSIDC · NASA · NPS 원문으로 확인 (2026-11-21). USGS Fact Sheet 002-00 표는 403 으로 못 읽어 쓰지 않음
- [ ] 화면에는 "Greenland ~6.5–7.4 m" 처럼 두 기관 값을 범위로, 출처 표기
- [ ] 사진 라이선스 · credits.json
- [ ] 업로드: 가장 먼저(상시 소재), 사용자 확인 후

## 제작 기록 (2026-11-21)
- 사진 2장: wikimedia-50e25275.jpg (NASA / Christy Hansen, 공공 도메인) · wikimedia-2bfe8c2f.jpg (NASA Earth Observatory, 공공 도메인). 나머지 4장(CC BY 2.0 포함)은 art/ 에 받았지만 쓰지 않았다 — 쓰지 않으면 설명란 출처에도 넣지 않는다.
- 샷은 기존 `card` + `bars` 로 만들었다 (새 샷 종류 없음). 막대 글자가 사진 위에서 안 읽혀 그린란드 샷을 사진(2.6초)과 막대 카드(3초)로 나눴다.
- BGM: `video/scripts/bgm/icemelt.mjs` (72bpm, Dm7–Bbmaj7–Fmaj7–Csus, 효과음 없음). **소리는 Claude 가 못 듣는다 → 사람이 한 번 들어 본다.**
- 렌더: `extremes/output/videos/2026-11-21_icemelt.mp4` (26.6초, 17.8 MB). 업로드 전.
- 끝 카드 "다음: 12월의 유성우" 는 geminids 를 실제로 만들어야 하는 약속이다 (규칙).
