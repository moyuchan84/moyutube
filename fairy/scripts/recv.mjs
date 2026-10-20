// 크롬(AI Studio)에서 만든 음성을 로컬로 받는 임시 수신기: POST /<파일이름>.wav  → books/<slug>/voice/raw/
// 사용: node scripts/recv.mjs 01-real-hero
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
const dir = path.join(root, 'books', slug, 'voice', 'raw');
fs.mkdirSync(dir, { recursive: true });

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') return res.end();
    const name = path.basename(decodeURIComponent(req.url)).replace(/[^\w.-]/g, '');
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString();
      const b64 = text.replace(/^data:[^,]*,/, '');
      const buf = Buffer.from(b64, 'base64');
      fs.writeFileSync(path.join(dir, name), buf);
      console.log(name, buf.length);
      res.end('ok');
    });
  })
  .listen(8765, '127.0.0.1', () => console.log('listening 8765 →', dir));
