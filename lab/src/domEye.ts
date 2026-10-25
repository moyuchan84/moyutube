import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/domEye?scene';
import audio from '../audio/domEye.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
