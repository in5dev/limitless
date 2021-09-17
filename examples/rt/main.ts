import GL from '../../src/gfx/gl';
import fragmentSource from './shader.frag?raw';

const gl = await GL.fullscreen(fragmentSource);
gl.uniform('resolution', 'ivec2', [
  gl.gl.drawingBufferWidth,
  gl.gl.drawingBufferHeight
]);
gl.uniform('spheres', 'struct[]', [
  {
    center: { type: 'vec3', data: [1, 0, -5] },
    radius: { type: 'float', data: 1 }
  },
  {
    center: { type: 'vec3', data: [-1, 0, -5] },
    radius: { type: 'float', data: 1 }
  }
]);
gl.uniform('maxReflections', 'int', 4);

function render() {
  gl.uniform('light', 'vec3', [
    1 + 3 * Math.sin(performance.now() / 500),
    7,
    3
  ]);
  gl.render();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
