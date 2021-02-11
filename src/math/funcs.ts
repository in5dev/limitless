/* eslint-disable no-multi-assign */
export function norm(n: number, min: number, max: number): number {
  return (n - min) / (max - min);
}

export function lerp(min: number, max: number, norm: number): number {
  return min + (max - min) * norm;
}

export function map(
  n: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  return lerp(toMin, toMax, norm(n, fromMin, fromMax));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function overlap(
  min1: number,
  max1: number,
  min2: number,
  max2: number
): number {
  [min1, max1] = minmax(min1, max1);
  [min2, max2] = minmax(min2, max2);
  const range1 = max1 - min1;
  const range2 = max2 - min2;
  const range = Math.max(max1, max2) - Math.min(min1, min2);
  return range1 + range2 - range;
}

export function minmax(a: number, b: number): [min: number, max: number] {
  return [Math.min(a, b), Math.max(a, b)];
}

export function random(min?: number, max?: number): number {
  if (!min) return Math.random();
  if (!max) return Math.random() * min;
  const Min = Math.min(min, max);
  return (Math.max(min, max) - Min) * Math.random() + Min;
}

export function randomInt(min?: number, max?: number): number {
  return Math.floor(random(min, max));
}

export function factorial(n: number): number {
  let total = 1;
  for (let i = n; i > 1; i--) {
    total *= i;
  }
  return total;
}

export function fibonacci(n: number): number {
  let i = 0;
  let a = 0;
  let b = 1;
  for (; i < n; i++) {
    [a, b] = [b, b + a];
  }
  return a;
}
