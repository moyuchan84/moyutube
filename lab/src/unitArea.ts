import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/unitArea?scene';
import audio from '../audio/unitArea.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
