// 영어 자막 만들기: audio/<이름>.cues.json 의 caps(제목 · 자막 카드가 바뀐 시각)를 읽어 upload/<이름>.en.srt 로 쓴다.
//   node scripts/srt.mjs mulSwap
// 한국어 문장 → 영어 문장은 아래 EN 표에 둔다. 표에 없는 문장이 나오면 멈추고 알려 준다.
import fs from 'node:fs';
import path from 'node:path';

const EN = {
  // 공통 · 제목
  '3 × 4 랑 4 × 3|왜 똑같을까?': 'Why are 3 × 4 and 4 × 3\nthe same?',
  '13 × 12 세로셈,|왜 이렇게 할까?': 'Why does long multiplication\nfor 13 × 12 work?',
  '5² 은|10 일까, 25 일까?': 'Is 5² equal to\n10 or 25?',
  '홀수만 더하면|늘 제곱수가 된다?': 'Add up only odd numbers\nand you always get a square number?',
  '루트(√)는|제곱을 거꾸로!': 'A square root (√)\nis squaring backwards!',
  '넓이가 2 인 정사각형,|한 변은 몇?': 'A square with an area of 2 —\nhow long is each side?',
  // 1편
  '한 줄에 4개씩, 3줄': '4 in each row, 3 rows',
  '이제 통째로 돌려 볼게요': "Now let's turn the whole thing",
  '이번엔 한 줄에 3개씩, 4줄': 'Now 3 in each row, 4 rows',
  '돌리기만 했으니\n개수는 그대로!': 'We only turned it,\nso the count stays the same!',
  '점을 네모 칸으로 바꾸면?': 'What if we turn the dots into squares?',
  '곱셈 = 직사각형의 넓이': 'Multiplication = the area of a rectangle',
  '세워도 넓이는 똑같이 12칸': 'Stand it up — the area is still 12 squares',
  // 2편
  '13 × 12 는 가로 13, 세로 12\n직사각형의 넓이': '13 × 12 is the area of a rectangle\n13 wide and 12 tall',
  '10 이 있는 곳에서 잘라요': "Let's cut it at the 10s",
  '조각을 떼어 보면': 'Pull the pieces apart: 100 + 30 + 20 + 6 = 156',
  '이제 세로셈과 나란히 놓아 볼게요': "Now let's put it next to the long multiplication",
  '13 × 2 = 아래쪽 띠\n20 + 6 = 26': '13 × 2 = the bottom strip\n20 + 6 = 26',
  '13 × 10 = 위쪽 큰 덩어리\n100 + 30 = 130': '13 × 10 = the big top block\n100 + 30 = 130',
  '두 줄을 더하면 = 전체 넓이': 'Add the two lines = the whole area',
  '세로셈 한 줄 = 직사각형 한 띠!': 'Each line of long multiplication = one strip of the rectangle!',
  // 3편
  '작은 2 는 "같은 수를 두 번 곱해요"': 'The small 2 means\n"multiply the same number twice"',
  '5 × 2 로 착각하면 10칸': 'Mistake it for 5 × 2 and you get 10 squares',
  '진짜 5² 는 5 × 5 = 25칸!': 'The real 5² is 5 × 5 = 25 squares!',
  '한 변을 1 씩 늘려 볼까요?': "Let's make each side 1 longer at a time",
  '1, 4, 9, 16, 25 …\n늘 정사각형이 돼요': '1, 4, 9, 16, 25 …\nit always makes a square',
  '그래서 영어로도 square\n"정사각형"이라고 불러요': "That's why we call it\n\"squaring\"",
  // 4편
  '1 칸에서 시작해요': 'Start with 1 square',
  '다음 홀수 3 을 L자로 붙이면?': 'Add the next odd number, 3, as an L shape',
  '정사각형! 2 × 2 = 4': 'A square! 2 × 2 = 4',
  '5 를 붙이면 3 × 3 = 9': 'Add 5 and you get 3 × 3 = 9',
  'L자 하나 = 다음 홀수': 'Each L shape = the next odd number',
  '한 겹 두를 때마다\n정사각형이 한 칸씩 커져요': 'Every new layer\nmakes the square one bigger',
  '그럼 19 까지 더하면?': 'So what if we add all the way to 19?',
  '홀수 10 개를 더하면 100 = 10²': 'Add 10 odd numbers and you get 100 = 10²',
  // 5편
  '넓이가 25 인 정사각형': 'A square with an area of 25',
  '한 변의 길이는?': 'How long is each side?',
  '5 × 5 = 25 니까, 한 변은 5': 'Since 5 × 5 = 25, each side is 5 (√25 = 5)',
  '제곱: 한 변 → 넓이': 'Squaring: side → area',
  '루트: 넓이 → 한 변\n거꾸로 가는 길이에요': 'Square root: area → side\nIt goes the other way',
  '√ = 넓이를 보고 한 변 찾기': '√ = look at the area, find the side',
  '그럼 넓이가 2 인 정사각형은?': 'So what about a square with an area of 2?',
  // 6편
  '모눈 4 칸짜리 정사각형': 'A square made of 4 grid squares',
  '네 변의 가운데를 이어요': 'Connect the middles of the four sides',
  '모서리 4 개를 안으로 접으면?': 'What if we fold the 4 corners in?',
  '안쪽을 딱 채워요!\n안쪽 = 전체의 절반': 'They fill the inside exactly!\nInside = half of the whole',
  '4 의 절반 → 넓이 2': 'Half of 4 → an area of 2',
  '그래서 이 정사각형의 한 변이 √2': 'So each side of this square is √2',
  '√2 를 두 번 곱하면 2\n그런 수를 찾아볼까요?': '√2 times √2 is 2.\nLet\'s look for that number',
  '가까워지지만\n딱 2 는 절대 안 돼요': 'It gets closer,\nbut never exactly 2',
  '소수점 아래가 끝없이 이어지는 수': 'Its decimals go on forever: 1.41421356…',
  '곱셈은 넓이다, 끝!': 'Multiplication is area — the end!',
  // 과학 S1 맹점
  '왼쪽 눈을 손으로 가리고': 'Cover your left eye with your hand',
  '오른쪽 눈으로 십자(+)만 보세요': 'With your right eye, look only at the cross (+)',
  '얼굴을 화면 가까이 댔다가\n천천히 뒤로 물러나 보세요': 'Bring your face close to the screen,\nthen slowly move back',
  '눈은 계속 십자(+)만!': 'Keep your eye on the cross (+)!',
  '빨간 점이 감쪽같이 사라졌죠?': 'Did the red dot vanish?',
  '안 사라지면 거리를 조금씩 바꿔 보세요': "If not, try changing the distance a little",
  '눈을 위에서 잘라 보면': "Let's slice the eye and look from above",
  '안쪽 벽에 빛을 느끼는\n세포가 빽빽해요': 'The inner wall is packed\nwith cells that sense light',
  '세포의 신경은 한곳에 모여\n눈 밖으로 나가요': 'Their nerves gather in one spot\nand leave the eye',
  '십자(+)의 빛은 세포에 닿아요': 'Light from the cross (+) lands on cells',
  '빨간 점의 빛은\n하필 신경이 나가는 출구로': "Light from the red dot lands\nright on the nerve's exit",
  '여기엔 시세포가 없어서\n빛이 와도 못 느껴요': "There are no light-sensing cells here,\nso the light can't be felt",
  '이 자리가 바로 맹점!': 'This spot is the blind spot!',
  '그럼 평소엔 왜 몰랐을까?': "So why don't we normally notice?",
  '두 눈의 빈자리는 서로 달라서\n다른 눈이 가려 줘요': "Each eye's gap is in a different place,\nso the other eye covers it",
  '한쪽 눈만 뜨면?\n뇌가 주변 무늬로 메워요': 'With one eye open?\nYour brain fills it in with the surroundings',
  '누구나 두 눈에 하나씩 있어요': 'Everyone has one in each eye',
  // 과학 S2 잔상
  '세 빛을 합치면 흰빛': 'Mix the three lights and you get white',
  '빨간 동그라미 가운데 점을\n15초 동안 보세요': 'Stare at the dot in the middle\nof the red circle for 15 seconds',
  '그다음 흰 화면을 보면…': 'Then look at a white screen…',
  '가운데 점에서 눈을 떼지 마세요': "Don't take your eyes off the center dot",
  '조금만 더!': 'Just a little longer!',
  '무엇이 보이나요?': 'What do you see?',
  '청록색 동그라미가 떠올라요!': 'A cyan circle appears!',
  '눈 속엔 색을 느끼는\n세포가 세 종류 있어요': 'Your eye has three kinds\nof color-sensing cells',
  '빨강만 오래 보면\n빨강 세포만 계속 일해요': 'Stare at red for a long time\nand only the red cells keep working',
  '흰빛 = 빨강 + 초록 + 파랑\n그런데 빨강 세포는 지쳐서…': 'White light = red + green + blue\nbut the red cells are tired…',
  '초록 + 파랑만 남아서\n청록이 보여요!': 'Only green + blue are left,\nso you see cyan!',
  '다른 색도 반대색이 떠올라요': 'Other colors show their opposite color too',
  '잠깐 쉬면 세포가 회복해서\n금방 사라져요': 'After a short rest the cells recover\nand it fades away',
  // 과학 S6 운동 잔상
  '소용돌이 가운데 점을\n20초 동안 보세요': 'Stare at the dot in the middle\nof the spiral for 20 seconds',
  '끝나면 손바닥 그림 → 진짜 손바닥': 'Then look at the hand picture → your real hand',
  '어지러우면 바로 멈추세요': 'Stop right away if you feel dizzy',
  '끝나도 계속 가운데를 보세요': 'Keep looking at the center when it ends',
  '손바닥이 부풀어 꿈틀대죠?': 'Is the hand swelling and wriggling?',
  '이제 진짜 내 손바닥을 봐요!': 'Now look at your real hand!',
  '움직임을 알아채는 세포는\n두 팀이 줄다리기를 해요': 'Motion-sensing cells are two teams\nplaying tug of war',
  '힘이 같으면\n멈춘 건 멈춰 보여요': 'When they pull equally,\nstill things look still',
  "안으로 도는 걸 20초 보면\n'안으로' 팀이 지쳐요": 'Watch inward motion for 20 seconds\nand the "inward" team gets tired',
  "멈춘 걸 보면 '바깥으로' 팀이 이겨서": 'So when you look at something still,\nthe "outward" team wins — it seems to swell!',
  '폭포를 오래 보다가 바위를 보면?': 'Stare at a waterfall, then look at a rock…',
  '바위가 위로 올라가 보여요\n그래서 이름이 폭포 착시!': 'The rock seems to move up —\nthat is the waterfall illusion!',
  '잠깐 지나면 금방 돌아와요': 'It goes back to normal in a moment',
  // 과학 S7 흑백이 컬러로
  '색이 뒤집힌 그림의 가운데 점을\n20초 동안 보세요': 'Stare at the dot in the middle\nof the color-flipped picture for 20 seconds',
  '그다음 흑백 그림이 나와요': 'Then a black-and-white picture appears',
  '끝나도 계속 가운데 점!': 'Keep looking at the center dot when it ends!',
  '흑백 그림인데 색이 보이죠?': "It's black and white, but do you see colors?",
  '이 색이 보였나요?': 'Did you see these colors?',
  '주황빛 하늘을 오래 보면\n주황에 지친 세포 때문에': 'Stare at an orange sky for a long time\nand the orange-tired cells…',
  '흑백 하늘에 파랑이 칠해져요\n풀밭 · 지붕도 반대로!': 'paint the gray sky blue —\nthe grass and roof flip too!',
  '흑백 그림은 밝고 어두움을\n잔상은 색을 맡아요': 'The gray picture gives light and dark,\nthe afterimage gives color',
  '둘이 합쳐져서\n컬러 그림처럼 보여요!': 'Together they look\nlike a color picture!',
  '잔상 편의 원리를 그림 전체에!': 'The afterimage trick, on a whole picture!',
  // 분수는 조각이다 1편 (fracAdd)
  '1/2 + 1/3 은|왜 2/5 가 아닐까?': "Why isn't 1/2 + 1/3\nequal to 2/5?",
  '1/2 + 1/3 을 막대로 그려 봐요': "Let's draw 1/2 + 1/3 as bars",
  '위끼리, 아래끼리 더하면\n2/5 일까?': 'Add the tops and the bottoms —\nis it 2/5?',
  '1/2 자리에 선을 그어 보면…': "Let's draw a line at 1/2…",
  '어? 1/2 보다 작아요!': "Huh? It's smaller than 1/2!",
  '더했는데 줄어들 순 없죠\n2/5 는 틀린 답': "Adding can't make it smaller —\n2/5 is wrong",
  '1/2 조각과 1/3 조각은\n크기가 달라요': 'A 1/2 piece and a 1/3 piece\nare different sizes',
  '크기가 다른 조각은\n그대로 세면 안 돼요': "You can't just count pieces\nof different sizes",
  '둘 다 6조각으로 다시 잘라요': 'Cut both into 6 pieces',
  '1/2 = 3/6, 1/3 = 2/6\n이제 조각 크기가 같아요': '1/2 = 3/6, 1/3 = 2/6\nNow the pieces are the same size',
  '같은 크기 조각끼리 모으면': 'Put the same-size pieces together: 3/6 + 2/6 = 5/6',
  '조각 크기를 먼저 맞추기\n이걸 "통분"이라고 해요': 'Make the pieces the same size first —\nthat is finding a common denominator',
  // 분수는 조각이다 2편 (fracDiv)
  '분수로 나누면|왜 뒤집어 곱할까?': 'Why do we flip and multiply\nwhen dividing by a fraction?',
  '6 ÷ 2 는\n"6 안에 2 가 몇 번 들어갈까?"': '6 ÷ 2 means\n"how many 2s fit in 6?"',
  '이번엔 끈 2m 를\n1/3m 씩 자르면 몇 도막?': 'Now cut a 2 m string\ninto 1/3 m pieces — how many?',
  '1m 안에 1/3 이 3번': '1/3 fits into 1 m 3 times',
  '2m 니까 3번씩 두 번\n2 × 3 = 6': 'For 2 m, that is 3 times, twice:\n2 × 3 = 6',
  '1/3 로 나누기 = 3 곱하기!': 'Dividing by 1/3 = multiplying by 3!',
  '그럼 2/3m 씩 자르면?': 'What about 2/3 m pieces?',
  '도막이 2배 길어져서\n횟수는 절반: 6 ÷ 2 = 3': 'Each piece is twice as long,\nso half as many: 6 ÷ 2 = 3',
  '× 3 을 하고 ÷ 2 를 한 것\n= × 3/2': 'That is × 3 and then ÷ 2\n= × 3/2',
  '그래서 분수로 나눌 땐': 'So when you divide by a fraction',
  '뒤집어서 곱해요!': 'flip it and multiply!',
  '"몇 번 들어갈까?"를\n한 번에 세는 방법이에요': 'It is a shortcut for counting\n"how many times does it fit?"',
  // 넓이의 단위 (unitArea)
  '1m² 는|왜 100cm² 가 아닐까?': "Why isn't 1 m²\nequal to 100 cm²?",
  '길이는 1m = 100cm': 'For length, 1 m = 100 cm',
  '1m² 는 한 변이 1m 인\n정사각형의 넓이': '1 m² is the area of a square\nwith 1 m sides',
  '1cm² 는 한 변이 1cm 인\n아주 작은 정사각형': '1 cm² is a tiny square\nwith 1 cm sides',
  '1cm² 가 한 줄에 몇 개?': 'How many cm² fit in one row?',
  '100cm² 는 겨우 이 한 줄!': '100 cm² is just this one row!',
  '그런 줄이 아래로 100줄!': 'And there are 100 rows like that!',
  '1m² = 10000cm²!': '1 m² = 10,000 cm²!',
  '넓이는 가로도 100배, 세로도 100배\n그래서 100 × 100 배': 'Area grows 100 times across and 100 times down,\nso 100 × 100 times',
};

const NEXT = {
  mulSwap: 'NEXT: Why does long multiplication for 13 × 12 work?',
  mulColumn: 'NEXT: Is 5² equal to 10 or 25?',
  mulSquare: 'NEXT: Why do odd numbers add up to square numbers?',
  mulOdd: 'NEXT: A square root (√) is squaring backwards!',
  mulRoot: 'NEXT: A square with an area of 2 — how long is each side?',
  blindSpot: 'NEXT: Stare at red, then look at a white wall…',
  afterImage: 'NEXT: Why is summer hot?',
  motionAfter: 'NEXT: A black-and-white picture in color?',
  grayColor: 'NEXT: Stare at the center and the dots disappear?',
  fracAdd: 'NEXT: Why do we flip and multiply when dividing by a fraction?',
  fracDiv: "NEXT: Why isn't 1 m² equal to 100 cm²?",
  unitArea: 'Remember: 1 m² = 10,000 cm² (not 100 cm²)',
};

// 글리치 제목처럼 caps 에 안 남는 첫 제목 (0초 ~ 첫 자막)
const TITLE = {
  blindSpot: 'Is there a hole in your eye?',
  afterImage: 'Stare at red, then look at a white wall…',
  motionAfter: 'Stare for 20 seconds and your hand wriggles?',
  grayColor: 'A black-and-white picture in color?',
};

const name = process.argv[2];
// 새 편은 번역을 scripts/en/<이름>.json ({EN, NEXT, TITLE}) 에 따로 둔다
const extra = path.resolve('scripts', 'en', `${name}.json`);
if (fs.existsSync(extra)) {
  const j = JSON.parse(fs.readFileSync(extra, 'utf8'));
  Object.assign(EN, j.EN ?? {});
  if (j.NEXT) NEXT[name] = j.NEXT;
  if (j.TITLE) TITLE[name] = j.TITLE;
}
const {duration, caps} = JSON.parse(fs.readFileSync(path.resolve('audio', `${name}.cues.json`), 'utf8'));
if (!caps?.length) throw new Error('caps 가 없다 — 편집기에서 장면을 다시 열 것');

const missing = caps.filter(c => c.text && !(c.text in EN) && c.kind !== 'end');
if (missing.length) {
  console.error('번역 없음:', missing.map(m => JSON.stringify(m.text)).join(', '));
  process.exit(1);
}

const ts = s => {
  const ms = Math.max(0, Math.round(s * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const lines = [];
if (TITLE[name]) lines.push({from: 0, to: Math.max(0.8, caps[0].t - 0.05), text: TITLE[name]});
caps.forEach((c, i) => {
  const until = i + 1 < caps.length ? caps[i + 1].t : duration;
  const text = c.kind === 'end' ? NEXT[name] : c.kind === 'hide' ? null : EN[c.text];
  if (!text) return;
  lines.push({from: c.t, to: Math.max(c.t + 0.8, until - 0.05), text});
});
const srt = lines.map((l, i) => `${i + 1}\n${ts(l.from)} --> ${ts(l.to)}\n${l.text}\n`).join('\n');
fs.writeFileSync(path.resolve('upload', `${name}.en.srt`), srt);
console.log(`upload/${name}.en.srt — ${lines.length}줄`);
