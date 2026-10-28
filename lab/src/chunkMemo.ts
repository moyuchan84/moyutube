import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/chunkMemo?scene';
import audio from '../audio/chunkMemo.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
