import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/oneStroke?scene';
import audio from '../audio/oneStroke.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
