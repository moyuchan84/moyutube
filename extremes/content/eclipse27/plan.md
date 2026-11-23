# 2027-08-02 개기일식: 2009년 이후 가장 긴 개기일식 (Sky Calendar ②)

- 소재 한 줄: 2027-08-02 개기일식은 최대 약 6분 23초 — 2009년(6분 39초) 이후 가장 긴 개기일식. 그림자 길은 스페인 남부에서 북아프리카·이집트를 지나 아라비아반도로 간다(NASA · EclipseWise 원문 확인).
- 왜 이 소재: `npm run trends` 2026-11-21 — "solar eclipse" 씨앗 주제 작은 채널 돌파 5편, 「2027 Sky Events」 28K 채널 57.7만 회(4일), 「4 Eclipses in 2027」 17.3만 회. Commons 30K 사진.
- **제목 주의**: 인터넷의 "이번 세기에서 가장 긴"은 틀렸다 — **2009-07-22 일식이 06m39s** 로 더 길다(원문 확인). 이 영상은 "세기" 표현을 쓰지 않고 "2009년 이후 가장 긴"으로 쓴다(2010~2026 전부 6m23s 보다 짧음, 원문 확인).
- 형식: 한 곳(이집트) + 숫자 하나 + 지도(경로 표 좌표로 그린 그림자 길) + 연도별 지속 시간 막대.
- 시리즈: SKY CALENDAR ② (① geminids).

## 출처 (확인일 2026-11-21, 원문 페이지를 직접 읽음)
| # | 기관/사이트 | 문서 | URL | 확인 |
|---|---|---|---|---|
| 1 | NASA / F. Espenak (EclipseWise) | 2027-08-02 개기일식 요약 · 경로 표 | https://eclipsewise.com/solar/SEprime/2001-2100/SE2027Aug02Tprime.html · https://eclipsewise.com/solar/SEpath/2001-2100/SE2027Aug02Tpath.html | 읽음 |
| 2 | NASA / F. Espenak (EclipseWise) | 2001-2010 · 2011-2020 · 2021-2030 일식 목록 | https://eclipsewise.com/solar/SEdecade/SEdecade2001.html · …/SEdecade2011.html · …/SEdecade2021.html | 읽음 |
| 3 | NASA GSFC | 일식 카탈로그 2001-2100 (2048~2100 부분은 요약본으로 읽음) | https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html | 일부 |
| 4 | NASA Science | Future eclipses (2027-02-06 금환 · 2027-08-02 개기, 갱신 2026-09-28) | https://science.nasa.gov/eclipses/future-eclipses/ | 읽음 |

## 사실 카드
```yaml
- id: f1
  claim: 2027-08-02 개기일식 개기식 지속 시간
  value: 최대 약 6분 23초 (EclipseWise 요약 "06m23s", 경로 표 06m23.24s = 최대 지속 지점, 북위 26.8도 동경 31.1도 부근). 최대식 지점 06m22.64s.
  note: 화면 "up to 6 min 23 s". 지점 이름은 자료에 없다 → "Egypt" 까지만. 도시 이름(룩소르)은 쓰지 않는다.
  sources: [1, 4]
  verified: true
- id: f2
  claim: 2009-07-22 개기일식은 06m39s (2027 보다 16초 김)
  sources: [2, 3]
  verified: true
  note: "이번 세기 가장 긴" 은 틀린 표현 → 쓰지 않는다.
- id: f3
  claim: 2027-08-02 는 2009 이후 가장 긴 개기일식
  value: 2010~2026 개기일식 최대 지속 — 2010 5m20s · 2012 4m02s · 2015 2m47s · 2016 4m09s · 2017 2m40s · 2019 4m33s · 2020 2m10s · 2021 1m54s · 2024 4m28s · 2026 2m18s. 모두 6m23s 보다 짧다.
  note: 화면 "Longest total solar eclipse since 2009". 막대 비교 그래픽에 이 숫자를 쓴다(출처 2).
  sources: [2]
  verified: true
- id: f4
  claim: 이후 더 긴 개기일식
  value: NASA GSFC 카탈로그 2028~2100 중 6m23s 보다 긴 것은 없다 (2045-08-12 6m06s, 2096-05-22 6m06s 가 최대급). 2048~2100 은 요약본으로 읽음, 2043-04-09 는 시간 표기 없음.
  note: "다음으로 더 긴 것은 2100년 이후" 같은 연도 문장은 쓰지 않는다 (자료마다 2114 / 2132 로 갈림). 쓰려면 EclipseWise 2101-2200 표를 따로 확인.
  sources: [3]
  verified: partial
- id: f5
  claim: 2027-08-02 개기일식 경로(중심선)
  value: 중심선은 북위 27.96도 서경 44.48도(08:26 UT1)에서 남위 12.49도 동경 90.44도(11:48 UT1)까지 (경로 표). 개기식 지역: EclipseWise "Morocco, Spain, Algeria, Libya, Egypt, Saudi Arabia, Yemen, Somalia", NASA "남부 스페인, 북아프리카(모로코 · 알제리 · 튀니지 · 리비아 · 이집트), 사우디아라비아, 예멘".
  note: 두 자료의 나라 목록이 다르다 (튀니지 · 소말리아). 지도에는 **경로 표 좌표로 중심선만** 그리고, 라벨은 두 자료가 모두 쓴 나라(스페인 · 모로코 · 알제리 · 리비아 · 이집트 · 사우디아라비아 · 예멘)만 쓴다.
  sources: [1, 4]
  verified: true
- id: f6
  claim: 같은 해 2027-02-06 에는 금환일식이 있다
  sources: [4]
  verified: true
  note: 쓰지 않는다(이 편은 개기일식만).
```

## 샷 계획 (26초, script/shots.json)
| 시간 | 장면 | 한국어 | English | 움직임 |
|---|---|---|---|---|
| 0~3 | 검은 하늘 + 얇은 코로나 링 (코드 그래픽) | 낮이 6분 넘게 밤이 된다 | Day turns to night for over 6 minutes | 링 확대 |
| 3~8 | 지도(코드, Natural Earth) 위 중심선 그리기 | 2027년 8월 2일, 달 그림자가 북아프리카를 지난다 | Aug 2, 2027: the Moon's shadow crosses North Africa | 선이 그려짐 (경로 표 좌표) |
| 8~12 | 이집트 사진(Commons — 사람 얼굴 · 로고 없는 풍경) | 가장 긴 곳은 이집트 | Longest in Egypt | 켄 번즈 |
| 12~19 | 막대 비교(코드): 2009 6:39 · 2027 6:23 · 2010 5:20 · 2024 4:28 | 최대 약 6분 23초 · 2009년 이후 가장 길다 | Up to 6 min 23 s · Longest since 2009 | 막대가 차례로 자람 |
| 19~22 | 자막 한 줄 | 2024년 미국 일식은 4분 28초였다 | The 2024 US eclipse lasted 4 min 28 s | 정지 |
| 22~26 | 끝 카드 | 다음: 지구의 얼음이 다 녹으면? / 어디서 보고 싶어요? | Next: What if all the ice melted? / Where would you watch it? | 첫 장면 이어 붙임 |
- 부가가치 요소: 경로 표 좌표로 직접 그린 그림자 길 지도 + 일식 지속 시간 막대 비교(출처 2의 숫자).
- 사진 주의: 사람이 크게 나오거나 로고가 있으면 쓰지 않는다. 이집트 풍경 · 유적은 건축물 위주 사진으로.

## 연출 카드
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 검정 + 금색 코로나 | 위 그래픽/지도, 아래 글자 | 빛이 번지는 컷 | 천천히 확대 | 코로나 링 · 그림자 길 | 영어 크게 | 4~5초 샷 |

## 제목(한·영) — yt-seo 필요
- 후보: `Total Solar Eclipse 2027: How Long Will the Day Go Dark? | 2027 개기일식` (답 쓰지 않음, "세기" 표현 없음)
- **TODO**: `npm run seo -- extremes eclipse27 "total solar eclipse 2027"` 로 수요 확인.

## 검수
- [x] f1~f5 를 NASA · EclipseWise 원문으로 확인 (2026-11-21). f4(이후 더 긴 일식)만 partial — 연도 문장은 쓰지 않음
- [x] "이번 세기" "century" 표현 없음
- [ ] 지도 라벨은 두 자료가 모두 쓴 나라만 (튀니지 · 소말리아 제외)
- [ ] 사진 라이선스 · credits.json, 사람 얼굴 · 로고 없음
- [ ] 업로드: 12월 geminids 다음, 사용자 확인 후
