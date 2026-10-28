# 내모남불 ② 엘리베이터편 · 닫힘 버튼 · 문 잡기 · 정원 초과 — 기획 (초안 v1, 2026-10-26)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본을 고치면 여기 대본도 같이 고친다 (`script/script.json` 이 생긴 뒤에는 그쪽이 원본).
> 아이디어 목록 `docs/naemonambul-ideas.md` 의 A-1(1순위)을 다듬었다. 1편과 같이 1.25배속, gap 0, `chop: 42`, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> 상태 (2026-10-26): 시나리오 초안. 확인을 받은 뒤 `script.json` · `art.json` 으로 옮긴다.

## 1. 한 줄 컨셉

토요일, 모 씨네 아파트 엘리베이터.
- 아빠는 남이 닫힘을 누르면 "사람을 두고 닫아?!", 남이 문을 잡고 있으면 "다들 바쁜데!", 꽉 찬 데 남이 비집고 타면 "다음 거 타세요!"를 외친다.
- 그런데 같은 짓을 자기가 할 때마다 "**모 어때~**".
- 관리소장님이 하필 매번 같은 엘리베이터 구석에 서 있다. 무전기를 차고, 무표정하게 한 줄씩 바로잡는다.
- 모라구가 한 줄로 정리한다: "뛰어오는 사람도 누군가의 아빠야."

## 2. 자료조사

한 곳 보도뿐인 숫자는 쓰지 않는다. 이번 편 정답 카드에는 **숫자를 넣지 않는다** (아래 표 참고).

| 라운드 | 사실 | 확인 상태 | 대본에 쓰는 법 |
|---|---|---|---|
| 닫힘 버튼 | 닫힘 버튼을 눌러도, 정해진 시간이 지나기 전에는 문이 닫히지 않게 만든 엘리베이터가 많다 | 언론 설명 (일요시사) · 해외(미국 ADA 최소 3초 개방) 설명 여럿 | "바로 안 닫히는 엘리베이터가 많다"까지만 |
| 닫힘 버튼 | 지하철역 승강기는 교통약자법 때문에 10초 이상 열려 있다 | **한 곳 보도뿐**(데일리안 2024-12-28), 법령 조항 미확인 | **쓰지 않는다** |
| 닫힘 버튼 | 여러 번 눌러도 한 번 누른 것과 같다 (이미 들어간 요청) | 해외 설명(Quartz 등) | 소장님 대사 "열 번 눌러도 한 번입니다" — 승강기안전공단 · 제조사 자료로 한 번 더 확인 |
| 문 잡기 | 출입문을 손으로 밀거나 흔들거나 기대지 않는다 · 문틈에 물건을 끼우지 않는다 | 지자체 승강기 안전 수칙(연수구 · 서울시 등) | 정답 카드 "문은 손 · 발 말고 **열림 버튼**" |
| 정원 초과 | 정원 · 적재하중 초과는 고장 · 사고 원인. 넘으면 **마지막에 탄 사람이 내린다** | 지자체 수칙(연수구) | 정답 카드 "삐— 하면 **마지막에 탄 사람**이 내린다" |
| 정원 초과 | 넘으면 경보가 울리고 문이 닫히지 않는다 (과부하 감지) | 일반 설명, 공식 문서 미확인 | 화면으로만 보여 준다 (삐— + 문이 다시 열림). 대사로 단정하지 않는다 |

빼는 것:
- "같은 층 버튼을 두 번 누르면 취소된다" — 제조사마다 달라서 근거를 못 찾았다. 아이디어의 "층마다 다 누르기" 라운드를 **문 잡기**로 바꾼 이유.
- 택배 · 배달 기사님이 여러 층을 누르는 이야기 — 실제 논란이 있는 소재라 남을 탓하는 그림이 될 수 있다. 쓰지 않는다.

**내모남불 후보 (아빠의 이중 잣대)**
1. 남이 닫힘을 누르면 "사람을 두고 닫아?!" ↔ 내가 누르면 "다음 거 타면 되지~" (콜드 오픈)
2. 남의 집 아이가 닫힘 연타 → "요즘 애들은 참을성이…" ↔ 방금 자기가 했음 (ROUND 1)
3. 남이 3층에서 문을 잡고 있으면 "다들 바쁜데!" ↔ 내가 발로 문 막고 수다 (ROUND 2)
4. 남이 꽉 찬 데 비집고 타면 "다음 거 타세요!" ↔ 내가 타서 삐— "숨 참으면 돼" (ROUND 3)
5. (반전) 다짐하자마자 닫힘 연타 — 뛰어오던 사람은 엄마 → 남이 아니라 아내. **그냥 오답**

## 3. 정답 인물 — 관리소장님 (새 인물)

- 역할 id `manager` (`voice.json` 에 새로 넣는다). 목소리 후보 **Orus** (단단하고 건조한 남자 목소리) — 음성 만들 때 한 줄 들어 보고 정한다.
  - style: "A Korean apartment complex manager in his early sixties: flat, dry, deadpan voice like a building announcement, polite but completely unimpressed, never angry"
- 생김새 (`art.json` cast): `"the apartment manager: a Korean man in his early sixties, short neat gray hair, rimless glasses, expressionless face, navy work vest over a light blue shirt, name badge, a walkie-talkie clipped to his belt"`
- 반복 개그: 세 라운드 모두 **엘리베이터 안쪽 구석에 이미 서 있다.** 아빠가 매번 "…언제부터 계셨어요?"
- 아이디어 A-4 아파트편(층간소음)에서 같은 그림 · 목소리를 다시 쓴다.

## 4. 구조와 대본 (54줄 · 약 2:40 예상, 1.25배속)

**인물:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 관리소장 `manager` / 옆집 아이 · 이웃 · 비집고 타는 사람은 대사 없음
**표기:** 「편집」 칸은 Motion 엔진의 전환 · 장치 이름. 컷마다 목소리 둘까지.

### 콜드 오픈 0:00–0:16
| 컷 | 화면 | 대사 (한 / 영) | 편집 |
|---|---|---|---|
| c00 | 1층 로비. 장바구니 든 아빠가 달려가는데 엘리베이터 안의 누군가가 닫힘을 누르고 문이 스르륵 닫힘 | 아빠: "잠깐만요! 잠깐…!" / *Wait! Hold it…!* | `whip-r` · fx `lines` · `slowmo` |
| | 닫힌 문 앞, 숫자만 올라감. 분노한 아빠 | 아빠: "뛰어오는 사람을 두고 닫아?!" / *You close it on someone running?!* | `impact` · `punch` · `buzz` |
| c00a | 다음 엘리베이터 안. 멀리서 누가 뛰어옴. 아빠 손가락이 닫힘을 0.1초에 열 번 | 모라구: "아빠, 저기 누가 뛰어와." / *Dad, someone's running over.* | `focus` 집중선 · 버튼 "닫힘"만 반짝 · `tick` 연타 |
| | 휘파람 부는 아빠 + 후광 | 아빠: "다음 거 타면 되지. 모 어때~" / *They can take the next one. So what~* | `aura` · `kira` · `freeze` + tag "내가 하면: 모 어때" |
| c00b | 정색 나레이션 카드 | 나레이션: "내가 하면 모 어때, 남이 하면 불법. 내모남불, 하나." / *When I do it, so what. When you do it, illegal. Double standard, number one.* | `count: 1` · `stamp` |
| | 아빠 정면 | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* | `snap` |
| | 타이틀 "내가 하면 **모 어때** / 남이 하면 **불—**" → 빨간 도장 **"법!"** · 아래 "엘리베이터편" | — | `slam` → `stamp` · `pang` |

### 사건 개요 0:16–0:28
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c01 | 아파트 복도 15층, 엘리베이터 앞 가족 셋 | 나레이션: "사건 개요. 토요일 오전, 15층." / *Case summary. Saturday morning, 15th floor.* (tts "십오 층") | `news` 띠 · `tick` |
| | `mom-smirk` | 엄마: "오늘은 엘리베이터에서 얌전히 해." / *Behave in the elevator today.* | 컷인 |
| | 아빠 엄지척 | 아빠: "나만큼 매너 좋은 사람이 어딨어?" / *Who has better manners than me?* | 이름표 "내모남불 후보" · `boing` |
| | 나레이션 카드 | 나레이션: "있습니다. 이 아파트에만 삼백 명." / *There are. Three hundred in this building alone.* | `pop` |

### ROUND 1 닫힘 버튼 0:28–1:05
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c02 | "ROUND 1 · 닫힘 버튼" 카드 | 나레이션: "딱 세 판만 하죠. 1라운드, 닫힘 버튼." (tts "일 라운드") / *Just three rounds. Round one: the close button.* | `wipe` · `pang` |
| | 엘리베이터 안. 옆집 아이가 닫힘을 연타 | 아빠: "어허, 요즘 애들은 참을성이 없어." / *Tsk. Kids these days have no patience.* | `punch` |
| | `kid-doubt` | 모라구: "아빠가 아까 더 많이 눌렀어." / *You pressed it way more just now.* | `pop` |
| | 나레이션 카드 | 나레이션: "내모남불, 둘." / *Double standard, number two.* | `count: 2` |
| c02a | 구석에 무표정한 관리소장님 (언제부터?) | 소장: "열 번 눌러도, 한 번 누른 겁니다." / *Press it ten times, it counts as once.* | `smash` · `crash` · `gaan` |
| | `dad-shock` | 아빠: "…언제부터 계셨어요?" / *…How long have you been there?* | `punch` 3단 |
| c02b | **아빠의 상상** (분홍): 닫힘 연타 → 엘리베이터가 로켓처럼 불을 뿜으며 발사 | 아빠: "그래도 누르면 빨라지잖아요!" / *But pressing it makes it faster!* | fx `imagine` · `whip-u` · `dudung` |
| | 상상 화면에 금 → 깨짐. 소장 정색 컷인 | 소장: "바로 안 닫히게 만든 게 많습니다." / *Many are built not to close right away.* | `glitch` · `buzz` |
| c02c | 정답 카드: 닫힘 버튼 + 손가락 열 개 = "1" + **"닫힘 연타 = 한 번 · 정해진 시간 전엔 안 닫히는 엘리베이터가 많다"** | 소장: "뛰어오는 분, 몇 초면 탑니다." / *Whoever's running only needs a few seconds.* | `slam` 카드 · `ding` |
| | 아빠 입을 다문 채 끄덕끄덕 | 아빠: "…네." / *…Yes, sir.* | `boing` |

### ROUND 2 문 잡기 1:05–1:38
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c03 | "ROUND 2 · 문 잡기" 카드 | 나레이션: "2라운드. 문 잡기." (tts "이 라운드") / *Round two: holding the door.* | `glitch` · `pang` |
| | 15층. 층 표시가 "3"에서 1분째 멈춤 | 아빠: "3층에서 누가 문 잡고 있네!" (tts "삼 층") / *Someone's holding it on the third floor!* | `zoom` · `tick` 반복 |
| | 아빠 발 동동 | 아빠: "다들 바쁜데, 기본이 없어!" / *Everyone's busy! No basic manners!* | `shake` · `buzz` |
| c03a | 1층 도착. 아빠가 **발로 문을 막고** 이웃 아저씨와 수다 (뒤에 기다리는 사람들) | 엄마: "여보, 뒤에 사람들 기다려." / *Honey, people are waiting behind us.* | `whip-l` · `scratch` |
| | 아빠 발 클로즈업 + 반짝이 | 아빠: "잠깐이야. 이웃끼리 정이지~" / *Just a sec. Neighbors gotta connect~* | `kira` · `freeze` + tag "내가 하면: 정" |
| | 나레이션 카드 | 나레이션: "내모남불, 셋." / *Double standard, number three.* | `count: 3` |
| c03b | 엘리베이터 안쪽 구석, 또 소장님 | 소장: "정은, 엘리베이터 밖에서 나누시죠." / *Share the love outside the elevator.* | `smash` · `crash` |
| | 정답 카드: 문틈에 발 X + 버튼 "열림" O + **"문은 손 · 발 말고 열림 버튼 · 문에 기대거나 밀지 않기"** | 소장: "발 넣으면 다칩니다. 열림 버튼 쓰세요." / *Put your foot in and you'll get hurt. Use the open button.* | `slam` · `ding` |
| | `mom-sigh` | 엄마: "…모범답안이 또 졌네." / *…The model answer loses again.* | 컷인 |

### ROUND 3 정원 초과 1:38–2:12
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c04 | "ROUND 3 · 정원 초과" 카드 · 저녁 로비, 장바구니 든 가족 | 나레이션: "3라운드. 저녁, 장 보고 귀가." (tts "삼 라운드") / *Round three. Evening, home from shopping.* | `zoom` · `pang` |
| | 꽉 찬 엘리베이터에 누가 비집고 타자 "삐—" | 아빠: "꽉 찼잖아요! 다음 거 타세요!" / *It's full! Take the next one!* | `impact` · `beep` |
| c04a | 다음 엘리베이터도 꽉 참. 아빠가 장바구니 두 개를 들고 비집고 탐 → "삐—" | 아빠: "흡! 숨 참으면 돼. 모 어때~" / *Hup! I'll just hold my breath. So what~* | `focus` · `beep` · 아빠 볼이 빵빵 |
| | 나레이션 카드 | 나레이션: "내모남불, 넷." / *Double standard, number four.* | `count: 4` |
| c04b | 사람들 틈에서 소장님 얼굴만 쏙 | 소장: "숨은, 무게가 없습니다." / *Breath doesn't weigh anything.* | `snap` · `crash` · `gaan` |
| | 정답 카드: 엘리베이터 단면 + 무게 눈금 빨강 + **"삐— 하면 마지막에 탄 사람이 내린다 · 정원 초과는 고장 · 사고 원인"** | 소장: "삐— 하면, 마지막에 탄 분이 내립니다." / *When it beeps, the last one in steps off.* | `slam` · `ding` |
| | 모두의 시선이 아빠에게 | 모라구: "아빠가 마지막이야." / *You were the last one in, Dad.* | `pop` |
| | `dad-sig-1~3` (아빠 시그니처) | 아빠: "…네?" / *…Huh?* | 아빠 시그니처, 한 편에 한 번 |

### 아이 눈높이 2:12–2:32 — 농담 · 효과음 없음
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c05 | 밤, 아빠와 모라구 둘이 계단을 걸어 올라감 (내린 벌로). 창으로 노을 끝 | 모라구: "아빠, 닫힘도, 문도, 삐— 도…" / *Dad, the close button, the door, the beep…* | `iris` · `cut` 만 · 카메라 천천히 · 음악 줄임 · `calm: true` |
| | 모라구 진지한 얼굴 | 모라구: "다 같이 타는 거라서 그런 거지?" / *It's all because we ride together, right?* | |
| | 숨찬 아빠가 웃음 | 아빠: "…그러네. 같이 타는 상자니까." / *…Yeah. It's a box we all share.* | |
| | 모라구가 아빠 손을 잡음 | 모라구: "뛰어오는 사람도, 누군가의 아빠야." / *The one running over is someone's dad too.* | 끝 정리 (한 문장) |

### 반전 2:32–2:50
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c06 | 다음 날 아침, 엘리베이터 안. 비장한 아빠 | 아빠: "이제부터 아빠는 열림 버튼 담당이다." / *From now on, I'm in charge of the open button.* | `zoom` · `aura` |
| | 멀리서 누가 뛰어옴 — 아빠 손가락이 **습관처럼** 닫힘 연타 | 모라구: "아빠, 그거 닫힘이야!" / *Dad, that's the close button!* | `focus` · `tick` 연타 |
| c06a | 닫히는 문틈으로 보이는 사람: 장바구니 든 **엄마** → `mom-sig-scream` | 엄마: "여보오오!!" / *HONEY!!* | `smash` · `crash` · 엄마 시그니처 |
| | 나레이션 카드 | 나레이션: "이건 내모남불이 아닙니다. 남이 아니라 아내니까. 그냥 오답." / *That's not a double standard. She's not a stranger, she's his wife. Just a wrong answer.* | `count: 5` (카운터 글자가 "오답"으로) |
| | 구석의 소장님, 무전기를 듦 | 소장: "1층, 사모님 한 분 낙오." (tts "일 층") / *Ground floor. One wife left behind.* | `snap` |
| | 아빠 정면 | 아빠: "…역시, 모답맨." / *…Classic Modapman.* | `stamp` · `stinger` |
| | 끝 화면: ※ 주석 + "다음 내모남불: 버스편" | — | `note` |

줄 수: 콜드 6 · 개요 4 · R1 10 · R2 9 · R3 8 · 아이 4 · 반전 6 = **47줄** (+ 대사 없는 타이틀 · 끝 화면). 1편(56줄 · 2:10)보다 조금 짧으니, 렌더 길이가 2:00 아래로 나오면 ROUND 2 에 아빠 상상(문 잡고 이웃과 "정" 나누는 드라마 장면) 한 박자를 더한다.

**끝 화면 주석:**
> ※ 일반 설명입니다. 엘리베이터마다 문이 닫히는 방식과 경보는 다를 수 있습니다. 안전 수칙은 건물 관리사무소 안내를 따르세요.

## 5. 그림 목록 (새로 뽑는 것 약 15장 + 공통 재사용)

**뽑는 방법:** `qna/ART_GUIDE.md` 순서 그대로. 소장님 `manager/normal` 을 먼저 뽑아 확정한 뒤 나머지에 붙인다. 엘리베이터 버튼에는 "열림 · 닫힘" 기호(◀▶ / ▶◀)만, 글자 · 로고 · 층 번호판은 코드로 얹는다.

| id | 장면 | people |
|---|---|---|
| `bg/lobby` | 아파트 1층 엘리베이터 로비 (밝은 낮) | — |
| `bg/elevator-inside` | 엘리베이터 안, 버튼판 쪽에서 본 넓은 화면 (빈 배경) | — |
| `full/door-closing` | 문이 닫히는 틈 사이로 장바구니 들고 달려오는 아빠 (콜드 오픈) | dad |
| `cutin/finger-mash` | 닫힘 버튼 연타하는 손가락 클로즈업 (잔상 여러 개) | — (prop 규칙) |
| `dad/whistle-halo` | 휘파람 + 후광, 여유로운 아빠 | dad |
| `manager/normal` | 관리소장님 기준 그림 (먼저 확정) | manager |
| `manager/corner` | 엘리베이터 구석에 무표정하게 서 있음 | manager |
| `cutin/manager-flat` | 소장님 정색 컷인 | manager |
| `manager/radio` | 무전기를 들고 말함 (반전) | manager |
| `full/rocket-imagine` | 아빠의 상상: 엘리베이터가 로켓처럼 발사, 안에서 버튼 누르는 아빠 | dad |
| `full/foot-door` | 1층, 발로 문을 막고 이웃과 수다 떠는 아빠 + 뒤에 기다리는 사람들 | dad (+ 이웃 엑스트라) |
| `full/full-elevator` | 꽉 찬 엘리베이터에 볼 빵빵하게 숨 참고 끼어 있는 아빠 + 장바구니 | dad · mom · kid · manager |
| `full/stairs-night` | 밤, 계단을 오르는 아빠와 모라구 (손잡음, 창밖 노을 끝) | dad · kid |
| `full/mom-door` | 닫히는 문틈 너머 장바구니 들고 달려오는 엄마 | mom |
| `dad/vow` | 주먹 쥐고 비장한 아빠 | dad |

**재사용:** `common/cutin/` dad-shock · dad-proud · dad-sig-1~3 · mom-smirk · mom-sigh · mom-sig-scream · kid-doubt · kid-ask, `common/kid/` · `common/mom/` 포즈.
**코드로 그리는 것:** 타이틀 도장 · ROUND 카드 · 정답 카드 3장(버튼 ×10=1 · 문틈 발 X / 열림 O · 무게 눈금) · 층 표시창 "3" · 뉴스 띠 · 끝 화면.

## 6. 제목 · 썸네일 · 쇼츠

**키워드 조사** (`npm run keywords -- "엘리베이터 닫힘 버튼" "엘리베이터 민폐" "엘리베이터 매너" "엘리베이터 문 잡기" "엘리베이터 정원 초과" "엘리베이터 내로남불" "아파트 민폐"`)로 재고 고른다. 이미 잰 것: "엘리베이터 닫힘 버튼" 중앙값 7,455 · 최근 60일 6개 (2026-10-25).

**제목 후보** ("내로남불"을 앞머리에):
- `엘리베이터 내로남불 — 닫힘 버튼 연타하는 아빠 "다음 거 타면 되지~" | 내모남불`
- `엘리베이터 내로남불, 남이 누르면 민폐 내가 누르면 모 어때 | 닫힘 버튼·문 잡기·정원 초과 | 내모남불`

**썸네일:** 위 "남이 누르면 민폐!"(흰) / "내가 누르면 모 어때~"(노랑) · 작은 셋째 줄 "엘리베이터편" · 닫힘 연타 손가락 + 후광 아빠 · 구석 소장님 정색 컷인 · 카운터 4

**쇼츠** (`motion-short.json`, 관련 동영상 = 본편):
- ① 닫힘 버튼 (콜드 오픈 + ROUND 1) — "열 번 눌러도 한 번입니다"
- ② 정원 초과 (ROUND 3) — "숨은 무게가 없습니다"
- ③ 반전 (ROUND 2 + 반전) — "사모님 한 분 낙오"

**업로드:** 모라구, 재생목록 「내로남불 · 내모남불」 PLEJvhEloY2QQ · 아동용 아님 · AI 아니요 · 교육 · 비공개로 올리고 공개는 확인 후.

## 7. 한 문장 정리

> 엘리베이터는 다 같이 타는 상자 — 뛰어오는 사람도 누군가의 아빠다.

## 출처
- [일요시사 — 엘리베이터 닫힘 버튼, 눌러도 바로 안 닫히는 이유](https://www.ilyosisa.co.kr/mobile/article.html?no=252391)
- [Mental Floss — Do 'Close Door' Buttons in Elevators Actually Do Anything?](https://mentalfloss.com/article/547416/do-close-door-buttons-elevators-actually-do-anything)
- [Quartz — Close door buttons on elevators don't work](https://qz.com/822873/close-door-buttons-on-elevators-dont-work)
- [데일리안 — 지하철역 승강기 10초 대기 (한 곳 보도라 대본에 쓰지 않음)](https://m.dailian.co.kr/news/view/1445849)
- [연수구 — 승강기 안전 이용 수칙 (정원 초과 시 마지막 탄 사람이 내림 · 문 밀지 않기)](https://www.yeonsu.go.kr/safety/cyber/act/accident_elevator.asp)
- [서울시 안전 — 승강기 안전 이용](https://news.seoul.go.kr/safe/?p=15656)
