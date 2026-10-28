import { loadFont } from "@remotion/google-fonts/GowunBatang";
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "./timeline.json";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"] });
const FONT = `${fontFamily}, 'Batang', 'Malgun Gothic', serif`;

const PAPER = "#f5ead2";
const INK = "#3b3228";
const FAST = !!timeline.fast; // 빠른 편집 (books/<slug>/edit.json)
const FADE = FAST ? 6 : 20; // 장면 사이 겹치는 프레임 (느린 편집은 쪽 넘김 느낌의 부드러운 전환)
const PAD = 36; // 그림 둘레 종이 여백
const WHO: Record<string, string> = timeline.look.colors;
const HERO = timeline.slug === "01-real-hero";

type Cam = number[];
type Img = { id: string; from: number; to: number };
type Sub = { who: string; text: string; from: number; to: number; sticker?: string };
type ShotT = { id: string; from: number; to: number; cam: Cam; punch: boolean; first: boolean };

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
  return <Img src={staticFile(`art/${timeline.slug}/${src}.jpg`)} style={{ position: "absolute", left, top, width: iw, height: ih, maxWidth: "none" }} />;
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

// 빠른 편집의 컷: 장면 첫 컷만 짧게 밝아지고 나머지는 바로 끊는다. 외치는 컷은 줌 펀치 + 흔들림
const Cut: React.FC<{ shot: ShotT; W: number; H: number }> = ({ shot, W, H }) => {
  const f = useCurrentFrame();
  const dur = fr(shot.to) - fr(shot.from);
  const op = shot.first ? interpolate(f, [0, FADE], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const k = shot.punch ? interpolate(f, [0, 10], [1.16, 1], { easing: Easing.out(Easing.back(2)), extrapolateRight: "clamp" }) : 1;
  const amp = shot.punch ? interpolate(f, [0, 14], [14, 0], { extrapolateRight: "clamp" }) : 0;
  const dx = Math.sin(f * 2.7) * amp, dy = Math.cos(f * 3.3) * amp * 0.6;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translate(${dx}px, ${dy}px) scale(${k})` }}>
      <Shot src={shot.id} cam={shot.cam} W={W} H={H} frames={dur + FADE} />
    </AbsoluteFill>
  );
};

// 의성어 · 외침을 큰 글자로 (만화 효과 글자)
const Sticker: React.FC<{ sub: Sub; i: number }> = ({ sub, i }) => {
  const f = useCurrentFrame();
  const dur = fr(sub.to) - fr(sub.from);
  const s = interpolate(f, [0, 7, 12], [0.2, 1.25, 1], { easing: Easing.out(Easing.quad), extrapolateRight: "clamp" });
  const op = interpolate(f, [0, 3, dur - 5, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = (i % 2 ? 7 : -8) + Math.sin(f / 3) * 2.5;
  const color = WHO[sub.who] ?? "#e8a317";
  return (
    <div style={{ position: "absolute", top: 70, left: i % 2 ? undefined : 90, right: i % 2 ? 90 : undefined, opacity: op, transform: `rotate(${rot}deg) scale(${s})` }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 150, color, WebkitTextStroke: "14px #fff", paintOrder: "stroke fill", textShadow: "0 10px 0 rgba(60,40,10,0.35)", letterSpacing: -4 }}>{sub.sticker}</span>
    </div>
  );
};

// 장면 시작에 왼쪽 위로 들어왔다 나가는 장면 제목 (TV 동화 느낌)
const SceneTag: React.FC<{ title: string; frames: number }> = ({ title, frames }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 8, frames - 8, frames], [-520, 0, 0, -520], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 36, left: 0, transform: `translateX(${x}px)`, background: timeline.look.ink, color: "#fff8e8", fontFamily: FONT, fontWeight: 700, fontSize: 40, padding: "10px 34px 12px 40px", borderRadius: "0 40px 40px 0", boxShadow: "0 6px 18px rgba(40,25,5,0.35)" }}>
      {title}
    </div>
  );
};

const Caption: React.FC<{ sub: Sub }> = ({ sub }) => {
  const f = useCurrentFrame();
  const dur = fr(sub.to) - fr(sub.from);
  const op = interpolate(f, [0, FAST ? 3 : 6, dur - (FAST ? 3 : 6), dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = FAST ? 0 : interpolate(f, [0, 8], [10, 0], { extrapolateRight: "clamp" });
  const pop = FAST ? interpolate(f, [0, 6], [0.86, 1], { easing: Easing.out(Easing.back(2.2)), extrapolateRight: "clamp" }) : 1;
  const talk = sub.who !== "narr";
  const color = WHO[sub.who] ?? INK;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${rise}px) scale(${pop})` }}>
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
  const inF = FAST ? 6 : 24;
  const op = interpolate(f, [0, inF, frames - (FAST ? FADE : 20), frames], [0, 1, 1, end ? 1 : 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const text = interpolate(f, FAST ? [4, 10] : [24, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 빠른 편집: 제목이 크게 들어와 쿵 하고 자리 잡는다
  const slam = FAST ? interpolate(f, [4, 14], [1.5, 1], { easing: Easing.out(Easing.back(1.8)), extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Shot src="cover" cam={end ? [10, 10, 300, 168.75, 0, 0, 320, 180] : [0, 0, 320, 180, 12, 8, 296, 166.5]} W={timeline.width - PAD * 2} H={timeline.height - PAD * 2} frames={frames} />
      <AbsoluteFill style={{ alignItems: "center", opacity: text, transform: `scale(${slam})`, fontFamily: FONT, color: timeline.look.ink, textAlign: "center", paddingTop: end ? (HERO ? 120 : 60) : 28 }}>
        {end ? (
          <div style={HERO ? undefined : { background: "rgba(255,250,236,0.84)", borderRadius: 40, padding: "18px 70px 24px", boxShadow: "0 10px 30px rgba(70,45,10,0.25)" }}>
            <div style={{ fontSize: 150, fontWeight: 700, textShadow: "0 4px 0 #fff8, 0 0 30px #fff" }}>끝</div>
            <div style={{ fontSize: 46, marginTop: 14, textShadow: "0 0 18px #fff, 0 0 8px #fff" }}>{timeline.look.endLine}</div>
            <div style={{ fontSize: 34, marginTop: 14, textShadow: "0 0 14px #fff, 0 0 8px #fff" }}>글 {timeline.author} · 엄마가 쓴 동화책</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: HERO ? 112 : 92, fontWeight: 700, lineHeight: 1.15, whiteSpace: "pre-line", textShadow: "0 5px 0 #fff8, 0 0 34px #fff, 0 0 12px #fff" }}>{timeline.look.title}</div>
            <div style={{ fontSize: 40, marginTop: 0, textShadow: "0 0 18px #fff, 0 0 8px #fff" }}>글 {timeline.author} · {timeline.look.tag}</div>
          </>
        )}
      </AbsoluteFill>
      {end && (
        <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 26, color: timeline.look.ink, textShadow: "0 0 10px #fff" }}><span style={HERO ? undefined : { background: "rgba(255,250,236,0.84)", borderRadius: 20, padding: "2px 22px 4px" }}>
          그림과 목소리는 AI 도구로 만들었어요
        </span></div>
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
      <Audio src={staticFile(timeline.audio)} />
      {/* 그림 영역: 종이 여백 + 그림자 */}
      <div style={{ position: "absolute", left: PAD, top: PAD, width: W, height: H, overflow: "hidden", borderRadius: 18, boxShadow: "0 10px 34px rgba(70,45,10,0.35)", background: "#222" }}>
        <Sequence from={0} durationInFrames={fr(timeline.intro) + FADE}>
          <Cover frames={fr(timeline.intro) + FADE} />
        </Sequence>
        {FAST && timeline.scenes.flatMap((s) =>
          (s.shots ?? []).map((sh: ShotT, k: number) => {
            const from = fr(sh.from), to = fr(sh.to) + (k === s.shots.length - 1 ? FADE : 0);
            return (
              <Sequence key={`${s.no}-shot-${k}`} from={from} durationInFrames={Math.max(1, to - from)}>
                <Cut shot={sh} W={W} H={H} />
              </Sequence>
            );
          }),
        )}
        {!FAST && timeline.scenes.map((s) =>
          s.imgs.map((im: Img, k: number) => {
            const cam = HERO && s.no === 10 ? ([[0, 0, 320, 180, 20, 10, 280, 157.5], [300, 20, 260, 146.25, 40, 20, 280, 157.5], [0, 20, 320, 180, 30, 14, 290, 163.1], [40, 0, 280, 157.5, 0, 0, 320, 180]][k] ?? s.cam) : s.cam;
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
        {FAST && timeline.scenes.flatMap((s) =>
          s.subs.filter((c: Sub) => c.sticker).map((c: Sub, i: number) => (
            <Sequence key={`${s.no}-st-${i}`} from={fr(c.from)} durationInFrames={Math.max(20, Math.min(fr(2.2), fr(c.to) - fr(c.from)))}>
              <Sticker sub={c} i={s.no + i} />
            </Sequence>
          )),
        )}
        {FAST && timeline.scenes.filter((s) => s.title && s.subs.length).map((s) => (
          <Sequence key={`${s.no}-tag`} from={fr(s.start)} durationInFrames={fr(2)}>
            <SceneTag title={s.title} frames={fr(2)} />
          </Sequence>
        ))}
        <Sequence from={outroAt} durationInFrames={total - outroAt}>
          <Cover end frames={total - outroAt} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
