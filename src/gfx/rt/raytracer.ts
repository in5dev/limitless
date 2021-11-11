import GL from '../gl';
import fragmentSource from './shader.frag?raw';
import type Camera from './camera';
import type Sphere from './sphere';

export default class RayTracer {
  private onResize: () => void;
  private passes = 0;
  private animateHandle = NaN;

  constructor(public gl: GL, public camera: Camera) {
    this.onResize = () =>
      gl.uniform('resolution', 'vec2', [
        gl.gl.drawingBufferWidth,
        gl.gl.drawingBufferHeight
      ]);
    this.onResize();
    window.addEventListener('resize', this.onResize);
    gl.uniform('camera', 'struct', {
      origin: { type: 'vec3', data: camera.origin.toArray() },
      direction: { type: 'vec3', data: camera.direction.toArray() },
      fov: { type: 'float', data: camera.fov }
    });
    gl.createScreenTexture();
  }

  add(...spheres: Sphere[]) {
    this.gl.uniform(
      'spheres',
      'struct[]',
      spheres.map(
        ({
          position,
          radius,
          color,
          material: { reflectionType, indexOfRefraction, emission }
        }) =>
          ({
            center: { type: 'vec3', data: position.toArray() },
            radius: { type: 'float', data: radius },
            color: { type: 'vec3', data: color.toArray() },
            material: {
              type: 'struct',
              data: {
                reflectionType: { type: 'int', data: reflectionType },
                indexOfRefraction: { type: 'float', data: indexOfRefraction },
                emission: { type: 'vec3', data: emission.toArray() }
              }
            }
          } as const)
      )
    );
  }

  render() {
    const { gl } = this;
    gl.uniform('time', 'float', performance.now() / 1000);
    gl.uniform('passes', 'float', this.passes++);
    gl.render();

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
  }

  animate(frames = Infinity) {
    let i = 0;
    const fn = () => {
      this.render();
      if (++i < frames) this.animateHandle = requestAnimationFrame(fn);
    };
    this.animateHandle = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(this.animateHandle);
  }

  remove() {
    this.gl.remove();
    cancelAnimationFrame(this.animateHandle);
    window.removeEventListener('resize', this.onResize);
  }
}

export async function create(camera: Camera) {
  const gl = await GL.fullscreen(fragmentSource);
  const tracer = new RayTracer(gl, camera);
  return tracer;
}
