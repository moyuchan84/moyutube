import { Audio } from "@remotion/media";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BlackHanSans";
import { loadFont as loadGothic } from "@remotion/google-fonts/GothicA1";
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS } from "../timeline.js";
import { Missing, findArt } from "../Scene";
import { SFX_VOLUME } from "../Episode";
import { INK, PAPER, RED } from "../theme";

// 모션 편집판: 대사 한 줄에 샷 여러 개, 샷마다 전환 · 카메라 · 큰 글자 · 이름표를 붙인다 (애프터 이펙트 느낌)
// 편집 계획은 src/motion/<epNN>.json. 음성 · 그림은 롱폼 것을 그대로 쓴다.

const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });
const { fontFamily: GOTHIC } = loadGothic("normal", { weights: ["800"], ignoreTooManyRequestsWarning: true });

const W = 1920;
const H = 1080;
const YELLOW = "#FFD23F";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

type Trans = "cut" | "whip-l" | "whip-r" | "whip-u" | "zoom" | "wipe" | "iris" | "glitch" | "flash" | "slam" | "spin" | "smash";
// 전환 길이 (프레임). 들어오는 샷이 이 시간 동안 앞 샷 위에 덮인다
const TRANS: Record<Trans, number> = { cut: 0, "whip-l": 7, "whip-r": 7, "whip-u": 7, zoom: 7, wipe: 10, iris: 10, glitch: 6, flash: 6, slam: 6, spin: 8, smash: 5 };
const VOLUME: Record<string, number> = { ...SFX_VOLUME, buzz: 0.4, ding: 0.45, scratch: 0.5, slide: 0.4, crash: 0.5, tick: 0.45 };
const AUTO_SFX: Partial<Record<Trans, string>> = { "whip-l": "whoosh", "whip-r": "whoosh", "whip-u": "whoosh", zoom: "whoosh", wipe: "whoosh", spin: "whoosh" };

type Cast = {
  art: string; // 그림 id. "@thief" 는 코드로 그린 도둑 실루엣
  x: number;
  y?: number;
  h: number;
  flip?: boolean;
  enter?: "l" | "r" | "b" | "pop" | "drop" | "spin";
  exit?: { at: number; to?: "up" | "l" | "r" }; // 빙글 돌며 화면 밖으로 날아간다
  talk?: string;
  rot?: number;
  at?: number;
};
type Prop = { art: string; x: number; y: number; w: number; rot?: number; enter?: "l" | "r" | "pop" | "drop"; at?: number; spin?: boolean; front?: boolean }; // front: 인물 앞에 그린다
type Text = { t: string; x?: number; y?: number; size?: number; color?: string; style?: "slam" | "stamp" | "pop" | "type" | "news" | "shake"; at?: number; rot?: number };
type Shot = {
  at?: number; // 대사 안에서 이 샷이 시작하는 곳 (1 미만은 대사 길이의 비율, 1 이상은 프레임)
  in?: Trans;
  bg?: string; // 그림 id, "#색", "stripes:#색:#색", "burst:#색:#색", "dots:#색:#색"
  cast?: Cast[];
  props?: Prop[];
  // [x, y, 배율] — 화면 가운데에 올 지점. roll: [처음, 끝] 기울기(도). punch: 이 프레임마다 화면을 한 단계씩 확 당긴다
  cam?: { from?: number[]; to?: number[]; ease?: "snap" | "push"; roll?: number[]; punch?: number[] };
  text?: Text[];
  tag?: { t: string; sub?: string; x: number; y: number; at?: number };
  freeze?: number; // 이 시점에 화면이 멈추고 흑백 망점이 깔린다 (이름표와 같이)
  tally?: number; // 바를 정 자 몇 획째인지 (마지막 획이 그려진다)
  mark?: { kind: "o" | "x"; at?: number }; // 화면을 덮는 정답 O · 오답 X
  loading?: { t: string; pct: number; at?: number }; // 진행 막대가 pct 에서 멈춘다
  jail?: number; // 이 시점에 감옥 창살이 위에서 떨어진다
  note?: string; // 위쪽 구석의 작은 주석 (※ …)
  // 애니 연출(내모남불): impact(임팩트 프레임) · focus(흰 집중선) · gaan(충격 세로줄) · aura(분노 오라) · kira(반짝이)
  fx?: ("lines" | "shake" | "vhs" | "docu" | "mono" | "imagine" | "slowmo" | "impact" | "focus" | "gaan" | "aura" | "kira")[];
  sfx?: { name: string; at?: number; volume?: number }[];
};
// count: 이 박자에서 오답 카운터가 이 숫자가 된다 (countAt: 박자 안의 시점)
// calm: chop 으로 쪼개지 않는 박자 (아이 눈높이처럼 천천히 가야 하는 곳)
type Beat = { line?: string; hold?: number; pad?: number; count?: number; countAt?: number; calm?: boolean; shots: Shot[] };
// episode: 그림을 가져올 편, voice: 음성을 가져올 폴더 (없으면 episode), counter: 구석 카운터 이름표 (없으면 안 보임)
// chop: 글자 · 이름표가 없는 그림 샷이 이 프레임보다 길면 확대 · 기울기를 바꾼 컷 여러 개로 쪼갠다 (빠른 컷 편집)
export type MotionPlan = { id: string; episode: string; voice?: string; bgm?: string; gap?: number; counter?: string; chop?: number; beats: Beat[] };

const CHOP_VARIANTS = [
  { zoom: 1, roll: 0 },
  { zoom: 1.22, roll: -3 },
  { zoom: 1.1, roll: 2.5 },
];
const chopShot = (shot: PlacedShot, chop: number): PlacedShot[] => {
  const n = Math.ceil(shot.dur / chop);
  if (n < 2 || shot.text?.length || shot.tag || shot.freeze != null || shot.loading || shot.mark || shot.tally || shot.jail != null) return [shot];
  const from = shot.cam?.from ?? [0.5, 0.5, 1];
  const to = shot.cam?.to ?? [from[0], from[1], from[2] * 1.06];
  const step = Math.round(shot.dur / n);
  return Array.from({ length: n }, (_, k) => {
    const v = CHOP_VARIANTS[k % CHOP_VARIANTS.length];
    const t0 = k / n;
    const t1 = (k + 1) / n;
    const at = (t: number, i: number) => from[i] + (to[i] - from[i]) * t;
    const piece: PlacedShot = {
      ...shot,
      from: shot.from + k * step,
      dur: k === n - 1 ? shot.dur - k * step : step,
      in: k === 0 ? shot.in : "cut",
      cam: { ...shot.cam, from: [at(t0, 0), at(t0, 1), at(t0, 2) * v.zoom], to: [at(t1, 0), at(t1, 1), at(t1, 2) * v.zoom * 1.04], roll: v.roll ? [v.roll, v.roll * 1.3] : shot.cam?.roll, punch: k === 0 ? shot.cam?.punch : undefined },
      // 이어지는 조각에서는 등장 동작 · 효과음 · 임팩트를 다시 하지 않는다
      cast: k === 0 ? shot.cast : shot.cast?.map((c) => ({ ...c, enter: undefined, at: undefined })),
      props: k === 0 ? shot.props : shot.props?.map((pr) => ({ ...pr, enter: undefined, at: undefined })),
      sfx: k === 0 ? shot.sfx : [],
      fx: k === 0 ? shot.fx : shot.fx?.filter((x) => x !== "impact"),
    };
    return piece;
  });
};

type PlacedShot = Shot & { from: number; dur: number; out: Trans; who?: string; lineFrom: number; lineDur: number };
type PlacedLine = { id: string; who: string; text: string; voice: string; from: number; dur: number };
export type MotionTimeline = {
  shots: PlacedShot[];
  lines: PlacedLine[];
  counts: { from: number; n: number }[];
  durationInFrames: number;
  episode: string;
  bgm?: string;
  counter?: string;
};

type ScriptLike = { speed?: number; cuts: { id: string; lines: { who: string; text: string }[] }[] };

const frameOf = (at: number | undefined, length: number) => (at == null ? 0 : at < 1 ? Math.round(at * length) : at);

export const buildMotion = (plan: MotionPlan, script: ScriptLike, timing: Record<string, number>): MotionTimeline => {
  const speed = script.speed ?? 1;
  const gap = plan.gap ?? 2;
  const shots: PlacedShot[] = [];
  const lines: PlacedLine[] = [];
  const counts: { from: number; n: number }[] = [];
  let cursor = 0;
  for (const beat of plan.beats) {
    let length = beat.hold ?? 0;
    let who: string | undefined;
    if (beat.line) {
      const [cutId, index] = [beat.line.slice(0, beat.line.lastIndexOf("-")), Number(beat.line.slice(beat.line.lastIndexOf("-") + 1))];
      const src = script.cuts.find((c) => c.id === cutId)?.lines[index];
      if (!src || timing[beat.line] == null) throw new Error(`모션 계획: ${beat.line} 대사가 없다`);
      const dur = Math.ceil((timing[beat.line] / speed) * FPS);
      who = src.who;
      lines.push({ id: beat.line, who, text: src.text, voice: `${plan.voice ?? plan.episode}/voice${speed === 1 ? "" : `-x${speed}`}/${beat.line}.wav`, from: cursor, dur });
      length = dur + gap;
    }
    length += beat.pad ?? 0;
    if (beat.count != null) counts.push({ from: cursor + frameOf(beat.countAt, length), n: beat.count });
    const starts = beat.shots.map((s) => frameOf(s.at, length));
    beat.shots.forEach((shot, i) => {
      const end = i + 1 < beat.shots.length ? starts[i + 1] : length;
      const placed: PlacedShot = { ...shot, from: cursor + starts[i], dur: end - starts[i], out: "cut", who, lineFrom: cursor, lineDur: length };
      shots.push(...(plan.chop && !beat.calm ? chopShot(placed, plan.chop) : [placed]));
    });
    cursor += length;
  }
  shots.forEach((s, i) => (s.out = shots[i + 1]?.in ?? "cut"));
  return { shots, lines, counts, durationInFrames: cursor, episode: plan.episode, bgm: plan.bgm, counter: plan.counter };
};

// noSubs · noBgm: 쇼츠처럼 다른 틀 안에 넣을 때 자막 · 배경음악을 바깥에서 따로 그린다
export const Motion: React.FC<{ timeline: MotionTimeline; noSubs?: boolean; noBgm?: boolean }> = ({ timeline, noSubs, noBgm }) => {
  const { episode } = timeline;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {timeline.shots.map((shot, i) => (
        <Sequence key={i} from={shot.from} durationInFrames={shot.dur + TRANS[shot.out]} layout="none">
          <ShotView episode={episode} shot={shot} />
        </Sequence>
      ))}
      <Grain />
      {timeline.counter ? <Counter label={timeline.counter} counts={timeline.counts} /> : null}
      {timeline.lines.map((line) => (
        <Sequence key={line.id} from={line.from} durationInFrames={line.dur + 4} layout="none">
          <Audio src={staticFile(line.voice)} />
          {noSubs ? null : <Subtitle line={line} />}
        </Sequence>
      ))}
      {timeline.shots.flatMap((shot, i) => {
        const list = [...(shot.sfx ?? [])];
        const auto = AUTO_SFX[shot.in ?? "cut"];
        if (auto && !list.length) list.push({ name: auto, at: 0, volume: 0.3 });
        return list.map((s, j) => (
          <Sequence key={`${i}-${j}`} from={Math.max(0, shot.from + frameOf(s.at, shot.dur) - 2)} durationInFrames={60} layout="none">
            <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.volume ?? VOLUME[s.name] ?? 0.5} />
          </Sequence>
        ));
      })}
      {timeline.bgm && !noBgm ? (
        <Audio
          src={staticFile(`bgm/${timeline.bgm}.wav`)}
          loop
          loopVolumeCurveBehavior="extend"
          volume={(f) => 0.13 * interpolate(f, [0, 15, timeline.durationInFrames - 40, timeline.durationInFrames], [0, 1, 1, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// 들어올 때와 나갈 때의 움직임 (전환)
const transStyle = (shot: PlacedShot, f: number): { transform: string; filter?: string; clipPath?: string; opacity?: number } => {
  const tin = shot.in ?? "cut";
  const T = TRANS[tin];
  if (f < T) {
    const p = expoOut(f / T);
    const v = 1 - p; // 남은 거리 = 번짐 세기
    if (tin === "whip-l") return { transform: `translateX(${v * W}px)`, filter: `blur(${v * 26}px)` };
    if (tin === "whip-r") return { transform: `translateX(${-v * W}px)`, filter: `blur(${v * 26}px)` };
    if (tin === "whip-u") return { transform: `translateY(${v * H}px)`, filter: `blur(${v * 26}px)` };
    if (tin === "zoom") return { transform: `scale(${1 + v * 0.7})`, filter: `blur(${v * 18}px)`, opacity: Math.min(1, p * 2) };
    if (tin === "slam") return { transform: `scale(${1 + v * 0.25}) rotate(${v * -3}deg)` };
    if (tin === "spin") return { transform: `rotate(${v * -120}deg) scale(${1 + v * 0.8})`, filter: `blur(${v * 16}px)` };
    if (tin === "smash") {
      const j = Math.sin(f * 3.1) * 40 * v;
      return { transform: `translate(${j}px, ${-j * 0.6}px) scale(${1 + v * 0.12})`, filter: f < 2 ? "invert(1)" : undefined };
    }
    if (tin === "wipe") {
      const e = -0.35 + inOut(f / T) * 1.7;
      return { transform: "none", clipPath: `polygon(0 0, ${(e + 0.25) * 100}% 0, ${e * 100}% 100%, 0 100%)` };
    }
    if (tin === "iris") return { transform: "none", clipPath: `circle(${inOut(f / T) * 120}% at 50% 50%)` };
    if (tin === "glitch") {
      const j = (random(`g${shot.from}-${f}`) - 0.5) * 120;
      return { transform: `translateX(${j}px) skewX(${j * 0.05}deg)`, filter: `hue-rotate(${j * 3}deg) saturate(2)` };
    }
  }
  const after = f - shot.dur;
  const out = shot.out;
  if (after >= 0) {
    const T2 = TRANS[out];
    const p = expoOut(Math.min(1, after / T2));
    if (out === "whip-l") return { transform: `translateX(${-p * W * 0.6}px)`, filter: `blur(${p * 26}px)` };
    if (out === "whip-r") return { transform: `translateX(${p * W * 0.6}px)`, filter: `blur(${p * 26}px)` };
    if (out === "whip-u") return { transform: `translateY(${-p * H * 0.6}px)`, filter: `blur(${p * 26}px)` };
    if (out === "zoom") return { transform: `scale(${1 + p * 2.5})`, filter: `blur(${p * 20}px)` };
    if (out === "spin") return { transform: `rotate(${p * 120}deg) scale(${1 + p * 1.5})`, filter: `blur(${p * 16}px)` };
  }
  return { transform: "none" };
};

const ShotView: React.FC<{ episode: string; shot: PlacedShot }> = ({ episode, shot }) => {
  const f = useCurrentFrame();
  const fx = shot.fx ?? [];
  const freezeAt = shot.freeze == null ? null : frameOf(shot.freeze, shot.dur);
  const frozen = freezeAt != null && f >= freezeAt;
  const slow = fx.includes("slowmo") ? 0.3 : 1;
  const t = (frozen ? freezeAt! : f) * slow; // 멈추면 장면의 시간도 멈춘다
  const tr = transStyle(shot, f);
  const shake = fx.includes("shake") && !frozen ? Math.sin(f * 2.1) * 9 : 0;
  const shakeY = fx.includes("shake") && !frozen ? Math.cos(f * 1.7) * 6 : 0;
  const tone = [
    fx.includes("mono") || frozen ? "grayscale(0.9) contrast(1.25)" : "",
    fx.includes("docu") ? "sepia(0.35) saturate(0.7) contrast(1.1)" : "",
    fx.includes("imagine") ? "saturate(1.6) hue-rotate(-12deg) brightness(1.05)" : "",
    fx.includes("impact") && f < 5 ? "grayscale(1) invert(1) contrast(2.2)" : "",
    fx.includes("gaan") ? "saturate(0.5) brightness(0.85)" : "",
  ].join(" ").trim();
  const jailAt = shot.jail == null ? null : frameOf(shot.jail, shot.dur);
  return (
    <AbsoluteFill style={{ ...tr, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shakeY}px)`, filter: tone || undefined }}>
        <Stage episode={episode} shot={shot} t={t} />
      </AbsoluteFill>
      {jailAt != null && f >= jailAt ? <Jail f={f - jailAt} /> : null}
      {frozen ? <Halftone since={f - freezeAt!} /> : null}
      {fx.includes("lines") ? <SpeedLines f={f} /> : null}
      {fx.includes("aura") ? <Aura f={f} /> : null}
      {fx.includes("gaan") ? <Gaan f={f} /> : null}
      {fx.includes("focus") ? <FocusLines f={f} /> : null}
      {fx.includes("kira") ? <Kira f={f} seed={shot.from} /> : null}
      {fx.includes("impact") && f < 5 ? <ImpactFrame f={f} /> : null}
      {fx.includes("vhs") ? <Vhs f={f} /> : null}
      {fx.includes("docu") ? <Docu /> : null}
      {fx.includes("imagine") ? <Imagine f={f} /> : null}
      {fx.includes("slowmo") ? <SlowMo f={f} /> : null}
      {shot.tally ? <Tally n={shot.tally} f={f} /> : null}
      {shot.loading ? <Loading {...shot.loading} f={f - frameOf(shot.loading.at, shot.dur)} /> : null}
      {shot.mark ? <Mark kind={shot.mark.kind} f={f - frameOf(shot.mark.at, shot.dur)} /> : null}
      {shot.note ? <Note t={shot.note} f={f} /> : null}
      {(shot.text ?? []).map((text, i) => (
        <Kinetic key={i} text={text} f={f - frameOf(text.at, shot.dur)} />
      ))}
      {shot.tag ? <Tag tag={shot.tag} f={f - frameOf(shot.tag.at ?? shot.freeze, shot.dur)} /> : null}
      {shot.in === "wipe" && f < TRANS.wipe ? <WipeBar f={f} /> : null}
      {shot.in === "flash" || shot.in === "slam" ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 1, 6], [0.9, 0.9, 0], clamp) }} /> : null}
      {shot.in === "glitch" && f < TRANS.glitch ? <GlitchBars seed={shot.from + f} /> : null}
    </AbsoluteFill>
  );
};

// 배경 · 소품 · 인물을 카메라로 본다. 배경은 조금 덜 움직여서 깊이가 생긴다 (패럴랙스)
const Stage: React.FC<{ episode: string; shot: PlacedShot; t: number }> = ({ episode, shot, t }) => {
  const { fps } = useVideoConfig();
  const from = shot.cam?.from ?? [0.5, 0.5, 1];
  const to = shot.cam?.to ?? [from[0], from[1], from[2] * 1.06];
  const p = shot.cam?.ease === "snap" ? expoOut(Math.min(1, t / 14)) : inOut(Math.min(1, t / Math.max(1, shot.dur)));
  // 크래시 줌: punch 프레임마다 3프레임 만에 1.35배씩 확 당긴다
  const punched = (shot.cam?.punch ?? []).reduce((acc, at) => acc * (t >= at ? 1 + 0.35 * expoOut(Math.min(1, (t - at) / 3)) : 1), 1);
  const s = (from[2] + (to[2] - from[2]) * p) * punched;
  const roll = shot.cam?.roll ? shot.cam.roll[0] + ((shot.cam.roll[1] ?? shot.cam.roll[0]) - shot.cam.roll[0]) * p : 0;
  const fit = (v: number) => Math.min(1 - 0.5 / s, Math.max(0.5 / s, v));
  const cx = fit(from[0] + (to[0] - from[0]) * p);
  const cy = fit(from[1] + (to[1] - from[1]) * p);
  const world = `translate(${W / 2 - cx * W * s}px, ${H / 2 - cy * H * s}px) scale(${s})`;
  const bs = 1 + (s - 1) * 0.8;
  const bgWorld = `translate(${W / 2 - (0.5 + (cx - 0.5) * 0.85) * W * bs}px, ${H / 2 - (0.5 + (cy - 0.5) * 0.85) * H * bs}px) scale(${bs})`;
  const bg = shot.bg ?? PAPER;
  const lineT = t + shot.from - shot.lineFrom; // 대사가 시작된 뒤 지난 프레임
  const entered = (enter: string | undefined, since: number) => {
    const k = spring({ frame: since, fps, config: { damping: enter === "drop" ? 9 : 13, stiffness: 170 } });
    if (enter === "l") return { dx: (k - 1) * W * 0.6, dy: 0, sc: 1 };
    if (enter === "r") return { dx: (1 - k) * W * 0.6, dy: 0, sc: 1 };
    if (enter === "b") return { dx: 0, dy: (1 - k) * H * 0.8, sc: 1 };
    if (enter === "drop") return { dx: 0, dy: (k - 1) * H, sc: 1 };
    if (enter === "pop") return { dx: 0, dy: 0, sc: k };
    if (enter === "spin") return { dx: 0, dy: 0, sc: k, rot: (1 - k) * 540 };
    return { dx: 0, dy: 0, sc: 1 };
  };
  const props = (front: boolean) =>
    (shot.props ?? []).map((prop, i) => {
          if (Boolean(prop.front) !== front) return null;
          const since = t - frameOf(prop.at, shot.dur);
          if (since < 0) return null;
          const art = findArt(episode, prop.art);
          const w = prop.w * W;
          const h = art ? (w * art.h) / art.w : w;
          const e = entered(prop.enter, since);
          return (
            <div key={i} style={{ position: "absolute", left: prop.x * W - w / 2 + e.dx, top: prop.y * H - h / 2 + e.dy, width: w, height: h, transform: `rotate(${(prop.rot ?? 0) + (prop.spin ? t * 3 : 0)}deg) scale(${e.sc})` }}>
              {art ? <Img src={art.src} style={{ width: "100%", height: "100%" }} /> : <Missing label={prop.art} />}
            </div>
          );
        });
  return (
    <AbsoluteFill style={{ transform: roll ? `rotate(${roll}deg) scale(${1 + Math.abs(roll) * 0.012})` : undefined }}>
      <AbsoluteFill style={{ transform: bgWorld, transformOrigin: "0 0" }}>
        <Backdrop episode={episode} bg={bg} t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: world, transformOrigin: "0 0" }}>
        {props(false)}
        {(shot.cast ?? []).map((c, i) => {
          const since = t - frameOf(c.at, shot.dur);
          if (since < 0) return null;
          const talking = c.talk && c.talk === shot.who && lineT >= 0 && lineT < shot.lineDur - 2;
          const mouth = talking ? findArt(episode, `${c.art}-b`) : null;
          const thief = c.art === "@thief";
          const art = thief ? { src: "", w: 55, h: 100 } : mouth && Math.floor(lineT / 4) % 2 ? mouth : findArt(episode, c.art);
          const h = c.h * H;
          const w = art ? (h * art.w) / art.h : h * 0.55;
          const e = entered(c.enter, since);
          // 날아가기: exit 시점부터 빙글 돌며 위(또는 옆)로
          const gone = c.exit && t >= frameOf(c.exit.at, shot.dur) ? t - frameOf(c.exit.at, shot.dur) : -1;
          const fly = gone >= 0 ? Math.pow(gone / 12, 1.6) : 0;
          const flyX = c.exit?.to === "l" ? -fly * W : c.exit?.to === "r" ? fly * W : fly * W * 0.25;
          const flyY = c.exit?.to === "up" || !c.exit?.to ? -fly * H : -fly * H * 0.3;
          const spinRot = ("rot" in e ? (e.rot as number) : 0) + (gone >= 0 ? gone * 32 : 0);
          // 등장하면서 찌그러졌다 펴진다 (스쿼시 · 스트레치)
          const squash = spring({ frame: since, fps, config: { damping: 7, stiffness: 200 } });
          const hop = talking ? -Math.abs(Math.sin(lineT * 0.45)) * 14 : 0;
          const tilt = (c.rot ?? 0) + (talking ? Math.sin(lineT * 0.22) * 1.8 : Math.sin((t + i * 20) * 0.08) * 0.8);
          const footY = (c.y ?? 1.02) * H;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x * W - w / 2 + e.dx + flyX,
                top: footY - h + e.dy + hop + flyY,
                width: w,
                height: h,
                transformOrigin: spinRot ? "50% 50%" : "50% 100%",
                transform: `rotate(${tilt + spinRot}deg) scale(${(c.flip ? -1 : 1) * e.sc * (1.12 - 0.12 * squash)}, ${e.sc * (0.86 + 0.14 * squash)})`,
              }}
            >
              {thief ? <Thief /> : art ? <Img src={art.src} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 100%" }} /> : <Missing round label={c.art} />}
            </div>
          );
        })}
        {props(true)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BURST = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 0.5) / n) * Math.PI * 2;
    return `M50,50 L${50 + Math.cos(a0) * 150},${50 + Math.sin(a0) * 150} L${50 + Math.cos(a1) * 150},${50 + Math.sin(a1) * 150} Z`;
  }).join(" ");

const Backdrop: React.FC<{ episode: string; bg: string; t: number }> = ({ episode, bg, t }) => {
  if (bg.startsWith("#")) return <AbsoluteFill style={{ backgroundColor: bg }} />;
  const [kind, c1 = YELLOW, c2 = "#FFB627"] = bg.split(":");
  if (kind === "stripes")
    return <AbsoluteFill style={{ background: `repeating-linear-gradient(-35deg, ${c1} 0 70px, ${c2} 70px 140px)`, backgroundPosition: `${t * 6}px 0` }} />;
  if (kind === "dots")
    return <AbsoluteFill style={{ backgroundColor: c1, backgroundImage: `radial-gradient(${c2} 22%, transparent 24%)`, backgroundSize: "56px 56px", backgroundPosition: `${t * 2}px ${t}px` }} />;
  if (kind === "burst")
    return (
      <AbsoluteFill style={{ backgroundColor: c1 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ transform: `rotate(${t * 0.6}deg) scale(1.6)` }}>
          <path d={BURST(18)} fill={c2} />
        </svg>
      </AbsoluteFill>
    );
  const art = findArt(episode, bg);
  return art ? <Img src={art.src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)" }} /> : <Missing label={bg} />;
};

// 큰 글자: slam(쾅) · stamp(도장) · pop(한 자씩 튐) · type(타자) · news(속보 띠)
const Kinetic: React.FC<{ text: Text; f: number }> = ({ text, f }) => {
  const { fps } = useVideoConfig();
  if (f < 0) return null;
  const style = text.style ?? "pop";
  const size = text.size ?? 150;
  const color = text.color ?? "#fff";
  const base: React.CSSProperties = {
    position: "absolute",
    left: (text.x ?? 0.5) * W,
    top: (text.y ?? 0.42) * H,
    fontFamily: DISPLAY,
    fontSize: size,
    lineHeight: 1.05,
    color,
    whiteSpace: "pre",
    textAlign: "center",
    WebkitTextStroke: `${Math.round(size / 12)}px ${INK}`,
    paintOrder: "stroke",
    filter: `drop-shadow(${size / 18}px ${size / 18}px 0 ${INK})`,
  };
  if (style === "news") {
    const k = expoOut(Math.min(1, f / 10));
    return (
      <div style={{ position: "absolute", left: 0, bottom: 210, display: "flex", transform: `translateX(${(k - 1) * W}px)`, fontFamily: DISPLAY }}>
        <div style={{ backgroundColor: RED, color: "#fff", fontSize: 64, padding: "10px 34px" }}>{f % 16 < 10 ? "속보" : " "}</div>
        <div style={{ backgroundColor: "#fff", color: INK, fontSize: 64, padding: "10px 40px", borderBottom: `8px solid ${INK}` }}>{text.t}</div>
      </div>
    );
  }
  if (style === "slam" || style === "stamp") {
    const k = expoOut(Math.min(1, f / 7));
    const sc = style === "slam" ? 2.6 - 1.6 * k : 2 - k;
    const rot = (text.rot ?? (style === "stamp" ? -8 : -4)) + (1 - k) * 12;
    return (
      <div style={{ ...base, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`, opacity: Math.min(1, f / 2), ...(style === "stamp" ? { color: RED, WebkitTextStroke: undefined, filter: undefined, border: `${size / 14}px solid ${RED}`, padding: `0 ${size / 5}px`, borderRadius: 12, backgroundColor: "rgba(246,238,223,0.9)" } : {}) }}>
        {text.t}
      </div>
    );
  }
  const chars = [...text.t];
  return (
    <div style={{ ...base, transform: `translate(-50%, -50%) rotate(${text.rot ?? -3}deg)` }}>
      {chars.map((ch, i) => {
        const since = f - i * (style === "type" ? 2 : 1.6);
        if (since < 0) return <span key={i} style={{ opacity: 0 }}>{ch}</span>;
        const k = style === "type" ? 1 : spring({ frame: since, fps, config: { damping: 9, stiffness: 220 } });
        // shake: 글자마다 2프레임에 한 번씩 덜덜 떤다 (소리 지를 때)
        const tick = Math.floor(f / 2);
        const jx = style === "shake" ? (random(`sx${i}-${tick}`) - 0.5) * size * 0.12 : 0;
        const jy = style === "shake" ? (random(`sy${i}-${tick}`) - 0.5) * size * 0.12 : 0;
        const jr = style === "shake" ? (random(`sr${i}-${tick}`) - 0.5) * 14 : 0;
        return (
          <span key={i} style={{ display: "inline-block", transform: `translate(${jx}px, ${(1 - k) * 60 + jy}px) rotate(${jr}deg) scale(${k})`, whiteSpace: "pre" }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// 멈춘 화면에 붙는 이름표
const Tag: React.FC<{ tag: NonNullable<Shot["tag"]>; f: number }> = ({ tag, f }) => {
  const { fps } = useVideoConfig();
  if (f < 0) return null;
  const k = spring({ frame: f, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: tag.x * W,
        top: tag.y * H,
        transform: `translate(-50%, -50%) rotate(-4deg) scale(${k})`,
        backgroundColor: YELLOW,
        border: `6px solid ${INK}`,
        boxShadow: `12px 12px 0 ${INK}`,
        padding: "14px 34px",
        fontFamily: DISPLAY,
        textAlign: "center",
        whiteSpace: "pre",
      }}
    >
      <div style={{ fontSize: 76, color: INK, lineHeight: 1.1 }}>{tag.t}</div>
      {tag.sub ? <div style={{ fontSize: 46, color: RED, lineHeight: 1.2 }}>{tag.sub}</div> : null}
    </div>
  );
};

// 바를 정(正) 자 — 반복 개그. 앞 획은 그대로, n 번째 획만 그려진다
const STROKES = [
  [12, 14, 88, 14],
  [50, 14, 50, 88],
  [50, 50, 80, 50],
  [24, 44, 24, 88],
  [6, 88, 94, 88],
];
const Tally: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const draw = interpolate(f, [4, 14], [0, 1], { ...clamp, easing: expoOut });
  return (
    <div style={{ position: "absolute", left: W / 2 - 260, top: 150, width: 520, height: 520, backgroundColor: "#fff", border: `8px solid ${INK}`, boxShadow: `18px 18px 0 ${INK}`, transform: `rotate(3deg) scale(${interpolate(f, [0, 6], [0.6, 1], { ...clamp, easing: expoOut })})` }}>
      <svg viewBox="-6 -6 112 112" width="100%" height="100%">
        {STROKES.slice(0, n).map(([x1, y1, x2, y2], i) => {
          const len = Math.hypot(x2 - x1, y2 - y1);
          const k = i === n - 1 ? draw : 1;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />;
        })}
      </svg>
    </div>
  );
};

const Halftone: React.FC<{ since: number }> = ({ since }) => (
  <>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(rgba(21,48,58,0.35) 28%, transparent 30%)`, backgroundSize: "14px 14px", mixBlendMode: "multiply" }} />
    <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(since, [0, 1, 5], [0.85, 0.85, 0], clamp) }} />
    <AbsoluteFill style={{ border: `14px solid ${YELLOW}`, boxSizing: "border-box" }} />
  </>
);

const SpeedLines: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      {Array.from({ length: 46 }, (_, i) => {
        const a = (i / 46) * Math.PI * 2 + (f % 3) * 0.04;
        const inner = 520 + ((i * 61 + (f % 3) * 41) % 200);
        return <line key={i} x1={960 + Math.cos(a) * inner} y1={540 + Math.sin(a) * inner * 0.6} x2={960 + Math.cos(a) * 1500} y2={540 + Math.sin(a) * 1500} stroke={INK} strokeWidth={i % 3 ? 5 : 12} opacity={0.6} />;
      })}
    </svg>
  </AbsoluteFill>
);

const Vhs: React.FC<{ f: number }> = ({ f }) => (
  <>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 6px)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(transparent ${(f * 37) % 100}%, rgba(255,255,255,0.25) ${((f * 37) % 100) + 3}%, transparent ${((f * 37) % 100) + 6}%)` }} />
    <div style={{ position: "absolute", left: 70, top: 50, fontFamily: DISPLAY, fontSize: 80, color: "#fff", textShadow: "4px 0 #f05, -4px 0 #0ef" }}>{f % 20 < 13 ? "◀◀ REWIND" : ""}</div>
    <div style={{ position: "absolute", right: 70, top: 60, fontFamily: GOTHIC, fontSize: 52, color: "#fff", textShadow: "3px 0 #f05, -3px 0 #0ef" }}>-00:{String(20 - Math.min(19, Math.floor(f / 2))).padStart(2, "0")}:00</div>
  </>
);

const Docu: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, backgroundColor: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, backgroundColor: "#000" }} />
    <div style={{ position: "absolute", left: 70, top: 150, fontFamily: GOTHIC, fontSize: 48, color: YELLOW, letterSpacing: 6, borderLeft: `10px solid ${YELLOW}`, paddingLeft: 22 }}>
      동물의 세계 · 제8부
      <div style={{ fontSize: 36, color: "#fff", letterSpacing: 3 }}>궁지에 몰린 아빠</div>
    </div>
  </>
);

const WipeBar: React.FC<{ f: number }> = ({ f }) => {
  const e = -0.35 + inOut(f / TRANS.wipe) * 1.7;
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", inset: 0, backgroundColor: [RED, YELLOW, INK][i], clipPath: `polygon(${(e + 0.25 - i * 0.03) * 100}% 0, ${(e + 0.25 - i * 0.03 + 0.03) * 100}% 0, ${(e - i * 0.03 + 0.03) * 100}% 100%, ${(e - i * 0.03) * 100}% 100%)` }} />
      ))}
    </AbsoluteFill>
  );
};

const GlitchBars: React.FC<{ seed: number }> = ({ seed }) => (
  <AbsoluteFill style={{ mixBlendMode: "difference" }}>
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: random(`x${seed}-${i}`) * W * 0.5, top: random(`y${seed}-${i}`) * H, width: W * (0.3 + random(`w${seed}-${i}`) * 0.7), height: 8 + random(`h${seed}-${i}`) * 70, backgroundColor: ["#f05", "#0ef", "#fff"][i % 3] }} />
    ))}
  </AbsoluteFill>
);

// 구석의 오답 카운터: 숫자가 바뀌면 크게 튀었다가 제자리로 (편 내내 떠 있는 반복 개그)
const Counter: React.FC<{ label: string; counts: { from: number; n: number }[] }> = ({ label, counts }) => {
  const f = useCurrentFrame();
  const now = [...counts].reverse().find((c) => f >= c.from);
  if (!now) return null;
  const since = f - now.from;
  const pop = interpolate(since, [0, 4, 14], [1.9, 1.9, 1], { ...clamp, easing: expoOut });
  const flash = since < 14 && Math.floor(since / 3) % 2 === 0;
  return (
    <div style={{ position: "absolute", right: 34, top: 30, display: "flex", alignItems: "center", gap: 12, transformOrigin: "100% 0", transform: `scale(${pop}) rotate(${since < 14 ? Math.sin(since * 1.5) * 4 : 2}deg)` }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 34, color: INK, backgroundColor: YELLOW, padding: "4px 14px", border: `4px solid ${INK}` }}>{label}</div>
      <div style={{ width: 84, height: 84, backgroundColor: flash ? RED : "#fff", border: `5px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
        <svg viewBox="-6 -6 112 112" width="100%" height="100%">
          {STROKES.slice(0, now.n).map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={flash ? "#fff" : RED} strokeWidth={11} strokeLinecap="round" />
          ))}
        </svg>
      </div>
    </div>
  );
};

// ── 애니 연출 ──
// 임팩트 프레임: 맞는 순간 4프레임 동안 흑백 반전 + 검은 방사선
const ImpactFrame: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ mixBlendMode: "multiply" }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ transform: `rotate(${f * 7}deg) scale(1.8)` }}>
      <path d={BURST(26)} fill="#000" opacity={0.85} />
    </svg>
  </AbsoluteFill>
);

// 흰 집중선: 가운데를 비워 두고 바깥에서 안쪽으로 몰리는 선 (매 2프레임 흔들림)
const FocusLines: React.FC<{ f: number }> = ({ f }) => {
  const tick = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {Array.from({ length: 90 }, (_, i) => {
          const a = (i / 90) * Math.PI * 2 + random(`fa${i}-${tick}`) * 0.03;
          const inner = 430 + random(`fi${i}-${tick}`) * 260;
          const w = 2 + random(`fw${i}`) * 9;
          return <line key={i} x1={960 + Math.cos(a) * inner} y1={540 + Math.sin(a) * inner * 0.62} x2={960 + Math.cos(a) * 1500} y2={540 + Math.sin(a) * 1500} stroke="#fff" strokeWidth={w} opacity={0.85} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// 충격 세로줄 ("가-안"): 위에서 내려오는 어두운 그늘 + 세로 줄무늬
const Gaan: React.FC<{ f: number }> = ({ f }) => {
  const k = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: expoOut });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,30,90,0.85) 0%, rgba(40,50,120,0.45) 45%, transparent 75%)", clipPath: `inset(0 0 ${(1 - k) * 100}% 0)` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(10,10,40,0.55) 0 6px, transparent 6px 34px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 35%, transparent 70%)", clipPath: `inset(0 0 ${(1 - k) * 100}% 0)` }} />
    </AbsoluteFill>
  );
};

// 분노 오라: 화면 가장자리에서 일렁이는 빨강 · 주황 불꽃 빛
const Aura: React.FC<{ f: number }> = ({ f }) => {
  const pulse = 0.75 + Math.sin(f * 0.9) * 0.25;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${220 * pulse}px ${90 * pulse}px rgba(255,60,20,0.85)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 115%, rgba(255,140,0,${0.55 * pulse}) 0%, transparent 55%)` }} />
    </AbsoluteFill>
  );
};

// 반짝이 (키라키라): 네 갈래 별이 여기저기서 켜졌다 꺼진다
const Kira: React.FC<{ f: number; seed: number }> = ({ f, seed }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: 16 }, (_, i) => {
      const x = random(`kx${seed}-${i}`) * W;
      const y = random(`ky${seed}-${i}`) * H * 0.9;
      const size = 30 + random(`ks${seed}-${i}`) * 70;
      const phase = random(`kp${seed}-${i}`) * 20;
      const k = Math.max(0, Math.sin((f + phase) * 0.35));
      return (
        <svg key={i} viewBox="-10 -10 20 20" width={size} height={size} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${k}) rotate(${f * 4}deg)`, filter: "drop-shadow(0 0 8px #fff)" }}>
          <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill={i % 3 ? "#fff" : "#FFE680"} />
        </svg>
      );
    })}
  </AbsoluteFill>
);

// 일부러 대충 그린 도둑 (아빠 상상 속 등장인물)
const Thief: React.FC = () => (
  <svg viewBox="0 0 55 100" width="100%" height="100%">
    <rect x="9" y="38" width="37" height="52" rx="14" fill="#1b1b1b" stroke="#fff" strokeWidth="2" />
    <circle cx="27.5" cy="22" r="17" fill="#1b1b1b" stroke="#fff" strokeWidth="2" />
    <rect x="10" y="16" width="35" height="9" fill="#fff" />
    <circle cx="21" cy="20.5" r="2.6" fill="#1b1b1b" />
    <circle cx="34" cy="20.5" r="2.6" fill="#1b1b1b" />
    <path d="M40 46 q16 6 10 26" stroke="#1b1b1b" strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="76" r="9" fill="#C9A227" stroke="#1b1b1b" strokeWidth="2" />
    <text x="50" y="80" fontSize="10" textAnchor="middle" fill="#1b1b1b" fontWeight="bold">$</text>
  </svg>
);

// 감옥 창살이 위에서 쾅 떨어진다
const Jail: React.FC<{ f: number }> = ({ f }) => {
  const drop = interpolate(f, [0, 6], [-H, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = f >= 6 && f < 14 ? Math.sin((f - 6) * 1.2) * 14 * (1 - (f - 6) / 8) : 0;
  return (
    <AbsoluteFill style={{ transform: `translateY(${drop + bounce}px)` }}>
      <div style={{ position: "absolute", left: W * 0.08, right: W * 0.08, top: H * 0.06, height: 40, backgroundColor: "#3a3f44", border: `5px solid ${INK}` }} />
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: W * 0.1 + i * W * 0.1, top: H * 0.06, width: 34, height: H, background: "linear-gradient(90deg, #2b2f33, #8a9298 45%, #2b2f33)", border: `4px solid ${INK}` }} />
      ))}
    </AbsoluteFill>
  );
};

// 아빠의 상상: 구름 테두리 + 꼬리표
const Imagine: React.FC<{ f: number }> = ({ f }) => (
  <>
    <AbsoluteFill style={{ boxShadow: "inset 0 0 140px 60px rgba(255,255,255,0.95)" }} />
    <div style={{ position: "absolute", left: 60, top: 40, fontFamily: DISPLAY, fontSize: 58, color: "#fff", backgroundColor: "#E85D9A", padding: "6px 26px", borderRadius: 40, border: `5px solid ${INK}`, transform: `rotate(${-4 + Math.sin(f * 0.3) * 2}deg)` }}>
      아빠의 상상
    </div>
  </>
);

const SlowMo: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, backgroundColor: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, backgroundColor: "#000" }} />
    <div style={{ position: "absolute", right: 60, top: 110, fontFamily: GOTHIC, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: 4, opacity: f % 30 < 20 ? 1 : 0.3 }}>▶ 0.3x  SLOW</div>
  </>
);

// 진행 막대: 차오르다가 pct 에서 멈춘다
const Loading: React.FC<{ t: string; pct: number; f: number }> = ({ t, pct, f }) => {
  if (f < 0) return null;
  const k = interpolate(f, [0, 14], [0, pct], { ...clamp, easing: expoOut });
  return (
    <div style={{ position: "absolute", left: W / 2 - 430, top: 120, width: 860, padding: "18px 26px", backgroundColor: "#fff", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, fontFamily: DISPLAY, transform: `scale(${interpolate(f, [0, 5], [0.7, 1], { ...clamp, easing: expoOut })})` }}>
      <div style={{ fontSize: 48, color: INK }}>{t}{".".repeat(1 + (Math.floor(f / 8) % 3))}</div>
      <div style={{ marginTop: 10, height: 40, border: `4px solid ${INK}`, backgroundColor: "#eee" }}>
        <div style={{ width: `${k}%`, height: "100%", backgroundColor: RED }} />
      </div>
      <div style={{ position: "absolute", right: 26, top: 18, fontSize: 48, color: RED }}>{Math.round(k)}%</div>
    </div>
  );
};

// 정답 O · 오답 X 가 화면 한가운데 쾅
const Mark: React.FC<{ kind: "o" | "x"; f: number }> = ({ kind, f }) => {
  if (f < 0) return null;
  const k = interpolate(f, [0, 6], [2.4, 1], { ...clamp, easing: expoOut });
  const color = kind === "o" ? "#2E86DE" : "#E63946";
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(f, [0, 2], [0, 1], clamp) }}>
      <svg viewBox="0 0 100 100" width={620} height={620} style={{ transform: `scale(${k}) rotate(${(1 - k) * 20}deg)`, filter: `drop-shadow(14px 14px 0 ${INK})` }}>
        {kind === "o" ? (
          <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="16" />
        ) : (
          <g stroke={color} strokeWidth="18" strokeLinecap="round">
            <line x1="18" y1="18" x2="82" y2="82" />
            <line x1="82" y1="18" x2="18" y2="82" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ※ 주석: 위쪽 구석에 작게, 근본 없는 해명
const Note: React.FC<{ t: string; f: number }> = ({ t, f }) => (
  <div style={{ position: "absolute", left: 40, bottom: 160, maxWidth: 820, fontFamily: GOTHIC, fontWeight: 800, fontSize: 32, color: "#fff", backgroundColor: "rgba(21,48,58,0.82)", padding: "8px 18px", borderRadius: 6, opacity: interpolate(f, [2, 6], [0, 1], clamp) }}>
    {t}
  </div>
);

// 필름 그레인: 매 프레임 바뀌는 잡티 (화면이 살아 있게)
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

const SPEAKER: Record<string, { name: string; color: string }> = {
  dad: { name: "아빠", color: INK },
  kid: { name: "아이", color: RED },
  mom: { name: "엄마", color: "#7A4FA0" },
  police: { name: "경찰관", color: "#1F5FA8" },
  traffic: { name: "교통경찰관", color: "#1F5FA8" },
  neighbor: { name: "옆 창구 아저씨", color: "#8A5A2B" },
};

const Subtitle: React.FC<{ line: PlacedLine }> = ({ line }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 4], [0.92, 1], { ...clamp, easing: expoOut });
  const speaker = SPEAKER[line.who];
  const docu = line.who === "docu";
  return (
    <div style={{ position: "absolute", left: 100, right: 100, bottom: docu ? 140 : 46, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${k})`, opacity: interpolate(f, [0, 2], [0, 1], clamp) }}>
      {speaker ? <span style={{ fontFamily: DISPLAY, fontSize: 36, color: "#fff", backgroundColor: speaker.color, padding: "4px 16px", borderRadius: 8, flexShrink: 0, transform: "rotate(-3deg)", border: "4px solid #fff" }}>{speaker.name}</span> : null}
      <span
        style={{
          fontFamily: GOTHIC,
          fontWeight: 800,
          fontSize: 54,
          lineHeight: 1.3,
          textAlign: "center",
          textWrap: "balance",
          color: docu ? YELLOW : "#fff",
          fontStyle: docu ? "italic" : undefined,
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke",
        }}
      >
        {line.text}
      </span>
    </div>
  );
};
