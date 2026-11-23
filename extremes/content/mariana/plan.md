# Mariana Trench: 에베레스트를 빠뜨려도 2,086 m 가 남는다 (Extremes No.1, 시범)

- 소재 한 줄: 에베레스트를 챌린저 해연에 세워도 정상 위로 약 2 km 의 물이 남는다.
- 왜 이 소재: 한국어 검색 "마리아나 해구" 상위 25개 조회 중앙값 255,772 · 최근 60일 새 영상 4개 (yt-seo, 2026-11-10). 영어 쪽 수요는 더 큼 ([docs/new-channel-plan.md](../../../docs/new-channel-plan.md) 6-1).
- 형식: 한 곳 + 숫자 하나 + 반전 (비교 그래픽이 부가가치).

## 출처 (확인일 2026-11-10)
| # | 기관/사이트 | 문서 | URL |
|---|---|---|---|
| 1 | NOAA (PMEL) · Dziak 외 | 챌린저 해연 수심 측정 (10,935 m ± 6 m, 2021) | https://www.pmel.noaa.gov/pubs/PDF/dzia4367/dzia4367.pdf |
| 2 | NOAA Library | 같은 연구 자료 | https://repository.library.noaa.gov/view/noaa/33477 |
| 3 | Associated Press (2020-12-08) | 중국 · 네팔, 에베레스트 8,848.86 m 공동 발표 | https://www.washingtontimes.com/news/2020/dec/8/china-nepal-say-everest-a-bit-higher-than-past-mea/ |
| 4 | U.S. Office of Naval Research | 1960 챌린저 해연 하강 60주년 | https://www.onr.navy.mil/media-center/news-releases/lucky-day-navy-celebrates-60th-anniversary-deepest-ocean-dive |
| 5 | IEEE Spectrum | Don Walsh, 마리아나 해구 바닥까지의 여정 | https://spectrum.ieee.org/don-walsh-describes-the-trip-to-the-bottom-of-the-mariana-trench |

## 사실 카드
```yaml
- id: f1
  claim: 챌린저 해연의 가장 깊은 관측 수심
  value: 10,935 m (±6 m, 95%), 평균 해수면 기준
  as_of: 2021 (NOAA)
  note: 측정 방식에 따라 다름 (2010 소나 값 10,994 m 등) → 화면에 "survey values vary slightly"
  sources: [1, 2]
  verified: true
- id: f2
  claim: 에베레스트 공식 높이
  value: 8,848.86 m (반올림 8,849 m), 2020-12-08 중국 · 네팔 공동 발표
  sources: [3]
  verified: true
- id: f3
  claim: 에베레스트를 해저에 세웠을 때 정상 위 물의 깊이
  value: 10,935 − 8,848.86 ≈ 2,086 m  (자체 계산)
  note: 두 값이 서로 다른 기준(평균 해수면)이라 정확한 지형 비교가 아니라 "높이를 깊이에 대본 비교"
  verified: true
- id: f4
  claim: 챌린저 해연의 수압은 해수면의 약 1,000배
  value: ≈ 1,000×
  sources: [NOAA 설명 자료 · 10 m 마다 약 1기압 규칙으로 일치]
  verified: true
- id: f5
  claim: 1960-01-23 Trieste 호, 두 사람이 챌린저 해연에 도달. 하강 약 5시간(4.5~5시간으로 기록이 조금 다름), 바닥 체류 약 20분
  sources: [4, 5]
  verified: partial   # 하강 시간은 자료마다 약간 다름 → 화면에 "~5 hours"
- id: f6
  claim: 열수구 생물 사진은 챌린저 해연이 아님 (화면에 "hydrothermal vent fauna" 로 표기)
  verified: true
```

## 샷 계획 (33초, 무음 + BGM, script/shots.json)
| 시간 | 장면 | 한국어 | English |
|---|---|---|---|
| 0~3.5 | 비교 그래픽: 에베레스트가 해저로 떨어진다 | 에베레스트를 빠뜨리면? | What if you drop Everest in? |
| 3.5~7.1 | 정상 위 물 2,086 m 표시 | 정상 위로도 물이 2,086 m | Still 2,086 m of water above the summit |
| 7.2~12.6 | 사진 Trieste + 카운터 10,935 m | 챌린저 해연, 지구에서 가장 깊은 곳 | Challenger Deep, Mariana Trench (survey values vary slightly) |
| 12.6~18.2 | 1,000칸 압력 그래픽 | 수압은 해수면의 약 1,000배 | About 1,000× sea-level pressure |
| 18.2~24.4 | 사진 Trieste 인양 | 1960년 두 사람이 내려갔다 / 내려가는 데 약 5시간, 바닥에는 약 20분 | 1960: two men went down… / ~5 hours down, ~20 minutes at the bottom |
| 24.4~28.6 | 사진 열수구 생물 | 깊은 바다에도 생명이 산다 | Life thrives in the deep sea |
| 28.6~33 | 끝 카드 | 다음: 세상에서 가장 깊은 동굴, 구독하고 이어서 보기 / 에베레스트 말고 뭘 빠뜨려 볼까요? | Next: the world's deepest cave… / What should we drop in next? |
- 부가가치 요소: 에베레스트를 해저에 세워 보는 직접 만든 비교 그래픽 + 1,000칸 압력 그래픽.
- 알려진 한계: 끝은 첫 장면으로 이어 붙이지 않았다 (다음 편에서 시도).

## 연출 카드 (첫 편이라 비교 대상 없음)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 심해 남색 + 노랑 | 위 그래픽/사진, 아래 한·영 글자 | 샷 컷 | 켄 번즈 확대 | 에베레스트 · 1,000칸 | Noto Sans KR 900 | 약 5초 샷 |

## 사진 (source/credits.json)
- wikimedia-27ad968e.jpg — Bathyscaphe Trieste with USS Lewis (DE-535) over the Marianas Trench, 23 January 1960 (NH 96797), 공공 도메인
- wikimedia-c713179b.jpg — Bathyscaphe Trieste.jpg, 공공 도메인
- wikimedia-3de3fa78.jpg — Fauna on hydrothermal vents.jpg, NOAA Vents Program / Submarine Ring of Fire 2006 Exploration, 공공 도메인
- 사진마다 Commons 파일 페이지가 credits.json 의 `page` 에 있다.

## 검수
- [x] 숫자는 사실 카드에 있고 출처 2곳 (f5 만 partial, 화면에 "~")
- [x] 사진 3장 모두 공공 도메인, credits.json 에 기록
- [x] 인물 얼굴 · 로고 없음 (Trieste 선체의 글자만)
- [x] 글자는 쇼츠 안전 영역 안 (아래 y≈1500 이내)
- [ ] 음악은 사람이 한 번 들어 보기 (Claude 는 소리를 못 듣는다)
- [ ] 채널 개설 · 업로드 (사용자 확인 후)
