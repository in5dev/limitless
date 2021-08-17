/* eslint-disable @typescript-eslint/no-non-null-assertion */

if ([0][-1] !== 0)
  // eslint-disable-next-line no-extend-native
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

export function* zip<T, U>(arr1: T[], arr2: U[]): Generator<[T, U]> {
  const length = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < length; i++) {
    yield [arr1[i]!, arr2[i]!];
  }
}

export function swap<T>(arr: T[], i: number, j: number): T[] {
  [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  return arr;
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = 0, { length } = arr; i < length; i++) {
    const j = randomInt(i, length);
    swap(arr, i, j);
  }
  return arr;
}

export function remove<T>(this: T[], item: T): boolean {
  const index = this.indexOf(item);
  if (index === -1) return false;
  this.splice(index, 1);
  return true;
}

export function unorderedRemove<T>(arr: T[], index: number): T[] {
  swap(arr, index, arr.length - 1);
  arr.pop();
  return arr;
}

export function min(arr: number[]): number {
  let min = Infinity;
  arr.forEach(x => {
    if (x < min) min = x;
  });
  return min;
}

export function max(arr: number[]): number {
  let max = -Infinity;
  arr.forEach(x => {
    if (x > max) max = x;
  });
  return max;
}

export function sum(arr: number[]): number {
  return arr.reduce((sum, cur) => sum + cur, 0);
}

export function mean(arr: number[]): number {
  const { length } = arr;
  if (!length) return 0;
  return sum(arr) / length;
}

export const average = mean;

export function median(arr: number[]): number {
  const { length } = arr;
  if (!length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  if (length % 2) return sorted[length / 2]!;
  return (sorted[length / 2 - 1]! + sorted[length / 2]!) / 2;
}

export function mode(arr: number[]): number[] {
  const counts: Record<number, number> = {};
  arr.forEach(n => (counts[n] ? counts[n]++ : (counts[n] = 1)));
  const sortedCounts = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  const sortedNumbers = sortedCounts.map(n => n[1]);
  return sortedNumbers.filter(n => n === sortedCounts[0]![1]);
}

export function range(arr: number[]): number {
  return max(arr) - min(arr);
}

export function variance(arr: number[]): number {
  const m = mean(arr);
  return mean(arr.map(n => (n - m) ** 2));
}

export function stddev(arr: number[]): number {
  return Math.sqrt(variance(arr));
}

export function meanAbsDev(arr: number[]): number {
  const m = mean(arr);
  return mean(arr.map(n => n - m));
}

function randomInt(min: number, max?: number): number {
  if (!max) return Math.floor(Math.random() * min);
  const Min = Math.min(min, max);
  return Math.floor((Math.max(min, max) - Min) * Math.random() + Min);
}
