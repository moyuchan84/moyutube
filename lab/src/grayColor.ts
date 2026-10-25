import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/grayColor?scene';
import audio from '../audio/grayColor.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
