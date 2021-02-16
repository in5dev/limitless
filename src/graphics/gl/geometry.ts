import type { Vector2 } from '../../math';
import { Buffer } from './buffer';

export class Points {
  private buffer: Buffer;
  private length: number;

  constructor(
    private gl: WebGL2RenderingContext,
    attribLocation: GLuint,
    points: Vector2[]
  ) {
    const data = new Float32Array(points.length * 2);
    points.forEach(({ x, y }, i) => {
      data[i] = x;
      data[i + 1] = y;
    });
    this.length = points.length;

    // eslint-disable-next-line no-buffer-constructor
    const buffer = new Buffer(gl, data);
    buffer.create(attribLocation, 2, gl.FLOAT, 0, 0);
    this.buffer = buffer;
  }

  render(): void {
    const { gl, buffer, length } = this;
    buffer.bind();
    gl.drawArrays(gl.POINTS, 0, length);
  }
}
