import { loadFont as loadBlack } from "@remotion/google-fonts/BlackHanSans";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { fontFamily as kr } from "../../theme";
import { clamp, Stamp } from "../market/effects";
import D from "../../../../content/q3chips/script/data.json";
import TL from "../../../../content/q3chips/script/timeline.json";

// 2026-10-28~29 삼성전자 · SK하이닉스 · 알파벳 3분기 실적 (브리프: content/q3chips/plan.md)
// 연출: PCB 초록 기판 · 금색 회로선 전류 전환 · 칩 카드 · 1만 원당 이익 가로 막대. 로고 · 제품 사진 없음.
// 숫자는 사실 카드(Q01~Q11)에서만. 주가 · 전망 없음 (투자 권유 아님). 상승 빨강 · 하락 파랑.
export const Q3CHIPS_TOTAL = TL.total;
const { fontFamily: black } = loadBlack("normal", { weights: ["400"] }); // bigarch 와 같은 호출이라 요청이 늘지 않는다
const { fontFamily: oswald } = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });

const P = { pcb: "#0E3B2E", pcb2: "#14513F", line: "#1D6B53", gold: "#E9B949", silk: "#F2F5EF", dim: "#9CC2B2", up: "#FF4B4B", down: "#4D8DFF", chip: "#16201C" };
const S = D.samsung, H = D.hynix, G = D.google;
const won = (n: number) => n.toLocaleString("ko-KR");

const useIn = (at: number, cfg = { damping: 14, stiffness: 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 바탕: 초록 기판 + 가로로 천천히 흐르는 회로 패턴 + 비아 점
const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const x = -(frame * 0.8) % 180;
  return (
    <AbsoluteFill style={{ background: P.pcb }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(90deg, ${P.line} 2px, transparent 2px), linear-gradient(0deg, ${P.line} 2px, transparent 2px)`,
          backgroundSize: "180px 180px",
          backgroundPosition: `${x}px 0`,
          opacity: 0.35,
        }}
      />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${P.gold} 3px, transparent 4px)`, backgroundSize: "180px 180px", backgroundPosition: `${x + 90}px 90px`, opacity: 0.35 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// 장면 전환: 금색 회로선 3줄에 전류가 왼쪽 → 오른쪽으로 흐름
const Current: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 20) return null;
  const w = interpolate(frame, [0, 12], [0, 1200], clamp);
  const o = interpolate(frame, [12, 20], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {[560, 960, 1360].map((y, i) => (
        <div key={y} style={{ position: "absolute", left: -60 + i * 20, top: y, width: w, height: 16, background: P.gold, borderRadius: 8, boxShadow: `0 0 40px ${P.gold}, 0 0 12px #fff` }} />
      ))}
      <AbsoluteFill style={{ background: P.pcb, opacity: interpolate(frame, [0, 6, 12], [0, 0.7, 0], clamp) }} />
    </AbsoluteFill>
  );
};

const Head: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(2);
  return (
    <div style={{ position: "absolute", top: 215, left: 70, right: 70, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 24}px)` }}>
      <div style={{ fontFamily: black, fontSize: 72, color: P.silk }}>{children}</div>
      {sub && <div style={{ fontFamily: kr, fontWeight: 700, fontSize: 32, color: P.dim, marginTop: 8 }}>{sub}</div>}
    </div>
  );
};

// 칩 모양 카드 (다리 달린 검은 사각형)
const Chip: React.FC<{ w: number; h: number; children: React.ReactNode; glow?: number; style?: React.CSSProperties }> = ({ w, h, children, glow = 0, style }) => {
  const legs = Math.floor(w / 46);
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      {[0, 1].map((side) => (
        <div key={side} style={{ position: "absolute", left: 20, right: 20, top: side ? h - 2 : -16, height: 18, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: legs }).map((_, i) => (
            <div key={i} style={{ width: 14, height: 18, background: P.gold, borderRadius: 2 }} />
          ))}
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: P.chip, borderRadius: 14, border: `3px solid #2A3A33`, boxShadow: `0 0 ${50 * glow}px rgba(233,185,73,${0.6 * glow})`, padding: "18px 26px" }}>{children}</div>
    </div>
  );
};

// 1. 훅: 세 칩에 영업이익이 찍힘
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { k: S.name, v: `${S.op}`, u: "조 원", at: 40 },
    { k: H.name, v: `${H.op}`, u: "조 원", at: 70 },
    { k: G.name, v: `${G.op}`, u: "억 달러", at: 100 },
  ];
  return (
    <>
      <Head sub="7~9월 영업이익">3분기 성적표</Head>
      {rows.map((r, i) => {
        const s = useIn(r.at - 25);
        const lit = frame >= r.at;
        return (
          <Chip key={r.k} w={860} h={230} glow={lit ? 1 : 0} style={{ position: "absolute", left: 110, top: 420 + i * 290, opacity: s, transform: `translateX(${(1 - s) * -120}px)` }}>
            <div style={{ fontFamily: black, fontSize: 44, color: P.dim }}>{r.k}</div>
            <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 120, lineHeight: 1.05, color: lit ? P.gold : "#33433C" }}>
              {r.v}
              <span style={{ fontFamily: black, fontSize: 48, color: P.silk, marginLeft: 12 }}>{r.u}</span>
            </div>
          </Chip>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "삼성전자 · SK하이닉스 · 구글, 3분기 성적표가 나왔습니다", from: 5, to: 85, em: ["3분기"] },
          { text: "영업이익부터 나란히 놓아 봤습니다", from: 85, to: 150, em: ["영업이익부터"] },
        ]}
      />
    </>
  );
};

// 2. 삼성전자: 1년 전 12.2조 → 107.4조 · 반도체 vs 폰 · 가전
const SamsungScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [30, 90], [0, 1], clamp);
  const split = frame >= 130;
  const maxH = 520;
  return (
    <>
      <Head sub={S.date}>{S.name}</Head>
      {!split ? (
        <div style={{ position: "absolute", top: 420, left: 140, right: 140, height: 640, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
          {[
            { k: "1년 전", v: S.opPrev, c: P.dim },
            { k: "올해 3분기", v: S.op, c: P.up },
          ].map((b, i) => (
            <div key={b.k} style={{ textAlign: "center", width: 280 }}>
              <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 80, color: b.c }}>{i ? (b.v * grow).toFixed(1) : b.v}<span style={{ fontFamily: kr, fontWeight: 700, fontSize: 38 }}>조</span></div>
              <div style={{ height: (b.v / S.op) * maxH * (i ? grow : 1), background: b.c, borderRadius: "14px 14px 0 0", boxShadow: i ? `0 0 40px rgba(255,75,75,0.5)` : "none" }} />
              <div style={{ fontFamily: black, fontSize: 38, color: P.silk, marginTop: 14 }}>{b.k}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "absolute", top: 420, left: 90, right: 90 }}>
          <div style={{ fontFamily: black, fontSize: 40, color: P.dim, textAlign: "center", marginBottom: 20 }}>영업이익 {S.op}조 중</div>
          {[
            { k: "반도체 (DS)", v: S.ds.op, c: P.up, note: `이익률 ${S.ds.margin}%` },
            { k: "폰 · TV · 가전 (DX)", v: S.dx.op, c: P.down, note: "영업손실" },
          ].map((r, i) => {
            const o = interpolate(frame, [140 + i * 25, 155 + i * 25], [0, 1], clamp);
            return (
              <Chip key={r.k} w={900} h={250} style={{ marginBottom: 50, opacity: o }}>
                <div style={{ fontFamily: black, fontSize: 42, color: P.silk }}>{r.k}</div>
                <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 110, color: r.c, lineHeight: 1.05 }}>
                  {r.v > 0 ? "+" : ""}
                  {r.v}
                  <span style={{ fontFamily: black, fontSize: 44, color: P.silk, marginLeft: 10 }}>조 원</span>
                  <span style={{ fontFamily: kr, fontWeight: 700, fontSize: 36, color: P.dim, marginLeft: 24 }}>{r.note}</span>
                </div>
              </Chip>
            );
          })}
        </div>
      )}
      {!split && (
        <Stamp at={100} color={P.gold} rotate={-7} style={{ top: 470, left: 330, fontSize: 64, fontFamily: black, background: "rgba(14,59,46,0.9)" }}>
          약 8.8배
        </Stamp>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "삼성전자 영업이익 107조, 1년 새 약 8.8배", from: 8, to: 130, em: ["107조,", "8.8배"] },
          { text: "그중 106.5조가 반도체, 폰 · 가전은 8천억 적자", from: 130, to: 270, em: ["106.5조가", "적자"] },
        ]}
      />
    </>
  );
};

// 3. SK하이닉스: 매출 100조 돌파 · 1만 원 팔면 8천 원
const HynixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rev = interpolate(frame, [15, 75], [0, H.rev], clamp);
  const coinsOn = frame >= 110;
  return (
    <>
      <Head sub={H.date}>{H.name}</Head>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [100, 112], [1, 0.0], clamp) }}>
        <div style={{ fontFamily: black, fontSize: 44, color: P.dim }}>분기 매출</div>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 230, color: rev >= 100 ? P.gold : P.silk, lineHeight: 1 }}>
          {rev.toFixed(1)}
          <span style={{ fontFamily: black, fontSize: 70 }}>조</span>
        </div>
        <div style={{ margin: "30px auto 0", width: 800, height: 34, background: P.chip, borderRadius: 17, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(rev / 110) * 100}%`, background: P.up }} />
          <div style={{ position: "absolute", left: `${(100 / 110) * 100}%`, top: -4, bottom: -4, width: 6, background: P.gold }} />
        </div>
        <div style={{ width: 800, margin: "8px auto", textAlign: "right", paddingRight: 40, fontFamily: kr, fontWeight: 700, fontSize: 34, color: P.gold }}>100조 선 · 처음 돌파</div>
      </div>
      {coinsOn && (
        <div style={{ position: "absolute", top: 400, left: 80, right: 80, textAlign: "center" }}>
          <div style={{ fontFamily: black, fontSize: 52, color: P.silk }}>1만 원어치 팔면</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, marginTop: 40, width: 700, marginLeft: "auto", marginRight: "auto" }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const kept = i < H.margin / 10;
              const o = interpolate(frame, [115 + i * 4, 122 + i * 4], [0, 1], clamp);
              return (
                <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: kept ? P.gold : "transparent", border: `6px solid ${kept ? "#B8862A" : P.dim}`, opacity: o, fontFamily: oswald, fontWeight: 700, fontSize: 36, color: kept ? P.chip : P.dim, lineHeight: "108px" }}>
                  1천
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: black, fontSize: 60, color: P.gold, marginTop: 44, opacity: interpolate(frame, [170, 182], [0, 1], clamp) }}>
            8천 원이 영업이익 <span style={{ fontFamily: oswald, color: P.silk }}>({H.margin}%)</span>
          </div>
          <div style={{ fontFamily: kr, fontWeight: 700, fontSize: 36, color: P.dim, marginTop: 14, opacity: interpolate(frame, [185, 197], [0, 1], clamp) }}>
            영업이익 {H.op}조 · 1년 전보다 약 7.3배
          </div>
        </div>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "SK하이닉스는 분기 매출이 처음 100조를 넘었고", from: 8, to: 110, em: ["100조를"] },
          { text: "이익률 80%, 1만 원 팔면 8천 원이 남았습니다", from: 110, to: 240, em: ["80%,", "8천"] },
        ]}
      />
    </>
  );
};

// 4. 알파벳: 클라우드 2배 · 이익 3.1배 → 순이익 -24% (주식 평가손실) → 설비투자 2.1배
const GoogleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = (at: number) => interpolate(frame, [at, at + 14], [0, 1], clamp);
  const rows = [
    { k: "구글 클라우드 매출", v: `${G.cloudRev}억 달러`, d: `+${G.cloudRevPct}%`, c: P.up, at: 15 },
    { k: "구글 클라우드 영업이익", v: `${G.cloudOp}억 달러`, d: "약 3.1배", c: P.up, at: 50 },
    { k: "알파벳 순이익", v: `${G.net}억 달러`, d: `${G.netPct}%`, c: P.down, at: 120, note: `보유 주식 평가손실 ${G.equityLoss}억 달러` },
    { k: "설비투자 (서버 · 데이터센터 등)", v: `${G.capex}억 달러`, d: "약 2.1배", c: P.up, at: 210 },
  ];
  return (
    <>
      <Head sub={`${G.date} · 매출 ${won(G.rev)}억 달러 +${G.revPct}% · 영업이익 ${G.op}억 달러 +${G.opPct}%`}>알파벳(구글)</Head>
      {rows.map((r, i) => (
        <div key={r.k} style={{ position: "absolute", top: 400 + i * 225, left: 80, right: 80, height: 200, background: P.chip, borderRadius: 18, borderLeft: `14px solid ${r.c}`, padding: "18px 30px", opacity: card(r.at), transform: `translateX(${(1 - card(r.at)) * 80}px)` }}>
          <div style={{ fontFamily: kr, fontWeight: 700, fontSize: 38, color: P.dim }}>{r.k}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 84, color: P.silk }}>{r.v.replace(/억 달러/, "")}<span style={{ fontFamily: kr, fontWeight: 700, fontSize: 38 }}>억 달러</span></div>
            <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 64, color: r.c }}>{r.d.replace(/약 /, "")}<span style={{ fontFamily: kr, fontWeight: 700, fontSize: 32 }}>{r.d.startsWith("약") ? "" : ""}</span></div>
          </div>
          {r.note && <div style={{ position: "absolute", right: 26, top: 22, fontFamily: kr, fontWeight: 700, fontSize: 30, color: P.down }}>{r.note}</div>}
        </div>
      ))}
      <Caption
        bottom={400}
        lines={[
          { text: "구글은 클라우드 매출이 1년 새 2배, 이익은 3.1배", from: 8, to: 120, em: ["2배,", "3.1배"] },
          { text: "그런데 순이익은 24% 줄었습니다, 보유 주식 평가손실 때문", from: 120, to: 210, em: ["24%", "평가손실"] },
          { text: "설비투자도 1년 새 2.1배, 514억 달러", from: 210, to: 300, em: ["2.1배,"] },
        ]}
      />
    </>
  );
};

// 5. 1만 원 팔면 남는 영업이익: 가로 막대 5개
const MarginScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Head sub="영업이익률 × 1만 원 · 통화가 달라 금액 대신 비율로 비교">1만 원 팔면 얼마 남나</Head>
      {D.margins.map((m, i) => {
        const g = interpolate(frame, [20 + i * 14, 60 + i * 14], [0, 1], clamp);
        const chipCo = i < 3;
        return (
          <div key={m.k} style={{ position: "absolute", top: 420 + i * 175, left: 80, right: 80 }}>
            <div style={{ fontFamily: black, fontSize: 38, color: chipCo ? P.silk : P.dim }}>{m.k}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8 }}>
              <div style={{ width: (m.v / 100) * 760 * g, height: 70, background: chipCo ? P.gold : P.dim, borderRadius: 10 }} />
              <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 60, color: chipCo ? P.gold : P.silk, opacity: g }}>{won(Math.round(m.v * 100 * g))}<span style={{ fontFamily: kr, fontWeight: 700, fontSize: 32 }}>원</span></div>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "1만 원어치 팔아 남긴 영업이익으로 줄 세우면", from: 8, to: 120, em: ["1만", "원어치"] },
          { text: "메모리 두 회사가 구글의 2배 넘게 남겼습니다", from: 120, to: 240, em: ["2배"] },
        ]}
      />
    </>
  );
};

// 6. 하루 영업이익 + 고지
const PerdayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { k: S.name, v: "1조 1,679억", u: "원" },
    { k: H.name, v: "9,058억", u: "원" },
    { k: G.name, v: "4.4억", u: "달러" },
  ];
  return (
    <>
      <Head sub={`3분기 ${D.days}일로 나눈 영업이익 · 직접 계산`}>하루에 얼마?</Head>
      {rows.map((r, i) => {
        const o = interpolate(frame, [15 + i * 18, 28 + i * 18], [0, 1], clamp);
        return (
          <div key={r.k} style={{ position: "absolute", top: 420 + i * 190, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px dashed ${P.line}`, paddingBottom: 18, opacity: o }}>
            <div style={{ fontFamily: black, fontSize: 44, color: P.dim }}>{r.k}</div>
            <div style={{ fontFamily: black, fontSize: 70, color: P.gold }}>
              {r.v}
              <span style={{ fontSize: 36, color: P.silk }}> {r.u}</span>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1030, left: 80, right: 80, textAlign: "center", fontFamily: kr, fontWeight: 700, fontSize: 30, color: P.dim, lineHeight: 1.6, opacity: interpolate(frame, [70, 82], [0, 1], clamp) }}>
        투자 권유 아님 · 주가 전망 없음 · SK하이닉스는 감사 전 잠정
        <br />
        출처: 알파벳 SEC 공시 · SK하이닉스 뉴스룸 · 삼성전자 확정 실적 보도
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "하루로 나누면 삼성전자는 매일 1조 넘게 벌었습니다", from: 8, to: 100, em: ["1조"] },
          { text: "투자 권유가 아닌 발표 실적 정리입니다", from: 100, to: 180, em: ["발표", "실적"] },
        ]}
      />
    </>
  );
};

const TopBand: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: kr, fontWeight: 700, fontSize: 30, color: P.chip, background: P.gold, borderRadius: 8, padding: "6px 22px" }}>{D.asOf} · 숫자로 보는 요즘</span>
  </div>
);

const SCENES: Record<string, React.FC> = { hook: HookScene, samsung: SamsungScene, hynix: HynixScene, google: GoogleScene, margin: MarginScene, perday: PerdayScene };

export const Q3chipsShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.pcb }}>
    <Audio src={staticFile("bgm/q3chips.wav")} volume={0.7} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Board />
          <Scene />
          {i > 0 && <Current />}
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
