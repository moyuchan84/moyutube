import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Caption, Line } from "../../../components/Caption";
import { KineticTitle, Pill } from "../../../components/Kinetic";
import { AS_OF, LONG_RUN, THIS_WEEK } from "../data";
import { C, fontFamily, springs } from "../../../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const HOOK_LINES: Line[] = [
  { text: "넷플릭스 한국 1위,", from: 0, to: 45, em: ["1위,"] },
  { text: "순위표 말고 그래프로 보면 다르게 보입니다.", from: 45, to: 105, em: ["그래프로"] },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 순위표 행들이 쓰러지고 그 자리에 선이 그어지는 전환
  const morph = interpolate(frame, [40, 80], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shake = frame < 20 ? Math.sin(frame * 2) * (20 - frame) * 0.6 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: 80, right: 80, transform: `translateX(${shake}px)` }}>
        <KineticTitle text="넷플릭스 한국 TOP 10" size={92} />
        <div style={{ marginTop: 20 }}>
          <KineticTitle text="그래프로 보면?" size={130} color={C.accent} delay={40} />
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const p = spring({ frame: frame - 6 - i * 4, fps, config: springs.snappy });
          const y = 900 + i * 110;
          return (
            <g key={i} opacity={p * (1 - morph)}>
              <rect x={120} y={y} width={840 * p} height={80} rx={16} fill="rgba(255,255,255,0.07)" />
              <text x={160} y={y + 54} fill={C.dim} fontFamily={fontFamily} fontWeight={900} fontSize={44}>
                {i + 1}
              </text>
            </g>
          );
        })}
        <path
          d="M140 1400 L380 1180 L620 1300 L940 960"
          stroke={C.accent}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1400}
          strokeDashoffset={1400 * (1 - morph)}
        />
      </svg>
      <Caption lines={HOOK_LINES} />
    </AbsoluteFill>
  );
};

export const LONG_LINES: Line[] = [
  { text: "오래 버티는 작품도 있습니다.", from: 0, to: 60 },
  { text: "'참교육'은 이번 주 10위지만 벌써 12주째.", from: 60, to: 160, em: ["12주째."] },
  { text: "다음으로 오래 있는 작품보다 3주 더 깁니다.", from: 160, to: 255, em: ["3주"] },
];

export const LongRunScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const unit = 62;
  const bar = (weeks: number, start: number) =>
    interpolate(frame, [start, start + 50], [0, weeks], { ...clamp, easing: Easing.out(Easing.cubic) });
  const a = bar(LONG_RUN.weeks, 60);
  const b = bar(LONG_RUN.nextLongest, 90);
  const diff = spring({ frame: frame - 165, fps, config: springs.bouncy });
  const row = (label: string, w: number, color: string, top: number) => (
    <div style={{ position: "absolute", left: 80, top }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: C.dim, marginBottom: 14 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: w * unit, height: 90, borderRadius: 18, background: color, boxShadow: `0 0 50px ${color}66` }} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: 72, color: C.text }}>{Math.round(w)}주</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, left: 80, right: 80 }}>
        <KineticTitle text="가장 오래 버틴 작품" size={96} />
        <div style={{ marginTop: 18 }}>
          <KineticTitle text="TOP 10 누적 주수" size={40} color={C.dim} delay={10} />
        </div>
      </div>
      {row(`${LONG_RUN.title} · 이번 주 ${LONG_RUN.rank}위`, a, "#4ADE80", 640)}
      {row("다음으로 긴 작품", b, "#3A4060", 900)}
      {frame > 165 && (
        <div style={{ position: "absolute", left: 80 + LONG_RUN.nextLongest * unit - 20, top: 1110 }}>
          <Pill color="#4ADE80" scale={diff}>+{LONG_RUN.weeks - LONG_RUN.nextLongest}주 더</Pill>
        </div>
      )}
      <Caption lines={LONG_LINES} />
    </AbsoluteFill>
  );
};

export const NEW_LINES: Line[] = [
  { text: "그리고 이번 주 새로 들어온 2편이", from: 0, to: 90, em: ["2편이"] },
  { text: "곧장 2위와 6위에 올랐어요.", from: 90, to: 195, em: ["2위와", "6위에"] },
];

export const NewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, left: 80, right: 80 }}>
        <KineticTitle text="이번 주 첫 진입" size={96} />
      </div>
      {THIS_WEEK.map((r, i) => {
        const p = spring({ frame: frame - 10 - i * 5, fps, config: springs.snappy });
        const stamp = spring({ frame: frame - 95 - (r.rank === 6 ? 12 : 0), fps, config: springs.bouncy });
        const top = 470 + i * 140;
        return (
          <div
            key={r.rank}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top,
              height: 112,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              padding: "0 36px",
              gap: 30,
              background: r.isNew ? "rgba(255,92,122,0.18)" : "rgba(255,255,255,0.06)",
              border: r.isNew ? `3px solid ${C.hot}` : "3px solid transparent",
              transform: `translateX(${(1 - p) * -900}px)`,
              fontFamily,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 56, color: r.isNew ? C.hot : C.dim, width: 60 }}>{r.rank}</div>
            <div style={{ fontWeight: 700, fontSize: 46, color: r.label ? C.text : C.dim }}>{r.label || "—"}</div>
            {r.isNew && frame > 95 && (
              <div style={{ marginLeft: "auto", transform: `scale(${stamp}) rotate(${(1 - stamp) * -30 - 6}deg)` }}>
                <Pill color={C.hot}>NEW</Pill>
              </div>
            )}
          </div>
        );
      })}
      <Caption lines={NEW_LINES} />
    </AbsoluteFill>
  );
};

export const OUTRO_LINES: Line[] = [
  { text: "9월 마지막 주 기준, 넷플릭스 공식 집계입니다.", from: 0, to: 65 },
  { text: "다음 주엔 기안장이 3주 연속일지 지켜보죠.", from: 65, to: 135, em: ["3주", "연속일지"] },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [70, 90], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 560, left: 80, right: 80, textAlign: "center" }}>
        <KineticTitle text="다음 주," size={110} />
        <div style={{ marginTop: 10, opacity: q, transform: `scale(${0.8 + q * 0.2})` }}>
          <KineticTitle text="3주 연속 1위?" size={130} color={C.accent} delay={70} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily,
          fontWeight: 500,
          fontSize: 30,
          color: C.dim,
        }}
      >
        {AS_OF}
      </div>
      <Caption lines={OUTRO_LINES} />
    </AbsoluteFill>
  );
};
