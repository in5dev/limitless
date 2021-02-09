import Matrix from './mat';

type Mat2 = [number, number, number, number];

export default class Matrix2 extends Matrix {
  constructor(matrix?: Mat2) {
    super(4);
    if (matrix) this.set(matrix);
    else this.identity();
  }

  toString(): string {
    return `mat2 [
  ${this[0]} ${this[1]}
  ${this[2]} ${this[3]}
]`;
  }

  copy(): Matrix2 {
    return mat2([...this] as Mat2);
  }

  set(m: Matrix2 | Mat2): this {
    for (let i = 0; i < 4; i++) {
      this[i] = m[i];
    }
    return this;
  }

  identity(): this {
    return this.set([1, 0, 0, 1]);
  }

  equals(m: Matrix2 | Mat2): boolean {
    for (let i = 0; i < 4; i++) {
      if (this[i] !== m[i]) return false;
    }
    return true;
  }

  add(m: Matrix2 | Mat2): this {
    for (let i = 0; i < 4; i++) {
      this[i] += m[i];
    }
    return this;
  }

  sub(m: Matrix2 | Mat2): this {
    for (let i = 0; i < 4; i++) {
      this[i] -= m[i];
    }
    return this;
  }

  mult(m: Matrix2 | Mat2 | number): this {
    return this.set(Matrix2.mult(this, m));
  }
  static mult(m1: Matrix2 | Mat2, m2: Matrix2 | Mat2 | number): Matrix2 {
    if (typeof m2 === 'number') {
      const ans = mat2();
      for (let i = 0; i < 4; i++) {
        ans[i] *= m2;
      }
      return ans;
    }
    const [a0, a1, a2, a3] = m1;
    const [b0, b1, b2, b3] = m2;
    return mat2([
      a0 * b0 + a1 * b2,
      a0 * b1 + a1 * b3,
      a2 * b0 + a3 * b2,
      a2 * b1 + a3 * b3
    ]);
  }

  div(m: number): this {
    return this.mult(1 / m);
  }

  transpose(): this {
    [this[1], this[2]] = [this[2], this[1]];
    return this;
  }

  det(): number {
    const [a, b, c, d] = this;
    return a * d - b * c;
  }

  adj(): Matrix2 {
    const [a, b, c, d] = this;
    return mat2([d, -b, -c, a]);
  }

  inverse(): Matrix2 {
    return this.adj().div(this.det());
  }
}

export function mat2(matrix?: Mat2): Matrix2 {
  return new Matrix2(matrix);
}
