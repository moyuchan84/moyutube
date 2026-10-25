import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/rulerCatch?scene';
import audio from '../audio/rulerCatch.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
