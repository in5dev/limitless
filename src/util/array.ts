/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable func-names */

import { randomInt } from '../math/funcs';

declare global {
  interface Array<T> {
    [-1]: T;
    copy(): T[];
    random(): T;
    swap(i: number, j: number): this;
    shuffle(): this;
    remove(item: T): boolean;
    unorderedRemove(index: number): this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T extends number> {
    min(): number;
    max(): number;
    minmax(): [min: number, max: number];
    sum(): number;
    mean(): number;
    average(): number;
    median(): number;
    mode(): number[];
    range(): number;
    variance(): number;
    stddev(): number;
    meanAbsDev(): number;
  }
}

Object.defineProperty(Array.prototype, -1, {
  get<T>(this: T[]) {
    const { length } = this;
    if (!length) return undefined;
    return this[length - 1];
  },
  set<T>(this: T[], value: T): void {
    const { length } = this;
    if (!length) this[0] = value;
    else this[this.length - 1] = value;
  }
});

Array.prototype.copy = function <T>(this: T[]): T[] {
  return [...this];
};

Array.prototype.random = function <T>(this: T[]): T {
  const index = randomInt(this.length);
  return this[index]!;
};

Array.prototype.swap = function <T>(this: T[], i: number, j: number): T[] {
  [this[i], this[j]] = [this[j]!, this[i]!];
  return this;
};

Array.prototype.shuffle = function <T>(this: T[]): T[] {
  for (let i = 0, { length } = this; i < length; i++) {
    const j = randomInt(i, length);
    this.swap(i, j);
  }
  return this;
};

Array.prototype.remove = function <T>(this: T[], item: T): boolean {
  const index = this.indexOf(item);
  if (index === -1) return false;
  this.splice(index, 1);
  return true;
};

Array.prototype.unorderedRemove = function <T>(this: T[], index: number): T[] {
  this.swap(index, this.length - 1);
  this.pop();
  return this;
};

Array.prototype.min = function (this: number[]): number {
  let min = Infinity;
  this.forEach(x => {
    if (x < min) min = x;
  });
  return min;
};

Array.prototype.max = function (this: number[]): number {
  let max = -Infinity;
  this.forEach(x => {
    if (x > max) max = x;
  });
  return max;
};

Array.prototype.minmax = function (this: number[]): [min: number, max: number] {
  let min = Infinity;
  let max = -Infinity;
  this.forEach(x => {
    if (x < min) min = x;
    if (x > max) max = x;
  });
  return [min, max];
};

Array.prototype.sum = function (this: number[]): number {
  return this.reduce((sum, cur) => sum + cur, 0);
};

Array.prototype.mean = function (this: number[]): number {
  const { length } = this;
  if (!length) return 0;
  return this.sum() / length;
};

Array.prototype.average = Array.prototype.mean;

Array.prototype.median = function (this: number[]): number {
  return this.mean();
};

Array.prototype.mode = function (this: number[]): number[] {
  const counts: Record<number, number> = {};
  this.forEach(n => (counts[n] ? counts[n]++ : (counts[n] = 1)));
  const sortedCounts = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  const sortedNumbers = sortedCounts.map(n => n[1]);
  return sortedNumbers.filter(n => n === sortedCounts[0]![1]);
};

Array.prototype.range = function (this: number[]): number {
  return this.max() - this.min();
};

Array.prototype.variance = function (this: number[]): number {
  const mean = this.mean();
  return this.map(n => (n - mean) ** 2).mean();
};

Array.prototype.stddev = function (this: number[]): number {
  return Math.sqrt(this.variance());
};

Array.prototype.meanAbsDev = function (this: number[]): number {
  const mean = this.mean();
  return this.map(n => n - mean).mean();
};

export {};
