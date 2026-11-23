# DIVE ① 바다 끝까지 내려가 보기 / How deep can you go?

- 소재 한 줄: 수면에서 챌린저 해연 바닥(10,935 m)까지 쉬지 않고 내려간다. 깊이 숫자가 계속 굴러가고, 깊이마다 실제 사진이 바뀐다.
- 왜 이 소재: 2026-11-16 사용자 "도파민 나올 만한 주제인지 모르겠다, 더 멍하게 재밌게" → [docs/series-plan.md](../../docs/series-plan.md) 7절. `ocean depth comparison` 조회수 중앙값 6,862,956 · 최근 60일 새 영상 1개 (yt-seo, 2026-11-16). 1위 "This Incredible Animation Shows How Deep The Ocean Really Is" 8,372만.
- 형식: **멍하게 보는 형식 (새 시리즈 DIVE)** — 눈으로만 따라가기 · 숫자 하나가 계속 움직임 · 글자 한 번에 4단어 안 · "왜"는 설명란 · 고정 댓글로.
- 시리즈: DIVE ① 바다 → ② 땅속 (끝 카드에서 예고함, deep5 · kola 사진 재사용) → ③ 하늘 위 (에베레스트 → 비행기 → ISS).

## 출처 (확인일 2026-11-16)
| # | 기관/사이트 | 문서 | URL |
|---|---|---|---|
| 1 | PADI (블로그) | Open Water vs Advanced 수심 한계 — Deep Diver 40 m(130 ft)가 레저 다이빙 한계 | https://blog.padi.com/how-deep-can-open-water-vs-advanced-divers-go/ |
| 2 | Scuba Diving 잡지 | Why is 130 feet the depth limit for recreational scuba diving | https://www.scubadiving.com/why-is-130-feet-depth-limit-for-recreational-scuba-diving |
| 3 | NOAA Ocean Service | How far does light travel in the ocean? (200 m 넘으면 의미 있는 빛이 거의 없음, 6,000 m+ hadal) | https://oceanservice.noaa.gov/facts/light_travel.html |
| 4 | NOAA Ocean Exploration | How is light distributed in the ocean? (1,000 m 아래는 햇빛이 닿지 않음) | https://oceanexplorer.noaa.gov/facts/light-distributed.html |
| 5 | NOAA JetStream | Layers of the Ocean (sunlight 0–200 m, midnight 1,000–4,000 m) | https://noaa.gov/jetstream/ocean/layers-of-ocean |
| 6 | Schorr et al. 2014, PLOS ONE | First long-term behavioral records from Cuvier's beaked whales — 최대 2,992 m | (논문) doi:10.1371/journal.pone.0092633 |
| 7 | National Geographic (2014-03-26) | 같은 기록 보도 (2,992 m, 137분) | https://www.nationalgeographic.com/animals/article/140326-cuvier-beaked-whale-record-dive-depth-ocean-animal-science |
| 8 | WHOI · NOAA (Titanic 2004 탐사) | 타이타닉 잔해 수심 약 3,800 m (12,500 ft) — 자료에 따라 3,800~3,840 m | https://oceanexplorer.noaa.gov/ (Titanic 2004) · https://www.worldatlas.com/oceans/how-deep-the-titanic-wreck-actually-sits.html |
| 9 | Oceana · U.S. Fish & Wildlife Service | 덤보 문어는 약 4,000 m(13,000 ft)까지 산다, 가장 깊이 사는 문어 | https://www.fws.gov/media/dumbo-octopus |
| 10 | University of Western Australia (2023-04) · Yale e360 | 꼼치(Pseudoliparis) 8,336 m 촬영 — 가장 깊은 물고기 기록 (2022년 이즈-오가사와라 해구) | https://e360.yale.edu/digest/deepest-fish-recorded-snailfish-japan · https://globalnews.ca/news/9598232/deepest-fish-ever-recorded-trench-japan |
| 11 | NOAA (PMEL) · Dziak 외 | 챌린저 해연 10,935 m (±6 m) — mariana 편 사실 카드 f1 그대로 | https://www.pmel.noaa.gov/pubs/PDF/dzia4367/dzia4367.pdf |
| 12 | U.S. Office of Naval Research | 1960-01-23 Trieste 호 첫 도달 — mariana 편 f5 | https://www.onr.navy.mil/media-center/news-releases/lucky-day-navy-celebrates-60th-anniversary-deepest-ocean-dive |

## 사실 카드
```yaml
- id: f1
  claim: 레저 스쿠버 다이빙 수심 한계
  value: 40 m (130 ft) — 교육 기준이지 법적 한계는 아님
  sources: [1, 2]
  verified: true
- id: f2
  claim: 햇빛(유광층)은 약 200 m 에서 사라진다
  value: 200 m (그 아래로는 의미 있는 빛이 거의 없음)
  sources: [3, 5]
  verified: true
- id: f3
  claim: 1,000 m 아래는 햇빛이 전혀 닿지 않는다 (midnight zone 1,000–4,000 m)
  value: 1,000 m
  sources: [4, 5]
  verified: true
- id: f4
  claim: 기록된 포유류(고래) 최고 잠수 깊이 — 민부리고래(Cuvier's beaked whale)
  value: 2,992 m (2014 발표)
  note: 이 종으로서도 이례적으로 깊은 잠수 (보통 약 2,000 m)
  sources: [6, 7]
  verified: true
- id: f5
  claim: 타이타닉 잔해 수심
  value: 약 3,800 m (자료에 따라 3,800~3,840 m) → 화면 3,800
  sources: [8]
  verified: partial   # 반올림 값. 화면에 숫자만, "약"은 카운터가 굴러가는 형식이라 생략 → 설명란에 "약 3,800 m"
- id: f6
  claim: 덤보 문어(Grimpoteuthis)는 약 4,000 m 깊이에서도 산다
  value: ~4,000 m (13,000~13,100 ft)
  sources: [9]
  verified: true
- id: f7
  claim: 카메라에 찍힌 가장 깊은 물고기 — 꼼치(Pseudoliparis 속)
  value: 8,336 m (2022 촬영, 2023 발표)
  note: 화면 사진은 그 물고기가 아니라 같은 속의 마리아나 꼼치(P. swirei) 표본 → 크레딧에 "a close relative"
  sources: [10]
  verified: true
- id: f8
  claim: 챌린저 해연 바닥
  value: 10,935 m (±6 m), 측정마다 조금 다름
  sources: [11]
  verified: true
- id: f9
  claim: 1960년 Trieste 호가 처음 바닥에 닿았다
  sources: [12]
  verified: true
- id: f10
  claim: 수압 ≈ 깊이/10 + 1 기압 (화면 PRESSURE ≈ … atm)
  note: 바닷물 10 m 마다 약 1기압 — 근사값이라 "≈". 바닥 ≈ 1,095 atm, mariana f4 "약 1,000배"와 맞음
  verified: true
```

## 샷 계획 (27초, 무음 + BGM, script/shots.json)
| 시간 | 깊이 | 화면 (credits) | English (크게) | 한국어 (작게) |
|---|---|---|---|---|
| 0~2.2 | 0 m | 수면 위 범선, 드론 (pixabay-c18a2a75) | How deep can you go? | 어디까지 내려갈 수 있을까? |
| 2.2~4.6 | 40 m | 동굴 다이버 (pixabay-16ed700a, 연출 화면) | Scuba limit | 스쿠버 다이빙 한계 |
| 4.6~7.0 | 200 m | 물속에서 올려다본 해 (pixabay-c3d2b730, 연출 화면) | Sunlight fades out | 햇빛이 사라진다 |
| 7.0~9.2 | 1,000 m | 검은 화면 + 떠오르는 입자 | No sunlight. At all. | 햇빛 0. 완전한 어둠 |
| 9.2~11.8 | 2,992 m | 민부리고래 (wikimedia-9f75754b) | Deepest whale dive ever recorded | 고래 잠수 최고 기록 |
| 11.8~14.6 | 3,800 m | 타이타닉 뱃머리 2004 (wikimedia-4b0eb7d5) | Titanic | 타이타닉이 잠든 곳 |
| 14.6~17.0 | 4,000 m | 덤보 문어 (wikimedia-a856285b) | Dumbo octopus lives here | 덤보 문어는 여기서도 산다 |
| 17.0~19.8 | 8,336 m | 마리아나 꼼치 표본 (wikimedia-15d1e3aa-crop) | Deepest fish ever filmed | 카메라에 찍힌 가장 깊은 물고기 |
| 19.8~23.4 | 10,935 m | Trieste 1960 (wikimedia-27ad968e), 화면 흔들림 | The bottom. / First reached in 1960 | 바닥. 챌린저 해연 / 1960년, 사람이 처음 닿았다 |
| 23.4~27 | — | 끝 카드 + 다음 편(② 땅속, 흐린 광산 사진) | All the way down. 3 dives. Subscribe for the next. / Which depth would scare you most? | 끝까지 내려가 보기 3편 · 구독하면 이어서 보여요 / 어디서부터 무서울 것 같아요? |
- 부가가치 요소: 편 내내 이어지는 깊이 숫자 + 수압 + 왼쪽 눈금(제곱근 눈금, 지나온 깊이에 눈금선), 깊을수록 좁아지는 시야(비네트), 아래에서 밀려 올라오는 컷 (DIVE 모드, `Short.tsx` 의 `dive`).
- 끝 → 처음: 끝 카드 음악이 D 장조로 밝게 닫히고 첫 장면(수면)으로 이어진다.

## 연출 카드 (직전 2편 deep5 · price5 와 비교)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 민트 #6FF2C4 + 깊어질수록 검정 | 위에 고정 깊이 숫자, 아래 2~4단어 | **아래에서 밀려 올라오기 (새)** | 켄 번즈 + 위로 흐르는 입자 | 이어지는 깊이 눈금 · 수압 | Noto Sans KR 900, 숫자 196px | 2.2~2.8초 컷 (빠름) |
- deep5 와 다른 것: 팔레트(시안 → 민트), 레이아웃(순위 #N → 고정 깊이), 전환(blinds → 밀어 올리기), 오브젝트(TOP 진행 막대 → 깊이 눈금), 템포(4.6초 → 2.4초). 5항목.

## 사진 (source/credits.json)
- 영상 3개는 Pixabay (연출 화면 2개는 화면에 "Illustrative footage").
- 사진 5장: NOAA/IFE/URI 타이타닉 (공공 도메인) · NOAA Okeanos 덤보 문어 (공공 도메인) · Francesca Grossi 민부리고래 (CC BY 4.0) · Gerringer 외 마리아나 꼼치 (CC BY 3.0, 잘라 씀) · U.S. Navy Trieste (공공 도메인). 끝 카드 다음 편: Bingham Canyon (David Ratledge, CC BY 4.0).
- `--file` 로 받은 사진(검색에 안 걸림): Titanic wreck bow.jpg (1480×1036, 크기 검사 건너뜀).

## 메타데이터
- 제목 · 해시태그는 올리기 직전 `npm run seo -- extremes dive …` 로 정한다 → upload/upload.md.
- 설명란: 깊이마다 한 줄 사실 + 기준일 2026-11-16 + `[사진 출처]` + `[음악] 직접 합성한 배경음악`.
- 고정 댓글: "Which depth would scare you most? / 어디서부터 무서울 것 같아요?"

## 검수
- [x] 숫자는 전부 사실 카드에 있고 출처 2곳 (f5 는 반올림 · 자료마다 3,800~3,840)
- [x] 사진은 전부 credits.json 에 허용 라이선스로 기록됨
- [x] 인물 얼굴 · 로고 · 상표 · 사고 피해자 없음 (다이버는 뒷모습 실루엣, Trieste 선체 글자만)
- [x] 정지 장면 2초 이하 (컷 2.2~2.8초 + 켄 번즈 + 입자 + 숫자 굴러감) · 글자 안전 영역 안 (스틸 확인)
- [ ] 음악은 사람이 한 번 들어 보기 (Claude 는 소리를 못 듣는다)
- [ ] 업로드 (yt-seo → 사용자 확인)
