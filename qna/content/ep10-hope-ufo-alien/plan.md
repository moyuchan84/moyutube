# 모답맨 10화 — 외계인 진짜 있어요? UFO · 외계 생명체 · 외계인

> 상태(2026-10-25): 기획 · 대본 · 그림 목록 · 그림 프롬프트 · TTS 프롬프트 완료. 그림 · 음성은 아직 안 뽑음.
> 대본 원본은 `video/src/ep10/script.json`, 그림 목록은 `video/src/ep10/art.json`, 프롬프트는 같은 폴더의 `GEMINI_PROMPTS.md`.

## 1. 왜 이 주제인가 — YouTube API 조사 (2026-10-25)

| 검색어 | 상위 25개 조회수 중앙값 | 최근 60일 영상 | 메모 |
|---|---|---|---|
| 외계 생명체 발견 | **1,028,456** | 2개 | 꾸준히 크다. "과학을 보다" 류가 상위 |
| 외계인 존재 | **797,040** | 2개 (중앙값 383,535) | 최근 영상도 잘 나온다 |
| 호프집 뜻 | 702,371 | 0개 | 상위에 "영화 '호프' 실시간 후기" 260만 회 — 영화와 호프집이 섞여 검색된다 |
| 영화 호프 | 576,366 | 0개 | 7월 개봉 뒤 관심은 남았지만 새 영상이 없다 → 빈자리 |
| UFO 정체 | 499,362 | 3개 | UFO 실존 자막뉴스 340만 회 |
| 화성 생명체 | 286,314 | 2개 | 2025-09 NASA "생명 흔적 가능성" 발표 KBS 100만 회 |
| 호프 외계인 | 154,518 | 0개 | 영화와 외계인을 함께 찾는 사람이 있다 |
| 3I/ATLAS | 36,693 | 11개 | 해외 위주. 제목보다 태그로 |

- 「호프」(나홍진 감독, 2026-07-15 개봉, 15세 이상 관람가)는 칸 경쟁 부문 초청 · 올해 최고 오프닝으로 화제가 됐다. 제목 HOPE · 호프집 HOF · 맥주 재료 HOP 이 한글로는 모두 "호프/홉"이라 아이가 헷갈리기 딱 좋다.
- 영화 줄거리 · 크리처의 정체는 말하지 않는다(스포일러 금지). 영화 장면 · 포스터 · 인물도 그리지 않는다. 영화는 **아이가 질문하게 된 계기**로만 쓴다.

## 2. 자료조사

| 사실 | 대본에서 | 확인 |
|---|---|---|
| 한국의 '호프집' 호프는 맥주 원료 홉(hop, 독일어 Hopfen)이 아니라 독일어 **Hof**(마당 · 궁정)에서 왔다. 뮌헨의 옛 궁정 양조장 맥주집 '호프브로이하우스' 이름에서 왔다는 설명이 일반적이고, OB가 맥주집에 'OB Hof'라는 이름을 붙인 것이 퍼졌다는 설명도 있다 | 콜드 오픈 · 반전 | 여러 매체 일치(첫 사용처는 자료마다 조금 다름 → "궁정 맥주집 이름에서 왔다"까지만 말한다) |
| UFO = Unidentified Flying Object, **정체를 확인하지 못한** 비행 물체. 미국 정부는 요즘 UAP(미확인 이상 현상)라고 부른다 | 1라운드 | 용어 정의 |
| 미 국방부 AARO 보고서(2024-03): 1945~2023년 정부 조사를 검토했지만 외계 기술 · 외계 존재의 **검증 가능한 증거는 없었다**. 목격 대부분은 풍선 · 드론 · 항공기 · 위성 · 행성 등의 오인 | "팔십 년 치 신고를 살펴봤는데 외계인 증거는 없었대요" | NPR · Smithsonian · Fox 보도 일치 |
| 3I/ATLAS(2025-07 발견): 태양계 밖에서 온 세 번째 천체. 하버드 아비 로브가 "외계 기술일 수도"라고 주장해 화제였지만, 천문학계 · NASA는 **성간 혜성**으로 본다(로브도 "자연 혜성일 가능성이 가장 크다"고 인정) | 오답 3 "작년에 외계인 우주선이 왔다던데" | 여러 보도 |
| NASA 퍼서비어런스: 화성 '체야바 폭포' 돌의 표범 무늬 반점 — 2025-09 NASA가 "잠재적 생명 흔적(potential biosignature)"이라 발표, Nature 논문. **생물이 아닌 화학 반응일 가능성도 남아 있고 확정 아님** | 2라운드 "그럴 수도 있다, 까지예요" | NASA/JPL 발표 |
| 외계 생명체(지구 밖 생명 전체, 미생물 포함) ≠ 외계인(지적 생명체). 과학자는 미생물 흔적 · 행성 대기 성분부터 찾는다 (예: K2-18b 대기 신호 2025 — 3시그마, 확정 아님 → 대본에서는 빼고 설명용으로만) | 2라운드 정의 | 용어 · 보도 |
| 전파로 외계 지적 생명 신호를 찾는 SETI는 1960년(오즈마 계획)부터. 아직 **확인된 신호는 없다** | "육십 년 넘게 들었는데, 확실한 신호는 한 번도" | 일반 사실 |
| 가장 가까운 별(프록시마 센타우리)은 약 4.2광년. 보이저 1호 속도(초속 약 17km)로 약 7만 5천 년 | "지금 우주선으론 칠만 년 넘게" | 계산값 |
| 밤하늘에서 빨갛게 깜빡이는 불은 대개 비행기 항법등 · 충돌방지등 | 반전 | 일반 사실 |

출처: [주간경향 — 호프](https://weekly.khan.co.kr/article/202607101423001) · [보그 — 호프](https://www.vogue.co.kr/2026/07/16/%EB%82%98%ED%99%8D%EC%A7%84%EC%9D%98-%ED%98%B8%ED%94%84-%EC%95%8C%EA%B3%A0-%EB%B3%B4%EB%A9%B4-%ED%9D%A5%EB%AF%B8%EB%A1%9C%EC%9A%B4-%EC%9D%B4%EC%95%BC%EA%B8%B0/) · [GQ — 호프집](https://www.gqkorea.co.kr/2015/11/06/%ed%98%b8%ed%94%84%ec%a7%91-%eb%a0%88%ec%8a%a4%ed%86%a0%eb%9e%91-%ec%85%b0%ed%94%84-%ec%9d%8c%ec%8b%9d%ec%97%90-%eb%8c%80%ed%95%9c-%ea%b8%b0%eb%b3%b8-%ec%83%81%ec%8b%9d%eb%93%a4/) · [매일신문 — 호프](https://www.imaeil.com/page/view/2008061914093139807) · [NPR — AARO 보고서](https://www.mprnews.org/story/2024/03/08/npr-pentagon-ufo-report-no-evidence-alien-technology) · [Smithsonian](https://www.smithsonianmag.com/smart-news/us-has-no-evidence-of-alien-technology-new-pentagon-report-finds-180983938/) · [NASA/JPL — 화성 생명 흔적 가능성](https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/) · [3I/ATLAS — 로브 입장](https://www.yahoo.com/news/articles/jury-still-3i-atlas-even-024902235.html) · [K2-18b — UCR](https://cnas.ucr.edu/media/2025/04/17/scientists-discover-signs-possible-alien-life)

## 3. 오답 퍼레이드 (카운터 4)

| # | 누가 | 오답 | 정답 | 누가 깨나 |
|---|---|---|---|---|
| 1 | 아빠 | 호프집 호프는 맥주에 넣는 홉(hop) | 독일어 Hof(궁정). 궁정 맥주집 이름에서 왔다 | 엄마 → 아빠 시그니처 |
| 2 | 엄마 | 뉴스에 나오는 UFO = 외계인 우주선 | UFO는 "정체를 모르는" 비행 물체. 외계인이라는 뜻이 없다 | 연구원 → **엄마 시그니처(검지 네모 → 양 볼 악!)** |
| 3 | 아빠 | 작년에 외계인 우주선이 태양계에 왔다 (상상 장면: 관광버스 같은 비행접시) | 다른 별에서 온 혜성(얼음 덩어리) | 연구원 |
| 4 | 아빠 (반전) | 빨갛게 깜빡이는 불 = 외계인 신호 → "홉 집에서 한 잔" | 비행기. 그리고 호프는 궁정 | 연구원 · 아이 |

- 오답 1은 정답 담당이 엄마다(집 안, 밤). 엄마는 하루 만에 오답 2로 떨어진다 — "어제 정답 맞힌 엄마, 하루 만에 탈락."
- 반전에서 아이가 콜드 오픈의 정답(궁정)을 아빠에게 돌려준다.

## 4. 무대 · 인물

- **콜드 오픈:** 밤 거실, 엄마 · 아빠가 소파에서 「호프」를 보는 중. 15세 영화라서 엄마가 아이 눈을 가린다. TV 화면 · 영화 장면은 보여 주지 않는다.
- **본편:** 다음 날 시민 천문대 전시실 → 밤 천문대 옥상(아이 눈높이 · 반전). 집 밖, 제삼의 인물.
- **정답 인물 — 천문대 연구원:** 40대 초반 여자, 연필 꽂은 낮은 올림머리, 안경 없음(엄마와 구별), 남색 플리스 + 회색 터틀넥, 가슴에 빨간 손전등. 정색 한 줄 태클("금성이에요." "비행기예요."), 하늘 얘기만 나오면 조용히 눈이 반짝인다. 목소리 Autonoe.
- **가족:** 아빠 Algenib · 아이 Leda · 엄마 Kore · 나레이션 Algenib (정색 진행자).

## 5. 시그니처 포즈 (이번 편)

| 언제 | 누구 | 그림 |
|---|---|---|
| c00b "…네?" (홉 아니야) | 아빠 | `dad-sig-1 → 2 → 3` 네모 입막음 |
| c01b "어? 어? 어? 어… 악!" | 엄마 | `mom-sig-1 → 2 → 3 → 4 → scream` — **곧게 편 검지로 입 둘레에 네모(왼 세로 → 오른 세로 → 위 가로 → 아래 가로)**, 마지막에 케빈처럼 양 볼 누르고 악! |
| c05b "화성에 세균이 살았어요?!" | 아이 | `kid-sig` |

- 엄마 시그니처는 2026-10-25 사용자 정정으로 다시 그린다 (9화 그림은 "입술 콕 찌르기"로 잘못 그려졌고 기준 그림 없이 뽑혀 얼굴도 달랐다). 프롬프트는 `content/_common/prompts/GEMINI_PROMPTS.md`.

## 6. 대본 (50줄 · 공백 뺀 964자 · 1.2배속 기준 약 2분 50초 예상)

| 줄 | 박자 | 누구 | 대사 | 영어 자막 |
|---|---|---|---|---|
| c00-0 | 콜드 오픈 | kid | 아빠, 호프는 아빠가 술 먹는 데 아니에요? | Dad, isn't Hope the place where you go drinking? |
| c00-1 | 콜드 오픈 | mom | 너 아직 안 잤어? 이거 열다섯 살 영화야. | You're still up? This movie is fifteen and over. |
| c00a-0 | 콜드 오픈 | dad | 아들, 이 호프는 희망! 술집 호프는 맥주에 넣는 홉! 그래서 호프집! | Son, this Hope means hope! The pub kind is hops, the stuff in beer! That's why it's a hof! |
| c00b-0 | 콜드 오픈 | mom | 홉 아니야. 독일어 호프, 궁정이라는 뜻. 궁정 맥주집 이름에서 왔어. | Not hops. German Hof: the royal court. It came from a court beer hall. |
| c00b-1 | 콜드 오픈 | dad | …네? | …Huh? |
| c00c-0 | 콜드 오픈 | narr | 오답, 하나. 저는 모답맨입니다. | Wrong answer number one. I'm Modapman. |
| c01-0 | 사건 개요 | narr | 사건 개요. 영화 소리에 잠 못 든 아이가, 다음 날 물었다. 장소, 시민 천문대. | Case summary. The movie kept the kid up. Next day, the question. Location: an observatory. |
| c01-1 | 사건 개요 | kid | 외계인, 진짜 있어요? | Are aliens real? |
| c01a-0 | 사건 개요 | mom | 있지. 뉴스에 나오는 UFO가 외계인 우주선이잖아. | Of course. Those UFOs on the news are alien spaceships. |
| c01a-1 | 사건 개요 | astro | UFO는 정체를 모르는 비행 물체라는 뜻이에요. 외계인이라는 뜻은 없어요. | UFO just means a flying object nobody's identified yet. It doesn't mean aliens. |
| c01b-0 | 사건 개요 | mom | 어? 어? 어? 어… 악! | Wha? Wha? Wha? Wha… AAAH! |
| c01b-1 | 사건 개요 | narr | 오답, 둘. 어제 정답 맞힌 엄마, 하루 만에 탈락. | Wrong answer, two. Yesterday's winner, knocked out in one day. |
| c02-0 | 오답 퍼레이드 | dad | 작년에 외계인 우주선이 태양계에 왔다던데! 손 흔들어 줘야지! | I heard an alien spaceship flew into our solar system last year! Gotta wave hello! |
| c02-1 | 오답 퍼레이드 | astro | 혜성이었어요. 다른 별에서 날아온 얼음 덩어리. | It was a comet. A lump of ice from another star. |
| c02b-0 | 오답 퍼레이드 | dad | 얼음… 덩어리. | A lump… of ice. |
| c02b-1 | 오답 퍼레이드 | narr | 오답, 셋. 아빠는 얼음에게 손을 흔들었습니다. | Wrong answer, three. Dad waved hello to an ice cube. |
| c03-0 | 1라운드 · UFO는 모르는 것 | astro | 그럼, 딱 세 판만 하죠. | Okay. Just three rounds. |
| c03-1 | 1라운드 · UFO는 모르는 것 | dad | 천문대도… 판이에요? | The observatory does rounds too…? |
| c04-0 | 1라운드 · UFO는 모르는 것 | astro | 1라운드. UFO는 아직 뭔지 모르는 것. 그게 다예요. | Round one. A UFO is something we haven't figured out yet. That's all. |
| c04-1 | 1라운드 · UFO는 모르는 것 | astro | 알고 보면 대부분 풍선, 드론, 비행기, 반짝이는 금성이에요. | Most turn out to be balloons, drones, planes, or a really bright Venus. |
| c04-2 | 1라운드 · UFO는 모르는 것 | astro | 미국 국방부가 팔십 년 치 신고를 살펴봤는데, 외계인 증거는 없었대요. | The US Defense Department went through eighty years of reports. No evidence of aliens. |
| c04b-0 | 1라운드 · UFO는 모르는 것 | kid | 모르면 UFO, 알면 그냥 풍선! | Don't know? UFO. Figure it out? Just a balloon! |
| c04b-1 | 1라운드 · UFO는 모르는 것 | mom | 그럼 어제 베란다에서 본 그 반짝이는 거… | Then that shiny thing I saw from the balcony last night… |
| c04b-2 | 1라운드 · UFO는 모르는 것 | astro | 금성이에요. | Venus. |
| c05-0 | 2라운드 · 외계 생명체는 세균도 | astro | 2라운드. 외계 생명체는 지구 밖에 사는 생명 전부예요. 아주 작은 세균까지. | Round two. Alien life means any life beyond Earth. Even tiny microbes. |
| c05-1 | 2라운드 · 외계 생명체는 세균도 | dad | 문어 머리 초록 아저씨가 아니고요? | Not little green guys with octopus heads? |
| c05-2 | 2라운드 · 외계 생명체는 세균도 | astro | 과학자들은 아주 작은 흔적부터 찾아요. | Scientists start by looking for tiny traces. |
| c05b-0 | 2라운드 · 외계 생명체는 세균도 | astro | 작년 화성에서 표범 무늬 돌이 나왔어요. 옛날 세균이 만들었을 수도 있대요. | Last year, a leopard-spotted rock turned up on Mars. Ancient microbes may have made it. |
| c05b-1 | 2라운드 · 외계 생명체는 세균도 | kid | 화성에 세균이 살았어요?! | Microbes lived on Mars?! |
| c05b-2 | 2라운드 · 외계 생명체는 세균도 | astro | 아직은 몰라요. 그럴 수도 있다, 까지예요. 더 확인해야 해요. | We don't know yet. It's only a maybe. It still has to be checked. |
| c06-0 | 3라운드 · 외계인은 말 거는 생명 | astro | 3라운드. 외계인은 그중에서도, 말을 하고 기계를 만드는 생명이에요. | Round three. Aliens are the ones among them that talk and build machines. |
| c06-1 | 3라운드 · 외계인은 말 거는 생명 | astro | 그래서 큰 전파 망원경으로, 우주에서 오는 신호를 들어요. | So we listen for signals from space with giant radio telescopes. |
| c06-2 | 3라운드 · 외계인은 말 거는 생명 | astro | 육십 년 넘게 들었는데, 확실한 신호는 아직 한 번도 없어요. | We've been listening for over sixty years. Not one confirmed signal yet. |
| c06b-0 | 3라운드 · 외계인은 말 거는 생명 | kid | 그럼 외계인이 놀러 오면 되잖아요. | Then the aliens could just come visit. |
| c06b-1 | 3라운드 · 외계인은 말 거는 생명 | astro | 제일 가까운 별도 너무 멀어요. 지금 우주선으론 칠만 년 넘게 걸려요. | Even the nearest star is too far. Today's spacecraft would need over 70,000 years. |
| c06b-2 | 3라운드 · 외계인은 말 거는 생명 | dad | 칠만 년… 휴가로는 좀 길다. | Seventy thousand years… bit long for a vacation. |
| c06c-0 | 3라운드 · 외계인은 말 거는 생명 | narr | 한 줄 정리. UFO는 모르는 것. 외계 생명체는 지구 밖의 모든 생명. | In one line: a UFO is just unknown. Alien life is any life beyond Earth. |
| c06c-1 | 3라운드 · 외계인은 말 거는 생명 | narr | 외계인은 그중에 말이 통할 생명. 그리고 셋 다, 아직 확인된 건 없습니다. | Aliens are the ones we could talk to. And none of it is confirmed. Yet. |
| c07-0 | 아이 눈높이 | kid | 그럼 외계인은 없는 거예요? | So there are no aliens? |
| c07-1 | 아이 눈높이 | dad | 없는 게 아니라, 아직 모르는 거야. | Not no. We just don't know yet. |
| c07-2 | 아이 눈높이 | dad | 우주엔 별이 엄청 많아. 그래서 오늘 밤에도 누군가는 귀를 대고 있어. | There are so many stars out there. So tonight, too, someone's listening. |
| c07-3 | 아이 눈높이 | kid | 그래서 영화 이름이 호프예요? 희망? | Is that why the movie's called Hope? |
| c07-4 | 아이 눈높이 | dad | …그런가 보다. | …Maybe so. |
| c07-5 | 아이 눈높이 | kid | 저도 들어 볼래요. | I want to listen too. |
| c07b-0 | 아이 눈높이 | narr | 아이는 하늘에 귀를 대고, 한참을 서 있었습니다. | My kid stood there for a long time, ear turned to the sky. |
| c08-0 | 반전 | dad | 저기! 빨간 불이 깜빡깜빡! 외계인 신호다! | Look! A red light, blinking! It's an alien signal! |
| c08-1 | 반전 | astro | 비행기예요. | That's a plane. |
| c08-2 | 반전 | dad | …그럼 오늘은 기념으로, 홉 집에서 한 잔. | …Then let's celebrate. One round at the hops place. |
| c08b-0 | 반전 | kid | 아빠, 호프는 궁정이래요! | Dad, Hof means royal court! |
| c08b-1 | 반전 | narr | 오답, 넷. 역시, 모답맨. | Wrong answer, four. Modapman strikes again. |

## 7. TTS 프롬프트 (크롬 AI Studio 줄 단위 · 단일 화자)

AI Studio 에서 줄마다 목소리를 고르고 **Style 칸에 아래 문장**, 대사 칸에는 **대사(또는 `tts`)만** 넣는다. 유료 API 로 돌릴 때는 Style 을 넣지 않는다(읽어 버린다) — 대사만.

| 역할 | 목소리 | Style |
|---|---|---|
| 아빠 `dad` | Algenib | A balding Korean dad in his mid-forties: thick, deep, slightly husky ajusshi voice, overconfident and loud when he is wrong, then tiny and stunned when corrected |
| 나레이션 `narr` | Algenib | Deadpan Korean TV quiz-show announcer: flat, slow, perfectly serious, a beat of silence before every number, never laughing |
| 아이 `kid` | Leda | His eight-year-old child: bright, curious, high-pitched, fast when excited |
| 엄마 `mom` | Kore | The kid's mom, a Korean woman in her late thirties: calm, clear, slightly low voice with a quiet knowing smile, dry and gently teasing |
| 연구원 `astro` | Autonoe | A Korean woman astronomer in her early forties who runs the public programs at a city observatory: low, calm, dry and precise, perfectly deadpan when correcting grown-ups with one short line, but soft and quietly wondrous when talking about the sky |

**줄별 연기 메모** (Style 끝에 한 문장 덧붙인다)

| 줄 | 덧붙일 문장 |
|---|---|
| c00-0 아이 "호프는 아빠가 술 먹는 데" | Innocent and loud, whispering badly in a dark room. |
| c00-1 엄마 "열다섯 살 영화야" | Calm, not looking away from the TV. |
| c00a-0 아빠 "그래서 호프집!" | Totally sure of himself, proud, like a TV quiz champion. |
| c00b-0 엄마 "홉 아니야" | Flat and dry, one breath, no emotion. |
| c00b-1 아빠 "…네?" | A tiny, stunned, breathy "huh?". |
| c01a-0 엄마 "UFO가 외계인 우주선이잖아" | Confident and casual, like stating the obvious. |
| c01b-0 엄마 "어? 어? 어? 어… 악!" | Four short rising, increasingly panicked "uh?" sounds with a short gap between each, then one big comic scream. |
| c02-0 아빠 "손 흔들어 줘야지!" | Overexcited, waving, loud. |
| c02b-0 아빠 "얼음… 덩어리." | Small, deflated, slow. |
| c04b-2 · c08-1 연구원 "금성이에요." "비행기예요." | Dead flat, instant, two words only. |
| c05b-1 아이 "화성에 세균이 살았어요?!" | Loud, amazed, almost shouting. |
| c06 연구원 3라운드 | Softer and slower, quietly wondrous. |
| c06b-2 아빠 "칠만 년… 휴가로는 좀 길다." | Mumbling, serious, as if checking his calendar. |
| c07 전체 (아이 눈높이) | Warm, soft and slow, no jokes, like talking at bedtime under the stars. |
| c08-0 아빠 "외계인 신호다!" | Screaming with joy, pointing. |
| c08b-0 아이 "호프는 궁정이래요!" | Bright and proud, correcting dad. |

숫자는 `tts` 로 한글 읽기를 넣었다 (일 라운드 · 이 라운드 · 삼 라운드, UFO → 유에프오).

## 8. 그림 목록 (`art.json` · 새 그림 23장 + 엄마 시그니처 다시 5장)

- **모든 그림에 첨부 ①(화풍 앵커 `content/_common/art/anchor/style-cutin.png`)을 넣는다.** 인물이 나오는 그림은 ②~④에 그 인물의 기준 그림을 넣는다 (2026-10-24 규칙).
- 배경 4: 밤 거실 TV 불빛(②로 낮 거실 첨부) · 시민 천문대 전시실(주 무대) · 별 가득한 우주(라운드 카드 뒤) · 밤 천문대 옥상
- 연구원 5: 기본(기준) · 정색 · 하늘 가리키기 · 귀에 손 대고 듣기 · 정색 컷인 — ②로 `astro/normal` 첨부
- 장면 3: 소파의 엄마 · 아빠 + 끼어든 아이(②③④ 가족 기준 그림) · **아빠의 상상** 관광버스 비행접시(② 아빠) · **아빠의 상상** 문어 머리 초록 아저씨
- 가족 2: 아빠 하늘 가리키며 "외계인이다!" · 아이 하늘에 귀 대기
- 소품 9: 홉 열매 · 옛 궁정 맥주집 · UFO의 정체들(풍선 · 드론 · 비행기 · 금성) · 성간 혜성 · 화성 표범 무늬 돌 · 세균들 · 전파 망원경 · 달팽이 탄 느린 탐사선 · 깜빡이는 비행기
- 영화 「호프」의 장면 · 포스터 · 크리처 · 배우는 그리지 않는다. 실제 건물(호프브로이하우스) · 기관 로고 · 국기도 그리지 않는다.

## 9. 제목 · 썸네일 (업로드 전에 키워드 다시 조회)

- 제목 후보: `영화 호프 보다가 아이가 물었다 "외계인 진짜 있어요?" UFO·외계 생명체·외계인 차이 3분 정리 | 모답맨`
- 짧은 후보: `외계인 진짜 있어요? UFO·외계 생명체·외계인 차이 3분 정리 (호프집 호프는 홉일까?) | 모답맨`
- 영어: `Are Aliens Real? UFO vs Alien Life vs Aliens in 3 Min (and What 'Hof' Means) | Modapman`
- 썸네일: 위 "UFO = 외계인?" / 아래 "아빠 땡!" · 작은 줄 "외계인 · UFO · 외계 생명체 3분 정리" · 엄마 시그니처(양 볼 악!) + X + 연구원 정색 + 오답 4
- 태그 후보: 영화 호프, 호프 외계인, 외계인 존재, 외계 생명체 발견, UFO 정체, UAP, 화성 생명체, 3I/ATLAS, 호프집 뜻, 홉 호프 차이
- 설명 ※ 주석: "영화 「호프」의 내용은 다루지 않습니다(스포일러 없음)." · "화성 표범 무늬 돌은 '생명 흔적일 가능성'이며 확정이 아닙니다."

## 10. 한 문장 정리

**UFO는 모르는 것, 외계 생명체는 지구 밖의 모든 생명, 외계인은 그중에 말이 통할 생명 — 그리고 셋 다 아직 확인된 건 없다.**
