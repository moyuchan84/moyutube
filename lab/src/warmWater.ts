import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/warmWater?scene';
import audio from '../audio/warmWater.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
