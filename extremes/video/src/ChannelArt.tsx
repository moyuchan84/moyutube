import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, fontFamily } from "./theme";

// 채널 배너 (2560×1440) · 프로필 (800×800). 렌더:
//   npx remotion still ChannelBanner ../content/_common/channel/banner.png
//   npx remotion still ChannelAvatar ../content/_common/channel/avatar.png
// 배너는 모든 기기에서 보이는 가운데 1546×423 (x 507~2053, y 508~931) 안에 글자를 모두 둔다.
// 채널 범위: 장소만이 아니라 미스터리 · TOP 5/10 순위 전반 → 특정 소재를 박지 않고 "순위 + 숨겨진 답(?)" 모양으로.
const RED = "#FF3B4E";

// 오른쪽: 끝까지 가 본 곳 카드 3장 — 실제 사진(공공 도메인 · CC0) + 깊이 · 높이 숫자
const CARDS = [
  { n: 1, img: "art/dive/wikimedia-4b0eb7d5.jpg", x: 1450, y: 560, s: 270, r: -4, label: "↓ 10,935 m" },
  { n: 2, img: "art/dive2/wikimedia-82cb3638.jpg", x: 1765, y: 600, s: 225, r: 5, label: "↓ 6,371 km" },
  { n: 3, img: "art/dive3/wikimedia-e6f66cf7.jpg", x: 2040, y: 640, s: 190, r: -3, label: "↑ 406,771 km" },
];

export const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #1A0408 0%, #02060F 60%)", fontFamily }}>
    {/* 옅은 격자 (기록 · 파일 느낌) */}
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.035) 2px, transparent 2px)", backgroundSize: "80px 80px" }} />
    {CARDS.map((c) => (
      <div key={c.n} style={{ position: "absolute", left: c.x, top: c.y, width: c.s, height: c.s, transform: `rotate(${c.r}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", border: `5px solid ${c.n === 1 ? RED : "rgba(255,255,255,0.5)"}`, boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
          <Img src={staticFile(c.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 0 10px", textAlign: "center", fontSize: c.s * 0.13, fontWeight: 900, color: "#fff", background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>{c.label}</div>
        </div>
        <div style={{ position: "absolute", left: -18, top: -34, fontSize: c.s * 0.3, fontWeight: 900, color: c.n === 1 ? RED : C.text, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}></div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 560, top: 515, width: 860, height: 410, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: 7, color: RED }}>DEEPEST · HIGHEST · STRANGEST</div>
      <div style={{ fontSize: 140, fontWeight: 900, letterSpacing: 10, color: C.text, lineHeight: 1, marginTop: 4 }}>EXTREMES</div>
      <div style={{ fontSize: 50, fontWeight: 900, color: C.text, marginTop: 18, lineHeight: 1.18 }}>
        How far can you go?<br /><span style={{ color: RED }}>One number. All the way.</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.dim, marginTop: 12 }}>세상에서 가장 깊고 · 높고 · 기묘한 곳, 끝까지</div>
    </div>
  </AbsoluteFill>
);

// 프로필: 빨간 원 + E + 아래 작은 "#1" — 작게 보여도 읽히게 단순하게
export const ChannelAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2A0508 0%, #02060F 70%)", fontFamily, alignItems: "center", justifyContent: "center" }}>
    <svg width="800" height="800" style={{ position: "absolute", inset: 0 }}>
      <circle cx={400} cy={400} r={310} fill="none" stroke={RED} strokeWidth={30} />
      <circle cx={400} cy={400} r={365} fill="none" stroke="rgba(255,59,78,0.55)" strokeWidth={9} strokeDasharray="44 38" />
    </svg>
    <div style={{ fontSize: 440, fontWeight: 900, color: C.text, lineHeight: 1, marginTop: -40 }}>E</div>
    <div style={{ position: "absolute", top: 505, fontSize: 80, fontWeight: 900, color: RED, letterSpacing: 2 }}>↕</div>
  </AbsoluteFill>
);
