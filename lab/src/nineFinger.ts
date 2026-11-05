import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/nineFinger?scene';
import audio from '../audio/nineFinger.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
