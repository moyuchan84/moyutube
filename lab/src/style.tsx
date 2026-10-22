import {Circle, Gradient, Grid, Latex, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic} from '@motion-canvas/core';

// 어두운 칠판 + 발광 강조색. 쇼츠 화면 아래 20%(y > 580)는 유튜브 UI 가 덮으니 비워 둔다.
export const THEME = {
  bg: '#0E1326',
  ink: '#F4F1EA',
  dim: '#9AA3C7',
  amber: '#FFC24B',
  teal: '#3DDBC4',
  violet: '#9B8CFF',
  coral: '#FF7A7A',
};
export const FONT = "'Pretendard Variable', Pretendard, 'Malgun Gothic', sans-serif";

export function Backdrop() {
  return (
    <>
      <Rect
        width={1080}
        height={1920}
        fill={
          new Gradient({
            type: 'radial',
            from: [0, -420],
            to: [0, -420],
            fromRadius: 0,
            toRadius: 1500,
            stops: [
              {offset: 0, color: '#1E2852'},
              {offset: 0.55, color: '#10152C'},
              {offset: 1, color: '#070A14'},
            ],
          })
        }
      />
      <Grid width={1080} height={1920} spacing={72} stroke={'#ffffff0b'} lineWidth={1} />
    </>
  );
}

// 노드를 아래에서 살짝 떠오르게 한다
export function* rise(node: Node, time = 0.6, dy = 28) {
  const y = node.y();
  node.y(y + dy);
  yield* all(node.opacity(1, time), node.y(y, time, easeOutCubic));
}

// 위쪽 말머리 · 제목, 아래쪽 자막 카드
export function addChrome(
  view: View2D,
  o: {tag: string; lead: string; tex: string; tail: string},
) {
  const tag = createRef<Rect>();
  const lead = createRef<Txt>();
  const main = createRef<Rect>();
  const card = createRef<Rect>();
  const step = createRef<Txt>();
  const line = createRef<Txt>();

  view.add(
    <>
      <Rect
        ref={tag}
        y={-850}
        layout
        direction="row"
        alignItems="center"
        gap={14}
        padding={[14, 30]}
        radius={999}
        fill="#ffffff10"
        stroke="#ffffff22"
        lineWidth={2}
        opacity={0}
      >
        <Circle size={14} fill={THEME.amber} shadowColor={THEME.amber} shadowBlur={14} />
        <Txt text={o.tag} fontFamily={FONT} fontSize={32} fontWeight={600} fill={THEME.dim} />
      </Rect>
      <Txt
        ref={lead}
        y={-740}
        text={o.lead}
        fontFamily={FONT}
        fontSize={62}
        fontWeight={700}
        fill={THEME.dim}
        opacity={0}
      />
      <Rect ref={main} y={-630} layout direction="row" alignItems="center" gap={22} opacity={0}>
        {o.tex ? (
          <Latex tex={o.tex} height={92} fill={THEME.amber} shadowColor={THEME.amber} shadowBlur={30} />
        ) : null}
        <Txt text={o.tail} fontFamily={FONT} fontSize={92} fontWeight={800} fill={THEME.ink} />
      </Rect>
      <Rect
        ref={card}
        y={440}
        layout
        direction="column"
        alignItems="center"
        gap={10}
        padding={[30, 56]}
        radius={36}
        fill="#121A38d9"
        stroke="#ffffff1f"
        lineWidth={2}
        shadowColor="#00000099"
        shadowBlur={40}
        opacity={0}
      >
        <Txt ref={step} fontFamily={FONT} fontSize={28} fontWeight={800} letterSpacing={5} fill={THEME.teal} />
        <Txt
          ref={line}
          fontFamily={FONT}
          fontSize={52}
          fontWeight={700}
          lineHeight={74}
          fill={THEME.ink}
          textAlign="center"
        />
      </Rect>
    </>,
  );

  function* intro() {
    yield* rise(tag(), 0.5, 20);
    yield* rise(lead(), 0.5);
    yield* rise(main(), 0.7);
  }

  function* say(stepLabel: string, text: string) {
    if (card().opacity() > 0) {
      yield* all(card().opacity(0, 0.2), card().scale(0.96, 0.2));
    }
    step().text(stepLabel);
    line().text(text);
    card().scale(0.96);
    yield* all(card().opacity(1, 0.4), card().scale(1, 0.4, easeOutCubic));
  }

  return {intro, say, card};
}

// 수식 바꾸기: Latex 의 자동 변형은 조각 짝 맞추기가 자주 실패해서, 사라졌다 튀어나오게 한다
export function* swapTex(node: Latex, tex: string) {
  yield* all(node.opacity(0, 0.25), node.scale(0.85, 0.25));
  node.tex(tex);
  yield* all(node.opacity(1, 0.4), node.scale(1, 0.4, easeOutBack));
}
