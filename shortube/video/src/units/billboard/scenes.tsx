import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { B } from "./fx";
import D from "../../../../content/billboard/script/data.json";

// 숫자는 output/briefs/2026-10-22_billboard.md 사실 카드(B1~B5)에서만 가져온다. 사진·로고·캡처 없음.
const fmt = (n: number) => n.toLocaleString("ko-KR");
const pct = (a: number, b: number) => ((a / b) * 100).toFixed(1);
const MAX = Math.max(...D.rows.map((r) => r.units));
const MIN = Math.min(...D.rows.map((r) => r.units));

const Small: React.FC<{ top: number; at?: number; children: React.ReactNode }> = ({ top, at = 0, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
  return <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 28, color: B.dim, opacity: o }}>{children}</div>;
};

// 0. 훅
const HOOK_L: Line[] = [{ text: "올해 빌보드 200 1위 K팝 앨범 5장, 첫 주는 얼마나 달랐을까", from: 14, to: 120, em: ["5장,"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const b = spring({ frame: frame - 40, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, a * 2), transform: `scale(${0.6 + a * 0.4})` }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: B.text }}>2026 빌보드 200 · K팝 1위 앨범</div>
        <div style={{ fontSize: 420, fontWeight: 900, lineHeight: 1, color: B.pink, textShadow: `0 0 80px ${B.pink}88` }}>
          <Counter from={0} to={5} start={4} dur={14} digits={0} />
          <span style={{ fontSize: 120, color: B.text }}>장</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 940, left: 0, right: 0, textAlign: "center", opacity: b }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: B.dim }}>첫 주 앨범 유닛</div>
        <div style={{ fontSize: 92, fontWeight: 900, color: B.mint }}>
          {fmt(MIN)} ~ {fmt(MAX)}
        </div>
      </div>
      <Small top={1250} at={60}>차트 날짜 2026.4.4 ~ 9.5 · 빌보드 발표 인용 보도 기준</Small>
      <Caption lines={HOOK_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 1. 5팀 막대 (차트 날짜 순)
const BARS_L: Line[] = [
  { text: "차트 날짜 순으로 5팀의 첫 주 유닛", from: 8, to: 120, em: ["첫", "주"] },
  { text: "방탄소년단 641,000부터 엔하이픈 98,000까지", from: 125, to: 290, em: ["641,000부터", "98,000까지"] },
];
export const BarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {D.rows.map((r, i) => {
        const p = spring({ frame: frame - (14 + i * 38), fps, config: { damping: 18, stiffness: 110 } });
        const top = 250 + i * 210;
        const w = (r.units / MAX) * 700;
        const hot = r.units === MAX;
        return (
          <div key={r.group} style={{ position: "absolute", top, left: 70, right: 70, opacity: Math.min(1, p * 2) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: B.text }}>{r.group}</span>
              <span style={{ fontSize: 28, fontWeight: 500, color: B.dim }}>
                {r.album} · {r.chart}자
              </span>
            </div>
            <div style={{ position: "relative", marginTop: 10, height: 76, background: "rgba(255,255,255,0.06)", borderRadius: 16 }}>
              <div style={{ width: w * p, height: "100%", borderRadius: 16, background: hot ? `linear-gradient(90deg, ${B.pink}, #ff8bc6)` : `linear-gradient(90deg, #7b3fe4, ${B.pink})`, boxShadow: `0 0 30px ${B.pink}66` }} />
              <div style={{ position: "absolute", left: w * p + 16, top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: 44, fontWeight: 900, color: B.yellow }}>
                <Counter from={0} to={r.units} start={14 + i * 38} dur={22} digits={0} />
              </div>
            </div>
          </div>
        );
      })}
      <Caption lines={BARS_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 2. 격차
const GAP_L: Line[] = [
  { text: "같은 1위인데 첫 주 유닛은 약 6.5배 차이", from: 10, to: 110, em: ["6.5배"] },
  { text: "98,000으로 1위를 한 주도 있었습니다", from: 112, to: 205, em: ["98,000으로"] },
];
export const GapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - 40, fps, config: { damping: 12 } });
  const ratio = (MAX / MIN).toFixed(1);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 280, left: 70, right: 70, opacity: a, transform: `translateX(${(1 - a) * -300}px)` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: B.text }}>방탄소년단 · 아리랑</div>
        <div style={{ height: 90, width: 940 * a, background: `linear-gradient(90deg, #7b3fe4, ${B.pink})`, borderRadius: 18, marginTop: 8 }} />
        <div style={{ fontSize: 64, fontWeight: 900, color: B.yellow }}>{fmt(MAX)}</div>
      </div>
      <div style={{ position: "absolute", top: 640, left: 70, right: 70, opacity: b, transform: `translateX(${(1 - b) * -300}px)` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: B.text }}>엔하이픈 · THE SIN : BLISS</div>
        <div style={{ height: 90, width: ((940 * MIN) / MAX) * b, background: `linear-gradient(90deg, #7b3fe4, ${B.pink})`, borderRadius: 18, marginTop: 8 }} />
        <div style={{ fontSize: 64, fontWeight: 900, color: B.yellow }}>{fmt(MIN)}</div>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [70, 82], [0, 1], clamp) }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: B.dim }}>641,000 ÷ 98,000</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: B.mint, textShadow: `0 0 50px ${B.mint}88` }}>≈ {ratio}배</div>
      </div>
      <Caption lines={GAP_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 3. 유닛 구성: 앨범 판매 비중
const MIX_L: Line[] = [
  { text: "유닛 중 앨범 판매 비중, 5장 모두 83% 이상", from: 10, to: 160, em: ["83%"] },
  { text: "에이티즈 97.8%, 방탄소년단 83.0%", from: 165, to: 320, em: ["97.8%,", "83.0%"] },
];
export const MixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 240, left: 70, right: 70, display: "flex", gap: 30, fontSize: 28, fontWeight: 700, color: B.dim }}>
        <span>
          <span style={{ color: B.pink }}>■</span> 앨범 판매
        </span>
        <span>
          <span style={{ color: B.mint }}>■</span> 스트리밍·트랙 환산
        </span>
      </div>
      {D.rows.map((r, i) => {
        const p = spring({ frame: frame - (10 + i * 34), fps, config: { damping: 18, stiffness: 110 } });
        const top = 310 + i * 168;
        const share = r.sales / r.units;
        return (
          <div key={r.group} style={{ position: "absolute", top, left: 70, right: 70, opacity: Math.min(1, p * 2) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: B.text }}>{r.group}</span>
              <span style={{ fontSize: 50, fontWeight: 900, color: B.yellow }}>{pct(r.sales, r.units)}%</span>
            </div>
            <div style={{ display: "flex", marginTop: 10, height: 60, borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.06)", width: 940 * p }}>
              <div style={{ width: `${share * 100}%`, background: B.pink }} />
              <div style={{ flex: 1, background: B.mint }} />
            </div>
          </div>
        );
      })}
      <Caption lines={MIX_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 4. 방탄소년단 3주 연속 1위
const STREAK_L: Line[] = [
  { text: "방탄소년단은 둘째 주 71% 줄고도 1위를 지켰습니다", from: 10, to: 100, em: ["71%"] },
  { text: "3주 연속 1위, 보도 기준입니다", from: 102, to: 175, em: ["3주"] },
];
export const StreakScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const H = 460;
  const h2 = (H * D.btsWeek2) / D.rows[0].units;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", fontSize: 44, fontWeight: 900, color: B.text }}>방탄소년단 · 아리랑 · 주별 유닛</div>
      <div style={{ position: "absolute", top: 330, left: 120, width: 340, textAlign: "center" }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: B.yellow }}>{fmt(D.rows[0].units)}</div>
        <div style={{ margin: "10px auto 0", width: 220, height: H * a, background: `linear-gradient(0deg, #7b3fe4, ${B.pink})`, borderRadius: "16px 16px 0 0" }} />
        <div style={{ fontSize: 34, fontWeight: 700, color: B.dim, marginTop: 8 }}>1주 · 4.4자</div>
      </div>
      <div style={{ position: "absolute", top: 330 + (H - h2), left: 620, width: 340, textAlign: "center", opacity: b }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: B.yellow }}>{fmt(D.btsWeek2)}</div>
        <div style={{ margin: "10px auto 0", width: 220, height: h2 * b, background: `linear-gradient(0deg, #7b3fe4, ${B.pink})`, borderRadius: "16px 16px 0 0" }} />
        <div style={{ fontSize: 34, fontWeight: 700, color: B.dim, marginTop: 8 }}>2주 · 4.11자</div>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [60, 72], [0, 1], clamp) }}>
        <span style={{ fontSize: 120, fontWeight: 900, color: B.mint, textShadow: `0 0 40px ${B.mint}88` }}>-71%</span>
      </div>
      <Stamp at={110} color={B.pink} rotate={-4} style={{ top: 1195, left: 230, fontSize: 40 }}>
        그래도 1위 · 3주 연속
      </Stamp>
      <Caption lines={STREAK_L} bottom={400} />
    </AbsoluteFill>
  );
};

// 5. 마무리: 기준 · 한계
const OUT_L: Line[] = [{ text: "빌보드 발표를 인용한 보도 기준입니다 · 출처는 설명란", from: 10, to: 145, em: ["보도", "설명란"] }];
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 20], [0, 1], clamp);
  const row = (t: string, s: string) => (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontSize: 34, fontWeight: 900, color: B.mint }}>{t}</div>
      <div style={{ fontSize: 34, fontWeight: 500, color: B.text, lineHeight: 1.4, wordBreak: "keep-all" }}>{s}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, opacity: o, background: B.card, border: `2px solid ${B.line}`, borderRadius: 28, padding: "36px 40px" }}>
        {row("집계", "빌보드 200 · 앨범 환산 유닛 = 앨범 판매 + 스트리밍 환산 + 트랙 환산")}
        {row("기간", "차트 날짜 2026.4.4 ~ 9.5 (K팝 그룹 1위 앨범 5장)")}
        {row("한계", "주마다 집계 기간과 경쟁 앨범이 달라 순위의 우열이 아니라 수치만 비교")}
        {row("출처", "빌보드 발표를 인용한 언론 보도 (설명란에 기재)")}
      </div>
      <Caption lines={OUT_L} bottom={400} />
    </AbsoluteFill>
  );
};
