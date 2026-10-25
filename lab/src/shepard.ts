import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/shepard?scene';
import audio from '../audio/shepard.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
