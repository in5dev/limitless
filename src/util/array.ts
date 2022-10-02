// deno-lint-ignore-file no-explicit-any
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const length = Math.min(arr1.length, arr2.length);
  const arr = new Array<[T, U]>(length);
  for (let i = 0; i < length; i++) {
    arr[i] = [arr1[i]!, arr2[i]!];
  }
  return arr;
}

export function unzip<T, U>(arr: [T, U][]): [T[], U[]] {
  const arr1 = new Array<T>(arr.length);
  const arr2 = new Array<U>(arr.length);
  arr.forEach(([a, b], i) => {
    arr1[i] = a;
    arr2[i] = b;
  });
  return [arr1, arr2];
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

export function remove<T>(arr: T[], item: T): boolean {
  const index = arr.indexOf(item);
  if (index === -1) return false;
  arr.splice(index, 1);
  return true;
}

export function unorderedRemove<T>(arr: T[], index: number): T[] {
  swap(arr, index, arr.length - 1);
  arr.pop();
  return arr;
}

export function chunk<T>(arr: ConcatArray<T>, size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item));
}

export function union<T>(arr1: T[], arr2: T[]): T[] {
  return [...arr1, ...arr2.filter(item => !arr1.includes(item))];
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

export function range(max: number): Generator<number>;
export function range(
  min: number,
  max: number,
  step?: number
): Generator<number>;
export function range(max: number): number;
export function* range(
  minOrMaxOrArr: number | number[],
  maxValue?: number,
  step = 1
): number | Generator<number> {
  if (Array.isArray(minOrMaxOrArr))
    return max(minOrMaxOrArr) - min(minOrMaxOrArr);
  if (maxValue !== undefined) {
    const absStep = Math.abs(step);
    if (maxValue > minOrMaxOrArr) {
      for (let i = 0; i <= maxValue; i += absStep) {
        yield i;
      }
    } else {
      for (let i = maxValue; i >= minOrMaxOrArr; i -= absStep) {
        yield i;
      }
    }
  }
  return range(0, minOrMaxOrArr);
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

export function pick<T>(arr: T[], numItems: number): T[] {
  if (!arr.length || !numItems) return [];
  return new Array(numItems).fill(0).map(() => arr[randomInt(arr.length)]!);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arraysEqual(a: ArrayLike<any>, b: ArrayLike<any>): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function dedupe<T extends { [K in keyof T]: T[K] }>(
  array: readonly T[],
  key: keyof T
): T[] {
  const arr = [...array];
  const values = new Set<string>();
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i]!;
    const value = item[key];
    if (values.has(value)) arr.splice(i, 1);
    else values.add(value);
  }
  return arr;
}

function randomInt(min: number, max?: number): number {
  if (!max) return Math.floor(Math.random() * min);
  const Min = Math.min(min, max);
  return Math.floor((Math.max(min, max) - Min) * Math.random() + Min);
}
