import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadDo } from "@remotion/google-fonts/DoHyeon";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { clamp, Stamp } from "../market/effects";
import D from "../../../../content/mvrace/script/data.json";
import TL from "../../../../content/mvrace/script/timeline.json";

// 2026-10-28 10월 K팝 뮤비 5편 조회수 레이스 (브리프: content/mvrace/plan.md)
// 연출: 밤 서킷 — 아스팔트 위 네온 레인 · 출발 신호등 · 체크무늬 깃발 전환 · 레인을 따라 흐르는 카메라.
// 숫자는 YouTube Data API 공개 조회수(사실 카드 R01~R05). 인물 사진 · 썸네일 · 로고 없음, 이름은 글자로만.
export const MVRACE_TOTAL = TL.total;
const { fontFamily: bungee } = loadBungee();
const { fontFamily: dohyeon } = loadDo();

const P = { road: "#101018", lane: "rgba(255,255,255,0.10)", ink: "#F5F3FF", dim: "#8D8AA8", yellow: "#FFE14D", red: "#FF3B3B" };
const AS_OF = Date.parse(D.asOf);
const MV = D.mvs.map((m) => {
  const h = (AS_OF - Date.parse(m.pub)) / 3.6e6;
  const kst = new Date(Date.parse(m.pub) + 9 * 3.6e6);
  return { ...m, h, perH: m.views / h, perS: m.views / (h * 3600), kst: `${kst.getUTCMonth() + 1}/${kst.getUTCDate()} ${String(kst.getUTCHours()).padStart(2, "0")}:${String(kst.getUTCMinutes()).padStart(2, "0")}` };
});
const BY_TOTAL = [...MV].sort((a, b) => b.views - a.views);
const BY_SPEED = [...MV].sort((a, b) => b.perH - a.perH);
const man = (n: number) => `${Math.round(n / 1e4)}만`; // 6417만처럼 쉼표 없이 (도현체 쉼표가 마침표처럼 보여서)
const find = (n: string) => MV.find((m) => m.name === n)!;
const LISA = find("LISA");
const ATEEZ = find("ATEEZ");
const ILLIT = find("ILLIT");
const RATIO = Math.round((LISA.views / ATEEZ.views) * 10) / 10; // 3.4배 (같은 시각 출발, 자체 계산)

const useIn = (at: number, cfg = { damping: 16, stiffness: 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

// 바탕: 아스팔트 + 흐르는 레인 점선 (카메라가 앞으로 달리는 느낌)
const Track: React.FC<{ speed?: number }> = ({ speed = 14 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #23203A 0%, ${P.road} 70%)` }}>
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 180 + i * 170,
            height: 5,
            opacity: 0.5,
            backgroundImage: `repeating-linear-gradient(90deg, ${P.lane} 0 60px, transparent 60px 130px)`,
            backgroundPositionX: -frame * speed * (1 + (i % 3) * 0.15),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// 장면 전환: 체크무늬 깃발이 대각선으로 쓸고 지나감
const Flag: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 20) return null;
  const x = interpolate(frame, [0, 20], [-1600, 1600]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: -300,
        width: 1300,
        height: 2600,
        transform: "rotate(14deg)",
        backgroundImage: "conic-gradient(#fff 25%, #111 0 50%, #fff 0 75%, #111 0)",
        backgroundSize: "120px 120px",
      }}
    />
  );
};

const Head: React.FC<{ small: string; children: React.ReactNode }> = ({ small, children }) => {
  const s = useIn(4);
  return (
    <div style={{ position: "absolute", top: 220, left: 70, right: 70, opacity: s, transform: `translateY(${(1 - s) * -40}px)` }}>
      <div style={{ fontFamily: bungee, fontSize: 30, color: P.yellow, letterSpacing: 3 }}>{small}</div>
      <div style={{ fontFamily: dohyeon, fontSize: 82, color: P.ink, lineHeight: 1.1, wordBreak: "keep-all" }}>{children}</div>
    </div>
  );
};

// 1. 훅: 출발 신호등 3 · 2 · 1 → GO
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lit = frame < 45 ? 0 : frame < 75 ? 1 : frame < 105 ? 2 : 3;
  const go = frame >= 105;
  return (
    <>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: dohyeon, fontSize: 56, color: P.dim }}>10월에 나온 K팝 뮤직비디오 5편</div>
        <div style={{ fontFamily: dohyeon, fontSize: 104, color: P.ink, lineHeight: 1.1, marginTop: 10 }}>
          누가 제일
          <br />
          빨리 달릴까?
        </div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 240, width: 600, height: 220, background: "#1C1C26", borderRadius: 40, border: "6px solid #333", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[0, 1, 2].map((i) => {
          const on = go || i < lit;
          const c = go ? "#2BFF6B" : P.red;
          return <div key={i} style={{ width: 140, height: 140, borderRadius: 70, background: on ? c : "#2A2A33", boxShadow: on ? `0 0 70px ${c}` : "none" }} />;
        })}
      </div>
      {go && (
        <div style={{ position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center", fontFamily: bungee, fontSize: 170, color: "#2BFF6B", transform: `scale(${interpolate(frame, [105, 112], [1.8, 1], clamp)})`, textShadow: "0 0 50px #2BFF6B" }}>
          GO!
        </div>
      )}
      <Caption
        bottom={400}
        lines={[
          { text: "10월에 나온 K팝 뮤직비디오 5편", from: 5, to: 70, em: ["5편"] },
          { text: "조회수 레이스, 누가 제일 빠를까?", from: 70, to: 150, em: ["레이스,"] },
        ]}
      />
    </>
  );
};

// 2. 총 조회수 막대 — 그런데 출발 시각이 다르다
const TotalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = BY_TOTAL[0].views;
  const warn = interpolate(frame, [150, 160], [0, 1], clamp);
  return (
    <>
      <Head small="TOTAL VIEWS">총 조회수로 줄 세우면</Head>
      {BY_TOTAL.map((m, i) => {
        const p = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 18, stiffness: 110 } });
        const top = 470 + i * 160;
        return (
          <div key={m.name} style={{ position: "absolute", top, left: 70, right: 70 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bungee, fontSize: 36, color: m.color }}>
              <span>
                {i + 1}. {m.name}
              </span>
              <span style={{ fontFamily: dohyeon, fontSize: 48, color: P.ink, opacity: p }}>{man(m.views)}</span>
            </div>
            <div style={{ height: 46, width: `${(m.views / max) * 100 * p}%`, background: m.color, borderRadius: 12, marginTop: 6, boxShadow: `0 0 30px ${m.color}88` }} />
            <div style={{ fontFamily: dohyeon, fontSize: 32, color: P.yellow, marginTop: 6, opacity: warn }}>
              출발 {m.kst} · {Math.round(m.h / 24 * 10) / 10}일째
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "총 조회수로 보면 LISA, MEOVV, ATEEZ 순", from: 10, to: 140, em: ["총"] },
          { text: "그런데 출발 시간이 다 다릅니다", from: 140, to: 240, em: ["출발"] },
        ]}
      />
    </>
  );
};

// 3. 시간당 조회수 레이스 — 레인 위를 달리는 캡슐, 순위가 뒤바뀜
const SpeedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const max = BY_SPEED[0].perH;
  const run = interpolate(frame, [30, 200], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  return (
    <>
      <Head small="VIEWS PER HOUR">1시간에 몇 번 재생됐나</Head>
      {BY_SPEED.map((m, i) => {
        const top = 500 + i * 160;
        const x = 70 + (m.perH / max) * 700 * run;
        const totalRank = BY_TOTAL.findIndex((t) => t.name === m.name) + 1;
        const show = interpolate(frame, [200 + i * 8, 210 + i * 8], [0, 1], clamp);
        const moved = totalRank - (i + 1);
        return (
          <div key={m.name}>
            <div style={{ position: "absolute", top: top + 58, left: 60, right: 60, height: 4, background: P.lane }} />
            <div style={{ position: "absolute", top: top + 70, left: 70, width: x - 70, height: 8, background: `linear-gradient(90deg, transparent, ${m.color})`, borderRadius: 4 }} />
            <div style={{ position: "absolute", top, left: x - 20, fontFamily: bungee, fontSize: 34, color: "#111", background: m.color, borderRadius: 40, padding: "8px 22px", boxShadow: `0 0 36px ${m.color}`, whiteSpace: "nowrap" }}>
              {m.name}
            </div>
            <div style={{ position: "absolute", top: top + 86, left: 70, fontFamily: dohyeon, fontSize: 40, color: P.ink, opacity: show }}>
              {i + 1}위 · 시간당 {man(m.perH)}회
              {moved !== 0 && (
                <span style={{ color: moved > 0 ? "#2BFF6B" : P.red, marginLeft: 16 }}>
                  {moved > 0 ? `▲${moved}` : `▼${-moved}`} (총 {totalRank}위)
                </span>
              )}
            </div>
          </div>
        );
      })}
      <Stamp at={260} color={P.yellow} rotate={-7} style={{ top: 1300 - 120, left: 520, fontSize: 46, fontFamily: dohyeon, background: "rgba(16,16,24,0.85)" }}>
        ILLIT 5위 → 2위
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "조회수를 공개 후 지난 시간으로 나누면", from: 10, to: 150, em: ["나누면"] },
          { text: "LISA 시간당 52만, ILLIT 19만으로 2위", from: 150, to: 250, em: ["52만,", "2위"] },
          { text: "MEOVV는 2위에서 5위로", from: 250, to: 330, em: ["5위로"] },
        ]}
      />
    </>
  );
};

// 4. 같은 날 같은 시각 출발: LISA vs ATEEZ (10/23 13:00)
const SamedayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [30, 120], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const pair = [LISA, ATEEZ];
  return (
    <>
      <Head small="SAME START">같은 날, 같은 시각 출발</Head>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontFamily: bungee, fontSize: 56, color: P.yellow }}>{LISA.kst}</div>
      {pair.map((m, i) => {
        const h = (m.views / LISA.views) * 560 * p;
        const left = 200 + i * 400;
        return (
          <div key={m.name}>
            <div style={{ position: "absolute", left, width: 280, top: 1240 - h, height: h, background: m.color, borderRadius: "24px 24px 0 0", boxShadow: `0 0 50px ${m.color}88` }} />
            <div style={{ position: "absolute", left: left - 40, width: 360, top: 1240 - h - 80, textAlign: "center", fontFamily: dohyeon, fontSize: 64, color: P.ink }}>{man(m.views * p)}</div>
            <div style={{ position: "absolute", left: left - 40, width: 360, top: 1256, textAlign: "center", fontFamily: bungee, fontSize: 40, color: m.color }}>{m.name}</div>
          </div>
        );
      })}
      <Stamp at={140} color="#FF3EA5" rotate={8} style={{ top: 640, left: 560, fontSize: 90, fontFamily: bungee, background: "rgba(16,16,24,0.85)" }}>
        ×{RATIO}
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "LISA와 ATEEZ는 10월 23일 오후 1시 동시 공개", from: 10, to: 110, em: ["동시"] },
          { text: "닷새 만에 6417만 대 1874만, 약 3.4배", from: 110, to: 210, em: ["3.4배"] },
        ]}
      />
    </>
  );
};

// 5. 1초 단위로: 재생 점이 쏟아짐
const PersecScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [LISA, ILLIT];
  return (
    <>
      <Head small="PER SECOND">1초로 쪼개 보면</Head>
      {rows.map((m, r) => {
        const n = Math.round(m.perS);
        const shown = Math.min(n, Math.floor(interpolate(frame, [20 + r * 50, 90 + r * 50], [0, n], clamp)));
        return (
          <div key={m.name} style={{ position: "absolute", top: 470 + r * 420, left: 70, right: 70 }}>
            <div style={{ fontFamily: dohyeon, fontSize: 60, color: P.ink }}>
              <span style={{ fontFamily: bungee, color: m.color, fontSize: 46 }}>{m.name}</span> 1초에 약 <span style={{ color: m.color, fontSize: 92 }}>{shown}</span>번
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, width: 940 }}>
              {Array.from({ length: shown }).map((_, i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: m.color, boxShadow: `0 0 10px ${m.color}` }} />
              ))}
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "LISA는 1초에 약 144번, ILLIT은 약 53번", from: 10, to: 120, em: ["144번,", "53번"] },
          { text: "공개 후 평균 속도라 첫날 기록과는 다릅니다", from: 120, to: 180, em: ["평균"] },
        ]}
      />
    </>
  );
};

// 6. 마무리: 시상대 + 기준 · 출처
const OutroScene: React.FC = () => {
  const s = useIn(6);
  const podium = [BY_SPEED[1], BY_SPEED[0], BY_SPEED[2]];
  const hs = [220, 320, 160];
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily: dohyeon, fontSize: 70, color: P.ink }}>시간당 조회수 시상대</div>
      {podium.map((m, i) => (
        <div key={m.name} style={{ position: "absolute", left: 120 + i * 290, width: 260, top: 1000 - hs[i] * s, height: hs[i] * s, background: m.color, borderRadius: "18px 18px 0 0", textAlign: "center" }}>
          <div style={{ fontFamily: bungee, fontSize: 36, color: P.ink, marginTop: -60 }}>{m.name}</div>
          <div style={{ fontFamily: bungee, fontSize: 70, color: "#111", marginTop: 10 }}>{[2, 1, 3][i]}</div>
        </div>
      ))}
      <div style={{ position: "absolute", top: 1050, left: 80, right: 80, fontFamily: dohyeon, fontSize: 32, color: P.dim, lineHeight: 1.45, textAlign: "center" }}>
        {D.asOfKst} YouTube 공개 조회수 기준 · 공식 뮤직비디오만
        <br />
        시간당 = 조회수 ÷ 공개 후 지난 시간 (직접 계산)
      </div>
      <Caption bottom={400} lines={[{ text: "조회수는 계속 바뀝니다. 지금은 몇 등일까요?", from: 5, to: 120, em: ["몇"] }]} />
    </>
  );
};

const TopBand: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: dohyeon, fontSize: 30, color: "#111", background: P.yellow, borderRadius: 8, padding: "6px 22px" }}>{`${D.asOfKst} 기준 · YouTube 공개 조회수`}</span>
  </div>
);

const SCENES: Record<string, React.FC> = { hook: HookScene, total: TotalScene, speed: SpeedScene, sameday: SamedayScene, persec: PersecScene, outro: OutroScene };

export const MvraceShort: React.FC = () => (
  <AbsoluteFill style={{ background: P.road }}>
    <Audio src={staticFile("bgm/mvrace.wav")} volume={0.7} />
    {TL.scenes.map(({ id, from, dur }, i) => {
      const Scene = SCENES[id];
      return (
        <Sequence key={id} from={from} durationInFrames={dur} premountFor={15}>
          <Track speed={id === "speed" ? 30 : 12} />
          <Scene />
          {i > 0 && <Flag />}
        </Sequence>
      );
    })}
    <TopBand />
  </AbsoluteFill>
);
