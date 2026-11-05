import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/arrowFlip?scene';
import audio from '../audio/arrowFlip.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
