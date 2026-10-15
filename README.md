# youtube

유튜브 채널 작업을 한 저장소에 모은 것.

| 폴더 | 내용 |
|---|---|
| `qna/` | 「여덟 살의 질문」 — 기획 사이트(GitHub Pages) + Remotion 영상 제작. 작업 규칙은 [qna/CLAUDE.md](qna/CLAUDE.md) |
| `shortube/` | 쇼츠 자동 제작 (Python + Remotion). [shortube/SPEC.md](shortube/SPEC.md) |
| `funtube/` | Remotion 영상 프로젝트 |

- 키 파일(`.env`)과 렌더 결과물(`out/`), `node_modules/` · `.venv/` 는 올리지 않는다 (`.gitignore`).
- 이 저장소는 원래 qna 만 있던 github.com/moyuchan84/moyutube 를 넓힌 것이다. 2026-10-15 이전 기록은 qna/ 로 옮기기 전 경로로 남아 있다 (`git log --follow qna/...`).
- 루트 `index.html` 은 GitHub Pages 주소를 `qna/` 로 넘겨 주는 페이지다.
