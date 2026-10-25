import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/eCompound?scene';
import audio from '../audio/eCompound.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
