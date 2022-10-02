// deno-lint-ignore-file no-explicit-any
export const pause = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export function benchmark(func: () => any, iterations = 1_000_000): number {
  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    func();
  }
  const endTime = performance.now();
  return (endTime - startTime) / iterations;
}
