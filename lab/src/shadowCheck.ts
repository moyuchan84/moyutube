import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/shadowCheck?scene';
import audio from '../audio/shadowCheck.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
