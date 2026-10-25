import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/fracDiv?scene';
import audio from '../audio/fracDiv.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
