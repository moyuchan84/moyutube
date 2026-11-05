import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/crossFinger?scene';
import audio from '../audio/crossFinger.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
