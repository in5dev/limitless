import type { Vector2 } from '../../math';
import { Buffer } from './buffer';

export class Points {
  private buffer: Buffer;

  constructor(private gl: WebGL2RenderingContext, points: Vector2[]) {
    const data = new Float32Array(points.length * 2);
    points.forEach(({ x, y }, i) => {
      data[i] = x;
      data[i + 1] = y;
    });

    // eslint-disable-next-line no-buffer-constructor
    const buffer = new Buffer(gl, data);
    this.buffer = buffer;
  }
}
