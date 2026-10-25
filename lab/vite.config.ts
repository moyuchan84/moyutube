import {defineConfig, type Plugin} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import motionCanvasModule from '@motion-canvas/vite-plugin';
import ffmpegModule from '@motion-canvas/ffmpeg';

// 두 패키지는 CJS 라서 ESM 설정에서 default 가 한 겹 더 감싸여 온다
const unwrap = (m: any) => (typeof m === 'function' ? m : m.default);
const motionCanvas = unwrap(motionCanvasModule);
const ffmpeg = unwrap(ffmpegModule);

// 장면이 끝까지 돌면 효과음 큐(시각 · 종류)를 POST 로 보낸다 → audio/<이름>.cues.json (scripts/bgm.mjs 가 읽음)
function cueSink(): Plugin {
  return {
    name: 'lab-cue-sink',
    configureServer(server) {
      server.middlewares.use('/__cues', (req, res) => {
        const name = (req.url ?? '').replace(/^\//, '').replace(/[^\w-]/g, '');
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
          if (name && body) {
            const file = path.resolve('audio', `${name}.cues.json`);
            const next = JSON.stringify(JSON.parse(body), null, 1);
            if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== next) {
              fs.mkdirSync('audio', {recursive: true});
              fs.writeFileSync(file, next);
            }
          }
          res.end('ok');
        });
      });
    },
  };
}

const projects = [
  'circleLength',
  'circleArea',
  'triAngles',
  'triArea',
  'triObtuse',
  'triShear',
  'mulSwap',
  'mulColumn',
  'mulSquare',
  'mulOdd',
  'mulRoot',
  'mulRoot2',
  'blindSpot',
  'afterImage',
  'motionAfter',
  'grayColor',
  'fracAdd',
  'fracDiv',
  'unitArea',
  'diffTangent',
  'magnetCut',
  'moonPhase',
  'seasons',
  'rulerCatch',
  'ringFinger',
  'shepard',
  'stroop',
  'shadowCheck',
  'domEye',
  'fingerSausage',
  'sideRead',
  'fadeDots',
  'mvtSpeed',
  'integArea',
  'ftcRoller',
  'logRule',
  'eCompound',
  'radianRope',
  'sinShadow',
  'geoSquare',
  'bayesTest',
  'dotShadow',
  'dominoProof',
];

export default defineConfig({
  server: {watch: {ignored: ['**/audio/*.cues.json', '**/output/**']}},
  plugins: [cueSink(), motionCanvas({project: projects.map(p => `./src/${p}.ts`)}), ffmpeg()],
});
