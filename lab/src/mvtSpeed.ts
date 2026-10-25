import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mvtSpeed?scene';
import audio from '../audio/mvtSpeed.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
