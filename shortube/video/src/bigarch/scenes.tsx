import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { clamp, Counter, Stamp } from "../market/effects";
import { fontFamily, springs } from "../theme";
import D from "./data.json";
import { display, Layer, LAYER_H, LayerKind, P, won } from "./fx";
import TL from "./timeline.json";

// 숫자는 모두 브리프 사실 카드(B01~B11)에서 온다 — output/briefs/2026-10-24_bigarch.md
const A = D.bigArch, M = D.bigMac;
const r1 = (x: number) => Math.round(x * 10) / 10;
const RATIO = { g: r1(A.g / M.g), kcal: r1(A.kcal / M.kcal), price: r1(A.price / M.price) }; // 1.7 · 1.8 · 2.2 (B09)
const PER_G = { a: r1(A.price / A.g), m: r1(M.price / M.g) }; // 33.5 · 25.6원 (B10)
const PER_G_UP = Math.round((A.price / A.g / (M.price / M.g) - 1) * 100); // 31% (B10)

const useIn = (at: number, cfg: { damping: number; stiffness?: number } = springs.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const s = useIn(4);
  return (
    <div style={{ position: "absolute", top: 200, left: 70, right: 130, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)`, wordBreak: "keep-all" }}>
      <div style={{ fontFamily: display, fontSize: 70, color: P.teal }}>{children}</div>
      {sub && <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: P.dim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

// 쌓인 버거 (아래→위 순서). drops 가 있으면 층마다 그 프레임에 위에서 떨어진다
const Stack: React.FC<{ layers: LayerKind[]; w: number; left: number; bottom: number; drops?: number[]; scale?: number }> = ({ layers, w, left, bottom, drops, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let y = bottom;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: `${left + w / 2}px ${bottom}px` }}>
      {layers.map((k, i) => {
        y -= LAYER_H[k] + (k === "cheese" ? 0 : 2);
        const at = drops ? drops[i] : -100;
        const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 180 } });
        if (drops && frame < at) return null;
        return <Layer key={i} kind={k} w={w} style={{ position: "absolute", left, top: y - (1 - s) * 900 }} />;
      })}
    </div>
  );
};

const ARCH: LayerKind[] = ["bunBottom", "lettuce", "patty", "cheese", "cheese", "patty", "cheese", "crispy", "bunTop"];
const MAC: LayerKind[] = ["bunBottom", "lettuce", "patty", "cheese", "bunBottom", "patty", "bunTop"];

// 1. 훅: 가격표가 쿵 떨어진다 (B01 · B02)
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = useIn(18, { damping: 11, stiffness: 160 });
  return (
    <>
      <Stack layers={ARCH} w={420} left={330} bottom={760} scale={0.95 + Math.sin(frame / 20) * 0.01} />
      <div style={{ position: "absolute", top: 820, left: 140, width: 800, transform: `translateY(${(1 - tag) * -700}px) rotate(${-4 + (1 - tag) * 10}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ background: P.cream, border: `8px solid ${P.teal}`, borderRadius: 34, padding: "26px 30px 30px", textAlign: "center", boxShadow: "0 18px 0 rgba(14,59,57,0.18)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, border: `7px solid ${P.teal}`, margin: "0 auto 10px" }} />
          <div style={{ fontFamily, fontWeight: 900, fontSize: 40, color: P.dim }}>맥도날드 빅아치 단품</div>
          <div style={{ fontFamily: display, fontSize: 190, color: P.teal, lineHeight: 1.05 }}>
            <Counter from={0} to={A.price} start={22} dur={20} digits={0} />
            <span style={{ fontSize: 110 }}>원</span>
          </div>
        </div>
      </div>
      <Stamp at={70} color={P.cheddar} rotate={6} style={{ top: 1180, left: 250, fontSize: 44, background: P.teal }}>
        국내 맥도날드 버거 중 최고가
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "10월 22일 나온 맥도날드 빅아치, 단품 12,400원", from: 5, to: 80, em: ["12,400원"] },
          { text: "한국 맥도날드 버거 중 가장 비쌉니다", from: 80, to: 150, em: ["가장"] },
        ]}
      />
    </>
  );
};

// 2. 쌓기: 층이 하나씩 떨어져 쌓이고 재료 꼬리표 (B03 · B06)
export const BuildScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [0, 200], [120, 0], clamp);
  const label = (text: string, y: number, at: number) => {
    const o = useIn(at);
    return (
      <div style={{ position: "absolute", left: 640, top: y, opacity: o, transform: `translateX(${(1 - o) * 60}px)`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 50, height: 5, background: P.teal, borderRadius: 3 }} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: 32, color: P.teal, background: P.cream, borderRadius: 14, padding: "4px 14px", whiteSpace: "nowrap" }}>{text}</div>
      </div>
    );
  };
  const cmp = useIn(200);
  const bar = (g: number) => (g / A.g) * 560;
  return (
    <>
      <Title sub="공식 영양정보 · 출시 보도">빅아치 한 개 쌓아 보기</Title>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${tilt}px)` }}>
        <Stack layers={ARCH} w={500} left={110} bottom={1250} drops={TL.layerDrop} />
        {label(`쇠고기 패티 ${A.patty}g`, 1095, TL.layerDrop[2] + 6)}
        {label("체다 치즈 3장", 1035, TL.layerDrop[6] + 6)}
        {label(`쇠고기 패티 ${A.patty}g`, 975, TL.layerDrop[5] + 10)}
        {label("크리스피 어니언", 915, TL.layerDrop[7] + 6)}
        {label("4.5인치 번", 820, TL.layerDrop[8] + 8)}
      </div>
      <div style={{ position: "absolute", top: 340, left: 90, right: 130, opacity: cmp, transform: `translateY(${(1 - cmp) * 30}px)`, background: P.cream, borderRadius: 26, padding: "20px 26px", border: `5px solid ${P.teal}` }}>
        {[
          { n: `이전 최대 · ${D.dqpc.name}`, g: D.dqpc.g, c: P.dim },
          { n: "빅아치", g: A.g, c: P.cheddar },
        ].map((r, i) => (
          <div key={i} style={{ marginTop: i ? 14 : 0 }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 28, color: P.teal }}>{r.n}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ height: 34, width: bar(r.g) * Math.min(1, cmp * 1.2), background: r.c, borderRadius: 10 }} />
              <div style={{ fontFamily: display, fontSize: 44, color: P.teal }}>{r.g}g</div>
            </div>
          </div>
        ))}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "113g 패티 2장에 치즈 3장", from: 10, to: 190, em: ["113g", "2장", "3장"] },
          { text: "가장 컸던 더블 쿼터파운더 치즈(275g)보다 95g 무겁습니다", from: 190, to: 330, em: ["95g"] },
        ]}
      />
    </>
  );
};

// 3. 저울 · 배수: 빅맥 vs 빅아치 무게 · 열량 · 값 (B04 · B05 · B07 · B09)
export const ScaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const press = useIn(30, { damping: 12, stiffness: 120 });
  const scale = (x: number, name: string, g: number, layers: LayerKind[], k: number) => (
    <div style={{ position: "absolute", left: x, top: 300, width: 400 }}>
      <Stack layers={layers} w={330} left={35} bottom={330 + press * (g / 40)} scale={k} />
      <div style={{ position: "absolute", left: 20, top: 340 + press * (g / 40), width: 360, height: 26, background: P.teal2, borderRadius: 13 }} />
      <div style={{ position: "absolute", left: 50, top: 380, width: 300, height: 120, background: P.teal, borderRadius: 26, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: display, fontSize: 64, color: P.cheddar, lineHeight: 1 }}>
          <Counter from={0} to={g} start={30} dur={24} digits={0} />g
        </div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 28, color: P.cream }}>{name}</div>
      </div>
    </div>
  );
  const rows = [
    { k: "무게", a: `${A.g}g`, m: `${M.g}g`, x: RATIO.g, at: 120 },
    { k: "열량", a: `${won(A.kcal)}kcal`, m: `${M.kcal}kcal`, x: RATIO.kcal, at: 210 },
    { k: "값", a: `${won(A.price)}원`, m: `${won(M.price)}원`, x: RATIO.price, at: 300 },
  ];
  const unit = 280;
  return (
    <>
      <Title sub="빅맥 한 개 = 1 로 놓고 보면">빅맥 vs 빅아치</Title>
      {scale(90, M.name, M.g, MAC, 0.5)}
      {scale(540, A.name, A.g, ARCH, 0.66)}
      {rows.map((r) => {
        const s = useIn(r.at);
        const grow = interpolate(frame, [r.at, r.at + 20], [0, 1], clamp);
        const top = 860 + rows.indexOf(r) * 150;
        return (
          <div key={r.k} style={{ position: "absolute", left: 90, top, width: 860, opacity: s }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily, fontWeight: 900, fontSize: 34, color: P.teal }}>{r.k}</span>
              <span style={{ fontFamily, fontWeight: 700, fontSize: 26, color: P.dim }}>{`${r.m} → ${r.a}`}</span>
            </div>
            <div style={{ position: "relative", height: 56, marginTop: 6 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 56, width: unit * r.x * grow, background: P.cheddar, borderRadius: 14 }} />
              <div style={{ position: "absolute", left: 0, top: 10, height: 36, width: unit, background: P.teal2, borderRadius: 10, opacity: 0.85 }} />
              <div style={{ position: "absolute", left: unit * r.x * grow + 14, top: -4, fontFamily: display, fontSize: 56, color: r.k === "값" ? P.over : P.teal, opacity: grow }}>{r.x}배</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1305, left: 90, fontFamily, fontWeight: 700, fontSize: 24, color: P.dim, opacity: useIn(130) }}>
        {`※ 중량은 공식 영양정보 ${A.g}g (출시 보도는 ${D.pressG}g)`}
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "무게는 370g, 빅맥의 약 1.7배", from: 100, to: 195, em: ["1.7배"] },
          { text: "열량은 1,036kcal, 약 1.8배", from: 195, to: 285, em: ["1.8배"] },
          { text: "그런데 값은 약 2.2배입니다", from: 285, to: 390, em: ["2.2배"] },
        ]}
      />
    </>
  );
};

// 4. 1g당 값 (B10) — 이 영상의 직접 계산
export const GramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const maxH = 560, base = 1150;
  const col = (x: number, name: string, v: number, sub: string, c: string, at: number) => {
    const grow = interpolate(frame, [at, at + 26], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
    const h = (v / PER_G.a) * maxH * grow;
    return (
      <div style={{ position: "absolute", left: x, top: 0, width: 330 }}>
        <div style={{ position: "absolute", left: 0, width: 330, top: base - h - 130, textAlign: "center", fontFamily: display, fontSize: 92, color: P.teal, opacity: grow }}>
          <Counter from={0} to={v} start={at} dur={26} digits={1} />
          <span style={{ fontSize: 54 }}>원</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 250, top: base - h, height: h, background: c, borderRadius: "22px 22px 0 0", boxShadow: "inset -18px 0 0 rgba(0,0,0,0.08)" }} />
        <div style={{ position: "absolute", left: 0, width: 330, top: base + 14, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 40, color: P.teal }}>{name}</div>
        <div style={{ position: "absolute", left: 0, width: 330, top: base + 66, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 26, color: P.dim }}>{sub}</div>
      </div>
    );
  };
  return (
    <>
      <Title sub="단품 가격 ÷ 공식 중량 (직접 계산)">1g에 얼마?</Title>
      {col(110, M.name, PER_G.m, `${won(M.price)}원 ÷ ${M.g}g`, P.teal2, 60)}
      {col(570, A.name, PER_G.a, `${won(A.price)}원 ÷ ${A.g}g`, P.cheddar, 120)}
      <div style={{ position: "absolute", left: 90, right: 130, top: base, height: 6, background: P.teal, borderRadius: 3 }} />
      <Stamp at={210} color={P.over} rotate={-7} style={{ top: 860, left: 300, fontSize: 60, background: P.cream }}>
        {`1g당 ${PER_G_UP}% 비쌈`}
      </Stamp>
      <Caption
        bottom={400}
        lines={[
          { text: "1g 값으로 나눠 보면", from: 10, to: 100 },
          { text: "빅아치 33.5원, 빅맥 25.6원", from: 100, to: 210, em: ["33.5원", "25.6원"] },
          { text: "커진 만큼보다 값이 더 많이 올랐습니다", from: 210, to: 330, em: ["더"] },
        ]}
      />
    </>
  );
};

// 5. 하루 기준치 대비 (B04 · B08)
export const DailyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const full = 360, left = 110;
  const rows = [
    { k: "포화지방", v: `${A.satFat}g`, p: A.satFatPct, at: 50 },
    { k: "단백질", v: `${A.protein}g`, p: A.proteinPct, at: 130 },
    { k: "나트륨", v: `${won(A.sodium)}mg`, p: A.sodiumPct, at: 185 },
  ];
  const setIn = useIn(220);
  return (
    <>
      <Title sub="1일 영양성분 기준치 대비 · 공식 영양정보">빅아치 한 개면 하루치?</Title>
      <div style={{ position: "absolute", left: left + full, top: 380, width: 0, height: 700, borderLeft: `5px dashed ${P.teal}` }} />
      <div style={{ position: "absolute", left: left + full - 80, top: 340, width: 160, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 28, color: P.teal }}>하루 100%</div>
      {rows.map((r, i) => {
        const g = interpolate(frame, [r.at, r.at + 30], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
        const w = full * (r.p / 100) * g;
        const over = r.p > 100;
        return (
          <div key={r.k} style={{ position: "absolute", left, top: 420 + i * 220, width: 840, opacity: interpolate(frame, [r.at - 10, r.at], [0, 1], clamp) }}>
            <div style={{ fontFamily, fontWeight: 900, fontSize: 38, color: P.teal }}>
              {r.k} <span style={{ fontWeight: 700, fontSize: 30, color: P.dim }}>{r.v}</span>
            </div>
            <div style={{ position: "relative", height: 70, marginTop: 8, background: "rgba(14,59,57,0.12)", borderRadius: 18, width: full }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 70, width: Math.min(w, full), background: P.teal2, borderRadius: 18 }} />
              {over && w > full && <div style={{ position: "absolute", left: full - 6, top: 0, height: 70, width: w - full + 6, background: P.over, borderRadius: "0 18px 18px 0" }} />}
            </div>
            <div style={{ position: "absolute", left: Math.max(w, full * 0.25) + 16, top: 52, fontFamily: display, fontSize: 64, color: over ? P.over : P.teal, opacity: g, whiteSpace: "nowrap" }}>{Math.round(r.p * g)}%</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 110, top: 1110, width: 820, opacity: setIn, transform: `translateY(${(1 - setIn) * 30}px)`, background: P.teal, borderRadius: 24, padding: "18px 26px", fontFamily, fontWeight: 900, fontSize: 38, color: P.cream, textAlign: "center" }}>
        세트로 먹으면 <span style={{ color: P.cheddar }}>{A.setKcal}kcal</span>
      </div>
      <Caption
        bottom={400}
        lines={[
          { text: "버거 하나에 포화지방 26g, 하루 기준치의 172%", from: 40, to: 130, em: ["172%"] },
          { text: "단백질은 102%, 나트륨은 83%", from: 130, to: 215, em: ["102%", "83%"] },
          { text: "세트로 먹으면 1,360~1,499kcal입니다", from: 215, to: 300, em: ["1,360~1,499kcal"] },
        ]}
      />
    </>
  );
};

// 6. 해외에서 먼저 (B11 · B01)
export const WorldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 200, top = 380, gap = 220;
  const line = interpolate(frame, [10, 140], [0, gap * 3], clamp);
  return (
    <>
      <Title sub="출시 보도 기준">해외에서 먼저 팔렸다</Title>
      <div style={{ position: "absolute", left: x - 4, top, width: 8, height: line, background: P.teal, borderRadius: 4 }} />
      {D.world.map((w, i) => {
        const at = 10 + i * 43;
        const s = useIn(at);
        const kr = i === D.world.length - 1;
        return (
          <div key={i} style={{ position: "absolute", left: x - 30, top: top + i * gap - 30, display: "flex", alignItems: "center", gap: 30, opacity: s, transform: `translateX(${(1 - s) * 50}px)` }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: kr ? P.cheddar : P.teal, border: `8px solid ${P.cream}`, boxSizing: "border-box", transform: `scale(${kr ? 1 + Math.sin(frame / 5) * 0.06 : 1})` }} />
            <div>
              <div style={{ fontFamily: display, fontSize: kr ? 64 : 52, color: kr ? P.over : P.teal, lineHeight: 1 }}>{w.y}</div>
              <div style={{ fontFamily, fontWeight: 900, fontSize: 38, color: P.teal }}>
                {w.t} <span style={{ fontWeight: 700, fontSize: 30, color: P.dim }}>{w.s}</span>
              </div>
            </div>
          </div>
        );
      })}
      <Caption
        bottom={400}
        lines={[
          { text: "2024년 캐나다·포르투갈·독일에서 시작해", from: 8, to: 95, em: ["2024년"] },
          { text: "프랑스에선 대형 버거 판매 1위, 한국엔 10월 22일", from: 95, to: 180, em: ["10월", "22일"] },
        ]}
      />
    </>
  );
};

// 7. 마무리: 요약 · 출처 · 광고 아님
export const OutroScene: React.FC = () => {
  const lines = [
    `${A.name} ${A.g}g · ${won(A.kcal)}kcal · ${won(A.price)}원`,
    `빅맥보다 무게 ${RATIO.g}배 · 값 ${RATIO.price}배`,
    `1g당 ${PER_G.a}원 vs ${PER_G.m}원`,
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 300, left: 90, right: 130 }}>
        {lines.map((l, i) => {
          const s = useIn(4 + i * 10);
          return (
            <div key={i} style={{ fontFamily: display, fontSize: 46, color: i === 2 ? P.over : P.teal, marginBottom: 26, opacity: s, transform: `translateX(${(1 - s) * -40}px)`, wordBreak: "keep-all" }}>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 760, left: 90, right: 130, background: P.cream, borderRadius: 24, padding: "22px 26px", fontFamily, fontWeight: 700, fontSize: 28, color: P.teal, lineHeight: 1.55, opacity: useIn(30) }}>
        자료: 한국맥도날드 공식 영양정보(2026.10.24) · 가격은 출시 보도(아시아투데이 · ZDNet · 재경일보 · 에너지경제)
        <br />
        배수 · 1g당 값은 직접 계산 · 매장 · 배달 가격은 다를 수 있음
        <br />
        <b>광고 · 협찬 아님</b>
      </div>
      <Caption bottom={400} lines={[{ text: "숫자로 보면, 커진 것보다 값이 더 컸습니다", from: 6, to: 90, em: ["값이"] }]} />
    </>
  );
};
