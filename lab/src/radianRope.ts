import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/radianRope?scene';
import audio from '../audio/radianRope.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
