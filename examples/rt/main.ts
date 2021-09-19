import GL from '../../src/gfx/gl';
import fragmentSource from './shader.frag?raw';

const gl = await GL.fullscreen(fragmentSource);
function setResolution() {
  gl.uniform('resolution', 'vec2', [
    gl.gl.drawingBufferWidth,
    gl.gl.drawingBufferHeight
  ]);
}
setResolution();
window.addEventListener('resize', setResolution);

gl.uniform('maxReflections', 'int', 4);
gl.uniform('ambientLight', 'struct', {
  color: { type: 'vec3', data: [1, 1, 1] },
  intensity: { type: 'float', data: 0.2 }
});
gl.uniform('pointLight', 'struct', {
  position: {
    type: 'vec3',
    data: [3, 7, 0]
  },
  color: {
    type: 'vec3',
    data: [1, 1, 1]
  },
  intensity: {
    type: 'float',
    data: 0.7
  }
});
gl.uniform('planes', 'struct[]', [
  {
    position: { type: 'vec3', data: [0, -1, 0] },
    normal: { type: 'vec3', data: [0, 1, 0] },
    material: {
      type: 'struct',
      data: {
        color: { type: 'vec3', data: [1, 1, 1] },
        shininess: { type: 'float', data: 16 },
        reflectivity: { type: 'float', data: 0.5 }
      }
    }
  }
]);
gl.uniform('spheres', 'struct[]', [
  {
    radius: { type: 'float', data: 1 },
    material: {
      type: 'struct',
      data: {
        color: { type: 'vec3', data: [1, 0, 0] },
        shininess: { type: 'float', data: 64 },
        reflectivity: { type: 'float', data: 0.9 }
      }
    }
  },
  {
    radius: { type: 'float', data: 1 },
    material: {
      type: 'struct',
      data: {
        color: { type: 'vec3', data: [0, 1, 0] },
        shininess: { type: 'float', data: 64 },
        reflectivity: { type: 'float', data: 0.7 }
      }
    }
  }
]);

function render() {
  gl.uniform('spheres', 'struct[]', [
    {
      center: {
        type: 'vec3',
        data: [1.1, 2 + Math.sin(performance.now() / 1000), -8]
      }
    },
    {
      center: {
        type: 'vec3',
        data: [-1.1, 2 + Math.cos(performance.now() / 800), -8]
      }
    }
  ]);
  gl.render();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
