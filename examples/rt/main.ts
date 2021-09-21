import GL from '../../src/gfx/gl';
import { Sphere, ReflectionType, Camera } from '../../src/gfx/rt';
import { vec3 } from '../../src/math';
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

const camera = new Camera(vec3(50, 52, 295.6), vec3(0, -0.042612, -1), 0.5135);
gl.uniform('camera', 'struct', {
  origin: { type: 'vec3', data: camera.origin.toArray() },
  direction: { type: 'vec3', data: camera.direction.toArray() },
  fov: { type: 'float', data: camera.fov }
});
const spheres = [
  new Sphere(
    vec3(1e4 + 1, 40.8, 81.6),
    1e4,
    vec3(0.75, 0.25, 0.25),
    ReflectionType.DIFFUSE
  ), // Left
  new Sphere(
    vec3(-1e4 + 99, 40.8, 81.6),
    1e4,
    vec3(0.25, 0.25, 0.75),
    ReflectionType.DIFFUSE
  ), // Right
  new Sphere(
    vec3(50, 40.8, 1e4),
    1e4,
    vec3(0.75, 0.75, 0.75),
    ReflectionType.DIFFUSE
  ), // Back
  new Sphere(
    vec3(50, 40.8, -1e4 + 170),
    1e4,
    vec3(1, 0, 1),
    ReflectionType.DIFFUSE
  ), // Front
  new Sphere(
    vec3(50, 1e4, 81.6),
    1e4,
    vec3(0.75, 0.75, 0.75),
    ReflectionType.DIFFUSE
  ), // Bottom
  new Sphere(
    vec3(50, -1e4 + 81.6, 81.6),
    1e4,
    vec3(0.75, 0.75, 0.75),
    ReflectionType.DIFFUSE
  ), // Top
  new Sphere(vec3(27, 16.5, 47), 16.5, vec3(1, 1, 1), ReflectionType.SPECULAR), // Mirror
  new Sphere(
    vec3(73, 16.5, 78),
    16.5,
    vec3(1, 1, 1),
    ReflectionType.REFRACTIVE
  ), // Glass
  new Sphere(
    vec3(50, 681.6 - 0.27, 81.6),
    600,
    vec3(),
    ReflectionType.DIFFUSE,
    vec3(12, 12, 12)
  ) // Light
];
gl.uniform(
  'spheres',
  'struct[]',
  spheres.map(
    ({ position, radius, color, reflectionType, emission }) =>
      ({
        center: { type: 'vec3', data: position.toArray() },
        radius: { type: 'float', data: radius },
        color: { type: 'vec3', data: color.toArray() },
        reflectionType: { type: 'int', data: reflectionType },
        emission: { type: 'vec3', data: emission.toArray() }
      } as const)
  )
);

gl.createScreenTexture();

let passes = 0;
let frames = 0;
function render() {
  gl.uniform('time', 'float', performance.now() / 1000);
  gl.uniform('passes', 'float', passes);
  gl.render();

  if (++passes > 1000) {
    return;
    gl.gl.texImage2D(
      gl.gl.TEXTURE_2D,
      0,
      gl.gl.RGBA,
      gl.gl.drawingBufferWidth,
      gl.gl.drawingBufferHeight,
      0,
      gl.gl.RGBA,
      gl.gl.UNSIGNED_BYTE,
      null
    );
    gl.uniform(
      'spheres[8].center',
      'vec3',
      vec3(50 + Math.sin(++frames / 5) * 50, 681.6 - 0.27, 81.6).toArray()
    );
    passes = 0;
  }
  const pixels = new Uint8Array(
    gl.gl.drawingBufferWidth * gl.gl.drawingBufferHeight * 4
  );
  gl.gl.readPixels(
    0,
    0,
    gl.gl.drawingBufferWidth,
    gl.gl.drawingBufferHeight,
    gl.gl.RGBA,
    gl.gl.UNSIGNED_BYTE,
    pixels
  );
  gl.gl.texImage2D(
    gl.gl.TEXTURE_2D,
    0,
    gl.gl.RGBA,
    gl.gl.drawingBufferWidth,
    gl.gl.drawingBufferHeight,
    0,
    gl.gl.RGBA,
    gl.gl.UNSIGNED_BYTE,
    pixels
  );
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
