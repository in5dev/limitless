import { IndexBuffer, Program, VertexArrayObject, VertexBuffer } from '../core';
import type Geometry from './geometry';

export default class Box implements Geometry {
  private vao: VertexArrayObject;

  constructor(gl: WebGL2RenderingContext, program: Program) {
    const vertices = [
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
    const positions = [
      // Left -x
      [6, 2, 4, 0],
      // Right +x
      [3, 7, 1, 5],
      // Bottom -y
      [0, 1, 4, 5],
      // Top +y
      [6, 7, 2, 3],
      // Back -z
      [2, 3, 0, 1],
      // Front +z
      [7, 6, 5, 4]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ].flatMap(posIndices => posIndices.map(posI => vertices[posI]!));
    const normals = [
      // Left -x
      [-1, 0, 0],
      // Right +x
      [1, 0, 0],
      // Bottom -y
      [0, -1, 0],
      // Top +y
      [0, 1, 0],
      // Back -z
      [0, 0, -1],
      // Front +z
      [0, 0, 1]
    ].flatMap(normal => [normal, normal, normal, normal]);
    const indices: number[] = [];
    for (let i = 0; i < 24; i += 4) {
      indices.push(...[0, 2, 1, 1, 2, 3].map(n => n + i));
    }

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
