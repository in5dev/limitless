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

export function random(min?: number, max?: number): number {
  if (!min) return Math.random();
  if (!max) return Math.random() * min;
  const Min = Math.min(min, max);
  return (Math.max(min, max) - Min) * Math.random() + Min;
}

export function randomInt(min?: number, max?: number): number {
  return Math.floor(random(min, max));
}

export function degrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
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
