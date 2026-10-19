# 화풍 앵커 프롬프트 — 엄마의 동화책 (『진짜 히어로가 되는 법』)

원작자 요청: 조금 더 장난스러운 그림체. (v2 — v1 은 차분한 수채화풍이었다)

Gemini(이미지 생성)에 아래 영어 프롬프트를 그대로 붙여 넣는다. 비율 16:9.
마음에 드는 한 장을 `fairy/art/anchor/style-anchor.png` 로 저장 → 이후 모든 장면 요청에 ① 첨부 이미지로 쓴다.
(여러 장 뽑아서 고른다. 얼굴 · 망토 · 목발이 설명과 다르면 다시 뽑는다.)

## 프롬프트

```
A playful, funny, hand-drawn children's picture book illustration in watercolor and wax-crayon style, landscape 16:9.

STYLE: bouncy, mischievous, cartoon-like picture book art. Bold, wobbly, confident wax-crayon outlines (slightly uneven thickness, like a kid-loving illustrator doodled it), filled with juicy watercolor washes that spill a little outside the lines. Exaggerated cute proportions: big round heads, small bodies, big expressive eyes, tiny dot noses, rosy cheeks, comically stretched arms and legs. Lively squash-and-stretch poses full of motion. Playful doodle details scattered around: little speed lines, stars, swirls, zigzags, sparkles, crayon scribbles, tiny dots like confetti. Warm cream watercolor-paper texture. Cheerful, brighter palette: sunny yellow, tangerine, bubblegum pink, sky blue, fresh grass green, with a strong pop of cape red. Fun, silly, energetic mood. No hard digital edges, no airbrushed gradients, no 3D, no glossy rendering.

SCENE: a sunny schoolyard playground drawn loosely and funny — wobbly swing set, a lopsided little school building, puffy cartoon clouds with a smiling sun, painted with simple washes so the children stand out. Three children in the foreground, full body, facing the viewer, in lively poses with room around them:

1. JUN-I (center, slightly in front, biggest energy): an elementary-school boy about 8 years old, big round head, short messy dark-brown hair sticking up in a funny tuft, huge sparkly eyes, a cheeky over-the-top grin, standing in a heroic pose with fists on hips and chest puffed out, one foot popped up. He wears a bright red hero cape tied at the neck that flaps dramatically with little speed lines, over a light-blue T-shirt and beige shorts. A faint golden glow and tiny stars around the cape. Always wearing the red cape.

2. SUNHO (left): a gentle, calm boy about 8 years old, soft short black hair, kind sleepy-sweet eyes, a small shy smile, leaning on a pair of light-gray forearm crutches (simple metal crutches with cuffs) because one leg is weak, drawn in a cute, confident, dignified way, never pitiful. Wears a mint-green sweatshirt and dark-gray pants.

3. MINJI (right): a kind, thoughtful girl about 8 years old, dark-brown hair in two bouncy low pigtails with yellow ribbons that flip up, warm gentle smile, one hand waving high in a friendly way. Wears a soft pink cardigan over a cream dress. No cape.

Keep the three characters clearly distinct in silhouette and color, with consistent simple face design (dot eyes with a white highlight, tiny nose, curved smile, rosy cheeks) that can be redrawn identically in later pages. Leave the lower-right area a little emptier, like a picture-book page with space for text.

NEGATIVE: no text, no letters, no captions, no logos, no watermark, no photo-realism, no anime style, no 3D render, no real people or existing cartoon characters, no extra characters, no scary or pitiful expressions, no extra fingers.
```

## v1 → v2 에서 바뀐 것
- 차분한 파스텔 → **밝고 통통 튀는 색**, 은은한 선 → **굵고 삐뚤빼뚤한 크레용 선**
- 현실 비율 → **큰 머리 · 작은 몸, 과장된 포즈** (준이는 허리에 주먹 올린 우쭐한 자세, 머리 삐죽)
- 배경에 **낙서 장식**(별 · 속도선 · 소용돌이 · 점)을 흩뿌려 장난스러운 느낌
- 선호는 목발을 짚지만 **당당하고 귀엽게**, 안쓰러운 표현은 금지 (원고 의도: 선호는 화내지 않고 조용히 돕는 아이)

## 이 앵커로 고정하는 것
- 종이 질감 · 굵은 크레용 선 + 번진 수채 · 밝은 색감, 포인트는 망토 빨강
- 준이: 빨간 망토 · 하늘색 티셔츠 · 삐죽 갈색 머리 / 선호: 민트 상의 · 회색 목발 / 민지: 분홍 가디건 · 노란 리본 두 갈래 머리
- 이후 장면 프롬프트 첫 줄: "Use the attached image as the style and character reference. Keep the same characters and playful watercolor-crayon style exactly."
- 슬픈 장면(#5 그네, #6 우는 선호)도 같은 화풍으로 가되, 표정은 과장 대신 **귀엽게 풀 죽은 정도**로 낮춘다.
