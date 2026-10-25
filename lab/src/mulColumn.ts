import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulColumn?scene';
import audio from '../audio/mulColumn.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
