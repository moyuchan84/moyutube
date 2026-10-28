import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { springs } from "../../theme";
import D from "../../../../content/claude/script/data.json";
import { eok, Highlight, kr, mono, P } from "./fx";

// 숫자는 모두 브리프 사실 카드(C01~C15)에서 온다 — content/claude/plan.md
const Q = D.quarters;
const LAST = Q[Q.length - 1].m;
const YOY = Math.round((LAST / Q[1].m) * 10) / 10; // 14.7배 (C02, 11,555 / 787)
const COMMIT_SUM = D.commit.reduce((s, c) => s + c.b, 0); // 2,694억 달러 (C10 자체 계산)
const won = (n: number) => n.toLocaleString("ko-KR");

const useIn = (at: number, cfg: { damping: number; stiffness?: number } = springs.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 서류 항목 머리글: "Item 3. 분기 매출" 처럼
const Head: React.FC<{ item: string; children: React.ReactNode; sub?: string }> = ({ item, children, sub }) => {
  const s = useIn(4);
  return (
    <div style={{ position: "absolute", top: 205, left: 130, right: 130, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
      <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: P.dim, letterSpacing: 2 }}>{item}</div>
      <div style={{ fontFamily: kr, fontSize: 64, fontWeight: 700, color: P.ink, lineHeight: 1.15, wordBreak: "keep-all" }}>{children}</div>
      {sub && <div style={{ fontFamily: kr, fontSize: 28, fontWeight: 500, color: P.dim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

// 타자기처럼 한 글자씩
const Type: React.FC<{ text: string; at: number; speed?: number; style?: React.CSSProperties }> = ({ text, at, speed = 1.4, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - at) * speed));
  const caret = frame >= at && n < text.length + 6 && Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0 }}>▌</span>
    </span>
  );
};

// 1. 훅: S-1 표지 · NASDAQ: ANT 도장 · 공모가 빈칸 (C01)
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;
  const blank = (
    <span style={{ display: "inline-block", width: 120, borderBottom: `6px solid ${P.red}`, marginBottom: -6, opacity: blink ? 1 : 0.35 }}>&nbsp;</span>
  );
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 140, right: 140, textAlign: "center", color: P.ink }}>
        <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 500, color: P.dim, minHeight: 70, lineHeight: 1.35 }}>
          <Type text={"UNITED STATES\nSECURITIES AND EXCHANGE COMMISSION"} at={0} speed={2.4} style={{ whiteSpace: "pre-line" }} />
        </div>
        <div style={{ fontFamily: mono, fontSize: 168, fontWeight: 700, letterSpacing: -4, marginTop: 30, opacity: interpolate(frame, [14, 22], [0, 1], clamp) }}>FORM S-1</div>
        <div style={{ height: 4, background: P.ink, margin: "6px 40px 26px" }} />
        <div style={{ fontFamily: mono, fontSize: 66, fontWeight: 700, opacity: interpolate(frame, [26, 34], [0, 1], clamp) }}>Anthropic, PBC</div>
        <div style={{ fontFamily: kr, fontSize: 34, fontWeight: 500, color: P.dim, marginTop: 6, opacity: interpolate(frame, [32, 40], [0, 1], clamp) }}>
          Claude 를 만든 회사 · 2026.10.26 제출
        </div>
        <div style={{ fontFamily: kr, fontSize: 50, fontWeight: 700, marginTop: 90, opacity: interpolate(frame, [92, 100], [0, 1], clamp) }}>
          공모가 <span style={{ fontFamily: mono }}>$</span>
          {blank}
          <span style={{ fontFamily: mono }}> ~ $</span>
          {blank}
        </div>
        <div style={{ fontFamily: kr, fontSize: 28, fontWeight: 500, color: P.red, marginTop: 14, opacity: interpolate(frame, [100, 108], [0, 1], clamp) }}>
          서류에도 아직 빈칸 · 상장일 미정
        </div>
      </div>
      <Stamp at={64} color={P.red} rotate={-9} style={{ top: 1070, left: 300, fontSize: 64, fontFamily: mono, background: "transparent", border: `8px solid ${P.red}`, color: P.red }}>
        NASDAQ: {D.ticker}
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "10월 26일, Claude 를 만든 앤트로픽이 상장 서류를 냈습니다", from: 5, to: 80, em: ["상장"] },
          { text: "나스닥 종목코드 ANT, 공모가는 아직 빈칸", from: 80, to: 150, em: ["ANT,", "빈칸"] },
        ]}
      />
    </>
  );
};

// 2. 분기 매출 막대 6개 (C02)
export const RevenueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = 1270, maxH = 700, bw = 104, gap = 26, x0 = 150;
  return (
    <>
      <Head item="ITEM 1 · 분기 매출" sub="단위: 억 달러 · S-1 분기 손익표 (2026년 2분기까지)">
        1년 새 매출이
      </Head>
      {Q.map((q, i) => {
        const at = 24 + i * 22;
        const p = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 120 } });
        const h = Math.max(6, (q.m / LAST) * maxH) * p;
        const left = x0 + i * (bw + gap);
        const last = i === Q.length - 1;
        return (
          <div key={i}>
            <div style={{ position: "absolute", left, top: base - h, width: bw, height: h, background: last ? P.ink : P.hi, borderRadius: "10px 10px 0 0", boxShadow: last ? "none" : `inset 0 0 0 3px ${P.ink}` }} />
            <div style={{ position: "absolute", left: left - 20, width: bw + 40, top: base - h - 52, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: last ? 44 : 32, color: P.ink, opacity: p }}>
              {eok(q.m)}
            </div>
            <div style={{ position: "absolute", left: left - 20, width: bw + 40, top: base + 12, textAlign: "center", fontFamily: mono, fontWeight: 500, fontSize: 26, color: P.dim }}>{q.q}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 130, right: 130, top: base, height: 4, background: P.ink }} />
      <Stamp at={255} color={P.red} rotate={-6} style={{ top: 600, left: 140, fontSize: 48, fontFamily: kr, background: P.red, color: P.paper, textAlign: "center", lineHeight: 1.1 }}>
        <span style={{ fontFamily: mono, fontSize: 96 }}>{`×${YOY}`}</span>
        <br />1년 전 같은 분기 대비
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "분기 매출, 작년 1분기 3.8억 달러에서", from: 5, to: 150, em: ["3.8억"] },
          { text: "올해 2분기 115.6억 달러, 1년 새 약 14.7배", from: 150, to: 330, em: ["115.6억", "14.7배"] },
        ]}
      />
    </>
  );
};

// 3. 토큰 = 돈 (C03 C04 C08)
const TOKENS = ["Cl", "aude", " 는", " 글", "자를", " 토", "큰", "으로", " 잘", "라", " 읽", "고", " 씁", "니다", " ·", " 1", "토큰", "마다", " 값", "이", " 매", "겨", "집", "니다"];
export const TokensScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = frame * 5;
  const bar = interpolate(frame, [70, 120], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const price = useIn(150, { damping: 14, stiffness: 140 });
  const W = 820;
  return (
    <>
      <Head item="ITEM 2 · 토큰" sub="2026년 상반기 매출 163억 달러의 구성">
        매출은 토큰에서
      </Head>
      {/* 토큰 블록 띠 */}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, height: 80, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 1080 - shift, display: "flex", gap: 8 }}>
          {[...TOKENS, ...TOKENS].map((t, i) => (
            <div key={i} style={{ fontFamily: kr, fontSize: 36, fontWeight: 700, padding: "8px 12px", borderRadius: 8, background: i % 3 === 0 ? P.hiSoft : i % 3 === 1 ? "rgba(47,95,208,0.15)" : "rgba(217,71,63,0.13)", color: P.ink, whiteSpace: "pre" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
      {/* 80 : 20 막대 */}
      <div style={{ position: "absolute", top: 600, left: 130, width: W, height: 120, border: `4px solid ${P.ink}`, borderRadius: 12, overflow: "hidden", display: "flex" }}>
        <div style={{ width: W * 0.8 * bar, background: P.hi, borderRight: bar > 0.98 ? `4px solid ${P.ink}` : "none" }} />
        <div style={{ flex: 1, background: "rgba(27,31,42,0.08)" }} />
      </div>
      <div style={{ position: "absolute", top: 735, left: 130, width: W, display: "flex", fontFamily: kr, fontWeight: 700, color: P.ink, opacity: bar }}>
        <div style={{ width: W * 0.8, fontSize: 34 }}>
          토큰 사용량 <span style={{ fontFamily: mono }}>{D.consumptionPct}%</span>
          <div style={{ fontSize: 26, fontWeight: 500, color: P.dim }}>131억 달러</div>
        </div>
        <div style={{ fontSize: 28 }}>
          구독 <span style={{ fontFamily: mono }}>20%</span>
        </div>
      </div>
      {/* 가격표 */}
      <div style={{ position: "absolute", top: 900, left: 150, right: 150, opacity: price, transform: `translateY(${(1 - price) * 40}px)`, border: `4px solid ${P.ink}`, borderRadius: 16, background: "#fff", padding: "20px 28px" }}>
        <div style={{ fontFamily: kr, fontSize: 30, fontWeight: 700, color: P.dim }}>Claude Opus 5.5 · 100만 토큰당 기본가</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
          {[
            ["읽기(입력)", D.opus.in],
            ["쓰기(출력)", D.opus.out],
          ].map(([l, v]) => (
            <div key={l as string} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: kr, fontSize: 30, fontWeight: 500, color: P.ink }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 110, fontWeight: 700, color: P.ink, lineHeight: 1 }}>${v}</div>
            </div>
          ))}
        </div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "상반기 매출 163억 달러 중 80%가 토큰 사용량으로 번 돈", from: 5, to: 150, em: ["80%가"] },
          { text: "Opus 5.5 는 100만 토큰 읽는 데 4달러, 쓰는 데 20달러", from: 150, to: 300, em: ["4달러,", "20달러"] },
        ]}
      />
    </>
  );
};

// 4. 컨텍스트 창 9K → 100K → 1M (C05 C06 C07 C08)
export const ContextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 800;
  const sheets = useIn(160, { damping: 16 });
  return (
    <>
      <Head item="ITEM 3 · 컨텍스트 창" sub="한 번의 요청에 넣을 수 있는 양 (토큰)">
        한 번에 읽는 양
      </Head>
      {D.context.map((c, i) => {
        const at = 20 + i * 40;
        const p = interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
        const top = 470 + i * 150;
        return (
          <div key={i} style={{ position: "absolute", top, left: 130, opacity: interpolate(frame, [at - 4, at], [0, 1], clamp) }}>
            <div style={{ fontFamily: kr, fontSize: 28, fontWeight: 500, color: P.dim }}>{c.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
              <Highlight w={Math.max(10, (c.k / 1000) * W)} h={56} p={p} color={i === 2 ? P.hi : "rgba(27,31,42,0.75)"} />
              {i < 2 && <span style={{ fontFamily: mono, fontSize: 46, fontWeight: 700, color: P.ink }}>{c.k}K</span>}
            </div>
            {i === 2 && <div style={{ position: "absolute", top: 40, left: 20, fontFamily: mono, fontSize: 46, fontWeight: 700, color: P.ink, opacity: p }}>1M = 1,000,000</div>}
          </div>
        );
      })}
      <Stamp at={120} color={P.red} rotate={-7} style={{ top: 560, left: 560, fontSize: 52, fontFamily: kr, background: P.red, color: P.paper }}>
        100배 넘게
      </Stamp>
      {/* 종이 더미 + 환산 */}
      <div style={{ position: "absolute", top: 960, left: 130, right: 130, display: "flex", alignItems: "center", gap: 36, opacity: sheets, transform: `translateY(${(1 - sheets) * 40}px)` }}>
        <div style={{ position: "relative", width: 180, height: 220 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 6, top: 40 - i * 6, width: 150, height: 180, background: "#fff", border: `3px solid ${P.ink}`, borderRadius: 6, transform: `rotate(${(i % 3) - 1}deg)` }} />
          ))}
        </div>
        <div style={{ fontFamily: kr, color: P.ink }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: P.dim }}>100만 토큰은 글자로</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{D.chars}</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: P.dim }}>통째로 넣어도 Opus 5.5 입력 <span style={{ fontFamily: mono, fontWeight: 700, color: P.ink }}>$4</span></div>
        </div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "2023년 봄 9천 토큰이던 기억 창이", from: 5, to: 150, em: ["9천"] },
          { text: "지금은 100만 토큰, 약 250만 자를 한 번에", from: 150, to: 300, em: ["100만", "250만"] },
        ]}
      />
    </>
  );
};

// 5. 연산: 칩 4종 · 최소 약정 · 성장률 비교 (C09 C10 C11)
export const ComputeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const maxB = Math.max(...D.commit.map((c) => c.b));
  const g = useIn(230, { damping: 18 });
  return (
    <>
      <Head item="ITEM 4 · 연산(컴퓨트)" sub="학습 · 서비스에 쓰는 칩 4종">
        칩과 약정
      </Head>
      <div style={{ position: "absolute", top: 470, left: 130, right: 130, display: "flex", justifyContent: "space-between" }}>
        {D.chips.map((c, i) => {
          const s = spring({ frame: frame - (10 + i * 8), fps: 30, config: { damping: 12, stiffness: 160 } });
          return (
            <div key={c} style={{ width: 186, height: 150, position: "relative", transform: `scale(${s})` }}>
              <div style={{ position: "absolute", inset: 14, background: P.ink, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: mono, fontSize: 24, fontWeight: 700, color: P.hi, lineHeight: 1.15, padding: 6, whiteSpace: "pre-line" }}>
                {c.replace(" ", "\n")}
              </div>
              {Array.from({ length: 6 }).map((_, k) => (
                <div key={k}>
                  <div style={{ position: "absolute", left: 30 + k * 25, top: 0, width: 8, height: 14, background: P.ink }} />
                  <div style={{ position: "absolute", left: 30 + k * 25, bottom: 0, width: 8, height: 14, background: P.ink }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 660, left: 130, fontFamily: kr, fontSize: 30, fontWeight: 700, color: P.ink, opacity: interpolate(frame, [100, 110], [0, 1], clamp) }}>
        실사용과 관계없이 내야 하는 최소 약정 <span style={{ color: P.dim, fontWeight: 500 }}>(억 달러)</span>
      </div>
      {D.commit.map((c, i) => {
        const at = 110 + i * 18;
        const p = interpolate(frame, [at, at + 24], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
        return (
          <div key={c.name} style={{ position: "absolute", top: 715 + i * 86, left: 130, display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [at - 3, at], [0, 1], clamp) }}>
            <div style={{ width: 180, fontFamily: mono, fontSize: 30, fontWeight: 700, color: P.ink }}>{c.name}</div>
            <Highlight w={(c.b / maxB) * 470} h={50} p={p} />
            <div style={{ fontFamily: mono, fontSize: 36, fontWeight: 700, color: P.ink, opacity: p }}>{won(c.b)}</div>
          </div>
        );
      })}
      <Stamp at={220} color={P.red} rotate={-4} style={{ top: 975, left: 330, fontSize: 46, fontFamily: kr, background: P.red, color: P.paper }}>
        {`세 곳 합 ${won(COMMIT_SUM)}억 달러`}
      </Stamp>
      <div style={{ position: "absolute", top: 1140, left: 130, right: 130, opacity: g, transform: `translateY(${(1 - g) * 30}px)`, fontFamily: kr, color: P.ink }}>
        <div style={{ fontSize: 26, fontWeight: 500, color: P.dim }}>2026년 2분기, 1년 전보다</div>
        <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>
            매출 <span style={{ fontFamily: mono, fontSize: 62, background: P.hiSoft, padding: "0 8px" }}>+{won(D.growth.revenue)}%</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>
            연산비 <span style={{ fontFamily: mono, fontSize: 62 }}>+{D.growth.compute}%</span>
          </div>
        </div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "Claude 는 칩 4종류 위에서 돌아갑니다", from: 5, to: 105, em: ["4종류"] },
          { text: "쓰든 안 쓰든 내야 하는 연산 약정만 세 곳 2,694억 달러", from: 105, to: 230, em: ["2,694억"] },
          { text: "매출이 1,368% 늘 때 연산비는 300% 늘었습니다", from: 230, to: 330, em: ["1,368%", "300%"] },
        ]}
      />
    </>
  );
};

// 6. 손실: 순손실 807억 중 724억은 평가 변화 (C12)
export const LossScene: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 820;
  const box = useIn(8, { damping: 16 });
  const cut = interpolate(frame, [70, 95], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const fvW = (D.loss.fairValue / D.loss.net) * W;
  const op = useIn(150, { damping: 14 });
  return (
    <>
      <Head item="ITEM 5 · 손실" sub="2026년 상반기 (1~6월)">
        그런데 손실은
      </Head>
      <div style={{ position: "absolute", top: 480, left: 130, fontFamily: kr, fontSize: 34, fontWeight: 700, color: P.ink, opacity: box }}>
        순손실 <span style={{ fontFamily: mono, fontSize: 80 }}>{won(D.loss.net)}</span>억 달러
      </div>
      <div style={{ position: "absolute", top: 600, left: 130, width: W, height: 150, border: `4px solid ${P.ink}`, borderRadius: 10, overflow: "hidden", opacity: box }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: fvW * cut, background: `repeating-linear-gradient(135deg, ${P.black} 0 22px, #333 22px 30px)` }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: W, background: "rgba(217,71,63,0.18)", zIndex: -1 }} />
      </div>
      <div style={{ position: "absolute", top: 770, left: 130, width: fvW, fontFamily: kr, color: P.ink, opacity: cut }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>
          그중 <span style={{ fontFamily: mono, fontSize: 56 }}>{won(D.loss.fairValue)}</span>억 = 전환사채 등 평가 변화
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: P.dim }}>기업가치가 올라 생긴 장부상 손실 (현금이 나간 것 아님)</div>
      </div>
      <div style={{ position: "absolute", top: 1030, left: 130, right: 130, opacity: op, transform: `translateY(${(1 - op) * 30}px)`, fontFamily: kr, color: P.ink }}>
        <div style={{ fontSize: 30, fontWeight: 500, color: P.dim }}>본업 기준 영업손실</div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>
          <span style={{ fontFamily: mono, fontSize: 96, background: P.hiSoft, padding: "0 10px" }}>6.9</span>억 달러
        </div>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "그런데 상반기 순손실은 807억 달러", from: 5, to: 110, em: ["807억"] },
          { text: "그중 724억은 기업가치가 올라 생긴 장부상 손실, 영업손실은 6.9억", from: 110, to: 240, em: ["724억은", "6.9억"] },
        ]}
      />
    </>
  );
};

// 7. 사람 · 코드 · 고객 (C13 C14 C15)
export const PeopleScene: React.FC = () => {
  const P_ = D.people;
  const rows: [string, React.ReactNode, string][] = [
    ["직원", <>약 <Counter from={0} to={P_.employees} start={14} dur={22} digits={0} />명</>, "2026.9.30"],
    ["1인당 매출", <>{P_.perEmployee}만 달러+</>, `최근 12개월 · 1년 전 ${P_.perEmployeePrev}만`],
    ["Claude 가 쓴 코드", <>{P_.codePct}%+</>, "2026년 9월 사내 코드 기여 · 회사 집계"],
    ["연 100만 달러+ 고객", <>{won(P_.cust1m)}곳+</>, `1,000만 달러+ 고객 약 ${P_.cust10m}곳`],
  ];
  return (
    <>
      <Head item="ITEM 6 · 사람과 고객" sub="2026년 9월 30일 기준">
        누가 만들고 누가 쓰나
      </Head>
      {rows.map(([l, v, s], i) => {
        const p = useIn(10 + i * 26, { damping: 15 });
        return (
          <div key={l} style={{ position: "absolute", top: 480 + i * 200, left: 130, right: 130, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, borderBottom: `3px dashed ${P.rule}`, paddingBottom: 10 }}>
            <div style={{ fontFamily: kr, fontSize: 30, fontWeight: 700, color: P.dim }}>{l}</div>
            <div style={{ fontFamily: kr, fontSize: 76, fontWeight: 700, color: P.ink, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            <div style={{ fontFamily: kr, fontSize: 24, fontWeight: 500, color: P.dim }}>{s}</div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "직원은 약 5,300명, 1인당 매출 660만 달러", from: 5, to: 90, em: ["5,300명,", "660만"] },
          { text: "9월 사내 코드 90% 이상은 Claude가 작성", from: 90, to: 180, em: ["90%"] },
        ]}
      />
    </>
  );
};

// 8. 마무리: 요약 · 출처 · 고지 (C01)
export const OutroScene: React.FC = () => {
  const s = useIn(4);
  const lines = [
    ["분기 매출", `${eok(Q[0].m)} → ${eok(LAST)}억 달러`],
    ["컨텍스트", "9K → 1M 토큰"],
    ["최소 연산 약정", `${won(COMMIT_SUM)}억 달러 (3곳)`],
    ["상반기 순손실", `${won(D.loss.net)}억 (평가손 ${won(D.loss.fairValue)}억)`],
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 220, left: 130, right: 130, opacity: s }}>
        <div style={{ fontFamily: mono, fontSize: 30, fontWeight: 700, color: P.dim, letterSpacing: 2 }}>SUMMARY</div>
        {lines.map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${P.ink}`, padding: "18px 0" }}>
            <span style={{ fontFamily: kr, fontSize: 34, fontWeight: 700, color: P.ink }}>{a}</span>
            <span style={{ fontFamily: mono, fontSize: 36, fontWeight: 700, color: P.ink }}>{b}</span>
          </div>
        ))}
        <div style={{ marginTop: 40, fontFamily: kr, fontSize: 26, fontWeight: 500, color: P.dim, lineHeight: 1.5 }}>
          자료: Anthropic, PBC Form S-1 (SEC, 2026.10.26) · Claude 공식 문서(모델 · 가격, 2026.10.27) · Anthropic 2023.5.11 발표
          <br />약정 합계 · 배수는 서류 숫자로 직접 계산
        </div>
        <div style={{ marginTop: 26, display: "inline-block", fontFamily: kr, fontSize: 32, fontWeight: 700, color: P.paper, background: P.ink, padding: "10px 20px", borderRadius: 8 }}>
          투자 권유 아님 · 공모가 · 상장일 미정
        </div>
      </div>
      <Caption bottom={400} lines={[{ text: "자료는 앤트로픽 S-1 · Claude 공식 문서, 투자 권유가 아닙니다", from: 5, to: 120, em: ["S-1"] }]} />
    </>
  );
};
