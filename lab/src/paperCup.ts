import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/paperCup?scene';
import audio from '../audio/paperCup.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
