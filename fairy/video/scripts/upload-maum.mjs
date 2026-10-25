// 02-maum-cafe 업로드 자료: ko.srt · en.srt · chapters.json · upload.md · meta.json → books/02-maum-cafe/upload/
// 먼저 npm run prep -- 02-maum-cafe (timeline.json), upload/en.json(영어 자막, 한 줄씩) 이 있어야 한다.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const up = path.join(here, '..', '..', 'books', '02-maum-cafe', 'upload');
const tl = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'timeline.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(up, 'en.json'), 'utf8'));
const subs = tl.scenes.flatMap((s) => s.subs);
if (tl.slug !== '02-maum-cafe') throw new Error('timeline.json 이 02-maum-cafe 가 아님: npm run prep -- 02-maum-cafe');
if (subs.length !== en.length) throw new Error(`자막 ${subs.length}줄 ≠ 영어 ${en.length}줄`);

const tc = (t) => {
  const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const srt = (texts) => subs.map((c, i) => `${i + 1}\n${tc(c.from)} --> ${tc(Math.max(c.from + 0.4, c.to - 0.05))}\n${texts[i]}\n`).join('\n');
fs.writeFileSync(path.join(up, 'ko.srt'), srt(subs.map((c) => (c.who === 'narr' ? c.text : `“${c.text}”`))));
fs.writeFileSync(path.join(up, 'en.srt'), srt(en));

// 챕터 (첫 줄은 0:00, 각 10초 이상)
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const at = (n) => Math.max(0, tl.scenes[n].start - 0.5);
const chapters = [
  [0, '표지 · 숲속 마음카페에 오신 것을 환영해요', 'Cover · Welcome to the forest cafe'],
  [at(2), '나무늘보: 느려서 속상해요', 'Sloth: so slow, so upset'],
  [at(8), '사자: 다들 나를 피해요', 'Lion: everyone runs away'],
  [at(13), '고슴도치: 다 미워', 'Hedgehog: I hate everyone'],
  [at(17), '카멜레온: 이사가 무서워요', 'Chameleon: scared of moving'],
  [at(21), '사장님은 휴가 중', 'The owner is on vacation'],
  [at(23), '친구들이 만든 화채', 'The hwachae the friends made'],
  [at(25), '진짜 마법레시피', 'The real magic recipe'],
].map(([t, ko, e]) => ({ at: mmss(t), ko, en: e }));
fs.writeFileSync(path.join(up, 'chapters.json'), JSON.stringify(chapters, null, 1));

const KO_TITLE = '내 마음 알아주는 마법레시피 ‘마음카페’ | 엄마가 만든 동화 · 잠자리 동화 읽어주기';
const EN_TITLE = 'Maum Cafe: Magic Recipes for Your Heart | A Picture Book by Mom (Bedtime Story)';
const KO_DESC = `마음을 털어놓으면 마법레시피 동전이 생기는 숲속 작은 카페, 마음카페.
카피바라 바라 사장님은 나무늘보, 사자, 고슴도치, 카멜레온의 속상한 마음을 먼저 들어 주고, 마음마다 다른 맛의 디저트를 만들어 줍니다.
그런데 어느 날 사장님이 휴가를 떠나고, 카페 앞에서 토끼가 울고 있어요. 이번에는 친구들이 나설 차례!

엄마가 쓴 동화를 6분 동안 읽어 드려요. 잠자기 전, 아이와 함께 들어 보세요.
이야기 속 질문: 내 마음은 오늘 어떤 맛이었나요? 속상한 마음을 누가 들어 주면 어떤 기분이 들까요?

📖 챕터
${chapters.map((c) => `${c.at} ${c.ko}`).join('\n')}

✍️ 글: 김혜진 (엄마가 만든 동화)
🎨 그림 · 목소리 · 음악: AI 도구로 만들었어요 (그림: Gemini · 목소리: Gemini TTS · 배경음악과 효과음은 코드로 직접 합성)
🌐 자막: 한국어 · English

#엄마가만든동화 #잠자리동화 #어린이동화 #동화읽어주기 #그림책 #마음 #감정 #모라구`;
const EN_DESC = `Maum Cafe is a tiny forest cafe where sharing your feelings earns you a magic recipe coin. Bara the capybara owner listens first, then turns each feeling into a dessert with its own flavor, for a rushing sloth, a shy lion, a prickly hedgehog and a nervous chameleon.
Then one day the owner goes on vacation, and a little rabbit cries outside the door. This time it is the friends' turn to help!

A picture book written by a mom, read aloud in about six minutes. A gentle bedtime story to share with your child.
Something to talk about: what flavor was your heart today? How does it feel when someone listens to your upset feelings?

Chapters
${chapters.map((c) => `${c.at} ${c.en}`).join('\n')}

Story: Hyejin Kim (a picture book by Mom)
Art, voices and music: made with AI tools (art: Gemini, voices: Gemini TTS, music and sound effects synthesized in code)
Subtitles: Korean and English

#bedtimestory #kidsstory #picturebook #feelings #koreanstory`;
const TAGS = '엄마가 만든 동화,동화,잠자리 동화,어린이 동화,동화 읽어주기,그림책,마음카페,감정,마음,모라구,bedtime story,kids story,Korean picture book,feelings,emotions,';

const fence = '```';
const md = `# 마음카페 — 유튜브 업로드 자료 (모라구)

| 항목 | 값 |
|---|---|
| 채널 | 모라구 |
| 재생목록 | 엄마가 만든 동화 |
| 영상 | fairy/video/out/02-maum-cafe.mp4 (${mmss(tl.total)}) |
| 썸네일 | fairy/books/02-maum-cafe/upload/thumbnail.jpg (1280x720) |
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
console.log(`ko.srt · en.srt ${subs.length}줄 · 챕터 ${chapters.length}개 · 제목 ${KO_TITLE.length}/${EN_TITLE.length}자 · 설명 ${KO_DESC.length}자`);
console.log(chapters.map((c) => `${c.at} ${c.ko}`).join(' | '));
