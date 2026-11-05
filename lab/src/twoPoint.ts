import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/twoPoint?scene';
import audio from '../audio/twoPoint.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
