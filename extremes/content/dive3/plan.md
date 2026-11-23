# DIVE ③ 하늘 위로 끝까지 / How high can we go?

- 소재 한 줄: 지표에서 사람이 가 본 가장 먼 곳(아르테미스 2호, 406,771 km)까지 쉬지 않고 올라간다. "WAY TO THE MOON %"가 106% 에서 멈추고, 마지막에 "땅속으로는? 고작 12 km" 로 ② 와 이어 붙인다.
- 왜 이 소재: ② 끝 카드에서 예고. yt-seo (2026-11-18): `how high can we go` 중앙값 1,971,660 · 최근 60일 1개, `artemis 2` 371,033, `how high is space` · `earth to moon distance` 🔥(최근 뜨는 말).
- 형식: DIVE 3부작의 마지막 (① 바다 · ② 땅속 · ③ 하늘). 끝 카드는 다음 편 예고 대신 "3편 끝 · 다음 시리즈" + 셋 중 하나 고르기 질문.

## 출처 (확인일 2026-11-18)
| # | 기관/사이트 | 문서 | URL |
|---|---|---|---|
| 1 | CTBUH (Skyscraper Center) · KHL | 부르즈 할리파 828 m (공식 높이, 건축 꼭대기 기준) | https://www.skyscrapercenter.com/building/burj-khalifa/3 · https://www.khl.com/news/ctbuh-ratifies-height-of-burj-khalifa/55351.article |
| 2 | deep5 편 사실 카드 | 에베레스트 8,849 m (2020 중국·네팔 측량) | ../deep5/plan.md |
| 3 | Military Aerospace · AirHelp | 여객기 순항 고도 보통 약 35,000 ft(약 10.7 km), 비행마다 31,000~42,000 ft | https://www.militaryaerospace.com/commercial-aerospace/news/55399427/why-commercial-aircraft-cruise-around-35000-feet · https://www.airhelp.com/en-int/blog/how-high-do-planes-fly/ |
| 4 | Space.com · National Geographic | 카르만 선 100 km (FAI 기준, 미국은 80 km) | https://www.space.com/karman-line-where-does-space-begin · https://www.nationalgeographic.com/science/article/where-is-the-edge-of-space-and-what-is-the-karman-line |
| 5 | Space.com · NASA | ISS 평균 고도 약 400 km | (같은 Space.com 기사) |
| 6 | NASA Earthdata · Wikipedia(Geostationary orbit) | 정지궤도 적도 위 35,786 km, GOES 날씨 위성이 여기 | https://earthdata.nasa.gov/learn/earth-observation-data-basics/orbits |
| 7 | NASA | 달 평균 거리 384,400 km | https://science.nasa.gov/moon/ |
| 8 | Scientific American · Al Jazeera · collectSPACE (2026-04-06) | 아르테미스 2호 최대 거리 406,771 km (NASA 252,752 mi) — 아폴로 13호 400,171 km 기록을 깸 | https://www.scientificamerican.com/article/nasas-artemis-ii-astronauts-break-apollos-distance-record/ · https://www.aljazeera.com/news/2026/4/6/artemis-ii-breaks-record-for-the-furthest-human-travel-from-earth · https://www.collectspace.com/news/news-040626a-artemis-ii-surpasses-apollo-13-distance-record.html |
| 9 | ② dive2 사실 카드 | 사람이 판 가장 깊은 구멍 12,262 m → "12 km" | ../dive2/plan.md |

## 사실 카드
```yaml
- id: f1
  claim: 가장 높은 건물 부르즈 할리파 828 m
  sources: [1]
  verified: true
- id: f2
  claim: 에베레스트 8,849 m
  sources: [2]
  verified: true
- id: f3
  claim: 여객기 순항 고도 약 35,000 ft ≈ 10,700 m
  note: 정해진 값 아님 (31,000~42,000 ft). 화면 "Your flight" + 한국어 "보통 여기 (약 3만 5천 피트)"
  sources: [3]
  verified: partial
- id: f4
  claim: 우주의 시작 카르만 선 100 km (FAI 국제 기준)
  note: 미국은 80 km — 설명란에
  sources: [4]
  verified: true
- id: f5
  claim: ISS 평균 고도 약 400 km
  sources: [4, 5]
  verified: true
- id: f6
  claim: 정지궤도 35,786 km — 날씨 위성(GOES 등)
  sources: [6]
  verified: true
- id: f7
  claim: 달 평균 거리 384,400 km
  sources: [7]
  verified: true
- id: f8
  claim: 사람이 지구에서 가장 멀리 간 기록 — 아르테미스 2호, 2026-04-06, 406,771 km
  note: 매체마다 406,771~406,778 km, 사후 추정 413,145 km(McDowell). 화면은 NASA 발표값
  sources: [8]
  verified: true
- id: f9
  claim: 406,771 / 384,400 = 106% (달보다 멀리)
  verified: true
```

## 샷 계획 (27.2초, 무음 + BGM, script/shots.json)
| 시간 | 고도 | 화면 (credits) | English | 한국어 |
|---|---|---|---|---|
| 0~2.2 | 0 m | 호수 위로 오르는 드론 (pixabay-ea40b1e9, 연출) | How high can we go? | 하늘 위로 어디까지 갈 수 있을까? |
| 2.2~4.6 | 828 m | 부르즈 할리파 (wikimedia-b66e85f3, 로고·사람 나오는 아래쪽 잘라 냄) | Tallest building | 가장 높은 건물 · 부르즈 할리파 |
| 4.6~7.0 | 8,849 m | 에베레스트 (wikimedia-a4a0ba26) | Highest mountain | 가장 높은 산 · 에베레스트 |
| 7.0~9.4 | 10,700 m | 비행기 날개 (pixabay-5590f6d7, 연출) | Your flight | 비행기는 보통 여기 (약 3만 5천 피트) |
| 9.4~12.0 | 100 km | ISS 에서 본 대기 꼭대기 (wikimedia-cb57086a) | Space starts here | 우주의 시작 · 카르만 선 (국제 기준) |
| 12.0~14.4 | 400 km | ISS 창밖 (wikimedia-7778f26e, 모듈 로고 잘라 냄) | Space station | 국제우주정거장 · 평균 약 400 km |
| 14.4~16.8 | 35,786 km | GOES-16 지구 (wikimedia-7a868abf, NOAA·NASA 로고 잘라 냄) | Weather satellites hover here | 날씨 위성이 멈춰 떠 있는 곳 · 정지궤도 |
| 16.8~19.4 | 384,400 km | 아폴로 8호 지구돋이 (wikimedia-75bf35c4) | The Moon. | 달 · 평균 거리 |
| 19.4~23.6 | 406,771 km | 아르테미스 2호 지구넘이 (wikimedia-e6f66cf7), 흔들림 | Farthest humans have ever been / And down? Only 12 km. | 사람이 가 본 가장 먼 곳 · 아르테미스 2호, 2026 / 땅속으로는? 고작 12 km |
| 23.6~27.2 | — | 끝 카드 (다음 편 예고 없음) | Ocean. Earth. Sky. All 3 done. Subscribe for more. / Ocean, Earth or sky — which would you pick? | 바다 · 땅속 · 하늘 3편 끝 · 구독하면 다음 시리즈도 보여요 / 바다 · 땅속 · 하늘, 하나만 간다면? |
- 부가가치: 고도 숫자(m → km) + **WAY TO THE MOON %** (0.00% → 0.10% → 9.3% → 100% → 106%) + 아래에서 위로 차는 로그 눈금. DIVE 모드에 `up`(눈금 · 컷 방향 뒤집기) · `label` 추가, 7자리 넘는 숫자는 160px 로 줄여 안전 영역 안.

## 연출 카드 (직전 2편 dive2 · dive 와 비교)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 하늘 파랑 #8FB8FF + 남색 끝 카드 | 고정 고도 숫자, 아래 2~4단어 | **위에서 내려오기 (반대 방향)** | 켄 번즈 + 마지막 줌 아웃 | 달까지 % · 아래에서 차는 눈금 | Noto Sans KR 900, 196/160px | 2.4~4.2초 |
- 음악: G 장조 100bpm, 상행 음계 pluck → 우주 구간 박자 빠지고 높은 종소리 → 달 · 아르테미스에서 가장 풍성 → "12 km"에서 멈춤 → G 로 닫힘. ①(D 76bpm) · ②(Em 92bpm)와 조 · 템포 · 주 악기 다름.

## 사진 (source/credits.json)
- NASA · NOAA 공공 도메인 5장 (대기 꼭대기 · ISS · GOES-16 · 지구돋이 · 아르테미스 2호 지구넘이), 부르즈 할리파 CC0, 에베레스트 CC BY 4.0 (dive2 에서), Pixabay 영상 2 (연출 표시).
- 로고: 부르즈 사진 아래 배달 상자 · EMAAR, GOES 이미지 오른쪽 아래 NOAA · NASA 로고, ISS 모듈 로고 — 모두 화면 밖으로 잘림 (스틸 확인).

## 메타데이터
- 키워드 조사 끝 (upload/upload.md). 제목은 올리기 직전에.
- 설명란: 고도마다 한 줄 + "비행 고도는 비행마다 다름" + "카르만 선은 FAI 기준, 미국은 80 km" + "아르테미스 2호 거리는 NASA 발표값" + 기준일 + `[사진 출처]` + `[음악] 직접 합성한 배경음악`.
- 업로드 때 ① · ② · ③ 을 재생목록 「끝까지 가 보기 / DIVE」 로 묶고, ③ 의 관련 동영상에 ②.

## 검수
- [x] 숫자는 전부 사실 카드에 있음 (f3 은 대략값 — 한국어에 "보통 · 약")
- [x] 사진은 전부 허용 라이선스, 로고 · 사람 얼굴 화면 밖
- [x] 스틸 확인 (40 · 110 · 180 · 250 · 330 · 400 · 470 · 540 · 600 · 680 · 760), 끝 카드 겹침 고침
- [ ] 음악은 사람이 한 번 들어 보기
- [ ] 업로드 (yt-seo → 사용자 확인)
