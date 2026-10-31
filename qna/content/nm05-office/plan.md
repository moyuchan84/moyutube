# 내모남불 ⑤ 회사편 · 연차 · 퇴근 카톡 · 내 덕 남 탓 — 기획 (v1, 2026-10-30)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본을 고치면 여기 대본도 같이 고친다 (`script/script.json` 이 생긴 뒤에는 그쪽이 원본).
> 2026-10-30 사용자 요청: "회사에서 벌어질 일류" → 추천 셋 중 **회사편(아빠 회사 가는 날)** 으로 만든다. 나머지 둘(회식 · 점심편, 라떼 vs 신입편)은 `docs/naemonambul-ideas.md` 시즌 D 에 킵.
> 1~4편과 같이 1.25배속, gap 0, `chop: 42`, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> **v2 (2026-10-30 병맛 검토):** 커피 핑계 깨기 · 교훈 거꾸로 배우기(나흘 연휴) · 본인도 누워서 "11시에 벌써 자?" · 가성 군중 흉내 · 폭발 뒤 1초 만에 정색 복귀(인사 평가 반영).
> 상태 (2026-10-30): 대본 최종(53줄) · 그림 25장(크롬 Gemini 3.1 Pro, 기준 그림 첨부) · 음성 53줄(크롬 AI Studio gemini-3.8-flash-tts, 1.25배속 약 2:48). 샷 계획(motion.json) 전.

## 0. 회사편 조심할 것

- 실제 회사 이름 · 로고 · 업종 · 메신저 앱 이름을 넣지 않는다. 메신저는 "카톡"이라는 말만 대사에 쓰고, 화면은 코드로 그린 말풍선이다.
- 웃음은 아빠의 **마음**(자기 합리화 · 이중 잣대)에서만 나온다. 직장인 · 신입 · 상사 어느 쪽도 비웃지 않는다. 김 대리는 피해자가 아니라 평범한 동료로 그린다.
- 세대 비교("요즘 애들", "MZ")는 쓰지 않는다. 그건 시즌 D 「라떼 vs 신입편」에서 따로 조심해서 다룬다.
- **법 카드는 확인된 조문 하나만** 쓴다 (연차 시기, 근로기준법 제60조 제5항). 퇴근 뒤 연락을 막는 법은 쓰지 않는다 (확정된 법이 아니다). 퇴근 카톡은 심리학 카드로만 다룬다.
- 끝 화면 주석:
  > ※ 등장하는 회사 · 인물 · 화면은 꾸민 것입니다. 법 설명과 심리학 용어는 일반 설명이며, 회사마다 규정이 다를 수 있습니다. 개별 상담은 전문가에게.

## 1. 한 줄 컨셉

「아빠 회사 가는 날」. 모라구가 방문증을 목에 걸고 하루 동안 아빠 회사를 따라간다. 견학 안내는 인사팀 과장님이 맡는다. 아빠는 아이 앞에서 멋진 차장님이고 싶지만, 하루 종일 자리에 따라 말이 바뀐다.
- **출근:** 남이 늦으면 "시간 개념이…", 내가 늦으면 "엘리베이터가 안 와서".
- **연차:** 김 대리 금요일 연차는 "주말 붙이는 꼼수", 내 월요일 연차는 "재충전, 법에 있는 권리".
- **퇴근 카톡:** 부장님 밤 11시 카톡은 "퇴근했는데 이건 아니지!", 내가 후배에게 보낸 밤 11시 카톡은 "내일 보라고 한 거야" (그러고는 1이 언제 없어지나 계속 본다).
- **성과:** 잘되면 "제가 방향을 좀 잡았죠", 안되면 "팀이 따라와 주질 않아서".
- **속사포:** 회의 지각 · 긴 점심 · 늦은 답장.
- **반전:** 탕비실의 이름 없는 푸딩. "공용이지~" → 인사팀 과장님 것. 하루 종일 정색하던 과장님이 처음으로 폭발한다. 이름은 뚜껑 밑에 있었다.
- **모라구:** "부장님도, 김 대리님도, 집에 가면 누구 아빠고 누구 엄마야."
- **과장님 시그니처:** 태블릿을 톡 두드리며 "규정상, …". 아빠가 "우리 애 앞에서 저 칭찬 좀…" 해도 "규정상, 사실만 말합니다."

## 2. 자료조사 — 법 카드 하나 + 심리학 카드 둘

숫자(실험 결과 · 처벌 금액)는 대사 · 화면에 쓰지 않는다. 이름과 한 줄 정의만 쓴다.

| 자리 | 카드 | 한 줄 정의 (화면) | 근거 | 확인 상태 |
|---|---|---|---|---|
| R1 연차 | **법 카드 · 연차는 원하는 때에** | 연차는 직원이 원하는 날에 주는 게 원칙 (금요일도, 월요일도) | 근로기준법 제60조 제5항: 사용자는 휴가를 근로자가 청구한 시기에 주어야 한다. 다만 사업 운영에 막대한 지장이 있으면 그 시기를 바꿀 수 있다 | **조문 원문을 국가법령정보센터에서 다시 확인한 뒤 대본 확정.** 단서(시기 변경권)는 대사로 말하지 않고 끝 화면 주석 "회사마다 사정이 다를 수 있습니다"로 덮는다 |
| R2 퇴근 카톡 | **행위자-관찰자 편향** (actor–observer bias) | 남이 하면 성격 탓, 내가 하면 상황 탓 | Jones & Nisbett (1971) *The actor and the observer: Divergent perceptions of the causes of behavior* | 교과서 정의. 아이디어 문서에서 "내모남불 그 자체"라고 아껴 둔 카드 |
| R3 성과 | **자기 위주 편향** (self-serving bias) | 잘되면 내 실력, 안되면 남 탓 | Miller & Ross (1975) *Self-serving biases in the attribution of causality* · Zuckerman (1979) | 교과서 정의 |

**말 풀이 (영어 자막에서 처음 한 번):** 연차(annual paid leave), 차장 · 대리(job titles — deputy manager, assistant manager), 카톡(KakaoTalk, Korea's chat app → 영어 자막에서는 "a message"로 풀어도 된다), 탕비실(office pantry).

**내모남불 카운터 (8 + 그냥 오답)**
1. 콜드 오픈 — 남이 늦으면 시간 개념, 내가 늦으면 엘리베이터
2. R1 — 남이 붙이면 꼼수, 내가 붙이면 재충전
3. R2 — 남이 보내면 민폐, 내가 보내면 업무 공유 (행위자-관찰자 편향)
4. R3 — 잘되면 내 덕, 안되면 팀 탓 (자기 위주 편향)
5 · 6 · 7. 속사포 — 회의 지각 · 긴 점심 · 늦은 답장
8. 반전 — 남이 먹으면 도둑, 내가 먹으면 공용
- 끝: "이름은 뚜껑 밑에 있었습니다. 그냥 오답." → "…역시, 모답맨."

## 3. 새 인물

### 정답 인물 — 인사팀 과장님 (목소리 역할 `hr`, 그림 `hr/…`)
- 30대 중반 여자. 단정하게 묶은 머리, 네이비 재킷, 글자 없는 사원증 목걸이, 태블릿.
- 무엇을 물어도 "규정상"으로 시작하는 정색 담당. 사장님(4편) · 은행 직원(3편)과 겹치지 않게 **젊고 빠릿빠릿하게** 그린다.
- 시그니처: 태블릿을 톡 두드리고 안경 대신 **태블릿 화면이 번쩍** (화면은 비워 두고 빛만).
- 반전에서 처음으로 무너진다: "규정상… 그건 제 푸딩이라고요!!" (`cutin/hr-rage`).
- 목소리 후보 **Pulcherrima** (아직 안 쓴 목소리). 음성 만들 때 한 줄 들어 보고 정한다. 안 맞으면 Callirrhoe · Laomedeia 로 바꾼다.

### 김 대리 (역할 `junior`)
- 20대 후반 남자, 아빠 팀 후배. 둥근 안경, 하늘색 셔츠, 순하고 성실하다. 비웃음의 대상이 아니다.
- 대사는 둘: R2 다음 날 아침 "차장님, 어젯밤 카톡 보고 잠을 못 잤어요." · 속사포 없이 화면에만.
- 목소리 후보 **Sadachbia** (아직 안 쓴 목소리).

### 아빠의 직함
- 아빠는 **차장**이다. 김 대리 · 과장님이 "차장님"이라고 부른다. (회사 이름은 끝까지 안 나온다.)

## 4. 구조와 대본 (54줄 · 약 2:50 예상, 1.25배속)

**인물:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 인사팀 과장님 `hr` / 김 대리 `junior`
**표기:** 「편집」 칸은 Motion 엔진의 전환 · 장치 이름. 한 컷에 목소리 둘까지 (아빠와 나레이션은 같은 목소리).
**시간 표시:** 구석에 시계 띠(코드): 9:05 → 오전 10시 → 밤 11시 → 다음 날 9시 → 석 달 뒤 → 퇴근길 → 다음 날 아침.

### 콜드 오픈 0:00–0:15
| 컷 | 화면 | 대사 (한 / 영) | 편집 |
|---|---|---|---|
| c00 | `bg/office` 시계 띠 "9:01", 사무실 문으로 들어오는 직원 실루엣을 보며 혀 차는 아빠 | 아빠: "9시 1분? 시간 개념이 없네." / *9:01? No sense of time.* | `whip-r` · `tick` · `freeze` + tag "남이 늦으면: 시간 개념" |
| c00a | `full/late-dash` 넥타이 휘날리며 뛰어 들어오는 아빠 (한 손엔 테이크아웃 커피) + 방문증 맨 모라구, 시계 띠 "9:05" | 아빠: "엘리베이터가 안 와서! 이건 지각이 아니야, 모 어때~" / *The elevator wouldn't come! This isn't late. So what~* | `impact` · `focus` · `boing` · tag "내가 늦으면: 엘리베이터" |
| | `cutin/hr-flat` | 과장님: "규정상, 출근 기록은 9시 5분. 그 커피는 아직 따뜻하네요." / *Per policy, you clocked in at 9:05. And that coffee is still warm.* (엘리베이터 핑계를 커피 한 잔이 깬다) | `snap` · `gaan` |
| c00b | 나레이션 카드: 왼쪽 "남이 늦으면 → 시간 개념" / 오른쪽 "내가 늦으면 → 엘리베이터" | 나레이션: "남이 늦으면 시간 개념, 내가 늦으면 엘리베이터. 내모남불, 하나." / *They're late: no sense of time. I'm late: the elevator. Double standard, number one.* | `count: 1` · `stamp` |
| | 아빠 정면 | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* | `snap` |
| | 타이틀 "내가 하면 **모 어때** / 남이 하면 **불—**" → 빨간 도장 **"만!"** · 아래 "회사편" | — | `slam` → `stamp` · `pang` |

> 타이틀 도장: 1 · 2편 "법!", 3편 "로소득!", 4편 "패!". 5편은 "불—" + **"만!"**(불만).

### 사건 개요 0:15–0:27
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c01 | `bg/office` 위에 `prop/visitor-badge` 툭 · 시계 띠 "오전 10시" | 나레이션: "사건 개요. 아빠 회사 가는 날. 장소, 아빠 사무실." / *Case summary. Take-your-kid-to-work day. Location: Dad's office.* | `news` 띠 · `tick` |
| | `kid/badge` 방문증을 두 손으로 들고 신난 모라구 | 모라구: "아빠, 나 방문증 받았어! 아빠는 회사에서 뭐 해?" / *Dad, I got a visitor badge! What do you do at work?* | `pop` · `kira` |
| | `common/cutin/dad-proud` | 아빠: "아빠는 차장이야. 회사에서 꽤 중요한 사람이지." / *I'm a deputy manager. Pretty important around here.* | `aura` · 이름표 "내모남불 후보" |
| c01a | `hr/tablet` 태블릿을 들고 등장 | 과장님: "인사팀입니다. 오늘 견학 안내를 맡았습니다." / *HR. I'll be your guide today.* | `slide` · `ding` |
| | 아빠가 과장님 쪽으로 몸을 기울이며 속닥 | 아빠: "과장님, 우리 애 앞에서 저 칭찬 좀…" / *Psst, could you say something nice about me in front of my kid…* | `boing` |
| | `cutin/hr-flat` 태블릿 화면 번쩍 | 과장님: "규정상, 사실만 말합니다." / *Per policy, I only state facts.* | `crash` · `gaan` |

### ROUND 1 연차 0:27–0:58 — 법 카드: 연차는 원하는 때에
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c02 | "ROUND 1 · 연차" 카드 | 나레이션: "딱 세 판만 하죠. 1라운드, 연차." / *Just three rounds. Round one: annual leave.* | `wipe` · `pang` |
| | 빈 책상(코드: 포스트잇 "금 연차") 앞에서 팔짱 낀 아빠 | 아빠: "김 대리 또 금요일 연차야? 주말 붙여서 쉬려는 꼼수지." / *Kim's off on a Friday again? Just tacking it onto the weekend.* | `slide` · `boing` · tag "남이 붙이면: 꼼수" |
| | `kid-ask` | 모라구: "아빠, 연차가 뭐야?" / *Dad, what's annual leave?* | `pop` |
| c02a | `prop/calendar` 달력의 월요일에 동그라미 → `cutin/dad-monday` 해먹 · 선글라스 상상 | 아빠: "일한 사람이 쉬는 날이야. 아빠는 월요일에 쓸 거야." / *Paid days off for working hard. I'm taking Monday.* | `whip-u` · `kira` |
| | 아빠 후광 | 아빠: "주말 이어서 푹 쉬어야 일이 잘되지. 모 어때~" / *Gotta stretch the weekend to recharge. So what~* | `aura` · `freeze` + tag "내가 붙이면: 재충전" |
| | 나레이션 카드 | 나레이션: "남이 붙이면 꼼수, 내가 붙이면 재충전. 내모남불, 둘." / *They stretch the weekend: a trick. I do it: recharging. Double standard, number two.* | `count: 2` · `stamp` |
| c02b | `cutin/hr-flat` → **법 카드:** "연차는 직원이 원하는 날에 주는 게 원칙 · 금요일도 ○ 월요일도 ○ (근로기준법)" | 과장님: "연차는 직원이 원하는 날에 쓰는 게 원칙입니다. 금요일도, 월요일도요." / *Leave is taken when the employee asks, in principle. Fridays, Mondays, either one.* | `smash` · `ding` · 금 · 월에 `mark: O` |
| | `kid-doubt` | 모라구: "그럼 김 대리님도 괜찮은 거네?" / *So Mr. Kim's Friday is fine too?* | `pop` |
| | `common/cutin/dad-shock` | 아빠: "그럼 아빠는 금요일, 월요일 둘 다! 나흘 연휴다!" / *Then I will take Friday AND Monday! A four-day weekend!* | 교훈을 거꾸로 배움 · `kira` · `aura` 두 배 |

### ROUND 2 퇴근 카톡 0:58–1:32 — 카드: 행위자-관찰자 편향
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c03 | "ROUND 2 · 퇴근 뒤 카톡" 카드 · 시계 띠 "밤 11시" | 나레이션: "2라운드. 퇴근 뒤 카톡." / *Round two: messages after work.* | `glitch` · `pang` |
| | `cutin/dad-bed-phone` 침대에서 휴대폰 빛에 얼굴이 퍼렇게, 말풍선(코드: 부장님 "내일 회의 자료 확인 바람") | 아빠: "밤 11시에 카톡? 퇴근했는데 이건 아니지!" / *A message at 11 p.m.? I'm off the clock! Not cool!* | `beep` · `impact` · tag "남이 보내면: 민폐" |
| | `mom-smirk` | 엄마: "여보, 방금 김 대리한테 보낸 건 뭐야?" / *Honey, what did you just send to Mr. Kim?* | `scratch` · 정적 0.3초 |
| c03a | 아빠가 보낸 말풍선(코드: "내일 보셔도 돼요^^") | 아빠: "그건 내일 보라고 한 거야. 업무 공유지~" / *That one says "see it tomorrow." Just sharing info~* | `pop` · tag "내가 보내면: 업무 공유" |
| | `cutin/dad-stare` 말풍선 옆 숫자 1을 뚫어지게 (집중선) | 아빠: "…벌써 자? 11시에? 열정이 없네." / *…Asleep already? At 11? No passion at all.* (본인도 침대에 누워 있음) | `gaan` · `focus` · `tick` 연타 |
| | 나레이션 카드 | 나레이션: "남이 보내면 민폐, 내가 보내면 업무 공유. 내모남불, 셋." / *They text late: rude. I text late: sharing info. Double standard, number three.* | `count: 3` · `stamp` |
| c03b | 다음 날 아침 · `junior/tired` 다크서클로 휴대폰을 쥔 김 대리 | 김 대리: "차장님, 어젯밤 카톡 보고 잠을 못 잤어요." / *Sir, I couldn't sleep after your message last night.* | `whip-l` · `dudung` |
| | `cutin/hr-flat` → **심리학 카드:** 같은 휴대폰 두 대 — 남의 손엔 "성격" 딱지, 내 손엔 "상황" 딱지 + **"행위자-관찰자 편향 · 남이 하면 성격 탓, 내가 하면 상황 탓"** | 과장님: "남이 하면 성격 탓, 내가 하면 상황 탓. 행위자-관찰자 편향입니다." / *When others do it, it's their character. When you do it, it's the situation. Actor–observer bias.* | `slam` · `news` 띠 "오늘의 진짜 이유" |
| | `kid-ask` | 모라구: "행위자… 뭐?" / *Actor… what?* | `pop` (2~4편 "…뭐?" 반복 개그) |

### ROUND 3 내 덕 · 남 탓 1:32–2:05 — 카드: 자기 위주 편향
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c04 | "ROUND 3 · 내 덕, 남 탓" 카드 · `bg/meeting-room` | 나레이션: "3라운드. 잘되면 내 덕, 안되면 남 탓." / *Round three: success is mine, failure is yours.* | `zoom` · `pang` |
| | `full/meeting-up` 오르는 그래프(코드) 앞에서 가슴 펴는 아빠 | 아빠: "이번 성과요? 제가 방향을 좀 잡았죠." / *This quarter's results? I set the direction, you know.* | `kira` · `aura` · 그래프 쭉 `whoosh` |
| | **아빠의 상상** `full/trophy-imagine` (분홍) 트로피 · 꽃가루 · 헹가래 | 아빠(가성으로 군중 흉내): "차장님 덕분입니다~! 차장님 최고~!" / *(fake crowd voice) All thanks to our deputy manager~! You are the best~!* | fx `imagine` · `dudung` |
| c04a | 시계 띠 "석 달 뒤" · 같은 회의실, 그래프가 뚝(코드) · `cutin/dad-blame` 손가락이 팀 쪽으로 | 아빠: "이번엔… 팀이 따라와 주질 않아서." / *This time… the team just didn't keep up.* | `smash` · `buzz` · tag "안되면: 팀 탓" |
| | 나레이션 카드 | 나레이션: "잘되면 내 덕, 안되면 남 탓. 내모남불, 넷." / *Success: me. Failure: them. Double standard, number four.* | `count: 4` · `stamp` |
| c04b | `cutin/hr-flat` → **심리학 카드:** 저울 — 성공 접시엔 "나", 실패 접시엔 "남"이 올라감 + **"자기 위주 편향 · 잘되면 내 실력, 안되면 남 탓"** | 과장님: "잘되면 내 실력, 안되면 남 탓. 자기 위주 편향이라고 합니다." / *Wins are my skill, losses are someone else's fault. It's called self-serving bias.* | `slam` · `ding` |
| | `hr/tablet` 태블릿을 아빠에게 쓱 (화면은 코드: 기획서 첫 장 "기획: 김○○") | 과장님: "참고로, 그 기획서 첫 장에 김 대리 이름이 있습니다." / *For the record, Mr. Kim's name is on page one of that proposal.* | `crash` · `gaan` |
| | `dad-sig-1~3` (아빠 시그니처) | 아빠: "…네?" / *…Huh?* | 아빠 시그니처, 한 편에 한 번 |

### 속사포 라운드 2:05–2:17 — 2초씩, 카운터 5 · 6 · 7
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c05 | "BONUS · 속사포" 카드, 번개 | 나레이션: "보너스 라운드. 속사포 내모남불!" / *Bonus round. Rapid-fire double standards!* | `flash` · `pang` · bgm 빠르게 |
| | 반반: 왼쪽 늦게 들어오는 남(실루엣) + 찡그린 아빠 / 오른쪽 늦게 들어오는 아빠 + 미소 | 아빠: "남이 회의에 늦으면 기본이 없고, 내가 늦으면 앞 회의가 길어서!" / *Them late to a meeting: no manners. Me: the last meeting ran long!* | 반반 `wipe` · `mark: X / O` |
| | 반반: 왼쪽 시계 + 빈자리 / 오른쪽 `prop/coffee` 들고 웃는 아빠 | 아빠: "남이 점심 길면 땡땡이, 내가 길면 네트워킹!" / *Their long lunch: slacking. Mine: networking!* | 반반 `wipe` · `mark: X / O` |
| | 반반: 왼쪽 답장 없는 메일 화면(코드) / 오른쪽 턱 괴고 고민하는 척하는 아빠 | 아빠: "남이 답장 늦으면 일 안 하고, 내가 늦으면 신중한 검토!" / *Their slow reply: lazy. Mine: careful review!* | 반반 `wipe` · `mark: X / O` |
| | 카운터가 5 → 6 → 7 로 다다닥 | 나레이션: "내모남불, 다섯, 여섯, 일곱!" / *Double standard: five, six, seven!* | `count: 5` · `6` · `7` · `stamp` 3연타 |

### 아이 눈높이 2:17–2:35 — 농담 · 효과음 없음
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c06 | `full/office-dusk` 해질녘 회사 앞 횡단보도, 방문증을 아직 목에 건 모라구와 아빠 | 모라구: "아빠, 회사에 사람 진짜 많더라." / *Dad, there were so many people at your work.* | `iris` · `cut` 만 · 카메라 천천히 · 음악 줄임 · `calm: true` |
| | 아빠 | 아빠: "그렇지. 다들 바빠." / *Yeah. Everyone's busy.* | |
| | 모라구가 퇴근하는 사람들을 봄 | 모라구: "부장님도, 김 대리님도, 집에 가면 누구 아빠고 누구 엄마야." / *Your boss, Mr. Kim… at home, they're somebody's dad, somebody's mom.* | 끝 정리 (한 문장) |
| | 아빠가 휴대폰을 꺼내 천천히 씀 (말풍선 코드: "어제 늦게 연락해서 미안해요. 푹 쉬어요.") | 아빠: "…그러네. 김 대리한테 미안하다고 해야겠다." / *…You're right. I should say sorry to Mr. Kim.* | |

### 반전 2:35–2:52
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c07 | 시계 띠 "다음 날 아침" · `bg/pantry` → `full/pudding` 냉장고 앞에서 푸딩을 든 아빠 | 아빠: "이름 없는 푸딩은 공용이지~ 모 어때." / *A pudding with no name? Community property~ So what.* | `zoom` · `kira` · 숟가락 `pop` |
| | `hr/tablet` 문간에 선 과장님, 정색 | 과장님: "…그거, 제 겁니다." / *…That's mine.* | `smash` · `buzz` |
| c07a | 나레이션 카드: 왼쪽 "남이 먹으면 → 도둑" / 오른쪽 "내가 먹으면 → 공용" | 나레이션: "남이 먹으면 도둑, 내가 먹으면 공용. 내모남불, 여덟." / *Someone else eats it: theft. I eat it: shared. Double standard, number eight.* | `count: 8` · `stamp` |
| | `cutin/hr-rage` 처음으로 무너진 과장님 (불꽃 · 집중선) | 과장님: "규정상… 그건 제 푸딩이라고요!!" / *Per policy… that is MY pudding!!* | `impact` · `focus` · `shake` · `crash` |
| c07b | `prop/pudding` 뚜껑을 뒤집으면 안쪽에 이름(코드: "인사팀 ○○○") | 나레이션: "이름은 뚜껑 밑에 있었습니다. 그냥 오답." / *The name was under the lid. Just a wrong answer.* | `rewind` · 카운터 글자가 "오답"으로 · `buzz` |
| | `cutin/hr-flat` — 폭발 1초 만에 원래 얼굴로 (머리카락만 삐져나온 채) | 과장님: "(정색) 규정상, 인사 평가에 반영하겠습니다." / *(instantly calm) Per policy, this will be reflected in your performance review.* | `snap` · `gaan` · 아빠 얼굴 하얗게 |
| c07c | 아빠 정면 | 아빠: "…역시, 모답맨." / *…Classic Modapman.* | `stamp` · `stinger` |
| | 끝 화면: ※ 주석 + "다음 내모남불: ?" | — | `note` |

줄 수: 콜드 5 · 개요 6 · R1 9 · R2 9 · R3 8 · 속사포 5 · 아이 4 · 반전 7 = **53줄**. 길면 R1 "나흘 연휴다!" 와 속사포 셋째 줄부터 줄인다.

## 5. 그림 목록 (새로 뽑는 것 25장 + 공통 재사용)

**뽑는 방법:** `qna/ART_GUIDE.md` 순서 그대로. `hr/normal` · `junior/normal` 을 먼저 뽑아 확정한 뒤 나머지 그림에 붙인다.
- 모니터 · 태블릿 · 휴대폰 · 달력 · 포스트잇 · 사원증 · 방문증 · 푸딩 뚜껑에는 글자 · 숫자 · 로고를 그리지 않는다. 시계 띠 · 말풍선 · 그래프 · 이름 · "금 연차" 는 코드로 얹는다.

| id | 장면 | people |
|---|---|---|
| `bg/office` | 사무실 (칸막이 책상 · 빈 모니터 · 창가 화분) | — |
| `bg/meeting-room` | 회의실 (긴 테이블 · 빈 화이트보드 · 빈 스크린) | — |
| `bg/pantry` | 탕비실 (작은 냉장고 · 커피 머신 · 컵) | — |
| `hr/normal` | 인사팀 과장님 기준 그림 (먼저 확정) | hr |
| `hr/tablet` | 태블릿을 들고 정색, 안내하는 손 | hr |
| `cutin/hr-flat` | 과장님 정색 컷인 (태블릿 화면 번쩍) | hr |
| `cutin/hr-rage` | 반전: 처음으로 무너진 과장님 (불꽃 · 집중선) | hr |
| `junior/normal` | 김 대리 기준 그림 (먼저 확정) | junior |
| `junior/tired` | 다크서클로 휴대폰을 쥐고 꾸벅 | junior |
| `kid/badge` | 방문증을 두 손으로 들고 신난 모라구 | kid |
| `full/late-dash` | 콜드 오픈: 넥타이 휘날리며 뛰는 아빠 + 끌려가는 모라구 | dad · kid |
| `cutin/dad-monday` | 상상: 해먹 · 선글라스 · 주스 "월요일 연차" | dad |
| `cutin/dad-bed-phone` | 침대에서 휴대폰 빛에 얼굴 퍼렇게, 분노 | dad |
| `cutin/dad-stare` | 휴대폰을 코앞에 대고 뚫어지게 (숫자 1 기다림) | dad |
| `full/meeting-up` | 회의실 스크린 앞에서 가슴 펴는 아빠 + 박수 치는 동료 실루엣 | dad |
| `full/trophy-imagine` | 아빠의 상상: 트로피 · 꽃가루 · 헹가래 (분홍) | dad |
| `cutin/dad-blame` | 손가락으로 옆을 가리키며 시선 피함 | dad |
| `full/office-dusk` | 해질녘 회사 앞 횡단보도의 모라구와 아빠 | kid · dad |
| `full/pudding` | 탕비실 냉장고 앞에서 푸딩을 들고 신난 아빠 | dad |
| `prop/visitor-badge` | 목걸이 방문증 (글자 없음) | — |
| `prop/calendar` | 탁상 달력 (빈 칸, 한 칸에 빨간 동그라미) | — |
| `prop/tablet` | 태블릿 (빈 화면) | — |
| `prop/pudding` | 컵 푸딩 + 숟가락 | — |
| `prop/coffee` | 테이크아웃 커피 두 잔 | — |
| `prop/trophy` | 금 트로피 | — |

**재사용:** `common/cutin/` dad-shock · dad-proud · dad-sig-1~3 · mom-smirk · kid-ask · kid-doubt · kid-sig, `common/dad/` · `common/kid/` · `common/mom/` 포즈.
**코드로 그리는 것:** 타이틀 도장("만!") · ROUND · BONUS 카드 · 법 카드 · 심리학 카드 둘(성격/상황 딱지 휴대폰 · 저울) · 시계 띠 · 카톡 말풍선과 숫자 1 · 그래프(오름 · 뚝) · 포스트잇 "금 연차" · 기획서 첫 장 · 반반 화면 · 푸딩 뚜껑 이름 · 끝 화면.

## 6. 제목 · 썸네일 · 쇼츠

**키워드 조사:** 아래 검색어로 `npm run keywords` 를 돌려 재고 고른다.
- 후보: "회사 내로남불" "직장 내로남불" "퇴근 후 카톡" "연차 눈치" "금요일 연차" "직장인 공감" "탕비실" "내 덕 남 탓" "회사 빌런" "직장 상사"

**제목 후보** ("내로남불"을 앞머리에):
- `회사 내로남불 — 내 연차는 권리, 남의 연차는 꼼수 | 퇴근 카톡 · 내 덕 남 탓 | 내모남불`
- `직장 내로남불, 남이 보내면 민폐 내가 보내면 업무 공유 | 퇴근 후 카톡 | 내모남불`

**썸네일:** 위 "내 연차는 권리!"(흰) / "남의 연차는 꼼수~"(노랑) · 작은 셋째 줄 "회사편"
- 그림: 해먹 위 선글라스 아빠(`cutin/dad-monday`) · 과장님 정색 컷인 · 달력 금 ✕ / 월 ○ · 카운터 8
- 3 · 4편과 색을 다르게 한다 (메모리 qna-thumb-distinct): 배경은 사무실 회색 + 형광 연두

**쇼츠** (`motion-short.json`, 관련 동영상 = 본편):
- ① 출근 · 연차 (콜드 오픈 + ROUND 1) — "규정상, 출근 기록은 9시 5분입니다." · "금요일도, 월요일도요."
- ② 퇴근 카톡 (ROUND 2) — "…근데 왜 아직 안 읽지?"
- ③ 내 덕 남 탓 · 푸딩 (ROUND 3 + 반전) — "그 기획서 첫 장에 김 대리 이름이 있습니다." · "그건 제 푸딩이라고요!!"

**업로드:** 모라구, 재생목록 「내로남불 · 내모남불」 PLEJvhEloY2QQ · 아동용 아님 · AI 아니요 · 코미디/교육. 설명란에 ※ "꾸민 이야기, 회사마다 규정이 다를 수 있습니다."

## 7. 한 문장 정리

> 부장님도, 김 대리님도, 집에 가면 누구의 아빠고 누구의 엄마다.

## 출처
- 근로기준법 제60조 제5항 (연차 유급휴가의 시기) — 국가법령정보센터 원문 확인 필요. https://www.law.go.kr/법령/근로기준법
- Jones, E. E., & Nisbett, R. E. (1971). *The actor and the observer: Divergent perceptions of the causes of behavior.* General Learning Press. (행위자-관찰자 편향)
- Miller, D. T., & Ross, M. (1975). *Self-serving biases in the attribution of causality: Fact or fiction?* Psychological Bulletin. / Zuckerman, M. (1979). *Attribution of success and failure revisited.* Journal of Personality. (자기 위주 편향)
