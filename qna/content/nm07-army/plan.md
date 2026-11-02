# 내모남불 ⑦ 군대편 · 작업 · 청소 · 휴가 · 행군 — 기획 (v1, 2026-11-01)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본 원본은 `script/script.json` (고치면 여기 대본 표도 같이 고친다).
> 2026-11-01 사용자 결정: 틀은 「사촌 형 휴가 + 아빠 회상 4라운드」, 행군 라운드 병장 대사는 **"나 전역 D-30이야. 민간인한테 짐 지우면 그게 불법이지!"**, 그리고 신병이 받아치는 장면을 넣는다.
> 1~6편과 같이 1.25배속, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> 상태 (2026-11-01): 기획 · 대본(67줄, `script/script.json`) · 그림 31장(크롬 Gemini u/0 Pro, `art.json`) · 음성 67줄(크롬 AI Studio — flash-tts u/1 16줄 + u/0 48줄, 신병 3줄은 u/0 flash-lite-tts) · timing(말하는 시간 4.2분 → 1.25배속 약 3.4분). 샷 계획(69박자) · 렌더 3:32 · 쇼츠 Nm07-Short-March 0:27 · 썸네일 가로/세로 · 자막 → 2026-11-01 **공개** 업로드: 본편 https://youtu.be/UDWOIlbQ1nE · 쇼츠 https://youtube.com/shorts/-sbNy2_MmYA.
> 그림 메모: `full/locker-ramen` · `full/leave-calendar` 오른쪽 끝에 이등병 아빠가 한 명 더 그려졌다(기준 그림 둘을 같이 붙인 탓) → 샷 계획에서 왼쪽 2/3 로 잘라 쓴다. `full/march-packs` 는 가운데에 군장 멘 이등병이 하나 더 있는데 "후임 둘이 짐, 병장은 빈손"으로 읽혀 그대로 쓴다. `full/locker-ramen` 은 라면이 거절돼 "빈 컵 · 과자 봉지"로 바꿔 뽑았다. 소품 구석의 작은 핀 자국은 소품 앵커 흔적.
> 분량 메모: 3분을 넘는다 → 샷 계획에서 줄 사이 간격 0, 필요하면 속사포 한 줄 · 요즘 군대 한 줄을 뺀다.

## 0. 조심할 것

- **구타 · 욕설 · 가혹행위는 그리지도 말하지도 않는다.** 군대 코미디는 시키기 · 떠넘기기 · 손가락 먼지 검사 · 휴가 눈치 같은 생활 장면까지만.
- **현역 장병을 놀리지 않는다.** 웃음은 아빠 한 사람의 "그땐 갑질, 지금은 교육" 이중 잣대에서만 나온다. 이번 편에서 제일 멀쩡한 사람은 현역 사촌 형이다. "요즘 군대 편하지?"에는 "편한 게 아니라 시키는 사람이 없어요"로 받는다.
- 실제 부대 이름 · 부대 마크 · 지역 이름을 넣지 않는다. 군복은 마크 없는 무늬 군복, 계급장은 단순한 줄 모양으로.
- **총기는 그리지 않는다.** 행군 장면은 군장(배낭) · 철모까지만.
- 휴대폰 사용 시간 · 봉급 · 휴가 일수 같은 숫자는 화면 · 대사에 쓰지 않는다 (시기 · 부대마다 다르고 자주 바뀐다). 규정 이름과 원칙만.
- 아빠의 군 시절은 "20년 전"으로만. 연도 · 복무 개월 수는 말하지 않는다.
- 끝 화면 주석:
  > ※ 등장하는 인물 · 부대는 꾸민 것입니다. 병영 규정은 일반 설명이며, 시기 · 부대마다 다를 수 있습니다.

## 1. 한 줄 컨셉

토요일 저녁 고깃집, 휴가 나온 사촌 형(현역 일병) 앞에서 아빠의 "라떼는 말이야"가 시작된다. 회상은 라운드마다 두 번 나온다. **이등병 아빠**는 이불 속에서 "고참들 진짜 너무해"라고 속삭이고, 2년 뒤 **병장 아빠**는 같은 짓을 하며 "이건 교육이야~"라고 한다. 사촌 형은 고기를 구우면서 정색한 한 줄로 바로잡는다.
- **타이틀 도장:** "남이 하면 **불—**" + **"침번!"** (불침번)
- **반복 개그 ①:** 아빠가 "라떼는…"이라고 할 때마다 화면 구석에 라떼 컵이 뿅 (`prop/latte` + `pop`). 네 번.
- **반복 개그 ②:** 아빠가 회상에 빠져 있는 동안 고기는 내내 사촌 형이 굽고 있다 (배경). R2 끝 "고기 탄다, 뒤집어"로 한 번 짚고 → 반전에서 회수.
- **복선 → 회수:** 콜드 오픈 "요즘 그거 규정 위반이에요" → 반전에서 고깃집에서도 같은 말. 행군 라운드 "이거 갑질 아닙니까…"는 이등병 아빠 → 신병 → `rewind` 로 이등병 아빠 얼굴, 같은 말이 세 번 돈다.
- **모라구:** "그럼 형도 지금 힘들겠다. 오늘은 아빠가 구워 줘."

## 2. 자료조사

| 자리 | 카드 | 한 줄 (화면) | 근거 | 확인 상태 |
|---|---|---|---|---|
| 콜드 오픈 · 요즘 군대 · 반전 | **정답 카드 · 병끼리 지시 금지** | 분대장 아니면, 병끼리는 시키면 안 돼요. 계급은 순서일 뿐 | 부대관리훈령 「병영생활 행동강령」: 지휘자(병 분대장 · 조장) 외 병 상호관계는 명령복종 관계가 아니고, 병 상호 간 명령 · 지시를 할 수 없다. 위반하거나 묵인하면 엄중 문책. 2011년 지시로 하달 → 훈령. 대법원 2018도12270(2021-03-11)이 조문을 인용 | 판례 · 보도로 확인. **업로드 전 국가법령정보센터 원문(조 번호) 다시 확인** |
| R3 | **정답 카드 · 휴가는 법으로 보장** | 군인은 휴가 · 외출 · 외박을 보장받는다 | 「군인의 지위 및 복무에 관한 기본법」 제18조(휴가 등의 보장) ① 군인은 대통령령으로 정하는 바에 따라 휴가 · 외출 · 외박을 보장받는다. (전시 등에는 지휘관이 제한 가능) | 조문 확인 (위키문헌 · 공포본 목차). 현행 문구는 원문으로 한 번 더 |
| 요즘 군대 | 일과 후 휴대폰 | 일과 끝나면 폰도 써요 | 2018년 시범 → 2020년 7월 모든 부대 일과 후 사용 전면 시행 (국방부, 언론 다수) | 확인 |
| 요즘 군대 | 동기 생활관 | 요즘은 동기끼리 방 써요 | 국방부 병영문화 개선: 분대 단위 침대형 생활관은 동기로, 단계적 확대 (부대 여건에 따라) | 확인. 모든 부대가 다 그런 건 아니라서 대사는 "동기끼리 방 쓰는 데가 많아요"로 |
| R1 | **심리학 카드 · 행위자-관찰자 편향** | 남이 쉬면 게을러서, 내가 쉬면 사정이 있어서 | Jones & Nisbett (1971) | 교과서 정의 |
| R2 | **심리학 카드 · 편향 맹점** (bias blind spot) | 남의 허점은 잘 보이고, 내 허점은 안 보인다 | Pronin, Lin & Ross (2002) | 교과서 정의 |
| R4 | **심리학 카드 · 공감 격차** (empathy gap) | 지금 안 힘들면, 힘든 사람의 아픔을 작게 본다 | Loewenstein 의 hot–cold empathy gap · Nordgren, Banas & MacDonald (2011) 사회적 고통의 공감 격차 | **대본 확정 전 원문 요지 확인** |

**검색에서 얻은 힌트 (`upload/upload.md` 키워드 조사):** "고참 신병"(중앙값 197만, 최근 60일 10개)과 "요즘 군대"(최근 60일 9개)가 지금 뜨거운 말. "군대 짬"(177만) · "군대 내로남불"(128만) · "이등병 병장"(191만)은 꾸준한 말. 자동완성 "요즘 군대 생활관" · "군대 휴대폰 사용" — 요즘 군대 박자와 같은 결.

**내모남불 카운터 (9 + 그냥 오답)**
1. 콜드 오픈 — 이등병 땐 갑질, 병장 땐 교육
2. R1 작업 — 남이 쉬면 농땡이, 내가 쉬면 지휘
3. R2 청소 — 남의 먼지는 불량, 내 먼지는 추억
4. R3 휴가 — 남이 가면 벌써, 내가 가면 당연
5. R4 행군 — 내가 하면 할 말, 남이 하면 말대꾸
6 · 7 · 8. 속사포 — TV 채널 · 샤워 순서 · 고기 두 점
9. 반전 — 남이 시키면 갑질, 내가 시키면 가족 사랑 → "집게는 바뀌었지만, 짬은 그대로였습니다. 그냥 오답." → "…역시, 모답맨."

## 3. 인물

**목소리:** 아빠 · 나레이션 · 이등병 · 병장 아빠 Algenib (회상 아빠는 같은 목소리, 이등병은 기어들어가게 · 병장은 느긋하게) / 모라구 Leda / 엄마 Kore / 사촌 형 `cousin` **Enceladus** (새 역할) / 왕고참 `oldsgt` **Algieba** (새 역할) / 신병 `rookie` **Fenrir** (새 역할)

- **사촌 형** (새, 정답 담당) — 21살, 휴가 나온 일병. 짧은 머리, 마크 없는 무늬 군복, 단정하고 조용함. 표정 변화 거의 없이 고기를 구우며 정색 한 줄. 아빠를 "삼촌"이라 부른다. `cousin/normal` 부터 확정.
- **이등병 아빠** (회상) — 20년 전 아빠. 지금 아빠 얼굴 그대로 어리게(머리숱 많음 · 까까머리 · 볼살), 헐렁한 옛 군복, 겁먹은 눈. 지금 아빠 `dad/normal` 을 첨부해서 같은 사람으로.
- **병장 아빠** (회상) — 같은 20대 아빠, 2년 뒤. 모자 삐딱, 느긋한 자세, 부채. 이등병 아빠 그림을 첨부해서.
- **왕고참** (회상, 새) — 이등병 아빠의 병장. 덩치 크고 느긋, 그늘에서 부채질. 무섭지 않고 얄밉게. `oldsgt/normal` 부터.
- **신병** (회상, 새) — 병장 아빠의 후임. 깡마르고 큰 눈, 군장에 파묻힘. 받아치기 담당. `rookie/normal` 부터.

## 4. 대본 (67줄, 원본은 `script/script.json` 로 옮긴다)

편집 메모 (샷 계획 때):
- 회상은 들어갈 때 `rewind` 효과음 + 화면 위 띠 "20년 전 · 이등병" / "2년 뒤 · 병장" (코드). 이등병 장면은 살짝 바랜 색(`fx: vhs`), 병장 장면은 같은 장소를 같은 구도로 → 반반 화면으로 나란히 보여 주는 샷을 라운드마다 하나.
- "라떼는…" 줄마다 구석에 라떼 컵 `pop`.
- 사촌 형 정색 줄: `cutin/cousin-flat` + 고기 굽는 소리(지글) 바닥에 깔기.
- 행군 받아치기: 신병 "이거 갑질 아닙니까…" → 병장 아빠 "요즘 애들은~" → `rewind` 로 이등병 아빠가 같은 말 하던 컷을 0.8초 → `smash`. D-30 달력은 코드로.
- 요즘 군대: 옛 침상형 생활관 → `wipe` → 요즘 침대형 생활관 (반반 화면).
- 아이 눈높이: `iris` 로 들어가 cut 만, 효과음 없음, `calm`.
- 반전 "쌈 싸서 아빠 입에~": `boing` → 사촌 형 정색 → 엄마 한 줄에 `scratch`.

### 콜드 오픈
| 컷 | 대사 (한 / 영) |
|---|---|
| c00 | 사촌 형: "삼촌, 저 휴가 나왔습니다!" / *Uncle, I'm home on leave!* |
|  | 아빠: "오, 일병! 군대는 말이야, 라떼는…" / *Oh, Private First Class! Let me tell you, back in my day…* |
| c00a | 이등병 아빠: "고참이 시키는 건… 다 갑질이야…" (이불 속) / *Whatever the seniors make us do… it's all bullying…* (under the blanket) |
|  | 병장 아빠: "야, 막내! 양말 좀 개 봐. 이건 교육이야~" / *Hey, rookie! Fold my socks. It's for your training~* |
| c00b | 사촌 형: "삼촌, 요즘 그거 규정 위반이에요." / *Uncle, that's against regulations now.* |
|  | 아빠: "…네?" / *…Huh?* |
| c00c | 나레이션: "이등병 땐 갑질, 병장 땐 교육. 내모남불, 하나." / *As a private: bullying. As a sergeant: training. Double standard, number one.* |
|  | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* |

### 사건 개요
| 컷 | 대사 (한 / 영) |
|---|---|
| c01 | 나레이션: "사건 개요. 토요일 저녁, 고깃집. 조카 휴가 기념." / *Case summary. Saturday night, Korean BBQ. Celebrating a nephew's leave.* |
|  | 모라구: "아빠, 짬이 뭐야?" / *Dad, what's "jjam"?* |
|  | 아빠: "군대에서 먹은 밥그릇 수. 많을수록 세지." / *How many army meals you've eaten. The more, the stronger.* |

### ROUND 1 작업
| 컷 | 대사 (한 / 영) |
|---|---|
| c02 | 나레이션: "딱 네 판만 하죠. 1라운드, 작업." / *Just four rounds. Round one: work detail.* |
|  | 이등병 아빠: "땡볕에 삽질하는데, 병장님은 그늘에서 감독만…" / *We're digging in the blazing sun, and the sergeant just "supervises" from the shade…* |
| c02a | 왕고참: "어이, 거기 삽 각도 좋다~" (부채질) / *Hey, nice shovel angle there~* (fanning himself) |
|  | 이등병 아빠: "저게 무슨 작업이야!" (속으로) / *How is that work?!* (in his head) |
| c02b | 병장 아빠: "난 경험으로 지휘하는 거야~ 모 어때." (그늘, 부채) / *I lead with experience~ So what.* (in the shade, fanning) |
|  | 모라구: "아빠도 그늘에 있었네?" / *So you were in the shade too?* |
| c02c | 나레이션: "남이 쉬면 농땡이, 내가 쉬면 지휘. 내모남불, 둘." / *They rest: slacking. I rest: leadership. Double standard, number two.* |
|  | 사촌 형: "남이 쉬면 게을러서, 내가 쉬면 사정이 있어서." / *When others rest, they're lazy. When I rest, I have my reasons.* |
| c02d | 사촌 형: "행위자-관찰자 편향이래요." / *It's called the actor-observer bias.* |

### ROUND 2 청소
| 컷 | 대사 (한 / 영) |
|---|---|
| c03 | 나레이션: "2라운드. 청소." / *Round two: cleaning.* |
|  | 이등병 아빠: "창틀까지 반짝반짝, 다 닦았습니다!" / *Everything's spotless, even the window frames!* |
| c03a | 왕고참: (손가락 쓱) "먼지. 다시." / *(finger swipe) Dust. Again.* |
|  | 병장 아빠: (손가락 쓱) "먼지. 다시~" / *(finger swipe) Dust. Again~* |
| c03b | 신병: "병장님 관물대에… 라면 국물이…" / *Sergeant, your locker… there's ramen soup…* |
|  | 병장 아빠: "그건 먼지가 아니라, 추억이야." / *That's not dirt. That's a memory.* |
| c03c | 나레이션: "남의 먼지는 불량, 내 먼지는 추억. 내모남불, 셋." / *Their dust: a violation. My dust: a memory. Double standard, number three.* |
|  | 사촌 형: "남의 허점은 잘 보이고 내 건 안 보이는 거, 편향 맹점이래요." / *Seeing others' flaws but not your own — that's the bias blind spot.* |
| c03d | 아빠: "…고기 탄다, 뒤집어." / *…The meat's burning. Flip it.* |

### ROUND 3 휴가
| 컷 | 대사 (한 / 영) |
|---|---|
| c04 | 나레이션: "3라운드. 휴가." / *Round three: leave.* |
|  | 이등병 아빠: "좋은 날짜는 고참들이 다 가져가고, 전 남은 날만…" / *The seniors take all the good dates, and I get the leftovers…* |
| c04a | 병장 아빠: "휴가는 짬 순서지. 당연한 거야." / *Leave goes by seniority. Obviously.* |
|  | 신병: "저… 다음 달 휴가 신청…" / *Um… I'd like to request leave next month…* |
|  | 병장 아빠: "벌써?!" / *Already?!* |
| c04b | 나레이션: "남이 가면 벌써, 내가 가면 당연. 내모남불, 넷." / *They go: already? I go: obviously. Double standard, number four.* |
|  | 사촌 형: "삼촌, 휴가는 짬이 아니라 법으로 보장돼요." / *Uncle, leave isn't about seniority. It's guaranteed by law.* |
| c04c | 사촌 형: "군인은 휴가, 외출, 외박을 보장받는다." / *"Service members are guaranteed leave, passes, and overnights."* |
|  | 아빠: "법에 있어?!" / *That's in the LAW?!* |

### ROUND 4 행군
| 컷 | 대사 (한 / 영) |
|---|---|
| c05 | 나레이션: "마지막 4라운드. 행군." / *Final round four: the march.* |
|  | 이등병 아빠: "고참 짐까지 메고… 이거 갑질 아닙니까…" (작게) / *Carrying the seniors' packs too… isn't this bullying…* (quietly) |
| c05a | 병장 아빠: "나 전역 D-30이야. 민간인한테 짐 지우면, 그게 불법이지!" / *I'm 30 days from discharge. Making a civilian carry stuff? Now THAT'S illegal!* |
|  | 신병: "이거 갑질 아닙니까…" / *Isn't this bullying…* |
| c05b | 병장 아빠: "요즘 애들은 말이 너무 세~" / *Kids these days, so mouthy~* |
|  | 나레이션: "내가 하면 할 말, 남이 하면 말대꾸. 내모남불, 다섯." / *When I say it: speaking up. When they say it: talking back. Double standard, number five.* |
| c05c | 사촌 형: "삼촌, D-30도 군인이에요." / *Uncle, 30 days left is still a soldier.* |
|  | 사촌 형: "지금 안 힘들면, 힘든 사람 아픔을 작게 본대요. 공감 격차." / *When you're not hurting, you underestimate someone else's pain. The empathy gap.* |

### 속사포
| 컷 | 대사 (한 / 영) |
|---|---|
| c06 | 나레이션: "보너스 라운드. 속사포 내모남불!" / *Bonus round. Rapid-fire double standards!* |
|  | 아빠: "남이 채널 잡으면 독재, 내가 잡으면 짬!" / *They hog the remote: dictatorship. I do: seniority!* |
| c06a | 아빠: "남이 먼저 씻으면 새치기, 내가 먼저 씻으면 서열!" / *They shower first: cutting in line. I do: rank!* |
|  | 아빠: "남이 고기 두 점이면 욕심, 내가 두 점이면 체력 관리!" / *They take two pieces: greedy. I do: fitness management!* |
|  | 나레이션: "내모남불, 여섯, 일곱, 여덟!" / *Double standard: six, seven, eight!* |

### 요즘 군대
| 컷 | 대사 (한 / 영) |
|---|---|
| c07 | 아빠: "그래도 라떼는 낭만이 있었지. 요즘 군대는 편하지?" / *Still, back in my day there was romance. The army's easy these days, right?* |
|  | 사촌 형: "편한 게 아니라, 시키는 사람이 없어요." / *It's not easy. There's just nobody bossing you around.* |
| c07a | 사촌 형: "동기끼리 방 쓰는 데가 많고, 일과 끝나면 폰도 해요." / *A lot of units room you with your own intake, and after hours we can use our phones.* |
|  | 아빠: "…그럼 막내는 누가 시켜?" / *…Then who bosses the rookie around?* |
|  | 사촌 형: "아무도요." / *Nobody.* |

### 아이 눈높이
| 컷 | 대사 (한 / 영) |
|---|---|
| c08 | 모라구: "아빠, 이등병 때 힘들었어?" / *Dad, was it hard being a private?* |
|  | 아빠: "응. 많이." / *Yeah. Really hard.* |
|  | 모라구: "그럼 형도 지금 힘들겠다. 오늘은 아빠가 구워 줘." / *Then it must be hard for him now too. You grill today, Dad.* |
|  | 아빠: "…그래. 오늘은 삼촌이 굽는다." / *…Okay. Tonight, your uncle grills.* |

### 반전
| 컷 | 대사 (한 / 영) |
|---|---|
| c09 | 아빠: (집게를 들고) "자, 막내! 쌈 싸서 아빠 입에~" / *(holding the tongs) Alright, rookie! Wrap one up and feed it to Daddy~* |
|  | 사촌 형: "삼촌, 그거 요즘 규정 위반이에요." / *Uncle, that's against regulations now.* |
| c09a | 아빠: "여긴 고깃집이야!" / *This is a BBQ restaurant!* |
|  | 엄마: "여보, 당신 전역한 지 이십 년이야." / *Honey, you were discharged twenty years ago.* |
| c09b | 나레이션: "남이 시키면 갑질, 내가 시키면 가족 사랑. 내모남불, 아홉." / *They give orders: bullying. I give orders: family love. Double standard, number nine.* |
|  | 나레이션: "집게는 바뀌었지만, 짬은 그대로였습니다. 그냥 오답." / *The tongs changed hands, but the seniority stayed. Just a wrong answer.* |
| c09c | 아빠: "…역시, 모답맨." / *…Classic Modapman.* |

## 5. 그림 목록 (`script/art.json`, 31장)

- **새 인물 기준 그림 먼저 (5):** `cousin/normal` → `oldsgt/normal` → `rookie/normal` → `dadyoung/private` (지금 아빠 `dad/normal` 첨부) → `dadyoung/sergeant` (이등병 아빠 첨부)
- **배경 (5):** `bg/bbq` (고깃집 테이블 · 불판, 토요일 저녁) · `bg/barracks-old` (옛 침상형 생활관) · `bg/field-sun` (땡볕 작업장, 그늘 나무 하나) · `bg/march-road` (흙길 행군) · `bg/barracks-now` (침대형 동기 생활관)
- **컷인 (4):** `cutin/dad-latte` (아빠 라떼 자랑 얼굴) · `cutin/cousin-flat` (사촌 형 정색, 집게 든 채) · `cutin/dadyoung-whisper` (이불 속 속삭이는 이등병 아빠) · `cutin/dadyoung-smug` (병장 아빠 느긋한 웃음)
- **장면 (7):** `full/shovel-shade` (땡볕 삽질 이등병 + 그늘 왕고참) · `full/sgt-dad-shade` (같은 구도, 그늘에 병장 아빠) · `full/finger-dust` (창틀 손가락 검사) · `full/locker-ramen` (라면 국물 관물대, 신병 당황) · `full/leave-calendar` (휴가 달력 앞 눈치) · `full/march-packs` (군장 두 개 멘 신병 + 빈손 병장 아빠) · `full/bbq-tongs` (반전: 집게 든 아빠 · 쌈 든 모라구 · 정색 사촌 형 · 엄마)
- **소품 (8):** `prop/latte` (라떼 컵 — 반복 개그) · `prop/shovel` · `prop/fan` (부채) · `prop/socks` · `prop/tongs` (집게) · `prop/phone` · `prop/backpack` (군장) · `prop/ramen`
- **재사용:** 공통 가족 포즈 · 컷인 · 아빠 시그니처 `dad-sig-1~3` · 엄마 `mom-sig-*`
- **코드로 그리는 것:** 타이틀 도장("침번!") · ROUND · BONUS 카드 · 정답 카드 2 (병끼리 지시 금지 · 휴가 보장) · 심리학 카드 3 · 회상 띠("20년 전 · 이등병" / "2년 뒤 · 병장") · D-30 달력 · 반반 화면 · 끝 화면
- 그림 규칙: 군복은 마크 없는 무늬, 계급장은 단순한 줄, 총기 없음. 회상 아빠 둘은 지금 아빠와 같은 사람으로 보여야 한다 (뽑은 뒤 `dad/normal` 과 나란히 비교).
- 순서: `script/art.json` 작성 → `npm run prompts -- nm07` (⚠️ 는 새 인물 normal 이 없어서 — 그것부터) → `npm run artrefs -- nm07` → 크롬 Gemini → `npm run artreview -- nm07` → `npm run art -- nm07`

## 6. 제목 · 썸네일

제목 · 설명 · 태그는 `upload/upload.md` (seo 칸에 2026-11-01 조사 결과).

**제목 후보 (지금 뜨거운 "고참 신병" · "요즘 군대"를 앞에, 끝에 `| 내모남불`):**
1. `고참 신병 군대 내로남불 | 이등병 땐 갑질, 병장 되니 교육? 요즘 군대 · 짬 · 휴가 | 내모남불` ← 추천
2. `군대 내로남불 | 신병 땐 억울, 고참 되니 당연? 이등병 병장 · 요즘 군대 | 내모남불`
- 영어: `Army Double Standards | Bullying as a Private, "Training" as a Sergeant? | Naemonambul`

**썸네일:** 위 "이등병 땐 갑질!"(흰) / "병장 되니 교육~"(노랑) · 작은 셋째 줄 "군대편" · 반반 화면(왼쪽 겁먹은 이등병 아빠, 오른쪽 부채 든 병장 아빠) + 구석 사촌 형 정색 · 카운터 9. 1~6편과 색이 겹치지 않게 **카키 + 형광 노랑**.
**쇼츠 세로 썸네일:** `thumb.vertical` (docs/shorts-thumbnail.md) — "이등병 땐 / 갑질!" + 도장 "병장 땐 교육?!" + 병장 아빠 스티커 + 부채.

## 7. 한 문장 정리

이등병 때 억울했던 일은, 병장이 돼도 남에게는 똑같이 억울하다.
