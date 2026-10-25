import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/blindSpot?scene';
import audio from '../audio/blindSpot.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
