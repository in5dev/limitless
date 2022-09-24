import { VertexBuffer } from '../core/index.js';
import type { Vector2 } from '../../../math/index.js';
import type Geometry from './geometry.js';

export default class Points implements Geometry {
  private buffer: VertexBuffer;
  private length: number;

  constructor(
    private gl: WebGL2RenderingContext,
    attribLocation: GLuint,
    points: Vector2[]
  ) {
    const data = points.map(({ x, y }) => [x, y]);
    this.length = points.length;

    const buffer = new VertexBuffer(gl, data);
    buffer.enable(attribLocation);
    this.buffer = buffer;
  }

  render(): void {
    const { gl, buffer, length } = this;
    buffer.bind();
    gl.drawArrays(gl.POINTS, 0, length);
  }
}
