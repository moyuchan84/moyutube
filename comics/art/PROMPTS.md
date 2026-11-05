# 프롬프트 레퍼런스 — 그림체 · 캐릭터 고정 문장

**모든 그림 프롬프트는 이 파일의 문장을 글자 그대로 복사해 조립한다.** 한 단어라도 바꾸면 그림체 · 얼굴이 흔들린다. 바꿀 땐 이 파일을 고치고 모든 컷을 같은 문장으로 다시 뽑는다.

조립 순서: `STYLE` → (시트면 `SHEET_*`, 컷이면 `MATCH` + 장면) → 등장인물 `CHAR_*` → `NO`

## STYLE (모든 그림 공통 — 그대로)

```
STYLE: Korean webtoon art, black-and-white ink only. Bold brush-pen line art with strong line-weight variation (thick outer contours, thin inner folds). Shadows are large areas of solid black ink, not gray gradients. Mid-tones only as halftone screentone dots in two sizes. Off-white paper background (#F4F1EA) with subtle paper grain and slight ink bleed at line edges. Realistic young-adult proportions, about 7.5 heads tall, sharp jawlines, narrow expressive eyes with thick upper lash line, hair drawn as clumped ink strands with white highlight gaps. Gritty, cinematic, moody seaside-town youth drama mood. Absolutely monochrome: no color anywhere.
```

## COMP (일반 장면 — 그대로) · ACTION (액션 장면 — COMP 대신)

2026-11-02 사용자 피드백 "구도 · 연출이 밋밋, 액션은 더 역동적으로" 로 추가. 모든 장면 컷에 둘 중 하나를 넣는다.

```
COMPOSITION: Cinematic, dynamic webtoon direction — never a flat eye-level straight-on view. Use dramatic perspective (strong low or high angle), bold diagonals, foreground objects framing the subject for depth, and asymmetric placement with tension.
```

```
ACTION DIRECTION: Extremely dynamic manga fight panel. Extreme wide-angle lens perspective with heavy foreshortening (the fist or foot thrust huge toward the camera), tilted dutch angle of 20-30 degrees, explosive radial speed lines and motion smears, flying debris and sweat drops, ink splatter on impact, bodies twisted in full motion with stretched limbs, hair and clothes whipping. Raw, violent energy, like a key frame from a top-tier action webtoon.
```

- 액션은 한 장으로 끝내지 않는다: **준비(피함 · 웅크림) → 임팩트(전경에 거대한 주먹) → 여파(공중에 뜬 몸 · 파편)** 3장으로 나눠 0.3–0.6초씩 빠르게 잇는다.
- 장면 SCENE 문장에도 카메라 위치를 구체적으로 쓴다 (땅바닥 높이에서 · 어깨 뒤에서 · 옥상에서 내려다보며 · 전경에 쓰러진 손이 흐리게).

## NO (모든 그림 끝에 — 그대로)

- 2026-11-02: c09 에 팔이 세 개(벽돌 든 두 손 + 주먹)로 나와 해부 금지어를 넣었다. 손 · 팔이 많이 나오는 컷은 SCENE 에 "exactly two arms, both hands …" 처럼 손 위치를 못 박는다.
- 효과음 글자가 그림에 섞여 나와 "any written characters of any language" 도 넣었다.

```
NO: color of any kind, gray airbrush gradients, text, letters, numbers, captions, speech bubbles, sound-effect lettering, logos, brand names, watermark, panel borders, frames, signatures, chibi or cartoon proportions, anime moe style, glossy 3D render, extra arms, extra hands or fists, more than two arms per person, malformed or fused fingers, any written characters of any language. Single full-bleed illustration only.
```

## SHEET (캐릭터 시트 — 16:9 한 장)

```
LAYOUT: A clean character model sheet on one off-white page, 16:9. Left two-thirds: three full-body standing views of the SAME person side by side at identical scale and height — front view, three-quarter view, back view — neutral standing pose, arms relaxed. Right third: a 2×3 grid of head-and-shoulders close-ups of the same face showing six expressions: neutral, small smile, surprised, angry (half the face in black shadow), holding back tears, flustered. Plain empty background, even spacing, no labels.
```

## MATCH (시트를 첨부한 장면 컷 — 그대로)

```
MATCH: The attached image(s) are the official character model sheets. Draw each character with exactly the same face, hairstyle, body type, clothing and accessories as on the sheet. Keep the identical ink style.
```

---

## CHAR — 캐릭터 고정 문장 (그대로)

### mugyeol19 · 차무결 (19)
```
CHARACTER Cha Mugyeol (19, Korean high-school boy): 182 cm, lean wiry muscle, broad straight shoulders. Short black hair cut close on the sides, slightly messy longer top falling over the forehead. Sharp narrow eyes with heavy upper lids, thick straight eyebrows. Clean face with no scars on the face. Thin lips, usually expressionless. Both hands and knuckles wrapped in white cloth bandages up to the wrist. Wears a dark navy school blazer worn open and unbuttoned, a plain white crew-neck T-shirt underneath, dark school trousers, and worn-out canvas sneakers with frayed laces. Slightly slouched, hands often in pockets.
```

### harin19 · 서하린 (19)
```
CHARACTER Seo Harin (19, Korean high-school girl): 165 cm, slim. Chin-length straight bob haircut, her bangs swept to one side and held back with a single small hair pin on her RIGHT side. Large bright eyes with a mischievous look, small mouth, faint smile lines. Wears a girls' high-school uniform: white blouse, dark ribbon tie, dark knee-length pleated skirt, dark cardigan. A long hand-knitted scarf wrapped once around her neck with both ends hanging (the scarf's knit texture clearly visible). An old metal 35mm film camera with a leather strap hangs around her neck at chest height.
```

### dongsu19 · 구동수 (19)
```
CHARACTER Gu Dongsu (19, Korean high-school boy): 170 cm, round soft face and slightly chubby build. Spiky messy hair sticking up at the crown. Big round thick-rimmed glasses that slide down his nose. Expressive eyebrows, wide mouth. Same dark navy school blazer as Mugyeol but fully buttoned and too tight, shirt untucked on one side. Often holding a snack.
```

### gihyeon24 · 백기현 (24)
```
CHARACTER Baek Gihyeon (24, Korean man): 178 cm, slender. Neatly combed-back black hair with one loose strand. Smiling crescent-shaped eyes that never smile with the rest of the face; thin elegant face. Clean light dress shirt with sleeves rolled to the forearms, top button open, dark slacks, a thin wristwatch. Long thin fingers, often rolling a small round mint candy between them. Calm, polite, quietly menacing posture.
```

### bongsun · 봉순 할머니 (70)
```
CHARACTER Grandma Bongsun (70, Korean grandmother): short and sturdy, permed short gray hair under a floral head scarf, deep sun-weathered wrinkles, sharp knowing eyes. Quilted padded vest over a work blouse, rubber apron, rubber boots. Holds a long ladle.
```

### eungyeol10 · 차은결 (10)
```
CHARACTER Cha Eungyeol (10, Korean boy, Mugyeol's little brother): small and thin, same thick eyebrows as Mugyeol, round bright eyes, bowl haircut, oversized hand-me-down hoodie, holding a toy plastic camera.
```

### mugyeol25 · harin25 (4부 — 시트는 나중에)
- mugyeol25: mugyeol19 문장에서 교복 → `black work jacket over a gray T-shirt, cargo work pants, work boots`, 붕대 → `bandaged hands under fingerless work gloves`, 어깨 `broader`.
- harin25: harin19 문장에서 단발 → `shoulder-length hair tied in a low ponytail`, 교복 → `oversized shirt, wide trousers, canvas tote`, 카메라 → `a digital camera and the same old film camera`.

---

## 시트 목록 (art/ref/)

| 파일 | 조립 | 비율 |
|---|---|---|
| `ref/mugyeol19-sheet.png` | STYLE + SHEET + CHAR mugyeol19 + NO | 16:9 |
| `ref/harin19-sheet.png` | STYLE + SHEET + CHAR harin19 + NO | 16:9 |
| `ref/dongsu19-sheet.png` | STYLE + SHEET + CHAR dongsu19 + NO | 16:9 |
| `ref/gihyeon24-sheet.png` | STYLE + SHEET + CHAR gihyeon24 + NO | 16:9 |
| `ref/bongsun-sheet.png` · `ref/eungyeol10-sheet.png` | 같은 방식 (조연, 필요할 때) | 16:9 |

## 컷 프롬프트 틀 (장면 — 시트 첨부)

```
<STYLE>
<MATCH>
SHOT: <shot size, angle, lens feel>. Vertical 9:16 composition with extra headroom.
SCENE: <place, time, weather, action, expression>.
<등장인물 CHAR 문장들>
<NO>
```

## 생성 메모 (크롬 Gemini)

- 시트는 캐릭터마다 **새 채팅**, 텍스트만. 컷은 새 채팅 + 해당 인물 시트 첨부 (같은 인물 시트는 한 장만).
- 결과 우하단 Gemini 표시는 잘라 낸다. 시트에 글자 · 라벨이 섞이면 다시 뽑는다.
- 고른 시트가 기준이 된다 — 바꾸지 않는다. 마음에 안 드는 시트는 `ref/_rejected/` 로.
