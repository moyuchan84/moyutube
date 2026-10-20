import { loadFont } from "@remotion/google-fonts/GowunBatang";
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "./timeline.json";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"] });
const FONT = `${fontFamily}, 'Batang', 'Malgun Gothic', serif`;

const PAPER = "#f5ead2";
const INK = "#3b3228";
const FADE = 20; // 장면 사이 겹치는 프레임 (쪽 넘김 느낌의 부드러운 전환)
const PAD = 36; // 그림 둘레 종이 여백
const WHO: Record<string, string> = { 준이: "#c0392b", 선호: "#2f6fa8", 민지: "#3c8a55", 친구: "#c9822b" };

type Cam = number[];
type Img = { id: string; from: number; to: number };
type Sub = { who: string; text: string; from: number; to: number };

const fr = (s: number) => Math.round(s * timeline.fps);

// 카메라: 320x180 좌표의 시작 → 끝 네모를 천천히 오가며 보여 준다
const Shot: React.FC<{ src: string; cam: Cam; W: number; H: number; frames: number }> = ({ src, cam, W, H, frames }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, Math.max(1, frames)], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [x0, y0, w0, , x1, y1, w1] = cam;
  const x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p, w = w0 + (w1 - w0) * p;
  const s = (320 / w) * 1.07; // 7% 키워 그림 모서리의 생성 도구 표시가 화면 밖으로 나가게 한다
  const iw = W * s, ih = H * s;
  const left = Math.min(0, Math.max(W - iw, -(x / 320) * iw));
  const top = Math.min(0, Math.max(H - ih, -(y / 180) * ih));
  return <Img src={staticFile(`art/${src}.jpg`)} style={{ position: "absolute", left, top, width: iw, height: ih, maxWidth: "none" }} />;
};

// 한 장면(또는 열 컷 중 한 그림)
const Page: React.FC<{ img: Img; cam: Cam; W: number; H: number }> = ({ img, cam, W, H }) => {
  const f = useCurrentFrame();
  const dur = fr(img.to) - fr(img.from);
  const op = interpolate(f, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Shot src={img.id} cam={cam} W={W} H={H} frames={dur + FADE} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ sub: Sub }> = ({ sub }) => {
  const f = useCurrentFrame();
  const dur = fr(sub.to) - fr(sub.from);
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(f, [0, 8], [10, 0], { extrapolateRight: "clamp" });
  const talk = sub.who !== "narr";
  const color = WHO[sub.who] ?? INK;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${rise}px)` }}>
      <div
        style={{
          maxWidth: 1500,
          padding: "20px 46px 24px",
          background: "rgba(255,250,236,0.93)",
          border: `3px solid ${talk ? color : "#d9c6a0"}`,
          borderRadius: 26,
          boxShadow: "0 8px 22px rgba(60,40,10,0.25)",
          fontFamily: FONT,
          fontSize: 56,
          lineHeight: 1.35,
          color: INK,
          textAlign: "center",
          fontWeight: talk ? 700 : 400,
          position: "relative",
        }}
      >
        {talk && (
          <span style={{ position: "absolute", top: -24, left: 30, background: color, color: "#fff", fontSize: 30, fontWeight: 700, padding: "2px 20px 4px", borderRadius: 16 }}>{sub.who}</span>
        )}
        {talk ? `“${sub.text}”` : sub.text}
      </div>
    </div>
  );
};

const Cover: React.FC<{ end?: boolean; frames: number }> = ({ end, frames }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 24, frames - 20, frames], [0, 1, 1, end ? 1 : 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const text = interpolate(f, [24, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Shot src="cover" cam={end ? [10, 10, 300, 168.75, 0, 0, 320, 180] : [0, 0, 320, 180, 12, 8, 296, 166.5]} W={timeline.width - PAD * 2} H={timeline.height - PAD * 2} frames={frames} />
      <AbsoluteFill style={{ alignItems: "center", opacity: text, fontFamily: FONT, color: "#2c3e63", textAlign: "center", paddingTop: end ? 120 : 28 }}>
        {end ? (
          <>
            <div style={{ fontSize: 150, fontWeight: 700, textShadow: "0 4px 0 #fff8, 0 0 30px #fff" }}>끝</div>
            <div style={{ fontSize: 46, marginTop: 14, textShadow: "0 0 18px #fff, 0 0 8px #fff" }}>진짜 힘은 망토가 아니라, 그 안의 마음</div>
            <div style={{ fontSize: 34, marginTop: 14, textShadow: "0 0 14px #fff, 0 0 8px #fff" }}>글 {timeline.author} · 엄마가 쓴 동화책</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 112, fontWeight: 700, textShadow: "0 5px 0 #fff8, 0 0 34px #fff, 0 0 12px #fff" }}>{timeline.title}</div>
            <div style={{ fontSize: 40, marginTop: 0, textShadow: "0 0 18px #fff, 0 0 8px #fff" }}>글 {timeline.author} · 엄마의 동화책</div>
          </>
        )}
      </AbsoluteFill>
      {end && (
        <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 26, color: "#2c3e63", textShadow: "0 0 10px #fff" }}>
          그림과 목소리는 AI 도구로 만들었어요
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Book: React.FC = () => {
  const { width, height } = useVideoConfig();
  const W = width - PAD * 2, H = height - PAD * 2;
  const total = fr(timeline.total);
  const outroAt = fr(timeline.scenes[timeline.scenes.length - 1].end);
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, backgroundImage: "radial-gradient(circle at 30% 20%, #fbf3df 0%, #f0e2c2 70%, #e4d2a8 100%)" }}>
      <Audio src={staticFile("audio/mix.wav")} />
      {/* 그림 영역: 종이 여백 + 그림자 */}
      <div style={{ position: "absolute", left: PAD, top: PAD, width: W, height: H, overflow: "hidden", borderRadius: 18, boxShadow: "0 10px 34px rgba(70,45,10,0.35)", background: "#222" }}>
        <Sequence from={0} durationInFrames={fr(timeline.intro) + FADE}>
          <Cover frames={fr(timeline.intro) + FADE} />
        </Sequence>
        {timeline.scenes.map((s) =>
          s.imgs.map((im: Img, k: number) => {
            const cam = s.no === 10 ? ([[0, 0, 320, 180, 20, 10, 280, 157.5], [300, 20, 260, 146.25, 40, 20, 280, 157.5], [0, 20, 320, 180, 30, 14, 290, 163.1], [40, 0, 280, 157.5, 0, 0, 320, 180]][k] ?? s.cam) : s.cam;
            const from = fr(im.from), to = fr(im.to) + FADE;
            return (
              <Sequence key={`${s.no}-${im.id}`} from={from} durationInFrames={Math.max(1, to - from)}>
                <Page img={im} cam={cam} W={W} H={H} />
              </Sequence>
            );
          }),
        )}
        {timeline.scenes.flatMap((s) =>
          s.subs.map((c: Sub, i: number) => (
            <Sequence key={`${s.no}-sub-${i}`} from={fr(c.from)} durationInFrames={Math.max(8, fr(c.to) - fr(c.from))}>
              <Caption sub={c} />
            </Sequence>
          )),
        )}
        <Sequence from={outroAt} durationInFrames={total - outroAt}>
          <Cover end frames={total - outroAt} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
