import './fonts';
import {makeProject} from '@motion-canvas/core';
import scene from './scenes/ringFinger?scene';
import audio from '../audio/ringFinger.wav';

export default makeProject({
  scenes: [scene],
  audio,
});
