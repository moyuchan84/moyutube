# Priciest per Gram TOP 5 (EARTH'S MOST ②)

- 소재 한 줄: "비싼 것" 하면 떠오르는 금(1 g 132달러)으로 시작해서, 1 g 당 가장 비싼 5가지를 따라 반물질(1 g 약 60조 달러)까지 올라간다.
- 왜 이 소재: deep5 끝 카드에서 예고함. 시리즈 4 수요 조사(docs/series-plan.md): `most expensive things` 순위형 수요가 크다. 업로드 직전 yt-seo 다시.
- 형식: TOP 5 카운트다운. **기준 = BBC Science Focus (2026-03) 의 1 g 당 추정 가격 순위 상위 5개** — 화면 크레딧에 "Price: … est." 로 출처를 늘 보인다. 시장 가격이 아니라 추정치라는 점을 숨기지 않는다.
- 순위마다 "왜 비싼지" 한 줄 (noentry "이유가 빈약" 피드백 반영): 30개도 안 됨 · 10억 달러 임무로 121.6 g · 1년에 1 g 도 안 나옴 · 0.0002 g 이 3만 2천 달러 · 다 모아도 1 g 에 한참 못 미침.

## 출처 (2곳 이상)
| # | 기관/사이트 | 문서 | URL | 확인일 |
|---|---|---|---|---|
| 1 | BBC Science Focus (2026-03-06) | The 7 most expensive substances ever found on planet Earth | https://www.sciencefocus.com/planet-earth/the-7-most-expensive-substances-ever-found-on-planet-earth | 2026-11-13 |
| 2 | Guinness World Records | Most expensive substance (반물질 $59.8조/g · 풀러렌 $1.34억 · Cf $2,560만) | https://www.guinnessworldrecords.com/world-records/410072-most-expensive-substance | 2026-11-13 |
| 3 | pricegold.net · GoldBroker | 금 시세 2026-11-09 $132.33/g · 11-04 $129.84/g | https://pricegold.net/2026/november/9/ · https://www.goldbroker.com/gold-silver-prices-charts.html | 2026-11-13 |
| 4 | Wikipedia · IFLScience | Red diamond (캐럿당 100만 달러 이상, 대부분 0.5 ct 미만) · 30개도 안 알려짐 | https://en.wikipedia.org/wiki/Red_diamond · https://www.iflscience.com/fewer-than-30-specimens-of-the-worlds-rarest-diamond-exist-69364 | 2026-11-13 |
| 5 | Wikipedia · Planetary Society | OSIRIS-REx (121.6 g · 약 8억 달러 + 발사 1.8억) · Cost of OSIRIS-REx (평생 10.2억) | https://en.wikipedia.org/wiki/OSIRIS-REx · https://www.planetary.org/space-policy/cost-of-osiris-rex | 2026-11-13 |
| 6 | Wikipedia · IFLScience (2026-08-10) | Californium (ORNL 연 0.25 g, 2003) · ORNL 연 1 g 미만 | https://en.wikipedia.org/wiki/Californium · https://www.iflscience.com/us-lab-finds-a-faster-way-to-make-californium-252-a-nuclear-isotope-worth-millions-per-gram-not-found-naturally-on-earth-84330 | 2026-11-13 |
| 7 | University of Oxford · ScienceAlert | 질소 내포 풀러렌 첫 판매 200 µg = 3만 2천 달러 | https://ox.ac.uk/node/510876 · https://www.sciencealert.com/scientists-create-world-s-most-expensive-material-valued-at-145-million-per-gram | 2026-11-13 |
| 8 | World Gold Council | Above-ground stocks 224,200 t (2026 3분기 말) · 2025 말 219,891 t | https://www.gold.org/goldhub/data/above-ground-stocks · https://www.gold.org/about-gold/gold-supply/gold-mining/how-much-gold-has-been-mined | 2026-11-13 |
| 9 | CERN | AD 를 1년 내내 손실 없이 돌려도 반수소 원자 약 3천만 개 (1 g ≈ 6×10²³ 개) → 1 g 에 한참 못 미침 | https://home.cern/science/physics/antimatter | 2026-11-13 |

## 사실 카드
```yaml
- id: f0
  claim: 금 1 g 약 132달러 (2026-11-09 현물)
  value: $132/g
  as_of: 2026-11-09
  sources: [3]
  verified: true
- id: f1
  claim: 붉은 다이아몬드 1 g 약 470만 달러 (추정). 알려진 천연 붉은 다이아몬드는 30개도 안 된다.
  value: ~$4.7M/g
  sources: [1, 4]
  verified: true
  note: Wikipedia "캐럿당 100만 달러 이상" = g 당 500만 달러 이상과 같은 규모. 사진은 일반 원석 다이아몬드(연출, "not red" 표시).
- id: f2
  claim: 소행성 베누 시료 1 g 약 960만 달러 (임무 비용 ÷ 가져온 양). NASA 가 2023년 121.6 g 을 가져왔고 임무 비용은 약 10억 달러.
  value: ~$9.6M/g · 121.6 g · ~$1B
  sources: [1, 5]
  verified: true
- id: f3
  claim: 칼리포늄-252 1 g 약 2,560만 달러 (추정). 원자로에서 만들고 오크리지에서 1년에 1 g 도 안 나온다.
  value: ~$25.6M/g
  sources: [1, 2, 6]
  verified: partial
  note: Wikipedia 는 1999년 마이크로그램당 60달러(= g 당 6천만 달러)도 적는다 → 추정치가 출처마다 다름. 화면은 Science Focus 값 + "est."
- id: f4
  claim: 질소 원자를 품은 풀러렌 1 g 1억 달러 이상. 2015년 첫 판매 200 µg(0.0002 g) = 3만 2천 달러.
  value: $100M+ /g
  sources: [1, 2, 7]
  verified: true
  note: 환율 · 시점에 따라 1.1억~1.67억 달러/g → 화면 "$100M+".
- id: f5
  claim: 반물질 1 g 약 59.8조 달러 (추정, Guinness 2025 · Science Focus). 지금까지 만든 총량은 1 g 에 한참 못 미친다.
  value: ~$60T/g
  sources: [1, 2, 9]
  verified: true
  note: 1999 NASA 추정 62.5조 달러도 널리 인용됨 → "~$60 TRILLION".
- id: f6
  claim: 지금까지 캔 모든 금 224,200 t × 132.33달러/g ≈ 29.7조 달러 → 반물질 1 g(59.8조)은 그 약 2배.
  value: ~2×
  sources: [2, 3, 8]
  verified: true
  note: 금값이 오르면 배수가 줄어든다 (금 1 g 266달러가 되면 같아짐) → 업로드 때 금값 다시 확인.
```

## 샷 계획 (33초, 무음 — lang en)
| 시간 | 사진 | English | 한국어 |
|---|---|---|---|
| 0~2.6 | 금괴 (wikimedia-c0c570fb, PD) | Gold. $132 a gram. / Not even top 5. | 금 1 g 132달러 / 5위 안에도 못 든다 |
| 2.6~7.2 | #5 원석 다이아몬드 (wikimedia-05047702, PD, 연출) | Red diamonds / Fewer than 30 known | 붉은 다이아몬드 / 30개도 안 된다 |
| 7.2~11.8 | #4 베누 시료 병 (nasa-80c3b2e3, NASA) | Asteroid dust / ~$1B mission. Only 121.6 g. | 소행성 베누 흙 |
| 11.8~16.4 | #3 칼리포늄 전시 (wikimedia-0d95f95b, CC BY 2.0) | Californium-252 / Made in a reactor. Under 1 g a year. | 칼리포늄 |
| 16.4~21.0 | #2 C60 모형 (wikimedia-19e294a0, PD) | One nitrogen atom in a carbon cage / 0.0002 g sold for $32,000. | 풀러렌 |
| 21.0~25.4 | #1 CERN ALPHA 실험 장치 (wikimedia-e728154a, CC BY 4.0) | Antimatter ~$60 TRILLION / Every bit ever made: nowhere near 1 g. | 반물질 · 흔들림 |
| 25.4~29.0 | 금괴 흐림 + 막대 (wikimedia-529775dc, PD) | One gram = 2× all the gold ever mined. | 반전 |
| 29.0~33.0 | 끝 카드 · 다음 편: 세쿼이아 (wikimedia-a6d74b84, CC BY 2.0) | "You get ONE gram. Which one?" | |

## 연출 카드 (직전 2편 deep5 · hellgate 와 비교)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 금색 · 갈색 (deep5 시안, hellgate 주황) | TOP 5 + 달러 카운터 | blinds | 가까이 들어가기(zoom 1.3~1.75) | $ 기호 · 동전 소리 | 큰 $ 숫자 | 박자 0.5→0.25초로 빨라짐 (deep5 는 느린 펄스) |

## 메타데이터
- 제목: 업로드 직전 yt-seo. 후보 "Priciest Things per Gram — Gold Isn't Even Top 5" / "1 g 에 가장 비싼 것 TOP 5". 1위 이름은 제목에 쓰지 않는다.
- 설명란: 가격은 추정치(BBC Science Focus 2026 · Guinness) · 금값 기준일 · `[사진 출처]` (credits.json, CC BY 표시) · `[음악] 직접 합성한 배경음악` · "연출 화면 = 실제 붉은 다이아몬드 아님".

## 검수
- [x] 숫자는 전부 사실 카드에 있고 출처 2곳 (f3 은 추정치 차이 → "est.")
- [x] 사진 전부 credits.json · 사람 얼굴 사진(NASA 연구원) 삭제
- [x] ALPHA 사진 위쪽 후원사 간판(Carlsberg Foundation)은 확대로 화면 밖 — 스틸 확인
- [x] 글자 겹침 · 안전 영역 스틸 확인
