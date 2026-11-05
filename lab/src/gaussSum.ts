import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/gaussSum?scene';
import audio from '../audio/gaussSum.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
