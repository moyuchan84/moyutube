import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulOdd?scene';
import audio from '../audio/mulOdd.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
