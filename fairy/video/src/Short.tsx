import { loadFont } from "@remotion/google-fonts/GowunBatang";
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import short from "./short.json";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"] });
const FONT = `${fontFamily}, 'Batang', 'Malgun Gothic', serif`;
const INK = "#3b3228";
const W = short.width, H = short.height;
const fr = (s: number) => Math.round(s * short.fps);
const WHO: Record<string, string> = short.look.colors;

type Seg = (typeof short.segs)[number];

// 16:9 그림에서 세로 창을 잘라 카메라 중심을 따라 천천히 움직인다. 그림 오른쪽 아래 생성 도구 표시는 밑을 잘라 가린다.
const Portrait: React.FC<{ seg: Seg }> = ({ seg }) => {
  const f = useCurrentFrame();
  const t = seg.from + f / short.fps;
  const p = interpolate(t, [seg.scene.start, seg.scene.end], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [x0, y0, w0, h0, x1, y1, w1, h1] = seg.scene.cam;
  const cx = (x0 + w0 / 2) + (x1 + w1 / 2 - (x0 + w0 / 2)) * p;
  // 가운데 창(1080x1100)에 그림을 보여 주고, 뒤는 같은 그림을 흐리게 깔아 세로 화면을 채운다
  const BOX = 1100, BTOP = 250;
  const ih = BOX * 1.07, iw = ih * (16 / 9);
  const left = Math.min(0, Math.max(W - iw, W / 2 - (cx / 320) * iw));
  const top = -(ih - BOX);
  const src = staticFile(`art/${short.slug}/${seg.img}.jpg`);
  return (
    <AbsoluteFill>
      <Img src={src} style={{ position: "absolute", left: -300, top: -100, width: H * 1.25 * (16 / 9), height: H * 1.25, maxWidth: "none", filter: "blur(36px) brightness(0.8)" }} />
      <div style={{ position: "absolute", left: 0, top: BTOP, width: W, height: BOX, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
        <Img src={src} style={{ position: "absolute", left, top, width: iw, height: ih, maxWidth: "none" }} />
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ sub: { who: string; text: string; from: number; to: number } }> = ({ sub }) => {
  const f = useCurrentFrame();
  const dur = fr(sub.to) - fr(sub.from);
  const op = interpolate(f, [0, 5, dur - 5, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const talk = sub.who !== "narr";
  const color = WHO[sub.who] ?? INK;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 330, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "26px 40px 30px", background: "rgba(255,250,236,0.94)", border: `4px solid ${talk ? color : "#d9c6a0"}`, borderRadius: 34, boxShadow: "0 10px 26px rgba(60,40,10,0.3)", fontFamily: FONT, fontSize: 64, lineHeight: 1.35, color: INK, textAlign: "center", fontWeight: talk ? 700 : 400, position: "relative", wordBreak: "keep-all" }}>
        {talk && <span style={{ position: "absolute", top: -26, left: 28, background: color, color: "#fff", fontSize: 34, fontWeight: 700, padding: "2px 22px 4px", borderRadius: 18 }}>{sub.who}</span>}
        {talk ? `“${sub.text}”` : sub.text}
      </div>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8, fr(2.6) - 10, fr(2.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: op }}>
      <div style={{ fontFamily: FONT, fontSize: 104, fontWeight: 700, lineHeight: 1.18, textAlign: "center", color: short.look.ink, whiteSpace: "pre-line", WebkitTextStroke: "16px #fffaf0", paintOrder: "stroke fill", textShadow: "0 8px 0 #0002" }}>{short.hook}</div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op, background: "rgba(40,28,12,0.35)" }}>
      <div style={{ fontFamily: FONT, textAlign: "center", background: "rgba(255,250,236,0.96)", borderRadius: 48, padding: "50px 56px 56px", margin: "0 60px", boxShadow: "0 14px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 50, color: INK, lineHeight: 1.4, wordBreak: "keep-all" }}>{short.cta}</div>
        <div style={{ fontSize: 86, fontWeight: 700, color: "#c0392b", marginTop: 26, lineHeight: 1.2 }}>전체 이야기 ▶</div>
        <div style={{ fontSize: 42, color: INK, marginTop: 20 }}>아래 ‘관련 동영상’에서 볼 수 있어요</div>
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC = () => {
  let at = 0;
  const bodyFrames = fr(short.segs.reduce((n, s) => n + s.dur, 0));
  return (
    <AbsoluteFill style={{ backgroundColor: "#f5ead2" }}>
      {short.segs.map((s, i) => {
        const start = at;
        const dur = fr(s.dur);
        at += dur;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Portrait seg={s} />
            <Audio src={staticFile(short.audio)} startFrom={fr(s.from)} endAt={fr(s.to)} volume={(f) => interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            {s.subs.map((c, k) => (
              <Sequence key={k} from={fr(c.from)} durationInFrames={Math.max(8, fr(c.to) - fr(c.from))}>
                <Caption sub={c} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={fr(2.6)}>
        <Hook />
      </Sequence>
      <Sequence from={bodyFrames} durationInFrames={fr(short.ctaSec)}>
        <Portrait seg={short.segs[short.segs.length - 1]} />
        <Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
