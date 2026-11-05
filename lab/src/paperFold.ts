import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/paperFold?scene';
import audio from '../audio/paperFold.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
