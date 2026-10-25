import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/geoSquare?scene';
import audio from '../audio/geoSquare.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
