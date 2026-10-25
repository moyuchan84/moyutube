import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/fingerSausage?scene';
import audio from '../audio/fingerSausage.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
