import React from "react";
import { Img, getStaticFiles, staticFile } from "remotion";
import { Character } from "./Character";
import { Backdrop, Caption, FONT, H, HOT, INK, Stickers, Txt, W, clamp, easeInOut, easeOut, fit, hit, isDark, pop, rnd } from "./fx";
import { mouthAt, syllables } from "./mouth";
import type { BuiltShot } from "./timeline";

export type ShotProps = { s: BuiltShot; f: number; bf: number };

const useMouth = (s: BuiltShot, f: number) => {
  const syls = React.useMemo(() => syllables(s.say ?? ""), [s.say]);
  const t = s.speak ? (f - 2) / s.speak : -1;
  const speaking = !!s.say && s.speak > 0 && t >= 0 && t <= 1;
  const env = s.env ? s.env[Math.max(0, Math.min(s.env.length - 1, f - 2))] ?? 0 : null;
  return { mouth: speaking ? mouthAt(syls, t, env) : { open: 0, wide: 0.5 }, speaking };
};

const txtColor = (bg?: string) => (isDark(bg) ? "#fff" : "#fff"); // 테두리 글자라 배경과 상관없이 흰색 + 먹색 테두리

// ── 캐릭터 한 명 크게 ──
export const CharShot: React.FC<ShotProps> = ({ s, f, bf }) => {
  const { mouth, speaking } = useMouth(s, f);
  const flip = s.idx % 2 === 1 && s.face !== "sleepy";
  const p = pop(f, 0, 10);
  const squash = 1 + 0.04 * hit(f % bf, 4);
  const cut = s.cutAnim ? clamp((f - 4) / (s.len * 0.55)) : undefined;
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "rays"} dark={s.dark} frame={f} />
      <Stickers emoji={s.emoji} f={f} idx={s.idx} />
      <div style={{ position: "absolute", left: 90, top: 430, width: 900, height: 1141, transformOrigin: "50% 100%", transform: `translateY(${(1 - p) * 280}px) scale(${flip ? -squash : squash}, ${squash}) rotate(${(1 - p) * (flip ? 8 : -8)}deg)` }}>
        <Character frame={f} mouth={mouth} speaking={speaking} face={s.face ?? "normal"} pose={s.pose ?? "idle"} look={s.cutAnim ? { ...s.lookNow, hair: "long" } : s.lookNow} cut={cut} uid={`c${s.idx}`} />
      </div>
      <Caption text={s.text} f={f} />
    </>
  );
};

// ── 얼굴 클로즈업 (리액션) ──
export const CloseShot: React.FC<ShotProps> = ({ s, f, bf }) => {
  const { mouth, speaking } = useMouth(s, f);
  const z = 1 + f * 0.004 + 0.03 * hit(f % bf, 5);
  const cut = s.cutAnim ? clamp((f - 3) / (s.len * 0.6)) : undefined;
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "stripes"} dark={s.dark} frame={f} />
      <div style={{ position: "absolute", left: -240, top: 30, width: 1560, height: 1976, transform: `scale(${z})`, transformOrigin: "50% 38%" }}>
        <Character frame={f} mouth={mouth} speaking={speaking} face={s.face ?? "normal"} pose={s.pose ?? "idle"} look={s.cutAnim ? { ...s.lookNow, hair: "long" } : s.lookNow} cut={cut} uid={`z${s.idx}`} />
      </div>
      <Stickers emoji={s.emoji} f={f} idx={s.idx} size={300} spots={[[40, 1030, -12], [720, 1000, 10]]} />
      <Caption text={s.text} f={f} y={1380} max={110} />
    </>
  );
};

// ── 똑같은 캐릭터 여러 명 ──
export const CrowdShot: React.FC<ShotProps> = ({ s, f, bf }) => {
  const n = s.n ?? 9;
  const cw = 300, ch = 380;
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "dots"} dark={s.dark} frame={f} />
      {Array.from({ length: n }, (_, i) => {
        const c = i % 3, r = Math.floor(i / 3);
        const p = pop(f, i * 2, 8);
        const odd = s.odd === i;
        return (
          <div key={i} style={{ position: "absolute", left: 90 + c * cw, top: 310 + r * (ch + 8), width: cw, height: ch, transform: `scale(${p}) translateY(${Math.sin(f / 5 + i) * 6 + hit(f % bf, 3) * -10}px)` }}>
            <Character frame={f + i * 3} mouth={{ open: 0, wide: 0.5 }} speaking={false} face={odd ? "smug" : s.face ?? "deadpan"} pose="idle" look={odd ? { ...s.lookNow, hair: "long", shirt: "#FF5FA2" } : s.lookNow} uid={`k${s.idx}-${i}`} />
          </div>
        );
      })}
      <Caption text={s.text} f={f} y={1390} max={118} />
    </>
  );
};

// ── 큰 글자 한 방 ──
export const TextShot: React.FC<ShotProps> = ({ s, f, bf }) => {
  const lines = (s.text ?? "").split("/");
  const size = fit(s.text ?? "", 960, 210);
  const gap = Math.min(bf, (s.len - 6) / Math.max(1, lines.length));
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "rays"} dark={s.dark} frame={f} />
      {s.emoji?.[0] && <div style={{ position: "absolute", left: 140, top: 560, fontSize: 800, opacity: 0.28, transform: `rotate(${f * 1.2}deg)`, lineHeight: 1 }}>{s.emoji[0]}</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => {
          const t = f - i * gap;
          const p = pop(t, 0, 7);
          return (
            <div key={i} style={{ opacity: t >= 0 ? 1 : 0, transform: `scale(${t >= 0 ? 0.4 + 0.6 * p + 1.1 * hit(t, 2.5) : 0}) rotate(${(rnd(s.idx + i) - 0.5) * 7 * (1 - hit(t, 12))}deg)` }}>
              <Txt text={l} size={size} color={txtColor(s.bg)} />
            </div>
          );
        })}
      </div>
      <Stickers emoji={s.emoji?.slice(1)} f={f} idx={s.idx} />
    </>
  );
};

// ── 검은 화면 + 흰 글자 (오프닝/엔딩/침묵 개그) ──
export const TitleShot: React.FC<ShotProps> = ({ s, f }) => {
  const lines = (s.text ?? "").split("/");
  const size = fit(s.text ?? "", 940, 190);
  return (
    <>
      <Backdrop bg={s.bg ?? "#000"} bg2={s.bg2} pattern="none" frame={f} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {lines.map((l, i) => {
          const t = f - i * 5;
          return (
            <div key={i} style={{ opacity: t >= 0 ? 1 : 0, transform: `scale(${1 + 0.18 * hit(t, 5)})` }}>
              <Txt text={l} size={size} stroke={0} font={FONT.sans} style={{ color: "#fff" }} />
            </div>
          );
        })}
      </div>
    </>
  );
};

// ── 숫자 카운터 ──
export const CounterShot: React.FC<ShotProps> = ({ s, f }) => {
  const from = s.v0 ?? 0, to = s.v1 ?? 1;
  const t = easeInOut(f / Math.max(1, s.len * 0.8));
  const v = Math.round(from + (to - from) * t);
  const prev = Math.round(from + (to - from) * easeInOut((f - 1) / Math.max(1, s.len * 0.8)));
  const jolt = v !== prev ? 1 : 0;
  const txt = `${s.prefix ?? ""}${v}`;
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "grid"} dark={s.dark} frame={f} />
      <Stickers emoji={s.emoji} f={f} idx={s.idx} size={260} spots={[[70, 380, -10], [740, 400, 10]]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
        <div style={{ transform: `scale(${pop(f, 0, 9)})` }}><Txt text={s.label ?? ""} size={fit(s.label ?? "", 900, 100)} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", transform: `translate(${jolt * (rnd(f) - 0.5) * 24}px, ${jolt * (rnd(f + 9) - 0.5) * 24}px) scale(${1 + 0.08 * hit(f, 5)})` }}>
        <Txt text={txt} size={Math.min(360, Math.floor(980 / (txt.length * 0.62)))} font={FONT.sans} stroke={16} />
      </div>
      <Caption text={s.text} f={f} y={1380} max={110} />
    </>
  );
};

// ── 기대 vs 현실 ──
export const SplitShot: React.FC<ShotProps> = ({ s, f, bf }) => {
  const sides = [s.left, s.right];
  return (
    <>
      <Backdrop bg="#111" pattern="none" frame={f} />
      {sides.map((sd, i) => {
        if (!sd) return null;
        const p = easeOut((f - i * 5) / 7);
        const top = 352 + i * 612;
        const bg = sd.bg ?? (i ? "#FF5A5F" : "#4D9DFF");
        return (
          <div key={i} style={{ position: "absolute", left: 50, top, width: 980, height: 588, borderRadius: 36, border: `8px solid ${INK}`, background: bg, overflow: "hidden", transform: `translateX(${(i ? 1 : -1) * (1 - p) * 1100}px)` }}>
            <Backdrop bg={bg} pattern="rays" frame={f} />
            <div style={{ position: "absolute", left: 250, top: 60, width: 560, height: 710, transform: `translateY(${hit(f % bf, 3) * -8}px)` }}>
              <Character frame={f + i * 5} mouth={{ open: 0, wide: 0.5 }} speaking={false} face={sd.face ?? "normal"} pose={sd.pose ?? "idle"} look={s.lookNow} uid={`s${s.idx}-${i}`} />
            </div>
            {sd.emoji && <div style={{ position: "absolute", right: 40, top: 60, fontSize: 200, lineHeight: 1, transform: `rotate(${Math.sin(f / 6) * 8}deg)` }}>{sd.emoji}</div>}
            <div style={{ position: "absolute", left: 28, top: 24, background: INK, color: HOT, fontFamily: FONT.impact, fontSize: 70, padding: "4px 28px 10px", borderRadius: 18 }}>{sd.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 80, top: 912, width: 160, height: 160, borderRadius: 80, background: HOT, border: `8px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.impact, fontSize: 70, transform: `rotate(${f * 6}deg) scale(${pop(f, 8)})` }}>
        <span style={{ transform: `rotate(${-f * 6}deg)` }}>VS</span>
      </div>
      <Caption text={s.text} f={f} y={1380} max={110} />
    </>
  );
};

// ── 도장 쾅 ──
export const StampShot: React.FC<ShotProps> = ({ s, f }) => {
  const t = f - 6;
  const size = fit(s.text ?? "", 760, 190);
  const sc = t < 0 ? 0 : 1 + 2.2 * hit(t, 2.2);
  const shake = t >= 0 && t < 8 ? (rnd(f) - 0.5) * 26 * (1 - t / 8) : 0;
  return (
    <>
      <Backdrop bg={s.bg ?? "#F6EBD3"} pattern="grid" frame={0} />
      <div style={{ position: "absolute", left: 120, top: 380, width: 840, height: 1000, background: "#fff", border: `8px solid ${INK}`, borderRadius: 20, boxShadow: "14px 14px 0 rgba(0,0,0,0.25)", transform: `rotate(2deg) translate(${shake}px, ${shake}px)` }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 90 + i * 56, height: 12, background: "#D9D3C4", width: i % 3 === 2 ? 420 : 720, borderRadius: 6 }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: t >= 0 ? 1 : 0, transform: `scale(${sc}) rotate(-9deg)` }}>
        <div style={{ border: "18px solid #E5322D", borderRadius: 30, padding: "10px 40px 24px", boxShadow: "inset 0 0 0 4px #E5322D" }}>
          <Txt text={(s.text ?? "").replace("/", " ")} size={size} color="#E5322D" hot="#E5322D" stroke={0} style={{ color: "#E5322D" }} />
        </div>
      </div>
      {s.sub && <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", fontFamily: FONT.sans, fontSize: 72, color: INK, opacity: t > 8 ? 1 : 0 }}>{s.sub}</div>}
    </>
  );
};

// ── 체크리스트가 빠르게 쌓인다 ──
export const ListShot: React.FC<ShotProps> = ({ s, f }) => {
  const items = s.items ?? [];
  const step = Math.max(4, (s.len - 8) / Math.max(1, items.length));
  return (
    <>
      <Backdrop bg={s.bg ?? "#FFF8E7"} pattern="paper" frame={f} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", transform: `scale(${pop(f, 0, 8)})` }}><Txt text={s.text ?? ""} size={fit(s.text ?? "", 900, 120)} /></div>
      {items.map((it, i) => {
        const t = f - 4 - i * step;
        const p = easeOut(t / 5);
        const last = i === items.length - 1;
        return (
          <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 600 + i * 190, height: 150, borderRadius: 28, border: `7px solid ${INK}`, background: last ? "#FF5A5F" : "#fff", display: "flex", alignItems: "center", gap: 28, paddingLeft: 36, opacity: t >= 0 ? 1 : 0, transform: `translateX(${(1 - p) * -1200}px) rotate(${(1 - p) * -6}deg)`, boxShadow: "10px 10px 0 rgba(0,0,0,0.25)" }}>
            <div style={{ width: 80, height: 80, borderRadius: 18, border: `7px solid ${INK}`, background: "#2BC16E", color: "#fff", fontFamily: FONT.impact, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
            <Txt text={it} size={fit(it, 740, 84)} color={last ? "#fff" : INK} hot={last ? HOT : "#E5322D"} stroke={0} font={FONT.sans} style={{ color: last ? "#fff" : INK }} />
          </div>
        );
      })}
    </>
  );
};

// ── 게이지 ──
export const MeterShot: React.FC<ShotProps> = ({ s, f }) => {
  const from = s.v0 ?? 0, to = s.v1 ?? 100;
  const t = easeInOut(f / Math.max(1, s.len * 0.75));
  const v = from + (to - from) * t;
  const down = to < from;
  const color = down ? "#FF3B3B" : "#2BC16E";
  return (
    <>
      <Backdrop bg={s.bg} bg2={s.bg2} pattern={s.pattern ?? "stripes"} dark={s.dark} frame={f} />
      <Stickers emoji={s.emoji?.slice(0, 1)} f={f} idx={s.idx} size={280} spots={[[390, 330, 0]]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", transform: `scale(${pop(f, 0, 9)})` }}><Txt text={s.label ?? ""} size={fit(s.label ?? "", 900, 110)} /></div>
      <div style={{ position: "absolute", left: 100, top: 830, width: 880, height: 140, borderRadius: 70, border: `9px solid ${INK}`, background: "#fff", overflow: "hidden", boxShadow: "10px 10px 0 rgba(0,0,0,0.25)" }}>
        <div style={{ width: `${v}%`, height: "100%", background: color }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", transform: `scale(${1 + 0.06 * hit(f % 8, 3)})` }}><Txt text={`${Math.round(v)}%`} size={260} font={FONT.sans} stroke={16} /></div>
      <Caption text={s.text} f={f} y={1380} max={110} />
    </>
  );
};

export const SHOTS: Record<string, React.FC<ShotProps>> = {
  char: CharShot, close: CloseShot, crowd: CrowdShot, text: TextShot, title: TitleShot, counter: CounterShot, split: SplitShot, stamp: StampShot, list: ListShot, meter: MeterShot,
};
export { H, W };

// ── 장면 그림 (Gemini 웹툰 일러스트) + 켄번스 · 집중선 · 말풍선 ──
const SpeedLines: React.FC<{ f: number }> = ({ f }) => (
  <div
    style={{
      position: "absolute", inset: -200,
      background: `repeating-conic-gradient(from ${(f % 3) * 3}deg at 50% 45%, rgba(20,16,12,0.55) 0deg 0.7deg, transparent 0.7deg 5deg)`,
      WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, transparent 34%, #000 62%)",
      maskImage: "radial-gradient(ellipse at 50% 45%, transparent 34%, #000 62%)",
    }}
  />
);

const Bubble: React.FC<{ text: string; f: number; speak: number }> = ({ text, f, speak }) => {
  const p = pop(f, 2, 8);
  const gone = speak ? clamp((f - 2 - speak - 8) / 5) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", transform: `scale(${p * (1 - gone)}) rotate(-3deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", background: "#fff", border: `8px solid ${INK}`, borderRadius: 60, padding: "18px 48px 26px", boxShadow: "10px 10px 0 rgba(0,0,0,0.25)" }}>
        <Txt text={text} size={fit(text, 760, 96)} color={INK} stroke={0} font={FONT.sans} />
        <div style={{ position: "absolute", left: "48%", bottom: -46, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `48px solid ${INK}` }} />
        <div style={{ position: "absolute", left: "calc(48% + 9px)", bottom: -30, width: 0, height: 0, borderLeft: "17px solid transparent", borderRight: "17px solid transparent", borderTop: "34px solid #fff" }} />
      </div>
    </div>
  );
};

export const PicShot: React.FC<ShotProps> = ({ s, f }) => {
  const file = `rush/${s.themeId}/${s.art}.png`;
  const have = getStaticFiles().some((x) => x.name === file);
  const t = clamp(f / s.len);
  const dir = s.idx % 2 ? 1 : -1;
  const z = 1.2 + 0.08 * t + 0.08 * hit(f, 3); // 그림 위아래 여백과 우하단 Gemini 표시를 잘라낸다
  return (
    <>
      <Backdrop bg="#FFF8E7" pattern="paper" frame={f} />
      {have ? (
        <Img src={staticFile(file)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover", transformOrigin: "50% 46%", transform: `translateX(${dir * (t - 0.5) * 50}px) scale(${z})` }} />
      ) : (
        <>
          <div style={{ position: "absolute", left: 90, top: 430, width: 900, height: 1141 }}>
            <Character frame={f} mouth={{ open: 0, wide: 0.5 }} speaking={false} face="shock" pose="shrug" look={s.lookNow} uid={`p${s.idx}`} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT.sans, fontSize: 56, color: "#E5322D" }}>그림 준비 중: {s.art}</div>
        </>
      )}
      {s.cam === "shake" && <SpeedLines f={f} />}
      <Stickers emoji={s.emoji} f={f} idx={s.idx} />
      {s.say && <Bubble text={s.say} f={f} speak={s.speak} />}
      <Caption text={s.text} f={f} y={1330} />
    </>
  );
};
SHOTS.pic = PicShot;
