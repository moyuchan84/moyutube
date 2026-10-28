import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/slowChange?scene';
import audio from '../audio/slowChange.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
