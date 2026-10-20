// AI Studio 에서 받은 테이크(voice/raw/sNN-k.wav) → 장면별 음성 voice/sNN.wav + 전체 voice/all.wav + voice/timing.json
// 사용: npm run voice -- 01-real-hero
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const dir = path.join(root, 'books', slug);
const vdir = path.join(dir, 'voice');
const takes = JSON.parse(fs.readFileSync(path.join(vdir, 'takes.json'), 'utf8'));
const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'plan.json'), 'utf8'));

const RATE = 24000;
const HEAD = 0.5; // 장면 첫 소리 앞 숨
const GAP = 0.45; // 같은 장면 안 테이크 사이
const TAIL = 0.9; // 장면 끝 여운

// AI Studio 파일: 16비트 모노 24kHz. 안쪽 data 청크만 뽑는다
const pcm = (file) => {
  const b = fs.readFileSync(file);
  const at = b.indexOf('data');
  return b.subarray(at + 8, at + 8 + b.readUInt32LE(at + 4));
};
const silence = (sec) => Buffer.alloc(Math.round(sec * RATE) * 2);
const wav = (data) => {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
};
// 끝의 무음을 줄여 장면 길이를 일정하게 (앞뒤 40ms 이하만 남김)
const trim = (b) => {
  const s = (i) => Math.abs(b.readInt16LE(i));
  let a = 0, z = b.length - 2;
  while (a < z && s(a) < 200) a += 2;
  while (z > a && s(z) < 200) z -= 2;
  const pad = Math.round(0.04 * RATE) * 2;
  return b.subarray(Math.max(0, a - pad), Math.min(b.length, z + pad));
};

const timing = { scenes: {}, total: 0 };
const all = [];
let cursor = 0;
for (const s of story.scenes) {
  const mine = takes.filter((t) => t.scene === s.no);
  const min = plan.scenes[s.no]?.min ?? 0;
  let parts = [];
  let t = 0;
  const offsets = [];
  if (mine.length) {
    parts.push(silence(HEAD)); t += HEAD;
    mine.forEach((k, i) => {
      if (i) { parts.push(silence(GAP)); t += GAP; }
      const d = trim(pcm(path.join(vdir, 'raw', `${k.id}.wav`)));
      offsets.push({ take: k.id, at: +t.toFixed(2), sec: +(d.length / 2 / RATE).toFixed(2), voices: k.voices });
      parts.push(d); t += d.length / 2 / RATE;
    });
    parts.push(silence(TAIL)); t += TAIL;
  }
  if (t < min) { parts.push(silence(min - t)); t = min; } // 소리 없는 장면은 연출표 길이만큼 쉼
  if (!t) { parts.push(silence(4)); t = 4; }
  const buf = Buffer.concat(parts);
  const name = `s${String(s.no).padStart(2, '0')}`;
  if (mine.length) fs.writeFileSync(path.join(vdir, `${name}.wav`), wav(buf));
  timing.scenes[s.no] = { file: mine.length ? `${name}.wav` : null, start: +cursor.toFixed(2), sec: +t.toFixed(2), takes: offsets };
  cursor += t;
  all.push(buf);
}
timing.total = +cursor.toFixed(2);
fs.writeFileSync(path.join(vdir, 'all.wav'), wav(Buffer.concat(all)));
fs.writeFileSync(path.join(vdir, 'timing.json'), JSON.stringify(timing, null, 1));
console.log(`장면 ${story.scenes.length}개 · 전체 ${Math.floor(cursor / 60)}분 ${Math.round(cursor % 60)}초 → voice/all.wav, voice/timing.json`);
