import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/pepperSoap?scene';
import audio from '../audio/pepperSoap.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
