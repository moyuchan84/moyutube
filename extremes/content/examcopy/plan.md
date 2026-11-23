# 시험 답안을 베껴 쓰던 사람들 (과거제) — "Judges Never Saw Your Handwriting"

- 소재 한 줄: 옛 과거 시험은 컨닝을 막으려고 **응시자의 답안을 서기가 붉은 글씨로 통째로 다시 베껴** 채점관에게 넘겼다. 필체로 누구 답안인지 알 수 없게 하려는 장치.
- 왜 이 소재 (yt-seo 2026-11-22): "How Different Countries CHEAT in exams" 650만 · "SAT vs. Gaokao" 1,060만 · "This Chinese Exam Took 9 Days in a Tiny Box" 690만(2026-10). "imperial examination" 최근 60일 영상 중앙값 2.3만. 한국어 "조선 과거" 중앙값 1,000 이라 **영어 중심**으로, 조선은 비교 한 컷. 요즘 AI 컨닝 화제(수능 스마트 안경)와 "시험은 늘 속임수를 막아 왔다"로 이어진다.
- 형식: 질문형 + 짝 비교 (중국 ↔ 조선). 영어 중심(`lang: en`).
- 하지 않는 것: 컨닝 방법 재현(어떻게 숨겼나) · 실존 인물 이름 · "과거 컨닝은 사형이었다" 같은 일반화.

## 출처 (2026-11-22, 하위 에이전트가 원문을 읽은 것 — 영상 전에 아래 ⚠ 표시는 다시 열어 본다)
| # | 기관/사이트 | 문서 | URL |
|---|---|---|---|
| 1 | Wikipedia (Miyazaki 1976 pp.18–25 인용) | Imperial examination — Qing 절차 | https://en.wikipedia.org/wiki/Imperial_examination |
| 2 | China Daily | Whispers from the hall of secrets (답안을 관리가 베낌) | https://govt.chinadaily.com.cn/s/202510/28/WS69001e8b498e23165e069b0d/whispers-from-the-hall-of-secrets_4.html |
| 3 | 한국민족문화대백과 | 과거 (E0004562) — 역서 · 봉미 · 사수 | https://encykorea.aks.ac.kr/Article/E0004562 |
| 4 | 경향신문 | 조선 과거 부정행위 (거벽 · 사수) | https://www.khan.co.kr/article/202111220603001 |
| 5 | 한국민족문화대백과 | 과옥 (E0004592) · 정거 (E0049908) — 처벌 | https://encykorea.aks.ac.kr/Article/E0004592 |

## 사실 카드
```yaml
- id: f1   # 중국 — 이름 가리기
  claim: 응시자 신원 정보를 지우고 답안지에 번호를 매겨 채점관이 누구 것인지 모르게 했다 (청 절차). 이름 가리기 시작은 당 702 라는 서술은 Wikipedia 각주뿐 → 연도 말하지 않는다
  sources: [1]
  verified: partial
- id: f2   # 중국 — 베껴 쓰기
  claim: 필사 담당 관청이 각 답안을 3번 다시 베껴 채점관이 필체로 작성자를 알아보지 못하게 했다 (청). 송대 1015 (수도 · 부) / 1037 (지방) 부터 필체 숨기기 도입 — Wikipedia 각주 기준
  sources: [1, 2]
  verified: partial   # 2번 출처는 "관리가 베껴 채점관에게 제출" 까지만. "3번" 은 1번(Wikipedia → Miyazaki)만 → "여러 번" 으로 쓰거나 Miyazaki 원문 확인
- id: f3   # 조선 — 역서
  claim: 서리(등록 담당)가 응시자 답안을 붉은 글씨(주초)로 옮겨 쓰고 원본과 대조한 뒤 채점. 식년시 · 증광시 · 별시 문과에 적용(알성시 등은 제외)
  sources: [3, 4]
  verified: true
- id: f4   # 조선 — 봉미
  claim: 답안지의 이름 부분을 접어 봉하는 봉미(封彌)
  sources: [3, 4]
  verified: true
- id: f5   # 조선 — 컨닝 팀
  claim: 글을 짓는 거벽(巨擘)과 빠르게 베껴 쓰는 사수(寫手)를 데려가는 일이 있었다 (정약용 『경세유표』 인용). 대리 응시자가 아니라 글쓴이 · 필사자
  sources: [3, 4]
  verified: true
- id: f6   # 조선 — 규모
  claim: 804번의 문과 시험 중 대규모 과옥(科獄)은 숙종 때 두 번 (1699 기묘, 1712 임진)
  sources: [5]
  verified: partial   # 한 곳(대백과). 숫자 804 는 원문 다시 확인
- id: f7   # 처벌 (조선)
  claim: 대리 · 베껴 쓰기 등은 곤장 100 + 도형 3년, 정거(응시 금지) 3년 · 10년 · 영구 등
  sources: [3, 5]
  verified: true
```
- **쓰지 않는 것**: Bai Ling (잘못된 이름, 실제는 Bojun/柏葰) · "컨닝은 사형" · 프린스턴 옷이 컨닝복이라는 단정(학자도 의심) · "서리정 · 홍비"(용어 확인 못 함) · 거벽 · 사수가 대리 응시자라는 말 · 1699 사건 인원(33 vs 34) · 난징 시험장 칸 수 20,644.

## 샷 계획 (≈28초, 무음 — 영어 크게 + 한국어 작게)
| 시간 | 화면 (credits id) | 한국어 | English | 움직임 |
|---|---|---|---|---|
| 0~3s | 1873 광저우 시험장 칸 사진 (CC BY 2.0, 크레딧 필요) 확대 | 옛 시험 컨닝, 어떻게 막았을까? | How did old exams stop cheating? | 천천히 확대 |
| 3~8s | 코드 그래픽: 답안지 한 장(필체 곡선) | 답안은 필체로 들통난다 | Your handwriting gives you away. | 선이 그려짐 |
| 8~15s | 코드 그래픽: 원본 → 붉은 글씨 사본 (조선 역서 / 중국 필사) | 그래서 서기가 붉은 글씨로 베꼈다 | So clerks recopied every paper in red. | 원본 → 사본 이동 |
| 15~20s | 조선 과거 그림 (KOGL 1유형, 국립중앙박물관 — 1유형 확인 후) | 조선도 같은 방법 | Joseon Korea did it too. | 켄 번즈 |
| 20~25s | 코드 그래픽: 이름 접어 봉하기(봉미) | 이름 부분은 접어 봉했다 | Names were folded and sealed. | 접힘 애니 |
| 25~28s | 끝 카드 | 요즘 컨닝은? | Cheating changed. So did the defense. | — |
- 끝 카드: 구독 한 줄("다음 편: 옛날에는 컨닝에 어떤 벌을 줬을까" — 만들 것을 약속) + 댓글 질문("필체가 아니라 AI 답안이라면 어떻게 막을까?").
- 부가가치 요소: 직접 만든 "원본 → 붉은 사본" 도식과 중국 · 조선 비교.
- 3D 시험(선택): 시험장 칸 줄지은 장면을 Remotion 3D 로 한 컷 시험 → 되면 첫 컷에 사용.

## 연출 카드
| 팔레트 | 주 레이아웃 | 장면 전환 | 카메라 | 상징 오브젝트 | 타이포 | 템포 |
|---|---|---|---|---|---|---|
| 먹색 + 주홍(붉은 글씨) | 도식 중심 + 사진 1~2장 | fade (눈 피로 낮춤) | 느린 확대 | 붉은 붓글씨 사본 | 영어 크게, 한국어 작게 | 잔잔, 28초 |

## 메타데이터
- 제목 (한 / 영): "옛 시험은 답안을 통째로 베꼈다" / "Why Judges Never Saw Your Handwriting" (yt-seo 로 다시 정한다)
- 설명란: 사실 + 기준일 + `[사진 출처]` + `[음악] 직접 합성한 배경음악`
- 해시태그 · 태그 ≤ 10 (yt-seo)

## 사진 · 라이선스 (2026-11-22 Commons API 확인)
- 쓸 수 있음: `Examination Hall With 7500 Cells, Canton, China (1873)…` CC BY 2.0 (크레딧) · 조선 무과 합격자 명단 (공공 도메인, 장면 보조).
- KOGL 1유형 후보(원 기관 페이지 확인 후): `함흥에서의 과거시험`, `심상기의 과거 답안지`, `Answer sheet for the gwageo… 01/02` — 국립중앙박물관.
- 못 씀(CC BY-SA): Jiangnan03.jpg · Prüfungszellen-Nanking.jpg · Imperial examination cheating material.JPG.
- 사람 얼굴: 재현 사진(Gwageo Siheom Reenactment, CC BY-SA) 쓰지 않음.

## 검수
- [ ] f2 "3번" 은 원문 확인 전에는 "여러 번" 으로
- [ ] f6 804 · 두 번 확인
- [ ] 쓰는 KOGL 자료는 원 기관 페이지에서 1유형 확인, credits.json 기록
- [ ] 인물 얼굴 · 로고 · 상표 없음, 컨닝 방법 재현 없음
- [ ] 정지 장면 2초 이하 · 글자가 쇼츠 안전 영역 밖
- [ ] 제목 · 썸네일에 반전(필체를 숨겼다) 직접 쓰지 않음
