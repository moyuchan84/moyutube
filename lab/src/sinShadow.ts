import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/sinShadow?scene';
import audio from '../audio/sinShadow.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
