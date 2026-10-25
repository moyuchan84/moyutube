import {Circle, Gradient, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  SimpleSignal,
  Vector2,
  all,
  createRef,
  createSignal,
  delay,
  easeInOutExpo,
  easeOutBack,
  easeOutExpo,
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {FONT} from '../style';
import {
  C,
  addAtmosphere,
  addCaption,
  addEnd,
  addFlash,
  addHud,
  addWipe,
  begin,
  bigCard,
  camTo,
  cue,
  finish,
  popIn,
  popOut,
  punch,
  ring,
  shine,
  sparks,
} from '../motion';
import {Plus, addBokeh, addGlitchTitle, addIris, arrive, shake, streak, zoomInto} from '../fx';

// 과학 시즌 S1 — 내 눈엔 구멍이 있다 (맹점)
// 1) 화면 테스트: 왼쪽 눈 가리고 십자를 보면 빨간 점이 사라진다
// 2) 눈을 위에서 자른 그림: 시세포의 신경이 모여 나가는 출구(시신경)에는 시세포가 없다 → 맹점
// 3) 평소엔 두 눈이 서로 가려 주고, 뇌가 주변 무늬로 메운다

const NAME = 'blindSpot';
const RED = '#FF4D6D';

/* ───────── 큰 눈 그림 (아몬드 모양 눈꺼풀이 열리고 닫힌다) ───────── */

const EW = 330;
const EH = 200;
function almond(open: number): [number, number][] {
  const pts: [number, number][] = [];
  const N = 36;
  for (let i = 0; i <= N; i++) {
    const u = -1 + (2 * i) / N;
    pts.push([u * EW, -EH * open * Math.pow(1 - u * u, 0.7)]);
  }
  for (let i = N - 1; i >= 1; i--) {
    const u = -1 + (2 * i) / N;
    pts.push([u * EW, 0.8 * EH * open * Math.pow(1 - u * u, 0.7)]);
  }
  return pts;
}

function EyeArt(o: {open: SimpleSignal<number>; look: SimpleSignal<number>; pupil: SimpleSignal<number>}) {
  return (
    <>
      <Line points={() => almond(o.open())} closed clip fill={'#E9ECFA'}>
        <Circle
          x={o.look}
          y={-10}
          size={250}
          fill={
            new Gradient({
              type: 'radial',
              from: [0, 0],
              to: [0, 0],
              fromRadius: 0,
              toRadius: 125,
              stops: [
                {offset: 0, color: '#7CF5E2'},
                {offset: 0.55, color: C.teal},
                {offset: 0.85, color: '#3A5BD9'},
                {offset: 1, color: '#1A2260'},
              ],
            })
          }
        />
        <Circle x={o.look} y={-10} size={o.pupil} fill={'#05060C'} />
        <Circle x={() => o.look() + 42} y={-58} size={46} fill={'#ffffffdd'} />
        <Circle x={() => o.look() - 30} y={30} size={18} fill={'#ffffff88'} />
      </Line>
      <Line
        points={() => almond(o.open())}
        closed
        stroke={C.ink}
        lineWidth={9}
        shadowColor={C.teal}
        shadowBlur={30}
      />
    </>
  );
}

/* ───────── 눈 단면 (위에서 본 오른쪽 눈) — 장면 좌표 ───────── */

const R = 250; // 눈알 반지름
const NODAL = new Vector2(0, -170); // 빛이 꺾이지 않고 지나는 점 (수정체 바로 뒤)
const CROSS = new Vector2(0, -520);
const DOT = new Vector2(200, -520);
// 빨간 점의 빛이 망막에 닿는 곳 = 시신경 출구
const dir = NODAL.sub(DOT).normalized;
const bq = NODAL.dot(dir);
const hitT = -bq + Math.sqrt(bq * bq - (NODAL.squaredMagnitude - R * R));
const P = NODAL.add(dir.scale(hitT));
const PA = (Math.atan2(P.y, P.x) * 180) / Math.PI; // 약 137°
const polar = (r: number, deg: number): [number, number] => [
  r * Math.cos((deg * Math.PI) / 180),
  r * Math.sin((deg * Math.PI) / 180),
];
const CELL_ANGLES: number[] = [];
for (let a = 14; a <= 166; a += 4) if (Math.abs(a - PA) > 7) CELL_ANGLES.push(a);
const OUT = P.normalized;
const Q = P.add(OUT.scale(170));

export default makeScene2D(function* (view) {
  begin();
  const atmo = addAtmosphere(view, C.teal);
  yield atmo.drift();
  const bokeh = addBokeh(view);
  yield bokeh.drift();

  const dim = createRef<Rect>();
  view.add(<Rect ref={dim} width={1080} height={1920} fill={'#03040A'} opacity={0} />);

  /* 0. 훅: 큰 눈 */
  const eyeN = createRef<Node>();
  const open0 = createSignal(0);
  const look0 = createSignal(0);
  const pupil0 = createSignal(110);
  view.add(
    <Node ref={eyeN} y={190}>
      <EyeArt open={open0} look={look0} pupil={pupil0} />
    </Node>,
  );

  /* 1. 준비: 왼쪽 눈 감기 · 오른쪽 눈으로 십자 보기 */
  const setupN = createRef<Node>();
  const openL = createSignal(1);
  const openR = createSignal(1);
  const lookL = createSignal(0);
  const lookR = createSignal(0);
  const pupL = createSignal(100);
  const pupR = createSignal(100);
  const badge = createRef<Rect>();
  const tagL = createRef<Txt>();
  const tagR = createRef<Txt>();
  view.add(
    <Node ref={setupN} opacity={0}>
      <Rect
        ref={badge}
        y={-500}
        layout
        padding={[12, 30]}
        radius={999}
        fill={RED + '22'}
        stroke={RED}
        lineWidth={3}
        shadowColor={RED}
        shadowBlur={24}
      >
        <Txt text={'10초 테스트'} fontFamily={FONT} fontSize={40} fontWeight={900} letterSpacing={4} fill={C.ink} />
      </Rect>
      <Node x={-235} y={-250} scale={0.42}>
        <EyeArt open={openL} look={lookL} pupil={pupL} />
      </Node>
      <Node x={235} y={-250} scale={0.42}>
        <EyeArt open={openR} look={lookR} pupil={pupR} />
      </Node>
      <Txt ref={tagL} x={-235} y={-110} text={'왼쪽 눈'} fontFamily={FONT} fontSize={44} fontWeight={800} fill={C.dim} />
      <Txt ref={tagR} x={235} y={-110} text={'오른쪽 눈'} fontFamily={FONT} fontSize={44} fontWeight={800} fill={C.dim} />
    </Node>,
  );

  /* 2. 테스트 화면: 십자 · 빨간 점 (테스트 동안 이 둘레는 움직이지 않는다) */
  const test = createRef<Node>();
  const dot = createRef<Circle>();
  const timerN = createRef<Rect>();
  const count = createSignal(10);
  view.add(
    <Node ref={test} y={-150} opacity={0}>
      <Rect width={1020} height={440} radius={44} fill={'#ffffff07'} stroke={'#ffffff1a'} lineWidth={2} />
      <Plus x={-400} size={84} thick={16} />
      <Circle ref={dot} x={380} size={92} fill={RED} shadowColor={RED} shadowBlur={18} />
    </Node>,
  );
  view.add(
    <Rect
      ref={timerN}
      y={-640}
      layout
      direction="row"
      alignItems="center"
      gap={18}
      padding={[10, 28]}
      radius={999}
      fill={'#ffffff10'}
      stroke={'#ffffff26'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'TEST'} fontFamily={FONT} fontSize={30} fontWeight={900} letterSpacing={6} fill={RED} />
      <Txt
        text={() => String(Math.max(0, Math.ceil(count())))}
        fontFamily={FONT}
        fontSize={52}
        fontWeight={900}
        fill={C.ink}
      />
    </Rect>,
  );

  /* 3. 눈 단면 */
  const stage = createRef<Node>();
  const ball = createRef<Circle>();
  const front = createRef<Node>();
  const cells: Line[] = [];
  const fibers: Circle[] = [];
  const flow = createSignal(0);
  const nerve = createRef<Line>();
  const nerveCore = createRef<Line>();
  const nerveTag = createRef<Txt>();
  const cellTag = createRef<Txt>();
  const objs = createRef<Node>();
  const rayA = createRef<Line>();
  const rayB = createRef<Line>();
  const seen = createRef<Txt>();
  const huh = createRef<Txt>();
  const blindTag = createRef<Rect>();
  const sideTag = createRef<Txt>();
  view.add(
    <Node ref={stage} y={-20} opacity={0}>
      <Circle ref={ball} size={2 * R} fill={'#ffffff08'} stroke={'#ffffffaa'} lineWidth={6} end={0} />
      <Node ref={front} opacity={0}>
        {/* 각막 · 홍채 · 수정체 */}
        <Circle size={280} y={-140} startAngle={228} endAngle={312} stroke={'#ffffffaa'} lineWidth={6} />
        <Line points={[[-118, -214], [-42, -214]]} stroke={'#3A5BD9'} lineWidth={14} lineCap={'round'} />
        <Line points={[[42, -214], [118, -214]]} stroke={'#3A5BD9'} lineWidth={14} lineCap={'round'} />
        <Circle y={-188} width={118} height={46} fill={C.teal + '33'} stroke={C.teal} lineWidth={4} />
      </Node>
      {/* 신경 섬유: 세포마다 나온 신경이 안쪽 벽을 따라 한곳으로 모인다 */}
      {[R - 42, R - 52].flatMap(r => [
        <Circle
          ref={el => fibers.push(el)}
          size={2 * r}
          startAngle={14}
          endAngle={PA}
          stroke={C.violet}
          lineWidth={4}
          lineDash={[18, 12]}
          lineDashOffset={() => -flow()}
          end={0}
        />,
        <Circle
          ref={el => fibers.push(el)}
          size={2 * r}
          startAngle={166}
          endAngle={PA}
          counterclockwise
          stroke={C.violet}
          lineWidth={4}
          lineDash={[18, 12]}
          lineDashOffset={() => -flow()}
          end={0}
        />,
      ])}
      <Line
        ref={nerve}
        points={[P.add(OUT.scale(-52)), P, Q]}
        stroke={C.violet + '55'}
        lineWidth={46}
        lineCap={'round'}
        end={0}
      />
      <Line
        ref={nerveCore}
        points={[P.add(OUT.scale(-52)), P, Q]}
        stroke={C.violet}
        lineWidth={10}
        lineCap={'round'}
        lineDash={[18, 12]}
        lineDashOffset={() => -flow()}
        shadowColor={C.violet}
        shadowBlur={20}
        end={0}
      />
      {/* 시세포 */}
      {CELL_ANGLES.map(a => (
        <Line
          ref={el => cells.push(el)}
          points={[polar(R - 6, a), polar(R - 30, a)]}
          stroke={C.teal}
          lineWidth={7}
          lineCap={'round'}
          shadowColor={C.teal}
          shadowBlur={12}
          end={0}
        />
      ))}
      <Txt
        ref={cellTag}
        x={370}
        y={170}
        text={'시세포'}
        fontFamily={FONT}
        fontSize={46}
        fontWeight={900}
        fill={C.teal}
        opacity={0}
      />
      <Txt
        ref={nerveTag}
        x={Q.x - 20}
        y={Q.y + 56}
        text={'시신경 → 뇌'}
        fontFamily={FONT}
        fontSize={42}
        fontWeight={900}
        fill={C.violet}
        opacity={0}
      />
      {/* 눈 앞의 십자 · 빨간 점, 그리고 빛 */}
      <Node ref={objs} opacity={0}>
        <Plus x={CROSS.x} y={CROSS.y} size={56} thick={12} />
        <Circle position={DOT} size={50} fill={RED} shadowColor={RED} shadowBlur={16} />
      </Node>
      <Line
        ref={rayA}
        points={[CROSS.add([0, 44]), [0, R - 32]]}
        stroke={C.amber}
        lineWidth={6}
        shadowColor={C.amber}
        shadowBlur={18}
        end={0}
      />
      <Line
        ref={rayB}
        points={[DOT.add(dir.scale(34)), NODAL, P]}
        stroke={RED}
        lineWidth={6}
        shadowColor={RED}
        shadowBlur={18}
        end={0}
      />
      <Txt
        ref={seen}
        y={R + 60}
        text={'보여요!'}
        fontFamily={FONT}
        fontSize={46}
        fontWeight={900}
        fill={C.amber}
        opacity={0}
      />
      <Txt
        ref={huh}
        position={P.add(OUT.scale(-95)).add([10, -20])}
        text={'?'}
        fontFamily={FONT}
        fontSize={72}
        fontWeight={900}
        fill={RED}
        shadowColor={RED}
        shadowBlur={20}
        opacity={0}
      />
      <Rect
        ref={blindTag}
        position={P.add(OUT.scale(-96)).add([22, -48])}
        layout
        padding={[6, 18]}
        radius={14}
        fill={C.pink}
        shadowColor={C.pink}
        shadowBlur={24}
        opacity={0}
      >
        <Txt text={'맹점'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={'#1A0610'} />
      </Rect>
      <Txt
        ref={sideTag}
        y={-330}
        x={-300}
        text={'위에서 본\n오른쪽 눈'}
        fontFamily={FONT}
        fontSize={36}
        fontWeight={800}
        lineHeight={48}
        textAlign={'center'}
        fill={C.dim}
        opacity={0}
      />
    </Node>,
  );

  /* 4. 평소엔 왜 몰랐을까: 두 눈의 시야가 겹친다 → 뇌가 메운다 */
  const fieldsN = createRef<Node>();
  const fieldR = createRef<Node>();
  const fieldL = createRef<Node>();
  const holeR = createRef<Circle>();
  const holeL = createRef<Circle>();
  const FY = -250;
  view.add(
    <Node ref={fieldsN} y={FY} opacity={0}>
      <Node ref={fieldL} x={-900}>
        <Circle size={680} fill={C.violet + '30'} stroke={C.violet} lineWidth={4} />
        <Txt y={-230} x={-60} text={'왼쪽 눈'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.violet} />
      </Node>
      <Node ref={fieldR} x={90} opacity={0}>
        <Circle size={680} fill={C.teal + '30'} stroke={C.teal} lineWidth={4} />
        <Txt y={-230} x={60} text={'오른쪽 눈'} fontFamily={FONT} fontSize={40} fontWeight={900} fill={C.teal} />
      </Node>
      <Circle ref={holeR} x={220} size={110} fill={'#05060C'} stroke={RED} lineWidth={4} lineDash={[10, 8]} opacity={0} />
      <Circle ref={holeL} x={-220} size={110} fill={'#05060C'} stroke={RED} lineWidth={4} lineDash={[10, 8]} opacity={0} />
      <Plus size={44} thick={10} />
    </Node>,
  );
  const fillN = createRef<Rect>();
  const fillHole = createRef<Circle>();
  view.add(
    <Rect ref={fillN} y={FY} width={820} height={560} radius={40} clip opacity={0} stroke={'#ffffff33'} lineWidth={3}>
      {Array.from({length: 22}, (_, i) => (
        <Rect
          x={-1000 + i * 92}
          width={46}
          height={1600}
          rotation={24}
          fill={i % 2 ? C.amber + 'cc' : C.violet + 'cc'}
        />
      ))}
      <Circle ref={fillHole} x={160} size={150} fill={'#05060C'} stroke={RED} lineWidth={4} lineDash={[10, 8]} />
    </Rect>,
  );

  /* 5. 정리 */
  const card = bigCard('맹점 = 시신경이 나가는 출구', C.pink, 60);
  card.y(-420);
  view.add(card);

  const title = addGlitchTitle(view, ['내 눈엔', '구멍이 있다?'], {y: -430, accent: C.pink});
  const cap = addCaption(view);
  const end = addEnd(view);
  const flash = addFlash(view);
  const hud = addHud(view, {ep: 1, total: 2, series: '눈의 비밀', brand: '보면 풀리는 과학'});
  const iris = addIris(view, C.bg0, RED);
  const wipe = addWipe(view);

  /* ═════════ 0. 훅 ═════════ */
  yield* all(
    hud.show(),
    open0(1, 0.7, easeOutBack),
    title.hero(),
    look0(-70, 0.5, easeInOutExpo).to(70, 0.6, easeInOutExpo).to(0, 0.4, easeInOutExpo),
  );
  // 깜빡
  yield* open0(0.04, 0.12).to(1, 0.2, easeOutExpo);
  yield* all(title.dock(), pupil0(210, 0.7, easeInOutExpo));
  yield* zoomInto(eyeN(), [0, 190], 16, 0.65);
  eyeN().remove();

  /* ═════════ 1. 준비 ═════════ */
  yield* all(arrive(setupN(), 0.8), streak(view, '#ffffff', -250));
  yield* popIn(badge(), 0.5, 0.6);
  cue('swish');
  yield* all(cap.say('준비', '왼쪽 눈을 손으로 가리고', C.violet), openL(0.04, 0.45, easeInOutExpo), tagL().fill(C.violet, 0.3));
  yield* waitFor(0.6);
  cue('pop');
  yield* all(cap.say('준비', '오른쪽 눈으로 십자(+)만 보세요', C.teal), lookR(-60, 0.5, easeInOutExpo), tagR().fill(C.teal, 0.3));
  yield* waitFor(0.9);

  /* ═════════ 2. 테스트 ═════════ */
  yield* iris.cover([235, -250]);
  setupN().opacity(0);
  title.group().opacity(0);
  test().opacity(1);
  dim().opacity(0.55);
  timerN().opacity(1);
  yield* iris.reveal([-400, -150]);
  yield* cap.say('TEST', '얼굴을 화면 가까이 댔다가\n천천히 뒤로 물러나 보세요', RED);
  for (let k = 10; k >= 1; k--) {
    count(k);
    cue('tick');
    if (k === 5) yield* all(cap.say('TEST', '눈은 계속 십자(+)만!', RED), waitFor(1));
    else yield* waitFor(1);
  }
  count(0);
  cue('chime');
  yield* all(popOut(timerN(), 0.3), cap.say('!', '빨간 점이 감쪽같이 사라졌죠?', C.pink));
  yield* all(ring(test(), [380, 0], RED, 150), punch(dot(), 0.25, 0.4));
  yield* waitFor(1.1);
  yield* cap.say('!', '안 사라지면 거리를 조금씩 바꿔 보세요', C.dim);
  yield* waitFor(1.0);

  /* ═════════ 3. 눈 속으로 ═════════ */
  cue('riser');
  yield* all(zoomInto(test(), [380, -150], 12, 0.7), dim().opacity(0, 0.7));
  yield flow(4000, 60, linear);
  title.group().opacity(0);
  yield* all(arrive(stage(), 0.8, 1.6), title.group().opacity(1, 0.6), cap.say('03', '눈을 위에서 잘라 보면', C.amber));
  yield* all(ball().end(1, 0.9, easeInOutExpo), delay(0.3, all(front().opacity(1, 0.5), sideTag().opacity(1, 0.5))));

  cue('pop');
  yield* all(
    cap.say('04', '안쪽 벽에 빛을 느끼는\n세포가 빽빽해요', C.teal),
    sequence(0.025, ...cells.map(c => c.end(1, 0.3, easeOutExpo))),
    delay(0.5, popIn(cellTag(), 0.4)),
  );
  yield* waitFor(0.5);

  cue('whoosh');
  yield* all(
    cap.say('05', '세포의 신경은 한곳에 모여\n눈 밖으로 나가요', C.violet),
    ...fibers.map(f => f.end(1, 1.0, easeInOutExpo)),
    delay(0.8, all(nerve().end(1, 0.6, easeOutExpo), nerveCore().end(1, 0.6, easeOutExpo))),
    delay(1.1, popIn(nerveTag(), 0.4)),
  );
  yield* waitFor(0.8);

  // 빛 두 줄기
  yield* all(objs().opacity(1, 0.4), cellTag().opacity(0, 0.3), sideTag().opacity(0, 0.3));
  cue('swish');
  yield* all(cap.say('06', '십자(+)의 빛은 세포에 닿아요', C.amber), rayA().end(1, 0.7, easeInOutExpo));
  const near = cells.filter((_, i) => Math.abs(CELL_ANGLES[i] - 90) <= 10);
  cue('pop');
  yield* all(
    ...near.map(c => all(c.stroke(C.amber, 0.2), c.shadowColor(C.amber, 0.2))),
    sparks(stage(), [0, R - 24], C.amber, 12, 110),
    popIn(seen(), 0.4),
  );
  yield* waitFor(0.6);

  cue('swish');
  yield* all(cap.say('07', '빨간 점의 빛은\n하필 신경이 나가는 출구로', RED), rayB().end(1, 0.9, easeInOutExpo));
  cue('tick');
  yield* all(ring(stage(), [P.x, P.y], RED, 90), popIn(huh(), 0.4));
  yield* waitFor(0.5);

  // 출구 확대
  yield* all(
    camTo(stage(), 1.8, [40 - 1.8 * P.x, 0 - 1.8 * P.y], 1.0),
    seen().opacity(0, 0.3),
    nerveTag().opacity(0, 0.3),
    title.group().opacity(0, 0.5),
  );
  yield* cap.say('08', '여기엔 시세포가 없어서\n빛이 와도 못 느껴요', C.coral);
  yield* waitFor(1.0);
  cue('boom');
  yield* all(huh().opacity(0, 0.2), popIn(blindTag(), 0.45, 0.3), flash(0.14), shake(stage(), 18, 0.4));
  yield* all(cap.say('맹점', '이 자리가 바로 맹점!', C.pink), sparks(stage(), [P.x, P.y], C.pink, 14, 120));
  yield* waitFor(1.4);

  /* ═════════ 4. 평소엔 왜 몰랐을까 ═════════ */
  yield* wipe.cover();
  stage().opacity(0);
  fieldsN().opacity(1);
  title.group().opacity(1);
  yield* wipe.reveal();
  cue('pop');
  yield* all(cap.say('09', '그럼 평소엔 왜 몰랐을까?', C.amber), popIn(fieldR(), 0.5, 0.7));
  yield* popIn(holeR(), 0.4, 0.4);
  yield* waitFor(0.5);
  cue('whoosh');
  yield* all(fieldL().x(-90, 0.8, easeOutExpo), delay(0.3, popIn(holeL(), 0.4, 0.4)));
  yield* cap.say('10', '두 눈의 빈자리는 서로 달라서\n다른 눈이 가려 줘요', C.teal);
  cue('chime');
  yield* all(
    holeR().opacity(0, 0.6),
    holeL().opacity(0, 0.6),
    ring(fieldsN(), [220, 0], C.violet, 110),
    ring(fieldsN(), [-220, 0], C.teal, 110),
  );
  yield* waitFor(0.8);

  yield* all(fieldsN().opacity(0, 0.4), fieldsN().scale(0.9, 0.4));
  yield* all(cap.say('11', '한쪽 눈만 뜨면?\n뇌가 주변 무늬로 메워요', C.violet), popIn(fillN(), 0.5, 0.85));
  yield* waitFor(0.5);
  cue('riser');
  yield* fillHole().size(0, 1.2, easeInOutExpo);
  cue('chime');
  yield* all(sparks(fillN(), [160, 0], C.amber, 14, 160), streak(view, '#ffffff', FY));
  yield* waitFor(0.9);

  /* ═════════ 5. 정리 ═════════ */
  yield* iris.cover([160, FY]);
  fillN().opacity(0);
  yield* iris.reveal([0, -420]);
  cue('pop');
  yield* all(popIn(card, 0.55), cap.say('정리', '누구나 두 눈에 하나씩 있어요', C.pink));
  yield* shine(card);
  yield* waitFor(0.9);
  yield* all(cap.hide(), end.show('NEXT  눈의 비밀 2', '빨강을 보다가\n흰 벽을 보면?'));
  yield* waitFor(2.4);
  yield* finish(NAME, 0.6);
});

