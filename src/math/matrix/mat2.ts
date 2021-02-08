import Matrix from './mat';

type Vec2 = [number, number];
type Mat2 = [Vec2, Vec2];

export default class Matrix2 extends Matrix {
  size = 2;

  constructor(matrix?: Mat2) {
    super();
    if (matrix) this.set(matrix);
    else this.identity();
  }

  toString(): string {
    return `mat2 [
  ${this[0][0]} ${this[0][1]}
  ${this[1][0]} ${this[1][1]}
]`;
  }

  identity(): this {
    this[0] = [1, 0];
    this[1] = [0, 1];
    return this;
  }

  set(m: Matrix2 | Mat2): this {
    // eslint-disable-next-line prefer-destructuring
    this[0] = m[0];
    // eslint-disable-next-line prefer-destructuring
    this[1] = m[1];
    return this;
  }

  equals(m: Matrix2 | Mat2): boolean {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (this[i][j] !== m[i][j]) return false;
      }
    }
    return true;
  }

  add(m: Matrix2 | Mat2): this {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        this[i][j] += m[i][j];
      }
    }
    return this;
  }

  sub(m: Matrix2 | Mat2): this {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        this[i][j] -= m[i][j];
      }
    }
    return this;
  }

  mult(m: Matrix2 | Mat2): this {
    return this.set(Matrix2.mult(this, m));
  }
  static mult(m1: Matrix2 | Mat2, m2: Matrix2 | Mat2): Matrix2 {
    const ans = mat2();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let sum = 0;
        for (let k = 0; k < 2; k++) {
          sum += m1[i][k] * m2[k][j];
        }
        ans[i][j] = sum;
      }
    }
    return ans;
  }
}

export function mat2(matrix?: Mat2): Matrix2 {
  return new Matrix2(matrix);
}
