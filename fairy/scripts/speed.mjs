// 빠른 편집용 목소리: voice/raw/*.wav 의 긴 쉼을 줄이고 빠르게(음높이 그대로) → voice/fast/*.wav
// 설정은 books/<slug>/edit.json (tempo · maxPause). 원본 raw 는 그대로 둔다.
// 사용: npm run speed -- 01-real-hero   (그다음 npm run voice -- 01-real-hero)
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const vdir = path.join(root, 'books', slug, 'voice');
const edit = JSON.parse(fs.readFileSync(path.join(root, 'books', slug, 'edit.json'), 'utf8'));
const RATE = 24000;
const bin = path.join(root, 'video', 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');

const pcm = (file) => {
  const b = fs.readFileSync(file);
  const at = b.indexOf('data');
  return b.subarray(at + 8, at + 8 + b.readUInt32LE(at + 4));
};
const wav = (data) => {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
};
// maxPause(초)보다 긴 무음은 가운데를 잘라 maxPause 로 줄인다 (10ms 창)
const squeeze = (b, maxPause) => {
  const win = Math.round(RATE * 0.01) * 2, keep = Math.round((maxPause * RATE) / 2) * 2;
  const out = [];
  let i = 0, run = -1;
  const flush = (end) => {
    if (end - run > keep * 2) out.push(b.subarray(run, run + keep), b.subarray(end - keep, end));
    else out.push(b.subarray(run, end));
  };
  for (; i + win <= b.length; i += win) {
    let m = 0;
    for (let j = 0; j < win; j += 2) m = Math.max(m, Math.abs(b.readInt16LE(i + j)));
    if (m < 400) { if (run < 0) run = i; continue; }
    if (run >= 0) { flush(i); run = -1; }
    out.push(b.subarray(i, i + win));
  }
  if (run >= 0) flush(i);
  out.push(b.subarray(i));
  return Buffer.concat(out);
};

const dst = path.join(vdir, 'fast');
fs.mkdirSync(dst, { recursive: true });
const tmp = path.join(dst, '_squeezed.wav');
let before = 0, after = 0;
for (const f of fs.readdirSync(path.join(vdir, 'raw')).filter((x) => x.endsWith('.wav'))) {
  const src = pcm(path.join(vdir, 'raw', f));
  const sq = squeeze(src, edit.maxPause ?? 0.3);
  fs.writeFileSync(tmp, wav(sq));
  execFileSync(bin, ['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-filter:a', `atempo=${edit.tempo ?? 1.2}`, '-ar', RATE, '-ac', 1, '-c:a', 'pcm_s16le', path.join(dst, f)], { shell: true, stdio: 'inherit', cwd: path.join(root, 'video') });
  before += src.length; after += pcm(path.join(dst, f)).length;
}
fs.rmSync(tmp);
console.log(`voice/fast — ${(before / 2 / RATE).toFixed(1)}초 → ${(after / 2 / RATE).toFixed(1)}초 (x${edit.tempo ?? 1.2}, 쉼 최대 ${edit.maxPause ?? 0.3}초)`);
