import vertexSource from './shader.vert';
import fragmentSource from './shader.frag';

import { vec2 } from '../../src';
import GL from '../../src/graphics/gl/gl';

const gl = new GL(vertexSource, fragmentSource).fullscreen();
const points = gl.Points('position', [vec2(0, 0), vec2(0.5, 0.5)]);

gl.animate(() => {
  points.render();
});
