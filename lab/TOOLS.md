# 도구 메모 — Manim · Motion Canvas

## Manim (Community Edition)
- Python 라이브러리. 3Blue1Brown 스타일. `Transform`, `MathTex`, `Axes` 등 수학 표현이 내장.
- 필요: Python 3.9+, ffmpeg, Cairo/Pango, (식을 쓰려면) LaTeX(MiKTeX).
- 이 PC: Python · ffmpeg 없음 → 설치 작업이 먼저 필요. Windows 에서 LaTeX 까지 맞추는 게 가장 번거롭다.
- 어울리는 편: 식 변형이 많은 수학 (피타고라스, 급수, 미분 맛보기).

## Motion Canvas
- TypeScript. 제너레이터 함수로 장면을 쓰고, 브라우저 편집기에서 미리보기 · 타이밍 조절.
- 필요: Node (이미 있음). `npm init @motion-canvas@latest` 로 시작.
- 렌더: 편집기에서 PNG 시퀀스/영상 출력 (영상 출력은 ffmpeg 플러그인 사용 여부 확인 필요 → 시험 때 확인).
- 어울리는 편: 도형 이동, 그래프, 입자, 도식. 음성 파일을 얹어 장면 길이를 맞추기 좋다.

## 이 저장소에서의 위치
- 한글 자막 · 음성 동기 · 썸네일은 이미 `qna/video`, `fairy/video` 의 Remotion 으로 해결돼 있다.
- 따라서 `lab/` 은 **"설명 장면을 만드는 부분"만** 새로 갖추면 된다.
- 설치할 때 확정 사항(Motion Canvas 영상 출력 방식, 한글 폰트)을 이 파일에 기록해 둔다.

## 시험작 계획 (코드 작성 전 합의용)
주제: 원의 넓이 (후보 1). 장면 4개 — ①원 ②부채꼴로 잘라 번갈아 놓기 ③직사각형으로 보이기 ④가로=πr, 세로=r. 목표는 30초 쇼츠 1편 + 방식 판단.
