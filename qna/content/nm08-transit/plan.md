# 내모남불 ⑧ 대중교통편 · 자리 · 자는 척 · 통화 · 커피 — 기획 (v1, 2026-11-02)

> 모답맨 기획서. 규칙은 스킬 `modapman` · 시리즈 문서 `qna/docs/naemonambul.md`, 그림은 `qna/ART_GUIDE.md`. 대본 원본은 나중에 `script/script.json` (고치면 여기 대본 표도 같이 고친다).
> 2026-11-02 사용자 요청: "대중교통편 — 자리 맡기, 자는 척하기, 부정승차, 음식 취식, 전화 통화, 큰 백팩, 큰 소리로 떠들기 등을 재밌고 익살스럽고 병맛으로". 아이디어 문서 A-2(버스 · 지하철편, "버스 민폐" 조회수 중앙값 65만)를 넓힌 것.
> 1~7편처럼 1.25배속, 애니 fx(`impact` · `focus` · `gaan` · `aura` · `kira`)를 많이 쓴다. 목표 약 3분 · 58줄.

## 0. 조심할 것

- **실제 승객을 놀리지 않는다.** 민폐 행동은 아빠가 다 한다. 남이 하는 장면의 "남"은 얼굴 없는 실루엣이거나 한 번 스치는 엑스트라이고, 웃음은 아빠의 이중 잣대에서만 나온다.
- **노약자석 · 자는 척 라운드:** 겉으로 티 안 나는 사정(임신 초기 · 아픈 다리 · 몸이 불편한 사람)이 있을 수 있다는 걸 아이 한 줄로 꼭 정리한다. 자리에 앉은 젊은 사람을 "요즘 애들"로 비꼬지 않는다. "요즘 애들"은 아빠의 틀린 말로만.
- **부정승차는 따라 하지 않게.** 아빠가 시키지만 모라구가 먼저 "아빠, 나 여덟 살이야"로 멈추고, 정답 인물이 바로잡는다. 개찰구를 실제로 뛰어넘는 장면은 그리지 않는다 (실루엣이 "넘으려다" 멈추는 정도).
- 실제 노선 번호 · 역 이름 · 교통 회사 로고 · 지역 이름은 넣지 않는다. 역 이름은 코드로 "내로남불역" · "모어때역" 같은 가짜 이름.
- 요금 · 과태료 금액은 숫자로 말하지 않는다 (지역 · 시기마다 다르다). "운임의 30배" 같은 배수 · 원칙만.
- 끝 화면 주석:
  > ※ 등장하는 인물 · 역 · 노선은 꾸민 것입니다. 운임 · 승차 규정은 일반 설명이며, 지역 · 운영 기관마다 다를 수 있습니다.

## 1. 한 줄 컨셉

월요일 출근길, 아빠와 모라구가 지하철을 탄다 (아빠가 모라구를 학교 앞까지 데려다주는 날). 남이 하면 혀를 차던 민폐를 아빠는 하나도 빠짐없이 자기만 봐준다. 정답 담당은 **역무원 언니** — 그런데 갈아탄 버스의 **기사님이 똑같이 생겼다**. 쌍둥이다. 어딜 가도 같은 얼굴이 같은 정색 안내 방송 톤으로 아빠를 바로잡는다.

- **타이틀 도장:** "남이 하면 **불—**" + 빨간 도장 **"쾌!"** (불쾌)
- **병맛 장치 ①: 쌍둥이 정색.** 역무원 언니(지하철) = 버스 기사님(버스). 같은 얼굴 · 같은 목소리 · 같은 말투("고객님, 안내 말씀 드립니다."). 아빠만 매번 놀란다 → R4 에서 "…여기도 계세요?!" "동생입니다." 끝 화면에서 둘이 나란히 경례.
- **병맛 장치 ②: 올림픽 중계.** 빈자리가 나면 화면이 스포츠 중계로 바뀐다. 해설(나레이션)이 "모 선수, 3미터 도움닫기! 공중 반 바퀴 비틀어 착석!" → 점수판 9.8 (코드).
- **병맛 장치 ③: 안내 방송 패러디.** 역 도착 방송이 "이번 역은… 내로남불역입니다. 내리실 문은 양심 쪽입니다." 라운드가 끝날 때마다 다음 역 이름이 바뀐다 (코드 · 효과음 `ding` 두 번).
- **반복 개그: 아빠의 "모 어때~"** 라운드마다 한 번, 아빠 머리 위에 반짝이 + `kira`.
- **복선 → 회수:** 아빠가 하루 종일 남의 민폐 다섯 가지에 혀를 찬다 → 반전에서 퇴근 버스에 지쳐 잠든 아빠가 그 다섯 가지를 **혼자 한꺼번에** 하고 있다 (쩍벌 · 백팩 · 커피 · 휴대폰 영상 소리 · 코골이).

## 2. 자료조사 (2026-11-02)

| 자리 | 카드 | 한 줄 (화면) | 근거 | 확인 상태 |
|---|---|---|---|---|
| 콜드 오픈 | **정답 카드 · 부정승차 = 운임 30배** | 표 없이 타면 그 구간 운임에 더해 30배를 더 낸다 | 철도사업법 · 각 운영 기관 여객운송약관 (부가운임 30배). 서울교통공사 · 코레일 단속 보도 다수, 서울시 미디어허브 "부가금 왜 30배일까?" | 원칙 확인 ([미디어허브](https://mediahub.seoul.go.kr/archives/832673) · [헤럴드경제 2026-04](https://www.heraldk.com/article/2026042615280254410)). **조 번호는 국가법령정보센터에서 업로드 전 확인** |
| 콜드 오픈 | 어린이 요금 | 공짜는 여섯 살 전까지, 여덟 살은 어린이 요금 | 서울 지하철 · 버스: 만 6세 미만 영유아 무료(보호자 동반), 만 6~12세 어린이 요금 | **업로드 전 서울교통공사 운임 안내로 확인** |
| R2 | **정답 카드 · 교통약자석** | 노약자 · 임산부 · 장애인 · 어린이 동반은 법이 정한 교통약자 | 「교통약자의 이동편의 증진법」 제2조(정의: 장애인 · 고령자 · 임산부 · 영유아 동반자 · 어린이 등), 교통사업자는 이동편의시설 설치기준을 지켜야 한다 | 정의 조문 확인 ([위키문헌](https://ko.wikisource.org/wiki/%EA%B5%90%ED%86%B5%EC%95%BD%EC%9E%90%EC%9D%98_%EC%9D%B4%EB%8F%99%ED%8E%B8%EC%9D%98_%EC%A6%9D%EC%A7%84%EB%B2%95)). "앉으면 처벌"은 **아니다** — 대사도 "양보하는 자리"까지만 |
| R3 | **심리학 카드 · 반쪽 대화** (halfalogue) | 한쪽만 들리는 통화는 둘이 하는 대화보다 더 신경 쓰인다 | Emberson · Lupyan · Goldstein · Spivey 2010, *Psychological Science* 21(10):1383 — 한쪽만 들린 통화에서 주의 과제 성적이 떨어짐(다음 말을 예측할 수 없어서) | 확인 ([APS](https://www.psychologicalscience.org/news/releases/halfalogue-overheard-cell-phone-conversations-are-not-only-annoying-but-reduce-our-attention-html.html) · [논문 PDF](https://babylab.cornell.edu/files/2022/01/2010-Emberson-Lupyan-Goldstein-Spivey-Psych_Sci.pdf)) |
| R4 | **정답 카드 · 버스 테이크아웃 컵** | 기사님은 음식물이 든 일회용 컵 승차를 거절할 수 있다 | 「서울특별시 시내버스 재정지원 및 안전 운행기준에 관한 조례」 2018-01-04 개정 — 운전자가 음식물이 담긴 일회용 컵 · 불결 · 악취 물품 운송 거부 가능. 세부기준: 뚜껑 없는 컵 · 빨대 꽂힌 컵 금지, 밀폐 텀블러 · 따지 않은 캔 허용 | 확인 ([서울시 교통](https://news.seoul.go.kr/traffic/archives/36023)). **현행 조례 원문 한 번 더**. 서울 시내버스만 — 화면에 "서울 시내버스 기준" |
| 속사포 · 음식 | 지하철 취식 | 지하철엔 취식 금지 조항은 없지만, 냄새나는 음식은 약관상 반입 제한 대상 | 서울교통공사 여객운송약관 제34조(불결 · 악취 물품 반입 제한), 취식 민원 해마다 약 1천 건 (2025 서울시의회) | 보도로 확인 ([경향 2025-11](https://www.khan.co.kr/article/202511121540011)). 대사에선 "지하철은 자제 권고"까지만 |
| R1 | **심리학 카드 · 영역 표시** | 가방 하나만 놔도 사람들은 그 자리를 피한다 | Sommer · Becker 1969 (도서관 자리에 놓인 물건이 남의 착석을 막는다 — 공공장소 영역 표시) | **대본 확정 전 원문 요지 확인** (안 되면 "자기 위주 편향"(self-serving bias) 카드로 바꾼다) |

**검색 힌트:** "버스 민폐" 조회수 중앙값 65만 · 최근 60일 0개 (2026-10-25 조사, 아이디어 문서). 업로드 전 `npm run seo -- qna nm08 "지하철 민폐" "버스 민폐" "지하철 빌런" "임산부 배려석" "지하철 통화" "부정승차" "지하철 백팩" "대중교통 내로남불"` 로 다시 조사.

**내모남불 카운터 (10 + 그냥 오답)**
1. 콜드 오픈 — 남이 넘으면 범죄, 내 아들은 "아직 아기"
2. R1 자리 — 남의 가방은 자리 사유화, 내 가방은 가족 예약석
3. R2 자는 척 — 남이 자면 연기대상, 내가 자면 진짜 기절
4. R3 통화 — 남의 통화는 소음 공해, 내 통화는 업무
5. R4 커피 — 남의 컵은 테러, 내 컵은 출근 필수품
6 · 7 · 8. 속사포 — 큰 백팩 · 큰 소리 수다 · 스피커 영상
9. 반전 — 남이 하면 민폐, 내가 하면 "피곤해서" (다섯 개 한꺼번에)
10. 반전 끝 — 엄마 전화를 스피커로 받는 아빠 → "내모남불, 열." → "그냥 오답." → "…역시, 모답맨."

## 3. 인물

**목소리:** 아빠 · 나레이션 Algenib / 모라구 Leda / 엄마 Kore / 역무원 언니 `staff` · 버스 기사님 `driver` **Laomedeia** (새 역할 둘, **같은 목소리** — 쌍둥이 개그) / 할머니 `granny` Gacrux (6편 그림 · 목소리 재사용)

- **역무원 언니** (새, 정답 담당) — 30대 초반 여자, 단정한 묶음머리, 남색 근무복(마크 · 글자 없음), 작은 무전기, 흰 장갑. 표정 변화 거의 없이 안내 방송 톤 정색. `staff/normal` 부터 확정.
- **버스 기사님** (새, 쌍둥이 동생) — 역무원 언니와 **같은 얼굴 · 같은 머리**, 하늘색 버스 근무복 + 흰 장갑, 운전석. `staff/normal` 을 첨부해서 같은 얼굴로 뽑는다. `driver/normal`.
- **할머니** — 6편 `granny/normal` 재사용 (R2 에서 아빠 앞에 서는 분, 사실 다음 역에서 내림).
- **남들** — 개찰구 넘으려는 청년 · 가방으로 자리 맡는 아주머니 · 통화하는 아저씨 · 컵라면 학생 · 백팩 청년 · 떠드는 무리: **모두 얼굴 없는 회색 실루엣** (코드 · 소품 그림). 놀림 대상은 아빠뿐.

## 4. 대본 (58줄, 원본은 `script/script.json` 로 옮긴다)

편집 메모 (샷 계획 때):
- 역 도착 방송은 화면 아래 노선도 띠(코드)에 불이 옮겨 가며 `ding` `ding` + 가짜 역 이름.
- 올림픽 중계: 화면 테두리 중계 틀 · 점수판 9.8 · 관중 함성(효과음 새로 `crowd` 합성 제안).
- 역무원 · 기사님 정색 줄: `cutin/staff-flat` / `cutin/driver-flat` + 안내 방송 차임 `ding`.
- 반전: 퇴근 버스 `full/dad-asleep-combo` 위로 민폐 다섯 개에 번호 딱지가 하나씩 `stamp` → 승객 실루엣 전원 고개 돌림 `focus`.
- 아이 눈높이: `iris` 로 들어가 cut 만, 효과음 없음, `calm`.

### 콜드 오픈 — 개찰구
| 컷 | 대사 (한 / 영) |
|---|---|
| c00 | 나레이션: "월요일 아침 8시, 개찰구." / *Monday, 8 a.m. The ticket gates.* |
|  | 아빠: (개찰구 넘으려는 실루엣을 보며) "어허! 저거 30배야, 30배! 양심 어디 갔어!" / *Whoa! That's a 30x fine! Where's your conscience?!* |
| c00a | 아빠: (모라구에게 속삭임) "모라구, 숙여. 넌 아직 아기야." / *(whispering) Moragu, duck. You're still a baby.* |
|  | 모라구: "아빠, 나 여덟 살이야." / *Dad, I'm eight.* |
| c00b | 역무원: "고객님, 안내 말씀 드립니다. 공짜는 여섯 살 전까지입니다." / *Passenger, an announcement: it's only free until age six.* |
|  | 아빠: "…네." / *…Yes, ma'am.* |
| c00c | 나레이션: "남이 넘으면 범죄, 내 아들은 아직 아기. 내모남불, 하나." / *Others sneak through: a crime. My son: still a baby. Double standard, number one.* |
|  | 아빠: "저는… 모답맨입니다." / *I'm… Modapman.* |

### 타이틀
| 컷 | 대사 (한 / 영) |
|---|---|
| c01 | 나레이션: "내가 하면 모 어때, 남이 하면 불— 쾌! 대중교통 편." / *If I do it, so what. If you do it: rude! The public transit edition.* |
|  | 나레이션: "이번 역은… 내로남불역입니다. 내리실 문은 양심 쪽입니다." / *This stop is… Double Standard Station. Doors open on the conscience side.* |

### ROUND 1 자리
| 컷 | 대사 (한 / 영) |
|---|---|
| c02 | 나레이션: "1라운드. 자리." / *Round one: seats.* |
|  | 아빠: "저 아주머니 봐. 가방으로 자리 맡았어. 자리 사유화야!" / *Look at her. Saving a seat with her bag. That's privatizing a seat!* |
| c02a | 나레이션: (중계 톤) "아, 빈자리! 모 선수, 3미터 도움닫기! 공중 반 바퀴 비틀어… 착석!" / *(sportscaster) An empty seat! Mo takes a 3-meter run-up! Half twist in the air… and he's seated!* |
|  | 아빠: (옆자리에 가방 툭) "여긴 우리 아들 자리. 모 어때~" / *(drops his bag on the next seat) This one's my son's. So what~* |
| c02b | 모라구: "아빠, 나 서 있어도 돼. 저 할아버지 앉으시라고 해." / *Dad, I can stand. Let that grandpa sit.* |
|  | 나레이션: "남의 가방은 자리 사유화, 내 가방은 가족 예약석. 내모남불, 둘." / *Their bag: seat privatization. My bag: a family reservation. Double standard, number two.* |
| c02c | 역무원: "고객님. 가방 하나만 놔도 사람들은 그 자리를 피한답니다. 영역 표시래요." / *Passenger. Just one bag and people avoid that seat. It's called territorial marking.* |
|  | 아빠: "…여기도 계세요?" / *…You're on the train too?* |

### ROUND 2 자는 척
| 컷 | 대사 (한 / 영) |
|---|---|
| c03 | 나레이션: "2라운드. 자는 척." / *Round two: fake sleeping.* |
|  | 아빠: "저 사람 봐, 할머니 타시니까 바로 눈 감네. 연기대상감이야." / *Look, the moment grandma got on, he shut his eyes. Award-winning acting.* |
| c03a | 할머니: (아빠 앞에 섬) "아이고, 다리야…" / *(standing in front of Dad) Oh, my legs…* |
|  | 아빠: (눈 꼭 감고, 속으로) "나는 지금 깊은 잠에 빠졌다… 쿨…" / *(eyes squeezed shut, inner voice) I am in a deep sleep… zzz…* |
| c03b | 나레이션: "다음 역에서 할머니가 내리자—" / *When grandma gets off at the next stop—* |
|  | 아빠: (번쩍) "어? 잘 잤다~ 모 어때~" / *(eyes snap open) Oh? What a nap~ So what~* |
| c03c | 나레이션: "남이 자면 연기대상, 내가 자면 진짜 기절. 내모남불, 셋." / *They sleep: best actor. I sleep: a real blackout. Double standard, number three.* |
|  | 역무원: "고객님. 노약자, 임산부, 아이 동반은 법이 정한 교통약자입니다. 양보하는 자리예요." / *Passenger. Seniors, pregnant women, people with small kids: the law calls them mobility-impaired. That's the seat you give up.* |

### ROUND 3 통화
| 컷 | 대사 (한 / 영) |
|---|---|
| c04 | 나레이션: "3라운드. 통화." / *Round three: phone calls.* |
|  | 아빠: "저 아저씨 통화 소리 좀 봐. 칸 전체가 다 듣네. 소음 공해야." / *Listen to him on the phone. The whole car can hear. Noise pollution.* |
| c04a | 아빠: (전화 받음, 큰 소리) "네! 부장님! 네네! 그 엑셀 파일이요! 네!" / *(answers, loudly) Yes! Sir! Yes, yes! That Excel file! Yes!* |
|  | 나레이션: (작게) "칸 전체가… 엑셀 파일을 기다리고 있다." / *(softly) The entire car… is now waiting for that Excel file.* |
| c04b | 아빠: (끊고) "업무 통화는 어쩔 수 없잖아. 모 어때~" / *(hangs up) Work calls can't be helped. So what~* |
|  | 나레이션: "남의 통화는 소음 공해, 내 통화는 업무. 내모남불, 넷." / *Their call: noise pollution. My call: business. Double standard, number four.* |
| c04c | 역무원: "고객님. 한쪽만 들리는 통화가, 둘이 하는 대화보다 더 신경 쓰인답니다. 반쪽 대화래요." / *Passenger. Hearing one side of a call is more distracting than a whole conversation. It's called a halfalogue.* |
|  | 모라구: "다음 말을 모르니까 귀가 자꾸 가는구나!" / *You can't guess what comes next, so your ears keep listening!* |

### ROUND 4 커피 (버스로 갈아탐)
| 컷 | 대사 (한 / 영) |
|---|---|
| c05 | 나레이션: "4라운드. 갈아탄 버스, 그리고 커피." / *Round four: the transfer bus, and coffee.* |
|  | 아빠: "어제 버스에서 누가 라떼 쏟아서 내 바지 다 젖었잖아. 컵 들고 타는 건 테러야." / *Yesterday someone spilled a latte on the bus and soaked my pants. Boarding with a cup is terrorism.* |
| c05a | 아빠: (빨대 꽂힌 아이스 아메리카노를 들고 탑승) "근데 이건 출근 필수품이지. 모 어때~" / *(boards holding an iced Americano with a straw) But this is a work essential. So what~* |
|  | 기사님: "고객님, 그 컵은 못 타십니다." / *Passenger, that cup can't ride.* |
| c05b | 아빠: (기사님 얼굴을 보고) "…여기도 계세요?!" / *(sees her face) …You're here TOO?!* |
|  | 기사님: "동생입니다." / *I'm her younger sister.* |
| c05c | 나레이션: "남의 컵은 테러, 내 컵은 필수품. 내모남불, 다섯." / *Their cup: terrorism. My cup: an essential. Double standard, number five.* |
|  | 기사님: "서울 시내버스는 음식물이 든 일회용 컵 승차를 거절할 수 있습니다. 뚜껑 닫힌 텀블러는 됩니다." / *Seoul city buses can refuse disposable cups with drinks in them. A sealed tumbler is fine.* |
| c05d | 아빠: (정류장에서 커피를 원샷) "…머리가 띵해." / *(chugs the coffee at the stop) …Brain freeze.* |

### 속사포
| 컷 | 대사 (한 / 영) |
|---|---|
| c06 | 나레이션: "보너스 라운드. 속사포 내모남불!" / *Bonus round. Rapid-fire double standards!* |
|  | 아빠: "남의 백팩은 흉기, 내 백팩은 등산 감성!" / *Their backpack: a weapon. Mine: hiking vibes!* |
| c06a | 아빠: "남이 떠들면 시장통, 내 동창들은 추억 소환!" / *They're loud: a fish market. My old classmates: reliving memories!* |
|  | 아빠: "남이 영상 소리 틀면 민폐, 나는 이어폰이 방전돼서!" / *They play videos out loud: rude. Me: my earbuds died!* |
|  | 나레이션: "내모남불, 여섯, 일곱, 여덟!" / *Double standard: six, seven, eight!* |

### 아이 눈높이
| 컷 | 대사 (한 / 영) |
|---|---|
| c07 | 모라구: "아빠, 아까 그 할머니 다리 아프셨대." / *Dad, that grandma said her legs hurt.* |
|  | 아빠: "…응." / *…Yeah.* |
|  | 모라구: "지하철은 다 같이 타는 거실이야. 아빠도 할아버지 되면 앉고 싶을걸?" / *The subway is a living room we all share. You'll want a seat too when you're a grandpa.* |
|  | 아빠: "…그래. 내일부턴 아빠가 서서 간다." / *…Okay. Starting tomorrow, I'll stand.* |

### 반전 — 퇴근 버스
| 컷 | 대사 (한 / 영) |
|---|---|
| c08 | 나레이션: "그날 저녁, 퇴근 버스." / *That evening, the bus home.* |
|  | 나레이션: "지친 모 선수, 착석 3초 만에 기절." / *An exhausted Mo, out cold three seconds after sitting down.* |
| c08a | 나레이션: "쩍벌 하나. 백팩 둘. 커피 셋. 영상 소리 넷. 코골이 다섯." / *Manspreading, one. Backpack, two. Coffee, three. Video sound, four. Snoring, five.* |
|  | 기사님: "고객님, 안내 말씀 드립니다. 오늘의 민폐 종합 세트입니다." / *Passenger, an announcement: today's all-in-one nuisance combo.* |
| c08b | 엄마: (아빠 휴대폰 스피커에서 크게) "여보! 어디야! 저녁 다 식었어!" / *(blaring from Dad's phone speaker) Honey! Where are you?! Dinner's cold!* |
|  | 아빠: (번쩍 깨서) "…피곤해서 그래. 모 어때." / *(jolts awake) …I'm just tired. So what.* |
| c08c | 나레이션: "남이 하면 민폐, 내가 하면 피곤해서. 내모남불, 아홉, 열." / *Others do it: a nuisance. I do it: I'm tired. Double standard, nine and ten.* |
|  | 나레이션: "이번 역은 종점, 양심역입니다. 그냥 오답." / *This stop is the last stop: Conscience Station. Just a wrong answer.* |
| c08d | 아빠: "…역시, 모답맨." / *…Classic Modapman.* |

## 5. 그림 목록 (`script/art.json`, 약 24장)

- **새 인물 기준 그림 먼저 (2):** `staff/normal` (역무원 언니) → `driver/normal` (버스 기사님, `staff/normal` 첨부해서 같은 얼굴)
- **새 인물 포즈 · 컷인 (4):** `staff/radio` (무전기 들고 정색) · `cutin/staff-flat` (안내 방송 정색 클로즈업) · `driver/wheel` (운전석에서 흰 장갑 손바닥 "정지") · `cutin/driver-flat`
- **배경 (4):** `bg/gate` (개찰구, 글자 없는 노선도) · `bg/subway-car` (지하철 칸 안, 좌석 줄 · 손잡이) · `bg/bus-stop` (버스 정류장 아침) · `bg/bus-night` (퇴근 버스 안, 밤 창밖 불빛)
- **장면 (8):** `full/seat-dive` (빈자리로 공중 다이빙하는 아빠 — 올림픽 중계 느낌) · `full/bag-seat` (아빠 옆자리에 아빠 가방, 모라구는 서서 손잡이) · `full/fake-sleep` (눈 꼭 감은 아빠 + 앞에 선 할머니 + 실눈 한쪽) · `full/wake-up` (할머니 내리자 번쩍 눈뜬 아빠, 반짝이) · `full/loud-call` (큰 소리로 통화하는 아빠 + 고개 돌린 실루엣 승객 전원) · `full/coffee-stop` (아이스 커피 들고 버스 계단에 발 올린 아빠 + 흰 장갑 손바닥) · `full/coffee-chug` (정류장에서 커피 원샷, 머리 띵) · `full/dad-asleep-combo` (반전: 쩍벌 · 백팩 · 커피 · 휴대폰 영상 · 코골이 아빠, 주변 실루엣이 쳐다봄)
- **소품 (5):** `prop/bag` (아빠 서류 가방) · `prop/iced-coffee` (빨대 꽂힌 컵) · `prop/tumbler` (뚜껑 닫힌 텀블러) · `prop/backpack-big` (등산 백팩) · `prop/phone-speaker` (소리 나는 휴대폰)
- **재사용:** 가족 공통 포즈 · 컷인 · 아빠 시그니처 `dad-sig-1~3` · 엄마 `mom/normal` · 6편 `granny/normal`
- **코드로 그리는 것:** 타이틀 도장("쾌!") · ROUND · BONUS 카드 · 역 도착 방송 노선도 띠(가짜 역 이름) · 올림픽 중계 틀 · 점수판 9.8 · 정답 카드 3 (30배 · 교통약자 · 버스 컵) · 심리학 카드 2 (영역 표시 · 반쪽 대화) · 민폐 번호 딱지 1~5 · 실루엣 승객들 · 끝 화면 (역무원 · 기사님 나란히 경례)
- 그림 규칙: 근무복 · 버스 · 지하철에 로고 · 글자 · 노선 번호 없음. 남 승객은 얼굴 없는 회색 실루엣. 쌍둥이 둘은 뽑은 뒤 나란히 놓고 얼굴이 같은지 비교.

## 6. 음악 · 효과음

- 새 곡 제안 **`commute`** — 지하철 도착 멜로디 느낌의 경쾌한 8비트 셔플 (지하철 실제 안내음 · 실제 노래는 쓰지 않고 새로 짓는다). 아니면 1~7편과 같은 곡 계열 중 아직 안 쓴 것.
- 새 효과음(sfx.mjs 합성) 후보: `crowd`(올림픽 관중 함성) · `chime`(안내 방송 차임 두 음) · `doors`(지하철 문 닫힘 푸슉) · `snore`(코골이).

## 7. 제목 · 썸네일 (조사 전 후보)

- 제목 틀 (시리즈 규칙, "내로남불" 앞쪽): `지하철 민폐 내로남불 | 남이 하면 빌런, 내가 하면 피곤해서? 자리 · 자는 척 · 통화 · 커피 | 내모남불`
- 영어: `Subway & Bus Double Standards | Their Manners vs. Mine | Naemonambul`
- 쇼츠 후보: ① 올림픽 착석 + 가방 자리 (c02 ~ c02b) ② 자는 척 기적 (c03 ~ c03c) ③ 버스 커피 + 쌍둥이 "동생입니다" (c05 ~ c05c)
- 세로 썸네일: 공중 다이빙하는 아빠 + "9.8" 점수판 + 큰 글자 "내가 하면 / 모 어때?!"
- 끝 화면 댓글 질문: "대중교통에서 본 최악의 민폐는?" + 구독 한 줄 "다음 역: 내모남불 ⑨"

## 8. 다음 단계

- [x] 기획 · 대본 초안 (2026-11-02)
- [x] 사용자 확인 (2026-11-02 "좋아 크롬으로 그림 음성 만들어서 진행해줘")
- [ ] 카드 원문 확인 (업로드 전): 철도사업법 부가운임 조 번호 · 어린이 요금 나이 · 버스 조례 현행 · Sommer · Becker 1969
- [x] script.json(61줄 — 긴 줄을 나눠 58→61) · art.json(24장, 할머니는 6편 복사) (2026-11-02)
- [x] 그림 23장 크롬 Gemini — u/0 Pro 15장 뒤 한도(Flash-Lite 로 바뀜) → u/1 Pro 로 8장. 쌍둥이는 staff/normal 을 첨부해 같은 얼굴 확인. fake-sleep · wake-up 의 다른 승객은 실루엣 대신 얼굴 있는 엑스트라로 나옴(놀림 대상 아님, 그대로 씀). tumbler 소품 밑에 앵커 흔적 핀 자국
- [x] 음성 61줄 AI Studio — u/1 flash-tts 17줄에서 한도 → u/0 flash-tts 로 44줄 (역무원 · 기사님 같은 Laomedeia) → trim · timing(4.4분) · 1.25배속
- [x] bgm `commute`(132bpm 8비트 셔플, 14.5초 루프) · 효과음 chime · crowd · doors · snore
- [x] motion.json(62박자, 3:40) · motion-short.json(쇼츠 3: 자리 · 자는 척 · 커피) · 썸네일 가로/세로 · 자막 · yt-seo · upload.md
- [x] 본편 렌더(3:41, --concurrency=2) → 2026-11-02 **공개** https://youtu.be/noARCrPcjx8 · 쇼츠 3 공개(자리 d-E9dQMH-Lg · 자는 척 bWoow6cdH6o · 커피 xjSDGy4La3A) · 인스타 릴스 DfOIj29N9EK · Threads DfOIz2hgPv-
