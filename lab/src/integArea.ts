import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/integArea?scene';
import audio from '../audio/integArea.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
