import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/passCount?scene';
import audio from '../audio/passCount.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
