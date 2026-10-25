import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/fadeDots?scene';
import audio from '../audio/fadeDots.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
