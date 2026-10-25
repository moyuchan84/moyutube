import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulRoot2?scene';
import audio from '../audio/mulRoot2.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
