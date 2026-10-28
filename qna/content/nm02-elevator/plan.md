# 내모남불 ② 엘리베이터편 · 닫힘 버튼 · 층 버튼 · 통화 — 기획 (v2, 2026-10-26)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본을 고치면 여기 대본도 같이 고친다 (`script/script.json` 이 생긴 뒤에는 그쪽이 원본).
> **`docs/naemonambul-ideas.md` 의 A-1 엘리베이터편 그대로** 짰다 (라운드 · 정답 인물 · 아이 한 줄 · 반전). v1(문 잡기 · 정원 초과로 바꾼 판)은 `_old/plan-v1-door.md`.
> 1편과 같이 1.25배속, gap 0, `chop: 42`, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다.
> 상태 (2026-10-26): 대본 `script/script.json`(51줄) · 그림 18장(크롬 Gemini, 기준 그림 첨부) · 샷 계획 `script/motion.json`(Nm02-Naemonambul) 완료. 음성 전 — 관리소장 목소리 역할은 `aptmgr`(Orus 후보, `manager` 는 1화 유스호스텔 사장님이 이미 씀).

## 1. 한 줄 컨셉

토요일, 모 씨네 아파트 엘리베이터.
- 남이 닫힘을 누르면 "어떻게 사람을 두고 닫아?!" ↔ 아빠는 닫힘 연타 "다음 거 타면 되지~ 모 어때"
- 남의 집 아이가 버튼을 전부 누르면 "부모는 뭐 하고!" ↔ 아빠는 층을 잘못 두 개 누르고 "실수지 실수~"
- 남이 큰 소리로 통화하면 "민폐야" ↔ 아빠는 스피커폰으로 통화
- 관리소장님(무표정한 60대, 무전기)이 매번 엘리베이터 구석에 이미 서 있다가 정색 한 줄.
- 모라구: "아빠, 뛰어오는 사람도 누군가의 아빠야."
- 반전: 아빠가 닫힘을 연타하는 사이, 장바구니 든 엄마가 달려오다 못 탄다 → 엄마 시그니처 비명.

## 2. 자료조사

정답 카드는 **지자체 승강기 안전 이용 수칙**(연수구 안전 누리집)의 문장으로 만든다. 세 라운드에 하나씩 딱 맞는 문장이 있다. 숫자는 넣지 않는다.

| 라운드 | 사실 (수칙 원문) | 확인 상태 | 대본에 쓰는 법 |
|---|---|---|---|
| 1 닫힘 버튼 | "뒤에 타는 이용자를 위해 **열림 버튼을 눌러줍시다**" | 연수구 승강기 안전 수칙 | 정답 카드 · 소장님 "뒤에 오는 분께는, 열림 버튼입니다." |
| 1 닫힘 버튼 | 닫힘을 눌러도 정해진 시간 전에는 바로 안 닫히게 만든 엘리베이터가 많다 · 연타해도 한 번 누른 것과 같다 | 언론 설명(일요시사) · 해외 설명(Mental Floss · Quartz) | "바로 안 닫히게 만든 게 많습니다"까지만. 아이디어의 "몇 초 차이 안 납니다"는 **초 단위 근거가 없어** 쓰지 않는다 |
| 1 닫힘 버튼 | 지하철역 승강기 10초 대기 | **한 곳 보도뿐**(데일리안) | 쓰지 않는다 |
| 2 층 버튼 | "승강기 **버튼으로 장난치지** 맙시다" · 누른 층은 다 선다 | 연수구 수칙 · 누른 층에 서는 건 기본 동작 | 정답 카드 · 소장님 "실수든 장난이든, 누른 층은 다 섭니다." |
| 2 층 버튼 | 잘못 누른 층을 두 번 눌러 취소하는 기능 | 제조사마다 다름, 근거 못 찾음 | **쓰지 않는다** (아빠가 취소 방법을 몰라 허둥대는 장면만) |
| 3 통화 | "승강기 안에서 **떠들지** 맙시다" | 연수구 수칙 | 정답 카드 "좁은 상자에선 작게 · 통화는 내려서" (뒤쪽은 매너 권유로 표시) |
| 공통 (심리학 카드) | **행위자-관찰자 편향**: 남의 행동은 성격 탓, 내 행동은 상황 탓으로 보는 경향 (Jones & Nisbett, 1971) | 사회심리학 교과서 정의 — 대본 쓰기 전 교과서 문장으로 한 번 더 확인 | ROUND 1 나레이션 카드 한 장 (시리즈 "진짜 이유" 카드, 이번 편 담당) |

빼는 것: 택배 · 배달 기사님이 여러 층을 누르는 이야기 (실제 논란 소재라 남을 탓하는 그림이 된다).

**내모남불 카운터**
1. 콜드 오픈 — 닫힘 연타 "다음 거 타면 되지~"
2. ROUND 1 — "아빠는 바빠서 누른 거고, 그 사람은 성격이 급한 거야" (→ 행위자-관찰자 편향 카드)
3. ROUND 2 — 층 두 개 잘못 누르고 "실수지 실수~"
4. ROUND 3 — 스피커폰 "급한 전화잖아~"
5. 반전 — 닫힘 연타로 엄마를 두고 감 → "남이 아니라 아내니까. 그냥 **오답**."

## 3. 정답 인물 — 관리소장님 (새 인물)

- 목소리 역할 id `aptmgr` (`voice.json` 에 넣었다 — `manager` 는 유스호스텔 사장님이 이미 씀), 그림 id 는 `manager/…`. 목소리 후보 **Orus** — 음성 만들 때 한 줄 들어 보고 정한다.
  - style: "A Korean apartment complex manager in his early sixties: flat, dry, deadpan voice like a building announcement, polite but completely unimpressed, never angry"
- 생김새 (`art.json` cast): `"the apartment manager: a Korean man in his early sixties, short neat gray hair, rimless glasses, expressionless face, navy work vest over a light blue shirt, name badge, a walkie-talkie clipped to his belt"`
- 반복 개그: 세 라운드 모두 엘리베이터 안쪽 구석에 이미 서 있다. 아빠가 "…언제부터 계셨어요?"
- A-4 아파트편(층간소음)에서 같은 그림 · 목소리를 다시 쓴다.

## 4. 구조와 대본 (53줄 · 약 2:40 예상, 1.25배속)

**인물:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 관리소장 `manager` / 옆집 아이 · 통화하는 아저씨 · 뛰어오는 사람은 대사 없음
**표기:** 「편집」 칸은 Motion 엔진의 전환 · 장치 이름. 컷마다 목소리 둘까지 (아빠와 나레이션은 같은 목소리).

### 콜드 오픈 0:00–0:16
| 컷 | 화면 | 대사 (한 / 영) | 편집 |
|---|---|---|---|
| c00 | 1층 로비. 아빠가 뛰어가는데 엘리베이터 안에서 누가 닫힘 연타, 문이 스르륵 닫힘 | 아빠: "잠깐만요! 잠깐…!" / *Wait! Hold it…!* | `whip-r` · fx `lines` · `slowmo` |
| | 닫힌 문 앞, 층 숫자만 올라감. 분노한 아빠 | 아빠: "어떻게 사람을 두고 닫아?!" / *How can you close it on someone?!* | `impact` · `punch` · `buzz` |
| c00a | 다음 엘리베이터 안. 멀리서 누가 뛰어옴. 아빠 손가락이 닫힘을 0.1초에 열 번 | 모라구: "아빠, 저기 누가 뛰어와." / *Dad, someone's running over.* | `focus` 집중선 · 버튼 "닫힘"만 반짝 · `tick` 연타 |
| | 휘파람 부는 아빠 + 후광 | 아빠: "다음 거 타면 되지. 모 어때~" / *They can take the next one. So what~* | `aura` · `kira` · `freeze` + tag "내가 하면: 모 어때" |
| c00b | 정색 나레이션 카드 | 나레이션: "내가 하면 모 어때, 남이 하면 불법. 내모남불, 하나." / *When I do it, so what. When you do it, illegal. Double standard, number one.* | `count: 1` · `stamp` |
| | 아빠 정면 | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* | `snap` |
| | 타이틀 "내가 하면 **모 어때** / 남이 하면 **불—**" → 빨간 도장 **"법!"** · 아래 "엘리베이터편" | — | `slam` → `stamp` · `pang` |

### 사건 개요 0:16–0:26
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c01 | 15층 복도, 엘리베이터 앞 가족 셋 | 나레이션: "사건 개요. 토요일 오전, 15층." (tts "십오 층") / *Case summary. Saturday morning, 15th floor.* | `news` 띠 · `tick` |
| | `mom-smirk` | 엄마: "오늘은 엘리베이터에서 얌전히 해." / *Behave in the elevator today.* | 컷인 |
| | 아빠 엄지척 | 아빠: "나만큼 매너 좋은 사람이 어딨어?" / *Who has better manners than me?* | 이름표 "내모남불 후보" · `boing` |
| | 나레이션 카드 | 나레이션: "있습니다. 이 아파트에만 삼백 명." / *There are. Three hundred in this building alone.* | `pop` |

### ROUND 1 닫힘 버튼 0:26–1:05
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c02 | "ROUND 1 · 닫힘 버튼" 카드 | 나레이션: "딱 세 판만 하죠. 1라운드, 닫힘 버튼." (tts "일 라운드") / *Just three rounds. Round one: the close button.* | `wipe` · `pang` |
| | `kid-doubt` | 모라구: "아빠도 아까 닫힘 눌렀잖아." / *You pressed close too, just now.* | `pop` |
| | 아빠 손가락 강의 (`dad-proud`) | 아빠: "아빠는 바빠서 누른 거고," / *I pressed it because I was busy,* | 금빛 선 |
| | 상상 컷: 아까 그 사람 얼굴에 "성격 급함" 도장 | 아빠: "그 사람은 성격이 급한 거야." / *he did it because he's impatient.* | `stamp` · `boing` |
| | 나레이션 카드 | 나레이션: "내모남불, 둘." / *Double standard, number two.* | `count: 2` |
| c02a | **심리학 카드**: 왼쪽 "남이 하면 → 성격 탓" / 오른쪽 "내가 하면 → 상황 탓" | 나레이션: "이걸 행위자-관찰자 편향이라고 합니다." / *This is called the actor-observer bias.* | `slam` · `news` 띠 "오늘의 진짜 이유" |
| | `kid-ask` | 모라구: "행위자… 뭐?" / *Actor… what?* | `pop` |
| c02b | 구석에 무표정한 관리소장님 (언제부터?) | 소장: "열 번 눌러도, 한 번 누른 겁니다." / *Press it ten times, it counts as once.* | `smash` · `crash` · `gaan` |
| | `dad-shock` | 아빠: "…언제부터 계셨어요?" / *…How long have you been there?* | `punch` 3단 |
| c02c | **아빠의 상상** (분홍): 닫힘 연타 → 엘리베이터가 로켓처럼 불을 뿜으며 발사 | 아빠: "그래도 연타하면 빨라지잖아요!" / *But mashing it makes it faster!* | fx `imagine` · `whip-u` · `dudung` |
| | 상상 화면에 금 → 깨짐. 소장 정색 컷인 | 소장: "바로 안 닫히게 만든 게 많습니다." / *Many are built not to close right away.* | `glitch` · `buzz` |
| c02d | 정답 카드: 닫힘 ✕ / 열림 ○ + **"뒤에 타는 사람을 위해 열림 버튼"** (작게 "승강기 안전 이용 수칙") | 소장: "뒤에 오는 분께는, 열림 버튼입니다." / *For whoever's behind you, it's the open button.* | `slam` 카드 · `ding` |
| | `dad-shock` 크래시 줌 | 아빠: "…네?" / *…Huh?* | `punch` |

### ROUND 2 층 버튼 1:05–1:38
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c03 | "ROUND 2 · 층 버튼" 카드 | 나레이션: "2라운드. 층 버튼." (tts "이 라운드") / *Round two: the floor buttons.* | `glitch` · `pang` |
| | 버튼판 전체에 불이 다 켜짐, 옆집 아이가 해맑게 웃으며 내림. 층마다 "띵" 서고 문 열림 | 아빠: "14층, 13층, 12층… 다 눌렀어?!" (tts "십사 층, 십삼 층, 십이 층") / *14, 13, 12… it pressed every one?!* | `focus` · `ding` 연속 · `zoom` 반복 |
| | 아빠 발 동동, 분노 | 아빠: "부모는 대체 뭐 하고!" / *Where are the parents?!* | `impact` · `shake` · `buzz` |
| c03a | 그날 오후, 1층에서 올라감. 엄마와 대화하던 아빠 손이 5 · 6을 누름 | 나레이션: "그날 오후." / *That afternoon.* | `whip-l` · `tick` |
| | 엄마가 버튼판을 가리킴 | 엄마: "여보, 5층이랑 6층은 왜 눌렀어?" (tts "오 층이랑 육 층") / *Honey, why'd you press 5 and 6?* | `scratch` |
| | 버튼을 다시 콕콕 눌러 보지만 안 꺼짐. 반짝이 미소 | 아빠: "실수지 실수~ 모 어때." / *Just a mistake~ So what.* | `kira` · `freeze` + tag "내가 하면: 실수" |
| | 나레이션 카드 | 나레이션: "내모남불, 셋." / *Double standard, number three.* | `count: 3` |
| c03b | 구석에 또 소장님 | 소장: "실수든 장난이든, 누른 층은 다 섭니다." / *Mistake or prank, it stops at every floor you press.* | `smash` · `crash` |
| | 정답 카드: 불 켜진 버튼판 + **"누른 층은 다 선다 · 버튼으로 장난치지 않기"** (작게 "승강기 안전 이용 수칙") | 엄마: "…아까 그 부모가 당신이네." / *…Looks like you're "the parents" now.* | `slam` · `ding` → `mom-sigh` |

### ROUND 3 통화 1:38–2:12
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c04 | "ROUND 3 · 통화" 카드 | 나레이션: "3라운드. 통화." (tts "삼 라운드") / *Round three: phone calls.* | `zoom` · `pang` |
| | 엘리베이터 안, 낯선 아저씨가 큰 소리로 통화 (말풍선에 "어어! 그래그래!" 크게) | 아빠: "여기서 저렇게 크게 통화를 해? 민폐야." / *Talking that loud in here? So rude.* | `shake` · `buzz` |
| | `kid-doubt` | 모라구: "아빠 목소리도 커." / *Your voice is loud too.* | `pop` |
| c04a | 아빠 폰이 울림 → 스피커폰으로 받음. 부장님 목소리는 말풍선만 | 아빠: "네, 부장님! 스피커로 받을게요!" / *Yes, sir! I'll put you on speaker!* | `whip-r` · `beep` |
| | 엘리베이터 가득 아빠 웃음, 다른 사람들 귀 막음 | 아빠: "급한 전화잖아. 모 어때~" / *It's an urgent call. So what~* | `aura` · `freeze` + tag "내가 하면: 급한 전화" |
| | 나레이션 카드 | 나레이션: "내모남불, 넷." / *Double standard, number four.* | `count: 4` |
| c04b | 사람들 틈에서 소장님 얼굴만 쏙 | 소장: "이 상자는, 소리가 다 들립니다." / *In this box, everyone hears everything.* | `snap` · `crash` · `gaan` |
| | 정답 카드: 엘리베이터 단면 + 음파가 벽에 튕김 + **"승강기 안에서는 조용히 · 통화는 내려서"** (작게 "수칙: 떠들지 맙시다") | 소장: "통화는, 내리셔서 하시죠." / *Take the call after you get off.* | `slam` · `ding` |
| | `dad-sig-1~3` (아빠 시그니처) | 아빠: "…네?" / *…Huh?* | 아빠 시그니처, 한 편에 한 번 |

### 아이 눈높이 2:12–2:32 — 농담 · 효과음 없음
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c05 | 해질녘, 아파트 놀이터 벤치. 모라구와 아빠 | 모라구: "아빠, 닫힘도, 버튼도, 통화도…" / *Dad, the close button, the buttons, the call…* | `iris` · `cut` 만 · 카메라 천천히 · 음악 줄임 · `calm: true` |
| | 모라구 진지한 얼굴 | 모라구: "남이 하면 잘 보이는데, 아빠가 하면 안 보여?" / *You can see it when others do it, but not when you do?* | |
| | 아빠, 잠시 말이 없다가 | 아빠: "…그러네. 아빠 눈엔 아빠가 안 보였네." / *…Yeah. I couldn't see myself.* | |
| | 모라구가 아빠 손을 잡음 | 모라구: "뛰어오는 사람도, 누군가의 아빠야." / *The one running over is someone's dad too.* | 끝 정리 (한 문장) |

### 반전 2:32–2:50
| 컷 | 화면 | 대사 | 편집 |
|---|---|---|---|
| c06 | 다음 날 아침, 엘리베이터 안. 시계를 본 아빠가 닫힘 연타 | 아빠: "늦었다, 늦었다!" / *I'm late, I'm late!* | `focus` · `tick` 연타 |
| | 멀리서 누가 뛰어옴 | 모라구: "아빠, 누가 뛰어와!" / *Dad, someone's running!* | `whip-r` |
| c06a | 닫히는 문틈으로 보이는 사람: 장바구니 든 **엄마** → `mom-sig-scream` | 엄마: "여보오오!!" / *HONEY!!* | `smash` · `crash` · 엄마 시그니처 |
| | 나레이션 카드 | 나레이션: "이건 내모남불이 아닙니다. 남이 아니라 아내니까. 그냥 오답." / *That's not a double standard. She's not a stranger, she's his wife. Just a wrong answer.* | `count: 5` (카운터 글자가 "오답"으로) |
| c06b | 구석의 소장님, 무전기를 듦 | 소장: "15층, 사모님 한 분 남으셨습니다." (tts "십오 층") / *15th floor. One wife left behind.* | `snap` |
| | 아빠 정면 | 아빠: "…역시, 모답맨." / *…Classic Modapman.* | `stamp` · `stinger` |
| | 끝 화면: ※ 주석 + "다음 내모남불: 버스편" | — | `note` |

줄 수: 콜드 6 · 개요 4 · R1 13 · R2 9 · R3 9 · 아이 4 · 반전 6 = **51줄** (+ 대사 없는 타이틀 · 끝 화면).

**끝 화면 주석:**
> ※ 일반 설명입니다. 엘리베이터마다 문이 닫히는 방식은 다를 수 있습니다. 안전 수칙은 지자체 · 건물 관리사무소 안내를 따르세요.

## 5. 그림 목록 (새로 뽑는 것 약 15장 + 공통 재사용)

**뽑는 방법:** `qna/ART_GUIDE.md` 순서 그대로. 소장님 `manager/normal` 을 먼저 뽑아 확정한 뒤 나머지에 붙인다. 버튼은 열림 · 닫힘 기호(◀▶ / ▶◀)만 그리고, 층 숫자 · 글자는 코드로 얹는다.

| id | 장면 | people |
|---|---|---|
| `bg/lobby` | 아파트 1층 엘리베이터 로비 (밝은 낮) | — |
| `bg/elevator-inside` | 엘리베이터 안, 버튼판 쪽에서 본 넓은 화면 (빈 배경) | — |
| `full/door-closing` | 문이 닫히는 틈 사이로 손 뻗으며 달려오는 아빠 (콜드 오픈) | dad |
| `prop/finger-mash` | 닫힘 버튼 연타하는 손가락 클로즈업 (잔상 여러 개) | — (prop 규칙) |
| `dad/whistle-halo` | 휘파람 + 후광, 여유로운 아빠 | dad |
| `manager/normal` | 관리소장님 기준 그림 (먼저 확정) | manager |
| `manager/corner` | 엘리베이터 구석에 무표정하게 서 있음 | manager |
| `cutin/manager-flat` | 소장님 정색 컷인 | manager |
| `manager/radio` | 무전기를 들고 말함 (반전) | manager |
| `full/rocket-imagine` | 아빠의 상상: 엘리베이터가 로켓처럼 발사, 안에서 버튼 연타하는 아빠 | dad |
| `prop/panel-all-lit` | 버튼판 전체에 불이 다 켜짐 | — (prop 규칙) |
| `full/dad-wrong-floor` | 엄마와 얘기하며 무심코 버튼 두 개를 누르는 아빠, 옆에서 보는 엄마 | dad · mom |
| `full/loud-phone` | 큰 소리로 통화하는 낯선 아저씨 + 귀를 찡그린 아빠 · 모라구 | dad · kid (+ 엑스트라) |
| `full/dad-speaker` | 스피커폰 들고 크게 웃는 아빠, 귀 막은 사람들, 구석의 소장님 | dad · manager (+ 엑스트라) |
| `full/bench-dusk` | 해질녘 놀이터 벤치의 모라구와 아빠 (손잡음) | dad · kid |
| `full/mom-door` | 닫히는 문틈 너머 장바구니 들고 달려오는 엄마 | mom |

**재사용:** `common/cutin/` dad-shock · dad-proud · dad-sig-1~3 · mom-smirk · mom-sigh · mom-sig-scream · kid-doubt · kid-ask, `common/kid/` · `common/mom/` 포즈. "남의 집 아이"는 `panel-all-lit` 옆에 실루엣만 (새 인물을 늘리지 않는다).
**코드로 그리는 것:** 타이틀 도장 · ROUND 카드 · 심리학 카드(성격 탓 / 상황 탓) · 정답 카드 3장 · 층 숫자 표시 · "성격 급함" 도장 · 말풍선 · 뉴스 띠 · 끝 화면.

## 6. 제목 · 썸네일 · 쇼츠

**키워드 조사** (`npm run keywords -- "엘리베이터 닫힘 버튼" "엘리베이터 민폐" "엘리베이터 매너" "엘리베이터 버튼 장난" "엘리베이터 통화" "엘리베이터 내로남불" "행위자 관찰자 편향" "아파트 민폐"`)로 재고 고른다. 이미 잰 것: "엘리베이터 닫힘 버튼" 중앙값 7,455 · 최근 60일 6개, "내로남불 심리" 2,210 (2026-10-25).

**제목 후보** ("내로남불"을 앞머리에):
- `엘리베이터 내로남불 — 닫힘 버튼 연타하는 아빠 "다음 거 타면 되지~" | 내모남불`
- `엘리베이터 내로남불, 남이 누르면 민폐 내가 누르면 모 어때 | 닫힘 버튼·층 버튼·통화 | 내모남불`

**썸네일:** 위 "남이 누르면 민폐!"(흰) / "내가 누르면 모 어때~"(노랑) · 작은 셋째 줄 "엘리베이터편" · 닫힘 연타 손가락 + 후광 아빠 · 구석 소장님 정색 컷인 · 카운터 4

**쇼츠** (`motion-short.json`, 관련 동영상 = 본편, 라운드마다 하나):
- ① 닫힘 버튼 (콜드 오픈 + ROUND 1) — "열 번 눌러도, 한 번 누른 겁니다"
- ② 층 버튼 (ROUND 2) — "아까 그 부모가 당신이네"
- ③ 통화 (ROUND 3 + 반전) — "이 상자는, 소리가 다 들립니다"

**업로드:** 모라구, 재생목록 「내로남불 · 내모남불」 PLEJvhEloY2QQ · 아동용 아님 · AI 아니요 · 교육 · 비공개로 올리고 공개는 확인 후.

## 7. 한 문장 정리

> 남이 하면 잘 보이고 내가 하면 안 보인다 — 뛰어오는 사람도 누군가의 아빠다.

## 출처
- [연수구 안전 누리집 — 승강기 안전 이용 수칙 (열림 버튼 · 버튼 장난 · 떠들지 않기)](https://www.yeonsu.go.kr/safety/cyber/act/accident_elevator.asp)
- [일요시사 — 엘리베이터 닫힘 버튼, 눌러도 바로 안 닫히는 이유](https://www.ilyosisa.co.kr/mobile/article.html?no=252391)
- [Mental Floss — Do 'Close Door' Buttons in Elevators Actually Do Anything?](https://mentalfloss.com/article/547416/do-close-door-buttons-elevators-actually-do-anything)
- [Quartz — Close door buttons on elevators don't work](https://qz.com/822873/close-door-buttons-on-elevators-dont-work)
- [데일리안 — 지하철역 승강기 10초 대기 (한 곳 보도라 대본에 쓰지 않음)](https://m.dailian.co.kr/news/view/1445849)
- Jones, E. E., & Nisbett, R. E. (1971). *The actor and the observer: Divergent perceptions of the causes of behavior.* (행위자-관찰자 편향)
