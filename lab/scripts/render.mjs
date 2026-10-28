// 별도 Chrome(headless) 으로 Motion Canvas 편집기를 열고 결과 파일이 생길 때까지 기다린다 (vite 가 :9000 에 떠 있어야 한다).
//   node scripts/render.mjs <이름> cues   ← 큐(audio/<이름>.cues.json)만 만들기
//   node scripts/render.mjs <이름> render ← output/<이름>.mp4 렌더
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const [name, mode] = process.argv.slice(2);
const LAB = 'D:/youtube/lab';
const SP = path.join(os.tmpdir(), 'lab-chrome');
const port = 9333;
const url = `http://localhost:9000/src/${name}${mode === 'render' ? '?render' : ''}`;
const target = mode === 'render' ? path.join(LAB, 'output', `${name}.mp4`) : path.join(LAB, 'audio', `${name}.cues.json`);
const before = fs.existsSync(target) ? fs.statSync(target).mtimeMs : 0;

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--user-data-dir=${SP}/chrome-${name}`, `--remote-debugging-port=${port}`,
  '--mute-audio', '--autoplay-policy=no-user-gesture-required', '--window-size=1600,1000',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', url,
], {stdio: 'ignore'});

const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(500);
  try {
    const list = await (await fetch(`http://localhost:${port}/json`)).json();
    const page = list.find(t => t.type === 'page');
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
}
ws.onopen = () => {
  ws.send(JSON.stringify({id: 1, method: 'Runtime.enable'}));
  ws.send(JSON.stringify({id: 2, method: 'Log.enable'}));
};
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') console.log('EXC', m.params.exceptionDetails.exception?.description?.slice(0, 400) ?? m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type))
    console.log(m.params.type, m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 400));
};

const limit = mode === 'render' ? 15 * 60 : 180;
const t0 = Date.now();
let done = false;
while ((Date.now() - t0) / 1000 < limit) {
  await sleep(2000);
  if (fs.existsSync(target) && fs.statSync(target).mtimeMs > before) {
    if (mode !== 'render') { done = true; break; }
    // mp4 는 ffmpeg 가 끝까지 써서(moov) 읽힐 때까지 기다린다
    const r = spawnSync(`${LAB}/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe`, ['-i', target], {encoding: 'utf8'});
    if (/Duration: \d/.test(r.stderr)) { await sleep(3000); done = true; break; }
  }
}
console.log(done ? `OK ${target} ${Math.round((Date.now() - t0) / 1000)}s` : 'TIMEOUT');
chrome.kill();
process.exit(done ? 0 : 1);
