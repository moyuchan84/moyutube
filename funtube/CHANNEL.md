# 일상 오류 신고센터 — 채널 개설 자료

일상에서 벌어지는 어이없는 상황을 "신고 접수"하는 콩트 · 영상툰 채널. 내로남불은 여러 시리즈 중 하나다.

- 채널 이름: **일상 오류 신고센터**
- 핸들 후보(사용 가능 여부는 만들 때 확인): `@일상오류신고센터` · `@ilsang-error` · `@errorcenter`
- 브랜드 색: 종이색 `#FFF8E7` · 먹색 `#24180F` · 보라 `#8A3FFC` · 주황 `#FF7A1A` · 카톡 노랑 `#FEE500` (채널 `index.html` 과 같다)
- 캐릭터: 선배(둥근 안경, 졸린 눈, 얄미운 입) · 후배(큰 눈, 다크서클). 참고 그림은 `site/senior.png` · `site/junior.png`

---

## 1. 프로필 이미지 (정사각 800×800 · 유튜브가 원형으로 잘라 보여 준다)

Gemini 에 `site/senior.png` 와 `site/junior.png` 를 같이 올리고 아래 프롬프트를 붙인다. 같은 인물이 나오게 하려는 것이다.

```
Use the two attached characters (the smug glasses-wearing senior and the tired earnest junior) exactly as drawn, same Korean webtoon gag-comic style: thin wobbly hand-inked black outlines, flat colors, no gradients, huge glossy eyes.

Create a square 1:1 profile image for a comedy channel called "Daily Error Report Center". Concept: a tiny customer-complaint desk. The junior stands at the front looking exhausted, holding up a clipboard with a stamped paper; the senior peeks from behind looking smug and innocent. A big red circular "RECEIVED" style rubber stamp mark, drawn as just a red ring with a check mark and NO readable letters, overlaps the bottom-right corner.

Composition: both characters centered, heads large, fitting inside a circle crop with generous margin (nothing important within 12% of the edges). Solid warm cream background (#FFF8E7) with a thick dark brown (#24180F) outline frame feel, purple (#8A3FFC) and orange (#FF7A1A) accents only. Bold, readable even at 98x98 pixels.

IMPORTANT: no text, no letters, no numbers, no logos anywhere in the image.
```

## 2. 채널 배너 (2048×1152, 16:9)

유튜브는 기기마다 배너를 다르게 잘라서 **가운데 가로 1235 × 세로 338 영역**만 항상 보인다. 글자와 캐릭터는 이 안에 넣는다.

```
Same two attached characters and same Korean webtoon gag-comic style as the profile (thin wobbly black outlines, flat colors).

Create a wide 16:9 channel banner (2048x1152) for "Daily Error Report Center", a comedy channel about funny everyday situations. Scene: a cheerful complaint-center counter in a flat cartoon style. Background is warm cream (#FFF8E7) with a subtle dot pattern. On the left side the junior sits behind the counter with a stamp pad, exhausted; on the right the senior stands holding a "late" excuse, smug. Between them in the middle a stack of paper forms and a big red rubber stamp. Small floating comic icons around (phone with chat bubble, elevator button, coffee cup, delivery box, clock) in purple (#8A3FFC), orange (#FF7A1A) and chat-yellow (#FEE500).

SAFE AREA: put both characters and all key objects inside the central horizontal band, about 60% of the width and 30% of the height, centered. The outer areas should only contain simple background pattern and a few small icons, so cropping on phones and TVs never cuts anything important. Leave an empty clean space in the very center-top of the band for a title to be added later.

IMPORTANT: no text, no letters, no numbers, no logos anywhere in the image.
```

글자("일상 오류 신고센터")는 Gemini 가 한글을 자주 깨뜨리므로 이미지에는 넣지 않고, 받은 배너 위에 제가 코드로 얹는다(`Black Han Sans`, 먹색 글자 + 노랑 밑줄). 이미지를 `funtube/brand/` 에 넣어 주시면 합성한다.

생성이 끝나면 보라색이나 주황색 비중이 너무 크지 않은지, 가운데 안전 영역에 인물이 들어갔는지 확인한다. 얼굴이 어색하면 "keep the faces identical to the attached images" 한 줄을 더하고 다시 뽑는다.

---

## 3. 채널 소개 (1000자 이내)

```
일상 오류 신고센터입니다.

살다 보면 이런 일 있잖아요.
내가 늦으면 "차가 막혀서", 남이 늦으면 "시간 개념이 없어".
엄마가 보낸 "ㅋ" 한 글자에 하루 종일 눈치 보이고,
회식에서 "편하게 먹어"라는 말을 믿었다가 후회하고.

여기는 일상에서 접수된 어이없는 상황을
콩트 · 단톡방 · 영상툰 · 노래로 신고받는 곳입니다.
접수된 건은 웃고 넘어갑니다. 처리는 안 합니다.

📌 접수 분야
· 내로남불 — 내가 하면 로맨스, 남이 하면 불륜
· 직장 눈치 — 말은 "편하게", 속뜻은 다름
· 가족 단톡방 — 잘못 보낸 문자, 읽씹, 한 글자의 무게
· 아이 vs 어른 — 7살의 논리를 이길 수 없다
· 현실 vs 기대 — 사진 속 그 음식은 어디로 갔나
· 일상송 — 한 번 들으면 못 잊는 후렴

비슷한 일을 겪으셨다면 댓글로 신고해 주세요.
다음 접수 건이 될 수 있습니다.

※ 영상 속 인물과 상황은 모두 지어낸 이야기입니다.
※ 목소리와 그림은 AI 도구로 만들었습니다.
```

- 소개글 끝의 두 줄(지어낸 이야기 · AI 도구)은 유지한다. 합성 음성 표시를 유튜브가 요구하고, 실제 인물로 오해받지 않게 하는 용도다.
- 링크는 나중에 GitHub Pages 채널 페이지가 정해지면 추가한다.

## 4. 재생목록(시리즈)

| 재생목록 | 설명 한 줄 | 첫 영상 |
|---|---|---|
| 내로남불 | 내가 하면 로맨스, 남이 하면 불륜 | 내가 사면 투자, 네가 사면 투기 |
| 직장 눈치 | 말은 "편하게", 속뜻은 다름 | (제작 예정) |
| 가족 단톡방 | 잘못 보낸 문자와 한 글자의 무게 | 아빠가 갑자기 사랑한다고 했다 |
| 아이 vs 어른 | 7살의 논리를 이길 수 없다 | 7살 협상가 vs 엄마 |
| 현실 vs 기대 | 기대 한 컷, 현실 한 컷 | (제작 예정) |
| 일상송 | 한 번 들으면 못 잊는 후렴 | 길이 막혔어 |

## 5. 채널 개설 순서 (사용자 직접)

계정 · 본인 확인 · 공개 정보는 사용자 몫이다. 순서대로 하면 된다.

1. 유튜브에서 사용할 구글 계정으로 로그인 → 프로필 → **채널 만들기**. 개인 계정 이름 말고 **브랜드 계정**(맞춤 이름 사용)을 고르면 이름을 `일상 오류 신고센터` 로 정할 수 있다.
2. YouTube Studio → **맞춤설정 → 브랜딩**: 프로필 사진 · 배너 이미지 업로드.
3. **기본 정보**: 채널 이름 · 핸들 확인(이미 쓰는 핸들이면 위 후보로), 소개글 3번 붙여넣기.
4. **채널 → 기능 자격 요건**에서 전화번호 인증을 하면 15분 이상 영상과 썸네일 업로드가 열린다.
5. **설정 → 채널 → 고급 설정**: 시청자층 "아니요, 아동용으로 설정되어 있지 않습니다." 영상이 아이 캐릭터를 쓰더라도 아동 대상 콘텐츠가 아니므로 이 항목을 확인한다. 이후 영상별 설정은 업로드할 때 한다.
6. **업로드 기본값**: 공개 상태 `비공개`, 카테고리 `코미디`, 언어 `한국어`.
7. 재생목록 6개를 위 표대로 만든다.
8. 개설이 끝나면 알려 달라. 제목 · 설명 · 태그를 `invest` 영상에 맞춰 쓰고, **비공개로 업로드한 뒤 실제 상태를 다시 확인**한다.

### 업로드할 때 반드시 체크

- **변경되었거나 합성된 콘텐츠**: 예 (AI 합성 음성).
- 배경음악은 코드 합성이라 저작권 항목에 걸리지 않는다. 그래도 업로드 후 저작권 검사 결과(`제한사항`)를 확인한다.
- 같은 틀(선배/후배 + 마지막 한 줄)만 연달아 올리지 않는다. 시리즈를 번갈아 올려 반복 콘텐츠로 보이지 않게 한다.
