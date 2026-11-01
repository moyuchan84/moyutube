// 배경음악을 코드로 합성한다 (저작권 걱정 없는 소리). 곡마다 끝과 처음이 이어지는 루프다.
// 사용: node scripts/bgm.mjs            → 아직 없는 곡만 public/bgm/<이름>.wav 로 만든다
//       node scripts/bgm.mjs sultry     → 그 곡만 (있어도 다시 만든다)
//       node scripts/bgm.mjs --list     → 곡 목록
// 편에서 쓰려면 motion.json(또는 script.json) 맨 위 "bgm" 에 곡 이름을 적는다. 편마다 분위기에 맞게 고른다.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const RATE = 44100;
const outDir = new URL("../public/bgm/", import.meta.url);

// ── 공통 소리 ────────────────────────────────────────────

const NOTE = (name) => {
  const m = /^([A-G])([#b]?)(\d)$/.exec(name);
  const semis = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return 440 * 2 ** ((semis + (Number(m[3]) + 1) * 12 - 69) / 12);
};

// 줄 뜯는 소리 (Karplus-Strong)
const pluck = (freq, seconds, bright = 0.5) => {
  const n = Math.round(RATE / freq);
  const line = new Float32Array(n);
  for (let i = 0; i < n; i++) line[i] = Math.random() * 2 - 1;
  for (let pass = 0; pass < 2; pass++) for (let i = 1; i < n; i++) line[i] = line[i] * bright + line[i - 1] * (1 - bright);
  const out = new Float32Array(Math.round(seconds * RATE));
  for (let i = 0; i < out.length; i++) {
    const a = i % n;
    const b = (i + 1) % n;
    out[i] = line[a];
    line[a] = (line[a] + line[b]) * 0.4975;
  }
  const fade = Math.round(0.03 * RATE);
  for (let i = 0; i < fade; i++) out[out.length - 1 - i] *= i / fade;
  return out;
};

// 고음만 남긴 짧은 소음 (셰이커 · 브러시)
const shaker = (seconds, decay = 60) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let prev = 0;
  for (let i = 0; i < out.length; i++) {
    const noise = Math.random() * 2 - 1;
    out[i] = (noise - prev) * Math.exp((-i / RATE) * decay);
    prev = noise;
  }
  return out;
};

// 전자 피아노 (FM 두 겹: 따뜻한 몸통 + 처음에만 반짝이는 종소리)
const epiano = (freq, seconds) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const body = Math.sin(2 * Math.PI * freq * t + 1.6 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * freq * t));
    const bell = Math.sin(2 * Math.PI * freq * t + 0.9 * Math.exp(-t * 18) * Math.sin(2 * Math.PI * freq * 14 * t));
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 1.1) * Math.min(1, (seconds - t) / 0.08);
    out[i] = (body * 0.8 + bell * 0.25 * Math.exp(-t * 6)) * env;
  }
  return out;
};

// 미끄러져 들어가는 베이스 (반음 아래에서 쭉 올라붙는다)
const slideBass = (freq, seconds, slide = 0.09) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const f = t < slide ? freq * 2 ** ((-1 + t / slide) / 12) : freq;
    phase += (2 * Math.PI * f) / RATE;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 0.9) * Math.min(1, (seconds - t) / 0.05);
    out[i] = (Math.sin(phase) + 0.25 * Math.sin(2 * phase)) * env;
  }
  return out;
};

// 숨 섞인 색소폰 비슷한 소리 (톱니파 + 저역 필터 + 늦게 들어오는 비브라토 + 아래에서 꺾어 올리기)
const sax = (freq, seconds, bend = 0.12) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0;
  let lp1 = 0;
  let lp2 = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const vib = Math.max(0, t - 0.25) > 0 ? 0.006 * Math.min(1, (t - 0.25) / 0.3) * Math.sin(2 * Math.PI * 5.2 * t) : 0;
    const f = freq * (t < bend ? 2 ** ((-1.5 * (1 - t / bend)) / 12) : 1) * (1 + vib);
    phase = (phase + f / RATE) % 1;
    const saw = phase * 2 - 1 + (Math.random() * 2 - 1) * 0.08; // 숨소리
    const env = Math.min(1, t / 0.07) * (0.85 + 0.15 * Math.min(1, t / 0.4)) * Math.min(1, (seconds - t) / 0.12);
    const cut = 0.06 + 0.1 * env; // 세게 불수록 밝아진다
    lp1 += (saw - lp1) * cut;
    lp2 += (lp1 - lp2) * cut;
    out[i] = lp2 * env;
  }
  return out;
};

const kick = () => {
  const out = new Float32Array(Math.round(0.35 * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    phase += (2 * Math.PI * (45 + 60 * Math.exp(-t * 30))) / RATE;
    out[i] = Math.sin(phase) * Math.exp(-t * 9);
  }
  return out;
};

// 손가락 튕기기 · 림 (짧은 소음 + 딸깍)
const snap = () => {
  const out = shaker(0.12, 45);
  for (let i = 0; i < 200; i++) out[i] += Math.sin((2 * Math.PI * 1800 * i) / RATE) * Math.exp(-i / 40) * 0.6;
  return out;
};

// 8비트 게임기 소리: 네모파 (duty 로 음색) · 세모파 베이스 — 아주 살짝 비브라토, 끝은 짧게 닫힌다
const square = (freq, seconds, duty = 0.25, decay = 2.5) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    phase = (phase + (freq * (1 + 0.004 * Math.sin(2 * Math.PI * 6 * t) * Math.min(1, t / 0.2))) / RATE) % 1;
    const env = Math.min(1, t / 0.005) * (0.6 + 0.4 * Math.exp(-t * decay)) * Math.min(1, (seconds - t) / 0.02);
    out[i] = (phase < duty ? 1 : -1) * env;
  }
  return out;
};

const triangle = (freq, seconds) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    phase = (phase + freq / RATE) % 1;
    const env = Math.min(1, i / RATE / 0.005) * Math.min(1, (seconds - i / RATE) / 0.02);
    out[i] = (phase < 0.5 ? phase * 4 - 1 : 3 - phase * 4) * env;
  }
  return out;
};

// ── 지저분한 소리들 (grimy) ──
// 두 겹 저역 필터 톱니파 공용
const brass = (freq, seconds, { scoop = 0.05, scoopSemis = -1, glide = 0, cut = 0.03, blat = 0.3, vib = 0, detune = 0 } = {}) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0, lp1 = 0, lp2 = 0;
  const det = 2 ** (detune / 1200);
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const bend = t < scoop ? scoopSemis * (1 - t / scoop) : 0;
    const f = freq * det * 2 ** ((bend + glide * (t / seconds)) / 12) * (1 + vib * Math.sin(2 * Math.PI * 5.5 * t));
    phase = (phase + f / RATE) % 1;
    const env = Math.min(1, t / 0.02) * Math.min(1, (seconds - t) / 0.06);
    const src = phase * 2 - 1 + (Math.random() * 2 - 1) * blat * Math.exp(-t * 40);
    const c = cut * (1 + 1.5 * Math.exp(-t * 12));
    lp1 += (src - lp1) * c;
    lp2 += (lp1 - lp2) * c;
    out[i] = lp2 * env;
  }
  return out;
};
// 음 나간 튜바: 반음 아래서 꾸물 올라붙고, 처음에 부왁 하는 숨
const tuba = (freq, seconds) => brass(freq, seconds, { scoop: 0.06, cut: 0.025, blat: 0.5, detune: -14 + Math.random() * 10 });
// 트롬본 뿌왑: 길게 아래로 미끄러진다
const bwamp = (freq, seconds) => brass(freq, seconds, { scoop: 0.02, glide: -5, cut: 0.05, blat: 0.4, vib: 0.012 });
// 조율 안 된 술집 피아노: 줄 두 개가 서로 어긋난다
const honky = (freq, seconds) => {
  const a = pluck(freq * 1.008, seconds, 0.62);
  const b = pluck(freq * 0.993, seconds, 0.62);
  for (let i = 0; i < a.length; i++) a[i] = (a[i] + b[i]) * 0.5;
  return a;
};
// 축축한 카주: 좁은 네모파 + 붕붕 떨리는 잡음, 아래서 쭉 끌어올리고 일찍 떨린다
const kazoo = (freq, seconds) => {
  const out = new Float32Array(Math.round(seconds * RATE));
  let phase = 0, lp = 0;
  const det = 2 ** ((Math.random() * 30 - 10) / 1200);
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const bend = t < 0.08 ? -2 * (1 - t / 0.08) : 0;
    const f = freq * det * 2 ** (bend / 12) * (1 + 0.014 * Math.sin(2 * Math.PI * 5.8 * t) * Math.min(1, t / 0.1));
    phase = (phase + f / RATE) % 1;
    const pulse = phase < 0.16 ? 1 : -0.19;
    const buzz = (Math.random() * 2 - 1) * (phase < 0.3 ? 0.5 : 0.1);
    lp += (pulse + buzz - lp) * 0.28;
    const env = Math.min(1, t / 0.03) * Math.min(1, (seconds - t) / 0.05);
    out[i] = lp * env;
  }
  return out;
};
// 쓰레기통 뚜껑 스네어: 낮게 걸린 소음 + 덜그럭
const trashLid = () => {
  const out = new Float32Array(Math.round(0.22 * RATE));
  let lp = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    lp += ((Math.random() * 2 - 1) - lp) * 0.45;
    const clank = [410, 690, 1130].reduce((a, f) => a + Math.sin(2 * Math.PI * f * t), 0) * 0.12;
    out[i] = (lp + clank) * Math.exp(-t * 18);
  }
  return out;
};

// ── 곡 ──────────────────────────────────────────────────
// 곡마다 { desc, bpm, bars, render(add, at) } — at(마디, 박) 은 그 박의 샘플 위치

const SONGS = {
  cheerful: {
    desc: "밝은 우쿨렐레 스트럼 · 베이스 · 셰이커 (모답맨 · 내모남불 기본)",
    bpm: 104,
    bars: 8,
    swing: 0.12,
    render(add, at) {
      const N = NOTE;
      const CHORD = {
        C: { strings: ["G4", "C4", "E4", "C5"], bass: ["C3", "G2"] },
        Am: { strings: ["A4", "C4", "E4", "A4"], bass: ["A2", "E3"] },
        F: { strings: ["A4", "C4", "F4", "A4"], bass: ["F2", "C3"] },
        G: { strings: ["G4", "D4", "G4", "B4"], bass: ["G2", "D4"] },
      };
      const BARS_OF = ["C", "C", "Am", "Am", "F", "F", "G", "G"];
      // 한 마디의 스트럼: [박, 내려치기?, 세기]
      const STRUM = [[0, true, 1], [1, true, 0.7], [1.5, false, 0.5], [2.5, false, 0.6], [3, true, 0.8], [3.5, false, 0.5]];
      // 두 마디마다 한 번 얹는 짧은 가락: [마디, 박, 음]
      const TUNE = [[1, 2, "E5"], [1, 3, "G5"], [3, 2, "E5"], [3, 3, "C5"], [5, 2, "C5"], [5, 3, "A4"], [7, 2, "D5"], [7, 3, "G5"]];
      BARS_OF.forEach((name, bar) => {
        const chord = CHORD[name];
        for (const [beat, down, vel] of STRUM) {
          const strings = down ? chord.strings : [...chord.strings].reverse();
          strings.forEach((s, i) => add(at(bar, beat) + Math.round(i * 0.014 * RATE), pluck(N(s), 0.9, 0.55), 0.22 * vel));
        }
        add(at(bar, 0), pluck(N(chord.bass[0]), 1.0, 0.25), 0.5);
        add(at(bar, 2), pluck(N(chord.bass[1]) > 200 ? N(chord.bass[1]) / 2 : N(chord.bass[1]), 1.0, 0.25), 0.4);
        for (let eighth = 0; eighth < 8; eighth++) add(at(bar, eighth / 2), shaker(0.08), eighth % 2 ? 0.1 : 0.05);
      });
      for (const [bar, beat, note] of TUNE) add(at(bar, beat), pluck(N(note), 0.7, 0.7), 0.2);
    },
  },

  sultry: {
    desc: "끈적한 슬로 잼 — 전자 피아노 · 미끄러지는 베이스 · 핑거스냅 · 느끼한 색소폰 (모덕후 뽀뽀 편 같은 민망 · 로맨스 개그)",
    bpm: 74,
    bars: 8,
    swing: 0.18, // 엇박을 많이 늦춰 늘어지게
    render(add, at, beat) {
      const N = NOTE;
      // ii–V–I–VI 를 두 바퀴: Dm9 | G13 | Cmaj9 | A7(b9) …, 마지막은 E7 로 처음에 다시 붙는다
      const CHORDS = [
        { root: "D2", notes: ["F3", "A3", "C4", "E4"] },
        { root: "G2", notes: ["F3", "B3", "E4", "A4"] },
        { root: "C2", notes: ["E3", "G3", "B3", "D4"] },
        { root: "A1", notes: ["G3", "C#4", "E4", "Bb4"] },
        { root: "D2", notes: ["F3", "A3", "C4", "E4"] },
        { root: "G2", notes: ["F3", "B3", "E4", "A4"] },
        { root: "C2", notes: ["E3", "G3", "B3", "D4"] },
        { root: "E2", notes: ["D3", "G#3", "B3", "F4"] },
      ];
      CHORDS.forEach((chord, bar) => {
        // 피아노: 1박에 길게, 2박 엇박에 짧게 한 번 더 (아래서 위로 살짝 흘려 친다)
        chord.notes.forEach((n, i) => add(at(bar, 0) + Math.round(i * 0.018 * RATE), epiano(N(n), beat * 2.4), 0.16));
        chord.notes.forEach((n, i) => add(at(bar, 2.5) + Math.round(i * 0.012 * RATE), epiano(N(n), beat * 1.3), 0.1));
        // 베이스: 1박 근음, 2박 엇박 옥타브 위, 4박 반음 접근
        add(at(bar, 0), slideBass(N(chord.root), beat * 1.6), 0.55);
        add(at(bar, 1.5), slideBass(N(chord.root) * 2, beat * 0.5, 0.04), 0.25);
        const next = CHORDS[(bar + 1) % CHORDS.length].root;
        add(at(bar, 3.5), slideBass(N(next) * 2 ** (-1 / 12), beat * 0.45, 0.02), 0.3);
        // 드럼: 쿵 — (엇박 쿵) — 딱, 브러시는 셋잇단
        add(at(bar, 0), kick(), 0.5);
        add(at(bar, 2.5), kick(), 0.3);
        add(at(bar, 1), snap(), 0.35);
        add(at(bar, 3), snap(), 0.35);
        for (let k = 0; k < 12; k++) add(Math.round(at(bar, 0) + (k / 3) * beat * RATE), shaker(0.1, 30), k % 3 ? 0.04 : 0.07);
      });
      // 느끼한 가락 (새로 지은 것): 두 마디 묻고 두 마디 쉬고. [마디, 박, 음, 길이(박)]
      const LICK = [
        [0, 1.5, "A4", 0.5], [0, 2, "C5", 0.5], [0, 2.5, "D5", 1.5],
        [1, 0.5, "F5", 0.5], [1, 1, "E5", 0.5], [1, 1.5, "D5", 0.5], [1, 2, "B4", 1.8],
        [4, 1.5, "A4", 0.5], [4, 2, "C5", 0.5], [4, 2.5, "E5", 1.2],
        [5, 0, "G5", 0.5], [5, 0.5, "F5", 0.5], [5, 1, "E5", 0.5], [5, 1.5, "C5", 0.5], [5, 2, "D5", 2.2],
        [7, 2, "B4", 0.5], [7, 2.5, "G#4", 1.4],
      ];
      for (const [bar, b, n, len] of LICK) add(at(bar, b), sax(N(n), len * beat + 0.15), 0.2);
    },
  },

  flutter: {
    desc: "설레는 8비트 미연시 풍 — 네모파 가락 · 반짝이는 아르페지오 · 세모파 베이스 · 잡음 하이햇 (모덕후 손잡기 편 같은 두근두근 덕후 개그)",
    bpm: 96,
    bars: 8,
    swing: 0,
    render(add, at, beat) {
      const N = NOTE;
      // F — Am — B♭ — C 를 두 바퀴, 마지막은 C7 로 처음에 다시 붙는다
      const CHORDS = [
        { root: "F2", arp: ["F4", "A4", "C5", "A4"] },
        { root: "A2", arp: ["E4", "A4", "C5", "A4"] },
        { root: "Bb2", arp: ["F4", "Bb4", "D5", "Bb4"] },
        { root: "C3", arp: ["G4", "C5", "E5", "C5"] },
        { root: "F2", arp: ["F4", "A4", "C5", "A4"] },
        { root: "D3", arp: ["F4", "A4", "D5", "A4"] },
        { root: "Bb2", arp: ["F4", "Bb4", "D5", "Bb4"] },
        { root: "C3", arp: ["E4", "G4", "Bb4", "C5"] },
      ];
      CHORDS.forEach((chord, bar) => {
        // 16분음표 아르페지오 (얇은 네모파, 작게)
        for (let k = 0; k < 16; k++) add(at(bar, k / 4), square(N(chord.arp[k % 4]), beat / 4 - 0.01, 0.125, 8), 0.05);
        // 베이스: 근음 · 옥타브 통통
        for (let k = 0; k < 4; k++) add(at(bar, k), triangle(N(chord.root) * (k % 2 ? 2 : 1), beat * 0.45), 0.4);
        // 드럼: 쿵(세모파 피치 다운 대신 kick) · 잡음 하이햇 8분
        add(at(bar, 0), kick(), 0.45);
        add(at(bar, 2), kick(), 0.35);
        for (let k = 0; k < 8; k++) add(at(bar, k / 2), shaker(0.05, 90), k % 2 ? 0.08 : 0.04);
        add(at(bar, 1), shaker(0.15, 25), 0.12);
        add(at(bar, 3), shaker(0.15, 25), 0.12);
      });
      // 두근두근 가락 (새로 지은 것). [마디, 박, 음, 길이(박)]
      const TUNE = [
        [0, 0, "C5", 0.5], [0, 0.5, "F5", 0.5], [0, 1, "A5", 1], [0, 2.5, "G5", 0.5], [0, 3, "F5", 1],
        [1, 0, "E5", 0.5], [1, 0.5, "F5", 0.5], [1, 1, "G5", 1.5], [1, 3, "E5", 1],
        [2, 0, "D5", 0.5], [2, 0.5, "F5", 0.5], [2, 1, "Bb5", 1], [2, 2.5, "A5", 0.5], [2, 3, "G5", 1],
        [3, 0, "E5", 0.5], [3, 0.5, "G5", 0.5], [3, 1, "C6", 2.5],
        [4, 0, "C5", 0.5], [4, 0.5, "F5", 0.5], [4, 1, "A5", 1], [4, 2.5, "C6", 0.5], [4, 3, "A5", 1],
        [5, 0, "D6", 0.5], [5, 0.5, "C6", 0.5], [5, 1, "A5", 1.5], [5, 3, "F5", 1],
        [6, 0, "D5", 0.5], [6, 0.5, "F5", 0.5], [6, 1, "Bb5", 1], [6, 2.5, "A5", 0.5], [6, 3, "G5", 0.5], [6, 3.5, "F5", 0.5],
        [7, 0, "G5", 1.5], [7, 2, "E5", 0.5], [7, 2.5, "G5", 0.5], [7, 3, "Bb5", 1],
      ];
      for (const [bar, b, n, len] of TUNE) add(at(bar, b), square(N(n), len * beat - 0.03, 0.5, 2), 0.09);
    },
  },

  grimy: {
    desc: "지저분하고 꾸리꾸리한 붕짝 — 음 나간 튜바 · 조율 안 된 술집 피아노 · 축축한 카주 가락 · 쓰레기통 뚜껑 스네어 · 트롬본 뿌왑 (모덕후 방귀 3부작)",
    bpm: 88,
    bars: 8,
    swing: 0.2, // 술 취한 듯 늘어진 엇박
    render(add, at, beat) {
      const N = NOTE;
      // Dm | Dm(베이스 C) | B♭7 | A7 | Dm | G7 | E♭7 | A7 — 반음씩 미끄러지는 지저분한 진행
      const CHORDS = [
        { bass: ["D2", "A1"], pah: ["F3", "A3", "D4"] },
        { bass: ["C2", "A1"], pah: ["F3", "A3", "D4"] },
        { bass: ["Bb1", "F2"], pah: ["D3", "Ab3", "D4"] },
        { bass: ["A1", "E2"], pah: ["C#3", "G3", "C#4"] },
        { bass: ["D2", "A1"], pah: ["F3", "A3", "D4"] },
        { bass: ["G1", "D2"], pah: ["F3", "B3", "D4"] },
        { bass: ["Eb2", "Bb1"], pah: ["G3", "Db4", "Eb4"] },
        { bass: ["A1", "E2"], pah: ["C#3", "G3", "C#4"] },
      ];
      CHORDS.forEach((chord, bar) => {
        // 붕(튜바) — 짝(피아노) — 붕 — 짝
        add(at(bar, 0), tuba(N(chord.bass[0]), beat * 0.9), 0.5);
        add(at(bar, 2), tuba(N(chord.bass[1]), beat * 0.9), 0.45);
        for (const b of [1, 3]) chord.pah.forEach((n, i) => add(at(bar, b) + Math.round(i * 0.01 * RATE), honky(N(n), beat * 0.6), 0.13));
        if (bar % 2) add(at(bar, 3.5), tuba(N(chord.bass[0]) * 2 ** (1 / 12), beat * 0.4), 0.25); // 반음 위로 꾸물
        // 드럼: 쿵은 둔하게, 뚜껑 스네어는 2 · 4박, 가끔 엇박 덜그럭
        add(at(bar, 0), kick(), 0.4);
        add(at(bar, 2), kick(), 0.3);
        add(at(bar, 1), trashLid(), 0.22);
        add(at(bar, 3), trashLid(), 0.22);
        if (bar % 4 === 3) add(at(bar, 3.5), trashLid(), 0.12);
        for (let k = 0; k < 8; k++) add(at(bar, k / 2), shaker(0.06, 50), k % 2 ? 0.05 : 0.025);
      });
      // 꾸물거리는 카주 가락 (새로 지은 것). [마디, 박, 음, 길이(박)]
      const TUNE = [
        [0, 0.5, "A4", 0.5], [0, 1, "D5", 0.5], [0, 1.5, "F5", 0.5], [0, 2, "E5", 1.2], [0, 3.5, "D5", 0.5],
        [1, 0, "C#5", 1.4], [1, 2, "A4", 0.5], [1, 2.5, "Bb4", 0.5], [1, 3, "A4", 0.9],
        [2, 0.5, "D5", 0.5], [2, 1, "F5", 0.5], [2, 1.5, "Ab5", 1.2], [2, 3, "G5", 0.5], [2, 3.5, "F5", 0.5],
        [3, 0, "E5", 0.9], [3, 1, "C#5", 0.5], [3, 1.5, "E5", 0.5], [3, 2, "G5", 1.6],
        [4, 0.5, "F5", 0.5], [4, 1, "E5", 0.5], [4, 1.5, "D5", 0.5], [4, 2, "A4", 1.5],
        [5, 0, "B4", 0.5], [5, 0.5, "D5", 0.5], [5, 1, "F5", 1.2], [5, 2.5, "E5", 0.5], [5, 3, "D5", 0.9],
        [6, 0, "G5", 0.9], [6, 1, "F5", 0.5], [6, 1.5, "Eb5", 0.5], [6, 2, "Db5", 1.6],
        [7, 0, "C#5", 0.5], [7, 0.5, "E5", 0.5], [7, 1, "A5", 0.6],
      ];
      for (const [bar, b, n, len] of TUNE) add(at(bar, b), kazoo(N(n), len * beat), 0.12);
      // 끝에 트롬본 뿌왑 — 처음으로 다시 붙는다
      add(at(7, 2), bwamp(N("A3"), beat * 1.9), 0.35);
    },
  },
};

// ── 만들기 ──────────────────────────────────────────────

const toWav = (mix, gain) => {
  const data = Buffer.alloc(mix.length * 2);
  for (let i = 0; i < mix.length; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mix[i] * gain)) * 32767), i * 2);
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
  return Buffer.concat([header, data]);
};

// 곡마다 체감 크기를 맞춘다: 평균 세기(RMS)를 같게, 단 최고점은 0.95 를 넘지 않게
const TARGET_RMS = 0.075; // 지금 cheerful.wav 와 같은 크기

const build = (name) => {
  const song = SONGS[name];
  const beat = 60 / song.bpm;
  const length = Math.round(song.bars * 4 * beat * RATE);
  const mix = new Float32Array(length);
  // 루프라서 끝을 넘어간 여운은 처음으로 돌려 더한다
  const add = (start, samples, gain) => {
    for (let i = 0; i < samples.length; i++) mix[(start + i) % length] += samples[i] * gain;
  };
  const at = (bar, b) => Math.round((bar * 4 + (b % 1 ? b + song.swing : b)) * beat * RATE);
  song.render(add, at, beat);
  const peak = mix.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const rms = Math.sqrt(mix.reduce((s, v) => s + v * v, 0) / length);
  const gain = Math.min(TARGET_RMS / rms, 0.95 / peak);
  writeFileSync(new URL(`${name}.wav`, outDir), toWav(mix, gain));
  console.log(`public/bgm/${name}.wav (${(length / RATE).toFixed(1)}초 루프) — ${song.desc}`);
};

const args = process.argv.slice(2);
if (args.includes("--list")) {
  for (const [name, song] of Object.entries(SONGS)) console.log(`${name.padEnd(10)} ${song.bpm}bpm  ${song.desc}`);
} else {
  mkdirSync(outDir, { recursive: true });
  const unknown = args.filter((a) => !SONGS[a]);
  if (unknown.length) {
    console.error(`모르는 곡: ${unknown.join(", ")} (목록: ${Object.keys(SONGS).join(", ")})`);
    process.exit(1);
  }
  const names = args.length ? args : Object.keys(SONGS).filter((n) => !existsSync(new URL(`${n}.wav`, outDir)));
  if (!names.length) console.log("만들 곡 없음 (모두 있음). 다시 만들려면 곡 이름을 적는다.");
  names.forEach(build);
}
