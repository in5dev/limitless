export function quadratic(a: number, b: number, c: number): [number, number] {
  const plusminus = Math.sqrt(b ** 2 - 4 * a * c);
  return [(-b + plusminus) / (2 * a), (-b - plusminus) / (2 * a)];
}

export const sphere = {
  area: (radius: number): number => 4 * Math.PI * radius ** 2,
  volume: (radius: number): number => (4 / 3) * Math.PI * radius ** 3
};
