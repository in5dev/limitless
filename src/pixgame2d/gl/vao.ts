import type { Buffer } from './buffer';
import type Program from './program';

export default class VertexArrayObject {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject;

  constructor(
    private program: Program,
    private attributes: Record<string, Buffer>
  ) {
    const { gl } = program;
    this.gl = gl;
    const vao = gl.createVertexArray();
    if (!vao) throw new Error('Error creating vertex array object');
    this.vao = vao;

    this.bind();
    this.create();
    this.unbind();
  }

  bind(): void {
    this.gl.bindVertexArray(this.vao);
  }

  create(): void {
    Object.entries(this.attributes).forEach(([name, buffer]) => {
      buffer.bind();
      const attribLocation = this.program.getAttributeLocation(name);
      buffer.create(attribLocation, 2, this.gl.FLOAT, 0, 0);
    });
  }

  render(mode: GLenum, count: GLsizei, offset: GLintptr): void {
    this.bind();
    this.gl.drawElements(mode, count, this.gl.FLOAT, offset);
  }

  unbind(): void {
    this.gl.bindVertexArray(null);
  }
}
