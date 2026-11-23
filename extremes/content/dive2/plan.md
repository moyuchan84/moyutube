# DIVE ② 땅속으로 끝까지 / How deep can we dig?

- 소재 한 줄: 지표에서 지구 중심(6,371 km)까지 쉬지 않고 내려간다. 깊이 숫자(m → km)와 "중심까지 몇 %" 가 계속 굴러가고, 사람이 판 가장 깊은 구멍(12,262 m)이 고작 0.19% 라는 걸 끝에서 보여 준다.
- 왜 이 소재: DIVE ① 바다 끝 카드에서 예고한 편. yt-seo (2026-11-18): `how deep can we dig` 중앙값 4,460,061 · 최근 60일 5개(중앙값 1,361 — 새 영상이 거의 안 뜸), `deepest hole` 2,008,473, `journey to the center of the earth` 511,405 · 최근 60일 0개. 1위 "What If You Dig A Hole Through Earth and jump in?" 1억 7천만.
- 형식: 멍하게 보는 DIVE (① 과 같은 틀, 단위가 km 로 넘어가고 수압 대신 "WAY TO THE CENTER %").
- 시리즈: ① 바다 → **② 땅속** → ③ 하늘 위 (끝 카드에서 예고, 흐린 에베레스트 사진).

## 출처 (확인일 2026-11-18)
| # | 기관/사이트 | 문서 | URL |
|---|---|---|---|
| 1 | deep5 편 사실 카드 (출처 2곳씩) | 빙엄 캐니언 1.2 km · 크루베라 ~2,224 m · 음포넹 ~4 km · 콜라 12,262 m · 0.19% | ../deep5/plan.md |
| 2 | USGS "Inside the Earth" | 맨틀 두께 약 2,900 km, 외핵 약 2,200 km, 내핵 약 1,250 km | https://pubs.usgs.gov/gip/dynamic/inside.html |
| 3 | Canadian Natural Hazards (U. Guelph, 교재) | 외핵 2,890–5,150 km | https://books.lib.uoguelph.ca/canadiannaturalhazardsclimatechange/?p=76 |
| 4 | Britannica, Earth's layers | 대륙 지각 보통 약 40 km (최대 70 km), 해양 지각 약 6 km, 경계 = 모호면 | https://www.britannica.com/science/plate-tectonics/Earths-layers |
| 5 | Global Moho map (EGU 2014) | 대륙 지각 평균 약 34 km (CRUST 2.0 은 38 km) | https://ui.adsabs.harvard.edu/abs/2014EGUGA..1616384B/abstract |
| 6 | ESRF (2013-04-25) · Anzellini 외, Science 2013 | 내핵 경계 약 6,000 °C (±500) — 태양 표면 온도와 비슷 | https://www.esrf.fr/news/general/Earth-Center-Hotter |
| 7 | ScienceDaily (2013-04-25) | 같은 결과 보도 | https://sciencedaily.com/releases/2013/04/130425142355.htm |
| 8 | NASA Earth Fact Sheet | 지구 부피 평균 반지름 6,371 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html |

## 사실 카드
```yaml
- id: f1
  claim: 빙엄 캐니언 — 가장 깊은 노천 광산, 약 1.2 km
  value: 1,200 m
  sources: [1]
  verified: true
- id: f2
  claim: 가장 깊은 동굴 크루베라 ~2,224 m (베료프키나와 순위가 측정마다 바뀜)
  value: 2,224 m
  note: 화면 "Deepest known cave", 설명란에 "측정에 따라 순위가 바뀜"
  sources: [1]
  verified: true
- id: f3
  claim: 음포넹 금광 — 가장 깊은 광산, 약 4 km
  value: 4,000 m (반올림)
  sources: [1]
  verified: true
- id: f4
  claim: 콜라 초심층 시추공 12,262 m (1989) — 사람이 판 가장 깊은 구멍
  value: 12,262 m
  sources: [1]
  verified: true
- id: f5
  claim: 맨틀은 지각 아래에서 시작 — 대륙 지각 평균 약 34~40 km
  value: 40 km (화면 "대륙 평균 약 40 km")
  note: 데이터셋마다 34~40 km, 지역에 따라 20~70 km. 설명란에 "평균, 곳마다 다름"
  sources: [4, 5]
  verified: partial
- id: f6
  claim: 외핵(녹은 철 · 니켈)은 약 2,890 km 깊이에서 시작
  value: 2,890 km
  sources: [2, 3]
  verified: true
- id: f7
  claim: 내핵 경계 약 5,150 km, 온도 약 6,000 °C (±500) — 태양 표면(약 5,500 °C)과 비슷
  value: 5,150 km · ~6,000 °C
  sources: [3, 6, 7]
  verified: true
- id: f8
  claim: 지구 중심까지 6,371 km (평균 반지름)
  value: 6,371 km
  sources: [8, 2]
  verified: true
- id: f9
  claim: 12.262 / 6,371 = 0.19%
  sources: [1]
  verified: true
```

## 샷 계획 (27.2초, 무음 + BGM, script/shots.json)
| 시간 | 깊이 | 화면 (credits) | English (크게) | 한국어 (작게) |
|---|---|---|---|---|
| 0~2.2 | 0 m | 절벽 위 드론 (pixabay-e589f1cb, 연출 화면) | How deep can we dig? | 땅속으로 어디까지 갈 수 있을까? |
| 2.2~4.6 | 1,200 m | 빙엄 캐니언 (wikimedia-4e23b884) | Deepest open-pit mine | 가장 깊은 노천 광산 · 미국 빙엄 |
| 4.6~7.0 | 2,224 m | 동굴 (pixabay-958db069, 연출 화면) | Deepest known cave | 가장 깊은 동굴 · 크루베라 |
| 7.0~9.4 | 4,000 m | 광산 권양탑 (pixabay-4e8080b7, 연출 화면) | Deepest mine. For gold. | 가장 깊은 광산 · 남아공 음포넹 금광 |
| 9.4~12.4 | 12,262 m | 콜라 시추공 단면 전시 (wikimedia-55d1f8f2), 흔들림 | Deepest hole ever dug / Humans stopped here. | 사람이 판 가장 깊은 구멍 · 콜라 1989 / 사람은 여기서 멈췄다 |
| 12.4~14.8 | 40 km | 맨틀 암석 페리도타이트 (wikimedia-4c193754) | The mantle. | 맨틀 시작 · 대륙 평균 약 40 km |
| 14.8~17.4 | 2,890 km | 철 운석 단면 (wikimedia-4362758c, 연출 — 핵과 같은 철·니켈) | An ocean of liquid iron | 외핵 · 녹은 쇳물의 바다 |
| 17.4~20.0 | 5,150 km | 태양 (wikimedia-88eb3815) | As hot as the Sun's surface | 내핵 · 약 6,000 °C, 태양 표면만큼 |
| 20.0~23.6 | 6,371 km | 아폴로 17 지구 (wikimedia-82cb3638), 줌 아웃 · 흔들림 | The center. / We've dug 0.19% of the way. | 지구 중심 / 사람이 파 내려간 건 0.19% 뿐 |
| 23.6~27.2 | — | 끝 카드 + 다음 편(③ 하늘 위, 흐린 에베레스트) | All the way. 3 dives. Subscribe for the next. / How far down would you go? | 끝까지 가 보기 3편 · 구독하면 이어서 보여요 / 어디까지 내려가 보고 싶어요? |
- 부가가치 요소: 편 내내 이어지는 깊이 숫자(20 km 부터 km) + **WAY TO THE CENTER %** (0.00% → 0.19% → 45% → 100%) + 로그 눈금 (DIVE 모드에 `scale: "log"` · `km` · `center` 추가).
- 끝 → 처음: 지구 전체 사진에서 끝 카드, 음악이 E 장조로 닫히고 첫 장면(지표)으로 이어진다.

## 연출 카드 (직전 2편 dive · price5 와 비교)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 마그마 주황 #FF8A3D + 검붉은 끝 카드 | 위에 고정 깊이 숫자, 아래 2~4단어 | 아래에서 밀려 올라오기 (① 과 같음, 시리즈 틀) | 켄 번즈 + 마지막 줌 아웃 | 중심까지 % · 로그 눈금 | Noto Sans KR 900, 숫자 196px · m→km | 2.4~3.6초 컷 |
- dive ① 와 다른 것: 팔레트(민트 → 주황), 오브젝트(수압 → 중심까지 %), 카메라(마지막 줌 아웃), 음악(D 장조 전자 피아노 76bpm → E 단조 pluck 리프 92bpm). 시리즈라 레이아웃 · 전환은 일부러 같게.
- price5 와는 5항목 이상 다름.

## 사진 (source/credits.json)
- 새로 받은 것: 페리도타이트 (James St. John, CC BY 2.0) · 철 운석 NWA 5549 (Daderot, CC0) · 아폴로 17 지구 (NASA, PD) · 태양 SDO (NASA, PD) · 에베레스트 (Vyacheslav Argenberg, CC BY 4.0, 끝 카드 다음 편).
- deep5 에서 가져온 것: 빙엄 캐니언 (David Ratledge, CC BY 4.0) · 콜라 단면 전시 (CC0) · Pixabay 영상 2 · 사진 1 (연출 화면 표시).

## 메타데이터
- 키워드 조사 끝 (upload/upload.md seo 칸). 제목 · 해시태그는 올리기 직전에 정한다.
- 설명란: 깊이마다 한 줄 사실 + "맨틀 시작 깊이는 평균값(곳마다 20~70 km)" + "동굴 순위는 측정마다 바뀜" + 기준일 2026-11-18 + `[사진 출처]` + `[음악] 직접 합성한 배경음악`.
- 고정 댓글: "How far down would you go? / 어디까지 내려가 보고 싶어요?"

## 검수
- [x] 숫자는 전부 사실 카드에 있고 출처 2곳 (f5 는 평균값 — 화면에 "대륙 평균 약")
- [x] 사진은 전부 credits.json 에 허용 라이선스로 기록됨
- [x] 인물 얼굴 · 로고 · 상표 없음 (콜라 전시물에 러시아어 글자만)
- [x] 스틸로 겹침 · 안전 영역 확인 (프레임 30 · 100 · 230 · 320 · 400 · 470 · 550 · 700 · 790)
- [ ] 음악은 사람이 한 번 들어 보기 (Claude 는 소리를 못 듣는다)
- [ ] 업로드 (yt-seo → 사용자 확인)
