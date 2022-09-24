import type { IndexBuffer, VertexBuffer } from './buffer.js';
import type Program from './program.js';

export default class VertexArrayObject {
  private vao: WebGLVertexArrayObject;
  private count = 0;

  constructor(
    private gl: WebGL2RenderingContext,
    program: Program,
    private mode: GLenum,
    private attributes: Record<string, VertexBuffer>,
    private indexBuffer?: IndexBuffer
  ) {
    const vao = gl.createVertexArray();
    if (!vao) throw new Error('Failed to create vertex array object');
    this.vao = vao;

    this.bind();
    this.create(program);
    this.unbind();
  }

  bind(): void {
    this.gl.bindVertexArray(this.vao);
  }

  create(program: Program): void {
    Object.entries(this.attributes).forEach(([name, buffer]) => {
      buffer.bind();
      const attribLocation = program.getAttributeLocation(name);
      buffer.enable(attribLocation);
      this.count = buffer.count;
    });
    this.indexBuffer?.bind();
  }

  render(): void {
    this.bind();
    const { gl, indexBuffer, mode } = this;
    if (indexBuffer) {
      gl.drawElements(mode, indexBuffer.count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(mode, 0, this.count);
    }
  }

  unbind(): void {
    this.gl.bindVertexArray(null);
  }
}
