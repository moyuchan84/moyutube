// 가이드용 효과음을 코드로 합성한다 (저작권 걱정 없는 임시 소리 — 최종본에서는 교체 권장).
// 사용: node scripts/sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 44100;
const outDir = new URL("../public/sfx/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const writeWav = (name, samples) => {
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

console.log("sfx written");
