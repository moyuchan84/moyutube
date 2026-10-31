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
