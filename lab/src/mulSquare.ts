import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulSquare?scene';
import audio from '../audio/mulSquare.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
