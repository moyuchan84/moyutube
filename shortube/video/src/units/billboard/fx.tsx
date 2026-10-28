import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp } from "../market/effects";
import { fontFamily } from "../../theme";

// 빌보드 200 K팝 1위 쇼츠 전용 화면 효과 — 모두 코드로 그린다 (사진·로고 없음).
export const B = {
  pink: "#FF3D9A",
  mint: "#3DFFC8",
  yellow: "#FFE14D",
  text: "#F7EEFF",
  dim: "#A58BC0",
  card: "rgba(30,8,48,0.78)",
  line: "rgba(255,160,220,0.28)",
};

// 천천히 도는 LP 판 (바이닐)
const Disc: React.FC<{ x: number; y: number; r: number; speed: number; hue: number }> = ({ x, y, r, speed, hue }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `repeating-radial-gradient(circle, hsl(${hue} 60% 12%) 0px, hsl(${hue} 60% 12%) 3px, hsl(${hue} 70% 20%) 4px, hsl(${hue} 60% 12%) 6px)`,
        border: `2px solid hsla(${hue} 90% 70% / 0.35)`,
        transform: `rotate(${frame * speed}deg)`,
        opacity: 0.55,
      }}
    >
      <div style={{ position: "absolute", left: "50%", top: "50%", width: r * 0.55, height: r * 0.55, marginLeft: -r * 0.275, marginTop: -r * 0.275, borderRadius: "50%", background: `hsl(${hue} 90% 60%)` }} />
      <div style={{ position: "absolute", left: "8%", top: "8%", width: "22%", height: "6%", background: "rgba(255,255,255,0.18)", borderRadius: 999, transform: "rotate(-35deg)" }} />
    </div>
  );
};

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1c0630 0%, #12041F 60%, #08020f 100%)" }}>
      <Disc x={940} y={420} r={420} speed={0.9} hue={320} />
      <Disc x={120} y={1260} r={360} speed={-0.7} hue={170} />
      {Array.from({ length: 26 }).map((_, i) => {
        const x = random(`sx${i}`) * 1080;
        const y = ((((random(`sy${i}`) * 2000 - frame * (0.4 + random(`ss${i}`) * 0.9)) % 2000) + 2000) % 2000);
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame / 14 + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 6, height: 6, borderRadius: "50%", background: i % 2 ? B.pink : B.mint, opacity: tw * 0.55 }} />;
      })}
    </AbsoluteFill>
  );
};

// 장면 전환: 오른쪽에서 왼쪽으로 밀려 들어오는 네온 선
export const SlideWipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 14], [0, 1], clamp);
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - e) * 100}%)` }}>
      {children}
      {p < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - e) * 100}%`, width: 8, background: B.mint, boxShadow: `0 0 40px ${B.pink}` }} />}
    </AbsoluteFill>
  );
};

export const TopBand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [10, 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily, opacity: o }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: B.text, background: "rgba(0,0,0,0.45)", borderRadius: 999, padding: "8px 26px" }}>
        빌보드 200 2026.4.4~9.5자 차트 · 보도 인용
      </span>
    </div>
  );
};
