import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/magicBoard?scene';
import audio from '../audio/magicBoard.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
