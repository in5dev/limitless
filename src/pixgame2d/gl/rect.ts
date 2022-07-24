import { IndexBuffer, Program, VertexArrayObject, VertexBuffer } from './core';

export default class Rect {
  private vao: VertexArrayObject;

  constructor(gl: WebGL2RenderingContext, program: Program) {
    const positions = [
      // x, y
      [-0.5, -0.5],
      [0.5, -0.5],
      [-0.5, 0.5],
      [0.5, 0.5]
    ];
    const uvs = [
      // u, v
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ];
    const indices = [0, 2, 1, 1, 2, 3];

    const vao = new VertexArrayObject(
      gl,
      program,
      gl.TRIANGLES,
      {
        position: new VertexBuffer(gl, positions),
        uv: new VertexBuffer(gl, uvs)
      },
      new IndexBuffer(gl, indices)
    );

    this.vao = vao;
  }

  render(): void {
    this.vao.render();
  }
}
