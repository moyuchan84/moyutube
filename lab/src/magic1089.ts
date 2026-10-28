import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/magic1089?scene';
import audio from '../audio/magic1089.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
