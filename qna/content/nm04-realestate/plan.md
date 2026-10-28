# 내모남불 ④ 부동산편 · 호가 · 호재 · 영끌 — 기획 (v1, 2026-10-28)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본을 고치면 여기 대본도 같이 고친다 (`script/script.json` 이 생긴 뒤에는 그쪽이 원본).
> `docs/naemonambul-ideas.md` 의 **B-2 집값편**을 사용자 요청 소재(호가 · 호재 · 기피시설 · 현수막 · 거래량 · 세대수 · 전세 · 월세 · 이자 · 담보대출 · 영끌, "사기 전엔 떨어져야 → 사면 오를 거야", "팔면 폭락할 거야")로 넓혔다.
> 세 라운드 + **속사포 라운드**까지 한 편으로 만든다. 반응이 좋으면 확장편(대출 · 전세 · 청약 등)을 따로 만든다 (2026-10-28 사용자).
> 1~3편과 같이 1.25배속, gap 0, `chop: 42`, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> 상태 (2026-10-28): 기획 · 대본 `script/script.json`(56줄) · 그림 목록 `script/art.json`(새 그림 23장 + 3편에서 복사 2장) · 프롬프트 생성. 그림 · 음성 · 샷 계획 전.

## 0. 돈편 조심할 것 (주식편 규칙 그대로 + 부동산에 맞게)

- 실제 지역명 · 단지명 · 역 이름 · 가격 · 수익률, "사라 / 팔라" 를 대사 · 화면 · 그림 어디에도 넣지 않는다.
  - 시세표는 **▲▼ 와 "○억"** 만 쓴다. 현수막의 역 이름은 꾸민 이름 **"모라구역"** 이다.
- 웃음은 아빠의 **마음**(자기 합리화 · 이중 잣대)에서만 나온다. 영끌한 사람 · 세입자 · 집주인을 비웃지 않는다.
- **기피시설은 소각장**(물건으로 된 시설)만 쓴다.
  - 특수학교 · 임대주택 · 요양 · 복지 시설은 실제 차별 논란이 있어서 쓰지 않는다.
  - 소각장도 더럽거나 무섭게 그리지 않는다.
  - 결론은 찬반이 아니라 사장님의 질문 하나로 맺는다: "다들 우리 동네는 안 된다시면… 어디에 짓죠?"
- 대출 규제(LTV · DSR) · 세금 · 정부 정책 · 정치 이야기는 하지 않는다.
- 사장님은 오른다 · 내린다를 말하지 않는다. 사장님 생김새 설정이 이 원칙을 지키는 인물이다.
- 끝 화면 주석:
  > ※ 특정 지역 · 단지 · 투자를 권하지 않습니다. 등장하는 시세표 · 역 · 시설 · 화면은 꾸민 것이며, 심리학 용어와 법 설명은 일반 설명입니다. 개별 상담은 전문가에게.

## 1. 한 줄 컨셉

토요일 오전, 동네 부동산. 전세 만기를 앞두고 "보러만 온" 모 씨네가 그날 계약을 해 버린다. 그때부터 일 년 동안 아빠는 사는 자리에 따라 말이 바뀐다.
- **살 때 · 산 뒤:** 사기 전엔 "거품, 떨어져야 돼"였는데, 도장을 찍자마자 "이제 오를 일만 남았다".
- **호가:** 남의 호가는 "희망 사항, 거래량을 봐"인데, 옆 동 호가는 "이제 우리 집 시세". 단톡방 담합에 '좋아요'를 누른다.
- **호재와 기피시설:** 남의 동네 역은 "설레발", 우리 동네 현수막은 "확정". 남의 동네 소각장은 "필요한 시설"인데, 우리 동네면 "결사반대".
- **영끌과 이자:** 친구 영끌은 "무리했네", 우리 대출은 "레버리지". 월세는 "버리는 돈"이라더니 이자는 "투자 비용".
- **속사포:** 세대수 · 전세 · 현수막.
- **팔 때:** "꼭대기에서 팔았다, 이제 폭락한다" → 또 올랐다 → "거품이야" → 사장님 "그 말씀, 일 년 전에도 하셨습니다."
- **모라구:** "올라도 내려도, 내 방은 그대로야."
- **사장님 시그니처:** 계산기를 탁탁 두드리며 정색 한 줄. 아빠가 매주 와서 "우리 집 얼마예요?"를 묻는 것이 이어지는 개그다.

## 2. 자료조사 — 카드 다섯 장 + 법 카드 하나

숫자(실험 계수 · 처벌 금액)는 대사 · 화면에 쓰지 않는다. 이름과 한 줄 정의만 쓴다.

| 자리 | 카드 | 한 줄 정의 (화면) | 근거 | 확인 상태 |
|---|---|---|---|---|
| R1 호가 | **보유 효과** (endowment effect) | 내 것이 더 비싸 보인다 | Thaler (1980) · Kahneman, Knetsch & Thaler (1990) 머그잔 실험 | 교과서 정의 |
| R1 단톡방 | **법 카드 · 집값 담합 금지** | "이 가격 밑으로 내놓지 말자" — 법으로 금지 | 공인중개사법 제33조 제2항 (2020년 2월 시행, 시세에 부당한 영향을 줄 목적으로 특정 가격 이하로 중개를 의뢰하지 않도록 유도하는 행위 금지) · 벌칙 제48조 | **조문 원문을 국가법령정보센터에서 다시 확인한 뒤 대본 확정.** 지금 확인한 것은 법률사무소 사례 페이지(lawwin.co.kr) 하나. 처벌 수위는 화면에 쓰지 않는다 |
| R2 호재 | **확증 편향** (confirmation bias) | 보고 싶은 소식만 믿는다 | Wason (1960) · Nickerson (1998) 리뷰 | 교과서 정의 |
| R2 소각장 | **님비** (NIMBY, Not In My Back Yard) | 필요한 건 알지만, 우리 동네만은 안 된다 | 사회 현상 용어 (심리학 실험 아님) | 용어 정의만 쓰고 찬반은 말하지 않는다 |
| R3 영끌 | **낙관 편향** (optimism bias) | 나만은 괜찮을 거라고 믿는다 | Weinstein (1980) *Unrealistic optimism about future life events* | 교과서 정의 |
| 반전 | **신 포도** (인지 부조화) | 못 가진 것은 깎아내린다 | 이솝 「여우와 신 포도」 · Festinger (1957) 인지 부조화 이론 | 교과서 정의 |

**말 풀이 (영어 자막에서 처음 한 번):** 전세(jeonse — 큰 보증금을 맡기고 사는 한국식 임대), 호가(asking price), 호재(good news that may lift prices), 영끌(borrowing every last won).

**내모남불 카운터 (10 + 그냥 오답)**
1. 콜드 오픈 — 사기 전엔 거품, 사고 나면 바닥
2. R1 — 남의 호가는 희망 사항, 우리 호가는 시세
3. R2 — 남의 호재는 설레발, 우리 호재는 확정 (확증 편향)
4. R2 — 남의 동네엔 필요하고, 우리 동네엔 결사반대 (님비)
5 · 6. R3 — 남은 영끌, 나는 레버리지 · 월세는 버리는 돈, 이자는 투자 비용
7 · 8 · 9. 속사포 — 세대수 · 전세 · 현수막
10. 반전 — 판 뒤에 오르자 "거품이야" (신 포도)
- 끝: "꼭대기가 아니었습니다. 그냥 오답." → "…역시, 모답맨."

## 3. 새 인물

### 정답 인물 — 공인중개사 사장님 (목소리 역할 `realtor`, 그림 `realtor/…`)
- 50대 후반 여자. 같은 자리에서 30년 동안 부동산을 했다. 돋보기안경 줄, 베이지 카디건, 계산기.
- 오른다 · 내린다를 절대 말하지 않는 정색 담당.
- 시그니처: 아빠가 "우리 집 얼마예요?" 하면 → "방금 사셨습니다." 끝은 "그 말씀, 일 년 전에도 하셨습니다."
- 목소리 후보 **Vindemiatrix** (`video/src/voice.json` 에 등록). 음성 만들 때 한 줄 들어 보고 정한다. 안 맞으면 Gacrux · Sulafat 계열로 바꾼다.

### 아빠 친구 (역할 `buddy`) — 3편 그대로
- 3편에서 주식으로 울던 그 친구가 이번엔 영끌로 집을 샀다. 시리즈 연결 개그다.
- 기준 그림은 3편 `buddy/normal.png` 를 복사했다. 새로 뽑는 것은 영상 통화 셀카 한 장(`buddy/call-key`).

## 4. 구조와 대본 (56줄 · 약 2:50 예상, 1.25배속)

**인물:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 사장님 `realtor` / 아빠 친구 `buddy`
**표기:** 「편집」 칸은 Motion 엔진의 전환 · 장치 이름. 한 컷에 목소리 둘까지 (아빠와 나레이션은 같은 목소리).
**시간 표시:** 라운드마다 구석에 날짜 띠(코드)를 붙인다: 계약 날 → 한 달 뒤 → 석 달 뒤 → 반년 뒤 → 일 년 뒤. 아빠는 그동안 매주 부동산에 온다.

### 콜드 오픈 0:00–0:15
| 컷 | 화면 | 대사 (한 / 영) | 편집 |
|---|---|---|---|
| c00 | `full/window-bubble` 시세표 유리창(▲ · ○억 코드)을 손가락질하는 아빠, 비눗방울 | 아빠: "완전 거품이네. 집값은 떨어져야 돼." / *Total bubble. Prices have to come down.* | `whip-r` · 비눗방울 `pop` · `freeze` + tag "사기 전: 거품" |
| c00a | `realtor/stamp` 인주를 내미는 사장님 | 사장님: "도장, 여기 찍으시면 됩니다." / *Stamp right here, please.* | `snap` |
| | `full/stamp-slam` 도장 쾅 + 엄마 이마 짚음 | 아빠: "자, 이제 오를 일만 남았다!" / *There. Now it only goes up!* | `impact` · `punch` · `stamp` · `kira` · tag "산 뒤: 바닥" |
| c00b | 정색 나레이션 카드: 왼쪽 "사기 전 → 거품" / 오른쪽 "산 뒤 → 바닥" | 나레이션: "사기 전엔 거품, 사고 나면 바닥. 내모남불, 하나." / *Before buying: a bubble. After buying: rock bottom. Double standard, number one.* | `count: 1` · `stamp` |
| | 아빠 정면 | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* | `snap` |
| | 타이틀 "내가 하면 **모 어때** / 남이 하면 **불—**" → 빨간 도장 **"패!"** · 아래 "부동산편" | — | `slam` → `stamp` · `pang` |

> 타이틀 도장: 1 · 2편 "불—" + "법!", 3편 주식 "불—" + "로소득!". 4편은 "불—" + **"패!"**(부동산 불패)로 바꾼다.

### 사건 개요 0:15–0:25
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c01 | `bg/realtor-office` 가족 셋 + 사장님, 날짜 띠 "계약 날" | 나레이션: "사건 개요. 토요일 오전, 동네 부동산. 전세 만기 두 달 전." / *Case summary. Saturday morning, the neighborhood realtor. Two months before our jeonse lease ends.* | `news` 띠 · `tick` |
| | `mom-sigh` | 엄마: "보러만 온다더니, 도장은 왜 찍었어?" / *You said we were just looking. Why did you stamp it?* | 컷인 |
| | 아빠가 소파에서 몸을 쑥 내밂 | 아빠: "사장님, 우리 집 이제 얼마예요?" / *So, how much is our place worth now?* | 이름표 "내모남불 후보" · `boing` |
| c01a | `realtor/calculator` 계산기 탁탁 | 사장님: "방금 사셨습니다." / *You bought it one minute ago.* | `crash` · `gaan` |

### ROUND 1 호가 0:25–0:58 — 카드: 보유 효과 + 법 카드 담합 금지
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c02 | "ROUND 1 · 호가" 카드, 날짜 띠 "한 달 뒤" | 나레이션: "딱 세 판만 하죠. 1라운드, 호가." / *Just three rounds. Round one: asking prices.* | `wipe` · `pang` |
| | `kid-ask` | 모라구: "아빠, 호가가 뭐야?" / *Dad, what's an asking price?* | `pop` |
| c02a | 아빠 팔짱, `prop/listing-sheet` 남의 단지 시세표(▲) 옆에 "거래량 0" 텅 빈 막대(코드) | 아빠: "파는 사람 희망 사항이지. 거래가 돼야 시세야." / *Just what the seller wishes for. It's only real once it sells.* | `slide` · 막대가 텅 `boing` |
| c02b | `prop/phone-up` → `cutin/dad-sparkle` | 아빠: "어? 옆 동이 이 가격에 내놨대!" / *Whoa, the next building just listed at this price!* | `whip-r` · `kira` · `punch` |
| | 아빠 후광 | 아빠: "그럼 우리 집도 이제 이 가격이야. 모 어때~" / *So that's our price now too. So what~* | `aura` · `freeze` + tag "우리 호가: 시세" |
| | 나레이션 카드 | 나레이션: "남의 호가는 희망 사항, 우리 호가는 시세. 내모남불, 둘." | `count: 2` |
| c02c | **심리학 카드:** 같은 머그잔 둘 — 내 손에 든 쪽에만 가격표가 부풀어 오름 + **"보유 효과 · 내 것이 더 비싸 보인다"** | 나레이션: "내 것이 더 비싸 보이는 것. 보유 효과라고 합니다." | `slam` · `news` 띠 "오늘의 진짜 이유" |
| | `kid-ask` | 모라구: "보유… 뭐?" / *Endow… what?* | `pop` (2 · 3편 "…뭐?" 반복 개그) |
| c02d | 단지 단톡방 말풍선(코드): "○억 아래로는 내놓지 맙시다 🙏" + 아빠의 👍 | 아빠: "단톡방에서 이 가격 밑으론 내놓지 말재. 좋아요!" / *The complex group chat says nobody list below this. Like!* | `beep` 연속 · `pop` |
| | `cutin/realtor-flat` → **법 카드:** "특정 가격 아래로 내놓지 말자고 유도 → 집값 담합 · 법으로 금지 (공인중개사법)" | 사장님: "그건 집값 담합입니다. 법으로 금지돼 있어요." / *That's price-fixing. It's against the law.* | `smash` · `crash` · `mark: X` (👍 위에) · `ding` |

### ROUND 2 호재 · 현수막 0:58–1:38 — 카드: 확증 편향 · 님비
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c03 | "ROUND 2 · 호재와 현수막" 카드, 날짜 띠 "석 달 뒤" | 나레이션: "2라운드. 호재와 현수막." / *Round two: "good news" and banners.* | `glitch` · `pang` |
| | 휴대폰 뉴스(코드: "○○동 역 신설 검토") 앞 아빠 콧방귀 + `prop/station` | 아빠: "남의 동네에 역이 생긴다고? 그거 10년 걸려. 설레발이야." / *A new station in some other town? That takes ten years. All hype.* | `boing` · tag "남의 호재: 설레발" |
| c03a | `bg/complex-gate` 현수막(코드) **"모라구역 유치 확정!"** 을 가리키는 모라구 | 모라구: "아빠, 우리 동네에도 역 생긴대!" / *Dad, they say a station's coming to OUR town!* | `whip-u` · 현수막 `slide` |
| | **아빠의 상상** `full/station-imagine` (분홍) | 아빠: "확정이야, 확정! 역 생기고, 백화점 생기고, 황금 집이다!" / *It's official! A station, a mall, our house turns to gold!* | fx `imagine` · 건물 뿅뿅 `dudung` |
| c03b | `cutin/realtor-flat` → 상상 화면에 금 → 깨짐 | 사장님: "현수막은, 확정이 아닙니다." / *A banner is not a confirmation.* | `glitch` · `buzz` |
| | **심리학 카드:** 신문 더미에서 좋은 소식만 돋보기로 골라 봄 + **"확증 편향 · 보고 싶은 소식만 믿는다"** | 나레이션: "보고 싶은 소식만 믿는 것, 확증 편향. 내모남불, 셋." | `count: 3` · `slam` |
| c03c | 휴대폰 뉴스(코드: "○○동 소각장 계획") + `prop/incinerator`, 아빠 고개 끄덕 | 아빠: "옆 동네에 소각장? 꼭 필요한 시설이지. 반대하면 이기적이야." / *An incinerator next town over? We need those. Opposing it is selfish.* | `pop` · tag "남의 동네: 필요한 시설" |
| | `mom-smirk` | 엄마: "여보, 그거 우리 동네래." / *Honey, it's in our town.* | `scratch` · 정적 0.3초 |
| c03d | `full/banner-oppose` 머리띠 · 현수막(코드) **"결사반대"** | 아빠: "결사반대! 우리 동네는 절대 안 돼!" / *Over my dead body! Not in our town!* | `impact` · `focus` · `shake` · tag "우리 동네: 결사반대" |
| | **카드:** 지도 위 소각장 핀이 동네마다 튕겨 나가고 갈 곳이 없음 + **"님비 · 필요한 건 알지만, 우리 동네만은 안 된다"** | 나레이션: "내 뒷마당만은 안 된다, 님비. 내모남불, 넷." | `count: 4` · 핀 `boing` 연속 |
| c03e | `cutin/realtor-flat` | 사장님: "다들 우리 동네는 안 된다시면… 어디에 짓죠?" / *If every town says "not here"… where do we build it?* | `snap` · `gaan` · 아빠 땀 한 방울 |

### ROUND 3 영끌 · 이자 1:38–2:12 — 카드: 낙관 편향
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c04 | "ROUND 3 · 영끌과 이자" 카드, 날짜 띠 "반년 뒤" | 나레이션: "3라운드. 영끌과 이자." / *Round three: borrowing to the max, and interest.* | `zoom` · `pang` |
| | 휴대폰 영상 통화 틀(코드) 안 `buddy/call-key` | 친구: "야, 나도 집 샀다. 영끌로." / *Dude, I bought a place too. Borrowed every last won.* | `whip-l` · `beep` · 열쇠 `kira` |
| c04a | 아빠 혀 차며 고개 절레 | 아빠: "영끌? 무리했네. 이자 감당 되겠어?" / *Every last won? That's reckless. Can you handle the interest?* | `boing` · tag "남이 하면: 영끌" |
| | `mom-smirk` | 엄마: "우리도 대출 끝까지 받았잖아." / *We maxed out our loan too.* | `scratch` |
| c04b | `common/cutin/dad-proud` + 선글라스 후광 | 아빠: "우리 건 레버리지야. 전략이지. 모 어때~" / *Ours is leverage. Strategy. So what~* | `aura` · `freeze` + tag "내가 하면: 레버리지" |
| | `kid-doubt` | 모라구: "아빠, 전에 월세는 버리는 돈이랬잖아." / *Dad, you said rent is money thrown away.* | `pop` · 되감기 `rewind` 로 지난 장면 1초 |
| c04c | 휴대폰 알림 '띵'(코드: "이자 출금") → `cutin/dad-interest` 날개 단 지폐 | 아빠: "이자는 달라! 이건… 투자 비용이야!" / *Interest is different! It's… an investment cost!* | `beep` · `impact` · 지폐 `whoosh` · tag "이자: 투자 비용" |
| | 나레이션 카드 | 나레이션: "남이 하면 영끌, 내가 하면 레버리지. 내모남불, 다섯, 여섯." | `count: 5` → `count: 6` 두 번 `stamp` |
| c04d | `cutin/realtor-flat` → **심리학 카드:** 빗속에 나만 우산 · 햇빛이라고 믿는 사람 + **"낙관 편향 · 나만은 괜찮을 거라고 믿는다"** | 사장님: "나만은 괜찮을 거라는 믿음. 낙관 편향이라고 합니다." / *"I'll be the one who's fine." That's called optimism bias.* | `slam` · `ding` |
| | `dad-sig-1~3` (아빠 시그니처) | 아빠: "…네?" / *…Huh?* | 아빠 시그니처, 한 편에 한 번 |

### 속사포 라운드 2:12–2:24 — 2초씩, 카운터 7 · 8 · 9
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c05 | "BONUS · 속사포" 카드, 번개 | 나레이션: "보너스 라운드. 속사포 내모남불!" / *Bonus round. Rapid-fire double standards!* | `flash` · `pang` · bgm 빠르게 |
| | 화면 반으로 나눔: 왼쪽 남의 단지(작은 `prop/big-complex`, 찡그린 아빠) / 오른쪽 우리 단지(큰 것, 웃는 아빠) | 아빠: "남의 단지는 복잡하고, 우리 단지는 대단지!" / *Their complex: too crowded. Ours: a grand complex!* | 반반 `wipe` · `mark: X / O` |
| | 반반: 왼쪽 세입자 아빠 분노 / 오른쪽 `prop/house-key` 들고 집주인 미소 | 아빠: "남이 전세 올리면 너무하고, 내가 올리면 시세대로!" / *Their landlord raising the deposit: cruel. Me raising it: just the market rate!* | 반반 `wipe` · `mark: X / O` |
| | 반반: 왼쪽 남의 단지 현수막 찡그림 / 오른쪽 우리 단지 현수막에 엄지 | 아빠: "남의 현수막은 흉하고, 우리 현수막은 단합!" / *Their banners: an eyesore. Ours: team spirit!* | 반반 `wipe` · `mark: X / O` |
| | 카운터가 7 → 8 → 9 로 다다닥 | 나레이션: "내모남불, 일곱, 여덟, 아홉!" / *Double standard: seven, eight, nine!* | `count: 7` · `8` · `9` · `stamp` 3연타 |

### 아이 눈높이 2:24–2:40 — 농담 · 효과음 없음
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c06 | `full/playground-dusk` 해질녘 놀이터 벤치 | 모라구: "아빠, 우리 집 올랐어? 내렸어?" / *Dad, did our house go up or down?* | `iris` · `cut` 만 · 카메라 천천히 · 음악 줄임 · `calm: true` |
| | 아빠, 휴대폰을 무릎에 엎어 둔 채 | 아빠: "…글쎄. 매일 보느라 바빴는데, 모르겠다." / *…Good question. I checked it every day, and I still don't know.* | |
| | 모라구가 놀이터를 봄 | 모라구: "올라도 내려도, 내 방은 그대로야. 나는 이 놀이터가 좋아." / *Up or down, my room's the same. And I like this playground.* | 끝 정리 (한 문장) |
| | 아빠 미소 | 아빠: "…그러네. 사는 집이지, 숫자가 아니지." / *…You're right. It's a home, not a number.* | |

### 반전 2:40–2:55
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c07 | 날짜 띠 "일 년 뒤 · 이사 가느라 집을 판 날" · `bg/realtor-office` 아빠 자신만만 | 아빠: "내가 딱 꼭대기에서 판 거야. 이제 폭락할 거야." / *I sold right at the top. It's gonna crash now.* | `zoom` · `tick` · tag "판 뒤: 폭락" |
| | `realtor/calculator` + `prop/phone-up` ▲▲▲ | 사장님: "고객님 파신 집, 또 올랐습니다." / *The house you sold just went up again.* | `smash` · `buzz` |
| c07a | `cutin/dad-sour` | 아빠: "…거품이야, 거품." / *…Bubble. Total bubble.* | 콧바람 `whoosh` |
| | **카드:** `prop/sour-grapes` 높은 포도 + 여우 대신 아빠 실루엣(코드) + **"신 포도 · 못 가진 것은 깎아내린다"** | 나레이션: "못 딴 포도는 시다. 신 포도. 내모남불, 열." / *The grapes you can't reach are sour. Double standard, number ten.* | `count: 10` · `slam` |
| c07b | `cutin/realtor-flat` + 콜드 오픈 "완전 거품이네" 장면을 VHS 로 1초 되감기 | 사장님: "그 말씀, 일 년 전에도 하셨습니다." / *You said the exact same thing a year ago.* | `rewind` · fx `vhs` · `crash` |
| | 나레이션 카드 | 나레이션: "꼭대기가 아니었습니다. 이건 내모남불이 아닙니다. 그냥 오답." / *It wasn't the top. That's not a double standard. Just a wrong answer.* | 카운터 글자가 "오답"으로 · `buzz` |
| c07c | 아빠 정면 | 아빠: "…역시, 모답맨." / *…Classic Modapman.* | `stamp` · `stinger` |
| | 끝 화면: ※ 주석 + "다음 내모남불: ?" | — | `note` |

줄 수: 콜드 5 · 개요 4 · R1 10 · R2 11 · R3 10 · 속사포 5 · 아이 4 · 반전 7 = **56줄**. 길면 R2 c03e 사장님 줄과 반전 "또 올랐습니다" 부터 줄인다 (후자는 화면 ▲▲▲ 만으로도 된다).

## 5. 그림 목록 (새로 뽑는 것 23장 + 3편에서 복사 2장 + 공통 재사용)

**뽑는 방법:** `qna/ART_GUIDE.md` 순서 그대로. `realtor/normal` 을 먼저 뽑아 확정한 뒤 나머지 사장님 그림 · `full/stamp-slam` 에 붙인다.
- 시세표 · 현수막 · 머리띠 · 계약서 · 휴대폰에는 숫자 · 글자 · 로고를 그리지 않는다. "모라구역 유치 확정!" · "결사반대" · "○억" · ▲ · 단톡방 · 날짜 띠는 코드로 얹는다.

| id | 장면 | people |
|---|---|---|
| `bg/realtor-window` | 부동산 바깥 유리창, 빈 시세표 종이가 줄줄이 | — |
| `bg/realtor-office` | 부동산 사무소 안 (책상 · 계산기 · 빈 지도 액자 · 소파) | — |
| `bg/complex-gate` | 아파트 단지 정문, 빈 현수막 두 줄 | — |
| `bg/playground-dusk` | 해질녘 단지 놀이터 (빈 배경) | — |
| `realtor/normal` | 사장님 기준 그림 (먼저 확정) | realtor |
| `realtor/stamp` | 계약서 · 인주를 내밀며 "여기 찍으시면" | realtor |
| `realtor/calculator` | 계산기를 탁탁, 안경 너머 정색 | realtor |
| `cutin/realtor-flat` | 사장님 정색 컷인 (안경 번쩍) | realtor |
| `buddy/normal` | **3편 그림 복사** (다시 뽑지 않음) | buddy |
| `buddy/call-key` | 영상 통화 셀카, 새 집 열쇠 + 식은땀 | buddy |
| `full/window-bubble` | 콜드 오픈: 유리창 손가락질 "거품" + 아이 · 엄마 | dad · kid · mom |
| `full/stamp-slam` | 콜드 오픈: 도장 쾅 + 엄마 이마 짚음 + 사장님 | dad · mom · realtor |
| `cutin/dad-sparkle` | 휴대폰 보며 별 눈 "우리 집도 이 가격" | dad |
| `full/station-imagine` | 아빠의 상상: 금빛 아파트 + 역 · 백화점이 뿅뿅 | dad |
| `full/banner-oppose` | 머리띠 · 주먹 "결사반대" (머리띠 비움) | dad |
| `cutin/dad-interest` | 이자 알림에 창백, 날개 단 지폐 | dad |
| `cutin/dad-sour` | 입 삐죽 콧방귀 "거품이야" | dad |
| `full/playground-dusk` | 해질녘 벤치의 모라구와 아빠 | kid · dad |
| `prop/phone-up` | **3편 그림 복사** (빨간 ▲ 휴대폰) | — |
| `prop/listing-sheet` | 빈 매물 시세표 한 장 | — |
| `prop/station` | 지하철역 입구 | — |
| `prop/incinerator` | 깔끔한 소각장 (굴뚝에 하얀 김) | — |
| `prop/big-complex` | 대단지 아파트 모형 | — |
| `prop/house-key` | 새 집 열쇠 | — |
| `prop/sour-grapes` | 높은 가지의 포도 송이 | — |

**재사용:** `common/cutin/` dad-shock · dad-proud · dad-sig-1~3 · mom-smirk · mom-sigh · kid-ask · kid-doubt, `common/dad/` · `common/kid/` · `common/mom/` 포즈.
**코드로 그리는 것:** 타이틀 도장("패!") · ROUND · BONUS 카드 · 심리학 카드 다섯 장(머그잔 · 돋보기 신문 · 튕기는 핀 · 우산 · 포도) · 법 카드 · 단톡방 말풍선 · 현수막 글자 · 날짜 띠 · 영상 통화 틀 · 반반 화면 · 끝 화면.

## 6. 제목 · 썸네일 · 쇼츠

**키워드 조사:** 아래 검색어로 `npm run keywords` 를 돌려 재고 고른다.
- 후보: "부동산 내로남불" "집값 내로남불" "영끌" "호가" "집값 담합" "님비" "벼락거지" "남의 집값" "집값 폭락" "부동산 심리"
- 이미 잰 것 (2026-10-25): "남의 집값" 최근 60일 중앙값 5만 · "벼락거지" 33만

**제목 후보** ("내로남불"을 앞머리에):
- `부동산 내로남불 — 사기 전엔 거품, 사고 나면 바닥 | 호가·호재·영끌 | 내모남불`
- `집값 내로남불, 남이 하면 영끌 내가 하면 레버리지 | 팔고 나면 "폭락할 거야" | 내모남불`

**썸네일:** 위 "사기 전엔 거품!"(흰) / "사고 나면 바닥~"(노랑) · 작은 셋째 줄 "부동산편"
- 그림: 반은 시세표에 손가락질하는 아빠, 반은 도장 쾅 하는 아빠 · 사장님 정색 컷인 · 카운터 10
- 3편과 색을 다르게 한다 (메모리 qna-thumb-distinct): 배경은 하늘색 + 금빛 아파트

**쇼츠** (`motion-short.json`, 관련 동영상 = 본편):
- ① 살 때 · 호가 (콜드 오픈 + ROUND 1) — "방금 사셨습니다." · "그건 집값 담합입니다."
- ② 호재 · 소각장 (ROUND 2) — "현수막은, 확정이 아닙니다." · "어디에 짓죠?"
- ③ 영끌 · 속사포 (ROUND 3 + 속사포) — "남이 하면 영끌, 내가 하면 레버리지."
- (④ 팔 때 — 반전만 30초. 반응을 보고 정한다)

**업로드:** 모라구, 재생목록 「내로남불 · 내모남불」 PLEJvhEloY2QQ · 아동용 아님 · AI 아니요 · 교육. 설명란에 ※ "특정 지역 · 투자를 권하지 않습니다."

## 7. 한 문장 정리

> 집값은 오르고 내려도, 사는 집은 그대로다.

## 8. 확장편 메모 (반응이 좋으면)

- **② 대출 · 전세편:** 전세 사기 걱정 ↔ 보증금 올리기, 금리 오르면 "은행이 나빠" ↔ 예금 이자는 "당연하지"
- **③ 청약 · 이웃편:** 남이 당첨되면 "운", 내가 되면 "준비된 사람" · 옆 단지 층간소음 (아이디어 A-4 아파트편과 묶기)
- 같은 사장님과 친구를 계속 쓴다.

## 출처
- Thaler, R. (1980). *Toward a positive theory of consumer choice.* Journal of Economic Behavior & Organization. / Kahneman, D., Knetsch, J. L., & Thaler, R. H. (1990). *Experimental tests of the endowment effect and the Coase theorem.* Journal of Political Economy. (보유 효과)
- Wason, P. C. (1960). *On the failure to eliminate hypotheses in a conceptual task.* QJEP. / Nickerson, R. S. (1998). *Confirmation bias: A ubiquitous phenomenon in many guises.* Review of General Psychology. (확증 편향)
- Weinstein, N. D. (1980). *Unrealistic optimism about future life events.* JPSP. (낙관 편향)
- Festinger, L. (1957). *A Theory of Cognitive Dissonance.* (신 포도 · 인지 부조화)
- 공인중개사법 제33조 제2항 · 제48조 (집값 담합 금지, 2020-02 시행) — 국가법령정보센터 원문 확인 필요. 참고: https://www.lawwin.co.kr/cases/340
