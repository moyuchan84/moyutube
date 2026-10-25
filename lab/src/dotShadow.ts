import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/dotShadow?scene';
import audio from '../audio/dotShadow.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
