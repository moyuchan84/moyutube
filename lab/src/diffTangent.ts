import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/diffTangent?scene';
import audio from '../audio/diffTangent.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
