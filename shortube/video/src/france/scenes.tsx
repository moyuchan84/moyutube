import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../components/Caption";
import { clamp, Counter } from "../market/effects";
import { fontFamily } from "../theme";
import { F, Txt } from "./fx";
import D from "./data.json";

// 숫자는 output/briefs/2026-10-19_france.md 사실 카드와 src/france/data.json 에서만 가져온다.
// 정부(내무부) 집계 = 시안, 노조 · 주최 측 추산 = 앰버. 인물 · 폭력 장면 · 개인 정보 없음.

// 0. 훅
const HOOK_L: Line[] = [{ text: "같은 날 프랑스 시위, 숫자가 두 개였습니다", from: 14, to: 120, em: ["숫자가", "두", "개였습니다"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - 34, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={40} color={F.dim}>2026.10.17 (토) 프랑스 전국 시위</Txt>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: F.gov }}>내무부(정부) 집계</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: F.gov }}>55만</div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", opacity: b, transform: `scale(${0.7 + 0.3 * b})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: F.union }}>노조 · 주최 측 추산</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: F.union }}>80만</div>
      </div>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 사람 점 격자 — 1점 = 1만 명
const CROWD_L: Line[] = [
  { text: "점 하나가 1만 명. 정부 집계는 55개, 파리에서만 11개", from: 10, to: 150, em: ["1만", "55개,"] },
  { text: "노조 추산은 80개, 25개 차이가 났어요", from: 152, to: 270, em: ["80개,", "25개"] },
];
export const CrowdScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cell = 70, gap = 10, cols = 10;
  const w = cols * cell + (cols - 1) * gap;
  const left = (1080 - w) / 2;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 240, left, width: w, height: 8 * (cell + gap) }}>
        {Array.from({ length: 80 }).map((_, i) => {
          const p = interpolate(frame, [12 + i * 1.6, 22 + i * 1.6], [0, 1], clamp);
          const gov = i < D.oct17.gov;
          const paris = i < D.oct17.paris;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (i % cols) * (cell + gap),
                top: Math.floor(i / cols) * (cell + gap),
                width: cell,
                height: cell,
                borderRadius: "50%",
                background: gov ? (paris ? F.chalk : F.gov) : "transparent",
                border: gov ? "none" : `5px solid ${F.union}`,
                opacity: p,
                transform: `scale(${0.3 + 0.7 * p})`,
              }}
            />
          );
        })}
      </div>
      <Txt top={1000} size={34} weight={500} color={F.dim} at={30}>
        <span style={{ color: F.chalk }}>●</span> 파리 11만 (정부 집계 중) &nbsp; <span style={{ color: F.gov }}>●</span> 그 밖 지역 44만 &nbsp; <span style={{ color: F.union }}>○</span> 노조 추산과의 차이 25만
      </Txt>
      <Caption bottom={400} lines={CROWD_L} />
    </AbsoluteFill>
  );
};

// 2. 커진 과정 — 정부 집계 막대 + 노조 추산 표시
const RISE_L: Line[] = [
  { text: "정부 집계로 10월 6일 25만, 8일 7만, 13일 16만", from: 10, to: 150, em: ["25만,", "7만,", "16만"] },
  { text: "17일 토요일에 55만으로 가장 컸어요", from: 152, to: 270, em: ["55만으로", "가장"] },
];
export const RiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const base = 1010, k = 8.6; // 1만 명 = 8.6px, 막대는 아래서 위로
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: base, left: 70, right: 70, height: 4, background: F.chalk }} />
      {D.days2026.map((r, i) => {
        const p = interpolate(frame, [15 + i * 22, 50 + i * 22], [0, 1], clamp);
        const x = 100 + i * 235;
        const h = r.gov * k * p;
        return (
          <div key={r.d}>
            <div style={{ position: "absolute", left: x, width: 100, top: base - h, height: h, background: F.gov, borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: x - 60, width: 220, top: base - h - 58, textAlign: "center", whiteSpace: "nowrap", fontSize: 44, fontWeight: 900, color: F.gov, opacity: p }}>{r.gov}만</div>
            {r.union !== null && (
              <div style={{ position: "absolute", left: x + 108, width: 100, top: base - r.union * k * p, height: 6, background: F.union, opacity: p }} />
            )}
            {r.union !== null && (
              <div style={{ position: "absolute", left: x + 100, width: 140, top: base - r.union * k * p - 48, textAlign: "left", whiteSpace: "nowrap", fontSize: 32, fontWeight: 700, color: F.union, opacity: p }}>{r.union}만</div>
            )}
            <div style={{ position: "absolute", left: x - 40, width: 180, top: base + 18, textAlign: "center", fontSize: 30, fontWeight: 500, color: F.dim, opacity: p }}>{r.d}</div>
          </div>
        );
      })}
      <Txt top={1110} size={30} weight={500} color={F.dim} at={110}>
        시안 막대 = 내무부 집계 · 앰버 선 = 노조 · 주최 측 추산(없는 날 생략) · 10/13 앰버는 청년 노조 연합 추산 · 10/8 은 거리 행진만(학교 앞 집회 5.5만 별도)
      </Txt>
      <Caption bottom={400} lines={RISE_L} />
    </AbsoluteFill>
  );
};

// 3. 왜
const WHY_L: Line[] = [
  { text: "출발은 9월 파리 근교 고등학교, 교사 부족 · 낡은 건물 · 과밀 학급이었어요", from: 10, to: 130, em: ["9월", "교사", "부족"] },
  { text: "여기에 물가 · 예산안 반발이 겹치며 전국으로 번졌어요", from: 132, to: 240, em: ["예산안", "전국으로"] },
];
const Card: React.FC<{ at: number; top: number; head: string; body: string; note?: string }> = ({ at, top, head, body, note }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: 80, right: 80, background: F.card, border: `2px solid ${F.dim}`, borderRadius: 22, padding: "22px 30px", opacity: o, transform: `translateX(${(1 - o) * -60}px)` }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: F.dim }}>{head}</div>
      <div style={{ fontSize: 48, fontWeight: 900, color: F.chalk, lineHeight: 1.2 }}>{body}</div>
      {note && <div style={{ fontSize: 26, fontWeight: 500, color: F.dim, marginTop: 6 }}>{note}</div>}
    </div>
  );
};
export const WhyScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Card at={10} top={250} head="시작" body="2026.9월 · 파리 근교 고교" note="9/21 크레테유 고교에서 시작(위키 기준)" />
    <Card at={50} top={510} head="학생 요구(전국학생조합 문건)" body="교사 부족 · 낡은 건물 · 과밀 학급" note="대입 플랫폼 스트레스도 포함" />
    <Card at={90} top={790} head="예산안 (정부 설명)" body="540억 유로 절감 · 증세안" note="노조는 공무원 임금표 4년 연속 동결이라 주장" />
    <Card at={130} top={1030} head="휴교 (교육장관 발표)" body="10/2 약 400곳 → 10/13 214곳" />
    <Caption bottom={400} lines={WHY_L} />
  </AbsoluteFill>
);

// 4. 옛날 개혁 — 2023 연금개혁(정년 62→64) 최대 규모와 비교
const PAST_L: Line[] = [
  { text: "2023년 정년 62→64세 연금개혁 때는 정부 집계 최대 127만 명", from: 10, to: 130, em: ["2023년", "127만"] },
  { text: "노조 추산은 350만 명, 시위는 140일 이어졌어요", from: 132, to: 270, em: ["350만", "140일"] },
];
export const PastScene: React.FC = () => {
  const frame = useCurrentFrame();
  const max = 350, W = 880;
  const row = (top: number, label: string, v: number, color: string, at: number, sub: string) => {
    const p = interpolate(frame, [at, at + 40], [0, 1], clamp);
    return (
      <div style={{ position: "absolute", top, left: 100 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: F.dim }}>{label}</div>
        <div style={{ width: (v / max) * W * p, height: 70, background: color, borderRadius: 10, marginTop: 6 }} />
        <div style={{ fontSize: 46, fontWeight: 900, color, marginTop: 4 }}>{(v * p).toFixed(v % 1 ? 1 : 0)}만 <span style={{ fontSize: 28, fontWeight: 500, color: F.dim }}>{sub}</span></div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={230} size={36} color={F.chalk}>정부 집계 최대치 (내무부)</Txt>
      {row(290, "2023 연금개혁 · 1/31", D.y2023.govMax, F.gov, 10, "")}
      {row(500, "2026 이번 시위 · 10/17", D.oct17.gov, F.gov, 40, "(현재까지)")}
      <Txt top={730} size={36} color={F.chalk}>노조 추산 최대치</Txt>
      {row(790, "2023 연금개혁 · 3/7", D.y2023.unionMax, F.union, 110, "")}
      {row(1000, "2026 이번 시위 · 10/17", D.oct17.union, F.union, 140, "(현재까지)")}
      <Txt top={1215} size={28} weight={500} color={F.dim} at={180}>2023 은 노조 주도 평일 총파업 · 2026 은 학생 주도 + 토요일 집회 — 규모만 비교, 성격은 다름</Txt>
      <Caption bottom={400} lines={PAST_L} />
    </AbsoluteFill>
  );
};

// 5. 집계 차이 — 노조 추산 ÷ 정부 집계
const GAP_L: Line[] = [
  { text: "노조 추산 ÷ 정부 집계는 2023년 1월 31일 2.2배", from: 10, to: 110, em: ["2.2배"] },
  { text: "이번엔 1.45~3배, 집계 방식 차이를 알고 봐야 해요", from: 112, to: 210, em: ["1.45~3배,"] },
];
export const GapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { l: "2023 · 1/31", r: 2.2, c: F.union },
    { l: "2026 · 10/6", r: 1.8, c: F.union },
    { l: "2026 · 10/13", r: 3.0, c: F.union },
    { l: "2026 · 10/17", r: 1.45, c: F.union },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={230} size={38} color={F.dim}>노조 추산 ÷ 정부 집계</Txt>
      {rows.map((r, i) => {
        const p = interpolate(frame, [10 + i * 22, 40 + i * 22], [0, 1], clamp);
        return (
          <div key={r.l} style={{ position: "absolute", top: 320 + i * 170, left: 100 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: F.dim }}>{r.l}</div>
            <div style={{ width: (r.r / 3) * 700 * p, height: 64, background: r.c, borderRadius: 10, marginTop: 6 }} />
            <div style={{ position: "absolute", left: (r.r / 3) * 700 * p + 24, top: 36, fontSize: 52, fontWeight: 900, whiteSpace: "nowrap", color: r.c, opacity: p }}>{(r.r).toFixed(r.r % 1 ? (r.r === 1.45 ? 2 : 1) : 1)}배</div>
          </div>
        );
      })}
      <Txt top={1060} size={30} weight={500} color={F.dim} at={100}>어느 쪽이 맞는지 이 영상은 판단하지 않습니다 — 두 집계를 모두 표시</Txt>
      <Caption bottom={400} lines={GAP_L} />
    </AbsoluteFill>
  );
};

// 6. 마무리
const OUT_L: Line[] = [{ text: "집계가 다르면 둘 다 보세요. 보도 시점 기준 숫자입니다", from: 14, to: 210, em: ["둘", "다", "보도"] }];
export const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={240} size={60} weight={900} color={F.chalk}>같은 날 55만 vs 80만</Txt>
    <div style={{ position: "absolute", top: 450, left: 80, right: 80, background: F.card, border: `2px solid ${F.dim}`, borderRadius: 24, padding: "30px 36px", fontSize: 31, lineHeight: 1.55, color: F.chalk, fontWeight: 500 }}>
      · 2026 수치: 알자지라 · 위키백과 · 한국 언론 보도, 2026.10.19 기준<br />
      · 2023 수치: 위키백과 · 아주뉴스 · 한국 언론 보도<br />
      · 정부 집계는 내무부, 노조 추산은 CGT 등 주최 측<br />
      · 체포 · 부상 수치는 집계 시점이 달라 합산하지 않음<br />
      · 정치적 평가 없음 · 숫자 정리용
    </div>
    <Caption bottom={400} lines={OUT_L} />
  </AbsoluteFill>
);
