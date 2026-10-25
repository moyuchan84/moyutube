# rush — "OO을 1분 요약" 숏폼 엔진

테마 하나 = `content/rush/<id>.json` 하나. 코드는 건드리지 않는다.

```
node scripts/rush.mjs <id>          # 무료: 타이밍 · 박자에 맞춘 배경음악 · 효과음 (대사는 예상 길이)
node scripts/rush.mjs <id> gen      # 유료: say 가 있는 컷만 Gemini TTS (요청할 때만)
npx remotion studio src/index.ts    # 미리보기: rush-<id>
npx remotion render src/index.ts rush-<id> out/rush-<id>.mp4
```
새 테마는 `src/rush/themes.ts` 에 import 한 줄을 추가하면 `rush-<id>` 컴포지션이 생긴다.

## 연출 규칙 (레퍼런스: "5초만에 보는 고등학생의 하루")
- 컷은 **2~3박자(1~1.6초)**. 4박자 이상은 목록·카운터처럼 읽을 게 있을 때만.
- 설명하지 않는다. 글자는 한 컷에 한 줄, `*강조*` 한 단어. 나레이션 대신 **무음 + 효과음**. 대사(`say`)는 전체의 10% 이하, 짧게.
- 오프닝은 검은 카드(`title`) 두 장, 엔딩은 반전 한 줄 → `끝`.
- 같은 레이아웃을 세 번 연속 쓰지 않는다. `char` → `text` → `counter` → `split` 처럼 섞는다.
- 전환(`tr`)은 컷 성격에 맞춰: 장소/시간이 바뀔 때 `whip` · `zoom`, 충격은 `flash` · `glitch`, 반전은 `cut`(아무 효과 없이 끊기).
- 개그는 마지막 컷에 몰아 둔다. 중간은 **공감 → 과장** 순서.
- 화면 위 시계(`clock` + 컷의 `clk`)로 "긴 시간을 압축했다"는 느낌을 준다 (복무 D+, 임신 N주, 연애 D+ 등).

## 컷 종류 (`k`)
| k | 쓰임 | 주요 필드 |
|---|---|---|
| title | 검은 화면 + 흰 글자 | text |
| char | 캐릭터 한 명 크게 | face · pose · look · text · emoji · say |
| close | 얼굴 클로즈업(리액션) | face · say · emoji |
| crowd | 같은 캐릭터 n명 (odd 가 혼자 다름) | n · odd · text |
| text | 큰 글자 쾅 (`/` 줄바꿈) | text · emoji |
| counter | 숫자가 변함 | prefix · v0 · v1 · label |
| split | 기대 vs 현실 | left · right · text |
| stamp | 도장 쾅 | text · sub |
| list | 체크리스트 빠르게 쌓임 | text · items |
| meter | 게이지 | label · v0 · v1 · emoji |

공통: `b`(박자) `bg`/`bg2`(배경) `pattern`(rays·dots·stripes·grid·none) `dark` `cam`(push·pull·shake·spin·tilt) `tr` `sfx` `clk`.
캐릭터 모습(`look`)은 바꾼 항목만 적으면 다음 컷에도 이어진다 (hair · hat · shirt · camo · rank).
표정: normal hype shock deadpan cry sweat sleepy smug angry love dead / 포즈: idle wave salute shrug point hold cheer facepalm.
효과음: pop boom vboom punch whoosh ding chime tick scratch riser shutter horn heart powerup crinkle door typing …(`public/sfx`).

## 자동화 순서
1. 테마 한 줄(예: "임신부터 출산까지") → 시간 순서 8~12개 단계로 쪼갠다 (진짜 사건 + 공감 포인트).
2. 단계마다 컷 3~4개: 공감 → 과장 → (반전). 위 규칙으로 JSON 작성.
3. `node scripts/rush.mjs <id>` → 스튜디오에서 확인 → 필요하면 `gen`.

## anime 엔진 — 대사 없이 연출 · 자막 · 배경음악으로 (일본 애니메이션 극장판풍)
테마 JSON 에 `"engine": "anime"` 을 넣으면 `rush-<id>` 대신 `anime-<id>` 컴포지션이 생긴다 (코드: `src/rush/anime/`). 첫 예: `content/rush/drive1.json`.

```
node scripts/rush-art.mjs <id> --list | --import   # 장면 그림 (rush 와 같음)
node scripts/anime-bgm.mjs <id>                    # 무료: 컷 큐에 맞춘 배경음악 + 효과음(slash · impact · stamp · glitchfx)
npx remotion render src/index.ts anime-<id> out/anime-<id>.mp4
```
- 음성 없음. `line` 은 화면 대사 자막(아래 큰 글자 + 빨간 띠), 그때 `text` 는 위쪽 꼬리표가 된다. `line` 이 없으면 `text` 가 아래 큰 자막.
- `pic` 의 `crop: [위%, 아래%]` — Gemini 그림 위아래 여백을 잘라 "극장 패널"로 보여 준다(뒤에는 같은 그림을 흐리게). 85% 넘게 남기면 화면 가득.
- `fx`: `impact`(흑백 반전 임팩트 프레임 + 흔들림 + 타격음) · `lines`(집중선) · `rgb`(색 어긋남) · `speed`(속도선) · `sparkle`(빛 번짐 + 반짝이).
- `title` 에 `kicker` 가 있으면 장 카드(빨강/검정 사선), 없으면 흐린 그림 위 제목. `sub` 는 영문 작은 글자.
- 컷 종류: `pic` · `title` · `text`(의성어 한 방) · `counter`(원형 타이머) · `meter`(격투 게임 체력바) · `stamp`(도장, `sub` 가 펀치라인).
- 전환 `tr`: `slash`(칼날 사선) · `shutter`(위아래 판이 닫혔다 열림) · `whip` · `zoom`(줌 펀치 + 번쩍) · `glitch` · `flash` · `cut`.
- 음악 큐 `m`: `hit` · `tense` · `epic` · `stop`(정적 — 개그 멈춤) · `build`(상승 + 스네어) · `calm` · `comic`(장조 반짝임) · `end`. 큐를 바꾸면 `anime-bgm.mjs` 를 다시 돌린다.
