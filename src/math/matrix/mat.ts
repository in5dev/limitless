export default abstract class Matrix {
  [i: number]: number[];
  abstract readonly size: number;

  abstract toString(): string;

  log(): this {
    console.log(this.toString());
    return this;
  }

  abstract identity(): this;

  abstract set(m: this): this;

  abstract equals(m: this): boolean;

  map(func: (value: number, i: number, j: number) => void): void {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        func(this[i][j], i, j);
      }
    }
  }

  abstract add(m: this): this;

  abstract sub(m: this): this;

  abstract mult(m: this): this;
}
