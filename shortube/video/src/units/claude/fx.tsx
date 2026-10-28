import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadKr } from "@remotion/google-fonts/IBMPlexSansKR";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import TL from "../../../../content/claude/script/timeline.json";

// 앤트로픽 S-1 쇼츠 전용 화면 효과 — 리걸 패드(파란 괘선 · 빨간 여백선) 위 먹색 글자 · 형광펜 막대 · 검은 가림막 전환.
// 회사 · 제품 로고(별 모양 포함)는 쓰지 않는다. 이름은 글자로만.
export const { fontFamily: mono } = loadMono("normal", { weights: ["500", "700"] });
export const { fontFamily: kr } = loadKr("normal", { weights: ["500", "700"] });

export const P = {
  paper: "#FBFAF3",
  rule: "rgba(70,120,200,0.22)",
  margin: "rgba(220,70,70,0.55)",
  ink: "#1B1F2A",
  dim: "#6A6F7E",
  hi: "#C8F54A",
  hiSoft: "rgba(200,245,74,0.55)",
  black: "#121212",
  red: "#D9473F",
  blue: "#2F5FD0",
};

// 억 달러 표기 (백만 달러 → 억 달러, 소수 한 자리)
export const eok = (m: number) => (m / 100).toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// 리걸 패드 바탕: 가로 괘선 + 왼쪽 빨간 여백선 + 위쪽 구멍 자국
export const Paper: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => (
  <AbsoluteFill style={{ background: P.paper }}>
    <AbsoluteFill
      style={{
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, ${P.rule} 63px 65px)`,
        backgroundPositionY: -scroll,
      }}
    />
    <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 3, background: P.margin }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(27,31,42,0.10) 100%)" }} />
  </AbsoluteFill>
);

// 장면 전환: 검은 가림막(redaction) 막대 세 줄이 엇갈려 화면을 덮었다가 오른쪽으로 빠진다. 그 사이 서류가 위로 넘어간다
export const Redact: React.FC<{ children: React.ReactNode; first?: boolean; dur: number }> = ({ children, first, dur }) => {
  const frame = useCurrentFrame();
  const show = first ? 1 : interpolate(frame, [9, 10], [0, 1], clamp);
  const scroll = interpolate(frame, [0, dur], [0, 70]); // 서류를 읽어 내려가는 느린 스크롤
  const slide = first ? 0 : interpolate(frame, [8, 20], [180, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill>
      <Paper scroll={scroll} />
      <AbsoluteFill style={{ opacity: show, transform: `translateY(${slide - scroll * 0.4}px)` }}>{children}</AbsoluteFill>
      {!first &&
        frame < 24 &&
        [0, 1, 2].map((i) => {
          const x = interpolate(frame, [i * 2, 8 + i * 2, 12 + i * 2, 22 + i * 2], [-1200, 0, 0, 1200], clamp);
          return <div key={i} style={{ position: "absolute", left: x, top: i * 640, width: 1080, height: 650, background: P.black }} />;
        })}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  const [y, m, d] = TL.asOf.split("-");
  return (
    <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center", opacity: o }}>
      <span style={{ fontFamily: kr, fontSize: 27, fontWeight: 700, color: P.paper, background: P.ink, borderRadius: 8, padding: "8px 22px" }}>
        {`${y}.${m}.${d} 앤트로픽 S-1 공시 기준 · 투자 권유 아님`}
      </span>
    </div>
  );
};

// 형광펜으로 칠해지는 가로 막대 (p: 0~1 진행)
export const Highlight: React.FC<{ w: number; h: number; p: number; color?: string; style?: React.CSSProperties }> = ({ w, h, p, color = P.hi, style }) => (
  <div style={{ width: w * p, height: h, background: color, borderRadius: "6px 18px 10px 4px", transform: "skewX(-6deg)", ...style }} />
);
