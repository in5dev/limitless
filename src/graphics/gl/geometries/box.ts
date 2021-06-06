import { IndexBuffer, Program, VertexArrayObject, VertexBuffer } from '../core';
import type Geometry from './geometry';

export default class Box implements Geometry {
  private vao: VertexArrayObject;

  constructor(gl: WebGL2RenderingContext, program: Program) {
    const positions = [
      // x, y, z
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1]
    ];
    const normals = [
      // x, y, z
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1]
    ];
    const indices = [
      // Left -x
      [6, 4, 2, 2, 4, 0],
      // Right +x
      [3, 1, 7, 7, 1, 5],
      // Bottom -y
      [0, 4, 1, 1, 4, 5],
      // Top +y
      [6, 2, 7, 7, 2, 3],
      // Back -z
      [7, 5, 6, 6, 5, 4],
      // Front +z
      [2, 0, 3, 3, 0, 1]
    ].flat() as unknown as number[];

    const vao = new VertexArrayObject(
      gl,
      program,
      gl.TRIANGLES,
      {
        position: new VertexBuffer(gl, positions),
        normal: new VertexBuffer(gl, normals)
      },
      new IndexBuffer(gl, indices)
    );

    this.vao = vao;
  }

  render(): void {
    this.vao.render();
  }
}
