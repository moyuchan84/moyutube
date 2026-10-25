import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/moonPhase?scene';
import audio from '../audio/moonPhase.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
