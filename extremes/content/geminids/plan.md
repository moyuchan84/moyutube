# Geminids: 30초에 하나? 12월 쌍둥이자리 유성우 (Sky Calendar ①)

- 소재 한 줄: 쌍둥이자리 유성우(Geminids)는 대부분의 유성우와 달리 소행성 3200 Phaethon 에서 나오고, 2026-12-13~14 밤에 정점이다. 완벽한 조건에서 시간당 약 120개(30초에 하나), 보통 어두운 하늘에서는 40~50개(NASA).
- 왜 이 소재: `npm run trends` 2026-11-21 — 사자자리 유성우 영상이 구독 7천 채널에서 180만 회(4일), "meteor shower" 씨앗 주제의 작은 채널 돌파 15편(최다). Commons 5.5K · NASA 사진 검색 결과 있음. **시기성 소재 → 12월 8~12일 업로드**(정점 며칠 전, 검색이 오르는 때).
- 형식: 질문형 한 곳(한 현상) + 숫자 하나 + 반전("혜성이 아니다").
- 시리즈: SKY CALENDAR ① (다음 ② eclipse27).

## 출처 (확인일 2026-11-21, 원문 페이지를 직접 읽음)
| # | 기관/사이트 | 문서 | URL | 확인 |
|---|---|---|---|---|
| 1 | NASA Science | Geminids (활동 12-4~17, 정점 12-13~14, 모천체, 시간당 수) · 페이지 갱신 2026-08-13 | https://science.nasa.gov/solar-system/meteors-meteorites/geminids/ | 읽음 |
| 2 | NASA Science | Meteor Showers 목록 ("Peak night: Dec. 13-14") · 갱신 2026-09-21 | https://science.nasa.gov/meteor-showers/ | 읽음 |
| 3 | American Meteor Society | 유성우 달력 (정점 12-13~14, 달 15% 초승달) | https://www.amsmeteors.org/calendar/ | 읽음 |
| 4 | EarthSky | Geminid meteor shower 안내 (예측 정점 5:44 UTC 12-14, ZHR 120) · 2026-01-06 게시, 본문에 2025년 문장이 남아 있음 | https://earthsky.org/astronomy-essentials/everything-you-need-to-know-geminid-meteor-shower/ | 읽음 |
| - | In-The-Sky.org | 봇 차단(Access Denied)으로 읽지 못함 | https://in-the-sky.org | 사용 안 함 |

## 사실 카드
```yaml
- id: f1
  claim: 2026 Geminids 정점 밤
  value: 12월 13~14일 (활동 12월 4~17일). NASA Geminids 페이지 · NASA 목록 · AMS 달력이 모두 같다.
  note: 정점 시각은 쓰지 않는다 (EarthSky 5:44 UTC 는 AMS 인용 예측, NASA 는 시각 없음). 화면 "Peak night: Dec 13–14".
  sources: [1, 2, 3]
  verified: true
- id: f2
  claim: 시간당 유성 수
  value: NASA 본문 "완벽한 조건에서 시간당 120개", 같은 페이지 요약 "어두운 하늘에서 40~50개". EarthSky ZHR 120.
  note: "30초에 하나" 는 120개 조건에서만 성립. 화면에는 "up to ~120/hr in perfect conditions" 와 "typically 40–50 under dark skies (NASA)" 를 함께 쓴다.
  sources: [1, 4]
  verified: true
- id: f3
  claim: 120개/시간 = 30초에 하나, 40~50개/시간 = 약 1~1.5분에 하나
  value: 3,600 ÷ 120 = 30 초, 3,600 ÷ 50 = 72 초, 3,600 ÷ 40 = 90 초 (자체 계산)
  verified: true
- id: f4
  claim: 모천체는 소행성 3200 Phaethon
  value: NASA "Unlike most meteor showers which originate from comets, the Geminids originate from an asteroid: 3200 Phaethon" — 같은 페이지 정보 상자에는 "an asteroid or a possible rock comet".
  note: 화면에는 "from an asteroid (3200 Phaethon)" 대신 "mostly from comets — this one from an asteroid" 정도로. "유일" 금지. 단정 대신 "NASA: an asteroid" 로 출처를 붙인다.
  sources: [1, 4]
  verified: true
- id: f5
  claim: 정점 밤 달 상태
  value: AMS "15% 밝기 초승달 (waxing crescent), 간섭 적음". EarthSky "waxing crescent, 방해 없음" (퍼센트 없음).
  note: 쓰려면 "waxing crescent Moon — dark sky" 정도. 퍼센트는 AMS 만 → 쓰지 않는다.
  sources: [3, 4]
  verified: true
```

## 샷 계획 (24초, 무음 + BGM, script/shots.json)
| 시간 | 장면 | 한국어 | English | 움직임 |
|---|---|---|---|---|
| 0~3 | 밤하늘 별밭(코드 그래픽) 위로 유성 한 줄 | 30초에 하나씩 떨어진다고? | One shooting star every 30 seconds? | 별밭 천천히 확대 + 유성 |
| 3~7 | 유성 사진(NASA/Commons) | 12월 13~14일 밤 정점 | Peak night: Dec 13–14, 2026 | 켄 번즈 |
| 7~12 | 소행성 Phaethon 그래픽/사진 | 대부분의 유성우는 혜성에서 온다. 이건 소행성에서 | Most showers come from comets. This one: an asteroid. | 궤도 그래픽 |
| 12~18 | 두 개의 타이머 그래픽 (30초 / 72초) | 완벽한 조건: 시간당 약 120개 · 어두운 하늘: 40~50개 | Perfect conditions: up to ~120/hr · Dark skies: 40–50/hr (NASA) | 숫자 카운트업, 타이머 점멸 |
| 18~21 | 초승달 아이콘 + 별 (코드) | 초승달이라 어두운 하늘에서 보기 좋다 | A thin crescent Moon: dark skies for viewing | 정지 + 반짝임 |
| 21~24 | 끝 카드 | 다음 편: 2027년 개기일식 (구독하면 이어서 보여요) / 어디서 볼 건가요? | Next: the 2027 total eclipse / Where will you watch? | 첫 장면으로 이어 붙임 |
- 부가가치 요소: 직접 만든 "30초 vs 72초 타이머" 비교 그래픽 (둘 다 NASA 숫자 기반).
- 끝 카드 댓글 질문: "어디서 볼 건가요?" (자기 경험 말하게).
- 제목은 질문만 던지고 답을 쓰지 않는다 (규칙). 답("완벽한 조건에서만")은 영상 안에서.

## 연출 카드 (직전 2편과 4항목 이상 달라야 함 — 직전 편 확인 후 조정)
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 남색 + 시안 유성 | 위 그래픽/사진, 아래 한·영 글자 | 번쩍임 컷 | 느린 확대 | 30초 타이머 | 영어 크게 · 한국어 작게(영어 중심 규칙) | 약 4초 샷 |

## 제목(한·영) · 업로드 — yt-seo 필요
- 후보: `Geminids 2026: One Shooting Star Every 30 Seconds? | 쌍둥이자리 유성우` (질문형, 답 쓰지 않기)
- **TODO**: `npm run seo -- extremes geminids "geminid meteor shower 2026"` 로 수요 확인 후 확정.

## 사진 (collect)
- **TODO**: `npm run collect -- geminids "Geminid meteor" --dry` → 후보와 라이선스 확인 후 받기. 사람 얼굴 · 로고 있는 사진 제외. 코드 그래픽으로 채울 수 있다.

## 검수
- [x] 사실 카드 f1~f5 를 NASA · AMS · EarthSky 원문으로 확인 (2026-11-21)
- [ ] 설명란에 사실 기준일 · NASA 페이지 링크
- [ ] 사진 라이선스 확인 · credits.json
- [ ] 글자 안전 영역(아래 y≈1560 · 오른쪽 x>950 · 위 y<200 피하기)
- [ ] 업로드 날짜: 2026-12-08~12 (정점 전), 사용자 확인 후
