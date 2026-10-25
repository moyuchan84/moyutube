// 03-lost-found 업로드 자료: ko.srt · chapters.json · meta.json · upload.md → books/03-lost-found/upload/
// 먼저 npm run prep -- 03-lost-found (timeline.json) 이 있어야 한다. 영어 자막은 만들지 않았다.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const up = path.join(here, '..', '..', 'books', '03-lost-found', 'upload');
const tl = JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'timeline.json'), 'utf8'));
if (tl.slug !== '03-lost-found') throw new Error('timeline.json 이 03-lost-found 가 아님: npm run prep -- 03-lost-found');
const subs = tl.scenes.flatMap((s) => s.subs);

const tc = (t) => {
  const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
fs.writeFileSync(path.join(up, 'ko.srt'), subs.map((c, i) => `${i + 1}\n${tc(c.from)} --> ${tc(Math.max(c.from + 0.4, c.to - 0.05))}\n${c.who === 'narr' ? c.text : `“${c.text}”`}\n`).join('\n'));

const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const at = (n) => Math.max(0, tl.scenes[n - 1].start - 0.5);
const chapters = [
  [0, '표지 · 분실물 보관함 할아버지'],
  [at(3), '물건들의 신기한 비밀: 빛'],
  [at(4), '동그라미 날의 무서운 소문'],
  [at(12), '낙서투성이 필통 통통이'],
  [at(17), '동그라미 날 아침'],
  [at(20), '분실물 패션쇼'],
  [at(24), '필통의 주인, 도윤이'],
  [at(27), '미안해, 그리고 고마워'],
  [at(28), '주인을 찾아간 물건들'],
].map(([t, ko]) => ({ at: mmss(t), ko }));
fs.writeFileSync(path.join(up, 'chapters.json'), JSON.stringify(chapters, null, 1));

const TITLE = '반짝! 분실물 보관함의 비밀 | 엄마가 만든 동화 · 잠자리 동화 읽어주기';
const DESC = `학교 1층 복도 구석, 주인을 잃어버린 물건들이 모여 있는 분실물 보관함. 이 물건들에게는 신기한 비밀이 있어요. 좋은 기억이 많을수록, 그 기억을 떠올릴수록 몸에서 반짝반짝 빛이 난다는 거예요.
그런데 밤마다 '동그라미 날에 수레가 오면 빛이 꺼진 애들부터 끌려간다'는 무서운 소문이 들려요. 낙서투성이 필통 통통이는 빛이 가장 흐릿한데, 과연 동그라미 날 아침에 무슨 일이 일어날까요?

엄마가 쓴 동화를 12분 동안 읽어 드려요. 잠자기 전, 아이와 함께 들어 보세요.
이야기 속 질문: 내 물건에게 마지막으로 고맙다고 한 적이 있나요? 함부로 대했던 물건이 있다면 어떤 마음일까요?

📖 챕터
${chapters.map((c) => `${c.at} ${c.ko}`).join('\n')}

✍️ 글: 김혜진 (엄마가 만든 동화)
🎨 그림 · 목소리 · 음악: AI 도구로 만들었어요 (그림: Gemini · 목소리: Gemini TTS · 배경음악과 효과음은 코드로 직접 합성)
🌐 자막: 한국어

#엄마가만든동화 #잠자리동화 #어린이동화 #동화읽어주기 #그림책 #물건소중함 #분실물 #모라구`;
const SHORT_TITLE = '버려질까 봐 빛을 잃은 필통 #shorts #동화 #잠자리동화';
const SHORT_DESC = `분실물 보관함의 낙서투성이 필통 통통이는 다시 빛날 수 있을까요?
전체 이야기는 '반짝! 분실물 보관함의 비밀' 영상에서 들어 보세요.

🎨 그림 · 목소리 · 음악: AI 도구로 만들었어요
#엄마가만든동화 #잠자리동화 #동화 #모라구`;
const TAGS = '엄마가 만든 동화,동화,잠자리 동화,어린이 동화,동화 읽어주기,그림책,분실물,물건 소중함,모라구,bedtime story,kids story,Korean picture book,';
fs.writeFileSync(path.join(up, 'meta.json'), JSON.stringify({ TITLE, DESC, SHORT_TITLE, SHORT_DESC, TAGS }, null, 1));
fs.writeFileSync(path.join(up, 'upload.md'), `# 반짝! 분실물 보관함의 비밀 — 유튜브 업로드 자료 (모라구)\n\n| 항목 | 값 |\n|---|---|\n| 채널 | 모라구 |\n| 재생목록 | 상담심리사 엄마의 인성동화책 |\n| 영상 | fairy/video/out/03-lost-found.mp4 (12:00) |\n| 쇼츠 | fairy/video/out/03-lost-found-short.mp4 (1:08) |\n| 썸네일 | upload/thumbnail.png |\n| 자막 | ko.srt (한국어만) |\n| 공개 상태 | 비공개 |\n| AI 사용 표시 | 예 |\n\n## 제목\n${TITLE}\n\n## 설명\n\`\`\`\n${DESC}\n\`\`\`\n\n## 태그\n${TAGS}\n\n## 쇼츠 제목\n${SHORT_TITLE}\n\n## 쇼츠 설명\n\`\`\`\n${SHORT_DESC}\n\`\`\`\n`);
console.log(chapters.map((c) => c.at + ' ' + c.ko).join('\n'));
