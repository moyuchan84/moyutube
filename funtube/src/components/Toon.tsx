import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { activeBeat, buildTimeline, type Beat } from "../timeline";
import { SAFE, Sfx, TitleBar, Voices, blackHan, jua, shakeOffset } from "./common";
import { Kid, kidBox, type Pose } from "../toon/Kid";
import { DustCloud, Pop, SpeedLines, Stars, rand } from "../toon/fx";

const EP = "fight" as const;
const GROUND = 1130;
const K = 1.15;
const SIDE: Record<string, "L" | "R"> = { 민수: "L", 철구: "R" };
const LOOK: Record<string, { hair: string; shirt: string; pants: string }> = {
  민수: { hair: "#2b211c", shirt: "#ffffff", pants: "#2c3a63" },
  철구: { hair: "#5a3a22", shirt: "#e9eef7", pants: "#3b3b3b" },
};
const TAG: Record<string, string> = { 민수: "#3b7dff", 철구: "#e5483b", 구경꾼: "#2fa86a", 선생님: "#8a55c8", 나레이션: "#555" };

// 카메라: s=배율, x/y=화면 중앙(540,900)에 오게 할 장면 좌표
const CAMS: Record<string, { s: number; x: number; y: number }> = {
  wide: { s: 1, x: 540, y: 900 },
  mid: { s: 1.3, x: 500, y: 820 },
  closeL: { s: 1.9, x: 340, y: 780 },
  closeR: { s: 1.9, x: 740, y: 780 },
  face: { s: 2.7, x: 340, y: 745 },
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - (1 - t) ** 3;

// 현재 대사까지의 연출 상태를 누적해서 구한다 (포즈 · 카메라 · 장면은 다음 지정 전까지 유지)
const resolve = (beats: Beat[], cur: number) => {
  let cam = "wide", prevCam = "wide", camSince = 0, scene = "school";
  const pose: Record<string, Pose> = { 민수: "normal", 철구: "normal", 선생님: "normal" };
  const since: Record<string, number> = { 민수: 0, 철구: 0, 선생님: 0 };
  const dmg: Record<string, number> = { 민수: 0, 철구: 0 };
  for (let i = 0; i <= cur; i++) {
    const b = beats[i];
    if (b.cam && b.cam !== cam) { prevCam = cam; cam = b.cam; camSince = b.from; }
    if (b.scene) scene = b.scene;
    for (const [who, p] of Object.entries(b.pose ?? {})) if (pose[who] !== p) { pose[who] = p as Pose; since[who] = b.from; }
    Object.assign(dmg, b.dmg ?? {});
  }
  return { cam, prevCam, camSince, scene, pose, since, dmg };
};

const School: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(#7fcdf7 0%, #d8f1ff 55%)" }} />
    <div style={{ position: "absolute", left: 120, top: 220, width: 220, height: 80, borderRadius: 60, background: "#fff", opacity: 0.9 }} />
    <div style={{ position: "absolute", left: 700, top: 330, width: 260, height: 90, borderRadius: 60, background: "#fff", opacity: 0.9 }} />
    {/* 학교 건물 */}
    <div style={{ position: "absolute", left: -20, top: 520, width: 1120, height: 520, background: "#e8d7b5", borderTop: "14px solid #b9a37a" }}>
      {[0, 1, 2, 3, 4].map((c) => [0, 1].map((r) => (
        <div key={`${c}${r}`} style={{ position: "absolute", left: 60 + c * 210, top: 50 + r * 200, width: 130, height: 130, background: "#9ed8f5", border: "10px solid #fff", borderRadius: 8 }} />
      )))}
    </div>
    {/* 철조망 */}
    <div style={{ position: "absolute", left: 0, top: 930, width: 1080, height: 190, backgroundImage: "repeating-linear-gradient(45deg, transparent 0 28px, #8a8f98 28px 32px), repeating-linear-gradient(-45deg, transparent 0 28px, #8a8f98 28px 32px)", opacity: 0.8 }} />
    <div style={{ position: "absolute", left: 0, top: GROUND - 10, width: 1080, height: 800, background: "#c79a68" }} />
    <div style={{ position: "absolute", left: 0, top: GROUND - 10, width: 1080, height: 14, background: "#a77d4f" }} />
  </AbsoluteFill>
);

const Hall: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#d7e9d3" }} />
    <div style={{ position: "absolute", left: 0, top: 740, width: 1080, height: 400, background: "#b9d3b4" }} />
    <div style={{ position: "absolute", left: 80, top: 280, width: 300, height: 400, background: "#8a6a45", border: "16px solid #6d5233", borderRadius: 6, color: "#fff", fontFamily: blackHan, fontSize: 56, textAlign: "center", paddingTop: 140 }}>교무실</div>
    <div style={{ position: "absolute", left: 720, top: 320, width: 280, height: 200, background: "#fff7d6", border: "12px solid #c5a15a", fontFamily: jua, fontSize: 44, color: "#a33", textAlign: "center", paddingTop: 56 }}>싸우지<br />말자</div>
    <div style={{ position: "absolute", left: 0, top: GROUND - 10, width: 1080, height: 800, background: "#d8b98a" }} />
    <div style={{ position: "absolute", left: 0, top: GROUND - 10, width: 1080, height: 14, background: "#a98a5b" }} />
  </AbsoluteFill>
);

export const Toon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, beats } = buildTimeline(EP);
  const cur = activeBeat(beats, frame);
  const b = cur >= 0 ? beats[cur] : null;
  const st = resolve(beats, cur);

  const speaking = (who: string) => !!b && b.who === who && frame - b.from < b.speak;
  const hitBeat = [...beats].reverse().find((x) => x.fx === "hit" && x.from <= frame);
  const hitT = hitBeat ? frame - hitBeat.from : -1;
  const brawl = b?.fx === "brawl";
  const aura = b?.fx === "aura";

  // ---- 카메라 ----
  const from = CAMS[st.prevCam], to = CAMS[st.cam];
  const p = ease(clamp((frame - st.camSince) / 9));
  const drift = 1 + 0.04 * clamp((frame - st.camSince) / 100);
  const punch = hitT >= 0 ? 0.14 * Math.exp(-hitT / 6) : 0;
  const s = (from.s + (to.s - from.s) * p) * drift * (1 + punch);
  const cx = from.x + (to.x - from.x) * p;
  const cy = from.y + (to.y - from.y) * p;
  const sh = hitBeat ? shakeOffset(frame, hitBeat.from, 14, 26) : { x: 0, y: 0 };
  const brawlShake = brawl ? { x: Math.sin(frame * 2.3) * 9, y: Math.cos(frame * 2.9) * 9 } : { x: 0, y: 0 };

  // ---- 캐릭터 배치 ----
  const hall = st.scene === "hall";
  const baseX = (who: string) => (hall ? (SIDE[who] === "L" ? 250 : 830) : SIDE[who] === "L" ? 340 : 740);
  const box = kidBox(K);

  const renderKid = (who: string) => {
    const side = SIDE[who];
    const dir = side === "L" ? 1 : -1; // 상대 쪽 방향
    const pose = st.pose[who];
    const poseT = frame - st.since[who];
    const pop = spring({ frame: poseT, fps, config: { damping: 8, stiffness: 180 } });
    let x = baseX(who);
    let y = Math.sin(frame / 11 + (side === "L" ? 0 : 2)) * 3;
    let rot = 0;
    let sc = 1 + 0.14 * (1 - pop) * (pose === "normal" ? 0 : 1);

    if (pose === "punch") x += dir * 80 * pop;
    if (pose === "glow") { sc *= 1.05 + Math.sin(frame * 0.7) * 0.015; x += Math.sin(frame * 1.6) * 3; }
    if (pose === "shock") { x -= dir * 24 * pop; rot = -dir * 4; }
    if (pose === "hit" && hitBeat?.hit === who && hitT >= 0) { x -= dir * (12 + 44 * Math.exp(-hitT / 8)); rot = -dir * 12 * Math.exp(-hitT / 10); }
    if (pose === "down") { x -= dir * 34; y += 6; }
    if (pose === "sad") y += 4;
    if (pose === "brawl") {
      x = 540 + (side === "L" ? -60 : 60) + Math.sin(frame * 1.3 + (side === "L" ? 0 : 1.5)) * 45;
      y = Math.abs(Math.sin(frame * 0.9 + (side === "L" ? 0 : 2))) * -48;
      rot = Math.sin(frame * 1.1) * 14 * dir;
    }
    const look = LOOK[who];
    return (
      <div
        key={who}
        style={{
          position: "absolute", left: x - box.w / 2, top: GROUND - box.feet, width: box.w, height: box.h,
          transform: `translate(0px, ${y}px) rotate(${rot}deg) scale(${side === "R" ? -sc : sc}, ${sc})`,
          transformOrigin: `50% ${(box.feet / box.h) * 100}%`,
        }}
      >
        {pose === "glow" && (
          <div style={{ position: "absolute", left: -90, top: 40, width: box.w + 180, height: box.h, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,80,0.95) 0%, rgba(255,200,40,0.55) 45%, rgba(255,200,40,0) 72%)", transform: `scale(${1 + Math.sin(frame * 0.8) * 0.06})` }} />
        )}
        {pose === "glow" && Array.from({ length: 9 }, (_, i) => {
          const t = ((frame * 0.035 + i / 9) % 1);
          return <div key={i} style={{ position: "absolute", left: 40 + rand(i * 3) * (box.w - 80), top: box.h - 80 - t * box.h * 0.95, width: 10, height: 46, borderRadius: 6, background: "#fff4a8", opacity: 1 - t }} />;
        })}
        <div style={{ position: "relative" }}>
          <Kid pose={pose} talking={speaking(who)} frame={frame} k={K} dmg={st.dmg[who]} {...look} />
        </div>
      </div>
    );
  };

  // 구경꾼 (뒤쪽 작은 아이들)
  const crowdReact = b?.who === "구경꾼" || (hitBeat ? hitT >= 0 && hitT < 40 : false);
  const crowd = [
    { x: 110, hair: "#222", shirt: "#cfe4ff", pants: "#555" },
    { x: 540, hair: "#6a4a2a", shirt: "#ffe3c4", pants: "#3b4a7a" },
    { x: 970, hair: "#1b1b1b", shirt: "#d8f5d0", pants: "#444" },
  ];
  const crowdK = 0.62;
  const cbox = kidBox(crowdK);

  // 선생님
  const tK = 1.5;
  const tbox = kidBox(tK);

  // ---- 자막 ----
  const sub = b && b.who !== "효과" ? b : null;
  const subIn = sub ? spring({ frame: frame - sub.from, fps, config: { damping: 13 } }) : 0;
  const big = sub?.fx === "aura" && sub.who === "민수" && sub.text.includes("알았다");
  const tagColor = sub ? TAG[sub.who] ?? "#444" : "#444";

  // ---- 의성어 ----
  const soundBeat = b?.sound && b.fx !== "brawl" ? b : null;
  const brawlBeats = beats.filter((x) => x.fx === "brawl");

  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: jua, overflow: "hidden" }}>
      <Voices beats={beats} />
      {beats.filter((x) => x.sfx).map((x) => (
        <Sfx key={x.index} at={x.from} name={x.sfx!} volume={x.sfx === "tick" ? 0.3 : 0.8} />
      ))}
      {brawlBeats.length > 0 && Array.from({ length: Math.ceil((brawlBeats[brawlBeats.length - 1].from + brawlBeats[brawlBeats.length - 1].length - brawlBeats[0].from) / 11) }, (_, i) => (
        <Sfx key={`bw${i}`} at={brawlBeats[0].from + i * 11} name={i % 3 === 2 ? "boom" : "punch"} volume={0.35} />
      ))}

      {/* 카메라가 잡는 월드 */}
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${540 - cx * s + sh.x + brawlShake.x}px, ${900 - cy * s + sh.y + brawlShake.y}px) scale(${s})`,
        }}
      >
        {hall ? <Hall /> : <School />}

        {!hall && crowd.map((c, i) => {
          const hop = crowdReact ? Math.abs(Math.sin(frame * 0.5 + i)) * -22 : Math.sin(frame / 14 + i) * 2;
          return (
            <div key={i} style={{ position: "absolute", left: c.x - cbox.w / 2, top: GROUND - 36 - cbox.feet + hop, opacity: i === 1 ? 0 : 1 }}>
              <Kid pose={crowdReact ? "shock" : "normal"} talking={b?.who === "구경꾼" && i === 0 && speaking("구경꾼")} frame={frame + i * 7} k={crowdK} hair={c.hair} shirt={c.shirt} pants={c.pants} />
            </div>
          );
        })}

        {hall && (
          <div style={{ position: "absolute", left: 540 - tbox.w / 2, top: GROUND - 60 - tbox.feet + Math.sin(frame / 10) * 3 }}>
            <Kid pose={st.pose["선생님"]} talking={speaking("선생님")} frame={frame} k={tK} hair="#9a9a9a" shirt="#d9d3c3" pants="#2a2a2a" glasses tie />
          </div>
        )}

        {brawl && <DustCloud frame={frame} x={540} y={900} />}
        {renderKid("민수")}
        {renderKid("철구")}
        {brawl && <Stars frame={frame} x={500} y={640} />}
        {brawl && Array.from({ length: 4 }, (_, i) => {
          const slot = Math.floor((frame + i * 3) / 8);
          const words = ["퍽!", "퍼벅!", "팍!", "아악!", "콰당!", "퍽퍽!"];
          return (
            <Pop key={i} text={words[Math.floor(rand(slot * 4 + i) * words.length)]} frame={(frame + i * 3) % 8} size={92}
              x={300 + rand(slot * 7 + i) * 480} y={560 + rand(slot * 5 + i * 2) * 420} rot={(rand(slot * 3 + i) - 0.5) * 40}
              color={i % 2 ? "#fff" : "#ffe14a"} />
          );
        })}
      </AbsoluteFill>

      {/* 기 모으기 연출: 노란 번쩍임 + 집중선 */}
      {aura && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,240,120,${0.35 + 0.15 * Math.sin(frame)}) 0%, rgba(255,240,120,0) 70%)` }} />}
      {aura && <SpeedLines frame={frame} cy={760} color="rgba(255,255,255,0.8)" />}
      {hitT >= 0 && hitT < 4 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - hitT / 4 }} />}
      {hitT >= 0 && hitT < 6 && <SpeedLines frame={frame} cy={760} count={34} />}
      {hitBeat && hitT >= 0 && hitT < 28 && <Pop text={hitBeat.sound ?? "퍽!"} frame={hitT} y={620} />}
      {soundBeat && soundBeat.fx === "aura" && <Pop text={soundBeat.sound!} frame={frame - soundBeat.from} y={560} size={120} rot={-4} />}
      {b?.fx === "brawl" && b.sound && frame - b.from < 30 && <Pop text={b.sound} frame={frame - b.from} y={430} size={110} rot={5} color="#fff" />}

      {/* 비네팅 */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)", pointerEvents: "none" }} />

      {/* 제목 */}
      <Sequence from={0} durationInFrames={105} layout="none">
        <TitleBar title={title} color="#fff" bg="rgba(20,20,40,0.78)" />
      </Sequence>

      {/* 자막 */}
      {sub && (
        <div
          style={{
            position: "absolute", left: SAFE.side, right: SAFE.side, top: 1270, display: "flex", justifyContent: "center",
            transform: `scale(${interpolate(subIn, [0, 1], [0.8, 1])})`, opacity: subIn,
          }}
        >
          <div
            style={{
              position: "relative", background: sub.who === "나레이션" ? "rgba(20,20,30,0.82)" : "#fff",
              color: sub.who === "나레이션" ? "#fff" : "#1b1b1b", border: sub.who === "나레이션" ? "none" : `8px solid ${tagColor}`,
              borderRadius: 34, padding: "34px 44px", fontSize: big ? 84 : 62, lineHeight: 1.3, textAlign: "center",
              maxWidth: 940, boxShadow: "0 10px 0 rgba(0,0,0,0.25)", wordBreak: "keep-all",
              ...(big ? { background: "#fff6a8", color: "#c2290f" } : {}),
            }}
          >
            {sub.who !== "나레이션" && (
              <div style={{ position: "absolute", top: -44, left: 30, background: tagColor, color: "#fff", fontSize: 40, padding: "4px 26px", borderRadius: 24, fontFamily: blackHan }}>
                {sub.who}
              </div>
            )}
            {sub.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
