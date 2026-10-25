import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/dominoProof?scene';
import audio from '../audio/dominoProof.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
