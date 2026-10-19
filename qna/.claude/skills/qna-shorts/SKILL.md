---
name: qna-shorts
description: 「여덟 살의 질문」 롱폼 한 편(epNN)을 본편 유입용 9:16 쇼츠로 다시 엮고(궁금증 구조 · 애프터이펙트식 편집), 렌더한 뒤 Claude in Chrome 으로 YouTube Studio 에 비공개 업로드까지 하는 작업 흐름. "1편 쇼츠 만들어줘", "ep02 숏폼", "롱폼으로 쇼츠 만들어서 올려줘", "/qna-shorts ep03" 같은 요청에 사용.
---

# qna 쇼츠 — 롱폼 → 유입용 쇼츠 → 비공개 업로드

인자: 편 번호 (`ep01`, `ep02` …). 작업 폴더는 `qna/video`.
음성 · 그림은 **롱폼에 이미 있는 것만** 쓴다 → Gemini 호출 없음, 비용 0. 새 대사가 필요하면 멈추고 사용자에게 묻는다 (유료).

| 단계 | 할 일 | 결과물 |
|---|---|---|
| 1 | 롱폼 대사 목록 보기 · 쇼츠 구성 고르기 | (머릿속 / 대화) |
| 2 | 편집 계획 쓰기 | `video/src/shorts/<epNN>.json` |
| 3 | `src/Root.tsx` 의 `EDITED_SHORTS` 에 등록 | |
| 4 | `npm run short -- <epNN> --check` → 콘택트 시트를 **눈으로 확인**하고 고친다 | `video/out/shorts/<epNN>-check.png` |
| 5 | `npm run short -- <epNN>` | `video/out/shorts/<epNN>-short.mp4`, `<epNN>-short.upload.md` |
| 6 | 사용자 확인 후 YouTube Studio 에 **비공개** 업로드 (Chrome) | 영상 URL → upload.md 에 기록 |
| 7 | 브랜치에서 커밋 → PR (out/ 는 올리지 않음) | |

## 1. 구성 — 궁금증을 남기는 순서

대사 목록 보기:
```bash
cd qna/video && node -e "const s=require('./src/epNN/script.json'),t=require('./src/epNN/timing.json');for(const c of s.cuts)c.lines.forEach((l,i)=>console.log(c.id+'-'+i,l.who,(t[c.id+'-'+i]||0).toFixed(1)+'s',l.text))"
```

기준 예시는 `src/shorts/ep01.json`. 고르는 규칙:
1. **0초에 질문**: 아이의 질문 대사로 바로 시작 (인사 · 나레이션 도입 금지). 위에 `hook` 두 줄이 쾅 찍힌다 — "아빠도 대답 못 한 / 진짜 차이"처럼 **답이 있다는 약속**.
2. **틀린 답 → 땡**: 아빠가 얼버무린 대사에 `stamp` (오답을 바로잡는 쾌감).
3. **반전 한 줄**: "그런데 ~부터가 완전히 다릅니다" 류에 `pop: "?!"`.
4. **챕터**: 항목마다 `chapter` (위 목록에 불이 켜지고 "첫째/둘째/셋째" 도장). 한 항목에 대사 1~3개.
5. **마지막 항목은 답을 주지 않는다**: 시작 대사 하나만 보여 주고 끝 카드로 질문을 남긴다 → 본편으로. 위 목록에서도 마지막 항목은 차례가 올 때까지 `???`.
6. 길이 **40~55초** (스크립트가 60초 넘으면 경고). 대사는 9~12개.
7. 6번 박자(아이 눈높이 설명)와 롱폼의 결론 문장은 쓰지 않는다 — 본편에서 볼 이유를 남긴다.
8. 몸 · 성 소재 편(4편 등)은 민감한 단어를 `hook` · `stamp` · `end` · 제목에 쓰지 않는다 (qna/CLAUDE.md 고정 규칙).

## 2. 편집 계획 형식 (`src/shorts/<epNN>.json`)

```jsonc
{
  "id": "Ep01-Short",                       // 컴포지션 id
  "episode": "ep01",
  "series": "여덟 살 아들의 질문 1편",
  "topics": ["호텔", "모텔", "유스호스텔"],    // 위 목록 (chapter 번호와 같은 순서)
  "hook": ["아빠도 대답 못 한", "진짜 차이"],   // 첫 2초 (둘째 줄 노랑 · 크게)
  "segments": [
    { "line": "c01-1", "hl": ["호텔이랑"], "cutin": false },   // 대사 id = <컷>-<번호>
    { "line": "c02-1", "zoom": 1.85, "shake": true },
    { "line": "c03-0", "stamp": { "text": "땡!", "sub": "가격 차이가 아니었다" } },
    { "line": "c04-1", "transition": "whip", "pop": "?!" },
    { "line": "c05-0", "chapter": 0, "transition": "whip" },
    { "line": "c07-0", "chapter": 2, "transition": "glitch", "hold": 4 }
  ],
  "end": { "title": ["독일의 한 선생님은", "왜 이걸 만들었을까?"], "sub": "본편에서 확인하세요" },
  "upload": { "longTitle": "...", "title": "... #shorts", "description": "...", "tags": [], "playlist": "여덟 살 아들의 호기심" }
}
```

조각 옵션 (`src/shorts/Short.tsx` 의 `ShortSegment`):
- `transition`: `whip`(가로 모션 블러 + 휙) — 장면(컷)이 바뀔 때 · `glitch`(색 갈라짐 + 되감기) — 마지막 "???" 항목에
- `zoom` / `cam`: 기본은 말하는 배우를 따라가는 카메라 (배우 1.6배, 나레이션 1.35, 배경만 있는 그림 1.15). 같은 컷이 이어지면 저절로 점프 컷 줌
- `hl`: 노랗게 칠할 단어 (띄어쓰기 단위, 부분 일치) — 나올 때 화면이 살짝 당겨진다. 한 대사에 1~3개
- `stamp` · `pop` · `shake` · `cutin`(롱폼 얼굴 컷인, 기본 켜짐) · `hold`(뒤에 더 머무는 프레임)

자동으로 들어가는 것: 훅 플래시 · 단어 단위 자막(지금 읽는 단어 강조) · 위 목록 + 진행 막대 · 필름 입자 · 비네트 · BGM(롱폼 `bgm`) · 효과음(whoosh/pop/stamp — `node scripts/sfx.mjs` 가 없으면 만든다) · 끝 카드(↓ 관련 동영상 링크 쪽 화살표).

## 3~5. 등록 · 확인 · 렌더

`src/Root.tsx`:
```ts
import ep02Short from "./shorts/ep02.json";
const EDITED_SHORTS = [ep01Short as unknown as ShortSpec, ep02Short as unknown as ShortSpec];
```
그 편이 `EPISODES` 에 있어야 한다 (timing.json 필요).

```bash
cd qna/video
npm run short -- ep02 --check   # 조각마다 스틸 → out/shorts/ep02-check.png 를 Read 로 열어 본다
npm run short -- ep02           # mp4 + upload.md
```
확인할 것: 글자가 오른쪽 140px · 아래 330px(쇼츠 UI 자리)에 걸리지 않는지, 자막이 그림의 중요한 부분(얼굴)을 가리지 않는지, 같은 그림이 3번 넘게 연달아 나오지 않는지. 고칠 게 있으면 json 만 고치고 다시 `--check`.

## 6. YouTube Studio 업로드 (Claude in Chrome)

**공개(Public)로 올리지 않는다.** 항상 비공개(Private)로 저장하고, 공개 전환은 사람이 한다 (shortube/SPEC.md 8장과 같은 원칙).
업로드 버튼을 누르기 전에 사용자에게 "이 파일을 이 제목으로 비공개 업로드할까요?" 확인을 받는다 (바깥으로 나가는 동작).

1. `anthropic-skills:chrome-browser` 스킬을 먼저 읽고, 도구를 한 번에 불러온다:
   `ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__get_page_text")`
2. `tabs_context_mcp` → 새 탭 → `https://studio.youtube.com`. 로그인 화면이면 멈추고 사용자에게 로그인을 부탁한다 (비밀번호를 대신 넣지 않는다). 채널이 맞는지(모라구 / 여덟 살의 질문) 화면에서 확인한다.
3. 본편 찾기: Studio 콘텐츠 목록에서 `upload.longTitle` 로 본편을 찾아 URL 을 적어 둔다 (관련 동영상에 쓴다). 본편이 아직 없으면 사용자에게 알리고 관련 동영상 칸은 비운다.
4. 업로드 창은 `https://studio.youtube.com/channel/<채널ID>/videos/upload?d=ud` 로 바로 열린다. `find` 로 `input type=file` 을 찾아 `file_upload` 로 **`<epNN>-short.upload.mp4`** 를 넣는다 (확장의 파일 올리기는 10MB 까지 — 원본 mp4 는 60MB 넘어서 안 된다. `npm run short` 가 10MB 이하 사본을 만든다). 파일 선택 버튼은 클릭하지 않는다 (보이지 않는 창이 열림).
5. 세부정보: 제목 칸은 파일 이름이 미리 들어 있으니 클릭 → ctrl+a → 입력. 설명 · 재생목록 · 아동용(아래 "채널 설정") · "자세히 보기"를 펼쳐 태그(쉼표로 끝맺기) · **AI 사용 여부: "예"** (그림 · 목소리가 AI 생성).
6. "동영상 요소" 단계의 **관련 동영상**에 3번의 본편을 고른다 (끝 카드의 ↓ 화살표가 가리키는 링크). "일회성 인증 필요"(전화 인증) 창이 뜨면 취소하고 넘어간다 — 사람이 채널 설정에서 인증해야 한다. 인증 뒤에는 Studio > 그 쇼츠 > 세부정보에서 연결한다.
7. 공개 상태: **비공개** 를 고른 것을 확대 화면으로 확인 → 저장. 세부정보 오른쪽의 영상 링크(youtube.com/shorts/…)를 `out/shorts/<epNN>-short.upload.md` 끝에 `## 업로드 기록` 으로 적는다 (URL · 비공개 · 날짜 · 관련 동영상 연결 여부).
8. 같은 동작이 2~3번 실패하면(버튼이 안 눌림, 화면이 다름) 반복하지 말고 무엇이 안 됐는지 알리고 사용자에게 묻는다. 알림 · 확인창(삭제 등)을 띄우는 버튼은 누르지 않는다.

## 채널 설정 (업로드할 때 확인된 것을 적는다)
- 아동용: **아니요, 아동용이 아닙니다** (2026-10-15 사용자 확인). 묻지 않고 이대로 고른다.
- 채널: 모라구 (`UCCIm8f5JE4b4PmSrPIJd7zQ`). 본편: 1편 `HBDKnxz3ubk`, 2편 `XbUNeg7ytBc`, 3편 `tOr0fU-9fgk`
- 관련 동영상 연결: 채널 인증 완료(2026-10-16). 1~4편 쇼츠를 각 본편에 연결함. 이제 업로드 창 "동영상 요소" 단계나 Studio > 쇼츠 > 세부정보 오른쪽 "관련 동영상" 연필 → 본편 고르기 → 저장으로 바로 된다
- Studio 는 한 번에 한 채널만 열린다. 다른 채널(숫자로 보는 요즘)이 열려 있으면 youtube.com/channel_switcher 에서 모라구로 바꾼 뒤 studio.youtube.com/video/<ID>/edit 로 간다
- 본편: 4편 `8Xxrcsn9-zk`
- 롱폼(수백 MB)은 Chrome 확장으로 못 올린다(10MB 한도) → 업로드 창만 열고 사람이 파일을 끌어다 놓은 뒤 이어서 세부정보 · 썸네일 · 자막(파일 업로드 → '타이밍 포함', '계속' 은 누르지 말고 file input 에 바로 넣기) · 영어 제목/설명(동영상 자막 페이지 → 언어 추가 '영어(미국)')을 채운다
- 업로드한 쇼츠 (2026-10-15): 1편 https://youtube.com/shorts/RYCGizrpJLY · 2편 https://youtube.com/shorts/sCmFsefevdw · 3편 https://youtube.com/shorts/uDal1J4SIlE (1~3편은 사람이 공개로 바꿈) · 4편 https://youtube.com/shorts/8t9WAtbzI7I (비공개)
- 5편 (2026-10-16): 본편 `mlWOQoAdcW8` (비공개) · 쇼츠 https://youtube.com/shorts/voY3yNg0eSs (비공개, 관련 동영상 아직 — 비공개 본편은 "특정 동영상 선택" 목록에 안 뜬다. 본편을 공개한 뒤 연결)
- Chrome 이 다른 Google 계정(AI Studio 용 mojjijji)으로 바뀌어 있으면 Studio 가 "이 페이지를 볼 권한이 없습니다" 를 띄운다 → 사람에게 계정 전환을 부탁한다. 사람이 연 업로드 탭은 그룹 밖일 수 있으니 닫지 말고, 새 탭에서 `studio.youtube.com/video/<ID>/edit` → "초안 수정" 으로 같은 업로드 창을 연다
- 영어 제목은 100자를 넘으면 저장되지 않는다
- 몸 · 성 소재 편(4편)의 쇼츠는 민감한 단어가 들어간 대사를 아예 고르지 않는다 (쇼츠 자막은 큰 화면 글자다)
- 업로드 창에서 `ref` 로 누르는 클릭은 창이 다시 그려지면 먹지 않을 때가 있다 → 스크린샷을 보고 **좌표로** 누르고, 누른 뒤 확대(zoom)로 선택됐는지 확인한다. 재생목록 창은 체크박스 (241,218) · 완료 (560,556) 근처 (창 1280폭 기준)
- 6편 (2026-10-17): 본편 `HlBACTGLAoY` (저장은 비공개로 했으나 마지막 확인 때 공개로 표시됨) · 쇼츠 https://youtube.com/shorts/3mWDgtNH6pg (비공개, 관련 동영상에 본편 연결함). 비공개 본편도 업로드 직후엔 "특정 동영상 선택" 목록에 떴다 (5편 때와 달라졌으니 먼저 시도해 본다)
- 7편 (2026-10-19): 본편 `ZJei7TAkrpo` (비공개, 한국어 자막 · 영어 제목/설명/자막 게시) · 쇼츠 https://youtube.com/shorts/mt3BBABm6hI (비공개). 업로드 직후엔 새 본편이 "특정 동영상 선택" 목록에 안 떴다(처리 중) → 처리가 끝난 뒤 쇼츠 세부정보 > 관련 동영상에서 연결. 이 계정(starbud2025)의 채널 전환 화면에서 "모라구"를 고른 뒤 studio.youtube.com/channel/UCCIm8f5JE4b4PmSrPIJd7zQ 로 열린다. Gemini "원본 크기 다운로드"는 앵커 얼굴이 섞일 수 있어, 소품은 화면의 1024px 이미지를 저장했다
