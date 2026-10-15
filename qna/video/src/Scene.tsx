import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import assets from "./assets.json";
import { GRAY, INK, PAPER, RED } from "./theme";

// 그림을 레이어로 쌓아 움직이는 컷. script.json 의 cut.scene 이 있으면 이걸로 그린다.
// 그림이 아직 없으면(src/assets.json 에 없으면) 그 자리는 임시 그림으로 나온다.

export type Actor = {
  id: string; // 대사의 who 와 같으면 말할 때 까딱거린다
  art: string;
  x: number; // 발 위치 (0~1, 화면 가로)
  h?: number; // 키 (0~1, 화면 세로)
  flip?: boolean;
  enter?: "left" | "right" | "drop" | "pop" | "rise" | "none"; // rise: 바닥(좌판) 뒤에서 솟아오른다
  at?: number; // 몇 번째 대사부터 나오는지 (없으면 컷 시작)
  idle?: "sway" | "bounce" | "shiver"; // 가만히 있을 때의 버릇
};

export type Prop = {
  art: string;
  x: number; // 중심 (0~1)
  y: number;
  w: number; // 폭 (0~1, 화면 가로)
  rot?: number;
  enter?: "left" | "right" | "drop" | "pop" | "fade";
  at?: number;
  float?: boolean;
  dim?: boolean; // 흐릿하게 (겹쳐 보이는 연출)
  front?: boolean; // 배우 앞에 그린다 (좌판 · 기계처럼 배우를 가리는 것)
  flip?: boolean;
  motion?: "sway" | "pulse" | "spin" | "walk"; // 계속 움직인다. walk 는 걷는 사람처럼 까딱거린다
  to?: { x: number; y?: number }; // 컷이 끝날 때까지 이 자리로 천천히 움직인다
};

export type Scene = {
  bg?: string;
  pan?: "left" | "right" | "up" | "down"; // 배경을 컷 내내 천천히 민다
  tone?: "flashback";
  floor?: number; // 발이 닿는 높이 (0~1)
  actors?: Actor[];
  props?: Prop[];
};

export type SceneLine = {
  id: string;
  who: string;
  from: number;
  duration: number;
  sfxAfter?: string;
  pose?: Record<string, string>; // 이 대사부터 배우의 그림을 바꾼다 { dad: "common/dad/panic" }
  move?: Record<string, number>; // 이 대사부터 배우가 그 자리(x)로 걸어간다 { dad: 0.2 }
  act?: Record<string, "jump" | "shiver" | "nod">; // 이 대사가 시작될 때 한 번 하는 동작 { kid: "jump" }
  focus?: string; // 이 대사 동안 그 배우 쪽으로 카메라를 당긴다
  fx?: "shake" | "lines" | "flash" | "zoom";
  cutin?: string; // 이 대사에 맞춰 큰 얼굴이 튀어나온다
  pop?: string; // 이 대사에 맞춰 큰 글자가 튀어나온다
};

export type SceneCut = {
  id: string;
  beat: string;
  image?: string;
  caption?: string;
  scene?: Scene;
  lines: SceneLine[];
  duration: number;
};

const W = 1920;
const H = 1080;
const FLOOR = 0.8;
const HEIGHT: Record<string, number> = { dad: 0.64, kid: 0.43, granny: 0.5 };
const WALK = 26; // 걸어서 자리를 옮기는 데 걸리는 프레임
const manifest = assets as Record<string, { w: number; h: number }>;

// 아직 안 그린 공통 그림은 비슷한 그림으로 대신한다. 그림을 넣으면 저절로 그 그림이 나온다
const STAND_IN: Record<string, string> = {
  "common/dad/search": "common/dad/think",
  "common/bg/dining-room": "common/bg/living-room",
};

export const findArt = (episode: string, id?: string) => {
  if (!id) return null;
  let key = id.startsWith("common/") ? id : `${episode}/${id}`;
  if (!manifest[key] && STAND_IN[key]) key = STAND_IN[key];
  const size = manifest[key];
  return size ? { src: staticFile(`art/${key}.webp`), ...size } : null;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Missing: React.FC<{ label: string; round?: boolean }> = ({ label, round }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      border: `4px dashed ${GRAY}`,
      borderRadius: round ? "45% 45% 18% 18%" : 18,
      backgroundColor: "rgba(246,238,223,0.85)",
      color: GRAY,
      fontSize: 22,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 10,
      wordBreak: "break-all",
    }}
  >
    {label}
  </div>
);

const BURST = Array.from({ length: 32 }, (_, i) => {
  const r = i % 2 ? 0.72 : 1;
  const a = (i / 32) * Math.PI * 2;
  return `${(50 + Math.cos(a) * 50 * r).toFixed(2)},${(50 + Math.sin(a) * 50 * r).toFixed(2)}`;
}).join(" ");

export const SceneVisual: React.FC<{ episode: string; cut: SceneCut; frame: number; still: boolean }> = ({
  episode,
  cut,
  frame,
  still,
}) => {
  const { fps } = useVideoConfig();
  const scene = cut.scene ?? {};
  // 스틸은 컷이 다 펼쳐진 뒤의 모습으로
  const f = still ? Math.max(0, cut.duration - 20) : frame;
  const floor = (scene.floor ?? FLOOR) * H;
  const atFrame = (i?: number) => (i == null ? 0 : (cut.lines[i]?.from ?? 0));

  const started = cut.lines.filter((l) => f >= l.from);
  const cur = started[started.length - 1];
  const prev = started[started.length - 2];
  const speaking = cut.lines.find((l) => f >= l.from && f < l.from + l.duration);

  // 배우의 지금 자리: move 가 있는 대사마다 그 자리로 걸어간다
  const placeOf = (actor: Actor) => {
    let x = actor.x;
    let walking = -1;
    for (const line of started) {
      const target = line.move?.[actor.id];
      if (target == null) continue;
      const since = f - line.from;
      x = lerp(x, target, interpolate(since, [0, WALK], [0, 1], clamp));
      walking = since < WALK ? since : -1;
    }
    return { x, walking };
  };

  // 카메라: 컷 내내 천천히 밀고, focus 가 있는 대사에서는 그 배우 쪽으로 당긴다
  const focusOf = (line?: SceneLine) => {
    const actor = line?.focus ? scene.actors?.find((a) => a.id === line.focus) : null;
    return actor ? { x: placeOf(actor).x, s: 1.32 } : { x: 0.5, s: 1 };
  };
  const move = cur ? spring({ frame: f - cur.from, fps, config: { damping: 200 } }) : 1;
  const camX = lerp(focusOf(prev).x, focusOf(cur).x, move);
  // fx:"zoom" 은 대사 시작에 화면을 훅 당겼다 놓는다
  const zoomLine = [...started].reverse().find((l) => l.fx === "zoom");
  const punch = zoomLine && !still ? interpolate(f - zoomLine.from, [0, 4, 22], [0, 0.14, 0], clamp) : 0;
  const camS = lerp(focusOf(prev).s, focusOf(cur).s, move) * interpolate(f, [0, cut.duration], [1, 1.05]) * (1 + punch);

  // 흔들림: fx:"shake" 는 대사 시작에, 뚜둥(sfxAfter)은 대사가 끝난 뒤에
  const dudungLine = cut.lines.find((l) => l.sfxAfter === "dudung");
  const sinceDudung = dudungLine ? f - (dudungLine.from + dudungLine.duration + 2) : -1;
  const shakeLine = [...started].reverse().find((l) => l.fx === "shake");
  const sinceShake = shakeLine ? f - shakeLine.from : -1;
  const wobble = (since: number, power: number) =>
    since >= 0 && since < 22 ? Math.sin(since * 2.3) * interpolate(since, [0, 22], [power, 0], clamp) : 0;
  const shake = still ? 0 : wobble(sinceDudung, 18) + wobble(sinceShake, 14);

  const bg = findArt(episode, scene.bg);
  const flashback = scene.tone === "flashback";
  // 배경 밀기: 컷 길이에 걸쳐 화면의 6% 를 움직인다 (그만큼 배경을 키워 둔다)
  const drift = interpolate(f, [0, cut.duration], [-1, 1], clamp);
  const panX = scene.pan === "left" ? -drift * W * 0.03 : scene.pan === "right" ? drift * W * 0.03 : 0;
  const panY = scene.pan === "up" ? -drift * H * 0.03 : scene.pan === "down" ? drift * H * 0.03 : 0;
  const bgScale = scene.pan ? 1.12 : 1.06;

  const entered = (enter: string | undefined, since: number): { dx: number; dy: number; scale: number; opacity: number; rise?: number } => {
    const p = spring({ frame: since, fps, config: { damping: enter === "drop" ? 10 : 14 } });
    if (enter === "left") return { dx: (p - 1) * W * 0.5, dy: 0, scale: 1, opacity: 1 };
    if (enter === "right") return { dx: (1 - p) * W * 0.5, dy: 0, scale: 1, opacity: 1 };
    if (enter === "drop") return { dx: 0, dy: (p - 1) * H, scale: 1, opacity: 1 };
    if (enter === "pop") return { dx: 0, dy: 0, scale: p, opacity: 1 };
    if (enter === "rise") return { dx: 0, dy: 0, scale: 1, opacity: 1, rise: Math.max(0, 1 - p) };
    if (enter === "fade") return { dx: 0, dy: 0, scale: 1, opacity: interpolate(since, [0, 12], [0, 1], clamp) };
    return { dx: 0, dy: 0, scale: 1, opacity: 1 };
  };

  const propsOf = (front: boolean) =>
    (scene.props ?? []).map((prop, i) => {
      if (Boolean(prop.front) !== front) return null;
      const from = atFrame(prop.at);
      const since = f - from;
      if (since < 0) return null;
      const art = findArt(episode, prop.art);
      const width = prop.w * W;
      const height = art ? (width * art.h) / art.w : width;
      const e = entered(prop.enter ?? (prop.at == null ? undefined : "pop"), since);
      const go = prop.to ? interpolate(f, [from, Math.max(from + 1, cut.duration)], [0, 1], clamp) : 0;
      const x = lerp(prop.x, prop.to?.x ?? prop.x, go);
      const y = lerp(prop.y, prop.to?.y ?? prop.y, go);
      const t = f + i * 17;
      const bob = prop.float ? Math.sin(f * 0.07 + i * 1.7) * 10 : prop.motion === "walk" ? -Math.abs(Math.sin(t * 0.3)) * 14 : 0;
      const swing = prop.motion === "sway" ? Math.sin(t * 0.07) * 4 : prop.motion === "walk" ? Math.sin(t * 0.3) * 2.5 : prop.motion === "spin" ? t * 4 : 0;
      const pulse = prop.motion === "pulse" ? 1 + Math.sin(t * 0.16) * 0.05 : 1;
      return (
        <div
          key={prop.art + i}
          style={{
            position: "absolute",
            left: x * W - width / 2 + e.dx,
            top: y * H - height / 2 + e.dy + bob,
            width,
            height,
            opacity: e.opacity * (prop.dim ? 0.55 : 1),
            filter: prop.dim ? "blur(3px)" : undefined,
            transform: `rotate(${(prop.rot ?? 0) + (still ? 0 : swing)}deg) scale(${(prop.flip ? -1 : 1) * e.scale * pulse}, ${e.scale * pulse})`,
          }}
        >
          {art ? <Img src={art.src} style={{ width: "100%", height: "100%" }} /> : <Missing label={prop.art} />}
        </div>
      );
    });

  const cutinLine = cut.lines.find((l) => l.cutin && f >= l.from && f < l.from + 48);
  const cutin = cutinLine ? findArt(episode, cutinLine.cutin) : null;
  const popLine = cut.lines.find((l) => l.pop && f >= l.from && f < l.from + 40);
  const popText = popLine ? popLine.pop : sinceDudung >= 0 && sinceDudung < 34 ? "뚜둥!" : null;
  const sincePop = popLine ? f - popLine.from : sinceDudung;
  const flashLine = cut.lines.find((l) => l.fx === "flash" && f >= l.from && f < l.from + 10);
  const linesFx = speaking?.fx === "lines";

  return (
    <AbsoluteFill style={{ opacity: still ? 1 : interpolate(frame, [0, 8], [0, 1], clamp), overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${shake}px) scale(${camS})`,
          transformOrigin: `${camX * 100}% 62%`,
          filter: flashback ? "sepia(0.65) saturate(0.7) contrast(0.9) brightness(1.05)" : undefined,
        }}
      >
        {bg ? (
          <Img
            src={bg.src}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${(0.5 - camX) * 60 + panX}px, ${panY}px) scale(${bgScale})` }}
          />
        ) : (
          <AbsoluteFill style={{ backgroundColor: PAPER }}>
            {cut.image ? (
              <Img
                src={staticFile(`${episode}/cuts/${cut.image}`)}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, filter: "blur(5px)" }}
              />
            ) : null}
            {scene.bg ? (
              <div style={{ position: "absolute", right: 30, top: 24, fontSize: 22, fontWeight: 700, color: GRAY }}>임시 배경 · {scene.bg}</div>
            ) : null}
          </AbsoluteFill>
        )}

        {propsOf(false)}

        {(scene.actors ?? []).map((actor, i) => {
          const appearAt = atFrame(actor.at);
          if (f < appearAt) return null;
          const posed = [...started].reverse().find((l) => l.pose?.[actor.id]);
          const artId = posed?.pose?.[actor.id] ?? actor.art;
          const art = findArt(episode, artId);
          const height = (actor.h ?? HEIGHT[actor.id] ?? 0.6) * H;
          const width = art ? (height * art.w) / art.h : height * 0.55;
          const e = entered(actor.enter ?? (actor.at == null ? "none" : "pop"), f - appearAt);
          const place = placeOf(actor);
          const sunk = (e.rise ?? 0) * height; // 바닥 아래로 잠긴 만큼 (rise)
          // 표정이 바뀌는 순간 젤리처럼 눌렸다 튄다
          const jelly = posed && posed.from > appearAt ? spring({ frame: f - posed.from, fps, config: { damping: 7, stiffness: 190 } }) : 1;
          const talk = speaking && speaking.who === actor.id ? f - speaking.from : -1;
          // 말하는 그림(<그림>-b)이 있으면 말하는 동안 두 장을 번갈아 보여 입이 움직인다
          const talkArt = talk >= 0 && !still ? findArt(episode, `${artId}-b`) : null;
          const shown = talkArt && Math.floor(talk / 4) % 2 === 1 ? talkArt : art;
          // 한 번 하는 동작(act)과 가만히 있을 때의 버릇(idle)
          const acted = [...started].reverse().find((l) => l.act?.[actor.id]);
          const sinceAct = acted && !still ? f - acted.from : -1;
          const doing = acted?.act?.[actor.id];
          const jump = doing === "jump" && sinceAct >= 0 && sinceAct < 28 ? -Math.abs(Math.sin((sinceAct / 14) * Math.PI)) * (sinceAct < 14 ? 110 : 55) : 0;
          const shiver = doing === "shiver" && sinceAct >= 0 && sinceAct < 30 ? Math.sin(sinceAct * 2.6) * interpolate(sinceAct, [0, 30], [9, 0], clamp) : 0;
          const nod = doing === "nod" && sinceAct >= 0 && sinceAct < 24 ? Math.sin((sinceAct / 12) * Math.PI) * 5 : 0;
          const t = f + i * 23;
          const idleX = still ? 0 : actor.idle === "shiver" ? Math.sin(t * 1.9) * 3 : 0;
          const idleY = still ? 0 : actor.idle === "bounce" ? -Math.abs(Math.sin(t * 0.14)) * 9 : 0;
          const idleTilt = still ? 0 : actor.idle === "sway" ? Math.sin(t * 0.07) * 2 : 0;
          const step = place.walking >= 0 ? -Math.abs(Math.sin(place.walking * 0.5)) * 18 : 0;
          const waddle = place.walking >= 0 ? Math.sin(place.walking * 0.5) * 3 : 0;
          const hop = (talk >= 0 ? -Math.abs(Math.sin(talk * 0.42)) * 16 : 0) + jump + idleY + step;
          const tilt = (talk >= 0 ? Math.sin(talk * 0.21) * 1.6 : 0) + nod + idleTilt + waddle;
          const breath = 1 + Math.sin((f + i * 23) * 0.09) * 0.007;
          const sx = (actor.flip ? -1 : 1) * e.scale * lerp(1.14, 1, jelly);
          const sy = e.scale * lerp(0.82, 1, jelly) * breath;
          return (
            <React.Fragment key={actor.id}>
              <div
                style={{
                  position: "absolute",
                  left: place.x * W - width * 0.42 + e.dx,
                  top: floor - 16,
                  width: width * 0.84,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: "rgba(21,48,58,0.22)",
                  opacity: e.scale * (1 - (e.rise ?? 0)),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: place.x * W - width / 2 + e.dx + shiver + idleX,
                  top: floor - height + e.dy + hop + sunk,
                  width,
                  height,
                  transformOrigin: "50% 100%",
                  transform: `rotate(${tilt}deg) scale(${sx}, ${sy})`,
                  clipPath: sunk > 0 ? `inset(0 0 ${sunk}px 0)` : undefined,
                }}
              >
                {shown ? <Img src={shown.src} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 100%" }} /> : <Missing round label={artId} />}
              </div>
            </React.Fragment>
          );
        })}

        {propsOf(true)}
      </AbsoluteFill>

      {flashback ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at center, rgba(246,238,223,0) 45%, rgba(120,95,60,0.5) 100%)",
            border: `8px dashed ${RED}`,
            boxSizing: "border-box",
          }}
        />
      ) : null}

      {linesFx && !still ? (
        <AbsoluteFill>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%">
            {Array.from({ length: 40 }, (_, i) => {
              const a = (i / 40) * Math.PI * 2 + ((f % 3) * 0.05);
              const inner = 560 + ((i * 53 + (f % 3) * 37) % 180);
              return (
                <line
                  key={i}
                  x1={960 + Math.cos(a) * inner}
                  y1={460 + Math.sin(a) * inner * 0.62}
                  x2={960 + Math.cos(a) * 1500}
                  y2={460 + Math.sin(a) * 1500}
                  stroke={INK}
                  strokeWidth={i % 3 ? 5 : 11}
                  opacity={0.55}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      ) : null}

      {cutin && cutinLine && !still ? (
        (() => {
          const since = f - cutinLine.from;
          const fromLeft = cutinLine.who === "kid";
          const p = spring({ frame: since, fps, config: { damping: 11, stiffness: 160 } });
          const out = interpolate(since, [40, 48], [0, 1], clamp);
          const size = 640;
          const off = (1 - p + out) * (size + 80);
          return (
            <div style={{ position: "absolute", top: 110, width: size, height: size, ...(fromLeft ? { left: 40 - off } : { right: 40 - off }) }}>
              <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: -70, transform: `rotate(${since * 0.8}deg) scale(${p})` }}>
                <polygon points={BURST} fill="#FFD23F" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
              </svg>
              <Img src={cutin.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", maskImage: "linear-gradient(#000 82%, transparent 97%)", transform: `rotate(${Math.sin(since * 1.1) * 2}deg)` }} />
            </div>
          );
        })()
      ) : null}

      {flashLine ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f - flashLine.from, [0, 2, 10], [0, 0.85, 0], clamp) }} /> : null}

      {/* 자막이 놓이는 아래쪽 띠 */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(rgba(246,238,223,0), ${PAPER} 36%)` }} />

      {cut.beat ? (
        <div style={{ position: "absolute", left: 40, top: 30, fontSize: 26, fontWeight: 700, color: "#fff", backgroundColor: flashback ? RED : INK, padding: "6px 16px", borderRadius: 6 }}>
          {cut.beat}
        </div>
      ) : null}
      {cut.caption ? (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 96,
            backgroundColor: RED,
            color: "#fff",
            fontSize: 46,
            fontWeight: 700,
            padding: "12px 26px",
            transform: `scale(${still ? 1 : spring({ frame: frame - 8, fps, config: { damping: 14 } })})`,
            transformOrigin: "left center",
            boxShadow: "6px 6px 0 rgba(21,48,58,0.25)",
          }}
        >
          {cut.caption}
        </div>
      ) : null}

      {popText && !still ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 280,
            textAlign: "center",
            fontSize: 190,
            fontWeight: 700,
            color: RED,
            WebkitTextStroke: `10px ${PAPER}`,
            paintOrder: "stroke",
            transform: `scale(${spring({ frame: sincePop, fps, config: { damping: 9, stiffness: 180 } })}) rotate(-6deg)`,
            opacity: interpolate(sincePop, [26, 36], [1, 0], clamp),
          }}
        >
          {popText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
