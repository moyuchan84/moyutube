import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/logRule?scene';
import audio from '../audio/logRule.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
