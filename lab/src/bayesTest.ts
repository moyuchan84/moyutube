import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/bayesTest?scene';
import audio from '../audio/bayesTest.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
