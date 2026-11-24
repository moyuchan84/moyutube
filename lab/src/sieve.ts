import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/sieve?scene';
import audio from '../audio/sieve.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
