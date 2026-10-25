import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/stroop?scene';
import audio from '../audio/stroop.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
