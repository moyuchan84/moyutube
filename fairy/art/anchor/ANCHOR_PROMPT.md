# 화풍 앵커 프롬프트 — 엄마의 동화책 (『진짜 히어로가 되는 법』)

원작자가 고른 화풍 참고 이미지: `fairy/art/reference.jpg` (쇼핑몰 상품 화면 캡처 — 가는 검정 펜선 도안 + 색연필로 칠한 버전). (v4)

## 쓰는 방법 — 참고 이미지는 "화풍 참고"로만
1. `reference.jpg` 는 그림 부분만 잘라 둔 상태 확인 완료 (쇼핑몰 메뉴 · 상품명 없음). 다만 저해상도(약 580×550)에 통 가장자리 · 배경 책장이 조금 보인다 → 그림 질감 참고용으로는 충분하고, 프롬프트에 '통 · 상품 사진 금지'를 넣어 두었다.
2. Gemini 에 ① 잘라낸 참고 이미지를 첨부하고 ② 아래 프롬프트를 붙여 넣는다. 비율 16:9.
3. 이 그림은 다른 작가의 상품 도안이다. **그 인물 · 구도 · 글자를 그대로 다시 그리게 하지 않는다.** 선의 느낌 · 얼굴 그리는 방식 · 칠하는 방식만 빌리고, 인물은 우리 이야기용으로 새로 만든다 (프롬프트에 이미 그렇게 적어 두었다).
4. 결과가 참고 그림의 캐릭터와 닮았으면 다시 뽑는다. 원작자가 이 도안의 작가를 알고 있다면 같은 화풍으로 가도 되는지 한 번 확인해 두는 게 안전하다.
5. 마음에 드는 한 장을 `fairy/art/anchor/style-anchor.png` 로 저장 → 이후 모든 장면 요청에 첨부.

## 프롬프트

```
Use the attached image ONLY as a loose style reference for line quality, the way faces are drawn, and the coloring technique. Do NOT copy any character, pose, composition, object, text, logo, or layout from it. Create entirely new characters and a new scene.

Create an original, funny, hand-drawn Korean children's picture book illustration, landscape 16:9.

STYLE (inspired by the reference's feel):
- Clean, thin-to-medium black ink outlines, confident and slightly wobbly, with a clear sticker-like or coloring-book readability.
- Quirky, comical character faces: big egg-shaped or round heads, small round eyes with large black pupils (sometimes with a thin circle like glasses), a large puffy rounded nose, big pouty pink lips or a wide goofy smile, round pink cheek patches, a few wrinkle or freckle lines. Faces are quirky and a bit lumpy, never perfectly symmetrical. Expressions are exaggerated, silly and lovable, never creepy.
- Stubby hands, slightly long thin legs, simple everyday clothes with small patterns like dots and stripes.
- Coloring like oil pastels, wax crayons and colored pencils: visibly scribbled, dense hatched strokes (even the background is filled with vertical crayon strokes), uneven fills that sometimes go slightly outside the lines, layered colors with rich saturation. Messy-on-purpose, child-friendly handmade feeling.
- Vivid but friendly palette: teal, deep blue, fresh leaf green, sunny yellow-orange, hot pink accents, with the red cape as the strongest accent. Hair can be drawn with bold directional hatch strokes (orange-brown, black-brown).
- Simple, flat background with a few doodled details (a swing, tiny plants, little clouds, small dots and stars). Warm cream paper feeling. No 3D, no glossy rendering, no airbrushed gradients, no photo-realism.

SCENE: a sunny schoolyard with a simple swing set and a small school building drawn loosely. Three children stand in the foreground, full body, facing the viewer, spaced apart so each one is easy to see:

1. JUN-I (center): an energetic boy about 8 years old, round head, spiky messy dark-brown hair drawn with strong hatch strokes, a cheeky proud grin with rosy cheeks, fists on hips and chest puffed out. He wears a bright red hero cape tied at the neck, flapping with a few speed lines, over a light-blue T-shirt with small dots and beige shorts. Always wearing the red cape.

2. SUNHO (left): a calm, gentle boy about 8 years old, short black hair, small round eyes, a soft shy smile with rosy cheeks. He stands steadily with a pair of light-gray forearm crutches because one leg is weak, drawn with dignity and charm, never pitiful. Mint-green sweatshirt, dark-gray pants.

3. MINJI (right): a kind girl about 8 years old, dark-brown hair in two low pigtails with yellow ribbons, a warm smile, one hand raised in a friendly wave. Soft pink cardigan over a cream striped dress. No cape.

Keep each character's face design consistent and simple so it can be redrawn identically on later pages. Leave the lower-right area emptier for text space.

NEGATIVE: no text, no letters, no captions, no logos, no watermark, no product mockup, no cylinder or tin, no UI or phone screen, no copying of the reference characters, no photo-realism, no anime, no 3D render, no extra characters, no scary or pitiful expressions, no extra fingers.
```

## 이 앵커로 고정하는 것
- 컷 구분 느낌: 인물을 스티커처럼 얇은 하늘색 · 흰 테두리로 둘러 배경에서 띄우는 연출은 선택 (썸네일 · 일부 장면에만)
- 선: 가는~중간 검정 펜선, 색: 색연필 · 크레용으로 빽빽이 칠한 느낌 + 선 밖으로 살짝 삐져나감
- 얼굴: 둥근 달걀 머리, 작은 동그란 눈, 큰 코, 통통한 입술 / 분홍 볼 — **익살스럽지만 귀엽게**
- 준이: 빨간 망토 · 하늘색 땡땡이 티셔츠 · 삐죽 갈색 머리 / 선호: 민트 상의 · 회색 목발 / 민지: 분홍 가디건 · 노란 리본 두 갈래 머리
- 이후 장면 프롬프트 첫 줄: "Use the attached anchor image as the style and character reference. Keep the same characters, faces, line and colored-pencil coloring style exactly."
- 슬픈 장면(#5 그네, #6 우는 선호)도 같은 화풍으로, 표정은 **귀엽게 풀 죽은 정도**로 낮춘다.
