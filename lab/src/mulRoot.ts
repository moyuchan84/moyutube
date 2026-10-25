import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/mulRoot?scene';
import audio from '../audio/mulRoot.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
