import Matrix from './mat';
import { mat3 } from './mat3';

type Vec4 = [number, number, number, number];
type Mat4 = [...Vec4, ...Vec4, ...Vec4, ...Vec4];

export default class Matrix4 extends Matrix {
  constructor(matrix?: Mat4) {
    super(16);
    if (matrix) this.set(matrix);
    else this.identity();
  }

  toString(): string {
    return `Mat4 [
  ${this[0]} ${this[1]}
  ${this[2]} ${this[3]}
]`;
  }

  copy(): Matrix4 {
    return mat4([...this] as Mat4);
  }

  set(m: Matrix4 | Mat4): this {
    for (let i = 0; i < 16; i++) {
      this[i] = m[i];
    }
    return this;
  }

  identity(): this {
    return this.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  equals(m: Matrix4 | Mat4): boolean {
    for (let i = 0; i < 16; i++) {
      if (this[i] !== m[i]) return false;
    }
    return true;
  }

  add(m: Matrix4 | Mat4): this {
    for (let i = 0; i < 16; i++) {
      this[i] += m[i];
    }
    return this;
  }

  sub(m: Matrix4 | Mat4): this {
    for (let i = 0; i < 16; i++) {
      this[i] -= m[i];
    }
    return this;
  }

  mult(m: Matrix4 | Mat4 | number): this {
    return this.set(Matrix4.mult(this, m));
  }
  static mult(m1: Matrix4 | Mat4, m2: Matrix4 | Mat4 | number): Matrix4 {
    if (typeof m2 === 'number') {
      const ans = mat4();
      for (let i = 0; i < 16; i++) {
        ans[i] *= m2;
      }
      return ans;
    }
    // const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = m1;
    // const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = m2;
    return mat4();
  }

  div(m: number): this {
    return this.mult(1 / m);
  }

  transpose(): this {
    [this[1], this[2]] = [this[2], this[1]];
    return this;
  }

  det(): number {
    const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this;
    return (
      a * mat3([f, g, h, j, k, l, n, o, p]).det() -
      b * mat3([e, g, h, i, k, l, m, o, p]).det() +
      c * mat3([e, f, h, i, j, l, m, n, p]).det() -
      d * mat3([e, f, g, i, j, k, m, n, o]).det()
    );
  }

  adj(): Matrix4 {
    const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this;
    return mat4([
      a * mat3([f, g, h, j, k, l, n, o, p]).det(),
      -b * mat3([e, g, h, i, k, l, m, o, p]).det(),
      c * mat3([e, f, h, i, j, l, m, n, p]).det(),
      -d * mat3([e, f, g, i, j, k, m, n, o]).det(),
      -e * mat3([b, c, d, j, k, l, n, o, p]).det(),
      f * mat3([a, c, d, i, k, l, m, o, p]).det(),
      -g * mat3([a, b, d, i, j, l, m, n, p]).det(),
      h * mat3([a, b, c, i, j, k, m, n, o]).det(),
      i * mat3([b, c, d, f, g, h, n, o, p]).det(),
      -j * mat3([a, c, d, e, g, h, m, o, p]).det(),
      k * mat3([a, b, d, e, f, h, m, n, p]).det(),
      -l * mat3([a, b, c, e, f, g, m, n, o]).det(),
      -m * mat3([b, c, d, f, g, h, j, k, l]).det(),
      n * mat3([a, c, d, e, g, h, i, k, l]).det(),
      -o * mat3([a, b, d, e, f, h, i, j, l]).det(),
      p * mat3([a, b, c, e, f, g, i, j, k]).det()
    ]).transpose();
  }

  inverse(): Matrix4 {
    return this.adj().div(this.det());
  }
}

export function mat4(matrix?: Mat4): Matrix4 {
  return new Matrix4(matrix);
}
