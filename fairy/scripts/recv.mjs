// 크롬(AI Studio)에서 만든 음성을 로컬로 받는 임시 수신기: POST /<파일이름>.wav  → books/<slug>/voice/raw/
// 사용: node scripts/recv.mjs 01-real-hero   |   node scripts/recv.mjs 02-maum-cafe art
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2] || '01-real-hero';
// 두 번째 인자: art 면 그림(books/<slug>/art/), 없으면 음성(voice/raw/)
const dir = process.argv[3] === 'art' ? path.join(root, 'books', slug, 'art') : path.join(root, 'books', slug, 'voice', 'raw');
fs.mkdirSync(dir, { recursive: true });

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') return res.end();
    // GET /ref/<파일> : 크롬 페이지가 첨부용 참고 그림을 가져간다 (fairy/art/ 또는 이 책의 art/)
    // GET /c/<이름>/<번호>/<전체>?d=<base64url 조각> : POST 가 막힌 페이지(CSP)가 img 요청으로 조각을 보낸다
    const cm = req.method === 'GET' && req.url.match(/^\/c\/([\w.-]+)\/(\d+)\/(\d+)\?d=(.*)$/);
    if (cm) {
      const [, nm, i, n, d] = cm;
      (globalThis.__parts ??= {})[nm] ??= {};
      globalThis.__parts[nm][+i] = d;
      const got = Object.keys(globalThis.__parts[nm]).length;
      if (got === +n) {
        const b64 = Array.from({ length: +n }, (_, k) => globalThis.__parts[nm][k]).join('').replace(/-/g, '+').replace(/_/g, '/');
        fs.writeFileSync(path.join(dir, nm), Buffer.from(b64, 'base64'));
        console.log(nm, 'saved', +n, 'parts');
        delete globalThis.__parts[nm];
      }
      res.setHeader('Content-Type', 'image/gif');
      return res.end(Buffer.from('R0lGODlhAQABAAAAACw=', 'base64'));
    }
    if (req.method === 'GET') {
      const f = path.basename(decodeURIComponent(req.url));
      const p = [path.join(root, 'art', f), path.join(dir, f)].find((x) => fs.existsSync(x));
      if (!p) { res.statusCode = 404; return res.end('no'); }
      res.setHeader('Content-Type', f.endsWith('.png') ? 'image/png' : 'image/jpeg');
      return res.end(fs.readFileSync(p));
    }
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
