import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/elevenMul?scene';
import audio from '../audio/elevenMul.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
