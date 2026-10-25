import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/motionAfter?scene';
import audio from '../audio/motionAfter.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
