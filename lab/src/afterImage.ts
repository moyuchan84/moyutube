import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/afterImage?scene';
import audio from '../audio/afterImage.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
