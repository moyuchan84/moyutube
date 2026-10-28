import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Line } from "../../components/Caption";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";
import { fmt, InkStamp, T, Txt } from "./fx";
import D from "../../../../content/tax/script/data.json";

// 숫자는 output/briefs/2026-10-20_tax.md 사실 카드와 src/tax/data.json 에서만 가져온다.
// 취득세 본세만 계산 (지방교육세 · 농어촌특별세 제외). 인물 · 사진 · 로고 없음.

const T75 = D.tiers[1];

// 0. 훅
const HOOK_L: Line[] = [{ text: "같은 7억 5천만 원 집인데 취득세가 6배 차이 나요", from: 14, to: 120, em: ["6배"] }];
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - 34, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={40} color={T.dim}>집값 7억 5천만 원 · 취득세</Txt>
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center", opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: T.one }}>1주택</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: T.one, fontVariantNumeric: "tabular-nums" }}>{fmt(T75.one)} 원</div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", opacity: b, transform: `scale(${0.7 + 0.3 * b})` }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: T.three }}>조정대상지역 3주택</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: T.three, fontVariantNumeric: "tabular-nums" }}>{fmt(T75.three)} 원</div>
      </div>
      <Caption bottom={400} lines={HOOK_L} />
    </AbsoluteFill>
  );
};

// 1. 1주택 세율 계단 — 6억 이하 1%, 6~9억 1→3%, 9억 초과 3%
const RAMP_L: Line[] = [
  { text: "1주택 취득세율은 6억 이하 1%, 9억 초과 3%", from: 10, to: 130, em: ["1%,", "3%"] },
  { text: "6~9억은 1%에서 3%로 올라가요. 7억 5천만 원이면 2%", from: 132, to: 270, em: ["1%에서", "3%로", "2%"] },
];
const px = (p: number) => 140 + (p - 4) * 120;
const py = (r: number) => 900 - r * 160;
export const RampScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [14, 120], [0, 1], clamp);
  const dot = interpolate(frame, [130, 150], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={40} color={T.dim}>1주택 주택 매매 취득세율 (취득가액별)</Txt>
      <svg width={1080} height={1000} style={{ position: "absolute", top: 0, left: 0 }}>
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <line x1={140} x2={980} y1={py(r)} y2={py(r)} stroke={T.line} strokeWidth={2} />
            <text x={118} y={py(r) + 12} textAnchor="end" fontSize={34} fontWeight={700} fill={T.dim} fontFamily={fontFamily}>{r}%</text>
          </g>
        ))}
        {[5, 6, 7.5, 9, 11].map((p) => (
          <text key={p} x={px(p)} y={950} textAnchor="middle" fontSize={32} fontWeight={700} fill={T.dim} fontFamily={fontFamily}>{p === 7.5 ? "7.5억" : `${p}억`}</text>
        ))}
        <path d={`M ${px(4)} ${py(1)} L ${px(6)} ${py(1)} L ${px(9)} ${py(3)} L ${px(11)} ${py(3)}`} fill="none" stroke={T.one} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <line x1={px(7.5)} x2={px(7.5)} y1={py(2)} y2={900} stroke={T.stamp} strokeWidth={4} strokeDasharray="10 8" opacity={dot} />
        <circle cx={px(7.5)} cy={py(2)} r={20 * dot} fill={T.stamp} />
      </svg>
      <div style={{ position: "absolute", top: py(1) + 20, left: px(4), fontSize: 36, fontWeight: 700, color: T.one, opacity: draw > 0.2 ? 1 : 0 }}>6억 이하 1%</div>
      <div style={{ position: "absolute", top: py(2) - 80, left: px(7.5) - 280, width: 250, textAlign: "right", fontSize: 40, fontWeight: 900, color: T.stamp, opacity: dot }}>7.5억 → 2%</div>
      <div style={{ position: "absolute", top: py(3) - 62, left: px(9.2), fontSize: 36, fontWeight: 700, color: T.one, opacity: draw > 0.9 ? 1 : 0 }}>9억 초과 3%</div>
      <Caption bottom={400} lines={RAMP_L} />
    </AbsoluteFill>
  );
};

// 2. 중과 — 조정대상지역 2주택 8%, 3주택 이상 12%
const SUR_L: Line[] = [
  { text: "조정대상지역에서 2주택이면 8%", from: 10, to: 120, em: ["8%"] },
  { text: "같은 지역 3주택 이상은 12%가 붙어요", from: 122, to: 240, em: ["12%"] },
];
const ROWS = [
  { label: "1주택 (일반세율)", pct: 3, show: "1~3%", color: T.one, at: 14 },
  { label: "조정대상지역 2주택", pct: 8, show: "8%", color: T.two, at: 56 },
  { label: "조정대상지역 3주택 이상", pct: 12, show: "12%", color: T.three, at: 126 },
];
export const SurchargeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const unit = 640 / 12;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {ROWS.map((r, i) => {
        const p = interpolate(frame, [r.at, r.at + 28], [0, 1], clamp);
        const top = 300 + i * 250;
        return (
          <div key={r.label} style={{ opacity: Math.min(1, p * 3) }}>
            <div style={{ position: "absolute", top, left: 90, fontSize: 40, fontWeight: 700, color: T.ink }}>{r.label}</div>
            <div style={{ position: "absolute", top: top + 64, left: 90, width: r.pct * unit * p, height: 100, background: r.color, borderRadius: "0 18px 18px 0" }} />
            <div style={{ position: "absolute", top: top + 64, left: 90 + r.pct * unit * p + 20, fontSize: 72, fontWeight: 900, color: r.color, lineHeight: "100px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{r.show}</div>
          </div>
        );
      })}
      <InkStamp at={60} color={T.two} rotate={7} style={{ top: 330, right: 90, fontSize: 36 }}>중과</InkStamp>
      <Txt top={1060} size={32} weight={500} color={T.dim} at={150}>조정대상지역이 아니면 3주택부터 8%, 4주택부터 12%</Txt>
      <Caption bottom={400} lines={SUR_L} />
    </AbsoluteFill>
  );
};

// 3. 가격대별 금액표
const TAB_L: Line[] = [
  { text: "5억 집은 500만 원 vs 6,000만 원", from: 10, to: 110, em: ["500만", "6,000만"] },
  { text: "7억 5천만 원 집은 1,500만 원 vs 9,000만 원", from: 112, to: 220, em: ["1,500만", "9,000만"] },
  { text: "12억 집은 3,600만 원 vs 1억 4,400만 원", from: 222, to: 330, em: ["3,600만", "1억", "4,400만"] },
];
const COLX = [265, 495, 725];
export const TableScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, opacity: head }}>
        {["1주택", "조정 2주택", "조정 3주택+"].map((h, i) => (
          <div key={h} style={{ position: "absolute", left: COLX[i], width: 240, textAlign: "center", fontSize: 34, fontWeight: 900, color: [T.one, T.two, T.three][i] }}>{h}</div>
        ))}
        <div style={{ position: "absolute", left: 70, width: 200, textAlign: "center", fontSize: 28, fontWeight: 500, color: T.dim }}>집값</div>
      </div>
      {D.tiers.map((t, ri) => {
        const at = 14 + ri * 100;
        const row = spring({ frame: frame - at, fps, config: { damping: 16 } });
        const top = 310 + ri * 230;
        return (
          <div key={t.label} style={{ opacity: Math.min(1, row * 2), transform: `translateY(${(1 - row) * 30}px)` }}>
            <div style={{ position: "absolute", top, left: 60, right: 60, height: 200, background: T.card, borderRadius: 24, border: `3px solid ${T.line}` }} />
            <div style={{ position: "absolute", top: top + 60, left: 70, width: 200, textAlign: "center", fontSize: 44, fontWeight: 900, color: T.ink }}>{t.label}</div>
            {[t.one, t.two, t.three].map((v, ci) => {
              const c = spring({ frame: frame - at - 10 - ci * 8, fps, config: { damping: 11 } });
              return (
                <div key={ci} style={{ position: "absolute", top: top + 58, left: COLX[ci], width: 240, textAlign: "center", fontSize: 42, fontWeight: 900, color: [T.one, T.two, T.three][ci], whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", opacity: Math.min(1, c), transform: `scale(${0.7 + 0.3 * Math.min(1, c)})` }}>
                  {fmt(v)}
                </div>
              );
            })}
          </div>
        );
      })}
      <Txt top={1010} size={30} weight={500} color={T.dim} at={30}>단위 원 · 취득세 본세 (지방교육세 등 제외) · 자체 계산</Txt>
      <Caption bottom={400} lines={TAB_L} />
    </AbsoluteFill>
  );
};

// 4. 배수 vs 금액 차이
const RAT_L: Line[] = [
  { text: "배수로 보면 12배, 6배, 4배. 집값이 오를수록 배수는 줄어요", from: 10, to: 120, em: ["12배,", "6배,", "4배."] },
  { text: "그런데 금액 차이는 5,500만 원에서 1억 800만 원으로 커져요", from: 122, to: 240, em: ["5,500만", "1억", "800만"] },
];
export const RatioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={38} color={T.dim}>조정대상지역 3주택 ÷ 1주택</Txt>
      {D.tiers.map((t, i) => {
        const a = spring({ frame: frame - (14 + i * 28), fps, config: { damping: 10 } });
        const b = spring({ frame: frame - (124 + i * 24), fps, config: { damping: 14 } });
        const left = 70 + i * 320;
        const ratio = Math.round(t.three / t.one);
        return (
          <div key={t.label}>
            <div style={{ position: "absolute", top: 330, left, width: 300, textAlign: "center", fontSize: 40, fontWeight: 700, color: T.ink, opacity: Math.min(1, a) }}>{t.label}</div>
            <div style={{ position: "absolute", top: 400, left, width: 300, textAlign: "center", fontSize: 130, fontWeight: 900, color: T.three, opacity: Math.min(1, a), transform: `scale(${0.6 + 0.4 * Math.min(1, a)})`, whiteSpace: "nowrap" }}>{ratio}배</div>
            <div style={{ position: "absolute", top: 640, left, width: 300, textAlign: "center", fontSize: 30, fontWeight: 500, color: T.dim, opacity: Math.min(1, b) }}>금액 차이</div>
            <div style={{ position: "absolute", top: 690, left, width: 300, textAlign: "center", fontSize: 44, fontWeight: 900, color: T.ink, opacity: Math.min(1, b), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{fmt(t.three - t.one)}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 580, left: 70, right: 70, height: 4, background: T.line }} />
      <Txt top={860} size={50} weight={900} at={150}>
        배수 <span style={{ color: T.one }}>↓</span> &nbsp; 금액 차이 <span style={{ color: T.three }}>↑</span>
      </Txt>
      <Caption bottom={400} lines={RAT_L} />
    </AbsoluteFill>
  );
};

// 5. 예외와 한계
const CAV_L: Line[] = [
  { text: "예외가 있고 지방교육세 등은 따로예요", from: 10, to: 100, em: ["예외가", "따로예요"] },
  { text: "조정대상지역 지정에 따라 달라지니 꼭 확인하세요", from: 102, to: 180, em: ["확인하세요"] },
];
const CAVS = [
  "일시적 2주택 등은 중과 예외",
  "비수도권 공시가격 2억 원 이하 주택은 주택 수와 관계없이 중과 제외 (2025.1.2 이후 취득분)",
  "지방교육세 등 부가세는 뺀 취득세 본세만",
  "조정대상지역 지정 여부에 따라 달라짐",
];
export const CaveatScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Txt top={240} size={42} weight={900}>이 숫자에서 빠진 것</Txt>
      {CAVS.map((c, i) => {
        const o = interpolate(frame, [14 + i * 16, 28 + i * 16], [0, 1], clamp);
        return (
          <div key={c} style={{ position: "absolute", top: 320 + i * 140, left: 80, right: 80, fontSize: 34, fontWeight: 700, color: T.ink, lineHeight: 1.35, opacity: o, background: T.card, borderRadius: 20, border: `3px solid ${T.line}`, padding: "14px 24px", transform: `translateX(${(1 - o) * 40}px)` }}>
            {c}
          </div>
        );
      })}
      <Txt top={950} size={30} weight={500} color={T.dim} at={90}>세금 조언이 아닌 제도 숫자 정리예요. 개별 사례는 세무 전문가 · 지자체에 확인하세요</Txt>
      <Caption bottom={400} lines={CAV_L} />
    </AbsoluteFill>
  );
};

// 6. 맺음 — 출처
const OUT_L: Line[] = [{ text: "지방세법 기준으로 직접 계산한 값이에요", from: 10, to: 150, em: ["직접", "계산한"] }];
export const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Txt top={260} size={40} weight={900}>자료 출처</Txt>
    <Txt top={350} size={34} weight={500} at={8}>지방세법 제11조 · 제13조의2<br />(국가법령정보센터, 2026.7.1 시행)</Txt>
    <Txt top={500} size={34} weight={500} at={16}>행정안전부 정책브리핑 (korea.kr)<br />취득세 중과 안내</Txt>
    <Txt top={650} size={34} weight={500} color={T.dim} at={24}>2026.10.20 확인 · 취득세 본세 자체 계산</Txt>
    <InkStamp at={30} rotate={-5} style={{ top: 800, left: 300, fontSize: 52 }}>제도 숫자 정리</InkStamp>
    <Caption bottom={400} lines={OUT_L} />
  </AbsoluteFill>
);
