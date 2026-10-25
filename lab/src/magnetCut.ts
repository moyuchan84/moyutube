import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/magnetCut?scene';
import audio from '../audio/magnetCut.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
