import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/sideRead?scene';
import audio from '../audio/sideRead.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
