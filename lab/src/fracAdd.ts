import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/fracAdd?scene';
import audio from '../audio/fracAdd.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
