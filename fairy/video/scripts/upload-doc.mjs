// 업로드 설명 문서: 제목 · 설명 · 태그 (한국어 · 영어) → books/01-real-hero/upload/upload.md, meta.json
// 먼저 node scripts/upload-assets.mjs (챕터 · 자막)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const up = path.join(here, '..', '..', 'books', '01-real-hero', 'upload');
const ch = JSON.parse(fs.readFileSync(path.join(up, 'chapters.json'), 'utf8'));

const KO_TITLE = '진짜 히어로가 되는 법 | 엄마가 만든 동화 · 잠자리 동화 읽어주기';
const EN_TITLE = 'How to Be a Real Hero | A Picture Book Written by Mom (Bedtime Story for Kids)';

const KO_DESC = `망토만 두르면 누구나 히어로가 될 줄 알았던 준이.
친구들이 곁을 떠나고서야 깨닫습니다. 진짜 히어로는 큰 힘이 아니라 작은 배려에서 시작한다는 것을요.

엄마가 직접 쓴 동화를 5분 동안 읽어 드려요. 잠자기 전, 아이와 함께 들어 보세요.
이야기 속 질문: 준이는 어떻게 "사람들이 좋아하는 히어로"가 되었을까요? 우리 주변의 작은 히어로는 누구일까요?

📖 챕터
${ch.map((c) => `${c.at} ${c.ko}`).join('\n')}

✍️ 글: 김혜진 (엄마가 만든 동화)
🎨 그림 · 목소리 · 음악: AI 도구로 만들었어요 (그림: Gemini · 목소리: Gemini TTS · 배경음악과 효과음은 코드로 직접 합성)
🌐 자막: 한국어 · English

#엄마가만든동화 #잠자리동화 #어린이동화 #동화읽어주기 #그림책 #배려 #모라구`;

const EN_DESC = `Joon-i believes that anyone who puts on a cape becomes a hero. It is only after his friends drift away that he learns a real hero starts with small acts of kindness, not big powers.

A picture book written by a mom, read aloud in about five minutes. A gentle bedtime story to share with your child.
Something to talk about: how did Joon-i become a hero people like? Who are the little heroes around us?

Chapters
${ch.map((c) => `${c.at} ${c.en}`).join('\n')}

Story: Hyejin Kim (a picture book by Mom)
Art, voices and music: made with AI tools (art: Gemini, voices: Gemini TTS, music and sound effects synthesized in code)
Subtitles: Korean and English

#bedtimestory #kidsstory #picturebook #kindness #koreanstory`;

const TAGS = '엄마가 만든 동화,동화,잠자리 동화,어린이 동화,동화 읽어주기,그림책,히어로,배려,친구,인성 동화,초등 저학년,모라구,bedtime story,kids story,Korean picture book,hero,kindness,';

const fence = '```';
const md = `# 진짜 히어로가 되는 법 — 유튜브 업로드 자료 (모라구)

| 항목 | 값 |
|---|---|
| 채널 | 모라구 (UCCIm8f5JE4b4PmSrPIJd7zQ) |
| 재생목록 | 엄마가 만든 동화 (새로 만들기) |
| 영상 | fairy/video/out/01-real-hero-small.mp4 (5분 19초) |
| 썸네일 | fairy/books/01-real-hero/upload/thumbnail.jpg (1280x720) |
| 자막 | ko.srt (한국어) · en.srt (English), 같은 폴더 |
| 공개 상태 | 비공개로 저장 (공개 전환은 사람이) |
| AI 사용 표시 | 예 (그림 · 목소리 AI 생성) |

## 한국어 제목
${KO_TITLE}

## 한국어 설명
${fence}
${KO_DESC}
${fence}

## 태그 (쉼표로 끝맺기)
${TAGS}

## English title
${EN_TITLE}

## English description
${fence}
${EN_DESC}
${fence}
`;
fs.writeFileSync(path.join(up, 'upload.md'), md);
fs.writeFileSync(path.join(up, 'meta.json'), JSON.stringify({ KO_TITLE, EN_TITLE, KO_DESC, EN_DESC, TAGS }, null, 1));
console.log(`upload.md · meta.json (한국어 제목 ${KO_TITLE.length}자 · 영어 제목 ${EN_TITLE.length}자 · 설명 ${KO_DESC.length}자)`);
