# 모답맨 9화 — 누리호는 지금 뭐 해요? 로켓 · 위성 · 우주선

> 상태(2026-10-24): 기획 · 대본 · 그림 목록 · 그림 프롬프트 · TTS 프롬프트 완료. 그림 · 음성은 아직 안 뽑음.
> 대본 원본은 `video/src/ep09/script.json`, 그림 목록은 `video/src/ep09/art.json`, 프롬프트는 같은 폴더의 `GEMINI_PROMPTS.md`.

## 1. 왜 이 주제인가 — YouTube API 조사 (2026-10-24)

| 검색어 | 상위 25개 조회수 중앙값 | 최근 60일 영상 | 메모 |
|---|---|---|---|
| 누리호 로켓 위성 차이 | **106,920** | **17개** | 이번 후보 중 가장 높음. 지금 관심이 몰려 있다 |
| 인공위성 원리 | 44,940 | 1개 | "인공위성이 떨어지지 않는 이유" 쇼츠 104만 회 |
| 태풍 허리케인 사이클론 차이 | 13,866 | 1개 | (다른 후보) |
| 특란 대란 차이 | 9,212 | 2개 | (다른 후보) |

- 한국 인기 영상(뉴스 카테고리)에 "누리호 타고 간 한국 위성 첫 촬영" 류가 올라 있다. "따끈따끈한 촬영본 왔어요" 98만 회.
- 아이가 뉴스를 보고 바로 물을 만한 질문 — "누리호가 사진 찍은 거예요?" — 에서 어른도 로켓과 위성을 헷갈린다.

## 2. 자료조사

| 사실 | 대본에서 | 확인 |
|---|---|---|
| 누리호(KSLV-II)는 위성을 궤도에 올리는 3단 **발사체**다. 길이 약 47m, 무게 약 200t | 1라운드 "택배 트럭" | 여러 보도 일치 |
| 1단 · 2단은 연료를 다 쓰면 분리돼 바다로 떨어진다 (1단 약 2분 뒤, 2단 약 4분 20초 뒤) | "1단, 2단은 바다로" | 3차 · 1차 발사 보도 |
| 5차 발사 2026-10-07 낮 12시 25분. 주탑재 초소형군집위성(네온샛) 2~6호 5기, 고도 약 576km에서 분리 | "이번엔 작은 위성 다섯 대" | 우주항공청 · KAIST 발표 보도 |
| 발사 14시간 29분 뒤 첫 지상 관측 영상 전송. 4호는 미국 클리블랜드, 6호는 미국 몽고메리 촬영, 1m급 | "하루도 안 돼서 첫 사진" · 반전 "첫 사진은 미국" | 세계일보 · 뉴스1 · 파이낸셜뉴스 |
| 저궤도 위성은 초속 약 7.5km로 돌며, 지구 한 바퀴에 약 90~100분 | "1초에 7킬로미터 넘게" · "한 시간 반쯤" | 궤도역학 기본값(고도 576km ≈ 7.6km/s, 96분) |
| 위성은 '떠 있는' 게 아니라 계속 지구 쪽으로 떨어지면서, 옆으로 빨라 땅이 휘는 만큼 비켜 간다 (뉴턴의 대포) | 2라운드 | 교과 기본 |
| 행성 둘레를 도는 천체는 위성. 달은 지구의 자연 위성, 사람이 만든 건 인공위성 | 3라운드 | 교과 기본 |
| 사람이 타는 건 유인 우주선. 누리호는 화물(위성)만 싣는다 | "좌석이 없어요" | 누리호 설계 목적 |
| 위성이 한 바퀴 도는 동안 지구도 자전해서 같은 자리 위로 다시 지나가지 않는다 | 반전 | 궤도역학 기본 |

출처: [세계일보](https://www.segye.com/newsView/20261015519540) · [파이낸셜뉴스](https://www.fnnews.com/news/202610151005482652) · [뉴스1](https://www.news1.kr/it-science/general-science/6320737) · [헤럴드경제](https://biz.heraldcorp.com/article/10903217) · [YTN 5차 발사](https://www.ytn.co.kr/_ln/0105_202610071311020968) · [경향신문 4차](https://www.khan.co.kr/article/202511270407001)

## 3. 오답 퍼레이드 (카운터 4)

| # | 누가 | 오답 | 정답 | 누가 깨나 |
|---|---|---|---|---|
| 1 | 아빠 | 누리호가 지금 우주에서 사진 찍고 브이 한다 (상상 장면: 셀카 찍는 누리호) | 누리호는 택배 트럭(발사체). 사진은 실려 간 위성이 찍는다 | 해설사 |
| 2 | 엄마 | 위성은 무중력이라 둥둥 떠 있다 | 계속 떨어지는 중. 옆으로 빨라서 빗나갈 뿐 | 해설사 → 엄마 시그니처 |
| 3 | 아빠 | 우주선은 큰 위성. 다음 휴가는 누리호 타고 우주 (상상 장면: 로켓 밖에 매달린 가족) | 누리호엔 사람 자리가 없다. 사람이 타면 우주선 | 해설사 |
| 4 | 아빠 (반전) | 한 시간 반 뒤 위성이 우리 머리 위로 다시 온다 → 주차장에서 1시간 반 브이 | 그동안 지구도 돌아서 딴 데로 지나간다. 첫 사진도 미국이었다 | 해설사 · 아이 |

## 4. 무대 · 인물

- **장소:** 우주과학관 전시홀 → 해 질 녘 과학관 앞 주차장 (집 밖).
- **정답 인물 — 우주과학관 해설사:** 30대 초반 남자, 각진 검은 뿔테, 남색 스태프 조끼, 지시봉. 정색하고 한 줄로 끊다가 로켓 얘기만 나오면 혼자 신나는 로켓 덕후. 목소리 Rasalgethi (정보 전달형, 또렷함).
- **가족:** 아빠 Algenib · 아이 Leda · 엄마 Kore · 나레이션 Algenib (정색 진행자).

## 5. 모답맨 시그니처 포즈 (공통 그림 — 9화부터 매 편 재사용)

`video/src/art-common.json` 에 넣었고, 그림은 `content/_common/art/cutin/` 에 저장된다. 프롬프트는 `content/_common/prompts/GEMINI_PROMPTS.md`.

| id | 누구 | 포즈 | 언제 쓰나 (9화) |
|---|---|---|---|
| `common/cutin/dad-sig` | 아빠 | 양손 엄지 · 검지를 맞대 네모를 만들어 입에 대고, 눈이 튀어나오게 놀람 | 틀린 걸 깨달은 "…네?" (c00b), "창가 자리도…?" (c06b) |
| `common/cutin/mom-sig-1` ~ `-4` | 엄마 | 곧게 편 오른손 검지로 입 둘레에 **네모** — 왼쪽 세로 → 오른쪽 세로 → 위 가로 → 아래 가로 (네 장 = 같은 그림에서 손가락만 이동. 2026-10-25 정정: 콕 찌르기 아님) | "어? 어? 어? 어…" 한 음절에 한 장씩 (c01b) |
| `common/cutin/mom-sig-scream` | 엄마 | 마지막에 양손으로 볼을 꾹 누르며 "아악!" | "…아악!" + 번쩍 · 크래시 줌 (c01b) |
| `common/cutin/kid-sig` | 아이 | 양손을 거꾸로 뒤집어 엄지 · 검지 고리를 눈에 댄 가면, 입을 크게 벌리고 "아악!" | "달이 위성이었어요?!" (c06), "트럭이 떨어져요?!" (c04) |

- 엄마 ②~④는 `talk` 종류(두 번째 프레임)라서 ①을 ②로 첨부해 손가락 자리만 바꿔 그린다. 다섯 장의 크기 · 자리가 같아야 넘길 때 손가락만 움직여 보인다.
- 시그니처는 한 편에 인물마다 한 번이 기본. 많이 쓰면 힘이 빠진다.

## 6. 대본 (55줄 · 공백 뺀 946자 · 1.2배속 기준 약 2분 50초 예상)

| 줄 | 박자 | 누구 | 대사 | 영어 자막 |
|---|---|---|---|---|
| c00-0 | 콜드 오픈 | kid | 아빠, 누리호는 지금 뭐 해요? | Dad, what's Nuri doing right now? |
| c00-1 | 콜드 오픈 | dad | 우주에서 사진 찍고 있지! 브이도 하고! | Taking pictures in space! Throwing up a peace sign, too! |
| c00b-0 | 콜드 오픈 | guide | 아버님, 누리호는 사진기가 아니에요. 택배 트럭이에요. | Sir, Nuri isn't a camera. It's a delivery truck. |
| c00b-1 | 콜드 오픈 | dad | …네? | …Huh? |
| c00c-0 | 콜드 오픈 | narr | 오답, 하나. 저는 모답맨입니다. | Wrong answer number one. I'm Modapman. |
| c01-0 | 사건 개요 | narr | 사건 개요. 누리호 발사 뉴스가 나온 주말. 장소, 우주과학관. | Case summary. The weekend after the Nuri launch news. Location: a space science museum. |
| c01a-0 | 사건 개요 | mom | 위성은 무중력이라 우주에 둥둥 떠 있는 거잖아요. | Satellites just float up there, right? Zero gravity. |
| c01a-1 | 사건 개요 | guide | 둥둥 안 떠요. 지금도 떨어지는 중이에요. | They don't float. They're falling. Right now. |
| c01b-0 | 사건 개요 | mom | 어? 어? 어? 어… 아악! | Wha? Wha? Wha? Wha… AAAH! |
| c01b-1 | 사건 개요 | narr | 오답, 둘. 엄마도 결국, 모 씨 집안 사람. | Wrong answer, two. Mom married into the Mo family after all. |
| c02-0 | 오답 퍼레이드 | kid | 그럼 우주선은요? 위성이랑 뭐가 달라요? | Then what about spaceships? How are they different from satellites? |
| c02-1 | 오답 퍼레이드 | dad | 우주선은 큰 위성! 다음 휴가는 누리호 타고 우주 간다! | A spaceship's just a big satellite! Next vacation, we ride Nuri to space! |
| c02b-0 | 오답 퍼레이드 | guide | 누리호엔 사람 자리가 없어요. | Nuri doesn't have seats for people. |
| c02b-1 | 오답 퍼레이드 | narr | 오답, 셋. 모 씨 일가, 우주 진출 실패. | Wrong answer, three. The Mo family's space program: cancelled. |
| c03-0 | 1라운드 · 로켓은 택배 트럭 | guide | 그럼, 딱 세 판만 하죠. | Okay. Just three rounds. |
| c03-1 | 1라운드 · 로켓은 택배 트럭 | dad | 과학관에도 판이…? | The museum has rounds too…? |
| c04-0 | 1라운드 · 로켓은 택배 트럭 | guide | 1라운드. 누리호는 로켓, 정확히는 발사체예요. | Round one. Nuri is a rocket. A launch vehicle, to be exact. |
| c04-1 | 1라운드 · 로켓은 택배 트럭 | guide | 위성을 우주까지 실어다 주는 택배 트럭이죠. | A delivery truck that carries satellites up to space. |
| c04-2 | 1라운드 · 로켓은 택배 트럭 | guide | 연료 다 쓴 칸은 떼어 버려요. 1단, 2단은 바다로. | Each section drops off when its fuel runs out. Stages one and two fall into the sea. |
| c04-3 | 1라운드 · 로켓은 택배 트럭 | kid | 트럭이 떨어져요?! | The truck falls off?! |
| c04b-0 | 1라운드 · 로켓은 택배 트럭 | dad | 그럼 사진은 누가 찍어요? | Then who's taking the pictures? |
| c04b-1 | 1라운드 · 로켓은 택배 트럭 | guide | 실려 간 위성이요. 이번엔 작은 위성 다섯 대. | The satellites it carried. This time, five little ones. |
| c04b-2 | 1라운드 · 로켓은 택배 트럭 | guide | 발사하고 하루도 안 돼서 첫 사진을 보냈어요. | They sent back their first pictures in less than a day. |
| c04c-0 | 1라운드 · 로켓은 택배 트럭 | dad | 누리호는 트럭. 사진사는 위성. 메모. | Nuri is the truck. The satellite's the photographer. Noted. |
| c04c-1 | 1라운드 · 로켓은 택배 트럭 | narr | 맞게 적었습니다. 처음으로. | Noted correctly. For the first time. |
| c05-0 | 2라운드 · 떨어지는 중 | guide | 2라운드. 위성은 사실, 계속 떨어지고 있어요. | Round two. Satellites are actually falling. All the time. |
| c05-1 | 2라운드 · 떨어지는 중 | guide | 대신 옆으로 엄청 빨라요. 1초에 7킬로미터 넘게. | But they're zooming sideways. Over seven kilometers a second. |
| c05-2 | 2라운드 · 떨어지는 중 | guide | 떨어지는 만큼 땅이 둥글게 휘어 버려서, 바닥에 안 닿고 계속 돌아요. | As they fall, the round Earth curves away beneath them, so they never hit the ground. They just keep circling. |
| c05b-0 | 2라운드 · 떨어지는 중 | mom | 둥둥이 아니라… 계속 떨어지는 중. | Not floating… falling. Nonstop. |
| c05b-1 | 2라운드 · 떨어지는 중 | kid | 엄청 빨리 떨어지면서 계속 빗나가는 거네요! | So it falls super fast and keeps missing! |
| c05c-0 | 2라운드 · 떨어지는 중 | guide | 맞아요. 그래서 지구 한 바퀴에 한 시간 반쯤. | Exactly. That's why one lap around Earth takes about an hour and a half. |
| c05c-1 | 2라운드 · 떨어지는 중 | kid | 학교 끝나기 전에 한 바퀴! | One lap before school's even out! |
| c06-0 | 3라운드 · 사람이 타면 | guide | 3라운드. 행성 둘레를 빙빙 도는 건, 다 위성이에요. | Round three. Anything that circles a planet is a satellite. |
| c06-1 | 3라운드 · 사람이 타면 | kid | 그럼 달도요? | Then the Moon too? |
| c06-2 | 3라운드 · 사람이 타면 | guide | 달도 위성이에요. 사람이 안 만든, 자연 위성. | The Moon's a satellite too. A natural one nobody built. |
| c06-3 | 3라운드 · 사람이 타면 | kid | 달이 위성이었어요?! | The Moon was a satellite this whole time?! |
| c06b-0 | 3라운드 · 사람이 타면 | guide | 사람이 만들어 쏘면 인공위성. 사람이 타고 가면 우주선. | Build one and launch it, it's an artificial satellite. People ride it, it's a spaceship. |
| c06b-1 | 3라운드 · 사람이 타면 | guide | 누리호는 짐만 싣는 로켓이라, 좌석이 없어요. | Nuri only carries cargo, so there are no seats. |
| c06b-2 | 3라운드 · 사람이 타면 | dad | 창가 자리도…? | Not even a window seat…? |
| c06b-3 | 3라운드 · 사람이 타면 | guide | 창문도 없어요. | There aren't even windows. |
| c06c-0 | 3라운드 · 사람이 타면 | narr | 한 줄 정리. 로켓은 실어다 주고, 위성은 돌면서 일하고, 우주선은 사람을 태운다. | In one line: rockets deliver, satellites circle and work, spaceships carry people. |
| c06c-1 | 3라운드 · 사람이 타면 | narr | 누리호는 위성이 아니라, 위성을 올려 준 로켓. | Nuri isn't a satellite. It's the rocket that lifted the satellites up. |
| c07-0 | 아이 눈높이 | dad | 누리호는 위성을 업고, 하늘 끝까지 달려 준 거야. | Nuri carried the satellites on its back and ran all the way to the edge of the sky. |
| c07-1 | 아이 눈높이 | dad | 그리고 한 칸씩 내려놓고, 바다로 돌아갔어. | Then it let go, one piece at a time, and went back down to the sea. |
| c07-2 | 아이 눈높이 | kid | 끝까지 같이 못 가요? | It doesn't get to go all the way? |
| c07-3 | 아이 눈높이 | dad | 응. 대신 위성은 지금도 안 쉬고 돌면서, 우리 땅을 찍어. | Nope. But the satellites are still circling, never resting, taking pictures of our land. |
| c07-4 | 아이 눈높이 | kid | 그럼 누리호는 데려다주는 사람이네요. | So Nuri is the one who drops them off. |
| c07-5 | 아이 눈높이 | dad | 응. 그게 제일 어려운 일이야. | Yep. And that's the hardest job of all. |
| c07b-0 | 아이 눈높이 | narr | 아이는 하늘에 대고, 작게 손을 흔들었습니다. | My kid gave the sky a little wave. |
| c08-0 | 반전 | dad | 한 바퀴 한 시간 반이랬죠? 그럼 이따 우리 머리 위로 온다! | One lap's an hour and a half, right? Then it'll pass right over us soon! |
| c08-1 | 반전 | guide | 그동안 지구도 돌아서, 딴 데로 지나가요. | The Earth turns in the meantime, so it'll pass somewhere else. |
| c08-2 | 반전 | dad | …그래도 브이 하고 기다릴래요. | …I'll wait with a peace sign anyway. |
| c08b-0 | 반전 | kid | 아빠, 위성 첫 사진은 미국이었대요! | Dad, the satellites' first pictures were of America! |
| c08b-1 | 반전 | narr | 아빠는 주차장에서 한 시간 반 동안 브이를 했습니다. | Dad held a peace sign in the parking lot for an hour and a half. |
| c08b-2 | 반전 | narr | 오답, 넷. 역시, 모답맨. | Wrong answer, four. Modapman strikes again. |

숫자는 `tts` 로 한글 읽기를 넣었다 (일 라운드, 일 단 · 이 단, 일 초에 칠 킬로미터 …).

## 7. TTS 프롬프트 (크롬 AI Studio 줄 단위 · 단일 화자)

AI Studio 에서 줄마다 목소리를 고르고 **Style 칸에 아래 문장**, 대사 칸에는 **대사(또는 `tts`)만** 넣는다. 유료 API 로 돌릴 때는 Style 을 넣지 않는다(읽어 버린다) — 대사만.

| 역할 | 목소리 | Style |
|---|---|---|
| 아빠 `dad` | Algenib | A balding Korean dad in his mid-forties: thick, deep, slightly husky ajusshi voice, overconfident and loud when he is wrong, then tiny and stunned when corrected |
| 나레이션 `narr` | Algenib | Deadpan Korean TV quiz-show announcer: flat, slow, perfectly serious, a beat of silence before every number, never laughing |
| 아이 `kid` | Leda | His eight-year-old child: bright, curious, high-pitched, fast when excited |
| 엄마 `mom` | Kore | The kid's mom, a Korean woman in her late thirties: calm, clear, slightly low voice with a quiet knowing smile, dry and gently teasing |
| 해설사 `guide` | Rasalgethi | A Korean space science museum docent man in his early thirties, a polite rocket nerd: clear, crisp, informative, perfectly deadpan when correcting grown-ups, quietly excited about rockets |

**줄별 연기 메모** (Style 끝에 한 문장 덧붙인다)

| 줄 | 덧붙일 문장 |
|---|---|
| c00-1 아빠 "우주에서 사진 찍고 있지!" | Totally sure of himself, loud and proud. |
| c00b-0 해설사 "사진기가 아니에요" | Flat and polite, no emotion at all. |
| c00b-1 아빠 "…네?" | A tiny, stunned, breathy "huh?". |
| c01b-0 엄마 "어? 어? 어? 어… 아악!" | Four short rising, increasingly panicked "uh?" sounds with a short gap between each, then one big comic scream. |
| c02-1 아빠 "다음 휴가는 누리호 타고" | Overexcited, like announcing a family vacation. |
| c04-3 아이 "트럭이 떨어져요?!" | Shocked and thrilled at once. |
| c05-x 해설사 2라운드 | Getting excited, a little faster, like sharing his favorite fact. |
| c06-3 아이 "달이 위성이었어요?!" | Loud, amazed, almost shouting. |
| c06b-2 아빠 "창가 자리도…?" | Small, hopeful, pitiful. |
| c06b-3 해설사 "창문도 없어요." | Dead flat, instant. |
| c07 전체 (아이 눈높이) | Warm, soft and slow, no jokes, like talking at bedtime. |
| c08-2 아빠 "그래도 브이 하고 기다릴래요" | Stubborn and sincere. |
| c08b-1 나레이션 | Deadpan, a long pause before "한 시간 반". |

## 8. 그림 목록 (`art.json` · 새 그림 28장 = 편 21장 + 시그니처 7장)

- 배경 3: 우주과학관 전시홀(주 무대) · 우주에서 본 지구(라운드 카드 뒤) · 해 질 녘 과학관 앞 주차장
- 해설사 5: 기본 · 정색 · 지시봉 설명 · 위성 모형 · 정색 컷인
- 가족 2: 아빠 하늘에 양손 브이 · 아이 하늘에 손 흔들기
- 장면 3: **아빠의 상상** 셀카 찍는 누리호 · **아빠의 상상** 로켓 밖에 매달린 가족 휴가 · 1단 · 2단 낙하
- 소품 8: 누리호 · 택배 트럭 로켓 · 작은 위성 다섯 대 · 첫 사진(가상 도시 항공 사진) · 지구 궤도 도는 위성 · 놀란 달 · 사람 탄 우주선 · 누리호 속(좌석 없음)
- 실제 로고 · 국기 · 기관 표시는 그리지 않는다. 실제 첫 관측 사진은 쓰지 않고 가상 도시로 그린다.

## 9. 제목 · 썸네일 (업로드 전에 키워드 다시 조회)

- 제목 후보: `누리호는 지금 우주에서 사진 찍을까? 로켓·위성·우주선 차이 3분 정리 | 모답맨`
- 영어: `Is Nuri Taking Photos in Space? Rocket vs Satellite vs Spaceship in 3 Min | Modapman`
- 썸네일: 위 "누리호가" / 아래 "사진 찍는다?" · 작은 줄 "로켓·위성·우주선 3분 정리" · 아빠 시그니처 얼굴 + X + 해설사 정색 + 오답 4
- 태그 후보: 누리호, 누리호 5차 발사, 인공위성, 초소형군집위성, 로켓 위성 차이, 위성이 안 떨어지는 이유, 달 자연위성, 우주선

## 10. 한 문장 정리

**로켓은 실어다 주고, 위성은 돌면서 일하고, 우주선은 사람을 태운다 — 누리호는 위성이 아니라 위성을 올려 준 로켓.**
