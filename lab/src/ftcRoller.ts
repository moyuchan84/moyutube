import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/ftcRoller?scene';
import audio from '../audio/ftcRoller.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
