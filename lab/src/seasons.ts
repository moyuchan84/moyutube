import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/seasons?scene';
import audio from '../audio/seasons.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
