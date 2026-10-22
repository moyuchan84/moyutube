import {defineConfig} from 'vite';
import motionCanvasModule from '@motion-canvas/vite-plugin';
import ffmpegModule from '@motion-canvas/ffmpeg';

// 두 패키지는 CJS 라서 ESM 설정에서 default 가 한 겹 더 감싸여 온다
const unwrap = (m: any) => (typeof m === 'function' ? m : m.default);
const motionCanvas = unwrap(motionCanvasModule);
const ffmpeg = unwrap(ffmpegModule);

export default defineConfig({
  plugins: [motionCanvas({project: ['./src/circleLength.ts', './src/circleArea.ts', './src/triAngles.ts', './src/triArea.ts', './src/triObtuse.ts', './src/triShear.ts']}), ffmpeg()],
});
