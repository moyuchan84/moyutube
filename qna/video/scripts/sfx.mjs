// 가이드용 효과음을 코드로 합성한다 (저작권 걱정 없는 임시 소리 — 최종본에서는 교체 권장).
// 사용: node scripts/sfx.mjs          (없는 소리만 만든다)
//       node scripts/sfx.mjs --force  (전부 다시 — 노이즈가 섞인 소리는 매번 조금씩 달라진다)
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const RATE = 44100;
const outDir = new URL("../public/sfx/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const force = process.argv.includes("--force");
const writeWav = (name, samples) => {
  if (!force && existsSync(new URL(name, outDir))) return;
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(name, outDir), Buffer.concat([header, data]));
};

const render = (seconds, fn) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const { freq = 0, amp = 0, extra = 0 } = fn(t);
    phase += (2 * Math.PI * freq) / RATE;
    out[i] = Math.sin(phase) * amp + extra;
  }
  return out;
};

// 삐끗: 위로 튀었다 떨어지는 코믹한 미끄럼 소리
writeWav(
  "boing.wav",
  render(0.45, (t) => ({
    freq: 380 + 420 * Math.sin(Math.min(t / 0.45, 1) * Math.PI) + 25 * Math.sin(t * 2 * Math.PI * 18),
    amp: 0.45 * Math.min(t / 0.01, 1) * Math.exp(-t * 5),
  })),
);

// 뚜둥: 낮은 북 두 번
const hit = (t, start, base) => {
  const u = t - start;
  if (u < 0) return 0;
  const f = base * (1 + 1.5 * Math.exp(-u * 30));
  return Math.sin(2 * Math.PI * f * u) * Math.exp(-u * 6) * 0.9 + (Math.random() * 2 - 1) * Math.exp(-u * 60) * 0.25;
};
writeWav("dudung.wav", render(1.3, (t) => ({ extra: hit(t, 0, 90) + hit(t, 0.3, 62) })));

// 페이지 넘김: 걸러진 노이즈 쉭
{
  let lp = 0;
  writeWav(
    "page.wav",
    render(0.35, (t) => {
      lp += 0.35 * ((Math.random() * 2 - 1) - lp);
      return { extra: lp * 0.6 * Math.sin(Math.PI * Math.min(t / 0.35, 1)) ** 2 };
    }),
  );
}

// 스팅어: 밝은 종소리 화음
writeWav(
  "stinger.wav",
  render(1.6, (t) => ({
    extra:
      [523.25, 659.25, 783.99, 1046.5].reduce(
        (acc, f) => acc + Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.01 * t),
        0,
      ) *
      0.12 *
      Math.min(t / 0.005, 1) *
      Math.exp(-t * 2.5),
  })),
);

// 삐—: 방송에서 말을 가릴 때 쓰는 1kHz 음
writeWav(
  "beep.wav",
  render(0.7, (t) => ({ freq: 1000, amp: 0.35 * Math.min(t / 0.01, 1) * Math.min((0.7 - t) / 0.02, 1) })),
);

// 뻥: 뻥튀기 터지는 소리 (낮은 쿵 + 흩어지는 노이즈)
{
  let lp = 0;
  writeWav(
    "pang.wav",
    render(0.9, (t) => {
      lp += 0.5 * ((Math.random() * 2 - 1) - lp);
      const thump = Math.sin(2 * Math.PI * (70 + 160 * Math.exp(-t * 40)) * t) * Math.exp(-t * 9) * 0.9;
      return { extra: thump + lp * Math.exp(-t * 7) * 0.8 };
    }),
  );
}

// 되감기: 빠르게 올라가는 테이프 소리
writeWav(
  "rewind.wav",
  render(0.6, (t) => ({
    freq: 300 + 1500 * (t / 0.6) ** 2 + 60 * Math.sin(t * 2 * Math.PI * 30),
    amp: 0.3 * Math.sin(Math.PI * Math.min(t / 0.6, 1)),
  })),
);

// ── 쇼츠 편집용 (src/shorts/Short.tsx) ──

// 휙: 장면이 넘어갈 때 (노이즈를 점점 밝게 쓸어 올린다)
{
  let lp = 0;
  writeWav(
    "whoosh.wav",
    render(0.42, (t) => {
      const u = t / 0.42;
      const prev = lp;
      lp += (0.04 + 0.5 * u * u) * ((Math.random() * 2 - 1) - lp);
      return { extra: (lp - prev * 0.6) * 1.6 * Math.sin(Math.PI * Math.min(u, 1)) ** 1.5 };
    }),
  );
}

// 뽁: 글자가 튀어나올 때
writeWav(
  "pop.wav",
  render(0.14, (t) => ({ freq: 1400 - 5000 * t, amp: 0.4 * Math.min(t / 0.003, 1) * Math.exp(-t * 28) })),
);

// 쾅: 도장 찍듯 큰 글자가 박힐 때
{
  let lp = 0;
  writeWav(
    "stamp.wav",
    render(0.6, (t) => {
      lp += 0.6 * ((Math.random() * 2 - 1) - lp);
      const thump = Math.sin(2 * Math.PI * (55 + 220 * Math.exp(-t * 55)) * t) * Math.exp(-t * 11);
      return { extra: thump * 0.95 + lp * Math.exp(-t * 25) * 0.7 };
    }),
  );
}

// ── 모션 편집판용 (src/motion/Motion.tsx) ──

// 삐빅: 오답 부저 (낮은 톱니파 두 번)
writeWav(
  "buzz.wav",
  render(0.7, (t) => {
    const on = t < 0.28 || (t > 0.34 && t < 0.66);
    const saw = ((t * 140) % 1) * 2 - 1 + (((t * 147) % 1) * 2 - 1);
    return { extra: on ? saw * 0.22 * Math.min(t / 0.01, 1) : 0 };
  }),
);

// 딩동: 정답 종소리 두 음
writeWav(
  "ding.wav",
  render(1.2, (t) => {
    const note = (f, start) => (t < start ? 0 : (Math.sin(2 * Math.PI * f * (t - start)) + 0.25 * Math.sin(2 * Math.PI * f * 3 * (t - start))) * Math.exp(-(t - start) * 4));
    return { extra: (note(1318.5, 0) + note(1046.5, 0.22)) * 0.3 };
  }),
);

// 끼익: 레코드 긁히는 소리 (노이즈를 빠르게 위아래로 훑는다)
{
  let lp = 0;
  writeWav(
    "scratch.wav",
    render(0.5, (t) => {
      const sweep = 0.5 + 0.45 * Math.sin(2 * Math.PI * 9 * t);
      lp += sweep * ((Math.random() * 2 - 1) - lp);
      const tone = Math.sin(2 * Math.PI * (600 + 900 * Math.sin(2 * Math.PI * 9 * t)) * t) * 0.3;
      return { extra: (lp * 0.6 + tone) * Math.sin(Math.PI * Math.min(t / 0.5, 1)) };
    }),
  );
}

// 휘이잉: 아래로 미끄러지는 슬라이드 휘슬 (망했다)
writeWav(
  "slide.wav",
  render(0.9, (t) => ({ freq: 1500 * Math.exp(-t * 1.8) + 18 * Math.sin(t * 2 * Math.PI * 7), amp: 0.32 * Math.min(t / 0.02, 1) * Math.min((0.9 - t) / 0.08, 1) })),
);

// 와장창: 크게 무너지는 소리 (노이즈 + 쇳소리 여러 개)
{
  let lp = 0;
  writeWav(
    "crash.wav",
    render(1.1, (t) => {
      lp += 0.8 * ((Math.random() * 2 - 1) - lp);
      const metal = [1730, 2410, 3170].reduce((a, f) => a + Math.sin(2 * Math.PI * f * t), 0) * 0.08 * Math.exp(-t * 5);
      const thump = Math.sin(2 * Math.PI * (60 + 140 * Math.exp(-t * 40)) * t) * Math.exp(-t * 8);
      return { extra: (lp * Math.exp(-t * 3.5) * 0.7 + metal + thump * 0.8) * 0.9 };
    }),
  );
}

// 똑딱: 생각하는 시간 (짧은 나무 소리 네 번)
writeWav(
  "tick.wav",
  render(1.0, (t) => {
    const u = t % 0.25;
    return { extra: Math.sin(2 * Math.PI * (Math.floor(t / 0.25) % 2 ? 1700 : 2100) * u) * Math.exp(-u * 90) * 0.5 };
  }),
);

console.log("sfx written");

// ── 모덕후용 ──

// 꿀꺽: 침 삼키는 소리 (낮게 꿀렁 내려갔다가 물방울처럼 똑)
writeWav(
  "gulp.wav",
  render(0.42, (t) => {
    const glug = t < 0.22 ? Math.sin(Math.PI * (t / 0.22)) : 0;
    const drop = t > 0.24 ? Math.sin(2 * Math.PI * (500 + 1600 * (t - 0.24)) * (t - 0.24)) * Math.exp(-(t - 0.24) * 30) * 0.6 : 0;
    return { freq: 240 - 420 * t + 30 * Math.sin(2 * Math.PI * 22 * t), amp: 0.55 * glug, extra: drop };
  }),
);

// 쪽: 볼 뽀뽀 (짧은 입술 떼는 소리 + 위로 올라가는 짧은 음)
{
  let lp = 0;
  writeWav(
    "chu.wav",
    render(0.25, (t) => {
      lp += 0.35 * ((Math.random() * 2 - 1) - lp);
      return { freq: 900 + 2600 * t, amp: 0.28 * Math.min(t / 0.004, 1) * Math.exp(-t * 26), extra: lp * Math.exp(-t * 70) * 0.9 };
    }),
  );
}

// ── 방귀 (모덕후 방귀 3부작) ──
// 괄약근이 떨리는 소리를 흉내 낸다: 주기마다 열렸다 닫히는 펄스(떨림 · 세기 흔들림) + 닫힐 때 축축한 잡음
// → 공명 저역 필터(엉덩이 방 울림) → 직류 제거. 끝에서 펄스가 드문드문 끊기면 "푸드득".
const fart = ({ dur, f0, f1, wobble = 0.12, jitter = 0.08, wet = 0.25, bright = 700, q = 2.5, sputter = 0, attack = 0.012, seed = 1 }) => {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const n = Math.round(dur * RATE);
  const raw = new Float32Array(n);
  let i = 0;
  while (i < n) {
    const t = i / RATE;
    const u = t / dur;
    const f = (f0 + (f1 - f0) * u) * (1 + wobble * Math.sin(2 * Math.PI * 6.5 * t + 1.3 * Math.sin(2 * Math.PI * 1.7 * t))) * (1 + jitter * (rnd() * 2 - 1));
    const period = Math.max(8, Math.round(RATE / f));
    const env = Math.min(1, t / attack) * Math.min(1, (dur - t) / 0.06) * (0.75 + 0.25 * Math.sin(Math.PI * Math.min(1, u * 1.4)));
    // 끝으로 갈수록 펄스가 빠진다 (푸드득)
    const skip = sputter > 0 && u > 1 - sputter && rnd() < ((u - (1 - sputter)) / sputter) * 0.7;
    const amp = skip ? 0 : env * (0.7 + 0.6 * rnd());
    const open = Math.round(period * (0.35 + 0.2 * rnd()));
    for (let k = 0; k < period && i + k < n; k++) {
      const flap = k < open ? Math.sin((Math.PI * k) / open) ** 2 : 0;
      const splat = k >= open && k < open + 40 ? (rnd() * 2 - 1) * wet * Math.exp(-(k - open) / 12) : 0;
      raw[i + k] = amp * (flap + splat + (rnd() * 2 - 1) * 0.04);
    }
    i += period;
  }
  // 공명 저역 필터 (biquad) + 직류 제거
  const w = (2 * Math.PI * bright) / RATE;
  const alpha = Math.sin(w) / (2 * q);
  const cw = Math.cos(w);
  const b0 = (1 - cw) / 2 / (1 + alpha), b1 = (1 - cw) / (1 + alpha), b2 = b0, a1 = (-2 * cw) / (1 + alpha), a2 = (1 - alpha) / (1 + alpha);
  const out = new Float32Array(n);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, dcx = 0, dcy = 0, peak = 0;
  for (let k = 0; k < n; k++) {
    const y = b0 * raw[k] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = raw[k]; y2 = y1; y1 = y;
    dcy = y - dcx + 0.995 * dcy; dcx = y;
    out[k] = dcy;
    peak = Math.max(peak, Math.abs(dcy));
  }
  for (let k = 0; k < n; k++) out[k] *= 0.85 / peak;
  return out;
};

// 뿡: 짧고 귀여운 한 방 (엄마 · 화면 전환)
writeWav("fart-short.wav", fart({ dur: 0.36, f0: 175, f1: 135, wobble: 0.08, jitter: 0.05, wet: 0.15, bright: 950, q: 3, seed: 3 }));
// 뿌우우웅: 길게 떨리다 끝에 푸드득 (삼촌)
writeWav("fart-long.wav", fart({ dur: 1.7, f0: 112, f1: 68, wobble: 0.18, jitter: 0.1, wet: 0.3, bright: 620, q: 2.2, sputter: 0.3, seed: 7 }));
// 삐익: 참다가 새어 나오는 높은 소리 (몰래 · 들킴)
writeWav("fart-squeak.wav", fart({ dur: 0.62, f0: 330, f1: 430, wobble: 0.06, jitter: 0.03, wet: 0.05, bright: 1700, q: 4, attack: 0.04, seed: 11 }));
// 부륵: 아주 짧은 한 방 (황 가스 악당이 튀어나올 때)
writeWav("fart-pop.wav", fart({ dur: 0.17, f0: 150, f1: 120, wobble: 0.05, jitter: 0.12, wet: 0.35, bright: 800, q: 2, seed: 5 }));
// 푸드드득: 축축하게 끊기는 소리 (고기 많이 먹은 날)
writeWav("fart-wet.wav", fart({ dur: 0.95, f0: 95, f1: 80, wobble: 0.25, jitter: 0.2, wet: 0.7, bright: 520, q: 1.6, sputter: 0.6, seed: 13 }));
