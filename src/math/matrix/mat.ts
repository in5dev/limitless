export default abstract class Matrix implements Iterable<number> {
  [i: number]: number;

  constructor(readonly size: number) {}

  abstract toString(): string;

  log(): this {
    console.log(this.toString());
    return this;
  }

  *[Symbol.iterator](): Iterator<number> {
    for (let i = 0; i < this.size; i++) {
      yield this[i];
    }
  }
}
