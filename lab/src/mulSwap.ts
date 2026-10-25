import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulSwap?scene';
import audio from '../audio/mulSwap.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
