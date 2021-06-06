import type { IndexBuffer, VertexBuffer } from './buffer';
import type Program from './program';

export default class VertexArrayObject {
  private vao: WebGLVertexArrayObject;

  constructor(
    private gl: WebGL2RenderingContext,
    program: Program,
    private mode: GLenum,
    private attributes: Record<string, VertexBuffer>,
    private indexBuffer: IndexBuffer
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
    });
    this.indexBuffer.bind();
  }

  render(): void {
    this.bind();
    this.gl.drawElements(
      this.mode,
      this.indexBuffer.count,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  unbind(): void {
    this.gl.bindVertexArray(null);
  }
}
