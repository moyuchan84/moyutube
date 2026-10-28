import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/arrowFins?scene';
import audio from '../audio/arrowFins.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
