import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mobius?scene';
import audio from '../audio/mobius.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
