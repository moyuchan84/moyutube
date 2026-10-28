# 내모남불 ③ 주식편 · 오르면 · 내리면 · 단톡방 — 기획 (v1, 2026-10-27)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본을 고치면 여기 대본도 같이 고친다 (`script/script.json` 이 생긴 뒤에는 그쪽이 원본).
> **`docs/naemonambul-ideas.md` 의 B-1 주식편 그대로** 짰다 (세 라운드 · 정답 인물 · 심리학 카드 · 아이 한 줄 · 엄마 반전). 여기에 사용자 요청 개그 둘을 얹었다:
> ① 남이 산 게 떨어지면 "어? 싸졌네? 나도 한번 사볼까?" — 우는 친구 앞에서 눈치 없이. ② 남 잘되면 배 아픈 마음 — 가족 단톡방 수익 인증에 아빠가 진짜로 배를 움켜쥔다. 속담("사촌이 땅을 사면…")은 상투적이라 대사 · 화면에 쓰지 않는다 (2026-10-27 사용자).
> 1 · 2편과 같이 1.25배속, gap 0, `chop: 42`, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> 상태 (2026-10-27): 기획 · 대본 `script/script.json`(56줄) · 그림 목록 `script/art.json` 초안. 그림 · 음성 · 샷 계획 전.

## 0. 돈편 조심할 것 (아이디어 문서 그대로 지킨다)

- 종목명 · 회사명 · 지역명 · 실제 가격 · 수익률 · "사라 / 팔라" 를 대사 · 화면 · 그림 어디에도 넣지 않는다. 그림의 휴대폰 화면은 **빨간 위 화살표 / 파란 아래 화살표만**, 숫자는 없다.
- 웃음은 **마음**(질투 · 자기 합리화 · 눈치 없음)에서만. 정답 카드는 투자 정보가 아니라 **심리학 카드** 세 장.
- 은행 직원은 무엇도 권하지 않는다 — "저는 아무것도 추천하지 않습니다." 가 이 인물의 시그니처.
- 끝 화면 주석: "특정 종목 · 투자를 권하지 않습니다." 정치 · 정책 이야기 없음.

## 1. 한 줄 컨셉

평일 오후, 동네 은행 대기석. 모라구 첫 통장을 만들러 왔는데 아빠는 번호표를 쥐고 주식 앱만 본다.
- 내 주식이 오르면 "실력" ↔ 친구 주식이 오르면 "운이지 운"
- 내 주식이 내리면 "세력이 있어!" ↔ 친구 주식이 내리면 "그러게 내가 뭐랬어~ …어? 싸졌네? 나도 사볼까?" (친구는 울고 있다)
- 사촌 형이 가족 단톡방에 수익 인증 → 아빠 배가 진짜로 아프다 ↔ 아빠는 빨간 숫자만 잘라서 올린다 "정보 공유야~"
- 은행 창구 직원이 라운드마다 정색 한 줄. 번호표 47번은 끝까지 아빠를 기다리지 않는다.
- 모라구: "친구가 오르면, 친구 기분도 같이 오르잖아."
- 반전: 아빠 주식은 다 파란데, 집 계좌는 빨갛다 — 엄마가 공부해서 산 것. 통장도 엄마가 이미 만들었다.

## 2. 자료조사 — 심리학 카드 세 장

숫자(손실 회피 계수 "약 2배" 같은)는 대사 · 화면에 쓰지 않는다. 이름과 한 줄 정의만 쓴다.

| 라운드 | 카드 | 한 줄 정의 (화면) | 근거 | 확인 상태 |
|---|---|---|---|---|
| 1 오르면 | **자기 위주 편향** (self-serving bias) | 잘되면 내 실력, 안되면 남 탓 · 운 탓 | Miller & Ross (1975), 사회심리학 교과서 | 교과서 정의 — 대본 확정 전 한국어 용어("자기 위주 편향" / "자기 본위 편향") 한 번 더 확인 |
| 2 내리면 | **손실 회피** (loss aversion) | 같은 크기라도 잃은 아픔이 얻은 기쁨보다 크다 | Kahneman & Tversky (1979) 전망 이론 | 교과서 정의. 계수(약 2배)는 연구마다 달라 쓰지 않는다 |
| 3 단톡방 | **상대적 박탈감 · 사회 비교** | 내 것은 그대로인데, 남이 오르면 작아 보인다 | Festinger (1954) 사회 비교 이론 · 상대적 박탈감(Stouffer 1949 이후) | 교과서 정의 |

한국 증권 화면은 **오르면 빨강, 내리면 파랑**이다 (서양과 반대). 영어 자막에서 처음 한 번만 풀어 준다.

**내모남불 카운터**
1. 콜드 오픈 — 내가 오르면 실력, 친구가 오르면 운
2. ROUND 1 — "친구는 이름 보고 샀으니 운" ↔ 아빠도 이름 보고 샀는데 "나는 느낌이 왔어"
3. ROUND 2 — 내 건 "세력", 친구 건 "내가 뭐랬어~ 싸졌네? 사볼까?"
4. ROUND 3 — 사촌 인증은 "자랑", 내 캡처는 "정보 공유"
5. 반전 — 실력은 엄마 것이었다 → "그냥 오답. 모범답안은, 엄마."

## 3. 새 인물

### 정답 인물 — 은행 창구 직원 (목소리 역할 `teller`, 그림 `teller/…`)
- 20대 후반 여자, 모라구는 "은행 누나"라고 부른다. 무엇도 추천하지 않는 정색 담당.
- 반복 개그: 라운드마다 번호를 부르거나 서류를 들고 지나가다 한 줄. "사십칠 번 고객님." → 아빠 "잠깐만요, 지금 중요해서요!" → 끝에 "47번 고객님 업무는, 사모님이 끝내셨습니다."
- 목소리 후보 **Schedar** (고르고 평평한 목소리) — 음성 만들 때 한 줄 들어 보고 정한다.
- 생김새: `art.json` cast `teller`.

### 아빠 친구 (역할 `buddy`, 그림 `buddy/…`)
- 아빠 고등학교 동창. 영상 통화 화면으로만 나온다. 대사 한 줄("야… 내 거 완전 파랗다…").
- 목소리 후보 **Puck**.

### 사촌 형 — 그리지 않는다
- 가족 단톡방 말풍선 · 동그란 프로필 실루엣으로만 (코드). 새 그림을 늘리지 않는다.

## 4. 구조와 대본 (56줄 · 약 2:45 예상, 1.25배속)

**인물:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 은행 직원 `teller` / 아빠 친구 `buddy`
**표기:** 「편집」 칸은 Motion 엔진의 전환 · 장치 이름. 한 컷에 목소리 둘까지 (아빠와 나레이션은 같은 목소리).

### 콜드 오픈 0:00–0:15
| 컷 | 화면 | 대사 (한 / 영) | 편집 |
|---|---|---|---|
| c00 | 은행 대기석. 번호표를 쥔 아빠가 휴대폰을 보며 벌떡 | 아빠: "올랐다! 역시 내 눈은 정확해." / *It's up! My eye never misses.* | `whip-r` · `kira` · 빨간 ▲ 휴대폰 |
| | `kid-ask` | 모라구: "아빠, 친구 아저씨도 올랐대." / *Dad, your friend's went up too.* | `pop` |
| c00a | 아빠 콧방귀, 후광 | 아빠: "그건 운이지, 운. 아빠는 실력이고." / *That's luck. Mine is skill.* | `aura` · `freeze` + tag "내가 오르면: 실력" |
| | 정색 나레이션 카드 | 나레이션: "내가 오르면 실력, 남이 오르면 운. 내모남불, 하나." / *Mine goes up: skill. Yours goes up: luck. Double standard, number one.* | `count: 1` · `stamp` |
| c00b | 아빠 정면 | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* | `snap` |
| | 타이틀 "내가 하면 **모 어때** / 남이 하면 **불—**" → 빨간 도장 **"로소득!"** · 아래 "주식편" | — | `slam` → `stamp` · `pang` |

> 타이틀 도장: 1 · 2편은 "불—" + **"법!"**. 돈편은 "불—" + **"로소득!"**(불로소득)으로 말장난을 바꾼다. 싫으면 "법!" 그대로.

### 사건 개요 0:15–0:25
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c01 | 은행 대기석, 가족 셋. 번호표 클로즈업(47) | 나레이션: "사건 개요. 평일 오후, 동네 은행. 대기 번호 47번." / *Case summary. Weekday afternoon, the local bank. Ticket number 47.* | `news` 띠 · `tick` |
| | `mom-smirk` | 엄마: "오늘은 모라구 통장 만드는 날이야. 주식 얘기 금지." / *Today's about opening Moragu's account. No stock talk.* | 컷인 |
| | 아빠 엄지척, 머리 위 생각 풍선 (빨간 ▲ 내 것 / 파란 ▼ 남의 것) | 아빠: "내 건 오르고, 남의 건 좀 내리고. 그게 공평하지." / *Mine goes up, theirs dips a bit. That's fair.* | 이름표 "내모남불 후보" · `boing` |
| | 나레이션 카드 | 나레이션: "공평하지 않습니다." / *That is not fair.* | `pop` |

### ROUND 1 오르면 0:25–0:58 — 카드: 자기 위주 편향
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c02 | "ROUND 1 · 오르면" 카드 | 나레이션: "딱 세 판만 하죠. 1라운드, 오르면." / *Just three rounds. Round one: when it goes up.* | `wipe` · `pang` |
| | `kid-ask` | 모라구: "아빠는 뭐 보고 샀어?" / *What did you look at before buying?* | `pop` |
| c02a | **아빠의 상상** (분홍): 금빛 정장의 아빠가 빨간 화살표 로켓을 타고 날아가고, 아래서 사람들이 박수 | 아빠: "아빠는 차트를 읽는 남자야." / *Your dad reads charts.* | fx `imagine` · `whip-u` · `dudung` |
| | `mom-smirk` → 상상 화면에 금 → 깨짐 | 엄마: "이름이 멋있어서 샀잖아." / *You bought it because the name sounded cool.* | `glitch` · `buzz` |
| c02b | 아빠 휘파람 + 반짝이 | 아빠: "…근데 아빠는 느낌이 왔어. 모 어때~" / *…But I had a feeling. So what~* | `kira` · `freeze` + tag "내가 하면: 느낌" |
| | 나레이션 카드 | 나레이션: "내모남불, 둘." / *Double standard, number two.* | `count: 2` |
| | **심리학 카드**: 왼쪽 "잘되면 → 내 실력" / 오른쪽 "안되면 → 남 탓 · 운 탓" | 나레이션: "이걸 자기 위주 편향이라고 합니다." / *This is called the self-serving bias.* | `slam` · `news` 띠 "오늘의 진짜 이유" |
| c02c | `kid-ask` | 모라구: "자기… 뭐?" / *Self… what?* | `pop` (2편 "행위자… 뭐?" 와 같은 반복 개그) |
| c02d | 창구에서 손을 든 은행 직원 | 직원: "사십칠 번 고객님." / *Customer number 47.* | `smash` · `ding` |
| | 휴대폰에서 눈을 못 떼는 아빠 | 아빠: "잠깐만요, 지금 중요해서요!" / *One sec, this is important!* | `shake` · `tick` |
| c02e | 직원 정색 컷인 | 직원: "오르면 실력, 내리면 세력. 다들 그러십니다." / *Up means skill, down means "market manipulation." Everyone says that.* | `snap` · `crash` · `gaan` |

### ROUND 2 내리면 0:58–1:36 — 카드: 손실 회피
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c03 | "ROUND 2 · 내리면" 카드 | 나레이션: "2라운드. 내리면." / *Round two: when it goes down.* | `glitch` · `pang` |
| | 휴대폰에 파란 ▼. 아빠 얼굴이 파랗게 질림 | 아빠: "어? 왜 파래? 왜 내려?!" / *Huh? Why's it blue? (Blue means down here.)* | `impact` · `punch` · `buzz` |
| | 아빠 분노 | 아빠: "시장이 이상해. 세력이 있어, 세력이!" / *The market's rigged. Someone's behind this!* | `shake` · `focus` |
| c03a | `kid-doubt` | 모라구: "아까 은행 누나가 말한 거다." / *That's exactly what the bank lady said.* | `pop` |
| c03b | 휴대폰 영상 통화: 우는 친구 | 친구: "야… 내 거 완전 파랗다…" / *Dude… mine's completely blue…* | `whip-l` · `beep` · 비 오는 효과 |
| | 아빠 손으로 입 가리고 큭큭 | 아빠: "그러게 내가 뭐랬어~" / *Told you so~* | `boing` |
| c03c | 아빠 눈이 반짝, 휴대폰을 들고 해맑게 (뒤에서 친구는 계속 울음) | 아빠: "어? 근데 싸졌네? 나도 한번 사볼까?" / *Wait, it's cheap now? Should I buy some?* | `kira` · `freeze` + tag "남이 내리면: 세일" |
| | 엄마 정색 | 엄마: "여보, 친구 지금 울고 있어." / *Honey, your friend is literally crying.* | `scratch` |
| | 나레이션 카드 | 나레이션: "내모남불, 셋." / *Double standard, number three.* | `count: 3` |
| c03d | 정답 카드: 저울 — 잃은 쪽 접시가 쿵 내려감 + **"손실 회피 · 잃은 아픔 > 얻은 기쁨"** | 직원: "잃은 아픔이, 얻은 기쁨보다 큽니다." / *The pain of losing outweighs the joy of winning.* | `slam` · `ding` |
| | 아빠 손을 번쩍 | 아빠: "그럼 지금 사요, 말아요?" / *So should I buy or not?* | `pop` |
| c03e | 직원, 두 손바닥을 펴 보이며 정색 | 직원: "저는 아무것도 추천하지 않습니다." / *I recommend absolutely nothing.* | `snap` · `crash` → `mom-sigh` |

### ROUND 3 단톡방 1:36–2:12 — 카드: 상대적 박탈감 · 비교
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c04 | "ROUND 3 · 가족 단톡방" 카드 | 나레이션: "3라운드. 가족 단톡방." / *Round three: the family group chat.* | `zoom` · `pang` |
| | 단톡방 말풍선(코드): 사촌 형 프로필 + 빨간 ▲ 캡처 + 축하 이모지 줄줄이 | 아빠: "사촌 형이 수익 인증을 올렸네." / *My cousin posted his gains.* | `beep` 연속 · 말풍선 `pop` |
| | 아빠가 배를 움켜쥠, 얼굴 초록, 식은땀 | 아빠: "아이고, 배야… 갑자기 배가 아파." / *Ugh… my stomach suddenly hurts.* | `impact` · 꾸르륵 `dudung` |
| | `kid-ask` | 모라구: "아빠, 왜 배가 아파?" / *Dad, why does your tummy hurt?* | `pop` |
| c04a | `mom-smirk` (속담은 말하지 않는다 — 배 아픈 그림으로만) | 엄마: "사촌 형이 올라서 그래." / *Because his cousin went up.* | `pop` |
| | 아빠 분노 | 아빠: "저런 걸 왜 올려? 자랑이야, 자랑." / *Why post that? He's just bragging.* | `shake` · `buzz` |
| c04b | 아빠가 혀를 내밀고 캡처 화면에서 파란 부분을 가위로 싹둑, 빨간 것만 남겨 전송 | 아빠: "빨간 것만 잘라서… 이건 정보 공유야. 모 어때~" / *Crop out the blue… This is just sharing info. So what~* | `focus` · `slide` · `aura` · `freeze` + tag "내가 올리면: 정보 공유" |
| | 나레이션 카드 | 나레이션: "내모남불, 넷." / *Double standard, number four.* | `count: 4` |
| c04c | 직원이 서류를 들고 지나가다 멈춤 | 직원: "사촌분이 올랐다고, 고객님 것이 줄지는 않습니다." / *Your cousin going up doesn't make yours any smaller.* | `smash` · `crash` · `gaan` |
| | 정답 카드: 같은 크기 막대 둘인데 옆 막대가 커지자 내 막대가 *작아 보임* (돋보기) + **"상대적 박탈감 · 비교하면 작아 보인다"** | 직원: "작아진 건, 마음입니다." / *The only thing that shrank is your heart.* | `slam` · `ding` |
| | `dad-sig-1~3` (아빠 시그니처) | 아빠: "…네?" / *…Huh?* | 아빠 시그니처, 한 편에 한 번 |

### 아이 눈높이 2:12–2:30 — 농담 · 효과음 없음
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c05 | 은행 앞 벤치, 해질녘. 모라구가 새 통장을 두 손으로 듦 | 모라구: "아빠, 나 통장 생겼어. 엄마랑 만들었어." / *Dad, I got my own bankbook. Mom and I made it.* | `iris` · `cut` 만 · 카메라 천천히 · 음악 줄임 · `calm: true` |
| | 모라구 진지한 얼굴 | 모라구: "아빠는 친구 아저씨 거 내리면 좋아?" / *Are you happy when your friend's goes down?* | |
| | 아빠, 잠시 말이 없다가 | 아빠: "…아니. 그건 아니지." / *…No. Of course not.* | |
| | 모라구가 아빠를 올려다봄 | 모라구: "친구가 오르면, 친구 기분도 같이 오르잖아." / *When your friend goes up, his mood goes up too.* | 끝 정리 (한 문장) |
| | 아빠가 휴대폰을 열어 단톡방에 박수 이모지 | 아빠: "…그러네. 축하한다고 해야겠다." / *…You're right. I should say congrats.* | |

### 반전 2:30–2:48
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c06 | 아빠 다시 휴대폰. 자신만만 | 아빠: "자, 아빠 실력을 다시 보자…" / *Now, let's check my skills again…* | `zoom` · `tick` |
| | 화면 가득 파란 ▼▼▼ | 아빠: "…다 파랗네?" / *…It's all blue?* | `smash` · `buzz` |
| c06a | 엄마가 자기 휴대폰을 쓱 보여 줌 (빨간 ▲) | 엄마: "우리 집 계좌는 빨갛던데. 그거 내가 산 거야." / *Our family account is red. I bought those.* | `whip-r` · `kira` |
| | `dad-shock` | 아빠: "…언제?" / *…When?* | `punch` 3단 |
| | 엄마 미소 | 엄마: "당신이 이름 보고 살 때, 나는 공부했지." / *While you picked by name, I did my homework.* | `ding` |
| c06b | 나레이션 카드 | 나레이션: "이건 내모남불이 아닙니다. 그냥 오답. 모범답안은, 엄마." / *That's not a double standard. Just a wrong answer. The model answer: Mom.* | `count: 5` (카운터 글자가 "오답"으로) |
| c06c | 직원, 번호 화면 옆에서 정색 | 직원: "47번 고객님 업무는, 사모님이 끝내셨습니다." / *Customer 47's business was handled by your wife.* | `snap` |
| | 아빠 정면 | 아빠: "…역시, 모답맨." / *…Classic Modapman.* | `stamp` · `stinger` |
| | 끝 화면: ※ 주석 + "다음 내모남불: 집값편" | — | `note` |

줄 수: 콜드 5 · 개요 4 · R1 11 · R2 12 · R3 11 · 아이 5 · 반전 8 = **56줄** — 길면 R2 의 "아까 은행 누나가 말한 거다" 와 반전 "…언제?" 부터 뺀다.

**끝 화면 주석:**
> ※ 특정 종목 · 투자를 권하지 않습니다. 등장하는 화면 · 숫자는 꾸민 것이며, 심리학 용어는 일반 설명입니다.

## 5. 그림 목록 (새로 뽑는 것 19장 + 공통 재사용)

**뽑는 방법:** `qna/ART_GUIDE.md` 순서 그대로. `teller/normal` · `buddy/normal` 을 먼저 뽑아 확정한 뒤 나머지에 붙인다.
**휴대폰 화면 · 번호표 · 통장에는 숫자 · 글자 · 로고를 그리지 않는다** (화살표 · 색만). 숫자 47 · 말풍선은 코드로 얹는다.

| id | 장면 | people |
|---|---|---|
| `bg/bank-lobby` | 은행 대기석 (창구 · 번호 화면 · 의자 줄), 밝은 오후 | — |
| `bg/bank-dusk` | 해질녘 은행 앞 인도와 벤치 (빈 배경) | — |
| `teller/normal` | 은행 직원 기준 그림 (먼저 확정) | teller |
| `teller/call` | 창구에서 한 손을 들어 번호를 부름 | teller |
| `teller/no-recommend` | 두 손바닥을 펴 보이며 "추천 안 함" | teller |
| `cutin/teller-flat` | 직원 정색 컷인 | teller |
| `buddy/normal` | 아빠 친구 기준 그림 (먼저 확정) | buddy |
| `buddy/cry` | 영상 통화 셀카 구도로 엉엉 우는 친구 | buddy |
| `full/waiting-phone` | 콜드 오픈: 대기석에서 휴대폰 보며 벌떡 일어선 아빠, 옆의 모라구 · 엄마 | dad · kid · mom |
| `full/stock-god-imagine` | 아빠의 상상: 금빛 정장 아빠가 빨간 화살표 로켓을 타고 박수받음 | dad |
| `cutin/dad-blue` | 파랗게 질린 아빠 (얼굴이 진짜 파랑) | dad |
| `full/dad-cheap` | "싸졌네?" 반짝이는 눈의 아빠 + 휴대폰 속 우는 친구 + 기막힌 엄마 | dad · mom · buddy |
| `cutin/dad-bellyache` | 배를 움켜쥔 아빠, 초록 얼굴, 식은땀 | dad |
| `full/dad-crop` | 혀 내밀고 캡처를 가위로 자르는 아빠 | dad |
| `full/mom-reveal` | 엄마가 빨간 ▲ 휴대폰을 쓱, 놀란 아빠 | dad · mom |
| `full/bench-dusk` | 해질녘 벤치, 새 통장을 든 모라구와 아빠 | dad · kid |
| `prop/phone-up` | 빨간 위 화살표 그래프 휴대폰 | — (prop 규칙) |
| `prop/phone-down` | 파란 아래 화살표 그래프 휴대폰 | — |
| `prop/number-ticket` | 은행 번호표 (숫자 칸 비움) | — |
| `prop/bankbook` | 새 어린이 통장 (표지 무늬만) | — |

**재사용:** `common/cutin/` dad-shock · dad-proud · dad-sig-1~3 · mom-smirk · mom-sigh · kid-ask · kid-doubt, `common/dad/` · `common/kid/` · `common/mom/` 포즈.
**코드로 그리는 것:** 타이틀 도장("로소득!") · ROUND 카드 · 심리학 카드 3장(실력/남 탓 · 저울 · 막대 비교) · 단톡방 말풍선 · 번호 47 · 뉴스 띠 · 끝 화면.

## 6. 제목 · 썸네일 · 쇼츠

**키워드 조사** (`npm run keywords -- "주식 내로남불" "손실 회피" "자기 위주 편향" "주식 단톡방" "수익 인증" "주식 물렸다" "벼락거지" "상대적 박탈감"`)로 재고 고른다. 이미 잰 것: "벼락거지" 최근 60일 중앙값 33만, "내로남불 심리" 2,210 (2026-10-25).

**제목 후보** ("내로남불"을 앞머리에):
- `주식 내로남불 — 내가 오르면 실력, 남이 오르면 운 | 남 잘되면 배 아픈 아빠 | 내모남불`
- `주식 내로남불, 친구 주식 떨어지자 "싸졌네? 나도 사볼까?" | 오르면·내리면·단톡방 | 내모남불`

**썸네일:** 위 "남이 오르면 운!"(흰) / "내가 오르면 실력~"(노랑) · 작은 셋째 줄 "주식편" · 반은 후광 아빠, 반은 배 움켜쥔 아빠 · 직원 정색 컷인 · 카운터 4

**쇼츠** (`motion-short.json`, 관련 동영상 = 본편, 라운드마다 하나):
- ① 오르면 (콜드 오픈 + ROUND 1) — "오르면 실력, 내리면 세력. 다들 그러십니다."
- ② 내리면 (ROUND 2) — "싸졌네? 나도 사볼까?" → "저는 아무것도 추천하지 않습니다."
- ③ 단톡방 (ROUND 3) — 배 움켜쥔 아빠 → "작아진 건, 마음입니다."

**업로드:** 모라구, 재생목록 「내로남불 · 내모남불」 PLEJvhEloY2QQ · 아동용 아님 · AI 아니요 · 교육 · 비공개로 올리고 공개는 확인 후. 설명란에 ※ "특정 종목 · 투자를 권하지 않습니다."

## 7. 한 문장 정리

> 남이 오르면 내 배가 아픈 게 아니라, 친구 기분이 같이 오른다.

## 출처
- Miller, D. T., & Ross, M. (1975). *Self-serving biases in the attribution of causality: Fact or fiction?* Psychological Bulletin. (자기 위주 편향)
- Kahneman, D., & Tversky, A. (1979). *Prospect theory: An analysis of decision under risk.* Econometrica. (손실 회피)
- Festinger, L. (1954). *A theory of social comparison processes.* Human Relations. (사회 비교)
